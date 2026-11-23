// The Gaokao course (docs/chinese-curriculum.md §8.5): practice for the Chinese paper of the university entrance
// examination over the two senior courses. It holds their units and exam topics of its own, all practice-only,
// that mix what grades 7 to 11 teach, as the paper does: idioms in context, lines of recited texts from a description of
// their meaning, the words of classical Chinese, the use of language, with sentences written and judged by a model, and the reading of modern texts, informational and literary, and of classical poems.

import { type CourseDef, same, type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator, zhQuote } from "@ga/subject-chinese";
import { classicalDrills } from "../classical/drills.ts";
import { seniorClassicalDrills } from "../classical/senior-drills.ts";
import type { DrillItem } from "../grammar/drill.ts";
import { drillData } from "../grammar/drill-data.ts";
import { type FaultyItem, type FaultyNote, parseFaultyNotes } from "../grammar/faulty.ts";
import { type FaultyData, faultyData } from "../grammar/faulty-data.ts";
import { faultyNotes } from "../grammar/faulty-notes.ts";
import { type Ask, examChoice, examGroup } from "../hsk/exam.ts";
import { idiomClues } from "../idioms/clue-data.ts";
import type { Idiom } from "../idioms/idioms.ts";
import { idiomsByGrade } from "../idioms/index.ts";
import { recitedPoems } from "../recitation/index.ts";
import type { Line, Poem } from "../recitation/poems.ts";
import { clueOf } from "../words/clues.ts";
import { gaokaoEssayTopic } from "../writing/later.ts";
import { informationalPassages } from "./informational-data.ts";
import { languageWritingTopic } from "./language.ts";
import { literaryPassages } from "./literary-data.ts";
import { informationalSpec, literarySpec, modernTopics, poetrySpec } from "./modern.ts";
import { poetryPassages } from "./poetry-data.ts";

/** FROM is the first grade the paper draws on. */
const FROM = 7;

/** interleave takes one item of each list in turn, so that consecutive seeds come from different lists. */
function interleave<T>(lists: readonly (readonly T[])[]): readonly T[] {
  const out: T[] = [];
  const longest = Math.max(...lists.map((b) => b.length));
  for (let i = 0; i < longest; i++) for (const b of lists) if (i < b.length) out.push(b[i]!);
  return out;
}

/** others are three of the other idioms of a batch, starting after the ith, leaving out those that would also fit the gap. */
function others(batch: readonly Idiom[], i: number, fits: readonly string[]): readonly Idiom[] {
  const rest = batch.filter((x, j) => j !== i && !fits.includes(x.text));
  return [0, 2, 4].map((d) => rest[(i + d) % rest.length]!);
}

const idiomBatches = idiomsByGrade.filter((g) => g.grade >= FROM).flatMap((g) => g.batches.map((b) => b.idioms));

/** idiomItems are the idioms of grades 7 to 11, each with three others of its batch, by meaning or in its second sentence. */
function idiomItems(inSentence: boolean): readonly ChoiceItem[] {
  return interleave(
    idiomBatches.map((batch) =>
      batch.map((idiom, i): ChoiceItem => {
        const fits = inSentence ? clueOf(idiomClues, idiom.text, 2, "gaokao-idioms").fits : [];
        const wrong = others(batch, i, fits).map((x) => x.text);
        if (new Set(wrong).size !== 3) throw new Error(`gaokao: the idioms offered against ${idiom.text}`);
        return [inSentence ? idiom.sentences[1] : idiom.meaning["zh-CN"], idiom.text, wrong];
      }),
    ),
  );
}

const idiomMeaning = new Map(idiomBatches.flat().map((i) => [i.text, i]));

/** idiomOf is the idiom of grades 7 to 11 written `text`. */
function idiomOf(text: string): Idiom {
  const idiom = idiomMeaning.get(text);
  if (!idiom) throw new Error(`gaokao: no idiom ${text}`);
  return idiom;
}

/** put writes an idiom into the gap of a sentence. */
const put = (sentence: string, text: string): string => sentence.replace("＿＿", text);

/** idiomWhy explains the idiom of a meaning, then checks it in its second sentence. */
const idiomWhy = (right: string): Text => {
  const idiom = idiomOf(right);
  return t(
    `**${right}** (${idiom.pinyin}) means ${idiom.meaning.en}.\n\nIn use: ${put(idiom.sentences[0], right)}\n\n**Check.** Try it in another sentence: ${put(idiom.sentences[1], right)} The same meaning reads well there too.`,
    `“**${right}**”（${idiom.pinyin}）的意思是：${idiom.meaning["zh-CN"]}。\n\n用在句子里：${put(idiom.sentences[0], right)}\n\n**检验。** 换一个句子再试：${put(idiom.sentences[1], right)}按同样的意思也读得通。`,
  );
};

