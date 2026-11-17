// The words of units 1 to 6 of level 6 (docs/chinese-curriculum.md §8.4), in the format of level 3 (../level-3/word-data.ts).
//
// A line a word, as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** wordBatchesA are the 60 word batches of units 1 to 6 of level 6, in teaching order. */
export const wordBatchesA: readonly LevelWordBatch[] = [
  // Unit 1: Language and Communication.
  {
    theme: ["Languages of the World", "世界的语言"],
    data: `
语言 | yǔ yán | language | 人们用来交流的声音和文字 | 世界上有几千种＿＿，有的只有很少的人会说。 | 语种
书面语 | shū miàn yǔ | written language | 写文章时用的比较正式的语言 | 写论文要用＿＿，不能像聊天一样随便。
俗语 | sú yǔ | common saying | 老百姓口头上流传很久的话 | “活到老，学到老”是一句＿＿。
成语 | chéng yǔ | set phrase, idiom | 大多是四个字、意思固定的老说法 | “一举两得”是一个＿＿，意思是做一件事得到两种好处。
词典 | cí diǎn | dictionary | 解释词语的意思和用法的书 | 遇到不认识的词，可以查＿＿。 | 字典
字典 | zì diǎn | character dictionary | 解释单个汉字的书 | 这本小＿＿收了一万多个汉字，每个字都标了拼音。 | 词典
语种 | yǔ zhǒng | (kind of) language | 语言的种类 | 这个翻译软件能翻译一百多个＿＿。 | 语言
简体字 | jiǎn tǐ zì | simplified characters | 笔画比较少的汉字写法 | 现在中国大陆的书和报纸都用＿＿印。
术语 | shù yǔ | technical term | 某个专业里专门用的词 | 医生说话常常用很多＿＿，病人不太容易听懂。
外来词 | wài lái cí | loanword | 从别的语言里借来的词 | “沙发”是一个＿＿，它的读音来自英语。
`,
  },
  {
    theme: ["Speaking and the Voice", "说话和声音"],
    data: `
舌头 | shé tou | tongue | 嘴里能动、帮助说话和尝味道的部分 | 发这个音的时候，＿＿要放在上面的牙后面。
嘴唇 | zuǐ chún | lip | 嘴边上红色的部分 | 冬天天气干，他的＿＿常常起皮。
喊 | hǎn | to shout | 大声叫 | 他在楼下大声＿＿我的名字。
沙哑 | shā yǎ | hoarse | 声音低而不清楚 | 他唱了一晚上歌，声音变得很＿＿。
沉默 | chén mò | silent | 不说话 | 听到这个坏消息，大家都＿＿了，很久没有人开口。
叹气 | tàn qì | to sigh | 心里不痛快时长长地出一口气 | 遇到一点小问题就＿＿，是没有用的。
吐字 | tǔ zì | to enunciate | 说话、唱歌时把每个字的音发出来 | 这位播音员＿＿清楚，每个字都听得明白。
声调 | shēng diào | tone (of a syllable) | 汉语一个音节的高低变化 | 普通话有四个＿＿，还有轻声。 | 语调
语调 | yǔ diào | intonation | 说一句话时声音的高低变化 | 问问题的时候，句子最后的＿＿常常往上走。 | 声调
低声 | dī shēng | in a low voice | 声音很小地 | 图书馆里大家都＿＿说话，怕影响别人。
`,
  },
  {
    theme: ["Meanings and Hints", "意思和暗示"],
    data: `
含义 | hán yì | meaning, implication | 词语或话里包含的意思 | 这句话表面上很简单，其实有很深的＿＿。 | 言外之意
包含 | bāo hán | to contain | 里面有 | 这个词＿＿了两层意思。 | 包括
包括 | bāo kuò | to include | 算在里面 | 这次一共来了十个国家的学生，＿＿中国和日本。 | 包含
暗示 | àn shì | to hint | 不直接说，用别的方式让人明白 | 他看了看手表，＿＿我们该走了。
所谓 | suǒ wèi | so-called | 所说的，常常表示不同意 | 他说的＿＿“好办法”，其实一点儿用也没有。
无所谓 | wú suǒ wèi | not to care | 怎么样都可以 | 去哪儿吃饭我都＿＿，你决定吧。
在乎 | zài hu | to care about | 放在心上 | 他很＿＿别人怎么看他。
意味着 | yì wèi zhe | to mean, to signify | 表示某种意思或结果 | 红灯亮了，＿＿车必须停下来。
言外之意 | yán wài zhī yì | implied meaning | 话里没有直接说出来的意思 | 他说“时间不早了”，＿＿是想回家了。 | 含义
概括 | gài kuò | to summarize | 把主要的意思简单地说出来 | 请用一句话＿＿这篇文章的内容。
`,
  },
  {
    theme: ["Persuading and Agreeing", "劝说和同意"],
    data: `
劝 | quàn | to urge | 讲道理让人听从 | 医生＿＿他多休息，少看手机。 | 劝说 劝告
劝说 | quàn shuō | to persuade | 讲道理让别人同意 | 经过朋友们的＿＿，他终于决定去看医生。 | 劝 劝告
劝告 | quàn gào | advice | 劝人的话 | 他没有听父母的＿＿，结果后悔了。 | 劝 劝说
说服 | shuō fú | to convince | 讲道理让人心里同意 | 他的理由很充分，＿＿了所有的人。
肯定 | kěn dìng | to affirm | 承认事情是对的、好的 | 老师＿＿了他的做法，说这个办法很好。 | 赞同
不肯 | bù kěn | to refuse to | 不愿意 | 他生气了，＿＿跟任何人说话。
口才 | kǒu cái | eloquence | 说话的能力 | 他的＿＿很好，讲起故事来大家都爱听。
恰当 | qià dàng | appropriate | 合适 | 这个词用在这里不太＿＿，换一个吧。
巧妙 | qiǎo miào | clever, ingenious | 方法好，不一般 | 他用一个＿＿的比喻把问题讲清楚了。
赞同 | zàn tóng | to approve of | 同意，认为好 | 大多数人都＿＿这个计划。 | 肯定
`,
  },
  {
    theme: ["Orders and Messages", "命令和传话"],
    data: `
命令 | mìng lìng | order | 上级要下级做的事 | 船长下了＿＿，所有的人马上离开了船。 | 指令 口令
指令 | zhǐ lìng | instruction (to a machine) | 让机器按要求工作的话或信号 | 你可以用说话的方式给手机下＿＿。 | 命令
口令 | kǒu lìng | word of command | 喊出来让大家一起做动作的话 | 体育课上，同学们听老师的＿＿向左转。 | 命令
暗号 | àn hào | secret signal | 只有约好的人才懂的表示方法 | 他们约好拍三下手作为＿＿。
令人 | lìng rén | to make one (feel) | 让人 | 这个消息真＿＿高兴！
派 | pài | to send | 让人去做事 | 经理＿＿他去机场接客人。
传达 | chuán dá | to pass on | 把一方的意思告诉另一方 | 班长把校长的话＿＿给了每个同学。 | 传话
请示 | qǐng shì | to ask for instructions | 向上级问该怎么做 | 这件事我决定不了，要先＿＿经理。
传话 | chuán huà | to carry a message | 把一个人的话告诉另一个人 | 你们直接谈吧，别总让我在中间＿＿。 | 传达
回话 | huí huà | reply | 给对方的回答 | 你问问他明天来不来，然后给我个＿＿。
`,
  },
  {
    theme: ["Maybe, If and Since", "可能、假如和既然"],
    data: `
或者 | huò zhě | or | 表示几个里面选一个 | 你可以坐地铁＿＿坐公共汽车去机场。
或许 | huò xǔ | perhaps | 可能 | 天这么黑，＿＿要下雨了。 | 万一
若是 | ruò shì | if | 如果 | ＿＿明天不下雨，我们就去爬山。
若干 | ruò gān | a number of | 一些，数量不定 | 这本书分成＿＿个部分，每部分讲一个问题。
万一 | wàn yī | in case | 可能性很小的意外 | 多穿一件衣服吧，＿＿晚上变冷呢？ | 或许
要不 | yào bù | otherwise | 不然 | 快走吧，＿＿就要迟到了。
可见 | kě jiàn | it is thus clear | 从这里能看出 | 他每天都练习，＿＿他非常喜欢音乐。
难免 | nán miǎn | hard to avoid | 不容易避免 | 第一次上台讲话，紧张是＿＿的。
既然 | jì rán | since | 用在前一句，表示已经是事实 | ＿＿你已经决定了，我就不再说什么了。
何况 | hé kuàng | let alone | 更不用说 | 这个问题连老师都觉得难，＿＿我们呢？
`,
  },
  {
    theme: ["Punctuation and Writing", "标点和书写"],
    data: `
标点 | biāo diǎn | punctuation | 句号、逗号这一类写文章用的记号 | 写作文的时候，每个＿＿也要用对。
逗号 | dòu hào | comma | 句子中间表示停一下的记号 | 一句话还没说完，中间要停一下的地方常常用＿＿。 | 顿号
句号 | jù hào | full stop | 一句话结束时用的小圆圈 | 一句话说完了，要在最后写一个＿＿。
问号 | wèn hào | question mark | 问句最后用的记号 | “你几点回来”后面应该用＿＿。
引号 | yǐn hào | quotation marks | 写别人说的话时前后加的记号 | 写别人说的原话，前后要加上＿＿。
感叹号 | gǎn tàn hào | exclamation mark | 表示强烈感情的记号 | 表示很强的感情时，句子最后可以用＿＿。
顿号 | dùn hào | enumeration comma | 并列的词语中间用的记号 | “春、夏、秋、冬”这几个字中间用的是＿＿。 | 逗号
冒号 | mào hào | colon | 上下两个点，用来引出后面的话 | “他说”后面、引号前面常常用＿＿。
笔画 | bǐ huà | stroke | 写汉字时的一笔 | “人”这个字只有两个＿＿。
部首 | bù shǒu | radical | 字典里给汉字分类用的部分 | “河”和“湖”的＿＿都是三点水。
`,
  },
  {
    theme: ["Degree and Comparison", "程度和比较"],
    data: `
比较 | bǐ jiào | to compare | 放在一起看有什么不同 | 买东西以前，可以先＿＿一下几家商店的价格。
较 | jiào | rather, relatively | 比一般的程度高一点 | 今天的气温＿＿高，注意多喝水。 | 比较
似乎 | sì hū | seemingly | 好像 | 他＿＿不太高兴，一句话也没说。
几乎 | jī hū | almost | 差不多 | 他＿＿每天都读一个小时的书。
类似 | lèi sì | similar | 差不多一样 | 我以前也遇到过＿＿的问题。 | 相似
相似 | xiāng sì | alike | 很像 | 姐妹两个长得很＿＿。 | 类似
仅仅 | jǐn jǐn | merely | 只 | 这件事＿＿过了三天，大家就忘了。
不仅 | bù jǐn | not only | 不只 | 他＿＿会说中文，还会写书法。
似的 | shì de | as if | 用在词语后面，表示像某种情况 | 他高兴得像个孩子＿＿，又跳又笑。
恰好 | qià hǎo | as it happens | 正好 | 我到车站的时候，车＿＿来了。
`,
  },
  {
    theme: ["Ways of Being Understood", "交流的方式"],
    data: `
手语 | shǒu yǔ | sign language | 用手的动作表示意思的语言 | 他的妹妹听不见，全家人都学会了＿＿。
盲文 | máng wén | braille | 让看不见的人用手摸着读的文字 | 这本书还出了＿＿版，看不见的人也能读。
盲人 | máng rén | blind person | 眼睛看不见的人 | 这条路上有专门给＿＿走的路。
文盲 | wén máng | illiterate person | 不认识字的人 | 他小时候没上过学，是个＿＿，五十岁才学会读书写字。
助听器 | zhù tīng qì | hearing aid | 帮助听力不好的人听清声音的东西 | 爷爷戴上＿＿以后，听得清楚多了。
眼神 | yǎn shén | look in one's eyes | 眼睛表现出来的意思 | 妈妈用＿＿告诉我不要说话。
读音 | dú yīn | pronunciation | 一个字的念法 | 这个字有两个＿＿，意思也不一样。
插话 | chā huà | to interrupt | 在别人说话的时候插进去说 | 别人说话的时候，不要随便＿＿。
对方 | duì fāng | the other party | 交流时另一边的人 | 说话的时候要看着＿＿的眼睛。
逗 | dòu | to amuse | 引人发笑 | 他讲了个笑话，把大家都＿＿笑了。
`,
  },
  {
    theme: ["Young People's Words", "年轻人的用语"],
    data: `
青年 | qīng nián | young people | 大约十五到三十岁的人 | 很多＿＿喜欢在网上发表自己的看法。 | 青少年
青少年 | qīng shào nián | teenagers | 十几岁的孩子 | 这本杂志是给＿＿看的，很适合中学生。 | 青年
青春 | qīng chūn | youth | 年轻的时候 | 他把自己的＿＿都给了山里的这所学校。
流行语 | liú xíng yǔ | buzzword | 一段时间里很多人都在说的话 | 每年都会出现一些新的＿＿，很快大家都在说。
用语 | yòng yǔ | wording, terms | 说话或写文章用的词语 | 这份合同里的＿＿很正式。
它们 | tā men | they (things) | 几个不是人的东西 | 这些花需要阳光，请把＿＿放在窗户边。
表情包 | biǎo qíng bāo | sticker, meme picture | 聊天时发的表示心情的图片 | 他不打字，只发了一个笑脸的＿＿。
外号 | wài hào | nickname | 别人起的不正式的名字 | 他跑得特别快，同学们给他起了个＿＿叫“小飞人”。 | 网名
网名 | wǎng míng | online name | 在网上用的名字 | 他在网上的＿＿叫“快乐的鱼”。 | 外号
头像 | tóu xiàng | profile picture | 在网上代表自己的小图片 | 他把自己的＿＿换成了一只小猫。
`,
  },
  // Unit 2: Families and Generations.
  {
    theme: ["Relatives", "亲戚"],
    data: `
姑姑 | gū gu | aunt (father's sister) | 爸爸的姐姐或妹妹 | 爸爸的妹妹是我的＿＿。
舅舅 | jiù jiu | uncle (mother's brother) | 妈妈的哥哥或弟弟 | 妈妈的弟弟是我的＿＿。
婶婶 | shěn shen | aunt (wife of father's younger brother) | 叔叔的妻子 | 叔叔去年结婚了，我有了一位＿＿。
嫂子 | sǎo zi | sister-in-law (elder brother's wife) | 哥哥的妻子 | 哥哥结婚以后，＿＿常常来我们家吃饭。
姑父 | gū fu | uncle (husband of father's sister) | 姑姑的丈夫 | 姑姑和＿＿带着表妹来我家过年。
舅妈 | jiù mā | aunt (wife of mother's brother) | 舅舅的妻子 | 舅舅做饭不好吃，＿＿做的菜特别香。
外婆 | wài pó | grandmother (mother's mother) | 妈妈的妈妈 | 妈妈的妈妈是我的＿＿。
外公 | wài gōng | grandfather (mother's father) | 妈妈的爸爸 | 外婆的丈夫是我的＿＿。
表哥 | biǎo gē | elder male cousin (son of a father's sister or of a mother's sibling) | 姑姑、舅舅或阿姨家里比自己大的男孩 | 舅舅的儿子比我大两岁，他是我的＿＿。
堂哥 | táng gē | elder male cousin (father's brother's son) | 伯伯或叔叔家里比自己大的男孩 | 叔叔的儿子比我大三岁，他是我的＿＿。
`,
  },
  {
    theme: ["Husbands, Wives and In-laws", "夫妻和姻亲"],
    data: `
丈夫 | zhàng fu | husband | 结了婚的男子，是妻子的另一半 | 她和＿＿结婚才一年，两个人都很年轻。
媳妇 | xí fu | daughter-in-law | 儿子的妻子 | 王奶奶的儿子结婚了，新＿＿对她很好。
婆婆 | pó po | mother-in-law (husband's mother) | 丈夫的妈妈 | 她结婚以后，跟＿＿住在一起，两个人相处得很好。 | 公婆
公婆 | gōng pó | parents-in-law (husband's parents) | 丈夫的父母 | 春节的时候，她和丈夫一起回去看望＿＿。 | 婆婆
婆家 | pó jia | husband's family | 丈夫的家 | 她结婚以后住在＿＿，离自己的父母很远。 | 娘家
娘家 | niáng jia | wife's parents' home | 结了婚的女子的父母家 | 过年的时候，姐姐带着孩子回＿＿看父母。 | 婆家
夫妇 | fū fù | husband and wife | 结了婚的一对男女 | 这对年轻的＿＿刚搬到我们楼里。
老伴 | lǎo bàn | (elderly) spouse | 老年夫妻中的一方 | 爷爷每天早上和＿＿一起去公园散步。
再婚 | zài hūn | to remarry | 离婚或另一半去世以后又结婚 | 他的母亲几年前＿＿了，他现在有了一个新的家。
妇女 | fù nǚ | women | 成年的女子 | 三月八日是国际＿＿节。
`,
  },
  {
    theme: ["Generations and Siblings", "辈分和兄弟姐妹"],
    data: `
长辈 | zhǎng bèi | elders | 比自己大一辈或几辈的人 | 过年的时候，孩子们要给＿＿拜年。 | 祖辈
祖辈 | zǔ bèi | ancestors, forebears | 爷爷奶奶和更早的几代人 | 他的＿＿都是农民，在这片土地上生活了几百年。 | 长辈
晚辈 | wǎn bèi | the younger generation | 比自己小一辈或几辈的人 | 爷爷对家里的＿＿总是很耐心。
前辈 | qián bèi | senior (in one's field) | 同一行业里年纪大、经验多的人 | 刚参加工作的时候，公司里的＿＿教了他很多东西。
辈分 | bèi fen | place among the generations | 家族里的先后次序 | 他虽然年纪小，＿＿却很高，有的大人还得叫他叔叔。
一辈子 | yí bèi zi | all one's life | 从出生到老的整个时间 | 他＿＿都住在这个小村子里。
孙子 | sūn zi | grandson | 儿子的儿子 | 爷爷奶奶有一个孙女和一个＿＿。 | 外孙
外孙 | wài sūn | grandson (daughter's son) | 女儿的儿子 | 女儿生了个儿子，外公外婆有了＿＿。 | 孙子
兄弟 | xiōng dì | brothers | 哥哥和弟弟 | 他们＿＿两个长得很像，大家常常分不清。
兄妹 | xiōng mèi | brother and sister | 哥哥和妹妹 | 这对＿＿感情很好，哥哥总是照顾妹妹。
`,
  },
  {
    theme: ["Babies", "婴儿和抚养"],
    data: `
婴儿 | yīng ér | baby | 刚出生不久的孩子 | 医院里的这个＿＿才出生三天。 | 宝宝
宝宝 | bǎo bao | baby (affectionate) | 对小孩子亲切的叫法 | 妈妈轻声对怀里的＿＿说话。 | 婴儿
娃娃 | wá wa | doll | 做成小孩样子的玩具 | 妹妹最喜欢她的布＿＿，每天都带着它。
抚养 | fǔ yǎng | to raise | 照顾孩子，让他长大 | 他从小是外婆＿＿大的。
早教 | zǎo jiào | early education | 对很小的孩子进行的教育 | 很多父母送两三岁的孩子去上＿＿课。
摇篮 | yáo lán | cradle | 让婴儿睡觉的、可以来回动的小床 | 妈妈轻轻地推着＿＿，孩子很快就睡着了。
收养 | shōu yǎng | to adopt | 把别人的孩子当作自己的孩子养 | 他们＿＿了一个女孩，对她像亲生的一样。
育儿 | yù ér | childcare | 养育孩子 | 这本书讲了很多＿＿知识，很适合刚当父母的人。
母婴室 | mǔ yīng shì | nursing room | 给妈妈照顾婴儿用的房间 | 机场里有＿＿，妈妈可以在里面给孩子换衣服。
疼爱 | téng ài | to love dearly | 非常爱 | 奶奶最＿＿这个小孙女。
`,
  },
  {
    theme: ["Love and Care", "关爱和感情"],
    data: `
嘱咐 | zhǔ fù | to exhort | 告诉别人要注意的事 | 出门前，妈妈＿＿我路上小心。
可怜 | kě lián | pitiful | 让人同情 | 这只小狗又冷又饿，看起来很＿＿。
温柔 | wēn róu | gentle | 温和，让人感到舒服 | 她说话的声音很＿＿，孩子们都喜欢她。
柔软 | róu ruǎn | soft | 不硬 | 这件衣服的布料很＿＿，穿着很舒服。
盼望 | pàn wàng | to long for | 很希望 | 孩子们天天＿＿着放假。
忍不住 | rěn bu zhù | cannot help (doing) | 控制不了自己 | 听到这个笑话，大家都＿＿笑了。
和睦 | hé mù | harmonious | 相处得好，不吵架 | 他们一家人相处得很＿＿。
严厉 | yán lì | stern | 很严格，不轻易原谅 | 他的父亲很＿＿，作业写不好就要重写。
慈祥 | cí xiáng | kindly | 老人和气、善良 | 奶奶的脸上总是带着＿＿的笑容。
亲情 | qīn qíng | family love | 家人之间的感情 | 不管走多远，＿＿都是最重要的。
`,
  },
  {
    theme: ["At Home", "家里"],
    data: `
屋子 | wū zi | room | 房间 | 这间＿＿不大，但是收拾得很干净。
屋里 | wū li | indoors | 房间里面 | 外面太冷了，快到＿＿来。
家务 | jiā wù | housework | 家里的事，比如做饭、打扫 | 星期六全家人一起做＿＿。
家规 | jiā guī | family rules | 一个家里的规矩 | 我家有一条＿＿：吃饭的时候不看手机。
家风 | jiā fēng | family tradition | 一个家庭代代传下来的风气 | 他家的＿＿很好，几代人都爱读书。
丢 | diū | to lose | 东西找不到了 | 他做事不太小心，经常＿＿东西。 | 掉
掉 | diào | to drop | 往下落 | 小心，别让杯子＿＿到地上。 | 丢
忘掉 | wàng diào | to forget | 不再记得 | 他说过的那句话，我一直没有＿＿。
俩 | liǎ | two (people) | 两个 | 我们＿＿是同一个班的同学。
全家福 | quán jiā fú | family photo | 全家人一起照的相片 | 春节的时候，我们一家人拍了一张＿＿。
`,
  },
  {
    theme: ["Old Age and Memories", "晚年和回忆"],
    data: `
晚年 | wǎn nián | old age | 人老了以后的那段时间 | 爷爷的＿＿过得很幸福，每天种花、看书。
养老院 | yǎng lǎo yuàn | home for the elderly | 照顾老人生活的地方 | 星期天我们去＿＿看望老人，给他们表演节目。
老年人 | lǎo nián rén | the elderly | 年纪大的人 | 公共汽车上有给＿＿留的座位。 | 老人家
老人家 | lǎo rén jia | (respectful) elderly person | 对老人的尊敬的叫法 | 王爷爷，您＿＿身体还好吗？ | 老年人
怀念 | huái niàn | to cherish the memory of | 想念过去的人或事 | 他常常＿＿在乡下度过的童年。
当年 | dāng nián | in those years | 过去的那个时候 | 爷爷常常给我们讲他＿＿上大学的故事。
留念 | liú niàn | to keep as a souvenir | 留下来作为纪念 | 毕业的时候，全班同学一起照相＿＿。
相册 | xiàng cè | photo album | 放照片的本子 | 奶奶打开＿＿，给我看她年轻时的照片。
时隔 | shí gé | after an interval of | 中间过了（一段时间） | ＿＿二十年，老同学们又在母校见面了。
永远 | yǒng yuǎn | forever | 一直，没有结束的时候 | 我会＿＿记得这一天。
`,
  },
  {
    theme: ["Getting Along", "相处"],
    data: `
忍耐 | rěn nài | to be patient | 把痛苦或不满放在心里，不表现出来 | 排队的人太多了，大家只能＿＿着慢慢等。 | 忍受
忍受 | rěn shòu | to bear | 勉强承受痛苦或困难 | 这里夏天热得让人难以＿＿。 | 忍耐
忍让 | rěn ràng | to be forbearing | 容忍，让着别人 | 哥哥总是＿＿弟弟，从来不跟他吵架。 | 谦让
谦让 | qiān ràng | to modestly decline | 客气地让给别人 | 两个人互相＿＿，谁也不肯先坐下。 | 忍让
体谅 | tǐ liàng | to show understanding | 站在别人的位置上理解别人 | 妈妈工作很累，我们要＿＿她。
和好 | hé hǎo | to make up | 吵架以后又变好 | 两个好朋友吵了一架，第二天就＿＿了。
分担 | fēn dān | to share (a burden) | 一起承担 | 家里的家务应该大家一起＿＿。
照看 | zhào kàn | to look after | 照顾，看着 | 我出去一会儿，请你帮我＿＿一下孩子。
接送 | jiē sòng | to pick up and drop off | 去接和去送 | 爷爷每天负责＿＿孙子上下学。
隔开 | gé kāi | to separate | 从中间分开 | 一条小河把两个村子＿＿了。
`,
  },
  {
    theme: ["Growing Up", "成长"],
    data: `
成年 | chéng nián | to come of age | 长到法律规定的大人的年龄 | 在很多国家，十八岁就算＿＿了。 | 长大成人
长大成人 | zhǎng dà chéng rén | to grow up | 长大，变成大人 | 一转眼，当年的小女孩已经＿＿了。 | 成年
未成年人 | wèi chéng nián rén | minor | 还没有成年的人 | 法律特别保护＿＿的权利。
懂事 | dǒng shì | sensible | 明白道理，知道替别人着想 | 这个孩子很＿＿，常常帮妈妈做家务。 | 听话
听话 | tīng huà | obedient | 照着长辈的话去做 | 小狗很＿＿，主人让它坐下它就坐下。 | 懂事
调皮 | tiáo pí | naughty | 爱玩爱闹，不听话 | 弟弟很＿＿，总是爬到桌子上玩。
自立 | zì lì | self-reliant | 靠自己生活 | 他大学毕业以后就开始＿＿，不再要父母的钱。
惯 | guàn | to spoil | 过分地满足孩子的要求 | 爷爷奶奶太＿＿孩子了，他要什么就给什么。
零花钱 | líng huā qián | pocket money | 给孩子平时花的钱 | 他把每周的＿＿都存了起来。
代沟 | dài gōu | generation gap | 两代人之间想法上的差别 | 父母和孩子之间有＿＿是正常的，要多沟通。
`,
  },
  {
    theme: ["A Family Through Time", "家庭的变化"],
    data: `
曾祖父 | zēng zǔ fù | great-grandfather | 爷爷的父亲 | 我的＿＿出生在一百多年前。
家庭成员 | jiā tíng chéng yuán | family member | 一个家里的人 | 他家一共有五个＿＿，还有一只狗。
亲子 | qīn zǐ | parent and child | 父母和孩子 | 幼儿园星期六有一个＿＿活动，爸爸妈妈和孩子一起做游戏。
母女 | mǔ nǚ | mother and daughter | 妈妈和女儿 | 这对＿＿长得很像，走在一起像姐妹一样。
当家 | dāng jiā | to run the household | 管理家里的事 | 在我们家，是妈妈＿＿，买什么都由她决定。
勤俭 | qín jiǎn | hardworking and thrifty | 努力工作，节约用钱 | 爷爷奶奶一辈子＿＿，从来不浪费。
拥有 | yōng yǒu | to possess | 有（很多或很重要的东西） | 他＿＿一个幸福的家庭。
期盼 | qī pàn | to look forward to | 盼着 | 父母＿＿着在外地工作的孩子早点回家。
姑娘 | gū niang | girl | 年轻的女子 | 王家的＿＿考上了大学，全家人都很高兴。
厉害 | lì hai | formidable | 很强；程度深 | 她一个人能说五种语言，真＿＿！
`,
  },
  // Unit 3: Cities and the Countryside.
  {
    theme: ["Fields and Crops", "田地和庄稼"],
    data: `
田野 | tián yě | open fields | 一大片种庄稼的地 | 春天，＿＿里开满了黄色的小花。 | 农田 稻田
农田 | nóng tián | farmland | 种庄稼的田地 | 为了保护＿＿，这里不能随便盖房子。 | 田野
种田 | zhòng tián | to farm | 在地里种庄稼 | 他的父母在乡下＿＿，一年四季都很忙。
水稻 | shuǐ dào | paddy rice | 长在水田里的一种庄稼 | 中国南方雨水多，很多地方种＿＿，人们爱吃米饭。
稻田 | dào tián | rice paddy | 种水稻的田 | 夏天，一片片＿＿绿油油的。 | 田野
小麦 | xiǎo mài | wheat | 一种庄稼，种子可以磨成面粉 | 做面包和饺子皮的面粉来自＿＿。
棉花 | mián hua | cotton | 一种植物，种子上的白毛可以做衣服和被子 | 这件衣服是用＿＿做的，穿着很舒服。
庄稼 | zhuāng jia | crops | 地里种的粮食作物 | 今年雨水多，地里的＿＿长得很好。
丰收 | fēng shōu | bumper harvest | 收成好 | 今年粮食＿＿，农民们都很高兴。
播种 | bō zhǒng | to sow | 把种子放进土里 | 春天是＿＿的季节。
`,
  },
  {
    theme: ["The Village", "村庄"],
    data: `
村庄 | cūn zhuāng | village | 农民住的地方 | 山脚下有一个小＿＿，住着三十多户人家。
水井 | shuǐ jǐng | well | 从地下取水的井 | 以前村里人喝的水都是从＿＿里打上来的。
竹子 | zhú zi | bamboo | 一种中间空、长得很快的植物 | 熊猫最爱吃＿＿。
竹林 | zhú lín | bamboo grove | 很多竹子长在一起的地方 | 房子后面有一片＿＿，风一来沙沙地响。
鸭子 | yā zi | duck | 嘴扁、会游泳的家禽 | 几只＿＿在水里游来游去。
池塘 | chí táng | pond | 比较小的水池 | 院子后面有个小＿＿，里面有几条小鱼。
泉水 | quán shuǐ | spring water | 从地下流出来的水 | 山里的＿＿又清又甜。
菜地 | cài dì | vegetable plot | 种菜的地 | 奶奶在院子里开了一小块＿＿，种了白菜和土豆。
黄牛 | huáng niú | ox | 一种常用来拉车、干农活的牛 | 以前，农民常常用＿＿拉车、干农活。
羊群 | yáng qún | flock of sheep | 很多羊在一起 | 远处的＿＿像天上的白云一样。
`,
  },
  {
    theme: ["Pastures, Fishing Villages and Hills", "牧场、渔村和山坡"],
    data: `
牧民 | mù mín | herdsman | 放养牛羊的人 | 草原上的＿＿骑着马放羊。
牧场 | mù chǎng | pasture | 放养牛羊的地方 | 这片＿＿很大，养着几千头牛。
渔民 | yú mín | fisherman | 捕鱼的人 | 天还没亮，＿＿们就开船出海了。
渔船 | yú chuán | fishing boat | 捕鱼用的船 | 港口里停着很多＿＿。
渔村 | yú cūn | fishing village | 渔民住的村子 | 海边有一个小＿＿，家家户户都会打鱼。
鱼塘 | yú táng | fish pond | 养鱼的池子 | 他家有一个＿＿，每年能卖很多鱼。
温泉 | wēn quán | hot spring | 从地下流出来的热水 | 冬天，很多人喜欢去＿＿洗澡。
山坡 | shān pō | hillside | 山上一边高一边低的地方 | ＿＿上种满了茶树。
上坡 | shàng pō | uphill | 往高处走的路 | 这段路是＿＿，骑车很累。 | 下坡
下坡 | xià pō | downhill | 往低处走的路 | ＿＿的时候车速会变快，要小心。 | 上坡
`,
  },
  {
    theme: ["Orchards and Trees", "果园和树木"],
    data: `
树枝 | shù zhī | branch | 树上长出来的细的部分 | 一只小鸟站在＿＿上唱歌。 | 枝头
枝头 | zhī tóu | tip of a branch | 树枝的上面 | 秋天，＿＿上结满了红红的苹果。 | 树枝
枝叶 | zhī yè | branches and leaves | 树枝和叶子 | 这些大树＿＿很多，下面很凉快。
发芽 | fā yá | to sprout | 种子长出芽来 | 种子放进土里几天以后就＿＿了。
桃子 | táo zi | peach | 一种圆圆的、皮上有毛的水果 | 这个＿＿又大又甜。
桃花 | táo huā | peach blossom | 桃树开的花 | 三月，山上的＿＿都开了，一片粉红。
果园 | guǒ yuán | orchard | 种水果的地方 | 秋天，我们去＿＿里采苹果。
果树 | guǒ shù | fruit tree | 结水果的树 | 爷爷在院子里种了一些＿＿，每年秋天都有水果吃。
浇水 | jiāo shuǐ | to water | 给植物水 | 天气太热，每天都要给花＿＿。
盛开 | shèng kāi | to be in full bloom | 花开得很多很好 | 公园里的花都＿＿了，来看花的人很多。
`,
  },
  {
    theme: ["City Buildings", "城市建筑"],
    data: `
建筑 | jiàn zhù | building | 盖起来的房子、桥等 | 这座＿＿已经有一百多年的历史了。 | 大厦 高楼
建筑师 | jiàn zhù shī | architect | 设计房子的人 | 这座博物馆是一位有名的＿＿设计的。
大厦 | dà shà | tall building | 高大的楼房 | 这座三十层的＿＿是市里最高的楼。 | 建筑 高楼
高楼 | gāo lóu | high-rise | 很高的楼 | 城市里的＿＿越来越多，天空越来越小了。 | 大厦 建筑
公寓 | gōng yù | apartment | 一套一套出租或出售的住房 | 他在市中心租了一间小＿＿。
店铺 | diàn pù | shop | 商店 | 这条街两边都是卖小吃的＿＿。
物业 | wù yè | property management | 管理小区的公司 | 楼里的灯坏了，我打电话给＿＿，他们马上派人来修。
门卫 | mén wèi | gatekeeper | 在门口看门的人 | 小区的＿＿认识每一位住户。
楼道 | lóu dào | stairwell | 楼里的走道 | ＿＿里不能放自行车，会影响别人走路。
住房 | zhù fáng | housing | 住的房子 | 大城市的＿＿很贵，年轻人买房不容易。
`,
  },
  {
    theme: ["City and Country", "城乡"],
    data: `
城市化 | chéng shì huà | urbanization | 越来越多的人住到城市里 | 随着＿＿的发展，很多农民搬进了城市。
进城 | jìn chéng | to go to town | 到城里去 | 村里的年轻人大多＿＿工作了。
农民工 | nóng mín gōng | migrant worker | 从农村到城市打工的人 | 这座城市的很多大楼都是＿＿建起来的。
留守 | liú shǒu | to stay behind | 家里别的人外出，自己留在家里 | 父母都去外地打工了，＿＿的孩子跟着爷爷奶奶生活。
户口 | hù kǒu | household registration | 登记一家人住在哪里的证件 | 他的＿＿在老家，现在在北京工作。
城乡 | chéng xiāng | city and countryside | 城市和乡村 | 这几年，＿＿之间的交通越来越方便了。
差距 | chā jù | gap | 相差的程度 | 我的中文和他比还有很大的＿＿。
致富 | zhì fù | to become rich | 变得有钱 | 村里人靠种水果＿＿了。
特产 | tè chǎn | local specialty | 一个地方特有的出名的东西 | 这种茶是我们家乡的＿＿。 | 农产品
农产品 | nóng chǎn pǐn | farm produce | 农业生产出来的东西 | 他在网上卖＿＿，比如大米和水果。 | 特产
`,
  },
  {
    theme: ["Noise, Quiet and Free Time", "噪音、宁静和空闲"],
    data: `
噪音 | zào yīn | noise | 让人不舒服的声音 | 马路上的＿＿太大，晚上睡不好。
宁静 | níng jìng | tranquil | 安静 | 山村的夜晚非常＿＿，只能听到虫叫。 | 安宁
安宁 | ān níng | at peace | 平安，不受打扰 | 楼下天天有人装修，大家都不得＿＿。 | 宁静
宁可 | nìng kě | would rather | 两样都不好时选一样 | 我＿＿走路去，也不想在路上堵一个小时。
闲 | xián | idle | 没有事做 | 他退休以后一点也不＿＿，每天都去帮社区做事。
空闲 | kòng xián | free (time) | 没有事的时候 | 你什么时候有＿＿，我们一起吃个饭？
休闲 | xiū xián | leisure | 休息和娱乐 | 公园是市民＿＿的好地方。
闲聊 | xián liáo | to chat idly | 随便地聊天 | 吃完晚饭，邻居们在楼下＿＿。
乱 | luàn | messy | 没有次序 | 你的房间太＿＿了，快收拾一下。
农闲 | nóng xián | slack farming season | 农活不多的时候 | 冬天是＿＿的时候，农民有时间休息。
`,
  },
  {
    theme: ["Getting Around", "出行"],
    data: `
公交 | gōng jiāo | public bus | 公共交通，常指公共汽车 | 我每天坐＿＿上班，二十分钟就到。
通勤 | tōng qín | to commute | 每天在家和工作的地方之间来回 | 他每天＿＿要花两个小时。
上班族 | shàng bān zú | office workers | 每天按时上班的人 | 早上八点，地铁里都是＿＿。
早高峰 | zǎo gāo fēng | morning rush hour | 早上上班时车和人最多的时候 | ＿＿的时候，路上特别堵。
十字路口 | shí zì lù kǒu | crossroads | 两条路交叉的地方 | 在下一个＿＿往左转就到了。
拖拉机 | tuō lā jī | tractor | 在农田里用的机器车 | 农民开着＿＿去地里干活。
超车 | chāo chē | to overtake | 从别的车旁边开到它前面 | 这段路有很多弯，不能＿＿。
超过 | chāo guò | to exceed | 比……更多 | 这座城市的人口已经＿＿一千万了。
街头 | jiē tóu | street | 街上 | 节日的时候，＿＿到处都是人。
拖 | tuō | to drag | 拉着走 | 他＿＿着一个大箱子走进了车站。
`,
  },
  {
    theme: ["Shops and Markets", "商店和集市"],
    data: `
超市 | chāo shì | supermarket | 东西很多、自己拿了去付钱的大商店 | 我去＿＿买点儿水果和牛奶。 | 便利店 小卖部
便利店 | biàn lì diàn | convenience store | 开到很晚、方便买东西的小商店 | 楼下的＿＿二十四小时开门。 | 超市
小卖部 | xiǎo mài bù | tuck shop | 学校或单位里卖小东西的地方 | 学校的＿＿里有本子和笔卖。 | 超市
集市 | jí shì | country market | 农村定期买卖东西的地方 | 每个星期天，镇上都有＿＿，买东西的人特别多。
收银台 | shōu yín tái | checkout | 商店里付钱的地方 | 买好东西以后，请到＿＿付钱。
摆 | bǎi | to put | 放 | 桌子上＿＿着几本书。 | 摆放
摆放 | bǎi fàng | to arrange | 有次序地放 | 商店里的东西根据种类＿＿，很好找。 | 摆
铺 | pū | to spread | 把东西展开平放 | 妈妈在床上＿＿了一条新床单。
中介 | zhōng jiè | agent | 帮两方介绍买卖的人或公司 | 他通过＿＿租到了一间房子。
丰富 | fēng fù | abundant | 种类多，数量大 | 这家商店的东西很＿＿，什么都能买到。
`,
  },
  {
    theme: ["The Bustling City", "繁华的城市"],
    data: `
繁华 | fán huá | bustling | 城市或街道人多，商业发达 | 这条街是全市最＿＿的地方。
大都市 | dà dū shì | metropolis | 很大的城市 | 上海是一座国际＿＿。
古镇 | gǔ zhèn | ancient town | 历史很长的小镇 | 这个＿＿有一千多年的历史，街道都是用石头铺的。
盛大 | shèng dà | grand | 规模大，很隆重 | 学校举行了＿＿的毕业典礼。
丰盛 | fēng shèng | sumptuous | 又多又好 | 过年的时候，妈妈做了一桌＿＿的饭菜。
超级 | chāo jí | super | 特别，非常 | 这家店的蛋糕＿＿好吃！
邻里 | lín lǐ | neighbors | 住得近的人家 | 我们小区的＿＿关系很好，常常互相帮忙。
地标 | dì biāo | landmark | 一个地方有代表性的建筑 | 这座大桥是这座城市的＿＿。
广场舞 | guǎng chǎng wǔ | square dancing | 很多人在广场上一起跳的舞 | 每天晚上，很多老人在公园里跳＿＿。
大妈 | dà mā | auntie | 对年纪比较大的女人的客气的叫法 | 这位＿＿每天早上都在路口帮孩子们过马路。
`,
  },
  // Unit 4: Health and Ways of Living.
  {
    theme: ["Parts of the Body", "身体部位"],
    data: `
肺 | fèi | lung | 人用来呼吸的器官 | 我们靠＿＿呼吸，吸烟会伤害它。
肝 | gān | liver | 人体里分解有毒物质的器官 | ＿＿是人体里最重的内脏。
胸口 | xiōng kǒu | chest | 胸的中间部分 | 他用手按着＿＿，觉得心跳得很快。
腰 | yāo | waist | 身体中部，肚子后面的部分 | 这条裤子的＿＿太大了，穿着往下掉。
腹部 | fù bù | abdomen | 肚子 | 吃了不干净的东西以后，他觉得＿＿很不舒服。
膝盖 | xī gài | knee | 大腿和小腿连接的地方 | 裤子在＿＿的地方破了一个洞。
手臂 | shǒu bì | arm | 肩到手的部分 | 他举起＿＿向我们打招呼。
肌肉 | jī ròu | muscle | 身体里能让身体动起来的部分 | 经常锻炼，＿＿会变得结实。
心脏 | xīn zàng | heart | 把血送到全身的器官 | ＿＿每分钟大约跳六十到一百次。
肩 | jiān | shoulder | 脖子两边、手臂上面的部分 | 他把书包背在＿＿上。
`,
  },
  {
    theme: ["Feeling Unwell", "身体不舒服"],
    data: `
咳 | ké | to cough | 用力往外出气并发出声音 | 他感冒了，晚上一直＿＿个不停。
肿 | zhǒng | swollen | 皮肉鼓起来 | 他的脚受伤了，＿＿得穿不进鞋。
头晕 | tóu yūn | dizzy | 觉得周围在转 | 他一整天没吃东西，站起来的时候觉得＿＿。 | 晕车
晕车 | yùn chē | carsick | 坐车时头晕、想吐 | 她坐长途汽车容易＿＿，所以总是坐在前面。 | 头晕
症状 | zhèng zhuàng | symptom | 生病时身体出现的不正常的情况 | 发烧和头疼是感冒常见的＿＿。
吐 | tù | to vomit | 胃里的东西从嘴里出来 | 他吃了不新鲜的东西，＿＿了好几次。
躺 | tǎng | to lie down | 身体平放在床上或地上 | 你不舒服就去床上＿＿一会儿吧。
癌症 | ái zhèng | cancer | 一种很危险的病，身体里的细胞乱长 | 早发现、早治疗，很多＿＿是可以治好的。
糖尿病 | táng niào bìng | diabetes | 一种血里的糖太多的病 | 他得了＿＿，吃东西要少放糖。
腰疼 | yāo téng | backache | 腰部疼 | 他在电脑前坐了一整天，＿＿得站不直。
`,
  },
  {
    theme: ["Doctors and Medicine", "看病和用药"],
    data: `
药剂师 | yào jì shī | pharmacist | 在药店或医院配药的人 | 买药的时候，可以问问＿＿每天吃几次。
细菌 | xì jūn | bacteria | 很小的、只能用显微镜看到的生物 | 饭前要洗手，因为手上有很多＿＿。
口罩 | kǒu zhào | face mask | 戴在嘴和鼻子上的东西 | 感冒的时候，出门最好戴上＿＿。
输液 | shū yè | to have an IV drip | 把药水通过血管送进身体 | 他病得很重，在医院＿＿了三天。
血液 | xuè yè | blood | 身体里红色的液体 | 心脏把＿＿送到全身。
按时 | àn shí | on time | 根据规定的时间 | 吃药一定要＿＿，不能忘了。
剂量 | jì liàng | dosage | 药的用量 | 孩子吃药的＿＿和大人不一样。
牙齿 | yá chǐ | teeth | 牙 | 每天早晚刷牙，才能保护好＿＿。
消炎 | xiāo yán | to reduce inflammation | 让发炎的地方好起来 | 医生给他开了一些＿＿药。
体温计 | tǐ wēn jì | thermometer | 量体温的东西 | 你好像发烧了，用＿＿量一下吧。
`,
  },
  {
    theme: ["Stretching and Sweating", "伸展和出汗"],
    data: `
伸 | shēn | to stretch out | 把身体或手脚展开 | 他＿＿出手，跟我握了握。
拉伸 | lā shēn | to stretch (muscles) | 运动前后让肌肉慢慢变长的动作 | 跑步以前，要先做一些＿＿运动。
伸懒腰 | shēn lǎn yāo | to stretch oneself | 累了的时候把身体展开 | 坐了一上午，他站起来＿＿。
跳绳 | tiào shéng | to skip rope | 一种跳过绳子的运动 | 下课以后，女孩子们在操场上＿＿。
绳子 | shéng zi | rope | 用来捆东西的长条 | 这根＿＿很结实，可以用来拉车。
汗水 | hàn shuǐ | sweat | 身体出的汗 | 他跑完步，衣服都被＿＿打湿了。
擦 | cā | to wipe | 用布等来回地抹 | 他跑完步，用纸＿＿了一下脸。
扭伤 | niǔ shāng | to sprain | 关节转错方向受伤 | 他打篮球的时候＿＿了脚。
脱 | tuō | to take off | 把衣服、鞋子等拿下来 | 进门以后，请先＿＿鞋。
慢跑 | màn pǎo | to jog | 慢慢地跑 | 他每天早上在公园＿＿半个小时。
`,
  },
  {
    theme: ["Daily Habits", "作息和习惯"],
    data: `
作息 | zuò xī | work and rest | 工作、学习和休息 | 放假的时候也要保持有规律的＿＿。
早睡早起 | zǎo shuì zǎo qǐ | early to bed, early to rise | 晚上早点儿睡，早上早点儿起 | 爷爷每天＿＿，身体很好。
生物钟 | shēng wù zhōng | body clock | 身体里控制睡觉和醒来时间的规律 | 坐飞机到了别的国家，＿＿一下子乱了。
散步 | sàn bù | to take a walk | 随便走走 | 吃完晚饭，我们去河边＿＿。
久坐 | jiǔ zuò | to sit for a long time | 坐很长时间不动 | ＿＿对身体不好，每过一个小时要站起来走走。
近视 | jìn shì | nearsighted | 看不清远处的东西 | 他＿＿了，要戴眼镜才能看清黑板。
视力 | shì lì | eyesight | 眼睛看东西的能力 | 每天看太久手机，会影响＿＿。
护眼 | hù yǎn | eye care | 让眼睛不受伤害 | 看书半个小时以后看看远处，这是很好的＿＿方法。
户外 | hù wài | outdoors | 房子外面 | 孩子们每天应该在＿＿活动一个小时以上。
睡懒觉 | shuì lǎn jiào | to sleep in | 早上很晚还不起床 | 星期天他喜欢＿＿，十点才起床。
`,
  },
  {
    theme: ["Food and Health", "饮食和健康"],
    data: `
油炸 | yóu zhá | deep-fried | 在热油里做熟的 | ＿＿食品虽然好吃，但是不能多吃。
碳酸饮料 | tàn suān yǐn liào | fizzy drink | 有气的甜饮料 | ＿＿里糖很多，最好少喝。
甜食 | tián shí | sweets | 甜的食物 | 她特别爱吃＿＿，比如蛋糕和巧克力。
粗粮 | cū liáng | coarse grains | 小米、红豆等没有精细加工的粮食 | 多吃一些＿＿，比如小米和红豆，对身体有好处。
主食 | zhǔ shí | staple food | 米饭、面条这样的主要食物 | 很多中国北方人喜欢把饺子和面条当＿＿。
空腹 | kōng fù | on an empty stomach | 肚子里没有吃东西 | 这种药不能＿＿吃，要吃完饭再吃。
饭后 | fàn hòu | after a meal | 吃完饭以后 | ＿＿不要马上跑步，最好休息一会儿。
保健品 | bǎo jiàn pǐn | health supplement | 帮助保持健康的产品 | 很多＿＿并没有广告说的那么有用。
卡路里 | kǎ lù lǐ | calorie | 计算食物热量的单位 | 一块蛋糕的＿＿比一个苹果高很多。
有机 | yǒu jī | organic | 不用化学肥料种出来的 | 这家超市卖的＿＿蔬菜比较贵。
`,
  },
  {
    theme: ["Keeping Clean", "卫生"],
    data: `
卫生 | wèi shēng | hygiene | 干净，能预防疾病 | 饭店的厨房一定要注意＿＿。
卫生间 | wèi shēng jiān | bathroom | 洗手、上厕所的房间 | 请问，＿＿在哪儿？
洗手液 | xǐ shǒu yè | hand soap | 洗手用的液体 | 洗手的时候用点儿＿＿，能洗得更干净。
脏 | zāng | dirty | 不干净 | 他在外面玩了一天，衣服都＿＿了。
擦干 | cā gān | to wipe dry | 把水擦掉 | 洗完手以后，要用纸把手＿＿。
病菌 | bìng jūn | germ | 让人生病的细菌 | 经常洗手可以减少＿＿的传播。
传染病 | chuán rǎn bìng | infectious disease | 能从一个人传给别人的病 | 流感是一种＿＿，要注意预防。
免疫 | miǎn yì | immunity | 身体能抵抗某种病，不再得这种病 | 疫苗能帮助身体建立对某种病的＿＿。 | 抵抗力
抵抗力 | dǐ kàng lì | resistance (to illness) | 身体对付疾病的能力 | 他经常锻炼，＿＿很强，很少感冒。 | 免疫
液体 | yè tǐ | liquid | 能流动的东西，比如水和油 | 坐飞机的时候，不能带太多＿＿。
`,
  },
  {
    theme: ["First Aid", "急救"],
    data: `
急救 | jí jiù | first aid | 遇到危险时马上进行的救护 | 学校请医生来教学生简单的＿＿知识。
急救箱 | jí jiù xiāng | first-aid kit | 放急救用品的箱子 | 家里最好准备一个＿＿，放些常用的药。
创可贴 | chuāng kě tiē | adhesive bandage | 贴在小伤口上的东西 | 他的手指破了，贴上了一个＿＿。
药片 | yào piàn | tablet | 一片一片的药 | 这种＿＿很小，很容易吃下去。 | 药水
药水 | yào shuǐ | liquid medicine | 水一样的药 | 孩子不爱吃药片，医生就开了＿＿。 | 药片
过量 | guò liàng | excessive | 超过一定的量 | 吃药不能＿＿，要听医生的。
中暑 | zhòng shǔ | heatstroke | 天太热，身体受不了而生病 | 天气太热，在外面待太久容易＿＿。
晒伤 | shài shāng | sunburn | 皮肤被太阳晒得受伤 | 他在海边玩了一天，皮肤都＿＿了。
防晒 | fáng shài | sun protection | 防止被太阳晒伤 | 夏天去海边，一定要注意＿＿。
脱水 | tuō shuǐ | dehydration | 身体里的水太少 | 他吐了一天，身体＿＿了，医生让他输液。
`,
  },
  {
    theme: ["Chinese and Western Medicine", "中医和西医"],
    data: `
中医 | zhōng yī | traditional Chinese medicine | 中国传统的医学 | 他喜欢看＿＿，觉得中药对他有用。
西药 | xī yào | Western medicine | 按照西方医学做的药 | 这种病吃中药和＿＿都可以。
草药 | cǎo yào | herbal medicine | 用植物做的药 | 奶奶在院子里种了几种＿＿。
按摩 | àn mó | massage | 用手在身上按、推、揉 | 工作累了，去做个＿＿，身体会放松很多。 | 推拿
推拿 | tuī ná | tuina (Chinese massage) | 中医用手治病的方法 | 他的腰疼，医生用＿＿给他治好了。 | 按摩
偏方 | piān fāng | folk remedy | 民间流传的、没有经过科学证明的药方 | 生病要看医生，不要随便相信＿＿。
保健 | bǎo jiàn | health care | 保护健康 | 爷爷很重视身体＿＿，每天都打太极拳。
就医 | jiù yī | to seek medical treatment | 去看病 | 如果症状很严重，要马上＿＿。
处方 | chǔ fāng | prescription | 医生开的药单 | 这种药要有医生的＿＿才能买。
关节 | guān jié | joint | 骨头和骨头连接的地方 | 天冷的时候，奶奶的＿＿常常疼。
`,
  },
  {
    theme: ["Keeping Fit", "健身"],
    data: `
健身操 | jiàn shēn cāo | aerobics | 锻炼身体的一种操 | 每天早上，很多人在广场上做＿＿。
快走 | kuài zǒu | brisk walking | 很快地走路 | 不喜欢跑步的人，可以试试＿＿。
骑行 | qí xíng | cycling | 骑自行车出行 | 星期六他和朋友一起去郊外＿＿。
球类 | qiú lèi | ball games | 用球的运动 | 足球、篮球都是＿＿运动。
运动量 | yùn dòng liàng | amount of exercise | 运动的多少 | 他每天只走一千步，＿＿太少了。
瘦身 | shòu shēn | to slim down | 让身体变瘦 | 为了＿＿，她每天晚上都去跑步。
超重 | chāo zhòng | overweight | 重量超过标准 | 你的行李＿＿了，要多付钱。
出汗 | chū hàn | to sweat | 皮肤里流出水来 | 天太热了，坐着不动也会＿＿。
体育课 | tǐ yù kè | PE class | 学校里锻炼身体的课 | 今天下午有＿＿，记得穿运动鞋。
摔倒 | shuāi dǎo | to fall over | 身体失去平衡倒在地上 | 路上有冰，小心别＿＿。
`,
  },
  // Unit 5: Science and Discovery.
  {
    theme: ["Stars and Space", "星空和宇宙"],
    data: `
恒星 | héng xīng | star | 自己会发光发热的星球 | 太阳是离地球最近的＿＿。
银河 | yín hé | Milky Way | 夜空中由很多星星组成的白色光带 | 太阳系是＿＿里很小的一部分。 | 星系
光年 | guāng nián | light-year | 光在一年里走的距离 | ＿＿是长度单位，不是时间单位。
黑洞 | hēi dòng | black hole | 引力非常大、连光也逃不出去的天体 | ＿＿的引力非常大，连光都跑不出来。
星系 | xīng xì | galaxy | 由很多恒星组成的大系统 | 宇宙里有非常多的＿＿，每个都有很多恒星。 | 银河
天文 | tiān wén | astronomy | 研究星星和宇宙的学问 | 他从小就对＿＿很感兴趣，常常用望远镜看星星。
天文台 | tiān wén tái | observatory | 观测星星的地方 | 山上有一座＿＿，晚上可以去看星星。
流星 | liú xīng | meteor | 划过夜空、发出亮光的星星 | 晚上我们看到＿＿从天上划过，大家都很兴奋。
日食 | rì shí | solar eclipse | 月亮挡住太阳的现象 | 发生＿＿的时候，白天的天色会突然变暗。
星空 | xīng kōng | starry sky | 有星星的夜空 | 我们躺在草地上看＿＿。
`,
  },
  {
    theme: ["Solids, Liquids and Gases", "物质的变化"],
    data: `
固体 | gù tǐ | solid | 有一定形状和体积的东西 | 冰是＿＿，水是液体。
气体 | qì tǐ | gas | 没有一定形状、能到处流动的东西，比如空气 | 空气是由好几种＿＿组成的。
熔化 | róng huà | to melt (by heat) | 固体受热变成液体 | 铁在很高的温度下会＿＿。 | 融化
融化 | róng huà | to thaw | 冰雪变成水 | 太阳出来了，雪慢慢＿＿了。 | 熔化
溶解 | róng jiě | to dissolve | 在水里化开 | 糖放进水里很快就＿＿了。
凝固 | níng gù | to solidify | 液体变成固体 | 水在零度以下会＿＿成冰。
蒸发 | zhēng fā | to evaporate | 液体变成气体 | 太阳一晒，地上的水很快就＿＿了。
结冰 | jié bīng | to freeze | 水变成冰 | 天气太冷了，河面都＿＿了。
水蒸气 | shuǐ zhēng qì | water vapor | 水变成的气体 | 锅里的水开了，冒出很多＿＿。
冰点 | bīng diǎn | freezing point | 水开始结冰的温度 | 在一般情况下，水的＿＿是零度。
`,
  },
  {
    theme: ["Forces and Motion", "力和运动"],
    data: `
浮力 | fú lì | buoyancy | 水向上托住东西的力 | 人在海里比在河里容易浮起来，因为海水的＿＿更大。
浮 | fú | to float | 停在水面上不沉下去 | 几片树叶＿＿在水面上。
下沉 | xià chén | to sink | 往下落 | 石头放进水里会马上＿＿。
振动 | zhèn dòng | to vibrate | 很快地来回动 | 声音是由物体＿＿产生的。
摩擦 | mó cā | to rub | 两个东西互相碰着移动 | 冬天两只手互相＿＿，会觉得暖和一点。
重力 | zhòng lì | gravity | 地球对东西的吸引力 | 因为有＿＿，苹果会往下落，而不会飞到天上去。
惯性 | guàn xìng | inertia | 物体保持原来运动状态的性质 | 汽车突然停下的时候，因为＿＿，人会往前倒。
斜面 | xié miàn | inclined plane | 跟地面不平的面 | 把重的箱子沿着＿＿推上去，比直接搬上去省力。
牛顿 | niú dùn | Newton | 英国科学家，发现了万有引力定律 | 传说＿＿看到苹果落地，想到了万有引力。
磁力 | cí lì | magnetic force | 磁铁吸铁的力 | 磁铁能吸住铁，是因为有＿＿。
`,
  },
  {
    theme: ["Measuring", "测量"],
    data: `
秒 | miǎo | second | 一分钟的六十分之一 | 一分钟有六十＿＿。
秒表 | miǎo biǎo | stopwatch | 能精确计时的表 | 体育老师用＿＿记录我们跑一百米的时间。
毫米 | háo mǐ | millimeter | 一米的千分之一 | 一厘米等于十＿＿。
厘米 | lí mǐ | centimeter | 一米的百分之一 | 这支笔长十五＿＿。
毫升 | háo shēng | milliliter | 一升的千分之一 | 这瓶水有五百＿＿。
吨 | dūn | ton | 一千公斤 | 这辆大卡车能装十＿＿货物。
误差 | wù chā | error (of measurement) | 测量的结果和真实数值的差别 | 每次测量都会有一点儿＿＿，所以要多量几次。
精确 | jīng què | precise | 非常准确 | 这台机器能＿＿地测出一根头发有多粗。
温度计 | wēn dù jì | thermometer (for air or water) | 测量温度的东西 | 窗外的＿＿显示，现在是零下五度。
刻度 | kè dù | scale marks | 量东西的工具上表示多少的线 | 温度计上有很多＿＿，每一格是一度。
`,
  },
  {
    theme: ["The Animal World", "动物世界"],
    data: `
昆虫 | kūn chóng | insect | 身体分三部分、有六条腿的小动物 | 蜜蜂是一种＿＿，有六条腿。
蜜蜂 | mì fēng | bee | 会采花蜜、会做蜂蜜的小虫子 | 花园里有很多＿＿在花上飞来飞去。
蜂蜜 | fēng mì | honey | 蜜蜂做的又甜又稠的东西 | 他喝茶的时候喜欢放一点儿＿＿。
鲸鱼 | jīng yú | whale | 生活在海里的最大的动物 | ＿＿虽然生活在海里，但它不是鱼。
老鹰 | lǎo yīng | eagle | 眼睛很亮、会抓小动物的大鸟 | 一只＿＿在天上飞，看着地上的小动物。
猴子 | hóu zi | monkey | 会爬树、样子有点像人的动物 | 动物园里的＿＿在树上跳来跳去。
老虎 | lǎo hǔ | tiger | 身上有黑色条纹的大型猫科动物 | ＿＿是猫科动物中体形最大的一种。
产卵 | chǎn luǎn | to lay eggs | 动物生下卵 | 有些鱼每年都会游回出生的河里＿＿。
幼虫 | yòu chóng | larva | 昆虫刚从卵里出来时的样子 | 很多昆虫的＿＿和长大以后的样子完全不一样。
恐龙 | kǒng lóng | dinosaur | 很久以前生活在地球上的大型爬行动物 | ＿＿在六千多万年前就灭绝了。
`,
  },
  {
    theme: ["Rocks and Minerals", "岩石和矿物"],
    data: `
岩石 | yán shí | rock | 构成地球表面的坚硬物质 | 这座山都是由坚硬的＿＿构成的。
矿物 | kuàng wù | mineral | 地下天然形成的有用的东西 | 盐也是一种＿＿。
矿石 | kuàng shí | ore | 含有金属等有用物质的石头 | 工人们把＿＿运出来，再从里面提取铁。
煤矿 | méi kuàng | coal mine | 挖煤的地方 | 这个城市以前有很多＿＿，现在都关了。
铜 | tóng | copper | 一种红色的金属 | ＿＿很容易导电，所以电线里常用它。
化石 | huà shí | fossil | 古代生物留在石头里的样子 | 科学家在这里发现了恐龙的＿＿。
地质 | dì zhì | geology | 地球的结构和变化 | 这位＿＿学家研究这里的山已经二十年了。
青铜 | qīng tóng | bronze | 铜和别的金属混合成的金属 | 中国古代用＿＿做了很多器物。
灰色 | huī sè | gray | 黑和白中间的颜色 | 这种石头是＿＿的，不黑也不白。
金子 | jīn zi | gold | 一种黄色的、很贵的金属 | 这块手表是用＿＿做的，所以很贵。
`,
  },
  {
    theme: ["Mysteries and Discoveries", "谜和发现"],
    data: `
谜 | mí | mystery | 还不知道答案的事 | 宇宙是怎么开始的，到现在还是一个＿＿。 | 奥秘
谜语 | mí yǔ | riddle | 让人猜的话 | 老师给我们出了一个＿＿，大家都在想答案。
谜底 | mí dǐ | answer to a riddle | 谜语的答案 | 大家想了半天也不知道，最后老师说出了＿＿。
奥秘 | ào mì | profound secret | 很深、还没被完全知道的道理 | 科学家们一直在探索海洋的＿＿。 | 谜
获得 | huò dé | to obtain | 得到 | 他在比赛中＿＿了第一名。
获奖 | huò jiǎng | to win a prize | 得到奖 | 这部电影在国际上多次＿＿。
诺贝尔奖 | nuò bèi ěr jiǎng | Nobel Prize | 世界上很有名的科学和文学奖 | 居里夫人两次获得了＿＿。
假说 | jiǎ shuō | hypothesis | 还没有被证明的科学说法 | 这个＿＿还需要更多的实验来证明。
突破 | tū pò | breakthrough | 打破原来的限制，有很大的进步 | 这项研究取得了重大＿＿。
推测 | tuī cè | to infer | 根据已知的东西去想 | 科学家根据化石＿＿，这种动物会飞。
`,
  },
  {
    theme: ["In the Laboratory", "实验室"],
    data: `
胶水 | jiāo shuǐ | glue | 能把东西粘在一起的液体 | 我用＿＿把两张纸贴在一起。
氢气 | qīng qì | hydrogen | 一种没有颜色、非常轻的气体 | ＿＿是最轻的气体。
灰尘 | huī chén | dust | 很细的土 | 很久没打扫了，桌子上都是＿＿。
生锈 | shēng xiù | to rust | 金属表面长出锈 | 铁放在潮湿的地方容易＿＿。
清晰 | qīng xī | clear | 清楚 | 用显微镜可以＿＿地看到细胞。
接触 | jiē chù | to come into contact with | 碰到 | 做实验的时候，手不要直接＿＿这种液体。
斜 | xié | slanting | 不正 | 这张照片放＿＿了，往右边转一点。
恒温 | héng wēn | constant temperature | 温度保持不变 | 实验室里保持＿＿，一年四季都是二十度。
样本 | yàng běn | sample | 拿来研究的一部分东西 | 医生取了一点血作为＿＿，送去检查。
对照 | duì zhào | to compare against | 放在一起比较 | 这一组植物不浇水，用来跟另一组＿＿。
`,
  },
  {
    theme: ["Light, Sound and Electricity", "光、声和电"],
    data: `
电流 | diàn liú | electric current | 电的流动 | ＿＿通过电线，灯就亮了。
导电 | dǎo diàn | to conduct electricity | 让电通过 | 金属容易＿＿，塑料却不能。
导体 | dǎo tǐ | conductor | 容易让电通过的东西 | 金属是很好的＿＿。
磁场 | cí chǎng | magnetic field | 磁铁周围有磁力的地方 | 地球有＿＿，所以指南针能指出方向。
反射 | fǎn shè | to reflect | 光照到东西上又回来 | 月亮自己不发光，它＿＿太阳的光。
折射 | zhé shè | to refract | 光从一种东西进入另一种东西时方向改变 | 筷子放进水里看起来像断了，这是光的＿＿。
回声 | huí shēng | echo | 声音碰到东西又传回来 | 在山里大声喊，能听到＿＿。
影子 | yǐng zi | shadow | 光被挡住时出现的黑色的样子 | 中午的时候，人的＿＿最短。
放大镜 | fàng dà jìng | magnifying glass | 能把东西看大的镜子 | 他用＿＿看树叶上的小虫子。
指南针 | zhǐ nán zhēn | compass | 能指出南北方向的工具 | 在山里迷路的时候，＿＿能帮你找到方向。
`,
  },
  {
    theme: ["Scientists and Methods", "科学家和方法"],
    data: `
物理学 | wù lǐ xué | physics | 研究力、光、电、声音等的学科 | 他大学学的是＿＿，现在研究宇宙。
化学家 | huà xué jiā | chemist | 研究化学的科学家 | 居里夫人是一位有名的＿＿，也是物理学家。
天文学家 | tiān wén xué jiā | astronomer | 研究星星和宇宙的科学家 | ＿＿用望远镜观测遥远的星星。
发明家 | fā míng jiā | inventor | 发明新东西的人 | 他小时候就喜欢做各种小机器，长大后成了一位＿＿。
观测 | guān cè | to observe | 仔细地看和测量 | 科学家每天＿＿天气的变化。
验证 | yàn zhèng | to verify | 用事实来检查是不是对的 | 这个想法需要用实验来＿＿。
地理 | dì lǐ | geography | 研究地球表面情况的学科 | 他喜欢＿＿课，能说出每个国家的首都。
图表 | tú biǎo | chart | 用图来表示数据 | 他把实验结果做成了一个＿＿，看起来很清楚。
标本 | biāo běn | specimen | 保存起来供研究的动植物 | 博物馆里有很多昆虫＿＿。
变量 | biàn liàng | variable | 会变化的量 | 做实验时，一次只改变一个＿＿。
`,
  },
  // Unit 6: Culture and Heritage.
  {
    theme: ["Temples and Pagodas", "寺庙和宝塔"],
    data: `
寺庙 | sì miào | temple | 供奉佛像的地方 | 山上有一座古老的＿＿，每天早上都能听到钟声。
宝塔 | bǎo tǎ | pagoda | 一层一层、上面尖尖的高建筑 | 河边有一座七层的＿＿。
佛教 | fó jiào | Buddhism | 一种从古代印度传来的宗教 | ＿＿大约在两千年前从印度传到了中国。
佛像 | fó xiàng | statue of the Buddha | 佛的像 | 石窟里有很多大大小小的＿＿。
和尚 | hé shang | Buddhist monk | 在寺庙里修行的男子 | 寺里的＿＿每天很早就起床读经。
宫殿 | gōng diàn | palace | 皇帝住的高大的房子 | 故宫是明清两代皇帝住的＿＿。
大殿 | dà diàn | main hall | 寺庙或宫殿里最主要的大房子 | 寺庙的＿＿里有一座很大的佛像。
少林寺 | shào lín sì | Shaolin Temple | 河南的一座以武术出名的寺庙 | ＿＿的和尚会功夫，在世界上很有名。
石窟 | shí kū | grotto | 在山上开出来的洞，里面常有佛像 | 这里的＿＿是一千多年前开出来的。
莫高窟 | mò gāo kū | Mogao Caves | 中国西北一处有名的石窟 | ＿＿在中国西北，里面有很多一千多年前的画。
`,
  },
  {
    theme: ["Pottery, Porcelain and Tea", "陶瓷和茶"],
    data: `
陶瓷 | táo cí | ceramics | 陶器和瓷器 | 这家博物馆收藏了很多古代的＿＿。 | 瓷器 陶器
瓷器 | cí qì | porcelain | 用特别的土烧成的、很细很硬的器物 | 中国的＿＿很早就卖到了世界各地。 | 陶瓷
陶器 | táo qì | pottery | 用泥土烧成的器物 | 考古学家在这里发现了七千年前的＿＿。 | 陶瓷
青花瓷 | qīng huā cí | blue-and-white porcelain | 白底蓝花的瓷器 | 这个白色的瓶子上画着蓝色的花，是＿＿。
陶艺 | táo yì | the art of pottery | 做陶器的手艺 | 星期六他去上＿＿课，学习用泥土做杯子。
景德镇 | jǐng dé zhèn | Jingdezhen | 江西一个以瓷器出名的城市 | ＿＿做瓷器已经有一千多年的历史了。
精致 | jīng zhì | exquisite | 做得很细，很好看 | 这个小瓷杯做得非常＿＿。
古董 | gǔ dǒng | antique | 古代留下来的、很值钱的东西 | 爷爷收藏了很多＿＿，有的已经几百年了。
茶叶 | chá yè | tea leaves | 做茶用的叶子 | 春天采的＿＿最好。
功夫茶 | gōng fu chá | gongfu tea | 一种很讲究方法的做茶、喝茶方式 | 广东人喜欢喝＿＿，用的杯子很小。
`,
  },
  {
    theme: ["Silk and Folk Arts", "丝绸和民间艺术"],
    data: `
丝绸 | sī chóu | silk | 用丝织成的又软又亮的布 | 中国是最早生产＿＿的国家。
丝绸之路 | sī chóu zhī lù | the Silk Road | 古代连接中国和西方的贸易道路 | 两千多年前，商人们沿着＿＿把中国的东西运到西方。
刺绣 | cì xiù | embroidery | 用针线在布上绣出图案 | 这件衣服上的＿＿非常漂亮，是手工做的。 | 绣花
绣花 | xiù huā | to embroider flowers | 在布上绣出花 | 奶奶年轻的时候很会＿＿。 | 刺绣
锦绣 | jǐn xiù | splendid | 好看，像锦和绣一样 | 这里山清水秀，真是一片＿＿河山。
唐装 | táng zhuāng | Tang-style jacket | 一种中国传统样式的上衣 | 过年的时候，爷爷穿上了红色的＿＿。
中国结 | zhōng guó jié | Chinese knot | 用红绳编成的传统手工艺品 | 这个＿＿是奶奶用一根长长的红绳编出来的。
年画 | nián huà | New Year picture | 过年时贴的、表示吉祥的画 | 过年的时候，家家户户都贴＿＿和春联。
皮影 | pí yǐng | shadow puppets | 用灯光把皮做的人影照在布上的表演 | ＿＿戏是一种古老的民间艺术。
风筝 | fēng zheng | kite | 用线拉着在天上飞的玩具 | 春天，孩子们在公园里放＿＿。
`,
  },
  {
    theme: ["Ancient China", "古代中国"],
    data: `
秦朝 | qín cháo | the Qin dynasty | 中国古代第一个统一的王朝 | ＿＿只有十五年就灭亡了。
秦始皇 | qín shǐ huáng | the First Emperor of Qin | 中国第一个皇帝 | ＿＿是第一个叫自己“皇帝”的人。
甲骨文 | jiǎ gǔ wén | oracle-bone script | 刻在动物骨头上的古代文字 | 目前发现的最早的成熟汉字是＿＿。
青铜器 | qīng tóng qì | bronze ware | 用青铜做的器物 | 博物馆里的这件＿＿已经有三千年了。
竹简 | zhú jiǎn | bamboo slips | 古代写字用的竹片 | 在纸出现以前，人们常常把字写在＿＿上。
科举 | kē jǔ | imperial examinations | 古代通过考试选官员的制度 | ＿＿考试在中国有一千三百多年的历史。
状元 | zhuàng yuán | top scorer | 科举考试中的第一名 | 他考了全省第一名，大家都叫他“＿＿”。
秀才 | xiù cai | scholar | 古代读书人 | 古时候，人们常常叫读书人“＿＿”。
书院 | shū yuàn | traditional academy | 古代讲学读书的地方 | 古代的＿＿是读书人学习和讨论学问的地方。
典故 | diǎn gù | allusion | 诗文里用到的古代故事或词句 | 这句话里有一个历史＿＿，你知道吗？
`,
  },
  {
    theme: ["Jade, Crafts and Relics", "玉器、手艺和文物"],
    data: `
玉 | yù | jade | 一种好看、光滑的石头 | 中国人自古就喜欢＿＿，认为它代表美好的品德。
玉器 | yù qì | jade ware | 用玉做的东西 | 博物馆里有一件三千年前的＿＿，做得非常精美。
工匠 | gōng jiàng | craftsman | 有手艺的工人 | 这座桥是古代的＿＿们一块石头一块石头建起来的。 | 手艺人
手艺 | shǒu yì | craftsmanship | 用手做东西的技术 | 他做面条的＿＿是跟爷爷学的。
手艺人 | shǒu yì rén | craftsperson | 靠手艺生活的人 | 老街上有很多＿＿，有的会做灯笼，有的会剪纸。 | 工匠
传承 | chuán chéng | to pass on | 一代一代传下去 | 这门手艺已经＿＿了三百年。
传人 | chuán rén | successor (of a craft) | 学到并继续传下去的人 | 他是这门古老手艺的第五代＿＿。
文物 | wén wù | cultural relic | 古代留下来的有历史价值的东西 | 这些＿＿都是从地下发现的。
修复 | xiū fù | to restore | 把坏了的东西修好，变回原来的样子 | 专家们花了三年时间＿＿这张古画。
出土 | chū tǔ | to be unearthed | 从地下发现 | 这件青铜器是在河南＿＿的。
`,
  },
  {
    theme: ["Thought and Belief", "思想和信仰"],
    data: `
儒家 | rú jiā | Confucianism | 孔子开创的学派 | 孔子是＿＿的代表人物。
道家 | dào jiā | Daoism | 老子、庄子开创的学派 | 老子是＿＿的代表人物。
圣人 | shèng rén | sage | 品德和智慧最高的人 | 古代很多人把孔子叫做“＿＿”。
神圣 | shén shèng | sacred | 非常重要、不能随便对待的 | 对很多人来说，这座山是＿＿的地方。
孝道 | xiào dào | filial piety | 孝敬父母的道理 | 中国传统文化很重视＿＿。
仁 | rén | benevolence | 对人有爱心 | 孔子认为“＿＿”就是爱人。
家训 | jiā xùn | family precepts | 长辈留给后代的做人的道理 | 他家的＿＿是“多读书，做好人”。
中华 | zhōng huá | China (as a civilization) | 中国和中国文化 | ＿＿文化有几千年的历史。 | 华夏
华夏 | huá xià | Huaxia | 中国古代的名字 | “＿＿”是中国古代的一个名字。 | 中华
孔庙 | kǒng miào | Confucian temple | 纪念孔子的庙 | 很多城市都有＿＿，是纪念孔子的地方。
`,
  },
  {
    theme: ["Calligraphy, Painting and Music", "书画和音乐"],
    data: `
楷书 | kǎi shū | regular script | 一种工整的汉字字体 | 学书法的人一般先学＿＿。
书法家 | shū fǎ jiā | calligrapher | 字写得特别好的艺术家 | 这位＿＿写的字被很多人收藏。
国画 | guó huà | traditional Chinese painting | 中国传统的绘画 | ＿＿常常用毛笔和墨在纸上画。 | 水墨画
山水画 | shān shuǐ huà | landscape painting | 画山和水的中国画 | 这张＿＿画的是黄山的风景。
水墨画 | shuǐ mò huà | ink-wash painting | 只用墨和水画的画 | ＿＿只有黑白两种颜色，却很有味道。 | 国画
毛笔 | máo bǐ | writing brush | 用动物的毛做的笔 | 写书法要用＿＿。
宣纸 | xuān zhǐ | Xuan paper | 写字画画用的一种好纸 | 他在＿＿上写了一个大大的“福”字。
印章 | yìn zhāng | seal | 刻着名字、可以印在纸上的东西 | 画画完以后，画家在画上盖了自己的＿＿。
古筝 | gǔ zhēng | guzheng | 一种有很多根线、用手弹的中国古代乐器 | 她弹＿＿弹得很好听。
民乐 | mín yuè | Chinese folk music | 用中国传统乐器演奏的音乐 | 这个乐队演奏的是＿＿，用的都是中国传统乐器。
`,
  },
  {
    theme: ["Splendid Achievements", "辉煌的成就"],
    data: `
辉煌 | huī huáng | glorious | 光彩照人；成就很大 | 唐朝是中国历史上非常＿＿的一个朝代。 | 灿烂
灿烂 | càn làn | brilliant | 光彩很亮 | 中华民族创造了＿＿的文化。 | 辉煌
宏伟 | hóng wěi | magnificent | 规模大，雄伟 | 长城是一个非常＿＿的建筑。
杰作 | jié zuò | masterpiece | 非常好的作品 | 大家都认为这张画是他的＿＿。
杰出 | jié chū | outstanding | 能力和成就比一般人高很多 | 他是一位＿＿的科学家。
四大发明 | sì dà fā míng | the Four Great Inventions | 造纸术、印刷术、火药和指南针 | 造纸术是中国古代的＿＿之一。
造纸术 | zào zhǐ shù | papermaking | 做纸的方法 | 在＿＿出现以前，人们把字写在竹简上。
印刷术 | yìn shuā shù | printing | 印书的技术 | 有了＿＿，书就可以一次印很多本了。
火药 | huǒ yào | gunpowder | 一种点了火就会突然烧起来的东西 | 古人用＿＿做成了烟花。
精华 | jīng huá | essence | 最好、最重要的部分 | 这本书收集了唐诗的＿＿。
`,
  },
  {
    theme: ["Roots and Heritage", "寻根和遗产"],
    data: `
寻找 | xún zhǎo | to look for | 找 | 他回到出生的地方，＿＿小时候的记忆。 | 追寻
寻根 | xún gēn | to seek one's roots | 去了解自己祖先的来历 | 很多海外华人回到中国＿＿。
追寻 | zhuī xún | to pursue | 不停地找 | 他一生都在＿＿自己的梦想。 | 寻找
悠久 | yōu jiǔ | long-standing | 时间很长 | 中国有＿＿的历史。
世界遗产 | shì jiè yí chǎn | World Heritage Site | 联合国认定的有特别价值的地方 | 长城早在三十多年前就成为了＿＿。 | 文化遗产
文化遗产 | wén huà yí chǎn | cultural heritage | 前人留下来的文化财富 | 保护＿＿是每个人的责任。 | 世界遗产
遗址 | yí zhǐ | ruins | 古代建筑或城市留下的地方 | 这里是一座古城的＿＿，现在只有一些石头了。
考古 | kǎo gǔ | archaeology | 研究古代留下来的东西 | 他是＿＿学家，经常去野外寻找古代的东西。
古籍 | gǔ jí | ancient books | 古代的书 | 图书馆里收藏了很多珍贵的＿＿。
博物院 | bó wù yuàn | (large) museum | 很大的博物馆 | 故宫＿＿每年接待很多游客。
`,
  },
  {
    theme: ["Old Towns and Lucky Symbols", "古城和吉祥"],
    data: `
凤凰 | fèng huáng | phoenix | 古代传说中的鸟王 | 在中国的传说里，龙和＿＿都代表吉祥。
龙凤 | lóng fèng | dragon and phoenix | 龙和凤 | 婚礼上常常能看到＿＿的图案。
吉祥物 | jí xiáng wù | mascot | 代表吉祥的形象 | 熊猫常常被选作运动会的＿＿。
对联 | duì lián | couplet | 写在纸上、贴在门两边的两句话 | 春节的时候，家家户户都在门上贴＿＿。
围棋 | wéi qí | go (the board game) | 一种用黑白棋子下的棋 | ＿＿起源于中国，已经有几千年的历史。
古都 | gǔ dū | ancient capital | 古代的首都 | 西安是有名的＿＿，很多朝代都在这里建都。
周围 | zhōu wéi | surroundings | 四周 | 这座古塔＿＿有很多老房子。
范围 | fàn wéi | scope | 一定的界限 | 这次考试的＿＿是前五课。
包围 | bāo wéi | to surround | 从四面围住 | 古城被一条河＿＿着。
烂 | làn | rotten | 坏了 | 这个苹果放得太久，已经＿＿了。
`,
  },
];
