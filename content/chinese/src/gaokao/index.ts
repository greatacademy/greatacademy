// The Gaokao course (docs/chinese-curriculum.md §8.5): practice for the Chinese paper of the university entrance
// examination over the two senior courses. It holds their units and exam topics of its own, all practice-only,
// that mix what grades 7 to 11 teach, as the paper does: idioms in context, lines of recited texts from a description of
// their meaning, the words of classical Chinese, the use of language, with sentences written and judged by a model, and the reading of modern texts, informational and literary, and of classical poems.

import { type CourseDef, same, type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-chinese";
import { classicalDrills } from "../classical/drills.ts";
import { seniorClassicalDrills } from "../classical/senior-drills.ts";
import type { DrillItem } from "../grammar/drill.ts";
import { drillData } from "../grammar/drill-data.ts";
import { faultyData } from "../grammar/faulty-data.ts";
import { type Ask, examChoice, examGroup } from "../hsk/exam.ts";
import type { Idiom } from "../idioms/idioms.ts";
import { idiomsByGrade } from "../idioms/index.ts";
import { recitedPoems } from "../recitation/index.ts";
import type { Line, Poem } from "../recitation/poems.ts";
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

/** others are three of the other idioms of a batch, starting after the ith. */
const others = (batch: readonly Idiom[], i: number): readonly Idiom[] =>
  [1, 3, 5].map((d) => batch[(i + d) % batch.length]!).filter((x) => x !== batch[i]);

const idiomBatches = idiomsByGrade.filter((g) => g.grade >= FROM).flatMap((g) => g.batches.map((b) => b.idioms));

/** idiomItems are the idioms of grades 7 to 11, each with three others of its batch, by meaning or in its second sentence. */
function idiomItems(inSentence: boolean): readonly ChoiceItem[] {
  return interleave(
    idiomBatches.map((batch) =>
      batch.map((idiom, i): ChoiceItem => {
        const wrong = others(batch, i).map((x) => x.text);
        if (new Set(wrong).size !== 3) throw new Error(`gaokao: the idioms offered against ${idiom.text}`);
        return [inSentence ? idiom.sentences[1] : idiom.meaning["zh-CN"], idiom.text, wrong];
      }),
    ),
  );
}

const idiomMeaning = new Map(idiomBatches.flat().map((i) => [i.text, i]));

/** idiomWhy explains an idiom. */
const idiomWhy = (right: string): Text => {
  const idiom = idiomMeaning.get(right);
  return t(
    `${right} (${idiom?.pinyin ?? ""}) means ${idiom?.meaning.en ?? ""}.`,
    `“${right}”（${idiom?.pinyin ?? ""}）的意思是：${idiom?.meaning["zh-CN"] ?? ""}。`,
  );
};

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
const BRACKETED = /^(.*)（(.)）$/u;

/** classicalItems are the drill items on a character in brackets of the given grades, each explained by its sentence. */
function classicalItems(from: number, to: number): readonly Ask[] {
  const drills = [...classicalDrills, ...seniorClassicalDrills].filter((d) => d.grade >= from && d.grade <= to);
  return interleave(
    drills.map((d) =>
      d.points
        .flatMap((p) => p.items)
        .flatMap((item: DrillItem): Ask[] => {
          const m = BRACKETED.exec(item.shown);
          if (!m) return [];
          return [
            {
              shown: same(item.shown),
              right: same(item.right),
              wrong: item.wrong.map(same),
              solution: t(`In ${m[1]}, ${m[2]} is: ${item.right}.`, `在“${m[1]}”中，“${m[2]}”是：${item.right}。`),
            },
          ];
        }),
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
        "Check each sentence in turn for the six kinds of fault: a wrong word order, a mismatch of parts, a part missing or extra, a mixed structure, a meaning unclear, or a lapse of logic. Find the main parts first, subject, verb and object, and see whether they fit together.",
        "逐句检查六类语病：语序不当、搭配不当、成分残缺或赘余、结构混乱、表意不明、不合逻辑。先找出主干，即主语、谓语和宾语，看它们能不能搭配。",
      ),
      choiceGenerator(t("Which sentence has no fault?", "下列句子中，没有语病的一项是"), soundItems(), (right) =>
        t(`The sentence without a fault is: ${right}`, `没有语病的是：${right}`),
      ),
    ),
    point(
      "gaokao-language-rhetoric",
      t("Rhetorical Devices", "修辞手法"),
      t(
        "Name a device by what the sentence does, not by a word it contains: a 像 may compare without being a simile, and a question may be asked for its answer or for effect.",
        "按句子实际的作用判断修辞手法，而不是只看某个词：有“像”字不一定是比喻，问句可能是设问，也可能是反问。",
      ),
      choiceGenerator(t("Which rhetorical device does this sentence use?", "这个句子用了什么修辞手法？"), deviceItems(), (right) =>
        t(`It uses ${right}.`, `这个句子用了${right}。`),
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
          "Many idioms the paper asks about do not mean what their characters suggest. Recall the story or the sense behind each one, not its characters alone.",
          "试卷考的很多成语，意思并不是字面上的意思。要想起每个成语背后的出处或含义，而不只看字面。",
        ),
        choiceGenerator(t("Which idiom has this meaning?", "哪个成语是这个意思？"), idiomItems(false), idiomWhy),
      ),
      point(
        "gaokao-idioms-sentence",
        t("In a Sentence", "在句子里选成语"),
        t(
          "Check three things in turn: whether the idiom's meaning fits, whether its feeling, praise or blame, fits, and whether it fits the thing it describes.",
          "依次检查三点：意思是否对得上，感情色彩（褒义还是贬义）是否对得上，适用的对象是否对得上。",
        ),
        choiceGenerator(t("Which idiom fills the gap?", "横线处填哪个成语？"), idiomItems(true), idiomWhy),
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
          "Read the whole sentence and put it into modern Chinese; the meaning that makes the sentence say something sensible is the one.",
          "读完整个句子，把它翻成现代汉语；能让句子讲得通的那个意思就是答案。",
        ),
        examChoice(t("What is the character in brackets here?", "括号里的字在句中是什么意思或用法？"), junior),
      ),
      point(
        "gaokao-classical-words-senior",
        t("Senior Texts", "高中篇目"),
        t(
          "A character often has several meanings and uses. Check each against its place in the sentence: what comes before and after it, and whether it acts as a noun, a verb or a function word.",
          "一个字常有好几个意思和用法。拿每一个放回句子里检查：看它前后是什么，它在句中作名词、动词还是虚词。",
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
