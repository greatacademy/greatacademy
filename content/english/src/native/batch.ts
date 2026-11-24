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
  /** clues are complete, natural phrases summarizing what each of the three sentences describes. */
  readonly clues?: readonly [string, string, string];
  /** contrast names the closest look-alike in this batch and how the two differ, in English and Chinese. */
  readonly contrast?: readonly [en: string, zh: string];
  /** conflicts give the specific reason each of the two confusions clashes with this word's meaning or scene. */
  readonly conflicts?: readonly [readonly [en: string, zh: string], readonly [en: string, zh: string]];
  /** spelling gives the phonics sound-by-sound breakdown and the real spelling trap in English and Chinese. */
  readonly spelling?: readonly [chunks: string, trapEn: string, trapZh: string];
}

/** BatchSpec describes a vocabulary topic of a native course. */
export interface BatchSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  /** intro is a short hand-written scene using one word of the batch. */
  readonly intro?: Text;
  /** watchOut gives hand-written cautions naming real confusing pairs or tricky spellings in this batch. */
  readonly watchOut?: {
    readonly meanings: Text;
    readonly use: Text;
    readonly spelling: Text;
  };
  /** domain names what the words are about, in English and in Chinese, for the explanations. */
  readonly domain: readonly [en: string, zh: string];
  readonly prerequisites: readonly string[];
  readonly encompasses: TopicDef["encompasses"];
  readonly words: readonly BatchWord[];
  /** xp is what the topic earns, 12 unless given; a grade course gives about 1.5 a word, at least 10. */
  readonly xp?: number;
}

const stripEnd = (s: string) => s.replace(/[.。]+$/u, "");
const capFirst = (s: string) => (s.length > 0 ? s[0]!.toUpperCase() + s.slice(1) : s);

/** wordPool indexes every word across a set of batches so a topic can borrow same-part-of-speech distractors from the same grade. */
export function wordPool(specs: readonly BatchSpec[]): ReadonlyMap<string, BatchWord> {
  const pool = new Map<string, BatchWord>();
  for (const s of specs) for (const w of s.words) if (!pool.has(w.word)) pool.set(w.word, w);
  return pool;
}

/** batchTopic builds a vocabulary topic of three knowledge points: what each word means in a sentence, choosing it for a sentence, and spelling it; each has an item for every sentence of every word. */
export function batchTopic(spec: BatchSpec): TopicDef {
  return buildBatchTopic(spec);
}

/** batchTopicWithPool builds a vocabulary topic that can also borrow same-part-of-speech distractors from a same-grade word pool. */
export function batchTopicWithPool(spec: BatchSpec, pool: ReadonlyMap<string, BatchWord>): TopicDef {
  return buildBatchTopic(spec, pool);
}

