// The characters of level 3 (docs/chinese-curriculum.md §8.4): 300 characters in 30 batches of ten, none of them taught
// in levels 1 and 2, close to level 3 of GF 0025-2021, ordered so that each unit's words and sentences can be written with
// what has been taught.
//
// A line a character, as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.

/** characterBatches are the 30 batches of level 3 characters, in teaching order. */
export const characterBatches: readonly string[] = [
  `
而 ér | and yet, but | 连接词，表示并列或转折 | 面耐 | 且却
且 qiě | moreover; for now | 表示更进一层；暂时 | 目具 | 而并
却 què | but, yet | 表示转折，倒是 | 卸劫 | 而
并 bìng | and also; (before a negative) not at all | 而且；用在否定词前加强语气 | 井开 | 且
否 fǒu | no; not so | 不，不是这样 | 杏吞
则 zé | then; standard | 就；规定的条文 | 测侧
无 wú | not have; without | 没有 | 天元
必 bì | must, surely | 一定 | 心比 | 须
须 xū | must; beard | 一定要；胡子 | 顺颈 | 必
甚 shèn | very; even more | 很，非常；超过 | 其基
`,
  `
至 zhì | to, until; most | 到；最 | 到室
于 yú | at, in; than | 在；比 | 干千
终 zhōng | end; finally | 最后 | 冬线
突 tū | sudden; to dash | 忽然；冲 | 窗究
仍 réng | still | 还，依然 | 扔奶
竟 jìng | unexpectedly; after all | 出乎意料地；到底 | 竞境
由 yóu | from; by | 从；归某人去做 | 田甲
尽 jǐn/jìn | as far as possible; to the end | 力求达到最大限度；完 | 尺层
管 guǎn | to manage; tube | 负责照看；圆而细长的东西 | 馆官
即 jí | that is; at once | 就是；立刻 | 既却
`,
  `
观 guān | to watch; view | 看；对事物的看法 | 现规
反 fǎn | opposite; against | 颠倒的，对着的；不同意 | 友及
支 zhī | to support; (measure word for pens and teams) | 撑住；用于笔和队伍 | 枝技
选 xuǎn | to choose | 挑出合适的 | 先送 | 择
择 zé | to select | 从中挑出来 | 泽译 | 选
决 jué | to decide | 拿定主意 | 快块
赞 zàn | to praise; to support | 夸奖；同意 | 替质
证 zhèng | proof; certificate | 表明真实的东西；身份文件 | 正征 | 据
据 jù | according to; evidence | 按照；可以用来证明的东西 | 居剧 | 证
判 pàn | to judge | 分辨，评定 | 半叛
`,
  `
性 xìng | nature, character | 人或事物的本质特点 | 姓生
格 gé | pattern; standard | 方框；标准 | 各路
脾 pí | spleen; temper | 内脏之一；人的性情 | 牌啤
聪 cōng | clever | 听力好，头脑灵 | 总葱
笨 bèn | stupid, clumsy | 不聪明，不灵巧 | 本苯 | 懒
懒 lǎn | lazy | 不爱劳动，不勤快 | 赖濑 | 笨
勤 qín | hard-working | 努力，不偷懒 | 动勒
貌 mào | appearance | 长相，外表 | 豹貂
诚 chéng | sincere | 真心 | 城成 | 实
实 shí | real, honest | 真的，不假 | 买头 | 诚
`,
  `
善 shàn | kind; good at | 心地好；擅长 | 喜美
耐 nài | to endure | 受得住 | 而对
烦 fán | annoyed | 心里不痛快，嫌多余 | 须颁
骄 jiāo | proud, arrogant | 自以为了不起 | 娇桥 | 傲
傲 ào | haughty | 看不起别人 | 敖做 | 骄
勇 yǒng | brave | 有胆量 | 男涌 | 敢
敢 gǎn | to dare | 有胆量去做 | 散取 | 勇
粗 cū | thick; rough | 条状东西的横截面大；不仔细 | 组租
细 xì | thin; careful | 条状东西的横截面小；认真周到 | 组绅
负 fù | to bear; to lose | 承担；失败 | 贝员
`,
  `
责 zé | duty; to blame | 应该做的事；批评 | 债贵 | 任
任 rèn | to appoint; post | 担当；职务 | 住仁 | 责
优 yōu | excellent | 很好 | 忧代
缺 quē | to lack | 不够；不完全 | 块决
特 tè | special | 不一般的 | 持待
般 bān | sort, kind | 种，样 | 船盘
普 pǔ | general, common | 广泛，大家都有的 | 谱晋 | 通
通 tōng | to go through; common | 没有阻碍；一般的 | 痛桶 | 普
其 qí | his, its; that | 他的，那个 | 共具
极 jí | extremely; pole | 非常；顶点 | 级吸
`,
  `
交 jiāo | to hand over; to make (friends) | 给；互相往来 | 文校
流 liú | to flow | 水移动 | 硫琉
互 hù | mutual | 彼此，你对我我对你 | 五瓦
解 jiě | to untie; to explain | 分开，打开；讲明白 | 触角
尊 zūn | to respect | 敬重 | 遵酋
原 yuán | original; plain | 最初的；宽广平坦的地方 | 源愿
谅 liàng | to forgive | 宽容，不责怪 | 凉晾
误 wù | mistake; to miss | 错；因为晚了没赶上 | 娱吴
联 lián | to connect | 结合在一起 | 关送
约 yuē | to arrange; about | 事先说定；大概 | 的钓
`,
  `
邀 yāo | to invite | 请人来 | 激遨
熟 shú | familiar; ripe, cooked | 知道得清楚；食物烧好的 | 热孰 | 悉
悉 xī | to know | 知道 | 番恶 | 熟
夫 fū | husband; man | 结了婚的男人 | 天失
妻 qī | wife | 结了婚的女人 | 姜凄
父 fù | father | 爸爸 | 交斧
母 mǔ | mother | 妈妈 | 毋每
叔 shū | uncle (father's younger brother) | 爸爸的弟弟 | 权淑
阿 ā | (before names and kin terms) | 用在称呼前面 | 啊河
姨 yí | aunt (mother's sister) | 妈妈的姐妹 | 夷娘
`,
  `
亲 qīn | relative; close | 有血统关系的；关系近 | 新辛 | 戚
戚 qī | relative (by marriage) | 因婚姻联系的亲人 | 威感 | 亲
伙 huǒ | partner; group | 一起做事的人 | 火伏 | 伴
伴 bàn | companion | 跟着在一起的人 | 半胖 | 伙
吵 chǎo | noisy; to quarrel | 声音乱；争 | 抄沙
架 jià | frame; (in 打架) fight | 支撑东西的东西；争吵打斗 | 加驾
歉 qiàn | apology | 觉得对不起别人 | 谦嫌
慰 wèi | to comfort | 使人心里安定 | 尉熨
陪 péi | to accompany | 跟别人在一起 | 部倍
顾 gù | to look after | 照看 | 预顽
`,
  `
教 jiào/jiāo | teaching; to teach | 指导；传授 | 孝数
育 yù | to raise; education | 养活；培养 | 有肯
答 dá | to answer | 回复问题 | 合塔
案 àn | case; plan; long table | 事件；计划；长桌 | 安桌
绩 jì | achievement | 做出的成果 | 债积
及 jí | to reach; and | 到达；和 | 吸极
卷 juàn/juǎn | test paper; to roll | 考试用的纸；把东西弯成圆筒 | 券圈
级 jí | level, grade | 等次 | 极吸
历 lì | to go through; calendar | 经过；年月日的记法 | 厉力
史 shǐ | history | 过去的事 | 吏中
`,
  `
数 shù/shǔ | number; to count | 表示多少的符号；一个一个地点 | 楼教
科 kē | branch of study | 学术的分类 | 料斗
研 yán | to grind; to study | 细细地磨；深入探求 | 砚形 | 究
究 jiū | to look into | 推求，查问 | 穷九 | 研
毕 bì | to finish | 完成，结束 | 比华
专 zhuān | special; focused | 集中在一件事上 | 传转
奖 jiǎng | prize | 为了鼓励给的东西 | 将桨
申 shēn | to state; to apply | 说明；向上提出 | 甲由
掌 zhǎng | palm; to control | 手心；管 | 常堂
握 wò | to hold | 用手拿住 | 屋提
`,
  `
忆 yì | to recall | 回想 | 亿乙
背 bèi/bēi | back; to recite; to carry on the back | 身体后面；凭记忆读出 | 北肯
抄 chāo | to copy | 照着写 | 炒吵
翻 fān | to turn over | 反过来 | 番播
译 yì | to translate | 把一种语言换成另一种 | 择泽
释 shì | to explain | 说明 | 译泽
例 lì | example | 用来说明的事物 | 列倒
示 shì | to show | 给人看 | 宗票
段 duàn | section | 一部分 | 锻假
篇 piān | (measure word for essays) | 用于文章 | 偏编
`,
  `
验 yàn | to check, to test | 检查，试 | 险脸
招 zhāo | to recruit; to beckon | 用手示意；找人来 | 召超 | 聘
资 zī | money, resources | 钱和物 | 姿次
板 bǎn | board | 平的木片 | 版饭
领 lǐng | to lead; collar | 带头；衣服围着脖子的部分 | 岭邻 | 导
导 dǎo | to guide | 带路，引领 | 寻异 | 领
聘 pìn | to hire | 请人来工作 | 骋娉 | 招
赚 zhuàn | to earn | 得到利益 | 嫌谦
退 tuì | to move back; to return | 向后走；还回去 | 很腿
签 qiān | to sign | 写上名字 | 答检
`,
  `
户 hù | door; household | 门；一家 | 尸护
售 shòu | to sell | 卖 | 焦集 | 销
销 xiāo | to sell off; to cancel | 卖出去；去掉 | 锁消 | 售
产 chǎn | to produce | 生出，做出 | 广亭
品 pǐn | product; grade | 东西；等级 | 吕器
质 zhì | quality; nature | 本性；好坏的程度 | 盾贸
量 liàng/liáng | amount; to measure | 多少；测 | 重里
价 jià | price | 东西值的钱 | 介份
值 zhí | to be worth | 有某种价格或意义 | 直植
技 jì | skill | 本领 | 枝支
`,
  `
术 shù | method, art | 方法，技艺 | 木本
际 jì | border; between | 边；彼此之间 | 标陈
企 qǐ | enterprise; to hope | 公司；盼望 | 全会
厂 chǎng | factory | 做东西的大地方 | 广历
材 cái | material | 用来做东西的原料 | 村财
造 zào | to make, to build | 做，建 | 告选 | 制
制 zhì | to make; system | 做出来；规定 | 刺利 | 造
设 shè | to set up | 建立，安排 | 没投
效 xiào | effect | 功用，结果 | 校郊
率 lǜ/shuài | rate; to lead | 比例；带领 | 卒室
`,
  `
社 shè | society; group | 团体 | 祖杜
民 mín | people | 百姓 | 氏眠
罚 fá | to punish | 处分 | 骂罗
堵 dǔ | to block | 挡住不通 | 赌都
政 zhèng | politics | 管国家的事 | 正故
府 fǔ | government office | 官员办事的地方 | 付腐
律 lǜ | rule, law | 规定 | 津建 | 法
法 fǎ | law; method | 国家的规定；做事的方式 | 去活 | 律
警 jǐng | to warn; police | 提醒注意 | 敬惊
察 chá | to examine | 仔细看 | 擦祭
`,
  `
危 wēi | danger | 不安全 | 色厄 | 险
险 xiǎn | dangerous; risk | 可能出事的 | 脸验 | 危
规 guī | rule | 标准，法则 | 现观
守 shǒu | to guard; to obey | 看护；遵照 | 宇字
排 pái | to line up; row | 按次序放 | 非推
广 guǎng | wide | 面积大 | 厂庄
共 gòng | together; common | 一起 | 其兵
享 xiǎng | to enjoy | 得到满足 | 亨京
座 zuò | seat; (measure word for mountains and buildings) | 坐的地方；用于山和楼 | 坐庄 | 位
位 wèi | place; (polite measure word for people) | 所在的地方；用于人 | 住拉 | 座
`,
  `
增 zēng | to increase | 加多 | 曾赠
减 jiǎn | to decrease | 变少 | 喊碱
降 jiàng | to fall, to lower | 往下落 | 阵绛
速 sù | speed | 快慢 | 束连
农 nóng | farming | 种地 | 衣浓
村 cūn | village | 乡下人住的地方 | 材树
乡 xiāng | countryside; home village | 城市外面的地方；老家 | 多夕
镇 zhèn | town | 比城市小的地方 | 填真
济 jì | to help; (in 经济) economy | 帮助 | 挤齐
富 fù | rich | 钱多 | 福副
`,
  `
环 huán | ring; surroundings | 圆圈；四周 | 还坏
境 jìng | border; place | 边界；地方 | 镜竟
污 wū | dirty | 脏 | 汗乌
染 rǎn | to dye; to infect | 上颜色；被传上病 | 梁架
垃 lā | (first character of 垃圾) rubbish | 和后一个字一起表示脏东西 | 拉位 | 圾
圾 jī | (second character of 垃圾) waste | 和前一个字一起表示不要的东西 | 极级 | 垃
保 bǎo | to protect, to keep | 守护 | 堡呆
源 yuán | source | 水流开始的地方 | 原愿
浪 làng | wave; to waste | 大的水波；不节约 | 狼娘
洁 jié | clean | 干净 | 结桔
`,
  `
费 fèi | fee; to spend | 用的钱；用掉 | 弗贵
塑 sù | plastic; to mould | 用泥做像 | 朔望
袋 dài | bag | 装东西的软包 | 代装
植 zhí | to plant | 种 | 值直
森 sēn | forest | 很多的树 | 林木
沙 shā | sand | 很细的石头 | 少抄
尘 chén | dust | 很小的土 | 尖坐
雾 wù | fog | 近地面的水汽 | 雪务
灾 zāi | disaster | 大的不幸 | 灭灰
野 yě | wild; field | 不是人养的；田地 | 理预
`,
  `
震 zhèn | to shake | 很快地动 | 振雷
暴 bào | violent; sudden | 又急又猛 | 爆暑
汽 qì | steam, vapour | 水变成的气 | 气洗
油 yóu | oil | 动植物或矿里来的脂肪 | 由抽
煤 méi | coal | 黑色的可以烧的石头 | 媒谋
粮 liáng | grain | 吃的米和面 | 良狼 | 食
食 shí | food; to eat | 吃的东西 | 良餐 | 粮
死 sǐ | to die | 没有生命了 | 列夕
伤 shāng | wound; to hurt | 身体受的害 | 份仿
救 jiù | to rescue | 帮人离开危险 | 求球
`,
  `
络 luò | net | 像网的东西 | 洛给
软 ruǎn | soft | 不硬 | 饮砍
硬 yìng | hard | 不软 | 更便
器 qì | device | 用具 | 哭品
键 jiàn | key (on a keyboard) | 按下去的部分 | 健建
屏 píng | screen | 挡的东西；显示的面 | 并屋 | 幕
幕 mù | curtain | 挂着的大布 | 墓暮 | 屏
载 zài | to carry; (in 下载) to download | 运送 | 栽裁
智 zhì | wise | 聪明 | 知晋
删 shān | to delete | 去掉 | 册刷
`,
  `
密 mì | secret; dense | 不让别人知道的；间隔小 | 蜜宝
登 dēng | to climb; to log in | 往上走；进入 | 凳证
录 lù | to record | 记下 | 绿禄
账 zhàng | account | 记钱的本子 | 胀张
存 cún | to store, to deposit | 放好，留着 | 在字
搜 sōu | to search | 找 | 嫂瘦 | 索
索 suǒ | to search; rope | 求取；粗绳 | 素紧 | 搜
充 chōng | to fill; to charge | 装满 | 允克
池 chí | pool | 装水的小坑 | 地也
频 pín | frequent | 次数多 | 颁步
`,
  `
程 chéng | journey; procedure | 路的长短；规定的步骤 | 呈和
序 xù | order | 先后 | 床库
统 tǒng | to unite; system | 合在一起 | 充绕
版 bǎn | edition | 出的书的次数；印的板 | 板反
功 gōng | merit; skill | 做成的事 | 工力
装 zhuāng | to load; to install | 放进去；安上 | 壮衣
修 xiū | to repair | 弄好坏了的东西 | 候悠
维 wéi | to maintain | 保持 | 准堆
卡 kǎ | card | 小的硬纸片 | 上下
坏 huài | bad; broken | 不好；不能用了 | 杯环
`,
  `
传 chuán | to pass on | 交给别人 | 专转
艺 yì | art; skill | 技术，才能 | 乙忆
剧 jù | play, drama | 戏 | 据居
博 bó | rich, wide | 多，广 | 傅搏
展 zhǎn | to unfold; exhibition | 打开；给人看 | 屋层
览 lǎn | to look at | 看 | 监揽
族 zú | ethnic group; clan | 有相同血统的一群人 | 旅放
俗 sú | custom; vulgar | 习惯；不高雅 | 谷浴
古 gǔ | ancient | 很久以前的 | 占右
诗 shī | poem | 有韵律的文学 | 时持
`,
  `
画 huà | painting; to draw | 图；用笔描 | 面函
琴 qín | stringed instrument | 一种乐器 | 琵今
奏 zòu | to play (music) | 用乐器发出音乐 | 春秦
龙 lóng | dragon | 中国古代传说中的动物 | 尤优
宫 gōng | palace | 帝王住的房子 | 官营
庙 miào | temple | 拜神的地方 | 店应
纪 jì | to record; era | 记下；年代 | 记级
念 niàn | to read aloud; to miss | 读；想 | 今怎
庆 qìng | to celebrate | 为好事高兴 | 厌床
拜 bài | to pay respects; to visit | 敬礼；看望 | 拌湃
`,
  `
银 yín | silver | 白色的金属 | 很根
付 fù | to pay | 交钱 | 什村
款 kuǎn | sum of money | 一笔钱；条文 | 软欺
折 zhé | to fold; discount | 弯过来；价钱减少 | 拆析 | 扣
扣 kòu | to button; to deduct | 系上；减去 | 和扛 | 折
币 bì | currency | 国家发行的钱 | 市巾
免 miǎn | to exempt; free of | 不用 | 兔晚
税 shuì | tax | 交给国家的钱 | 说脱
额 é | forehead; amount | 头的前部；数量 | 客颜
预 yù | in advance | 事先 | 顶领
`,
  `
购 gòu | to buy | 买 | 构沟
消 xiāo | to disappear; to consume | 没有了；用掉 | 销稍
惠 huì | favour, benefit | 好处 | 想思
牌 pái | sign; brand | 写着字的板子；名字 | 脾啤
货 huò | goods | 卖的东西 | 贷华
批 pī | to criticize; batch | 指出缺点；一群 | 比此
递 dì | to hand over | 一个一个地交给 | 弟第
寄 jì | to mail | 用邮局送 | 奇骑
邮 yóu | post | 寄信、送包的 | 由油
址 zhǐ | site, address | 地方 | 止扯
`,
  `
者 zhě | one who | 做某事的人 | 着都
采 cǎi | to pick | 摘 | 菜彩
访 fǎng | to visit | 去看人，问人 | 方放
宣 xuān | to declare | 公开说 | 宜宫
布 bù | cloth; to announce | 做衣服的料子；告诉大家 | 市希
举 jǔ | to lift; to hold (an event) | 往上拿；办 | 兴单
首 shǒu | head; first; (measure word for songs) | 头；第一；用于歌 | 自道
众 zhòng | crowd | 很多人 | 从会
战 zhàn | war, battle | 打仗 | 站占
争 zhēng | to argue; to compete | 抢；吵 | 净筝
`,
  `
惯 guàn | habit | 一直这样，不改 | 贯观
养 yǎng | to raise; to keep (a pet) | 给吃的让长大 | 美羊
营 yíng | camp; to run (a business) | 军队住的地方；谋取 | 宫劳
熬 áo | to boil; to stay up | 慢慢煮；忍着 | 熟傲
夜 yè | night | 晚上 | 液衣
肥 féi | fat | 脂肪多 | 把吧
宠 chǒng | to dote on | 爱，偏爱 | 龙宝
抽 chōu | to draw out; to smoke | 拉出；吸 | 油由
烟 yān | smoke; cigarette | 东西烧时的气 | 因咽
散 sàn/sǎn | to scatter; to take a walk | 分开 | 故教
`,
];
