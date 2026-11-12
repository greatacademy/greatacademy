// A2, unit 3: Neighbors and Community. The neighborhood, helping out, people around us, describing places, and mine
// and myself; possessive pronouns; comparisons judged by rules and a place described for a model.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator, type WritingItem } from "@ga/subject-english";
import type { WordBatch } from "../../pack.ts";
import { everyPair, interleave, pairUp, vocabularyTopic, word } from "../words.ts";
import { fill, judgedTopic } from "./kit.ts";

const neighborhood = vocabularyTopic({
  id: "a2-words-neighborhood",
  title: t("The Neighborhood", "街区"),
  summary: t(
    "Neighbors and neighborhoods, areas, villages and centers, squares, markets, fountains, churches, bakeries and playgrounds.",
    "邻居和街区、地区、村庄和中心、广场、市场、喷泉、教堂、面包店和游乐场。",
  ),
  prerequisites: ["a1-words-town"],
  words: [
    word(
      "neighbor neighbors",
      "a person who lives next to you or near you",
      "邻居",
      "Our {neighbor} Mrs. Lee has a big garden.|village square | My {neighbors} are very friendly. They often say hello.|villages squares | I borrowed some eggs from my {neighbor}.|village market",
      "village square",
    ),
    word(
      "neighborhood neighborhoods",
      "the area around your home, and the people who live there",
      "街区；社区",
      "There's a nice park in our {neighborhood}.|neighbor bakery | This is a quiet {neighborhood} with lots of trees.|neighbor bakery | Everyone in the {neighborhood} knows Mr. Green.|neighbor fountain",
      "neighbor bakery",
      "area",
    ),
    word(
      "area areas",
      "a part of a town, a country or a place",
      "地区；区域",
      "We live in a quiet {area} of the city.|church bakery | This {area} has many shops and cafes.|church fountain | There's a play {area} for children in the park.|church bakery",
      "church bakery",
      "neighborhood",
    ),
    word(
      "village villages",
      "a very small town in the country",
      "村庄",
      "My grandparents live in a small {village} in the mountains.|square fountain | The {village} has one shop and a school.|square fountain | There are only 200 people in our {village}.|bakery fountain",
      "square fountain",
    ),
    word(
      "center centers",
      "the middle of something; the main part of a town",
      "中心",
      "We live in the {center} of the city, near the big shops.|village bakery | The table is in the {center} of the room.|village market | The sports {center} has a pool.|village fountain",
      "village bakery",
    ),
    word(
      "local",
      "of the place near you",
      "当地的",
      "We buy fruit from the {local} market.|square village | She works at the {local} hospital.|square bakery | The {local} people are very friendly.|square fountain",
      "square village",
    ),
    word(
      "square squares",
      "an open area with buildings around it in a town",
      "广场",
      "There's a big Christmas tree in the town {square}.|village neighbor | People dance in the {square} in the evening.|bakery neighbor | Let's meet in the {square} by the fountain.|neighbor bakery",
      "village neighbor",
    ),
    word(
      "market markets",
      "a place where people buy and sell food and other things, often outside",
      "市场",
      "We buy fresh vegetables at the {market}.|fountain church | The {market} is open on Saturday mornings.|fountain neighbor | There's a fish {market} by the sea.|fountain church",
      "fountain church",
    ),
    word(
      "fountain fountains",
      "a thing that sends water up into the air, often in a square or a park",
      "喷泉",
      "The children are playing in the {fountain}.|bakery church | There's a beautiful {fountain} in the middle of the square.|bakery neighbor | People throw coins into the {fountain}.|bakery church",
      "bakery church",
    ),
    word(
      "church churches",
      "a building where Christians pray",
      "教堂",
      "They got married in an old {church}.|fountain market | On Sunday, many people go to {church}.|bakery playground | We heard the {church} bells ringing.|bakery playground",
      "bakery playground",
    ),
    word(
      "bakery bakeries",
      "a shop that makes and sells bread and cakes",
      "面包店",
      "I bought some bread at the {bakery}.|church playground | The {bakery} opens at six, and it smells great.|church playground | My aunt works in a {bakery}. She makes cakes.|church playground",
      "church playground",
    ),
    word(
      "playground playgrounds",
      "a place outside where children play",
      "游乐场；操场",
      "The children are on the swings in the {playground}.|bakery church | At break time, we play in the school {playground}.|bakery church | There's a new {playground} in the park.|bakery church",
      "bakery church",
    ),
  ],
});

