// The topics of the heritage bridges' own (docs/chinese-curriculum.md §8.2): what a learner who already speaks Chinese
// needs to write it. Characters that sound alike, 的 地 得 and the pronouns of the third person, the written forms of
// words and set phrases they say, dialect words and their Mandarin, spoken and written registers, and reading
// traditional characters. Every sentence is written for this subject.

import { type Text, type TopicDef, t } from "@ga/content";
import { joinPinyin, spokenSyllables, zhQuote } from "@ga/subject-chinese";

import { simplifying } from "../characters/traditional.ts";
import { type DrillItem, drillItem, drillTopic, lines } from "../grammar/drill.ts";
import { idiomPinyin } from "../idioms/idioms.ts";

/** items reads drill items from lines of `shown | right | wrong | wrong | wrong`. */
const items = (data: string): readonly DrillItem[] =>
  lines(data, 5).map(([shown, right, a, b, c]) => drillItem(shown!, right!, [a!, b!, c!]));

/** Gloss is what a character or word means, in Chinese and in English, with a word that shows it. */
interface Gloss {
  readonly zh: string;
  readonly en: string;
  readonly word: string;
}

/** glossOf finds a gloss, throwing when the table has none. */
function glossOf(table: ReadonlyMap<string, Gloss>, key: string, where: string): Gloss {
  const g = table.get(key);
  if (!g) throw new Error(`${where}: no gloss for ${key}`);
  return g;
}

/** glossTable reads lines of `key | zh | en | word`. */
const glossTable = (data: string): ReadonlyMap<string, Gloss> =>
  new Map(lines(data, 4).map(([key, zh, en, word]) => [key!, { zh: zh!, en: en!, word: word! }]));

/** SOUND_ALIKE are the characters said alike that the first heritage topic tells apart, each by its meaning. */
const SOUND_ALIKE = glossTable(`
再 | 表示又一次 | again | 再见
在 | 表示在什么地方，或者正在做 | at or in a place | 在家
载 | 表示用车船装运 | to carry as a load | 载重
仔 | 用在“仔细”这样的词里 | found in 仔细, careful | 仔细
做 | 表示从事一件事 | to do or to make | 做事
作 | 用在“作文”“作品”里，指写成的东西 | found in 作文 and 作品, a piece of work | 作文
坐 | 表示身体坐下 | to sit | 坐下
座 | 是数山、楼的量词 | the measure word of mountains and buildings | 一座山
已 | 表示事情已经完成 | already | 已经
以 | 用在“可以”“以后”里 | found in 可以 and 以后 | 可以
己 | 指自己 | oneself | 自己
亿 | 是数目，一万万 | a hundred million | 一亿
意 | 指意思、心意 | meaning or intention | 意思
圆 | 指像圆圈一样的形状 | round | 圆形
园 | 指种花草树木、供人游玩的地方 | a garden or park | 公园
元 | 是钱的单位 | the unit of money | 一元
员 | 指做某种事的人 | a person in a role | 运动员
晴 | 指天上没有云或很少云 | clear, of the sky | 晴天
情 | 指心情、感情 | feeling | 心情
请 | 表示请别人做事 | please, asking someone | 请问
清 | 指水干净透明 | clear, of water | 清水
`);

/** SoundItem is a sentence with a gap, its character, three that sound alike, and what in the sentence decides it. */
interface SoundItem extends DrillItem {
  readonly clue: Text;
}

/** soundItems reads lines of `sentence | right | wrong | wrong | wrong | clue in Chinese | clue in English`. */
const soundItems = (data: string): readonly SoundItem[] =>
  lines(data, 7).map(([shown, right, a, b, c, zh, en]) => ({ ...drillItem(shown!, right!, [a!, b!, c!]), clue: t(en!, zh!) }));

const soundAlike = soundItems(`
我明天＿来看你。 | 再 | 在 | 载 | 仔 | “明天……来看你”，说的是又一次来 | "come to see you tomorrow" means coming again
他＿家里写作业。 | 在 | 再 | 载 | 仔 | 后面是“家里”，说的是在什么地方写作业 | 家里 follows, so it says where he does his homework
我每天都认真＿作业。 | 做 | 作 | 坐 | 座 | 后面是“作业”，说的是做作业这件事 | 作业 follows, so it is the doing of homework
请＿下休息一会儿。 | 坐 | 做 | 作 | 座 | “……下休息一会儿”，是身体坐下来 | "… down and rest" is sitting down
这＿山很高。 | 座 | 坐 | 做 | 作 | “这……山”，数山要用量词 | "this … mountain" needs the measure word of a mountain
这篇＿文写得真好。 | 作 | 做 | 坐 | 座 | “这篇……文”，说的是写成的文章 | "this piece of … writing" is a written work
他＿经回家了。 | 已 | 以 | 己 | 亿 | “……经回家了”，说的是事情已经完成 | "… gone home" says it is already done
我们可＿一起去公园。 | 以 | 已 | 意 | 亿 | “可……一起去”，说的是能够一起去 | "may … go together" says they are able to
月亮又大又＿。 | 圆 | 园 | 元 | 员 | “又大又……”说的是月亮的形状 | "big and …" tells the moon's shape
我们去公＿玩。 | 园 | 圆 | 元 | 员 | “去公……玩”，说的是游玩的地方 | "go to the … to play" is a place to play
这支笔两＿钱。 | 元 | 园 | 圆 | 员 | 后面是“钱”，说的是钱的数目 | 钱 follows, so it is an amount of money
今天是＿天，没有下雨。 | 晴 | 情 | 请 | 清 | “没有下雨”，说的是天气好 | "no rain" tells of fine weather
＿你帮我一下。 | 请 | 情 | 晴 | 清 | “……你帮我一下”，是请别人帮忙 | "… help me" asks someone for help
小河的水很＿，能看见鱼。 | 清 | 情 | 晴 | 请 | “能看见鱼”，说的是水干净透明 | "fish can be seen" says the water is clear
`);

/** MistakeItem is a sentence with one wrong character, the character it should be, why, and the words of the other options. */
interface MistakeItem extends DrillItem {
  readonly correct: string;
  readonly clue: Text;
  readonly words: ReadonlyMap<string, string>;
}

/** mistakeItems reads lines of `sentence | wrong character | right character | clue in Chinese | clue in English | c=word c=word c=word`. */
const mistakeItems = (data: string): readonly MistakeItem[] =>
  lines(data, 6).map(([shown, wrong, correct, zh, en, ws]) => {
    const pairs = ws!.split(" ").map((p) => p.split("=") as [string, string]);
    const [a, b, c] = pairs.map(([ch]) => ch) as [string, string, string];
    for (const [ch, word] of pairs) if (!word.includes(ch) || !shown!.includes(ch)) throw new Error(`heritage: ${shown}: ${ch}=${word}`);
    return { ...drillItem(shown!, wrong!, [a, b, c]), correct: correct!, clue: t(en!, zh!), words: new Map(pairs) };
  });

const soundAlikeMistakes = mistakeItems(`
我们一起去公圆玩。 | 圆 | 园 | “去公……玩”，说的是游玩的地方 | "go to the … to play" is a place to play | 们=我们 起=一起 玩=玩
他以经吃过饭了。 | 以 | 已 | “……经吃过饭了”，说的是事情已经完成 | "… eaten" says it is already done | 他=他 经=已经 饭=吃饭
今天是情天，我们去爬山。 | 情 | 晴 | 说的是天气，好天气才去爬山 | it is the weather, fine enough to climb | 今=今天 爬=爬山 山=爬山
请你在说一遍。 | 在 | 再 | “……说一遍”，是又说一次 | "say it … once more" is saying it again | 请=请 你=你 遍=一遍
妈妈在厨房作饭。 | 作 | 做 | “……饭”，说的是做饭这件事 | cooking is a thing done | 妈=妈妈 厨=厨房 饭=做饭
他做在椅子上看书。 | 做 | 坐 | “……在椅子上”，说的是身体坐着 | "… on the chair" is sitting | 椅=椅子 看=看书 书=看书
月亮又大又园。 | 园 | 圆 | “又大又……”说的是月亮的形状 | "big and …" tells the moon's shape | 月=月亮 亮=月亮 大=大
小河的水很情。 | 情 | 清 | 说的是河水干净透明 | it says the river water is clear | 小=小河 河=小河 水=水
这支铅笔三园钱。 | 园 | 元 | 后面是“钱”，说的是钱的数目 | 钱 follows, so it is an amount of money | 铅=铅笔 笔=铅笔 钱=钱
我再家门口等你。 | 再 | 在 | “……家门口等你”，说的是在什么地方 | "wait for you … the door" says where | 家=家门口 门=门口 等=等
心晴不好的时候，可以听听音乐。 | 晴 | 情 | “心……不好”，说的是心情 | "in a bad …" is a mood | 心=心情 听=听听 音=音乐
他是我们学校的运动圆。 | 圆 | 员 | “运动……”，说的是做运动的人 | "sports …" is a person who does sport | 学=学校 校=学校 运=运动
`);

