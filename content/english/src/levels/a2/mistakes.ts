// Feedback for the listed wrong responses of the typed problems of A2, one kind of mistake at a time.

import { t } from "@ga/content";
import { reordered } from "@ga/subject-english";
import {
  baseAfterDo,
  baseAfterHelper,
  beAgreement,
  doWithModal,
  explain,
  haveAgreement,
  notAlone,
  participleNeeded,
  pastNeeded,
  regularEd,
  type Seen,
  spelling,
  statementQuestion,
  thirdPersonExtra,
  thirdPersonMissing,
  toAfterModal,
  when,
} from "../../why-not.ts";

/** low is a stretch of text in small letters without marks, for comparing. */
const low = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, "");

/** isWord tests that the differing stretch of the response is one of some words, and of the right answer one of others. */
const isWord = (s: Seen, wrong: readonly string[], right?: readonly string[]) =>
  wrong.includes(low(s.w)) && (right === undefined || right.includes(low(s.r)));

/** past explains a past form misspelled, made regular, or left in the present. */
const past = [spelling, regularEd, pastNeeded];

/** pastSimpleRegularSpellNot explains a typed past form left in the present or misspelled. */
export const pastSimpleRegularSpellNot = explain(...past);

/** pastSimpleRegularFixNot explains a corrected sentence that keeps its present verb. */
export const pastSimpleRegularFixNot = explain(...past);

/** pastSimpleIrregularSpellNot explains an irregular verb given *-ed*. */
export const pastSimpleIrregularSpellNot = explain(...past);

/** pastSimpleQuestionsAndNegativesWriteNegativeNot explains a past form kept after *didn't*. */
export const pastSimpleQuestionsAndNegativesWriteNegativeNot = explain(notAlone, baseAfterHelper, baseAfterDo);

/** pastSimpleQuestionsAndNegativesWriteQuestionNot explains a past form kept after *Did* and its subject. */
export const pastSimpleQuestionsAndNegativesWriteQuestionNot = explain(baseAfterDo, statementQuestion);

/** writingSentencesInThePastWriteNot explains a sentence about a past day whose verb stays in the present. */
export const writingSentencesInThePastWriteNot = explain(
  when(
    (s) => /^.+? on \w+day \S/u.test(s.wrong) && /on \w+day\.?$/u.test(s.right.trim()),
    t(
      "The day is in the middle of the sentence here. In English, a time like *on Sunday* usually goes at the end, after what the person did.",
      "这里时间放在了句子中间。英语里像 *on Sunday* 这样的时间通常放在句末，在所做的事情后面。",
    ),
  ),
  when(
    (s) =>
      s.w !== "" && s.r !== "" && !s.w.includes(" ") && /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/iu.test(s.right),
    (s) =>
      t(
        `This tells what happened on a day that is over, so the verb takes its past form. *${s.w}* is a present form.`,
        `这里讲的是已经过去的某一天发生的事，所以动词要用过去式。*${s.w}* 是现在时的形式。`,
      ),
  ),
  ...past,
);

/** shouldAndMustFixNot explains *to* or *-s* after *should* or *must*. */
export const shouldAndMustFixNot = explain(toAfterModal, baseAfterHelper);

