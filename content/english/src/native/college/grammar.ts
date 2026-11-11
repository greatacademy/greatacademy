// College writing: style and mechanics for academic and professional prose: hedging, verbs for citing sources,
// quoting and paraphrasing, citing in MLA and APA, cohesion, clear sentences, numbers, tone at work, and parallel
// lists and headings.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import {
  citingBank,
  clarityBank,
  cohesionBank,
  hedgingBank,
  inTextBank,
  type ListForm,
  listBank,
  type NumberRule,
  numberBank,
  paraphraseVerdict,
  plagiarismVerdict,
  quoteVerdict,
  quotingBank,
  referenceBank,
  toneBank,
} from "./grammar-banks.ts";
import {
  actorStep,
  claimFixStep,
  cohesionBreakStep,
  listBreakStep,
  numberRuleStep,
  paraphraseStep,
  stanceStep,
  toneProblemStep,
} from "./grammar-steps.ts";

const verbMeaning: Readonly<Record<string, readonly [string, string]>> = {
  argues: ["makes a claim and supports it with reasons", "提出主张并用理由支持"],
  concedes: ["admits a point against the author's own view", "承认一个不利于作者自己观点的论点"],
  refutes: ["proves a claim wrong with evidence", "用证据证明某一说法是错的"],
  observes: ["states a fact neutrally, without arguing", "中立地陈述事实，不加论证"],
  suggests: ["proposes something tentatively", "试探性地提出某种看法"],
  doubts: ["is not convinced that something is true", "不相信某事属实"],
  warns: ["points out a danger or risk", "指出危险或风险"],
  denies: ["says that something is not true, without necessarily proving it", "声称某事不属实，但不一定加以证明"],
};

const verdictZh: Readonly<Record<string, string>> = {
  [quoteVerdict]: "可以接受的引用",
  [paraphraseVerdict]: "可以接受的转述",
  [plagiarismVerdict]: "抄袭",
};

const verdictWhy: Readonly<Record<string, readonly [string, string]>> = {
  [quoteVerdict]: [
    "The source's exact words are inside quotation marks, and the author, year and page are given.",
    "原文的确切词句放在引号里，并注明了作者、年份和页码。",
  ],
  [paraphraseVerdict]: [
    "The idea is restated in new words and a new structure, and the source is credited.",
    "观点用新的词语和结构重新表述，并注明了出处。",
  ],
  [plagiarismVerdict]: [
    "Something is taken without full credit: the idea without a citation, or the source's words or structure without quotation marks, even when a citation follows.",
    "有东西被拿来而没有完全注明：要么用了观点却没有注明出处，要么用了原文的词句或结构却没有加引号，即使后面附了出处也不行。",
  ],
};

const numberWhy: Readonly<Record<NumberRule, readonly [string, string]>> = {
  small: ["Numbers below 10 that count things are written as words.", "计数的十以下的数用英文单词书写。"],
  large: ["Numbers of 10 and above are written as numerals.", "十及以上的数用阿拉伯数字书写。"],
  start: [
    "A sentence never begins with a numeral: write the number as words, or rewrite the sentence.",
    "句子不能以阿拉伯数字开头：要把数写成单词，或者改写句子。",
  ],
  percent: ["Percentages are written as numerals followed by the % sign.", "百分数用阿拉伯数字加 % 号书写。"],
  unit: [
    "A number with a unit of measurement is a numeral, with a space before the unit's abbreviation.",
    "带计量单位的数用阿拉伯数字书写，数字与单位缩写之间空一格。",
  ],
  range: [
    "A range takes from ... to ... or between ... and ...; a dash replaces both words, never just one of them.",
    "表示范围用 from ... to ... 或 between ... and ...；连接号只能同时代替两个词，不能只代替其中一个。",
  ],
};

const listZh: Readonly<Record<ListForm, string>> = {
  "the -ing form": "-ing 形式",
  "the command form": "祈使形式",
  "the to-form": "to 不定式形式",
};

/** gradedBank strips the tags of a bank whose items carry a rule or a form for their explanations. */
const gradedBank = <K>(bank: readonly (readonly [ChoiceItem, K])[]): readonly ChoiceItem[] => bank.map(([item]) => item);

const tagOf = <K>(bank: readonly (readonly [ChoiceItem, K])[], shown: string, right: string): K | undefined =>
  bank.find(([[s, r]]) => s === shown && r === right)?.[1];

