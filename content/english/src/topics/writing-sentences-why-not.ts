// Feedback for the listed wrong responses of writing sentences: each names the rule the response breaks. A response
// none of the rules explains is an error, so a new kind of wrong response cannot go out without its own feedback.

import { type Text, t } from "@ga/content";
import { listed, marksOf, reordered, spanOf, type WhyNot } from "@ga/subject-english";

/** joinTexts puts several feedback sentences together. */
const joinTexts = (parts: readonly Text[]): Text => t(parts.map((p) => p.en).join(" "), parts.map((p) => p["zh-CN"]).join(""));

/** unexplained fails for a wrong response that no rule of its bank explains. */
const unexplained = (wrong: string, right: string): never => {
  throw new Error(`no feedback for "${wrong}" (right: "${right}")`);
};

/** lastWord is the last word of a sentence without its end mark. */
const lastWord = (s: string) => (s.trim().split(/\s+/u).pop() ?? "").replace(/[.?!,]$/u, "");

/** endless is the note for a sentence left without an end mark. */
const endless = t("The sentence also needs an end mark.", "句末还缺少句号。");

/** startsSmall is the note for a sentence that starts with a small letter. */
const startsSmall = (word: string) =>
  t(`*${word}* starts the sentence, so it takes a capital letter.`, `*${word}* 是句子的第一个词，要大写首字母。`);

/** capitalsNot explains a sentence whose capitals are missing or misplaced. */
export const capitalsNot: WhyNot = (wrong, right) => {
  const m = marksOf(wrong, right);
  if (!m || m.lowered.length === 0) return unexplained(wrong, right);
  const first = wrong.trim().split(/\s+/u)[0] ?? "";
  const names = m.lowered.filter((w, i) => !(i === 0 && w === first) && w !== "i");
  const parts: Text[] = [];
  if (m.lowered[0] === first) parts.push(startsSmall(first));
  if (m.lowered.includes("i")) parts.push(t("*i* is the pronoun *I*, which is always a capital.", "*i* 是代词 *I*，永远大写。"));
  if (names.length > 0) {
    parts.push(
      t(
        `${listed(names).en} ${names.length === 1 ? "is" : "are"} part of the name of a particular person, place, day, month or language, so ${names.length === 1 ? "it starts" : "each starts"} with a capital letter.`,
        `${listed(names)["zh-CN"]} 属于特定的人、地方、星期、月份或语言的名称，要大写首字母。`,
      ),
    );
  }
  return joinTexts(parts);
};

/** commaPlace says whether a word of a sentence comes before the first comma of the right sentence, or after the last. */
const commaPlace = (wrongWord: string, wrong: string, right: string): "before" | "after" => {
  const index = wrong.split(/\s+/u).indexOf(wrongWord);
  const commas = right
    .split(/\s+/u)
    .map((w, i) => (w.endsWith(",") ? i : -1))
    .filter((i) => i >= 0);
  return index < (commas[0] ?? 0) ? "before" : "after";
};

/** seriesNot explains a list whose commas are missing or put before or after the list. */
export const seriesNot: WhyNot = (wrong, right, shown) => {
  if (wrong.trim() === shown.trim()) {
    return t(
      "That is the sentence as given: nothing separates the items of the list, so they run together. A comma goes after each item that comes before *and* or *or*.",
      "这是原句：列举的各项之间没有分隔，挤在了一起。*and* 或 *or* 之前的每一项后面都要加逗号。",
    );
  }
  const m = marksOf(wrong, right);
  const comma = m?.extra.find(([, mark]) => mark === ",");
  if (!m || !comma) return unexplained(wrong, right);
  const [word] = comma;
  const bareWord = word.replace(/,$/u, "");
  return commaPlace(word, wrong, right) === "before"
    ? t(
        `The comma after *${bareWord}* comes before the first item, cutting the list off from the words that introduce it. Commas go only between the items.`,
        `*${bareWord}* 后面的逗号放在了第一项之前，把列举和引出它的词隔开了。逗号只放在各项之间。`,
      )
    : t(
        `The comma after *${bareWord}* comes after the last item, cutting the list off from the rest of the sentence. Commas go only between the items.`,
        `*${bareWord}* 后面的逗号放在了最后一项之后，把列举和句子其余部分隔开了。逗号只放在各项之间。`,
      );
};

