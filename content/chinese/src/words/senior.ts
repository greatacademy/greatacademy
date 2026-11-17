// The word batches of senior secondary school, four for the required course (grade 10) and four for the selective required
// course (grade 11), written for this subject: the written words of the essays, criticism, arguments and expositions a
// senior secondary student reads, and pairs of near-synonyms easily confused. In each sentence only the word it is written
// for fits among the batch's words. The format is that of parseWords.

import { t } from "@ga/content";

import type { WordBatchData } from "./data.ts";
import { parseWords } from "./words.ts";

/** seniorWordData are the word batches of grades 10 and 11, in the order they are taught. */
export const seniorWordData: readonly WordBatchData[] = [
  {
    grade: 10,
    theme: t("Literature and Aesthetics", "文学与审美"),
    words: parseWords(`
凝练 | níng liàn | 文字紧凑简洁，没有多余的话 | terse and polished | 这首绝句语言＿＿，二十个字写尽了离别之情。 | 新闻标题要写得＿＿，用最少的字说清最要紧的事。 | 精练 | 繁冗
生涩 | shēng sè | 语言不流畅，不纯熟 | awkward, unpolished | 这篇译文读起来十分＿＿，很多句子不通顺。 | 刚学写诗的人，用词难免＿＿，读来不够自然。 | 艰涩 | 流畅
细腻 | xì nì | 描写或表演细致入微 | delicate and detailed | 作者对人物心理的刻画十分＿＿，连一丝犹豫都写了出来。 | 她的表演＿＿真切，把角色的心事演得丝丝入扣。 | 细致 | 粗糙
婉约 | wǎn yuē | 委婉含蓄，多指词的风格 | graceful and restrained | 李清照的词风格＿＿，多写离愁别绪。 | 宋词有豪放、＿＿两大流派。 | 柔婉 | 豪放
典雅 | diǎn yǎ | 优美而不粗俗 | elegant | 这座园林的亭台楼阁古朴＿＿，处处透出书香气。 | 大厅的布置＿＿大方，墙上挂着几幅山水画。 | 雅致 | 粗俗
空洞 | kōng dòng | 没有内容或内容不切实际 | hollow | 这篇作文辞藻华丽，内容却十分＿＿。 | 只喊口号的文章往往＿＿无物。 | 空泛 | 充实
雕琢 | diāo zhuó | 过分地修饰文字 | to over-polish | 写文章不要刻意＿＿字句，真情最动人。 | 这首诗过于＿＿，反而失去了自然之美。 | 修饰 | 质朴
鲜活 | xiān huó | 新鲜而有生气 | vivid and fresh | 作者笔下的人物个个＿＿，仿佛就站在眼前。 | 这些＿＿的口语让文章充满了生活气息。 | 生动 | 呆板
悲壮 | bēi zhuàng | 悲哀而雄壮 | solemn and stirring | 壮士明知此去不能生还，仍然踏上了＿＿的征程。 | 这首战歌＿＿激昂，唱出了将士们视死如归的豪情。 | 壮烈 | 欢快
渲染 | xuàn rǎn | 着力描写以烘托气氛，也指夸大地形容 | to play up | 作者用大段景物描写＿＿了悲凉的气氛。 | 这件小事被报纸过分＿＿，闹得人人皆知。 | 烘托 | 淡化
`),
  },
  {
    grade: 10,
    theme: t("Reasoning and Argument", "思辨与论证"),
    words: parseWords(`
周全 | zhōu quán | 周到全面，没有遗漏 | thorough, well considered | 他考虑问题十分＿＿，连最坏的情况都想到了。 | 这份方案设计得很＿＿，各种意外都有应对办法。 | 周到 | 疏漏
偏颇 | piān pō | 偏于一方面，不公正 | biased | 只说缺点、不提优点的评价，难免有所＿＿。 | 这篇报道只采访了一方，观点有失＿＿。 | 片面 | 公允
驳斥 | bó chì | 反驳错误的言论或意见 | to refute | 他列出大量事实，有力地＿＿了这种谣言。 | 对于这种歪曲历史的论调，必须严正＿＿。 | 批驳 | 赞同
演绎 | yǎn yì | 由一般的道理推出个别的结论 | to deduce | 从“人都会死”推出“苏格拉底会死”，用的是＿＿推理。 | 数学证明大多采用＿＿的方法，从公理一步步推出结论。 | 推演 | 归纳
偏激 | piān jī | 意见、主张或情绪过火 | extreme | 他言辞＿＿，动不动就把对方说得一无是处。 | 情绪＿＿的时候，最容易说出过头的话。 | 极端 | 平和
荒谬 | huāng miù | 极端错误，非常不合情理 | absurd | 说地球是平的，这种观点十分＿＿。 | 他的推理看似有理，结论却＿＿得可笑。 | 荒诞 | 合理
求证 | qiú zhèng | 寻找证据来证明 | to seek proof | 对网上的传言，要先＿＿，再决定信不信。 | 大胆假设，小心＿＿。 | 查证 | 轻信
透彻 | tòu chè | 详尽而深入 | thorough | 他把这个道理分析得十分＿＿，大家一听就明白了。 | 只有把问题研究＿＿，才能找到解决的办法。 | 深刻 | 肤浅
盲从 | máng cóng | 不问是非地附和别人 | to follow blindly | 读书不能＿＿书本，要有自己的判断。 | 对专家的意见也要动脑思考，不能一味＿＿。 | 附和 | 自主
笼统 | lǒng tǒng | 缺乏具体分析，不明确 | vague | 他的回答很＿＿，只说“各方面都有问题”，却没说清是哪些问题。 | 这份计划写得太＿＿，看不出每一步该做什么、由谁来做。 | 含混 | 具体
`),
  },
  {
    grade: 10,
    theme: t("Society and the Times", "社会与时代"),
    words: parseWords(`
蓬勃 | péng bó | 繁荣旺盛 | vigorous | 新兴产业＿＿发展，为城市注入了活力。 | 校园里到处是朝气＿＿的年轻人。 | 旺盛 | 衰颓
萧条 | xiāo tiáo | 冷落，没有生气；经济衰退 | depressed, desolate | 战乱过后，市面＿＿，民不聊生。 | 经济＿＿的那几年，许多工厂停了产。 | 冷落 | 繁荣
变革 | biàn gé | 改变事物的本质，多指社会制度 | transformation | 互联网带来了一场深刻的社会＿＿。 | 印刷术的发明引起了知识传播方式的＿＿。 | 改革 | 停滞
传承 | chuán chéng | 传授和继承 | to pass on | 老艺人收徒授艺，把剪纸手艺＿＿下去。 | 非物质文化遗产需要一代代＿＿。 | 继承 | 失传
弊端 | bì duān | 由于制度或做法有漏洞而产生的害处 | drawback | 这项制度存在不少＿＿，需要尽快完善。 | 过度依赖手机的＿＿已经越来越明显。 | 弊病 | 益处
闭塞 | bì sè | 交通不便，消息不灵通 | isolated, cut off | 过去山区交通＿＿，村民很少走出大山。 | 在信息＿＿的年代，一封家书要走上好几个月。 | 封闭 | 畅通
推行 | tuī xíng | 普遍地实行 | to put into effect | 这座城市大力＿＿垃圾分类，家家户户都学会了分装垃圾。 | 新的交通规则将在全国＿＿。 | 实行 | 废止
奢靡 | shē mí | 奢侈浪费 | extravagant | 有些人追求＿＿的生活，花钱大手大脚。 | 历史上不少王朝因＿＿成风而走向衰亡。 | 奢侈 | 节俭
包容 | bāo róng | 宽容大度，能容纳不同的人和事 | tolerant, inclusive | 一座城市要有＿＿的胸怀，接纳来自四方的人。 | 不同文化之间应当相互＿＿，取长补短。 | 宽容 | 排斥
疏离 | shū lí | 疏远，感情上有距离 | estranged | 网络让人足不出户就能交流，却也可能让人与人之间变得＿＿。 | 他长年在外，与家乡的亲人渐渐＿＿了。 | 疏远 | 亲近
`),
  },
  {
    grade: 10,
    theme: t("Science and Exposition", "科技与说明"),
    words: parseWords(`
精确 | jīng què | 非常准确 | precise | 卫星导航能把位置＿＿到几米之内。 | 实验数据一定要＿＿，差一点都不行。 | 精准 | 粗略
衰减 | shuāi jiǎn | 逐渐减弱，减少 | to attenuate | 信号在长距离传输中会逐渐＿＿。 | 随着年龄增长，人的听力会慢慢＿＿。 | 减弱 | 增强
兼容 | jiān róng | 同时容纳几个方面，彼此能一起使用 | compatible | 这款充电器能＿＿多种型号的手机。 | 新系统与旧文件互相＿＿，打开毫无问题。 | 相容 | 冲突
稀缺 | xī quē | 稀少而缺乏 | scarce | 淡水是一种＿＿的资源，要节约用水。 | 沙漠里水源＿＿，植物很难生长。 | 短缺 | 充裕
恒定 | héng dìng | 永久固定，不发生变化 | constant | 恒温箱里的温度保持＿＿。 | 地球自转的速度并非完全＿＿，而是有极其微小的变化。 | 稳定 | 波动
演变 | yǎn biàn | 历时较久的发展变化 | to evolve | 汉字经过几千年的＿＿，才成为今天的样子。 | 这篇说明文介绍了自行车外形的＿＿过程。 | 演化 | 定型
简便 | jiǎn biàn | 简单方便 | simple and handy | 这种测量方法＿＿易行，用一把尺子就能完成。 | 用手机扫码付款十分＿＿，不用再带零钱。 | 便捷 | 繁琐
耗费 | hào fèi | 消耗，花费 | to consume | 这台老空调＿＿的电太多了。 | 修建这座大桥＿＿了五年时间。 | 消耗 | 节省
稠密 | chóu mì | 多而密 | dense | 城市中心人口＿＿，交通压力很大。 | 这片树林枝叶＿＿，阳光几乎照不进来。 | 密集 | 稀疏
运转 | yùn zhuǎn | 机器转动，也指组织、机构工作 | to run, to operate | 机器日夜不停地＿＿。 | 停电后，工厂无法正常＿＿。 | 运行 | 停止
`),
  },
  {
    grade: 11,
    theme: t("Classics and Tradition", "古典与传统"),
    words: parseWords(`
古雅 | gǔ yǎ | 古朴而雅致 | of quaint elegance | 这首曲子用古琴弹奏，音色＿＿，仿佛把人带回了唐朝。 | 老街两旁是＿＿的木板房，屋檐下挂着红灯笼。 | 古朴 | 新潮
秉持 | bǐng chí | 坚持，一直守着不放 | to uphold | 他一生＿＿诚信，从不失约。 | 这家老店百年来＿＿“货真价实”的祖训。 | 坚守 | 背弃
传颂 | chuán sòng | 辗转传布颂扬 | to be widely praised | 岳飞精忠报国的故事千百年来被人们＿＿。 | 这首诗写出了游子的思乡之情，至今仍广为＿＿。 | 称颂 | 埋没
渊博 | yuān bó | 学识深而且广 | erudite | 这位老教授学识＿＿，讲起历史来如数家珍。 | 读书破万卷，他才有了＿＿的知识。 | 广博 | 浅陋
沿袭 | yán xí | 依照旧传统或先例去做 | to carry on (a custom) | 这条老街的名字＿＿了宋代的叫法，一直没有改过。 | 这种建筑式样＿＿了明清时期的风格。 | 承袭 | 革新
崇尚 | chóng shàng | 尊重，推崇 | to uphold | 中国古人＿＿“和而不同”的处世之道。 | 他＿＿简朴，从不追求名牌。 | 推崇 | 鄙弃
繁复 | fán fù | 多而复杂 | elaborate | 这部古书注释＿＿，一句原文后面跟着好几段解说。 | 这道传统点心工序＿＿，要做整整一天。 | 繁杂 | 简约
庄重 | zhuāng zhòng | 言语举止不随便，不轻浮 | solemn | 祭孔大典的场面＿＿肃穆。 | 他在典礼上的讲话＿＿得体。 | 庄严 | 轻浮
考究 | kǎo jiu | 讲究，精美 | particular, exquisite | 他对饮茶很＿＿，水要山泉水，杯要青瓷杯。 | 这家老字号做衣服很＿＿，一针一线都不马虎。 | 讲究 | 粗陋
景仰 | jǐng yǎng | 佩服尊敬 | to look up to | 人们怀着＿＿之情，参观了这位文学大师的故居。 | 他的学问和人品都令人＿＿。 | 敬仰 | 蔑视
`),
  },
  {
    grade: 11,
    theme: t("Feelings and Character", "情感与品格"),
    words: parseWords(`
落寞 | luò mò | 冷落寂寞 | lonely, desolate | 节日里，他一个人在异乡，心中不免有些＿＿。 | 夕阳下，老人＿＿的背影让人心酸。 | 寂寞 | 欢欣
坦荡 | tǎn dàng | 心地纯洁，胸襟宽广 | open and aboveboard | 他心胸＿＿，从不在背后议论别人。 | 做人要光明＿＿，问心无愧。 | 磊落 | 阴险
执着 | zhí zhuó | 坚持不懈，不肯放弃 | persistent | 他对科学的追求十分＿＿，几十年如一日。 | 凭着一股＿＿劲儿，她终于攻克了难题。 | 坚定 | 动摇
谦逊 | qiān xùn | 谦虚恭谨 | modest | 他取得了成绩，却始终＿＿待人。 | 这位大师十分＿＿，总说自己还要学习。 | 谦虚 | 狂妄
悲悯 | bēi mǐn | 对人的苦难感到悲伤和同情 | compassion | 杜甫的诗中充满了对百姓的＿＿之情。 | 这部小说以＿＿的眼光注视着小人物的命运。 | 怜悯 | 冷酷
惶恐 | huáng kǒng | 惊慌害怕 | terrified | 他做错了事，＿＿不安地站在老师面前。 | 听到这个消息，她心中十分＿＿，一夜没睡好。 | 惊恐 | 镇定
隐忍 | yǐn rěn | 把事情忍耐着藏在心里 | to bear in silence | 为了完成大业，他＿＿多年，终于等来了机会。 | 她把委屈＿＿在心里，从不对人诉说。 | 忍耐 | 发泄
洒脱 | sǎ tuō | 言谈举止自然，不拘束 | free and easy | 他一生几经挫折，依然吟诗作画、游山玩水，活得＿＿自在。 | 他挥挥手，＿＿地转身离去。 | 潇洒 | 拘谨
赤诚 | chì chéng | 极其真诚 | utterly sincere | 他以一颗＿＿之心对待朋友。 | 这封家书字字句句都透着＿＿。 | 真诚 | 伪善
怯懦 | qiè nuò | 胆小怕事 | cowardly | 面对恶势力，他毫不＿＿，挺身而出。 | 鲁迅笔下的一些人物＿＿麻木，令人痛心。 | 胆怯 | 英勇
`),
  },
  {
    grade: 11,
    theme: t("Scholarship and Research", "学术与研究"),
    words: parseWords(`
考证 | kǎo zhèng | 根据资料考核、证实和说明 | to verify by research | 经过学者多年＿＿，确定这幅画出自宋代画家之手。 | 他翻阅了上百种古籍，＿＿出这座古桥的修建年代。 | 考据 | 杜撰
翔实 | xiáng shí | 详细而确实 | detailed and accurate | 这份调查报告材料＿＿，数据可靠。 | 他用＿＿的史料还原了那场战役的经过。 | 详尽 | 简略
借鉴 | jiè jiàn | 跟别的人或事相对照，以便取长补短 | to draw on | 这项研究＿＿了国外的先进经验。 | 写作时可以＿＿名家的写法，但不能照抄。 | 参考 | 照搬
原创 | yuán chuàng | 首创，不是模仿或抄来的 | original | 这首歌是他的＿＿作品。 | 这篇论文观点＿＿，在学界引起了关注。 | 首创 | 抄袭
精深 | jīng shēn | 精密而深奥 | profound | 中医博大＿＿，值得深入研究。 | 这位学者对甲骨文的研究十分＿＿，许多难认的字都是他考释出来的。 | 高深 | 粗浅
谬误 | miù wù | 错误，差错 | fallacy, error | 这本书中有几处史实＿＿，再版时已经改正。 | 科学就是在不断纠正＿＿中前进的。 | 错误 | 真理
阐释 | chǎn shì | 阐述并解释 | to expound | 老师用一个生活中的例子＿＿了这个原理。 | 这篇文章从三个方面＿＿了作者的观点。 | 阐述 | 曲解
求实 | qiú shí | 讲求实际 | down-to-earth | 做学问要有＿＿的精神，不能弄虚作假。 | 他工作＿＿，从不说空话、大话。 | 务实 | 浮夸
验证 | yàn zhèng | 通过试验使得到证实 | to verify | 科学家用实验＿＿了这个猜想。 | 这种新药的效果还需要大量临床试验来＿＿。 | 检验 | 否定
浅显 | qiǎn xiǎn | 字句、内容浅而易懂 | easy to understand | 这本科普书用＿＿的语言讲解了复杂的物理知识。 | 老师把复杂的道理讲得十分＿＿，大家一听就懂。 | 通俗 | 深奥
`),
  },
  {
    grade: 11,
    theme: t("Easily Confused Near-Synonyms", "易混近义词辨析"),
    words: parseWords(`
爆发 | bào fā | 因内部压力而突然冲出；力量、情绪或事变突然发生 | to erupt, to break out | 火山＿＿时，岩浆冲天而起。 | 演出结束，台下＿＿出雷鸣般的掌声。 | 喷发 | 平息
暴发 | bào fā | 突然发作，多指山洪、疾病 | to break out suddenly (of floods, disease) | 山洪＿＿，冲毁了村口的木桥。 | 连日暴雨后，这条河＿＿了洪水。 | 突发 | 消退
启用 | qǐ yòng | 开始使用，指设施、物品 | to put into use | 新建的图书馆下个月正式＿＿。 | 这枚新印章从今天起＿＿。 | 使用 | 停用
起用 | qǐ yòng | 提拔任用，指人 | to appoint | 这位导演大胆＿＿新人担任主角。 | 球队＿＿了一名年轻的守门员。 | 任用 | 罢免
制止 | zhì zhǐ | 强迫使正在进行的行动停止 | to stop (an act) | 他上前＿＿了正在打架的两个孩子。 | 保安及时＿＿了这场争吵。 | 阻止 | 纵容
禁止 | jìn zhǐ | 不许可，事先规定不准做 | to prohibit | 图书馆内＿＿大声喧哗。 | 这条路段＿＿货车通行。 | 严禁 | 允许
严厉 | yán lì | 严肃而厉害，指态度、言辞 | stern | 父亲＿＿地批评了他。 | 他的目光十分＿＿，看得人心里发慌。 | 严苛 | 温和
严格 | yán gé | 在遵守或执行标准时认真不放松 | strict | 工厂对产品质量进行＿＿检查，不合格的一件也不能出厂。 | 他＿＿遵守作息时间，每天六点准时起床。 | 严谨 | 宽松
沉静 | chén jìng | 性格、神情安静稳重 | calm, composed | 她性格＿＿，遇事从不慌乱。 | 他＿＿地坐在窗前，一言不发地看书。 | 文静 | 浮躁
沉寂 | chén jì | 没有声息，没有动静 | silent, dormant | 这位歌手＿＿多年后，又推出了一张新专辑。 | 这座火山已经＿＿了几百年。 | 寂静 | 活跃
`),
  },
];
