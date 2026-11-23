// How the drills of classical language teach (docs/chinese-curriculum.md §7). Every solution goes in steps and ends
// with a check that reads the whole sentence in modern Chinese or against the original, and every wrong option is
// answered with its own reason. Three kinds of knowledge point share this: the meaning of a word in brackets, the usage
// of a function word or a kind of sentence, and the translation of a whole sentence.

import { type Text, t } from "@ga/content";
import type { WhyNot } from "@ga/subject-chinese";

import { type DrillItem, type DrillPoint, drillItem } from "../grammar/drill.ts";

/** nested turns the quotation marks of a text into inner ones, for it to be quoted in turn. */
const nested = (text: string): string => text.replaceAll("“", "‘").replaceAll("”", "’");

/** cap starts a text with a capital letter. */
const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

/** BRACKETED is a shown sentence with the word asked about in brackets after it. */
const BRACKETED = /^(.*)（(.+)）$/u;

/** split takes a shown sentence apart into the sentence and the word in brackets after it, if any. */
function split(shown: string): readonly [string, string] {
  const m = BRACKETED.exec(shown);
  return m ? [m[1]!, m[2]!] : [shown, ""];
}

/** fields splits a line of data at ` | `, trimming each field. */
const fields = (line: string): readonly string[] => line.split(" | ").map((f) => f.trim());

/** rows are the trimmed lines of data that are not empty. */
const rows = (data: string): readonly string[] =>
  data
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

/** PointText is what every knowledge point of a drill says: its id suffix, title, explanation and question. */
export interface PointText {
  readonly suffix: string;
  readonly title: Text;
  readonly explanation: Text;
  readonly question: Text;
}

/** Usage is one usage of a word or one kind of sentence: its name as the options give it, how to tell it, and an example. */
export interface Usage {
  readonly name: string;
  /** cue says how the usage is told in a sentence, as a clause without a full stop; the English starts in lower case. */
  readonly cue: Text;
  /** example is a sentence that shows the usage, for a usage no item of the bank has. */
  readonly example?: string;
}

/** usage builds a Usage from its name, its cue in Chinese and in English, and an example where the bank has none. */
export const usage = (name: string, zh: string, en: string, example?: string): Usage => ({
  name,
  cue: t(en, zh),
  ...(example !== undefined && { example }),
});

/** STOPS are the marks that end a clause. */
const STOPS = new Set([..."，。；：！？、“”"]);

/** place says where a word stands in its clause: what comes before it and after it. */
function place(sentence: string, word: string): Text {
  const chars = [...sentence];
  const w = [...word];
  const at = chars.findIndex((_, i) => w.every((c, j) => chars[i + j] === c));
  if (at < 0) throw new Error(`classical drill: no ${word} in ${sentence}`);
  let start = at;
  while (start > 0 && !STOPS.has(chars[start - 1]!)) start--;
  let end = at + w.length;
  while (end < chars.length && !STOPS.has(chars[end]!)) end++;
  const before = chars.slice(start, at).join("");
  const after = chars.slice(at + w.length, end).join("");
  if (before && after) return t(`${word} comes after ${before} and before ${after}.`, `“${word}”前面是“${before}”，后面是“${after}”。`);
  if (before) return t(`${word} comes after ${before} and ends the clause.`, `“${word}”跟在“${before}”后面，在这一分句的末尾。`);
  if (after) return t(`${word} opens the clause, before ${after}.`, `“${word}”在这一分句的开头，后面是“${after}”。`);
  return t(`${word} stands alone.`, `“${word}”单独成句。`);
}

/** Note is what a solution needs of an item beyond its options: the sentence in modern Chinese and, where given, a clue. */
interface Note {
  readonly reading: string;
  readonly clue?: Text;
}

/** UsageSpec is a knowledge point on the usages of a word, or on kinds of sentence when the items have no word in brackets. */
export interface UsageSpec extends PointText {
  readonly usages: readonly Usage[];
  /**
   * data holds a line an item: the shown sentence, the number of its usage, the sentence in modern Chinese and, where
   * the place of the word does not settle the usage, or the item has no word in brackets, a clue in Chinese and English.
   */
  readonly data: string;
}

/**
 * usagePoint builds a knowledge point on usages. The solution finds where the word stands, or what marks the sentence,
 * matches that with a usage, and checks it by reading the whole sentence in modern Chinese beside another sentence of
 * the same usage; each other option is answered with how its own usage is told and a sentence that shows it.
 */
