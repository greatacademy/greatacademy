// Grade 3: reading texts of facts: answering questions from a passage, reading a table, telling fiction from
// nonfiction, and reading a letter.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { labelChoice } from "../../topics/steps.ts";
import { type Ask, askGenerator, kinded, need, rows, topic } from "./kit.ts";

// Passages of four sentences: the sentences|a question and the place of the sentence that answers it|another such
// question|a question that the passage does not answer.

const passageRows = rows(`
  Camels live in hot, dry deserts.|They can walk for days without drinking water.|The hump on a camel's back stores fat, not water.|Wide, flat feet keep camels from sinking into the sand.|What does a camel's hump store?|2|Why don't camels sink into the sand?|3|How long do camels live?
  Penguins are birds that cannot fly.|They use their wings like flippers to swim fast underwater.|Most penguins live in the cold southern half of the world.|A thick layer of fat keeps them warm in icy water.|How do penguins use their wings?|1|What keeps penguins warm in icy water?|3|What do penguins eat?
  Bats are the only mammals that can truly fly.|Most bats sleep during the day and hunt at night.|Many of them find insects by making sounds and listening for echoes.|A single bat can eat hundreds of insects in an hour.|When do most bats hunt?|1|How do many bats find insects?|2|Where do bats build their homes?
  Honeybees live together in large groups called colonies.|The queen bee lays all the eggs.|Worker bees collect nectar from flowers and turn it into honey.|Bees do a special dance to tell others where to find food.|Which bee lays the eggs?|1|How do bees tell others where food is?|3|How far can a bee fly?
  An octopus has eight arms covered in suckers.|It can change the color of its skin to hide from enemies.|When it is in danger, it squirts a cloud of dark ink.|An octopus has no bones, so it can squeeze through tiny gaps.|Why does an octopus change color?|1|How can an octopus fit through tiny gaps?|3|How big can an octopus grow?
  Elephants are the largest animals that live on land.|An elephant uses its long trunk to drink, smell and pick up food.|Its big ears help it stay cool by letting heat escape.|Elephants live in family groups led by the oldest female.|What does an elephant use its trunk for?|1|Who leads an elephant family?|3|How much does an elephant eat in a day?
  A frog starts life as an egg in the water.|The egg hatches into a tadpole, which breathes with gills and swims with a tail.|Slowly the tadpole grows legs and loses its tail.|A grown frog can live on land and in water.|How does a tadpole breathe?|1|What happens to a tadpole's tail?|2|What color are most frogs?
  Owls hunt at night for mice and other small animals.|Their huge eyes help them see in very dim light.|Soft edges on their feathers let them fly almost without a sound.|An owl can turn its head much farther than a person can.|How do owls see in dim light?|1|Why can owls fly so quietly?|2|How long can an owl live?
  Giraffes are the tallest animals in the world.|Their long necks let them eat leaves high in the trees.|A giraffe's tongue is dark and can be as long as a ruler.|Giraffes sleep only a few minutes at a time.|Why do giraffes have long necks?|1|How long does a giraffe sleep at a time?|3|How fast can a giraffe run?
  Sea turtles spend almost all their lives in the ocean.|A mother turtle crawls onto a beach to lay her eggs in the sand.|When the babies hatch, they race to the water at night.|Some sea turtles swim thousands of miles each year.|Where does a mother sea turtle lay her eggs?|1|When do baby sea turtles race to the water?|2|What do sea turtles eat?
  Beavers have strong front teeth that never stop growing.|They cut down trees by gnawing through the trunks.|With the branches and mud, they build dams across streams.|The dam makes a pond where the beavers build their home.|How do beavers cut down trees?|1|What do beavers build dams with?|2|How heavy is a beaver?
  A butterfly tastes with its feet.|It drinks nectar from flowers through a long tube that curls up like a spring.|A butterfly's wings are covered with tiny scales.|Butterflies need the sun to warm their wings before they can fly.|What does a butterfly taste with?|0|Why does a butterfly need the sun?|3|How many eggs does a butterfly lay?
  Polar bears live on the sea ice near the North Pole.|Under their white fur, their skin is black, which helps soak up the sun's heat.|They are strong swimmers and hunt seals at holes in the ice.|A polar bear can smell a seal from far away.|What color is a polar bear's skin?|1|Where do polar bears hunt seals?|2|How many cubs does a polar bear have?
  Ants live in colonies that can have thousands of members.|They are very strong for their size and can carry many times their own weight.|Ants leave a trail of scent so that others can follow them to food.|Some ants keep tiny insects called aphids and drink the sweet liquid they make.|How do ants lead others to food?|2|How much can an ant carry?|1|How long does an ant live?
  Hummingbirds are the smallest birds in the world.|Their wings beat so fast that they make a humming sound.|They are the only birds that can fly backward.|A hummingbird must eat many times a day because it burns energy so quickly.|Where does the humming sound come from?|1|Why must a hummingbird eat so often?|3|Where do hummingbirds build their nests?
  Snakes have no legs, but they move easily by bending their bodies.|A snake smells the air with its forked tongue.|Snakes cannot chew, so they swallow their food whole.|As a snake grows, it sheds its old skin.|What does a snake use to smell the air?|1|Why do snakes swallow their food whole?|2|How many kinds of snakes are there?
`);

const passages = passageRows.map((row) => {
  const [s0 = "", s1 = "", s2 = "", s3 = "", q1 = "", i1 = "", q2 = "", i2 = "", q3 = ""] = need(row, 9);
  return { sentences: [s0, s1, s2, s3], asks: [[q1, Number(i1)] as const, [q2, Number(i2)] as const], unanswered: q3 };
});

