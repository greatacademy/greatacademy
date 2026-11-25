// Feedback for the listed wrong responses of the typed problems of B2, one kind of mistake at a time.

import { t } from "@ga/content";
import { reordered } from "@ga/subject-english";
import { explain, participleNeeded, regularEd, type Seen, toAfterModal, when } from "../../why-not.ts";

/** has finds a pattern in a text, ignoring case. */
const has = (text: string, pattern: string) => new RegExp(`\\b${pattern}\\b`, "iu").test(text);

/** futureContinuousAndFuturePerfectWriteNot explains *will have done* for an action in progress, and *will be doing* for one finished before a time. */
export const futureContinuousAndFuturePerfectWriteNot = explain(
  when(
    (s) => has(s.right, "will be \\w+ing") && !has(s.wrong, "will be \\w+ing"),
    t(
      "At that moment the action will be going on, not finished. An action in progress at a future time takes *will be* and the *-ing* form.",
      "在那个时刻动作正在进行，而不是已经完成。将来某一时刻正在进行的动作用 *will be* 加 *-ing* 形式。",
    ),
  ),
  when(
    (s) => has(s.right, "will have") && !has(s.wrong, "will have"),
    t(
      "*By* a time means the action will be complete before then. A finished action takes *will have* and the past participle.",
      "*By* 加时间表示动作在那之前就会完成。已完成的动作用 *will have* 加过去分词。",
    ),
  ),
);

/** cleftSentencesWriteNot explains *what* after *It is*, and *That* at the head of a cleft with *What*. */
export const cleftSentencesWriteNot = explain(
  when(
    (s) => /^it (is|was)\b/iu.test(s.wrong) && has(s.wrong, "what") && !has(s.right, "what"),
    t(
      "After *It is* or *It was* and the part in focus, the rest of the sentence starts with *that* (or *who* for people), never *what*.",
      "在 *It is* 或 *It was* 加强调部分之后，句子其余部分用 *that*（指人也可用 *who*）引出，不能用 *what*。",
    ),
  ),
  when(
    (s) => {
      const words = (x: string) => x.replace(/[.,!?]/gu, "").split(" ");
      return words(s.wrong).some((w) => /^(it|he|she|they|him|her|them)$/iu.test(w) && !words(s.right).includes(w));
    },
    t(
      "The cleft already has its subject or object: *what* or *that* stands for it. Adding *it*, *he* or *she* says it twice.",
      "分裂句里已经有了主语或宾语：*what* 或 *that* 代替了它。再加 *it*、*he*、*she* 就重复了。",
    ),
  ),
  when(
    (s) => /^that\b/iu.test(s.wrong) && /^what\b/iu.test(s.right),
    t(
      "This cleft begins with *What*: it means *the thing that*, and it carries the sentence up to *is* or *was*. *That* cannot do that job on its own.",
      "这种分裂句以 *What* 开头：它表示“……的东西”，引领句子直到 *is* 或 *was*。*That* 单独不能起这个作用。",
    ),
  ),
);

/** passiveWithModalsAndPerfectFormsRewriteNot explains a passive without *be* or *been*. */
export const passiveWithModalsAndPerfectFormsRewriteNot = explain(
  when(
    (s) => has(s.right, "(have|has) been") && !has(s.wrong, "been"),
    t(
      "The subject does not do the action; it receives it, so the sentence is passive. The present perfect passive is *have* or *has*, then *been*, then the past participle.",
      "主语不是动作的执行者，而是承受者，所以句子是被动的。现在完成时的被动语态是 *have* 或 *has* 加 *been* 再加过去分词。",
    ),
  ),
  when(
    (s) => has(s.right, "be") && !has(s.wrong, "be"),
    t(
      "The subject does not do the action; it receives it, so the sentence is passive. After a modal like *must* or *can*, the passive is *be* and the past participle.",
      "主语不是动作的执行者，而是承受者，所以句子是被动的。在 *must*、*can* 这类情态动词后，被动语态是 *be* 加过去分词。",
    ),
  ),
  regularEd,
  when(
    (s) => has(s.wrong, "(be|been)") && s.wrong.split(" ").length === s.right.split(" ").length,
    (s) =>
      t(
        `In the passive, the verb after *be* or *been* is the past participle. *${s.w}* is not that form.`,
        `被动语态中，*be* 或 *been* 后面的动词用过去分词。*${s.w}* 不是这个形式。`,
      ),
  ),
);

