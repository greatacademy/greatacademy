// The Gaokao course (docs/chinese-curriculum.md §8.5): practice for the Chinese paper of the university entrance
// examination over the two senior courses. It holds their units and exam topics of its own, all practice-only,
// that mix what grades 7 to 11 teach, as the paper does: idioms in context, lines of recited texts from a description of
// their meaning, the words of classical Chinese, the use of language, and the reading of modern texts, informational and literary.

import { type CourseDef, same, type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-chinese";
import { classicalDrills } from "../classical/drills.ts";
import { seniorClassicalDrills } from "../classical/senior-drills.ts";
import type { DrillItem } from "../grammar/drill.ts";
import { drillData } from "../grammar/drill-data.ts";
import { faultyData } from "../grammar/faulty-data.ts";
import { type Ask, examChoice, examGroup } from "../hsk/index.ts";
import type { Idiom } from "../idioms/idioms.ts";
import { idiomsByGrade } from "../idioms/index.ts";
import { recitedPoems } from "../recitation/index.ts";
import type { Poem } from "../recitation/poems.ts";
import { gaokaoEssayTopic } from "../writing/later.ts";
import { informationalPassages } from "./informational-data.ts";
import { literaryPassages } from "./literary-data.ts";
import { informationalSpec, literarySpec, modernTopics } from "./modern.ts";

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

/** modernReading are the topics of the reading of modern texts: informational, then literary, each with its short answers. */
const modernReading = [
  ...modernTopics(informationalSpec([lastIdioms], informationalPassages)),
  ...modernTopics(literarySpec([lastIdioms], literaryPassages)),
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
    prerequisites: [lastPoem],
    encompasses: [],
    xp: 12,
    strand: "recitation",
    practiceOnly: true,
    knowledgePoints: [
      point(
        "gaokao-recitation-choose",
        t("Choosing the Line", "选出句子"),
        t(
          "A description of meaning names a picture or an idea. Think which text it comes from, then which of its lines says it.",
          "意思的描述说的是一个画面或一个道理。先想它出自哪篇，再想是其中哪一句。",
        ),
        choiceGenerator(t("Which line has this meaning?", "哪一句写的是这个意思？"), lineItems(), (right) => {
          const source = lineSource.get(right);
          return t(`It is ${right}, from ${source?.poem.title.en ?? ""}.`, `是“${right}”，出自《${source?.poem.title["zh-CN"] ?? ""}》。`);
        }),
      ),
      point(
        "gaokao-recitation-write",
        t("Writing the Line", "写出句子"),
        t(
          "Write the line in characters, with no character miswritten: the paper gives no mark to a line with one wrong character.",
          "用汉字写出这一句，一个字都不能写错：试卷上错一个字，这一句就不得分。",
        ),
        typedGenerator("hanzi", t("Write the line.", "写出这一句。"), writtenItems(), (right) => {
          const source = lineSource.get(right);
          return t(
            `The line is: ${right}`,
            `这一句是：${right}${source ? `（${source.poem.author["zh-CN"]}《${source.poem.title["zh-CN"]}》）` : ""}`,
          );
        }),
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
  ...modernReading,
  gaokaoEssayTopic,
];

/** gaokaoCourse is the Gaokao course over the two senior courses. */
export function gaokaoCourse(required: CourseDef, selective: CourseDef): CourseDef {
  return {
    id: "chinese-gaokao",
    title: t("Gaokao Chinese", "高考语文"),
    description: t(
      "Practice for the Chinese paper of China's university entrance examination, whose basis is level 4 of the senior standard's academic quality: the units of the required and selective required courses, then idioms in context, lines of recited texts from their meaning, the words of classical Chinese, with grades 7 to 11 mixed as the paper mixes them, the reading of informational and literary texts, with short answers judged by a model, and the essay, also judged. It teaches nothing new: its own topics start with practice. In Chinese.",
      "高考语文的练习，依据高中课标学业质量水平 4：必修和选择性必修课程的单元，然后是成语辨析、情景式默写和文言字词，七至十一年级的内容像试卷一样混在一起，信息类和文学类文本阅读（简答由 AI 评判），以及同样由 AI 评判的作文。本课程不教新知识：它自己的主题一开始就是练习。用中文讲解。",
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
