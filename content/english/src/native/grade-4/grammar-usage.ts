// Grade 4: the topics of usage and mechanics: reflexive pronouns, double negatives, between and among, in and into,
// punctuation for effect, formal English, quotation marks for quotations, and abbreviations.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { fields, fill, type Item, itemGenerator, nameKind } from "./kit.ts";
import { after } from "./prior.ts";

// Reflexive pronouns.

/** reflexiveOf tells whom each reflexive pronoun refers to. */
const reflexiveOf: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  myself: ["*I*", "*I*"],
  yourself: ["one person spoken to, *you*", "一个听话人 *you*"],
  himself: ["one boy or man, *he*", "一个男性 *he*"],
  herself: ["one girl or woman, *she*", "一个女性 *she*"],
  itself: ["one thing or animal, *it*", "一个事物或动物 *it*"],
  ourselves: ["*we*", "*we*"],
  yourselves: ["more than one person spoken to, *you*", "多个听话人 *you*"],
  themselves: ["more than one person or thing, *they*", "多个人或事物 *they*"],
};

/** nonstandard lists the forms that are not words of standard English. */
const nonstandard = new Set(["hisself", "theirselves", "theirself", "themself", "ourself", "itsself", "meself", "yourselfs"]);

const reflexiveLines = `
  The body heals ___ after a small cut.|itself|themselves|itsself
  The runners stretched ___ before the race.|themselves|himself|theirselves
  My brother hurt ___ when he fell off his bike.|himself|herself|hisself
  I taught ___ to swim last summer.|myself|yourself|meself
  We made ___ a healthy lunch.|ourselves|themselves|ourself
  Grandma reminded ___ to drink more water.|herself|himself|her
  The cat licked ___ clean after dinner.|itself|herselves|itsself
  The twins dressed ___ for school.|themselves|ourselves|theirselves
  You should give ___ time to rest after a cold.|yourself|himself|you
  The doctor reminded ___ to wash his hands.|himself|itself|hisself
  My friends and I timed ___ on the track.|ourselves|themselves|ourself
  Children, please help ___ to some fruit.|yourselves|themselves|yourselfs
  The heart cannot rest; it keeps pumping by ___.|itself|themselves|itsself
  My mother lifted ___ out of the pool.|herself|himself|her
  The boys splashed ___ with cold water.|themselves|himself|theirselves
  I made ___ a promise to sleep earlier.|myself|ourselves|meself
  Our coach pushes ___ as hard as he pushes us.|himself|themselves|hisself
  The puppy scratched ___ behind the ear.|itself|himselves|itsself
  We reminded ___ to stand up straight.|ourselves|myself|ourself
  The players poured ___ some water.|themselves|itself|theirselves
  Ana weighed ___ on the scale at the clinic.|herself|themselves|her
  The robot can charge ___ at night.|itself|himself|itsself
  You can check your own pulse ___.|yourself|myself|you
  My uncle cooked ___ a big bowl of soup.|himself|herself|hisself
  The girls taught ___ a new dance.|themselves|herself|theirselves
  I wrapped ___ in a warm blanket.|myself|himself|meself
  We gave ___ a break after the long hike.|ourselves|yourselves|ourself
  The muscles repair ___ while you sleep.|themselves|itself|theirselves
  Leo looked at ___ in the mirror.|himself|itself|hisself
  Students, quiz ___ before the test.|yourselves|ourselves|yourselfs
  The skin protects ___ from the sun by turning darker.|itself|themselves|itsself
  My sister made ___ a cup of tea.|herself|myself|her
`;

const reflexiveRows = fields(reflexiveLines)
  .map(([shown, right, person, bad]) => {
    if (!shown || !right || !person || !bad) throw new Error(`a reflexive line needs four fields: ${shown}`);
    return { shown, right, person, bad };
  })
  .filter((row) => reflexiveOf[row.right] && (reflexiveOf[row.person] || row.person.endsWith("selves")));

const badWhy = (bad: string, right: string) =>
  nonstandard.has(bad)
    ? t(
        `*${bad}* is not a word of standard English. The standard form is *${right}*.`,
        `*${bad}* 不是标准英语中的词。标准形式是 *${right}*。`,
      )
    : t(
        `*${bad}* is an object pronoun: it would point to someone else, not back to the subject. To refer back, use *${right}*.`,
        `*${bad}* 是宾格代词：它指的是别人，而不是回指主语。要回指主语，用 *${right}*。`,
      );

const personWhy = (person: string, right: string) =>
  t(
    `*${person}* does not match the subject. ${reflexiveOf[person] ? `It refers to ${reflexiveOf[person]?.[0]}, ` : `*${person}* is not a word, `}but the subject needs *${right}*.`,
    `*${person}* 和主语不一致。${reflexiveOf[person] ? `它指的是${reflexiveOf[person]?.[1]}，` : `*${person}* 不是一个词，`}而主语需要 *${right}*。`,
  );

/** reflexiveGapBank asks for the reflexive pronoun that matches the subject. */
const reflexiveGapBank: readonly Item[] = reflexiveRows.map((row) => ({
  question: t("Which pronoun completes the sentence?", "哪个代词能补全句子？"),
  shown: row.shown,
  right: row.right,
  wrong: [row.person, row.bad],
  why: t(
    `${fill(row.shown, row.right)} A reflexive pronoun refers back to the subject; here it refers to ${reflexiveOf[row.right]?.[0]}, so it is *${row.right}*.`,
    `${fill(row.shown, row.right)} 反身代词回指主语；这里指的是${reflexiveOf[row.right]?.[1]}，所以用 *${row.right}*。`,
  ),
  whyNot: [personWhy(row.person, row.right), badWhy(row.bad, row.right)],
}));

/** reflexiveSentenceBank asks for the sentence whose reflexive pronoun is correct. */
const reflexiveSentenceBank: readonly Item[] = reflexiveRows.map((row) => {
  const right = row.shown.replace("___", row.right);
  const bad = row.shown.replace("___", row.bad);
  const person = row.shown.replace("___", row.person);
  return {
    question: t("Which sentence uses the right pronoun?", "哪个句子用对了代词？"),
    shown: "",
    right,
    wrong: [bad, person],
    why: t(
      `“${right}” is correct. *${row.right}* refers back to ${reflexiveOf[row.right]?.[0]}, the subject of the sentence.`,
      `“${right}” 是正确的。*${row.right}* 回指句子的主语${reflexiveOf[row.right]?.[1]}。`,
    ),
    whyNot: [badWhy(row.bad, row.right), personWhy(row.person, row.right)],
  };
});

// Double negatives.