/** conjunctionOf finds the joining word a right sentence uses. */
const conjunctionOf = (right: string, words: readonly string[]) =>
  words.find((w) => new RegExp(`(^|\\s)${w}\\s`, "iu").test(right)) ?? unexplained("", right);

const coordinators = ["and", "but", "or", "so", "yet"] as const;

/** joinedNot explains two sentences joined without their comma, with a comma alone, or not joined at all. */
export const joinedNot: WhyNot = (wrong, right, shown) => {
  const word = conjunctionOf(right, coordinators);
  if (wrong.trim() === shown.trim()) {
    return t(
      "That is the text as given, still two sentences. Join them into one with the joining word.",
      "这是原文，还是两个句子。要用连词把它们合成一句。",
    );
  }
  const m = marksOf(wrong, right);
  if (m?.extra.some(([, mark]) => mark === ".")) {
    return t(
      `This still splits the thoughts into two sentences, now starting the second with *${word.charAt(0).toUpperCase()}${word.slice(1)}* and leaving it without an end mark. Join them into one sentence: a comma, then *${word}*.`,
      `这样还是两个句子，第二句以 *${word.charAt(0).toUpperCase()}${word.slice(1)}* 开头，结尾也没有句号。要合成一个句子：逗号后接 *${word}*。`,
    );
  }
  if (m?.missing.some(([, mark]) => mark === ",")) {
    return t(
      `*${word}* joins two complete sentences here, and each could stand alone, so a comma goes before *${word}*.`,
      `这里 *${word}* 连接的是两个完整的句子，各自都能独立成句，所以 *${word}* 前要加逗号。`,
    );
  }
  const span = spanOf(wrong, right);
  if (span.wrong === "" && span.right === word) {
    return t(
      `A comma alone cannot join two complete sentences: that makes a run-on. The comma needs *${word}* after it.`,
      `只用逗号不能连接两个完整的句子，那样会成为连写句。逗号后面还要有 *${word}*。`,
    );
  }
  return unexplained(wrong, right);
};

/** clauseAfter is the clause of a sentence that follows a joining word, without its end mark. */
const clauseAfter = (sentence: string, word: string) => {
  const at = sentence.toLowerCase().indexOf(` ${word} `);
  const start = at < 0 ? (sentence.toLowerCase().startsWith(`${word} `) ? word.length + 1 : -1) : at + word.length + 2;
  if (start < 0) return "";
  return sentence
    .slice(start)
    .replace(/[,.].*$/u, "")
    .trim();
};

/** becauseNot explains a sentence with *because* that turns cause and effect around or has stray marks. */
export const becauseNot: WhyNot = (wrong, right) => {
  if (reordered(wrong, right)) {
    return t(
      `This turns cause and effect around: it gives *${clauseAfter(wrong, "because")}* as the reason. *because* has to come right before the reason, the part that explains the other.`,
      `这样因果颠倒了：它把 *${clauseAfter(wrong, "because")}* 当成了原因。*because* 要紧挨在原因前面，也就是解释另一件事的那一部分。`,
    );
  }
  const m = marksOf(wrong, right);
  if (!m) return unexplained(wrong, right);
  const parts: Text[] = [];
  if (m.extra.some(([w, mark]) => mark === "," && wrong.includes(`${w} because`))) {
    parts.push(
      t(
        "No comma goes before *because* when the reason comes second: the reason belongs closely to what it explains.",
        "原因放在后面时，*because* 前不加逗号：原因和它解释的内容紧密相连。",
      ),
    );
  }
  if (m.missing.some(([, mark]) => mark === "."))
    parts.push(parts.length > 0 ? endless : t("The sentence has no end mark.", "句末没有句号。"));
  return parts.length > 0 ? joinTexts(parts) : unexplained(wrong, right);
};

/** roles say what kind of clause each subordinating conjunction opens. */
const roles: Readonly<Record<string, readonly [en: string, zh: string]>> = {
  although: ["the fact that goes against the main part", "与主句意思相反的那件事"],
  because: ["the reason", "原因"],
  since: ["the point in time the main part counts from", "主句计时的起点"],
  when: ["the time of the main part", "主句发生的时间"],
  while: ["what is going on at the same time", "同时在进行的事"],
  after: ["what happens first", "先发生的事"],
  before: ["what happens later", "后发生的事"],
  until: ["the point where the main part stops", "主句停止的那个时间点"],
  if: ["the condition, what has to happen first", "条件，也就是必须先发生的事"],
  unless: ["the condition that would stop the main part", "会让主句不发生的条件"],
};

