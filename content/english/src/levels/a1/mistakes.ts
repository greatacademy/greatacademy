// Feedback for the listed wrong responses of the typed problems of A1, one kind of mistake at a time.

import { t } from "@ga/content";
import { reordered } from "@ga/subject-english";
import {
  baseAfterHelper,
  beAgreement,
  beBeforeVerb,
  type Case,
  capitalsAndEnd,
  doAgreement,
  endMarkMissing,
  explain,
  noSubject,
  noVerb,
  raisedCapitals,
  type Seen,
  spelling,
  statementQuestion,
  thirdPersonExtra,
  thirdPersonMissing,
  toAfterModal,
  unchanged,
  when,
} from "../../why-not.ts";

/** low is a stretch of text in small letters without marks, for comparing. */
const low = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, "");

/** isWord tests that the differing stretch of the response is one of some words, and of the right answer one of others. */
const isWord = (s: Seen, wrong: readonly string[], right?: readonly string[]) =>
  wrong.includes(low(s.w)) && (right === undefined || right.includes(low(s.r)));

/** nextWord is the word after the differing stretch, or after the gap of a typed word, without marks. */
const nextWord = (s: Seen) =>
  ((s.span.after || (s.shown.split("___")[1] ?? "").trim()).split(" ")[0] ?? "").replace(/[^\p{L}\p{N}'-]/gu, "");

/** helperFirst are the words a written yes-no or wh- question puts before its subject. */
const helperFirst = /^(do|does|did|is|are|am|was|were|can|will|have|has)\b/iu;

/** thirdPersonEs explains *-s* where a verb takes *-es*, and *-s* added to *have*. */
const thirdPersonEs: Case = (s) => {
  const [w, r] = [low(s.w), low(s.r)];
  if (r === "has" && (w === "haves" || w === "have")) {
    return w === "haves"
      ? t(
          "*have* is irregular: after *he*, *she*, *it* or one person, it does not just add *-s* but changes to a short form of its own.",
          "*have* 是不规则的：跟 *he*、*she*、*it* 或单个人时，不是直接加 *-s*，而是变成另一个短形式。",
        )
      : t(
          "The subject is one person or thing, so *have* changes to its own form for *he*, *she* and *it*.",
          "主语是单个的人或事物，*have* 要换成它跟 *he*、*she*、*it* 搭配的形式。",
        );
  }
  if (/ies$/u.test(r) && w === `${r.slice(0, -3)}ys`) {
    return t(
      `*${s.w}*: after a consonant, a final *y* changes to *i* and takes *-es* (*study* → *studies*, *fly* → *flies*).`,
      `*${s.w}*：辅音字母后的词尾 *y* 要变成 *i* 再加 *-es*（*study* → *studies*，*fly* → *flies*）。`,
    );
  }
  if (/[^e]s$/u.test(r) && w === `${r.slice(0, -1)}es`) {
    return t(
      `*${s.w}*: *-es* is only for verbs that end in *o*, *s*, *x*, *z*, *ch* or *sh*. Other verbs just add *-s*.`,
      `*${s.w}*：只有以 *o*、*s*、*x*、*z*、*ch*、*sh* 结尾的动词才加 *-es*，其他动词直接加 *-s*。`,
    );
  }
  if (/es$/u.test(r) && w === `${r.slice(0, -2)}s`) {
    return t(
      `*${s.w}*: a verb that ends in *o*, *s*, *x*, *z*, *ch* or *sh* takes *-es*, not just *-s*, after *he*, *she* or *it*.`,
      `*${s.w}*：以 *o*、*s*、*x*、*z*、*ch*、*sh* 结尾的动词，跟 *he*、*she*、*it* 时要加 *-es*，而不只是 *-s*。`,
    );
  }
  return undefined;
};

/** thirdPerson explains a present-simple verb whose *-s* is missing, misspelled, or added after a plural subject. */
const thirdPerson = [thirdPersonEs, spelling, thirdPersonMissing, thirdPersonExtra];

/** noBe explains *am*, *is* or *are* put before a present-simple verb, and *-s* after a plural subject. */
export const presentSimpleNoBeNot = explain(beBeforeVerb, ...thirdPerson);

/** thirdPersonSSpellNot explains a typed present-simple verb without its *-s* or with it misspelled. */
export const thirdPersonSSpellNot = explain(...thirdPerson);

/** thirdPersonSFixNot explains a corrected sentence whose verb still has no *-s*, or a wrong one. */
export const thirdPersonSFixNot = explain(doAgreement, ...thirdPerson);

/** adverbsOfFrequencyWriteNot explains a word for how often put in the wrong place. */
export const adverbsOfFrequencyWriteNot = explain(
  when(
    (s) => reordered(s.wrong, s.right),
    (s) => {
      const adverb = /\(([^)]+)\)\s*$/u.exec(s.shown)?.[1] ?? "";
      return /\b(am|is|are)\b/iu.test(s.right)
        ? t(
            `*${adverb}* is in the wrong place. With *am*, *is* or *are*, a word that says how often comes after the verb.`,
            `*${adverb}* 的位置不对。和 *am*、*is*、*are* 连用时，表示频率的词放在动词后面。`,
          )
        : t(
            `*${adverb}* is in the wrong place. With a verb other than *be*, a word that says how often comes before the verb, not after it.`,
            `*${adverb}* 的位置不对。和 *be* 以外的动词连用时，表示频率的词放在动词前面，而不是后面。`,
          );
    },
  ),
);

/** clockTime explains a time written without *o'clock* or with the wrong word before it. */
const clockTime: Case = when(
  (s) => /o'clock/u.test(s.right) && !/o'clock/u.test(s.wrong),
  t("A time on the hour is written with *o'clock* after the number, and *at* before it.", "整点时间要在数字后加 *o'clock*，前面用 *at*。"),
);

/** timeAtEnd explains a time put between the subject and the verb. */
const timeAtEnd: Case = when(
  (s) => /^.+? at [\w ]+o'clock \S/u.test(s.wrong) && /o'clock\.?$/u.test(s.right.trim()),
  t(
    "The time is in the middle of the sentence here. In English, a time like *at seven o'clock* usually goes at the end, after what the person does.",
    "这里时间放在了句子中间。英语里像 *at seven o'clock* 这样的时间通常放在句末，在所做的事情后面。",
  ),
);

/** writingSentencesAboutRoutinesWriteNot explains a routine whose verb lacks its *-s* or whose time is written wrongly. */
export const writingSentencesAboutRoutinesWriteNot = explain(timeAtEnd, ...thirdPerson, clockTime, endMarkMissing, capitalsAndEnd);

/** prepositionsOfTimeTypeNot explains *at*, *on* or *in* that does not fit the time after it. */
export const prepositionsOfTimeTypeNot = explain(
  when(
    (s) => isWord(s, ["at", "on", "in"]),
    (s) =>
      t(
        `*${s.w}* does not fit this time. *at* is for clock times and *night*; *on* for days and dates (*on Monday*, *on Saturday morning*); *in* for months, years, seasons and the parts of a day (*in the morning*).`,
        `*${s.w}* 不适合这个时间。*at* 用于钟点和 *night*；*on* 用于具体某天和日期（*on Monday*、*on Saturday morning*）；*in* 用于月份、年份、季节和一天中的时段（*in the morning*）。`,
      ),
  ),
);

/** prepositionsOfTimeNoWordNot explains *at*, *on* or *in* left before *next*, *last*, *this* or *every*. */
export const prepositionsOfTimeNoWordNot = explain(
  when(
    (s) => isWord(s, ["at", "on", "in"]) && s.r === "",
    (s) => {
      const next = s.span.after.split(" ")[0] ?? "";
      return t(
        `No *at*, *on* or *in* comes before a time that starts with *${next}*. *next*, *last*, *this* and *every* already say when.`,
        `以 *${next}* 开头的时间前面不加 *at*、*on*、*in*。*next*、*last*、*this*、*every* 本身就说明了时间。`,
      );
    },
  ),
);

/** writingCapitalLettersForNamesWriteNot explains names of people, places, languages, days or months left small. */
export const writingCapitalLettersForNamesWriteNot = explain(capitalsAndEnd, raisedCapitals);

/** pluralEs explains a plural with *-s* where the noun takes *-es*. */
const pluralEs: Case = when(
  (s) => /es$/u.test(low(s.r)) && low(s.w) === `${low(s.r).slice(0, -2)}s`,
  (s) =>
    /o$/u.test(low(s.w).slice(0, -1))
      ? t(
          `*${s.w}*: some nouns that end in *o*, like *potato* and *tomato*, take *-es* in the plural.`,
          `*${s.w}*：有些以 *o* 结尾的名词，比如 *potato*、*tomato*，复数要加 *-es*。`,
        )
      : t(
          `*${s.w}*: a noun that ends in *s*, *x*, *z*, *ch* or *sh* takes *-es* in the plural, so it can be said as an extra beat.`,
          `*${s.w}*：以 *s*、*x*、*z*、*ch*、*sh* 结尾的名词，复数要加 *-es*，这样才能多读出一个音节。`,
        ),
);

/** countableAndUncountableNounsFixNot explains a plural without *-s*, and *a* or *-s* given to a noun that is not counted. */
export const countableAndUncountableNounsFixNot = explain(
  pluralEs,
  when(
    (s) => low(s.w) === "a" || low(s.w) === "an",
    (s) => {
      const noun = nextWord(s);
      return t(
        `*${noun}* is not counted one by one, so it never takes *a* or *an*. A word like *some* says there is an amount of it.`,
        `*${noun}* 不能一个一个地数，所以前面不能加 *a* 或 *an*。要用 *some* 这类词表示“一些”。`,
      );
    },
  ),
  when(
    (s) => low(s.w).length > low(s.r).length && low(s.w).startsWith(low(s.r)) && low(s.r) !== "",
    (s) =>
      t(
        `*${s.w}*: this noun is not counted one by one, so it has no plural and never takes *-s*.`,
        `*${s.w}*：这个名词不能一个一个地数，没有复数，不加 *-s*。`,
      ),
  ),
  when(
    (s) => low(s.r).startsWith(low(s.w)) && low(s.w) !== "" && /s$/u.test(low(s.r)),
    (s) =>
      t(
        `*${s.w}* is still one, but the number before it is bigger than one. A countable noun after such a number is plural.`,
        `*${s.w}* 还是单数，但它前面的数字大于一。这样的数字后面，可数名词要用复数。`,
      ),
  ),
);

/** someAny explains *some* in a question or a negative, and *any* in a positive statement. */
const someAny: Case = when(
  (s) => isWord(s, ["some", "any"], ["some", "any"]) || /\bnot some\b/iu.test(s.wrong),
  (s) =>
    /\bsome\b/iu.test(s.w) || /\bnot some\b/iu.test(s.wrong)
      ? t(
          "*some* goes in positive statements. A question or a sentence with *not* normally takes a different word.",
          "*some* 用于肯定句。疑问句和带 *not* 的否定句通常用另一个词。",
        )
      : t(
          "*any* goes in questions and in sentences with *not*. A positive statement takes a different word.",
          "*any* 用于疑问句和带 *not* 的否定句。肯定句要用另一个词。",
        ),
);

/** someAndAnyTypeNot explains *some* or *any* that does not fit the kind of sentence. */
export const someAndAnyTypeNot = explain(
  someAny,
  when(
    (s) => isWord(s, ["a", "an"]),
    (s) =>
      t(
        `*${s.w}* means just one thing, but *${nextWord(s)}* names more than one.`,
        `*${s.w}* 只表示一个，但 *${nextWord(s)}* 是不止一个。`,
      ),
  ),
);

/** someAndAnyChangeNot explains a changed sentence that keeps *some* in a question or a negative. */
export const someAndAnyChangeNot = explain(someAny, statementQuestion);

/** joiningWithAndButOrJoinNot explains a joined sentence that keeps its full stop or takes the wrong joining word. */
export const joiningWithAndButOrJoinNot = explain(
  when(
    (s) => /\. (and|but|or)\b/u.test(s.wrong),
    (s) => {
      const join = /\. (and|but|or)\b/u.exec(s.wrong)?.[1] ?? "";
      return t(
        `*${join}* joins the two sentences into one, so the full stop before it becomes a comma. The word after a comma stays small.`,
        `*${join}* 把两个句子连成一句，所以它前面的句号要改成逗号。逗号后面的词不大写。`,
      );
    },
  ),
  when(
    (s) => /\? (or|and)\b/u.test(s.wrong),
    t(
      "The two questions become one, so the question mark in the middle goes. Only the end of the joined question takes a question mark.",
      "两个问题合成了一个，所以中间的问号要去掉。合并后的问句只在末尾有问号。",
    ),
  ),
  when(
    (s) => isWord(s, ["and"], ["or"]),
    t(
      "*and* adds one thing to the other, so this asks about having both. The question offers a choice of one, which needs a different joining word.",
      "*and* 是把两者加在一起，这样问的是“两样都要吗”。这里是让对方二选一，要用另一个连接词。",
    ),
  ),
  when(
    (s) => isWord(s, ["or"], ["and"]),
    t(
      "*or* offers a choice of one. Here both things are true, which takes a different joining word.",
      "*or* 表示二选一。这里两件事都成立，要用另一个连接词。",
    ),
  ),
  when(
    (s) => isWord(s, ["and", "or"], ["but"]),
    t(
      "The second sentence says something unexpected after the first, a contrast. *and* and *or* do not show a contrast.",
      "第二句和第一句意思相反，是转折。*and* 和 *or* 都不表示转折。",
    ),
  ),
  when(
    (s) => isWord(s, ["but", "or"], ["and"]),
    t("The second sentence simply adds to the first; there is no contrast or choice.", "第二句只是对第一句的补充，没有转折，也不是选择。"),
  ),
  endMarkMissing,
  capitalsAndEnd,
);

/** isBase tells whether a typed verb is the base form of the *-ing* form it stands for. */
const isBase = (w: string, r: string) => /ing$/u.test(r) && r.length - w.length >= 2 && r.startsWith(w.slice(0, -1));

/** ingMissing explains a base verb after *am*, *is* or *are*, where the present continuous takes *-ing*. */
const ingMissing: Case = (s) => {
  const be = /^(am|is|are)$/u.test(low(s.span.before).split(" ").pop() ?? "")
    ? low(s.span.before).split(" ").pop()
    : /\b(am|is|are) ___/iu.exec(s.shown)?.[1]?.toLowerCase();
  if (!be || !isBase(low(s.w), low(s.r))) return undefined;
  return t(
    `After *${be}*, the present continuous takes the *-ing* form of the verb. *${s.w}* is the base form.`,
    `在 *${be}* 后面，现在进行时要用动词的 *-ing* 形式。*${s.w}* 是原形。`,
  );
};

/** presentContinuousSpellNot explains an *-ing* form spelled against the rules. */
export const presentContinuousSpellNot = explain(spelling, ingMissing);

/** noBeBeforeIng explains an *-ing* form used as the verb without *am*, *is* or *are*. */
const noBeBeforeIng: Case = when(
  (s) => s.w === "" && /^(am|is|are)$/u.test(low(s.r)),
  t(
    "An *-ing* form cannot be the verb on its own. The present continuous needs *am*, *is* or *are* before it.",
    "*-ing* 形式不能单独作谓语。现在进行时前面要有 *am*、*is* 或 *are*。",
  ),
);

/** presentContinuousWriteNot explains a present continuous without *be*, or with *be* that does not agree. */
export const presentContinuousWriteNot = explain(noBeBeforeIng, ingMissing, beAgreement, spelling);

/** howMuchAndHowManyAskNot explains *How many* with something not counted or a price, and *How much* with things counted. */
export const howMuchAndHowManyAskNot = explain(
  when(
    (s) => isWord(s, ["is", "are"], ["is", "are"]),
    (s) =>
      t(
        `*${s.w}* does not agree with what is asked about. The verb is *is* for one thing or something not counted, and *are* for more than one.`,
        `*${s.w}* 和所问的东西不一致。一个东西或不可数的东西用 *is*，不止一个用 *are*。`,
      ),
  ),
  when(
    (s) => isWord(s, ["many"], ["much"]),
    (s) =>
      /\b(dollars?|pounds?|yuan|euros?|cents?)\b/iu.test(s.shown)
        ? t(
            "This asks for a price. *How many* counts things one by one; asking what something costs takes a different question word.",
            "这是在问价格。*How many* 是一个一个地数东西；问价钱要用另一个疑问词。",
          )
        : t(
            "*How many* counts things one by one, but this noun is not counted that way. It takes a different question word.",
            "*How many* 用于可以一个一个数的东西，这个名词不能这样数，要用另一个疑问词。",
          ),
  ),
  when(
    (s) => isWord(s, ["much"], ["many"]),
    t(
      "*How much* is for things that are not counted one by one. These things can be counted, which takes a different question word.",
      "*How much* 用于不能一个一个数的东西。这些东西可以数，要用另一个疑问词。",
    ),
  ),
);

/** writingWhatPeopleAreWearingWriteNot explains *wearing* without *am*, *is* or *are*, or with one that does not agree. */
export const writingWhatPeopleAreWearingWriteNot = explain(noBeBeforeIng, ingMissing, beAgreement, endMarkMissing, capitalsAndEnd);

/** thereBe explains *have* used to say that something is somewhere. */
const thereBe: Case = when(
  (s) => /\bhave\b/iu.test(s.wrong) && /^(there (is|are)|(is|are) there)\b/iu.test(s.right),
  t(
    "To say that something is in a place, English uses *there* and a form of *be*. *have* says what someone owns, and it needs an owner as its subject.",
    "要说某处有某物，英语用 *there* 加 *be* 的某种形式。*have* 表示某人拥有，主语得是拥有者。",
  ),
);

/** thereAgreement explains *there is* before more than one thing, or *there are* before one. */
const thereAgreement: Case = when(
  (s) => /\bthere$/iu.test(s.span.before) && isWord(s, ["is", "are"], ["is", "are"]),
  (s) =>
    t(
      `After *there*, the verb agrees with the noun that comes after it: *is* for one thing, *are* for more than one. *${s.w}* does not match that noun.`,
      `*there* 后面的动词要和它后面的名词一致：一个东西用 *is*，多个用 *are*。*${s.w}* 和那个名词不一致。`,
    ),
);

/** thereIsAndThereAreFixNot explains *have* used for *there is* or *there are*. */
export const thereIsAndThereAreFixNot = explain(thereBe, thereAgreement);

/** thereIsAndThereAreAskNot explains a question with *there* left in statement order. */
export const thereIsAndThereAreAskNot = explain(
  when(
    (s) => /^there (is|are)\b/iu.test(s.wrong) && s.wrong.trim().endsWith("?"),
    t(
      "A question mark alone does not make the question. *is* or *are* moves in front of *there*.",
      "只加问号还不是疑问句。*is* 或 *are* 要移到 *there* 前面。",
    ),
  ),
  thereBe,
  someAny,
);

/** prepositionsOfPlaceTypeNot explains a word of place that says the opposite, or needs two things where there is one. */
export const prepositionsOfPlaceTypeNot = explain(
  when(
    (s) => isWord(s, ["on", "under", "over", "above", "below"], ["on", "under", "over", "above", "below"]),
    (s) =>
      t(
        `*${s.w}* turns the picture upside down. Work out from the first sentence which of the two things is higher.`,
        `*${s.w}* 把上下关系弄反了。根据第一句判断两样东西哪个在上面。`,
      ),
  ),
  when(
    (s) => isWord(s, ["in front of", "behind"], ["in front of", "behind"]),
    (s) =>
      t(
        `*${s.w}* turns the picture around. Work out from the first sentence which of the two things is nearer to you.`,
        `*${s.w}* 把前后关系弄反了。根据第一句判断两样东西哪个离你更近。`,
      ),
  ),
  when(
    (s) => isWord(s, ["between"]),
    t(
      "*between* needs two things, one on each side. Here there is only one place to be close to.",
      "*between* 要有两样东西，一边一个。这里只有一个地点。",
    ),
  ),
  when(
    (s) => isWord(s, ["near", "next to", "in", "at", "behind", "in front of", "under", "on", "between", "over"]),
    (s) =>
      t(
        `*${s.w}* does not match where the first sentence puts it. Read again how the things stand.`,
        `*${s.w}* 和第一句描述的位置不符。再读一遍东西是怎么摆放的。`,
      ),
  ),
);

/** writingAboutARoomWriteNot explains *there is* before more than one thing, or *there are* before one. */
export const writingAboutARoomWriteNot = explain(thereAgreement, thereBe, endMarkMissing, capitalsAndEnd);

/** ingAfterLike explains a base verb after *like*, *love* or *enjoy*. */
const ingAfterLike: Case = when(
  (s) =>
    low(s.w)
      .split(" ")
      .some((w, i) => isBase(w, low(s.r).split(" ")[i] ?? "")) &&
    (/\b(like|likes|love|loves|enjoy|enjoys|and)$/u.test(low(s.span.before)) ||
      /\b(like|likes|love|loves|enjoy|enjoys) ___/iu.test(s.shown)),
  (s) => {
    const verb =
      `${low(s.span.before)} ${low(s.shown.split("___")[0] ?? "")}`
        .split(" ")
        .filter((w) => /^(like|likes|love|loves|enjoy|enjoys)$/u.test(w))
        .pop() ?? "like";
    const many = / and /u.test(s.right);
    return t(
      `After *${verb}*, an action takes the *-ing* form; the base verb cannot follow it here.${many ? " Each action in the list takes *-ing*." : ""}`,
      `在 *${verb}* 后面，动作要用 *-ing* 形式，不能用动词原形。${many ? "列出的每个动作都要用 *-ing*。" : ""}`,
    );
  },
);

/** enjoyTo explains *to* after *enjoy*, and a second verb with *-s* after *like*, *love* or *enjoy*. */
const enjoyTo: Case = (s) => {
  if (/\benjoys? to\b/iu.test(s.wrong)) {
    return t("*enjoy* is followed by the *-ing* form of a verb, never by *to*.", "*enjoy* 后面接动词的 *-ing* 形式，从不接 *to*。");
  }
  if (/\b(likes?|loves?|enjoys?) \w+s\b/iu.test(s.wrong) && /ing$/u.test(low(s.r).split(" ")[0] ?? "")) {
    const second = /\b(?:likes?|loves?|enjoys?) (\w+s)\b/iu.exec(s.wrong)?.[1] ?? "";
    return t(
      `Only the first verb agrees with the subject. *${second}* is a second action, the thing liked, so it takes *-ing* instead of *-s*.`,
      `只有第一个动词和主语保持一致。*${second}* 是第二个动作，是“喜欢的事”，所以要用 *-ing*，而不是加 *-s*。`,
    );
  }
  return undefined;
};

/** likeAndLoveWithIngSpellNot explains an *-ing* form spelled against the rules. */
export const likeAndLoveWithIngSpellNot = explain(spelling, ingAfterLike);

/** likeAndLoveWithIngFixNot explains a base verb left after *like*, *love* or *enjoy*. */
export const likeAndLoveWithIngFixNot = explain(enjoyTo, ingAfterLike, ...thirdPerson);

/** writingAboutLikesWriteNot explains a base verb after *like*, *love* or *enjoy*, or a verb that does not agree. */
export const writingAboutLikesWriteNot = explain(enjoyTo, ...thirdPerson, ingAfterLike, spelling, endMarkMissing, capitalsAndEnd);

/** notAlone explains *not* put straight before a present-simple verb. */
const notAlone: Case = when(
  (s) => /\bnot\b/iu.test(s.wrong) && !/\b(do|does|did|is|are|am|can)\s+not\b/iu.test(s.wrong) && /n't\b/u.test(s.right),
  t(
    "*not* cannot stand alone before a present-simple verb. English makes such a verb negative with *do* or *does* and *not*, usually as one short word.",
    "*not* 不能直接放在一般现在时的动词前面。英语用 *do* 或 *does* 加 *not*（通常缩写成一个词）来构成否定。",
  ),
);

/** presentSimpleNegativesFixNot explains *don't* or *doesn't* that does not agree with the subject. */
export const presentSimpleNegativesFixNot = explain(notAlone, doAgreement, baseAfterHelper);

/** presentSimpleNegativesMakeNot explains a negative made with *not* alone or with a verb that keeps its *-s*. */
export const presentSimpleNegativesMakeNot = explain(
  when(
    (s) => /\b(isn't|aren't|am not)\b/iu.test(s.wrong) && /\b(don't|doesn't)\b/iu.test(s.right),
    (s) =>
      t(
        `*${/\b(isn't|aren't|am not)\b/iu.exec(s.wrong)?.[0]}* makes *be* negative, but this sentence has another verb and no *be*. A present-simple verb is made negative with *do* or *does* and *not*.`,
        `*${/\b(isn't|aren't|am not)\b/iu.exec(s.wrong)?.[0]}* 是 *be* 的否定，但这个句子的动词不是 *be*。一般现在时的实义动词要用 *do* 或 *does* 加 *not* 构成否定。`,
      ),
  ),
  notAlone,
  doAgreement,
  baseAfterHelper,
);

/** questionWithoutHelper explains a statement turned into a question by its question mark alone. */
const questionWithoutHelper: Case = when(
  (s) => s.wrong.trim().endsWith("?") && !helperFirst.test(s.wrong.trim()) && helperFirst.test(s.right.trim()),
  (s) =>
    /^(is|are|am|was|were)\b/iu.test(s.right.trim())
      ? t(
          "A question mark alone does not make a written question. With *be*, the verb moves in front of the subject.",
          "只加问号还不是书面的疑问句。含 *be* 的句子要把动词移到主语前面。",
        )
      : t(
          "A question mark alone does not make a written question. A present-simple question starts with *do* or *does*, and the verb after the subject goes back to its base form.",
          "只加问号还不是书面的疑问句。一般现在时的疑问句以 *do* 或 *does* 开头，主语后面的动词还原成原形。",
        ),
);

/** baseAfterDo explains a verb that keeps its *-s* in a question that starts with *do*, *does* or *did*. */
const baseAfterDo: Case = when(
  (s) =>
    /^(do|does|did)\b/iu.test(s.wrong.trim()) &&
    s.w !== "" &&
    s.r !== "" &&
    !s.w.includes(" ") &&
    /s$/u.test(low(s.w)) &&
    low(s.w).startsWith(low(s.r).slice(0, 2)),
  (s) =>
    t(
      `In a question with *${s.wrong.trim().split(" ")[0]}*, the verb after the subject goes back to its base form; the helper already shows the person and the time. *${s.w}* keeps its *-s*.`,
      `用 *${s.wrong.trim().split(" ")[0]}* 提问时，主语后面的动词要还原成原形，人称和时间已经由助动词表示了。*${s.w}* 却保留了 *-s*。`,
    ),
);

/** doWithBe explains *do* or *does* put before a sentence whose verb is *be*. */
const doWithBe: Case = when(
  (s) => /^(do|does|did) \S+( \S+)? (is|are|am|was|were)\b/iu.test(s.wrong.trim()),
  t(
    "This sentence's verb is *be*, which makes its own questions: *be* moves in front of the subject, with no *do* or *does*.",
    "这个句子的动词是 *be*，它自己就能构成疑问句：把 *be* 移到主语前面，不用 *do* 或 *does*。",
  ),
);

/** presentSimpleQuestionsWriteNot explains a question without *do* or *does*, or with one that does not agree. */
export const presentSimpleQuestionsWriteNot = explain(baseAfterDo, questionWithoutHelper, doAgreement, baseAfterHelper);

/** writingQuestionsWriteNot explains a question without its helper verb in front, or with one that does not agree. */
export const writingQuestionsWriteNot = explain(doWithBe, baseAfterDo, questionWithoutHelper, doAgreement, beAgreement, baseAfterHelper);

/** objectPronounsReplaceNot explains a subject pronoun put where the object form goes. */
export const objectPronounsReplaceNot = explain(
  unchanged(
    t(
      "The noun is still there. The task is to replace it with a short word that stands for it, in the form that goes after a verb or a word like *to*.",
      "名词还在原处。这道题要把它换成一个代替它的短词，并用动词或 *to* 这类词后面的形式。",
    ),
  ),
  when(
    (s) => isWord(s, ["i", "he", "she", "we", "they"]),
    (s) =>
      t(
        `*${s.w}* is the form for the subject, the one who does the action. After a verb or a word like *to*, *for* or *with*, English uses the object form.`,
        `*${s.w}* 是主语形式，表示做动作的人。在动词或 *to*、*for*、*with* 这类词后面，英语要用宾语形式。`,
      ),
  ),
  when(
    (s) => isWord(s, ["him", "her", "it", "them", "me", "us"]),
    (s) =>
      t(
        `*${s.w}* does not fit the noun it replaces. *him* is for a man or a boy, *her* for a woman or a girl, *it* for one thing, and *them* for more than one.`,
        `*${s.w}* 和它替代的名词不一致。*him* 指男性，*her* 指女性，*it* 指一个东西，*them* 指不止一个。`,
      ),
  ),
);

/** theArticleTheTypeNot explains *a* or *an* where the thing is already known or the only one, and *an* before a consonant. */
export const theArticleTheTypeNot = explain(
  when(
    (s) => isWord(s, ["a", "an"], ["the"]),
    (s) =>
      /^(last|first|only|best|biggest|same)$/iu.test(nextWord(s))
        ? t(
            `There is only one thing that can be *${nextWord(s)}*, so it cannot be just any one. *${s.w}* means one of many.`,
            `能称作 *${nextWord(s)}* 的只有一个，不是随便哪一个。*${s.w}* 表示“许多中的一个”。`,
          )
        : t(
            `The first sentence already mentioned this thing, so it is no longer just any one. *${s.w}* is for something mentioned for the first time.`,
            `前一句已经提到过这个东西，它就不再是随便哪一个了。*${s.w}* 用于第一次提到的东西。`,
          ),
  ),
  when(
    (s) => isWord(s, ["an"], ["a"]),
    (s) =>
      t(
        `*${nextWord(s)}* starts with a consonant sound, so *an* does not fit before it.`,
        `*${nextWord(s)}* 以辅音开头，前面不能用 *an*。`,
      ),
  ),
  when(
    (s) => isWord(s, ["a"], ["an"]),
    (s) => t(`*${nextWord(s)}* starts with a vowel sound, so *a* does not fit before it.`, `*${nextWord(s)}* 以元音开头，前面不能用 *a*。`),
  ),
  when(
    (s) => isWord(s, ["the"], ["a", "an"]),
    t(
      "*the* points to a thing both people already know. This one is new to the reader, mentioned for the first time.",
      "*the* 指双方都知道的那个东西。这里的东西是第一次提到，读者还不知道。",
    ),
  ),
);

/** itForWeatherFixNot explains a sentence about weather or time that leaves out *it*. */
export const itForWeatherFixNot = explain(
  when(
    (s) => /^it\s/iu.test(s.wrong.trim()) && !/^it (is|was)\b/iu.test(s.wrong.trim()),
    t(
      "*It* needs a verb after it. Weather and time are said with *it* and *is*, usually written as one short word.",
      "*It* 后面要有动词。说天气和时间要用 *it* 加 *is*，通常缩写成一个词。",
    ),
  ),
  when(
    (s) => !/^it\b|^it's\b/iu.test(s.wrong.trim()) && /^it's\b/iu.test(s.right.trim()),
    (s) =>
      /^is\b/iu.test(s.wrong.trim())
        ? t(
            "This sentence has no subject. Weather, time and distance have no one doing anything, so English puts *it* in the subject's place.",
            "这个句子没有主语。天气、时间和距离没有动作的发出者，所以英语用 *it* 占主语的位置。",
          )
        : t(
            "This is not a full sentence: it has no subject and no verb. Weather and time are said with *it* and *be*.",
            "这不是完整的句子：没有主语也没有动词。说天气和时间要用 *it* 加 *be*。",
          ),
  ),
);

/** pastTime explains a present form of *be* in a sentence about the past. */
const pastTime: Case = when(
  (s) => isWord(s, ["am", "is", "are"], ["was", "were"]),
  (s) => {
    const when_ = /\b(yesterday|last \w+|\w+ ago|in \d{4})\b/iu.exec(s.wrong)?.[0] ?? "";
    return t(
      `*${when_}* puts this in the past, so *be* takes its past form. *${s.w}* is for now.`,
      `*${when_}* 说明这是过去的事，所以 *be* 要用过去式。*${s.w}* 表示现在。`,
    );
  },
);

/** wasAndWereFixNot explains a present form of *be* about the past, or *was* and *were* that do not agree. */
export const wasAndWereFixNot = explain(pastTime, beAgreement);

/** wasAndWereAskNot explains *was* or *were* that does not agree with the subject after it. */
export const wasAndWereAskNot = explain(beAgreement, statementQuestion);

/** whQuestionsAskNot explains a wh- question without *do* or *does*, or with *be* left after its subject. */
export const whQuestionsAskNot = explain(
  when(
    (s) => s.wrong.trim().endsWith("?") && !/^(what|where|when|who|how|why|which)\b/iu.test(s.wrong.trim()),
    t(
      "A statement with a question mark does not ask for the missing information. A wh- question starts with the question word for what you want to know (*what*, *where*, *when*, *who*, *how*…), then the helper verb.",
      "陈述句加问号并不能问出想知道的信息。特殊疑问句要以所问内容的疑问词开头（*what*、*where*、*when*、*who*、*how*……），后面接助动词。",
    ),
  ),
  when(
    (s) => /\b(does|do|did) \w+/iu.test(s.wrong) && !/\b(does|do|did)\b/iu.test(s.right),
    t(
      "Here the question word asks about the subject, the one doing the action, so it takes the verb directly, with no *do* or *does*.",
      "这里疑问词问的是主语，即做动作的一方，所以直接跟动词，不用 *do* 或 *does*。",
    ),
  ),
  when(
    (s) =>
      /^(what|where|when|who|how|why|which)\s+(?!do\b|does\b|did\b|is\b|are\b|was\b|were\b|can\b|time\b|many\b|much\b)\S+\s+\S+/iu.test(
        s.wrong.trim(),
      ) && /\b(do|does|did)\b/iu.test(s.wrong),
    t(
      "The helper verb is left after the subject, as in a statement. In a wh- question it comes right after the question word, before the subject.",
      "助动词还像陈述句一样放在主语后面。特殊疑问句里，它要紧跟在疑问词后面、主语前面。",
    ),
  ),
  when(
    (s) =>
      /^(what|where|when|who|how|why|which)\b/iu.test(s.wrong.trim()) &&
      /\b(do|does|did)\b/iu.test(s.right) &&
      !/\b(do|does|did)\b/iu.test(s.wrong),
    t(
      "A wh- question in the present simple needs *do* or *does* right after the question word, and the verb goes back to its base form.",
      "一般现在时的特殊疑问句要在疑问词后面加 *do* 或 *does*，动词还原成原形。",
    ),
  ),
  when(
    (s) => /^(what|where|when|who|how|why|which)\b/iu.test(s.wrong.trim()) && reordered(s.wrong, s.right),
    t(
      "In a wh- question, the verb comes right after the question word, before the subject. Here the verb is left at the end as in a statement.",
      "特殊疑问句里，动词紧跟在疑问词后面、主语前面。这里动词还像陈述句一样留在后面。",
    ),
  ),
  doAgreement,
  beAgreement,
  baseAfterHelper,
);

/** canForRequestsAskNot explains *to* after *can I* or *can you*, or a request without *please*. */
export const canForRequestsAskNot = explain(
  when(
    (s) => /^(i|you) can\b/iu.test(s.wrong.trim()),
    t(
      "A question mark alone does not make the request. *Can* moves in front of *I* or *you*.",
      "只加问号还不是请求。*Can* 要移到 *I* 或 *you* 前面。",
    ),
  ),
  when(
    (s) => /^can (i|you) to\b/iu.test(s.wrong.trim()),
    t(
      "*can* is followed by the base verb with no *to*, even with *I* or *you* in between.",
      "*can* 后面直接跟动词原形，不加 *to*，中间隔着 *I* 或 *you* 也一样。",
    ),
  ),
  toAfterModal,
  baseAfterHelper,
  noSubject,
  noVerb,
);
