// The reasons of the level grammar (docs/chinese-curriculum.md §6, §8.4): what is wrong with a wrong option, found by
// comparing it, word by word, with the right one. The two differ in one place: a word in the wrong place, a word whose
// characters come apart, a word added or left out, or one word put for another. A reason names the rule the wrong one
// breaks: where a word of its kind stands (grammar-usage.ts), what the word put in does and what the sentence needs, or a
// reason written for that pair (grammar-pairs.ts).

import { type Text, t } from "@ga/content";

import type { LevelOneCharacter } from "./characters.ts";
import { pairReasons } from "./grammar-pairs.ts";
import { usage, type WordClass } from "./grammar-usage.ts";

/** Glossary is what the reasons know of the words and characters taught by a unit. */
export interface Glossary {
  /** meanings are the meanings of the taught words, by word. */
  readonly meanings: ReadonlyMap<string, Text>;
  /** characters are the taught characters, by character. */
  readonly characters: ReadonlyMap<string, LevelOneCharacter>;
  /** order is the rule of order the topic teaches, said where no rule of a word's kind explains a place. */
  readonly order?: Text;
}

/** MARK is a punctuation mark, a word of its own. */
const MARK = /^[，。？！：“”、…；]$/u;

/** LONGEST is the longest word the reasons look for. */
const LONGEST = 6;

/** APART are taught words whose characters the grammar sentences mostly use as two words: 只有…才能 is 才 and 能. */
const APART: ReadonlySet<string> = new Set(["才能"]);

/** isWord says whether a text is a taught word or a grammar word. */
const isWord = (s: string, glossary: Glossary): boolean => !APART.has(s) && (glossary.meanings.has(s) || usage.has(s));

/** wordsOf splits a sentence into words, taking the longest taught word at each place. */
export function wordsOf(sentence: string, glossary: Glossary): readonly string[] {
  const chars = [...sentence];
  const out: string[] = [];
  let i = 0;
  while (i < chars.length) {
    let n = Math.min(LONGEST, chars.length - i);
    while (n > 1 && !isWord(chars.slice(i, i + n).join(""), glossary)) n--;
    out.push(chars.slice(i, i + n).join(""));
    i += n;
  }
  return out;
}

/** Difference is where a wrong text leaves the right one, in words: the right and the wrong words between those they share. */
export interface Difference {
  readonly right: readonly string[];
  readonly wrong: readonly string[];
  /** whole are all the words of the right text; at is where the difference starts in it. */
  readonly whole: readonly string[];
  readonly at: number;
}

/** differenceOf finds the one place where a wrong text leaves the right one. */
export function differenceOf(right: string, wrong: string, glossary: Glossary): Difference {
  const r = wordsOf(right, glossary);
  const w = wordsOf(wrong, glossary);
  let p = 0;
  while (p < r.length && p < w.length && r[p] === w[p]) p++;
  let s = 0;
  while (s < r.length - p && s < w.length - p && r[r.length - 1 - s] === w[w.length - 1 - s]) s++;
  return { right: r.slice(p, r.length - s), wrong: w.slice(p, w.length - s), whole: r, at: p };
}

const sorted = (s: string): string => [...s].sort().join("");
const joined = (words: readonly string[]): string => words.join("");

/** kindOf names how a wrong text differs from the right one, for grouping the mistakes of a knowledge point. */
export function kindOf(d: Difference): string {
  const r = joined(d.right);
  const w = joined(d.wrong);
  if (sorted(r) === sorted(w)) return `order ${r}`;
  if (w === "") return `drops ${r}`;
  if (r === "") return `adds ${w}`;
  return `${r} ${w}`;
}

/** q quotes Chinese in a Chinese sentence. */
const q = (s: string): string => `“${s}”`;

/** TIME matches the time words: days, hours, dates and the like. */
const TIME =
  /^(今天|明天|昨天|后天|前天|今年|明年|去年|现在|刚才|以前|以后|早上|上午|中午|下午|晚上|每天|星期.|周末|.+[点号月]|.+分钟?|.+年|.+时候)$/u;