const negativeLines = `
  The giant didn't have no shoes big enough for his feet.|didn't|no|giant|shoes|The giant didn't have any shoes big enough for his feet.|The giant didn't have shoes no bigger than his feet.
  Coyote never told nobody about his plan.|never|nobody|Coyote|plan|Coyote never told anybody about his plan.|Coyote didn't never tell anybody about his plan.
  The fox can't find nothing to eat.|can't|nothing|fox|eat|The fox can't find anything to eat.|The fox can't find nothing at all to eat.
  Rabbit won't never trust the fox again.|won't|never|Rabbit|again|Rabbit won't ever trust the fox again.|Rabbit won't never ever trust the fox again.
  Nobody saw nothing when the pumpkin rolled away.|Nobody|nothing|saw|pumpkin|Nobody saw anything when the pumpkin rolled away.|Nobody didn't see anything when the pumpkin rolled away.
  The lumberjack doesn't need no help.|doesn't|no|lumberjack|help|The lumberjack doesn't need any help.|The lumberjack doesn't need no help at all.
  I haven't never seen a cow that big.|haven't|never|seen|big|I have never seen a cow that big.|I haven't never once seen a cow that big.
  There isn't nowhere left to hide.|isn't|nowhere|There|left|There isn't anywhere left to hide.|There is nowhere not left to hide.
  The trickster didn't say nothing to the king.|didn't|nothing|trickster|king|The trickster didn't say anything to the king.|The trickster didn't say nothing at all to the king.
  Spider couldn't find no one to help him.|couldn't|no one|Spider|help|Spider couldn't find anyone to help him.|Spider couldn't find no one at all to help him.
  The mail carrier wasn't never late.|wasn't|never|carrier|late|The mail carrier was never late.|The mail carrier wasn't not ever late.
  Don't tell nobody about the secret map.|Don't|nobody|tell|map|Don't tell anybody about the secret map.|Don't tell nobody about no secret map.
  The farmer hasn't got no room for the giant pumpkin.|hasn't|no|farmer|room|The farmer hasn't got any room for the giant pumpkin.|The farmer hasn't got none room for the giant pumpkin.
  The monkey didn't want no rules.|didn't|no|monkey|rules|The monkey didn't want any rules.|The monkey didn't want no rules at all.
  We couldn't see nothing in the dust storm.|couldn't|nothing|We|storm|We couldn't see anything in the dust storm.|We couldn't not see anything in the dust storm.
  She doesn't go nowhere without her lasso.|doesn't|nowhere|She|lasso|She doesn't go anywhere without her lasso.|She doesn't go nowhere at all without her lasso.
  The king wouldn't listen to nobody.|wouldn't|nobody|king|listen|The king wouldn't listen to anybody.|The king wouldn't not listen to anybody.
  There wasn't no tornado she couldn't ride.|wasn't|no|tornado|ride|There wasn't a tornado she couldn't ride.|There wasn't no tornado she could ride.
  Fox can't never catch the clever rabbit.|can't|never|Fox|rabbit|Fox can't ever catch the clever rabbit.|Fox can't never ever catch the clever rabbit.
  The villagers didn't have no water in the dry summer.|didn't|no|villagers|summer|The villagers didn't have any water in the dry summer.|The villagers didn't have none water in the dry summer.
  I don't know nothing about lumberjacks.|don't|nothing|know|lumberjacks|I don't know anything about lumberjacks.|I don't know nothing at all about lumberjacks.
  The crow hasn't told no one where the corn is.|hasn't|no one|crow|corn|The crow hasn't told anyone where the corn is.|The crow hasn't not told anyone where the corn is.
  He never wants nothing but more stories.|never|nothing|He|stories|He never wants anything but more stories.|He doesn't never want anything but more stories.
  There aren't no trees left after the giant's breakfast.|aren't|no|trees|breakfast|There aren't any trees left after the giant's breakfast.|There aren't no trees not left after the giant's breakfast.
  The ox didn't do nothing wrong.|didn't|nothing|ox|wrong|The ox didn't do anything wrong.|The ox didn't do nothing wrong at all.
  Nobody never beat her in a race.|Nobody|never|beat|race|Nobody ever beat her in a race.|Nobody didn't ever beat her in a race.
  The tortoise won't take no shortcuts.|won't|no|tortoise|shortcuts|The tortoise won't take any shortcuts.|The tortoise won't take no shortcuts at all.
  You shouldn't believe nothing a trickster says.|shouldn't|nothing|believe|trickster|You shouldn't believe anything a trickster says.|You shouldn't not believe anything a trickster says.
  The sky king wasn't sharing none of his stories.|wasn't|none|king|stories|The sky king wasn't sharing any of his stories.|The sky king wasn't sharing none of his stories at all.
  I can't hardly lift this giant pancake.|can't|hardly|lift|pancake|I can hardly lift this giant pancake.|I can't hardly not lift this giant pancake.
  The goat didn't eat nothing but tin cans.|didn't|nothing|goat|cans|The goat didn't eat anything but tin cans.|The goat didn't eat nothing at all but tin cans.
  There isn't no way to outrun her.|isn't|no|There|outrun|There isn't any way to outrun her.|There isn't no way not to outrun her.
`;

const negativeRows = fields(negativeLines).map(([bad, n1, n2, x1, x2, good, wrong]) => {
  if (!bad || !n1 || !n2 || !x1 || !x2 || !good || !wrong) throw new Error(`a double negative line needs seven fields: ${bad}`);
  return { bad, n1, n2, x1, x2, good, wrong };
});

/** negativeFindBank asks for the two negative words of a sentence. */
const negativeFindBank: readonly Item[] = negativeRows.map((row) => ({
  question: t("Which two words make this sentence a double negative?", "哪两个词使这个句子成为双重否定？"),
  shown: row.bad,
  right: `${row.n1} and ${row.n2}`,
  wrong: [`${row.n1} and ${row.x1}`, `${row.x2} and ${row.n2}`],
  why: t(
    `*${row.n1}* and *${row.n2}* are both negative words. Standard English uses one negative in a clause, so one of them must change: *${row.good}*`,
    `*${row.n1}* 和 *${row.n2}* 都是否定词。标准英语在一个分句中只用一个否定词，所以其中一个必须改：*${row.good}*`,
  ),
  whyNot: [
    t(
      `*${row.x1}* is not a negative word. Negative words include *not* and *n't*, *no*, *never*, *nothing*, *nobody*, *nowhere*, *none* and *hardly*.`,
      `*${row.x1}* 不是否定词。否定词包括 *not* 和 *n't*、*no*、*never*、*nothing*、*nobody*、*nowhere*、*none* 和 *hardly*。`,
    ),
    t(
      `*${row.x2}* is not a negative word, so it is not part of the double negative. Find the two words that each say *no*.`,
      `*${row.x2}* 不是否定词，所以不是双重否定的一部分。找出两个各自表示“不”的词。`,
    ),
  ],
}));

/** negativeFixBank asks for the standard version of a sentence with a double negative. */
const negativeFixBank: readonly Item[] = negativeRows.map((row) => ({
  question: t("Which sentence says this in standard English?", "哪个句子用标准英语表达了这个意思？"),
  shown: row.bad,
  right: row.good,
  wrong: [row.bad, row.wrong],
  why: t(
    `“${row.good}” keeps one negative word. The second negative becomes a word such as *any*, *anything*, *anybody*, *anywhere* or *ever*, or it is dropped.`,
    `“${row.good}” 只保留一个否定词。第二个否定词换成 *any*、*anything*、*anybody*、*anywhere* 或 *ever* 这样的词，或者干脆去掉。`,
  ),
  whyNot: [
    t(
      `This is the sentence as it was, with two negatives: *${row.n1}* and *${row.n2}*. It needs to change.`,
      `这就是原句，仍有两个否定词：*${row.n1}* 和 *${row.n2}*。它需要修改。`,
    ),
    t(
      "This version still has two negative words, or it adds one more, so it is still not standard English.",
      "这个版本仍然有两个否定词，或者又多加了一个，所以仍不是标准英语。",
    ),
  ],
}));

// Between and among, in and into.

