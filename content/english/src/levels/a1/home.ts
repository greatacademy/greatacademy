// A1, unit 6: Home. Rooms, things at home and housework, there is and there are, prepositions of place, and
// sentences about a room.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, sentenceCase, vocabularyTopic, word } from "../words.ts";

const home = vocabularyTopic({
  id: "a1-words-home",
  title: t("Rooms", "房间"),
  summary: t(
    "House, apartment, rooms, doors, windows, walls, floors, stairs and the garden.",
    "房子、公寓、房间、门、窗、墙、地板、楼梯和花园。",
  ),
  prerequisites: ["a1-words-my-day"],
  words: [
    word(
      "house houses",
      "a building where a family lives",
      "房子",
      "We live in a big {house} with a garden.|roof floor | Our {house} has two floors.|room wall | There are six {houses} on our street.|rooms roofs",
      "room roof",
    ),
    word(
      "room rooms",
      "a part of a house with walls, a floor and a door",
      "房间",
      "Our apartment has four {rooms}.|walls roofs | This {room} is my bedroom.|wall roof | Clean your {room}, please!|wall roof",
      "wall roof",
    ),
    word(
      "bedroom bedrooms",
      "a room for sleeping in",
      "卧室",
      "My bed is in my {bedroom}.|bathroom kitchen | I share a {bedroom} with my brother.|bathroom garden | The house has three {bedrooms}, one for each of us.|bathrooms gardens",
      "bathroom garden",
    ),
    word(
      "bathroom bathrooms",
      "a room where you wash and use the toilet",
      "浴室；卫生间",
      "I brush my teeth in the {bathroom}.|bedroom garden | Where is the {bathroom}, please? — The first door on the left.|bedroom roof | The towels are in the {bathroom}.|garden roof",
      "bedroom garden",
    ),
    word(
      "door doors",
      "a thing you open to go into or out of a room or a building",
      "门",
      "Please close the {door}. It's cold.|wall floor | Someone is at the {door}!|wall roof | Knock on the {door} before you go in.|wall floor",
      "window wall",
    ),
    word(
      "window windows",
      "an opening in a wall, with glass, that lets in light",
      "窗户",
      "Open the {window}. It's hot in here.|floor wall | I can see the park from my {window}.|floor stairs | The sun comes in through the {windows}.|floors walls",
      "door wall",
    ),
    word(
      "wall walls",
      "one of the sides of a room or a building",
      "墙",
      "There is a clock on the {wall}.|floor door | My bedroom {walls} are blue.|floors doors | Don't write on the {wall}!|floor door",
      "floor roof",
    ),
    word(
      "floor floors",
      "the part of a room you walk on; a level of a building",
      "地板；楼层",
      "My shoes are on the {floor}.|wall roof | We live on the third {floor}.|wall roof | The cat is sleeping on the {floor}.|wall window",
      "wall roof",
    ),
    word(
      "garden gardens",
      "a place next to a house with grass, flowers or vegetables",
      "花园",
      "We play in the {garden} after school.|bathroom stairs | Grandpa grows vegetables in his {garden}.|bathroom roof | There are flowers in the {garden}.|bathroom stairs",
      "bathroom roof",
    ),
    word(
      "apartment apartments",
      "a home of several rooms on one floor of a big building",
      "公寓",
      "We live in an {apartment} on the tenth floor.|garden roof | Our {apartment} has two bedrooms.|garden roof | There are a hundred {apartments} in this building.|gardens roofs",
      "garden roof",
    ),
    word(
      "stairs",
      "steps that go from one floor to another",
      "楼梯",
      "Go up the {stairs} to my bedroom.|walls doors | Be careful on the {stairs}! Don't run.|walls windows | The cat is sleeping at the top of the {stairs}.|walls windows",
      "walls doors",
    ),
    word(
      "roof roofs",
      "the top of a house or a building",
      "屋顶",
      "The cat is on the {roof}!|floor stairs | Our house has a red {roof}.|floor door | Rain falls on the {roof}.|floor stairs",
      "floor wall",
    ),
  ],
});