/** DATE is a word or a part of a word that tells a date or a time of day: a time word, a unit or a number. */
const DATE = /^(星期.?|[点号月年分刻半零一二两三四五六七八九十百千几]+|.+[点号月年分刻]|.+分钟)$/u;

/** inDate says whether a piece belongs to a date or a time of day told by its neighbors, whose order the topic's rule
 * gives better than a rule for one word. */
function inDate(piece: readonly string[], start: number, whole: readonly string[]): boolean {
  const near = [...whole.slice(Math.max(0, start - 2), start), ...whole.slice(start + piece.length, start + piece.length + 2)];
  const timely = (w: string) => DATE.test(w) || TIME.test(w);
  return piece.some(timely) && near.some(timely);
}

/** classOf is the kind of a word: a grammar word's class, or a time word. */
function classOf(word: string): WordClass | "time" | undefined {
  return usage.get(word)?.kind ?? (TIME.test(word) ? "time" : undefined);
}

/** CLASS_NAMES name the kinds of words in a reason. */
const CLASS_NAMES: Readonly<Record<WordClass | "time", Text>> = {
  neg: t("a word of negation", "否定词"),
  aspect: t("an aspect word after a verb", "用在动词后的动态助词"),
  struct: t("a structural word", "结构助词"),
  end: t("a word that ends a sentence", "句末语气词"),
  verb: t("a verb", "动词"),
  adv: t("an adverb", "副词"),
  prep: t("a preposition", "介词"),
  conj: t("a joining word", "关联词"),
  measure: t("a measure word", "量词"),
  number: t("a number word", "数词"),
  question: t("a question word", "疑问词"),
  pointer: t("a pointing word", "指示代词"),
  modal: t("a helping verb", "能愿动词"),
  dir: t("a direction word after a verb", "趋向动词"),
  loc: t("a place word after a noun", "方位词"),
  other: t("a grammar word", "语法词"),
  time: t("a time word", "时间词"),
};

const isMark = (w: string | undefined): boolean => w === undefined || MARK.test(w);