const findBank: readonly Ask[] = passages.flatMap((p) =>
  p.asks.map(([question, place], k): Ask => {
    const other = p.asks[1 - k]?.[1] ?? 0;
    const third = [0, 1, 2, 3].find((i) => i !== place && i !== other) ?? 0;
    const right = p.sentences[place] ?? "";
    return {
      question: t(`Which sentence of the passage answers this question: “${question}”`, `文中哪一句回答了这个问题：“${question}”`),
      shown: p.sentences.join(" "),
      right,
      wrong: [p.sentences[other] ?? "", p.sentences[third] ?? ""],
      why: t(
        `The answer is in these words of the passage: “${right}” A reader can point to the sentence that answers a question.`,
        `答案就在文中的这句话里：“${right}” 读者可以指出回答问题的那一句。`,
      ),
      whyNot: [
        t(
          "That sentence answers a different question about the animal, not this one.",
          "这一句回答的是关于这种动物的另一个问题，而不是这个问题。",
        ),
        t("That sentence gives a fact, but not the fact the question asks for.", "这一句给出了一个事实，但不是问题要问的那个事实。"),
      ],
    };
  }),
);

const whichQuestionBank: readonly Ask[] = passages.flatMap((p) =>
  p.asks.map(([question, place], k): Ask => {
    const other = p.asks[1 - k]?.[0] ?? "";
    return {
      question: t("Which question does the sentence in bold answer?", "粗体的句子回答了哪个问题？"),
      shown: p.sentences.map((s, i) => (i === place ? `**${s}**` : s)).join(" "),
      right: question,
      wrong: [other, p.unanswered],
      why: t(
        `The sentence in bold gives the answer to “${question}” Its words tell exactly what the question asks.`,
        `粗体的句子给出了“${question}”的答案。它的词句正好说出了问题所问的内容。`,
      ),
      whyNot: [
        t(
          "Another sentence of the passage answers that question, not the sentence in bold.",
          "回答这个问题的是文中另一句话，而不是粗体的句子。",
        ),
        t(
          "The passage never answers that question; no sentence of it tells that fact.",
          "这篇短文根本没有回答这个问题；没有哪一句说到这个事实。",
        ),
      ],
    };
  }),
);

// Tables of weather: a town and its high and low temperatures in °C from Monday to Friday.

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
const dayZh: Record<string, string> = { Monday: "星期一", Tuesday: "星期二", Wednesday: "星期三", Thursday: "星期四", Friday: "星期五" };

const towns: readonly { name: string; temps: readonly (readonly [number, number])[] }[] = [
  {
    name: "Pine Valley",
    temps: [
      [18, 9],
      [21, 11],
      [15, 8],
      [12, 6],
      [17, 7],
    ],
  },
  {
    name: "Harbor Town",
    temps: [
      [24, 16],
      [22, 15],
      [26, 18],
      [28, 19],
      [23, 17],
    ],
  },
  {
    name: "Red Rock",
    temps: [
      [31, 19],
      [34, 21],
      [29, 18],
      [33, 20],
      [35, 22],
    ],
  },
  {
    name: "Maple Hill",
    temps: [
      [9, 2],
      [7, 1],
      [11, 4],
      [5, 0],
      [8, 3],
    ],
  },
];

const table = (town: (typeof towns)[number]) =>
  [
    `**Weather in ${town.name} this week**`,
    "",
    "| Day | High (°C) | Low (°C) |",
    "| --- | --- | --- |",
    ...town.temps.map(([hi, lo], i) => `| ${days[i]} | ${hi} | ${lo} |`),
  ].join("\n");

const deg = (n: number) => `${n} °C`;

const valueBank: readonly Ask[] = towns.flatMap((town) =>
  town.temps.flatMap(([hi, lo], i) => {
    const day = days[i] ?? "";
    const next = town.temps[(i + 1) % town.temps.length] ?? [0, 0];
    return (["high", "low"] as const).map((column): Ask => {
      const right = column === "high" ? hi : lo;
      const sameRow = column === "high" ? lo : hi;
      const sameColumn = column === "high" ? next[0] : next[1];
      const zhColumn = column === "high" ? "最高" : "最低";
      return {
        question: t(`What was the ${column} temperature on ${day}?`, `${dayZh[day]}的${zhColumn}气温是多少？`),
        shown: table(town),
        right: deg(right),
        wrong: [deg(sameRow), deg(sameColumn)],
        why: t(
          `Find the row for ${day} and the column for the ${column}: where they meet, the table says ${right} °C.`,
          `找到${dayZh[day]}那一行和${zhColumn}气温那一列：它们交汇的地方写着 ${right} °C。`,
        ),
        whyNot: [
          t(
            "That is in the right row, but in the wrong column: check the heading of the column.",
            "这在正确的行里，但在错误的列里：看看这一列的标题。",
          ),
          t(
            "That is in the right column, but in the row of another day: check the day.",
            "这在正确的列里，但在另一天的那一行：看看是哪一天。",
          ),
        ],
      };
    });
  }),
);