const betweenLines = `
  The merchant divided the silk ___ his two sons.|between|among|through
  The camel walked ___ the two tall dunes.|between|among|across
  The spices were shared ___ all the families of the village.|among|between|beside
  The secret of silk was kept ___ the people of China for centuries.|among|between|across
  There was a high wall ___ the two cities.|between|among|along
  The traveler felt at home ___ the friendly traders.|among|between|beside
  Choose ___ the blue cup and the white one.|between|among|through
  The news spread quickly ___ the many caravans.|among|between|along
  A narrow pass runs ___ the two mountains.|between|among|across
  The coins were hidden ___ the bales of wool.|among|between|beside
  The road ran ___ the river and the desert.|between|among|through
  She was the youngest ___ the twenty travelers.|among|between|beside
  The bridge stood ___ the east bank and the west bank.|between|among|along
  The prize was divided ___ the three winners.|among|between|through
  Trade ___ China and Persia lasted hundreds of years.|between|among|across
  Ideas moved freely ___ the scholars of many lands.|among|between|beside
  The guide stood ___ the merchant and the buyer.|between|among|along
  A small temple was built ___ the trees.|among|between|across
  The two friends split the bread ___ them.|between|among|through
  The story was popular ___ the children of the market.|among|between|along
  Rest ___ the morning ride and the afternoon ride.|between|among|beside
  We found one blue stone ___ the hundreds of gray ones.|among|between|across
  The horse stopped ___ the two wells.|between|among|through
  There was little water ___ the people of the oasis.|among|between|along
  The camel driver walked ___ the two lead camels.|between|among|across
  Rumors of war spread ___ the merchants in the market.|among|between|through
  The treaty ___ the two kings kept the road open.|between|among|along
  The old map was found ___ a pile of forgotten papers.|among|between|beside
  Lanterns hung ___ the two posts of the gate.|between|among|across
  The monk lived ___ the people of the valley for ten years.|among|between|through
  You must choose ___ the short road and the safe road.|between|among|beside
  The lost ring lay somewhere ___ the stones of the courtyard.|among|between|along
`;

const inLines = `
  The trader put the silk ___ a wooden chest.|into|in|in to
  The silk stayed safe ___ the chest for the whole trip.|in|into|in to
  The camels walked ___ the city through the great gate.|into|in|in to
  The merchants lived ___ the city for many years.|in|into|in to
  She poured the tea ___ the small cups.|into|in|in to
  The tea was still hot ___ the cups.|in|into|in to
  The boy ran ___ the market to find his father.|into|in|in to
  His father was waiting ___ the market by the spice stall.|in|into|in to
  The paper was folded and slipped ___ an envelope.|into|in|in to
  The coins jingled ___ the leather bag.|in|into|in to
  A sandstorm blew ___ the camp at night.|into|in|in to
  The travelers slept ___ tents made of felt.|in|into|in to
  The scholar dipped his brush ___ the ink.|into|in|in to
  The words were written ___ black ink.|in|into|in to
  The cat jumped ___ the basket of wool.|into|in|in to
  The wool was kept dry ___ the basket.|in|into|in to
  The caravan moved ___ the mountains before winter.|into|in|in to
  Snow lay deep ___ the mountains all winter.|in|into|in to
  We dove ___ the cool water of the oasis.|into|in|in to
  Fish swam ___ the cool water of the oasis.|in|into|in to
  The guard put the letter ___ his pocket.|into|in|in to
  The letter stayed ___ his pocket until he reached the king.|in|into|in to
  The baker slid the bread ___ the hot oven.|into|in|in to
  The bread baked ___ the oven for an hour.|in|into|in to
  Rain dripped ___ the open bucket.|into|in|in to
  Visitors may not take food ___ the temple.|into|in|in to
  Quiet is expected ___ the temple.|in|into|in to
  The ship sailed ___ the harbor at dawn.|into|in|in to
  The ship rested ___ the harbor for a week.|in|into|in to
  The children crowded ___ the small room to hear the story.|into|in|in to
`;

const betweenWhy = (right: string) =>
  right === "between"
    ? ["*between* is for two people or things, or two clear sides", "*between* 用于两个人或物，或两个明确的方面"]
    : ["*among* is for more than two, or for a group", "*among* 用于两个以上，或用于一个群体"];

/** betweenBank asks for between or among. */
const betweenBank: readonly Item[] = fields(betweenLines).map(([shown, right, other, third]) => {
  if (!shown || !right || !other || !third) throw new Error(`a between line needs four fields: ${shown}`);
  return {
    question: t("Which word completes the sentence?", "哪个词能补全句子？"),
    shown,
    right,
    wrong: [other, third],
    why: t(
      `${fill(shown, right)} Count the people or things: ${betweenWhy(right)[0]}.`,
      `${fill(shown, right)} 数一数人或物：${betweenWhy(right)[1]}。`,
    ),
    whyNot: [
      t(`*${other}* does not fit the number here: ${betweenWhy(right)[0]}.`, `*${other}* 和这里的数量不符：${betweenWhy(right)[1]}。`),
      t(
        `*${third}* tells a different position or path, not a place shared by two or by a group.`,
        `*${third}* 表示另一种位置或路线，而不是两者之间或一群之中。`,
      ),
    ],
  };
});

/** inBank asks for in or into. */
const inBank: readonly Item[] = fields(inLines).map(([shown, right, other, split]) => {
  if (!shown || !right || !other || !split) throw new Error(`an in line needs four fields: ${shown}`);
  const moving = right === "into";
  return {
    question: t("Which word completes the sentence?", "哪个词能补全句子？"),
    shown,
    right,
    wrong: [other, split],
    why: t(
      `${fill(shown, right)} ${moving ? "Something moves from outside to inside, so the word is *into*." : "Nothing moves inside here; the sentence tells where something is, so the word is *in*."}`,
      `${fill(shown, right)} ${moving ? "有东西从外面进到里面，所以用 *into*。" : "这里没有向里的移动；句子说的是某物在哪里，所以用 *in*。"}`,
    ),
    whyNot: [
      t(
        moving
          ? "*in* tells where something is, but here something moves toward the inside, which needs *into*."
          : "*into* shows movement toward the inside, but here nothing moves in; it is already there.",
        moving ? "*in* 表示某物在哪里，而这里有东西向里移动，要用 *into*。" : "*into* 表示向里移动，而这里没有移动，它本来就在里面。",
      ),
      t(
        "*in to* as two words is used only when *in* belongs to the verb, as in *hand your work in to the teacher*; it does not fit here.",
        "分开写的 *in to* 只在 *in* 属于动词时使用，例如 *hand your work in to the teacher*；这里不适用。",
      ),
    ],
  };
});

// Punctuation for effect.

const markKinds = {
  "strong feeling": {
    zh: "强烈的感情",
    is: ["An exclamation mark shows strong feeling: surprise, fear, joy or anger.", "感叹号表示强烈的感情：惊讶、害怕、高兴或生气。"],
  },
  "doubt or a question": {
    zh: "怀疑或疑问",
    is: ["A question mark shows that the speaker asks or is not sure.", "问号表示说话人在提问或不确定。"],
  },
  "an unfinished thought": {
    zh: "未说完的想法",
    is: ["An ellipsis (...) shows a voice trailing off or a thought left unfinished.", "省略号（...）表示声音渐弱或想法没说完。"],
  },
  "a sudden break": {
    zh: "突然的中断",
    is: [
      "A dash (—) shows a sudden break, an interruption or a surprise in the middle of a line.",
      "破折号（—）表示句中突然的中断、被打断或意外。",
    ],
  },
} as const;

const markOf = { "strong feeling": "!", "doubt or a question": "?", "an unfinished thought": "...", "a sudden break": "—" } as const;

