// Grade 4: the topics of word study: restatement and example clues, Greek and Latin roots of the body, the prefixes
// in-, im-, il- and ir-, using a thesaurus, and suffixes for people.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, type Item, itemGenerator, pick } from "./kit.ts";
import { after } from "./prior.ts";

// Restatement and example clues.

const clueLines = `
  Magma, or melted rock, rises slowly from deep inside the Earth.|magma|or melted rock|rises slowly|deep inside the Earth|melted rock under the ground|a kind of hard, shiny crystal found in caves|a crack in the ground|r
  Igneous rocks, such as granite and basalt, form when hot, melted rock rises up and slowly cools.|igneous|such as granite and basalt|when hot rock cools|form|made from rock that was once melted|found only at the bottom of rivers|soft enough to scratch with a fingernail|e
  The geologist, a scientist who studies rocks, cracked the gray stone open with a small hammer.|geologist|a scientist who studies rocks|cracked the stone|open|a scientist who studies rocks|a worker who builds stone walls|a person who sells gems|r
  A plateau, that is, a high and flat area of land, stretched for miles in every direction under the sky.|plateau|a high and flat area of land|stretched for miles|for miles|a high, flat area of land|a deep, narrow valley|a lake on top of a mountain|r
  Sediment, which means bits of sand, mud and stone carried by water, piles up in thick layers where the river reaches the sea.|sediment|bits of sand, mud and stone carried by water|piles up|the river mouth|bits of sand, mud and stone carried by water|the fast-moving water in the middle of a deep river|a wall built to stop floods|r
  Natural disasters, including floods, droughts and wildfires, can change the shape of a whole landscape in just a few days.|natural disasters|including floods, droughts and wildfires|can change|in days|events of nature that cause great harm|plans that towns make to protect their land and homes|kinds of weather that help crops|e
  Many landforms, for example mesas, buttes and canyons, were shaped by wind and water over millions of years.|landforms|for example mesas, buttes and canyons|Many|were shaped|natural shapes of the land|maps that show the roads and trails of a park|kinds of desert plants|e
  A glacier is a slow river of ice that moves down a valley.|glacier|a slow river of ice|moves down|a valley|a huge mass of ice that moves slowly|a cold, strong wind that blows down from the mountains|a lake that freezes in winter|r
  Precious stones, like rubies, emeralds and sapphires, are rare and cost a great deal of money to buy.|precious stones|like rubies, emeralds and sapphires|are rare|costly|rare and valuable gems|stones used to build roads|pebbles found on a beach|e
  The tremor, in other words a small shaking of the ground, woke the whole town in the middle of the night.|tremor|a small shaking of the ground|woke|the whole town|a small shaking of the ground|a loud crash of thunder during a summer storm|a sudden flood of water|r
  Fossil fuels, such as coal, oil and natural gas, formed from ancient living things.|fossil fuels|such as coal, oil and natural gas|formed|ancient living things|fuels made from things that lived long ago|fuels made in factories from sunlight and seawater|tools made from old bones|e
  The crater, or bowl-shaped hole, was left by a falling rock from space.|crater|or bowl-shaped hole|was left|a falling rock|a bowl-shaped hole in the ground|a tall, pointed pile of loose rocks left by a glacier|a tunnel made by water|r
  Weathering, the breaking down of rock by wind, water and ice, happens so slowly that you cannot see it from one year to the next.|weathering|the breaking down of rock by wind, water and ice|happens|very slowly|the breaking down of rock by nature|a report on the radio about tomorrow's weather and wind|the building up of new mountains|r
  Many minerals, for instance salt, quartz and gold, are found inside many of the rocks under our feet.|minerals|for instance salt, quartz and gold|are found|in rocks|natural solid materials found in rocks|animals that live deep inside dark caves and tunnels|tools used by miners|e
  The basin, a low area of land shaped like a bowl, slowly filled with rainwater during the long wet season.|basin|a low area of land shaped like a bowl|filled with|rainwater|a low, bowl-shaped area of land|a high wall of rock at the edge of a mountain range|a narrow strip of sand|r
  Erosion, the carrying away of soil and rock, can be slowed by planting trees.|erosion|the carrying away of soil and rock|can be slowed|planting trees|the carrying away of soil and rock|the planting of new forests on hills where trees were cut|the hardening of mud into stone|r
  A dormant, or sleeping, volcano has not erupted for hundreds of years but could wake up again one day.|dormant|or sleeping|A|volcano|sleeping, not active for now|very hot, dangerous and about to explode at any moment|newly formed|r
  Gemstones, such as diamonds and opals, are cut and polished to make jewelry.|gemstones|such as diamonds and opals|are cut and polished|jewelry|stones that are cut and polished as gems|rough stones that people once used to sharpen their knives|stones that float on water|e
  The delta, which is flat land formed where a river meets the sea, is very good for growing rice and other crops.|delta|flat land formed where a river meets the sea|is good|farming|flat land at the mouth of a river|a high, rocky cliff that stands above the stormy sea|a small island in a lake|r
  Shellfish, including clams, oysters and mussels, can become fossils when they are buried deep in the mud.|shellfish|including clams, oysters and mussels|can become|in the mud|animals that live in water and have shells|small fish that swim in large groups near the shore|plants that grow on rocks|e
  The tectonic plates, or huge slabs of the Earth's crust, move a few centimeters each year, slowly changing the map.|tectonic plates|or huge slabs of the Earth's crust|move|each year|huge pieces of the Earth's outer layer|flat glass dishes that scientists use in a laboratory|small stones on a beach|r
  Extreme weather, like hurricanes, blizzards and heat waves, is becoming more common in many parts of the world.|extreme weather|like hurricanes, blizzards and heat waves|is becoming|more common|very severe weather|mild, pleasant weather|weather that never changes|e
  The canyon, a deep valley with steep sides, was carved by the rushing river over millions of years.|canyon|a deep valley with steep sides|was carved|the river|a deep valley with steep sides|a wide, grassy plain where buffalo once roamed|a mountain with a flat top|r
  Hot springs, pools of water heated from below the ground, attract many visitors to the park every winter.|hot springs|pools of water heated from below the ground|attract|many visitors|pools of naturally hot water|springy pieces of metal that bounce when you press them|streams that flow in winter|r
  Metamorphic rocks, such as marble and slate, are changed by heat and pressure.|metamorphic|such as marble and slate|are changed|heat and pressure|changed by heat and pressure|melted and poured out of a volcano|made of sand pressed in layers|e
  The aftershock, a smaller quake after the main one, shook the town again just as people were going back inside.|aftershock|a smaller quake after the main one|shook|the town again|a smaller quake after the main one|a warning on the radio that comes before a quake|the moment a quake is strongest|r
  Natural resources, for example water, wood and soil, must be used with care so that there is enough for everyone.|natural resources|for example water, wood and soil|must be used|with care|useful things found in nature|tools and machines that are made in big factories|places where people live|e
  The summit, the very top of the mountain, was covered in deep snow for most of the year.|summit|the very top of the mountain|was covered|in snow|the very top of a mountain|the wide, flat land at the foot of a mountain|a path around a mountain|r
  Underground features, like caves, tunnels and sinkholes, are formed by water dripping through the rock for ages.|underground features|like caves, tunnels and sinkholes|are formed|by water|shapes and spaces below the ground|shops and buildings that are made below busy cities|plants that grow in the dark|e
  The ridge, or long narrow top of a hill, gave us a view of the valley.|ridge|or long narrow top of a hill|gave us|a view of the valley|a long, narrow hilltop|a low, wet field where frogs and reeds live|a deep hole in rock|r
`;