/** soundOf finds a sound-alike character's gloss. */
const soundOf = (c: string): Gloss => glossOf(SOUND_ALIKE, c, "heritage-sound-alike");

/** soundItemOf and mistakeItemOf find an item by what it shows. */
const soundItemOf = new Map(soundAlike.map((i) => [i.shown, i]));
const mistakeItemOf = new Map(soundAlikeMistakes.map((i) => [i.shown, i]));

/** DeItem is a sentence with 的, 地 and 得 all right, three with one of them wrong, and the word each one goes with. */
interface DeItem extends DrillItem {
  /** marks are each 的, 地 and 得 of the sentence with the word it goes with: after it for 的 and 地, before it for 得. */
  readonly marks: readonly (readonly [string, string])[];
}

/** DE_RULE is what each de goes with. */
const DE_RULE: Readonly<Record<string, Text>> = {
  的: t("的 comes before a person or thing", "“的”用在人或事物前面"),
  地: t("地 comes before an action", "“地”用在动作前面"),
  得: t("得 comes after an action or quality, before how or how much", "“得”用在动作或形容词后面，引出怎么样、到什么程度"),
};

/** markText says where one de of a sentence stands. */
const markText = ([de, word]: readonly [string, string]): Text =>
  de === "得"
    ? t(`得 follows ${word} and tells how`, `“得”跟在“${word}”后面，说明怎么样`)
    : de === "的"
      ? t(`的 is followed by ${word}, a person or thing`, `“的”后面是“${word}”，是人或事物`)
      : t(`地 is followed by ${word}, an action`, `“地”后面是“${word}”，是动作`);

/** deItems reads lines of `right | wrong | wrong | wrong | de=word …`, checking that each mark stands by its word. */
const deItems = (data: string): readonly DeItem[] =>
  lines(data, 5).map(([right, a, b, c, ms]) => {
    const marks = ms!.split(" ").map((m) => m.split("=") as [string, string]);
    for (const [de, word] of marks) {
      if (!right!.includes(de === "得" ? `${word}${de}` : `${de}${word}`)) throw new Error(`heritage: ${right}: ${de}=${word}`);
    }
    return { ...drillItem("", right!, [a!, b!, c!]), marks };
  });

const deDiDe = deItems(`
我的妹妹慢慢地走过来。 | 我地妹妹慢慢地走过来。 | 我的妹妹慢慢的走过来。 | 我得妹妹慢慢地走过来。 | 的=妹妹 地=走
他的弟弟跑得很快。 | 他地弟弟跑得很快。 | 他的弟弟跑的很快。 | 他的弟弟跑地很快。 | 的=弟弟 得=跑
美丽的小鸟在树上快乐地唱歌。 | 美丽地小鸟在树上快乐地唱歌。 | 美丽的小鸟在树上快乐的唱歌。 | 美丽的小鸟在树上快乐得唱歌。 | 的=小鸟 地=唱歌
妈妈做的菜好吃得不得了。 | 妈妈做地菜好吃得不得了。 | 妈妈做的菜好吃的不得了。 | 妈妈做的菜好吃地不得了。 | 的=菜 得=好吃
同学们认真地听老师的话。 | 同学们认真的听老师的话。 | 同学们认真地听老师地话。 | 同学们认真得听老师的话。 | 地=听 的=话
我的弟弟笑得眼泪都流出来了。 | 我的弟弟笑的眼泪都流出来了。 | 我地弟弟笑得眼泪都流出来了。 | 我的弟弟笑地眼泪都流出来了。 | 的=弟弟 得=笑
绿绿的草地上，小狗开心地跑来跑去。 | 绿绿地草地上，小狗开心地跑来跑去。 | 绿绿的草地上，小狗开心的跑来跑去。 | 绿绿的草地上，小狗开心得跑来跑去。 | 的=草地 地=跑
姐姐的字写得很漂亮。 | 姐姐地字写得很漂亮。 | 姐姐的字写的很漂亮。 | 姐姐的字写地很漂亮。 | 的=字 得=写
雨哗哗地下个不停，路上的人都打着伞。 | 雨哗哗的下个不停，路上的人都打着伞。 | 雨哗哗地下个不停，路上地人都打着伞。 | 雨哗哗得下个不停，路上的人都打着伞。 | 地=下 的=人
爷爷高兴地说：“你长得真高！” | 爷爷高兴的说：“你长得真高！” | 爷爷高兴地说：“你长的真高！” | 爷爷高兴得说：“你长得真高！” | 地=说 得=长
我们静静地坐着，听奶奶讲过去的故事。 | 我们静静的坐着，听奶奶讲过去的故事。 | 我们静静地坐着，听奶奶讲过去地故事。 | 我们静静得坐着，听奶奶讲过去的故事。 | 地=坐 的=故事
`);

const deItemOf = new Map(deDiDe.map((i) => [i.right, i]));

/** deSlip finds the one de a wrong sentence changes and the mark of the right sentence it stands for. */
function deSlip(wrong: string, right: string): { wrote: string; mark: readonly [string, string] } {
  const w = [...wrong];
  const r = [...right];
  const at = r.findIndex((c, i) => c !== w[i]);
  const de = r[at]!;
  const item = deItemOf.get(right)!;
  const mark = item.marks.find(([d, word]) =>
    d === "得"
      ? r.slice(0, at).join("").endsWith(word)
      : r
          .slice(at + 1)
          .join("")
          .startsWith(word),
  );
  if (!mark || mark[0] !== de) throw new Error(`heritage: no mark for ${wrong}`);
  return { wrote: w[at]!, mark };
}

/** PRONOUN says whom each pronoun points to. */
const PRONOUN: Readonly<Record<string, Text>> = {
  他: t("one man or boy", "一个男性"),
  她: t("one woman or girl", "一个女性"),
  它: t("one animal or thing", "一个动物或东西"),
  他们: t("more than one person, men or men and women together", "不止一个人，都是男性或男女都有"),
  她们: t("more than one woman or girl", "不止一个女性"),
  它们: t("more than one animal or thing", "不止一个动物或东西"),
};

/** PronounItem is a sentence with a gap for a pronoun, who or what the gap points to, and the words it stands for. */
interface PronounItem extends DrillItem {
  readonly who: Text;
  readonly back: string;
}

/** pronounItems reads lines of `sentence | right | wrong | wrong | wrong | words it stands for | who in Chinese | who in English`. */
const pronounItems = (data: string): readonly PronounItem[] =>
  lines(data, 8).map(([shown, right, a, b, c, back, zh, en]) => {
    if (!shown!.includes(back!)) throw new Error(`heritage: ${shown}: ${back}`);
    return { ...drillItem(shown!, right!, [a!, b!, c!]), back: back!, who: t(en!, zh!) };
  });

const pronouns = pronounItems(`
我家有一只小猫，＿每天都在窗台上睡觉。 | 它 | 他 | 她 | 它们 | 小猫 | 一只小猫，是一个动物 | one cat, an animal
妈妈下班回来了，＿手里拿着一束花。 | 她 | 他 | 它 | 她们 | 妈妈 | 妈妈，是一位女性 | mother, a woman
爸爸很忙，＿每天很晚才回家。 | 他 | 她 | 它 | 他们 | 爸爸 | 爸爸，是一位男性 | father, a man
树上有两只小鸟，＿在唱歌。 | 它们 | 他们 | 她们 | 它 | 两只小鸟 | 两只小鸟，是不止一个动物 | two birds, more than one animal
姐姐和妹妹去公园了，＿玩得很开心。 | 她们 | 他们 | 它们 | 她 | 姐姐和妹妹 | 姐姐和妹妹，是两个女孩 | two sisters, both girls
哥哥和我一起踢球，＿踢得比我好。 | 他 | 她 | 它 | 他们 | 哥哥 | 踢得比“我”好的哥哥，是一个男孩 | the brother who plays better than me, one boy
这本书很有意思，我把＿看了两遍。 | 它 | 他 | 她 | 它们 | 这本书 | 这本书，是一件东西 | the book, a thing
奶奶的眼睛不好，我常常给＿读报纸。 | 她 | 他 | 它 | 她们 | 奶奶 | 奶奶，是一位女性 | grandmother, a woman
小明和小红是我的同学，＿都住在我家旁边。 | 他们 | 她们 | 它们 | 他 | 小明和小红 | 小明和小红，两个人有男有女 | Xiaoming and Xiaohong, a boy and a girl
王老师是一位女老师，＿讲课很有趣。 | 她 | 他 | 它 | 她们 | 王老师 | 王老师，句子说她是女老师 | Teacher Wang, a woman by the sentence
院子里有三棵苹果树，＿都结满了果子。 | 它们 | 他们 | 她们 | 它 | 三棵苹果树 | 三棵苹果树，是不止一样东西 | three apple trees, more than one thing
`);

const pronounItemOf = new Map(pronouns.map((i) => [i.shown, i]));

/** pronounOf says whom a pronoun points to. */
const pronounOf = (p: string): Text => {
  const g = PRONOUN[p];
  if (!g) throw new Error(`heritage: no pronoun ${p}`);
  return g;
};

