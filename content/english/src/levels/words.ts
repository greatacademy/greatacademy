// Vocabulary topics of the levels, built from data: each word has a meaning in English and in Chinese, at least three
// model sentences and the words a learner confuses it with. From them a topic gets three knowledge points: choose the
// word that completes a sentence, choose the word for a meaning, and type the word for a meaning in a sentence.

import { type EncompassingDef, type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import type { WordBatch } from "../pack.ts";

/** WordSentence is one model sentence of a word: the sentence with a gap, the spelling that fills it, and wrong fillers. */
export interface WordSentence {
  readonly gapped: string;
  readonly full: string;
  readonly answer: string;
  readonly wrong: readonly string[];
}

/** WordDef is one headword of a vocabulary topic: its spellings, its meaning, its sentences and its confusions. */
export interface WordDef {
  readonly head: string;
  /** spellings are the headword and every form a passage may use, as written in a sentence. */
  readonly spellings: readonly string[];
  readonly meaning: Text;
  readonly sentences: readonly WordSentence[];
  /** confusions are words a learner mixes this one up with; none of them fits its sentences or its meaning. */
  readonly confusions: readonly string[];
  /** alike are words of the batch that mean nearly the same, never offered as wrong options for it. */
  readonly alike: readonly string[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const gap = "___";

/**
 * word builds a WordDef. spellings lists the headword first and then its forms, separated by spaces. sentences are
 * separated by ` | `; in each, `{form}` marks the word, and `|w1 w2` right after the sentence replaces the confusions
 * as its wrong fillers, for a sentence that needs another form or other words. A sentence that starts with the word
 * capitalizes its fillers.
 */
export function word(spellings: string, en: string, zh: string, sentences: string, confusions: string, alike = ""): WordDef {
  const all = spellings.split(" ").filter((s) => s !== "");
  const head = all[0] ?? "";
  const known = new Set(all.map((s) => s.toLowerCase()));
  const defaultWrong = confusions.split(" ").filter((s) => s !== "");
  const parsed = sentences.split(" | ").map((raw): WordSentence => {
    const bar = raw.indexOf("|");
    const sentence = (bar < 0 ? raw : raw.slice(0, bar)).trim();
    const fillers = bar < 0 ? undefined : raw.slice(bar + 1).trim();
    const mark = /\{([^}]+)\}/u.exec(sentence);
    if (!mark) throw new Error(`${head}: no {word} in "${sentence}"`);
    const answer = mark[1] ?? "";
    if (!known.has(answer.toLowerCase())) throw new Error(`${head}: ${answer} is not one of its spellings`);
    const atStart = mark.index === 0;
    const wrong = (fillers === undefined ? defaultWrong : fillers.split(" ").filter((s) => s !== "")).map((w) =>
      atStart ? capitalize(w) : w,
    );
    if (wrong.length < 2) throw new Error(`${head}: fewer than two wrong fillers in "${sentence}"`);
    if (wrong.some((w) => w.toLowerCase() === answer.toLowerCase())) throw new Error(`${head}: a filler is the answer in "${sentence}"`);
    const before = sentence.slice(0, mark.index);
    const after = sentence.slice(mark.index + mark[0].length);
    return { gapped: `${before}${gap}${after}`, full: `${before}${answer}${after}`, answer, wrong };
  });
  if (parsed.length < 3) throw new Error(`${head}: fewer than three sentences`);
  return {
    head,
    spellings: all,
    meaning: t(en, zh),
    sentences: parsed,
    confusions: defaultWrong,
    alike: alike.split(" ").filter((s) => s !== ""),
  };
}

/** VocabularySpec is what a vocabulary topic is made of. */
export interface VocabularySpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses?: readonly EncompassingDef[];
  readonly words: readonly WordDef[];
}

/** VocabularyTopic is a vocabulary topic and the batch of words it teaches. */
export interface VocabularyTopic {
  readonly topic: TopicDef;
  readonly batch: WordBatch;
}

/** minItems is the fewest distinct items a vocabulary knowledge point may have. */
const minItems = 25;

const quote = (s: string) => same(`> ${s}`);

const explained = (w: WordDef, sentence: string): Text =>
  t(
    `*${w.head}* means “${w.meaning.en}”, and that meaning is the one this sentence needs:\n\n${sentence}`,
    `*${w.head}* 的意思是“${w.meaning["zh-CN"]}”，这正是这个句子需要的意思：\n\n${sentence}`,
  );

/**
 * glossary maps each spelling of every headword of a vocabulary topic, in lower case, to its word, so that choosing a
 * wrong option can be answered with what that word means. It fills as the content modules build their topics and is
 * read only when a problem is generated, by which time every topic is built; the first word to claim a spelling keeps it.
 */
const glossary = new Map<string, WordDef>();

/** gloss is the word a spelling belongs to, if a vocabulary topic teaches it. */
export function gloss(spelling: string): WordDef | undefined {
  return glossary.get(spelling.toLowerCase());
}

interface ChoiceItem {
  readonly prompt: Text;
  readonly right: string;
  readonly wrong: readonly string[];
  readonly solution: Text;
  /** whyNot says what choosing a wrong option shows, when there is something to say about it. */
  readonly whyNot: (wrong: string) => Text | undefined;
}

function choiceFrom(items: readonly ChoiceItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    const mistakes = item.wrong.flatMap((w) => {
      const feedback = item.whyNot(w);
      return feedback ? [{ response: String(options.indexOf(w)), feedback }] : [];
    });
    return {
      prompt: item.prompt,
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: item.solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(mistakes.length > 0 && { mistakes }),
    };
  };
}