const compareBank: readonly Ask[] = towns.flatMap((town) =>
  [0, 1, 2, 3].flatMap((i): Ask[] => {
    const a = days[i] ?? "";
    const b = days[i + 1] ?? "";
    const ha = town.temps[i]?.[0] ?? 0;
    const hb = town.temps[i + 1]?.[0] ?? 0;
    const la = town.temps[i]?.[1] ?? 0;
    const lb = town.temps[i + 1]?.[1] ?? 0;
    const [warm, cool, hw, hc] = ha > hb ? [a, b, ha, hb] : [b, a, hb, ha];
    const diff = hw - hc;
    const lowDiff = Math.abs(la - lb);
    const wrongDiff = lowDiff === diff ? diff + 1 : lowDiff;
    return [
      {
        question: t(`Which day had the warmer high temperature, ${a} or ${b}?`, `${dayZh[a]}和${dayZh[b]}，哪一天的最高气温更高？`),
        shown: table(town),
        right: warm,
        wrong: [cool, "They were the same."],
        why: t(
          `${warm} had a high of ${hw} °C and ${cool} a high of ${hc} °C, and ${hw} is the greater number.`,
          `${dayZh[warm]}的最高气温是 ${hw} °C，${dayZh[cool]}是 ${hc} °C，${hw} 更大。`,
        ),
        whyNot: [
          t(
            "That day's high is the smaller of the two numbers in the High column.",
            "那一天的最高气温是“最高”这一列里两个数中较小的那个。",
          ),
          t(
            "The two highs are different numbers in the table, so the days were not the same.",
            "表中两天的最高气温是不同的数，所以不一样。",
          ),
        ],
      },
      {
        question: t(
          `How many degrees warmer was the high on ${warm} than on ${cool}?`,
          `${dayZh[warm]}的最高气温比${dayZh[cool]}高多少度？`,
        ),
        shown: table(town),
        right: `${diff} degrees`,
        wrong: [`${hw} degrees`, `${wrongDiff} degrees`],
        why: t(
          `Subtract the two highs: ${hw} − ${hc} = ${diff}, so ${warm} was ${diff} degrees warmer.`,
          `用两天的最高气温相减：${hw} − ${hc} = ${diff}，所以${dayZh[warm]}高 ${diff} 度。`,
        ),
        whyNot: [
          t(
            "That is the high on one day, not how far apart the two highs are; subtract them.",
            "这是其中一天的最高气温，而不是两天相差多少；要把它们相减。",
          ),
          t(
            "That compares the lows or is off; use the two numbers in the High column.",
            "这比较的是最低气温或者算错了；要用“最高”那一列的两个数。",
          ),
        ],
      },
    ];
  }),
);

// Fiction, nonfiction and poems: a short piece of text and its kind.

const kindLabels = {
  fiction: {
    zh: "虚构作品",
    why: [
      "It tells a made-up story, with characters and events that someone invented, such as talking animals or a hero with a problem.",
      "它讲的是编出来的故事，有人编造的角色和情节，比如会说话的动物或遇到难题的主人公。",
    ],
    not: [
      "Fiction tells a made-up story, but this gives no invented characters and events.",
      "虚构作品讲编出来的故事，但这段文字没有编造的角色和情节。",
    ],
  },
  nonfiction: {
    zh: "非虚构作品",
    why: [
      "It gives true facts about the real world, often with numbers, headings or words that explain.",
      "它给出关于真实世界的事实，常常有数字、标题或解释性的词句。",
    ],
    not: [
      "Nonfiction gives true facts about the real world, but this is not written to teach facts.",
      "非虚构作品给出关于真实世界的事实，但这段文字不是为了传授事实。",
    ],
  },
  "a poem": {
    zh: "诗",
    why: [
      "It is written in short lines, often with rhyme or rhythm, rather than in sentences that fill the page.",
      "它写成短短的诗行，常常押韵或有节奏，而不是写满整页的句子。",
    ],
    not: [
      "A poem is written in short lines, often with rhyme, but this runs on in sentences.",
      "诗是写成短行的，常常押韵，但这段文字是一句接一句连着写的。",
    ],
  },
} as const;

const kindLines = `
  Once upon a time, a rabbit named Hop wanted to touch the moon. Every night he jumped a little higher, until one night an owl offered him a ride.|fiction
  A rabbit's long ears help it hear danger from far away. Rabbits eat grass, clover and vegetables, and their teeth never stop growing.|nonfiction
  Hop, hop, little rabbit, / Nibble on the clover; / When the fox comes creeping, / Then the game is over.|a poem
  The dragon sneezed, and the whole castle shook. “Bless you!” called Princess Lin from the tower. “I think I'm allergic to knights,” the dragon said.|fiction
  The Komodo dragon is the largest lizard in the world. It lives on a few islands in Indonesia and can grow as long as a small car.|nonfiction
  Chapter 1: Max found a tiny door at the bottom of the garden wall. When he knocked, a voice inside said, “Who's there?”|fiction
  How to Plant a Seed: First, fill a pot with soil. Next, push the seed in about two centimeters deep. Then water it and set it in the sun.|nonfiction
  The wind is a giant / Who whistles through the trees; / He blows away my hat / And tickles all the seas.|a poem
  Volcanoes form where hot, melted rock rises from deep inside the earth. When it bursts out, it is called lava.|nonfiction
  Grandma's teapot could talk, but only on Tuesdays. Every Tuesday it told Mia a story about the places it had been.|fiction
  The heart is a muscle about the size of your fist. It pumps blood around your body all day and all night.|nonfiction
  Raindrops on the window, / Raindrops on the street, / Raindrops in the puddles / Splashing round my feet.|a poem
  Captain Ruby steered her ship toward the island on the map. “Treasure ahead!” shouted the parrot on her shoulder.|fiction
  In 1969, two astronauts walked on the Moon for the first time. They collected rocks and planted a flag.|nonfiction
  The little robot rolled into the kitchen and beeped sadly. It had broken Dad's favorite mug, and now it had to tell him.|fiction
  Glossary: A habitat is the place where an animal or plant naturally lives. A predator is an animal that hunts other animals.|nonfiction
  I have a little shadow / Who follows me all day; / He's tall when evening's coming / And short at noon in May.|a poem
  The tortoise and the hare agreed to race. The hare laughed and took a nap, but the tortoise kept going, step by step.|fiction
  Most spiders have eight eyes, but many of them cannot see very well. They feel the shaking of their webs to find their food.|nonfiction
  When Leo opened the old book, a tiny knight climbed out of the page and bowed. “At last,” said the knight, “someone to help me.”|fiction
  The Nile is one of the longest rivers in the world. It flows north through Africa into the Mediterranean Sea.|nonfiction
  Autumn leaves are falling, / Red and gold and brown; / Dancing in the sunlight, / Tumbling to the ground.|a poem
  The moon felt lonely in the sky, so it asked the stars to come out and play. One by one, they twinkled hello.|fiction
  Table of Contents: 1. What Is Weather? 2. Clouds and Rain 3. Wind 4. Storms. Index on page 32.|nonfiction
  Penguins cannot fly, but they are excellent swimmers. Some can dive deeper than a tall building is high.|nonfiction
  Pip the mouse packed a cracker and a raisin and set off to find the big cheese that lived, people said, on top of the hill.|fiction
  My puppy likes to run and play, / He chases sticks all through the day; / At night he curls up on my bed / And puts his paws beside my head.|a poem
  Honeybees make honey from nectar, a sweet juice found in flowers. One bee makes only a small spoonful of honey in its whole life.|nonfiction
  “I can fix anything,” said Grandpa's toolbox, and that night it jumped off the shelf and fixed the squeaky door all by itself.|fiction
  Earthquakes happen when huge pieces of the earth's crust slip past each other. The ground shakes, sometimes for less than a minute.|nonfiction
  The snow came down so softly / It didn't make a sound; / It tucked a quiet blanket / All over the ground.|a poem
  Once there was a cloud who was afraid of heights. Whenever it looked down at the ground, it started to rain.|fiction
  Your bones protect the soft parts of your body. Your skull keeps your brain safe, and your ribs guard your heart and lungs.|nonfiction
`;