/** placeRule says where a piece of a right sentence stands and why, by the kind of its words; undefined when no rule says. */
function placeRule(piece: readonly string[], start: number, whole: readonly string[], glossary: Glossary): Text | undefined {
  const x = piece[0] ?? "";
  const text = joined(piece);
  const prev = whole[start - 1];
  const next = whole[start + piece.length];
  const kind = classOf(x);
  const hasNext = !isMark(next);
  const hasPrev = !isMark(prev);
  const verb = (w: string | undefined) => w !== undefined && isVerb(w, glossary);
  const plain = (w: string | undefined) => w !== undefined && !isMark(w) && classOf(w) === undefined && !verb(w);
  const nextKind = next === undefined ? undefined : classOf(next);
  const following = piece.length > 1 ? piece[1] : next;
  const beyond = whole[start + piece.length + (piece.length > 1 ? 0 : 1)];
  const after =
    following && [...following].length === 1 && !isWord(following, glossary) && beyond && !isMark(beyond)
      ? `${following}${beyond}`
      : following;
  if ((kind === "adv" || kind === "neg") && piece.length === 1 && !isMark(after))
    return t(
      `${x} is ${CLASS_NAMES[kind].en}: it goes before the verb or adjective it goes with, here before ${after}.`,
      `“${x}”是${CLASS_NAMES[kind]["zh-CN"]}，要放在它修饰的动词或形容词前面，这里在${q(after ?? "")}前面。`,
    );
  if (kind === "modal" && !isMark(after))
    return t(
      `${x} is a helping verb: it goes before the main verb, here before ${after}.`,
      `“${x}”是能愿动词，要放在主要动词前面，这里在${q(after ?? "")}前面。`,
    );
  if (kind === "number" && piece.length === 1 && nextKind === "measure")
    return t(`${x} is a number: it comes before the measure word, ${x}${next}.`, `“${x}”是数词，放在量词前面：${x}${next}。`);
  if (kind === "loc" && piece.length === 1 && hasPrev)
    return t(`${x} goes after the noun of the place: ${prev}${x}.`, `“${x}”放在表示地方的名词后面：${prev}${x}。`);
  if (kind === "conj" && piece.length === 1 && plain(prev) && hasNext && !JOINERS.has(x))
    return t(
      `${x} goes at the head of its part, right after the subject ${prev}: ${prev}${x}${next}.`,
      `“${x}”放在它那一部分的开头，紧跟在主语${q(prev ?? "")}后面：${prev}${x}${next}。`,
    );
  if (kind === "prep" && hasNext)
    return t(
      `A phrase with ${x} goes before the verb: here ${text} comes before ${next}.`,
      `带${q(x)}的短语放在动词前面：这里${q(text)}在${q(next ?? "")}前面。`,
    );
  if (inDate(piece, start, whole)) return undefined;
  if (kind === "time" && hasNext)
    return t(
      `${x} is a time word: it goes before the verb, at the start or after the subject. Here ${text} comes before ${next}.`,
      `“${x}”是时间词，放在动词前面，可以在句首，也可以在主语后面。这里${q(text)}在${q(next ?? "")}前面。`,
    );
  if (piece.length === 1 && hasNext && nextKind === "end")
    return t(`${next} ends the sentence, so ${x} comes before it: ${x}${next}.`, `“${next}”用在句末，所以“${x}”在它前面：${x}${next}。`);
  if (kind === "end" && !hasNext && piece.length === 1)
    return t(`${x} ends the sentence: nothing comes after it but the mark.`, `“${x}”用在句末，后面只有标点。`);
  if (kind === "aspect" && hasPrev && piece.length === 1)
    return t(`${x} goes right after the word it marks, here ${prev}: ${prev}${x}.`, `“${x}”紧跟在${q(prev ?? "")}后面：${prev}${x}。`);
  if (x === "得" && verb(next) && piece.length === 1)
    return t(
      `Here 得 means “must”: like a helping verb, it goes before the main verb, here before ${next}.`,
      `这里的“得”表示“必须”，像能愿动词一样放在主要动词前面，这里在${q(next ?? "")}前面。`,
    );
  if (kind === "struct" && hasPrev && hasNext && piece.length === 1)
    return t(`${x} joins ${prev} to ${next}: ${prev}${x}${next}.`, `“${x}”连接${q(prev ?? "")}和${q(next ?? "")}：${prev}${x}${next}。`);
  if (kind === "measure" && hasPrev && hasNext && piece.length === 1)
    return t(
      `${x} is a measure word: it goes between the number and the noun, ${prev}${x}${next}.`,
      `“${x}”是量词，放在数词和名词之间：${prev}${x}${next}。`,
    );
  if (kind === "dir" && verb(prev) && piece.length === 1)
    return t(`${x} goes after the verb it goes with: ${prev}${x}.`, `“${x}”跟在动词后面：${prev}${x}。`);
  if (kind === "conj" && JOINERS.has(x) && hasPrev && hasNext && piece.length === 1)
    return t(`${x} joins two words and stands between them: ${prev}${x}${next}.`, `“${x}”连接两个词语，放在它们中间：${prev}${x}${next}。`);
  if (kind === "conj" && !hasPrev)
    return t(`${x} opens its part of the sentence: ${text} comes first there.`, `“${x}”放在它那一部分的开头：${q(text)}在前面。`);
  if (prev !== undefined && classOf(prev) === "prep" && plain(x))
    return t(`${text} goes right after the preposition ${prev}: ${prev}${text}.`, `${q(text)}紧跟在介词${q(prev)}后面：${prev}${text}。`);
  if (verb(x) && (plain(next) || nextKind === "number" || nextKind === "question" || nextKind === "pointer") && piece.length === 1)
    return t(`${x} is the verb: it comes before its object, ${next}.`, `“${x}”是动词，放在它的宾语${q(next ?? "")}前面。`);
  if (plain(x) && verb(prev))
    return t(
      `${text} is what ${prev} acts on: it comes after the verb, ${prev}${text}.`,
      `${q(text)}是${q(prev ?? "")}的宾语，放在动词后面：${prev}${text}。`,
    );
  if (!hasPrev && hasNext && !verb(x) && (plain(x) || kind === "pointer"))
    return t(`${text} is the subject: it comes first, before ${next}.`, `${q(text)}是主语，放在前面，在${q(next ?? "")}前面。`);
  return undefined;
}

