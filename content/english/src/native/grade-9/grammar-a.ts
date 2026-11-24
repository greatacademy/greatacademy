// Grade 9: grammar of the first units: the kinds of phrases, the three kinds of dependent clauses, complements and
// objects, elliptical clauses and possessives before gerunds.

import type { TopicDef } from "@ga/content";
import { everyPair } from "../../levels/words.ts";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

const join = (lines: readonly string[]) => lines.join("\n");
const upper = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** heroes are a name, an appositive, a verb with a prepositional phrase, a participial phrase, a gerund phrase with what it did, and an infinitive phrase. */
const heroes = [
  [
    "Odysseus",
    "the king of Ithaca",
    "sailed",
    "across the wine-dark sea",
    "tied to the mast",
    "escaping the Cyclops",
    "took great cunning",
    "to see his home again",
  ],
  [
    "Penelope",
    "his patient wife",
    "waited",
    "in the great hall",
    "weaving by day",
    "unpicking the cloth",
    "fooled the suitors",
    "to keep the suitors away",
  ],
  [
    "Achilles",
    "the greatest Greek warrior",
    "sulked",
    "inside his tent",
    "angered by the king",
    "fighting the Trojans",
    "made him famous",
    "to win eternal glory",
  ],
  [
    "Hector",
    "the prince of Troy",
    "stood",
    "before the city gates",
    "dressed in shining bronze",
    "defending the city",
    "was his whole duty",
    "to protect his family",
  ],
  [
    "Perseus",
    "the son of Zeus",
    "flew",
    "over the dark ocean",
    "holding a polished shield",
    "cutting off Medusa's head",
    "saved his mother",
    "to rescue his mother",
  ],
  [
    "Theseus",
    "the prince of Athens",
    "crept",
    "through the twisting maze",
    "carrying a ball of thread",
    "finding the way out",
    "seemed impossible",
    "to defeat the Minotaur",
  ],
  [
    "Jason",
    "the leader of the Argonauts",
    "rowed",
    "toward the edge of the world",
    "guided by Medea",
    "winning the golden fleece",
    "became his goal",
    "to claim his father's throne",
  ],
  [
    "Orpheus",
    "the famous musician",
    "walked",
    "into the underworld",
    "playing his lyre",
    "looking back at Eurydice",
    "cost him everything",
    "to bring his wife back",
  ],
  [
    "Atalanta",
    "the swift huntress",
    "raced",
    "across the open field",
    "chasing the golden apples",
    "losing the race",
    "surprised everyone",
    "to keep her freedom",
  ],
  [
    "Hercules",
    "the strongest man alive",
    "traveled",
    "to the ends of the earth",
    "wearing a lion's skin",
    "cleaning the stables",
    "took only one day",
    "to finish his twelve labors",
  ],
  [
    "Icarus",
    "the son of Daedalus",
    "soared",
    "toward the blazing sun",
    "laughing with joy",
    "flying too high",
    "melted the wax",
    "to touch the sky",
  ],
  [
    "Arachne",
    "the proud weaver",
    "worked",
    "at her wooden loom",
    "boasting of her skill",
    "challenging the goddess",
    "was a terrible mistake",
    "to prove her skill",
  ],
] as const;
const phraseNameLines = join(
  heroes.flatMap(([name, app, verb, prep, part, ger, gerPred, inf]) => [
    `${name} ${verb} **${prep}**.|prepositional`,
    `**${upper(prep)}**, ${name} ${verb} alone.|prepositional`,
    `${name}, **${app}**, ${verb} ${prep}.|appositive`,
    `We read about ${name}, **${app}**.|appositive`,
    `**${upper(part)}**, ${name} ${verb} ${prep}.|participial`,
    `${name}, **${part}**, ${verb} ${prep}.|participial`,
    `**${upper(ger)}** ${gerPred}.|gerund`,
    `${name} never forgot **${ger}**.|gerund`,
    `${name} longed **${inf}**.|infinitive`,
    `**${upper(inf)}** was ${name}'s only wish.|infinitive`,
  ]),
);
const phraseJobLines = join(
  heroes.flatMap(([name, , verb, prep, part, ger, gerPred, inf]) => [
    `**${upper(ger)}** ${gerPred}.|noun`,
    `${name} never forgot **${ger}**.|noun`,
    `**${upper(inf)}** was ${name}'s only wish.|noun`,
    `**${upper(part)}**, ${name} ${verb} ${prep}.|adjective`,
    `${name}, **${part}**, ${verb} ${prep}.|adjective`,
    `${name} ${verb} **${prep}**.|adverb`,
    `${name} ${verb} ${prep} **${inf}**.|adverb`,
  ]),
);

// Crossed items: frames, people and phrases multiply the lines below into a hundred items or more for each bank.

/** wonders are noun clauses that can do any job a noun does. */
const wonders = [
  "what she found",
  "why the bridge fell",
  "where the treasure was hidden",
  "whether the plan would work",
  "how the fire started",
  "who wrote the letter",
  "when the ship would return",
  "which road led home",
] as const;
const nounJobs = [
  ["subject", ["*{C}* surprised everyone.", "*{C}* remains a mystery.", "*{C}* was the main question."]],
  ["direct object", ["We wondered *{c}*.", "Nobody knew *{c}*.", "The detective asked *{c}*."]],
  ["object of a preposition", ["We argued about *{c}*.", "They talked about *{c}*.", "Everyone was curious about *{c}*."]],
  ["subject complement", ["The real question is *{c}*.", "The puzzle was *{c}*.", "The mystery is *{c}*."]],
] as const;
const nounJobLines = join(
  nounJobs.flatMap(([job, frames]) =>
    everyPair(wonders, frames).map(
      ([clause, frame]) => `${frame.replace("{C}", upper(clause)).replace("{c}", clause).replaceAll("*", "**")}|${job}`,
    ),
  ),
);
const clauseWho = ["The girl", "The sailor", "The farmer", "The poet", "The stranger", "The doctor"] as const;
const clauseWhoDid = [
  "who found the map",
  "who lived by the sea",
  "whom we met in Rome",
  "who saved the child",
  "whose dog ran away",
] as const;
const clauseWhoEnd = ["became famous", "left at dawn", "told us a story", "never came back", "waved goodbye"] as const;
const adverbial = [
  "Although the sea was rough",
  "When the storm passed",
  "Because the road was closed",
  "If the river rises",
  "After the guests left",
  "Before the sun rose",
] as const;
const adverbMain = [
  ["they set sail", "they will set sail"],
  ["the town was quiet", "the town will be quiet"],
  ["we waited at the inn", "we will wait at the inn"],
  ["the farmers worked", "the farmers will work"],
  ["the dogs barked", "the dogs will bark"],
] as const;
const knowFrames = ["I know", "She asked", "They remembered", "We learned", "He forgot", "Nobody guessed"] as const;
const dependentLines = join([
  ...everyPair(knowFrames, wonders).map(([frame, clause]) => `${frame} **${clause}**.|noun clause`),
  ...everyPair(clauseWho, clauseWhoDid).map(([who, did], k) => `${who} **${did}** ${clauseWhoEnd[k % 5]}.|adjective clause`),
  ...everyPair(adverbial, adverbMain).map(([opener, [past, future]]) => {
    const main = opener.startsWith("If") ? future : past;
    return `**${opener}**, ${main}.|adverb clause`;
  }),
]);

/** honored are people who can be named in each sentence pattern; roles are what they become or are called. */
const honored = ["knight", "sailor", "farmer", "teacher", "poet", "captain"] as const;
const doVerbs = ["praised", "thanked", "crowned"] as const;
const ioThings = ["a sword", "a medal", "a letter"] as const;
const scVerbs = ["became", "remained", "was"] as const;
const ocVerbs = ["called", "named", "elected"] as const;
const roleNames = ["a hero", "the leader", "a legend"] as const;
const complementLines = join([
  ...everyPair(honored, doVerbs).map(([who, verb]) => `The queen ${verb} **the ${who}**.|direct object`),
  ...everyPair(honored, ioThings).map(([who, thing]) => `She gave **the ${who}** ${thing}.|indirect object`),
  ...everyPair(honored, scVerbs).map(([who, verb], k) => `The ${who} ${verb} **${roleNames[k % 3]}**.|subject complement`),
  ...everyPair(honored, ocVerbs).map(([who, verb], k) => `The people ${verb} the ${who} **${roleNames[(k + 1) % 3]}**.|object complement`),
]);
/** verbUses are a verb used transitively, intransitively and as a linking verb, each with a person as subject. */
const verbUses = [
  ["{S} **grew** tomatoes on the balcony.", "{S} **grew** two inches that summer.", "{S} **grew** tired of waiting."],
  ["{S} **turned** the key slowly.", "{S} **turned** and walked away.", "{S} **turned** pale at the news."],
  ["{S} **felt** the cold wind on her face.", "{S} **felt** around in the dark for the switch.", "{S} **felt** nervous before the test."],
  ["{S} **got** a letter from home.", "{S} **got** up early.", "{S} **got** angry at the referee."],
] as const;
const verbPeople = ["Maya", "Leo", "My aunt", "The old farmer", "Grandma", "The coach"] as const;
const verbKindLines = join(
  everyPair(verbUses, verbPeople).flatMap(([[t, i, l], who]) => [
    `${t.replace("{S}", who)}|transitive`,
    `${i.replace("{S}", who)}|intransitive`,
    `${l.replace("{S}", who)}|linking`,
  ]),
);