const clueRows = fields(clueLines).map(([sentence, word, clue, w1, w2, meaning, m1, m2, kind]) => {
  if (!sentence || !word || !clue || !w1 || !w2 || !meaning || !m1 || !m2 || !kind)
    throw new Error(`a clue line needs nine fields: ${sentence}`);
  const at = sentence.indexOf(clue);
  const rest = sentence.slice(at + clue.length).replace(/^[\s,;.]+|[\s,;.]+$/g, "");
  const other = w1.length >= w2.length ? w1 : w2;
  const spans = rest && rest !== other ? ([rest, other] as const) : ([w1, w2] as const);
  return { sentence, word, clue, spans, meaning, meanings: [m1, m2] as const, restates: kind === "r" };
});

const clueKind = (restates: boolean) =>
  restates
    ? (["restates the word in easier words", "用更简单的词重新说明这个词"] as const)
    : (["gives examples of the word", "给出这个词的例子"] as const);

/** clueFindBank asks for the words of a sentence that restate or give examples of a hard word. */
const clueFindBank: readonly Item[] = clueRows.map((row) => ({
  question: t(`Which words help explain *${row.word}*?`, `哪些词帮助解释了 *${row.word}*？`),
  shown: row.sentence,
  right: row.clue,
  wrong: row.spans,
  why: t(
    `“${row.clue}” ${clueKind(row.restates)[0]}. Signal words such as *or*, *that is*, *in other words*, *such as*, *like*, *including* and *for example*, or a pair of commas, often mark a clue.`,
    `“${row.clue}” ${clueKind(row.restates)[1]}。*or*、*that is*、*in other words*、*such as*、*like*、*including*、*for example* 这样的信号词，或者一对逗号，常常标出线索。`,
  ),
  whyNot: row.spans.map((s) =>
    t(
      `“${s}” is part of the sentence, but it tells what happens or where, not what *${row.word}* means or what it includes.`,
      `“${s}” 是句子的一部分，但它说的是发生了什么或在哪里，而不是 *${row.word}* 的意思或包括什么。`,
    ),
  ),
}));

/** clueMeaningBank asks for the meaning of a hard word from its clue. */
const clueMeaningBank: readonly Item[] = clueRows.map((row) => ({
  question: t(`What does *${row.word}* mean in this sentence?`, `在这个句子中 *${row.word}* 是什么意思？`),
  shown: row.sentence,
  right: row.meaning,
  wrong: row.meanings,
  why: t(
    `*${row.word}* means ${row.meaning}. The clue “${row.clue}” ${clueKind(row.restates)[0]}${row.restates ? ", so the meaning is right there in the sentence" : "; ask what the examples have in common"}.`,
    `*${row.word}* 的意思是 ${row.meaning}。线索“${row.clue}”${clueKind(row.restates)[1]}${row.restates ? "，所以意思就在句子里" : "；问问这些例子有什么共同点"}。`,
  ),
  whyNot: row.meanings.map((m) =>
    t(
      `“${m}” does not match the clue “${row.clue}”. A meaning has to fit what the sentence itself says about the word.`,
      `“${m}” 与线索“${row.clue}”不符。词义必须符合句子本身对这个词的说明。`,
    ),
  ),
}));

// Greek and Latin roots of the body.

const roots: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  cardi: ["heart", "心脏"],
  derm: ["skin", "皮肤"],
  dent: ["tooth", "牙齿"],
  "ped, pod": ["foot", "脚"],
  manu: ["hand", "手"],
  "ocul, opt": ["eye", "眼睛"],
  pulmo: ["lung", "肺"],
  gastr: ["stomach", "胃"],
  neur: ["nerve", "神经"],
  audi: ["hear", "听"],
};

