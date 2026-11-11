// Grades 9 to 12: grammar, punctuation and style the skill courses lacked: semicolons and colons, periodic and
// cumulative sentences, conditionals, absolute phrases, noun clauses, integrating quotations, word order for emphasis
// and sentence variety for effect.

import { type Text, type TopicDef, t } from "@ga/content";
import { choiceGenerator, point } from "@ga/subject-english";
import {
  absoluteBank,
  conditionalBank,
  emphasisBank,
  nounClauseBank,
  punctuationBank,
  quotationBank,
  shapeBank,
  varietyBank,
} from "./grammar-banks.ts";
import {
  absoluteCombineStep,
  clauseKindStep,
  conditionStep,
  leadInFixStep,
  punctuationFixStep,
  rhythmStep,
  shapeBuildStep,
  stressStep,
} from "./grammar-steps.ts";

const filled = (right: string, shown: string): Text =>
  t(shown.replace("___", `**${right}**`), `正确的句子是：${shown.replace("___", `**${right}**`)}`);

const markName: Readonly<Record<string, readonly [string, string]>> = {
  ";": ["a semicolon", "分号"],
  ":": ["a colon", "冒号"],
  ",": ["a comma", "逗号"],
};

const markWhy: Readonly<Record<string, readonly [string, string]>> = {
  ";": [
    "joins two complete clauses that could each stand alone, or separates items of a list that already contain commas.",
    "连接两个各自可以独立成句的完整分句，或分隔本身含有逗号的列举项。",
  ],
  ":": ["follows a complete clause and points ahead to what explains or lists it.", "跟在一个完整的分句后面，引出对它的解释或列举。"],
  ",": [
    "comes before *and*, *but*, *so* or *yet* when that word joins two clauses; a semicolon there would double the join.",
    "当 *and、but、so、yet* 连接两个分句时，前面用逗号；这里用分号就重复连接了。",
  ],
};

const shapeZh: Readonly<Record<string, string>> = { periodic: "圆周句", cumulative: "累积句", balanced: "平衡句" };

const shapeWhy: Readonly<Record<string, readonly [string, string]>> = {
  periodic: [
    "The modifiers come first and the main clause is held back until the end, so the sentence builds suspense.",
    "修饰成分在前，主句留到最后，句子因此营造出悬念。",
  ],
  cumulative: [
    "The main clause comes first and the details are added after it, one by one, the way the eye takes in a scene.",
    "主句在前，细节在后逐一添加，就像眼睛一点点看清一个场景。",
  ],
  balanced: [
    "Two halves of the same shape are set against each other, so the contrast between them stands out.",
    "结构相同的两半互相对照，使两者的对比更加鲜明。",
  ],
};

const jobZh: Readonly<Record<string, string>> = {
  "the subject": "主语",
  "the direct object": "直接宾语",
  "the object of a preposition": "介词宾语",
  "a subject complement": "主语补足语（表语）",
};

const jobWhy: Readonly<Record<string, readonly [string, string]>> = {
  "the subject": ["The clause comes before the verb and names what the sentence is about.", "从句在动词前面，说明句子讲的是什么。"],
  "the direct object": ["The clause follows an action verb and answers *what?*", "从句跟在行为动词后面，回答“什么”。"],
  "the object of a preposition": ["The clause follows a preposition such as *about*.", "从句跟在 *about* 这类介词后面。"],
  "a subject complement": [
    "The clause follows a linking verb such as *was* and renames the subject.",
    "从句跟在 *was* 这类系动词后面，对主语加以说明。",
  ],
};

const emphasisZh: Readonly<Record<string, string>> = {
  inversion: "倒装",
  fronting: "前置",
  "a cleft sentence": "分裂句",
};

