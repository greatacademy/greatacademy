// The topics of the heritage bridges' own (docs/chinese-curriculum.md §8.2): what a learner who already speaks Chinese
// needs to write it. Characters that sound alike, 的 地 得 and the pronouns of the third person, the written forms of
// words and set phrases they say, dialect words and their Mandarin, spoken and written registers, and reading
// traditional characters. Every sentence is written for this subject.

import { type Text, type TopicDef, t } from "@ga/content";

import { type DrillItem, drillItem, drillTopic, lines } from "../grammar/drill.ts";

/** items reads drill items from lines of `shown | right | wrong | wrong | wrong`. */
const items = (data: string): readonly DrillItem[] =>
  lines(data, 5).map(([shown, right, a, b, c]) => drillItem(shown!, right!, [a!, b!, c!]));

/** choices reads items that show nothing from lines of `right | wrong | wrong | wrong`. */
const choices = (data: string): readonly DrillItem[] => lines(data, 4).map(([right, a, b, c]) => drillItem("", right!, [a!, b!, c!]));

/** pairItems asks for the second of each pair, shown the first, with the seconds of the next three pairs as wrong answers. */
function pairItems(pairs: readonly (readonly [string, string])[], show: (first: string) => string): readonly DrillItem[] {
  return pairs.map(([first, second], i) => {
    const other = (k: number) => pairs[(i + k) % pairs.length]![1];
    return drillItem(show(first), second, [other(1), other(2), other(3)]);
  });
}

const soundAlike = items(`
我明天＿来看你。 | 再 | 在 | 载 | 仔
他＿家里写作业。 | 在 | 再 | 载 | 仔
我每天都认真＿作业。 | 做 | 作 | 坐 | 座
请＿下休息一会儿。 | 坐 | 做 | 作 | 座
这＿山很高。 | 座 | 坐 | 做 | 作
这篇＿文写得真好。 | 作 | 做 | 坐 | 座
他＿经回家了。 | 已 | 以 | 己 | 亿
我们可＿一起去公园。 | 以 | 已 | 意 | 亿
月亮又大又＿。 | 圆 | 园 | 元 | 员
我们去公＿玩。 | 园 | 圆 | 元 | 员
这支笔两＿钱。 | 元 | 园 | 圆 | 员
今天是＿天，没有下雨。 | 晴 | 情 | 请 | 清
＿你帮我一下。 | 请 | 情 | 晴 | 清
小河的水很＿，能看见鱼。 | 清 | 情 | 晴 | 请
`);

const soundAlikeMistakes = items(`
我们一起去公圆玩。 | 圆 | 们 | 起 | 玩
他以经吃过饭了。 | 以 | 他 | 经 | 饭
今天是情天，我们去爬山。 | 情 | 今 | 爬 | 山
请你在说一遍。 | 在 | 请 | 你 | 遍
妈妈在厨房作饭。 | 作 | 妈 | 厨 | 饭
他做在椅子上看书。 | 做 | 椅 | 看 | 书
月亮又大又园。 | 园 | 月 | 亮 | 大
小河的水很情。 | 情 | 小 | 河 | 水
这支铅笔三园钱。 | 园 | 铅 | 笔 | 钱
我再家门口等你。 | 再 | 家 | 门 | 等
心晴不好的时候，可以听听音乐。 | 晴 | 心 | 听 | 音
他是我们学校的运动圆。 | 圆 | 学 | 校 | 运
`);