/** compared are pronoun sets for comparisons; comparisons are sentences that end in a comparison. */
const compared = [
  ["I", "me", "myself"],
  ["he", "him", "himself"],
  ["she", "her", "herself"],
  ["we", "us", "ourselves"],
  ["they", "them", "themselves"],
] as const;
const comparisons = [
  "My cousin is older than ___.",
  "Nobody sings as loudly as ___.",
  "The twins are taller than ___.",
  "Our neighbors have lived here longer than ___.",
  "No one in the class reads faster than ___.",
  "The new player is as quick as ___.",
  "Few people work harder than ___.",
  "My sister swims better than ___.",
  "The coach arrived earlier than ___.",
  "Nobody laughed as hard as ___.",
  "The other team trained longer than ___.",
  "Ana writes more neatly than ___.",
  "His brother is not as patient as ___.",
  "The guests stayed later than ___.",
  "Leo is just as curious as ___.",
  "The dog was more frightened than ___.",
] as const;
const comparisonLines = join(
  everyPair(comparisons, compared).map(([frame, [subject, object, self]]) => `${frame}|${subject}|${object}|${self}`),
);
/** ellipticals are an -ing phrase, the noun in it, and what the person did meanwhile. */
const ellipticals = [
  ["waiting for the bus", "the bus", "read a novel"],
  ["walking through the park", "the park", "heard a woodpecker"],
  ["cooking dinner", "dinner", "listened to the radio"],
  ["cleaning the garage", "the garage", "found an old bike"],
  ["crossing the bridge", "the bridge", "saw a heron"],
  ["painting the fence", "the fence", "hummed a song"],
  ["riding the train", "the train", "wrote a letter"],
  ["reading the map", "the map", "noticed a mistake"],
  ["climbing the hill", "the hill", "stopped to rest"],
  ["washing the dishes", "the dishes", "planned the trip"],
  ["fixing the radio", "the radio", "lost a screw"],
  ["watching the game", "the game", "ate a sandwich"],
] as const;
const ellipsisWho = [
  ["she", "was"],
  ["he", "was"],
  ["they", "were"],
] as const;
const leftOutLines = join(
  everyPair(ellipticals, ellipsisWho).flatMap(([[ing, noun, did], [who, be]], k) => [
    `${k % 2 === 0 ? "While" : "When"} [ ] ${ing}, ${who} ${did}.|${who} ${be}|${noun} was|${who} had`,
    `${upper(who)} ${did} while [ ] ${ing}.|${who} ${be}|${noun} was|${who} had`,
  ]),
);

/** owners are possessive, object and subject forms of a person before a gerund. */
const owners = [
  ["his", "him", "he"],
  ["their", "them", "they"],
  ["my", "me", "I"],
  ["our", "us", "we"],
  ["your", "you", "yours"],
  ["Ana's", "Ana", "Anas"],
  ["the dog's", "the dog", "the dogs"],
] as const;
const gerundFrames = [
  "We were surprised by ___ leaving so early.",
  "Nobody minded ___ singing in the hall.",
  "The coach praised ___ running in the rain.",
  "I was proud of ___ winning the prize.",
  "Mom worried about ___ swimming alone.",
  "The teacher noticed ___ arriving late again.",
  "They laughed at ___ dancing on the table.",
  "Everyone talked about ___ moving to Lima.",
  "The neighbors complained about ___ barking at night.",
  "Grandpa loved ___ visiting on Sundays.",
  "The class cheered ___ finishing the race.",
  "I appreciate ___ helping with the dishes.",
] as const;
const possessiveLines = join(
  everyPair(gerundFrames, owners)
    .filter(([frame, [own]]) => !(frame.includes("barking") !== own.includes("dog")))
    .map(([frame, [own, object, subject]]) => `${frame}|${own}|${object}|${subject}`),
);
const possessiveMore = join(
  everyPair(
    gerundFrames.filter((f) => !f.includes("barking")),
    owners.filter(([own]) => !own.includes("dog")),
  )
    .filter((_, k) => k % 3 === 0)
    .map(([frame, [own, object, subject]]) => `${frame.replace("___", "___ constant")}|${own}|${object}|${subject}`),
);
const watchers = [
  ["his", "him", "he"],
  ["their", "them", "they"],
  ["our", "us", "we"],
  ["my", "me", "I"],
  ["your", "you", "yours"],
] as const;
const gerundUses = [
  "I dislike ___ shouting.",
  "We enjoyed ___ singing at the concert.",
  "Nobody approved of ___ cheating.",
  "She was annoyed by ___ whistling.",
  "The judges admired ___ dancing.",
  "Dad tolerated ___ drumming.",
  "The class welcomed ___ joining the team.",
  "I was amazed at ___ painting.",
] as const;
const participleUses = [
  "I saw ___ shouting at the referee.",
  "We heard ___ singing in the next room.",
  "She caught ___ cheating on the quiz.",
  "They watched ___ dancing on the stage.",
  "I noticed ___ whistling down the street.",
  "We found ___ sleeping under a tree.",
  "The guard spotted ___ climbing the wall.",
  "She heard ___ laughing in the hall.",
] as const;
const gerundOrParticiple = join([
  ...everyPair(gerundUses, watchers).map(([frame, [own, object, subject]]) => `${frame}|${own}|${object}|${subject}`),
  ...everyPair(participleUses, watchers).map(([frame, [own, object, subject]]) => `${frame}|${object}|${own}|${subject}`),
]);

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const phraseLabels: Readonly<Record<string, Label>> = {
  prepositional: L(
    "介词短语",
    "It begins with a preposition such as *in*, *across* or *beneath* and ends with its object, a noun or a pronoun.\n\n**Check.** Spot the opening preposition (*in*, *across*, *over*, *under*, *beneath*, *of*, *at*) followed by its noun object—no verb form leads the phrase.",
    "它以 *in*、*across* 或 *beneath* 这样的介词开头，以介词的宾语（名词或代词）结尾。\n\n**检验。** 认出句首的介词及其后的名词宾语——短语不以动词形式开头。",
    "A prepositional phrase begins with a preposition and ends with its object, and this phrase does not.",
    "介词短语以介词开头、以介词宾语结尾，而这个短语不是这样。",
  ),
  appositive: L(
    "同位语短语",
    "It is a noun phrase set beside another noun to rename it, telling us who or what that noun is.\n\n**Check.** Replace the noun right before it with this phrase: because it renames that noun directly, it is an appositive.",
    "它是放在另一个名词旁边的名词短语，给那个名词换一个说法，告诉我们它是谁或是什么。\n\n**检验。** 用这个短语直接替换前面的名词：它与前面的名词指代同一对象，正是同位语。",
    "An appositive renames the noun beside it, and this phrase does not rename a noun.",
    "同位语给旁边的名词换一个说法，而这个短语并没有重新指称一个名词。",
  ),
  participial: L(
    "分词短语",
    "It begins with a participle, an *-ing* or *-ed* form or one such as *broken*, and the whole phrase describes a noun.\n\n**Check.** Try deleting the bold phrase: the main sentence still stays grammatically complete, proving it modifies a noun rather than acting as a noun.",
    "它以分词开头（*-ing*、*-ed* 形式或 *broken* 这样的形式），整个短语描述一个名词。\n\n**检验。** 试着把粗体短语删掉：主句语法依然完整，说明它在修饰名词，而非充当名词。",
    "A participial phrase describes a noun, and this phrase does not.",
    "分词短语描述名词，而这个短语没有描述名词。",
  ),
  gerund: L(
    "动名词短语",
    "It begins with an *-ing* word and the whole phrase does a noun's job, as the subject or an object of the sentence.\n\n**Check.** Replace the entire *-ing* phrase with *it*: the sentence still works grammatically, confirming it is a gerund phrase.",
    "它以 *-ing* 词开头，整个短语起名词的作用，作句子的主语或宾语。\n\n**检验。** 把整个 *-ing* 短语换成 *it*：句子语法依然成立，确认它是动名词短语。",
    "A gerund phrase names an activity and does a noun's job, and this phrase does not.",
    "动名词短语指一种活动、起名词作用，而这个短语不是。",
  ),
  infinitive: L(
    "不定式短语",
    "It begins with *to* and the base form of a verb, as in *to cross the river*.\n\n**Check.** Look at the word right after *to*: it is a base verb (not a noun), confirming an infinitive phrase rather than a prepositional phrase.",
    "它以 *to* 加动词原形开头，如 *to cross the river*。\n\n**检验。** 看 *to* 后面的词：是动词原形而非名词，确认它是不定式短语而非介词短语。",
    "An infinitive phrase begins with *to* and a verb, and this phrase does not.",
    "不定式短语以 *to* 加动词开头，而这个短语不是。",
  ),
};

