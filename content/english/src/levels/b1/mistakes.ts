// Feedback for the listed wrong responses of the typed problems of B1, one kind of mistake at a time.

import { t } from "@ga/content";
import { reordered } from "@ga/subject-english";
import { type Case, doWithModal, explain, notAlone, participleNeeded, regularEd, type Seen, toAfterModal, when } from "../../why-not.ts";

/** low is a stretch of text in small letters without marks, for comparing. */
const low = (x: string) => x.toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, "");

/** finishedTime finds a time in a text that is over, such as *in 2015* or *when we were five*. */
const finishedTime = (text: string) =>
  /\b(in \d{4}|in the \d{4}s|from \d{4} to \d{4}|when (?:i|you|he|she|it|we|they) (?:was|were|lived) [\w ]+|yesterday|last \w+|\w+ (?:days?|weeks?|years?) ago)\b/iu.exec(
    text,
  )?.[0];

/** presentPerfectOrPastSimpleWriteNot explains the present perfect with a finished time, and the past or present with *since* or *the first time*. */
export const presentPerfectOrPastSimpleWriteNot = explain(
  when(
    (s) => !/\b(has|have)\b/iu.test(s.right) && finishedTime(s.right) !== undefined,
    (s) =>
      /\b(has|have)\b/iu.test(s.wrong)
        ? t(
            `*${finishedTime(s.right)}* is a finished time. The present perfect links the past to now, so it cannot go with a finished time; the past simple does.`,
            `*${finishedTime(s.right)}* 是已经结束的时间。现在完成时把过去和现在联系起来，不能和已结束的时间连用，要用一般过去时。`,
          )
        : t(
            `*${finishedTime(s.right)}* is a finished time, so the verb takes its past form. This one is in the present.`,
            `*${finishedTime(s.right)}* 是已经结束的时间，所以动词要用过去式。这里用的是现在时。`,
          ),
  ),
  when(
    (s) => /^this is the first time\b/iu.test(s.wrong),
    t(
      "*This is the first time* looks at your whole life up to now, so the verb after it is in the present perfect: *have* or *has* with the past participle.",
      "*This is the first time* 着眼于到现在为止的整个人生，所以后面的动词用现在完成时：*have* 或 *has* 加过去分词。",
    ),
  ),
  when(
    (s) => /\bsince\b/iu.test(s.wrong),
    t(
      "*since* gives the point where something started, and it is still true now. That reach from the past to now takes the present perfect: *have* or *has* with the past participle.",
      "*since* 说明某事开始的时间点，而且现在仍然如此。这种从过去延续到现在的情况要用现在完成时：*have* 或 *has* 加过去分词。",
    ),
  ),
);

