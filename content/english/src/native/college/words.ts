// College writing: the words of each unit's theme, ten to a batch: academic discourse, research, evidence and
// inference, scholarly argument, words often misused, statistics, the workplace, and planning and proposals.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopic, batchWords } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const discourse: BatchSpec = {
  id: "words-of-academic-discourse",
  title: t("Words of Academic Discourse", "学术话语用词"),
  summary: t(
    "Ten words for reading and writing about scholarly arguments: paradigm, framework, methodology, premise, assumption, critique and more.",
    "十个用于阅读和书写学术论证的词：paradigm、framework、methodology、premise、assumption、critique 等。",
  ),
  domain: ["scholarly arguments and the ideas behind them", "学术论证及其背后的观念"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "paradigm",
      forms: ["paradigms"],
      meaning: ["a model or pattern of thinking that a field of study takes for granted", "范式，某一研究领域视为当然的思维模式"],
      sentences: [
        "For centuries, the ___ of astronomy placed the Earth at the center of the universe.",
        "The evidence for moving continents forced geologists to give up one ___ and adopt another.",
        "Within the old ___, illness was blamed on bad air, so no one thought to look for germs.",
      ],
      confusions: ["framework", "assumption"],
    },
    {
      word: "framework",
      forms: ["frameworks"],
      meaning: ["a structure of ideas used to organize and interpret a subject", "框架，用来组织和解释某一主题的观念结构"],
      sentences: [
        "The study uses a simple ___ of three stages to describe how children learn to read.",
        "Without a clear ___, the report becomes a pile of facts that point nowhere.",
        "She borrowed a ___ from economics to explain why families save money.",
      ],
      confusions: ["methodology", "paradigm"],
    },
    {
      word: "methodology",
      forms: ["methodologies", "methodological"],
      meaning: ["the set of methods a study uses, and the reasons for choosing them", "方法论，研究所用的一套方法及选择它们的理由"],
      sentences: [
        "The ___ section explains how the researchers chose the two hundred schools they surveyed.",
        "Critics accepted the results but questioned the ___, since every subject was a volunteer.",
        "A clearly described ___ allows another team to repeat the study and check the findings.",
      ],
      confusions: ["framework", "critique"],
    },
    {
      word: "discourse",
      forms: ["discourses"],
      meaning: [
        "serious communication on a subject, or the way a group talks and writes about it",
        "话语，就某一主题进行的严肃交流，或某一群体谈论和书写它的方式",
      ],
      sentences: [
        "Over twenty years, public ___ about the climate shifted from whether it was changing to what should be done.",
        "The article studies the ___ of advertising, especially the words used to sell food to children.",
        "Insults have no place in academic ___, however strongly scholars disagree.",
      ],
      confusions: ["critique", "paradigm"],
    },
    {
      word: "implication",
      forms: ["implications", "imply", "implies", "implied", "implying"],
      meaning: ["a likely effect or conclusion that follows from something", "含意，影响，由某事推出的结论或后果"],
      sentences: [
        "The ___ of the findings is that schools may be teaching reading too early.",
        "If the new drug works, the ___ for patients with heart disease could be enormous.",
        "The author never states the ___ outright, but the reader sees that the policy failed.",
      ],
      confusions: ["premise", "assumption"],
    },
    {
      word: "premise",
      forms: ["premises"],
      meaning: ["a statement an argument starts from and treats as true", "前提，论证所依据并视为真实的陈述"],
      sentences: [
        "The argument begins from a ___ stated in its first sentence: that people always act in their own interest.",
        "In logic, a conclusion follows from a major ___ and a minor one.",
        "The author states her ___ openly at the start and then builds the argument on it step by step.",
      ],
      confusions: ["implication", "framework"],
    },
    {
      word: "critique",
      forms: ["critiques"],
      meaning: ["a careful written judgment of the strengths and weaknesses of a work or idea", "评论，对作品或观点优缺点的审慎评判"],
      sentences: [
        "Her ___ of the study praised its large sample but faulted its short time span.",
        "The professor asked each student to write a two-page ___ of the article's argument.",
        "A fair ___ names what a book does well before turning to what it does badly.",
      ],
      confusions: ["discourse", "methodology"],
    },
    {
      word: "assumption",
      forms: ["assumptions"],
      meaning: ["something taken for granted without being stated or proved", "假设，未经说明或证明就被视为当然的事"],
      sentences: [
        "The survey questions rest on an unspoken ___: that every family owns a computer.",
        "Question every ___ an author never says aloud, since that is where weak arguments hide.",
        "The plan made the ___ that prices would stay the same, and they did not.",
      ],
      confusions: ["phenomenon", "implication"],
    },
    {
      word: "phenomenon",
      forms: ["phenomena"],
      meaning: [
        "something that happens or exists and can be observed, especially one that is studied",
        "现象，可观察到的、尤指被研究的事物或情况",
      ],
      sentences: [
        "Scientists still debate the cause of the ___, in which birds of many kinds suddenly leave a region.",
        "Rising rents in the center are a ___ seen in almost every large city.",
        "The northern lights are a natural ___ caused by particles from the sun.",
      ],
      confusions: ["paradigm", "implication"],
    },
    {
      word: "contend",
      forms: ["contends", "contended", "contending"],
      meaning: ["to argue or state that something is true", "主张，声称（某事属实）"],
      sentences: [
        "The authors ___ that homework does little for children under ten.",
        "Some historians ___ that the war could have been avoided.",
        "Against the earlier studies, I ___ that the evidence supports the opposite conclusion.",
      ],
      confusions: ["critique", "assumption"],
    },
  ],
};

