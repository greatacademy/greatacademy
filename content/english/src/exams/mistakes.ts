// Feedback for the listed wrong responses of the typed exam problems: open cloze, word formation, key word
// transformations and grammar filling, one kind of gap at a time.

import { type Text, t } from "@ga/content";
import type { WhyNot } from "@ga/subject-english";
import { type Case, explain, participleNeeded, type Seen, spelling, when } from "../why-not.ts";

/** gapMark is how a gap is written in the shown text. */
const gapMark = "\\_\\_\\_\\_\\_";

/** low is a stretch of text in small letters without marks, for comparing. */
const low = (x: string) =>
  x
    .toLowerCase()
    .replace(/[^\p{L}\p{N}' ]/gu, "")
    .trim();

/** before is the word just before the gap. */
const before = (s: Seen) =>
  (s.shown.split(gapMark)[0] ?? "")
    .trim()
    .split(/\s+/u)
    .pop()
    ?.replace(/[^\p{L}']/gu, "") ?? "";

/** after is the stretch of words after the gap, up to the next mark. */
const after = (s: Seen) =>
  (s.shown.split(gapMark)[1] ?? "")
    .replace(/\*\*\([^)]*\)\*\*|\([^)]*\)/gu, "")
    .split(/[.,;!?]/u)[0]
    ?.trim() ?? "";

/** next is the first word after the gap. */
const next = (s: Seen) => after(s).split(/\s+/u)[0] ?? "";

/** fill puts the response and the words around the gap into a written explanation. */
const fill = (x: string, s: Seen) =>
  x.replaceAll("{w}", s.wrong).replaceAll("{a}", after(s)).replaceAll("{n}", next(s)).replaceAll("{b}", before(s));

/** Entry is a written explanation: the wrong words it is for (or *), the right answer, English, Chinese and a test of the shown text. */
type Entry = readonly [wrong: string, right: string, en: string, zh: string, shown?: RegExp];

/** table is a case for written explanations, each for some wrong words and one right answer. */
const table =
  (entries: readonly Entry[]): Case =>
  (s) => {
    const [w, r] = [low(s.wrong), low(s.right)];
    for (const [wrong, right, en, zh, shown] of entries) {
      if (right !== "*" && low(right) !== r) continue;
      if (wrong !== "*" && !wrong.split("|").some((x) => low(x) === w)) continue;
      if (shown && !shown.test(s.shown)) continue;
      return t(fill(en, s), fill(zh, s));
    }
    return undefined;
  };

// Articles.

/** vowelSound tells whether a word begins with a vowel sound. */
const vowelSound = (x: string) => /^(honou?r|hour|heir)/iu.test(x) || (/^[aeiou]/iu.test(x) && !/^(uni|use|eu|one)/iu.test(x));

/** anBeforeVowel explains *a* and *an* by the sound that begins the next word. */
const anBeforeVowel: Case = (s) => {
  const [w, r, n] = [low(s.wrong), low(s.right), next(s)];
  if (w === "a" && r === "an" && vowelSound(n))
    return /^h/iu.test(n)
      ? t(
          `The *h* of *${n}* is silent, so the word begins with a vowel sound, and *a* cannot go before it: a vowel sound takes the other form of the article.`,
          `*${n}* 的 *h* 不发音，这个词以元音音素开头，所以前面不能用 *a*：元音音素前要用不定冠词的另一个形式。`,
        )
      : t(
          `*a* goes before a consonant sound, but *${n}* begins with a vowel sound, which takes the other form of the article.`,
          `*a* 用在辅音音素前，但 *${n}* 以元音音素开头，要用不定冠词的另一个形式。`,
        );
  if (w === "an" && r === "a" && !vowelSound(n))
    return /^u/iu.test(n)
      ? t(
          `*an* goes only before a vowel sound. *${n}* is spelled with a *u* but begins with the sound of *you*, a consonant sound, which takes the other form of the article.`,
          `*an* 只用在元音音素前。*${n}* 虽然以字母 *u* 开头，但读音以 *you* 的音开头，这是辅音音素，要用不定冠词的另一个形式。`,
        )
      : t(
          `*an* goes only before a vowel sound, but *${n}* begins with a consonant sound, which takes the other form of the article.`,
          `*an* 只用在元音音素前，但 *${n}* 以辅音音素开头，要用不定冠词的另一个形式。`,
        );
  return undefined;
};

/** oneOfMany explains *the* where a noun is one of many, as in naming a job. */
const oneOfMany: Case = when(
  (s) => low(s.wrong) === "the" && /^an?$/u.test(low(s.right)),
  (s) =>
    /works as/u.test(s.shown)
      ? t(
          `*the* would point to one particular ${after(s).split(" ")[0]} the reader already knows. Naming someone's job takes the article for one of many: they are one of many people who do that job.`,
          `用 *the* 就成了特指读者已经知道的某一个人。说某人的职业时要用表示“众多之一”的冠词：他是做这份工作的众多人之一。`,
        )
      : t(
          `*the* points to one particular ${after(s).split(" ").slice(0, 2).join(" ")} the reader already knows. Here it is one of many, which takes the article for one of many.`,
          `*the* 特指读者已经知道的那一个。这里说的是众多之中的一个，要用表示“众多之一”的冠词。`,
        ),
);

const articleEntries: readonly Entry[] = [
  [
    "a|an",
    "the",
    "*{w}* would mean one sun out of many, but there is only one sun, which takes the article for something unique.",
    "用 *{w}* 就成了许多个太阳中的一个，但太阳是独一无二的，要用表示独一无二的冠词。",
    /sun/u,
  ],
  [
    "a|an",
    "the",
    "*{w}* does not go before a musical instrument after *play*. English uses the article that points to a particular thing, as for any instrument you play.",
    "*play* 后接乐器时不用 *{w}*。英语在乐器前用表示特指的冠词，弹奏任何乐器都是这样。",
    /violin|piano|guitar/u,
  ],
  [
    "most",
    "the",
    "*best* is already the superlative of *good*, so it never takes *most*. Like every superlative, it needs an article before it: the one for something unique.",
    "*best* 本身已经是 *good* 的最高级，不能再加 *most*。和所有最高级一样，它前面要用冠词：表示独一无二的那个。",
  ],
  [
    "a",
    "the",
    "*best* is a superlative: there is only one best, so it cannot take *a*, which means one of many.",
    "*best* 是最高级：最好的只有一个，所以不能用表示“众多之一”的 *a*。",
    /best/u,
  ],
  [
    "in|one",
    "a",
    "*{w}* is not used to say how often. Before the period of time, English puts an article that here means 'each', as when a price is so much ___ kilo.",
    "表示频率时不用 *{w}*。英语在时间段前用一个冠词，这里意思是“每”，就像说价格“每公斤多少”时那样。",
  ],
];

// Prepositions.

/** timeKind sorts the words after a gap by the preposition of time they take. */
const timeKind = (x: string): "at" | "on" | "in" | undefined => {
  const y = x.toLowerCase();
  if (/^(noon|midnight|half past|quarter|\d{1,2}(:\d\d)?\b|\w+ o'clock|night\b)/u.test(y)) return "at";
  if (/^(monday|tuesday|wednesday|thursday|friday|saturday|sunday|the \w+ of|my birthday|christmas day|new year's day)/u.test(y))
    return "on";
  if (
    /^(january|february|march|april|may|june|july|august|september|october|november|december|\d{4}\b|the (spring|summer|autumn|winter|morning|afternoon|evening|\d{4}s)|spring|summer|autumn|winter)/u.test(
      y,
    )
  )
    return "in";
  return undefined;
};

const timeUse = {
  at: ["a clock time, *noon* or *midnight*", "钟点、*noon* 或 *midnight*"],
  on: ["a day or a date", "某一天或某个日期"],
  in: ["a month, a year, a season or a part of the day", "月份、年份、季节或一天中的某段时间"],
} as const;

/** timePreposition explains *at*, *on* and *in* before a time by the kind of time each one goes with. */
const timePreposition: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  const kind = timeKind(after(s));
  if (kind !== r || !(w === "at" || w === "on" || w === "in")) return undefined;
  const [wEn, wZh] = timeUse[w];
  const [rEn, rZh] = timeUse[kind];
  return t(
    `*${w}* goes with ${wEn}. *${after(s)}* is ${rEn}, which takes another preposition.`,
    `*${w}* 用于${wZh}。*${after(s)}* 是${rZh}，要用另一个介词。`,
  );
};

const prepositionEntries: readonly Entry[] = [
  [
    "at|in",
    "on",
    "A programme is *on TV* or *on the radio*; *{w}* is not used with *TV*.",
    "节目在电视或广播上播出要用 *on TV*、*on the radio*；*TV* 前不用 *{w}*。",
  ],
  [
    "by|with",
    "to",
    "*{w}* does not go with *married*. You are married to someone with the same preposition as *engaged* and *related* take.",
    "*{w}* 不和 *married* 连用。“和某人结婚”用的介词与 *engaged*、*related* 后面的介词相同。",
    /married/u,
  ],
  [
    "from|than",
    "to",
    "*than* goes with comparatives such as *better*, and *from* does not go with *prefer*. *prefer A ___ B* joins the two things with the preposition that also means 'toward'.",
    "*than* 跟在 *better* 这类比较级后面，*from* 不与 *prefer* 搭配。*prefer A ___ B* 用表示“朝向”的那个介词连接两样东西。",
    /prefer/u,
  ],
  [
    "at|for",
    "to",
    "*{w}* does not go with *look forward*. Its preposition is the same short word that comes before a base verb in *want ___ go*, but here it is a preposition, so an *-ing* form or a noun follows it.",
    "*{w}* 不与 *look forward* 搭配。它的介词和 *want ___ go* 中动词原形前的那个短词一样，但这里是介词，所以后面接 -ing 形式或名词。",
    /forward/u,
  ],
  [
    "during",
    "for",
    "*during* says when something happened inside an event (*during the storm*). *{a}* is a length of time, which takes the preposition of duration, as in *___ ten years*.",
    "*during* 说明事情发生在某个事件期间（*during the storm*）。*{a}* 是一段时间的长度，要用表示时长的介词，如 *___ ten years*。",
  ],
  [
    "since",
    "for",
    "*since* needs a starting point (*since two o'clock*). *{a}* is a length of time, which takes the preposition of duration, not of a starting point.",
    "*since* 后面要接起点（*since two o'clock*）。*{a}* 是一段时间的长度，要用表示时长的介词，而不是表示起点的介词。",
  ],
  [
    "for|in",
    "at",
    "*{w} the moment* does not mean 'right now'. The fixed phrase for 'now' takes the preposition of a point in time, the one used with clock times.",
    "*{w} the moment* 不是“此刻”的意思。表示“现在”的固定短语用表示时间点的介词，也就是钟点前用的那个。",
    /moment/u,
  ],
  [
    "for|with|in",
    "at",
    "*{w}* is not used with *good* for a skill. To say what someone does well, *good* takes the preposition of a point, the one used with clock times.",
    "表示擅长某事时，*good* 不和 *{w}* 连用。说某人擅长什么，*good* 后接表示“点”的介词，也就是钟点前用的那个。",
    /good/u,
  ],
  [
    "for",
    "since",
    "*for* goes with a length of time (*for ten years*). *{a}* is a starting point, and with the present perfect a starting point takes another word.",
    "*for* 后接一段时间（*for ten years*）。*{a}* 是一个起点，与现在完成时连用的起点要用另一个词。",
  ],
  [
    "from",
    "since",
    "*from* needs an end point too (*from 2015 to 2020*). The present perfect links *{a}* to now, and a starting point that runs up to now takes another word.",
    "*from* 还需要一个终点（*from 2015 to 2020*）。现在完成时把 *{a}* 和现在联系起来，一直延续到现在的起点要用另一个词。",
  ],
  [
    "in",
    "since",
    "*in {a}* would only say when something happened. The present perfect links *{a}* to now, so it needs the word for a starting point that runs up to now.",
    "*in {a}* 只说明事情发生在什么时候。现在完成时把 *{a}* 和现在联系起来，要用表示“从那时起一直到现在”的词。",
  ],
  [
    "from|of",
    "by",
    "*{w}* does not introduce who does the action. In a passive sentence, the doer comes after one particular preposition, the same in *made ___ hand*.",
    "*{w}* 不能引出动作的执行者。被动句中，执行者放在一个特定的介词后面，就是 *made ___ hand* 中的那个。",
    /written|built|painted|made/u,
  ],
  [
    "until",
    "by",
    "*until* means that the action goes on up to that time. *at the latest* shows a deadline, the latest time something is done, which takes a different preposition.",
    "*until* 表示动作一直持续到那个时间。*at the latest* 表示截止时间，即最晚完成的时间，要用另一个介词。",
  ],
  [
    "in",
    "by",
    "*in* does not go with a day such as *Friday*, and *at the latest* shows a deadline, which takes the preposition meaning 'not later than'.",
    "*in* 不用在 *Friday* 这样的日子前，而且 *at the latest* 表示截止时间，要用意思是“不迟于”的介词。",
  ],
  [
    "since",
    "during",
    "*since* needs a starting point and a perfect tense. *the storm* is an event the staying lasted through, which takes the preposition meaning 'all through an event'.",
    "*since* 后面要接起点，并与完成时连用。*the storm* 是一个事件，待在屋里贯穿了整个过程，要用意思是“在某事件期间”的介词。",
  ],
  [
    "while",
    "during",
    "*while* is followed by a clause with a verb (*while it was raining*). *{a}* is a noun, which takes a preposition with the same meaning instead.",
    "*while* 后面接带动词的从句（*while it was raining*）。*{a}* 是名词，要用意思相同的介词。",
  ],
  [
    "about|for|with",
    "of",
    "*{w}* does not go with *afraid*. It takes the same preposition as *scared* and *proud* do.",
    "*{w}* 不和 *afraid* 连用。它和 *scared*、*proud* 后面接的介词相同。",
    /afraid/u,
  ],
  [
    "as|with|of",
    "for",
    "*famous as* names a role, and *famous {w}* is not used here. To say what something is known for, *famous* takes the same preposition as *known* does in that sense.",
    "*famous as* 说明以什么身份出名，这里不能用 *famous {w}*。说以什么出名时，*famous* 和表示这个意思的 *known* 后接的介词相同。",
    /famous/u,
  ],
  [
    "of|to",
    "for",
    "*{w}* is not used after *thank you* before the reason. The reason takes the preposition of a cause, the same as in *sorry ___ being late*.",
    "*thank you* 后说明原因时不用 *{w}*。原因前要用表示原因的介词，和 *sorry ___ being late* 中的相同。",
    /[Tt]hank/u,
  ],
  [
    "in",
    "of",
    "*in* does not pick out part of a group. After *most* and before *the* and a group, English uses the preposition of a part, as in *some ___ them*.",
    "*in* 不能表示群体中的一部分。*most* 后面接 *the* 和一个群体时，要用表示部分的介词，如 *some ___ them*。",
  ],
  [
    "from",
    "of",
    "*from* says where something comes from. After *most* and before *the* and a group, English uses the preposition of a part, as in *some ___ them*.",
    "*from* 表示来源。*most* 后面接 *the* 和一个群体时，要用表示部分的介词，如 *some ___ them*。",
  ],
];

// Pronouns.

const pronounEntries: readonly Entry[] = [
  [
    "another|others",
    "other",
    "*each other* is a fixed pair for people doing something to one another. *{w}* cannot follow *each*.",
    "*each other* 是固定搭配，表示彼此、互相。*{w}* 不能跟在 *each* 后面。",
  ],
  [
    "it|that|them",
    "one",
    "*{w}* points back to the very thing already mentioned. Here it is a different thing of the same kind, which takes the pronoun for 'a thing of that kind'.",
    "*{w}* 指的是前面提到的那个东西本身。这里说的是同类中的另一个，要用表示“同类中的一个”的代词。",
  ],
  [
    "it",
    "there",
    "To say that something exists somewhere, English starts with *There is*. *It is* would need *it* to stand for something already mentioned.",
    "说某处存在某物时，英语用 *There is* 开头。*It is* 中的 *it* 要指代前面提到的事物。",
  ],
  [
    "there|this|that",
    "it",
    "*{w}* cannot hold that place. The real subject, *to ...*, comes later in the sentence, so the sentence starts with an empty subject that means nothing by itself.",
    "*{w}* 不能占这个位置。真正的主语 *to ...* 放在句子后面，所以句首要用一个本身没有意义的形式主语。",
    /is important|is hard|is easy|is difficult/u,
  ],
  [
    "that|this|there|its",
    "it",
    "*{w}* cannot hold that place. After *find*, an empty object stands for *to ...* later in the sentence, the same word that starts *___ is hard to ...*.",
    "*{w}* 不能占这个位置。*find* 后用形式宾语代替句子后面的 *to ...*，和 *___ is hard to ...* 句首的词相同。",
    /find/u,
  ],
  [
    "its",
    "it",
    "*its* is a possessive and needs a noun after it. Here the gap is an empty object that stands for *to ...* later in the sentence, and that takes no possessive ending.",
    "*its* 是物主代词，后面要接名词。这里空格是形式宾语，代替句子后面的 *to ...*，不能用物主形式。",
  ],
  [
    "them|they",
    "their",
    "*own* follows a possessive word: *their own*, *my own*. *{w}* is not a possessive.",
    "*own* 前面要用物主代词：*their own*、*my own*。*{w}* 不是物主代词。",
  ],
  [
    "them|they",
    "themselves",
    "The subject does the action to itself, or alone, so the pronoun is reflexive: *-selves* for a plural subject. *{w}* is not reflexive.",
    "主语对自己做这件事，或独自完成，所以要用反身代词，复数主语用 *-selves*。*{w}* 不是反身代词。",
  ],
  [
    "themself",
    "themselves",
    "With a plural subject such as *the children*, the reflexive pronoun ends in *-selves*.",
    "*the children* 这样的复数主语，反身代词以 *-selves* 结尾。",
  ],
  [
    "you|your",
    "yours",
    "No noun follows the gap, so it stands alone for 'your phone' and needs the possessive pronoun that ends in *-s*. *{w}* cannot do that.",
    "空格后没有名词，它单独代替“你的手机”，所以要用以 *-s* 结尾的名词性物主代词。*{w}* 不能这样用。",
  ],
  [
    "you|your",
    "yourself",
    "*Help yourself to ...* means 'take what you want'; you serve yourself, so the pronoun is reflexive. *{w}* is not reflexive.",
    "*Help yourself to ...* 意思是“随便吃/拿”，自己招待自己，所以要用反身代词。*{w}* 不是反身代词。",
  ],
  [
    "you|your",
    "yourselves",
    "*Help yourselves to ...* means 'take what you want'; the people serve themselves, so the pronoun is reflexive. *{w}* is not reflexive.",
    "*Help yourselves to ...* 意思是“随便吃/拿”，自己招待自己，所以要用反身代词。*{w}* 不是反身代词。",
  ],
  [
    "yourself",
    "yourselves",
    "*everyone* is many people, so the reflexive pronoun is plural, with *-selves*.",
    "*everyone* 指很多人，所以反身代词用复数，以 *-selves* 结尾。",
  ],
  [
    "her|she|herself",
    "hers",
    "No noun follows the gap, so it stands alone for 'her bag' and needs the possessive pronoun that ends in *-s*. *{w}* cannot do that.",
    "空格后没有名词，它单独代替“她的包”，所以要用以 *-s* 结尾的名词性物主代词。*{w}* 不能这样用。",
  ],
];

// Words of amount.

const quantifierEntries: readonly Entry[] = [
  [
    "a|another",
    "one",
    "The fixed phrase is *one more time*. *{w}* does not go before *more time*.",
    "固定说法是 *one more time*。*{w}* 不能放在 *more time* 前。",
  ],
  [
    "all|both",
    "every",
    "*{w}* needs a plural noun, but *{n}* is singular. A singular noun takes a word that means all of them, one by one.",
    "*{w}* 后面要接复数名词，但 *{n}* 是单数。单数名词前要用表示“每一个都”的词。",
  ],
  [
    "any",
    "none",
    "*Any of my friends has a car* does not say that they have no car, but taking the bus shows that not one of them does. The gap needs a word for 'not one' that can come before *of*.",
    "*Any of my friends has a car* 并不表示没有人有车，而总是坐公交说明一个也没有。空格要填一个能放在 *of* 前、表示“一个也没有”的词。",
  ],
  [
    "no",
    "none",
    "*no* must be followed straight by a noun (*no friends*). Before *of*, 'not one' takes a word that stands alone as a pronoun.",
    "*no* 后面必须直接接名词（*no friends*）。在 *of* 前，表示“一个也没有”要用能单独作代词的词。",
  ],
  [
    "nobody",
    "none",
    "*nobody* is not followed by *of*. Before *of my friends*, 'not one' takes a word that can be followed by *of*.",
    "*nobody* 后面不接 *of*。*of my friends* 前面，表示“一个也没有”要用能接 *of* 的词。",
  ],
  [
    "both",
    "neither",
    "*Both* would mean that the two hotels had rooms, but you slept in the car. The gap needs the word for 'not one of the two'.",
    "*Both* 表示两家旅馆都有空房，但你们睡在了车里。空格要填表示“两者都不”的词。",
  ],
  [
    "either",
    "neither",
    "*Either* means one or the other, which does not say that not one of the two had a room. The gap needs the word for 'not one of the two'.",
    "*Either* 表示两者中任意一个，没有说出两家都没有空房。空格要填表示“两者都不”的词。",
  ],
  [
    "none",
    "neither",
    "*none* is for a group of three or more. For two, such as *the two hotels*, 'not one' takes the word made for pairs.",
    "*none* 用于三者或以上。两者之间，如 *the two hotels*，表示“都不”要用专门用于两者的词。",
  ],
  [
    "either|neither",
    "both",
    "*{w}* pairs with *or* or *nor*, but the gap is followed by *and*, which pairs with the word for 'the one and the other'.",
    "*{w}* 与 *or* 或 *nor* 搭配，但空格后面是 *and*，与它搭配的是表示“两者都”的词。",
  ],
  [
    "few",
    "little",
    "*few* goes with plural countable nouns. *time* here cannot be counted, so it takes the word for a small amount of something uncountable.",
    "*few* 接可数名词复数。这里的 *time* 不可数，要用表示“少量（不可数）”的词。",
  ],
  [
    "lot",
    "little",
    "*a lot* needs *of* before a noun (*a lot of time*). With only one word in the gap, a small amount of time is *a little time*.",
    "*a lot* 接名词时要加 *of*（*a lot of time*）。空格只能填一个词，表示少量时间要用 *a little time*。",
  ],
  [
    "less",
    "few",
    "*less* is a comparative for nouns that cannot be counted. *people* is a plural countable noun, so *very few*.",
    "*less* 是不可数名词的比较级。*people* 是可数名词复数，所以用 *very few*。",
  ],
  [
    "little",
    "few",
    "*little* goes with nouns that cannot be counted. *people* is a plural countable noun, so *very few*.",
    "*little* 接不可数名词。*people* 是可数名词复数，所以用 *very few*。",
  ],
  [
    "many",
    "much",
    "*milk* cannot be counted, and *many* is for plural countable nouns. An amount of something uncountable takes another word.",
    "*milk* 不可数，而 *many* 接可数名词复数。不可数的量要用另一个词。",
  ],
  [
    "some",
    "much",
    "*some* belongs in positive sentences. After *isn't*, an amount of something that cannot be counted, such as *milk*, takes the word for 'a large amount' used in negatives and questions.",
    "*some* 用于肯定句。在 *isn't* 之后，*milk* 这样不可数的量要用否定句和疑问句中表示“多”的词。",
  ],
];

// Relative words.

const relativeEntries: readonly Entry[] = [
  [
    "which",
    "who",
    "*which* is for things, but *{b}* are people, so the gap needs the relative word for people.",
    "*which* 指物，但 *{b}* 是人，所以空格要用指人的关系词。",
    /people|man|woman|boy|girl/u,
  ],
  [
    "she|he|it|they",
    "who",
    "*{w}* would start a second sentence with no link to the first, leaving two main verbs. A relative word, the one for people, joins the clause to the noun.",
    "*{w}* 会开始另一个句子，和前面没有连接，句子里就有了两个谓语。要用指人的关系词把从句和名词连起来。",
  ],
  [
    "whom",
    "who",
    "*whom* stands for the object of a verb, but here the gap is the subject of *{n}*, which takes the subject form.",
    "*whom* 在从句中作宾语，但这里空格是 *{n}* 的主语，要用主格形式。",
  ],
  [
    "whose",
    "who",
    "*whose* is always followed by a noun that belongs to someone (*whose bike*). No such noun follows the gap here.",
    "*whose* 后面总要接一个属于某人的名词（*whose bike*）。这里空格后没有这样的名词。",
  ],
  [
    "that",
    "which",
    "After a comma, a relative clause that adds extra information cannot begin with *that*; for a thing or an idea it takes the other relative word.",
    "逗号后补充说明的非限制性定语从句不能用 *that* 引导；指物或指事要用另一个关系词。",
  ],
  [
    "what",
    "which",
    "*what* means 'the thing that' and has no noun or idea before it to point back to. Pointing back to the whole idea before the comma takes a relative word for things.",
    "*what* 意思是“……的东西”，前面没有要指代的名词或内容。指代逗号前的整件事要用指物的关系词。",
  ],
  [
    "it",
    "which",
    "*it* would make a second main clause joined to the first only by a comma. A relative word for things would join it as a clause that points back to the whole idea.",
    "用 *it* 会形成第二个主句，两个主句之间只有逗号。要用指物的关系词引导定语从句，指代前面整件事。",
  ],
  [
    "who",
    "which",
    "*who* is for people, but *{b}* is a thing, so the gap needs the relative word for things.",
    "*who* 指人，但 *{b}* 是物，所以空格要用指物的关系词。",
  ],
  [
    "who's",
    "whose",
    "*who's* is short for *who is*. To show that the *{n}* belongs to the person, the gap needs the possessive relative word, which sounds the same.",
    "*who's* 是 *who is* 的缩写。要表示 *{n}* 属于这个人，空格要用表示所属的关系词，它和 *who's* 读音相同。",
  ],
  [
    "which|who|that",
    "whose",
    "The noun after the gap, *{n}*, belongs to the noun before it, and *{w}* cannot show that. Belonging in a relative clause takes the possessive relative word.",
    "空格后的名词 *{n}* 属于前面的名词，而 *{w}* 不能表示所属。定语从句中表示所属要用所有格关系词。",
  ],
  [
    "which|that",
    "where",
    "*{w}* would need a missing subject or object in the clause, but *{a}* is already complete. A complete clause about a place takes the relative word for places.",
    "用 *{w}* 时从句要缺主语或宾语，但 *{a}* 已经完整。完整的从句说地点时，要用指地点的关系词。",
  ],
  [
    "when",
    "where",
    "*when* is for times, but *{b}* is a place, so the gap needs the relative word for places.",
    "*when* 指时间，但 *{b}* 是地点，所以空格要用指地点的关系词。",
  ],
  [
    "where",
    "when",
    "*where* is for places, but *{b}* is a time, so the gap needs the relative word for times.",
    "*where* 指地点，但 *{b}* 是时间，所以空格要用指时间的关系词。",
  ],
  [
    "which",
    "when",
    "*which* would need a missing subject or object in the clause, but *{a}* is already complete. A complete clause about a time takes the relative word for times.",
    "用 *which* 时从句要缺主语或宾语，但 *{a}* 已经完整。完整的从句说时间时，要用指时间的关系词。",
  ],
  [
    "who",
    "when",
    "*who* is for people, but *{b}* is a time, so the gap needs the relative word for times.",
    "*who* 指人，但 *{b}* 是时间，所以空格要用指时间的关系词。",
  ],
  [
    "that|which",
    "what",
    "There is no noun before the gap for *{w}* to describe. The gap needs a word that means 'the thing that' and begins the subject by itself.",
    "空格前没有可以让 *{w}* 修饰的名词。空格要填一个意思是“……的东西”、能自己引导主语的词。",
  ],
  [
    "because",
    "why",
    "*because* gives a reason but cannot follow the noun *the reason*. After *the reason*, a relative clause begins with the question word for reasons.",
    "*because* 表示原因，但不能跟在名词 *the reason* 后面。*the reason* 后的定语从句用询问原因的疑问词引导。",
  ],
  [
    "which",
    "why",
    "*which* would need a missing subject or object, but *{a}* is complete. After *the reason*, the relative word is the question word for reasons.",
    "用 *which* 时从句要缺主语或宾语，但 *{a}* 已经完整。*the reason* 后的关系词是询问原因的疑问词。",
  ],
  [
    "what",
    "why",
    "*what* cannot follow a noun. After *the reason*, the relative word is the question word for reasons.",
    "*what* 不能跟在名词后面。*the reason* 后的关系词是询问原因的疑问词。",
  ],
  [
    "what",
    "that",
    "*what* cannot follow a noun. After *{b}*, a relative clause begins with a relative word for things.",
    "*what* 不能跟在名词后面。*{b}* 后的定语从句要用指物的关系词引导。",
  ],
  [
    "where",
    "that",
    "*where* means 'in which place', but the clause *{a}* is missing its object. A thing that is the object takes a relative word for things.",
    "*where* 意思是“在那个地方”，但从句 *{a}* 缺少宾语。指物并作宾语时要用指物的关系词。",
  ],
  [
    "who",
    "that",
    "*who* is for people, but *{b}* are things, so the gap needs a relative word for things.",
    "*who* 指人，但 *{b}* 是物，所以空格要用指物的关系词。",
  ],
];

// Helping verbs.

const auxiliaryEntries: readonly Entry[] = [
  [
    "are",
    "have",
    "*are* would need an *-ing* form after the subject. *been* is a past participle, so the helping verb is the one of the perfect tenses.",
    "用 *are* 时后面要接 -ing 形式。*been* 是过去分词，所以助动词要用完成时的那个。",
  ],
  [
    "did",
    "have",
    "*did* is followed by the base form (*Did you go?*). *been* is a past participle, so the helping verb is the one of the perfect tenses.",
    "*did* 后面接动词原形（*Did you go?*）。*been* 是过去分词，所以助动词要用完成时的那个。",
  ],
  [
    "had",
    "have",
    "*This is the first time* is about now, so it takes the present perfect. *had* makes the past perfect.",
    "*This is the first time* 说的是现在，所以要用现在完成时。*had* 构成的是过去完成时。",
  ],
  [
    "was",
    "have",
    "*was* cannot come before *been*. *been* is a past participle, and *This is the first time* takes the present perfect.",
    "*was* 不能放在 *been* 前面。*been* 是过去分词，而且 *This is the first time* 要用现在完成时。",
  ],
  [
    "has",
    "was",
    "*yesterday* is a finished past time, so the passive is in the past simple. *has* makes the present perfect, which cannot go with *yesterday*.",
    "*yesterday* 是已经结束的过去时间，所以被动语态用一般过去时。*has* 构成现在完成时，不能和 *yesterday* 连用。",
  ],
  [
    "had",
    "was",
    "The letter does not post anything; someone posted it, so the verb is passive, and *yesterday* takes the past simple. *had posted* would be active and in the past perfect.",
    "信不会自己寄出，是别人寄的，所以用被动语态，*yesterday* 要求一般过去时。*had posted* 是主动语态的过去完成时。",
  ],
  [
    "has|was",
    "did",
    "*{w}* cannot go with the base form. After *Not only* at the start, the helping verb comes before the subject as in a question. The main verb *{a}* is in its base form, which only a form of *do* can go with, and the story is in the past.",
    "*{w}* 不能接动词原形。*Not only* 放在句首时，助动词要像疑问句一样放在主语前。主要动词 *{a}* 是原形，只有 *do* 的某个形式能和原形连用，而且说的是过去。",
  ],
  [
    "has",
    "had",
    "The starting happened before another past event, so it takes the past perfect. *has* makes the present perfect.",
    "开始发生在另一个过去的事件之前，所以要用过去完成时。*has* 构成的是现在完成时。",
  ],
  [
    "was",
    "had",
    "*was started* would be passive, but the film started by itself, before another past event. That needs the past perfect.",
    "*was started* 是被动语态，但电影是自己开始的，而且发生在另一个过去的事件之前，要用过去完成时。",
  ],
  [
    "has",
    "is",
    "*being built* makes the present progressive passive with a form of *be*. After *has*, the verb would need *been*.",
    "*being built* 和 *be* 的形式一起构成现在进行时的被动语态。*has* 后面要接 *been*。",
  ],
  [
    "was",
    "is",
    "*at the moment* means now, so the progressive passive is in the present.",
    "*at the moment* 表示现在，所以进行时的被动语态要用现在时。",
  ],
  [
    "have",
    "had",
    "This sentence imagines the past, so the *if* part takes the past perfect. *have known* is not used after *If I* here.",
    "这个句子设想的是过去的情况，所以 *if* 从句要用过去完成时。这里 *If I* 后不能用 *have known*。",
  ],
  [
    "would",
    "had",
    "*would* goes in the other half of the sentence (*I would have come*). The *if* part takes the past perfect.",
    "*would* 用在句子的另一半（*I would have come*）。*if* 从句要用过去完成时。",
    /If I/u,
  ],
  [
    "would",
    "had",
    "*had better* is a fixed phrase for advice (short form *'d better*). *would better* is not English.",
    "*had better* 是表示建议的固定短语（缩写为 *'d better*）。没有 *would better* 的说法。",
    /better/u,
  ],
];

// Fixed phrases and linking words.

const fixedEntries: readonly Entry[] = [
  [
    "and|nor",
    "or",
    "*whether ... or not* is a fixed pair. *{w}* does not pair with *whether*.",
    "*whether ... or not* 是固定搭配。*{w}* 不与 *whether* 搭配。",
  ],
  [
    "at",
    "in",
    "*in the end* means 'finally'. *at the end* needs *of* and the thing that ends (*at the end of the film*).",
    "*in the end* 意思是“最后、终于”。*at the end* 后面要接 *of* 和结束的事物（*at the end of the film*）。",
    /the end/u,
  ],
  [
    "by|on",
    "in",
    "The fixed phrase for 'finally' is *in the end*. *{w} the end* does not have this meaning.",
    "表示“最后、终于”的固定短语是 *in the end*。*{w} the end* 没有这个意思。",
    /the end/u,
  ],
  [
    "because|due",
    "according",
    "*according to* gives a source of information: the map says so. *{w} to* gives a reason, which does not fit here.",
    "*according to* 表示信息的来源：地图上是这么说的。*{w} to* 表示原因，不合句意。",
  ],
  [
    "case",
    "order",
    "*in case* means 'because something might happen'. To say what something is for, a purpose, use *in order to*.",
    "*in case* 意思是“以防万一”。表示目的要用 *in order to*。",
  ],
  [
    "fact",
    "order",
    "*in fact* means 'actually' and is not followed by *to*. A purpose is *in order to*.",
    "*in fact* 意思是“事实上”，后面不接 *to*。表示目的要用 *in order to*。",
  ],
  [
    "case",
    "spite",
    "*in case of* means 'if there is'. The festival went ahead even though it rained, which is *in spite of*.",
    "*in case of* 意思是“如果发生”。下雨了节日仍然照常举行，要用 *in spite of*。",
  ],
  [
    "despite",
    "spite",
    "*despite* is used without *in* and *of*. Between *in* and *of*, the gap takes the noun inside *despite*, without its first letters.",
    "*despite* 不与 *in* 和 *of* 连用。*in* 和 *of* 之间要填 *despite* 去掉开头字母后的那个名词。",
  ],
  [
    "cause|reason",
    "result",
    "*As a result* introduces a consequence: failing came from not studying. *As a {w}* is not a fixed phrase.",
    "*As a result* 引出结果：没学习导致了考试不及格。*As a {w}* 不是固定短语。",
  ],
  [
    "point",
    "use",
    "*no point* goes with *There's*: *There's no point worrying*. After *It's no*, the phrase is *It's no use* with an *-ing* form.",
    "*no point* 与 *There's* 连用：*There's no point worrying*。*It's no* 后面的固定说法是 *It's no use* 加 -ing 形式。",
  ],
  [
    "help",
    "use",
    "*It's no help* is not followed by an *-ing* form this way. The fixed phrase is *It's no use* with an *-ing* form.",
    "*It's no help* 后面不这样接 -ing 形式。固定说法是 *It's no use* 加 -ing 形式。",
  ],
  [
    "instead",
    "rather",
    "*instead* needs *of* and an *-ing* form (*instead of taking*). Before *than* and a base verb, the gap needs the word of *would ___ than*.",
    "*instead* 后面要接 *of* 和 -ing 形式（*instead of taking*）。*than* 加动词原形前，要用 *would ___ than* 中的那个词。",
  ],
  [
    "other",
    "rather",
    "*other than* means 'except', which does not fit. For 'instead of', use *rather than*.",
    "*other than* 意思是“除了”，不合句意。表示“而不是”要用 *rather than*。",
  ],
  [
    "so|that",
    "as",
    "*{w} far ... I know* is not the fixed phrase. The fixed phrase has the same short word on both sides of *far*, the one in *___ big ___ a house*.",
    "*{w} far ... I know* 不是这个固定短语。这个固定短语在 *far* 两边用同一个短词，就是 *___ big ___ a house* 中的那个。",
    /far/u,
  ],
  [
    "so|that",
    "as",
    "*{w} long ...* is not the fixed phrase. The fixed phrase meaning 'only if' has the same short word on both sides of *long*, the one in *___ big ___ a house*.",
    "*{w} long ...* 不是这个固定短语。表示“只要”的固定短语在 *long* 两边用同一个短词，就是 *___ big ___ a house* 中的那个。",
    /long/u,
  ],
  [
    "so",
    "such",
    "*so* goes before an adjective alone, but the gap is followed by *a*, an adjective and a noun (*{a}*), which take another word.",
    "*so* 只放在单独的形容词前，但空格后是 *a* 加形容词和名词（*{a}*），要用另一个词。",
  ],
  [
    "very",
    "such",
    "*very* cannot lead to a result with *that*. Before *a*, an adjective and a noun, the word is *such ... that*.",
    "*very* 不能与 *that* 引出结果。在 *a* 加形容词和名词前要用 *such ... that*。",
  ],
  [
    "such",
    "so",
    "*such* needs a noun (*such a boring film*). Before an adjective alone, such as *{n}*, use *so ... that*.",
    "*such* 后面要有名词（*such a boring film*）。在 *{n}* 这样单独的形容词前要用 *so ... that*。",
  ],
  [
    "too",
    "so",
    "*too* means 'more than is good' and goes with *to* (*too tired to work*). A result with *that* takes another word before the adjective.",
    "*too* 意思是“太……”，与 *to* 连用（*too tired to work*）。用 *that* 引出结果时，形容词前要用另一个词。",
  ],
  [
    "very",
    "so",
    "*very* cannot lead to a result with *that*. An adjective followed by a result with *that* takes another word before it.",
    "*very* 不能与 *that* 引出结果。形容词后接 *that* 引出结果时，前面要用另一个词。",
  ],
  [
    "either",
    "neither",
    "After a negative statement, *and neither does ...* adds another negative. *either* goes at the end of a negative clause (*my brother doesn't either*).",
    "否定句之后，用 *and neither does ...* 表示另一个也不。*either* 放在否定句末尾（*my brother doesn't either*）。",
  ],
  [
    "so",
    "neither",
    "*so does ...* agrees with a positive statement, but *I don't like* is negative, which takes the word that agrees with a negative.",
    "*so does ...* 用在肯定句之后，但 *I don't like* 是否定句，要用附和否定句的词。",
  ],
  [
    "fact|order",
    "case",
    "*in case* and a clause mean 'because this might happen'. *in order* takes *to* and a verb, and *in fact* means 'actually'.",
    "*in case* 加从句表示“以防万一”。*in order* 后接 *to* 加动词，*in fact* 意思是“事实上”。",
  ],
  [
    "long",
    "soon",
    "*as long as* means 'only if'. For 'right after', use *as soon as*.",
    "*as long as* 意思是“只要”。表示“一……就……”要用 *as soon as*。",
  ],
  [
    "quick",
    "soon",
    "*as quick as* compares speed. The fixed phrase for 'right after' is *as soon as*.",
    "*as quick as* 比较的是速度。表示“一……就……”的固定短语是 *as soon as*。",
  ],
];

const contrastEntries: readonly Entry[] = [
  [
    "despite",
    "although",
    "*despite* is followed by a noun or an *-ing* form, but *{a}* is a clause with its own subject and verb, so it needs a conjunction of contrast.",
    "*despite* 后面接名词或 -ing 形式，但 *{a}* 是有主语和谓语的从句，所以要用表示让步的连词。",
  ],
  [
    "however",
    "although",
    "*however* cannot join two clauses inside one sentence; it starts a new sentence or follows a semicolon. Joining *{a}* to the main clause takes a conjunction of contrast.",
    "*however* 不能在一个句子里连接两个分句，它要放在新句子开头或分号后。要把 *{a}* 和主句连起来，需要表示让步的连词。",
  ],
  [
    "but",
    "although",
    "*but* stands between the two clauses and cannot begin the first one. A contrast placed first takes a conjunction that can open a sentence.",
    "*but* 放在两个分句之间，不能引导第一个分句。放在前面表示让步要用能放在句首的连词。",
  ],
  [
    "although",
    "despite",
    "*although* is followed by a whole clause, but *{a}* begins with a noun, which takes a preposition of contrast.",
    "*although* 后面接完整的从句，但 *{a}* 以名词开头，要用表示让步的介词。",
  ],
  [
    "however",
    "despite",
    "*however* cannot be followed straight by a noun inside a sentence. Before a noun such as *{a}*, a contrast takes a preposition.",
    "*however* 不能在句中直接接名词。在 *{a}* 这样的名词前表示让步要用介词。",
  ],
  [
    "because",
    "despite",
    "*because* gives a reason and needs a clause. Here the two things contrast (he got the job, yet he had no experience), and a noun follows, which takes a preposition of contrast.",
    "*because* 表示原因，后面要接从句。这里两件事是转折关系（他得到了工作，但没有经验），后面又是名词，要用表示让步的介词。",
  ],
];

const conjunctionEntries: readonly Entry[] = [
  [
    "although",
    "if",
    "*Although* shows a contrast, but working hard is the condition for passing, which takes a word of condition.",
    "*Although* 表示让步，但努力学习是通过考试的条件，要用表示条件的词。",
  ],
  [
    "because of",
    "if",
    "*because of* is followed by a noun, not a clause, and the meaning here is a condition, which takes a word of condition.",
    "*because of* 后面接名词，不接从句，而且这里表示条件，要用表示条件的词。",
  ],
  [
    "unless",
    "if",
    "*Unless* means 'if not', which would say that you pass by not working hard. The condition here is a positive one.",
    "*Unless* 意思是“如果不”，那就成了不努力才能通过。这里的条件是肯定的。",
  ],
  [
    "because",
    "although",
    "Being tired is not why he kept working; the two clauses contrast, which takes a conjunction of contrast.",
    "累了并不是他继续工作的原因，两个分句是让步关系，要用表示让步的连词。",
  ],
  [
    "but|so",
    "although",
    "*{w}* stands between two clauses and cannot begin the first one. A contrast placed first takes a conjunction that can open a sentence.",
    "*{w}* 放在两个分句之间，不能引导第一个分句。放在前面表示让步要用能放在句首的连词。",
  ],
  [
    "although|but",
    "because",
    "The bad weather is the reason for staying at home, not a contrast, so the gap needs a conjunction of reason.",
    "天气不好是待在家里的原因，不是转折，所以空格要用表示原因的连词。",
  ],
  [
    "so",
    "because",
    "*so* introduces a result, but *{a}* is the reason, so the gap needs a conjunction of reason.",
    "*so* 引出结果，但 *{a}* 是原因，所以空格要用表示原因的连词。",
  ],
  [
    "and",
    "but",
    "*and* only adds one thing to another. The rain goes against what I wanted, a contrast, which takes a conjunction of contrast.",
    "*and* 只是并列。下雨与我想做的事相反，是转折关系，要用表示转折的连词。",
  ],
  [
    "or",
    "but",
    "*or* offers a choice. The rain goes against what I wanted, a contrast, which takes a conjunction of contrast.",
    "*or* 表示选择。下雨与我想做的事相反，是转折关系，要用表示转折的连词。",
  ],
  [
    "so",
    "but",
    "*so* introduces a result. The rain goes against what I wanted, a contrast, which takes a conjunction of contrast.",
    "*so* 引出结果。下雨与我想做的事相反，是转折关系，要用表示转折的连词。",
  ],
  [
    "and|but|so",
    "or",
    "*{w}* does not give the meaning 'otherwise': hurry, if not, you will miss the bus. After an order, that meaning takes the conjunction that otherwise offers a choice.",
    "*{w}* 没有“否则”的意思：快点，不然会错过公交车。祈使句后表示“否则”，要用平时表示选择的那个连词。",
  ],
  [
    "because|since|so",
    "until",
    "*{w}* does not say how long the waiting lasts. The waiting goes on up to the moment I come back, which takes the conjunction meaning 'up to the time when'.",
    "*{w}* 不能说明等待持续多久。等待一直持续到我回来的那一刻，要用意思是“直到……为止”的连词。",
  ],
];

/** clozeMistakes is the feedback of the open cloze, by kind of gap. */
export const clozeMistakes: Record<string, WhyNot> = {
  article: explain(anBeforeVowel, oneOfMany, table(articleEntries)),
  preposition: explain(timePreposition, table(prepositionEntries)),
  auxiliary: explain(table(auxiliaryEntries)),
  pronoun: explain(table(pronounEntries)),
  linker: explain(table(contrastEntries), table(fixedEntries)),
  relative: explain(table(relativeEntries)),
  quantifier: explain(table(quantifierEntries), table(prepositionEntries)),
  fixed: explain(table(fixedEntries), table(prepositionEntries)),
};

/** freeMistakes is the feedback of grammar filling with no word given, by kind of gap. */
export const freeMistakes: Record<string, WhyNot> = {
  article: explain(anBeforeVowel, oneOfMany, table(articleEntries)),
  preposition: explain(timePreposition, table(prepositionEntries)),
  pronoun: explain(table(pronounEntries)),
  conjunction: explain(table(conjunctionEntries), table(fixedEntries)),
  relative: explain(table(relativeEntries)),
};

// Word classes.

type WordClass = "noun" | "person" | "thing" | "verb" | "adjective" | "adverb" | "ed" | "ing" | "comparative" | "superlative";

/** classes lists the word class of each wrong word of the word-building gaps. */
const classes: Record<WordClass, string> = {
  noun: "amazement benefit care curiosity fame friend friendship impression information sun sunshine beauty beauties drama honesty luck patience terror completion correction clarity courage identity news strength width ability difference solution harm",
  person: "assistant scientist visitor competitor resident player",
  thing: "competition location residence science visit visits politics",
  verb: "assist construct depart grow know win widen solve invite get walk read take soften",
  adjective:
    "brave constructive long possible similar wide willing bad beautiful careful complete correct dramatic honest lucky unlucky patient terrible true usual able clear courageous identical low new soft strong different scientific happy political legal comfortable necessary polite responsible predictable believable slow",
  adverb: "bravely possibly similarly carefully curiously famously beautifully happily harmfully clearly",
  ed: "grown known benefited changed enjoyed lowered corrected invited predicted",
  ing: "departing winning changing enjoying playing visiting inviting believing",
  comparative: "longer worse slower happier",
  superlative: "slowest",
};

/** classOf finds the word class of a wrong word. */
const classOf = (x: string): WordClass | undefined =>
  (Object.keys(classes) as WordClass[]).find((k) => classes[k].split(" ").includes(x.toLowerCase()));

const className: Record<WordClass, readonly [string, string]> = {
  noun: ["a noun", "名词"],
  person: ["a noun for a person", "指人的名词"],
  thing: ["a noun for a thing, a place or an activity", "指事物、地点或活动的名词"],
  verb: ["a verb", "动词"],
  adjective: ["an adjective", "形容词"],
  adverb: ["an adverb", "副词"],
  ed: ["the *-ed* form of a verb", "动词的 -ed 形式"],
  ing: ["the *-ing* form of a verb", "动词的 -ing 形式"],
  comparative: ["a comparative", "比较级"],
  superlative: ["a superlative", "最高级"],
};

/** need says what a gap needs, by its kind. */
const need: Record<string, readonly [string, string]> = {
  noun: [
    "the gap follows an article, a possessive or an adjective, or is the subject of the verb, so it needs a noun",
    "空格在冠词、所有格或形容词之后，或者作动词的主语，所以需要名词",
  ],
  person: ["the gap is a person, so it needs a noun for the one who does something", "空格指的是人，所以需要表示“做某事的人”的名词"],
  plural: ["the gap is the people who do something, and there is more than one of them", "空格指做某事的人，而且不止一个"],
  adjective: [
    "the gap describes a noun or follows a verb such as *be*, so it needs an adjective",
    "空格修饰名词或位于 *be* 这类动词之后，所以需要形容词",
  ],
  adverb: [
    "the gap describes a verb, an adjective or the whole sentence, so it needs an adverb",
    "空格修饰动词、形容词或整个句子，所以需要副词",
  ],
  verb: ["the gap follows *to*, a modal or a helping verb, so it needs a verb", "空格在 *to*、情态动词或助动词之后，所以需要动词"],
  negative: [
    "the gap describes something and the sentence shows a negative meaning, so it needs an adjective with a negative prefix",
    "空格起描述作用，而且句子表达的是否定的意思，所以需要带否定前缀的形容词",
  ],
};

/** wrongClass explains a word of the wrong class by what the gap needs. */
const wrongClass =
  (kind: string): Case =>
  (s) => {
    const k = classOf(low(s.wrong));
    const n = need[kind === "noun" && /(ian|er|or|ist|ant)$/u.test(low(s.right)) ? "person" : kind];
    if (!k || !n) return undefined;
    const [cEn, cZh] = className[k];
    return t(`*${s.wrong}* is ${cEn}, but ${n[0]}.`, `*${s.wrong}* 是${cZh}，但${n[1]}。`);
  };

const prefixes = ["un", "in", "im", "il", "ir", "dis", "mis"];

/** prefixOf splits a word into a negative prefix and the rest. */
const prefixOf = (x: string) => {
  const p = prefixes.find((q) => x.startsWith(q) && x.length > q.length + 3);
  return p ? ([p, x.slice(p.length)] as const) : undefined;
};

/** negativePrefix explains a negative word left without its prefix, or built with the wrong one. */
const negativePrefix: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  const rp = prefixOf(r);
  if (!rp) return undefined;
  const [right, base] = rp;
  if (w === base)
    return t(
      `*${s.wrong}* says the opposite of what the sentence means: the rest of it shows a negative meaning, so the word needs a negative prefix.`,
      `*${s.wrong}* 的意思和句意正好相反：句子其余部分表达的是否定意思，所以这个词要加否定前缀。`,
    );
  const wp = prefixOf(w);
  if (!wp || wp[1] !== base) return undefined;
  const wrong = wp[0];
  if (right === "il")
    return t(
      `Words that begin with *l* take *il-* for 'not' (*illogical*, *illiterate*), not *${wrong}-*.`,
      `以 *l* 开头的词表示“不”时用 *il-*（*illogical*、*illiterate*），不用 *${wrong}-*。`,
    );
  if (right === "ir")
    return t(
      `Words that begin with *r* take *ir-* for 'not' (*irregular*, *irrelevant*), not *${wrong}-*.`,
      `以 *r* 开头的词表示“不”时用 *ir-*（*irregular*、*irrelevant*），不用 *${wrong}-*。`,
    );
  if (right === "im")
    return t(
      `Words that begin with *p*, *m* or *b* usually take *im-* for 'not' (*impatient*, *immature*), not *${wrong}-*.`,
      `以 *p*、*m*、*b* 开头的词表示“不”时通常用 *im-*（*impatient*、*immature*），不用 *${wrong}-*。`,
    );
  if (right === "un")
    return t(`*${base}* takes *un-* for 'not'; *${wrong}-* is not used with it.`, `*${base}* 表示“不”时用 *un-*，不和 *${wrong}-* 连用。`);
  if (right === "dis")
    return t(
      `The negative of *${base}* is made with *dis-*, as in *dislike* and *disobey*, not with *${wrong}-*.`,
      `*${base}* 的否定形式用 *dis-* 构成，如 *dislike*、*disobey*，不用 *${wrong}-*。`,
    );
  if (right === "mis")
    return t(
      `*mis-* means 'wrongly' (to understand wrongly), while *${wrong}-* means 'not' or the opposite, which does not fit here.`,
      `*mis-* 意思是“错误地”（理解错了），而 *${wrong}-* 表示“不”或相反，不合句意。`,
    );
  return undefined;
};

/** pluralNeeded explains a singular noun where the sentence shows more than one. */
const pluralNeeded: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  if (!(r === `${w}s` || r === `${w}es`)) return undefined;
  const b = before(s);
  const clue = /^(two|three|four|many|all|both|of|these|those|several|more|thousands)$/iu.test(b) ? b : "";
  return clue
    ? t(
        `*${s.wrong}* is singular, but *${clue}* shows that there is more than one, so the noun is plural.`,
        `*${s.wrong}* 是单数，但 *${clue}* 说明不止一个，所以名词要用复数。`,
      )
    : t(
        `*${s.wrong}* is singular, but the verb *${after(s).split(" ")[0] || "after it"}* shows that there is more than one, so the noun is plural.`,
        `*${s.wrong}* 是单数，但动词 *${after(s).split(" ")[0] || "after it"}* 说明不止一个，所以名词要用复数。`,
      );
};

const formEntries: readonly Entry[] = [
  [
    "amazing",
    "amazed",
    "An *-ing* adjective describes what causes a feeling (*an amazing trick*). The children feel it, so the adjective ends in *-ed*.",
    "-ing 形容词描述引起某种感受的事物（*an amazing trick*）。孩子们是感受者，所以形容词以 *-ed* 结尾。",
  ],
  [
    "impressed",
    "impressive",
    "*impressed* describes a person who feels admiration. A collection that causes that feeling needs a different adjective made from *impress*.",
    "*impressed* 描述感到钦佩的人。引起这种感受的藏品要用 *impress* 构成的另一个形容词。",
  ],
  [
    "informed",
    "informative",
    "*informed* describes a person who knows a lot. A talk that gives information needs a different adjective made from *inform*.",
    "*informed* 描述了解情况的人。提供信息的讲座要用 *inform* 构成的另一个形容词。",
  ],
  [
    "benefited|changed|enjoyed",
    "*",
    "*{w}* is the past form of the verb and tells what happened once. The gap says what something is like, so it needs an adjective made with a suffix such as *-able* or *-ial*.",
    "*{w}* 是动词的过去式，说的是发生过的一件事。空格描述事物的性质，所以需要带 *-able*、*-ial* 这类后缀的形容词。",
  ],
  [
    "changing|enjoying",
    "*",
    "*{w}* is the *-ing* form of the verb and tells what is happening. The gap says what something is like, so it needs an adjective made with a suffix such as *-able*.",
    "*{w}* 是动词的 -ing 形式，说的是正在发生的事。空格描述事物的性质，所以需要带 *-able* 这类后缀的形容词。",
  ],
  [
    "assistant",
    "assistance",
    "*assistant* is a person who helps. You thank someone for the help itself, so the gap needs the noun for the act of helping.",
    "*assistant* 是助手，指人。感谢的是对方的帮助本身，所以空格需要表示“帮助”这个行为的名词。",
  ],
  [
    "politics",
    "politician",
    "*politics* is the activity or the subject. *a well-known ___* in his working life is a person, so the gap needs the noun for the one who does politics.",
    "*politics* 指政治这项活动或学科。*a well-known ___* 说的是一个人，所以空格需要表示从事政治的人的名词。",
  ],
  [
    "will",
    "willingness",
    "*will* as a noun means a strong wish or a legal paper. Being ready to help is a different noun, made from *willing*.",
    "*will* 作名词时指意志或遗嘱。乐于帮助是另一个名词，由 *willing* 构成。",
  ],
  [
    "incorrectly",
    "correctly",
    "*incorrectly* says the opposite of what happened: she got full marks, so her answers were right.",
    "*incorrectly* 的意思和事实相反：她得了满分，说明她的回答都是对的。",
  ],
  [
    "unusually",
    "usually",
    "*unusually* means 'not as normal', but closing on Mondays is what the shop normally does.",
    "*unusually* 意思是“异乎寻常地”，但周一关门正是这家店的常态。",
  ],
  [
    "unlucky",
    "luckily",
    "*Unlucky* is an adjective, and it says the opposite: nobody was hurt, which was good luck. The gap stands for the whole sentence, so it needs an adverb.",
    "*Unlucky* 是形容词，而且意思相反：没有人受伤，这是幸运的事。空格修饰整个句子，所以需要副词。",
  ],
  [
    "truely",
    "truly",
    "*true* is one of a few words that drop the final *e* before *-ly*.",
    "*true* 是少数几个加 *-ly* 时要去掉词尾 *e* 的词之一。",
  ],
  [
    "soften",
    "softened",
    "After *had*, the verb takes its past participle. *soften* is the base form.",
    "*had* 后面的动词要用过去分词。*soften* 是原形。",
  ],
  [
    "lowered",
    "lower",
    "After *had to*, the verb is in its base form. *lowered* is the past form.",
    "*had to* 后面的动词用原形。*lowered* 是过去式。",
  ],
  [
    "satisfying|pleasing",
    "*",
    "*{w}* describes what causes a feeling. The people here feel it, so the adjective ends in *-ed*, and the rest of the sentence shows that the feeling is negative.",
    "*{w}* 描述引起某种感受的事物。这里的人是感受者，所以形容词以 *-ed* 结尾，而且句子其余部分表明这种感受是否定的。",
  ],
  [
    "satisfied|pleased|agreed|appeared|understood",
    "*",
    "*{w}* says the opposite of what the sentence means: the rest of it shows a negative meaning, so the word needs a negative prefix.",
    "*{w}* 的意思和句意正好相反：句子其余部分表达的是否定意思，所以这个词要加否定前缀。",
  ],
  [
    "harmless",
    "harmful",
    "*harmless* means 'causing no harm', the opposite of what smoking does to your health.",
    "*harmless* 意思是“无害的”，和吸烟对健康的影响正好相反。",
  ],
  [
    "possible",
    "impossible",
    "*possible* says the opposite of what the sentence means: *we need more time* shows that the work cannot be finished, so the word needs a negative prefix.",
    "*possible* 的意思和句意相反：*we need more time* 说明工作完不成，所以这个词要加否定前缀。",
  ],
  [
    "boxs",
    "boxes",
    "Nouns that end in *x*, *s*, *sh* or *ch* add *-es* in the plural, not just *-s*.",
    "以 *x*、*s*、*sh*、*ch* 结尾的名词，复数加 *-es*，不是只加 *-s*。",
  ],
  [
    "boxies",
    "boxes",
    "*-ies* is for nouns that end in a consonant and *y* (*city* → *cities*). *box* ends in *x*, which adds *-es*.",
    "*-ies* 用于以“辅音字母 + *y*”结尾的名词（*city* → *cities*）。*box* 以 *x* 结尾，复数加 *-es*。",
  ],
  ["childs", "children", "*child* has an irregular plural; it does not add *-s*.", "*child* 的复数是不规则的，不加 *-s*。"],
  [
    "childrens",
    "children",
    "The irregular plural of *child* is already plural, so it takes no extra *-s*.",
    "*child* 的不规则复数本身已经是复数，不能再加 *-s*。",
  ],
  [
    "knifes",
    "knives",
    "Many nouns that end in *-fe* or *-f* change it to *-ves* in the plural (*wife* → *wives*, *leaf* → *leaves*).",
    "许多以 *-fe* 或 *-f* 结尾的名词，复数要把它变成 *-ves*（*wife* → *wives*，*leaf* → *leaves*）。",
  ],
  [
    "knife",
    "knives",
    "*knife* is singular, but *two* shows more than one, so the noun is plural, and a noun that ends in *-fe* changes its ending in the plural.",
    "*knife* 是单数，但 *two* 说明不止一把，所以要用复数，而以 *-fe* 结尾的名词变复数时词尾要改变。",
  ],
  [
    "knive",
    "knives",
    "*two* shows more than one, but *knive* has no plural ending, and it is not a word on its own.",
    "*two* 说明不止一把，但 *knive* 没有复数词尾，它本身也不是一个单词。",
  ],
  [
    "child",
    "children",
    "*child* is singular, but the verb *were* shows more than one, and *child* has an irregular plural.",
    "*child* 是单数，但动词 *were* 说明不止一个，而且 *child* 的复数是不规则的。",
  ],
];

const comparisonEntries: readonly Entry[] = [
  [
    "better",
    "best",
    "*better* compares two things. *the ... I have ever had* compares one with all the others, so it needs the superlative.",
    "*better* 用于两者比较。*the ... I have ever had* 是把一个和其他所有的比，所以要用最高级。",
  ],
  [
    "good",
    "best",
    "*the ... I have ever had* compares one with all the others, so the adjective changes to its superlative, and *good* is irregular.",
    "*the ... I have ever had* 是把一个和其他所有的比，所以形容词要变成最高级，而 *good* 的变化是不规则的。",
  ],
  [
    "most good",
    "best",
    "*good* is irregular: it never takes *more* or *most*.",
    "*good* 的比较级和最高级是不规则的，从不加 *more* 或 *most*。",
  ],
  [
    "fast|faster",
    "fastest",
    "*Of all the students* and *the* compare one with all the others, so the word needs the superlative.",
    "*Of all the students* 和 *the* 是把一个和其他所有的比，所以要用最高级。",
  ],
  [
    "most fast",
    "fastest",
    "*fast* is a short word, so its superlative takes *-est*, not *most*.",
    "*fast* 是短词，最高级加 *-est*，不用 *most*。",
  ],
  [
    "confident|most confident",
    "more confident",
    "*The more ..., the ...* needs a comparative in both halves: *the more you practise, the more ...*.",
    "*The more ..., the ...* 前后两半都要用比较级：*the more you practise, the more ...*。",
  ],
  [
    "confidenter",
    "more confident",
    "*confident* has three syllables, so its comparative is made with *more*, not *-er*.",
    "*confident* 有三个音节，比较级用 *more* 构成，不加 *-er*。",
  ],
];

/** moreForShort explains *more* put before a short adjective that takes *-er*. */
const moreForShort: Case = (s) => {
  const m = /^more (\w+)$/u.exec(low(s.wrong));
  if (!m || !/er$/u.test(low(s.right)) || low(s.right).startsWith("more")) return undefined;
  return t(
    `*${m[1]}* is a short adjective, so its comparative takes *-er*, not *more*.`,
    `*${m[1]}* 是短形容词，比较级加 *-er*，不用 *more*。`,
  );
};

/** comparativeNeeded explains a plain or superlative adjective before *than*. */
const comparativeNeeded: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  if (!/\bthan\b/u.test(s.shown) || !/er$/u.test(r)) return undefined;
  if (/est$/u.test(w))
    return t(
      `*than* compares two things, so the adjective takes its comparative, not the superlative *${s.wrong}*.`,
      `*than* 用于两者比较，所以形容词要用比较级，不用最高级 *${s.wrong}*。`,
    );
  if (!w.includes(" ") && r.startsWith(w.slice(0, -1)))
    return t(
      `*than* shows a comparison, so the adjective cannot stay as *${s.wrong}*; it changes to its comparative.`,
      `*than* 表示比较，所以形容词不能保持原形 *${s.wrong}*，要变成比较级。`,
    );
  return undefined;
};

/** pastTime finds the words of a sentence that place it in a finished past. */
const pastTime = (x: string) => /\b(yesterday|the day before yesterday|last \w+|\w+ days? ago|in \d{4})\b/iu.exec(x)?.[0];

/** passiveNeedsBe explains a passive written without *be*, or with *be* in the wrong tense. */
const passiveNeedsBe: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  const m = /^(was|were|is|are|will be|has been|have been) (\w+)$/u.exec(r);
  if (!m) return undefined;
  const time = pastTime(s.shown);
  if (w === m[2] || (w !== m[2] && !w.includes(" ") && /ed$/u.test(w) && m[2] === w))
    return t(
      `*${s.wrong}* alone cannot be the verb of the sentence: the subject receives the action, so the passive needs a form of *be* before the participle${time ? `, in the past because of *${time}*` : ""}.`,
      `*${s.wrong}* 单独不能作谓语：主语是动作的承受者，所以被动语态的过去分词前要有 *be* 的形式${time ? `，而且 *${time}* 要求用过去时` : ""}。`,
    );
  const be = /^(was|were|is|are|will be|has been|have been) (\w+)$/u.exec(w);
  if (be && be[1] === m[1] && be[2] !== m[2])
    return t(
      `After *${be[1]}*, the passive needs the past participle, the third form of the verb. *${be[2]}* is not that form.`,
      `*${be[1]}* 后面的被动语态要用过去分词，即动词的第三种形式。*${be[2]}* 不是这个形式。`,
    );
  if (/^(is|are) /u.test(w) && w.endsWith(m[2] ?? "") && time)
    return t(
      `*${time}* is a finished past time, so *be* in the passive goes in the past simple, not the present.`,
      `*${time}* 是已经结束的过去时间，所以被动语态中的 *be* 要用一般过去时，不用现在时。`,
    );
  return undefined;
};

const passiveEntries: readonly Entry[] = [
  [
    "asked",
    "were asked",
    "*asked* alone would make the students the ones who asked. They received the request, so the verb is passive, with *be* in the past before the participle.",
    "只用 *asked* 就成了学生们去要求别人。他们是被要求的一方，所以要用被动语态：过去分词前加过去时的 *be*。",
  ],
  [
    "is put",
    "will be put",
    "*If it rains tomorrow* points to the future, so the main clause takes the future passive, not the present.",
    "*If it rains tomorrow* 指向将来，所以主句要用一般将来时的被动语态，不用现在时。",
  ],
  [
    "was put",
    "will be put",
    "*If it rains tomorrow* points to the future, so the main clause takes the future passive, not the past.",
    "*If it rains tomorrow* 指向将来，所以主句要用一般将来时的被动语态，不用过去时。",
  ],
  [
    "will put",
    "will be put",
    "*will put* is active, but the meeting does not put anything off; someone puts it off, so the verb is passive, with *be* before the participle.",
    "*will put* 是主动语态，但运动会不会自己推迟，是被人推迟的，所以要用被动语态，过去分词前要有 *be*。",
  ],
  [
    "is speaking|speaks",
    "is spoken",
    "*{w}* is active, as if English did the speaking. People speak English, so the verb is passive: *be* and the past participle.",
    "*{w}* 是主动语态，好像是英语在说话。英语是被人说的，所以要用被动语态：*be* 加过去分词。",
  ],
  [
    "built",
    "was built",
    "*built* alone would make the bridge the builder. It was built by people, so the passive needs *be* in the past before the participle.",
    "只用 *built* 就成了桥去建造东西。桥是被人建造的，所以被动语态的过去分词前要有过去时的 *be*。",
  ],
  [
    "is built",
    "was built",
    "*in 1998* is a finished past time, so *be* in the passive goes in the past simple, not the present.",
    "*in 1998* 是已经结束的过去时间，所以被动语态中的 *be* 要用一般过去时，不用现在时。",
  ],
  [
    "was build",
    "was built",
    "After *was*, the passive needs the past participle. *build* is the base form.",
    "*was* 后面的被动语态要用过去分词。*build* 是原形。",
  ],
];

const tenseEntries: readonly Entry[] = [
  [
    "are|were",
    "have been",
    "*in the past ten years* reaches up to now, so the verb takes the present perfect. *{w}* is a simple tense.",
    "*in the past ten years* 一直延续到现在，所以动词要用现在完成时。*{w}* 是一般时态。",
  ],
  [
    "has been",
    "have been",
    "After *There*, the verb agrees with the noun that follows: *a lot of changes* is plural, so it takes *have*, not *has*.",
    "*There* 后的动词与后面的名词一致：*a lot of changes* 是复数，所以用 *have*，不用 *has*。",
  ],
  [
    "cooked",
    "was cooking",
    "*When I got home* marks a moment in the past, and the cooking was already going on then. That takes the past progressive, not the past simple.",
    "*When I got home* 指过去的一个时刻，那时做饭正在进行，所以要用过去进行时，不用一般过去时。",
  ],
  [
    "has cooked|is cooking",
    "was cooking",
    "*When I got home* places the action in the past, so the verb goes in a past tense; the cooking was going on at that moment.",
    "*When I got home* 说明动作发生在过去，所以动词要用过去的时态；那时做饭正在进行。",
  ],
  [
    "had lived",
    "have lived",
    "*since I was ten* reaches up to now, so the verb takes the present perfect. *had lived* is the past perfect, for a time before another past event.",
    "*since I was ten* 一直延续到现在，所以要用现在完成时。*had lived* 是过去完成时，用于另一个过去事件之前。",
  ],
  [
    "live|lived",
    "have lived",
    "*since I was ten* reaches from a past point up to now, so the verb takes the present perfect. *{w}* is a simple tense.",
    "*since I was ten* 从过去某一点延续到现在，所以要用现在完成时。*{w}* 是一般时态。",
  ],
  [
    "has started|started",
    "had started",
    "The film started before another past event, *we arrived*. *By the time* with a past event takes the past perfect.",
    "电影开始在另一个过去的事件 *we arrived* 之前。*By the time* 加过去的事件要求用过去完成时。",
  ],
  [
    "was started",
    "had started",
    "*was started* is passive, but the film started by itself. It started before another past event, which takes the past perfect.",
    "*was started* 是被动语态，但电影是自己开始的。它发生在另一个过去的事件之前，要用过去完成时。",
  ],
  [
    "has taught",
    "taught",
    "*last year* is a finished past time, so the verb takes the past simple. The present perfect cannot go with *last year*.",
    "*last year* 是已经结束的过去时间，所以要用一般过去时。现在完成时不能和 *last year* 连用。",
  ],
  ["teached", "taught", "*teach* is irregular; its past form does not end in *-ed*.", "*teach* 是不规则动词，过去式不以 *-ed* 结尾。"],
  [
    "teaches",
    "taught",
    "*last year* places this in the past, so the verb takes its past form. *teaches* is a present form.",
    "*last year* 说明这是过去的事，所以动词要用过去式。*teaches* 是现在时的形式。",
  ],
  [
    "play|played|were playing",
    "are playing",
    "*Look!* shows that the action is happening right now, so the verb takes the present progressive. *{w}* is not that tense.",
    "*Look!* 说明动作此刻正在发生，所以要用现在进行时。*{w}* 不是这个时态。",
  ],
];

const nonfiniteEntries: readonly Entry[] = [
  [
    "walked",
    "walking",
    "The sentence already has its main verb, *saw*, and *we* did the walking at the same time, so the verb is the active *-ing* form. *Walked* would be passive or a second main verb.",
    "句子已有谓语 *saw*，而且是 *we* 同时在走，所以用表示主动的 -ing 形式。*Walked* 表示被动，或者成了第二个谓语。",
  ],
  [
    "walk|to walk",
    "walking",
    "The sentence already has its main verb, *saw*, and this verb tells what *we* were doing at the same time, which takes the *-ing* form. *{w}* does not do that.",
    "句子已有谓语 *saw*，这个动词说明 *we* 同时在做什么，要用 -ing 形式。*{w}* 不能这样用。",
  ],
  [
    "get|got|to get",
    "getting",
    "In *be used to*, *to* is a preposition, so it is followed by an *-ing* form, not by *{w}*.",
    "*be used to* 中的 *to* 是介词，后面接 -ing 形式，不接 *{w}*。",
  ],
  [
    "is written",
    "written",
    "The sentence already has its main verb, *is*, so this verb cannot be a second one. A letter that someone wrote takes the past participle alone.",
    "句子已有谓语 *is*，这个动词不能再作谓语。“被人写的信”只用过去分词。",
  ],
  [
    "writing|wrote",
    "written",
    "The letter does not write; someone wrote it, so the verb that describes it is the past participle. *{w}* is not that form.",
    "信不会写字，是被人写的，所以修饰它的动词用过去分词。*{w}* 不是这个形式。",
  ],
  ["leaded", "led", "*lead* is irregular; its past participle does not end in *-ed*.", "*lead* 是不规则动词，过去分词不以 *-ed* 结尾。"],
  [
    "leading|to lead",
    "led",
    "*by a young coach* shows that the team receives the action, so the verb that describes it is the past participle. *{w}* is not that form.",
    "*by a young coach* 说明球队是动作的承受者，所以修饰它的动词用过去分词。*{w}* 不是这个形式。",
  ],
  [
    "read|reads|to read",
    "reading",
    "*finish* is followed by the *-ing* form of a verb, not by *{w}*.",
    "*finish* 后面接动词的 -ing 形式，不接 *{w}*。",
  ],
  [
    "stands|stood",
    "standing",
    "The sentence already has its main verb, *is*, so this verb cannot be a second one. A girl who is standing there takes the *-ing* form.",
    "句子已有谓语 *is*，这个动词不能再作谓语。“正站在那里的女孩”用 -ing 形式。",
  ],
  [
    "to stand",
    "standing",
    "*to stand* would say what the girl is going to do. She is standing there now, which takes the *-ing* form.",
    "*to stand* 表示女孩将要做的事。她现在正站在那里，要用 -ing 形式。",
  ],
  [
    "surprise|surprisedly",
    "surprised",
    "After *was very*, the gap describes how he felt, so it needs an adjective. *{w}* is not an adjective.",
    "*was very* 后面的空格描述他的感受，所以需要形容词。*{w}* 不是形容词。",
  ],
  [
    "surprising",
    "surprised",
    "An *-ing* adjective describes what causes a feeling. He is the one who feels it, so the adjective ends in *-ed*.",
    "-ing 形容词描述引起某种感受的事物。他是感受者，所以形容词以 *-ed* 结尾。",
  ],
  [
    "surprised",
    "surprising",
    "An *-ed* adjective describes a person who feels something. A result causes the feeling, so the adjective ends in *-ing*.",
    "-ed 形容词描述有某种感受的人。结果是引起感受的事物，所以形容词以 *-ing* 结尾。",
  ],
  [
    "surprise|surprisingly",
    "surprising",
    "After *a* and before the noun *result*, the gap describes the noun, so it needs an adjective. *{w}* is not an adjective.",
    "空格在 *a* 之后、名词 *result* 之前，修饰名词，所以需要形容词。*{w}* 不是形容词。",
  ],
  [
    "take|taking|took",
    "to take",
    "*decide* is followed by *to* and the base form of a verb, not by *{w}*.",
    "*decide* 后面接 *to* 加动词原形，不接 *{w}*。",
  ],
];

const nounEntries: readonly Entry[] = [
  [
    "visits",
    "visitors",
    "*visits* are events. The ones who *come to the old town* are people, so the gap needs the plural noun for the people who visit.",
    "*visits* 指访问这件事。*come to the old town* 的是人，所以空格需要表示“参观者”的复数名词。",
  ],
];

/** formMistakes is the feedback of word formation, by kind of gap. */
export const formMistakes: Record<string, WhyNot> = {
  noun: explain(table(formEntries), wrongClass("noun")),
  adjective: explain(table(formEntries), wrongClass("adjective")),
  verb: explain(table(formEntries), wrongClass("verb")),
  negative: explain(table(formEntries), negativePrefix, wrongClass("negative")),
  adverb: explain(table(formEntries), wrongClass("adverb")),
  plural: explain(table(formEntries), table(nounEntries), pluralNeeded, wrongClass("plural")),
};

/** givenMistakes is the feedback of grammar filling with a given word, by kind of gap. */
export const givenMistakes: Record<string, WhyNot> = {
  tense: explain(table(tenseEntries)),
  passive: explain(table(passiveEntries), passiveNeedsBe),
  nonfinite: explain(table(nonfiniteEntries)),
  comparison: explain(table(comparisonEntries), moreForShort, comparativeNeeded, spelling),
  noun: explain(table(formEntries), table(nounEntries), pluralNeeded, wrongClass("noun")),
  adverb: explain(table(formEntries), wrongClass("adverb")),
  adjective: explain(table(formEntries), negativePrefix, wrongClass("adjective")),
  relative: explain(table(relativeEntries)),
};

// Key word transformations.

/** words splits a stretch of text into words, with short forms of *not* written out. */
const words = (x: string) =>
  low(x)
    .replace(/\bcan't\b/gu, "can not")
    .replace(/\bwon't\b/gu, "will not")
    .replace(/(\w)n't\b/gu, "$1 not")
    .split(/\s+/u)
    .filter(Boolean);

/** left is the one word of the right answer that the response leaves out, if that is all it does. */
const left = (s: Seen) => {
  const [w, r] = [words(s.wrong), words(s.right)];
  if (r.length !== w.length + 1) return undefined;
  for (let i = 0; i < r.length; i++) if ([...r.slice(0, i), ...r.slice(i + 1)].join(" ") === w.join(" ")) return r[i];
  return undefined;
};

/** notMissing explains a rewrite that leaves out *not*, so that it no longer means the same. */
const notMissing: Case = when(
  (s) => left(s) === "not",
  t(
    "The rewrite has no *not*, so it says something different from the first sentence. To keep the same meaning, it needs a negative.",
    "改写的句子里没有 *not*，意思就和第一句不同了。要保持原意，句子需要否定。",
  ),
);

/** leftOut explains a word that a rewrite leaves out, by what the word is for. */
const leftOut =
  (word: string, say: Text, shown?: RegExp): Case =>
  (s) =>
    left(s) === word && (!shown || shown.test(s.shown)) ? say : undefined;

const leftOutCases: readonly Case[] = [
  leftOut(
    "have",
    t(
      "A modal about the past needs *have* between the modal and the past participle; here *have* is missing.",
      "表示对过去的推测或判断时，情态动词和过去分词之间要有 *have*，这里漏掉了 *have*。",
    ),
  ),
  leftOut(
    "been",
    t(
      "The subject receives the action, so the perfect is passive: *been* goes between *have* and the past participle.",
      "主语是动作的承受者，所以完成时要用被动语态：*have* 和过去分词之间要有 *been*。",
    ),
  ),
  leftOut("be", t("After *will*, the passive needs *be* before the past participle.", "*will* 后面的被动语态，过去分词前要有 *be*。")),
  ...["was", "is", "were", "are"].map((be) =>
    leftOut(
      be,
      t(
        "The subject receives the action, so the verb is passive, and the passive needs a form of *be* before the participle.",
        "主语是动作的承受者，所以要用被动语态，而被动语态的过去分词前要有 *be* 的形式。",
      ),
    ),
  ),
  leftOut(
    "as",
    t(
      "*{w} long ...* is not the fixed phrase. The fixed phrase meaning 'only if' has the same short word on both sides of *long*, the one in *___ big ___ a house*.",
      "*{w} long ...* 不是这个固定短语。表示“只要”的固定短语在 *long* 两边用同一个短词，就是 *___ big ___ a house* 中的那个。",
    ),
  ),
  leftOut(
    "the",
    t(
      "*The more ..., the ...* needs *the* before the comparative in both halves.",
      "*The more ..., the ...* 前后两半的比较级前都要有 *the*。",
    ),
  ),
  leftOut(
    "would",
    t(
      "*rather* in this sense needs *would* before it: *would rather* and the base verb.",
      "表示“宁愿”时，*rather* 前要有 *would*：*would rather* 加动词原形。",
    ),
  ),
  leftOut("to", t("*be allowed* is followed by *to* and the base verb.", "*be allowed* 后面接 *to* 加动词原形。"), /ALLOWED/u),
  leftOut(
    "to",
    t(
      "*look forward* takes *to*, and this *to* is a preposition, so a noun or an *-ing* form follows it.",
      "*look forward* 后面接 *to*，这个 *to* 是介词，后面接名词或 -ing 形式。",
    ),
    /FORWARD/u,
  ),
  leftOut(
    "to",
    t(
      "For something you still have to do, *forget* is followed by *to* and the base verb.",
      "表示忘记要做的事时，*forget* 后面接 *to* 加动词原形。",
    ),
    /FORGET/u,
  ),
  leftOut("in", t("*succeed* takes *in* and an *-ing* form.", "*succeed* 后面接 *in* 加 -ing 形式。"), /SUCCEEDED/u),
  leftOut(
    "in",
    t("The fixed phrase is *in charge of*, with *in* before *charge*.", "固定短语是 *in charge of*，*charge* 前要有 *in*。"),
    /CHARGE/u,
  ),
  leftOut("of", t("*run out* takes *of* before the thing there is none left of.", "*run out* 后面接 *of*，再接用完的东西。")),
  leftOut(
    "with",
    t(
      "*put up with* means 'accept something you do not like', and it needs *with* before that thing.",
      "*put up with* 意思是“忍受”，后面要有 *with* 再接忍受的事物。",
    ),
  ),
  leftOut(
    "off",
    t("*put* alone does not mean 'move to a later time'; that is *put off*.", "单独的 *put* 没有“推迟”的意思，“推迟”是 *put off*。"),
  ),
  leftOut(
    "up",
    t(
      "*bring up* means 'raise a child'. Without *up*, *bring* means 'carry here'.",
      "*bring up* 意思是“抚养”。没有 *up*，*bring* 的意思是“带来”。",
    ),
  ),
];

/** asWithComparative explains a comparative with *-er* put inside *as ... as*. */
const asWithComparative: Case = when(
  (s) => /\b\w+er as\b/u.test(low(s.wrong)) && !/\bas \w+er as\b/u.test(low(s.right)),
  t(
    "*as ... as* takes the plain form of the adjective. The comparative with *-er* goes with *than*.",
    "*as ... as* 中间用形容词原级。带 *-er* 的比较级与 *than* 连用。",
  ),
);

const modals = "can|could|must|might|may|should|needn't|can't|couldn't|mustn't|shouldn't";

/** modalBase explains a modal with the base form where the first sentence is about the past. */
const modalBase: Case = (s) => {
  const w = low(s.wrong);
  const r = low(s.right);
  const m = new RegExp(`^(${modals})( not)? (\\w+)`, "u").exec(w);
  if (!m || !new RegExp(`^${m[1]}( not)? have \\w+`, "u").test(r) || m[3] === "have") return undefined;
  return t(
    `*${m[1]}* with the base form talks about now or later. The first sentence is about the past, so the modal takes *have* and the past participle.`,
    `*${m[1]}* 加动词原形说的是现在或将来。第一句说的是过去的事，所以情态动词后要接 *have* 加过去分词。`,
  );
};

/** mustNotForCannot explains *mustn't have* where the rewrite means 'I'm sure it did not happen'. */
const mustNotForCannot: Case = when(
  (s) => /^mustn't have /u.test(low(s.wrong)) && /^can't have /u.test(low(s.right)),
  t(
    "*mustn't* means 'it is not allowed', not 'I'm sure it is not true'. A sure 'no' about the past uses *can't have*.",
    "*mustn't* 意思是“不允许”，不是“肯定不是”。对过去作肯定否定的推测用 *can't have*。",
  ),
);

/** wishPast explains *didn't* after *I wish* about something that already happened. */
const wishPast: Case = when(
  (s) => /^didn't /u.test(low(s.wrong)) && /^hadn't /u.test(low(s.right)),
  t(
    "*I wish* about something that already happened moves one tense further back, to the past perfect: *had not* and the past participle. *didn't* would wish about the present.",
    "用 *I wish* 表达对已经发生的事的遗憾时，时态要再往前推，用过去完成时：*had not* 加过去分词。*didn't* 是对现在的愿望。",
  ),
);

const transformEntries: readonly Entry[] = [
  ["a best film", "the best film", "A superlative takes *the*: there is only one best.", "最高级前要用 *the*：最好的只有一个。"],
  [
    "as easy as",
    "not as difficult as",
    "*easier than I expected* means that the test turned out less difficult than expected. *as easy as I expected* says it was just as expected, which changes the meaning.",
    "*easier than I expected* 表示考试比预想的容易。*as easy as I expected* 表示和预想的一样，意思变了。",
  ],
  [
    "not as easy as",
    "not as difficult as",
    "*not as easy as I expected* says the opposite of the first sentence, which says the test was easier than expected.",
    "*not as easy as I expected* 和第一句意思相反，第一句说的是考试比预想的容易。",
  ],
  [
    "as quick as",
    "as quickly as",
    "The gap describes how the bus *travels*, a verb, so it needs an adverb, and the key word must be used without changing it.",
    "空格描述公交车怎样 *travel*，修饰动词，所以需要副词，而且关键词必须原样使用。",
  ],
  [
    "quicker than",
    "as quickly as",
    "The key word must be used without changing it, and with *doesn't ... the train* it makes the pattern *as ... as*.",
    "关键词必须原样使用，与 *doesn't ... the train* 搭配构成 *as ... as* 结构。",
  ],
  [
    "enough strong to",
    "not strong enough to",
    "*enough* goes after an adjective, and the sentence needs *not* to keep the meaning of *too heavy*.",
    "*enough* 放在形容词后面，而且句子需要 *not* 才能保持 *too heavy* 的意思。",
  ],
  [
    "is faster than",
    "runs faster than",
    "*faster* here describes how she runs, so the verb is *run*, not *be*.",
    "这里的 *faster* 描述她跑得怎样，所以动词是 *run*，不是 *be*。",
  ],
  [
    "run faster than",
    "runs faster than",
    "*Nobody* is singular, so the verb in the present simple takes *-s*.",
    "*Nobody* 是单数，所以一般现在时的动词要加 *-s*。",
  ],
  [
    "is not taller than",
    "is not as tall as",
    "*not taller than* does not say that he is shorter, and the key word *AS* is not used.",
    "*not taller than* 没有说出他更矮，而且没有用关键词 *AS*。",
  ],
  [
    "the best you will",
    "the better you will",
    "*The more ..., the ...* compares in both halves, so it needs the comparative, not the superlative.",
    "*The more ..., the ...* 前后两半都在比较，所以要用比较级，不用最高级。",
  ],
  [
    "the better film",
    "the best film",
    "*the ... I've ever seen* compares one film with all the others, so it needs the superlative, and the key word is not used.",
    "*the ... I've ever seen* 是把一部电影和其他所有的比，所以要用最高级，而且没有用关键词。",
  ],
  [
    "two years younger as",
    "two years younger than",
    "A comparative with *-er* is followed by *than*, not *as*.",
    "带 *-er* 的比较级后面接 *than*，不接 *as*。",
  ],
  [
    "younger two years than",
    "two years younger than",
    "The amount of the difference comes before the comparative: *two years* goes before *younger*.",
    "表示相差多少的词放在比较级前：*two years* 放在 *younger* 前面。",
  ],
  [
    "were not as much",
    "were not as many",
    "*people* can be counted, so it takes *many*; *much* is for things that cannot be counted, and the key word is not used.",
    "*people* 可数，要用 *many*；*much* 用于不可数的事物，而且没有用关键词。",
  ],
  [
    "would rather to walk than",
    "would rather walk than",
    "*would rather* is followed by the base verb, without *to*.",
    "*would rather* 后面接动词原形，不加 *to*。",
  ],
  [
    "as soon as you",
    "as long as you",
    "*as soon as* means 'right after'. The first sentence says 'only if', which is *as long as*.",
    "*as soon as* 意思是“一……就……”。第一句表示“只有……才”，要用 *as long as*。",
  ],
  [
    "have known|knew",
    "had known",
    "The first sentence is about the past, so the *if* part goes one tense further back, to the past perfect. *{w}* does not do that.",
    "第一句说的是过去的事，所以 *if* 从句的时态要再往前推，用过去完成时。*{w}* 做不到这一点。",
  ],
  [
    "if we left",
    "if we had left",
    "*would have caught* imagines the past, so the *if* part takes the past perfect, not the past simple.",
    "*would have caught* 设想的是过去，所以 *if* 从句要用过去完成时，不用一般过去时。",
  ],
  [
    "if we would have left",
    "if we had left",
    "*would* does not go in the *if* part. When the result imagines the past, the *if* part takes the past perfect.",
    "*if* 从句中不用 *would*。结果设想的是过去时，*if* 从句要用过去完成时。",
  ],
  [
    "if you study",
    "unless you study",
    "*if you study* says the opposite of the first sentence, and the key word *UNLESS* is not used.",
    "*if you study* 和第一句意思相反，而且没有用关键词 *UNLESS*。",
  ],
  [
    "unless you don't study",
    "unless you study",
    "*unless* already means 'if not', so *don't* makes a double negative that says the opposite.",
    "*unless* 本身就是“如果不”的意思，再加 *don't* 就成了双重否定，意思反了。",
  ],
  [
    "in case it will get",
    "in case it gets",
    "After *in case*, the present simple talks about the future; *will* is not used.",
    "*in case* 后面用一般现在时表示将来，不用 *will*。",
  ],
  [
    "in case of it gets",
    "in case it gets",
    "*in case of* is followed by a noun. Before a clause, use *in case* alone.",
    "*in case of* 后面接名词。从句前只用 *in case*。",
  ],
  [
    "was not for",
    "had not been for",
    "*would have failed* imagines the past, so the *if* part takes the past perfect, and the key word *BEEN* is not used.",
    "*would have failed* 设想的是过去，所以 *if* 从句要用过去完成时，而且没有用关键词 *BEEN*。",
  ],
  [
    "will drive you",
    "would drive you",
    "*If I had a car* imagines something that is not true now, so the other half takes *would*, not *will*.",
    "*If I had a car* 设想的是与现在事实相反的情况，所以另一半用 *would*，不用 *will*。",
  ],
  [
    "would have driven you",
    "would drive you",
    "*If I had a car* is about now, not the past, so the other half is *would* and the base verb.",
    "*If I had a car* 说的是现在，不是过去，所以另一半用 *would* 加动词原形。",
  ],
  [
    "wish you can",
    "wish you could",
    "*I wish* about now moves the verb one tense back: *can* becomes its past form.",
    "对现在的愿望用 *I wish* 时，动词要往前推一个时态：*can* 要变成过去式。",
  ],
  [
    "wish you would can",
    "wish you could",
    "*would* and *can* are both modals, and two modals cannot stand together. After *wish*, *can* moves back to its past form.",
    "*would* 和 *can* 都是情态动词，两个情态动词不能连用。*wish* 后的 *can* 要变成过去式。",
  ],
  [
    "would had played",
    "would have played",
    "After *would*, the verb is in its base form, so it is *would have* and the past participle. *had* is not the base form.",
    "*would* 后面的动词用原形，所以是 *would have* 加过去分词。*had* 不是原形。",
  ],
  [
    "would play",
    "would have played",
    "*He was ill* is about the past, so the result imagines the past: *would have* and the past participle.",
    "*He was ill* 说的是过去，所以结果要设想过去：*would have* 加过去分词。",
  ],
  [
    "can't be",
    "can't have been",
    "The first sentence is about the past (*wasn't*), so *can't* takes *have* and the past participle, and the key word *BEEN* is not used.",
    "第一句说的是过去（*wasn't*），所以 *can't* 后要接 *have* 加过去分词，而且没有用关键词 *BEEN*。",
  ],
  [
    "wish i have taken",
    "wish i had taken",
    "*I wish* about something that already happened takes the past perfect, with *had*. *have taken* is the present perfect.",
    "用 *I wish* 表达对已经发生的事的遗憾时用过去完成时，要用 *had*。*have taken* 是现在完成时。",
  ],
  [
    "wish i took",
    "wish i had taken",
    "*I wish* about something that already happened moves one tense further back, to the past perfect. *took* is the past simple, which would wish about the present.",
    "用 *I wish* 表达对已经发生的事的遗憾时，时态要再往前推，用过去完成时。*took* 是一般过去时，表达的是对现在的愿望。",
  ],
  [
    "should have not left",
    "should not have left",
    "*not* goes straight after the modal: *should not have* and the past participle.",
    "*not* 紧跟在情态动词后面：*should not have* 加过去分词。",
  ],
  [
    "didn't tell",
    "was not told",
    "With *I* as the subject, I received the action, so the verb is passive: *be*, *not* and the past participle. *didn't tell* is active.",
    "以 *I* 作主语时，我是动作的承受者，所以要用被动语态：*be* 加 *not* 加过去分词。*didn't tell* 是主动语态。",
  ],
  [
    "had cut my hair",
    "had my hair cut",
    "*have something done* puts the thing before the participle. *had cut my hair* means that you cut it yourself.",
    "*have something done* 要把事物放在过去分词前面。*had cut my hair* 表示自己剪了头发。",
  ],
  [
    "had my hair cutted",
    "had my hair cut",
    "*cut* is irregular: its past participle has no *-ed*.",
    "*cut* 是不规则动词，过去分词不加 *-ed*。",
  ],
  [
    "is designed by",
    "was designed by",
    "*designed* in the first sentence is in the past, so *be* in the passive goes in the past simple.",
    "第一句的 *designed* 是过去时，所以被动语态中的 *be* 要用一般过去时。",
  ],
  [
    "is opened",
    "will be opened",
    "*will open* is in the future, so the passive keeps the future: *will be* and the past participle.",
    "*will open* 是将来时，所以被动语态也用将来时：*will be* 加过去分词。",
  ],
  [
    "is repairing",
    "is being repaired",
    "*is repairing* is active, as if the road were repairing something. The present progressive passive is *is being* and the past participle.",
    "*is repairing* 是主动语态，好像是路在修东西。现在进行时的被动语态是 *is being* 加过去分词。",
  ],
  [
    "is said that",
    "is said to be",
    "With the thing as the subject, *said* is followed by *to* and a verb. *that* goes with *It is said*.",
    "以事物作主语时，*said* 后面接 *to* 加动词。*that* 用在 *It is said* 后面。",
  ],
  [
    "to have repainted our kitchen",
    "to have our kitchen repainted",
    "*have something done* puts the thing before the past participle.",
    "*have something done* 要把事物放在过去分词前面。",
  ],
  [
    "to repaint our kitchen",
    "to have our kitchen repainted",
    "*to repaint our kitchen* would mean that we do it ourselves, and the key word *HAVE* is not used. Someone else does it: *have*, the thing and the past participle.",
    "*to repaint our kitchen* 表示我们自己粉刷，而且没有用关键词 *HAVE*。是别人来粉刷：*have* 加事物加过去分词。",
  ],
  [
    "was been cancelled",
    "has been cancelled",
    "*been* follows *has*, *have* or *had*, not *was*, and the first sentence is in the present perfect.",
    "*been* 跟在 *has*、*have* 或 *had* 后面，不跟在 *was* 后面，而且第一句是现在完成时。",
  ],
  [
    "should have told",
    "should have been told",
    "*should have told* is active, as if we should have told someone. We received the action, so *been* goes before the participle.",
    "*should have told* 是主动语态，好像是我们该告诉别人。我们是动作的承受者，所以过去分词前要有 *been*。",
  ],
  [
    "didn't allowed to",
    "was not allowed to",
    "*allowed* here is passive, so it takes *be*, not *did*; *did* is followed by the base form.",
    "这里的 *allowed* 是被动语态，所以要用 *be*，不用 *did*；*did* 后面接动词原形。",
  ],
  [
    "forget call",
    "forget to call",
    "For something you still have to do, *forget* is followed by *to* and the base verb.",
    "表示忘记要做的事时，*forget* 后面接 *to* 加动词原形。",
  ],
  [
    "forget calling",
    "forget to call",
    "*forget* with an *-ing* form is about a past action. For something you still have to do, it takes *to* and the base verb.",
    "*forget* 加 -ing 形式指忘记过去做过的事。忘记要做的事要用 *to* 加动词原形。",
  ],
  [
    "had difficulty to find",
    "had difficulty finding",
    "*have difficulty* is followed by an *-ing* form, not *to*.",
    "*have difficulty* 后面接 -ing 形式，不接 *to*。",
  ],
  [
    "were difficulty finding",
    "had difficulty finding",
    "*difficulty* is a noun that you *have*, not a state you *are* in.",
    "*difficulty* 是名词，要和 *have* 搭配，不和 *be* 搭配。",
  ],
  [
    "has learning",
    "has been learning",
    "*has* with an *-ing* form is not a tense. The present perfect progressive needs *been* between them.",
    "*has* 加 -ing 形式不构成任何时态。现在完成进行时中间要有 *been*。",
  ],
  [
    "is learning",
    "has been learning",
    "*for five years* reaches from the past up to now, so the verb takes the present perfect progressive, not the present progressive.",
    "*for five years* 从过去一直延续到现在，所以要用现在完成进行时，不用现在进行时。",
  ],
  [
    "like i carry|like that i carry",
    "like me to carry",
    "*would like* is followed by a person and *to* and the base verb, not by a clause.",
    "*would like* 后面接人再接 *to* 加动词原形，不接从句。",
  ],
  [
    "mind not to smoke|mind to not smoke",
    "mind not smoking",
    "*mind* is followed by an *-ing* form, with *not* before it, not by *to*.",
    "*mind* 后面接 -ing 形式，*not* 放在它前面，不接 *to*。",
  ],
  [
    "no point to repair",
    "no point repairing",
    "*There's no point* is followed by an *-ing* form, not *to*.",
    "*There's no point* 后面接 -ing 形式，不接 *to*。",
  ],
  [
    "not point repairing",
    "no point repairing",
    "*point* is a noun, so the word before it is *no*, not *not*.",
    "*point* 是名词，前面要用 *no*，不用 *not*。",
  ],
  [
    "object to open|object you to open",
    "object to you opening",
    "In *object to*, *to* is a preposition, so it is followed by an *-ing* form, with the person who acts named before it.",
    "*object to* 中的 *to* 是介词，后面接 -ing 形式，-ing 形式前要说出做这件事的人。",
  ],
  [
    "rather you don't|rather you not",
    "rather you did not",
    "*I'd rather* with another person takes the past simple, even about now or later.",
    "*I'd rather* 后接另一个人时，即使说的是现在或将来，也要用一般过去时。",
  ],
  [
    "remember lock|remember to lock",
    "remember locking",
    "*remember* with an *-ing* form is about a past action you have a memory of. *remember to* is about something you must still do, and the base form alone cannot follow *remember*.",
    "*remember* 加 -ing 形式指记得做过某事。*remember to* 指记得要去做某事；*remember* 后面也不能直接接动词原形。",
  ],
  [
    "since i go|since i was going",
    "since i last went",
    "*It's months since* is followed by the past simple and says when the action last happened, with *last* before the verb.",
    "*It's months since* 后面接一般过去时，说明上一次做这件事的时间，*last* 放在动词前。",
  ],
  [
    "spent two hours for writing|spent two hours to write",
    "spent two hours writing",
    "*spend time* is followed straight by an *-ing* form, with no *to* or *for*.",
    "*spend time* 后面直接接 -ing 形式，不加 *to* 或 *for*。",
  ],
  [
    "succeeded to finish",
    "succeeded in finishing",
    "*succeed* takes *in* and an *-ing* form, not *to*.",
    "*succeed* 后面接 *in* 加 -ing 形式，不接 *to*。",
  ],
  ["in the charge of", "in charge of", "The fixed phrase is *in charge of*, with no *the*.", "固定短语是 *in charge of*，中间没有 *the*。"],
  [
    "gave eating up",
    "gave up",
    "*up* belongs straight after *gave* here: *gave up* and then the thing you stopped.",
    "这里 *up* 紧跟在 *gave* 后面：*gave up* 再接停止的事情。",
  ],
  [
    "gave off eating",
    "gave up",
    "*give off* means 'send out', such as a smell or heat. Stopping something is *give up*.",
    "*give off* 意思是“散发”（气味、热量等）。“放弃、戒掉”是 *give up*。",
  ],
  ["looking forward for", "looking forward to", "*look forward* takes *to*, not *for*.", "*look forward* 后面接 *to*，不接 *for*。"],
  [
    "put out the meeting",
    "put off the meeting",
    "*put out* means 'stop a fire' or 'switch off'. Moving a meeting to a later time is *put off*.",
    "*put out* 意思是“熄灭、关掉”。把会议推迟是 *put off*。",
  ],
  [
    "run off of",
    "run out of",
    "*run off* means 'leave quickly'. Having none left is *run out of*.",
    "*run off* 意思是“跑掉”。“用完”是 *run out of*。",
  ],
  [
    "stand up with",
    "put up with",
    "The key word *PUT* is not used, and *stand up with* is not a phrase. Accepting something you do not like is *put up with*.",
    "没有用关键词 *PUT*，而且没有 *stand up with* 这个短语。“忍受”是 *put up with*。",
  ],
  [
    "took off in",
    "took off on",
    "*in time* means 'early enough'. 'At the right time' is *on time*.",
    "*in time* 意思是“及时、来得及”。“准时”是 *on time*。",
  ],
  [
    "took on",
    "took off on",
    "*take on* means 'employ' or 'accept work'. Leaving the ground is *take off*, and then *on time*.",
    "*take on* 意思是“雇用、承担”。飞机起飞是 *take off*，后面再接 *on time*。",
  ],
  [
    "advised me seeing",
    "advised me to see",
    "*advise* is followed by the person and *to* and the base verb, not an *-ing* form.",
    "*advise* 后面接人再接 *to* 加动词原形，不接 -ing 形式。",
  ],
  [
    "advised to me see|reminded to me bring",
    "*",
    "The verb takes the person straight after it, with no *to*, and then *to* and the base verb.",
    "这个动词后面直接接人，不加 *to*，再接 *to* 加动词原形。",
  ],
  [
    "apologised for broke",
    "apologised for breaking",
    "*for* is a preposition, so the verb after it takes *-ing*.",
    "*for* 是介词，后面的动词要用 -ing 形式。",
  ],
  [
    "apologised to break",
    "apologised for breaking",
    "*apologise* takes *for* and an *-ing* form, not *to*.",
    "*apologise* 后面接 *for* 加 -ing 形式，不接 *to*。",
  ],
  [
    "denied take|denied to take",
    "denied taking",
    "*deny* is followed by an *-ing* form, not by *to* or the base form.",
    "*deny* 后面接 -ing 形式，不接 *to* 或动词原形。",
  ],
  [
    "he will call",
    "he would call",
    "In reported speech, *will* moves back to its past form, and the key word *WOULD* is not used.",
    "间接引语中，*will* 要变成过去式，而且没有用关键词 *WOULD*。",
  ],
  [
    "that he would called",
    "he would call",
    "After *would*, the verb is in its base form, not *called*.",
    "*would* 后面的动词用原形，不用 *called*。",
  ],
  [
    "me where did i|me where do i",
    "me where i",
    "A reported question uses the order of a statement: the subject comes before the verb, and there is no *do* or *did*.",
    "间接疑问句用陈述句语序：主语在动词前，不用 *do* 或 *did*。",
  ],
  [
    "offered me borrowing|offered me to borrow",
    "offered to lend me",
    "*offer* is followed straight by *to* and a verb, and Lucy is the one who gives, so the verb is *lend*, not *borrow*.",
    "*offer* 后面直接接 *to* 加动词，而且是 Lucy 借出，所以动词是 *lend*，不是 *borrow*。",
  ],
  [
    "reminded me bringing",
    "reminded me to bring",
    "*remind* is followed by the person and *to* and the base verb, not an *-ing* form.",
    "*remind* 后面接人再接 *to* 加动词原形，不接 -ing 形式。",
  ],
  [
    "suggested to go|suggested us to go",
    "suggested going",
    "*suggest* is followed by an *-ing* form or a *that* clause, not by *to* or a person and *to*.",
    "*suggest* 后面接 -ing 形式或 *that* 从句，不接 *to*，也不接人加 *to*。",
  ],
  [
    "us don't touch|us not touch",
    "us not to touch",
    "A reported order uses *told*, the person, *not to* and the base verb.",
    "转述否定命令用 *told* 加人，再加 *not to* 和动词原形。",
  ],
  [
    "whether did we enjoy",
    "whether we had enjoyed",
    "A reported question uses the order of a statement, with no *did*, and the past moves back to the past perfect.",
    "间接疑问句用陈述句语序，不用 *did*，而且过去时要变成过去完成时。",
  ],
  [
    "whether we have enjoyed",
    "whether we had enjoyed",
    "*asked* is in the past, so the tense moves back: what was the past simple becomes the past perfect.",
    "*asked* 是过去时，所以时态要往前推：原来的一般过去时变成过去完成时。",
  ],
];

const transformCases: readonly Case[] = [
  table(transformEntries),
  notMissing,
  ...leftOutCases,
  asWithComparative,
  modalBase,
  wishPast,
  mustNotForCannot,
  passiveNeedsBe,
  participleNeeded,
];

/** transformMistakes is the feedback of key word transformations, by kind of gap. */
export const transformMistakes: Record<string, WhyNot> = Object.fromEntries(
  ["passive", "comparison", "pattern", "conditional", "reported", "modal", "phrasal"].map((k) => [k, explain(...transformCases)]),
);

/** mistakesOf is the feedback of one kind of a bank, and fails loudly for a kind without any. */
export const mistakesOf = (bank: Record<string, WhyNot>, kind: string): WhyNot => {
  const whyNot = bank[kind];
  if (!whyNot) throw new Error(`no feedback for the kind ${kind}`);
  return whyNot;
};

// TOEFL Complete the Words.

const completeEntries: readonly Entry[] = [
  [
    "listens",
    "listen",
    "*They* is the subject of both verbs joined by *and*, and it is plural, so the verb has no *-s*.",
    "*They* 是 *and* 连接的两个动词的共同主语，是复数，所以动词不加 *-s*。",
  ],
  ["long", "longer", "*than* shows a comparison, so the adjective takes its comparative form.", "*than* 表示比较，所以形容词要用比较级。"],
  [
    "cause",
    "caught",
    "*cause* is a base form and cannot follow *is*. The gas receives the action, so after *is* the verb takes its past participle.",
    "*cause* 是原形，不能跟在 *is* 后面。气体是动作的承受者，所以 *is* 后面的动词要用过去分词。",
  ],
  [
    "smaller",
    "small",
    "Nothing is compared here (there is no *than*), so the adjective stays in its plain form.",
    "这里没有比较（没有 *than*），所以形容词用原级。",
  ],
  [
    "useful",
    "usually",
    "*useful* is an adjective and cannot describe the verb *return*. The gap says how often they return, which takes an adverb.",
    "*useful* 是形容词，不能修饰动词 *return*。空格说明它们多久回来一次，要用副词。",
  ],
  [
    "other",
    "others",
    "*other* needs a noun after it. Standing alone for 'other people', it takes *-s*.",
    "*other* 后面要接名词。单独表示“别人”时要加 *-s*。",
  ],
  ["leafs", "leaves", "*leaf* changes its *f* to *-ves* in the plural.", "*leaf* 变复数时要把 *f* 变成 *-ves*。"],
  [
    "wear",
    "weather",
    "*wear* is a verb (*wear a coat*). After *no* and before a list of wind, rain and clouds, the gap is a noun for the conditions in the air.",
    "*wear* 是动词（*wear a coat*）。空格在 *no* 之后、风雨云的列举之前，需要一个表示天气状况的名词。",
  ],
  [
    "choose",
    "chose",
    "*Thousands of years ago* places the action in the past, so the verb takes its past form. *choose* is a present form.",
    "*Thousands of years ago* 说明动作发生在过去，所以动词要用过去式。*choose* 是现在时的形式。",
  ],
  [
    "founded",
    "found",
    "*founded* is the past of *found*, to start a company or a city. The pots were discovered, which takes the past participle of *find*.",
    "*founded* 是 *found*（创建公司、城市）的过去式。罐子是被发现的，要用 *find* 的过去分词。",
  ],
  [
    "then",
    "than",
    "*then* means 'at that time' or 'next'. After a comparative such as *faster*, the word is different.",
    "*then* 意思是“那时”或“然后”。*faster* 这样的比较级后面要用另一个词。",
  ],
  ["time", "times", "*seventy* shows more than one, so the noun is plural.", "*seventy* 说明不止一次，所以名词要用复数。"],
  [
    "time",
    "tiny",
    "*time* is a noun, and *holes* is already the noun. The gap describes *holes*, so it needs an adjective about size.",
    "*time* 是名词，而 *holes* 已经是名词了。空格修饰 *holes*，需要一个描述大小的形容词。",
  ],
  [
    "arose",
    "around",
    "*arose* is the past of *arise* and cannot follow *the soil*. The gap says where the soil is in relation to the volcanoes, a word of place.",
    "*arose* 是 *arise* 的过去式，不能跟在 *the soil* 后面。空格说明土壤相对于火山的位置，需要一个表示方位的词。",
  ],
  [
    "years",
    "year",
    "*a* before the gap shows one, so the noun is singular: *a few meters a year* means 'each year'.",
    "空格前的 *a* 说明是一个，所以名词用单数：*a few meters a year* 意思是“每年”。",
  ],
  [
    "good",
    "well",
    "*good* is an adjective and cannot describe how they *swim*. That takes an adverb, and the adverb of *good* is irregular.",
    "*good* 是形容词，不能描述 *swim* 的方式。这要用副词，而 *good* 的副词是不规则的。",
  ],
  [
    "prize",
    "price",
    "*prize* is what you win in a competition. What people pay for housing is a different word.",
    "*prize* 是比赛中赢得的奖品。买房付的钱是另一个词。",
  ],
  [
    "means",
    "measure",
    "*means* has an *-s* and cannot follow *to*. After *to*, the gap is a verb in its base form, with the sense 'find out how much'.",
    "*means* 带 *-s*，不能跟在 *to* 后面。*to* 后面的空格是动词原形，意思是“测量多少”。",
  ],
  [
    "them",
    "that",
    "*them* is an object pronoun and cannot join a clause to *colors*. A relative word is needed: *colors ___ people cannot see*.",
    "*them* 是宾格代词，不能把从句和 *colors* 连起来。这里需要关系词：*colors ___ people cannot see*。",
  ],
  [
    "enemy",
    "energy",
    "*enemy* is a person or a side you fight against. What the brain uses is power from food, a different word.",
    "*enemy* 是敌人。大脑消耗的是来自食物的能量，是另一个词。",
  ],
  [
    "age",
    "ago",
    "*age* is a noun for how old something is. After a length of time such as *two thousand years*, the word that counts back from now is different.",
    "*age* 是表示年龄的名词。在 *two thousand years* 这样的一段时间后面，表示“从现在往前算”的是另一个词。",
  ],
  [
    "done",
    "down",
    "*done* is the past participle of *do*. The gap says which way rivers carry sand: toward the sea, to lower ground.",
    "*done* 是 *do* 的过去分词。空格说明河流把沙子带往哪个方向：流向大海，即地势更低的地方。",
  ],
  [
    "shown",
    "should",
    "*shown* is a past participle and cannot come before the base verb *contain*. Before a base verb, the gap is a modal.",
    "*shown* 是过去分词，不能放在动词原形 *contain* 前面。动词原形前的空格是情态动词。",
  ],
  [
    "slow",
    "slowly",
    "*slow* is an adjective and cannot describe the verb *gives*. That takes an adverb.",
    "*slow* 是形容词，不能修饰动词 *gives*，要用副词。",
  ],
  [
    "small",
    "smell",
    "*small* is an adjective about size. After *can*, the gap is a verb: the sense that elephants use to find water.",
    "*small* 是表示大小的形容词。*can* 后面的空格是动词：大象用来找水的那种感觉。",
  ],
  [
    "make",
    "many",
    "*make* is a verb, but *plants could not produce* already has its verb. Before the noun *plants*, the gap is a word of amount.",
    "*make* 是动词，但 *plants could not produce* 已经有谓语了。名词 *plants* 前的空格是表示数量的词。",
  ],
  [
    "stall",
    "still",
    "*stall* is a small shop or a stopped engine. The gap is an adverb that means 'even now'.",
    "*stall* 是小摊位，或指发动机熄火。空格是意思为“仍然”的副词。",
  ],
  [
    "trade",
    "travel",
    "*trade* means buying and selling. Light moving from the sun to the Earth takes a different verb.",
    "*trade* 意思是买卖。光从太阳传到地球要用另一个动词。",
  ],
  [
    "worse",
    "worth",
    "*worse* is the comparative of *bad*. *as much as gold* tells the value of salt, so the gap is a word meaning 'having a value of'.",
    "*worse* 是 *bad* 的比较级。*as much as gold* 说的是盐的价值，所以空格是表示“价值相当于”的词。",
  ],
  [
    "belief",
    "believe",
    "*belief* is a noun. After the subject *Scientists* and before *that*, the gap is the main verb.",
    "*belief* 是名词。空格在主语 *Scientists* 之后、*that* 之前，是谓语动词。",
  ],
  ["minute", "minutes", "*ten* shows more than one, so the noun is plural.", "*ten* 说明不止一分钟，所以名词要用复数。"],
  [
    "central",
    "center",
    "*central* is an adjective. After the possessive *The Earth's*, the gap is a noun.",
    "*central* 是形容词。所有格 *The Earth's* 后面的空格是名词。",
  ],
];

/** completeNeed says what the form of a longer word must be, by why the sentence decides it. */
const completeNeed: Record<string, readonly [string, string]> = {
  noun: ["the gap follows *the*, *an* or a possessive, so it needs a noun", "空格前是 *the*、*an* 或所有格，所以需要名词"],
  adverb: ["the word describes a verb or an adjective, so it needs an adverb", "这个词修饰动词或形容词，所以需要副词"],
  adjective: [
    "the word follows *be*, *become* or *make it*, or comes before a noun, so it needs an adjective",
    "这个词跟在 *be*、*become*、*make it* 之后或用在名词前，所以需要形容词",
  ],
  passive: [
    "the subject receives the action, so *was* is followed by a past participle",
    "主语是动作的承受者，所以 *was* 后面要用过去分词",
  ],
  perfect: ["after *have* or *has*, a verb takes its past participle", "*have* 或 *has* 后面的动词要用过去分词"],
  past: [
    "*Last year* places the action in the past, so the verb takes the past simple",
    "*Last year* 说明动作发生在过去，所以动词要用一般过去时",
  ],
  "after-preposition": [
    "after a preposition such as *before* or *without*, a verb takes *-ing*",
    "*before*、*without* 这类介词后面的动词要用 -ing 形式",
  ],
  base: ["after *to*, a verb takes its base form", "*to* 后面的动词用原形"],
  "in-progress": ["after *are*, an action in progress takes *-ing*", "*are* 后面表示正在进行的动作要用 -ing 形式"],
};

const completeClasses: Record<string, WordClass> = {
  developing: "ing",
  develop: "verb",
  popular: "adjective",
  discover: "verb",
  discovered: "ed",
  accuracy: "noun",
  accurately: "adverb",
  efficiency: "noun",
  efficiently: "adverb",
  importance: "noun",
  difficulty: "noun",
  careful: "adjective",
  particular: "adjective",
  steady: "adjective",
  increasing: "ing",
  recent: "adjective",
  regular: "adjective",
  complete: "adjective",
  design: "verb",
  designing: "ing",
  publish: "verb",
  published: "ed",
  produce: "verb",
  produced: "ed",
  remembered: "ed",
  remembering: "ing",
  study: "verb",
  studied: "ed",
  celebrate: "verb",
  celebrating: "ing",
  discovering: "ing",
  agree: "verb",
};

/** completeForm explains the wrong form of a longer word by why its sentence decides the form. */
const completeForm =
  (form: string | undefined): Case =>
  (s) => {
    const w = low(s.wrong);
    if (form === "plural")
      return t(
        `*${s.wrong}* is singular, but a word such as *many*, *both*, *two of* or *hundreds of* shows that the noun is plural.`,
        `*${s.wrong}* 是单数，但 *many*、*both*、*two of*、*hundreds of* 这类词说明名词要用复数。`,
      );
    if (form === "singular")
      return t(
        `*${s.wrong}* is plural, but the verb *has* shows that the noun is singular.`,
        `*${s.wrong}* 是复数，但动词 *has* 说明名词是单数。`,
      );
    if (form === "uncountable")
      return t("*information* cannot be counted, so it never takes *-s*.", "*information* 是不可数名词，永远不加 *-s*。");
    if (form === "ing-adjective")
      return t(
        `*${s.wrong}* describes how a person feels. Here the word describes the thing that causes the feeling, so it ends in *-ing*.`,
        `*${s.wrong}* 描述人的感受。这里描述的是引起感受的事物，所以要以 *-ing* 结尾。`,
      );
    if (form === "ed-adjective")
      return t(
        `*${s.wrong}* describes what causes a feeling. Here the word describes how the people feel, so it ends in *-ed*.`,
        `*${s.wrong}* 描述引起某种感受的事物。这里描述的是人的感受，所以要以 *-ed* 结尾。`,
      );
    const k = completeClasses[w];
    const n = form ? completeNeed[form] : undefined;
    if (!k || !n) return undefined;
    const verbForm = form !== "noun" && form !== "adverb" && form !== "adjective";
    const [cEn, cZh] = verbForm && k === "verb" ? (["the base form of a verb", "动词原形"] as const) : className[k];
    return t(`*${s.wrong}* is ${cEn}, but ${n[0]}.`, `*${s.wrong}* 是${cZh}，但${n[1]}。`);
  };

/** completeMistakes is the feedback of TOEFL Complete the Words, for a word whose form the sentence decides or not. */
export const completeMistakes = (form: string | undefined): WhyNot => explain(table(completeEntries), completeForm(form));

// IELTS notes and short answers.

/** passageOf is the text that a note line or a question is about. */
const passageOf = (shown: string) => shown.split("\n\n")[0] ?? "";

/** inText tells whether a stretch of words appears in a text as whole words. */
const inText = (x: string, text: string) =>
  new RegExp(`(^|[^\\p{L}\\p{N}])${x.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}([^\\p{L}\\p{N}]|$)`, "iu").test(text);

/** sentenceWith is the sentence of a text that holds a stretch of words. */
const sentenceWith = (x: string, text: string) => text.split(/(?<=[.!?])\s+/u).find((u) => inText(x, u));

const copiedEntries: readonly Entry[] = [
  [
    "paved",
    "shortest",
    "*paved* is in the text, but it describes the paths that are built later. The way people take is described by another word in the same part of the text.",
    "*paved* 在原文里，但它描述的是后来铺好的路。人们走的路在原文同一部分用了另一个词来描述。",
  ],
  [
    "air",
    "carbon dioxide",
    "*air* is what the bubbles hold, but the question asks which gas in that air researchers can measure.",
    "*air* 是气泡里装的东西，但题目问的是研究人员能测量其中哪一种气体。",
  ],
  [
    "pumped",
    "closed",
    "*pumped* is in the text, but it says how the water moves. The gap comes before *system*, so it needs the word the text uses to describe the system.",
    "*pumped* 在原文里，但它说的是水怎样流动。空格在 *system* 前，要填原文描述这个系统的词。",
  ],
  [
    "decades|for decades",
    "centuries",
    "*decades* is in the text, but it is how long most seeds stay alive. The question asks about *some* seeds, which the text says last longer.",
    "*decades* 在原文里，但那是大多数种子存活的时间。题目问的是 *some* 种子，原文说它们能存活更久。",
  ],
  [
    "a day",
    "150 kilometres",
    "*a day* repeats the question. *How far* asks for a distance, a number with its unit.",
    "*a day* 只是重复了题目。*How far* 问的是距离，要填数字和单位。",
  ],
  [
    "lamps",
    "clothing",
    "The question says *Besides lamps*, so the answer is the other thing the text names, not *lamps*.",
    "题目说的是 *Besides lamps*，所以答案是原文提到的另一样东西，不是 *lamps*。",
  ],
];

/** overLimit explains an answer with more words than the task allows. */
const overLimit =
  (limit: "one" | "two"): Case =>
  (s) => {
    const parts = low(s.wrong).split(/\s+/u);
    const numbers = parts.filter((p) => /^[\d,.]+$/u.test(p));
    const wordsOnly = parts.filter((p) => !/^[\d,.]+$/u.test(p));
    if (limit === "one" ? parts.length <= 1 : wordsOnly.length <= 2 && numbers.length <= 1) return undefined;
    return limit === "one"
      ? t(
          `*${s.wrong}* has more than one word, and each gap takes ONE WORD ONLY. Even when every word is in the text, an answer over the limit is marked wrong.`,
          `*${s.wrong}* 不止一个词，而每个空只能填一个词（ONE WORD ONLY）。即使每个词都在原文里，超出字数也会被判错。`,
        )
      : t(
          `*${s.wrong}* has ${wordsOnly.length} words, more than the limit of two words and/or a number. Even when every word is in the text, an answer over the limit is marked wrong.`,
          `*${s.wrong}* 有 ${wordsOnly.length} 个词，超过了两个词和/或一个数字的限制。即使每个词都在原文里，超出字数也会被判错。`,
        );
  };

/** partOfAnswer explains an answer that leaves out a word of the text that the answer needs. */
const partOfAnswer: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  if (!inText(w, r) || w === r) return undefined;
  return t(
    `*${s.wrong}* is in the right place in the text, but it leaves out a word that the answer needs: without it, the answer does not say what the text says.`,
    `*${s.wrong}* 找对了原文的位置，但漏掉了答案需要的一个词：少了它，答案就和原文的意思不一样了。`,
  );
};

/** elsewhere explains a word of the text that belongs to another part of it. */
const elsewhere: Case = (s) => {
  const text = passageOf(s.shown);
  if (!inText(s.wrong, text)) return undefined;
  const sentence = sentenceWith(s.wrong, text);
  return sentence && !inText(s.right, sentence)
    ? t(
        `*${s.wrong}* is in the text, but the text says it about something else: “${sentence}” That is not what this line asks about.`,
        `*${s.wrong}* 在原文里，但原文说的是别的事：“${sentence}” 这和本题问的不是一回事。`,
      )
    : t(
        `*${s.wrong}* is in the text, but in its sentence it goes with a different part. Read again which words of the text the line restates.`,
        `*${s.wrong}* 在原文里，但在它所在的句子中，它属于另一部分。再读一遍，看题目改写的是原文的哪几个词。`,
      );
};

/** notInText explains an answer that does not appear in the text. */
const notInText: Case = (s) =>
  inText(s.wrong, passageOf(s.shown))
    ? undefined
    : /\d/u.test(s.wrong)
      ? t(
          `The text does not give *${s.wrong}*. Copy the number exactly as the text gives it for this point.`,
          `原文没有给出 *${s.wrong}*。要照抄原文中关于这一点的数字。`,
        )
      : t(
          `*${s.wrong}* is not in the text. The answer must be copied from the text word for word; a word with a similar meaning that the text does not use is marked wrong.`,
          `*${s.wrong}* 不在原文里。答案必须从原文中原样照抄；原文没有用过的近义词会被判错。`,
        );

/** copiedMistakes is the feedback of IELTS answers copied from a text, under a limit of one word or two words and/or a number. */
export const copiedMistakes = (limit: "one" | "two"): WhyNot =>
  explain(table(copiedEntries), overLimit(limit), partOfAnswer, notInText, elsewhere);