/** causativeHaveAndGetWriteNot explains the participle put before the thing that someone else works on. */
export const causativeHaveAndGetWriteNot = explain(
  when(
    (s) => /\bto \w+/iu.test(s.wrong) && !/\bto \w+/iu.test(s.right),
    t(
      "After *have* or *get* and the thing, the verb is the past participle, with no *to*: the thing receives the action, someone else does it.",
      "在 *have* 或 *get* 加物之后，动词用过去分词，不加 *to*：物是承受动作的，动作由别人完成。",
    ),
  ),
  when(
    (s) => reordered(s.wrong, s.right) || s.wrong.split(" ").length === s.right.split(" ").length,
    t(
      "When someone else does the job for you, the order is *have* or *get*, then the thing, then the past participle. With the participle right after *have*, it reads as a perfect tense: you did it yourself.",
      "别人替你做某事时，语序是 *have* 或 *get*，然后是物，最后是过去分词。过去分词紧跟在 *have* 后面，就成了完成时，意思变成你自己做的。",
    ),
  ),
);

/** pastResult finds a word of the result that places it in the past, such as *yesterday*. */
const pastResult = (text: string) => /\b(yesterday|last \w+|\w+ ago|on \w+day)\b/iu.exec(text.split(",").slice(1).join(","))?.[0];

/** mixedConditionalsWriteNot explains the result of a mixed conditional in the wrong time. */
export const mixedConditionalsWriteNot = explain(
  when(
    (s) => has(s.right, "would have") && !has(s.wrong, "would have"),
    (s) =>
      t(
        `The result is in the past (*${pastResult(s.right) ?? "then"}*), so it takes *would have* and the past participle, even though the *if* half is about now.`,
        `结果发生在过去（*${pastResult(s.right) ?? "then"}*），所以要用 *would have* 加过去分词，尽管 *if* 那一半说的是现在。`,
      ),
  ),
  when(
    (s) => has(s.wrong, "would have") && has(s.right, "now"),
    t(
      "The result is about now (*now*), so it takes *would* and the base verb, even though the *if* half is about the past.",
      "结果说的是现在（*now*），所以要用 *would* 加动词原形，尽管 *if* 那一半说的是过去。",
    ),
  ),
);

/** linkingWordsOfContrastWriteNot explains a clause after *despite*, *however* joined with a comma, and *although* with *but*. */
export const linkingWordsOfContrastWriteNot = explain(
  when(
    (s) => /^although\b/iu.test(s.wrong) && has(s.wrong, "but"),
    t(
      "*Although* already joins the two ideas, so the second half needs no *but*. Use one linking word or the other, never both.",
      "*Although* 已经把两部分连接起来，后半句不需要 *but*。两个连接词只用一个，不能同时用。",
    ),
  ),
  when(
    (s) => /, however\b/iu.test(s.wrong),
    t(
      "*However* is not a joining word like *but*. It starts a new sentence, or follows a semicolon, and it takes a comma after it.",
      "*However* 不是 *but* 那样的连接词。它要放在新句子的开头或分号之后，后面加逗号。",
    ),
  ),
  when(
    (s) => /^however\b/iu.test(s.wrong),
    t(
      "*However* does not join a clause to the next one like *although*. It opens the second idea: first sentence, then a semicolon or full stop, then *however* and a comma.",
      "*However* 不能像 *although* 那样把一个从句连到下一句。它要放在第二个意思的开头：先写第一句，再用分号或句号，然后是 *however* 加逗号。",
    ),
  ),
  when(
    (s) => /^despite\b/iu.test(s.wrong),
    t(
      "*Despite* is followed by a noun or an *-ing* form, not by a subject and a verb. For a whole clause, use *although*.",
      "*Despite* 后面接名词或 *-ing* 形式，不接主语加动词。要接完整的从句，就用 *although*。",
    ),
  ),
);