const rootLines = `
  cardiac|cardi|having to do with the heart|having to do with cards|having to do with the skin
  cardiologist|cardi|a doctor who treats the heart|a person who collects cards|a doctor who treats the feet
  cardiogram|cardi|a record of how the heart beats|a letter written on a card|a picture of the lungs
  dermatologist|derm|a doctor who treats the skin|a doctor who treats the teeth|a scientist who studies weather
  epidermis|derm|the outer layer of the skin|the inner part of a tooth|a bone of the foot
  hypodermic|derm|going under the skin|going around the heart|going into the stomach
  dentist|dent|a doctor who cares for teeth|a person who fixes dents in cars|a doctor who cares for eyes
  dental|dent|having to do with teeth|having to do with hands|having to do with hearing
  dentures|dent|false teeth|small hand tools|soft shoes
  pedal|ped, pod|a lever you push with your foot|a lever you pull with your hand|a part of a flower
  pedestrian|ped, pod|a person who travels on foot|a person who drives a truck|a person who rides a horse
  tripod|ped, pod|a stand with three feet|a box with three lids|a plant with three leaves
  centipede|ped, pod|a small creature with very many feet|a coin worth one cent|a bird with a long beak
  manual|manu|done by hand|done by a machine|done by ear
  manuscript|manu|a book or paper written by hand|a book printed by a machine|a story told aloud
  manicure|manu|care of the hands and nails|a cure for a stomachache|a haircut
  manufacture|manu|to make things, once by hand|to break things on purpose|to sell things at a market
  binoculars|ocul, opt|a tool for seeing far with both eyes|a tool for hearing far sounds|a pair of gloves
  optician|ocul, opt|a person who makes glasses for the eyes|a person who chooses what to buy|a person who fixes teeth
  optical|ocul, opt|having to do with the eye and seeing|having to do with choosing|having to do with the lungs
  optometrist|ocul, opt|a person who tests people's eyes|a person who measures rooms|a person who studies nerves
  pulmonary|pulmo|having to do with the lungs|having to do with pulling|having to do with the heart only
  pulmonologist|pulmo|a doctor who treats the lungs|a person who pulls heavy loads|a doctor who treats the skin
  cardiopulmonary|pulmo|having to do with the heart and lungs|having to do with cards and pulleys|having to do with the stomach and nerves
  gastric|gastr|having to do with the stomach|having to do with gas stations|having to do with the brain
  gastritis|gastr|a soreness of the stomach|a fear of gas|an illness of the eyes
  gastropod|gastr|an animal such as a snail that moves on its belly|a machine that pumps gas|a bird that walks on one foot
  neuron|neur|a nerve cell|a new kind of metal|a muscle of the arm
  neurology|neur|the study of nerves and the brain|the study of new things|the study of the stomach
  neurologist|neur|a doctor who treats the nerves|a doctor who treats new patients|a doctor who treats the teeth
  audience|audi|people who listen to or watch a show|people who build a stage|people who sell tickets
  audible|audi|loud enough to be heard|easy to see|able to be touched
  audition|audi|a short performance heard by judges|a list of names|a test of eyesight
  auditorium|audi|a large hall where people listen|a room for storing books|a field for sports
`;

const rootRows = fields(rootLines).map(([word, root, meaning, w1, w2]) => {
  const parts = root ? roots[root] : undefined;
  if (!word || !root || !parts || !meaning || !w1 || !w2) throw new Error(`a root line needs five fields: ${word}`);
  return { word, root, parts, meaning, wrong: [w1, w2] as const };
});

const rootNames = Object.keys(roots);

/** rootMeaningBank asks what the root of a word means. */
const rootMeaningBank: readonly Item[] = rootRows.map((row, i) => {
  const others = rootNames.filter((r) => r !== row.root);
  const wrongRoots = [pick(others, i), pick(others, i + 4)];
  return {
    question: t(`The root *${row.root}* in *${row.word}* means what?`, `*${row.word}* 中的词根 *${row.root}* 是什么意思？`),
    shown: "",
    right: row.parts[0],
    wrong: wrongRoots.map((r) => roots[r]?.[0] ?? r),
    why: t(
      `*${row.root}* means **${row.parts[0]}**, so *${row.word}* means ${row.meaning}. Knowing the root lets you guess many medical and science words.`,
      `*${row.root}* 的意思是**${row.parts[1]}**，所以 *${row.word}* 的意思是 ${row.meaning}。知道词根就能猜出许多医学和科学词汇。`,
    ),
    whyNot: wrongRoots.map((r) =>
      t(
        `*${roots[r]?.[0]}* is the meaning of the root *${r}*, not of *${row.root}*.`,
        `*${roots[r]?.[0]}* 是词根 *${r}* 的意思，不是 *${row.root}* 的意思。`,
      ),
    ),
  };
});

/** rootWordBank asks for the meaning of a word from its root. */
const rootWordBank: readonly Item[] = rootRows.map((row) => ({
  question: t(`Use the root to work out what *${row.word}* means.`, `利用词根推断 *${row.word}* 的意思。`),
  shown: "",
  right: row.meaning,
  wrong: row.wrong,
  why: t(
    `*${row.word}* has the root *${row.root}*, which means ${row.parts[0]}, so it means ${row.meaning}.`,
    `*${row.word}* 含有词根 *${row.root}*（${row.parts[1]}），所以它的意思是 ${row.meaning}。`,
  ),
  whyNot: row.wrong.map((w) =>
    t(
      `“${w}” does not have to do with the ${row.parts[0]}, which is what *${row.root}* means. Some words only look alike: *dent* in a car is not a tooth.`,
      `“${w}” 与${row.parts[1]}无关，而 *${row.root}* 的意思正是${row.parts[1]}。有些词只是看起来相像：车上的 *dent*（凹痕）和牙齿无关。`,
    ),
  ),
}));

// The prefixes in-, im-, il- and ir-.

const prefixOf = (base: string) => (/^[mp]/.test(base) ? "im" : base.startsWith("l") ? "il" : base.startsWith("r") ? "ir" : "in");

const prefixWhy: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  im: ["*im-* comes before a base word that starts with *m* or *p*", "以 *m* 或 *p* 开头的词前用 *im-*"],
  il: ["*il-* comes before a base word that starts with *l*", "以 *l* 开头的词前用 *il-*"],
  ir: ["*ir-* comes before a base word that starts with *r*", "以 *r* 开头的词前用 *ir-*"],
  in: ["*in-* comes before most other letters", "其他大多数字母前用 *in-*"],
};

const prefixLines = `
  possible|not able to happen or be done|very likely to happen|possible again
  polite|rude, not polite|very polite|polite in a quiet way
  patient|not willing to wait calmly|calm while waiting|a person in a hospital
  perfect|having mistakes, not perfect|perfect in every way|made perfect again
  proper|not right for the situation|exactly right for the situation|owned by someone
  practical|not useful or sensible in real life|useful and sensible|done for practice
  mature|acting younger than your age|grown-up and sensible|old and ripe
  mobile|not able to move|easy to move|a toy that hangs and turns
  measurable|too great to be measured|easy to measure|measured twice
  legal|against the law|allowed by law|about lawyers
  logical|not making sense|making good sense|about logs
  legible|too messy to read|easy to read|read aloud
  literate|not able to read or write|able to read and write well|about books
  regular|not following the usual pattern|always the same|done again and again
  responsible|not caring about your duties|trusted to do your duties|able to answer back
  relevant|not connected to the subject|closely connected to the subject|said again
  replaceable|too special to be replaced|easy to replace|placed back again
  resistible|too tempting to say no to|easy to say no to|able to rest
  active|not moving or doing anything|busy and moving|acting in a play
  accurate|not correct or exact|exactly correct|careful
  complete|not finished|fully finished|finished again
  correct|wrong, not correct|right, without mistakes|corrected by a teacher
  visible|not able to be seen|easy to see|seen from inside
  direct|not straight or plain|straight and plain|pointed toward the inside
  formal|relaxed and casual|serious and proper|in a form
  dependent|free, not needing help|needing help from others|hanging from something
  secure|not safe or confident|safe and confident|locked inside
  exact|not quite right|exactly right|taken out
  expensive|cheap, costing little|costing a lot|spent inside
  edible|not safe to eat|safe and good to eat|eaten inside
  credible|too strange to believe|easy to believe|believed again
  capable|not able to do something|able to do something well|wearing a cape
  sincere|not honest about feelings|honest about feelings|very sincere
  accessible|not able to be reached|easy to reach|reached from inside
  mortal|living forever|sure to die one day|deadly
  personal|cold, without feeling for people|about one person|done in person
`;