/** haveToWriteNot explains *have to* that does not agree, keeps *has* after *doesn't*, or is made negative with *haven't*. */
export const haveToWriteNot = explain(
  when(
    (s) => /\bmustn't\b/iu.test(s.wrong) && /\b(don't|doesn't) have to\b/iu.test(s.right),
    t(
      "*mustn't* means something is not allowed. Here the meaning is that it is not needed, which the negative of *have to* says.",
      "*mustn't* 表示“不允许”。这里的意思是“没有必要”，要用 *have to* 的否定形式表达。",
    ),
  ),
  when(
    (s) => /^(has|have) \S+( \S+)? to\b/iu.test(s.wrong.trim()),
    t(
      "*have to* behaves like an ordinary verb: its questions start with *do* or *does*, not with *have* or *has*.",
      "*have to* 的用法像普通动词：疑问句以 *do* 或 *does* 开头，而不是 *have* 或 *has*。",
    ),
  ),
  when(
    (s) => /\bmust to\b/iu.test(s.wrong),
    t(
      "*must* is followed straight by the base verb, never by *to*. The task asks for the same meaning with *have to*.",
      "*must* 后面直接跟动词原形，从不加 *to*。这道题要求用 *have to* 表达同样的意思。",
    ),
  ),
  when(
    (s) => /\bhaven't to\b|\bhasn't to\b/iu.test(s.wrong),
    t(
      "*have to* behaves like an ordinary verb: its negative is made with *don't* or *doesn't*, not with *haven't* or *hasn't*.",
      "*have to* 的用法像普通动词：否定要用 *don't* 或 *doesn't*，而不是 *haven't* 或 *hasn't*。",
    ),
  ),
  baseAfterHelper,
  baseAfterDo,
  haveAgreement,
);

/** writingAdviceWithShouldAdviceNot explains *to* after *should*. */
export const writingAdviceWithShouldAdviceNot = explain(
  toAfterModal,
  baseAfterHelper,
  when(
    (s) => s.w === "" && low(s.r) === "should",
    t("This only says what they do. Advice puts *should* before the verb.", "这只是在陈述他们做什么。提建议要在动词前加 *should*。"),
  ),
);

/** writingAdviceWithShouldNotNot explains *should* made negative with *don't*. */
export const writingAdviceWithShouldNotNot = explain(
  doWithModal,
  when(
    (s) => /\bshould not to\b/iu.test(s.wrong),
    t("After *should not*, the base verb follows with no *to*.", "*should not* 后面直接跟动词原形，不加 *to*。"),
  ),
  toAfterModal,
  baseAfterHelper,
);

/** writingAdviceWithShouldTwoNot explains two pieces of advice joined by a comma alone. */
export const writingAdviceWithShouldTwoNot = explain(
  when(
    (s) => /\band to\b/iu.test(s.wrong),
    t(
      "*should* reaches over both verbs, so the one after *and* is a base verb too, with no *to*.",
      "*should* 管着两个动词，所以 *and* 后面的动词也用原形，不加 *to*。",
    ),
  ),
  when(
    (s) => /, \w/u.test(s.wrong) && / and /u.test(s.right) && !/ and /u.test(s.wrong),
    t(
      "A comma alone cannot join the two pieces of advice. The last two things in a list are joined with *and*.",
      "只用逗号不能把两条建议连起来。列举的最后两项要用 *and* 连接。",
    ),
  ),
  toAfterModal,
  baseAfterHelper,
);

/** possessivePronounsFixNot explains *mine* before a noun, *my* with no noun after it, and *him* for whose. */
export const possessivePronounsFixNot = explain(
  when(
    (s) => isWord(s, ["mine", "yours", "hers", "ours", "theirs"]),
    (s) =>
      t(
        `*${s.w}* stands on its own, in place of a noun. Before a noun, English uses the shorter form that says whose it is.`,
        `*${s.w}* 单独使用，代替名词。名词前面要用表示“谁的”的另一种形式。`,
      ),
  ),
  when(
    (s) => isWord(s, ["my", "your", "her", "our", "their"]) && s.span.after.trim() === "",
    (s) =>
      t(
        `*${s.w}* has to be followed by a noun. With no noun after it, at the end of a sentence, English uses the form that stands on its own.`,
        `*${s.w}* 后面必须跟名词。后面没有名词、放在句末时，英语要用可以单独使用的那个形式。`,
      ),
  ),
  when(
    (s) => isWord(s, ["him", "me", "us", "them"]),
    (s) =>
      t(
        `*${s.w}* is the form for someone things are done to, as in *help ${low(s.w)}*. It cannot say whose something is.`,
        `*${s.w}* 是动作对象的形式，比如 *help ${low(s.w)}*。它不能表示“谁的”。`,
      ),
  ),
);

