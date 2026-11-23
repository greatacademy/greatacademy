// The tasks of the new HSK's writing paper that the levels' paragraph writing lacks (docs/chinese-curriculum.md §8.5),
// as the structure of the exam published in December 2025 sets them: a sentence written with a given word (HSK 4, part
// one), a story told from four scenes (HSK 5, part one, where the paper shows four pictures) and a practical text for a
// stated purpose (HSK 6, part one). Each is a practice-only topic judged by a model.

import { type CriterionSpec, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, quote, type WritingItem, writingGenerator } from "@ga/subject-chinese";
import { withPictures } from "../illustrations.ts";
import { GAP, parseLevelWords } from "../level-1/words.ts";
import { levelWritingId } from "../level-1/writing.ts";
import { levelFourPlan } from "../level-4/plan.ts";
import { wordBatchesA } from "../level-4/word-data-a.ts";
import { wordBatchesB } from "../level-4/word-data-b.ts";
import { type PaperItem, practicalTexts, sceneStories } from "./paper-data.ts";
import { chartTasks, essayTasks, translationTasks } from "./paper-data-79.ts";

/**
 * PAPER_MINIMUMS are the fewest characters of each task: the paper sets those of the story and the practical text, and
 * about 200 and 600 for the chart and the essay of HSK 7–9, punctuation counted, of which some 150 and 420 Chinese
 * characters are asked; a sentence of fewer than eight is too slight to show the word in use, and a translation of fewer
 * than 100 leaves out much of its source.
 */
export const PAPER_MINIMUMS = { sentence: 8, story: 100, practical: 150, chart: 150, essay: 420, translation: 100 } as const;

/** WORD_STEP takes every so many words of level 4 for the sentences, so that they spread over its units. */
const WORD_STEP = 16;

const han = (text: string): number => [...text].filter((ch) => /\p{Script=Han}/u.test(ch)).length;

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** wordItems are the sentence tasks: words of two characters or more from level 4, each with its sentence as the model. */
export const wordItems: readonly WritingItem[] = [...wordBatchesA, ...wordBatchesB]
  .flatMap((b) => parseLevelWords(b.data, 4))
  .filter((w) => [...w.word].length >= 2)
  .filter((_, i) => i % WORD_STEP === 0)
  .map((w) => ({ task: `用“${w.word}”写一个句子。`, model: w.sentence.replace(GAP, w.word) }))
  .filter((item) => han(item.model) >= PAPER_MINIMUMS.sentence + 2);

/** checked fails unless a set has at least twelve tasks and every model meets its minimum. */
function checked(name: string, items: readonly PaperItem[], least: number): readonly PaperItem[] {
  if (items.length < 12) throw new Error(`${name}: needs twelve tasks, has ${items.length}`);
  for (const item of items) if (han(item.model) < least) throw new Error(`${name}: a model of ${han(item.model)} characters`);
  if (new Set(items.map((x) => x.task)).size !== items.length) throw new Error(`${name}: a task appears twice`);
  return items;
}

/** worked writes the solution of a task: what to plan, the model as one good answer, and how to check one's own. */
const worked =
  (plan: Text, check: Text) =>
  (text: string): Text =>
    t(
      `**Step 1: plan what to write.** ${plan.en}\n\n**Step 2: write it.** One good answer:\n\n${quote(text)}\n\n**Check.** ${check.en}`,
      `**第一步：想好要写什么。**${plan["zh-CN"]}\n\n**第二步：写下来。**一个好的答案：\n\n${quote(text)}\n\n**检验。** ${check["zh-CN"]}`,
    );

