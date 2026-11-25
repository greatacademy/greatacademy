// Feedback for the listed wrong responses of the typed problems of the native grades, one kind of mistake at a time.

import { t } from "@ga/content";
import {
  type Case,
  endMarkMissing,
  explain,
  participleNeeded,
  regularEd,
  type Seen,
  spelling,
  statementQuestion,
  when,
} from "../why-not.ts";

/** low is a stretch of text in small letters without marks, for comparing. */
const low = (x: string) =>
  x
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}' ]/gu, "");

/** bracketed finds the word in brackets or before a colon that a typed word is made from. */
const baseOf = (s: Seen) =>
  /\((\w+)\)/u.exec(s.shown)?.[1] ?? /^(\w+)(?: \+|:)/u.exec(s.shown)?.[1] ?? /\bone (\w+), two\b/u.exec(s.shown)?.[1] ?? "";

/** wrongStretch finds the letters of a misspelled word that differ from the right spelling. */
const wrongStretch = (wrong: string, right: string) => {
  const [w, r] = [low(wrong), low(right)];
  let p = 0;
  while (p < w.length && p < r.length && w[p] === r[p]) p++;
  let q = 0;
  while (q < w.length - p && q < r.length - p && w[w.length - 1 - q] === r[r.length - 1 - q]) q++;
  return { bad: w.slice(p, w.length - q), before: w.slice(0, p) };
};

/** memorized explains a word misspelled outside the part a rule decides, pointing at the letters to look at again. */
const memorized: Case = (s) => {
  const { bad, before } = wrongStretch(s.wrong, s.right);
  if (low(s.wrong) === low(s.right)) return undefined;
  return bad === ""
    ? t(
        `*${s.wrong}* leaves out a letter${before ? ` after *${before}*` : " at the start"}. This part of the word is not decided by a rule, so learn it by sight: say it slowly and picture each letter.`,
        `*${s.wrong}* ${before ? `在 *${before}* 后面` : "开头"}漏了一个字母。这部分拼写不由规则决定，要靠记忆：慢慢读，想清每个字母。`,
      )
    : t(
        `In *${s.wrong}*, the letters *${bad}*${before ? ` after *${before}*` : " at the start"} are not how this word is spelled. This part is not decided by a rule, so learn it by sight: say it slowly and picture each letter.`,
        `*${s.wrong}* 里${before ? ` *${before}* 后面的` : "开头的"} *${bad}* 拼错了。这部分拼写不由规则决定，要靠记忆：慢慢读，想清每个字母。`,
      );
};

/** endingRule explains a verb with *-ed* or *-ing* by the rule its last letters call for. */
const endingRule: Case = (s) => {
  const m = /^(\w+) \+ -(ed|ing)$/u.exec(s.shown.trim());
  if (!m) return undefined;
  const [, base = "", ending = ""] = m;
  const w = low(s.wrong);
  if (ending === "ed" && /t$/u.test(w) && !/ed$/u.test(w))
    return t(
      "The past ending is always written *-ed*, even when it sounds like /t/ (*looked*, *pushed*).",
      "过去式词尾一律写作 *-ed*，即使它读作 /t/（*looked*、*pushed*）。",
    );
  if (/[^aeiou]y$/u.test(base))
    return ending === "ed"
      ? t(
          `*${base}* ends in a consonant and *y*, so before *-ed* the *y* changes to *i*; nothing else is dropped or added.`,
          `*${base}* 以“辅音字母 + *y*”结尾，所以加 *-ed* 前把 *y* 变成 *i*，其他字母不增不减。`,
        )
      : t(`Before *-ing*, the final *y* of *${base}* stays.`, `加 *-ing* 时，*${base}* 词尾的 *y* 保留。`);
  if (/[aeiou]y$/u.test(base))
    return t(
      `*${base}* has a vowel before its final *y*, so the *y* stays and the ending is just added.`,
      `*${base}* 词尾 *y* 前面是元音字母，所以保留 *y*，直接加词尾。`,
    );
  if (/[^aeiou]e$/u.test(base))
    return ending === "ed"
      ? t(`*${base}* ends in a silent *e*, so it adds only *-d*.`, `*${base}* 以不发音的 *e* 结尾，所以只加 *-d*。`)
      : t(
          `*${base}* ends in a silent *e*, which drops before *-ing*; no other letter is added.`,
          `*${base}* 以不发音的 *e* 结尾，加 *-ing* 时去掉 *e*，不加别的字母。`,
        );
  if (/^[^aeiou]*[aeiou][^aeiouwxy]$/u.test(base))
    return t(
      `*${base}* has one short vowel and ends in one consonant, so that consonant doubles before the ending, with nothing else added.`,
      `*${base}* 只有一个短元音、以一个辅音字母结尾，所以加词尾前双写这个辅音，不加别的字母。`,
    );
  return t(
    `*${base}* needs no change: the ending is added straight on, with no letter doubled, dropped or added.`,
    `*${base}* 不需要变化：直接加词尾，不双写、不去掉也不增加字母。`,
  );
};