const helping = vocabularyTopic({
  id: "a2-words-community-actions",
  title: t("Helping Out", "互相帮助"),
  summary: t(
    "Sharing, joining, volunteering, collecting, planting, repairing, organizing, raising, protecting and noticing.",
    "分享、加入、做志愿者、收集、种植、修理、组织、募集、保护和注意。",
  ),
  prerequisites: ["a2-words-neighborhood"],
  words: [
    word(
      "share shares shared sharing",
      "to have or use something with other people",
      "分享",
      "Let's {share} the cake.|collect join | I {share} a room with my brother.|join repair | Thanks for {sharing} your lunch with me.|joining repairing",
      "collect join",
    ),
    word(
      "join joins joined joining",
      "to become a member of a group; to come together with",
      "加入",
      "I want to {join} the football club.|share collect | Would you like to {join} us for dinner?|share protect | She {joined} the school band last year.|shared repaired",
      "share collect",
    ),
    word(
      "volunteer volunteers volunteered volunteering",
      "to offer to do work for no money; a person who does this",
      "志愿者；自愿做",
      "I {volunteer} at the library on Saturdays.|repair raise | We need {volunteers} to clean the park.|notices plants | She {volunteered} to help the old man.|noticed collected",
      "repair raise",
    ),
    word(
      "collect collects collected collecting",
      "to bring things together from different places; to go and get someone",
      "收集；接（人）",
      "My brother {collects} stamps.|protects raises | We {collected} old bottles on the beach.|protected raised | Mom {collects} me from school at four.|shares joins",
      "protect raise",
    ),
    word(
      "plant plants planted planting",
      "to put a seed or a young tree in the ground; a living thing that grows in the ground",
      "种植；植物",
      "We {planted} trees in the park.|repaired noticed | Water the {plants} every day.|notices volunteers | Let's {plant} some flowers in the garden.|repair notice",
      "repair notice",
    ),
    word(
      "repair repairs repaired repairing",
      "to make something that is broken work again",
      "修理",
      "Dad {repaired} my bike.|planted noticed | Can you {repair} my watch?|plant raise | The road is closed because workers are {repairing} it.|planting raising",
      "plant raise",
    ),
    word(
      "organize organizes organized organizing",
      "to plan and get ready for something",
      "组织",
      "Our class {organized} a party for the teacher.|repaired noticed | Who is {organizing} the trip?|repairing planting | Let's {organize} a game in the park.|repair notice",
      "repair notice",
    ),
    word(
      "raise raises raised raising",
      "to lift up; to collect money for something",
      "举起；募集",
      "{Raise} your hand if you know the answer.|Notice Plant | We sold cakes to {raise} money for the school.|notice repair | She {raised} her arm to wave.|noticed planted",
      "notice plant",
    ),
    word(
      "protect protects protected protecting",
      "to keep someone or something safe",
      "保护",
      "Sunglasses {protect} your eyes from the sun.|collect raise | We must {protect} wild animals.|repair raise | The dog {protects} the house at night.|collects plants",
      "collect raise",
    ),
    word(
      "notice notices noticed noticing",
      "to see something and pay attention to it; a piece of paper with information on a wall",
      "注意到；通知",
      "Did you {notice} his new haircut?|raise protect | I didn't {notice} the rain.|join raise | Read the {notice} on the door.|volunteer plant",
      "raise protect",
    ),
  ],
});

const people = vocabularyTopic({
  id: "a2-words-people-around",
  title: t("People Around Us", "身边的人"),
  summary: t(
    "Strangers, guests, members, groups, leaders, owners and bakers, the mail, and people who are polite, rude, helpful or lonely.",
    "陌生人、客人、成员、小组、领队、主人和面包师，邮件，以及有礼貌、粗鲁、乐于助人或孤独的人。",
  ),
  prerequisites: ["a2-words-community-actions"],
  words: [
    word(
      "stranger strangers",
      "a person you do not know",
      "陌生人",
      "Don't open the door to {strangers}.|members leaders | I didn't know him. He was a {stranger}.|member guest | I'm a {stranger} here, so I don't know the way.|member leader",
      "member leader",
    ),
    word(
      "guest guests",
      "a person you invite to your home or to a party",
      "客人",
      "We have {guests} for dinner tonight.|strangers members | The hotel has 200 {guests}.|leaders bakers | Be polite to our {guests}.|bakers leaders",
      "stranger member",
    ),
    word(
      "member members",
      "a person who is in a group or club",
      "成员",
      "I'm a {member} of the chess club.|guest stranger | All the {members} of my family like music.|guests strangers | You need to be a {member} to use the pool.|leader stranger",
      "guest stranger",
    ),
    word(
      "group groups",
      "some people or things together",
      "组；群",
      "We worked in {groups} of four.|members leaders | A {group} of children are playing in the park.|member guest | Our {group} is going to the museum.|owner baker",
      "member leader",
    ),
    word(
      "leader leaders",
      "a person who is in charge of a group",
      "领导者；领队",
      "She is the {leader} of our team.|stranger guest | Follow the {leader}!|stranger mail | The group {leader} has the tickets.|stranger mail",
      "stranger guest",
    ),
    word(
      "owner owners",
      "the person something belongs to",
      "主人；所有者",
      "Who is the {owner} of this bag?|leader member | The dog ran back to its {owner}.|leader guest | The shop {owner} opens the door at nine.|guest stranger",
      "leader guest",
    ),
    word(
      "baker bakers",
      "a person who makes bread and cakes to sell",
      "面包师",
      "The {baker} gets up at four to make bread.|guest stranger | My uncle is a {baker}. His bread is great.|stranger guest | Ask the {baker} for two cakes.|stranger guest",
      "stranger guest",
    ),
    word(
      "mail",
      "letters and packages that are sent and brought to your home",
      "邮件",
      "Did we get any {mail} today?|guest leader | I check the {mail} every morning.|baker owner | I sent the card by {mail}.|guest leader",
      "guest leader",
    ),
    word(
      "polite",
      "speaking and acting in a kind way, with good manners",
      "有礼貌的",
      "Say please and thank you. Be {polite}!|rude lonely | He is always {polite} to his teachers.|rude lonely | It's {polite} to say thank you.|rude lonely",
      "rude lonely",
    ),
    word(
      "rude",
      "not polite",
      "粗鲁的",
      "Don't be {rude}. Say sorry!|polite helpful | It's {rude} to talk with food in your mouth.|polite helpful | The man was {rude}. He shouted at me and didn't say sorry.|polite helpful",
      "polite helpful",
    ),
    word(
      "helpful",
      "ready to help; useful",
      "乐于助人的；有用的",
      "The man at the station was very {helpful}. He showed us the way.|rude lonely | Thanks, that's very {helpful}!|rude lonely | This map is {helpful}.|rude lonely",
      "rude lonely",
    ),
    word(
      "lonely",
      "sad because you are alone",
      "孤独的",
      "My grandma lives alone, and she feels {lonely}.|helpful polite | I was {lonely} at my new school because I had no friends.|helpful polite | The old dog looks {lonely} without its friend.|helpful polite",
      "helpful polite",
    ),
  ],
});