const research: BatchSpec = {
  id: "words-of-research",
  title: t("Words of Research", "研究用词"),
  summary: t(
    "Ten words for finding and handling sources: bibliography, abstract, database, scholarly, journal, archive, annotation and more.",
    "十个用于查找和处理资料的词：bibliography、abstract、database、scholarly、journal、archive、annotation 等。",
  ),
  domain: ["research and the sources it relies on", "研究及其所依赖的资料"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "bibliography",
      forms: ["bibliographies"],
      meaning: ["a list of the sources used in, or related to, a piece of writing", "参考书目，文章所用或相关资料的列表"],
      sentences: [
        "Check the ___ at the end of the article for other studies on the same question.",
        "Her ___ listed forty books and articles, each in the same format.",
        "Every source quoted in the paper must also appear in the ___.",
      ],
      confusions: ["abstract", "archive"],
    },
    {
      word: "abstract",
      forms: ["abstracts"],
      meaning: ["a short summary at the start of a research article", "摘要，研究论文开头的简短概述"],
      sentences: [
        "Read the ___ first; in two hundred words it tells you whether the article is worth your time.",
        "The ___ states the question, the method and the main finding in a single paragraph.",
        "Many databases let you search the ___ of each article as well as its title.",
      ],
      confusions: ["annotation", "bibliography"],
    },
    {
      word: "database",
      forms: ["databases"],
      meaning: ["an organized collection of information that can be searched on a computer", "数据库，可在电脑上检索的有组织的信息集合"],
      sentences: [
        "The library's ___ holds millions of articles from thousands of journals.",
        "Type your search terms into the ___ and filter the results by year.",
        "The hospital keeps a ___ of every patient's test results.",
      ],
      confusions: ["archive", "journal"],
    },
    {
      word: "scholarly",
      meaning: [
        "written by experts for other experts, and usually checked by other researchers",
        "学术的，由专家为专家撰写、通常经其他研究者审核的",
      ],
      sentences: [
        "A ___ article lists its sources and explains its methods; a magazine story usually does not.",
        "The professor asked for three ___ sources, not websites or newspaper columns.",
        "Her ___ book on ancient trade took ten years to research.",
      ],
      confusions: ["interdisciplinary", "credentials"],
    },
    {
      word: "journal",
      forms: ["journals"],
      meaning: ["a magazine that publishes research articles in one field", "期刊，发表某一领域研究论文的刊物"],
      sentences: [
        "The study appeared in a medical ___ after three experts reviewed it.",
        "She subscribes to a ___ of marine biology that comes out four times a year.",
        "Each issue of the ___ contains about ten research articles and several book reviews.",
      ],
      confusions: ["database", "archive"],
    },
    {
      word: "archive",
      forms: ["archives"],
      meaning: ["a place where historical records and documents are kept", "档案馆，保存历史记录和文件的地方"],
      sentences: [
        "The letters had sat in a city ___ for a century before a student found them.",
        "Researchers must wear gloves when they handle old papers in the ___.",
        "The newspaper's ___ holds every issue printed since 1890.",
      ],
      confusions: ["database", "bibliography"],
    },
    {
      word: "interdisciplinary",
      meaning: ["involving two or more fields of study", "跨学科的"],
      sentences: [
        "The ___ team included a biologist, an economist and a historian.",
        "Climate research is ___ by nature, drawing on physics, chemistry and economics.",
        "The university offers an ___ course that combines music and mathematics.",
      ],
      confusions: ["scholarly", "credentials"],
    },
    {
      word: "credentials",
      meaning: [
        "the qualifications and experience that show a person is fit to judge or do something",
        "资历，表明某人有资格评判或从事某事的学历和经验",
      ],
      sentences: [
        "Before trusting the expert, check her ___: what she studied and where she has worked.",
        "The website's author had no medical ___, yet he gave advice about medicine.",
        "His ___ as a historian of China made his review of the book worth reading.",
      ],
      confusions: ["annotation", "abstract"],
    },
    {
      word: "retrieval",
      meaning: ["the act of finding and getting back stored information", "检索，查找并取回储存的信息"],
      sentences: [
        "A good search term makes the ___ of relevant articles much faster.",
        "The library's new system has cut the ___ of old records from days to minutes.",
        "Memory researchers study both how we store facts and the ___ of those facts later.",
      ],
      confusions: ["annotation", "database"],
    },
    {
      word: "annotation",
      forms: ["annotations", "annotated", "annotate"],
      meaning: ["a short note added to a text to explain or comment on it", "注释，为解释或评论文本而添加的简短说明"],
      sentences: [
        "Each ___ in her bibliography sums up the source in two sentences and says how she will use it.",
        "One ___ in the margin of the old book corrected a date the author got wrong.",
        "Write a brief ___ beside each paragraph that names its main point.",
      ],
      confusions: ["abstract", "bibliography"],
    },
  ],
};