/** usedToWriteNot explains *used* after *didn't*, *use* in a positive sentence, *was used to*, and *not* without *didn't*. */
export const usedToWriteNot = explain(
  when(
    (s) => /\b(was|were) used to\b/iu.test(s.wrong),
    t(
      "*be used to* means being accustomed to something, and it is followed by a noun or an *-ing* form. A past habit needs no *be*: just *used to* and the base verb.",
      "*be used to* 表示习惯于某事，后面接名词或 *-ing* 形式。讲过去的习惯不用 *be*，只用 *used to* 加动词原形。",
    ),
  ),
  notAlone,
  when(
    (s) => /\b(didn't|did not|did) used to\b/iu.test(s.wrong),
    t(
      "After *did* or *didn't*, the verb goes back to its base form, so the *-d* of *used* drops.",
      "在 *did* 或 *didn't* 后面，动词要还原成原形，所以 *used* 的 *-d* 要去掉。",
    ),
  ),
  when(
    (s) => /\buse to\b/iu.test(s.wrong) && !/\b(didn't|did)\b/iu.test(s.wrong),
    t(
      "In a positive sentence about a past habit, the form is the past one, with *-d*. Only after *did* or *didn't* does it lose the *-d*.",
      "在讲过去习惯的肯定句里，要用带 *-d* 的过去形式。只有在 *did* 或 *didn't* 后面才去掉 *-d*。",
    ),
  ),
);

/** presentPerfectContinuousWriteNot explains the present continuous with *for* or *since*. */
export const presentPerfectContinuousWriteNot = explain(
  when(
    (s) => /\b(am|is|are) been\b/iu.test(s.wrong),
    t(
      "*been* comes after *have* or *has*, never after *am*, *is* or *are*. The present perfect continuous is *have* or *has*, then *been*, then the *-ing* form.",
      "*been* 跟在 *have* 或 *has* 后面，不跟在 *am*、*is*、*are* 后面。现在完成进行时是 *have* 或 *has* 加 *been* 再加 *-ing* 形式。",
    ),
  ),
  when(
    (s) => /\b(am|is|are) \w+ing\b/iu.test(s.wrong) && /\b(for|since)\b/iu.test(s.wrong),
    (s) => {
      const word = /\b(for|since)\b/iu.exec(s.wrong)?.[1] ?? "";
      return t(
        `*${word}* shows that the action started in the past and is still going on. The present continuous only looks at now; this needs the present perfect continuous, *have* or *has been* with the *-ing* form.`,
        `*${word}* 表示动作从过去开始并持续到现在。现在进行时只看现在；这里要用现在完成进行时，即 *have* 或 *has been* 加 *-ing* 形式。`,
      );
    },
  ),
);

/** willAfterIf explains *will* in the *if* part of a conditional about the future. */
const willAfterIf: Case = when(
  (s) => /\bif [^,]*\bwill\b/iu.test(s.wrong),
  t(
    "After *if*, English uses the present simple to talk about the future. *will* belongs only in the other half of the sentence, the result.",
    "在 *if* 后面，英语用一般现在时表示将来。*will* 只用在句子的另一半，即结果部分。",
  ),
);

/** firstConditionalWriteNot explains *will* after *if*, or a result without *will*. */
export const firstConditionalWriteNot = explain(
  willAfterIf,
  when(
    (s) => /\bif\b/iu.test(s.wrong) && /\bwill\b/iu.test(s.wrong) && /\bwill\b/iu.test(s.right),
    t(
      "This is a real possibility in the future, so the *if* half takes the present simple, not the past. The past after *if* is for imagined situations, with *would*.",
      "这是将来真实可能发生的事，所以 *if* 那一半用一般现在时，不用过去时。*if* 后用过去时是设想的情况，另一半要配 *would*。",
    ),
  ),
  when(
    (s) => /\bwill\b/iu.test(s.right) && !/\bwill\b|'ll\b/iu.test(s.wrong),
    t(
      "The result happens in the future, so that half takes *will* before the verb. Only the *if* half stays in the present simple.",
      "结果发生在将来，所以这一半要在动词前加 *will*。只有 *if* 那一半用一般现在时。",
    ),
  ),
  when(
    (s) =>
      /\bif\b/iu.test(s.wrong) && s.w !== "" && !s.w.includes(" ") && /s$/u.test(low(s.r)) && low(s.r).startsWith(low(s.w).slice(0, 2)),
    (s) =>
      t(
        `After *if*, the verb is in the present simple, and its subject is one person or thing, so it takes *-s*. *${s.w}* is missing it.`,
        `*if* 后面用一般现在时，主语是单个的人或事物，所以动词要加 *-s*。*${s.w}* 漏了它。`,
      ),
  ),
);

/** reportedSpeechWriteNot explains reported words that keep the speaker's *I* or *my*, or the tense of the quote. */
export const reportedSpeechWriteNot = explain(
  when(
    (s) => /\bthat (i|my)\b/iu.test(s.wrong),
    t(
      "Someone else now reports the words, so *I* and *my* no longer mean the reporter. They change to the speaker's pronouns, and the verb moves one step back into the past.",
      "现在是别人在转述这些话，所以 *I* 和 *my* 已不再指转述的人。它们要换成说话人的代词，动词也要往过去推一步。",
    ),
  ),
  when(
    (s) => /\bsaid that\b/iu.test(s.wrong),
    t(
      "After *said*, the reported verb moves one step back into the past: the present becomes the past, *am* or *is* becomes *was*, and *don't* becomes *didn't*.",
      "在 *said* 后面，转述的动词要往过去推一步：一般现在时变一般过去时，*am*、*is* 变 *was*，*don't* 变 *didn't*。",
    ),
  ),
);

/** secondConditionalWriteNot explains an imagined situation written with the present and *will*. */
export const secondConditionalWriteNot = explain(
  when(
    (s) => /\bwill\b|'ll\b/iu.test(s.wrong) && /\bwould\b/iu.test(s.right),
    t(
      "This imagines something that is not real now. The *if* half takes the past simple (with *were* for *be*), and the other half takes *would*, not *will*.",
      "这是在设想现在并不真实的情况。*if* 那一半用一般过去时（*be* 用 *were*），另一半用 *would*，不用 *will*。",
    ),
  ),
  when(
    (s) => /\bif (i|he|she|it) was\b/iu.test(s.wrong) && /\bwere\b/iu.test(s.right),
    t(
      "In an imagined situation, careful English uses *were* for every subject after *if*, even *I*, *he* and *she*.",
      "在设想的情况里，规范的英语在 *if* 后对所有主语都用 *were*，包括 *I*、*he*、*she*。",
    ),
  ),
  when(
    (s) => /\bwould\b/iu.test(s.wrong) && /\bif\b[^,]*\bwould\b/iu.test(s.wrong),
    t(
      "*would* belongs only in the result half. After *if*, an imagined situation takes the past simple.",
      "*would* 只用在结果部分。*if* 后面设想的情况用一般过去时。",
    ),
  ),
  when(
    (s) => /\bwould\b/iu.test(s.right) && !/\bwould\b|'d\b/iu.test(s.wrong),
    t("The result of an imagined situation takes *would* before the verb.", "设想情况下的结果要在动词前加 *would*。"),
  ),
  when(
    (s) => /\bif\b/iu.test(s.wrong) && /\bwould\b/iu.test(s.wrong),
    t(
      "After *if*, an imagined situation takes the past simple, even though it is about now. The present tense here makes it sound real.",
      "*if* 后面设想的情况要用一般过去时，尽管说的是现在。这里用了现在时，听起来像是真实情况。",
    ),
  ),
);

/** theCount counts the *the* in a text. */
const theCount = (x: string) => x.match(/\bthe\b/giu)?.length ?? 0;

/** articlesInGeneralAndSpecificCorrectNot explains *the* with a country or a general plural, and no *the* for a specific thing. */
export const articlesInGeneralAndSpecificCorrectNot = explain(
  when(
    (s) => /\bthe [A-Z]/u.test(s.wrong.replace(/^The /u, "the ")) && theCount(s.wrong) > theCount(s.right),
    (s) => {
      const name = /\bthe ([A-Z]\w+)/iu.exec(s.wrong)?.[1] ?? "";
      return t(
        `*${name}* is a place name. Names of countries, cities and continents take no article, except those with a word like *Kingdom* or *States*, or in the plural.`,
        `*${name}* 是地名。国家、城市和大洲的名称前不加冠词，只有带 *Kingdom*、*States* 之类词或复数形式的才加 *the*。`,
      );
    },
  ),
  when(
    (s) => /\bthe [A-Z]/u.test(s.right) && theCount(s.right) > theCount(s.wrong),
    t(
      "Names of rivers, seas, oceans and mountain ranges take *the*, and so do countries with a word like *States* or *Kingdom*.",
      "江河、海洋和山脉的名称前要加 *the*，带 *States*、*Kingdom* 之类词的国名也要加 *the*。",
    ),
  ),
  when(
    (s) => /\(in general\)/iu.test(s.shown) && theCount(s.wrong) > theCount(s.right),
    t(
      "This is about the thing in general, not a particular one. A plural or uncountable noun that means things in general takes no article.",
      "这里说的是泛指，不是特定的某个。表示泛指的复数名词或不可数名词前不加冠词。",
    ),
  ),
  when(
    (s) => theCount(s.right) > theCount(s.wrong),
    t(
      "Here the noun is not meant in general: the words around it (*of…*, *in this…*) point to particular ones. A specific thing or group takes *the*.",
      "这里的名词不是泛指：它周围的词（*of…*、*in this…*）指明了特定的对象。特指的东西或群体要加 *the*。",
    ),
  ),
);

/** tagVerb finds the helper verb of a question tag. */
const tagVerb = (x: string) => /,\s*(\S+)\s+\S+\?$/u.exec(x.trim())?.[1]?.toLowerCase() ?? "";

/** questionTagsWriteNot explains a tag with the same sign as its sentence, or with a helper verb the sentence does not use. */
export const questionTagsWriteNot = explain(
  when(
    (s) => tagVerb(s.wrong).endsWith("n't") !== tagVerb(s.right).endsWith("n't"),
    (s) =>
      tagVerb(s.right).endsWith("n't")
        ? t(
            "The sentence is positive, so the tag is negative. A tag turns the sentence round to ask the listener to agree.",
            "前面的句子是肯定的，所以反意疑问部分要用否定。附加疑问是把句子反过来问，请对方确认。",
          )
        : t(
            "The sentence is negative, so the tag is positive. A tag turns the sentence round to ask the listener to agree.",
            "前面的句子是否定的，所以反意疑问部分要用肯定。附加疑问是把句子反过来问，请对方确认。",
          ),
  ),
  when(
    (s) => /,\s*\S+\s+(this|that|these|those)\?$/iu.test(s.wrong.trim()),
    t(
      "A tag always uses a pronoun for its subject: *this* and *that* become *it*, and *these* and *those* become *they*.",
      "附加疑问的主语总是用代词：*this* 和 *that* 换成 *it*，*these* 和 *those* 换成 *they*。",
    ),
  ),
  when(
    (s) => tagVerb(s.wrong) !== tagVerb(s.right),
    (s) =>
      t(
        `*${tagVerb(s.wrong)}* is not the helper verb of this sentence. A tag repeats the sentence's own helper (*be*, *can*, *will*, *could*…); a sentence with an ordinary verb and no helper takes *do*, *does* or *did*, in its tense.`,
        `*${tagVerb(s.wrong)}* 不是这个句子的助动词。附加疑问要重复句子本身的助动词（*be*、*can*、*will*、*could*……）；句子里只有实义动词、没有助动词时，按时态用 *do*、*does* 或 *did*。`,
      ),
  ),
);

/** indirectQuestionsWriteNot explains question order, or *do*, *does* or *did*, kept inside an indirect question. */
export const indirectQuestionsWriteNot = explain(
  when(
    (s) =>
      /\b(do|does|did)\b/iu.test(s.wrong.replace(/^(do|does|did)\b/iu, "")) &&
      !/\b(do|does|did)\b/iu.test(s.right.replace(/^(do|does|did)\b/iu, "")),
    t(
      "Inside an indirect question, the words after the opening are in statement order, so *do*, *does* or *did* drops out and the verb takes the form it has in a statement.",
      "在间接疑问句里，开头之后的部分用陈述句语序，所以 *do*、*does* 或 *did* 要去掉，动词用陈述句里的形式。",
    ),
  ),
  when(
    (s) => /\bif\b|\bwhether\b/iu.test(s.right) && !/\bif\b|\bwhether\b/iu.test(s.wrong),
    t(
      "A yes-no question becomes indirect with *if* (or *whether*) after the opening, and the rest is in statement order: the subject comes before the verb.",
      "一般疑问句变成间接疑问时，开头之后要加 *if*（或 *whether*），其余部分用陈述句语序：主语在动词前面。",
    ),
  ),
  when(
    (s) => reordered(s.wrong, s.right),
    t(
      "Inside an indirect question, the subject comes before the verb, as in a statement.",
      "在间接疑问句里，主语放在动词前面，和陈述句一样。",
    ),
  ),
);

/** soAndSuchThatNot explains *very* used to lead to a result with *that*. */
export const soAndSuchThatNot = explain(
  when(
    (s) => /\bvery\b/iu.test(s.wrong),
    t(
      "*very* cannot lead to a result with *that*. Before *a*, an adjective and a noun, the word that sets up the result is *such*, and *a* stays in its place.",
      "*very* 不能引出 *that* 表示的结果。在 *a* 加形容词加名词前面，引出结果的词是 *such*，*a* 也要保留。",
    ),
  ),
  when(
    (s) => /\bso\b/iu.test(s.wrong) && /\bsuch\b/iu.test(s.right),
    (s) =>
      /\bsuch (a|an)\b/iu.test(s.right)
        ? t(
            "*so* goes before an adjective on its own. When a noun follows the adjective, the word is *such*, and a singular noun keeps its *a*.",
            "*so* 用在单独的形容词前面。形容词后面有名词时要用 *such*，单数名词前还要保留 *a*。",
          )
        : t(
            "*so* goes before an adjective on its own. When a plural noun follows the adjective, the word is *such*.",
            "*so* 用在单独的形容词前面。形容词后面跟复数名词时要用 *such*。",
          ),
  ),
  when(
    (s) => /\bsuch\b/iu.test(s.wrong) && /\bso\b/iu.test(s.right),
    t(
      "*such* needs a noun after the adjective. An adjective on its own, with no noun, takes *so*.",
      "*such* 后面的形容词要接名词。单独的形容词后面没有名词时要用 *so*。",
    ),
  ),
);

/** mayMightAndCouldWriteNot explains a sentence that drops *perhaps* and states as a fact what is only possible. */
export const mayMightAndCouldWriteNot = explain(
  toAfterModal,
  doWithModal,
  when(
    (s) => !/\b(may|might|could)\b/iu.test(s.wrong) && !/\bperhaps\b/iu.test(s.wrong),
    t(
      "Without *perhaps*, this states the thing as a fact. The task is to keep it uncertain with *may*, *might* or *could* before the base verb.",
      "去掉 *perhaps* 后，这句话成了陈述事实。这道题要在动词原形前用 *may*、*might* 或 *could*，保留不确定的意思。",
    ),
  ),
);

/** pastPerfectWriteNot explains the present perfect where an action came before another past moment. */
export const pastPerfectWriteNot = explain(
  regularEd,
  participleNeeded,
  when(
    (s) => /^(has|have|hasn't|haven't)\b/iu.test(low(s.wrong)),
    (s) =>
      t(
        `The story is in the past, and this action happened before that past moment. *${s.wrong.split(" ")[0]}* links to now; an action further back in the past takes *had*.`,
        `故事发生在过去，而这个动作在那个过去时刻之前就发生了。*${s.wrong.split(" ")[0]}* 与现在相关；更早的过去动作要用 *had*。`,
      ),
  ),
);

/** governing finds the verb before the gap of a typed verb form. */
const governing = (s: Seen) => {
  const before = (s.shown.split("___")[0] ?? "").trim().split(/\s+/u);
  return (
    before
      .filter((w) => !/^(to|not|can't|you|i|we|he|she|they|it|the|a)$/iu.test(w))
      .pop()
      ?.replace(/[^\p{L}']/gu, "") ?? ""
  );
};

/** gerundsAndInfinitivesWriteNot explains *-ing* after a verb that takes *to*, and *to* after a verb that takes *-ing*. */
export const gerundsAndInfinitivesWriteNot = explain(
  when(
    (s) => /^to /u.test(low(s.right)) && !/^to /u.test(low(s.wrong)),
    (s) =>
      t(
        `*${governing(s)}* is followed by *to* and the base verb, not by the *-ing* form or the base verb alone.`,
        `*${governing(s)}* 后面接 *to* 加动词原形，不接 *-ing* 形式，也不单独接动词原形。`,
      ),
  ),
  when(
    (s) => /ing$/u.test(low(s.right)) && !/ing$/u.test(low(s.wrong)),
    (s) =>
      t(
        `*${governing(s)}* is followed by the *-ing* form of the next verb, not by *to* or the base verb.`,
        `*${governing(s)}* 后面接下一个动词的 *-ing* 形式，不接 *to*，也不接动词原形。`,
      ),
  ),
);

/** phrasalVerbsPronounNot explains a pronoun put after the particle of a phrasal verb. */
export const phrasalVerbsPronounNot = explain(
  when(
    (s) => /\b(it|them|him|her|me|us)$/iu.test(s.wrong.trim()),
    t(
      "When the object is a pronoun like *it* or *them*, it goes between the verb and its small word (*up*, *down*, *off*…), never after it.",
      "宾语是 *it*、*them* 这类代词时，要放在动词和小品词（*up*、*down*、*off*……）之间，不能放在后面。",
    ),
  ),
);
