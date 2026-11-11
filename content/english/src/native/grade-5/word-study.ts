// Grade 5: the topics of word study: homographs, Greek and Latin roots, words from names and myths, blends and
// shortened words, and analogies.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import { choose, field, type Label, label, type Pair, rows, topic } from "./kit.ts";

// Homographs: each sense is "sense|how it is said|sentence|sentence"; the first sentence of a sense also carries a near
// meaning that does not fit, for the first step.
interface Sense {
  readonly means: string;
  readonly said: string;
  readonly near: string;
  readonly sentences: readonly string[];
}
interface Homograph {
  readonly word: string;
  readonly a: Sense;
  readonly b: Sense;
}

const homographs: readonly Homograph[] = rows(`
  wind|moving air|rhymes with pinned|a loud noise|The **wind** blew the leaves across the yard.|A cold **wind** came off the lake.|to turn or twist|rhymes with find|to clean|Remember to **wind** the old clock every night.|Paths **wind** up the side of the hill.
  tear|a drop of water from the eye|rhymes with fear|a small cut|A **tear** rolled down her cheek.|He wiped a **tear** from his eye at the end of the film.|to rip|rhymes with bear|to fold|Do not **tear** the page out of the book.|The wind can **tear** a flag to pieces.
  close|to shut|rhymes with nose|to lock|Please **close** the window before it rains.|The shop will **close** at six.|near|rhymes with dose|quiet|Our school is **close** to the river.|Stay **close** to me in the crowd.
  bow|to bend forward at the waist|rhymes with cow|to wave|The actors **bow** at the end of the play.|In some countries, people **bow** to say hello.|a knot with two loops|rhymes with toe|a ribbon|She tied a **bow** in her hair.|Tie your laces in a double **bow**.
  lead|to show the way|rhymes with seed|to follow|Our teacher will **lead** us to the museum.|Can you **lead** the horse back to the barn?|a soft, heavy gray metal|rhymes with bed|a kind of wood|Old water pipes were made of **lead**.|The fishing net had **lead** weights to make it sink.
  live|to have your home somewhere|rhymes with give|to visit|We **live** on the third floor.|Penguins **live** where the sea is cold.|happening now, not recorded|rhymes with five|well known|The match is on **live** television.|The band played **live** music in the park.
  wound|an injury to the body|rhymes with spooned|a bruise|The doctor cleaned the **wound** on his knee.|The soldier's **wound** healed slowly.|turned or twisted|rhymes with found|tied|She **wound** the string around the stick.|The path **wound** through the trees.
  row|a line of things side by side|rhymes with toe|a group of people|We sat in the front **row**.|A **row** of trees stood along the road.|a noisy quarrel|rhymes with cow|a loud joke|The neighbors had a **row** about the fence.|There was a terrible **row** over who broke the vase.
  present|a gift|stress on PRES|a party|I wrapped a **present** for my sister.|The book was a birthday **present**.|to show or give formally|stress on SENT|to hide|Each group will **present** its project on Friday.|The mayor will **present** the prize.
  record|a written account of facts|stress on REC|a rumor|The nurse keeps a **record** of every visit.|The diary is a **record** of her journey.|to write down or save|stress on CORD|to forget|Please **record** the temperature every hour.|We will **record** the song on Monday.
  minute|sixty seconds|stress on MIN|an hour|Wait a **minute** while I find my coat.|The bus leaves in one **minute**.|very small|stress on NUTE|very old|The microscope showed **minute** creatures in the water.|There was a **minute** crack in the glass.
  object|a thing you can see or touch|stress on OB|a picture|Each **object** in the museum has a label.|A strange **object** lay on the beach.|to say you disagree|stress on JECT|to agree|Did anyone **object** to the plan?|Many parents **object** to the late start.
  desert|a dry land with little rain|stress on DES|a beach|Camels can cross the **desert** for days without water.|Few plants grow in the **desert**.|to leave and not come back|stress on SERT|to visit|A good friend would never **desert** you.|The crew would not **desert** the ship.
  dove|a gray bird, a sign of peace|rhymes with love|a kind of hawk|A white **dove** sat on the roof.|The **dove** cooed softly in the tree.|went headfirst into water|rhymes with stove|swam slowly|She **dove** into the pool.|The duck **dove** under the water for food.
  content|what is inside something|stress on CON|the cover|The **content** of the letter was a secret.|Check the **content** of the box before you sign.|happy and satisfied|stress on TENT|bored|The cat was **content** to sleep in the sun.|He was **content** with a simple meal.
`).map(
  (r): Homograph => ({
    word: field(r, 0),
    a: { means: field(r, 1), said: field(r, 2), near: field(r, 3), sentences: [field(r, 4), field(r, 5)] },
    b: { means: field(r, 6), said: field(r, 7), near: field(r, 8), sentences: [field(r, 9), field(r, 10)] },
  }),
);

const meaningOfHomograph: readonly ChoiceItem[] = homographs.flatMap((h) => [
  [h.a.sentences[0] ?? "", h.a.means, [h.b.means, h.a.near]],
  [h.b.sentences[0] ?? "", h.b.means, [h.a.means, h.b.near]],
]);

const senseOf = (sentence: string): { h: Homograph; s: Sense } => {
  for (const h of homographs) for (const s of [h.a, h.b]) if (s.sentences.includes(sentence)) return { h, s };
  throw new Error(`no homograph for ${sentence}`);
};