function buildBatchTopic(spec: BatchSpec, pool?: ReadonlyMap<string, BatchWord>): TopicDef {
  const byWord = new Map(spec.words.map((w) => [w.word, w] as const));
  const find = (word: string): BatchWord => {
    const found = byWord.get(word) ?? pool?.get(word);
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
  const meaningMeta = new Map<string, { readonly word: BatchWord; readonly clue?: string }>();
  const useMeta = new Map<string, { readonly word: BatchWord; readonly clue?: string }>();
  const meaningBank: readonly ChoiceItem[] = rounds.flatMap((r) =>
    spec.words.map((w): ChoiceItem => {
      const shown = w.sentences[r].replace("___", `**${w.word}**`);
      meaningMeta.set(shown, { word: w, ...(w.clues ? { clue: w.clues[r] } : {}) });
      return [shown, w.meaning[0], w.confusions.map((c) => find(c).meaning[0])];
    }),
  );
  const useBank: readonly ChoiceItem[] = rounds.flatMap((r) =>
    spec.words.map((w): ChoiceItem => {
      const shown = w.sentences[r];
      useMeta.set(shown, { word: w, ...(w.clues ? { clue: w.clues[r] } : {}) });
      return [shown, w.word, [...w.confusions]];
    }),
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
  const findByMeaning = (en: string): BatchWord | undefined => {
    const local = spec.words.find((w) => w.meaning[0] === en);
    if (local) return local;
    if (!pool) return undefined;
    for (const w of pool.values()) if (w.meaning[0] === en) return w;
    return undefined;
  };
  const zhMeaning = (en: string) => findByMeaning(en)?.meaning[1] ?? en;
  const firstWord = spec.words[0]!;
  const secondWord = spec.words[1] ?? firstWord;
  const thirdWord = spec.words[2] ?? secondWord;
  const intro =
    spec.intro ??
    t(
      `When you read or write about ${spec.domain[0]}, the right word makes your meaning exact—knowing **${firstWord.word}** (${firstWord.meaning[0]}) lets you picture the idea right away. In this topic, you will learn the meanings of these ${spec.words.length} words, choose the one that fits a sentence, and spell each one cleanly.`,
      `阅读和书写有关${spec.domain[1]}的内容时，用对词能让意思精准得多——比如认识 **${firstWord.word}**（${firstWord.meaning[1]}），就能立刻抓住句子的画面。这节课，你会掌握这 ${spec.words.length} 个词的词义、在句子里准确选用，并把它们拼写正确。`,
    );
  const watchMeanings =
    spec.watchOut?.meanings ??
    t(
      "Words in the same set often share a topic, so test the meaning inside the whole sentence rather than matching by topic alone.",
      "同一组词常属于相近的主题，不要只看主题蒙猜，要把释义放回整句话里验证。",
    );
  const watchUse =
    spec.watchOut?.use ??
    t(
      "Two words in the same batch often belong to the same subject, so check the exact meaning each word brings to the blank.",
      "同组词常常属于同一主题，只看主题不够，要核对每个词放进空格后的具体意思。",
    );
  const watchSpelling =
    spec.watchOut?.spelling ??
    t("Watch for silent letters, double letters, and vowel pairs when you type the word.", "输入时留心不发音字母、双写辅音和元音组合。");
  const meaningExampleEn = secondWord.clues
    ? `For example, *"${secondWord.sentences[0].replace("___", `**${secondWord.word}**`)}"* describes ${secondWord.clues[0]}, showing that **${secondWord.word}** means *${secondWord.meaning[0]}*.`
    : `For example, in *"${secondWord.sentences[0].replace("___", `**${secondWord.word}**`)}"*, **${secondWord.word}** means *${secondWord.meaning[0]}*.`;
  const meaningExampleZh = secondWord.clues
    ? `例如 *"${secondWord.sentences[0].replace("___", `**${secondWord.word}**`)}"* 描写的是“${secondWord.clues[0]}”，说明 **${secondWord.word}** 的意思是“${secondWord.meaning[1]}”。`
    : `例如在 *"${secondWord.sentences[0].replace("___", `**${secondWord.word}**`)}"* 中，**${secondWord.word}** 的意思是“${secondWord.meaning[1]}”。`;
  const useExampleEn = thirdWord.clues
    ? `For example, *"${thirdWord.sentences[0]}"* describes ${thirdWord.clues[0]}, calling for **${thirdWord.word}** (*${thirdWord.meaning[0]}*).`
    : `For example, in *"${thirdWord.sentences[0]}"*, the clues call for **${thirdWord.word}** (*${thirdWord.meaning[0]}*).`;
  const useExampleZh = thirdWord.clues
    ? `例如 *"${thirdWord.sentences[0]}"* 描写的是“${thirdWord.clues[0]}”，空格应填 **${thirdWord.word}**（${thirdWord.meaning[1]}）。`
    : `例如在 *"${thirdWord.sentences[0]}"* 里，上下文指向 **${thirdWord.word}**（${thirdWord.meaning[1]}）。`;
  const spellExampleEn = firstWord.spelling
    ? `To spell a word accurately, sound it out part by part and watch its tricky spot—for example, **${firstWord.word}** breaks into **${firstWord.spelling[0]}** (${stripEnd(firstWord.spelling[1])}).`
    : `To spell a word accurately, say it slowly part by part and picture its tricky letters—for example, **${firstWord.word}** has ${firstWord.word.length} letters, starting with **${firstWord.word[0]}** and ending with **${firstWord.word.at(-1)}**.`;
  const spellExampleZh = firstWord.spelling
    ? `要把词拼准确，按音逐段拆读并盯住难拼处——比如 **${firstWord.word}** 拆成 **${firstWord.spelling[0]}**（${stripEnd(firstWord.spelling[2])}）。`
    : `要把词拼准确，可以慢慢分音节读出来，并留意容易写错的字母——比如 **${firstWord.word}** 一共 ${firstWord.word.length} 个字母，以 **${firstWord.word[0]}** 开头、以 **${firstWord.word.at(-1)}** 结尾。`;
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro,
    prerequisites: [...spec.prerequisites],
    encompasses: [...spec.encompasses],
    xp: spec.xp ?? 12,
    strand: "vocabulary",
    knowledgePoints: [
      point(
        `${spec.id}-meanings`,
        t("What They Mean", "它们的含义"),
        t(
          `These ${spec.words.length} words belong to ${spec.domain[0]}. ${meaningExampleEn}\n\n${list(0)}\n\n> **Watch out.** ${watchMeanings.en}`,
          `这 ${spec.words.length} 个词都与${spec.domain[1]}有关。${meaningExampleZh}\n\n${list(1)}\n\n> **注意。** ${watchMeanings["zh-CN"]}`,
        ),
        choiceGenerator(
          t("What does the word in bold mean in this sentence?", "加粗的词在这个句子里是什么意思？"),
          meaningBank,
          (right, shown) => {
            const meta = meaningMeta.get(shown);
            const w = meta?.word ?? spec.words.find((item) => item.meaning[0] === right);
            if (w && meta?.clue) {
              const contrastEn = w.contrast ? ` (${stripEnd(w.contrast[0])}.)` : "";
              const contrastZh = w.contrast ? `（${stripEnd(w.contrast[1])}。）` : "";
              const c0 = find(w.confusions[0]);
              const c1 = find(w.confusions[1]);
              return t(
                `The sentence describes ${meta.clue}, which shows that **${w.word}** means **${right}**.${contrastEn}\n\n**Check.** Put “${right}” in place of **${w.word}** and read the sentence again—it keeps the same scene, whereas “${c0.meaning[0]}” (${c0.word}) or “${c1.meaning[0]}” (${c1.word}) changes what is happening.`,
                `句中描写的是“${meta.clue}”，可见 **${w.word}** 在这里的意思是“**${w.meaning[1]}**”（${right}）。${contrastZh}\n\n**检验。** 把“${w.meaning[1]}”代回原句替换 **${w.word}** 再读一遍——句意完全贴合；如果换成“${c0.meaning[1]}”（${c0.word}）或“${c1.meaning[1]}”（${c1.word}），整句话的意思就会变样。`,
              );
            }
            const word = w?.word ?? "";
            return t(
              `In this sentence, **${word}** means **${right}**.\n\n**Check.** Substitute *${right}* in place of **${word}** in *${shown}*: the sentence keeps the exact same sense, while the other two meanings change what the sentence says.`,
              `在这个句子里，**${word}** 的意思是 **${right}**（${zhMeaning(right)}）。\n\n**检验。** 把“${zhMeaning(right)}”代入 *${shown}* 中 **${word}** 的位置：整句话的意思保持不变，而另外两个释义放进去会改变句意。`,
            );
          },
          (wrong, _right, shown, position) => {
            const meta = meaningMeta.get(shown);
            const other = findByMeaning(wrong);
            const conflict = meta?.word.conflicts?.[position];
            if (conflict && other) {
              return t(
                `That is what **${other.word}** means—${stripEnd(conflict[0])}.`,
                `那是 **${other.word}** 的意思——${stripEnd(conflict[1])}。`,
              );
            }
            if (meta?.clue && other) {
              return t(
                `“${wrong}” is what **${other.word}** means, but the sentence describes ${meta.clue}—not ${wrong}.`,
                `“${other.meaning[1]}”是 **${other.word}** 的意思，但句中写的是“${meta.clue}”，和“${other.meaning[1]}”对不上。`,
              );
            }
            return t(
              `“${wrong}” is the meaning of **${other?.word ?? "another word"}**, not the bold word here—plugging it into the sentence changes the meaning.`,
              `“${wrong}”是 **${other?.word ?? "另一个词"}** 的意思（${zhMeaning(wrong)}），不是这里加粗词的意思，代入句子意思会不对。`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-use`,
        t("Using Them", "使用它们"),
        t(
          `Read the whole sentence before choosing, and check what the blank needs to name or do. ${useExampleEn}\n\n> **Watch out.** ${watchUse.en}`,
          `先读完整句话再选，看空格需要什么词性和意思。${useExampleZh}\n\n> **注意。** ${watchUse["zh-CN"]}`,
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          useBank,
          (right, shown) => {
            const w = find(right);
            const meta = useMeta.get(shown);
            const completed = shown.replace("___", `**${right}**`);
            const c0 = find(w.confusions[0]);
            const c1 = find(w.confusions[1]);
            if (meta?.clue && w.conflicts) {
              const contrastEn = w.contrast ? ` (${stripEnd(w.contrast[0])}.)` : "";
              const contrastZh = w.contrast ? `（${stripEnd(w.contrast[1])}。）` : "";
              const [f0, f1] = w.conflicts;
              return t(
                `The sentence describes ${meta.clue}, which calls for **${right}** (*${w.meaning[0]}*): ${completed}${contrastEn}\n\n**Check.** Test the other two choices in the blank: ${stripEnd(f0[0])}; and ${stripEnd(f1[0])}.`,
                `句中描写的是“${meta.clue}”，空格应填 **${right}**（${w.meaning[1]}）：${completed}${contrastZh}\n\n**检验。** 把另外两个词代进空格排除：${stripEnd(f0[1])}；${stripEnd(f1[1])}。`,
              );
            }
            if (meta?.clue) {
              const contrastEn = w.contrast ? ` (${stripEnd(w.contrast[0])}.)` : "";
              const contrastZh = w.contrast ? `（${stripEnd(w.contrast[1])}。）` : "";
              return t(
                `The sentence describes ${meta.clue}, which calls for **${right}** (*${w.meaning[0]}*): ${completed}${contrastEn}\n\n**Check.** Put *${c0.word}* (*${c0.meaning[0]}*) or *${c1.word}* (*${c1.meaning[0]}*) in the blank—neither fits what the sentence describes.`,
                `句中描写的是“${meta.clue}”，空格应填 **${right}**（${w.meaning[1]}）：${completed}${contrastZh}\n\n**检验。** 把 *${c0.word}*（${c0.meaning[1]}）或 *${c1.word}*（${c1.meaning[1]}）放进空格，都和句意冲突。`,
              );
            }
            return t(
              `${completed}\n\n**${right}** means *${w.meaning[0]}*, which fits the blank.\n\n**Check.** Reread *${completed}* with the meaning in mind: the sentence makes clear sense, whereas *${c0.word}* (${c0.meaning[0]}) and *${c1.word}* (${c1.meaning[0]}) do not fit here.`,
              `${completed}\n\n**${right}** 的意思是“${w.meaning[1]}”，正好补全句意。\n\n**检验。** 带着词义再读一遍 *${completed}*：意思通顺；而 *${c0.word}*（${c0.meaning[1]}）和 *${c1.word}*（${c1.meaning[1]}）放进去都说不通。`,
            );
          },
          (wrong, _right, shown, position) => {
            const w = find(wrong);
            const meta = useMeta.get(shown);
            const conflict = meta?.word.conflicts?.[position];
            if (conflict) {
              return t(`${capFirst(stripEnd(conflict[0]))}.`, `${stripEnd(conflict[1])}。`);
            }
            if (meta?.clue) {
              return t(
                `**${wrong}** means *${w.meaning[0]}*, which does not match ${meta.clue}.`,
                `**${wrong}** 指“${w.meaning[1]}”，和句中描写的“${meta.clue}”对不上。`,
              );
            }
            return t(
              `**${wrong}** means *${w.meaning[0]}*, which does not match what this sentence describes.`,
              `**${wrong}** 的意思是“${w.meaning[1]}”，放进这个句子里和上下文意思不符。`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-spelling`,
        t("Spelling Them", "拼写它们"),
        t(`${spellExampleEn}\n\n> **Watch out.** ${watchSpelling.en}`, `${spellExampleZh}\n\n> **注意。** ${watchSpelling["zh-CN"]}`),
        typedGenerator(
          "word-form",
          t("Type the word of this batch that completes the sentence.", "输入这组词中能补全句子的词。"),
          spellBank,
          (right, shown) => {
            const w = find(right);
            const meta = useMeta.get(shown);
            const completed = shown.replace("___", `**${right}**`);
            if (w.spelling && meta?.clue) {
              const [chunks, trapEn, trapZh] = w.spelling;
              return t(
                `The sentence describes ${meta.clue}, calling for **${right}** (*${w.meaning[0]}*): ${completed}\n\n**Check.** Sound it out piece by piece—**${chunks}**—and double-check ${stripEnd(trapEn)}.`,
                `句中描写的是“${meta.clue}”，应填 **${right}**（${w.meaning[1]}）：${completed}\n\n**检验。** 按音逐段拆读——**${chunks}**——重点核对${stripEnd(trapZh)}。`,
              );
            }
            return t(
              `${completed}\n\nThe sentence calls for the word meaning *${w.meaning[0]}*, spelled **${right}**.\n\n**Check.** Check your spelling letter by letter: **${right}** has ${right.length} letters, starts with **${right[0]}**, and ends with **${right.at(-1)}**.`,
              `${completed}\n\n空格需要意思是“${w.meaning[1]}”的词，拼作 **${right}**。\n\n**检验。** 逐字母核对拼写：**${right}** 共 ${right.length} 个字母，以 **${right[0]}** 开头、以 **${right.at(-1)}** 结尾。`,
            );
          },
        ),
      ),
    ],
  };
}

/** batchWords lists every spelling a batch teaches, for the packs' check that each word is taught once. */
export function batchWords(spec: BatchSpec): WordBatch {
  return { topic: spec.id, words: spec.words.flatMap((w) => [w.word, ...(w.forms ?? [])]) };
}