const describing = vocabularyTopic({
  id: "a2-words-describing-places",
  title: t("Describing Places", "描述地方"),
  summary: t(
    "Noisy, crowded, peaceful, modern, empty, full, safe, dangerous, pretty, ugly and famous; danger.",
    "吵闹的、拥挤的、宁静的、现代的、空的、满的、安全的、危险的、漂亮的、丑的和著名的；危险。",
  ),
  prerequisites: ["a2-words-people-around"],
  words: [
    word(
      "noisy noisier noisiest",
      "making a lot of loud sounds",
      "吵闹的",
      "Our street is very {noisy} because of the cars.|peaceful empty | The classroom was {noisy}, so the teacher shouted.|peaceful safe | I can't sleep. The neighbors are too {noisy}.|peaceful famous",
      "peaceful empty",
    ),
    word(
      "crowded",
      "full of people",
      "拥挤的",
      "The bus was so {crowded} that I couldn't sit down.|empty peaceful | The beach is very {crowded} in summer.|empty peaceful | We left the {crowded} market and found a quiet cafe.|empty peaceful",
      "empty peaceful",
      "full",
    ),
    word(
      "peaceful",
      "quiet and calm",
      "宁静的",
      "The village is {peaceful}. You can only hear the birds.|noisy crowded | We had a {peaceful} walk in the forest.|noisy crowded | It's {peaceful} here early in the morning.|noisy dangerous",
      "noisy crowded",
    ),
    word(
      "modern",
      "new, of the present time",
      "现代的",
      "This phone is very {modern}. It came out last month.|old empty | Our school is {modern}: it was built two years ago.|old full | Grandma's kitchen is old, but ours is {modern}.|old older",
      "old empty",
    ),
    word(
      "empty emptier emptiest",
      "with nothing or no one inside",
      "空的",
      "The fridge is {empty}. Let's go shopping.|full crowded | The streets were {empty} at five in the morning.|full crowded | Please put the {empty} bottles in the bin.|full crowded",
      "full crowded",
    ),
    word(
      "full fuller fullest",
      "with no more space inside",
      "满的",
      "The bus is {full}. We have to wait for the next one.|empty peaceful | The box is {full} of old toys.|empty safe | I can't eat any more. I'm {full}!|empty safe",
      "empty peaceful",
      "crowded",
    ),
    word(
      "safe safer safest",
      "not in danger; not dangerous",
      "安全的",
      "Keep your money in a {safe} place.|dangerous crowded | The children are {safe} at home now.|dangerous famous | This street is {safe} at night, with lots of lights.|dangerous ugly",
      "dangerous noisy",
    ),
    word(
      "dangerous",
      "that can hurt you",
      "危险的",
      "It's {dangerous} to play near the road.|safe peaceful | Sharks are {dangerous}.|safe peaceful | Driving fast is {dangerous}.|safe peaceful",
      "safe peaceful",
    ),
    word(
      "pretty prettier prettiest",
      "nice to look at",
      "漂亮的",
      "What a {pretty} dress!|ugly noisy | The village is very {pretty}, with flowers everywhere.|ugly noisy | She has a {pretty} smile.|ugly noisy",
      "ugly noisy",
    ),
    word(
      "ugly uglier ugliest",
      "not nice to look at",
      "丑的",
      "That building is {ugly}. I don't like it.|pretty famous | I think this old sofa is {ugly}, but Dad loves it.|pretty famous | What an {ugly} hat!|pretty famous",
      "pretty famous",
    ),
    word(
      "famous",
      "known by many people",
      "著名的",
      "The Great Wall is {famous} all over the world.|pretty ugly | He's a {famous} singer. Everyone knows his songs.|pretty ugly | Paris is {famous} for its food.|pretty ugly",
      "pretty ugly",
    ),
    word(
      "danger dangers",
      "the chance that something bad or harmful will happen",
      "危险",
      "The doctor says the boy is out of {danger} now.|famous modern | Firefighters often put their lives in {danger}.|empty modern | Too much sugar is a {danger} to your health.|full famous | Children must learn about the {dangers} of the road.|famous empty",
      "dancer stranger",
    ),
  ],
});