// Saying a homograph: for each sense and each of its sentences, the other sense's two sentences are the wrong options.
const sayingHomograph: readonly ChoiceItem[] = homographs.slice(0, 8).flatMap((h) =>
  [h.a, h.b].flatMap((s) => {
    const other = s === h.a ? h.b : h.a;
    return s.sentences.map((right): ChoiceItem => [`**${h.word}**, ${s.said}`, right, [...other.sentences]]);
  }),
);

const homographTopic = topic("vocabulary", {
  id: "homographs",
  // The title avoids "graph", which the audit reads as a picture.
  title: ["Words Spelled Alike", "同形异义词"],
  summary: [
    "Words spelled alike with different meanings and sometimes different sounds, such as wind, tear, close and record.",
    "拼写相同、意思不同、有时读音也不同的词，例如 wind、tear、close 和 record。",
  ],
  after: ["multiple-meaning-words"],
  points: [
    point(
      "meaning-of-a-homograph",
      t("The Meaning of a Homograph", "同形异义词的意思"),
      t(
        "A **homograph** is a word spelled the same as another word but with a different meaning, and often a different sound. *The **wind** blew* is moving air; ***wind** the clock* means to turn it. The other words of the sentence tell you which word you are reading.",
        "**同形异义词**和另一个词拼写相同，但意思不同，读音也常常不同。*The **wind** blew* 里的 wind 是流动的空气；*__wind__ the clock* 的 wind 是转动、上发条。句子里的其他词会告诉你读到的是哪个词。",
      ),
      choiceGenerator(
        t("What does the word in bold mean in this sentence?", "这个句子中加粗的词是什么意思？"),
        meaningOfHomograph,
        (right, shown) => {
          const { h, s } = senseOf(shown);
          return t(
            `Here **${h.word}** means *${right}*, and it is said ${s.said}. The rest of the sentence shows which of the two words it is.`,
            `这里 **${h.word}** 的意思是 *${right}*，读法：${s.said}。句子的其余部分说明它是两个词中的哪一个。`,
          );
        },
        (wrong, _right, shown, position) => {
          const { h } = senseOf(shown);
          return position === 0
            ? t(
                `*${wrong}* is the other word spelled **${h.word}**; it does not fit the rest of this sentence.`,
                `*${wrong}* 是另一个拼作 **${h.word}** 的词的意思，不符合这个句子的其余部分。`,
              )
            : t(
                `**${h.word}** never means *${wrong}*; read the words around it again.`,
                `**${h.word}** 没有 *${wrong}* 这个意思，再读一读它周围的词。`,
              );
        },
      ),
    ),
    point(
      "saying-a-homograph",
      t("How a Homograph Is Said", "同形异义词的读法"),
      t(
        "Many homographs are said in two ways, one for each meaning. *Tear* rhymes with *fear* when it is a drop from the eye and with *bear* when it means to rip. Some change only the part that is said strongly: a **PRES**ent is a gift, but to pre**SENT** is to show. Read the sentence first, then say the word.",
        "许多同形异义词有两种读法，每种意思一种。*tear* 表示眼泪时与 *fear* 押韵，表示撕时与 *bear* 押韵。有些词只是重读的部分不同：**PRES**ent 是礼物，pre**SENT** 是呈现、颁发。先读懂句子，再读出这个词。",
      ),
      choiceGenerator(
        t("In which sentence is the word said this way?", "在哪个句子里，这个词是这样读的？"),
        sayingHomograph,
        (right, shown) => {
          const { h, s } = senseOf(right);
          return t(
            `When **${h.word}** means *${s.means}*, it is said ${s.said}, as in this sentence. ${shown.replace(/\*\*/g, "")} goes with that meaning only.`,
            `**${h.word}** 表示 *${s.means}* 时，读法是：${s.said}，正如这个句子。这种读法只对应这个意思。`,
          );
        },
        (wrong) => {
          const { h, s } = senseOf(wrong);
          return t(
            `In that sentence **${h.word}** means *${s.means}*, so it is said ${s.said}, not the way asked for.`,
            `在那个句子里 **${h.word}** 的意思是 *${s.means}*，所以读法是：${s.said}，不是题目要求的读法。`,
          );
        },
      ),
    ),
  ],
});

// Roots: each root has a meaning and three words, each with a definition.
interface Root {
  readonly root: string;
  readonly means: string;
  readonly zh: string;
  readonly words: readonly (readonly [word: string, definition: string])[];
}

const roots = (lines: string): Root[] =>
  rows(lines).map((r) => ({
    root: field(r, 0),
    means: field(r, 1),
    zh: field(r, 2),
    words: [
      [field(r, 3), field(r, 4)],
      [field(r, 5), field(r, 6)],
      [field(r, 7), field(r, 8)],
    ],
  }));