/** subordinatedNot explains a dependent clause put before the wrong part, or one that opens without its comma. */
export const subordinatedNot: WhyNot = (wrong, right) => {
  const word = conjunctionOf(` ${right}`, Object.keys(roles));
  const [en, zh] = roles[word] ?? unexplained(wrong, right);
  const clause = clauseAfter(right, word);
  const main = right.slice(0, right.toLowerCase().indexOf(` ${word} `));
  const opening = `${word.charAt(0).toUpperCase()}${word.slice(1)} ${clause}, ${main.charAt(0).toLowerCase()}${main.slice(1)}.`;
  if (marksOf(wrong, opening)?.missing.some(([, mark]) => mark === ",")) {
    return t(
      `When the sentence opens with the *${word}* clause, a comma marks where that clause ends and the main part begins.`,
      `句子以 *${word}* 从句开头时，要用逗号标出从句在哪里结束、主句从哪里开始。`,
    );
  }
  if (reordered(wrong, right)) {
    const after = clauseAfter(wrong, word);
    return t(
      `This puts *${word}* in front of *${after}*, which changes what the sentence says. *${word}* opens ${en}.`,
      `这样 *${word}* 放到了 *${after}* 前面，句子的意思就变了。*${word}* 引出的是${zh}。`,
    );
  }
  return unexplained(wrong, right);
};

/** periodFixNot explains a run-on left as it was, joined by a comma, or split without a capital. */
export const periodFixNot: WhyNot = (wrong, right, shown) => {
  if (wrong.trim() === shown.trim()) {
    return t(
      "That is the run-on as given: two complete sentences still run into each other. End the first one where its thought ends.",
      "这是原来的连写句：两个完整的句子还连在一起。要在第一个意思结束的地方把句子断开。",
    );
  }
  const m = marksOf(wrong, right);
  if (!m) return unexplained(wrong, right);
  if (m.extra.some(([, mark]) => mark === ",")) {
    return t(
      "A comma alone cannot hold two complete sentences together: this is still a run-on, called a comma splice. End the first sentence with a full stop instead.",
      "只用逗号不能把两个完整的句子连在一起：这仍然是连写句（逗号粘连）。要用句号结束第一个句子。",
    );
  }
  const [word] = m.lowered;
  if (word) {
    return t(
      `The full stop is in the right place, but the new sentence after it starts with a small *${word}*. Every sentence starts with a capital letter.`,
      `句号的位置对了，但它后面的新句子以小写的 *${word}* 开头。每个句子都要以大写字母开头。`,
    );
  }
  return unexplained(wrong, right);
};

/** conjunctionFixNot explains a run-on left as it was or joined without the comma before the conjunction. */
export const conjunctionFixNot: WhyNot = (wrong, right, shown) => {
  const word = conjunctionOf(right, coordinators);
  if (wrong.trim() === shown.trim()) {
    return t(
      `That is the run-on as given: the two sentences still run together. Join them with *${word}*.`,
      `这是原来的连写句：两个句子还连在一起。要用 *${word}* 把它们连起来。`,
    );
  }
  const m = marksOf(wrong, right);
  if (m?.missing.some(([, mark]) => mark === ",")) {
    return t(
      `*${word}* is there now, but two complete sentences joined by *${word}* also need a comma before it.`,
      `现在有了 *${word}*，但用 *${word}* 连接两个完整的句子时，它前面还要加逗号。`,
    );
  }
  return unexplained(wrong, right);
};

/** identifyingNot explains a clause that names which one is meant but is moved, set off by commas, or keeps the old pronoun. */
export const identifyingNot: WhyNot = (wrong, right) => {
  if (reordered(wrong, right)) {
    return t(
      `The clause now comes after *${lastWord(wrong.split(/\s(?:who|that|which)\s/u)[0] ?? "")}*, away from the noun it describes, so it seems to describe the wrong thing. A clause like this goes right after its noun.`,
      `从句现在放到了 *${lastWord(wrong.split(/\s(?:who|that|which)\s/u)[0] ?? "")}* 后面，离它修饰的名词太远，看起来像在修饰别的东西。这种从句要紧跟在它修饰的名词后面。`,
    );
  }
  const m = marksOf(wrong, right);
  if (m?.extra.some(([, mark]) => mark === ",")) {
    return t(
      "Commas would make the clause extra information that could be left out. Here it tells which one is meant, so it takes no commas.",
      "加了逗号，从句就成了可以省略的附加信息。这里的从句说明的是“哪一个”，所以不加逗号。",
    );
  }
  const span = spanOf(wrong, right);
  if (span.right === "" && span.wrong !== "") {
    return t(
      `*${span.wrong}* repeats what the clause is about: the relative word already stands for it, so the old pronoun has to go.`,
      `*${span.wrong}* 重复了从句所指的对象：关系词已经代替了它，原来的代词要删掉。`,
    );
  }
  return unexplained(wrong, right);
};