const markLines = `
  ROSA: The curtain is on fire!|strong feeling
  MAX: We won the prize!|strong feeling
  QUEEN: Bring me my umbrella at once!|strong feeling
  BEN: Look out, the dragon is right behind you!|strong feeling
  GRANDPA: My robot can dance!|strong feeling
  LILY: Help me, the boat is sinking!|strong feeling
  KING: Never come back to my castle!|strong feeling
  TOM: That was the best show ever!|strong feeling
  ROSA: Did you hear that noise?|doubt or a question
  MAX: Is anyone there?|doubt or a question
  QUEEN: Who stole my crown?|doubt or a question
  BEN: Are you sure this is the right door?|doubt or a question
  GRANDPA: Where did I leave my glasses?|doubt or a question
  LILY: Can a dragon really have a toothache?|doubt or a question
  KING: What is that strange light in the sky?|doubt or a question
  TOM: Did I pack the tickets or not?|doubt or a question
  ROSA: I thought I saw a ghost, but maybe...|an unfinished thought
  MAX: If only I had practiced more...|an unfinished thought
  QUEEN: Rain again... always rain...|an unfinished thought
  BEN: I wanted to tell you, but...|an unfinished thought
  GRANDPA: When I was a boy, we used to...|an unfinished thought
  LILY: The lights are going dim... so dim...|an unfinished thought
  KING: Perhaps I was wrong about the jester...|an unfinished thought
  TOM: I wonder where the time went...|an unfinished thought
  ROSA: I opened the box and — it was empty.|a sudden break
  MAX: The winner is — wait, the card is blank.|a sudden break
  QUEEN: My crown — where is my crown?|a sudden break
  BEN: I will open the door — no, you open it.|a sudden break
  GRANDPA: The robot was cooking — and then it ate the soup.|a sudden break
  LILY: We were almost home — then the lights went out.|a sudden break
  KING: Bring the jester — no, bring the cook.|a sudden break
  TOM: I found my ticket — in the dog's mouth.|a sudden break
`;

const markRows = fields(markLines).map(([text, kind]) => {
  if (!text || !kind || !(kind in markOf)) throw new Error(`a mark line needs a text and a kind: ${text}`);
  return { text, kind: kind as keyof typeof markOf };
});

const markNames = Object.keys(markOf) as (keyof typeof markOf)[];

/** markChooseBank asks for the mark that gives a line a given effect. */
const markChooseBank: readonly Item[] = markRows.map((row, i) => {
  const right = markOf[row.kind];
  const index = row.text.lastIndexOf(right);
  const shown = `${row.text.slice(0, index)}___${row.text.slice(index + right.length)}`;
  const others = markNames.filter((n) => n !== row.kind);
  const wrongKinds = [others[i % 3], others[(i + 1) % 3]] as (keyof typeof markOf)[];
  const info = markKinds[row.kind];
  return {
    question: t(
      `Which mark gives the line ${row.kind === "doubt or a question" ? "a question or doubt" : row.kind === "strong feeling" ? "strong feeling" : row.kind}?`,
      `哪个标点能让这句台词表达${info.zh}？`,
    ),
    shown,
    right,
    wrong: wrongKinds.map((k) => markOf[k]),
    why: t(`${fill(shown, right)} ${info.is[0]}`, `${fill(shown, right)} ${info.is[1]}`),
    whyNot: wrongKinds.map((k) =>
      t(
        `*${markOf[k]}* gives ${k}, not ${row.kind}. ${markKinds[k].is[0]}`,
        `*${markOf[k]}* 表达${markKinds[k].zh}，而不是${info.zh}。${markKinds[k].is[1]}`,
      ),
    ),
  };
});

// Formal and informal English.

const formalLines = `
  I would like to ask a question about the trip.|I wanna ask something about the trip.|Hey, so I've got this question about the trip, OK?
  Thank you very much for your help.|Thanks a bunch for helping out!|Thx sooo much for the help, you're totally awesome.
  Could you please tell me when the library opens?|When's the library open, huh?|Yo, what time does the library open up, like, today?
  I am writing to ask for a new crosswalk on Oak Street.|We kinda need a new crosswalk on Oak Street.|Oak Street seriously needs a crosswalk, like, for real, OK?
  The results of our test were very surprising.|Our test results were totally crazy.|You won't believe our test, dude, it was totally nuts.
  We are sorry that we cannot come to the meeting.|Sorry, can't make it to the meeting.|Nope, we're not gonna make it to the meeting, sorry about that.
  The museum will be closed on Monday.|The museum's shut Monday, guys.|No museum on Monday, sorry folks, try another day!
  I do not agree with this decision.|I don't buy this decision at all.|This decision is so lame, I can't even deal with it.
  Please send me more information about the program.|Can you shoot me some info about the program?|Send more program stuff my way, please, that'd be great.
  Our class would be grateful for your support.|Our class would love it if you pitched in.|It'd be super cool if you helped us out with this, seriously.
  The speaker explained the problem clearly.|The speaker totally nailed the problem.|That speaker really got it, you know what I mean?
  May I borrow a pencil, please?|Can I grab a pencil?|Gimme a pencil real quick, will ya?
  I am going to present my report now.|I'm gonna do my report now.|OK, so here goes my report, I guess, whatever.
  The plants grew taller in the sunlight.|The plants got way taller in the sun.|The plants shot up like crazy in the sun.
  It was a pleasure to meet you.|Great to meet you!|Nice meeting ya, see ya around!
  The town council has made an important announcement.|The council's got big news.|Guess what the council said, it's huge, you'll freak out!
  I believe that recycling is important.|I think recycling is a big deal.|Recycling is, like, really really important, for sure.
  The students are asked to arrive at eight o'clock.|Kids, get here by eight.|Be here at eight, OK, and don't be late again, you guys!
  We look forward to hearing from you.|Hope to hear from you soon!|Write back soon, OK, can't wait to hear from ya!
  The experiment did not work as we expected.|The experiment kind of flopped.|Our experiment was a total fail, like, a big flop.
  I apologize for the mistake in my letter.|Oops, sorry about the mistake.|My bad about that mistake, I totally messed up.
  Many people attended the concert on Saturday.|Tons of people showed up Saturday.|The concert on Saturday was packed, no joke, dude.
  Would you be able to visit our school next week?|Can you swing by our school next week?|Come check out our school next week, it'll be awesome!
  This painting is admired by many visitors.|Loads of visitors are into this painting.|People are totally crazy about this painting, it's so cool.
  We need more time to finish the project.|We need a bit more time on the project, OK?|Gotta have more time for the project.
  The library has many books about space.|The library's got a ton of space books.|There's like a million space books at the library.
  The principal asked us to remain quiet.|The principal told us to keep it down.|The principal basically told us all to zip it, big time.
  I am not certain that the answer is correct.|I'm not so sure that's right.|Dunno if that answer's right, it looks kinda weird to me.
  Our team was very disappointed by the result.|Our team was bummed about the score.|The score totally stunk for our team, we were so bummed.
  Please let me know if you have any questions.|Holler if you've got questions.|Questions? Just ask me whenever, OK, no big deal at all.
`;

const formalRows = fields(formalLines).map(([formal, informal, slang]) => {
  if (!formal || !informal || !slang) throw new Error(`a formal line needs three fields: ${formal}`);
  return { formal, informal, slang };
});

/** formalFindBank asks for the formal sentence of three. */
const formalFindBank: readonly Item[] = formalRows.map((row) => ({
  question: t("Which sentence is formal?", "哪个句子是正式的？"),
  shown: "",
  right: row.formal,
  wrong: [row.informal, row.slang],
  why: t(
    `“${row.formal}” is formal: it uses full words and complete sentences, with no slang, and its request or statement is polite.`,
    `“${row.formal}” 是正式的：它用完整的词和完整的句子，没有俚语，请求或陈述也很礼貌。`,
  ),
  whyNot: [
    t(
      `“${row.informal}” is informal: it uses short forms or casual words that are fine with friends but not in a report or a letter to a stranger.`,
      `“${row.informal}” 是非正式的：它用缩写或随意的词，和朋友说话可以，但不适合报告或写给陌生人的信。`,
    ),
    t(
      `“${row.slang}” is very informal: it uses slang or chat words, which belong in talk with friends.`,
      `“${row.slang}” 非常不正式：它用了俚语或聊天用语，只适合和朋友交谈。`,
    ),
  ],
}));

