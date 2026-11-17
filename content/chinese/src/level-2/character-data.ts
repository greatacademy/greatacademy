// The characters of level 2 (docs/chinese-curriculum.md §8.3): 300 characters in 30 batches of ten, none of them taught
// in level 1, close to level 2 of GF 0025-2021, ordered so that each unit's words and sentences can be written with what
// has been taught.
//
// A line a character, as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.

/** characterBatches are the 30 batches of level 2 characters, in teaching order. */
export const characterBatches: readonly string[] = [
  `
着 zhe/zháo/zhuó | (after a verb) in a lasting state | 用在动词后，表示动作或状态在持续 | 看差
把 bǎ/bà | (moves the object before the verb); handle | 介词，使动作的对象放在动词前；器物上用手握住的部分 | 吧爸
被 bèi | (marks the passive) by | 介词，引出动作的发出者，表示主语受到动作 | 破彼
又 yòu | again (it already happened) | 表示动作重复或相继发生 | 叉双
已 yǐ | already | 表示事情完成或时间过去 | 己巳 | 经
经 jīng | to pass through; (in 已经) already | 通过；和“已”组成表示完成的词 | 轻径
正 zhèng/zhēng | just now, in the middle of; upright | 表示动作在进行中；不歪 | 止五
才 cái | only then; only just | 表示事情发生得晚或刚刚发生 | 寸木
只 zhǐ/zhī | only | 仅仅，表示限于某个范围 | 兄叭
更 gèng/gēng | even more | 表示程度又高了一层 | 便吏
`,
  `
非 fēi | not; wrong | 不是；不对 | 韭排
常 cháng | often | 时时，不只一次 | 堂尝
自 zì | self; from | 本人；从 | 目白
己 jǐ | oneself | 本人，自身 | 已巳 | 自
告 gào | to tell; to announce | 把事情说给别人 | 吉舌
诉 sù | to tell; to complain | 说给人听 | 话拆 | 告
准 zhǔn | accurate; to allow | 正确；允许 | 谁淮
备 bèi | to prepare | 预先安排 | 各务
完 wán | to finish; whole | 做好了，结束；全部 | 宗元
成 chéng | to become; to succeed | 变为；做好 | 城戍
`,
  `
刷 shuā | to brush | 用毛做的工具清除或涂抹 | 刮刺
牙 yá | tooth | 嘴里咬东西的器官 | 芽呀
脸 liǎn | face | 头的前部，从额到下巴 | 险检
澡 zǎo | bath | 洗身体 | 操燥
床 chuáng | bed | 睡觉用的家具 | 庆麻
醒 xǐng | to wake up | 睡眠结束，恢复知觉 | 酸星
拿 ná | to take, to hold | 用手抓取或握住 | 合拳
放 fàng | to put; to let go | 使处在某个位置；松开 | 方故
忘 wàng | to forget | 不记得 | 忙忍
记 jì | to remember; to note down | 把事情留在脑子里；写下来 | 计纪
`,
  `
然 rán | like that; (in 当然) of course | 这样，如此 | 燃热
但 dàn | but | 表示转折 | 担旦
虽 suī | (in 虽然) although | 表示让步，承认某个事实 | 虾强
如 rú | if; like | 假使；像 | 好奴
应 yīng/yìng | should; to answer | 理当如此；回答 | 广庆
该 gāi | ought to | 理所当然，必须这样 | 孩刻 | 应
刚 gāng | just (a moment ago) | 不久以前 | 冈则
定 dìng | to decide; fixed | 拿主意；不改变的 | 是宝
直 zhí | straight; directly | 不弯曲；不拐弯地 | 真植
当 dāng/dàng | to act as; (in 当然) of course | 担任；和“然”组成表示理应如此的词 | 雪尚
`,
  `
静 jìng | quiet, calm | 没有声音，不动 | 净睛
厅 tīng | hall, living room | 招待客人、聚会用的大房间 | 斤厉
室 shì | room | 屋子 | 屋至
厨 chú | kitchen | 做饭菜的地方 | 厕橱
窗 chuāng | window | 墙上通风透光的洞 | 囱空
灯 dēng | lamp, light | 照明的器具 | 订打
桌 zhuō | table, desk | 上面放东西的家具 | 卓桑
椅 yǐ | chair | 有靠背的坐具 | 倚骑
久 jiǔ | long (in time) | 时间长 | 欠夕
层 céng | floor, storey; layer | 楼房的一级；重叠的一部分 | 屋尽
`,
  `
搬 bān | to move (house, things) | 移动较重或较大的东西 | 般撒
租 zū | to rent | 付钱使用别人的东西 | 组祖
区 qū | district, area | 一定的地方范围 | 匹医
城 chéng | city; city wall | 人口集中的大地方 | 成诚
市 shì | city; market | 都会；做买卖的地方 | 布币 | 城
街 jiē | street | 城里两边有房子的路 | 行衔
邻 lín | neighbour | 住得近的人家 | 铃怜
居 jū | to live, to reside | 住 | 剧据
附 fù | near; to attach | 靠近；另外加上 | 付咐
安 ān | safe; quiet | 没有危险；平静，稳定 | 女案
`,
  `
干 gān/gàn | dry; (in 干净) clean; to do (gàn) | 没有水分；做 | 千于 | 净
净 jìng | clean | 没有脏东西 | 争静
扫 sǎo/sào | to sweep | 用笤帚除去尘土垃圾 | 归扣
收 shōu | to receive; to put away | 接受；把东西放好 | 牧攻
拾 shí | to pick up; (in 收拾) to tidy | 从地上拿起来 | 拍给 | 收
换 huàn | to change, to exchange | 拿一样东西给人，同时取回另一样 | 唤挽
冰 bīng | ice | 水冷到零度以下变成的固体 | 水冲
箱 xiāng | box, case | 放东西的方形器具 | 相霜
空 kōng/kòng | empty; sky; free time (kòng) | 里面没有东西；天 | 穷穿
调 tiáo/diào | to adjust; (in 空调) air conditioner | 使搭配得合适；和“空”组成指让屋里变凉或变暖的机器 | 周凋
`,
  `
颜 yán | face; (in 颜色) colour | 脸；和“色”组成指红、黄、蓝等的词 | 彦须
色 sè/shǎi | colour | 光波使眼睛产生的感觉，如红、绿 | 包巴 | 颜
蓝 lán | blue | 像晴天天空的颜色 | 篮监
绿 lǜ | green | 像草和树叶的颜色 | 缘录
黄 huáng | yellow | 像香蕉皮的颜色 | 寅典
裤 kù | trousers | 穿在腰下、包住两条腿的衣服 | 库裙
裙 qún | skirt | 围在腰下、不分两腿的衣服 | 群裤
鞋 xié | shoe | 穿在脚上走路用的东西 | 鞍鞭
帽 mào | hat, cap | 戴在头上的东西 | 冒帕
戴 dài | to wear (a hat, glasses) | 把东西放在头、脸、手等处 | 载截
`,
  `
漂 piào/piāo/piǎo | (in 漂亮) pretty; to float (piāo) | 和“亮”组成表示好看的词；浮在水面 | 飘标 | 美
亮 liàng | bright | 光线强 | 高壳
短 duǎn | short (in length) | 两端之间距离小 | 矩知
双 shuāng | pair; two | 两个；成对的 | 又对
条 tiáo | (measure word for long, thin things) | 用于细长的东西，如路、鱼、裤子 | 杀务
张 zhāng | (measure word for flat things); a surname | 用于平面的东西，如纸、桌子 | 长涨
合 hé | to close; to fit | 闭上；相符，一致 | 会含
适 shì | suitable | 符合要求，正好 | 话活 | 合
旧 jiù | old (not new) | 过去的，用过很久的 | 归日
美 měi | beautiful | 好看 | 羊关
`,
  `
馆 guǎn | hall, building (for a service) | 招待客人或做文化活动的房屋 | 官管
务 wù | affair, business | 事情 | 各备
员 yuán | member, person employed | 做某种工作的人 | 贝圆
单 dān | single; list | 一个；记事物的纸 | 早甲
碗 wǎn | bowl | 盛饭菜的器具，口大底小 | 腕婉
筷 kuài | chopstick | 吃饭时夹东西用的细棍 | 快策
盘 pán | plate, dish | 盛东西的扁而浅的器具 | 盆船
瓶 píng | bottle | 口小肚大的容器 | 并屏
汤 tāng | soup | 做菜时煮出来的汁水 | 场扬
糖 táng | sugar; sweets | 从甘蔗等提取的甜的东西 | 塘唐
`,
  `
甜 tián | sweet | 像蜜的味道 | 舌甘
辣 là | spicy | 刺激舌头、嘴里像火烧的味道 | 辨刺
酸 suān | sour | 像醋的味道 | 醒唆
苦 kǔ | bitter; hard (of life) | 像黄连的味道；难受 | 若古
香 xiāng | fragrant; tasty | 气味好闻；食物味道好 | 杏季
渴 kě | thirsty | 口干想喝水 | 喝竭
饱 bǎo | full (after eating) | 吃够了 | 抱泡
饺 jiǎo | dumpling | 用面皮包馅儿做成的食品 | 校饶
啤 pí | (in 啤酒) beer | 和“酒”组成指用麦子做的酒 | 脾碑
咖 kā | (in 咖啡) coffee | 和“啡”组成指一种热饮 | 加驾
`,
  `
啡 fēi | (in 咖啡) coffee bean | 和“咖”组成指一种热饮 | 非排
苹 píng | (in 苹果) apple | 和“果”组成指一种水果 | 平萍
瓜 guā | melon | 一种长在地上的蔓生植物的果实 | 爪孤
鲜 xiān | fresh | 新的，没有变坏的 | 鱼解
羊 yáng | sheep, goat | 一种家畜，毛可以做衣服 | 洋美
猪 zhū | pig | 一种家畜，肉可以吃 | 诸猎
刀 dāo | knife | 切东西的工具 | 力刃
够 gòu | enough | 满足需要的数量 | 句购
饮 yǐn | to drink | 喝 | 次饭
料 liào | material; (in 饮料) a drink | 可以用来做东西的东西；和“饮”组成指可以喝的东西 | 科斗 | 饮
`,
  `
司 sī | (in 公司) company; to be in charge | 主持；和“公”组成指做生意的单位 | 同词 | 理
理 lǐ | to manage; reason | 办，整顿；事物的规律 | 埋里
办 bàn | to do, to handle | 做，处理 | 为力
议 yì | to discuss; opinion | 商量讨论；意见 | 义仪
职 zhí | job, post | 工作的位置 | 识耳
业 yè | line of work; course of study | 工作的种类；学习的功课 | 亚显
加 jiā | to add | 使数量比原来多 | 架如
介 jiè | between; (in 介绍) to introduce | 在两者中间 | 价今 | 绍
绍 shào | to introduce (in 介绍) | 和“介”组成表示使双方认识的词 | 招结
迎 yíng | to welcome | 高兴地接来的人 | 仰近
`,
  `
脑 nǎo | brain | 头里管思想的器官 | 恼胸
网 wǎng | net; internet | 用绳线结成的捕鱼工具；连接电脑的系统 | 冈罔
接 jiē | to receive; to pick up; to connect | 迎人；连在一起 | 按妾
发 fā/fà | to send; hair (fà) | 送出，交付；人头上长的毛 | 友拔
信 xìn | letter; to believe | 写给别人的书面的话；认为真实 | 言倍
纸 zhǐ | paper | 写字、画画用的薄片 | 低氏
笔 bǐ | pen, brush | 写字画画的工具 | 毛竿
页 yè | page | 书本中一张的一面 | 贝顶
词 cí | word | 语言里最小的可以独立运用的单位 | 司祠
错 cuò | wrong; mistake | 不对，不正确 | 借措
`,
  `
钟 zhōng | clock; o'clock | 计时的器具；时间 | 种冲
刻 kè | quarter (of an hour); to carve | 十五分钟；用刀雕 | 该亥
迟 chí | late | 比规定的时间晚 | 尺迅
差 chà/chā/chāi | to fall short; poor | 不够，缺少；不好 | 羞着
讲 jiǎng | to speak; to explain | 说；解释 | 讯进
懂 dǒng | to understand | 知道，明白 | 董憧
助 zhù | to help | 帮 | 动且
努 nǔ | (in 努力) to make an effort | 和“力”组成表示用心尽力的词 | 怒奴 | 力
力 lì | strength; force | 身体的劲儿 | 刀办
留 liú | to stay; to keep | 停在某处不离开；保存 | 溜榴
`,
  `
鼻 bí | nose | 人和动物闻气味、呼吸的器官 | 自界
嘴 zuǐ | mouth | 人或动物吃东西、说话的器官 | 喘咀
腿 tuǐ | leg | 人和动物支持身体、走路的部分 | 退腰
肚 dù/dǔ | belly | 人和动物身体前面中部的部分 | 杜吐
烧 shāo | to burn; to have a fever | 使东西着火；体温高 | 浇绕
感 gǎn | to feel | 觉得 | 咸惑
冒 mào | to give off; (in 感冒) a cold | 向外透；和“感”组成指一种常见病 | 昌帽
舒 shū | to stretch; (in 舒服) comfortable | 伸展；和“服”组成表示身心愉快的词 | 舍野
健 jiàn | healthy; strong | 强壮，没有病 | 建键 | 康
康 kāng | well, in good health | 安宁，没有疾病 | 唐庚
`,
  `
护 hù | to protect; (in 护士) nurse | 保卫；照料 | 沪扩
检 jiǎn | to check, to examine | 查看 | 捡险 | 查
查 chá | to check; to look up | 检验，翻看 | 杏渣
胖 pàng | fat | 身上肉多 | 伴拌
瘦 shòu | thin | 身上肉少 | 搜嫂
重 zhòng/chóng | heavy; important; again (chóng) | 分量大；要紧 | 里董
轻 qīng | light (in weight) | 分量小 | 经径
低 dī | low | 从下到上距离小 | 纸底
睛 jīng | eyeball (in 眼睛) | 眼珠 | 晴请
口 kǒu | mouth; opening | 嘴；出入的地方 | 日回
`,
  `
旅 lǚ | to travel | 在外地行走 | 族旋 | 游
游 yóu | to swim; to tour | 在水里划动；到各处玩 | 族旅
宾 bīn | guest | 客人 | 宝兵
照 zhào | to shine; to take (a photo) | 光线射在物体上；拍摄 | 熙昭 | 相
相 xiāng/xiàng | each other; photo (xiàng) | 彼此；照片 | 想箱
片 piàn/piān | slice; film | 平而薄的东西 | 斤爿
行 xíng/háng | to walk; OK; line of business (háng) | 走；可以 | 街衔
李 lǐ | plum; a surname | 一种果树；姓 | 季杏
图 tú | picture; map | 用线条颜色画出来的形象 | 国团
订 dìng | to book, to order | 预先约定 | 灯打
`,
  `
景 jǐng | view, scenery | 风光 | 影京
离 lí | to leave; away from | 分开；相距 | 禽高
乘 chéng | to ride (a vehicle) | 坐车、船、飞机等 | 乖剩 | 骑
骑 qí | to ride (astride) | 两腿跨坐在上面 | 椅奇
辆 liàng | (measure word for vehicles) | 用于车 | 两俩
停 tíng | to stop | 不再动 | 亭偏
线 xiàn | line; thread | 细长的东西；交通的路 | 钱浅
拍 pāi | to clap; to take (a photo) | 用手掌打；照相 | 怕柏
遍 biàn | (measure word for times, start to end) | 从头到尾一次 | 编篇
全 quán | whole; all | 完整，所有的 | 金会
`,
  `
部 bù | part; department | 全体中的一块；单位里的一个机构 | 倍陪
处 chù/chǔ | place; to get along with (chǔ) | 地方；和人交往 | 外冬
遇 yù | to meet (by chance) | 碰到 | 偶愚
假 jià/jiǎ | holiday (jià); false (jiǎ) | 休息的日子；不真的 | 暇段
世 shì | world; lifetime | 人间；一生 | 也廿 | 界
界 jiè | boundary; (in 世界) world | 两地相交的地方 | 介果
计 jì | to count; to plan | 算；打算 | 讨订 | 划
划 huà/huá | to plan; to row (huá) | 安排；拨水前进 | 刘戈
清 qīng | clear; clean | 干净透明 | 请情 | 楚
楚 chǔ | clear (in 清楚) | 明白 | 楼梦
`,
  `
兴 xìng/xīng | (in 高兴) glad; interest | 喜欢做事的情绪 | 共关 | 乐
乐 lè/yuè | happy; music (yuè) | 快活；音调的艺术 | 东尔
笑 xiào | to laugh, to smile | 脸上露出高兴的样子 | 关笔
哭 kū | to cry | 因伤心而流泪出声 | 器臭
怕 pà | to fear | 畏惧 | 拍伯
希 xī | to hope | 盼望 | 布帝 | 望愿
望 wàng | to look far; to hope | 向远处看；盼着 | 忘星 | 愿
愿 yuàn | to wish; willing | 希望；乐意 | 原源
情 qíng | feeling | 心里的感觉 | 请清
担 dān/dàn | to carry; (in 担心) to worry | 挑；和“心”组成表示放心不下的词 | 但胆
`,
  `
害 hài | harm; (in 害怕) afraid | 坏处；使受损 | 割宫
急 jí | anxious; urgent | 心里不安，想马上做到；紧要 | 怎刍
紧 jǐn | tight; tense | 不松 | 坚累
满 mǎn | full; satisfied | 充实，没有空的地方 | 瞒俩
讨 tǎo | to ask for; (in 讨厌) to dislike | 要；和“厌”组成表示不喜欢的词 | 计付 | 厌
厌 yàn | to be fed up with | 嫌弃，不喜欢 | 压厉
怪 guài | strange; to blame | 少见的，不平常的；怨 | 径圣
哈 hā | (sound of laughter) ha | 笑的声音 | 合恰
啊 a/ā/á/ǎ/à | (particle of feeling) ah | 用在句子末尾，表示感叹 | 阿呵 | 呀
呀 ya | (particle of surprise) oh | 用在句子末尾，表示惊讶 | 牙呵
`,
  `
山 shān | mountain | 地面上高起的部分 | 出仙
海 hǎi | sea | 大洋靠近陆地的部分 | 每梅
河 hé | river | 天然或人工的大水道 | 何可 | 江
江 jiāng | great river | 很大的河流 | 红工
树 shù | tree | 木本植物的总称 | 村对
花 huā | flower; to spend | 植物开出的好看的部分；用掉 | 化华
草 cǎo | grass | 地上长的小植物 | 早革
鸟 niǎo | bird | 会飞、有羽毛的动物 | 马乌
云 yún | cloud | 天空中的水汽团 | 会去
湖 hú | lake | 陆地上的大片水面 | 胡糊
`,
  `
狗 gǒu | dog | 一种家畜，会看门 | 句够
猫 māo | cat | 一种家畜，会捉老鼠 | 描苗
马 mǎ | horse | 一种家畜，能拉车、供人骑 | 鸟妈
动 dòng | to move | 改变原来的位置 | 劝运
物 wù | thing | 东西 | 牧勿
阳 yáng | the sun; sunny side | 日光；山的南面 | 阴阻
光 guāng | light | 照在物体上使人能看见的东西 | 先兴
叶 yè | leaf | 植物长在茎上的绿色片状部分 | 叫计
石 shí | stone | 构成地壳的坚硬物质 | 右名
熊 xióng | bear | 一种体大、能爬树的野兽 | 能态
`,
  `
季 jì | season | 一年分成春夏秋冬，每一段叫一个 | 李委
节 jié | festival; section | 庆祝或纪念的日子；段落 | 艺苹
温 wēn | warm; temperature | 不冷不热 | 湿渴 | 暖
暖 nuǎn | warm | 温度适宜，不冷 | 缓援
度 dù | degree | 计量冷热、角的大小的单位 | 席渡
凉 liáng | cool | 温度低，有点冷 | 谅京
刮 guā | to blow (of wind); to scrape | 风吹；用刀去掉表面的东西 | 话舌
变 biàn | to change | 和原来不同 | 亦恋 | 化
化 huà | to melt; to turn into | 冰雪成了水；改变 | 花代
林 lín | woods | 成片的树木 | 材休
`,
  `
运 yùn | to carry; (in 运动) to move | 搬送；和“动”组成指锻炼身体的活动 | 远云
泳 yǒng | to swim | 在水里游 | 永咏
跳 tiào | to jump | 两脚用力离开地面 | 桃逃
舞 wǔ | dance | 跟着音乐做的动作 | 午无
爬 pá | to climb; to crawl | 手脚一起向前或向上移动 | 爪把
篮 lán | basket | 有提手的盛东西的器具 | 蓝监
足 zú | foot; (in 足球) football | 脚 | 走定
赛 sài | match, competition | 比本领、技术的活动 | 寒塞
踢 tī | to kick | 用脚碰 | 赐惕
练 liàn | to practise | 反复地做 | 炼拣
`,
  `
队 duì | team; line | 有组织的集体；行列 | 认坠
输 shū | to lose (a game); to transport | 失败；运送 | 偷喻
赢 yíng | to win | 胜，得胜 | 嬴羸
锻 duàn | (in 锻炼) to work out; to forge | 打铁 | 段缎 | 炼
炼 liàn | to refine; (in 锻炼) to train | 用火把物质烧好 | 练炸
拉 lā | to pull | 用力使朝自己方向移动 | 垃位
推 tuī | to push | 用力使朝外移动 | 谁堆
参 cān | to join (in 参加) | 加入 | 惨渗
坚 jiān | firm | 结实，牢固 | 竖紧
持 chí | to hold; (in 坚持) to persist | 拿着；一直做下去 | 特侍
`,
  `
目 mù | eye; item | 眼睛；条款，细分的项 | 日自
闻 wén | to hear; to smell; (in 新闻) news | 听见；用鼻子嗅 | 问间
报 bào | newspaper; to report | 印着新闻的纸；告诉 | 极服
播 bō | to broadcast; to sow | 传送出去；撒种 | 番翻
故 gù | old story; reason | 旧事；原因 | 古做
杂 zá | mixed; (in 杂志) magazine | 多种多样的 | 朵杀 | 志
志 zhì | will; record | 心里要做什么的打算；记录 | 忘去
声 shēng | sound; voice | 听得到的响动，人说话的响动 | 卢严 | 音
音 yīn | sound; musical note | 耳朵听到的响动；乐曲的单个响动 | 意竟
演 yǎn | to perform | 把戏剧、歌舞等表现出来 | 寅浪
`,
  `
码 mǎ | (in 号码) number, code | 表示数目的符号 | 马吗
聊 liáo | to chat | 随便说话 | 柳耶 | 谈
微 wēi | tiny; (in 微信) WeChat | 小，细小 | 徽征
句 jù | sentence | 由词组成的、能表达完整意思的话 | 包勾
论 lùn | to discuss; theory | 分析说明事理 | 伦轮 | 谈
简 jiǎn | simple | 不复杂 | 筒间
复 fù | again; to reply; complex | 再，又；回答 | 夏履
谈 tán | to talk | 说话，讨论 | 淡炎
内 nèi | inside | 里面 | 肉丙
容 róng | to hold; (in 内容) content | 装进去 | 客谷
`,
  `
礼 lǐ | gift; courtesy | 送给人的东西；表示尊敬的方式 | 扎社
祝 zhù | to wish (someone well) | 表示良好的愿望 | 视兄 | 贺
贺 hè | to congratulate | 庆祝，道喜 | 货加
糕 gāo | cake | 用米粉、面粉等做的食品 | 羔糖
婚 hūn | marriage | 结为夫妻 | 昏娘
份 fèn | portion; copy | 整体里的一部分；用于报纸、礼物等 | 分扮
福 fú | good fortune | 好的运气，使人满意的生活 | 富副
结 jié/jiē | to tie; (in 结婚) to marry | 用绳子打扣；完成 | 给洁 | 束
束 shù | to bind; bundle | 捆住；一把 | 来柬
饼 bǐng | flat cake (as in 月饼) | 圆而扁的面食 | 并瓶
`,
];