/** placeOf says where a piece of a right sentence stands: by a rule where one says, or else beside its neighbor. */
function placeOf(piece: readonly string[], start: number, whole: readonly string[], glossary: Glossary): Text {
  const rule = placeRule(piece, start, whole, glossary);
  if (rule) return rule;
  const text = joined(piece);
  const prev = whole[start - 1];
  const next = whole[start + piece.length];
  const order = glossary.order ? t(` ${glossary.order.en}`, glossary.order["zh-CN"]) : t("", "");
  if (!isMark(next)) return t(`${text} should come before ${next}.${order.en}`, `${q(text)}应该在${q(next ?? "")}前面。${order["zh-CN"]}`);
  if (!isMark(prev)) return t(`${text} should come after ${prev}.${order.en}`, `${q(text)}应该在${q(prev ?? "")}后面。${order["zh-CN"]}`);
  return t(`${text} is out of its place.${order.en}`, `${q(text)}放错了位置。${order["zh-CN"]}`);
}

/** Piece is a run of words of the right sentence and where it starts. */
interface Piece {
  readonly piece: readonly string[];
  readonly start: number;
}

/** placed finds, among pieces that may have moved, one whose place a rule explains, and says it. */
function placed(pieces: readonly Piece[], d: Difference, glossary: Glossary): { readonly piece: Piece; readonly rule: Text } {
  for (const p of pieces) {
    const rule = placeRule(p.piece, p.start, d.whole, glossary);
    if (rule) return { piece: p, rule };
  }
  const p = pieces[0]!;
  return { piece: p, rule: placeOf(p.piece, p.start, d.whole, glossary) };
}

/** LESSER are the kinds whose place says less than an adverb's or a preposition's. */
const LESSER: ReadonlySet<string> = new Set(["verb", "pointer", "other", "number", "question"]);

/** JOINERS are the joining words that stand between two words. */
const JOINERS: ReadonlySet<string> = new Set(["和", "与", "以及", "或者", "还是"]);

/** isVerb says whether a taught word is a verb, by its meaning: “to …”. */
const isVerb = (word: string, glossary: Glossary): boolean =>
  usage.get(word)?.kind === "verb" || (glossary.meanings.get(word)?.en.startsWith("to ") ?? false);

/** weight ranks a piece for naming in a reason: one whose first word has a telling kind first, then the shorter. */
function weight(piece: readonly string[]): number {
  const kind = classOf(piece[0] ?? "");
  return (kind === undefined ? 100 : LESSER.has(kind) ? 50 : 0) + joined(piece).length;
}

/** Moved are the pieces a wrong order may have put in the wrong place, the likelier first. */
interface Moved {
  readonly pieces: readonly Piece[];
  /** swapped is the other piece when two pieces change places round a middle one. */
  readonly swapped?: readonly string[];
}

/** movedOf finds the piece a wrong order moves: one of two pieces that change places. */
function movedOf(d: Difference): Moved | undefined {
  const r = d.right;
  const w = d.wrong;
  const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((x, i) => x === b[i]);
  for (let a = 1; a < r.length; a++) {
    const first = r.slice(0, a);
    const rest = r.slice(a);
    if (same(w, [...rest, ...first])) {
      const pieces = [
        { piece: first, start: d.at },
        { piece: rest, start: d.at + a },
      ];
      return { pieces: pieces.sort((x, y) => weight(x.piece) - weight(y.piece)) };
    }
  }
  for (let a = 1; a < r.length; a++) {
    for (let b = 1; a + b < r.length; b++) {
      const first = r.slice(0, a);
      const last = r.slice(r.length - b);
      const middle = r.slice(a, r.length - b);
      if (same(w, [...last, ...middle, ...first])) return { pieces: [{ piece: first, start: d.at }], swapped: last };
    }
  }
  return undefined;
}