/** situations pair a reader or listener with whether they need formal English. */
const situations = [
  ["a letter to the mayor", "写给市长的信", true],
  ["a text message to your best friend", "发给好朋友的短信", false],
  ["a speech to the whole school", "面向全校的演讲", true],
  ["a note to your little brother", "写给弟弟的便条", false],
  ["a report for the science fair", "科学展览会的报告", true],
  ["a chat with a friend at lunch", "午饭时和朋友聊天", false],
  ["an email to a museum you have never visited", "写给一家你从没去过的博物馆的电子邮件", true],
] as const;

/** formalFitBank asks for the version that fits a situation. */
const formalFitBank: readonly Item[] = formalRows.map((row, i) => {
  const [en, zh, formal] = situations[i % situations.length] as (typeof situations)[number];
  const right = formal ? row.formal : row.informal;
  const wrong = formal ? [row.informal, row.slang] : [row.formal, row.slang];
  return {
    question: t(`Which version fits ${en}?`, `哪个版本适合${zh}？`),
    shown: "",
    right,
    wrong,
    why: formal
      ? t(
          `“${right}” fits, because ${en} needs formal English: full forms, no slang and polite words for a reader you do not know well.`,
          `“${right}” 合适，因为${zh}需要正式英语：用完整形式，不用俚语，对不太熟悉的读者用礼貌的词。`,
        )
      : t(
          `“${right}” fits, because ${en} is between people who know each other well, where friendly, everyday English is right. It is still clear and kind.`,
          `“${right}” 合适，因为${zh}是熟人之间的交流，适合用友好的日常英语。它依然清楚而友善。`,
        ),
    whyNot: wrong.map((w) =>
      w === row.formal
        ? t(
            `“${w}” is formal. It is correct, but it sounds stiff for ${en}; with friends and family, everyday English is more natural.`,
            `“${w}” 是正式的。它没有错，但用于${zh}显得生硬；和朋友家人说话，日常英语更自然。`,
          )
        : w === row.slang
          ? t(
              `“${w}” uses slang that is too casual${formal ? ` for ${en}` : " even here, and its meaning is less clear"}.`,
              `“${w}” 用了过于随意的俚语${formal ? `，不适合${zh}` : "，即使在这里也不够清楚"}。`,
            )
          : t(
              `“${w}” is informal, with short forms and casual words, so it does not suit ${en}.`,
              `“${w}” 是非正式的，用了缩写和随意的词，所以不适合${zh}。`,
            ),
    ),
  };
});

// Quotation marks for quotations.

const quoteLines = `
  The ranger wrote|Every tree in this forest is older than the town.|The ranger wrote that every tree in the forest was older than the town.
  My grandmother said|I learned to read by candlelight.|My grandmother said that she had learned to read by candlelight.
  The inventor told the reporter|My first machine caught fire.|The inventor told the reporter that her first machine had caught fire.
  Coach Diaz said|Practice is where games are won.|Coach Diaz said that games are won at practice.
  The museum guide explained|This statue is three thousand years old.|The museum guide explained that the statue was three thousand years old.
  The book says|Braille dots are read with the fingertips.|The book says that people read Braille dots with their fingertips.
  The scientist wrote in her notebook|The plants grew faster in blue light.|The scientist wrote in her notebook that the plants grew faster in blue light.
  Our principal announced|The library will stay open until six.|Our principal announced that the library would stay open until six.
  The pilot told us|We will land in twenty minutes.|The pilot told us that we would land in twenty minutes.
  The farmer said|Rain came just in time for the corn.|The farmer said that the rain had come just in time for the corn.
  The doctor wrote|Rest and water will help you recover.|The doctor wrote that rest and water would help me recover.
  My uncle often says|Hard work beats talent when talent does not work.|My uncle often says that hard work beats talent that does not work.
  The explorer wrote in his diary|The ice cracked under our feet.|The explorer wrote in his diary that the ice had cracked under their feet.
  The teacher reminded us|Check your spelling before you hand it in.|The teacher reminded us to check our spelling before handing it in.
  The article states|Bees visit about a hundred flowers on each trip.|The article states that bees visit about a hundred flowers on each trip.
  The nurse told me|Your arm will heal in a few weeks.|The nurse told me that my arm would heal in a few weeks.
  The mayor promised|We will build a new park by summer.|The mayor promised that the town would build a new park by summer.
  The astronaut said|Earth looks like a blue marble from space.|The astronaut said that Earth looks like a blue marble from space.
  The poster says|Turn off the lights when you leave.|The poster says to turn off the lights when you leave.
  The baker told us|I start making bread at four in the morning.|The baker told us that he starts making bread at four in the morning.
  The chess champion said|I lost a hundred games before I won one.|The chess champion said that she had lost a hundred games before she won one.
  The guidebook warns|The trail is closed after dark.|The guidebook warns that the trail is closed after dark.
  The coach shouted|Keep your eyes on the ball.|The coach shouted that we should keep our eyes on the ball.
  The painter told the class|Mix your colors slowly.|The painter told the class to mix their colors slowly.
  The zookeeper explained|Elephants can smell water from far away.|The zookeeper explained that elephants can smell water from far away.
  My sister wrote in her letter|I miss the sound of the sea.|My sister wrote in her letter that she missed the sound of the sea.
  The judge announced|The blue team has won the contest.|The judge announced that the blue team had won the contest.
  The writer told us|I keep a notebook in every pocket.|The writer told us that she keeps a notebook in every pocket.
  The firefighter said|Never hide when there is a fire.|The firefighter said that we should never hide during a fire.
  The plaque reads|This bridge was built by the people of the valley.|The plaque reads that the people of the valley built this bridge.
  The volunteer said|We planted two hundred trees today.|The volunteer said that they had planted two hundred trees that day.
  The swimmer told the reporter|I trained every morning for six years.|The swimmer told the reporter that she had trained every morning for six years.
`;

const quoteRows = fields(quoteLines).map(([signal, words, paraphrase]) => {
  if (!signal || !words || !paraphrase) throw new Error(`a quotation line needs three fields: ${signal}`);
  const bare = words.replace(/\.$/, "");
  const lower = words.charAt(0).toLowerCase() + words.slice(1);
  return {
    signal,
    words,
    paraphrase,
    right: `${signal}, "${words}"`,
    noComma: `${signal} "${words}"`,
    outside: `${signal}, "${bare}".`,
    lowered: `${signal}, "${lower}"`,
  };
});

const quoteFaults = [
  [
    "noComma",
    "A comma must come after the signal phrase, before the opening quotation mark.",
    "在引语开头的引号前，说明部分后面要有逗号。",
  ],
  [
    "outside",
    "The period of a quotation goes inside the closing quotation mark, not after it.",
    "引语的句号要放在后引号里面，而不是外面。",
  ],
  [
    "lowered",
    "A quotation that is a full sentence begins with a capital letter, as it did when it was first said or written.",
    "完整句子的引语以大写字母开头，就像它最初被说出或写下时一样。",
  ],
] as const;

/** quoteMarkBank asks for the sentence that marks a quotation correctly. */
const quoteMarkBank: readonly Item[] = quoteRows.map((row, i) => {
  const faults = [quoteFaults[(i + 1) % 3], quoteFaults[(i + 2) % 3]] as (typeof quoteFaults)[number][];
  return {
    question: t("Which sentence marks the quotation correctly?", "哪个句子的引语标点正确？"),
    shown: "",
    right: row.right,
    wrong: faults.map(([key]) => row[key]),
    why: t(
      `${row.right} The exact words go inside quotation marks, a comma follows the signal phrase *${row.signal}*, the quotation starts with a capital, and its period stays inside the marks.`,
      `${row.right} 原话放在引号里，说明部分 *${row.signal}* 后面加逗号，引语以大写字母开头，句号留在引号里面。`,
    ),
    whyNot: faults.map(([, en, zh]) => t(en, zh)),
  };
});