const greek = roots(`
  astro|star|星|astronaut|a person trained to travel into space|astronomy|the science of the stars and planets|astrophysics|the study of what stars are made of and how they behave
  hydr|water|水|hydrant|a pipe in the street that firefighters take water from|hydrogen|a gas that makes water when it burns|hydroelectric|making electricity from moving water
  chron|time|时间|chronological|in the order in which things happened|chronicle|a record of events in the order they happened|synchronize|to make things happen at the same time
  cycl|wheel or ring|轮，环|bicycle|a machine with two wheels that you pedal|cyclone|a storm of winds that spin round and round|recycle|to use material again in a new round of use
  meter|measure|测量|thermometer|a tool that measures how hot something is|barometer|a tool that measures the pressure of the air|speedometer|the dial in a car that measures how fast it goes
  logy|study of|学科，研究|biology|the study of living things|geology|the study of rocks and the earth|ecology|the study of how living things depend on each other and their home
  zoo|animal|动物|zoology|the science of animals|zoologist|a scientist who studies animals|zoo|a park where wild animals are kept so that people can see them
  phys|nature|自然|physics|the science of matter, energy and forces|physical|to do with the body or with things you can touch|physician|a doctor of medicine
  techn|skill or craft|技艺|technology|tools and machines made with scientific skill|technique|a skillful way of doing something|technician|a worker with the skill to run or repair machines
  dyna|power|力量|dynamite|an explosive powerful enough to break rock|dynamo|a machine that makes electric power|dynamic|full of energy and power
`);

const latin = roots(`
  terr|earth or land|土地|territory|an area of land that belongs to someone|terrarium|a glass box of soil where small plants or animals live|terrain|the land and what it is like
  aqua|water|水|aquarium|a glass tank where fish are kept|aquatic|living or growing in water|aqueduct|a channel built to carry water a long way
  sol|sun|太阳|solar|of or from the sun|solstice|a day when the sun is at its highest or lowest point|parasol|an umbrella that gives shade from the sun
  lun|moon|月亮|lunar|of the moon|lunation|the time from one new moon to the next|lunule|the pale half-moon shape at the base of a fingernail
  stell|star|星|stellar|of the stars|constellation|a group of stars that seems to make a shape|interstellar|between the stars
  vent|wind or air|风|ventilate|to let fresh air into a room|vent|an opening that lets air in or out|ventilator|a machine that moves air to help someone breathe
  nav|ship|船|navy|the ships and sailors of a country|navigate|to find the way, as a ship's crew does|naval|to do with a navy and its ships
  flu|flow|流动|fluid|a substance that flows, such as water|fluent|speaking so easily that the words flow|influx|a large number of people or things flowing in
  grav|heavy|重|gravity|the force that pulls heavy things toward the earth|grave|very serious, as if heavy|aggravate|to make a problem heavier or worse
  orb|round path or ball|圆形轨道，球|orbit|the round path of one object around another in space|orbital|to do with an orbit|orb|a ball or globe, such as the sun or the moon
`);

const rootTopic = (
  id: string,
  title: Pair,
  summary: Pair,
  after: string,
  list: readonly Root[],
  origin: Pair,
  explanations: readonly [Pair, Pair],
): TopicDef => {
  const rootMeaning: ChoiceItem[] = [];
  const wordForDefinition: ChoiceItem[] = [];
  list.forEach((r, i) => {
    r.words.forEach(([word, definition], k) => {
      const others = [list[(i + 1 + k) % list.length], list[(i + 4 + k) % list.length]];
      rootMeaning.push([`*${r.root}* in **${word}** (${definition})`, r.means, others.map((o) => o?.means ?? "")]);
      wordForDefinition.push([definition, word, others.map((o) => o?.words[k]?.[0] ?? "")]);
    });
  });
  const byMeaning = (means: string) => list.find((r) => r.means === means);
  const byWord = (word: string) => list.find((r) => r.words.some(([w]) => w === word));
  return topic("vocabulary", {
    id,
    title,
    summary,
    after: [after],
    xp: 15,
    points: [
      point(
        "meaning-of-the-root",
        t("The Meaning of the Root", "词根的意思"),
        t(...explanations[0]),
        choiceGenerator(
          t(`What does the ${origin[0]} root in italics mean?`, `斜体的${origin[1]}词根是什么意思？`),
          rootMeaning,
          (right) => {
            const r = byMeaning(right);
            return t(
              `The root *${r?.root}* means *${right}*: ${r?.words.map(([w]) => `**${w}**`).join(", ")} all carry that meaning.`,
              `词根 *${r?.root}* 的意思是"${r?.zh}"：${r?.words.map(([w]) => `**${w}**`).join("、")} 都带有这个意思。`,
            );
          },
          (wrong) => {
            const r = byMeaning(wrong);
            return t(
              `*${wrong}* is the meaning of another root, *${r?.root}*, as in **${r?.words[0]?.[0]}**.`,
              `*${wrong}* 是另一个词根 *${r?.root}* 的意思，例如 **${r?.words[0]?.[0]}**。`,
            );
          },
        ),
      ),
      point(
        "word-from-the-root",
        t("Choosing the Word from Its Root", "根据词根选词"),
        t(...explanations[1]),
        choiceGenerator(
          t("Which word has this meaning?", "哪个词是这个意思？"),
          wordForDefinition,
          (right, shown) => {
            const r = byWord(right);
            return t(
              `**${right}** means *${shown}*. Its root *${r?.root}* means *${r?.means}*, which points to the meaning.`,
              `**${right}** 的意思是 *${shown}*。它的词根 *${r?.root}* 意为"${r?.zh}"，指向这个意思。`,
            );
          },
          (wrong) => {
            const r = byWord(wrong);
            const def = r?.words.find(([w]) => w === wrong)?.[1];
            return t(
              `**${wrong}** has the root *${r?.root}* (${r?.means}); it means *${def}*.`,
              `**${wrong}** 的词根是 *${r?.root}*（${r?.zh}），意思是 *${def}*。`,
            );
          },
        ),
      ),
    ],
  });
};