/** reorder says what a wrong order breaks: a word whose characters come apart, or the place of a word. */
function reorder(d: Difference, glossary: Glossary): Text {
  const wrong = joined(d.wrong);
  const broken = d.right.find((x) => [...x].length > 1 && !wrong.includes(x));
  if (broken) {
    const i = d.whole.indexOf(broken, d.at);
    const next = d.whole[i + 1];
    const where = isMark(next) ? t("", "") : t(`, and here it stands before ${next}`, `，这里放在${q(next ?? "")}前面`);
    return t(`${broken} is one word: its characters stay together${where.en}.`, `“${broken}”是一个词，字不能拆开${where["zh-CN"]}。`);
  }
  const moved = movedOf(d);
  const head = moved?.pieces[0];
  if (moved?.swapped && head) {
    const a = joined(head.piece);
    const b = joined(moved.swapped);
    const ua = usage.get(head.piece[0] ?? "");
    const ub = usage.get(moved.swapped[0] ?? "");
    if (ua && ub && head.piece.length === 1 && moved.swapped.length === 1)
      return t(
        `It swaps ${a} and ${b}. ${a} ${ua.note.en}, so it comes first; ${b} ${ub.note.en}, so it comes later.`,
        `把${q(a)}和${q(b)}的位置换反了。${q(a)}${ua.note["zh-CN"]}，在前；${q(b)}${ub.note["zh-CN"]}，在后。`,
      );
    const rule = placeOf(head.piece, head.start, d.whole, glossary);
    return t(`It swaps ${a} and ${b}. ${rule.en}`, `把${q(a)}和${q(b)}的位置换反了。${rule["zh-CN"]}`);
  }
  if (moved) {
    const { piece, rule } = placed(moved.pieces, d, glossary);
    const x = joined(piece.piece);
    return t(`${x} is in the wrong place. ${rule.en}`, `${q(x)}的位置不对。${rule["zh-CN"]}`);
  }
  const singles = d.right.map((x, i) => ({ piece: [x], start: d.at + i }));
  const { rule } = placed(
    singles.sort((x, y) => weight(x.piece) - weight(y.piece)),
    d,
    glossary,
  );
  return t(`The words are in the wrong order. ${rule.en}`, `词语的顺序不对。${rule["zh-CN"]}`);
}

/** meaningOf is what the glossary says a word or a character means. */
function meaningOf(s: string, glossary: Glossary): Text | undefined {
  return glossary.meanings.get(s) ?? glossary.characters.get(s)?.meaning;
}

/** what says what a word does or means, after the word itself; undefined when nothing is known. */
function what(word: string, glossary: Glossary): Text | undefined {
  const u = usage.get(word);
  if (u) return t(`${word} ${u.note.en}`, `${q(word)}${u.note["zh-CN"]}`);
  const m = meaningOf(word, glossary);
  return m && t(`${word} means “${m.en}”`, `${q(word)}的意思是“${m["zh-CN"]}”`);
}

/** partsOf says what the words of a wrong piece are, by their kinds; undefined when a word has no kind. */
function partsOf(words: readonly string[]): Text | undefined {
  const kinds = words.map((w) => classOf(w));
  if (kinds.some((k) => k === undefined)) return undefined;
  const parts = words.map((w, i) => {
    const name = CLASS_NAMES[kinds[i]!];
    return t(`${w} is ${name.en}`, `${q(w)}是${name["zh-CN"]}`);
  });
  return t(parts.map((p) => p.en).join(" and "), parts.map((p) => p["zh-CN"]).join("，"));
}

/** sameMeaning says whether two meanings are alike enough that they cannot be the reason. */
const sameMeaning = (a: Text, b: Text): boolean => {
  const words = (s: string) =>
    new Set(
      s
        .toLowerCase()
        .split(/[^a-z]+/u)
        .filter((x) => x.length > 2),
    );
  const x = words(a.en);
  return [...words(b.en)].some((y) => x.has(y));
};

/** GLUE are the kinds of grammar words that never stand inside another word. */
const GLUE: ReadonlySet<string> = new Set(["struct", "aspect", "end", "neg"]);

/** broken says why a wrong text that is no word, made from a word of the right one with a character lost or changed, fails;
 * undefined when the wrong text is not such a broken word. */
