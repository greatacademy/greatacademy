// The third quarter of level 9 (docs/chinese-curriculum.md §8.3): units 7 to 9, international affairs, communication and
// the media, and architecture and planning, 90 characters in 9 batches and 470 words in 47 batches. The characters are
// new to levels 1 to 8 and to the first two quarters, chosen first from the common characters still untaught, then from
// the rarest third of GF 0025-2021's advanced band, for what each unit's words need; the words and sentences use only
// the characters of levels 1 to 8 and those taught so far.
//
// A character line as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.
//
// A word line as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches3 are the 9 character batches of units 7 to 9 of level 9, three a unit, in teaching order. */
export const characterBatches3: readonly string[] = [
  // Unit 7: International Affairs.
  `
驻 zhù | to be stationed; to stay | 停留在某地；长期在某地工作 | 住注
晤 wù | to meet | 见面 | 悟语
缔 dì | to conclude (a treaty); to form | 订立；结合 | 帝谛
憾 hàn | regret | 心里感到不满足，觉得可惜 | 撼感 | 惋
惋 wǎn | to sigh with pity | 为别人的不幸叹息 | 碗婉 | 憾
帜 zhì | flag, banner | 旗子 | 织识
勋 xūn | merit, meritorious service | 很大的功劳 | 员动
遏 è | to check, to hold back | 阻止，控制住 | 喝渴
侨 qiáo | person living abroad | 住在国外的人 | 桥娇
柬 jiǎn | card, letter | 信件、请帖、名片等的总称 | 东束
`,
  `
屿 yǔ | small island | 小岛 | 岭屹
滨 bīn | shore, bank | 水边；靠近水边的地方 | 宾浜
昌 chāng | prosperous | 兴盛 | 冒唱
庞 páng | huge | 很大 | 宠龙
弘 hóng | great; to carry forward | 大；使发扬光大 | 引宏
迪 dí | to enlighten, to guide | 开导 | 油笛
夷 yí | level, safe; (in old texts) peoples to the east | 平；平安；古时称东方的民族 | 姨胰
宛 wǎn | winding; as if | 弯弯曲曲；好像 | 碗苑
峻 jùn | high and steep; severe | 山又高又险；严厉 | 俊竣
堪 kān | can bear; may | 能忍受；可以，能够 | 勘湛
`,
  `
瑞 ruì | auspicious, lucky | 吉祥 | 端喘
芬 fēn | fragrance | 香气 | 纷粉
丹 dān | red; pill | 红色；中药做成的颗粒 | 舟丸
菲 fēi | luxuriant and fragrant (of plants) | 花草长得好，有香气 | 非韭
伯 bó | father's elder brother; uncle | 父亲的哥哥；称跟父亲同辈而年纪大的男子 | 柏泊
曼 màn | graceful; long, prolonged | 柔美；长 | 漫慢
莱 lái | goosefoot (a wild herb); used in foreign names | 一种野草；多用于外国地名 | 菜来
缅 miǎn | remote; to think of (the past) | 遥远；回想 | 绵面
甸 diàn | (old) outskirts; used in 缅甸 | 古时称城外的地方；用于地名 | 句旬
嫩 nèn | tender, young | 刚长出来而柔软；不老练 | 嗽漱
`,
  // Unit 8: Communication and the Media.
  `
哗 huá/huā | noise, clamour | 声音大而乱 | 华桦 | 嘈
嘈 cáo | noisy | 声音杂乱 | 槽遭 | 哗
唤 huàn | to call | 叫，喊 | 换焕
诙 huī | humorous | 说话有趣，引人发笑 | 灰恢
侃 kǎn | to chat idly; frank | 闲谈；说话直率 | 侣倡
聆 líng | to listen | 听 | 铃岭
讹 é | erroneous; to extort | 错误；用不正当的手段要钱财 | 化讯
诋 dǐ | to slander | 说别人的坏话 | 抵底
嗅 xiù | to smell, to sniff | 用鼻子闻 | 臭溴
恍 huǎng | suddenly (realize); dim | 忽然；模糊不清 | 晃光
`,
  `
娱 yú | to amuse; amusement | 使快乐；快乐 | 误吴
荧 yíng | glimmering; fluorescent | 微弱的光 | 莹萤
拷 kǎo | to beat; to copy (in 拷贝) | 打；复制 | 烤考
钮 niǔ | button, knob | 衣服上的扣子；器物上可以用手转动或按的东西 | 扭纽
蹭 cèng | to rub; to get (something) for free | 摩擦；占便宜，白得好处 | 增僧
茧 jiǎn | cocoon | 蚕吐丝做成的壳 | 蚕苗
丛 cóng | clump, thicket; collection | 聚在一起的草木；聚在一起的人或东西 | 从坐
澜 lán | big wave | 大的波浪 | 栏烂
撼 hàn | to shake | 摇动 | 憾感
迭 dié | to alternate; repeatedly | 轮流，更换；屡次 | 送失
`,
  `
淹 yān | to flood, to submerge | 被大水盖住 | 掩俺
幌 huǎng | shop sign; pretext | 商店门外挂的标记；借口 | 晃帆
撮 cuō | to pinch; a pinch, a small group | 用手指捏取；用于很少的人或东西 | 撒最
剽 piāo | to rob; nimble | 抢劫；动作快 | 漂票
扒 bā/pá | to hold on to; to dig out; to steal (from a pocket) | 抓住；挖出来；从别人身上偷东西 | 叭趴
揪 jiū | to seize, to pull | 紧紧抓住，拉 | 秋锹
糟 zāo | bad; messy | 坏；乱，没有条理 | 遭槽
甄 zhēn | to examine, to discern | 仔细审查，区分好坏真假 | 瓶瓷
嘶 sī | hoarse; to neigh | 声音沙哑；马叫 | 撕斯
缤 bīn | profuse, as in 缤纷 | 繁多而交错的样子 | 滨宾
`,
  // Unit 9: Architecture and Planning.
  `
檐 yán | eaves | 房顶伸出墙外的部分 | 担瞻
槛 kǎn/jiàn | threshold; railing | 门下的横木；栏杆 | 滥监
匾 biǎn | horizontal inscribed board | 挂在门上或墙上、题着字的长方形木板 | 扁区
帘 lián | curtain | 挂在门窗上用来遮挡的布等 | 帝穿
榫 sǔn | tenon | 木器两部分接合时凸出的部分 | 准隼 | 卯
卯 mǎo | mortise | 木器接合时凹进去的部分 | 卵印 | 榫
翘 qiào/qiáo | to stick up; to raise (the head) | 一头向上抬起；抬起头 | 翅浇
琉 liú | as in 琉璃, glazed tile | 跟“璃”合用，指一种表面有釉的陶制材料 | 流硫
栅 zhà | fence, railings | 用竹、木、铁条等做成的围栏 | 册删 | 篱
篱 lí | hedge, fence of bamboo or twigs | 用竹子或树枝编成的围墙 | 离璃 | 栅
`,
  `
墅 shù | villa | 住宅以外另外建的、带园林的房子 | 野墨
寨 zhài | stockade; mountain village | 防守用的围墙；山区的村子 | 赛塞
坛 tán | altar; raised platform; circles | 古代祭祀用的高台；某一领域 | 坏运
坪 píng | level ground | 平坦的场地 | 平评
炕 kàng | heated brick bed | 北方用砖等砌成、下面可以烧火的床 | 坑抗
窖 jiào | cellar | 储存东西的地洞或地下室 | 窑窗
窝 wō | nest; den | 鸟兽等住的地方；人住的地方 | 祸涡
窄 zhǎi | narrow | 横向的距离小 | 窑诈
橱 chú | cupboard, case | 放东西用的柜子 | 厨树
毯 tǎn | blanket, carpet | 用毛等织成的厚片，可以铺或盖 | 毡毫
`,
  `
塌 tā | to collapse | 倒下或陷下 | 塔踏
坯 pī | unfired brick; semi-finished product | 还没烧过的砖瓦陶器；半成品 | 坏丕
夯 hāng | rammer; to ram | 把地基砸实的工具；用力把土砸实 | 夺奔
砾 lì | gravel | 小石块 | 烁砺
廓 kuò | outline; wide | 物体的外缘；宽大 | 郭廊
巍 wēi | towering | 高大 | 魏魂 | 峨
峨 é | lofty | 山高 | 娥俄 | 巍
矗 chù | to tower, to stand upright | 高高地直立 | 真直
岔 chà | fork (in a road); mistake | 分开的地方；差错 | 盆分
栓 shuān | bolt; plug; hydrant | 门闩，塞子；器物上可以开关的部分 | 拴全
`,
];