const jobLabels: Readonly<Record<string, Label>> = {
  noun: L(
    "名词",
    "The phrase does a noun's job: it is the subject, an object or a complement, and you could replace it with *it* or *something*.\n\n**Check.** Swap the bold phrase for *something*: the sentence remains grammatical, proving it fills a noun slot.",
    "这个短语起名词的作用：作主语、宾语或补语，可以用 *it* 或 *something* 替换。\n\n**检验。** 把粗体短语换成 *something*：句子语法依然完整，说明它充当名词成分。",
    "The phrase cannot be replaced by *it* or *something*, so it is not doing a noun's job.",
    "这个短语不能用 *it* 或 *something* 替换，所以不是在起名词的作用。",
  ),
  adjective: L(
    "形容词",
    "The phrase describes a noun, telling which one or what kind, as an adjective would.\n\n**Check.** Ask *which one?* or *what kind?* about a noun in the sentence: the bold phrase answers directly about that noun.",
    "这个短语描述一个名词，说明是哪一个或哪一种，就像形容词一样。\n\n**检验。** 对句中的某个名词提问“哪一个？”或“什么样的？”：粗体短语正是直接修饰这个名词。",
    "The phrase does not describe a noun here.",
    "这里的短语没有描述名词。",
  ),
  adverb: L(
    "副词",
    "The phrase tells how, when, where or why about the verb, as an adverb would.\n\n**Check.** Ask *how?*, *when?*, *where?*, or *why?* about the main verb: the bold phrase modifies that action.",
    "这个短语说明动作的方式、时间、地点或原因，就像副词一样。\n\n**检验。** 对主句动词提问“怎样？”“何时？”“何地？”或“为何？”：粗体短语正是修饰这个动作。",
    "The phrase does not tell how, when, where or why about the verb.",
    "这个短语并没有说明动作的方式、时间、地点或原因。",
  ),
};

const phrases = topic("grammar", {
  id: "kinds-of-phrases",
  title: ["Kinds of Phrases", "短语的种类"],
  summary: [
    "Prepositional, appositive, participial, gerund and infinitive phrases, and the job each does in a sentence: noun, adjective or adverb.",
    "介词短语、同位语短语、分词短语、动名词短语和不定式短语，以及每种短语在句中的作用：名词、形容词或副词。",
  ],
  intro: [
    "In *Running across the square, Maya wanted to catch the bus*, three different phrases stack into one sentence without a single extra clause. Recognizing each phrase's form—and whether it works as a noun, adjective, or adverb—unlocks how complex sentences are built.",
    "在 *Running across the square, Maya wanted to catch the bus* 这句话里，三种不同的短语叠在一起却没有多加一个从句。分清短语的形态，以及它在句中作名词、形容词还是副词，就能看透复杂句的构造。",
  ],
  after: ["phrases-and-clauses", "gerund-and-infinitive-phrases"],
  points: [
    label(
      "naming-the-phrase",
      ["Naming the Phrase", "辨认短语的种类"],
      [
        "A **phrase** is a group of words without its own subject and verb. Name it by the word it begins with. A **prepositional** phrase begins with a preposition: *across the dark sea*. An **appositive** phrase renames a noun: *Odysseus, **the king of Ithaca***. A **participial** phrase begins with a participle and describes a noun: ***Tied to the mast**, he heard the song.* A **gerund** phrase begins with an *-ing* word and acts as a noun: ***Escaping the giant** took cunning.* An **infinitive** phrase begins with *to* and a verb: *He longed **to see his home**.*\n\n> **Watch out.** Do not confuse a **gerund** phrase with a **participial** phrase just because both can start with *-ing*—test whether you can replace the whole phrase with *it* (gerund) or drop it as a modifier (participial).",
        "**短语**是一组没有自己主语和谓语的词。根据开头的词来辨认它。**介词短语**以介词开头：*across the dark sea*。**同位语短语**给名词换一个说法：*Odysseus, **the king of Ithaca***。**分词短语**以分词开头，描述名词：***Tied to the mast**, he heard the song.* **动名词短语**以 *-ing* 词开头，起名词作用：***Escaping the giant** took cunning.* **不定式短语**以 *to* 加动词开头：*He longed **to see his home**.*\n\n> **注意。** 别因为都以 *-ing* 开头就把**动名词短语**和**分词短语**混为一谈——试试把整个短语换成 *it*（能换的是动名词），或者删掉看主句是否仍完整（可删去的是分词修饰语）。",
      ],
      ["What kind of phrase is in bold?", "粗体部分是哪种短语？"],
      `
${phraseNameLines}
        The ship sailed **across the wine-dark sea**.|prepositional
        Odysseus, **the king of Ithaca**, longed for home.|appositive
        **Tied to the mast**, he listened to the Sirens.|participial
        **Escaping the Cyclops** took great cunning.|gerund
        He wanted **to see his wife again**.|infinitive
        The hero hid **beneath the belly of a ram**.|prepositional
        Penelope, **his faithful wife**, waited twenty years.|appositive
        The suitors, **feasting in the hall**, ignored the beggar.|participial
        **Weaving and unweaving the shroud** kept the suitors away.|gerund
        Athena came down **to help the young prince**.|infinitive
        The bard sang **of ancient wars**.|prepositional
        Beowulf, **a warrior from across the sea**, came to the hall.|appositive
        **Wounded by the hero**, the monster fled into the marsh.|participial
        The king's dream was **ruling a peaceful land**.|gerund
        No one dared **to enter the dragon's cave**.|infinitive
        The sword lay **at the bottom of the lake**.|prepositional
        Gilgamesh, **the great king of Uruk**, feared death.|appositive
        **Hearing the war horn**, the villagers ran for the gates.|participial
        **Keeping a promise** mattered more to him than gold.|gerund
        Her plan was **to cross the mountains by night**.|infinitive
        The goddess appeared **in the shape of an old woman**.|prepositional
        Hector, **the eldest son of Priam**, defended Troy.|appositive
        The soldiers, **hidden inside the wooden horse**, waited for dark.|participial
        She was praised for **saving the city from the flood**.|gerund
        The young knight swore **to guard the bridge**.|infinitive
        The travelers rested **under an old olive tree**.|prepositional
        Achilles, **the fastest of the Greeks**, refused to fight.|appositive
        **Exhausted by the long voyage**, the crew slept on the beach.|participial
        **Telling the old stories** keeps them alive.|gerund
        The hero returned **to claim his throne**.|infinitive
        The shield hung **above the king's chair**.|prepositional
        Mulan, **a girl in her father's armor**, rode to war.|appositive
      `,
      phraseLabels,
    ),
    label(
      "what-job-the-phrase-does",
      ["What Job the Phrase Does", "短语起什么作用"],
      [
        "Every phrase works in the sentence as one part of speech. It works as a **noun** if it is the subject, an object or a complement: you could put *it* or *something* in its place (***To win the race** was her goal*). It works as an **adjective** if it describes a noun (*the house **on the hill***). It works as an **adverb** if it tells how, when, where or why about the verb (*She trained **to win the race***).\n\nThe same kind of phrase can do different jobs: an infinitive phrase can be a noun, an adjective or an adverb.\n\n> **Watch out.** Do not guess the job from the phrase type—*to win* is a noun in ***To win** was her goal*, an adjective in *the will **to win***, and an adverb in *She trained **to win***.",
        "每个短语在句中都起某一种词类的作用。如果它作主语、宾语或补语，可以用 *it* 或 *something* 替换（***To win the race** was her goal*），它就起**名词**作用。如果它描述名词（*the house **on the hill***），就起**形容词**作用。如果它说明动作的方式、时间、地点或原因（*She trained **to win the race***），就起**副词**作用。\n\n同一种短语可以起不同的作用：不定式短语可以作名词、形容词或副词。\n\n> **注意。** 不要只凭短语种类猜它的语法作用——同一个 *to win* 在 ***To win** was her goal* 中作名词，在 *the will **to win*** 中作形容词，在 *She trained **to win*** 中作副词。",
      ],
      ["What job does the phrase in bold do in the sentence?", "粗体短语在句中起什么作用？"],
      `
${phraseJobLines}
        **To win the race** was her only goal.|noun
        She trained every morning **to win the race**.|adverb
        She had no time **to win the race**.|adjective
        The house **on the hill** belongs to the mayor.|adjective
        The children ran **up the hill**.|adverb
        **Climbing the hill** tired the old horse.|noun
        The girl **holding the lantern** led the way.|adjective
        He was proud of **finishing the climb**.|noun
        We left early **to catch the ferry**.|adverb
        The best way **to learn a language** is to use it.|adjective
        He hoped **to find work in the city**.|noun
        The letter **from her brother** arrived on Monday.|adjective
        She hid the key **under the doormat**.|adverb
        **Reading old letters** made her sad.|noun
        The man **in the gray coat** is a detective.|adjective
        The bus stopped **in front of the library**.|adverb
        They decided **to sell the farm**.|noun
        That is a story **to remember**.|adjective
        He saved money **to buy a bicycle**.|adverb
        Her hobby is **collecting old maps**.|noun
        The road **through the forest** was closed.|adjective
        We waited **for an hour**.|adverb
        The decision **to close the school** angered parents.|adjective
        **To forgive an enemy** takes courage.|noun
        She spoke **with great care**.|adverb
        The boy **sitting by the window** is new.|adjective
        He enjoys **swimming in the lake**.|noun
        They arrived **after the storm**.|adverb
        The painting **above the fireplace** is very old.|adjective
        I came here **to ask for your help**.|adverb
        The hardest part was **saying goodbye**.|noun
        She needs someone **to talk to**.|adjective
      `,
      jobLabels,
    ),
  ],
});

