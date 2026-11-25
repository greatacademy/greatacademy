// Feedback for the listed wrong responses of the typed problems of Pre-A1, one kind of mistake at a time.

import { t } from "@ga/content";
import { reordered } from "@ga/subject-english";
import {
  baseAfterHelper,
  beAgreement,
  beBeforeVerb,
  capitalsAndEnd,
  explain,
  haveAgreement,
  noSubject,
  noVerb,
  type Seen,
  statementQuestion,
  thirdPersonExtra,
  toAfterModal,
  when,
} from "../../why-not.ts";

/** words splits a response into words in small letters, without marks. */
const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}' ]/gu, "")
    .split(/\s+/u)
    .filter((w) => w !== "");

/** canNot explains *can* followed by *to* or by a verb with *-s*. */
export const canNot = explain(
  toAfterModal,
  baseAfterHelper,
  when(
    (s) => /\bdon't can\b/iu.test(s.wrong),
    t(
      "*can* makes its own negative: *not* joins *can* itself. *can* never takes *do* or *don't* in front of it.",
      "*can* 自己构成否定：*not* 直接加在 *can* 上。*can* 前面从不加 *do* 或 *don't*。",
    ),
  ),
  when(
    (s) => /\bnot can\b/iu.test(s.wrong),
    t("*not* comes after *can*, not before it, and the two are written together.", "*not* 要放在 *can* 后面，不是前面，而且两者连写。"),
  ),
);

/** beQuestionNot explains a question with *be* left in statement order or ended with *ma*. */
export const beQuestionNot = explain(
  when(
    (s) => / ma\?$/u.test(s.wrong.trim()),
    t(
      "*ma* is how Chinese turns a sentence into a question, but English adds no word at the end. Instead, *is*, *am* or *are* moves in front of the subject.",
      "中文在句末加“吗”来提问，但英语不在句末加词，而是把 *is*、*am*、*are* 移到主语前面。",
    ),
  ),
  statementQuestion,
);

/** adjectiveNot explains an adjective put after its noun or given an *-s*. */
export const adjectiveNot = explain(
  when(
    (s) => s.w.endsWith("s") && s.w.split(" ").length === 1 && words(s.shown).some((w) => `${w}s` === s.w.toLowerCase()),
    (s) =>
      t(
        `*${s.w}*: an adjective never takes *-s* in English, even when the noun after it means more than one.`,
        `*${s.w}*：英语形容词永远不加 *-s*，即使后面的名词是复数。`,
      ),
  ),
  when(
    (s) => s.span.after === "" || /[.]$/u.test(s.w),
    (s) => {
      const adjective = /\(([^)]+)\)/u.exec(s.shown)?.[1] ?? "";
      return t(
        `*${adjective}* comes after the noun here, but in English an adjective goes before the noun it describes.`,
        `这里 *${adjective}* 放在了名词后面，但英语形容词要放在它修饰的名词前面。`,
      );
    },
  ),
);

/** aboutYourselfNot explains *My name …* without its verb or with *I* in place of *my*. */
export const aboutYourselfNot = explain(
  beBeforeVerb,
  noSubject,
  haveAgreement,
  thirdPersonExtra,
  when(
    (s) => /\bhave \p{L}+ years old\b/u.test(s.wrong),
    t(
      "English tells how old someone is with *be*, not *have*: the age describes you rather than something you own.",
      "英语用 *be* 而不是 *have* 说年龄：年龄是在描述你，而不是你拥有的东西。",
    ),
  ),
  when(
    (s) => reordered(s.wrong, s.right),
    t(
      "The describing words come after the noun here. In English, words like *long* or *brown* go before the noun they describe.",
      "这里描述词放在了名词后面。英语里 *long*、*brown* 这类描述词要放在所修饰的名词前面。",
    ),
  ),
  noVerb,
  when(
    (s) => s.w.toLowerCase() === "i",
    t(
      "*I* names the person doing something; it cannot stand before a noun. To say whose name it is, use the word that means *belonging to me*.",
      "*I* 是做事的人，不能放在名词前面。要说“谁的名字”，得用表示“我的”的那个词。",
    ),
  ),
);