// Purposes: what a reader wants|the right text|a text on the same subject of the wrong kind|a text of the right kind on
// another subject.

const purpose = kinded(
  ["Which text should this reader choose?", "这位读者应该选择哪个文本？"],
  (right) => [
    `The reader needs ${right}: it is the right kind of text for this purpose, and it is on the right subject.`,
    `读者需要的是 ${right}：对这个目的来说，它的种类合适，主题也对。`,
  ],
  [
    [
      "{wrong} is on the right subject, but it is the wrong kind of text for this purpose.",
      "{wrong} 主题对了，但对这个目的来说，文本的种类不对。",
    ],
    ["{wrong} is the right kind of text, but it is about a different subject.", "{wrong} 种类对了，但讲的是另一个主题。"],
  ],
);

const purposeBank: readonly Ask[] = rows(`
  Sam wants to find out what sharks eat.|*All About Sharks*, a book of facts|*Sammy the Shark Goes to School*, a story|*All About Whales*, a book of facts
  Lena wants a funny bedtime story about a dragon.|*The Dragon Who Hated Bedtime*, a story|*Real Dragons: The Komodo Lizard*, a book of facts|*The Pirate Who Hated Baths*, a story
  Omar needs to learn how volcanoes erupt for a report.|*How Volcanoes Work*, a book of facts|*The Volcano Who Sneezed*, a story|*How Rivers Work*, a book of facts
  Mia wants to read a made-up adventure about pirates.|*Captain Pip and the Hidden Map*, a story|*Real Pirates of Long Ago*, a book of facts|*Captain Pip and the Space Race*, a story set in space
  Ben wants facts about the planets for a poster.|*Our Solar System*, a book of facts|*Zoe's Trip to Planet Zoom*, a story|*Our Oceans*, a book of facts
  Ana wants to know how to care for a pet rabbit.|*Caring for Your Rabbit*, a guide of facts|*Hop and the Magic Carrot*, a story|*Caring for Your Goldfish*, a guide of facts
  Leo wants a story about a brave knight to read for fun.|*Sir Leo and the Dragon*, a story|*Castles and Knights: A True History*, a book of facts|*Sir Leo and the Lost Puppy*, a story about a dog
  Kim needs to find out when the first airplane flew.|*The History of Flight*, a book of facts|*The Airplane That Wanted to Swim*, a story|*The History of Trains*, a book of facts
  Diego wants to learn how bees make honey.|*Inside a Beehive*, a book of facts|*Buzzy Bee's Birthday*, a story|*Inside an Ant Nest*, a book of facts
  Rosa wants to enjoy a story about a talking cat.|*Whiskers Speaks Up*, a story|*Cats: Facts and Photos*, a book of facts|*The Talking Teapot*, a story
  Jamal needs facts about ancient Egypt for school.|*Life in Ancient Egypt*, a book of facts|*The Mummy Who Lost His Wrappings*, a story|*Life in Ancient Rome*, a book of facts
  Priya wants to know which foods keep teeth healthy.|*Healthy Teeth*, a book of facts|*The Tooth Fairy's Day Off*, a story|*Healthy Hearts*, a book of facts
  Hana wants a made-up story about a magic garden.|*The Garden That Grew at Night*, a story|*How to Grow Vegetables*, a book of facts|*The Library That Grew at Night*, a story
  Tom needs to learn the parts of a flower.|*Parts of a Plant*, a book of facts|*Daisy and the Rainbow Seed*, a story|*Parts of a Bicycle*, a book of facts
  Zoe wants to find out how big an elephant can grow.|*Elephants of Africa and Asia*, a book of facts|*Ellie the Elephant Learns to Dance*, a story|*Lions of Africa*, a book of facts
  Kenji wants an exciting made-up story about a lost robot.|*Robo Finds His Way Home*, a story|*How Robots Work*, a book of facts|*Lulu Finds Her Way Home*, a story about a cat
  Ella wants facts about how a caterpillar becomes a butterfly.|*From Caterpillar to Butterfly*, a book of facts|*The Very Sleepy Caterpillar*, a story|*From Tadpole to Frog*, a book of facts
  Max wants to know how to build a birdhouse.|*Build Your Own Birdhouse*, a how-to book|*The Bird Who Built a Castle*, a story|*Build Your Own Kite*, a how-to book
  Lily wants to read a story about a girl who travels in time.|*Nina and the Time Machine*, a story|*Clocks and Calendars Through History*, a book of facts|*Nina and the Giant Beanstalk*, a story
  Hugo needs to find out how much rain fell in a desert last year.|*Deserts of the World*, a book of facts|*The Cactus Who Wanted Rain*, a story|*Rainforests of the World*, a book of facts
  Nadia wants facts about the Great Wall of China.|*The Great Wall: A True History*, a book of facts|*The Dragon Who Guarded the Wall*, a story|*The Pyramids: A True History*, a book of facts
  Wen wants a made-up tale about a clever fox.|*Fox Outsmarts the Farmer*, a story|*Foxes in the Wild*, a book of facts|*Owl Outsmarts the Mouse*, a story
  Clara needs to learn how magnets work.|*The Science of Magnets*, a book of facts|*Maggie the Magnet Makes a Friend*, a story|*The Science of Sound*, a book of facts
  Pablo wants to find out which instruments are in an orchestra.|*Instruments of the Orchestra*, a book of facts|*The Tuba Who Couldn't Stop Laughing*, a story|*Tools of the Kitchen*, a book of facts
  Ivy wants a funny story about a snowman to read for fun.|*Frosty Loses His Nose*, a story|*How Snow Forms*, a book of facts|*Sunny Loses His Hat*, a story about summer
  Theo needs to know how long the Nile River is.|*Rivers of Africa*, a book of facts|*The River That Ran Away*, a story|*Mountains of Africa*, a book of facts
  Lucia wants to learn how to make a paper boat.|*Paper Folding for Beginners*, a how-to book|*The Paper Boat's Long Voyage*, a story|*Painting for Beginners*, a how-to book
  Coral wants a made-up story about a mermaid's adventure.|*Marina and the Sunken Ship*, a story|*Life on a Coral Reef*, a book of facts|*Marina and the Mountain Goat*, a story on a mountain
  Sara needs facts about how the heart works.|*Your Amazing Heart*, a book of facts|*The Heart Who Went on Holiday*, a story|*Your Amazing Eyes*, a book of facts
  Ruby wants to know what a map key is for.|*How to Read a Map*, a book of facts|*The Map That Led to Nowhere*, a story|*How to Read a Clock*, a book of facts
  Felix wants a story about a hamster who runs a bakery.|*Hammy's Bakery*, a story|*Keeping a Pet Hamster*, a book of facts|*Hammy's Fire Station*, a story
  Jun needs to learn why the Moon seems to change shape.|*The Moon and Its Phases*, a book of facts|*The Moon Who Lost Her Smile*, a story|*The Sun and Its Heat*, a book of facts
`).map((row) => purpose(need(row, 4)));