/** abstractNounEnding explains an abstract noun built with an ending its base does not take. */
export const formingAbstractNounsNot = explain(
  spelling,
  when(
    (s) => s.wrong !== s.right,
    (s) =>
      t(
        `*${s.wrong}* is not the noun English uses. *${baseOf(s)}* takes a different ending${low(s.right).startsWith(low(baseOf(s))) ? "" : ", and its spelling changes as well"}.`,
        `*${s.wrong}* 不是英语里用的名词。*${baseOf(s)}* 要用另一个后缀${low(s.right).startsWith(low(baseOf(s))) ? "" : "，而且拼写也会变化"}。`,
      ),
  ),
);

/** typingTheEndingNot explains a verb with an ending whose spelling rule is broken. */
export const typingTheEndingNot = explain(spelling, endingRule);

/** commasInDatesAndPlacesNot explains a date or a place without the comma between its parts. */
export const commasInDatesAndPlacesNot = explain(
  when(
    (s) => low(s.wrong) === low(s.right) && /\d \d{4}/u.test(s.wrong),
    t("In a date, a comma separates the day from the year.", "在日期里，日和年之间要用逗号隔开。"),
  ),
  when(
    (s) => low(s.wrong) === low(s.right),
    t(
      "When a city is followed by its state or country, a comma separates the two names.",
      "城市后面跟着州名或国名时，两个名称之间要用逗号隔开。",
    ),
  ),
);

/** formingContractionsNot explains a contraction without its apostrophe, or with it in the wrong place. */
export const formingContractionsNot = explain(
  when(
    (s) => /^their/iu.test(s.wrong.trim()),
    t(
      "*their* means belonging to them. The short form of *there is* is built from *there*.",
      "*their* 的意思是“他们的”。*there is* 的缩写要用 *there* 来构成。",
    ),
  ),
  when(
    (s) => low(s.wrong) === "willn't",
    t(
      "*will not* has its own short form, which does not keep *will*. It has to be learned on its own.",
      "*will not* 有自己特殊的缩写形式，不保留 *will*，要单独记住。",
    ),
  ),
  when(
    (s) => !s.wrong.includes("'"),
    t("A contraction needs an apostrophe where the letters were taken out.", "缩写要在省略字母的地方加撇号。"),
  ),
  when(
    (s) => low(s.wrong).length < low(s.right).length,
    t(
      "An apostrophe replaces only the letters left out. Here a letter that should stay is missing too.",
      "撇号只代替省略的字母。这里连该保留的字母也丢了。",
    ),
  ),
  when(
    (s) => low(s.wrong).length > low(s.right).length,
    t(
      "An apostrophe replaces the letters left out, so those letters are not written as well. Here some of them are still there.",
      "撇号代替了省略的字母，所以这些字母不能再写出来。这里还留着其中一些。",
    ),
  ),
  when(
    (s) => s.wrong.replace("'", "") === s.right.replace("'", ""),
    t(
      "The apostrophe goes exactly where the letters were left out, not between the two words.",
      "撇号要放在省略字母的位置，而不是两个词之间。",
    ),
  ),
);