/** theseNot explains a change to the plural that leaves *this*, the verb or the noun singular. */
export const theseNot = explain(
  when(
    (s) => /\b(this|that) are\b/iu.test(s.wrong) && /\b(this|that) is\b/iu.test(s.right),
    t(
      "*This* and *that* point to one thing, so the verb after them is singular. *are* goes with more than one.",
      "*this* 和 *that* 指一个东西，后面的动词要用单数。*are* 用于不止一个。",
    ),
  ),
  when(
    (s) => /^(is)$/iu.test(s.w),
    t(
      "*These* points to more than one thing, so its verb has to be plural too. *is* goes with one thing.",
      "*These* 指的是不止一个东西，所以动词也要用复数形式。*is* 只用于一个东西。",
    ),
  ),
  when(
    (s) => /^(this|that)$/iu.test(s.w),
    (s) =>
      t(
        `The verb is plural now, but *${s.w}* still points to one thing. The pointing word changes to its plural form too.`,
        `动词已经是复数了，但 *${s.w}* 仍然只指一个东西。指示词也要换成复数形式。`,
      ),
  ),
  when(
    (s) => s.w.split(" ").length === 1 && s.span.after === "",
    (s) =>
      t(
        `*${s.w.replace(/[.]$/u, "")}* is still one thing. With *these* and *are*, the noun has to be plural as well.`,
        `*${s.w.replace(/[.]$/u, "")}* 仍然是单数。用了 *these* 和 *are*，名词也要变成复数。`,
      ),
  ),
);

/** placeOrderNot explains a sentence of place whose words are out of order or that leaves out its verb. */
export const placeOrderNot = explain(
  when(
    (s: Seen) => /\b(in|on|under)\.$/u.test(s.wrong.trim()) && /\bis (the|a)\b/u.test(s.wrong),
    t(
      "The place word comes at the very end here. Words like *in*, *on* and *under* go before the place they point to, not after it.",
      "这里方位词放到了句末。*in*、*on*、*under* 这类词要放在它所指的地点前面，而不是后面。",
    ),
  ),
  when(
    (s) => !/\b(is|are)\b/u.test(s.wrong),
    t(
      "This sentence has no verb. English links the thing and where it is with *is* or *are*.",
      "这个句子没有动词。英语要用 *is* 或 *are* 把东西和它所在的位置连起来。",
    ),
  ),
  when(
    (s) => /\b(is|are) (in|on|under)\.$/u.test(s.wrong.trim()),
    t(
      "Both nouns come before the verb here. An English sentence goes: the thing, the verb, the place word, then the place.",
      "这里两个名词都放到了动词前面。英语句子的顺序是：东西、动词、方位词、地点。",
    ),
  ),
);

/** imperativeNot explains an instruction that keeps *you*, adds *-s*, or starts with *No* or *Not*. */
export const imperativeNot = explain(
  when(
    (s) => /^you don't /iu.test(s.wrong),
    t(
      "With *you* in front, this tells what someone does, not what they should do. An instruction drops *you*.",
      "前面有 *you*，这句话就成了在说某人做什么，而不是叫他做什么。祈使句要去掉 *you*。",
    ),
  ),
  when(
    (s) => /^you /iu.test(s.wrong),
    t(
      "An instruction starts with the verb itself. It speaks to *you* without saying *you*.",
      "祈使句直接以动词开头。它是对“你”说的，但不说出 *you*。",
    ),
  ),
  when(
    (s) => /^(no|not) /iu.test(s.wrong),
    (s) =>
      t(
        `*${s.wrong.split(" ")[0]}* cannot start an instruction. To tell someone not to do something, English starts with the short form of *do not*.`,
        `*${s.wrong.split(" ")[0]}* 不能放在祈使句开头。要叫人别做某事，英语用 *do not* 的缩写形式开头。`,
      ),
  ),
  when(
    (s) => /^\p{L}+s /u.test(s.wrong.trim()),
    (s) =>
      t(
        `*${s.wrong.split(" ")[0]}* has an *-s*, which a verb takes only after *he*, *she* or *it*. An instruction uses the base verb.`,
        `*${s.wrong.split(" ")[0]}* 加了 *-s*，动词只有跟在 *he*、*she*、*it* 后才加 *-s*。祈使句用动词原形。`,
      ),
  ),
);