/** idiomWhyNot says what a wrong idiom means instead. */
const idiomWhyNot = (wrong: string, right: string): Text =>
  t(
    `${wrong} means "${idiomOf(wrong).meaning.en}", not "${idiomOf(right).meaning.en}".`,
    `“${wrong}”的意思是${idiomOf(wrong).meaning["zh-CN"]}，不是“${idiomOf(right).meaning["zh-CN"]}”。`,
  );

/** gapClue is the clue of the second sentence of the idiom that fills `shown`. */
const gapClue = (right: string): Text => clueOf(idiomClues, right, 2, "gaokao-idioms").why;

/** gapWhy explains the idiom a sentence needs by its clue, then reads the gap as its meaning. */
const gapWhy = (right: string, shown: string): Text => {
  const idiom = idiomOf(right);
  const c = gapClue(right);
  return t(
    `**${right}** fits: ${put(shown, right)}\n\nHere ${c.en}, and ${right} (${idiom.pinyin}) means ${idiom.meaning.en}.\n\n**Check.** Read the gap as that meaning: ${put(shown, `[${idiom.meaning.en}]`)} It still says the same.`,
    `填“**${right}**”：${put(shown, right)}\n\n${c["zh-CN"]}，“${right}”（${idiom.pinyin}）的意思正是${idiom.meaning["zh-CN"]}。\n\n**检验。** 把横线换成成语的意思来读：${zhQuote(put(shown, `（${idiom.meaning["zh-CN"]}）`))}，意思仍然说得通。`,
  );
};

/** gapWhyNot joins the sentence's clue to a wrong idiom's own meaning. */
const gapWhyNot = (wrong: string, right: string): Text => {
  const c = gapClue(right);
  return t(
    `Here ${c.en}, but ${wrong} means "${idiomOf(wrong).meaning.en}".`,
    `${c["zh-CN"]}，而“${wrong}”的意思是${idiomOf(wrong).meaning["zh-CN"]}。`,
  );
};

/** firstIdiom is the idiom the gaokao idiom topic takes as its instance, and lateIdiom one whose characters mislead. */
const firstIdiom = idiomBatches[0]![0]!;
const lateIdiom = idiomOf("差强人意");
const firstMisfit = idiomBatches[0]!.find(
  (x) => x !== firstIdiom && !clueOf(idiomClues, firstIdiom.text, 2, "gaokao-idioms").fits.includes(x.text),
)!;

const poems: readonly (readonly Poem[])[] = [...new Set(recitedPoems.filter((p) => p.grade >= FROM).map((p) => p.grade))].map((g) =>
  recitedPoems.filter((p) => p.grade === g).map((p) => p.poem),
);

/** INNER are the marks a line may hold within it, left out when a learner types the line without them. */
const INNER = /[，。？！；、：“”‘’]/gu;

/** lineItems give the meaning of each line of the recited texts of grades 7 to 11, without the text, among four lines of other texts. */
function lineItems(): readonly ChoiceItem[] {
  const all = poems.flat();
  return interleave(
    all.map((poem, k) =>
      poem.lines.map((line, i): ChoiceItem => {
        const wrong = [1, 2, 3].map((d) => {
          const other = all[(k + d * 7) % all.length]!;
          return other.lines[(i + d) % other.lines.length]!.text;
        });
        if (new Set([line.text, ...wrong]).size !== 4) throw new Error(`gaokao: the lines offered against ${line.text}`);
        return [line.meaning, line.text, wrong];
      }),
    ),
  );
}

/** writtenItems ask for each line of the recited texts of grades 7 to 11 by its text's title and its meaning. */
function writtenItems(): readonly TypedItem[] {
  return interleave(
    poems.flat().map((poem) =>
      poem.lines.map((line, i) => {
        const title = poem.title["zh-CN"];
        const neighbour = poem.lines[i === 0 ? 1 : i - 1]!.text;
        const miswritten = line.miswritten.map(([r, w]) => line.text.replace(r, w));
        return typed(
          `${poem.author["zh-CN"]}《${title}》中，写“${line.meaning}”的一句是什么？`,
          [...new Set([line.text, line.text + line.mark, line.text.replace(INNER, "")])],
          [neighbour, ...miswritten],
        );
      }),
    ),
  );
}

const lineSource = new Map(poems.flat().flatMap((p) => p.lines.map((l) => [l.text, { poem: p, line: l }] as const)));

/** sourceOf finds where a line comes from. */
function sourceOf(text: string): { poem: Poem; line: Line; next: Line | undefined } {
  const source = lineSource.get(text);
  if (!source) throw new Error(`gaokao: no source for ${text}`);
  const i = source.poem.lines.indexOf(source.line);
  return { ...source, next: source.poem.lines[i + 1] ?? source.poem.lines[i - 1] };
}

/** named names a line's text by its author and title, in Chinese. */
const named = (poem: Poem): string => `${poem.author["zh-CN"]}《${poem.title["zh-CN"]}》`;

/** namedEn names it in English. */
const namedEn = (poem: Poem): string => `"${poem.title.en}" (${poem.title["zh-CN"]}) by ${poem.author.en}`;