function broken(r: string, w: string, glossary: Glossary): Text | undefined {
  const rc = [...r];
  const wc = [...w];
  if (rc.length < 2 || !isWord(r, glossary) || isWord(w, glossary) || wc.length > rc.length) return undefined;
  if (wordsOf(w, glossary).every((x) => isWord(x, glossary))) return undefined;
  if (wc[0] !== rc[0] && wc.at(-1) !== rc.at(-1)) return undefined;
  const m = meaningOf(r, glossary);
  const head = m
    ? t(`${r} is one word, “${m.en}”, and is always written ${r}.`, `${q(r)}是一个词，意思是“${m["zh-CN"]}”，总是写作${q(r)}。`)
    : t(`${r} is one word and is always written ${r}.`, `${q(r)}是一个词，总是写作${q(r)}。`);
  const odd = wc.filter((c) => !rc.includes(c));
  const lost = wc.length === 1 && odd.length === 0;
  const swapped = wc.length === rc.length && odd.length === 1 && GLUE.has(classOf(odd[0] ?? "") ?? "") && !isVerb(r, glossary);
  if (!lost && !swapped) return undefined;
  const tail = lost
    ? t(`${w} keeps only part of it and is not a word.`, `${q(w)}只留下它的一部分，不成词。`)
    : t(
        `${w} is not a word: ${odd[0]} is a grammar word of its own and cannot take the place of a character inside ${r}.`,
        `${q(w)}不成词：${q(odd[0] ?? "")}是单独的虚词，不能替换${q(r)}里的字。`,
      );
  return t(`${head.en} ${tail.en}`, `${head["zh-CN"]}${tail["zh-CN"]}`);
}

/** replaced says what one word put for another does, and why it fails here. */
function replaced(d: Difference, glossary: Glossary, whole = true): Text {
  const r = joined(d.right);
  const w = joined(d.wrong);
  const written = pairReasons.get(`${r}|${w}`);
  if (written) return written;
  const rw = what(r, glossary);
  const need = (x: Text) => t(`This sentence needs ${x.en}.`, `这里要用${x["zh-CN"]}。`);
  const named = (x: string): Text | undefined => {
    const u = usage.get(x);
    if (u) return t(`${x}, which ${u.note.en}`, `${q(x)}，它${u.note["zh-CN"]}`);
    const m = meaningOf(x, glossary);
    return m && t(`${x}, “${m.en}”`, `${q(x)}（${m["zh-CN"]}）`);
  };
  const rn = named(r);
  const ww = isWord(w, glossary) ? what(w, glossary) : undefined;
  const rm = meaningOf(r, glossary);
  const wm = meaningOf(w, glossary);
  const alike = rm && wm && !usage.has(r) && !usage.has(w) && sameMeaning(rm, wm);
  if (rn && ww && !alike) return t(`${ww.en}. ${need(rn).en}`, `${ww["zh-CN"]}；${need(rn)["zh-CN"]}`);
  const parts = !isWord(w, glossary) ? partsOf(d.wrong) : undefined;
  if (rn && parts) {
    const last = d.whole[d.at - 1];
    const before = last && classOf(last) === "struct" && d.at > 1 ? `${d.whole[d.at - 2]}${last}` : last;
    const after = d.whole[d.at + d.right.length];
    const loose = d.wrong.every((x) => ["number", "measure", "pointer", "question"].includes(classOf(x) ?? ""));
    const link =
      loose && before && after && !isMark(before) && !isMark(after) && classOf(after) !== "end"
        ? t(`, so ${w} cannot link ${before} to ${after}`, `，所以${q(w)}不能把${q(before)}和${q(after)}连起来`)
        : t("", "");
    return t(`${parts.en}${link.en}. ${need(rn).en}`, `${parts["zh-CN"]}${link["zh-CN"]}；${need(rn)["zh-CN"]}`);
  }
  const broke = whole ? broken(r, w, glossary) : undefined;
  if (broke) return broke;
  return rw && rn
    ? t(`It has ${w} where this sentence needs ${rn.en}.`, `用了${q(w)}，这里要用${rn["zh-CN"]}。`)
    : t(`It has ${w} where this sentence needs ${r}.`, `用了${q(w)}，这里应该用${q(r)}。`);
}