/** wordOrderNot explains words put together out of the order of an English statement. */
export const wordOrderNot = explain(
  when(
    (s) => s.position === 1,
    (s) => {
      const [a = "", b = ""] = s.wrong.split(" ");
      return t(
        `*${a}* and *${b}* are the wrong way round. A statement starts with its subject, and a word like *my* or *the* comes before its noun.`,
        `*${a}* 和 *${b}* 的顺序反了。陈述句以主语开头，*my*、*the* 这类词要放在名词前面。`,
      );
    },
  ),
  when(
    (s) => s.position === 0,
    t(
      "These words are not in English order. A statement goes: the subject, then the verb, then the rest; a word like *my* or *the* stays right before its noun.",
      "这些词的顺序不符合英语语序。陈述句的顺序是：主语、动词、其他成分；*my*、*the* 这类词要紧挨在名词前面。",
    ),
  ),
);

/** pronounOf finds the noun a sentence starts with, to name it in feedback. */
const nounOf = (shown: string) => shown.split(/\s+(?:is|are)\s/u)[0]?.toLowerCase() ?? "";

/** heSheItNot explains *he*, *she* or *it* that does not fit the noun it replaces. */
export const heSheItNot = explain(
  when(
    (s) => /^(he|she|it)$/iu.test(s.w),
    (s) =>
      t(
        `*${s.w}* does not fit *${nounOf(s.shown)}*. *He* is for a man or a boy, *she* for a woman or a girl, and *it* for a thing or an animal.`,
        `*${s.w}* 不能指代 *${nounOf(s.shown)}*。*he* 指男性，*she* 指女性，*it* 指东西或动物。`,
      ),
  ),
);

/** possessiveNot explains a typed word for whose that is a short form, a subject word or the wrong owner. */
export const possessiveNot = explain(
  when(
    (s) => s.wrong.includes("'"),
    (s) =>
      t(
        `*${s.wrong}* is a short form of two words, such as *it is* or *you are*. A word that says whose thing it is has no apostrophe.`,
        `*${s.wrong}* 是两个词的缩写，比如 *it is*、*you are*。表示“谁的”的词不带撇号。`,
      ),
  ),
  when(
    (s) => /^(there)$/iu.test(s.wrong),
    t(
      "*There* sounds the same as the word you need, but it points to a place. The word that says whose thing it is has a different spelling.",
      "*There* 读音一样，但它指地点。表示“谁的”的那个词拼法不同。",
    ),
  ),
  when(
    (s) => /^(me|us|him|them)$/iu.test(s.wrong),
    (s) =>
      t(
        `*${s.wrong}* is the form for someone things are done to, as in *help ${s.wrong.toLowerCase()}*. Before a noun, to say whose it is, English uses a different word.`,
        `*${s.wrong}* 是动作对象的形式，比如 *help ${s.wrong.toLowerCase()}*。放在名词前面说“谁的”，英语要换一个词。`,
      ),
  ),
  when(
    (s) => /^(i|you|he|she|it|we|they)$/iu.test(s.wrong),
    (s) =>
      t(
        `*${s.wrong}* names who does something. Before a noun, to say whose it is, English uses a different word.`,
        `*${s.wrong}* 表示做事的人。放在名词前面说“谁的”，英语要换一个词。`,
      ),
  ),
  when(
    (s) => /^(my|your|his|her|its|our|their)$/iu.test(s.wrong),
    (s) =>
      t(
        `*${s.wrong}* points to another owner. *His* is for a man or a boy, *her* for a woman or a girl, *its* for a thing or an animal, *your* for the person you talk to, *our* for you and others, and *their* for other people. Look at who has it in the first sentence.`,
        `*${s.wrong}* 指的是另一个主人。*his* 指男性，*her* 指女性，*its* 指东西或动物，*your* 指对方，*our* 指包括自己在内的一些人，*their* 指别的一些人。看看第一句里是谁拥有它。`,
      ),
  ),
);