/** together reads a line with its neighbour, in the text's order. */
function together(poem: Poem, line: Line, next: Line | undefined): string {
  if (!next) return line.shown;
  return poem.lines.indexOf(next) > poem.lines.indexOf(line) ? `${line.shown}${next.shown}` : `${next.shown}${line.shown}`;
}

/** carefulOf says which characters of a line are not to be written as which, in Chinese and in English. */
const carefulOf = (line: Line): Text =>
  line.miswritten.length === 0
    ? t("Mind that every character is the one in the text.", "留心每个字都和原文一样。")
    : t(
        `Mind the characters: ${line.miswritten.map(([r, w]) => `${r}, not ${w}`).join("; ")}.`,
        `书写时，${line.miswritten.map(([r, w]) => `“${r}”不要写成“${w}”`).join("，")}。`,
      );

const [introPoem, choosePoem, writePoem] = [0, 1, 2].map((k) => {
  const poem = poems.flat()[k];
  if (!poem) throw new Error("gaokao: too few recited texts");
  return poem;
}) as [Poem, Poem, Poem];

const introLine = introPoem.lines[0]!;
/** recitationIntro says what the paper's description task asks and how it is worked. */
const recitationIntro = t(
  `The Gaokao paper does not ask for the line after a given one. It describes what a line says, a picture or an idea, and asks for the line itself: in ${namedEn(introPoem)}, the line that says "${introLine.meaning}" is ${introLine.text}.\n\nSo a line has to be known by its meaning, and across all the texts recited in grades 7 to 11, not one text at a time. Work it in two steps: from the description, find the text and the line; then write the line with every character right, since a line with one wrong character gets no mark. The two knowledge points practise these steps: first choosing the line among lines of several texts, then writing it given the title.`,
  `高考的默写题不是给上句写下句，而是描述一句话写了什么，一个画面或一个道理，让你写出这一句。比如${named(introPoem)}中，写“${introLine.meaning}”的一句是“${introLine.text}”。\n\n所以每一句都要按意思记住，而且是七至十一年级的全部背诵篇目放在一起，不是一篇一篇分开。做的时候分两步：先从描述想到篇目和句子，再一字不错地写出来，因为错一个字这一句就不得分。下面两个知识点依次练这两步：先在几篇的句子里选出这一句，再给出篇名写出来。`,
);

const chooseLine = choosePoem.lines[1] ?? choosePoem.lines[0]!;
/** chooseExplanation teaches finding a line among several texts by its meaning. */
const chooseExplanation = t(
  `A description of meaning names a picture or an idea. Think first which text it comes from, then which of its lines says it as a whole.\n\nFor example, "${chooseLine.meaning}" describes ${chooseLine.text}, from ${namedEn(choosePoem)}. Read the line and its meaning side by side: what the line says is exactly what the description says.\n\n> **Watch out.** The other options are real lines of other recited texts, and may share a word or a picture with the description. Match the whole line, not one word of it.`,
  `意思的描述说的是一个画面或一个道理。先想它出自哪篇，再想其中哪一句整句说的正是这件事。\n\n比如“${chooseLine.meaning}”，写的是${named(choosePoem)}中的“${chooseLine.text}”。把句子和意思对着读：句子写的，正是描述说的。\n\n> **注意。** 其他选项也是背诵篇目里的真句子，可能有一个词、一个景物和描述相同。要整句对上，不能只对上一个词。`,
);

/** chooseWhy works the choice of a line by its meaning. */
const chooseWhy = (right: string, shown: string): Text => {
  const { poem, line, next } = sourceOf(right);
  return t(
    `**Step 1: find the text.** The description "${shown}" is a picture of ${namedEn(poem)}.\n\n**Step 2: find the line.** In that text, the line that says it is ${right}.\n\n**Check.** Read it with the line it goes with: ${together(poem, line, next)} It fits the text, and as a whole it says what the description says.`,
    `**第一步：想出篇目。**描述“${shown}”写的是${named(poem)}里的情景。\n\n**第二步：找出句子。**这一篇中，整句写这件事的是“${right}”。\n\n**检验。** 和相连的一句合起来读：“${together(poem, line, next)}”放回原文通顺，整句说的正是描述的意思。`,
  );
};

/** chooseWhyNot says where a wrong line comes from and what it says instead. */
const chooseWhyNot = (wrong: string): Text => {
  const { poem, line } = sourceOf(wrong);
  return t(`${wrong} is from ${namedEn(poem)}; it says: ${line.meaning}.`, `“${wrong}”出自${named(poem)}，写的是：${line.meaning}。`);
};

