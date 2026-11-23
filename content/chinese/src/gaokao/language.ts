// The Gaokao's judged use of language (docs/chinese-curriculum.md §8.5): filling the gaps of a passage with sentences that
// fit, and rewriting a sentence or a passage as asked, both answered in writing and judged by a model against criteria.

import { type CriterionSpec, type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { criterionById, point, quote } from "@ga/subject-chinese";

import { type FillItem, fillData, type RewriteItem, rewriteData } from "./language-data.ts";

/** MIN_ITEMS is the fewest items each knowledge point needs, more than the twelve distinct tasks a judged one must have. */
const MIN_ITEMS = 12;

/** FILL_LIMITS bound an answer of filled gaps: a few short sentences. */
const FILL_LIMITS = { minWords: 8, maxChars: 160 };

/** REWRITE_LIMITS bound a rewriting. */
const REWRITE_LIMITS = { minWords: 10, maxChars: 400 };

/** FILL_CRITERIA and REWRITE_CRITERIA are the criteria each kind of task is judged by. */
const FILL_CRITERIA = ["zhgk-fill-fit", "zhgk-fill-content", "zhgk-fill-form"] as const;
const REWRITE_CRITERIA = ["zhgk-rewrite-meaning", "zhgk-rewrite-form", "zhgk-rewrite-fluent"] as const;

const GAPS = ["①", "②", "③"] as const;

/** han counts the Chinese characters of a text. */
const han = (text: string): number => [...text].filter((ch) => /\p{Script=Han}/u.test(ch)).length;

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** checkFill checks that an item's gaps are marked in order, one for each model sentence, and that each model fits its limit. */
export function checkFill(item: FillItem): void {
  const marks = [...item.passage].filter((ch) => (GAPS as readonly string[]).includes(ch));
  const head = item.passage.slice(0, 12);
  if (marks.join("") !== GAPS.slice(0, item.model.length).join("")) throw new Error(`fill ${head}: gaps ${marks.join("")}`);
  if (item.model.length < 2) throw new Error(`fill ${head}: needs two gaps or more`);
  for (const m of item.model) if (han(m) > item.limit) throw new Error(`fill ${head}: ${m} is over ${item.limit} characters`);
}

/** fillAsk is the task of a fill item, with its limit. */
const fillAsk = (item: FillItem): string =>
  `在文中横线处补写恰当的语句，使整段文字语意完整连贯，内容贴切，逻辑严密，每处不超过 ${item.limit} 个字。按 ${GAPS.slice(0, item.model.length).join("")} 的顺序作答。`;

/** fillSolution works a fill item: what surrounds each gap, a sentence for each, and a check of fit and length. */
function fillSolution(item: FillItem, model: string): Text {
  const counts = item.model.map((m, i) => `${GAPS[i]} ${han(m)}`);
  return t(
    `**Step 1: read around each gap.** Read the whole passage, then what comes just before and just after each gap: is it a topic sentence, a turn, a cause, a question, or a sentence parallel to its neighbours?\n\n**Step 2: fill each gap.** One good answer:\n\n${quote(model)}\n\n**Check.** Read the passage with the sentences in place: each answers what comes before it and leads into what follows. Count the characters, ${counts.join(", ")}: each is within the limit of ${item.limit}.`,
    `**第一步：看空缺前后。**通读全段，再看每处空缺的前一句和后一句：这里是中心句、转折、原因、设问，还是和前后句式相同的句子？\n\n**第二步：补写。**一个好的答案：\n\n${quote(model)}\n\n**检验。** 把句子放回原文读一遍：每句都承接前文、引出后文。数一数字数，${counts.join("，")}，都没有超过 ${item.limit} 个字。`,
  );
}

/** rewriteSolution works a rewrite item: the information and the form asked, the rewriting, and a check against the original. */
function rewriteSolution(item: RewriteItem): Text {
  const sentences = item.model.split(/[。？！]/u).filter((x) => x.trim()).length;
  return t(
    `**Step 1: list what to keep and what to change.** Mark every piece of information in the original, then read what the task asks of the form: ${item.ask}\n\n**Step 2: rewrite.** One good answer:\n\n${quote(item.model)}\n\n**Check.** Lay it beside the original: every piece of information is still there, nothing is added, and its form, here ${sentences} sentence${sentences === 1 ? "" : "s"}, is what the task asks.`,
    `**第一步：分清保留什么、改什么。**标出原文的每一条信息，再看题目对形式的要求：${item.ask}\n\n**第二步：改写。**一个好的答案：\n\n${quote(item.model)}\n\n**检验。** 和原文对照：每条信息都还在，没有添加；形式符合题目要求，这里是 ${sentences} 个句子。`,
  );
}

/** fillGenerator asks for the sentences of a passage's gaps. */
function fillGenerator(items: readonly FillItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const ask = fillAsk(item);
    const model = item.model.map((m, i) => `${GAPS[i]}${m}`).join("\n");
    return {
      prompt: joinText([
        t("Read the passage, then fill each gap with a sentence that fits, in Chinese.", "阅读下面的文字，完成题目。"),
        same(quote(item.passage)),
        same(ask),
      ]),
      answer: {
        checker: "writing",
        expected: { ...FILL_LIMITS },
        input: { kind: "writing", ...FILL_LIMITS },
        judged: { criteria: [...FILL_CRITERIA], source: `${item.passage}\n\n${ask}` },
      },
      solution: fillSolution(item, model),
      canonical: model,
      wrong: [[...item.model[0]!].slice(0, 3).join("")],
    };
  };
}