const clauseLabels: Readonly<Record<string, Label>> = {
  "noun clause": L(
    "名词从句",
    "The clause does a noun's job: it is the subject, an object or a complement, and you could replace it with *it* or *something*.\n\n**Check.** Substitute *something* for the entire bold clause: the sentence still reads cleanly, confirming it is a noun clause.",
    "这个从句起名词的作用：作主语、宾语或补语，可以用 *it* 或 *something* 替换。\n\n**检验。** 把整个粗体从句换成 *something*：句子依然通顺完整，确认它是名词从句。",
    "The clause cannot be replaced by *it* or *something*, so it is not a noun clause.",
    "这个从句不能用 *it* 或 *something* 替换，所以不是名词从句。",
  ),
  "adjective clause": L(
    "形容词从句",
    "The clause comes after a noun and describes it, usually beginning with *who*, *whom*, *whose*, *which* or *that*.\n\n**Check.** Look at the noun sitting right before the bold clause: the clause tells *which one* about that noun.",
    "这个从句跟在名词后面描述它，通常以 *who*、*whom*、*whose*、*which* 或 *that* 开头。\n\n**检验。** 看粗体从句前面紧挨着的名词：这个从句正是限定“哪一个”该名词。",
    "The clause does not describe the noun before it, so it is not an adjective clause.",
    "这个从句没有描述前面的名词，所以不是形容词从句。",
  ),
  "adverb clause": L(
    "副词从句",
    "The clause tells when, why, how, under what condition or in spite of what the main action happens, beginning with a word such as *because*, *although*, *when* or *if*.\n\n**Check.** Try moving the bold clause to the other end of the sentence: it can shift without breaking the grammar and modifies the main verb.",
    "这个从句说明主要动作发生的时间、原因、方式、条件或让步，以 *because*、*although*、*when* 或 *if* 这样的词开头。\n\n**检验。** 试着把粗体从句移到句子另一端：它能灵活移动且修饰主句动词。",
    "The clause does not tell when, why or under what condition the main action happens.",
    "这个从句没有说明主要动作发生的时间、原因或条件。",
  ),
};

const nounClauseJobs: Readonly<Record<string, Label>> = {
  subject: L(
    "主语",
    "The noun clause comes before the main verb and is what the sentence is about: it does the verb.\n\n**Check.** Replace the bold clause with *It*: it sits right before the main verb as the sentence's subject.",
    "这个名词从句在谓语动词前面，是句子所说的对象，即动作的发出者。\n\n**检验。** 把粗体从句换成 *It*：它正好位于主句动词之前，充当主语。",
    "The noun clause does not come before the main verb as its subject.",
    "这个名词从句并不是位于谓语前面的主语。",
  ),
  "direct object": L(
    "直接宾语",
    "The noun clause comes right after an action verb such as *know*, *said* or *wonder* and answers *what?*\n\n**Check.** Replace the bold clause with *it* right after the action verb: it directly receives the verb's action.",
    "这个名词从句紧跟在 *know*、*said* 或 *wonder* 这样的行为动词后面，回答“什么？”\n\n**检验。** 把粗体从句换成 *it* 放在行为动词后面：它直接承受动词的动作。",
    "The noun clause does not answer *what?* right after an action verb.",
    "这个名词从句并不是紧跟行为动词、回答“什么？”的宾语。",
  ),
  "object of a preposition": L(
    "介词宾语",
    "The noun clause follows a preposition such as *about*, *of* or *on* and completes it.\n\n**Check.** Check the word immediately before the bold clause: it is a preposition (*about*, *of*, *to*, *at*, *by*), so the clause is its object.",
    "这个名词从句跟在 *about*、*of* 或 *on* 这样的介词后面，作介词的宾语。\n\n**检验。** 看粗体从句紧前面那个词：是介词，因此从句作介词宾语。",
    "No preposition comes right before this noun clause.",
    "这个名词从句前面没有介词。",
  ),
  "subject complement": L(
    "主语补语（表语）",
    "The noun clause follows a linking verb such as *is* or *was* and renames the subject.\n\n**Check.** Look at the verb right before the bold clause: it is a linking verb (*is/was*) equating the subject to the clause.",
    "这个名词从句跟在 *is* 或 *was* 这样的系动词后面，说明主语是什么。\n\n**检验。** 看粗体从句前面的动词：是系动词（*is/was*），把主语与从句等同起来。",
    "The noun clause does not follow a linking verb to rename the subject.",
    "这个名词从句并没有跟在系动词后面说明主语。",
  ),
};

const clauses = topic("grammar", {
  id: "noun-adjective-and-adverb-clauses",
  title: ["Noun, Adjective and Adverb Clauses", "名词从句、形容词从句和副词从句"],
  summary: [
    "The three kinds of dependent clauses, told apart by the job each does, and the jobs a noun clause can do.",
    "三种从句根据各自的作用来区分，以及名词从句可以充当的成分。",
  ],
  intro: [
    "The exact same four words—*where the key lay*—can act as a noun (*Nobody knew **where the key lay***), an adjective (*the room **where the key lay***), or an adverb (*We searched **where the key lay***). Testing a clause's *job* in the sentence always beats guessing from its first word.",
    "完全相同的四个词 *where the key lay*，既可以作名词（*Nobody knew **where the key lay***），也可以作形容词（*the room **where the key lay***），还可以作副词（*We searched **where the key lay***）。判断从句种类要看它在句中的*作用*，而不是只看开头词。",
  ],
  after: ["adjective-and-adverb-clauses", "phrases-and-clauses"],
  points: [
    label(
      "naming-the-dependent-clause",
      ["Naming the Dependent Clause", "辨认从句的种类"],
      [
        "A **dependent clause** has a subject and a verb but cannot stand alone. Name it by its job. A **noun clause** does a noun's job and could be replaced by *it* or *something*: *I know **that she lied***. An **adjective clause** follows a noun and describes it: *the girl **who found the map***. An **adverb clause** tells when, why, how or under what condition: ***Although the sea was rough**, they sailed.*\n\nThe first word alone will not tell you: *when* can begin any of the three. *I know **when she left*** (noun), *the day **when she left*** (adjective), *I cried **when she left*** (adverb).\n\n> **Watch out.** Never assume *where*, *when*, or *that* locks in one clause type—run the *something* substitution test first to catch noun clauses, then check whether the clause modifies a preceding noun (adjective) or the verb (adverb).",
        "**从句**有主语和谓语，但不能独立成句。根据它的作用来辨认。**名词从句**起名词作用，可以用 *it* 或 *something* 替换：*I know **that she lied***。**形容词从句**跟在名词后面描述它：*the girl **who found the map***。**副词从句**说明时间、原因、方式或条件：***Although the sea was rough**, they sailed.*\n\n只看第一个词并不能判断：*when* 可以引导三种从句中的任何一种。*I know **when she left***（名词），*the day **when she left***（形容词），*I cried **when she left***（副词）。\n\n> **注意。** 别以为见到 *where*、*when* 或 *that* 就能定死从句种类——先用 *something* 替换测试筛出名词从句，再看它修饰的是前面的名词（形容词从句）还是主句动词（副词从句）。",
      ],
      ["What kind of clause is in bold?", "粗体部分是哪种从句？"],
      `
${dependentLines}
        I know **that she lied**.|noun clause
        The girl **who found the map** became famous.|adjective clause
        **Although the sea was rough**, they set sail.|adverb clause
        I remember **when she left**.|noun clause
        I will never forget the day **when she left**.|adjective clause
        I cried **when she left**.|adverb clause
        **What he said** surprised everyone.|noun clause
        The book **that I borrowed** is overdue.|adjective clause
        We stayed inside **because it was raining**.|adverb clause
        She wondered **whether the bridge would hold**.|noun clause
        The town **where my mother grew up** has changed.|adjective clause
        **If the river floods**, the road will close.|adverb clause
        Nobody knows **why the ship sank**.|noun clause
        The reason **why the ship sank** is still a mystery.|adjective clause
        The crew panicked **as the ship sank**.|adverb clause
        **Whoever finishes first** wins a prize.|noun clause
        The runner **whose shoe came off** still finished.|adjective clause
        **Unless you hurry**, you will miss the train.|adverb clause
        The truth is **that we were lost**.|noun clause
        The poem, **which she wrote at twelve**, won a prize.|adjective clause
        She smiled **as though nothing had happened**.|adverb clause
        He asked **where the station was**.|noun clause
        I visited the house **where the poet was born**.|adjective clause
        **Wherever she went**, people recognized her.|adverb clause
        **That the king was dying** was kept secret.|noun clause
        The doctor **whom we called** came at once.|adjective clause
        **Once the guests had gone**, she cleaned the kitchen.|adverb clause
        We argued about **how the story should end**.|noun clause
        The painter **who lived next door** gave me lessons.|adjective clause
        He kept running **until he reached the shore**.|adverb clause
        Tell me **what you saw**.|noun clause
        The storm **that hit the coast** destroyed the pier.|adjective clause
      `,
      clauseLabels,
    ),
    label(
      "what-the-noun-clause-does",
      ["What the Noun Clause Does", "名词从句充当什么成分"],
      [
        "A noun clause can do any job a noun does. As the **subject**, it comes before the main verb: ***What she found** changed history.* As a **direct object**, it follows an action verb and answers *what?*: *They knew **that the dam would break**.* As the **object of a preposition**, it follows a word such as *about* or *of*: *We talked about **where we would live**.* As a **subject complement**, it follows a linking verb and renames the subject: *The problem is **that no one listened**.*\n\n> **Watch out.** Check the single word right *before* the noun clause—if it is a preposition (*about*, *of*, *to*, *by*), it is the **object of a preposition**; if it is a linking verb (*is*, *was*), it is a **subject complement**; if it is an action verb (*knew*, *asked*), it is a **direct object**.",
        "名词从句可以充当名词能充当的任何成分。作**主语**时，它位于谓语前面：***What she found** changed history.* 作**直接宾语**时，它跟在行为动词后面，回答“什么？”：*They knew **that the dam would break**.* 作**介词宾语**时，它跟在 *about* 或 *of* 这样的词后面：*We talked about **where we would live**.* 作**主语补语**时，它跟在系动词后面，说明主语是什么：*The problem is **that no one listened**.*\n\n> **注意。** 紧盯名词从句前面那个词——是介词（*about*、*of*、*to*、*by*）就是**介词宾语**，是系动词（*is*、*was*）就是**主语补语**，是行为动词（*knew*、*asked*）就是**直接宾语**。",
      ],
      ["What job does the noun clause in bold do?", "粗体的名词从句在句中充当什么成分？"],
      `
${nounJobLines}
        **What she found** changed history.|subject
        They knew **that the dam would break**.|direct object
        We talked about **where we would live**.|object of a preposition
        The problem is **that no one listened**.|subject complement
        **Whoever took the money** must return it.|subject
        She asked **why the shop was closed**.|direct object
        He is proud of **what his daughter achieved**.|object of a preposition
        The question was **whether anyone would help**.|subject complement
        **How the cat got onto the roof** is a mystery.|subject
        I wonder **who wrote this letter**.|direct object
        Give the prize to **whoever deserves it**.|object of a preposition
        Her fear was **that the letter would be lost**.|subject complement
        **That he survived the fall** amazed the doctors.|subject
        The guide explained **how the caves were formed**.|direct object
        We disagreed about **what the poem meant**.|object of a preposition
        The rule is **that no one leaves early**.|subject complement
        **Why she left so suddenly** puzzled her friends.|subject
        Nobody remembered **where the key was hidden**.|direct object
        They were worried about **how the news would spread**.|object of a preposition
        My hope is **that you will come back soon**.|subject complement
        **Whether the plan will work** depends on the weather.|subject
        The judge decided **that the will was valid**.|direct object
        She thought carefully about **which path to take**.|object of a preposition
        The surprise was **that the old man could still dance**.|subject complement
        **What the witness saw** contradicted the police report.|subject
        Do you know **when the train arrives**?|direct object
        He laughed at **what the clown did**.|object of a preposition
        The danger is **that the ice is too thin**.|subject complement
        **Who will be the next captain** is still undecided.|subject
        The letter revealed **that he had a brother**.|direct object
        We were surprised by **how quickly the fire spread**.|object of a preposition
        The trouble was **that nobody had a map**.|subject complement
      `,
      nounClauseJobs,
    ),
  ],
});