const evidence: BatchSpec = {
  id: "words-of-evidence-and-inference",
  title: t("Words of Evidence and Inference", "证据与推断用词"),
  summary: t(
    "Ten words for checking claims and using sources: corroborate, substantiate, attribute, paraphrase, verbatim, provenance and more.",
    "十个用于核查说法和使用资料的词：corroborate、substantiate、attribute、paraphrase、verbatim、provenance 等。",
  ),
  domain: ["checking evidence and using sources honestly", "核查证据和诚实地使用资料"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "corroborate",
      forms: ["corroborates", "corroborated", "corroborating"],
      meaning: ["to support a statement or finding with further evidence from another source", "证实，用另一来源的证据支持某一陈述或发现"],
      sentences: [
        "Two other witnesses came forward to ___ her account of the accident.",
        "Historians look for a second document to ___ any claim made in a single diary.",
        "Later studies did not ___ the early result, so doctors stopped recommending the diet.",
      ],
      confusions: ["extrapolate", "attribute"],
    },
    {
      word: "substantiate",
      forms: ["substantiated", "substantiates"],
      meaning: ["to give the evidence that proves a claim", "证明，提供证据证实某一说法"],
      sentences: [
        "The reporter could not ___ the rumor, so the paper did not print it.",
        "If you claim that the policy failed, you must ___ the claim with figures.",
        "The company made bold promises about its product but never tried to ___ them.",
      ],
      confusions: ["paraphrase", "extrapolate"],
    },
    {
      word: "attribute",
      forms: ["attributes", "attributed", "attributing", "attribution"],
      meaning: [
        "to say that something was written, said or caused by a particular person or thing",
        "把……归于，认为某事是某人所写、所说或由某事引起的",
      ],
      sentences: [
        "Writers must ___ every quotation to the person who said it.",
        "Scholars now ___ the unsigned poem to a young nun of the twelfth century.",
        "Doctors once tended to ___ the illness to bad air rather than to dirty water.",
      ],
      confusions: ["verify", "paraphrase"],
    },
    {
      word: "paraphrase",
      forms: ["paraphrases", "paraphrased", "paraphrasing"],
      meaning: ["to restate someone's idea in your own words and sentence structure", "意译，用自己的词句和结构转述他人的观点"],
      sentences: [
        "When a quotation is too long, ___ it and keep only the key phrase in quotation marks.",
        "To ___ well, read the passage, put it away, and write its idea from memory.",
        "Even if you ___ a source rather than quote it, you must still cite it.",
      ],
      confusions: ["verbatim", "corroborate"],
    },
    {
      word: "verbatim",
      meaning: ["in exactly the same words", "逐字地，一字不差地"],
      sentences: [
        "The student copied two sentences ___ from the website, which is plagiarism without quotation marks.",
        "Court reporters record every word of a trial ___.",
        "If you quote a source ___, put its words inside quotation marks.",
      ],
      confusions: ["excerpt", "provenance"],
    },
    {
      word: "excerpt",
      forms: ["excerpts"],
      meaning: ["a short passage taken from a longer text, speech or film", "摘录，从较长的文本、讲话或影片中选取的片段"],
      sentences: [
        "The textbook prints only a short ___ from the novel, not the whole chapter.",
        "She read an ___ from her grandfather's diary at the funeral.",
        "The newspaper published an ___ of the speech, about two hundred words long.",
      ],
      confusions: ["discrepancy", "provenance"],
    },
    {
      word: "discrepancy",
      forms: ["discrepancies"],
      meaning: ["a difference between two things that should match", "差异，不一致，本应相符的两者之间的差别"],
      sentences: [
        "There is a ___ between the two accounts: one says the fire began at noon, the other at three.",
        "The auditor noticed a ___ of a thousand dollars between the receipts and the bank record.",
        "When the numbers in a news story do not match the study it cites, follow up on the ___.",
      ],
      confusions: ["provenance", "excerpt"],
    },
    {
      word: "extrapolate",
      forms: ["extrapolates", "extrapolated", "extrapolating"],
      meaning: ["to estimate something unknown by extending what is known, such as a trend", "推断，外推，根据已知（如趋势）推测未知"],
      sentences: [
        "It is risky to ___ from a study of fifty students to every student in the country.",
        "If you ___ the current trend, the city will run out of water by 2050.",
        "The scientists did not test older patients, so they could not ___ their results to them.",
      ],
      confusions: ["corroborate", "substantiate"],
    },
    {
      word: "verify",
      forms: ["verified", "verifies", "verification"],
      meaning: ["to check that something is true or accurate", "核实，检查某事是否真实或准确"],
      sentences: [
        "Before sharing the photo, ___ where it was taken and when.",
        "Editors ___ every date and name in an article before it is printed.",
        "Call the office to ___ that the meeting is still on Thursday.",
      ],
      confusions: ["attribute", "extrapolate"],
    },
    {
      word: "provenance",
      meaning: ["the origin of an object or document, and its history since", "出处，来源，物品或文献的来源及其流传经历"],
      sentences: [
        "The museum could not prove the ___ of the painting, so it was not put on display.",
        "Before citing a quotation that has spread online, trace its ___ back to the person who first said it.",
        "The letter's ___ is well documented: it passed from the writer's daughter to a library in 1920.",
      ],
      confusions: ["discrepancy", "excerpt"],
    },
  ],
};

