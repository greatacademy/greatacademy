// Feedback for listed wrong responses of typed problems, put together from cases. Each case recognizes one kind of
// mistake and says, in words written for that kind, which rule the response breaks. A knowledge point lists the cases
// its bank needs; a response that no case explains is an error, so every listed wrong response has feedback written for
// its kind.

import { type Text, t } from "@ga/content";
import { type Marks, marksOf, reordered, type Span, spanOf, type WhyNot } from "@ga/subject-english";

/** Seen is what a case looks at: the response, the right answer, the shown text, and where the two differ. */
export interface Seen {
  readonly wrong: string;
  readonly right: string;
  readonly shown: string;
  readonly position: number;
  readonly span: Span;
  /** marks compares capitals and punctuation when the words are the same. */
  readonly marks: Marks | undefined;
  /** w is the stretch of the response that differs, r the stretch of the right answer it stands for. */
  readonly w: string;
  readonly r: string;
}

/** Case recognizes one kind of mistake and explains it, or returns undefined. */
export type Case = (s: Seen) => Text | undefined;

/** unmarked is a stretch of words without the marks after its last word. */
const unmarked = (x: string) => x.replace(/[.,!?;:]+$/u, "");

/** explain builds a WhyNot from cases tried in order; a response none of them explains is an error. */
export function explain(...cases: readonly Case[]): WhyNot {
  return (wrong, right, shown, position) => {
    const span = spanOf(wrong, right);
    const seen: Seen = {
      wrong,
      right,
      shown,
      position,
      span,
      marks: marksOf(wrong, right),
      w: unmarked(span.wrong),
      r: unmarked(span.right),
    };
    for (const c of cases) {
      const said = c(seen);
      if (said) return said;
    }
    throw new Error(`no feedback for "${wrong}" (right: "${right}", shown: "${shown}")`);
  };
}

/** when is a case of a test and its feedback. */
export const when =
  (test: (s: Seen) => boolean, say: Text | ((s: Seen) => Text)): Case =>
  (s) =>
    test(s) ? (typeof say === "function" ? say(s) : say) : undefined;

/** at is a case for the listed wrong response at a position of its bank, for banks that list their kinds in order. */
export const at = (position: number, say: Text | ((s: Seen) => Text)): Case => when((s) => s.position === position, say);

/** lower is a word in small letters, for comparing. */
const lower = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}' ]/gu, "");

/** spanIs tests that the differing stretch of the response is one of some words and of the right answer one of others. */
export const spanIs = (s: Seen, wrong: readonly string[] | RegExp, right?: readonly string[] | RegExp) => {
  const test = (x: string, p: readonly string[] | RegExp) => (Array.isArray(p) ? p.includes(lower(x)) : (p as RegExp).test(lower(x)));
  return test(s.w, wrong) && (right === undefined || test(s.r, right));
};

/** unchanged is a case for a response that leaves the shown text as it was. */
export const unchanged = (say: Text | ((s: Seen) => Text)): Case =>
  when(
    (s) => s.shown !== "" && lower(s.wrong) === lower(s.shown.replace(/\s*\([^)]*\)\s*$/u, "")) && lower(s.wrong) !== lower(s.right),
    say,
  );

const beForms = ["am", "is", "are", "was", "were", "isn't", "aren't", "wasn't", "weren't"];

/** beAgreement explains a form of *be* that does not agree with its subject. */
export const beAgreement: Case = when(
  (s) =>
    spanIs(s, beForms, beForms) &&
    lower(s.w).replace("n't", "") !== lower(s.r).replace("n't", "") &&
    !/^(was|were|wasn't|weren't)$/.test(lower(s.w)) === !/^(was|were|wasn't|weren't)$/.test(lower(s.r)),
  (s) =>
    t(
      `*${s.w}* does not agree with the subject. *am* goes only with *I*; *is* and *was* go with one person or thing (*he*, *she*, *it*, *Tom*); *are* and *were* go with *you*, *we*, *they* and more than one.`,
      `*${s.w}* 和主语不一致。*am* 只跟 *I*；*is*、*was* 跟单个的人或事物（*he*、*she*、*it*、*Tom*）；*are*、*were* 跟 *you*、*we*、*they* 以及复数。`,
    ),
);

const doForms = ["do", "does", "don't", "doesn't"];