const complementLabels: Readonly<Record<string, Label>> = {
  "direct object": L(
    "直接宾语",
    "The word receives the action of the verb and answers *whom?* or *what?* after it.\n\n**Check.** Ask *verb + whom/what?* directly on the action verb: the bold phrase receives that action with nothing else standing between it and the verb.",
    "这个词承受动词的动作，回答动词后面的“谁？”或“什么？”\n\n**检验。** 直接对行为动词提问“动词 + 谁/什么？”：粗体部分正是直接承受该动作的对象。",
    "The word does not receive the action of the verb directly.",
    "这个词并没有直接承受动词的动作。",
  ),
  "indirect object": L(
    "间接宾语",
    "The word comes between the verb and the direct object and tells *to whom* or *for whom* the action is done.\n\n**Check.** Rewrite the sentence with *to* or *for* (*gave a sword **to the knight***): the bold phrase sits between the verb and the thing given.",
    "这个词位于动词和直接宾语之间，说明动作是对谁或为谁做的。\n\n**检验。** 试着用 *to* 或 *for* 改写句子：粗体部分夹在动词和直接宾语之间，表示接收者。",
    "The word does not tell to whom or for whom something is done, before a direct object.",
    "这个词并不是位于直接宾语前面、说明动作对象的间接宾语。",
  ),
  "subject complement": L(
    "主语补语（表语）",
    "The word follows a linking verb such as *is*, *seemed* or *became* and renames or describes the subject.\n\n**Check.** Replace the verb with `=`: the bold word describes or renames the *subject* on the left side of the verb.",
    "这个词跟在 *is*、*seemed* 或 *became* 这样的系动词后面，说明或描述主语。\n\n**检验。** 把动词看作等号 `=`：粗体词说明或描述的是动词左边的*主语*。",
    "The word does not follow a linking verb to rename or describe the subject.",
    "这个词并不是跟在系动词后面说明主语的成分。",
  ),
  "object complement": L(
    "宾语补足语",
    "The word follows the direct object and renames or describes it, with verbs such as *made*, *named*, *called* or *found*.\n\n**Check.** Put *is/was* between the direct object and the bold word: it describes or renames the *direct object*, not the subject.",
    "这个词跟在直接宾语后面，说明或描述宾语，常与 *made*、*named*、*called* 或 *found* 这样的动词搭配。\n\n**检验。** 在直接宾语和粗体词之间加上 *is/was*：粗体词说明或描述的是*直接宾语*，而不是主语。",
    "The word does not rename or describe the direct object that comes before it.",
    "这个词并没有说明或描述它前面的直接宾语。",
  ),
};

const verbKindLabels: Readonly<Record<string, Label>> = {
  transitive: L(
    "及物动词",
    "The verb has a direct object: it acts on someone or something named after it.\n\n**Check.** Ask *verb + what?* right after the bold verb: a noun phrase directly answers it as the object.",
    "这个动词带直接宾语：它作用于后面提到的人或物。\n\n**检验。** 对粗体动词提问“动词 + 什么？”：后面紧跟着一个直接承受动作的名词宾语。",
    "The verb has no direct object here, so it is not transitive in this sentence.",
    "这个动词在这里不带直接宾语，所以在本句中不是及物动词。",
  ),
  intransitive: L(
    "不及物动词",
    "The verb has no direct object; what follows, if anything, tells how, when or where, not *what*.\n\n**Check.** Look after the bold verb: there is no receiver of the action and no word renaming or describing the subject—only adverbs or prepositional phrases.",
    "这个动词不带直接宾语；后面如果有成分，说明的是方式、时间或地点，而不是“什么”。\n\n**检验。** 看粗体动词后面：既没有承受动作的宾语，也没有描述主语的词，只有状语或介词短语。",
    "The verb has an object or a complement here, so it is not intransitive.",
    "这个动词在这里带有宾语或补语，所以不是不及物动词。",
  ),
  linking: L(
    "系动词",
    "The verb joins the subject to a word that renames or describes it; you could put *is* or *was* in its place.\n\n**Check.** Substitute *was/were* for the bold verb: the sentence keeps its core meaning, proving the verb links the subject to a complement.",
    "这个动词把主语和说明或描述主语的词连接起来，可以用 *is* 或 *was* 替换。\n\n**检验。** 把粗体动词换成 *was/were*：句子基本意思不变，说明它是连接主语和表语的系动词。",
    "The verb does not join the subject to a word that describes it; it names an action.",
    "这个动词并不是把主语和描述它的词连起来，而是表示一个动作。",
  ),
};

