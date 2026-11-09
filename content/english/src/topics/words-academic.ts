// Academic words after the first batch: words of school subjects, ten to a topic.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";

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

const meaning = (bank: readonly ChoiceItem[]) =>
  choiceGenerator(t("What does this word mean?", "这个词是什么意思？"), bank, (right, shown) =>
    t(
      `*${shown}* means **${right}**. The other options describe something else, so they do not fit the word.`,
      `*${shown}* 的意思是 **${right}**。其他选项描述的是别的东西，与这个词不符。`,
    ),
  );

const use = (bank: readonly ChoiceItem[]) =>
  choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), bank, (right, shown) =>
    t(
      `${shown.replace("___", `**${right}**`)} Its meaning completes the thought of the sentence.`,
      `${shown.replace("___", `**${right}**`)} 这个词的意思最符合句子。`,
    ),
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
    prerequisites: ["academic-words-1"],
    encompasses: [{ topic: "academic-words-1", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "academic-2-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "Many questions in school are built on a few words. To **identify** is to find and name, to **summarize** is to give the main points briefly, to **explain** is to make clear with reasons, and to **support** is to back up an idea with facts. The others here are **cause, effect, structure, process, region** and **purpose**.",
          "学校里的许多题目都建立在几个词上。**identify** 是找出并说出名称，**summarize** 是简要说出要点，**explain** 是用理由讲清楚，**support** 是用事实支持观点。这里还有 **cause, effect, structure, process, region, purpose**。",
        ),
        meaning(academic2MeaningBank),
      ),
      point(
        "academic-2-use",
        t("Using Them", "使用它们"),
        t(
          "A cause comes before its effect: rain is the cause, and the flood is the effect. Read the whole sentence, decide what kind of word fits the blank, and then choose the word whose meaning completes the thought.",
          "原因（cause）在结果（effect）之前：雨是原因，洪水是结果。读完整个句子，判断空格需要什么样的词，再选择意思能使句子完整的词。",
        ),
        use(academic2UseBank),
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
    prerequisites: ["academic-words-2"],
    encompasses: [{ topic: "academic-words-2", weight: 0.2 }],
    xp: 12,
    knowledgePoints: [
      point(
        "academic-3-meanings",
        t("What They Mean", "它们的含义"),
        t(
          "To **infer** is to work out something the text does not say from clues it does give. To **interpret** is to explain what something means. **Data** are facts and numbers collected to study, often gathered by a **survey**. The others here are **illustrate, method, factor, contrast, occur** and **require**.",
          "**infer** 是根据文本给出的线索推断它没有直接说的内容。**interpret** 是解释某事物的意义。**data** 是为了研究而收集的事实和数字，常常通过 **survey**（调查）获得。这里还有 **illustrate, method, factor, contrast, occur, require**。",
        ),
        meaning(academic3MeaningBank),
      ),
      point(
        "academic-3-use",
        t("Using Them", "使用它们"),
        t(
          "*Contrast* points to differences, while *compare* looks at both likenesses and differences. *Occur* and *require* are formal words for *happen* and *need*. Read the whole sentence and choose the word whose meaning completes the thought.",
          "*contrast* 着眼于差异，而 *compare* 既看相同点也看不同点。*occur* 和 *require* 是 *happen* 和 *need* 的正式说法。读完整个句子，选择意思能使句子完整的词。",
        ),
        use(academic3UseBank),
      ),
    ],
  },
];
