// Word topics (docs/chinese-curriculum.md §6): a batch of 10 words of a theme, with their meaning, their use in a
// sentence, a near-synonym and an antonym. One knowledge point names the word a meaning describes, one chooses the word a
// sentence needs, and one tells a word's near-synonym from its antonym. The wrong options are the batch's other words,
// three at a time in four different sets, or the near-synonyms and antonyms of other words.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

/** Word is a word with its reading, meaning, two sentences that use it, a near-synonym and an antonym. */
export interface Word {
  readonly text: string;
  readonly pinyin: string;
  readonly meaning: Text;
  /** sentences use the word where they have ＿＿. */
  readonly sentences: readonly [string, string];
  readonly synonym: string;
  readonly antonym: string;
}

/** GAP is where a sentence of a word puts it. */
export const GAP = "＿＿";

/**
 * parseWords reads word data, a line a word, its fields separated by ` | `: the word, its pinyin, its meaning in Chinese
 * and in English, without a full stop, two sentences with ＿＿ where it goes, its near-synonym and its antonym.
 */
export function parseWords(data: string): readonly Word[] {
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const fields = line.split(" | ").map((f) => f.trim());
      if (fields.length !== 8) throw new Error(`word data: ${line}`);
      const [text, pinyin, zh, en, first, second, synonym, antonym] = fields as [
        string,
        string,
        string,
        string,
        string,
        string,
        string,
        string,
      ];
      if (pinyin.split(" ").length !== [...text].length) throw new Error(`word data: the pinyin of ${text}`);
      for (const s of [first, second]) if (s.split(GAP).length !== 2) throw new Error(`word data: a sentence of ${text}: ${s}`);
      if (new Set([text, synonym, antonym]).size !== 3) throw new Error(`word data: the relations of ${text}`);
      return { text, pinyin, meaning: t(en, zh), sentences: [first, second], synonym, antonym };
    });
}

/** WordSpec describes a word topic. */
export interface WordSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly words: readonly Word[];
}

/** SETS is how many sets of wrong options each item is asked with. */
const SETS = 4;

/** neighbours are four sets of three of the other words of a batch, each set different. */
function neighbours<T>(items: readonly T[], i: number): readonly (readonly T[])[] {
  const others = items.filter((_, j) => j !== i);
  const n = others.length;
  return Array.from({ length: SETS }, (_, k) => [others[k % n]!, others[(k + 2) % n]!, others[(k + 5) % n]!]);
}

