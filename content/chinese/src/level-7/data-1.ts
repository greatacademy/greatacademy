// The characters and words of units 1 to 3 of level 7 (docs/chinese-curriculum.md §8.3): social change, schools and
// learning, and work and the workplace; 120 characters in 12 batches, none of them taught in levels 1 to 6, among the
// commonest of the advanced band of GF 0025-2021, and 480 words in 48 batches, each unit's characters first.
//
// A character line as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.
//
// A word line as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches1 are the 12 character batches of units 1 to 3 of level 7, four a unit, in teaching order. */
export const characterBatches1: readonly string[] = [
  // Unit 1: Social Change.
  `
衰 shuāi | to decline, to weaken | 由强变弱 | 哀衷
旺 wàng | flourishing, prosperous | 兴盛，生命力强 | 汪枉
巨 jù | huge | 非常大 | 臣拒
缓 huǎn | slow; to delay; to ease | 慢；推迟；使变轻 | 暖援
烈 liè | intense, fierce | 程度高，力量大 | 列裂 | 猛
猛 měng | fierce, sudden and strong | 力量大而且来得急 | 孟锰 | 烈
跃 yuè | to leap | 跳起来 | 跌践
腾 téng | to rise up, to soar | 跳起来往上升 | 滕胜
崛 jué | to rise abruptly | 突然高起来 | 掘屈
萧 xiāo | desolate | 冷清，没有生气 | 肃箫
`,
  `
徙 xǐ | to move (one's home) | 从一个地方搬到另一个地方 | 徒从
拆 chāi | to take apart, to pull down | 把合在一起的东西打开；把房子弄倒 | 折诉
涌 yǒng | to gush, to surge | 水或人很快地大量出来 | 通勇
迈 mài | to stride | 抬起脚往前走 | 万迁
奔 bēn/bèn | to rush; to head for | 很快地跑；朝着某处去 | 奋套
逆 nì | contrary, against | 方向相反；不顺从 | 送迷
挡 dǎng | to block | 拦住，使不能通过 | 档当
覆 fù | to cover; to overturn | 盖住；翻过来 | 复履
淘 táo | to wash in a sieve; to wash out | 用水冲去杂物；去掉不好的 | 陶掏 | 汰
汰 tài | to eliminate | 去掉不合适的 | 太沃 | 淘
`,
  `
陋 lòu | crude; bad (of customs) | 简单粗糙；不好的 | 陌陈
髦 máo | fashionable, as in 时髦 | 跟着新的风气 | 毛鬓
赶 gǎn | to catch up; to hurry | 追上；加快去做 | 起赵
俱 jù | all, completely | 全，都 | 具惧
伍 wǔ | ranks; five (in formal writing) | 军队的队列；“五”的大写 | 五位
昔 xī | former times | 从前 | 惜普
逝 shì | to pass; to pass away | 过去；死去 | 誓折
抛 pāo | to throw; to abandon | 扔；丢下不管 | 抱抽
袭 xí | to attack by surprise; to follow (old ways) | 突然进攻；照着旧的做 | 装袋
滞 zhì | stagnant | 不流通，停下来 | 带沛
`,
  `
巢 cháo | nest | 鸟住的窝 | 果剿
赡 shàn | to support (one's elders) | 供给生活所需 | 瞻担
豪 háo | heroic; grand and rich | 有才能的人；钱多，气派大 | 毫亮
恋 liàn | to love; to long for | 爱；舍不得离开 | 变峦
梯 tī | ladder, stairs | 帮助人上下的用具或设备 | 弟第
宅 zhái | residence | 住的房子 | 宇它
饥 jī | hungry; famine | 饿；年成不好 | 机肌
阂 hé | barrier, estrangement | 隔开，不相通 | 阔该
遭 zāo | to meet with (misfortune) | 碰到不好的事 | 糟曹
薄 báo/bó | thin; weak, slight | 厚度小；不浓，不强 | 簿博
`,
  // Unit 2: Schools and Learning.
  `
悟 wù | to realize, to understand | 明白过来 | 误语
巩 gǒng | firm; to consolidate | 坚固，使牢靠 | 恐筑
钻 zuān/zuàn | to drill; to dig into; a drill | 打洞；深入研究；打洞的工具 | 站钳
倦 juàn | tired, weary | 累；没有兴趣了 | 卷圈
涯 yá | shore; limit | 水边；边际 | 崖涨
愚 yú | foolish | 傻，不明白事理 | 遇偶 | 拙呆
钝 dùn | blunt; slow-witted | 不锋利；不灵活 | 纯顿
惰 duò | lazy | 懒 | 随情
拙 zhuō | clumsy | 笨，不灵巧 | 茁屈 | 愚呆
呆 dāi | dull; to stay | 发愣，反应慢；停留 | 呈果 | 愚拙
`,
  `
晨 chén | morning | 早上 | 辰震
寝 qǐn | to sleep; bedroom | 睡觉；睡觉的屋子 | 侵浸
熄 xī | to put out (a light or fire) | 让火或灯灭掉 | 息媳
铃 líng | bell | 摇动或通电会响的东西 | 玲岭
铅 qiān | lead (the metal) | 一种很重的软金属 | 船沿
橡 xiàng | oak; rubber tree | 一种树；可以产胶的树 | 像象
尺 chǐ | ruler; a unit of length | 量长度的用具；长度单位 | 尽尸
榜 bǎng | list of names posted | 公布名字或名次的单子 | 旁傍
副 fù | deputy; secondary | 第二位的，帮助正职的 | 福幅
砸 zá | to smash; to fail | 用重物打；把事情弄坏 | 码砍
`,
  `
诲 huì | to teach, to instruct | 教导 | 悔海
蒙 méng/mēng/měng | to cover; ignorant | 盖住；不懂道理 | 家檬
熏 xūn | to smoke; to influence | 让烟接触东西；长期影响 | 重黑
栽 zāi | to plant | 种 | 裁载
栋 dòng | ridge beam; (measure word for buildings) | 房屋的正梁；用来数楼房 | 冻陈 | 梁
梁 liáng | beam; bridge | 支撑屋顶的长木头；桥 | 粱染 | 栋
溺 nì | to drown; to indulge | 淹在水里；过分爱，没有节制 | 弱湖
娇 jiāo | delicate; to pamper | 柔嫩可爱；过分疼爱 | 骄桥
纵 zòng | to let loose; vertical | 放任；从上到下的 | 从级
叮 dīng | to sting; to urge again and again | 蚊子等咬；一再地说 | 可丁
`,
  `
挫 cuò | setback; to frustrate | 失败，不顺利 | 坐座
屡 lǚ | repeatedly | 一次又一次 | 楼屈
馁 něi | discouraged | 失去勇气 | 妥饿
沮 jǔ | dejected | 灰心失望 | 阻组 | 丧
丧 sàng/sāng | to lose; mourning | 失去；跟死去的人有关的事 | 衰表 | 沮
迫 pò/pǎi | to force; urgent | 强使；紧急 | 追道 | 逼
逼 bī | to force, to press | 用压力使人去做；靠近 | 通福 | 迫
谨 jǐn | careful, respectful | 小心，恭敬 | 勤仅 | 慎
慎 shèn | cautious | 小心，不马虎 | 真镇 | 谨
辍 chuò | to stop halfway | 中途停止 | 缀啜
`,
  // Unit 3: Work and the Workplace.
  `
荐 jiàn | to recommend | 介绍好的人或东西 | 存莽
酬 chóu | to repay; payment | 回报，给人的钱 | 酒洲
津 jīn | ferry; saliva; subsidy | 渡口；口水；补助的钱 | 律建
赴 fù | to go to, to attend | 到某处去 | 赶扑
卸 xiè | to unload; to give up (a post) | 把东西从车船上拿下来；解除 | 御却
撤 chè | to withdraw, to remove | 退回；去掉 | 澈撒
替 tì | to replace; for | 代；为 | 潜赞
顶 dǐng | top; to prop up; to stand in | 最高的部分；用头撑；担当 | 项顺
搭 dā | to put up; to join; to take (a ride) | 支起来；配合；坐车船 | 塔答
临 lín | to face; about to; temporary | 面对；快要；暂时的 | 监览
`,
  `
惫 bèi | exhausted | 非常累 | 备态
怠 dài | idle, slack | 懒散，不认真 | 台怎 | 懈
懈 xiè | slack | 松劲，不紧张 | 解蟹 | 怠
敷 fū | to apply; to spread | 涂上；铺开 | 数敦
衍 yǎn | to spread out; to do perfunctorily | 展开；应付 | 行衔
恳 kěn | sincere, earnest | 真诚 | 恩垦
踏 tà/tā | to step on | 用脚踩 | 蹈路
兢 jīng | cautious, as in 兢兢业业 | 小心害怕的样子 | 竞克
苟 gǒu | careless; if | 随便；如果 | 荀苛
摸 mō | to touch; to feel for | 用手接触或轻轻移动；探寻 | 模膜
`,
  `
傅 fù | teacher, master | 教人技艺的人 | 博搏
僚 liáo | colleague; official | 一起做官的人；官吏 | 撩潦
辖 xiá | to govern | 管理 | 害割
央 yāng | center; to beg | 中心；请求 | 英史
衔 xián | rank, title; to hold in the mouth | 职位或级别的名称；用嘴含着 | 街衍
庸 yōng | ordinary, mediocre | 平常，没有特别的才能 | 康唐
狂 kuáng | mad; wild | 疯；极度地 | 往汪
碌 lù/liù | busy, as in 忙碌; ordinary | 事情多，没有空；平凡 | 绿录
催 cuī | to urge, to hurry | 让人赶快做 | 准推
盯 dīng | to stare at | 眼睛一直看着 | 叮町
`,
  `
旷 kuàng | vast; to be absent from | 空而大；空着不去 | 矿扩
渎 dú | to neglect (a duty); to show disrespect | 不认真对待；不尊重 | 读续
彰 zhāng | to show, to make known | 显明，表扬 | 章影
嘉 jiā | good; to praise | 美好；夸奖 | 喜架
罢 bà/ba | to stop | 停止 | 摆去
纠 jiū | to correct; to entangle | 改正；缠在一起 | 叫收
仲 zhòng | middle; second | 在中间的；排行第二 | 种冲
谋 móu | to plan; to seek | 计划，想办法；找 | 媒某
筹 chóu | to raise (money); to plan; a chip | 想办法弄到；预先安排；计数的工具 | 寿等
窍 qiào | hole; key point | 洞；关键 | 巧穷
`,
];