const greekRoots = rootTopic(
  "greek-roots-of-science",
  ["Greek Roots of Science", "科学中的希腊词根"],
  [
    "Ten Greek roots that build the words of science: astro, hydr, chron, cycl, meter, logy, zoo, phys, techn and dyna.",
    "构成科学词汇的十个希腊词根：astro、hydr、chron、cycl、meter、logy、zoo、phys、techn 和 dyna。",
  ],
  "greek-roots-1",
  greek,
  ["Greek", "希腊"],
  [
    [
      "Many words of science are built from Greek roots. *Astro* means star, *hydr* water, *chron* time, *cycl* wheel or ring, *meter* measure, *logy* study of, *zoo* animal, *phys* nature, *techn* skill and *dyna* power. Find the root, and it tells you part of what the word means.",
      "许多科学词汇由希腊词根构成。*astro* 意为星，*hydr* 水，*chron* 时间，*cycl* 轮或环，*meter* 测量，*logy* 学科，*zoo* 动物，*phys* 自然，*techn* 技艺，*dyna* 力量。找到词根，就知道这个词的一部分意思。",
    ],
    [
      "When you meet a long word of science, split it into its parts. *Thermometer* has *meter*, measure, so it is a tool that measures; *zoologist* has *zoo*, animal, so it is someone who studies animals. Match the root to the meaning you need.",
      "遇到长的科学词汇时，把它拆成几个部分。*thermometer* 含有 *meter*（测量），所以是测量的工具；*zoologist* 含有 *zoo*（动物），所以是研究动物的人。把词根和你需要的意思对上。",
    ],
  ],
);

const latinRoots = rootTopic(
  "latin-roots-of-earth-and-sky",
  ["Latin Roots of Earth and Sky", "大地与天空的拉丁词根"],
  [
    "Ten Latin roots of the earth and the sky: terr, aqua, sol, lun, stell, vent, nav, flu, grav and orb.",
    "有关大地与天空的十个拉丁词根：terr、aqua、sol、lun、stell、vent、nav、flu、grav 和 orb。",
  ],
  "latin-roots-1",
  latin,
  ["Latin", "拉丁"],
  [
    [
      "Latin gave English many words of the earth and the sky. *Terr* means earth, *aqua* water, *sol* sun, *lun* moon, *stell* star, *vent* wind or air, *nav* ship, *flu* flow, *grav* heavy and *orb* a round path or ball. The root is the part of the word that carries this meaning.",
      "拉丁语给了英语许多有关大地与天空的词。*terr* 意为土地，*aqua* 水，*sol* 太阳，*lun* 月亮，*stell* 星，*vent* 风或空气，*nav* 船，*flu* 流动，*grav* 重，*orb* 圆形轨道或球。词根就是词中承载这个意思的部分。",
    ],
    [
      "A Latin root helps you choose between words that look alike. *Solar* has *sol*, the sun; *stellar* has *stell*, the stars; *lunar* has *lun*, the moon. Read the meaning you need, think of the root that carries it, and find the word that holds that root.",
      "拉丁词根能帮你区分长得相似的词。*solar* 含有 *sol*（太阳）；*stellar* 含有 *stell*（星）；*lunar* 含有 *lun*（月亮）。读懂需要的意思，想一想承载它的词根，再找含有这个词根的词。",
    ],
  ],
);

// Words from names and myths: word|meaning|story|story in Chinese|sentence|sentence|sentence
const mythWords = rows(`
  marathon|a very long race or task|a runner who carried news of a battle all the way to Athens|一名信使从战场一路跑到雅典报信|The **marathon** is a race of about forty-two kilometers.|Cleaning the whole garage was a **marathon**.|We had a reading **marathon** that lasted all weekend.
  olympic|to do with the Olympic Games, or very great|the games held for the gods at Olympia|在奥林匹亚为众神举行的运动会|She trained for years to become an **olympic** swimmer.|Climbing those stairs with a sofa was an **olympic** effort.|The city built an **olympic** pool for the games.
  echo|a sound that comes back to you|a nymph who could only repeat the last words of others|一位只能重复别人最后几个词的仙女|We shouted into the cave and heard an **echo**.|His words were an **echo** of what his father always said.|The **echo** of the bell rang through the valley.
  atlas|a book of maps|a giant who was made to hold up the sky|一位被罚扛起天空的巨人|I found the country in the **atlas**.|Our class **atlas** has a map of every continent.|She traced the river's path in a road **atlas**.
  panic|a sudden fear that spreads|the god Pan, whose shout frightened travelers in the woods|潘神，他的叫声会吓坏林中的旅人|The fire alarm caused **panic** in the hall.|Do not **panic**; walk calmly to the door.|A wave of **panic** went through the crowd.
  titanic|huge and powerful|the Titans, the giant gods who ruled before Zeus|泰坦，在宙斯之前统治的巨神|The two teams fought a **titanic** battle.|A **titanic** wave crashed over the wall.|It was a **titanic** task to move the stones.
  herculean|needing great strength or effort|Hercules, the hero who finished twelve impossible tasks|赫拉克勒斯，完成了十二项不可能任务的英雄|Cleaning up after the flood was a **herculean** job.|It took a **herculean** effort to finish on time.|Lifting the fallen tree was **herculean** work.
  mentor|a wise guide and teacher|the friend who guided the son of Odysseus|引导奥德修斯之子的那位朋友|My coach became my **mentor**.|Every new nurse has a **mentor** for the first year.|Her **mentor** taught her how to write a news story.
  odyssey|a long journey full of adventures|the long voyage home of Odysseus after a war|奥德修斯战后漫长的归乡航程|Their trip across the country became an **odyssey**.|The book tells of one dog's **odyssey** to find its home.|Getting to the island was an **odyssey** of buses and boats.
  narcissus|a flower, or a person who loves himself too much|a young man who fell in love with his own face in a pool|一个爱上自己在水中倒影的年轻人|A yellow **narcissus** bloomed in the garden.|The boy who stared at his own photos all day was a real **narcissus**.|We planted **narcissus** bulbs in the fall.
`);

