// The fourth quarter of level 8 (docs/chinese-curriculum.md §8.3): units 10 to 12, music and film, institutions and
// administration, and finance and markets; 90 characters in 9 batches, none of them taught in levels 1 to 7 nor in the
// earlier quarters, from the middle third by frequency of the advanced band of GF 0025-2021, chosen for what each unit's
// words need, and 450 words in 45 batches, each unit's characters first.
//
// A character line as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.
//
// A word line as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches4 are the 9 character batches of units 10 to 12 of level 8, three a unit, in teaching order. */
export const characterBatches4: readonly string[] = [
  // Unit 10: Music and Film.
  `
弦 xián | string (of an instrument or a bow) | 乐器上或弓上绷紧的线 | 弓玄
吹 chuī | to blow; to play (a wind instrument) | 用力出气；用嘴出气使乐器发声 | 次欢
拨 bō | to pluck; to allocate | 用手指或工具弄动琴弦；分出一部分给 | 拔泼
弓 gōng | bow | 射箭的用具；拉琴用的工具 | 引弯
锣 luó | gong | 一种铜做的、敲起来声音很响的圆形乐器 | 罗箩
唢 suǒ | first syllable of 唢呐, the suona horn | 和“呐”合起来，指一种民间吹奏乐器 | 锁琐 | 呐
呐 nà | second syllable of 唢呐; to shout | 和“唢”合起来，指一种声音很响的吹奏乐器；大声喊 | 纳讷 | 唢
琵 pí | first syllable of 琵琶, the pipa lute | 和“琶”合起来，指一种四根弦的弹拨乐器 | 琶琴 | 琶
琶 pá | second syllable of 琵琶, the pipa | 跟“琵”合起来，指一种抱在怀里弹的中国乐器 | 琵爬 | 琵
箫 xiāo | vertical bamboo flute | 一种竖着吹的竹子做的乐器 | 萧笛
`,
  `
嗡 wēng | buzz, hum (a sound) | 形容虫子飞或机器转动的声音 | 翁嗓
哼 hēng | to hum; to snort | 用鼻子发声；低声唱 | 享亨
吼 hǒu | to roar | 大声叫 | 孔吸
嘹 liáo | loud and clear, as in 嘹亮 | 声音响亮，传得远 | 撩僚
喧 xuān | noisy | 声音大而杂乱 | 宣暄 | 嚣
嚣 xiāo | clamour | 吵闹的声音 | 器噪 | 喧
滚 gǔn | to roll; to boil | 翻转着移动；水开了翻腾 | 衰混
喇 lǎ | first syllable of 喇叭, a horn | 和“叭”合起来，指一种铜管乐器或扩音器 | 刺嗽 | 叭
叭 bā | second syllable of 喇叭; crack (a sound) | 跟“喇”合起来，指铜管乐器或扩音器；形容东西断开的声音 | 趴扒 | 喇
哨 shào | whistle; sentry post | 吹起来发出尖声的小东西；站岗的地方 | 消梢
`,
  `
嘻 xī | as in 嘻哈, hip-hop; hee-hee | 用在音乐名称里；形容笑的声音 | 喜嬉
帅 shuài | handsome; commander | 英俊，好看；军队中最高的指挥官 | 师帘
蹦 bèng | to leap, to bounce | 双脚一起跳 | 崩绷
怖 bù | fear, terror | 害怕 | 布饰 | 悚
悚 sǒng | afraid, terrified | 害怕，恐惧 | 竦速 | 怖
侠 xiá | knight-errant | 有本领、肯帮助人的英雄 | 峡挟
煽 shān | to fan; to stir up | 用扇子扇火；鼓动别人 | 扇搧
碟 dié | small dish; disc | 小盘子；光盘 | 蝶谍
馨 xīn | fragrance; warmth | 散布得很远的香气；温暖 | 磬声
酷 kù | cruel; cool (slang) | 残忍；很有个性、很潇洒 | 酶酬
`,
  // Unit 11: Institutions and Administration.
  `
宦 huàn | official (in old times) | 古代做官的人 | 官宫
仕 shì | to serve as an official | 做官 | 士任
俸 fèng | official's salary (in old times) | 古代官员的薪水 | 奉棒
擢 zhuó | to promote | 提拔 | 濯耀
黜 chù | to dismiss from office | 免去官职 | 出黔
丞 chéng | assistant official, as in 丞相 | 古代帮助主要官员办事的官 | 承亟
佐 zuǒ | to assist | 帮助，辅助 | 左佑
阁 gé | pavilion; cabinet | 一种有楼的建筑；政府的最高行政机关之一 | 阔各
斡 wò | to mediate, as in 斡旋 | 调解，在中间说和 | 翰幹
搁 gē | to put aside | 放下；停下不办 | 阁格
`,
  `
呈 chéng | to submit (to a superior); to show | 恭敬地送上去；显出 | 星程
戳 chuō | to poke; stamp, seal | 用尖的东西刺；印章 | 翟截
琐 suǒ | trivial, petty | 细小，零碎 | 锁唢 | 冗
冗 rǒng | superfluous; tedious | 多余的；繁杂 | 沉亢 | 琐
搪 táng | to fend off, as in 搪塞 | 抵挡，应付 | 塘糖
塞 sè/sāi | to stop up; to stuff in | 堵住；把东西放进去 | 赛寨
诿 wěi | to shift (blame) | 把责任推给别人 | 萎委
扯 chě | to pull; to chat idly | 拉；随便说话 | 址趾
叠 dié | to pile up; to fold | 一层层地放上去；折 | 宜垒
沓 tà/dá | repetitive; a pile (of paper) | 繁多重复；量词，用于叠起来的纸张 | 踏杳
`,
  `
秉 bǐng | to uphold | 拿着；坚持 | 乘兼
恪 kè | scrupulous, respectful | 谨慎而恭敬 | 格客
劾 hé | to impeach | 揭发官员的罪状 | 刻孩
赦 shè | to pardon | 免除罪犯的刑罚 | 赫赤
挠 náo | to scratch; to hinder | 用手指轻轻地抓；阻止 | 浇烧
蔽 bì | to cover, to hide | 遮住，挡住 | 弊敝
勾 gōu | to tick; to collude | 用笔画钩形的记号；暗中结合 | 句匀
遴 lín | to select carefully | 谨慎地选择 | 磷邻
徽 huī | emblem, badge | 表示某种组织或身份的标志 | 微征
弛 chí | to slacken | 放松，松懈 | 驰池
`,
  // Unit 12: Finance and Markets.
  `
赊 shē | to buy or sell on credit | 先买东西，以后再付钱 | 余赌
赎 shú | to redeem | 用钱把抵押的东西换回来 | 读续
拮 jié | as in 拮据, short of money | 和“据”合起来，指缺少钱 | 吉桔 | 窘
窘 jiǒng | in straits, embarrassed | 生活困难；为难 | 君窖 | 拮
阔 kuò | wide; rich | 宽；有钱 | 活阁 | 绰
绰 chuò | ample, as in 阔绰 | 宽裕，多 | 卓桌 | 阔
甩 shuǎi | to swing; to fling off | 用力挥动；扔掉 | 用电
吆 yāo | to shout (wares), as in 吆喝 | 大声喊叫，叫卖 | 么吃
囊 náng | bag, purse | 口袋 | 襄裹
凑 còu | to gather together | 把分散的人或东西聚在一起 | 奏凌
`,
  `
镑 bàng | pound (money) | 英国等国家的货币单位 | 磅傍
卢 lú | as in 卢布, the rouble; a surname | 用在俄罗斯货币单位的名称里；姓 | 户芦
铢 zhū | baht; a tiny weight | 泰国的货币单位；古代很小的重量单位 | 珠株
贰 èr | two (in formal writing) | “二”的大写 | 武贝
叁 sān | three (in formal writing) | “三”的大写 | 参惨
赈 zhèn | to relieve (the needy) | 用钱或东西救济 | 振账
肆 sì | four (in formal writing); unrestrained | “四”的大写；不受约束 | 律肄
栈 zhàn | warehouse; inn | 存放货物的房子；旅店 | 浅钱
斤 jīn | jin (half a kilogram) | 重量单位，等于五百克 | 斥斩
埠 bù | port, trading town | 停船的码头；有码头的城镇 | 阜埔
`,
  `
掂 diān | to weigh in the hand | 用手托着估计轻重 | 店拈
飙 biāo | to soar; whirlwind | 急速上升；暴风 | 飘标
靡 mǐ/mí | dejected; to waste | 没有精神；浪费 | 糜摩
兜 dōu | pocket; to go around | 衣服上的口袋；绕圈 | 兑党
敛 liǎn | to collect; to restrain | 收集；约束 | 检脸
缉 jī | to seize (smugglers or criminals) | 搜查，捉拿 | 辑揖
揣 chuǎi | to estimate, to guess | 估计，猜想 | 喘端
鳄 è | crocodile | 一种生活在水边、嘴很大的爬行动物 | 鄂愕
榨 zhà | to press, to squeeze | 用力压出汁；剥削 | 窄柞
捞 lāo | to fish out; to gain improperly | 从水里取东西；用不正当的方法得到 | 劳涝
`,
];

