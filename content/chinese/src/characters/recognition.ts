// Recognition topics (docs/chinese-curriculum.md §5.1): a batch of 12 characters, each linked to its sound and to words
// the learner already speaks. One knowledge point reads a character in a word, typing its pinyin; the other writes a
// word heard as pinyin, choosing its character among two a reader might take for it.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, toneless, typedGenerator, withMarks } from "@ga/subject-chinese";

import { notThis, toneName, typedAs } from "./teach.ts";

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
  /** known are the characters of every grade, by character: what the reasons say of a confusable character. */
  readonly known: ReadonlyMap<string, CharacterEntry>;
}

const bold = (word: string, char: string): string => word.replaceAll(char, `**${char}**`);
const gap = (w: CharacterWord, char: string): string => w.text.replaceAll(char, `（${w.reading}）`);
const listed = (entry: CharacterEntry): string =>
  entry.words.map((w) => (w.reading === entry.reading ? w.text : `${w.text}（${w.reading}）`)).join("、");

/** Found is an item of a bank: the character and the word it is asked in. */
interface Found {
  readonly entry: CharacterEntry;
  readonly word: CharacterWord;
}

/** recognitionTopic builds a recognition topic; its banks go character by character within each round of words, so consecutive seeds never show the same character. */
export function recognitionTopic(spec: RecognitionSpec): TopicDef {
  const { entries, known } = spec;
  const first = entries[0];
  if (!first) throw new Error(`${spec.id}: no characters`);
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
  const why = (wrong: string, found: Found): Text => {
    const other = known.get(wrong);
    if (!other) throw new Error(`${spec.id}: nothing known of ${wrong}`);
    return notThis(other, found.entry.char, found.word.text, found.word.reading);
  };
  const readingList = entries.map((e) => `- **${e.char}** ${e.reading}：${listed(e)}`).join("\n");
  const formList = entries
    .map((e) => `- **${e.char}**（${e.reading}）${e.words[0].text}，不是“${e.confusables[0]}”或“${e.confusables[1]}”`)
    .join("\n");

  // The instance of reading: a character read differently in one of its words, if the set has one, else the first.
  const marked = entries.find((e) => e.words.some((w) => w.reading !== e.reading));
  const shown = marked ?? first;
  const own = shown.words[0];
  const odd = marked?.words.find((w) => w.reading !== marked.reading);
  const readingWatch = odd
    ? t(
        `A character can be read differently in one word: ${shown.char} is ${shown.reading} in ${own.text} but ${odd.reading} in ${odd.text}. Read it as the word you are given says it.`,
        `同一个字在某个词里读音会不同：“${shown.char}”在“${own.text}”里读 ${shown.reading}，在“${odd.text}”里读 ${odd.reading}。要按给出的词来读。`,
      )
    : t(
        `The tone is part of the answer: ${toneless(shown.reading)} without its tone, or with another tone, is not ${shown.char}. Say the word aloud and listen for the tone.`,
        `声调也是答案的一部分：不带声调的 ${toneless(shown.reading)}，或者换了声调，都不是“${shown.char}”。把词语读出声，听准声调。`,
      );
  const readingInstance = t(
    `Take **${shown.char}** in ${own.text}. Say the word, and the character has its sound in it: ${own.reading}, with ${toneName(own.reading).en}. Type it as ${own.reading}, or as ${typedAs(own.reading)}.`,
    `比如“${own.text}”里的“**${shown.char}**”。把词说出来，字音就在词里：${own.reading}，${toneName(own.reading)["zh-CN"]}。输入 ${own.reading}，或者 ${typedAs(own.reading)}。`,
  );

  // The instance of telling apart: the first character in its first word, against its two confusable characters.
  const firstFound: Found = { entry: first, word: first.words[0] };
  const [c1, c2] = first.confusables;
  const apart = t(
    `Take ${gap(first.words[0], first.char)}: the word is ${first.words[0].text}, so the character is ${first.char}. ${why(c1, firstFound).en} ${why(c2, firstFound).en}`,
    `比如“${gap(first.words[0], first.char)}”：这个词是“${first.words[0].text}”，所以是“${first.char}”字。${why(c1, firstFound)["zh-CN"]}${why(c2, firstFound)["zh-CN"]}`,
  );
  // The warning of telling apart: a confusable character of the set with the very same sound, if there is one.
  const twin = entries
    .flatMap((e) => e.confusables.map((c) => ({ e, o: known.get(c) })))
    .find(({ e, o }) => o && o.reading.normalize("NFC") === e.reading.normalize("NFC"));
  const apartWatch = twin?.o
    ? t(
        `The same sound is not the same character: ${twin.e.char} and ${twin.o.char} are both read ${twin.e.reading}, but ${twin.e.words[0].text} is written only with ${twin.e.char}. Choose by the word, not by the sound alone.`,
        `读音相同不等于字相同：“${twin.e.char}”和“${twin.o.char}”都读 ${twin.e.reading}，可“${twin.e.words[0].text}”只能用“${twin.e.char}”。要按词语选字，不能只听读音。`,
      )
    : t(
        `A character that looks alike is not the same: ${c1} looks like ${first.char} but is read ${known.get(c1)?.reading}. Look at the whole character, then read the word back with it.`,
        `长得像不等于是同一个字：“${c1}”和“${first.char}”很像，可它读 ${known.get(c1)?.reading}。要看清整个字，再把它放回词语里读一读。`,
      );

  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `Reading ${chars} in words, and telling each from the characters it may be taken for.`,
      `在词语中认读“${chars}”，读准字音，分清形近字和同音字。`,
    ),
    intro: t(
      `These ${entries.length} characters are each learned in three words. Take ${first.char}: it is read ${first.reading} in ${first.words[0].text}, ${first.words[1].text} and ${first.words[2].text}, so learn its sound with those words. When a word shows its pinyin instead, as ${gap(first.words[0], first.char)}, say the word, ${first.words[0].text}, and the character is ${first.char}, not ${c1} or ${c2}. You will read each character in its words, then choose it in a word.`,
      `这 ${entries.length} 个字，每个都放在三个词里学。比如“${first.char}”：在“${first.words.map((w) => w.text).join("”“")}”里，“${first.char}”读 ${first.reading}，字音要和这些词一起记。词里只给拼音时，比如“${gap(first.words[0], first.char)}”，先说出这个词“${first.words[0].text}”，就知道是“${first.char}”，不是“${c1}”或“${c2}”。先在词语里读准每个字，再在词语里选对每个字。`,
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
          `Read each character in a word you know: the word tells you its sound. A character read differently in a word is marked.\n\n${readingInstance.en}\n\n> **Watch out.** ${readingWatch.en}\n\n${readingList}`,
          `在熟悉的词语里认字：词语能帮你想起字音。在某个词里读音不同的字，后面注明了读音。\n\n${readingInstance["zh-CN"]}\n\n> **注意。** ${readingWatch["zh-CN"]}\n\n${readingList}`,
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
            if (!found) throw new Error(`${spec.id}: no item ${shown}`);
            const { entry, word } = found;
            const elsewhere = entry.words.filter((w) => w.text !== word.text);
            const same = elsewhere.find((w) => w.reading === word.reading);
            const differs = elsewhere.find((w) => w.reading !== word.reading);
            const step2 =
              word.reading === entry.reading
                ? t(
                    `In ${word.text}, ${entry.char} is read **${right}**, with ${toneName(right).en}.`,
                    `在“${word.text}”里，“${entry.char}”读 **${right}**，${toneName(right)["zh-CN"]}。`,
                  )
                : t(
                    `${entry.char} is mostly read ${entry.reading}, but in ${word.text} it is read **${right}**, with ${toneName(right).en}.`,
                    `“${entry.char}”一般读 ${entry.reading}，在“${word.text}”里读 **${right}**，${toneName(right)["zh-CN"]}。`,
                  );
            const check = same
              ? t(
                  `**Check.** Say another word with it: in ${same.text}, ${entry.char} is ${same.reading} too.`,
                  `**检验。** 换一个词读一读：在“${same.text}”里，“${entry.char}”也读 ${same.reading}。`,
                )
              : t(
                  `**Check.** In ${differs?.text} it is read ${differs?.reading}, but in ${word.text} it is ${right}: the word decides the sound.`,
                  `**检验。** 在“${differs?.text}”里它读 ${differs?.reading}，在“${word.text}”里读 ${right}：读音要看词语。`,
                );
            return t(
              `The word is ${word.text}, and the character in bold is ${entry.char}.\n\n${step2.en}\n\n${check.en}`,
              `这个词是“${word.text}”，加粗的字是“${entry.char}”。\n\n${step2["zh-CN"]}\n\n${check["zh-CN"]}`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-writing`,
        t("Telling Them Apart", "分清字形"),
        t(
          `Each of these characters has neighbours that look or sound like it. Think of the word's meaning, then of the character that writes that meaning.\n\n${apart.en}\n\n> **Watch out.** ${apartWatch.en}\n\n${formList}`,
          `这些字都有长得像或读音相同的字。先想词语的意思，再想表示这个意思的是哪个字。\n\n${apart["zh-CN"]}\n\n> **注意。** ${apartWatch["zh-CN"]}\n\n${formList}`,
        ),
        choiceGenerator(
          t("Which character goes where the pinyin is?", "拼音处应该填哪个字？"),
          writingBank,
          (right, shown) => {
            const found = byGap.get(shown);
            if (!found) throw new Error(`${spec.id}: no item ${shown}`);
            const { entry, word } = found;
            const others = entry.words.filter((w) => w.text !== word.text).map((w) => w.text);
            return t(
              `Say the word with its pinyin: ${shown} is **${word.text}**.\n\n${word.text} is written with ${right}, which also writes ${others.join(" and ")}.\n\n**Check.** Put ${right} back and read it: ${word.text}, with ${right} read ${word.reading}, as the pinyin says.`,
              `连着拼音把词说出来：“${shown}”是“**${word.text}**”。\n\n“${word.text}”用“${right}”字，“${right}”还用在“${others.join("”“")}”里。\n\n**检验。** 把“${right}”放回去读一读：“${word.text}”，“${right}”读 ${word.reading}，和拼音一样。`,
            );
          },
          (wrong, _right, shown) => {
            const found = byGap.get(shown);
            if (!found) throw new Error(`${spec.id}: no item ${shown}`);
            return why(wrong, found);
          },
        ),
      ),
    ],
  };
}