const myths = mythWords.map((r) => ({
  word: field(r, 0),
  means: field(r, 1),
  story: field(r, 2),
  storyZh: field(r, 3),
  sentences: [field(r, 4), field(r, 5), field(r, 6)],
}));
const mythOf = (text: string) => myths.find((m) => m.means === text || m.story === text || m.sentences.includes(text));

const mythMeaning: ChoiceItem[] = [];
const mythStory: ChoiceItem[] = [];
myths.forEach((m, i) => {
  m.sentences.forEach((s, k) => {
    const others = [myths[(i + 1 + k) % myths.length], myths[(i + 5 + k) % myths.length]];
    mythMeaning.push([s, m.means, others.map((o) => o?.means ?? "")]);
    mythStory.push([s, m.story, others.map((o) => o?.story ?? "")]);
  });
});

const namesAndMyths = topic("vocabulary", {
  id: "words-from-names-and-myths",
  title: ["Words from Names and Myths", "来自人名与神话的词"],
  summary: [
    "Words that come from people, places and myths: marathon, olympic, echo, atlas, panic, titanic and more.",
    "来自人物、地名和神话的词：marathon、olympic、echo、atlas、panic、titanic 等。",
  ],
  after: ["context-clues"],
  points: [
    point(
      "meaning-of-a-word-from-a-myth",
      t("What the Word Means", "这个词的意思"),
      t(
        "Some English words began as names of people, places or characters of myths. A **marathon** is a long race or task; an **echo** is a sound that comes back; **panic** is a sudden fear. Today they are ordinary words, so the sentence around them tells you what they mean.",
        "有些英语单词起初是人名、地名或神话人物的名字。**marathon** 是长跑或漫长的任务；**echo** 是回声；**panic** 是突然的恐慌。如今它们是普通的词，所以周围的句子会告诉你它们的意思。",
      ),
      choiceGenerator(
        t("What does the word in bold mean?", "加粗的词是什么意思？"),
        mythMeaning,
        (right, shown) => {
          const m = mythOf(shown);
          return t(
            `**${m?.word}** means *${right}*. It comes from ${m?.story}, and the sentence uses it in that sense.`,
            `**${m?.word}** 的意思是 *${right}*。它来自${m?.storyZh}，句子正是用了这个意思。`,
          );
        },
        (wrong) => {
          const m = mythOf(wrong);
          return t(`*${wrong}* is what **${m?.word}** means, which is another word.`, `*${wrong}* 是另一个词 **${m?.word}** 的意思。`);
        },
      ),
    ),
    point(
      "story-behind-the-word",
      t("The Story Behind the Word", "词背后的故事"),
      t(
        "Knowing the story behind a word helps you remember it. A **herculean** task needs the strength of Hercules, the hero of twelve great labors; an **odyssey** is a long journey like the voyage home of Odysseus; a **mentor** is a guide, like the friend who guided the son of Odysseus.",
        "知道一个词背后的故事，有助于记住它。**herculean** 的任务需要赫拉克勒斯（完成十二项艰巨任务的英雄）那样的力气；**odyssey** 是像奥德修斯归乡航程那样漫长的旅程；**mentor** 是引路人，就像那位引导奥德修斯之子的朋友。",
      ),
      choiceGenerator(
        t("Which story does the word in bold come from?", "加粗的词来自哪个故事？"),
        mythStory,
        (right, shown) => {
          const m = mythOf(shown);
          return t(
            `**${m?.word}** comes from ${right}; that is why it means *${m?.means}*.`,
            `**${m?.word}** 来自${m?.storyZh}，所以它的意思是 *${m?.means}*。`,
          );
        },
        (wrong) => {
          const m = mythOf(wrong);
          return t(
            `That story gave English the word **${m?.word}**, not this one.`,
            `那个故事给英语带来的是 **${m?.word}** 这个词，不是这个词。`,
          );
        },
      ),
    ),
  ],
});