const prefixRows = fields(prefixLines).map(([base, meaning, opposite, other]) => {
  if (!base || !meaning || !opposite || !other) throw new Error(`a prefix line needs four fields: ${base}`);
  const prefix = prefixOf(base);
  return { base, prefix, word: `${prefix}${base}`, meaning, wrong: [opposite, other] as const };
});

const prefixForms = ["in", "im", "il", "ir"];

/** prefixFormBank asks for the form of the prefix that fits a base word. */
const prefixFormBank: readonly Item[] = prefixRows.map((row, i) => {
  const others = prefixForms.filter((p) => p !== row.prefix);
  const wrong = [pick(others, i), pick(others, i + 1)].map((p) => `${p}${row.base}`);
  return {
    question: t(`Which word means *not ${row.base}*?`, `哪个词的意思是“不 ${row.base}”？`),
    shown: "",
    right: row.word,
    wrong,
    why: t(
      `**${row.word}**: ${prefixWhy[row.prefix]?.[0]}. The prefix changes its spelling to fit the first letter of *${row.base}*, but it still means *not*.`,
      `**${row.word}**：${prefixWhy[row.prefix]?.[1]}。前缀会根据 *${row.base}* 的首字母改变拼写，但意思仍然是“不”。`,
    ),
    whyNot: wrong.map((w) =>
      t(
        `“${w}” uses the wrong form of the prefix. *${row.base}* begins with *${row.base[0]}*, and ${prefixWhy[row.prefix]?.[0]}.`,
        `“${w}” 用错了前缀形式。*${row.base}* 以 *${row.base[0]}* 开头，${prefixWhy[row.prefix]?.[1]}。`,
      ),
    ),
  };
});

/** prefixMeaningBank asks what a word with the prefix means. */
const prefixMeaningBank: readonly Item[] = prefixRows.map((row) => ({
  question: t(`What does *${row.word}* mean?`, `*${row.word}* 是什么意思？`),
  shown: "",
  right: row.meaning,
  wrong: row.wrong,
  why: t(
    `*${row.prefix}-* means *not*, so *${row.word}* means ${row.meaning}. Split the word into its prefix and its base, *${row.prefix}* + *${row.base}*.`,
    `*${row.prefix}-* 的意思是“不”，所以 *${row.word}* 的意思是 ${row.meaning}。把这个词拆成前缀和词根：*${row.prefix}* + *${row.base}*。`,
  ),
  whyNot: [
    t(
      `“${row.wrong[0]}” is the meaning of *${row.base}* itself. The prefix *${row.prefix}-* turns it around to mean the opposite.`,
      `“${row.wrong[0]}” 是 *${row.base}* 本身的意思。前缀 *${row.prefix}-* 把它变成相反的意思。`,
    ),
    t(
      `“${row.wrong[1]}” does not use the meaning *not*. Here *${row.prefix}-* is not *in* meaning *inside*, and it never means *again*.`,
      `“${row.wrong[1]}” 没有用到“不”的意思。这里的 *${row.prefix}-* 不是表示“在里面”的 *in*，也从来不表示“再次”。`,
    ),
  ],
}));

// Using a thesaurus.

/** entries are thesaurus entries: each synonym with the shade of meaning that sets it apart. */
const entries: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  walk: {
    stroll: "to walk slowly, for pleasure",
    march: "to walk in step, like soldiers",
    tiptoe: "to walk quietly on your toes",
    stagger: "to walk unsteadily, almost falling",
    stride: "to walk with long, confident steps",
  },
  say: {
    whisper: "to say very softly",
    shout: "to say very loudly",
    mutter: "to say quietly and unclearly, often when annoyed",
    announce: "to say something to many people officially",
    stammer: "to say with pauses and repeated sounds, from nerves",
  },
  look: {
    glance: "to look quickly",
    stare: "to look for a long time without moving your eyes",
    peek: "to look secretly, through a small space",
    glare: "to look angrily",
    gaze: "to look for a long time with wonder or love",
  },
  big: {
    large: "big, in an ordinary way",
    huge: "very big",
    enormous: "extremely big, much bigger than usual",
    roomy: "big inside, with plenty of space",
    bulky: "big and hard to carry",
  },
  happy: {
    glad: "pleased about something",
    cheerful: "happy and bright in how you act",
    thrilled: "very happy and excited",
    content: "quietly satisfied, not wanting more",
    relieved: "happy because a worry has ended",
  },
  angry: {
    annoyed: "a little angry",
    cross: "angry in a grumpy way",
    furious: "extremely angry",
    offended: "angry because someone was rude to you",
    impatient: "angry from having to wait",
  },
  eat: {
    nibble: "to eat in small bites",
    gobble: "to eat fast and greedily",
    munch: "to eat with noisy chewing",
    feast: "to eat a large, special meal",
    sip: "to drink in small amounts",
  },
  small: {
    little: "small, in an ordinary way",
    tiny: "very small",
    cramped: "too small for what is inside",
    slight: "small and thin, or not important",
    miniature: "a very small copy of something bigger",
  },
};