const writeLine = writePoem.lines.find((l) => l.miswritten.length > 0) ?? writePoem.lines[0]!;
const [writeRight, writeWrong] = writeLine.miswritten[0] ?? ["", ""];
/** writeExplanation teaches writing a line from its title and meaning. */
const writeExplanation = t(
  `The title narrows the search to one text; the meaning picks the line in it. Then write it in characters, with no character miswritten: the paper gives no mark to a line with one wrong character.\n\nFor example, the line of ${namedEn(writePoem)} that says "${writeLine.meaning}" is ${writeLine.text}.${writeRight ? ` Its ${writeRight} is often written as ${writeWrong}, which sounds or looks like it but does not fit the meaning.` : ""}\n\n> **Watch out.** Write the line the description asks for, not the one next to it; and think of what each character means in the line, since a wrong character that sounds the same reads aloud with no fault.`,
  `篇名把范围缩到一篇，意思再从这一篇里挑出一句。然后用汉字写出来，一个字都不能错：试卷上错一个字，这一句就不得分。\n\n比如${named(writePoem)}中，写“${writeLine.meaning}”的一句是“${writeLine.text}”。${writeRight ? `句中的“${writeRight}”常被写成“${writeWrong}”，音近或形近，意思却对不上。` : ""}\n\n> **注意。** 要写描述说的那一句，不是它旁边的一句；还要想一想每个字在句中的意思，音同的错字读起来是听不出来的。`,
);

/** writeWhy works the writing of a line from its title and meaning. */
const writeWhy = (right: string): Text => {
  const { poem, line, next } = sourceOf(right);
  const mind = carefulOf(line);
  return t(
    `**Step 1: recall it by its meaning.** In ${namedEn(poem)}, the line that says "${line.meaning}" is this one.\n\n**Step 2: write the line.** ${right}. ${mind.en}\n\n**Check.** Read it with the line it goes with: ${together(poem, line, next)} The two run on in meaning, and every character is the one in the text.`,
    `**第一步：从意思想起。**${named(poem)}中，写“${line.meaning}”的就是这一句。\n\n**第二步：写出这一句。**“${right}”。${mind["zh-CN"]}\n\n**检验。** 和相连的一句合起来读：“${together(poem, line, next)}”前后意思接得上，每个字也都和原文一样。`,
  );
};

/** BRACKETED is a shown sentence with the character asked about in brackets after it. */
const BRACKETED = /^.*（.）$/u;

/** classicalItems are the drill items on a character in brackets of the given grades, each solved as its drill solves it. */
function classicalItems(from: number, to: number): readonly Ask[] {
  const drills = [...classicalDrills, ...seniorClassicalDrills].filter((d) => d.grade >= from && d.grade <= to);
  return interleave(
    drills.map((d) =>
      d.points.flatMap((p) =>
        p.items.flatMap((item: DrillItem): Ask[] => {
          if (!BRACKETED.test(item.shown)) return [];
          const solution = p.why(item.right, item.shown);
          const reasons = p.whyNot ? item.wrong.map((w) => p.whyNot!(w, item.right, item.shown)) : [];
          const list = (l: "en" | "zh-CN") => reasons.map((r) => `- ${r[l]}`).join("\n");
          return [
            {
              shown: same(item.shown),
              right: same(item.right),
              wrong: item.wrong.map(same),
              solution:
                reasons.length > 0
                  ? t(`${solution.en}\n\nThe other options:\n\n${list("en")}`, `${solution["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`)
                  : solution,
            },
          ];
        }),
      ),
    ),
  );
}

const lastOf = (ids: readonly string[]): string => {
  const id = ids.at(-1);
  if (!id) throw new Error("gaokao: nothing to follow");
  return id;
};

const lastIdioms = lastOf(idiomsByGrade.flatMap((g) => g.batches.map((b) => b.topic.id)));
const lastPoem = lastOf(recitedPoems.map((p) => p.topic.id));
const lastDrill = lastOf(seniorClassicalDrills.map((d) => d.id));

const junior = classicalItems(5, 9);
const senior = classicalItems(10, 11);

/** Sentence is a sentence of a faulty-sentence topic, faulty or corrected, with its item, its note and its topic. */
interface Sentence {
  readonly item: FaultyItem;
  readonly note: FaultyNote;
  readonly topic: FaultyData;
}

/** sentences finds each faulty and corrected sentence of every faulty-sentence topic. */
const sentences: ReadonlyMap<string, Sentence> = new Map(
  faultyData.flatMap((topic) => {
    const notes = parseFaultyNotes(topic.id, faultyNotes[topic.id]!.notes, topic.items.length);
    return topic.items.flatMap((item, i) => {
      const s: Sentence = { item, note: notes[i]!, topic };
      return [[item.faulty, s] as const, [item.corrected, s] as const];
    });
  }),
);
const sentence = (s: string): Sentence => {
  const found = sentences.get(s);
  if (!found) throw new Error(`gaokao: no faulty-sentence item for ${s}`);
  return found;
};

/** soundItems are the corrected sentences of every faulty-sentence topic, each among three faulty sentences of its topic. */
function soundItems(): readonly ChoiceItem[] {
  return interleave(
    faultyData.map((topic) =>
      topic.items.map((item, i): ChoiceItem => {
        const wrong = [1, 3, 5].map((d) => topic.items[(i + d) % topic.items.length]!.faulty);
        if (new Set([item.corrected, ...wrong]).size !== 4) throw new Error(`gaokao: the sentences offered against ${item.corrected}`);
        return ["", item.corrected, wrong];
      }),
    ),
  );
}