/** doAgreement explains *do* or *does* that does not agree with its subject. */
export const doAgreement: Case = when(
  (s) => spanIs(s, doForms, doForms) && lower(s.w) !== lower(s.r),
  (s) =>
    t(
      `*${s.w}* does not agree with the subject. *does* and *doesn't* go with one person or thing (*he*, *she*, *it*, *Lily*); *do* and *don't* go with *I*, *you*, *we*, *they* and more than one.`,
      `*${s.w}* 和主语不一致。*does*、*doesn't* 跟单个的人或事物（*he*、*she*、*it*、*Lily*）；*do*、*don't* 跟 *I*、*you*、*we*、*they* 以及复数。`,
    ),
);

/** haveAgreement explains *have* or *has* that does not agree with its subject. */
export const haveAgreement: Case = when(
  (s) => spanIs(s, ["have", "has", "haven't", "hasn't"], ["have", "has", "haven't", "hasn't"]) && lower(s.w) !== lower(s.r),
  (s) =>
    t(
      `*${s.w}* does not agree with the subject. *has* goes with one person or thing (*he*, *she*, *it*, *my brother*); *have* goes with *I*, *you*, *we*, *they* and more than one.`,
      `*${s.w}* 和主语不一致。*has* 跟单个的人或事物（*he*、*she*、*it*、*my brother*）；*have* 跟 *I*、*you*、*we*、*they* 以及复数。`,
    ),
);

/** helpers are the words after which a verb takes its base form. */
const helpers = [
  "do",
  "does",
  "did",
  "don't",
  "doesn't",
  "didn't",
  "can",
  "can't",
  "cannot",
  "could",
  "couldn't",
  "will",
  "won't",
  "would",
  "wouldn't",
  "shall",
  "should",
  "shouldn't",
  "must",
  "mustn't",
  "may",
  "might",
  "to",
  "let's",
];

/** endingOf tells whether a word is another word with an ending added: -s, -es, -ies, -ed, -ing. */
const ended = (w: string, base: string) => {
  const [a, b] = [lower(w), lower(base)];
  if (a === b) return false;
  const stem = b.replace(/e$/u, "");
  return [`${b}s`, `${b}es`, `${b.replace(/y$/u, "i")}es`, `${b}ed`, `${b}d`, `${stem}ing`, `${b}ing`].includes(a) || a.startsWith(b);
};

/** baseAfterHelper explains a verb with an ending, or in another form, where a helper or *to* calls for the base form. */
export const baseAfterHelper: Case = when(
  (s) => helpers.includes(lower(s.span.before)) && s.w.split(" ").length === 1 && s.r.split(" ").length === 1 && s.w !== "" && s.r !== "",
  (s) =>
    t(
      `After *${s.span.before}*, the verb takes its base form, the one a dictionary lists, with no *-s*, *-ed* or other change. *${s.w}* is not that form.`,
      `在 *${s.span.before}* 后面，动词要用原形，也就是词典里列出的形式，不加 *-s*、*-ed*，也不变形。*${s.w}* 不是原形。`,
    ),
);

/** modals are the helpers that take a bare verb, never *to*. */
const modals = [
  "can",
  "can't",
  "could",
  "couldn't",
  "will",
  "won't",
  "would",
  "should",
  "shouldn't",
  "must",
  "mustn't",
  "may",
  "might",
  "let's",
];

/** toAfterModal explains *to* put between a modal verb and its verb. */
export const toAfterModal: Case = when(
  (s) => lower(s.w) === "to" && s.r === "" && modals.includes(lower(s.span.before)),
  (s) =>
    t(
      `*${s.span.before}* is followed straight by the base verb. Unlike *want to* or *have to*, it never takes *to*.`,
      `*${s.span.before}* 后面直接跟动词原形。它和 *want to*、*have to* 不同，后面不加 *to*。`,
    ),
);

/** thirdPersonMissing explains a present-simple verb without the *-s* its one-person subject needs. */
export const thirdPersonMissing: Case = when(
  (s) =>
    s.w.split(" ").length === 1 &&
    s.r.split(" ").length === 1 &&
    s.w !== "" &&
    ended(s.r, s.w) &&
    /s$/u.test(lower(s.r)) &&
    !helpers.includes(lower(s.span.before)),
  (s) =>
    t(
      `The subject is one person or thing, like *he*, *she* or *it*, so the present-simple verb takes *-s*. *${s.w}* is missing it.`,
      `主语是单个的人或事物，相当于 *he*、*she*、*it*，所以一般现在时的动词要加 *-s*。*${s.w}* 漏了它。`,
    ),
);