/** wordBatches1 are the 48 word batches of units 1 to 3 of level 7, sixteen a unit, in teaching order. */
export const wordBatches1: readonly LevelWordBatch[] = [
  // Unit 1: Social Change.
  {
    theme: ["Rise and Fall", "兴衰"],
    data: `
兴衰 | xīng shuāi | rise and fall | 兴盛和衰落 | 这座古城见证了好几个朝代的＿＿。
衰落 | shuāi luò | to decline | 从兴盛变得不兴盛 | 铁路通了以后，这条老运河边的码头渐渐＿＿了。 | 衰退 没落
衰退 | shuāi tuì | to decline (of strength or an economy) | 身体能力变弱；经济变差 | 年纪大了，人的记忆力会慢慢＿＿。 | 衰落
没落 | mò luò | to fall into decline | 变得不如从前，走下坡路 | 这个曾经很有名的家族，到了他这一代已经＿＿了。 | 衰落
兴旺 | xīng wàng | flourishing, thriving | 兴盛，发展得好 | 开了新工厂以后，镇上的生意越来越＿＿。 | 旺盛
旺盛 | wàng shèng | vigorous | 生命力强，精力充足 | 孩子们精力＿＿，玩了一天也不觉得累。
萧条 | xiāo tiáo | depressed, in a slump | 经济不活跃，生意冷清 | 那几年经济＿＿，很多工厂都停工了。 | 衰退
崛起 | jué qǐ | to rise (to prominence) | 兴起，变得强大 | 一个国家的＿＿离不开教育和科技。 | 腾飞
腾飞 | téng fēi | to take off, to soar | 迅速发展 | 改革开放以后，这个地区的经济开始＿＿。 | 崛起
衰老 | shuāi lǎo | to age; ageing | 年纪大，身体变弱 | 适当运动可以延缓身体的＿＿。 | 衰退
`,
  },
  {
    theme: ["The Pace of Change", "变化的快慢"],
    data: `
巨变 | jù biàn | huge change | 非常大的变化 | 三十年来，这个小渔村发生了＿＿，现在到处是高楼。 | 飞跃
缓慢 | huǎn màn | slow | 不快 | 老人走路很＿＿，我们要耐心地等他。
迅猛 | xùn měng | swift and powerful | 又快又猛 | 近年来网上购物发展＿＿，很多人已经很少去商店了。 | 突飞猛进
飞跃 | fēi yuè | leap | 很大的进步或变化 | 从写信到发电子邮件，人们的通信方式实现了一次＿＿。
突飞猛进 | tū fēi měng jìn | to advance by leaps and bounds | 发展、进步得非常快 | 经过一年的努力，他的汉语水平＿＿。 | 迅猛
日新月异 | rì xīn yuè yì | changing with each passing day | 每天都有新的变化 | 科技＿＿，去年买的手机今年就有了新型号。
激烈 | jī liè | fierce, intense | 程度很高，不平静 | 现在找工作的竞争越来越＿＿。
缓和 | huǎn hé | to ease, to calm down | 变得不紧张 | 两人互相道了歉，紧张的关系终于＿＿了下来。
跃升 | yuè shēng | to leap up | 很快地升到更高的位置 | 这本小说出版一个月，销量就＿＿到了第一名。
停滞 | tíng zhì | to stagnate | 停下来，不再发展 | 因为缺少新技术，这家工厂的发展＿＿了很多年。
`,
  },
  {
    theme: ["Moving and Settling", "迁移和定居"],
    data: `
迁徙 | qiān xǐ | to migrate | 离开原来的地方，搬到很远的地方 | 每年秋天，很多鸟都会向南＿＿。 | 迁居
拆迁 | chāi qiān | to demolish and relocate | 拆掉旧房子，让住户搬走 | 这片老房子要＿＿，居民们都搬进了新楼。 | 拆除
拆除 | chāi chú | to demolish | 拆掉，去掉 | 这座危险的旧桥已经被＿＿了。
涌入 | yǒng rù | to pour into | 大量地进入 | 春节过后，大批打工的人＿＿城市。
流动人口 | liú dòng rén kǒu | floating population | 离开户口所在地，到别处生活的人 | 这座城市有大量＿＿，他们大多是从外地来打工的。
返乡 | fǎn xiāng | to return to one's hometown | 回到家乡 | 很多在外读书的大学生毕业后选择＿＿创业。
落户 | luò hù | to settle (with registered residence) | 在某地安家，登记户口 | 他在这座城市工作了五年，终于在这里＿＿了。 | 迁居
户籍 | hù jí | household registration | 登记居民身份和住址的制度或资料 | 办理入学手续时，需要提供孩子的＿＿证明。
迁居 | qiān jū | to move one's home | 搬到别的地方住 | 爷爷退休以后，＿＿到了海边的一座小城。 | 落户
春运 | chūn yùn | Spring Festival travel rush | 春节前后的旅客运输 | 每年＿＿期间，火车票都很难买。
`,
  },
  {
    theme: ["Old Ways and New", "新旧之间"],
    data: `
陋习 | lòu xí | bad habit, bad custom | 不好的旧习惯 | 随地丢垃圾是一种＿＿，应该改掉。
时髦 | shí máo | fashionable | 新潮，流行 | 她穿了一件很＿＿的大衣，走在街上很引人注意。
赶时髦 | gǎn shí máo | to follow the fashion | 跟着流行走 | 他买新手机不是因为需要，只是为了＿＿。
落伍 | luò wǔ | outdated, behind the times | 跟不上时代 | 爷爷笑着说自己＿＿了，连用手机付钱都不会。 | 守旧
昔日 | xī rì | former days | 从前，过去的日子 | ＿＿的小渔村，如今成了热闹的旅游城市。
今非昔比 | jīn fēi xī bǐ | things are not what they were | 现在和过去完全不一样了 | 这个小镇的变化太大了，真是＿＿。
与时俱进 | yǔ shí jù jìn | to keep pace with the times | 跟着时代一起进步 | 教材的内容也要＿＿，加入新的知识。
抛弃 | pāo qì | to abandon | 丢掉不要 | 我们应该＿＿“女孩子不用读书”这种旧观念。
沿袭 | yán xí | to carry on (an old practice) | 照着旧的做法继续下去 | 这个村子至今还＿＿着古老的婚礼习俗。
守旧 | shǒu jiù | conservative, old-fashioned | 坚持旧的，不愿改变 | 奶奶的思想并不＿＿，七十岁还学会了网上购物。 | 落伍
`,
  },
  {
    theme: ["Population", "人口的变化"],
    data: `
少子化 | shǎo zǐ huà | falling number of children | 出生的孩子越来越少的现象 | 日本和韩国都有＿＿的问题，新生儿越来越少。
生育率 | shēng yù lǜ | fertility rate | 女性平均一生生孩子的数量 | 要让人口保持稳定，＿＿大约需要达到二点一。
人均寿命 | rén jūn shòu mìng | life expectancy | 一个地区的人平均能活的岁数 | 随着医疗条件的改善，＿＿不断提高。
独生子女 | dú shēng zǐ nǚ | only child | 没有兄弟姐妹的孩子 | 他是＿＿，小时候常常羡慕有哥哥姐姐的同学。 | 留守儿童
空巢老人 | kōng cháo lǎo rén | elderly people whose children have left home | 孩子都离开家、自己生活的老人 | 社区的志愿者每周都去看望那些＿＿，陪他们聊天。 | 银发族
赡养 | shàn yǎng | to support (one's parents) | 供给父母等长辈生活所需 | 子女有＿＿父母的义务。
留守儿童 | liú shǒu ér tóng | left-behind children | 父母外出打工、自己留在家乡的孩子 | 他的父母在城里打工，他是由奶奶带大的＿＿。
二孩 | èr hái | second child | 家里的第二个孩子 | 全面放开＿＿政策以后，不少家庭有了第二个孩子。
银发族 | yín fà zú | the silver-haired, seniors | 老年人 | 越来越多的＿＿开始学着用手机上网、购物。 | 空巢老人
四世同堂 | sì shì tóng táng | four generations under one roof | 一家四代人住在一起 | 王奶奶家＿＿，她的重孙子刚刚出生。
`,
  },
  {
    theme: ["Housing", "住房"],
    data: `
住宅 | zhù zhái | residence, housing | 住的房子 | 这片土地只能用来建＿＿，不能建工厂。 | 楼房
豪宅 | háo zhái | mansion | 又大又豪华的房子 | 那位富商住在海边的一座＿＿里。
楼梯 | lóu tī | stairs | 楼房里上下用的台阶 | 电梯坏了，我们只好走＿＿上十楼。
电梯 | diàn tī | lift, elevator | 用电带动、载人上下楼的设备 | 这座老楼没有＿＿，老人上下楼很不方便。
简陋 | jiǎn lòu | crude, bare | 简单，设备不全 | 当年他们住的房子很＿＿，只有一张床和一张桌子。
平房 | píng fáng | single-storey house | 只有一层的房子 | 小时候我们住＿＿，院子里还种着一些花。 | 四合院
楼房 | lóu fáng | multi-storey building | 两层或更多层的房子 | 村里很多人家都盖起了三层的＿＿。
四合院 | sì hé yuàn | courtyard house | 四面是房子、中间是院子的传统住宅 | 北京的老胡同里有很多＿＿。
房贷 | fáng dài | mortgage | 买房子时向银行借的钱 | 他每个月工资的一半都要用来还＿＿。
租金 | zū jīn | rent | 租房子等要付的钱 | 市中心的房子＿＿很高，他只好住在郊区。
`,
  },
  {
    theme: ["Rich and Poor", "贫和富"],
    data: `
温饱 | wēn bǎo | having enough food and clothing | 吃得饱，穿得暖 | 几十年前，很多家庭最大的愿望就是解决＿＿问题。
小康 | xiǎo kāng | moderately well-off | 生活比较富裕 | 经过多年的努力，他们一家过上了＿＿生活。
脱贫 | tuō pín | to escape poverty | 不再贫困 | 这个山村靠种茶叶成功＿＿了。 | 扶贫
扶贫 | fú pín | poverty relief | 帮助贫困的地区或人家 | 他大学毕业后到山区参加＿＿工作，帮村民卖水果。
贫富差距 | pín fù chā jù | wealth gap | 富人和穷人之间的差别 | 怎样减小＿＿，是很多国家都要面对的难题。
富豪 | fù háo | tycoon | 非常有钱的人 | 这位＿＿把一大半财产都捐给了慈善机构。
饥饿 | jī è | hunger | 肚子饿 | 世界上仍有很多人在忍受＿＿。 | 饥荒
饥荒 | jī huang | famine | 因为年成不好，粮食严重不足 | 历史上，大旱常常会造成＿＿。 | 饥饿
微薄 | wēi bó | meagre | 很少，很少的 | 他用自己＿＿的工资帮助了几个上不起学的孩子。
宽裕 | kuān yù | well-off, comfortably off | 钱比较多，不紧张 | 这几年家里的经济条件＿＿了一些，买了一辆车。
`,
  },
  {
    theme: ["Spending and Selling", "消费和买卖"],
    data: `
炫富 | xuàn fù | to flaunt one's wealth | 故意让别人看到自己有钱 | 有人在网上＿＿，晒名牌包和豪华汽车。
排场 | pái chǎng | show, ostentation | 表面上的气派 | 婚礼不一定要讲＿＿，简单一点就好。 | 铺张
铺张 | pū zhāng | extravagant | 为了讲排场而花很多钱 | 为了面子，有的人请客非常＿＿，点了很多菜都吃不完。 | 排场
超前消费 | chāo qián xiāo fèi | spending beyond one's means | 花还没有挣到的钱 | 用信用卡买很多用不上的东西，是一种＿＿。
勤俭节约 | qín jiǎn jié yuē | hard work and thrift | 勤劳，节省 | 老一辈人一直保持着＿＿的好习惯。
带货 | dài huò | to promote goods (in livestreams) | 通过网上直播等推销商品 | 这位网红一边直播一边＿＿，一晚上卖出了很多东西。
消费主义 | xiāo fèi zhǔ yì | consumerism | 把买东西当作生活意义的观念 | 有人批评＿＿，认为买得越多不一定越幸福。
旺季 | wàng jì | peak season | 生意最好的时期 | 夏天是海边旅游的＿＿，酒店很难订。
淡季 | dàn jì | off season | 生意不好的时期 | 冬天是这里的旅游＿＿，机票很便宜。
滞销 | zhì xiāo | to sell poorly | 卖不出去 | 今年苹果大丰收，很多果农担心苹果会＿＿。
`,
  },
  {
    theme: ["Technology in Daily Life", "科技和生活"],
    data: `
移动支付 | yí dòng zhī fù | mobile payment | 用手机付款 | ＿＿让人出门只带一部手机就够了。
刷脸 | shuā liǎn | to use facial recognition | 用脸部识别来付钱或开门 | 进这个小区不用带门卡，＿＿就能开门。
无人驾驶 | wú rén jià shǐ | driverless | 不需要人开车 | 有些城市已经开始测试＿＿出租车。
大数据 | dà shù jù | big data | 数量极大的数据和对它的分析 | 购物网站利用＿＿，根据用户的习惯展示可能喜欢的商品。
外卖员 | wài mài yuán | delivery rider | 送外卖的人 | 下大雨了，＿＿还在路上忙着送饭。
共享单车 | gòng xiǎng dān chē | bike sharing | 扫码就能骑的公用自行车 | 地铁站附近停着很多＿＿，下车后骑一会儿就到公司了。
网约车 | wǎng yuē chē | ride-hailing car | 在手机上预约的车 | 下了飞机，他用手机叫了一辆＿＿。
短视频 | duǎn shì pín | short video | 时间很短的网络视频 | 他每天要花两个小时刷＿＿。
覆盖 | fù gài | to cover | 盖住；涉及到 | 这个城市的无线网络已经＿＿了所有公园。
数字化 | shù zì huà | digitization | 用数字技术处理和保存信息 | 图书馆正在把古书＿＿，让读者在网上就能看到。
`,
  },
  {
    theme: ["Love and Family", "婚恋和家庭"],
    data: `
婚恋 | hūn liàn | love and marriage | 恋爱和婚姻 | 这个电视节目讨论的是年轻人的＿＿观念。
恋爱 | liàn ài | to be in love | 男女相爱 | 他们＿＿了三年才结婚。
包办婚姻 | bāo bàn hūn yīn | arranged marriage | 由父母决定的婚姻 | 过去很多年轻人不能自己选择爱人，只能接受＿＿。
媒人 | méi rén | matchmaker | 给男女双方介绍对象的人 | 过去结婚，常常要靠＿＿介绍。
门当户对 | mén dāng hù duì | well matched in social status | 男女双方家庭的地位、条件差不多 | 现在的年轻人结婚更看重感情，不太讲究＿＿了。
单亲家庭 | dān qīn jiā tíng | single-parent family | 只有父亲或母亲的家庭 | 他在＿＿长大，妈妈一个人把他养大。
核心家庭 | hé xīn jiā tíng | nuclear family | 由父母和孩子组成的家庭 | 现在城市里大多是＿＿，爷爷奶奶不和孙子孙女住在一起。
双职工 | shuāng zhí gōng | working couple | 夫妻两人都工作 | 他们是＿＿家庭，孩子放学后由爷爷奶奶接。
家庭主妇 | jiā tíng zhǔ fù | housewife | 不出去工作、在家照顾家庭的女人 | 她结婚后做了几年＿＿，孩子上学后又回去工作了。
晚婚 | wǎn hūn | late marriage | 到了比较大的年纪才结婚 | 现在＿＿的人越来越多，很多人三十多岁才结婚。
`,
  },
  {
    theme: ["Attitudes and Feelings", "观念和情感"],
    data: `
开明 | kāi míng | open-minded | 思想开通，不守旧 | 他的父母很＿＿，支持他选择自己喜欢的专业。 | 保守
保守 | bǎo shǒu | conservative | 维持原样，不愿改变 | 老一代人的想法比较＿＿，不太容易接受新东西。 | 开明
隔阂 | gé hé | estrangement, gap | 彼此之间感情不通、有距离 | 多聊聊天，可以消除两代人之间的＿＿。
淡薄 | dàn bó | faint, weak (of feelings) | 不浓，变弱 | 搬进高楼以后，邻居之间的感情变得＿＿了。
依恋 | yī liàn | attachment | 对人舍不得离开 | 小孩子对妈妈有很强的＿＿。 | 留恋
留恋 | liú liàn | to be reluctant to leave | 对地方或时光舍不得离开 | 毕业时，大家都很＿＿校园生活。 | 依恋
逆境 | nì jìng | adversity | 不顺利的处境 | 在＿＿中也不放弃，才能取得成功。 | 顺境
顺境 | shùn jìng | favourable circumstances | 顺利的处境 | 人在＿＿中容易骄傲，要时常提醒自己。 | 逆境
刻薄 | kè bó | mean, unkind | 说话、待人冷酷，不宽厚 | 他说话很＿＿，常常让人下不了台。
自豪 | zì háo | proud | 因为自己或跟自己有关的人和事而感到光荣 | 看到家乡这些年的变化，他感到非常＿＿。
`,
  },
  {
    theme: ["Town and Country", "城和乡"],
    data: `
城镇化 | chéng zhèn huà | urbanization | 农村人口变成城镇人口的过程 | 随着＿＿的发展，越来越多的农民住进了城镇。
机械化 | jī xiè huà | mechanization | 用机器代替人力 | 农业＿＿以后，一台机器就能干几十个人的活。
种地 | zhòng dì | to farm | 种庄稼 | 他爷爷一辈子都在农村＿＿。
化肥 | huà féi | chemical fertilizer | 用化学方法生产的肥料 | 用太多＿＿会让土地变差。
水利 | shuǐ lì | water conservancy | 利用水和防止水灾的工程 | 修了＿＿工程以后，这里再也不怕旱了。
老乡 | lǎo xiāng | person from the same hometown | 从同一个地方来的人 | 在外地遇到＿＿，听到家乡话特别亲切。
思乡 | sī xiāng | to be homesick | 想念家乡 | 每到中秋节，在外地工作的他就特别＿＿。
故乡 | gù xiāng | hometown, native place | 出生或长大的地方 | 离开＿＿二十年后，他终于回去看了看。
外地 | wài dì | other parts of the country | 本地以外的地方 | 这家饭馆的老板是从＿＿来的，做的菜很有特色。
迈向 | mài xiàng | to stride towards | 向着某个目标前进 | 这个小村子正一步一步＿＿现代化。
`,
  },
  {
    theme: ["Keeping Up", "追赶和超越"],
    data: `
赶超 | gǎn chāo | to catch up and overtake | 追上并超过 | 这家公司的技术正在＿＿世界先进水平。 | 追赶
追赶 | zhuī gǎn | to chase | 加快速度去追 | 他在后面拼命＿＿前面的人，终于追上了。 | 赶超
涌现 | yǒng xiàn | to emerge in large numbers | 大量出现 | 近些年，＿＿出了一批优秀的年轻作家。
奔波 | bēn bō | to rush about | 辛苦地来回跑 | 为了生活，他每天在城市里＿＿。
奔小康 | bēn xiǎo kāng | to strive for prosperity | 努力过上比较富裕的生活 | 村民们一起种果树，走上了＿＿的路。
逆转 | nì zhuǎn | to reverse | 向相反的方向转变 | 球队在最后五分钟连进两球，＿＿了比赛。 | 扭转
扭转 | niǔ zhuǎn | to turn around | 改变事情发展的方向 | 新经理上任后，很快＿＿了公司亏钱的局面。 | 逆转
势不可挡 | shì bù kě dǎng | unstoppable | 来势很猛，挡不住 | 新能源汽车的发展＿＿。
跨越 | kuà yuè | to span, to leap over | 越过 | 这座大桥＿＿长江，把两岸连了起来。
淘汰 | táo tài | to eliminate | 去掉不好的、不合适的 | 不肯学新技术的工厂，很快就会被市场＿＿。
`,
  },
  {
    theme: ["The Planned Economy", "计划经济时代"],
    data: `
粮票 | liáng piào | grain coupon | 过去买粮食要用的票 | 二十世纪八十年代以前，在中国买米买面要用＿＿。
布票 | bù piào | cloth coupon | 过去买布要用的票 | 那时候做一件新衣服，不光要花钱，还要用＿＿。
凭票 | píng piào | with a coupon | 拿着票才能买 | 当年很多东西要＿＿供应，有钱也买不到。
排长队 | pái cháng duì | to stand in a long queue | 很多人排成长长的队 | 新店开业，门口有很多人在＿＿。
物资 | wù zī | goods and materials | 生产和生活需要的东西 | 地震以后，各地把救灾＿＿送到了灾区。
短缺 | duǎn quē | shortage | 缺少，不够 | 那时候商品＿＿，买一台电视机都很难。
计划经济 | jì huà jīng jì | planned economy | 由国家统一计划生产和分配的经济 | 在＿＿时期，工厂生产什么都由国家安排。
个体户 | gè tǐ hù | self-employed trader | 自己做小生意的人 | 他是一个＿＿，在街上开了一家小饭馆。
下海 | xià hǎi | to go into business | 放弃原来的工作去做生意 | 上世纪九十年代，他辞去了工厂的工作，＿＿经商。
万元户 | wàn yuán hù | ten-thousand-yuan household | 改革开放初期收入达到一万元的富裕家庭 | 在改革开放初期，＿＿是很让人羡慕的。
`,
  },
  {
    theme: ["Care and Welfare", "保障和照顾"],
    data: `
社保 | shè bǎo | social insurance | 社会保险 | 公司每个月都要给员工交＿＿。 | 医保
医保 | yī bǎo | medical insurance | 医疗保险 | 有了＿＿，看病时大部分费用可以报销。
救济 | jiù jì | relief | 用钱或物资帮助生活困难的人 | 政府给受灾的家庭发放了＿＿金。
捐赠 | juān zèng | to donate | 把钱或东西送给需要的单位或人 | 他把自己收藏的古书都＿＿给了博物馆。
敬老院 | jìng lǎo yuàn | old people's home | 照顾老人的地方 | 没有子女照顾的老人可以住进＿＿。
护工 | hù gōng | care worker | 在医院或家里照顾病人、老人的人 | 妈妈住院的时候，我们请了一位＿＿照顾她。
家政 | jiā zhèng | housekeeping services | 打扫、做饭、照顾老人孩子等家务工作 | 她在一家＿＿公司工作，每天去不同的人家打扫卫生。
居家养老 | jū jiā yǎng lǎo | ageing at home | 老人住在自己家里，由社区提供照顾 | 很多老人不愿去养老院，更喜欢＿＿。
权益 | quán yì | rights and interests | 应该享有的权利和利益 | 买到假货时，要学会保护自己的＿＿。
居委会 | jū wěi huì | neighbourhood committee | 城市里居民自己管理的组织 | 小区里有什么困难，可以找＿＿帮忙。
`,
  },
  {
    theme: ["Time and Experience", "岁月和经历"],
    data: `
往昔 | wǎng xī | the past | 过去，从前 | 回忆起＿＿的日子，奶奶总是笑个不停。
消逝 | xiāo shì | to fade away | 渐渐消失 | 随着时代变化，一些老手艺正在慢慢＿＿。 | 流逝
流逝 | liú shì | to elapse | 时间像水一样过去 | 时间一天天＿＿，转眼他已经工作十年了。 | 消逝
逝世 | shì shì | to pass away | 去世 | 这位著名的科学家去年＿＿，享年九十岁。
遭遇 | zāo yù | to run into (misfortune) | 碰到不幸的事 | 这家老店在经济危机中＿＿了很大的困难。 | 遭受
遭受 | zāo shòu | to suffer | 受到损失、打击等 | 这个地区去年＿＿了严重的水灾。 | 遭遇
抛开 | pāo kāi | to cast aside | 放到一边不管 | ＿＿别的不说，这个价格就太贵了。
转折 | zhuǎn zhé | turn, turning | 事情发展方向的改变 | 考上大学是他人生的＿＿点。
历程 | lì chéng | course, journey | 经历的过程 | 这本书记录了一个小村庄几十年的发展＿＿。 | 进程
进程 | jìn chéng | process, course | 事情发展的过程 | 新技术加快了城市化的＿＿。 | 历程
`,
  },
  // Unit 2: Schools and Learning.
  {
    theme: ["Stages of Education", "教育的阶段"],
    data: `
学前教育 | xué qián jiào yù | preschool education | 孩子上小学以前受的教育 | 幼儿园是进行＿＿的主要地方。
托儿所 | tuō ér suǒ | nursery | 照看三岁以下小孩的地方 | 她上班前先把一岁的女儿送到＿＿。
义务教育 | yì wù jiào yù | compulsory education | 国家规定孩子必须接受的教育 | 在中国，＿＿一共九年，包括小学和初中。
高等教育 | gāo děng jiào yù | higher education | 大学阶段的教育 | 越来越多的年轻人有机会接受＿＿，走进大学校园。
职业教育 | zhí yè jiào yù | vocational education | 教人某种工作技能的教育 | ＿＿培养的是厨师、电工、汽车修理工这样的技术人才。
成人教育 | chéng rén jiào yù | adult education | 给已经工作的成年人的教育 | 成年人在工作之余接受的教育叫做＿＿。
终身学习 | zhōng shēn xué xí | lifelong learning | 一辈子不停地学习 | 社会变化很快，人们需要＿＿，不能毕业了就不再学了。
夜校 | yè xiào | night school | 晚上上课的学校 | 他白天上班，晚上去＿＿学会计。
远程教育 | yuǎn chéng jiào yù | distance education | 通过网络等进行的教育 | 通过＿＿，山区的孩子也能听到城里老师的课。
私立 | sī lì | private (of schools) | 由个人或团体出钱办的 | 这所＿＿学校不是政府办的，学费很高。
`,
  },
  {
    theme: ["Schools Old and New", "学校和学府"],
    data: `
名校 | míng xiào | famous school | 很有名的学校 | 这所中学是一所百年＿＿，培养了很多人才。 | 学府
学府 | xué fǔ | institution of higher learning | 大学等高等学校 | 北京大学是中国著名的高等＿＿。 | 名校
公立 | gōng lì | public (of schools) | 由政府出钱办的 | ＿＿学校由政府出钱办，学费很低。
母校 | mǔ xiào | alma mater | 自己曾经在那里学习过的学校 | 毕业二十年后，他回到＿＿给学生们做了一次讲座。
寄宿学校 | jì sù xué xiào | boarding school | 学生住在学校里的学校 | 他在一所＿＿读书，每个月只回家一次。
学堂 | xué táng | school (the old word) | 旧时对学校的叫法 | 一百多年前，这里开办了县里第一所新式＿＿。
补习班 | bǔ xí bān | cram class | 课外补习功课的班 | 为了提高数学成绩，他周末去上＿＿。
兴趣班 | xìng qù bān | hobby class | 学习画画、音乐等爱好的班 | 她给女儿报了画画和跳舞两个＿＿。
家教 | jiā jiào | private tutor | 到家里给学生补课的老师 | 他请了一位大学生当＿＿，每周来给他讲两次英语。
学区房 | xué qū fáng | house in a good school district | 能让孩子上附近好学校的房子 | 为了让孩子上好学校，他们花大价钱买了＿＿。
`,
  },
  {
    theme: ["Degrees and Titles", "学位和职称"],
    data: `
学士 | xué shì | bachelor's degree | 大学本科毕业得到的学位 | 他大学毕业，拿到了＿＿学位。
博士后 | bó shì hòu | postdoctoral research | 得到博士学位以后继续做研究的阶段 | 他拿到博士学位以后，又在国外做了两年＿＿。
本科生 | běn kē shēng | undergraduate | 正在读大学本科的学生 | 这门课只对研究生开放，＿＿不能选。
大专 | dà zhuān | junior college | 大学专科 | 他没有读本科，读的是三年制的＿＿。
院士 | yuàn shì | academician | 科学院等授予的最高学术称号 | 这位科学家八十岁时当选为中国科学院＿＿。
副教授 | fù jiào shòu | associate professor | 比教授低一级的职称 | 她三十五岁当上了＿＿，四十岁成了教授。
副校长 | fù xiào zhǎng | vice-principal | 协助校长工作的人 | 校长出国了，学校的事这几天由＿＿负责。
讲师 | jiǎng shī | lecturer | 大学里比副教授低一级的教师 | 大学教师的职称从低到高是助教、＿＿、副教授和教授。
助教 | zhù jiào | teaching assistant | 帮教授上课、改作业的人 | 他读研究生的时候当过＿＿，给本科生上过辅导课。
学术 | xué shù | academic research | 系统、专门的学问 | 这位教授在国际＿＿会议上发表了演讲。
`,
  },
  {
    theme: ["A Day at School", "校园的一天"],
    data: `
寝室 | qǐn shì | dormitory room | 学生睡觉的屋子 | 他们＿＿住了四个人，大家相处得很好。
熄灯 | xī dēng | to turn off the lights | 把灯关掉 | 宿舍晚上十一点＿＿，大家必须上床睡觉。
晨读 | chén dú | morning reading | 早上读书 | 每天早上七点，学生们在教室里＿＿，大声朗读课文。
早操 | zǎo cāo | morning exercises | 早上做的体操 | 每天早上六点半，住校的学生要到操场上做＿＿。 | 课间操
课间操 | kè jiān cāo | exercises between classes | 上午两节课中间做的体操 | 第二节课下课后，全校同学都到操场上做＿＿。
晚自习 | wǎn zì xí | evening self-study | 晚上在教室里自己学习 | 高三的学生每天都有＿＿，九点半才放学。
上课铃 | shàng kè líng | bell for the start of class | 开始上课时响的铃 | ＿＿响了，同学们赶快跑回教室。
走读 | zǒu dú | to attend school as a day student | 在学校上课，回家住 | 他家离学校很近，所以他＿＿，不在学校住。
住校 | zhù xiào | to board at school | 住在学校宿舍里 | 他家在山里，离学校太远，只能＿＿，周末才回家。
校服 | xiào fú | school uniform | 学校规定学生穿的衣服 | 每周一升国旗的时候，大家都要穿＿＿。
`,
  },
  {
    theme: ["Stationery and the Classroom", "文具和教室"],
    data: `
铅笔 | qiān bǐ | pencil | 写的字可以擦掉的笔 | 考试画图时要用＿＿，画错了可以擦掉。
橡皮 | xiàng pí | eraser | 用来擦掉字的文具 | 我写错了一个字，能借你的＿＿用一下吗？
尺子 | chǐ zi | ruler | 用来画直线、量长度的文具 | 用＿＿量一量，这张桌子有多长。
粉笔 | fěn bǐ | chalk | 在黑板上写字用的笔 | 老师用＿＿在黑板上写下了今天的题目。
讲台 | jiǎng tái | platform (in a classroom) | 教室前面老师讲课的台子 | 老师站在＿＿上，给大家讲课。
课桌 | kè zhuō | desk | 学生上课用的桌子 | 每个同学的＿＿上都放着一本新书。
文具 | wén jù | stationery | 笔、本子等学习用品 | 开学前，妈妈给他买了很多＿＿。
圆规 | yuán guī | pair of compasses | 画圆的工具 | 数学课上，我们用＿＿画了一个圆。
作业本 | zuò yè běn | exercise book | 写作业用的本子 | 老师把改好的＿＿发给了大家。 | 练习册
练习册 | liàn xí cè | workbook | 印好了练习题的书 | 这本数学＿＿里有很多题，他每天做一页。 | 作业本
`,
  },
  {
    theme: ["Classmates and Class Roles", "同学和班干部"],
    data: `
班长 | bān zhǎng | class monitor | 班里负责管理的学生 | 他被同学们选为＿＿，负责班里的大小事情。
学习委员 | xué xí wěi yuán | class study officer | 班里负责学习方面工作的学生 | ＿＿负责组织班里的学习活动，比如学习小组和读书会。
课代表 | kè dài biǎo | subject representative | 负责某一门课的事情的学生 | 他是数学＿＿，每天帮老师收数学作业。
同窗 | tóng chuāng | schoolmate | 在一起学习过的人 | 他们是大学时的＿＿，毕业后一直保持联系。
学长 | xué zhǎng | senior (male) schoolmate | 比自己早进学校的男同学 | 他是我的＿＿，比我早两年进大学。
学妹 | xué mèi | junior (female) schoolmate | 比自己晚进学校的女同学 | 她是我的＿＿，比我晚一年进学校。
班风 | bān fēng | class atmosphere | 一个班的风气 | 这个班的＿＿很好，同学们都很努力，互相帮助。
三好学生 | sān hǎo xué sheng | merit student | 品德、学习、身体都好的学生 | 他学习好、身体好、品德好，被评为＿＿。
尖子生 | jiān zi shēng | top student | 成绩特别好的学生 | 他是班里的＿＿，每次考试都是第一名。 | 三好学生
后进生 | hòu jìn shēng | student who lags behind | 学习或表现比较落后的学生 | 老师从不放弃＿＿，总是耐心地帮他们补课。
`,
  },
  {
    theme: ["Ways of Studying", "学习的方法"],
    data: `
温习 | wēn xí | to review | 把学过的东西再学一遍 | 考试前，他把课本从头到尾＿＿了一遍。 | 巩固
巩固 | gǒng gù | to consolidate | 使更加牢靠 | 做练习可以＿＿课上学到的知识。 | 温习
钻研 | zuān yán | to study intensively | 深入地研究 | 他一心＿＿技术，成了厂里最好的工程师。 | 探究
探究 | tàn jiū | to inquire into | 探索研究 | 科学课上，老师让我们自己动手做实验，＿＿植物生长需要哪些条件。 | 钻研
死记硬背 | sǐ jì yìng bèi | rote learning | 不理解，只是硬记 | 学数学不能＿＿公式，要明白它是怎么来的。
温故知新 | wēn gù zhī xīn | to learn the new by reviewing the old | 复习学过的，得到新的体会 | 老师常说要＿＿，复习旧课的时候也会有新的收获。
循序渐进 | xún xù jiàn jìn | step by step | 按照顺序一步一步地前进 | 学外语要＿＿，不能一下子学太难的内容。
熟能生巧 | shú néng shēng qiǎo | practice makes perfect | 熟练了就能找到好方法 | 打字一开始很慢，但＿＿，练得多了自然就快了。
钻牛角尖 | zuān niú jiǎo jiān | to get stuck on a trivial point | 在不重要或解决不了的问题上费力气 | 这道题想不出来就先放一放，别＿＿。
谨慎 | jǐn shèn | careful, cautious | 小心，不马虎 | 做化学实验一定要＿＿，按照老师说的方法做。
`,
  },
  {
    theme: ["Understanding and Attention", "理解和专心"],
    data: `
领悟 | lǐng wù | to comprehend | 理解，明白 | 读了这本书，他慢慢＿＿到了坚持的意义。 | 醒悟 感悟
醒悟 | xǐng wù | to wake up to (one's error) | 从迷惑或错误中明白过来 | 直到考试不及格，他才＿＿过来，开始认真学习。 | 领悟
感悟 | gǎn wù | reflection, insight | 有所感受而明白的道理 | 请写一写你读完这本书以后的＿＿。 | 领悟
悟性 | wù xìng | understanding, quick wits | 理解事物的能力 | 这个孩子＿＿很高，老师一讲就懂。
一知半解 | yì zhī bàn jiě | superficial understanding | 知道得不全面，理解得不深 | 对这个问题我只是＿＿，还要好好研究一下。 | 不求甚解 似懂非懂
不求甚解 | bù qiú shèn jiě | to be content with a rough idea | 读书只求懂个大概 | 他读书总是＿＿，看完了也说不清书里讲了什么。 | 一知半解
似懂非懂 | sì dǒng fēi dǒng | to half understand | 好像懂，又好像不懂 | 听完老师的解释，他还是＿＿地点了点头。 | 一知半解
心领神会 | xīn lǐng shén huì | to understand without being told | 不用说就明白 | 老师看了他一眼，他马上＿＿，安静了下来。
迷惑 | mí huò | puzzled | 不明白，弄不清楚 | 这道题的说法让很多同学感到＿＿。
专心致志 | zhuān xīn zhì zhì | wholly absorbed | 一心一意，集中精神 | 他＿＿地做作业，连妈妈叫他也没听见。
`,
  },
  {
    theme: ["Talent and Ability", "天资和能力"],
    data: `
愚笨 | yú bèn | stupid | 头脑不灵，不聪明 | 他觉得自己很＿＿，其实只是没找到好的学习方法。 | 迟钝
迟钝 | chí dùn | slow to react | 反应慢，不灵敏 | 他昨晚没睡好，今天反应有点＿＿。
笨拙 | bèn zhuō | clumsy | 不灵巧 | 他第一次包饺子，动作很＿＿。 | 迟钝
发呆 | fā dāi | to be in a daze | 什么也不做，只是愣愣地看着 | 上课的时候他常常看着窗外＿＿。
天分 | tiān fèn | talent, gift | 天生的才能 | 她在音乐方面很有＿＿，三岁就会弹钢琴。 | 资质
资质 | zī zhì | natural endowment | 人生来的素质 | 学习的好坏不光看＿＿，更要看是不是努力。 | 天分
呆板 | dāi bǎn | rigid, wooden | 死板，不灵活 | 这篇文章写得很＿＿，读起来没有意思。 | 笨拙
大智若愚 | dà zhì ruò yú | the truly wise seem slow | 很有智慧的人表面上看起来很笨 | 他平时话不多，看上去有点笨，其实是＿＿。
心灵手巧 | xīn líng shǒu qiǎo | clever and deft | 心思灵敏，手也灵巧 | 她＿＿，用一张纸就能剪出一只漂亮的小鸟。
愚公移山 | yú gōng yí shān | the foolish old man moves the mountains | 比喻做事有毅力，不怕困难 | 我们要学习＿＿的精神，再难的事也坚持去做。
`,
  },
  {
    theme: ["Diligence and Laziness", "勤奋和懒惰"],
    data: `
懒惰 | lǎn duò | lazy | 不爱劳动和工作 | ＿＿的人很难取得成功。
偷懒 | tōu lǎn | to slack off | 趁别人不注意少做事 | 老师一离开教室，有几个同学就开始＿＿。
刻苦 | kè kǔ | hardworking | 很能吃苦，非常努力 | 他学习非常＿＿，每天很晚才睡。
废寝忘食 | fèi qǐn wàng shí | to forget food and sleep | 非常专心努力 | 为了完成这个实验，他＿＿地工作了好几天。 | 持之以恒
持之以恒 | chí zhī yǐ héng | to persevere | 长久坚持下去 | 学习贵在＿＿，每天进步一点点。
半途而废 | bàn tú ér fèi | to give up halfway | 事情做到一半就停下来 | 既然开始了，就不要＿＿。
闻鸡起舞 | wén jī qǐ wǔ | to rise at cockcrow to practise | 比喻有志向的人及时努力 | 他每天天不亮就起床练习，有一种＿＿的精神。
好学 | hào xué | eager to learn | 喜欢学习 | 这个孩子很＿＿，遇到不懂的问题总要问个明白。 | 刻苦
笨鸟先飞 | bèn niǎo xiān fēi | the slow bird sets off early | 能力差的人做事要比别人先开始 | 我学得慢，就＿＿，每天比别人早到一个小时练习。
十年寒窗 | shí nián hán chuāng | years of hard study | 长期刻苦读书 | 经过＿＿的苦读，他终于考上了理想的大学。
`,
  },
  {
    theme: ["Teachers and Teaching", "老师和教导"],
    data: `
恩师 | ēn shī | revered teacher | 对自己有很大帮助的老师 | 他获奖后，第一个打电话感谢的是自己的＿＿。
教诲 | jiào huì | teaching, guidance | 教导 | 他一直记着老师的＿＿：做人要诚实。 | 栽培
诲人不倦 | huì rén bú juàn | tireless in teaching | 教导别人从不感到累 | 王老师＿＿，学生问多少遍她都耐心地讲。
言传身教 | yán chuán shēn jiào | to teach by word and example | 用言语教导，用行动带头 | 父母的＿＿对孩子影响很大。
因材施教 | yīn cái shī jiào | to teach according to aptitude | 根据学生的不同特点用不同的方法教 | 好老师懂得＿＿，对不同的学生用不同的办法。
教学相长 | jiào xué xiāng zhǎng | teaching and learning help each other | 教和学互相促进 | 老师说，回答学生问题的时候自己也学到了很多，这就是＿＿。
启蒙 | qǐ méng | to give elementary instruction | 使初学的人得到基本知识 | 爷爷是他学书法的＿＿老师。
熏陶 | xūn táo | to nurture, to influence | 长期接触而受到好的影响 | 在音乐家庭的＿＿下，她从小就爱上了钢琴。
栽培 | zāi péi | to cultivate (a person) | 种植；培养人才 | 感谢老师多年的＿＿，我才有今天的成绩。 | 教诲
尊师重道 | zūn shī zhòng dào | to respect teachers and their teaching | 尊敬老师，重视老师传授的道理 | 中国自古就有＿＿的传统。
`,
  },
  {
    theme: ["Exams and Results", "考试和名次"],
    data: `
考场 | kǎo chǎng | examination room | 考试的地方 | 进＿＿以前，要把手机交给老师。
考砸 | kǎo zá | to do badly in an exam | 考试考得很差 | 这次数学他＿＿了，只得了五十分。
落榜 | luò bǎng | to fail an entrance exam | 考试没有被录取 | 去年他高考＿＿了，今年复读又考了一次。 | 名落孙山
榜单 | bǎng dān | list of results | 公布名单或名次的单子 | 成绩公布后，他在＿＿上找到了自己的名字。
金榜题名 | jīn bǎng tí míng | to pass an exam with success | 考试被录取 | 祝你高考顺利，＿＿！
名落孙山 | míng luò sūn shān | to fail an exam | 考试没有考上 | 他准备得不够充分，结果＿＿。 | 落榜
分数线 | fēn shù xiàn | cut-off score | 录取需要达到的最低分数 | 他的成绩比这所大学的＿＿高了二十分。
中考 | zhōng kǎo | senior high school entrance exam | 初中毕业升高中的考试 | 初三的学生正在紧张地准备＿＿。 | 统考
统考 | tǒng kǎo | unified examination | 统一组织的考试 | 全市的初二学生下周参加数学＿＿。
复读 | fù dú | to repeat a year to retake an exam | 没考上的学生再读一年 | 他高考成绩不理想，决定＿＿一年。
`,
  },
  {
    theme: ["Admissions and Moving Up", "升学和录取"],
    data: `
录取通知书 | lù qǔ tōng zhī shū | letter of admission | 学校通知学生被录取的文件 | 他收到了大学的＿＿，高兴得跳了起来。
保送 | bǎo sòng | to admit without an entrance exam | 不用考试，由学校送进上一级学校 | 他在全国数学比赛中得了一等奖，被＿＿上了大学。
填报 | tián bào | to fill in and submit | 填写以后报给有关部门 | 高考成绩出来以后，考生要＿＿志愿。
调剂 | tiáo jì | to reassign | 把多的和少的调整一下 | 他没被第一志愿录取，被＿＿到了别的专业。
慎重 | shèn zhòng | prudent, careful | 认真小心，不轻率 | 选择专业是件大事，一定要＿＿考虑。
升学 | shēng xué | to go on to a higher school | 进入上一级学校学习 | 很多家长很关心孩子的＿＿问题。 | 择校
择校 | zé xiào | to choose a school | 选择学校 | 为了＿＿，有的家长很早就开始打听各个学校的情况。
插班 | chā bān | to join a class midway | 中途进入某个班学习 | 他是从外地转来的，这学期＿＿到我们班。
跳级 | tiào jí | to skip a grade | 越过一个年级去读高一级 | 他成绩特别好，从三年级直接＿＿到了五年级。
留级 | liú jí | to repeat a grade | 没有升级，留在原来的年级再读一年 | 他因为生病缺了很多课，只好＿＿一年。
`,
  },
  {
    theme: ["Setbacks and Pressure", "挫折和压力"],
    data: `
挫折 | cuò zhé | setback | 失败，不顺利 | 遇到＿＿不要怕，要从失败中学习。
屡次 | lǚ cì | repeatedly | 一次又一次 | 他＿＿迟到，被老师批评了。
气馁 | qì něi | discouraged | 失去勇气 | 一次没考好不要＿＿，下次再努力。 | 沮丧
沮丧 | jǔ sàng | dejected | 因为失败而心情很差 | 比赛输了，队员们都很＿＿。 | 气馁
丧失 | sàng shī | to lose | 失去 | 这次失败让他＿＿了信心。
被迫 | bèi pò | to be forced | 不得不做 | 雨太大了，比赛＿＿停止。
逼迫 | bī pò | to force | 用压力使别人做 | 父母不应该＿＿孩子学他们不喜欢的东西。
迫切 | pò qiè | urgent, pressing | 非常急 | 山区的孩子＿＿需要更多的好老师。
辍学 | chuò xué | to drop out of school | 中途停止上学 | 过去有些农村孩子因为家里穷而＿＿。
屡见不鲜 | lǚ jiàn bù xiān | common, nothing new | 常常见到，不新奇 | 现在中学生戴近视眼镜的情况已经＿＿。
`,
  },
  {
    theme: ["Raising Children", "家庭教育"],
    data: `
溺爱 | nì ài | to spoil (a child) | 过分地爱孩子 | 父母对孩子过分＿＿，孩子长大后可能什么都不会做。 | 娇惯
娇惯 | jiāo guàn | to pamper | 从小宠着，什么都顺着 | 他从小被爷爷奶奶＿＿，一点苦也吃不了。 | 溺爱
纵容 | zòng róng | to condone | 对错误的行为不加管教 | 孩子犯了错，大人不能＿＿，要耐心地讲道理。 | 放纵
放纵 | fàng zòng | to let oneself go | 不加约束，随着自己的性子 | 放假也不能＿＿自己，每天玩到半夜。 | 纵容
叮嘱 | dīng zhǔ | to urge again and again | 一再地嘱咐 | 出门前，妈妈＿＿他路上注意安全。
娇气 | jiāo qì | soft, unable to bear hardship | 意志不坚强，不能吃苦 | 这孩子太＿＿了，走一点路就喊累。 | 娇惯
望子成龙 | wàng zǐ chéng lóng | to long for one's child to succeed | 希望孩子成为有出息的人 | 很多家长＿＿，给孩子报了很多补习班。
拔苗助长 | bá miáo zhù zhǎng | to spoil things by excessive haste | 违反规律，急于求成，反而坏事 | 让三岁的孩子每天学五个小时，简直是＿＿。
栋梁 | dòng liáng | pillar (of society) | 能担当重任的人 | 老师希望学生们将来都能成为国家的＿＿。
逆反心理 | nì fǎn xīn lǐ | rebelliousness | 故意做相反的事的心理 | 父母越逼他学习，他越不想学，这是一种＿＿。
`,
  },
  {
    theme: ["Study and Research", "求学和研究"],
    data: `
学海无涯 | xué hǎi wú yá | learning has no limits | 知识像大海一样没有边 | ＿＿，我们要活到老，学到老。
生涯 | shēng yá | career | 从事某种活动的时期 | 他的教学＿＿长达四十年。
求知 | qiú zhī | to seek knowledge | 想得到知识 | 孩子们＿＿的愿望很强，什么都想知道。
求学 | qiú xué | to pursue one's studies | 到学校学习 | 十八岁那年，他离开家乡，到北京＿＿。
治学 | zhì xué | to pursue scholarship | 研究学问 | 这位老教授＿＿严谨，每个数据都要检查好几遍。
研讨会 | yán tǎo huì | symposium | 专家们一起研究讨论问题的会 | 上百位专家参加了这次关于环境保护的国际＿＿。
毕业论文 | bì yè lùn wén | graduation thesis | 大学毕业时要写的论文 | 大四下学期，他一直在忙着写＿＿。
答辩 | dá biàn | to defend (a thesis) | 回答别人对论文的提问 | 论文写完以后，还要通过＿＿才能毕业。
开题 | kāi tí | to present a research proposal | 说明论文研究的计划 | 研究生在正式写论文之前，要先做＿＿报告。
课题 | kè tí | research project | 研究或讨论的主要问题 | 这个研究＿＿由三位教授一起负责。
`,
  },
  // Unit 3: Work and the Workplace.
  {
    theme: ["Looking for Work", "求职"],
    data: `
笔试 | bǐ shì | written test | 用笔答题的考试 | 先通过＿＿，才能参加面试。
求职信 | qiú zhí xìn | cover letter | 找工作时写给单位的信 | 他在＿＿里介绍了自己的经历和特长。
推荐信 | tuī jiàn xìn | letter of recommendation | 别人写的说明某人优秀的信 | 教授给他写了一封＿＿，说他是个优秀的学生。
招聘会 | zhāo pìn huì | job fair | 很多单位一起招人的活动 | 这次＿＿来了两百多家公司，找工作的人排起了长队。 | 人才市场
人才市场 | rén cái shì chǎng | job centre | 找工作的人和招人的单位见面的地方 | 他每个周末都去＿＿看看有没有合适的工作。 | 招聘会
猎头 | liè tóu | headhunter | 帮公司找高级人才的人或公司 | 一家＿＿公司打电话给他，问他愿不愿意换工作。
竞聘 | jìng pìn | to compete for a post | 通过竞争争取某个职位 | 这次有五个人＿＿部门经理的职位。
双向选择 | shuāng xiàng xuǎn zé | two-way choice | 单位选人，人也选单位 | 招聘是＿＿，公司挑选人才，找工作的人也在挑选公司。
试用期 | shì yòng qī | probation period | 新员工正式录用前试着工作的时间 | 新员工有三个月的＿＿，表现好才能正式录用。
转正 | zhuǎn zhèng | to become a permanent employee | 试用结束后成为正式员工 | 他工作认真，提前一个月＿＿了。
`,
  },
  {
    theme: ["Contracts and Pay", "合同和报酬"],
    data: `
劳动合同 | láo dòng hé tong | employment contract | 员工和单位签的工作协议 | 正式上班前，公司要和员工签订＿＿。
续约 | xù yuē | to renew a contract | 合同到期后继续签 | 合同下个月到期，公司希望和他＿＿。
解约 | jiě yuē | to terminate a contract | 取消合同 | 因为公司一直不按时发工资，他决定提前＿＿。
薪酬 | xīn chóu | remuneration | 工资和奖金等收入 | 这家公司的＿＿很高，吸引了很多年轻人。 | 报酬
底薪 | dǐ xīn | base pay | 不算奖金和提成的基本工资 | 销售员的＿＿不高，主要靠卖得多拿提成。
津贴 | jīn tiē | allowance | 工资以外补助的钱 | 在高温天气工作的工人，每个月有一笔高温＿＿。
加班费 | jiā bān fèi | overtime pay | 加班得到的钱 | 他这个月每天都工作到晚上十点，工资里多了一大笔＿＿。
年终奖 | nián zhōng jiǎng | year-end bonus | 年底发的奖金 | 公司今年效益好，每个员工都拿到了一笔＿＿。
工资条 | gōng zī tiáo | pay slip | 写着工资明细的单子 | 他看了看＿＿，发现这个月多了三百块钱。
报酬 | bào chóu | pay, reward | 做事得到的钱或东西 | 他帮邻居修好了电脑，没要任何＿＿。 | 薪酬
`,
  },
  {
    theme: ["Attendance and Leave", "考勤和休假"],
    data: `
打卡 | dǎ kǎ | to clock in | 上下班时用机器记录时间 | 每天到公司后，要先在门口＿＿。
考勤 | kǎo qín | attendance check | 检查上班出勤的情况 | 公司的＿＿制度很严格，迟到三次要扣钱。
旷工 | kuàng gōng | to be absent without leave | 没请假就不去上班 | 他没有请假就三天不来上班，公司按＿＿处理。
早退 | zǎo tuì | to leave early | 没到下班时间就提前离开 | 下午他还没到下班时间就走了，被记了一次＿＿。
调休 | tiáo xiū | to take time off in lieu | 调换休息的日子 | 他上周末加了班，这周可以＿＿一天。
年假 | nián jià | annual leave | 每年可以休的带薪假期 | 他用了五天＿＿，带家人去海边玩了几天。
病假 | bìng jià | sick leave | 因为生病请的假 | 他发烧了，向公司请了两天＿＿。
产假 | chǎn jià | maternity leave | 女员工生孩子时休的假 | 她生完孩子，休了三个多月的＿＿。
事假 | shì jià | personal leave | 因为私人的事情请的假 | 他家里有急事，请了一天＿＿。
全勤奖 | quán qín jiǎng | perfect attendance bonus | 整个月不迟到、不请假得到的奖金 | 他这个月一天假也没请，拿到了＿＿。
`,
  },
  {
    theme: ["Ranks and Departments", "职位和部门"],
    data: `
总监 | zǒng jiān | director | 负责某方面全部工作的高级管理人员 | 她是公司的市场＿＿，管理着二十多人的团队。 | 总裁
总裁 | zǒng cái | president (of a company) | 大公司的最高管理人员 | 他从普通员工做起，二十年后成了公司的＿＿。
合伙人 | hé huǒ rén | partner | 一起出钱办企业的人 | 他和大学同学一起开了一家公司，两人是＿＿。 | 创始人
创始人 | chuàng shǐ rén | founder | 最早创办的人 | 这家公司的＿＿当年在自己家里开始创业。
高层 | gāo céng | senior management | 地位高的领导 | 这个重大的决定是公司＿＿开会做出的，普通员工事先都不知道。 | 中层
中层 | zhōng céng | middle management | 上面有领导、下面有员工的管理人员 | 他是公司的＿＿管理人员，上面有领导，下面有十几个员工。 | 高层
前台 | qián tái | reception desk | 公司或酒店门口接待客人的地方 | 客人到了公司，先在＿＿登记。
文员 | wén yuán | clerk | 在办公室做文字工作的人 | 她在一家公司当＿＿，每天整理文件、打印资料。
后勤 | hòu qín | support services | 负责吃、住、用等方面的工作 | 公司的＿＿部门负责员工的食堂和宿舍。
客服 | kè fú | customer service | 为客户提供服务的工作或人员 | 东西买回来坏了，他打电话给＿＿要求换货。
`,
  },
  {
    theme: ["Taking Up and Leaving Posts", "上任和离任"],
    data: `
赴任 | fù rèn | to go to take up a post | 去新的地方担任职务 | 他被派到南方分公司当经理，下个月＿＿。 | 走马上任
走马上任 | zǒu mǎ shàng rèn | to take up a new post | 到职，开始做新的工作 | 新校长昨天＿＿，第一天就去听了好几节课。 | 赴任
卸任 | xiè rèn | to leave office | 不再担任某个职务 | 他明年就要从总经理的位置上＿＿了。
撤职 | chè zhí | to dismiss from a post | 撤去职务 | 他因为严重失职被＿＿了。
接替 | jiē tì | to take over (from) | 接着做别人的工作 | 老王退休以后，由小李＿＿他的工作。
留任 | liú rèn | to remain in office | 继续担任原来的职务 | 他工作出色，董事会决定让他＿＿三年。
前任 | qián rèn | predecessor | 以前担任这个职务的人 | 新经理改变了＿＿的很多做法。
现任 | xiàn rèn | current, incumbent | 现在担任 | 他是这所学校的＿＿校长，已经干了五年了。
兼任 | jiān rèn | to hold concurrently | 同时担任两个以上的职务 | 他是数学老师，同时还＿＿班主任。
出任 | chū rèn | to take up (a post) | 出来担任 | 这位著名学者被请来＿＿研究所所长。 | 兼任
`,
  },
  {
    theme: ["Teammates and the Office", "搭档和办公室"],
    data: `
顶替 | dǐng tì | to stand in for | 代替别人的位置 | 小王生病了，今天由我＿＿他值班。
替补 | tì bǔ | substitute | 代替别人上场的人 | 他是球队的＿＿队员，主力受伤时才上场。
替换 | tì huàn | to replace | 把原来的换下来 | 这台旧电脑太慢了，该＿＿成新的了。
搭档 | dā dàng | partner | 一起工作的伙伴 | 他们俩是多年的工作＿＿，配合得很好。
搭配 | dā pèi | to pair up | 安排在一起 | 新员工和老员工＿＿在一起工作，学得更快。
临时工 | lín shí gōng | temporary worker | 短时间雇用的工人 | 商店过年时太忙，招了几个＿＿。
协作 | xié zuò | to cooperate | 互相配合一起做 | 这个项目需要几个部门＿＿完成。
传帮带 | chuán bāng dài | to pass experience on to newcomers | 老员工把经验传给新员工 | 公司希望老员工对新员工＿＿，帮他们尽快适应工作。
工位 | gōng wèi | workstation | 办公室里每个人工作的位置 | 他的＿＿在窗户边上，阳光很好。
茶水间 | chá shuǐ jiān | pantry | 办公室里打水、泡茶的小房间 | 休息的时候，同事们常在＿＿聊天。
`,
  },
  {
    theme: ["Dedication", "敬业和踏实"],
    data: `
敬业 | jìng yè | dedicated to one's work | 对工作认真负责 | 医生们很＿＿，常常为了病人放弃休息。 | 踏实
踏实 | tā shi | steady, down-to-earth | 实在，不浮躁 | 这个年轻人做事很＿＿，交给他的工作总能按时完成。 | 敬业 脚踏实地
兢兢业业 | jīng jīng yè yè | conscientiously | 小心谨慎、认真负责 | 他在这个岗位上＿＿地工作了三十年。 | 任劳任怨
任劳任怨 | rèn láo rèn yuàn | to work hard without complaint | 不怕累，也不怕别人埋怨 | 他每天干最累的活，从不抱怨，真是＿＿。 | 兢兢业业
精益求精 | jīng yì qiú jīng | to keep improving | 已经很好了还要求更好 | 这位老师傅对自己的手艺＿＿，做出来的东西已经很好了，他还要改了又改。 | 一丝不苟
一丝不苟 | yì sī bù gǒu | meticulous | 一点儿也不马虎 | 她做账＿＿，每一个数字都要核对好几遍。
脚踏实地 | jiǎo tà shí dì | down-to-earth | 做事认真实在 | 做事要＿＿，不能总想着一步登天。 | 踏实
诚恳 | chéng kěn | sincere | 真诚 | 他＿＿地向客户道了歉。
职业道德 | zhí yè dào dé | professional ethics | 做某种工作应该遵守的道德 | 医生把病人的隐私告诉别人，是违反＿＿的。
骨干 | gǔ gàn | backbone | 起主要作用的人 | 他工作十年，已经成了部门的业务＿＿。
`,
  },
  {
    theme: ["Slacking", "懈怠和敷衍"],
    data: `
懈怠 | xiè dài | to slack off | 松懈，不努力 | 取得了一点成绩就＿＿下来，是很危险的。
敷衍 | fū yǎn | perfunctory | 做事不认真，只做个样子 | 他回答问题很＿＿，随便说了两句就走了。 | 马虎
怠工 | dài gōng | to go slow (at work) | 故意不好好干活 | 工人们对新规定不满，开始消极＿＿。
怠慢 | dài màn | to slight (a guest) | 对人冷淡，不热情 | 客人来了要热情招待，不要＿＿了人家。
摸鱼 | mō yú | to idle at work | 上班时间不好好工作，做别的事 | 他上班时常常偷偷看视频＿＿。
拖延 | tuō yán | to put off | 把时间往后推 | 他总是把工作＿＿到最后一天才做。 | 拖拉
拖拉 | tuō lā | dilatory | 办事慢，不抓紧 | 他做事很＿＿，说好一天完成的工作要三天。 | 拖延
马虎 | mǎ hu | careless | 不认真，粗心 | 他写报告太＿＿了，里面有很多错字。 | 敷衍
苟且 | gǒu qiě | to muddle along | 只顾眼前，得过且过 | 不能只图＿＿，过一天算一天。
内耗 | nèi hào | internal friction | 内部互相消耗 | 部门之间互相不配合，造成了很大的＿＿。
`,
  },
  {
    theme: ["Busy and Tired", "忙碌和疲惫"],
    data: `
忙碌 | máng lù | busy | 事情很多，没有空 | 结束了一天＿＿的工作，他终于可以休息了。
疲惫 | pí bèi | exhausted | 非常累 | 连续加了一周班，他感到十分＿＿。 | 倦怠
倦怠 | juàn dài | burnout | 对工作失去热情，感到累 | 在同一个岗位干了十年，他产生了职业＿＿。 | 疲惫
加班加点 | jiā bān jiā diǎn | to work extra hours | 在规定时间以外加时间工作 | 为了按时完成任务，大家＿＿地干了一个月。
焦头烂额 | jiāo tóu làn é | in a terrible fix | 被很多麻烦事弄得很狼狈 | 几件急事一起来，他忙得＿＿。 | 手忙脚乱
手忙脚乱 | shǒu máng jiǎo luàn | in a flurry | 做事慌张，没有条理 | 第一天上班，他什么都不熟悉，＿＿的。 | 焦头烂额
忙里偷闲 | máng lǐ tōu xián | to snatch a moment of leisure | 在忙的时候抽出一点时间休息 | 工作再忙，他也会＿＿，周末去爬爬山。
工作狂 | gōng zuò kuáng | workaholic | 特别爱工作、不停地工作的人 | 他是个＿＿，连过年都在办公室加班。
催促 | cuī cù | to urge, to hurry | 叫人赶快行动 | 老板一直在＿＿他快点交报告。
盯 | dīng | to stare at, to keep an eye on | 眼睛一直看着 | 他＿＿着电脑屏幕看了一整天，眼睛很累。
`,
  },
  {
    theme: ["Colleagues and Rank", "同事和资历"],
    data: `
同僚 | tóng liáo | colleague (formal) | 一起工作的人，多指官员 | 他和几位＿＿一起向领导提出了建议。
官僚主义 | guān liáo zhǔ yì | bureaucracy | 只发命令，不了解实际，办事拖拉的作风 | 有些部门一点小事也要层层审批，让人等很久，这是＿＿的表现。
管辖 | guǎn xiá | to have jurisdiction over | 管理，统辖 | 这个区＿＿着十几个街道。
头衔 | tóu xián | title | 表示职位、身份的称号 | 他的名片上印着好几个＿＿。
资深 | zī shēn | senior, veteran | 资历深 | 她是一名＿＿记者，干这一行已经二十年了。
新手 | xīn shǒu | novice | 刚开始做某种工作的人 | 他刚开车不久，还是个＿＿。
老手 | lǎo shǒu | old hand | 对某种工作很有经验的人 | 修电脑他是个＿＿，什么问题都难不倒他。
师傅 | shī fu | master (of a trade) | 传授手艺的人；对工人的尊称 | 他跟着一位老＿＿学了三年木工。
徒弟 | tú di | apprentice, disciple | 跟师傅学手艺的人 | 老木匠收了两个＿＿，教他们做家具。
平庸 | píng yōng | mediocre | 平常，没有特别的才能 | 他不愿意＿＿地过一辈子，一直努力学习新技术。
`,
  },
  {
    theme: ["Rules, Rewards and Penalties", "规章和奖惩"],
    data: `
规章制度 | guī zhāng zhì dù | rules and regulations | 单位规定大家必须遵守的条文 | 新员工入职时要先学习公司的＿＿。 | 守则
守则 | shǒu zé | code of conduct | 大家要共同遵守的规则 | 墙上贴着“员工＿＿”，第一条是按时上班。 | 规章制度
处分 | chǔ fèn | disciplinary action | 对犯错误的人的惩罚 | 因为多次旷工，他受到了公司的＿＿。
奖惩 | jiǎng chéng | rewards and penalties | 奖励和惩罚 | 公司实行严格的＿＿制度，做得好有奖，做得不好要罚。
表彰 | biǎo zhāng | to commend | 公开表扬 | 年底，公司＿＿了十名优秀员工。 | 嘉奖
嘉奖 | jiā jiǎng | to cite for an award | 称赞并奖励 | 因为及时发现了火灾，他受到了上级的＿＿。 | 表彰
激励 | jī lì | to motivate | 激发鼓励 | 这笔奖金＿＿大家更加努力地工作。
扣钱 | kòu qián | to dock pay | 从工资里减去钱 | 公司规定，迟到一次要＿＿五十块。
渎职 | dú zhí | dereliction of duty | 不负责任，造成严重损失 | 这名官员因为＿＿造成了严重的损失，被撤了职。 | 失职
失职 | shī zhí | negligence | 没有做到自己应该做的 | 保安晚上睡着了，让小偷进了大楼，这是严重的＿＿。 | 渎职
`,
  },
  {
    theme: ["Skills and Know-How", "技能和门道"],
    data: `
窍门 | qiào mén | knack | 解决问题的好方法 | 洗这种衣服有个＿＿，用冷水洗不容易变形。 | 门道
一窍不通 | yí qiào bù tōng | to know nothing about | 一点也不懂 | 我对电脑＿＿，连开机都要问别人。
门道 | mén dao | the way of doing something | 做事的方法 | 外行看热闹，内行看＿＿。
内行 | nèi háng | expert | 对某种工作很懂的人 | 说到修汽车，他可是＿＿。 | 外行
外行 | wài háng | layman | 对某种工作不懂的人 | 我是个＿＿，看不懂这些设计图。 | 内行
匠心 | jiàng xīn | craftsmanship, ingenuity | 精巧的心思 | 这件作品处处体现了工匠的＿＿。
学徒 | xué tú | trainee in a trade | 在店里或工厂里学手艺的人 | 他十六岁就到一家饭馆当＿＿，学做菜。
摸索 | mō suǒ | to feel one's way | 试着寻找方法 | 没有人教他，他自己＿＿出了一种好方法。
得心应手 | dé xīn yìng shǒu | to do with ease | 做起来很顺手 | 做了三年以后，这份工作他已经干得＿＿了。
本行 | běn háng | one's own line of work | 自己一直从事的工作 | 他当了几年老师，后来又回到了＿＿，继续做医生。
`,
  },
  {
    theme: ["Changing Jobs", "转行和在职"],
    data: `
转行 | zhuǎn háng | to switch careers | 换到别的行业工作 | 他当了五年记者，后来＿＿做了教师。
副业 | fù yè | side business | 主要工作以外的工作 | 他白天上班，晚上开网店，把这当作＿＿。
待业 | dài yè | to be waiting for a job | 没有工作，等着就业 | 他大学毕业后在家＿＿了半年，才找到工作。
在职 | zài zhí | on the job | 正在工作岗位上 | 他是＿＿研究生，一边工作一边读书。
停职 | tíng zhí | to suspend from duty | 暂时停止职务 | 在调查结束以前，他被＿＿了。
复职 | fù zhí | to resume one's post | 回到原来的职位 | 调查结果证明他没有问题，下个月就可以＿＿了。
入职 | rù zhí | to join a company | 进入单位开始工作 | 他上个月刚＿＿，对公司的情况还不太了解。
自由职业者 | zì yóu zhí yè zhě | freelancer | 不属于任何单位、自己找活干的人 | 他是一名＿＿，在家里给几家杂志画画。
远程办公 | yuǎn chéng bàn gōng | remote working | 不去单位，用网络在别的地方工作 | 有了网络会议，很多人可以在家＿＿。
铁饭碗 | tiě fàn wǎn | iron rice bowl | 非常稳定、不会失去的工作 | 过去很多人觉得在国企工作就是端上了＿＿。
`,
  },
  {
    theme: ["Workers and Employers", "劳资关系"],
    data: `
工会 | gōng huì | trade union | 工人的组织 | 员工们通过＿＿向公司提出了提高工资的要求。
罢工 | bà gōng | to go on strike | 工人为了某种要求一起停止工作 | 因为工资太低，这家工厂的工人宣布＿＿三天。
劳资 | láo zī | labour and management | 工人和老板 | ＿＿双方经过谈判，终于签订了新的合同。
纠纷 | jiū fēn | dispute | 争执的事情 | 两家公司因为合同问题发生了＿＿。
仲裁 | zhòng cái | arbitration | 由第三方对争执做出决定 | 双方谈了很久也没有结果，只好申请劳动＿＿。
维权 | wéi quán | to defend one's rights | 维护自己的权益 | 工人们拿起法律武器，依法＿＿。
欠薪 | qiàn xīn | unpaid wages | 欠员工的工资 | 公司已经三个月没发工资，员工们在讨论怎样讨回＿＿。 | 拖欠
拖欠 | tuō qiàn | to be in arrears with | 很久不还 | 这家公司＿＿了工人三个月的工资。 | 欠薪
劳务 | láo wù | labour services | 为别人提供的劳动 | 他通过一家＿＿公司到国外做建筑工人。
劳动法 | láo dòng fǎ | labour law | 保护劳动者权益的法律 | 按照＿＿，公司不能随便让员工加班。
`,
  },
  {
    theme: ["Planning and Raising Funds", "筹划和筹款"],
    data: `
筹备 | chóu bèi | to prepare | 为做某件事事先准备 | 公司正在＿＿下个月的年会。 | 策划
筹集 | chóu jí | to raise (funds) | 想办法收集 | 为了开公司，他向亲戚朋友＿＿了一笔钱。 | 筹款
筹款 | chóu kuǎn | to raise money | 想办法收集钱 | 学校举办义卖活动，为生病的同学＿＿。 | 筹集
统筹 | tǒng chóu | to plan as a whole | 统一安排 | 这次活动由市场部＿＿安排。
出谋划策 | chū móu huà cè | to give advice | 给别人出主意 | 大家都为新产品的推广＿＿。
一筹莫展 | yì chóu mò zhǎn | at one's wits' end | 一点办法也想不出来 | 面对这么大的困难，他＿＿。
策划 | cè huà | to plan, to organize | 筹划，计划 | 这场晚会是由她一手＿＿的。 | 筹备
例会 | lì huì | regular meeting | 按规定定期举行的会 | 每周一上午，部门都要开＿＿。
纪要 | jì yào | minutes | 记下要点的文字 | 开完会，秘书把会议＿＿发给了每个人。
审批 | shěn pī | to examine and approve | 审查批准 | 这个项目的预算还要等领导＿＿。
`,
  },
  {
    theme: ["Making a Living", "谋生和职业"],
    data: `
谋生 | móu shēng | to make a living | 想办法维持生活 | 年轻的时候，他靠修自行车＿＿。
谋求 | móu qiú | to seek | 想办法寻求 | 他离开家乡，到大城市＿＿更好的发展。
打工人 | dǎ gōng rén | worker (in jest) | 为别人工作挣钱的人 | “＿＿”是年轻上班的人对自己的一种玩笑叫法。
白领 | bái lǐng | white-collar worker | 在办公室工作的职员 | 他大学毕业后在一家公司做＿＿，每天坐在办公室里。 | 蓝领
蓝领 | lán lǐng | blue-collar worker | 在工厂等从事体力或技术劳动的工人 | 工厂里的技术工人一般被叫做＿＿。 | 白领
职业病 | zhí yè bìng | occupational disease | 因为工作环境长期影响而得的病 | 老师长期大声讲课，嗓子不好是常见的＿＿。
职场 | zhí chǎng | the workplace | 工作的环境 | 刚走进＿＿的年轻人，要学会和同事沟通。
事业单位 | shì yè dān wèi | public institution | 由国家办的学校、医院等单位 | 学校、医院大多是＿＿。
央企 | yāng qǐ | central state-owned enterprise | 由中央政府管理的国有企业 | 他在一家＿＿工作，公司由中央政府直接管理。
跨国公司 | kuà guó gōng sī | multinational company | 在很多国家有业务的公司 | 这家＿＿在三十多个国家都有分公司。
`,
  },
];