const quoteKinds = {
  "a quotation, marked correctly": {
    zh: "引语，标点正确",
    is: ["It gives the exact words, so they go in quotation marks after a comma.", "它给出原话，所以原话放在逗号后的引号里。"],
  },
  "a paraphrase, correctly without marks": {
    zh: "转述，正确地不用引号",
    is: [
      "It tells what someone said in other words, often after *that*, so it needs no quotation marks.",
      "它用别的话转述某人说的内容，常在 *that* 后面，所以不需要引号。",
    ],
  },
  "a paraphrase that should have no marks": {
    zh: "本不该加引号的转述",
    is: [
      "It is a paraphrase in the writer's own words, but it has quotation marks it should not have.",
      "它是用作者自己的话转述的，却加了本不该有的引号。",
    ],
  },
} as const;

/** quoteKindLines puts every source sentence into one of three kinds, turning by line. */
const quoteKindLines = quoteRows
  .map((row, i) => {
    const kind = Object.keys(quoteKinds)[i % 3] as keyof typeof quoteKinds;
    const split = row.paraphrase.match(/^(.*? (?:that|to)) (.*)$/);
    const marked = split ? `${split[1]} "${split[2]}"` : `"${row.paraphrase}"`;
    const text =
      kind === "a quotation, marked correctly" ? row.right : kind === "a paraphrase, correctly without marks" ? row.paraphrase : marked;
    return `${text}|${kind}`;
  })
  .join("\n");

// Abbreviations.

const abbreviationKinds = {
  title: ["A title before a name starts with a capital and ends with a period.", "名字前的称谓以大写字母开头，以句号结尾。"],
  day: ["A day of the week shortens to its first letters, with a capital and a period.", "星期几缩写成开头几个字母，首字母大写并加句号。"],
  month: ["A month shortens to its first letters, with a capital and a period.", "月份缩写成开头几个字母，首字母大写并加句号。"],
  place: [
    "A word in an address shortens to a few of its letters, with a capital and a period.",
    "地址中的词缩写成其中几个字母，首字母大写并加句号。",
  ],
  measure: ["A unit of measure is written in small letters, often with a period.", "计量单位用小写字母，常加句号。"],
  group: [
    "The name of a country or a group can be its first letters, all capitals, with no periods.",
    "国家或组织的名称可以用首字母缩写，全部大写，不加句号。",
  ],
} as const;

const abbreviationLines = `
  Doctor|Dr.|Doc.|dr|Mister|Drive|title
  Mister|Mr.|Mtr.|mr|Doctor|Monday|title
  Captain|Capt.|Cap|capt.|Company|Center|title
  Professor|Prof.|Pr.|prof|President|Project|title
  Governor|Gov.|Gv.|gov|Government|General|title
  Junior|Jr.|Jun.|jr|January|June|title
  Monday|Mon.|Mo|mon.|Month|Mountain|day
  Tuesday|Tues.|Tu|tues|Thursday|Twelve|day
  Wednesday|Wed.|Wd.|wed|Wedding|West|day
  Thursday|Thurs.|Th|thurs|Tuesday|Three|day
  Friday|Fri.|Fr|fri.|Friend|French|day
  Saturday|Sat.|St.|sat|Street|Saint|day
  Sunday|Sun.|Sn.|sun|Sunset|South|day
  January|Jan.|Ja.|jan|June|July|month
  February|Feb.|Fe.|feb|Federal|Fever|month
  August|Aug.|Ag.|aug|April|Autumn|month
  September|Sept.|Sp.|sept|Seven|Second|month
  October|Oct.|Ot.|oct|Octopus|Ocean|month
  November|Nov.|Nv.|nov|Novel|Number|month
  December|Dec.|Dc.|dec|Decimal|Decade|month
  Street|St.|Str|st|Saturday|Stone|place
  Avenue|Ave.|Av|ave|Aviation|Average|place
  Road|Rd.|Ro.|rd|Red|River|place
  Mount|Mt.|Mnt|mt|Meter|Mister|place
  Boulevard|Blvd.|Bd.|blvd|Building|Board|place
  Apartment|Apt.|Ap|apt|April|Apart|place
  inch|in.|In.|ic.|inside|India|measure
  foot|ft.|Ft.|fo.|fort|fruit|measure
  yard|yd.|Yd.|yr.|year|yarn|measure
  minute|min.|Min.|mn.|minus|minister|measure
  hour|hr.|Hr.|hu.|here|hire|measure
  United States of America|USA|U.s.a|Usa|United Sports Association|Union of South America|group
  National Aeronautics and Space Administration|NASA|N.a.s.a.|Nasa|National Air and Sea Agency|North American Science Academy|group
  United Nations|UN|U.n.|Un.|United Nurses|Union of Nations|group
`;

const abbreviationRows = fields(abbreviationLines).map(([word, abbreviation, a1, a2, w1, w2, kind]) => {
  if (!word || !abbreviation || !a1 || !a2 || !w1 || !w2 || !kind || !(kind in abbreviationKinds))
    throw new Error(`an abbreviation line needs seven fields: ${word}`);
  return {
    word,
    abbreviation,
    wrong: [a1, a2] as const,
    words: [w1, w2] as const,
    rule: abbreviationKinds[kind as keyof typeof abbreviationKinds],
  };
});

/** abbreviationBank asks for the abbreviation of a word. */
const abbreviationBank: readonly Item[] = abbreviationRows.map((row) => ({
  question: t(`Which is the correct abbreviation of *${row.word}*?`, `*${row.word}* 的正确缩写是哪个？`),
  shown: "",
  right: row.abbreviation,
  wrong: row.wrong,
  why: t(
    `*${row.word}* is written **${row.abbreviation}**. ${row.rule[0]}`,
    `*${row.word}* 缩写为 **${row.abbreviation}**。${row.rule[1]}`,
  ),
  whyNot: row.wrong.map((w) =>
    t(
      `“${w}” is not the standard short form. ${row.rule[0]} The form to learn is *${row.abbreviation}*.`,
      `“${w}” 不是标准缩写。${row.rule[1]} 要记住的形式是 *${row.abbreviation}*。`,
    ),
  ),
}));

/** expansionBank asks for the word an abbreviation stands for. */
const expansionBank: readonly Item[] = abbreviationRows.map((row) => ({
  question: t(`What does *${row.abbreviation}* stand for?`, `*${row.abbreviation}* 代表什么？`),
  shown: "",
  right: row.word,
  wrong: row.words,
  why: t(`*${row.abbreviation}* stands for **${row.word}**. ${row.rule[0]}`, `*${row.abbreviation}* 代表 **${row.word}**。${row.rule[1]}`),
  whyNot: row.words.map((w) =>
    t(
      `*${w}* is not shortened to *${row.abbreviation}*. Each abbreviation keeps letters of its own word, and these letters come from *${row.word}*.`,
      `*${w}* 的缩写不是 *${row.abbreviation}*。每个缩写都保留它自己那个词的字母，这些字母来自 *${row.word}*。`,
    ),
  ),
}));