/** wordTopic builds a word topic; its banks go word by word within each round, so consecutive seeds never show the same one. */
export function wordTopic(spec: WordSpec): TopicDef {
  const { words } = spec;
  if (words.length < 10) throw new Error(`${spec.id}: a word batch needs 10 words`);
  const all = new Set(words.flatMap((w) => [w.text, w.synonym, w.antonym]));
  if (all.size !== words.length * 3) throw new Error(`${spec.id}: a word, near-synonym or antonym appears twice`);
  const byText = new Map(words.map((w) => [w.text, w]));
  const sets = words.map((_, i) => neighbours(words, i));
  const rounds = Array.from({ length: SETS }, (_, k) => k);
  const meaningBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    words.map((word, i): ChoiceItem => [word.meaning["zh-CN"], word.text, sets[i]![k]!.map((o) => o.text)]),
  );
  const useBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    words.map((word, i): ChoiceItem => [word.sentences[k % 2]!, word.text, sets[i]![k]!.map((o) => o.text)]),
  );
  // Asking for a near-synonym offers the antonym and other words' antonyms; asking for an antonym, the near-synonym and
  // other words' near-synonyms. Neither kind of distractor can be right for the other word.
  const relationBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    words.map((word, i): ChoiceItem => {
      const others = sets[i]![k]!.slice(0, 2);
      return k % 2 === 0
        ? [`与“${word.text}”意思相近的词语是：`, word.synonym, [word.antonym, ...others.map((o) => o.antonym)]]
        : [`与“${word.text}”意思相反的词语是：`, word.antonym, [word.synonym, ...others.map((o) => o.synonym)]];
    }),
  );
  const relationOf = new Map<string, { readonly word: Word; readonly near: boolean }>(
    words.flatMap((w) => [
      [w.synonym, { word: w, near: true }],
      [w.antonym, { word: w, near: false }],
    ]),
  );
  const titles = words.map((w) => w.text).join("、");
  const meaningList = words.map((w) => `- **${w.text}**（${w.pinyin}）：${w.meaning["zh-CN"]}`).join("\n");
  const meaningListEn = words.map((w) => `- **${w.text}** (${w.pinyin}): ${w.meaning.en}`).join("\n");
  const useList = words.map((w) => `- ${w.sentences[0].replace(GAP, `**${w.text}**`)}`).join("\n");
  const relationList = words.map((w) => `- **${w.text}**：近义词“${w.synonym}”，反义词“${w.antonym}”`).join("\n");
  const relationListEn = words.map((w) => `- **${w.text}**: near-synonym ${w.synonym}, antonym ${w.antonym}`).join("\n");
  const meaningOf = (text: string): string => byText.get(text)?.meaning["zh-CN"] ?? "";
  const meaningOfEn = (text: string): string => byText.get(text)?.meaning.en ?? "";
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `The words ${titles}: what they mean, where they fit, and their near-synonyms and antonyms.`,
      `词语“${titles}”：理解意思，在句子中恰当运用，认识近义词和反义词。`,
    ),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: words.length,
    strand: "words",
    knowledgePoints: [
      point(
        `${spec.id}-meaning`,
        t("What They Mean", "理解词义"),
        t(
          `Know each word by what it means, not only by how it sounds.\n\n${meaningListEn}`,
          `理解词语的意思，才能用好词语。\n\n${meaningList}`,
        ),
        choiceGenerator(
          t("Which word has this meaning?", "哪个词语是这个意思？"),
          meaningBank,
          (right) => t(`**${right}** means: ${meaningOfEn(right)}.`, `“**${right}**”的意思是：${meaningOf(right)}。`),
          (wrong) => t(`${wrong} means: ${meaningOfEn(wrong)}.`, `“${wrong}”的意思是：${meaningOf(wrong)}。`),
        ),
      ),
      point(
        `${spec.id}-use`,
        t("Using Them", "选词填空"),
        t(
          `Choose a word by what the sentence says and by the words around the gap.\n\n${useList}`,
          `选词填空要看句子的意思，也要看词语和前后的词能不能搭配。\n\n${useList}`,
        ),
        choiceGenerator(
          t("Which word fits the gap?", "横线处填哪个词语最恰当？"),
          useBank,
          (right) => t(`**${right}** fits: it means ${meaningOfEn(right)}.`, `填“**${right}**”，它的意思是：${meaningOf(right)}。`),
          (wrong) =>
            t(
              `${wrong} means ${meaningOfEn(wrong)}, which is not what the sentence says.`,
              `“${wrong}”的意思是${meaningOf(wrong)}，放在这里不合适。`,
            ),
        ),
      ),
      point(
        `${spec.id}-relations`,
        t("Near-Synonyms and Antonyms", "近义词和反义词"),
        t(
          `A near-synonym means nearly the same; an antonym means the opposite.\n\n${relationListEn}`,
          `意思相同或相近的词是近义词，意思相反或相对的词是反义词。\n\n${relationList}`,
        ),
        choiceGenerator(
          t("Choose the word asked for.", "按要求选择词语。"),
          relationBank,
          (right) => {
            const r = relationOf.get(right);
            const word = r?.word.text ?? "";
            return r?.near
              ? t(`${right} means nearly the same as ${word}.`, `“${right}”和“${word}”意思相近。`)
              : t(`${right} means the opposite of ${word}.`, `“${right}”和“${word}”意思相反。`);
          },
          (wrong) => {
            const r = relationOf.get(wrong);
            const word = r?.word.text ?? "";
            return r?.near
              ? t(`${wrong} means nearly the same as ${word}.`, `“${wrong}”是“${word}”的近义词。`)
              : t(`${wrong} is the antonym of ${word}.`, `“${wrong}”是“${word}”的反义词。`);
          },
        ),
      ),
    ],
  };
}