/** MISWRITTEN are the characters written in place of others in the words and set phrases a learner says, each by a word of its own. */
const MISWRITTEN = glossTable(`
票 | 车票的“票” | 票 of 车票, a ticket | 车票
飘 | 飘动的“飘” | 飘 of 飘动, to drift | 飘动
凉 | 凉快的“凉” | 凉 of 凉快, cool | 凉快
换 | 交换的“换” | 换 of 交换, to exchange | 交换
洗 | 洗手的“洗” | 洗 of 洗手, to wash | 洗手
唤 | 呼唤的“唤” | 唤 of 呼唤, to call | 呼唤
有 | 没有的“有” | 有 of 没有, to have | 没有
棚 | 草棚的“棚” | 棚 of 草棚, a shed | 草棚
明 | 明天的“明” | 明 of 明天, bright | 明天
到 | 到达的“到” | 到 of 到达, to arrive | 到达
支 | 一支笔的“支” | 支, the measure word of pens | 一支笔
只 | 只有的“只” | 只 of 只有, only | 只有
冬 | 冬天的“冬” | 冬 of 冬天, winter | 冬天
息 | 休息的“息” | 息 of 休息, rest | 休息
动 | 运动的“动” | 动 of 运动, to move | 运动
侯 | 王侯的“侯” | 侯 of 王侯, a lord | 王侯
十 | 数目“十” | 十, the number ten | 十个
实 | 实在的“实” | 实 of 实在, real | 实在
应 | 应该的“应” | 应 of 应该, ought | 应该
位 | 座位的“位” | 位 of 座位, a seat | 座位
音 | 声音的“音” | 音 of 声音, a sound | 声音
已 | 已经的“已” | 已 of 已经, already | 已经
克 | 克服的“克” | 克 of 克服, to overcome | 克服
意 | 意思的“意” | 意 of 意思, meaning | 意思
习 | 学习的“习” | 习 of 学习, to practise | 学习
小 | 大小的“小” | 小 of 大小, small | 大小
销 | 销售的“销” | 销 of 销售, to sell | 销售
的 | 我的书的“的” | 的 of 我的书, of | 我的书
决 | 决定的“决” | 决 of 决定, to decide | 决定
角 | 角落的“角” | 角 of 角落, a corner | 角落
古 | 古代的“古” | 古 of 古代, ancient | 古代
是 | 是非的“是” | 是 of 是非, right | 是非
顾 | 照顾的“顾” | 顾 of 照顾, to look after | 照顾
被 | 被子的“被” | 被 of 被子, a quilt | 被子
背 | 背包的“背” | 背 of 背包, the back | 背包
谁 | 谁的“谁” | 谁, who | 谁的
遭 | 遭遇的“遭” | 遭 of 遭遇, to meet with | 遭遇
早 | 早上的“早” | 早 of 早上, early | 早上
漆 | 油漆的“漆” | 漆 of 油漆, paint | 油漆
摸 | 用手摸的“摸” | 摸, to touch | 摸一摸
洋 | 海洋的“洋” | 洋 of 海洋, ocean | 海洋
谟 | 指计谋的“谟” | 谟, a plan | 宏谟
急 | 着急的“急” | 急 of 着急, anxious | 着急
破 | 破坏的“破” | 破 of 破坏, broken | 破坏
代 | 代替的“代” | 代 of 代替, in place of | 代替
励 | 鼓励的“励” | 励 of 鼓励, to encourage | 鼓励
股 | 一股水的“股” | 股, a measure word of streams | 一股水
做 | 做事的“做” | 做 of 做事, to do | 做事
头 | 头发的“头” | 头 of 头发, the head | 头发
陆 | 陆地的“陆” | 陆 of 陆地, land | 陆地
奏 | 演奏的“奏” | 奏 of 演奏, to play music | 演奏
使 | 使用的“使” | 使 of 使用, to use | 使用
自 | 自己的“自” | 自 of 自己, self | 自己
子 | 孩子的“子” | 子 of 孩子, a child | 孩子
夏 | 夏天的“夏” | 夏 of 夏天, summer | 夏天
起 | 起床的“起” | 起 of 起床, to rise | 起床
尚 | 高尚的“尚” | 尚 of 高尚, noble | 高尚
未 | 未来的“未” | 未 of 未来, not yet | 未来
斤 | 一斤的“斤” | 斤, a unit of weight | 一斤
昧 | 愚昧的“昧” | 昧 of 愚昧, ignorant | 愚昧
珠 | 珍珠的“珠” | 珠 of 珍珠, a pearl | 珍珠
手 | 手指的“手” | 手 of 手指, the hand | 手指
句 | 句子的“句” | 句 of 句子, a sentence | 句子
俩 | 我们俩的“俩” | 俩 of 我们俩, the two of us | 我们俩
在 | 在家的“在” | 在 of 在家, at | 在家
`);

/** SpokenItem is a word or set phrase by its pinyin and meaning, its written form, three miswritings and why it is written so. */
interface SpokenItem extends DrillItem {
  readonly syllables: readonly string[];
  readonly meaning: Text;
  readonly note: Text;
}

/** spokenItems reads lines of `pinyin | meaning in Chinese | in English | right | wrong | wrong | wrong | note in Chinese | in English`. */
const spokenItems = (data: string, pinyin: (text: string, syllables: readonly string[]) => string): readonly SpokenItem[] =>
  lines(data, 9).map(([py, zh, en, right, a, b, c, nz, ne]) => {
    if (py!.split(" ").length !== [...right!].length) throw new Error(`heritage: the pinyin of ${right}`);
    const syllables = spokenSyllables(right!, py!.split(" "));
    for (const w of [a!, b!, c!]) for (const [i, ch] of [...w].entries()) if (ch !== [...right!][i]) glossOf(MISWRITTEN, ch, right!);
    return {
      ...drillItem(`${pinyin(right!, syllables)}（${zh}）`, right!, [a!, b!, c!]),
      syllables,
      meaning: t(en!, zh!),
      note: t(ne!, nz!),
    };
  });

const spokenWords = spokenItems(
  `
piào liang | 好看 | pretty | 漂亮 | 票亮 | 飘亮 | 漂凉 | “漂亮”是固定的写法，两个字都不能换成同音的“票”“飘”“凉” | 漂亮 is a fixed spelling: neither character may become the like-sounding 票, 飘 or 凉
xǐ huan | 爱，对人或事物有好感 | to like | 喜欢 | 喜换 | 洗欢 | 喜唤 | “喜”“欢”都是高兴的意思，合起来是喜爱 | 喜 and 欢 both mean glad, and together they mean to like
péng you | 彼此友好的人 | friend | 朋友 | 朋有 | 棚友 | 明友 | “朋”“友”都是朋友的意思，“友”是友好的“友” | 朋 and 友 both mean friend; 友 is the 友 of 友好, friendly
zhī dao | 明白，了解 | to know | 知道 | 知到 | 支道 | 只道 | “知”是知识的“知”，“道”是说出道理的“道” | 知 is the 知 of knowledge, 道 the 道 of a reason told
dōng xi | 泛指各种物品 | thing | 东西 | 冬西 | 东息 | 动西 | “东西”本是东方和西方，后来泛指各种物品 | 东西 was east and west, and came to mean things of every kind
shí hou | 某一段时间 | time, when | 时候 | 时侯 | 十候 | 实候 | “时”是时间，“候”是等候的“候”，指一段时间 | 时 is time, and 候 is the 候 of waiting, a span of time
yīn wèi | 说明原因 | because | 因为 | 应为 | 因位 | 音为 | “因”是原因的“因”，“为”是为了的“为” | 因 is the 因 of a cause, 为 the 为 of for
kě yǐ | 能，允许 | may, can | 可以 | 可已 | 克以 | 可意 | “可以”的“以”是以后的“以”，不是已经的“已” | the 以 of 可以 is that of 以后, not 已 of already
xiāo xi | 音信，新闻 | news | 消息 | 消习 | 小息 | 销息 | “消”是消失，“息”是生长，原指事物的变化，后来指音信 | 消 is waning and 息 growing; first the change of things, then news of them
jué de | 认为，感到 | to feel, to think | 觉得 | 觉的 | 决得 | 角得 | “觉”是感觉的“觉”，“得”是得到的“得”，觉得就是感觉到 | 觉 is the 觉 of feeling, 得 of getting: to come to feel
gù shi | 讲述的事情 | story | 故事 | 古事 | 故是 | 顾事 | “故”是过去的、旧的，“事”是事情，故事是过去的事 | 故 is past, 事 is a matter: a story is what happened
zhǔn bèi | 预先安排 | to prepare | 准备 | 准被 | 准背 | 谁备 | “准”是准确的“准”，“备”是具备、预备的“备” | 准 is the 准 of exact, 备 the 备 of having ready
`,
  (_text, s) => joinPinyin(s),
);

