// College writing: the words of each unit's theme, ten to a batch: academic discourse, research, evidence and
// inference, scholarly argument, words often misused, statistics, the workplace, and planning and proposals.

import type { TopicDef } from "@ga/content";
import { t } from "@ga/content";
import type { WordBatch } from "../../pack.ts";
import { type BatchSpec, batchTopicWithPool, batchWords, wordPool } from "../batch.ts";

const fromClues = [{ topic: "context-clues", weight: 0.1 }] as const;

const discourse: BatchSpec = {
  id: "words-of-academic-discourse",
  title: t("Words of Academic Discourse", "学术话语用词"),
  summary: t(
    "Ten words for reading and writing about scholarly arguments: paradigm, framework, methodology, premise, assumption, critique and more.",
    "十个用于阅读和书写学术论证的词：paradigm、framework、methodology、premise、assumption、critique 等。",
  ),
  intro: t(
    "In her **critique** of the study, the reviewer called its **methodology** sound but argued that one hidden **assumption**, that every student owned a phone, weakened its main **implication** for schools. These words help you read and write about scholarly arguments and the ideas they rest on.",
    "在对这项研究的评论（**critique**）中，审稿人认为它的方法论（**methodology**）是可靠的，却指出一个隐含的假设（**assumption**）——每个学生都有手机——削弱了它对学校的主要含意（**implication**）。这些词帮你阅读和书写学术论证及其依据的观念。",
  ),
  watchOut: {
    meanings: t(
      "A **premise** is stated openly as an argument's starting point, while an **assumption** is taken for granted and often never said; an **implication** is what follows at the end.",
      "**premise** 是明确提出的论证起点，**assumption** 是被视为当然、常常不说出口的东西；**implication** 则是最后推出的结果。",
    ),
    use: t(
      "A **framework** is a structure of ideas a writer chooses, a **methodology** is how the evidence is gathered, and a **paradigm** is the model a whole field takes for granted; ask who owns the idea and what it does.",
      "**framework** 是作者选用的观念结构，**methodology** 是收集证据的方法，**paradigm** 是整个领域视为当然的模式；先问这个观念属于谁、起什么作用。",
    ),
    spelling: t(
      "**Paradigm** hides a silent g, **critique** ends in -ique, and **phenomenon** becomes phenomena in the plural.",
      "**paradigm** 里藏着不发音的 g；**critique** 结尾是 -ique；**phenomenon** 的复数是 phenomena。",
    ),
  },
  domain: ["scholarly arguments and the ideas behind them", "学术论证及其背后的观念"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "paradigm",
      forms: ["paradigms"],
      meaning: ["a model or pattern of thinking that a field of study takes for granted", "范式，某一研究领域视为当然的思维模式"],
      sentences: [
        "For centuries, the ___ of astronomy, a whole model of the heavens that every astronomer accepted, placed the Earth at the center of the universe.",
        "The evidence for moving continents brought about the great ___ shift of geology: scientists had to abandon the whole model their field was built on.",
        "Within the old ___, the model of medicine that every doctor took for granted, illness was blamed on bad air, so no one looked for germs.",
      ],
      confusions: ["assumption", "methodology"],
      clues: [
        "a whole model of the heavens that every astronomer accepted",
        "geologists abandoning the whole model their field was built on",
        "a model of medicine every doctor took for granted that blamed illness on bad air",
      ],
      contrast: [
        "a paradigm is a field's whole model of thinking; an assumption is one belief taken for granted",
        "paradigm 是整个领域的思维模式；assumption 是被视为当然的某一个看法",
      ],
      conflicts: [
        [
          "assumption is one claim taken for granted, not a whole model of thinking that a field is built on",
          "assumption 是被视为当然的某一个说法，不是整个领域赖以建立的思维模式",
        ],
        [
          "methodology is the set of methods a study uses, not the model of the world that a whole field accepts",
          "methodology 是一项研究所用的方法，不是整个领域接受的世界模式",
        ],
      ],
      spelling: ["par · a · digm", "the silent g before m, in -digm", "-digm 中 m 前的 g 不发音"],
    },
    {
      word: "framework",
      forms: ["frameworks"],
      meaning: ["a structure of ideas used to organize and interpret a subject", "框架，用来组织和解释某一主题的观念结构"],
      sentences: [
        "The study uses a simple ___ of three stages to describe how children learn to read.",
        "Without a clear ___ to organize them, the report's facts become a pile that points nowhere.",
        "She borrowed a ___ of ideas from economics to explain why families save money.",
      ],
      confusions: ["methodology", "premise"],
      clues: [
        "a simple three-stage structure describing how children learn to read",
        "a report's facts piling up with nothing to organize them",
        "ideas borrowed from economics to explain why families save",
      ],
      contrast: [
        "a framework organizes ideas; a methodology is how the evidence is gathered",
        "framework 用来组织观念；methodology 是收集证据的方法",
      ],
      conflicts: [
        [
          "methodology is the set of methods used to gather evidence, not a structure of ideas for organizing a subject",
          "methodology 是收集证据的一套方法，不是组织某一主题的观念结构",
        ],
        [
          "premise is one statement an argument starts from, not a whole structure of ideas",
          "premise 是论证所依据的一个陈述，不是一整套观念结构",
        ],
      ],
      spelling: ["frame · work", "*frame* plus *work*, keeping the e", "*frame* 加 *work*，保留 e"],
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
      clues: [
        "a section explaining how two hundred schools were chosen for a survey",
        "critics questioning a study in which every subject was a volunteer",
        "a clearly described method that lets another team repeat a study",
      ],
      contrast: [
        "a methodology is how a study gathers evidence; a framework is how it organizes ideas",
        "methodology 是研究收集证据的方法；framework 是组织观念的方式",
      ],
      conflicts: [
        [
          "framework is a structure of ideas for interpreting a subject, not the steps used to collect data",
          "framework 是解释某一主题的观念结构，不是收集数据的步骤",
        ],
        [
          "critique is a judgment of a work's strengths and weaknesses, not the methods a study used",
          "critique 是对作品优缺点的评判，不是研究所用的方法",
        ],
      ],
      spelling: ["meth · od · ol · o · gy", "*method* plus -ology", "*method* 加 -ology"],
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
      clues: [
        "public talk about the climate shifting over twenty years",
        "the words advertisers use to sell food to children",
        "the way scholars talk to each other even when they disagree strongly",
      ],
      contrast: [
        "discourse is the way people talk and write about a subject; a critique is one judgment of one work",
        "discourse 是人们谈论和书写某一主题的方式；critique 是对某一作品的一次评判",
      ],
      conflicts: [
        [
          "critique is one careful judgment of a single work, not the whole way people talk and write about a subject",
          "critique 是对单个作品的一次审慎评判，不是人们谈论和书写某一主题的整体方式",
        ],
        [
          "paradigm is a model of thinking a field takes for granted, not the talk and writing on a subject",
          "paradigm 是某一领域视为当然的思维模式，不是围绕某一主题的谈论和写作",
        ],
      ],
      spelling: ["dis · course", "the word *course*, with ou", "后半是 *course*，含 ou"],
    },
    {
      word: "implication",
      forms: ["implications", "imply", "implies", "implied", "implying"],
      meaning: ["a likely effect or conclusion that follows from something", "含意，影响，由某事推出的结论或后果"],
      sentences: [
        "The ___ of the findings is that schools may be teaching reading too early.",
        "If the new drug works, the ___ for patients with heart disease could be enormous.",
        "The author never states the ___ of her figures outright, but the reader concludes from them that the policy failed.",
      ],
      confusions: ["premise", "assumption"],
      clues: [
        "findings suggesting that schools may teach reading too early",
        "a new drug's likely effect on patients with heart disease",
        "a conclusion about a failed policy that the reader draws from the figures",
      ],
      contrast: [
        "an implication comes after, as a result; a premise comes before, as a starting point",
        "implication 在后，是推出的结果；premise 在前，是出发点",
      ],
      conflicts: [
        [
          "premise is a statement an argument starts from, not a conclusion that follows from it",
          "premise 是论证的出发点，不是由论证推出的结论",
        ],
        [
          "assumption is something taken for granted beforehand, not an effect or conclusion that follows",
          "assumption 是事先被视为当然的东西，不是随之而来的影响或结论",
        ],
      ],
      spelling: ["im · pli · ca · tion", "*imply* with the y changed to i, plus -cation", "*imply* 的 y 变成 i，再加 -cation"],
    },
    {
      word: "premise",
      forms: ["premises"],
      meaning: ["a statement an argument starts from and treats as true", "前提，论证所依据并视为真实的陈述"],
      sentences: [
        "The argument begins from the ___ stated in its first sentence: that people always act in their own interest.",
        "In logic, a conclusion follows from a major ___ and a minor one, both stated plainly.",
        "The author states her ___ openly at the start and then builds the argument on it step by step.",
      ],
      confusions: ["implication", "assumption"],
      clues: [
        "an argument beginning from a claim stated in its first sentence",
        "a conclusion following from two plainly stated starting points",
        "an author stating her starting point openly and building on it step by step",
      ],
      contrast: [
        "a premise is stated openly as a starting point; an assumption is taken for granted unsaid",
        "premise 是明确提出的出发点；assumption 是不说出口、被视为当然的东西",
      ],
      conflicts: [
        [
          "implication is what follows from an argument, not the statement it starts from",
          "implication 是由论证推出的东西，不是论证的出发点",
        ],
        [
          "assumption is taken for granted without being stated, while a premise is laid out openly as a starting point",
          "assumption 是不经说明就被视为当然的，而 premise 是明确摆出来的出发点",
        ],
      ],
      spelling: ["prem · ise", "the -ise ending, said like *miss*", "结尾 -ise，读音近 *miss*"],
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
      clues: [
        "a review praising a study's large sample but faulting its short time span",
        "a two-page judgment of an article's argument",
        "a fair judgment naming what a book does well and badly",
      ],
      contrast: [
        "a critique judges strengths and weaknesses; a methodology describes methods",
        "critique 评判优缺点；methodology 说明研究方法",
      ],
      conflicts: [
        [
          "discourse is the way a group talks and writes about a subject, not one judgment of a single work",
          "discourse 是某一群体谈论和书写某一主题的方式，不是对单个作品的评判",
        ],
        [
          "methodology is the set of methods a study uses, not a judgment of its strengths and weaknesses",
          "methodology 是研究所用的方法，不是对其优缺点的评判",
        ],
      ],
      spelling: ["cri · tique", "the French -ique ending, said *eek*", "法语式结尾 -ique，读作 *eek*"],
    },
    {
      word: "assumption",
      forms: ["assumptions"],
      meaning: ["something taken for granted without being stated or proved", "假设，未经说明或证明就被视为当然的事"],
      sentences: [
        "The survey questions rest on one unspoken ___: that every family owns a computer.",
        "Question every ___ an author takes for granted without saying it, since that is where weak arguments hide.",
        "The plan made the ___ that prices would stay the same, and they did not.",
      ],
      confusions: ["premise", "implication"],
      clues: [
        "survey questions resting on an unspoken belief that every family owns a computer",
        "beliefs an author takes for granted without saying them",
        "a plan taking for granted that prices would stay the same",
      ],
      contrast: [
        "an assumption is taken for granted unsaid; a premise is stated openly",
        "assumption 是不说出口、被视为当然的；premise 是明确提出的",
      ],
      conflicts: [
        [
          "premise is a starting point an argument states openly, not something left unsaid and taken for granted",
          "premise 是论证明确提出的出发点，不是不说出口、被视为当然的东西",
        ],
        [
          "implication is a conclusion that follows from something, not a belief taken for granted at the start",
          "implication 是由某事推出的结论，不是一开始就被视为当然的看法",
        ],
      ],
      spelling: ["as · sump · tion", "the double s, and the p before -tion", "双写 s，-tion 前有 p"],
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
        "Rising rents in the center are one ___ seen in almost every large city.",
        "The northern lights are a natural ___ caused by particles from the sun.",
      ],
      confusions: ["paradigm", "implication"],
      clues: [
        "birds of many kinds suddenly leaving a region",
        "rising rents seen in almost every large city",
        "the northern lights, caused by particles from the sun",
      ],
      contrast: ["a phenomenon is something observed; a paradigm is a way of thinking", "phenomenon 是观察到的现象；paradigm 是思维模式"],
      conflicts: [
        ["paradigm is a model of thinking, not something that happens and can be seen", "paradigm 是思维模式，不是发生的、能被看见的事"],
        [
          "implication is a conclusion drawn from something, not an event that can be observed",
          "implication 是由某事推出的结论，不是可以观察到的事情",
        ],
      ],
      spelling: ["phe · nom · e · non", "the ph that sounds like f, and the plural phenomena", "ph 读作 f，复数是 phenomena"],
    },
    {
      word: "contend",
      forms: ["contends", "contended", "contending"],
      meaning: ["to argue or state that something is true", "主张，声称（某事属实）"],
      sentences: [
        "The authors ___ that homework does little for children under ten, though they admit they have no data to prove it.",
        "Some historians ___ that the war could have been avoided, and they argue the point fiercely against those who disagree.",
        "Against the earlier studies, I ___ that the evidence supports the opposite conclusion.",
      ],
      confusions: ["substantiate", "infer"],
      clues: [
        "authors arguing a claim about homework while admitting they have no data",
        "historians arguing fiercely that a war could have been avoided",
        "a writer arguing against earlier studies that the evidence points the other way",
      ],
      contrast: [
        "contend argues that a claim is true; substantiate proves it with evidence",
        "contend 是主张某事属实；substantiate 是用证据证明它",
      ],
      conflicts: [
        [
          "substantiate means to give the evidence that proves a claim, not simply to argue that it is true",
          "substantiate 是拿出证据证明某个说法，不只是主张它属实",
        ],
        [
          "infer means to draw a conclusion quietly from evidence or hints, not to argue a position against others",
          "infer 是从证据或暗示中得出结论，不是与人争辩、坚持某个立场",
        ],
      ],
      spelling: ["con · tend", "*con* plus *tend*", "*con* 加 *tend*"],
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
  intro: t(
    "Before writing her paper, Lin searched a **database** for articles, read each **abstract** to judge whether it was useful, and visited the city **archive** to see letters no one had read in a century. These words help you find, judge and keep track of the sources research relies on.",
    "动笔写论文前，林先在数据库（**database**）里检索文章，读每篇的摘要（**abstract**）判断有没有用，又去市档案馆（**archive**）查看一个世纪无人读过的信件。这些词帮你查找、评判并记录研究所依赖的资料。",
  ),
  watchOut: {
    meanings: t(
      "An **abstract** opens an article with a summary, an **annotation** is a short note beside a text, and a **bibliography** lists the sources at the end.",
      "**abstract** 是文章开头的概述，**annotation** 是文本旁的简短注释，**bibliography** 是文末列出的参考资料。",
    ),
    use: t(
      "A **database** is searched on a computer, while an **archive** is a place where old papers sit on shelves, and a **journal** publishes new research in issues; ask whether the sentence names a search tool, a building or a magazine.",
      "**database** 在电脑上检索，**archive** 是旧文件放在架子上的地方，**journal** 一期一期地发表新研究；看句子说的是检索工具、场所还是刊物。",
    ),
    spelling: t(
      "**Archive** and **scholarly** spell the k sound ch, **annotation** doubles its n, and **retrieval** keeps ie as in retrieve.",
      "**archive** 和 **scholarly** 都用 ch 拼 k 音；**annotation** 双写 n；**retrieval** 保留 retrieve 里的 ie。",
    ),
  },
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
      clues: [
        "a list at the end of an article pointing to other studies",
        "forty books and articles listed in the same format",
        "the place where every source quoted in a paper must also appear",
      ],
      contrast: [
        "a bibliography lists sources at the end; an abstract sums up the article at the start",
        "bibliography 在文末列出资料；abstract 在开头概述文章",
      ],
      conflicts: [
        [
          "abstract is a short summary at the start of an article, not a list of its sources",
          "abstract 是文章开头的简短概述，不是资料列表",
        ],
        [
          "archive is a place where old records are kept, not a list of the sources a paper used",
          "archive 是保存旧记录的地方，不是论文所用资料的列表",
        ],
      ],
      spelling: ["bib · li · og · ra · phy", "biblio- for book, and the -graphy ending with ph", "biblio- 意为书，结尾 -graphy 含 ph"],
    },
    {
      word: "abstract",
      forms: ["abstracts"],
      meaning: ["a short summary at the start of a research article", "摘要，研究论文开头的简短概述"],
      sentences: [
        "Read the ___ first; in two hundred words it tells you whether the article is worth your time.",
        "The ___ states the question, the method and the main finding in a single paragraph.",
        "Many databases show the ___ beside each title, so you can read a short summary of the article before opening it.",
      ],
      confusions: ["annotation", "bibliography"],
      clues: [
        "a two-hundred-word summary telling you whether an article is worth your time",
        "a single paragraph giving the question, the method and the main finding",
        "a short summary shown beside each title in a database",
      ],
      contrast: [
        "an abstract summarizes a whole article; an annotation is a note on one part of a text",
        "abstract 概述整篇文章；annotation 是对文本某处的注释",
      ],
      conflicts: [
        [
          "annotation is a brief note added beside a text, not the summary that opens a research article",
          "annotation 是加在文本旁的简短注释，不是研究论文开头的概述",
        ],
        [
          "bibliography is a list of sources, not a summary of an article's question and findings",
          "bibliography 是资料列表，不是对文章问题和结论的概述",
        ],
      ],
      spelling: ["ab · stract", "ab- plus *stract*, with the str cluster", "ab- 加 stract，注意 str"],
    },
    {
      word: "database",
      forms: ["databases"],
      meaning: ["an organized collection of information that can be searched on a computer", "数据库，可在电脑上检索的有组织的信息集合"],
      sentences: [
        "Type a few words into the library's ___, and in a second the computer finds every matching article.",
        "The hospital keeps every patient's test results in one ___ that doctors can search on any computer.",
        "The researchers built the ___ of ten thousand bird sightings so that anyone can search them online.",
      ],
      confusions: ["archive", "journal"],
      clues: [
        "a library system where a computer finds every matching article in a second",
        "patients' test results that doctors can search on any computer",
        "ten thousand bird sightings anyone can search online",
      ],
      contrast: [
        "a database is searched on a computer; an archive is a place that stores old papers",
        "database 在电脑上检索；archive 是存放旧文件的地方",
      ],
      conflicts: [
        [
          "archive is a place where old papers and records are stored, not a computer collection you search by typing",
          "archive 是存放旧文件和记录的地方，不是靠输入文字检索的电脑资料库",
        ],
        [
          "journal is a magazine of research articles, not a searchable store of information",
          "journal 是刊登研究论文的刊物，不是可供检索的信息库",
        ],
      ],
      spelling: ["da · ta · base", "*data* plus *base*, written as one word", "*data* 和 *base* 合写为一个词"],
    },
    {
      word: "scholarly",
      meaning: [
        "written by experts for other experts, and usually checked by other researchers",
        "学术的，由专家为专家撰写、通常经其他研究者审核的",
      ],
      sentences: [
        "Written by historians for other historians, ___ articles list their sources and explain their methods, unlike magazine stories.",
        "The professor asked for three ___ sources, not websites or newspaper columns.",
        "Her ___ book on ancient trade, checked by three other historians before it was published, is cited by experts everywhere.",
      ],
      confusions: ["interdisciplinary", "disinterested"],
      clues: [
        "articles written by historians for other historians, listing sources and methods",
        "sources from experts rather than websites or newspaper columns",
        "a history book checked by three other historians before publication",
      ],
      contrast: [
        "scholarly means written by experts for experts; interdisciplinary means drawing on several fields",
        "scholarly 指由专家为专家撰写；interdisciplinary 指涉及多个学科",
      ],
      conflicts: [
        [
          "interdisciplinary means drawing on two or more fields, not written by experts in one field for others in it",
          "interdisciplinary 是涉及两个或更多学科，不是某一领域的专家写给同行看的",
        ],
        [
          "disinterested means impartial because one gains nothing either way, not written by experts and checked by other researchers",
          "disinterested 是因无利害关系而公正，不是由专家撰写并经同行审核",
        ],
      ],
      spelling: ["schol · ar · ly", "the ch that sounds like k, and *scholar* plus -ly", "ch 读作 k，*scholar* 加 -ly"],
    },
    {
      word: "journal",
      forms: ["journals"],
      meaning: ["a magazine that publishes research articles in one field", "期刊，发表某一领域研究论文的刊物"],
      sentences: [
        "The study appeared in a medical ___ after three experts reviewed it.",
        "She subscribes to the leading ___ of marine biology, which comes out four times a year.",
        "Each issue of the ___ contains about ten research articles and several book reviews.",
      ],
      confusions: ["database", "archive"],
      clues: [
        "a medical publication that printed a study after three experts reviewed it",
        "a marine biology publication that comes out four times a year",
        "an issue holding about ten research articles and some book reviews",
      ],
      contrast: [
        "a journal publishes research in issues; a database stores information to search",
        "journal 按期发表研究；database 储存信息供检索",
      ],
      conflicts: [
        [
          "database is a searchable collection of information on a computer, not a magazine that comes out in issues",
          "database 是电脑上可检索的信息集合，不是按期出版的刊物",
        ],
        [
          "archive is a place where old records are kept, not a magazine that publishes new research",
          "archive 是保存旧记录的地方，不是发表新研究的刊物",
        ],
      ],
      spelling: ["jour · nal", "the our that sounds like *er*", "our 读作 *er*"],
    },
    {
      word: "archive",
      forms: ["archives"],
      meaning: ["a place where historical records and documents are kept", "档案馆，保存历史记录和文件的地方"],
      sentences: [
        "The letters had sat in a city ___ for a century before a student found them.",
        "Researchers must wear gloves when they handle old papers in the ___.",
        "In the newspaper's ___, yellowed paper copies of every issue since 1890 sit on metal shelves.",
      ],
      confusions: ["database", "bibliography"],
      clues: [
        "letters sitting in a city's record store for a century",
        "researchers wearing gloves to handle old papers",
        "yellowed copies of every issue since 1890 on metal shelves",
      ],
      contrast: [
        "an archive is a place for old records; a database is searched on a computer",
        "archive 是存放旧记录的地方；database 在电脑上检索",
      ],
      conflicts: [
        [
          "database is a collection searched on a computer, not a place where old papers are kept on shelves",
          "database 是在电脑上检索的集合，不是把旧文件放在架子上的地方",
        ],
        [
          "bibliography is a list of sources in a piece of writing, not a place that stores documents",
          "bibliography 是文章所列的资料清单，不是保存文件的地方",
        ],
      ],
      spelling: ["ar · chive", "the ch that sounds like k, and the silent e", "ch 读作 k，末尾 e 不发音"],
    },
    {
      word: "interdisciplinary",
      meaning: ["involving two or more fields of study", "跨学科的"],
      sentences: [
        "The ___ team included a biologist, an economist and a historian.",
        "Climate research is ___ by nature, drawing on physics, chemistry and economics.",
        "The university's new ___ course combines music and mathematics.",
      ],
      confusions: ["scholarly", "significant"],
      clues: [
        "a team of a biologist, an economist and a historian",
        "climate research drawing on physics, chemistry and economics",
        "a university course combining music and mathematics",
      ],
      contrast: [
        "interdisciplinary draws on several fields; scholarly is written by experts for experts",
        "interdisciplinary 涉及多个学科；scholarly 由专家为专家撰写",
      ],
      conflicts: [
        [
          "scholarly means written by experts for other experts, not combining several fields",
          "scholarly 是由专家为专家撰写，不是结合多个学科",
        ],
        [
          "significant means unlikely to be due to chance, not drawing on more than one field",
          "significant 是不太可能出于偶然，不是涉及多个学科",
        ],
      ],
      spelling: [
        "in · ter · dis · ci · pli · nar · y",
        "inter- plus *discipline*, with the e dropped before -ary",
        "inter- 加 *discipline*，去掉 e 再加 -ary",
      ],
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
      clues: [
        "what an expert studied and where she has worked",
        "the medical training a website's author did not have",
        "a historian's training that made his book review worth reading",
      ],
      contrast: [
        "credentials are a person's qualifications; an abstract is a summary of an article",
        "credentials 是一个人的资历；abstract 是文章的概述",
      ],
      conflicts: [
        [
          "annotation is a short note added to a text, not the training and experience that qualify a person",
          "annotation 是加在文本上的简短注释，不是证明一个人有资格的学历和经验",
        ],
        [
          "abstract is a short summary of an article, not proof that a person is qualified",
          "abstract 是文章的简短概述，不是证明某人有资格的东西",
        ],
      ],
      spelling: ["cre · den · tials", "the -tials ending, with the t sounding like sh", "结尾 -tials，t 读作 sh"],
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
      clues: [
        "a good search term speeding up the finding of relevant articles",
        "a library system cutting the time to find old records from days to minutes",
        "getting stored facts back out of memory later",
      ],
      contrast: [
        "retrieval is the act of getting stored information back; a database is where it is stored",
        "retrieval 是取回储存的信息；database 是储存信息的地方",
      ],
      conflicts: [
        [
          "annotation is a note written beside a text, not the act of finding stored information",
          "annotation 是写在文本旁的注释，不是查找储存信息的行为",
        ],
        [
          "database is where information is stored, not the act of getting it back out",
          "database 是储存信息的地方，不是把信息取回来的行为",
        ],
      ],
      spelling: ["re · triev · al", "ie after r, as in *retrieve*, and the -al ending", "r 后是 ie（同 *retrieve*），结尾是 -al"],
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
      clues: [
        "a two-sentence note on each source saying how it will be used",
        "a note in the margin of an old book correcting a date",
        "a brief note beside each paragraph naming its main point",
      ],
      contrast: [
        "an annotation is a note on part of a text; an abstract sums up a whole article",
        "annotation 是对文本某处的注释；abstract 是对整篇文章的概述",
      ],
      conflicts: [
        [
          "abstract is the summary that opens a whole article, not a short note added beside a passage",
          "abstract 是整篇文章开头的概述，不是加在某段文字旁的简短注释",
        ],
        ["bibliography is a full list of sources, not one note beside a text", "bibliography 是完整的资料列表，不是文本旁的一条注释"],
      ],
      spelling: ["an · no · ta · tion", "the double n after a", "a 后双写 n"],
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
  intro: t(
    "The museum could **verify** the painting's **provenance** only after a second letter turned up to **corroborate** the first, naming the same buyer and the same year. These words help you check claims, use other people's words honestly and spot where the evidence does not add up.",
    "直到又发现一封信，写着同一位买家、同一年份，证实（**corroborate**）了第一封信，博物馆才得以核实（**verify**）这幅画的出处（**provenance**）。这些词帮你核查说法、诚实地使用他人的文字，并发现证据对不上的地方。",
  ),
  watchOut: {
    meanings: t(
      "To **corroborate** is to back up a claim with a second source, to **substantiate** is to prove it with evidence, and to **extrapolate** is to stretch a result beyond what was studied.",
      "**corroborate** 是用另一来源支持某个说法，**substantiate** 是用证据证明它，**extrapolate** 是把结果推广到研究范围之外。",
    ),
    use: t(
      "You **paraphrase** in your own words but quote **verbatim** in the author's words; either way, you **attribute** the idea to the person it came from.",
      "**paraphrase** 是用自己的话转述，**verbatim** 是一字不差地照原话引用；无论哪种，都要把观点 **attribute** 给它的出处。",
    ),
    spelling: t(
      "**Corroborate** doubles the r but not the b, **excerpt** has a c before the e, and **discrepancy** ends in -ancy.",
      "**corroborate** 双写 r 但不双写 b；**excerpt** 的 e 前有 c；**discrepancy** 结尾是 -ancy。",
    ),
  },
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
      clues: [
        "two more witnesses backing up a woman's account of an accident",
        "a second document backing up a claim from a single diary",
        "later studies failing to back up an early result",
      ],
      contrast: [
        "corroborate backs up a claim with more evidence; extrapolate stretches a result to new cases",
        "corroborate 用更多证据支持说法；extrapolate 把结果推到新情况",
      ],
      conflicts: [
        [
          "extrapolate means to estimate the unknown by extending what is known, not to back up a claim with evidence from another source",
          "extrapolate 是由已知推测未知，不是用另一来源的证据支持某个说法",
        ],
        [
          "attribute means to name who said or caused something, not to support it with new evidence",
          "attribute 是指出某事是谁说的或由什么引起，不是用新证据支持它",
        ],
      ],
      spelling: ["cor · rob · o · rate", "the double r, then a single b", "双写 r，b 单写"],
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
      clues: [
        "a reporter unable to prove a rumor, so the paper did not print it",
        "a claim that a policy failed, which must be backed with figures",
        "bold promises about a product that were never proved",
      ],
      contrast: [
        "substantiate proves a claim with evidence; paraphrase only restates it",
        "substantiate 用证据证明说法；paraphrase 只是转述它",
      ],
      conflicts: [
        [
          "paraphrase means to restate an idea in your own words, not to prove it with evidence",
          "paraphrase 是用自己的话转述观点，不是用证据证明它",
        ],
        [
          "extrapolate means to estimate beyond the known facts, not to supply the facts that prove a claim",
          "extrapolate 是超出已知事实去推测，不是提供证明说法的事实",
        ],
      ],
      spelling: ["sub · stan · ti · ate", "*substance* hidden inside, then -tiate", "里面藏着 *substance*，结尾是 -tiate"],
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
      clues: [
        "crediting every quotation to the person who said it",
        "crediting an unsigned poem to a young nun of the twelfth century",
        "doctors blaming an illness on bad air instead of dirty water",
      ],
      contrast: ["attribute names the source or cause; verify checks that something is true", "attribute 指出来源或原因；verify 核实真假"],
      conflicts: [
        [
          "verify means to check that something is true, not to name who wrote, said or caused it",
          "verify 是核实某事是否属实，不是指出它由谁写、谁说或由什么引起",
        ],
        [
          "paraphrase means to restate an idea in your own words, not to credit it to its source",
          "paraphrase 是用自己的话转述观点，不是把它归于出处",
        ],
      ],
      spelling: ["at · trib · ute", "the double t, and the -ute ending", "双写 t，结尾是 -ute"],
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
      confusions: ["corroborate", "attribute"],
      clues: [
        "shortening a long quotation and keeping only the key phrase in quotation marks",
        "writing a passage's idea from memory after putting it away",
        "restating a source instead of quoting it, and still citing it",
      ],
      contrast: [
        "paraphrase restates an idea in your own words; attribute names where it came from",
        "paraphrase 用自己的话转述；attribute 说明出处",
      ],
      conflicts: [
        [
          "corroborate means to back up a claim with evidence from another source, not to put an idea into your own words",
          "corroborate 是用另一来源的证据支持说法，不是用自己的话表达观点",
        ],
        [
          "attribute means to name who said something, not to restate it in your own words",
          "attribute 是指出某话是谁说的，不是用自己的话重新表述",
        ],
      ],
      spelling: ["par · a · phrase", "the ph that sounds like f in *phrase*", "*phrase* 中的 ph 读作 f"],
    },
    {
      word: "verbatim",
      meaning: ["in exactly the same words", "逐字地，一字不差地"],
      sentences: [
        "The student copied two sentences ___ from the website, changing not a single word, which is plagiarism without quotation marks.",
        "Court reporters record every word of a trial ___, leaving nothing out and changing nothing.",
        "If you repeat a source's words ___, exactly as written, put them inside quotation marks.",
      ],
      confusions: ["conversely", "thereby"],
      clues: [
        "two sentences copied from a website without changing a single word",
        "court reporters recording every word of a trial, leaving nothing out",
        "a source's words repeated exactly as written",
      ],
      contrast: ["verbatim means word for word; conversely introduces the reverse case", "verbatim 指一字不差；conversely 引出相反的情况"],
      conflicts: [
        [
          "conversely introduces the reverse of what was just said, not copying in exactly the same words",
          "conversely 引出与前面相反的情况，不是一字不差地照抄",
        ],
        ["thereby means as a result of this action, not word for word", "thereby 是“由此、从而”，不是一字不差"],
      ],
      spelling: ["ver · ba · tim", "*verb* at the start, and the Latin -atim ending", "开头是 *verb*，结尾是拉丁式的 -atim"],
    },
    {
      word: "excerpt",
      forms: ["excerpts"],
      meaning: ["a short passage taken from a longer text, speech or film", "摘录，从较长的文本、讲话或影片中选取的片段"],
      sentences: [
        "The textbook prints only a short ___ from the novel, not the whole chapter.",
        "At the funeral she read one ___ from her grandfather's diary, a single page about his wedding day.",
        "The newspaper quoted a short ___ from the speech, word for word, beside its report.",
      ],
      confusions: ["abstract", "discrepancy"],
      clues: [
        "a short passage printed from a novel instead of the whole chapter",
        "a single page read aloud from a grandfather's diary",
        "a short passage quoted word for word from a speech",
      ],
      contrast: [
        "an excerpt is copied out of a text; an abstract sums the text up",
        "excerpt 是从文本中摘出的片段；abstract 是对文本的概括",
      ],
      conflicts: [
        [
          "abstract is a summary written in new words, not a passage taken word for word from a longer text",
          "abstract 是用新的文字写成的概述，不是从长文本中原样摘出的片段",
        ],
        [
          "discrepancy is a difference between two things that should match, not a passage taken from a text",
          "discrepancy 是本应相符的两者之间的差异，不是从文本中摘出的片段",
        ],
      ],
      spelling: ["ex · cerpt", "a c before the e, and the -rpt ending", "e 前有 c，结尾是 -rpt"],
    },
    {
      word: "discrepancy",
      forms: ["discrepancies"],
      meaning: ["a difference between two things that should match", "差异，不一致，本应相符的两者之间的差别"],
      sentences: [
        "There is one ___ between the two accounts: one says the fire began at noon, the other at three.",
        "The auditor noticed a thousand-dollar ___ between the receipts and the bank record.",
        "When the numbers in a news story do not match the study it cites, follow up on the ___.",
      ],
      confusions: ["provenance", "excerpt"],
      clues: [
        "two accounts disagreeing about whether a fire began at noon or at three",
        "a thousand dollars missing between receipts and the bank record",
        "numbers in a news story that do not match the study it cites",
      ],
      contrast: ["a discrepancy is a mismatch; provenance is where something came from", "discrepancy 是不一致；provenance 是来源"],
      conflicts: [
        ["provenance is where a document came from, not a mismatch between two things", "provenance 是文献的来源，不是两者之间的不一致"],
        [
          "excerpt is a passage taken from a text, not a difference between two records",
          "excerpt 是从文本中摘出的片段，不是两份记录之间的差异",
        ],
      ],
      spelling: ["dis · crep · an · cy", "the -ancy ending, not -ency", "结尾是 -ancy，不是 -ency"],
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
      clues: [
        "stretching a study of fifty students to every student in the country",
        "extending today's trend to predict the city running out of water",
        "applying results to older patients who were never tested",
      ],
      contrast: [
        "extrapolate stretches known results to new cases; corroborate backs up a claim with more evidence",
        "extrapolate 把已知结果推到新情况；corroborate 用更多证据支持说法",
      ],
      conflicts: [
        [
          "corroborate means to back up a claim with more evidence, not to stretch a known result to cases not studied",
          "corroborate 是用更多证据支持说法，不是把已知结果推广到没研究过的情况",
        ],
        [
          "substantiate means to prove a claim with evidence, not to guess beyond what the evidence covers",
          "substantiate 是用证据证明说法，不是超出证据范围去推测",
        ],
      ],
      spelling: ["ex · trap · o · late", "extra- followed by -polate", "extra- 后接 -polate"],
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
      clues: [
        "checking where and when a photo was taken before sharing it",
        "editors checking every date and name before printing",
        "calling the office to check that a meeting is still on",
      ],
      contrast: ["verify checks that something is true; attribute names its source", "verify 核实真假；attribute 指出来源"],
      conflicts: [
        [
          "attribute means to name who said or caused something, not to check that it is true",
          "attribute 是指出某事由谁说或由什么引起，不是核实它是否属实",
        ],
        [
          "extrapolate means to estimate beyond known facts, not to check facts against the record",
          "extrapolate 是超出已知事实去推测，不是对照记录核查事实",
        ],
      ],
      spelling: ["ver · i · fy", "the y that becomes i before -es and -ed: verified", "y 在 -es、-ed 前变成 i：verified"],
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
      clues: [
        "a museum unable to prove where a painting came from",
        "tracing an online quotation back to the person who first said it",
        "a letter passing from the writer's daughter to a library in 1920",
      ],
      contrast: [
        "provenance is where something came from and where it has been; a discrepancy is a mismatch",
        "provenance 是来源和流传经历；discrepancy 是不一致",
      ],
      conflicts: [
        [
          "discrepancy is a mismatch between two things, not the origin and history of an object",
          "discrepancy 是两者之间的不一致，不是物品的来源和经历",
        ],
        [
          "excerpt is a passage taken from a text, not the record of where a document came from",
          "excerpt 是从文本中摘出的片段，不是文献来源的记录",
        ],
      ],
      spelling: ["prov · e · nance", "the e after prov, and the -ance ending", "prov 后是 e，结尾是 -ance"],
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
  intro: t(
    "The new law cut traffic, **albeit** slowly; **moreover**, it cleaned the air, **thereby** saving lives, **whereas** the old rules had done neither. These words show how the steps of an argument connect: adding, contrasting, conceding and drawing conclusions.",
    "新法规减少了车流，尽管（**albeit**）见效很慢；此外（**moreover**），它净化了空气，从而（**thereby**）挽救了生命，而（**whereas**）旧规定两样都没做到。这些词显示论证的各步如何衔接：补充、对比、让步和得出结论。",
  ),
  watchOut: {
    meanings: t(
      "**Albeit** and **notwithstanding** both concede a point, but **albeit** goes before a short phrase while **notwithstanding** often follows a noun: *it worked, albeit slowly*; *its cost notwithstanding*.",
      "**albeit** 和 **notwithstanding** 都表示让步，但 **albeit** 放在短语前，**notwithstanding** 常放在名词后：*it worked, albeit slowly*；*its cost notwithstanding*。",
    ),
    use: t(
      "**Moreover** and **furthermore** add a point in the same direction, **whereas** and **conversely** turn to a contrast, and **hence** draws a result; decide which way the next idea moves before you choose.",
      "**moreover** 和 **furthermore** 顺着同一方向补充，**whereas** 和 **conversely** 转向对比，**hence** 引出结果；选词前先判断下一个意思往哪个方向走。",
    ),
    spelling: t(
      "**Notwithstanding**, **nonetheless**, **furthermore** and **insofar** are each written as one word, and **albeit** has only one l.",
      "**notwithstanding**、**nonetheless**、**furthermore** 和 **insofar** 都写成一个词，**albeit** 只有一个 l。",
    ),
  },
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
      clues: [
        "a method that worked, though slowly",
        "a real improvement, though a small one",
        "encouraging results, though based on only forty patients",
      ],
      contrast: ["albeit admits a limit; hence draws a result", "albeit 承认局限；hence 引出结果"],
      conflicts: [
        [
          "hence means for this reason, so it adds a result, not a limit that weakens the point",
          "hence 意为“因此”，引出结果，而不是削弱论点的局限",
        ],
        [
          "thereby means by doing this, and it leads into the result of an action, not a concession",
          "thereby 意为“由此”，引出某个行动的结果，而不是表示让步",
        ],
      ],
      spelling: ["al · be · it", "*all be it* run together, with one l", "由 all be it 连写而成，只有一个 l"],
    },
    {
      word: "notwithstanding",
      meaning: ["in spite of (often placed after the noun it refers to)", "尽管，虽然（常置于所指名词之后）"],
      sentences: [
        "Its high cost ___, the program remains popular with parents.",
        "The committee approved the plan ___ the objections of several members.",
        "The study's small sample ___, its findings deserve attention.",
      ],
      confusions: ["albeit", "whereas"],
      clues: [
        "a program that stays popular in spite of its high cost",
        "a plan approved in spite of several members' objections",
        "findings worth attention in spite of a small sample",
      ],
      contrast: [
        "notwithstanding means in spite of a thing named beside it; albeit adds a limiting phrase",
        "notwithstanding 表示“尽管有某事”；albeit 引出限定性的短语",
      ],
      conflicts: [
        [
          "albeit means although and goes before a limiting word or phrase, so it cannot stand beside a noun to mean in spite of it",
          "albeit 意为“虽然”，放在限定的词或短语前，不能紧挨名词表示“尽管有它”",
        ],
        [
          "whereas sets two full facts against each other, not meaning in spite of a single thing",
          "whereas 是把两个完整的事实对照起来，不是“尽管有某一件事”",
        ],
      ],
      spelling: ["not · with · stand · ing", "*not*, *with* and *standing* written as one word", "*not*、*with*、*standing* 合写为一个词"],
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
      clues: [
        "a city adding bus lanes and as a result cutting travel times",
        "signing a contract and by doing so agreeing to its terms",
        "an author ignoring earlier studies and so weakening her own argument",
      ],
      contrast: ["thereby leads into the result of an action; albeit admits a limit", "thereby 引出行动的结果；albeit 承认局限"],
      conflicts: [
        [
          "albeit introduces a limit on what was said, not the result that an action brings",
          "albeit 引出对前面说法的限定，不是某个行动带来的结果",
        ],
        [
          "insofar must be followed by as and sets a limit on a claim, not the result of an action",
          "insofar 后面必须跟 as，用来限定说法的范围，不是表示行动的结果",
        ],
      ],
      spelling: ["there · by", "*there* plus *by*", "*there* 加 *by*"],
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
      clues: [
        "one study lasting a month set against another lasting ten years",
        "critics who praise a novel's style set against others who find it cold",
        "a new theory covering children set against an old one covering only adults",
      ],
      contrast: [
        "whereas sets two facts against each other; moreover adds a further point",
        "whereas 把两个事实对照；moreover 补充更进一步的论点",
      ],
      conflicts: [
        [
          "hence introduces a result of what came before, not a contrast between two facts",
          "hence 引出前面内容的结果，不是两个事实之间的对比",
        ],
        [
          "moreover adds a further point in the same direction, not a contrasting fact",
          "moreover 顺着同一方向补充论点，不是引出对比的事实",
        ],
      ],
      spelling: ["where · as", "*where* plus *as*, written as one word", "*where* 加 *as*，合写为一个词"],
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
      clues: [
        "findings useful only to the degree that they apply to similar schools",
        "agreeing with an author only to the degree that she describes the problem",
        "a source trustworthy only to the degree that its evidence can be checked",
      ],
      contrast: [
        "insofar as limits a claim to a degree; thereby leads into a result",
        "insofar as 把说法限定在某种程度内；thereby 引出结果",
      ],
      conflicts: [
        ["thereby means by doing this, and it is never followed by as to set a limit", "thereby 意为“由此”，后面从不跟 as 来限定范围"],
        [
          "whereas sets one fact against another, and it is never followed by as to mean to the degree that",
          "whereas 把一个事实与另一个对照，后面从不跟 as 表示“在……程度上”",
        ],
      ],
      spelling: ["in · so · far", "*in*, *so* and *far* written as one word", "*in*、*so*、*far* 合写为一个词"],
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
      clues: [
        "caution about results because a sample was small",
        "doubts about other places because data came from one city",
        "a word's link with ships because it comes from the Latin for a sea journey",
      ],
      contrast: ["hence draws a result; conversely turns to the reverse case", "hence 引出结果；conversely 转向相反的情况"],
      conflicts: [
        ["albeit admits a limit on a point, not a result that follows from it", "albeit 是承认论点有局限，不是由它推出的结果"],
        ["conversely introduces the reverse case, not a conclusion that follows", "conversely 引出相反的情况，不是随之推出的结论"],
      ],
      spelling: ["hence", "the -nce ending, as in *fence*", "结尾是 -nce，同 *fence*"],
    },
    {
      word: "conversely",
      meaning: ["in the opposite way; the reverse is also true", "相反地，反过来说"],
      sentences: [
        "Rising prices reduce demand; ___, falling prices increase it.",
        "Students who slept more did better on tests; ___, those who slept less did worse.",
        "Warm water holds less oxygen; ___, cold water holds more.",
      ],
      confusions: ["whereas", "albeit"],
      clues: [
        "falling prices doing the reverse of rising prices",
        "students who slept less doing the reverse of those who slept more",
        "cold water holding more oxygen, the reverse of warm water",
      ],
      contrast: [
        "conversely states that the reverse also holds; whereas only sets two facts side by side",
        "conversely 说明反过来也成立；whereas 只是把两个事实并列对照",
      ],
      conflicts: [
        [
          "whereas sets two facts side by side inside one sentence, not stating that the reverse of a rule also holds",
          "whereas 在一个句子里把两个事实对照，不是说明某个规律反过来也成立",
        ],
        [
          "albeit admits a limit on a point, not stating that the reverse of it also holds",
          "albeit 是承认论点有局限，不是说明反过来也成立",
        ],
      ],
      spelling: ["con · verse · ly", "*converse* keeps its e before -ly", "*converse* 加 -ly 时保留 e"],
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
      clues: [
        "a finding confirmed many times despite a study's flaws",
        "a team reaching a village by noon despite a steep, icy road",
        "an argument convincing despite being long and repetitive",
      ],
      contrast: [
        "nonetheless means true in spite of what was said; hence means because of it",
        "nonetheless 指尽管如此仍然成立；hence 指正因如此",
      ],
      conflicts: [
        ["hence introduces a result, not something true in spite of what was said", "hence 引出结果，不是尽管如此仍然成立的事"],
        [
          "moreover adds another point in the same direction, not one that holds despite the problems just named",
          "moreover 顺着同一方向补充论点，不是尽管有前述问题仍然成立的事",
        ],
      ],
      spelling: ["none · the · less", "*none*, *the* and *less* written as one word", "*none*、*the*、*less* 合写为一个词"],
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
      clues: [
        "a plan that is too expensive and would also take ten years",
        "a witness standing far away, and on top of that in the dark",
        "a theory that explains old data and, more importantly, predicted a new result",
      ],
      contrast: [
        "moreover adds a stronger point; conversely turns to the reverse case",
        "moreover 补充更有力的论点；conversely 转向相反的情况",
      ],
      conflicts: [
        ["conversely introduces the reverse case, not a further, stronger point", "conversely 引出相反的情况，不是更进一步的论点"],
        ["whereas sets a contrasting fact against another, not adding a stronger point", "whereas 引出对比的事实，不是补充更有力的论点"],
      ],
      spelling: ["more · o · ver", "*more* plus *over*, written as one word", "*more* 加 *over*，合写为一个词"],
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
      clues: [
        "a late report that also leaves out the figures the board asked for",
        "a drug that lowers blood pressure and also has few side effects",
        "a site near the river and railway whose land is also cheap",
      ],
      contrast: ["furthermore adds another point; whereas sets up a contrast", "furthermore 补充另一点；whereas 引出对比"],
      conflicts: [
        ["whereas introduces a contrast, not a further point in the same direction", "whereas 引出对比，不是同一方向上的补充"],
        ["insofar needs as after it and limits a claim, not adding another point", "insofar 后面要跟 as，用来限定说法，不是补充另一点"],
      ],
      spelling: ["fur · ther · more", "*further* plus *more*", "*further* 加 *more*"],
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
  intro: t(
    "The judge was **disinterested**, with nothing to gain from the case, yet even she looked **bemused** when the lawyer claimed the evidence had **literally** exploded in his hands. These words have exact meanings that everyday speech often blurs, and careful writers keep them sharp.",
    "法官与案件毫无利害关系，十分公正（**disinterested**），可当律师声称证据“确确实实地”（**literally**）在他手里炸开时，连她也一脸困惑（**bemused**）。这些词都有确切的含义，日常说话常把它们弄混，严谨的写作者则把它们用得精准。",
  ),
  watchOut: {
    meanings: t(
      "**Disinterested** means fair because you gain nothing, not bored; **bemused** means puzzled, not amused; and **enormity** means great wickedness, not great size.",
      "**disinterested** 指因无利害关系而公正，不是“没兴趣”；**bemused** 指困惑，不是“被逗乐”；**enormity** 指罪大恶极，不是“规模巨大”。",
    ),
    use: t(
      "The whole **comprises** its parts, so write *the team comprises five players*, not *is comprised of*; and a reader **infers** what a writer implies, never the other way round.",
      "整体 **comprise** 部分，所以写 *the team comprises five players*，而不写 *is comprised of*；读者 **infer** 作者暗示的意思，不能反过来用。",
    ),
    spelling: t(
      "**Literally** has a double l, **fortuitous** has u-i in the middle, and **comprise** always ends in -ise, never -ize.",
      "**literally** 双写 l；**fortuitous** 中间是 u-i；**comprise** 结尾永远是 -ise，不写 -ize。",
    ),
  },
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
      clues: [
        "a committee made up of teachers, parents and students",
        "a series that will be made up of twelve volumes",
        "a test made up of reading, writing and listening sections",
      ],
      contrast: [
        "comprise means to be made up of parts; decimate means to destroy a large part",
        "comprise 是由部分组成；decimate 是毁掉大部分",
      ],
      conflicts: [
        [
          "decimate means to destroy a large part of something, not to be made up of parts",
          "decimate 是毁掉某物的大部分，不是由若干部分组成",
        ],
        ["peruse means to read carefully, not to consist of parts", "peruse 是仔细阅读，不是由若干部分组成"],
      ],
      spelling: ["com · prise", "the -ise ending, which is never -ize", "结尾是 -ise，永远不写 -ize"],
    },
    {
      word: "disinterested",
      meaning: [
        "impartial, because you gain nothing either way (not the same as uninterested)",
        "公正的，无私心的（因与结果无利害关系而不偏袒；不同于 uninterested）",
      ],
      sentences: [
        "A judge must be ___: she cannot rule on a case in which her own family has money at stake.",
        "The two companies asked one ___ expert, paid by neither side, to settle the dispute.",
        "Reviewers should be ___ readers who have no reason to want the paper accepted or rejected.",
      ],
      confusions: ["bemused", "ironic"],
      clues: [
        "a judge who cannot rule on a case where her family has money at stake",
        "an expert paid by neither side to settle a dispute",
        "reviewers with no reason to want a paper accepted or rejected",
      ],
      contrast: [
        "disinterested means impartial; uninterested means bored, and bemused means puzzled",
        "disinterested 指公正无私；uninterested 指没兴趣，bemused 指困惑",
      ],
      conflicts: [
        ["bemused means puzzled, not impartial because one has nothing to gain", "bemused 是困惑，不是因无利可图而公正"],
        [
          "ironic means turning out the opposite of what was expected, not free from any interest in the outcome",
          "ironic 是结果与预期相反，不是与结果毫无利害关系",
        ],
      ],
      spelling: ["dis · in · ter · est · ed", "dis- plus *interested*", "dis- 加 *interested*"],
    },
    {
      word: "enormity",
      meaning: ["the great wickedness or seriousness of something (not merely its size)", "（罪行等的）极端严重性（不只是指规模大）"],
      sentences: [
        "Only years later did the soldiers grasp the ___ of the crime they had witnessed.",
        "The ___ of the betrayal shocked even those who had always distrusted him.",
        "The court's judgment spoke of the ___ of a fraud that had robbed thousands of pensioners.",
      ],
      confusions: ["phenomenon", "discrepancy"],
      clues: [
        "soldiers grasping years later how evil a crime they had witnessed was",
        "a betrayal so wicked it shocked even his old critics",
        "a fraud that robbed thousands of pensioners",
      ],
      contrast: ["enormity is the great wickedness of a wrong, not merely its large size", "enormity 是罪行的极端严重，不只是规模大"],
      conflicts: [
        [
          "phenomenon is something that can be observed and studied, not the great wickedness of a wrong",
          "phenomenon 是可观察、可研究的现象，不是罪行的极端恶劣",
        ],
        [
          "discrepancy is a mismatch between two things, not the terrible seriousness of a crime",
          "discrepancy 是两者之间的不一致，不是罪行的极端严重",
        ],
      ],
      spelling: ["e · nor · mi · ty", "*enormous* without -ous, plus -ity", "*enormous* 去掉 -ous，再加 -ity"],
    },
    {
      word: "literally",
      meaning: ["in the exact, actual sense of the words, not as a figure of speech", "字面上地，确确实实地（不是比喻）"],
      sentences: [
        "The bridge was ___ cut in half by the flood; one end now stands on each bank.",
        "The word breakfast ___ means breaking a fast, the fast of the night.",
        "She did not mean the phrase ___: no one actually turned to stone.",
      ],
      confusions: ["verbatim", "conversely"],
      clues: [
        "a bridge actually cut in half by a flood",
        "the actual meaning of the parts of the word breakfast",
        "a figure of speech not meant in its actual sense",
      ],
      contrast: [
        "literally means in the actual sense of the words; verbatim means in exactly the same words",
        "literally 指按字面的真实意思；verbatim 指一字不差",
      ],
      conflicts: [
        [
          "verbatim means in exactly the same words, as when copying, not in the actual rather than figurative sense",
          "verbatim 是像抄写那样一字不差，不是按真实而非比喻的意思",
        ],
        [
          "conversely introduces the reverse case, not the real, non-figurative sense of words",
          "conversely 引出相反的情况，不是词语真实、非比喻的意思",
        ],
      ],
      spelling: ["lit · er · al · ly", "*literal* plus -ly, so a double l", "*literal* 加 -ly，所以双写 l"],
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
      clues: [
        "concluding from empty plates that guests enjoyed a meal",
        "readers concluding from the last chapter that the brothers never spoke again",
        "working out an author's view from the words she chooses",
      ],
      contrast: ["a reader infers from hints; a writer implies them", "读者 infer 从暗示中推断；作者 imply 给出暗示"],
      conflicts: [
        ["peruse means to read carefully, not to reach a conclusion from clues", "peruse 是仔细阅读，不是从线索中得出结论"],
        ["comprise means to be made up of parts, not to draw a conclusion", "comprise 是由若干部分组成，不是得出结论"],
      ],
      spelling: ["in · fer", "one r in infer, but two in inferred", "infer 只有一个 r，inferred 双写 r"],
    },
    {
      word: "ironic",
      forms: ["ironically"],
      meaning: [
        "meaning the opposite of what is said, or turning out the opposite of what was expected (not merely unlucky)",
        "反讽的；事与愿违的（结果与预期相反，而不只是运气不好）",
      ],
      sentences: [
        "It was ___ that the fire station, home to the people whose job is to stop fires, burned down.",
        "Her ___ remark about the lovely weather made everyone laugh, since it was pouring rain.",
        "In a twist that was truly ___, the man who wrote the safety rules was the first to break them.",
      ],
      confusions: ["fortuitous", "disinterested"],
      clues: [
        "a fire station, home of the people who stop fires, burning down",
        "a remark about lovely weather made in pouring rain",
        "the writer of the safety rules being the first to break them",
      ],
      contrast: [
        "ironic means the opposite of what is expected; fortuitous only means by chance",
        "ironic 指与预期相反；fortuitous 只是指出于偶然",
      ],
      conflicts: [
        [
          "fortuitous means happening by lucky chance, not turning out the opposite of what one would expect",
          "fortuitous 是幸运的巧合，不是结果与预期相反",
        ],
        [
          "disinterested means impartial, not saying or turning out the opposite of what is expected",
          "disinterested 是公正无私，不是说法或结果与预期相反",
        ],
      ],
      spelling: ["i · ron · ic", "*iron* plus -ic", "*iron* 加 -ic"],
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
      clues: [
        "a disease that could kill most of an island's birds",
        "a drought threatening to wipe out a region's herds of cattle",
        "overfishing killing cod faster than they can recover",
      ],
      contrast: [
        "decimate means to destroy a large part; comprise means to be made up of parts",
        "decimate 是毁掉大部分；comprise 是由部分组成",
      ],
      conflicts: [
        [
          "comprise means to be made up of parts, not to destroy a large part of something",
          "comprise 是由若干部分组成，不是毁掉某物的大部分",
        ],
        ["peruse means to read carefully, not to kill or wipe out most of something", "peruse 是仔细阅读，不是杀死或毁掉某物的大部分"],
      ],
      spelling: ["dec · i · mate", "deci- as in *decimal*", "deci- 同 *decimal*"],
    },
    {
      word: "fortuitous",
      meaning: ["happening by chance (often, but not always, a lucky chance)", "偶然的，意外的（常指幸运的巧合，但不一定）"],
      sentences: [
        "Their meeting was ___: both had missed the same train and waited in the same café.",
        "The discovery was partly ___, since a dish had been left uncovered by accident.",
        "It was the ___ delay of a flat tire that kept the scientist off the flight that crashed.",
      ],
      confusions: ["ironic", "bemused"],
      clues: [
        "two people meeting after missing the same train",
        "a discovery made because a dish was left uncovered by accident",
        "a chance delay that kept a scientist off a flight that crashed",
      ],
      contrast: [
        "fortuitous means by chance; ironic means the opposite of what was expected",
        "fortuitous 指出于偶然；ironic 指与预期相反",
      ],
      conflicts: [
        ["ironic means the opposite of what was expected, not simply happening by chance", "ironic 是与预期相反，不只是出于偶然"],
        ["bemused means puzzled, not happening by lucky chance", "bemused 是困惑，不是出于幸运的巧合"],
      ],
      spelling: ["for · tu · i · tous", "the u-i in the middle: for-tu-i-tous", "中间是 u-i：for-tu-i-tous"],
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
      clues: [
        "lawyers reading every clause of a contract",
        "reading instructions closely so no line is missed",
        "a committee reading each application in full",
      ],
      contrast: [
        "peruse means to read carefully, not to skim; infer means to conclude from hints",
        "peruse 是仔细阅读，不是略读；infer 是从暗示中推断",
      ],
      conflicts: [
        ["infer means to draw a conclusion from hints, not to read every line carefully", "infer 是从暗示中得出结论，不是逐行仔细阅读"],
        ["decimate means to destroy most of something, not to read it closely", "decimate 是毁掉某物的大部分，不是仔细阅读它"],
      ],
      spelling: ["pe · ruse", "a single r, and the -use ending", "单写 r，结尾是 -use"],
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
      clues: [
        "tourists hearing directions shouted in a language they did not know",
        "a shrug at a form rejected again for no clear reason",
        "teachers unable to explain what new rules meant",
      ],
      contrast: ["bemused means puzzled, not amused", "bemused 指困惑，不是被逗乐"],
      conflicts: [
        ["disinterested means impartial, not puzzled and confused", "disinterested 是公正无私，不是困惑茫然"],
        ["fortuitous means happening by chance, not feeling confused", "fortuitous 是出于偶然，不是感到困惑"],
      ],
      spelling: ["be · mused", "be- plus *mused*, not *amused*", "be- 加 mused，不是 amused"],
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
  intro: t(
    "In the survey's **sample** of five hundred families, the **median** income rose for the third year in a row, a **trend** the authors called statistically **significant**. These words help you read and report numbers without being fooled by them.",
    "在这项调查的五百户样本（**sample**）中，收入中位数（**median**）连续第三年上升，作者称这一趋势（**trend**）在统计上是显著的（**significant**）。这些词帮你读懂和报告数字，而不被数字蒙蔽。",
  ),
  watchOut: {
    meanings: t(
      "The **median** is the single middle value, while a **percentile** says what share of results fall below a value; the median is simply the fiftieth percentile.",
      "**median** 是唯一的中间值，**percentile** 说明有多少比例的结果低于某个值；中位数就是第五十百分位。",
    ),
    use: t(
      "A **proportion** is a share of a group that already exists, while a **probability** is the chance that something will happen; one patient in twenty is a proportion, one roll in six is a probability.",
      "**proportion** 是已有群体中所占的份额，**probability** 是某事将会发生的可能性；二十个病人中有一个是 proportion，掷骰子六次中一次是 probability。",
    ),
    spelling: t(
      "**Percentile** is percent plus -ile, **significant** ends in -cant, and **probability** turns probable into -bility.",
      "**percentile** 是 percent 加 -ile；**significant** 结尾是 -cant；**probability** 把 probable 变成 -bility。",
    ),
  },
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
      clues: [
        "half of workers earning more than the middle wage and half less",
        "a middle house price that says more than the average when a few homes cost millions",
        "the middle number of the list 3, 5, 9, 12, 40",
      ],
      contrast: [
        "the median is the one middle value; a percentile can be any rank, such as the ninetieth",
        "median 是唯一的中间值；percentile 可以是任意排名，如第九十",
      ],
      conflicts: [
        [
          "percentile is a value with a given percentage of results below it, such as the ninetieth, not the single middle value",
          "percentile 是有一定百分比结果低于它的值，比如第九十百分位，不是唯一的中间值",
        ],
        [
          "proportion is a part compared with the whole, not the middle value of an ordered list",
          "proportion 是部分与整体之比，不是一列有序数的中间值",
        ],
      ],
      spelling: ["me · di · an", "the -ian ending", "结尾是 -ian"],
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
      clues: [
        "a score better than ninety percent of test takers",
        "a baby's weight ranked at forty out of every hundred babies her age",
        "a child's height falling below the lowest five percent",
      ],
      contrast: [
        "a percentile ranks a value against all results; the median is only the middle one",
        "percentile 把一个值放在全部结果中排名；median 只是中间那个",
      ],
      conflicts: [
        [
          "median is the one middle value, the fiftieth point only, not a value tied to any chosen percentage",
          "median 只是中间值，即第五十百分位，不是任意百分比对应的值",
        ],
        [
          "margin is how far a result could be off, or how far apart two numbers are, not a rank against other results",
          "margin 是结果可能的误差或两个数之间的差额，不是与其他结果比较的排名",
        ],
      ],
      spelling: ["per · cen · tile", "*percent* plus -ile", "*percent* 加 -ile"],
    },
    {
      word: "sample",
      forms: ["samples"],
      meaning: ["a smaller group chosen from a larger one to represent it in a study", "样本，从较大群体中选出以代表它的较小群体"],
      sentences: [
        "The survey's ___ was only two hundred people, all from one city.",
        "Drawing the ___ at random gives every member of the population an equal chance of being picked.",
        "From each well, the researchers took one ___ of water to test for lead.",
      ],
      confusions: ["distribution", "outlier"],
      clues: [
        "two hundred people from one city chosen for a survey",
        "a group chosen so every member of a population had an equal chance",
        "water taken from each well to test for lead",
      ],
      contrast: [
        "a sample is a group chosen to stand for the whole; an outlier is one value far from the rest",
        "sample 是代表整体而选出的群体；outlier 是远离其他值的一个值",
      ],
      conflicts: [
        [
          "distribution is how values are spread across a range, not the group chosen to stand for a population",
          "distribution 是数值在范围内的分布方式，不是代表总体而选出的群体",
        ],
        ["outlier is one value far from the rest, not a group chosen for study", "outlier 是远离其他值的一个值，不是选来研究的群体"],
      ],
      spelling: ["sam · ple", "the -ple ending", "结尾是 -ple"],
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
      clues: [
        "a three-point possible error that makes a two-point lead uncertain",
        "an election won by forty votes",
        "a possible error too large for firm conclusions",
      ],
      contrast: [
        "a margin is a gap or a possible error; a proportion is a share of a whole",
        "margin 是差额或可能的误差；proportion 是在整体中所占的份额",
      ],
      conflicts: [
        [
          "proportion is a part compared with its whole, not the amount a result may be off or one number exceeds another",
          "proportion 是部分与整体之比，不是结果可能的误差或一个数超出另一个数的量",
        ],
        ["trend is a direction of change over time, not a gap between two numbers", "trend 是随时间变化的方向，不是两个数之间的差距"],
      ],
      spelling: ["mar · gin", "the g that sounds like j, and the -in ending", "g 读作 j，结尾是 -in"],
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
      clues: [
        "the share of students who walk to school falling from a half to a fifth",
        "about one patient in twenty reporting side effects",
        "the share of income that goes on rent",
      ],
      contrast: [
        "a proportion is a share of a whole; a probability is a chance that something will happen",
        "proportion 是在整体中所占的份额；probability 是某事发生的可能性",
      ],
      conflicts: [
        [
          "probability is how likely something is to happen, not the share of a group that already did it",
          "probability 是某事发生的可能性，不是群体中已经这样做的人所占的份额",
        ],
        [
          "percentile ranks a value against all results, not a share of a whole",
          "percentile 是把某个值放在全部结果中排名，不是在整体中的份额",
        ],
      ],
      spelling: ["pro · por · tion", "pro- plus *portion*", "pro- 加 *portion*"],
    },
    {
      word: "trend",
      forms: ["trends"],
      meaning: ["the general direction in which something changes over time", "趋势，事物随时间变化的总体方向"],
      sentences: [
        "The ___ is clear: over twenty years, fewer people have bought newspapers each year.",
        "One cold winter does not reverse a long-term warming ___.",
        "The chart shows bicycle use climbing in a steady ___ since the new lanes opened.",
      ],
      confusions: ["distribution", "margin"],
      clues: [
        "fewer people buying newspapers every year for twenty years",
        "a long-term warming that one cold winter does not reverse",
        "bicycle use rising since new lanes opened",
      ],
      contrast: [
        "a trend is a direction over time; a distribution is a spread at one time",
        "trend 是随时间变化的方向；distribution 是某一时刻的分布",
      ],
      conflicts: [
        [
          "distribution is how values are spread at one time, not the direction they move over years",
          "distribution 是数值在某一时刻的分布，不是它们多年来的走向",
        ],
        [
          "margin is a gap between numbers or a possible error, not a general direction of change",
          "margin 是两数之差或可能的误差，不是总体的变化方向",
        ],
      ],
      spelling: ["trend", "the -nd ending", "结尾是 -nd"],
    },
    {
      word: "outlier",
      forms: ["outliers"],
      meaning: ["a value far from all the others in a set of data", "离群值，与一组数据中其他值相差很远的值"],
      sentences: [
        "One student scored 2 while everyone else scored above 70; that ___ pulled the class average down.",
        "Before drawing conclusions, check whether a single ___ is distorting the results.",
        "The town with ten times the national rate is the ___ that deserves a closer look.",
      ],
      confusions: ["median", "sample"],
      clues: [
        "one score of 2 among scores above 70 pulling an average down",
        "a single value that may distort the results",
        "a town with ten times the national rate",
      ],
      contrast: ["an outlier lies far from the rest; the median sits in the middle", "outlier 远离其他值；median 位于正中"],
      conflicts: [
        ["median is the middle value, the opposite of a value far from all the others", "median 是中间值，恰恰与远离其他值的数相反"],
        [
          "sample is a group chosen to stand for a population, not one value that lies far from the rest",
          "sample 是代表总体而选出的群体，不是远离其他值的一个值",
        ],
      ],
      spelling: ["out · li · er", "*out* plus *lie* plus -r", "*out* 加 *lie* 再加 r"],
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
      clues: [
        "incomes spread unevenly, with a few earning a great deal and most far less",
        "a bell shape with most values in the middle and few at the ends",
        "rainfall spread across a country from desert to rainforest",
      ],
      contrast: [
        "a distribution is how values are spread; a proportion is one part of the whole",
        "distribution 是数值的分布方式；proportion 是整体中的某一部分",
      ],
      conflicts: [
        [
          "trend is a direction of change over time, not the spread of values across a range",
          "trend 是随时间变化的方向，不是数值在范围内的分布",
        ],
        [
          "proportion is one part compared with the whole, not how all the values are spread",
          "proportion 是某一部分与整体之比，不是全部数值的分布方式",
        ],
      ],
      spelling: ["dis · tri · bu · tion", "*distribute* with the e dropped before -ion", "*distribute* 去掉 e 再加 -ion"],
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
      clues: [
        "the one-in-six chance of rolling a six with a fair die",
        "a high chance of rain by evening",
        "a seat belt lowering the chance of serious injury in a crash",
      ],
      contrast: [
        "a probability is a chance that something will happen; a proportion is a share that already exists",
        "probability 是某事将会发生的可能性；proportion 是已有的份额",
      ],
      conflicts: [
        [
          "proportion is a share of a whole that already exists, not how likely something is to happen",
          "proportion 是整体中已有的份额，不是某事发生的可能性",
        ],
        [
          "percentile ranks a result against others, not the chance of an event",
          "percentile 是把结果与其他结果比较排名，不是某件事发生的概率",
        ],
      ],
      spelling: ["prob · a · bil · i · ty", "*probable* with -ble turned into -bility", "*probable* 的 -ble 变成 -bility"],
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
        "The researchers found no statistically ___ link between screen time and grades.",
      ],
      confusions: ["fortuitous", "scholarly"],
      clues: [
        "a difference between two groups that is unlikely to be chance",
        "a large difference that may still fail a test with only ten people per group",
        "no link between screen time and grades that passes a statistical test",
      ],
      contrast: [
        "significant means unlikely to be chance; fortuitous means happening by chance",
        "significant 指不太可能出于偶然；fortuitous 指出于偶然",
      ],
      conflicts: [
        [
          "fortuitous means happening by chance, the opposite of a result a test shows is unlikely to be chance",
          "fortuitous 是出于偶然，恰恰与经检验不太可能出于偶然的结果相反",
        ],
        [
          "scholarly describes writing by experts for experts, not a result that passes a statistical test",
          "scholarly 形容专家为专家写的文章，不是通过统计检验的结果",
        ],
      ],
      spelling: ["sig · nif · i · cant", "the -cant ending, not -cent", "结尾是 -cant，不是 -cent"],
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
  intro: t(
    "At Monday's meeting, the first item on the **agenda** was the project **budget**, and the manager asked each **colleague** to **prioritize** the tasks due before Friday's **deadline**. These words help you plan, share and report work in a team.",
    "周一的会上，议程（**agenda**）的第一项是项目预算（**budget**），经理请每位同事（**colleague**）把周五截止日期（**deadline**）前要完成的任务排出先后（**prioritize**）。这些词帮你在团队中规划、分工和汇报工作。",
  ),
  watchOut: {
    meanings: t(
      "A **colleague** works alongside you, while a **stakeholder** is anyone with an interest in the decision; a patient is a stakeholder in a hospital's plans, but not a colleague of its nurses.",
      "**colleague** 是和你一起工作的人，**stakeholder** 是与决定有利害关系的任何人；病人是医院规划的 stakeholder，却不是护士的 colleague。",
    ),
    use: t(
      "You **delegate** a task *to* someone, you **collaborate** *with* someone, and you **prioritize** one thing *over* another; the little word after each verb is a clue.",
      "**delegate** 任务 *to* 某人，**collaborate** *with* 某人，**prioritize** 一件事 *over* 另一件；每个动词后面的小词就是线索。",
    ),
    spelling: t(
      "**Colleague** and **collaborate** both double the l, **budget** spells its j sound dg, and **deliverable** is deliver plus -able.",
      "**colleague** 和 **collaborate** 都双写 l；**budget** 用 dg 拼 j 音；**deliverable** 是 deliver 加 -able。",
    ),
  },
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
      clues: [
        "five o'clock on Friday, after which late forms will not be read",
        "the due date pushed back a week when the printer broke",
        "the time limit you should warn your manager about early if you cannot meet it",
      ],
      contrast: [
        "a deadline is when work is due; a deliverable is the work itself",
        "deadline 是工作截止的时间；deliverable 是要交付的成果本身",
      ],
      conflicts: [
        [
          "agenda is a list of topics for a meeting, not the latest time by which work is due",
          "agenda 是会议的议题列表，不是工作必须完成的最后时间",
        ],
        ["deliverable is the finished product handed over, not the time it is due", "deliverable 是交付的成品，不是它的截止时间"],
      ],
      spelling: ["dead · line", "*dead* plus *line*", "*dead* 加 *line*"],
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
      clues: [
        "everyone from parents to cleaners invited to comment on a school plan",
        "groups affected by a city's decision to close a clinic",
        "the people a proposal must name and explain the project's meaning for",
      ],
      contrast: [
        "a stakeholder is anyone affected by a decision; a colleague is someone you work with",
        "stakeholder 是受决定影响的任何人；colleague 是一起工作的人",
      ],
      conflicts: [
        [
          "colleague is someone you work with, not anyone with an interest in a decision, such as a parent or a patient",
          "colleague 是一起工作的人，不是像家长或病人那样与决定有利害关系的任何人",
        ],
        [
          "deliverable is a finished product a project hands over, not a person or group affected by it",
          "deliverable 是项目交付的成品，不是受项目影响的个人或群体",
        ],
      ],
      spelling: ["stake · hold · er", "*stake*, *hold* and -er", "*stake*、*hold* 加 -er"],
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
      clues: [
        "next year's budget as the first point to discuss at a meeting",
        "topics sent by Monday so the meeting's list can be prepared",
        "the last point a meeting ran out of time to reach",
      ],
      contrast: [
        "an agenda lists what a meeting will discuss; a deadline is when work is due",
        "agenda 列出会议要讨论的事项；deadline 是工作截止时间",
      ],
      conflicts: [
        [
          "deadline is the latest time work is due, not a list of points for a meeting",
          "deadline 是工作必须完成的最后时间，不是会议的议题列表",
        ],
        [
          "feedback is comments on how well someone did, not a list of topics to discuss",
          "feedback 是对别人表现的评价，不是要讨论的议题列表",
        ],
      ],
      spelling: ["a · gen · da", "the g that sounds like j, and the -a ending", "g 读作 j，结尾是 -a"],
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
      clues: [
        "a report on the current system due in March",
        "each finished product listed in a contract with its due date",
        "a working website and a training guide handed to a client",
      ],
      contrast: [
        "a deliverable is a finished product handed over; a budget is a plan for money",
        "deliverable 是交付的成品；budget 是资金计划",
      ],
      conflicts: [
        ["budget is a plan for spending money, not a finished product handed over", "budget 是花钱的计划，不是交付的成品"],
        ["agenda is a list of points for a meeting, not something a project produces", "agenda 是会议的议题列表，不是项目产出的成果"],
      ],
      spelling: ["de · liv · er · a · ble", "*deliver* plus -able", "*deliver* 加 -able"],
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
      clues: [
        "a project going over its planned spending when steel prices rose",
        "two thousand dollars planned for a trip, food included",
        "a library's money cut by a tenth",
      ],
      contrast: ["a budget is a plan for money; a deadline is a point in time", "budget 是资金计划；deadline 是时间点"],
      conflicts: [
        ["deliverable is a finished product, not a plan for money", "deliverable 是成品，不是资金计划"],
        ["deadline is a point in time, not an amount of money set aside for spending", "deadline 是一个时间点，不是留出来花的钱"],
      ],
      spelling: ["bud · get", "the dg that sounds like j", "dg 读作 j"],
    },
    {
      word: "colleague",
      forms: ["colleagues"],
      meaning: ["a person you work with", "同事"],
      sentences: [
        "I asked one ___ in the finance team to check my figures.",
        "She thanked each ___ who had covered her shifts while she was ill.",
        "One ___ from the Paris office will join the call.",
      ],
      confusions: ["stakeholder", "agenda"],
      clues: [
        "someone on the finance team asked to check figures",
        "coworkers who covered shifts during an illness",
        "someone from the Paris office joining a call",
      ],
      contrast: [
        "a colleague works alongside you; a stakeholder is anyone affected by a decision",
        "colleague 是一起工作的人；stakeholder 是受决定影响的任何人",
      ],
      conflicts: [
        [
          "stakeholder is anyone with an interest in a decision, not specifically a person you work alongside",
          "stakeholder 是与决定有利害关系的任何人，不特指和你一起工作的人",
        ],
        ["agenda is a list of meeting topics, not a person", "agenda 是会议议题列表，不是人"],
      ],
      spelling: ["col · league", "the double l, and the -league ending with a silent ue", "双写 l，结尾是 -league，ue 不发音"],
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
      clues: [
        "advice after a first presentation to slow down and use fewer slides",
        "comments collected from customers after every order",
        "specific comments that help more than a vague good job",
      ],
      contrast: [
        "feedback is comments on someone's work; an agenda is a list of meeting topics",
        "feedback 是对工作的评价；agenda 是会议议题列表",
      ],
      conflicts: [
        ["agenda is a list of topics for a meeting, not comments on someone's work", "agenda 是会议的议题列表，不是对别人工作的评价"],
        ["budget is a plan for money, not advice on how to improve", "budget 是资金计划，不是如何改进的建议"],
      ],
      spelling: ["feed · back", "*feed* plus *back*, written as one word", "*feed* 加 *back*，合写为一个词"],
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
      clues: [
        "two departments working together on a training program",
        "writers working together on one report agreeing on a style",
        "working closely with schools to design each course",
      ],
      contrast: [
        "collaborate means working together; delegate means handing work to someone else",
        "collaborate 是一起工作；delegate 是把工作交给别人",
      ],
      conflicts: [
        ["delegate means to hand your work to someone else, not to work on it together", "delegate 是把自己的工作交给别人，不是一起完成"],
        ["prioritize means to decide what to do first, not to work jointly with others", "prioritize 是决定先做什么，不是与人合作"],
      ],
      spelling: ["col · lab · o · rate", "the double l, as in *colleague*", "双写 l，同 *colleague*"],
    },
    {
      word: "delegate",
      forms: ["delegates", "delegated", "delegating"],
      meaning: ["to give part of your work or responsibility to someone else", "委派，把部分工作或职责交给他人"],
      sentences: [
        "A good manager knows which tasks to ___ and which to do herself.",
        "She decided to ___ the scheduling to her assistant.",
        "If you never ___ any task to your team, you will spend your days on work others could do.",
      ],
      confusions: ["collaborate", "prioritize"],
      clues: [
        "a manager choosing which tasks to hand to others and which to keep",
        "handing the scheduling to an assistant",
        "never handing tasks to a team and doing work others could do",
      ],
      contrast: [
        "delegate hands work to someone else; collaborate shares the work with them",
        "delegate 把工作交给别人；collaborate 和别人一起做",
      ],
      conflicts: [
        ["collaborate means to work on a task together, not to hand it over", "collaborate 是一起完成任务，不是把任务交出去"],
        [
          "prioritize means to rank tasks and do the urgent ones first, not to give them to someone else",
          "prioritize 是给任务排序、先做急事，不是把任务交给别人",
        ],
      ],
      spelling: ["del · e · gate", "the -gate ending", "结尾是 -gate"],
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
      clues: [
        "ten requests and one afternoon, so the urgent ones come first",
        "a hospital treating the most seriously injured first",
        "a team putting safety ahead of speed",
      ],
      contrast: [
        "prioritize means deciding what comes first; delegate means handing it to someone else",
        "prioritize 是决定先后；delegate 是交给别人做",
      ],
      conflicts: [
        ["delegate means to give work to someone else, not to decide which matters most", "delegate 是把工作交给别人，不是决定哪件最重要"],
        ["collaborate means to work together, not to rank tasks by importance", "collaborate 是一起工作，不是按重要性给任务排序"],
      ],
      spelling: ["pri · or · i · tize", "*priority* with -ity turned into -itize", "*priority* 的 -ity 变成 -itize"],
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
  intro: t(
    "The proposal set one clear **objective**, to open the library on weekends, explained its **rationale** in a single page, and showed that the plan was **feasible** with the money already raised. These words help you plan a project and make the case for supporting it.",
    "这份提案定下一个明确的目标（**objective**）——周末开放图书馆，用一页纸说明了理由（**rationale**），并证明用已筹到的钱这个计划是可行的（**feasible**）。这些词帮你规划项目，并说明它为什么值得支持。",
  ),
  watchOut: {
    meanings: t(
      "**Feasible** means a plan can be done at all, while **sustainable** means it can keep going after the start; a weekly newsletter may be feasible this year but not sustainable without new money.",
      "**feasible** 指计划根本做得成，**sustainable** 指它开始后能长期维持；周报今年也许 feasible，但没有新资金就不 sustainable。",
    ),
    use: t(
      "The **objective** is what a plan aims at, the **rationale** is why it is needed, and the **scope** is how much it covers; ask whether the sentence names an aim, a reason or a range.",
      "**objective** 是计划要达到的目标，**rationale** 是为什么需要它，**scope** 是它涵盖多大范围；看句子说的是目标、理由还是范围。",
    ),
    spelling: t(
      "**Allocate** doubles the l, **feasible** ends in -ible, and **sustainable** is sustain plus -able.",
      "**allocate** 双写 l；**feasible** 结尾是 -ible；**sustainable** 是 sustain 加 -able。",
    ),
  },
  domain: ["plans, proposals and projects", "计划、提案和项目"],
  prerequisites: ["context-clues"],
  encompasses: fromClues,
  words: [
    {
      word: "feasible",
      forms: ["feasibility"],
      meaning: ["possible to do in practice, with the time and money available", "可行的，在现有时间和资金下能够做到的"],
      sentences: [
        "With only three staff, the team found it was not even ___ to print the first issue of a daily newsletter.",
        "The engineers studied whether a tunnel under the river was ___ to build at all with the money available.",
        "The plan can be carried out this year, so it is ___: the school already owns the land and has the money to build.",
      ],
      confusions: ["sustainable", "significant"],
      clues: [
        "three staff unable even to print a daily newsletter's first issue",
        "whether a river tunnel could be built at all with the money available",
        "a plan that can be carried out this year because the land and money are ready",
      ],
      contrast: ["feasible means it can be done; sustainable means it can keep going", "feasible 指做得成；sustainable 指能长期维持"],
      conflicts: [
        [
          "sustainable means able to keep going for a long time, not possible to do in the first place",
          "sustainable 是能长期维持，不是一开始就做得成",
        ],
        [
          "significant means a result is unlikely to be chance, not that a plan can be done",
          "significant 是结果不太可能出于偶然，不是计划做得成",
        ],
      ],
      spelling: ["fea · si · ble", "the ea, and the -ible ending", "ea 组合，结尾是 -ible"],
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
      clues: [
        "cutting a school's energy use by a fifth in two years",
        "an aim specific enough to tell when it has been reached",
        "every child in a village reading by the age of eight",
      ],
      contrast: ["an objective is the aim; a rationale is the reason behind it", "objective 是目标；rationale 是背后的理由"],
      conflicts: [
        ["rationale is the reasons behind a plan, not the aim it sets out to reach", "rationale 是计划背后的理由，不是它要达到的目标"],
        ["scope is the range a project covers, not the result it aims for", "scope 是项目涵盖的范围，不是它追求的结果"],
      ],
      spelling: ["ob · jec · tive", "*object* plus -ive", "*object* 加 -ive"],
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
      clues: [
        "a town library that closes before most adults finish work",
        "reviewers wondering why a project is needed at all",
        "a rise in accidents near a school gate behind a new rule",
      ],
      contrast: [
        "a rationale is why a plan is needed; an objective is what it aims to achieve",
        "rationale 是为什么需要计划；objective 是计划要达成什么",
      ],
      conflicts: [
        ["objective is the aim a plan sets out to reach, not the reasons it is needed", "objective 是计划要达到的目标，不是需要它的理由"],
        [
          "milestone is a stage used to measure progress, not the reasoning behind a plan",
          "milestone 是衡量进度的阶段，不是计划背后的理由",
        ],
      ],
      spelling: ["ra · tion · ale", "*rational* plus a final e", "*rational* 后加 e"],
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
      clues: [
        "the end of a survey in March and a draft report in May",
        "each stage celebrated from the first test to opening day",
        "every stage listed with a date so a funder can check progress",
      ],
      contrast: [
        "a milestone is one stage along the way; the scope is the whole range covered",
        "milestone 是途中的一个阶段；scope 是涵盖的整个范围",
      ],
      conflicts: [
        ["scope is the range a project covers, not a stage along the way", "scope 是项目涵盖的范围，不是途中的某个阶段"],
        ["rationale is the reasons for a plan, not a point that marks progress", "rationale 是计划的理由，不是标志进度的节点"],
      ],
      spelling: ["mile · stone", "*mile* plus *stone*", "*mile* 加 *stone*"],
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
      clues: [
        "a study limited to schools in one district",
        "a second city widening a project beyond its budget",
        "agreeing what a report will cover and leave out",
      ],
      contrast: [
        "the scope is what a project covers; a milestone is one stage of it",
        "scope 是项目涵盖的范围；milestone 是其中的一个阶段",
      ],
      conflicts: [
        [
          "milestone is one stage marking progress, not the full range a project covers",
          "milestone 是标志进度的一个阶段，不是项目涵盖的整个范围",
        ],
        [
          "rationale is why a project is needed, not what it covers and leaves out",
          "rationale 是为什么需要这个项目，不是它涵盖和不涵盖哪些内容",
        ],
      ],
      spelling: ["scope", "the silent e that makes the o long", "末尾 e 不发音，使 o 发长音"],
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
      clues: [
        "a council dividing a grant between books and longer hours",
        "setting aside two hours each week for training new staff",
        "a school dividing a small budget between repairs and supplies",
      ],
      contrast: [
        "allocate sets resources aside for a purpose; implement puts a plan into action",
        "allocate 为特定用途划拨资源；implement 把计划付诸实施",
      ],
      conflicts: [
        [
          "mitigate means to make a harm less severe, not to divide money or time among uses",
          "mitigate 是减轻危害，不是把钱或时间分配给不同用途",
        ],
        [
          "implement means to put a plan into action, not to set aside resources for a purpose",
          "implement 是把计划付诸实施，不是为某种用途划拨资源",
        ],
      ],
      spelling: ["al · lo · cate", "the double l", "双写 l"],
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
      clues: [
        "comparing test scores before and after a program",
        "a panel judging each proposal on cost, plan and benefit",
        "an outside expert judging results so the judgment is fair",
      ],
      contrast: ["evaluate judges how well something works; allocate sets resources aside", "evaluate 判断效果好坏；allocate 划拨资源"],
      conflicts: [
        [
          "allocate means to set aside money or time, not to judge how well something works",
          "allocate 是划拨资金或时间，不是判断某事的效果",
        ],
        ["mitigate means to lessen a harm, not to judge quality", "mitigate 是减轻危害，不是评判好坏"],
      ],
      spelling: ["e · val · u · ate", "*value* with the e dropped, plus -ate", "*value* 去掉 e，再加 -ate"],
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
      confusions: ["feasible", "significant"],
      clues: [
        "a garden whose vegetable sales will pay for its seeds and water",
        "fishing at a rate that will collapse the stocks within a decade",
        "projects that can carry on after a grant ends",
      ],
      contrast: [
        "sustainable means it can keep going; feasible means it can be done at all",
        "sustainable 指能长期维持；feasible 指做得成",
      ],
      conflicts: [
        ["feasible means possible to do at all, not able to keep going for years", "feasible 是根本做得成，不是能维持多年"],
        [
          "significant describes a result unlikely to be chance, not a plan that can last",
          "significant 形容不太可能出于偶然的结果，不是能长久维持的计划",
        ],
      ],
      spelling: ["sus · tain · a · ble", "*sustain* plus -able", "*sustain* 加 -able"],
    },
    {
      word: "mitigate",
      forms: ["mitigates", "mitigated", "mitigating", "mitigation"],
      meaning: ["to make a harm or risk less severe", "减轻，缓解（危害或风险）"],
      sentences: [
        "Trees along the street ___ the heat of summer by shading the pavement.",
        "The proposal lists each risk and how the team will ___ it, making the harm smaller if it happens.",
        "To ___ the risk of flooding, the city raised the river walls.",
      ],
      confusions: ["allocate", "evaluate"],
      clues: [
        "street trees lessening summer heat by shading the pavement",
        "a plan to make the harm smaller if a listed risk happens",
        "raised river walls lessening the risk of flooding",
      ],
      contrast: ["mitigate makes a harm smaller; evaluate judges how well something works", "mitigate 减轻危害；evaluate 判断效果"],
      conflicts: [
        [
          "allocate means to set aside money or people for a purpose, not to make a harm smaller",
          "allocate 是为某种用途划拨资金或人员，不是减轻危害",
        ],
        ["evaluate means to judge how well something works, not to reduce a risk", "evaluate 是判断某事效果如何，不是降低风险"],
      ],
      spelling: ["mit · i · gate", "the -gate ending", "结尾是 -gate"],
    },
    {
      word: "implement",
      forms: ["implements", "implemented", "implementing", "implementation"],
      meaning: ["to put a plan or decision into action", "实施，执行（计划或决定）"],
      sentences: [
        "The school will ___ the new timetable in September, when every class starts following it.",
        "It is easy to write a policy and much harder to ___ it, turning the words on paper into daily practice.",
        "The city needs two years to ___ the plan, putting it into action in every district.",
      ],
      confusions: ["evaluate", "allocate"],
      clues: [
        "a new timetable that every class starts following in September",
        "a policy turned from words on paper into daily practice",
        "a plan put into action in every district over two years",
      ],
      contrast: [
        "implement puts a plan into action; evaluate judges how well it worked",
        "implement 把计划付诸实施；evaluate 判断它的效果",
      ],
      conflicts: [
        ["evaluate means to judge how well something works, not to put it into action", "evaluate 是判断某事效果如何，不是把它付诸实施"],
        ["allocate means to set aside money or time, not to carry out a plan", "allocate 是划拨资金或时间，不是执行计划"],
      ],
      spelling: ["im · ple · ment", "*im*, *ple* and -ment", "*im*、*ple* 加 -ment"],
    },
  ],
};

const batches: readonly BatchSpec[] = [discourse, research, evidence, argument, misused, statistics, workplace, planning];

const pool = wordPool(batches);

/** wordTopicsCollege are the vocabulary topics of the college writing course. */
export const wordTopicsCollege: readonly TopicDef[] = batches.map((b) => batchTopicWithPool(b, pool));

/** vocabularyCollege are the words the batches of the college writing course teach. */
export const vocabularyCollege: readonly WordBatch[] = batches.map(batchWords);