/** MARK_NAMES name the marks a reason may list. */
const MARK_NAMES: Readonly<Record<string, Text>> = {
  "，": t("the comma", "逗号"),
  "。": t("the full stop", "句号"),
  "？": t("the question mark", "问号"),
  "！": t("the exclamation mark", "叹号"),
  "、": t("the list comma 、", "顿号"),
};

/** listed joins short texts: A, B and C, naming a mark rather than showing it. */
function listed(items: readonly string[]): Text {
  const en = items.map((x) => MARK_NAMES[x]?.en ?? x);
  const zh = items.map((x) => MARK_NAMES[x]?.["zh-CN"] ?? q(x));
  return t(en.length < 2 ? en.join("") : `${en.slice(0, -1).join(", ")} and ${en.at(-1)}`, zh.join("、"));
}

/** surplus are the words of one list beyond those of another, the last ones taken: what it has that the other lacks. */
function surplus(words: readonly string[], other: readonly string[]): { readonly extra: readonly string[]; readonly rest: string } {
  const left = new Map<string, number>();
  for (const x of other) left.set(x, (left.get(x) ?? 0) + 1);
  const need = new Map<string, number>();
  for (const x of words) need.set(x, (need.get(x) ?? 0) + 1);
  const extra = words.map(() => false);
  for (let i = words.length - 1; i >= 0; i--) {
    const x = words[i]!;
    if ((need.get(x) ?? 0) > (left.get(x) ?? 0)) {
      extra[i] = true;
      need.set(x, (need.get(x) ?? 0) - 1);
    }
  }
  return { extra: words.filter((_, i) => extra[i]), rest: joined(words.filter((_, i) => !extra[i])) };
}

/** added says what a word added does, so that this sentence does not take it. */
function added(words: readonly string[], glossary: Glossary): Text {
  const x = listed(words);
  const one = words.length === 1 ? what(words[0] ?? "", glossary) : undefined;
  if (one && usage.has(words[0] ?? ""))
    return t(
      `It adds ${x.en}. ${one.en}, and this sentence has no place for it.`,
      `多了${x["zh-CN"]}。${one["zh-CN"]}，这个句子用不上它。`,
    );
  const first = words[0] ?? "";
  if (words.length > 1 && words.every((w) => w === first) && usage.has(first))
    return t(
      `It adds ${first} ${words.length === 2 ? "twice" : `${words.length} times`}. ${what(first, glossary)?.en ?? ""}, and here it is said once at most.`,
      `多了${words.length}个${q(first)}。${what(first, glossary)?.["zh-CN"] ?? ""}，这里最多只用一次。`,
    );
  const notes = words.map((w) => (usage.has(w) ? what(w, glossary) : undefined));
  if (words.length > 1 && notes.every((n) => n !== undefined)) {
    const all = notes as readonly Text[];
    return t(
      `It adds ${x.en}. ${all.map((n) => n.en).join("; ")}. This sentence has no place for them.`,
      `多了${x["zh-CN"]}。${all.map((n) => n["zh-CN"]).join("；")}。这个句子用不上它们。`,
    );
  }
  const order = glossary.order;
  if (order) return t(`It adds ${x.en}. ${order.en}`, `多了${x["zh-CN"]}。${order["zh-CN"]}`);
  return t(`It adds ${x.en}, which this sentence does not take.`, `多了${x["zh-CN"]}，这个句子不用。`);
}

/** dropped says what a word left out does, so that this sentence needs it. */
function dropped(words: readonly string[], glossary: Glossary): Text {
  const x = listed(words);
  const one = words.length === 1 ? what(words[0] ?? "", glossary) : undefined;
  if (one && usage.has(words[0] ?? ""))
    return t(`It leaves out ${x.en}. ${one.en}, and this sentence needs it.`, `少了${x["zh-CN"]}。${one["zh-CN"]}，这个句子需要它。`);
  const order = glossary.order;
  if (order) return t(`It leaves out ${x.en}. ${order.en}`, `少了${x["zh-CN"]}。${order["zh-CN"]}`);
  return t(`It leaves out ${x.en}, which this sentence needs.`, `少了${x["zh-CN"]}，这个句子需要。`);
}