// Letters: writer|reader|someone the letter names|closing|date|a date of something past|a date of something to come|
// body|reason|a detail given as a reason|a reason the letter does not give|request|something in the letter but not
// asked|something not in the letter.

const letterRows = rows(`
  Maya|Grandma Rose|Leo|Love|May 12, 2026|May 9, 2026|June 6, 2026|Thank you for the blue sweater you sent for my birthday on May 9. It fits perfectly, and I wore it to school today. My friend Leo says it is the softest sweater he has ever touched. My school play is on June 6. Could you please come and watch it?|to thank her for a present and invite her to a play|to tell her what Leo said about the sweater|to ask her grandmother to knit her a new sweater for the play|to come and watch her school play|to wear the sweater to school|to knit a sweater for Leo
  Omar|Uncle Karim|Mrs. Diaz|Your nephew|October 4, 2026|September 28, 2026|October 18, 2026|On September 28 our class went to the science museum, and I saw a real dinosaur skeleton! My teacher, Mrs. Diaz, says you used to dig for fossils. Is that true? We are making fossil models in class on October 18. Could you please send me a photo of a fossil you found?|to tell about a museum trip and ask about fossils|to tell his uncle his teacher's name|to invite his uncle to come with the class to the museum|to send a photo of a fossil he found|to make fossil models in class|to visit the class on October 18
  Lily|Aunt June|Max|Love|January 15, 2027|January 10, 2027|February 2, 2027|Our puppy Max arrived on January 10! He is black and white and chews everything, even my shoes. I take him for a walk every morning. Mom says you know a lot about training dogs. Will you teach me some tricks when you visit on February 2?|to share news of a puppy and ask for help training him|to complain that the puppy chews her shoes|to ask her aunt to take the puppy home with her and keep him|to teach her some dog tricks when she visits|to walk Max every morning|to buy Max a new collar
  Ben|Coach Ortiz|Sara|Your player|March 3, 2026|February 28, 2026|March 14, 2026|Thank you for teaching our team to pass the ball last season. On February 28 my friend Sara and I started a soccer club at school. We have twelve players now! Our first game is on March 14. Would you come and help us practice before then?|to tell the coach about a club and ask for help|to say that the club has twelve players|to tell the coach that he is leaving the team for good|to help the club practice before the game|to start a soccer club at school|to buy the club new shirts
  Rosa|Mr. Patel|Ella|Your neighbor|April 20, 2026|April 18, 2026|April 25, 2026|I am sorry that my ball broke your kitchen window on April 18. My sister Ella and I were playing catch, and I threw too hard. I have saved ten dollars to help pay for a new window. On April 25 I can also help you weed your garden. Please tell me if that would be all right.|to say sorry for the window and offer to help|to say that she was playing catch|to ask Mr. Patel to give her back the ball that went through the window|to say if she may help weed his garden|to save ten dollars for the window|to give her a job in his shop
  Kenji|Hiro|Mom|Your friend|July 8, 2026|July 2, 2026|August 1, 2026|I have missed you since you moved to the city on July 2. Our tree house feels empty without you. Mom says you are coming back to visit on August 1. Please bring your new comic books, and I will fix the tree house ladder before you come.|to say he misses his friend and plan a visit|to say that the tree house feels empty|to tell his friend that he is moving to the city too|to bring his new comic books|to fix the tree house ladder|to build a new tree house
  Ana|Grandpa Luis|Dad|Hugs|November 2, 2026|October 31, 2026|November 26, 2026|On October 31 I dressed up as a lighthouse for the school parade, and I won second prize! Dad helped me make the light flash. For Thanksgiving on November 26, could you please bring your apple pie? It is my favorite.|to share news of a prize and ask for a pie|to say that Dad helped with the light|to invite Grandpa to come and watch the school parade with her|to bring his apple pie for Thanksgiving|to dress up as a lighthouse|to make her a lighthouse costume
  Priya|Ms. Green|Mia|Your student|September 12, 2026|September 3, 2026|September 30, 2026|I started fourth grade on September 3. My new class has a pet fish named Bubbles. I still remember the poems you taught us. My friend Mia and I are writing a book of our own poems, and we will finish it by September 30. May we send you a copy?|to give her old teacher news and offer her poems|to tell her about the fish named Bubbles|to ask her teacher to come back|to say if they may send her a copy|to write a book of poems with Mia|to write a poem about the class fish
  Leo|Sam|Aunt Kate|See you soon|June 14, 2026|June 10, 2026|July 20, 2026|Mom said yes! I can stay at your farm from July 20 until the end of the month. On June 10 I bought new boots for walking in the fields. Aunt Kate wrote that I can help feed the goats. Please tell me what else I should pack.|to say he can visit and ask what to pack|to tell his cousin about his new boots|to ask if he can come and visit the farm in the winter|to tell him what else to pack|to help feed the goats|to send him some goat milk
  Zara|Grandma Noor|Ahmed|Love always|February 9, 2027|February 6, 2027|March 1, 2027|On February 6 my little brother Ahmed lost his first tooth! He put it under his pillow and found a shiny coin in the morning. I am learning to bake bread, just like you. When we visit on March 1, will you show me how you make your round flat bread?|to share family news and ask for a baking lesson|to say that Ahmed found a coin|to tell Grandma that she has just lost her own first tooth|to show her how to make round flat bread|to learn to bake bread|to send Ahmed a shiny coin
  Tom|Mrs. Lee|Jack|Thank you again|May 28, 2026|May 20, 2026|June 15, 2026|Thank you for helping me find the book about sharks on May 20. My friend Jack and I read it together, and now we want to learn about whales. The summer reading club starts on June 15. Could you please save us two places in it?|to thank the librarian and ask for places in a club|to say that he read the book with Jack|to say sorry for a late book|to save two places in the reading club|to read the shark book with Jack|to find them a book about sharks
  Nina|Aunt Rita|Dad|Your niece|August 22, 2026|August 15, 2026|September 5, 2026|We moved into our new house on August 15. My bedroom has a round window that looks over the river. Dad painted the walls yellow for me. My new school starts on September 5, and I am a little nervous. Can you write back and tell me about your first day at a new school?|to share news of her home and ask for advice|to say that Dad painted her walls|to invite her aunt to come and live with them in the new house|to write back about her first day at a new school|to paint the bedroom walls yellow|to visit the new house on September 5
  Sam|Grandpa Joe|Lucy|Love|December 3, 2026|November 29, 2026|December 20, 2026|Thank you for the fishing trip on November 29. I still can't believe I caught a fish as long as my arm! My sister Lucy wants to come next time. We will visit you on December 20. Can we go ice fishing on the lake then?|to thank Grandpa for a trip and ask about ice fishing|to tell how long his fish was|to say that he never wants to go fishing with Grandpa again|to take them ice fishing on December 20|to come and visit on December 20|to buy Lucy a fishing rod
  Mei|Jenny|Mr. Wu|Your pen pal|October 2, 2026|September 25, 2026|October 31, 2026|Thank you for your letter about Canada. On September 25 we had the Moon Festival here. We ate moon cakes and carried paper lanterns. My teacher, Mr. Wu, helped us make the lanterns. Please send me a photo of the autumn leaves in your town by October 31, so I can show my class.|to tell her pen pal about a festival and ask for a photo|to say that Mr. Wu helped with the lanterns|to say that she is moving to Canada|to send a photo of the leaves in her town|to eat moon cakes at the festival|to visit China for the Moon Festival
  Diego|Mr. Brown|Paula|Your neighbor|April 7, 2026|April 4, 2026|April 12, 2026|Thank you for letting me use your ladder on April 4 to save my cat from the tree. My mom, Paula, baked you a lemon cake to say thanks. I will bring it over on April 12. Please tell me if you will be home that afternoon.|to thank his neighbor and plan to bring a cake|to say that his cat was stuck in a tree|to ask Mr. Brown if he can borrow the ladder again next week|to say if he will be home on April 12|to bake a lemon cake|to help save the cat again
  Ella|Aunt Mira|Coach Ruiz|Love|June 30, 2026|June 21, 2026|July 15, 2026|I passed my swimming test on June 21! Coach Ruiz says I can now swim in the deep end. I am so excited for our beach trip on July 15. Could you please lend me your snorkel and mask? I promise to take good care of them.|to share her swimming news and ask to borrow gear|to say that she can swim in the deep end|to invite her aunt to her swimming test|to lend her a snorkel and mask|to take good care of the snorkel|to teach her how to swim
`);

