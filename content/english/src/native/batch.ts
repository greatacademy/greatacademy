// Vocabulary batches of the native courses: a topic built from a list of words, each with its meaning, a sentence
// that needs it and two words of the same batch a reader might take for it.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typedGenerator } from "@ga/subject-english";
import type { WordBatch } from "../pack.ts";

/** BatchWord is one word of a batch. */
export interface BatchWord {
  readonly word: string;
  /** forms are its other spellings a passage may use, such as plurals and verb endings. */
  readonly forms?: readonly string[];
  /** meaning is what it means, in English and in Chinese. */
  readonly meaning: readonly [en: string, zh: string];
  /** sentences are three different sentences that each need the word itself, unchanged, in their gap, written ___. */
  readonly sentences: readonly [string, string, string];
  /** confusions are two words of the same batch a reader might choose instead. */
  readonly confusions: readonly [string, string];
}

/** BatchSpec describes a vocabulary topic of a native course. */
export interface BatchSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  /** domain names what the words are about, in English and in Chinese, for the explanations. */
  readonly domain: readonly [en: string, zh: string];
  readonly prerequisites: readonly string[];
  readonly encompasses: TopicDef["encompasses"];
  readonly words: readonly BatchWord[];
}

/** batchTopic builds a vocabulary topic of three knowledge points: what each word means in a sentence, choosing it for a sentence, and spelling it; each has an item for every sentence of every word. */
export function batchTopic(spec: BatchSpec): TopicDef {
  const byWord = new Map(spec.words.map((w) => [w.word, w] as const));
  const find = (word: string): BatchWord => {
    const found = byWord.get(word);
    if (found === undefined) throw new Error(`${spec.id}: ${word} is not in the batch`);
    return found;
  };
  for (const w of spec.words) {
    for (const s of w.sentences) if (!s.includes("___")) throw new Error(`${spec.id}: a sentence of ${w.word} has no gap`);
    for (const c of w.confusions) find(c);
  }
  const list = (locale: 0 | 1) => spec.words.map((w) => `- **${w.word}**: ${locale === 0 ? w.meaning[0] : `${w.meaning[1]}`}`).join("\n");
  // Items go word by word within each round of sentences, so consecutive seeds never show the same word.
  const rounds = [0, 1, 2] as const;
  const meaningBank: readonly ChoiceItem[] = rounds.flatMap((r) =>
    spec.words.map(
      (w): ChoiceItem => [w.sentences[r].replace("___", `**${w.word}**`), w.meaning[0], w.confusions.map((c) => find(c).meaning[0])],
    ),
  );
  const useBank: readonly ChoiceItem[] = rounds.flatMap((r) =>
    spec.words.map((w): ChoiceItem => [w.sentences[r], w.word, [...w.confusions]]),
  );
  const spellBank: readonly TypedItem[] = rounds.flatMap((r) =>
    spec.words.map((w) => ({
      shown: w.sentences[r],
      accepted: [w.word],
      canonical: w.word,
      wrong: [...w.confusions],
      instruction: t(`It means: ${w.meaning[0]}.`, `意思是：${w.meaning[0]}（${w.meaning[1]}）。`),
    })),
  );
  const zhMeaning = (en: string) => spec.words.find((w) => w.meaning[0] === en)?.meaning[1] ?? en;
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    prerequisites: [...spec.prerequisites],
    encompasses: [...spec.encompasses],
    xp: 12,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        `${spec.id}-meanings`,
        t("What They Mean", "它们的含义"),
        t(
          `These ten words are used when people read and write about ${spec.domain[0]}.\n\n${list(0)}`,
          `这十个词常用于阅读和书写有关${spec.domain[1]}的内容。\n\n${list(1)}`,
        ),
        choiceGenerator(
          t("What does the word in bold mean in this sentence?", "加粗的词在这个句子里是什么意思？"),
          meaningBank,
          (right) => t(`It means **${right}**.`, `它的意思是 **${right}**（${zhMeaning(right)}）。`),
          (wrong) =>
            t(
              `“${wrong}” is what a different word of this batch means. Put it in place of the word in bold and the sentence stops making sense.`,
              `“${wrong}” 是这组词中另一个词的意思（${zhMeaning(wrong)}）。把它代入加粗词的位置，句子就说不通了。`,
            ),
        ),
      ),
      point(
        `${spec.id}-use`,
        t("Using Them", "使用它们"),
        t(
          "Read the whole sentence before choosing. Ask what the gap must name or do, and then choose the word whose meaning completes the thought. Two words of a batch often belong to the same subject, so the subject alone does not decide.",
          "先读完整个句子再选择。想一想空格要表示什么事物或动作，再选择意思能使句子完整的词。同一组词常常属于同一主题，所以只看主题还不能决定。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          useBank,
          (right, shown) => {
            const w = find(right);
            return t(
              `${shown.replace("___", `**${right}**`)} *${right}* means ${w.meaning[0]}.`,
              `${shown.replace("___", `**${right}**`)} *${right}* 的意思是${w.meaning[1]}。`,
            );
          },
          (wrong) => {
            const w = find(wrong);
            return t(
              `“${wrong}” means ${w.meaning[0]}, which does not complete the thought of this sentence.`,
              `“${wrong}” 的意思是${w.meaning[1]}，放进这个句子意思不通。`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-spelling`,
        t("Spelling Them", "拼写它们"),
        t(
          "Knowing a word means being able to write it as well as read it. Say it slowly, part by part, and write each part.",
          "掌握一个词，既要会读，也要会写。慢慢地、一部分一部分地读出来，再写下每一部分。",
        ),
        typedGenerator(
          "word-form",
          t("Type the word of this batch that completes the sentence.", "输入这组词中能补全句子的词。"),
          spellBank,
          (right, shown) => t(shown.replace("___", `**${right}**`), `正确的词是 **${right}**：${shown.replace("___", `**${right}**`)}`),
        ),
      ),
    ],
  };
}

/** batchWords lists every spelling a batch teaches, for the packs' check that each word is taught once. */
export function batchWords(spec: BatchSpec): WordBatch {
  return { topic: spec.id, words: spec.words.flatMap((w) => [w.word, ...(w.forms ?? [])]) };
}
