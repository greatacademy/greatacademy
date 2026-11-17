// Idiom topics (docs/chinese-curriculum.md §6): a batch of 8 idioms (成语), with their meaning, their use in a sentence
// and their usual miswritings. One knowledge point names the idiom a meaning describes, one chooses the idiom a sentence
// needs, and one tells the correctly written idiom from miswritten ones. The wrong options are the batch's other
// idioms, three at a time in four different sets, so each item is asked against several neighbours.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

/** Idiom is an idiom with its reading, meaning, two sentences that use it and the ways it is miswritten. */
export interface Idiom {
  readonly text: string;
  readonly pinyin: string;
  readonly meaning: Text;
  /** sentences use the idiom where they have ＿＿. */
  readonly sentences: readonly [string, string];
  /** miswritten are wrong writings a learner is likely to make, each of the idiom's length. */
  readonly miswritten: readonly string[];
}

/** GAP is where a sentence of an idiom puts it. */
export const GAP = "＿＿";

/**
 * parseIdioms reads idiom data, a line an idiom, its fields separated by ` | `: the idiom, its pinyin, its meaning in
 * Chinese and in English, without a full stop, two sentences with ＿＿ where it goes, and its miswritings separated by spaces.
 */
export function parseIdioms(data: string): readonly Idiom[] {
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const fields = line.split(" | ").map((f) => f.trim());
      if (fields.length !== 7) throw new Error(`idiom data: ${line}`);
      const [text, pinyin, zh, en, first, second, wrong] = fields as [string, string, string, string, string, string, string];
      const syllables = pinyin.split(" ");
      if (syllables.length !== [...text].length) throw new Error(`idiom data: the pinyin of ${text}`);
      for (const s of [first, second]) if (s.split(GAP).length !== 2) throw new Error(`idiom data: a sentence of ${text}: ${s}`);
      const miswritten = wrong.split(" ");
      for (const m of miswritten) {
        if (m === text || [...m].length !== [...text].length) throw new Error(`idiom data: a miswriting of ${text}: ${m}`);
      }
      return { text, pinyin, meaning: t(en, zh), sentences: [first, second], miswritten };
    });
}

/** IdiomSpec describes an idiom topic. */
export interface IdiomSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly idioms: readonly Idiom[];
}

/** SETS is how many sets of wrong options each item is asked with. */
const SETS = 4;

/** neighbours are four sets of three of the other idioms of a batch, each set different. */
function neighbours<T>(items: readonly T[], i: number): readonly (readonly T[])[] {
  const others = items.filter((_, j) => j !== i);
  const n = others.length;
  return Array.from({ length: SETS }, (_, k) => [others[k % n]!, others[(k + 2) % n]!, others[(k + 4) % n]!]);
}

/** idiomTopic builds an idiom topic; its banks go idiom by idiom within each round, so consecutive seeds never show the same one. */
export function idiomTopic(spec: IdiomSpec): TopicDef {
  const { idioms } = spec;
  if (idioms.length < 8) throw new Error(`${spec.id}: an idiom batch needs 8 idioms`);
  const byText = new Map(idioms.map((i) => [i.text, i]));
  const sets = idioms.map((_, i) => neighbours(idioms, i));
  const rounds = Array.from({ length: SETS }, (_, k) => k);
  const meaningBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    idioms.map((idiom, i): ChoiceItem => [idiom.meaning["zh-CN"], idiom.text, sets[i]![k]!.map((o) => o.text)]),
  );
  const useBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    idioms.map((idiom, i): ChoiceItem => [idiom.sentences[k % 2]!, idiom.text, sets[i]![k]!.map((o) => o.text)]),
  );
  const writingBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    idioms.map((idiom, i): ChoiceItem => ["", idiom.text, sets[i]![k]!.map((o) => o.miswritten[k % o.miswritten.length]!)]),
  );
  const miswritings = new Map(idioms.flatMap((i) => i.miswritten.map((m) => [m, i] as const)));
  const titles = idioms.map((i) => i.text).join("、");
  const meaningList = idioms.map((i) => `- **${i.text}**（${i.pinyin}）：${i.meaning["zh-CN"]}`).join("\n");
  const meaningListEn = idioms.map((i) => `- **${i.text}** (${i.pinyin}): ${i.meaning.en}`).join("\n");
  const useList = idioms.map((i) => `- ${i.sentences[0].replace(GAP, `**${i.text}**`)}`).join("\n");
  const writingList = idioms.map((i) => `- **${i.text}**，不要写成“${i.miswritten.join("”“")}”`).join("\n");
  const meaningOf = (text: string): string => byText.get(text)?.meaning["zh-CN"] ?? "";
  const meaningOfEn = (text: string): string => byText.get(text)?.meaning.en ?? "";
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `The idioms ${titles}: what they mean, where they fit and how they are written.`,
      `成语“${titles}”：理解意思，在句子中恰当运用，写对每一个字。`,
    ),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: idioms.length,
    strand: "words",
    knowledgePoints: [
      point(
        `${spec.id}-meaning`,
        t("What They Mean", "理解意思"),
        t(
          `An idiom means more than its four characters say one by one; learn each as a whole.\n\n${meaningListEn}`,
          `成语的意思往往不是字面意思的简单相加，要整体理解。\n\n${meaningList}`,
        ),
        choiceGenerator(
          t("Which idiom has this meaning?", "哪个成语是这个意思？"),
          meaningBank,
          (right) => t(`**${right}** means: ${meaningOfEn(right)}.`, `“**${right}**”的意思是：${meaningOf(right)}。`),
          (wrong) => t(`${wrong} means: ${meaningOfEn(wrong)}.`, `“${wrong}”的意思是：${meaningOf(wrong)}。`),
        ),
      ),
      point(
        `${spec.id}-use`,
        t("Using Them", "恰当运用"),
        t(
          `Choose an idiom by what the sentence says, not by how the idiom sounds.\n\n${useList}`,
          `选用成语要看句子表达的意思是否和成语的意思相符。\n\n${useList}`,
        ),
        choiceGenerator(
          t("Which idiom fits the gap?", "横线处填哪个成语最恰当？"),
          useBank,
          (right) => t(`**${right}** fits: it means ${meaningOfEn(right)}.`, `填“**${right}**”，它的意思是：${meaningOf(right)}。`),
          (wrong) =>
            t(
              `${wrong} means ${meaningOfEn(wrong)}, which is not what the sentence says.`,
              `“${wrong}”的意思是${meaningOf(wrong)}，和句子的意思不符。`,
            ),
        ),
      ),
      point(
        `${spec.id}-writing`,
        t("Writing Them", "正确书写"),
        t(
          `Each of these idioms has a character often miswritten as one that sounds or looks like it. Think of what the character means in the idiom.\n\n${writingList}`,
          `这些成语里都有容易写错的字，常被写成音同或形近的字。想一想这个字在成语里的意思。\n\n${writingList}`,
        ),
        choiceGenerator(
          t("Which idiom is written correctly?", "哪个成语书写正确？"),
          writingBank,
          (right) =>
            t(
              `**${right}** is written correctly; the others each have a wrong character.`,
              `“**${right}**”书写正确，其他几个各有一个错字。`,
            ),
          (wrong) => {
            const idiom = miswritings.get(wrong);
            const text = idiom?.text ?? "";
            return t(`${wrong} should be written ${text}.`, `“${wrong}”有错字，应写作“${text}”。`);
          },
        ),
      ),
    ],
  };
}