// Blends: word|first|second|wrong pair|wrong pair|sentence
const blendLines = `
  smog|smoke|fog|smell and fog|smoke and frog|A brown **smog** hung over the city.
  brunch|breakfast|lunch|bread and lunch|breakfast and crunch|On Sundays we eat a late **brunch**.
  motel|motor|hotel|motion and hotel|motor and tell|We stayed at a **motel** beside the highway.
  sitcom|situation|comedy|sitting and comedy|situation and common|My favorite **sitcom** is about a family of five.
  spork|spoon|fork|spot and fork|spoon and pork|The camping kit came with a plastic **spork**.
  moped|motor|pedal|mop and pedal|motor and speed|He rode his **moped** to work.
  camcorder|camera|recorder|camp and recorder|camera and corner|Grandpa filmed the party with an old **camcorder**.
  heliport|helicopter|airport|helium and airport|helicopter and port|The hospital has a **heliport** on its roof.
  squiggle|squirm|wiggle|square and wiggle|squirm and giggle|She drew a **squiggle** at the bottom of the page.
  twirl|twist|whirl|twin and whirl|twist and swirl|The dancer began to **twirl** on one foot.
  chortle|chuckle|snort|chart and snort|chuckle and turtle|He let out a **chortle** at the joke.
  guesstimate|guess|estimate|guest and estimate|guess and mate|Give me a **guesstimate** of how many beans are in the jar.
  emoticon|emotion|icon|emote and cone|emotion and con|She ended her message with a smiling **emoticon**.
  splatter|splash|spatter|split and spatter|splash and matter|Paint began to **splatter** across the floor.
  staycation|stay|vacation|station and vacation|stay and location|We had a **staycation** and visited the museums in our own town.
`;
const blends = rows(blendLines).map((r) => ({
  word: field(r, 0),
  right: `${field(r, 1)} and ${field(r, 2)}`,
  wrong: [field(r, 3), field(r, 4)],
  sentence: field(r, 5),
}));
const blendOf = (shown: string) => blends.find((b) => shown.includes(`**${b.word}**`));
const blendItems: ChoiceItem[] = blends.flatMap((b): ChoiceItem[] => [
  [`**${b.word}**`, b.right, b.wrong],
  [b.sentence, b.right, [b.wrong[1] ?? "", b.wrong[0] ?? ""]],
]);

// Shortened words: short|full|wrong|wrong|sentence|sentence
const shortLines = `
  lab|laboratory|labyrinth|labeling|The science **lab** has new microscopes.|We tested the water in the school **lab**.
  photo|photograph|photosynthesis|photocopy|She took a **photo** of the sunset.|There is a **photo** of my grandparents on the wall.
  gym|gymnasium|gymnastics|gymnast|We play basketball in the **gym**.|The school **gym** was full of parents.
  ad|advertisement|administration|adventure|An **ad** for the new phone played on TV.|The newspaper **ad** said the sale ends Friday.
  exam|examination|exaggeration|example|Our math **exam** is on Monday.|She studied all week for the **exam**.
  phone|telephone|microphone|phonics|Please answer the **phone**.|My **phone** rang during dinner.
  fridge|refrigerator|refreshment|frigate|Put the milk back in the **fridge**.|The **fridge** was full after the shopping trip.
  flu|influenza|fluorescent|influence|Half the class was home with the **flu**.|She had a fever and other signs of the **flu**.
  bike|bicycle|bicentennial|biker|I ride my **bike** to school.|His **bike** has a flat tire.
  memo|memorandum|memorization|memorial|The principal sent a **memo** to every teacher.|A **memo** on the board listed the new rules.
  info|information|infrastructure|infection|Ask at the desk for more **info**.|The website has **info** about the museum's hours.
  champ|champion|championship|champagne|The chess **champ** won every game.|Our team is the league **champ** again.
  sub|submarine|subtraction|subway|The **sub** dived deep under the ocean.|The crew of the **sub** stayed underwater for weeks.
  limo|limousine|limitation|limerick|A long black **limo** pulled up at the theater.|The singer arrived in a **limo**.
  deli|delicatessen|delightful|delivery|We bought sandwiches at the **deli**.|The **deli** sells cheese and cold meats.
`;
const shorts = rows(shortLines).map((r) => ({
  word: field(r, 0),
  full: field(r, 1),
  wrong: [field(r, 2), field(r, 3)],
  sentences: [field(r, 4), field(r, 5)],
}));
const shortOf = (text: string) => shorts.find((s) => s.full === text || s.wrong.includes(text) || s.sentences.includes(text));
const shortItems: ChoiceItem[] = shorts.flatMap((s) =>
  s.sentences.map((sentence, k): ChoiceItem => [sentence, s.full, k === 0 ? s.wrong : [s.wrong[1] ?? "", s.wrong[0] ?? ""]]),
);