/** irregularCompared are adjectives whose comparing forms are words of their own. */
const irregularCompared = ["good", "bad", "far"];

/** writingComparisonsWriteNot explains *-er* on a long adjective, *more* with a short one, and *-er* on *good* or *bad*. */
export const writingComparisonsWriteNot = explain(
  when(
    (s) => s.w === "" && low(s.r) === "than",
    t(
      "A comparison names the second thing after *than*. Without it, the two things are not linked.",
      "比较要在 *than* 后面说出第二样东西。没有它，两样东西就连不起来。",
    ),
  ),
  when(
    (s) => isWord(s, ["that"], ["than"]),
    t(
      "*that* points to something. The word that links the two things compared is a different one.",
      "*that* 是指示词。连接两个比较对象的是另一个词。",
    ),
  ),
  when(
    (s) => /^(gooder|badder|farer|goodest|baddest)$/u.test(low(s.w)),
    (s) =>
      t(
        `*${irregularCompared.find((a) => low(s.w).startsWith(a)) ?? ""}* is irregular: it does not add *-er*, but changes to a different word when it compares.`,
        `*${irregularCompared.find((a) => low(s.w).startsWith(a)) ?? ""}* 是不规则的：比较时不加 *-er*，而是变成另一个词。`,
      ),
  ),
  when(
    (s) => /^more \w+$/u.test(low(s.w)) && !/^more /u.test(low(s.r)),
    (s) => {
      const adjective = low(s.w).split(" ")[1] ?? "";
      return t(
        `*${adjective}* is a short adjective of one syllable, so it compares with *-er*, not with *more*.`,
        `*${adjective}* 是单音节的短形容词，比较级加 *-er*，不用 *more*。`,
      );
    },
  ),
  when(
    (s) => /eer$/u.test(low(s.w)),
    (s) => t(`*${s.w}*: an adjective that ends in *e* adds only *-r*, not *-er*.`, `*${s.w}*：以 *e* 结尾的形容词只加 *-r*，不加 *-er*。`),
  ),
  spelling,
  when(
    (s) => /er$/u.test(low(s.w)) && /^more /u.test(low(s.r)),
    (s) =>
      t(
        `*${s.w}*: this adjective has two or more syllables (and does not end in *-y*), so it compares with *more* before it instead of *-er*.`,
        `*${s.w}*：这个形容词有两个或更多音节（且不以 *-y* 结尾），比较级要在前面加 *more*，而不是加 *-er*。`,
      ),
  ),
);

/** writingComparisonsMostNot explains a superlative written without *the*. */
export const writingComparisonsMostNot = explain(
  when(
    (s) => /\bmost \w+/iu.test(s.wrong) && !/\bmost\b/iu.test(s.right),
    (s) => {
      const adjective = /\bmost (\w+)/iu.exec(s.wrong)?.[1] ?? "";
      if (irregularCompared.includes(adjective.toLowerCase())) {
        return t(
          `*${adjective}* is irregular: its superlative is neither *most ${adjective}* nor *-est*, but a different word.`,
          `*${adjective}* 是不规则的：最高级既不是 *most ${adjective}*，也不加 *-est*，而是另一个词。`,
        );
      }
      return /y$/u.test(adjective)
        ? t(
            `*${adjective}* ends in *-y*, so it takes *-est* (with the *y* changed to *i*) instead of *most*.`,
            `*${adjective}* 以 *-y* 结尾，最高级要加 *-est*（*y* 变成 *i*），不用 *most*。`,
          )
        : t(
            `*${adjective}* is a short adjective of one syllable, so it takes *-est*, not *most*.`,
            `*${adjective}* 是单音节的短形容词，最高级加 *-est*，不用 *most*。`,
          );
    },
  ),
  when(
    (s) => s.w === "" && low(s.r) === "the",
    t(
      "A superlative picks out the one that is more than all the others, so it always takes *the* before it.",
      "最高级是从所有中挑出最突出的那一个，所以前面总要加 *the*。",
    ),
  ),
);