/** rewriteGenerator asks for a sentence or passage rewritten as its item asks. */
function rewriteGenerator(items: readonly RewriteItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    return {
      prompt: joinText([
        t("Read the text, then rewrite it in Chinese as asked.", "阅读下面的文字，按要求改写。"),
        same(quote(item.source)),
        same(item.ask),
      ]),
      answer: {
        checker: "writing",
        expected: { ...REWRITE_LIMITS },
        input: { kind: "writing", ...REWRITE_LIMITS },
        judged: { criteria: [...REWRITE_CRITERIA], source: `${item.source}\n\n${item.ask}` },
      },
      solution: rewriteSolution(item),
      canonical: item.model,
      wrong: [[...item.model].slice(0, 5).join("")],
    };
  };
}

/** languageWritingTopic builds the practice-only topic of the judged use of language, after the topic it follows. */
export function languageWritingTopic(after: string): TopicDef {
  if (fillData.length < MIN_ITEMS || rewriteData.length < MIN_ITEMS)
    throw new Error(`gaokao-language-writing: needs ${MIN_ITEMS} items of each kind`);
  fillData.forEach(checkFill);
  for (const r of rewriteData) if (han(r.model) < REWRITE_LIMITS.minWords) throw new Error(`rewrite ${r.ask}: the model is too short`);
  return {
    id: "gaokao-language-writing",
    title: t("Gaokao: Writing in the Use of Language", "高考：语言表达"),
    summary: t(
      "The written questions of the paper's use of language, judged by a model: sentences that fill the gaps of a passage, and a sentence or passage rewritten as asked.",
      "试卷语言文字运用中要动笔写的题，由 AI 评判：在语段的空缺处补写句子，按要求改写句子或语段。",
    ),
    intro: t(
      "The use of language asks for two kinds of writing: sentences that fill the gaps of a passage, and a text rewritten as asked. In a passage on moss, the first gap turns the common view, “其实，苔藓是生态系统的开路先锋”, in no more than 15 characters; and a long sentence about the tall trees of the rain forest becomes three short ones with nothing lost.\n\nThe first knowledge point fills the gaps of a passage; the second rewrites as asked.",
      "语言文字运用中有两种要动笔写的题：在语段的空缺处补写句子，按要求改写句子或语段。比如写苔藓的语段，第一处空缺要把常见的看法转过来：“其实，苔藓是生态系统的开路先锋”，不超过 15 个字；又如把写热带雨林高大乔木的长句改成三个短句，一条信息也不丢。\n\n第一个知识点是语段补写；第二个是按要求改写。",
    ),
    prerequisites: [after],
    encompasses: [],
    xp: 14,
    strand: "writing",
    practiceOnly: true,
    criteria: [...FILL_CRITERIA, ...REWRITE_CRITERIA].map(criterion),
    knowledgePoints: [
      point(
        "gaokao-language-fill",
        t("Filling the Gaps of a Passage", "语段补写"),
        t(
          "Read the whole passage first. Look at what comes just before a gap and just after it: a gap often holds a topic sentence, a turn, a cause, or a sentence parallel to its neighbours. Write a complete sentence that joins the two, keeping to the limit.\n\nIn the passage on moss, the first gap follows “不过是墙角石缝里一层不起眼的绿色” and comes before what moss does to bare rock, so it turns the common view: “其实，苔藓是生态系统的开路先锋”.\n\n> **Watch out.** A sentence that fits only one side does not fill the gap: it must answer what comes before and lead into what follows. And count the characters: a good sentence over the limit still loses its marks.",
          "先通读全段。看空缺处前一句和后一句：空缺往往是中心句、转折句、原因，或者和前后句式相同的句子。写一个完整的句子把前后连起来，字数不超过要求。\n\n比如写苔藓的语段，第一处空缺前面说它“不过是墙角石缝里一层不起眼的绿色”，后面讲它怎样在裸岩上造出土壤，所以这里要转折：“其实，苔藓是生态系统的开路先锋”。\n\n> **注意。** 只接得上一头的句子填不好空缺：要既承接前文，又引出后文。还要数字数：句子再好，超过字数也要失分。",
        ),
        fillGenerator(fillData),
      ),
      point(
        "gaokao-language-rewrite",
        t("Rewriting as Asked", "按要求改写"),
        t(
          "Find every piece of information in the original first, then do exactly what the task asks of the form: so many sentences, a kind of sentence, a structure to imitate or a length. Keep the meaning; change only what the task asks.\n\nTo turn the long sentence about the emergent trees of the rain forest into three, keep every piece, the height, the crown spread above the canopy, the buttress roots against storms, the home of birds, insects and epiphytes, and only share them out among three sentences.\n\n> **Watch out.** Shortening is not cutting: three short sentences that drop the buttress roots have changed the meaning. Change only the form the task names.",
          "先找出原文的每一条信息，再严格按题目对形式的要求改写：几个句子、什么句式、仿照哪种结构、不超过多少字。保持原意，只改题目要求改的地方。\n\n比如把写热带雨林露生层乔木的长句改成三个短句：高度、树冠在林冠层之上展开、板状根抵抗暴雨强风、鸟类昆虫和附生植物的家园，每条信息都保留，只是分到三个句子里。\n\n> **注意。** 改短不等于删减：三个短句里丢了板状根，意思就变了。只改题目要求改的形式。",
        ),
        rewriteGenerator(rewriteData),
      ),
    ],
  };
}