/** meansOther says what a wrong option means, if a vocabulary topic teaches it. */
function meansOther(wrong: string): Text | undefined {
  const other = gloss(wrong);
  if (!other) return undefined;
  return t(`*${wrong}* means “${other.meaning.en}”.`, `*${wrong}* 的意思是“${other.meaning["zh-CN"]}”。`);
}

/**
 * fitsNot says why a wrong filler does not complete the sentence: another form of the word, which a filler that is not a
 * taught word but starts like the answer is taken to be, or a word of another meaning.
 */
function fitsNot(w: WordDef, wrong: string, answer: string): Text | undefined {
  const lower = wrong.toLowerCase();
  if (w.spellings.some((s) => s.toLowerCase() === lower) || (!gloss(wrong) && lower.slice(0, 4) === answer.toLowerCase().slice(0, 4)))
    return t(
      `*${wrong}* is not the form of *${w.head}* this sentence needs: look at the words just before and after the gap.`,
      `这个句子需要的不是 *${wrong}* 这种形式的 *${w.head}*：看看空白前后紧挨着的词。`,
    );
  const other = gloss(wrong);
  if (!other || other === w) return undefined;
  return t(
    `*${wrong}* means “${other.meaning.en}”, which does not make sense in this sentence.`,
    `*${wrong}* 的意思是“${other.meaning["zh-CN"]}”，放进这个句子意思说不通。`,
  );
}

/** interleave orders items by sentence and then by word, so consecutive seeds show different words. */
/** interleave takes the first item of each list, then the second of each, and so on, so that kinds alternate. */
export function interleave<T>(perWord: readonly (readonly T[])[]): readonly T[] {
  const most = Math.max(...perWord.map((items) => items.length));
  const out: T[] = [];
  for (let i = 0; i < most; i++)
    for (const items of perWord) {
      const item = items[i];
      if (item !== undefined) out.push(item);
    }
  return out;
}