const fitLines = `
  walk|The soldiers ___ across the square in straight lines.|march|stroll|tiptoe
  walk|We ___ through the park on a lazy Sunday afternoon.|stroll|march|stagger
  walk|I ___ past my sleeping baby brother so I would not wake him.|tiptoe|stride|march
  walk|The tired runner began to ___ and nearly fell over the line.|stagger|stride|stroll
  walk|The confident captain likes to ___ onto the stage with long steps.|stride|tiptoe|stagger
  say|The librarian asked us to ___ so others could read.|whisper|shout|announce
  say|The coach had to ___ over the noise of the crowd.|shout|whisper|mutter
  say|Grumpy Mr. Lee would ___ to himself about the noisy kids.|mutter|announce|shout
  say|The principal will ___ the winners at assembly.|announce|mutter|stammer
  say|Nervous on stage, Leo began to ___ his first line.|stammer|announce|shout
  look|I only had time to ___ at the clock before I ran out.|glance|stare|gaze
  look|The cat would ___ at the fish tank for hours without blinking.|stare|glance|peek
  look|Through the crack in the door, I could ___ at my birthday present.|peek|glare|gaze
  look|The queen began to ___ at the jester who had spilled soup on her.|glare|gaze|peek
  look|The sailors would ___ in wonder at the stars over the sea.|gaze|glare|glance
  big|The blue whale is an ___ animal, the biggest on Earth.|enormous|roomy|bulky
  big|The new van is ___ enough for all seven of us and our bags.|roomy|bulky|enormous
  big|The ___ box would not fit through the narrow door.|bulky|roomy|large
  happy|Mia was ___ when she heard that her lost dog had been found.|relieved|content|cheerful
  happy|The ___ waiter smiled and hummed as he served us.|cheerful|relieved|thrilled
  happy|The kids were ___ to meet the famous astronaut.|thrilled|content|relieved
  happy|Grandpa was ___ to sit in his garden; he wanted nothing more.|content|thrilled|relieved
  angry|The king was ___ when the thief escaped with his crown.|furious|annoyed|impatient
  angry|Jo was a little ___ that her pencil kept breaking.|annoyed|furious|offended
  angry|The man in line grew ___ after waiting an hour.|impatient|offended|furious
  angry|Ana was ___ when her friend called her drawing silly.|offended|impatient|cross
  eat|The mouse would ___ the cheese in tiny bites.|nibble|gobble|feast
  eat|The hungry dog would ___ its dinner in ten seconds.|gobble|nibble|sip
  eat|At the wedding, the guests would ___ on roast duck and cake.|feast|munch|nibble
  eat|We could hear him ___ on crunchy carrots in the back row.|munch|sip|feast
  small|The old dollhouse had ___ chairs and tables.|miniature|cramped|slight
  small|Six of us were ___ in the back of the little car.|cramped|tiny|slight
  small|There is a ___ chance of rain, so we will not need umbrellas.|slight|cramped|miniature
`;

const oddLines = `
  walk|We ___ along the beach, looking at shells.|march|stroll|wander
  say|The kind nurse spoke to the scared child in a soft ___.|shout|whisper|murmur
  look|The detective ___d at the footprints for a long time.|glance|stare|gaze
  big|The giant had ___ hands that could hold a cow.|roomy|huge|enormous
  happy|The team was ___ to win the championship.|content|thrilled|delighted
  angry|The farmer was ___ when the goats ate his whole garden.|annoyed|furious|enraged
  eat|At the party, the guests would ___ on pizza and cake for hours.|nibble|feast|gorge
  small|A ___ ant crawled across the page.|cramped|tiny|little
  walk|The proud soldiers will ___ in the parade.|tiptoe|march|stride
  say|The fans began to ___ the winner's name.|whisper|shout|chant
  look|I took a quick ___ at my watch and hurried to the bus.|gaze|glance|peek
  big|The elephant was ___, taller than the bus.|bulky|huge|enormous
  happy|I was ___ to see my cousin after a whole year.|relieved|glad|thrilled
  angry|The teacher was ___ when we talked during the test.|offended|cross|annoyed
  eat|The baby began to ___ on a cookie very slowly.|gobble|nibble|munch
  small|The ___ kitten fit in the palm of my hand.|slight|tiny|little
  walk|The baby began to ___ across the rug on her new legs.|march|stagger|toddle
  say|The shy boy began to ___ his name so softly we could hardly hear.|announce|whisper|murmur
  look|Wide-eyed, the children ___d at the fireworks.|glance|gaze|stare
  big|The storm made ___ waves crash on the shore.|roomy|huge|giant
  happy|Everyone was ___ when the long trip was over and we were safe.|cheerful|relieved|glad
  angry|The giant was ___ and stamped so hard the ground shook.|annoyed|furious|enraged
  eat|The hungry campers began to ___ their stew before it was cool.|nibble|gobble|wolf
  small|We saw ___ fish darting in the shallow pool.|cramped|tiny|little
  walk|The sleepy guard began to ___ down the dark hall to check the doors.|march|tiptoe|creep
  say|The boy began to ___ so quietly that nobody heard his complaint.|announce|mutter|mumble
  look|The guard began to ___ at the stranger with narrow, angry eyes.|gaze|glare|scowl
  big|The castle had a ___ hall for great feasts.|bulky|huge|vast
  happy|The ___ baker greeted every customer with a joke.|relieved|cheerful|jolly
  angry|My sister was ___ after waiting all day for her package.|offended|impatient|annoyed
  eat|The hungry goats began to ___ the grass down to the roots.|sip|munch|chew
  small|The village was so ___ that it had only one shop.|cramped|tiny|little
`;

/** shadeOf finds the shade of a synonym in an entry, or a plain gloss for a word the entry does not list. */
const shadeOf = (head: string, word: string): string => entries[head]?.[word] ?? `a word that fits this meaning of *${head}*`;

/** entryText shows a thesaurus entry. */
const entryText = (head: string) => `**${head}**: ${Object.keys(entries[head] ?? {}).join(", ")}`;

/** fitBank asks for the synonym of an entry that fits a sentence. */
const fitBank: readonly Item[] = fields(fitLines).map(([head, shown, right, w1, w2]) => {
  if (!head || !entries[head] || !shown || !right || !w1 || !w2) throw new Error(`a thesaurus line needs five fields: ${shown}`);
  return {
    question: t(
      `Which word from the thesaurus entry fits the sentence best?\n\n${entryText(head)}`,
      `同义词词典词条中哪个词最适合这个句子？\n\n${entryText(head)}`,
    ),
    shown,
    right,
    wrong: [w1, w2],
    why: t(
      `*${right}* means ${shadeOf(head, right)}, which is what the sentence describes. Synonyms share a meaning, but each has its own shade.`,
      `*${right}* 的意思是 ${shadeOf(head, right)}，正是句子描述的情形。同义词意思相近，但各有细微差别。`,
    ),
    whyNot: [w1, w2].map((w) =>
      t(
        `*${w}* means ${shadeOf(head, w)}. That shade does not match the clues in the sentence.`,
        `*${w}* 的意思是 ${shadeOf(head, w)}。这层细微意思与句子中的线索不符。`,
      ),
    ),
  };
});