const blendedWords = topic("vocabulary", {
  id: "blended-and-shortened-words",
  title: ["Blended and Shortened Words", "合成词与缩略词"],
  summary: [
    "Words made by blending two words, such as smog and brunch, and words made by shortening a longer one, such as lab and photo.",
    "由两个词混合而成的词，如 smog 和 brunch；以及由长词缩短而成的词，如 lab 和 photo。",
  ],
  after: ["compound-words"],
  points: [
    point(
      "the-two-words-of-a-blend",
      t("The Two Words of a Blend", "混合词的两个来源词"),
      t(
        "A **blend** joins the start of one word to the end of another, so it keeps part of each meaning. *Smog* is *smoke* and *fog*; *brunch* is *breakfast* and *lunch*; *motel* is *motor* and *hotel*. To find the two words, ask what the thing is a mix of.",
        "**混合词**把一个词的开头和另一个词的结尾接在一起，因此保留了两者的部分意思。*smog* 是 *smoke* 加 *fog*；*brunch* 是 *breakfast* 加 *lunch*；*motel* 是 *motor* 加 *hotel*。要找出这两个词，问问这个东西是什么和什么的混合。",
      ),
      choiceGenerator(
        t("Which two words were blended to make the word in bold?", "加粗的词是由哪两个词混合而成的？"),
        blendItems,
        (right, shown) => {
          const b = blendOf(shown);
          return t(
            `**${b?.word}** blends *${right}*: it keeps the start of the first word and the end of the second, and its meaning mixes both.`,
            `**${b?.word}** 由 *${right}* 混合而成：保留第一个词的开头和第二个词的结尾，意思也是两者的混合。`,
          );
        },
        (wrong, right) =>
          t(
            `*${wrong}* sounds close, but its meaning is not part of the word; the blend is *${right}*.`,
            `*${wrong}* 听起来接近，但它的意思不在这个词里；正确的来源是 *${right}*。`,
          ),
      ),
    ),
    point(
      "the-full-word-of-a-short-one",
      t("The Full Word of a Shortened One", "缩略词的完整形式"),
      t(
        "A **shortened word** (a clipping) keeps one part of a longer word and means the same: *lab* is *laboratory*, *photo* is *photograph*, *flu* is *influenza*. Short words are fine in everyday speech; in formal writing the full word is often better, so it helps to know it.",
        "**缩略词**保留长词的一部分，意思不变：*lab* 是 *laboratory*，*photo* 是 *photograph*，*flu* 是 *influenza*。缩略词在日常说话中很常用；正式写作中往往用完整的词更好，所以要知道它的完整形式。",
      ),
      choiceGenerator(
        t("Which full word is the word in bold short for?", "加粗的词是哪个完整单词的缩略形式？"),
        shortItems,
        (right, shown) => {
          const s = shortOf(shown);
          return t(
            `**${s?.word}** is short for *${right}*, and it keeps the same meaning in this sentence.`,
            `**${s?.word}** 是 *${right}* 的缩略形式，在这个句子里意思相同。`,
          );
        },
        (wrong, right) =>
          t(
            `*${wrong}* begins with similar letters but means something else; the full word here is *${right}*.`,
            `*${wrong}* 开头的字母相似，但意思不同；这里的完整单词是 *${right}*。`,
          ),
      ),
    ),
  ],
});

// Analogies: relation labels, then "pair|relation" lines, then "a:b as c:?|right|wrong|wrong|relation".
const relations: Record<string, Label> = {
  "same meaning": {
    zh: "同义",
    why: ["The two words mean nearly the same thing.", "这两个词的意思几乎相同。"],
    not: ["Words of the same meaning could swap places in a sentence; these cannot.", "同义词能在句子中互换，这两个词不能。"],
  },
  opposites: {
    zh: "反义",
    why: ["The two words mean the opposite of each other.", "这两个词意思相反。"],
    not: ["Opposites mean contrary things; these two are not contrary.", "反义词意思相反，这两个词并不相反。"],
  },
  "part to whole": {
    zh: "部分与整体",
    why: ["The first is one part of the second.", "前一个是后一个的一部分。"],
    not: ["For part to whole, the first must be a piece of the second; it is not.", "部分与整体要求前一个是后一个的一部分，这里不是。"],
  },
  "tool to user": {
    zh: "工具与使用者",
    why: ["The first is a tool or aid the second uses in their work.", "前一个是后一个工作时使用的工具或帮手。"],
    not: [
      "For tool to user, the second must use the first in their work; that is not the link here.",
      "工具与使用者要求后一个在工作中使用前一个，这里不是这种关系。",
    ],
  },
  "cause to effect": {
    zh: "因果",
    why: ["The first causes or leads to the second.", "前一个导致后一个。"],
    not: ["For cause to effect, the first must bring about the second; it does not.", "因果关系要求前一个导致后一个，这里不是。"],
  },
};

const relationLines = `
  baffled : puzzled|same meaning
  peculiar : strange|same meaning
  certain : sure|same meaning
  bold : brave|same meaning
  conceal : hide|same meaning
  obvious : clear|same meaning
  deny : admit|opposites
  certain : doubtful|opposites
  bold : timid|opposites
  conceal : reveal|opposites
  rigid : flexible|opposites
  urban : rural|opposites
  page : book|part to whole
  mast : ship|part to whole
  digit : number|part to whole
  chapter : novel|part to whole
  wheel : bicycle|part to whole
  verse : poem|part to whole
  magnifying glass : detective|tool to user
  brush : painter|tool to user
  stethoscope : doctor|tool to user
  telescope : astronomer|tool to user
  oar : rower|tool to user
  hammer : blacksmith|tool to user
  storm : flood|cause to effect
  drought : thirst|cause to effect
  joke : laughter|cause to effect
  exercise : fitness|cause to effect
  germ : illness|cause to effect
  spark : fire|cause to effect
`;