const pronouns = vocabularyTopic({
  id: "a2-words-pronouns",
  title: t("Mine, Yours and Myself", "mine、yours 和 myself"),
  summary: t(
    "Mine, yours, hers, ours and theirs; myself, yourself, himself, herself, itself, ourselves and themselves.",
    "mine、yours、hers、ours、theirs；myself、yourself、himself、herself、itself、ourselves、themselves。",
  ),
  prerequisites: ["pre-a1-words-my-and-your"],
  words: [
    word(
      "mine",
      "the one that belongs to me",
      "我的（东西）",
      "This bag isn't yours. It's {mine}.|myself me | Is this pen yours or {mine}?|myself me | Your bike is red, and {mine} is blue.|myself me",
      "myself me",
    ),
    word(
      "yours",
      "the one that belongs to you",
      "你的（东西）",
      "Is this coat {yours}?|yourself your | My room is small, but {yours} is big.|yourself your | Here's my phone number. What's {yours}?|yourself your",
      "yourself your",
    ),
    word(
      "hers",
      "the one that belongs to her",
      "她的（东西）",
      "That's not Anna's bag. {Hers} is green.|Herself Her | Lily says the book is {hers}.|herself her | My hair is short, and {hers} is long.|herself her",
      "herself her",
    ),
    word(
      "ours",
      "the one that belongs to us",
      "我们的（东西）",
      "That car isn't {ours}. We don't have a car.|ourselves our | Their house is big, but {ours} is small.|ourselves our | Is this table {ours}? — Yes, we asked for it.|ourselves our",
      "ourselves our",
    ),
    word(
      "theirs",
      "the one that belongs to them",
      "他们的（东西）",
      "These bikes are Tom and Ben's. They're {theirs}.|themselves their | Our garden is small, and {theirs} is big.|themselves their | We have our tickets. Do they have {theirs}?|themselves their",
      "themselves their",
    ),
    word(
      "myself",
      "me, when I do something to me or alone",
      "我自己",
      "I hurt {myself} when I fell.|mine me | I made this cake {myself}.|mine me | I looked at {myself} in the mirror.|mine me",
      "mine me",
    ),
    word(
      "yourself",
      "you, when you do something to you or alone",
      "你自己",
      "Be careful! Don't cut {yourself}.|yours you | Did you make this {yourself}?|yours you | Help {yourself} to some cake.|yours you",
      "yours you",
    ),
    word(
      "himself",
      "him, when he does something to him or alone",
      "他自己",
      "Tom taught {himself} to play the guitar.|his him | He looked at {himself} in the window.|his him | The boy fell and hurt {himself}.|his him",
      "his him",
    ),
    word(
      "herself",
      "her, when she does something to her or alone",
      "她自己",
      "Anna made the dress {herself}.|hers her | She looked at {herself} in the mirror.|hers her | My little sister can dress {herself} now.|hers her",
      "hers her",
    ),
    word(
      "itself",
      "it, when it does something to it",
      "它自己",
      "The cat is washing {itself}.|its it | The door opened by {itself}!|its it | The machine turns {itself} off at night.|its it",
      "its it",
    ),
    word(
      "ourselves",
      "us, when we do something to us or alone",
      "我们自己",
      "We painted the house {ourselves}.|ours us | We enjoyed {ourselves} at the party.|ours us | We made dinner {ourselves} tonight.|ours us",
      "ours us",
    ),
    word(
      "themselves",
      "them, when they do something to them or alone",
      "他们自己",
      "The children made the cards {themselves}.|theirs them | They hurt {themselves} when they fell.|theirs them | My grandparents built the house {themselves}.|theirs them",
      "theirs them",
    ),
  ],
});

// Mine, yours and theirs.

/** owners are a person in brackets, the word that stands alone for them, the word before a noun, and a wrong word. */
const owners: readonly (readonly [who: string, alone: string, before: string, other: string])[] = [
  ["I", "mine", "my", "me"],
  ["you", "yours", "your", "yourself"],
  ["she", "hers", "her", "herself"],
  ["we", "ours", "our", "us"],
  ["they", "theirs", "their", "them"],
  ["he", "his", "him", "he"],
];

const things: readonly string[] = ["bag", "pen", "coat", "bike", "umbrella", "ticket", "phone", "ball", "book", "cup", "key"];

const ownerRows = everyPair(owners, things);

/** aloneFrames are sentences with a gap for a word that stands alone. */
const aloneFrames: readonly ((thing: string) => string)[] = [
  (thing) => `This ${thing} is ___.`,
  (thing) => `Is this ${thing} ___?`,
  (thing) => `The ${thing} on the table is ___.`,
  (thing) => `That ${thing} isn't ___.`,
];

const possessiveChoiceBank: readonly ChoiceItem[] = ownerRows.flatMap(([[who, alone, before, other], thing], k): ChoiceItem[] =>
  [aloneFrames[k % 4]!, aloneFrames[(k + 2) % 4]!].map((frame): ChoiceItem => [`${frame(thing)} (${who})`, alone, [before, other]]),
);

/** beforeNoun is the word that goes before a noun: his for he. */
const beforeNoun = (who: string, before: string) => (who === "he" ? "his" : before);
/** wrongAlone is the word a learner wrongly writes alone: him for he. */
const wrongAlone = (who: string, before: string) => (who === "he" ? "him" : before);