const argument: BatchSpec = {
  id: "words-of-scholarly-argument",
  title: t("Words of Scholarly Argument", "学术论证用词"),
  summary: t(
    "Ten connecting words of academic prose: albeit, notwithstanding, thereby, whereas, insofar, hence, conversely, nonetheless, moreover and furthermore.",
    "十个学术文章中的连接词：albeit、notwithstanding、thereby、whereas、insofar、hence、conversely、nonetheless、moreover 和 furthermore。",
  ),
  domain: ["the logic that links the steps of an argument", "连接论证各个步骤的逻辑"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "albeit",
      meaning: ["although; even if (before a word or phrase, not a full clause)", "尽管，虽然（后接词或短语，不接完整分句）"],
      sentences: [
        "The method worked, ___ slowly.",
        "It was a real improvement, ___ a small one.",
        "The results are encouraging, ___ based on only forty patients.",
      ],
      confusions: ["hence", "thereby"],
    },
    {
      word: "notwithstanding",
      meaning: ["in spite of (often placed after the noun it refers to)", "尽管，虽然（常置于所指名词之后）"],
      sentences: [
        "Its high cost ___, the program remains popular with parents.",
        "The committee approved the plan ___ the objections of several members.",
        "The study's small sample ___, its findings deserve attention.",
      ],
      confusions: ["whereas", "conversely"],
    },
    {
      word: "thereby",
      meaning: ["by doing this; as a result of this action", "从而，由此"],
      sentences: [
        "The city added bus lanes, ___ cutting travel times by a third.",
        "She signed the contract, ___ agreeing to all of its terms.",
        "The author ignores the earlier studies, ___ weakening her own argument.",
      ],
      confusions: ["albeit", "insofar"],
    },
    {
      word: "whereas",
      meaning: ["while on the other hand (setting two facts against each other)", "然而，而（用于对比两个事实）"],
      sentences: [
        "The first study followed students for a month, ___ the second followed them for ten years.",
        "Some critics praise the novel's style, ___ others find it cold.",
        "The new theory covers children as well, ___ the older one explains only adult learners.",
      ],
      confusions: ["hence", "moreover"],
    },
    {
      word: "insofar",
      meaning: ["to the degree that (used in the phrase insofar as)", "在……的范围内，就……而言（用于 insofar as）"],
      sentences: [
        "The findings are useful ___ as they apply to schools like the ones studied.",
        "I agree with the author ___ as she describes the problem, but not with her solution.",
        "A source is trustworthy only ___ as its evidence can be checked.",
      ],
      confusions: ["thereby", "whereas"],
    },
    {
      word: "hence",
      meaning: ["for this reason; therefore", "因此"],
      sentences: [
        "The sample was small, and ___ the results should be treated with caution.",
        "The data came from a single city; ___, they may not apply elsewhere.",
        "The word comes from the Latin for a journey by sea, ___ its link with ships.",
      ],
      confusions: ["albeit", "conversely"],
    },
    {
      word: "conversely",
      meaning: ["in the opposite way; the reverse is also true", "相反地，反过来说"],
      sentences: [
        "Rising prices reduce demand; ___, falling prices increase it.",
        "Students who slept more did better on tests; ___, those who slept less did worse.",
        "Warm water holds less oxygen; ___, cold water holds more.",
      ],
      confusions: ["albeit", "thereby"],
    },
    {
      word: "nonetheless",
      meaning: ["in spite of what has just been said", "尽管如此，然而"],
      sentences: [
        "The study had several flaws; ___, its main finding has been confirmed many times.",
        "The road was steep and icy, but the team ___ reached the village by noon.",
        "Her argument is long and sometimes repetitive; it is ___ convincing.",
      ],
      confusions: ["hence", "moreover"],
    },
    {
      word: "moreover",
      meaning: ["in addition, and more importantly (adding a stronger point)", "此外，而且（补充更进一步的论点）"],
      sentences: [
        "The plan is too expensive; ___, it would take ten years to complete.",
        "The witness stood far from the scene; ___, it was dark, so she could hardly have seen the driver's face.",
        "The theory explains the old data; ___, it predicted a result no one had yet observed.",
      ],
      confusions: ["conversely", "whereas"],
    },
    {
      word: "furthermore",
      meaning: ["in addition to what has been said", "此外，再者"],
      sentences: [
        "The report is late; ___, it leaves out the figures the board asked for.",
        "The drug lowers blood pressure; ___, it has few side effects.",
        "The site is close to the river and the railway; ___, the land is cheap.",
      ],
      confusions: ["whereas", "insofar"],
    },
  ],
};