/** without is a list of words without some of them, each taken out once from the end. */
function without(words: readonly string[], out: readonly string[]): readonly string[] {
  const rest = [...words];
  for (const x of out) {
    const i = rest.lastIndexOf(x);
    if (i >= 0) rest.splice(i, 1);
  }
  return rest;
}

/** mixed says what a wrong text does that both adds or leaves out words and puts others in another order. */
function mixed(d: Difference, glossary: Glossary): Text | undefined {
  const more = surplus(d.wrong, d.right);
  const less = surplus(d.right, d.wrong);
  const adds = more.extra.length > 0;
  const drops = less.extra.length > 0;
  if (adds && drops && (more.extra.length > 1 || less.extra.length > 1)) return undefined;
  const base =
    adds && drops
      ? replaced({ right: less.extra, wrong: more.extra, whole: d.whole, at: d.whole.indexOf(less.extra[0] ?? "", d.at) }, glossary, false)
      : adds
        ? added(more.extra, glossary)
        : dropped(less.extra, glossary);
  const before = d.whole.slice(0, d.at);
  const after = d.whole.slice(d.at + d.right.length);
  const r = without(d.right, less.extra);
  const w = without(d.wrong, more.extra);
  if (joined(r) === joined(w)) return base;
  const order = reorder(differenceOf(joined([...before, ...r, ...after]), joined([...before, ...w, ...after]), glossary), glossary);
  return t(`${base.en} ${order.en}`, `${base["zh-CN"]}${order["zh-CN"]}`);
}

/** reasonOf says what is wrong with a wrong sentence, compared with the right one. */
export function reasonOf(right: string, wrong: string, glossary: Glossary): Text {
  const d = differenceOf(right, wrong, glossary);
  const r = joined(d.right);
  const w = joined(d.wrong);
  if (pairReasons.has(`${r}|${w}`)) return pairReasons.get(`${r}|${w}`)!;
  if (sorted(r) === sorted(w)) return reorder(d, glossary);
  if (w === "") return dropped(d.right, glossary);
  if (r === "") return added(d.wrong, glossary);
  const shared = d.right.some((x) => d.wrong.includes(x));
  return (shared && mixed(d, glossary)) || replaced(d, glossary);
}

/** pointOf names what a wrong sentence changes, for step 1 of a solution: where a word stands, which word, or what is added. */
export function pointOf(right: string, wrong: string, glossary: Glossary): Text {
  const d = differenceOf(right, wrong, glossary);
  const r = joined(d.right);
  const w = joined(d.wrong);
  if (sorted(r) === sorted(w)) {
    const broken = d.right.find((x) => [...x].length > 1 && !w.includes(x));
    if (broken) return t(`whether ${broken} stays together`, `${q(broken)}的字是否连在一起`);
    const moved = movedOf(d);
    const x = moved ? joined(placed(moved.pieces, d, glossary).piece.piece) : (d.right.find((y) => classOf(y)) ?? r);
    return t(`where ${x} stands`, `${q(x)}的位置`);
  }
  if (w === "") return t(`whether ${r} is there`, `有没有${q(r)}`);
  if (r === "") return t(`an extra ${w}`, `多出的${q(w)}`);
  const more = surplus(d.wrong, d.right).extra;
  const less = surplus(d.right, d.wrong).extra;
  if (less.length === 0 && more.length > 0) return t(`an extra ${joined(more)}`, `多出的${q(joined(more))}`);
  if (more.length === 0 && less.length > 0) return t(`whether ${joined(less)} is there`, `有没有${q(joined(less))}`);
  return t(`${r} or ${w}`, `用${q(r)}还是${q(w)}`);
}

/** noteOf is what a grammar word does, or what a taught word means, for a solution; undefined when neither is known. */
export function noteOf(word: string, glossary: Glossary): Text | undefined {
  return what(word, glossary);
}