/** deviceItems are the sentences of every rhetoric topic, each with its device among three others of its topic. */
function deviceItems(): readonly ChoiceItem[] {
  return interleave(
    drillData.rhetoric.map((topic) => topic.points[0].items.map((item): ChoiceItem => [item.shown, item.right, [...item.wrong]])),
  );
}

/** naming is the knowledge point of each rhetoric topic that names a sentence's device, by the sentences it asks about. */
const naming = new Map(drillData.rhetoric.flatMap((topic) => topic.points[0].items.map((item) => [item.shown, topic.points[0]] as const)));
const namingOf = (shown: string) => {
  const p = naming.get(shown);
  if (!p) throw new Error(`gaokao: no rhetoric item for ${shown}`);
  return p;
};

const lastFaulty = lastOf(faultyData.map((d) => d.id));
const lastRhetoric = lastOf(drillData.rhetoric.map((d) => d.id));

/** languageTopic is the use of language of the paper beyond idioms: faulty sentences and rhetoric, every kind mixed. */
const languageTopic: TopicDef = {
  id: "gaokao-language",
  title: t("Gaokao: Use of Language", "高考：语言文字运用"),
  summary: t(
    "Faulty sentences and rhetorical devices of every grade mixed, as the paper asks them: the one sentence without a fault among four, then the device a sentence uses.",
    "各年级的病句和修辞手法混在一起，按试卷的问法：先在四个句子中选出没有语病的一项，再判断句子用了什么修辞手法。",
  ),
  intro: t(
    "The use of language on the paper asks two things here. First, among four sentences, the one without a fault: 通过这次活动，我们懂得了团结的重要。 is sound, while 通过这次活动，使我们懂得了团结的重要。 has lost its subject, since 通过 … 使 … make 我们 the object of 使. Second, the device a sentence uses: 小溪一路唱着歌 lets a stream sing as a person does, which is 拟人.\n\nThe first knowledge point finds the sentence without a fault, the second names a sentence's device.",
    "试卷的语言文字运用在这里考两件事。一是在四个句子中选出没有语病的一项：“通过这次活动，我们懂得了团结的重要。”没有语病；“通过这次活动，使我们懂得了团结的重要。”用了“通过……使……”，“我们”成了“使”的宾语，句子缺了主语。二是判断句子用了什么修辞手法：“小溪一路唱着歌”让小溪像人一样唱歌，是拟人。\n\n第一个知识点选出没有语病的句子，第二个判断句子的修辞手法。",
  ),
  prerequisites: [lastFaulty, lastRhetoric],
  encompasses: [],
  xp: 12,
  strand: "grammar",
  practiceOnly: true,
  knowledgePoints: [
    point(
      "gaokao-language-sound",
      t("The Sentence Without a Fault", "没有语病的一项"),
      t(
        "Check each sentence in turn for the six kinds of fault: a wrong word order, a mismatch of parts, a part missing or extra, a mixed structure, a meaning unclear, or a lapse of logic. Find the main parts first, subject, verb and object, and see whether they fit together.\n\nFor example, 春天的公园是一个美丽的季节。 Its main parts are 公园是季节, and a park is not a season: the words do not go together. 春天是一个美丽的季节。 has 春天是季节, which fits, so it is the sound one.\n\n> **Watch out.** A sentence that sounds smooth can still be faulty. 为了防止今后不再发生类似的事故 reads easily, but 防止 and 不再 are two negatives and wish the accident back: count the negatives, do not trust the ear.",
        "逐句检查六类语病：语序不当、搭配不当、成分残缺或赘余、结构混乱、表意不明、不合逻辑。先找出主干，即主语、谓语和宾语，看它们能不能搭配。\n\n例如：春天的公园是一个美丽的季节。主干是“公园是季节”，公园不是季节，搭配不当。“春天是一个美丽的季节。”主干是“春天是季节”，搭配得当，没有语病。\n\n> **注意。** 读起来顺口的句子也可能有语病。“为了防止今后不再发生类似的事故”很通顺，可“防止”和“不再”两重否定，意思成了希望事故再发生：要数清否定，不能只凭语感。",
      ),
      choiceGenerator(
        t("Which sentence has no fault?", "下列句子中，没有语病的一项是"),
        soundItems(),
        (right) => {
          const { item, note, topic } = sentence(right);
          return t(
            `**Step 1: test each sentence for the six kinds of fault.** Find its main parts, then ask whether the parts fit, nothing is missing or extra, the order and logic hold, and it means one thing.\n\n**Step 2: find the one that passes.** ${right} passes: ${note.sound.en}.\n\n**Check.** It is the correction of ${item.faulty} In that sentence ${note.fault.en}. The sound sentence mends just that, and adds no fault of its own.`,
            `**第一步：逐句检查六类语病。**先找主干，再看搭配是否得当、成分是否残缺或多余、语序和逻辑是否正确、意思是否明确。\n\n**第二步：找出没有语病的句子。**“${right}”没有语病：${note.sound["zh-CN"]}。\n\n**检验。** 它是“${item.faulty}”的正确改法：原句${note.fault["zh-CN"]}，属于${topic.fault["zh-CN"]}。这个句子正好改掉了这个毛病，也没有带来新的毛病。`,
          );
        },
        (wrong) => {
          const { note, topic } = sentence(wrong);
          return t(`${wrong} is faulty: ${note.fault.en}.`, `“${wrong}”有语病：${note.fault["zh-CN"]}，属于${topic.fault["zh-CN"]}。`);
        },
      ),
    ),
    point(
      "gaokao-language-rhetoric",
      t("Rhetorical Devices", "修辞手法"),
      t(
        "Name a device by what the sentence does, not by a word it contains: a 像 may compare without being a simile, and a question may be asked for its answer or for effect.\n\nFor example, 什么是幸福？幸福就是和家人在一起的每一天。 asks a question and answers it at once: that is 设问. 这么好的机会，我们怎么能错过呢？ asks and gives no answer, because it means 不能错过: that is 反问.\n\n> **Watch out.** 拟人 and 比喻 can both speak of a thing as something else. 小溪一路唱着歌 makes the stream act as a person, so it is 拟人; 荷叶圆圆的，像一把把绿色的小伞 likens the leaves to another kind of thing, so it is 比喻.",
        "按句子实际的作用判断修辞手法，而不是只看某个词：有“像”字不一定是比喻，问句可能是设问，也可能是反问。\n\n例如：“什么是幸福？幸福就是和家人在一起的每一天。”先问后答，是设问；“这么好的机会，我们怎么能错过呢？”问而不答，意思是“不能错过”，是反问。\n\n> **注意。** 拟人和比喻都会把事物说成别的样子。“小溪一路唱着歌”让小溪像人一样做事，是拟人；“荷叶圆圆的，像一把把绿色的小伞”把荷叶比作另一种事物，是比喻。",
      ),
      choiceGenerator(
        t("Which rhetorical device does this sentence use?", "这个句子用了什么修辞手法？"),
        deviceItems(),
        (right, shown) => namingOf(shown).why(right, shown),
        (wrong, right, shown) => namingOf(shown).whyNot!(wrong, right, shown),
      ),
    ),
  ],
};