const emphasisWhy: Readonly<Record<string, readonly [string, string]>> = {
  inversion: [
    "The verb, or a helping verb, comes before the subject, usually after a negative or limiting word such as *never*, *only* or *rarely*, or after a phrase of place.",
    "动词或助动词放在主语前面，通常出现在 *never、only、rarely* 这类否定或限制性词语之后，或者表示地点的短语之后。",
  ],
  fronting: [
    "An object or a describing word is moved to the front, but the subject and verb keep their usual order.",
    "宾语或描述性词语被移到句首，但主语和动词保持正常语序。",
  ],
  "a cleft sentence": [
    "The sentence is split with *It was ... that/who* or *What ... is/was* so that one part stands out.",
    "用 *It was ... that/who* 或 *What ... is/was* 把句子拆开，使其中一部分突出。",
  ],
};

/** grammarTopics912 are the topics of grammar, punctuation and style added for grades 9 to 12. */
export const grammarTopics912: readonly TopicDef[] = [
  {
    id: "semicolons-and-colons",
    title: t("Semicolons and Colons", "分号与冒号"),
    summary: t(
      "A semicolon joins two complete clauses or separates items that contain commas; a colon follows a complete clause and introduces what explains it.",
      "分号连接两个完整分句或分隔含逗号的列举项；冒号跟在完整分句后面，引出对它的解释。",
    ),
    prerequisites: ["run-ons-and-comma-splices", "appositives"],
    encompasses: [{ topic: "run-ons-and-comma-splices", weight: 0.3 }],
    xp: 16,
    strand: "writing",
    knowledgePoints: [
      point(
        "semicolon-colon-or-comma",
        t("Semicolon, Colon or Comma", "分号、冒号还是逗号"),
        t(
          "A **semicolon** (;) has two jobs. It joins two complete clauses that are closely related, where a comma alone would make a comma splice: *The storm passed before noon; the roads stayed closed.* It does the same before a word such as *however*, *therefore* or *moreover*, which is followed by a comma: *; however,*. And it separates items of a list that already contain commas: *Lyon, France; Turin, Italy; and Geneva, Switzerland.*\n\nA **colon** (:) follows a complete clause and points ahead: to a list, an explanation, or a quotation. *The recipe needs three things: flour, eggs and milk.* What comes before the colon must be able to stand as a sentence, so never write *The recipe needs: flour, eggs and milk.*\n\nWhen *and*, *but*, *so* or *yet* joins two clauses, a **comma** is enough: the word does the joining.",
          "**分号**（;）有两个用途。一是连接两个关系紧密的完整分句，这时只用逗号就会造成逗号粘连：*The storm passed before noon; the roads stayed closed.* 在 *however、therefore、moreover* 这类词前面也用分号，词后加逗号：*; however,*。二是分隔本身含有逗号的列举项：*Lyon, France; Turin, Italy; and Geneva, Switzerland.*\n\n**冒号**（:）跟在完整分句后面，引出下文：列举、解释或引语。*The recipe needs three things: flour, eggs and milk.* 冒号前面的部分必须能独立成句，所以不要写 *The recipe needs: flour, eggs and milk.*\n\n当 *and、but、so、yet* 连接两个分句时，用**逗号**就够了，因为这些词本身起连接作用。",
        ),
        choiceGenerator(
          t("Which mark belongs in the gap?", "空格处应该用哪个标点？"),
          punctuationBank,
          (right, shown) => {
            const [en, zh] = markName[right] ?? [right, right];
            const [whyEn, whyZh] = markWhy[right] ?? ["", ""];
            return t(
              `${shown.replace(" ___", right)} The gap takes ${en}, which ${whyEn}`,
              `${shown.replace(" ___", right)} 空格处用${zh}：它${whyZh}`,
            );
          },
          (wrong, right) => {
            const [en, zh] = markName[wrong] ?? [wrong, wrong];
            return t(
              right === ","
                ? `${capitalize(en)} would need two clauses with nothing else joining them. Here a joining word already does that job.`
                : wrong === ","
                  ? "A comma alone cannot join two complete clauses or separate items that already contain commas."
                  : `${capitalize(en)} does a different job: check whether what follows explains what came before, or is a second clause of equal weight.`,
              right === ","
                ? `${zh}要求两个分句之间没有别的连接词，而这里已经有连接词了。`
                : wrong === ","
                  ? "单用逗号既不能连接两个完整分句，也不能分隔本身含有逗号的列举项。"
                  : `${zh}的作用不同：看看后面的内容是在解释前面，还是一个同等分量的分句。`,
            );
          },
        ),
      ),
      punctuationFixStep,
    ],
  },
  {
    id: "periodic-and-cumulative-sentences",
    title: t("Periodic and Cumulative Sentences", "圆周句与累积句"),
    summary: t(
      "Where the main clause goes: saved for the end (periodic), stated first and built on (cumulative), or set against its twin (balanced).",
      "主句的位置：留到最后（圆周句）、先说出再添加细节（累积句），或与结构相同的另一半对照（平衡句）。",
    ),
    prerequisites: ["participial-phrases", "parallel-structure"],
    encompasses: [
      { topic: "participial-phrases", weight: 0.2 },
      { topic: "parallel-structure", weight: 0.2 },
    ],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "the-shape-of-a-sentence",
        t("The Shape of a Sentence", "句子的形态"),
        t(
          "Writers choose where to put the main clause. A **cumulative** sentence states it first and then adds details, each modifying what came before: *The old dog limped home, soaked by the rain, its tail low.* It feels natural and descriptive, like a camera moving closer.\n\nA **periodic** sentence holds the main clause back until the end, after the modifiers: *Soaked by the rain, its tail low, the old dog limped home.* The reader waits for the point, so it lands with force.\n\nA **balanced** sentence sets two halves of the same grammatical shape against each other: *Some read to escape the world; others read to understand it.* Balance makes a contrast memorable.\n\nTo tell them apart, find the subject and its verb. If they come first, the sentence is cumulative; if they come last, periodic; if there are two matching halves, balanced.",
          "作者会选择主句的位置。**累积句**（cumulative sentence）先说出主句，再添加细节，每个细节修饰前面的内容：*The old dog limped home, soaked by the rain, its tail low.* 它显得自然而富于描写，像镜头逐渐推近。\n\n**圆周句**（periodic sentence）把主句留到最后，先给出修饰成分：*Soaked by the rain, its tail low, the old dog limped home.* 读者要等到最后才看到要点，所以它更有力量。\n\n**平衡句**（balanced sentence）把语法结构相同的两半互相对照：*Some read to escape the world; others read to understand it.* 平衡使对比令人难忘。\n\n要区分它们，先找出主语和它的谓语。在前面的是累积句，在最后的是圆周句，有两个对称的部分的是平衡句。",
        ),
        choiceGenerator(
          t("What kind of sentence is this?", "这是哪种句子？"),
          shapeBank,
          (right) =>
            t(`It is **${right}**. ${shapeWhy[right]?.[0] ?? ""}`, `这是**${shapeZh[right] ?? right}**。${shapeWhy[right]?.[1] ?? ""}`),
          (wrong) =>
            t(
              `Find the subject and its verb. In a ${wrong} sentence they would be ${wrong === "periodic" ? "at the end" : wrong === "cumulative" ? "at the start" : "repeated in two matching halves"}, and here they are not.`,
              `找出主语和谓语。在${shapeZh[wrong] ?? wrong}中，它们应该${wrong === "periodic" ? "在句末" : wrong === "cumulative" ? "在句首" : "在两个对称的部分中重复出现"}，而这里并非如此。`,
            ),
        ),
      ),
      shapeBuildStep,
    ],
  },
  {
    id: "conditional-sentences",
    title: t("Conditional Sentences", "条件句"),
    summary: t(
      "Real, unreal and past unreal conditions, mixed conditionals, and the inverted forms had I known, were I and should you.",
      "真实条件、非真实条件、过去非真实条件、混合条件句，以及 had I known、were I、should you 等倒装形式。",
    ),
    prerequisites: ["verb-moods"],
    encompasses: [{ topic: "verb-moods", weight: 0.3 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "matching-the-condition",
        t("Matching the Condition", "与条件相配"),
        t(
          "A conditional sentence has an *if* clause and a result. Their verbs must match the kind of condition.\n\n- **Real** (it may happen): *if* + present, *will* + verb. *If it rains tomorrow, the match will move indoors.* For facts that are always true, both clauses take the present: *If you heat ice, it melts.*\n- **Unreal present** (it is not true now): *if* + past, *would* + verb. *If I had more time, I would learn the cello.* Use *were* for every person: *If I were you*.\n- **Unreal past** (it did not happen): *if* + *had* + past participle, *would have* + past participle. *If they had left earlier, they would have missed the storm.*\n- **Mixed**: a past condition with a present result (*If she had taken the job, she would be living in Tokyo now*), or a present condition with a past result (*If he were braver, he would have run for president*).\n\nIn formal writing, *if* can be dropped and the helping verb moved to the front: *Had I known* (= If I had known), *Were I* (= If I were), *Should you need help* (= If you need help). *Unless* means *if not* and takes the same forms as a real condition.",
          "条件句由 *if* 从句和结果从句组成，两者的动词形式必须与条件的类型相配。\n\n- **真实条件**（可能发生）：*if* + 一般现在时，*will* + 动词原形。*If it rains tomorrow, the match will move indoors.* 对于永远成立的事实，两个分句都用一般现在时：*If you heat ice, it melts.*\n- **与现在事实相反**：*if* + 一般过去时，*would* + 动词原形。*If I had more time, I would learn the cello.* 所有人称都用 *were*：*If I were you*。\n- **与过去事实相反**：*if* + *had* + 过去分词，*would have* + 过去分词。*If they had left earlier, they would have missed the storm.*\n- **混合条件句**：过去的条件、现在的结果（*If she had taken the job, she would be living in Tokyo now*），或现在的条件、过去的结果（*If he were braver, he would have run for president*）。\n\n在正式文体中，可以省略 *if*，把助动词提到句首：*Had I known*（= If I had known）、*Were I*（= If I were）、*Should you need help*（= If you need help）。*unless* 意为 *if not*，用法与真实条件相同。",
        ),
        choiceGenerator(t("Which form completes the sentence?", "哪个形式能补全句子？"), conditionalBank, filled, (wrong) =>
          t(
            `“${wrong}” does not match the other clause. Decide first whether the condition is real, unreal now, or unreal in the past, and when its result happens.`,
            `“${wrong}” 与另一个分句不相配。先判断条件是真实的、与现在事实相反的，还是与过去事实相反的，再看结果发生在什么时候。`,
          ),
        ),
      ),
      conditionStep,
    ],
  },
  {
    id: "absolute-phrases",
    title: t("Absolute Phrases", "独立主格结构"),
    summary: t(
      "A noun with a participle of its own, such as her hands trembling, that adds a detail to a whole sentence.",
      "带有自身分词的名词短语，例如 her hands trembling，为整个句子补充细节。",
    ),
    prerequisites: ["participial-phrases"],
    encompasses: [{ topic: "participial-phrases", weight: 0.3 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "finding-the-absolute",
        t("Finding the Absolute Phrase", "找出独立主格结构"),
        t(
          "An **absolute phrase** is a noun followed by a participle or other describing words: *her hands trembling*, *their oars flashing*, *his coat already buttoned*. It has its own little subject, the noun, so it does not describe the subject of the sentence the way a participial phrase does. It adds a detail to the whole scene, like a close-up in a film.\n\nCompare: in *Stepping onto the stage, Maya began to sing*, the participial phrase *stepping onto the stage* tells what Maya did. In *Her hands trembling, Maya began to sing*, the absolute phrase has its own noun, *hands*. A test: add *was* or *were* to an absolute phrase and it becomes a sentence (*Her hands were trembling*); a participial phrase does not (*Stepping onto the stage* has no subject).\n\nA prepositional phrase such as *under the hot lights* begins with a preposition and has no participle.",
          "**独立主格结构**（absolute phrase）由名词加上分词或其他描述性词语构成：*her hands trembling*、*their oars flashing*、*his coat already buttoned*。它有自己的“主语”，也就是那个名词，所以它不像分词短语那样修饰句子的主语，而是为整个场景补充一个细节，像电影里的特写镜头。\n\n比较一下：在 *Stepping onto the stage, Maya began to sing* 中，分词短语 *stepping onto the stage* 说明 Maya 做了什么。在 *Her hands trembling, Maya began to sing* 中，独立主格结构有自己的名词 *hands*。检验方法：在独立主格结构中加上 *was* 或 *were*，它就成了一个句子（*Her hands were trembling*）；分词短语则不行（*Stepping onto the stage* 没有主语）。\n\n*under the hot lights* 这样的介词短语以介词开头，没有分词。",
        ),
        choiceGenerator(
          t("Which phrase in this sentence is an absolute phrase?", "这个句子中哪个短语是独立主格结构？"),
          absoluteBank,
          (right) =>
            t(
              `**${right}** is the absolute phrase: it has a noun of its own followed by a describing word, and adding *was* or *were* would make it a sentence.`,
              `**${right}** 是独立主格结构：它有自己的名词，后面跟着描述性词语，加上 *was* 或 *were* 就能成为句子。`,
            ),
          (wrong) =>
            t(
              /^(under|at|in|near|beside|by|into|across|after|on)\b/.test(wrong)
                ? `“${wrong}” begins with a preposition: it is a prepositional phrase, with no participle.`
                : `“${wrong}” is a participial phrase: it has no noun of its own and describes the subject of the sentence.`,
              /^(under|at|in|near|beside|by|into|across|after|on)\b/.test(wrong)
                ? `“${wrong}” 以介词开头，是介词短语，没有分词。`
                : `“${wrong}” 是分词短语：它没有自己的名词，修饰的是句子的主语。`,
            ),
        ),
      ),
      absoluteCombineStep,
    ],
  },
  {
    id: "noun-clauses",
    title: t("Noun Clauses", "名词性从句"),
    summary: t(
      "Clauses beginning with that, whether, or a wh- word that do the work of a noun: subject, object or complement.",
      "以 that、whether 或 wh- 词开头、起名词作用的从句：作主语、宾语或补足语。",
    ),
    prerequisites: ["relative-clauses"],
    encompasses: [{ topic: "relative-clauses", weight: 0.2 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "the-job-of-a-noun-clause",
        t("The Job of a Noun Clause", "名词性从句的作用"),
        t(
          "A **noun clause** is a whole clause, with its own subject and verb, that fills a place a noun could fill. It begins with *that*, *whether* or *if*, or a *wh-* word: *what, who, which, where, when, why, how*. Replace it with *it* or *something* and the sentence still works.\n\n- As the **subject**, it comes before the verb: ***What the scientist had found** worried the mayor.*\n- As the **direct object**, it follows an action verb: *Nobody knew **whether the bridge was safe**.*\n- As the **object of a preposition**, it follows a word such as *about*: *Everyone argued about **who left the gate open**.* (A clause with *that* cannot follow a preposition.)\n- As a **subject complement**, it follows a linking verb such as *is* or *was*: *The real question was **why the lights went out**.*\n\nUnlike a relative clause, a noun clause does not describe a noun; it *is* the noun of its place in the sentence.",
          "**名词性从句**（noun clause）是有自己的主语和谓语的完整从句，占据名词可以占据的位置。它以 *that*、*whether* 或 *if*，或者 *wh-* 词（*what, who, which, where, when, why, how*）开头。用 *it* 或 *something* 替换它，句子依然成立。\n\n- 作**主语**时，它位于谓语动词前面：***What the scientist had found** worried the mayor.*\n- 作**直接宾语**时，它跟在行为动词后面：*Nobody knew **whether the bridge was safe**.*\n- 作**介词宾语**时，它跟在 *about* 这类介词后面：*Everyone argued about **who left the gate open**.*（以 *that* 开头的从句不能跟在介词后面。）\n- 作**主语补足语**（表语）时，它跟在 *is*、*was* 这类系动词后面：*The real question was **why the lights went out**.*\n\n与定语从句不同，名词性从句不修饰名词，它本身就是句中那个位置上的名词。",
        ),
        choiceGenerator(
          t("What job does the noun clause in bold do in this sentence?", "加粗的名词性从句在句中起什么作用？"),
          nounClauseBank,
          (right) => t(`It is **${right}**. ${jobWhy[right]?.[0] ?? ""}`, `它是**${jobZh[right] ?? right}**。${jobWhy[right]?.[1] ?? ""}`),
          (wrong) =>
            t(
              `Look at what stands just before the clause: a verb of action, a preposition, a linking verb, or nothing at all. That shows it is not ${wrong}.`,
              `看看从句前面紧挨着的是什么：行为动词、介词、系动词，还是什么都没有。由此可知它不是${jobZh[wrong] ?? wrong}。`,
            ),
        ),
      ),
      clauseKindStep,
    ],
  },
  {
    id: "integrating-quotations",
    title: t("Integrating Quotations", "融入引文"),
    summary: t(
      "Working a quotation into your own sentence: a comma after a signal phrase, nothing after that, a colon after a complete clause, and brackets or ellipses for changes.",
      "把引文融入自己的句子：引导语后用逗号，that 后不加标点，完整分句后用冒号，改动处用方括号或省略号。",
    ),
    prerequisites: ["citing-textual-evidence", "punctuating-dialogue"],
    encompasses: [
      { topic: "citing-textual-evidence", weight: 0.3 },
      { topic: "punctuating-dialogue", weight: 0.2 },
    ],
    xp: 16,
    strand: "writing",
    knowledgePoints: [
      point(
        "working-a-quotation-in",
        t("Working a Quotation In", "把引文融入句子"),
        t(
          'A quotation should never stand alone in an essay; build a sentence of your own around it. How you punctuate depends on what leads into it.\n\n- After a **signal phrase** such as *As the narrator says* or *the captain warns*, put a **comma**: *As the narrator says, "I have never trusted the sea."*\n- When the quotation continues your sentence after ***that***, use **no punctuation** before it: *She admits that "[she] would rather lose the farm than lose this family."*\n- After a **complete clause**, use a **colon**: *The captain states his view plainly: "I learned to sail before learning to read."* A colon after an incomplete clause, as in *The captain states: his view*, is wrong.\n\nThe words inside the marks must be exactly the source\'s. If you must change a word to fit your sentence, such as *I* to *she*, put your word in **square brackets**: *[she]*. If you leave words out, mark the gap with an **ellipsis** (…). In American usage, a period or comma at the end goes inside the closing quotation mark.',
          '文章中的引文不能单独成句，要用自己的话把它嵌入句子。标点怎么用，取决于引导它的成分。\n\n- 在 *As the narrator says*、*the captain warns* 这类**引导语**后面，用**逗号**：*As the narrator says, "I have never trusted the sea."*\n- 引文在 ***that*** 之后接续你的句子时，前面**不加标点**：*She admits that "[she] would rather lose the farm than lose this family."*\n- 在**完整分句**后面用**冒号**：*The captain states his view plainly: "I learned to sail before learning to read."* 在不完整的分句后用冒号，比如 *The captain states: his view*，是错误的。\n\n引号里的文字必须与原文完全一致。如果为了适应句子必须改动某个词，比如把 *I* 改成 *she*，要把改动的词放在**方括号**里：*[she]*。如果省略了部分文字，用**省略号**（…）标出。按照美式用法，句末的句号或逗号放在后引号里面。',
        ),
        choiceGenerator(
          t("Which sentence works the line into the writer's own sentence correctly?", "哪个句子把这句引文正确地融入了作者自己的句子？"),
          quotationBank,
          (right) =>
            t(
              `${right} Its lead-in and its punctuation fit together, and any word changed from the source is in brackets.`,
              `${right} 它的引导语和标点相互匹配，凡是改动原文的词都放在了方括号里。`,
            ),
          (wrong) =>
            t(
              /that,/.test(wrong)
                ? "No comma follows *that*: the quotation simply continues the sentence."
                : /states:/.test(wrong) || /says:/.test(wrong)
                  ? "A colon must follow a complete clause. Here the words before it cannot stand as a sentence."
                  : /says "/.test(wrong)
                    ? "A signal phrase such as *says* needs a comma before the quotation."
                    : /that "(she|he) /.test(wrong)
                      ? "The word changed from the source's *I* must be marked with square brackets."
                      : "A complete clause before a quotation needs a colon to introduce it.",
              /that,/.test(wrong)
                ? "*that* 后面不加逗号：引文直接接续句子。"
                : /states:/.test(wrong) || /says:/.test(wrong)
                  ? "冒号必须跟在完整分句后面，而这里冒号前的文字不能独立成句。"
                  : /says "/.test(wrong)
                    ? "*says* 这类引导语后面需要用逗号引出引文。"
                    : /that "(she|he) /.test(wrong)
                      ? "把原文的 *I* 改成别的词时，必须用方括号标出。"
                      : "引文前面是完整分句时，需要用冒号引出。",
            ),
        ),
      ),
      leadInFixStep,
    ],
  },
  {
    id: "word-order-for-emphasis",
    title: t("Word Order for Emphasis", "用语序强调"),
    summary: t(
      "Inversion, fronting and cleft sentences: moving a word to a place of stress, at the start or the end of a sentence.",
      "倒装、前置和分裂句：把词语移到句首或句末这类重读位置。",
    ),
    prerequisites: ["simple-compound-and-complex-sentences"],
    encompasses: [{ topic: "simple-compound-and-complex-sentences", weight: 0.1 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "moving-the-stress",
        t("Moving the Stress", "移动重音"),
        t(
          "English sentences usually run subject, verb, object, and the strongest place of stress is the **end**. Writers break this order to put weight where they want it.\n\n- **Inversion** puts a verb or helping verb before the subject, after a negative or limiting word (*Never had the village seen such a flood*; *Only then did we understand*) or after a phrase of place (*Under the old oak stood a single gravestone*).\n- **Fronting** moves an object or a describing word to the start, while the subject and verb keep their order: *That kind of help we can do without*; *Tired they were, but they kept walking.*\n- A **cleft sentence** splits one sentence into two parts to spotlight one of them: *It was the silence that frightened him*; *What the town needs is a hospital.*\n\nUse them sparingly: one inverted sentence in a page is striking; five sound like an old play.",
          "英语句子通常按主语、谓语、宾语的顺序排列，最重要的重读位置在**句末**。作者会打破这种语序，把分量放在想强调的地方。\n\n- **倒装**（inversion）把动词或助动词放在主语前面，通常出现在否定或限制性词语之后（*Never had the village seen such a flood*；*Only then did we understand*），或表示地点的短语之后（*Under the old oak stood a single gravestone*）。\n- **前置**（fronting）把宾语或描述性词语移到句首，而主语和谓语保持原有顺序：*That kind of help we can do without*；*Tired they were, but they kept walking.*\n- **分裂句**（cleft sentence）把一个句子拆成两部分，以突出其中之一：*It was the silence that frightened him*；*What the town needs is a hospital.*\n\n要谨慎使用：一页中有一个倒装句令人印象深刻，有五个就像旧时的戏剧了。",
        ),
        choiceGenerator(
          t("How does this sentence move a word into a place of stress?", "这个句子用什么方式把词语移到了重读位置？"),
          emphasisBank,
          (right) =>
            t(
              `It uses **${right}**. ${emphasisWhy[right]?.[0] ?? ""}`,
              `它用了**${emphasisZh[right] ?? right}**。${emphasisWhy[right]?.[1] ?? ""}`,
            ),
          (wrong) =>
            t(
              wrong === "inversion"
                ? "In an inversion the verb comes before the subject. Find the subject: here it still comes before its verb."
                : wrong === "fronting"
                  ? "Fronting moves an object or describing word to the start with no other change. This sentence is built differently."
                  : "A cleft sentence uses *It was ... that/who* or *What ... is/was*. This sentence has neither.",
              wrong === "inversion"
                ? "倒装句中谓语在主语前面。找出主语：这里它仍然在谓语前面。"
                : wrong === "fronting"
                  ? "前置只是把宾语或描述性词语移到句首，别的不变。这个句子的结构不同。"
                  : "分裂句使用 *It was ... that/who* 或 *What ... is/was*。这个句子两者都没有。",
            ),
        ),
      ),
      stressStep,
    ],
  },
  {
    id: "sentence-variety-for-effect",
    title: t("Sentence Variety for Effect", "变换句式以求效果"),
    summary: t(
      "A short sentence after long ones for emphasis, and a long one after short ones for release: rhythm that serves the meaning.",
      "长句之后用短句来强调，短句之后用长句来舒展：让节奏为意义服务。",
    ),
    prerequisites: ["periodic-and-cumulative-sentences", "varying-sentence-openings"],
    encompasses: [
      { topic: "periodic-and-cumulative-sentences", weight: 0.3 },
      { topic: "varying-sentence-openings", weight: 0.3 },
    ],
    xp: 18,
    strand: "writing",
    knowledgePoints: [
      point(
        "rhythm-and-emphasis",
        t("Rhythm and Emphasis", "节奏与强调"),
        t(
          "Readers feel the length of sentences. After two or three long sentences that pile up details, a **short sentence** stops the reader and lands like a blow: *It was gone.* The contrast is what gives it force, so it works only after something longer.\n\nThe reverse works too. After a run of short, tense sentences (*Wind. Ice. Dark.*), a **long, flowing sentence** releases the tension, the way a held breath is let out.\n\nWhen you revise, read a paragraph aloud and listen for its most important moment. Put that moment in a sentence whose length contrasts with those around it, and cut any padding (*in fact*, *as it turned out*, *which was surprising*) that buries the key words in the middle.",
          "读者能感觉到句子的长短。在两三个堆叠细节的长句之后，一个**短句**会让读者停下来，像重重一击：*It was gone.* 它的力量来自对比，所以只有在较长的句子之后才有效。\n\n反过来也一样。在一连串简短、紧张的句子（*Wind. Ice. Dark.*）之后，一个**舒展的长句**会释放紧张感，就像屏住的呼吸终于吐了出来。\n\n修改时，把段落读出声来，听出其中最重要的时刻。把这个时刻放在一个与前后句子长短形成对比的句子里，并删去 *in fact*、*as it turned out*、*which was surprising* 这类把关键词埋在中间的赘语。",
        ),
        choiceGenerator(
          t(
            "Which sentence gives this paragraph the strongest ending, by contrast with the sentences before it?",
            "哪个句子与前面的句子形成对比，给这个段落最有力的结尾？",
          ),
          varietyBank,
          (right) =>
            t(
              `**${right}** Its length contrasts with the sentences before it, and its key words carry the stress with nothing padding them.`,
              `**${right}** 它的长短与前面的句子形成对比，关键词承载着重音，没有多余的词语稀释它。`,
            ),
          (wrong) =>
            t(
              `“${wrong}” repeats the rhythm the paragraph already has, or buries its key words under padding, so the moment loses its force.`,
              `“${wrong}” 重复了段落已有的节奏，或者把关键词埋在赘语中，使这一时刻失去了力量。`,
            ),
        ),
      ),
      rhythmStep,
    ],
  },
];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