/** pattern describes what follows a reporting verb in a sentence. */
const pattern = (right: string, verb: string) => {
  const stem = verb.replace(/(e|y)$/u, "");
  const tail = new RegExp(`\\b${stem}\\w*\\s+(.*)$`, "iu").exec(right)?.[1] ?? "";
  if (/^(not )?to \w+/iu.test(tail)) return t("*to* and the base verb", "*to* 加动词原形");
  const prep = /^(on|for|of|about|against|from) \w+ing\b/iu.exec(tail)?.[1];
  if (prep) return t(`*${prep}* and the *-ing* form`, `*${prep}* 加 *-ing* 形式`);
  if (/^\w+ing\b/iu.test(tail)) return t("the *-ing* form", "*-ing* 形式");
  if (/^that\b/iu.test(tail)) return t("*that* and a clause", "*that* 加从句");
  const after = /^[\w' ]+? (on|for|of|about|against|from) \w+ing\b/iu.exec(tail)?.[1];
  if (after) return t(`the person, then *${after}* and the *-ing* form`, `人，再接 *${after}* 加 *-ing* 形式`);
  if (/^[\w' ]+? (not )?to \w+/iu.test(tail))
    return t("the person, then *to* (or *not to*) and the base verb", "人，再接 *to*（或 *not to*）加动词原形");
  return undefined;
};

/** reportingVerbsWriteNot explains a reporting verb followed by the wrong pattern. */
export const reportingVerbsWriteNot = explain((s: Seen) => {
  const verb = /\((\w+)\)\s*$/u.exec(s.shown)?.[1];
  const after = verb ? pattern(s.right, verb) : undefined;
  if (!verb || !after) return undefined;
  return t(`*${verb}* is followed by ${after.en}.`, `*${verb}* 后面接${after["zh-CN"]}。`);
});

/** inversionAfterNegativeAdverbsWriteNot explains a negative opening that keeps the subject before the helper verb. */
export const inversionAfterNegativeAdverbsWriteNot = explain(
  when(
    (s) => s.wrong !== s.right,
    t(
      "When a negative word like *never*, *rarely* or *not once* opens the sentence, the order turns round as in a question: the helper verb (*do*, *does*, *did*, *had*, *has*) comes before the subject.",
      "当 *never*、*rarely*、*not once* 这类否定词放在句首时，语序要像疑问句一样倒装：助动词（*do*、*does*、*did*、*had*、*has*）放在主语前面。",
    ),
  ),
);

/** modalsOfDeductionWriteNot explains *to* after a modal and *mustn't* for something that cannot be true. */
export const modalsOfDeductionWriteNot = explain(
  toAfterModal,
  when(
    (s) => /\b(must|might|may|could|can't) (is|are|am)\b/iu.test(s.wrong),
    t(
      "A modal verb is followed by the base form, so *is* or *are* goes back to *be*.",
      "情态动词后面接动词原形，所以 *is* 或 *are* 要还原成 *be*。",
    ),
  ),
  when(
    (s) => has(s.wrong, "mustn't") && has(s.right, "can't"),
    t(
      "*mustn't* means something is not allowed. When you are sure something is not true, the opposite of *must* is *can't*.",
      "*mustn't* 表示不允许。当你确信某事不是真的时，*must* 的反面是 *can't*。",
    ),
  ),
);

/** pastModalsWriteNot explains *had* after a modal verb. */
export const pastModalsWriteNot = explain(
  participleNeeded,
  when(
    (s) => has(s.right, "have") && !has(s.wrong, "(have|had)"),
    t(
      "A modal verb has no past form of its own. To look back at the past, it takes *have* and the past participle.",
      "情态动词本身没有过去式。要说过去的事，就在它后面加 *have* 和过去分词。",
    ),
  ),
  when(
    (s) => /\b(must|can't|could|couldn't|might|may|should|shouldn't|would) had\b/iu.test(s.wrong),
    t(
      "A modal verb is always followed by the base form, so it takes *have*, never *had*: a modal, then *have*, then the past participle.",
      "情态动词后面总是接动词原形，所以要用 *have*，不能用 *had*：情态动词加 *have* 再加过去分词。",
    ),
  ),
);

/** thirdConditionalWriteNot explains an imagined past without *had* after *if*, or without *would have* in the result. */
export const thirdConditionalWriteNot = explain(
  when(
    (s) => has(s.wrong, "would had"),
    t(
      "*would* is followed by the base form, so it takes *have*, never *had*: *would have* and the past participle.",
      "*would* 后面接动词原形，所以要用 *have*，不能用 *had*：*would have* 加过去分词。",
    ),
  ),
  when(
    (s) => /\bif [^,]*\bwould\b/iu.test(s.wrong) && !/\bif [^,]*\bwould\b/iu.test(s.right),
    t(
      "*would* belongs only in the result. The *if* half of an imagined past takes *had* and the past participle.",
      "*would* 只用在结果部分。设想过去时，*if* 那一半用 *had* 加过去分词。",
    ),
  ),
  when(
    (s) => has(s.right, "had") && !has(s.wrong, "had") && has(s.right, "would have") && !has(s.wrong, "would have"),
    t(
      "This imagines a different past, so both halves move back: *if* with *had* and the past participle, and the result with *would have* and the past participle.",
      "这是在设想一个不同的过去，所以两半都要往前推：*if* 部分用 *had* 加过去分词，结果部分用 *would have* 加过去分词。",
    ),
  ),
  when(
    (s) => has(s.right, "had") && !has(s.wrong, "had"),
    t(
      "This imagines a different past, so the *if* half takes *had* and the past participle.",
      "这是在设想一个不同的过去，所以 *if* 部分要用 *had* 加过去分词。",
    ),
  ),
  when(
    (s) => has(s.right, "would have") && !has(s.wrong, "would have"),
    t(
      "This imagines a different past, so the result takes *would have* and the past participle.",
      "这是在设想一个不同的过去，所以结果部分要用 *would have* 加过去分词。",
    ),
  ),
);

/** wishAndIfOnlyWriteNot explains a wish in the tense of the fact instead of one step back. */
export const wishAndIfOnlyWriteNot = explain(
  when(
    (s) => /\b(had|hadn't) \w+/iu.test(s.right) && !/\b(had|hadn't) \w+(ed|en|t|n)\b/iu.test(s.wrong),
    t(
      "This is a regret about the past. After *wish* or *if only*, the past moves one step back: *had* (or *hadn't*) and the past participle.",
      "这是对过去的遗憾。在 *wish* 或 *if only* 后面，过去的事要再往前推一步：用 *had*（或 *hadn't*）加过去分词。",
    ),
  ),
  when(
    (s) => has(s.wrong, "could have") && !has(s.right, "could have"),
    t(
      "This wish is about now, so *could* is followed by the base verb. *could have* and the past participle look back at the past.",
      "这个愿望是关于现在的，所以 *could* 后面接动词原形。*could have* 加过去分词是回顾过去的。",
    ),
  ),
  when(
    (s) => has(s.right, "could") && !has(s.wrong, "could"),
    t(
      "A wish about now moves one step back into the past, so *can* becomes *could*.",
      "对现在的愿望要往过去推一步，所以 *can* 变成 *could*。",
    ),
  ),
  when(
    (s) => /\bwere(n't)?\b/iu.test(s.right) && !/\bwere(n't)?\b/iu.test(s.wrong),
    t(
      "A wish about now moves one step back into the past, and *be* becomes *were* for every subject, *I* and *he* included.",
      "对现在的愿望要往过去推一步，*be* 对所有主语都用 *were*，包括 *I* 和 *he*。",
    ),
  ),
  when(
    (s) => s.wrong !== s.right,
    t(
      "A wish about now is not real, so it moves one step back into the past: the present simple becomes the past simple, and *don't* or *doesn't* becomes *didn't*.",
      "对现在的愿望并非现实，所以要往过去推一步：一般现在时变成一般过去时，*don't* 或 *doesn't* 变成 *didn't*。",
    ),
  ),
);
