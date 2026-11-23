// Word topics (docs/chinese-curriculum.md §6): a batch of 10 words of a theme, with their meaning, their use in a
// sentence, a near-synonym and an antonym. One knowledge point names the word a meaning describes, one chooses the word a
// sentence needs, and one tells a word's near-synonym from its antonym. The wrong options are the batch's other words,
// three at a time in four different sets, or the near-synonyms and antonyms of other words.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, joinPinyin, point, spokenSyllables, zhQuote } from "@ga/subject-chinese";

import { type Clue, clueOf } from "./clues.ts";

/** Word is a word with its reading, meaning, two sentences that use it, a near-synonym and an antonym. */
export interface Word {
  readonly text: string;
  /** pinyin is written as one word (see joinPinyin). */
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
      return {
        text,
        pinyin: joinPinyin(spokenSyllables(text, pinyin.split(" "))),
        meaning: t(en, zh),
        sentences: [first, second],
        synonym,
        antonym,
      };
    });
}

/** WordSpec describes a word topic. */
export interface WordSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly words: readonly Word[];
  /** clues are the clues of the gap sentences, by clueKey; every sentence of the batch has one. */
  readonly clues: ReadonlyMap<string, Clue>;
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
  // A sentence is asked against the other words of the batch that cannot fill its gap, four sets of three.
  const clueAt = new Map<string, Clue>();
  for (const w of words) for (const n of [1, 2]) clueAt.set(w.sentences[n - 1]!, clueOf(spec.clues, w.text, n, spec.id));
  for (const [sentence, c] of clueAt)
    for (const f of c.fits) if (!byText.has(f)) throw new Error(`${spec.id}: ${f}, said to fit ${sentence}, is not in the batch`);
  const useBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    words.map((word, i): ChoiceItem => {
      const sentence = word.sentences[k % 2]!;
      const fits = new Set(clueAt.get(sentence)!.fits);
      const others = words.filter((o, j) => j !== i && !fits.has(o.text));
      if (others.length < 7) throw new Error(`${spec.id}: too few words that cannot fill ${sentence}`);
      return [
        sentence,
        word.text,
        [others[k % others.length]!, others[(k + 2) % others.length]!, others[(k + 5) % others.length]!].map((o) => o.text),
      ];
    }),
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
  const first = words[0]!;
  const mate = words[1]!;
  const firstClue = clueAt.get(first.sentences[0])!;
  const misfit = words.find((w) => w !== first && !firstClue.fits.includes(w.text))!;
  const put = (sentence: string, word: string): string => sentence.replace(GAP, word);
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `The words ${titles}: what they mean, where they fit, and their near-synonyms and antonyms.`,
      `词语“${titles}”：理解意思，在句子中恰当运用，认识近义词和反义词。`,
    ),
    intro: t(
      `These ${words.length} words go together by theme. Take **${first.text}** (${first.pinyin}): it means "${first.meaning.en}", as in ${put(first.sentences[0], first.text)} Its near-synonym is ${first.synonym} and its antonym ${first.antonym}. For each word you will learn what it means, where it fits in a sentence, and which words mean nearly the same or the opposite.\n\n${meaningListEn}`,
      `这${words.length}个词语按主题放在一起。比如 **${first.text}**（${first.pinyin}）：意思是${first.meaning["zh-CN"]}，可以说：${put(first.sentences[0], first.text)}它的近义词是“${first.synonym}”，反义词是“${first.antonym}”。每个词都要理解意思，会在句子里用，还要认识它的近义词和反义词。\n\n${meaningList}`,
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
          `Know each word by what it means, not only by how it sounds. Take "${first.meaning.en}": that is **${first.text}**, as in ${put(first.sentences[0], first.text)}\n\n${meaningListEn}\n\n> **Watch out.** Words of one theme are close: ${first.text} means "${first.meaning.en}", but ${mate.text} means "${mate.meaning.en}". Match the whole meaning before you choose.`,
          `理解词语的意思，才能用好词语。比如“${first.meaning["zh-CN"]}”，说的就是 **${first.text}**：${put(first.sentences[0], first.text)}\n\n${meaningList}\n\n> **注意。** 同一主题的词意思挨得近：“${first.text}”是${first.meaning["zh-CN"]}，“${mate.text}”却是${mate.meaning["zh-CN"]}。要把整个意思对上再选。`,
        ),
        choiceGenerator(
          t("Which word has this meaning?", "哪个词语是这个意思？"),
          meaningBank,
          (right) => {
            const w = byText.get(right)!;
            return t(
              `**${right}** (${w.pinyin}) means: ${meaningOfEn(right)}.\n\n**Check.** Put it in a sentence: ${put(w.sentences[0], right)} It reads well with that meaning.`,
              `“**${right}**”（${w.pinyin}）的意思是：${meaningOf(right)}。\n\n**检验。** 放进句子里读一读：${put(w.sentences[0], right)}按这个意思读，句子通顺。`,
            );
          },
          (wrong, right) =>
            t(
              `${wrong} means "${meaningOfEn(wrong)}", not "${meaningOfEn(right)}".`,
              `“${wrong}”的意思是${meaningOf(wrong)}，不是题目说的意思。`,
            ),
        ),
      ),
      point(
        `${spec.id}-use`,
        t("Using Them", "选词填空"),
        t(
          `Choose a word by what the sentence says and by the words around the gap. Take ${first.sentences[0]} ${firstClue.why.en} So it takes ${first.text}: ${put(first.sentences[0], first.text)}\n\n${useList}\n\n> **Watch out.** A word of the same theme can seem to fit, as ${misfit.text} does there. ${firstClue.why.en} ${misfit.text} means "${misfit.meaning.en}", so it does not fit. Find what in the sentence decides the word before you choose.`,
          `选词填空要看句子的意思，也要看词语和前后的词能不能搭配。比如${zhQuote(first.sentences[0])}：${firstClue.why["zh-CN"]}，所以填 **${first.text}**：${put(first.sentences[0], first.text)}\n\n${useList}\n\n> **注意。** 同一主题的词乍一看也像能填：${firstClue.why["zh-CN"]}，而“${misfit.text}”的意思是${misfit.meaning["zh-CN"]}，对不上。选之前先找出句子里决定用词的地方。`,
        ),
        choiceGenerator(
          t("Which word fits the gap?", "横线处填哪个词语最恰当？"),
          useBank,
          (right, shown) => {
            const c = clueAt.get(shown)!;
            return t(
              `**${right}** fits: ${put(shown, right)}

${c.why.en} ${right} means ${meaningOfEn(right)}.\n\n**Check.** Read the gap as that meaning: ${put(shown, `[${meaningOfEn(right)}]`)} It still says the same.`,
              `填“**${right}**”：${put(shown, right)}${c.why["zh-CN"]}，“${right}”的意思正是${meaningOf(right)}。\n\n**检验。** 把横线换成词义来读：${zhQuote(put(shown, `（${meaningOf(right)}）`))}，意思仍然说得通。`,
            );
          },
          (wrong, _right, shown) => {
            const c = clueAt.get(shown)!;
            return t(
              `${c.why.en} ${wrong} means "${meaningOfEn(wrong)}", which the sentence does not say.`,
              `${c.why["zh-CN"]}，而“${wrong}”的意思是${meaningOf(wrong)}。`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-relations`,
        t("Near-Synonyms and Antonyms", "近义词和反义词"),
        t(
          `A near-synonym means nearly the same; an antonym means the opposite. Take **${first.text}**: ${first.synonym} means nearly the same, and ${first.antonym} the opposite.\n\n${relationListEn}\n\n> **Watch out.** The near-synonym and the antonym are both tied to the word, so read whether the question asks for the same or the opposite: for ${first.text}, ${first.antonym} is never the near-synonym.`,
          `意思相同或相近的词是近义词，意思相反或相对的词是反义词。比如 **${first.text}**：“${first.synonym}”和它意思相近，“${first.antonym}”和它意思相反。\n\n${relationList}\n\n> **注意。** 近义词和反义词都和这个词有关，要看清题目问的是“相近”还是“相反”：“${first.text}”的反义词“${first.antonym}”不会是它的近义词。`,
        ),
        choiceGenerator(
          t("Choose the word asked for.", "按要求选择词语。"),
          relationBank,
          (right) => {
            const r = relationOf.get(right)!;
            const w = r.word;
            return r.near
              ? t(
                  `${right} means nearly the same as ${w.text}, "${w.meaning.en}".\n\n**Check.** Both stand against the same word: the antonym of ${w.text} is ${w.antonym}, which is the opposite of ${right} too.`,
                  `“${right}”和“${w.text}”意思相近，都是${w.meaning["zh-CN"]}的意思。\n\n**检验。** 两个词站在同一边：“${w.text}”的反义词是“${w.antonym}”，“${w.antonym}”和“${right}”也意思相反。`,
                )
              : t(
                  `${right} means the opposite of ${w.text}, "${w.meaning.en}".\n\n**Check.** Go through the near-synonym: ${w.text} means nearly the same as ${w.synonym}, and ${right} is the opposite of ${w.synonym} too.`,
                  `“${right}”和“${w.text}”意思相反，“${w.text}”是${w.meaning["zh-CN"]}的意思。\n\n**检验。** 拿近义词再比一比：“${w.text}”和“${w.synonym}”意思相近，“${right}”和“${w.synonym}”也意思相反。`,
                );
          },
          (wrong, right) => {
            const asked = relationOf.get(right)!;
            const r = relationOf.get(wrong)!;
            const word = asked.word.text;
            if (r.word === asked.word)
              return r.near
                ? t(
                    `${wrong} means nearly the same as ${word}, but the question asks for the opposite.`,
                    `“${wrong}”是“${word}”的近义词，可题目要的是意思相反的词。`,
                  )
                : t(
                    `${wrong} is the opposite of ${word}, but the question asks for a word meaning nearly the same.`,
                    `“${wrong}”是“${word}”的反义词，可题目要的是意思相近的词。`,
                  );
            return r.near
              ? t(
                  `${wrong} means nearly the same as ${r.word.text}, another word; it is not the opposite of ${word}.`,
                  `“${wrong}”是另一个词“${r.word.text}”的近义词，和“${word}”并不意思相反。`,
                )
              : t(
                  `${wrong} is the antonym of ${r.word.text}, another word; it does not mean the same as ${word}.`,
                  `“${wrong}”是另一个词“${r.word.text}”的反义词，和“${word}”意思并不相近。`,
                );
          },
        ),
      ),
    ],
  };
}