const thingsAtHome = vocabularyTopic({
  id: "a1-words-things-at-home",
  title: t("Things at Home", "家里的东西"),
  summary: t(
    "Sofa, lamp, pictures, TV, computer, toys and cupboard, and where they are.",
    "沙发、台灯、图画、电视、电脑、玩具和柜子，以及它们在哪里。",
  ),
  prerequisites: ["a1-words-home"],
  words: [
    word(
      "sofa sofas",
      "a long soft seat for two or three people",
      "沙发",
      "We sit on the {sofa} and watch TV.|lamp cupboard | The cat is sleeping on the {sofa}.|lamp computer | Our {sofa} is big and soft.|lamp toy",
      "lamp cupboard",
    ),
    word(
      "lamp lamps",
      "a thing that gives light, on a table or the floor",
      "灯；台灯",
      "Turn on the {lamp}. It's dark.|sofa cupboard | There is a {lamp} on my desk.|sofa cupboard | The {lamp} next to my bed is blue.|sofa cupboard",
      "sofa toy",
    ),
    word(
      "picture pictures",
      "a drawing, a painting or a photo",
      "图画；照片",
      "There is a {picture} of my family on the wall.|lamp sofa | Draw a {picture} of your house.|lamp sofa | I like the {pictures} in this book.|lamps sofas",
      "lamp toy",
    ),
    word(
      "TV TVs",
      "a box with a screen that shows programs",
      "电视",
      "I watch {TV} after dinner.|lamp sofa | What's on {TV} tonight?|lamp sofa | Turn off the {TV} and go to bed.|lamp sofa",
      "lamp computer",
    ),
    word(
      "computer computers",
      "a machine for writing, games and the internet",
      "电脑",
      "I do my homework on the {computer}.|sofa cupboard | Our school has twenty {computers}.|sofas cupboards | My {computer} is slow today.|sofa lamp",
      "TV sofa",
    ),
    word(
      "toy toys",
      "a thing children play with",
      "玩具",
      "Put your {toys} in the box.|lamps pictures | My favorite {toy} is a small red car.|lamp cupboard | The baby is playing with a {toy}.|lamp cupboard",
      "lamp picture",
    ),
    word(
      "cupboard cupboards",
      "a piece of furniture with doors, for keeping things in",
      "柜子；橱柜",
      "The cups are in the {cupboard}.|sofa lamp | Close the {cupboard} door.|sofa toy | Put the plates back in the {cupboard}.|sofa lamp",
      "sofa lamp",
    ),
    word(
      "between",
      "in the space in the middle of two things",
      "在……之间",
      "The lamp is {between} the bed and the desk.|behind near | B comes {between} A and C.|behind near | Tuesday is {between} Monday and Wednesday.|behind front",
      "behind near",
    ),
    word(
      "behind",
      "at the back of something",
      "在……后面",
      "The cat is {behind} the sofa. I can't see it.|between front | The garden is {behind} the house.|between front | Close the door {behind} you.|between front",
      "between front",
    ),
    word(
      "near nearer nearest",
      "not far from something",
      "在……附近",
      "Our school is {near} my home. I walk there.|between front | Is there a shop {near} here?|between front | Don't sit {near} the window. It's cold.|between front",
      "between behind",
    ),
    word(
      "front fronts",
      "the side that faces forward; with *in* and *of*, ahead of something",
      "前面；（in front of）在……前面",
      "The car is in {front} of the house.|behind between | I sit at the {front} of the class.|behind between | Stand in {front} of the TV and you block it!|behind near",
      "behind between",
    ),
    word(
      "large larger largest",
      "big",
      "大的",
      "We have a {large} garden with many trees.|near behind | A {large} pizza is for four people.|near front | An elephant is a very {large} animal.|near between",
      "near behind",
    ),
  ],
});