/** quantifiersAFewAndALittleFixNot explains *a few* with something not counted and *a little* with things counted. */
export const quantifiersAFewAndALittleFixNot = explain(
  when(
    (s) => isWord(s, ["few"], ["little"]),
    (s) => {
      const noun = s.span.after.split(" ")[0]?.replace(/[^\p{L}]/gu, "") ?? "";
      return t(
        `*${noun}* is not counted one by one, so *a few* does not fit it. *a few* goes with plural nouns you can count.`,
        `*${noun}* 不能一个一个地数，所以不能用 *a few*。*a few* 跟可数名词的复数连用。`,
      );
    },
  ),
  when(
    (s) => isWord(s, ["little"], ["few"]),
    (s) => {
      const noun = s.span.after.split(" ")[0]?.replace(/[^\p{L}]/gu, "") ?? "";
      return t(
        `*${noun}* can be counted one by one, so *a little* does not fit it. *a little* goes with things that are not counted, like *milk* or *salt*.`,
        `*${noun}* 可以一个一个地数，所以不能用 *a little*。*a little* 跟不可数的东西连用，比如 *milk*、*salt*。`,
      );
    },
  ),
);

/** writingStepsInOrderWriteNot explains a step written without the word that shows its place in the order. */
export const writingStepsInOrderWriteNot = explain(
  when(
    (s) => isWord(s, ["first", "then", "next", "finally"]),
    (s) => {
      const [step = "", of = ""] = /Step (\d+) of (\d+)/u.exec(s.shown)?.slice(1) ?? [];
      return low(s.w) === "first"
        ? t(
            `*First* is only for the first step, but this is step ${step} of ${of}.`,
            `*First* 只用于第一步，但这是 ${of} 步中的第 ${step} 步。`,
          )
        : low(s.w) === "finally"
          ? t(
              `*Finally* is only for the last step, but this is step ${step} of ${of}.`,
              `*Finally* 只用于最后一步，但这是 ${of} 步中的第 ${step} 步。`,
            )
          : t(
              `*${s.w}* is for a step in the middle, but this is step ${step} of ${of}.`,
              `*${s.w}* 用于中间的步骤，但这是 ${of} 步中的第 ${step} 步。`,
            );
    },
  ),
  when(
    (s) => s.w === "" && s.span.before === "",
    (s) => {
      const [step = "", of = ""] = /Step (\d+) of (\d+)/u.exec(s.shown)?.slice(1) ?? [];
      return t(
        `This is step ${step} of ${of}, but nothing shows it. Each step starts with a word that tells its place in the order: one for the first step, others for the middle ones, and one for the last.`,
        `这是 ${of} 步中的第 ${step} 步，但句子里看不出来。每一步都要以表示顺序的词开头：第一步、中间几步和最后一步各有相应的词。`,
      );
    },
  ),
);

/** adverbsOfMannerWriteNot explains an adjective used to say how someone does something. */
export const adverbsOfMannerWriteNot = explain(
  when(
    (s) => isWord(s, ["goodly"]),
    t(
      "*good* is irregular: its adverb is not made with *-ly* but is a different word.",
      "*good* 是不规则的：它的副词不是加 *-ly*，而是另一个词。",
    ),
  ),
  when(
    (s) => /(e|le)ly$|ley$/u.test(low(s.w)) && /ly$/u.test(low(s.r)) && low(s.w).length === low(s.r).length + 1,
    (s) =>
      t(`*${s.w}*: *-ly* is added straight to the adjective, with no extra *e*.`, `*${s.w}*：*-ly* 直接加在形容词后面，中间不加 *e*。`),
  ),
  when(
    (s) => isWord(s, ["good"]),
    t(
      "*good* is an adjective: it describes a noun, as in *a good swimmer*. To say how someone does something, its adverb is a different, irregular word.",
      "*good* 是形容词，修饰名词，比如 *a good swimmer*。要说某人做事做得怎样，它的副词是另一个不规则的词。",
    ),
  ),
  when(
    (s) => !s.w.includes(" ") && low(s.r).startsWith(low(s.w).replace(/e$/u, "").slice(0, -1)) && /ly$/u.test(low(s.r)),
    (s) =>
      t(
        `*${s.w}* is an adjective: it describes a noun, as in the first sentence. To say how someone does something, English uses the adverb, usually the adjective with *-ly*.`,
        `*${s.w}* 是形容词，像第一句那样修饰名词。要说某人怎样做事，英语用副词，通常是形容词加 *-ly*。`,
      ),
  ),
);

