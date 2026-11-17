// The third quarter of level 7 (docs/chinese-curriculum.md §8.3): units 7 to 9, history, thought and belief, and
// literature and writing, 90 characters in 9 batches and 470 words in 47 batches. The characters are new to levels 1 to
// 6 and to the first two quarters, chosen from the commonest third of GF 0025-2021's advanced band for what each unit's
// words need; the words and sentences use only the characters of levels 1 to 6 and those taught so far.
//
// A character line as in level 6 (../level-6/character-data-a.ts); a word line as in level 6 (../level-6/word-data-a.ts).

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches3 are the 9 character batches of units 7 to 9 of level 7, in teaching order. */
export const characterBatches3: readonly string[] = [
  // Unit 7: History.
  `
君 jūn | monarch; gentleman | 古代国家的最高统治者；有道德的人 | 群郡
臣 chén | minister (of a monarch) | 古代在皇帝手下做官的人 | 巨卧 | 吏
侯 hóu | marquis, feudal lord | 古代贵族的一种等级；做官的人 | 候喉
诸 zhū | all, various | 许多，各个 | 储猪
宰 zǎi | to govern; to slaughter (animals) | 主管，掌管；把牲口杀了做肉 | 辛宇
廷 tíng | royal court | 皇帝处理国家大事的地方 | 延庭
御 yù | imperial; to resist | 跟皇帝有关的；抵挡 | 卸彻
旨 zhǐ | purport; imperial decree | 主要的意思；皇帝的命令 | 指脂
爵 jué | title of nobility | 古代贵族的等级称号 | 嚼爰
吏 lì | petty official | 古代的小官 | 史更 | 臣
`,
  `
奴 nú | slave | 失去自由、被人当作财产的人 | 努怒 | 隶
隶 lì | slave; to be subordinate to | 被人管着、干苦活的人；属于 | 肃录 | 奴
霸 bà | overlord; to dominate | 古代诸侯的首领；依靠力量控制别人 | 露霉
邦 bāng | state, nation | 国家 | 帮绑
割 gē | to cut; to cede | 用刀切开；把一部分分出去给别人 | 害刮
役 yì | labour service; campaign | 古代百姓必须给国家干的活；战事 | 投没 | 仗
仗 zhàng | battle; to rely on | 战争；依靠 | 杖伏 | 役
舰 jiàn | warship | 军队用的大船 | 舱航
辱 rǔ | disgrace | 使人丢脸 | 唇褥
颁 bān | to issue, to award | 由上级正式发出、发给 | 颂领
`,
  `
掘 jué | to dig | 用工具往下挖 | 握屈
拓 tuò/tà | to open up; to make rubbings | 开辟，扩大；把刻在石头上的字印到纸上 | 括托
鼎 dǐng | ancient tripod cauldron | 古代煮东西、祭祀用的器物，多是三条腿 | 鼻晶
铭 míng | inscription; to engrave on the mind | 刻在器物上的文字；牢牢记住 | 名铜
俑 yǒng | tomb figurine | 古代放进墓里的人形泥像或木像 | 涌勇
诞 dàn | birth; absurd | 出生；荒唐，不合情理 | 延涎
氏 shì | family name, clan | 姓；古代同一祖先的一支 | 民纸
祠 cí | ancestral temple | 祭祀祖先或名人的房子 | 词伺
祀 sì | to offer sacrifice | 拜神或祖先 | 祝杞
溯 sù | to trace back | 往上推求事情的来源 | 塑朔
`,
  // Unit 8: Thought and Belief.
  `
唯 wéi | only; yes | 只；答应的声音 | 谁维
伦 lún | human relationships; order | 人与人之间的关系和道理；次序 | 论轮
悖 bèi | contrary to | 违反，相冲突 | 勃脖
畴 chóu | category | 种类，范围 | 筹涛
妄 wàng | absurd; rash | 不合实际的；随便，胡乱 | 忘妥
欲 yù | desire | 想要得到的心情 | 浴俗
恕 shù | to forgive; considerateness | 原谅；用自己的心去体会别人的心 | 怒忽
逊 xùn | modest; inferior | 谦虚；比不上 | 孙迅
邪 xié | evil, heretical | 不正当的 | 那雅
诡 guǐ | deceitful; strange | 欺骗人的；奇怪 | 跪危
`,
  `
崇 chóng | lofty; to esteem | 高；看重，尊敬 | 祟宗
虔 qián | pious | 恭敬而有诚心 | 虎虑
祈 qí | to pray for; to ask for | 向神请求；希望 | 祁析 | 祷
祷 dǎo | to pray | 向神说话求保佑 | 涛寿 | 祈
僧 sēng | Buddhist monk | 出家修行的男佛教徒 | 增憎
尼 ní | Buddhist nun; used for sounds | 出家修行的女佛教徒；用来译音的字 | 泥呢
禅 chán/shàn | Chan (Zen); meditation | 佛教的一个宗派；安静地思考 | 弹蝉
伊 yī | he, she (in old texts); used for sounds | 古文里指他或她；译音用的字 | 尹伪
兰 lán | orchid | 一种开香花的草 | 兴半
戒 jiè | to guard against; to give up; precept | 防备；改掉不好的习惯；宗教规定不许做的事 | 戎械
`,
  `
魂 hún | soul | 古人认为能离开身体存在的精神；精神 | 魁魅 | 魄
魄 pò | spirit; vigour | 依附身体的精神；胆量和气力 | 魁拍 | 魂
鬼 guǐ | ghost | 传说中人死后变成的东西 | 瑰愧
仙 xiān | immortal | 神话里长生不老、有本领的人 | 山仁
卜 bǔ | to divine | 古代用火烧龟甲来推测吉凶 | 卞下 | 占
占 zhàn/zhān | to occupy; to divine | 用力量取得、拥有；推测吉凶 | 点站 | 卜
兆 zhào | omen; million | 事情发生前的迹象；一百万 | 挑桃
凶 xiōng | ominous; fierce | 不吉利；样子可怕，很厉害 | 区凸
祸 huò | disaster | 灾难 | 锅窝
讳 huì | to avoid as taboo | 因为怕或者不喜欢而不说、避开 | 伟韦
`,
  // Unit 9: Literature and Writing.
  `
吟 yín | to chant | 有节奏地读诗；叹息 | 吹含 | 咏
咏 yǒng | to sing of (in verse) | 用诗歌来叙述；拉长声音念 | 泳味 | 吟
颂 sòng | to praise; ode | 称赞；赞美的文章或诗 | 颁讼
韵 yùn | rhyme; charm | 诗句末尾读音相同的部分；风度，味道 | 均韶
骚 sāo | to disturb; poetry of the Chu style | 扰乱；指楚辞一类的诗 | 蚤搔
婉 wǎn | tactful, gentle | 说话温和，不直接；柔美 | 碗腕
朦 méng | dim | 看不清楚 | 蒙檬 | 胧
胧 lóng | hazy (moonlight) | 月光不明 | 拢笼 | 朦
蕴 yùn | to contain, to hold in store | 包含，藏在里面 | 温酝
柳 liǔ | willow | 一种枝条细长、向下垂的树 | 柯聊
`,
  `
撰 zhuàn | to write, to compose | 写文章，编书 | 选馔
誊 téng | to copy out | 照着原来的稿子抄写 | 誉腾 | 摹
摹 mó | to copy, to imitate | 照着样子写或画 | 幕暮 | 誊
衬 chèn | to set off; lining | 在下面或旁边放上别的东西，让主要的更突出 | 衫村
伏 fú | to lie face down; to hide | 身体向前靠在东西上；藏起来 | 状伙
讥 jī | to mock | 用尖刻的话指出别人的错处 | 饥机
渲 xuàn | to wash with colour | 国画用水墨或颜色涂抹出明暗 | 宣喧
幅 fú | width; (measure word for pictures) | 布的宽度；画、字的数量词 | 副福
抒 shū | to express (feelings) | 把心里的感情说出来或写出来 | 舒纾
眉 méi | eyebrow; top margin of a page | 眼睛上面的毛；书页上面空白的地方 | 盾媚
`,
  `
吾 wú | I, my (classical) | 古文里指我，我的 | 语五
矣 yǐ | (classical final particle) | 古文里用在句子末尾的字，像“了” | 埃唉
乃 nǎi | to be; then (classical) | 是，就是；于是，才 | 及仍
曰 yuē | to say (classical) | 说 | 日白
岂 qǐ | how could (rhetorical) | 难道，哪里，表示反问 | 凯山
亦 yì | also (classical) | 也 | 赤变
彼 bǐ | that; the other | 那，那个；对方 | 披被
辛 xīn | hot (taste); toilsome | 辣；苦，累 | 幸辞
苏 sū | to revive; Jiangsu, Suzhou | 从昏迷中醒过来；中国江南的一个省、一座城市的简称 | 办芬
渊 yuān | deep pool; profound | 深水；深 | 测渔
`,
];