const possessiveFixBank: readonly TypedItem[] = interleave([
  ownerRows.map(([[who, alone, before], thing]): TypedItem => {
    const shown = `This ${thing} is ${wrongAlone(who, before)}.`;
    return { shown, accepted: [`This ${thing} is ${alone}.`], wrong: [shown] };
  }),
  ownerRows.map(([[who, alone, before], thing]): TypedItem => {
    const shown = `Is this ${who === "he" ? "him" : alone} ${thing}?`;
    return { shown, accepted: [`Is this ${beforeNoun(who, before)} ${thing}?`], wrong: [shown] };
  }),
  ownerRows.map(([[who, alone, before], thing]): TypedItem => {
    const shown = `The ${thing} on the table is ${wrongAlone(who, before)}.`;
    return { shown, accepted: [`The ${thing} on the table is ${alone}.`], wrong: [shown] };
  }),
]);

/** ownerOf finds the row of owners for a word that stands alone or goes before a noun. */
const ownerOf = (word: string) => owners.find(([, alone, before]) => alone === word || before === word);

/** possessiveWhy explains the word that stands alone in the gap of shown. */
const possessiveWhy = (right: string, shown: string): Text => {
  const who = /\((\w+)\)$/u.exec(shown)?.[1] ?? "";
  return t(
    `No noun follows the gap, so it needs the word that stands alone; for *${who}* that is *${right}*: ${fill(shown, right)}`,
    `空白后面没有名词，所以要用单独使用的词；*${who}* 对应的是 *${right}*：${fill(shown, right)}`,
  );
};

/** whyNotPossessive explains a word before a noun, or a word that does not show an owner. */
const whyNotPossessive = (wrong: string, right: string): Text => {
  if (/^(me|us|them|him)$/u.test(wrong))
    return t(
      `*${wrong}* is the word for someone an action is done to, not a word that shows who owns something. Here it is *${right}*.`,
      `*${wrong}* 是宾格，表示动作的对象，不表示东西属于谁。这里要用 *${right}*。`,
    );
  if (wrong.endsWith("self"))
    return t(
      `*${wrong}* is for doing something to yourself, as in *She hurt herself*. To show who owns something, use *${right}*.`,
      `*${wrong}* 是反身代词，如 *She hurt herself*。表示东西属于谁要用 *${right}*。`,
    );
  if (wrong === "he")
    return t(
      `*he* is the word for the one who does something. To show that something belongs to him, use *${right}*.`,
      `*he* 是主格，表示动作的发出者。表示东西属于他要用 *${right}*。`,
    );
  return t(
    `*${wrong}* must come before a noun, as in *${wrong} bag*. No noun follows here, so use *${right}*.`,
    `*${wrong}* 必须放在名词前，如 *${wrong} bag*。这里后面没有名词，要用 *${right}*。`,
  );
};

const possessivePronouns: TopicDef = {
  id: "possessive-pronouns",
  title: t("Mine, Yours and Theirs", "mine、yours 和 theirs"),
  summary: t(
    "This bag is mine. Is that yours? A word like mine stands alone, without a noun after it.",
    "This bag is mine. Is that yours? mine 这样的词单独使用，后面不接名词。",
  ),
  prerequisites: ["my-your-his-her", "a2-words-pronouns"],
  encompasses: [
    { topic: "my-your-his-her", weight: 0.3 },
    { topic: "a2-words-pronouns", weight: 0.2 },
  ],
  xp: 15,
  strand: "grammar",
  knowledgePoints: [
    point(
      "choose",
      t("Mine or my", "mine 还是 my"),
      t(
        "*My*, *your*, *her*, *our* and *their* come before a noun: *my bag*. *Mine*, *yours*, *hers*, *ours* and *theirs* stand alone, with no noun after them: *This bag is mine.*\n\n| before a noun | alone |\n| :--- | :--- |\n| my | mine |\n| your | yours |\n| his | his |\n| her | hers |\n| our | ours |\n| their | theirs |",
        "*my*、*your*、*her*、*our*、*their* 放在名词前：*my bag*。*mine*、*yours*、*hers*、*ours*、*theirs* 单独使用，后面不接名词：*This bag is mine.*\n\n中文“我的”既能说“我的包”，也能说“这包是我的”；英语要分成两个词：*my bag*，*This bag is mine.*\n\n| 名词前 | 单独使用 |\n| :--- | :--- |\n| my | mine |\n| your | yours |\n| his | his |\n| her | hers |\n| our | ours |\n| their | theirs |",
      ),
      choiceGenerator(t("Choose the word for the gap.", "选出填入空白处的词。"), possessiveChoiceBank, possessiveWhy, whyNotPossessive),
    ),
    point(
      "fix",
      t("Fixing mine and my", "改正 mine 和 my"),
      t(
        "Each sentence uses the wrong word: *my* where nothing follows, or *mine* before a noun. Write it again.",
        "每个句子都用错了词：后面没有名词却用了 *my*，或在名词前用了 *mine*。改正句子。",
      ),
      typedGenerator("sentence", t("Fix the sentence.", "改正这个句子。"), possessiveFixBank, (right) => {
        if (right.startsWith("Is this")) {
          const word = right.split(" ")[2] ?? "";
          const alone = ownerOf(word)?.[1] ?? word;
          return t(
            `A noun follows, so it needs the word that goes before a noun: *${word}*, not *${alone}*: ${right}`,
            `后面有名词，所以要用放在名词前的词：*${word}*，不用 *${alone}*：${right}`,
          );
        }
        const word = /(\w+)\.$/u.exec(right)?.[1] ?? "";
        return t(
          `No noun follows, so it needs the word that stands alone: *${word}*: ${right}`,
          `后面没有名词，所以要用单独使用的词 *${word}*：${right}`,
        );
      }),
    ),
  ],
};