const setPhrases = spokenItems(
  `
luàn qī bā zāo | 又乱又没有条理 | in a mess | 乱七八糟 | 乱七八遭 | 乱七八早 | 乱漆八糟 | “七”“八”是数目字，表示杂乱；“糟”是糟糕的“糟” | 七 and 八 are numbers that mean a jumble, and 糟 is the 糟 of 糟糕, bad
yì mú yí yàng | 完全相同 | exactly alike | 一模一样 | 一摸一样 | 一模一洋 | 一谟一样 | “模”是模样、模子的“模”，不是用手摸的“摸” | 模 is the 模 of a mould or a look, not 摸 of touching
pò bù jí dài | 急得不能再等 | unable to wait | 迫不及待 | 迫不急待 | 破不及待 | 迫不及代 | “及”是来得及的“及”，“待”是等待的“待” | 及 is the 及 of in time, 待 the 待 of waiting
zài jiē zài lì | 一次又一次加倍努力 | to keep up the effort | 再接再厉 | 再接再励 | 在接再厉 | 再接在厉 | “再”是又一次；“厉”同“砺”，是把刀磨快 | 再 is again, and 厉, the same as 砺, is to whet a blade
yì gǔ zuò qì | 趁着劲头一下子做完 | in one burst of effort | 一鼓作气 | 一股作气 | 一鼓做气 | 一古作气 | “鼓”是打仗时击鼓，“作”是振作，一击鼓就振作起士气 | 鼓 is the war drum, 作 is to rouse: at the first drum the troops are roused
zǒu tóu wú lù | 无路可走 | at the end of one's tether | 走投无路 | 走头无路 | 走投无陆 | 奏投无路 | “投”是投奔，无处投奔、无路可走 | 投 is to seek refuge: nowhere to go, no road to take
zì shǐ zhì zhōng | 从开头到结尾 | from start to finish | 自始至终 | 自使至终 | 自始自终 | 子始至终 | “自”是从，“始”是开始，“至”是到 | 自 is from, 始 the start, 至 to
bù zhī bù jué | 没有察觉到 | without noticing | 不知不觉 | 不知不决 | 不只不觉 | 不知不角 | “觉”是察觉的“觉”，“知”是知道的“知” | 觉 is the 觉 of noticing, 知 that of knowing
qī shàng bā xià | 心里慌乱不安 | on tenterhooks | 七上八下 | 七上八夏 | 起上八下 | 七尚八下 | “上”“下”是方向，心里像东西上上下下不安定 | 上 and 下 are up and down: a heart going up and down
jīn jīn yǒu wèi | 吃得或听得很有滋味 | with relish | 津津有味 | 津津有未 | 斤斤有味 | 津津有昧 | “味”是滋味的“味”，“津津”是很有兴味的样子 | 味 is the 味 of taste, and 津津 is relishing it
shǒu zhū dài tù | 死守经验，不知变通 | waiting for windfalls | 守株待兔 | 守珠待兔 | 守株代兔 | 手株待兔 | “守”是守着，“株”是露出地面的树桩，“待”是等待 | 守 is to keep watch, 株 a tree stump, 待 to wait
yì jǔ liǎng dé | 做一件事得到两种好处 | two birds with one stone | 一举两得 | 一举两的 | 一句两得 | 一举俩得 | “举”是举动，“两”是两种，“得”是得到 | 举 is a deed, 两 two, 得 to gain
`,
  idiomPinyin,
);

const spokenOf = new Map([...spokenWords, ...setPhrases].map((i) => [i.right, i]));

/** spokenWhy writes a spoken word or set phrase, says why it is written so, and reads its pinyin back into characters. */
const spokenWhy = (right: string): Text => {
  const item = spokenOf.get(right)!;
  const chars = [...right];
  const py = item.shown.slice(0, item.shown.indexOf("（"));
  return t(
    `**${right}** (${py}) means ${item.meaning.en}.\n\n${item.note.en}. The usual miswritings, ${item.wrong.join(", ")}, swap a character for one that sounds or looks alike.\n\n**Check.** Read ${py} back into characters: ${item.syllables.map((s, i) => `${s} is ${chars[i]}`).join(", ")}, which writes ${right}.`,
    `“**${right}**”（${py}）的意思是${item.meaning["zh-CN"]}。\n\n${item.note["zh-CN"]}。常见的错误写法“${item.wrong.join("”“")}”都换成了读音或字形相近的字。\n\n**检验。** 从拼音 ${py} 读回汉字：${item.syllables.map((s, i) => `${s} 是“${chars[i]}”`).join("，")}，正好是“${right}”。`,
  );
};

/** spokenWhyNot names the character a miswriting changes, by a word of its own. */
const spokenWhyNot = (wrong: string, right: string): Text => {
  const item = spokenOf.get(right)!;
  const r = [...right];
  const w = [...wrong];
  const at = r.findIndex((c, i) => c !== w[i]);
  const g = glossOf(MISWRITTEN, w[at]!, right);
  return t(
    `${wrong} writes ${w[at]} (${g.en}) in place of ${r[at]}; it has nothing to do with "${item.meaning.en}".`,
    `“${wrong}”把“${r[at]}”写成了“${w[at]}”：“${w[at]}”是${g.zh}，和“${item.meaning["zh-CN"]}”的意思不相干。`,
  );
};

/** showSpoken shows a word's pinyin with its meaning in each locale. */
const showSpoken = (shown: string): Text => {
  const item = [...spokenOf.values()].find((i) => i.shown === shown)!;
  const py = shown.slice(0, shown.indexOf("（"));
  return t(`${py} (${item.meaning.en})`, shown);
};

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
const dialectNameEn = (d: string) => (d === "粤" ? "Cantonese" : "Shanghainese");

/** byMandarin and byDialect find a row of DIALECT by its Mandarin or its dialect word. */
const byMandarin = new Map(DIALECT.map((row) => [row[2], row]));
const byDialect = new Map(DIALECT.map((row) => [row[1], row]));

/** toMandarin asks for the Mandarin of a dialect word, fromMandarin for the dialect word of a Mandarin one. */
const toMandarin = DIALECT.map(([d, word, mandarin], i) => {
  const other = (k: number) => DIALECT[(i + k) % DIALECT.length]![2];
  return drillItem(`${dialectName(d)}“${word}”`, mandarin, [other(1), other(2), other(3)]);
});
const fromMandarin = DIALECT.map(([d, word, mandarin], i) => {
  const other = (k: number) => DIALECT[(i + k) % DIALECT.length]![1];
  return drillItem(`${dialectName(d)}里的“${mandarin}”`, word, [other(1), other(2), other(3)]);
});

/** Spoken is a spoken word, the word writing uses, what that means, and a sentence with the spoken word. */
interface Spoken {
  readonly spoken: string;
  readonly written: string;
  readonly meaning: Text;
  readonly sentence: string;
}

/** SPOKEN are spoken or regional words and the words a piece of writing uses instead, each in a sentence of speech. */
const SPOKEN: readonly Spoken[] = lines(
  `
啥 | 什么 | 问是什么事物 | what | 你在干啥？
咋 | 怎么 | 问方式或原因 | how or why | 这道题咋做？
老是 | 总是 | 一直这样 | always | 他老是迟到。
甭 | 不用 | 不需要 | need not | 甭客气。
这会儿 | 此时 | 这个时候 | at this moment | 这会儿天已经黑了。
俺 | 我 | 说话的人自己 | I | 俺是三年级的学生。
搁 | 放 | 使东西处在某个地方 | to put | 把书搁在桌上。
唠嗑 | 聊天 | 随便地谈话 | to chat | 奶奶和邻居在院子里唠嗑。
溜达 | 散步 | 随便走走 | to stroll | 晚饭后，爷爷出去溜达。
瞅 | 看 | 用眼睛看 | to look | 你瞅瞅这幅画。
晌午 | 中午 | 白天十二点前后 | noon | 晌午太阳最热。
明儿个 | 明天 | 今天的下一天 | tomorrow | 明儿个我们去春游。
`,
  5,
).map(([spoken, written, zh, en, sentence]) => {
  if (!sentence!.includes(spoken!)) throw new Error(`heritage: ${sentence}: ${spoken}`);
  return { spoken: spoken!, written: written!, meaning: t(en!, zh!), sentence: sentence! };
});

const spokenByWritten = new Map(SPOKEN.map((s) => [s.written, s]));
const spokenBySpoken = new Map(SPOKEN.map((s) => [`“${s.spoken}”`, s]));