/** oddBank asks for the synonym whose shade of meaning does not fit a sentence. */
const oddBank: readonly Item[] = fields(oddLines).map(([head, shown, odd, fit1, fit2]) => {
  if (!head || !entries[head] || !shown || !odd || !fit1 || !fit2) throw new Error(`a thesaurus line needs five fields: ${shown}`);
  return {
    question: t(
      `All three words are synonyms of *${head}*. Which one has the wrong shade of meaning for this sentence?`,
      `这三个词都是 *${head}* 的同义词。哪一个的细微意思不适合这个句子？`,
    ),
    shown,
    right: odd,
    wrong: [fit1, fit2],
    why: t(
      `*${odd}* means ${shadeOf(head, odd)}, which does not fit what the sentence describes. A thesaurus gives choices, but you must check each one against the sentence.`,
      `*${odd}* 的意思是 ${shadeOf(head, odd)}，与句子描述的不符。同义词词典给出选择，但每个词都要放回句子里检验。`,
    ),
    whyNot: [fit1, fit2].map((w) =>
      t(
        `*${w}* fits the sentence: its shade of meaning matches the clues, so it is not the word to reject.`,
        `*${w}* 适合这个句子：它的细微意思与线索相符，所以不是要排除的词。`,
      ),
    ),
  };
});

// Suffixes for people.

const personLines = `
  scientist|studies science|sciencer|sciencian|the study of science in schools and colleges|a tool used in science
  artist|makes art|arter|artor|a large room where paintings are hung for visitors|a kind of paint
  cyclist|rides a bicycle|cycler|cyclian|a long race for bicycles on mountain roads|a part of a bicycle
  violinist|plays the violin|violiner|violinor|the hard case that a violin is carried in|a song for the violin
  pianist|plays the piano|pianer|pianian|a quiet room with a piano and a bench|the keys of a piano
  tourist|travels to see places for fun|tourer|tourian|a trip by bus to see the sights of a city|a map of a city
  journalist|writes news for a paper or a website|journaler|journalor|a notebook in which you write about each day|a newspaper office
  novelist|writes novels|noveler|novelian|a very long book that tells a made-up story|the first page of a story
  historian|studies history|historist|historer|a very old building that is important to a town|a lesson about the past
  librarian|works in a library|librarer|librarist|a tall shelf full of books and magazines|a library card
  musician|plays or writes music|musicer|musicist|a song that is played on instruments with no words|a music lesson
  magician|does magic tricks|magicer|magicist|a thick book of spells and secret tricks|a magic wand
  electrician|fixes electric wires and lights|electricer|electrist|a power station that makes electricity for a city|a light switch
  comedian|makes people laugh|comedor|comedist|a funny film that makes the whole family laugh|a joke book
  inventor|invents new things|inventer|inventist|a new machine that nobody has ever built before|a patent office
  actor|acts in plays and films|acter|actist|a play that is performed on a stage in a theater|a costume
  sailor|works on a ship|sailer|sailist|the large cloth of a sail that catches the wind|a boat race
  visitor|comes to see a person or a place|visiter|visitian|a short visit to the zoo on a sunny Saturday|a guest room
  director|tells actors what to do|directer|directist|a straight road that leads directly to the town|a list of names
  editor|checks and fixes writing|editer|editist|a newspaper that is printed every morning|a change to a story
  sculptor|makes statues|sculpter|sculptist|a tall statue carved out of a block of stone|a sharp tool
  governor|leads a state|governer|governist|the work of ruling a state and making its laws|a building for meetings
  teacher|teaches others|teachor|teachist|a long school day full of lessons and games|a lesson plan
  explorer|travels to find new places|exploror|explorist|a map of the world with all its seas and lands|a long journey
  farmer|works on a farm|farmor|farmist|a wide field of corn that is ready for harvest|a tractor
  pioneer|is among the first to do something|pionist|pionor|a new road that leads into the unknown west|a covered wagon
  engineer|designs machines, roads or bridges|enginist|enginor|a large machine that drives a train or a ship|a bridge
  volunteer|works without being paid|volunteerist|voluntor|a day off from work that you spend at home|a gift of money
  mountaineer|climbs mountains|mountainist|mountainor|a tall mountain covered in snow and ice all year|a climbing rope
  assistant|helps another person|assister|assistor|a kind of help that is given in an emergency|a helpful tool
  servant|serves in a household|server|servist|a tray of food carried to a table at dinner|a big house
  inhabitant|lives in a place|inhabiter|inhabitor|a natural home where wild animals live|a city map
  contestant|takes part in a contest|contester|contestor|a prize of a gold cup for the winner of a race|a game show
  participant|takes part in an event|participator|participer|a short meeting where people share their plans|a list of events
  guardian|takes care of and protects someone|guarder|guardist|a strong iron gate that protects a castle|a locked door
`;

const personRows = fields(personLines).map(([word, does, f1, f2, m1, m2]) => {
  if (!word || !does || !f1 || !f2 || !m1 || !m2) throw new Error(`a person line needs six fields: ${word}`);
  const suffix = ["eer", "ian", "ist", "ant", "or", "er"].find((s) => word.endsWith(s)) ?? "er";
  return { word, does, forms: [f1, f2] as const, meanings: [m1, m2] as const, suffix };
});

/** personFormBank asks for the person-word for an activity. */
const personFormBank: readonly Item[] = personRows.map((row) => ({
  question: t(`Which word names a person who ${row.does}?`, `哪个词指“${row.does}”的人？`),
  shown: "",
  right: row.word,
  wrong: row.forms,
  why: t(
    `A person who ${row.does} is a **${row.word}**. The suffix *-${row.suffix}* turns a word into a person who does something; each word has the suffix it always takes.`,
    `${row.does}的人叫 **${row.word}**。后缀 *-${row.suffix}* 把一个词变成做某事的人；每个词都有它固定使用的后缀。`,
  ),
  whyNot: row.forms.map((f) =>
    t(
      `“${f}” is not a word: it uses the wrong suffix. The person-word is *${row.word}*, with *-${row.suffix}*.`,
      `“${f}” 不是一个词：它用错了后缀。表示人的词是 *${row.word}*，用 *-${row.suffix}*。`,
    ),
  ),
}));

