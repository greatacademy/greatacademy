// The language topic of the senior required course (docs/chinese-curriculum.md §18.9), after the task group of language
// accumulation and sorting of the senior standard: the sense of a word in its context and the register that fits the
// occasion, and the choice of sentence pattern, order and joining. The questions are written for this subject.

import { t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { choiceTopicGenerator, listedChoices } from "./choice-kit.ts";

/** WORDS are the questions of what a word means in its context, old senses against new, and which register fits. */
const WORDS = `
“他是个很有分寸的人，说话从不让人难堪”中的“分寸”是什么意思？ ~ What does 分寸 mean in this sentence? | 说话做事恰当的限度 | 后半句“说话从不让人难堪”说明他知道话说到哪里为止 ~ the second half, never embarrassing anyone, shows he knows where to stop | 长度单位分和寸 | 这是字面意思，放进句子讲不通 ~ that is the literal sense, which does not fit the sentence | 做事很慢 | 句子说的是说话得当，不是快慢 ~ the sentence is about speaking fitly, not about speed
“这篇文章写得很有味道”中的“味道”指什么？ ~ What does 味道 mean of an essay? | 耐人寻味的意趣 | 文章不能吃，这里是借味觉说读起来让人回味 ~ an essay is not eaten: taste is borrowed for what lingers in reading | 食物的滋味 | 这是本义，用在文章上讲不通 ~ that is the root sense, which does not fit an essay | 气味很重 | 句子是在称赞文章，不是说它有气味 ~ the sentence praises the essay, not its smell
“他在会上放了一炮，大家都愣住了”中的“放了一炮”是什么意思？ ~ What does 放了一炮 mean here? | 发表了尖锐、出人意料的意见 | “在会上”“大家都愣住了”说明是说了让人吃惊的话 ~ at a meeting, leaving all stunned: he said something startling | 点了一个鞭炮 | 会上不会放鞭炮，这是字面意思 ~ no one sets off firecrackers at a meeting: that is literal | 开了一枪 | 句子没有写到打枪，讲不通 ~ nothing in the sentence speaks of a gun
下列句子中，“消息”用的是古义的一项是： ~ In which sentence does 消息 bear its old sense? | 酌酒花前，静观天地消息 | 这里是消长、盛衰变化的意思，不是今天的“新闻” ~ here it is waxing and waning, not today's news | 他一直没有家里的消息 | 这是今天常用的意思：音信 ~ this is today's sense: word from someone | 电视里播出了一条重要消息 | 这是今天常用的意思：新闻 ~ this is today's sense: a news item
下列句子中，“牺牲”用的是古义的一项是： ~ In which sentence does 牺牲 bear its old sense? | 牺牲玉帛，弗敢加也 | 古义是祭祀用的牲畜，和“玉帛”并列都是祭品 ~ the old sense is beasts offered in sacrifice, beside jade and silk as offerings | 他为保护群众英勇牺牲 | 这是今义：为正义献出生命 ~ this is the new sense: to give one's life | 她牺牲了休息时间来帮我 | 这是今义的引申：舍弃 ~ this extends the new sense: to give up
写给校长的建议信，下面哪一句最得体？ ~ In a letter of proposal to the head teacher, which line fits best? | 恳请学校考虑延长图书馆的开放时间 | 用“恳请”“考虑”，语气诚恳又礼貌，合乎书面语体 ~ 恳请 and 考虑 are earnest and polite, fit for written register | 图书馆关门太早了，赶紧改改吧 | 口气太随便，像对朋友说话 ~ too casual, as if to a friend | 学校必须马上延长图书馆开放时间 | 用“必须”“马上”命令校长，不礼貌 ~ 必须 and 马上 order the head about: impolite
在新闻报道中，下面哪一句的用语最恰当？ ~ In a news report, which line is best worded? | 事故造成三人受伤，伤者已被送往医院 | 客观、准确，是新闻的书面语体 ~ objective and exact, the written register of news | 太惨了，三个人都伤得不轻 | 带着强烈的感情，不像新闻的客观报道 ~ heavy with feeling, not objective reporting | 听说有几个人好像受了点伤 | “听说”“好像”不准确，新闻要写确实的事 ~ hearsay and “seems” are inexact; news states what is certain
同学聚会上致辞，下面哪一句最得体？ ~ Speaking at a class reunion, which line fits best? | 今天大家又聚在一起，真像回到了当年的教室 | 亲切自然，适合老同学的场合 ~ warm and natural, right among old classmates | 兹定于今日召开同学聚会，望各位准时出席 | 公文的语体，太生硬，不合聚会的气氛 ~ the register of an official notice, too stiff for a reunion | 我宣布，聚会正式开始，请大家保持安静 | 像开会的口气，不够亲切 ~ the tone of a meeting, not warm enough
下列词语中，属于书面语的一项是： ~ Which of these is written register? | 逝世 | 这是庄重的书面语，多用于正式场合 ~ a solemn written word, used on formal occasions | 走了 | 这是口语里委婉的说法 ~ this is a gentle spoken way of saying it | 没了 | 这是口语的说法 ~ this is the spoken way
“这个方案还很粗糙，需要再打磨”中的“打磨”是什么意思？ ~ What does 打磨 mean of a plan? | 反复修改、完善 | 方案不是器物，这里借“打磨”说把粗糙的地方改好 ~ a plan is no object: polishing is borrowed for refining it | 用砂纸把东西磨光 | 这是本义，方案不能用砂纸磨 ~ the root sense: a plan cannot be sanded | 打碎以后再磨 | 句中没有“打碎”的意思，讲不通 ~ nothing is smashed in the sentence
下列句子中，“走”用的是古义的一项是： ~ In which sentence does 走 bear its old sense? | 兔走触株，折颈而死 | 兔子撞到树桩上，是跑，不是慢慢地走 ~ a hare that breaks its neck on a stump was running, not walking | 他走得很慢 | 这是今义：步行 ~ this is the new sense: to walk | 这条路走不通 | 这是今义：行走 ~ this is the new sense: to go along
“他的话里有骨头”中的“有骨头”是什么意思？ ~ What does 有骨头 mean of words? | 话里藏着不满或讥讽 | 话不会有骨头，这里借骨头说话里有硬的、刺人的东西 ~ words have no bones: bones are borrowed for something hard and pointed in them | 他在吃排骨 | 这是字面意思，讲不通 ~ the literal sense, which does not fit | 他说话很有力气 | 句子说的是话里藏着意思，不是声音大 ~ the sentence speaks of a hidden meaning, not of loudness
`;

/** SENTENCES are the questions of which pattern, order or joining fits a sentence and its context. */
const SENTENCES = `
填入横线处，与上文衔接最好的一项是：“秋天的田野是丰收的。______” ~ Which best follows “秋天的田野是丰收的”? | 稻子黄了，高粱红了，棉花白了 | 承接“丰收”，用三个整齐的短句写出各种庄稼成熟的样子 ~ it takes up the harvest in three even short clauses of ripe crops | 农民们一年的辛苦终于没有白费 | 跳到了议论，没有承接田野的景象 ~ it jumps to comment and leaves the fields | 春天播下的种子都已经发芽了 | 季节不对，和“秋天”矛盾 ~ the season is wrong: it clashes with autumn
在一段说明文里介绍一种新材料，哪一句更合适？ ~ Introducing a new material in exposition, which sentence fits? | 这种材料又轻又硬，常用来制造飞机的外壳 | 陈述句，客观准确，合乎说明的需要 ~ a plain statement, objective and exact, as exposition needs | 难道还有比这更神奇的材料吗？ | 反问带着强烈的感情，不合说明文的客观 ~ a rhetorical question is emotive, not objective | 啊，这是多么轻、多么硬的材料呀！ | 感叹句抒情，不合说明文的语体 ~ an exclamation is lyrical, not fit for exposition
下面几个句子，作为演讲的结尾最有力的一项是： ~ Which makes the strongest end to a speech? | 让我们从今天做起，从身边做起，从自己做起！ | 三个“从……做起”排比，短促有力，又发出号召 ~ three parallel “start from” clauses, brisk and strong, calling to act | 以上就是我今天要讲的，可能讲得不好 | 平淡又自谦过分，削弱了演讲的力量 ~ flat and over-modest, it weakens the speech | 关于这个问题，我们以后再慢慢讨论吧 | 拖拖拉拉，没有收住全文 ~ it trails off and does not close the speech
选出语序最恰当的一项： ~ Which has the best word order? | 我们要认真学习并且运用这些方法 | 先学习，后运用，顺序合乎事理 ~ learn, then apply: the order follows sense | 我们要认真运用并且学习这些方法 | 还没学就运用，顺序颠倒了 ~ applying before learning reverses the order | 我们要这些方法认真学习并且运用 | 宾语放到了动词前面，句子不通顺 ~ the object comes before the verb, and the sentence jars
下列句子中，没有语病的一项是： ~ Which sentence has no fault? | 通过这次活动，同学们增长了见识 | 主语“同学们”完整，句子通顺 ~ the subject 同学们 is whole and the sentence reads well | 通过这次活动，使同学们增长了见识 | “通过……使……”让句子缺少了主语 ~ 通过……使…… leaves the sentence without a subject | 通过这次活动，同学们增长了见识是很大的 | 两种说法混在了一起，句式杂糅 ~ two ways of saying it are jumbled into one
在下面的语境中，用被动句更好的一项是：“______，他心里很难过。” ~ Where does a passive suit best: “______, he felt sad”? | 他的建议被大家否定了 | 后句写“他”的感受，前句也以“他的建议”开头，叙述的对象一致 ~ the second clause is about him, so starting from his proposal keeps one subject | 大家否定了他的建议 | 意思不错，但前后叙述的对象换了，不如被动句连贯 ~ the sense is right but the subject shifts, less smooth than the passive | 他否定了大家的建议 | 意思反了，否定的人变成了他 ~ the sense is reversed: he becomes the one who rejects
把长句“我们应当继承和发扬中华民族勤劳勇敢、自强不息的优秀传统”改成短句，最恰当的一项是： ~ Which best breaks this long sentence into short ones? | 中华民族勤劳勇敢、自强不息，这是优秀的传统，我们应当继承和发扬 | 意思没变，几个短句一层一层说，更清楚 ~ the sense is kept, set out layer by layer, more clearly | 中华民族很勤劳，我们要发扬 | 漏掉了“勇敢”“自强不息”和“继承”，意思不完整 ~ it drops courage, striving and inheriting: the sense is incomplete | 我们应当继承，我们应当发扬，中华民族 | 拆得太碎，意思也不连贯 ~ broken too small, and the sense falls apart
填入横线处的关联词，最恰当的一项是：“______下雨，比赛______照常进行。” ~ Which connectives fill the blanks best? | 即使……也…… | 表示假设的让步：就算下雨，比赛也不改 ~ a supposed concession: even if it rains, the match goes on | 因为……所以…… | 下雨不是比赛照常进行的原因 ~ rain is not the reason the match goes on | 只要……就…… | 不是下雨才照常进行，条件关系讲不通 ~ the match does not go on because it rains: the condition fails
下面两句话放在一起，哪一种连接最好？“他学习很努力。他的成绩一直很好。” ~ How are these two sentences best joined? | 他学习很努力，所以成绩一直很好 | 前后是因果关系，用“所以”连起来合乎事理 ~ they stand as cause and effect, so 所以 fits | 他学习很努力，但是成绩一直很好 | “但是”表示转折，可两句意思不相反 ~ 但是 marks a contrast, yet the two do not oppose | 他学习很努力，或者成绩一直很好 | “或者”表示选择，讲不通 ~ 或者 offers a choice, which makes no sense
写景时，下面哪一句用整句写得最好？ ~ Describing a scene, which uses balanced clauses best? | 山是青的，水是绿的，天是蓝的 | 三个结构相同的短句排在一起，整齐有韵律 ~ three clauses of the same shape side by side, even and rhythmic | 山很青，水有点绿，天空呢是蓝色的 | 句式参差，读起来不整齐 ~ the clauses differ in shape and read unevenly | 青的山和绿的水还有蓝的天 | 只是一个词组，不是整齐的句子 ~ it is only a phrase, not balanced sentences
下列句子中，表意最明确的一项是： ~ Which sentence is clearest? | 三所学校的老师来参观 | 用“所”说清了是三所学校，没有歧义 ~ it makes clear there are three schools, with no ambiguity | 三个学校的老师来参观 | 可以理解为三位老师，也可以理解为三所学校，有歧义 ~ it may mean three teachers or three schools: ambiguous | 学校的三个老师来参观 | 只说三位老师，没说是几所学校的，和原意不同 ~ it says three teachers, not how many schools: not the sense meant
在一封感谢信里，下面哪一句最得体？ ~ In a letter of thanks, which line fits best? | 您的帮助，我们全家都记在心里 | 用“您”，语气真诚、谦和，合乎感谢信 ~ 您 and a sincere, modest tone suit a thank-you letter | 你帮了我们，这是你应该做的 | 把别人的帮助说成“应该”，不得体 ~ calling help “your duty” is unfitting | 我们会好好奖励你的 | 感谢不是奖励，口气居高临下 ~ thanks are not a reward; the tone talks down
`;

/** WORD_STEPS are the steps shared by the questions of words and register. */
const WORD_STEPS = {
  find: t(
    "Put each sense back into the sentence, and ask what the words around it and the occasion need.",
    "把每一种意思放回句子里，看看上下文和场合需要什么意思、什么语体。",
  ),
  check: (right: string) =>
    t(
      `Hold “${right}” against the context: its sense holds there and its register suits the occasion.`,
      `拿“${right}”对照语境：意思讲得通，语体也合乎场合。`,
    ),
};

/** SENTENCE_STEPS are the steps shared by the questions of sentence patterns. */
const SENTENCE_STEPS = {
  find: t(
    "Ask what the sentence must do where it stands: follow what comes before, keep one subject, state, persuade or show, and read clearly.",
    "想一想这个句子在这里要做什么：承接上文，保持叙述对象一致，是说明、劝说还是描写，读起来是不是清楚。",
  ),
  check: (right: string) =>
    t(
      `Hold “${right}” against the context: it joins smoothly, means one thing only, and fits its purpose.`,
      `拿“${right}”对照语境：衔接顺畅，意思明确，也合乎表达的目的。`,
    ),
};

/** HEADS are the bold headings of the two steps of a solution. */
const HEADS = {
  find: t("**Step 1: see what the context needs.**", "**第一步：看语境需要什么。**"),
  choose: t("**Step 2: choose what fits it.**", "**第二步：选出合乎语境的一项。**"),
};

/** gradeTenLanguage are the language topics of the senior required course. */
export const gradeTenLanguage: readonly GradeTopic[] = [
  {
    grade: 10,
    topic: {
      id: "language-10-usage",
      title: t("Organizing Usage: Sense, Register, Sentence", "语言梳理：词义、语体和句式"),
      summary: t(
        "What a word means in its context, how an old sense differs from a new one, which register fits an occasion, and which sentence pattern, order and joining fit what a sentence must do.",
        "词语在语境中的意思，古义和今义的不同，什么场合用什么语体，以及句子要表达什么，就该用什么句式、语序和关联词。",
      ),
      intro: t(
        "A word means what its context lets it mean. In “这个计划还缺点火候”, 火候 is not the heat under a pot but the ripeness of the plan; in “兵者，国之大事”, 兵 is war, not a soldier. The register must fit too: 敬请光临 on an invitation card, 来玩呀 to a friend.\n\nSentences are chosen like words. A report states; a speech closes on a parallel call; a passive keeps the subject one when the next clause is about it; balanced clauses suit a scene, a long sentence may be clearer broken in three. The first knowledge point asks the sense and register of words, the second the choice of sentence.",
        "词语的意思由语境决定。“这个计划还缺点火候”，“火候”不是锅下的火，而是计划成不成熟；“兵者，国之大事”，“兵”是战争，不是士兵。语体也要合适：请柬上写“敬请光临”，对朋友就说“来玩呀”。\n\n句子也和词语一样要选择。报道用陈述；演讲用排比的号召收尾；后一句说的是同一个人时，用被动句能保持叙述对象一致；写景宜用整句，一个长句拆成三个短句可能更清楚。第一个知识点问词义和语体，第二个问句式的选择。",
      ),
      prerequisites: ["revising-9"],
      encompasses: [],
      xp: 14,
      strand: "reading",
      knowledgePoints: [
        point(
          "language-10-usage-words",
          t("Sense in Context and Register", "语境中的词义和语体"),
          t(
            "First try the common sense of the word in the sentence; if it does not fit, look for a borrowed sense (温度 for writing, 消化 for knowledge), an old sense (去 to leave, 妻子 wife and children), or a set phrase that means more than its parts. Then ask whose words they are and where: news and official letters take an exact, written register; speeches to friends a warm, spoken one; a request to a superior a polite one.\n\nIn “他们俩闹别扭，谁也不理谁”, 别扭 is a falling-out, not something awkward to the hand.\n\n> **Watch out.** A literal sense is the first thing to test, not the answer: words such as 温度 and 消化 are often borrowed. And polite is not stiff: an official notice is as wrong at a reunion as slang in a letter to the head.",
            "先把词语常用的意思放进句子里试试；讲不通，就想想是不是借用的意思（用“温度”说文字，用“消化”说知识），是不是古义（“去”是离开，“妻子”是妻子和儿女），是不是一个整体表意、不能拆开理解的说法。然后看看是谁在什么场合说的：新闻和公文要准确的书面语体；对朋友说话要亲切的口语；向上级提请求要礼貌。\n\n“他们俩闹别扭，谁也不理谁”，“别扭”是闹意见，不是用手做事不顺。\n\n> **注意。** 字面意思是先要试的，不一定是答案：“温度”“消化”这样的词常常是借用的。礼貌也不等于生硬：在聚会上用公文的口气，和给校长写信用俗语一样不得体。",
          ),
          choiceTopicGenerator(listedChoices(WORDS, WORD_STEPS), HEADS),
        ),
        point(
          "language-10-usage-sentences",
          t("Choosing the Sentence", "句式的选择"),
          t(
            "Ask what the sentence must do where it stands. To follow what comes before, it takes up the last word or picture. To keep the reader on one person, it may turn passive. To state facts it is declarative; to stir, a question or a parallel call. A scene reads well in balanced clauses; a crowded long sentence may be clearer in short ones; the order follows the order of things (survey, then conclude); connectives must say the true relation (cause, contrast, concession). And one sentence must mean one thing.\n\n“他被老师叫到了办公室，心里七上八下” keeps 他 as the subject of both clauses; “老师把他叫到了办公室，心里七上八下” leaves the heart without an owner.\n\n> **Watch out.** A more striking sentence is not always better: an exclamation in exposition, or a rhetorical question in a news report, breaks its register. Choose by the context, not by ornament.",
            "要问这个句子在这里要做什么。承接上文，就要接住上文最后的词语或画面；让读者的眼光一直在一个人身上，可以用被动句；说明事实用陈述句，鼓动人心用反问或排比的号召；写景宜用整句；挤在一起的长句，拆成短句可能更清楚；语序要合乎事理（先调查，后下结论）；关联词要说出真实的关系（因果、转折、让步）。一个句子只能有一个意思。\n\n“他被老师叫到了办公室，心里七上八下”，前后两个分句的主语都是“他”；“老师把他叫到了办公室，心里七上八下”，后半句就不知道是谁的心了。\n\n> **注意。** 句子写得越醒目，不一定越好：说明文里用感叹句，新闻里用反问，都不合语体。要看语境来选，不能只图好看。",
          ),
          choiceTopicGenerator(listedChoices(SENTENCES, SENTENCE_STEPS), HEADS),
        ),
      ],
    },
  },
];