const housework = vocabularyTopic({
  id: "a1-words-housework",
  title: t("Housework", "家务"),
  summary: t(
    "Cleaning, washing, helping, making, putting things away; dirty dishes and towels.",
    "打扫、洗、帮忙、做、把东西放好；脏盘子和毛巾。",
  ),
  prerequisites: ["a1-words-things-at-home"],
  words: [
    word(
      "clean cleans cleaned cleaning cleaner cleanest",
      "not dirty; to make something not dirty",
      "干净的；打扫",
      "I {clean} my room on Saturday.|use own | I washed my hands. They are {clean} now.|dirty own | Mom is {cleaning} the kitchen.|using owning",
      "dirty use",
    ),
    word(
      "wash washes washed washing",
      "to clean something with water",
      "洗",
      "{Wash} your hands before dinner.|Own Put | I {wash} the dishes after dinner.|own put | Dad is {washing} the car.|owning putting",
      "own put",
    ),
    word(
      "help helps helped helping",
      "to do something for someone so that it is easier for them",
      "帮助",
      "Can you {help} me, please? This box is big.|own use | I {help} my mom in the kitchen.|own put | Thank you for your {help}!|towel dish",
      "own use",
    ),
    word(
      "dish dishes",
      "a plate or a bowl; food made in a special way",
      "盘子；菜肴",
      "I wash the {dishes} after dinner.|towels walls | Dumplings are my favorite {dish}.|towel wall | Put the {dishes} in the cupboard.|towels walls",
      "towel cupboard",
    ),
    word(
      "make makes made making",
      "to build or create something; to cook",
      "做；制作",
      "I {make} my bed every morning.|use own | Dad is {making} pizza for dinner.|using owning | We {made} a cake for Mom's birthday.|used owned",
      "use own",
    ),
    word(
      "put puts putting",
      "to move something to a place",
      "放",
      "{Put} your shoes under the bed.|Own Use | Where did you {put} my bag? — It's on the chair.|own use | Please {put} the toys in the box.|own clean",
      "own use",
    ),
    word(
      "use uses used using",
      "to do something with a thing",
      "使用",
      "Can I {use} your pen?|own put | We {use} a knife to cut bread.|own put | I'm {using} the computer for my homework.|owning putting",
      "own put",
    ),
    word(
      "dirty dirtier dirtiest",
      "not clean",
      "脏的",
      "Your hands are {dirty}. Go and wash them.|clean own | Put the {dirty} clothes in the washing machine.|clean own | The floor is {dirty}. Let's clean it.|clean own",
      "clean own",
    ),
    word(
      "own owns owned owning",
      "to have something that is yours; belonging to you",
      "拥有；自己的",
      "I have my {own} room.|use help | Do you {own} a car? — No, we take the bus.|use help | My uncle {owns} a shop.|uses helps",
      "use help",
    ),
    word(
      "towel towels",
      "a piece of soft cloth for drying yourself",
      "毛巾",
      "Dry your hands with a {towel}.|dish lamp | Take a {towel} to the beach.|dish lamp | The {towels} are in the bathroom.|dishes lamps",
      "dish lamp",
    ),
  ],
});

// There is and there are.

const oneThing: readonly string[] = [
  "a lamp",
  "a sofa",
  "a computer",
  "a big window",
  "a picture",
  "an old TV",
  "a cupboard",
  "a desk",
  "a toy box",
];
const manyThings: readonly string[] = [
  "two beds",
  "three chairs",
  "some books",
  "four windows",
  "two lamps",
  "some toys",
  "five pictures",
  "two doors",
];
const rooms: readonly string[] = [
  "in my room",
  "in our house",
  "in the bedroom",
  "in the kitchen",
  "in the apartment",
  "in the living room",
];

/** thereAll are every thing in every room; each bank starts at its own place in them. */
const thereAll = interleave([
  everyPair(oneThing, rooms).map(([thing, room]) => ({ thing, room, be: "is", other: "are" })),
  everyPair(manyThings, rooms).map(([thing, room]) => ({ thing, room, be: "are", other: "is" })),
]);

const thereItems = (skip: number) => [...thereAll.slice(skip), ...thereAll.slice(0, skip)];

const thereChoiceBank: readonly ChoiceItem[] = thereItems(0).map(
  ({ thing, room, be, other }): ChoiceItem => [`There ___ ${thing} ${room}.`, be, [other, "have"]],
);

