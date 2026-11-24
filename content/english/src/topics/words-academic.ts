// Academic words after the first batch: words of school subjects, ten to a topic.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import { type AcademicSentences, academicSentenceBanks, academicSentences2, academicSentences3 } from "./words-academic-sentences.ts";

const academic2MeaningBank: readonly ChoiceItem[] = [
  ["identify", "to find and name something", ["to hide something", "to make something new"]],
  ["summarize", "to tell the main points in a few words", ["to tell every detail", "to change the ending"]],
  ["explain", "to make something clear by giving reasons", ["to keep something secret", "to ask a question"]],
  ["support", "to give reasons or facts that back up an idea", ["to argue against an idea", "to forget an idea"]],
  ["cause", "what makes something happen", ["what happens last", "a place to live"]],
  ["effect", "what happens because of something", ["the reason something happens", "a kind of tool"]],
  ["structure", "the way the parts of something are arranged", ["the color of something", "the cost of something"]],
  ["process", "a set of steps that lead to a result", ["a single moment", "a kind of animal"]],
  ["region", "a large area of land", ["a short period of time", "a group of words"]],
  ["purpose", "the reason something is done or made", ["the size of something", "the end of a story"]],
];

const academic2UseBank: readonly ChoiceItem[] = [
  ["Can you ___ the bird in this picture?", "identify", ["summarize", "support"]],
  ["In two sentences, ___ what the story is about.", "summarize", ["identify", "cause"]],
  ["Please ___ how you solved the problem.", "explain", ["region", "purpose"]],
  ["Use facts from the article to ___ your answer.", "support", ["identify", "structure"]],
  ["Heavy rain was the ___ of the flood.", "cause", ["effect", "purpose"]],
  ["One ___ of the storm was that the school closed.", "effect", ["cause", "process"]],
  ["The ___ of a bridge must be strong enough to hold trucks.", "structure", ["region", "summary"]],
  ["Making paper is a ___ with many steps.", "process", ["region", "cause"]],
  ["This ___ of the country gets a lot of snow.", "region", ["process", "purpose"]],
  ["The ___ of the meeting was to plan the fair.", "purpose", ["region", "structure"]],
];

const academic3MeaningBank: readonly ChoiceItem[] = [
  ["infer", "to work out something from clues", ["to copy something exactly", "to forget something"]],
  ["interpret", "to explain what something means", ["to build something", "to count something"]],
  ["illustrate", "to show or explain with pictures or examples", ["to hide with a cover", "to finish quickly"]],
  ["method", "a way of doing something", ["a reason to stop", "a type of weather"]],
  ["factor", "one of the things that cause a result", ["the final result", "a kind of building"]],
  ["contrast", "to show how things are different", ["to show how things are the same", "to add things together"]],
  ["survey", "a set of questions asked to many people", ["a single answer", "a short story"]],
  ["data", "facts and numbers collected to study", ["a made-up story", "a guess about the future"]],
  ["occur", "to happen", ["to stop", "to grow"]],
  ["require", "to need", ["to refuse", "to forget"]],
];

const academic3UseBank: readonly ChoiceItem[] = [
  ["Her muddy boots let me ___ that she had been outside.", "infer", ["require", "occur"]],
  ["How do you ___ the last line of the poem?", "interpret", ["survey", "require"]],
  ["Draw a diagram to ___ how a pulley works.", "illustrate", ["occur", "infer"]],
  ["What ___ did you use to measure the plant?", "method", ["factor", "survey"]],
  ["Price was one ___ in our choice of a bike.", "factor", ["method", "data"]],
  ["The essay will ___ city life with life on a farm.", "contrast", ["occur", "require"]],
  ["We did a ___ to find out the class's favorite lunch.", "survey", ["factor", "method"]],
  ["The scientists collected ___ about the temperature each day.", "data", ["survey", "factor"]],
  ["Earthquakes often ___ along this coast.", "occur", ["require", "contrast"]],
  ["Most plants ___ sunlight to grow.", "require", ["occur", "infer"]],
];