const misused: BatchSpec = {
  id: "words-often-misused",
  title: t("Words Often Misused", "常被误用的词"),
  summary: t(
    "Ten words careful writers use in their exact sense: comprise, disinterested, enormity, literally, infer, ironic, decimate, fortuitous, peruse and bemused.",
    "十个严谨的写作者按其确切含义使用的词：comprise、disinterested、enormity、literally、infer、ironic、decimate、fortuitous、peruse 和 bemused。",
  ),
  domain: ["exact meanings that everyday speech often blurs", "日常说话中常被混淆的确切含义"],
  prerequisites: ["connotation-and-precise-words"],
  encompasses: [
    { topic: "context-clues", weight: 0.1 },
    { topic: "connotation-and-precise-words", weight: 0.1 },
  ],
  words: [
    {
      word: "comprise",
      forms: ["comprises", "comprised"],
      meaning: ["to consist of; to be made up of (the whole comprises the parts)", "包括，由……组成（整体 comprise 部分）"],
      sentences: [
        "The committee will ___ five teachers, three parents and two students.",
        "The full series will ___ twelve volumes when it is finished.",
        "The test will ___ three sections: reading, writing and listening.",
      ],
      confusions: ["decimate", "peruse"],
    },
    {
      word: "disinterested",
      meaning: [
        "impartial, because you gain nothing either way (not the same as uninterested)",
        "公正的，无私心的（因与结果无利害关系而不偏袒；不同于 uninterested）",
      ],
      sentences: [
        "A judge must be ___: she cannot rule on a case in which her own family has money at stake.",
        "The two companies asked a ___ expert, paid by neither side, to settle the dispute.",
        "Reviewers should be ___ readers who have no reason to want the paper accepted or rejected.",
      ],
      confusions: ["bemused", "ironic"],
    },
    {
      word: "enormity",
      meaning: ["the great wickedness or seriousness of something (not merely its size)", "（罪行等的）极端严重性（不只是指规模大）"],
      sentences: [
        "Only years later did the soldiers grasp the ___ of the crime they had witnessed.",
        "The ___ of the betrayal shocked even those who had always distrusted him.",
        "The court's judgment spoke of the ___ of a fraud that had robbed thousands of pensioners.",
      ],
      confusions: ["decimate", "comprise"],
    },
    {
      word: "literally",
      meaning: ["in the exact, actual sense of the words, not as a figure of speech", "字面上地，确确实实地（不是比喻）"],
      sentences: [
        "The bridge was ___ cut in half by the flood; one end now stands on each bank.",
        "The word breakfast ___ means breaking a fast, the fast of the night.",
        "She did not mean the phrase ___: no one actually turned to stone.",
      ],
      confusions: ["disinterested", "fortuitous"],
    },
    {
      word: "infer",
      forms: ["infers", "inferred", "inferring"],
      meaning: [
        "to reach a conclusion from evidence or hints (a reader infers what a writer implies)",
        "推断，从证据或暗示中得出结论（读者 infer，作者 imply）",
      ],
      sentences: [
        "From the empty plates, we can ___ that the guests enjoyed the meal.",
        "Readers ___ from the last chapter that the brothers never spoke again.",
        "What can you ___ about the author's view from the words she chooses?",
      ],
      confusions: ["peruse", "comprise"],
    },
    {
      word: "ironic",
      forms: ["ironically"],
      meaning: [
        "meaning the opposite of what is said, or turning out the opposite of what was expected (not merely unlucky)",
        "反讽的；事与愿违的（结果与预期相反，而不只是运气不好）",
      ],
      sentences: [
        "It was ___ that the fire station burned down while the firefighters were out putting out a fire.",
        "Her ___ remark about the lovely weather made everyone laugh, since it was pouring rain.",
        "In an ___ twist, the man who wrote the safety rules was the first to break them.",
      ],
      confusions: ["fortuitous", "disinterested"],
    },
    {
      word: "decimate",
      forms: ["decimated", "decimates"],
      meaning: ["to kill or destroy a large part of something", "大批杀死，毁掉大部分"],
      sentences: [
        "A disease spread by insects could ___ the island's birds within a few years.",
        "The drought threatened to ___ the region's herds of cattle.",
        "Overfishing can ___ a population of cod faster than it can recover.",
      ],
      confusions: ["comprise", "peruse"],
    },
    {
      word: "fortuitous",
      meaning: ["happening by chance (often, but not always, a lucky chance)", "偶然的，意外的（常指幸运的巧合，但不一定）"],
      sentences: [
        "Their meeting was ___: both had missed the same train and waited in the same café.",
        "The discovery was partly ___, since a dish had been left uncovered by accident.",
        "A ___ delay meant that the scientist was not on the flight that crashed.",
      ],
      confusions: ["ironic", "bemused"],
    },
    {
      word: "peruse",
      forms: ["perused", "peruses"],
      meaning: ["to read something carefully and thoroughly (not to skim it)", "仔细阅读，精读（不是略读）"],
      sentences: [
        "Lawyers ___ every clause of a contract before their clients sign it.",
        "Take the time to ___ the instructions; one missed line could ruin the experiment.",
        "The committee will ___ each application in full before choosing the winner.",
      ],
      confusions: ["infer", "decimate"],
    },
    {
      word: "bemused",
      meaning: ["puzzled or confused (not amused)", "困惑的，茫然的（不是“被逗乐的”）"],
      sentences: [
        "The tourists looked ___ as the guard shouted directions in a language they did not know.",
        "He gave a ___ shrug, unable to understand why the form had been rejected again.",
        "The new rules left even the teachers ___, since no one could explain what they meant.",
      ],
      confusions: ["disinterested", "fortuitous"],
    },
  ],
};

