// The characters and words of units 1 to 3 of level 8 (docs/chinese-curriculum.md §8.3): communities and social
// issues, research and academia, and industry and farming; 120 characters in 12 batches, none of them taught in levels 1
// to 7, from the middle third by frequency of the advanced band of GF 0025-2021, and 480 words in 48 batches, each unit's
// characters first.
//
// A character line as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.
//
// A word line as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches1 are the 12 character batches of units 1 to 3 of level 8, four a unit, in teaching order. */
export const characterBatches1: readonly string[] = [
  // Unit 1: Communities and Social Issues.
  `
坊 fāng/fáng | lane, neighbourhood; workshop | 城里的小街，街区；做手工的地方 | 访纺
挨 āi/ái | next to, one by one; to suffer | 靠近，一个接一个；遭受 | 埃唉
携 xié | to carry; to take by the hand | 带着；拉着手 | 推摧
撑 chēng | to prop up, to support | 用力顶住，支持 | 掌撞
予 yǔ | to give, to grant | 给 | 矛子
倡 chàng | to advocate, to initiate | 带头提出 | 唱昌
吁 yù/xū | to appeal, to call on | 为某事向大家请求 | 吐芋
蓬 péng | luxuriant; fluffy | 草木长得多而旺；松散 | 逢篷 | 勃
勃 bó | vigorous, thriving | 旺盛的样子 | 脖渤 | 蓬
尤 yóu | especially; outstanding | 特别；突出的 | 龙优
`,
  `
惨 cǎn | miserable, tragic | 让人非常难过的 | 参掺 | 哀
哀 āi | sorrow, grief | 伤心 | 衰衷 | 惨愁
愁 chóu | to worry; sorrow | 担心；忧伤的心情 | 秋揪 | 哀
艰 jiān | hard, difficult | 困难 | 根限
寡 guǎ | few; widowed | 少；死了丈夫的 | 宴穿
悯 mǐn | to pity | 同情，可怜 | 闵闷 | 恤
恤 xù | to pity, to sympathize; relief | 体谅，照顾；救助 | 血洫 | 悯
慨 kǎi | generous; to sigh with feeling | 大方；有感触而叹息 | 概既 | 慷
慷 kāng | generous; impassioned | 大方，不小气；情绪激动 | 康糠 | 慨
乞 qǐ | to beg | 向人要钱或东西 | 气吃
`,
  `
愤 fèn | anger, indignation | 因为不满而生气 | 喷坟
仇 chóu/qiú | hatred; enemy | 很深的恨；恨的人 | 仍九 | 敌
敌 dí | enemy; to oppose | 对抗的一方；抵抗 | 故适 | 仇
骂 mà | to scold, to curse | 用难听的话说人 | 吗妈
嚷 rǎng/rāng | to shout, to yell | 大声喊叫 | 壤让 | 哄
哄 hǒng/hōng/hòng | to coax; uproar | 用好话让人高兴；很多人一起吵闹 | 烘洪 | 嚷
拦 lán | to block, to stop | 挡住不让过去 | 栏兰 | 阻
阻 zǔ | to hinder, to obstruct | 挡住，使不能顺利进行 | 组祖 | 拦妨
妨 fáng | to hinder | 使事情不顺利 | 访防 | 阻
闯 chuǎng | to rush in; to venture | 不顾一切地冲进去；到外面去经历、发展 | 闪问
`,
  `
掩 yǎn | to cover, to hide | 盖住，不让人看见 | 淹俺 | 遮
遮 zhē | to block from view, to shade | 挡住，使看不见 | 庶蔗 | 掩
诱 yòu | to lure, to tempt | 用好处引人去做 | 透绣
贼 zéi | thief | 偷东西的人 | 贱贩
狭 xiá | narrow | 宽度小 | 侠峡 | 隘
隘 ài | narrow; pass | 宽度小；险要的地方 | 溢益 | 狭
陷 xiàn | to sink into; to fall into | 掉进去；落到不利的处境 | 馅焰
避 bì | to avoid | 想办法不遇到 | 壁譬
挽 wǎn | to save (a situation); to pull | 设法使好转；拉 | 晚换
毁 huǐ | to destroy | 破坏，使坏掉 | 毅殿
`,
  // Unit 2: Research and Academia.
  `
础 chǔ | foundation stone, base | 房屋柱子下面的石头；根本 | 砖出
详 xiáng | detailed | 细致完备 | 洋祥
彻 chè | thorough | 通，透 | 切砌
殊 shū | different; special | 不同；特别 | 珠株
泛 fàn | extensive; to float | 广，一般地；漂浮 | 乏芝
仔 zǐ/zǎi | careful; young (of animals) | 细心；幼小的动物 | 好籽
骤 zhòu | sudden; step | 突然；一步一步 | 聚驴
踪 zōng | trace, footprint | 走过留下的痕迹 | 综棕
摘 zhāi | to pick; to take down; to extract | 用手采下；取下；选取 | 滴嫡
罕 hǎn | rare | 很少 | 旱军
`,
  `
矩 jǔ | rule; square (the tool); matrix | 规则；画直角的工具；数学里排成方阵的一组数 | 拒距
函 hán | letter; function (in mathematics) | 信件；数学里的一种对应关系 | 涵凼
贯 guàn | to pass through; consistent | 穿过，连通；从头到尾一样 | 惯贵
搞 gǎo | to do, to work on | 做，干，办 | 稿高
敲 qiāo | to knock; to weigh (words) | 打，击；反复思考 | 高敞
颇 pō | quite, rather | 很，相当地 | 坡破
皆 jiē | all, each | 都 | 背阶
凡 fán | ordinary; every | 平常的；所有的 | 几风
弥 mí | to fill; full; more | 补上；满；更加 | 弦弹
萌 méng | to sprout, to bud | 开始发芽；开始发生 | 明盟
`,
  `
瞬 shùn | an instant | 极短的时间 | 舜瞳
暂 zàn | temporary, for the time being | 时间短，一时 | 渐斩
遂 suì | then; to succeed | 就，于是；如愿 | 逐遗
番 fān | a time, a turn; foreign | 次，回；外国的 | 播翻
竭 jié | to exhaust, to use up | 用完，尽 | 渴喝
纲 gāng | key link; outline | 网上的总绳，比喻事物的主要部分 | 钢刚
粹 cuì | pure; the essence | 不杂；最好的部分 | 醉碎
浩 hào | vast | 盛大，广大 | 造告
惟 wéi | only; to think | 只，仅仅；思考 | 维唯
玄 xuán | profound, mysterious; black | 深奥难懂；黑色 | 弦率
`,
  `
胚 pēi | embryo | 生物刚开始发育的阶段 | 坯杯
霉 méi | mould; bad luck | 东西因为湿热长出的小菌；运气不好 | 梅每
蛙 wā | frog | 一种会跳、会游泳、吃虫子的小动物 | 娃洼
猩 xīng | orangutan, ape | 一种跟人很像的动物 | 星腥
蚁 yǐ | ant | 一种很小、成群生活的虫子 | 蚂议
蝇 yíng | fly (the insect) | 一种会飞、常停在脏东西上的虫子 | 绳蝠
蚂 mǎ/mā/mà | ant (in 蚂蚁); locust (in 蚂蚱) | 和“蚁”一起指一种成群生活的小虫子 | 码妈
苍 cāng | dark green; grey; pale | 深绿色；灰白色 | 仓抢
匹 pǐ | to match; (measure word for horses) | 配得上；用来数马 | 四区
库 kù | storehouse; database | 存放东西的房子；存放资料的地方 | 座车
`,
  // Unit 3: Industry and Farming.
  `
穗 suì | ear (of grain) | 稻、麦等长在茎顶上结果实的部分 | 惠穆
籽 zǐ | seed | 植物的种子 | 仔粉
薯 shǔ | potato, yam | 一类地下长出块根的作物 | 署暑
茎 jīng | stem, stalk | 植物上连着根和叶的部分 | 径经
秆 gǎn | stalk (of grain) | 稻、麦等作物的茎 | 杆旱 | 茎
禾 hé | standing grain, rice plant | 谷类作物的苗 | 木和
秧 yāng | seedling | 植物的幼苗，特别是稻的幼苗 | 映央
耘 yún | to weed | 除去田里的杂草 | 耕云
菇 gū | mushroom | 一类长在地上或树上的大型菌类 | 姑估 | 蘑
蘑 mó | mushroom (in 蘑菇) | 和“菇”一起指一类可以吃的大型菌类 | 磨魔 | 菇
`,
  `
犁 lí | plough | 翻土用的农具 | 梨型
亩 mǔ | mu (a unit of land, about 667 m²) | 土地面积单位，约六百六十七平方米 | 苗宙
锄 chú | hoe; to hoe | 松土、除草的农具；用它松土、除草 | 助铡
筐 kuāng | basket | 用竹子等编的装东西的用具 | 框匡
桶 tǒng | bucket, barrel | 装水等的圆形用具，比较深 | 捅通
棚 péng | shed; greenhouse | 简单搭起来的遮挡风雨的东西 | 朋绷
畜 chù/xù | livestock; to raise (animals) | 人养的动物；喂养 | 蓄富
饲 sì | to raise (animals); feed | 喂养；喂动物的东西 | 词祠 | 喂
粪 fèn | dung, manure | 动物排出的废物 | 粉类
喂 wèi | to feed; hello | 给动物或人东西吃；打招呼的声音 | 畏偎 | 饲
`,
  `
葡 pú | grape (the first character of 葡萄) | 和“萄”一起指一种小而圆、很多颗长在一起的水果 | 匍蒲 | 萄
萄 táo | grape (the second character of 葡萄) | 跟在“葡”后面，指一种小而圆、很多颗长在一起的水果 | 陶淘 | 葡
梨 lí | pear | 一种水分多、味道甜的水果 | 犁利
橘 jú | tangerine | 一种皮薄、容易剥开的水果 | 桔橙
枣 zǎo | jujube, Chinese date | 一种红色的小果子 | 束刺
葱 cōng | spring onion | 一种有辣味、叶子像管子的菜 | 匆聪
蒜 suàn | garlic | 一种有强烈气味的菜，地下部分常用来调味 | 算祘
茄 qié | aubergine | 一种紫色的蔬菜 | 加茹
桑 sāng | mulberry | 一种叶子可以养蚕的树 | 柔桨
蚕 cán | silkworm | 吃桑叶、吐丝的虫 | 蛋吞
`,
  `
锤 chuí | hammer | 敲打东西的工具 | 垂捶
钩 gōu | hook | 弯曲的挂东西的用具 | 构沟
炉 lú | stove, furnace | 烧火的设备 | 护芦
炭 tàn | charcoal | 木头烧成的黑色燃料 | 岸灰
冶 yě | to smelt | 把矿石熔化提取金属 | 治台
窑 yáo | kiln | 烧砖和瓷器的炉子 | 摇谣
罐 guàn | jar, can | 装东西的圆形容器 | 灌权
削 xuē/xiāo | to cut down; to pare | 减少；用刀斜着去掉表面 | 消哨
磷 lín | phosphorus | 一种化学元素 | 鳞邻 | 钾
钾 jiǎ | potassium | 一种化学元素，是金属 | 甲钟 | 磷
`,
];

