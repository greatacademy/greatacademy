// The characters and words of units 1 to 3 of level 9 (docs/chinese-curriculum.md §8.3): language and rhetoric, idioms
// and allusions, and philosophy; 120 characters in 12 batches, none of them taught in levels 1 to 8, among the common
// characters still untaught and the rarest third by frequency of the advanced band of GF 0025-2021, and 480 words in 48
// batches, each unit's characters first.
//
// A character line as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.
//
// A word line as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches1 are the 12 character batches of units 1 to 3 of level 9, four a unit, in teaching order. */
export const characterBatches1: readonly string[] = [
  // Unit 1: Language and Rhetoric.
  `
哎 āi | hey; oh (surprise or regret) | 表示惊讶、不满或提醒 | 艾哀
唉 āi | alas (a sigh); yes (in reply) | 表示叹气；答应别人的声音 | 埃挨
哇 wā | wow; the sound of crying | 表示惊讶赞叹；小孩哭的声音 | 娃洼
哦 ò/ó | oh (I see); oh? (in doubt) | 表示明白了；表示半信半疑 | 俄蛾
嘿 hēi | hey; heh | 招呼别人；表示得意 | 黑默
啦 la | a particle (了 and 啊 run together) | 句末语气词，带有感叹的语气 | 拉垃
嘛 ma | a particle of the obvious | 句末语气词，表示道理很明显 | 麻吗
哟 yō | oh (mild surprise) | 表示轻微的惊讶 | 约钓
呵 hē | to breathe out; ha (laughter) | 张口出气；笑的声音 | 可阿
咕 gū | a murmuring or cooing sound | 鸟叫或肚子响的声音 | 估姑
`,
  `
吻 wěn | lips; to kiss; manner of speaking | 嘴唇；用嘴唇碰；说话的口气 | 物吩
歇 xiē | to rest; to stop | 休息；停止 | 歌欣
咬 yǎo | to bite; to pronounce | 用牙齿夹住或切断；读出字音 | 校咳
侧 cè | side; to lean to one side | 旁边；向旁边歪 | 测则
悄 qiāo/qiǎo | quiet, silent | 没有声音或声音很低 | 俏消
糊 hú/hū/hù | paste; muddled | 用黏的东西粘住；不清楚 | 湖蝴
溜 liū/liù | to slip away; to glide | 偷偷走开；滑行 | 留榴
傻 shǎ | foolish, silly | 头脑不清楚，不聪明 | 像橡
啥 shá | what (in dialect) | 什么 | 哈舍
咱 zán | we, you and I | 包括听话人在内的我们 | 咽响
`,
  `
俺 ǎn | I, we (in northern dialects) | 北方话里的我或我们 | 掩淹
吴 wú | Wu (an ancient state, a region); a surname | 古国名，在今江苏南部一带；姓 | 吞误
闽 mǐn | Min, another name for Fujian | 福建的别称 | 闻闸
垫 diàn | pad; to put under | 放在底下的东西；在下面加上东西 | 热执
叨 dāo | to chatter on | 翻来覆去地说 | 叼召 | 唠啰
唠 láo/lào | to go on and on; to chat (in dialect) | 说个不停；聊天 | 劳涝 | 叨啰
啰 luō | long-winded | 说话多而重复 | 罗逻 | 叨唠
嗦 suō | shivering; wordy (in compounds) | 和别的字组成词，表示发抖或话多 | 索唆
嘀 dí/dī | to whisper | 小声地说 | 滴嫡
滔 tāo | surging (of water) | 大水弥漫 | 稻蹈
`,
  `
伶 líng | clever; an actor (in old times) | 聪明灵活；旧时指演员 | 冷铃 | 俐
俐 lì | quick-witted | 动作或说话灵活 | 利莉 | 伶
拗 ào/niù | awkward; stubborn | 不顺；固执 | 幼抛
赘 zhuì | superfluous | 多余的 | 势挚
谚 yàn | proverb | 在民间流传的固定的话 | 颜诊
俏 qiào | pretty; witty | 样子好看；灵活有趣 | 悄梢
淆 xiáo | to confuse, to mix up | 杂乱，弄乱 | 肴消 | 混
横 héng/hèng | horizontal; across | 跟地面平行的；从左到右的 | 模黄
撒 sā/sǎ | to let go; to scatter | 放开；把东西分散地扔出去 | 撤散
混 hùn/hún | to mix; muddled | 掺杂在一起；糊涂 | 昆棍 | 淆
`,
  // Unit 2: Idioms and Allusions.
  `
株 zhū | tree trunk; (measure word for plants) | 露出地面的树根和树干；用来数植物 | 珠殊
兔 tù | rabbit, hare | 一种耳朵长、尾巴短、跑得快的小动物 | 免逸
狐 hú | fox | 一种尾巴大、毛多、很机灵的野兽 | 孤弧
添 tiān | to add | 增加 | 舔漆
驴 lǘ | donkey | 一种像马、耳朵长的家畜 | 炉护
乌 wū | crow; black | 一种黑色的鸟；黑色 | 鸟马 | 鸦
鸦 yā | crow | 一种全身黑色、叫声难听的鸟 | 鸭鸡 | 乌
雀 què | sparrow, small bird | 一种小鸟 | 省雁
犬 quǎn | dog | 狗 | 大太
鹏 péng | roc (a legendary bird) | 传说中最大的鸟 | 朋鹃
`,
  `
壳 ké/qiào | shell | 坚硬的外皮 | 亮壶
蛛 zhū | spider | 一种会结网的小虫 | 株珠
翁 wēng | old man | 年老的男子 | 公瓮
蹄 tí | hoof | 马、牛、羊等动物脚下的硬壳 | 啼踢
枪 qiāng | spear; gun | 古代一种长杆的兵器；能发射子弹的武器 | 抢呛
郑 zhèng | Zheng (an ancient state); a surname | 春秋时的国名；姓 | 关邦
弄 nòng/lòng | to do, to handle; to play with | 做，搞；用手拿着玩 | 异弃
暮 mù | evening; late | 傍晚；晚，快要结束 | 幕墓
赵 zhào | Zhao (an ancient state); a surname | 战国时的国名；姓 | 起超
魏 wèi | Wei (a state of the Warring States and the Three Kingdoms); a surname | 战国七雄之一；三国之一；姓 | 巍委
`,
  `
卧 wò | to lie down | 躺下 | 臣卜
刘 liú | Liu (a surname) | 一个常见的姓 | 列划
葛 gé/gě | kudzu; Ge (a surname) | 一种藤本植物；姓 | 喝渴
茅 máo | cogon grass, thatch | 一种多年生的草，可以盖房顶 | 矛茂
庐 lú | hut | 简陋的房屋 | 芦护
孟 mèng | eldest; Meng (a surname) | 排行第一的；姓 | 盂猛
璧 bì | jade disc | 中间有孔的扁圆形玉器 | 壁避
荆 jīng | chaste tree, thorny shrub | 一种枝条可以编筐的灌木 | 刑荡
萤 yíng | firefly | 一种夜里会发光的小虫 | 荧营
龟 guī | tortoise, turtle | 一种有硬壳、爬得很慢的动物 | 电鬼
`,
  `
垂 chuí | to hang down; to be close to | 东西的一头向下；快要，接近 | 锤睡
甘 gān | sweet; willing | 甜；愿意 | 甚某
齐 qí | neat; together; level with | 有秩序，不乱；一起；一样高 | 剂济
壮 zhuàng | strong, robust | 强健有力 | 状庄
寸 cùn | cun (a tenth of a chi); tiny | 长度单位，十分之一尺；很短很小 | 才付
扁 biǎn/piān | flat | 平而薄 | 偏遍
壶 hú | pot, kettle | 一种有嘴有把儿、装水或茶的器具 | 壳壹
杏 xìng | apricot | 一种黄色的果子，也指结这种果子的树 | 杳否
姜 jiāng | ginger; Jiang (a surname) | 一种有辣味的植物根茎；姓 | 美娄
钓 diào | to fish with a hook | 用带钩的线捉鱼 | 钩约
`,
  // Unit 3: Philosophy.
  `
柏 bǎi/bó | cypress; Bo (in names from other languages) | 一种常绿的树；用于外国名字的译音 | 拍伯
赫 hè | conspicuous, grand | 显著，盛大 | 赤郝
萨 sà | Sa (in names from other languages) | 用于音译外国名字 | 产萌
芝 zhī | sesame; a kind of fungus | 一种可以榨油的小粒种子；一种菌类 | 之芒
帕 pà | handkerchief | 手绢一类的方形织物 | 怕拍
洛 luò | the Luo River | 河名，在河南 | 格各
勒 lè/lēi | to rein in; to force | 拉住缰绳；强制 | 勤靳
姆 mǔ | nanny, governess | 照顾小孩的女子 | 拇姐
剃 tì | to shave | 用刀子刮去毛发 | 剔弟
囚 qiú | prisoner; to imprison | 被关起来的人；关押 | 因困
`,
  `
贤 xián | virtuous and able | 有德行又有才能的 | 坚紧
朱 zhū | vermilion; Zhu (a surname) | 大红色；姓 | 失米
勿 wù | do not | 不要 | 匆物
卦 guà | divination symbol | 古代用来占卜的符号 | 挂封
乾 qián | heaven, the first trigram | 八卦之一，代表天 | 韩斡 | 坤
坤 kūn | earth, the second trigram | 八卦之一，代表地 | 神伸 | 乾
浑 hún | muddy; whole, entire | 不清；全，满 | 挥军
斋 zhāi | to fast; a study; purity of mind | 吃素；书房；使心清净 | 齐济
冥 míng | dark; deep | 昏暗；深沉 | 宾冤
倚 yǐ | to lean on, to rely on | 靠着；依靠 | 椅骑
`,
  `
刹 chà/shā | instant; to brake | 极短的时间；使车或机器停下 | 杀剃
驹 jū | young horse | 小马 | 驶拘
沧 cāng | dark blue (of the sea) | 青绿色，多指大海 | 抢苍
稍 shāo | slightly | 略微 | 梢消
匆 cōng | hurried | 急忙 | 勿忽
窥 kuī | to peep | 从小孔或缝里偷看 | 规窃
豹 bào | leopard | 一种身上有斑点、跑得很快的猛兽 | 约豺
搅 jiǎo | to stir; to disturb | 拌和；扰乱 | 觉揽
缠 chán | to wind; to pester | 一圈圈地绕；跟着别人不放 | 线厘
颠 diān | top; to jolt; upside down | 头顶；上下震动；倒过来 | 真巅
`,
  `
牺 xī | to sacrifice | 为了某种目的舍弃生命或利益 | 栖洗
牲 shēng | livestock | 家里养的牛、马、羊等 | 性姓
朽 xiǔ | rotten, decayed | 腐烂；衰老 | 杠朴
逸 yì | ease, leisure; to escape | 安乐，舒适；逃走 | 兔免
悦 yuè | pleased | 高兴，愉快 | 说锐
躁 zào | impatient, rash | 性急，不冷静 | 燥操
茫 máng | vast; at a loss | 大而看不清；不知道怎么办 | 芒忙
锋 fēng | sharp edge; vanguard | 刀剑锐利的部分；带头的 | 峰蜂
棒 bàng | stick, club; great | 棍子；好，强 | 捧俸
缸 gāng | vat, jar | 装东西的大肚子器具 | 缺扛
`,
];