/** couldForPastAbilityWriteNot explains *can* used for what someone was able to do in the past. */
export const couldForPastAbilityWriteNot = explain(
  doWithModal,
  baseAfterHelper,
  when(
    (s) => isWord(s, ["can", "can't", "cannot"]),
    (s) => {
      const time = /when \w+ was \w+/iu.exec(s.wrong)?.[0] ?? "";
      return t(
        `*${time}* is in the past, so the ability is in the past too. *${s.w}* is for now; it has its own past form.`,
        `*${time}* 说的是过去，所以能力也是过去的。*${s.w}* 表示现在，它有自己的过去式。`,
      );
    },
  ),
);

/** pastContinuousWriteNot explains *was* or *were* that does not agree with the subject. */
export const pastContinuousWriteNot = explain(
  when(
    (s) => /\bwhen \S+( \S+)? (was|were) \w+ing\b/iu.test(s.wrong),
    t(
      "The action after *when* is short and finished: it breaks into the longer one. Only the longer, background action is in the past continuous; the short one is in the past simple.",
      "*when* 后面的动作短暂且已完成，它打断了另一个较长的动作。只有那个较长的背景动作用过去进行时，短暂的动作用一般过去时。",
    ),
  ),
  beAgreement,
);

/** beGoingToWriteNot explains *am*, *is* or *are* before *going to* that does not agree with the subject. */
export const beGoingToWriteNot = explain(
  beAgreement,
  when(
    (s) => s.w === "" && low(s.r) === "to",
    t("*going* is followed by *to* and the base verb; *to* cannot be left out.", "*going* 后面要接 *to* 加动词原形，*to* 不能省略。"),
  ),
);

/** beGoingToQuestionNot explains a question with *going to* left in statement order. */
export const beGoingToQuestionNot = explain(
  statementQuestion,
  when(
    (s) => /^(do|does)\b/iu.test(s.wrong.trim()),
    t(
      "*going to* comes with *am*, *is* or *are*, so the question moves that verb in front of the subject. *do* and *does* are not used.",
      "*going to* 和 *am*、*is*、*are* 连用，所以疑问句要把这个动词移到主语前面，不用 *do* 或 *does*。",
    ),
  ),
);