/** thirdPersonExtra explains a present-simple verb with an *-s* its subject does not take. */
export const thirdPersonExtra: Case = when(
  (s) =>
    s.w.split(" ").length === 1 &&
    s.r.split(" ").length === 1 &&
    ended(s.w, s.r) &&
    /s$/u.test(lower(s.w)) &&
    !helpers.includes(lower(s.span.before)),
  (s) =>
    t(
      `The subject is *I*, *you*, *we*, *they* or more than one, so the verb takes no *-s*. *${s.w}* has one.`,
      `主语是 *I*、*you*、*we*、*they* 或复数，动词不加 *-s*。*${s.w}* 却加了。`,
    ),
);

/** regularEd explains an irregular verb given the regular ending *-ed*. */
export const regularEd: Case = when(
  (s) =>
    /ed$/u.test(lower(s.w).split(" ").pop() ?? "") &&
    !/ed$/u.test(lower(s.r).split(" ").pop() ?? "") &&
    s.w.split(" ").length === s.r.split(" ").length,
  (s) =>
    t(
      `*${s.w.split(" ").pop()}* adds the regular ending *-ed*, but this verb is irregular: its past forms do not end in *-ed* and have to be learned one by one.`,
      `*${s.w.split(" ").pop()}* 加了规则词尾 *-ed*，但这是不规则动词：它的过去式和过去分词不以 *-ed* 结尾，要逐个记住。`,
    ),
);

/** statementQuestion explains a statement with a question mark, its words in the order of a statement. */
export const statementQuestion: Case = when(
  (s) => s.wrong.trim().endsWith("?") && (reordered(s.wrong, s.right) || lower(s.wrong) === lower(s.shown)),
  t(
    "A question mark at the end does not turn a statement into a written question. The helper verb (*is*, *are*, *can*, *do*, *does*, *did*…) moves in front of the subject.",
    "在陈述句末尾加个问号，并不能把它变成书面的疑问句。助动词（*is*、*are*、*can*、*do*、*does*、*did*……）要移到主语前面。",
  ),
);

/** endMarkMissing explains a sentence whose words are right but whose end mark is missing or wrong. */
export const endMarkMissing: Case = when(
  (s) =>
    !!s.marks &&
    s.marks.lowered.length === 0 &&
    s.marks.missing.some(([, m]) => /[.?!]/u.test(m)) &&
    s.marks.extra.every(([, m]) => /[.?!]/u.test(m)),
  (s) => {
    const mark = s.marks?.missing.find(([, m]) => /[.?!]/u.test(m))?.[1] ?? ".";
    return mark.includes("?")
      ? t("The words are right, but a question ends with a question mark.", "用词没错，但疑问句要以问号结尾。")
      : t("The words are right, but the sentence needs a full stop at the end.", "用词没错，但句末要加句号。");
  },
);