/** modernReading are the topics of the reading of modern texts and classical poems: informational, literary, then poems, each with its short answers. */
const modernReading = [
  ...modernTopics(informationalSpec([lastIdioms], informationalPassages)),
  ...modernTopics(literarySpec([lastIdioms], literaryPassages)),
  ...modernTopics(poetrySpec([lastPoem], poetryPassages)),
];

/** gaokaoTopics are the exam topics of the Gaokao course, all practice-only. */
export const gaokaoTopics: readonly TopicDef[] = [
  {
    id: "gaokao-idioms",
    title: t("Gaokao: Idioms in Context", "高考：成语辨析"),
    summary: t(
      "The idioms of grades 7 to 11 mixed, as the paper asks them: the idiom of a meaning, then the idiom a sentence needs, each among four of its set.",
      "七至十一年级的成语混在一起，按试卷的问法：先按意思选成语，再选句子需要的成语，每次在同一组的四个成语中选。",
    ),
    intro: t(
      `The paper asks about idioms two ways: by meaning, and in a sentence. Take **${firstIdiom.text}** (${firstIdiom.pinyin}): it means ${firstIdiom.meaning.en}, and it fills ${firstIdiom.sentences[1]} because there ${gapClue(firstIdiom.text).en}.\n\nThe first knowledge point names the idiom of a meaning, the second the idiom a sentence needs, among four of the same set; these are the idioms of grades 7 to 11.`,
      `试卷考成语有两种问法：按意思选，在句子里选。比如“**${firstIdiom.text}**”（${firstIdiom.pinyin}）：意思是${firstIdiom.meaning["zh-CN"]}；${zhQuote(firstIdiom.sentences[1])}要填它，因为${gapClue(firstIdiom.text)["zh-CN"]}。\n\n第一个知识点按意思选成语，第二个选句子需要的成语，都在同一组的四个成语中选；成语来自七至十一年级。`,
    ),
    prerequisites: [lastIdioms],
    encompasses: [],
    xp: 12,
    strand: "words",
    practiceOnly: true,
    knowledgePoints: [
      point(
        "gaokao-idioms-meaning",
        t("By Meaning", "按意思选成语"),
        t(
          `Many idioms the paper asks about do not mean what their characters suggest. Recall the story or the sense behind each one, not its characters alone. Take ${firstIdiom.text}: it means ${firstIdiom.meaning.en}, as in ${put(firstIdiom.sentences[0], firstIdiom.text)}\n\n> **Watch out.** ${lateIdiom.text} looks as if it said "hardly satisfying", but it means ${lateIdiom.meaning.en}: ${put(lateIdiom.sentences[1], lateIdiom.text)} Go by the meaning you have learned, not by the characters.`,
          `试卷考的很多成语，意思并不是字面上的意思。要想起每个成语背后的出处或含义，而不只看字面。比如“${firstIdiom.text}”，意思是${firstIdiom.meaning["zh-CN"]}：${put(firstIdiom.sentences[0], firstIdiom.text)}\n\n> **注意。** “${lateIdiom.text}”看上去像“很难让人满意”，意思却是${lateIdiom.meaning["zh-CN"]}：${put(lateIdiom.sentences[1], lateIdiom.text)}要按学过的意思选，不能望文生义。`,
        ),
        choiceGenerator(t("Which idiom has this meaning?", "哪个成语是这个意思？"), idiomItems(false), idiomWhy, idiomWhyNot),
      ),
      point(
        "gaokao-idioms-sentence",
        t("In a Sentence", "在句子里选成语"),
        t(
          `Find the clue in the sentence, then check three things in turn: whether the idiom's meaning fits, whether its feeling, praise or blame, fits, and whether it fits the thing it describes. Take ${firstIdiom.sentences[1]} Here ${gapClue(firstIdiom.text).en}, so it needs ${firstIdiom.text}: ${put(firstIdiom.sentences[1], firstIdiom.text)}\n\n> **Watch out.** ${firstMisfit.text} may sound fine there, but it means "${firstMisfit.meaning.en}", and here ${gapClue(firstIdiom.text).en}. Match the clue, not the sound.`,
          `先找出句子里的线索，再依次检查三点：意思是否对得上，感情色彩（褒义还是贬义）是否对得上，适用的对象是否对得上。比如${zhQuote(firstIdiom.sentences[1])}：${gapClue(firstIdiom.text)["zh-CN"]}，所以填“${firstIdiom.text}”：${put(firstIdiom.sentences[1], firstIdiom.text)}\n\n> **注意。** 填“${firstMisfit.text}”读起来也许顺口，可是${gapClue(firstIdiom.text)["zh-CN"]}，而“${firstMisfit.text}”的意思是${firstMisfit.meaning["zh-CN"]}，对不上。要对线索，不能只凭语感。`,
        ),
        choiceGenerator(t("Which idiom fills the gap?", "横线处填哪个成语？"), idiomItems(true), gapWhy, gapWhyNot),
      ),
    ],
  },
  {
    id: "gaokao-recitation",
    title: t("Gaokao: Lines from Their Meaning", "高考：情景式默写"),
    summary: t(
      "The lines of the recited texts of grades 7 to 11 mixed, found from a description of their meaning: first chosen without the title, then written with it.",
      "七至十一年级背诵篇目的句子混在一起，按意思的描述找句子：先不给篇名选出来，再给出篇名写出来。",
    ),
    intro: recitationIntro,
    prerequisites: [lastPoem],
    encompasses: [],
    xp: 12,
    strand: "recitation",
    practiceOnly: true,
    knowledgePoints: [
      point(
        "gaokao-recitation-choose",
        t("Choosing the Line", "选出句子"),
        chooseExplanation,
        choiceGenerator(t("Which line has this meaning?", "哪一句写的是这个意思？"), lineItems(), chooseWhy, chooseWhyNot),
      ),
      point(
        "gaokao-recitation-write",
        t("Writing the Line", "写出句子"),
        writeExplanation,
        typedGenerator("hanzi", t("Write the line.", "写出这一句。"), writtenItems(), writeWhy),
      ),
    ],
  },
  {
    id: "gaokao-classical-words",
    title: t("Gaokao: Words of Classical Chinese", "高考：文言字词"),
    summary: t(
      "The content and function words of classical Chinese from grade 5 to senior school mixed: the meaning or use of a character in a sentence, first of texts before senior school, then of senior ones.",
      "从五年级到高中的文言实词和虚词混在一起：一个字在句中的意思或用法，先是高中以前的篇目，再是高中的篇目。",
    ),
    intro: t(
      "The paper asks about classical words in its passage of classical prose, and the passage may be any text: what it tests is whether the work of the drills has become a habit. In this topic the drills of grades 5 to 11 come back mixed, content words and function words together, and nothing marks which drill a sentence is from.\n\nTake 冀复得兔 (复). Nothing says whether 复 is a content word or a function word; the sentence decides. 复 stands before the verb 得, so it says how the getting happens: again, 再. Put back, 希望再得到兔子 reads smoothly. Each item asks the same two questions: what the character does in its sentence, and whether the whole sentence, put back into modern Chinese, then says something sensible.",
      "高考在文言文阅读里考文言字词，选文可以是任何一篇：考的是练习中的方法有没有变成习惯。这个主题把五到十一年级的练习混在一起出现，实词和虚词放在一起，也不标明句子来自哪个练习。\n\n比如“冀复得兔”（复）。题目不会告诉你“复”是实词还是虚词，要由句子来定。“复”在动词“得”前面，说的是怎样得到：再一次。代回去，“希望再得到兔子”，句子通顺。每道题都问同样两个问题：这个字在句中起什么作用；把整句译回现代汉语，意思讲不讲得通。",
    ),
    prerequisites: [lastDrill],
    encompasses: [],
    xp: 12,
    strand: "classical",
    practiceOnly: true,
    knowledgePoints: [
      point(
        "gaokao-classical-words-junior",
        t("Before Senior School", "高中以前的篇目"),
        t(
          "These are the sentences of the drills of grades 5 to 9, now mixed: a content word's meaning and a function word's usage come in any order, so first ask which the question wants, then work it as the drill did. Take 孔君平诣其父 (诣): it is a content word, and the sentence needs what a guest does at a house, so 诣 is 拜访; put back, 孔君平去拜访孩子的父亲 reads smoothly.\n\n> **Watch out.** The options mix meanings and usages, and one of them is usually the character's meaning in a word of today. Choose by putting each back into the whole sentence, not by which looks familiar.",
          "这里是五到九年级练习过的句子，混在一起出现：实词的意思和虚词的用法顺序不定，所以先看题目问的是哪一种，再像练习时那样去做。比如“孔君平诣其父”（诣）：这是实词，句子需要的是客人登门做的事，所以“诣”是拜访；代回去，“孔君平去拜访孩子的父亲”，句子通顺。\n\n> **注意。** 选项里有意思也有用法，其中往往有一个是这个字在今天的词语里的意思。要把每个选项代回整句来选，不能看哪个眼熟。",
        ),
        examChoice(t("What is the character in brackets here?", "括号里的字在句中是什么意思或用法？"), junior),
      ),
      point(
        "gaokao-classical-words-senior",
        t("Senior Texts", "高中篇目"),
        t(
          "A character of the senior texts often has several meanings and uses. Check each against its place in the sentence: what comes before and after it, and whether it acts as a noun, a verb or a function word. Take 因宾客至蔺相如门谢罪 (因): after 因 comes a person, 宾客, and then the action 至, so Lian Po goes through the guests, and 因 is 凭借、通过.\n\n> **Watch out.** A function word of the senior texts is seldom what it is in modern Chinese: 因 is not 因为 here, nor 所以 a word of result. Decide by where the word stands, never by the modern word it resembles.",
          "高中篇目里的一个字常有好几个意思和用法。拿每一个放回句子里检查：看它前后是什么，它在句中作名词、动词还是虚词。比如“因宾客至蔺相如门谢罪”（因）：“因”后面是人“宾客”，再接动作“至”，廉颇是经由宾客引领去的，所以“因”是凭借、通过。\n\n> **注意。** 高中篇目里的虚词，很少是它在现代汉语里的意思：这里的“因”不是“因为”，“所以”也不表示结果。要看这个字在句中的位置来判断，不能看它像今天的哪个词。",
        ),
        examChoice(t("What is the character in brackets here?", "括号里的字在句中是什么意思或用法？"), senior),
      ),
    ],
  },
  languageTopic,
  languageWritingTopic(languageTopic.id),
  ...modernReading,
  gaokaoEssayTopic,
];

