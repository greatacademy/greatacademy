// Grade 4: the writing topics of informational texts checked by rules: notes into sentences, linking words, headings,
// facts, definitions and examples, the order of paragraphs, paraphrase, facts behind reasons, outlines, hooks and sources.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, findKind, type Item, itemGenerator, type Kind, nameKind, pick, range } from "./kit.ts";
import { after } from "./prior.ts";

/** list joins phrases with commas and a final "and". */
const list = (parts: readonly string[]) => (parts.length < 2 ? (parts[0] ?? "") : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`);

// Turning notes into sentences.

const noteLines = `
  camels: fat stored in humps; days without water; noses close in sandstorms|Camels|store fat in their humps;can go for days without water;close their noses in sandstorms|1|can go for many months without water or food|are the tallest animals in the desert
  cactus: stores water in stem; spines instead of leaves; roots spread wide|A cactus|stores water in its thick stem;has spines instead of leaves;spreads its roots wide under the ground|0|stores water in its sharp yellow spines and flowers|can live for hundreds of years
  polar bears: black skin; thick fat; swim long distances|Polar bears|have black skin under their fur;keep warm with a thick layer of fat;can swim long distances|2|can swim only a few short meters in the sea|eat mostly seals
  rainforest: half of world's plants and animals; rain almost every day; tall canopy|The rainforest|is home to about half of the world's plants and animals;gets rain almost every day;has a tall canopy of treetops|1|gets rain only once or twice in a whole year|is found near the equator
  volcanoes: magma rises; lava pours out; ash blocks sunlight|At a volcano|magma rises from deep underground;lava pours out of a vent;ash can block the sunlight|2|ash makes the sunlight much brighter and hotter|people sometimes live nearby
  heart: size of a fist; beats about 100,000 times a day; pumps blood|The heart|is about the size of a fist;beats about 100,000 times a day;pumps blood around the body|0|is about the size of a big watermelon or a football|is a muscle
  bones: 206 in adult; protect organs; marrow makes blood cells|An adult's skeleton|has 206 bones;protects the organs inside the body;makes blood cells in the marrow|0|has more than two thousand tiny bones in all|grows until about age twenty
  solar panels: turn sunlight into electricity; no smoke; work best at midday|Solar panels|turn sunlight into electricity;make no smoke;work best at midday|2|work best in the middle of the night, when it is cool|can sit on rooftops
  wind turbines: blades turn in wind; shaft spins generator; best on hills and coasts|In a wind turbine|the blades turn in the wind;a shaft spins a generator;the best places are hills and coasts|1|a shaft spins a battery that stores the rain|the blades are very long
  Silk Road: linked China and Europe; carried silk and spices; also spread ideas|The Silk Road|linked China and Europe;carried goods such as silk and spices;spread ideas from land to land|0|linked China only with the islands of Japan|was used for over a thousand years
  castles: stone walls; moats; great hall for meals|Castles|had thick stone walls;were often circled by moats;had a great hall where people ate|0|had thin walls made of paper and straw|took many years to build
  knights: trained from age seven; wore armor; served a lord|Knights|began training at about age seven;wore armor in battle;served a lord|2|served only themselves and never a lord or king|rode large horses
  Marie Curie: born in Poland; studied radium; won two Nobel Prizes|Marie Curie|was born in Poland;studied radium;won two Nobel Prizes|2|won one small prize for her painting|worked with her husband
  Louis Braille: blind from age three; invented raised-dot alphabet at fifteen; taught at a school for the blind|Louis Braille|was blind from the age of three;invented an alphabet of raised dots when he was fifteen;taught at a school for blind children|1|invented a new kind of loud musical instrument|played the organ
  deserts: less than 25 cm of rain a year; hot days; cold nights|Deserts|get less than 25 centimeters of rain a year;have hot days;can have cold nights|2|have hot nights that are even warmer than the days|cover about a third of the land
  tundra: frozen ground; short summers; no tall trees|The tundra|has frozen ground;has short summers;has no tall trees|2|is covered with very tall trees and thick forests|is home to caribou
  earthquakes: plates move; ground shakes; can cause tsunamis|In an earthquake|the plates of the crust move;the ground shakes;a tsunami can follow|1|the ground stays still while the sky shakes|most last less than a minute
  fossils: remains of old life; found in rock; show how life changed|Fossils|are the remains of living things from long ago;are found in rock;show how life has changed|1|are found only floating in clouds and seawater|can be tiny or huge
  lungs: take in oxygen; give out carbon dioxide; about 20,000 breaths a day|The lungs|take in oxygen;give out carbon dioxide;fill about 20,000 times a day|0|take in only salt water and sand|sit inside the ribs
  muscles: over 600; work in pairs; heart is a muscle|The body|has more than 600 muscles;moves when muscles work in pairs;has a muscle in the heart|1|moves when every muscle works completely alone|grows stronger with exercise
  bees: visit flowers; make honey; dance to share where food is|Bees|visit flowers;make honey;dance to show where food is|2|sing loud songs to show where food is|live in hives
  paper: invented in China; made from bark and rags; reached Europe in 1100s|Paper|was invented in China;was first made from bark and old rags;reached Europe in the 1100s|0|was invented in a small town in Antarctica|is still made from trees
  Great Wall: thousands of kilometers; built over many centuries; guarded northern border|The Great Wall|stretches thousands of kilometers;was built over many centuries;guarded the northern border|1|was built in a single afternoon by one man|has watchtowers
  plays: cast, dialogue, stage directions; acted on a stage; divided into scenes|A play|has a cast, dialogue and stage directions;is acted on a stage;is divided into scenes|1|is acted only in a library by one silent reader|can be funny or sad
  paintings in caves: made about 40,000 years ago; animals shown; colors from earth and charcoal|Cave paintings|were made as long as 40,000 years ago;often show animals;used colors from earth and charcoal|2|used bright plastic paints bought in shops|are found on many continents
  sound: made by vibrations; travels through air and water; cannot travel through space|Sound|is made by vibrations;travels through air and water;cannot travel through empty space|2|travels best of all through empty space|can echo off walls
  light: travels in straight lines; fastest thing known; bends in water|Light|travels in straight lines;is the fastest thing known;bends as it passes into water|1|is much slower than a walking turtle|comes from the sun
  recycling: saves energy; less trash; aluminum can be recycled again and again|Recycling|saves energy;means less trash;lets aluminum be used again and again|0|wastes far more energy than making new things|is easy to do at home
  Wangari Maathai: from Kenya; planted millions of trees; won Nobel Peace Prize|Wangari Maathai|came from Kenya;helped plant millions of trees;won the Nobel Peace Prize|1|cut down millions of trees to build cities|taught at a university
  Zhang Heng: Han dynasty; built earthquake detector; studied stars|Zhang Heng|lived in the Han dynasty;built an earthquake detector;studied the stars|1|built the first car that ran on steam|wrote poems
`;

const notes = fields(noteLines).map(([note, subject, preds, c, changed, extra]) => {
  const ps = (preds ?? "").split(";").map((p) => p.trim());
  const ci = Number(c);
  if (!note || !subject || ps.length !== 3 || !(ci >= 0 && ci < 3) || !changed || !extra)
    throw new Error(`a note line needs six fields: ${note}`);
  return { note, subject, preds: ps, ci, changed, extra };
});

const sentenceOf = (subject: string, preds: readonly string[]) => `${subject} ${list(preds)}.`;

/** keepsAllBank asks for the sentence that keeps every fact of a note without changing any. */
const keepsAllBank: readonly Item[] = notes.flatMap((n) =>
  [0, 1, 2].map((dropped) => {
    const right = sentenceOf(n.subject, n.preds);
    const changedPreds = n.preds.map((p, i) => (i === n.ci ? n.changed : p));
    const drop = sentenceOf(
      n.subject,
      n.preds.filter((_, i) => i !== dropped),
    );
    const change = sentenceOf(n.subject, changedPreds);
    return {
      question: t(
        "Which sentence keeps all the facts of the note, without changing any?",
        "哪个句子保留了笔记中的所有事实，而且一个也没改？",
      ),
      shown: `Note: ${n.note}`,
      right,
      wrong: [drop, change],
      why: t(
        "This sentence turns every part of the note into a complete sentence in the writer's own words, and every fact stays true to the note.\n\n**Check.** Tick off all three facts in the note one by one—every single one appears accurately in this sentence.",
        "这个句子用写作者自己的话把笔记的每一部分都写成了完整的句子，每个事实都和笔记一致。\n\n**检验。** 对照笔记里的三条信息逐一打勾——三条都在这句话里准确呈现，没有遗漏或改动。",
      ),
      whyNot: [
        t(
          `This leaves out a fact: the note also says that ${n.subject.toLowerCase().replace(/^(in|at) (a|an|the) /, "")} ${n.preds[dropped]}.`,
          `这里漏掉了一个事实：笔记中还写了“${n.preds[dropped]}”。`,
        ),
        t(
          `This changes a fact: the note says ${n.preds[n.ci]}, not ${n.changed}.`,
          `这里改动了一个事实：笔记说的是“${n.preds[n.ci]}”，而不是“${n.changed}”。`,
        ),
      ],
    };
  }),
);

/** addsNothingBank asks for the sentence that adds nothing the note does not say. */
const addsNothingBank: readonly Item[] = notes.map((n) => {
  const right = sentenceOf(n.subject, n.preds);
  const add = sentenceOf(n.subject, [...n.preds, n.extra]);
  const change = sentenceOf(
    n.subject,
    n.preds.map((p, i) => (i === n.ci ? n.changed : p)),
  );
  return {
    question: t("Which sentence adds nothing that the note does not say?", "哪个句子没有加上笔记里没有的内容？"),
    shown: `Note: ${n.note}`,
    right,
    wrong: [add, change],
    why: t(
      "This sentence says only what the note says. When notes become sentences, the writer may change the words but must not add facts or change them.\n\n**Check.** Match every claim in the sentence back to the note—nothing extra was slipped in, and no fact was altered.",
      "这个句子只说了笔记里写的内容。把笔记写成句子时，可以换说法，但不能添加或改动事实。\n\n**检验。** 把句中每一处说法都回对到笔记——既没有多塞信息，也没有改动原事实。",
    ),
    whyNot: [
      t(
        `This adds a fact the note does not give: ${n.extra}. It may even be true, but it did not come from the note.`,
        `这里加了一个笔记中没有的事实：“${n.extra}”。它也许是真的，但并非来自笔记。`,
      ),
      t(
        `This says ${n.changed}, which the note does not say: the note says ${n.preds[n.ci]}.`,
        `这里说的是“${n.changed}”，笔记里并没有这样写：笔记写的是“${n.preds[n.ci]}”。`,
      ),
    ],
  };
});

// Linking words for information.

const linkKinds: Readonly<Record<string, Kind>> = {
  "adds another point": {
    zh: "补充另一点",
    is: [
      "Words such as also, in addition and another add a point of the same kind.",
      "also、in addition、another 这类词补充同一类的另一点。",
    ],
  },
  "gives an example": {
    zh: "举例",
    is: [
      "Words such as for example and for instance introduce an example of what came before.",
      "for example、for instance 这类词引出前面所说内容的例子。",
    ],
  },
  "gives a cause": {
    zh: "说明原因",
    is: [
      "Words such as this is because and the reason is tell why the first thing happens.",
      "this is because、the reason is 这类词说明前面的事为什么发生。",
    ],
  },
  "gives a result": {
    zh: "说明结果",
    is: [
      "Words such as as a result and therefore tell what happens because of the first thing.",
      "as a result、therefore 这类词说明前面的事导致了什么。",
    ],
  },
};

const linkWords: Readonly<Record<string, readonly string[]>> = {
  "adds another point": ["In addition", "Also"],
  "gives an example": ["For example", "For instance"],
  "gives a cause": ["This is because", "The reason is that"],
  "gives a result": ["As a result", "Therefore"],
};

const linkLines = `
  Camels are well suited to the desert.|In addition|they can close their noses to keep out sand.|adds another point
  Many desert animals stay out of the sun.|For example|the fennec fox sleeps in a cool burrow all day.|gives an example
  The rainforest floor is very dark.|This is because|the thick canopy blocks most of the sunlight.|gives a cause
  The tundra's ground stays frozen all year.|As a result|tall trees cannot put down deep roots there.|gives a result
  Exercise is good for the heart.|Also|it helps people sleep better at night.|adds another point
  Some foods give the body quick energy.|For instance|a banana can power a runner for a short race.|gives an example
  Your muscles feel tired after a long run.|This is because|they have used up much of their fuel.|gives a cause
  The heart pumps blood all day and night.|Therefore|every part of the body gets the oxygen it needs.|gives a result
  Solar panels make clean electricity.|In addition|they cost nothing to run once they are in place.|adds another point
  There are many ways to save energy at home.|For example|you can switch off the lights when you leave a room.|gives an example
  Old light bulbs waste a lot of energy.|The reason is that|they turn most of it into heat instead of light.|gives a cause
  The town built ten wind turbines on the hill.|As a result|it now makes most of its own electricity.|gives a result
  Castles had thick stone walls.|Also|many were circled by deep moats full of water.|adds another point
  Knights trained for many years.|For instance|a boy began as a page when he was only seven.|gives an example
  Many castles were built on hills.|This is because|attackers could be seen coming from far away.|gives a cause
  The Black Death spread quickly through the towns.|As a result|about a third of the people of Europe died.|gives a result
  Silk was very valuable in Rome.|In addition|spices from the East sold for high prices.|adds another point
  Many ideas traveled along the Silk Road.|For example|the secret of making paper slowly moved west.|gives an example
  Caravans used camels to cross the desert.|The reason is that|camels can carry heavy loads without much water.|gives a cause
  China kept the secret of silk for centuries.|Therefore|other lands had to buy their silk from China.|gives a result
  Artists of long ago made their own paints.|Also|they made brushes from animal hair and reeds.|adds another point
  Some colors came from plants.|For instance|indigo leaves gave a deep blue dye.|gives an example
  Cave paintings have lasted thousands of years.|This is because|the caves kept them safe from wind and rain.|gives a cause
  The museum kept the old paintings in dim light.|As a result|their colors have not faded.|gives a result
  A play needs actors.|In addition|it needs people to build the sets and make the costumes.|adds another point
  Stage directions tell actors what to do.|For example|they may say that a character enters or whispers.|gives an example
  The actors rehearsed every day for a month.|Therefore|they knew every line by heart on opening night.|gives a result
  The audience laughed all through the play.|The reason is that|the actors were so funny as the clumsy twins.|gives a cause
  Volcanoes can be dangerous.|Also|the ash they throw out can damage crops far away.|adds another point
  The Earth's surface changes all the time.|For instance|rivers slowly carve deep canyons out of rock.|gives an example
  Mountains wear down over millions of years.|This is because|wind, water and ice break the rock into pieces.|gives a cause
  Heavy rain soaked the hillside for days.|As a result|the soil slid down and blocked the road.|gives a result
`;

const linkRows = fields(linkLines).map(([first, word, second, kind]) => {
  if (!first || !word || !second || !kind || !linkWords[kind]?.includes(word))
    throw new Error(`a link line needs a known word and kind: ${first}`);
  return { first, word, second, kind };
});

const linked = (first: string, word: string, second: string) =>
  `${first} ${word}${word.endsWith("that") || word.endsWith("because") ? "" : ","} ${second}`;

/** linkGapBank asks for the linking word that joins two sentences. */
const linkGapBank: readonly Item[] = linkRows.map((r, i) => {
  const others = Object.keys(linkWords).filter((k) => k !== r.kind);
  const wrongKinds = [pick(others, i), pick(others, i + 1)];
  const wrong = wrongKinds.map((k, n) => pick(linkWords[k] ?? [], i + n));
  return {
    question: t("Which linking words best join these two sentences?", "哪个连接词最适合连接这两个句子？"),
    shown: `${r.first} ___ ${r.second}`,
    right: r.word,
    wrong,
    why: t(
      `**${r.word}** fits: the second sentence ${r.kind.replace("adds", "adds").replace(/^gives/, "gives")} to the first. ${linkKinds[r.kind]?.is[0]}\n\n**Check.** Read the two sentences joined by **${r.word}**—the logic between them flows naturally, whereas the other two linkers twist that relationship.`,
      `**${r.word}** 合适：第二句${linkKinds[r.kind]?.zh}。${linkKinds[r.kind]?.is[1]}\n\n**检验。** 用 **${r.word}** 把两句话连起来读——前后逻辑顺畅自然，而另外两个连接词会扭曲句间关系。`,
    ),
    whyNot: wrong.map((w, n) =>
      t(
        `“${w}” would mean the second sentence ${wrongKinds[n]}, but that is not how the two sentences are related.`,
        `“${w}”表示第二句${linkKinds[wrongKinds[n] ?? ""]?.zh}，但两句话之间不是这种关系。`,
      ),
    ),
  };
});

const linkKindLines = linkRows.map((r) => `${linked(r.first, `**${r.word}**`, r.second)}|${r.kind}`).join("\n");

// Choosing headings.

const reportLines = `
  Camels|Camels store fat in their humps. When food is scarce, their bodies use the fat for energy.|Stored Fat in the Hump
  Camels|Long eyelashes and closing noses keep sand out. Wide, flat feet do not sink into the dunes.|Built for Sandstorms and Dunes
  Camels|For thousands of years camels carried traders and their goods. Caravans of hundreds crossed the desert together.|Camels and the Caravans
  The Rainforest|The tallest trees rise above the rest. Eagles nest in their branches high above the forest.|The Emergent Layer
  The Rainforest|Beneath the tallest trees, the treetops form a thick green roof. Most of the forest's animals live here.|The Canopy
  The Rainforest|Very little light reaches the ground. Fallen leaves rot quickly and feed the soil.|The Forest Floor
  Your Heart|Your heart is about the size of your fist. It sits in your chest, a little to the left.|Size and Place
  Your Heart|With every beat, the heart pushes blood through tubes called arteries and veins.|How Blood Travels
  Your Heart|Running, swimming and playing keep the heart strong. So does eating fruit and vegetables.|Keeping Your Heart Healthy
  Wind Power|Long blades catch the wind and turn a shaft. The shaft spins a generator that makes electricity.|How a Turbine Works
  Wind Power|Turbines work best on hills, along coasts and out at sea, where the wind is strong and steady.|The Best Places for Turbines
  Wind Power|Wind power makes no smoke. But turbines can be noisy, and some people dislike how they look.|Good Points and Problems
  Castles|Castles were built of thick stone. A moat and a drawbridge kept attackers away from the gate.|Walls and Moats
  Castles|The lord and his family ate in the great hall. Servants cooked in a kitchen close by.|Daily Life in the Castle
  Castles|When an army attacked, the people inside shut the gates and lived on stored food for months.|Under Siege
  The Silk Road|Merchants traded silk, spices, porcelain and horses. A good could change hands many times on its way.|Goods for Trade
  The Silk Road|Deserts, mountains and bandits made the trip dangerous. Many travelers never reached the end.|Dangers on the Road
  The Silk Road|Religions, inventions and stories traveled with the merchants from land to land.|Ideas on the Move
  Making Paints|Long ago, artists ground colored rocks and earth into powder to make paint.|Colors from the Earth
  Making Paints|Some of the brightest colors came from plants, such as indigo for blue and madder root for red.|Colors from Plants
  Making Paints|The powder was mixed with egg, oil or water so that it would stick to the wall or canvas.|Mixing the Paint
  Putting On a Play|The director chooses the actors. Each actor reads a few lines at an audition.|Choosing the Cast
  Putting On a Play|For weeks, the cast practices their lines and moves until they know them by heart.|Rehearsals
  Putting On a Play|On opening night the curtain rises. The actors hope for a full house and loud applause.|Opening Night
  Mary Anning|Mary Anning grew up in a poor family by the sea in England. She and her father searched the cliffs for fossils to sell.|Early Life
  Mary Anning|At twelve, she and her brother found the skull of a great sea reptile that no one had seen before.|A Great Discovery
  Mary Anning|Today scientists honor her as one of the first great fossil hunters.|How She Is Remembered
  Earthquakes|The Earth's crust is broken into huge plates. When they slip past each other, the ground shakes.|What Causes Earthquakes
  Earthquakes|Scientists measure earthquakes with instruments called seismographs.|Measuring a Quake
  Earthquakes|Strong buildings and drills help people stay safe. If you feel shaking, drop, cover and hold on.|Staying Safe
`;

const sections = fields(reportLines).map(([report, text, heading]) => {
  if (!report || !text || !heading) throw new Error(`a section needs three fields: ${report}`);
  return { report, text, heading };
});

/** siblings lists the other sections of the same report. */
const siblings = (s: (typeof sections)[number]) => sections.filter((o) => o.report === s.report && o !== s);

/** headingBank asks for the heading that fits a section. */
const headingBank: readonly Item[] = sections.map((s) => {
  const others = siblings(s);
  return {
    question: t(
      `This section is from a report on ${s.report.toLowerCase()}. Which heading fits it?`,
      `这一部分出自一篇关于 ${s.report} 的报告。哪个小标题适合它？`,
    ),
    shown: s.text,
    right: s.heading,
    wrong: others.map((o) => o.heading),
    why: t(
      `“${s.heading}” fits: a heading names in a few words what the whole section is about.\n\n**Check.** Re-read every sentence in the section—each one directly tells about “${s.heading}”, not the other two headings.`,
      `“${s.heading}”合适：小标题用几个词说出这一部分讲的是什么。\n\n**检验。** 重读这一段的每一句话——每一句都在讲“${s.heading}”，而不是另外两个小标题的内容。`,
    ),
    whyNot: others.map((o, idx) =>
      idx === 0
        ? t(
            `“${o.heading}” names a different section of the report—the sentences above are not about that.`,
            `“${o.heading}”是报告另一部分的小标题，上面这段话讲的不是它。`,
          )
        : t(
            `This section never discusses “${o.heading}”—match the heading to what every sentence in the paragraph actually covers.`,
            `这一段没有讲到“${o.heading}”——小标题要概括全段实际写的内容。`,
          ),
    ),
  };
});

/** sectionBank asks for the section that belongs under a heading. */
const sectionBank: readonly Item[] = sections.map((s) => {
  const others = siblings(s);
  return {
    question: t(
      `In a report on ${s.report.toLowerCase()}, which section belongs under the heading “${s.heading}”?`,
      `在一篇关于 ${s.report} 的报告中，哪一部分应该放在小标题“${s.heading}”下面？`,
    ),
    shown: "",
    right: s.text,
    wrong: others.map((o) => o.text),
    why: t(
      `This section is about what the heading names, so it belongs under “${s.heading}”.\n\n**Check.** Compare the heading “${s.heading}” with the key details in this paragraph—they match directly.`,
      `这一部分讲的正是小标题所说的内容，所以应放在“${s.heading}”下面。\n\n**检验。** 把小标题“${s.heading}”和本段的关键信息对照——两者直接对应。`,
    ),
    whyNot: others.map((o) =>
      t(`This section belongs under another heading: “${o.heading}”.`, `这一部分应该放在另一个小标题下面：“${o.heading}”。`),
    ),
  };
});

// Facts, definitions and examples.

const developKinds: Readonly<Record<string, Kind>> = {
  "a fact": {
    zh: "事实",
    is: [
      "It gives a true piece of information that can be checked, often with a number or a name.",
      "它给出一条可以核实的真实信息，常常带有数字或名称。",
    ],
  },
  "a definition": {
    zh: "定义",
    is: ["It tells what a word means, often with is, means or is called.", "它说明一个词的意思，常用 is、means 或 is called。"],
  },
  "an example": {
    zh: "例子",
    is: [
      "It names one case of the point, often after for example, for instance or such as.",
      "它举出这个观点的一个具体事例，常在 for example、for instance 或 such as 后面。",
    ],
  },
};

const developLines = `
  The Sahara is the largest hot desert in the world, about the size of the United States.|a fact
  A desert is a place that gets less than 25 centimeters of rain in a year.|a definition
  Many desert animals are active at night; the fennec fox, for example, hunts after sunset.|an example
  The Amazon rainforest covers more than five million square kilometers.|a fact
  The canopy is the thick roof of leaves formed by the treetops of a forest.|a definition
  Some rainforest plants grow on other plants; orchids, for instance, cling to high branches.|an example
  An adult human heart beats about 100,000 times a day.|a fact
  Arteries are the tubes that carry blood away from the heart.|a definition
  Some foods help build strong bones; milk and yogurt, for example, are full of calcium.|an example
  The human body has 206 bones.|a fact
  A joint is a place where two bones meet and move.|a definition
  Some joints swing like hinges, such as the ones in your knees and elbows.|an example
  The Three Gorges Dam is the largest power station in the world.|a fact
  Renewable energy is energy that comes from a source that will not run out.|a definition
  Wind and sunlight are examples of renewable energy.|an example
  Building a large castle could take more than ten years.|a fact
  A moat is a deep ditch, usually filled with water, around the walls of a castle.|a definition
  Some castles were built on islands; for instance, one in France stands on a rock in the sea.|an example
  The Silk Road stretched more than 6,000 kilometers.|a fact
  A caravan is a group of travelers and animals journeying together.|a definition
  Merchants traded many goods, such as silk, spices and porcelain.|an example
  The oldest known cave paintings are more than 40,000 years old.|a fact
  A portrait is a painting or drawing of a person.|a definition
  Artists use many materials; for example, some sculptors carve wood and others shape clay.|an example
  The Globe Theatre in London was first built in 1599.|a fact
  A rehearsal is a practice of a play before it is performed for an audience.|a definition
  Some plays are comedies, such as stories of mixed-up twins.|an example
  Mount Everest rises 8,849 meters above sea level.|a fact
  Erosion is the slow wearing away of land by wind, water or ice.|a definition
  Rivers can carve deep valleys; the Grand Canyon, for instance, was cut by the Colorado River.|an example
  Light travels about 300,000 kilometers in one second.|a fact
  An opaque object is one that light cannot pass through.|a definition
  Some materials let light through, such as glass and clear water.|an example
`;

// Ordering paragraphs.

/** Report is a short report of four paragraphs in order, with the kind of order they follow. */
interface Report {
  readonly title: string;
  readonly order: readonly [en: string, zh: string];
  readonly paragraphs: readonly [string, string, string, string];
}

const orders = {
  general: ["from general to specific", "从概括到具体"],
  time: ["in time order", "按时间顺序"],
  problem: ["from problem to solution", "从问题到解决办法"],
} as const;

const orderLines = `
  Deserts|general|Deserts cover about a third of the land on Earth.|There are hot deserts, such as the Sahara, and cold ones, such as the Gobi.|The Sahara is the largest hot desert, stretching across North Africa.|In the Sahara, some sand dunes are taller than a forty-story building.
  The Life of a Volcano|time|Deep underground, hot magma slowly collects in a chamber.|Over many years, pressure builds as more magma pushes in.|At last the volcano erupts, sending lava and ash into the air.|Afterward, the lava cools into new rock, and plants slowly return.
  Saving Water at School|problem|Our school wastes thousands of liters of water every week.|Taps are left running, and some toilets leak all day.|Our class suggests fixing the leaks and putting signs above every sink.|With these changes, the school could save enough water to fill a swimming pool each year.
  The Human Body|general|The human body is made of many systems that work together.|One of these is the skeleton, which holds the body up.|The skeleton has 206 bones, from the skull to the toes.|The smallest bone, in the ear, is no bigger than a grain of rice.
  How Braille Was Invented|time|Louis Braille lost his sight when he was three years old.|At ten, he went to a school for blind children in Paris.|There, at fifteen, he invented an alphabet of raised dots.|Today, people all over the world read Braille.
  Noise in the Library|problem|The town library has become too noisy for people to read.|Groups meet at the tables and talk loudly.|The librarian could open a quiet room and a separate room for groups.|Then readers could read in peace, and groups could still meet.
  Energy|general|Energy is what makes things move, grow and change.|It comes in many forms, such as heat, light and electricity.|Electricity is the form we use most in our homes.|In one home, a refrigerator uses more electricity than almost any other machine.
  A Knight's Training|time|At seven, a boy went to live in a lord's castle as a page.|At fourteen, he became a squire and cared for a knight's armor and horse.|At about twenty-one, he was made a knight in a ceremony.|After that, he served his lord in battle and in peace.
  Litter in the Park|problem|Our park is covered with litter after every weekend.|There are only two bins, and they fill up by Saturday afternoon.|The town could add more bins and empty them on Sunday mornings.|Then the park would stay clean for everyone to enjoy.
  Art Around the World|general|People in every culture have made art.|Some of the oldest art is painted on the walls of caves.|In one cave in France, artists painted hundreds of animals.|One of the horses there was drawn with just a few lines of charcoal.
`;

const reports: readonly Report[] = fields(orderLines).map(([title, kind, p1, p2, p3, p4]) => {
  const order = orders[kind as keyof typeof orders];
  if (!title || !order || !p1 || !p2 || !p3 || !p4) throw new Error(`a report needs six fields: ${title}`);
  return { title, order, paragraphs: [p1, p2, p3, p4] };
});

const paragraphScrambles = [
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
      [1, 0, 3, 2],
    ],
  },
  {
    shown: [1, 3, 2, 0],
    wrong: [
      [0, 2, 1, 3],
      [0, 1, 3, 2],
    ],
  },
] as const;

const letters = ["A", "B", "C", "D"];

/** paragraphOrderBank asks for the order of the scrambled paragraphs of a report. */
const paragraphOrderBank: readonly Item[] = reports.flatMap((r) =>
  paragraphScrambles.map((s) => {
    const label = (p: number) => letters[s.shown.indexOf(p as 0 | 1 | 2 | 3)] ?? "";
    const order = (o: readonly number[]) => o.map(label).join(", ");
    return {
      question: t(`Put the paragraphs of the report “${r.title}” in order.`, `把报告“${r.title}”的段落按顺序排列。`),
      shown: s.shown.map((p, k) => `${letters[k]}. ${r.paragraphs[p]}`).join("\n\n"),
      right: order([0, 1, 2, 3]),
      wrong: s.wrong.map(order),
      why: t(
        `The right order is ${order([0, 1, 2, 3])}: the report goes ${r.order[0]}. Find the paragraph that opens the topic, then follow the order step by step.\n\n**Check.** Read the four paragraphs in the order ${order([0, 1, 2, 3])}—each paragraph leads smoothly into the next, ${r.order[0]}.`,
        `正确的顺序是 ${order([0, 1, 2, 3])}：这篇报告${r.order[1]}展开。先找出引出话题的段落，再一步一步按顺序排。\n\n**检验。** 按 ${order([0, 1, 2, 3])} 的顺序把四段连起来读——段段衔接自然，严格${r.order[1]}推进。`,
      ),
      whyNot: s.wrong.map((o, idx) =>
        idx === 0
          ? t(
              `Starting or stepping with ${order(o)} puts a later step ahead of an earlier one, breaking the pattern (${r.order[0]}).`,
              `按 ${order(o)} 排列会把后面的步骤放到前面，打破了“${r.order[1]}”的顺序。`,
            )
          : t(
              `${order(o)} swaps two paragraphs out of order—trace how the report moves ${r.order[0]}.`,
              `${order(o)} 把其中两段的顺序颠倒了——顺着“${r.order[1]}”的线索再核对一遍。`,
            ),
      ),
    };
  }),
);

/** placeBank asks where a missing paragraph belongs in a report. */
const placeBank: readonly Item[] = reports.flatMap((r) =>
  range(4).map((missing) => {
    const rest = r.paragraphs.filter((_, i) => i !== missing);
    const places = ["before paragraph 1", "between paragraphs 1 and 2", "between paragraphs 2 and 3", "after paragraph 3"];
    const right = places[missing] ?? "";
    const wrong = [pick(places, missing + 1), pick(places, missing + 2)];
    return {
      question: t(
        `Where does this new paragraph belong in the report “${r.title}”? New paragraph: “${r.paragraphs[missing]}”`,
        `这段新内容应该放在报告“${r.title}”的哪里？新段落：“${r.paragraphs[missing]}”`,
      ),
      shown: rest.map((p, k) => `${k + 1}. ${p}`).join("\n\n"),
      right,
      wrong,
      why: t(
        `It belongs ${right}. The report goes ${r.order[0]}, and this paragraph fills that step.\n\n**Check.** Read the paragraphs right before and after ${right}—the new paragraph bridges them cleanly.`,
        `它应该放在这个位置（${right}）。这篇报告${r.order[1]}展开，这一段正好补上那一步。\n\n**检验。** 读一读这个位置前后的段落——新段落正好把上下文自然衔接起来。`,
      ),
      whyNot: wrong.map((w, idx) =>
        idx === 0
          ? t(`Placed ${w}, this paragraph would interrupt the flow (${r.order[0]}).`, `放在 ${w} 会打断文章“${r.order[1]}”的推进顺序。`)
          : t(
              `Putting it ${w} places it too early or too late for a report arranged ${r.order[0]}.`,
              `放在 ${w} 过早或过晚，不符合“${r.order[1]}”的结构安排。`,
            ),
      ),
    };
  }),
);

// Paraphrasing a sentence.

const paraphraseLines = `
  Camels can travel for days across the desert without drinking water.|Without a drink of water, a camel can cross the desert for several days.|Camels can travel for days across the desert without drinking any water.|Camels must drink water every day as they cross the desert.
  The canopy of the rainforest is home to more animals than any other layer.|More animals live in the rainforest's canopy than in any of its other layers.|The canopy of the rainforest is home to more of the animals than any other layer.|The forest floor is home to more animals than the canopy.
  Your heart pumps blood to every part of your body.|Blood reaches each part of your body because your heart pumps it there.|Your heart pumps the blood to every single part of your body.|Your lungs pump blood to every part of your body.
  Solar panels turn sunlight into electricity without making smoke.|Without any smoke, solar panels change the sun's light into electricity.|Solar panels turn the sunlight into electricity without making any smoke.|Solar panels turn sunlight into smoke instead of electricity.
  Louis Braille invented his alphabet of raised dots when he was fifteen.|At the age of fifteen, Louis Braille created a reading system of raised dots.|Louis Braille invented his own alphabet of raised dots when he was just fifteen.|Louis Braille invented his alphabet of raised dots when he was fifty.
  Castles were often built on hills so that guards could see enemies coming.|Guards could spot an enemy from far away, so castles were often put on hills.|Castles were often built on high hills so that guards could see the enemies coming.|Castles were built in valleys so that enemies could not see them.
  Traders on the Silk Road carried silk from China to markets in the West.|Silk made in China was taken west by Silk Road traders to be sold.|Traders on the Silk Road carried their silk from China to the markets in the West.|Traders on the Silk Road carried silk from the West to China.
  Volcanoes can form new islands when lava cools in the sea.|When lava cools in the ocean, it can build an island that was not there before.|Volcanoes can form brand-new islands when their lava cools in the sea.|Volcanoes always destroy islands when lava pours into the sea.
  Exercise makes your muscles stronger and helps you sleep.|You sleep better, and your muscles grow stronger, when you exercise.|Exercise makes all of your muscles stronger and also helps you sleep.|Exercise makes your muscles weaker and keeps you awake.
  Many desert plants store water in their thick stems.|A lot of plants in the desert keep water inside their fat stems.|Many desert plants store their water in their thick, fat stems.|Many desert plants store water in their thin leaves.
  The Great Wall of China was built over many hundreds of years.|Building the Great Wall of China took many centuries.|The Great Wall of China was built over many, many hundreds of years.|The Great Wall of China was built in only ten years.
  Polar bears have black skin under their white fur.|Under a polar bear's white coat, its skin is black.|Polar bears have black skin under all of their white fur.|Polar bears have white skin under their black fur.
  Knights began their training when they were about seven years old.|At around age seven, a boy started training to become a knight.|Knights began all their training when they were about seven years old.|Knights began their training when they were about seventeen years old.
  Wind turbines work best in places where the wind is strong and steady.|Places with steady, strong wind are the best spots for wind turbines.|Wind turbines work best of all in places where the wind is strong and steady.|Wind turbines work best in places where there is no wind at all.
  Cave painters made colors from crushed rocks, earth and charcoal.|To make their colors, cave painters crushed rocks and used earth and charcoal.|Cave painters made their colors from crushed rocks, earth and charcoal.|Cave painters bought their colors from shops in town.
  Light travels much faster than sound.|Sound moves far more slowly than light does.|Light travels very much faster than sound.|Sound travels much faster than light.
  Marie Curie was the first person to win two Nobel Prizes.|No one before Marie Curie had won a Nobel Prize twice.|Marie Curie was the very first person to win two Nobel Prizes.|Marie Curie was the last person to win a Nobel Prize.
  Recycling cans saves a great deal of energy.|A lot of energy is saved when cans are recycled.|Recycling cans saves a really great deal of energy.|Recycling cans wastes a great deal of energy.
  Earthquakes happen when the plates of the Earth's crust slip.|When the huge plates of the crust slip, the ground shakes in an earthquake.|Earthquakes happen when the plates of the Earth's crust suddenly slip.|Earthquakes happen when it rains too much.
  The tundra has very short summers and long, cold winters.|In the tundra, winters are long and cold, but summers are brief.|The tundra has very, very short summers and long, cold winters.|The tundra has long, hot summers and short winters.
  Paper was invented in China about two thousand years ago.|About two thousand years ago, people in China made the first paper.|Paper was first invented in China about two thousand years ago.|Paper was invented in Europe about two hundred years ago.
  Actors rehearse a play many times before opening night.|Before the first show, the actors practice the play again and again.|Actors rehearse their play many times before the opening night.|Actors perform a play once without any practice.
  Wangari Maathai helped plant millions of trees in Kenya.|Millions of trees were planted in Kenya with Wangari Maathai's help.|Wangari Maathai helped to plant millions of trees in Kenya.|Wangari Maathai cut down millions of trees in Kenya.
  Bees dance to show other bees where to find flowers.|To tell the others where flowers are, a bee does a dance.|Bees do a dance to show the other bees where to find flowers.|Bees sing to show other bees where to find flowers.
  Fossils show us what animals lived long ago.|We can learn which animals lived long ago by studying fossils.|Fossils show us all what animals lived a long time ago.|Fossils show us what animals will live in the future.
  Rivers carry sand and mud down to the sea.|Sand and mud are carried to the sea by rivers.|Rivers carry the sand and the mud down to the sea.|The sea carries sand and mud up the rivers.
  The lungs take in oxygen and give out carbon dioxide.|Oxygen comes in and carbon dioxide goes out through the lungs.|The lungs take in the oxygen and give out the carbon dioxide.|The lungs take in carbon dioxide and give out oxygen.
  Insulation keeps heat inside a house in winter.|In winter, heat stays in a house that has insulation.|Insulation keeps the heat inside of a house in the winter.|Insulation lets heat escape from a house in winter.
  Some deserts are cold, such as the Gobi in Asia.|Not every desert is hot: the Gobi, in Asia, is cold.|Some deserts are cold ones, such as the Gobi in Asia.|All deserts are hot, including the Gobi in Asia.
  Zhang Heng built a machine that could detect earthquakes far away.|A machine made by Zhang Heng could sense distant earthquakes.|Zhang Heng built a machine that could detect the earthquakes far away.|Zhang Heng built a machine that could stop earthquakes.
`;

const paraphrases = fields(paraphraseLines).map(([original, good, copy, changed]) => {
  if (!original || !good || !copy || !changed) throw new Error(`a paraphrase line needs four fields: ${original}`);
  return { original, good, copy, changed };
});

/** paraphraseBank asks for the paraphrase that keeps the meaning in new words. */
const paraphraseBank: readonly Item[] = paraphrases.map((p) => ({
  question: t("Which is the best paraphrase of this sentence?", "哪一个是这个句子最好的释义？"),
  shown: p.original,
  right: p.good,
  wrong: [p.copy, p.changed],
  why: t(
    "This paraphrase keeps every fact of the sentence but says it in new words and a new order.\n\n**Check.** Compare it against the original sentence on two counts: every fact still matches, yet the wording and sentence structure are genuinely new.",
    "这个释义保留了句子中的每个事实，但换了新的词语和新的顺序来说。\n\n**检验。** 从两方面对照原句：所有事实丝毫未变，但措辞和句式结构确实换了新说法。",
  ),
  whyNot: [
    t(
      "This copies the sentence almost word for word, with only a word or two added. A paraphrase uses new words and a new order.",
      "这几乎是逐字照抄原句，只加了一两个词。释义要用新的词语和新的顺序。",
    ),
    t(
      "This changes a fact of the sentence. A paraphrase must keep the meaning exactly.",
      "这改变了句子中的一个事实。释义必须准确地保留原意。",
    ),
  ],
}));

const paraphraseKinds: Readonly<Record<string, Kind>> = {
  "a good paraphrase": {
    zh: "好的释义",
    is: ["It keeps the meaning but uses new words and a new order.", "它保留了原意，但用了新的词语和新的顺序。"],
  },
  "copies too much": {
    zh: "照抄太多",
    is: ["It keeps the original words and order, changing only a word or two.", "它保留了原句的词语和顺序，只改了一两个词。"],
  },
  "changes the facts": {
    zh: "改变了事实",
    is: ["It says something different from the original sentence.", "它说的与原句不一样。"],
  },
};

/** paraphraseKindBank names each attempt at a paraphrase as good, copied or changed. */
const paraphraseKindBank: readonly Item[] = paraphrases.flatMap((p) =>
  (
    [
      [p.good, "a good paraphrase"],
      [p.copy, "copies too much"],
      [p.changed, "changes the facts"],
    ] as const
  ).map(([attempt, kind]) => {
    const wrong = Object.keys(paraphraseKinds).filter((k) => k !== kind);
    return {
      question: t("A student tried to paraphrase the sentence. What is the attempt?", "一个学生试着给这个句子写释义。这个尝试属于哪一种？"),
      shown: `Sentence: ${p.original}\n\nAttempt: ${attempt}`,
      right: kind,
      wrong,
      why: t(
        `It ${kind === "a good paraphrase" ? "is a good paraphrase" : kind}. ${paraphraseKinds[kind]?.is[0]}\n\n**Check.** Compare the original and the attempt side by side for both facts and wording—this label describes the exact result.`,
        `这是“${paraphraseKinds[kind]?.zh}”。${paraphraseKinds[kind]?.is[1]}\n\n**检验。** 把原句和改写并排核对事实与措辞——这个判断正好切中要点。`,
      ),
      whyNot: wrong.map((w) =>
        t(
          `Not “${w}”: ${paraphraseKinds[w]?.is[0]} Compare the attempt with the sentence word by word.`,
          `不是“${paraphraseKinds[w]?.zh}”：${paraphraseKinds[w]?.is[1]} 把尝试和原句逐词比较。`,
        ),
      ),
    };
  }),
);

// Supporting reasons with facts.

const reasonLines = `
  Our school should plant more trees, because trees keep the playground cool.|On a hot day, the ground under a tree can be ten degrees cooler than in the sun.|Trees are the most beautiful things a school can have.|Trees take many years to grow tall.
  The town should build a bike path, because biking is good exercise.|Doctors say thirty minutes of biking a day keeps the heart healthy.|Biking is much more fun than walking anywhere.|Many bikes have bells and baskets.
  Our school should switch off computers at night, because it would save money.|One school saved four hundred dollars a year by switching off its computers at night.|Leaving computers on all night is a silly habit.|Computers can be used for writing and drawing.
  The library should stay open later, because many families work until evening.|In our town, most parents finish work after five o'clock, when the library closes.|Libraries are the best places in town.|The library has thousands of books.
  We should recycle cans, because recycling saves energy.|Making a can from recycled metal uses far less energy than making one from new metal.|Everyone who cares about the Earth recycles.|Cans can hold soup, beans and juice.
  The school should have a garden, because children would learn where food comes from.|In one school garden, students grew beans and carrots and learned how plants grow.|Gardens are lovely and everyone enjoys them.|Carrots are orange.
  Our town should use solar power, because it is clean.|Solar panels make electricity without giving off any smoke.|Solar power is the coolest kind of energy.|The sun is a star.
  The school should have longer recess, because children learn better after playing.|In one study, children paid more attention in class after a longer break outside.|Recess is the best part of the day.|Recess usually happens before lunch.
  We should save water at home, because our town has had very little rain.|This year our town got only half the rain it usually gets.|Wasting water is a terrible thing to do.|Water boils at one hundred degrees.
  Our class should visit the art museum, because it would help us with our art projects.|The museum has a room of paintings by children's book artists that we are studying.|Museums are always more fun than school.|The museum has a café.
  The town should fix the old bridge, because it is no longer safe.|Engineers found three large cracks in the bridge's supports last month.|The old bridge is ugly and nobody likes it.|The bridge crosses the river.
  Our school should use LED bulbs, because they last longer.|An LED bulb can last about twenty-five times longer than an old bulb.|LED bulbs are better than anything.|Bulbs come in many shapes.
  We should walk to school more, because it cuts down on smoke from cars.|Each car trip to school adds smoke that dirties the air near the school gate.|Walking is the only good way to travel.|Some children live near the school.
  The town should open a pool, because children need to learn to swim.|Last year, half the children in our town could not swim one length of a pool.|Swimming pools are wonderful.|Pools are filled with water.
  The cafeteria should serve more fruit, because fruit gives energy.|A banana gives the body quick energy and important vitamins.|Fruit is tastier than any other food.|Bananas grow in bunches.
  Our class should have a reading corner, because it would help us read more.|In the class next door, students read twice as many books after they made a reading corner.|Reading corners are cozy and nice.|Our class has twenty-six students.
  The park should have more bins, because litter is a problem.|After last weekend, volunteers picked up twelve bags of litter from the park.|Litter is gross and nobody should drop it.|The park has a pond.
  We should turn off lights in empty rooms, because it saves energy.|Lights left on in empty rooms waste about a tenth of a school's electricity.|Leaving lights on is the worst habit.|Lights come in many colors.
  The school should start a choir, because singing helps children feel happy.|Studies show that singing in a group makes people feel calmer and happier.|Choirs are the most fun a school can have.|Choirs sing many kinds of songs.
  Our town should plant a community garden, because fresh food is hard to find here.|The nearest shop that sells fresh vegetables is ten kilometers away.|Gardens make a town look better than anything else.|Tomatoes are red.
  We should keep the school's old oak tree, because birds nest in it.|Last spring, six kinds of birds built nests in the old oak.|The oak is the best tree in the world.|Oak trees grow acorns.
  The school should buy more books about science, because students want them.|In a class survey, more students asked for science books than for any other kind.|Science books are the most interesting books of all.|Science books have pictures.
  Our town should add a crossing near the school, because the road is busy.|About four hundred cars pass the school gate every morning.|Busy roads are scary and horrible.|The road has two lanes.
  We should bring cloth bags to the shop, because plastic bags harm sea animals.|Every year, many sea turtles are hurt by plastic bags they mistake for food.|Plastic bags are ugly.|Cloth bags come in many colors.
  The school should have a quiet room, because some students need a calm place to work.|In our class, eight students said they find it hard to work in the noisy hall.|Quiet rooms are the nicest rooms.|Rooms have doors.
  Our class should learn first aid, because accidents can happen anywhere.|Last year, a student in our school helped a friend who fell, using first aid she had learned.|First aid is the most useful thing in the world.|Bandages are sold in boxes.
  The town should build a skate park, because young people need a safe place to skate.|Many teenagers now skate in the car park, where cars drive in and out.|Skating is the coolest sport ever.|Skateboards have four wheels.
  We should eat less sugar, because it is bad for teeth.|Dentists say sugar helps cause most of the holes in children's teeth.|Sugar is the worst food there is.|Sugar comes from plants.
  Our school should fix the leaking taps, because they waste water.|One leaking tap in our school wastes about twenty liters of water every day.|Leaking taps are very annoying.|Taps can be hot or cold.
  The town should keep the library, because many people use it.|Last year, more than ten thousand people borrowed books from the library.|The library is the heart of the town.|The library is made of brick.
`;

const reasons = fields(reasonLines).map(([reason, fact, opinion, unrelated]) => {
  if (!reason || !fact || !opinion || !unrelated) throw new Error(`a reason line needs four fields: ${reason}`);
  return { reason, fact, opinion, unrelated };
});

/** supportingFactBank asks for the fact that supports a reason. */
const supportingFactBank: readonly Item[] = reasons.map((r, i) => ({
  question: t("Which sentence best supports this reason?", "哪个句子最能支持这个理由？"),
  shown: r.reason,
  right: r.fact,
  wrong: [r.opinion, pick(reasons, i + 7).fact],
  why: t(
    "This is a fact, which could be checked, and it shows the reason is true. A reason is strongest with a fact or a detail behind it.\n\n**Check.** Ask two questions: Can you verify this sentence as a real fact? Does it directly back the reason given above? Both answers are yes.",
    "这是一个可以核实的事实，它证明理由是对的。有事实或细节支持的理由最有力。\n\n**检验。** 问两个问题：这句话能作为事实核实吗？它直接支撑上面的理由吗？两个答案都是“是”。",
  ),
  whyNot: [
    t(
      "This is only another opinion: it tells what someone feels, so it cannot prove the reason.",
      "这只是另一个观点：它说的是某人的感受，所以证明不了这个理由。",
    ),
    t(
      "This is a fact, but it is about another reason for another opinion, so it does not support this one.",
      "这是一个事实，但它针对的是另一个观点的另一个理由，所以支持不了这个理由。",
    ),
  ],
}));

const supportKinds = ["a fact that supports the reason", "only another opinion", "a fact that does not support it"] as const;

/** supportKindBank asks whether a sentence is a supporting fact, only an opinion or an unrelated fact. */
const supportKindBank: readonly Item[] = reasons.flatMap((r) =>
  (
    [
      [r.fact, 0],
      [r.opinion, 1],
      [r.unrelated, 2],
    ] as const
  ).map(([sentence, k]) => {
    const right = supportKinds[k];
    const wrong = supportKinds.filter((w) => w !== right);
    const whys: Readonly<Record<string, readonly [string, string]>> = {
      [supportKinds[0]]: ["It can be checked, and it shows the reason is true.", "它可以核实，并且证明理由是对的。"],
      [supportKinds[1]]: [
        "It tells a feeling or a judgment, which cannot be checked or prove anything.",
        "它说的是感受或评判，无法核实，也证明不了什么。",
      ],
      [supportKinds[2]]: ["It is true, but it is about something other than the reason.", "它是真的，但讲的是与理由无关的事。"],
    };
    return {
      question: t(
        "A writer gives this reason, then this sentence. What is the sentence?",
        "作者先给出这个理由，然后写了这个句子。这个句子属于哪一种？",
      ),
      shown: `Reason: ${r.reason}\n\nSentence: ${sentence}`,
      right,
      wrong,
      why: t(
        `It is ${right}. ${whys[right]?.[0]}\n\n**Check.** Test the sentence twice—first whether it is a checkable fact or a personal opinion, and second whether it actually proves the reason above.`,
        `${whys[right]?.[1]}\n\n**检验。** 对这个句子做两重检验——先看它是可核实的事实还是个人看法，再看它是否真正证明了上面的理由。`,
      ),
      whyNot: wrong.map((w) => t(`It is not ${w}. ${whys[w]?.[0]} This sentence is different.`, `${whys[w]?.[1]} 这个句子不是这样。`)),
    };
  }),
);

// Choosing a hook.

const hookKinds: Readonly<Record<string, Kind>> = {
  "a question": {
    zh: "提问",
    is: ["It asks the reader something, so the reader reads on to find the answer.", "它向读者提出问题，让读者想读下去寻找答案。"],
  },
  "a surprising fact": {
    zh: "惊人的事实",
    is: [
      "It gives a true fact that the reader does not expect, so they want to know more.",
      "它给出一个读者意想不到的真实事实，让读者想了解更多。",
    ],
  },
  "a short scene": {
    zh: "简短的场景",
    is: ["It drops the reader into a moment, with a person, a place and an action.", "它把读者带进一个瞬间，有人物、地点和动作。"],
  },
};

const hookLines = `
  Have you ever wondered how a camel can cross a desert without a drink?|a question|camels
  A camel can drink more than a hundred liters of water in ten minutes.|a surprising fact|camels
  The caravan had walked for six days. Then, on the seventh, the lead camel lifted its head and sniffed the wind.|a short scene|camels
  What would it be like to live in a forest where it rains almost every day?|a question|the rainforest
  The rainforest covers only a small part of the Earth, but about half of all plants and animals live there.|a surprising fact|the rainforest
  Rain drips from the leaves. Somewhere above, a monkey shrieks, and a flash of red feathers darts past.|a short scene|the rainforest
  How many times do you think your heart beats in a single day?|a question|the heart
  Your heart beats about a hundred thousand times every day, even while you sleep.|a surprising fact|the heart
  Maya's heart thumped as she reached the top of the hill. She pressed her hand to her chest and felt it race.|a short scene|the heart
  What if the wind could light up your house?|a question|wind power
  One large wind turbine can make enough electricity for about a thousand homes.|a surprising fact|wind power
  The giant blades turned slowly above the hill, whooshing as they cut through the wind.|a short scene|wind power
  Would you have wanted to live in a castle?|a question|castles
  The walls of some castles were so thick that whole rooms were built inside them.|a surprising fact|castles
  The guard on the tower squinted into the dawn. Far off, a line of torches was moving toward the castle.|a short scene|castles
  How did silk from China end up in the markets of Rome?|a question|the Silk Road
  In ancient Rome, silk was so valuable that it cost as much as gold.|a surprising fact|the Silk Road
  The merchant pulled his scarf over his face as the sandstorm roared toward the caravan.|a short scene|the Silk Road
  Why would someone paint on the wall of a dark cave?|a question|cave art
  Some cave paintings are more than forty thousand years old.|a surprising fact|cave art
  By the flicker of a small lamp, the painter pressed her hand to the rock and blew red dust around it.|a short scene|cave art
  What does it take to put on a play?|a question|theater
  Some actors rehearse a single scene more than fifty times before opening night.|a surprising fact|theater
  The lights went down. In the wings, Lily took a deep breath and stepped into the spotlight.|a short scene|theater
  How can a scientist find a fossil hidden in a cliff?|a question|fossils
  Mary Anning found her first great fossil when she was only twelve years old.|a surprising fact|fossils
  The tide was out. Mary knelt on the wet stones and brushed the sand from a long, curved bone.|a short scene|fossils
  What makes the ground shake in an earthquake?|a question|earthquakes
  The Earth has hundreds of thousands of small earthquakes every year, but people feel only a few.|a surprising fact|earthquakes
  The dishes began to rattle. Then the floor rolled under our feet like the deck of a ship.|a short scene|earthquakes
  Can you imagine reading a book with your fingertips?|a question|Braille
  Louis Braille invented his alphabet of raised dots when he was only fifteen.|a surprising fact|Braille
  In the dark dormitory, the boy ran his fingers over the dots again and again until the words made sense.|a short scene|Braille
`;

const hookRows = fields(hookLines).map(([hook, kind, topic]) => {
  if (!hook || !kind || !topic) throw new Error(`a hook line needs three fields: ${hook}`);
  return { hook, kind, topic };
});

/** hookFitBank asks for the hook that fits the topic of a report. */
const hookFitBank: readonly Item[] = hookRows.map((h, i) => {
  const others = hookRows.filter((o) => o.topic !== h.topic && o.kind === h.kind);
  const wrong = [pick(others, i), pick(others, i + 4)].map((o) => o.hook);
  return {
    question: t(`Which hook would best open a report on ${h.topic}?`, `哪个开头最适合一篇关于 ${h.topic} 的报告？`),
    shown: "",
    right: h.hook,
    wrong,
    why: t(
      `This hook is about ${h.topic}, so it pulls the reader straight into the topic of the report.\n\n**Check.** Compare the hook's subject with “${h.topic}”—only this opening directly introduces the report's topic.`,
      `这个开头讲的就是 ${h.topic}，所以能把读者直接带进报告的话题。\n\n**检验。** 把开头的主题与“${h.topic}”对照——只有这一句直接引出报告话题。`,
    ),
    whyNot: wrong.map((_, idx) =>
      idx === 0
        ? t(`This hook introduces a different subject, not ${h.topic}.`, `这个开头引出的是另一个主题，而不是 ${h.topic}。`)
        : t(
            `Even though it catches attention, this opening belongs to another report—pick the hook that leads directly into ${h.topic}.`,
            `这句开头虽然吸引人，但属于另一篇报告——选直接引出 ${h.topic} 的那一句。`,
          ),
    ),
  };
});

// Outlining a report.

const outlineLines = `
  Deserts|Desert Plants|cactus stores water in its stem;roots spread wide;tiny leaves lose little water
  Deserts|Desert Animals|camels store fat;foxes hunt at night;lizards hide under rocks
  Deserts|People of the Desert|herders move with their animals;homes built of thick mud;water found at oases
  The Heart|Parts of the Heart|four chambers;valves like doors;thick muscle walls
  The Heart|How the Heart Works|squeezes to push blood out;relaxes to fill;beats about 100,000 times a day
  The Heart|A Healthy Heart|exercise every day;eat fruit and vegetables;get enough sleep
  Wind Power|How Turbines Work|blades catch the wind;shaft turns;generator makes electricity
  Wind Power|Where Turbines Go|on hills;along coasts;out at sea
  Wind Power|Good Points and Problems|no smoke;can be noisy;some people dislike how they look
  Castles|Parts of a Castle|thick stone walls;moat and drawbridge;tall towers
  Castles|People in a Castle|the lord and his family;knights and guards;cooks and servants
  Castles|Defending a Castle|archers on the walls;gates shut tight;stored food for a siege
  The Silk Road|Goods|silk;spices;porcelain
  The Silk Road|Dangers|bandits;sandstorms;high mountain passes
  The Silk Road|Ideas That Traveled|papermaking;religions;stories and music
  Making a Play|Before Rehearsals|writing the script;holding auditions;choosing the cast
  Making a Play|Rehearsals|learning lines;practicing moves;dress rehearsal
  Making a Play|Opening Night|the curtain rises;the audience claps;the actors bow
  Fossils|How Fossils Form|an animal dies;mud covers it;it turns to stone over time
  Fossils|Kinds of Fossils|bones and shells;footprints;leaves pressed in rock
  Fossils|Finding Fossils|cliffs and beaches;careful digging;cleaning with brushes
  Energy at Home|Using Energy|lights;heating;cooking
  Energy at Home|Wasting Energy|lights left on;open windows in winter;old bulbs
  Energy at Home|Saving Energy|switch off lights;insulate the roof;use LED bulbs
  Cave Art|Where It Is Found|caves in France;caves in Spain;caves in Indonesia
  Cave Art|What It Shows|horses and bison;hand prints;hunters
  Cave Art|How It Was Made|crushed rock and earth;charcoal;blowing paint through reeds
  Louis Braille|Early Life|born in France;lost his sight at three;went to a school for the blind
  Louis Braille|His Invention|raised dots;six dots in each cell;finished at fifteen
  Louis Braille|His Legacy|used around the world;on signs and elevators;read by millions
`;

const outlines = fields(outlineLines).map(([report, main, details]) => {
  const ds = (details ?? "").split(";").map((d) => d.trim());
  if (!report || !main || ds.length !== 3) throw new Error(`an outline line needs three details: ${main}`);
  return { report, main, details: ds };
});

/** detailPlaceBank asks under which main point a detail belongs. */
const detailPlaceBank: readonly Item[] = outlines.flatMap((o) =>
  o.details.map((d) => {
    const others = outlines.filter((x) => x.report === o.report && x !== o);
    return {
      question: t(
        `In an outline of a report on ${o.report.toLowerCase()}, under which main point does this detail go?`,
        `在一篇关于 ${o.report} 的报告提纲中，这个细节应该放在哪个要点下面？`,
      ),
      shown: d,
      right: o.main,
      wrong: others.map((x) => x.main),
      why: t(
        `“${d}” is a detail of “${o.main}”. In an outline, each detail goes under the main point it tells more about.\n\n**Check.** Ask “Which section heading would a reader expect to find ‘${d}’ under?”—only “${o.main}” fits.`,
        `“${d}”是“${o.main}”的细节。在提纲中，每个细节都放在它所补充说明的要点下面。\n\n**检验。** 问自己“读者会在哪个小标题下读到‘${d}’？”——只有“${o.main}”合适。`,
      ),
      whyNot: others.map((x, idx) =>
        idx === 0
          ? t(`“${x.main}” covers a different part of the report, not “${d}”.`, `“${x.main}”讲的是报告的另一部分，不包括“${d}”。`)
          : t(
              `Putting “${d}” under “${x.main}” would mix unrelated facts into that section.`,
              `把“${d}”放在“${x.main}”下面会把不相关的事实混进这一部分。`,
            ),
      ),
    };
  }),
);

/** missingPointBank asks which main point is missing from an outline, from its details. */
const missingPointBank: readonly Item[] = outlines.map((o, i) => {
  const elsewhere = pick(
    outlines.filter((x) => x.report !== o.report),
    i,
  );
  const wrong = [o.details[0] ?? "", elsewhere.main];
  return {
    question: t(
      `The outline of a report on ${o.report.toLowerCase()} has lost one main point. Which main point goes with these details?`,
      `一篇关于 ${o.report} 的报告提纲丢了一个要点。哪个要点和这些细节对应？`,
    ),
    shown: `___\n${o.details.map((d) => `- ${d}`).join("\n")}`,
    right: o.main,
    wrong,
    why: t(
      `“${o.main}” sums up all three details. A main point is broad enough to cover every detail under it.\n\n**Check.** Test “${o.main}” against all three bullets—every single bullet belongs cleanly under that heading.`,
      `“${o.main}”概括了全部三个细节。要点的范围要足够大，能涵盖它下面的每个细节。\n\n**检验。** 用“${o.main}”逐一核对下面三条细节——每一条都正好归属在这个要点下。`,
    ),
    whyNot: [
      t(
        "This is one of the details itself: it is too narrow to cover the other two.",
        "这本身就是其中一个细节：范围太窄，涵盖不了另外两个。",
      ),
      t(
        "This is a main point of a report on a different topic, so it does not fit these details.",
        "这是另一个话题报告的要点，所以和这些细节不相符。",
      ),
    ],
  };
});

// Listing sources.

const sourceLines = `
  Anning|Mary|Fossils of the Seashore|2019
  Bello|Kofi|The Desert Year|2021
  Chen|Lin|Silk and Spice|2018
  Diaz|Rosa|Your Amazing Heart|2020
  Evans|Tom|Castles of Stone|2017
  Fischer|Anna|Wind, Water and Sun|2022
  Gupta|Ravi|Life in the Canopy|2016
  Hayashi|Ken|The Stage Is Set|2023
  Ivanova|Olga|Polar Lands|2015
  Jones|Megan|Painting in Caves|2019
  Kim|Soo|Earth on the Move|2021
  Lopez|Diego|Lights in the Dark|2018
  Mensah|Ama|Plant a Tree|2020
  Novak|Petra|The Moving Plates|2017
  Okafor|Chidi|Energy All Around|2022
  Patel|Nina|Lives That Changed the World|2016
`;

const sources = fields(sourceLines).map(([last, first, title, year]) => {
  if (!last || !first || !title || !year) throw new Error(`a source needs four fields: ${last}`);
  return { last, first, title, year };
});

const entry = (s: (typeof sources)[number]) => `${s.last}, ${s.first}. *${s.title}*. ${s.year}.`;

const parts = [
  ["the author", "作者", (s: (typeof sources)[number]) => `*${s.title}*. ${s.year}.`],
  ["the title", "书名", (s: (typeof sources)[number]) => `${s.last}, ${s.first}. ${s.year}.`],
  ["the year", "年份", (s: (typeof sources)[number]) => `${s.last}, ${s.first}. *${s.title}*.`],
] as const;

/** missingPartBank asks what a source entry is missing. */
const missingPartBank: readonly Item[] = sources.flatMap((s) =>
  parts.map(([name, zh, shown]) => {
    const wrong = parts.filter(([n]) => n !== name).map(([n]) => n);
    return {
      question: t(
        "This entry in a list of sources is missing something. What is it missing?",
        "资料来源列表中的这一条缺了某项内容。缺的是什么？",
      ),
      shown: shown(s),
      right: name,
      wrong,
      why: t(
        `It is missing ${name}. Every entry needs the author (last name first), the title in italics and the year: ${entry(s)}\n\n**Check.** Scan the entry for all three required parts—author, italicized title, and year—and confirm ${name} is the one absent.`,
        `它缺少${zh}。每一条都需要作者（姓在前）、斜体的书名和年份：${entry(s)}\n\n**检验。** 对照三项必备要素（作者、斜体书名、年份）扫一遍——确实少了${zh}。`,
      ),
      whyNot: wrong.map((w, idx) =>
        idx === 0
          ? t(`The entry already includes ${w}, so that part is not missing.`, `这一条里已经写出了 ${w}，并不缺这项。`)
          : t(
              `Look again at the entry: ${w} is clearly shown—find the one required piece that is left out.`,
              `再看一遍条目：${w} 已经明明白白写出来了——找找漏掉的那一项。`,
            ),
      ),
    };
  }),
);

/** alphabetBank asks for the alphabetical order of three entries by the author's last name. */
const alphabetBank: readonly Item[] = range(32).map((i) => {
  const three = [pick(sources, i), pick(sources, i + 1 + (i % 5)), pick(sources, i + 7 + (i % 3))];
  const shownOrder = [three[1], three[2], three[0]] as (typeof sources)[number][];
  const sorted = [...three].sort((a, b) => a.last.localeCompare(b.last));
  const label = (s: (typeof sources)[number]) => letters[shownOrder.indexOf(s)] ?? "";
  const order = (o: readonly (typeof sources)[number][]) => o.map(label).join(", ");
  const right = order(sorted);
  const [a, b, c] = sorted as [(typeof sources)[number], (typeof sources)[number], (typeof sources)[number]];
  const wrong = [order([b, a, c]), order([a, c, b])];
  return {
    question: t("Put these entries in alphabetical order for a list of sources.", "把这些条目按字母顺序排成资料来源列表。"),
    shown: shownOrder.map((s, k) => `${letters[k]}. ${entry(s)}`).join("\n"),
    right,
    wrong,
    why: t(
      `The order is ${right}: ${sorted.map((s) => s.last).join(", ")}. A list of sources goes in alphabetical order by the author's last name, which comes first in each entry.\n\n**Check.** Read the first letters of the authors' last names in order (${sorted.map((s) => s.last[0]).join(" → ")})—they move forward cleanly through the alphabet.`,
      `顺序是 ${right}：${sorted.map((s) => s.last).join("、")}。资料来源列表按作者的姓的字母顺序排列，每一条都把姓放在最前面。\n\n**检验。** 按顺序读作者姓氏的首字母（${sorted.map((s) => s.last[0]).join(" → ")}）——严格按字母表顺序排列。`,
    ),
    whyNot: wrong.map((w, idx) =>
      idx === 0
        ? t(
            `${w} puts ${b.last} ahead of ${a.last}, which is out of alphabetical order.`,
            `${w} 把 ${b.last} 排在了 ${a.last} 前面，不符合字母顺序。`,
          )
        : t(
            `${w} puts ${c.last} ahead of ${b.last}—check the alphabet for the authors' last names.`,
            `${w} 把 ${c.last} 排在了 ${b.last} 前面——按作者姓氏的字母顺序再核对一遍。`,
          ),
    ),
  };
});