const complements = topic("grammar", {
  id: "complements-and-objects",
  title: ["Complements and Objects", "补语与宾语"],
  summary: [
    "Direct and indirect objects, subject and object complements, and the transitive, intransitive and linking verbs that take them.",
    "直接宾语和间接宾语、主语补语和宾语补足语，以及带这些成分的及物、不及物和系动词。",
  ],
  intro: [
    "In *The villagers elected Ana mayor*, *Ana* receives the action (**direct object**) while *mayor* renames *Ana* (**object complement**). Telling objects from complements—and spotting whether a verb like *grew* is transitive, intransitive, or linking—reveals the skeleton of every clause.",
    "在 *The villagers elected Ana mayor* 中，*Ana* 承受动作（**直接宾语**），*mayor* 说明 *Ana* 的身份（**宾语补足语**）。分清宾语与补语，以及像 *grew* 这样的动词何时作及物、不及物或系动词，就能看清每个句子的骨架。",
  ],
  after: ["action-and-linking-verbs"],
  points: [
    label(
      "naming-the-complement",
      ["Naming the Complement", "辨认补语和宾语"],
      [
        "A **complement** completes the meaning of a verb. A **direct object** receives the action: *The queen crowned **the knight***. An **indirect object** comes before the direct object and tells to or for whom: *She gave **the knight** a sword.* A **subject complement** follows a linking verb and renames or describes the subject: *The knight became **a hero***. An **object complement** follows the direct object and renames or describes it: *The people called the knight **a hero***.\n\n> **Watch out.** Do not confuse two nouns after a verb: if the second noun is a *different thing* given to the first (*gave **the knight** a sword*), the first is an **indirect object**; if the second noun *renames* the first (*called the knight **a hero***), the second is an **object complement**.",
        "**补语**补充动词的意思。**直接宾语**承受动作：*The queen crowned **the knight***。**间接宾语**位于直接宾语前，说明对谁或为谁：*She gave **the knight** a sword.* **主语补语**跟在系动词后，说明或描述主语：*The knight became **a hero***。**宾语补足语**跟在直接宾语后，说明或描述宾语：*The people called the knight **a hero***。\n\n> **注意。** 动词后连着两个名词时别搞混：如果第二个名词是给第一个人的*另一件东西*（*gave **the knight** a sword*），第一个是**间接宾语**；如果第二个名词是*指代或说明*第一个（*called the knight **a hero***），第二个是**宾语补足语**。",
      ],
      ["What is the word in bold?", "粗体的词是什么成分？"],
      `
${complementLines}
        The queen crowned **the knight**.|direct object
        She gave **the knight** a sword.|indirect object
        The knight became **a hero**.|subject complement
        The people called the knight **a hero**.|object complement
        The storm sank **the ship**.|direct object
        Her uncle sent **her** a letter.|indirect object
        The soup tasted **salty**.|subject complement
        The long wait made everyone **restless**.|object complement
        The villagers elected **Ana** mayor.|direct object
        The villagers elected Ana **mayor**.|object complement
        Grandmother told **us** a story.|indirect object
        The old house seemed **empty**.|subject complement
        The jury found the man **guilty**.|object complement
        The hunter followed **the tracks**.|direct object
        The teacher showed **the class** a map.|indirect object
        My brother is **a doctor**.|subject complement
        They painted the fence **green**.|object complement
        The dog buried **the bone**.|direct object
        She bought **her sister** a scarf.|indirect object
        The night grew **cold**.|subject complement
        The king named his son **heir**.|object complement
        The poet wrote **a sonnet**.|direct object
        The guide offered **the travelers** water.|indirect object
        The answer was **wrong**.|subject complement
        The fans considered the coach **a genius**.|object complement
        The farmer sold **his horse**.|direct object
        I lent **my friend** my bicycle.|indirect object
        The milk turned **sour**.|subject complement
        The news left her **speechless**.|object complement
        The children built **a snowman**.|direct object
        The waiter brought **us** our soup.|indirect object
        Her voice sounded **tired**.|subject complement
      `,
      complementLabels,
    ),
    label(
      "transitive-intransitive-or-linking",
      ["Transitive, Intransitive or Linking", "及物、不及物还是系动词"],
      [
        "A **transitive** verb takes a direct object: *She **grew** tomatoes.* An **intransitive** verb takes none: *The tomatoes **grew** quickly* (*quickly* tells how, not what). A **linking** verb joins the subject to a word that describes it: *She **grew** tired* (you could say *she was tired*).\n\nMany verbs can be all three. Ask: is there something that receives the action (transitive), nothing after but how, when or where (intransitive), or a word describing the subject (linking)?\n\n> **Watch out.** Do not label *grew two inches* as transitive—*two inches* measures *how much*, not an object receiving an action, so *grew* there is **intransitive**; likewise, *turned pale* is **linking** because *pale* describes the subject.",
        "**及物动词**带直接宾语：*She **grew** tomatoes.* **不及物动词**不带宾语：*The tomatoes **grew** quickly*（*quickly* 说明方式，不是“什么”）。**系动词**把主语和描述主语的词连接起来：*She **grew** tired*（可以说 *she was tired*）。\n\n许多动词三种用法都有。问一问：后面有承受动作的东西吗（及物）？后面只有方式、时间或地点吗（不及物）？还是有描述主语的词（系动词）？\n\n> **注意。** 不要把 *grew two inches* 当成及物动词——*two inches* 说明长了多少，不是承受动作的宾语，因此是**不及物动词**；同理，*turned pale* 中 *pale* 描述主语，因此是**系动词**。",
      ],
      ["How is the verb in bold used in this sentence?", "粗体动词在本句中是什么用法？"],
      `
${verbKindLines}
        She **grew** tomatoes on the balcony.|transitive
        The tomatoes **grew** quickly.|intransitive
        She **grew** tired of waiting.|linking
        He **smelled** the roses.|transitive
        The roses **smelled** sweet.|linking
        The guard **turned** the key.|transitive
        The guard **turned** pale.|linking
        The wheel **turned** slowly.|intransitive
        The chef **tasted** the sauce.|transitive
        The sauce **tasted** bitter.|linking
        The baby **slept** through the night.|intransitive
        The crowd **became** silent.|linking
        The hunter **felt** the cold wind.|transitive
        The hunter **felt** afraid.|linking
        The ship **sank** in the storm.|intransitive
        The storm **sank** the ship.|transitive
        The singer **appeared** nervous.|linking
        A light **appeared** in the window.|intransitive
        She **kept** the letter for years.|transitive
        She **kept** calm during the fire.|linking
        The children **laughed** at the clown.|intransitive
        He **looked** the stranger in the eye.|transitive
        He **looked** worried.|linking
        The old man **looked** out of the window.|intransitive
        The river **ran** through the valley.|intransitive
        She **ran** the bakery for twenty years.|transitive
        The well **ran** dry.|linking
        The bell **sounded** at noon.|intransitive
        The plan **sounded** reasonable.|linking
        The guard **sounded** the alarm.|transitive
        The leaves **fell** silently.|intransitive
        The prince **remained** loyal to his father.|linking
      `,
      verbKindLabels,
    ),
  ],
});

