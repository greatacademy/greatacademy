// The Gaokao's judged use of language (docs/chinese-curriculum.md §8.5): filling the gaps of a passage with sentences that
// fit, and rewriting a sentence or a passage as asked, both answered in writing and judged by a model against criteria.

import { type CriterionSpec, type Generator, joinText, type Problem, type Rng, same, type TopicDef, t } from "@ga/content";
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
      solution: t(`One good answer:\n\n${quote(model)}`, `一个好的答案：\n\n${quote(model)}`),
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
      solution: t(`One good answer:\n\n${quote(item.model)}`, `一个好的答案：\n\n${quote(item.model)}`),
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
          "Read the whole passage first. Look at what comes just before a gap and just after it: a gap often holds a topic sentence, a turn, a cause, or a sentence parallel to its neighbours. Write a complete sentence that joins the two, keeping to the limit.",
          "先通读全段。看空缺处前一句和后一句：空缺往往是中心句、转折句、原因，或者和前后句式相同的句子。写一个完整的句子把前后连起来，字数不超过要求。",
        ),
        fillGenerator(fillData),
      ),
      point(
        "gaokao-language-rewrite",
        t("Rewriting as Asked", "按要求改写"),
        t(
          "Find every piece of information in the original first, then do exactly what the task asks of the form: so many sentences, a kind of sentence, a structure to imitate or a length. Keep the meaning; change only what the task asks.",
          "先找出原文的每一条信息，再严格按题目对形式的要求改写：几个句子、什么句式、仿照哪种结构、不超过多少字。保持原意，只改题目要求改的地方。",
        ),
        rewriteGenerator(rewriteData),
      ),
    ],
  };
}