/** gaokaoCourse is the Gaokao course over the two senior courses. */
export function gaokaoCourse(required: CourseDef, selective: CourseDef): CourseDef {
  return {
    id: "chinese-gaokao",
    title: t("Gaokao Chinese", "高考语文"),
    description: t(
      "Practice for the Chinese paper of China's university entrance examination, whose basis is level 4 of the senior standard's academic quality: the units of the required and selective required courses, then idioms in context, lines of recited texts from their meaning, the words of classical Chinese, faulty sentences and rhetorical devices, gaps filled and sentences rewritten, judged by a model, with grades 7 to 11 mixed as the paper mixes them, the reading of informational and literary texts and of classical poems, with short answers judged by a model, and the essay, also judged. It teaches nothing new: its own topics start with practice. In Chinese.",
      "高考语文的练习，依据高中课标学业质量水平 4：必修和选择性必修课程的单元，然后是成语辨析、情景式默写、文言字词、病句和修辞手法、由 AI 评判的语段补写和句子改写，七至十一年级的内容像试卷一样混在一起，信息类和文学类文本阅读以及古代诗歌阅读（简答由 AI 评判），以及同样由 AI 评判的作文。本课程不教新知识：它自己的主题一开始就是练习。用中文讲解。",
    ),
    group: examGroup,
    buildsOn: [...(required.buildsOn ?? [])],
    units: [
      ...required.units,
      ...selective.units,
      {
        title: t("Exam Practice", "考试练习"),
        modules: [{ title: t("Gaokao", "高考"), topics: gaokaoTopics.map((x) => x.id) }],
      },
    ],
  };
}