const letters = letterRows.map((row) => {
  const [writer = "", reader = "", other = "", closing = "", date = "", past = "", coming = "", body = "", ...rest] = need(row, 14);
  const [reason = "", detail = "", notReason = "", request = "", inLetter = "", notInLetter = ""] = rest;
  const text = `${date}\n\nDear ${reader},\n\n${body}\n\n${closing},\n${writer}`;
  return { writer, reader, other, closing, date, past, coming, body, text, reason, detail, notReason, request, inLetter, notInLetter };
});

/** readingLetters are the friendly letters of the reading topics, part by part, for the writing topics to reuse. */
export const readingLetters: readonly { date: string; reader: string; body: string; closing: string; writer: string }[] = letters;

const letterPartsBank: readonly Ask[] = letters.flatMap((l): Ask[] => [
  {
    question: t("Who wrote this letter?", "这封信是谁写的？"),
    shown: l.text,
    right: l.writer,
    wrong: [l.reader, l.other],
    why: t(`The writer signs the letter at the end, under the closing: ${l.writer}.`, `写信人在信的结尾、结束语下面签名：${l.writer}。`),
    whyNot: [
      t("That is the person the letter is written to: the name after Dear in the greeting.", "这是收信人：称呼里 Dear 后面的名字。"),
      t(
        "That person is only named in the body of the letter; the writer signs at the end.",
        "这个人只是在信的正文里被提到；写信人在结尾签名。",
      ),
    ],
  },
  {
    question: t("Who is this letter written to?", "这封信是写给谁的？"),
    shown: l.text,
    right: l.reader,
    wrong: [l.writer, l.other],
    why: t(
      `The greeting names the reader: Dear ${l.reader}. A letter is written to the person in its greeting.`,
      `称呼说出了收信人：Dear ${l.reader}。信是写给称呼里那个人的。`,
    ),
    whyNot: [
      t(
        "That is the writer, who signs the letter at the end, not the person it is written to.",
        "这是写信人，他在信的结尾签名，而不是收信人。",
      ),
      t(
        "That person is only named in the body of the letter; the reader is named in the greeting.",
        "这个人只是在信的正文里被提到；收信人的名字在称呼里。",
      ),
    ],
  },
  {
    question: t("When was this letter written?", "这封信是什么时候写的？"),
    shown: l.text,
    right: l.date,
    wrong: [l.past, l.coming],
    why: t(
      `The date at the top of a letter tells when it was written: ${l.date}. Other dates in the body tell about events.`,
      `信顶部的日期说明它是什么时候写的：${l.date}。正文里的其他日期说的是一些事情。`,
    ),
    whyNot: [
      t(
        "That date is in the body: it tells when something happened before the letter was written.",
        "这个日期在正文里：它说的是写信之前发生的一件事。",
      ),
      t(
        "That date is in the body: it tells when something will happen after the letter.",
        "这个日期在正文里：它说的是写信之后将要发生的一件事。",
      ),
    ],
  },
]);