/** grammarTopicsCollege are the topics of style and mechanics of the college writing course. */
export const grammarTopicsCollege: readonly TopicDef[] = [
  {
    id: "hedging-and-qualification",
    title: t("Hedging and Qualification", "模糊限制与限定"),
    summary: t(
      "Words such as may, suggests and in most cases, and claims exactly as strong as their evidence.",
      "may、suggests、in most cases 这类词，以及与证据强度恰好相符的主张。",
    ),
    prerequisites: ["modal-verbs", "noun-clauses"],
    encompasses: [{ topic: "modal-verbs", weight: 0.2 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "claims-as-strong-as-the-evidence",
        t("Claims as Strong as the Evidence", "主张与证据同样有力"),
        t(
          "An academic writer makes each claim exactly as strong as the evidence behind it. **Hedges** weaken a claim to fit weaker evidence: modal verbs (*may*, *might*, *could*), verbs such as *suggests*, *appears* and *is linked to*, and limits on scope (*in this sample*, *in most cases*, *at least some*).\n\nAsk three questions of the evidence. **How much is there?** One small survey supports *may*; forty trials support a plain statement. **What kind is it?** A survey or one observation shows a link; only a controlled experiment shows a cause. **Whom does it cover?** A study of mice or of one school says nothing certain about all people.\n\nTwo mistakes are common. An **overclaim** says more than the evidence: *proves*, *always*, *all*, *cures*, or a conclusion about people the study never included. An **over-hedge** piles up doubts on strong evidence (*might possibly perhaps*), which makes a sound finding sound weak.",
          "学术写作者让每个主张的强度与支撑它的证据完全相符。**模糊限制语**（hedges）减弱主张的强度，使之与较弱的证据相符：情态动词（*may、might、could*），*suggests、appears、is linked to* 这类动词，以及对范围的限制（*in this sample、in most cases、at least some*）。\n\n对证据问三个问题。**证据有多少？** 一次小规模调查只能支持 *may*；四十项试验可以支持直接陈述。**证据是哪一类？** 调查或一次观察只能说明存在关联；只有对照实验才能说明因果。**证据覆盖了谁？** 对老鼠或一所学校的研究，不能确定地说明所有人的情况。\n\n常见的错误有两种。**过度断言**说得比证据多：*proves、always、all、cures*，或对研究根本没有涉及的人群下结论。**过度限制**则在有力的证据上堆砌怀疑（*might possibly perhaps*），让可靠的发现听起来很薄弱。",
        ),
        choiceGenerator(
          t("Which claim is exactly as strong as this evidence?", "哪个主张的强度与这一证据恰好相符？"),
          hedgingBank,
          (right) =>
            t(
              `**${right}** The claim matches how much evidence there is, what kind it is and whom it covers.`,
              `**${right}** 这个主张与证据的数量、种类和覆盖范围都相符。`,
            ),
          (wrong) =>
            t(
              /might|perhaps|possibly|conceivabl|uncertain|hard to say|no one can say/u.test(wrong)
                ? `“${wrong}” hedges too much: the evidence is large and consistent, so the claim can be stated plainly.`
                : `“${wrong}” claims more than the evidence shows, in certainty, in cause, or in the people or places it covers.`,
              /might|perhaps|possibly|conceivabl|uncertain|hard to say|no one can say/u.test(wrong)
                ? `“${wrong}” 限制过度：证据数量大且一致，可以直接陈述。`
                : `“${wrong}” 说得比证据多：要么过于确定，要么把关联说成因果，要么扩大了所涉及的人群或地区。`,
            ),
        ),
      ),
      claimFixStep,
    ],
  },
  {
    id: "verbs-for-citing-sources",
    title: t("Verbs for Citing Sources", "引述资料的动词"),
    summary: t(
      "Argues, concedes, refutes, observes, suggests, doubts, warns and denies, and what each says about the source.",
      "argues、concedes、refutes、observes、suggests、doubts、warns 和 denies，以及每个词对资料的定性。",
    ),
    prerequisites: ["integrating-quotations"],
    encompasses: [{ topic: "integrating-quotations", weight: 0.2 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-a-reporting-verb",
        t("Choosing a Reporting Verb", "选择转述动词"),
        t(
          "When you report a source, the verb you choose tells the reader what the source is doing, so choose it as carefully as the words you quote.\n\n- **argues**: makes a claim and supports it with reasons.\n- **concedes**: admits a point against the author's own view.\n- **refutes**: proves a claim wrong with evidence. (Use *denies* when someone only says a claim is false.)\n- **observes**: states a fact neutrally, without arguing.\n- **suggests**: proposes something tentatively.\n- **doubts**: is not convinced that something is true.\n- **warns**: points out a danger or risk.\n- **denies**: says that something is not true.\n\nUse the present tense for what a text says (*Ito argues*), since the text still says it. Avoid *says* and *talks about* when a more exact verb is available.",
          "转述资料时，你选择的动词告诉读者这份资料在做什么，所以要像选择引文一样仔细选择动词。\n\n- **argues**：提出主张并用理由支持。\n- **concedes**：承认一个不利于作者自己观点的论点。\n- **refutes**：用证据证明某一说法是错的。（如果只是声称某说法不对，用 *denies*。）\n- **observes**：中立地陈述事实，不加论证。\n- **suggests**：试探性地提出某种看法。\n- **doubts**：不相信某事属实。\n- **warns**：指出危险或风险。\n- **denies**：声称某事不属实。\n\n转述文本内容时用一般现在时（*Ito argues*），因为文本至今仍这样说。有更确切的动词时，不要用 *says* 和 *talks about*。",
        ),
        choiceGenerator(
          t("Which verb reports what the source does?", "哪个动词能准确转述资料所做的事？"),
          citingBank,
          (right, shown) => {
            const [en, zh] = verbMeaning[right] ?? ["", ""];
            const sentence = shown.slice(shown.lastIndexOf(". ", shown.indexOf("___")) + 2).replace("___", `**${right}**`);
            return t(`${sentence} *${capital(right)}* means the source ${en}.`, `${sentence} *${right}* 表示资料${zh}。`);
          },
          (wrong) => {
            const [en, zh] = verbMeaning[wrong] ?? ["", ""];
            return t(
              `*${capital(wrong)}* would mean the source ${en}, which is not what the description says it does.`,
              `*${wrong}* 表示资料${zh}，而描述中说的并不是这样。`,
            );
          },
        ),
      ),
      stanceStep,
    ],
  },
  {
    id: "quoting-and-paraphrasing",
    title: t("Quoting and Paraphrasing", "引用与转述"),
    summary: t("When to quote and when to paraphrase, and what counts as plagiarism.", "什么时候引用、什么时候转述，以及什么算抄袭。"),
    prerequisites: ["integrating-quotations"],
    encompasses: [{ topic: "integrating-quotations", weight: 0.3 }],
    xp: 16,
    strand: "writing",
    knowledgePoints: [
      point(
        "quotation-paraphrase-or-plagiarism",
        t("Quotation, Paraphrase or Plagiarism", "引用、转述还是抄袭"),
        t(
          "There are two honest ways to use a source, and each has its rule.\n\n- A **quotation** uses the source's exact words, inside quotation marks, with the author, year and page. Quote when the wording itself matters: a striking phrase, a definition, words you will analyze.\n- A **paraphrase** restates the idea in your own words **and** your own sentence structure, with the author and year. Paraphrase when the idea matters more than the wording, which is most of the time.\n\nEverything else is **plagiarism**, whether you mean it or not:\n\n- the source's words without quotation marks, even with a citation after them;\n- **patchwriting**: the source's sentence with a few words swapped for synonyms, even with a citation;\n- a true paraphrase with no citation, since the idea is still someone else's.\n\nTo paraphrase well, read the passage, look away, write the idea from memory, then check it against the source for meaning and for borrowed phrases.",
          "诚实地使用资料有两种方式，各有规则。\n\n- **引用**（quotation）使用原文的确切词句，放在引号里，并注明作者、年份和页码。当措辞本身重要时才引用：引人注目的说法、定义、你要分析的词句。\n- **转述**（paraphrase）用你自己的词语**和**你自己的句子结构重述观点，并注明作者和年份。当观点比措辞更重要时转述，大多数情况都是这样。\n\n除此之外都是**抄袭**，无论是否有意：\n\n- 使用原文词句却不加引号，即使后面附了出处；\n- **拼凑式改写**（patchwriting）：保留原句，只把几个词换成同义词，即使附了出处；\n- 真正的转述却没有注明出处，因为观点仍然是别人的。\n\n要转述得好，先读原文，然后移开视线，凭记忆写出观点，再对照原文检查意思是否准确、有没有借用原文的说法。",
        ),
        choiceGenerator(
          t(
            "Is the student's use of the source an acceptable quotation, an acceptable paraphrase, or plagiarism?",
            "这位学生对资料的使用是可以接受的引用、可以接受的转述，还是抄袭？",
          ),
          quotingBank,
          (right) =>
            t(
              `It is **${right}**. ${verdictWhy[right]?.[0] ?? ""}`,
              `这是**${verdictZh[right] ?? right}**。${verdictWhy[right]?.[1] ?? ""}`,
            ),
          (wrong) =>
            t(
              wrong === plagiarismVerdict
                ? "Nothing is taken without credit here: compare the student's words with the source and look for the citation."
                : wrong === quoteVerdict
                  ? "A quotation must put the source's exact words inside quotation marks. Check whether this use does."
                  : "A paraphrase must change both the words and the structure, and still credit the source. Check both.",
              wrong === plagiarismVerdict
                ? "这里没有不注明出处地拿走任何东西：把学生的文字与原文对照，并找一找出处。"
                : wrong === quoteVerdict
                  ? "引用必须把原文的确切词句放在引号里。看看这里是否这样做了。"
                  : "转述必须同时改变词语和结构，并且仍要注明出处。两点都要检查。",
            ),
        ),
      ),
      paraphraseStep,
    ],
  },
  {
    id: "citing-in-mla-and-apa",
    title: t("Citing in MLA and APA", "MLA 与 APA 引用格式"),
    summary: t(
      "In-text citations and reference entries for books and articles in the two most common styles.",
      "两种最常用格式中的文内引注，以及书籍和期刊文章的参考文献条目。",
    ),
    prerequisites: ["quoting-and-paraphrasing"],
    encompasses: [{ topic: "quoting-and-paraphrasing", weight: 0.2 }],
    xp: 14,
    strand: "writing",
    knowledgePoints: [
      point(
        "in-text-citations",
        t("In-Text Citations", "文内引注"),
        t(
          "An in-text citation points the reader to the full entry in the list of references. The two styles differ in what goes inside the brackets.\n\n**APA** (common in the sciences and social sciences) gives the author's surname, the year and, for a quotation, the page, separated by commas: *(Rivera, 2019, p. 14)*. Two authors are joined by **&**: *(Rivera & Chen, 2019, p. 14)*. Three or more become the first author and **et al.**: *(Okafor et al., 2019, p. 14)*.\n\n**MLA** (common in literature and the humanities) gives only the surname and the page, with **no comma** and no *p.*: *(Rivera 14)*. Two authors are joined by **and**: *(Rivera and Chen 14)*. Three or more become *(Okafor et al. 14)*.\n\nAn easy test: APA cares when a source was written, so the year is always there; MLA cares where the words are, so the page is enough.",
          "文内引注把读者引向参考文献列表中的完整条目。两种格式在括号里写什么上有所不同。\n\n**APA**（常用于自然科学和社会科学）写作者的姓、年份，引用原文时再写页码，彼此用逗号隔开：*(Rivera, 2019, p. 14)*。两位作者用 **&** 连接：*(Rivera & Chen, 2019, p. 14)*。三位及以上作者写第一作者加 **et al.**：*(Okafor et al., 2019, p. 14)*。\n\n**MLA**（常用于文学和人文学科）只写姓和页码，**不加逗号**，也不写 *p.*：*(Rivera 14)*。两位作者用 **and** 连接：*(Rivera and Chen 14)*。三位及以上作者写成 *(Okafor et al. 14)*。\n\n一个简单的检验：APA 关心资料是什么时候写的，所以总有年份；MLA 关心词句在哪里，所以有页码就够了。",
        ),
        choiceGenerator(
          t("Which in-text citation is correct in the style named?", "按所指定的格式，哪个文内引注是正确的？"),
          inTextBank,
          (right, shown) =>
            t(
              `**${right}** is correct ${shown.startsWith("APA") ? "APA: surname, year and page, separated by commas" : "MLA: surname and page, with no comma and no year"}.`,
              `**${right}** 是正确的${shown.startsWith("APA") ? " APA 格式：姓、年份和页码，用逗号隔开" : " MLA 格式：姓和页码，不加逗号，也不写年份"}。`,
            ),
          (wrong, _right, shown) =>
            t(
              `${wrong} is not correct ${shown.startsWith("APA") ? "APA" : "MLA"}: check the order of the parts, the commas, and how several authors are joined.`,
              `${wrong} 不是正确的 ${shown.startsWith("APA") ? "APA" : "MLA"} 格式：检查各部分的顺序、逗号，以及多位作者的连接方式。`,
            ),
        ),
      ),
      point(
        "reference-entries",
        t("Reference Entries", "参考文献条目"),
        t(
          'The list at the end of a paper gives each source in full. (Titles of books and journals are set in italics, which these exercises leave out.)\n\n**APA** puts the year in brackets straight after the authors, who are given by surname and initials. Titles of books and articles are in sentence case, with only the first word, the first word after a colon and names capitalized.\n\n- Book: *Rivera, M. (2019). The quiet city: Noise and health in urban life. Harbor Press.*\n- Article: *Chen, L., & Okafor, A. (2021). Sleep and memory in teenagers. Journal of Youth Studies, 14(2), 45–60.*\n\n**MLA** gives the first author\'s full name, surname first, and puts the year near the end. Titles are in title case, and the title of an article goes in quotation marks.\n\n- Book: *Rivera, Maria. The Quiet City: Noise and Health in Urban Life. Harbor Press, 2019.*\n- Article: *Chen, Li, and Ada Okafor. "Sleep and Memory in Teenagers." Journal of Youth Studies, vol. 14, no. 2, 2021, pp. 45–60.*',
          '论文末尾的列表完整列出每份资料。（书名和期刊名用斜体，这些练习中省略了斜体。）\n\n**APA** 把年份放在括号里，紧跟在作者之后，作者写姓和名字首字母。书名和文章标题用句子式大写：只有第一个词、冒号后的第一个词和专有名词大写。\n\n- 书籍：*Rivera, M. (2019). The quiet city: Noise and health in urban life. Harbor Press.*\n- 文章：*Chen, L., & Okafor, A. (2021). Sleep and memory in teenagers. Journal of Youth Studies, 14(2), 45–60.*\n\n**MLA** 写第一作者的全名，姓在前，年份放在靠近末尾的位置。标题用标题式大写，文章标题放在引号里。\n\n- 书籍：*Rivera, Maria. The Quiet City: Noise and Health in Urban Life. Harbor Press, 2019.*\n- 文章：*Chen, Li, and Ada Okafor. "Sleep and Memory in Teenagers." Journal of Youth Studies, vol. 14, no. 2, 2021, pp. 45–60.*',
        ),
        choiceGenerator(
          t("Which reference entry is correct in the style named?", "按所指定的格式，哪个参考文献条目是正确的？"),
          referenceBank,
          (right, shown) =>
            t(
              `${right}\n\n${shown.includes(" APA ") ? "In APA the year follows the authors, who are given by surname and initials, and titles are in sentence case." : "In MLA the first author's full name comes first, titles are in title case, and the year comes near the end."}`,
              `${right}\n\n${shown.includes(" APA ") ? "APA 格式中年份紧跟作者，作者写姓和名字首字母，标题用句子式大写。" : "MLA 格式中先写第一作者的全名，标题用标题式大写，年份放在靠近末尾的位置。"}`,
            ),
          (_wrong, _right, shown) =>
            t(
              `That entry breaks the rules of ${shown.includes(" APA ") ? "APA" : "MLA"}: check where the year goes, how the names are written, and how the title is capitalized.`,
              `这个条目不符合 ${shown.includes(" APA ") ? "APA" : "MLA"} 格式：检查年份的位置、名字的写法和标题的大写方式。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "cohesion-old-before-new",
    title: t("Cohesion: Old Before New", "衔接：旧信息在前，新信息在后"),
    summary: t(
      "Beginning sentences with what the reader already knows and ending them with what is new.",
      "句子以读者已知的信息开头，以新信息结尾。",
    ),
    prerequisites: ["choosing-transitions", "word-order-for-emphasis"],
    encompasses: [
      { topic: "word-order-for-emphasis", weight: 0.2 },
      { topic: "choosing-transitions", weight: 0.1 },
    ],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "starting-with-what-the-reader-knows",
        t("Starting With What the Reader Knows", "从读者已知的内容开始"),
        t(
          "Prose feels **cohesive** when each sentence picks up where the last one left off. The rule is simple: **begin a sentence with information the reader already has**, usually something named in the sentence before, and **end it with the new information**, which is where readers expect the stress to fall.\n\n*Last year the city built a new bridge. **The bridge** was designed by a young engineer from the university.* The second sentence starts with the bridge, which we know, and ends with the engineer, who is new.\n\nCompare: *A young engineer from the university designed the bridge.* It is a good sentence on its own, but after the first one it makes the reader jump to something unknown and only then link it back.\n\nTo put old information first you may need the **passive** (*was designed by*), a word such as *this* or *these* that points back (*This error was copied...*), or a different subject. Cohesion is one of the few good reasons to choose the passive.",
          "当每个句子都从上一句结束的地方接下去时，文章读起来就是**衔接**的。规则很简单：**句子以读者已经掌握的信息开头**，通常是上一句提到的东西，**以新信息结尾**，因为读者期待重音落在句末。\n\n*Last year the city built a new bridge. **The bridge** was designed by a young engineer from the university.* 第二句以我们已知的桥开头，以新出现的工程师结尾。\n\n比较：*A young engineer from the university designed the bridge.* 单独看是个好句子，但放在第一句之后，读者得先跳到一个陌生的东西上，然后才能把它和前文联系起来。\n\n要让旧信息在前，你可能需要用**被动语态**（*was designed by*），用 *this、these* 这类回指的词（*This error was copied...*），或者换一个主语。衔接是选择被动语态为数不多的好理由之一。",
        ),
        choiceGenerator(
          t(
            "Which sentence follows this one best, beginning with what the reader already knows?",
            "哪个句子最适合接在这句话后面，并以读者已知的内容开头？",
          ),
          cohesionBank,
          (right, shown) =>
            t(
              `${shown} **${right}** The second sentence begins with something the first one named and ends with what is new.`,
              `${shown} **${right}** 第二句以第一句提到的内容开头，以新信息结尾。`,
            ),
          (wrong) =>
            t(
              `“${wrong}” is grammatical, but it opens with information the reader has not met and pushes what they know toward the end, so the link between the sentences is harder to follow.`,
              `“${wrong}” 语法正确，但它以读者没见过的信息开头，把读者已知的内容推到后面，两句之间的联系就更难把握。`,
            ),
        ),
      ),
      cohesionBreakStep,
    ],
  },
  {
    id: "clear-sentences-characters-and-actions",
    title: t("Clear Sentences: Characters and Actions", "清晰的句子：人物与动作"),
    summary: t(
      "Main characters as subjects, actions as verbs, and undoing nominalizations.",
      "让主要人物做主语、让动作做动词，并还原名词化结构。",
    ),
    prerequisites: ["cutting-wordiness"],
    encompasses: [
      { topic: "cutting-wordiness", weight: 0.3 },
      { topic: "active-and-passive-voice", weight: 0.2 },
    ],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "characters-as-subjects-actions-as-verbs",
        t("Characters as Subjects, Actions as Verbs", "人物做主语，动作做动词"),
        t(
          "Readers find a sentence clear when its **subject** names the main **character**, the person or thing doing something, and its **verb** names the main **action**.\n\nMuch academic and official prose hides actions inside abstract nouns, called **nominalizations**: *decide* becomes *decision*, *fail* becomes *failure*, *analyze* becomes *analysis*. Then the real actors drift into phrases with *of* and *by*, and weak verbs such as *was made*, *occurred* or *took place* carry the sentence.\n\n*The committee's decision was the postponement of the vote.* The character is the committee; the actions are deciding and postponing. Revised: *The committee decided to postpone the vote.*\n\nTo revise, find the characters and the actions, make the characters subjects and the actions verbs, and join clauses with words such as *because*, *when* and *so*. Keep every idea of the original: a revision that is clear but changes the meaning has failed.",
          "当句子的**主语**是主要**人物**（做某事的人或物），**动词**是主要**动作**时，读者就觉得句子清楚。\n\n很多学术和公文文章把动作藏在抽象名词里，这叫**名词化**（nominalization）：*decide* 变成 *decision*，*fail* 变成 *failure*，*analyze* 变成 *analysis*。于是真正的行为者被挤到 *of*、*by* 引导的短语里，由 *was made、occurred、took place* 这类弱动词撑起句子。\n\n*The committee's decision was the postponement of the vote.* 人物是委员会，动作是决定和推迟。改写为：*The committee decided to postpone the vote.*\n\n改写时，找出人物和动作，让人物做主语、动作做动词，再用 *because、when、so* 这类词连接分句。要保留原句的每个意思：清楚了但改变了意思的改写是失败的。",
        ),
        choiceGenerator(
          t("Which revision of this sentence is clearest, while keeping its meaning?", "在保持原意的前提下，这个句子的哪一种改写最清楚？"),
          clarityBank,
          (right) =>
            t(
              `**${right}** The characters are the subjects and the actions are verbs, and nothing of the original is lost.`,
              `**${right}** 人物做主语，动作做动词，原句的意思一点也没有丢失。`,
            ),
          (wrong, _right, shown) => {
            const dense =
              /tion|ment|ance|ence|ure\b|undergo|constitut|involved|achieved|occurred/u.test(wrong) && wrong.length > shown.length * 0.6;
            return t(
              dense
                ? `“${wrong}” still hides the actions in abstract nouns, so it is no clearer than the original.`
                : `“${wrong}” is short, but it changes what the original says.`,
              dense ? `“${wrong}” 仍然把动作藏在抽象名词里，并不比原句清楚。` : `“${wrong}” 虽然简短，但改变了原句的意思。`,
            );
          },
        ),
      ),
      actorStep,
    ],
  },
  {
    id: "numbers-in-writing",
    title: t("Numbers in Writing", "数字的书写"),
    summary: t(
      "Numerals or words, percentages, units and ranges, by the rules of APA style.",
      "按 APA 格式的规则：用阿拉伯数字还是单词，以及百分数、单位和范围的写法。",
    ),
    prerequisites: ["capitalizing-names-and-titles"],
    encompasses: [],
    xp: 16,
    strand: "writing",
    knowledgePoints: [
      point(
        "writing-numbers",
        t("Writing Numbers", "书写数字"),
        t(
          "Style guides differ on numbers; academic papers in the sciences usually follow **APA**, and so does this course.\n\n- Numbers **below 10** that count things are words: *seven families*. Numbers of **10 and above** are numerals: *24 teachers*.\n- **Never begin a sentence with a numeral.** Write the number as words (*Forty-eight students took part*) or rewrite the sentence (*In all, 48 students took part*).\n- **Percentages** are numerals with the % sign, whatever their size: *6%*, *24%*.\n- A number with a **unit of measurement** is a numeral, with a space before the abbreviation: *5 kg*, *8 km*.\n- A **range** uses *from ... to ...* or *between ... and ...*: *from 12 to 18*. A dash may replace both words (*12–18*) but never just one: not *from 12–18* or *between 12–18*.",
          "各种写作规范对数字的规定不同；理科的学术论文通常遵循 **APA**，本课程也是如此。\n\n- 计数的**十以下**的数写成单词：*seven families*。**十及以上**的数写成阿拉伯数字：*24 teachers*。\n- **句子绝不以阿拉伯数字开头。**把数写成单词（*Forty-eight students took part*），或者改写句子（*In all, 48 students took part*）。\n- **百分数**不论大小都用阿拉伯数字加 % 号：*6%*、*24%*。\n- 带**计量单位**的数用阿拉伯数字，单位缩写前空一格：*5 kg*、*8 km*。\n- **范围**用 *from ... to ...* 或 *between ... and ...*：*from 12 to 18*。连接号可以同时代替两个词（*12–18*），但不能只代替其中一个：不能写 *from 12–18* 或 *between 12–18*。",
        ),
        choiceGenerator(
          t("Which way of writing the number belongs in the gap?", "空格处的数应该怎样书写？"),
          gradedBank(numberBank),
          (right, shown) => {
            const rule = tagOf(numberBank, shown, right) ?? "large";
            const [en, zh] = numberWhy[rule];
            return t(`${shown.replace("___", `**${right}**`)} ${en}`, `${shown.replace("___", `**${right}**`)} ${zh}`);
          },
          (wrong, right, shown) => {
            const rule = tagOf(numberBank, shown, right) ?? "large";
            const [en, zh] = numberWhy[rule];
            return t(`“${wrong}” breaks the rule here. ${en}`, `“${wrong}” 不符合这里的规则。${zh}`);
          },
        ),
      ),
      numberRuleStep,
    ],
  },
  {
    id: "tone-and-register-at-work",
    title: t("Tone and Register at Work", "职场中的语气与语体"),
    summary: t(
      "Polite requests, direct but courteous refusals, and the level of formality a reader expects.",
      "礼貌的请求、直接而客气的拒绝，以及读者所期待的正式程度。",
    ),
    prerequisites: ["connotation-and-precise-words", "verb-moods"],
    encompasses: [
      { topic: "connotation-and-precise-words", weight: 0.2 },
      { topic: "verb-moods", weight: 0.1 },
    ],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "suiting-the-reader",
        t("Suiting the Reader", "适合读者"),
        t(
          "At work, how you say something matters as much as what you say. The right **register** is the level of formality your reader expects; the right **tone** is courteous and direct at once.\n\n- **Requests** are softened with questions and modals: *Would it be possible...? Could you...?* Give the reason and make it easy to say yes.\n- **Refusals** are clear but kind: thank the person, say no plainly, give a short reason, and offer something else if you can.\n- **Bad news and mistakes** are stated directly, with what you are doing about them.\n\nTwo registers fail. **Too casual** writing (*hey*, *lol*, *u*, no capitals) suits a friend, not a manager or a client. **Too blunt** writing gives orders or blames (*Send it now. You failed to...*), and **too stiff** writing hides the point in pompous phrases (*It is hereby communicated that...*). Aim for the sentence a respected colleague would write.",
          "在工作中，怎么说和说什么同样重要。合适的**语体**（register）是读者所期待的正式程度；合适的**语气**（tone）既礼貌又直接。\n\n- **请求**用疑问句和情态动词来缓和：*Would it be possible...? Could you...?* 说明理由，让对方容易答应。\n- **拒绝**要清楚又友善：感谢对方，明确说不，简短说明理由，可能的话提供别的帮助。\n- **坏消息和错误**要直接说出来，并说明你正在采取的措施。\n\n有两种语体是失败的。**过于随便**（*hey、lol、u*，不用大写）适合对朋友，不适合对经理或客户。**过于生硬**的写法要么发号施令或指责（*Send it now. You failed to...*），要么用浮夸的说法掩盖要点（*It is hereby communicated that...*）。要写出一位受人尊敬的同事会写的句子。",
        ),
        choiceGenerator(
          t("Which sentence best suits the reader and the situation?", "哪句话最适合这位读者和这个情境？"),
          toneBank,
          (right) =>
            t(
              `**${right}** It is courteous and clear, and as formal as the reader expects.`,
              `**${right}** 这句话礼貌、清楚，正式程度也符合读者的期待。`,
            ),
          (wrong) =>
            t(
              /^[a-z]|!!|\?\?|lol|thx|\bu\b/u.test(wrong)
                ? `“${wrong}” is too casual for this reader: it reads like a message to a friend.`
                : `“${wrong}” gets the register wrong: it is either blunt enough to offend or so stiff that it hides the point.`,
              /^[a-z]|!!|\?\?|lol|thx|\bu\b/u.test(wrong)
                ? `“${wrong}” 对这位读者来说太随便了，像是发给朋友的消息。`
                : `“${wrong}” 语体不对：要么生硬得会冒犯人，要么呆板得掩盖了要点。`,
            ),
        ),
      ),
      toneProblemStep,
    ],
  },
  {
    id: "parallel-lists-and-headings",
    title: t("Parallel Lists and Headings", "平行的列表与标题"),
    summary: t(
      "Keeping every item of a list, and every heading of a document, in the same grammatical form.",
      "让列表中的每一项、文件中的每个标题都保持相同的语法形式。",
    ),
    prerequisites: ["parallel-structure"],
    encompasses: [{ topic: "parallel-structure", weight: 0.3 }],
    xp: 16,
    strand: "grammar",
    knowledgePoints: [
      point(
        "keeping-a-list-parallel",
        t("Keeping a List Parallel", "保持列表平行"),
        t(
          "Reports, proposals and instructions break information into **lists** and **headings**, and readers scan them faster when every item has the same grammatical form. Choose a form and keep it:\n\n- the **-ing form**, common for headings: *Choosing a site, Raising the money, Hiring staff*;\n- the **command form**, common for steps: *Choose a site. Raise the money. Hire staff.*;\n- the **to-form**, common for objectives: *To choose a site, To raise the money, To hire staff*.\n\nMixing forms (*Choosing a site, Raise the money, To hire staff*) makes the reader stop and wonder whether the items are different kinds of thing. Check a list by reading each item after the words that introduce it.",
          "报告、提案和说明书把信息分成**列表**和**标题**，当每一项都采用相同的语法形式时，读者浏览得更快。选定一种形式并保持下去：\n\n- **-ing 形式**，常用于标题：*Choosing a site, Raising the money, Hiring staff*；\n- **祈使形式**，常用于步骤：*Choose a site. Raise the money. Hire staff.*；\n- **to 不定式形式**，常用于目标：*To choose a site, To raise the money, To hire staff*。\n\n混用形式（*Choosing a site, Raise the money, To hire staff*）会让读者停下来猜想这些项是不是不同类别的东西。检查列表时，把每一项接在引出它的词语后面读一读。",
        ),
        choiceGenerator(
          t("Which item fills the gap and keeps the list parallel?", "哪一项填入空格能保持列表平行？"),
          gradedBank(listBank),
          (right, shown) => {
            const form = tagOf(listBank, shown, right) ?? "the -ing form";
            return t(
              `**${right}** Every item of the list is in ${form}, so the missing one is too.`,
              `**${right}** 列表中每一项都是${listZh[form]}，所以缺的那一项也应如此。`,
            );
          },
          (wrong, right, shown) => {
            const form = tagOf(listBank, shown, right) ?? "the -ing form";
            return t(
              `“${wrong}” breaks the pattern: the other items are in ${form}.`,
              `“${wrong}” 打破了格式：其他各项都是${listZh[form]}。`,
            );
          },
        ),
      ),
      listBreakStep,
    ],
  },
];

function capital(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