export function usagePoint(spec: UsageSpec): DrillPoint {
  const names = spec.usages.map((u) => u.name);
  if (new Set(names).size !== 4) throw new Error(`classical drill ${spec.suffix}: four usages needed`);
  const notes = new Map<string, Note>();
  const usageOf = new Map<string, number>();
  const items: DrillItem[] = rows(spec.data).map((line) => {
    const f = fields(line);
    if (f.length !== 3 && f.length !== 5) throw new Error(`classical drill: ${line}`);
    const [shown, n, reading, zh, en] = f as [string, string, string, string?, string?];
    const u = Number(n);
    const right = names[u];
    if (right === undefined) throw new Error(`classical drill: usage ${n} of ${shown}`);
    if (notes.has(shown)) throw new Error(`classical drill: ${shown} twice`);
    const [, word] = split(shown);
    if (!word && zh === undefined) throw new Error(`classical drill: ${shown} needs a clue`);
    notes.set(shown, { reading, ...(zh !== undefined && en !== undefined && { clue: t(en, zh) }) });
    usageOf.set(shown, u);
    return drillItem(shown, right, names.filter((x) => x !== right) as unknown as [string, string, string]);
  });
  /** shownOf is a sentence of the given usage other than the one excepted: of the bank, or the usage's example. */
  const shownOf = (u: number, except = ""): string | undefined => {
    const own = items.find((i) => usageOf.get(i.shown) === u && i.shown !== except);
    return own ? split(own.shown)[0] : spec.usages[u]!.example;
  };
  spec.usages.forEach((u, i) => {
    if (shownOf(i) === undefined) throw new Error(`classical drill: ${u.name} has no example`);
  });
  const why = (right: string, shown: string): Text => {
    const note = notes.get(shown)!;
    const [sentence, word] = split(shown);
    const i = names.indexOf(right);
    const u = spec.usages[i]!;
    const where = word ? place(sentence, word) : undefined;
    const clue = (l: "en" | "zh-CN") => [where?.[l], note.clue?.[l]].filter((x) => x !== undefined).join(l === "en" ? " " : "");
    const likeItem = items.find((x) => usageOf.get(x.shown) === i && x.shown !== shown);
    const [like, likeWord] = likeItem ? split(likeItem.shown) : [u.example, word];
    const analogue = like !== undefined && like !== sentence ? like : undefined;
    const sameWord = likeWord === word;
    const head = word
      ? t(`**Step 1: see where ${word} stands.**`, `**第一步：看“${word}”在句中的位置。**`)
      : t("**Step 1: find what marks the sentence.**", "**第一步：找出句子的标志。**");
    const step2 = word
      ? t(
          `**Step 2: match it with a usage.** ${cap(u.cue.en)}. That is how ${word} works here, so it is: ${right}.`,
          `**第二步：对照用法。**${u.cue["zh-CN"]}。这里正是这样，所以“${word}”是：${right}。`,
        )
      : t(
          `**Step 2: match it with a kind.** ${cap(u.cue.en)}. That is what this sentence does, so it is: ${right}.`,
          `**第二步：对照句式。**${u.cue["zh-CN"]}。这句正是这样，所以是${right}。`,
        );
    const check = word
      ? t(
          `**Check.** Put the whole sentence into modern Chinese: “${note.reading}”. Taken this way, ${word} makes the sentence read smoothly${analogue ? `, just as in ${analogue}, where ${sameWord ? word : likeWord} is used the same way` : ""}.`,
          `**检验。** 把整句译成现代汉语：“${nested(note.reading)}”。这样理解“${word}”，句子通顺${analogue ? `；“${analogue}”中的“${sameWord ? word : likeWord}”也是这样用的，可以对照` : ""}。`,
        )
      : t(
          `**Check.** Put the whole sentence into modern Chinese, in the order modern Chinese needs: “${note.reading}”. Read so, it says just what the original does${analogue ? `, and ${analogue} is a sentence of the same kind` : ""}.`,
          `**检验。** 按现代汉语的说法把整句译出来：“${nested(note.reading)}”，意思和原句完全一致${analogue ? `；“${analogue}”也是同一种句式，可以对照` : ""}。`,
        );
    return t(
      `${head.en} ${clue("en")}\n\n${step2.en}\n\n${check.en}`,
      `${head["zh-CN"]}${clue("zh-CN")}\n\n${step2["zh-CN"]}\n\n${check["zh-CN"]}`,
    );
  };
  const whyNot: WhyNot = (wrong, _right, shown) => {
    const [, word] = split(shown);
    const i = names.indexOf(wrong);
    const u = spec.usages[i]!;
    const ex = shownOf(i)!;
    return word
      ? t(
          `Not ${wrong}: ${u.cue.en}, as in ${ex}; ${word} in this sentence is not used so.`,
          `不是“${nested(wrong)}”：${u.cue["zh-CN"]}，如“${ex}”；本句的“${word}”不是这样用的。`,
        )
      : t(`Not ${wrong}: ${u.cue.en}, as in ${ex}; this sentence does not.`, `不是${wrong}：${u.cue["zh-CN"]}，如“${ex}”；这句不是这样。`);
  };
  return {
    suffix: spec.suffix,
    title: spec.title,
    explanation: spec.explanation,
    question: spec.question,
    items,
    why,
    whyNot,
  };
}