const thereFixBank: readonly TypedItem[] = thereItems(22).map(({ thing, room, be }, k): TypedItem => {
  const shown = k % 2 === 0 ? `Have ${thing} ${room}.` : `There have ${thing} ${room}.`;
  return {
    shown,
    accepted: [be === "is" ? `[There is|There's] ${thing} ${room}.` : `There are ${thing} ${room}.`],
    canonical: `There ${be} ${thing} ${room}.`,
    wrong: [shown, `There ${be === "is" ? "are" : "is"} ${thing} ${room}.`],
  };
});

const thereQuestionBank: readonly TypedItem[] = thereItems(5).map(({ thing, room, be }): TypedItem => {
  const any = thing.replace(/^(some|two|three|four|five)\b/u, "any");
  const asked = be === "is" ? thing : any;
  return {
    shown: `There ${be} ${thing} ${room}.`,
    accepted: [`${sentenceCase(be)} there ${asked} ${room}?`],
    wrong: [`There ${be} ${asked} ${room}?`, `Have ${asked} ${room}?`],
  };
});

/** thereReason says why a thing takes there is or there are, in every locale. */
const thereReason = (thing: string, be: string): Text =>
  be === "is"
    ? t(`*${thing}* is one thing, so it takes *There is*`, `*${thing}* 是一样东西，所以用 *There is*`)
    : t(`*${thing}* is more than one thing, so it takes *There are*`, `*${thing}* 是多样东西，所以用 *There are*`);

/** haveNotThere says why have cannot say what is in a place, in every locale. */
const haveNotThere = t(
  "*have* says what a person owns; to say what is in a place, English starts with *There is* or *There are*, not with *have* as Chinese uses 有.",
  "*have* 说的是某人拥有什么；说某处有什么，英语要用 *There is* 或 *There are* 开头，不能像中文“有”那样用 *have*。",
);

const thereIsAndThereAre: TopicDef = {
  id: "there-is-and-there-are",
  title: t("There Is and There Are", "there is 和 there are"),
  summary: t(
    "There is a lamp. There are two beds. English says what is in a place with there is and there are.",
    "There is a lamp. There are two beds. 英语用 there is 和 there are 说某处有什么。",
  ),
  prerequisites: ["plural-nouns-with-s", "a1-words-home"],
  encompasses: [
    { topic: "plural-nouns-with-s", weight: 0.3 },
    { topic: "a1-words-home", weight: 0.2 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("There is or there are", "there is 还是 there are"),
      t(
        "To say what is in a place, start with *there*: *There is a lamp in my room.* Use *is* for one thing and *are* for more: *There are two beds.*\n\nThe short form of *there is* is *there's*.",
        "说某处有什么，句子以 *there* 开头：*There is a lamp in my room.* 一样东西用 *is*，多样东西用 *are*：*There are two beds.*\n\n*there is* 的缩写是 *there's*。",
      ),
      choiceGenerator(
        t("Choose the word for the gap.", "选出填入空白处的词。"),
        thereChoiceBank,
        (right, shown) => {
          const reason = thereReason(shown.split("___ ")[1]?.split(" in ")[0] ?? "", right);
          return t(`${reason.en}: ${shown.replace("___", `*${right}*`)}`, `${reason["zh-CN"]}：${shown.replace("___", `*${right}*`)}`);
        },
        (wrong, _right, shown) => {
          const thing = shown.split("___ ")[1]?.split(" in ")[0] ?? "";
          if (wrong === "have") return haveNotThere;
          return wrong === "are"
            ? t(`*are* is for more than one thing, but *${thing}* is one.`, `*are* 用于多样东西，可 *${thing}* 只是一样。`)
            : t(`*is* is for one thing, but *${thing}* is more than one.`, `*is* 用于一样东西，可 *${thing}* 不止一样。`);
        },
      ),
    ),
    point(
      "fix",
      t("Not have, but there is", "不用 have，用 there is"),
      t(
        "Chinese says *yǒu* (有) for both *have* and *there is*, so learners write *Have a lamp in my room.* In English, a place does not *have* here: say *There is a lamp in my room.*",
        "中文“有”既表示 *have*，也表示 *there is*，所以学习者常写 *Have a lamp in my room.* 或 *There have two beds.* 说某处有某物时，英语要用 *There is* 或 *There are*：*There is a lamp in my room.*",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Fix the sentence. Start with There.", "改正这个句子，以 There 开头。"),
        thereFixBank,
        (right) => {
          const be = right.startsWith("There is") ? "is" : "are";
          const reason = thereReason(right.replace(/^There (is|are) /u, "").split(" in ")[0] ?? "", be);
          return t(
            `A place does not *have* things in English; to say what is in it, start with *There*. ${reason.en}: ${right}`,
            `英语里地点不能 *have* 东西；说某处有什么，要以 *There* 开头。${reason["zh-CN"]}：${right}`,
          );
        },
      ),
    ),
    point(
      "ask",
      t("Is there? Are there?", "Is there? Are there?"),
      t(
        "For a question, put *is* or *are* first: *Is there a lamp in your room? Are there any toys?* In a question, *some* and a number become *any*.",
        "疑问句把 *is* 或 *are* 放到句首：*Is there a lamp in your room? Are there any toys?* 疑问句中，*some* 和数字要换成 *any*。",
      ),
      typedGenerator("sentence", t("Make the sentence a question.", "把句子改成疑问句。"), thereQuestionBank, (right, shown) => {
        const be = right.split(" ")[0] ?? "";
        const changed = / any /u.test(right) && !/ any /u.test(shown);
        return t(
          `For a question, put *${be}* before *there*${changed ? ", and *some* or a number becomes *any*" : " and end with a question mark"}: ${right}`,
          `疑问句把 *${be}* 放到 *there* 前面${changed ? "，*some* 或数字要换成 *any*" : "，句末用问号"}：${right}`,
        );
      }),
    ),
  ],
};