/** wordBatches3 are the 47 word batches of units 7 to 9 of level 7, in teaching order. */
export const wordBatches3: readonly LevelWordBatch[] = [
  // Unit 7: History.
  {
    theme: ["Rulers and the Court", "君主和朝廷"],
    data: `
君主 | jūn zhǔ | monarch | 古代国家的最高统治者，比如皇帝、国王 | 在古代，很多国家由＿＿统治，他的话就是法律。 | 天子
天子 | tiān zǐ | Son of Heaven | 古代对皇帝的称呼，意思是上天的儿子 | 古人认为皇帝的权力来自上天，所以叫他“＿＿”。 | 君主
君权 | jūn quán | monarchical power | 君主拥有的权力 | 在古代中国，＿＿很大，皇帝一个人就能决定国家大事。
朝廷 | cháo tíng | imperial court | 皇帝和大臣处理国家大事的地方，也指当时的政府 | 他考中以后，被＿＿派到南方做官。 | 宫廷
宫廷 | gōng tíng | palace | 皇帝和家人住的地方 | 这部电视剧讲的是古代＿＿里的生活，有很多漂亮的衣服。 | 朝廷
圣旨 | shèng zhǐ | imperial edict | 皇帝下的命令 | 官员们站在下面，听人宣读皇帝的＿＿。 | 旨意
旨意 | zhǐ yì | intention, will | 上级的意图 | 他按照老板的＿＿，把会议推迟了一周。 | 圣旨
太子 | tài zǐ | crown prince | 皇帝选定、将来接替他的儿子 | 老皇帝去世以后，由＿＿接着做皇帝。
御医 | yù yī | imperial physician | 给皇帝和宫里的人看病的医生 | 皇帝生病了，宫里马上请来了＿＿。
御花园 | yù huā yuán | imperial garden | 皇宫里的花园 | 故宫北边有一座＿＿，里面有很多古老的树。
`,
  },
  {
    theme: ["Ministers and Officials", "大臣和官吏"],
    data: `
大臣 | dà chén | minister | 君主手下职位高的官 | 皇帝每天早上在朝廷上和＿＿们商量国家大事。 | 臣子
臣子 | chén zǐ | subject (serving a ruler) | 君主手下的官 | 古人认为，＿＿应当对君主忠诚。 | 大臣
臣民 | chén mín | subjects of a monarch | 君主统治下的人民 | 国王命令全国的＿＿都要交税。
宰相 | zǎi xiàng | chancellor | 古代帮助皇帝处理国家大事的最高官员 | 在古代，＿＿的地位只在皇帝一个人之下。
官吏 | guān lì | officials | 古代官员的总称 | 古时候，各地的＿＿负责收税和管理百姓。 | 县官
县官 | xiàn guān | county magistrate | 古代管理一个县的官 | 古代的＿＿除了管理一个县，还要负责审案子。 | 官吏
进士 | jìn shì | jinshi, top graduate | 古代通过最高一级科举考试的人 | 唐朝诗人白居易二十多岁就考中了＿＿。 | 举人
举人 | jǔ rén | juren, provincial graduate | 明清时代通过省里科举考试的人 | 明清时代，考上＿＿以后才能去京城参加更高一级的考试。 | 进士
称臣 | chēng chén | to declare oneself a vassal | 承认自己是别人的臣子，表示服从 | 打了败仗以后，这个小国只好向大国＿＿。 | 臣服
臣服 | chén fú | to submit to | 服从别人的统治 | 周边的一些小国都＿＿于这个强大的帝国。 | 称臣
`,
  },
  {
    theme: ["Nobles and Ranks", "贵族和等级"],
    data: `
贵族 | guì zú | aristocracy | 地位高、享有特权的家族和成员 | 在古代欧洲，＿＿的身份是一代一代传下去的。 | 诸侯
平民 | píng mín | commoner | 没有特权的普通人 | 古代的＿＿没有特权，大多靠种地生活。 | 百姓
百姓 | bǎi xìng | the common people | 普通的人民 | 这位县官很关心＿＿的生活，大家都很尊敬他。 | 平民
诸侯 | zhū hóu | feudal lords | 古代君主分封的各国的统治者 | 周朝把土地分给＿＿，让他们在各自的国家里当国君。
爵位 | jué wèi | rank of nobility | 贵族的等级 | 在英国，一些贵族的＿＿可以传给儿子。
公爵 | gōng jué | duke | 欧洲贵族中等级很高的一种 | 在英国，＿＿是贵族里最高的一级。
侯爵 | hóu jué | marquis | 比公爵低一级的贵族 | 在欧洲的爵位里，＿＿比公爵低一级。
封侯 | fēng hóu | to be made a marquis | 被君主封为侯，得到很高的地位 | 古代很多将军希望立下大功，被君主＿＿。
骑士 | qí shì | knight | 欧洲中世纪骑马打仗、为贵族服务的武士 | 中世纪的欧洲，＿＿穿着很重的铁衣服骑马打仗。
女王 | nǚ wáng | queen regnant | 自己统治国家的女性君主 | 英国历史上有好几位＿＿，她们自己统治国家。
`,
  },
  {
    theme: ["Early Societies", "早期的社会"],
    data: `
奴隶 | nú lì | slave | 没有人身自由、被人当作财产买卖的人 | 在古罗马，＿＿可以被主人买卖，没有自由。 | 农奴
奴隶主 | nú lì zhǔ | slave owner | 拥有奴隶的人 | ＿＿拥有奴隶，让他们干活却不给工钱。
奴隶社会 | nú lì shè huì | slave society | 以奴隶主和奴隶为主要阶级的社会 | 在＿＿里，奴隶被当作财产，没有自由。
农奴 | nóng nú | serf | 依附于土地、给主人种地的农民 | 中世纪的＿＿不能随便离开主人的土地。 | 奴隶
奴役 | nú yì | to enslave | 把人当作奴隶使用 | 被＿＿的人没有自由，干了活也得不到报酬。
原始社会 | yuán shǐ shè huì | primitive society | 人类最早的社会，人们一起劳动、一起分享食物 | 在＿＿里，人们用石头做工具，靠打猎和采集生活。
封建社会 | fēng jiàn shè huì | feudal society | 地主拥有土地、农民给地主种地的社会 | 在＿＿里，大部分土地属于地主和贵族，农民要交很重的租。
封建 | fēng jiàn | feudal; old-fashioned | 君主把土地分给亲属和功臣的制度；思想陈旧 | 他的想法太＿＿了，竟然认为女孩子不用上学。
部落 | bù luò | tribe | 由一些家族组成的集体 | 这个＿＿的人住在森林里，靠打猎生活。 | 氏族
氏族 | shì zú | clan | 原始社会里有共同祖先的人组成的集体 | 一个＿＿的成员有共同的祖先，一起生活，一起劳动。 | 部落
`,
  },
  {
    theme: ["Powers and States", "霸权和邦国"],
    data: `
霸主 | bà zhǔ | hegemon | 古代势力最大、领导各诸侯的人；在某方面最强的 | 春秋时期，几个强大的诸侯国先后成为＿＿。
霸权 | bà quán | hegemony | 依靠强大的力量控制别国的权力 | 有的大国想用＿＿控制别的国家，引起了很多冲突。
称霸 | chēng bà | to dominate | 依靠力量当上首领 | 这支球队连续五年＿＿全国联赛。
霸道 | bà dao | domineering | 不讲道理，用力量欺负人 | 他很＿＿，总是逼别人听他的。
城邦 | chéng bāng | city-state | 以一座城市为中心的小国家 | 古希腊有许多＿＿，雅典是其中最有名的一个。
联邦 | lián bāng | federation | 由几个州或国家联合起来组成的国家 | 美国和德国都是＿＿国家，各个州有自己的法律。
邦交 | bāng jiāo | diplomatic relations | 国家和国家之间的正式关系 | 中国和日本在一九七二年建立了＿＿。
友邦 | yǒu bāng | friendly nation | 关系友好的国家 | 两国一直是＿＿，经常互相帮助。
王国 | wáng guó | kingdom | 以国王为君主的国家 | 很久以前，这里有一个小＿＿，由一位国王统治。
帝国 | dì guó | empire | 统治很大地区、通常有皇帝的国家 | 古罗马＿＿最强大的时候，统治着地中海周围的大片土地。
`,
  },
  {
    theme: ["Land and Treaties", "领土和条约"],
    data: `
割让 | gē ràng | to cede | 被迫把一部分领土给别的国家 | 战争失败以后，这个国家不得不＿＿了一部分土地。 | 割地
割地 | gē dì | to cede territory | 把土地分出去给别国 | 古代一些弱小的国家只能靠＿＿赔款来求和。 | 割让
赔款 | péi kuǎn | indemnity | 战败国给战胜国的钱 | 根据这个条约，战败的一方要支付大量＿＿。
割据 | gē jù | to rule a region apart | 用武力控制一个地方，跟中央对抗 | 唐朝后期，一些地方的军队首领＿＿一方，不听朝廷的命令。
分割 | fēn gē | to divide up | 把整体分开 | 这条大河把城市＿＿成南北两个部分。
屈辱 | qū rǔ | humiliation | 被欺负、丢脸的感受 | 那段被别国欺负的＿＿历史，人们一直没有忘记。 | 耻辱
耻辱 | chǐ rǔ | shame | 名誉上受到的损害 | 考试作弊被发现，对他来说是一种＿＿。 | 屈辱
殖民地 | zhí mín dì | colony | 被别的国家统治、失去主权的地方 | 十九世纪，非洲的大部分地区成了欧洲国家的＿＿。 | 殖民
殖民 | zhí mín | to colonize | 强国派人移居到别的地方并统治那里 | 十五世纪以后，一些欧洲国家开始在世界各地＿＿。 | 殖民地
侵略 | qīn lüè | to invade; aggression | 用武力进入别国，夺取土地和财富 | 这个国家的人民团结起来，抵抗外国的＿＿。
`,
  },
  {
    theme: ["Wars of the Past", "过去的战争"],
    data: `
战役 | zhàn yì | campaign | 一系列有计划的作战 | 赤壁之战是三国时期一场有名的＿＿。
打仗 | dǎ zhàng | to fight a war | 进行战争 | 古代的将军不仅要会＿＿，还要懂得爱护士兵。
胜仗 | shèng zhàng | victory in battle | 打赢的战斗 | 这位将军打了很多＿＿，从来没有输过。
败仗 | bài zhàng | defeat in battle | 打输的战斗 | 打了＿＿以后，他认真总结了失败的原因。
兵役 | bīng yì | military service | 公民参加军队的义务 | 在一些国家，成年男子必须服＿＿。 | 劳役
服役 | fú yì | to be in service | 在军队里工作；机器、船等投入使用 | 这条船已经＿＿了三十年，快要退役了。
劳役 | láo yì | corvée, forced labour | 古代百姓被迫给国家干的没有报酬的活 | 修建长城的时候，很多百姓被叫去服＿＿。 | 兵役
舰队 | jiàn duì | fleet | 由许多军舰组成的队伍 | 明朝时，一支很大的＿＿七次远航，到过非洲东部。
军舰 | jūn jiàn | warship | 军队用的船 | 港口里停着好几条灰色的＿＿。 | 航空母舰
航空母舰 | háng kōng mǔ jiàn | aircraft carrier | 可以让飞机起飞和降落的大型军舰 | ＿＿很大，上面可以停几十架飞机。 | 军舰
`,
  },
  {
    theme: ["Laws and Reforms", "法令和改革"],
    data: `
颁布 | bān bù | to promulgate | 政府正式公布法令 | 国家＿＿了新的法律，下个月开始实行。 | 颁发
颁发 | bān fā | to award, to issue | 正式发给证书、奖品等 | 学校给优秀的学生＿＿了奖状。 | 颁布
颁奖 | bān jiǎng | to present awards | 发给奖品或奖状 | 比赛结束以后，主持人请市长上台＿＿。
变法 | biàn fǎ | political reform | 历史上对国家法令、制度做大的改变 | 战国时期，秦国通过＿＿，变得越来越强大。
宣言 | xuān yán | declaration | 国家、团体公开表明态度的文件 | 一七七六年七月，北美十三个殖民地发表了“独立＿＿”。
宗旨 | zōng zhǐ | aim, purpose | 主要的目的和想法 | 这个组织的＿＿是帮助贫困地区的孩子上学。 | 主旨
主旨 | zhǔ zhǐ | gist | 文章、讲话的主要意思 | 读完这篇文章，请你用一句话说出它的＿＿。 | 宗旨
起义 | qǐ yì | uprising | 被压迫的人民团结起来反抗统治者 | 秦朝末年，很多农民不满朝廷的统治，发动了＿＿。
摄政 | shè zhèng | to act as regent | 君主年纪小时，由别人代他处理国家大事 | 皇帝只有六岁，所以由他的叔叔＿＿。
复辟 | fù bì | restoration (of a deposed ruler) | 被推翻的统治者重新上台 | 清朝灭亡以后，曾经有人想让皇帝＿＿，但很快就失败了。
`,
  },
  {
    theme: ["Digging up the Past", "发掘古代"],
    data: `
发掘 | fā jué | to excavate | 把埋在地下的东西挖出来 | 考古学家在这里＿＿出了一座两千多年前的古墓。
古墓 | gǔ mù | ancient tomb | 古代的坟墓 | 农民在种地的时候，意外发现了一座＿＿。
兵马俑 | bīng mǎ yǒng | Terracotta Army | 秦始皇陵里用陶土做成的士兵和马 | 西安的＿＿个个不一样，表情各不相同。 | 陶俑
陶俑 | táo yǒng | pottery figurine | 用陶土做成的人像，古代放进墓里 | 这座汉代古墓里出土了很多小＿＿，有的在跳舞，有的在弹琴。 | 兵马俑
鼎 | dǐng | ding, bronze cauldron | 古代煮东西、祭祀用的器物，一般有三条腿 | 博物馆里的这只青铜＿＿有三条腿，上面刻着文字。
铭文 | míng wén | inscription | 刻在器物上的文字 | 这件青铜器上的＿＿记录了三千年前的一场战争。
铭刻 | míng kè | to engrave | 刻在器物上；比喻深深记住 | 老师的教导＿＿在我心里，永远不会忘记。 | 铭记
铭记 | míng jì | to keep firmly in mind | 深深地记住 | 我们要＿＿历史，珍惜今天的和平。 | 铭刻
拓片 | tà piàn | rubbing | 把石头或器物上的字和图案印到纸上得到的东西 | 他把这块古碑上的字拓下来，做成了一张＿＿。
墓志铭 | mù zhì míng | epitaph | 刻在墓碑上纪念死者的文字 | 墓碑上刻着一段＿＿，介绍了墓主人的一生。
`,
  },
  {
    theme: ["Records and Sources", "史料和文献"],
    data: `
史书 | shǐ shū | history book | 记载历史的书 | 这件事在古代的＿＿里有清楚的记载。 | 史料 典籍
史料 | shǐ liào | historical materials | 研究历史用的材料 | 为了写这本书，他查阅了大量＿＿。 | 史书 文献
史记 | shǐ jì | Records of the Grand Historian | 西汉司马迁写的一部历史书 | “＿＿”是司马迁写的，记载了从黄帝到汉武帝时期的历史。
正史 | zhèng shǐ | official history | 古代朝廷承认的史书 | 关于这个人的故事，＿＿里没有记载，只在民间流传。 | 野史
野史 | yě shǐ | unofficial history | 私人写的、不是朝廷承认的历史 | 这本书收集了许多＿＿里的故事，不一定都是真的。 | 正史
编年 | biān nián | chronological record | 按年月的顺序记录历史 | “春秋”是一部＿＿体的史书，按年份记录了鲁国的历史。
文献 | wén xiàn | documents, references | 有历史价值或参考价值的书和资料 | 写论文时，要在后面列出参考＿＿。 | 史料 典籍
记载 | jì zǎi | to record | 把事情写下来 | 据史书＿＿，这座桥建于一千四百多年前。
典籍 | diǎn jí | ancient classics | 古代的重要书籍 | 这座图书馆收藏了大量古代＿＿。 | 史书 文献
史学家 | shǐ xué jiā | historian | 研究历史的专家 | 司马迁是西汉著名的＿＿和文学家。
`,
  },
  {
    theme: ["Eras and Dates", "年代和纪元"],
    data: `
公元 | gōng yuán | the Common Era, AD | 国际通用的纪年方法 | 秦始皇在＿＿前二二一年统一了中国。
纪元 | jì yuán | era, epoch | 纪年的起算年代；新的时代 | 第一台电子计算机的出现，开创了一个新＿＿。
年号 | nián hào | reign title | 古代皇帝用来纪年的名称 | “洪武”是明朝第一位皇帝的＿＿。
年间 | nián jiān | in the years of | 某个时期里 | 这座寺庙建于明朝万历＿＿。
当代 | dāng dài | contemporary | 现在这个时代 | 他是＿＿最有名的作家之一。
盛世 | shèng shì | golden age | 国家兴旺、太平的时代 | 唐朝前期国家强大，社会安定，被称为＿＿。 | 鼎盛
鼎盛 | dǐng shèng | at the height of power | 正当兴旺的时候 | 唐朝在＿＿时期，长安是世界上最大的城市之一。 | 盛世
春秋 | chūn qiū | the Spring and Autumn period | 东周的前一个时期 | 孔子生活在＿＿时期。
战国 | zhàn guó | the Warring States period | 东周的后一个时期，各国之间战争不断 | ＿＿时期有七个大国，最后被秦国统一。
三国 | sān guó | the Three Kingdoms | 东汉以后三个国家同时存在的时期 | 东汉以后是＿＿时期，三个国家互相争斗了几十年。
`,
  },
  {
    theme: ["Dynasties", "朝代"],
    data: `
夏朝 | xià cháo | the Xia dynasty | 传说中中国最早的朝代 | 根据古书的记载，＿＿是中国历史上第一个朝代。
商朝 | shāng cháo | the Shang dynasty | 夏朝以后的朝代，留下了甲骨文 | 甲骨文是＿＿留下来的文字，刻在动物的甲和骨头上。
周朝 | zhōu cháo | the Zhou dynasty | 商朝以后的朝代，分为西周和东周 | 孔子生活的春秋时期是＿＿的一部分。
宋朝 | sòng cháo | the Song dynasty | 唐朝以后统一中国的朝代，有北宋和南宋 | 活字印刷术是在＿＿发明的。
元朝 | yuán cháo | the Yuan dynasty | 蒙古族建立的朝代 | ＿＿是蒙古族建立的，首都在今天的北京。
开国 | kāi guó | to found a state | 建立新的国家或朝代 | 汉朝的＿＿皇帝原来只是一个普通的小官。
改朝换代 | gǎi cháo huàn dài | change of dynasty | 旧的朝代被新的朝代代替 | 中国历史上经历了很多次＿＿，每个朝代都留下了自己的文化。
在位 | zài wèi | to be on the throne | 正在做皇帝或国王 | 汉武帝＿＿五十四年，做了很多大事。
继位 | jì wèi | to succeed to the throne | 接替前一个君主做皇帝或国王 | 老国王去世以后，他的大儿子＿＿当了国王。 | 登基
登基 | dēng jī | to ascend the throne | 正式开始做皇帝 | 新皇帝＿＿的那天，全城的百姓都出来庆祝。 | 继位
`,
  },
  {
    theme: ["Families and Ancestors", "家族和祖先"],
    data: `
姓氏 | xìng shì | surname | 表明家族的字 | 王、李、张是中国人最常见的＿＿。
宗族 | zōng zú | lineage | 同一个祖先传下来的各个家庭 | 在古代农村，一个村子的人常常属于同一个＿＿。
宗祠 | zōng cí | clan hall | 一个家族祭祀祖先的房子 | 每年春节，村里的人都到＿＿里祭拜祖先。 | 祠堂
祠堂 | cí táng | memorial temple | 祭祀祖先或纪念名人的房子 | 人们为这位清官修建了一座＿＿，纪念他。 | 宗祠
祭祀 | jì sì | to offer sacrifices | 拜神或祖先，献上食物等 | 古代皇帝每年都要举行仪式，＿＿上天。
追溯 | zhuī sù | to trace back | 往上推求事情的来源 | 这个节日的来历可以＿＿到两千多年前。 | 回溯
回溯 | huí sù | to look back on | 回过头来想过去的事 | ＿＿过去十年，这座城市发生了很大的变化。 | 追溯
诞生 | dàn shēng | to be born, to come into being | 出生；产生 | 世界上第一台电子计算机＿＿于一九四六年。
家谱 | jiā pǔ | family tree | 记录一个家族世代成员的书 | 从＿＿上看，他家在这里已经住了三百多年。
祖籍 | zǔ jí | ancestral home | 祖先生活的地方 | 他出生在上海，但是＿＿在广东。
`,
  },
  {
    theme: ["World History", "世界历史"],
    data: `
古希腊 | gǔ xī là | ancient Greece | 两千多年前在希腊地区的文明 | 很多西方哲学思想都起源于＿＿。
古罗马 | gǔ luó mǎ | ancient Rome | 以罗马城为中心的古代国家 | ＿＿人修了很多又长又直的大路，有的今天还能看到。
金字塔 | jīn zì tǎ | pyramid | 古代埃及国王的坟墓 | ＿＿是用巨大的石块建成的，样子像汉字“金”。
两河流域 | liǎng hé liú yù | Mesopotamia | 亚洲西部两条大河之间的地区 | ＿＿的人发明了最早的文字之一，把字刻在泥板上。
古印度 | gǔ yìn dù | ancient India | 南亚的古代文明 | 佛教起源于＿＿。
中世纪 | zhōng shì jì | the Middle Ages | 欧洲历史上大约从五世纪到十五世纪的时期 | 在欧洲＿＿，很多大教堂花了一百多年才建成。
文艺复兴 | wén yì fù xīng | the Renaissance | 十四到十六世纪欧洲的思想文化运动 | ＿＿时期，意大利出现了许多伟大的画家。
新大陆 | xīn dà lù | the New World | 欧洲人对美洲的称呼 | 一四九二年以后，欧洲人把美洲叫做“＿＿”。
工业革命 | gōng yè gé mìng | the Industrial Revolution | 十八世纪从英国开始的、用机器代替手工的大变革 | ＿＿以后，工厂里的机器代替了很多手工劳动。
世界大战 | shì jiè dà zhàn | world war | 很多国家参加的世界范围的战争 | 二十世纪发生过两次＿＿，给人类带来了巨大的灾难。
`,
  },
  {
    theme: ["Territory and Expansion", "疆域和开拓"],
    data: `
疆域 | jiāng yù | territory | 国家的领土范围 | 元朝的＿＿非常大，比今天的中国还大。 | 版图
版图 | bǎn tú | territory (on the map) | 地图上表示的国家领土 | 经过多年的战争，这个帝国的＿＿扩大了很多。 | 疆域
扩张 | kuò zhāng | to expand | 扩大势力或范围 | 这家公司发展得很快，几年内就＿＿到了全国。 | 拓展
远征 | yuǎn zhēng | expedition | 到很远的地方去作战 | 亚历山大带领军队＿＿，一直到了印度。
开拓 | kāi tuò | to open up, to pioneer | 开辟，扩展 | 汉朝派人出使西域，＿＿了通往西方的道路。 | 拓展
拓展 | tuò zhǎn | to expand, to broaden | 在原有的基础上扩大 | 多读书可以＿＿我们的视野。 | 开拓 拓宽
拓宽 | tuò kuān | to widen | 使路、河等变宽 | 这条马路正在＿＿，以后可以走四辆车。 | 拓展
拓荒 | tuò huāng | to open up wasteland | 开垦没有人种过的土地 | 早年来到这里的人＿＿种地，把荒地变成了农田。
抵御 | dǐ yù | to resist | 抵挡，防止受到损害 | 古人修建长城，是为了＿＿北方的进攻。 | 防御
防御 | fáng yù | to defend; defence | 抵挡敌人的进攻 | 这座城的城墙又高又结实，＿＿能力很强。 | 抵御
`,
  },
  {
    theme: ["History in Everyday Words", "日常里的历史字"],
    data: `
鼎力 | dǐng lì | with all one's strength | 很大的力量(多用于感谢) | 感谢各位朋友的＿＿相助。
大名鼎鼎 | dà míng dǐng dǐng | famous | 名气很大 | 他就是那位＿＿的科学家，很多人都读过他的书。
三足鼎立 | sān zú dǐng lì | a three-way balance | 三方力量平衡，互相对立 | 这个市场上三家大公司＿＿，谁也压不倒谁。
主宰 | zhǔ zǎi | master; to dominate | 掌握、支配；起决定作用的人或力量 | 我们要努力，做自己命运的＿＿。
依仗 | yī zhàng | to rely on (backing) | 靠别人的势力 | 他＿＿父亲的权力，在公司里谁都不放在眼里。 | 仗着
仗着 | zhàng zhe | to count on | 靠着某种条件，多用于不好的方面 | 他＿＿自己个子高，常常抢别人的东西。 | 依仗
荒诞 | huāng dàn | absurd | 非常不合情理 | 这个故事很＿＿，猫怎么可能会说话呢？
圣诞节 | shèng dàn jié | Christmas | 十二月二十五日，基督教纪念耶稣出生的节日 | 每年十二月二十五日是＿＿，很多西方国家都放假。
诸位 | zhū wèi | everyone (polite) | 各位 | ＿＿来宾，欢迎大家来参加今天的晚会。
座右铭 | zuò yòu míng | motto | 写在身边提醒自己的话 | 他的＿＿是“活到老，学到老”。
`,
  },
  // Unit 8: Thought and Belief.
  {
    theme: ["The Hundred Schools", "诸子百家"],
    data: `
诸子百家 | zhū zǐ bǎi jiā | the Hundred Schools of Thought | 先秦时期各种思想派别的总称 | 春秋战国时期出现了＿＿，各种思想互相争论。
老子 | lǎo zǐ | Laozi | 春秋时期的思想家，道家的创始人 | “道德经”相传是＿＿写的。
庄子 | zhuāng zǐ | Zhuangzi | 战国时期道家的代表人物 | ＿＿曾经和朋友在桥上争论：鱼快乐不快乐？
墨子 | mò zǐ | Mozi | 战国初期的思想家，墨家的创始人 | ＿＿主张“兼爱”，认为人们应该不分亲疏地互相爱护。
墨家 | mò jiā | Mohism | 墨子创立的学派 | ＿＿反对战争，主张节约。
法家 | fǎ jiā | Legalism | 主张用严格的法律治理国家的学派 | 秦国重用＿＿的人，用严格的法律管理国家。
中庸 | zhōng yōng | the doctrine of the mean | 儒家主张的不偏不倚、恰到好处的态度 | 儒家讲＿＿，认为做事不能太过分，也不能不够。
无为 | wú wéi | non-action | 道家主张的顺应自然、不勉强去做的态度 | 道家主张“＿＿”，认为治理国家应该顺应自然。
仁爱 | rén ài | benevolence | 同情、爱护别人 | 孔子主张＿＿，要求人们关心别人。 | 仁义
仁义 | rén yì | benevolence and righteousness | 爱护别人，做事正当 | 他是一个讲＿＿的人，从来不做对不起朋友的事。 | 仁爱
`,
  },
  {
    theme: ["Philosophy and Argument", "哲学和思辨"],
    data: `
哲学家 | zhé xué jiā | philosopher | 研究哲学的人 | 亚里士多德是古希腊著名的＿＿。
悖论 | bèi lùn | paradox | 看起来都对，但是互相矛盾的说法 | “我说的这句话是假话”是一个有名的＿＿。
诡辩 | guǐ biàn | sophistry | 表面上有理、其实歪曲事实的辩论 | 他说的话听起来有道理，其实是＿＿。
辩证法 | biàn zhèng fǎ | dialectics | 从发展、联系的角度看问题的方法 | ＿＿认为，事物总是在变化发展的，不是一成不变的。
范畴 | fàn chóu | category | 类型，范围 | 这个问题不属于数学的＿＿，而属于哲学。
唯物主义 | wéi wù zhǔ yì | materialism | 认为物质第一、意识第二的哲学 | ＿＿认为世界是由物质构成的。
唯心主义 | wéi xīn zhǔ yì | idealism | 认为意识第一、物质第二的哲学 | ＿＿认为意识比物质更根本。
伦理学 | lún lǐ xué | ethics | 研究道德的学问 | ＿＿研究什么是善、什么是恶，人应该怎样做。
神学 | shén xué | theology | 研究宗教道理的学问 | 中世纪欧洲的很多大学都有＿＿，研究基督教的道理。
并行不悖 | bìng xíng bù bèi | to coexist without conflict | 同时进行，互不冲突 | 经济发展和保护环境可以＿＿。
`,
  },
  {
    theme: ["Right and Wrong", "伦理和善恶"],
    data: `
伦理 | lún lǐ | moral principles | 人与人相处应该遵守的道理 | 用动物做实验引起了很多＿＿问题的讨论。 | 人伦
人伦 | rén lún | human relations | 人与人之间的道德关系 | 古人认为，孝顺父母是最重要的＿＿。 | 伦理
天伦之乐 | tiān lún zhī lè | the joys of family life | 家人团聚的快乐 | 春节时一家人团聚，老人享受着＿＿。
宽恕 | kuān shù | to forgive | 原谅别人的过错 | 他真心地道了歉，最后得到了朋友的＿＿。
忠恕 | zhōng shù | loyalty and consideration | 儒家的道德：对人忠诚，推己及人 | 孔子的学生说，老师的道理可以用“＿＿”两个字来概括。
良知 | liáng zhī | conscience | 天生就知道是非善恶的心 | 一个有＿＿的人，不会做伤害别人的事。
善意 | shàn yì | goodwill | 好心 | 他这样说是出于＿＿，你不要误会。
恶意 | è yì | malice | 坏心 | 这是一次意外，他不是＿＿的。
罪恶 | zuì è | evil, crime | 严重危害别人的坏事 | 在很多宗教里，贪心被看作＿＿的根源之一。 | 邪恶
邪恶 | xié è | wicked | 不正当而且凶恶 | 童话里的坏人往往很＿＿，最后总是被打败。 | 罪恶
`,
  },
  {
    theme: ["Desire and Restraint", "欲望和节制"],
    data: `
欲望 | yù wàng | desire | 想得到某种东西的强烈愿望 | 人的＿＿是没有止境的，要学会控制。 | 贪欲
食欲 | shí yù | appetite | 想吃东西的感觉 | 他生病了，一点＿＿也没有。
求知欲 | qiú zhī yù | thirst for knowledge | 想要得到知识的愿望 | 这个孩子的＿＿很强，什么都想知道。
贪欲 | tān yù | greed | 贪心 | 他被自己的＿＿害了，最后什么都失去了。 | 欲望
随心所欲 | suí xīn suǒ yù | as one pleases | 想怎么做就怎么做 | 自由并不是＿＿，也要遵守规则。
欲罢不能 | yù bà bù néng | unable to stop | 想停也停不下来 | 这本小说太好看了，我一读就＿＿。
欲速则不达 | yù sù zé bù dá | haste makes waste | 想太快反而达不到目的 | 学语言要一步一步来，＿＿。
戒备 | jiè bèi | to be on guard | 防备 | 他对陌生人很有＿＿，不轻易说出自己的地址。 | 戒心
戒心 | jiè xīn | wariness | 防备的心 | 刚认识的时候，她对我有一点＿＿，后来我们才变成好朋友。 | 戒备
警戒 | jǐng jiè | to be on alert | 防备危险，保持警惕 | 台风快来了，海边已经进入＿＿状态。 | 戒备
`,
  },
  {
    theme: ["Modesty and Arrogance", "谦逊和狂妄"],
    data: `
谦逊 | qiān xùn | modest | 谦虚，不骄傲 | 他取得了很大的成就，却一直很＿＿。
逊色 | xùn sè | inferior | 比不上 | 这部新电影比第一部＿＿多了。
出言不逊 | chū yán bù xùn | to speak rudely | 说话没有礼貌，冒犯别人 | 他在会上＿＿，得罪了很多人。
狂妄 | kuáng wàng | arrogant | 极端自高自大 | 他刚赢了一场比赛，就＿＿地说自己是世界第一。 | 唯我独尊
妄想 | wàng xiǎng | wishful thinking | 不可能实现的想法 | 不努力学习就想考第一，这简直是＿＿。
胆大妄为 | dǎn dà wàng wéi | reckless | 没有顾忌地乱做坏事 | 这个小偷真是＿＿，白天就敢进屋偷东西。
虚妄 | xū wàng | illusory | 不真实的 | 他后来发现，自己过去追求的名利都是＿＿的。
唯我独尊 | wéi wǒ dú zūn | to think oneself above all | 认为只有自己最了不起 | 他总是一副＿＿的样子，从来不听别人的意见。 | 狂妄
唯唯诺诺 | wéi wéi nuò nuò | submissive | 别人说什么都答应，没有主见 | 他在老板面前总是＿＿，不敢说出自己的想法。 | 唯命是从
唯命是从 | wéi mìng shì cóng | to obey blindly | 别人怎么命令就怎么做 | 我们要有自己的判断，不能对别人＿＿。 | 唯唯诺诺
`,
  },
  {
    theme: ["Thought in Everyday Words", "日常里的思想词语"],
    data: `
唯一 | wéi yī | only, sole | 只有一个 | 他是班里＿＿一个会说法语的学生。
唯有 | wéi yǒu | only (if) | 只有 | ＿＿坚持下去，才能取得成功。 | 唯独
唯独 | wéi dú | only, alone | 单单 | 大家都来了，＿＿他没有来。 | 唯有
唯利是图 | wéi lì shì tú | to care only for profit | 只追求利益，别的什么都不顾 | 这家公司＿＿，卖的东西质量很差。
诡计 | guǐ jì | trick, ruse | 欺骗人的坏主意 | 故事里的坏人想出了一个＿＿，但最后被聪明的小女孩识破了。
诡异 | guǐ yì | eerie | 奇怪，让人不安 | 半夜里，空房子里传出了＿＿的声音。 | 邪门
邪门 | xié mén | weird (colloquial) | 不正常，奇怪 | 真＿＿，我刚放在桌子上的手机怎么不见了？ | 诡异
歪门邪道 | wāi mén xié dào | dishonest means | 不正当的方法 | 想成功要靠努力，不能走＿＿。
无与伦比 | wú yǔ lún bǐ | incomparable | 没有能比得上的 | 站在山顶上看日出，那种美是＿＿的。
妄言 | wàng yán | to talk rashly | 随便乱说 | 事情还没调查清楚，大家不要＿＿。
`,
  },
  {
    theme: ["Faith and Worship", "信仰和崇拜"],
    data: `
崇拜 | chóng bài | to worship, to idolize | 非常敬佩；当作神来敬拜 | 古代很多民族都＿＿太阳。 | 尊崇 崇敬
崇高 | chóng gāo | lofty, noble | 最高的，最高尚的 | 教师是一个＿＿的职业。
崇尚 | chóng shàng | to uphold | 尊重并提倡 | 这个民族＿＿勤劳和节俭。 | 推崇
推崇 | tuī chóng | to hold in esteem | 十分看重，并且给予很高的评价 | 他的书受到很多学者的＿＿。 | 崇尚
尊崇 | zūn chóng | to revere | 尊敬并且看重 | 孔子在中国历史上一直受到人们的＿＿。 | 崇拜 崇敬
崇敬 | chóng jìng | to esteem | 非常尊敬 | 人们怀着＿＿的心情来到纪念馆。 | 尊崇 崇拜
虔诚 | qián chéng | devout | 对信仰恭敬而有诚意 | 他是一个＿＿的信徒，每天都要祷告。
信徒 | xìn tú | believer | 信仰某种宗教或学说的人 | 这座寺庙每天都有很多＿＿来烧香。 | 教徒
教徒 | jiào tú | adherent | 加入某个宗教的人 | 他是一名虔诚的佛＿＿。
佛经 | fó jīng | Buddhist scripture | 佛教的经典 | 唐朝有很多僧人把印度的＿＿翻译成了汉语。
`,
  },
  {
    theme: ["Prayer and Religions", "祈祷和宗教"],
    data: `
祈祷 | qí dǎo | to pray | 向神说出自己的愿望 | 每个星期天，他都去教堂＿＿。 | 祷告
祷告 | dǎo gào | to pray (in Christian usage) | 向上帝或神说出愿望 | 吃饭以前，他们一家人先低下头＿＿。 | 祈祷
祈求 | qí qiú | to pray for | 诚心地希望得到 | 农民们＿＿今年风调雨顺。 | 祈福 祈祷
祈福 | qí fú | to pray for blessings | 求神保佑，得到幸福 | 春节时很多人去寺庙为家人＿＿。 | 祈求
道教 | dào jiào | Taoism | 中国本土产生的宗教 | ＿＿是在中国本土产生的宗教，把老子尊为祖师。
基督教 | jī dū jiào | Christianity | 信仰耶稣基督的宗教 | 每年的圣诞节是＿＿最重要的节日之一。 | 天主教
天主教 | tiān zhǔ jiào | Catholicism | 基督教的一个主要派别 | ＿＿的最高领导人是住在罗马的教皇。 | 基督教
伊斯兰教 | yī sī lán jiào | Islam | 七世纪产生于阿拉伯半岛的宗教 | ＿＿产生于七世纪的亚洲西部。
圣经 | shèng jīng | the Bible | 基督教的经典 | “＿＿”由旧约和新约两部分组成。
教堂 | jiào táng | church | 基督教举行宗教活动的房子 | 这座＿＿已经有五百多年的历史了。
`,
  },
  {
    theme: ["Monks and Monasteries", "僧人和寺院"],
    data: `
僧人 | sēng rén | monk | 出家的男佛教徒 | 寺庙里住着几十位＿＿。 | 高僧 禅师
高僧 | gāo sēng | eminent monk | 道德和学问都很高的和尚 | 唐朝有一位＿＿到印度取经，带回了很多佛经。 | 僧人 禅师
尼姑 | ní gū | Buddhist nun | 出家的女佛教徒 | 这座小庙里住的都是＿＿，没有和尚。
禅宗 | chán zōng | Chan Buddhism | 中国佛教的一个宗派 | ＿＿在中国发展起来，后来传到了日本。
坐禅 | zuò chán | to sit in meditation | 佛教徒安静地坐着思考 | 和尚每天早上都要＿＿一个小时。 | 修行
禅师 | chán shī | Chan master | 对和尚的尊称 | 这位老＿＿说话很少，但每句话都很有道理。 | 高僧 僧人
寺院 | sì yuàn | monastery | 佛教的庙 | 山上有一座古老的＿＿，已经有一千年的历史了。
出家 | chū jiā | to become a monk or nun | 离开家庭去做和尚或尼姑 | 他二十岁那年＿＿当了和尚。
修行 | xiū xíng | to practise religion | 学习佛法或道法，按要求生活 | 他在山里的小庙里＿＿了很多年。 | 坐禅
念经 | niàn jīng | to chant scriptures | 读佛经 | 寺庙里传来了和尚＿＿的声音。
`,
  },
  {
    theme: ["Life and Death in Belief", "生死的观念"],
    data: `
灵魂 | líng hún | soul | 很多宗教认为在身体里、主宰身体的东西；心灵 | 很多宗教认为，人死后＿＿还会存在。 | 魂魄 鬼魂
魂魄 | hún pò | spirit | 古人认为离开身体还能存在的精神 | 古人认为人死了以后，＿＿会离开身体。 | 灵魂 鬼魂
鬼魂 | guǐ hún | ghost | 迷信的人认为人死后变成的东西 | 故事里说这座老房子里有＿＿，其实那只是风声。 | 灵魂
鬼神 | guǐ shén | ghosts and gods | 鬼和神 | 孔子主张对＿＿要尊敬，但要远离。
天堂 | tiān táng | heaven, paradise | 宗教里说的好人死后去的美好地方 | 对喜欢看书的人来说，图书馆就是＿＿。
地狱 | dì yù | hell | 宗教里说的坏人死后受苦的地方 | 他觉得在这么热的天里干活，简直像在＿＿里一样。
轮回 | lún huí | the cycle of rebirth | 佛教认为生命在生死之间不断循环 | 佛教认为，人死后会进入＿＿，重新出生。 | 来世
来世 | lái shì | the next life | 死后再出生的那一世 | 他相信人死后还会再出生，开始＿＿的生活。 | 轮回 前世
前世 | qián shì | a previous life | 出生以前的那一世 | 有人说，两个人一见如故，是因为＿＿有缘。 | 来世
永恒 | yǒng héng | eternal | 永远不变 | 世界上没有＿＿不变的东西。
`,
  },
  {
    theme: ["Gods and Immortals", "神仙和鬼怪"],
    data: `
神仙 | shén xiān | immortal, deity | 神话里有超人能力、长生不老的人 | 这里的风景这么美，我真想像＿＿一样住在这儿。 | 仙人
仙人 | xiān rén | immortal | 长生不老的人 | 传说这座山上住着一位＿＿，他已经活了一千岁。 | 神仙
仙女 | xiān nǚ | fairy | 年轻美丽的女神 | 她穿着白色的长裙，像＿＿一样美。
八仙 | bā xiān | the Eight Immortals | 中国民间传说中的八位神 | “＿＿过海，各显神通”是一句有名的俗语。
仙境 | xiān jìng | fairyland | 神住的地方；风景非常美的地方 | 雾中的山林像＿＿一样美。
魔鬼 | mó guǐ | devil | 宗教或神话里害人的东西 | 在这个故事里，＿＿变成一个老人去骗人。 | 鬼怪
鬼怪 | guǐ guài | ghosts and monsters | 鬼和妖怪 | 小时候他很怕听＿＿的故事。 | 魔鬼
神灵 | shén líng | deities | 神的总称 | 古人遇到旱灾，就向＿＿求雨。 | 天神
天神 | tiān shén | god of heaven | 天上的神 | 古希腊人认为宙斯是众＿＿的首领。 | 神灵
上帝 | shàng dì | God | 基督教信仰的神 | 基督教徒相信＿＿创造了世界。
`,
  },
  {
    theme: ["Fortune and Omens", "吉凶和预兆"],
    data: `
占卜 | zhān bǔ | divination | 用骨头、草等推测吉凶 | 商朝人常常用骨头＿＿，并把结果刻在上面。
算命 | suàn mìng | fortune-telling | 推算人的命运 | 有人相信＿＿，但这种说法没有科学根据。 | 看相
看相 | kàn xiàng | to read faces | 看人的脸来推测命运 | 那个人说他会＿＿，看一眼你的脸就知道你的将来。 | 算命
风水 | fēng shuǐ | fengshui | 迷信的人认为房子、坟墓的位置和方向能影响人的祸福 | 有些人建房子以前，要先请人看＿＿。
预兆 | yù zhào | omen, sign | 事情发生前的迹象 | 天上出现了黑云，这是要下雨的＿＿。 | 征兆 兆头
征兆 | zhēng zhào | sign, symptom | 显示要发生某种情况的迹象 | 经常头疼可能是生病的＿＿。 | 预兆
兆头 | zhào tou | omen (colloquial) | 口语里说的预兆 | 一出门就遇到老朋友，真是个好＿＿！ | 预兆 吉兆
吉兆 | jí zhào | good omen | 好的预兆 | 古人把天上出现的彩云看作＿＿。 | 兆头 预兆
凶兆 | xiōng zhào | ill omen | 不好的预兆 | 古人把日食看作＿＿，以为要有大灾难。 | 预兆
吉凶 | jí xiōng | good or ill luck | 好运和坏运 | 古人做大事以前，常常要先问一问＿＿。
`,
  },
  {
    theme: ["Misfortune and Taboo", "祸事和忌讳"],
    data: `
灾祸 | zāi huò | disaster | 自然的或人为的灾害 | 这场大火是一个小烟头引起的＿＿。 | 祸害
祸害 | huò hai | to do harm; bane | 引起灾难的人或事；损害 | 这些老鼠在田里＿＿庄稼，农民很头疼。 | 灾祸
祸福 | huò fú | misfortune and fortune | 灾祸和幸福 | 古人说“＿＿相依”，好事和坏事可以互相转化。
祸不单行 | huò bù dān xíng | misfortunes never come singly | 不幸的事接连发生 | 他刚丢了钱包，又摔伤了腿，真是＿＿。
因祸得福 | yīn huò dé fú | a blessing in disguise | 因为遇到坏事反而得到好处 | 他没考上那所大学，却＿＿，在另一所学校找到了自己喜欢的专业。
凶多吉少 | xiōng duō jí shǎo | more bad luck than good | 坏的可能性大 | 这么大的风浪，那条小船恐怕＿＿。
忌讳 | jì huì | taboo | 因为风俗或习惯而避开的话或事 | 在中国，送礼时有一些＿＿，比如不送钟。
讳言 | huì yán | to be unwilling to mention | 不敢或不愿说 | 不可＿＿，我们的工作中还存在很多问题。
讳疾忌医 | huì jí jì yī | to hide one's faults | 怕别人知道自己的缺点而不愿改正 | 有了错误就要改正，不能＿＿。
直言不讳 | zhí yán bù huì | to speak bluntly | 说话坦率，没有顾忌 | 他对我的文章＿＿地提出了很多批评。
`,
  },
  {
    theme: ["Spirit and Will", "精神和意志"],
    data: `
魄力 | pò lì | boldness | 做事果断的作风 | 新校长很有＿＿，一上任就做了很多改革。 | 气魄
气魄 | qì pò | grandeur | 气势 | 长城非常雄伟，很有＿＿。 | 魄力
体魄 | tǐ pò | physique | 身体和精力 | 经常锻炼可以让人拥有健康的＿＿。
失魂落魄 | shī hún luò pò | distraught | 心神不定，非常慌张 | 他丢了重要的文件，整个下午都＿＿的。 | 魂不守舍
魂不守舍 | hún bù shǒu shè | absent-minded | 精神不集中 | 他今天上课一直＿＿的，老师问他问题他都没听见。 | 失魂落魄
惊心动魄 | jīng xīn dòng pò | thrilling | 使人感受很深、非常紧张 | 这是一场＿＿的比赛，直到最后一秒才分出胜负。
胆小鬼 | dǎn xiǎo guǐ | coward | 胆子很小的人 | 别做＿＿，勇敢地上台说吧！
机灵鬼 | jī ling guǐ | clever little one | 聪明灵活的人，多指孩子 | 这个小＿＿一下子就猜出了答案。
鬼脸 | guǐ liǎn | funny face | 故意做出的滑稽的表情 | 弟弟对着镜子做了一个＿＿，把大家都逗笑了。
戒烟 | jiè yān | to quit smoking | 改掉抽烟的习惯 | 为了健康，爸爸下决心＿＿。
`,
  },
  {
    theme: ["Rites and Practice", "仪式和修行"],
    data: `
戒律 | jiè lǜ | precepts | 宗教要求教徒遵守的规定 | 按照寺院的＿＿，这里的和尚不吃肉。
供奉 | gòng fèng | to enshrine | 敬奉神佛、祖先 | 这座庙里＿＿着一尊很大的佛像。
香火 | xiāng huǒ | incense offerings | 烧香时点的火，指来庙里烧香的人多少 | 这座寺庙的＿＿很旺，每天都有很多人来。
朝拜 | cháo bài | to make a pilgrimage | 宗教信徒到圣地去敬拜 | 每年都有许多佛教徒到这座名山＿＿。
灵验 | líng yàn | efficacious | 预言或方法很有效 | 人们说这座庙很＿＿，求什么就能得到什么，其实这只是传说。
禅意 | chán yì | Zen feeling | 禅宗那样安静、淡泊的意味 | 这座小院子很安静，充满了＿＿。
修养 | xiū yǎng | self-cultivation | 知识、品德等方面的水平 | 他很有＿＿，从来不对别人发脾气。
天命 | tiān mìng | the Mandate of Heaven | 上天的意志 | 古代皇帝说自己是受了＿＿来统治国家的。
因果 | yīn guǒ | cause and effect | 原因和结果 | 这两件事之间没有＿＿关系。 | 报应
报应 | bào yìng | retribution | 佛教指做了好事或坏事得到的结果，后来多指坏的结果 | 佛教认为，做了坏事总会得到＿＿。 | 因果
`,
  },
  {
    theme: ["Everyday Words with New Characters", "新字组成的常用词"],
    data: `
占有 | zhàn yǒu | to own, to hold | 拥有 | 这家公司＿＿了全国一半的市场。 | 占据 占领
占领 | zhàn lǐng | to occupy, to capture | 用武力取得一个地方 | 古代的军队＿＿了这座城以后，在城墙上插上了自己的旗。 | 占据 占有
占据 | zhàn jù | to occupy, to fill | 取得并保持地方或地位 | 这个问题一直＿＿着他的心，让他睡不着觉。 | 占有 占领
占用 | zhàn yòng | to take up | 占有并使用 | 对不起，我＿＿了你这么多时间。 | 占据
占线 | zhàn xiàn | the line is busy | 电话正在被使用，打不进去 | 我给他打了好几次电话，一直＿＿。
占便宜 | zhàn pián yi | to take advantage | 用不正当的方法得到额外的好处 | 他喜欢＿＿，跟朋友吃饭从来不付钱。
戒指 | jiè zhi | ring | 戴在手指上的小环 | 她手上戴着一个金＿＿。
兰花 | lán huā | orchid | 一种开淡雅香花的植物 | ＿＿的香味很淡，很多中国古代文人都喜欢它。
尼龙 | ní lóng | nylon | 一种人工合成的材料 | 这种雨衣是用＿＿做的，又轻又结实。
仙人掌 | xiān rén zhǎng | cactus | 一种生长在干旱地区、身上长刺的植物 | ＿＿不怕干旱，在沙漠里也能生长。
`,
  },
  // Unit 9: Literature and Writing.
  {
    theme: ["Chanting and Praising", "吟诵和歌颂"],
    data: `
吟诵 | yín sòng | to chant, to recite | 有节奏、有感情地读诗文 | 老先生摇着头，慢慢地＿＿着一首唐诗。 | 吟咏 朗诵
吟咏 | yín yǒng | to sing of in verse | 有节奏地读诗；作诗来写某种事物 | 古代诗人常常＿＿山水，写下了很多好诗。 | 吟诵 歌咏
沉吟 | chén yín | to mutter while pondering | 遇到难题时低声自语地思考 | 他＿＿了一会儿，才回答我的问题。
歌咏 | gē yǒng | singing | 唱歌 | 学校每年举办一次＿＿比赛，每个班都唱两首歌。 | 吟咏
颂歌 | sòng gē | ode, hymn | 赞美的歌 | 这首诗是一首献给母亲的＿＿。
歌颂 | gē sòng | to sing the praises of | 用诗歌、言语赞美 | 这首诗＿＿了劳动人民的勤劳。 | 称颂
称颂 | chēng sòng | to extol | 称赞 | 他做的好事受到了全村人的＿＿。 | 歌颂
朗诵 | lǎng sòng | to recite aloud | 大声地、有感情地读诗或文章 | 在晚会上，她＿＿了一首自己写的诗。 | 吟诵
诗篇 | shī piān | poems | 诗的总称 | 李白留下了许多优美的＿＿。
诗经 | shī jīng | the Book of Songs | 中国最早的诗歌总集 | “＿＿”是中国最早的一部诗歌总集，收了三百多首诗。
`,
  },
  {
    theme: ["Rhyme and Metre", "韵律和格律"],
    data: `
韵律 | yùn lǜ | rhythm and rhyme | 诗歌的声音规则；节奏 | 这首诗读起来很有＿＿，像音乐一样好听。 | 韵味
韵脚 | yùn jiǎo | rhyming syllable | 诗句末尾押韵的字 | 这首诗每两句的最后一个字都是＿＿，读音很相近。
押韵 | yā yùn | to rhyme | 诗句末尾用读音相同或相近的字 | 儿歌一般都很＿＿，所以小孩子很容易记住。
韵味 | yùn wèi | lingering charm | 含蓄的意味 | 这首老歌越听越有＿＿。 | 韵律
音韵 | yīn yùn | phonology | 汉字的读音 | 研究古代汉字读音的学问叫做＿＿学。
格律诗 | gé lǜ shī | regulated verse | 字数、句数、押韵等都有严格规定的诗 | 写＿＿要遵守很多规则，比如每句的字数要相同。 | 律诗
律诗 | lǜ shī | lüshi, eight-line verse | 一种八句的旧诗，有严格的格律 | 一首＿＿有八句，每句五个字或七个字。 | 格律诗
绝句 | jué jù | jueju, four-line verse | 一种四句的旧诗 | 一首＿＿只有四句，比律诗短一半。
对仗 | duì zhàng | antithetical couplet | 诗文中字数相等、意思相对的两句 | 律诗中间的两联一般要求＿＿。 | 对偶
对偶 | duì ǒu | parallel pair | 用字数相等、结构相同的两句话表达相关意思的修辞 | “海内存知己，天涯若比邻”用了＿＿的修辞手法。 | 对仗
`,
  },
  {
    theme: ["Styles and Schools", "风格和流派"],
    data: `
婉约 | wǎn yuē | graceful and restrained | 诗词风格含蓄柔美 | 李清照是宋代＿＿派的代表词人。
委婉 | wěi wǎn | tactful | 说话温和、不直接 | 他＿＿地拒绝了朋友的请求。 | 婉言
婉言 | wǎn yán | gentle words | 委婉的话 | 她＿＿谢绝了大家的好意。 | 委婉
婉转 | wǎn zhuǎn | sweet and lilting | 声音柔和动听 | 她的歌声很＿＿，像小鸟在唱歌。 | 婉约
风格 | fēng gé | style | 作品表现出来的特点 | 这位画家的＿＿很特别，一看就知道是他画的。 | 笔调
流派 | liú pài | school (of art) | 风格相同的一群作家或艺术家 | 中国画有很多＿＿，每个都有自己的特点。
浪漫主义 | làng màn zhǔ yì | romanticism | 用丰富的想象表达理想的创作方法 | 李白的诗充满了＿＿色彩。
现实主义 | xiàn shí zhǔ yì | realism | 真实地反映社会生活的创作方法 | 杜甫的诗真实地写出了百姓的苦难，是＿＿的代表。
笔调 | bǐ diào | tone of writing | 文章的格调和情调 | 这篇散文用轻松的＿＿写了作者童年的生活。 | 风格
文采 | wén cǎi | literary talent | 文章写得好的才华 | 他很有＿＿，写的信都像散文一样美。
`,
  },
  {
    theme: ["Images and Moods", "意象和意境"],
    data: `
朦胧 | méng lóng | hazy | 不清楚，模糊 | 月光下，远处的山显得很＿＿。
朦胧诗 | méng lóng shī | Misty Poetry | 二十世纪七八十年代中国出现的一种意思比较含蓄的新诗 | ＿＿是二十世纪七八十年代流行的一种新诗。
意象 | yì xiàng | literary image | 作者用来表达情感的具体形象 | 在中国古诗里，月亮是表达思乡的常见＿＿。 | 意境
意境 | yì jìng | artistic conception | 作品中情和景结合的境界 | 这首诗的＿＿很美，读了让人好像身在画中。 | 意象
蕴含 | yùn hán | to contain | 包含在里面 | 这个简单的故事＿＿着深刻的道理。 | 蕴藏
蕴藏 | yùn cáng | to hold in store | 藏着还没有发现或使用 | 这片土地下面＿＿着丰富的石油。 | 蕴含
底蕴 | dǐ yùn | depth of culture | 内在的积累 | 这座古城有很深的文化＿＿。 | 意蕴
意蕴 | yì yùn | inner meaning | 内在的含义 | 这首小诗读起来简单，＿＿却很丰富。 | 底蕴
含蓄 | hán xù | implicit | 意思不直接说出来 | 中国古诗写感情往往很＿＿，不直接说出来。 | 朦胧
余味 | yú wèi | aftertaste | 留下来的味道或意味 | 这篇文章读完以后，＿＿无穷。 | 意蕴
`,
  },
  {
    theme: ["Words from Classical Chinese", "文言词语"],
    data: `
之乎者也 | zhī hū zhě yě | pedantic talk | 指说话、写文章喜欢用文言词 | 他说话总是＿＿的，大家都听不懂。
岂有此理 | qǐ yǒu cǐ lǐ | outrageous | 哪有这样的道理 | 他借了我的书不还，还说是我的错，真是＿＿！
岂能 | qǐ néng | how could | 怎么能 | 大家都在努力工作，我＿＿一个人休息？
乃至 | nǎi zhì | and even | 甚至 | 这个发现对中国＿＿整个世界都有重要意义。
乃是 | nǎi shì | to be (formal) | 就是 | 诚实＿＿做人的根本。
吾辈 | wú bèi | we, people like us | 我们这些人 | 保护传统文化，是＿＿的责任。
亦步亦趋 | yì bù yì qū | to imitate slavishly | 别人怎么做就怎么做，没有自己的主张 | 学习写作不能对名家＿＿，要有自己的风格。
知己知彼 | zhī jǐ zhī bǐ | know yourself and the other side | 了解自己也了解对方 | ＿＿，才能百战百胜。
此起彼伏 | cǐ qǐ bǐ fú | to rise one after another | 这里起来，那里落下，连续不断 | 比赛开始了，观众的欢呼声＿＿。
彼此 | bǐ cǐ | each other | 对方和自己 | 他们是多年的老朋友，＿＿都很了解。
`,
  },
  {
    theme: ["Bitter and Deep", "甘苦和深浅"],
    data: `
辛苦 | xīn kǔ | hard, toilsome | 劳累 | 妈妈每天工作很＿＿。 | 辛勤
辛勤 | xīn qín | industrious | 不怕苦地努力 | 农民的＿＿劳动换来了丰收。 | 辛苦
辛酸 | xīn suān | bitter sorrow | 痛苦和悲伤 | 这本小说写出了一个普通家庭生活的＿＿。 | 辛苦
辛辣 | xīn là | pungent; biting | 又辣又刺激；语言尖刻 | 鲁迅的杂文用＿＿的语言批评社会上的坏现象。
苏醒 | sū xǐng | to come round | 从昏迷中醒过来 | 春天来了，大地从冬天的沉睡中＿＿过来。 | 复苏
复苏 | fù sū | to revive | 恢复生机 | 经济开始＿＿，工厂又忙起来了。 | 苏醒
深渊 | shēn yuān | abyss | 很深的水；比喻危险的境地 | 站在悬崖边上，下面是万丈＿＿。
渊博 | yuān bó | erudite | 学识深而广 | 这位教授学识＿＿，什么问题都能回答。
渊源 | yuān yuán | origin, roots | 事情的根源 | 这两个家族之间有很深的历史＿＿。
柳树 | liǔ shù | willow | 一种枝条细长的树 | 河边种着一排＿＿，春风里，枝条轻轻地摆动。
`,
  },
  {
    theme: ["Composing a Piece", "写作的过程"],
    data: `
撰写 | zhuàn xiě | to write | 写文章、写书 | 他花了三年时间＿＿这本书。 | 编撰
撰稿 | zhuàn gǎo | to write for publication | 为报刊、节目写稿子 | 她是这家杂志的特约＿＿人。
编撰 | biān zhuàn | to compile | 编写 | 这本词典由五十多位专家共同＿＿。 | 撰写
构思 | gòu sī | to conceive | 写作前想清楚内容和结构 | 写作文以前，要先＿＿好文章的结构。 | 立意
立意 | lì yì | central idea | 文章的主要思想 | 这篇作文的＿＿很新，老师给了高分。 | 构思
素材 | sù cái | raw material | 写作用的原始材料 | 生活中的小事都可以成为写作的＿＿。
初稿 | chū gǎo | first draft | 第一次写成的稿子 | 他用一个星期写完了＿＿，又花了一个月修改。 | 定稿
定稿 | dìng gǎo | final version | 修改完成的稿子 | 经过多次修改，这本书终于＿＿了。 | 初稿
誊写 | téng xiě | to make a fair copy | 照着原稿抄写 | 他把修改好的作文工工整整地＿＿了一遍。
润色 | rùn sè | to polish | 修饰文字，让它更好 | 这篇文章写得不错，再＿＿一下就更好了。
`,
  },
  {
    theme: ["Copying and Annotating", "临摹和批注"],
    data: `
临摹 | lín mó | to copy from a model | 照着字画模仿着写或画 | 学书法要先＿＿古人的字。 | 摹写
描摹 | miáo mó | to depict | 用语言文字表现人或事物的样子 | 作者用优美的文字＿＿了江南的春天。
摹写 | mó xiě | to trace | 照着原样写 | 小学生把薄纸放在字上面，照着＿＿。 | 临摹
誊抄 | téng chāo | to transcribe | 照着原稿抄 | 古时候没有印刷术，书都要靠人一本一本地＿＿。
眉批 | méi pī | notes in the top margin | 写在书页上方空白处的批语 | 他读书时喜欢在书页上方写＿＿。 | 批注
批注 | pī zhù | annotation | 在书上写的评论和说明 | 这本旧书里有很多前人的＿＿。 | 眉批 评点 注释
圈点 | quān diǎn | to mark with circles and dots | 读书时在重要的字句旁画上圈和点 | 读到好句子时，他就用笔＿＿出来。
评点 | píng diǎn | to comment on a text | 对文章作评论并加圈点 | 清代有不少学者＿＿过“红楼梦”。 | 批注
注释 | zhù shì | note | 解释字句的文字 | 这本古文书每页下面都有＿＿，帮助读者理解。 | 批注
校对 | jiào duì | to proofread | 核对稿子，改正错字 | 书出版以前要经过认真的＿＿。
`,
  },
  {
    theme: ["Parts of a Book", "书的组成"],
    data: `
序言 | xù yán | preface | 写在书前面介绍内容的文章 | 这本书的＿＿是一位著名作家写的。 | 前言
前言 | qián yán | foreword | 书前面的说明文字 | 这本教材的＿＿说明了编写的目的。 | 序言
后记 | hòu jì | afterword | 写在书后面的文章 | 作者在＿＿里感谢了帮助过他的人。
目录 | mù lù | table of contents | 书前面列出的章节和页码 | 看看＿＿，就能知道这本书有哪些内容。
篇章 | piān zhāng | chapter | 文章；比喻历史上的一段 | 第一次登上月球，开启了人类探索宇宙的新＿＿。
段落 | duàn luò | paragraph | 文章里的一段 | 这篇文章分为五个＿＿。
结尾 | jié wěi | ending | 文章或事情的最后部分 | 这个故事的＿＿出人意料。
篇幅 | piān fú | length of writing | 文章的长短 | 这篇文章＿＿不长，但是内容很丰富。 | 段落
书名 | shū míng | book title | 书的名字 | 这本书的＿＿只有两个字。
全集 | quán jí | complete works | 一个作者全部作品编在一起的书 | 他把鲁迅的＿＿都读完了，一共有很多本。
`,
  },
  {
    theme: ["Kinds of Writing", "文体"],
    data: `
文体 | wén tǐ | literary form | 文章的种类 | 诗歌、小说、散文、戏剧是四种主要的文学＿＿。 | 体裁
体裁 | tǐ cái | genre | 文学作品的表现形式 | 这篇作文的＿＿不限，可以写成诗，也可以写成故事。 | 文体
记叙文 | jì xù wén | narrative essay | 记人、叙事、写景的文章 | ＿＿要写清楚时间、地点、人物和事情的经过。
议论文 | yì lùn wén | argumentative essay | 讲道理、发表看法的文章 | 写＿＿要有明确的观点和充分的理由。
说明文 | shuō míng wén | expository essay | 介绍事物、说明道理的文章 | 这篇＿＿介绍了熊猫的生活习惯。
应用文 | yìng yòng wén | practical writing | 日常生活和工作中用的文章，比如书信、通知 | 通知、请假条都属于＿＿。
散文诗 | sǎn wén shī | prose poem | 像散文一样不押韵、又有诗意的作品 | ＿＿不押韵，形式像散文，内容却像诗。
小品文 | xiǎo pǐn wén | short essay | 短小的散文 | 这本书收了作者写的五十篇＿＿，每篇都很短。
报告文学 | bào gào wén xué | reportage | 真实地报道人和事的文学作品 | 这部＿＿真实地记录了科学家们工作的故事。
叙事诗 | xù shì shī | narrative poem | 讲故事的诗 | “木兰诗”是一首有名的＿＿，讲了木兰替父从军的故事。
`,
  },
  {
    theme: ["Techniques of Writing", "写作手法"],
    data: `
伏笔 | fú bǐ | foreshadowing | 前面为后面的情节埋下的线索 | 作者在第一章就埋下了＿＿，到最后才揭开谜底。
衬托 | chèn tuō | to set off | 用别的东西让主要的更突出 | 绿叶＿＿着红花，红花显得更美了。 | 陪衬 映衬
陪衬 | péi chèn | foil | 在旁边让主要事物更突出的东西 | 在这个故事里，他只是一个＿＿，主角是他的妹妹。 | 衬托
映衬 | yìng chèn | to set each other off | 互相对照，显得更美 | 蓝天和白云互相＿＿，美极了。 | 衬托
渲染 | xuàn rǎn | to play up | 用文字着力描写，突出气氛；用水墨或颜色涂抹 | 作者用了很多笔墨＿＿节日的热闹。
排比 | pái bǐ | parallelism of three or more | 用三个以上结构相同的句子 | “我爱春天的花，我爱夏天的雨，我爱秋天的叶”用了＿＿的修辞手法。
设问 | shè wèn | asking and answering | 先提问再自己回答的修辞 | “春天在哪里？春天在孩子们的眼睛里。”这句话用了＿＿。
修辞手法 | xiū cí shǒu fǎ | rhetorical device | 修饰语言的方法，比如比喻、拟人 | 比喻和拟人是两种常见的＿＿。
首尾呼应 | shǒu wěi hū yìng | beginning and end echoing | 文章开头和结尾互相照应 | 这篇文章开头写下雨，结尾也写下雨，做到了＿＿。
承上启下 | chéng shàng qǐ xià | to link what comes before and after | 承接上文，引出下文 | 这一段在文章中起＿＿的作用。
`,
  },
  {
    theme: ["Classical Literature", "古典文学"],
    data: `
离骚 | lí sāo | Li Sao | 屈原写的长诗 | “＿＿”是屈原写的一首长诗，表达了他对国家的热爱。
楚辞 | chǔ cí | the Songs of Chu | 战国时期楚国的一种诗歌，也指收这种诗的书 | ＿＿是以屈原的作品为代表的一种诗歌。
屈原 | qū yuán | Qu Yuan | 战国时期楚国的诗人 | 相传端午节是为了纪念＿＿。
汉赋 | hàn fù | Han rhapsody | 汉代流行的一种讲究文采的文体 | ＿＿是汉代最有代表性的文学形式。
乐府 | yuè fǔ | yuefu | 汉代收集民歌的机构，也指这类诗 | 汉代设立了＿＿，专门收集民间的歌谣。
元曲 | yuán qǔ | Yuan qu | 元代流行的戏曲和散曲 | 唐诗、宋词、＿＿是中国古代文学的三座高峰。
唐宋八大家 | táng sòng bā dà jiā | the Eight Masters of Tang and Song | 唐代和宋代八位著名的散文家 | 韩愈和欧阳修都属于＿＿。
白居易 | bái jū yì | Bai Juyi | 唐代诗人 | ＿＿的诗通俗易懂，据说连老奶奶都能听懂。
陶渊明 | táo yuān míng | Tao Yuanming | 东晋诗人，喜欢写田园生活 | ＿＿辞官回家，写了很多田园诗。
词牌 | cí pái | ci tune name | 填词用的曲调名 | “水调歌头”是一个＿＿的名字。
`,
  },
  {
    theme: ["Songs and Old Writing", "歌谣和古文"],
    data: `
歌谣 | gē yáo | ballad | 民间流传的歌 | 奶奶会唱很多古老的＿＿。 | 民谣
民谣 | mín yáo | folk rhyme | 民间流行的歌谣 | 这首＿＿在当地流传了好几百年。 | 歌谣
童谣 | tóng yáo | nursery rhyme | 儿童唱的歌谣 | 孩子们一边跳绳一边唱＿＿。 | 歌谣
灯谜 | dēng mí | lantern riddle | 写在花灯上让人猜的谜语 | 元宵节晚上，人们一起看花灯、猜＿＿。
词人 | cí rén | ci poet | 写词的作家 | 李清照是宋代有名的女＿＿。
填词 | tián cí | to write lyrics | 按词牌的格式写词；给曲子写歌词 | 这首歌由他作曲，由他的朋友＿＿。
词曲 | cí qǔ | words and music | 歌词和曲子 | 这首歌的＿＿都是他一个人写的。
古文 | gǔ wén | classical prose | 古代的文章，一般指文言文 | 读＿＿要多查字典，明白每个字的意思。
白话文 | bái huà wén | vernacular writing | 用现代口语写的文章 | 一百多年前，很多作家开始用＿＿写作，文章变得更容易懂了。
韵文 | yùn wén | verse | 有韵律的文章 | 诗、词、赋都属于＿＿。
`,
  },
  {
    theme: ["Writers and Their Works", "作家和作品"],
    data: `
散文家 | sǎn wén jiā | essayist | 擅长写散文的作家 | 他是一位＿＿，很少写小说和诗。
文豪 | wén háo | literary giant | 伟大的作家 | 鲁迅被人们称为中国现代文学的大＿＿。
文人 | wén rén | man of letters | 读书写文章的人 | 中国古代的＿＿常常一起喝茶、作诗。
文集 | wén jí | collected works | 把一个人的文章编在一起的书 | 这本＿＿收了他一生写的散文。 | 选集
选集 | xuǎn jí | selected works | 选出一部分作品编成的书 | 这本＿＿只选了他最有名的二十首诗。 | 文集
稿费 | gǎo fèi | author's fee | 写稿得到的报酬 | 他用第一笔＿＿给妈妈买了一件礼物。
书信 | shū xìn | letters | 信 | 他们几十年来一直用＿＿交流。
随笔 | suí bǐ | informal essay | 随手写下的短文 | 他每天晚上都写一篇＿＿，记录自己的想法。
回忆录 | huí yì lù | memoir | 回忆往事的文章或书 | 这位老科学家写了一本＿＿，讲他年轻时的经历。
短篇小说 | duǎn piān xiǎo shuō | short story | 篇幅短的小说 | 这本书收了十篇＿＿，每篇只有几千字。
`,
  },
  {
    theme: ["Reading and Judging", "阅读和评价"],
    data: `
讥讽 | jī fěng | to mock | 用尖刻的话指出别人的缺点 | 他用＿＿的口气说：“你真是太聪明了！” | 讽刺 讥笑
讥笑 | jī xiào | to sneer at | 嘲笑 | 不要＿＿那些犯了错误的同学。 | 讥讽
讽刺 | fěng cì | satire; to satirize | 用夸张、比喻的方法揭露或批评 | 这部小说＿＿了社会上爱慕虚荣的人。 | 讥讽
赏析 | shǎng xī | to appreciate and analyse | 欣赏并分析文学作品 | 今天的语文课，老师带我们＿＿了一首宋词。 | 品味
文学评论 | wén xué píng lùn | literary criticism | 评价文学作品的文章或学问 | 他在大学里研究＿＿，专门分析小说。
品味 | pǐn wèi | to savour | 仔细体会 | 好的诗要慢慢＿＿，才能体会它的美。 | 回味
回味 | huí wèi | to recall with pleasure | 事后回想 | 这次旅行让我＿＿了很久。 | 品味
生动 | shēng dòng | vivid | 有活力，能感动人 | 他讲故事讲得很＿＿，孩子们都听入迷了。
朴实 | pǔ shí | plain | 朴素，不华丽 | 这篇文章的语言很＿＿，但是很感人。
细节 | xì jié | detail | 细小的环节或情节 | 作者通过很多生活＿＿写出了母亲的爱。
`,
  },
];