/** usageTopics4 are the topics of usage and mechanics of grade 4. */
export const usageTopics4: readonly TopicDef[] = [
  {
    id: "reflexive-pronouns",
    title: t("Reflexive Pronouns", "反身代词"),
    summary: t(
      "A reflexive pronoun such as myself, himself or themselves refers back to the subject: the body heals itself.",
      "myself、himself、themselves 这样的反身代词回指主语：the body heals itself。",
    ),
    prerequisites: ["pronoun-antecedent-agreement"],
    encompasses: [{ topic: "pronoun-antecedent-agreement", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-reflexive-pronouns",
        t("Choosing the Reflexive Pronoun", "选择反身代词"),
        t(
          "A **reflexive pronoun** ends in *-self* or *-selves* and refers back to the subject of the sentence: *The body heals itself.* *We made ourselves a lunch.*\n\nMatch it to the subject: *I*, *myself*; *you*, *yourself* or *yourselves*; *he*, *himself*; *she*, *herself*; *it*, *itself*; *we*, *ourselves*; *they*, *themselves*. A noun such as *my brother* takes the pronoun that would replace it: *himself*.",
          "**反身代词**以 *-self* 或 *-selves* 结尾，回指句子的主语：*The body heals itself.* *We made ourselves a lunch.*\n\n要与主语一致：*I* 对 *myself*；*you* 对 *yourself* 或 *yourselves*；*he* 对 *himself*；*she* 对 *herself*；*it* 对 *itself*；*we* 对 *ourselves*；*they* 对 *themselves*。*my brother* 这样的名词用能替代它的代词所对应的形式：*himself*。",
        ),
        itemGenerator(reflexiveGapBank),
      ),
      point(
        "telling-correct-reflexive-forms",
        t("Correct and Incorrect Forms", "正确与错误的形式"),
        t(
          "Some forms that people say are not standard English: *hisself*, *theirselves*, *ourself* and *itsself*. The standard forms are *himself*, *themselves*, *ourselves* and *itself*.\n\nAnd when the action goes back to the subject, an object pronoun is wrong: *Grandma reminded her* would mean another woman; *Grandma reminded herself* means Grandma.",
          "有些人们常说的形式不是标准英语：*hisself*、*theirselves*、*ourself* 和 *itsself*。标准形式是 *himself*、*themselves*、*ourselves* 和 *itself*。\n\n当动作回到主语身上时，用宾格代词是错的：*Grandma reminded her* 指的是另一个女人；*Grandma reminded herself* 指的才是奶奶自己。",
        ),
        itemGenerator(reflexiveSentenceBank),
      ),
    ],
  },
  {
    id: "double-negatives",
    title: t("Avoiding Double Negatives", "避免双重否定"),
    summary: t(
      "Standard written English uses one negative word in a clause: I don't have any, not I don't have none.",
      "标准书面英语在一个分句中只用一个否定词：说 I don't have any，而不是 I don't have none。",
    ),
    prerequisites: after("contractions"),
    encompasses: [],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "finding-double-negatives",
        t("Finding the Two Negatives", "找出两个否定词"),
        t(
          "A **negative word** says *no*: *not* and its short form *n't* (*don't, can't, wasn't*), *no*, *never*, *nothing*, *nobody*, *no one*, *nowhere*, *none*, and also *hardly*.\n\nA **double negative** puts two of them in one clause: *The fox can't find nothing.* Many people speak this way, and tall tales often do, but standard written English uses only one.",
          "**否定词**表示“不”：*not* 及其缩写 *n't*（*don't、can't、wasn't*）、*no*、*never*、*nothing*、*nobody*、*no one*、*nowhere*、*none*，还有 *hardly*。\n\n**双重否定**是在一个分句中用两个否定词：*The fox can't find nothing.* 很多人这样说，荒诞故事里也常这样说，但标准书面英语只用一个。",
        ),
        itemGenerator(negativeFindBank),
      ),
      point(
        "fixing-double-negatives",
        t("Writing It in Standard English", "改成标准英语"),
        t(
          "To fix a double negative, keep one negative and change the other:\n\n- *nothing* → *anything*; *nobody* → *anybody*; *no one* → *anyone*; *nowhere* → *anywhere*; *never* → *ever*; *no* or *none* → *any*.\n- Or drop the *n't*: *I haven't never seen* → *I have never seen*.\n\nWith *hardly*, drop the *n't*: *I can hardly lift it.*",
          "改正双重否定时，保留一个否定词，改掉另一个：\n\n- *nothing* → *anything*；*nobody* → *anybody*；*no one* → *anyone*；*nowhere* → *anywhere*；*never* → *ever*；*no* 或 *none* → *any*。\n- 或者去掉 *n't*：*I haven't never seen* → *I have never seen*。\n\n和 *hardly* 一起用时去掉 *n't*：*I can hardly lift it.*",
        ),
        itemGenerator(negativeFixBank),
      ),
    ],
  },
  {
    id: "between-among-in-and-into",
    title: t("Between, Among, In and Into", "Between、Among、In 和 Into"),
    summary: t(
      "Between is for two, among for more than two; in tells where something is, into tells movement toward the inside.",
      "between 用于两者，among 用于两者以上；in 表示在哪里，into 表示向里移动。",
    ),
    prerequisites: ["prepositional-phrases"],
    encompasses: [{ topic: "prepositional-phrases", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-between-or-among",
        t("Choosing Between or Among", "选择 Between 还是 Among"),
        t(
          "Count before you choose. *Between* is for **two** people or things, or two clear sides: *a wall between the two cities*, *trade between China and Persia*. *Among* is for **more than two**, or for a group that is not counted one by one: *shared among all the families*, *at home among the traders*.",
          "选择之前先数一数。*between* 用于**两个**人或物，或两个明确的方面：*a wall between the two cities*、*trade between China and Persia*。*among* 用于**两个以上**，或用于不逐个计算的群体：*shared among all the families*、*at home among the traders*。",
        ),
        itemGenerator(betweenBank),
      ),
      point(
        "choosing-in-or-into",
        t("Choosing In or Into", "选择 In 还是 Into"),
        t(
          "*In* tells **where** something is: *The silk stayed safe in the chest.* *Into* tells **movement** from outside to inside: *The trader put the silk into a chest.*\n\nAsk whether something is moving inside. If it is, use *into*. Write *in to* as two words only when *in* belongs to the verb: *hand your work in to the teacher*.",
          "*in* 表示某物在**哪里**：*The silk stayed safe in the chest.* *into* 表示从外向里的**移动**：*The trader put the silk into a chest.*\n\n问问有没有东西在向里移动。如果有，就用 *into*。只有当 *in* 属于动词时才分开写成 *in to*：*hand your work in to the teacher*。",
        ),
        itemGenerator(inBank),
      ),
    ],
  },
  {
    id: "choosing-punctuation-for-effect",
    title: t("Choosing Punctuation for Effect", "根据效果选择标点"),
    summary: t(
      "A writer chooses an exclamation mark for strong feeling, a question mark for doubt, and a dash or an ellipsis for a pause.",
      "作者用感叹号表达强烈感情，用问号表达怀疑，用破折号或省略号表示停顿。",
    ),
    prerequisites: after("four-kinds-of-sentences"),
    encompasses: [],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-the-mark-for-an-effect",
        t("Choosing the Mark", "选择标点"),
        t(
          "In a play or a story, punctuation tells the reader how a line sounds.\n\n- An **exclamation mark** (!) gives strong feeling: *The curtain is on fire!*\n- A **question mark** (?) gives a question or doubt: *Is anyone there?*\n- An **ellipsis** (...) lets a voice trail off: *If only I had practiced more...*\n- A **dash** (—) makes a sudden break: *The winner is — wait, the card is blank.*",
          "在剧本或故事里，标点告诉读者一句话听起来是什么样的。\n\n- **感叹号**（!）表达强烈的感情：*The curtain is on fire!*\n- **问号**（?）表达疑问或怀疑：*Is anyone there?*\n- **省略号**（...）让声音渐渐弱下去：*If only I had practiced more...*\n- **破折号**（—）表示突然的中断：*The winner is — wait, the card is blank.*",
        ),
        itemGenerator(markChooseBank),
      ),
      point(
        "naming-the-effect-of-a-mark",
        t("Naming the Effect", "说出标点的效果"),
        t(
          "Now read a line and say what its mark does. Look at where the mark is: an exclamation or question mark usually ends a line, an ellipsis can end it or stop it in the middle, and a dash breaks into the middle, often to change direction or add a surprise.",
          "现在读一句台词，说出标点的作用。看看标点在哪里：感叹号或问号通常在句末，省略号可以在句末，也可以在句中停下，破折号则在句中打断，常常用来转折或制造意外。",
        ),
        nameKind({
          lines: markLines,
          kinds: markKinds,
          name: ["What does the punctuation give this line?", "这句台词的标点表达了什么？"],
          find: (en, zh) => [`Which line shows ${en}?`, `哪句台词表达了${zh}？`],
        }),
      ),
    ],
  },
  {
    id: "formal-and-informal-english",
    title: t("Formal and Informal English", "正式英语和非正式英语"),
    summary: t(
      "People speak informally with friends and formally in a report, a speech or a letter to a stranger.",
      "人们和朋友说话时用非正式英语，在报告、演讲或写给陌生人的信中用正式英语。",
    ),
    prerequisites: after("contractions"),
    encompasses: [],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "telling-formal-from-informal",
        t("Telling Formal from Informal", "区分正式与非正式"),
        t(
          "**Formal** English uses full forms (*I would like*, *do not*), complete sentences, no slang, and polite words such as *please* and *thank you*. **Informal** English uses short forms (*wanna*, *gonna*, *can't*), casual words (*kinda*, *stuff*, *awesome*) and sometimes half sentences.\n\nNeither is bad: each fits its own listener.",
          "**正式**英语用完整形式（*I would like*、*do not*）、完整的句子，不用俚语，用 *please*、*thank you* 这样的礼貌用语。**非正式**英语用缩写形式（*wanna*、*gonna*、*can't*）、随意的词（*kinda*、*stuff*、*awesome*），有时用半句话。\n\n两者都不是坏的：各有适合的听众。",
        ),
        itemGenerator(formalFindBank),
      ),
      point(
        "choosing-the-right-register",
        t("Choosing for the Situation", "根据场合选择"),
        t(
          "Before you write or speak, think about who will read or hear you. A letter to the mayor, a speech, a report or an email to a stranger needs formal English. A note to your brother or a chat with a friend can be informal, though very rude or unclear slang never helps.",
          "写或说之前，想一想谁会读到或听到。写给市长的信、演讲、报告或写给陌生人的电子邮件需要正式英语。给弟弟的便条或和朋友聊天可以不正式，但非常粗鲁或含糊的俚语从来都没有帮助。",
        ),
        itemGenerator(formalFitBank),
      ),
    ],
  },
  {
    id: "quotation-marks-for-quotations",
    title: t("Quotation Marks for Quotations", "引用时的引号"),
    summary: t(
      "Words copied exactly from a person or a text go in quotation marks, with a comma after the signal phrase.",
      "原样引用某人或某篇文章的话时要加引号，说明部分后面加逗号。",
    ),
    prerequisites: ["punctuating-dialogue"],
    encompasses: [{ topic: "punctuating-dialogue", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "marking-a-quotation",
        t("Marking a Quotation", "标出引语"),
        t(
          'When a report uses someone\'s **exact words**, they go in quotation marks. The signal phrase that names the speaker or the source comes first and ends with a comma: *The ranger wrote, "Every tree in this forest is older than the town."*\n\nThe quotation starts with a capital letter, and its period goes inside the closing quotation mark.',
          '报告引用某人的**原话**时，原话要放在引号里。说明说话人或出处的部分放在前面，以逗号结尾：*The ranger wrote, "Every tree in this forest is older than the town."*\n\n引语以大写字母开头，句号放在后引号里面。',
        ),
        itemGenerator(quoteMarkBank),
      ),
      point(
        "quotation-or-paraphrase",
        t("Quotation or Paraphrase", "引语还是转述"),
        t(
          "A **paraphrase** tells what someone said in other words, often after *that* or *to*: *The ranger wrote that every tree in the forest was older than the town.* A paraphrase is not the exact words, so it takes **no** quotation marks.\n\nAsk: are these the very words that were said or written? Only then use quotation marks.",
          "**转述**用别的话说出某人说过的内容，常放在 *that* 或 *to* 后面：*The ranger wrote that every tree in the forest was older than the town.* 转述不是原话，所以**不用**引号。\n\n问一问：这是当时说的或写的原话吗？只有是原话才加引号。",
        ),
        nameKind({
          lines: quoteKindLines,
          kinds: quoteKinds,
          name: ["What is this sentence?", "这个句子属于哪一种？"],
          find: (en, zh) => [`Which sentence is ${en}?`, `哪个句子是${zh}？`],
        }),
      ),
    ],
  },
  {
    id: "abbreviations",
    title: t("Abbreviations", "缩写"),
    summary: t(
      "Titles, days, months and places have short forms with a capital and a period, and some names are written in capitals.",
      "称谓、星期、月份和地名有缩写形式，首字母大写并加句号；有些名称用大写字母缩写。",
    ),
    prerequisites: ["capitalizing-names-and-titles"],
    encompasses: [{ topic: "capitalizing-names-and-titles", weight: 0.2 }],
    xp: 14,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-abbreviations",
        t("Choosing the Abbreviation", "选择缩写"),
        t(
          "An **abbreviation** is a short form of a word.\n\n- Titles: *Dr.*, *Mr.*, *Capt.*, *Prof.*, *Jr.*\n- Days and months: *Mon.*, *Wed.*, *Jan.*, *Feb.*, *Sept.*\n- Addresses: *St.*, *Ave.*, *Rd.*, *Mt.*\n- Measures, in small letters: *in.*, *ft.*, *yd.*, *min.*\n- Names made of first letters, in capitals with no periods: *USA*, *NASA*, *UN*.\n\nUse abbreviations in addresses, lists and charts; in a sentence of a report, write the full word.",
          "**缩写**是一个词的简短形式。\n\n- 称谓：*Dr.*、*Mr.*、*Capt.*、*Prof.*、*Jr.*\n- 星期和月份：*Mon.*、*Wed.*、*Jan.*、*Feb.*、*Sept.*\n- 地址：*St.*、*Ave.*、*Rd.*、*Mt.*\n- 计量单位，用小写：*in.*、*ft.*、*yd.*、*min.*\n- 由首字母组成的名称，全部大写，不加句号：*USA*、*NASA*、*UN*。\n\n缩写用在地址、清单和表格里；在报告的句子中，要写出完整的词。",
        ),
        itemGenerator(abbreviationBank),
      ),
      point(
        "reading-abbreviations",
        t("Reading Abbreviations", "读懂缩写"),
        t(
          "To read an abbreviation, find the word whose letters it keeps, in the same order: *Feb.* keeps the *F, e, b* of *February*. Some short forms look alike, so think about where you see it: *St.* on an address is *Street*, and *Sat.* on a calendar is *Saturday*.",
          "读缩写时，找出它按顺序保留了哪个词的字母：*Feb.* 保留了 *February* 的 *F、e、b*。有些缩写长得很像，所以要想想它出现在哪里：地址上的 *St.* 是 *Street*，日历上的 *Sat.* 是 *Saturday*。",
        ),
        itemGenerator(expansionBank),
      ),
    ],
  },
];