const deDiDe = choices(`
我的妹妹慢慢地走过来。 | 我地妹妹慢慢地走过来。 | 我的妹妹慢慢的走过来。 | 我得妹妹慢慢地走过来。
他的弟弟跑得很快。 | 他地弟弟跑得很快。 | 他的弟弟跑的很快。 | 他的弟弟跑地很快。
美丽的小鸟在树上快乐地唱歌。 | 美丽地小鸟在树上快乐地唱歌。 | 美丽的小鸟在树上快乐的唱歌。 | 美丽的小鸟在树上快乐得唱歌。
妈妈做的菜好吃得不得了。 | 妈妈做地菜好吃得不得了。 | 妈妈做的菜好吃的不得了。 | 妈妈做的菜好吃地不得了。
同学们认真地听老师的话。 | 同学们认真的听老师的话。 | 同学们认真地听老师地话。 | 同学们认真得听老师的话。
我的弟弟笑得眼泪都流出来了。 | 我的弟弟笑的眼泪都流出来了。 | 我地弟弟笑得眼泪都流出来了。 | 我的弟弟笑地眼泪都流出来了。
绿绿的草地上，小狗开心地跑来跑去。 | 绿绿地草地上，小狗开心地跑来跑去。 | 绿绿的草地上，小狗开心的跑来跑去。 | 绿绿的草地上，小狗开心得跑来跑去。
姐姐的字写得很漂亮。 | 姐姐地字写得很漂亮。 | 姐姐的字写的很漂亮。 | 姐姐的字写地很漂亮。
雨哗哗地下个不停，路上的人都打着伞。 | 雨哗哗的下个不停，路上的人都打着伞。 | 雨哗哗地下个不停，路上地人都打着伞。 | 雨哗哗得下个不停，路上的人都打着伞。
爷爷高兴地说：“你长得真高！” | 爷爷高兴的说：“你长得真高！” | 爷爷高兴地说：“你长的真高！” | 爷爷高兴得说：“你长得真高！”
我们静静地坐着，听奶奶讲过去的故事。 | 我们静静的坐着，听奶奶讲过去的故事。 | 我们静静地坐着，听奶奶讲过去地故事。 | 我们静静得坐着，听奶奶讲过去的故事。
`);

const pronouns = items(`
我家有一只小猫，＿每天都在窗台上睡觉。 | 它 | 他 | 她 | 它们
妈妈下班回来了，＿手里拿着一束花。 | 她 | 他 | 它 | 她们
爸爸很忙，＿每天很晚才回家。 | 他 | 她 | 它 | 他们
树上有两只小鸟，＿在唱歌。 | 它们 | 他们 | 她们 | 它
姐姐和妹妹去公园了，＿玩得很开心。 | 她们 | 他们 | 它们 | 她
哥哥和我一起踢球，＿踢得比我好。 | 他 | 她 | 它 | 他们
这本书很有意思，我把＿看了两遍。 | 它 | 他 | 她 | 它们
奶奶的眼睛不好，我常常给＿读报纸。 | 她 | 他 | 它 | 她们
小明和小红是我的同学，＿都住在我家旁边。 | 他们 | 她们 | 它们 | 他
王老师是一位女老师，＿讲课很有趣。 | 她 | 他 | 它 | 她们
院子里有三棵苹果树，＿都结满了果子。 | 它们 | 他们 | 她们 | 它
`);

const spokenWords = items(`
piào liang（好看） | 漂亮 | 票亮 | 飘亮 | 漂凉
xǐ huan（爱，对人或事物有好感） | 喜欢 | 喜换 | 洗欢 | 喜唤
péng you（彼此友好的人） | 朋友 | 朋有 | 棚友 | 明友
zhī dao（明白，了解） | 知道 | 知到 | 支道 | 只道
dōng xi（泛指各种物品） | 东西 | 冬西 | 东息 | 动西
shí hou（某一段时间） | 时候 | 时侯 | 十候 | 实候
yīn wèi（说明原因） | 因为 | 应为 | 因位 | 音为
kě yǐ（能，允许） | 可以 | 可已 | 克以 | 可意
xiāo xi（音信，新闻） | 消息 | 消习 | 小息 | 销息
jué de（认为，感到） | 觉得 | 觉的 | 决得 | 角得
gù shi（讲述的事情） | 故事 | 古事 | 故是 | 顾事
zhǔn bèi（预先安排） | 准备 | 准被 | 准背 | 谁备
`);