/** FORMAL are the wordings of a notice: the plain and polite one, the words that make it so, and three spoken ones with what is wrong with each. */
const FORMAL = lines(
  `
明天上午九点在礼堂开会，请准时参加。 | 请、准时 | please, on time | 明儿个九点礼堂开会，别迟到啊。 | 用了口语词“明儿个”和语气词“啊” | uses the spoken 明儿个 and the particle 啊 | 明天九点咱们去礼堂开个会呗。 | 用了口语的“咱们”“开个会”和语气词“呗” | uses the spoken 咱们 and 开个会 and the particle 呗 | 大伙儿明早九点礼堂见哈。 | 用了口语词“大伙儿”和语气词“哈” | uses the spoken 大伙儿 and the particle 哈
图书馆周一闭馆，请大家合理安排时间。 | 闭馆、请 | closed, please | 图书馆周一不开门哦，大家看着办吧。 | 用了语气词“哦”，“看着办吧”是随口的说法 | uses the particle 哦, and 看着办吧 is offhand speech | 礼拜一图书馆关门，甭去了。 | 用了口语的“礼拜一”“甭” | uses the spoken 礼拜一 and 甭 | 周一图书馆歇业啦，别白跑一趟。 | 用了语气词“啦”，“白跑一趟”是口语 | uses the particle 啦, and 白跑一趟 is speech
请勿在走廊奔跑。 | 请勿 | please do not | 别在走廊里瞎跑啊。 | 用了口语的“瞎跑”和语气词“啊” | uses the spoken 瞎跑 and the particle 啊 | 走廊里不许乱跑哈。 | 用了语气词“哈”，语气像当面说话 | uses the particle 哈 and sounds like talk face to face | 走廊上跑啥跑？ | 用了口语词“啥”，还是质问的语气，不礼貌 | uses the spoken 啥 and a rude, scolding question
感谢您的来信，我已收到。 | 感谢、您、来信、已 | thank you, the polite you, your letter, already | 信收到了，谢啦。 | 用了随口的“谢啦”，对收信人不够礼貌 | uses the offhand 谢啦, not polite to the writer | 你的信俺收着了。 | 用了方言词“俺”和口语的“收着了” | uses the dialect 俺 and the spoken 收着了 | 收到你的信啦，开心死了。 | 用了语气词“啦”和夸张的口语“开心死了” | uses the particle 啦 and the spoken exaggeration 开心死了
如有疑问，请与班主任联系。 | 如有、请、与 | if there are, please, with | 有啥不懂的找班主任去。 | 用了口语词“啥”，“找……去”像随口吩咐 | uses the spoken 啥, and 找……去 sounds like an offhand order | 不明白就问班主任呗。 | 用了语气词“呗” | uses the particle 呗 | 有问题甭客气，找班主任哈。 | 用了口语的“甭”和语气词“哈” | uses the spoken 甭 and the particle 哈
因天气原因，运动会延期举行。 | 因、延期、举行 | owing to, postponed, held | 天不好，运动会往后推了。 | “天不好”“往后推”都是口语 | 天不好 and 往后推 are both speech | 下雨了，运动会改天再开吧。 | 用了语气词“吧”，“改天”没说清日期 | uses the particle 吧, and 改天 gives no date | 老天不给面子，运动会挪日子了。 | “老天不给面子”是开玩笑，“挪日子”是口语 | 老天不给面子 is a joke, and 挪日子 is speech
请保持安静，不要大声喧哗。 | 请、保持、喧哗 | please, keep, make noise | 都小点声儿，别嚷嚷。 | 用了口语的“小点声儿”“嚷嚷” | uses the spoken 小点声儿 and 嚷嚷 | 安静点儿行不行？ | 用了口语的“点儿”，反问语气不礼貌 | uses the spoken 点儿 and an impatient question | 大家伙儿别吵吵了。 | 用了口语的“大家伙儿”“吵吵” | uses the spoken 大家伙儿 and 吵吵
在操场拾到黑色水杯一个，请失主到办公室认领。 | 拾到、失主、认领 | found, the owner, to claim | 谁丢了个黑杯子？去办公室拿。 | 用随口的问句开头，“去办公室拿”像吩咐，没有“请” | opens with an offhand question and orders without 请 | 操场上捡了个杯子，谁的赶紧来拿哈。 | 用了语气词“哈”，“赶紧来拿”是口语 | uses the particle 哈, and 赶紧来拿 is speech | 有人掉了黑杯子，自己去办公室找吧。 | 用了口语的“掉了”和语气词“吧” | uses the spoken 掉了 and the particle 吧
为了大家的健康，校园内禁止吸烟。 | 校园内、禁止、吸烟 | within the school, forbidden, smoking | 学校里别抽烟啊，对身体不好。 | 用了语气词“啊”和口语的“别抽烟” | uses the particle 啊 and the spoken 别抽烟 | 抽烟找个别的地方去。 | 像当面打发人，不礼貌，也没说清规定 | sounds like shooing someone off, impolite and no rule stated | 校园里甭抽烟了哈。 | 用了口语的“甭”和语气词“哈” | uses the spoken 甭 and the particle 哈
欢迎各位家长参加本周五的家长会。 | 各位、本周五 | all of you, this Friday | 家长们周五来开会哈。 | 用了语气词“哈” | uses the particle 哈 | 周五开家长会，爸妈都来呗。 | 用了口语的“爸妈”和语气词“呗” | uses the spoken 爸妈 and the particle 呗 | 礼拜五家长会，记得来啊。 | 用了口语的“礼拜五”和语气词“啊” | uses the spoken 礼拜五 and the particle 啊
本店营业时间为每天八点至二十点。 | 本店、营业时间、为、至 | this shop, opening hours, is, to | 咱这店八点开门，晚上八点关门。 | 用了口语的“咱这店” | uses the spoken 咱这店 | 我们店每天八点开到晚上八点哦。 | 用了语气词“哦” | uses the particle 哦 | 小店早八晚八，欢迎来玩儿。 | “早八晚八”是随口的简称，“来玩儿”是口语 | 早八晚八 is an offhand short form, and 来玩儿 is speech
`,
  12,
);

const formal = FORMAL.map(([right, , , a, , , b, , , c]) => drillItem("", right!, [a!, b!, c!]));
const formalWords = new Map(FORMAL.map(([right, zh, en]) => [right!, t(en!, zh!)]));
const formalFault = new Map(FORMAL.flatMap((row) => [3, 6, 9].map((k) => [row[k]!, t(row[k + 2]!, row[k + 1]!)] as const)));

/** faultOf says what is wrong with a spoken wording of a notice. */
const faultOf = (wrong: string): Text => {
  const f = formalFault.get(wrong);
  if (!f) throw new Error(`heritage: no fault for ${wrong}`);
  return f;
};

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

/** traditionalTeaching explains the first traditional characters, each by how it changed. */
const traditionalTeaching = simplifying(
  {
    學: t("Its top is written more simply, and 子 below stays.", "上面简化了，下面的“子”不变。"),
    國: t("The frame 囗 stays, and 或 inside becomes 玉.", "外框“囗”不变，里面的“或”换成“玉”。"),
    書: t("It takes a new, much shorter form, from running hand.", "换成了简短的新写法，来自草书。"),
    東: t("It takes a shorter form, from running hand.", "换成了来自草书的简短写法。"),
    車: t("It takes a shorter form, from running hand.", "换成了来自草书的简短写法。"),
    馬: t("It keeps the outline in a shorter form, from running hand.", "保留轮廓，换成来自草书的简短写法。"),
    鳥: t("It keeps the outline in a shorter form, from running hand.", "保留轮廓，换成来自草书的简短写法。"),
    說: t("言 on the left becomes 讠, and 兌 becomes 兑.", "左边“言”作“讠”，右边“兌”作“兑”。"),
    見: t("It keeps the outline, written more simply.", "保留轮廓，写法更简单。"),
    長: t("It takes a shorter form, from running hand.", "换成了来自草书的简短写法。"),
    門: t("It keeps the outline of the frame in three strokes.", "保留门框的轮廓，只写三笔。"),
    開: t("The frame 門 is dropped, and 开 inside is kept.", "去掉外框“門”，留下里面的“开”。"),
    電: t("雨 on top is dropped, and the part below is kept.", "去掉上面的“雨”，留下下面的部分。"),
    愛: t("心 in the middle is dropped, and 友 is written below.", "去掉中间的“心”，下面写作“友”。"),
    時: t("寺 on the right becomes 寸.", "右边的“寺”换成“寸”。"),
    飛: t("Only part of its shape is kept.", "只保留了字形的一部分。"),
  },
  [traditional, traditionalWords],
);

/** whole puts the answer into the gap of a sentence. */
const whole = (shown: string, right: string): string => shown.replace("＿", right);

const firstSound = soundAlike[0]!;
const firstMistake = soundAlikeMistakes[0]!;
const firstDe = deDiDe[0]!;
const firstPronoun = pronouns[0]!;
const firstSpoken = spokenWords[5]!;
const firstPhrase = setPhrases[10]!;
const firstSpokenWord = SPOKEN[0]!;