/** WordSpec is a knowledge point on what a word in brackets means. */
export interface WordSpec extends PointText {
  /**
   * kind says what the wrong options are: meanings of today (content), the character's own meanings where it stands
   * for another (borrowed), or, for words changed since, today's meaning first and then others (changed).
   */
  readonly kind: "content" | "borrowed" | "changed";
  /** data holds a line an item: the shown sentence, the right meaning, three wrong ones, the sentence in modern Chinese, and a clue in Chinese and English. */
  readonly data: string;
}

/** standsFor is the character a borrowed one stands for, from a meaning written 同“X”. */
const standsFor = (meaning: string): string | undefined => /^同“(.+?)”/u.exec(meaning)?.[1];

/**
 * wordPoint builds a knowledge point on the meaning of a word in brackets. The solution reads what the sentence needs,
 * chooses the meaning that gives it, and checks it by putting the meaning back and reading the sentence in modern
 * Chinese; each other option is answered by what it is: today's meaning, the character's own, or a meaning that does
 * not fit the sentence.
 */
export function wordPoint(spec: WordSpec): DrillPoint {
  const notes = new Map<string, Note>();
  const items: DrillItem[] = rows(spec.data).map((line) => {
    const f = fields(line);
    if (f.length !== 8) throw new Error(`classical drill: ${line}`);
    const [shown, right, a, b, c, reading, zh, en] = f as [string, string, string, string, string, string, string, string];
    if (notes.has(shown)) throw new Error(`classical drill: ${shown} twice`);
    if (spec.kind === "borrowed" && standsFor(right) === undefined) throw new Error(`classical drill: ${shown} is not borrowed`);
    notes.set(shown, { reading, clue: t(en, zh) });
    return drillItem(shown, right, [a, b, c]);
  });
  const wrongOf = new Map(items.map((i) => [i.shown, i.wrong]));
  /** today says whether a wrong option is a meaning the word has in today's words. */
  const today = (wrong: string, shown: string): boolean => {
    const [, word] = split(shown);
    if (standsFor(wrong) !== undefined) return false;
    if (spec.kind === "changed") return wrongOf.get(shown)?.[0] === wrong;
    return [...word].some((ch) => wrong.includes(ch));
  };
  const why = (right: string, shown: string): Text => {
    const note = notes.get(shown)!;
    const [, word] = split(shown);
    const modern = (wrongOf.get(shown) ?? []).filter((w) => today(w, shown));
    const borrowed = standsFor(right);
    const more =
      spec.kind === "borrowed" && borrowed
        ? t(
            ` ${word} stands here for ${borrowed}, a character that sounded like it; its own meanings do not fit.`,
            `这里的“${word}”是借来代替读音相近的“${borrowed}”的，它本来的意思放在句中都讲不通。`,
          )
        : spec.kind === "changed" && modern[0]
          ? t(
              ` Today ${word} means ${modern[0]}, which is not what it meant then.`,
              `今天“${word}”是“${modern[0]}”的意思，古时候不是这样。`,
            )
          : modern.length > 0
            ? t(
                ` Its meanings in today's words, such as ${modern.join(", ")}, do not fit here.`,
                `它在今天词语里的意思，如${modern.map((m) => `“${m}”`).join("")}，放在这里都不合适。`,
              )
            : t("", "");
    return t(
      `**Step 1: see what the sentence needs.** ${note.clue!.en}\n\n**Step 2: choose the meaning that fits.** So ${word} here is: ${right}.${more.en}\n\n**Check.** Put the meaning back into the sentence and read it in modern Chinese: “${note.reading}”. It reads smoothly and says what the original does.`,
      `**第一步：看句子需要什么意思。**${note.clue!["zh-CN"]}\n\n**第二步：选出合乎句意的解释。**所以“${word}”在这里是：${right}。${more["zh-CN"]}\n\n**检验。** 把这个意思代回原句，译成现代汉语：“${nested(note.reading)}”，句子通顺，和原句的意思一致。`,
    );
  };
  const whyNot: WhyNot = (wrong, _right, shown) => {
    const [sentence, word] = split(shown);
    const other = standsFor(wrong);
    if (other !== undefined) {
      return t(
        `${wrong} takes ${word} to stand for ${other}, but ${other} makes no sense in ${sentence}.`,
        `“${nested(wrong)}”是把“${word}”当作“${other}”的通假字，可“${other}”放进“${sentence}”讲不通。`,
      );
    }
    if (spec.kind === "borrowed") {
      return t(
        `${wrong} is a meaning ${word} has of its own, and it makes no sense in ${sentence}: here ${word} stands for a character that sounds like it.`,
        `“${wrong}”是“${word}”本来的意思，放进“${sentence}”讲不通：这里的“${word}”是借来代替一个读音相近的字的。`,
      );
    }
    if (today(wrong, shown)) {
      return t(
        `${wrong} is what ${word} means in today's words, and it does not fit ${sentence}: a classical word often meant something else.`,
        `“${wrong}”是“${word}”在今天的词语里的意思，放进“${sentence}”讲不通；文言词的意思常和今天不同。`,
      );
    }
    return t(
      `${wrong} does not fit ${sentence}: put in its place, the sentence no longer hangs together.`,
      `“${wrong}”放进“${sentence}”，句子前后意思接不上。`,
    );
  };
  return { suffix: spec.suffix, title: spec.title, explanation: spec.explanation, question: spec.question, items, why, whyNot };
}