/** willForTheFutureWriteNot explains a prediction without *will*, or *won't* replaced with *don't*. */
export const willForTheFutureWriteNot = explain(
  when(
    (s) => /\b(will|won't) probably to\b|\bprobably won't to\b/iu.test(s.wrong),
    t(
      "*will* and *won't* are followed by the base verb with no *to*, even with *probably* in between.",
      "*will* 和 *won't* 后面接动词原形，不加 *to*，中间隔着 *probably* 也一样。",
    ),
  ),
  when(
    (s) => /\bdon't probably\b|\bdoesn't probably\b/iu.test(s.wrong),
    t(
      "A prediction is made negative with *will* and *not*, not with *don't*. *probably* comes before that short negative word.",
      "预测的否定用 *will* 加 *not*，不用 *don't*。*probably* 放在这个否定缩写词前面。",
    ),
  ),
  when(
    (s) => s.w === "" && low(s.r) === "will",
    t(
      "*probably* only says how sure you are; it does not show the future. A prediction needs *will* before *probably* and the verb.",
      "*probably* 只表示有多大把握，不表示将来。预测要在 *probably* 和动词前加 *will*。",
    ),
  ),
);

/** presentPerfectWithEverAndNeverWriteNot explains *did* with a past participle and *have* or *has* that does not agree. */
export const presentPerfectWithEverAndNeverWriteNot = explain(
  when(
    (s) => isWord(s, ["did"], ["have", "has"]),
    t(
      "A question about experience at any time in your life uses the present perfect: *have* or *has* with the past participle. *did* does not go with a past participle.",
      "询问一生中是否有过某种经历要用现在完成时：*have* 或 *has* 加过去分词。*did* 不能和过去分词连用。",
    ),
  ),
  haveAgreement,
  participleNeeded,
);

/** tooAndEnoughWriteNot explains *enough* put before its adjective, and *enough* where *too* is meant. */
export const tooAndEnoughWriteNot = explain(
  when(
    (s) => /\bnot\b/iu.test(s.shown) && /n't\b/iu.test(s.right) && !/n't\b|\bnot\b/iu.test(s.wrong),
    t("The note says *not*, so the sentence has to be negative.", "提示里有 *not*，所以句子要用否定形式。"),
  ),
  when(
    (s) => s.w === "" && /^(is|are)$/u.test(low(s.r)),
    t("This sentence has no verb. *too* and an adjective need *be* before them.", "这个句子没有动词。*too* 加形容词前面要有 *be*。"),
  ),
  when(
    (s) => /\benough \w+/iu.test(s.wrong) && reordered(s.wrong, s.right),
    t("*enough* goes after an adjective, not before it.", "*enough* 要放在形容词后面，而不是前面。"),
  ),
  when(
    (s) => /\benough\b/iu.test(s.wrong) && /\btoo\b/iu.test(s.right),
    t(
      "*enough* means as much as needed, which is fine. Here the boots are more than needed, a problem, which takes a different word before the adjective.",
      "*enough* 表示“足够”，是合适的。这里是超出了需要，是个问题，要在形容词前用另一个词。",
    ),
  ),
);

/** oneAndOnesWriteNot explains *one* for more than one thing, *ones* for one, and an adjective left without *one*. */
export const oneAndOnesWriteNot = explain(
  when(
    (s) => isWord(s, ["them", "it"]),
    (s) =>
      t(
        `*${s.w}* cannot follow an adjective. After a word like *brown*, English uses a word that stands for the noun, not a pronoun like *${low(s.w)}*.`,
        `*${s.w}* 不能放在形容词后面。在 *brown* 这类词后面，要用代替名词的词，而不是 *${low(s.w)}* 这样的代词。`,
      ),
  ),
  when(
    (s) => isWord(s, ["one"], ["ones"]),
    t("*one* stands for a single thing, but this replaces more than one.", "*one* 只代替一个东西，但这里代替的不止一个。"),
  ),
  when(
    (s) => isWord(s, ["ones"], ["one"]),
    t("*ones* stands for more than one thing, but this replaces a single thing.", "*ones* 代替不止一个东西，但这里只代替一个。"),
  ),
  when(
    (s) => s.w === "" && /^ones?$/u.test(low(s.r)),
    (s) =>
      t(
        `*${s.span.before.split(" ").pop() ?? ""}* is an adjective, and an adjective cannot stand alone in place of a noun. It needs a noun, or a word that stands for one, after it.`,
        `*${s.span.before.split(" ").pop() ?? ""}* 是形容词，形容词不能单独代替名词。它后面要有名词，或者代替名词的词。`,
      ),
  ),
);

/** presentPerfectWithJustAlreadyAndYetWriteNot explains *already* in a negative, *did* with a past participle, and *just* or *already* at the end. */
export const presentPerfectWithJustAlreadyAndYetWriteNot = explain(
  when(
    (s) => /\b(didn't|did not)\b/iu.test(s.wrong) && /\b(haven't|hasn't)\b/iu.test(s.right),
    t(
      "With *yet*, the sentence is about now: something expected has not happened up to this moment. That takes the present perfect, *haven't* or *hasn't* with the past participle.",
      "带 *yet* 的句子说的是现在：预期的事到此刻还没发生。这要用现在完成时，即 *haven't* 或 *hasn't* 加过去分词。",
    ),
  ),
  haveAgreement,
  participleNeeded,
  when(
    (s) => isWord(s, ["already"], ["yet"]),
    t(
      "*already* goes in positive sentences. A negative sentence or a question about something expected uses a different word at the end.",
      "*already* 用于肯定句。否定句或询问预期的事时，句末要用另一个词。",
    ),
  ),
  when(
    (s) => /^did\b/iu.test(s.wrong.trim()) && /^(has|have)\b/iu.test(s.right.trim()),
    t(
      "With *yet*, the question is in the present perfect: it starts with *has* or *have*, followed by the past participle. *did* does not go with a past participle.",
      "带 *yet* 的问句用现在完成时：以 *has* 或 *have* 开头，后接过去分词。*did* 不能和过去分词连用。",
    ),
  ),
  when(
    (s) => reordered(s.wrong, s.right) && /\b(just|already)\.?$/iu.test(s.wrong.trim()),
    (s) => {
      const word = /\b(just|already)\.?$/iu.exec(s.wrong.trim())?.[1] ?? "";
      return t(
        `*${word}* belongs between *has* or *have* and the past participle${word === "just" ? "; it cannot go at the end" : ", which is where it usually goes"}.`,
        `*${word}* 应该放在 *has* 或 *have* 与过去分词之间${word === "just" ? "，不能放在句末" : "，这是它通常的位置"}。`,
      );
    },
  ),
);

/** verbsFollowedByToWriteNot explains a second verb without *to*, and a first verb that does not agree. */
export const verbsFollowedByToWriteNot = explain(
  when(
    (s) => s.w === "" && low(s.r) === "to",
    (s) => {
      const verb = s.span.before.split(" ").pop() ?? "";
      return t(
        `*${verb}* is followed by *to* and the base form of the next verb. The two verbs cannot stand side by side.`,
        `*${verb}* 后面要接 *to* 加下一个动词的原形，两个动词不能直接并列。`,
      );
    },
  ),
  pastNeeded,
  thirdPersonMissing,
  thirdPersonExtra,
);

/** subjectAndObjectQuestionsWriteNot explains *did* in a question about the subject, and a past form kept after *did*. */
export const subjectAndObjectQuestionsWriteNot = explain(
  when(
    (s) => /^(who|what) did\b/iu.test(s.wrong.trim()) && !/\bdid\b/iu.test(s.right),
    t(
      "The bold words are the subject, the one who did the action. A question about the subject puts *who* or *what* in its place and keeps the verb as it is, with no *did*.",
      "加粗的词是主语，即做动作的一方。对主语提问时，用 *who* 或 *what* 代替它，动词保持原样，不加 *did*。",
    ),
  ),
  baseAfterDo,
  when(
    (s) => /^(who|what) /iu.test(s.wrong.trim()) && /^(who|what) did\b/iu.test(s.right.trim()) && !/\bdid\b/iu.test(s.wrong),
    t(
      "The bold words are the object, the one the action was done to. A question about the object needs *did* after *who* or *what*, then the subject and the base verb.",
      "加粗的词是宾语，即动作的对象。对宾语提问时，要在 *who* 或 *what* 后面加 *did*，再接主语和动词原形。",
    ),
  ),
  when(
    (s) => !s.w.includes(" ") && s.w !== "" && /^(who|what) /iu.test(s.wrong.trim()),
    (s) =>
      t(
        `The bold sentence tells what happened in the past, and a question about its subject keeps that past verb. *${s.w}* is a present form.`,
        `加粗的句子说的是过去发生的事，对主语提问时动词仍用过去式。*${s.w}* 是现在时的形式。`,
      ),
  ),
);