/** heritageTopics are the topics of the heritage bridges' own, in the order the bridges teach them. */
export const heritageTopics: readonly TopicDef[] = [
  drillTopic({
    id: "heritage-sound-alike",
    title: t("Characters That Sound Alike", "同音字"),
    summary: t(
      "Choosing among characters said the same way, such as 在 and 再, 做 and 坐, 园 and 圆, by what the sentence means.",
      "根据句子的意思，在读音相同的字中选对字，如“在”和“再”，“做”和“坐”，“园”和“圆”。",
    ),
    intro: t(
      `Many characters are said alike but mean different things, and speaking does not tell them apart: writing does. Take ${firstSound.shown} Here ${firstSound.clue.en}, so it is ${firstSound.right}, which means ${soundOf(firstSound.right).en}: ${whole(firstSound.shown, firstSound.right)} 在, said the same, means ${soundOf("在").en}.\n\nThe first knowledge point chooses the character a gap needs, the second finds the wrong one in a sentence.`,
      `很多字读音相同，意思却不一样，说话时分不出来，写字时就要分清。比如${zhQuote(firstSound.shown)}：${firstSound.clue["zh-CN"]}，所以是“${firstSound.right}”，“${firstSound.right}”${soundOf(firstSound.right).zh}：${whole(firstSound.shown, firstSound.right)}读音相同的“在”${soundOf("在").zh}。\n\n第一个知识点按意思选字填空，第二个找出句子里的错别字。`,
    ),
    prerequisites: ["recognizing-characters-1-10"],
    strand: "words",
    points: [
      {
        suffix: "choose",
        title: t("Choosing the Character", "选对字"),
        explanation: t(
          `Characters that sound the same are told apart by their meaning: 在 says where something is, 再 that it happens again; 坐 is to sit, 做 to do, 座 counts mountains and buildings, and 作 is found in words such as 作文. Say the sentence, find what in it decides the gap, then choose. Take ${firstSound.shown} Here ${firstSound.clue.en}, so it is ${firstSound.right}.\n\n> **Watch out.** 做作业 has both 做 and 作: the doing is 做, and 作业, the homework itself, is written with 作. Choose by what the gap means, not by a word you remember next to it.`,
          `读音相同的字要靠意思来分：“在”表示在哪里，“再”表示又一次；“坐”是坐下，“做”是做事，“座”用来数山和楼，“作”用在“作文”这样的词里。先读句子，找出决定填哪个字的地方，再选字。比如${zhQuote(firstSound.shown)}：${firstSound.clue["zh-CN"]}，所以填“${firstSound.right}”。\n\n> **注意。** “做作业”里“做”和“作”都有：做这件事用“做”，“作业”本身写“作”。要按空里的意思选，不能凭旁边记得的词。`,
        ),
        question: t("Which character fills the gap?", "空里应该填哪个字？"),
        items: soundAlike,
        why: (right, shown) => {
          const item = soundItemOf.get(shown)!;
          const g = soundOf(right);
          return t(
            `The sentence reads: ${whole(shown, right)}\n\nHere ${item.clue.en}, and ${right} means ${g.en}.\n\n**Check.** ${right} is the ${right} of ${g.word}, which has the same meaning, and that meaning is what the sentence says.`,
            `完整的句子是：${whole(shown, right)}\n\n${item.clue["zh-CN"]}，“${right}”${g.zh}，正合句意。\n\n**检验。** “${right}”就是“${g.word}”的“${right}”，意思相同，放回句子里正是句子要说的意思。`,
          );
        },
        whyNot: (wrong, _right, shown) => {
          const item = soundItemOf.get(shown)!;
          const g = soundOf(wrong);
          return t(
            `Here ${item.clue.en}, but ${wrong} means ${g.en}, as in ${g.word}.`,
            `${item.clue["zh-CN"]}，而“${wrong}”${g.zh}（如“${g.word}”），放进去说不通。`,
          );
        },
      },
      {
        suffix: "mistake",
        title: t("Finding the Wrong Character", "找出错别字"),
        explanation: t(
          `A wrong character that sounds right is easy to miss when reading aloud. Read the sentence for its meaning one character at a time, and ask of each whether it means what the sentence needs. Take ${firstMistake.shown} Here ${firstMistake.clue.en}, so ${firstMistake.right} should be ${firstMistake.correct}.\n\n> **Watch out.** Reading aloud will not find it: ${firstMistake.shown} sounds right. Look at each character's meaning.`,
          `读音对、字写错的情况，读出声时很难发现。要按意思一个字一个字地看，问问每个字是不是句子要表达的意思。比如${zhQuote(firstMistake.shown)}：${firstMistake.clue["zh-CN"]}，所以“${firstMistake.right}”应写作“${firstMistake.correct}”。\n\n> **注意。** 读出声是查不出来的：${zhQuote(firstMistake.shown)}读起来完全正确。要看每个字的意思。`,
        ),
        question: t("Which character in the sentence is wrong?", "句子里哪个字写错了？"),
        items: soundAlikeMistakes,
        why: (right, shown) => {
          const item = mistakeItemOf.get(shown)!;
          const fixed = shown.replace(right, item.correct);
          const g = soundOf(item.correct);
          const w = soundOf(right);
          return t(
            `${right} is wrong: it should be ${item.correct}.\n\nHere ${item.clue.en}. ${item.correct} means ${g.en}, while ${right}, said alike, means ${w.en}.\n\n**Check.** Read the sentence corrected: ${fixed} Every character now means what the sentence says.`,
            `“${right}”是错别字，应写作“${item.correct}”。\n\n${item.clue["zh-CN"]}。“${item.correct}”${g.zh}；读音相同的“${right}”却${w.zh}。\n\n**检验。** 改正后再读一遍：${fixed}每个字的意思都和句子相合。`,
          );
        },
        whyNot: (wrong, _right, shown) => {
          const word = mistakeItemOf.get(shown)!.words.get(wrong)!;
          if (word === wrong)
            return t(`${wrong} is right: it is the word ${wrong} itself.`, `“${wrong}”没有写错，这里就是“${wrong}”这个词。`);
          return t(`${wrong} is right: it is the ${wrong} of ${word}.`, `“${wrong}”没有写错，是“${word}”的“${wrong}”。`);
        },
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
    intro: t(
      `Speech says 的, 地 and 得 alike, and 他, 她 and 它 alike; writing tells them apart. Take ${firstDe.right} ${firstDe.marks.map((m) => markText(m).en).join("; ")}. And in ${firstPronoun.shown} the gap is ${firstPronoun.who.en}, so it is ${firstPronoun.right}.\n\nThe first knowledge point finds the sentence with every de right, the second chooses the pronoun.`,
      `说话时“的、地、得”读音一样，“他、她、它”读音也一样，写的时候要分清。比如“${firstDe.right}”：${firstDe.marks.map((m) => markText(m)["zh-CN"]).join("；")}。又如${zhQuote(firstPronoun.shown)}：空里指的是${firstPronoun.who["zh-CN"]}，所以用“${firstPronoun.right}”。\n\n第一个知识点选出“的、地、得”都用对的句子，第二个选用代词。`,
    ),
    prerequisites: ["heritage-sound-alike"],
    strand: "words",
    points: [
      {
        suffix: "de",
        title: t("的, 地 and 得", "的、地、得"),
        explanation: t(
          `的 comes before a noun (美丽的小鸟), 地 before a verb (慢慢地走), and 得 after a verb or adjective, before how or how much (跑得很快, 好吃得不得了). Take ${firstDe.right} ${firstDe.marks.map((m) => markText(m).en).join("; ")}.\n\n> **Watch out.** Not every 地 is the particle: in 草地 it is part of the word for grass, so look for the word each de goes with.`,
          `“的”用在名词前面（美丽的小鸟），“地”用在动词前面（慢慢地走），“得”用在动词或形容词后面，说明怎么样、到什么程度（跑得很快，好吃得不得了）。比如“${firstDe.right}”：${firstDe.marks.map((m) => markText(m)["zh-CN"]).join("；")}。\n\n> **注意。** 不是每个“地”都是助词：“草地”的“地”是词的一部分。要找出每个“的、地、得”跟哪个词连在一起。`,
        ),
        question: t("In which sentence are 的, 地 and 得 all right?", "哪个句子里的“的、地、得”都用对了？"),
        items: deDiDe,
        why: (right) => {
          const item = deItemOf.get(right)!;
          const kinds = [...new Set(item.marks.map(([d]) => d))];
          return t(
            `${right} uses each one in its place.\n\n${item.marks.map((m) => markText(m).en).join("; ")}.\n\n**Check.** Set each against its rule: ${kinds.map((d) => DE_RULE[d]!.en).join("; ")}. Every one stands where its rule puts it.`,
            `${zhQuote(right)}里的“的、地、得”都用对了。\n\n${item.marks.map((m) => markText(m)["zh-CN"]).join("；")}。\n\n**检验。** 逐个对照用法：${kinds.map((d) => DE_RULE[d]!["zh-CN"]).join("；")}。每一个都放在了该放的位置。`,
          );
        },
        whyNot: (wrong, right) => {
          const { wrote, mark } = deSlip(wrong, right);
          return t(
            `${wrong} has ${wrote} where ${mark[0]} belongs: ${markText(mark).en}, and ${DE_RULE[mark[0]]!.en}.`,
            `${zhQuote(wrong)}把“${mark[0]}”写成了“${wrote}”：${markText(mark)["zh-CN"]}，${DE_RULE[mark[0]]!["zh-CN"]}。`,
          );
        },
      },
      {
        suffix: "pronouns",
        title: t("他, 她 and 它", "他、她、它"),
        explanation: t(
          `他 is a man or boy, 她 a woman or girl, and 它 an animal or thing. Add 们 for more than one; a group of men and women together is 他们. Take ${firstPronoun.shown} The gap is ${firstPronoun.who.en}, so it is ${firstPronoun.right}.\n\n> **Watch out.** A pet may be loved like one of the family, but in writing it is still 它.`,
          `“他”指男性，“她”指女性，“它”指动物或东西。不止一个时加“们”；男女都有时用“他们”。比如${zhQuote(firstPronoun.shown)}：空里指的是${firstPronoun.who["zh-CN"]}，所以用“${firstPronoun.right}”。\n\n> **注意。** 家里的小猫小狗再亲，写的时候也用“它”。`,
        ),
        question: t("Which word fills the gap?", "空里应该填哪个词？"),
        items: pronouns,
        why: (right, shown) => {
          const item = pronounItemOf.get(shown)!;
          return t(
            `The sentence reads: ${whole(shown, right)}\n\nThe gap is ${item.who.en}, and ${right} points to ${pronounOf(right).en}.\n\n**Check.** Put back the words it stands for: ${whole(shown, item.back)} The sentence means the same.`,
            `完整的句子是：${whole(shown, right)}\n\n空里指的是${item.who["zh-CN"]}，“${right}”指的正是${pronounOf(right)["zh-CN"]}。\n\n**检验。** 把“${right}”换回它指的“${item.back}”读：${whole(shown, item.back)}意思不变。`,
          );
        },
        whyNot: (wrong, _right, shown) => {
          const item = pronounItemOf.get(shown)!;
          return t(
            `The gap is ${item.who.en}, but ${wrong} points to ${pronounOf(wrong).en}.`,
            `空里指的是${item.who["zh-CN"]}，而“${wrong}”指${pronounOf(wrong)["zh-CN"]}。`,
          );
        },
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
    intro: t(
      `A learner who speaks Chinese already knows these words by ear; this topic writes them. Take ${showSpoken(firstSpoken.shown).en}: it is written ${firstSpoken.right}, since ${firstSpoken.note.en}.\n\nThe first knowledge point writes everyday words, the second set phrases.`,
      `会说中文的学习者已经听熟了这些词，这个专题把它们写对。比如 ${firstSpoken.shown}：写作“${firstSpoken.right}”，因为${firstSpoken.note["zh-CN"]}。\n\n第一个知识点写常用词，第二个写成语。`,
    ),
    prerequisites: ["recognizing-characters-1-30"],
    strand: "words",
    points: [
      {
        suffix: "words",
        title: t("Everyday Words", "常用词"),
        explanation: t(
          `Words said every day are often written with a character that only sounds right. Think of what each syllable means: 时候 has 候 of waiting, not 侯 of a lord; 觉得 ends in 得, not 的. Take ${showSpoken(firstSpoken.shown).en}: ${firstSpoken.note.en}, so it is ${firstSpoken.right}.\n\n> **Watch out.** A miswriting such as ${firstSpoken.wrong[0]} reads aloud exactly like ${firstSpoken.right}; only the meaning of each character tells them apart.`,
          `天天说的词，常常被写成读音对、意思不对的字。想一想每个音节是什么意思：“时候”的“候”是等候的“候”，不是“侯”；“觉得”的“得”不是“的”。比如 ${firstSpoken.shown}：${firstSpoken.note["zh-CN"]}，所以写作“${firstSpoken.right}”。\n\n> **注意。** “${firstSpoken.wrong[0]}”这样的错误写法，读出来和“${firstSpoken.right}”一模一样，只有看每个字的意思才分得清。`,
        ),
        question: t("How is this word written?", "这个词怎么写？"),
        items: spokenWords,
        why: spokenWhy,
        whyNot: spokenWhyNot,
        show: showSpoken,
      },
      {
        suffix: "phrases",
        title: t("Set Phrases", "成语"),
        explanation: t(
          `A set phrase keeps the characters of its story or its meaning: 守株待兔 is a farmer waiting by a tree stump (株), and 再接再厉 sharpens (厉) again and again. Knowing why a character is there keeps it from being swapped for one that sounds alike. Take ${showSpoken(firstPhrase.shown).en}: ${firstPhrase.note.en}.\n\n> **Watch out.** A familiar character can creep in for a rarer one: 励 of 鼓励 looks right in 再接再厉, but 厉 there is to whet a blade.`,
          `成语的每个字都来自它的故事或意思：“守株待兔”是农夫守着树桩（株）等兔子，“再接再厉”是一次又一次地磨快（厉）。知道每个字为什么在那里，就不会写成读音相同的别的字。比如 ${firstPhrase.shown}：${firstPhrase.note["zh-CN"]}。\n\n> **注意。** 常见的字容易顶替少见的字：鼓励的“励”放进“再接再厉”好像也对，可这里的“厉”是把刀磨快。`,
        ),
        question: t("How is this set phrase written?", "这个成语怎么写？"),
        items: setPhrases,
        why: spokenWhy,
        whyNot: spokenWhyNot,
        show: showSpoken,
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
    intro: t(
      "A family may speak Cantonese or Shanghainese at home, and writing for everyone uses Mandarin. Take Cantonese 睇: written for everyone, it is 看, to look. This topic matches dialect words with their Mandarin both ways.\n\nThe first knowledge point gives the Mandarin of a dialect word, the second the dialect word of a Mandarin one.",
      "很多家庭在家里说粤语或上海话，写给大家看的文字用普通话。比如粤语的“睇”，写出来是“看”。这个专题把方言词和普通话词双向对应起来。\n\n第一个知识点说出方言词的普通话，第二个说出普通话词在方言里怎么说。",
    ),
    prerequisites: ["heritage-written-forms"],
    strand: "words",
    points: [
      {
        suffix: "mandarin",
        title: t("The Mandarin Word", "普通话怎么说"),
        explanation: t(
          "Many families speak a dialect at home. Its words are not wrong, but writing for everyone uses Mandarin: Cantonese 睇 is written 看, 落雨 下雨, and Shanghainese 阿拉 我们.\n\n> **Watch out.** Some dialect words look like Mandarin ones with another meaning: Cantonese 返工 is not Mandarin 返工, to redo a job, but 上班, to go to work.",
          "很多家庭在家里说方言。方言词没有错，但写给大家看的文字要用普通话：粤语的“睇”写作“看”，“落雨”写作“下雨”，上海话的“阿拉”写作“我们”。\n\n> **注意。** 有的方言词看起来像普通话，意思却不同：粤语的“返工”不是普通话里“重做”的意思，而是“上班”。",
        ),
        question: t("What is this word in Mandarin?", "这个词用普通话怎么说？"),
        items: toMandarin,
        why: (right, shown) => {
          const [d, word] = byMandarin.get(right)!;
          return t(
            `${dialectNameEn(d)} ${word} is ${right} in Mandarin.\n\nAt home ${word} is fine; written for everyone, it is ${right}.\n\n**Check.** Go the other way: Mandarin ${right} is ${word} in ${dialectNameEn(d)}, so the two match.`,
            `${shown}，普通话说“${right}”。\n\n在家里说“${word}”没有错，写给大家看时写作“${right}”。\n\n**检验。** 反过来查：普通话的“${right}”，${dialectName(d)}说“${word}”，两边对得上。`,
          );
        },
        whyNot: (wrong, right) => {
          const [d, word] = byMandarin.get(wrong)!;
          const [, asked] = byMandarin.get(right)!;
          return t(
            `${wrong} is the Mandarin of ${dialectNameEn(d)} ${word}, not of ${asked}.`,
            `“${wrong}”对应的是${dialectName(d)}的“${word}”，不是“${asked}”。`,
          );
        },
      },
      {
        suffix: "dialect",
        title: t("The Dialect Word", "方言怎么说"),
        explanation: t(
          "Going the other way helps a learner recognise a dialect word in a message or a shop sign: Mandarin 喜欢 is Cantonese 钟意, 没有 is 冇, and 你 is Shanghainese 侬.\n\n> **Watch out.** The question names the dialect: 你 is 侬 in Shanghainese, but Cantonese says it otherwise, so read which dialect is asked.",
          "反过来想，有助于在信息或招牌里认出方言词：普通话的“喜欢”粤语说“钟意”，“没有”说“冇”，“你”上海话说“侬”。\n\n> **注意。** 题目说明了是哪种方言：“你”在上海话里说“侬”，粤语却不这样说，要看清问的是哪种方言。",
        ),
        question: t("Which word is it in the dialect?", "这个词在方言里怎么说？"),
        items: fromMandarin,
        why: (right, shown) => {
          const [d, , mandarin] = byDialect.get(right)!;
          return t(
            `Mandarin ${mandarin} is ${right} in ${dialectNameEn(d)}.\n\nA message or sign in ${dialectNameEn(d)} may write ${right} where Mandarin writes ${mandarin}.\n\n**Check.** Go the other way: ${dialectNameEn(d)} ${right} is written ${mandarin} in Mandarin, so the two match.`,
            `${shown}说“${right}”。\n\n${dialectName(d)}的信息或招牌上，可能写“${right}”，普通话写作“${mandarin}”。\n\n**检验。** 反过来查：${dialectName(d)}的“${right}”，普通话写作“${mandarin}”，两边对得上。`,
          );
        },
        whyNot: (wrong, right) => {
          const [d, , mandarin] = byDialect.get(wrong)!;
          const [, , asked] = byDialect.get(right)!;
          return t(
            `${wrong} is ${dialectNameEn(d)} for ${mandarin}, not for ${asked}.`,
            `“${wrong}”是${dialectName(d)}，意思是“${mandarin}”，不是“${asked}”。`,
          );
        },
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
    intro: t(
      `Speech and writing use different words. Take ${firstSpokenWord.sentence} In writing ${firstSpokenWord.spoken} is ${firstSpokenWord.written}: ${firstSpokenWord.sentence.replace(firstSpokenWord.spoken, firstSpokenWord.written)} A notice goes further, plain and polite: ${formal[0]!.right}\n\nThe first knowledge point replaces spoken words, the second chooses the wording of a notice.`,
      `说话和写文章用的词不一样。比如“${firstSpokenWord.sentence}”，书面上“${firstSpokenWord.spoken}”写作“${firstSpokenWord.written}”：${firstSpokenWord.sentence.replace(firstSpokenWord.spoken, firstSpokenWord.written)}通知还要更简明、有礼貌：${formal[0]!.right}\n\n第一个知识点把口语词换成书面语，第二个选出适合通知的说法。`,
    ),
    prerequisites: ["recognizing-characters-3-10"],
    strand: "words",
    points: [
      {
        suffix: "words",
        title: t("Words of Writing", "书面用词"),
        explanation: t(
          `Speech uses words that writing avoids: 啥 is written 什么, 咋 怎么, 甭 不用, and 溜达 散步. They are fine at home, but a composition or a letter uses the written word. Take ${firstSpokenWord.sentence}: written, ${firstSpokenWord.sentence.replace(firstSpokenWord.spoken, firstSpokenWord.written)}\n\n> **Watch out.** Change only the spoken word and keep its meaning: 瞅 becomes 看, to look, not another word of the eyes such as 盯, to stare.`,
          `说话时常用一些书面上不用的词：“啥”写作“什么”，“咋”写作“怎么”，“甭”写作“不用”，“溜达”写作“散步”。在家里说没问题，写作文、写信时要用书面语。比如“${firstSpokenWord.sentence}”，写出来是：${firstSpokenWord.sentence.replace(firstSpokenWord.spoken, firstSpokenWord.written)}\n\n> **注意。** 只换口语词，意思不能变：“瞅”换成“看”，不能换成意思不同的“盯”。`,
        ),
        question: t("Which word does writing use instead?", "写文章时应该换成哪个词？"),
        items: SPOKEN.map((s, i) => {
          const other = (k: number) => SPOKEN[(i + k) % SPOKEN.length]!.written;
          return drillItem(`“${s.spoken}”`, s.written, [other(1), other(2), other(3)]);
        }),
        why: (right, shown) => {
          const s = spokenBySpoken.get(shown)!;
          return t(
            `In writing, ${s.spoken} is ${right}: it means ${s.meaning.en}.\n\nSaid: ${s.sentence} Written: ${s.sentence.replace(s.spoken, right)}\n\n**Check.** Read the written sentence aloud: it says just what the spoken one says.`,
            `书面上，“${s.spoken}”写作“${right}”，意思是${s.meaning["zh-CN"]}。\n\n口语说“${s.sentence}”，书面写“${s.sentence.replace(s.spoken, right)}”。\n\n**检验。** 把书面的句子读一遍：意思和口语那句完全一样。`,
          );
        },
        whyNot: (wrong, _right, shown) => {
          const s = spokenBySpoken.get(shown)!;
          const w = spokenByWritten.get(wrong)!;
          return t(
            `${wrong} is the written word for ${w.spoken} and means ${w.meaning.en}; ${s.spoken} means ${s.meaning.en}.`,
            `“${wrong}”是书面上代替“${w.spoken}”的词，意思是${w.meaning["zh-CN"]}；“${s.spoken}”的意思却是${s.meaning["zh-CN"]}。`,
          );
        },
      },
      {
        suffix: "notice",
        title: t("The Wording of a Notice", "通知的说法"),
        explanation: t(
          `A notice or letter is plain and polite: it uses 请, 请勿, 如有, 本 and 至, and leaves out spoken words, particles such as 啊, 哈 and 呗, and jokes. Take ${formal[0]!.right} It uses ${formalWords.get(formal[0]!.right)!.en}, while ${formal[0]!.wrong[0]} ${faultOf(formal[0]!.wrong[0]).en}.\n\n> **Watch out.** A friendly tone is not a polite one: 哈 and 呗 sound warm when spoken, but on a notice they read as offhand.`,
          `通知、书信要简明、有礼貌：常用“请”“请勿”“如有”“本”“至”等词，不用口语词，不加“啊”“哈”“呗”这样的语气词，也不开玩笑。比如“${formal[0]!.right}”用了“${formalWords.get(formal[0]!.right)!["zh-CN"]}”；“${formal[0]!.wrong[0]}”却${faultOf(formal[0]!.wrong[0])["zh-CN"]}。\n\n> **注意。** 语气亲切不等于有礼貌：“哈”“呗”当面说显得亲热，写在通知上却显得随便。`,
        ),
        question: t("Which sentence suits a written notice?", "哪个句子适合写在通知上？"),
        items: formal,
        why: (right) => {
          const item = formal.find((f) => f.right === right)!;
          return t(
            `${right} suits a notice: it is plain and polite.\n\nIt uses the words of writing ${formalWords.get(right)!.en}, with no spoken word, particle or joke.\n\n**Check.** Set it beside ${item.wrong[0]}, which ${faultOf(item.wrong[0]).en}: ${right} says the same without that.`,
            `“${right}”简明、有礼貌，适合写在通知上。\n\n它用了“${formalWords.get(right)!["zh-CN"]}”这些书面词，没有口语词、语气词，也不开玩笑。\n\n**检验。** 和“${item.wrong[0]}”对照：那一句${faultOf(item.wrong[0])["zh-CN"]}；“${right}”说的是同一件事，却没有这些毛病。`,
          );
        },
        whyNot: (wrong) => t(`${wrong} ${faultOf(wrong).en}.`, `“${wrong}”${faultOf(wrong)["zh-CN"]}，不适合写在通知上。`),
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
    intro: t(
      "Hong Kong, Taiwan and many communities abroad write traditional characters; each has a simplified form. Take 國: the frame 囗 stays and 或 inside becomes 玉, so 國 is 国. This topic reads traditional characters and words by their simplified forms.",
      "香港、台湾和许多海外华人社区写繁体字，每个繁体字都有对应的简化字。比如“國”：外框“囗”不变，里面的“或”换成“玉”，所以“國”是“国”。这个专题认识繁体的字和词语，说出对应的简化字。",
    ),
    prerequisites: ["heritage-register"],
    strand: "characters",
    points: [
      {
        suffix: "characters",
        title: t("Single Characters", "单字"),
        explanation: t(
          "Many simplified characters keep the outline of the traditional one: 門 is 门, 馬 马, 鳥 鸟. Others keep a part (開 开) or take a new one (書 书). Look for what stays: in 國 the frame stays, and 或 inside becomes 玉, giving 国.\n\n> **Watch out.** A simplified form is not always a look-alike: 書 becomes 书, which keeps little of its shape, so learn such characters one by one.",
          "很多简化字保留了繁体字的轮廓：“門”是“门”，“馬”是“马”，“鳥”是“鸟”；有的保留一部分（“開”是“开”），有的换了写法（“書”是“书”）。找一找没有变的部分：“國”的外框不变，里面的“或”换成“玉”，就是“国”。\n\n> **注意。** 简化字不一定和繁体字长得像：“書”作“书”，字形变化很大，这样的字要一个一个记。",
        ),
        question: t("What is this character in simplified form?", "这个繁体字的简化字是哪个？"),
        items: traditional,
        why: traditionalTeaching.charWhy,
        whyNot: traditionalTeaching.charWhyNot,
      },
      {
        suffix: "words",
        title: t("Words", "词语"),
        explanation: t(
          "In a word, simplify each character in turn: 電話 is 电话, 圖書館 图书馆. A component simplified once, such as 言 to 讠 or 門 to 门, is simplified the same way in every character.\n\n> **Watch out.** Not every character changes: in 朋友們 only 們 becomes 们, and 朋 and 友 stay as they are.",
          "读词语时，把每个字分别换成简化字：“電話”是“电话”，“圖書館”是“图书馆”。一个部件怎样简化（如“言”作“讠”，“門”作“门”），在别的字里也一样。\n\n> **注意。** 不是每个字都要换：“朋友們”只有“們”作“们”，“朋”和“友”不变。",
        ),
        question: t("What is this word in simplified characters?", "这个词用简化字怎么写？"),
        items: traditionalWords,
        why: traditionalTeaching.wordWhy,
        whyNot: traditionalTeaching.wordWhyNot,
      },
    ],
  }),
];