// Prepositions of place.

const furniture: readonly string[] = ["lamp", "sofa", "bed", "desk", "chair", "cupboard", "TV", "window", "door"];
const small: readonly string[] = ["ball", "cat", "dog", "bag", "book", "toy car", "phone"];
const large: readonly string[] = ["table", "bed", "chair", "desk", "sofa"];
const near: readonly string[] = ["shop", "school", "park", "station", "zoo", "hospital"];

type Scene = { readonly text: string; readonly right: string; readonly wrong: readonly string[] };

/** scene k describes where one thing is from another, without naming the word. */
const scene = (k: number): Scene => {
  const j = Math.floor(k / 7);
  const gap = 1 + (Math.floor(j / furniture.length) % (furniture.length - 2));
  const a = furniture[j % furniture.length] ?? "lamp";
  const b = furniture[(j + gap) % furniture.length] ?? "bed";
  const c = furniture[(j + gap + 1) % furniture.length] ?? "desk";
  const s = small[j % small.length] ?? "ball";
  const l = large[(j + Math.floor(j / small.length)) % large.length] ?? "table";
  switch (k % 7) {
    case 0:
      return {
        text: `You can't see the ${s}. The ${l} is in front of it. The ${s} is ___ the ${l}.`,
        right: "behind",
        wrong: ["in front of", "between"],
      };
    case 1:
      return { text: `The ${a} is behind the ${b}, so the ${b} is ___ the ${a}.`, right: "in front of", wrong: ["behind", "between"] };
    case 2:
      return { text: `The ${a} and the ${b} are side by side. The ${a} is ___ the ${b}.`, right: "next to", wrong: ["between", "under"] };
    case 3:
      return {
        text: `The ${a} is on the left, the ${c} is on the right, and the ${b} is in the middle. The ${b} is ___ the ${a} and the ${c}.`,
        right: "between",
        wrong: ["behind", "in front of"],
      };
    case 4:
      return {
        text: `The ${s} is on the floor, and the ${l} is over it. The ${s} is ___ the ${l}.`,
        right: "under",
        wrong: ["on", "behind"],
      };
    case 5:
      return { text: `The ${l} is under the ${s}, so the ${s} is ___ the ${l}.`, right: "on", wrong: ["under", "between"] };
    default:
      return {
        text: `The ${near[j % near.length] ?? "shop"} is only ${["two", "three", "five"][Math.floor(j / near.length) % 3]} minutes from my home. It's ___ my home.`,
        right: "near",
        wrong: ["between", "under"],
      };
  }
};

const scenes = (from: number, count: number): readonly Scene[] => {
  const seen = new Map<string, Scene>();
  for (let k = from; seen.size < count && k < from + 1000; k++) {
    const s = scene(k);
    if (!seen.has(s.text)) seen.set(s.text, s);
  }
  return [...seen.values()];
};

