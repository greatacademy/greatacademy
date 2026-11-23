// The reasons of the level grammar (docs/chinese-curriculum.md §6, §8.4): what is wrong with a wrong option, found by
// comparing it, word by word, with the right one. The two differ in one place: a word in the wrong place, a word whose
// characters come apart, a word added or left out, or one word put for another. A reason names the rule the wrong one
// breaks: where a word of its kind stands (grammar-usage.ts), what the word put in does and what the sentence needs, or a
// reason written for that pair (grammar-pairs.ts).

import { type Text, t } from "@ga/content";

import type { LevelOneCharacter } from "./characters.ts";
import { pairReasons } from "./grammar-pairs.ts";
import { phraseNotes, usage, type WordClass } from "./grammar-usage.ts";

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

/** EXTRA are words the grammar sentences use that no level's word list teaches: 节约 is one word, not 节 and 约. */
const EXTRA: ReadonlySet<string> = new Set(["节约"]);

/** WHOLE are further words no level's word list teaches, which a solution quotes whole beside a gap: 窗户, not 户. The
 * reasons do not split sentences by them, since their written pairs compare the parts (好在 against 好好在). */
export const WHOLE: ReadonlySet<string> = new Set([
  "医学院",
  "窗户",
  "看到",
  "日文",
  "看来",
  "好好",
  "学到",
  "容易",
  "买到",
  "提醒",
  "放手",
  "改革开放",
  "进门",
  "提前",
  "汤圆",
  "处理",
  "调查",
  "全面",
  "校服",
  "甜食",
  "主食",
  "迟早",
  "变得",
  "相信",
  "尽心尽力",
  "后人",
  "文化节",
  "今晚",
  "全城",
  "事故",
  "不料",
  "别说",
  "小看",
  "破坏",
  "巨大",
  "山洞",
  "汽车",
  "文章",
  "收音机",
  "说法",
  "活儿",
  "赶上",
  "赶到",
  "买卖",
  "百万",
  "新意",
  "年轻人",
  "取决",
  "影响",
  "不愧",
  "懂得",
  "别提",
  "小事",
  "群众",
  "百分之",
  "可惜",
  "收获",
  "看出",
  "交头接耳",
  "鼓起",
  "春暖花开",
  "莫属",
  "说起",
  "走进",
  "深远",
  "家长",
  "来看",
  "长远",
  "好不容易",
]);

/** isWord says whether a text is a taught word or a grammar word. */
const isWord = (s: string, glossary: Glossary): boolean => !APART.has(s) && (glossary.meanings.has(s) || usage.has(s) || EXTRA.has(s));

/** NONE is no further words. */
const NONE: ReadonlySet<string> = new Set();