/** changingTheKindNot explains a sentence of a new kind with the end mark of the old one, or a command that keeps its subject. */
export const changingTheKindNot = explain(
  statementQuestion,
  when(
    (s) => s.right.trim().endsWith("!") && !s.wrong.trim().endsWith("!"),
    t("An exclamation shows strong feeling, so it ends with an exclamation mark.", "感叹句表达强烈的感情，所以要以感叹号结尾。"),
  ),
  when(
    (s) => /^what an? /iu.test(s.right) && !/^what\b/iu.test(s.wrong),
    t(
      "An exclamation of this kind opens with *What a* (or *What an*) and the noun, and drops *is* or *was*.",
      "这种感叹句以 *What a*（或 *What an*）加名词开头，并去掉 *is* 或 *was*。",
    ),
  ),
  when(
    (s) => !s.right.trim().endsWith("?") && /^(is|are|was|were|will|can|do|does|did)\b/iu.test(s.wrong),
    t(
      "A statement puts the subject before the helper verb. With the helper first, it is still a question.",
      "陈述句把主语放在助动词前面。助动词放在前面，就还是疑问句。",
    ),
  ),
  when(
    (s) => s.right.trim().endsWith("?") && !s.wrong.trim().endsWith("?"),
    t(
      "The words now ask something, so the sentence is a question and ends with a question mark.",
      "这些词现在是在提问，所以句子是疑问句，要以问号结尾。",
    ),
  ),
  when(
    (s) => s.wrong.trim().endsWith("?") && !s.right.trim().endsWith("?"),
    t(
      "With the subject first, the words make a statement, so the sentence ends with a full stop.",
      "主语放在前面，这些词就是陈述，所以句子以句号结尾。",
    ),
  ),
  when(
    (s) => /^you should\b/iu.test(s.wrong),
    t(
      "A command starts straight with the verb. It drops *You should*, because the person spoken to is understood.",
      "祈使句直接以动词开头。要去掉 *You should*，因为听话的人不言自明。",
    ),
  ),
  endMarkMissing,
);

/** ckRule explains *k* for *ck*, *ch* for *tch*, *ge* for *dge* and the other way round. */
export const typingTheWordNot = explain(
  when(
    (s) => /[^aeiouc]k$/u.test(low(s.right)) && /c$/u.test(low(s.wrong)),
    t("After a consonant at the end of a word, the sound /k/ is spelled *k*.", "在词尾的辅音字母后面，/k/ 音拼作 *k*。"),
  ),
  when(
    (s) => /ge$/u.test(low(s.right)) && /ch$/u.test(low(s.wrong)),
    t(
      "The last sound here is /j/, not /ch/. *ch* and *tch* spell /ch/; /j/ at the end of a word is spelled *ge* or *dge*.",
      "这里最后的音是 /j/，不是 /ch/。*ch* 和 *tch* 拼的是 /ch/；词尾的 /j/ 拼作 *ge* 或 *dge*。",
    ),
  ),
  when(
    (s) => /k$/u.test(low(s.right)) && /c$/u.test(low(s.wrong)),
    t(
      "At the end of a word, /k/ is spelled *ck* right after a short vowel and *k* everywhere else, never *c* alone.",
      "在词尾，/k/ 紧跟短元音时拼作 *ck*，其他情况拼作 *k*，从不单独用 *c*。",
    ),
  ),
  when(
    (s) => /ch$/u.test(low(s.right)) && /ge$/u.test(low(s.wrong)),
    t(
      "The last sound here is /ch/, not /j/. *ge* and *dge* spell /j/; /ch/ is spelled *ch* or *tch*.",
      "这里最后的音是 /ch/，不是 /j/。*ge* 和 *dge* 拼的是 /j/；/ch/ 拼作 *ch* 或 *tch*。",
    ),
  ),
  when(
    (s) => /ck/u.test(low(s.right)) && !/ck/u.test(low(s.wrong)),
    t(
      "Right after a short vowel at the end of a one-syllable word, the sound /k/ is spelled *ck*.",
      "单音节词中，紧跟在短元音后面的 /k/ 音拼作 *ck*。",
    ),
  ),
  when(
    (s) => /ck/u.test(low(s.wrong)) && !/ck/u.test(low(s.right)),
    t(
      "*ck* comes only straight after a short vowel. After a long vowel, a consonant, or with a silent *e*, the sound is spelled *k*.",
      "*ck* 只紧跟在短元音后面。在长元音、辅音字母后面，或词尾有不发音的 *e* 时，这个音拼作 *k*。",
    ),
  ),
  when(
    (s) => /tch/u.test(low(s.right)) && !/tch/u.test(low(s.wrong)),
    t("Right after a short vowel, the sound /ch/ is spelled *tch*.", "紧跟在短元音后面的 /ch/ 音拼作 *tch*。"),
  ),
  when(
    (s) => /tch/u.test(low(s.wrong)) && !/tch/u.test(low(s.right)),
    t(
      "*tch* comes only straight after a short vowel. After a long vowel or a consonant, the sound is spelled *ch*.",
      "*tch* 只紧跟在短元音后面。在长元音或辅音字母后面，这个音拼作 *ch*。",
    ),
  ),
  when(
    (s) => /dge/u.test(low(s.right)) && !/dge/u.test(low(s.wrong)),
    t("Right after a short vowel, the sound /j/ at the end of a word is spelled *dge*.", "紧跟在短元音后面的词尾 /j/ 音拼作 *dge*。"),
  ),
  when(
    (s) => /dge/u.test(low(s.wrong)) && !/dge/u.test(low(s.right)),
    t(
      "*dge* comes only straight after a short vowel. After a long vowel or a consonant, the sound is spelled *ge*.",
      "*dge* 只紧跟在短元音后面。在长元音或辅音字母后面，这个音拼作 *ge*。",
    ),
  ),
);