/** wordBatches3 are the 47 word batches of units 7 to 9 of level 9, in teaching order. */
export const wordBatches3: readonly LevelWordBatch[] = [
  // Unit 7: International Affairs.
  {
    theme: ["Missions Abroad", "驻外机构"],
    data: `
驻华 | zhù huá | stationed in China | 派到中国、在中国工作的 | 各国＿＿大使馆大多设在北京。
驻外 | zhù wài | stationed abroad | 派到外国、在外国工作的 | 他是一名＿＿记者，已经在非洲工作了五年。
常驻 | cháng zhù | to be permanently posted | 长期留在某地工作 | 公司派他去巴黎，要在那里＿＿三年。
总领事 | zǒng lǐng shì | consul general | 领事馆中级别最高的负责人 | 这位＿＿负责领导设在上海的领事馆，处理当地侨民的事务。
参赞 | cān zàn | counsellor (of an embassy) | 使馆中协助大使工作的高级外交官 | 使馆的文化＿＿负责两国之间的文化交流。
特使 | tè shǐ | special envoy | 为某项特别任务派出的外交代表 | 国家元首不能亲自出席，就派了一位＿＿去参加典礼。
外交使团 | wài jiāo shǐ tuán | diplomatic corps | 驻在一个国家的所有外国外交代表 | 新年招待会上，各国＿＿的成员都应邀出席。
签证官 | qiān zhèng guān | visa officer | 办理签证的官员 | 面试的时候，＿＿问了他去那个国家留学的原因。
外交辞令 | wài jiāo cí lìng | diplomatic language | 外交场合用的客气、委婉的话 | “我们会认真研究”这样的话，常常只是一种＿＿。
外交途径 | wài jiāo tú jìng | diplomatic channels | 用外交的方法解决问题的道路 | 两国同意通过＿＿解决这次贸易纠纷。
`,
  },
  {
    theme: ["Visits and Talks", "访问和会谈"],
    data: `
会晤 | huì wù | to meet (formally) | 正式见面 | 两国领导人将于下个月在北京＿＿。 | 会谈
会谈 | huì tán | talks | 双方或几方坐在一起商谈 | 经过三个小时的＿＿，双方签署了合作协议。 | 会晤
国事访问 | guó shì fǎng wèn | state visit | 国家元首正式的访问 | 这位总统应邀对中国进行了为期三天的＿＿。
回访 | huí fǎng | return visit | 被访问以后再去访问对方 | 去年对方的校长来过我们学校，今年我们的校长去＿＿。
访华 | fǎng huá | to visit China | 到中国访问 | 这位外国总理第一次＿＿时，参观了长城。
访问团 | fǎng wèn tuán | visiting delegation | 为访问组成的团体 | 一个由二十名大学生组成的＿＿明天到达北京。
随行 | suí xíng | to accompany (on a trip) | 跟着一起去 | 总统出访时，有一百多名企业家＿＿。
外宾 | wài bīn | foreign guest | 外国客人 | 博物馆的讲解员用流利的英语为＿＿介绍展品。
致电 | zhì diàn | to send a message (by telegram or phone) | 打电报或打电话给 | 地震发生后，多国领导人＿＿表示慰问。
贺电 | hè diàn | congratulatory telegram | 表示祝贺的电报 | 中国队夺得冠军后，收到了许多＿＿。
`,
  },
  {
    theme: ["Ceremony", "外交礼仪"],
    data: `
国宴 | guó yàn | state banquet | 国家元首或政府首脑招待贵宾的宴会 | ＿＿上的菜不一定很贵，但都很有地方特色。
欢迎仪式 | huān yíng yí shì | welcome ceremony | 欢迎客人时举行的仪式 | 在机场举行的＿＿上，孩子们向客人献上了鲜花。
礼炮 | lǐ pào | gun salute | 举行隆重仪式时放的炮 | 国家元首到达时，鸣＿＿二十一响表示欢迎。
检阅 | jiǎn yuè | to review (troops) | 领导人在仪式上看队伍 | 欢迎仪式上，两国元首一起＿＿了仪仗队。
仪仗队 | yí zhàng duì | guard of honour | 在隆重仪式上排队致敬的队伍 | ＿＿的队员个个身材高大，动作整齐。
旗帜 | qí zhì | flag, banner | 旗子 | 会场四周挂满了各国的＿＿。
勋章 | xūn zhāng | medal, decoration | 国家授给有功劳的人的徽章 | 这位老科学家胸前戴着国家颁发的＿＿。
授勋 | shòu xūn | to confer a decoration | 授予勋章 | 在＿＿仪式上，总统把勋章亲手挂在他们胸前。
外交礼节 | wài jiāo lǐ jié | diplomatic etiquette | 外交场合应该遵守的礼貌规矩 | 按照＿＿，主人要到门口迎接来访的客人。
请柬 | qǐng jiǎn | invitation card | 邀请客人用的帖子 | 他收到了一张大使馆国庆招待会的＿＿。
`,
  },
  {
    theme: ["Treaties", "条约和公约"],
    data: `
缔结 | dì jié | to conclude (a treaty) | 订立条约或建立关系 | 中日两国在一九七八年＿＿了和平友好条约。
缔约国 | dì yuē guó | state party | 签订条约的国家 | 所有＿＿都必须遵守这份条约的规定。
缔造 | dì zào | to found, to create | 创立，建立 | 和平需要各国共同＿＿和维护。
公约 | gōng yuē | convention; pact | 国家之间或团体里大家共同订立的规定 | 我们班制定了一份文明＿＿，贴在教室的墙上。 | 国际公约
国际公约 | guó jì gōng yuē | international convention | 多个国家共同签订的条约 | 保护湿地的＿＿已经有一百七十多个国家加入。 | 公约 议定书
议定书 | yì dìng shū | protocol | 国家之间对某些问题达成一致后签订的文件 | 一九九七年，各国在日本京都通过了一份减少温室气体排放的＿＿。 | 国际公约
备忘录 | bèi wàng lù | memorandum | 记下双方共同意见的文件 | 两所大学签署了合作＿＿，准备互派学生。
联合声明 | lián hé shēng míng | joint statement | 两国或几国共同发表的声明 | 会谈结束后，两国发表了＿＿，宣布正式建立外交关系。
南极条约 | nán jí tiáo yuē | the Antarctic Treaty | 规定南极只用于和平目的的条约 | 根据＿＿，南极只能用于和平目的和科学研究。
巴黎协定 | bā lí xié dìng | the Paris Agreement | 二零一五年通过的应对气候变化的协定 | 二零一五年，近二百个国家通过了＿＿，共同应对气候变化。
`,
  },
  {
    theme: ["International Organizations", "国际组织"],
    data: `
安理会 | ān lǐ huì | the Security Council | 联合国安全理事会的简称 | 联合国＿＿由十五个理事国组成。
常任理事国 | cháng rèn lǐ shì guó | permanent member (of the Security Council) | 在安理会里长期担任理事的国家 | 安理会有五个＿＿，中国是其中之一。
会员国 | huì yuán guó | member state | 参加某个组织的国家 | 联合国现在有一百九十三个＿＿。
观察员 | guān chá yuán | observer | 可以参加会议但没有表决权的代表 | 有些国家以＿＿的身份参加会议，可以发言，但不能投票。
世界卫生组织 | shì jiè wèi shēng zǔ zhī | World Health Organization | 联合国负责国际卫生工作的机构 | ＿＿的总部设在瑞士日内瓦。
世贸组织 | shì mào zǔ zhī | World Trade Organization | 世界贸易组织的简称 | 中国在二零零一年加入了＿＿。
国际奥委会 | guó jì ào wěi huì | International Olympic Committee | 负责奥运会的国际组织 | ＿＿决定由哪座城市举办奥运会。
非政府组织 | fēi zhèng fǔ zǔ zhī | non-governmental organization | 不属于政府的社会组织 | 这家＿＿不靠政府的钱，主要靠社会捐款开展工作。
国际组织 | guó jì zǔ zhī | international organization | 由多个国家参加的组织 | 世界卫生组织是一个重要的＿＿。
否决权 | fǒu jué quán | veto | 能使决议不能通过的权力 | 安理会常任理事国都有＿＿。
`,
  },
  {
    theme: ["Summits", "峰会和会议"],
    data: `
峰会 | fēng huì | summit | 首脑会议 | 这次＿＿有二十多个国家的元首和政府首脑参加。 | 年会
年会 | nián huì | annual meeting | 每年举行一次的会议 | 这个国际组织每年十二月召开＿＿，总结一年的工作。 | 峰会
东道主 | dōng dào zhǔ | host | 请客的主人；举办活动的一方 | 作为＿＿，中国热情地接待了各国代表。 | 主办国
主办国 | zhǔ bàn guó | host country | 举办会议或活动的国家 | 二零二二年世界杯足球赛的＿＿是卡塔尔。 | 东道主
轮值主席 | lún zhí zhǔ xí | rotating chair | 由成员轮流担任的主席 | 安理会的＿＿每个月换一次。
提案 | tí àn | proposal, motion | 提交会议讨论的建议 | 代表们可以向大会提交＿＿，供大家讨论。 | 决议
决议 | jué yì | resolution | 会议通过的决定 | 联合国大会通过了＿＿，把每年六月八日定为世界海洋日。 | 提案
一致通过 | yí zhì tōng guò | to pass unanimously | 全部同意而通过 | 这项决定在会上得到了＿＿，没有一个人反对。
达成共识 | dá chéng gòng shí | to reach consensus | 取得一致的看法 | 经过三天讨论，各方终于在减排目标上＿＿。
遗憾 | yí hàn | regret; regrettable | 没有达到心愿而感到可惜 | 会议没能达成协议，主办方表示很＿＿。
`,
  },
  {
    theme: ["Principles", "原则和秩序"],
    data: `
和平共处 | hé píng gòng chǔ | peaceful coexistence | 不同的国家和平地共同存在 | 不同制度的国家也可以＿＿。
互不干涉 | hù bù gān shè | non-interference | 互相不管对方的内部事务 | 各国应该＿＿内政。
平等互利 | píng děng hù lì | equality and mutual benefit | 地位平等，对双方都有好处 | 两国的贸易建立在＿＿的基础上。 | 互利共赢
互利共赢 | hù lì gòng yíng | mutual benefit, win-win | 互相得利，共同取得成功 | 合作的目的是＿＿，而不是一方得利、一方吃亏。 | 平等互利
睦邻友好 | mù lín yǒu hǎo | good-neighbourliness | 跟邻国和睦、友好地相处 | 中国和周边国家保持着＿＿的关系。
多边主义 | duō biān zhǔ yì | multilateralism | 主张多个国家共同商量解决国际问题 | 坚持＿＿，就是要大家一起商量，而不是由一个国家说了算。
单边 | dān biān | unilateral | 只有一方的 | 一个国家＿＿提高关税，往往会引起贸易伙伴的不满。
国际秩序 | guó jì zhì xù | international order | 国家之间相处的规则和状态 | 维护公正合理的＿＿，需要各国共同努力。
国际法 | guó jì fǎ | international law | 调整国家之间关系的法律 | 按照＿＿，一个国家的领海宽度不超过十二海里。
繁荣昌盛 | fán róng chāng shèng | prosperous and flourishing | 经济发达，国家兴旺 | 新年到了，祝愿我们的国家＿＿，人民幸福。
`,
  },
  {
    theme: ["The World Stage", "国际局势"],
    data: `
国际关系 | guó jì guān xì | international relations | 国家和国家之间的关系 | 他在大学里学的是＿＿专业，毕业后进了外交部。
国际形势 | guó jì xíng shì | international situation | 世界上各国之间关系的总的情况 | 当前＿＿复杂多变，各国需要加强合作。
国际社会 | guó jì shè huì | the international community | 世界各国的总称 | 这场大地震牵动着整个＿＿，各国纷纷派来救援队。
国际地位 | guó jì dì wèi | international standing | 一个国家在世界上的位置和影响 | 随着经济的发展，这个国家的＿＿不断提高。
紧张局势 | jǐn zhāng jú shì | tension | 双方关系紧张的情况 | 两国领导人通了电话，希望缓和边境的＿＿。
争端 | zhēng duān | dispute | 引起争论的事情 | 国家之间的＿＿应该通过和平的方式解决。
遏制 | è zhì | to curb, to contain | 控制住，不让发展 | 各国联手＿＿病毒的传播。
严峻 | yán jùn | severe, grim | 严重，不容乐观 | 全球气候变暖的形势十分＿＿。
化险为夷 | huà xiǎn wéi yí | to turn danger into safety | 使危险变为平安 | 多亏双方及时沟通，这场危机才＿＿。
堪称 | kān chēng | can be called | 可以称作 | 这次会晤＿＿两国关系史上的一件大事。
`,
  },
  {
    theme: ["Overseas Chinese", "华侨"],
    data: `
华侨 | huá qiáo | overseas Chinese | 住在外国的中国人 | 很多＿＿把钱捐回家乡，修学校、建医院。 | 侨胞
侨胞 | qiáo bāo | compatriots living abroad | 住在外国的同胞 | 春节期间，大使馆邀请当地的＿＿一起包饺子。 | 华侨
侨乡 | qiáo xiāng | hometown of many overseas Chinese | 很多人出国谋生的家乡 | 广东江门是有名的＿＿，那里很多人家都有亲戚在国外。
归侨 | guī qiáo | returned overseas Chinese | 回国定居的华侨 | 他父亲以前是华侨，五十年代从印尼回国，在厦门定居，成了一名＿＿。
侨居 | qiáo jū | to live abroad | 住在外国 | 她年轻时＿＿法国，晚年才回到故乡。
撤侨 | chè qiáo | to evacuate nationals | 把住在外国的本国人接回国 | 那个国家发生了大地震，政府紧急＿＿，用飞机把三千多人接回了国内。
外侨 | wài qiáo | foreign resident | 住在本国的外国人 | 这座城市住着不少来自欧洲和美洲的＿＿。
民间交往 | mín jiān jiāo wǎng | people-to-people exchange | 普通人之间的来往 | 国家关系的基础是人民的友谊，所以要多开展＿＿。
友好城市 | yǒu hǎo chéng shì | sister city | 两个国家的城市之间结成友好关系的城市 | 北京和东京在一九七九年结为＿＿。
庞大 | páng dà | huge | 很大 | 东南亚的华人群体十分＿＿，人数超过三千万。
`,
  },
  {
    theme: ["Cultural Exchange", "文化交流"],
    data: `
人文交流 | rén wén jiāo liú | cultural and people-to-people exchange | 在教育、文化、旅游等方面的往来 | 互派留学生是两国＿＿的重要内容。
孔子学院 | kǒng zǐ xué yuàn | Confucius Institute | 在外国开设的、教中文和介绍中国文化的机构 | 他在本国的＿＿学了两年中文，后来到北京留学。
汉语热 | hàn yǔ rè | Chinese-learning boom | 很多人学习汉语的潮流 | 随着中国经济的发展，世界上出现了＿＿。
交换生 | jiāo huàn shēng | exchange student | 两所学校互相派去学习的学生 | 她作为＿＿，在日本的一所大学学习了一年。
访问学者 | fǎng wèn xué zhě | visiting scholar | 到外国大学或研究机构短期研究的学者 | 王教授去年在英国的一所大学做了一年＿＿。
弘扬 | hóng yáng | to carry forward, to promote | 使发扬光大 | 这个艺术节的目的是＿＿传统文化。
启迪 | qǐ dí | to enlighten; enlightenment | 开导，使有所领悟 | 这次出国交流给了我很多＿＿，让我看到了不同的生活方式。
文化差异 | wén huà chā yì | cultural difference | 不同文化之间的不同 | 在有的国家点头表示同意，在有的国家却表示不同意，这就是＿＿。
文化冲击 | wén huà chōng jī | culture shock | 到新的文化环境时感到的不适应 | 刚到国外的时候，很多留学生都会经历＿＿，感到孤独和不习惯。
惋惜 | wǎn xī | to feel sorry for | 对别人的不幸表示可惜 | 这位翻译家没来得及译完最后一本书就去世了，大家都十分＿＿。
`,
  },
  {
    theme: ["Trade", "国际贸易"],
    data: `
贸易额 | mào yì é | trade volume | 买进卖出的总金额 | 这两个国家去年的＿＿比前年增长了百分之十。
贸易顺差 | mào yì shùn chā | trade surplus | 出口比进口多的差额 | 一个国家出口多、进口少，就会出现＿＿。
贸易逆差 | mào yì nì chā | trade deficit | 进口比出口多的差额 | 进口比出口多的情况叫作＿＿。
贸易伙伴 | mào yì huǒ bàn | trading partner | 互相做买卖的国家或地区 | 中国是很多国家最大的＿＿。
贸易壁垒 | mào yì bì lěi | trade barrier | 限制外国商品进入的措施 | 提高关税是一种常见的＿＿。
反倾销 | fǎn qīng xiāo | anti-dumping | 反对外国商品用很低的价格大量出售 | 如果外国商品用低于成本的价格大量出售，本国可以进行＿＿调查。
外汇储备 | wài huì chǔ bèi | foreign exchange reserves | 国家持有的外国货币等 | 中国的＿＿多年来居世界第一。
引进外资 | yǐn jìn wài zī | to attract foreign investment | 吸引外国的资金到本国 | 为了＿＿，这个城市为外国企业提供了很多便利。
经济特区 | jīng jì tè qū | special economic zone | 实行特殊经济政策的地区 | 厦门是中国最早的＿＿之一。
中欧班列 | zhōng ōu bān liè | China–Europe Railway Express | 中国和欧洲之间定期开行的货运列车 | 坐＿＿，货物从重庆运到德国只要十几天。
`,
  },
  {
    theme: ["Aid and Development", "援助和发展"],
    data: `
对外援助 | duì wài yuán zhù | foreign aid | 帮助别的国家 | 中国的＿＿帮许多国家修建了公路和医院。
援建 | yuán jiàn | to help build | 帮助建设 | 这座体育场是中国＿＿的，当地人都叫它“友谊体育场”。
人道主义 | rén dào zhǔ yì | humanitarianism | 关心人、尊重人的思想 | 红十字会的工作体现了＿＿精神。
国际救援 | guó jì jiù yuán | international rescue | 多个国家参加的救援工作 | 地震发生后，十几个国家派人参加了＿＿。
救援队 | jiù yuán duì | rescue team | 进行救援的队伍 | ＿＿带着搜救犬，连夜赶到了地震灾区。
捐助 | juān zhù | to donate | 拿出钱或东西帮助 | 很多人＿＿衣服和食物，帮助受灾的人。
粮食安全 | liáng shí ān quán | food security | 人人都能得到足够的粮食 | 保障＿＿，是每个国家都要面对的问题。
减贫 | jiǎn pín | poverty reduction | 减少贫困 | 中国的＿＿经验得到了国际社会的关注。
维和 | wéi hé | peacekeeping | 维持和平 | 中国是派出＿＿人员最多的安理会常任理事国。
发展中国家 | fā zhǎn zhōng guó jiā | developing country | 经济还不太发达的国家 | 很多＿＿需要更多的资金和技术来发展经济。
`,
  },
  {
    theme: ["Land and Sea", "领土和海洋"],
    data: `
领土 | lǐng tǔ | territory | 一个国家拥有的土地 | 俄罗斯是世界上＿＿面积最大的国家。
领海 | lǐng hǎi | territorial waters | 属于一个国家的沿海水域 | ＿＿的宽度从海岸基线算起，一般是十二海里。
领空 | lǐng kōng | airspace | 一个国家领土和领海上面的天空 | 外国飞机进入一个国家的＿＿，需要得到允许。
主权 | zhǔ quán | sovereignty | 国家独立处理内外事务的权力 | 每个国家，不论大小，都应该尊重别国的＿＿。
岛屿 | dǎo yǔ | islands | 海里大大小小的岛 | 印度尼西亚由一万多个＿＿组成。
群岛 | qún dǎo | archipelago | 海里聚在一起的许多岛 | 夏威夷＿＿位于太平洋中部。
内陆国 | nèi lù guó | landlocked country | 没有海岸线的国家 | 蒙古是一个＿＿，四周都没有海。
专属经济区 | zhuān shǔ jīng jì qū | exclusive economic zone | 沿海国家在领海以外享有资源权利的海域 | 沿海国家的＿＿从海岸基线算起，最远到二百海里。
滨海 | bīn hǎi | coastal, by the sea | 靠近海边的 | 青岛是一座美丽的＿＿城市。
宛如 | wǎn rú | just like | 好像 | 从飞机上往下看，那些小岛＿＿撒在海上的珍珠。
`,
  },
  {
    theme: ["Crossing Borders", "出入境"],
    data: `
边境 | biān jìng | border area | 靠近国界的地方 | 这个小镇在中越＿＿，每天都有很多越南商人来做生意。 | 国界
国界 | guó jiè | national boundary | 国家和国家的分界线 | 这条河就是两国的＿＿，河的对岸是另一个国家。 | 边境
边检 | biān jiǎn | border inspection | 边防检查 | 过＿＿的时候，要把护照交给工作人员检查。
出入境 | chū rù jìng | entry and exit (of a country) | 出国和进入国境 | 办护照要到公安局的＿＿管理部门。
免签 | miǎn qiān | visa-free | 不用办签证 | 两国互相＿＿以后，去旅游连签证都不用办了。
落地签 | luò dì qiān | visa on arrival | 到了目的地机场再办的签证 | 去这个国家不用提前办签证，可以到机场办＿＿。
过境 | guò jìng | to transit | 经过某国国境 | 去欧洲的时候，我们在迪拜＿＿，停留了四个小时。
跨境 | kuà jìng | cross-border | 跨越国境的 | 现在很多人在网上买外国商品，＿＿电商发展得很快。
申报 | shēn bào | to declare (at customs) | 向有关部门报告 | 带的现金超过规定数额的，入境时要向海关＿＿。
倒时差 | dǎo shí chā | to get over jet lag | 适应新地方的时间 | 刚到美国的几天，他忙着＿＿，白天总是想睡觉。
`,
  },
  {
    theme: ["Global Challenges", "全球问题"],
    data: `
气候变化 | qì hòu biàn huà | climate change | 地球气候长期的变化 | ＿＿让冰川融化，海平面上升。
温室气体 | wēn shì qì tǐ | greenhouse gas | 使地球变暖的气体 | 二氧化碳是一种主要的＿＿。
减排 | jiǎn pái | to cut emissions | 减少废气等的排放 | 为了＿＿，很多城市大力发展电动汽车。
可持续发展 | kě chí xù fā zhǎn | sustainable development | 既满足现在的需要又不损害将来的发展 | ＿＿要求我们不能为了眼前的利益破坏环境。
跨境传播 | kuà jìng chuán bō | cross-border spread | 跨越国境的传播 | 防止传染病的＿＿，需要各国合作。
核不扩散 | hé bú kuò sàn | nuclear non-proliferation | 不让核武器扩散到更多的国家 | 世界上大多数国家都加入了＿＿条约。
外太空 | wài tài kōng | outer space | 地球大气层以外的空间 | ＿＿属于全人类，只能用于和平目的。
公海 | gōng hǎi | the high seas | 不属于任何国家的海域 | 在＿＿上，各国的船都可以自由航行。
极地 | jí dì | polar regions | 地球南北两端的地区 | 科学家在＿＿研究冰层，了解地球过去的气候。
和平利用 | hé píng lì yòng | peaceful use | 用于和平的目的 | 各国应该＿＿核能，用它来发电。
`,
  },
  {
    theme: ["Countries and Regions", "国家和地区"],
    data: `
瑞士 | ruì shì | Switzerland | 欧洲中部的一个国家，首都伯尔尼 | ＿＿是一个山地国家，以手表和巧克力闻名。
瑞典 | ruì diǎn | Sweden | 北欧的一个国家，首都斯德哥尔摩 | 除了和平奖，诺贝尔奖的颁奖典礼都在＿＿首都斯德哥尔摩举行。
芬兰 | fēn lán | Finland | 北欧的一个国家，首都赫尔辛基 | ＿＿有“千湖之国”的美称，境内有十几万个湖泊。
丹麦 | dān mài | Denmark | 北欧的一个国家，首都哥本哈根 | 童话作家安徒生是＿＿人。
菲律宾 | fēi lǜ bīn | the Philippines | 东南亚的一个群岛国家 | ＿＿由七千多个岛屿组成，首都是马尼拉。
缅甸 | miǎn diàn | Myanmar | 东南亚的一个国家，跟中国云南相邻 | ＿＿和中国云南省相邻，两国边境上的居民来往很多。
文莱 | wén lái | Brunei | 东南亚加里曼丹岛北部的一个小国 | ＿＿是东南亚的一个小国，石油资源丰富。
黎巴嫩 | lí bā nèn | Lebanon | 西亚的一个国家，在地中海东岸 | ＿＿位于地中海东岸，首都是贝鲁特。
阿拉伯 | ā lā bó | Arab, Arabia | 西亚和北非的一些民族和地区 | 我们常用的＿＿数字，其实是古代印度人发明的。
曼谷 | màn gǔ | Bangkok | 泰国的首都 | 泰国的首都是＿＿。
`,
  },
  // Unit 8: Communication and the Media.
  {
    theme: ["Voices and Noise", "声音和喧闹"],
    data: `
喧哗 | xuān huá | to make a racket | 大声说话，声音杂乱 | 图书馆里请不要大声＿＿。
嘈杂 | cáo zá | noisy | 声音杂乱 | 这家饭馆环境＿＿，不适合谈事情。
哗然 | huá rán | in an uproar | 很多人吵吵嚷嚷，表示惊讶或不满 | 这条假新闻被揭穿后，舆论一片＿＿。
声嘶力竭 | shēng sī lì jié | to shout oneself hoarse | 嗓子喊哑了，力气也用完了 | 球迷们＿＿地为自己的球队加油。
嘶哑 | sī yǎ | hoarse | 声音沙哑 | 他连续讲了三个小时的课，嗓子都＿＿了。
聆听 | líng tīng | to listen attentively | 认真地听 | 同学们安静地坐着，＿＿老教授的报告。
呼唤 | hū huàn | to call out to | 大声叫；召唤 | 妈妈在门口＿＿孩子回家吃饭。
唤起 | huàn qǐ | to arouse | 引起（注意、回忆等） | 这部纪录片＿＿了人们对保护野生动物的关注。
音量 | yīn liàng | volume | 声音的大小 | 晚上看电视时，请把＿＿调小一点。
音质 | yīn zhì | sound quality | 声音的好坏 | 这副耳机的＿＿很好，听音乐时就像在音乐厅里一样。
`,
  },
  {
    theme: ["Ways of Talking", "说话的方式"],
    data: `
诙谐 | huī xié | humorous | 说话有趣，引人发笑 | 他说话＿＿，常常把大家逗得哈哈大笑。
调侃 | tiáo kǎn | to tease, to make fun of | 用话开玩笑、嘲弄 | 他喜欢＿＿自己，说自己胖得像只熊猫。
侃侃而谈 | kǎn kǎn ér tán | to speak with ease and confidence | 说话从容，不慌不忙 | 面对记者，这位年轻的科学家＿＿，一点也不紧张。
哗众取宠 | huá zhòng qǔ chǒng | to play to the gallery | 用夸张的言行讨好众人 | 有些网络节目故意说些怪话，只是为了＿＿。
夸大其词 | kuā dà qí cí | to exaggerate | 说话说得超过了事实 | 这则广告＿＿，说吃了这种药三天就能长高。 | 添油加醋
添油加醋 | tiān yóu jiā cù | to embellish (a story) | 叙述时加上原来没有的内容 | 他把听到的事＿＿地讲给别人听，越传越离谱。 | 夸大其词
以讹传讹 | yǐ é chuán é | to pass on an error | 把本来就错的话又错误地传出去 | 这个错误的说法在网上＿＿，很多人都信以为真。
诋毁 | dǐ huǐ | to slander | 说别人的坏话，破坏别人的名誉 | 他在网上发文章＿＿同行，后来被告上了法庭。
恍然大悟 | huǎng rán dà wù | to suddenly see the light | 一下子明白过来 | 听了老师的解释，我才＿＿，原来是我把题目看错了。
乱七八糟 | luàn qī bā zāo | in a mess | 非常乱，没有条理 | 他的房间里＿＿，书和衣服扔了一地。
`,
  },
  {
    theme: ["Newspapers and Magazines", "报纸和杂志"],
    data: `
创刊 | chuàng kān | to start publication | 报刊开始出版 | 这份报纸＿＿于一九四九年，至今已有七十多年的历史。
停刊 | tíng kān | to cease publication | 报刊停止出版 | 由于读者越来越少，这本杂志去年＿＿了。
复刊 | fù kān | to resume publication | 停止出版后又开始出版 | 这份停办了十年的报纸今年终于＿＿了。
创刊号 | chuàng kān hào | first issue | 报刊出版的第一期 | 他收藏了这本杂志的＿＿，现在已经很值钱了。
合订本 | hé dìng běn | bound volume | 把一段时间的报刊订在一起的本子 | 图书馆里有这份报纸几十年的＿＿，可以查到过去的新闻。
号外 | hào wài | extra (edition) | 有重大新闻时临时出版的报纸 | 北京获得奥运会举办权的那天晚上，很多报社都出了＿＿。
副刊 | fù kān | supplement | 报纸上登载文艺作品等的版面 | 他写的散文常常发表在报纸的文艺＿＿上。
丛书 | cóng shū | series of books | 在一个总名下出版的一套书 | 这套科普＿＿共有二十本，每本讲一个科学问题。
出版物 | chū bǎn wù | publication | 出版的书报杂志等 | 所有＿＿都必须注明出版单位和出版时间。
畅销书 | chàng xiāo shū | bestseller | 卖得很好的书 | 这本小说上市一个月就卖了五十万本，成了＿＿。
`,
  },
  {
    theme: ["The Newsroom", "编辑部"],
    data: `
稿件 | gǎo jiàn | manuscript, article | 写好的文章、作品 | 编辑每天要看几十篇读者寄来的＿＿。
约稿 | yuē gǎo | to commission an article | 请作者写稿 | 杂志社向这位作家＿＿，请他写一篇关于童年的散文。
审稿 | shěn gǎo | to review a manuscript | 审查稿件 | 论文投出去以后，要经过专家＿＿才能发表。
退稿 | tuì gǎo | to reject a manuscript | 把不用的稿件退回作者 | 他年轻时投出的小说多次被＿＿，但他没有放弃。
截稿 | jié gǎo | to close for copy; deadline | 停止收稿 | 这期杂志明天中午＿＿，你的文章今天一定要写完。
编辑部 | biān jí bù | editorial office | 负责编辑工作的部门 | 读者有意见，可以写信寄给杂志的＿＿。
总编辑 | zǒng biān jí | editor-in-chief | 负责全部编辑工作的人 | 每天的头版放什么新闻，最后由＿＿决定。
责任编辑 | zé rèn biān jí | editor in charge (of a book) | 负责某本书或某篇稿子编辑工作的人 | 这本书的＿＿对每一句话都仔细核对过。
撰稿人 | zhuàn gǎo rén | writer, contributor | 为报刊等写文章的人 | 他是好几家杂志的特约＿＿，专门写旅行文章。 | 专栏作家
专栏作家 | zhuān lán zuò jiā | columnist | 在报刊上固定写专栏的作家 | 她是这家报纸的＿＿，每周写一篇关于教育的文章。 | 撰稿人
`,
  },
  {
    theme: ["Reporters", "记者"],
    data: `
采编 | cǎi biān | to gather and edit (news) | 采访和编辑 | 他在报社负责新闻＿＿工作，又要出去采访，又要编辑稿件。 | 采写
采写 | cǎi xiě | to gather and write (news) | 采访并写作 | 这篇报道是两名记者花了一个月＿＿的。 | 采编
记者站 | jì zhě zhàn | news bureau | 新闻单位设在外地的采访机构 | 这家报社在全国三十多个城市设有＿＿。
通讯社 | tōng xùn shè | news agency | 搜集新闻、向报刊电台等供稿的机构 | 新华社是中国的国家＿＿。
通讯员 | tōng xùn yuán | (part-time) correspondent | 为报刊电台等写稿的非专业人员 | 他是学校的小＿＿，经常给校报写稿。
特约记者 | tè yuē jì zhě | special correspondent | 报社特别邀请的、不是正式员工的记者 | 这位旅行家是杂志的＿＿，每到一个国家就发回一篇报道。
实习记者 | shí xí jì zhě | trainee reporter | 正在实习的记者 | 她大学还没毕业，现在是电视台的＿＿。
采访对象 | cǎi fǎng duì xiàng | interviewee | 被采访的人 | 记者要尊重＿＿，不能随便公开他们的隐私。
专访 | zhuān fǎng | exclusive interview | 专门就某个问题对某个人进行的采访 | 获奖以后，这位作家接受了电视台的＿＿。
新闻嗅觉 | xīn wén xiù jué | nose for news | 发现新闻的敏锐能力 | 好记者要有灵敏的＿＿，能从小事里发现大新闻。
`,
  },
  {
    theme: ["Kinds of Reports", "新闻报道"],
    data: `
独家报道 | dú jiā bào dào | exclusive report | 只有一家媒体发表的报道 | 这条消息是这家报纸的＿＿，别的报纸都没有。
深度报道 | shēn dù bào dào | in-depth report | 深入分析事件原因和影响的报道 | 这篇＿＿用了一万多字，分析了城市交通拥堵的原因。
连续报道 | lián xù bào dào | serial reports | 对同一件事接连发表的报道 | 这家报纸对这件事做了＿＿，一共发了十二篇文章。
现场报道 | xiàn chǎng bào dào | on-the-spot report | 记者在事情发生的地方做的报道 | 记者冒着大雨，在洪水边做＿＿。
快讯 | kuài xùn | news flash | 很快发出的简短消息 | 比赛一结束，网站就发出了＿＿：中国队获胜。 | 简讯
简讯 | jiǎn xùn | news in brief | 简短的消息 | 报纸第二版有一栏＿＿，每条只有几十个字。 | 快讯
通稿 | tōng gǎo | press release, wire copy | 统一发给各媒体的稿件 | 很多报纸用的是同一份＿＿，所以内容几乎一模一样。
新闻发布会 | xīn wén fā bù huì | press conference | 向记者发布消息的会 | 外交部每个工作日都举行例行＿＿。
答记者问 | dá jì zhě wèn | to answer reporters' questions | 回答记者提出的问题 | 发言人在发布会上＿＿，介绍了这次访问的情况。
新闻界 | xīn wén jiè | the press | 从事新闻工作的人的总称 | 这位老记者在＿＿工作了四十年，很受同行尊敬。
`,
  },
  {
    theme: ["Sources and Truth", "消息和真相"],
    data: `
消息来源 | xiāo xi lái yuán | source (of news) | 新闻是从哪里得到的 | 这条新闻没有说明＿＿，很难判断是真是假。
知情人 | zhī qíng rén | insider, informed person | 了解内情的人 | 据一位＿＿说，这家公司下个月要发布新手机。
传言 | chuán yán | rumour | 传来传去的、不一定真实的话 | ＿＿说学校要放假一个星期，后来证明是假的。 | 虚假新闻
失实 | shī shí | inaccurate | 跟事实不符合 | 这篇报道内容＿＿，报社已经公开道歉。
虚假新闻 | xū jiǎ xīn wén | fake news | 不真实的新闻 | 在网上发布＿＿，是要承担法律责任的。 | 传言
事实核查 | shì shí hé chá | fact-checking | 检查消息是不是真的 | 有些媒体专门做＿＿，帮助读者分辨真假消息。
甄别 | zhēn bié | to screen, to discern | 仔细审查，区分真假好坏 | 面对网上大量的信息，我们要学会＿＿真假。
一小撮 | yì xiǎo cuō | a handful (of people) | 很少的一部分（多指坏人） | 散布谣言的只是＿＿人，大多数网友都很理智。
扒 | bā | to dig up (online) | 挖出来，多指在网上找出别人的旧事 | 网友把这位演员十年前的旧照片都＿＿了出来。
揪出 | jiū chū | to ferret out | 找出来并抓住 | 警方很快就＿＿了在网上造谣的人。
`,
  },
  {
    theme: ["Entertainment", "娱乐"],
    data: `
娱乐 | yú lè | entertainment | 使人快乐的活动 | 周末他的主要＿＿是看电影和打球。
娱乐圈 | yú lè quān | show business | 演员、歌手等组成的圈子 | 她十六岁进入＿＿，已经拍了二十多部电影。
娱乐新闻 | yú lè xīn wén | entertainment news | 有关演员、歌手等的新闻 | 他对明星的事不感兴趣，从来不看＿＿。
文娱 | wén yú | recreation and entertainment | 文化娱乐 | 学校每周五下午组织＿＿活动，有唱歌、跳舞，也有下棋。
自娱自乐 | zì yú zì lè | to amuse oneself | 自己使自己快乐 | 爷爷退休后学会了拉二胡，每天在家＿＿。
综艺节目 | zōng yì jié mù | variety show | 有唱歌、游戏、表演等多种内容的电视节目 | 周末晚上，电视上有很多＿＿，又唱又跳，非常热闹。
真人秀 | zhēn rén xiù | reality show | 拍摄普通人真实生活或比赛的节目 | 这档＿＿拍的是几个城市孩子去农村生活一个月的经历。
选秀 | xuǎn xiù | talent show | 从很多人里选出有才能的新人的比赛 | 她是通过一个唱歌＿＿节目出名的。
脱口秀 | tuō kǒu xiù | talk show; stand-up comedy | 一个人对着观众随口讲笑话的表演 | 这位演员的＿＿很幽默，台下的观众笑个不停。
嘉宾 | jiā bīn | guest | 被邀请参加节目或活动的客人 | 今天节目的＿＿是一位著名的科学家。
`,
  },
  {
    theme: ["On the Air", "播出"],
    data: `
收视率 | shōu shì lǜ | (TV) ratings | 看某个电视节目的观众的比例 | 这部电视剧的＿＿很高，几乎家家都在看。
收听率 | shōu tīng lǜ | (radio) ratings | 听某个广播节目的人的比例 | 早上开车上班的人多，这个时段的广播＿＿最高。
转播 | zhuǎn bō | to relay (a broadcast) | 播送别的电台、电视台的节目 | 全国很多电视台同时＿＿了这场足球比赛。
录播 | lù bō | to broadcast a recording | 先录下来，以后再播出 | 这个节目不是直播，是＿＿的，所以出了错可以重新录。
重播 | chóng bō | to rerun | 再一次播出 | 昨晚的节目我没看到，幸好今天下午＿＿。
首播 | shǒu bō | to premiere | 第一次播出 | 这部纪录片将在下周六晚上＿＿。
黄金时段 | huáng jīn shí duàn | prime time | 收看人数最多的时段 | 晚上七点到十点是电视的＿＿，广告费也最贵。
卫视 | wèi shì | satellite TV (channel) | 通过卫星播送节目的电视台 | 很多省级＿＿的节目在全国都能看到。
广播电台 | guǎng bō diàn tái | radio station | 播送广播节目的机构 | 他在＿＿当主持人，每天晚上主持一个音乐节目。
调频 | tiáo pín | FM | 一种无线电广播的方式 | 收音机要调到＿＿九十七点四，才能收到这个台。
`,
  },
  {
    theme: ["Film and Television", "影视制作"],
    data: `
片头 | piàn tóu | opening titles | 电影或电视剧开头的部分 | 这部电视剧的＿＿只有三十秒，音乐很好听。
片尾 | piàn wěi | end credits | 电影或电视剧结尾的部分 | 电影放完以后，＿＿会列出所有工作人员的名字。
主题曲 | zhǔ tí qǔ | theme song | 一部电影或电视剧的主要歌曲 | 这部动画片的＿＿，很多孩子都会唱。 | 插曲
插曲 | chā qǔ | interlude; episode | 电影或电视剧中间插入的歌曲；事情进行中的小事 | 比赛中出现了一个小＿＿：一只小狗跑进了球场。 | 主题曲
演职员 | yǎn zhí yuán | cast and crew | 演员和工作人员 | 电影拍完那天，全体＿＿一起吃饭庆祝。
摄像师 | shè xiàng shī | cameraman | 用摄像机拍摄的人 | 节目开始前，＿＿把摄像机对准了主持人。
剪辑师 | jiǎn jí shī | film editor | 把拍好的镜头剪接成片的人 | ＿＿把几百个小时的素材剪成了两个小时的电影。
后期制作 | hòu qī zhì zuò | post-production | 拍摄完成后的剪辑、配音等工作 | 电影已经拍完了，现在正在做＿＿，明年春天上映。
纪录片 | jì lù piàn | documentary | 记录真实事情的影片 | 这部关于大熊猫的＿＿拍了整整三年。
拷贝 | kǎo bèi | to copy; copy (of a film or file) | 复制；复制品 | 我把照片从手机里＿＿到了电脑上。
`,
  },
  {
    theme: ["Devices", "设备"],
    data: `
收音机 | shōu yīn jī | radio (set) | 接收广播的机器 | 爷爷每天早上一边散步，一边用＿＿听新闻。
录音机 | lù yīn jī | tape recorder | 录下和放出声音的机器 | 以前学外语，很多人用＿＿反复听磁带。
摄像机 | shè xiàng jī | video camera | 拍摄活动画面的机器 | 记者背着＿＿，跑到了事故现场。
麦克风 | mài kè fēng | microphone | 把声音变大或录下来的用具 | 主持人拿起＿＿，宣布晚会开始。
扬声器 | yáng shēng qì | loudspeaker | 把电信号变成声音放出来的装置 | 广场上的＿＿正在播放音乐。
天线 | tiān xiàn | antenna | 接收或发射无线电信号的装置 | 以前很多人家的屋顶上都装着电视＿＿。
按钮 | àn niǔ | button | 用手按的开关 | 按一下这个红色＿＿，机器就会停下来。
旋钮 | xuán niǔ | knob | 用手转动的开关 | 转动收音机上的＿＿，就能找到别的电台。
有线电视 | yǒu xiàn diàn shì | cable television | 用电缆传送节目的电视 | 装了＿＿以后，家里能看到一百多个频道。
荧光屏 | yíng guāng píng | fluorescent screen | 显像管前面会发光的屏 | 老式电视机的＿＿是凸出来的，后面还有一个大大的“肚子”。
`,
  },
  {
    theme: ["Screens and Pictures", "屏幕和画面"],
    data: `
显示屏 | xiǎn shì píng | display (screen) | 显示文字和图像的屏幕 | 车站的＿＿上显示着每列火车的出发时间。 | 大屏幕
触摸屏 | chù mō píng | touch screen | 用手指点就能操作的屏幕 | 这台机器用的是＿＿，用手指点一点就能买票。
大屏幕 | dà píng mù | big screen | 很大的屏幕 | 广场上的＿＿正在直播比赛，很多人站着看。 | 显示屏 荧屏
横屏 | héng píng | landscape (screen) | 把手机横过来看的方式 | 看视频时把手机横过来，用＿＿看画面更大。
分辨率 | fēn biàn lǜ | resolution | 屏幕或图像清晰的程度 | 这张照片的＿＿是一千九百二十乘一千零八十。
像素 | xiàng sù | pixel | 组成数字图像的最小单位 | 把照片放得很大，就能看到一个个小方块，每个小方块就是一个＿＿。
高清 | gāo qīng | high definition | 画面非常清楚 | 这场比赛进行了＿＿直播，连球员的表情都看得清清楚楚。
画质 | huà zhì | picture quality | 画面的好坏 | 这部老电影经过修复，＿＿比原来好多了。
荧屏 | yíng píng | the (TV) screen; television | 电视屏幕，也指电视 | 这位老演员已经很多年没有出现在＿＿上了。 | 大屏幕
五彩缤纷 | wǔ cǎi bīn fēn | colourful | 颜色多而好看 | 晚会上的灯光＿＿，把舞台照得很漂亮。
`,
  },
  {
    theme: ["Online Platforms", "网络平台"],
    data: `
公众号 | gōng zhòng hào | official account | 在社交软件上向大众发布信息的账号 | 学校开通了微信＿＿，每天发布校园新闻。
推送 | tuī sòng | to push (content) | 主动把信息发给用户 | 手机每天给我＿＿几十条新闻，我根本看不过来。
评论区 | píng lùn qū | comment section | 网上发表评论的地方 | 这条视频下面的＿＿里有几千条留言。 | 留言板
留言板 | liú yán bǎn | message board | 网站上让人留言的地方 | 学校网站上有一个＿＿，学生可以给校长提建议。 | 评论区
置顶 | zhì dǐng | to pin (to the top) | 把帖子等固定在最上面 | 这条重要通知被＿＿了，一打开网页就能看到。
删帖 | shān tiě | to delete a post | 删掉网上的帖子 | 这条帖子内容不实，网站已经＿＿。
转帖 | zhuǎn tiě | to repost | 把别人的帖子转发到别处 | 他看到一篇好文章，就＿＿到了自己的博客上。
拉黑 | lā hēi | to block (someone) | 把某人列入黑名单，不再联系 | 那个人总是给她发广告，她就把他＿＿了。 | 屏蔽
屏蔽 | píng bì | to block, to filter | 挡住，不让显示 | 这个软件可以＿＿广告，让网页更干净。
迭代 | dié dài | to iterate (versions) | 一次又一次地更新换代 | 这款软件＿＿得很快，几乎每个月都有新版本。
`,
  },
  {
    theme: ["Attention", "流量和关注"],
    data: `
点击率 | diǎn jī lǜ | click-through rate | 网页或广告被点开的比例 | 这个广告的＿＿只有百分之一，一百个看到的人里只有一个点开了。
浏览量 | liú lǎn liàng | page views | 网页被看的次数 | 这篇文章发出一天，＿＿就超过了十万。 | 播放量
播放量 | bō fàng liàng | play count, views | 视频或音乐被播放的次数 | 这首歌的视频＿＿已经超过一亿次。 | 浏览量
发行量 | fā xíng liàng | circulation | 报刊等发行的数量 | 这份报纸的日＿＿最高时达到一百万份。
蹭热度 | cèng rè dù | to ride on a trend | 借热门话题让自己出名 | 有的商家借着热门新闻＿＿，发一些跟新闻毫无关系的广告。
吸引眼球 | xī yǐn yǎn qiú | to catch the eye | 引起人们的注意 | 为了＿＿，有的文章标题写得很夸张。
营销号 | yíng xiāo hào | marketing account | 为了赚钱发布内容的网络账号 | 很多＿＿为了赚钱，专门编造离奇的故事。
造势 | zào shì | to build hype | 为某事制造声势 | 新电影上映前，公司花了大量的钱宣传＿＿。
推波助澜 | tuī bō zhù lán | to add fuel to the fire | 推动坏的事情发展 | 网上的谣言越传越广，一些媒体也在＿＿。
震撼 | zhèn hàn | to shock, to stun; stunning | 使人心里受到强烈的冲击 | 这部纪录片的画面非常＿＿，让人久久不能忘记。
`,
  },
  {
    theme: ["Advertising", "广告"],
    data: `
软广告 | ruǎn guǎng gào | advertorial, soft advertising | 不直接说是广告的宣传 | 这篇文章看起来像新闻，其实是一则＿＿。
广告词 | guǎng gào cí | advertising copy | 广告里说的话 | 这句牛奶的＿＿简单好记，很多人都会说。 | 口号
广告牌 | guǎng gào pái | billboard | 写着或画着广告的大牌子 | 高速公路两边立着很多巨大的＿＿。
植入广告 | zhí rù guǎng gào | product placement | 在电影、电视剧里不知不觉地放进的广告 | 这部电视剧里，主人公总是喝同一个牌子的饮料，这就是＿＿。
代言人 | dài yán rén | spokesperson | 替企业或产品做宣传的人 | 这位运动员是一家运动鞋公司的形象＿＿。
品牌形象 | pǐn pái xíng xiàng | brand image | 一个品牌给人的印象 | 产品质量出了问题，会严重损害公司的＿＿。
宣传片 | xuān chuán piàn | promotional film | 用来宣传的影片 | 这座城市拍了一部旅游＿＿，在电视上反复播放。
传单 | chuán dān | leaflet, flyer | 印着宣传内容、发给人看的纸 | 新开的饭店派人在路口发＿＿。
口号 | kǒu hào | slogan | 简短有力、供喊或宣传的话 | 运动会上，同学们高喊着＿＿走过主席台。 | 广告词
幌子 | huǎng zi | pretext, front | 借口；商店门外的招牌 | 他们打着“免费体检”的＿＿，其实是为了卖保健品。
`,
  },
  {
    theme: ["Media Literacy", "媒介素养"],
    data: `
媒介素养 | méi jiè sù yǎng | media literacy | 正确地使用和判断各种媒体信息的能力 | 学校开设了＿＿课，教学生怎样分辨网上信息的真假。
信息茧房 | xìn xī jiǎn fáng | information cocoon | 只看自己感兴趣的信息，像被蚕茧包住一样 | 如果只看自己喜欢的内容，人就容易陷入＿＿。
算法推荐 | suàn fǎ tuī jiàn | algorithmic recommendation | 软件根据用户的习惯自动推荐内容 | ＿＿让我们总是看到同一类内容。
信息过载 | xìn xī guò zài | information overload | 接收的信息太多，处理不过来 | 每天收到几百条消息，很多人感到＿＿，反而什么也记不住。
淹没 | yān mò | to submerge, to drown out | 被水盖过；被大量的东西盖住 | 真实的声音常常被大量的谣言＿＿。
深度阅读 | shēn dù yuè dú | deep reading | 认真、深入地读书 | 刷短视频代替不了＿＿，好书还是要静下心来读。
数字鸿沟 | shù zì hóng gōu | digital divide | 会用和不会用网络的人之间的差距 | 很多老人不会用智能手机，这就是一种＿＿。
新闻伦理 | xīn wén lún lǐ | journalism ethics | 新闻工作者应该遵守的道德规范 | 偷拍别人的私生活来写新闻，违反了＿＿。
名誉权 | míng yù quán | right of reputation | 名声不受侵害的权利 | 在网上捏造事实诋毁别人，侵犯了别人的＿＿。
剽窃 | piāo qiè | to plagiarize | 把别人的作品当作自己的 | 他的论文大段＿＿别人的研究成果，被学校取消了学位。
`,
  },
  // Unit 9: Architecture and Planning.
  {
    theme: ["Timber Frames", "木构建筑"],
    data: `
屋檐 | wū yán | eaves | 房顶伸出墙外的部分 | 下雨了，我们站在＿＿下面躲雨。
飞檐翘角 | fēi yán qiào jiǎo | upturned eaves and corners | 屋顶的四角高高向上抬起 | 这座古楼＿＿，看起来像一只要飞起来的鸟。
琉璃瓦 | liú li wǎ | glazed tile | 表面有釉的瓦 | 故宫的屋顶铺着金黄色的＿＿。
屋脊 | wū jǐ | ridge (of a roof) | 屋顶中间高起的部分 | 古建筑的＿＿上常常立着一排小兽。
斗拱 | dǒu gǒng | dougong bracket | 中国古建筑中柱子和横梁之间一层层托起的木构件 | ＿＿是中国古代木构建筑特有的构件，能把屋顶的重量传到柱子上。
横梁 | héng liáng | crossbeam | 横着架在柱子上的梁 | 架在两根柱子上的那根＿＿，撑起了整个屋顶。
立柱 | lì zhù | upright column | 竖立的柱子 | 大殿前面有四根红色的＿＿，上面雕着龙。
榫卯 | sǔn mǎo | mortise and tenon | 木构件之间一凸一凹的连接方式 | 古代的木匠用＿＿把木头连在一起，一根钉子也不用。
雕梁画栋 | diāo liáng huà dòng | carved beams and painted rafters | 房屋上雕着花纹、画着彩画，形容建筑华丽 | 这座王府＿＿，十分华丽。
木结构 | mù jié gòu | timber structure | 用木头做主要支撑的结构 | 中国古代的宫殿大多是＿＿，很怕失火。
`,
  },
  {
    theme: ["Gates and Courtyards", "门庭和院落"],
    data: `
门槛 | mén kǎn | threshold | 门下面的横木；也比喻进入某个范围的条件 | 老房子的门口有一道高高的＿＿，进门时要抬起脚。
门帘 | mén lián | door curtain | 挂在门上的帘子 | 夏天，很多人家在门口挂一块＿＿，挡住蚊子。
窗帘 | chuāng lián | (window) curtain | 挂在窗户上的帘子 | 早上，她拉开＿＿，阳光一下子照进了房间。
匾额 | biǎn é | inscribed board | 挂在门上或墙上、题着字的横牌 | 老店门口挂着一块＿＿，上面写着店名。
门楼 | mén lóu | gatehouse | 大门上面像楼一样的建筑 | 这户人家的＿＿很高大，可以看出主人从前很有钱。
照壁 | zhào bì | screen wall | 大门外面或里面正对大门的墙 | 走进大门，迎面是一道＿＿，挡住了外面人的视线。
天井 | tiān jǐng | courtyard, light well | 房子中间露天的空地 | 南方的老房子中间常有一个小＿＿，雨水从四面的屋顶流进来。
回廊 | huí láng | winding corridor | 曲折环绕的走廊 | 园子里有一条长长的＿＿，下雨天也可以在里面散步。
栅栏 | zhà lan | fence, railings | 用木头、铁条等做成的围栏 | 公园的草地四周围着一圈白色的＿＿。
竹篱 | zhú lí | bamboo fence | 用竹子编成的围墙 | 农家小院用＿＿围着，院子里种着各种蔬菜。
`,
  },
  {
    theme: ["Folk Dwellings", "民居"],
    data: `
民居 | mín jū | folk dwelling | 老百姓住的房子 | 各地的＿＿风格不同，反映了当地的气候和生活习惯。
吊脚楼 | diào jiǎo lóu | stilt house | 一部分悬空、用柱子撑着的木楼 | 贵州山区的很多＿＿一半建在山坡上，一半用木柱撑在空中。 | 竹楼
土楼 | tǔ lóu | earthen building (tulou) | 用土墙建成的大型住宅 | 福建的＿＿又大又圆，一座楼里能住几十户人家。
竹楼 | zhú lóu | bamboo house | 用竹子建成的楼房 | 云南南部天气热，那里的一些民族住在＿＿里，楼下通风，楼上住人。 | 吊脚楼
石库门 | shí kù mén | shikumen (Shanghai lane house) | 上海一种老式住宅 | ＿＿是上海特有的老房子，大门是用石头做门框的。
骑楼 | qí lóu | arcade building | 楼房下层向外伸出一部分，下面可以走人 | 广州的老街上有很多＿＿，下雨天走在下面也不怕雨。
徽派建筑 | huī pài jiàn zhù | Huizhou-style architecture | 安徽南部一带的传统建筑风格 | 白墙黑瓦、马头墙是＿＿的特点。
火炕 | huǒ kàng | heated brick bed | 下面可以烧火取暖的炕 | 东北的冬天很冷，很多农村人家睡＿＿。
土坯 | tǔ pī | sun-dried mud brick | 用泥土做成的没有烧过的砖 | 以前村里的房子大多是用＿＿盖的。
村寨 | cūn zhài | village (esp. in mountains) | 村子，多指山区的村落 | 这个苗族＿＿建在山坡上，有一千多户人家。
`,
  },
  {
    theme: ["Palaces and Temples", "宫殿和庙宇"],
    data: `
天坛 | tiān tán | the Temple of Heaven | 北京的一组古建筑，古代皇帝在那里祭天 | ＿＿的祈年殿是圆形的，屋顶铺着蓝色的琉璃瓦。
祭坛 | jì tán | altar | 祭祀用的台子 | 古人在＿＿上摆放祭品，祭祀天地。
殿堂 | diàn táng | palace hall; temple of (art etc.) | 宫殿、庙宇中高大的房屋；比喻某个领域里最高的地方 | 经过多年的努力，他终于走进了艺术的＿＿。
佛塔 | fó tǎ | pagoda | 佛教建筑中的塔 | 西安的大雁塔是一座有名的＿＿，已经有一千多年的历史。
角楼 | jiǎo lóu | corner tower | 建在城墙四个角上的楼 | 故宫城墙的四个角上各有一座＿＿，造型非常精巧。
亭台楼阁 | tíng tái lóu gé | pavilions, terraces and towers | 各种供人游玩、休息的建筑 | 园子里＿＿，小桥流水，景色十分优美。
巍峨 | wēi é | towering, lofty | 高大雄伟 | 站在山下，抬头就能看到＿＿的宫殿。
矗立 | chù lì | to stand tall | 高高地直立 | 一座座高楼＿＿在江边。
古建筑 | gǔ jiàn zhù | ancient architecture | 古代留下来的建筑 | 这座城市保存着很多明清时期的＿＿。
峨眉山 | é méi shān | Mount Emei | 四川的一座名山 | ＿＿在四川，山上有很多古老的寺庙。
`,
  },
  {
    theme: ["Gardens and Parks", "园林和公园"],
    data: `
苏州园林 | sū zhōu yuán lín | the gardens of Suzhou | 苏州的古典园林 | ＿＿面积不大，但是假山、水池、花木样样都有。
曲径通幽 | qū jìng tōng yōu | a winding path leads to a quiet place | 弯弯曲曲的小路通到安静美丽的地方 | 园中的小路绕过假山，通向一片竹林，真是＿＿。
借景 | jiè jǐng | borrowed scenery | 把园子外面的景色引进园子里来 | 这座园林用了＿＿的方法，把远处的山和塔也变成了园中的风景。
草坪 | cǎo píng | lawn | 种着草的平地 | 请爱护＿＿，不要在上面踩。
花坛 | huā tán | flower bed | 种花的、高出地面的土台 | 广场中央有一个圆形的＿＿，里面开满了各种颜色的花。
人工湖 | rén gōng hú | artificial lake | 人工挖成的湖 | 公园中间的＿＿是十年前挖的，现在湖边已经长满了树。
湿地公园 | shī dì gōng yuán | wetland park | 建在湿地上的公园 | 这个＿＿里有很多水鸟，是观鸟的好地方。
口袋公园 | kǒu dai gōng yuán | pocket park | 建在城市小块空地上的小公园 | 街角的那块空地变成了一个＿＿，附近的老人常去那里坐坐。
喷泉 | pēn quán | fountain | 向上喷水的装置 | 广场上的＿＿随着音乐喷出高高的水柱。
观景台 | guān jǐng tái | viewing platform | 供人观看风景的平台 | 站在山顶的＿＿上，可以看到整座城市。
`,
  },
  {
    theme: ["Building Styles", "建筑风格"],
    data: `
哥特式 | gē tè shì | Gothic | 欧洲中世纪的一种建筑风格，有尖顶和高窗 | 巴黎圣母院是＿＿建筑的代表。
巴洛克 | bā luò kè | Baroque | 十七世纪欧洲的一种艺术风格，装饰华丽 | ＿＿建筑装饰华丽，常常有很多曲线和雕刻。
罗马式 | luó mǎ shì | Romanesque | 欧洲中世纪早期的一种建筑风格，墙厚，窗小 | ＿＿教堂的墙很厚，窗户很小，里面比较暗。
现代主义 | xiàn dài zhǔ yì | modernism | 二十世纪主张简洁、实用的一种建筑思潮 | 二十世纪流行的＿＿建筑反对多余的装饰，讲究实用。
极简 | jí jiǎn | minimalist | 极其简单 | 这套公寓装修得很＿＿，房间里除了一张床和一张桌子，几乎什么也没有。
地中海风格 | dì zhōng hǎi fēng gé | Mediterranean style | 地中海沿岸常见的建筑风格，多用白墙和蓝色 | 这家酒店是＿＿的，白色的墙配着蓝色的门窗。
新中式 | xīn zhōng shì | new Chinese style | 把中国传统元素和现代设计结合起来的风格 | 这套房子装修成了＿＿，既有传统的味道，又很舒适。
尖顶 | jiān dǐng | spire | 尖形的屋顶 | 这座教堂的＿＿高高地伸向天空。
圆顶 | yuán dǐng | dome | 圆形的屋顶 | 罗马万神殿的＿＿已经有近两千年的历史了。
传统建筑 | chuán tǒng jiàn zhù | traditional architecture | 一个民族世代流传下来的建筑 | 这个村子很好地保护了＿＿，到现在还没有一座高楼。
`,
  },
  {
    theme: ["Structure and Materials", "结构和材料"],
    data: `
砖木结构 | zhuān mù jié gòu | brick-and-timber structure | 用砖墙和木头做主要承重部分的结构 | 这座老房子是＿＿的，墙是砖砌的，屋顶是木头的。
框架结构 | kuàng jià jié gòu | frame structure | 用梁和柱子组成的框架承重的结构 | 现在的高楼大多采用＿＿，墙只起分隔的作用。
钢筋混凝土 | gāng jīn hùn níng tǔ | reinforced concrete | 里面放了钢筋的混凝土 | 这座大桥是用＿＿建成的，非常坚固。
承重墙 | chéng zhòng qiáng | load-bearing wall | 支撑上面重量的墙 | 装修的时候不能随便拆＿＿，否则楼房会有危险。
打地基 | dǎ dì jī | to lay a foundation | 建房子前先做好下面的基础 | 盖高楼首先要＿＿，基础打得牢，楼才稳。
夯土 | hāng tǔ | rammed earth | 用力砸实的土 | 长城有些地方是用＿＿筑成的，已经有两千多年的历史。
夯实 | hāng shí | to tamp; to consolidate | 用力砸实；比喻打好基础 | 学外语要先＿＿基础，才能越学越好。
青砖 | qīng zhuān | grey brick | 青灰色的砖 | 北京老胡同里的房子，很多是用灰色的＿＿盖的。
红砖 | hóng zhuān | red brick | 红色的砖 | 这所大学的老教学楼是用＿＿砌的，远远看去一片红色。
砾石 | lì shí | gravel | 小石块 | 公园的小路上铺着一层＿＿，走起来沙沙响。
`,
  },
  {
    theme: ["Building Work", "施工和装修"],
    data: `
建筑工地 | jiàn zhù gōng dì | construction site | 正在盖房子的地方 | ＿＿上很危险，没有戴安全帽的人不能进去。
毛坯房 | máo pī fáng | unfinished flat | 没有装修的房子 | 他们买的是＿＿，墙上什么也没有，要自己装修。
精装修 | jīng zhuāng xiū | fully fitted (flat) | 交房时已经装修好 | 这套房子是＿＿的，买了家具就能直接住进去。
防水 | fáng shuǐ | waterproofing; waterproof | 防止水渗透 | 卫生间的地面一定要做好＿＿，不然楼下会漏水。
隔音 | gé yīn | soundproofing; soundproof | 隔断声音 | 这栋楼的＿＿效果不好，邻居说话都能听见。
采光 | cǎi guāng | natural lighting | 让阳光照进房间 | 这套房子朝南，＿＿很好，白天不用开灯。
塌方 | tā fāng | landslide, cave-in | 山体、隧道等突然塌下来 | 大雨过后，山路发生了＿＿，车辆暂时不能通行。
倒塌 | dǎo tā | to collapse | 建筑物倒下来 | 这座老房子年久失修，前几天突然＿＿了，幸好没有人受伤。 | 塌陷
塌陷 | tā xiàn | to subside, to cave in | 地面等向下陷 | 地下的土被雨水冲空以后，路面＿＿了半米。 | 倒塌
建筑面积 | jiàn zhù miàn jī | floor area | 建筑物各层面积的总和 | 这套房子的＿＿是一百平方米，实际使用的面积要小一些。
`,
  },
  {
    theme: ["Floor Plans", "户型"],
    data: `
户型 | hù xíng | flat layout | 住房内部房间的布局 | 买房子不光要看价钱，还要看＿＿好不好。
两室一厅 | liǎng shì yì tīng | two bedrooms and a living room | 两个卧室、一个客厅的住房 | 他们一家三口住在一套＿＿的房子里。
主卧 | zhǔ wò | master bedroom | 最大的卧室 | ＿＿最大，还带一个卫生间，是爸爸妈妈住的。
次卧 | cì wò | second bedroom | 比最大的卧室小的卧室 | 我住的是＿＿，比爸妈的房间小一点。
阳台 | yáng tái | balcony | 楼房伸出墙外的平台 | 奶奶在＿＿上种了很多花。
飘窗 | piāo chuāng | bay window | 向外凸出的窗户 | 她喜欢坐在＿＿上看书，窗外就是公园。
储藏室 | chǔ cáng shì | storeroom | 存放东西的房间 | 不常用的东西都放在＿＿里。
地下室 | dì xià shì | basement | 建在地面以下的房间 | 这栋楼的＿＿以前用来停自行车。
层高 | céng gāo | storey height | 一层楼从地面到上一层地面的高度 | 这套房子的＿＿有三米，比一般的房子高一些。
复式 | fù shì | duplex | 一套住房分为上下两层 | 他家是＿＿的房子，客厅在楼下，卧室在楼上。
`,
  },
  {
    theme: ["Furnishings", "家具和陈设"],
    data: `
橱柜 | chú guì | kitchen cabinet | 厨房里放碗筷等的柜子 | 厨房里的＿＿摆满了碗和盘子。
衣橱 | yī chú | wardrobe | 放衣服的柜子 | 她把冬天的衣服叠好，放进了＿＿。
书橱 | shū chú | bookcase | 放书的柜子 | 爷爷的＿＿里放满了各种各样的书。
橱窗 | chú chuāng | shop window | 商店里陈列商品的玻璃窗 | 商店的＿＿里摆着新款的衣服，吸引了很多路人。
地毯 | dì tǎn | carpet, rug | 铺在地上的毯子 | 客厅里铺着一块厚厚的＿＿，光着脚走在上面很舒服。
挂毯 | guà tǎn | tapestry | 挂在墙上做装饰的毯子 | 墙上挂着一幅＿＿，上面织着雪山和草原。
狭窄 | xiá zhǎi | narrow | 宽度小 | 老城区的街道很＿＿，两辆车很难同时通过。 | 窄小
窄小 | zhǎi xiǎo | narrow and small | 又窄又小 | 他们住在一间＿＿的屋子里，只能放下一张床。 | 狭窄
地窖 | dì jiào | cellar | 储存东西的地洞或地下室 | 冬天，北方的农民把白菜和土豆放在＿＿里。
被窝 | bèi wō | quilt (folded for sleeping) | 睡觉时叠成长筒形的被子 | 冬天的早上，他总是不想从＿＿里出来。
`,
  },
  {
    theme: ["The Skyline", "城市天际线"],
    data: `
摩天大楼 | mó tiān dà lóu | skyscraper | 非常高的高楼 | 迪拜的哈利法塔是目前世界上最高的＿＿。 | 地标建筑
地标建筑 | dì biāo jiàn zhù | landmark building | 能代表一个地方的有名的建筑 | 东方明珠塔是上海的＿＿之一。 | 摩天大楼 观光塔
天际线 | tiān jì xiàn | skyline | 天空和地面建筑相接的线 | 夜晚，江边的高楼亮起灯光，城市的＿＿非常美。
超高层 | chāo gāo céng | super high-rise | 特别高的楼房 | 一般把高度超过一百米的楼房叫作＿＿建筑。
电梯房 | diàn tī fáng | flat in a building with lifts | 装有电梯的楼房里的住房 | 爷爷年纪大了，爬楼梯困难，就搬进了＿＿。
顶层 | dǐng céng | top floor | 最高的一层 | 他住在＿＿，夏天屋里特别热。
底层 | dǐ céng | ground floor | 最低的一层 | 这栋楼的＿＿是商店，二楼以上是住宅。
别墅 | bié shù | villa | 带花园的独立住宅 | 他们在海边买了一栋＿＿，周末去那里度假。
轮廓 | lún kuò | outline, contour | 物体的外缘 | 天快黑了，远处的山只能看到一个模糊的＿＿。
观光塔 | guān guāng tǎ | observation tower | 供人登高观看风景的塔 | 广州塔是一座＿＿，游客可以坐电梯到四百多米高的地方看城市。 | 地标建筑
`,
  },
  {
    theme: ["City Planning", "城市规划"],
    data: `
城市规划 | chéng shì guī huà | urban planning | 对城市发展的总体安排 | 好的＿＿会让居民上班、上学、买东西都很方便。
总体规划 | zǒng tǐ guī huà | master plan | 对全局的长远安排 | 根据这座城市的＿＿，老城区里不能再建高楼。
布局 | bù jú | layout | 对事物的全面安排 | 这个小区的＿＿很合理，每栋楼都能晒到太阳。
功能区 | gōng néng qū | functional zone | 按用途划分的区域 | 这座城市分成了几个＿＿：有的地方住人，有的地方办公，有的地方是工厂。
商业区 | shāng yè qū | commercial district | 商店集中的地区 | 市中心是＿＿，商场和饭店一家挨着一家。
住宅区 | zhù zhái qū | residential area | 主要用来住人的地区 | 工厂不能建在＿＿旁边，免得噪音影响居民。
工业区 | gōng yè qū | industrial zone | 工厂集中的地区 | 城市的＿＿一般建在下风的地方，减少对居民的污染。
开发区 | kāi fā qū | development zone | 为发展经济专门划出来的地区 | 十年前这里还是农田，现在成了经济＿＿，建了很多工厂。
老城区 | lǎo chéng qū | old town | 城市里历史比较长的区域 | ＿＿的街道很窄，但是保留了很多老房子。
卫星城 | wèi xīng chéng | satellite town | 在大城市周围、分担大城市功能的小城市 | 为了减轻市中心的压力，政府在大城市周围建了几座＿＿。
`,
  },
  {
    theme: ["Renewal and Housing", "更新和住房"],
    data: `
旧城改造 | jiù chéng gǎi zào | redevelopment of old districts | 改造城市里的旧区 | 在＿＿中，有价值的老建筑应该保留下来。 | 城市更新
城市更新 | chéng shì gēng xīn | urban renewal | 对城市旧区的改造和更新 | 这个老工厂经过＿＿，变成了一个艺术区。 | 旧城改造
棚户区 | péng hù qū | shanty area | 用简陋材料搭的房子集中的地区 | 经过改造，过去的＿＿变成了整齐的小区。
安置房 | ān zhì fáng | resettlement housing | 为拆迁居民提供的住房 | 拆迁以后，这些居民都搬进了政府建的＿＿。 | 保障房
保障房 | bǎo zhàng fáng | affordable housing | 政府为收入低的家庭提供的住房 | 政府建了一批＿＿，以较低的价格租给收入不高的家庭。 | 安置房
容积率 | róng jī lǜ | floor area ratio | 建筑面积和土地面积的比 | 这个小区的＿＿很低，楼和楼之间有很大的空地。
绿化率 | lǜ huà lǜ | green coverage ratio | 绿地面积占总面积的比例 | 这个小区的＿＿达到了百分之四十，到处是树和草地。
人口密度 | rén kǒu mì dù | population density | 单位面积上的人口数量 | 澳门是世界上＿＿最大的地区之一。
宜居城市 | yí jū chéng shì | liveable city | 适合人居住的城市 | 这座城市空气好、交通方便，被评为＿＿。
智慧城市 | zhì huì chéng shì | smart city | 用网络和数据技术管理的城市 | 在＿＿里，红绿灯可以根据车流自动调整时间。
`,
  },
  {
    theme: ["Roads", "道路交通"],
    data: `
主干道 | zhǔ gàn dào | main road | 城市里主要的大路 | 这条＿＿有八条车道，每天车流不断。
支路 | zhī lù | side road | 从大路分出来的小路 | 大路堵车的时候，可以走旁边的＿＿。
环线 | huán xiàn | ring road | 环绕城市的道路或线路 | 北京有好几条＿＿，二环、三环一圈一圈地围着市中心。
高架桥 | gāo jià qiáo | viaduct, elevated road | 架在空中的道路 | 汽车在＿＿上行驶，下面的路也照常通车。
交通枢纽 | jiāo tōng shū niǔ | transport hub | 几种交通方式交会的地方 | 这个火车站也是一个＿＿，地铁、公交车、长途汽车都在这里停靠。
岔路口 | chà lù kǒu | fork in the road | 道路分开的地方 | 走到＿＿，他不知道该往左还是往右。
斑马线 | bān mǎ xiàn | zebra crossing | 马路上供行人过路的白线 | 过马路要走＿＿，看清红绿灯。
停车场 | tíng chē chǎng | car park | 停放车辆的地方 | 商场地下有一个很大的＿＿，可以停一千辆车。
步行街 | bù xíng jiē | pedestrian street | 只许行人走、不许车通行的街 | 这条＿＿上不许汽车通行，游客可以放心地走来走去。
死胡同 | sǐ hú tòng | dead end | 走不通的胡同 | 我们走进了一条＿＿，只好又退了回来。
`,
  },
  {
    theme: ["Public Facilities", "公共设施"],
    data: `
公共设施 | gōng gòng shè shī | public facilities | 供大家使用的设施 | 公园里的长椅、路灯都是＿＿，大家要爱护。
无障碍设施 | wú zhàng ài shè shī | barrier-free facilities | 方便残疾人、老人使用的设施 | 坡道、盲道和带扶手的厕所都是＿＿。
消防栓 | xiāo fáng shuān | fire hydrant | 供消防车取水的设备 | 路边红色的＿＿是用来灭火的，不能在它前面停车。
坡道 | pō dào | ramp | 有坡度的通道 | 大楼门口修了一条＿＿，坐轮椅的人也能进去。
消防通道 | xiāo fáng tōng dào | fire lane | 着火时消防车走的通道 | ＿＿上不能停车，否则着火时消防车进不来。
应急避难所 | yìng jí bì nàn suǒ | emergency shelter | 发生灾害时人们临时躲避的地方 | 地震发生后，居民们都转移到了附近的＿＿。
停机坪 | tíng jī píng | apron, helipad | 停放飞机的地方 | 医院楼顶有一个＿＿，直升机可以直接把病人送来。
污水处理厂 | wū shuǐ chǔ lǐ chǎng | sewage treatment plant | 把脏水变干净的工厂 | 城市的脏水要先送到＿＿，变干净了才能流进河里。
井盖 | jǐng gài | manhole cover | 盖在地下管道口上的盖子 | 路上的＿＿不见了，留下一个很危险的洞。
社区中心 | shè qū zhōng xīn | community centre | 社区里供居民活动的场所 | 小区的＿＿里有图书室、健身房，还有老人活动室。
`,
  },
];