const letterReasonBank: readonly Ask[] = letters.flatMap((l): Ask[] => [
  {
    question: t(`Why did ${l.writer} write this letter?`, `${l.writer} 为什么写这封信？`),
    shown: l.text,
    right: l.reason,
    wrong: [l.detail, l.notReason],
    why: t(
      `${l.writer} wrote ${l.reason}. The reason for a letter covers the whole of it, its news and what it asks.`,
      `${l.writer} 写信的目的是：${l.reason}。写信的原因要涵盖整封信的内容：它的消息和它的请求。`,
    ),
    whyNot: [
      t(
        "That is one detail of the letter, but it is not the reason the whole letter was written.",
        "这只是信里的一个细节，而不是写整封信的原因。",
      ),
      t("The letter does not say that anywhere; look at its news and what it asks for.", "信里根本没有这么说；看看信里的消息和请求。"),
    ],
  },
  {
    question: t(`What does ${l.writer} ask ${l.reader} to do?`, `${l.writer} 请 ${l.reader} 做什么？`),
    shown: l.text,
    right: l.request,
    wrong: [l.inLetter, l.notInLetter],
    why: t(
      `The request is the question near the end of the letter: ${l.writer} asks ${l.reader} ${l.request}.`,
      `请求就是信快结束时提出的问题：${l.writer} 请 ${l.reader} ${l.request}。`,
    ),
    whyNot: [
      t("That is in the letter, but it is not something the writer asks the reader to do.", "这在信里出现了，但不是写信人请收信人做的事。"),
      t(
        "The letter never asks for that; find the sentence that asks a question or says please.",
        "信里从来没有提出这个请求；找出提问或者说 please 的那一句。",
      ),
    ],
  },
]);

