// Recognition topics (docs/chinese-curriculum.md §5.1): a batch of 12 characters, each linked to its sound and to words
// the learner already speaks. One knowledge point reads a character in a word, typing its pinyin; the other writes a
// word heard as pinyin, choosing its character among two a reader might take for it.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, toneless, typedGenerator, withMarks } from "@ga/subject-chinese";

/** CharacterWord is a word that uses a character, with the character's reading in it. */
export interface CharacterWord {
  readonly text: string;
  readonly reading: string;
}

/** CharacterEntry is a character to learn to read: its reading, three words that use it, and two it may be taken for. */
export interface CharacterEntry {
  readonly char: string;
  readonly reading: string;
  readonly words: readonly [CharacterWord, CharacterWord, CharacterWord];
  readonly confusables: readonly [string, string];
}

/** parseCharacters reads recognition data, a line a character: `字 reading word word word ab`, a word as `词@reading` when its reading of the character differs. */
export function parseCharacters(data: string): readonly CharacterEntry[] {
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const fields = line.split(/\s+/u);
      if (fields.length !== 6) throw new Error(`recognition data: ${line}`);
      const [char, reading, w1, w2, w3, confusables] = fields as [string, string, string, string, string, string];
      const word = (field: string): CharacterWord => {
        const [text = "", own] = field.split("@");
        if (!text.includes(char)) throw new Error(`recognition data: ${text} does not use ${char}`);
        return { text, reading: own ?? reading };
      };
      const pair = [...confusables];
      if (pair.length !== 2 || pair[0] === pair[1] || pair.includes(char)) throw new Error(`recognition data: confusables of ${char}`);
      return { char, reading, words: [word(w1), word(w2), word(w3)], confusables: [pair[0]!, pair[1]!] };
    });
}

/** otherTones are the readings of a syllable with each tone but its own, the neutral tone included. */
export function otherTones(reading: string): readonly string[] {
  const bare = toneless(reading);
  return ["1", "2", "3", "4", "5"].map((tone) => withMarks(`${bare}${tone}`)).filter((r) => r !== reading.normalize("NFC"));
}

/** RecognitionSpec describes a recognition topic. */
export interface RecognitionSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly entries: readonly CharacterEntry[];
}

const bold = (word: string, char: string): string => word.replaceAll(char, `**${char}**`);
const gap = (w: CharacterWord, char: string): string => w.text.replaceAll(char, `（${w.reading}）`);
const listed = (entry: CharacterEntry): string =>
  entry.words.map((w) => (w.reading === entry.reading ? w.text : `${w.text}（${w.reading}）`)).join("、");

/** recognitionTopic builds a recognition topic; its banks go character by character within each round of words, so consecutive seeds never show the same character. */
export function recognitionTopic(spec: RecognitionSpec): TopicDef {
  const { entries } = spec;
  const chars = entries.map((e) => e.char).join("、");
  const rounds = [0, 1, 2] as const;
  const readingBank: readonly TypedItem[] = rounds.flatMap((r) =>
    entries.map((e) => {
      const w = e.words[r];
      return { shown: bold(w.text, e.char), accepted: [w.reading], wrong: [...otherTones(w.reading)] };
    }),
  );
  const writingBank: readonly ChoiceItem[] = rounds.flatMap((r) =>
    entries.map((e): ChoiceItem => [gap(e.words[r], e.char), e.char, [...e.confusables]]),
  );
  const byGap = new Map(rounds.flatMap((r) => entries.map((e) => [gap(e.words[r], e.char), { entry: e, word: e.words[r] }] as const)));
  const byBold = new Map(
    rounds.flatMap((r) => entries.map((e) => [bold(e.words[r].text, e.char), { entry: e, word: e.words[r] }] as const)),
  );
  const readingList = entries.map((e) => `- **${e.char}** ${e.reading}：${listed(e)}`).join("\n");
  const formList = entries
    .map((e) => `- **${e.char}**（${e.reading}）${e.words[0].text}，不是“${e.confusables[0]}”或“${e.confusables[1]}”`)
    .join("\n");
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `Reading ${chars} in words, and telling each from the characters it may be taken for.`,
      `在词语中认读“${chars}”，读准字音，分清形近字和同音字。`,
    ),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: entries.length,
    strand: "characters",
    knowledgePoints: [
      point(
        `${spec.id}-reading`,
        t("Reading Them", "读准字音"),
        t(
          `Read each character in a word you know: the word tells you its sound. A character read differently in a word is marked.\n\n${readingList}`,
          `在熟悉的词语里认字：词语能帮你想起字音。在某个词里读音不同的字，后面注明了读音。\n\n${readingList}`,
        ),
        typedGenerator(
          "pinyin",
          t(
            "Type the pinyin of the character in bold as it is read in this word, with its tone. A tone may be typed as a number, as hao3.",
            "输入加粗的字在这个词里的拼音，要带声调。声调可以用数字表示，如 hao3。",
          ),
          readingBank,
          (right, shown) => {
            const found = byBold.get(shown);
            const char = found?.entry.char ?? "";
            const word = found?.word.text ?? "";
            return t(`In ${word}, ${char} is read **${right}**.`, `在“${word}”里，“${char}”读 **${right}**。`);
          },
        ),
      ),
      point(
        `${spec.id}-writing`,
        t("Telling Them Apart", "分清字形"),
        t(
          `Each of these characters has neighbours that look or sound like it. Think of the word's meaning, then of the character that writes that meaning.\n\n${formList}`,
          `这些字都有长得像或读音相同的字。先想词语的意思，再想表示这个意思的是哪个字。\n\n${formList}`,
        ),
        choiceGenerator(
          t("Which character goes where the pinyin is?", "拼音处应该填哪个字？"),
          writingBank,
          (right, shown) => {
            const found = byGap.get(shown);
            const word = found?.word.text ?? "";
            const others = (found?.entry.words ?? []).filter((w) => w.text !== word).map((w) => w.text);
            return t(
              `The word is **${word}**, written with ${right}, which also writes ${others.join(" and ")}.`,
              `这个词是“**${word}**”，用“${right}”字。“${right}”还用在“${others.join("”“")}”里。`,
            );
          },
          (wrong) => t(`${wrong} is a different character; it does not write this word.`, `“${wrong}”是另一个字，不用在这个词里。`),
        ),
      ),
    ],
  };
}