const analogyLines = `
  Clue is to detective as map is to ___.|explorer|road|treasure|tool to user
  Brush is to painter as quill is to ___.|writer|feather|ink|tool to user
  Oar is to rower as compass is to ___.|navigator|north|needle|tool to user
  Hammer is to carpenter as anvil is to ___.|blacksmith|iron|heavy|tool to user
  Telescope is to astronomer as microscope is to ___.|biologist|cell|lens|tool to user
  Ladder is to firefighter as stethoscope is to ___.|doctor|heart|hospital|tool to user
  Bold is to brave as eerie is to ___.|spooky|cheerful|dark|same meaning
  Puzzled is to baffled as uneasy is to ___.|worried|calm|sleepy|same meaning
  Conceal is to hide as reveal is to ___.|show|cover|find|same meaning
  Rugged is to rough as gloomy is to ___.|dark|bright|rainy|same meaning
  Durable is to lasting as fragile is to ___.|delicate|strong|glass|same meaning
  Fond is to loving as sincere is to ___.|honest|false|kind|same meaning
  Admit is to deny as accept is to ___.|refuse|agree|receive|opposites
  Rigid is to flexible as brittle is to ___.|bendable|breakable|hard|opposites
  Urban is to rural as city is to ___.|countryside|town|street|opposites
  Prosper is to decline as rise is to ___.|fall|grow|climb|opposites
  Ancient is to modern as bygone is to ___.|present-day|historic|old|opposites
  Courage is to fear as hope is to ___.|despair|wish|faith|opposites
  Page is to book as room is to ___.|house|door|floor|part to whole
  Mast is to ship as wing is to ___.|airplane|feather|fly|part to whole
  Chapter is to novel as scene is to ___.|play|actor|stage|part to whole
  Petal is to flower as leaf is to ___.|tree|green|root|part to whole
  Key is to piano as string is to ___.|violin|rope|music|part to whole
  Cell is to body as brick is to ___.|wall|clay|builder|part to whole
  Storm is to flood as drought is to ___.|famine|rain|desert|cause to effect
  Spark is to fire as seed is to ___.|plant|soil|garden|cause to effect
  Joke is to laughter as insult is to ___.|anger|jokes|friend|cause to effect
  Germ is to illness as exercise is to ___.|strength|gym|tired|cause to effect
  Heat is to melting as cold is to ___.|freezing|ice|winter|cause to effect
  Practice is to skill as study is to ___.|knowledge|books|school|cause to effect
`;

const analogyRows = rows(analogyLines);
const analogyItems: ChoiceItem[] = analogyRows.map((r) => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]);
const analogyRelation = (shown: string) => {
  const r = analogyRows.find((row) => row[0] === shown);
  return r ? field(r, 4) : "";
};

const wordAnalogies = topic("vocabulary", {
  id: "word-analogies",
  title: ["Word Analogies", "词语类比"],
  summary: [
    "An analogy pairs words that relate in the same way: synonyms, opposites, part and whole, tool and user, cause and effect.",
    "类比把关系相同的两对词放在一起：同义、反义、部分与整体、工具与使用者、因果。",
  ],
  // synonyms-and-antonyms stands in as context-clues, which shades-of-meaning already implies.
  after: ["shades-of-meaning"],
  points: [
    label(
      "how-two-words-relate",
      ["How Two Words Relate", "两个词的关系"],
      [
        "An analogy is built on how two words relate. They may mean the **same** (*bold : brave*), be **opposites** (*deny : admit*), be a **part** of a **whole** (*mast : ship*), a **tool** and its **user** (*brush : painter*), or a **cause** and its **effect** (*storm : flood*). Say the link as a sentence: a mast is part of a ship.",
        "类比的基础是两个词的关系。它们可能**同义**（*bold : brave*），**反义**（*deny : admit*），是**部分与整体**（*mast : ship*），**工具与使用者**（*brush : painter*），或者**因果**（*storm : flood*）。把关系说成一句话：桅杆是船的一部分。",
      ],
      ["How are these two words related?", "这两个词是什么关系？"],
      relationLines,
      relations,
    ),
    choose(
      "completing-an-analogy",
      ["Completing an Analogy", "完成类比"],
      [
        "To complete an analogy, find how the first pair relates, then find the word that makes the second pair relate in the same way. *Clue is to detective as map is to ___*: a detective uses clues, so the answer is the person who uses a map, an *explorer*. A word that merely goes with the other is not enough.",
        "完成类比时，先找出第一对词的关系，再找一个词让第二对词也有同样的关系。*Clue is to detective as map is to ___*：侦探使用线索，所以答案是使用地图的人，*explorer*。只是和另一个词有联系还不够。",
      ],
      ["Which word completes the analogy?", "哪个词能完成这个类比？"],
      analogyItems,
      (right, shown) => {
        const rel = analogyRelation(shown);
        const zh = relations[rel]?.zh ?? "";
        return [
          `The first pair is ${rel}, so the second pair must be ${rel} too: the answer is **${right}**.`,
          `第一对词的关系是${zh}，第二对也必须是${zh}：答案是 **${right}**。`,
        ];
      },
      [
        [
          "*{wrong}* goes with the word, but not in the same way as the first pair; the pair needs **{right}**.",
          "*{wrong}* 与这个词有联系，但关系与第一对不同；应选 **{right}**。",
        ],
        [
          "*{wrong}* is linked to the second pair in another way; match the link of the first pair, which gives **{right}**.",
          "*{wrong}* 与第二对词的联系是另一种关系；要照第一对的关系，答案是 **{right}**。",
        ],
      ],
    ),
  ],
});

/** wordStudyTopics5 are the topics of word study of grade 5. */
export const wordStudyTopics5: readonly TopicDef[] = [homographTopic, greekRoots, latinRoots, namesAndMyths, blendedWords, wordAnalogies];