/** addingNot explains a clause of extra information left without its commas or opened by *that*. */
export const addingNot: WhyNot = (wrong, right) => {
  if (/,\s*who\s/iu.test(wrong) && /,\s*which\s/iu.test(right)) {
    return t(
      "*who* is for people. The clause adds information about a thing, so it takes *which*.",
      "*who* 用于指人。这个从句补充的是关于事物的信息，要用 *which*。",
    );
  }
  if (/,\s*which\s/iu.test(wrong) && /,\s*who\s/iu.test(right)) {
    return t(
      "*which* is for things and animals. The clause adds information about a person, so it takes *who*.",
      "*which* 用于指物或动物。这个从句补充的是关于人的信息，要用 *who*。",
    );
  }
  if (/,\s*that\s/iu.test(wrong)) {
    return t(
      "*that* never opens a clause set off by commas. A clause that only adds information takes *which* for things and *who* for people.",
      "*that* 不能引导用逗号隔开的从句。只补充信息的从句，指物用 *which*，指人用 *who*。",
    );
  }
  const m = marksOf(wrong, right);
  if (m?.missing.some(([, mark]) => mark === ",")) {
    return t(
      "The clause only adds information about something already clear, so it is set off by a comma on each side, like a remark in brackets.",
      "这个从句只是给已经明确的事物补充信息，所以两边都要用逗号隔开，就像放在括号里的补充说明。",
    );
  }
  const span = spanOf(wrong, right);
  if (span.right === "" && span.wrong !== "") {
    return t(
      `*${span.wrong}* repeats what the clause is about: *which* or *who* already stands for it, so the old pronoun has to go.`,
      `*${span.wrong}* 重复了从句所指的对象：*which* 或 *who* 已经代替了它，原来的代词要删掉。`,
    );
  }
  return unexplained(wrong, right);
};

/** appositiveNot explains an appositive inside a sentence that lacks a comma or is still a sentence of its own. */
export const appositiveNot: WhyNot = (wrong, right) => {
  const m = marksOf(wrong, right);
  if (m) {
    const missing = m.missing.filter(([, mark]) => mark === ",").length;
    return missing >= 2
      ? t(
          "The phrase that renames the noun is set off by commas, one before it and one after it. Without them the names run together.",
          "给名词换个说法的短语要用逗号隔开，前面一个、后面一个。没有逗号，几个名称就挤在了一起。",
        )
      : t(
          "The comma that opens the phrase is there, but its closing comma is missing, so the phrase runs into the rest of the sentence.",
          "短语前面的逗号有了，但后面的逗号漏了，短语就和句子后半部分连在了一起。",
        );
  }
  const span = spanOf(wrong, right);
  if (span.right === "" && span.wrong !== "") {
    return t(
      `*${span.wrong}* turns the phrase back into a sentence of its own. An appositive is only the naming phrase, without a subject and verb.`,
      `*${span.wrong}* 让这个短语又变回了一个句子。同位语只是一个名称短语，不带主语和动词。`,
    );
  }
  return unexplained(wrong, right);
};

/** appositiveEndNot explains an appositive at the end that lacks its comma or is joined as a whole sentence. */
export const appositiveEndNot: WhyNot = (wrong, right) => {
  const m = marksOf(wrong, right);
  if (m?.missing.some(([, mark]) => mark === ",")) {
    return t(
      "The phrase that renames the noun needs a comma before it, even at the end of the sentence.",
      "给名词换个说法的短语，即使在句末，前面也要加逗号。",
    );
  }
  const span = spanOf(wrong, right);
  if (span.right === "" && span.wrong !== "") {
    return t(
      `With *${span.wrong}*, the part after the comma is a whole sentence, so the comma joins two sentences: a run-on. Keep only the naming phrase.`,
      `加了 *${span.wrong}*，逗号后面就是一个完整的句子，逗号连接了两个句子，成了连写句。只保留名称短语。`,
    );
  }
  return unexplained(wrong, right);
};

