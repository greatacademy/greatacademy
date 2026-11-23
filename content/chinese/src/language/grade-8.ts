// The inquiry topic of grade 8 (docs/chinese-curriculum.md §18.9): telling primary sources from secondary ones, and
// noting where information comes from. The questions are written for this subject.

import { t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { choiceTopicGenerator, listedChoices } from "./choice-kit.ts";

/** PRIMARY are the questions of which material is the primary source for a piece of inquiry. */
const PRIMARY = `
想研究爷爷年轻时在工厂工作的经历，哪一份是原始资料？ ~ To study Grandfather's years in a factory, which is a primary source? | 爷爷当年写的工作日记 | 日记是爷爷当时亲手写下的，是第一手的记录 ~ the diary was written by him at the time, a first-hand record | 一本介绍那个年代工厂的书 | 书是别人后来整理写成的，是间接资料 ~ the book was put together later by others, so it is secondary | 同学转述的爷爷的故事 | 转述经过了别人的口，是间接资料 ~ a retelling has passed through someone else, so it is secondary
调查本班同学每天睡多长时间，哪一份是原始资料？ ~ Surveying how long the class sleeps, which is a primary source? | 同学们亲手填写的问卷 | 问卷是被调查的人自己填的，是第一手资料 ~ the questionnaires were filled in by those surveyed themselves | 网上一篇讲中学生睡眠的文章 | 文章是别人写的，讲的也不是本班 ~ the article is someone else's and not about this class | 老师在家长会上的总结 | 总结是对情况的概括，不是原来的记录 ~ a summary sums up, and is not the record itself
想了解当年修建家乡大桥的情景，哪一份是原始资料？ ~ To learn how the home town's bridge was built, which is a primary source? | 修桥时拍下的老照片 | 照片是当时拍下的，直接记录了修桥的情景 ~ the photographs were taken at the time and record the building | 今天的旅游宣传册 | 宣传册是现在写的介绍，不是当时的记录 ~ the brochure is written now, not a record of then | 一篇介绍各地大桥的百科文章 | 百科文章是别人汇总的，是间接资料 ~ the encyclopedia article gathers others' work, so it is secondary
做完绿豆发芽实验写报告，哪一份是原始资料？ ~ Writing up a sprouting experiment, which is a primary source? | 自己每天记下的观察记录 | 观察记录是做实验时亲手记下的，是第一手资料 ~ the notes were made by hand during the experiment | 生物课本上讲种子萌发的一节 | 课本是编者写的知识，是间接资料 ~ the textbook is knowledge written by its editors, so it is secondary | 同学讲给你听的他的实验结果 | 那是别人的实验，又是转述的 ~ it is someone else's experiment, and retold
想知道小区老人对新建健身场的看法，哪一份是原始资料？ ~ To learn what the old people of the estate think of its new exercise ground, which is a primary source? | 访谈老人时录下的录音 | 录音里是老人亲口说的话，是第一手资料 ~ the recording holds their own words | 报纸上关于别的小区健身场的报道 | 报道讲的是别的地方，又经过了记者整理 ~ the report is about another place and was shaped by a journalist | 邻居说“老人们都挺满意” | 这是邻居的转述和概括，不是老人自己说的 ~ this is a neighbour's summary, not the old people's own words
研究学校的历史，哪一份是原始资料？ ~ Studying the school's history, which is a primary source? | 档案室里第一届学生的花名册 | 花名册是建校时留下的记录，是原始资料 ~ the roll was made when the school began | 新编的学校宣传片解说词 | 解说词是今天的人根据资料编写的 ~ the script was written now from other material | 一篇介绍全市中学的报道 | 报道是记者综合别处的资料写的，也不专讲本校 ~ the report gathers material from elsewhere and is not about this school alone
研究一场洪水对家乡的影响，哪一份是原始资料？ ~ Studying a flood's effect on the home town, which is a primary source? | 当年县里记录每天水位的登记表 | 登记表是洪水发生时当场记下的 ~ the register was kept day by day during the flood | 一本讲中国自然灾害的书 | 书是作者综合许多资料写成的，是间接资料 ~ the book draws together many sources, so it is secondary | 网上一段配了音乐的纪念视频 | 视频是后人剪辑制作的，是间接资料 ~ the video was edited later, so it is secondary
写一份家庭用水调查报告，哪一份是原始资料？ ~ Writing a report on a household's water, which is a primary source? | 自己每天抄下的水表读数 | 读数是自己当场记下的，是第一手的数据 ~ the readings were taken by oneself on the spot | 一篇讲全国水资源的科普文章 | 科普文章是别人写的，讲的也不是你家 ~ the article is someone else's and not about one's home | 电视新闻里报道的本市平均用水量 | 新闻是对统计结果的报道，也不是你家的数据 ~ the news reports others' figures, not one's own home
想了解一位作家怎样修改自己的作品，哪一份是原始资料？ ~ To learn how a writer revised a work, which is a primary source? | 作家留下的改过的手稿 | 手稿上的涂改是作家亲手留下的 ~ the corrections on the manuscript are the writer's own | 一篇评论这位作家的文章 | 评论是别人的看法，是间接资料 ~ a review gives someone else's view, so it is secondary | 课本上这篇作品的定稿 | 定稿只能看到改好的样子，看不出怎样修改 ~ the final text shows the result, not the revising
`;

/** SECONDARY are the questions of which material is secondary, and why primary sources matter. */
const SECONDARY = `
下面哪一份是间接资料？ ~ Which of these is a secondary source? | 一本根据许多书信写成的鲁迅传记 | 传记是作者根据原始资料整理、叙述的 ~ a biography is written by an author from primary material | 鲁迅写给朋友的一封信 | 书信是鲁迅本人亲笔写的，是原始资料 ~ the letter is in Lu Xun's own hand, so it is primary | 鲁迅当年的日记 | 日记是他当时亲手写的，是原始资料 ~ the diary was written by him at the time, so it is primary
下面哪一份是间接资料？ ~ Which of these is a secondary source? | 教科书上对唐朝历史的介绍 | 教科书是编者综合研究成果写成的 ~ a textbook is written by editors from others' research | 唐代留下来的一块石碑上的碑文 | 碑文是唐代当时刻下的，是原始资料 ~ the inscription was cut in the Tang, so it is primary | 出土的唐代账本 | 账本是唐代人当时写的，是原始资料 ~ the account book was written by people of the Tang, so it is primary
一位同学说：“这件事我是从同学的作文里看到的。”这份资料属于什么？ ~ A pupil says he read of an event in a classmate's composition. What kind of source is that? | 间接资料 | 作文是同学的转述，不是事情的第一手记录 ~ the composition retells, and is not a first-hand record | 原始资料 | 只有当事人当时留下的记录才是原始资料 ~ only a record left at the time by those involved is primary | 不能算资料 | 作文也可以当资料用，只是要说明它是间接的 ~ a composition can serve as a source, marked as secondary
为什么写研究报告时最好用上原始资料？ ~ Why is it best to use primary sources in a report? | 转述得越少，越不容易走样 | 每转述一次，都可能漏掉或改变一些内容 ~ every retelling may drop or change something | 原始资料一定比书上说得全面 | 原始资料往往只记一时一地，不一定更全面 ~ a primary source often records one time and place, and is not always fuller | 原始资料都是名人留下的 | 原始资料可以是任何当事人的记录 ~ a primary source may be the record of anyone involved
用了间接资料，最好再怎样做？ ~ Having used a secondary source, what is best to do next? | 尽量找到它依据的原始资料核对一下 | 核对原始资料，才能知道转述有没有出错 ~ checking the primary source shows whether the retelling went wrong | 把它改成原始资料写进报告 | 把间接资料说成原始资料是不诚实的 ~ passing secondary material off as primary is dishonest | 不用核对，书上写的都对 | 书上也可能有错，所以要核对 ~ books can be wrong too, so it must be checked
`;

/** CITING are the questions of noting where information comes from. */
const CITING = `
报告里引用了一本书上的数字，怎样注明出处最好？ ~ A report uses a figure from a book. How is its source best noted? | 写明书名、作者、出版社和出版年份 | 写全了这些，别人才能找到原书核对 ~ with all of these, a reader can find the book and check | 写“据资料显示” | 没有说明是什么资料，别人无法核对 ~ it does not say which source, so no one can check | 写“大家都知道” | 这不是出处，也无法核对 ~ this is no source and cannot be checked
引用网上的一篇文章，应该注明什么？ ~ Quoting an article found online, what should be noted? | 网站名称、文章题目和查阅日期 | 网上的内容会改动，写清这三项才找得到 ~ pages online change, so all three are needed to find it | 只写“来自网络” | “网络”太笼统，找不到是哪一篇 ~ “online” is too vague to find the article | 只写搜索时用的关键词 | 关键词能搜出很多文章，不能说明是哪一篇 ~ key words find many articles, not this one
直接引用书中的原话，应该怎样做？ ~ Quoting a book's own words, what should one do? | 原话加引号，并注明出处 | 引号表明是别人的话，出处说明从哪里来 ~ quotation marks show the words are another's, and the source says whose | 把原话改几个字，当作自己的话 | 改几个字仍是别人的意思，不注明就是抄袭 ~ a few changed words leave another's meaning, and without a source it is copying | 只加引号，不写出处 | 读者知道是引用，却不知道出自哪里 ~ the reader sees a quotation but not where it is from
用自己的话概括了一本书里的观点，需要注明出处吗？ ~ Having put a book's view in one's own words, must the source be noted? | 需要，因为观点是别人的 | 话是自己的，意思是别人的，也要说明来源 ~ the words are one's own but the idea is not | 不需要，已经换成了自己的话 | 换了说法，观点仍然来自那本书 ~ the idea still comes from the book | 只有引用原话才需要 | 借用别人的观点和数据，同样要注明 ~ borrowed views and figures need a source too
报告里引用了访谈中一位老人说的话，怎样注明？ ~ A report quotes an old man interviewed. How is the source noted? | 写明受访者的身份、访谈时间和地点 | 访谈也是资料，写清是谁、何时、何地说的 ~ an interview is a source too: say who, when and where | 写“有人说” | “有人”不知道是谁，无法核对 ~ “someone” cannot be checked | 不用写，因为不是书上的 | 访谈得来的话也是资料，同样要注明 ~ words from an interview are a source as well
问卷数据是自己收集的，报告里怎样说明来源？ ~ The survey figures were gathered by oneself. How is their source stated? | 在研究方法里写明调查对象、人数和时间 | 自己收集的数据，要说清是怎样得来的 ~ one's own figures need to say how they were got | 不用说明，因为是自己调查的 | 不说明方法，读者不知道数据可不可靠 ~ without the method, the reader cannot judge the figures | 写“来自网络” | 这和事实不符，数据不是从网上来的 ~ this is untrue: the figures did not come from online
一条资料只在一个不知名的网站上看到，最好怎样做？ ~ A fact appears only on one unknown website. What is best? | 再查书或可靠的网站，核对之后再用 | 来源不可靠的资料要核对，不能直接当作事实 ~ a doubtful source must be checked before it is used as fact | 直接写进报告当作事实 | 没核对就用，可能把错误写进报告 ~ using it unchecked may put an error into the report | 改成“专家说” | 编造来源是不诚实的 ~ inventing a source is dishonest
报告里用了两本书的内容，出处应该怎样写？ ~ A report draws on two books. How are the sources written? | 两本书分别注明 | 每一处内容都要能找到各自的来源 ~ each piece must lead to its own source | 只注明其中一本 | 另一本的内容就没有了来源 ~ the other book's material is left without a source | 写“参考了一些书” | 太笼统，读者找不到具体的书 ~ too vague: the reader cannot find the books
引用别人拍的照片或画的图表，应该怎样做？ ~ Using someone else's photograph or chart, what should one do? | 注明作者或来源 | 照片和图表也是别人的成果，要注明来源 ~ photographs and charts are others' work too | 不用注明，因为不是文字 | 图片、图表和文字一样，都要注明 ~ pictures and charts need a source just as words do | 把图上的署名去掉再用 | 去掉署名是侵占别人的成果 ~ removing the credit takes another's work as one's own
注明出处的主要目的是什么？ ~ What is noting sources chiefly for? | 尊重别人的成果，也让读者能核对 | 出处说明了资料从哪里来，读者可以去查 ~ it says where the material came from, so readers can look | 让报告显得更长 | 出处不是为了凑字数 ~ sources are not there to fill space | 证明自己读的书多 | 出处是为了说明来源，不是为了炫耀 ~ sources show where things came from, not how much one has read
引用《论语》里“学而时习之”这句话，怎样注明最好？ ~ Quoting 学而时习之 from the Analects, how is it best noted? | 写明出自《论语·学而》 | 写出书名和篇名，读者就能找到原文 ~ the book and chapter let the reader find it | 写“出自古书” | 古书很多，不知道是哪一部 ~ there are many old books, and this names none | 写“孔子的书” | 不准确，也没有书名和篇名 ~ it is inexact and names neither book nor chapter
`;

/** gradeEightLanguage are the inquiry topics of grade 8. */
export const gradeEightLanguage: readonly GradeTopic[] = [
  {
    grade: 8,
    topic: {
      id: "inquiry-8-sources",
      title: t("Sources and Citations", "原始资料、间接资料和注明出处"),
      summary: t(
        "Telling a primary source, a record made at the time by those involved, from a secondary one that retells or sums up, and noting where every quotation, figure and view comes from.",
        "分清原始资料和间接资料：原始资料是当事人当时留下的第一手记录，间接资料是别人转述、整理或概括的；引用的原话、数据和观点都要注明出处。",
      ),
      intro: t(
        "Every piece of information comes from somewhere. A **primary source** is a record made at the time by someone involved: a diary, a letter, a photograph, an experiment's notes, answers to your own questionnaire. A **secondary source** retells or sums up others' records: a textbook, an encyclopedia, a report, a biography.\n\nSuppose a class studies how its town's railway station was built. The station master's logbook of the opening day is primary; a magazine article about railways written last year is secondary. Whichever is used, the report says where it came from: “据《××站开站日志》记载……”. The first knowledge point tells the two kinds apart, the second notes sources.",
        "每一条资料都有来处。**原始资料**是当事人当时留下的记录：日记、书信、照片、实验记录，还有自己做的问卷的答卷。**间接资料**是对别人的记录的转述或概括：教科书、百科全书、报道、传记。\n\n比如一个班研究本地火车站是怎样建成的。站长在开站那天写的值班日志是原始资料；去年一本杂志上讲铁路的文章是间接资料。不管用哪一种，报告里都要说明它从哪里来：“据《××站开站日志》记载……”。第一个知识点分清两种资料，第二个注明出处。",
      ),
      prerequisites: ["inquiry-5-sources"],
      encompasses: [],
      xp: 12,
      strand: "reading",
      knowledgePoints: [
        point(
          "inquiry-8-sources-primary",
          t("Primary and Secondary Sources", "原始资料和间接资料"),
          t(
            "Ask two things of a source: who made it, and when. Made at the time by someone involved, a diary, a letter, a photograph, a register, a recording, one's own notes or questionnaires, it is primary. Made later by others from such records, a textbook, an encyclopedia, a news report, a biography, a retelling, it is secondary.\n\nFor a study of an old well in a village, the village's carved stone of the year it was dug is primary; a county guidebook printed this year is secondary.\n\n> **Watch out.** Old is not the same as primary: a book from fifty years ago about a war of five hundred years ago is still secondary. And secondary is not worthless; it should be checked against the primary source when one can be found.",
            "问一份资料两件事：是谁做的，什么时候做的。当事人当时留下的，比如日记、书信、照片、登记表、录音、自己的记录和问卷，是原始资料；后来别人根据这些记录写成的，比如教科书、百科全书、新闻报道、传记、转述，是间接资料。\n\n比如研究村里的一口老井，挖井那年刻下的石碑是原始资料；今年印的县里的旅游手册是间接资料。\n\n> **注意。** 年代久远不等于原始资料：五十年前写五百年前一场战争的书，仍然是间接资料。间接资料也不是没有用，只是能找到原始资料时，要拿来核对。",
          ),
          choiceTopicGenerator(
            [
              ...listedChoices(PRIMARY, {
                find: t(
                  "Ask of each material who made it and when: at the time, by someone involved, or later, by others.",
                  "问一问每份资料是谁、在什么时候做的：是当事人当时留下的，还是别人后来写的。",
                ),
                check: (right) =>
                  t(
                    `Ask of “${right}” who made it and when: it was made at the time by someone involved.`,
                    `问一问“${right}”是谁、什么时候做的：是当事人当时留下的。`,
                  ),
              }),
              ...listedChoices(SECONDARY, {
                find: t(
                  "Recall what makes a source primary: made at the time by someone involved; whatever retells or sums up is secondary.",
                  "想一想原始资料的标准：当事人当时留下的；转述、整理、概括的都是间接资料。",
                ),
                check: (right) =>
                  t(
                    `Hold “${right}” against that test: it fits what the question asks of a source.`,
                    `用这个标准衡量“${right}”：它正符合问题对资料的要求。`,
                  ),
              }),
            ],
            {
              find: t("**Step 1: ask who made it and when.**", "**第一步：问是谁、什么时候留下的。**"),
              choose: t("**Step 2: choose by that.**", "**第二步：据此作出选择。**"),
            },
          ),
        ),
        point(
          "inquiry-8-sources-citing",
          t("Citing Sources", "注明出处"),
          t(
            "Whatever is not your own, a quotation, a figure, a view, a picture, says where it is from, so precisely that a reader could find it: for a book, its title, author, publisher and year; for a web page, the site, the title and the date you read it; for an interview, who spoke, when and where; for a classic, the book and chapter. Quotations keep their words and take quotation marks; your own data say in the method how they were gathered.\n\n“据《中国气象年鉴》（某年版）记载，这一年本市降水量……” lets a reader check; “据说这一年雨很多” does not.\n\n> **Watch out.** Putting another's view in your own words does not make it yours: it still needs its source. And never invent a source, such as “专家说”, to make a doubtful fact look certain.",
            "凡不是自己的东西，原话、数据、观点、图片，都要说明来源，写得让读者能找到：书要写书名、作者、出版社和年份；网页要写网站、题目和查阅日期；访谈要写谁说的、什么时间、什么地点；古书要写书名和篇名。原话不能改，要加引号；自己的数据，要在研究方法里说清是怎样得来的。\n\n“据《中国气象年鉴》（某年版）记载，这一年本市降水量……”读者可以核对；“据说这一年雨很多”就没法核对。\n\n> **注意。** 用自己的话说出别人的观点，观点也不会变成自己的，同样要注明出处。更不能编造出处，比如写“专家说”，让一条不可靠的说法显得很可靠。",
          ),
          choiceTopicGenerator(
            listedChoices(CITING, {
              find: t(
                "Ask what a reader would need to find this material again, and whether it is honest about whose it is.",
                "想一想读者要靠什么才能重新找到这份资料，这样写是不是如实说明了它是谁的。",
              ),
              check: (right) =>
                t(
                  `With “${right}”, a reader knows whose the material is and could go and check it.`,
                  `按“${right}”去做，读者知道资料是谁的，也能自己去核对。`,
                ),
            }),
            {
              find: t("**Step 1: ask what a reader needs to check it.**", "**第一步：想想读者要核对需要什么。**"),
              choose: t("**Step 2: choose the honest, complete way.**", "**第二步：选出如实、完整的做法。**"),
            },
          ),
        ),
      ],
    },
  },
];