function distinct<T>(items: readonly T[], key: (item: T) => string): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** vocabularyTopic builds a vocabulary topic of a level and its batch from the words' data. */
export function vocabularyTopic(spec: VocabularySpec): VocabularyTopic {
  const { id, words } = spec;
  const heads = words.map((w) => w.head);
  if (new Set(heads.map((h) => h.toLowerCase())).size !== heads.length) throw new Error(`${id}: a headword twice`);
  for (const w of words)
    for (const spelling of w.spellings) if (!glossary.has(spelling.toLowerCase())) glossary.set(spelling.toLowerCase(), w);
  const isAlike = (a: WordDef, b: string) => a.alike.includes(b) || (words.find((w) => w.head === b)?.alike.includes(a.head) ?? false);

  const complete = distinct(
    interleave(
      words.map((w) =>
        w.sentences.map(
          (s): ChoiceItem => ({
            prompt: joinText([t("Choose the word that completes the sentence.", "选出能填入句子空白处的词。"), quote(s.gapped)]),
            right: s.answer,
            wrong: s.wrong,
            solution: explained(w, s.full),
            whyNot: (wrong) => fitsNot(w, wrong, s.answer),
          }),
        ),
      ),
    ),
    (item) => item.prompt.en,
  );

  const forMeaning = distinct(
    interleave(
      words.map((w, i) => {
        const others = [...words.slice(i + 1), ...words.slice(0, i)].map((o) => o.head).filter((h) => !isAlike(w, h));
        const sets = [
          w.confusions.slice(0, 2),
          [others[0], others[1]],
          [others[2], others[4] ?? others[3]],
          // A fourth set when the batch has enough other words, so that a batch of ten words still has 30 items.
          ...(others[5] !== undefined && others[4] !== undefined ? [[others[3], others[5]]] : []),
        ];
        return sets.map(
          (wrong): ChoiceItem => ({
            prompt: joinText([
              t("Which word has this meaning?", "哪个词是这个意思？"),
              t(`> ${capitalize(w.meaning.en)}`, `> ${w.meaning["zh-CN"]}`),
            ]),
            right: w.head,
            wrong: wrong.filter((x): x is string => x !== undefined),
            solution: explained(w, w.sentences[0]?.full ?? ""),
            whyNot: meansOther,
          }),
        );
      }),
    ),
    (item) => [item.prompt.en, item.right, ...[...item.wrong].sort()].join("/"),
  );

  const spell = interleave(
    words.map((w) =>
      w.sentences.map((s) => ({
        prompt: joinText([
          t("Type the missing word.", "输入句中缺少的词。"),
          t(`It means: ${w.meaning.en}.`, `意思是：${w.meaning["zh-CN"]}。`),
          quote(s.gapped),
        ]),
        answer: s.answer,
        wrong: s.wrong,
        solution: explained(w, s.full),
      })),
    ),
  );

  for (const [name, n] of [
    ["complete", complete.length],
    ["meaning", forMeaning.length],
    ["spell", spell.length],
  ] as const) {
    if (n < minItems) throw new Error(`${id}: ${name} has ${n} items, fewer than ${minItems}`);
  }
  for (const item of forMeaning) if (item.wrong.length < 2) throw new Error(`${id}: ${item.right} has too few wrong words`);

  const typed: Generator = (rng: Rng): Problem => {
    const item = rng.cycle(spell);
    return {
      prompt: item.prompt,
      answer: { checker: "word-form", expected: [item.answer], input: { kind: "text" } },
      solution: item.solution,
      canonical: item.answer,
      wrong: item.wrong.filter((w) => w.toLowerCase() !== item.answer.toLowerCase()),
    };
  };

  const list = heads.map((h) => `*${h}*`).join(", ");
  const topic: TopicDef = {
    id,
    title: spec.title,
    summary: spec.summary,
    prerequisites: spec.prerequisites,
    encompasses: spec.encompasses ?? [],
    xp: Math.max(10, Math.round(words.length * 1.5)),
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "complete",
        t("Words in sentences", "句子中的词"),
        t(
          `The words of this topic: ${list}. Read the whole sentence before you choose: the words around the gap tell you which word fits.`,
          `本主题的词：${list}。先读完整个句子再选择：空白前后的词会告诉你哪个词合适。`,
        ),
        choiceFrom(complete),
      ),
      point(
        "meaning",
        t("Words and meanings", "词和词义"),
        t(
          "Each word has its own meaning. Read the meaning, then choose the word that has it.",
          "每个词都有自己的意思。读一读词义，再选出意思相符的词。",
        ),
        choiceFrom(forMeaning),
      ),
      point(
        "spell",
        t("Spelling the words", "拼写单词"),
        t(
          "Type the word that fills the gap. Spell it exactly, and use the form the sentence needs, such as *cats* after *two*.",
          "输入填空的词。拼写要准确，并用句子需要的形式，比如 *two* 后面用 *cats*。",
        ),
        typed,
      ),
    ],
  };
  const batch: WordBatch = { topic: id, words: [...new Set(words.flatMap((w) => w.spellings.map((s) => s.toLowerCase())))] };
  return { topic, batch };
}

/**
 * pairUp lists n combinations of the lists' items, item k taking item k of each list modulo its length. With list
 * lengths that share no factor, the first n combinations are all different as long as n is at most their product.
 */
export function pairUp<A, B>(n: number, a: readonly A[], b: readonly B[]): readonly (readonly [A, B])[] {
  return Array.from({ length: n }, (_, k) => [a[k % a.length]!, b[k % b.length]!] as const);
}

/**
 * everyPair pairs every item of `a` with every item of `b`, in diagonals so that neighbors differ in both: the frames of
 * a bank crossed with the words for their slot (E8.3). Every frame must read naturally with every word it is crossed with.
 */
export function everyPair<A, B>(a: readonly A[], b: readonly B[]): readonly (readonly [A, B])[] {
  return Array.from({ length: b.length }, (_, d) => a.map((item, r) => [item, b[(r + d) % b.length]!] as const)).flat();
}

/** everyTriple pairs every item of `a` with every item of `b`, as everyPair does, and gives each pair an item of `c` in turn. */
export function everyTriple<A, B, C>(a: readonly A[], b: readonly B[], c: readonly C[]): readonly (readonly [A, B, C])[] {
  return everyPair(a, b).map(([x, y], k) => [x, y, c[k % c.length]!] as const);
}

/** sentenceCase capitalizes the first letter of a sentence. */
export function sentenceCase(s: string): string {
  return capitalize(s);
}