const glossary = new Map([
  ...[...academic2MeaningBank, ...academic3MeaningBank].map(([word, meaning]) => [word, meaning] as const),
  ["summary", "a short statement of the main points"],
]);

/** bold finds the word in bold in a sentence, or gives back what is shown when nothing is bold. */
const bold = (shown: string): string => /\*\*(.+?)\*\*/.exec(shown)?.[1] ?? shown;

const notTheMeaning = (wrong: string, _right: string, shown: string) =>
  t(
    `“${wrong}” is not what *${bold(shown)}* means. Picture *${bold(shown)}* in a question from schoolwork and check whether this meaning would make sense there.`,
    `*${bold(shown)}* 的意思不是“${wrong}”。设想 *${bold(shown)}* 出现在一道作业题里，看看这个意思放在那里是否说得通。`,
  );

const wrongWord = (wrong: string) => {
  const meaning = glossary.get(wrong);
  if (meaning === undefined) throw new Error(`no meaning for the option "${wrong}"`);
  return t(
    `“${wrong}” means *${meaning}*, which does not complete the thought of this sentence.`,
    `“${wrong}” 的意思是 *${meaning}*，放进这个句子意思不通。`,
  );
};

const meaning = (bank: readonly ChoiceItem[], sentences: AcademicSentences) =>
  choiceGenerator(
    t("What does the word in bold mean?", "加粗的词是什么意思？"),
    [...bank.map(([word, right, wrong]): ChoiceItem => [`**${word}**`, right, wrong]), ...academicSentenceBanks(bank, sentences).meaning],
    (right, shown) =>
      t(
        `${shown} The word in bold means **${right}**.\n\n**Check.** Replace *${bold(shown)}* with **${right}** in a schoolwork sentence—the meaning stays natural and exact.`,
        `${shown} 加粗的词的意思是 **${right}**。\n\n**检验。**把作业题里的 *${bold(shown)}* 换成 **${right}**——句意依然自然准确。`,
      ),
    notTheMeaning,
  );

const use = (bank: readonly ChoiceItem[], meanings: readonly ChoiceItem[], sentences: AcademicSentences) =>
  choiceGenerator(
    t("Which word completes the sentence?", "哪个词能补全句子？"),
    [...bank, ...academicSentenceBanks(meanings, sentences).use],
    (right, shown) =>
      t(
        `${shown.replace("___", `**${right}**`)} Its meaning completes the thought of the sentence.\n\n**Check.** Substitute the definition of **${right}** (${glossary.get(right) ?? right}) into the blank—the whole sentence makes clear sense.`,
        `${shown.replace("___", `**${right}**`)} 这个词的意思最符合句子。\n\n**检验。**把 **${right}** 的释义（*${glossary.get(right) ?? right}*）代入空格——整句话逻辑通顺。`,
      ),
    wrongWord,
  );