/** twoOrAll explains the form that compares two used for one of many, and the other way round. */
const twoOrAll: Case = (s) => {
  const [w, r] = [low(s.wrong), low(s.right)];
  const most = (x: string) => /est$/u.test(x) || /^most /u.test(x);
  const more = (x: string) => /er$/u.test(x) || /^more /u.test(x);
  if (most(r) && more(w))
    return t(
      "This picks out one from a whole group (*of all*), so the adverb takes *-est* or *most*. *-er* and *more* compare only two.",
      "这里是从一整组里挑出一个（*of all*），所以副词用 *-est* 或 *most*。*-er* 和 *more* 只用于两者比较。",
    );
  if (more(r) && most(w))
    return t(
      "This compares just two (*than*), so the adverb takes *-er* or *more*. *-est* and *most* are for one out of a group.",
      "这里只比较两个（*than*），所以副词用 *-er* 或 *more*。*-est* 和 *most* 用于一组中的一个。",
    );
  return undefined;
};

/** writingTheFormThatComparesNot explains an adverb in the form that compares the wrong number of things. */
export const writingTheFormThatComparesNot = explain(
  when(
    (s) => /^(better|best|worse|worst)$/u.test(low(s.right)) && /^(better|best|worse|worst)$/u.test(low(s.wrong)),
    (s) =>
      /^(best|worst)$/u.test(low(s.right))
        ? t(
            "This picks out one from a whole group (*of all*), so it needs the form for the most.",
            "这里是从一整组里挑出一个（*of all*），所以要用最高级。",
          )
        : t("This compares just two (*than*), so it needs the form for two.", "这里只比较两个（*than*），所以要用比较级。"),
  ),
  when(
    (s) => /^(better|best|worse|worst)$/u.test(low(s.right)),
    t(
      "*well* and *badly* compare irregularly: they change into other words instead of taking *-er* or *-est*.",
      "*well* 和 *badly* 的比较形式不规则：它们变成别的词，而不是加 *-er* 或 *-est*。",
    ),
  ),
  twoOrAll,
  when(
    (s) => /^(more|most) \w+er$|^(more|most) \w+est$/u.test(low(s.wrong)),
    t(
      "Use *-er* or *more*, never both; and *-est* or *most*, never both.",
      "*-er* 和 *more* 只用一个，不能同时用；*-est* 和 *most* 也一样。",
    ),
  ),
  when(
    (s) => /^(more|most) /u.test(low(s.wrong)) && !/^(more|most) /u.test(low(s.right)),
    t(
      "A short adverb that has the same form as its adjective (*fast*, *hard*, *high*) takes *-er* or *-est*, not *more* or *most*.",
      "与形容词同形的短副词（*fast*、*hard*、*high*）加 *-er* 或 *-est*，不用 *more* 或 *most*。",
    ),
  ),
  when(
    (s) => /^(more|most) /u.test(low(s.right)) && !/^(more|most) /u.test(low(s.wrong)),
    t(
      "An adverb ending in *-ly* compares with *more* and *most*, not with *-er* or *-est*.",
      "以 *-ly* 结尾的副词用 *more* 和 *most* 比较，不加 *-er* 或 *-est*。",
    ),
  ),
  spelling,
);