/** spelling explains a misspelled word by the spelling rule it breaks: doubling, *y* to *i*, a silent *e*. */
export const spelling: Case = (s) => {
  const [w, r] = [lower(s.w), lower(s.r)];
  if (!w || !r || w.includes(" ") || r.includes(" ")) return undefined;
  if (dropsOne(r, w)) {
    return t(
      `*${s.w}* keeps one consonant where the word doubles it. When a word ends in one short, stressed vowel and one consonant, the consonant doubles before an ending that starts with a vowel (*stop* → *stopped*, *run* → *running*).`,
      `*${s.w}* 少写了一个辅音字母。词尾是“一个重读短元音 + 一个辅音字母”时，加以元音开头的词尾前要双写这个辅音（*stop* → *stopped*，*run* → *running*）。`,
    );
  }
  if (dropsOne(w, r)) {
    return t(
      `*${s.w}* doubles a consonant that stays single. Only a short, stressed vowel before one final consonant doubles it (*stop* → *stopped*); a long vowel, two vowels, two consonants, or an unstressed ending keep one (*cook* → *cooking*, *watch* → *watching*, *visit* → *visited*).`,
      `*${s.w}* 把不该双写的辅音双写了。只有“重读短元音 + 一个辅音字母”结尾才双写（*stop* → *stopped*）；长元音、两个元音字母、两个辅音字母或非重读结尾都不双写（*cook* → *cooking*，*watch* → *watching*，*visit* → *visited*）。`,
    );
  }
  if (/ing$/u.test(r) && r.includes("ying") && (w === r.replace("ying", "iing") || w === r.replace("ying", "ing"))) {
    return t(
      `*${s.w}* does not keep the *y*. Before *-ing*, a final *y* always stays as it is (*study* → *studying*, *fly* → *flying*).`,
      `*${s.w}* 没有保留 *y*。加 *-ing* 时，词尾的 *y* 一律保留（*study* → *studying*，*fly* → *flying*）。`,
    );
  }
  if (/y/u.test(w) && w.replace(/y(?=[a-z]+$)/u, "i") === r) {
    return t(
      `*${s.w}* keeps the *y*. After a consonant, *y* changes to *i* before most endings (*study* → *studied*, *happy* → *happier*, *city* → *cities*), but stays before *-ing*.`,
      `*${s.w}* 保留了 *y*。辅音字母后的 *y* 在大多数词尾前要变成 *i*（*study* → *studied*，*happy* → *happier*，*city* → *cities*），只有加 *-ing* 时保留。`,
    );
  }
  if (r.replace(/ie/u, "y") === w.replace(/ie/u, "y") && w.includes("i") && !r.includes("ies") && /ies$|ied$/u.test(w)) {
    return t(
      `*${s.w}* changes *y* to *i*, but after a vowel the *y* stays (*play* → *plays*, *played*).`,
      `*${s.w}* 把 *y* 变成了 *i*，但元音字母后的 *y* 不变（*play* → *plays*、*played*）。`,
    );
  }
  if (w.replace(/e(?=(ing|ed|able|ible|er|est)$)/u, "") === r && w !== r) {
    return t(
      `*${s.w}* keeps the silent *e*. A word ending in a silent *e* drops it before an ending that starts with a vowel (*make* → *making*, *love* → *lovable*).`,
      `*${s.w}* 保留了不发音的 *e*。以不发音 *e* 结尾的词，加以元音开头的词尾时要去掉 *e*（*make* → *making*，*love* → *lovable*）。`,
    );
  }
  return undefined;
};

/** dropsOne tells whether removing one letter of a doubled pair in a word gives another. */
function dropsOne(long: string, short: string) {
  for (let i = 0; i + 1 < long.length; i++) {
    if (long[i] === long[i + 1] && /[bcdfghjklmnpqrstvwxz]/u.test(long[i] ?? "") && long.slice(0, i) + long.slice(i + 1) === short)
      return true;
  }
  return false;
}

/** word is a case for a typed word whose response is one particular wrong word. */
export const word = (wrong: string, say: Text | ((s: Seen) => Text)): Case => when((s) => lower(s.wrong) === lower(wrong), say);

/** extraWord is a case for a response with words that do not belong, named by the case. */
export const extraWord = (words: readonly string[], say: (s: Seen) => Text): Case =>
  when((s) => s.r === "" && words.includes(lower(s.w)), say);

/** missingWord is a case for a response that leaves out words, named by the case. */
export const missingWord = (words: readonly string[], say: (s: Seen) => Text): Case =>
  when((s) => s.w === "" && words.includes(lower(s.r)), say);

/** joinNotes puts several feedback sentences together. */
export const joinNotes = (parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(" "), parts.map((p) => p["zh-CN"]).join(""));