const placeChoiceBank: readonly ChoiceItem[] = scenes(0, 120).map(({ text, right, wrong }): ChoiceItem => [text, right, wrong]);
const placeTypedBank: readonly TypedItem[] = scenes(500, 110).map(
  ({ text, right, wrong }): TypedItem => ({ shown: text, accepted: [right], wrong }),
);

/** placeMeaning says what each place word means, in every locale. */
const placeMeaning: Record<string, Text> = {
  behind: t("at the back of something, hidden by it", "在……后面，被它挡住"),
  "in front of": t("at the front of something, the other way round from *behind*", "在……前面，和 *behind* 相反"),
  "next to": t("side by side with something", "紧挨着"),
  between: t("in the middle of two things", "在两者之间"),
  under: t("below something", "在……下面"),
  on: t("on top of something", "在……上面"),
  near: t("not far from something", "在……附近，不远"),
};

const placeWhy = (right: string, shown: string) => {
  const stop = shown.lastIndexOf(". ", shown.indexOf("___"));
  const sentence = shown.slice(stop < 0 ? 0 : stop + 2).replace("___", `*${right}*`);
  return t(
    `*${right}* means ${placeMeaning[right]?.en}, which is just what the words before it describe: ${sentence}`,
    `*${right}* 的意思是${placeMeaning[right]?.["zh-CN"]}，正是前面描述的位置：${sentence}`,
  );
};

/** whyNotPlace says what a wrong place word means, which the scene does not describe. */
const whyNotPlace = (wrong: string): Text =>
  t(
    `*${wrong}* means ${placeMeaning[wrong]?.en}, but that is not where the words before the gap put it.`,
    `*${wrong}* 的意思是${placeMeaning[wrong]?.["zh-CN"]}，可前面描述的位置不是这样。`,
  );

const prepositionsOfPlace: TopicDef = {
  id: "prepositions-of-place",
  title: t("Next To, Behind and Between", "next to、behind 和 between"),
  summary: t("The lamp is next to the bed. The cat is between the chairs.", "The lamp is next to the bed. The cat is between the chairs."),
  prerequisites: ["in-on-and-under", "a1-words-things-at-home"],
  encompasses: [
    { topic: "in-on-and-under", weight: 0.4 },
    { topic: "a1-words-things-at-home", weight: 0.3 },
  ],
  xp: 20,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Where things are", "东西在哪里"),
      t(
        "*next to*: side by side. *behind*: at the back. *in front of*: at the front, the other way round from *behind*. *between*: in the middle of two things. *near*: not far. And *in*, *on* and *under*.\n\nThe word comes before the place: *The cat is behind the sofa.*",
        "*next to*：紧挨着。*behind*：在后面。*in front of*：在前面，和 *behind* 相反。*between*：在两者之间。*near*：在附近。还有 *in*、*on*、*under*。\n\n中文说“在沙发后面”，方位词放在后面；英语正好相反，方位词放在前面：*The cat is behind the sofa.*",
      ),
      choiceGenerator(t("Choose the words for the gap.", "选出填入空白处的词。"), placeChoiceBank, placeWhy, whyNotPlace),
    ),
    point(
      "type",
      t("Writing the place words", "写出方位词"),
      t(
        "Read where the things are and type the word or words: *behind*, *in front of*, *next to*, *between*, *near*, *on* or *under*.",
        "读一读东西的位置，输入方位词：*behind*、*in front of*、*next to*、*between*、*near*、*on* 或 *under*。",
      ),
      typedGenerator("word-form", t("Type the word or words for the gap.", "输入填入空白处的词。"), placeTypedBank, placeWhy),
    ),
  ],
};

// Writing about a room.

const roomThings: readonly (readonly [thing: string, many: boolean])[] = [
  ["a desk", false],
  ["a lamp", false],
  ["two chairs", true],
  ["a big sofa", false],
  ["some books", true],
  ["a picture", false],
  ["three toys", true],
  ["a small table", false],
  ["a computer", false],
];