const setPhrases = items(`
luàn qī bā zāo（又乱又没有条理） | 乱七八糟 | 乱七八遭 | 乱七八早 | 乱漆八糟
yì mú yí yàng（完全相同） | 一模一样 | 一摸一样 | 一模一洋 | 一谟一样
pò bù jí dài（急得不能再等） | 迫不及待 | 迫不急待 | 破不及待 | 迫不及代
zài jiē zài lì（一次又一次加倍努力） | 再接再厉 | 再接再励 | 在接再厉 | 再接在厉
yì gǔ zuò qì（趁着劲头一下子做完） | 一鼓作气 | 一股作气 | 一鼓做气 | 一古作气
zǒu tóu wú lù（无路可走） | 走投无路 | 走头无路 | 走投无陆 | 奏投无路
zì shǐ zhì zhōng（从开头到结尾） | 自始至终 | 自使至终 | 自始自终 | 子始至终
bù zhī bù jué（没有察觉到） | 不知不觉 | 不知不决 | 不只不觉 | 不知不角
qī shàng bā xià（心里慌乱不安） | 七上八下 | 七上八夏 | 起上八下 | 七尚八下
jīn jīn yǒu wèi（吃得或听得很有滋味） | 津津有味 | 津津有未 | 斤斤有味 | 津津有昧
shǒu zhū dài tù（死守经验，不知变通） | 守株待兔 | 守珠待兔 | 守株代兔 | 手株待兔
yì jǔ liǎng dé（做一件事得到两种好处） | 一举两得 | 一举两的 | 一句两得 | 一举俩得
`);

/** DIALECT are words of Cantonese (粤) and Shanghainese (沪) and their Mandarin. */
const DIALECT: readonly (readonly [string, string, string])[] = [
  ["粤", "睇", "看"],
  ["粤", "钟意", "喜欢"],
  ["粤", "食饭", "吃饭"],
  ["粤", "落雨", "下雨"],
  ["粤", "冇", "没有"],
  ["粤", "返工", "上班"],
  ["粤", "靓", "漂亮"],
  ["粤", "行街", "逛街"],
  ["粤", "雪柜", "冰箱"],
  ["粤", "佢", "他"],
  ["粤", "边个", "谁"],
  ["粤", "点解", "为什么"],
  ["沪", "侬", "你"],
  ["沪", "阿拉", "我们"],
];

const dialectName = (d: string) => (d === "粤" ? "粤语" : "上海话");

/** toMandarin asks for the Mandarin of a dialect word, fromMandarin for the dialect word of a Mandarin one. */
const toMandarin = DIALECT.map(([d, word, mandarin], i) => {
  const other = (k: number) => DIALECT[(i + k) % DIALECT.length]![2];
  return drillItem(`${dialectName(d)}“${word}”`, mandarin, [other(1), other(2), other(3)]);
});
const fromMandarin = DIALECT.map(([d, word, mandarin], i) => {
  const other = (k: number) => DIALECT[(i + k) % DIALECT.length]![1];
  return drillItem(`${dialectName(d)}里的“${mandarin}”`, word, [other(1), other(2), other(3)]);
});

/** SPOKEN are spoken or regional words and the words a piece of writing uses instead. */
const SPOKEN: readonly (readonly [string, string])[] = [
  ["啥", "什么"],
  ["咋", "怎么"],
  ["老是", "总是"],
  ["甭", "不用"],
  ["这会儿", "此时"],
  ["俺", "我"],
  ["搁", "放"],
  ["唠嗑", "聊天"],
  ["溜达", "散步"],
  ["瞅", "看"],
  ["晌午", "中午"],
  ["明儿个", "明天"],
];

