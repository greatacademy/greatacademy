// The characters of level 4 (docs/chinese-curriculum.md §8.4): 300 characters in 30 batches of ten, none of them taught
// in levels 1 to 3, close to level 4 of GF 0025-2021, ordered so that each unit's words and sentences can be written with
// what has been taught.
//
// A line a character, as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.

/** characterBatches are the 30 batches of level 4 characters, in teaching order. */
export const characterBatches: readonly string[] = [
  `
治 zhì | to treat; to govern | 用药或别的办法让病好；管理 | 冶始 | 疗
疗 liáo | to cure | 给人看病，让病好 | 疼疮 | 治
患 huàn | to suffer from; trouble | 得了（病）；灾难 | 串思
痛 tòng | pain; to ache | 疼 | 通桶
血 xuè/xiě | blood | 身体里流着的红色液体 | 皿而
压 yā | to press; pressure | 从上面用力；向下的力 | 庄厌
呼 hū | to breathe out; to call | 往外出气；喊 | 乎呀
吸 xī | to breathe in; to absorb | 往里进气；把东西收进来 | 级极
胃 wèi | stomach | 消化食物的器官 | 胆冒
骨 gǔ | bone | 身体里支撑的硬东西 | 滑育
`,
  `
针 zhēn | needle; injection | 缝衣服的细长工具；打进身体的药 | 计钟
诊 zhěn | to examine (a patient) | 医生看病 | 珍趁
断 duàn | to break; to judge | 分成两段；判定 | 继新
炎 yán | inflammation | 身体某处红肿发热 | 淡谈
毒 dú | poison | 能害死人或伤身体的东西 | 每素
防 fáng | to guard against | 事先做准备，不让坏事发生 | 访房
恢 huī | to recover | 回到原来的样子 | 灰怀
活 huó | to live; lively | 生存；不死板 | 话括
弱 ruò | weak | 力气小，不强 | 羽溺
受 shòu | to receive; to suffer | 接到；遭到 | 爱授
`,
  `
素 sù | element; plain | 构成事物的基本成分；颜色单一 | 索毒
始 shǐ | to begin | 开头 | 治姑
眠 mián | sleep | 睡觉 | 眼民
疫 yì | epidemic | 传得很快的病 | 役疲
苗 miáo | seedling; vaccine | 刚长出来的小植物；防病的药 | 苦笛
抗 kàng | to resist | 抵挡，对着干 | 坑航
士 shì | scholar; soldier | 读书人；军人 | 土干
敏 mǐn | quick; sensitive | 快，灵活；感觉强 | 每繁
皮 pí | skin; leather | 身体表面的一层 | 波披 | 肤
肤 fū | skin | 人身体表面的一层 | 扶肢 | 皮
`,
  `
航 háng | to sail; to fly | 船在水上走，飞机在天上飞 | 抗般
驾 jià | to drive | 开（车），操纵 | 加架 | 驶
驶 shǐ | (of vehicles) to move fast | 车、船开动 | 使史 | 驾
港 gǎng | harbor | 停船的地方 | 巷洪
桥 qiáo | bridge | 架在河上方便通过的建筑 | 侨娇
弯 wān | bent; a bend | 不直；不直的地方 | 湾变 | 拐
拐 guǎi | to turn; to abduct | 转方向；骗走 | 别另 | 弯
轮 lún | wheel; turn | 车上能转的圆东西；按次序 | 论伦
胎 tāi | fetus; tire | 母亲肚子里的孩子；车轮外面的橡胶圈 | 抬治
宿 sù/xiǔ/xiù | to stay overnight | 过夜 | 缩宽
`,
  `
返 fǎn | to return | 回 | 反饭
抵 dǐ | to arrive; to resist | 到；挡住 | 低底 | 达
达 dá | to reach | 到 | 过大 | 抵
延 yán | to extend; to delay | 拉长；推迟 | 廷诞
靠 kào | to lean on; to rely on | 依着；依赖 | 告非
托 tuō | to hold up; to entrust | 用手掌向上承着；请人办事 | 扎毛
兑 duì | to exchange | 换成别的 | 说兄
途 tú | way, route | 路 | 余速
迷 mí | to be lost; fan | 分不清方向；特别爱好某事的人 | 米谜
距 jù | distance | 两处之间的长度 | 拒巨
`,
  `
列 liè | to line up; row | 排；行 | 例烈
取 qǔ | to take, to fetch | 拿 | 娶趣
舱 cāng | cabin | 船或飞机里坐人放东西的地方 | 仓抢
向 xiàng | direction; toward | 方位；对着 | 问同
岛 dǎo | island | 四面是水的陆地 | 鸟岸
沿 yán | along; edge | 顺着；边 | 铅船
陆 lù/liù | land | 地面 | 陈陵
省 shěng/xǐng | province; to save | 地方行政区；节约 | 少看 | 州
州 zhōu | prefecture, state | 古代的行政区，也用在地名里 | 川洲 | 省
随 suí | to follow; any | 跟着；任凭 | 堕陆
`,
  `
媒 méi | medium; go-between | 使双方发生关系的人或东西 | 谋煤
评 píng | to comment; to judge | 说出好坏；判定 | 平坪
转 zhuǎn/zhuàn | to turn; to pass on | 改变方向；传给别人 | 传砖
粉 fěn | powder; fan | 很细的末儿；喜爱某人的人 | 份纷
丝 sī | silk; thread | 蚕吐的细线；细长的东西 | 纱经
注 zhù | to pour; to focus on | 灌进去；集中精力 | 住柱
阅 yuè | to read | 看（文字） | 说悦 | 浏
浏 liú | to glance over | 大概地看 | 刘测 | 阅
链 liàn | chain; link | 环连起来的东西 | 连锁
隐 yǐn | hidden | 藏起来，不让人看见 | 稳急
`,
  `
私 sī | private; selfish | 个人的；只为自己 | 和秘
群 qún | group, crowd | 聚在一起的人或东西 | 君裙
圈 quān/juàn | circle; to enclose | 圆形的东西；围起来 | 卷图
晒 shài | to dry in the sun; to show off | 太阳照着；把东西给别人看 | 洒西
讯 xùn | message | 消息 | 迅训
标 biāo | mark; sign | 记号 | 际票
编 biān | to edit; to weave | 整理资料写成书；用细条交叉组织起来 | 偏篇 | 辑
辑 jí | to collect, to edit | 收集材料整理 | 缉输 | 编
骗 piàn | to cheat | 用假话让人上当 | 编偏 | 诈
诈 zhà | to swindle | 用手段骗人 | 作炸 | 骗
`,
  `
谣 yáo | rumor; ballad | 没有根据的话；民歌 | 摇遥
虚 xū | empty; false | 空；不真实 | 虎处
台 tái | platform; station | 高而平的地方；广播电视机构 | 抬治
击 jī | to hit | 打 | 去出
秘 mì/bì | secret | 不让人知道的 | 必私
摄 shè | to take (a photo) | 拍照，录像 | 聂摸
主 zhǔ | master; main | 东家；最重要的 | 王住
戏 xì | play, show | 演出的剧；玩耍 | 对观
况 kuàng | situation | 情形 | 兄沉
言 yán | speech, words | 说的话 | 信音
`,
  `
朝 cháo/zhāo | dynasty; toward; morning | 一个王族统治的时期；面对；早上 | 潮期
代 dài | generation; dynasty; in place of | 时期；替 | 伐袋
皇 huáng | emperor | 国家最高的统治者 | 煌白 | 帝王
帝 dì | emperor; god | 君主；天上的神 | 带常 | 皇王
王 wáng | king | 一国的君主 | 玉主 | 皇帝
将 jiāng/jiàng | will; general | 就要；带兵的官 | 奖酱
军 jūn | army | 国家的武装力量 | 车运 | 兵
兵 bīng | soldier; weapons | 战士；武器 | 丘乒 | 军
英 yīng | hero; flower | 才能出众的人；花 | 央映 | 雄
雄 xióng | male; mighty | 公的；强有力的 | 难推 | 英
`,
  `
祖 zǔ | ancestor | 父母的上一代以及更早的人 | 租组
遗 yí | to leave behind; to lose | 留下；丢掉 | 遇贵 | 失
迹 jì | trace, mark | 留下的印子 | 变迪
墙 qiáng | wall | 用砖石等建成的分隔房屋的东西 | 培境
革 gé | leather; to change | 去了毛的兽皮；改变 | 鞋草
唐 táng | the Tang dynasty | 中国古代的一个朝代 | 糖康
命 mìng | life; fate; order | 生物活着的能力；运气；上级的指示 | 令合
胜 shèng | to win | 打败对方，赢 | 性姓 | 利
利 lì | benefit; sharp | 好处；快，尖 | 和刑 | 胜
失 shī | to lose | 丢掉 | 夫矢 | 遗
`,
  `
败 bài | to be defeated | 输 | 贩贼
建 jiàn | to build | 造房子；设立 | 健键 | 立
立 lì | to stand; to set up | 站着；设置 | 位拉 | 建
灭 miè | to put out; to destroy | 让火停止燃烧；消除 | 火天 | 亡
亡 wáng | to die; to perish | 死；不再存在 | 忘忙 | 灭
与 yǔ/yù | and; with; to give | 和；跟；给 | 写马
伟 wěi | great | 了不起的 | 纬违
曾 céng/zēng | once, ever | 以前有过 | 增会
之 zhī | of; it | 的；代替人或事物 | 乏芝
此 cǐ | this | 这个，这里 | 比些
`,
  `
绘 huì | to paint, to draw | 画 | 会给
雕 diāo | to carve | 在木头、石头等上面刻 | 调周
蹈 dǎo | to tread; to dance | 踩；跳动 | 稻滔
曲 qǔ/qū | song; bent | 歌；弯 | 由典
弹 tán/dàn | to play (strings); bullet | 用手指拨动琴弦；枪里打出的东西 | 单弛
鼓 gǔ | drum | 用皮蒙着、敲着响的乐器 | 彭技
角 jiǎo/jué | horn; corner; role | 动物头上长的硬东西；边和边相交的地方；戏里的人物 | 用确
欣 xīn | glad | 快乐 | 新欢 | 赏
赏 shǎng | to admire; reward | 观看并喜爱；给的奖励 | 尝堂 | 欣
创 chuàng/chuāng | to create; wound | 第一次做出来；伤口 | 仓抢
`,
  `
灵 líng | quick-witted; spirit | 聪明，反应快；精神 | 录炎 | 神
象 xiàng | elephant; image | 一种鼻子很长的大动物；样子 | 像家
印 yìn | to print; mark | 把文字图画留在纸上；痕迹 | 卯即
著 zhù | to write (a book); well-known | 写作；明显，有名 | 着者
墨 mò | ink | 写字画画用的黑色颜料 | 黑默
彩 cǎi | color | 多种颜色 | 采影
团 tuán | group; round | 一群人组成的集体；圆形 | 困因
精 jīng | refined; essence | 完美，最好的；提炼出来的东西 | 情睛
神 shén | god; spirit | 宗教里信奉的超人力量；精力，心思 | 伸审 | 灵
典 diǎn | standard; classic | 标准；重要的书 | 曲兴
`,
  `
漫 màn | overflowing; free | 水满出来；随便，不拘束 | 慢馒
趣 qù | interest; fun | 使人愉快、有吸引力的特点 | 取起
味 wèi | taste; smell | 舌头尝到的感觉；鼻子闻到的气 | 未妹
雅 yǎ | elegant | 高尚，不粗俗 | 鸦推
描 miáo | to trace; to describe | 照着画；用话写出来 | 苗猫
藏 cáng/zàng | to hide; to collect | 躲起来；收存 | 葬减
表 biǎo | surface; to show; watch | 外面；显示；计时的器具 | 衣麦
像 xiàng | to resemble; portrait | 相似；人物的画或照片 | 象橡 | 形
形 xíng | shape | 样子 | 开型 | 像
镜 jìng | mirror; lens | 照出人影的东西；透光的片子 | 境竟
`,
  `
权 quán | right; power | 应当享有的利益；力量 | 仅叔
义 yì | justice; meaning | 公正合理的道理；意思 | 叉仪
严 yán | strict; serious | 认真，不放松；厉害 | 亚产
犯 fàn | to violate; criminal | 违反；做了坏事的人 | 范狂 | 罪
罪 zuì | crime | 违法而且应受处罚的事 | 非署 | 犯
审 shěn | to examine; to try (a case) | 仔细查看；法院查问案子 | 宙申
某 mǒu | a certain | 不说出名字的人或事物 | 谋煤
庭 tíng | court; courtyard | 法院审案的地方；房前的空地 | 廷挺
抓 zhuā | to grab; to arrest | 用手拿住；逮住 | 爪孤 | 捕
捕 bǔ | to catch | 捉住 | 铺浦 | 抓
`,
  `
偷 tōu | to steal | 不让人知道地拿走别人的东西 | 输愉 | 盗抢劫
盗 dào | to rob; robber | 偷；偷东西的人 | 盖盆 | 偷抢劫
抢 qiǎng | to snatch; to rush | 用力夺走；争着做 | 枪仓 | 偷盗劫
劫 jié | to rob; disaster | 用暴力夺走；灾难 | 却动 | 偷盗抢
赔 péi | to compensate | 补给别人损失 | 陪倍 | 偿
偿 cháng | to repay | 归还，补上 | 尝赏 | 赔
违 wéi | to violate | 不遵守 | 围伟
禁 jìn/jīn | to forbid | 不许 | 林楚 | 止
止 zhǐ | to stop | 停 | 正上 | 禁
允 yǔn | to allow | 同意，答应 | 充元
`,
  `
许 xǔ | to allow; perhaps | 答应，同意；大概 | 午评
平 píng | flat; equal; calm | 不倾斜；一样，相等；安定 | 半乎
杀 shā | to kill | 让人或动物死去 | 条茶
承 chéng | to bear; to undertake | 托着；担当 | 永求
监 jiān/jiàn | to supervise | 从旁看着，管着 | 盐临
狱 yù | prison | 关犯人的地方 | 犹状
何 hé | what; how | 什么；怎么 | 可河
疑 yí | to doubt | 不相信 | 凝拟
辩 biàn | to argue | 说理由，争论 | 辨辫
继 jì | to continue; to succeed | 接着做；接替 | 断维
`,
  `
贸 mào | trade | 买卖，交换商品 | 留贺 | 易
易 yì | easy; to exchange | 不难；交换 | 场物 | 贸
投 tóu | to throw; to invest | 扔；把钱用在可以赚钱的事上 | 设没
股 gǔ | share, stock | 公司资本里的一份 | 没投
汇 huì | to converge; exchange | 合在一起；外币换算 | 江仁
财 cái | wealth | 钱和东西 | 材则
贫 pín | poor, needy | 缺少钱财 | 贪货 | 穷
穷 qióng | poor | 钱很少 | 究穿 | 贫
借 jiè | to borrow; to lend | 暂时用别人的东西；暂时把东西给别人用 | 错惜 | 贷
贷 dài | loan | 向银行等借的钱 | 货代 | 借
`,
  `
另 lìng | other; another | 别的 | 别加
入 rù | to enter | 进来，进去 | 人八
损 sǔn | to lose; to damage | 减少；伤害 | 员捐 | 亏
亏 kuī | loss; to lack | 赔钱；欠缺 | 号考 | 损
涨 zhǎng/zhàng | to rise | （水位、价格）升高 | 张胀
跌 diē | to fall; to drop | 摔倒；（价格）下降 | 铁跃
竞 jìng | to compete | 比赛，争着做 | 竟克
需 xū | to need | 一定要有 | 雷霜 | 求
求 qiú | to ask; to seek | 请别人帮忙；追寻 | 球来 | 需
供 gōng/gòng | to supply | 给出需要的东西 | 共洪
`,
  `
算 suàn | to calculate; to count as | 计数；当作 | 笔第
提 tí/dī | to lift; to mention | 往上拿；说起 | 题堤
总 zǒng | total; always | 全部加起来；一直 | 怎思
金 jīn | gold; money | 黄色的贵重的东西；钱财 | 全合
融 róng | to melt; finance | 化开；资金的流通 | 隔触
润 rùn | moist; profit | 不干燥；赚到的钱 | 闰涧
破 pò | broken; to break | 坏了，不完整；弄坏 | 波被
均 jūn | equal | 平，一样多 | 匀钧
各 gè | each | 每个 | 名客
改 gǎi | to change | 变成别的样子 | 攻故
`,
  `
恨 hèn | to hate | 非常不喜欢，仇视 | 很根
恐 kǒng | to fear; terror | 怕；使人害怕 | 巩怒 | 惧慌
惧 jù | to dread | 害怕 | 俱具 | 恐慌
慌 huāng | flustered | 心里很急，不知道怎么办 | 荒谎 | 恐惧
怒 nù | anger | 很生气 | 努奴
悲 bēi | sad | 伤心 | 非辈
羡 xiàn | to envy | 看到别人好，希望自己也有 | 美盖 | 慕
慕 mù | to admire | 喜爱，敬仰 | 幕暮 | 羡
惊 jīng | to be startled | 害怕；感到意外 | 京凉 | 讶
讶 yà | surprised | 感到奇怪 | 呀牙 | 惊
`,
  `
寞 mò | lonely | 冷清，没人陪 | 莫漠 | 寂孤独
寂 jì | quiet; lonely | 没有声音；孤单 | 叔淑 | 寞孤独
孤 gū | alone | 单独一个 | 狐瓜 | 寞寂独
独 dú | alone; only | 一个人；只有 | 烛浊 | 寞寂孤
悔 huǐ | to regret | 做了以后觉得不该做 | 海梅
激 jī | to stir; intense | 使感情冲动；强烈 | 邀傲 | 奋
奋 fèn | to exert oneself | 振作，鼓起劲来 | 备夺 | 激
愉 yú | pleased | 快乐 | 偷输 | 幸
幸 xìng | fortunate | 运气好 | 辛季 | 愉
羞 xiū | shy; shame | 不好意思；耻辱 | 着差
`,
  `
湿 shī | wet | 沾了水 | 温显
燥 zào | dry | 缺少水分 | 澡躁
雷 léi | thunder | 下雨时空中发出的很大响声 | 雪雨
闪 shǎn | to flash; to dodge | 光突然出现；很快地躲开 | 问闭
根 gēn | root | 植物长在土里的部分 | 跟很
洪 hóng | flood; vast | 大水；大 | 共供
旱 hàn | drought | 长时间不下雨 | 早汗
漠 mò | desert | 沙地 | 模寞
洋 yáng | ocean; foreign | 大海；外国的 | 样羊
深 shēn | deep | 从上到下或从外到里距离大 | 探沉
`,
  `
峰 fēng | peak | 山的尖顶 | 锋蜂
谷 gǔ | valley; grain | 两山之间的低地；粮食 | 容俗
种 zhǒng/zhòng | kind, species; to plant | 类别；把籽放进土里 | 和钟
碳 tàn | carbon | 一种化学元素 | 炭硬
寒 hán | cold | 冷 | 塞赛 | 冻
冻 dòng | to freeze | 遇冷变硬 | 冰冬 | 寒
虫 chóng | insect, worm | 小动物 | 中出
落 luò/là | to fall | 掉下来 | 洛络
土 tǔ | earth, soil | 地上的泥沙 | 士上
阵 zhèn | (measure word for short spells); battle line | 用于短时间的动作或现象；军队的队列 | 阳陈
`,
  `
冠 guàn/guān | champion; crown | 第一名；帽子 | 寇完
亚 yà | second; Asia | 次一等的；一个大洲的名字 | 严业
局 jú | game, set; office | 比赛的一次；机关 | 届居
裁 cái | to cut; to judge | 用剪刀分开；判断 | 栽载
射 shè | to shoot | 用力发出（子弹、箭、球） | 谢身
攻 gōng | to attack | 打击敌人 | 功改
拳 quán | fist; boxing | 握紧的手；用手打的武术 | 券卷
步 bù | step | 走路时两脚之间的距离 | 少涉
滑 huá | slippery; to slide | 光溜；在光溜的面上移动 | 骨猾
操 cāo | exercise; to hold | 体育锻炼的动作；拿着，掌握 | 燥澡
`,
  `
连 lián | to link; even | 接在一起；甚至 | 运车 | 续
续 xù | to continue | 接下去 | 读卖 | 连
羽 yǔ | feather | 鸟的毛 | 习弱 | 毛
毛 máo | hair; fur | 动植物身上长的细丝 | 手毫 | 羽
棋 qí | chess | 一种在格子上下的游戏 | 旗期
奥 ào | profound; Olympics | 深，不容易懂；指四年一次的世界运动会 | 澳粤
强 qiáng/qiǎng | strong; to force | 力量大；用力让人做 | 弹虽
冲 chōng/chòng | to rush; to rinse | 很快地向前；用水洗 | 冰中
刺 cì | to stab; thorn | 用尖东西扎；尖的东西 | 刻制
摔 shuāi | to fall; to throw down | 跌倒；用力扔下 | 率甩
`,
  `
胞 bāo | cell; womb | 构成生物的小单位；母亲的子宫 | 包抱
基 jī | base | 房屋的底子；根本 | 其甚
宇 yǔ | universe; house | 上下四方的空间；房屋 | 字宁 | 宙
宙 zhòu | universe; time | 古往今来的时间 | 审宇 | 宇
确 què | true, certain | 真实，肯定 | 角硬
引 yǐn | to lead; to attract | 带领；吸过来 | 弓弘
测 cè | to measure | 量 | 侧则
显 xiǎn | obvious; to show | 明白可见；露出来 | 湿星
探 tàn | to explore | 寻找，打听 | 深采
式 shì | style; formula | 样子；数学或化学上表示关系的写法 | 试武
`,
  `
氧 yǎng | oxygen | 一种化学元素，人呼吸需要它 | 羊养
使 shǐ | to use; to make | 用；让 | 便史
指 zhǐ | finger; to point | 手前端的部分；对着 | 拍旨
核 hé | nucleus; pit | 原子的中心；果子里的硬心 | 该孩
未 wèi | not yet | 还没有 | 末味
析 xī | to analyse | 分开，解释 | 折所
构 gòu | to construct | 组合，造 | 沟购
状 zhuàng | form, condition | 样子；情况 | 壮伏 | 态
态 tài | attitude; state | 样子；看法 | 太忘 | 状
类 lèi | kind, type | 种 | 米粪
`,
  `
授 shòu | to teach; to give | 教；给 | 受援
兼 jiān | to hold two posts | 同时做几件事 | 谦嫌
辞 cí | to resign; words | 不再做原来的工作；话 | 乱舌
升 shēng | to rise; to promote | 往上走；提高职位 | 开井
薪 xīn | salary | 工资 | 新辛
岗 gǎng | post, job | 工作的地方，职位 | 刚钢
雇 gù | to hire | 出钱请人做事 | 顾雁
培 péi | to cultivate | 在根部加土；教育 | 陪倍 | 训
训 xùn | to train; to lecture | 教导，练习；批评 | 川讯 | 培
秀 xiù | elegant; excellent | 美；很好 | 季透
`,
];