/** typingTionAndSionNounsNot explains *-sion* where the base ends in *t*, and *-tion* where it ends in *d*, *de* or *se*. */
export const typingTionAndSionNounsNot = explain(
  when(
    (s) => /ssion$/u.test(low(s.right)) && !/ssion$/u.test(low(s.wrong)) && /sion$/u.test(low(s.wrong)),
    t(
      "Verbs ending in *-mit* or *-ss* (*admit*, *discuss*) make nouns ending in *-ssion*, with a double *s*.",
      "以 *-mit* 或 *-ss* 结尾的动词（*admit*、*discuss*）构成的名词以 *-ssion* 结尾，有两个 *s*。",
    ),
  ),
  when(
    (s) => /tetion$/u.test(low(s.wrong)),
    t(
      "The verb ends in *te* (*create*, *locate*), so the *e* drops and *-ion* is added to the *t*.",
      "动词以 *te* 结尾（*create*、*locate*），所以去掉 *e*，在 *t* 后面加 *-ion*。",
    ),
  ),
  when(
    (s) => /tation$/u.test(low(s.wrong)) && !/tation$/u.test(low(s.right)),
    t(
      "The verb already ends in *t* (*select*, *invent*), so it just adds *-ion*. *-ation* is for verbs like *inform* or *admire*.",
      "动词本身已经以 *t* 结尾（*select*、*invent*），所以直接加 *-ion*。*-ation* 用于 *inform*、*admire* 这类动词。",
    ),
  ),
  when(
    (s) => /tion$/u.test(low(s.right)) && /sion$/u.test(low(s.wrong)),
    t(
      "The verb this noun comes from ends in *t* (*erupt*, *protect*), so the noun ends in *-tion*.",
      "这个名词所来自的动词以 *t* 结尾（*erupt*、*protect*），所以名词以 *-tion* 结尾。",
    ),
  ),
  when(
    (s) => /sion$/u.test(low(s.right)) && /tion$/u.test(low(s.wrong)),
    t(
      "The verb this noun comes from ends in *d*, *de*, *se* or *t* after *s* or *mit* (*decide*, *confuse*, *admit*), so the noun ends in *-sion*.",
      "这个名词所来自的动词以 *d*、*de*、*se* 结尾，或以 *mit* 等结尾（*decide*、*confuse*、*admit*），所以名词以 *-sion* 结尾。",
    ),
  ),
  spelling,
);

/** typingIeAndEiWordsNot explains *ei* where *i* comes before *e*, and *ie* after *c* or for the sound of *ay*. */
export const typingIeAndEiWordsNot = explain(
  when(
    (s) => /ie/u.test(low(s.right)) && /ei/u.test(low(s.wrong)),
    t(
      "*i* comes before *e* when the two letters say /ee/ and do not follow *c*.",
      "当这两个字母读 /ee/ 且不在 *c* 后面时，*i* 在 *e* 前面。",
    ),
  ),
  when(
    (s) => /cei/u.test(low(s.right)) && /cie/u.test(low(s.wrong)),
    t("Right after *c*, the order is *e* before *i*.", "紧跟在 *c* 后面时，顺序是 *e* 在 *i* 前面。"),
  ),
  when(
    (s) => /ei/u.test(low(s.right)) && /ie/u.test(low(s.wrong)),
    t(
      "When the two letters say /ay/, as in *neighbor*, or the word is one of the exceptions, *e* comes before *i*.",
      "当这两个字母读 /ay/（如 *neighbor*）或这个词属于例外时，*e* 在 *i* 前面。",
    ),
  ),
  when(
    (s) => /ie|ei/u.test(low(s.right)) && !/ie|ei/u.test(low(s.wrong)),
    t(
      "The vowel sound of this word is spelled with *i* and *e* side by side, not with *ee*, *ea* or another pair. Then decide their order: *i* before *e*, except after *c* or when they say /ay/.",
      "这个词的元音由 *i* 和 *e* 两个字母并排拼写，而不是 *ee*、*ea* 或别的组合。再决定顺序：*i* 在 *e* 前，*c* 后面或读 /ay/ 时例外。",
    ),
  ),
  memorized,
);