/** wordBatches1 are the 48 word batches of units 1 to 3 of level 9, sixteen a unit, in teaching order. */
export const wordBatches1: readonly LevelWordBatch[] = [
  // Unit 1: Language and Rhetoric.
  {
    theme: ["Figures of Speech", "修辞手法"],
    data: `
双关 | shuāng guān | pun, double meaning | 一个词语同时有两层意思 | 春节时人们把“福”字倒着贴，因为“倒”和“到”同音，这是一种＿＿。
借代 | jiè dài | metonymy | 不直接说出某人或某物，而用跟它有关的东西来代替 | 用“笔杆子”代替会写文章的人，这种修辞叫＿＿。
明喻 | míng yù | simile | 用“像”“好像”“如同”等词把两种事物连起来的比喻 | “她的脸红得像苹果”用了“像”字，是一个＿＿。 | 暗喻 借喻
暗喻 | àn yù | metaphor | 用“是”“成了”等词代替“像”的比喻 | “时间是一条河”没有用“像”字，而用了“是”字，是一个＿＿。
借喻 | jiè yù | metaphor naming only the image | 只出现用来比喻的事物，不出现被比喻的事物 | 句子里只出现用来比喻的东西，被比喻的东西不出现，这种比喻叫＿＿。
反语 | fǎn yǔ | irony | 故意说跟本意相反的话 | 他的房间又脏又乱，妈妈却说“你可真爱干净”，这是＿＿。
顶真 | dǐng zhēn | anadiplosis | 用前一句末尾的词作后一句的开头 | “山上有座庙，庙里有个老和尚”，前一句的末尾就是后一句的开头，这叫＿＿。
通感 | tōng gǎn | synaesthesia | 把一种感觉写成另一种感觉 | 把花香写得像远处传来的歌声，让气味变成了声音，这种修辞叫＿＿。
互文 | hù wén | paired lines that complete each other | 上下两句意思互相补充，要合起来理解 | 有些古诗的上下两句意思互相补充，要合在一起理解，这种修辞叫＿＿。
修辞格 | xiū cí gé | figure of speech (as a category) | 修辞方式的类别 | 比喻、拟人、夸张、排比都是常见的＿＿。
`,
  },
  {
    theme: ["Parts of Speech", "词类"],
    data: `
名词 | míng cí | noun | 表示人或事物名称的词 | “桌子”“城市”“友谊”都是＿＿。
动词 | dòng cí | verb | 表示动作、行为或变化的词 | “跑”“写”“思考”都是＿＿。
形容词 | xíng róng cí | adjective | 表示性质或状态的词 | “美丽”“高大”“安静”都是＿＿。
副词 | fù cí | adverb | 修饰动词或形容词，表示程度、时间等的词 | “很”“都”“已经”都是常用的＿＿。
介词 | jiè cí | preposition | 放在名词前面，表示时间、地点、对象等的词 | “从”“对于”“关于”都是常用的＿＿。
连词 | lián cí | conjunction | 把词或句子连接起来的词 | “和”“但是”“所以”都是常用的＿＿。
助词 | zhù cí | particle | 附在词或句子上，表示结构或时态的词 | 结构的“的”“地”“得”和表示时态的“了”“着”“过”都是＿＿。
量词 | liàng cí | measure word | 表示人、事物或动作的数量单位的词 | “一本书”的“本”和“一张纸”的“张”都是＿＿。
代词 | dài cí | pronoun | 代替名词等的词 | “我”“你”“这”“那”都是＿＿。
叹词 | tàn cí | interjection | 表示感叹或答应的词 | “哎呀”“唉”“哦”可以单独成句，它们都是＿＿。
`,
  },
  {
    theme: ["Parts of a Sentence", "句子成分"],
    data: `
主语 | zhǔ yǔ | subject | 句子里说明是谁或是什么的部分 | 在“小明读书”这个句子里，“小明”是＿＿。
谓语 | wèi yǔ | predicate | 说明主语怎么样或是什么的部分 | 在“花开了”这个句子里，“开了”是＿＿。
宾语 | bīn yǔ | object | 动词后面表示动作对象的部分 | 在“我喜欢音乐”这个句子里，“音乐”是＿＿。
定语 | dìng yǔ | attribute | 修饰名词的部分 | 在“红色的花”里，“红色的”是＿＿。
状语 | zhuàng yǔ | adverbial | 修饰动词或形容词的部分 | 在“他慢慢地走”里，“慢慢地”是＿＿。
补语 | bǔ yǔ | complement | 动词或形容词后面补充说明的部分 | 在“他跑得很快”里，“很快”是＿＿。
短语 | duǎn yǔ | phrase | 由词组成、但还不是句子的语言单位 | “美丽的校园”不是一个完整的句子，只是一个＿＿。
语序 | yǔ xù | word order | 词在句子里的先后顺序 | 汉语的＿＿很重要，“狗咬人”和“人咬狗”的意思完全不同。
句式 | jù shì | sentence pattern | 句子的结构格式 | “把”字句和“被”字句都是汉语里常用的＿＿。
倒装句 | dào zhuāng jù | inverted sentence | 把正常的语序倒过来的句子 | “多美啊，这里的春天！”把主语放在了后面，是一个＿＿。
`,
  },
  {
    theme: ["Kinds of Sentences", "句子的种类"],
    data: `
陈述句 | chén shù jù | declarative sentence | 说明一件事情的句子 | “今天是星期一。”是一个＿＿。
疑问句 | yí wèn jù | interrogative sentence | 提出问题的句子 | “你吃饭了吗？”是一个＿＿，句末用问号。
祈使句 | qí shǐ jù | imperative sentence | 表示请求或命令的句子 | “请关上门。”表示请求，是一个＿＿。
感叹句 | gǎn tàn jù | exclamatory sentence | 表达强烈感情的句子 | “这里的风景太美了！”是一个＿＿。
病句 | bìng jù | faulty sentence | 有语法错误或意思不清楚的句子 | “通过这次活动，使我明白了很多道理。”缺少主语，是一个＿＿。
歧义 | qí yì | ambiguity | 一句话可以有两种或更多的理解 | “两个学校的老师”有＿＿，可以理解成两种不同的意思。
实词 | shí cí | content word | 有实在意义、能单独作句子成分的词 | 名词、动词、形容词都是＿＿。 | 虚词
虚词 | xū cí | function word | 没有实在意义、不能单独作句子成分的词 | 介词、连词、助词都是＿＿。
语法 | yǔ fǎ | grammar | 词组成句子的规则 | 他的作文内容不错，可是有不少＿＿错误。
数词 | shù cí | numeral | 表示数目的词 | “一”“十”“百”“千”都是＿＿。
`,
  },
  {
    theme: ["Punctuation", "标点符号"],
    data: `
标点符号 | biāo diǎn fú hào | punctuation marks | 书面语里表示停顿、语气等的符号的总称 | 逗号、句号、问号都属于＿＿。
省略号 | shěng lüè hào | ellipsis | 表示话没说完的符号，写成六个小圆点 | 话没有说完，可以用＿＿表示。
括号 | kuò hào | brackets | 用来放注释的符号 | 句子里起解释作用的话，可以放在＿＿里。
破折号 | pò zhé hào | dash | 表示解释说明或意思转换的符号，写成一条长横线 | 歇后语的前后两部分之间，常常用＿＿隔开。
书名号 | shū míng hào | title marks | 用在书名、文章名等前后的符号 | 写书名、报纸名和文章名的时候，要用＿＿。
分号 | fēn hào | semicolon | 表示并列分句之间停顿的符号 | 几个并列的分句之间可以用＿＿，它的停顿比逗号长，比句号短。
着重号 | zhuó zhòng hào | emphasis dots | 标在要强调的字下面的小圆点 | 课文里有几个字下面加了小圆点，这些小圆点叫＿＿，表示要特别注意。
间隔号 | jiàn gé hào | interpunct | 用在外国人名的名和姓之间的小圆点 | 翻译外国人的名字时，名和姓之间要用＿＿隔开。
连接号 | lián jiē hào | connecting dash | 把相关的数字、时间、地点连起来的符号 | 表示“从北京到上海”的路线，可以在两个地名之间加一个＿＿。
单引号 | dān yǐn hào | single quotation marks | 用在引号里面的引号 | 引号里面还有引号的时候，里面的要用＿＿。
`,
  },
  {
    theme: ["How Characters Are Made", "汉字的构造"],
    data: `
偏旁 | piān páng | component of a character | 汉字里组成字的部分 | “河”“湖”“海”都有三点水这个＿＿。
笔顺 | bǐ shùn | stroke order | 写字时笔画的先后顺序 | 写汉字要按照正确的＿＿，比如先上后下、先左后右。
方块字 | fāng kuài zì | square characters | 汉字的别称，因为每个字都占一个方格 | 汉字每个字都写在一个方格里，所以也叫＿＿。
象形 | xiàng xíng | pictography | 照着事物的样子画出来的造字方法 | “日”“月”“山”最早都是照着事物的样子画出来的，属于＿＿字。
会意 | huì yì | compound ideography | 把几个字合在一起表示新意思的造字方法 | 一个人靠在树旁休息，就是“休”字，这是＿＿字。
形声 | xíng shēng | phono-semantic compounding | 一部分表示意思、一部分表示读音的造字方法 | “湖”字左边表示意思，右边表示读音，是＿＿字。
指事 | zhǐ shì | indicative signs | 用符号指出事物位置的造字方法 | 在“木”的下面加一短横，表示树根，就造出了“本”字，这种造字方法叫＿＿。
独体字 | dú tǐ zì | single-component character | 不能再分成几部分的字 | “人”“口”“大”不能再分成两部分，是＿＿。
合体字 | hé tǐ zì | compound character | 由两个或更多部分组成的字 | “妈”由“女”和“马”两部分组成，是＿＿。
简化字 | jiǎn huà zì | simplified character | 笔画减少了的字 | “书”“马”“门”的写法都比过去简单，是＿＿。
`,
  },
  {
    theme: ["Sounds of Mandarin", "普通话的语音"],
    data: `
声母 | shēng mǔ | initial | 一个音节开头的辅音 | “包”和“抛”的韵母和声调都一样，只是＿＿不同。 | 韵母
韵母 | yùn mǔ | final | 一个音节里声母后面的部分 | “妈”和“摸”的声母和声调都一样，只是＿＿不同。
卷舌 | juǎn shé | to curl the tongue (retroflex) | 发音时舌尖往上翘 | 说“知”“吃”“是”的时候要＿＿，很多南方人觉得这几个音不好发。
儿化 | ér huà | rhotacization | 字音后面加上卷舌的“儿” | 北京人常说“玩儿”“一点儿”，这种发音叫＿＿。
轻声 | qīng shēng | neutral tone | 读得又轻又短的字音 | “桌子”的“子”读得又轻又短，是＿＿。
变调 | biàn diào | tone sandhi | 字连在一起读时声调发生变化 | 两个第三声的字连在一起，前一个要读成第二声，这叫＿＿。
送气 | sòng qì | aspirated | 发音时有一股较强的气流出来 | 发“怕”的声母时，嘴里要吐出一股气，这是＿＿音。
鼻音 | bí yīn | nasal sound | 发音时气流从鼻子出来的音 | “妈”和“那”的声母都是＿＿，发音时气流从鼻子出来。
音节 | yīn jié | syllable | 语音的基本单位，汉语里一个字一般读一个 | 汉语里一个汉字通常读一个＿＿。
四声 | sì shēng | the four tones | 普通话的四个声调 | 普通话的阴平、阳平、上声、去声，合起来叫＿＿。
`,
  },
  {
    theme: ["Words and Their Meanings", "字词的意义"],
    data: `
近义词 | jìn yì cí | synonym | 意思相近的词 | “美丽”和“漂亮”是一对＿＿。 | 反义词
反义词 | fǎn yì cí | antonym | 意思相反的词 | “冷”和“热”是一对＿＿。
同音字 | tóng yīn zì | homophone | 读音相同而写法、意思不同的字 | “是”“事”“试”读音完全相同，是＿＿。
多音字 | duō yīn zì | character with several readings | 有两个或更多读音的字 | “长”在“长短”和“长大”里读音不同，是一个＿＿。
错别字 | cuò bié zì | wrongly written character | 写错或用错的字 | 他把“再见”写成了“在见”，作文里出了一个＿＿。
本义 | běn yì | original meaning | 一个字或词最早的意思 | 古代“走”的＿＿是跑，后来才有了现在的意思。 | 引申义
引申义 | yǐn shēn yì | extended meaning | 从最早的意思发展出来的意思 | “深”本来指水深，“感情很深”里用的是它的＿＿。
词义 | cí yì | meaning of a word | 词所表示的意思 | 学一个新词，不但要会读会写，还要理解它的＿＿。 | 本义 引申义
通假字 | tōng jiǎ zì | phonetic loan character | 古书里代替本字的读音相同或相近的字 | 古书里有时用一个读音相近的字代替本来该用的字，这样的字叫＿＿。
中性 | zhōng xìng | neutral (in connotation) | 既不是褒义也不是贬义的 | “结果”这个词既不带褒义也不带贬义，是＿＿词。
`,
  },
  {
    theme: ["Ways of Speaking", "说话的样子"],
    data: `
口吻 | kǒu wěn | tone, voice (of a speaker) | 说话时流露出来的感情或身份 | 这篇作文是用一只小猫的＿＿写的，读起来很有趣。
抑扬顿挫 | yì yáng dùn cuò | with rising and falling cadence | 声音高低起伏，有停顿有转折 | 他朗读诗歌时声音＿＿，非常好听。
吞吞吐吐 | tūn tūn tǔ tǔ | to hem and haw | 想说又不敢说，说得不痛快 | 问他为什么迟到，他＿＿地半天说不出原因。 | 含糊
结巴 | jiē ba | to stammer | 说话不流利，字音重复或停顿 | 他一紧张说话就＿＿，一个字要重复好几遍。
啰嗦 | luō suo | long-winded | 说话重复，不简洁 | 他讲话太＿＿了，一件小事说了半个小时。 | 唠叨
唠叨 | láo dao | to nag, to go on and on | 没完没了地说 | 妈妈每天都＿＿我多穿衣服、早点睡觉。 | 啰嗦
嘀咕 | dí gu | to mutter | 小声地说，私下议论 | 他不敢大声反对，只在下面小声＿＿。
滔滔不绝 | tāo tāo bù jué | to talk on and on | 话很多，连续不断 | 一说起足球，他就＿＿，谁也插不上嘴。
口齿伶俐 | kǒu chǐ líng lì | articulate | 说话清楚流利 | 这个小姑娘＿＿，主持节目一点也不紧张。
含糊 | hán hu | vague | 不明确，不清楚 | 他的回答很＿＿，说了半天也没说同意还是不同意。 | 吞吞吐吐
`,
  },
  {
    theme: ["Sayings and Folk Verse", "熟语和民间韵文"],
    data: `
谚语 | yàn yǔ | proverb | 民间流传的、说明道理的固定语句 | “一年之计在于春”是一句关于农时的＿＿。
歇后语 | xiē hòu yǔ | two-part allegorical saying | 前一部分像谜面、后一部分像谜底的话 | “竹篮打水，一场空”是一句＿＿。 | 俏皮话
惯用语 | guàn yòng yǔ | colloquial set phrase | 口语里常用的固定短语，多为三个字 | “开夜车”“走后门”都是＿＿。
俏皮话 | qiào pí huà | witty remark | 风趣、带点开玩笑意思的话 | 他爱说＿＿，大家常常被他逗得哈哈大笑。 | 歇后语
绕口令 | rào kǒu lìng | tongue twister | 把读音相近的字放在一起、很难说快的句子 | “四是四，十是十”是一段有名的＿＿，说快了很容易出错。
顺口溜 | shùn kǒu liū | jingle, doggerel | 句子押韵、念起来很顺的民间韵文 | 老师把交通规则编成了＿＿，同学们一下子就记住了。
口头禅 | kǒu tóu chán | pet phrase | 一个人说话时常挂在嘴边的词语 | “差不多”是他的＿＿，不管什么事他都说差不多。
警句 | jǐng jù | aphorism | 简短深刻、让人警醒的句子 | 这篇文章里有不少＿＿，读了让人很受启发。
熟语 | shú yǔ | set expression (as a category) | 固定的短语或句子的总称 | 成语、谚语、歇后语都属于＿＿。
横批 | héng pī | horizontal scroll over a couplet | 贴在对联上方的横幅 | 春联贴在大门两边，门的上方还要贴一条＿＿。
`,
  },
  {
    theme: ["Choosing Words", "斟酌字句"],
    data: `
措辞 | cuò cí | wording | 说话或写文章时选用词语 | 给校长写信，＿＿要礼貌得体。
字斟句酌 | zì zhēn jù zhuó | to weigh every word | 每个字每句话都仔细推敲 | 这份合同很重要，他＿＿，看了一遍又一遍。 | 咬文嚼字
咬文嚼字 | yǎo wén jiáo zì | to be pedantic about words | 过分地在字句上下功夫 | 说话不必太＿＿，意思清楚就行了。 | 字斟句酌
贴切 | tiē qiè | apt | 用词恰当，很合适 | 这个比喻用得很＿＿，一下子就让人明白了。
直白 | zhí bái | blunt, plain | 说话直接，不委婉 | 他的话说得太＿＿，一点也不考虑别人的感受。
拗口 | ào kǒu | awkward to say | 说起来不顺 | 这句话里读音相近的字太多，读起来很＿＿。
顺口 | shùn kǒu | easy to say | 念起来流畅 | 这首儿歌念起来很＿＿，小朋友们很快就会背了。
精炼 | jīng liàn | concise, polished | 简洁，没有多余的字句 | 他的文章语言＿＿，每个字都用得恰到好处。
赘述 | zhuì shù | to say more than needed | 多余地叙述 | 前面已经讲过的内容，这里就不再＿＿了。
混淆 | hùn xiáo | to confuse | 把不同的东西混在一起，分不清 | “己”和“已”样子很像，很容易＿＿。
`,
  },
  {
    theme: ["Interjections and Particles", "叹词和语气词"],
    data: `
哎呀 | āi yā | oh dear, oh my | 表示惊讶、着急或埋怨 | ＿＿，我把作业本忘在教室里了！ | 哎哟
哎哟 | āi yō | ouch; oh | 表示痛苦或惊讶 | ＿＿，我的脚扭了一下，好疼！ | 哎呀
唉声叹气 | āi shēng tàn qì | to moan and sigh | 因为烦恼而不断叹气 | 他这次没考好，一回家就＿＿。
哦 | ò | oh, I see | 表示明白了 | ＿＿，原来是这样，我终于明白了。
哇 | wā | wow | 表示惊讶或赞叹 | 孩子们一走进海洋馆，就＿＿地叫了起来。
嘛 | ma | a particle stressing the obvious | 用在句末，表示道理很明显 | 他本来就是个孩子＿＿，你别对他要求太高。 | 啦
啦 | la | a particle of exclamation | 用在句末，是“了”和“啊”的合音 | 太好＿＿！我们终于爬到山顶了。
乐呵呵 | lè hē hē | cheerful | 高兴的样子 | 爷爷整天＿＿的，好像从来没有烦恼。
嘿嘿 | hēi hēi | heh heh | 笑的声音，常带得意或不好意思 | 他＿＿一笑，说：“这个秘密我可不能告诉你。”
语气词 | yǔ qì cí | modal particle | 用在句末表示语气的词 | “吗”“呢”“吧”放在句末表示疑问或商量，它们都是＿＿。
`,
  },
  {
    theme: ["Techniques of Writing", "写作手法"],
    data: `
烘托 | hōng tuō | to set off, to heighten | 用别的事物来突出主要的事物 | 作者用阴沉的天气来＿＿人物悲伤的心情。
照应 | zhào yìng | to echo (within a text) | 文章前后内容互相配合 | 文章的结尾和开头互相＿＿，结构显得很完整。
铺垫 | pū diàn | groundwork | 为后面的内容预先做准备 | 前面几段写主人公的辛苦，是为最后的成功作＿＿。
开门见山 | kāi mén jiàn shān | to come straight to the point | 一开始就直接进入正题 | 这篇文章＿＿，第一句话就点明了主题。
寓情于景 | yù qíng yú jǐng | to convey feeling through scenery | 把感情放在景物描写里 | 作者没有直接写自己的思念，而是＿＿，通过秋天的落叶来表达。
画龙点睛 | huà lóng diǎn jīng | the finishing touch | 在关键处加上一笔，使内容更生动传神 | 结尾这一句起到了＿＿的作用，让文章的主题更加鲜明。
欲扬先抑 | yù yáng xiān yì | to belittle before praising | 想要表扬，先故意贬低 | 文章开头写他很不起眼，后来才写他的了不起，这是＿＿的写法。
侧面描写 | cè miàn miáo xiě | indirect description | 通过别人的反应来写人物 | 作者没有直接写她有多美，而是写路上的人都回头看她，这是＿＿。
正面描写 | zhèng miàn miáo xiě | direct description | 直接写人物的样子、语言和动作 | 作者直接写了他的外貌、语言和动作，这是＿＿。 | 侧面描写
借物喻人 | jiè wù yù rén | to portray people through things | 借写一种事物来比喻人的品格 | 这篇文章写的是路边的小草，其实是＿＿，赞美那些默默工作的普通人。
`,
  },
  {
    theme: ["Humour and Banter", "风趣和玩笑"],
    data: `
风趣 | fēng qù | witty, humorous | 说话或文章有趣，让人发笑 | 王老师说话很＿＿，上课时同学们常常被他逗笑。 | 俏皮 幽默感
俏皮 | qiào pí | playful, cheeky | 活泼可爱，喜欢开玩笑 | 小女孩＿＿地朝我做了个鬼脸。 | 风趣
打趣 | dǎ qù | to tease | 拿别人开玩笑 | 大家拿他的新发型＿＿，他也跟着笑了。
自嘲 | zì cháo | self-mockery | 拿自己开玩笑 | 他＿＿地说：“我什么都快，就是长个子慢。”
挖苦 | wā ku | to speak sarcastically of | 用尖刻的话讽刺别人 | 别总是＿＿别人，那样很伤人。
玩笑 | wán xiào | joke | 让人发笑的话或举动 | 这只是一个＿＿，你别当真。 | 冷笑话 段子
说笑 | shuō xiào | to chat and laugh | 一边谈话一边笑 | 晚饭后，一家人坐在院子里聊天＿＿。 | 打趣
冷笑话 | lěng xiào huà | corny joke | 不太好笑、让人觉得冷场的笑话 | 他讲了一个＿＿，大家你看看我，我看看你，谁也没笑。 | 玩笑 段子
段子 | duàn zi | short funny story | 一小段好笑的故事或话 | 他在网上看到一个好笑的＿＿，马上转发给了朋友。 | 玩笑 冷笑话
幽默感 | yōu mò gǎn | sense of humour | 让人觉得有趣、会开玩笑的能力 | 爸爸很有＿＿，总能把一家人逗得哈哈大笑。 | 风趣
`,
  },
  {
    theme: ["Kinds of Talk", "各种各样的话"],
    data: `
傻话 | shǎ huà | foolish talk | 不明事理的话 | 别说＿＿了，你一定能考好的。 | 气话
悄悄话 | qiāo qiāo huà | whisper, private talk | 小声说的、不想让别人听到的话 | 两个好朋友在角落里小声说着＿＿。 | 心里话
废话 | fèi huà | useless words | 没有用的话 | 写文章要简洁，不要写＿＿。
客套话 | kè tào huà | polite formalities | 表示客气的话 | 都是老朋友了，不用说那些＿＿。 | 场面话
场面话 | chǎng miàn huà | words said for show | 在正式场合说的应付的话 | 他在会上说的只是＿＿，不一定是真心的。 | 客套话
大白话 | dà bái huà | plain language | 普通易懂的话 | 这本书用＿＿讲科学，连小学生都能看懂。
心里话 | xīn lǐ huà | what one really thinks | 真实的想法 | 今晚我想跟你说几句＿＿。 | 悄悄话
谎话 | huǎng huà | lie | 不真实的话 | 他说了＿＿，后来自己也觉得很不安。
撒谎 | sā huǎng | to tell a lie | 说假话 | 他从小就不＿＿，大家都很信任他。
气话 | qì huà | words said in anger | 生气时说的话 | 他生气时说的都是＿＿，你别往心里去。 | 傻话
`,
  },
  {
    theme: ["Dialects and Everyday Speech", "方言和口语"],
    data: `
啥 | shá | what (colloquial) | 什么 | 你说＿＿？我刚才没听清楚。
咱 | zán | we (you and I) | 包括听话人在内的我们 | ＿＿俩是好朋友，有事你尽管说。 | 俺
俺 | ǎn | I (in northern dialects) | 北方话里的“我” | 他是山东人，说“我”的时候总说“＿＿”。 | 咱
吴语 | wú yǔ | Wu Chinese | 上海、苏州一带的方言 | 上海话和苏州话都属于＿＿。
闽南话 | mǐn nán huà | Southern Min | 福建南部一带的方言 | 厦门人平时说的是＿＿。
客家话 | kè jiā huà | Hakka | 客家人说的方言 | 广东梅州很多人说＿＿。
官话 | guān huà | Mandarin dialects | 北方方言的总称，是普通话的基础 | 北方方言也叫＿＿，从东北到西南很多地方都说这种方言。
东北话 | dōng běi huà | Northeastern Mandarin | 东北地区的方言 | 他说一口＿＿，常把“干什么”说成“干啥”。
四川话 | sì chuān huà | Sichuanese | 四川一带的方言 | 成都人平时说的是＿＿。
乡音 | xiāng yīn | accent of one's hometown | 家乡的口音 | 他离开家乡几十年了，＿＿还是一点也没改。
`,
  },
  // Unit 2: Idioms and Allusions.
  {
    theme: ["Animal Fables", "动物寓言"],
    data: `
守株待兔 | shǒu zhū dài tù | to wait for windfalls | 比喻不主动努力，只想靠运气得到好处 | 一次考得好就不再复习，只盼着下次还有好运气，这就是＿＿。
狐假虎威 | hú jiǎ hǔ wēi | to bully others with someone else's power | 比喻依仗别人的势力欺负人 | 他仗着哥哥是班长，在同学面前作威作福，真是＿＿。
画蛇添足 | huà shé tiān zú | to spoil something by adding what is unnecessary | 做多余的事，反而不好 | 文章已经写得很好了，最后再加一段说明，反而是＿＿。
井底之蛙 | jǐng dǐ zhī wā | a frog in a well, a narrow-minded person | 比喻见识很少的人 | 不出去看看外面的世界，我们就会像＿＿一样，以为天只有井口那么大。
杯弓蛇影 | bēi gōng shé yǐng | to be frightened by imaginary fears | 比喻疑神疑鬼，自己吓自己 | 一点小声音就以为有小偷，他这样＿＿，晚上总也睡不好。 | 惊弓之鸟
惊弓之鸟 | jīng gōng zhī niǎo | a bird startled by the twang of a bow | 比喻受过惊吓、遇到一点动静就害怕的人 | 他被狗咬过一次，现在一听到狗叫就像＿＿一样。 | 杯弓蛇影
对牛弹琴 | duì niú tán qín | to play the lute to a cow | 比喻对不懂道理的人讲道理，也指说话不看对象 | 跟三岁的孩子讲经济学，简直是＿＿。
亡羊补牢 | wáng yáng bǔ láo | better late than never | 出了问题以后赶快想办法补救 | 这次考试错了很多，现在＿＿，认真复习还来得及。
龟兔赛跑 | guī tù sài pǎo | the tortoise and the hare | 比喻骄傲的会失败，坚持的会成功 | 在＿＿的故事里，跑得快的那个因为骄傲睡大觉，最后输了比赛。
乌鸦喝水 | wū yā hē shuǐ | the crow and the pitcher | 比喻遇到困难时动脑筋想办法 | 在＿＿的故事里，那只鸟往瓶子里放小石子，让水升了上来。
`,
  },
  {
    theme: ["Birds and Beasts", "鸟兽成语"],
    data: `
兔死狐悲 | tù sǐ hú bēi | to grieve for one's own kind | 比喻因同类的不幸而伤心 | 看到同行的公司一家家倒闭，他不免有些＿＿。
鸦雀无声 | yā què wú shēng | silent as the grave | 形容非常安静 | 老师一走进教室，刚才还很吵的同学们立刻＿＿。
门可罗雀 | mén kě luó què | to have few visitors | 形容来的人很少，非常冷清 | 这家饭店以前客人很多，现在却＿＿。
鸡犬不宁 | jī quǎn bù níng | pandemonium | 形容闹得很厉害，不得安宁 | 邻居家装修了一个月，吵得整栋楼＿＿。
鹏程万里 | péng chéng wàn lǐ | a bright future | 比喻前程远大 | 毕业典礼上，老师祝同学们＿＿，前程似锦。
金蝉脱壳 | jīn chán tuō qiào | to escape by a ruse | 比喻用计策脱身 | 他借口去洗手间，来了个＿＿，悄悄离开了会场，避开了那些记者。
呆若木鸡 | dāi ruò mù jī | dumbstruck | 形容因害怕或惊讶而发呆 | 听到这个消息，他＿＿地站在那里，半天说不出话来。
卧虎藏龙 | wò hǔ cáng lóng | crouching tiger, hidden dragon | 比喻隐藏着很多人才 | 这个小村子＿＿，出过好几位有名的画家。
龙飞凤舞 | lóng fēi fèng wǔ | lively and vigorous (of handwriting) | 形容书法笔势有力，灵活多变 | 爷爷的毛笔字写得＿＿，非常有气势。
如鱼得水 | rú yú dé shuǐ | like a fish in water | 比喻遇到了很适合自己的环境 | 他到了新的研究所，工作得＿＿，进步很快。
`,
  },
  {
    theme: ["Horses in Idioms", "带马字的成语"],
    data: `
塞翁失马 | sài wēng shī mǎ | a blessing in disguise | 比喻坏事在一定条件下可以变成好事 | 他没考上那所学校，却在另一所学校遇到了好老师，真是＿＿，坏事变成了好事。
老马识途 | lǎo mǎ shí tú | an old horse knows the way | 比喻有经验的人熟悉情况 | 爷爷在这里住了一辈子，＿＿，带我们找到了那条小路。
一马当先 | yì mǎ dāng xiān | to take the lead | 比喻走在最前面，带头 | 遇到困难时，队长总是＿＿，冲在最前面。
走马观花 | zǒu mǎ guān huā | to take a cursory look | 比喻粗略地观察 | 参观博物馆不能＿＿，要停下来仔细看。
害群之马 | hài qún zhī mǎ | a black sheep | 比喻危害集体的人 | 球队里出了一个＿＿，常常故意不配合大家。
马不停蹄 | mǎ bù tíng tí | without a pause | 比喻一刻也不停地进行 | 他下了飞机就＿＿地赶到了会场。
单枪匹马 | dān qiāng pǐ mǎ | single-handed | 比喻一个人单独行动，没有别人帮助 | 他＿＿来到这座城市创业，什么都要靠自己。
蛛丝马迹 | zhū sī mǎ jì | traces, clues | 比喻隐约可寻的线索 | 警察仔细检查了房间，不放过任何＿＿。
千军万马 | qiān jūn wàn mǎ | a mighty host | 形容兵马很多，声势浩大 | 高考那天，人们常说考生们像＿＿过独木桥。
马到成功 | mǎ dào chéng gōng | to win instant success | 一开始就取得成功 | 比赛前，朋友们都祝他＿＿。
`,
  },
  {
    theme: ["Foolish Ways", "愚人蠢事"],
    data: `
刻舟求剑 | kè zhōu qiú jiàn | to mark the boat to find a lost sword | 比喻不懂得事情已经变化，还用老办法 | 情况已经完全变了，你还用十年前的老办法，这不是＿＿吗？
郑人买履 | zhèng rén mǎi lǚ | to trust a measurement more than one's own feet | 比喻只相信死规矩，不相信实际 | 买鞋不试穿，非要回家拿量好的尺码，这就像＿＿的故事一样可笑。
骑驴找驴 | qí lǘ zhǎo lǘ | to look for what one already has | 比喻东西就在自己身边还到处去找 | 他到处找眼镜，其实眼镜就戴在头上，真是＿＿。
叶公好龙 | yè gōng hào lóng | professed love of what one really fears | 比喻口头上说爱好某事物，其实并不是真的爱好 | 他天天说喜欢小狗，可真有一只小狗跑过来，他却害怕得直往后退，真是＿＿。
盲人摸象 | máng rén mō xiàng | the blind men and the elephant | 比喻只了解一部分就以为知道了全部 | 只看了一章就评价整本书，好比＿＿。
画饼充饥 | huà bǐng chōng jī | to draw cakes to allay hunger | 比喻用空想来安慰自己 | 饿的时候光想着好吃的东西，不过是＿＿，肚子还是饿。 | 望梅止渴
望梅止渴 | wàng méi zhǐ kě | to quench one's thirst by thinking of plums | 比喻用想象中的希望来鼓舞自己 | 曹操告诉口渴的士兵前面有一大片梅林，士兵们一听就流出了口水，这就是＿＿的故事。 | 画饼充饥
纸上谈兵 | zhǐ shàng tán bīng | armchair strategy | 比喻空谈理论，不能解决实际问题 | 他读了很多关于游泳的书，却从来没下过水，这只是＿＿。
弄巧成拙 | nòng qiǎo chéng zhuō | to overreach oneself | 想耍聪明，结果反而做坏了事 | 他想把蛋糕装饰得更漂亮，结果＿＿，把奶油弄得到处都是。
朝三暮四 | zhāo sān mù sì | to blow hot and cold | 比喻反复无常 | 他今天想学画画，明天又想学钢琴，这样＿＿，什么都学不好。
`,
  },
  {
    theme: ["Allusions from History", "历史典故"],
    data: `
完璧归赵 | wán bì guī zhào | to return something intact to its owner | 比喻把原物完好地归还本人 | 借来的书我一定会好好保管，到时候＿＿。
负荆请罪 | fù jīng qǐng zuì | to offer a humble apology | 主动向人认错 | 他知道自己错了，第二天就主动＿＿，向朋友道了歉。
围魏救赵 | wéi wèi jiù zhào | to relieve an ally by attacking the enemy's home | 比喻攻击对方的要害，迫使对方撤退 | 战国时齐国军队不直接去赵国，而是去攻打魏国的都城，逼魏军回来，这就是＿＿。
退避三舍 | tuì bì sān shè | to give way to avoid a clash | 主动让步，不跟人争 | 他力气大，脾气又急，同学们见了他都＿＿。
唇亡齿寒 | chún wáng chǐ hán | if the lips are gone, the teeth feel the cold | 比喻双方关系密切，互相依存 | 这两个小国＿＿，一个灭亡了，另一个也很难保住。
卧薪尝胆 | wò xīn cháng dǎn | to endure hardship in order to rise again | 形容刻苦自励，发愤图强 | 输掉比赛后，他＿＿，每天苦练，第二年终于拿了冠军。
四面楚歌 | sì miàn chǔ gē | besieged on all sides | 比喻四面受敌，陷入孤立 | 他的观点没有一个人支持，在会上陷入了＿＿的处境。
背水一战 | bèi shuǐ yí zhàn | to fight with one's back to the river | 比喻在没有退路的情况下拼一次 | 这是最后一次机会，我们只能＿＿，全力去拼。
草木皆兵 | cǎo mù jiē bīng | to see enemies everywhere | 形容非常惊慌，疑神疑鬼 | 古代有个国君打仗时远远望见山上的草木，以为都是敌人的士兵，这就是＿＿的来历。
指鹿为马 | zhǐ lù wéi mǎ | to call a deer a horse | 比喻故意颠倒是非 | 秦朝的赵高把一头鹿说成是马，大臣们不敢反对，这就是＿＿的故事。
`,
  },
  {
    theme: ["The Three Kingdoms", "三国故事"],
    data: `
三顾茅庐 | sān gù máo lú | to visit three times to win over a talent | 比喻真心诚意地一再邀请 | 为了请这位专家来工作，校长＿＿，终于打动了他。
初出茅庐 | chū chū máo lú | young and inexperienced | 比喻刚进入社会，缺少经验 | 他刚毕业，还是个＿＿的年轻人，很多事情都不懂。
草船借箭 | cǎo chuán jiè jiàn | borrowing arrows with straw boats | 比喻巧妙地利用别人的力量 | 在小说三国演义里，诸葛亮用＿＿的办法，三天就得到了十万支箭。
刘备 | liú bèi | Liu Bei | 三国时蜀国的建立者 | ＿＿三次去请诸葛亮，才请他出山帮忙。
诸葛亮 | zhū gě liàng | Zhuge Liang | 三国时蜀国的丞相，以智慧闻名 | 人们常用＿＿来比喻非常聪明、会出主意的人。
曹操 | cáo cāo | Cao Cao | 三国时魏国的奠基人 | ＿＿是东汉末年的政治家，也是一位诗人。
关羽 | guān yǔ | Guan Yu | 刘备手下的大将，以忠义闻名 | 后人尊称＿＿为“关公”。
张飞 | zhāng fēi | Zhang Fei | 刘备手下的大将，性格勇猛直爽 | 在三国故事里，＿＿是一个脾气急、说话直的猛将。
说曹操曹操到 | shuō cáo cāo cáo cāo dào | speak of the devil | 刚说到某人，某人就来了 | 我们正说着小王呢，他就推门进来了，真是＿＿。
三个臭皮匠 | sān gè chòu pí jiàng | three cobblers (with their wits combined) | 比喻人多智慧多 | 俗话说：“＿＿，顶个诸葛亮。”大家一起想办法吧。
`,
  },
  {
    theme: ["Studying Hard", "勤学的故事"],
    data: `
凿壁偷光 | záo bì tōu guāng | to bore through the wall for light to read by | 形容家境贫寒而刻苦读书 | 古时候有个孩子家里点不起灯，就在墙上挖了个小洞，借邻居家的光读书，这就是＿＿。
囊萤映雪 | náng yíng yìng xuě | to read by fireflies and snow | 形容勤学苦读 | 古人把会发光的小虫装在袋子里照明，或者借雪的反光读书，后人用＿＿形容刻苦学习。
悬梁刺股 | xuán liáng cì gǔ | to tie one's hair to a beam to keep awake | 形容学习极其刻苦，不怕吃苦 | 古人读书困了，就把头发系在房梁上，这种精神后来被说成＿＿。
程门立雪 | chéng mén lì xuě | to stand in the snow at the master's door | 形容尊敬老师、诚心求学 | 杨时在老师门外的大雪里站着等老师醒来，这就是＿＿的故事。
孟母三迁 | mèng mǔ sān qiān | Mencius's mother moves house three times | 比喻父母为孩子选择好的环境 | 为了让孩子在好环境里成长，她搬了好几次家，真有点像＿＿。
手不释卷 | shǒu bù shì juàn | always with a book in hand | 形容勤奋好学 | 爷爷＿＿，八十岁了每天还要读两个小时的书。
学富五车 | xué fù wǔ chē | very learned | 形容读书多，学问大 | 这位老教授＿＿，什么问题都难不倒他。 | 才高八斗
才高八斗 | cái gāo bā dǒu | of great literary talent | 形容很有文才 | 人们称赞他＿＿，写出的诗文没有人比得上。 | 学富五车
七步成诗 | qī bù chéng shī | to compose a poem in seven paces | 形容才思敏捷 | 传说曹植在走七步路的时间里作了一首诗，这就是＿＿的故事。
江郎才尽 | jiāng láng cái jìn | to have exhausted one's talent | 比喻才思减退 | 他年轻时写了很多好诗，后来却再也写不出好作品，人们说他＿＿了。
`,
  },
  {
    theme: ["Craft and Skill", "技艺"],
    data: `
胸有成竹 | xiōng yǒu chéng zhú | to have a well-thought-out plan | 做事之前已经有了全面的打算 | 这道题他早就想好了解法，回答起来＿＿。
班门弄斧 | bān mén nòng fǔ | to show off before an expert | 在行家面前卖弄本领 | 在书法家面前写毛笔字，我这是＿＿了。
入木三分 | rù mù sān fēn | penetrating, profound | 形容分析深刻或书法有力 | 这篇评论把问题分析得＿＿，让人很佩服。
目无全牛 | mù wú quán niú | to have mastered one's craft | 形容技术非常熟练，看得透事物的内部 | 老师傅修了一辈子钟表，拆开任何一块表都＿＿，几分钟就能找出问题。
百步穿杨 | bǎi bù chuān yáng | to hit a willow leaf from a hundred paces | 形容射箭非常准 | 他射箭的本领很高，能够＿＿。
运斤成风 | yùn jīn chéng fēng | to wield the axe like the wind | 形容手法熟练，技艺高超 | 这位木匠＿＿，一把斧子用得非常灵活。 | 出神入化
巧夺天工 | qiǎo duó tiān gōng | workmanship surpassing nature | 人工的精巧胜过天然 | 这件玉雕＿＿，雕出来的花像真的一样。
出神入化 | chū shén rù huà | to reach perfection | 形容技艺达到了极高的境界 | 他的魔术表演＿＿，观众们都看呆了。 | 运斤成风
鲁班 | lǔ bān | Lu Ban | 春秋时有名的工匠 | ＿＿是古代有名的工匠，被后来的木匠尊为祖师。
一技之长 | yí jì zhī cháng | a particular skill | 某一种专门的技能 | 学会一门手艺，有了＿＿，就不怕找不到工作。
`,
  },
  {
    theme: ["Persistence and Giving Up", "坚持和放弃"],
    data: `
水滴石穿 | shuǐ dī shí chuān | constant dripping wears away the stone | 比喻只要坚持，力量小也能成功 | ＿＿，只要每天背十个单词，一年下来就很可观了。 | 聚沙成塔
一曝十寒 | yí pù shí hán | to work by fits and starts | 比喻学习或工作没有恒心 | 学习不能＿＿，要天天坚持。
有始有终 | yǒu shǐ yǒu zhōng | to see something through | 做事坚持到底 | 既然答应了这件事，就要＿＿，不能做到一半就不管了。
百折不挠 | bǎi zhé bù náo | undaunted by repeated setbacks | 无论受多少挫折都不退缩 | 他经历了很多失败，却＿＿，最后终于成功了。
聚沙成塔 | jù shā chéng tǎ | many a little makes a mickle | 比喻积少成多 | 每人捐一点，＿＿，就能帮助很多有困难的人。 | 水滴石穿
虎头蛇尾 | hǔ tóu shé wěi | a strong start and a weak finish | 比喻开始声势很大，后来劲头很小 | 他做事总是＿＿，开头很热情，没几天就放弃了。
一鼓作气 | yì gǔ zuò qì | to press on in one go | 趁劲头大的时候一下子把事情做完 | 我们＿＿爬上了山顶，中间一次也没休息。
再接再厉 | zài jiē zài lì | to keep up the effort | 继续努力，更加努力 | 这次比赛你们表现得很好，希望＿＿，争取更好的成绩。
卷土重来 | juǎn tǔ chóng lái | to make a comeback | 失败以后重新恢复力量再来 | 去年输了比赛，今年他们又＿＿，终于赢了冠军。
功败垂成 | gōng bài chuí chéng | to fail on the verge of success | 事情快要成功的时候失败了 | 只差最后一步，他却＿＿，真让人可惜。
`,
  },
  {
    theme: ["Friends in Need", "朋友之间"],
    data: `
高山流水 | gāo shān liú shuǐ | lofty mountains and flowing water (a perfect friendship) | 比喻知己难得，也比喻乐曲高妙 | 他们两人都爱音乐，彼此最懂对方，是一对＿＿般的知己。
知音 | zhī yīn | a friend who truly understands one | 非常了解自己的朋友 | 人生难得遇到一个＿＿。
锦上添花 | jǐn shàng tiān huā | to make what is good even better | 在好的上面再加好的 | 他本来就很优秀，这次获奖更是＿＿。
落井下石 | luò jǐng xià shí | to hit a person when he is down | 趁别人危难时加以陷害 | 别人遇到困难，他不但不帮忙，反而在这个时候说他的坏话，这是＿＿。
过河拆桥 | guò hé chāi qiáo | to abandon one's helpers after success | 比喻达到目的以后，就不再理会帮助过自己的人 | 他事情办成了，就再也不理那些帮过他的人，真是＿＿。
拔刀相助 | bá dāo xiāng zhù | to come to someone's aid | 见到不平的事挺身出来帮助 | 看到弱小的同学被欺负，他总是站出来＿＿。
一臂之力 | yí bì zhī lì | a helping hand | 一部分力量，一点帮助 | 你有困难就说，我愿意助你＿＿。
同甘共苦 | tóng gān gòng kǔ | to share joys and sorrows | 共同享受幸福，共同承担困难 | 他们夫妻＿＿几十年，感情一直很好。 | 患难与共
患难与共 | huàn nàn yǔ gòng | to stand together through hardship | 共同承担危险和困难 | 在那场大地震中，全村人＿＿，一起重建了家园。 | 同甘共苦
齐心协力 | qí xīn xié lì | to work as one | 大家一条心，共同努力 | 只要我们＿＿，就一定能把这件事办好。
`,
  },
  {
    theme: ["Growing Up and Growing Old", "成长和年纪"],
    data: `
刮目相看 | guā mù xiāng kàn | to see someone in a new light | 用新的眼光来看待 | 他这学期进步很快，老师和同学都对他＿＿。
士别三日 | shì bié sān rì | after three days apart (one must look at a person anew) | 比喻人的进步很快，不能用老眼光看人 | 俗话说＿＿，当刮目相看，半年不见，你的汉语说得这么好了！
青出于蓝 | qīng chū yú lán | the pupil surpasses the master | 比喻学生超过老师 | 他的学生后来比他更有名，真是＿＿。
大器晚成 | dà qì wǎn chéng | great talents mature late | 比喻能成大事的人往往成功得晚 | 他五十岁才出版第一本小说，可以说是＿＿。
少年老成 | shào nián lǎo chéng | mature beyond one's years | 年纪虽轻，却很稳重 | 这个孩子才十二岁，说话做事却很稳重，真是＿＿。
乳臭未干 | rǔ xiù wèi gān | wet behind the ears | 形容人年纪小，不懂事，带有轻视的意思 | 别看不起他是个＿＿的孩子，他的想法可不简单。
宝刀不老 | bǎo dāo bù lǎo | still going strong | 比喻年纪虽老，本领不减 | 七十岁的老教练上场示范，动作还是那么标准，真是＿＿。 | 老当益壮
老当益壮 | lǎo dāng yì zhuàng | old but vigorous | 年纪虽老，志气更大，干劲更足 | 爷爷＿＿，退休以后还学会了开车，每天去公园锻炼。 | 宝刀不老
后起之秀 | hòu qǐ zhī xiù | a promising newcomer | 后来出现的优秀人才 | 这位年轻的棋手是围棋界的＿＿，已经赢了好几位老将。
年富力强 | nián fù lì qiáng | in the prime of life | 年纪轻，精力强 | 他三十多岁，正是＿＿的时候。
`,
  },
  {
    theme: ["Healers of Old", "医术典故"],
    data: `
扁鹊 | biǎn què | Bian Que | 战国时的名医 | ＿＿是战国时期的名医，传说他总结了望、闻、问、切的看病方法。
对症下药 | duì zhèng xià yào | to suit the remedy to the problem | 比喻针对具体情况想办法 | 学习成绩不好，要先找到原因，才能＿＿。
妙手回春 | miào shǒu huí chūn | to restore to health with skilled hands | 称赞医生医术高明 | 病人出院时送给医生一面锦旗，上面写着“＿＿”。 | 起死回生
起死回生 | qǐ sǐ huí shēng | to bring back from the brink | 把快要死的人救活，比喻把没有希望的事情挽救过来 | 新来的经理改变了经营方法，让这家快要倒闭的工厂＿＿。 | 妙手回春
悬壶济世 | xuán hú jì shì | to practise medicine for the good of all | 指行医救人 | 他从医学院毕业后回到家乡，＿＿，给乡亲们看病。
杏林 | xìng lín | apricot grove (the medical world) | 指医学界 | 三国时的董奉给人治病不收钱，只请病好的人种几株杏树，后来人们用＿＿称医学界。
望闻问切 | wàng wén wèn qiè | the four diagnostic methods | 中医看病的四种方法 | 中医看病讲究＿＿，看、听、问、摸脉都很重要。
药到病除 | yào dào bìng chú | an instant cure | 药一吃，病就好 | 这位医生经验丰富，开的药常常＿＿。
防微杜渐 | fáng wēi dù jiàn | to nip in the bud | 在错误或坏事刚开始时就加以制止 | 小错不改会变成大错，所以要＿＿。
李时珍 | lǐ shí zhēn | Li Shizhen | 明代医学家，写了本草纲目 | 明朝的医学家＿＿花了近三十年时间，写成了本草纲目。
`,
  },
  {
    theme: ["Numbers and Measures", "数字和量词的成语"],
    data: `
一举两得 | yì jǔ liǎng dé | to kill two birds with one stone | 做一件事得到两种好处 | 骑自行车上班，既锻炼了身体，又保护了环境，真是＿＿。
三心二意 | sān xīn èr yì | half-hearted | 不专心，拿不定主意 | 做作业要专心，不能＿＿。
九牛一毛 | jiǔ niú yì máo | a drop in the ocean | 比喻很多中的极少部分 | 这点钱对他来说只是＿＿。
一字千金 | yí zì qiān jīn | each word worth a thousand pieces of gold | 形容文辞精妙，价值极高 | 这位作家的文章写得精彩，被誉为＿＿。
七上八下 | qī shàng bā xià | on tenterhooks | 心里不安，慌乱 | 等考试成绩的时候，他心里＿＿的。
十全十美 | shí quán shí měi | perfect | 各方面都非常完美 | 世界上没有＿＿的人，每个人都有缺点。
万无一失 | wàn wú yì shī | perfectly safe | 绝对不会出差错 | 出发前他把计划检查了好几遍，保证＿＿。
五湖四海 | wǔ hú sì hǎi | all corners of the land | 指全国各地 | 我们来自＿＿，为了同一个目标走到一起。
一波三折 | yì bō sān zhé | full of twists and turns | 比喻事情进行中变化很多 | 这次旅行＿＿，先是航班取消，后来又丢了行李。
得寸进尺 | dé cùn jìn chǐ | give an inch and they will take a mile | 得到一点还想要更多 | 你让了他一次，他就＿＿，要求越来越多。
`,
  },
  {
    theme: ["Myths and Old Tales", "神话和古代故事"],
    data: `
盘古开天 | pán gǔ kāi tiān | Pangu separates heaven and earth | 传说盘古开辟了天地 | 在＿＿的神话里，天和地原来是连在一起的。
精卫填海 | jīng wèi tián hǎi | Jingwei fills the sea | 比喻意志坚决，不怕困难 | 在＿＿的神话里，一只小鸟每天衔着石子去填大海。
夸父逐日 | kuā fù zhú rì | Kuafu chases the sun | 比喻有远大的志向 | 在＿＿的神话里，一个巨人追着太阳一直跑。
牛郎织女 | niú láng zhī nǚ | the Cowherd and the Weaver Girl | 传说中的一对夫妻，每年只能见一次面 | 传说每年七月初七，＿＿会在鹊桥上相会。
天衣无缝 | tiān yī wú fèng | flawless | 比喻事物完美，没有破绽 | 他们的配合＿＿，一点问题也没有。
八仙过海 | bā xiān guò hǎi | the Eight Immortals cross the sea | 比喻各有各的办法 | ＿＿，各显神通，比赛中每个队都用上了自己的绝招。
姜太公钓鱼 | jiāng tài gōng diào yú | Jiang Taigong fishing | 比喻心甘情愿地去做某事 | ＿＿，愿者上钩，他自己愿意参加，谁也没逼他。
王婆卖瓜 | wáng pó mài guā | to blow one's own trumpet | 比喻自己夸自己 | 他总说自己做的菜最好吃，真是＿＿，自卖自夸。
孔融让梨 | kǒng róng ràng lí | Kong Rong gives up the bigger pear | 比喻懂得谦让 | ＿＿的故事告诉孩子们要学会谦让。
曹冲称象 | cáo chōng chēng xiàng | Cao Chong weighs the elephant | 比喻用聪明的办法解决难题 | 在＿＿的故事里，一个小孩子用船和石头称出了大象的重量。
`,
  },
  {
    theme: ["Tales and Their Sources", "典故的来源"],
    data: `
出处 | chū chù | source (of a quotation) | 引文或典故的来源 | 这个成语的＿＿在哪本古书里，你查过吗？ | 来历
用典 | yòng diǎn | to use allusions | 在诗文里引述古代的故事或语句 | 古人写诗喜欢＿＿，读的时候要了解背后的故事。
引经据典 | yǐn jīng jù diǎn | to quote the classics | 引用经典书籍里的语句或故事 | 他说话喜欢＿＿，一开口就是古书里的话。
来历 | lái lì | origin, background | 人或事物的来源和经历 | 这块石碑的＿＿，村里的老人都说得清楚。 | 出处
掌故 | zhǎng gù | anecdotes of history and customs | 关于历史人物和制度的故事 | 这位老先生熟悉北京的＿＿，讲起老胡同的故事来头头是道。
佳话 | jiā huà | a story passed on with praise | 流传开来、被人称赞的事 | 两位老人互相帮助几十年的故事，在村里传为＿＿。 | 美谈
美谈 | měi tán | a much-praised tale | 人们称赞、乐于谈论的事 | 他把路上发现的钱包还给了失主，这件事成了大家口中的＿＿。 | 佳话
出自 | chū zì | to come from | 从某处出来 | “温故知新”这句话＿＿论语。
千古 | qiān gǔ | through the ages | 很长的时间 | 这个故事流传＿＿，一直被人们传颂。
原文 | yuán wén | the original text | 引用或翻译所依据的文章 | 这句话是我翻译的，＿＿是一句古文。
`,
  },
  {
    theme: ["Fortune Turns", "祸福变化"],
    data: `
苦尽甘来 | kǔ jìn gān lái | after bitterness comes sweetness | 困难过去，好日子到来 | 他们经过多年的努力，终于＿＿，过上了好日子。 | 时来运转
乐极生悲 | lè jí shēng bēi | extreme joy begets sorrow | 高兴到了极点，发生了悲伤的事 | 他赢了比赛高兴得跳起来，结果扭伤了脚，真是＿＿。
时来运转 | shí lái yùn zhuǎn | luck turns for the better | 时机到了，运气好转 | 他失业了好几个月，最近＿＿，找到了一份好工作。 | 苦尽甘来
好事多磨 | hǎo shì duō mó | good things take trouble | 好事情往往要经过许多波折才能成功 | ＿＿，这件事虽然不顺利，但最后一定能办成。
柳暗花明 | liǔ àn huā míng | light at the end of the tunnel | 比喻在困难中出现了转机 | 正当他们找不到出路的时候，事情突然＿＿，有了新的希望。
转危为安 | zhuǎn wēi wéi ān | to pull through | 从危险转为平安 | 经过医生的抢救，病人终于＿＿。
喜出望外 | xǐ chū wàng wài | overjoyed | 遇到意想不到的好事而特别高兴 | 收到大学的录取通知书，他＿＿。
节外生枝 | jié wài shēng zhī | to raise unexpected complications | 比喻在原有问题之外又出现了新问题 | 事情就快办好了，你可别再＿＿。
失而复得 | shī ér fù dé | to recover what was lost | 丢了的东西又找了回来 | 丢了三天的小狗自己跑回了家，这只＿＿的小狗让全家人高兴极了。
福无双至 | fú wú shuāng zhì | blessings never come in pairs | 好事不会接连到来 | 俗话说＿＿，祸不单行，他刚丢了钱包，又把手机弄坏了。
`,
  },
  // Unit 3: Philosophy.
  {
    theme: ["Greek Philosophers", "古希腊哲学家"],
    data: `
苏格拉底 | sū gé lā dǐ | Socrates | 古希腊哲学家，常用提问的方法和人讨论 | ＿＿自己没有写过书，他的思想主要靠学生记录下来。
柏拉图 | bó lā tú | Plato | 古希腊哲学家，苏格拉底的学生 | ＿＿在雅典创办了一所学园，在那里讲学几十年。
亚里士多德 | yà lǐ shì duō dé | Aristotle | 古希腊哲学家，柏拉图的学生 | ＿＿是柏拉图的学生，后来又当过亚历山大大帝的老师。
赫拉克利特 | hè lā kè lì tè | Heraclitus | 古希腊哲学家，认为万物都在变化 | ＿＿说过，人不能两次踏进同一条河流。
泰勒斯 | tài lè sī | Thales | 古希腊最早的哲学家之一 | 被称为古希腊第一位哲学家的＿＿认为，万物的本原是水。
毕达哥拉斯 | bì dá gē lā sī | Pythagoras | 古希腊哲学家和数学家 | ＿＿认为万物都是数，西方用他的名字称呼勾股定理。
芝诺 | zhī nuò | Zeno of Elea | 古希腊哲学家，以提出悖论闻名 | ＿＿提出了一个有名的问题：跑得最快的人也追不上前面的乌龟。
第欧根尼 | dì ōu gēn ní | Diogenes | 古希腊哲学家，过着极其简单的生活 | 传说＿＿住在一个大缸里，除了一件衣服和一根木棒，几乎什么都没有。
犬儒学派 | quǎn rú xué pài | the Cynics | 主张过最简单的生活、不在乎财富和名声的古希腊学派 | 第欧根尼是＿＿的代表人物，他认为人应该像狗一样简单地生活。
斯多葛学派 | sī duō gé xué pài | the Stoics | 古希腊和古罗马的一个哲学派别，重视理性和自制 | ＿＿主张用理性控制情绪，平静地接受无法改变的事情。
`,
  },
  {
    theme: ["Modern Western Thinkers", "近代西方思想家"],
    data: `
笛卡尔 | dí kǎ ěr | Descartes | 法国哲学家和数学家 | “我思故我在”是法国哲学家＿＿的名言。
帕斯卡 | pà sī kǎ | Pascal | 法国数学家、物理学家和思想家 | 法国思想家＿＿年轻时发明了一种计算器，用来帮父亲算税。
洛克 | luò kè | Locke | 英国哲学家，经验主义的代表人物 | 英国哲学家＿＿认为，人刚出生时的心灵就像一块白板。
卢梭 | lú suō | Rousseau | 生于日内瓦的法国思想家 | ＿＿在爱弥儿这本书里主张，教育要顺应孩子的天性。
康德 | kāng dé | Kant | 德国哲学家 | 德国哲学家＿＿生活很有规律，据说邻居们看到他出门散步，就知道是几点了。
黑格尔 | hēi gé ěr | Hegel | 德国哲学家，辩证法的集大成者 | 德国哲学家＿＿把辩证法发展成了一个完整的体系。
叔本华 | shū běn huá | Schopenhauer | 德国哲学家，以悲观主义闻名 | 以悲观的人生观闻名的德国哲学家是＿＿。
萨特 | sà tè | Sartre | 法国哲学家和作家 | 法国哲学家＿＿是存在主义的代表人物，曾经拒绝接受诺贝尔文学奖。
培根 | péi gēn | Francis Bacon | 英国哲学家，重视实验和归纳 | “知识就是力量”这句名言，常被认为出自英国哲学家＿＿。
维特根斯坦 | wéi tè gēn sī tǎn | Wittgenstein | 生于奥地利的哲学家，研究语言和逻辑 | ＿＿认为，很多哲学问题都来自对语言的误解。
`,
  },
  {
    theme: ["Thinkers before the Qin", "先秦诸子"],
    data: `
孟子 | mèng zǐ | Mencius | 战国时儒家的代表人物 | ＿＿主张人性本来是善良的，他的言论被记在一本和他同名的书里。
亚圣 | yà shèng | the Second Sage | 后人对孟子的尊称 | 孔子被尊为“至圣”，孟子被尊为“＿＿”。
韩非子 | hán fēi zǐ | Han Feizi | 战国末期法家的代表人物 | 法家思想的集大成者是战国末期的＿＿。
杨朱 | yáng zhū | Yang Zhu | 战国时的思想家，主张重视自己的生命 | ＿＿主张“贵己”，认为每个人都应该首先珍惜自己的生命。
惠施 | huì shī | Hui Shi | 战国时名家的代表人物，庄子的朋友 | ＿＿是庄子的好朋友，两人常常在一起辩论。
公孙龙 | gōng sūn lóng | Gongsun Long | 战国时名家的代表人物 | ＿＿提出了“白马非马”这个有名的论题。
列子 | liè zǐ | Liezi | 战国时道家的人物 | 庄子的书里说，＿＿能够乘着风在天上走。
管子 | guǎn zǐ | Guanzi | 后人对春秋时管仲的尊称，也是一本书的名字 | 春秋时齐国的政治家管仲，后人尊称他为＿＿。
告子 | gào zǐ | Gaozi | 战国时的思想家，和孟子辩论过人性 | 孟子认为人性是善的，＿＿却认为人性没有善和不善的分别。
先秦 | xiān qín | the pre-Qin era | 秦朝统一以前的时代 | 孔子、老子、庄子都是＿＿时期的思想家。
`,
  },
  {
    theme: ["Sayings of Confucius", "孔子的话"],
    data: `
见贤思齐 | jiàn xián sī qí | to emulate the worthy | 看到比自己好的人就想向他看齐 | 我们要＿＿，向身边优秀的同学学习。
非礼勿视 | fēi lǐ wù shì | look not at what is improper | 不合礼的东西不看 | 孔子教导学生，不合礼的事不看、不听、不说、不做，其中第一条就是＿＿。
三十而立 | sān shí ér lì | at thirty one stands firm | 人到三十岁应该能够自立 | 孔子说自己到了三十岁能够自立，后人就用“＿＿”来指三十岁。
四十不惑 | sì shí bù huò | at forty one has no doubts | 人到四十岁能够明白事理，不再迷惑 | 他今年刚好四十岁，用孔子的话说，已经到了＿＿的年纪。
知天命 | zhī tiān mìng | to know the will of heaven (at fifty) | 指五十岁 | 孔子说“五十而＿＿”，后来人们也用它来指五十岁。
有教无类 | yǒu jiào wú lèi | education for all | 教育人不分贵贱贫富 | 孔子主张＿＿，不管学生是穷是富，他都愿意教。
仁者爱人 | rén zhě ài rén | the benevolent love others | 有仁德的人关心和爱护别人 | 儒家主张＿＿，认为有仁德的人一定会关心别人。
圣贤 | shèng xián | sages and worthies | 品德高尚、才智超群的人 | 古代读书人以＿＿为榜样，希望自己也能成为有德行的人。
己所不欲 | jǐ suǒ bù yù | what you would not have done to you | 自己不愿意的事 | “＿＿，勿施于人”的意思是：自己不愿意的事，不要强加给别人。
君子 | jūn zǐ | a person of noble character | 品德高尚的人 | 孔子说，＿＿和而不同，小人同而不和。
`,
  },
  {
    theme: ["The Way of the Daoists", "道家思想"],
    data: `
上善若水 | shàng shàn ruò shuǐ | the highest good is like water | 最好的品德像水一样，滋养万物而不争 | 老子说＿＿，因为水帮助万物，却从来不争。
道法自然 | dào fǎ zì rán | the Dao follows what is natural | 道以自然为法则 | 老子主张＿＿，人应该顺着自然的规律去做事。
无为而治 | wú wéi ér zhì | to govern without interfering | 不过多干涉，让社会自然发展 | 汉朝初年，统治者采用＿＿的办法，让百姓休养生息。
大巧若拙 | dà qiǎo ruò zhuō | great skill seems clumsy | 真正聪明灵巧的人，表面上看起来很笨 | 这位老工匠平时话不多，看上去笨手笨脚，其实是＿＿。
庄周梦蝶 | zhuāng zhōu mèng dié | Zhuangzi dreams he is a butterfly | 庄子梦见自己变成蝴蝶的故事 | 在＿＿的故事里，庄子醒来以后分不清是自己梦见了蝴蝶，还是蝴蝶梦见了自己。
齐物论 | qí wù lùn | On the Equality of Things | 庄子的一篇文章，认为万物没有根本的差别 | 庄子在＿＿里说，从道的角度看，万物都是平等的。
子非鱼 | zǐ fēi yú | you are not a fish | 比喻不是对方，就不能完全了解对方的感受 | 惠施对庄子说：“＿＿，怎么知道鱼的快乐？”
道德经 | dào dé jīng | the Daodejing | 老子写的书，又叫老子 | 相传老子留下了五千多字的＿＿。
坐忘 | zuò wàng | sitting and forgetting | 庄子说的一种修养方法，忘掉自己和外物 | 庄子讲的＿＿，是让人静坐下来，忘掉身体和外面的一切。
心斋 | xīn zhāi | fasting of the heart | 庄子说的使心清净空明的修养方法 | 庄子提出＿＿，意思是让心像吃素那样清净，不被杂念打扰。
`,
  },
  {
    theme: ["The Changes and the Trigrams", "周易和阴阳"],
    data: `
周易 | zhōu yì | the Book of Changes | 古代讲变化和占卜的书 | ＿＿是中国最古老的经典之一，讲的是万物的变化。
八卦 | bā guà | the eight trigrams | 周易里的八种基本符号 | 天、地、雷、风、水、火、山、泽是＿＿所代表的八种自然现象。
乾坤 | qián kūn | heaven and earth | 天地；也指局面 | 人们常说“扭转＿＿”，意思是根本改变局面。
太极 | tài jí | the Supreme Ultimate | 古代哲学中指最原始的本体 | 古人认为＿＿生出阴阳两仪，再生出万物。
五行 | wǔ xíng | the five phases | 古人认为构成万物的五种基本元素 | 古人用金、木、水、火、土＿＿来解释万物的关系。
天人合一 | tiān rén hé yī | the unity of heaven and humankind | 人和自然是一个整体 | ＿＿的思想认为，人应该和自然和谐相处。
相生相克 | xiāng shēng xiāng kè | to generate and overcome one another | 互相促进又互相制约 | 古人认为五行之间＿＿，比如木生火，水克火。
自强不息 | zì qiáng bù xī | to strive ceaselessly | 自己努力向上，永不停止 | 周易里说“天行健，君子以＿＿”。
厚德载物 | hòu dé zài wù | to bear all things with great virtue | 用宽厚的品德包容万物 | 周易里说“地势坤，君子以＿＿”。
浑然一体 | hún rán yì tǐ | an integral whole | 完整而不可分割 | 这座园林的建筑和山水＿＿，好像天然生成的一样。
`,
  },
  {
    theme: ["Neo-Confucians", "宋明理学和心学"],
    data: `
王阳明 | wáng yáng míng | Wang Yangming | 明代思想家，心学的代表人物 | 明代思想家＿＿不但是一位哲学家，还是一位军事家和书法家。
陆九渊 | lù jiǔ yuān | Lu Jiuyuan | 南宋思想家，心学的开创者 | 南宋的＿＿被看作心学的开创者，后来王阳明继承和发展了他的思想。
张载 | zhāng zài | Zhang Zai | 北宋思想家 | “为天地立心，为生民立命”是北宋思想家＿＿说的话。
二程 | èr chéng | the two Cheng brothers | 北宋的程颢和程颐两兄弟 | 北宋有一对兄弟都是理学家，后人合称他们为“＿＿”。
理学 | lǐ xué | the School of Principle | 宋明时期以“理”为核心的儒家学说 | 宋朝的＿＿认为，天地万物都有一个“理”。 | 心学
心学 | xīn xué | the School of Mind | 宋明时期认为“心”就是“理”的儒家学说 | 王阳明的＿＿认为，道理不在外面，就在自己的心里。
知行合一 | zhī xíng hé yī | the unity of knowing and doing | 认识和行动是统一的 | 光知道道理还不够，还要去做，这就是＿＿。
致良知 | zhì liáng zhī | to extend one's innate knowing | 把本来就有的善心推广到做事上 | 王阳明晚年提出＿＿，认为每个人心里本来就有分辨善恶的能力。
龙场悟道 | lóng chǎng wù dào | the awakening at Longchang | 王阳明在贵州龙场领悟道理的故事 | 王阳明被贬到贵州以后，在那里想通了很多道理，这就是有名的＿＿。
心即理 | xīn jí lǐ | the mind is principle | 心就是理 | 陆九渊和王阳明都主张＿＿，认为道理就在人的心中。
`,
  },
  {
    theme: ["Faulty Arguments", "逻辑和诡辩"],
    data: `
非黑即白 | fēi hēi jí bái | black-and-white thinking | 认为事情只有两种可能，不是这样就是那样 | 他觉得不是好人就是坏人，这种＿＿的想法太简单了。
因果倒置 | yīn guǒ dào zhì | to mistake effect for cause | 把结果当成原因 | 说“消防车越多的地方火灾越多，所以消防车引起了火灾”，这是＿＿。
自圆其说 | zì yuán qí shuō | to make one's story hold together | 使自己的说法没有漏洞 | 他的解释前后矛盾，根本无法＿＿。
漏洞百出 | lòu dòng bǎi chū | full of holes | 说话或做事破绽很多 | 他编的理由＿＿，谁也不相信。
强词夺理 | qiǎng cí duó lǐ | to argue unreasonably | 没有理还要硬说出理来 | 明明是他错了，他还＿＿，说是别人的错。 | 胡搅蛮缠
理屈词穷 | lǐ qū cí qióng | to be bested in argument | 理由站不住，没有话可说了 | 在大家的追问下，他＿＿，只好承认了错误。
胡搅蛮缠 | hú jiǎo mán chán | to pester unreasonably | 不讲道理地跟人纠缠 | 这位顾客＿＿，一直不让售货员走。 | 强词夺理
颠倒黑白 | diān dǎo hēi bái | to turn the truth upside down | 故意把是说成非，把非说成是 | 明明是他弄坏的，他却说是别人弄坏的，这不是＿＿吗？
牵强附会 | qiān qiǎng fù huì | far-fetched | 把没有关系的事硬扯在一起 | 把考试成绩和星座联系在一起，实在是＿＿。
无懈可击 | wú xiè kě jī | unassailable | 完美得找不出一点漏洞 | 他的论证＿＿，对方一句也反驳不了。
`,
  },
  {
    theme: ["Ways of Knowing", "认识的方法"],
    data: `
管中窥豹 | guǎn zhōng kuī bào | to see only part of the picture | 从管子里看豹，只看到豹身上的一块斑纹 | 只看了一篇文章就评价一位作家，难免＿＿。
一叶知秋 | yí yè zhī qiū | a falling leaf heralds autumn | 从小的迹象可以推知大的变化 | ＿＿，从这件小事就能看出社会风气的变化。 | 见微知著
见微知著 | jiàn wēi zhī zhù | to see the whole from a small clue | 看到细小的苗头就知道它的发展方向 | 一个好的医生能够＿＿，从很小的症状发现大病。 | 一叶知秋
触类旁通 | chù lèi páng tōng | to comprehend by analogy | 掌握了一种事物的道理，就能推知同类事物 | 学会了一道题的解法，就能＿＿，解出一类题。
以小见大 | yǐ xiǎo jiàn dà | to see the big through the small | 通过小事反映出大道理 | 这篇文章＿＿，通过一家人的小故事写出了整个时代的变化。
由表及里 | yóu biǎo jí lǐ | from the surface to the core | 从表面深入到内部 | 分析问题要＿＿，不能只看表面现象。
去伪存真 | qù wěi cún zhēn | to discard the false and keep the true | 去掉假的，留下真的 | 网上的信息很多，我们要学会＿＿，不能什么都信。
认识论 | rèn shi lùn | epistemology | 研究知识的来源和真理标准的哲学理论 | 人是怎样获得知识的？这是＿＿要回答的问题。
方法论 | fāng fǎ lùn | methodology | 关于认识世界和改造世界的方法的理论 | 科学研究不仅要有知识，还要有正确的＿＿。
格物致知 | gé wù zhì zhī | to investigate things to extend knowledge | 研究事物的道理来获得知识 | 王阳明年轻时为了＿＿，对着竹子看了七天，结果什么也没想明白。
`,
  },
  {
    theme: ["Thought Experiments", "思想实验"],
    data: `
思想实验 | sī xiǎng shí yàn | thought experiment | 只在头脑中进行、不需要真正动手的实验 | 爱因斯坦想象自己追着光跑，这是一个有名的＿＿。
电车难题 | diàn chē nán tí | the trolley problem | 一个关于是否牺牲少数人来救多数人的伦理问题 | ＿＿问的是：为了救五个人，是否应该让另一个人受到伤害？
囚徒困境 | qiú tú kùn jìng | the prisoner's dilemma | 两个人各自选择对自己最有利的做法，结果对双方都不利 | ＿＿说明，每个人都只考虑自己，结果可能对大家都不好。
缸中之脑 | gāng zhōng zhī nǎo | brain in a vat | 设想一个只有大脑放在缸里、靠电脑提供感觉的人 | ＿＿这个思想实验问：我们怎么知道自己看到的世界是真实的？
奥卡姆剃刀 | ào kǎ mǔ tì dāo | Occam's razor | 如果没有必要，就不要增加多余的假设 | 根据＿＿，能用简单的解释说明问题，就不要用复杂的解释。
芝诺悖论 | zhī nuò bèi lùn | Zeno's paradoxes | 芝诺提出的一些关于运动的悖论 | “飞着的箭其实是不动的”是有名的＿＿之一。
说谎者悖论 | shuō huǎng zhě bèi lùn | the liar paradox | 一句说自己是假话的话到底是真是假的问题 | 如果一个人说“我现在说的这句话是假话”，这句话到底是真是假？这就是＿＿。
理发师悖论 | lǐ fà shī bèi lùn | the barber paradox | 一个只给不给自己理发的人理发的理发师，该不该给自己理发的问题 | 罗素用＿＿来说明集合论里的一个问题。
中文房间 | zhōng wén fáng jiān | the Chinese room | 一个关于机器是否真正理解语言的思想实验 | ＿＿这个思想实验问：一台只会按规则处理汉字的机器，算不算真的懂中文？
无知之幕 | wú zhī zhī mù | the veil of ignorance | 设想人们在不知道自己将来身份的情况下制定规则 | 根据＿＿的设想，如果你不知道自己会出生在什么家庭，你就会选择更公平的规则。
`,
  },
  {
    theme: ["Schools of Thought", "哲学流派"],
    data: `
怀疑论 | huái yí lùn | scepticism | 认为人不能获得确定知识的理论 | 古希腊的皮浪主张对一切判断都要保持怀疑，他是＿＿的代表人物。 | 不可知论
不可知论 | bù kě zhī lùn | agnosticism | 认为世界的本质无法被认识的理论 | ＿＿认为，事物背后的本质是人永远无法认识的。 | 怀疑论
决定论 | jué dìng lùn | determinism | 认为一切事情都由原因决定的理论 | 按照＿＿的看法，只要知道了所有的原因，就能准确地预测将来发生的事。 | 宿命论
宿命论 | sù mìng lùn | fatalism | 认为一切都由命运决定、人无法改变的观点 | 他相信＿＿，觉得努力也没有用，因为一切都是命中注定的。 | 决定论
经验主义 | jīng yàn zhǔ yì | empiricism | 认为知识来自感觉经验的理论 | 洛克是＿＿的代表人物，他认为一切知识都来自经验。 | 理性主义
理性主义 | lǐ xìng zhǔ yì | rationalism | 认为知识主要来自理性的理论 | 笛卡尔是＿＿的代表人物，他相信理性是知识最可靠的来源。
实用主义 | shí yòng zhǔ yì | pragmatism | 以实际效果来判断真理的理论 | 美国哲学家杜威是＿＿的代表人物。
虚无主义 | xū wú zhǔ yì | nihilism | 否定一切意义和价值的思想 | ＿＿认为，人生没有任何意义和价值。
存在主义 | cún zài zhǔ yì | existentialism | 强调个人自由选择和责任的哲学 | 萨特认为，人首先存在，然后通过选择决定自己是什么样的人，这是＿＿的核心观点。
形而上学 | xíng ér shàng xué | metaphysics | 研究世界最根本的存在和本质的学问 | 世界的本原是什么？这是＿＿要研究的问题。
`,
  },
  {
    theme: ["Mencius and Moral Choice", "孟子和道德选择"],
    data: `
浩然之气 | hào rán zhī qì | the flood-like spirit of righteousness | 正大刚直的精神 | 孟子说要善于培养自己的＿＿，做一个正直的人。
舍生取义 | shě shēng qǔ yì | to give one's life for righteousness | 为了正义可以舍弃生命 | 孟子说，生命和正义不能同时得到的时候，应该＿＿。 | 牺牲
民贵君轻 | mín guì jūn qīng | the people matter more than the ruler | 百姓比君主更重要 | 孟子提出＿＿的思想，认为国家的根本在于百姓。
鱼与熊掌 | yú yǔ xióng zhǎng | fish and bear's paw (one cannot have both) | 比喻两样好东西不能同时得到 | 既想多玩又想考第一，这就像＿＿，不可兼得。
五十步笑百步 | wǔ shí bù xiào bǎi bù | the pot calling the kettle black | 比喻自己和别人有同样的缺点，只是程度轻一些，却嘲笑别人 | 你自己也迟到了五分钟，还笑他迟到了十分钟，这是＿＿。
性善论 | xìng shàn lùn | the theory that human nature is good | 认为人的本性是善良的学说 | 孟子主张＿＿，认为每个人天生都有同情心。 | 性恶论
性恶论 | xìng è lùn | the theory that human nature is bad | 认为人的本性是恶的、需要后天教化的学说 | 与孟子相反，有的儒家学者主张＿＿，认为人要靠学习和礼法才能变好。
生于忧患 | shēng yú yōu huàn | to thrive in adversity | 在忧愁和困难中使人奋发而生存 | 孟子说“＿＿，死于安乐”，困难能让人变得坚强。
牺牲 | xī shēng | to sacrifice | 为了某种目的舍弃自己的生命或利益 | 为了照顾生病的妈妈，她＿＿了很多休息时间。
不朽 | bù xiǔ | immortal, everlasting | 永远不会消失 | 古人认为立德、立功、立言是人生的三＿＿。
`,
  },
  {
    theme: ["Time and Change", "时间和变化"],
    data: `
刹那 | chà nà | an instant | 极短的时间 | 流星从天空划过，只在一＿＿间就消失了。
白驹过隙 | bái jū guò xì | time flies like a white colt glimpsed through a crack | 比喻时间过得非常快 | 人生如＿＿，我们要珍惜每一天。 | 斗转星移
逝者如斯 | shì zhě rú sī | time passes like the flowing river | 时间像流水一样不停地过去 | 孔子站在河边说“＿＿”，感叹时间像河水一样不停地流走。
稍纵即逝 | shāo zòng jí shì | fleeting | 稍微放松就会失去，形容时间或机会很容易失去 | 机会＿＿，看准了就要马上抓住。
沧海桑田 | cāng hǎi sāng tián | the sea becomes mulberry fields | 比喻世事变化很大 | 几千年前这里还是一片大海，如今成了平原，真是＿＿。
变化无常 | biàn huà wú cháng | ever-changing, unpredictable | 经常变化，没有规律 | 山上的天气＿＿，刚才还是晴天，一会儿就下起了雨。
时过境迁 | shí guò jìng qiān | times have changed | 时间过去了，情况也变了 | ＿＿，当年那些烦恼现在看起来都不算什么了。 | 物是人非
物是人非 | wù shì rén fēi | things remain but people have changed | 东西还是原来的，人却已经不同了 | 回到小时候住过的老房子，＿＿，邻居们都已经搬走了。 | 时过境迁
斗转星移 | dǒu zhuǎn xīng yí | the stars change their places | 比喻时间和季节的变化 | ＿＿，几十年过去了，当年的小树已经长成了大树。 | 白驹过隙
匆匆 | cōng cōng | hurriedly | 急急忙忙的样子 | 他＿＿吃了几口饭，就赶去上班了。
`,
  },
  {
    theme: ["Attitudes to Life", "人生态度"],
    data: `
知足常乐 | zhī zú cháng lè | contentment brings happiness | 知道满足就会经常快乐 | 奶奶常说＿＿，有吃有住、家人健康就很好了。 | 安贫乐道
安贫乐道 | ān pín lè dào | to be content in poverty and delight in the Way | 安于贫穷，以坚守道义为乐 | 孔子的学生颜回住在简陋的小巷里，却＿＿，从不抱怨。 | 知足常乐
淡泊名利 | dàn bó míng lì | indifferent to fame and gain | 不追求名声和利益 | 这位科学家＿＿，把奖金全部捐给了学校。
宁静致远 | níng jìng zhì yuǎn | tranquillity leads far | 内心平静才能实现远大的目标 | 诸葛亮在给儿子的信里说“非宁静无以致远”，后来人们常说＿＿。
随遇而安 | suí yù ér ān | to be at ease wherever one is | 在任何环境中都能安心 | 他是个＿＿的人，不管搬到哪里都能很快适应。
喜悦 | xǐ yuè | joy | 高兴，愉快 | 看到自己种的花开了，她心里充满了＿＿。
心浮气躁 | xīn fú qì zào | restless and impatient | 心里不踏实，不冷静 | 做研究不能＿＿，要沉下心来慢慢做。
安逸 | ān yì | easy and comfortable | 安闲舒适 | 他不满足于＿＿的生活，辞掉了工作去山区教书。
迷茫 | mí máng | lost, at a loss | 对前途感到不知所措 | 高中毕业时，他对将来很＿＿，不知道该选什么专业。
顺其自然 | shùn qí zì rán | to let things take their course | 不勉强，让事情自然发展 | 结果怎么样已经不重要了，我们努力过了，就＿＿吧。
`,
  },
  {
    theme: ["Dialectics", "辩证法"],
    data: `
祸福相倚 | huò fú xiāng yǐ | fortune and misfortune lean on each other | 坏事和好事互相依存，可以互相转化 | 老子认为＿＿，坏事里藏着好事，好事里也藏着坏事。
物极必反 | wù jí bì fǎn | extremes turn into their opposites | 事物发展到极点就会向相反的方向转化 | 吃东西也要适量，＿＿，吃得太多反而伤身体。
否极泰来 | pǐ jí tài lái | after the storm comes the calm | 坏运到了尽头，好运就来了 | ＿＿，经过那几年的艰难，他们一家终于过上了好日子。
对立统一 | duì lì tǒng yī | the unity of opposites | 矛盾双方既互相排斥又互相依存 | 冷和热、上和下、有和无，都是＿＿的关系。
量变 | liàng biàn | quantitative change | 数量上的变化 | 水温一度一度升高，是＿＿，到了一百度变成水蒸气，就是质变了。 | 质变
质变 | zhì biàn | qualitative change | 根本性质的变化 | 每天进步一点点，积累多了就会发生＿＿。
相对 | xiāng duì | relative | 依靠一定条件而存在的，不是绝对的 | 大和小是＿＿的，一座山比石头大，可是比地球小得多。
扬弃 | yáng qì | to sublate | 发扬好的、去掉坏的 | 对传统文化，我们要有所＿＿，保留好的，去掉不好的。
内因 | nèi yīn | internal cause | 事物内部的原因 | 一个人能不能进步，＿＿是根本，外部条件只是辅助。 | 外因
外因 | wài yīn | external cause | 事物外部的原因 | 鸡蛋在合适的温度下能变成小鸡，温度只是＿＿，鸡蛋本身才是根本。 | 内因
`,
  },
  {
    theme: ["Meditation and Insight", "静思和觉悟"],
    data: `
冥想 | míng xiǎng | meditation | 静下心来深深地思考或放松 | 每天早上他都要闭上眼睛＿＿十分钟，让自己平静下来。 | 静坐 沉思
当头棒喝 | dāng tóu bàng hè | a sharp warning | 比喻使人猛然醒悟的警告 | 老师的批评对他来说是＿＿，让他明白了自己的问题。
机锋 | jī fēng | pointed, subtle words | 禅宗里含义深刻、巧妙的话 | 禅师们说话常带＿＿，意思要细细体会。
顿悟 | dùn wù | sudden enlightenment | 突然明白 | 他想了很久都没想通，看到窗外的落叶时一下子＿＿了。 | 渐悟
沉思 | chén sī | to ponder | 深深地思考 | 他站在窗前，陷入了长久的＿＿。 | 冥想
内省 | nèi xǐng | introspection | 检查自己的思想和言行 | 曾子说“吾日三省吾身”，强调每天都要＿＿。 | 反思
反思 | fǎn sī | to reflect on | 回过头来思考 | 考试失败后，他认真＿＿了自己的学习方法。 | 内省
静坐 | jìng zuò | to sit quietly | 安静地坐着 | 他每天晚上都要＿＿半个小时，什么也不想。 | 冥想
公案 | gōng àn | koan | 禅宗用来启发人思考的故事或问答 | 禅宗的＿＿常常是一个看起来不合常理的问题。
渐悟 | jiàn wù | gradual enlightenment | 一步一步地明白 | 禅宗有顿悟和＿＿两种说法，后者认为要一步一步地修行。
`,
  },
];