const elliptical = topic("grammar", {
  id: "elliptical-clauses",
  title: ["Elliptical Clauses", "省略从句"],
  summary: [
    "Clauses with words left out, such as *than I [am]*: finding the missing words and choosing the pronoun that fits them.",
    "省略了词语的从句，如 *than I [am]*：找出省略的部分，选出与之相符的代词。",
  ],
  intro: [
    "Saying *'My neighbor trusts Maya more than I'* means *more than I trust Maya*, whereas *'more than me'* means *more than my neighbor trusts me*. Mentally restoring the omitted words in an **elliptical clause** locks in both pronoun case and meaning.",
    "说 *My neighbor trusts Maya more than I* 意思是“比我信任 Maya 更信任她”，而 *more than me* 则是“比信任我更信任她”。在心里把**省略从句**中省去的词补完整，代词的格和句意就一清二楚。",
  ],
  after: ["pronoun-case", "complete-comparisons"],
  points: [
    choose(
      "the-pronoun-in-a-comparison",
      ["The Pronoun in a Comparison", "比较句中的代词"],
      [
        "An **elliptical clause** leaves out words the reader can supply: *She is taller than **I** [am].* To choose the pronoun after *than* or *as*, finish the clause in your head. If the missing verb follows, use the subject form (*I, he, she, we, they*): *He runs faster than **she** [runs].* If the pronoun receives the action, use the object form (*me, him, her, us, them*): *The coach praised Leo more than [she praised] **me***.\n\nIn formal writing, choose the form the complete clause needs.\n\n> **Watch out.** Never guess by what sounds casual in speech—always expand the words after *than* or *as* into a full clause, and never use a reflexive pronoun (*myself*, *himself*) when there is no matching subject in that clause.",
        "**省略从句**省去了读者能自行补出的词：*She is taller than **I** [am].* 要选择 *than* 或 *as* 后面的代词，就在心里把从句补完整。如果后面省略的是谓语动词，用主格（*I, he, she, we, they*）：*He runs faster than **she** [runs].* 如果代词承受动作，用宾格（*me, him, her, us, them*）：*The coach praised Leo more than [she praised] **me***。\n\n在正式写作中，选择完整从句所需要的形式。\n\n> **注意。** 不要凭口语习惯蒙答案——务必把 *than* 或 *as* 后面的从句补完整，并且本从句中没有对应主语时绝不用反身代词（*myself*、*himself*）。",
      ],
      ["Which pronoun is correct in formal writing?", "在正式写作中哪个代词是正确的？"],
      `
${comparisonLines}
        My brother is taller than ___.|I|me|myself
        She runs faster than ___.|he|him|himself
        Nobody worked as hard as ___.|they|them|themselves
        The other team scored more goals than ___.|we|us|ourselves
        He is not as old as ___.|she|her|herself
        You know the city better than ___.|I|me|myself
        Our neighbors have lived here longer than ___.|we|us|ourselves
        Lin sings more sweetly than ___.|he|him|himself
        The teacher trusts Mia more than ___. (more than she trusts me)|me|I|myself
        The dog likes my sister more than ___. (more than it likes me)|me|I|myself
        I gave Tom more help than ___. (than I gave her)|her|she|herself
        The judges praised her more than ___. (than they praised him)|him|he|himself
        No one was as surprised as ___.|I|me|myself
        They arrived earlier than ___.|we|us|ourselves
        My cousin is as brave as ___.|she|her|herself
        The coach chose Ana sooner than ___. (than he chose them)|them|they|themselves
        The storm frightened the children more than ___. (than it frightened us)|us|we|ourselves
        She paints better than ___.|I|me|myself
        Grandfather tells stories better than ___.|they|them|themselves
        The book interested my father more than ___. (than it interested me)|me|I|myself
        Few people are as patient as ___.|he|him|himself
        The guide warned Leo sooner than ___. (than she warned me)|me|I|myself
        My friends were as tired as ___.|we|us|ourselves
        Her sister is much younger than ___.|she|her|herself
        The news upset my mother more than ___. (than it upset him)|him|he|himself
        You have read more books than ___.|I|me|myself
        Nobody knows the forest as well as ___.|they|them|themselves
        The teacher thanked Sara more warmly than ___. (than she thanked us)|us|we|ourselves
        My uncle drives more carefully than ___.|she|her|herself
        The prize meant more to Ana than to ___.|me|I|myself
      `,
      (right) => [
        `Finish the clause in your head: the missing words show that **${right}** is the form the complete clause needs.\n\n**Check.** Supply the omitted verb (or subject + verb) around **${right}** and read the full clause aloud: it matches the grammar of standard formal English.`,
        `在心里把从句补完整：省略的部分表明 **${right}** 是完整从句所需要的形式。\n\n**检验。** 把省略的动词（或主语和动词）补回 **${right}** 旁边通读完整从句：它与标准正式英语的格完全吻合。`,
      ],
      [
        [
          "*{wrong}* is the wrong case: finish the clause in your head to see whether the pronoun acts as the subject or receives the verb's action.",
          "*{wrong}* 的格不对：把从句补完整，看看代词是作主语还是承受动词的动作。",
        ],
        [
          "*{wrong}* is a reflexive pronoun, which refers back to the subject of its own clause; there is nothing for it to refer back to here.",
          "*{wrong}* 是反身代词，用来回指本从句的主语；这里没有它可以回指的对象。",
        ],
      ],
    ),
    choose(
      "what-the-clause-leaves-out",
      ["What the Clause Leaves Out", "从句省略了什么"],
      [
        "Writers often leave out words that the reader can supply from the rest of the sentence. *While [she was] waiting, she read.* *When [it is] ripe, the fruit falls.* *She likes the sea more than [she likes] the mountains.* To read such a sentence, supply the words that the main clause makes obvious.\n\nSometimes the missing words change the meaning: *I miss you more than **he** [misses you]* is not the same as *I miss you more than [I miss] **him***.\n\n> **Watch out.** Check both the *subject* and the *helping verb* when restoring a shortened clause—in *While [ ] waiting for the bus, she read*, the implied subject must match the main clause's subject (*she was*, never *the bus was* or *she had*).",
        "作者常常省去读者能从句子其余部分补出的词。*While [she was] waiting, she read.* *When [it is] ripe, the fruit falls.* *She likes the sea more than [she likes] the mountains.* 读这样的句子时，要补出主句已经清楚表明的词。\n\n有时省略的部分会改变意思：*I miss you more than **he** [misses you]* 和 *I miss you more than [I miss] **him*** 不是一个意思。\n\n> **注意。** 还原省略从句时同时核对*主语*和*助动词*——在 *While [ ] waiting for the bus, she read* 里，隐含主语必须与主句主语一致（*she was*，绝不是 *the bus was* 或 *she had*）。",
      ],
      ["Which words has the writer left out at the mark [ ]?", "作者在 [ ] 处省略了哪些词？"],
      `
${leftOutLines}
        While [ ] waiting for the bus, she read a novel.|she was|the bus was|she had
        When [ ] ripe, the apples fall from the tree.|they are|the tree is|it was
        Though [ ] tired, the runners kept going.|they were|it was|the race was
        She likes the sea more than [ ] the mountains.|she likes|the sea likes|the mountains like
        I miss you more than he [ ].|misses you|misses him|I miss him
        I miss you more than [ ] him.|I miss|he misses|you miss
        If [ ] possible, call me before noon.|it is|you are|I am
        Once [ ] inside, the guests took off their coats.|they were|the house was|it was
        The film was longer than [ ] expected.|we had|it had|the film was
        Although [ ] small, the dog was fierce.|it was|the owner was|they were
        He speaks French better than [ ] English.|he speaks|French speaks|English is
        When [ ] in doubt, ask the teacher.|you are|the teacher is|it was
        The new bridge is stronger than the old one [ ].|was|is stronger|built
        Unless [ ] told otherwise, stay in your seats.|you are|they are|it is
        She trusted her aunt more than [ ] her uncle.|she trusted|her uncle trusted|her aunt trusted
        She trusted her aunt more than her uncle [ ].|did|trusted him|was trusted
        While [ ] on holiday, they visited three museums.|they were|the museums were|it was
        If [ ] necessary, we will cancel the trip.|it is|we are|the trip is
        My sister reads more books than I [ ].|do|read her|am read
        The cake tastes better than it [ ].|looks|tastes|cakes
        Whenever [ ] possible, she walks to school.|it is|she is|school is
        Though [ ] warned of the danger, he climbed on.|he was|the danger was|it was
        The test was easier than [ ] feared.|we had|it had|the test was
        When [ ] finished, put your pencils down.|you are|the pencils are|it is
        Tom helped me more than [ ] Sam.|he helped|Sam helped|I helped
        Tom helped me more than Sam [ ].|did|helped Sam|was helped
        While [ ] still a child, she learned to sail.|she was|the boat was|it was
        If [ ] in danger, press the red button.|you are|the button is|it was
        The river was deeper than [ ] thought.|we had|the river had|it was
        Although [ ] poor, the family was happy.|they were|it was|the house was
      `,
      (right) => [
        `The rest of the sentence makes it clear that **${right}** is the missing part; put it back and the clause is complete.\n\n**Check.** Insert **${right}** directly into the [ ] slot and read the whole sentence: both the subject and the tense match the main clause cleanly.`,
        `句子的其余部分清楚地表明省略的是 **${right}**；把它补回去，从句就完整了。\n\n**检验。** 把 **${right}** 直接放回 [ ] 处通读全句：主语和时态都与主句严丝合缝。`,
      ],
      [
        [
          "With *{wrong}*, the clause would be about the wrong person or thing; check the main clause to see who or what the shortened clause belongs to.",
          "补上 *{wrong}*，从句说的就成了另一个人或物；看主句才能确定省略从句的主语。",
        ],
        [
          "*{wrong}* does not fit the rest of the sentence: put it back and the meaning or the grammar goes wrong.",
          "*{wrong}* 与句子其余部分不符：补回去后，意思或语法就不对了。",
        ],
      ],
    ),
  ],
});