/** typingAbleAndIbleWordsNot explains *-ible* after a whole word, and *-able* after a part that is not a word. */
export const typingAbleAndIbleWordsNot = explain(
  when(
    (s) => /bel$/u.test(low(s.wrong)) && /ble$/u.test(low(s.right)),
    t("The ending is *-ble*, with *l* before the final *e*, never *-bel*.", "词尾是 *-ble*，*l* 在最后的 *e* 前面，不是 *-bel*。"),
  ),
  when(
    (s) => /eble$/u.test(low(s.wrong)),
    t("The ending is either *-able* or *-ible*, never *-eble*.", "词尾要么是 *-able*，要么是 *-ible*，没有 *-eble*。"),
  ),
  when(
    (s) => /able$/u.test(low(s.right)) && /ible$/u.test(low(s.wrong)),
    t(
      "What comes before the ending is a whole word on its own (*break*, *wash*), so the ending is *-able*.",
      "词尾前面的部分本身是一个完整的词（*break*、*wash*），所以词尾是 *-able*。",
    ),
  ),
  when(
    (s) => /ible$/u.test(low(s.right)) && /able$/u.test(low(s.wrong)),
    t(
      "What comes before the ending is not a whole English word on its own (*vis-*, *poss-*), so the ending is usually *-ible*.",
      "词尾前面的部分本身不是一个完整的英语单词（*vis-*、*poss-*），所以词尾通常是 *-ible*。",
    ),
  ),
  spelling,
  memorized,
);

/** count counts the times a pair of letters appears in a word. */
const count = (word: string, pair: string) => low(word).split(pair).length - 1;

/** typingGreekSpellingsNot explains a Greek word spelled the way it sounds instead of with *ph*, *ch* or *y*. */
export const typingGreekSpellingsNot = explain(
  when(
    (s) => count(s.right, "ph") > count(s.wrong, "ph"),
    t("This word comes from Greek, and its /f/ sound is spelled *ph*.", "这个词来自希腊语，它的 /f/ 音拼作 *ph*。"),
  ),
  when(
    (s) => count(s.right, "ch") > count(s.wrong, "ch"),
    t("This word comes from Greek, and its /k/ sound is spelled *ch*.", "这个词来自希腊语，它的 /k/ 音拼作 *ch*。"),
  ),
  when(
    (s) => [...low(s.right)].some((c, i) => c === "y" && low(s.wrong) === `${low(s.right).slice(0, i)}i${low(s.right).slice(i + 1)}`),
    t(
      "This word comes from Greek, and the vowel sound in the middle is spelled *y*, not *i*.",
      "这个词来自希腊语，中间的元音拼作 *y*，而不是 *i*。",
    ),
  ),
  memorized,
);

/** formingTheFuturePerfectNot explains a future perfect without *will*, or with a wrong past participle. */
export const formingTheFuturePerfectNot = explain(
  when(
    (s) => /^will \w+$/iu.test(s.wrong.trim()),
    t(
      "*will* alone just says the action will happen. *By* a time means it will be finished before then: *will have* and the past participle.",
      "只用 *will* 只表示动作会发生。*By* 加时间表示动作在那之前就会完成：要用 *will have* 加过去分词。",
    ),
  ),
  when(
    (s) => !/\bwill\b/iu.test(s.wrong),
    t(
      "*By* a time in the future means the action will be finished before then, so the verb needs *will have* and the past participle. Without *will*, this is the present perfect.",
      "*By* 加将来的时间表示动作在那之前就会完成，所以动词要用 *will have* 加过去分词。没有 *will* 就成了现在完成时。",
    ),
  ),
  regularEd,
  participleNeeded,
);

