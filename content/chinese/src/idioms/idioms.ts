// Idiom topics (docs/chinese-curriculum.md §6): a batch of 8 idioms (成语), with their meaning, their use in a sentence
// and their usual miswritings. One knowledge point names the idiom a meaning describes, one chooses the idiom a sentence
// needs, and one tells the correctly written idiom from miswritten ones. The wrong options are the batch's other
// idioms, three at a time in four different sets, so each item is asked against several neighbours; a gap sentence is
// never asked against an idiom of the batch that would also fit it, and each wrong option's reason joins the sentence's
// clue, written by hand, to that idiom's own meaning.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, joinPinyin, point, zhQuote } from "@ga/subject-chinese";

import { type Clue, clueOf } from "../words/clues.ts";

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

/**
 * UNSPLIT are the four-character idioms that are not read as two words of two syllables, so their pinyin is written
 * joined (GB/T 16159); the others are written as two halves joined by a hyphen.
 */
const UNSPLIT: ReadonlySet<string> = new Set([
  "迫不及待",
  "不以为然",
  "美不胜收",
  "怒不可遏",
  "叹为观止",
  "目不暇接",
  "刻不容缓",
  "赞不绝口",
  "迫在眉睫",
  "迫不得已",
  "漫不经心",
  "目不转睛",
  "如履薄冰",
  "文不加点",
  "无与伦比",
]);

/** idiomPinyin writes an idiom's pinyin by GB/T 16159: two halves joined by a hyphen, or all joined. */
export function idiomPinyin(text: string, syllables: readonly string[]): string {
  if (syllables.length !== 4 || UNSPLIT.has(text)) return joinPinyin(syllables);
  return `${joinPinyin(syllables.slice(0, 2))}-${joinPinyin(syllables.slice(2))}`;
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
      return { text, pinyin: idiomPinyin(text, syllables), meaning: t(en, zh), sentences: [first, second], miswritten };
    });
}

/** IdiomSpec describes an idiom topic. */
export interface IdiomSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly idioms: readonly Idiom[];
  /** clues are the clues of the gap sentences, by clueKey; every sentence of the batch has one. */
  readonly clues: ReadonlyMap<string, Clue>;
}

/** SETS is how many sets of wrong options each item is asked with. */
const SETS = 4;

/** neighbours are four sets of three of the other idioms of a batch, each set different. */
function neighbours<T>(items: readonly T[], i: number): readonly (readonly T[])[] {
  const others = items.filter((_, j) => j !== i);
  const n = others.length;
  return Array.from({ length: SETS }, (_, k) => [others[k % n]!, others[(k + 2) % n]!, others[(k + 4) % n]!]);
}