/** personMeaningBank asks what a person-word means. */
const personMeaningBank: readonly Item[] = personRows.map((row) => ({
  question: t(`What is a *${row.word}*?`, `*${row.word}* 是什么？`),
  shown: "",
  right: `a person who ${row.does}`,
  wrong: row.meanings,
  why: t(
    `A *${row.word}* is a person who ${row.does}. The suffix *-${row.suffix}* tells you the word names a person, not a thing or a place.`,
    `*${row.word}* 指${row.does}的人。后缀 *-${row.suffix}* 告诉你这个词指人，而不是物或地方。`,
  ),
  whyNot: row.meanings.map((m) =>
    t(
      `“${m}” is not a person. A word that ends in *-${row.suffix}* here names someone who does something.`,
      `“${m}” 不是人。这里以 *-${row.suffix}* 结尾的词指做某事的人。`,
    ),
  ),
}));

/** wordStudyTopics4 are the topics of word study of grade 4. */
export const wordStudyTopics4: readonly TopicDef[] = [
  {
    id: "restatement-and-inference-clues",
    title: t("Restatement and Example Clues", "重述线索和举例线索"),
    summary: t(
      "A text often explains a hard word by saying it again in easier words or by giving examples of it.",
      "文章常常用更简单的词重新说一遍难词，或者举例来解释它。",
    ),
    prerequisites: ["context-clues"],
    encompasses: [{ topic: "context-clues", weight: 0.3 }],
    xp: 14,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "finding-restatement-and-example-clues",
        t("Finding the Clue", "找出线索"),
        t(
          "Writers of science and history books know their readers meet hard words, so they explain them in the sentence.\n\n- A **restatement** says the word again in easier words, often after *or*, *that is*, *in other words* or *which means*, or between commas: *Magma, or melted rock, rises slowly.*\n- An **example** clue lists members of the group the word names, after *such as*, *like*, *including* or *for example*: *Igneous rocks, such as granite and basalt, ...*",
          "科学和历史书的作者知道读者会遇到难词，所以会在句子里解释它们。\n\n- **重述**用更简单的词把这个词再说一遍，常放在 *or*、*that is*、*in other words* 或 *which means* 后面，或者放在两个逗号之间：*Magma, or melted rock, rises slowly.*\n- **举例**线索列出这个词所指类别中的成员，放在 *such as*、*like*、*including* 或 *for example* 后面：*Igneous rocks, such as granite and basalt, ...*",
        ),
        itemGenerator(clueFindBank),
      ),
      point(
        "meaning-from-restatement-and-examples",
        t("Meaning from the Clue", "从线索推断词义"),
        t(
          "Once you find the clue, use it. A restatement hands you the meaning: put it in place of the hard word and read the sentence again. Examples need one more step: ask what the examples have in common, and that is what the word names. *Granite and basalt* are both rocks that were once melted, so *igneous* means made from melted rock.",
          "找到线索后就要用上它。重述直接给出意思：把它放在难词的位置上，再读一遍句子。举例还要多一步：问问这些例子有什么共同点，那就是这个词所指的东西。*granite* 和 *basalt* 都是曾经熔化过的岩石，所以 *igneous* 的意思是由熔岩形成的。",
        ),
        itemGenerator(clueMeaningBank),
      ),
    ],
  },
  {
    id: "greek-and-latin-roots-of-the-body",
    title: t("Greek and Latin Roots of the Body", "关于身体的希腊语和拉丁语词根"),
    summary: t(
      "Roots such as cardi (heart), derm (skin), dent (tooth) and audi (hear) build many words of the body and of medicine.",
      "cardi（心脏）、derm（皮肤）、dent（牙齿）、audi（听）这样的词根构成了许多关于身体和医学的词。",
    ),
    prerequisites: ["greek-roots-1", "latin-roots-1"],
    encompasses: [
      { topic: "greek-roots-1", weight: 0.2 },
      { topic: "latin-roots-1", weight: 0.2 },
    ],
    xp: 14,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "meanings-of-body-roots",
        t("What the Roots Mean", "词根的意思"),
        t(
          "Doctors and scientists name parts of the body with old Greek and Latin roots:\n\n- *cardi*: heart · *derm*: skin · *dent*: tooth · *ped*, *pod*: foot · *manu*: hand\n- *ocul*, *opt*: eye · *pulmo*: lung · *gastr*: stomach · *neur*: nerve · *audi*: hear\n\nFind the root inside a long word, and you know what part of the body it is about.",
          "医生和科学家用古希腊语和拉丁语词根给身体部位命名：\n\n- *cardi*：心脏 · *derm*：皮肤 · *dent*：牙齿 · *ped*、*pod*：脚 · *manu*：手\n- *ocul*、*opt*：眼睛 · *pulmo*：肺 · *gastr*：胃 · *neur*：神经 · *audi*：听\n\n在长词中找到词根，就知道它和身体的哪个部分有关。",
        ),
        itemGenerator(rootMeaningBank),
      ),
      point(
        "words-from-body-roots",
        t("Words Built from the Roots", "由词根构成的词"),
        t(
          "To work out a word, find its root and then the rest: *-ist* and *-ologist* name a person, *-al* and *-ic* mean *having to do with*, and *-ology* means *the study of*. So a *dermatologist* is a doctor of the skin, and *dental* means having to do with teeth. Watch for words that only look alike: a *dent* in a car has nothing to do with teeth.",
          "推断一个词时，先找词根，再看其余部分：*-ist* 和 *-ologist* 指人，*-al* 和 *-ic* 表示“与……有关的”，*-ology* 表示“……学”。所以 *dermatologist* 是皮肤科医生，*dental* 表示与牙齿有关的。小心那些只是看起来相像的词：车上的 *dent*（凹痕）和牙齿毫无关系。",
        ),
        itemGenerator(rootWordBank),
      ),
    ],
  },
  {
    id: "prefixes-in-im-il-and-ir",
    title: t("The Prefixes in-, im-, il- and ir-", "前缀 in-、im-、il- 和 ir-"),
    summary: t(
      "The prefix meaning not changes its spelling to fit the base word: impossible, illegal, irregular, inactive.",
      "表示“不”的前缀会根据词根改变拼写：impossible、illegal、irregular、inactive。",
    ),
    prerequisites: ["common-prefixes"],
    encompasses: [{ topic: "common-prefixes", weight: 0.2 }],
    xp: 14,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "choosing-the-form-of-the-prefix",
        t("Choosing the Form of the Prefix", "选择前缀的形式"),
        t(
          "The prefix *in-* means *not*, and it changes its last letter to match the base word, which makes the word easier to say:\n\n- *im-* before *m* and *p*: *immature*, *impossible*\n- *il-* before *l*: *illegal*, *illogical*\n- *ir-* before *r*: *irregular*, *irresponsible*\n- *in-* before other letters: *inactive*, *incorrect*, *invisible*\n\nThat is why these words have double letters: *il* + *legal* = *illegal*.",
          "前缀 *in-* 表示“不”，它会改变最后一个字母来配合词根，使单词更容易读：\n\n- *m* 和 *p* 前用 *im-*：*immature*、*impossible*\n- *l* 前用 *il-*：*illegal*、*illogical*\n- *r* 前用 *ir-*：*irregular*、*irresponsible*\n- 其他字母前用 *in-*：*inactive*、*incorrect*、*invisible*\n\n这就是这些词中有双写字母的原因：*il* + *legal* = *illegal*。",
        ),
        itemGenerator(prefixFormBank),
      ),
      point(
        "meanings-of-words-with-the-prefix",
        t("What the New Word Means", "新词的意思"),
        t(
          "Whatever its spelling, the prefix means *not*: *illegible* writing is not legible, too messy to read. Split the word into prefix and base, find what the base means, then turn it around. Be careful: *in-* can also mean *inside*, as in *indoors*, so check that *not* makes sense.",
          "不管怎么拼写，这个前缀都表示“不”：*illegible* 的字迹就是不清楚、乱得看不懂的字迹。把单词拆成前缀和词根，找出词根的意思，再把它反过来。要小心：*in-* 也可以表示“在里面”，例如 *indoors*，所以要检查“不”的意思是否讲得通。",
        ),
        itemGenerator(prefixMeaningBank),
      ),
    ],
  },
  {
    id: "using-a-thesaurus",
    title: t("Using a Thesaurus", "使用同义词词典"),
    summary: t(
      "A thesaurus lists words of similar meaning, which differ in strength and use, so a writer chooses the one that fits.",
      "同义词词典列出意思相近的词，它们在程度和用法上不同，所以作者要选择合适的那个。",
    ),
    prerequisites: after("using-a-dictionary-and-glossary"),
    // The outline also names synonyms-and-antonyms; its stand-in, context-clues, is implied by the stand-in of this one.
    encompasses: [],
    xp: 14,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "choosing-a-synonym-that-fits",
        t("Choosing the Synonym That Fits", "选择合适的同义词"),
        t(
          "A **thesaurus** lists synonyms for a word: under *walk* you might find *stroll*, *march*, *tiptoe*, *stagger* and *stride*. They are not all the same. Each has a **shade of meaning**: *stroll* is slow and relaxed, *march* is in step, *tiptoe* is quiet. Read the sentence for clues, then pick the synonym whose shade matches them.",
          "**同义词词典**列出一个词的同义词：在 *walk* 下面你可能找到 *stroll*、*march*、*tiptoe*、*stagger* 和 *stride*。它们并不完全相同，各有**细微的意思差别**：*stroll* 是悠闲地慢走，*march* 是齐步走，*tiptoe* 是轻手轻脚地走。读句子找线索，再挑选细微意思与线索相符的同义词。",
        ),
        itemGenerator(fitBank),
      ),
      point(
        "rejecting-the-wrong-shade",
        t("Rejecting the Wrong Shade", "排除意思不合适的词"),
        t(
          "A thesaurus never tells you which synonym to use. Some are stronger (*furious* is angrier than *annoyed*), some are softer, and some fit only certain things (*roomy* is about space inside). Try each one in the sentence and reject the one whose shade of meaning does not match.",
          "同义词词典从不告诉你该用哪个同义词。有的程度更强（*furious* 比 *annoyed* 更生气），有的更弱，有的只适用于某些事物（*roomy* 说的是内部空间）。把每个词放进句子里试一试，排除细微意思不相符的那个。",
        ),
        itemGenerator(oddBank),
      ),
    ],
  },
  {
    id: "suffixes-for-people",
    title: t("Suffixes for People", "表示人的后缀"),
    summary: t(
      "The suffixes -ist, -ian, -or, -er, -eer and -ant make a word for a person who does something: scientist, historian, inventor.",
      "后缀 -ist、-ian、-or、-er、-eer 和 -ant 构成表示做某事的人的词：scientist、historian、inventor。",
    ),
    prerequisites: ["common-suffixes"],
    encompasses: [{ topic: "common-suffixes", weight: 0.2 }],
    xp: 14,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "choosing-the-person-word",
        t("Choosing the Person-Word", "选择表示人的词"),
        t(
          "Several suffixes make a word for a person who does something:\n\n- *-ist*: *scientist*, *artist*, *cyclist*\n- *-ian*: *historian*, *librarian*, *musician*\n- *-or*: *inventor*, *actor*, *sculptor*\n- *-er*: *teacher*, *explorer*, *farmer*\n- *-eer*: *pioneer*, *engineer*, *volunteer*\n- *-ant*: *assistant*, *servant*, *contestant*\n\nEach word takes one suffix, so learn them as you meet them.",
          "有几个后缀能构成表示做某事的人的词：\n\n- *-ist*：*scientist*、*artist*、*cyclist*\n- *-ian*：*historian*、*librarian*、*musician*\n- *-or*：*inventor*、*actor*、*sculptor*\n- *-er*：*teacher*、*explorer*、*farmer*\n- *-eer*：*pioneer*、*engineer*、*volunteer*\n- *-ant*：*assistant*、*servant*、*contestant*\n\n每个词只用一种后缀，所以遇到时就记住它们。",
        ),
        itemGenerator(personFormBank),
      ),
      point(
        "meanings-of-person-words",
        t("What a Person-Word Means", "表示人的词的意思"),
        t(
          "When a word ends in one of these suffixes, it usually names a person, and the rest of the word tells what they do: a *historian* studies history, a *sculptor* makes sculptures, a *contestant* takes part in a contest. In a biography such words tell you at once what someone's work was.",
          "一个词以这些后缀结尾时，通常指人，词的其余部分说明他们做什么：*historian* 研究历史，*sculptor* 制作雕塑，*contestant* 参加比赛。在传记里，这些词能让你立刻知道一个人从事什么工作。",
        ),
        itemGenerator(personMeaningBank),
      ),
    ],
  },
];