/** openingPhraseNot explains a sentence moved to open with a phrase whose comma or capitals are misplaced. */
export const openingPhraseNot: WhyNot = (wrong, right) => {
  const m = marksOf(wrong, right);
  if (!m) return unexplained(wrong, right);
  const parts: Text[] = [];
  const first = wrong.trim().split(/\s+/u)[0] ?? "";
  if (m.lowered.includes(first)) parts.push(startsSmall(first));
  for (const w of m.raised) {
    parts.push(
      t(`*${w}* comes after the comma, in the middle of the sentence, so it stays small.`, `*${w}* 在逗号后面，处在句子中间，要小写。`),
    );
  }
  const comma = m.extra.find(([, mark]) => mark === ",");
  if (comma) {
    const word = comma[0].replace(/,$/u, "");
    parts.push(
      t(
        `The comma after *${word}* splits the main part of the sentence. It belongs where the opening phrase ends.`,
        `*${word}* 后面的逗号把句子的主干拆开了。逗号应放在开头短语结束的地方。`,
      ),
    );
  }
  return parts.length > 0 ? joinTexts(parts) : unexplained(wrong, right);
};

/** participleNot explains an opening participle phrase without its comma or followed by the wrong doer. */
export const participleNot: WhyNot = (wrong, right) => {
  const m = marksOf(wrong, right);
  if (m) {
    const parts: Text[] = [];
    if (m.missing.some(([, mark]) => mark === ",")) {
      parts.push(
        t(
          "The opening *-ing* phrase needs a comma after it, to show where the main sentence begins.",
          "开头的 *-ing* 短语后面要加逗号，标出主句从哪里开始。",
        ),
      );
    }
    for (const w of m.raised) {
      parts.push(t(`*${w}* comes after the comma, so it stays small.`, `*${w}* 在逗号后面，要小写。`));
    }
    if (m.missing.some(([, mark]) => mark === "."))
      parts.push(parts.length > 0 ? endless : t("The sentence has no end mark.", "句末没有句号。"));
    return parts.length > 0 ? joinTexts(parts) : unexplained(wrong, right);
  }
  const [phrase = "", rest = ""] = wrong.split(/,\s*/u);
  if (rest === "") return unexplained(wrong, right);
  return t(
    `The words after the comma, *${rest.replace(/\.$/u, "")}*, do not start with the one who was ${phrase.charAt(0).toLowerCase()}${phrase.slice(1)}, so the sentence now says something else did it. The doer of the opening action comes right after the comma.`,
    `逗号后面的 *${rest.replace(/\.$/u, "")}* 开头不是做 *${phrase}* 这个动作的人，句子就变成了别的东西在做这件事。开头动作的执行者要紧跟在逗号后面。`,
  );
};

/** activeNot explains an active sentence with the roles swapped, a past participle for the past, or a passive kept. */
export const activeNot: WhyNot = (wrong, right) => {
  if (/\s(?:was|were)\s/u.test(` ${wrong} `)) {
    return / by /u.test(wrong)
      ? t(
          "This is still passive, and it also swaps the roles: the one after *by* in the given sentence is the doer, and in the active sentence the doer comes first as the subject.",
          "这仍然是被动语态，而且角色也换反了：原句中 *by* 后面的才是动作的执行者，主动句要把执行者放在最前面作主语。",
        )
      : t(
          "*was*/*were* belongs to the passive. In the active sentence the doer takes the verb in the simple past, without a helper.",
          "*was*/*were* 是被动语态才用的。主动句中，执行者后面直接用一般过去时的动词，不要助动词。",
        );
  }
  if (reordered(wrong, right)) {
    return t(
      "This turns the roles around: what was acted on in the given sentence is now doing the action. The doer is the one after *by*, and it comes first in the active sentence.",
      "这样角色颠倒了：原句中承受动作的一方现在成了动作的执行者。执行者是 *by* 后面的那个，在主动句中要放在最前面。",
    );
  }
  const span = spanOf(wrong, right);
  if (span.wrong.split(/\s+/u).length === 1 && span.right.split(/\s+/u).length === 1) {
    return t(
      `*${span.wrong}* is the past participle, which needs a helper such as *has* or *was*. Standing alone as the verb of an active sentence, it has to be the simple past.`,
      `*${span.wrong}* 是过去分词，要和 *has*、*was* 这样的助动词连用。在主动句里单独作谓语，要用一般过去时。`,
    );
  }
  return unexplained(wrong, right);
};