const roomPlaces: readonly string[] = [
  "next to the window",
  "behind the door",
  "near the bed",
  "under the window",
  "in front of the cupboard",
];

const roomItems = pairUp(42, roomThings, roomPlaces).map(([[thing, many], place]) => ({
  note: `${thing} / ${place}`,
  right: `There ${many ? "are" : "is"} ${thing} ${place}.`,
  pattern: many ? `There are ${thing} ${place}.` : `[There is|There's] ${thing} ${place}.`,
  wrongBe: `There ${many ? "is" : "are"} ${thing} ${place}.`,
  have: `Have ${thing} ${place}.`,
}));

const roomChoiceBank: readonly ChoiceItem[] = roomItems.map(({ note, right, wrongBe, have }): ChoiceItem => [note, right, [wrongBe, have]]);
const roomTypedBank: readonly TypedItem[] = roomItems.map(
  ({ note, right, pattern, wrongBe, have }): TypedItem => ({
    shown: note,
    accepted: [pattern],
    canonical: right,
    wrong: [wrongBe, have],
  }),
);

/** roomWhy explains a sentence about a room from its note: there is or there are, then the thing, then the place. */
const roomWhy = (right: string, shown: string): Text => {
  const [thing = "", place = ""] = shown.split(" / ");
  const reason = thereReason(thing, right.startsWith("There is") ? "is" : "are");
  return t(
    `${reason.en}; then comes the thing, and the place *${place}* goes at the end: ${right}`,
    `${reason["zh-CN"]}；后面先写东西，位置 *${place}* 放在句末：${right}`,
  );
};

const writingAboutARoom: TopicDef = {
  id: "writing-about-a-room",
  title: t("Writing About a Room", "描写一个房间"),
  summary: t(
    "Turn notes into sentences: a desk / next to the window becomes There is a desk next to the window.",
    "把笔记写成句子：a desk / next to the window 写成 There is a desk next to the window.",
  ),
  prerequisites: ["there-is-and-there-are", "prepositions-of-place"],
  encompasses: [
    { topic: "there-is-and-there-are", weight: 0.3 },
    { topic: "prepositions-of-place", weight: 0.3 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The sentence for a note", "选出符合笔记的句子"),
      t(
        "A note gives a thing and a place. The sentence starts with *There is* for one thing or *There are* for more, then the thing, then the place.\n\n*a desk / next to the window* → *There is a desk next to the window.*",
        "笔记给出一样东西和一个位置。写成句子时，一样东西用 *There is* 开头，多样东西用 *There are*，后面先写东西，再写位置。\n\n*a desk / next to the window* → *There is a desk next to the window.*\n\n中文常把位置放在前面（“窗户旁边有一张书桌”），英语一般把位置放在句末。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the note.", "选出与笔记相符的句子。"),
        roomChoiceBank,
        (right, shown) => roomWhy(right, shown),
        (wrong, _right, _shown, position) =>
          position === 0
            ? wrong.startsWith("There are")
              ? t("This uses *are*, but the note gives just one thing.", "这句用了 *are*，可笔记里只有一样东西。")
              : t("This uses *is*, but the note gives more than one thing.", "这句用了 *is*，可笔记里不止一样东西。")
            : haveNotThere,
      ),
    ),
    point(
      "write",
      t("Writing the sentence", "写出句子"),
      t(
        "Write a whole sentence for the note: *There is* for one thing or *There are* for more, then the thing, then the place. Start with a capital letter and end with a period.",
        "根据笔记写一个完整的句子：一样东西用 *There is*，多样东西用 *There are*，后面先写东西，再写位置。句首大写，句末加句号。",
      ),
      typedGenerator("sentence-pattern", t("Write a sentence from the note.", "根据笔记写一个句子。"), roomTypedBank, roomWhy),
    ),
  ],
};

/** topics are the topics of the unit Home. */
export const topics: readonly TopicDef[] = [
  home.topic,
  thingsAtHome.topic,
  housework.topic,
  thereIsAndThereAre,
  prepositionsOfPlace,
  writingAboutARoom,
];

/** vocabulary are the words the unit Home teaches. */
export const vocabulary: readonly WordBatch[] = [home.batch, thingsAtHome.batch, housework.batch];
