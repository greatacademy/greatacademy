// The punctuation topics of grades 2 to 5. The sentences are written for this subject; in each, the marks a topic takes
// out can be only what they are, so a gap has one answer.

import { t } from "@ga/content";

import type { PunctuationSpec } from "./punctuation.ts";

/** PunctuationData is a punctuation topic without its prerequisites, which follow the order of the list. */
export type PunctuationData = Omit<PunctuationSpec, "prerequisites"> & { readonly grade: number };

/** punctuationData are the punctuation topics, in the order they are taught. */
export const punctuationData: readonly PunctuationData[] = [
  {
    grade: 2,
    id: "punctuation-sentence-ends",
    title: t("Full Stops, Question Marks and Exclamation Marks", "句号、问号和叹号"),
    taught: ["。", "？", "！"],
    offered: [],
    explanation: t(
      "A sentence ends with the mark of what it does: it tells, it asks, or it cries out or commands strongly.",
      "句子末尾的标点要看句子的语气：陈述用句号，提问用问号，感叹或语气强烈的命令用叹号。",
    ),
    intro: t(
      "Every sentence ends with a mark that says what it does. 你去过北京吗？ asks, so it ends with a question mark ？. 我去过一次。 tells, so it ends with a full stop 。. 那里的长城真雄伟啊！ cries out, so it ends with an exclamation mark ！.\n\nThe first knowledge point chooses the mark at the end of a sentence; the second finds the passage whose sentences all end with the right one.",
      "每个句子末尾的标点都表明句子的语气。“你去过北京吗？”在提问，末尾用问号“？”；“我去过一次。”在陈述，用句号“。”；“那里的长城真雄伟啊！”在感叹，用叹号“！”。\n\n第一个知识点选出句末的标点，第二个找出每句末尾标点都用对了的一段话。",
    ),
    watch: t(
      "A question word alone does not make a question. 我不知道他去哪儿了。 holds 哪儿 but asks nothing: it tells what I do not know, so it ends with a full stop.",
      "句子里有疑问词，不一定就是问句。“我不知道他去哪儿了。”里有“哪儿”，可并没有提问，只是说出我不知道的事，所以末尾用句号。",
    ),
    contrasts: {
      "。 ？": t(
        "the words before the mark tell something and ask nothing: there is no 吗 or 呢, and no question is put",
        "这里前面的话是在陈述，没有提问，也没有“吗”“呢”这样的问句语气",
      ),
      "？ 。": t(
        "the words before the mark ask something and want an answer, so they are not a plain statement",
        "这里前面的话在提问，需要回答，不是一般的陈述",
      ),
      "？ ！": t("the words before the mark ask something; they do not cry out", "这里前面的话是在提问，不是在感叹"),
      "！ 。": t(
        "the words before the mark cry out or command with strong feeling; a full stop would say them flatly",
        "这里前面的话带着强烈的感情，是感叹或命令，用句号就成了平平的陈述",
      ),
      "！ ？": t("the words before the mark cry out or command; they ask nothing", "这里前面的话是感叹或命令，并没有提问"),
    },
    confusions: { "。": ["？"] },
    sentences: [
      "你去过北京吗？我去过一次。那里的长城真雄伟啊！",
      "今天是星期几？今天是星期三。明天就要放假了，太好了！",
      "这朵花多么美丽啊！它叫什么名字？它叫月季花。",
      "小明，你的作业写完了吗？写完了。你真是个好孩子啊！",
      "外面下雨了吗？下雨了。快把衣服收进来！",
      "谁打碎了花瓶？是小猫打碎的。这只小猫太淘气了！",
      "你知道月亮为什么会变圆吗？我不知道。这个问题真有意思！",
      "春天来了。小草从地里钻了出来。多么可爱的小草啊！",
      "这是谁的铅笔？这是小红的铅笔。她刚才一直在找它。",
      "我们一起去公园玩，好吗？好的。公园里的花开得好美呀！",
      "着火了！快打电话叫消防车！消防车几分钟就到了。",
      "你喜欢吃苹果还是香蕉？我喜欢吃香蕉。香蕉是黄色的。",
      "啊，好大的雪啊！整个世界都变白了。我们去堆雪人好不好？",
    ],
  },
  {
    grade: 3,
    id: "punctuation-commas",
    title: t("Commas and Enumeration Commas", "逗号和顿号"),
    taught: ["，", "、"],
    offered: ["："],
    explanation: t(
      "Words of a list are separated by the enumeration comma 、; a pause between parts of a sentence takes the comma ，.",
      "并列的词语之间用顿号“、”；句子中间一般的停顿用逗号“，”。",
    ),
    intro: t(
      "公园里有桃花、杏花、梨花，美丽极了。 Between 桃花, 杏花 and 梨花, the items of one list, stands the enumeration comma 、. After the list, where the sentence pauses and goes on, stands the comma ，.\n\nThe first knowledge point chooses the mark for a gap; the second finds the sentence whose marks are all right.",
      "“公园里有桃花、杏花、梨花，美丽极了。”“桃花”“杏花”“梨花”是并列的词语，中间用顿号“、”；说完这几种花，句子停顿一下再往下说，这里用逗号“，”。\n\n第一个知识点选出横线处的标点，第二个找出标点全都用对了的句子。",
    ),
    watch: t(
      "Not every row of parts is a list of words. In 秋天到了，树叶黄了，果子熟了。 each part is a clause with its own verb, so the pauses between them take commas, not enumeration commas.",
      "并不是排在一起的部分都用顿号。“秋天到了，树叶黄了，果子熟了。”每一部分都是带着动词的分句，分句之间的停顿用逗号，不用顿号。",
    ),
    contrasts: {
      "， 、": t(
        "the parts on each side of the mark are not items of one list: the pause comes between parts of the sentence",
        "这里的前后不是并列的词语，而是句子各部分之间的停顿",
      ),
      "， ：": t(
        "nothing after the mark is spoken or announced: the sentence simply goes on",
        "这里后面不是说的话，也不是总说之后的分说，句子只是接着往下说",
      ),
      "、 ，": t(
        "the words on each side of the mark are items of one list, and a list takes the enumeration comma",
        "这里的前后是并列的词语，并列的词语之间用顿号",
      ),
      "、 ：": t("the mark stands inside a list; nothing is announced there", "这里在一串并列的词语中间，不是提示下文的地方"),
    },
    sentences: [
      "公园里有桃花、杏花、梨花，美丽极了。",
      "放学了，我把语文书、数学书、铅笔盒都装进了书包。",
      "秋天到了，树叶黄了，果子熟了。",
      "小兔子爱吃萝卜、青菜，不爱吃肉。",
      "妈妈买了苹果、香蕉、葡萄，还买了一个大西瓜。",
      "下课了，同学们有的跳绳，有的踢毽子，有的做游戏。",
      "春、夏、秋、冬，一年有四个季节。",
      "天上的白云有的像羊，有的像马，有的像棉花糖。",
      "爷爷、奶奶、爸爸、妈妈都很爱我。",
      "小明跑得快，跳得高，是运动会上的明星。",
      "我们要爱护花草树木，不随地扔纸屑、果皮。",
      "老师给我们讲了雷锋、黄继光、邱少云的故事。",
    ],
  },
  {
    grade: 3,
    id: "punctuation-speech",
    title: t("Colons and Quotation Marks", "冒号和引号"),
    taught: ["：", "“”"],
    offered: ["，", "《》"],
    explanation: t(
      "Words someone says are enclosed in quotation marks. When 说 or 问 comes before them, a colon follows it; when it comes after, the quotation stands first.",
      "别人说的话要加上引号。提示语“某某说”在前面时，后面用冒号；提示语在后面时，引号里的话放在前面。",
    ),
    intro: t(
      "妈妈说：“天冷了，多穿点衣服。” The words 妈妈 says are inside quotation marks “”, and 妈妈说 comes first, so a colon ： follows it. In “我们去踢球吧！”小明说。 the spoken words come first and 小明说 after them, so no colon is used.\n\nThe first knowledge point chooses the mark for a gap; the second finds the sentence whose marks are all right.",
      "“妈妈说：‘天冷了，多穿点衣服。’”妈妈说的话加上引号“”，提示语“妈妈说”在前面，后面用冒号“：”。“‘我们去踢球吧！’小明说。”说的话在前，提示语“小明说”在后，就不用冒号。\n\n第一个知识点选出横线处的标点，第二个找出标点全都用对了的句子。",
    ),
    watch: t(
      "When the words spoken are a whole sentence, its end mark goes inside the closing quotation mark: ……多穿点衣服。” and not ……多穿点衣服”。",
      "引号里说的是一句完整的话时，句末标点放在后引号里面：“……多穿点衣服。”而不是“……多穿点衣服”。",
    ),
    contrasts: {
      "： “”": t(
        "the mark comes after a word of saying such as 说 or 问 and before the spoken words: it announces them, it does not enclose them",
        "这里在“说”“问”这样的词后面、说的话前面，是提示下文，不是把话括起来",
      ),
      "： ，": t(
        "the mark comes after a word of saying such as 说 or 问, just before the words spoken, and those words are announced with a colon",
        "这里在“说”“问”这样的词后面，下面紧接着说的话，要用冒号提示",
      ),
      "： 《》": t(
        "the mark comes after a word of saying and announces the spoken words; no title is named there",
        "这里在“说”“问”这样的词后面，提示下面说的话，这里没有作品的名字",
      ),
      "“” 《》": t("the words inside the marks are what someone says, not the title of a book or film", "中间是人说的话，不是书名、篇名"),
    },
    confusions: { "“”": ["《》"] },
    sentences: [
      "妈妈说：“天冷了，多穿点衣服。”",
      "老师问：“谁愿意来回答这个问题？”",
      "“我们去踢球吧！”小明说。",
      "小红高兴地说：“我考了一百分！”",
      "爸爸笑着对我说：“你长大了。”",
      "小猫问小狗：“你在干什么呀？”",
      "“这是谁的书包？”王老师问。",
      "奶奶常常对我说：“做人要诚实。”",
      "弟弟大声喊：“下雪啦！”",
      "小白兔对乌龟说：“我们来赛跑吧。”",
      "“你好！”他向我挥挥手。",
      "我问爸爸：“月亮上有没有人？”",
      "同学们齐声回答：“老师好！”",
      "售货员问：“小朋友，你想买什么？”",
      "爷爷指着远处说：“那就是我小时候住的地方。”",
      "“快看，彩虹！”妹妹指着天空叫起来。",
      "小明对妈妈说：“我想学画画。”",
      "小鸟对大树说：“谢谢你给我一个家。”",
    ],
  },
  {
    grade: 4,
    id: "punctuation-titles",
    title: t("Title Marks", "书名号"),
    taught: ["《》", "“”"],
    offered: [],
    explanation: t(
      "The title of a book, an article, a paper, a film or a song is enclosed in title marks 《》. Words singled out, such as a name given to something, are enclosed in quotation marks.",
      "书名、篇名、报刊名、影视作品名、歌曲名等用书名号“《》”；需要特别指出的词语，比如某个事物的称号，用引号。",
    ),
    intro: t(
      "我最喜欢读《西游记》和《三国演义》。 西游记 and 三国演义 are the titles of books, so each is enclosed in title marks 《》. In 人们把长江称为“母亲河”。 母亲河 is a name given to the river, not the title of a work, so it takes quotation marks “”.\n\nThe first knowledge point chooses the marks for a pair of gaps; the second finds the sentence whose marks are all right.",
      "“我最喜欢读《西游记》和《三国演义》。”“西游记”“三国演义”是书名，各用书名号“《》”。“人们把长江称为‘母亲河’。”“母亲河”是人们给长江的称号，不是作品的名字，用引号“”。\n\n第一个知识点选出一对横线处的标点，第二个找出标点全都用对了的句子。",
    ),
    watch: t(
      "Ask whether the words name a work someone made. 新闻联播 is a television programme, a work, so it takes title marks; 国宝 is only a name of praise and takes quotation marks, however famous it is.",
      "要问一问：这是不是某部作品的名字？“新闻联播”是电视节目，是作品，用书名号；“国宝”再有名也只是一个称号，用引号。",
    ),
    contrasts: {
      "《》 “”": t(
        "the words inside the marks are the title of a work, a book, article, paper, film or song, and a title takes title marks",
        "中间是书、文章、报刊、影视作品或歌曲的名字，要用书名号",
      ),
      "“” 《》": t(
        "the words inside the marks are a name given to something, or words spoken, not the title of a work",
        "中间是事物的称号或说的话，不是作品的名字",
      ),
      "《》 ，": t(
        "without its marks the title runs into the sentence, and nothing shows where it begins and ends",
        "去掉书名号，书名就和句子连在一起，看不出从哪里开始、到哪里结束",
      ),
    },
    confusions: { "“”": ["《》"], "《》": ["“”", "，"] },
    sentences: [
      "我最喜欢读《西游记》和《三国演义》。",
      "我们学了课文《草船借箭》，都佩服诸葛亮的“神机妙算”。",
      "爸爸每天早上都看《人民日报》。",
      "昨天晚上，我们全家一起看了动画片《大闹天宫》。",
      "李白的《静夜思》写出了诗人对家乡的思念。",
      "人们把长江称为“母亲河”。",
      "这本《十万个为什么》让我知道了很多科学知识。",
      "杭州有“人间天堂”的美称。",
      "妈妈说我是家里的“小书虫”。",
      "我在《少年报》上发表了一篇作文《我的妈妈》。",
      "骆驼被称为“沙漠之舟”。",
      "我们班演出了童话剧《白雪公主》，大家都夸我们演得好。",
      "鲁迅先生写过《从百草园到三味书屋》。",
      "老师说：“今天我们学习《秋天的雨》。”",
      "他在作文里把月亮比作“白玉盘”。",
      "这首《春晓》是孟浩然写的。",
      "我借了一本《格林童话》和一本《安徒生童话》。",
      "黄山的“迎客松”非常有名。",
      "电视里正在播放《新闻联播》。",
      "他的外号叫“小机灵”。",
      "《小马过河》告诉我们，遇到问题要自己动脑筋。",
      "熊猫是中国的“国宝”。",
      "我读过叶圣陶爷爷写的《稻草人》。",
      "冬天的哈尔滨被称为“冰城”。",
      "课文《落花生》中，父亲希望孩子们做“有用的人”。",
    ],
  },
  {
    grade: 4,
    id: "punctuation-ellipses",
    title: t("Ellipses", "省略号"),
    taught: ["……", "、"],
    offered: ["："],
    explanation: t(
      "An ellipsis …… shows that a list goes on beyond what is written, or that speech breaks off. After a list that ends in an ellipsis, 等 is not added.",
      "省略号“……”表示列举没有说完，或者说话断断续续。列举后面用了省略号，就不再加“等”字。",
    ),
    intro: t(
      "市场上有苹果、梨、香蕉……各种水果应有尽有。 苹果, 梨 and 香蕉 are a list, separated by enumeration commas 、, and the ellipsis …… shows the list goes on beyond them. In 我……我不是故意的。 the ellipsis shows the speaker breaking off.\n\nThe first knowledge point chooses the mark for a gap; the second finds the sentence whose marks are all right.",
      "“市场上有苹果、梨、香蕉……各种水果应有尽有。”“苹果”“梨”“香蕉”是并列的词语，用顿号“、”隔开；省略号“……”表示还有许多水果没有列出来。“我……我不是故意的。”里的省略号表示说话断断续续。\n\n第一个知识点选出横线处的标点，第二个找出标点全都用对了的句子。",
    ),
    watch: t(
      "An ellipsis already says that the list goes on, so 等 is not added after it: 苹果、梨、香蕉……各种水果, not 苹果、梨、香蕉……等各种水果.",
      "省略号已经表示列举没有完，后面就不再加“等”：写“苹果、梨、香蕉……各种水果”，不写“苹果、梨、香蕉……等各种水果”。",
    ),
    contrasts: {
      "…… 、": t(
        "what comes before the mark is not finished: a list goes on past what is written, or the speaker breaks off, and only the ellipsis shows that",
        "这里前面的话没有说完：列举还没有列完，或者说话断断续续，只有省略号能表示",
      ),
      "…… ：": t("nothing is announced after the mark; something is left unsaid there", "这里后面不是要提示的下文，而是有话没有说出来"),
      "、 ……": t(
        "the mark stands between two items of a list and the next item is written, so nothing is left out there",
        "这里在两个并列的词语之间，后面的词语还写着，这里没有省略",
      ),
      "、 ：": t("the mark stands between two items of a list; nothing is announced there", "这里在两个并列的词语之间，不是提示下文的地方"),
    },
    sentences: [
      "市场上有苹果、梨、香蕉……各种水果应有尽有。",
      "我……我不是故意的。",
      "花园里有红的、黄的、白的……五颜六色，美丽极了。",
      "“救……救命啊！”他在水里喊着。",
      "书架上摆着故事书、科普书、漫画书……真是琳琅满目。",
      "一、二、三……小朋友们排着队报数。",
      "他说：“这件事……我得想一想。”",
      "动物园里有老虎、狮子、大象、熊猫……让人看都看不过来。",
      "嘀嗒，嘀嗒……钟声一下一下地响着。",
      "妈妈买了鸡蛋、牛奶、面包……装了满满一篮子。",
      "“我……我找不到妈妈了……”小女孩哭着说。",
      "春天来了，燕子、黄莺、布谷鸟……都飞回来了。",
      "桌上放着铅笔、橡皮、尺子……摆得整整齐齐。",
    ],
  },
  {
    grade: 5,
    id: "punctuation-semicolons",
    title: t("Semicolons", "分号"),
    taught: ["；", "，"],
    offered: ["、"],
    explanation: t(
      "Parallel clauses that already contain commas are separated by semicolons, so the reader sees which parts belong together.",
      "并列的分句内部已经用了逗号时，分句之间用分号“；”，让人看清哪些部分是一组。",
    ),
    intro: t(
      "春天，桃花开了；夏天，荷花开了；秋天，菊花开了。 Each season is a clause with a comma inside it: 春天，桃花开了. Between the clauses stands the semicolon ；, so the reader sees three parts that stand side by side.\n\nThe first knowledge point chooses the mark for a gap; the second finds the sentence whose marks are all right.",
      "“春天，桃花开了；夏天，荷花开了；秋天，菊花开了。”每个季节是一个分句，分句里已经有了逗号，比如“春天，桃花开了”；分句之间用分号“；”，让人看清这是并列的三部分。\n\n第一个知识点选出横线处的标点，第二个找出标点全都用对了的句子。",
    ),
    watch: t(
      "A semicolon stands between clauses side by side, not between a clause and the reason that follows it. In 我喜欢读书，因为书能告诉我很多知识 the 因为 clause belongs to 我喜欢读书, so a comma stays between them.",
      "分号用在并列的分句之间，不用在一个分句和说明它原因的分句之间。“我喜欢读书，因为书能告诉我很多知识”里，“因为”分句是说“我喜欢读书”的，两者之间仍用逗号。",
    ),
    contrasts: {
      "； ，": t(
        "the clauses on each side of the mark already have commas inside, and a comma here would not show where one clause ends",
        "这里两边的分句里已经有逗号，这里再用逗号，就看不出一个分句在哪里结束",
      ),
      "； 、": t("the mark stands between two clauses, not between the words of a list", "这里两边是分句，不是并列的词语"),
      "， ；": t(
        "the mark is a pause inside one clause, not the border between two parallel clauses",
        "这里是一个分句内部的停顿，不是两个并列分句的分界",
      ),
      "， 、": t("the parts on each side of the mark are not items of one list", "这里的前后不是并列的词语"),
    },
    sentences: [
      "春天，桃花开了；夏天，荷花开了；秋天，菊花开了。",
      "天空中，白云飘飘；田野里，麦浪滚滚。",
      "我喜欢读书，因为书能告诉我很多知识；我喜欢画画，因为画能表达我的想法。",
      "山上的树绿了，像一把把绿伞；山下的花开了，像一张张笑脸。",
      "爸爸是医生，每天给病人看病；妈妈是老师，每天给学生上课。",
      "这里的冬天很冷，常常下雪；那里的冬天很暖，从来不下雪。",
      "月亮升起来了，像一个银盘；星星眨着眼睛，像一颗颗宝石。",
      "小松鼠忙着采松果，准备过冬；小蚂蚁忙着搬粮食，储存起来。",
      "早上，太阳从东方升起；傍晚，太阳从西方落下。",
      "有人喜欢热闹的城市，因为那里很方便；有人喜欢安静的乡村，因为那里空气好。",
      "一年级时，我只会写自己的名字；现在，我已经能写一篇作文了。",
    ],
  },
  {
    grade: 6,
    id: "punctuation-dashes",
    title: t("Dashes", "破折号"),
    taught: ["——", "："],
    offered: ["、"],
    explanation: t(
      "A dash —— marks words that explain what comes before it, a sound drawn out, or a sudden turn of what is said. Words of explanation set into the middle of a sentence have a dash before them and after them.",
      "破折号“——”标示后面的话是对前面的解释说明，也表示声音的延长，或者话题的突然转换、意思的转折。插在句子中间的解释说明，前后各用一个破折号。",
    ),
    intro: t(
      "这本书的作者——一位年轻的科学家——给我们讲了许多有趣的故事。 一位年轻的科学家 explains who the author is; set into the middle of the sentence, it has a dash —— before it and after it. In “呜——”火车鸣着汽笛开进了车站。 the dash draws the sound out.\n\nThe first knowledge point chooses the mark for a gap; the second finds the sentence whose marks are all right.",
      "“这本书的作者——一位年轻的科学家——给我们讲了许多有趣的故事。”“一位年轻的科学家”解释作者是谁，插在句子中间，前后各用一个破折号“——”。“‘呜——’火车鸣着汽笛开进了车站。”里的破折号表示声音的延长。\n\n第一个知识点选出横线处的标点，第二个找出标点全都用对了的句子。",
    ),
    watch: t(
      "Words of explanation set into the middle of a sentence need a dash on both sides. Take them out and the rest must still read as a sentence: 这本书的作者给我们讲了许多有趣的故事。",
      "插在句子中间的解释说明，前后都要用破折号。把它拿掉，剩下的部分仍然要成句：这本书的作者给我们讲了许多有趣的故事。",
    ),
    contrasts: {
      "—— ：": t(
        "what follows the mark explains, draws out a sound or turns the talk; it is not words announced after 说 or a summary",
        "这里后面是解释说明、声音的延长或话题的转换，不是“说”后面的话，也不是总说后的分说",
      ),
      "—— 、": t("the mark does not stand between the items of a list", "这里的前后不是并列的词语"),
      "： ——": t(
        "the mark follows a word of saying such as 说 or 喊 and announces the spoken words; nothing is explained or drawn out there",
        "这里在“说”“喊”这样的词后面，提示下面说的话，不是解释说明，也不是声音的延长",
      ),
      "： 、": t(
        "the mark follows a word of saying and announces what is said; it is not inside a list",
        "这里在“说”“喊”这样的词后面，提示下面说的话，不在并列的词语中间",
      ),
    },
    sentences: [
      "“呜——”火车鸣着汽笛开进了车站。",
      "“小——明——”妈妈在楼下喊我回家吃饭。",
      "这本书的作者——一位年轻的科学家——给我们讲了许多有趣的故事。",
      "我们的好朋友——小松鼠——又来到了窗前。",
      "“今天的天气真好——对了，你的作业写完了吗？”妈妈问我。",
      "我本来以为他会来——可是他一直没有来。",
      "老师说：“这次比赛的冠军——五年级一班——明天来领奖。”",
      "远处传来“咚——咚——”的鼓声。",
      "风越刮越大——不，已经不是风，而是暴风雨了。",
      "他拿起电话说：“喂——是王老师吗？”",
      "我们班的两位同学——李华和王芳——在比赛中获了奖。",
      "“叮铃铃——”上课铃响了。",
      "我们学校的图书馆——一座三层的小楼——就在操场的东边。",
      "他从小就有一个习惯——每天睡觉前读半小时书——一直坚持到现在。",
      "“大家好——咦，小红怎么没来？”班长问。",
      "奶奶说：“这棵老树——它比我的年纪还大——是你太爷爷种下的。”",
      "弟弟喊：“姐——姐——等等我！”",
      "我们的数学老师——王老师——是一位很有经验的老师。",
      "我想去公园——不，我想先把作业写完。",
      "小狗“汪——汪——”地叫个不停。",
    ],
  },
];