/** haveNot explains *have* or *has* that does not agree with its subject. */
export const haveNot = explain(haveAgreement);

/** leaveOutBeNot explains a sentence that leaves out *be* or uses a form that does not agree. */
export const leaveOutBeNot = explain(
  beAgreement,
  when(
    (s) => !/\b(am|is|are)\b/iu.test(s.wrong),
    t(
      "This sentence has no verb. In English, *be* (*am*, *is* or *are*) has to link the subject and what is said about it; it cannot be left out.",
      "这个句子没有动词。英语要用 *be*（*am*、*is*、*are*）把主语和后面的内容连起来，不能省略。",
    ),
  ),
);

/** articleNot explains a countable noun without *a* or *an*, or with the one that does not fit its first sound. */
export const articleNot = explain(
  when(
    (s) => /^an?$/iu.test(s.w),
    (s) => {
      const noun = s.span.after.replace(/[.,!?]+$/u, "");
      return s.w.toLowerCase() === "a"
        ? t(
            `*${noun}* starts with a vowel sound, so *a* does not fit before it: the two vowels would run together.`,
            `*${noun}* 以元音开头，前面不能用 *a*：两个元音连在一起不好读。`,
          )
        : t(`*${noun}* starts with a consonant sound, so *an* does not fit before it.`, `*${noun}* 以辅音开头，前面不能用 *an*。`);
    },
  ),
  when(
    (s) => s.w === "",
    (s) =>
      t(
        `*${s.span.after.replace(/[.,!?]+$/u, "")}* is one thing that can be counted, so it cannot stand alone after *${s.span.before}*: it needs *a* or *an* in front.`,
        `*${s.span.after.replace(/[.,!?]+$/u, "")}* 是可数的单个东西，不能单独跟在 *${s.span.before}* 后面，前面要有 *a* 或 *an*。`,
      ),
  ),
);

/** pluralNot explains a plural left singular or given the wrong one of *-s* and *-es*. */
export const pluralNot = explain(
  when(
    (s) => words(s.shown).includes(s.wrong.toLowerCase()),
    (s) =>
      t(
        `*${s.wrong}* is still one. After a number bigger than one, the noun is plural.`,
        `*${s.wrong}* 还是单数。在大于一的数字后面，名词要用复数。`,
      ),
  ),
  when(
    (s) => /(s|x|z|ch|sh)$/u.test(s.wrong.replace(/s$/u, "")) && /[^e]s$/u.test(s.wrong),
    (s) =>
      t(
        `*${s.wrong}*: a noun that ends in *s*, *x*, *z*, *ch* or *sh* takes *-es*, so the plural can be said as an extra beat.`,
        `*${s.wrong}*：以 *s*、*x*、*z*、*ch*、*sh* 结尾的名词要加 *-es*，复数才能多读出一个音节。`,
      ),
  ),
  when(
    (s) => /es$/u.test(s.wrong),
    (s) =>
      t(
        `*${s.wrong}*: *-es* is only for nouns that end in *s*, *x*, *z*, *ch* or *sh*. Other nouns just take *-s*.`,
        `*${s.wrong}*：只有以 *s*、*x*、*z*、*ch*、*sh* 结尾的名词才加 *-es*，其他名词直接加 *-s*。`,
      ),
  ),
);

/** capitalsNot explains a sentence that starts small, writes *i*, or ends without its mark. */
export const capitalsNot = explain(capitalsAndEnd);