/** factTopics are the reading topics of grade 3 on texts of facts, tables, kinds of text and letters. */
export const factTopics: readonly TopicDef[] = [
  topic(
    "answering-questions-from-the-text",
    t("Answering Questions from the Text", "根据文本回答问题"),
    t(
      "The answer to a question about a text of facts is in its words, and a reader can point to them.",
      "关于一篇事实性文本的问题，答案就在它的词句里，读者可以指出来。",
    ),
    ["main-idea"],
    [
      point(
        "finding-the-answering-sentence",
        t("Finding the Sentence That Answers", "找到回答问题的句子"),
        t(
          "When a question asks about a text of facts, the answer is **in the text**. Find the key words of the question, such as *hump* or *sink*, and look for the sentence that uses them or words that mean the same.\n\nThen check: does the sentence tell exactly what the question asks? A sentence about the same animal may answer a different question.",
          "当问题问的是一篇事实性文本时，答案**就在文本里**。找出问题的关键词，比如 *hump* 或 *sink*，再找使用了这些词或意思相同的词的句子。\n\n然后检查：这一句是否正好说出了问题所问的内容？说同一种动物的句子，可能回答的是另一个问题。",
        ),
        askGenerator(findBank),
      ),
      point(
        "which-question-a-sentence-answers",
        t("Which Question a Sentence Answers", "句子回答了哪个问题"),
        t(
          "Each sentence of a text of facts answers a question of its own. *A thick layer of fat keeps them warm* answers *What keeps penguins warm?*\n\nTo match a sentence to its question, ask what the sentence tells. Some questions are not answered by the text at all, and a reader should notice that too.",
          "事实性文本的每一句都回答一个自己的问题。*A thick layer of fat keeps them warm* 回答的是 *What keeps penguins warm?*\n\n要把句子和问题对上，就问问这一句说了什么。有些问题文本根本没有回答，读者也应该注意到这一点。",
        ),
        askGenerator(whichQuestionBank),
      ),
    ],
  ),
  topic(
    "reading-a-table",
    t("Reading a Table", "读表格"),
    t(
      "A table puts facts in rows and columns, so a reader finds a fact where a row and a column meet.",
      "表格把事实排成行和列，读者在行和列交汇的地方找到一个事实。",
    ),
    ["main-idea"],
    [
      point(
        "finding-a-value",
        t("Finding a Value in a Table", "在表格里找到一个数值"),
        t(
          "A **table** sets out facts in **rows**, which go across, and **columns**, which go down. The headings at the top say what each column holds, such as *High (°C)*; the first column names each row, such as *Monday*.\n\nTo find a fact, go along the row and down the column: the fact is in the cell where they meet.",
          "**表格**把事实排成横着的**行**和竖着的**列**。顶部的标题说明每一列是什么，比如 *High (°C)*；第一列给每一行命名，比如 *Monday*。\n\n要找一个事实，就沿着这一行、顺着这一列看：事实就在它们交汇的格子里。",
        ),
        askGenerator(valueBank),
      ),
      point(
        "comparing-values",
        t("Comparing Two Values", "比较两个数值"),
        t(
          "A table makes it easy to compare. To find which day was warmer, find both numbers in the same column and see which is greater. To find **by how much**, subtract the smaller number from the greater one: 21 − 15 = 6, so one day was 6 degrees warmer.\n\nKeep to one column: comparing a high with a low gives the wrong answer.",
          "表格让比较变得容易。要找出哪一天更暖和，就在同一列里找到两个数，看哪个更大。要算出**高多少**，就用大数减去小数：21 − 15 = 6，所以有一天高 6 度。\n\n要在同一列里比较：拿最高气温和最低气温比，会得出错误的答案。",
        ),
        askGenerator(compareBank),
      ),
    ],
  ),
  topic(
    "fiction-and-nonfiction",
    t("Fiction and Nonfiction", "虚构作品和非虚构作品"),
    t(
      "Fiction tells a made-up story; nonfiction gives facts about the real world.",
      "虚构作品讲编出来的故事；非虚构作品给出关于真实世界的事实。",
    ),
    ["text-features"],
    [
      point(
        "telling-the-kind-of-text",
        t("Telling the Kind of Text", "分辨文本的种类"),
        t(
          "**Fiction** tells a made-up story: characters, a problem, and often things that could never happen, like a talking teapot. **Nonfiction** gives true facts about the real world, often with numbers, headings, a glossary or a table of contents. A **poem** is written in short lines, often with rhyme.\n\nAsk: is this telling a story someone invented, teaching facts, or singing in lines?",
          "**虚构作品**讲编出来的故事：有角色、有问题，还常有不可能发生的事，比如会说话的茶壶。**非虚构作品**给出关于真实世界的事实，常常有数字、标题、词汇表或目录。**诗**写成短短的诗行，常常押韵。\n\n问问自己：这是在讲别人编的故事、传授事实，还是用诗行在歌唱？",
        ),
        labelChoice(["What kind of text is this?", "这是什么种类的文本？"], kindLines, kindLabels),
      ),
      point(
        "choosing-a-text-for-a-purpose",
        t("Choosing a Text for a Purpose", "为目的选择文本"),
        t(
          "A reader chooses a text for a **purpose**. To learn facts for a report, choose nonfiction on the subject. To enjoy a made-up adventure, choose fiction. To learn how to make something, choose a how-to book.\n\nCheck two things: the **kind** of text and its **subject**. A story about a shark will not tell you what real sharks eat.",
          "读者根据**目的**选择文本。为写报告而学习事实，就选这个主题的非虚构作品。想享受编出来的冒险故事，就选虚构作品。想学怎样做一样东西，就选操作指南。\n\n检查两件事：文本的**种类**和它的**主题**。一个关于鲨鱼的故事，不会告诉你真正的鲨鱼吃什么。",
        ),
        askGenerator(purposeBank),
      ),
    ],
  ),
  topic(
    "reading-a-letter",
    t("Reading a Letter", "读信"),
    t(
      "A letter has a writer, a reader, a reason and a request or a piece of news.",
      "一封信有写信人、收信人、写信的原因，以及请求或消息。",
    ),
    ["main-idea"],
    [
      point(
        "who-wrote-it-to-whom-and-when",
        t("Who Wrote It, to Whom and When", "谁写的、写给谁、什么时候写的"),
        t(
          "Every friendly letter tells three things in fixed places. The **date** at the top says when it was written. The **greeting**, such as *Dear Grandma Rose,* names the reader. The **signature** at the end, under the closing, names the writer.\n\nOther names and dates in the body are about the news, not about who wrote the letter or when.",
          "每封书信都在固定的位置说明三件事。顶部的**日期**说明写信的时间。**称呼**（比如 *Dear Grandma Rose,*）说出收信人。结尾结束语下面的**签名**说出写信人。\n\n正文里的其他名字和日期讲的是消息内容，而不是谁写的信、什么时候写的。",
        ),
        askGenerator(letterPartsBank),
      ),
      point(
        "why-it-was-written",
        t("Why It Was Written and What It Asks", "写信的原因和请求"),
        t(
          "A letter is written for a **reason**: to thank someone, to share news, to say sorry, or to ask for something. The reason covers the whole letter, not one detail of it.\n\nMany letters also make a **request**. Look for a sentence that asks a question or says *please*, often near the end: that is what the writer wants the reader to do.",
          "写信总有一个**原因**：感谢某人、分享消息、道歉或请求帮助。原因要涵盖整封信，而不是其中一个细节。\n\n很多信还会提出**请求**。找出提问或说 *please* 的句子，它们常在信的结尾附近：那就是写信人希望收信人做的事。",
        ),
        askGenerator(letterReasonBank),
      ),
    ],
  ),
];