/** capitalsAndEnd explains a sentence with the right words whose capitals or end mark are wrong. */
export const capitalsAndEnd: Case = (s) => {
  const m = s.marks;
  if (!m || m.raised.length > 0 || m.missing.some(([, k]) => !/[.?!]/u.test(k)) || m.extra.some(([, k]) => !/[.?!]/u.test(k)))
    return undefined;
  const first = (s.wrong.trim().split(/\s+/u)[0] ?? "").replace(/[^\p{L}']+$/u, "");
  const parts: Text[] = [];
  if (m.lowered[0] === first && first !== "i")
    parts.push(t(`*${first}* starts the sentence, so it takes a capital letter.`, `*${first}* 是句子的第一个词，要大写首字母。`));
  if (m.lowered.includes("i")) parts.push(t("The word *I* is always a capital letter.", "单词 *I* 永远大写。"));
  const names = m.lowered.filter((w, i) => !(i === 0 && w === first) && w !== "i");
  if (names.length > 0) {
    const list = names.map((n) => `*${n}*`);
    parts.push(
      t(
        `${list.join(", ")} ${names.length === 1 ? "is a name" : "are names"} of a particular person, place, language, day or month, so ${names.length === 1 ? "it starts" : "each starts"} with a capital letter.`,
        `${list.join("、")} 是特定的人、地方、语言、星期或月份的名称，要大写首字母。`,
      ),
    );
  }
  const end = m.missing.find(([, k]) => /[.?!]/u.test(k))?.[1];
  const had = m.extra.find(([, k]) => /[.?!]/u.test(k))?.[1];
  if (end?.includes("?")) {
    parts.push(
      had
        ? t("It asks something, so it ends with a question mark, not a full stop.", "这是在提问，句末要用问号，不用句号。")
        : t("It asks something, so it ends with a question mark.", "这是在提问，句末要加问号。"),
    );
  } else if (end) {
    parts.push(
      had
        ? t("It tells something, so it ends with a full stop.", "这是在陈述，句末要用句号。")
        : t("The sentence needs a full stop at the end.", "句末要加句号。"),
    );
  }
  return parts.length > 0 ? joinNotes(parts) : undefined;
};

/** beBeforeVerb explains *am*, *is* or *are* put before a verb in the present, which already is the verb. */
export const beBeforeVerb: Case = when(
  (s) => spanIs(s, ["am", "is", "are"]) && s.r === "" && s.span.after !== "",
  (s) => {
    const next = s.span.after.split(" ")[0]?.replace(/[^\p{L}']/gu, "") ?? "";
    return t(
      `*${s.w}* and *${next}* are both verbs. *${next}* is already the verb of this sentence, so *${s.w}* does not belong.`,
      `*${s.w}* 和 *${next}* 都是动词。*${next}* 已经是这句话的动词，所以不需要 *${s.w}*。`,
    );
  },
);

/** verbs are the verbs short sentences of the first levels use, to tell whether a response has one. */
const verbs =
  /\b(am|is|are|was|were|be|have|has|had|do|does|did|can|can't|will|like|likes|want|wants|go|goes|live|lives|play|plays|get|gets|need|needs|see|sees|eat|eats)\b/iu;

/** noVerb explains a sentence that leaves out its verb. */
export const noVerb: Case = when(
  (s) => !verbs.test(s.wrong) && verbs.test(s.right),
  t(
    "This sentence has no verb. English cannot just put a subject and what is said about it side by side; a verb such as *be* or *have* has to join them.",
    "这个句子没有动词。英语不能把主语和对它的说明直接并列，要用 *be*、*have* 这样的动词把它们连起来。",
  ),
);

/** noSubject explains a statement that starts with its verb and leaves out who does it. */
export const noSubject: Case = when(
  (s) => s.w === "" && s.span.before === "" && /^(i|you|he|she|it|we|they)$/u.test(lower(s.r)),
  t(
    "This statement has no subject. Even when it is clear who is meant, an English statement names who does the action before the verb.",
    "这个陈述句没有主语。即使知道说的是谁，英语陈述句也要在动词前说出做事的人。",
  ),
);

/** raisedCapitals explains capital letters put on ordinary words in the middle of a sentence. */
export const raisedCapitals: Case = when(
  (s) => !!s.marks && s.marks.raised.length > 0 && s.marks.lowered.length === 0,
  (s) => {
    const raised = (s.marks?.raised ?? []).slice(0, 3).map((w) => `*${w}*`);
    return t(
      `${raised.join(", ")} ${raised.length === 1 ? "is an ordinary word, not a name" : "are ordinary words, not names"}, so ${raised.length === 1 ? "it stays" : "they stay"} small. Only the first word of a sentence, *I* and names take a capital letter.`,
      `${raised.join("、")} 是普通词，不是名称，要小写。只有句首的词、*I* 和名称才大写首字母。`,
    );
  },
);

/** pastTimeOf finds the words of a text that place it in the past, such as *yesterday* or *last week*. */
export const pastTimeOf = (text: string) =>
  /\b(yesterday|last (?:night|week|month|year|summer|winter|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|(?:\w+ )?(?:days?|weeks?|years?|hours?|minutes?) ago|this morning|on (?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|when (?:i|he|she|we|they|you) (?:was|were) \w+)\b/iu.exec(
    text,
  )?.[0];

/** pastNeeded explains a present or base form of a verb in a sentence that a time word places in the past. */
export const pastNeeded: Case = when(
  (s) => s.w !== "" && s.r !== "" && !s.w.includes(" ") && !s.r.includes(" ") && pastTimeOf(`${s.wrong} ${s.shown}`) !== undefined,
  (s) => {
    const time = pastTimeOf(`${s.wrong} ${s.shown}`) ?? "";
    return t(
      `*${time}* places this in the past, so the verb takes its past form. *${s.w}* is a present form.`,
      `*${time}* 说明这是过去的事，所以动词要用过去式。*${s.w}* 是现在时的形式。`,
    );
  },
);

/** baseAfterDo explains a verb that is not in its base form after *do*, *does* or *did* earlier in the sentence. */
export const baseAfterDo: Case = (s) => {
  if (s.w === "" || s.r === "" || s.w.includes(" ") || s.r.includes(" ")) return undefined;
  const at = s.wrong.toLowerCase().indexOf(` ${lower(s.w)}`);
  const helper = /\b(do|does|did|don't|doesn't|didn't)\b/iu.exec(s.wrong.slice(0, Math.max(at, 0)))?.[1];
  if (!helper) return undefined;
  return /^did/iu.test(helper)
    ? t(
        `*${helper}* already shows that this happened in the past, so the verb after it goes back to its base form. *${s.w}* is a past form.`,
        `*${helper}* 已经表示过去，所以它后面的动词要还原成原形。*${s.w}* 是过去式。`,
      )
    : t(
        `*${helper}* already shows the person and the time, so the verb after it goes back to its base form. *${s.w}* is not that form.`,
        `*${helper}* 已经表示了人称和时间，所以它后面的动词要还原成原形。*${s.w}* 不是原形。`,
      );
};

/** doWithModal explains *do*, *does* or *did* put before *can*, *should*, *must* or *will* to make a negative. */
export const doWithModal: Case = when(
  (s) => /\b(don't|doesn't|didn't|do not|does not) (can|could|should|must|will|would|may|might)\b/iu.test(s.wrong),
  (s) => {
    const modal = /\b(?:don't|doesn't|didn't|do not|does not) (\w+)/iu.exec(s.wrong)?.[1] ?? "";
    return t(
      `*${modal}* makes its own negative: *not* joins *${modal}* itself. It never takes *do*, *does* or *did*.`,
      `*${modal}* 自己构成否定：*not* 直接加在 *${modal}* 上。它前面从不加 *do*、*does* 或 *did*。`,
    );
  },
);

/** notAlone explains *not* put straight before a verb that is not *be* or a modal. */
export const notAlone: Case = when(
  (s) =>
    /\bnot\b/iu.test(s.wrong) &&
    !/\b(do|does|did|is|are|am|was|were|can|could|should|must|will|would|have|has) not\b/iu.test(s.wrong) &&
    /\b(don't|doesn't|didn't)\b/iu.test(s.right),
  (s) =>
    /\bdidn't\b/iu.test(s.right)
      ? t(
          "*not* cannot stand alone before the verb. English makes a past-simple verb negative with *did* and *not*, usually as one short word, followed by the base verb.",
          "*not* 不能直接放在动词前面。英语一般过去时的否定用 *did* 加 *not*（通常缩写成一个词），后面接动词原形。",
        )
      : t(
          "*not* cannot stand alone before a present-simple verb. English makes such a verb negative with *do* or *does* and *not*, usually as one short word.",
          "*not* 不能直接放在一般现在时的动词前面。英语用 *do* 或 *does* 加 *not*（通常缩写成一个词）来构成否定。",
        ),
);

/** participleNeeded explains a verb after *have* or *has* that is not the past participle. */
export const participleNeeded: Case = (s) => {
  if (s.w === "" || s.r === "" || s.w.includes(" ") || s.r.includes(" ")) return undefined;
  const at = s.wrong.toLowerCase().indexOf(` ${lower(s.w)}`);
  const helper = /\b(have|has|haven't|hasn't|had|hadn't)\b/iu.exec(s.wrong.slice(0, Math.max(at, 0)))?.[1];
  if (!helper || /^(have|has|had|already|yet|just|ever|never|not)$/u.test(lower(s.w))) return undefined;
  return t(
    `After *${helper}*, the verb takes its past participle, the third form (*go – went – gone*). *${s.w}* is not that form.`,
    `在 *${helper}* 后面，动词要用过去分词，即第三种形式（*go – went – gone*）。*${s.w}* 不是这个形式。`,
  );
};