// Writing comparisons.

/** adjectives are an adjective, its comparative and superlative, and a wrong comparative a learner writes. */
const adjectives: readonly (readonly [adjective: string, more: string, most: string, bad: string])[] = [
  ["big", "bigger", "biggest", "more big"],
  ["busy", "busier", "busiest", "busyer"],
  ["noisy", "noisier", "noisiest", "noisyer"],
  ["old", "older", "oldest", "more old"],
  ["pretty", "prettier", "prettiest", "prettyer"],
  ["crowded", "more crowded", "most crowded", "crowdeder"],
  ["modern", "more modern", "most modern", "moderner"],
  ["peaceful", "more peaceful", "most peaceful", "peacefuller"],
  ["safe", "safer", "safest", "safeer"],
  ["small", "smaller", "smallest", "more small"],
  ["good", "better", "best", "gooder"],
  ["bad", "worse", "worst", "badder"],
  ["famous", "more famous", "most famous", "famouser"],
  ["dangerous", "more dangerous", "most dangerous", "dangerouser"],
];

const placePairs: readonly (readonly [a: string, b: string])[] = [
  ["the park", "the square"],
  ["the market", "the mall"],
  ["our street", "your street"],
  ["the village", "the town"],
  ["the new playground", "the old one"],
  ["the bakery", "the cafe"],
  ["this beach", "that one"],
  ["the library", "the bookshop"],
  ["the city center", "our area"],
];

/** where are what a superlative is the most of. */
const where: readonly string[] = ["in our town", "in the city", "in the village", "in our neighborhood", "in the area"];

const capital = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const comparisonRows = pairUp(126, adjectives, placePairs);

const comparisonChoiceBank: readonly ChoiceItem[] = comparisonRows.slice(0, 40).map(([[adjective, more, , bad], [a, b]]): ChoiceItem => {
  const right = `${capital(a)} is ${more} than ${b}.`;
  const double = more.startsWith("more ") ? `${capital(a)} is ${adjective} than ${b}.` : `${capital(a)} is more ${more} than ${b}.`;
  return [`${a} / ${b} / ${adjective}`, right, [`${capital(a)} is ${bad} than ${b}.`, double]];
});

const comparisonTypedBank: readonly TypedItem[] = comparisonRows.slice(40, 80).map(
  ([[adjective, more, , bad], [a, b]]): TypedItem => ({
    shown: `${a} / ${b} / ${adjective}`,
    accepted: [`${capital(a)} is ${more} than ${b}.`],
    wrong: [`${capital(a)} is ${bad} than ${b}.`, `${capital(a)} is ${more} ${b}.`],
  }),
);

/** best are the places a superlative is about. */
const best: readonly string[] = [
  "the market",
  "the park",
  "the bakery",
  "the library",
  "the church",
  "the playground",
  "the square",
  "the cafe",
  "the school",
];

const superlativeTypedBank: readonly TypedItem[] = pairUp(70, adjectives, where)
  .slice(0, 40)
  .map(([[adjective, , most], place], k): TypedItem => {
    const a = capital(best[k % best.length] ?? "the park");
    const right = `${a} is the ${most} ${place}.`;
    return {
      shown: `${best[k % best.length]} / ${adjective} / ${place}`,
      accepted: [right, `${a} is the ${most} place ${place}.`],
      canonical: right,
      wrong: [`${a} is ${most} ${place}.`, `${a} is the most ${adjective} ${place}.`].filter((w) => w !== right),
    };
  });

/** compareRule names the rule that makes the comparative or the superlative of an adjective. */
const compareRule = (adjective: string, form: string, most: boolean): Text => {
  const end = most ? "-est" : "-er";
  const long = most ? "most" : "more";
  if (form.startsWith(`${long} `))
    return t(`*${adjective}* is a long word, so it takes *${long}* before it`, `*${adjective}* 是长词，前面加 *${long}*`);
  if (adjective === "good" || adjective === "bad")
    return t(`*${adjective}* has a form of its own: *${form}*`, `*${adjective}* 有自己的形式：*${form}*`);
  if (adjective.endsWith("y"))
    return t(
      `*${adjective}* ends in a consonant and *y*, so the *y* becomes *i* before *${end}*`,
      `*${adjective}* 以辅音字母加 *y* 结尾，把 *y* 变成 *i* 再加 *${end}*`,
    );
  if (adjective.endsWith("e")) {
    const add = most ? "-st" : "-r";
    return t(`*${adjective}* ends in *e*, so it adds only *${add}*`, `*${adjective}* 以 *e* 结尾，只加 *${add}*`);
  }

  if (form.length === adjective.length + end.length - 1)
    return t(`*${adjective}* is a short word, so it adds *${end}*`, `*${adjective}* 是短词，直接加 *${end}*`);
  return t(
    `*${adjective}* ends in one vowel and one consonant, so the consonant doubles before *${end}*`,
    `*${adjective}* 以一个元音字母加一个辅音字母结尾，双写辅音字母再加 *${end}*`,
  );
};

/** comparisonWhy explains a comparison written from notes. */
const comparisonWhy = (right: string, shown: string): Text => {
  const adjective = shown.split(" / ")[2] ?? "";
  const form = adjectives.find(([a]) => a === adjective)?.[1] ?? "";
  const rule = compareRule(adjective, form, false);
  return t(
    `The first place comes first, then *is*, the comparative and *than*; ${rule.en}: ${right}`,
    `先写第一个地方，再写 *is*、比较级和 *than*；${rule["zh-CN"]}：${right}`,
  );
};