/** wordsOf splits a sentence into words, taking the longest taught word, or word of more, at each place. */
export function wordsOf(sentence: string, glossary: Glossary, more: ReadonlySet<string> = NONE): readonly string[] {
  const chars = [...sentence];
  const out: string[] = [];
  let i = 0;
  while (i < chars.length) {
    let n = Math.min(LONGEST, chars.length - i);
    while (n > 1 && !isWord(chars.slice(i, i + n).join(""), glossary) && !more.has(chars.slice(i, i + n).join(""))) n--;
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

/** NEAR is how many characters on each side of a difference a written pair may take in, to tell its sentence apart. */
const NEAR = 6;

/** writtenNear finds a written pair that takes in the text around a difference: the widest that fits wins, so a pair
 * written for one sentence (从下个月起 against 从下个月来) is not used where the same words differ elsewhere. */
function writtenNear(d: Difference): Text | undefined {
  const before = [...joined(d.whole.slice(0, d.at))];
  const after = [...joined(d.whole.slice(d.at + d.right.length))];
  const r = joined(d.right);
  const w = joined(d.wrong);
  for (let n = Math.min(NEAR, before.length) + Math.min(NEAR, after.length); n > 0; n--)
    for (let i = Math.min(NEAR, before.length, n); i >= 0 && n - i <= Math.min(NEAR, after.length); i--) {
      const a = before.slice(before.length - i).join("");
      const b = after.slice(0, n - i).join("");
      const hit = pairReasons.get(`${a}${r}${b}|${a}${w}${b}`);
      if (hit) return hit;
    }
  return undefined;
}

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
  const pair = /([^，。？！、]{1,3})是\1(?=，)/.exec(joined(whole));
  const at = joined(whole.slice(0, start)).length;
  if (pair && at >= pair.index && at < pair.index + pair[0].length) {
    const a = pair[1] ?? "";
    return t(
      `In this pattern the same word stands on each side of 是, ${a}是${a}, and the turn to the problem comes after the comma.`,
      `这个格式是“A是A”：“是”的两边是同一个词，${a}是${a}，逗号后面再转到问题。`,
    );
  }
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
  if (kind === "conj" && piece.length === 1 && plain(prev) && hasNext && !JOINERS.has(x)) {
    let from = start;
    while (from > 0 && !isMark(whole[from - 1])) from--;
    let to = start + 1;
    while (to < whole.length && !isMark(whole[to])) to++;
    const before = whole.slice(from, start);
    if (before.every((w) => plain(w) || classOf(w) === "pointer" || classOf(w) === "measure" || classOf(w) === "struct")) {
      const head = joined(before);
      const part = joined(whole.slice(from, to));
      return t(
        `${x} goes right after ${head}, what this part is about, and before the rest: ${part}.`,
        `“${x}”紧跟在这一部分所说的对象${q(head)}后面，放在其余词语前面：${part}。`,
      );
    }
  }
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
  const comment = whole[start + 2];
  if (x === "得" && hasPrev && nextKind === "adv" && comment !== undefined && !isMark(comment) && piece.length === 1)
    return t(
      `${x} joins ${prev} to the comment on it, ${next}${comment}: ${prev}${x}${next}${comment}.`,
      `“${x}”把${q(prev ?? "")}和对它的评价${q(`${next}${comment}`)}连起来：${prev}${x}${next}${comment}。`,
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

/** firstSense is the first sense of a character's entry, never the whole entry: “天亮的时候”, not “天亮的时候；戏曲中扮演女子的角色”. */
const firstSense = (m: Text): Text => t(m.en.split(/;\s*/u)[0] ?? m.en, m["zh-CN"].split("；")[0] ?? m["zh-CN"]);

/** meaningOf is what the glossary says a word means, or the first sense of a character: for a wrong option, which is read
 * by its plain sense. A right answer is never explained by a character's entry: see named and noteOf. */
function meaningOf(s: string, glossary: Glossary): Text | undefined {
  const c = glossary.characters.get(s)?.meaning;
  return glossary.meanings.get(s) ?? (c && firstSense(c));
}

/** wordWhat says what a word does or means by the list of grammar words or the taught words, never by a character's
 * entry; undefined when neither knows it. */
function wordWhat(word: string, glossary: Glossary): Text | undefined {
  const u = usage.get(word);
  if (u) return t(`${word} ${u.note.en}`, `${q(word)}${u.note["zh-CN"]}`);
  const m = glossary.meanings.get(word);
  return m && t(`${word} means “${m.en}”`, `${q(word)}的意思是“${m["zh-CN"]}”`);
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

/** INSIDE are the kinds of grammar words a wrong option may put inside a word. */
const INSIDE: ReadonlySet<string> = new Set(["struct", "aspect"]);

/** SEPARABLE are the words made of a verb and its object, whose two parts may take 了, 着, 过 or a count between them. */
const SEPARABLE: ReadonlySet<string> = new Set(
  "花钱 说话 排队 生气 开车 走路 办事 熬夜 见面 吃饭 睡觉 洗澡 结婚 离婚 帮忙 聊天 跑步 游泳 上课 下课 上班 下班 唱歌 跳舞 打球 考试 毕业 散步 照相 请假 生病 吵架 担心 鼓掌 干杯 握手 理发 发烧 读书 写字 做饭 看病 住院 出院 留学 放假 跑步 抽烟 喝酒 省钱 洗澡 受伤 搬家 起床 下雨 下雪 打针 加班 报名 上网 唱歌 点头 出差 投票".split(
    " ",
  ),
);

/** broken says why a wrong text that is no word, made from a word of the right one with a character lost or changed, fails;
 * undefined when the wrong text is not such a broken word. */
function broken(r: string, w: string, glossary: Glossary): Text | undefined {
  const rc = [...r];
  const wc = [...w];
  if (rc.length >= 2 && wc.length === rc.length + 1 && isWord(r, glossary) && !SEPARABLE.has(r)) {
    for (let i = 1; i < rc.length; i++) {
      const g = wc[i] ?? "";
      if (wc.slice(0, i).join("") + wc.slice(i + 1).join("") !== r || !INSIDE.has(classOf(g) ?? "")) continue;
      const m = meaningOf(r, glossary);
      const said = m ? t(`, “${m.en}”`, `，意思是“${m["zh-CN"]}”`) : t("", "");
      return t(
        `${r} is one word${said.en}, and its characters stay together. ${g} cannot go inside it.`,
        `${q(r)}是一个词${said["zh-CN"]}，字要连在一起，${q(g)}不能放进中间。`,
      );
    }
  }
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

/** IN_CONTEXT are notes on a word that hold only in sentences of a certain shape, tried in order before its usage note:
 * 也 after 哪怕 or 即使 says the result still holds, not “also”. */
const IN_CONTEXT: readonly { readonly word: string; readonly cue: RegExp; readonly note: Text }[] = [
  {
    word: "也",
    cue: /宁可/,
    note: t("goes with 宁可 and names the thing one will not do", "和“宁可”搭配，说出不愿意做的另一件事"),
  },
  {
    word: "也",
    cue: /连|谁也|一[^，。]{0,4}也[不没]/,
    note: t("goes with 不 or 没 here and means “not even” or “not at all”", "在这里和“不、没”一起，表示完全否定"),
  },
  {
    word: "也",
    cue: /哪怕|即使|就算|无论|不管|再[^，。]{1,4}[，]?[^，。]{0,4}也/,
    note: t("says the result still holds, “even so”", "表示结果仍然不变"),
  },
  {
    word: "再",
    cue: /再[^，。]{1,4}[，]?[^，。]{0,4}也/,
    note: t(", with an adjective and then 也, says “however …”, as in 再累也", "和形容词连用，后面接“也”，表示“无论多么……”"),
  },
  {
    word: "再",
    cue: /不再/,
    note: t(", after 不, says “no longer”: 不再 means it does not happen any more", "用在“不”后面，“不再”表示以后不这样了"),
  },
  {
    word: "则",
    cue: /^(?![^。]*(如果|若|只要|一旦|假如|要是))[^。]*，[^，。]{1,8}则/,
    note: t("in the second of two parts sets it against the first: whereas", "用在后一部分，跟前一部分作对比"),
  },
  {
    word: "上",
    cue: /基础上/,
    note: t(", after 基础, says “on”: 在…基础上, on the basis of", "用在“基础”后面，“在……基础上”表示以此为基础"),
  },
  {
    word: "下",
    cue: /说下就下/,
    note: t("is here the verb of rain, “to fall”", "在这里是动词，指下雨"),
  },
  {
    word: "下",
    cue: /在[^，。]+下，/,
    note: t("closes 在…下, “with” a help or “under” a condition", "用在“在……下”里，表示在某种帮助或条件之下"),
  },
  {
    word: "来",
    cue: /[十百千万]来[个位块年天次米]/,
    note: t(", after a round number, says “about”: 十来个, about ten", "用在整数后面，表示大概的数：十来个"),
  },
  {
    word: "来",
    cue: /(.)来\1去/,
    note: t("in verb + 来 + verb + 去 says the action is done again and again", "用在“动词＋来＋动词＋去”里，表示动作反复进行"),
  },
  {
    word: "来",
    cue: /说起[^，。]+来/,
    note: t("closes 说起…来, “speaking of”", "用在“说起……来”里，表示提起某事"),
  },
  {
    word: "去",
    cue: /(.)来\1去/,
    note: t("in verb + 来 + verb + 去 says the action is done again and again", "用在“动词＋来＋动词＋去”里，表示动作反复进行"),
  },
  {
    word: "过",
    cue: /[不得]过[他她你我]/,
    note: t(
      "after 得 or 不 says whether one can beat someone: 跑不过他, cannot outrun him",
      "用在“得、不”后面，表示能不能胜过别人：跑不过他",
    ),
  },
  {
    word: "就",
    cue: /而言/,
    note: t("opens 就…而言, “as for”", "用在“就……而言”里，表示从某方面说"),
  },
  {
    word: "就",
    cue: /双方就|就[^，。]{1,10}(进行|展开|发表)|^就[^，。]{1,8}(问题|事)，|[想要]就[这那][^，。]{0,4}(问题|事)/,
    note: t("marks the matter something is about, “on”, in formal writing", "书面语，引出动作涉及的对象，意思是“关于”"),
  },
  {
    word: "就",
    cue: /动不动就/,
    note: t("after 动不动 says it happens at the slightest thing", "用在“动不动”后面，表示很容易就发生"),
  },
  {
    word: "就",
    cue: /说(.)就\1/,
    note: t("in 说…就…, says it is done at once, as soon as it is said", "用在“说……就……”里，表示说做就做，马上发生"),
  },
  {
    word: "就",
    cue: /就是/,
    note: t("before 是 says it is exactly so", "用在“是”前面，强调正是这样"),
  },
  {
    word: "就",
    cue: /索性/,
    note: t("after 索性 says one simply does it", "用在“索性”后面，表示干脆这样做"),
  },
  {
    word: "就",
    cue: /^(?!.*每隔).*一(?!会儿|下|直)[^，。]{1,6}就/,
    note: t("in 一…就 says the second thing follows as soon as the first", "用在“一……就……”里，表示前一件事一发生，后一件事马上跟着发生"),
  },
  {
    word: "就",
    cue: /每当|每隔|一旦|既然|要不是|倘若|如果|只要|反之|这样一来/,
    note: t("opens the result of what comes before: then", "引出前面所说情况的结果，意思是“那么就”"),
  },
  {
    word: "才",
    cue: /才(?!怪)[^，。]*呢/,
    note: t("with 呢 at the end says strongly that it is not so", "和句末的“呢”一起，强调事实不是那样"),
  },
  {
    word: "再",
    cue: /再[^，。]{1,3}不过/,
    note: t("in 再…不过了 says nothing could be more so", "用在“再……不过了”里，表示程度最高"),
  },
  {
    word: "都",
    cue: /连/,
    note: t("after 连 says “even”", "用在“连”后面，表示“甚至”"),
  },
  {
    word: "一",
    cue: /一(?!会儿|下)[^，。]{1,4}就/,
    note: t("in 一…就 says “once” or “as soon as”", "用在“一……就……”里，表示一发生就有结果"),
  },
  {
    word: "成",
    cue: /[一二两三四五六七八九]成/,
    note: t(", after a number, counts tenths: 两成, twenty percent", "用在数词后面，表示十分之几：两成"),
  },
  {
    word: "为",
    cue: /为[^，。]+所/,
    note: t("marks who does it, in 为…所", "用在“为……所”里，引出动作的发出者"),
  },
  {
    word: "为",
    cue: /称为|以[^，。]{1,8}为|不愧为/,
    note: t("means “to be” or “as”, in formal writing", "书面语，意思是“是、作为”"),
  },
  {
    word: "给",
    cue: /被[^，。]*给/,
    note: t("goes before the verb in a 被 sentence, in speech, and adds weight", "口语里用在“被”字句的动词前面，加强语气"),
  },
  {
    word: "个",
    cue: /个(够|痛快|明白|清楚)/,
    note: t("before a result makes it lively: 看个够, see one's fill", "用在动词和结果之间，使语气生动：看个够"),
  },
  {
    word: "非",
    cue: /莫属/,
    note: t("in 非…莫属 says no one but", "用在“非……莫属”里，表示除了这一个没有别的"),
  },
  {
    word: "得",
    cue: /舍得/,
    note: t("is part of 舍得, “to be willing to part with”", "是“舍得”的一部分，表示愿意给出、不吝惜"),
  },
  {
    word: "一直",
    cue: /一直(往|向)/,
    note: t("before 往 or 向 says “straight on”", "用在“往、向”前面，表示方向不变"),
  },
  {
    word: "又",
    cue: /既/,
    note: t("after 既 adds a second quality: 既…又…, both … and …", "和“既”搭配，表示同时具有两个方面"),
  },
  {
    word: "还是",
    cue: /不管|无论/,
    note: t("joins the choices after 不管 or 无论: whether … or …", "用在“不管、无论”后面，连接几种选择"),
  },
  {
    word: "还是",
    cue: /还是[^，。？]*吧|还是别/,
    note: t("gives advice: had better", "用来提出建议，表示“最好”"),
  },
  {
    word: "还是",
    cue: /是[^，。]+还是/,
    note: t("joins the choices that are asked about: or", "连接所问的几种选择，意思是“或者”"),
  },
  {
    word: "还是",
    cue: /不光|不仅/,
    note: t("is 还, “also”, before 是, “is”", "是“还”（另外）加上“是”"),
  },
  {
    word: "还是",
    cue: /了又[^，。]+，[^，。]*还是/,
    note: t("says “still”, after all that was done", "表示仍然这样，前面做了很多也没有改变"),
  },
  {
    word: "结果",
    cue: /的结果/,
    note: t("is here a noun, “the result”", "在这里是名词，指最后的结局"),
  },
  {
    word: "不要",
    cue: /才怪/,
    note: t("here means “not want”", "在这里表示不想要"),
  },
  {
    word: "而",
    cue: /为[^，。]*而/,
    note: t("links the purpose to the action, in 为…而", "用在“为……而”里，连接目的和行动"),
  },
  {
    word: "而",
    cue: /因[^，。]*而/,
    note: t("links the cause to the result, in 因…而", "用在“因……而”里，连接原因和结果"),
  },
  {
    word: "过去",
    cue: /晕了?过去/,
    note: t(", after 晕, says one loses one's senses: 晕过去, to faint", "用在“晕”后面，表示失去知觉"),
  },
  {
    word: "就是",
    cue: /倒是[^。]*，就是/,
    note: t("here means “it's just that”, and names a drawback after a good point", "在这里表示“只是”，在优点后面说出不足"),
  },
  {
    word: "就是",
    cue: /一[^，。就]{1,3}就是/,
    note: t(
      ", after 一 and a verb, stresses how long or how much: 一睡就是十个小时",
      "用在“一+动词”后面，强调时间长或数量多：一睡就是十个小时",
    ),
  },
  {
    word: "了",
    cue: /别提多[^。！]*了/,
    note: t("closes 别提多…了, “so … that words fail”", "和“别提多”搭配，用在句末，表示程度很高"),
  },
  {
    word: "了",
    cue: /可想而知了/,
    note: t(", after 可想而知, ends the sentence and stresses that it is plain to see", "用在“可想而知”后面，加强语气"),
  },
  {
    word: "在",
    cue: /^在[^。]*(基础上|前提下)/,
    note: t(
      "opens 在…上 or 在…下, a frame for what something rests on: the basis or the condition",
      "和后面的“上”或“下”组成框架，说明依据或条件",
    ),
  },
  {
    word: "才",
    cue: /正因为/,
    note: t(", after 正因为, says this is the very reason, and only so", "和“正因为”搭配，强调正是这个原因才这样"),
  },
  { word: "三", cue: /两三/, note: t("joins 两 in 两三, “two or three”, a rough number", "和“两”连用成“两三”，表示大概的数目") },
  { word: "三", cue: /三个国家/, note: t("gives the number of countries", "表示国家的数目") },
  { word: "中", cue: /从[^，。]*中/, note: t(", with 从, says “from within”", "和“从”搭配成“从……中”，表示从某个范围里面") },
  {
    word: "乎",
    cue: /不外乎/,
    note: t("is part of the fixed word 不外乎, “nothing more than”", "是固定词语“不外乎”里的字，“不外乎”表示不超出某个范围"),
  },
  {
    word: "亚",
    cue: /不亚于/,
    note: t("is part of the fixed word 不亚于, “no less than”", "是固定词语“不亚于”里的字，“不亚于”表示不比……差"),
  },
  { word: "似", cue: /似.非./, note: t("opens 似…非…, “seeming so, yet not quite”", "用在“似……非……”里，表示好像是又好像不是") },
  {
    word: "何",
    cue: /何以/,
    note: t("is part of 何以, a written word for “how could”", "是书面词语“何以”里的字，“何以”表示怎么能、凭什么"),
  },
  { word: "余", cue: /[十百千万年]余|余[年万]|有余/, note: t(", after a number, means “more than”", "用在数目后面，表示比这个数多一些") },
  { word: "倒", cue: /说得倒/, note: t("says the other speaks too lightly: easy for you to say", "表示对方说得容易，含有不满") },
  { word: "倒", cue: /倒/, note: t("marks what goes against what one expected", "表示和预想的相反") },
  { word: "勿", cue: /请勿/, note: t("is part of 请勿, a written “please do not”", "是“请勿”里的字，“勿”表示不要") },
  {
    word: "化",
    cue: /化/,
    note: t(", after an adjective, means to make something so: 简单化, to make simple", "用在形容词后面，表示使变成这种样子"),
  },
  { word: "反", cue: /反作用|反科学/, note: t("means “against” or “the opposite of”", "表示相反、违反") },
  {
    word: "另",
    cue: /另一方面/,
    note: t("is part of 另一方面, “on the other hand”, which answers 一方面", "是“另一方面”里的字，和前面的“一方面”呼应"),
  },
  { word: "可", cue: /非[^，。]*不可/, note: t("closes 非…不可, “must”", "用在“非……不可”里，表示一定要") },
  { word: "可", cue: /方可/, note: t("follows 方 in 方可, written for “only then may”", "和“方”连用成“方可”，表示才可以") },
  {
    word: "可",
    cue: /可想而知/,
    note: t("is part of the fixed phrase 可想而知, “one can well imagine”", "是固定说法“可想而知”里的字，表示能够想象得到"),
  },
  { word: "可", cue: /无可/, note: t("follows 无 in 无可…, “there is nothing to … ”", "用在“无可……”里，表示没有可以……的") },
  { word: "可", cue: /别看|照理说/, note: t("means “but” and turns the sentence", "表示转折，意思是“可是”") },
  { word: "可", cue: /可/, note: t("stresses what the speaker says", "加强语气，表示强调") },
  { word: "后", cue: /先后/, note: t("is part of 先后, “one after another”", "是“先后”里的字，“先后”表示前后相继") },
  { word: "因", cue: /因[^，。]*而/, note: t("opens 因…而, “because of … so”", "用在“因……而”里，表示原因") },
  { word: "好", cue: /好几/, note: t("comes before 几 and means “quite a few”", "用在“几”前面，表示多") },
  { word: "好", cue: /得好/, note: t(", in V得好, says the action can be done: 修得好, can be fixed", "用在“V得好”里，表示能够做好") },
  { word: "好", cue: /好了/, note: t(", after a verb, says the action is done and done well", "用在动词后面，表示动作完成") },
  { word: "如", cue: /诸如/, note: t("is part of 诸如, “such as”", "是“诸如”里的字，“诸如”用来举例，意思是像……这些") },
  { word: "少", cue: /少了/, note: t("says the amount got smaller", "表示数量变小") },
  { word: "彼", cue: /此.彼/, note: t("means “that”, set against 此, “this”", "表示“那、那个”，和“此”相对") },
  { word: "性", cue: /性/, note: t(", after a word, makes a noun for a quality: 安全性, safety", "用在词语后面，构成名词，表示性质") },
  { word: "感", cue: /感兴趣/, note: t("is part of 感兴趣, “be interested”", "是“感兴趣”里的字，“感”表示觉得、产生") },
  { word: "愧", cue: /不愧/, note: t("is part of 不愧, “truly worthy of being”", "是“不愧”里的字，“不愧”表示当得起") },
  {
    word: "所",
    cue: /所/,
    note: t(", before a verb, with 的 makes “what is done”: 我所知道的, what I know", "用在动词前面，和“的”一起表示动作涉及的事物"),
  },
  { word: "方", cue: /方[能有]/, note: t("is written for 才, “only then”", "是书面语，意思是“才”") },
  { word: "旦", cue: /一旦/, note: t("is part of the fixed word 一旦, “once, if ever”", "是“一旦”里的字，“一旦”表示如果有一天") },
  { word: "时", cue: /时，/, note: t(", after a clause, means “when”", "用在句子后面，表示“……的时候”") },
  { word: "未", cue: /未曾/, note: t("is part of 未曾, written for “never have”", "是“未曾”里的字，意思是没有") },
  { word: "未", cue: /尚未/, note: t("follows 尚 in 尚未, “not yet”", "和“尚”连用成“尚未”，意思是还没有") },
  { word: "经", cue: /未经/, note: t("follows 未 in 未经, “without”: 未经批准, without approval", "和“未”连用成“未经”，表示没有经过") },
  {
    word: "盘",
    cue: /一盘盘/,
    note: t("is the measure word for dishes, doubled to say one after another", "是菜的量词，重叠成“一盘盘”表示一盘接一盘"),
  },
  { word: "称", cue: /之称/, note: t("closes 有…之称, “be known as”", "用在“有……之称”里，表示被叫作") },
  { word: "称", cue: /称为/, note: t("is part of 称为, “be called”", "是“称为”里的字，“称”表示叫") },
  { word: "站", cue: /站着/, note: t("is the verb “stand”", "是动词，表示站立") },
  { word: "第", cue: /第[一二三四五六七八九十]/, note: t("comes before a number to give its place in order", "用在数字前面，表示次序") },
  { word: "者", cue: /者/, note: t(", after a word, means “a person who”: 求职者, a job seeker", "用在词语后面，表示……的人") },
  { word: "自", cue: /自[^，。]*起/, note: t("opens 自…起, written for “from … on”", "用在“自……起”里，是书面语，表示从") },
  { word: "莫", cue: /莫属/, note: t("is part of 非…莫属, “no one but”", "用在“非……莫属”里，表示除了这一个没有别的") },
  { word: "请", cue: /请/, note: t("asks politely, “please”", "表示客气地请求") },
  { word: "起", cue: /起.{0,3}来/, note: t("opens V起…来, saying something begins", "用在“V起……来”里，表示开始") },
  { word: "起", cue: /[从自][^，。]*起/, note: t("closes 从…起, “from … on”", "用在“从……起”里，表示从某时开始") },
  {
    word: "起",
    cue: /[谈说讲问提]起/,
    note: t(", after 说, 谈 or 问, brings in what is talked about", "用在“说、谈、问”等后面，表示涉及某人某事"),
  },
  { word: "达", cue: /[高多]达/, note: t(", after 高 or 多, means “reaching”: 高达, as high as", "用在“高、多”后面，表示达到") },
  { word: "隔", cue: /每隔/, note: t("follows 每 in 每隔, “every”, telling the time between", "和“每”连用成“每隔”，表示每过一段时间") },
  { word: "项", cue: /项/, note: t("is the measure word for tasks, rules, studies and plans", "是任务、政策、研究等的量词") },
  {
    word: "边",
    cue: /[东南西北]边/,
    note: t(", after 北, 南, 东 or 西, names the side: 北边, the north side", "用在“东、南、西、北”后面，表示这一边"),
  },
  {
    word: "睡",
    cue: /睡在/,
    note: t("is the plain verb “sleep”, which takes 在 and a place after it", "是动词“睡”，后面可以跟“在”和地方"),
  },
  { word: "三", cue: /三刻/, note: t("counts quarters: 三刻 is 45 minutes", "表示刻数，三刻是四十五分钟") },
  { word: "三", cue: /先后/, note: t("is a number above one, as 先后 needs", "是大于一的数，“先后”要求不止一次") },
  { word: "四", cue: /先后/, note: t("is a number above one, as 先后 needs", "是大于一的数，“先后”要求不止一次") },
  { word: "五", cue: /先后/, note: t("is a number above one, as 先后 needs", "是大于一的数，“先后”要求不止一次") },
  { word: "每", cue: /每个/, note: t("means “every” and goes with 都", "表示“每一个”，和“都”配合") },
  {
    word: "架",
    cue: /吵了一架/,
    note: t("is the measure word for a quarrel: 吵了一架, had a quarrel", "是“吵架”的量词，“吵了一架”表示吵了一次"),
  },
  {
    word: "少",
    cue: /比[^，。]*少/,
    note: t(", in a 比 sentence, states the gap and takes no 很", "用在“比”字句里说差别，前面不能加“很”"),
  },
  { word: "少", cue: /越少/, note: t("is the plain adjective and takes no 很 after 越", "是形容词，前面有“越”，不能再加“很”") },
  { word: "少", cue: /少[花吃熬]/, note: t(", before a verb, means “do less of it”", "用在动词前面，表示少做") },
  { word: "好", cue: /很不好/, note: t("is the adjective “good”, said with 不: 不好, bad", "是形容词，和“不”连用表示不好") },
  { word: "好", cue: /相当好/, note: t("stands alone after 相当, which takes no 极了", "单独用在“相当”后面，不再加“极了”") },
  { word: "肯", cue: /肯/, note: t("means “be willing to” and comes right before the verb", "表示愿意，直接放在动词前面") },
  { word: "改", cue: /了又/, note: t("is the verb said twice in V了又V", "是“V了又V”里重复的动词") },
  { word: "算", cue: /了又/, note: t("is the verb said twice in V了又V", "是“V了又V”里重复的动词") },
  { word: "遭", cue: /遭到/, note: t("is part of 遭到, “suffer”, used for bad things", "是“遭到”里的字，“遭到”用于不好的事") },
  { word: "率", cue: /率/, note: t(", after a word, means “rate”: 成功率, success rate", "用在词语后面，表示比率") },
  {
    word: "样",
    cue: /那样/,
    note: t("is part of 那样, “like that”, which closes 正如…那样", "是“那样”里的字，和“正如”呼应成“正如……那样”"),
  },
  { word: "反", cue: /[挂穿放]反/, note: t(", after a verb, means “the wrong way round”", "用在动词后面，表示方向或位置颠倒") },
  {
    word: "超",
    cue: /超[大高]/,
    note: t("means “beyond the usual”, set before a word: 超大型, extra large", "用在词语前面，表示超过一般"),
  },
  { word: "勿", cue: /切勿/, note: t("is part of 切勿, written for “never do”", "是“切勿”里的字，“勿”表示不要") },
  { word: "属", cue: /莫属/, note: t("is part of 非…莫属, “belongs to no one but”", "是“非……莫属”里的字，“属”表示属于") },
  { word: "十", cue: /十个|百分之十/, note: t("is the number ten", "是数字十") },
  { word: "五", cue: /块五/, note: t(", after 块, means five jiao: 三块五, 3.5 yuan", "用在“块”后面，表示五毛：三块五") },
  { word: "三", cue: /第三|三天/, note: t("is the number three", "是数字三") },
  { word: "六", cue: /六岁/, note: t("is the number six", "是数字六") },
  { word: "他", cue: /他/, note: t("means “he” or “him”, a man or boy other than you and me", "指你我以外的一个男性") },
  { word: "我", cue: /我/, note: t("means “I” or “me”, the one speaking", "指说话的人自己") },
  { word: "你", cue: /你/, note: t("means “you”, the one spoken to", "指听话的人") },
  { word: "它", cue: /它/, note: t("means “it”, for a thing, not a person", "指人以外的事物") },
  { word: "常", cue: /不常/, note: t("means “often”; 不常 is “not often”", "表示时常，“不常”就是不经常") },
  { word: "好", cue: /好记/, note: t(", before a verb, means “easy to”: 好记, easy to remember", "用在动词前面，表示容易") },
  {
    word: "好",
    cue: /得很好|比[^，。]*好|不如[^，。]*好|越来越好|好极了|特别好/,
    note: t("is the adjective “good” or “well”", "是形容词，表示好"),
  },
  { word: "少", cue: /得少/, note: t("means “little” or “few”", "表示数量小") },
  { word: "刻", cue: /一刻/, note: t("is a quarter of an hour", "表示十五分钟") },
  { word: "钟", cue: /点钟/, note: t("follows 点 in 点钟, “o'clock”", "和“点”连用成“点钟”，表示整点时间") },
  { word: "睡", cue: /睡/, note: t("is the verb “sleep”", "是动词，表示睡觉") },
  { word: "问", cue: /问一下/, note: t("is the verb “ask”", "是动词，表示请人回答") },
  { word: "全", cue: /全/, note: t("means “all” or “wholly”, set before the verb", "用在动词前面，表示全部、都") },
  { word: "愿", cue: /愿不愿/, note: t("is part of 愿意, “be willing”, asked as 愿不愿意", "是“愿意”里的字，问句说“愿不愿意”") },
  { word: "拍", cue: /拍照/, note: t("means “take” a photo: 拍照片", "表示照相") },
  { word: "每", cue: /每天/, note: t("means “every”: 每天, every day", "表示“每一”，“每天”就是天天") },
  { word: "假", cue: /假的/, note: t("means “not real, false”", "表示不真的") },
  { word: "该", cue: /该怎么/, note: t("means “should”", "表示应该") },
  {
    word: "该",
    cue: /，该/,
    note: t("points back, in formal writing, to what was just named: “this”, “the said”", "书面语，指上文说过的人或事物"),
  },
  { word: "夜", cue: /熬过?夜/, note: t("is part of 熬夜, “stay up late”", "是“熬夜”里的字，“熬夜”表示很晚不睡") },
  { word: "赚", cue: /赚/, note: t("means “earn” money", "表示得到钱") },
  {
    word: "阵",
    cue: /一阵/,
    note: t("is the measure word for a short spell of wind, rain or sound", "是量词，用于短时间的风、雨、声音等"),
  },
  {
    word: "场",
    cue: /一场比一场/,
    note: t("is the measure word for games: 一场比一场, each game better than the last", "是比赛的量词，“一场比一场”表示一次比一次"),
  },
  { word: "净", cue: /净/, note: t("means “only, nothing but”, often in a complaint", "表示全都是、只，常带不满") },
  { word: "扭", cue: /扭了/, note: t("means “twist”: 扭了脚, hurt one's foot by twisting it", "表示转动受伤，比如“扭了脚”") },
  { word: "学", cue: /学了|学会/, note: t("is the verb “learn” or “study”", "是动词，表示学习") },
  { word: "干", cue: /太干/, note: t("means “dry”", "表示没有水分") },
  { word: "临", cue: /临[^，。]*[前时]/, note: t("opens 临…前, “just before”", "用在“临……前”里，表示快要……的时候") },
  { word: "超", cue: /超速/, note: t("means “go beyond”: 超速, over the speed limit", "表示超过，“超速”就是超过规定的速度") },
  { word: "颇", cue: /颇/, note: t("is written for “quite” or “rather”", "是书面语，表示很、相当") },
  { word: "受", cue: /受欢迎/, note: t("is part of 受欢迎, “be popular”", "是“受欢迎”里的字，“受”表示得到") },
  { word: "帅", cue: /帅/, note: t("means “handsome”", "表示长得好看") },
  { word: "乃", cue: /乃/, note: t("is written for 是, “is”", "是书面语，意思是“是”") },
  { word: "需", cue: /需/, note: t("means “need”", "表示需要") },
  {
    word: "其",
    cue: /其/,
    note: t("is written for “its” or “his”, pointing back to what came before", "是书面语，指前面说过的人或事物，意思是“他的、它的”"),
  },
  {
    word: "岂",
    cue: /岂/,
    note: t("is written for “how could”, asking only to stress the opposite", "是书面语，用在反问句里，意思是“难道、怎么”"),
  },
  { word: "示", cue: /以示/, note: t("follows 以 in 以示, “so as to show”", "和“以”连用成“以示”，表示用来表示") },
  { word: "防", cue: /以防/, note: t("follows 以 in 以防, “so as to guard against”", "和“以”连用成“以防”，表示防止坏事发生") },
  { word: "求", cue: /以求/, note: t("follows 以 in 以求, “so as to seek”", "和“以”连用成“以求”，表示为了得到") },
];

/** inContext is the note on a word that holds in a sentence of a certain shape; undefined when its usage note holds. */
const inContext = (word: string, sentence: string): Text | undefined =>
  IN_CONTEXT.find((n) => n.word === word && n.cue.test(sentence))?.note;

/** replaced says what one word put for another does, and why it fails here. */
function replaced(d: Difference, glossary: Glossary, whole = true): Text {
  const r = joined(d.right);
  const w = joined(d.wrong);
  const written = pairReasons.get(`${r}|${w}`);
  if (written) return written;
  const need = (x: Text) => t(`This sentence needs ${x.en}.`, `这里要用${x["zh-CN"]}。`);
  const sentence = joined(d.whole);
  const named = (x: string): Text | undefined => {
    const c = inContext(x, sentence);
    if (c) return t(`${x}, which${c.en.startsWith(",") ? "" : " "}${c.en}`, `${q(x)}，它${c["zh-CN"]}`);
    const u = usage.get(x);
    if (u) return t(`${x}, which ${u.note.en}`, `${q(x)}，它${u.note["zh-CN"]}`);
    const m = glossary.meanings.get(x);
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
  return rn
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

/** reasons keeps the reasons already found for each glossary, since the same sentences are explained again and again. */
const reasons = new WeakMap<Glossary, Map<string, Text>>();

/** reasonOf says what is wrong with a wrong sentence, compared with the right one. */
export function reasonOf(right: string, wrong: string, glossary: Glossary): Text {
  let known = reasons.get(glossary);
  if (!known) {
    known = new Map();
    reasons.set(glossary, known);
  }
  const key = `${right}\n${wrong}`;
  const found = known.get(key);
  if (found) return found;
  const reason = freshReason(right, wrong, glossary);
  known.set(key, reason);
  return reason;
}

/** freshReason finds the reason reasonOf gives, without looking at those already found. */
function freshReason(right: string, wrong: string, glossary: Glossary): Text {
  const d = differenceOf(right, wrong, glossary);
  const r = joined(d.right);
  const w = joined(d.wrong);
  const near = writtenNear(d);
  if (near) return near;
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

/** noteOf is what a grammar word does in a sentence, what a taught word means, or what a phrase of the later levels does,
 * for a solution; undefined when none is known. */
export function noteOf(word: string, glossary: Glossary, sentence = ""): Text | undefined {
  const c = inContext(word, sentence);
  if (c) return t(`${word}${c.en.startsWith(",") ? "" : " "}${c.en}`, `${q(word)}${c["zh-CN"]}`);
  const p = phraseNotes.get(word);
  return wordWhat(word, glossary) ?? (p && t(`${word} ${p.en}`, `${q(word)}${p["zh-CN"]}`));
}