/** typingAntAndEntWordsNot explains *-ent* where the related noun has *-ance*, and *-ant* where it has *-ence*. */
export const typingAntAndEntWordsNot = explain(
  when(
    (s) => /ant$/u.test(low(s.right)) && /ent$/u.test(low(s.wrong)),
    t(
      "Think of the related noun: it ends in *-ance* or *-ancy*, so the adjective ends in *-ant*.",
      "想想相关的名词：它以 *-ance* 或 *-ancy* 结尾，所以形容词以 *-ant* 结尾。",
    ),
  ),
  when(
    (s) => /ent$/u.test(low(s.right)) && /ant$/u.test(low(s.wrong)),
    t(
      "Think of the related noun: it ends in *-ence* or *-ency*, so the adjective ends in *-ent*.",
      "想想相关的名词：它以 *-ence* 或 *-ency* 结尾，所以形容词以 *-ent* 结尾。",
    ),
  ),
  spelling,
);

/** spellingPluralsNot explains a plural that breaks the rule its last letters call for. */
export const spellingPluralsNot = explain((s) => {
  const one = low(baseOf(s));
  const [w, r] = [low(s.wrong), low(s.right)];
  if (!one || w === r) return undefined;
  if (/(s|x|z|ch|sh)$/u.test(one) && /es$/u.test(r))
    return t(
      `*${one}* ends in *s*, *x*, *z*, *ch* or *sh*, so you hear an extra syllable in the plural: add *-es*.`,
      `*${one}* 以 *s*、*x*、*z*、*ch* 或 *sh* 结尾，复数时多出一个音节，所以加 *-es*。`,
    );
  if (/[^aeiou]y$/u.test(one))
    return t(
      `*${one}* has a consonant before its final *y*, so the *y* changes to *i* and the plural adds *-es*.`,
      `*${one}* 词尾 *y* 前面是辅音字母，所以要把 *y* 变成 *i* 再加 *-es*。`,
    );
  if (/[aeiou]y$/u.test(one))
    return t(
      `*${one}* has a vowel before its final *y*, so the *y* stays and the plural just adds *-s*.`,
      `*${one}* 词尾 *y* 前面是元音字母，所以保留 *y*，复数直接加 *-s*。`,
    );
  if (/ves$/u.test(r))
    return t(
      `*${one}* is one of the words ending in *f* or *fe* that change it to *v* and add *-es*.`,
      `*${one}* 属于以 *f* 或 *fe* 结尾、复数时把它变成 *v* 再加 *-es* 的词。`,
    );
  if (/(f|fe)$/u.test(one))
    return t(
      `*${one}* keeps its *f* in the plural, like *roof* and *chief*; it just adds *-s*.`,
      `*${one}* 复数时保留 *f*，和 *roof*、*chief* 一样，直接加 *-s*。`,
    );
  if (/o$/u.test(one))
    return /oes$/u.test(r)
      ? t(`*${one}* is one of the words ending in *o* that add *-es*.`, `*${one}* 属于以 *o* 结尾、复数加 *-es* 的词。`)
      : t(`*${one}* is one of the words ending in *o* that add only *-s*.`, `*${one}* 属于以 *o* 结尾、复数只加 *-s* 的词。`);
  return t(`*${one}* follows the plain rule: just add *-s*.`, `*${one}* 按一般规则变复数：直接加 *-s*。`);
});

/** pastParticiplesNot explains the past simple, or a regular ending, used for the past participle of an irregular verb. */
export const pastParticiplesNot = explain(
  regularEd,
  when(
    (s) => s.wrong !== s.right,
    (s) =>
      t(
        `*${s.wrong}* is not the form that follows *have*, *has* or *had*. *${baseOf(s)}* is irregular, and its past participle, the third form, differs from its past simple.`,
        `*${s.wrong}* 不是 *have*、*has*、*had* 后面用的形式。*${baseOf(s)}* 是不规则动词，它的过去分词（第三种形式）和过去式不同。`,
      ),
  ),
);