const formal = choices(`
明天上午九点在礼堂开会，请准时参加。 | 明儿个九点礼堂开会，别迟到啊。 | 明天九点咱们去礼堂开个会呗。 | 大伙儿明早九点礼堂见哈。
图书馆周一闭馆，请大家合理安排时间。 | 图书馆周一不开门哦，大家看着办吧。 | 礼拜一图书馆关门，甭去了。 | 周一图书馆歇业啦，别白跑一趟。
请勿在走廊奔跑。 | 别在走廊里瞎跑啊。 | 走廊里不许乱跑哈。 | 走廊上跑啥跑？
感谢您的来信，我已收到。 | 信收到了，谢啦。 | 你的信俺收着了。 | 收到你的信啦，开心死了。
如有疑问，请与班主任联系。 | 有啥不懂的找班主任去。 | 不明白就问班主任呗。 | 有问题甭客气，找班主任哈。
因天气原因，运动会延期举行。 | 天不好，运动会往后推了。 | 下雨了，运动会改天再开吧。 | 老天不给面子，运动会挪日子了。
请保持安静，不要大声喧哗。 | 都小点声儿，别嚷嚷。 | 安静点儿行不行？ | 大家伙儿别吵吵了。
在操场拾到黑色水杯一个，请失主到办公室认领。 | 谁丢了个黑杯子？去办公室拿。 | 操场上捡了个杯子，谁的赶紧来拿哈。 | 有人掉了黑杯子，自己去办公室找吧。
为了大家的健康，校园内禁止吸烟。 | 学校里别抽烟啊，对身体不好。 | 抽烟找个别的地方去。 | 校园里甭抽烟了哈。
欢迎各位家长参加本周五的家长会。 | 家长们周五来开会哈。 | 周五开家长会，爸妈都来呗。 | 礼拜五家长会，记得来啊。
本店营业时间为每天八点至二十点。 | 咱这店八点开门，晚上八点关门。 | 我们店每天八点开到晚上八点哦。 | 小店早八晚八，欢迎来玩儿。
`);

const traditional = items(`
學 | 学 | 觉 | 举 | 字
國 | 国 | 图 | 团 | 围
書 | 书 | 韦 | 节 | 申
東 | 东 | 车 | 乐 | 冬
車 | 车 | 东 | 乐 | 军
馬 | 马 | 鸟 | 与 | 乌
鳥 | 鸟 | 马 | 乌 | 岛
說 | 说 | 话 | 讲 | 兑
見 | 见 | 贝 | 页 | 现
長 | 长 | 张 | 卡 | 民
門 | 门 | 们 | 问 | 闪
開 | 开 | 关 | 井 | 并
電 | 电 | 由 | 申 | 甲
愛 | 爱 | 受 | 爰 | 友
時 | 时 | 对 | 叶 | 讨
飛 | 飞 | 卫 | 也 | 习
`);

const traditionalWords = items(`
學習 | 学习 | 学刁 | 觉习 | 字习
電話 | 电话 | 申话 | 电活 | 由话
飛機 | 飞机 | 飞几 | 飞杌 | 也机
醫生 | 医生 | 区生 | 医主 | 匡生
開門 | 开门 | 关门 | 开们 | 开问
說話 | 说话 | 说活 | 兑话 | 讲话
朋友們 | 朋友们 | 朋友门 | 朋有们 | 明友们
媽媽 | 妈妈 | 吗吗 | 马马 | 码码
飯館 | 饭馆 | 饭管 | 版馆 | 反馆
問題 | 问题 | 门题 | 问提 | 闪题
颱風 | 台风 | 抬风 | 台凤 | 胎风
圖書館 | 图书馆 | 国书馆 | 图节馆 | 图书管
`);

/** fill is the solution of a sentence with a gap: the sentence with its answer in place. */
const fill = (right: string, shown: string): Text => {
  const whole = shown.replace("＿", right);
  return t(`The sentence reads: ${whole}`, `完整的句子是：${whole}`);
};