/** whyNotComparison explains a misspelt comparative or one that uses more and -er together, or neither. */
const whyNotComparison = (wrong: string, _right: string, shown: string, position: number): Text => {
  const adjective = shown.split(" / ")[2] ?? "";
  const form = adjectives.find(([a]) => a === adjective)?.[1] ?? "";
  const rule = compareRule(adjective, form, false);
  if (position === 0)
    return t(
      `*${wrong}* gets the comparative wrong: ${rule.en}, so it is *${form}*.`,
      `*${wrong}* 的比较级错了：${rule["zh-CN"]}，所以是 *${form}*。`,
    );
  return form.startsWith("more ")
    ? t(
        `*${wrong}* leaves the adjective as it is. ${rule.en}, so it is *${form}*.`,
        `*${wrong}* 没有把形容词变成比较级。${rule["zh-CN"]}，所以是 *${form}*。`,
      )
    : t(
        `*${wrong}* uses both *more* and *-er*. A comparative takes one or the other, never both: *${form}*.`,
        `*${wrong}* 同时用了 *more* 和 *-er*。比较级只能用其中一种：*${form}*。`,
      );
};

const writingComparisons: TopicDef = {
  id: "writing-comparisons",
  title: t("Writing Comparisons", "写比较句"),
  summary: t(
    "Turn notes into comparisons: the park / the square / noisy becomes The park is noisier than the square.",
    "把笔记写成比较句：the park / the square / noisy 写成 The park is noisier than the square.",
  ),
  prerequisites: ["comparatives-and-superlatives", "writing-capitals-and-periods"],
  encompasses: [
    { topic: "comparatives-and-superlatives", weight: 0.4 },
    { topic: "writing-capitals-and-periods", weight: 0.1 },
  ],
  xp: 20,
  strand: "writing",
  knowledgePoints: [
    point(
      "choose",
      t("The comparison for the notes", "选出符合笔记的比较句"),
      t(
        "The notes give two places and an adjective. The sentence puts the first place first, then *is*, the comparative and *than*:\n\n*the park / the square / noisy* → *The park is noisier than the square.*\n\nShort words add *-er* (*bigger*, *busier*); long words take *more* (*more crowded*); *good* and *bad* become *better* and *worse*. Never both: not *more bigger*.",
        "笔记给出两个地方和一个形容词。句子先写第一个地方，再写 *is*、比较级和 *than*：\n\n*the park / the square / noisy* → *The park is noisier than the square.*\n\n短词加 *-er*（*bigger*、*busier*）；长词前加 *more*（*more crowded*）；*good* 和 *bad* 变成 *better* 和 *worse*。不能两样都用：不说 *more bigger*。中文说“公园比广场吵”，形容词不变；英语的形容词要变成比较级。",
      ),
      choiceGenerator(
        t("Choose the sentence that matches the notes.", "选出与笔记相符的句子。"),
        comparisonChoiceBank,
        comparisonWhy,
        whyNotComparison,
      ),
    ),
    point(
      "write",
      t("Writing the comparison", "写出比较句"),
      t(
        "Write the sentence for the notes: the first place, *is*, the comparative of the adjective and *than*, then the second place. Start with a capital letter and end with a period.",
        "根据笔记写出比较句：第一个地方、*is*、形容词的比较级和 *than*，再写第二个地方。句首大写，句末加句号。",
      ),
      typedGenerator("sentence", t("Write a sentence from the notes.", "根据笔记写一个句子。"), comparisonTypedBank, comparisonWhy),
    ),
    point(
      "most",
      t("Writing the superlative", "写出最高级"),
      t(
        "To say a place is more than all the others, use *the* and the superlative, then where: *The market is the busiest in our town.* Short words add *-est*; long words take *most*; *good* and *bad* become *best* and *worst*.",
        "说一个地方在所有地方中“最……”，用 *the* 加最高级，再说范围：*The market is the busiest in our town.* 短词加 *-est*；长词前加 *most*；*good* 和 *bad* 变成 *best* 和 *worst*。别忘了 *the*。",
      ),
      typedGenerator(
        "sentence-pattern",
        t("Write a sentence from the notes.", "根据笔记写一个句子。"),
        superlativeTypedBank,
        (right, shown) => {
          const adjective = shown.split(" / ")[1] ?? "";
          const form = adjectives.find(([a]) => a === adjective)?.[2] ?? "";
          const rule = compareRule(adjective, form, true);
          return t(
            `The place goes beyond all the others in its area, so it takes *the* and the superlative, then where; ${rule.en}: ${right}`,
            `这个地方在所有地方中“最……”，所以用 *the* 加最高级，再说范围；${rule["zh-CN"]}：${right}`,
          );
        },
      ),
    ),
  ],
};

// Describing a place.