const statistics: BatchSpec = {
  id: "words-of-statistics",
  title: t("Words of Statistics", "统计用词"),
  summary: t(
    "Ten words for reading and reporting numbers: median, percentile, sample, margin, proportion, trend, outlier, distribution, probability and significant.",
    "十个用于阅读和报告数字的词：median、percentile、sample、margin、proportion、trend、outlier、distribution、probability 和 significant。",
  ),
  domain: ["numbers, data and what they show", "数字、数据及其所揭示的内容"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "median",
      forms: ["medians"],
      meaning: ["the middle value when a set of numbers is put in order", "中位数，一组数按顺序排列后居中的数值"],
      sentences: [
        "Half the workers earn more than the ___ wage and half earn less.",
        "Because a few houses cost millions, the ___ price says more about a typical home than the average does.",
        "In the list 3, 5, 9, 12, 40, the ___ is 9.",
      ],
      confusions: ["percentile", "proportion"],
    },
    {
      word: "percentile",
      forms: ["percentiles"],
      meaning: ["a value below which a given percentage of all results fall", "百分位，有一定百分比的结果低于它的数值"],
      sentences: [
        "A score in the ninetieth ___ means you did better than ninety percent of test takers.",
        "The baby's weight is in the fortieth ___ for her age.",
        "Doctors look more closely when a child's height falls below the fifth ___.",
      ],
      confusions: ["median", "margin"],
    },
    {
      word: "sample",
      forms: ["samples"],
      meaning: ["a smaller group chosen from a larger one to represent it in a study", "样本，从较大群体中选出以代表它的较小群体"],
      sentences: [
        "The survey's ___ was only two hundred people, all from one city.",
        "A random ___ gives every member of the population an equal chance of being chosen.",
        "Researchers took a ___ of water from each well to test it for lead.",
      ],
      confusions: ["distribution", "outlier"],
    },
    {
      word: "margin",
      forms: ["margins"],
      meaning: ["the amount by which a result may be wrong, or by which one number is larger than another", "（误差）幅度；差额"],
      sentences: [
        "The poll has a ___ of error of three points, so a lead of two points may not be real.",
        "She won the election by a narrow ___ of forty votes.",
        "With such a small sample, the ___ of error is too large for firm conclusions.",
      ],
      confusions: ["proportion", "trend"],
    },
    {
      word: "proportion",
      forms: ["proportions"],
      meaning: ["a part of a whole, compared with the whole", "比例，部分与整体之比"],
      sentences: [
        "The ___ of students who walk to school has fallen from a half to a fifth.",
        "A small ___ of the patients, about one in twenty, reported side effects.",
        "What ___ of your income goes on rent?",
      ],
      confusions: ["probability", "percentile"],
    },
    {
      word: "trend",
      forms: ["trends"],
      meaning: ["the general direction in which something changes over time", "趋势，事物随时间变化的总体方向"],
      sentences: [
        "The ___ is clear: over twenty years, fewer people have bought newspapers each year.",
        "One cold winter does not reverse a long-term warming ___.",
        "The chart shows an upward ___ in bicycle use since the new lanes opened.",
      ],
      confusions: ["distribution", "margin"],
    },
    {
      word: "outlier",
      forms: ["outliers"],
      meaning: ["a value far from all the others in a set of data", "离群值，与一组数据中其他值相差很远的值"],
      sentences: [
        "One student scored 2 while everyone else scored above 70; that ___ pulled the class average down.",
        "Before drawing conclusions, check whether a single ___ is distorting the results.",
        "The town with ten times the national rate is an ___ that deserves a closer look.",
      ],
      confusions: ["median", "sample"],
    },
    {
      word: "distribution",
      forms: ["distributions"],
      meaning: ["the way values are spread across a range", "分布，数值在一个范围内的分散方式"],
      sentences: [
        "The ___ of incomes is uneven: a few people earn a great deal and most earn far less.",
        "A bell-shaped ___ has most values in the middle and few at the ends.",
        "The map shows the ___ of rainfall across the country, from desert to rainforest.",
      ],
      confusions: ["trend", "proportion"],
    },
    {
      word: "probability",
      forms: ["probabilities"],
      meaning: [
        "how likely something is to happen, often given as a number from 0 to 1",
        "概率，某事发生的可能性，常用 0 到 1 之间的数表示",
      ],
      sentences: [
        "The ___ of rolling a six with a fair die is one in six.",
        "Forecasters said there was a high ___ of rain by evening.",
        "Wearing a seat belt greatly reduces the ___ of serious injury in a crash.",
      ],
      confusions: ["proportion", "percentile"],
    },
    {
      word: "significant",
      forms: ["significantly", "significance"],
      meaning: [
        "(of a result) unlikely to have happened by chance alone, as shown by a statistical test",
        "（统计上）显著的，经统计检验表明不太可能仅由偶然造成的",
      ],
      sentences: [
        "The difference between the two groups was statistically ___, so it is unlikely to be chance.",
        "With only ten people in each group, even a large difference may not be statistically ___.",
        "The researchers found no ___ link between screen time and grades.",
      ],
      confusions: ["outlier", "sample"],
    },
  ],
};