/** wordBatches4 are the 45 word batches of units 10 to 12 of level 8, fifteen a unit, in teaching order. */
export const wordBatches4: readonly LevelWordBatch[] = [
  // Unit 10: Music and Film.
  {
    theme: ["Chinese Instruments", "民族乐器"],
    data: `
唢呐 | suǒ nà | suona, a Chinese shawm | 一种声音高亢响亮的民间吹奏乐器 | 农村办喜事的时候，常常请人来吹＿＿，热闹极了。 | 箫
琵琶 | pí pa | pipa, a Chinese lute | 一种有四根弦、抱在怀里弹的乐器 | 她怀里抱着一把＿＿，手指在弦上飞快地弹着。
箫 | xiāo | vertical bamboo flute | 一种直着拿着吹的竹制乐器 | 笛子是平着拿在嘴边吹的，＿＿是直着拿着吹的。
锣鼓 | luó gǔ | gongs and drums | 锣和鼓，也泛指打击乐器 | 春节庙会上＿＿喧天，舞狮队来了。
扬琴 | yáng qín | yangqin, a hammered dulcimer | 用两根小竹片敲弦发声的乐器 | ＿＿是用两根小竹片敲打琴弦发出声音的。
编钟 | biān zhōng | chime bells | 古代一组大小不同、按音的高低排列的铜钟 | 博物馆里的这套＿＿已经有两千多年的历史，现在还能敲出音乐。
琴弦 | qín xián | string (of an instrument) | 乐器上发声的线 | 他弹得太用力，一根＿＿断了。
吹拉弹唱 | chuī lā tán chàng | playing and singing of all kinds | 吹管乐、拉弦乐、弹琴、唱歌，指各种音乐本领 | 爷爷年轻时在剧团工作，＿＿样样都会。
敲锣打鼓 | qiāo luó dǎ gǔ | with gongs and drums, joyfully | 敲着锣打着鼓，形容热烈庆祝 | 比赛得了冠军，全村人＿＿地欢迎他们回家。
民族乐器 | mín zú yuè qì | traditional instruments (of a people) | 一个民族特有的乐器 | 二胡、古筝和笛子都是中国的＿＿。
`,
  },
  {
    theme: ["Orchestral Instruments", "管弦乐器"],
    data: `
长笛 | cháng dí | flute | 一种横着吹的西洋管乐器 | 乐队里的＿＿声音清亮，常常用来模仿鸟叫。
单簧管 | dān huáng guǎn | clarinet | 一种木管乐器，吹口上有一片簧片 | ＿＿的吹口上有一片薄薄的簧片，吹气时它会振动发声。
圆号 | yuán hào | French horn | 一种管子绕成圆形的铜管乐器 | ＿＿的管子绕成一个圆圈，吹的人常常把一只手放进它的大口里。
定音鼓 | dìng yīn gǔ | timpani | 能调出一定音高的大鼓 | 交响乐团里的＿＿可以调出不同的音高，不只是打节奏。
架子鼓 | jià zi gǔ | drum kit | 几个大小不同、放在架子上由一个人敲的鼓 | 摇滚乐队里，坐在后面敲＿＿的人负责掌握节奏。
弦乐器 | xián yuè qì | string instrument | 靠弦振动发声的乐器 | 小提琴、大提琴和吉他都是＿＿。 | 管乐器 打击乐器
管乐器 | guǎn yuè qì | wind instrument | 靠吹气发声的乐器 | 长笛和单簧管都属于＿＿，都要用嘴吹。 | 铜管乐器
打击乐器 | dǎ jī yuè qì | percussion instrument | 敲打发声的乐器 | 锣、鼓和木鱼都是＿＿。
铜管乐器 | tóng guǎn yuè qì | brass instrument | 用铜等金属做的管乐器 | 小号和圆号都是金属做的＿＿，声音很响亮。 | 管乐器
琴弓 | qín gōng | bow (for a string instrument) | 拉小提琴等乐器用的弓 | 拉小提琴的时候，右手拿着＿＿，左手按弦。
`,
  },
  {
    theme: ["Playing", "演奏"],
    data: `
吹奏 | chuī zòu | to play (a wind instrument) | 用嘴吹乐器演奏 | 他用笛子＿＿了一首家乡的民歌。
弹奏 | tán zòu | to play (by plucking or keys) | 用手指弹乐器演奏 | 她在钢琴上＿＿了一首小曲。
拨弦 | bō xián | to pluck strings | 用手指拨动琴弦 | 拉小提琴一般用弓，但有时也用手指＿＿，声音短而轻。
合奏 | hé zòu | ensemble playing | 几个人用乐器一起演奏 | 这首曲子不是独奏，而是十几种乐器的＿＿。
调音 | tiáo yīn | to tune | 把乐器的音高调准 | 演出开始前，乐手们都在给自己的乐器＿＿。
演奏会 | yǎn zòu huì | recital, concert | 演奏音乐给大家听的会 | 这位钢琴家下个月要在音乐厅举办个人＿＿。
指法 | zhǐ fǎ | fingering | 演奏乐器时手指的用法 | 学钢琴先要练好＿＿，每个手指按哪个键都有规定。
乐感 | yuè gǎn | feel for music | 对音乐的感受和理解能力 | 这孩子＿＿很好，听一遍就能把曲子哼出来。
乐手 | yuè shǒu | instrumentalist | 乐队里演奏乐器的人 | 这支乐队一共有五名＿＿，每人负责一种乐器。
编曲 | biān qǔ | to arrange (music) | 为乐曲配上和声、选择乐器 | 这首民歌经过重新＿＿，加入了电吉他和架子鼓。
`,
  },
  {
    theme: ["The Orchestra", "交响乐团"],
    data: `
交响乐团 | jiāo xiǎng yuè tuán | symphony orchestra | 演奏交响乐的大型乐队 | 这个＿＿有一百多名乐手，在世界各地演出过。
管弦乐 | guǎn xián yuè | orchestral music | 用管乐器、弦乐器和打击乐器合奏的音乐 | 这支＿＿队里既有弦乐器，又有管乐器。
首席 | shǒu xí | principal (player); chief | 乐队中某个声部的第一位乐手；职位最高的 | 她是乐团的小提琴＿＿，坐在指挥左手边第一个位子。
声部 | shēng bù | part, section (in music) | 合唱或合奏中的一个部分 | 合唱团分成高音和低音几个＿＿。
协奏曲 | xié zòu qǔ | concerto | 一件乐器独奏、乐队伴奏的大型乐曲 | 在这首钢琴＿＿里，钢琴独奏，乐队伴奏。
序曲 | xù qǔ | overture; prelude | 歌剧等开始前演奏的乐曲；比喻开端 | 歌剧开始前，乐队先演奏了一段＿＿。
乐章 | yuè zhāng | movement (of a symphony) | 大型乐曲中相对独立的部分 | 这部交响曲一共有四个＿＿，第二个最慢。
指挥家 | zhǐ huī jiā | conductor | 以指挥乐队为职业的音乐家 | 那位＿＿把手一举，整个乐团就开始演奏了。
交响曲 | jiāo xiǎng qǔ | symphony | 由管弦乐队演奏的大型乐曲 | ＿＿是由管弦乐队演奏的大型乐曲，一般有四个乐章。 | 协奏曲 管弦乐
音乐厅 | yīn yuè tīng | concert hall | 专门演奏音乐的大厅 | 这座＿＿的声音效果非常好，坐在最后一排也听得很清楚。
`,
  },
  {
    theme: ["Music Theory", "乐理"],
    data: `
和弦 | hé xián | chord | 几个音同时发出的组合 | 弹吉他时，左手按住几根弦就能弹出一个＿＿。
和声 | hé shēng | harmony | 几个音按规律组合在一起的声音效果 | 合唱时，几个声部唱的音不一样，合起来就成了好听的＿＿。 | 和弦
节拍 | jié pāi | beat, metre | 音乐中强弱有规律的重复 | 跳舞的时候要跟上音乐的＿＿。
音阶 | yīn jiē | scale | 按高低顺序排列的一组音 | 练钢琴的人每天都要先把＿＿从低到高、再从高到低弹几遍。
五线谱 | wǔ xiàn pǔ | staff notation | 在五条平行线上记音符的乐谱 | ＿＿用五条平行的线来记录音的高低。 | 简谱
简谱 | jiǎn pǔ | numbered musical notation | 用数字表示音高的乐谱 | 在＿＿里，用数字一到七表示七个基本的音。
大调 | dà diào | major key | 一种听起来明亮的调式 | 这首曲子是＿＿的，听起来明亮欢快。 | 小调
小调 | xiǎo diào | minor key; ditty | 听起来比较忧伤的调式；民间小曲 | 这首曲子用的是＿＿，听起来有点忧伤。
音准 | yīn zhǔn | pitch accuracy | 唱歌或演奏时音高准不准 | 他唱歌很有感情，可是＿＿不太好，常常唱得偏高。
音域 | yīn yù | range (of a voice or instrument) | 能发出的从最低到最高的音的范围 | 她的＿＿很宽，能唱很高的音，也能唱很低的音。
`,
  },
  {
    theme: ["Voices", "嗓音"],
    data: `
音色 | yīn sè | timbre | 声音的特色 | 同样一个音，钢琴和小提琴的＿＿完全不同。
嘹亮 | liáo liàng | loud and clear | 声音响亮，传得很远 | 军号声＿＿，整个营地都听得见。
男高音 | nán gāo yīn | tenor | 男声中最高的声部 | 他是一位著名的＿＿，能唱很高的音。 | 女高音
女高音 | nǚ gāo yīn | soprano | 女声中最高的声部 | 歌剧里的女主角常常由＿＿来唱。
美声 | měi shēng | bel canto | 一种起源于意大利的歌唱方法 | 她在音乐学院学的是＿＿唱法，常常唱意大利歌剧。
哼唱 | hēng chàng | to hum | 嘴闭着或低声地唱 | 妈妈一边做饭，一边轻轻地＿＿着一首老歌。
跑调 | pǎo diào | to sing off-key | 唱歌时音调不准 | 他一唱歌就＿＿，大家都笑了。
假声 | jiǎ shēng | falsetto | 用特殊方法发出的比平常高的声音 | 这位男歌手用＿＿唱出了很高的音，听起来像女声。
气息 | qì xī | breath | 呼吸时出入的气 | 唱歌要学会控制＿＿，不然唱长句子会喘不过气。
清唱 | qīng chàng | to sing unaccompanied | 没有乐器伴奏地唱 | 没有伴奏，她就站在那里＿＿了一段。 | 哼唱
`,
  },
  {
    theme: ["Kinds of Music", "音乐类型"],
    data: `
古典音乐 | gǔ diǎn yīn yuè | classical music | 欧洲传统的严肃音乐 | ＿＿在欧洲已经流传了几百年，今天的交响乐团还常常演奏。
流行音乐 | liú xíng yīn yuè | pop music | 大众喜爱、广泛流传的音乐 | 年轻人大多喜欢听＿＿，排行榜上的新歌他们都会唱。
摇滚乐 | yáo gǔn yuè | rock music | 节奏强烈、常用电吉他和架子鼓的音乐 | ＿＿二十世纪五十年代在美国兴起，常用电吉他和架子鼓演奏。
爵士乐 | jué shì yuè | jazz | 起源于美国黑人音乐、常常即兴演奏的音乐 | ＿＿起源于美国的新奥尔良，即兴演奏是它的一大特点。
嘻哈 | xī hā | hip-hop | 起源于美国街头、包括说唱和街舞的文化 | ＿＿文化起源于美国纽约的街头，包括说唱和街舞等。
说唱 | shuō chàng | rap | 跟着节奏快速地说出押韵的词 | 他不是在唱歌，而是在跟着节奏＿＿。
轻音乐 | qīng yīn yuè | light music | 轻快、通俗、适合放松时听的音乐 | 咖啡馆里放着轻柔的＿＿，让人觉得很放松。 | 流行音乐
乡村音乐 | xiāng cūn yīn yuè | country music | 起源于美国南部农村的音乐 | ＿＿起源于美国南部的农村，常用吉他和小提琴伴奏。
电子音乐 | diàn zǐ yīn yuè | electronic music | 用电子设备制作的音乐 | ＿＿不用传统乐器，而是用电脑做出各种声音。
民族音乐 | mín zú yīn yuè | traditional music (of a people) | 一个民族传统的音乐 | 这位作曲家走遍了西部山区，收集当地的＿＿。
`,
  },
  {
    theme: ["Sounds and Noise", "声响"],
    data: `
喧嚣 | xuān xiāo | clamour, hubbub | 声音杂乱，很吵 | 他离开城市的＿＿，到山里住了一个月。 | 喧闹
喧闹 | xuān nào | noisy and lively | 又吵又热闹 | 上课铃一响，刚才还很＿＿的操场一下子安静了下来。
嗡嗡 | wēng wēng | buzz, drone | 形容虫子飞或机器转动的声音 | 一只蜜蜂在耳边＿＿地飞来飞去。
吼叫 | hǒu jiào | to roar | 大声叫 | 老虎发出一声＿＿，树林里的小鸟都飞走了。
喇叭 | lǎ ba | horn; loudspeaker | 一种铜管乐器；扩大声音的设备 | 村口的大＿＿里正在通知大家明天开会。
口哨 | kǒu shào | whistle (with the lips) | 嘴唇撮起来吹出的声音 | 他心情很好，一边走一边吹着＿＿。 | 哨子
哨子 | shào zi | whistle (the object) | 吹起来发出尖声的小东西 | 体育老师用力一吹＿＿，同学们马上排好了队。
震耳欲聋 | zhèn ěr yù lóng | deafening | 声音大得耳朵都快听不见了 | 音响开得太大，声音＿＿。 | 刺耳
刺耳 | cì ěr | ear-piercing, harsh | 声音尖锐难听 | 指甲划过黑板的声音特别＿＿。
回响 | huí xiǎng | to echo | 声音反射回来 | 歌声在山谷里久久＿＿。
`,
  },
  {
    theme: ["Concerts and Fans", "演出和乐迷"],
    data: `
巡演 | xún yǎn | to tour; a tour | 到各地巡回演出 | 这支乐队今年要在全国二十个城市＿＿。
签售 | qiān shòu | signing and sale | 作者或歌手现场签名出售作品 | 歌手在书店举办新专辑＿＿会，歌迷排了很长的队。
加演 | jiā yǎn | to add performances | 在原定的场次以外再多演几场 | 门票几分钟就卖完了，主办方决定再＿＿两场。
追星 | zhuī xīng | to idolize stars | 非常喜爱、追随明星 | 她喜欢＿＿，墙上贴满了歌手的照片。
帅气 | shuài qi | handsome, dashing | 英俊，潇洒 | 舞台上的男歌手穿着白色西装，显得很＿＿。 | 酷
蹦蹦跳跳 | bèng bèng tiào tiào | bouncing and jumping | 一会儿蹦，一会儿跳，形容活泼 | 音乐一响，小朋友们就＿＿地跑到台前。
酷 | kù | cool | 很有个性，很潇洒 | 他戴着黑色墨镜弹电吉他的样子真＿＿！
乐迷 | yuè mí | music fan | 喜爱音乐的人 | 每年夏天的音乐节都会吸引成千上万的＿＿。
音乐节 | yīn yuè jié | music festival | 在一段时间里集中举办的大型音乐演出活动 | 这个＿＿连续举行三天，有几十支乐队参加。
开场 | kāi chǎng | to begin (of a show) | 演出开始 | 离＿＿还有一个小时，场馆外面已经排起了长队。
`,
  },
  {
    theme: ["Records", "录音和唱片"],
    data: `
录音棚 | lù yīn péng | recording studio | 专门录制声音的房间 | 歌手在＿＿里录了一整天，才把这首歌录好。
唱片 | chàng piàn | record | 录有声音、可以播放的圆片 | 爷爷家里还收藏着很多老＿＿，要用唱机才能播放。
光碟 | guāng dié | optical disc, CD | 用激光读取的圆形碟片 | 现在大家都在网上听歌，很少有人去商店买＿＿了。 | 唱片
专辑 | zhuān jí | album | 一次发行、收集几首歌曲的一套作品 | 这位歌手的新＿＿里一共有十首歌。
单曲 | dān qǔ | single | 单独发行的一首歌 | 这首＿＿一发行，就在网上被播放了一百万次。
母带 | mǔ dài | master tape | 录音后最原始的录音带 | 这张老唱片是根据原来的＿＿重新制作的。
播放器 | bō fàng qì | player (device or app) | 用来播放声音或图像的设备或软件 | 他用手机上的音乐＿＿听歌。
翻唱 | fān chàng | to cover (a song) | 重新演唱别人唱过的歌 | 这首老歌被很多年轻歌手＿＿过。
原唱 | yuán chàng | original singer | 第一个唱某首歌的人 | 这首歌的＿＿是一位老歌唱家，后来很多人都唱过。
作曲家 | zuò qǔ jiā | composer | 以创作乐曲为职业的人 | 这首歌由一位著名的＿＿谱曲，一位诗人写词。
`,
  },
  {
    theme: ["Kinds of Film", "电影类型"],
    data: `
恐怖片 | kǒng bù piàn | horror film | 让人害怕的电影 | 他胆子小，从来不敢看＿＿。 | 惊悚片 悬疑片
惊悚片 | jīng sǒng piàn | thriller | 情节紧张、让人心跳加快的电影 | 这部＿＿情节紧张，观众的心一直提到最后一分钟。 | 悬疑片
武侠片 | wǔ xiá piàn | martial-arts film | 讲有功夫的侠客故事的电影 | 很多外国人是通过＿＿认识中国功夫的。
喜剧片 | xǐ jù piàn | comedy | 让人发笑的电影 | 这部＿＿让观众从头笑到尾。
动画片 | dòng huà piàn | animated film, cartoon | 用画出来或电脑做出的图像拍成的影片 | 孩子们最喜欢看＿＿里那只会说话的小熊。
科幻片 | kē huàn piàn | science-fiction film | 讲科学幻想故事的电影 | 这部＿＿讲的是人类移民到火星的故事。
爱情片 | ài qíng piàn | romance film | 讲爱情故事的电影 | 这部＿＿讲的是一对年轻人相爱的故事。
悬疑片 | xuán yí piàn | mystery film | 情节有很多疑问、到最后才揭开的电影 | 这部＿＿直到最后几分钟，观众才知道画是谁拿走的。
剧情片 | jù qíng piàn | drama (film) | 以故事和人物为主的电影 | ＿＿不靠特效，而是靠故事和人物打动观众。
武侠 | wǔ xiá | martial-arts chivalry | 会武功、讲义气的侠客 | 他从小爱看＿＿小说，梦想自己也能行侠仗义。
`,
  },
  {
    theme: ["Making a Film", "拍电影"],
    data: `
制片人 | zhì piàn rén | producer | 负责筹集资金、组织拍摄的人 | 这部电影的＿＿四处找钱，终于筹到了拍摄的费用。
剧组 | jù zǔ | film crew | 为拍一部戏组织起来的全体人员 | 整个＿＿在沙漠里待了三个月，才把戏拍完。
片场 | piàn chǎng | film set | 拍电影的场地 | 他第一次走进＿＿，看到到处都是灯和摄影机。
摄影师 | shè yǐng shī | cinematographer; photographer | 负责拍摄的人 | 这部电影的＿＿把草原拍得特别美。
场记 | chǎng jì | script supervisor | 记录拍摄现场每个镜头情况的人 | ＿＿要把每个镜头拍了几遍、演员穿什么衣服都记下来。
外景 | wài jǐng | location (shooting) | 在摄影棚外面拍的景物 | 这部电影的＿＿是在一个海边小村子拍的。
杀青 | shā qīng | to wrap (filming) | 拍完全部镜头 | 电影拍了半年，今天终于＿＿了，大家一起合影留念。
开机 | kāi jī | to start shooting | 电影开始拍摄 | 这部电影将在下个月＿＿，计划拍四个月。 | 杀青
试镜 | shì jìng | screen test | 演员在镜头前试演 | 几百名演员参加了＿＿，最后只选上了三个。
群众演员 | qún zhòng yǎn yuán | extra | 在电影里扮演普通人群、一般没有台词的演员 | 他在电影里当过＿＿，只在街上走了两步。
`,
  },
  {
    theme: ["Shots", "镜头"],
    data: `
特写 | tè xiě | close-up | 把人或物的一部分放大的镜头 | 镜头慢慢推近，最后给了她的眼睛一个＿＿。
长镜头 | cháng jìng tóu | long take | 很长时间不切换的一个镜头 | 这个＿＿拍了整整五分钟，中间一次都没有剪开。
慢镜头 | màn jìng tóu | slow motion | 动作比实际慢的镜头 | 运动员冲过终点的那一刻，电视里用＿＿重放了一遍。
蒙太奇 | méng tài qí | montage | 把不同的镜头组接在一起的方法 | ＿＿是把不同的镜头剪接在一起，讲出一个完整的故事。
剪辑 | jiǎn jí | to edit (film) | 把拍好的镜头选择、组合起来 | 拍了一百个小时的素材，＿＿以后只留下两个小时。
配乐 | pèi yuè | film score | 为电影等配的音乐 | 这部电影的＿＿非常感人，很多人看完都去买了原声唱片。
配音 | pèi yīn | to dub; dubbing | 为影片里的角色录声音 | 这部外国动画片由中国演员＿＿，孩子们都听得懂。
特效 | tè xiào | special effects | 用电脑等做出的特殊画面效果 | 片中的恐龙不是真的，是用电脑＿＿做出来的。
画外音 | huà wài yīn | voice-over | 画面上看不到说话人的声音 | 影片开头，一个老人的＿＿讲起了这个故事。 | 配音
空镜头 | kōng jìng tóu | empty shot | 只有景物、没有人物的镜头 | 影片用几个＿＿表现小城的清晨：街道、小河、远山。
`,
  },
  {
    theme: ["At the Cinema", "上映"],
    data: `
档期 | dàng qī | release slot | 电影上映的时间段 | 春节＿＿是一年里电影票卖得最多的时候。
院线 | yuàn xiàn | cinema chain | 由很多电影院组成的发行放映系统 | 这部电影在全国各大＿＿同时上映。
影院 | yǐng yuàn | cinema | 放电影的地方 | 周末的＿＿里坐满了观众。
预告片 | yù gào piàn | trailer | 电影上映前用来宣传的短片 | 电影还没上映，＿＿就在网上被看了几千万次。
翻拍 | fān pāi | to remake | 把以前拍过的故事重新拍 | 这部电影是根据一部三十年前的老电影＿＿的。
影评 | yǐng píng | film review | 评论电影的文章 | 他每看完一部电影，都会在网上写一篇＿＿。
上座率 | shàng zuò lǜ | attendance rate | 座位被观众坐满的比例 | 这部电影的＿＿很高，每一场几乎都坐满了。
首映式 | shǒu yìng shì | premiere | 电影第一次公开放映的仪式 | 导演和主演都出席了电影的＿＿。
观影 | guān yǐng | to watch a film | 看电影 | 为了不影响别人＿＿，请把手机调成静音。
影展 | yǐng zhǎn | film festival | 集中放映很多电影的展览活动 | 这部电影在国际＿＿上获得了最佳导演奖。
`,
  },
  {
    theme: ["Stars and Audiences", "明星和观众"],
    data: `
影帝 | yǐng dì | best-actor winner | 获得最佳男演员奖的人 | 他凭这部电影获得了最佳男主角奖，成了＿＿。 | 影后
影后 | yǐng hòu | best-actress winner | 获得最佳女演员奖的人 | 她三次获得最佳女主角奖，被大家称为“三届＿＿”。
煽情 | shān qíng | sentimental, tear-jerking | 故意激起别人的感情 | 这部电影有些地方太＿＿了，反而让人不感动。
温馨 | wēn xīn | warm and cosy | 温暖而让人舒服 | 这是一部讲一家人互相关爱的＿＿电影。
走红 | zǒu hóng | to become popular | 出名，受欢迎 | 她因为一部电视剧一下子＿＿了。
戏份 | xì fèn | screen time (of a role) | 一个角色在戏里的分量 | 他在这部电影里的＿＿不多，只出场了三次。
入戏 | rù xì | to get into a role | 演员完全进入角色 | 她太＿＿了，拍完那场哭戏，很久都停不下来。
出道 | chū dào | to debut | 开始演艺事业 | 他十六岁＿＿，到现在已经演了二十多部电影。
童星 | tóng xīng | child star | 很小就出名的演员 | 她五岁就开始演戏，是有名的＿＿。
叫座 | jiào zuò | to draw large audiences | 能吸引很多观众 | 这部电影既叫好又＿＿，票房和口碑都很好。
`,
  },
  // Unit 11: Institutions and Administration.
  {
    theme: ["Officials of Old", "古代官制"],
    data: `
宦官 | huàn guān | eunuch (court official) | 古代在皇宫里服侍皇帝和皇族的男人 | 古代皇宫里的＿＿负责照顾皇帝一家的生活。
仕途 | shì tú | official career | 做官的道路 | 他的＿＿很顺利，三十岁就当上了知府。
丞相 | chéng xiàng | chancellor | 古代帮助皇帝处理国家大事的最高官员 | 秦朝就设立了＿＿，帮助皇帝处理全国的大事。
擢升 | zhuó shēng | to promote | 提拔，使职位升高 | 他因为治水有功，被＿＿为知府。
罢黜 | bà chù | to dismiss from office; to reject | 免去官职；排斥 | 他因为犯了大错，被皇帝＿＿，回到了家乡。
辅佐 | fǔ zuǒ | to assist (a ruler) | 在政治上帮助 | 周公＿＿年幼的周成王，治理国家。
官宦 | guān huàn | officials; official families | 做官的人 | 他出生在一个＿＿人家，祖父和父亲都做过官。
入仕 | rù shì | to enter officialdom | 开始做官 | 古代读书人大多通过科举考试＿＿。
官职 | guān zhí | official post | 官员的职位 | 古代的＿＿分成很多等级，等级越高，权力越大。
薪俸 | xīn fèng | salary, pay | 工资；古代官员的收入 | 古代官员的＿＿常常不是发钱，而是发粮食。
`,
  },
  {
    theme: ["Government Bodies", "政府机构"],
    data: `
内阁 | nèi gé | cabinet | 一些国家里由首相或总理领导的最高行政机关 | 在一些国家，总理和各部部长组成＿＿，共同决定重大政策。
组阁 | zǔ gé | to form a cabinet | 组织内阁 | 选举结束后，新总理开始＿＿，选出各部的部长。
机关 | jī guān | government office, organ | 办理公共事务的部门 | 他大学毕业后在一个政府＿＿工作。
部委 | bù wěi | ministries and commissions | 中央政府的各部和各委员会 | 这项政策是由几个＿＿一起制定的。 | 机关
上级 | shàng jí | superior, higher authority | 比自己级别高的人或部门 | 这件事我们决定不了，要报告＿＿。
直属 | zhí shǔ | directly under | 直接属于，由它直接领导 | 这所医院是市政府＿＿的。
编制 | biān zhì | staffing quota | 单位规定的人员数量和职位 | 这个部门的＿＿是二十人，现在只有十五人。
科室 | kē shì | section (of an office or hospital) | 机关、医院等内部分出来的办事单位 | 医院的各个＿＿都在二楼，看病请先挂号。
行政区 | xíng zhèng qū | administrative region | 国家为了管理而划分的区域 | 这个国家分成二十个＿＿，每个都有自己的政府。
辖区 | xiá qū | area under jurisdiction | 管理的区域 | 这个派出所的＿＿里住着五万多人。
`,
  },
  {
    theme: ["Official Papers", "公文"],
    data: `
公文 | gōng wén | official document | 机关之间往来的文件 | 他是秘书，每天要处理几十份＿＿。 | 公函
呈报 | chéng bào | to report (to a superior) | 用公文向上级报告 | 调查结果已经写成报告，＿＿给了上级。 | 呈送
呈送 | chéng sòng | to submit, to present | 恭敬地送上去 | 这份计划书已经＿＿市长审阅。
邮戳 | yóu chuō | postmark | 邮局盖在信上的日期印记 | 报名表以寄出时的＿＿日期为准。
公函 | gōng hán | official letter | 机关之间来往的信件 | 两个部门之间常常通过＿＿联系。
批文 | pī wén | written approval | 上级批准的文件 | 拿到政府的＿＿以后，这座桥才能开工。
红头文件 | hóng tóu wén jiàn | official directive | 政府机关发出的、标题印成红色的正式文件 | 这件事已经写进了＿＿，各部门都要执行。
复印件 | fù yìn jiàn | photocopy | 复印出来的文件 | 办理手续时，要带身份证原件和＿＿。
原件 | yuán jiàn | original (document) | 最初的文件，不是复印的 | 这份是复印件，请把＿＿也拿来给我看一下。 | 复印件
一沓 | yì dá | a stack (of paper) | 叠在一起的一些纸 | 他从包里拿出＿＿文件，放在桌上。
`,
  },
  {
    theme: ["Procedures", "手续"],
    data: `
繁琐 | fán suǒ | overly elaborate | 复杂，细小的事情多 | 以前办这个证要跑五个部门，手续太＿＿了。 | 冗长
简化 | jiǎn huà | to simplify | 使变简单 | 政府＿＿了办事手续，现在一天就能办好。
冗长 | rǒng cháng | lengthy, long-winded | 文章或讲话太长，废话多 | 这份报告写得太＿＿，一百页里有用的只有十页。
冗员 | rǒng yuán | redundant staff | 多余的人员 | 改革以后，机关里的＿＿少了，效率提高了。
一站式 | yí zhàn shì | one-stop | 在一个地方就能办完所有的事 | 新的服务大厅提供＿＿服务，办事不用再跑好几个地方。
琐事 | suǒ shì | trivial matters | 细小的事情 | 他每天忙于各种＿＿，没有时间考虑大问题。
层层 | céng céng | layer upon layer | 一层又一层 | 一份申请要经过＿＿审批，三个月才批下来。
重叠 | chóng dié | to overlap | 一层层堆在一起；重复 | 这两个部门的工作有很多＿＿的地方，应该合并。 | 叠床架屋
叠加 | dié jiā | to superimpose, to add up | 一层层加上去 | 几个问题＿＿在一起，事情就更难办了。 | 重叠
叠床架屋 | dié chuáng jià wū | needless duplication | 比喻机构或文章重复、多余 | 机构设置＿＿，一件小事要好几个部门管。
`,
  },
  {
    theme: ["Red Tape", "官僚作风"],
    data: `
推诿 | tuī wěi | to shift responsibility | 把责任推给别人 | 这是你的责任，不要＿＿给别人。
搪塞 | táng sè | to stall, to fob off | 随便应付过去 | 他找了个借口＿＿过去，并没有回答记者的问题。 | 敷衍塞责
扯皮 | chě pí | to wrangle | 互相争论，推来推去 | 两个部门为了这件事＿＿了半年，问题还是没有解决。 | 踢皮球
拖沓 | tuō tà | dilatory, sluggish | 做事拖拉，不爽快 | 他做事＿＿，一个星期的工作拖了一个月。
踢皮球 | tī pí qiú | to pass the buck | 比喻互相推卸责任 | 群众去办事，部门之间互相＿＿，让他白跑了好几次。 | 推诿 扯皮
形式主义 | xíng shì zhǔ yì | formalism | 只看形式、不重实际的作风 | 开会只是走走过场，这是典型的＿＿。
文山会海 | wén shān huì hǎi | flood of documents and meetings | 文件和会议太多 | 他整天陷在＿＿里，根本没有时间下去调查。
敷衍塞责 | fū yǎn sè zé | to do a perfunctory job | 做事不认真，随便应付 | 工作要认真负责，不能＿＿。
东拉西扯 | dōng lā xī chě | to ramble | 说话没有中心，乱说一通 | 他回答问题时＿＿，说了半天也没说到重点。
扯后腿 | chě hòu tuǐ | to hold back | 拖累别人，使不能前进 | 大家都在努力，你可别＿＿。
`,
  },
  {
    theme: ["Deciding and Delaying", "决策和拖延"],
    data: `
搁置 | gē zhì | to shelve | 放在一边，停止进行 | 因为资金不够，这个计划被＿＿了。 | 搁浅
搁浅 | gē qiǎn | to run aground; to stall | 船停在浅水处不能走；比喻事情停顿 | 大船＿＿了，要等涨潮才能离开。
悬而未决 | xuán ér wèi jué | unresolved | 一直没有解决 | 这个问题已经＿＿好几年了。 | 搁置
一拖再拖 | yì tuō zài tuō | to put off again and again | 一次又一次地拖延 | 工程＿＿，原定去年完工，到现在还没修好。
议而不决 | yì ér bù jué | to discuss without deciding | 讨论了却没有做出决定 | 会开了三次，可是＿＿，大家都很着急。
当机立断 | dāng jī lì duàn | to decide promptly | 抓住时机，马上做出决定 | 情况紧急，他＿＿，让所有人马上离开大楼。
拍板 | pāi bǎn | to make the final decision | 负责的人做出决定 | 这件事最后还得由校长来＿＿。 | 定夺
定夺 | dìng duó | to decide | 决定可以还是不可以 | 这两个方案各有好处，请领导＿＿。
否决 | fǒu jué | to veto, to vote down | 不同意，推翻 | 这个提案在会上被大多数人＿＿了。
从长计议 | cóng cháng jì yì | to take time to think it over | 慢慢地商量，不急于决定 | 这件事很复杂，不能马上决定，我们还是＿＿吧。
`,
  },
  {
    theme: ["Duty and Oversight", "职守和监督"],
    data: `
弹劾 | tán hé | to impeach | 议会等对违法的高级官员提出控告 | 在一些国家，议会可以＿＿违法的总统。
问责 | wèn zé | to hold accountable | 追究责任 | 事故发生后，有关负责人被＿＿。
巡视 | xún shì | to inspect, to make rounds | 到各处察看 | 校长每天早上都在校园里＿＿一圈。
秉公办事 | bǐng gōng bàn shì | to act impartially | 按照公正的原则处理事情 | 他当法官三十年，一直＿＿，从不偏向任何一方。
恪守 | kè shǒu | to abide by strictly | 严格遵守 | 医生必须＿＿职业道德，保护病人的隐私。 | 秉持
恪尽职守 | kè jìn zhí shǒu | to do one's duty conscientiously | 认真负责地做好本职工作 | 他在这个岗位上＿＿，三十年没出过一次错。
秉持 | bǐng chí | to uphold | 坚持原则或理念 | 这家医院始终＿＿“病人第一”的理念。
遴选 | lín xuǎn | to select carefully | 慎重地挑选 | 学校从一百多名老师中＿＿出十人参加比赛。
舞弊 | wǔ bì | fraud, malpractice | 用欺骗的方法做违法的事 | 考试中如果发现＿＿，成绩一律作废。
罢免 | bà miǎn | to recall, to remove from office | 撤销选出来的人的职务 | 根据规定，选民可以＿＿不称职的代表。 | 弹劾
`,
  },
  {
    theme: ["Posts", "任免"],
    data: `
任命 | rèn mìng | to appoint | 下命令让某人担任职务 | 他被＿＿为这所大学的校长。
任免 | rèn miǎn | to appoint and dismiss | 任命和免去职务 | 干部的＿＿要按照规定的程序进行。
上任 | shàng rèn | to take office | 开始担任职务 | 新市长＿＿以后，先去了几个老街区走访。 | 就职
就职 | jiù zhí | to assume office | 正式开始担任某个职务 | 新总统在＿＿典礼上发表了讲话。
离任 | lí rèn | to leave one's post | 离开所担任的职务 | 老校长＿＿时，很多学生来送他。
代理 | dài lǐ | to act for; acting | 暂时替别人担任职务 | 校长出国期间，由副校长＿＿校长的工作。
任职 | rèn zhí | to hold a post | 在某个岗位上工作 | 他曾在外交部＿＿二十年。
免职 | miǎn zhí | to dismiss from a post | 免去职务 | 他因为工作严重失职，被＿＿了。
调任 | diào rèn | to be transferred to a new post | 调去担任别的职务 | 他从北京＿＿上海，担任分公司经理。
履新 | lǚ xīn | to take up a new post | 到新的岗位开始工作 | 新任大使下周将正式＿＿。 | 上任 就职
`,
  },
  {
    theme: ["Laws and Pardons", "法令和赦免"],
    data: `
法令 | fǎ lìng | decree, law | 政府发布的法律和命令 | 政府发布了新的＿＿，禁止在公共场所吸烟。
施行 | shī xíng | to put into force | 法令、规章公布以后开始执行 | 这部法律从明年一月一日起＿＿。
废止 | fèi zhǐ | to abolish, to repeal | 取消，不再执行 | 这条过时的规定已经被＿＿了。
颁行 | bān xíng | to promulgate | 公布并施行 | 新的交通法规已经正式＿＿。 | 施行
赦免 | shè miǎn | to pardon | 依法免除或减轻罪犯的刑罚 | 国王＿＿了这名犯人，让他回家与家人团聚。 | 特赦 大赦
特赦 | tè shè | special pardon | 国家对特定的罪犯免除或减轻刑罚 | 在国庆的时候，政府＿＿了一批表现好的犯人。 | 大赦
大赦 | dà shè | general amnesty | 国家对某一时期内的犯人普遍免除或减轻刑罚 | 古代新皇帝登基时，常常宣布＿＿天下。
有法可依 | yǒu fǎ kě yī | to have laws to go by | 做事有法律可以依照 | 这部法律施行以后，保护野生动物就＿＿了。
条文 | tiáo wén | clause, article | 法律、规章里分条的文字 | 这部法律一共有一百多条＿＿。
细则 | xì zé | detailed rules | 有关规章、制度的详细规定 | 新规定公布以后，有关部门还要制定实施＿＿。
`,
  },
  {
    theme: ["Seals and Emblems", "印章和徽章"],
    data: `
国徽 | guó huī | national emblem | 代表一个国家的标志 | 法院大门上方挂着＿＿。
徽章 | huī zhāng | badge | 佩戴在身上、表示身份或纪念的标志 | 运动员们胸前都戴着参加比赛的＿＿。
国歌 | guó gē | national anthem | 代表一个国家的歌曲 | 升旗的时候，全体师生一起唱＿＿。
校徽 | xiào huī | school badge | 学校的标志 | 学生们的校服上都印着＿＿。 | 徽章
会徽 | huì huī | emblem (of an event or society) | 大型活动或组织的标志 | 这届奥运会的＿＿是由一位年轻设计师设计的。 | 徽章
钢印 | gāng yìn | embossing seal | 能在纸上压出凸起图案的印章 | 毕业证书上的照片要盖上学校的＿＿才有效。
印泥 | yìn ní | red ink paste (for seals) | 盖印章时用的红色颜料 | 盖章以前，先在＿＿上按一下。
印鉴 | yìn jiàn | specimen seal | 留在银行等处作为凭证的印章样子 | 去银行取钱时，要盖上与＿＿相同的印章。
签章 | qiān zhāng | signature and seal | 签名和盖章 | 这份合同上要有双方的＿＿才能生效。
戳 | chuō | to poke; a stamp | 用尖的东西刺；印章 | 他用手指＿＿了一下我的肩膀。
`,
  },
  {
    theme: ["Mediation", "斡旋和调停"],
    data: `
斡旋 | wò xuán | to mediate | 从中调解，使双方关系缓和 | 经过第三国的＿＿，两国重新坐到了谈判桌前。 | 调停
调停 | tiáo tíng | to mediate, to arbitrate | 劝说双方停止争执 | 两家邻居吵了起来，居委会主任出面＿＿。
协定 | xié dìng | agreement, accord | 双方或多方经过谈判签订的约定 | 两国签订了贸易＿＿，降低了很多商品的关税。
照会 | zhào huì | diplomatic note | 一国政府给另一国政府的正式外交信件 | 外交部向对方发出＿＿，表示了自己的立场。
多边 | duō biān | multilateral | 三个或更多的方面 | 这次会议是一次＿＿会谈，二十多个国家参加了。
中间人 | zhōng jiān rén | intermediary | 在两方之间介绍或调解的人 | 双方不愿意直接见面，就请了一位＿＿来传话。
冰释前嫌 | bīng shì qián xián | to bury the hatchet | 像冰融化一样消除以前的怨恨 | 经过一次长谈，两位老朋友终于＿＿，又像以前一样好了。
停火 | tíng huǒ | ceasefire | 停止交战 | 双方同意从明天开始＿＿，进行和平谈判。
求同存异 | qiú tóng cún yì | to seek common ground | 找出共同点，保留不同意见 | 双方本着＿＿的精神，达成了协议。 | 各让一步
各让一步 | gè ràng yí bù | each side gives a little | 双方都做出一些让步 | 只要大家＿＿，问题就能解决。
`,
  },
  {
    theme: ["Forms", "填表"],
    data: `
表格 | biǎo gé | form, table | 按项目画成格子、用来填写的纸或文件 | 请把这张＿＿填好，交到二号窗口。
勾选 | gōu xuǎn | to tick (an option) | 在要选的项目上打上记号 | 请在你同意的选项前面＿＿。 | 打勾
打勾 | dǎ gōu | to put a tick | 画一个“√”形的记号 | 老师在做对的题目后面＿＿，做错的后面画圈。
一栏 | yì lán | a column, a field | 表格中的一格或一列 | 表格的最后＿＿是签名，请不要忘了。
空格 | kòng gé | blank space | 表格或文字中空着的格子 | 这张表上还有几个＿＿没有填。
必填 | bì tián | required (field) | 一定要填的 | 带星号的都是＿＿项，不能空着。 | 选填
选填 | xuǎn tián | optional (field) | 可以填也可以不填的 | 电话号码是＿＿的，你不想写就可以不写。
漏填 | lòu tián | to leave out (on a form) | 应该填的没有填 | 你的表上出生日期＿＿了，请补上。
附件 | fù jiàn | attachment | 随文件或邮件一起送去的材料 | 申请材料请作为邮件的＿＿发送。
如实 | rú shí | truthfully | 按照真实情况 | 请＿＿填写个人信息，不能填假的。
`,
  },
  {
    theme: ["Hidden and Exposed", "遮蔽和揭露"],
    data: `
勾结 | gōu jié | to collude | 为了做坏事暗中互相结合 | 几个商人＿＿起来提高物价，受到了处罚。
蒙蔽 | méng bì | to deceive, to hoodwink | 隐瞒真相，使人上当 | 他被假象＿＿了，没有看出问题。
遮蔽 | zhē bì | to cover, to block from view | 遮挡住 | 高大的树木＿＿了阳光，林子里很凉快。
隐蔽 | yǐn bì | concealed, hidden | 借别的东西遮掩起来 | 这个小村子在山谷深处，位置很＿＿。
戳穿 | chuō chuān | to expose (a lie) | 揭露，说穿 | 他的谎话很快就被＿＿了。
透明 | tòu míng | transparent | 能看透的；公开的 | 政府的财政收支应该公开＿＿，让人民监督。
公开 | gōng kāi | open, public; to make public | 不隐蔽的；使大家都知道 | 这次招聘的结果会在网上＿＿。
暗箱操作 | àn xiāng cāo zuò | under-the-table dealing | 不公开地、私下里处理应该公开的事 | 招标要公开进行，防止＿＿。
真相大白 | zhēn xiàng dà bái | the truth comes out | 事情的真实情况完全清楚了 | 经过调查，事情终于＿＿。
蒙在鼓里 | méng zài gǔ lǐ | kept in the dark | 比喻被瞒着，不知道真实情况 | 大家都知道了，只有他还被＿＿。
`,
  },
  {
    theme: ["Slack and Taut", "张弛"],
    data: `
松弛 | sōng chí | slack, lax | 不紧张，不严格 | 运动以后，全身的肌肉都＿＿下来了。
废弛 | fèi chí | to fall into neglect | 制度等因为不执行而失去作用 | 工厂的管理制度长期＿＿，机器坏了也没有人修。
一张一弛 | yì zhāng yì chí | alternation of work and rest | 比喻工作和休息合理安排 | 学习要＿＿，光学习不休息，效率反而不高。
张弛有度 | zhāng chí yǒu dù | to strike a balance | 紧张和放松安排得恰当 | 这位导演讲故事＿＿，影片节奏非常好。 | 一张一弛
阻挠 | zǔ náo | to obstruct | 阻止，故意设法使不能顺利进行 | 他们想尽办法＿＿这项工程，可是没有成功。
挠头 | náo tóu | to scratch one's head; troublesome | 用手指抓头，形容事情难办 | 这道题真让人＿＿，我想了一个小时也没想出来。
收紧 | shōu jǐn | to tighten | 使变紧，变严 | 由于物价上涨，政府开始＿＿贷款政策。 | 放宽
放宽 | fàng kuān | to relax (rules) | 使要求、限制变宽松 | 学校＿＿了报名的年龄限制，十岁的孩子也可以参加了。
闭塞 | bì sè | cut off; ill-informed | 交通不便，消息不灵通 | 以前这个山村交通＿＿，很少有外人来。 | 堵塞
堵塞 | dǔ sè | to block up | 阻塞，使不通 | 下水道被树叶＿＿了，雨水流不出去。
`,
  },
  {
    theme: ["Local Government", "地方行政"],
    data: `
直辖市 | zhí xiá shì | municipality (directly governed) | 由中央政府直接管理的城市 | 中国有四个＿＿：北京、天津、上海和重庆。
自治区 | zì zhì qū | autonomous region | 少数民族聚居、实行区域自治的省一级行政区 | 中国有五个＿＿，比如西藏和新疆。
特区 | tè qū | special zone | 实行特殊政策的地区 | 中国最早设立的经济＿＿有四个，都在南方沿海。
乡镇 | xiāng zhèn | townships and towns | 乡和镇，县以下的行政区 | 这条公路通到了县里所有的＿＿。
村委会 | cūn wěi huì | village committee | 村民选出来管理村里事务的组织 | 修路的事，＿＿召开村民大会讨论决定。
县长 | xiàn zhǎng | county head | 一个县的行政负责人 | 新来的＿＿走遍了全县的每一个乡镇。
首府 | shǒu fǔ | capital (of a region) | 自治区或州等的政府所在地 | 呼和浩特是内蒙古自治区的＿＿。
市政 | shì zhèng | municipal administration | 城市的行政管理工作和公共设施 | 修路、供水和路灯都属于＿＿工程。
区划 | qū huà | zoning, division | 区域的划分 | 根据新的行政＿＿，这两个县合并成了一个区。
地级市 | dì jí shì | prefecture-level city | 行政地位相当于地区一级的城市 | 这个＿＿下面管着三个县和两个区。 | 直辖市
`,
  },
  // Unit 12: Finance and Markets.
  {
    theme: ["Credit and Pawning", "赊账和典当"],
    data: `
赊账 | shē zhàng | to buy on credit | 买东西时先记账，以后再付钱 | 以前村里的小店允许熟人＿＿，到月底再一起付钱。 | 赊购
赊购 | shē gòu | to purchase on credit | 用赊账的方式购买 | 这家工厂向供应商＿＿了一批原料，约定三个月后付款。
赎回 | shú huí | to redeem | 用钱把抵押的东西换回来 | 他攒够了钱，终于把当掉的手表＿＿了。
借据 | jiè jù | IOU, receipt for a loan | 借钱或借东西时写的凭证 | 借钱给别人时，最好让对方写一张＿＿。
借贷 | jiè dài | to borrow or lend money | 借钱或者把钱借给别人 | 银行的主要业务之一就是＿＿。
还清 | huán qīng | to pay off | 全部还完 | 他工作了十年，终于＿＿了买房子的贷款。
本息 | běn xī | principal and interest | 本金和利息 | 这笔贷款三年后要连＿＿一起还给银行。
分期付款 | fēn qī fù kuǎn | to pay in instalments | 把钱分成几次付清 | 这台电脑可以＿＿，每个月付三百元，一年付完。
典当 | diǎn dàng | to pawn | 把东西押给当铺换钱 | 他急需用钱，只好把祖传的手表拿去＿＿。
当铺 | dàng pù | pawnshop | 收东西作抵押、借钱给人的店 | 以前人们缺钱时，常常把值钱的东西送到＿＿换钱。
`,
  },
  {
    theme: ["Short of Money, Flush with Money", "手头紧和手头宽"],
    data: `
拮据 | jié jū | short of money | 缺少钱，经济困难 | 那几年家里经济＿＿，他只好一边上学一边打工。 | 窘迫 手头紧
窘迫 | jiǒng pò | in straits; embarrassed | 非常穷困；十分为难 | 被大家看着，他一时说不出话来，样子十分＿＿。
阔绰 | kuò chuò | lavish, free-spending | 花钱多，排场大 | 他出手很＿＿，一顿饭就花了好几千元。
手头紧 | shǒu tóu jǐn | short of cash | 暂时缺少钱 | 这个月＿＿，等发了工资再买新手机吧。
入不敷出 | rù bù fū chū | to spend more than one earns | 收入不够支出 | 他每个月花的比挣的多，常常＿＿。 | 手头紧
节衣缩食 | jié yī suō shí | to scrimp and save | 省吃省穿，非常节省 | 父母＿＿，把钱都用在了孩子的教育上。
挥金如土 | huī jīn rú tǔ | to spend money like water | 花钱像撒土一样，形容非常浪费 | 他中了大奖以后＿＿，没过两年就把钱花光了。
腰包 | yāo bāo | purse, pocket | 钱包，也指个人的钱 | 这次聚会的钱，都是从他自己的＿＿里出的。
慷慨解囊 | kāng kǎi jiě náng | to give generously | 大方地拿出钱来帮助别人 | 听说那个孩子病了，邻居们纷纷＿＿。
一贫如洗 | yì pín rú xǐ | penniless | 穷得什么都没有 | 一场大火烧掉了他的房子，他一下子变得＿＿。
`,
  },
  {
    theme: ["Hawking and Sales", "叫卖和甩卖"],
    data: `
甩卖 | shuǎi mài | to sell off cheaply | 降低价钱大量出售 | 这家商店要关门了，所有商品都在半价＿＿。 | 清仓
吆喝 | yāo he | to cry one's wares | 大声叫卖 | 卖菜的老人推着车，在街上一边走一边＿＿。 | 叫卖
兜售 | dōu shòu | to peddle | 到处找人推销 | 有人在车站门口向游客＿＿假手表。
叫卖 | jiào mài | to hawk | 大声招呼人来买 | 早上，菜市场里到处都是＿＿声。
清仓 | qīng cāng | clearance | 把仓库里的货全部卖掉 | 冬天快过去了，商店开始＿＿处理冬天的衣服。
薄利多销 | bó lì duō xiāo | small profits, quick returns | 每件赚得少，但卖得多 | 这家小店靠＿＿，生意越做越大。
跳楼价 | tiào lóu jià | rock-bottom price | 低得不能再低的价钱 | 商店门口写着：“全场＿＿，一件十元！”
大减价 | dà jiǎn jià | big sale | 价钱大幅度降低 | 年底商场＿＿，很多东西都打五折。 | 甩卖
摆摊 | bǎi tān | to set up a stall | 在路边摆放货物出售 | 他每天晚上在夜市＿＿卖小吃。
货真价实 | huò zhēn jià shí | genuine goods at a fair price | 货物不是假的，价钱也公道 | 这家老店的东西＿＿，几十年来一直很受欢迎。
`,
  },
  {
    theme: ["Pooling Money and Relief", "凑钱和赈灾"],
    data: `
凑钱 | còu qián | to pool money | 大家把钱放在一起 | 同学们＿＿给生病的老师买了一束花。 | 凑份子
集资 | jí zī | to raise funds | 从很多人那里筹集钱 | 村民们＿＿修了一座新桥。 | 众筹
众筹 | zhòng chóu | crowdfunding | 通过网络向很多人募集钱 | 他在网上发起＿＿，为自己的新电影筹到了一百万元。
赈灾 | zhèn zāi | disaster relief | 救济受灾的人 | 地震发生后，政府马上拨款＿＿。 | 赈济
赈济 | zhèn jì | to relieve, to aid | 用钱或物资救济 | 古代遇到灾荒，朝廷常常开仓＿＿百姓。
义卖 | yì mài | charity sale | 把卖东西得来的钱用于公益 | 学校举办了一场＿＿活动，卖书得到的钱都捐给了山区小学。
善款 | shàn kuǎn | charitable donations | 用于慈善的钱 | 这些＿＿将全部用来帮助受灾的群众。
救济金 | jiù jì jīn | relief payment | 发给生活困难的人的钱 | 失业以后，他每个月可以领一些＿＿。
认捐 | rèn juān | to pledge (a donation) | 答应捐出一定数量的钱或物 | 在会上，好几家企业当场＿＿了一百万元。
凑份子 | còu fèn zi | to chip in (for a gift) | 大家一起出钱送礼或办事 | 同事结婚，我们几个＿＿给他买了一份礼物。
`,
  },
  {
    theme: ["Currencies", "外币"],
    data: `
英镑 | yīng bàng | pound sterling | 英国的货币 | 在英国买东西要用＿＿。
卢布 | lú bù | rouble | 俄罗斯的货币 | 去莫斯科旅游，要先把钱换成＿＿。
泰铢 | tài zhū | baht | 泰国的货币 | 在泰国街头吃一碗面，大约要五十＿＿。
美金 | měi jīn | US dollar (informal) | 美元 | 在美国买东西用美元，人们也常常把美元叫作＿＿。
港币 | gǎng bì | Hong Kong dollar | 香港的货币 | 在香港坐地铁要用＿＿。
汇价 | huì jià | exchange rate | 一种货币兑换另一种货币的价格 | 最近欧元的＿＿一直在上涨。
换汇 | huàn huì | to exchange currency | 用本国货币换外国货币 | 出国留学以前，他先到银行＿＿。
本币 | běn bì | local currency | 本国的货币 | 这个国家的＿＿贬值以后，进口商品都变贵了。
硬通货 | yìng tōng huò | hard currency | 价值稳定、在国际上容易兑换的货币 | 在国际贸易中，美元一直是重要的＿＿。
保值 | bǎo zhí | to preserve value | 保持价值不降低 | 很多人买黄金是为了＿＿。
`,
  },
  {
    theme: ["Amounts and Receipts", "大写和票据"],
    data: `
贰 | èr | two (in formal writing) | “二”的大写 | 支票上的金额要写大写，“二”要写成“＿＿”。
叁 | sān | three (in formal writing) | “三”的大写 | 写收据时，“三十元”要写成“＿＿拾元”。
肆 | sì | four (in formal writing) | “四”的大写 | 发票上的“＿＿”，就是数字“四”。
大写 | dà xiě | formal numerals | 为了防止涂改而用的笔画多的汉字数字 | 银行的单据上，金额要用＿＿数字写，防止别人涂改。 | 小写
小写 | xiǎo xiě | ordinary numerals | 一般写法的数字 | 支票上要同时写上金额的大写和＿＿。
票据 | piào jù | bill, voucher | 支票、发票、收据等凭证的总称 | 出差回来以后，要把所有＿＿交给财务部门。
开票 | kāi piào | to issue an invoice | 开出发票 | 买东西时如果需要发票，可以请商店＿＿。
报销 | bào xiāo | to claim reimbursement | 用单据领回为公事花的钱 | 出差的车费和住宿费都可以＿＿。
入账 | rù zhàng | to enter into the accounts | 把收入或支出记到账上 | 这笔钱已经＿＿，你可以在账户里查到。
零头 | líng tóu | odd amount | 整数以外的零碎数目 | 一共一百零三元，老板把＿＿去掉了，只收一百元。
`,
  },
  {
    theme: ["Ports and Warehouses", "商埠和货栈"],
    data: `
货栈 | huò zhàn | warehouse | 存放货物的地方 | 河边有一排老＿＿，以前是商人存放货物的地方。
商埠 | shāng bù | trading port | 古代与外国通商的城市 | 这座城市一百多年前就是有名的＿＿，外国商船来来往往。 | 口岸
开埠 | kāi bù | to open (a port) to trade | 开放为通商口岸 | 上海＿＿以后，很快发展成了中国最大的城市。
口岸 | kǒu àn | port of entry | 可以进出国境的港口或地点 | 这个边境＿＿每天有几千辆货车通过。
栈桥 | zhàn qiáo | pier, jetty | 伸进水里、供上下船用的桥 | 青岛的＿＿伸进海里四百多米，是这座城市的标志之一。
客栈 | kè zhàn | inn | 旧时供客商住宿的地方 | 古镇上有一家老＿＿，现在还接待游客。
转口 | zhuǎn kǒu | entrepôt, re-export | 货物运到一个港口再转运到别的地方 | 新加坡的＿＿贸易非常发达。
通关 | tōng guān | to clear customs | 货物或人员经过海关检查放行 | 有了新系统，货物一个小时就能＿＿。
驳船 | bó chuán | barge | 在河道或港口里运货的平底船 | 一艘艘＿＿把货物从大船运到岸上。
中转站 | zhōng zhuǎn zhàn | transfer station | 货物或旅客转运的地方 | 这个港口是亚洲重要的货物＿＿。 | 转口
`,
  },
  {
    theme: ["Weights and Haggling", "斤两和掂量"],
    data: `
斤 | jīn | jin (half a kilogram) | 重量单位，五百克 | 一＿＿苹果是五百克。
斤斤计较 | jīn jīn jì jiào | to haggle over every ounce | 对很小的事情也过分地计较 | 朋友之间不要为了一点小钱＿＿。
掂量 | diān liang | to weigh in the hand; to consider | 用手估计轻重；考虑 | 他把西瓜拿在手里＿＿了一下，说：“这个大约有十斤。”
公斤 | gōng jīn | kilogram | 重量单位，一千克 | 这袋米重十＿＿。
半斤八两 | bàn jīn bā liǎng | six of one and half a dozen of the other | 比喻两个人一样，不相上下 | 他们俩的成绩＿＿，谁也不比谁好多少。
缺斤短两 | quē jīn duǎn liǎng | to give short weight | 卖东西时少给分量 | 市场管理人员检查了每个摊位，防止有人＿＿。
称重 | chēng zhòng | to weigh | 用秤称出重量 | 水果要先＿＿，再到收银台付钱。
毛重 | máo zhòng | gross weight | 货物连同包装的重量 | 这箱货的＿＿是二十公斤，净重是十八公斤。 | 净重
净重 | jìng zhòng | net weight | 去掉包装以后货物本身的重量 | 这袋饼干的＿＿是五百克，不包括袋子的重量。
一分钱一分货 | yì fēn qián yì fēn huò | you get what you pay for | 价钱高，东西就好 | 这件衣服虽然贵，但是质量很好，真是＿＿。
`,
  },
  {
    theme: ["Market Moves", "行情"],
    data: `
飙升 | biāo shēng | to soar | 急速上升 | 夏天一到，空调的销量就＿＿。 | 暴涨
暴涨 | bào zhǎng | to rise sharply | 价格等突然大幅度上涨 | 因为天气干旱，粮食价格＿＿。 | 飙升 暴跌
暴跌 | bào diē | to plunge | 价格等突然大幅度下降 | 消息传出后，这家公司的股价＿＿了一半。
行情 | háng qíng | market conditions | 市场上商品的价格和变化情况 | 最近蔬菜的＿＿不太好，农民卖不出好价钱。
涨幅 | zhǎng fú | size of a rise | 上涨的幅度 | 今年房价的＿＿比去年小。 | 跌幅
跌幅 | diē fú | size of a fall | 下跌的幅度 | 这只股票今天下跌了百分之五，是今年＿＿最大的一天。
回落 | huí luò | to fall back | 上升以后又下降 | 油价上涨了一个月，最近开始＿＿。
走势 | zǒu shì | trend | 发展的方向 | 专家认为，明年的房价＿＿会比较平稳。
萎靡不振 | wěi mǐ bú zhèn | listless, in the doldrums | 精神不好，没有活力 | 市场＿＿，很多商店的生意都不好。
增值 | zēng zhí | to appreciate, to add value | 价值增加 | 这套房子买了十年，已经＿＿了很多。
`,
  },
  {
    theme: ["The Stock Market", "股市"],
    data: `
散户 | sǎn hù | retail investor | 资金少、个人买卖股票的投资者 | 和大机构相比，＿＿的资金少，消息也不灵通。
熊市 | xióng shì | bear market | 价格长期下跌的市场 | 在＿＿里，大部分股票的价格都在下跌。
大盘 | dà pán | overall market (index) | 整个股票市场的总体情况 | 今天＿＿上涨了两个百分点。
开盘 | kāi pán | to open (of a market) | 交易所开始一天的交易 | 早上九点半股市＿＿。 | 收盘
收盘 | shōu pán | to close (of a market) | 交易所结束一天的交易 | 到下午三点＿＿时，这只股票还是涨了。
涨停 | zhǎng tíng | to hit the daily up limit | 股价一天里上涨到规定的最高限度 | 好消息一出，这只股票一开盘就＿＿了。 | 跌停
跌停 | diē tíng | to hit the daily down limit | 股价一天里下跌到规定的最低限度 | 公司出了问题，股价连续三天＿＿。
抄底 | chāo dǐ | to buy at the bottom | 在价格最低的时候买进 | 他想在股价最低的时候＿＿，结果股价还在继续往下跌。
套牢 | tào láo | to be stuck with a loss | 买进以后价格下跌，卖出就会亏本 | 他高价买的股票被＿＿了，一直舍不得卖。
市值 | shì zhí | market value | 按市场价格计算的总价值 | 这家公司的＿＿一年里翻了一番。
`,
  },
  {
    theme: ["Speculation", "投机"],
    data: `
揣测 | chuǎi cè | to conjecture | 推测，猜测 | 人们纷纷＿＿明年的经济会怎么样。 | 揣摩
揣摩 | chuǎi mó | to try to figure out | 反复思考，仔细体会 | 演员要仔细＿＿角色的心理。
大鳄 | dà è | tycoon, financial predator | 比喻实力很强的大投资者 | 这些金融＿＿手里有大量资金，能影响整个市场。
投机 | tóu jī | to speculate | 利用价格变化，想用买卖来获取利润 | 他买房子不是为了住，而是为了＿＿赚钱。
割肉 | gē ròu | to sell at a loss | 低价卖出亏本的股票 | 股价一跌再跌，他只好＿＿卖出。
炒股 | chǎo gǔ | to trade in stocks | 买卖股票赚取差价 | 他不懂＿＿，却把全部积蓄都投进了股市，结果亏了很多。
观望 | guān wàng | to wait and see | 不急于行动，看看情况再说 | 现在房价不稳定，很多人还在＿＿。
跟风 | gēn fēng | to follow the trend | 看别人怎么做就跟着做 | 别人买什么他就买什么，完全是盲目＿＿。
庄家 | zhuāng jiā | market manipulator, banker | 资金大、能操纵价格的人 | 有的＿＿先用大量资金把股价推高，再高价卖出。
追涨 | zhuī zhǎng | to chase a rising price | 价格上涨时跟着买进 | 他看到股价上涨就＿＿买进，没想到第二天就跌了。 | 跟风
`,
  },
  {
    theme: ["Ill-gotten Gains", "不义之财"],
    data: `
敛财 | liǎn cái | to amass wealth (improperly) | 用不正当的手段聚集钱财 | 那个骗子借着办慈善的名义＿＿，最后受到了法律的惩罚。 | 聚敛
聚敛 | jù liǎn | to amass by exploitation | 用重税等手段搜刮钱财 | 古代有些官员用各种名义向百姓＿＿钱财。
捞钱 | lāo qián | to rake in money (improperly) | 用不正当的方法得到钱 | 他当官不是为了做事，而是为了＿＿。 | 敛财
榨取 | zhà qǔ | to squeeze, to extort | 用压迫的手段取得 | 那个工厂主用低工资＿＿工人的血汗。 | 压榨
压榨 | yā zhà | to press; to exploit | 用力压出汁；剥削 | 这台机器专门用来＿＿花生，做成花生油。
暴利 | bào lì | huge profits | 用不正当手段在短时间里得到的大量利润 | 这些假药成本很低，卖假药的人从中获得了＿＿。
不义之财 | bú yì zhī cái | ill-gotten gains | 用不正当手段得到的钱财 | 他从来不拿＿＿，一辈子清清白白。
坐收渔利 | zuò shōu yú lì | to profit from others' quarrel | 利用别人的矛盾得到好处 | 两家公司争得两败俱伤，第三家公司却＿＿。
中饱私囊 | zhōng bǎo sī náng | to line one's pockets | 把经手的钱财非法地放进自己的口袋 | 他利用职务把公款＿＿，最后被判了刑。
大肆 | dà sì | wantonly | 毫无顾忌地 | 这家公司＿＿宣传自己的产品，可是质量并不好。
`,
  },
  {
    theme: ["Enforcement", "查处"],
    data: `
缉私 | jī sī | to combat smuggling | 搜查和打击走私 | 海关的＿＿船在海上巡逻，检查过往的船只。
通缉 | tōng jī | to put out a wanted notice | 公安机关通告各地捉拿在逃的犯人 | 警察在全国发布了对这名逃犯的＿＿令。
洗钱 | xǐ qián | to launder money | 把非法得来的钱通过各种方式变成表面合法的钱 | 银行必须报告可疑的大额交易，防止有人＿＿。
偷税 | tōu shuì | to evade tax (by deceit) | 用欺骗手段不交或少交税 | 这家公司做假账＿＿，被税务部门罚了款。 | 逃税 漏税
漏税 | lòu shuì | to fail to pay tax | 没有按规定交税 | 有些小商贩不懂税法，常常因为不了解规定而＿＿。
逃税 | táo shuì | to dodge tax | 故意逃避交税 | 他把钱转到国外，想以此＿＿，结果被查出来了。
查封 | chá fēng | to seal up (by authorities) | 检查后贴上封条，禁止使用 | 这家卖假药的商店被有关部门＿＿了。
追缴 | zhuī jiǎo | to recover (money owed) | 命令补交 | 税务部门向这家公司＿＿了三百万元税款。
走私 | zǒu sī | to smuggle | 违反法律偷偷运送货物进出国境 | 海关查获了一批＿＿的手机。
囤积居奇 | tún jī jū qí | to hoard for profit | 把货物大量收藏起来，等价钱高时再卖 | 灾情发生后，有些商人＿＿，把粮价提得很高。
`,
  },
  {
    theme: ["At the Bank", "银行业务"],
    data: `
储户 | chǔ hù | depositor | 在银行存钱的人 | 银行要保护＿＿的存款安全。
销户 | xiāo hù | to close an account | 取消账户 | 这张银行卡很久不用了，他去银行办理了＿＿。
网银 | wǎng yín | online banking | 网上银行 | 现在用＿＿转账，不用去银行排队了。
零存整取 | líng cún zhěng qǔ | regular savings deposit | 每月存一点，到期一次取出 | 她每个月存五百元，办的是＿＿，一年后一起取出来。
自动取款机 | zì dòng qǔ kuǎn jī | cash machine | 能自动取钱的机器 | 晚上银行关门了，他到＿＿取了钱。
存单 | cún dān | certificate of deposit | 银行存款的凭证 | 定期存款到期以后，要带着＿＿和身份证去银行取钱。
挂失 | guà shī | to report a loss | 丢了证件等以后向有关部门登记 | 银行卡丢了，要马上打电话＿＿。
利滚利 | lì gǔn lì | compound interest | 利息又生利息 | 借了这种贷款，＿＿，几年后要还的钱比借的多很多。
网点 | wǎng diǎn | branch, outlet | 分布在各处的营业点 | 这家银行在全市有一百多个＿＿。
存取 | cún qǔ | to deposit and withdraw | 存钱和取钱 | 这张卡可以在全国任何一家分行＿＿现金。
`,
  },
  {
    theme: ["The Economy", "经济形势"],
    data: `
经济危机 | jīng jì wēi jī | economic crisis | 经济生活中突然出现的严重困难 | 一九二九年的＿＿使很多工厂倒闭，大量工人失业。
通货紧缩 | tōng huò jǐn suō | deflation | 物价普遍持续下降 | 发生＿＿的时候，物价不断下降，人们反而不愿意花钱。
经济周期 | jīng jì zhōu qī | business cycle | 经济从繁荣到衰退再到复苏的循环 | 繁荣、衰退、萧条、复苏，是一个完整的＿＿。
内需 | nèi xū | domestic demand | 国内的需求 | 政府希望通过扩大＿＿，让国内的人多消费。 | 外需
外需 | wài xū | foreign demand | 外国对本国商品的需求 | 由于＿＿减少，很多出口工厂的订单少了。
拉动 | lā dòng | to drive, to boost | 带动，使增长 | 旅游业的发展＿＿了当地经济。
供过于求 | gōng guò yú qiú | supply exceeds demand | 供应的多，需要的少 | 今年苹果大丰收，市场上＿＿，价格下降了。
过热 | guò rè | overheating | 经济增长太快，超过了正常水平 | 为了防止经济＿＿，政府提高了贷款利率。
软着陆 | ruǎn zhuó lù | soft landing | 经济平稳地放慢速度，没有引起大的震动 | 政府希望经济增长的速度慢慢降下来，实现＿＿。
降息 | jiàng xī | to cut interest rates | 降低利率 | 中央银行宣布＿＿，鼓励企业借钱发展。
`,
  },
];