/** SentenceSpec is a knowledge point on putting a whole sentence into modern Chinese. */
export interface SentenceSpec extends PointText {
  /**
   * data holds blocks separated by blank lines: the shown sentence; `= right`; `* key words`, each word with its
   * meaning; `- wrong | reason in Chinese | reason in English` for each of three wrong translations; and optionally
   * `% check in Chinese | check in English`, where the clauses of the sentence and its translation do not pair off;
   * or `~ part / part`, the parts of the sentence that pair off with the clauses of the translation.
   */
  readonly data: string;
}

/** clauses splits a sentence into its clauses. */
const clauses = (s: string): readonly string[] =>
  s
    .split(/[，。；：！？]/u)
    .map((c) => c.trim())
    .filter((c) => c !== "");

/** Translation is what a solution needs of a sentence item: its key words, its check and the reason for each wrong option. */
interface Translation {
  readonly keys: string;
  readonly check: Text;
  readonly reasons: ReadonlyMap<string, Text>;
}

/**
 * sentencePoint builds a knowledge point on translation. The solution pins down the key words, chooses the translation
 * that keeps them all in order, and checks it against the original clause by clause; each wrong translation is answered
 * with the word it mistakes or what it adds or leaves out.
 */
export function sentencePoint(spec: SentenceSpec): DrillPoint {
  const notes = new Map<string, Translation>();
  const items: DrillItem[] = spec.data
    .trim()
    .split(/\n\s*\n/u)
    .map((block) => {
      const [shown, ...rest] = rows(block);
      if (!shown) throw new Error("classical drill: an empty block");
      const right = rest
        .find((r) => r.startsWith("="))
        ?.slice(1)
        .trim();
      const keys = rest
        .find((r) => r.startsWith("*"))
        ?.slice(1)
        .trim();
      const wrong = rest.filter((r) => r.startsWith("-")).map((r) => fields(r.slice(1)));
      const own = rest.find((r) => r.startsWith("%"));
      const segments = rest.find((r) => r.startsWith("~"));
      if (!right || !keys || wrong.length !== 3 || wrong.some((w) => w.length !== 3)) throw new Error(`classical drill: ${shown}`);
      let check: Text;
      if (own) {
        const [zh, en] = fields(own.slice(1));
        if (!zh || !en) throw new Error(`classical drill: the check of ${shown}`);
        check = t(en, zh);
      } else {
        const a = segments
          ? segments
              .slice(1)
              .split("/")
              .map((x) => x.trim())
          : clauses(shown);
        if (segments && a.join("") !== clauses(shown).join("")) throw new Error(`classical drill: the segments of ${shown}`);
        const b = clauses(right);
        if (a.length !== b.length) throw new Error(`classical drill: the clauses of ${shown} and ${right} do not pair off`);
        check = t(
          `Read it back against the original, clause by clause: ${a.map((c, i) => `${c} is “${b[i]}”`).join("; ")}. Every part of the original has its rendering, and nothing is added.`,
          `回到原文，逐句对照：${a.map((c, i) => `“${c}”——“${nested(b[i]!)}”`).join("；")}。原文每一部分都有着落，译文也没有多出原文没有的意思。`,
        );
      }
      notes.set(shown, { keys, check, reasons: new Map(wrong.map(([w, zh, en]) => [w!, t(en!, zh!)])) });
      return drillItem(shown, right, [wrong[0]![0]!, wrong[1]![0]!, wrong[2]![0]!]);
    });
  const why = (right: string, shown: string): Text => {
    const note = notes.get(shown)!;
    return t(
      `**Step 1: pin down the key words.** ${note.keys}.\n\n**Step 2: choose the translation that keeps them all.** Only “${right}” gives each of these words its meaning in the sentence, keeps the order of the original, and adds nothing it does not say.\n\n**Check.** ${note.check.en}`,
      `**第一步：落实关键词。**${note.keys}。\n\n**第二步：选出字字落实的译文。**只有“${nested(right)}”把这几个词在句中的意思都译了出来，语序和原文一致，也没有添上原文没有的内容。\n\n**检验。** ${note.check["zh-CN"]}`,
    );
  };
  const whyNot: WhyNot = (wrong, _right, shown) => {
    const reason = notes.get(shown)?.reasons.get(wrong);
    if (!reason) throw new Error(`classical drill: no reason for ${wrong}`);
    const end = (x: string, stop: string) => (/[.。!！?？]$/u.test(x) ? x : `${x}${stop}`);
    return t(`${wrong}: ${end(reason.en, ".")}`, `“${nested(wrong)}”：${end(reason["zh-CN"], "。")}`);
  };
  return { suffix: spec.suffix, title: spec.title, explanation: spec.explanation, question: spec.question, items, why, whyNot };
}