const workplace: BatchSpec = {
  id: "words-of-the-workplace",
  title: t("Words of the Workplace", "职场用词"),
  summary: t(
    "Ten words of working life: deadline, stakeholder, agenda, deliverable, budget, colleague, feedback, collaborate, delegate and prioritize.",
    "十个职场用词：deadline、stakeholder、agenda、deliverable、budget、colleague、feedback、collaborate、delegate 和 prioritize。",
  ),
  domain: ["work, meetings and projects", "工作、会议和项目"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "deadline",
      forms: ["deadlines"],
      meaning: ["the latest time by which something must be done", "截止日期，必须完成某事的最后期限"],
      sentences: [
        "The ___ for applications is five o'clock on Friday; late forms will not be read.",
        "We moved the ___ back a week because the printer broke down.",
        "If you cannot meet the ___, tell your manager early, not on the last day.",
      ],
      confusions: ["agenda", "deliverable"],
    },
    {
      word: "stakeholder",
      forms: ["stakeholders"],
      meaning: ["a person or group with an interest in a project or decision", "利益相关者，与项目或决定有利害关系的个人或群体"],
      sentences: [
        "Every ___ in the school, from parents to cleaners, was invited to comment on the plan.",
        "Before closing the clinic, the city met with each ___ affected by the decision.",
        "A good proposal names each ___ and explains what the project means for them.",
      ],
      confusions: ["colleague", "deliverable"],
    },
    {
      word: "agenda",
      forms: ["agendas"],
      meaning: ["a list of things to be discussed at a meeting", "议程，会议要讨论的事项列表"],
      sentences: [
        "The first item on the ___ is next year's budget.",
        "Please send me your topics by Monday so I can prepare the ___ for the meeting.",
        "We ran out of time before reaching the last point on the ___.",
      ],
      confusions: ["deadline", "feedback"],
    },
    {
      word: "deliverable",
      forms: ["deliverables"],
      meaning: ["a finished product or document that a project promises to hand over", "可交付成果，项目承诺交付的成品或文件"],
      sentences: [
        "The first ___ of the project is a report on the current system, due in March.",
        "Each ___ is listed in the contract with the date it is due.",
        "The client was pleased with the final ___: a working website and a training guide.",
      ],
      confusions: ["budget", "agenda"],
    },
    {
      word: "budget",
      forms: ["budgets"],
      meaning: ["a plan of how much money will be spent, and on what", "预算，计划花多少钱以及花在哪里"],
      sentences: [
        "The project went over ___ when the price of steel rose.",
        "Our ___ for the trip is two thousand dollars, including food.",
        "The council cut the library's ___ by a tenth.",
      ],
      confusions: ["deliverable", "deadline"],
    },
    {
      word: "colleague",
      forms: ["colleagues"],
      meaning: ["a person you work with", "同事"],
      sentences: [
        "I asked a ___ in the finance team to check my figures.",
        "She thanked each ___ who had covered her shifts while she was ill.",
        "A ___ from the Paris office will join the call.",
      ],
      confusions: ["stakeholder", "agenda"],
    },
    {
      word: "feedback",
      meaning: [
        "comments on how well someone has done something, meant to help them improve",
        "反馈意见，对某人做得如何的评价，旨在帮助其改进",
      ],
      sentences: [
        "My manager gave me useful ___ on my first presentation: slow down and use fewer slides.",
        "We collect ___ from customers after every order.",
        "Specific ___ helps more than a vague comment such as good job.",
      ],
      confusions: ["agenda", "budget"],
    },
    {
      word: "collaborate",
      forms: ["collaborates", "collaborated", "collaborating", "collaboration"],
      meaning: ["to work together with others on a shared task", "合作，与他人一起完成共同的任务"],
      sentences: [
        "The two departments will ___ on the new training program.",
        "Writers who ___ on a report should agree on a style before they begin.",
        "We ___ closely with schools to design each course.",
      ],
      confusions: ["delegate", "prioritize"],
    },
    {
      word: "delegate",
      forms: ["delegates", "delegated", "delegating"],
      meaning: ["to give part of your work or responsibility to someone else", "委派，把部分工作或职责交给他人"],
      sentences: [
        "A good manager knows which tasks to ___ and which to do herself.",
        "She decided to ___ the scheduling to her assistant.",
        "If you never ___, you will spend your days on work others could do.",
      ],
      confusions: ["collaborate", "prioritize"],
    },
    {
      word: "prioritize",
      forms: ["prioritizes", "prioritized", "prioritizing"],
      meaning: ["to decide which tasks matter most and do them first", "确定优先次序，先做最重要的事"],
      sentences: [
        "With ten requests and one afternoon, you must ___ and do the urgent ones first.",
        "The hospital will ___ patients with the most serious injuries.",
        "Our team needs to ___ safety over speed.",
      ],
      confusions: ["delegate", "collaborate"],
    },
  ],
};