const possessives = topic("grammar", {
  id: "possessives-before-gerunds",
  title: ["Possessives Before Gerunds", "动名词前的所有格"],
  summary: [
    "In formal writing, a possessive comes before a gerund (*his leaving*), while an object pronoun comes before a participle (*I saw him leaving*).",
    "在正式写作中，动名词前用所有格（*his leaving*），而分词前用宾格代词（*I saw him leaving*）。",
  ],
  intro: [
    "Compare *We applauded **her** singing* with *We heard **her** singing*: the first praises the song itself (a gerund taking a possessive), while the second focuses on the person we heard (a participle taking an object pronoun). That distinction sharpens formal prose.",
    "比较 *We applauded **her** singing* 与 *We heard **her** singing*：前一句称赞的是歌声本身（动名词配所有格），后一句聚焦于我们听到的那个人（分词配宾格）。分清这一差别能让正式写作更精准。",
  ],
  after: ["identifying-verbals", "apostrophes-and-possessives"],
  points: [
    choose(
      "the-possessive-before-the-gerund",
      ["The Possessive Before the Gerund", "动名词前用所有格"],
      [
        "A **gerund** is an *-ing* word used as a noun. Because it is a noun, the word before it takes the **possessive** form in formal writing, just as it would before any noun: *We were surprised by **his** leaving* (like *his departure*). *I don't mind **Maria's** singing* (like *Maria's song*).\n\nThe object form (*him leaving*) is common in speech, but formal writing prefers the possessive.\n\n> **Watch out.** Test by swapping the *-ing* word for an ordinary noun like *departure* or *decision*—you would never write *surprised by him departure*, so write *surprised by **his** leaving*.",
        "**动名词**是用作名词的 *-ing* 词。既然它是名词，在正式写作中它前面的词就用**所有格**，就像在任何名词前一样：*We were surprised by **his** leaving*（如同 *his departure*）。*I don't mind **Maria's** singing*（如同 *Maria's song*）。\n\n宾格形式（*him leaving*）在口语中很常见，但正式写作更喜欢用所有格。\n\n> **注意。** 把 *-ing* 词临时换成 *departure* 这样的普通名词来检验——你绝不会写 *surprised by him departure*，所以正式写作应写 *surprised by **his** leaving*。",
      ],
      ["Which word is correct in formal writing?", "在正式写作中哪个词是正确的？"],
      `
${possessiveLines}\n${possessiveMore}
        We were surprised by ___ leaving so early.|his|him|he
        I don't mind ___ singing in the shower.|your|you|yours
        The teacher was pleased with ___ answering every question.|Ana's|Ana|Anas
        ___ arriving late upset the whole class.|Their|Them|They
        Do you remember ___ falling off the boat?|my|me|mine
        Her parents worried about ___ driving at night.|her|she|hers
        The coach praised ___ running in the final.|Leo's|Leo|Leos
        I can't stand ___ complaining all the time.|his|him|he
        ___ winning the prize surprised everyone.|Our|Us|We
        Nobody objected to ___ joining the team.|her|she|hers
        The noise of ___ hammering woke the baby.|the builders'|the builders|the builder
        We appreciate ___ helping with the move.|your|you|yours
        She was proud of ___ finishing the marathon.|her son's|her son|her sons
        The judge disapproved of ___ shouting in court.|their|them|they
        ___ lying about the accident made things worse.|His|Him|He
        I heard about ___ moving to Canada.|your|you|yours
        The captain insisted on ___ wearing life jackets.|our|us|we
        Mother was annoyed by ___ forgetting his homework again.|Tom's|Tom|Toms
        ___ refusing to apologize ended the friendship.|Her|She|Hers
        The village was shocked by ___ selling the farm.|the family's|the family|the families
        Thank you for ___ waiting so patiently.|your|you|yours
        Everyone laughed at ___ dancing.|my|me|I
        ___ quitting the band was a surprise.|His|Him|He
        The doctor approved of ___ walking every day.|my grandfather's|my grandfather|my grandfathers
        I don't understand ___ wanting to leave.|their|them|they
        The neighbors complained about ___ barking at night.|the dog's|the dog|the dogs
        ___ being late again cost him the job.|His|Him|He
        We celebrated ___ passing the exam.|her|she|hers
        Is there any chance of ___ coming to the party?|your|you|yours
        The town remembers ___ saving the children from the fire.|the firefighter's|the firefighter|the firefighters
      `,
      (right) => [
        `The *-ing* word is a gerund, a noun, so the word before it takes the possessive form **${right}**, just as it would before any noun.\n\n**Check.** Replace the *-ing* word with a plain noun like *action* or *decision*: only the possessive **${right}** fits naturally in front of a noun.`,
        `*-ing* 词是动名词，也就是名词，所以它前面的词用所有格 **${right}**，就像在任何名词前一样。\n\n**检验。** 把 *-ing* 词临时换成 *action* 或 *decision* 这类普通名词：只有所有格 **${right}** 能自然地放在名词前面。`,
      ],
      [
        [
          "*{wrong}* is the object form, common in speech; before a gerund, formal writing uses the possessive form instead.",
          "*{wrong}* 是宾格形式，在口语中常见；在动名词前，正式写作应改用所有格。",
        ],
        [
          "*{wrong}* is not a possessive that can come before a noun; a gerund needs a possessive determiner or noun with an apostrophe.",
          "*{wrong}* 不是可以放在名词前的所有格；动名词前需要所有格形式。",
        ],
      ],
    ),
    choose(
      "gerund-or-participle",
      ["Gerund or Participle?", "动名词还是分词？"],
      [
        "Not every *-ing* word after a noun or a pronoun is a gerund. Ask what the sentence is about. If it is about the **action**, the *-ing* word is a gerund and takes a **possessive**: *I dislike **his** shouting* (I dislike the shouting). If it is about the **person**, seen doing something, the *-ing* word is a participle describing that person and takes the **object** form: *I saw **him** shouting* (I saw him; he was shouting).\n\nVerbs of the senses, such as *see*, *hear*, *watch* and *feel*, usually go with a person seen in action.\n\n> **Watch out.** Check the main verb first: verbs of perception (*saw*, *heard*, *watched*, *felt*, *caught*, *spotted*, *noticed*, *found*) take an **object** + participle, whereas prepositions or subject slots (*by ___ leaving*, *___ crying kept us awake*) take a **possessive** + gerund.",
        "名词或代词后的 *-ing* 词并不都是动名词。问一问句子说的是什么。如果说的是**动作**，*-ing* 词是动名词，前面用**所有格**：*I dislike **his** shouting*（我讨厌的是喊叫）。如果说的是**人**，看到他在做某事，*-ing* 词是描述这个人的分词，前面用**宾格**：*I saw **him** shouting*（我看见了他，他正在喊叫）。\n\n*see*、*hear*、*watch* 和 *feel* 这样的感官动词，通常与看到的正在行动的人连用。\n\n> **注意。** 先看前面的动词或结构：感官/发现动词（*saw*、*heard*、*watched*、*felt*、*caught*、*spotted*、*noticed*、*found*）后接**宾格** + 分词；介词后或作主语时接**所有格** + 动名词。",
      ],
      ["Which word is correct in formal writing?", "在正式写作中哪个词是正确的？"],
      `
${gerundOrParticiple}
        I dislike ___ shouting.|his|him|he
        I saw ___ shouting at the referee.|him|his|he
        We heard ___ singing in the next room.|them|their|they
        We enjoyed ___ singing at the concert.|their|them|they
        The police watched ___ climbing the wall.|the thief|the thief's|the thiefs
        The police were puzzled by ___ climbing the wall.|the thief's|the thief|the thiefs
        I felt ___ trembling beside me.|the child|the child's|the childs
        ___ trembling worried the nurse.|The child's|The child|The childs
        She noticed ___ hiding behind the door.|him|his|he
        She was annoyed by ___ hiding her keys.|his|him|he
        I can see ___ waving from the boat.|you|your|yours
        Thank you for ___ waving goodbye.|your|you|yours
        They caught ___ cheating on the test.|him|his|he
        ___ cheating on the test was discovered.|His|Him|He
        We watched ___ dancing in the square.|them|their|they
        Everyone admired ___ dancing.|their|them|they
        I heard ___ crying in the night.|him|his|he
        ___ crying kept us all awake.|His|Him|He
        The guard spotted ___ running toward the gate.|us|our|we
        The guard was alarmed by ___ running toward the gate.|our|us|we
        We saw ___ painting the fence.|them|their|they
        ___ painting of the fence took all day.|Their|Them|They
        She found ___ sleeping on the sofa.|him|his|he
        ___ sleeping late became a habit.|His|Him|He
        We could hear ___ arguing through the wall.|them|their|they
        ___ arguing went on for hours.|Their|Them|They
        Mother watched ___ swimming across the lake.|me|my|I
        Mother was amazed by ___ swimming across the lake.|my|me|I
        He felt ___ pulling at his sleeve.|you|your|yours
        He objected to ___ pulling at his sleeve.|your|you|yours
      `,
      (right, shown) => {
        const isParticiple =
          shown.includes("saw") ||
          shown.includes("heard") ||
          shown.includes("watched") ||
          shown.includes("felt") ||
          shown.includes("noticed") ||
          shown.includes("caught") ||
          shown.includes("spotted") ||
          shown.includes("found") ||
          shown.includes("hear") ||
          shown.includes("see");
        return isParticiple
          ? [
              `The sentence is about a person seen or heard in action, so the *-ing* word is a participle describing that person: **${right}**.\n\n**Check.** Drop the *-ing* phrase after **${right}**: the main clause (*I saw/heard/watched ${right}*) still makes complete sense, confirming the object form.`,
              `句子说的是被看到或听到正在行动的人，所以 *-ing* 词是描述这个人的分词：**${right}**。\n\n**检验。** 试着去掉 **${right}** 后面的 *-ing* 短语：前面的主句依然意思完整，确认这里用宾格。`,
            ]
          : [
              `The sentence is about the action itself, so the *-ing* word is a gerund and takes the possessive **${right}**.\n\n**Check.** Replace the *-ing* word with a plain noun like *behavior* or *action*: **${right}** fits cleanly as a possessive before that noun.`,
              `句子说的是动作本身，所以 *-ing* 词是动名词，前面用所有格 **${right}**。\n\n**检验。** 把 *-ing* 词临时换成 *behavior* 或 *action* 这类普通名词：所有格 **${right}** 放在前面完全通顺。`,
            ];
      },
      [
        [
          "*{wrong}* treats the sentence the other way round: ask whether it is about the action itself (a gerund, with a possessive) or a person seen doing it (a participle, with the object form).",
          "*{wrong}* 把句子理解反了：问一问它说的是动作本身（动名词，用所有格）还是看到某人在做这件事（分词，用宾格）。",
        ],
        [
          "*{wrong}* is neither the possessive nor the object form, so it cannot come before the *-ing* word here.",
          "*{wrong}* 既不是所有格也不是宾格，不能放在这里的 *-ing* 词前面。",
        ],
      ],
    ),
  ],
});

/** grammarTopics9a are the grammar topics of the first units of grade 9. */
export const grammarTopics9a: readonly TopicDef[] = [phrases, clauses, complements, elliptical, possessives];