/** slips names the characters a miswriting changes, each with the one it stands for. */
function slips(wrong: string, right: string): Text {
  const a = [...wrong];
  const b = [...right];
  const changed = b.map((c, i) => ({ c, w: a[i]!, i })).filter((x) => x.c !== x.w);
  return t(
    changed.map((x) => `${x.w} in place of ${x.c}`).join(" and "),
    changed.map((x) => `把第${"一二三四五六七八九十"[x.i]}个字“${x.c}”写成了“${x.w}”`).join("，"),
  );
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
  const clueAt = new Map<string, Clue>();
  for (const i of idioms) for (const n of [1, 2]) clueAt.set(i.sentences[n - 1]!, clueOf(spec.clues, i.text, n, spec.id));
  for (const [sentence, c] of clueAt)
    for (const f of c.fits) if (!byText.has(f)) throw new Error(`${spec.id}: ${f}, said to fit ${sentence}, is not in the batch`);
  const clueOfSentence = (sentence: string): Clue => clueAt.get(sentence)!;
  const useBank: readonly ChoiceItem[] = rounds.flatMap((k) =>
    idioms.map((idiom, i): ChoiceItem => {
      const sentence = idiom.sentences[k % 2]!;
      const fits = new Set(clueOfSentence(sentence).fits);
      const others = idioms.filter((o, j) => j !== i && !fits.has(o.text));
      if (others.length < 4) throw new Error(`${spec.id}: too few idioms that do not fit ${sentence}`);
      const n = others.length;
      const at = (Math.floor(k / 2) + 3 * i) % n;
      return [sentence, idiom.text, [others[at]!, others[(at + 1) % n]!, others[(at + 2) % n]!].map((o) => o.text)];
    }),
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
  const first = idioms[0]!;
  const mate = idioms[1]!;
  const firstClue = clueOfSentence(first.sentences[0]);
  const misfit = idioms.find((o) => o !== first && !firstClue.fits.includes(o.text))!;
  const put = (sentence: string, idiom: string): string => sentence.replace(GAP, idiom);
  const firstWrong = first.miswritten[0]!;
  const firstSlip = slips(firstWrong, first.text);
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `The idioms ${titles}: what they mean, where they fit and how they are written.`,
      `成语“${titles}”：理解意思，在句子中恰当运用，写对每一个字。`,
    ),
    intro: t(
      `An idiom (成语) is a fixed phrase, most often of four characters, used as one word. Take **${first.text}** (${first.pinyin}): it means "${first.meaning.en}", as in ${put(first.sentences[0], first.text)} For each of these ${idioms.length} idioms you will learn what it means, where it fits in a sentence and how each of its characters is written.\n\n${meaningListEn}`,
      `成语是固定的词组，大多是四个字，用起来像一个词。比如 **${first.text}**（${first.pinyin}）：意思是${first.meaning["zh-CN"]}，可以说：${put(first.sentences[0], first.text)}这${idioms.length}个成语，每个都要理解意思，会在句子里用，还要把每个字写对。\n\n${meaningList}`,
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
          `An idiom means more than its four characters say one by one; learn each as a whole. Take **${first.text}**: as a whole it means "${first.meaning.en}".\n\n${meaningListEn}\n\n> **Watch out.** Do not choose by one familiar character: ${first.text} means "${first.meaning.en}", while ${mate.text} means "${mate.meaning.en}". Match the meaning of the whole idiom.`,
          `成语的意思往往不是字面意思的简单相加，要整体理解。比如 **${first.text}**，整体的意思是${first.meaning["zh-CN"]}。\n\n${meaningList}\n\n> **注意。** 不能只凭一个认识的字来选：“${first.text}”的意思是${first.meaning["zh-CN"]}，“${mate.text}”的意思却是${mate.meaning["zh-CN"]}。要对上整个成语的意思。`,
        ),
        choiceGenerator(
          t("Which idiom has this meaning?", "哪个成语是这个意思？"),
          meaningBank,
          (right) => {
            const idiom = byText.get(right)!;
            return t(
              `**${right}** (${idiom.pinyin}) means: ${meaningOfEn(right)}.\n\n**Check.** Put it in a sentence: ${put(idiom.sentences[0], right)} It reads well with that meaning.`,
              `“**${right}**”（${idiom.pinyin}）的意思是：${meaningOf(right)}。\n\n**检验。** 放进句子里读一读：${put(idiom.sentences[0], right)}按这个意思读，句子通顺。`,
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
        t("Using Them", "恰当运用"),
        t(
          `Choose an idiom by the clue in the sentence, not by how the idiom sounds. Take ${first.sentences[0]} Here ${firstClue.why.en}, so it needs an idiom meaning "${first.meaning.en}": ${put(first.sentences[0], first.text)}\n\n${useList}\n\n> **Watch out.** An idiom that sounds fine can still say the wrong thing: with ${misfit.text} the sentence would read ${put(first.sentences[0], misfit.text)} But here ${firstClue.why.en}, and ${misfit.text} means "${misfit.meaning.en}". Check that the idiom's meaning is what the sentence describes.`,
          `选用成语要找出句子里决定用哪个成语的线索。比如${zhQuote(first.sentences[0])}：${firstClue.why["zh-CN"]}，要的是“${first.meaning["zh-CN"]}”的意思：${put(first.sentences[0], first.text)}\n\n${useList}\n\n> **注意。** 读起来顺口的成语，意思不一定对：填“${misfit.text}”，句子成了${zhQuote(put(first.sentences[0], misfit.text))}，可是${firstClue.why["zh-CN"]}，而“${misfit.text}”的意思是${misfit.meaning["zh-CN"]}，对不上。要看成语的意思是不是句子描写的情形。`,
        ),
        choiceGenerator(
          t("Which idiom fits the gap?", "横线处填哪个成语最恰当？"),
          useBank,
          (right, shown) => {
            const c = clueOfSentence(shown).why;
            return t(
              `**${right}** fits: ${put(shown, right)} Here ${c.en}, and ${right} means ${meaningOfEn(right)}.\n\n**Check.** Read the gap as that meaning: ${put(shown, `[${meaningOfEn(right)}]`)} It still says the same.`,
              `填“**${right}**”：${put(shown, right)}${c["zh-CN"]}，“${right}”的意思正是${meaningOf(right)}。\n\n**检验。** 把横线换成成语的意思来读：${zhQuote(put(shown, `（${meaningOf(right)}）`))}，意思仍然说得通。`,
            );
          },
          (wrong, _right, shown) => {
            const c = clueOfSentence(shown).why;
            return t(
              `Here ${c.en}, but ${wrong} means "${meaningOfEn(wrong)}".`,
              `${c["zh-CN"]}，而“${wrong}”的意思是${meaningOf(wrong)}。`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-writing`,
        t("Writing Them", "正确书写"),
        t(
          `Each of these idioms has a character often miswritten as one that sounds or looks like it. Think of what the character means in the idiom. Take **${first.text}**: it is often miswritten ${firstWrong}, with ${firstSlip.en}.\n\n${writingList}\n\n> **Watch out.** A miswritten idiom differs by a single character and still reads the same aloud, so compare it with the right one character by character.`,
          `这些成语里都有容易写错的字，常被写成音同或形近的字。想一想这个字在成语里的意思。比如 **${first.text}**，常被错写成“${firstWrong}”：${firstSlip["zh-CN"]}。\n\n${writingList}\n\n> **注意。** 写错的成语往往只差一个字，读起来还可能一样，要和正确的写法一个字一个字地对。`,
        ),
        choiceGenerator(
          t("Which idiom is written correctly?", "哪个成语书写正确？"),
          writingBank,
          (right) => {
            const idiom = byText.get(right)!;
            const wrongs = idiom.miswritten.map((m) => `“${m}”`).join("");
            return t(
              `**${right}** (${idiom.pinyin}) is written correctly: it means ${meaningOfEn(right)}.\n\n**Check.** Set it beside its usual miswritings, ${idiom.miswritten.join(" and ")}: each of them changes a character, and ${right} keeps every one.`,
              `“**${right}**”（${idiom.pinyin}）书写正确，意思是${meaningOf(right)}。\n\n**检验。** 和它常见的错误写法${wrongs}逐字比一比：错的都换了字，“${right}”每个字都对。`,
            );
          },
          (wrong) => {
            const idiom = miswritings.get(wrong)!;
            const slip = slips(wrong, idiom.text);
            return t(
              `${wrong} should be written ${idiom.text}: it has ${slip.en}.`,
              `“${wrong}”有错字，应写作“${idiom.text}”：${slip["zh-CN"]}。`,
            );
          },
        ),
      ),
    ],
  };
}
