// The words of level 3 (docs/chinese-curriculum.md §8.4): 970 words of daily and social life in 97 batches of ten, none
// of them taught in levels 1 and 2, each written only with characters taught by its unit, each with a short sentence of
// those characters to fill.
//
// A line a word, as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** wordBatches are the 97 batches of level 3 words, in teaching order. */
export const wordBatches: readonly LevelWordBatch[] = [
  {
    theme: ["Linking Words", "关联词"],
    data: `
而且 | ér qiě | and also | 表示更进一层 | 他会说中文，＿＿说得很好。 | 甚至
却 | què | but, yet | 表示转折，倒是 | 天气很冷，他＿＿只穿了一件衣服。 | 仍然 甚至
并 | bìng | (before a negative) not at all | 用在否定词前加强语气 | 这个问题＿＿不难，你别担心。 | 却
否则 | fǒu zé | otherwise | 如果不这样 | 快走吧，＿＿就要迟到了。
必须 | bì xū | must | 一定要 | 明天的考试很重要，你＿＿参加。
甚至 | shèn zhì | even | 更进一层地说 | 他很忙，＿＿星期天也要上班。
终于 | zhōng yú | at last | 经过很长时间以后 | 等了两个小时，车＿＿来了。 | 突然 仍然
突然 | tū rán | suddenly | 很快地，没想到地 | 我们正在吃饭，外面＿＿下起了大雨。 | 终于
仍然 | réng rán | still | 还是，跟以前一样 | 十年过去了，他＿＿住在那个老房子里。 | 却
由于 | yóu yú | owing to | 因为 | ＿＿下大雨，比赛推迟了。
`,
  },
  {
    theme: ["Even So", "尽管这样"],
    data: `
竟然 | jìng rán | unexpectedly | 没想到 | 这么难的题，他＿＿五分钟就做完了。
尽管 | jǐn guǎn | although | 虽然 | ＿＿外面下着雨，他还是出门了。 | 不论 不管 无论
不管 | bù guǎn | no matter | 不论 | ＿＿多忙，他每天都给妈妈打电话。 | 无论 不论 尽管
不论 | bù lùn | regardless of | 不问条件怎样 | ＿＿你去不去，我都要去。 | 尽管 不管 无论
于是 | yú shì | and so | 表示后一件事紧接着前一件事 | 天黑了，＿＿我们就回家了。
然而 | rán ér | however | 但是 | 他很努力，＿＿考得并不好。
无论 | wú lùn | whatever, no matter | 不管 | ＿＿天气怎么样，他都去公园。 | 不管 不论 尽管
至少 | zhì shǎo | at least | 最少 | 从这里到机场＿＿要一个小时。
管理 | guǎn lǐ | to manage | 负责处理 | 他在公司＿＿二十个人。
尽快 | jǐn kuài | as soon as possible | 能多快就多快 | 请你＿＿回复我。
`,
  },
  {
    theme: ["Small Linking Words", "小词"],
    data: `
无聊 | wú liáo | bored | 没有意思 | 下雨天不能出去，在家里很＿＿。
必要 | bì yào | necessary | 不能少的 | 这件事没有＿＿告诉他。
并且 | bìng qiě | moreover | 而且 | 他会唱歌，＿＿唱得很好。
终点 | zhōng diǎn | terminus, finish | 最后到的地方 | 这辆车的＿＿是火车站，大家都要在那里下车。
管 | guǎn | to bother about | 照看，过问 | 这是我的事，你别＿＿。
由 | yóu | by (someone) | 归某人去做 | 这件事＿＿我来做。
至今 | zhì jīn | up to now | 到现在 | 他十年前去了国外，＿＿还没回来。
无关 | wú guān | unrelated | 没有关系 | 这件事跟你＿＿，你别问了。
尽力 | jìn lì | to do one's best | 用最大的力气 | 我会＿＿帮你的。
突出 | tū chū | outstanding | 特别好，超过一般 | 他的中文在班里很＿＿。
`,
  },
  {
    theme: ["Opinions", "观点"],
    data: `
观点 | guān diǎn | point of view | 对事情的看法 | 我同意你的＿＿，你说得很对。 | 决定
反对 | fǎn duì | to oppose | 不同意 | 爸爸＿＿我一个人去旅行。 | 支持 赞成
支持 | zhī chí | to support | 帮助，鼓励 | 你做什么，我都＿＿你。 | 反对 赞成
选择 | xuǎn zé | to choose | 从几个里面挑 | 这两个都很好，我不知道＿＿哪个。 | 决定
决定 | jué dìng | to decide | 拿定主意 | 我＿＿明年去中国学习。 | 选择 观点 赞成
赞成 | zàn chéng | to approve | 同意 | 大家都＿＿这个计划。 | 支持 反对
证明 | zhèng míng | to prove | 用事实说明是真的 | 你说他来过，有什么能＿＿吗？
选票 | xuǎn piào | ballot | 选人时用的票 | 他得了一百张＿＿，当上了班长。
决不 | jué bù | never | 一定不 | 你放心，我＿＿会告诉别人的。
观看 | guān kàn | to watch | 看 | 很多人来＿＿这场足球比赛。
`,
  },
  {
    theme: ["For and Against", "正反"],
    data: `
反正 | fǎn zhèng | anyway | 不管怎样 | 你别急，＿＿时间还早。
相反 | xiāng fǎn | opposite | 完全不一样 | 我们两个人的意见完全＿＿。
支 | zhī | (measure word for pens) | 用于笔 | 我买了两＿＿笔。
选 | xuǎn | to elect | 用投票挑出 | 大家＿＿他当班长。
决心 | jué xīn | determination | 坚定的意志 | 他下了＿＿，每天学习两个小时。
赞 | zàn | a like (online) | 网上表示喜欢 | 他在网上给我的照片点了＿＿。
据说 | jù shuō | it is said | 听别人说 | ＿＿明天会下雪。 | 反正
反而 | fǎn ér | on the contrary | 和想的正相反 | 吃了药，他的病不但没好，＿＿更重了。
而是 | ér shì | but rather | 和“不是”一起用，说明真的情况 | 他不是不想去，＿＿没有时间。
选手 | xuǎn shǒu | contestant | 参加比赛的人 | 这次比赛有一百名＿＿。
`,
  },
  {
    theme: ["About and Whether", "关于和是否"],
    data: `
决赛 | jué sài | final (match) | 最后决定名次的比赛 | 我们队进了＿＿，明天要和最好的队比赛。
关于 | guān yú | about | 涉及 | 这是一本＿＿中国文化的书。 | 对于
对于 | duì yú | as to | 说到某人或某事 | ＿＿这个问题，大家的意见不一样。 | 关于
等于 | děng yú | to equal | 相等 | 二加三＿＿五。
不必 | bù bì | need not | 不用 | 你＿＿担心，我一个人能行。
是否 | shì fǒu | whether | 是不是 | 我不知道他＿＿会来。
自由 | zì yóu | free | 不受限制 | 放假了，孩子们可以＿＿地玩。
理由 | lǐ yóu | reason | 原因 | 你迟到的＿＿是什么？
参观 | cān guān | to visit (a place) | 到一个地方去看 | 明天我们去＿＿北京大学。
乐观 | lè guān | optimistic | 相信事情会好 | 他很＿＿，遇到什么问题都不着急。
`,
  },
  {
    theme: ["Again and Again", "一再"],
    data: `
反复 | fǎn fù | repeatedly | 一次又一次 | 这个句子我＿＿练习了很多遍。
反应 | fǎn yìng | reaction | 受到刺激后的变化 | 我叫了他几次，他都没有＿＿。
坚决 | jiān jué | resolute | 一点也不改变 | 他＿＿不同意，谁说都没用。
赞美 | zàn měi | to praise | 说别人的好 | 大家都＿＿这里的风景。
证据 | zhèng jù | evidence | 能证明事情的东西 | 你说他拿了你的钱，有＿＿吗？
身份证 | shēn fèn zhèng | identity card | 证明自己是谁的卡 | 住宾馆要用＿＿。 | 证件
证件 | zhèng jiàn | papers, ID | 证明身份的东西 | 坐飞机的时候要带好＿＿。 | 身份证
至多 | zhì duō | at most | 最多 | 这个房间＿＿能住三个人。
最终 | zuì zhōng | in the end | 最后 | 他们讨论了很久，＿＿决定明年再去。
无比 | wú bǐ | incomparably | 没有能比的 | 考上大学以后，他＿＿高兴。
`,
  },
  {
    theme: ["That Is All", "而已"],
    data: `
而已 | ér yǐ | that's all | 罢了 | 我只是问问＿＿，你别生气。
否定 | fǒu dìng | to negate | 说不对 | 老师＿＿了我的意见，说这样做不行。 | 否认
否认 | fǒu rèn | to deny | 不承认 | 他＿＿自己拿了那本书。 | 否定
必然 | bì rán | inevitable | 一定会这样 | 不好好学习，考不好是＿＿的。 | 必定
必定 | bì dìng | surely | 一定 | 他说了会来，就＿＿会来。 | 必然
至于 | zhì yú | as for | 说到另一件事 | 我只想去北京，＿＿上海，以后再说。
处于 | chǔ yú | to be in (a state) | 在某种情况里 | 这个孩子正＿＿长身体的时候。
过于 | guò yú | too, overly | 太 | 你＿＿担心了，他会没事的。
外观 | wài guān | outward look | 外面的样子 | 这辆车的＿＿很漂亮。
无心 | wú xīn | not in the mood | 没有心思 | 他心里有事，＿＿工作。
`,
  },
  {
    theme: ["Points of View", "看问题"],
    data: `
观光 | guān guāng | to go sightseeing | 参观游览 | 每年有很多人来这里＿＿。
反问 | fǎn wèn | to ask back | 用问题来回答问题 | 他不说是也不说不是，＿＿我：“你说呢？”
年终 | nián zhōng | end of the year | 一年的最后 | 公司＿＿会给大家发红包。
终身 | zhōng shēn | lifelong | 一辈子 | 学习是＿＿的事。
合并 | hé bìng | to merge | 合在一起 | 这两个公司明年要＿＿。
无意 | wú yì | unintentionally | 不是故意的 | 我是＿＿说错话的，对不起。
选出 | xuǎn chū | to pick out | 挑出来 | 请你从这些词里＿＿三个。
支出 | zhī chū | expenditure | 花出去的钱 | 这个月家里的＿＿太多了。
选课 | xuǎn kè | to choose courses | 挑要上的课 | 开学的时候，学生要先＿＿。
管用 | guǎn yòng | effective | 有用 | 这个药很＿＿，吃了就好了。
`,
  },
  {
    theme: ["Personality", "性格"],
    data: `
性格 | xìng gé | personality | 一个人的脾气和做事的特点 | 他的＿＿很好，跟谁都能做朋友。 | 脾气
脾气 | pí qi | temper | 容易不容易生气的性情 | 他＿＿不好，常常生气。 | 性格
聪明 | cōng míng | clever | 头脑好，学得快 | 这个孩子很＿＿，什么都一学就会。
笨 | bèn | slow-witted | 不聪明 | 我真＿＿，这么简单的题都做错了。 | 懒
懒 | lǎn | lazy | 不爱干活 | 他很＿＿，从来不打扫房间。 | 笨
勤快 | qín kuai | diligent | 爱干活 | 她很＿＿，每天都把家里打扫得干干净净。
礼貌 | lǐ mào | politeness | 对人的尊敬和客气 | 这个孩子很有＿＿，见到人就说“您好”。
诚实 | chéng shí | honest | 说真话 | 他很＿＿，从来不说假话。 | 老实
老实 | lǎo shi | honest, well-behaved | 规矩，不说谎 | 你＿＿说，昨天晚上你去哪里了？ | 诚实
其实 | qí shí | actually | 事实上 | 他看起来很年轻，＿＿已经五十岁了。
`,
  },
  {
    theme: ["Good and Bad Points", "优点和缺点"],
    data: `
优点 | yōu diǎn | strong point | 好的地方 | 他的＿＿是做事很认真。 | 特点 缺点
缺点 | quē diǎn | shortcoming | 不好的地方 | 他的＿＿是做事太慢。 | 特点 优点
特别 | tè bié | especially | 跟一般的不一样 | 今天＿＿冷，多穿点衣服。
特点 | tè diǎn | feature | 不一样的地方 | 这个地方的菜有什么＿＿？ | 优点 缺点
一般 | yī bān | generally | 通常 | 我＿＿晚上十一点睡觉。
普通 | pǔ tōng | ordinary | 一般，不特别 | 他只是一个＿＿的工人。 | 一般
通过 | tōng guò | to pass | 经过，达到 | 他＿＿了这次考试。
其他 | qí tā | other | 别的 | 我只吃了一个，＿＿的都给你。
其中 | qí zhōng | among them | 那里面 | 我们班有三十个学生，＿＿有十个是男生。
好极了 | hǎo jí le | excellent | 非常好 | 你说得＿＿！
`,
  },
  {
    theme: ["Kind and Brave", "友善和勇敢"],
    data: `
友善 | yǒu shàn | friendly | 对人和气 | 这里的人很＿＿，常常帮助我们。
耐心 | nài xīn | patience | 不急不烦的性情 | 老师很有＿＿，讲了一遍又一遍。
烦 | fán | annoyed | 心里不痛快 | 别说了，我现在心里很＿＿。
骄傲 | jiāo ào | arrogant; proud | 自以为了不起；自豪 | 他考了第一，有点＿＿了。
勇敢 | yǒng gǎn | brave | 不怕危险 | 他很＿＿，什么都不怕。
敢 | gǎn | to dare | 有胆量 | 我不＿＿一个人晚上出门。
粗心 | cū xīn | careless | 不仔细 | 他太＿＿了，又把名字写错了。 | 细心
细心 | xì xīn | careful | 做事仔细 | 她做事很＿＿，从来不出错。 | 粗心 负责 耐心
负责 | fù zé | responsible | 认真担当 | 他工作很＿＿，大家都放心。
责任 | zé rèn | responsibility | 应该做好的事 | 做好自己的工作是每个人的＿＿。
`,
  },
  {
    theme: ["Doing Things Well", "把事做好"],
    data: `
通红 | tōng hóng | very red | 很红很红 | 他喝了酒，脸＿＿。
优美 | yōu měi | graceful | 好看，美 | 这里的风景十分＿＿。
缺少 | quē shǎo | to lack | 不够，没有 | 这里＿＿水，草都黄了。
特色 | tè sè | special feature | 特别的地方 | 这家饭馆的菜很有＿＿。
普遍 | pǔ biàn | widespread | 到处都有 | 现在用手机上网已经很＿＿了。
通常 | tōng cháng | usually | 一般情况下 | 我＿＿七点起床。
极 | jí | extremely | 非常 | 这个电影好看＿＿了。
勇气 | yǒng qì | courage | 不怕的力量 | 他没有＿＿跟她说话。
实话 | shí huà | the truth | 真话 | 你跟我说＿＿，你为什么不高兴？
心细 | xīn xì | attentive | 想事情周到 | 她很＿＿，什么都想到了。
`,
  },
  {
    theme: ["What Is Real", "真实"],
    data: `
个性 | gè xìng | individuality | 跟别人不一样的性格 | 她很有＿＿，穿衣服跟别人都不一样。
性别 | xìng bié | sex, gender | 男或女 | 请在这里写上你的名字和＿＿。
实在 | shí zài | really | 的确 | 我＿＿太累了，想休息一下。
事实 | shì shí | fact | 真有的事 | 你说的不是＿＿，是你想出来的。 | 现实
真实 | zhēn shí | true, real | 跟事实一样 | 这个电影讲的是一个＿＿的故事。
现实 | xiàn shí | realistic | 合乎现在真有的情况 | 你的计划很好，但是不太＿＿。 | 实用
实用 | shí yòng | practical | 有用 | 这个包不好看，但是很＿＿。 | 个性
不敢 | bù gǎn | not to dare | 没有胆量 | 他＿＿一个人睡觉，要开着灯。
负担 | fù dān | burden | 承受的压力 | 孩子的作业太多，＿＿太重了。
任务 | rèn wu | task | 要做的工作 | 老师给了我们一个新＿＿。
`,
  },
  {
    theme: ["More Character Words", "再说性格"],
    data: `
心烦 | xīn fán | upset | 心里不痛快 | 工作做不完，他很＿＿。
耐用 | nài yòng | durable | 能用很久 | 这双鞋很＿＿，穿了三年还很好。
粗 | cū | thick | 一圈很大 | 这支笔太＿＿了，写出来的字不好看。 | 细
细 | xì | thin | 一圈很小 | 这条线太＿＿了，看不清楚。 | 粗
特意 | tè yì | specially | 专门为某事 | 我＿＿来看你。
极少 | jí shǎo | very few, seldom | 非常少 | 这里冬天＿＿下雪。
优先 | yōu xiān | to have priority | 放在别人前面 | 老人和孩子可以＿＿上车。
通知 | tōng zhī | to notify | 告诉 | 明天不上课，请你＿＿大家。
其次 | qí cì | secondly | 第二 | 学中文，发音最重要，＿＿是汉字。
实力 | shí lì | strength | 真正的能力 | 他们队的＿＿很好，每次比赛都赢。
`,
  },
  {
    theme: ["Doing One's Part", "尽责"],
    data: `
担任 | dān rèn | to hold (a post) | 当，做 | 他在公司＿＿经理。
责怪 | zé guài | to blame | 说别人的错 | 这不是你的错，没有人会＿＿你。
负 | fù | to lose (a match) | 比赛没有赢 | 我们队二比三＿＿了。
通 | tōng | to get through | 没有阻碍 | 电话打不＿＿，他可能关机了。
特 | tè | very (spoken) | 非常（口语） | 今天＿＿热，我不想出门。 | 极其
普通话 | pǔ tōng huà | Mandarin | 中国通用的语言 | 他说的＿＿很好，听不出他是南方人。
粗细 | cū xì | thickness | 粗和细的程度 | 这两支笔的＿＿不一样。
细小 | xì xiǎo | tiny | 很小 | 这些＿＿的问题也要想到。
敢于 | gǎn yú | to dare to | 有勇气去做 | 他＿＿说出自己的意见。
极其 | jí qí | most, extremely | 程度非常高 | 这件事＿＿重要，你一定要记住。
`,
  },
  {
    theme: ["Being Honest", "真诚"],
    data: `
诚心 | chéng xīn | sincerely | 真心 | 我是＿＿想帮你的。 | 真诚
真诚 | zhēn chéng | genuine | 真心实意 | 他对朋友很＿＿，说的都是心里话。 | 诚心
外貌 | wài mào | appearance | 长相 | 不要只看一个人的＿＿。
笨重 | bèn zhòng | heavy and clumsy | 又大又重 | 这张桌子太＿＿了，一个人搬不动。
懒得 | lǎn de | not to feel like | 不想做 | 天太冷了，我＿＿出门。
不耐烦 | bù nài fán | impatient | 很烦，等不了 | 他等了很久，有点＿＿了。
善于 | shàn yú | to be good at | 很会做 | 她很＿＿跟人聊天。
格外 | gé wài | especially | 和平常不一样地 | 下过雪以后，空气＿＿新鲜。
实现 | shí xiàn | to come true | 成为事实 | 他的愿望终于＿＿了。
粗心大意 | cū xīn dà yì | careless | 做事不仔细 | 他做事＿＿，常常忘记带东西。
`,
  },
  {
    theme: ["Getting to Know People", "认识别人"],
    data: `
交流 | jiāo liú | to communicate | 互相说想法 | 我常常用中文和同学＿＿。 | 联系
互相 | hù xiāng | each other | 彼此 | 我们是好朋友，常常＿＿帮助。
了解 | liǎo jiě | to know well | 知道得清楚 | 我跟他不熟，不太＿＿他。 | 理解
理解 | lǐ jiě | to understand (someone) | 懂得别人的想法 | 我＿＿你的心情，换了我也会生气。 | 了解
尊重 | zūn zhòng | to respect | 尊敬，看重 | 我们要＿＿别人的意见。 | 理解
原谅 | yuán liàng | to forgive | 不再责怪 | 对不起，请你＿＿我。 | 理解
误会 | wù huì | to misunderstand | 理解错了别人的意思 | 你＿＿了，我不是这个意思。
联系 | lián xì | to contact | 跟人接上关系 | 到了北京以后，请跟我＿＿。
约会 | yuē huì | date, appointment | 约定的见面 | 今天晚上我有一个＿＿，不能和你吃饭了。
邀请 | yāo qǐng | to invite | 请人来 | 他＿＿我去他家吃饭。
`,
  },
  {
    theme: ["Family", "家人"],
    data: `
熟悉 | shú xī | familiar | 知道得很清楚 | 我刚来这里，对这里还不＿＿。
夫妻 | fū qī | husband and wife | 结了婚的两个人 | 他们是一对＿＿，结婚十年了。
妻子 | qī zi | wife | 结了婚的女子 | 他的＿＿是一名医生，他们结婚五年了。 | 夫人
父母 | fù mǔ | parents | 爸爸和妈妈 | 我的＿＿都是老师。 | 亲戚
父亲 | fù qīn | father | 爸爸 | 我的＿＿和母亲结婚二十年了。 | 母亲
母亲 | mǔ qīn | mother | 妈妈 | 他小时候，＿＿每天给他做饭，送他去上学。 | 父亲
叔叔 | shū shu | uncle | 爸爸的弟弟 | 爸爸的弟弟，我叫他＿＿。
阿姨 | ā yí | aunt; auntie | 妈妈的姐妹 | 妈妈的妹妹，我叫她＿＿。
亲戚 | qīn qi | relatives | 家里以外的亲人 | 过年的时候，叔叔、阿姨这些＿＿都来我家吃饭。
夫人 | fū rén | Mrs, madam | 对别人妻子的尊称 | 这是张先生的＿＿，他们结婚十年了。 | 妻子
`,
  },
  {
    theme: ["Friends and Quarrels", "朋友和吵架"],
    data: `
伙伴 | huǒ bàn | partner | 一起做事的人 | 他是我从小一起长大的＿＿。
小伙子 | xiǎo huǒ zi | young man | 年轻的男子 | 那个＿＿才二十岁，力气很大。
吵架 | chǎo jià | to quarrel | 大声地争 | 他们两个又＿＿了，谁也不理谁。 | 打架
吵 | chǎo | noisy | 声音大，乱 | 外面太＿＿了，我睡不着。
道歉 | dào qiàn | to apologize | 说对不起 | 你做错了，应该跟他＿＿。
安慰 | ān wèi | to comfort | 让别人心里好受 | 他很难过，我们去＿＿一下他吧。 | 陪
陪 | péi | to accompany | 跟别人在一起 | 今天我＿＿妈妈去医院。
照顾 | zhào gù | to take care of | 照看 | 妈妈病了，我在家＿＿她。 | 陪
顾客 | gù kè | customer | 来买东西的人 | 这家店的＿＿很多。
打架 | dǎ jià | to fight | 动手打人 | 两个孩子在学校＿＿，老师很生气。 | 吵架
`,
  },
  {
    theme: ["Sorting Things Out", "解决问题"],
    data: `
交给 | jiāo gěi | to hand to | 给 | 请把作业＿＿老师。
交换 | jiāo huàn | to exchange | 互相换 | 我们＿＿一下电话号码吧。
互联网 | hù lián wǎng | the Internet | 全世界连在一起的网 | 现在很多人在＿＿上买东西。
解决 | jiě jué | to solve | 处理好 | 这个问题很难＿＿。
原来 | yuán lái | so it turns out | 发现了真的情况 | ＿＿是你！我还以为是谁呢。
原因 | yuán yīn | cause | 为什么会这样 | 他迟到的＿＿是路上车太多。
错误 | cuò wù | mistake | 不对的地方 | 这个句子有一个＿＿。
联合 | lián hé | to unite | 合在一起 | 两个学校＿＿起来办了一个比赛。
大约 | dà yuē | about | 大概 | 从这里到学校＿＿要十分钟。
约 | yuē | to arrange (to meet) | 事先说定 | 我＿＿了朋友明天一起去爬山。
`,
  },
  {
    theme: ["Close to Me", "亲近的人"],
    data: `
熟人 | shú rén | acquaintance | 认识的人 | 在这里我没有＿＿，谁也不认识。
熟练 | shú liàn | skilled | 做得很熟 | 他开车很＿＿，开了二十年了。
成熟 | chéng shú | mature | 想事情像大人 | 他才十五岁，但是很＿＿。
亲人 | qīn rén | family members | 有血统关系的人 | 春节的时候，大家都想和＿＿在一起。
亲自 | qīn zì | in person | 自己去做 | 这件事很重要，我要＿＿去办。 | 亲手 亲眼
亲手 | qīn shǒu | with one's own hands | 用自己的手 | 这个蛋糕是我＿＿做的。 | 亲自
亲眼 | qīn yǎn | with one's own eyes | 用自己的眼睛 | 我＿＿看见他拿了那本书。 | 亲自
陪伴 | péi bàn | to keep company | 陪着 | 谢谢你一直＿＿我。
同伴 | tóng bàn | companion | 一起的人 | 他和＿＿们一起去爬山了。
舞伴 | wǔ bàn | dance partner | 一起跳舞的人 | 她是我的＿＿，我们一起跳了三年舞。
`,
  },
  {
    theme: ["Mistakes and Apologies", "误会和道歉"],
    data: `
误解 | wù jiě | to misread (someone) | 理解得不对 | 你＿＿了我的意思。
解开 | jiě kāi | to untie | 打开 | 请帮我＿＿这个结。
相互 | xiāng hù | mutual | 你和我之间 | 好朋友要＿＿帮助。
互助 | hù zhù | mutual help | 互相帮助 | 邻居们常常＿＿，关系很好。
自尊 | zì zūn | self-respect | 尊重自己 | 不要在大家面前说他，他很有＿＿心。
原地 | yuán dì | the same spot | 原来的地方 | 别走开，在＿＿等我。
约定 | yuē dìng | to agree on | 事先说好 | 我们＿＿明天早上八点见面。 | 约好
约好 | yuē hǎo | to have arranged | 已经说定 | 我们已经＿＿了，明天三点见面。 | 约定
歉意 | qiàn yì | regret | 对不起的心意 | 他一次又一次地说对不起，＿＿很真诚。
联系人 | lián xì rén | contact person | 有事时找的人 | 有问题请找＿＿张先生。
`,
  },
  {
    theme: ["Family Words", "家人的称呼"],
    data: `
父子 | fù zǐ | father and son | 父亲和儿子 | 这对＿＿常常一起去踢球。 | 母子 父女
母子 | mǔ zǐ | mother and son | 母亲和儿子 | 这对＿＿感情很好，儿子常常回家看妈妈。 | 父子 父女
母语 | mǔ yǔ | mother tongue | 从小说的语言 | 我是在中国长大的，我的＿＿是中文。
大叔 | dà shū | uncle (to an older man) | 对中年男子的称呼 | 路边有一个＿＿在卖水果。
亲爱 | qīn ài | dear | 很爱的 | ＿＿的妈妈，祝你生日快乐！
父女 | fù nǚ | father and daughter | 父亲和女儿 | 这对＿＿一起去旅行了，女儿很高兴。 | 父子 母子
书架 | shū jià | bookshelf | 放书的架子 | 请把这本书放回＿＿上。
顾 | gù | to attend to | 照看 | 他只＿＿着玩，忘了做作业。
交朋友 | jiāo péng you | to make friends | 和别人成为朋友 | 他喜欢＿＿，认识很多人。
互动 | hù dòng | to interact | 互相影响 | 上课的时候，老师常常和学生＿＿。 | 交朋友
`,
  },
  {
    theme: ["Living Together", "相处"],
    data: `
交往 | jiāo wǎng | to associate with | 跟人来往 | 我和他＿＿了很多年，他是个好人。
陪同 | péi tóng | to accompany | 陪着一起去 | 经理＿＿客人参观了公司。
不顾 | bù gù | regardless of | 不管 | 他＿＿大家反对，一个人去了。
回顾 | huí gù | to look back | 回头想过去的事 | ＿＿这一年，我们做了很多事。
交通 | jiāo tōng | traffic | 车和路的情况 | 这个城市的＿＿很方便。
联网 | lián wǎng | to connect to a network | 接上网 | 电脑没有＿＿，什么网站也打不开。
熟 | shú | cooked | 做好了，能吃了 | 饭还没＿＿，再等一会儿。
误 | wù | to miss | 因为晚了没赶上 | 快点走，别＿＿了火车。
吵醒 | chǎo xǐng | to wake with noise | 用声音把人弄醒 | 外面的声音把我＿＿了。
慰问 | wèi wèn | to visit and comfort | 去看望并问好 | 新年的时候，经理去医院＿＿生病的同事。
`,
  },
  {
    theme: ["At School", "在学校"],
    data: `
教育 | jiào yù | education | 培养和教导 | 父母都很重视孩子的＿＿。 | 成绩
教室 | jiào shì | classroom | 上课的房间 | 下课了，学生们都走出了＿＿。
教师 | jiào shī | teacher | 老师 | 他是一名中学＿＿。
答案 | dá àn | answer | 问题的解答 | 这个问题的＿＿是什么？ | 回答
回答 | huí dá | to answer | 对问题说出意见 | 老师问了一个问题，没有人能＿＿。 | 答案
成绩 | chéng jì | grades, results | 学习的结果 | 他学习很努力，＿＿一直很好。
及格 | jí gé | to pass (a test) | 达到最低标准 | 这次考试我没有＿＿，只得了五十分。
试卷 | shì juàn | exam paper | 考试用的卷子 | 考试结束了，请把＿＿交上来。
年级 | nián jí | grade, year | 学校里按年分的级 | 我弟弟上小学三＿＿。
历史 | lì shǐ | history | 过去的事 | 北京有三千多年的＿＿。
`,
  },
  {
    theme: ["Learning", "学习"],
    data: `
教学 | jiào xué | teaching | 教书的工作 | 这个学校很重视＿＿，老师都很好。
答应 | dā ying | to promise | 同意别人的要求 | 他＿＿了我，明天陪我去医院。
答题 | dá tí | to answer questions | 回答考试里的问题 | 考试的时候，要认真＿＿。
及时 | jí shí | in time | 正好在需要的时候 | 你来得很＿＿，我正想找人帮忙。
以及 | yǐ jí | as well as | 和 | 桌子上有书、笔＿＿很多纸。
卷子 | juàn zi | test paper | 考试用的纸 | 老师正在看我们的＿＿。
级 | jí | level | 等次 | 他已经通过了中文三＿＿考试。
经历 | jīng lì | experience | 经过的事 | 这次旅行是一次难忘的＿＿。
数学 | shù xué | mathematics | 研究数和形的学科 | 我的＿＿很好，考试常常得满分。
专心 | zhuān xīn | attentive | 心思集中 | 上课的时候要＿＿听讲。
`,
  },
  {
    theme: ["Subjects", "学科"],
    data: `
科学 | kē xué | science | 研究自然的学问 | 他很喜欢＿＿，常常看关于动物和星星的书。
学科 | xué kē | subject | 学习的科目 | 数学是一门很重要的＿＿。
研究 | yán jiū | to research | 深入探求 | 他在大学＿＿中国历史。
研究生 | yán jiū shēng | graduate student | 读硕士或博士的学生 | 他大学毕业以后，又当了三年＿＿。
毕业 | bì yè | to graduate | 学完 | 他明年大学＿＿。
专业 | zhuān yè | major | 在大学学的方向 | 你在大学学的是什么＿＿？
专门 | zhuān mén | specially | 只为某事 | 这是＿＿给孩子们看的书。
奖 | jiǎng | prize | 为了鼓励给的东西 | 他唱歌得了一个大＿＿。
申请 | shēn qǐng | to apply | 向上提出请求 | 他想＿＿去中国的大学学习。
掌握 | zhǎng wò | to master | 学会，会用 | 学了一年，他已经＿＿了三千个汉字。
`,
  },
  {
    theme: ["Numbers and Prizes", "数字和奖"],
    data: `
数字 | shù zì | number, digit | 表示数目的字 | 请用＿＿写，不要用汉字。
分数 | fēn shù | score | 考试得的分 | 这次考试的＿＿出来了，我考了九十分。
人数 | rén shù | number of people | 人的多少 | 我们班的＿＿是三十个。
次数 | cì shù | number of times | 做了几次 | 他去中国的＿＿很多。
毕业生 | bì yè shēng | graduate | 毕业的学生 | 今年这个大学有五千名＿＿。
申请人 | shēn qǐng rén | applicant | 提出请求的人 | 这次有一百个＿＿，只能选十个。
得奖 | dé jiǎng | to win a prize | 得到奖 | 这次比赛，我们班有三个人＿＿了。
研究所 | yán jiū suǒ | research institute | 做研究的地方 | 他大学毕业以后，在一个＿＿工作。
握手 | wò shǒu | to shake hands | 两人手拿在一起 | 见面的时候，他们＿＿问好。
答复 | dá fù | reply | 对问题或要求的回答 | 我们会在三天以内给你＿＿。
`,
  },
  {
    theme: ["Remembering", "记忆"],
    data: `
回忆 | huí yì | to recall | 回想过去 | 他常常＿＿小时候的事。
记忆 | jì yì | memory | 记住的事 | 爷爷老了，很多事都想不起来了，＿＿不太好了。
背 | bèi | to learn by heart | 凭记忆读出 | 老师让我们把这些生词＿＿下来，明天不看书说给他听。 | 抄
抄 | chāo | to copy | 照着写 | 不要＿＿别人的作业。 | 背
抄写 | chāo xiě | to copy out | 照着写一遍 | 请照着书把这十个生词＿＿三遍。 | 抄
翻译 | fān yì | to translate | 把一种语言换成另一种 | 请你把这句话＿＿成中文。
翻 | fān | to turn (pages) | 反过来 | 请大家把书＿＿到第十页。
解释 | jiě shì | to explain | 说明原因或意思 | 这个词是什么意思？请你＿＿一下。 | 翻译
例子 | lì zi | example | 用来说明的事 | 你能给我说一个＿＿吗？
例如 | lì rú | for example | 比如 | 我喜欢很多水果，＿＿苹果和西瓜。
`,
  },
  {
    theme: ["Texts", "文章"],
    data: `
一段 | yī duàn | a period of | 一部分 | 我在北京住过＿＿时间。
篇 | piān | (measure word for essays) | 用于文章 | 他写了一＿＿作文。 | 段
段 | duàn | paragraph | 文章的一部分 | 请大家读第二＿＿。 | 篇
背后 | bèi hòu | behind one's back | 后面，别人看不到的地方 | 不要在＿＿说别人。
背包 | bēi bāo | backpack | 背在身上的包 | 他带着一个大＿＿去旅行。
翻开 | fān kāi | to open (a book) | 打开 | 请＿＿书，看第五页。
专家 | zhuān jiā | expert | 很懂某方面的人 | 他是研究中国历史的＿＿。
科目 | kē mù | subject (in a test) | 考试的课 | 这次考试有五个＿＿。
毕竟 | bì jìng | after all | 到底 | 他＿＿还是个孩子，别怪他。
专题 | zhuān tí | special topic | 专门的题目 | 今天的课讲了一个＿＿：中国的春节。
`,
  },
  {
    theme: ["Levels", "等级"],
    data: `
高级 | gāo jí | advanced | 程度高的 | 他在学＿＿中文课，很难。 | 中级
中级 | zhōng jí | intermediate | 中间的等级 | 我学了两年中文，现在上＿＿班。 | 高级
教练 | jiào liàn | coach | 教运动的人 | 我们足球队的＿＿每天都带我们练习。
例外 | lì wài | exception | 不在一般情况里的 | 大家都要参加，谁也不能＿＿。
数码 | shù mǎ | digital | 用数字的 | 这是我新买的＿＿相机。
教书 | jiāo shū | to teach (at school) | 当老师 | 他在中学＿＿，已经二十年了。
记忆力 | jì yì lì | memory (the ability) | 记东西的能力 | 他的＿＿很好，什么都记得。
掌声 | zhǎng shēng | applause | 拍手的声音 | 他唱完歌，大家给了他热情的＿＿。
专长 | zhuān cháng | special skill | 特别会的本领 | 他的＿＿是唱歌。
示意 | shì yì | to signal | 用动作告诉别人自己想要的 | 老师用手＿＿我们坐下。
`,
  },
  {
    theme: ["Explaining", "讲解"],
    data: `
解答 | jiě dá | to answer, to solve | 解释并回答 | 老师＿＿了我们的问题。 | 讲解
例句 | lì jù | example sentence | 用来说明词语的句子 | 每个生词后面都有一个＿＿。
翻页 | fān yè | to turn the page | 翻到下一页 | 看完这一页，请＿＿。
答对 | dá duì | to answer correctly | 回答得对 | 这个问题你＿＿了！
讲解 | jiǎng jiě | to explain | 讲明白 | 老师＿＿得很清楚，大家都听懂了。 | 解答
学历 | xué lì | education level | 学习的经历 | 他的＿＿很高，是大学毕业的。
论文 | lùn wén | thesis, paper | 研究文章 | 他正在写毕业＿＿。
级别 | jí bié | rank, level | 高低的等次 | 他在公司里的＿＿很高。
科学家 | kē xué jiā | scientist | 研究科学的人 | 他长大以后想当一名＿＿。
专用 | zhuān yòng | for special use | 只给某种人用 | 这个房间是老师＿＿的，学生不能进去。
`,
  },
  {
    theme: ["Growing Up", "成长"],
    data: `
答卷 | dá juàn | answer sheet | 写了答案的卷子 | 考完了，请把＿＿交给老师。
得分 | dé fēn | to score | 得到分数 | 这场比赛他＿＿最多。
握 | wò | to hold | 用手拿住 | 他紧紧地＿＿着我的手。
体育 | tǐ yù | physical education | 锻炼身体的课和运动 | 我最喜欢上＿＿课，可以踢球。
数不清 | shǔ bu qīng | countless | 非常多 | 天上的星星多得＿＿。
发育 | fā yù | to grow (in body) | 身体长大 | 这个孩子＿＿得很好，长得很高。
背景 | bèi jǐng | background | 后面的景物 | 这张照片的＿＿是长城。
及早 | jí zǎo | as early as possible | 趁早 | 有病要＿＿去看医生。
历史书 | lì shǐ shū | history book | 讲历史的书 | 他很喜欢看＿＿，知道很多过去的事。
专车 | zhuān chē | special car | 专门的车 | 公司有＿＿送我们去机场。
`,
  },
  {
    theme: ["Hiring", "招聘"],
    data: `
经验 | jīng yàn | experience | 从做事中得到的知识 | 他做这个工作已经十年了，很有＿＿。
招聘 | zhāo pìn | to recruit | 公开找人来工作 | 我们公司正在＿＿新员工。 | 聘请
工资 | gōng zī | wages | 工作得到的钱 | 他的＿＿不高，一个月三千块。
资料 | zī liào | materials, data | 用来参考的东西 | 我在网上找了很多＿＿。
老板 | lǎo bǎn | boss | 公司或商店的主人 | 这家饭馆的＿＿人很好。 | 领导
领导 | lǐng dǎo | leader | 带领大家的人 | 这件事要问一下我们的＿＿。 | 老板
聘请 | pìn qǐng | to engage | 请人来工作 | 公司＿＿了三个外国专家。 | 招聘
赚钱 | zhuàn qián | to earn money | 得到钱 | 他想多＿＿，给父母买一个大房子。
退休 | tuì xiū | to retire | 老了不再工作 | 爷爷六十岁就＿＿了。
签字 | qiān zì | to sign | 写上自己的名字 | 请在这里＿＿。
`,
  },
  {
    theme: ["At Work", "工作中"],
    data: `
检验 | jiǎn yàn | to inspect | 检查看对不对 | 这些产品要先＿＿，才能卖。
实验 | shí yàn | experiment | 为了证明而做的试 | 我们今天在科学课上做了一个＿＿。
考验 | kǎo yàn | trial, test | 用难事来试 | 这次比赛对我们是一个很大的＿＿。
招手 | zhāo shǒu | to wave | 举手摇动 | 他在马路对面跟我＿＿。
黑板 | hēi bǎn | blackboard | 教室里写字的板 | 老师在＿＿上写了几个字。
带领 | dài lǐng | to lead | 在前面带着 | 老师＿＿学生们参观了工厂。
导游 | dǎo yóu | tour guide | 带人游览的人 | ＿＿带我们去了很多景点。
退 | tuì | to return (goods) | 还回去 | 这件衣服太小了，我想＿＿了。
签名 | qiān míng | to autograph | 亲手写名字 | 那个歌手给我＿＿了。
签证 | qiān zhèng | visa | 去别的国家要办的证件 | 去中国以前，我要先办＿＿。
`,
  },
  {
    theme: ["Products", "产品"],
    data: `
客户 | kè hù | client | 买东西或服务的人 | 他每天都要给很多＿＿打电话。 | 用户
用户 | yòng hù | user | 使用东西的人 | 这个网站有一千万＿＿。 | 客户
销售 | xiāo shòu | sales | 卖东西 | 他在公司做＿＿工作。 | 生产
生产 | shēng chǎn | to produce | 做出东西 | 这个工厂每天＿＿一千辆自行车。
产品 | chǎn pǐn | product | 做出来的东西 | 这家公司的＿＿质量很好。
质量 | zhì liàng | quality | 好坏的程度 | 这双鞋很便宜，＿＿也很好。
数量 | shù liàng | quantity | 多少 | 今年来这里旅游的人，＿＿比去年多。
价格 | jià gé | price | 东西值的钱 | 这里的东西＿＿很便宜。
值得 | zhí de | to be worth | 有价值 | 这本书很好，＿＿一看。
技术 | jì shù | technique | 做事的本领和方法 | 他的开车＿＿很好。
`,
  },
  {
    theme: ["Companies", "企业"],
    data: `
科技 | kē jì | science and technology | 科学和技术 | 有了＿＿，我们在家里也能看到全世界。
国际 | guó jì | international | 国家和国家之间 | 这是一个＿＿比赛，有很多国家的选手参加。
实际 | shí jì | reality | 真实的情况 | 他看起来很年轻，＿＿上已经五十岁了。
企业 | qǐ yè | enterprise | 公司 | 他在一家大＿＿工作。 | 工厂
工厂 | gōng chǎng | factory | 做东西的地方 | 他爸爸在＿＿里工作，每天做自行车。 | 企业
材料 | cái liào | material | 做东西用的东西 | 做这个桌子要用什么＿＿？
制造 | zhì zào | to manufacture | 做出东西 | 这辆车是中国＿＿的。 | 设计
设计 | shè jì | to design | 事先想好怎么做 | 这件衣服是她自己＿＿的。
效果 | xiào guǒ | effect | 产生的结果 | 这个药的＿＿很好，吃了就不疼了。
效率 | xiào lǜ | efficiency | 做事的快慢 | 他工作的＿＿很高，一天能做完两天的事。
`,
  },
  {
    theme: ["Making Things", "做东西"],
    data: `
有效 | yǒu xiào | valid | 有作用 | 这张票一年以内＿＿。
制作 | zhì zuò | to make | 做 | 这个蛋糕是他亲手＿＿的。
制定 | zhì dìng | to draw up | 定出 | 公司＿＿了明年的计划。
设备 | shè bèi | equipment | 用的机器 | 这个医院的＿＿很新。
产生 | chǎn shēng | to give rise to | 出现 | 他们两个人＿＿了误会。
作品 | zuò pǐn | work (of art) | 做出来的书、画等 | 这是他最有名的＿＿。
物品 | wù pǐn | article, item | 东西 | 请带好自己的＿＿下车。
礼品 | lǐ pǐn | gift | 送人的东西 | 这家店卖很多＿＿，过节的时候人很多。
大量 | dà liàng | a large amount | 很多 | 这个工厂每天用＿＿的水。
技术员 | jì shù yuán | technician | 做技术工作的人 | 他是工厂的＿＿，有技术问题都找他。
`,
  },
  {
    theme: ["Prices and Value", "价格和价值"],
    data: `
价钱 | jià qian | price | 东西卖多少钱 | 这件衣服的＿＿是多少？ | 价值
物价 | wù jià | prices (of goods) | 东西的价格 | 这几年＿＿高了很多。
半价 | bàn jià | half price | 原来价格的一半 | 今天商店里的衣服都是＿＿。
讲价 | jiǎng jià | to bargain | 跟卖东西的人说便宜点 | 在市场买东西可以＿＿。
价值 | jià zhí | value | 有用的程度 | 这本书很有＿＿。
值班 | zhí bān | to be on duty | 轮到上班 | 今天晚上我＿＿，不能回家。
技能 | jì néng | skill | 做事的本领 | 学会一门＿＿很重要。
美术 | měi shù | fine arts | 画画等艺术 | 他在＿＿馆看了很多有名的作品。
交际 | jiāo jì | social contact | 跟人来往 | 他很会＿＿，朋友很多。
厂长 | chǎng zhǎng | factory director | 工厂的领导 | 他是这个工厂的＿＿。
`,
  },
  {
    theme: ["Results", "结果"],
    data: `
造成 | zào chéng | to cause | 引起 | 大雨＿＿了很多问题。
造句 | zào jù | to make a sentence | 用词说句子 | 请用“值得”＿＿。
假设 | jiǎ shè | to suppose | 先当作是这样 | ＿＿明天下雨，我们怎么办？
身材 | shēn cái | figure | 身体的样子 | 她的＿＿很好，又高又瘦。
教材 | jiào cái | textbook | 上课用的书 | 这本中文＿＿很有意思。
导演 | dǎo yǎn | (film) director | 拍电影时安排演员怎么演的人 | 这个电影的＿＿很有名。
制服 | zhì fú | uniform | 规定穿的衣服 | 学生们都穿着学校的＿＿。
退出 | tuì chū | to withdraw | 离开 | 他身体不舒服，＿＿了比赛。
领 | lǐng | to receive | 取 | 每个月十号＿＿工资。
工作量 | gōng zuò liàng | workload | 工作的多少 | 这个月的＿＿太大了，每天都要加班。
`,
  },
  {
    theme: ["Strength and Skill", "力量和技术"],
    data: `
力量 | lì liàng | strength | 力气 | 大家一起努力，＿＿就大了。
尽量 | jǐn liàng | as far as possible | 力求多 | 我会＿＿早点回来。
手术 | shǒu shù | operation | 医生在身体上做的治疗 | 医生给他做了一个小＿＿。
体质 | tǐ zhì | constitution | 身体的情况 | 他的＿＿很好，很少生病。
产地 | chǎn dì | place of origin | 出产的地方 | 这些苹果的＿＿是山东。
出产 | chū chǎn | to produce (naturally) | 生产出来 | 这个地方＿＿很好的茶。
售票 | shòu piào | to sell tickets | 卖票 | 火车站的＿＿处在哪里？
出售 | chū shòu | to offer for sale | 卖出 | 这个房子现在＿＿，你想买吗？
签约 | qiān yuē | to sign a contract | 签合同 | 他和这家公司＿＿了，下个月就去上班。
设计师 | shè jì shī | designer | 做设计的人 | 她是一名衣服＿＿。
`,
  },
  {
    theme: ["Doing Business", "做生意"],
    data: `
招 | zhāo | to recruit | 找人来 | 我们饭馆要＿＿两个服务员。
签 | qiān | to sign | 写上名字 | 请你在这里＿＿上你的名字。
领先 | lǐng xiān | to be ahead | 走在前面 | 比赛快结束了，我们队还＿＿。
退还 | tuì huán | to give back | 还给 | 买的东西有问题，可以＿＿。
合同 | hé tong | contract | 双方约定的文件 | 两个公司签了＿＿。
资格 | zī gé | qualification | 做某事要有的条件 | 他有＿＿参加这次比赛。
产量 | chǎn liàng | output | 生产的数量 | 今年这个工厂的＿＿比去年多。
商品 | shāng pǐn | goods | 卖的东西 | 这家商店的＿＿很多，什么都有。
地板 | dì bǎn | floor | 房间的地面 | 他把＿＿打扫得很干净。
实际上 | shí jì shang | in fact | 其实 | 他说他很忙，＿＿他在家看电视。
`,
  },
  {
    theme: ["Society", "社会"],
    data: `
社会 | shè huì | society | 人们在一起生活的整体 | 大学毕业以后，他要到＿＿上去工作了。
社区 | shè qū | community | 人们住在一起的一个区 | 我们＿＿里有一个小公园。
人民 | rén mín | the people | 一个国家的老百姓 | 政府要为＿＿做事。 | 市民 居民 农民
农民 | nóng mín | farmer | 在地里工作的人 | 他爷爷是＿＿，每天在地里工作。
市民 | shì mín | city resident | 住在城市里的人 | 这个城市的＿＿都很喜欢这个公园。 | 居民 人民
居民 | jū mín | resident | 住在一个地方的人 | 这个楼里的＿＿都认识他。 | 市民 人民
政府 | zhèng fǔ | government | 管理国家的机关 | ＿＿决定在这里开一个新公园。
法律 | fǎ lǜ | law | 国家的规定 | 国家的＿＿，每个人都要守。
律师 | lǜ shī | lawyer | 帮人打官司的人 | 他是一名＿＿，常常去法院。
警察 | jǐng chá | police | 保护人们安全的人 | 有人拿了我的钱包，我马上叫了＿＿。
`,
  },
  {
    theme: ["Rules", "规则"],
    data: `
规定 | guī dìng | regulation | 定下的要求 | 公司＿＿每天九点上班。 | 规则 安排
规则 | guī zé | rules (of a game) | 大家都要按照的标准 | 比赛有比赛的＿＿，大家都要守。 | 规定
守 | shǒu | to guard | 看护 | 他在门口＿＿着，不让别人进去。
排队 | pái duì | to line up | 一个接一个地站 | 买票的人很多，大家都在＿＿。
安排 | ān pái | to arrange | 有条理地处理 | 明天的事我已经＿＿好了。
广场 | guǎng chǎng | square | 城市里很大的空地 | 晚上很多人在＿＿上跳舞。
广告 | guǎng gào | advertisement | 介绍商品的信息 | 电视上的＿＿太多了。
公共 | gōng gòng | public | 大家的 | 在＿＿的地方不要大声说话。
共同 | gòng tóng | common, shared | 大家都有的 | 我们有很多＿＿的爱好。
座位 | zuò wèi | seat | 坐的地方 | 车上已经没有＿＿了。
`,
  },
  {
    theme: ["Traffic", "交通"],
    data: `
堵车 | dǔ chē | traffic jam | 路上车太多走不动 | 早上八点，路上常常＿＿。 | 堵
堵 | dǔ | to block | 挡住 | 门口被车＿＿住了，我出不去。
速度 | sù dù | speed | 快慢的程度 | 他开车的＿＿太快了。
高速 | gāo sù | expressway | 很快的速度；很快的路 | 我们开车走＿＿去北京，两个小时就到了。
快速 | kuài sù | rapid | 速度快 | 这个城市在＿＿地变化着。
危险 | wēi xiǎn | dangerous | 不安全 | 在马路上踢球很＿＿。
警告 | jǐng gào | to warn | 提醒注意 | 老师＿＿他，再迟到就不能上课了。
报警 | bào jǐng | to call the police | 告诉警察 | 有人在路上打架，我马上＿＿了。
减速 | jiǎn sù | to slow down | 把速度变慢 | 前面有学校，开车要＿＿。
罚 | fá | to punish | 处分 | 他开车太快，被警察＿＿了两百块钱。
`,
  },
  {
    theme: ["Towns and Villages", "城镇和乡村"],
    data: `
农业 | nóng yè | agriculture | 在地里生产吃的东西的产业 | 这个地方的人大多做＿＿，在地里工作。
农村 | nóng cūn | the countryside | 农民住的地方 | 他从小在＿＿长大。 | 乡下 城镇 村 家乡 小镇
村 | cūn | village | 农民住在一起的地方 | 这个＿＿里只有一百个人。 | 小镇 城镇
乡下 | xiāng xia | the country | 城市外面的地方 | 爷爷奶奶住在＿＿，那里空气很好。 | 农村 家乡 小镇 城镇 村
家乡 | jiā xiāng | hometown | 自己出生长大的地方 | 我的＿＿在南方，冬天不太冷。
城镇 | chéng zhèn | towns | 城市和镇 | 很多农村的人去＿＿里工作。 | 小镇
小镇 | xiǎo zhèn | small town | 小的镇 | 他住在山边的一个＿＿上。
经济 | jīng jì | economy | 国家的生产和花钱的情况 | 这几年这个国家的＿＿很好。
富 | fù | rich | 钱多 | 他家很＿＿，有三个房子。
增加 | zēng jiā | to increase | 变多 | 今年学中文的人＿＿了很多。
`,
  },
  {
    theme: ["More and Less", "增和减"],
    data: `
减少 | jiǎn shǎo | to decrease | 变少 | 以前骑车的人很多，现在＿＿了。 | 下降
下降 | xià jiàng | to fall | 往下落，变低 | 天冷了，气温＿＿了很多。 | 降低 减少
降低 | jiàng dī | to lower | 使变低 | 商店＿＿了价格，买的人多了。 | 下降
增长 | zēng zhǎng | to grow | 增加，变大 | 这几年，城市变大了，人口＿＿得很快。 | 增多
增多 | zēng duō | to become more | 变多 | 到了春天，来公园的人＿＿了。 | 增长
减轻 | jiǎn qīng | to ease | 变轻 | 吃了药以后，他的病＿＿了。
降温 | jiàng wēn | (temperature) to drop | 温度变低 | 明天要＿＿了，多穿点衣服。
加速 | jiā sù | to speed up | 让速度变快 | 车子＿＿开过去了。
富有 | fù yǒu | wealthy | 有很多钱 | 他是一个很＿＿的人，可是一点也不快乐。
共有 | gòng yǒu | to have in total | 合在一起有 | 这个学校＿＿三千名学生。
`,
  },
  {
    theme: ["Laws", "法律"],
    data: `
法院 | fǎ yuàn | court | 处理法律案子的地方 | 这件事他们要去＿＿解决。
守法 | shǒu fǎ | law-abiding | 按法律做事 | 每个市民都应该＿＿。
合法 | hé fǎ | legal | 合乎法律 | 他做的生意是＿＿的。
方法 | fāng fǎ | method | 做事的方式 | 学中文有很多好＿＿。 | 办法 想法
办法 | bàn fǎ | way, means | 处理事情的方式 | 这个问题我没有＿＿解决。 | 方法
想法 | xiǎng fǎ | idea | 想出来的意见 | 你有什么好＿＿？ | 看法 方法
看法 | kàn fǎ | view | 对事情的意见 | 对这件事，你的＿＿是什么？ | 想法 方法 办法
警车 | jǐng chē | police car | 警察用的车 | 一辆＿＿开了过来。
观察 | guān chá | to observe | 认真地看 | 他每天都＿＿天上的星星。
规律 | guī lǜ | regular pattern | 有规则的变化 | 他每天的作息很有＿＿，十点睡觉，六点起床。
`,
  },
  {
    theme: ["Sharing", "共享"],
    data: `
共享 | gòng xiǎng | to share | 大家一起用 | 这是＿＿单车，大家都可以骑。
分享 | fēn xiǎng | to share (with others) | 和别人一起享受 | 他把蛋糕拿出来，和大家一起＿＿。
一共 | yī gòng | altogether | 合起来 | 这些东西＿＿多少钱？
座 | zuò | (measure word for mountains, buildings) | 用于山和楼 | 前面有一＿＿大山。
位 | wèi | (polite measure word for people) | 用于人，表示尊敬 | 这＿＿是我们的新老师。
地位 | dì wèi | status | 在社会中的位置 | 他在公司里的＿＿很高。 | 排名
排 | pái | row | 一行一行的 | 我坐在第三＿＿。
排名 | pái míng | ranking | 按名次排 | 这次比赛，他的＿＿是第五。
广播 | guǎng bō | broadcast | 用电波播出 | 我每天早上都听＿＿。
单位 | dān wèi | work unit | 工作的地方 | 他在哪个＿＿工作？
`,
  },
  {
    theme: ["Public Life", "公共生活"],
    data: `
民间 | mín jiān | folk | 老百姓中间 | 这是一个中国＿＿故事。
公民 | gōng mín | citizen | 有一个国家国籍的人 | 他是中国＿＿，有中国护照。
选民 | xuǎn mín | voter | 有选举权的人 | 很多＿＿都选了他。 | 公民
罚单 | fá dān | ticket (for a fine) | 罚款的单子 | 他把车停在不能停的地方，收到了一张＿＿。
警方 | jǐng fāng | the police | 警察那一方 | ＿＿正在调查这件事。
危害 | wēi hài | to harm | 伤害 | 喝太多酒会＿＿身体健康。
规划 | guī huà | plan | 长远的计划 | 政府做了城市的＿＿。
广大 | guǎng dà | vast | 范围大 | 这里有＿＿的草地。
排球 | pái qiú | volleyball | 一种用手打的球 | 她是学校＿＿队的。
守门员 | shǒu mén yuán | goalkeeper | 守球门的人 | 他是我们足球队的＿＿。
`,
  },
  {
    theme: ["Better Lives", "更好的生活"],
    data: `
降价 | jiàng jià | to cut prices | 价格降低 | 商店的衣服＿＿了，我们去买吧。
农场 | nóng chǎng | farm | 生产吃的东西，养动物的地方 | 他家有一个大＿＿，有很多牛和羊。
乡村 | xiāng cūn | village area | 农村 | ＿＿的空气很新鲜，很安静。 | 农场
富人 | fù rén | the rich | 有钱的人 | 这个地方住的都是＿＿。
镇上 | zhèn shang | in town | 镇里 | 我每个星期去＿＿买一次东西。
共计 | gòng jì | to total | 合起来算 | 这次旅行＿＿花了五千块。
危机 | wēi jī | crisis | 危险的时候 | 公司遇到了＿＿，很多人没有工作了。
正规 | zhèng guī | proper, regular | 合乎规定的 | 你要去＿＿的医院看病。
察看 | chá kàn | to look carefully | 认真地看看 | 警察认真＿＿了这个房间。
法国 | fǎ guó | France | 欧洲的一个国家 | 他是＿＿人，会说法语。
`,
  },
  {
    theme: ["The Environment", "环境"],
    data: `
环境 | huán jìng | environment | 周围的情况 | 这里的＿＿很好，有山有水。
环保 | huán bǎo | environmental protection | 保护环境 | 为了＿＿，我们要少开车。
保护 | bǎo hù | to protect | 照顾好，不让别人伤害 | 我们要＿＿好自己的眼睛。
污染 | wū rǎn | to pollute | 让东西变得不干净 | 这条河被＿＿了，水不能喝了。
垃圾 | lā jī | rubbish | 不要了的东西 | 不要把＿＿放在门口。
资源 | zī yuán | resources | 地上和地下有用的东西 | 水是很重要的＿＿。
浪费 | làng fèi | to waste | 没有好好用，白白用掉 | 不要＿＿水。
清洁 | qīng jié | clean | 干净 | 这个城市的路很＿＿。
保持 | bǎo chí | to keep | 让情况不变 | 在图书馆里请＿＿安静。
来源 | lái yuán | source | 从哪里来 | 这条新闻的＿＿是什么？
`,
  },
  {
    theme: ["Bills and Bags", "费用和袋子"],
    data: `
水费 | shuǐ fèi | water bill | 用水要给的钱 | 这个月的＿＿是五十块。 | 电费
电费 | diàn fèi | electricity bill | 用电要给的钱 | 天热常开空调，这个月的＿＿很高。 | 水费
塑料 | sù liào | plastic | 很轻、可以做袋子的材料 | 这个杯子是＿＿的，很轻。
袋子 | dài zi | bag | 放东西的东西 | 我买了很多东西，要一个大＿＿。 | 口袋
口袋 | kǒu dài | pocket | 衣服上放东西的地方 | 他把手机放在＿＿里。 | 袋子
费用 | fèi yòng | cost | 要花的钱 | 这次旅行的＿＿是多少？ | 花费
花费 | huā fèi | to spend | 用掉 | 做这件事＿＿了我很多时间。
清洁工 | qīng jié gōng | cleaner | 打扫卫生的人 | 每天早上，＿＿都把路上的垃圾拿走。
保证 | bǎo zhèng | to guarantee | 说一定会做到 | 我＿＿明天不迟到。
保安 | bǎo ān | security guard | 看门的人 | 楼下的＿＿不让他进来。
`,
  },
  {
    theme: ["Forests and Fog", "森林和雾"],
    data: `
植物 | zhí wù | plant | 树、花和草 | 这个公园里有很多＿＿，有树也有花。 | 森林
森林 | sēn lín | forest | 很多树长在一起的地方 | 他们在＿＿里走了一天，没看到一个人。 | 植物
沙子 | shā zi | sand | 很小很小的石头 | 孩子们在海边玩＿＿。
沙发 | shā fā | sofa | 很软的长椅子 | 他坐在＿＿上看电视。
雾 | wù | fog | 空中的小水点 | 今天＿＿很大，看不清前面的路。
雾天 | wù tiān | foggy day | 有雾的日子 | ＿＿开车要慢一点。
火灾 | huǒ zāi | fire (disaster) | 着火的灾难 | 这个楼里发生了＿＿，大家都跑了出来。
野生 | yě shēng | wild | 在自然里自己长大的 | 这里有很多＿＿动物。
植树 | zhí shù | to plant trees | 把小树放进土里 | 春天我们去山上＿＿。
野外 | yě wài | the outdoors | 城市外面的自然地方 | 周六我们去＿＿玩。 | 森林
`,
  },
  {
    theme: ["Storms and Fuel", "风暴和能源"],
    data: `
地震 | dì zhèn | earthquake | 地下发生的很大的动 | 发生＿＿的时候，楼都在动。
暴雨 | bào yǔ | rainstorm | 很大的雨 | 昨天下了一场＿＿，路上都是水。 | 风暴
风暴 | fēng bào | storm | 很大的风 | 海上有＿＿，船不能出去。 | 暴雨
汽油 | qì yóu | petrol | 汽车用的油 | 车里没有＿＿了，要去加油。 | 石油
石油 | shí yóu | crude oil | 地下的黑色的油 | 这个国家有很多＿＿，经济很好。 | 汽油 煤
煤 | méi | coal | 可以生火的黑石头 | 以前冬天，人们用＿＿来让房子变暖。
汽水 | qì shuǐ | soda | 有气的甜水 | 夏天他喜欢喝冰＿＿。
暴力 | bào lì | violence | 打人这样的行为 | 电视上有太多＿＿，孩子不要看。
灾难 | zāi nàn | disaster | 很大的不好的事 | 这次地震是一场大＿＿。
震动 | zhèn dòng | to vibrate | 很快地动 | 手机在桌子上＿＿了一下。
`,
  },
  {
    theme: ["Food and Injuries", "食物和受伤"],
    data: `
粮食 | liáng shi | grain | 米和面这样的东西 | 今年天气好，地里的＿＿很多。
食物 | shí wù | food | 吃的东西 | 冰箱里的＿＿不多了。 | 粮食 食品
食品 | shí pǐn | foodstuffs | 卖的吃的东西 | 这家商店的＿＿都很新鲜。 | 食物 粮食
饮食 | yǐn shí | diet | 吃的和喝的 | 他的＿＿很健康，常吃水果和菜。 | 食物 食品
死 | sǐ | to die | 离开人世 | 他家的小狗＿＿了，他很难过。 | 伤心
粮店 | liáng diàn | grain shop | 卖米和面的商店 | 他去＿＿买了一些米。
伤心 | shāng xīn | sad | 心里很难过 | 朋友走了，他很＿＿。
救 | jiù | to save | 帮人离开危险 | 他在河里大叫：“＿＿人啊！”
救护车 | jiù hù chē | ambulance | 送病人去医院的车 | 他伤得很重，我们马上叫了＿＿。
伤口 | shāng kǒu | wound | 身上伤到的地方 | 他的手上有一个小＿＿。
`,
  },
  {
    theme: ["Looking After the Earth", "爱护地球"],
    data: `
洁白 | jié bái | spotless white | 很白很干净 | 她穿着一件＿＿的衣服。
保温 | bǎo wēn | to keep warm | 让温度不变低 | 这个杯子可以＿＿，水一直是热的。
能源 | néng yuán | energy | 能给人用的力量，比如电和煤 | 我们要少用＿＿，多走路。
水源 | shuǐ yuán | water source | 水从这里来的地方 | 这条河是这个城市的＿＿。
保留 | bǎo liú | to preserve | 留下来不改 | 这个老房子被＿＿了下来。
污水 | wū shuǐ | waste water | 用过的不干净的水 | 工厂不能把＿＿放进河里。
植树节 | zhí shù jié | Arbor Day | 三月里大家一起植树的节日 | 每年三月有＿＿，学校带我们去山上。
沙尘 | shā chén | sand and dust | 风带来的沙子和土 | 春天这里常有＿＿，空气不好。
救火 | jiù huǒ | to fight a fire | 让大火停下来 | 楼里着火了，大家都去＿＿。
野花 | yě huā | wildflower | 山上自己长的花 | 春天，山上开满了＿＿。
`,
  },
  {
    theme: ["After a Disaster", "灾后"],
    data: `
灾区 | zāi qū | disaster area | 发生灾难的地方 | 很多人给＿＿送去了吃的和穿的。 | 伤员
伤员 | shāng yuán | the wounded | 伤到的人 | 医生们在照顾＿＿。
美食 | měi shí | delicious food | 好吃的东西 | 这个城市有很多有名的＿＿。
零食 | líng shí | snacks | 饭以外的小吃 | 小孩子饭前不要吃＿＿。 | 美食
沙拉 | shā lā | salad | 用生菜做的西方菜 | 我中午只吃了一个水果＿＿。
雾气 | wù qì | mist | 空中白色的水气 | 早上，山里都是＿＿。
暴风雪 | bào fēng xuě | blizzard | 很大的风和雪 | 昨天晚上来了一场＿＿，路都堵了。
灾害 | zāi hài | natural disaster | 自然带来的灾难 | 这个地方常有地震这样的＿＿。
野猫 | yě māo | stray cat | 没有家的猫 | 我家门口常有一只＿＿。
煤气 | méi qì | gas (for cooking) | 做饭用的气 | 做完饭要关好＿＿。
`,
  },
  {
    theme: ["Saving Lives", "救命"],
    data: `
救灾 | jiù zāi | disaster relief | 帮助遇到灾难的人 | 地震以后，很多人去帮忙＿＿。 | 救人
救人 | jiù rén | to save people | 帮人离开危险 | 医生的工作是＿＿。
伤害 | shāng hài | to hurt | 让人受伤 | 他说的话＿＿了朋友的心。
食用 | shí yòng | to eat (as food) | 可以吃 | 这些野菜可以＿＿。
费力 | fèi lì | to take effort | 用很多力气 | 一个人拿这个大桌子很＿＿。
浪花 | làng huā | spray (of waves) | 水打起来的白花 | 海边的＿＿很漂亮。 | 浪
浪 | làng | wave | 海上一起一落的水 | 今天风很大，海上的＿＿很高。 | 浪花
沙尘暴 | shā chén bào | sandstorm | 很大的风带着沙子 | 春天北方常有＿＿。
保管 | bǎo guǎn | to look after (things) | 帮人看好东西 | 请帮我＿＿一下这个包。
死机 | sǐ jī | (computer) to freeze | 电脑突然不动了 | 我的电脑又＿＿了。
`,
  },
  {
    theme: ["Computers", "电脑"],
    data: `
网络 | wǎng luò | network | 电脑连在一起的网 | 这里的＿＿很慢，打不开网页。 | 软件
软件 | ruǎn jiàn | software | 电脑上用的程序 | 我在手机上下载了一个新＿＿。
硬件 | yìng jiàn | hardware | 电脑的机器部分 | 这个电脑的＿＿很好，可是软件太老了。 | 机器
机器 | jī qì | machine | 能做工作的东西 | 工厂里有很多＿＿。
键盘 | jiàn pán | keyboard | 打字用的东西 | 我的＿＿坏了，打不了字。
屏幕 | píng mù | screen | 显示图像的面 | 手机的＿＿太小了，看不清。
下载 | xià zài | to download | 从网上拿下来 | 我从网上＿＿了一个电影。
智能 | zhì néng | smart | 像人一样聪明的 | 现在很多人用＿＿手机。
删 | shān | to delete | 去掉 | 我＿＿了这张不好看的照片。
软 | ruǎn | soft | 不硬 | 这个床很＿＿，睡得很舒服。
`,
  },
  {
    theme: ["Passwords and Accounts", "密码和账号"],
    data: `
密码 | mì mǎ | password | 不让别人知道的数字 | 我忘了手机的＿＿，打不开了。
登录 | dēng lù | to log in | 进入网站或软件 | 你要先＿＿，才能用这个软件。 | 充电
账号 | zhàng hào | account | 用来登录的名字 | 我在这个网站上有一个＿＿。 | 密码
存 | cún | to deposit | 放起来 | 他每个月都＿＿一点钱。
搜索 | sōu suǒ | to search | 在网上找 | 不知道的事，可以上网＿＿一下。
充电 | chōng diàn | to charge (a battery) | 给电池加电 | 手机没电了，我要＿＿。
电池 | diàn chí | battery | 放着电的小东西 | 这个手机的＿＿很好，可以用两天。
频道 | pín dào | channel | 电视台的台 | 这个电视有一百个＿＿。
记录 | jì lù | to record | 写下来 | 他把每天花的钱都＿＿下来。 | 登记
登记 | dēng jì | to register | 写下名字 | 住酒店要先＿＿。
`,
  },
  {
    theme: ["Programs", "程序"],
    data: `
程序 | chéng xù | program | 电脑做事的步骤 | 他会写电脑＿＿。 | 系统
系统 | xì tǒng | system | 成套的整体 | 我的电脑＿＿太老了，要换新的。 | 版本
版本 | bǎn běn | version | 同一个东西不同的样子 | 这个软件出了新＿＿。
功能 | gōng néng | function | 能做的事 | 这个手机有很多＿＿，还可以照相。
安装 | ān zhuāng | to install | 装上去 | 我在电脑上＿＿了一个新软件。
修 | xiū | to repair | 把坏的弄好 | 我的车坏了，要去＿＿一下。
卡 | kǎ | card | 硬纸片 | 我的＿＿里没有钱了。
坏 | huài | broken | 不好了，不能用了 | 我的手机＿＿了。 | 修
程度 | chéng dù | degree | 达到的情况 | 他的中文到了很高的＿＿。
成功 | chéng gōng | to succeed | 达到目的 | 他试了很多次，最后＿＿了。
`,
  },
  {
    theme: ["Repairs", "修理"],
    data: `
维修 | wéi xiū | to service | 检查和修理 | 这个电脑要送去＿＿。 | 修理
修理 | xiū lǐ | to fix | 把坏的修好 | 爸爸在＿＿自行车。 | 维修
装修 | zhuāng xiū | to renovate | 把房子弄好看 | 他们的新房子正在＿＿。
装满 | zhuāng mǎn | to fill up | 放满 | 他把杯子＿＿了水。
服装 | fú zhuāng | clothing | 衣服 | 这家商店卖女人的＿＿。
卡片 | kǎ piàn | card (greeting) | 一张小纸 | 他送给我一张生日＿＿。
信用卡 | xìn yòng kǎ | credit card | 先花钱后还的卡 | 这家店可以用＿＿吗？
功课 | gōng kè | homework | 学生的作业 | 他每天先做＿＿再看电视。
坏处 | huài chù | disadvantage | 不好的地方 | 喝太多酒有很多＿＿。
统一 | tǒng yī | uniform, unified | 合成一个 | 学生们穿＿＿的衣服。
`,
  },
  {
    theme: ["Online", "网上"],
    data: `
录用 | lù yòng | to hire | 公司收人工作 | 他被这家公司＿＿了。
网民 | wǎng mín | internet user | 上网的人 | 中国有很多＿＿。
存钱 | cún qián | to save money | 把钱存起来 | 为了买车，他每个月都＿＿。 | 登山
登山 | dēng shān | to climb mountains | 爬山 | 周六我们去＿＿。
幕后 | mù hòu | behind the scenes | 不在前面的地方 | 他在＿＿帮了很多忙。
录音 | lù yīn | to record sound | 把声音录下来 | 老师上课的时候，我用手机＿＿。
智力 | zhì lì | intelligence | 聪明的程度 | 这个孩子的＿＿很高。
硬 | yìng | hard | 不软 | 这个面包太＿＿了，不好吃。
删去 | shān qù | to cross out | 拿走不要 | 请把这个文件＿＿。
密 | mì | dense | 很多很近 | 这里的树很＿＿。
`,
  },
  {
    theme: ["Phones", "手机"],
    data: `
充电器 | chōng diàn qì | charger | 给手机充电的东西 | 我忘了带手机的＿＿。
视频 | shì pín | video | 看的影片 | 他在网上看了一个好笑的＿＿。
登机 | dēng jī | to board a plane | 上飞机 | 飞机十点起飞，九点半＿＿。
账单 | zhàng dān | bill | 要给钱的单子 | 这个月的电话＿＿是一百块。
存在 | cún zài | to exist | 有 | 这个问题一直＿＿。
池子 | chí zi | pond | 放水的地方 | 公园里有一个＿＿，里面有很多鱼。 | 游泳池
游泳池 | yóu yǒng chí | swimming pool | 游泳的地方 | 夏天我们常去＿＿游泳。 | 池子
充满 | chōng mǎn | full of | 都是 | 房间里＿＿了笑声。
电器 | diàn qì | electrical appliance | 用电的机器 | 这家商店卖冰箱和电视这样的＿＿。
乐器 | yuè qì | musical instrument | 弹奏的东西 | 你会什么＿＿？
`,
  },
  {
    theme: ["Software at Work", "工作中的软件"],
    data: `
程序员 | chéng xù yuán | programmer | 写程序的人 | 他是一名＿＿，在电脑公司工作。
统计 | tǒng jì | to count up | 把数字加起来看 | 公司每个月都要＿＿一下卖了多少东西。
器材 | qì cái | equipment | 用的机器和东西 | 学校买了很多体育＿＿。
功夫 | gōng fu | kung fu | 中国武术 | 他会中国＿＿。
用功 | yòng gōng | hardworking (at study) | 努力学习 | 他学习很＿＿，每天都看书到很晚。
出版 | chū bǎn | to publish | 印成书 | 这本书去年＿＿了。
装 | zhuāng | to pack | 放进去 | 他把衣服＿＿进箱子里。
维护 | wéi hù | to safeguard | 保护 | 大家都要＿＿公共安全。
坏事 | huài shì | bad deed | 不好的事 | 他从来不做＿＿。
卡车 | kǎ chē | lorry | 运东西的大车 | 路上有一辆大＿＿。
`,
  },
  {
    theme: ["Security", "安全"],
    data: `
保密 | bǎo mì | to keep secret | 不让别人知道 | 这件事请你＿＿，不要告诉别人。
账户 | zhàng hù | (bank) account | 存钱的户头 | 他的＿＿里有很多钱。
坏人 | huài rén | bad person | 不好的人 | 警察找到了那个＿＿。
关键 | guān jiàn | key (crucial) | 最重要的 | 学好中文的＿＿是多说多练。
开幕 | kāi mù | to open (an event) | 开始 | 运动会明天＿＿。
字幕 | zì mù | subtitles | 电影下面的字 | 我看外国电影要看＿＿。
充分 | chōng fèn | ample | 足够 | 我们要做好＿＿的准备。
功效 | gōng xiào | efficacy | 起到的作用 | 这个药的＿＿很好，吃了病就好了。
存放 | cún fàng | to store | 放 | 这个房间用来＿＿旧东西。
硬盘 | yìng pán | hard disk | 电脑里放东西的地方 | 我的照片都在电脑＿＿里。
`,
  },
  {
    theme: ["Smart Living", "智能生活"],
    data: `
机器人 | jī qì rén | robot | 像人的机器 | 这个＿＿会说话，还会走路。
网速 | wǎng sù | internet speed | 上网的速度 | 这里的＿＿很快。 | 信号
频率 | pín lǜ | frequency | 次数 | 他运动的＿＿是一个星期三次。
卡通 | kǎ tōng | cartoon | 动画片 | 孩子们都喜欢看＿＿。
假装 | jiǎ zhuāng | to pretend | 装作 | 他＿＿没听见。
修车 | xiū chē | to repair cars | 把车修好 | 他在一家＿＿店工作。
登上 | dēng shàng | to board | 上去 | 他们＿＿了飞机。
序号 | xù hào | serial number | 顺序的号 | 请在这里写上你的＿＿。
关机 | guān jī | to switch off | 关上手机或电脑 | 考试的时候，请把手机＿＿。
信号 | xìn hào | signal | 手机能收到的电波 | 山里没有＿＿，打不了电话。 | 网速
`,
  },
  {
    theme: ["Culture", "文化"],
    data: `
传统 | chuán tǒng | tradition | 一代一代传下来的东西 | 春节是中国的＿＿节日。 | 风俗 古老
艺术 | yì shù | art | 画画、音乐这样的东西 | 他很喜欢＿＿，常常去看画。
京剧 | jīng jù | Peking opera | 中国北京的一种戏 | 爷爷喜欢听＿＿。
博物馆 | bó wù guǎn | museum | 放老东西给人看的地方 | 我们在＿＿里看了很多很老的东西。 | 展览
展览 | zhǎn lǎn | exhibition | 把东西放出来给人看 | 这个＿＿很有意思，来看的人很多。
民族 | mín zú | ethnic group | 有同样文化的一群人 | 中国有五十六个＿＿。
风俗 | fēng sú | custom | 一个地方的习惯 | 每个地方都有自己的＿＿。 | 传统
古老 | gǔ lǎo | ancient | 很老的 | 这是一个很＿＿的城市。
诗 | shī | poem | 有节奏的短文 | 他喜欢写＿＿。
传 | chuán | to pass on | 交给 | 请把这本书＿＿给后面的同学。
`,
  },
  {
    theme: ["The Arts", "艺术"],
    data: `
艺术家 | yì shù jiā | artist | 做艺术的人 | 他是一位有名的＿＿。
剧场 | jù chǎng | theatre | 看戏的地方 | 今天晚上我们去＿＿看话剧。
电视剧 | diàn shì jù | TV series | 电视上的故事 | 妈妈每天晚上看＿＿。 | 话剧
话剧 | huà jù | stage play | 只说不唱的戏 | 学生们在学校演了一个＿＿。 | 电视剧
展开 | zhǎn kāi | to unfold | 打开 | 他把地图＿＿放在桌子上。
发展 | fā zhǎn | to develop | 变大变好 | 这个城市＿＿得很快。
游览 | yóu lǎn | to tour | 到处看看 | 我们＿＿了这个古老的城市。
家族 | jiā zú | clan | 同一家的人 | 他们＿＿里有很多医生。
古诗 | gǔ shī | classical poem | 很老的诗 | 我会背很多中国＿＿。
传说 | chuán shuō | legend | 很久以前传下来的故事 | 这是一个关于龙的＿＿。
`,
  },
  {
    theme: ["Old Things", "古老的东西"],
    data: `
古人 | gǔ rén | the ancients | 很久以前的人 | ＿＿说：“三人行，必有我师。” | 诗人 俗话
诗人 | shī rén | poet | 写诗的人 | 李白是中国有名的＿＿。 | 艺人
展出 | zhǎn chū | to put on show | 拿出来给人看 | 博物馆＿＿了很多老画。
传真 | chuán zhēn | fax | 用电话线传过去的信 | 现在很少有人用＿＿了。
流传 | liú chuán | to be handed down | 一代一代传下去 | 这个故事＿＿了很多年。
俗话 | sú huà | saying | 大家常说的话 | ＿＿说：“百闻不如一见。” | 古人
艺人 | yì rén | entertainer | 唱歌演戏的人 | 他是一个很有名的＿＿。 | 诗人 古人
剧本 | jù běn | script | 演戏用的书 | 他写了一个电影＿＿。
博客 | bó kè | blog | 网上的日记 | 他每天在网上写＿＿。
古画 | gǔ huà | old painting | 很老的画 | 这张＿＿有一千年了。
`,
  },
  {
    theme: ["Paintings and Music", "画和音乐"],
    data: `
画 | huà | to paint | 用笔描出图来 | 他＿＿了一只小猫。
画家 | huà jiā | painter | 画画的人 | 这位＿＿画的山水很有名。
琴声 | qín shēng | sound of an instrument | 弹琴的声音 | 我听到了好听的＿＿。
画笔 | huà bǐ | paintbrush | 画画用的笔 | 他买了一支新＿＿。
演奏 | yǎn zòu | to perform (music) | 用乐器表演 | 他在音乐会上＿＿了一个小时。
节奏 | jié zòu | rhythm | 音乐的快慢 | 这个音乐的＿＿很快。
龙 | lóng | dragon | 中国传说里的动物 | 中国传说里的＿＿会飞。
画画 | huà huà | to draw | 画图 | 我的爱好是＿＿。 | 演奏
图画 | tú huà | picture | 画出来的东西 | 这本书里有很多＿＿。 | 动画
动画 | dòng huà | animation | 会动的画 | 孩子们喜欢看＿＿片。
`,
  },
  {
    theme: ["Temples and Palaces", "庙和宫"],
    data: `
故宫 | gù gōng | the Forbidden City | 北京古老的皇宫 | 我们去北京的时候参观了＿＿。
庙 | miào | temple | 敬神的地方 | 山上有一个很老的＿＿。
庙会 | miào huì | temple fair | 春节时在庙里办的热闹的会 | 过年的时候，庙里有＿＿，人很多。
纪念 | jì niàn | to commemorate | 记住 | 我们拍了一张照片做＿＿。 | 纪念品
纪念品 | jì niàn pǐn | souvenir | 带回去纪念的东西 | 我在北京买了很多＿＿。 | 纪念
念 | niàn | to read aloud | 读出来 | 请你把这段话＿＿给大家听。
想念 | xiǎng niàn | to miss | 常常想 | 我很＿＿家乡的朋友。
庆祝 | qìng zhù | to celebrate | 为好事开心地纪念 | 我们一起＿＿他的生日。
国庆 | guó qìng | National Day | 国家的生日 | 十月一日是中国的＿＿节。
拜年 | bài nián | to pay a New Year call | 春节去别人家问好 | 春节的时候，我们去爷爷家＿＿。
`,
  },
  {
    theme: ["Shows and Ideas", "展览和观念"],
    data: `
礼拜 | lǐ bài | week | 星期 | 下个＿＿我们去旅行。
画展 | huà zhǎn | art exhibition | 画的展览 | 这个月博物馆有一个＿＿。
纪律 | jì lǜ | discipline | 大家要守的规定 | 上课要守＿＿。
世纪 | shì jì | century | 一百年 | 现在是二十一＿＿。
年纪 | nián jì | age | 多少岁 | 爷爷的＿＿很大了。
念书 | niàn shū | to study | 上学 | 他在北京＿＿。
观念 | guān niàn | concept | 想法 | 年轻人和老人的＿＿不一样。
艺术品 | yì shù pǐn | work of art | 艺术的作品 | 这是一件很贵的＿＿。
传播 | chuán bō | to spread | 让更多人知道 | 网络让新闻＿＿得很快。
民俗 | mín sú | folk custom | 民间的风俗 | 这个村子保留了很多老＿＿。
`,
  },
  {
    theme: ["Festivals and Customs", "节日和习俗"],
    data: `
龙年 | lóng nián | Year of the Dragon | 十二年里的一年 | 他是＿＿出生的。
舞龙 | wǔ lóng | dragon dance | 一种民间表演 | 春节的时候，很多人在广场上＿＿。
喜庆 | xǐ qìng | festive | 让人高兴的 | 红色很＿＿，过年的时候大家都喜欢。
古琴 | gǔ qín | guqin | 中国古代的琴 | 他喜欢听＿＿。 | 民歌
传出 | chuán chū | to come out (of a sound) | 从里面出来（声音） | 房间里＿＿了笑声。
展示 | zhǎn shì | to show | 拿出来让人看 | 他给大家＿＿了自己的画。
习俗 | xí sú | custom | 习惯和风俗 | 春节吃饺子是北方的＿＿。
纪念日 | jì niàn rì | anniversary | 纪念的日子 | 今天是他们结婚的＿＿。
古城 | gǔ chéng | ancient city | 很老的城市 | 西安是一座＿＿。
民歌 | mín gē | folk song | 民间的歌 | 奶奶会唱很多＿＿。
`,
  },
  {
    theme: ["Poems and Stories", "诗和故事"],
    data: `
诗歌 | shī gē | poetry | 诗 | 他喜欢读＿＿。
奏乐 | zòu yuè | to play music | 演奏音乐 | 晚会上有人唱歌，有人＿＿。
剧情 | jù qíng | plot | 故事的情节 | 这个电影的＿＿很有意思。 | 画面
画面 | huà miàn | image | 看到的样子 | 这个电影的＿＿很美。 | 剧情
剧院 | jù yuàn | theatre | 演戏的大楼 | 城里新开了一家＿＿。
念头 | niàn tou | thought | 心里的想法 | 他有了一个去中国留学的＿＿。
古怪 | gǔ guài | odd | 很奇怪 | 他的脾气很＿＿。
少数民族 | shǎo shù mín zú | ethnic minority | 人口少的民族 | 这个地方住着很多＿＿。
博览会 | bó lǎn huì | expo | 很大的展览 | 上海办过世界＿＿。
传来 | chuán lái | to come (of news or sound) | 从远处过来 | 远处＿＿了笑声。
`,
  },
  {
    theme: ["Banks", "银行"],
    data: `
银行 | yín háng | bank | 存钱的地方 | 我去＿＿存钱。
付钱 | fù qián | to pay | 给钱 | 买东西要先＿＿。
存款 | cún kuǎn | savings | 存在银行的钱 | 他的＿＿不多了。
打折 | dǎ zhé | to give a discount | 降价卖 | 这家店的衣服在＿＿，很便宜。
折 | zhé | to fold | 把纸弯过来 | 他把信＿＿好放进口袋里。
扣 | kòu | to deduct | 从里面拿走一部分 | 迟到一次，公司就＿＿他一百块钱。
人民币 | rén mín bì | renminbi | 中国的钱 | 在中国买东西用＿＿。
免费 | miǎn fèi | free of charge | 不要钱 | 这个博物馆是＿＿的，不用买票。
税 | shuì | tax | 交给国家的钱 | 赚得多，交的＿＿也多。
预习 | yù xí | to prepare a lesson | 上课前先学 | 上课以前，要先＿＿课文。
`,
  },
  {
    theme: ["Paying", "付钱"],
    data: `
付款 | fù kuǎn | to make a payment | 交钱 | 请到那边去＿＿。
额外 | é wài | extra | 另外加的 | 这个服务要＿＿交钱。
预订 | yù dìng | to book | 先订好 | 我已经＿＿了酒店。
预报 | yù bào | forecast | 先说出来 | 天气＿＿说明天下雨。
预计 | yù jì | to expect | 先算 | 飞机＿＿三点到。
货币 | huò bì | currency | 钱 | 每个国家都有自己的＿＿。 | 硬币
硬币 | yìng bì | coin | 硬的钱 | 他口袋里有很多＿＿。
折扣 | zhé kòu | discount | 降低的价 | 买两件可以有＿＿吗？
免税 | miǎn shuì | tax-free | 不用交税 | 机场里有＿＿店。
银色 | yín sè | silver | 像银一样的颜色 | 他买了一辆＿＿的车。
`,
  },
  {
    theme: ["Shopping", "购物"],
    data: `
购物 | gòu wù | to shop | 买东西 | 周六我常去商店＿＿。 | 购买
购买 | gòu mǎi | to purchase | 买 | 你可以在网上＿＿火车票。
消费 | xiāo fèi | spending | 花钱买东西 | 这个城市的＿＿很高，东西都很贵。
优惠 | yōu huì | discount | 便宜一点 | 学生买票有＿＿。
名牌 | míng pái | famous brand | 有名的牌子 | 她只穿＿＿衣服。
牌子 | pái zi | brand | 商品的名字 | 你的手机是什么＿＿的？
货 | huò | goods | 卖的东西 | 商店没＿＿了，明天再来吧。
批 | pī | batch | 一群 | 这家店来了一＿＿新衣服。
快递 | kuài dì | express delivery | 很快送到的东西 | 我在网上买的东西，＿＿明天到。
邮件 | yóu jiàn | mail | 寄来的信 | 我每天早上先看＿＿。
`,
  },
  {
    theme: ["The Post", "邮寄"],
    data: `
寄 | jì | to post | 用邮局送 | 我给妈妈＿＿了一个包。 | 递
邮递员 | yóu dì yuán | postman | 送信的人 | ＿＿每天给我们送信。
地址 | dì zhǐ | address | 住的地方 | 请写下你家的＿＿。
邮票 | yóu piào | stamp | 贴在信上的票 | 寄信要买＿＿。
邮箱 | yóu xiāng | mailbox | 放信的箱子 | 我的＿＿里有很多信。
递 | dì | to hand | 拿给 | 请把那本书＿＿给我。
寄存 | jì cún | to check (luggage) | 把东西放在别人那里 | 我把包＿＿在酒店里。
消息 | xiāo xi | news | 新的情况 | 我有一个好＿＿告诉你。
网址 | wǎng zhǐ | web address | 网站的地址 | 请把这个网站的＿＿发给我。
货物 | huò wù | goods | 运的东西 | 这辆车上的＿＿很重。
`,
  },
  {
    theme: ["Good Deals", "实惠"],
    data: `
实惠 | shí huì | good value | 东西好又便宜 | 这家饭馆的菜很＿＿。
批准 | pī zhǔn | to approve | 同意 | 公司＿＿了他的请假。
扣子 | kòu zi | button | 衣服上的小东西 | 这件衣服有五个＿＿。
预备 | yù bèi | to get ready | 准备 | 大家＿＿好了吗？
银牌 | yín pái | silver medal | 第二名的牌 | 他在比赛中得了＿＿。
付出 | fù chū | to put in | 用了很多 | 为了这个比赛，他＿＿了很多努力。
消化 | xiāo huà | to digest | 把吃的变成身体要的 | 吃得太多，不好＿＿。
购票 | gòu piào | to buy tickets | 买票 | 看电影要先＿＿。 | 寄信
寄信 | jì xìn | to post a letter | 用邮局送信 | 我写好了信，现在去＿＿。
预祝 | yù zhù | to wish in advance | 先祝 | ＿＿你考试成功！
`,
  },
  {
    theme: ["Shops and Taxes", "商店和税"],
    data: `
货架 | huò jià | shelf | 商店里放东西的架子 | ＿＿上的东西都卖完了。
售货员 | shòu huò yuán | shop assistant | 卖东西的人 | 我问＿＿这件衣服多少钱。
退货 | tuì huò | to return goods | 把买的东西还回去 | 这件衣服太小了，我想＿＿。
免票 | miǎn piào | free admission | 不要票 | 小孩子＿＿。
预约 | yù yuē | to make an appointment | 先约好 | 看医生要先＿＿。
邮寄 | yóu jì | to post | 用邮局送 | 我把礼物＿＿给了朋友。
扣分 | kòu fēn | to lose points | 少给分 | 考试写错字要＿＿。
批发 | pī fā | wholesale | 很多很多地卖 | 这家店只做＿＿，不一个一个卖。
交税 | jiāo shuì | to pay taxes | 给国家交钱 | 每个公民都要＿＿。
预先 | yù xiān | in advance | 事先 | 来以前请＿＿告诉我。
`,
  },
  {
    theme: ["Money Words", "钱的词"],
    data: `
银子 | yín zi | silver (money) | 古时候用的钱 | 古时候，人们用＿＿买东西。
罚款 | fá kuǎn | to fine | 罚钱 | 开车太快要被＿＿。
递交 | dì jiāo | to hand in | 交上去 | 他把申请＿＿给了学校。
打牌 | dǎ pái | to play cards | 玩扑克 | 爷爷喜欢和朋友＿＿。
车牌 | chē pái | number plate | 车的号码牌 | 那辆车的＿＿是多少？
税收 | shuì shōu | tax revenue | 国家收的税 | 国家的＿＿用来修路。
额头 | é tóu | forehead | 眼睛上面的地方 | 他的＿＿很热，可能发烧了。
预感 | yù gǎn | premonition | 先感到 | 我有＿＿，今天会下雨。
打消 | dǎ xiāo | to drop (an idea) | 不再想 | 下雨了，他＿＿了去公园的想法。
货车 | huò chē | lorry | 运东西的车 | 一辆＿＿停在门口。
`,
  },
  {
    theme: ["Shopping Online", "网上购物"],
    data: `
网购 | wǎng gòu | to shop online | 在网上买东西 | 现在很多人喜欢＿＿。
收货 | shōu huò | to receive goods | 拿到买的东西 | 快递员送来了东西，我在家＿＿。
寄出 | jì chū | to send out | 寄走 | 你买的书今天＿＿了。
快递员 | kuài dì yuán | courier | 送快递的人 | ＿＿把东西送到了我家门口。
付费 | fù fèi | to pay a fee | 给钱 | 这个软件要＿＿才能用。
邮费 | yóu fèi | postage | 寄东西的钱 | 这个包的＿＿是十块。
品牌 | pǐn pái | brand | 商品的名字 | 这个＿＿的衣服很贵。
预付 | yù fù | to pay in advance | 先付钱 | 住酒店要＿＿一半的钱。
银行卡 | yín háng kǎ | bank card | 银行的卡 | 我用＿＿付了钱。
订购 | dìng gòu | to order | 订下来买 | 我在网上＿＿了一张桌子。
`,
  },
  {
    theme: ["Reporters", "记者"],
    data: `
记者 | jì zhě | reporter | 写新闻的人 | 这个＿＿问了很多人。
采访 | cǎi fǎng | to interview | 记者去问问题 | 记者＿＿了这位运动员。 | 访问
访问 | fǎng wèn | to pay an official visit | 去看 | 中国的领导人＿＿了美国。 | 采访
宣布 | xuān bù | to announce | 公开说 | 老师＿＿明天放假。
举行 | jǔ xíng | to hold (an event) | 办 | 运动会在学校＿＿。
首都 | shǒu dū | capital | 国家的中心城市 | 北京是中国的＿＿。
观众 | guān zhòng | audience | 看表演的人 | 剧场里坐满了＿＿。
战争 | zhàn zhēng | war | 国家和国家打仗 | 这场＿＿打了五年。
争 | zhēng | to strive for | 抢着做 | 大家都＿＿着回答问题。
举手 | jǔ shǒu | to raise one's hand | 把手抬起来 | 有问题请＿＿。
`,
  },
  {
    theme: ["Announcements", "宣布"],
    data: `
宣传 | xuān chuán | to publicise | 让大家知道 | 学校在＿＿环保。
布 | bù | cloth | 做衣服的材料 | 这块＿＿很软。
公布 | gōng bù | to make public | 公开让大家知道 | 考试成绩明天＿＿。
举办 | jǔ bàn | to host | 办 | 这个城市＿＿过世界博览会。
首先 | shǒu xiān | first of all | 第一 | ＿＿，我要谢谢大家。
大众 | dà zhòng | the public | 很多普通人 | 这是一本给＿＿看的书。 | 众人
众人 | zhòng rén | everyone present | 大家 | 听了他的话，＿＿都笑了。
争论 | zhēng lùn | to argue | 各说自己对 | 他们为这件事＿＿了很久。
作者 | zuò zhě | author | 写书的人 | 这本书的＿＿是一个中国人。
举例 | jǔ lì | to give an example | 拿出例子来说明 | 老师＿＿说明了这个词的意思。
`,
  },
  {
    theme: ["War", "战争"],
    data: `
大战 | dà zhàn | great war | 很大的战争 | 第二次世界＿＿打了六年。
争吵 | zhēng chǎo | to quarrel | 吵架 | 他们常常为小事＿＿。
停战 | tíng zhàn | to cease fire | 不再打仗 | 两个国家终于＿＿了。
读者 | dú zhě | reader | 看书的人 | 这本书有很多＿＿。 | 学者
学者 | xué zhě | scholar | 有学问的人 | 他是一位有名的＿＿。 | 读者
爱好者 | ài hào zhě | enthusiast | 很喜欢一样东西的人 | 他是一个足球＿＿。
首相 | shǒu xiàng | prime minister | 有的国家的领导 | 他是日本的＿＿。
首次 | shǒu cì | for the first time | 第一次 | 这是他＿＿来中国。
采用 | cǎi yòng | to adopt | 用 | 公司＿＿了他的方法。
举 | jǔ | to lift | 拿起来 | 他把杯子＿＿得很高。
`,
  },
  {
    theme: ["Public Events", "公共活动"],
    data: `
众多 | zhòng duō | numerous | 很多 | 中国人口＿＿。
访客 | fǎng kè | visitor | 来看你的人 | 今天家里来了很多＿＿。
分布 | fēn bù | to be spread out | 散在各个地方 | 大学＿＿在城市的东边和西边。
战场 | zhàn chǎng | battlefield | 打仗的地方 | 这里以前是一个＿＿。
采 | cǎi | to pick | 拿下来 | 孩子们在山上＿＿花。
来访 | lái fǎng | to come to visit | 来看 | 欢迎你们＿＿！
举起 | jǔ qǐ | to raise | 拿起来 | 大家＿＿杯子，一起干杯。
举动 | jǔ dòng | act | 做的事 | 他的这个＿＿让大家都很感动。
首页 | shǒu yè | home page | 网站的第一页 | 打开网站的＿＿，就能看到新闻。
战友 | zhàn yǒu | comrade-in-arms | 一起打仗的朋友 | 爷爷和他的＿＿很多年没见了。
`,
  },
  {
    theme: ["Listeners and Readers", "听众和读者"],
    data: `
发布 | fā bù | to release | 公开发出 | 公司＿＿了新手机。
首 | shǒu | (measure word for songs and poems) | 用于诗和歌 | 他唱了一＿＿歌。
听众 | tīng zhòng | listener | 听的人 | 这个广播节目有很多＿＿。
民众 | mín zhòng | the populace | 老百姓 | 政府要听＿＿的意见。
举报 | jǔ bào | to report (wrongdoing) | 告诉警察或政府 | 有人＿＿了这家工厂污染河水。
宣读 | xuān dú | to read out | 公开读 | 校长在会上＿＿了新规定。
争光 | zhēng guāng | to win honour | 带来光荣 | 他在比赛中为国家＿＿。 | 争气
采购 | cǎi gòu | to purchase (for a company) | 公司买东西 | 他在公司负责＿＿。
争气 | zhēng qì | to do credit to | 努力做好，不让人失望 | 这个孩子很＿＿，考了第一名。
拜访 | bài fǎng | to call on | 去看 | 我明天要去＿＿一位老师。
`,
  },
  {
    theme: ["Elections and Notices", "选举和布告"],
    data: `
布鞋 | bù xié | cloth shoes | 布做的鞋 | 奶奶给我做了一双＿＿。
长者 | zhǎng zhě | elder | 年纪大的人 | 我们要尊重＿＿。
布告 | bù gào | notice | 贴出来的通知 | 门口有一张＿＿，写着明天停电。
冷战 | lěng zhàn | cold war | 不说话的吵架 | 他们夫妻在＿＿，已经三天不说话了。
争先 | zhēng xiān | to strive to be first | 抢在前面 | 下课了，同学们＿＿跑出教室。
选举 | xuǎn jǔ | election | 选出来 | 明年这个国家要＿＿。
布满 | bù mǎn | to be covered with | 到处都是 | 天上＿＿了星星。
作战 | zuò zhàn | to fight | 打仗 | 他们在山里＿＿了三天。
前者 | qián zhě | the former | 前面说的那个 | 米饭和面条，我更喜欢＿＿。
战后 | zhàn hòu | post-war | 战争以后 | ＿＿，这个城市很快发展起来了。
`,
  },
  {
    theme: ["Habits", "习惯"],
    data: `
习惯 | xí guàn | habit | 常常这样做 | 他有早起的好＿＿。
养 | yǎng | to keep (an animal) | 照顾动物 | 他家＿＿了一只猫。
营养 | yíng yǎng | nutrition | 身体要的好东西 | 牛奶很有＿＿。
熬夜 | áo yè | to stay up late | 很晚不睡 | 他常常＿＿，所以白天很累。
夜里 | yè li | at night | 晚上 | ＿＿下了一场大雨。
肥 | féi | fatty | 油多 | 这块肉太＿＿了，我不想吃。
宠物 | chǒng wù | pet | 家里养的小动物 | 他的＿＿是一只小狗。
抽烟 | chōu yān | to smoke | 吸烟 | 这里不能＿＿。
散心 | sàn xīn | to take one's mind off things | 出去走走让心情变好 | 他心情不好，出去＿＿了。
减肥 | jiǎn féi | to lose weight | 让自己变瘦 | 她想＿＿，所以晚饭吃得很少。
`,
  },
  {
    theme: ["Healthy Living", "健康生活"],
    data: `
养成 | yǎng chéng | to form (a habit) | 慢慢有了 | 他从小＿＿了看书的习惯。
夜晚 | yè wǎn | night | 晚上 | ＿＿的城市很漂亮。 | 半夜
半夜 | bàn yè | midnight | 夜里十二点左右 | 他＿＿才回家。
熬 | áo | to simmer | 用小火慢慢煮 | 妈妈在给我＿＿汤。
肥胖 | féi pàng | obese | 太胖 | ＿＿对身体不好。
宠 | chǒng | to dote on | 太爱 | 妈妈太＿＿孩子了，什么都给他买。
抽 | chōu | to pull out | 拿出 | 他从书包里＿＿出一本书。
烟 | yān | smoke | 着火时出来的气 | 房间里都是＿＿，是不是着火了？
散 | sàn | to disperse | 分开 | 电影结束了，人都＿＿了。
营业 | yíng yè | to be open for business | 开门做生意 | 这家商店晚上十点以后不＿＿。
`,
  },
  {
    theme: ["Pets and Food", "宠物和吃的"],
    data: `
养狗 | yǎng gǒu | to keep a dog | 照顾一只狗 | 我家不能＿＿，因为妈妈怕狗。
营地 | yíng dì | camp | 野外住的地方 | 我们晚上在山上的＿＿睡觉。
宠爱 | chǒng ài | to love dearly | 很爱 | 她是家里最小的孩子，大家都很＿＿她。
夜市 | yè shì | night market | 晚上的市场 | 我们去＿＿吃小吃吧。
烟花 | yān huā | fireworks | 夜里在天上开的花 | 春节晚上，天上都是＿＿。
抽空 | chōu kòng | to find time | 拿出时间 | 我会＿＿去看你。
解散 | jiě sàn | to dismiss | 分开走 | 会开完了，大家＿＿吧。 | 分散
分散 | fēn sàn | to scatter | 不在一起 | 孩子们＿＿在公园里不同的地方。
营业员 | yíng yè yuán | shop clerk | 商店里卖东西的人 | 那位＿＿很热情。
保养 | bǎo yǎng | to maintain (a car, the body) | 照顾好 | 这辆车＿＿得很好。
`,
  },
  {
    theme: ["Late Nights", "深夜"],
    data: `
夜班 | yè bān | night shift | 晚上的工作 | 他这个星期上＿＿。
午夜 | wǔ yè | midnight | 夜里十二点 | 他工作到＿＿才睡。
烟雾 | yān wù | smoke | 烟和雾 | 城市里都是＿＿，看不清楼。
肥料 | féi liào | fertiliser | 让地里的东西长好的东西 | 农民给菜地上＿＿。
教养 | jiào yǎng | upbringing | 有礼貌 | 这个孩子很有＿＿。
养老 | yǎng lǎo | to live in retirement | 照顾老人 | 爷爷奶奶住在＿＿院里。
散会 | sàn huì | to end a meeting | 会议结束 | 时间到了，＿＿！
懒散 | lǎn sàn | sluggish | 懒，不认真 | 他做事很＿＿。
养育 | yǎng yù | to bring up | 照顾孩子长大 | 父母＿＿了我。
夜景 | yè jǐng | night view | 晚上的风景 | 上海的＿＿很美。
`,
  },
  {
    theme: ["Ways of Living", "生活方式"],
    data: `
宠坏 | chǒng huài | to spoil (a child) | 太宠爱孩子让他变坏 | 这个孩子被奶奶＿＿了。
过夜 | guò yè | to stay the night | 住一个晚上 | 今天太晚了，你就在我家＿＿吧。
经营 | jīng yíng | to run (a business) | 管理生意 | 他＿＿着一家小饭馆。
国营 | guó yíng | state-run | 国家开的 | 这是一家＿＿工厂。
抽查 | chōu chá | to spot-check | 拿出一部分来检查 | 老师＿＿了几个同学的作业。
散开 | sàn kāi | to scatter | 分开 | 警察来了，人们很快＿＿了。 | 散场
肥肉 | féi ròu | fatty meat | 很肥的肉 | 我不喜欢吃＿＿。
夜车 | yè chē | night train | 夜里开的车 | 我们坐＿＿去上海，早上就到了。
烟酒 | yān jiǔ | tobacco and alcohol | 烟和酒 | 这家小店卖＿＿。
散场 | sàn chǎng | (of a show) to let out | 演出结束人走 | 电影＿＿了，大家都走出了电影院。
`,
  },
  {
    theme: ["Looking After Ourselves", "照顾自己"],
    data: `
营救 | yíng jiù | to rescue | 救 | 他们＿＿出了山里的三个人。
夜色 | yè sè | the night | 夜里的样子 | ＿＿中的城市很美。
熬过 | áo guò | to pull through | 很难也过去了 | 最难的时候他们都＿＿来了。
肥大 | féi dà | baggy | 很大 | 这件衣服太＿＿了。
宠物店 | chǒng wù diàn | pet shop | 卖宠物的店 | 我在＿＿买了一只小猫。
抽奖 | chōu jiǎng | lottery draw | 拿号码看能不能得奖 | 他在商店＿＿，得了一个电视。
养花 | yǎng huā | to grow flowers | 照顾花 | 奶奶喜欢＿＿，家里有很多花。
夜间 | yè jiān | at night | 夜里 | 这家店＿＿也开门。
惯用 | guàn yòng | habitually used | 常用 | 这是他＿＿的方法。
散发 | sàn fā | to give off | 发出 | 花园里的花＿＿着香气。
`,
  },
];