/** listOf lists the usages of a word with how each is told, in one locale. */
const listOf = (usages: readonly Usage[], locale: "en" | "zh-CN"): string =>
  usages.map((u) => (locale === "en" ? `- ${u.name}: ${u.cue.en}` : `- ${u.name}：${u.cue["zh-CN"]}`)).join("\n");

/**
 * explained writes an explanation: what the point is about, the usages it tells apart with their cues where given, one
 * instance walked through, and the callout on the mistake the wrong options record.
 */
export function explained(opening: Text, usages: readonly (readonly Usage[])[], walk: Text, watch: Text): Text {
  const lists = (l: "en" | "zh-CN") => usages.map((u) => `\n\n${listOf(u, l)}`).join("");
  return t(
    `${opening.en}${lists("en")}\n\n${walk.en}\n\n> **Watch out.** ${watch.en}`,
    `${opening["zh-CN"]}${lists("zh-CN")}\n\n${walk["zh-CN"]}\n\n> **注意。** ${watch["zh-CN"]}`,
  );
}

/** Part is the usages of one word of a knowledge point that tells several words apart, and the lines of its items. */
export interface Part {
  readonly usages: readonly Usage[];
  readonly data: string;
}

/**
 * usagesPoint builds a knowledge point on the usages of several words, such as 而, 以 and 于: each item is asked among
 * the usages of its own word and solved as usagePoint solves it.
 */
export function usagesPoint(text: PointText, parts: readonly Part[]): DrillPoint {
  const points = parts.map((p) => usagePoint({ ...text, usages: p.usages, data: p.data }));
  const owner = new Map<string, DrillPoint>();
  for (const p of points) {
    for (const i of p.items) {
      if (owner.has(i.shown)) throw new Error(`classical drill: ${i.shown} twice`);
      owner.set(i.shown, p);
    }
  }
  const of = (shown: string): DrillPoint => {
    const p = owner.get(shown);
    if (!p) throw new Error(`classical drill: no item ${shown}`);
    return p;
  };
  return {
    ...text,
    items: points.flatMap((p) => p.items),
    why: (right, shown) => of(shown).why(right, shown),
    whyNot: (wrong, right, shown) => of(shown).whyNot!(wrong, right, shown),
  };
}