/** infoWritingTopics4 are the rule-checked writing topics of grade 4 for informational writing. */
export const infoWritingTopics4: readonly TopicDef[] = [
  {
    id: "turning-notes-into-sentences",
    title: t("Turning Notes into Sentences", "把笔记写成句子"),
    summary: t(
      "Notes become complete sentences in the writer's own words, keeping every fact and adding none.",
      "笔记用写作者自己的话写成完整的句子，保留每个事实，不添加任何内容。",
    ),
    intro: t(
      "Short research notes like *polar bears: black skin; thick fat; swim long distances* are great for gathering facts fast, but a report needs complete sentences that keep every detail accurately without inventing extras.",
      "像“北极熊：黑皮肤；厚脂肪；善长途游泳”这样的简短笔记方便快速记录，但写进报告时必须展开成完整句子——既不漏不改，也不凭空添油加醋。",
    ),
    prerequisites: after("taking-notes-from-a-text", "complete-sentences-and-fragments"),
    encompasses: [{ topic: "complete-sentences-and-fragments", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "keeping-every-fact-of-a-note",
        t("Keeping Every Fact of a Note", "保留笔记的每个事实"),
        t(
          "**Notes** are short: *camels: fat stored in humps; days without water*. To write them up, turn each part into a complete sentence with a subject and a verb: *Camels store fat in their humps and can go for days without water.* Check every part of the note: none may be left out, and none may be changed.\n\n> **Watch out.** Count the facts in the note (usually three)—a smooth sentence that quietly drops one fact or alters a number is still wrong.",
          "**笔记**很简短：*camels: fat stored in humps; days without water*。写成句子时，把每一部分变成有主语和动词的完整句子：*Camels store fat in their humps and can go for days without water.* 检查笔记的每一部分：一个都不能漏掉，也不能改动。\n\n> **注意。** 数清笔记里有几条信息（通常是三条）——句子再通顺，只要悄悄漏掉一条或改错数字就不合格。",
        ),
        itemGenerator(keepsAllBank),
      ),
      point(
        "adding-nothing-to-a-note",
        t("Adding Nothing to a Note", "不往笔记里添加内容"),
        t(
          "When you write up notes, the facts must come from the notes. For example, from *bees: visit flowers; make honey; dance to share where food is*, write only those three facts—do not add *and live in hives* even though it is true in real life.\n\n> **Watch out.** A sentence that sounds true from your own background knowledge still fails if the note never stated that extra fact.",
          "把笔记写成句子时，事实必须来自笔记。例如根据“蜜蜂：采花；酿蜜；跳舞指路”，就只写这三条——即使“住在蜂巢里”是真事，笔记没写也不要加上去。\n\n> **注意。** 哪怕靠常识觉得某句话是真的，只要笔记里没写，加进去就不符合要求。",
        ),
        itemGenerator(addsNothingBank),
      ),
    ],
  },
  {
    id: "linking-words-for-information",
    title: t("Linking Words for Information", "信息类写作的连接词"),
    summary: t(
      "Linking words show how ideas of information relate: also, for example, because, as a result.",
      "连接词表示信息之间的关系：also、for example、because、as a result。",
    ),
    intro: t(
      "Read *The tundra's ground stays frozen all year. As a result, tall trees cannot put down deep roots.* That single connector *As a result* tells your reader immediately that the second fact is caused by the first.",
      "读一读 *The tundra's ground stays frozen all year. As a result, tall trees cannot put down deep roots.* 一个连接词 *As a result* 立刻告诉读者：后一条事实是前一条导致的。",
    ),
    prerequisites: ["choosing-transitions"],
    encompasses: [{ topic: "choosing-transitions", weight: 0.3 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "what-a-linking-word-shows",
        t("What a Linking Word Shows", "连接词表示什么"),
        t(
          "**Linking words** tell the reader how a sentence relates to the one before it. *In addition* and *also* **add** a point. *For example* and *for instance* give an **example**. *This is because* gives a **cause**. *As a result* and *therefore* give a **result**.\n\n> **Watch out.** Do not mix up *cause* and *result*—*This is because* points backward to a reason, while *As a result* points forward to an effect.",
          "**连接词**告诉读者一个句子和前一句是什么关系。*In addition* 和 *also* **补充**一点。*For example* 和 *for instance* 引出**例子**。*This is because* 说明**原因**。*As a result* 和 *therefore* 说明**结果**。\n\n> **注意。** 别把“原因”和“结果”弄反——*This is because* 引出前一句的原因，*As a result* 引出前一句带来的结果。",
        ),
        nameKind({
          lines: linkKindLines,
          kinds: linkKinds,
          name: ["What does the linking word in bold show?", "粗体的连接词表示什么？"],
          find: (en, zh) => [
            `In which pair does the second sentence ${en.replace(/^gives/, "give").replace(/^adds/, "add")}?`,
            `在哪一组句子中，第二句${zh}？`,
          ],
        }),
      ),
      point(
        "choosing-the-linking-word",
        t("Choosing the Linking Word", "选择连接词"),
        t(
          "To choose a linking word, read both sentences and ask how the second relates to the first. For example, *Some foods give quick energy* followed by *a banana can power a runner* gives a specific case, so *For instance* fits best.\n\n> **Watch out.** Test your choice by reading both sentences aloud—using *Therefore* before a cause or *This is because* before a result reverses the logic.",
          "要选择连接词，先读两个句子，问第二句和第一句是什么关系。例如“有些食物提供快速能量”后面接“香蕉能给跑步者供能”，是在举具体例子，所以 *For instance* 最合适。\n\n> **注意。** 把选好的词放回两句之间通读——在原因前用 *Therefore* 或在结果前用 *This is because* 会把逻辑写反。",
        ),
        itemGenerator(linkGapBank),
      ),
    ],
  },
  {
    id: "choosing-headings",
    title: t("Choosing Headings", "选择小标题"),
    summary: t("A heading names what a section of a report is about in a few words.", "小标题用几个词说出报告的一部分讲的是什么。"),
    intro: t(
      "Imagine a three-part report on castles with sections on stone walls, meals in the great hall, and surviving a siege. Crisp headings like *Walls and Moats* and *Under Siege* act like signposts that tell readers what each section covers.",
      "一篇介绍城堡的报告分三部分写石墙、大厅日常和守城抗敌。像 *Walls and Moats*、*Under Siege* 这样简洁的小标题就像路标，让读者一眼看清每段讲什么。",
    ),
    prerequisites: after("grouping-related-facts"),
    encompasses: [{ topic: "main-idea", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "the-heading-that-fits",
        t("The Heading That Fits", "合适的小标题"),
        t(
          "A report of several sections gives each one a **heading**: a few words that name what the section is about, like *Built for Sandstorms and Dunes*. To choose a heading, find the main idea of the section, the thing every sentence in it tells about.\n\n> **Watch out.** All three headings belong to the same report—match the *specific* subtopic of the paragraph, not the general report topic.",
          "分成几部分的报告给每一部分一个**小标题**：用几个词说出这一部分讲的是什么，比如 *Built for Sandstorms and Dunes*。要选小标题，先找出这一部分的主要意思，也就是每个句子都在讲的那件事。\n\n> **注意。** 三个选项都是同一篇报告的小标题——要对准这一段的具体子话题，而不是整篇报告的大主题。",
        ),
        itemGenerator(headingBank),
      ),
      point(
        "the-section-under-a-heading",
        t("The Section Under a Heading", "小标题下的内容"),
        t(
          "A heading is a promise: the section under it must be about what the heading names. For example, under *Keeping Your Heart Healthy*, readers expect facts about exercise and healthy foods, not where the heart sits in the chest.\n\n> **Watch out.** Check every sentence in the paragraph against the heading—one familiar keyword does not make it the right section.",
          "小标题是一种承诺：它下面的内容必须讲小标题所说的事。例如在 *Keeping Your Heart Healthy* 下面，读者期待的是运动与健康饮食，而不是心脏在胸腔的位置。\n\n> **注意。** 用小标题核对段落里的每一句——只出现一个眼熟的关键词并不足以说明它属于这一部分。",
        ),
        itemGenerator(sectionBank),
      ),
    ],
  },
  {
    id: "facts-definitions-and-examples",
    title: t("Facts, Definitions and Examples", "事实、定义和例子"),
    summary: t("A report develops a point with facts, definitions of new words and examples.", "报告用事实、新词的定义和例子来展开观点。"),
    intro: t(
      "Strong informational writing teaches in three ways: it shares checkable *facts* (the human body has 206 bones), gives *definitions* (*a joint is where two bones meet*), and offers concrete *examples* (*such as knees and elbows*).",
      "扎实的信息类写作靠三种方式把知识讲透：给出可核实的*事实*（人体有 206 块骨头）、解释新词的*定义*（关节是两块骨头相连之处），以及具体的*例子*（如膝盖和手肘）。",
    ),
    prerequisites: ["supporting-details"],
    encompasses: [{ topic: "supporting-details", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "fact-definition-or-example",
        t("Fact, Definition or Example", "事实、定义还是例子"),
        t(
          "A report develops its points in three ways. A **fact** is true information that can be checked: *The Sahara is about the size of the United States.* A **definition** tells what a word means: *A desert is a place that gets less than 25 centimeters of rain a year.* An **example** names one case: *the fennec fox, for example*.\n\n> **Watch out.** A definition explains what a *word* means (often using *is a...* or *is the...*), whereas a fact states a measurement, date, or true statement about a specific subject.",
          "报告用三种方式展开观点。**事实**是可以核实的真实信息：*The Sahara is about the size of the United States.* **定义**说明一个词的意思：*A desert is a place that gets less than 25 centimeters of rain a year.* **例子**举出一个具体事例：*the fennec fox, for example*。\n\n> **注意。** 定义解释的是某个*词*的含义（常用 *is a...*、*is the...*），而事实给出的是具体对象的数字、年份或真实情况。",
        ),
        nameKind({
          lines: developLines,
          kinds: developKinds,
          name: ["What does this sentence of a report give?", "报告中的这个句子提供了什么？"],
          find: (en, zh) => [`Which sentence of a report gives ${en}?`, `报告中的哪个句子提供了${zh}？`],
        }),
      ),
      point(
        "developing-a-point-a-given-way",
        t("Developing a Point a Given Way", "按指定方式展开观点"),
        t(
          "When a report needs a new word explained, it needs a definition: look for *is*, *means* or *is called*. When it needs a point made clear, it needs an example: look for *for example* or *such as*. When it needs proof, it needs a fact, often with a number.\n\n> **Watch out.** Do not pick a sentence just because it contains *is*—*Mount Everest is 8,849 meters tall* is a fact, not a definition of a term.",
          "报告需要解释新词时，就需要定义：找 *is*、*means* 或 *is called*。需要把观点说清楚时，就需要例子：找 *for example* 或 *such as*。需要证据时，就需要事实，常常带有数字。\n\n> **注意。** 不要一看见 *is* 就选定义——“珠穆朗玛峰高 8849 米”是事实，不是在给某个术语下定义。",
        ),
        findKind({
          lines: developLines,
          kinds: developKinds,
          name: ["What does this sentence of a report give?", "报告中的这个句子提供了什么？"],
          find: (en, zh) => [`Which sentence of a report gives ${en}?`, `报告中的哪个句子提供了${zh}？`],
        }),
      ),
    ],
  },
  {
    id: "ordering-paragraphs",
    title: t("Ordering Paragraphs", "段落排序"),
    summary: t(
      "The paragraphs of a report go in an order that makes sense: from general to specific, in time order, or from problem to solution.",
      "报告的段落按合理的顺序排列：从概括到具体、按时间顺序，或从问题到解决办法。",
    ),
    intro: t(
      "A report on how a volcano erupts starts deep underground with rising magma and ends with cooled rock; a report on school litter starts with the mess and ends with cleaner bins. Knowing the report's pattern lets you put every paragraph in its right place.",
      "讲火山喷发的报告从地下岩浆积聚写到冷却成岩；讲校园垃圾的报告从问题现状写到增设垃圾桶后的改善。先看清文章的组织方式，就能把每一段排在正确的位置。",
    ),
    prerequisites: ["ordering-sentences-in-a-paragraph"],
    encompasses: [{ topic: "ordering-sentences-in-a-paragraph", weight: 0.3 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "putting-paragraphs-in-order",
        t("Putting Paragraphs in Order", "把段落排好顺序"),
        t(
          "Paragraphs follow an order, just as sentences do. A report may go **from general to specific** (deserts, then the Sahara, then its dunes), **in time order** (first, later, at last), or **from problem to solution** (what is wrong, why, what to do, what will improve). Find the order first, then the paragraph that starts it.\n\n> **Watch out.** Check the two middle paragraphs carefully—even if you spot the first and last paragraphs, swapping the middle two still breaks the sequence.",
          "段落和句子一样有顺序。报告可以**从概括到具体**（沙漠，然后撒哈拉，再到沙丘），**按时间顺序**（首先、后来、最后），或者**从问题到解决办法**（哪里有问题、为什么、怎么办、会有什么改善）。先找出顺序，再找出开头的那一段。\n\n> **注意。** 中间两段也要仔细核对——哪怕找对了首尾两段，中间两段颠倒一样会打乱逻辑。",
        ),
        itemGenerator(paragraphOrderBank),
      ),
      point(
        "where-a-new-paragraph-belongs",
        t("Where a New Paragraph Belongs", "新段落放在哪里"),
        t(
          "To place a new paragraph, find the order the report follows, then see which step is missing. In time order, a paragraph about age 10 goes between age 3 and age 15; from general to specific, a broader paragraph goes before a narrower one.\n\n> **Watch out.** Read both the paragraph before and the paragraph after your chosen slot to verify that the new paragraph bridges them smoothly.",
          "要放置一个新段落，先找出报告遵循的顺序，再看缺了哪一步。按时间顺序，讲 10 岁的段落放在 3 岁和 15 岁之间；从概括到具体，范围大的段落放在范围小的前面。\n\n> **注意。** 把所选位置前后的两段一起读一遍，确认新段落与上下文自然衔接。",
        ),
        itemGenerator(placeBank),
      ),
    ],
  },
  {
    id: "paraphrasing-a-sentence",
    title: t("Paraphrasing a Sentence", "改述句子"),
    summary: t(
      "A paraphrase says the same thing as a sentence in new words and a new order, without changing the meaning.",
      "释义用新的词语和新的顺序说出和原句相同的意思，不改变原意。",
    ),
    intro: t(
      "When you use a book's fact in your own report, copying the sentence word for word is plagiarism, yet changing a number breaks the truth. Paraphrasing lets you restate the exact same fact in fresh words and a fresh structure.",
      "在报告里借用书中的事实时，原样照抄算抄袭，改掉数字又违背事实。改述（paraphrasing）就是用全新的措辞和句式，原原本本地说出同样的事实。",
    ),
    prerequisites: after("taking-notes-from-a-text"),
    encompasses: [],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "the-paraphrase-that-keeps-the-meaning",
        t("The Paraphrase That Keeps the Meaning", "保留原意的释义"),
        t(
          "A **paraphrase** says what a sentence says in your own words. Change the words and the order: *Camels can travel for days without water* becomes *Without a drink, a camel can travel for several days.* Every fact stays the same.\n\n> **Watch out.** Adding one filler word like *very* or *really* while keeping the original wording is still copying, not paraphrasing.",
          "**释义**就是用自己的话说出句子的意思。换词语，也换顺序：*Camels can travel for days without water* 变成 *Without a drink, a camel can travel for several days.* 每个事实都保持不变。\n\n> **注意。** 原句照搬、只加一两个 *very*、*really* 之类的词依然属于照抄，不算改述。",
        ),
        itemGenerator(paraphraseBank),
      ),
      point(
        "copying-or-changing-the-facts",
        t("Copying or Changing the Facts", "照抄或改变事实"),
        t(
          "A paraphrase can go wrong in two ways. It can **copy too much**, keeping the original words and order with a word or two changed. Or it can **change the facts**, so it no longer says what the sentence said (for instance, turning *fifteen* into *fifty*).\n\n> **Watch out.** Check the facts *first*—a neatly reworded sentence that flips a number or reverses a meaning is wrong because it changes the facts.",
          "释义可能在两方面出错：**照抄太多**，保留原句的词语和顺序，只改一两个词；或者**改变了事实**，不再表达原句的意思（比如把 *fifteen* 改成了 *fifty*）。\n\n> **注意。** 先核对事实——哪怕换了新词，只要弄错了数字或说反了意思，就是“改变了事实”。",
        ),
        itemGenerator(paraphraseKindBank),
      ),
    ],
  },
  {
    id: "supporting-reasons-with-facts",
    title: t("Supporting Reasons with Facts", "用事实支持理由"),
    summary: t(
      "Each reason for an opinion is stronger with a fact or a detail behind it.",
      "有事实或细节作为支撑，观点的每个理由都会更有力。",
    ),
    intro: t(
      "Saying *Our park needs more bins because litter is a problem* is a start; adding *Last weekend, volunteers picked up twelve bags of litter* turns your reason into proof. Facts that directly back your reason persuade readers far better than extra opinions.",
      "说“公园需要更多垃圾桶，因为乱扔垃圾成问题”只是开头；补上“上周末志愿者捡了十二袋垃圾”，理由立刻有了说服力。直接支撑理由的事实，比再多空泛看法都管用。",
    ),
    prerequisites: ["fact-and-opinion"],
    encompasses: [{ topic: "fact-and-opinion", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "the-fact-that-supports-a-reason",
        t("The Fact That Supports a Reason", "支持理由的事实"),
        t(
          "A reason says why you hold an opinion: *Our school should plant more trees, because trees keep the playground cool.* A **fact** behind the reason makes it convincing: *On a hot day, the ground under a tree can be ten degrees cooler.* The fact must be about the reason, and it must be something that can be checked.\n\n> **Watch out.** Reject both pure opinions (*Trees are the most beautiful things*) and facts that support a completely different argument.",
          "理由说明你为什么持有某个观点：*Our school should plant more trees, because trees keep the playground cool.* 理由背后的**事实**使它令人信服：*On a hot day, the ground under a tree can be ten degrees cooler.* 事实必须和理由有关，并且可以核实。\n\n> **注意。** 既要排除纯看法（如“树是最美的东西”），也要排除虽然属实但支持别的论点的事实。",
        ),
        itemGenerator(supportingFactBank),
      ),
      point(
        "a-fact-or-only-an-opinion",
        t("A Fact or Only an Opinion", "事实还是只是观点"),
        t(
          "Writers sometimes back a reason with **another opinion**, *Trees are the most beautiful things a school can have*, which proves nothing. Others give a fact that is true but **about something else** (*Carrots are orange* when arguing that a garden teaches students). Only a checkable fact about the reason supports it.\n\n> **Watch out.** Do not call an unrelated true statement a supporting fact—it must actually connect to and prove the specific reason given.",
          "作者有时用**另一个观点**来支持理由，*Trees are the most beautiful things a school can have*，这证明不了什么。也有人给出真实但**讲别的事**的事实（论证菜园能增长知识时写“胡萝卜是橙色的”）。只有和理由有关、可以核实的事实才能支持它。\n\n> **注意。** 不要把毫不相干的真话当成支持性事实——它必须真正能证明给出的那条理由。",
        ),
        itemGenerator(supportKindBank),
      ),
    ],
  },
  {
    id: "choosing-a-hook",
    title: t("Choosing a Hook", "选择开头"),
    summary: t(
      "A report can open with a question, a surprising fact or a short scene that makes the reader want to go on.",
      "报告可以用一个问题、一个惊人的事实或一个简短的场景开头，让读者想读下去。",
    ),
    intro: t(
      "Compare *This report is about the heart* with *Your heart beats about a hundred thousand times every day, even while you sleep.* A strong hook—whether a question, a surprising fact, or a vivid scene—pulls readers straight into your report.",
      "比较“这篇报告讲的是心脏”和“你的心脏每天跳动约十万次，连睡着时也不停歇”。一个好开头——提问、惊人事实或简短场景——能立刻把读者拉进报告里。",
    ),
    prerequisites: after("choosing-a-story-opening", "identifying-topic-sentences"),
    encompasses: [{ topic: "identifying-topic-sentences", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "the-kind-of-a-hook",
        t("The Kind of a Hook", "开头的种类"),
        t(
          "A **hook** is the opening of a report that catches the reader. It can be a **question** the reader wants answered (*Have you ever wondered...?*), a **surprising fact** they did not expect, or a **short scene** that drops them into a moment. Name the kind from what the opening does.\n\n> **Watch out.** A surprising fact states general information (often with a striking number), while a short scene puts a character or observer into a specific moment with actions.",
          "**开头**（hook）是报告中抓住读者的开篇。它可以是读者想知道答案的**问题**（如 *Have you ever wondered...?*）、意想不到的**惊人事实**，或者把读者带进某个瞬间的**简短场景**。根据开头的作用说出它的种类。\n\n> **注意。** 惊人事实陈述客观信息（常带惊人数字），而简短场景则把人物或观察者放进一个有动作的具体瞬间。",
        ),
        nameKind({
          lines: hookRows.map((h) => `${h.hook}|${h.kind}`).join("\n"),
          kinds: hookKinds,
          name: ["What kind of hook is this opening of a report?", "这个报告的开头属于哪一种？"],
          find: (en, zh) => [`Which opening of a report is ${en}?`, `哪个报告开头是${zh}？`],
        }),
      ),
      point(
        "the-hook-that-fits-the-topic",
        t("The Hook That Fits the Topic", "适合话题的开头"),
        t(
          "A hook must lead into the topic. A surprising fact about camels opens a report on camels, not one on castles. Choose the hook whose question, fact or scene is about what the report will explain.\n\n> **Watch out.** All three choices are well-written hooks of the same style—pick the one that actually matches the report's topic.",
          "开头必须引出话题。关于骆驼的惊人事实适合关于骆驼的报告，而不适合关于城堡的报告。要选择问题、事实或场景都与报告要讲的内容有关的开头。\n\n> **注意。** 三个选项都是同类型且写得不错的开头——一定要选真正对准报告话题的那一句。",
        ),
        itemGenerator(hookFitBank),
      ),
    ],
  },
  {
    id: "outlining-a-report",
    title: t("Outlining a Report", "给报告列提纲"),
    summary: t(
      "An outline lists the main points of a report in order and the details under each.",
      "提纲按顺序列出报告的要点，以及每个要点下的细节。",
    ),
    intro: t(
      "Before drafting a report on the Silk Road, a writer sorts notes into three main points—*Goods*, *Dangers*, and *Ideas That Traveled*—with bulleted details under each. That roadmap is an outline.",
      "动笔写丝绸之路报告前，作者先把笔记归类到三个要点下——*Goods*、*Dangers*、*Ideas That Traveled*——每条要点下挂上细节。这张写作路线图就是提纲。",
    ),
    prerequisites: ["choosing-headings"],
    encompasses: [{ topic: "choosing-headings", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "a-detail-under-its-main-point",
        t("A Detail Under Its Main Point", "细节放在要点下"),
        t(
          "An **outline** is a plan for a report. It lists the **main points**, one for each paragraph or section, and under each the **details** that tell more about it. To place a detail, ask which main point it tells about: *foxes hunt at night* goes under *Desert Animals*.\n\n> **Watch out.** Keep every detail under the exact main point it explains—do not place a fact about *Desert Plants* under *People of the Desert*.",
          "**提纲**是报告的计划。它列出**要点**，每段或每部分一个，在每个要点下面列出补充说明它的**细节**。要放置一个细节，就问它在讲哪个要点：*foxes hunt at night* 放在 *Desert Animals* 下面。\n\n> **注意。** 每条细节都必须归在它所说明的那个要点下——不要把讲沙漠植物的细节放进沙漠居民那一块。",
        ),
        itemGenerator(detailPlaceBank),
      ),
      point(
        "the-missing-main-point",
        t("The Missing Main Point", "缺失的要点"),
        t(
          "A main point must be broad enough to cover all the details under it. For example, *four chambers*, *valves like doors*, and *thick muscle walls* all belong under *Parts of the Heart*. One detail alone is too narrow, and a point about another topic does not fit at all.\n\n> **Watch out.** Never choose one of the bullet details itself as the main point—a main point must be a category that covers *all three* bullets.",
          "要点的范围必须大到能涵盖它下面的所有细节。例如 *four chambers*、*valves like doors*、*thick muscle walls* 都归在 *Parts of the Heart* 下。单独一个细节范围太窄，而关于别的话题的要点根本不合适。\n\n> **注意。** 不要把其中某一条细节当成要点——要点必须是能概括*全部三条*细节的上位类别。",
        ),
        itemGenerator(missingPointBank),
      ),
    ],
  },
  {
    id: "listing-sources",
    title: t("Listing Sources", "列出资料来源"),
    summary: t(
      "A report lists the books and websites it used, with the author, the title and the year.",
      "报告要列出用过的书和网站，写明作者、书名和年份。",
    ),
    intro: t(
      "When a reader finishes your report on fossils and wants to read the books you used, a clean source list—like *Anning, Mary. Fossils of the Seashore. 2019.*—points them straight to each book in alphabetical order.",
      "读者看完你的化石报告，想去找你参考过的书时，规范的资料来源列表（如 *Anning, Mary. Fossils of the Seashore. 2019.*）能按字母顺序把他们准确引向每一本书。",
    ),
    prerequisites: ["capitalizing-names-and-titles"],
    encompasses: [{ topic: "capitalizing-names-and-titles", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "what-a-source-entry-needs",
        t("What a Source Entry Needs", "资料条目需要什么"),
        t(
          "At the end of a report, a **list of sources** names every book or website the writer used, so readers can find them. Each entry gives the **author**, last name first, the **title** in italics, and the **year** it was published: *Chen, Lin. Silk and Spice. 2018.*\n\n> **Watch out.** Check all three slots in order—author (with a comma between last and first name), italicized title, and four-digit year—so you immediately spot which piece is missing.",
          "报告末尾的**资料来源列表**列出作者用过的每本书或每个网站，让读者能找到它们。每一条都写出**作者**（姓在前）、斜体的**书名**和出版**年份**：*Chen, Lin. Silk and Spice. 2018.*\n\n> **注意。** 按顺序核对三个位置——作者（姓与名之间有逗号）、斜体书名、四位年份——就能一眼看出缺了哪一项。",
        ),
        itemGenerator(missingPartBank),
      ),
      point(
        "sources-in-alphabetical-order",
        t("Sources in Alphabetical Order", "按字母顺序排列资料"),
        t(
          "The entries of a list of sources go in **alphabetical order** by the author's last name. That is why the last name comes first in each entry: *Anning*, then *Chen*, then *Diaz*. Compare first letters; if they are the same, compare the second letters.\n\n> **Watch out.** Sort by the author's *last name* (the very first word of each entry), not by the author's first name or the book title.",
          "资料来源列表的条目按作者姓氏的**字母顺序**排列，所以每条都把姓放在最前面：*Anning*，然后 *Chen*，再到 *Diaz*。比较首字母；如果首字母相同，就比较第二个字母。\n\n> **注意。** 要按作者的*姓*（每条最开头的词）排序，不要按名或书名排。",
        ),
        itemGenerator(alphabetBank),
      ),
    ],
  },
];