const planning: BatchSpec = {
  id: "words-of-planning-and-proposals",
  title: t("Words of Planning and Proposals", "规划与提案用词"),
  summary: t(
    "Ten words for planning a project and asking for support: feasible, objective, rationale, milestone, scope, allocate, evaluate, sustainable, mitigate and implement.",
    "十个用于规划项目和申请支持的词：feasible、objective、rationale、milestone、scope、allocate、evaluate、sustainable、mitigate 和 implement。",
  ),
  domain: ["plans, proposals and projects", "计划、提案和项目"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "feasible",
      forms: ["feasibility"],
      meaning: ["possible to do in practice, with the time and money available", "可行的，在现有时间和资金下能够做到的"],
      sentences: [
        "With only three staff, a daily newsletter is not ___; a weekly one is.",
        "The engineers studied whether a tunnel under the river was ___.",
        "The plan is ambitious but ___, since the school already owns the land.",
      ],
      confusions: ["sustainable", "objective"],
    },
    {
      word: "objective",
      forms: ["objectives"],
      meaning: ["an aim that a plan sets out to achieve", "目标，计划要达成的目的"],
      sentences: [
        "The project's main ___ is to cut the school's energy use by a fifth in two years.",
        "Each ___ should be specific enough that you can tell when it has been reached.",
        "The ___ of the program is simple: every child in the village should read by the age of eight.",
      ],
      confusions: ["rationale", "scope"],
    },
    {
      word: "rationale",
      meaning: ["the reasons behind a plan or decision", "理由，计划或决定背后的依据"],
      sentences: [
        "The proposal explains its ___: the town's only library closes at five, before most adults finish work.",
        "Without a clear ___, reviewers will wonder why the project is needed at all.",
        "The ___ for the new rule was a rise in accidents near the school gate.",
      ],
      confusions: ["objective", "milestone"],
    },
    {
      word: "milestone",
      forms: ["milestones"],
      meaning: ["an important stage in a project, used to measure progress", "里程碑，项目中用来衡量进展的重要阶段"],
      sentences: [
        "The first ___ is the end of the survey in March; the second is the draft report in May.",
        "The team celebrated each ___, from the first test to the opening day.",
        "The schedule lists every ___ with a date, so the funder can check progress.",
      ],
      confusions: ["scope", "rationale"],
    },
    {
      word: "scope",
      meaning: ["the range of what a project or study covers", "范围，项目或研究所涵盖的范围"],
      sentences: [
        "The study's ___ is limited to schools in one district, so its results may not apply elsewhere.",
        "Adding a second city would widen the ___ of the project beyond its budget.",
        "Before you start, agree on the ___: what the report will cover and what it will leave out.",
      ],
      confusions: ["milestone", "rationale"],
    },
    {
      word: "allocate",
      forms: ["allocates", "allocated", "allocating", "allocation"],
      meaning: ["to set aside money, time or people for a particular purpose", "分配，为特定用途划拨资金、时间或人员"],
      sentences: [
        "The council will ___ half the grant to new books and half to longer opening hours.",
        "We ___ two hours each week to training new staff.",
        "How should the school ___ its small budget between repairs and supplies?",
      ],
      confusions: ["mitigate", "implement"],
    },
    {
      word: "evaluate",
      forms: ["evaluates", "evaluated", "evaluating", "evaluation", "evaluations"],
      meaning: ["to judge how well something works or how good it is", "评估，判断某事的效果或好坏"],
      sentences: [
        "At the end of the year, we will ___ the program by comparing test scores before and after.",
        "The panel will ___ each proposal on its cost, its plan and its benefit to the community.",
        "Ask an outside expert to ___ the results, so that the judgment is fair.",
      ],
      confusions: ["allocate", "mitigate"],
    },
    {
      word: "sustainable",
      forms: ["sustainability"],
      meaning: [
        "able to continue for a long time without running out of money or harming the environment",
        "可持续的，能长期维持而不会耗尽资金或破坏环境的",
      ],
      sentences: [
        "The garden will be ___ after the first year, since sales of vegetables will pay for seeds and water.",
        "Fishing at this rate is not ___; the stocks will collapse within a decade.",
        "Funders prefer ___ projects that can carry on after the grant ends.",
      ],
      confusions: ["feasible", "objective"],
    },
    {
      word: "mitigate",
      forms: ["mitigates", "mitigated", "mitigating", "mitigation"],
      meaning: ["to make a harm or risk less severe", "减轻，缓解（危害或风险）"],
      sentences: [
        "Trees along the street ___ the heat of summer by shading the pavement.",
        "The proposal lists each risk and how the team will ___ it.",
        "To ___ the risk of flooding, the city raised the river walls.",
      ],
      confusions: ["allocate", "evaluate"],
    },
    {
      word: "implement",
      forms: ["implements", "implemented", "implementing", "implementation"],
      meaning: ["to put a plan or decision into action", "实施，执行（计划或决定）"],
      sentences: [
        "The school will ___ the new timetable in September.",
        "It is easy to write a policy and much harder to ___ it.",
        "The city needs two years to ___ the plan in every district.",
      ],
      confusions: ["evaluate", "allocate"],
    },
  ],
};

const batches: readonly BatchSpec[] = [discourse, research, evidence, argument, misused, statistics, workplace, planning];

/** wordTopicsCollege are the vocabulary topics of the college writing course. */
export const wordTopicsCollege: readonly TopicDef[] = batches.map(batchTopic);

/** vocabularyCollege are the words the batches of the college writing course teach. */
export const vocabularyCollege: readonly WordBatch[] = batches.map(batchWords);