const placeBank: readonly WritingItem[] = [
  {
    task: "Describe your neighborhood for a new classmate.",
    model:
      "I live in a quiet neighborhood in the north of the city. There are tall buildings and a small park with a playground. There is a bakery on the corner, and it sells great bread. The streets are clean and safe. It is quieter than the city center, but it is not boring. I like living here.",
  },
  {
    task: "Describe a village you know.",
    model:
      "My grandparents live in a small village in the mountains. It is two hours from my city by bus. There are about fifty houses, a shop and an old school. There is a river near the village, and the water is very clean. The village is peaceful and pretty. In summer it is cooler than the city.",
  },
  {
    task: "Describe a market in your town.",
    model:
      "There is a big market in the center of my town. It is open every morning. You can buy fruit, vegetables, fish and meat there. There are also some small cafes. The market is always noisy and crowded, but the food is fresh and cheap. It is the busiest place in our town on Saturdays.",
  },
  {
    task: "Describe a park near your home.",
    model:
      "There is a park near my home, next to the river. It has a lake, lots of trees and a playground for children. There is also a small cafe. In the morning, old people do exercises there. The park is green and peaceful. It is my favorite place to read on Sundays.",
  },
  {
    task: "Describe your street.",
    model:
      "I live on Green Street. It is a long street near the station. There are shops, two cafes and a pharmacy. There are many cars, so it is quite noisy in the day. At night it is quieter. My neighbors are friendly and helpful. I think it is a good street to live on.",
  },
  {
    task: "Describe a famous place in your country.",
    model:
      "The Great Wall is in the north of China. It is very long, and it goes over many mountains. There are old towers along the wall. Every year, millions of people visit it. It is very crowded on holidays, so it is better to go early. The view from the top is beautiful.",
  },
  {
    task: "Describe your school for a visitor.",
    model:
      "My school is in the east of the city, near a big park. It has three buildings, a library and a sports field. There is also a new playground. The classrooms are big and modern. The library is the quietest place in the school. I think it is a good school.",
  },
  {
    task: "Describe a square in a town you know.",
    model:
      "There is a beautiful square in the center of my town. In the middle there is a fountain, and children play near it. There are cafes and a bakery around the square. On Sunday evenings, people dance there. The square is crowded at the weekend, but it is safe and friendly.",
  },
  {
    task: "Describe the area where your grandparents live.",
    model:
      "My grandparents live in a small town by the sea. Their house is near the beach. There is a fish market, a church and a few small shops. The streets are narrow and old. The town is much quieter than my city. I love the sound of the sea at night.",
  },
  {
    task: "Describe a beach you have been to.",
    model:
      "Last summer I went to a beach in the south of the island. It is twenty minutes from the town by bus. The sand is white, and the water is very blue. There are a few cafes and a small shop. In the morning it is empty and peaceful. In the afternoon it is more crowded.",
  },
  {
    task: "Describe a shopping street in your city.",
    model:
      "The busiest shopping street in my city is near the main station. It is very long. There are big shops, restaurants and cinemas on both sides. At night there are lights everywhere. It is exciting, but it is very crowded and noisy. I like going there with my friends.",
  },
  {
    task: "Describe a quiet place where you like to go.",
    model:
      "My favorite quiet place is the library in my neighborhood. It is on the second floor of an old building next to the bank. There are thousands of books and big windows. There is a small garden behind it. It is more peaceful than my home. I go there to study after school.",
  },
];

const describingAPlace = judgedTopic({
  id: "writing-a-description-of-a-place",
  title: t("Describing a Place", "描述一个地方"),
  summary: t(
    "Write six to eight sentences about your neighborhood or a place the task names: where it is, what is there and what it is like.",
    "用六到八句话描述你的街区或题目给出的地方：它在哪里、那里有什么、它是什么样的。",
  ),
  prerequisites: ["writing-comparisons", "writing-about-a-room"],
  encompasses: [
    { topic: "writing-comparisons", weight: 0.3 },
    { topic: "writing-about-a-room", weight: 0.3 },
  ],
  criteria: ["a2-place-where", "a2-place-what", "a2-place-like", "a1-sentences"],
  point: {
    id: "place",
    title: t("Where, what is there and what it is like", "在哪里、有什么、什么样"),
    explanation: t(
      "A description of a place answers three questions:\n\n- Where is it? *It is in the north of the city, near the river.*\n- What is there? Use *there is* and *there are*: *There is a bakery. There are two cafes.*\n- What is it like? Use adjectives and a comparison: *It is peaceful. It is quieter than the city center.*\n\nYou can end with what you think of it: *I like living here.*",
      "描述一个地方要回答三个问题：\n\n- 它在哪里？*It is in the north of the city, near the river.*\n- 那里有什么？用 *there is* 和 *there are*：*There is a bakery. There are two cafes.*（不要说 *It has a bakery* 来代替所有的“有”）\n- 它是什么样的？用形容词和比较句：*It is peaceful. It is quieter than the city center.*\n\n最后可以说说你的看法：*I like living here.*",
    ),
  },
  question: t(
    "Write six to eight sentences in English about the place the task names: where it is, what is there and what it is like.",
    "根据题目用英语写六到八句话，描述这个地方：它在哪里、那里有什么、它是什么样的。",
  ),
  bank: placeBank,
  limits: { minWords: 40, maxChars: 900 },
  what: t("description", "描述"),
});

/** topics are the topics of the unit Neighbors and Community. */
export const topics: readonly TopicDef[] = [
  neighborhood.topic,
  helping.topic,
  people.topic,
  describing.topic,
  pronouns.topic,
  possessivePronouns,
  writingComparisons,
  describingAPlace,
];

/** vocabulary are the words the unit Neighbors and Community teaches. */
export const vocabulary: readonly WordBatch[] = [neighborhood.batch, helping.batch, people.batch, describing.batch, pronouns.batch];