/** academicWordTopics are the batches of academic words after the first. */
export const academicWordTopics: readonly TopicDef[] = [
  {
    id: "academic-words-2",
    title: t("Academic Words 2", "学术词汇 2"),
    summary: t(
      "Words for what schoolwork asks you to do: identify, summarize, explain, support and more.",
      "作业中常见的要求用词：identify、summarize、explain、support 等。",
    ),
    intro: t(
      "A science question might ask you to **explain** a **process** or **support** your answer with facts. Knowing these schoolwork words lets you understand exactly what a task is asking.",
      "科学题可能会让你 **explain** 一个 **process**，或用事实 **support** 你的答案。掌握这些学科常用词，就能准确看懂题目要求。",
    ),
    prerequisites: ["academic-words-1"],
    encompasses: [{ topic: "academic-words-1", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "academic-2-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "Many questions in school are built on a few words. To **identify** is to find and name, to **summarize** is to give the main points briefly, to **explain** is to make clear with reasons, and to **support** is to back up an idea with facts. The others here are **cause, effect, structure, process, region** and **purpose**.\n\n> **Watch out.** Do not confuse **cause** and **effect**—the *cause* happens first and makes the *effect* happen.",
          "学校里的许多题目都建立在几个词上。**identify** 是找出并说出名称，**summarize** 是简要说出要点，**explain** 是用理由讲清楚，**support** 是用事实支持观点。这里还有 **cause, effect, structure, process, region, purpose**。\n\n> **注意。**不要混淆 **cause** 和 **effect**——*cause*（原因）先发生，导致了 *effect*（结果）。",
        ),
        meaning(academic2MeaningBank, academicSentences2),
      ),
      point(
        "academic-2-use",
        t("Using Them", "使用它们"),
        t(
          "A cause comes before its effect: rain is the cause, and the flood is the effect. Read the whole sentence, decide what kind of word fits the blank, and then choose the word whose meaning completes the thought.\n\n> **Watch out.** Check whether the blank needs an action verb (like *identify* or *summarize*) or a noun (like *region* or *process*) before picking.",
          "原因（cause）在结果（effect）之前：雨是原因，洪水是结果。读完整个句子，判断空格需要什么样的词，再选择意思能使句子完整的词。\n\n> **注意。**选词前先看空格需要动词（如 *identify*、*summarize*）还是名词（如 *region*、*process*）。",
        ),
        use(academic2UseBank, academic2MeaningBank, academicSentences2),
      ),
    ],
  },
  {
    id: "academic-words-3",
    title: t("Academic Words 3", "学术词汇 3"),
    summary: t(
      "Words for working with information: infer, interpret, data, survey and more.",
      "处理信息时的用词：infer、interpret、data、survey 等。",
    ),
    intro: t(
      "When a class collects **data** from a **survey** and tries to **interpret** the numbers, these words name each step of working with information.",
      "当班级通过 **survey** 收集 **data** 并试图 **interpret** 这些数字时，这些词正好说明了处理信息的每一步。",
    ),
    prerequisites: ["academic-words-2"],
    encompasses: [{ topic: "academic-words-2", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "academic-3-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "To **infer** is to work out something the text does not say from clues it does give. To **interpret** is to explain what something means. **Data** are facts and numbers collected to study, often gathered by a **survey**. The others here are **illustrate, method, factor, contrast, occur** and **require**.\n\n> **Watch out.** A **factor** is one thing that helps cause a result—it is not the final result itself.",
          "**infer** 是根据文本给出的线索推断它没有直接说的内容。**interpret** 是解释某事物的意义。**data** 是为了研究而收集的事实和数字，常常通过 **survey**（调查）获得。这里还有 **illustrate, method, factor, contrast, occur, require**。\n\n> **注意。****factor** 是促成结果的因素之一，而不是最终结果本身。",
        ),
        meaning(academic3MeaningBank, academicSentences3),
      ),
      point(
        "academic-3-use",
        t("Using Them", "使用它们"),
        t(
          "*Contrast* points to differences, while *compare* looks at both likenesses and differences. *Occur* and *require* are formal words for *happen* and *need*. Read the whole sentence and choose the word whose meaning completes the thought.\n\n> **Watch out.** Test *occur* by substituting *happen* and *require* by substituting *need*—if the simpler word does not fit, pick another option.",
          "*contrast* 着眼于差异，而 *compare* 既看相同点也看不同点。*occur* 和 *require* 是 *happen* 和 *need* 的正式说法。读完整个句子，选择意思能使句子完整的词。\n\n> **注意。**检验 *occur* 时可代换成 *happen*，检验 *require* 时可代换成 *need*——如果简单词放进去不通，就换一个选项。",
        ),
        use(academic3UseBank, academic3MeaningBank, academicSentences3),
      ),
    ],
  },
];