/** paperTopic builds a practice-only topic of one task of the paper. */
function paperTopic(spec: {
  id: string;
  title: TopicDef["title"];
  summary: TopicDef["summary"];
  after: string;
  criteria: readonly string[];
  intro: Text;
  explanation: Text;
  callout: Text;
  plan: Text;
  check: Text;
  question: Text;
  items: readonly WritingItem[];
  least: number;
  most: number;
}): TopicDef {
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro: spec.intro,
    prerequisites: [spec.after],
    encompasses: [],
    xp: 12,
    strand: "writing",
    practiceOnly: true,
    criteria: spec.criteria.map(criterion),
    knowledgePoints: [
      point(
        spec.id,
        spec.title,
        t(
          `${spec.explanation.en}\n\n> **Watch out.** ${spec.callout.en}`,
          `${spec.explanation["zh-CN"]}\n\n> **注意。** ${spec.callout["zh-CN"]}`,
        ),
        writingGenerator(
          spec.question,
          spec.items,
          [...spec.criteria],
          { minWords: spec.least, maxChars: spec.most },
          worked(spec.plan, spec.check),
        ),
      ),
    ],
  };
}

/** paperTopics are the paper's tasks of an HSK course, by its key: HSK 4, 5 and 6 have one each, HSK 7–9 three. */
export function paperTopics(key: string): readonly TopicDef[] {
  if (key === "4") {
    checked("hsk-4-word-sentences", wordItems, PAPER_MINIMUMS.sentence);
    const first = wordItems[0]!;
    const word = /“(.+)”/u.exec(first.task)?.[1] ?? "";
    return [
      paperTopic({
        id: "hsk-4-word-sentences",
        title: t("HSK 4: A Sentence with a Given Word", "HSK 4：用词造句"),
        summary: t(
          "The first part of the writing paper: a sentence of one's own with a given word of level 4, judged by a model.",
          "写作第一部分：用给出的四级词语自己写一个句子，由 AI 评判。",
        ),
        after: levelFourPlan.last.words,
        criteria: ["hsk-word-use", "hsk-word-grammar", "hsk-word-sense"],
        intro: t(
          `The paper gives a word of level 4 and asks for a sentence of your own with it. Take “${word}”: one good sentence is “${first.model}”, where the word does its work in a small scene of daily life.\n\nThe knowledge point writes such a sentence for words spread over the units of level 4.`,
          `试卷给出一个四级词语，要你用它自己写一个句子。比如“${word}”：一个好的句子是“${first.model}”，这个词在一个日常的小场景里起了作用。\n\n这个知识点为分布在四级各单元的词语造句。`,
        ),
        explanation: t(
          "Think first what the word means and what kind of word it is: a verb takes an object or a complement, a noun a measure word or an adjective, a connective joins two clauses. Then put it in a short scene of daily life, with who, when or why, so that the sentence could only be true with that word.",
          "先想想这个词的意思和词性：动词后面可以带宾语或补语，名词前面可以加量词或形容词，关联词要连接两个分句。再把它放进一个日常的小场景里，说清楚谁、什么时候或者为什么，让这个句子离不开这个词。",
        ),
        callout: t(
          "A sentence that would be just as true without the word shows nothing: 我很喜欢这个 could hold almost any word. Write one where only this word fits.",
          "去掉这个词句子照样成立，就没有表现出这个词：“我很喜欢这个”几乎放什么词都行。要写一个只有这个词才合适的句子。",
        ),
        plan: t(
          "Name the word's meaning and its kind, then choose a small scene, with who, when or why, where it fits.",
          "说出这个词的意思和词性，再选一个有人物、时间或原因的小场景，让它用得上。",
        ),
        check: t(
          "Read the sentence without the word: it no longer makes sense; with it, the sentence is complete and correct.",
          "把这个词拿掉再读：句子就说不通了；放回去，句子完整、正确。",
        ),
        question: t("Write one complete sentence in Chinese with the given word.", "用给出的词语写一个完整的句子。"),
        items: wordItems,
        least: PAPER_MINIMUMS.sentence,
        most: 60,
      }),
    ];
  }
  if (key === "5") {
    return [
      paperTopic({
        id: "hsk-5-scene-stories",
        title: t("HSK 5: A Story from Four Scenes", "HSK 5：看场景写故事"),
        summary: t(
          `The first part of the writing paper, where the paper shows four pictures: a story of at least ${PAPER_MINIMUMS.story} characters that links four scenes, judged by a model.`,
          `写作第一部分（考试中是四张图片）：把四个场景连成一个不少于 ${PAPER_MINIMUMS.story} 字的故事，由 AI 评判。`,
        ),
        after: levelWritingId(5, 2),
        criteria: ["hsk-scenes-all", "hsk-scenes-linked", "hsk-scenes-language"],
        intro: t(
          `The paper shows four pictures, and the story tells all four as one event of at least ${PAPER_MINIMUMS.story} characters. In the scenes of 小王 and the umbrella, the weather turns, a colleague he hardly knows lends him one, and the kindness is returned: a beginning, a turn and an end.\n\nThe knowledge point tells four scenes as one story.`,
          `试卷给出四张图片，要把它们写成一件事，不少于 ${PAPER_MINIMUMS.story} 字。比如小王和雨伞的四个场景：天气变了，一位不太熟的同事把伞借给他，他又回报了这份好意：有开头，有转折，有结尾。\n\n这个知识点把四个场景写成一个故事。`,
        ),
        explanation: t(
          "Read the four scenes as one event: who the people are, what goes wrong or changes, and how it ends. Give each scene a sentence or two, join them with words of time and cause such as 刚……就, 没想到, 于是 and 最后, and add what the people say or feel, so that it reads as a story.",
          "把四个场景看成一件事：人物是谁，中间出了什么问题或者有什么变化，最后怎么样。每个场景写一两句，用“刚……就”“没想到”“于是”“最后”这样表示时间和原因的词连起来，再加上人物说的话或心情，读起来才是一个故事。",
        ),
        callout: t(
          "Four separate descriptions are not a story: each scene must lead to the next. Leave one out, such as the fruit on the second day, and the story loses its end.",
          "四段各自独立的描写不是故事：每个场景都要引出下一个。漏掉一个，比如第二天送水果，故事就没有结尾了。",
        ),
        plan: t(
          "Say who the people are, what goes wrong or changes, and how it ends; choose a word of time or cause to join each scene to the next.",
          "说出人物是谁、出了什么问题或有什么变化、最后怎么样；为每两个场景之间想好一个表示时间或原因的连接词。",
        ),
        check: t(
          `Find all four scenes in order, each joined to the next, and count the characters: at least ${PAPER_MINIMUMS.story}.`,
          `按顺序找到四个场景，每个都和下一个连着；再数字数：不少于 ${PAPER_MINIMUMS.story} 字。`,
        ),
        question: t(
          `Tell the four scenes below as one story in Chinese, of at least ${PAPER_MINIMUMS.story} characters.`,
          `根据下面四个场景，用中文写一个不少于 ${PAPER_MINIMUMS.story} 字的故事。`,
        ),
        items: withPictures(checked("hsk-5-scene-stories", sceneStories, PAPER_MINIMUMS.story)),
        least: PAPER_MINIMUMS.story,
        most: PAPER_MINIMUMS.story * 10,
      }),
    ];
  }
  if (key === "6") {
    return [
      paperTopic({
        id: "hsk-6-practical-texts",
        title: t("HSK 6: A Practical Text", "HSK 6：应用文写作"),
        summary: t(
          `The first part of the writing paper: a notice, post, letter or email of at least ${PAPER_MINIMUMS.practical} characters for a stated purpose, with the points the task asks for, judged by a model.`,
          `写作第一部分：按给出的目的写一则不少于 ${PAPER_MINIMUMS.practical} 字的通知、启事、帖子或邮件，写全题目要求的各点，由 AI 评判。`,
        ),
        after: levelWritingId(6, 2),
        criteria: ["hsk-practical-points", "hsk-practical-form", "hsk-practical-language"],
        intro: t(
          `The paper states a purpose and the points a practical text must cover, and asks for at least ${PAPER_MINIMUMS.practical} characters. A post looking for a flatmate has a title, 诚找室友; then the flat and its conditions, the rent and how it is shared, the flatmate wanted, and how to get in touch, each point in turn.\n\nThe knowledge point writes notices, posts, letters and emails for a stated purpose.`,
          `试卷给出写作目的和应用文必须写到的几点，要求不少于 ${PAPER_MINIMUMS.practical} 字。比如在网上发帖找室友：有标题“诚找室友”；接着依次写房子的位置和条件、房租怎样分担、希望找什么样的室友、联系方式。\n\n这个知识点按给出的目的写通知、启事、帖子、书信和邮件。`,
        ),
        explanation: t(
          "Find who will read the text and what it must make them do or know. Give it the form of its kind: a title for a notice, a greeting and a signature for a letter or email, a way to reply. Then cover every point of the task in turn, each with the details a reader needs, such as times, places, numbers and conditions, in polite, clear language.",
          "先弄清楚读者是谁，这篇文字要让他们知道什么、做什么。按文体写好格式：通知、启事要有标题，书信、邮件要有称呼和署名，还要写明怎样联系。然后把题目要求的每一点依次写到，并写清读者需要的细节，比如时间、地点、数量和条件，语言要礼貌、清楚。",
        ),
        callout: t(
          "Every point of the task is marked: a post that describes the flat well but never says how to get in touch has failed its reader.",
          "题目要求的每一点都要写到：房子写得再好，却没写联系方式，读者还是没法联系你。",
        ),
        plan: t(
          "List the task's points in order, note the details a reader needs for each, and choose the form of the kind of text.",
          "按顺序列出题目要求的各点，为每一点记下读者需要的细节，再确定这种文体的格式。",
        ),
        check: t(
          `Tick off the task's points one by one in your text, check the form, and count the characters: at least ${PAPER_MINIMUMS.practical}.`,
          `对照题目，把要求的各点在文中逐一勾出；核对格式；再数字数：不少于 ${PAPER_MINIMUMS.practical} 字。`,
        ),
        question: t(
          `Write the text below in Chinese, of at least ${PAPER_MINIMUMS.practical} characters.`,
          `按下面的要求，用中文写一篇不少于 ${PAPER_MINIMUMS.practical} 字的应用文。`,
        ),
        items: checked("hsk-6-practical-texts", practicalTexts, PAPER_MINIMUMS.practical),
        least: PAPER_MINIMUMS.practical,
        most: PAPER_MINIMUMS.practical * 10,
      }),
    ];
  }
  if (key === "7-9") {
    const after = levelWritingId(9, 2);
    return [
      paperTopic({
        id: "hsk-7-9-chart-writing",
        title: t("HSK 7–9: Describing a Chart", "HSK 7–9：图表写作"),
        summary: t(
          `The first part of the writing paper: a chart's figures described and analysed in about 200 characters, at least ${PAPER_MINIMUMS.chart}, judged by a model.`,
          `写作第一部分：描述并分析图表中的数据，200 字左右，不少于 ${PAPER_MINIMUMS.chart} 字，由 AI 评判。`,
        ),
        after,
        criteria: ["hsk-chart-data", "hsk-chart-analysis", "hsk-chart-language"],
        intro: t(
          `The paper gives a chart and asks for about 200 characters that describe and analyse it, at least ${PAPER_MINIMUMS.chart}. A table of the hours a city's residents spend on their phones each day: say what it measures and when; give the trend, from 2.1 hours in 2016 to 4.8 in 2024; note that the growth slows after 2020; and close with a cause the figures can bear.\n\nThe knowledge point describes and analyses charts.`,
          `试卷给出一个图表，要求写 200 字左右的描述和分析，不少于 ${PAPER_MINIMUMS.chart} 字。比如某市居民每天使用手机平均时间的表格：先说明统计的是什么、哪几年；再写出趋势，从 2016 年的 2.1 小时增长到 2024 年的 4.8 小时；指出 2020 年以后增长放缓；最后写出数据能支持的原因。\n\n这个知识点描述和分析图表。`,
        ),
        explanation: t(
          "Say first what the chart shows: what is measured, where and over what time. Then give the overall trend or the largest difference with its figures, compare the parts that stand out, and close with a cause or a conclusion the figures support. Use words of quantity and change such as 占, 比例, 增长了, 下降到 and 约, and claim nothing the chart does not show.",
          "先说明图表反映的是什么：统计的对象、范围和时间。再写出总的趋势或者最大的差别，并给出数字；比较其中突出的部分；最后写出数据能支持的原因或结论。用好“占”“比例”“增长了”“下降到”“约”这样表示数量和变化的词，不写图表里看不出的内容。",
        ),
        callout: t(
          "A figure must be read as the chart gives it: if the table stops at 2024, a claim about 2030 is a guess, not an analysis.",
          "数字要按图表给出的来读：表格只到 2024 年，写 2030 年会怎样，就是猜测，不是分析。",
        ),
        plan: t(
          "Name what is measured, where and when; find the overall trend or the largest difference with its figures; and choose the conclusion the figures support.",
          "说出统计的对象、范围和时间；找出总的趋势或最大的差别及其数字；再选定数据能支持的结论。",
        ),
        check: t(
          "Lay each figure you wrote beside the chart: every one matches, and no claim goes beyond what the chart shows.",
          "把你写的每个数字和图表对照：都对得上，没有一句超出图表所能说明的范围。",
        ),
        question: t(
          `Describe and analyse the chart below in Chinese, in about 200 characters and at least ${PAPER_MINIMUMS.chart}.`,
          `根据下面的图表，用中文写一段描述和分析，200 字左右，不少于 ${PAPER_MINIMUMS.chart} 字。`,
        ),
        items: checked("hsk-7-9-chart-writing", chartTasks, PAPER_MINIMUMS.chart),
        least: PAPER_MINIMUMS.chart,
        most: 1000,
      }),
      paperTopic({
        id: "hsk-7-9-essays",
        title: t("HSK 7–9: An Argumentative Essay", "HSK 7–9：议论文写作"),
        summary: t(
          `The second part of the writing paper: an essay of about 600 characters, at least ${PAPER_MINIMUMS.essay}, arguing a position of one's own on a given question, judged by a model.`,
          `写作第二部分：就给出的问题提出并论证自己的观点，600 字左右，不少于 ${PAPER_MINIMUMS.essay} 字，由 AI 评判。`,
        ),
        after,
        criteria: ["hsk-essay-position", "hsk-essay-support", "hsk-essay-language"],
        intro: t(
          `The paper gives a question with two sides and asks for an essay of about 600 characters, at least ${PAPER_MINIMUMS.essay}, arguing your own position. Should university students work while they study? State a position in the first paragraph; give each reason a paragraph with an example; answer the strongest view against yours; and restate the position at the end.\n\nThe knowledge point argues a position on a given question.`,
          `试卷给出一个有两种看法的问题，要求写一篇 600 字左右、不少于 ${PAPER_MINIMUMS.essay} 字的议论文，论证自己的观点。比如大学生该不该在读书期间就开始工作：第一段提出观点；每个理由单独成段，配上例子；回应最有力的反方看法；最后重申观点。\n\n这个知识点就给出的问题论证自己的观点。`,
        ),
        explanation: t(
          "Decide your position before you write and state it in the first paragraph. Give each reason a paragraph of its own, opening with the reason and developing it with an example, a fact or an explanation. Then take the strongest view against yours and answer it, and close by restating your position in the light of what you have shown. Join the paragraphs with words such as 首先, 其次, 诚然……但是 and 由此可见.",
          "动笔前先想好自己的观点，在第一段明确提出。每个理由单独成段，开头写出理由，再用例子、事实或分析展开。然后举出和自己相反的最有力的看法并加以回应，最后结合前面的论证重申观点。段落之间用“首先”“其次”“诚然……但是”“由此可见”等词语连接。",
        ),
        callout: t(
          "Setting out both sides is not a position: an essay that ends 两种看法都有道理 has not argued anything. Choose, and show why.",
          "把两种看法都摆出来不等于有了观点：结尾写“两种看法都有道理”，等于什么也没论证。要做出选择，并说明理由。",
        ),
        plan: t(
          "Write your position in one sentence, choose two reasons with an example for each, and the strongest view against yours with your answer to it.",
          "用一句话写出观点，选两个理由并各配一个例子，再找出最有力的反方看法，想好怎样回应。",
        ),
        check: t(
          `Find the position in the first paragraph, a paragraph for each reason, the answered objection, and the position again at the end; then count: at least ${PAPER_MINIMUMS.essay} characters.`,
          `找一找：第一段的观点，每个理由各占一段，回应过的反方看法，结尾重申的观点；再数字数：不少于 ${PAPER_MINIMUMS.essay} 字。`,
        ),
        question: t(
          `Write an essay in Chinese on the question below, of about 600 characters and at least ${PAPER_MINIMUMS.essay}, stating and arguing your own position.`,
          `就下面的问题，用中文写一篇 600 字左右、不少于 ${PAPER_MINIMUMS.essay} 字的议论文，提出并论证自己的观点。`,
        ),
        items: checked("hsk-7-9-essays", essayTasks, PAPER_MINIMUMS.essay),
        least: PAPER_MINIMUMS.essay,
        most: 2500,
      }),
      paperTopic({
        id: "hsk-7-9-translation",
        title: t("HSK 7–9: Translating into Chinese", "HSK 7–9：翻译成中文"),
        summary: t(
          "The written translation of the paper: a short English text put into natural Chinese, judged by a model on what it keeps, how accurately and how naturally.",
          "试卷中的笔译：把一段英文短文译成自然的中文，由 AI 从信息是否完整、意思是否准确、中文是否自然三方面评判。",
        ),
        after,
        criteria: ["hsk-translate-complete", "hsk-translate-accurate", "hsk-translate-natural"],
        intro: t(
          "The paper gives a short English text to put into natural Chinese, judged on what it keeps, how accurately and how naturally. A text on gardens on city roofs gives its pieces one by one: they cool buildings, collect rainwater, house birds and insects. Each piece must arrive in Chinese, in Chinese order: 在夏天，这些屋顶花园能给建筑降温.\n\nThe knowledge point translates short texts into Chinese.",
          "试卷给出一段英文短文，要译成自然的中文，从信息是否完整、意思是否准确、中文是否自然三方面评判。比如一段讲城市屋顶花园的短文，一条一条地给出信息：给建筑降温、收集雨水、为鸟和昆虫提供栖息地。每条信息都要译出来，并且用中文的语序：“在夏天，这些屋顶花园能给建筑降温。”\n\n这个知识点把短文译成中文。",
        ),
        explanation: t(
          "Read the whole text first and mark its pieces of information: names, numbers, times, causes and what happens. Translate sentence by sentence for meaning, not word by word: Chinese puts time and place before the verb, long modifiers before the noun, and often splits a long sentence in two. Read your Chinese back against the source to check that nothing is lost or added.",
          "先通读全文，标出其中的信息：人名、数字、时间、原因和事件。按意思一句一句地译，不要逐词对译：中文把时间、地点放在动词前面，把长的修饰语放在名词前面，长句常常拆成两句。译完后对照原文再读一遍，检查有没有漏译或多译。",
        ),
        callout: t(
          "Word-for-word order reads as English in Chinese characters: “这些屋顶花园帮助冷却建筑在夏天” keeps every word and loses the Chinese. Put time and place before the verb.",
          "逐词对译，读起来是用汉字写的英语：“这些屋顶花园帮助冷却建筑在夏天”每个词都在，却不是中文。时间、地点要放在动词前面。",
        ),
        plan: t(
          "Read the whole text, mark its pieces of information, and decide where a long sentence should be split.",
          "通读全文，标出其中的信息，再想好哪些长句要拆开。",
        ),
        check: t(
          "Lay your Chinese beside the source piece by piece: nothing is lost, nothing added, and each sentence reads as Chinese.",
          "把译文和原文一条一条对照：没有漏译，没有多译，每句读起来都是中文。",
        ),
        question: t("Translate the text below into Chinese.", "把下面的短文翻译成中文。"),
        items: checked("hsk-7-9-translation", translationTasks, PAPER_MINIMUMS.translation),
        least: PAPER_MINIMUMS.translation,
        most: 1500,
      }),
    ];
  }
  return [];
}