/** wordBatches1 are the 48 word batches of units 1 to 3 of level 8, sixteen a unit, in teaching order. */
export const wordBatches1: readonly LevelWordBatch[] = [
  // Unit 1: Communities and Social Issues.
  {
    theme: ["Neighbours", "街坊邻里"],
    data: `
街坊 | jiē fang | neighbours | 住在附近的人家 | 我们在这条胡同住了二十年，和＿＿们都很熟。 | 左邻右舍
左邻右舍 | zuǒ lín yòu shè | the people next door | 住在左右两边和周围的人家 | 王大妈为人热心，＿＿有什么困难都愿意找她。 | 街坊
挨家挨户 | āi jiā āi hù | from door to door | 一家一家地，一户也不落下 | 社区工作人员＿＿地通知大家明天停水。
业主 | yè zhǔ | owner (of a flat or property) | 房子等财产的主人 | 这栋楼的＿＿们开会讨论要不要装电梯。
坊间 | fāng jiān | among the people, word on the street | 民间，街头巷尾 | ＿＿流传着很多关于这座老桥的故事。
牌坊 | pái fāng | memorial archway | 古代为纪念人或事建的门形建筑 | 村口立着一座石头＿＿，上面刻着几个大字。
远亲不如近邻 | yuǎn qīn bù rú jìn lín | a neighbour near is better than a relative far away | 住得近的邻居比住得远的亲戚更能帮上忙 | 半夜孩子发烧，是邻居开车送去医院的，真是＿＿。
守望相助 | shǒu wàng xiāng zhù | to look out for one another | 邻里之间互相照看、互相帮助 | 这个小区的居民＿＿，谁家有事大家都来帮忙。
热心肠 | rè xīn cháng | a warm heart; a warm-hearted person | 愿意帮助别人的性格，或有这种性格的人 | 李叔叔是个＿＿，常常帮邻居修自行车。
社区服务 | shè qū fú wù | community services | 为社区居民提供的各种帮助 | 这家＿＿中心为老人提供理发、送饭等帮助。
`,
  },
  {
    theme: ["Helping One Another", "互帮互助"],
    data: `
携手 | xié shǒu | hand in hand, jointly | 手拉着手；一起合作 | 两个社区＿＿举办了一场旧书交换活动。
给予 | jǐ yǔ | to give, to grant | 给（多用于书面） | 学校＿＿了这名学生很多帮助和鼓励。 | 赋予
赋予 | fù yǔ | to endow with, to confer | 交给（重要的权利、任务等） | 法律＿＿每个公民受教育的权利。 | 给予
支撑 | zhī chēng | to prop up, to sustain | 顶住使不倒；勉强维持 | 几根木头＿＿着这间旧房子。
撑腰 | chēng yāo | to back (someone) up | 给人有力的支持 | 有大家给他＿＿，他终于敢把问题说出来了。
帮扶 | bāng fú | to help and support | 帮助和扶持有困难的人 | 这些大学生长期＿＿山区的孩子学习英语。
提携 | tí xié | to guide and promote (a junior) | 在事业上帮助后辈 | 他能有今天的成绩，离不开老师们的＿＿。
携带 | xié dài | to carry (on one's person) | 随身带着 | 乘坐飞机时，不能＿＿太多的液体。
伸出援手 | shēn chū yuán shǒu | to lend a helping hand | 主动去帮助别人 | 看到老人摔倒了，路过的人纷纷＿＿。
互帮互助 | hù bāng hù zhù | to help each other | 你帮我，我帮你 | 同学们＿＿，全班的成绩都提高了。
`,
  },
  {
    theme: ["Calls to Act", "倡议和呼吁"],
    data: `
倡议 | chàng yì | to propose; a proposal | 首先提出建议 | 学生会发出＿＿，请大家节约用水。 | 呼吁 倡导
倡导 | chàng dǎo | to advocate | 带头提出并推动 | 学校一直＿＿“光盘行动”，鼓励大家吃多少点多少。 | 提倡 倡议
提倡 | tí chàng | to encourage, to promote | 指出好处，鼓励大家去做 | 医生＿＿每天至少走路半小时。 | 倡导
呼吁 | hū yù | to appeal, to call on | 向大家请求支持 | 环保组织＿＿人们少用塑料袋。 | 倡议
响应 | xiǎng yìng | to respond to | 用行动表示赞同、支持 | 居民们积极＿＿社区的号召，把垃圾分类放好。
发起 | fā qǐ | to initiate, to launch | 首先提出并开始做 | 这次捐书活动是由几个中学生＿＿的。
动员 | dòng yuán | to mobilize | 发动大家参加某项活动 | 社区＿＿居民们一起打扫小区的卫生。 | 呼吁
联名 | lián míng | jointly signed | 很多人一起签名 | 几十位家长＿＿写信，希望学校门口加装红绿灯。
征集 | zhēng jí | to collect, to call for | 公开寻找并收集 | 图书馆正在＿＿老照片，准备办一个城市历史展览。
公益广告 | gōng yì guǎng gào | public service announcement | 宣传公共道德、不为赚钱的广告 | 地铁里的这则＿＿提醒大家给老人让座。
`,
  },
  {
    theme: ["A Thriving Place", "蓬勃兴旺"],
    data: `
蓬勃 | péng bó | vigorous, booming | 繁荣，旺盛 | 近年来，社区里的各种兴趣小组＿＿发展。
朝气蓬勃 | zhāo qì péng bó | full of youthful vigour | 有生气，有活力 | 操场上的年轻人＿＿，正在打篮球。 | 生机勃勃
生机勃勃 | shēng jī bó bó | full of life | 充满生命力 | 春天来了，公园里的树木花草一片＿＿。 | 欣欣向荣 朝气蓬勃
兴致勃勃 | xìng zhì bó bó | in high spirits | 兴趣很浓 | 孩子们＿＿地听老爷爷讲这条街的历史。
欣欣向荣 | xīn xīn xiàng róng | flourishing | 草木长得旺盛；比喻事业兴旺发达 | 改造以后，这条老街的商店越开越多，一片＿＿的景象。 | 生机勃勃
尤其 | yóu qí | especially | 特别 | 这里的冬天很冷，＿＿是晚上。 | 尤为
尤为 | yóu wéi | particularly | 特别（用在两个字的形容词前） | 这个问题在老城区＿＿突出。 | 尤其
热火朝天 | rè huǒ cháo tiān | in full swing | 场面热烈，情绪高涨 | 大家干得＿＿，一个上午就把公园打扫干净了。 | 红红火火
红红火火 | hóng hóng huǒ huǒ | flourishing, prosperous | 兴旺，热闹 | 他们一家把小饭馆开得＿＿的。
蒸蒸日上 | zhēng zhēng rì shàng | going from strength to strength | 一天比一天兴旺 | 他的小公司办得＿＿，员工已经有一百多人了。 | 红红火火
`,
  },
  {
    theme: ["Hardship", "艰难困苦"],
    data: `
悲惨 | bēi cǎn | miserable, tragic | 处境或遭遇非常痛苦 | 这部电影讲的是一个孤儿＿＿的童年，很多观众都看哭了。
惨重 | cǎn zhòng | heavy (of losses) | 损失非常严重 | 这场大火造成了＿＿的损失。
艰难 | jiān nán | difficult, hard | 困难 | 那几年家里很穷，日子过得非常＿＿。 | 艰苦 艰辛
艰苦 | jiān kǔ | arduous, harsh (of conditions) | 条件差，很辛苦 | 山区学校的条件很＿＿，冬天教室里没有暖气。 | 艰难
艰辛 | jiān xīn | hardships | 艰难辛苦 | 父母为了养活全家，吃尽了＿＿。 | 艰难
艰巨 | jiān jù | arduous, formidable (of a task) | 又难又重 | 修建这条山区公路是一项＿＿的任务。
艰险 | jiān xiǎn | hardships and dangers | 困难和危险 | 登山队员们不怕＿＿，终于登上了山顶。 | 艰难
悲哀 | bēi āi | sad, sorrowful | 伤心 | 一个人失去了梦想，是最大的＿＿。
发愁 | fā chóu | to worry | 因为没有办法而担心 | 他正为找不到便宜的房子＿＿呢。
愁眉苦脸 | chóu méi kǔ liǎn | a worried look | 很苦恼的样子 | 他考试没考好，一整天都＿＿的。
`,
  },
  {
    theme: ["Pity and Generosity", "同情和慷慨"],
    data: `
怜悯 | lián mǐn | to pity | 对别人的不幸表示同情 | 他需要的不是＿＿，而是一个工作的机会。
体恤 | tǐ xù | to show consideration for | 设身处地地体谅和照顾 | 这位老板很＿＿员工，下雨天会让大家早点回家。
慷慨 | kāng kǎi | generous | 大方，舍得拿出自己的东西 | 他很＿＿，常常把自己的书借给同学。
感慨 | gǎn kǎi | to sigh with emotion | 有所感触而叹息 | 回到离开三十年的家乡，他＿＿万千。
乞讨 | qǐ tǎo | to beg (for food or money) | 向别人要钱、要饭 | 城市里设立了救助站，帮助在街头＿＿的人。
乞求 | qǐ qiú | to plead for | 低声下气地请求 | 他用＿＿的眼神看着妈妈，希望再玩一会儿。 | 哀求
哀求 | āi qiú | to implore | 苦苦地请求 | 小狗在门外叫着，好像在＿＿主人让它进来。 | 乞求
孤寡老人 | gū guǎ lǎo rén | elderly people with no family | 没有子女、配偶等亲人照顾的老人 | 社区为＿＿安装了紧急呼叫器。
多寡 | duō guǎ | amount, number | 多少 | 捐款不论＿＿，都是一份心意。
善举 | shàn jǔ | charitable deed | 善良的行为 | 他把奖金全部捐给了学校，这一＿＿感动了很多人。
`,
  },
  {
    theme: ["Anger and Hatred", "愤怒和仇恨"],
    data: `
愤怒 | fèn nù | anger; angry | 非常生气 | 听说有人往河里倒垃圾，村民们非常＿＿。 | 气愤
气愤 | qì fèn | indignant | 生气，不满 | 他说话不算数，让大家很＿＿。 | 愤怒
公愤 | gōng fèn | public outrage | 大众的愤怒 | 这家工厂偷偷排放污水，引起了＿＿。 | 愤怒
愤愤不平 | fèn fèn bù píng | aggrieved and resentful | 觉得不公平而很生气 | 他觉得这次比赛的结果不公平，一直＿＿。
悲愤 | bēi fèn | grief and indignation | 伤心又愤怒 | 看到被大火烧光的森林，他心中充满了＿＿。 | 愤怒
发愤图强 | fā fèn tú qiáng | to work hard to make good | 下定决心，努力向上 | 他从小家里穷，于是＿＿，终于考上了大学。
仇恨 | chóu hèn | hatred | 强烈的恨 | 这部小说告诉我们，＿＿只会带来更多的痛苦。
记仇 | jì chóu | to bear a grudge | 把别人对自己不好的事一直记在心里 | 他从不＿＿，吵完架第二天就和好了。
敌意 | dí yì | hostility | 不友好的想法 | 新来的猫对家里的狗充满了＿＿。 | 仇恨
敌视 | dí shì | to be hostile to | 当作敌人看待 | 这两个村子过去互相＿＿，现在却成了好邻居。
`,
  },
  {
    theme: ["Quarrels and Noise", "吵闹和争执"],
    data: `
辱骂 | rǔ mà | to hurl insults at | 用难听的话骂 | 在网上＿＿别人是不文明的行为。 | 骂人
骂人 | mà rén | to swear at people | 用难听的话说别人 | 有话好好说，不要＿＿。 | 辱骂
挨骂 | ái mà | to get a scolding | 被人骂 | 他把杯子打破了，怕＿＿，不敢告诉妈妈。
嚷嚷 | rāng rang | to shout; to make a fuss | 大声吵闹；到处去说 | 别在楼道里大声＿＿，邻居们都在休息。 | 吵嚷
吵嚷 | chǎo rǎng | to make a racket | 吵闹叫喊 | 门外一片＿＿声，原来是有人在为停车位争吵。 | 嚷嚷
起哄 | qǐ hòng | to jeer, to make trouble for fun | 一群人胡闹，或者故意开玩笑打扰别人 | 他上台唱歌时，台下有几个同学在＿＿。 | 嚷嚷
哄骗 | hǒng piàn | to cheat with lies | 用假话骗人 | 有人打电话＿＿老人，说他的孙子出了事要汇钱。
哄 | hǒng | to coax, to soothe | 用好话或行动让人高兴 | 妈妈好不容易才把哭闹的孩子＿＿睡了。
哄堂大笑 | hōng táng dà xiào | the whole room bursts into laughter | 满屋子的人同时大笑 | 他的一句话让全班同学＿＿。
口角 | kǒu jué | a quarrel | 争吵 | 两位邻居因为一点小事发生了＿＿。
`,
  },
  {
    theme: ["Obstacles", "阻拦和妨碍"],
    data: `
阻拦 | zǔ lán | to hold back | 挡住，不让通过或去做 | 她一定要去山区支教，家里人谁也＿＿不了。 | 阻止 阻挡
阻止 | zǔ zhǐ | to prevent, to stop | 使不能进行 | 老师及时＿＿了两个学生的争吵。 | 阻拦 劝阻 阻挡
阻碍 | zǔ ài | to impede; obstacle | 使不能顺利通过或发展 | 交通不便＿＿了这个山村的发展。 | 妨碍
妨碍 | fáng ài | to get in the way of | 使事情不能顺利进行 | 请把车停好，不要＿＿别人通行。 | 阻碍
不妨 | bù fáng | might as well | 可以这样做，没有什么不好 | 如果你周末有空，＿＿来社区图书馆看看。
阻力 | zǔ lì | resistance | 阻碍前进的力量 | 改革总会遇到一些＿＿，但不能因此停下来。
阻挡 | zǔ dǎng | to block | 挡住 | 大雨也＿＿不了志愿者们服务的热情。 | 阻拦
劝阻 | quàn zǔ | to dissuade | 劝人不要做某事 | 看到有人要在禁止游泳的河边下水，保安马上上前＿＿。
拦截 | lán jié | to intercept | 中途挡住 | 门卫＿＿了一辆想开进学校的外来汽车。 | 阻拦
拦路虎 | lán lù hǔ | stumbling block | 前进路上的困难和障碍 | 生词是阅读中最大的＿＿。
`,
  },
  {
    theme: ["Public Conduct", "公共秩序"],
    data: `
闯红灯 | chuǎng hóng dēng | to run a red light | 在红灯亮时通过路口 | 不管路上有没有车，都不能＿＿。
闯祸 | chuǎng huò | to get into trouble | 引出麻烦或事故 | 小猫又＿＿了，把桌上的花瓶推到了地上。
闯入 | chuǎng rù | to burst into | 突然进入 | 一只野猪＿＿了村民的菜地。
插队 | chā duì | to jump the queue | 不按顺序排队，挤到前面去 | 大家都在排队买票，请不要＿＿。
随地吐痰 | suí dì tǔ tán | to spit on the ground | 在公共场所随便吐口水 | 在公共场所＿＿，既不卫生，也会传播疾病。
违章停车 | wéi zhāng tíng chē | illegal parking | 把车停在不允许停的地方 | 他把车停在了消防通道上，因为＿＿被罚了款。
公德心 | gōng dé xīn | public-spiritedness | 遵守公共道德的意识 | 爱护公共设施是有＿＿的表现。
不文明 | bù wén míng | uncivil | 不符合社会公德 | 在景区的墙上乱刻乱画是一种＿＿的行为。 | 破坏公物
高空抛物 | gāo kōng pāo wù | throwing objects from a height | 从高楼上往下丢东西 | ＿＿非常危险，一个小小的苹果也可能砸伤路人。
破坏公物 | pò huài gōng wù | damaging public property | 损坏公共的东西 | 在公园的椅子上乱刻名字，属于＿＿。 | 不文明
`,
  },
  {
    theme: ["Covering and Hiding", "掩盖和遮挡"],
    data: `
掩盖 | yǎn gài | to cover up | 盖住；隐藏起来 | 谎言＿＿不了事实。 | 掩饰 遮掩 遮盖
掩饰 | yǎn shì | to conceal, to disguise | 设法隐瞒真实的情况或感情 | 他笑了笑，想＿＿自己的紧张。 | 掩盖 遮掩
遮掩 | zhē yǎn | to hide, to keep under wraps | 遮住，不让人知道 | 有了问题就说出来，不必＿＿。 | 掩饰 掩盖
遮挡 | zhē dǎng | to block (light or view) | 挡在前面，使看不见或照不到 | 窗外的大树＿＿了阳光，屋里很暗。 | 遮盖
遮盖 | zhē gài | to cover over | 从上面盖住 | 下了一夜的雪，白雪＿＿了整个院子。 | 掩盖 遮挡
遮阳 | zhē yáng | to shade from the sun | 挡住太阳光 | 夏天出门最好戴一顶＿＿帽。
掩耳盗铃 | yǎn ěr dào líng | to bury one's head in the sand | 比喻自己欺骗自己 | 把问题藏起来不去解决，只是＿＿。 | 掩人耳目
掩人耳目 | yǎn rén ěr mù | to throw dust in people's eyes | 用假象骗人 | 他们换了个名字继续卖假货，不过是为了＿＿。 | 掩耳盗铃
遮风挡雨 | zhē fēng dǎng yǔ | to give shelter | 挡住风和雨；比喻保护 | 这间小屋虽然简陋，但能为过路人＿＿。
掩面 | yǎn miàn | to cover one's face | 用手挡住脸 | 听到这个消息，她＿＿哭了起来。
`,
  },
  {
    theme: ["Temptation and Theft", "诱惑和偷盗"],
    data: `
诱惑 | yòu huò | temptation; to tempt | 吸引人去做不该做的事 | 面对网络游戏的＿＿，他学会了控制自己的时间。
引诱 | yǐn yòu | to lure | 用手段引人去做坏事 | 不法分子常用高额回报＿＿人们投资。 | 诱骗
诱骗 | yòu piàn | to trick | 用好处引诱并欺骗 | 有人以“免费送礼物”为名，＿＿老人买高价保健品。 | 引诱
诱导 | yòu dǎo | to guide, to lead on | 劝说引导 | 老师耐心＿＿学生自己找到答案。
诱人 | yòu rén | tempting | 吸引人 | 面包店里传出＿＿的香味。
盗贼 | dào zéi | robber | 偷东西或抢东西的人 | 警察很快抓到了偷走名画的＿＿。 | 窃贼
窃贼 | qiè zéi | thief | 偷别人东西的人 | 小区装了摄像头以后，＿＿再也不敢来了。 | 盗贼
做贼心虚 | zuò zéi xīn xū | to have a guilty conscience | 做了坏事怕别人知道 | 他一看见警察就跑，真是＿＿。
上当受骗 | shàng dàng shòu piàn | to be taken in | 被人骗了 | 接到陌生电话要先核实，以免＿＿。
防不胜防 | fáng bù shèng fáng | impossible to guard against | 想防也防不过来 | 骗子的手段越来越多，真让人＿＿。
`,
  },
  {
    theme: ["Narrow Views", "狭隘和偏见"],
    data: `
狭隘 | xiá ài | narrow-minded | 心胸、见识不宽广 | 只看到自己的利益，是一种＿＿的想法。
狭小 | xiá xiǎo | cramped | 地方小，不宽敞 | 一家五口住在＿＿的房间里。
狭义 | xiá yì | narrow sense | 范围比较小的意思 | 从＿＿上讲，“文化”指的是文学、艺术等。 | 广义
广义 | guǎng yì | broad sense | 范围比较大的意思 | ＿＿的“文化”包括人类创造的一切。 | 狭义
以貌取人 | yǐ mào qǔ rén | to judge by appearances | 根据外表来判断人 | 不要＿＿，穿着简单的人也可能很有学问。
另眼相看 | lìng yǎn xiāng kàn | to see in a new light | 用不同的眼光看待 | 他在比赛中表现出色，大家都对他＿＿。
排外 | pái wài | exclusive, hostile to outsiders | 排斥外来的人或事 | 这个小镇一点也不＿＿，很欢迎新来的居民。
排斥 | pái chì | to reject, to keep out | 不接受，不让加入 | 新同学刚来时，不应该受到大家的＿＿。 | 排外
坐井观天 | zuò jǐng guān tiān | to have a limited outlook | 比喻眼界小，见识少 | 不出去看看世界，就容易＿＿。 | 少见多怪
少见多怪 | shǎo jiàn duō guài | the less one sees, the more one wonders | 见识少，遇到平常的事也觉得奇怪 | 这种手机在大城市很常见，你真是＿＿。
`,
  },
  {
    theme: ["Traps and Escapes", "陷入和避免"],
    data: `
陷入 | xiàn rù | to fall into, to get caught in | 落到（不利的境地） | 工厂关门以后，他一家＿＿了困境。 | 深陷
深陷 | shēn xiàn | to be deeply caught in | 陷得很深，很难出来 | 他＿＿债务之中，每天都很发愁。 | 陷入
缺陷 | quē xiàn | defect, flaw | 不完美的地方 | 这批汽车有设计＿＿，厂家决定全部召回。
诬陷 | wū xiàn | to frame | 编造假的事实来害人 | 他被人＿＿偷了钱，后来监控证明他是清白的。 | 陷害
陷害 | xiàn hài | to set (someone) up | 设下圈套害人 | 故事里的坏人想＿＿主人公，结果害了自己。 | 诬陷
避免 | bì miǎn | to avoid | 想办法不让某种情况发生 | 为了＿＿迟到，他每天提前半小时出门。
回避 | huí bì | to evade | 让开，不愿面对 | 面对记者的问题，他没有＿＿，而是说出了真实情况。 | 逃避
逃避 | táo bì | to run away from | 离开不愿或不敢面对的事 | 遇到困难不能＿＿，要想办法解决。 | 回避
避难 | bì nàn | to take refuge | 为了不受灾难而去别的地方 | 地震发生后，居民们来到公园的空地上＿＿。
避风港 | bì fēng gǎng | safe haven | 船停下来避开大风的港口；比喻安全的地方 | 家是孩子心中的＿＿。
`,
  },
  {
    theme: ["Saving and Destroying", "挽救和毁坏"],
    data: `
挽救 | wǎn jiù | to save, to rescue | 从危险中救回来 | 医生们全力抢救，终于＿＿了他的生命。 | 挽回
挽回 | wǎn huí | to retrieve, to win back | 设法使不利的情况好转 | 他真诚地道歉，希望能＿＿朋友的信任。 | 挽救
挽留 | wǎn liú | to urge to stay | 请人留下来 | 老师要调到别的学校，同学们一再＿＿他。
毁坏 | huǐ huài | to damage | 破坏，使坏掉 | 有人故意＿＿了公园里的花草。 | 损毁
毁灭 | huǐ miè | to destroy utterly | 完全消灭 | 如果不保护环境，人类可能会＿＿自己的家园。
烧毁 | shāo huǐ | to burn down | 烧坏，烧掉 | 一场大火＿＿了这座百年老屋。
损毁 | sǔn huǐ | to damage beyond use | 损坏到不能用 | 台风过后，村里很多房屋都有不同程度的＿＿。 | 毁坏
销毁 | xiāo huǐ | to destroy (on purpose) | 把东西完全毁掉，让它不能再用 | 这批过期的药品已经被统一＿＿。
毁约 | huǐ yuē | to break an agreement | 不遵守约定 | 对方突然＿＿，让公司损失了一大笔钱。
前功尽弃 | qián gōng jìn qì | all previous efforts wasted | 以前的努力全部白费 | 都练了半年了，现在放弃的话，就＿＿了。
`,
  },
  {
    theme: ["Social Issues", "社会问题"],
    data: `
弱势群体 | ruò shì qún tǐ | disadvantaged groups | 在社会中处于不利地位的人群 | 社会应该给予老人、残疾人等＿＿更多关心。
无家可归 | wú jiā kě guī | homeless | 没有地方住 | 地震过后，很多人＿＿，只好住在帐篷里。
流浪 | liú làng | to wander without a home | 没有固定的住处，到处漂泊 | 这只＿＿猫被一位好心人带回了家。
救助站 | jiù zhù zhàn | relief shelter | 为生活没有着落的人提供帮助的地方 | 天冷了，＿＿的工作人员上街寻找需要帮助的人。
网络暴力 | wǎng luò bào lì | online abuse | 在网上用语言攻击、伤害别人 | 在网上随便骂人、公开别人的隐私，都属于＿＿。
贫困户 | pín kùn hù | poor household | 生活困难的家庭 | 村里的＿＿靠养蜂过上了好日子。
城中村 | chéng zhōng cūn | urban village | 城市里保留下来的旧村子 | 很多刚来城市打工的人住在租金便宜的＿＿里。
外来人口 | wài lái rén kǒu | incoming population | 从外地来的人 | 这座城市的＿＿已经超过了本地人口。
民生 | mín shēng | people's livelihood | 人民的生活 | 住房、教育、医疗都是关系到＿＿的大事。
二手烟 | èr shǒu yān | second-hand smoke | 不吸烟的人吸入别人吐出的烟 | 吸烟不仅伤害自己，＿＿也会伤害身边的人。
`,
  },
  // Unit 2: Research and Academia.
  {
    theme: ["Foundations and Steps", "基础和步骤"],
    data: `
基础 | jī chǔ | foundation, basis | 事物发展的根本或起点 | 学好数学，首先要打好＿＿。 | 根基
基础知识 | jī chǔ zhī shi | basic knowledge | 最基本的知识 | 这本书介绍了天文学的＿＿，适合中学生阅读。 | 基础
基础研究 | jī chǔ yán jiū | basic research | 探索自然规律、不直接追求应用的研究 | 很多改变生活的发明，都来自几十年前的＿＿。
基础设施 | jī chǔ shè shī | infrastructure | 道路、水电、通信等公共设施 | 政府加大投入，改善了农村的道路、供水等＿＿。
地基 | dì jī | foundations (of a building) | 建筑物下面打的基础 | 盖高楼之前，要先把＿＿打牢。 | 根基
根基 | gēn jī | roots, foundation | 根本，基础 | 这家老店能开一百多年，诚信是它的＿＿。 | 地基 基石 基础
基石 | jī shí | cornerstone | 作为基础的石头；比喻事物的根本 | 教育是一个国家发展的＿＿。 | 根基 基础
步骤 | bù zhòu | step, procedure | 事情进行的顺序 | 做实验要严格按照＿＿进行。
骤然 | zhòu rán | suddenly | 突然 | 一进山洞，气温＿＿下降。
由浅入深 | yóu qiǎn rù shēn | from the simple to the complex | 从容易的到难的 | 这套教材＿＿，很适合初学者。
`,
  },
  {
    theme: ["Detail and Thoroughness", "详细和彻底"],
    data: `
详细 | xiáng xì | detailed | 周密完备 | 请把事情的经过＿＿地说一遍。 | 详尽
详尽 | xiáng jìn | exhaustive | 详细完备，没有遗漏 | 这份报告提供了＿＿的数据。 | 详细 详实
详实 | xiáng shí | full and accurate | 又详细又真实 | 这本传记资料＿＿，写得很可信。 | 详尽
详情 | xiáng qíng | details | 详细的情况 | 活动＿＿请看学校网站上的通知。
详略得当 | xiáng lüè dé dàng | well judged in what to dwell on | 该详细的详细，该简略的简略 | 这篇作文＿＿，重点很突出。
仔细 | zǐ xì | careful | 细心 | 交卷之前，请再＿＿检查一遍。 | 细致
细致 | xì zhì | meticulous | 细心周到 | 她做事非常＿＿，从来不出错。 | 仔细
彻底 | chè dǐ | thorough | 一直到底，完全 | 这次大扫除把教室＿＿打扫了一遍。 | 透彻 仔细
透彻 | tòu chè | penetrating (of understanding) | 详细而深入 | 老师把这个难题分析得非常＿＿。 | 彻底
彻夜 | chè yè | all night long | 整夜 | 为了完成实验，他们＿＿工作。
`,
  },
  {
    theme: ["Special, Rare and Broad", "特殊、罕见和广泛"],
    data: `
特殊 | tè shū | special | 不同于一般 | 这种花需要＿＿的照顾，用普通的土种不活。
殊途同归 | shū tú tóng guī | different roads to the same end | 走不同的路到达同一个地方 | 他们用了不同的方法，却得出了相同的结论，可谓＿＿。
悬殊 | xuán shū | widely different | 差别很大 | 两队实力＿＿，比赛结果没有一点悬念。
罕见 | hǎn jiàn | rare | 很少见到 | 这是一种＿＿的疾病，全世界只有几百个病例。 | 罕有
罕有 | hǎn yǒu | seldom seen | 很少有 | 今年冬天出现了几十年＿＿的大雪。 | 罕见
稀罕 | xī han | rare; to set store by | 少见的；喜欢，看重 | 谁＿＿你的东西！我自己有。
人迹罕至 | rén jì hǎn zhì | rarely visited | 很少有人去 | 科学家在＿＿的深山里发现了一种新植物。
广泛 | guǎng fàn | wide-ranging | 范围大，普遍 | 这本书的读者很＿＿，从小学生到老人都爱看。 | 宽泛
宽泛 | kuān fàn | broad, loose | 涉及的面宽，不具体 | 这个题目太＿＿了，最好缩小范围。 | 空泛 广泛
空泛 | kōng fàn | vague and empty | 内容空洞，不具体 | 文章要有具体的例子，不能只讲＿＿的道理。 | 宽泛
`,
  },
  {
    theme: ["Tracing and Excerpting", "追踪和摘录"],
    data: `
追踪 | zhuī zōng | to track | 按照踪迹去追寻 | 科学家给候鸟戴上定位器，＿＿它们迁徙的路线。 | 跟踪
跟踪 | gēn zōng | to follow closely | 紧紧跟在后面；密切注意变化 | 医生要长期＿＿病人的恢复情况。 | 追踪
踪迹 | zōng jì | traces, tracks | 行动留下的痕迹 | 雪地上留下了小动物的＿＿。 | 踪影
踪影 | zōng yǐng | sign, trace (usually in the negative) | 看得见的形象，多用于否定 | 找了半天，还是不见小狗的＿＿。 | 踪迹
失踪 | shī zōng | to go missing | 下落不明 | 那架＿＿多年的飞机终于找到了。
无影无踪 | wú yǐng wú zōng | without a trace | 一点痕迹也没有 | 太阳一出来，雾就消失得＿＿。
溯源 | sù yuán | to trace to the source | 往上游寻找水的源头；比喻探求根源 | 扫一扫包装上的码，就能＿＿这包大米的产地。
摘录 | zhāi lù | to take extracts | 选择一部分记下来 | 他在笔记本上＿＿了书中的好句子。 | 摘抄
摘抄 | zhāi chāo | to copy out (passages) | 选择一部分抄下来 | 老师让我们每天＿＿一段优美的文字。 | 摘录
摘要 | zhāi yào | abstract, summary | 选取出来的要点 | 论文前面的＿＿只有两百字，概括了全文的内容。
`,
  },
  {
    theme: ["Planning a Study", "研究的计划"],
    data: `
提纲 | tí gāng | outline | 写作或发言的要点 | 写作文之前，先列一个＿＿。 | 大纲
大纲 | dà gāng | syllabus | 系统排列的内容要点 | 这门课的教学＿＿已经发给大家了。 | 提纲 纲要
纲要 | gāng yào | programme, essentials | 提纲；概要 | 学校公布了未来五年的发展＿＿。 | 大纲
综述 | zōng shù | review (of the literature) | 综合叙述 | 他写了一篇关于城市交通研究的＿＿，总结了近十年的成果。
选题 | xuǎn tí | choice of topic | 选择研究或写作的题目 | 好的＿＿是论文成功的一半。
开题报告 | kāi tí bào gào | research proposal | 研究开始前说明研究计划的报告 | 研究生要先通过＿＿，才能正式开始研究。
结题 | jié tí | to conclude a project | 课题完成并通过检查 | 这个课题研究了三年，今年终于＿＿了。
立项 | lì xiàng | to approve a project | 正式确定某个项目 | 这个研究项目去年＿＿，获得了五十万元的经费。
经费 | jīng fèi | funds | 做事需要的钱 | 由于缺少＿＿，这项研究不得不停了下来。 | 资助
资助 | zī zhù | to fund; funding | 用钱帮助 | 这家基金会＿＿了一百名贫困大学生。 | 经费
`,
  },
  {
    theme: ["Tools of Mathematics", "数学工具"],
    data: `
函数 | hán shù | function | 一个量随另一个量变化的对应关系 | 中学数学里，＿＿的图像可以是一条直线，也可以是一条曲线。
一次函数 | yī cì hán shù | linear function | 图像是一条直线的函数 | ＿＿的图像是一条直线。 | 函数
自变量 | zì biàn liàng | independent variable | 会引起别的量变化的量 | 在研究温度对植物生长的影响时，温度是＿＿。 | 因变量
因变量 | yīn biàn liàng | dependent variable | 随着别的量变化的量 | 在研究温度对植物生长的影响时，植物的高度是＿＿。
坐标 | zuò biāo | coordinates | 确定点的位置的一组数 | 在地图上，用经度和纬度可以确定一个地方的＿＿。
矩阵 | jǔ zhèn | matrix | 排成长方形的一组数 | 电脑处理图片时，常常把一张图片看成一个由数字组成的＿＿。
矩形 | jǔ xíng | rectangle | 四个角都是直角的四边形 | 足球场是一个大大的＿＿。
斜率 | xié lǜ | slope | 直线倾斜的程度 | 一条直线往右上方升得越快，它的＿＿就越大。
平均数 | píng jūn shù | mean | 一组数的总和除以个数 | 二、三、七这三个数的＿＿是四。 | 中位数
中位数 | zhōng wèi shù | median | 按大小排列后处在中间的数 | 二、三、七这三个数的＿＿是三。
`,
  },
  {
    theme: ["Focus and Coherence", "专注和连贯"],
    data: `
贯穿 | guàn chuān | to run through | 从头到尾穿过 | 环保的理念＿＿了这本书的始终。
连贯 | lián guàn | coherent | 连接贯通 | 这篇文章前后不＿＿，读起来很吃力。
一贯 | yī guàn | consistent, all along | 一向如此 | 认真负责是他＿＿的工作作风。 | 一以贯之
一以贯之 | yī yǐ guàn zhī | to stay true to one principle throughout | 用一个道理贯穿始终 | 这位科学家对真理的追求＿＿，几十年从未改变。 | 一贯
贯彻 | guàn chè | to carry through | 彻底实现（方针、原则等） | 学校认真＿＿“安全第一”的原则。
贯通 | guàn tōng | to link up | 连接相通 | 这条高速铁路全线＿＿以后，两个城市之间只要一个小时。
融会贯通 | róng huì guàn tōng | to master thoroughly | 把各方面的知识融合起来，透彻理解 | 学知识不能死记硬背，要＿＿。
全神贯注 | quán shén guàn zhù | with rapt attention | 精神完全集中 | 他＿＿地看着显微镜，连有人进来都没发现。 | 聚精会神
聚精会神 | jù jīng huì shén | to concentrate hard | 集中注意力 | 同学们＿＿地听老师讲课。 | 全神贯注
一心一意 | yī xīn yī yì | wholeheartedly | 心思只放在一件事上 | 退休以后，他＿＿地研究家乡的历史。 | 全神贯注 聚精会神
`,
  },
  {
    theme: ["Working It Out", "搞清楚"],
    data: `
搞清楚 | gǎo qīng chu | to get to the bottom of | 完全明白 | 在下结论之前，我们得先把事实＿＿。 | 深究
搞错 | gǎo cuò | to get wrong | 把事情做错或认错 | 对不起，我＿＿了你的名字。
搞定 | gǎo dìng | to get done | 把事情办好 | 别担心，这个问题我一个人就能＿＿。 | 搞好
搞好 | gǎo hǎo | to do well, to make a success of | 把事情做好 | 只要大家团结，就一定能把这次活动＿＿。 | 搞定
搞笑 | gǎo xiào | funny | 逗人笑 | 这部动画片很＿＿，孩子们笑个不停。
搞砸 | gǎo zá | to mess up | 把事情做坏 | 他太紧张了，把面试＿＿了。
深究 | shēn jiū | to go into deeply | 认真追查，深入研究 | 这个现象背后的原因值得＿＿。 | 搞清楚
推敲 | tuī qiāo | to weigh (one's words) | 反复琢磨字句 | 这篇论文的每个句子他都反复＿＿过。
敲定 | qiāo dìng | to finalize | 最后确定 | 会议时间终于＿＿在下周一。
敲门砖 | qiāo mén zhuān | stepping stone | 比喻为了达到目的而用的手段 | 对他来说，这张证书只是找工作的＿＿。
`,
  },
  {
    theme: ["Quite, All and Ordinary", "颇、皆和凡"],
    data: `
颇为 | pō wéi | rather, quite | 很，相当 | 他对中国古代天文学＿＿了解。 | 颇有
颇有 | pō yǒu | to have a good deal of | 有很多 | 这位老教授在植物学方面＿＿研究。 | 颇为
人人皆知 | rén rén jiē zhī | known to all | 每个人都知道 | 地球围着太阳转，如今已是＿＿的常识。
比比皆是 | bǐ bǐ jiē shì | to be found everywhere | 到处都是 | 在这个城市里，咖啡馆＿＿。
皆大欢喜 | jiē dà huān xǐ | to the satisfaction of all | 大家都很高兴 | 问题解决了，双方都满意，真是＿＿。
凡是 | fán shì | every, any | 只要是 | ＿＿参加比赛的同学，都可以得到一张证书。
非凡 | fēi fán | extraordinary | 超过一般 | 这位科学家有着＿＿的想象力。 | 不同凡响
平凡 | píng fán | ordinary | 平常 | 她只是一名＿＿的乡村教师，却影响了几代学生。
凡人 | fán rén | ordinary mortal | 平常的人 | 我们都是＿＿，难免会犯错误。
不同凡响 | bù tóng fán xiǎng | out of the ordinary | 不一般，很出色 | 这位年轻导演的第一部电影就＿＿，获了大奖。 | 非凡
`,
  },
  {
    theme: ["Beginnings and Making Good", "萌芽和弥补"],
    data: `
萌芽 | méng yá | to bud; the bud of something | 植物发芽；比喻事物刚开始 | 这个想法还处在＿＿阶段，需要进一步研究。 | 萌发
萌发 | méng fā | to germinate | 种子发芽；比喻事物开始发生 | 温度合适，种子很快就＿＿了。 | 萌芽
萌生 | méng shēng | to begin to have (an idea) | 开始产生 | 读了这本书，他＿＿了当科学家的念头。 | 萌发
弥补 | mí bǔ | to make up for | 把不够的地方补上 | 他利用暑假＿＿了落下的功课。 | 补救
补救 | bǔ jiù | to remedy | 在出了问题以后想办法挽回 | 发现错误后要及时＿＿，不要等到问题更严重。 | 弥补
弥漫 | mí màn | to fill the air | 烟、雾、气味等布满 | 清晨，山谷里＿＿着白雾。
弥足珍贵 | mí zú zhēn guì | all the more precious | 非常宝贵 | 这些一百年前的照片＿＿，记录了城市当年的样子。
填补空白 | tián bǔ kòng bái | to fill a gap | 补上原来没有的东西 | 这项研究成果＿＿，受到了同行的重视。
起步 | qǐ bù | to start out | 开始走；开始做 | 我国的这项技术虽然＿＿晚，但发展很快。
初具规模 | chū jù guī mó | to take shape | 刚开始有一定的规模 | 经过三年的建设，这座科学城已经＿＿。
`,
  },
  {
    theme: ["Moments", "瞬间和暂时"],
    data: `
瞬间 | shùn jiān | an instant | 极短的时间 | 相机记录下了闪电出现的那一＿＿。
转瞬即逝 | zhuǎn shùn jí shì | gone in an instant | 一转眼就消失了 | 机会往往＿＿，要及时抓住。
瞬息万变 | shùn xī wàn biàn | changing from moment to moment | 在极短的时间里变化很多 | 山里的天气＿＿，刚才还出着太阳，现在就下雨了。
片刻 | piàn kè | a moment | 很短的一段时间 | 他沉思了＿＿，然后回答了问题。
暂时 | zàn shí | for the time being | 短时间内 | 他＿＿住在朋友家，下个月再找房子。 | 暂且
暂且 | zàn qiě | for now | 先这样，以后再说 | 这个问题我们＿＿放一放，先讨论下一个。 | 暂时
暂停 | zàn tíng | to pause | 暂时停止 | 因为下大雨，比赛＿＿了半个小时。 | 暂缓
暂缓 | zàn huǎn | to put off | 暂时推迟 | 因为资金不够，新图书馆的建设计划只好＿＿。 | 暂停
短暂 | duǎn zàn | brief | 时间很短 | 经过＿＿的休息，大家又开始工作了。 | 片刻
暂定 | zàn dìng | tentatively set | 暂时决定 | 会议＿＿在下周三举行，具体时间另行通知。
`,
  },
  {
    theme: ["Effort", "竭尽全力"],
    data: `
竭力 | jié lì | to do one's utmost | 用尽全部力量 | 医生们＿＿抢救，病人终于脱离了危险。 | 竭尽全力
竭尽全力 | jié jìn quán lì | to spare no effort | 把全部力量都用上 | 只要我们＿＿，就没有什么可后悔的。 | 竭力
精疲力竭 | jīng pí lì jié | utterly exhausted | 精神和体力都用完了 | 爬了一天山，大家都＿＿了。 | 筋疲力尽
筋疲力尽 | jīn pí lì jìn | worn out | 非常累，一点力气也没有了 | 搬完家，他累得＿＿，倒头就睡。 | 精疲力竭
枯竭 | kū jié | to dry up, to run out | 水源干了；资源用完了 | 过度开采会让地下水＿＿。
一番 | yī fān | a spell of (effort) | 一次，一回，多指花了时间和力气的 | 经过＿＿认真的准备，他的报告非常精彩。
三番五次 | sān fān wǔ cì | again and again | 一次又一次 | 他＿＿地向导师请教，终于明白了这个问题。
毛遂自荐 | máo suì zì jiàn | to put oneself forward | 自己推荐自己 | 实验室招助手，他＿＿，得到了这个机会。
未遂 | wèi suì | unfulfilled | 没有达到目的 | 他出国留学的心愿＿＿，一直有些失落。
心血 | xīn xuè | painstaking effort | 心思和精力 | 这本词典凝聚了他二十年的＿＿。
`,
  },
  {
    theme: ["Essence and Mystery", "精粹和玄妙"],
    data: `
纯粹 | chún cuì | pure; purely | 不含别的成分；完全 | 他学画画＿＿是出于兴趣，不是为了考试。
精粹 | jīng cuì | the essence, the best | 最好的部分 | 这本书收集了中国古代诗歌的＿＿。
国粹 | guó cuì | national treasure (of culture) | 一个国家文化中的精华 | 京剧被称为中国的＿＿。
博大精深 | bó dà jīng shēn | broad and profound | 思想、学识广博高深 | 中国的书法艺术＿＿，值得用一生去学习。
浩如烟海 | hào rú yān hǎi | vast as the ocean | 像大海一样广大，形容非常多 | 图书馆里的书＿＿，一辈子也读不完。
浩大 | hào dà | huge (of a project) | 规模非常大 | 修建三峡大坝是一项＿＿的工程。
玄妙 | xuán miào | profound and subtle | 深奥微妙 | 宇宙起源的道理十分＿＿，很多问题至今没有答案。
玄机 | xuán jī | hidden key, secret | 深奥的道理；藏着的秘密 | 这道题看起来简单，其实暗藏＿＿。
惟妙惟肖 | wéi miào wéi xiào | true to life | 描写或模仿得非常像 | 他模仿各种鸟叫，学得＿＿。
惟有 | wéi yǒu | only | 只有 | ＿＿坚持下去，才能看到成果。
`,
  },
  {
    theme: ["Creatures of the Laboratory", "实验室里的生物"],
    data: `
胚胎 | pēi tāi | embryo | 刚开始发育的生物体 | 科学家通过观察鸡蛋里的＿＿，研究动物是怎样发育的。
霉菌 | méi jūn | mould | 一类会让食物等长毛、变质的真菌 | 面包放久了会长出＿＿，不能再吃了。
发霉 | fā méi | to go mouldy | 长出霉菌 | 南方的春天空气潮湿，衣服很容易＿＿。
青蛙 | qīng wā | frog | 一种绿色、会跳、吃害虫的蛙 | 夏天的晚上，稻田里的＿＿叫个不停。
猩猩 | xīng xing | orangutan | 一种手臂很长、毛发偏红、生活在树上的大型动物 | ＿＿生活在东南亚的热带雨林里，手臂很长，大部分时间待在树上。
黑猩猩 | hēi xīng xing | chimpanzee | 和人类亲缘关系最近的动物之一 | ＿＿会用小树枝从洞里取白蚁吃。
蚂蚁 | mǎ yǐ | ant | 一种很小、成群生活的昆虫 | 一只＿＿能搬动比自己重得多的东西。
苍蝇 | cāng ying | housefly | 一种常停在脏东西上、会传播疾病的昆虫 | ＿＿会传播疾病，食物一定要盖好。
果蝇 | guǒ yíng | fruit fly | 一种很小的蝇，常用来做遗传实验 | 很多遗传学研究都用＿＿做实验，因为它们繁殖得很快。
苍白 | cāng bái | pale | 白而没有血色；缺少活力 | 他生病了，脸色很＿＿。
`,
  },
  {
    theme: ["Databases and Searching", "数据库和检索"],
    data: `
数据库 | shù jù kù | database | 按一定结构存放数据的地方 | 这个＿＿收录了一百多年来的天气记录。
题库 | tí kù | question bank | 收集大量题目的地方 | 考试的题目是从＿＿里随机抽出来的。
文库 | wén kù | library (of works), repository | 成套出版的书；收集文章的地方 | 这套儿童＿＿收录了一百本世界名著。
智库 | zhì kù | think tank | 为决策提供研究和建议的机构 | 这家＿＿的研究人员经常为城市规划提出建议。
检索 | jiǎn suǒ | to search (records) | 查找资料 | 在图书馆的网站上输入书名，就可以＿＿到这本书。
关键词 | guān jiàn cí | keyword | 能代表主要内容的词 | 论文的摘要下面一般要列出三到五个＿＿。
查重 | chá chóng | to check for copying | 检查文章和别人的文章重复了多少 | 论文提交前要先＿＿，重复的内容不能太多。
匹配 | pǐ pèi | to match | 配合，相合 | 输入的密码和账号不＿＿，请重新输入。
匹敌 | pǐ dí | to rival | 力量相当 | 在围棋上，现在的人类棋手已经很难和电脑程序＿＿。
引文 | yǐn wén | quotation, citation | 引用的文字 | 论文中的＿＿都要注明出处。
`,
  },
  {
    theme: ["The World of Scholars", "学术界"],
    data: `
授予 | shòu yǔ | to confer, to award | 正式给予（学位、称号等） | 这所大学＿＿他名誉博士学位。
学术界 | xué shù jiè | academia | 从事学术研究的人和团体 | 这篇论文在＿＿引起了很大的反响。
学术会议 | xué shù huì yì | academic conference | 学者们交流研究成果的会议 | 她下个月要去国外参加一个＿＿，报告自己的研究成果。
跨学科 | kuà xué kē | interdisciplinary | 涉及两个以上的学科 | 研究气候变化是一项＿＿的工作，需要地理、化学等方面的专家合作。
同行评议 | tóng háng píng yì | peer review | 由同一领域的专家评价研究成果 | 论文在发表之前，一般要经过＿＿。
期刊 | qī kān | periodical, journal | 定期出版的刊物 | 图书馆订阅了两百多种＿＿，有周刊也有月刊。
专著 | zhuān zhù | monograph | 专门研究某一问题的著作 | 他花了十年时间，写成了一部研究宋代瓷器的＿＿。
参考文献 | cān kǎo wén xiàn | references, bibliography | 写论文时参考过的书和文章 | 论文的最后要列出＿＿。
抄袭 | chāo xí | to plagiarize | 把别人的作品当成自己的 | 他的文章被发现＿＿了别人的研究，被取消了发表。
学术不端 | xué shù bù duān | academic misconduct | 在研究中违反学术规范的行为 | 抄袭、伪造数据都属于＿＿。
`,
  },
  // Unit 3: Industry and Farming.
  {
    theme: ["Ears, Seedlings and Stems", "穗、苗和茎"],
    data: `
麦穗 | mài suì | ear of wheat | 麦子茎顶上结籽的部分 | 初夏，田里的＿＿都变黄了，农民准备收麦子了。 | 稻穗
稻穗 | dào suì | ear of rice | 稻子顶上结出稻谷的部分 | 金黄的＿＿把稻子压弯了腰。 | 麦穗
秧苗 | yāng miáo | rice seedlings | 刚长出来的幼小植物，特别是稻的幼苗 | 春天，农民把＿＿一行一行地插进水田里。 | 禾苗
插秧 | chā yāng | to transplant rice seedlings | 把稻的幼苗插到水田里 | 每年四五月，南方的农民开始忙着＿＿。
禾苗 | hé miáo | young crops | 谷类作物的幼苗 | 下了一场春雨，田里的＿＿长得更绿了。 | 秧苗
籽粒 | zǐ lì | grain, kernel | 谷物、豆类等的颗粒 | 今年的玉米＿＿饱满，收成一定不错。
茎 | jīng | stem | 植物连着根和叶的部分 | 植物的＿＿把根吸收的水分送到叶子上。 | 茎秆
茎秆 | jīng gǎn | stalk (of a crop) | 庄稼的茎 | 这种新品种小麦的＿＿又短又粗，不怕大风。 | 茎
块茎 | kuài jīng | tuber | 植物长在地下、像块状的茎 | 土豆吃的部分其实是植物的＿＿，不是根。
颗粒无收 | kē lì wú shōu | not a grain harvested | 一点收成也没有 | 那年大旱，很多地方的庄稼＿＿。
`,
  },
  {
    theme: ["Tubers and Mushrooms", "薯类和菌菇"],
    data: `
红薯 | hóng shǔ | sweet potato | 一种皮红、肉甜的薯 | 冬天在街头买一个烤＿＿，又香又甜。
马铃薯 | mǎ líng shǔ | potato | 土豆的正式名称 | ＿＿原产于南美洲，后来传到了世界各地。
薯条 | shǔ tiáo | chips, French fries | 切成长条炸熟的土豆 | 他点了一杯可乐和一份＿＿。 | 薯片
薯片 | shǔ piàn | crisps | 切成薄片炸熟的土豆 | 他打开一袋＿＿，一边看电影一边吃。 | 薯条
蘑菇 | mó gu | mushroom | 一类可以吃的大型菌类 | 雨后的树林里长出了很多＿＿，但野生的不要随便吃。 | 菌菇
香菇 | xiāng gū | shiitake mushroom | 一种有香味、颜色较深的蘑菇 | 晒干的＿＿香味更浓，常用来做汤。
菌菇 | jūn gū | edible fungi | 各种可以吃的菌类 | 这家工厂种植的＿＿有十几个品种。 | 蘑菇
木耳 | mù ěr | wood ear (a fungus) | 一种黑色、形状像耳的菌类 | 黑＿＿常常长在潮湿的树干上，泡软以后可以炒菜。
菇农 | gū nóng | mushroom grower | 种蘑菇的农民 | 山里的＿＿在大棚里种出了一年四季都能卖的香菇。
杂粮 | zá liáng | coarse grains | 玉米、小米、豆类等除稻麦以外的粮食 | 医生建议他少吃精米白面，多吃一些＿＿。
`,
  },
  {
    theme: ["Farm Tools", "农具"],
    data: `
犁 | lí | plough | 翻土用的农具 | 过去农民用牛拉着＿＿耕地。
犁地 | lí dì | to plough | 用犁翻土 | 春天来了，农民开着拖拉机＿＿。
锄头 | chú tou | hoe | 松土、除草的农具 | 爷爷拿着＿＿下地去了。
锄草 | chú cǎo | to hoe up weeds | 用锄头除掉杂草 | 夏天，菜地里的草长得很快，要经常＿＿。
耕耘 | gēng yún | to plough and weed; to toil | 翻地除草；比喻辛勤地工作 | 他在乡村学校默默＿＿了三十年。
竹筐 | zhú kuāng | bamboo basket | 用竹子编的筐 | 她背着一个＿＿上山采茶。
水桶 | shuǐ tǒng | bucket | 装水的桶 | 他提着两只＿＿去井边打水。
收割机 | shōu gē jī | combine harvester | 收割庄稼的机器 | 现在收麦子都用＿＿，一台一天就能收一百多亩。 | 农机
播种机 | bō zhǒng jī | seed drill | 播种用的机器 | ＿＿一边往前开，一边把种子种进土里。
农机 | nóng jī | farm machinery | 农业机械 | 政府给购买＿＿的农民发放补贴。 | 收割机 播种机
`,
  },
  {
    theme: ["Land and Harvest", "田地和收成"],
    data: `
亩 | mǔ | mu (a unit of land) | 土地面积单位，约六百六十七平方米 | 他家承包了五十＿＿地，种的都是小麦。
亩产 | mǔ chǎn | yield per mu | 每亩地的产量 | 新品种水稻的＿＿比原来提高了两成。
梯田 | tī tián | terraced fields | 在山坡上修成一层一层的田 | 云南的哈尼＿＿已经被列入世界遗产名录。
良田 | liáng tián | good farmland | 好的田地 | 经过多年改造，这片荒地变成了＿＿。
收成 | shōu cheng | harvest | 庄稼等的收获 | 今年雨水充足，粮食的＿＿很好。
歉收 | qiàn shōu | poor harvest | 收成不好 | 由于干旱，这个地区的小麦＿＿了。
秋收 | qiū shōu | autumn harvest | 秋天收获庄稼 | ＿＿时节，田野里到处是收玉米的人。 | 农忙
农忙 | nóng máng | busy farming season | 农活多的时候 | 过去，农村学校在＿＿时节会放几天假，让孩子们帮家里干活。 | 秋收
五谷丰登 | wǔ gǔ fēng dēng | a bumper harvest | 各种粮食都获得丰收 | 过年时，很多农家在门上贴着“＿＿”四个大字。
风调雨顺 | fēng tiáo yǔ shùn | favourable weather | 风雨适时，适合庄稼生长 | 今年＿＿，庄稼长得特别好。
`,
  },
  {
    theme: ["Livestock", "畜牧"],
    data: `
畜牧业 | xù mù yè | animal husbandry | 养牛、羊、马等的产业 | 内蒙古有大片的草原，＿＿很发达。
家畜 | jiā chù | domestic animals | 人养的动物，如牛、马、羊、猪 | 牛、羊、猪都是常见的＿＿。
饲养 | sì yǎng | to raise (animals) | 喂养动物 | 这个农场＿＿了两千头奶牛。 | 喂养
饲料 | sì liào | feed, fodder | 喂动物的食物 | 玉米秆可以加工成牛羊的＿＿。
喂养 | wèi yǎng | to feed and rear | 给吃的并照顾 | 小猫刚出生，需要每隔几个小时＿＿一次。 | 饲养
喂食 | wèi shí | to feed (an animal) | 给动物吃的东西 | 动物园提醒游客，不要随便给动物＿＿。
粪便 | fèn biàn | excrement | 人和动物排出的废物 | 牛羊的＿＿可以用来生产沼气。
粪肥 | fèn féi | manure | 用粪便做的肥料 | 菜农们用处理过的＿＿给菜地施肥。
奶牛 | nǎi niú | dairy cow | 产奶的牛 | 这家牧场的＿＿每天要挤两三次奶。
猪圈 | zhū juàn | pigsty | 养猪的地方 | 他每天早上都要把＿＿打扫干净。
`,
  },
  {
    theme: ["New Ways of Farming", "农业新方式"],
    data: `
大棚 | dà péng | (plastic) greenhouse | 用塑料等搭成的种植棚 | 冬天，＿＿里的黄瓜照样长得很好。
反季节 | fǎn jì jié | out of season | 不在平常的季节 | 有了大棚，人们冬天也能吃到＿＿蔬菜。
无土栽培 | wú tǔ zāi péi | soilless culture | 不用土，用营养液种植物 | ＿＿的蔬菜不种在地里，根泡在营养液中。
牛棚 | niú péng | cowshed | 养牛的棚子 | 下雨了，他把牛赶进了＿＿。
菜园 | cài yuán | vegetable garden | 种菜的园子 | 奶奶在屋后开了一小块＿＿，种了些青菜。
菜农 | cài nóng | vegetable grower | 种菜的农民 | 每天天不亮，＿＿就把新鲜的蔬菜运到城里。
果农 | guǒ nóng | fruit grower | 种果树的农民 | 苹果成熟了，＿＿们忙着摘果子。
有机农业 | yǒu jī nóng yè | organic farming | 不用化肥、农药的农业 | 这个农场发展＿＿，种菜不用化肥和农药。 | 生态农业
生态农业 | shēng tài nóng yè | ecological farming | 保护环境、循环利用资源的农业 | 稻田里养鱼，鱼吃害虫，鱼粪肥田，这是一种＿＿。 | 有机农业
智慧农业 | zhì huì nóng yè | smart farming | 用信息技术管理的农业 | 农民用手机就能控制大棚的温度，这就是＿＿。
`,
  },
  {
    theme: ["Fruit", "水果"],
    data: `
葡萄 | pú tao | grape | 一种小而圆、很多颗长在一起的水果 | 新疆吐鲁番的＿＿又大又甜。
葡萄干 | pú tao gān | raisin | 晒干的葡萄 | 吐鲁番天气干燥，很适合把葡萄做成＿＿。
葡萄园 | pú tao yuán | vineyard | 种葡萄的园子 | 山坡上有一个大大的＿＿，架子上挂满了葡萄。
梨 | lí | pear | 一种水分多、味道甜的水果 | 秋天天气干燥，很多人喜欢吃又甜又水灵的＿＿。
鸭梨 | yā lí | Ya pear | 一种皮黄、水分多的梨 | 河北出产的＿＿很有名。
橘子 | jú zi | tangerine | 一种皮薄、容易剥开的水果 | ＿＿的皮很容易剥开，果肉酸酸甜甜的。
红枣 | hóng zǎo | red jujube | 晒干的红色枣子 | 妈妈煮汤时放了几颗＿＿。
枣树 | zǎo shù | jujube tree | 结枣的树 | 院子里的老＿＿每年秋天都结满了红红的果子。
嫁接 | jià jiē | to graft | 把一种植物的枝条接到另一种植物上 | 果农把好品种的枝条＿＿到老树上，结出的苹果更甜了。
授粉 | shòu fěn | pollination | 把花粉传到花上，使植物能结果 | 果农把蜜蜂放进果园，帮助果树＿＿。
`,
  },
  {
    theme: ["Vegetables", "蔬菜"],
    data: `
葱 | cōng | spring onion | 一种有辣味、叶子像管子的菜 | 炒菜之前，先放一点＿＿爆香。 | 葱花 大蒜 大葱
大葱 | dà cōng | Chinese leek | 一种又高又粗的葱 | 山东出产的＿＿又高又粗，很有名。
洋葱 | yáng cōng | onion | 一种圆形、有很多层的菜 | 切＿＿的时候，很多人会被辣得眼睛发红。
葱花 | cōng huā | chopped spring onion | 切成小段的葱 | 面条上放一点＿＿，闻起来更香。
大蒜 | dà suàn | garlic | 一种有强烈气味、常用来调味的菜 | ＿＿的味道很重，吃完最好刷刷牙。 | 蒜苗
蒜苗 | suàn miáo | garlic shoots | 大蒜长出来的绿色的茎和叶 | 青青的＿＿炒肉，是一道很下饭的家常菜。 | 大蒜
茄子 | qié zi | aubergine | 一种紫色的蔬菜 | 照相时大家一起说“＿＿”，脸上就有了笑容。
番茄 | fān qié | tomato | 一种红色、水分多的果实，可以当菜也可以当水果 | ＿＿炒鸡蛋是一道简单的家常菜。
葱绿 | cōng lǜ | lush green | 草木青翠 | 雨后的山坡一片＿＿。
时令 | shí lìng | in season | 当季的 | 这家饭馆只用＿＿蔬菜，每个季节的菜单都不一样。
`,
  },
  {
    theme: ["Silk and Silkworms", "养蚕和丝绸"],
    data: `
桑树 | sāng shù | mulberry tree | 叶子可以喂蚕的树 | 过去，江南很多村子的房前屋后都种着＿＿。
桑叶 | sāng yè | mulberry leaf | 桑树的叶子 | 蚕宝宝最爱吃新鲜的＿＿。
蚕 | cán | silkworm | 吃桑叶、吐丝的虫 | ＿＿吐出的丝可以织成丝绸。 | 春蚕
养蚕 | yǎng cán | to raise silkworms | 喂养吐丝的虫 | 中国人＿＿的历史已经有几千年了。
蚕丝 | cán sī | silk (thread) | 蚕吐出的丝 | ＿＿做的被子又轻又暖和。
春蚕 | chūn cán | spring silkworm | 春天养的蚕 | “＿＿到死丝方尽”是唐代诗人李商隐的名句。
蚕豆 | cán dòu | broad bean | 一种个头大、可以吃的豆子 | 春天，地里的＿＿开出了紫白色的小花。
蚕食 | cán shí | to nibble away at | 像蚕吃桑叶一样一点点地占去 | 大型超市不断＿＿小商店的生意。
桑田 | sāng tián | mulberry field | 种桑树的田地 | 过去这里是一片＿＿，家家户户都养蚕。
织布 | zhī bù | to weave cloth | 用线织成布 | 奶奶年轻时用木头做的机器＿＿。
`,
  },
  {
    theme: ["Smelting and Forging", "冶炼和锻造"],
    data: `
冶炼 | yě liàn | to smelt | 用加热等方法从矿石中提取金属 | 古代人很早就学会了从矿石中＿＿铜。 | 炼铁
冶金 | yě jīn | metallurgy | 从矿石中提取和加工金属的技术 | 他大学学的是＿＿专业，毕业后去了钢厂。
炼铁 | liàn tiě | to make iron | 从铁矿石中炼出铁 | 高炉是用来＿＿的主要设备。 | 冶炼 炼钢
炼钢 | liàn gāng | to make steel | 把铁炼成钢 | ＿＿时，要去掉铁里多余的碳。 | 炼铁
高炉 | gāo lú | blast furnace | 炼铁用的高大的炉子 | 钢厂的＿＿日夜不停地工作。
熔炉 | róng lú | furnace; melting pot | 熔化金属的炉子；比喻锻炼人的环境 | 艰苦的环境是锻炼年轻人的大＿＿。
锻造 | duàn zào | to forge | 把金属加热后锤打成形 | 这把刀是工匠一锤一锤＿＿出来的。 | 打铁
打铁 | dǎ tiě | to forge iron | 把烧红的铁锤打成器物 | 老人说，他十几岁就跟着师傅学＿＿。 | 锻造
铁匠 | tiě jiang | blacksmith | 打铁的工匠 | 村口的＿＿铺里，常常传出叮叮当当的声音。
炉火纯青 | lú huǒ chún qīng | to reach perfection | 比喻技术、学问达到了纯熟完美的地步 | 他做了四十年木工，手艺已经＿＿。
`,
  },
  {
    theme: ["Hammers and Hooks", "锤子和钩子"],
    data: `
锤子 | chuí zi | hammer | 敲打东西的工具 | 他用＿＿把钉子钉进了木板。
锤打 | chuí dǎ | to hammer | 用锤子打 | 铁匠把烧红的铁块反复＿＿。
锤炼 | chuí liàn | to temper; to hone | 锻炼；反复推敲使精练 | 这篇文章的语言经过了作者的反复＿＿。 | 千锤百炼
千锤百炼 | qiān chuí bǎi liàn | thoroughly tempered | 比喻经过多次的锻炼和考验 | 一位好的运动员，都是经过＿＿才成长起来的。 | 锤炼
钩子 | gōu zi | hook | 弯曲的挂东西的用具 | 门后有一个＿＿，可以挂衣服。 | 挂钩
挂钩 | guà gōu | hook; to link (to) | 挂东西的钩子；建立联系 | 这家公司把员工的工资和工作成绩＿＿。 | 钩子
鱼钩 | yú gōu | fishhook | 挂上鱼食、用来抓鱼的小钩子 | 他把＿＿抛进河里，耐心地等鱼上钩。
钩针 | gōu zhēn | crochet hook | 一头有钩、用来编织的针 | 奶奶用＿＿给我织了一顶帽子。
机床 | jī chuáng | machine tool | 加工机器零件的机器 | 这台数控＿＿能加工非常精密的零件。
切削 | qiē xiāo | to cut (metal) | 用刀具从金属上去掉多余的部分 | 金属零件要经过＿＿、打磨，才能用在机器上。
`,
  },
  {
    theme: ["Fuel and Heat", "燃料和供暖"],
    data: `
木炭 | mù tàn | charcoal | 木头烧成的黑色燃料 | 过去冬天，有的人家用＿＿取暖。 | 炭火 煤炭 炉子
煤炭 | méi tàn | coal | 从地下开采出来的黑色燃料 | 山西是中国重要的＿＿产地。
炭火 | tàn huǒ | charcoal fire | 木炭烧起来的火 | 大家围着＿＿烤红薯，一边吃一边聊天。
雪中送炭 | xuě zhōng sòng tàn | to help in time of need | 比喻在别人急需时给予帮助 | 在他最困难的时候，你借给他钱，真是＿＿。
锅炉 | guō lú | boiler | 烧水产生热水或蒸汽的设备 | 学校的＿＿房每天早上都烧好开水。
炉子 | lú zi | stove | 用来做饭或取暖的设备 | 屋里生着＿＿，一点也不冷。 | 炭火
采煤 | cǎi méi | coal mining | 开采地下的煤 | 现在很多煤矿都用机器＿＿，工人比过去安全多了。
燃煤 | rán méi | to burn coal | 用煤作燃料 | 为了减少空气污染，很多城市不再用＿＿锅炉。
供暖 | gōng nuǎn | to heat (buildings) | 给房屋提供热量 | 中国北方的城市冬天集中＿＿，屋里很暖和。
油桶 | yóu tǒng | oil drum | 装油的大桶 | 码头上堆着几十个空＿＿。
`,
  },
  {
    theme: ["Kilns, Jars and Stores", "窑、罐和库"],
    data: `
砖窑 | zhuān yáo | brick kiln | 烧砖的窑 | 村外有一座老＿＿，过去村里盖房子的砖都是在那里烧的。
窑洞 | yáo dòng | cave dwelling | 在土坡上打出来、可以住人的洞 | 黄土高原上的很多人家住在＿＿里，冬暖夏凉。
官窑 | guān yáo | imperial kiln | 古代专门为朝廷烧瓷器的窑 | 宋代的＿＿瓷器非常珍贵。
罐子 | guàn zi | jar, pot | 装东西的圆形容器 | 奶奶把做好的咸菜装进一个陶＿＿里。 | 陶罐
陶罐 | táo guàn | earthenware jar | 用陶土烧成的罐子 | 考古学家在遗址里发现了一个几千年前的＿＿。 | 罐子
罐头 | guàn tou | tinned food | 装在密封罐子里的食品 | 登山队带了很多＿＿，因为它们容易保存。
易拉罐 | yì lā guàn | ring-pull can | 一拉就能打开的金属罐 | 喝完饮料，请把＿＿放进可回收垃圾桶。
冷库 | lěng kù | cold store | 低温保存食物的仓库 | 刚摘下的苹果被送进＿＿，可以保存到第二年春天。
库存 | kù cún | stock, inventory | 仓库里存放的货物 | 这款手机卖得太好了，商店的＿＿已经不多了。
入库 | rù kù | to put into storage | 把东西放进仓库 | 收上来的粮食晒干以后才能＿＿。
`,
  },
  {
    theme: ["Fertilizers and Pesticides", "肥料和农药"],
    data: `
施肥 | shī féi | to apply fertilizer | 给植物加肥料 | 种庄稼要按时浇水、＿＿。 | 追肥
追肥 | zhuī féi | top dressing | 在植物生长期间再加肥料 | 小麦长到一定高度时，要再＿＿一次。 | 施肥
磷肥 | lín féi | phosphate fertilizer | 含磷的肥料 | ＿＿能帮助植物的根长得更好，也能让花和果实发育得更好。 | 钾肥 氮肥
钾肥 | jiǎ féi | potash fertilizer | 含钾的肥料 | ＿＿能让庄稼的茎秆更结实，不容易倒。
氮肥 | dàn féi | nitrogen fertilizer | 含氮的肥料 | ＿＿能让叶子长得又大又绿。
复合肥 | fù hé féi | compound fertilizer | 同时含有几种养分的化肥 | 这种＿＿里同时含有氮、磷、钾三种养分。
有机肥 | yǒu jī féi | organic fertilizer | 用动物粪便、植物残体等做的肥料 | 用＿＿种出的蔬菜价格比较高。
农药 | nóng yào | pesticide | 防治农业病虫害的药 | 蔬菜买回家要洗干净，以免有残留的＿＿。 | 杀虫剂
除草剂 | chú cǎo jì | herbicide | 用来除去杂草的药 | 用了＿＿以后，田里的杂草都枯死了。
杀虫剂 | shā chóng jì | insecticide | 用来杀死害虫的药 | 家里有蚊子，他买了一瓶＿＿。 | 农药
`,
  },
  {
    theme: ["In the Factory", "工厂里"],
    data: `
流水线 | liú shuǐ xiàn | assembly line | 按工序一步一步连续生产的设备 | 汽车在＿＿上一步一步地装配完成。
车间 | chē jiān | workshop (in a factory) | 工厂里进行生产的地方 | 这家工厂有三个生产＿＿，每个都有几百名工人。 | 厂房
厂房 | chǎng fáng | factory building | 工厂的房子 | 新＿＿盖好以后，工厂的面积比原来大了很多。 | 车间
产能 | chǎn néng | production capacity | 生产的能力 | 新设备投入使用后，工厂的＿＿提高了一半。
开工 | kāi gōng | to start work | 工厂开始生产；工程开始建设 | 春节过后，工厂陆续＿＿了。 | 停产
停产 | tíng chǎn | to halt production | 停止生产 | 因为原材料运不进来，工厂不得不＿＿。 | 开工
作坊 | zuō fang | workshop (for crafts) | 手工制作东西的地方 | 这家小＿＿专门做手工布鞋，已经开了一百多年。
加工厂 | jiā gōng chǎng | processing plant | 对原料进行加工的工厂 | 村里建了一个水果＿＿，把卖不完的水果做成果干。
质检 | zhì jiǎn | quality inspection | 检查产品的质量 | 每一件产品出厂前都要经过＿＿。
次品 | cì pǐn | defective product | 质量不合格的产品 | 检查员把＿＿挑了出来，不让它出厂。
`,
  },
  {
    theme: ["Industry and Farm Business", "产业和经营"],
    data: `
轻工业 | qīng gōng yè | light industry | 生产生活用品的工业 | 纺织、食品、造纸都属于＿＿。 | 重工业
重工业 | zhòng gōng yè | heavy industry | 生产钢铁、机器等的工业 | 钢铁、机械、造船都属于＿＿。 | 轻工业
制造业 | zhì zào yè | manufacturing | 把原材料加工成产品的产业 | 中国是世界上＿＿规模最大的国家。
原材料 | yuán cái liào | raw materials | 生产产品用的原料和材料 | 棉花是棉纺厂最重要的＿＿。
半成品 | bàn chéng pǐn | semi-finished product | 还没有完全加工好的产品 | 这些家具还是＿＿，还要上漆才能出厂。
削减 | xuē jiǎn | to cut back | 减少 | 为了节约成本，公司＿＿了一半的广告费用。
削弱 | xuē ruò | to weaken | 使变弱 | 一连几年的干旱，大大＿＿了这个地区的农业生产能力。
合作社 | hé zuò shè | co-operative | 大家合在一起经营的组织 | 村民们成立了养蜂＿＿，统一销售蜂蜜。
家庭农场 | jiā tíng nóng chǎng | family farm | 由一家人经营的农场 | 他们一家承包了三百亩地，办起了＿＿。 | 种粮大户
种粮大户 | zhòng liáng dà hù | large-scale grain grower | 种粮食很多的农户 | 他承包了一千多亩地，是村里有名的＿＿。 | 家庭农场
`,
  },
];
