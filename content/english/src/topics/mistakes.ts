// Feedback for the listed wrong responses of the typed problems of the topics, one kind of mistake at a time.

import { t } from "@ga/content";
import { type Case, explain, regularEd, spelling, when } from "../why-not.ts";

/** low is a stretch of text in small letters without marks, for comparing. */
const low = (x: string) => x.toLowerCase().replace(/[^\p{L}' ]/gu, "");

/** silentEKept explains a silent *e* dropped before an ending that starts with a consonant. */
const silentEKept: Case = when(
  (s) => {
    const [w, r] = [low(s.wrong), low(s.right)];
    return (
      w.length + 1 === r.length &&
      [...r].some((c, i) => c === "e" && r.slice(0, i) + r.slice(i + 1) === w) &&
      /e(ment|ful|less|ness|ly)$/u.test(r)
    );
  },
  (s) =>
    t(
      `*${s.wrong}* drops the silent *e*. Before an ending that starts with a consonant (*-ment*, *-ful*, *-less*, *-ness*, *-ly*), the *e* stays (*hope* → *hopeful*).`,
      `*${s.wrong}* 去掉了不发音的 *e*。加以辅音开头的词尾（*-ment*、*-ful*、*-less*、*-ness*、*-ly*）时，*e* 要保留（*hope* → *hopeful*）。`,
    ),
);

/** endings names the usual spelling of each ending, for a word built with the wrong letters. */
const endings: Case = (s) => {
  const r = low(s.right);
  const w = low(s.wrong);
  if (/ful$/u.test(r) && /full$/u.test(w))
    return t(
      "The ending *-ful* has only one *l*, even though the word *full* has two.",
      "词尾 *-ful* 只有一个 *l*，虽然单词 *full* 有两个。",
    );
  if (/(less|ness)$/u.test(r) && /(les|nes)$/u.test(w))
    return t("The endings *-less* and *-ness* end in a double *s*.", "词尾 *-less* 和 *-ness* 以两个 *s* 结尾。");
  return undefined;
};

/** joined explains a word built from a prefix or suffix and a base that loses or gains a letter. */
const joined: Case = when(
  (s) => / \+ /u.test(s.shown),
  (s) => {
    const [a, b] = s.shown.split(" + ").map((x) => x.trim());
    const w = low(s.wrong);
    const r = low(s.right);
    const lost = w.length < r.length && low(`${a}${b}`) === r;
    return lost
      ? t(
          `*${s.wrong}* loses a letter. Joining *${a}* and *${b}* keeps every letter of both parts unless a spelling rule says otherwise.`,
          `*${s.wrong}* 少了一个字母。把 *${a}* 和 *${b}* 合起来时，除非有拼写规则要求改变，两部分的字母都要保留。`,
        )
      : t(
          `*${s.wrong}* does not spell the ending *${b}* as it is. Write the ending with its own letters, and change the base only where a spelling rule says so.`,
          `*${s.wrong}* 没有按词尾 *${b}* 原本的拼写来写。词尾要照原样写，词根只在拼写规则要求时才改变。`,
        );
  },
);

/** extraComma explains a comma added inside the main part of the sentence. */
const extraComma: Case = when(
  (s) => low(s.wrong) === low(s.right) && (s.wrong.match(/,/gu)?.length ?? 0) > (s.right.match(/,/gu)?.length ?? 0),
  t(
    "Only the opening word is set off with a comma. The rest of the sentence runs on without one.",
    "只有开头的引导词后面加逗号。句子的其余部分不加逗号。",
  ),
);

/** parts splits a prompt like *re + build* into its two parts. */
const parts = (shown: string) => shown.split(" + ").map((x) => low(x.trim()));

/** plainJoin explains a word that is just its two parts side by side, with a letter lost or changed. */
const plainJoin: Case = (s) => {
  const [a, b] = parts(s.shown);
  return a && b && `${a}${b}` === low(s.right) ? joined(s) : undefined;
};

/** yToI explains a base ending in a consonant and *y* that keeps or loses the *y* instead of changing it to *i*. */
const yToI: Case = when(
  (s) => {
    const [a] = parts(s.shown);
    return !!a && /[^aeiou]y$/u.test(a) && low(s.right).startsWith(`${a.slice(0, -1)}i`) && !low(s.wrong).startsWith(`${a.slice(0, -1)}i`);
  },
  (s) =>
    t(
      `*${parts(s.shown)[0]}* ends in a consonant and *y*, so the *y* changes to *i* before the ending; it is neither kept nor dropped.`,
      `*${parts(s.shown)[0]}* 以“辅音字母 + *y*”结尾，所以加词尾前 *y* 要变成 *i*，既不保留也不去掉。`,
    ),
);

/** simpleVerbTensesIrregularPastNot explains a regular *-ed* given to an irregular verb. */
export const simpleVerbTensesIrregularPastNot = explain(
  regularEd,
  when(
    (s) => s.wrong !== s.right,
    (s) =>
      t(
        `*${s.wrong}* is not the past form of this verb. It is irregular, so its past form has to be learned on its own.`,
        `*${s.wrong}* 不是这个动词的过去式。它是不规则动词，过去式要单独记住。`,
      ),
  ),
);

/** commasAfterIntroductionsIntroductoryWordsNot explains an opening word with no comma after it. */
export const commasAfterIntroductionsIntroductoryWordsNot = explain(
  extraComma,
  when(
    (s) => low(s.wrong) === low(s.right) && !s.wrong.split(" ")[0]?.endsWith(","),
    (s) =>
      t(
        `*${s.wrong.split(" ")[0]}* introduces the sentence, so a comma follows it to separate it from the rest.`,
        `*${s.wrong.split(" ")[0]}* 是句子的引导词，后面要加逗号，把它和句子其余部分隔开。`,
      ),
  ),
);

/** commasAfterIntroductionsDirectAddressNot explains the name of the person spoken to without commas around it. */
export const commasAfterIntroductionsDirectAddressNot = explain(
  when(
    (s) => low(s.wrong) === low(s.right),
    t(
      "The name of the person you speak to is set off with commas: one after it at the start, one before it at the end, and one on each side in the middle.",
      "称呼对方的名字要用逗号隔开：在句首时后面加逗号，在句末时前面加逗号，在句中时两边都加。",
    ),
  ),
);

/** punctuatingDialogueSpeakerAfterNot explains the comma of a quotation put outside the closing mark. */
export const punctuatingDialogueSpeakerAfterNot = explain(
  when(
    (s) => /\."/u.test(s.wrong),
    t(
      "The sentence goes on after the quotation (*said Mom*), so the spoken words end with a comma inside the closing mark, not a full stop.",
      "引语之后句子还没结束（*said Mom*），所以原话要以逗号结尾，放在后引号里面，不用句号。",
    ),
  ),
  when(
    (s) => /",/u.test(s.wrong),
    t(
      "When the speaker comes after the words, the comma that ends the spoken words goes inside the closing quotation mark.",
      "说话人放在引语后面时，结束引语的逗号要放在后引号里面。",
    ),
  ),
  when(
    (s) => !s.wrong.includes('"'),
    t(
      "The exact spoken words go inside quotation marks, with a comma before the closing mark, and then the speaker.",
      "说出的原话要放在引号里，后引号前加逗号，然后是说话人。",
    ),
  ),
);

/** punctuatingDialogueSpeakerBeforeNot explains the full stop of a quotation put outside the closing mark. */
export const punctuatingDialogueSpeakerBeforeNot = explain(
  when(
    (s) => /"[a-z]/u.test(s.wrong) && /"[A-Z]/u.test(s.right),
    t(
      "The quotation is a full sentence of its own, so its first word starts with a capital letter, even in the middle of your sentence.",
      "引语本身是一个完整的句子，所以它的第一个词首字母要大写，即使它在整句话的中间。",
    ),
  ),
  when(
    (s) => s.wrong.includes('"') && !/\w,\s*"/u.test(s.wrong),
    t(
      "When the speaker comes first, a comma follows the speaking verb, before the opening quotation mark.",
      "说话人在前面时，说话的动词后面要加逗号，再接前引号。",
    ),
  ),
  when(
    (s) => /"\.$/u.test(s.wrong.trim()),
    t("The full stop that ends the spoken words goes inside the closing quotation mark.", "结束引语的句号要放在后引号里面。"),
  ),
  when(
    (s) => !s.wrong.includes('"'),
    t(
      "After the speaker, put a comma, then the exact spoken words inside quotation marks, starting with a capital letter.",
      "说话人后面加逗号，再把原话放进引号里，原话首字母大写。",
    ),
  ),
);

/** comparativesAndSuperlativesErAndEstNot explains *-er* for one of many, *-est* for two, and the spelling rules of the endings. */
export const comparativesAndSuperlativesErAndEstNot = explain(
  spelling,
  when(
    (s) => /^(more|most) /iu.test(s.wrong.trim()),
    (s) =>
      t(
        `*${s.wrong.trim().split(" ")[0]}* is for long adjectives like *beautiful*. A short adjective of one syllable, or two ending in *-y*, takes the ending *-er* or *-est* instead.`,
        `*${s.wrong.trim().split(" ")[0]}* 用于 *beautiful* 这样的长形容词。单音节形容词和以 *-y* 结尾的双音节形容词要加词尾 *-er* 或 *-est*。`,
      ),
  ),
  when(
    (s) => /er$/u.test(low(s.wrong)) && /est$/u.test(low(s.right)),
    t(
      "This picks out one from a whole group (*of all*), so the adjective takes *-est*. *-er* compares only two.",
      "这里是从一整组里挑出一个（*of all*），所以形容词要加 *-est*。*-er* 只用于两者比较。",
    ),
  ),
  when(
    (s) => /est$/u.test(low(s.wrong)) && /er$/u.test(low(s.right)),
    t(
      "This compares just two, so the adjective takes *-er*. *-est* is for one out of three or more.",
      "这里只比较两个，所以形容词要加 *-er*。*-est* 用于三者或更多中的一个。",
    ),
  ),
);

/** apostrophesAndPossessivesSingularPossessiveNot explains a possessive of one owner written without *'s*. */
export const apostrophesAndPossessivesSingularPossessiveNot = explain(
  when(
    (s) => /s'$/u.test(low(s.wrong)),
    t(
      "An apostrophe after the *s* marks a plural owner. There is only one owner here, so the apostrophe comes before the *s*, and a name ending in *s* still adds *'s*.",
      "撇号放在 *s* 后面表示复数所有者。这里只有一个所有者，所以撇号放在 *s* 前面；以 *s* 结尾的名字也要加 *'s*。",
    ),
  ),
  when(
    (s) => /s$/u.test(low(s.right).replace(/'s$/u, "")) && low(s.wrong).length < low(s.right).length,
    t(
      "The name itself ends in *s*; keep the whole name, then add an apostrophe and *s*.",
      "名字本身以 *s* 结尾；先写出完整的名字，再加撇号和 *s*。",
    ),
  ),
  when(
    (s) => /s$/u.test(low(s.right).replace(/'s$/u, "")) && /es$/u.test(low(s.wrong)),
    t(
      "The owner is one person whose name ends in *s*. It still takes an apostrophe and *s*, with no extra *e*.",
      "所有者是一个名字以 *s* 结尾的人。仍然加撇号和 *s*，不要多加 *e*。",
    ),
  ),
  when(
    (s) => !s.wrong.includes("'"),
    (s) =>
      t(
        `*${s.wrong}* reads as a plural, more than one. To show that something belongs to one owner, add an apostrophe and *s*.`,
        `*${s.wrong}* 看起来是复数，表示不止一个。要表示东西属于一个所有者，就加撇号和 *s*。`,
      ),
  ),
);

/** apostrophesAndPossessivesPluralPossessiveNot explains a plural possessive with the apostrophe in the wrong place. */
export const apostrophesAndPossessivesPluralPossessiveNot = explain(
  when(
    (s) => !s.wrong.includes("'") && /'s$/u.test(low(s.right)),
    (s) =>
      t(
        `*${s.wrong}* has no apostrophe, so it does not show who owns something. This plural does not end in *s*, so it takes an apostrophe and *s*; it never takes an extra *s* to become plural.`,
        `*${s.wrong}* 没有撇号，表示不出所属关系。这个复数不以 *s* 结尾，所以要加撇号和 *s*；它也不能再加 *s* 变复数。`,
      ),
  ),
  when(
    (s) => /'s$/u.test(low(s.right)) && /s'$/u.test(low(s.wrong)),
    t(
      "This plural does not end in *s* (*children*, *men*, *women*, *mice*), so it takes an apostrophe and *s*, like a single owner.",
      "这个复数不以 *s* 结尾（*children*、*men*、*women*、*mice*），所以像单数所有者一样加撇号和 *s*。",
    ),
  ),
  when(
    (s) => /'s$/u.test(low(s.right)) && /s's$|ses'$|s'$/u.test(low(s.wrong)),
    t(
      "This plural does not end in *s*, so it takes an apostrophe and *s* straight after the plural word.",
      "这个复数不以 *s* 结尾，所以直接在复数词后加撇号和 *s*。",
    ),
  ),
  when(
    (s) => /'s$/u.test(low(s.wrong)) && /s'$/u.test(low(s.right)),
    (s) =>
      t(
        `*${s.wrong}* belongs to one owner, but there are several. Write the plural first, then put the apostrophe after its final *s*.`,
        `*${s.wrong}* 表示属于一个所有者，但这里有好几个。先写出复数，再把撇号放在词尾的 *s* 后面。`,
      ),
  ),
  when(
    (s) => /'$/u.test(low(s.right)) && s.wrong !== s.right,
    t("Write the plural first, then put the apostrophe after its final *s*.", "先写出复数，再把撇号放在词尾的 *s* 后面。"),
  ),
);

/** verbTenseConsistencyFixingShiftsNot explains a sentence that changes tense between its verbs. */
export const verbTenseConsistencyFixingShiftsNot = explain(
  when(
    (s) => /^(every|each)\b/iu.test(s.right) && s.wrong !== s.right,
    t(
      "*Every* or *each* shows a habit, so every verb in the sentence stays in the present.",
      "*Every* 或 *each* 表示习惯，所以句中所有动词都用一般现在时。",
    ),
  ),
  when(
    (s) => s.wrong !== s.right,
    t(
      "The sentence starts in the past, so every verb that tells what happened stays in the past. Do not shift to the present halfway.",
      "句子从过去开始，所以叙述发生了什么的每个动词都要用过去时。不要中途换成现在时。",
    ),
  ),
);

/** baseWordsAndAffixesBuildingWordsNot explains a word built from a base and an affix with letters lost or changed. */
export const baseWordsAndAffixesBuildingWordsNot = explain(endings, plainJoin, yToI, spelling, joined);

/** prefixMeaning gives the meaning of each common prefix. */
const prefixMeaning: Record<string, readonly [string, string]> = {
  re: ["again", "再次"],
  pre: ["before", "预先"],
  mis: ["wrongly", "错误地"],
  dis: ["the opposite of", "相反"],
  un: ["not", "不"],
  in: ["not", "不"],
  non: ["not", "非"],
  over: ["too much", "过度"],
  under: ["too little", "不足"],
};

/** prefixOf finds the common prefix a word starts with. */
const prefixOf = (word: string) => Object.keys(prefixMeaning).find((p) => low(word).startsWith(p));

/** commonPrefixesWritingWithPrefixesNot explains a prefix whose meaning does not fit, or a prefix that loses a letter. */
export const commonPrefixesWritingWithPrefixesNot = explain(
  when(
    (s) => prefixOf(s.wrong) === "in" && prefixOf(s.right) === "un",
    t(
      "*in-* also means *not*, but only with certain words, many of them from Latin (*incorrect*, *invisible*). Everyday words like this one take another prefix that means *not*.",
      "*in-* 也表示“不”，但只用于某些词，多数源自拉丁语（*incorrect*、*invisible*）。像这样的日常词要用另一个表示“不”的前缀。",
    ),
  ),
  when(
    (s) => prefixOf(s.wrong) !== undefined && prefixOf(s.wrong) !== prefixOf(s.right),
    (s) => {
      const p = prefixOf(s.wrong) ?? "";
      const [en, zh] = prefixMeaning[p] ?? ["", ""];
      return t(
        `*${p}-* means *${en}*, which does not give the meaning *${s.shown}*. Choose the prefix whose meaning matches.`,
        `*${p}-* 的意思是“${zh}”，得不到“${s.shown}”这个意思。要选意思相符的前缀。`,
      );
    },
  ),
  when(
    (s) => low(s.wrong).length < low(s.right).length,
    t(
      "A prefix joins the base word without changing either one, so a double letter where they meet stays double (*mis* + *spell*).",
      "前缀和词根相连时两者都不变，所以交界处出现的双字母要保留（*mis* + *spell*）。",
    ),
  ),
);

/** commonSuffixesSpellingWithSuffixesNot explains a suffix spelled wrongly or a base not changed by the spelling rules. */
export const commonSuffixesSpellingWithSuffixesNot = explain(
  endings,
  yToI,
  spelling,
  when(
    (s) => /able$/u.test(low(s.right)) && /ible$/u.test(low(s.wrong)),
    t(
      "After a whole base word like *love* or *read*, the ending is usually *-able*.",
      "在 *love*、*read* 这样完整的词根后面，词尾通常是 *-able*。",
    ),
  ),
  joined,
);

/** classOf names the word class a suffix makes. */
const classOf = (word: string) => {
  const w = low(word);
  if (/(ment|tion|sion|ness|ance|ence|ity)$/u.test(w)) return t("a noun", "名词");
  if (/(ize|ify|en)$/u.test(w)) return t("a verb", "动词");
  return t("an adjective", "形容词");
};

/** suffixesThatChangeWordClassChoosingTheFormNot explains a word built with an ending its base does not take. */
export const suffixesThatChangeWordClassChoosingTheFormNot = explain(
  silentEKept,
  endings,
  when(
    (s) => s.wrong !== s.right,
    (s) => {
      const base = /\((\w+)\)/u.exec(s.shown)?.[1] ?? "";
      const k = classOf(s.right);
      return t(
        `*${s.wrong}* is not an English word. The sentence needs ${k.en} made from *${base}*, and *${base}* takes a different ending.`,
        `*${s.wrong}* 不是英语单词。句子需要由 *${base}* 变来的${k["zh-CN"]}，而 *${base}* 要用另一个词尾。`,
      );
    },
  ),
);