/** heritageTopics are the topics of the heritage bridges' own, in the order the bridges teach them. */
export const heritageTopics: readonly TopicDef[] = [
  drillTopic({
    id: "heritage-sound-alike",
    title: t("Characters That Sound Alike", "同音字"),
    summary: t(
      "Choosing among characters said the same way, such as 在 and 再, 做 and 坐, 园 and 圆, by what the sentence means.",
      "根据句子的意思，在读音相同的字中选对字，如“在”和“再”，“做”和“坐”，“园”和“圆”。",
    ),
    prerequisites: ["recognizing-characters-1-10"],
    strand: "words",
    points: [
      {
        suffix: "choose",
        title: t("Choosing the Character", "选对字"),
        explanation: t(
          "Characters that sound the same are told apart by their meaning: 在 says where something is, 再 that it happens again; 坐 is to sit, 做 to do, 座 counts mountains and buildings, and 作 is found in words such as 作文. Say the sentence, ask what the gap means, then choose.",
          "读音相同的字要靠意思来分：“在”表示在哪里，“再”表示又一次；“坐”是坐下，“做”是做事，“座”用来数山和楼，“作”用在“作文”这样的词里。先读句子，想一想空里是什么意思，再选字。",
        ),
        question: t("Which character fills the gap?", "空里应该填哪个字？"),
        items: soundAlike,
        why: fill,
      },
      {
        suffix: "mistake",
        title: t("Finding the Wrong Character", "找出错别字"),
        explanation: t(
          "A wrong character that sounds right is easy to miss when reading aloud. Read the sentence for its meaning one character at a time, and ask of each whether it means what the sentence needs.",
          "读音对、字写错的情况，读出声时很难发现。要按意思一个字一个字地看，问问每个字是不是句子要表达的意思。",
        ),
        question: t("Which character in the sentence is wrong?", "句子里哪个字写错了？"),
        items: soundAlikeMistakes,
        why: (right, shown) => t(`${right} is the wrong character in: ${shown}`, `“${shown}”中的“${right}”是错别字。`),
      },
    ],
  }),
  drillTopic({
    id: "heritage-de-and-pronouns",
    title: t("的, 地, 得 and 他, 她, 它", "的、地、得和他、她、它"),
    summary: t(
      "Writing the three de that sound alike, and choosing 他, 她 or 它 and their plurals for a person, a woman or girl, or an animal or thing.",
      "分清读音相同的“的、地、得”，并按人物是男是女、是动物还是东西选用“他、她、它”及其复数。",
    ),
    prerequisites: ["heritage-sound-alike"],
    strand: "words",
    points: [
      {
        suffix: "de",
        title: t("的, 地 and 得", "的、地、得"),
        explanation: t(
          "的 comes before a noun (美丽的小鸟), 地 before a verb (慢慢地走), and 得 after a verb or adjective, before how or how much (跑得很快, 好吃得不得了).",
          "“的”用在名词前面（美丽的小鸟），“地”用在动词前面（慢慢地走），“得”用在动词或形容词后面，说明怎么样、到什么程度（跑得很快，好吃得不得了）。",
        ),
        question: t("In which sentence are 的, 地 and 得 all right?", "哪个句子里的“的、地、得”都用对了？"),
        items: deDiDe,
        why: (right) => t(`${right} uses each one in its place.`, `“${right}”里的“的、地、得”都用对了。`),
      },
      {
        suffix: "pronouns",
        title: t("他, 她 and 它", "他、她、它"),
        explanation: t(
          "他 is a man or boy, 她 a woman or girl, and 它 an animal or thing. Add 们 for more than one; a group of men and women together is 他们.",
          "“他”指男性，“她”指女性，“它”指动物或东西。不止一个时加“们”；男女都有时用“他们”。",
        ),
        question: t("Which word fills the gap?", "空里应该填哪个词？"),
        items: pronouns,
        why: fill,
      },
    ],
  }),
  drillTopic({
    id: "heritage-written-forms",
    title: t("Writing the Words You Say", "会说也会写"),
    summary: t(
      "Writing everyday words and set phrases that a learner already says, such as 漂亮, 时候 and 一模一样.",
      "把已经会说的常用词和成语写对，如“漂亮”“时候”“一模一样”。",
    ),
    prerequisites: ["recognizing-characters-1-30"],
    strand: "words",
    points: [
      {
        suffix: "words",
        title: t("Everyday Words", "常用词"),
        explanation: t(
          "Words said every day are often written with a character that only sounds right. Think of what each syllable means: 时候 has 候 of waiting, not 侯 of a lord; 觉得 ends in 得, not 的.",
          "天天说的词，常常被写成读音对、意思不对的字。想一想每个音节是什么意思：“时候”的“候”是等候的“候”，不是“侯”；“觉得”的“得”不是“的”。",
        ),
        question: t("How is this word written?", "这个词怎么写？"),
        items: spokenWords,
        why: (right, shown) => t(`${shown} is written ${right}.`, `${shown}写作“${right}”。`),
      },
      {
        suffix: "phrases",
        title: t("Set Phrases", "成语"),
        explanation: t(
          "A set phrase keeps the characters of its story or its meaning: 守株待兔 is a farmer waiting by a tree stump (株), and 再接再厉 sharpens (厉) again and again. Knowing why a character is there keeps it from being swapped for one that sounds alike.",
          "成语的每个字都来自它的故事或意思：“守株待兔”是农夫守着树桩（株）等兔子，“再接再厉”是一次又一次地磨快（厉）。知道每个字为什么在那里，就不会写成读音相同的别的字。",
        ),
        question: t("How is this set phrase written?", "这个成语怎么写？"),
        items: setPhrases,
        why: (right, shown) => t(`${shown} is written ${right}.`, `${shown}写作“${right}”。`),
      },
    ],
  }),
  drillTopic({
    id: "heritage-dialect-words",
    title: t("Dialect Words and Mandarin", "方言词和普通话"),
    summary: t(
      "Matching words of Cantonese and Shanghainese with the Mandarin words written in their place, such as 睇 and 看, 侬 and 你.",
      "把粤语、上海话里的词和书面上用的普通话词对应起来，如“睇”和“看”，“侬”和“你”。",
    ),
    prerequisites: ["heritage-written-forms"],
    strand: "words",
    points: [
      {
        suffix: "mandarin",
        title: t("The Mandarin Word", "普通话怎么说"),
        explanation: t(
          "Many families speak a dialect at home. Its words are not wrong, but writing for everyone uses Mandarin: Cantonese 睇 is written 看, 落雨 下雨, and Shanghainese 阿拉 我们.",
          "很多家庭在家里说方言。方言词没有错，但写给大家看的文字要用普通话：粤语的“睇”写作“看”，“落雨”写作“下雨”，上海话的“阿拉”写作“我们”。",
        ),
        question: t("What is this word in Mandarin?", "这个词用普通话怎么说？"),
        items: toMandarin,
        why: (right, shown) => t(`${shown} is ${right} in Mandarin.`, `${shown}，普通话说“${right}”。`),
      },
      {
        suffix: "dialect",
        title: t("The Dialect Word", "方言怎么说"),
        explanation: t(
          "Going the other way helps a learner recognise a dialect word in a message or a shop sign: Mandarin 喜欢 is Cantonese 钟意, 没有 is 冇, and 你 is Shanghainese 侬.",
          "反过来想，有助于在信息或招牌里认出方言词：普通话的“喜欢”粤语说“钟意”，“没有”说“冇”，“你”上海话说“侬”。",
        ),
        question: t("Which word is it in the dialect?", "这个词在方言里怎么说？"),
        items: fromMandarin,
        why: (right, shown) => t(`${shown} is ${right}.`, `${shown}说“${right}”。`),
      },
    ],
  }),
  drillTopic({
    id: "heritage-register",
    title: t("Spoken and Written Chinese", "口语和书面语"),
    summary: t(
      "Replacing spoken and regional words such as 啥, 甭 and 溜达 with those of writing, and choosing the wording of a notice or letter.",
      "把“啥”“甭”“溜达”这样的口语词换成书面语，并选出适合通知、书信的说法。",
    ),
    prerequisites: ["recognizing-characters-3-10"],
    strand: "words",
    points: [
      {
        suffix: "words",
        title: t("Words of Writing", "书面用词"),
        explanation: t(
          "Speech uses words that writing avoids: 啥 is written 什么, 咋 怎么, 甭 不用, and 溜达 散步. They are fine at home, but a composition or a letter uses the written word.",
          "说话时常用一些书面上不用的词：“啥”写作“什么”，“咋”写作“怎么”，“甭”写作“不用”，“溜达”写作“散步”。在家里说没问题，写作文、写信时要用书面语。",
        ),
        question: t("Which word does writing use instead?", "写文章时应该换成哪个词？"),
        items: pairItems(SPOKEN, (spoken) => `“${spoken}”`),
        why: (right, shown) => t(`In writing, ${shown} is ${right}.`, `书面上，${shown}写作“${right}”。`),
      },
      {
        suffix: "notice",
        title: t("The Wording of a Notice", "通知的说法"),
        explanation: t(
          "A notice or letter is plain and polite: it uses 请, 请勿, 如有, 本 and 至, and leaves out spoken words, particles such as 啊, 哈 and 呗, and jokes.",
          "通知、书信要简明、有礼貌：常用“请”“请勿”“如有”“本”“至”等词，不用口语词，不加“啊”“哈”“呗”这样的语气词，也不开玩笑。",
        ),
        question: t("Which sentence suits a written notice?", "哪个句子适合写在通知上？"),
        items: formal,
        why: (right) => t(`${right} is plain and polite.`, `“${right}”简明、有礼貌，适合写在通知上。`),
      },
    ],
  }),
  drillTopic({
    id: "heritage-traditional",
    title: t("Traditional Characters", "繁体字"),
    summary: t(
      "Reading traditional characters, as in Hong Kong, Taiwan and many communities abroad, by their simplified forms.",
      "认识香港、台湾和许多海外华人社区使用的繁体字，说出对应的简化字。",
    ),
    prerequisites: ["heritage-register"],
    strand: "characters",
    points: [
      {
        suffix: "characters",
        title: t("Single Characters", "单字"),
        explanation: t(
          "Many simplified characters keep the outline of the traditional one: 門 is 门, 馬 马, 鳥 鸟. Others keep a part (開 开) or take a new one (書 书). Look for what stays.",
          "很多简化字保留了繁体字的轮廓：“門”是“门”，“馬”是“马”，“鳥”是“鸟”；有的保留一部分（“開”是“开”），有的换了写法（“書”是“书”）。找一找没有变的部分。",
        ),
        question: t("What is this character in simplified form?", "这个繁体字的简化字是哪个？"),
        items: traditional,
        why: (right, shown) => t(`${shown} is ${right}.`, `“${shown}”的简化字是“${right}”。`),
      },
      {
        suffix: "words",
        title: t("Words", "词语"),
        explanation: t(
          "In a word, simplify each character in turn: 電話 is 电话, 圖書館 图书馆. A component simplified once, such as 言 to 讠 or 門 to 门, is simplified the same way in every character.",
          "读词语时，把每个字分别换成简化字：“電話”是“电话”，“圖書館”是“图书馆”。一个部件怎样简化（如“言”作“讠”，“門”作“门”），在别的字里也一样。",
        ),
        question: t("What is this word in simplified characters?", "这个词用简化字怎么写？"),
        items: traditionalWords,
        why: (right, shown) => t(`${shown} is ${right}.`, `“${shown}”用简化字写作“${right}”。`),
      },
    ],
  }),
];
