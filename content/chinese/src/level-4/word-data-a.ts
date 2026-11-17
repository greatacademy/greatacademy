// The words of units 1 to 6 of level 4 (docs/chinese-curriculum.md §8.4), in the format of level 3 (../level-3/word-data.ts).
//
// A line a word, as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** wordBatchesA are the 52 word batches of units 1 to 6 of level 4, in teaching order. */
export const wordBatchesA: readonly LevelWordBatch[] = [
  // Unit 1: Health and Medicine.
  {
    theme: ["Seeing a Doctor", "看病"],
    data: `
治疗 | zhì liáo | to treat (an illness) | 用药或别的办法让病好 | 医生说他的病要＿＿两个月才能好。
患者 | huàn zhě | patient | 得了病的人 | 这位医生每天要看五十多个＿＿。
诊断 | zhěn duàn | to diagnose | 医生判定是什么病 | 医生检查以后，＿＿他得了胃病。
门诊 | mén zhěn | outpatient department | 医院里给不用住院的人看病的地方 | 他的病不重，去＿＿看看就行了。 | 诊所
急诊 | jí zhěn | emergency room | 医院里看急病的地方 | 半夜他肚子疼得很，只好去医院看＿＿。
诊所 | zhěn suǒ | clinic | 小的看病的地方 | 我家楼下开了一家小＿＿，看病很方便。 | 门诊
护士 | hù shi | nurse | 在医院照顾病人的人 | 那位＿＿给病人打了一针。
打针 | dǎ zhēn | to have an injection | 用针把药送进身体 | 孩子怕疼，不想＿＿。
治病 | zhì bìng | to cure illnesses | 给人看病，把病看好 | 医生的工作就是＿＿救人。
医疗 | yī liáo | medical care | 跟看病有关的 | 这个城市的＿＿条件很好，有很多大医院。
`,
  },
  {
    theme: ["Pain and Blood", "疼痛和血"],
    data: `
疼痛 | téng tòng | pain | 疼的感觉 | 这个药能减少病人的＿＿。
头痛 | tóu tòng | headache | 头疼 | 我昨天晚上没睡好，今天有点儿＿＿。 | 胃痛
痛苦 | tòng kǔ | suffering | 身体或心里很难过 | 病人很＿＿，一晚上都没睡着。 | 心痛
血压 | xuè yā | blood pressure | 血在血管里流的时候的压力 | 医生给他量了一下＿＿，有点儿高。
高血压 | gāo xuè yā | high blood pressure | 血压太高的病 | 爷爷有＿＿，医生让他少吃肉，多运动。
出血 | chū xuè | to bleed | 血从身体里流出来 | 他的手被刀划了一下，＿＿了。
血管 | xuè guǎn | blood vessel | 身体里让血流过的管子 | 血在＿＿里流动。
心痛 | xīn tòng | to feel sorry for | 心里很难过、舍不得 | 看到孩子病成这样，妈妈很＿＿。 | 痛苦
胃痛 | wèi tòng | stomachache | 胃里疼 | 他吃了太多冰的东西，晚上＿＿得睡不着。 | 头痛
抽血 | chōu xuè | to draw blood | 用针从身体里拿出一些血 | 体检的时候要＿＿，早上别吃东西。
`,
  },
  {
    theme: ["Breathing and the Body", "呼吸和身体"],
    data: `
呼吸 | hū xī | to breathe | 往里吸气和往外出气 | 山上空气很好，＿＿起来很舒服。
吸烟 | xī yān | to smoke | 抽烟 | 这里是医院，请不要＿＿。
吸收 | xī shōu | to absorb | 把东西收进来 | 多喝水能帮助身体＿＿营养。
胃口 | wèi kǒu | appetite | 想吃东西的感觉 | 他生病了，没有＿＿，什么都不想吃。
胃病 | wèi bìng | stomach trouble | 胃里的毛病 | 他吃饭不准时，得了＿＿。
骨头 | gǔ tou | bone | 身体里硬的东西 | 狗最喜欢吃＿＿。
骨折 | gǔ zhé | fracture | 骨头断了 | 他踢足球的时候腿受伤了，医生说是＿＿。
压力 | yā lì | pressure, stress | 让人紧张的事 | 快要考试了，他的＿＿很大。
心跳 | xīn tiào | heartbeat | 心一下一下地动 | 跑了半个小时以后，他的＿＿很快。
皮肤 | pí fū | skin | 身体外面的一层 | 夏天太阳很大，要保护好你的＿＿。
`,
  },
  {
    theme: ["Getting Better", "慢慢好起来"],
    data: `
恢复 | huī fù | to recover | 回到原来的样子 | 他的身体已经＿＿了，下星期就能上班。
受伤 | shòu shāng | to get hurt | 身体伤了 | 他打篮球的时候＿＿了。
难受 | nán shòu | to feel unwell | 身体或心里不舒服 | 我感冒了，全身都很＿＿。
活动 | huó dòng | to move about | 让身体动一动 | 你坐了一上午，起来＿＿一下吧。
生活 | shēng huó | life | 每天过的日子 | 退休以后，爷爷的＿＿很简单。
弱 | ruò | weak | 力气小，不强 | 他病了很久，身体很＿＿。
开始 | kāi shǐ | to begin | 从这时起做 | 电影七点＿＿，我们快走吧。
睡眠 | shuì mián | sleep | 睡觉 | 每天要有八个小时的＿＿，身体才会好。
维生素 | wéi shēng sù | vitamin | 身体需要的一种营养 | 水果里有很多＿＿。
养病 | yǎng bìng | to recuperate | 休息，让病慢慢好 | 医生让他在家＿＿，一个月不要上班。
`,
  },
  {
    theme: ["Inflammation and Viruses", "发炎和病毒"],
    data: `
发炎 | fā yán | to become inflamed | 身体的一个地方又红又疼 | 他的伤口＿＿了，要马上去医院。
病毒 | bìng dú | virus | 让人生病的很小的东西 | 这个＿＿传得很快，很多人都病了。
消毒 | xiāo dú | to disinfect | 让东西干净，没有让人生病的东西 | 这些碗筷要先＿＿，再给病人用。
中毒 | zhòng dú | to be poisoned | 吃了有毒的东西以后生病 | 他吃了坏了的鱼，食物＿＿了。
有毒 | yǒu dú | poisonous | 能让人生病或死去 | 这些花＿＿，千万别吃。
感染 | gǎn rǎn | to infect | 病毒进到身体里 | 他的伤口被＿＿了，一直不好。
传染 | chuán rǎn | to be contagious | 病从一个人到另一个人身上 | 感冒会＿＿，你最好在家休息。
预防 | yù fáng | to prevent | 先做准备，不让坏事发生 | 多运动可以＿＿很多病。
疫苗 | yì miáo | vaccine | 打进身体，让人不得某种病的药 | 孩子出生以后要打很多次＿＿。
抗生素 | kàng shēng sù | antibiotic | 一种治发炎的药 | 医生说感冒不用吃＿＿。
`,
  },
  {
    theme: ["Allergies and Diet", "过敏和饮食"],
    data: `
过敏 | guò mǐn | allergic | 身体对一些东西反应太大 | 我对花＿＿，一到春天就不舒服。 | 敏感
敏感 | mǐn gǎn | sensitive | 很容易感觉到 | 她的皮肤很＿＿，不能用这个牌子的东西。 | 过敏
皮 | pí | skin, peel | 外面的一层 | 吃苹果要不要去＿＿？
吃素 | chī sù | to be vegetarian | 不吃肉和鱼 | 他已经＿＿十年了，从来不吃肉。
素菜 | sù cài | vegetable dish | 没有肉的菜 | 今天的午饭有两个肉菜和一个＿＿。
原始 | yuán shǐ | primitive | 最早的，没有改变过的 | 这片森林还是＿＿的样子。
免疫力 | miǎn yì lì | immunity | 身体自己不得病的能力 | 他经常运动，＿＿很好，很少感冒。
防疫 | fáng yì | epidemic prevention | 不让传染病流行 | 学校做好了＿＿工作，没有人得病。
疫情 | yì qíng | epidemic | 传染病发生和流行的样子 | 那年发生了＿＿，很多人只能在家上班。
毒品 | dú pǐn | drugs | 让人离不开、伤害身体的东西 | 吸＿＿对身体的伤害非常大。
`,
  },
  {
    theme: ["In Hospital", "在医院"],
    data: `
住院 | zhù yuàn | to be in hospital | 住在医院里看病 | 他的病很重，要＿＿两个星期。
出院 | chū yuàn | to leave hospital | 病好了，离开医院 | 他的病好了，明天就能＿＿。
病房 | bìng fáng | ward | 医院里病人住的房间 | 他住在三楼的＿＿里。
病情 | bìng qíng | condition (of a patient) | 病的样子 | 医生说他的＿＿已经好多了。
大夫 | dài fu | doctor | 医生 | 这位＿＿看病很认真。
内科 | nèi kē | internal medicine | 医院里看身体里面的病的地方 | 他胃不舒服，去了医院的＿＿。 | 外科
外科 | wài kē | surgery department | 医院里做手术的地方 | 他要做手术，所以住在＿＿病房。 | 内科
牙科 | yá kē | dentistry | 医院里看牙的地方 | 我牙疼，下午要去＿＿。
药方 | yào fāng | prescription | 医生写的用药的单子 | 医生给他开了一个＿＿。
中药 | zhōng yào | Chinese medicine | 中国传统的药 | 奶奶不喜欢吃西药，喜欢喝＿＿。
`,
  },
  {
    theme: ["Body and Feelings", "身体和感受"],
    data: `
体温 | tǐ wēn | body temperature | 身体的温度 | 护士给他量了＿＿，三十八度。
体力 | tǐ lì | physical strength | 身体的力气 | 爬山要有很好的＿＿。 | 活力
活力 | huó lì | vigor | 让人觉得年轻、有力气的样子 | 这个城市很年轻，很有＿＿。 | 体力
养生 | yǎng shēng | to look after one's health | 照顾好身体，让自己少生病 | 爷爷很懂＿＿，每天早睡早起。
快活 | kuài huo | merry | 高兴 | 孩子们在公园里玩得很＿＿。
受不了 | shòu bu liǎo | cannot stand | 忍不住，太难受了 | 天太热了，我真＿＿。
接受 | jiē shòu | to accept | 收下，同意 | 他＿＿了医生的意见，开始每天运动。
感受 | gǎn shòu | feelings | 心里的感觉 | 说说你第一次出国的＿＿吧。
受到 | shòu dào | to receive | 得到 | 他的作品＿＿了大家的欢迎。
不断 | bù duàn | continuously | 一直不停 | 他＿＿努力，终于成功了。
`,
  },
  {
    theme: ["Breaking and Pressing", "断和压"],
    data: `
判断 | pàn duàn | to judge | 想清楚以后定下是对是错 | 你能＿＿出他说的是真话吗？
打断 | dǎ duàn | to interrupt | 让别人的话停下来 | 别人说话的时候，不要＿＿他。
中断 | zhōng duàn | to break off | 在中间停了 | 下大雨了，比赛＿＿了一个小时。
断 | duàn | to break | 分成两段 | 他的腿＿＿了，要休息三个月。
活 | huó | alive | 没有死 | 这条鱼还＿＿着，快把鱼放回水里吧。
苗条 | miáo tiao | slim | 身材细长，好看 | 她每天运动，身材很＿＿。
血 | xuè | blood | 身体里流着的红色的东西 | 天太干了，他的鼻子流＿＿了。
痛 | tòng | to ache | 疼 | 我的头很＿＿，想休息一下。
压 | yā | to press | 从上面用力 | 小心，别把鸡蛋＿＿坏了。
吸 | xī | to breathe in | 往里进气 | 他用力＿＿了一口气，跳进了水里。
`,
  },
  // Unit 2: Travel and Transport.
  {
    theme: ["Flying", "坐飞机"],
    data: `
航班 | háng bān | flight | 按时间飞的飞机 | 我的＿＿晚上八点起飞。
航空 | háng kōng | aviation | 在天上飞的事 | 他在一家＿＿公司工作，经常坐飞机。
航线 | háng xiàn | route (of planes or ships) | 飞机或船走的路 | 这家公司新开了一条去南方的＿＿。
机舱 | jī cāng | cabin (of a plane) | 飞机里坐人的地方 | 飞机起飞了，＿＿里很安静。
托运 | tuō yùn | to check in (luggage) | 把行李交给别人运送 | 你的箱子太大了，要＿＿，不能带上飞机。
延误 | yán wù | to be delayed | 因为一些事晚了 | 因为下大雪，很多航班都＿＿了。
抵达 | dǐ dá | to arrive | 到 | 飞机下午三点＿＿北京。 | 返回
靠窗 | kào chuāng | by the window | 在窗户旁边 | 我想要一个＿＿的座位，可以看外面。
随身 | suí shēn | (carried) on one's person | 带在身上 | 这个小包可以＿＿带上飞机。
返回 | fǎn huí | to return | 回到原来的地方 | 旅行结束了，我们明天＿＿北京。 | 抵达
`,
  },
  {
    theme: ["Driving", "开车"],
    data: `
驾驶 | jià shǐ | to drive, to pilot | 开（车、船、飞机） | 他会＿＿飞机。
驾照 | jià zhào | driving licence | 可以开车的证 | 他刚拿到＿＿，还不敢上高速。
拐弯 | guǎi wān | to turn a corner | 改变方向走 | 前面路口往左＿＿就到了。
轮胎 | lún tāi | tyre | 车轮外面的那一圈 | 车的＿＿坏了，我们得换一个新的。
轮子 | lún zi | wheel | 车下面会动的圆东西 | 这个箱子下面有四个＿＿，拉起来很方便。
弯 | wān | curved | 不直 | 这条路很＿＿，开车要小心。
靠边 | kào biān | to pull over | 往路边去 | 前面有警察，请把车＿＿停一下。
距离 | jù lí | distance | 两个地方中间有多远 | 我家和公司的＿＿不远，走路十分钟。
自驾 | zì jià | to drive oneself (on a trip) | 自己开车 | 这次我们＿＿去海边，不坐火车。
方向 | fāng xiàng | direction | 东、西、南、北 | 我不知道哪个＿＿是北，你知道吗？
`,
  },
  {
    theme: ["Trains and Ships", "火车和船"],
    data: `
列车 | liè chē | train | 火车 | 这辆＿＿是开往上海的。
轮船 | lún chuán | steamship | 大的船 | 我们坐＿＿去那个小岛。
港口 | gǎng kǒu | port | 很多船停的地方 | 这个城市有一个很大的＿＿，每天来往的船很多。 | 码头
码头 | mǎ tou | pier | 船停下来让人上下的地方 | 船到了＿＿，大家都下了船。 | 港口
船舱 | chuán cāng | cabin (of a ship) | 船里坐人、放东西的地方 | 外面风很大，我们回＿＿里去吧。
取票 | qǔ piào | to collect tickets | 拿买好的票 | 我在网上买了票，要先去车站＿＿。
往返 | wǎng fǎn | to go and come back | 去了又回来 | 从这里到北京，＿＿一次要八个小时。
长途 | cháng tú | long-distance | 路很远的 | 他坐了十个小时的＿＿汽车，很累。
沿途 | yán tú | along the way | 一路上 | ＿＿的风景很美，大家都在拍照。
桥 | qiáo | bridge | 让人和车从河上过去的路 | 河上有一座＿＿，过了河就是我家。
`,
  },
  {
    theme: ["Finding the Way", "找路"],
    data: `
迷路 | mí lù | to get lost | 找不到路 | 这个城市太大了，我第一次来就＿＿了。
路途 | lù tú | journey | 要走的路 | ＿＿很远，你们早点儿出发吧。
途中 | tú zhōng | on the way | 在路上 | 回家＿＿，他遇到了一个老朋友。
向导 | xiàng dǎo | guide | 带路的人 | 山里的路很难走，我们请了一个＿＿。
向 | xiàng | towards | 对着 | 一直＿＿前走，就能看到车站。
拐 | guǎi | to turn | 改变方向 | 到了第二个路口，往右＿＿。
靠近 | kào jìn | close to | 离得很近 | 我们的酒店＿＿火车站，很方便。
到达 | dào dá | to arrive | 到了要去的地方 | 路上堵车，我们晚上十点才＿＿酒店。
达到 | dá dào | to reach (a level) | 到了（要的水平） | 工厂这个月生产的东西＿＿了一万件。
随时 | suí shí | at any time | 什么时候都可以 | 有问题＿＿给我打电话。
`,
  },
  {
    theme: ["Islands and Provinces", "岛和省"],
    data: `
岛 | dǎo | island | 四面都是水的地方 | 海上有一个小＿＿，上面住着几户人家。
大陆 | dà lù | mainland | 大片的土地 | 从这个岛坐船一个小时就能到＿＿。 | 陆地
陆地 | lù dì | land | 地球上不是水的地方 | 地球上的海比＿＿大得多。 | 大陆
沿海 | yán hǎi | coastal | 靠海的地方 | 中国的＿＿城市很多，比如上海。
省 | shěng | province | 国家下面的一级地方 | 中国有很多个＿＿，我是从南方来的。
州 | zhōu | state | 美国等国家下面的一级地方 | 美国有五十个＿＿。
沿着 | yán zhe | along | 跟着（河、路）一直 | ＿＿这条河一直走，就能到公园。
省钱 | shěng qián | to save money | 少花钱 | 坐火车比坐飞机＿＿。
民宿 | mín sù | guesthouse | 当地人家里开的小旅馆 | 我们没住酒店，住在一个＿＿里，老板很热情。
住宿 | zhù sù | accommodation | 住的地方 | 这次旅行，吃饭和＿＿都很便宜。
`,
  },
  {
    theme: ["Money and Luggage", "换钱和行李"],
    data: `
兑换 | duì huàn | to exchange (money) | 用一个国家的钱换别的国家的钱 | 出国以前，我去银行＿＿了一些美元。
取 | qǔ | to take out | 拿 | 我去银行＿＿点儿钱。
取消 | qǔ xiāo | to cancel | 不做了 | 因为天气不好，航班被＿＿了。
随便 | suí biàn | as one likes | 想怎么样就怎么样 | 你想吃什么就点什么，＿＿。
随着 | suí zhe | along with | 跟着 | ＿＿经济的发展，出国旅行的人多了起来。
靠 | kào | to lean on | 身体挨着别的东西 | 他＿＿在窗户上睡着了。
托 | tuō | to ask (someone) to do | 请别人帮忙做 | 我＿＿朋友给我带了一些茶回来。
弯路 | wān lù | roundabout way | 不直的路；多走的路 | 有了地图，我们就不会走＿＿了。
旅途 | lǚ tú | journey | 旅行的路上 | 祝你＿＿快乐！
列 | liè | to list | 一个一个地写出来 | 请把要带的东西＿＿出来，别忘了。
`,
  },
  {
    theme: ["On the Road", "在路上"],
    data: `
轮流 | lún liú | to take turns | 一个接一个地做 | 路很远，我们两个人＿＿开车。
驾驶员 | jià shǐ yuán | driver, pilot | 开车或开飞机的人 | 飞机的＿＿说，还有半个小时到。
着陆 | zhuó lù | to land | 飞机落到地上 | 飞机安全＿＿了，大家都很高兴。
延长 | yán cháng | to extend | 变长 | 我们玩得很开心，想把旅行＿＿三天。 | 延期
延期 | yán qī | to put off | 推到以后 | 因为下雨，比赛＿＿了。 | 延长
单程 | dān chéng | one-way | 只去不回来 | 我买的是＿＿票，不回来了。
一路 | yī lù | the whole way | 整个路上 | 他太累了，＿＿上都在睡觉。
航行 | háng xíng | to sail | 船在水上走 | 大船在海上＿＿了十天。
返程 | fǎn chéng | return trip | 回来的路 | 我们的＿＿车票是星期天的。
迷 | mí | fan | 非常喜欢某个东西的人 | 他是个球＿＿，每场比赛都看。
`,
  },
  {
    theme: ["Seats and Distances", "座位和距离"],
    data: `
头等舱 | tóu děng cāng | first class | 飞机上最好的座位 | 坐＿＿很贵，但是很舒服。 | 经济舱
经济舱 | jīng jì cāng | economy class | 飞机上便宜的座位 | 为了省钱，我坐＿＿。 | 头等舱
距 | jù | to be away from | 离 | 这里＿＿市中心有十公里。
一向 | yī xiàng | always (until now) | 从来都是 | 他＿＿很准时，今天怎么迟到了？
外省 | wài shěng | another province | 别的省 | 很多＿＿的人来这个城市工作。
驶 | shǐ | to move (of vehicles) | 车或船开动 | 火车慢慢地＿＿进了车站。
出行 | chū xíng | to go out on a trip | 出门去别的地方 | 节日的时候，＿＿的人特别多。
换乘 | huàn chéng | to change (trains) | 下了这辆车再上另外的车 | 去机场要在下一站＿＿二号线。
加油站 | jiā yóu zhàn | petrol station | 给汽车加油的地方 | 车快没油了，前面有个＿＿。
公路 | gōng lù | highway | 车走的大路 | 这条＿＿通到海边。
`,
  },
  {
    theme: ["More Travel Words", "旅行用语"],
    data: `
可靠 | kě kào | reliable | 能相信的 | 他是一个很＿＿的人，你可以放心。
达成 | dá chéng | to reach (an agreement) | 得到一样的看法 | 两家公司终于＿＿了合作。
迷人 | mí rén | charming | 很让人喜欢 | 这里的风景太＿＿了。
香港 | xiāng gǎng | Hong Kong | 中国南方的一个城市 | ＿＿有很多高楼，晚上的灯很美。
向往 | xiàng wǎng | to long for | 很想去、很想得到 | 他一直很＿＿海边的生活。
发达 | fā dá | developed | 经济、技术水平高 | 这个城市的交通非常＿＿，去哪儿都很方便。
列车员 | liè chē yuán | train attendant | 在火车上工作的人 | ＿＿给我们送来了热水。
取得 | qǔ dé | to obtain | 得到 | 他在比赛中＿＿了第一名。
驾车 | jià chē | to drive a car | 开车 | 他每天＿＿上班，路上要一个小时。
胎 | tāi | tyre | 车轮外面的那一圈 | 自行车的＿＿没气了。
`,
  },
  // Unit 3: Media and the Internet.
  {
    theme: ["The Media", "媒体"],
    data: `
媒体 | méi tǐ | the media | 报纸、电视、网络这些传消息的东西 | 这件事很多＿＿都报道了。
自媒体 | zì méi tǐ | self-media | 个人在网上开的媒体 | 他不上班了，现在在网上做＿＿。
电视台 | diàn shì tái | TV station | 做电视节目的地方 | 他在＿＿当记者。
主持人 | zhǔ chí rén | host, presenter | 在节目里带着大家进行的人 | 这个节目的＿＿很会说话，大家都喜欢他。 | 主播
主播 | zhǔ bō | streamer, anchor | 在网上直播的人 | 这位＿＿每天晚上在网上直播三个小时。 | 主持人
评论 | píng lùn | comment | 说出来的看法 | 很多人在他的视频下面写了＿＿。
转发 | zhuǎn fā | to repost | 把别人发的东西再发出去 | 这条消息被＿＿了一万多次。
粉丝 | fěn sī | fan, follower | 喜欢一个人、常看他的东西的人 | 这个歌手有很多＿＿。
关注 | guān zhù | to follow | 在网上跟着看一个人 | 你在网上＿＿他了吗？他每天都发视频。
播出 | bō chū | to broadcast | 在电视、广播里放 | 这个节目每天晚上八点＿＿。
`,
  },
  {
    theme: ["Reading Online", "网上阅读"],
    data: `
阅读 | yuè dú | to read | 看（书、文章） | 他每天晚上都要＿＿一个小时。 | 浏览
浏览 | liú lǎn | to browse | 大概地看一看 | 我每天早上都会＿＿一下新闻网站。 | 阅读
浏览器 | liú lǎn qì | browser | 上网看网页用的软件 | 请打开＿＿，看看这个网页。
链接 | liàn jiē | link | 点一下就能打开别的网页的东西 | 我把＿＿发给你，你点一下就能看到。
注意 | zhù yì | to pay attention | 留心 | 过马路的时候要＿＿车。
标题 | biāo tí | headline, title | 文章的名字 | 这条新闻的＿＿很有意思，我一看就想读。
点击 | diǎn jī | to click | 用鼠标按一下 | ＿＿这里就能下载这个软件。
网页 | wǎng yè | web page | 网站上的一页 | 这个＿＿打不开了，你再试试。 | 主页
资讯 | zī xùn | information, news | 新的消息 | 这个软件每天给你送最新的＿＿。
主页 | zhǔ yè | homepage | 网站的第一页 | 你可以在我们的＿＿上找到电话号码。 | 网页
`,
  },
  {
    theme: ["Privacy", "隐私"],
    data: `
隐私 | yǐn sī | privacy | 不想让别人知道的个人的事 | 别看我的手机，里面有我的＿＿。 | 秘密
私人 | sī rén | private | 个人的 | 这是我的＿＿电话，请不要告诉别人。
秘密 | mì mì | secret | 不让别人知道的事 | 这是我们两个人的＿＿，别告诉别人。 | 隐私
私信 | sī xìn | private message | 网上只发给一个人的信 | 有问题可以给我发＿＿。
自私 | zì sī | selfish | 只想着自己 | 他很＿＿，从来不帮助别人。
主动 | zhǔ dòng | on one's own initiative | 不用别人说，自己去做 | 他经常＿＿帮助别人。
主要 | zhǔ yào | main | 最重要的 | 这本书的＿＿内容是什么？
主人 | zhǔ rén | owner | 有这个东西的人 | 这只狗的＿＿是谁？
主意 | zhǔ yi | idea | 想法，办法 | 我有一个好＿＿！
秘书 | mì shū | secretary | 帮领导做事的人 | 他的＿＿帮他安排了明天的会。
`,
  },
  {
    theme: ["Groups and Circles", "群和圈"],
    data: `
群 | qún | group, flock | 在一起的很多人或动物 | 一＿＿孩子在公园里玩。
群聊 | qún liáo | group chat | 很多人一起在网上聊天 | 我们班有一个＿＿，有什么事都在里面说。
朋友圈 | péng you quān | WeChat Moments | 微信里给朋友看的地方 | 她在＿＿里发了很多旅行的照片。
圈 | quān | lap | 绕一周 | 他在公园里跑了三＿＿。
晒 | shài | to show off (online) | 在网上给别人看自己的东西 | 他喜欢在网上＿＿自己做的菜。
晒太阳 | shài tài yáng | to sunbathe | 让太阳照着身体 | 冬天，老人们喜欢在外面＿＿。
人群 | rén qún | crowd | 很多人 | 她在＿＿里找不到她的孩子了。
群主 | qún zhǔ | group owner | 管一个群的人 | 我们班群的＿＿是班长。
发言 | fā yán | to speak (at a meeting) | 在会上说话 | 开会的时候，每个人都要＿＿。
留言 | liú yán | to leave a message | 写下要对别人说的话 | 他不在家，我给他＿＿了。
`,
  },
  {
    theme: ["Lies and Rumours", "谣言和骗局"],
    data: `
谣言 | yáo yán | rumour | 没有根据的话 | 网上的＿＿很多，不要随便相信。
虚假 | xū jiǎ | false | 不真实 | 这个广告里有很多＿＿的东西。
骗子 | piàn zi | swindler | 骗人的人 | 那个人是个＿＿，别相信他。
骗 | piàn | to deceive | 用假话让人相信 | 你别＿＿我，我知道这不是真的。
诈骗 | zhà piàn | fraud | 用假的办法骗钱 | 他接到了一个＿＿电话，说他中奖了。
造谣 | zào yáo | to spread rumours | 说没有的事来害别人 | 这个人在网上＿＿，被警察找上了门。
编 | biān | to make up | 想出假的事 | 他＿＿了一个故事，骗了很多人。
情况 | qíng kuàng | situation | 事情的样子 | 你那边的＿＿怎么样？
况且 | kuàng qiě | besides | 而且 | 太晚了，＿＿外面在下雨，你别走了。
虚心 | xū xīn | modest | 不骄傲，愿意听别人的意见 | 他很＿＿，经常向别人学习。
`,
  },
  {
    theme: ["Making Content", "做内容"],
    data: `
编辑 | biān jí | editor | 整理、修改文章的人 | 她在一家杂志社当＿＿。 | 主编
摄影 | shè yǐng | photography | 照相 | 他很喜欢＿＿，星期天经常出去拍照。
拍摄 | pāi shè | to shoot (a film) | 拍照片或电影 | 这部电影是在中国＿＿的。 | 编写
主题 | zhǔ tí | theme | 主要的内容 | 这次比赛的＿＿是保护环境。
游戏 | yóu xì | game | 玩的活动 | 孩子们在玩＿＿。
戏 | xì | play, opera | 在台上演的故事 | 我们今晚去看＿＿吧。
标准 | biāo zhǔn | standard | 能用来比的样子 | 他的普通话很＿＿。
目标 | mù biāo | goal | 想达到的地方 | 我今年的＿＿是学会游泳。
主编 | zhǔ biān | editor-in-chief | 编辑里的领导 | 这本杂志的＿＿是我的老师。 | 编辑
编写 | biān xiě | to compile | 写（书、课本） | 这本书是三位老师一起＿＿的。 | 拍摄
`,
  },
  {
    theme: ["Reviews", "评价"],
    data: `
评价 | píng jià | evaluation | 说好不好 | 大家对这家饭店的＿＿都很高。
好评 | hǎo píng | good review | 好的评价 | 这件衣服在网上有很多＿＿，买的人很多。
差评 | chà píng | bad review | 不好的评价 | 东西太差了，我给了一个＿＿。
批评 | pī píng | to criticize | 说别人的缺点 | 他上课说话，被老师＿＿了。
转 | zhuǎn | to turn | 改变方向 | 前面路口向右＿＿。
转变 | zhuǎn biàn | to change | 变化 | 他的想法有了很大的＿＿。
标签 | biāo qiān | label | 东西上写着字的小纸 | 衣服上的＿＿写着价钱。
打击 | dǎ jī | blow, setback | 让人难过、没信心的事 | 考试没考好，对他的＿＿很大。
热门 | rè mén | popular | 很多人关注的 | 这是今天网上最＿＿的新闻。
话题 | huà tí | topic | 谈话的内容 | 我们换个＿＿吧，别说工作了。
`,
  },
  {
    theme: ["Online Life", "网上生活"],
    data: `
网红 | wǎng hóng | internet celebrity | 在网上很有名的人 | 她在网上很有名，是个＿＿。
点赞 | diǎn zàn | to like (online) | 在网上表示喜欢 | 很多人给他的照片＿＿。
上传 | shàng chuán | to upload | 把东西放到网上 | 我把照片＿＿到网上了。
刷屏 | shuā píng | to flood the feed | 一件事在网上到处都是 | 这条新闻今天在网上＿＿了。
舞台 | wǔ tái | stage | 表演的台子 | 她站在＿＿上唱歌。
台 | tái | (measure word for machines) | 用于机器 | 我家有两＿＿电脑。
言论 | yán lùn | remarks | 说出来的看法 | 在网上发＿＿也要负责任。
主观 | zhǔ guān | subjective | 只按自己的想法 | 你的看法太＿＿了。
电台 | diàn tái | radio station | 做广播节目的地方 | 他每天开车的时候都听＿＿。
专注 | zhuān zhù | focused | 心思都在一件事上 | 他做作业的时候很＿＿。
`,
  },
  {
    theme: ["More Media Words", "媒体用语"],
    data: `
戏剧 | xì jù | drama | 在台上演的故事 | 他大学学的是＿＿，现在是演员。
传媒 | chuán méi | media (industry) | 做报纸、电视、网络的行业 | 她在一家＿＿公司工作。
转告 | zhuǎn gào | to pass on (a message) | 把别人的话说给另外的人听 | 他不在，我会＿＿他的。
转眼 | zhuǎn yǎn | in the blink of an eye | 很快 | ＿＿一年就过去了。
注重 | zhù zhòng | to lay stress on | 重视 | 这家公司很＿＿产品的质量。
名言 | míng yán | famous saying | 有名的话 | 这句＿＿是一位有名的作家说的。
预言 | yù yán | to predict | 先说出以后会发生的事 | 他＿＿这个队会赢，结果真的赢了。
民主 | mín zhǔ | democratic | 大家一起作决定 | 班长是大家选出来的，很＿＿。
主张 | zhǔ zhāng | to advocate | 有自己的看法，觉得应该这样做 | 我＿＿大家一起讨论以后再决定。
评选 | píng xuǎn | to choose by vote | 大家一起比较、选出 | 今年学校＿＿出了十个好学生。
`,
  },
  // Unit 4: History.
  {
    theme: ["Dynasties", "朝代"],
    data: `
朝代 | cháo dài | dynasty | 历史上一家人当皇帝的时期 | 唐朝是中国历史上很有名的一个＿＿。
唐朝 | táng cháo | the Tang dynasty | 中国七世纪到十世纪的朝代 | 李白是＿＿有名的诗人。
汉朝 | hàn cháo | the Han dynasty | 中国两千多年前的朝代 | “汉族”的名字是从＿＿来的。
明朝 | míng cháo | the Ming dynasty | 中国六百多年前的朝代 | 北京的故宫是＿＿的时候建的。
古代 | gǔ dài | ancient times | 很久以前 | 在＿＿，人们出门要骑马。
现代 | xiàn dài | modern times | 现在这个时代 | ＿＿人离不开手机。
年代 | nián dài | decade | 一个世纪里的十年 | 这是八十＿＿的老照片。
时代 | shí dài | era | 历史上的一段时期 | 我们生活在网络＿＿。
皇帝 | huáng dì | emperor | 古代国家最高的统治者 | 这个宫里以前住着＿＿。
皇宫 | huáng gōng | imperial palace | 皇帝住的地方 | 故宫以前是＿＿，现在是博物馆。
`,
  },
  {
    theme: ["Kings and Queens", "国王和王后"],
    data: `
国王 | guó wáng | king | 一个国家的王 | 这个故事说的是一个＿＿和他的女儿。
王子 | wáng zǐ | prince | 国王的儿子 | 故事里的＿＿最后找到了公主。
公主 | gōng zhǔ | princess | 国王的女儿 | 小女孩最喜欢听＿＿的故事。 | 王子
皇后 | huáng hòu | empress | 皇帝的妻子 | 皇帝和＿＿住在皇宫里。
王 | wáng | king, monarch | 一个国家最高的统治者 | 很久以前，他是这个国家的＿＿。 | 国王
帝王 | dì wáng | monarchs | 皇帝和国王 | 这里是古代＿＿住过的地方。
王朝 | wáng cháo | royal dynasty | 一个皇帝家的统治 | 这个＿＿只有三十年就没了。
后代 | hòu dài | descendants | 后来的人；孩子们 | 我们要保护好环境，留给＿＿。
清朝 | qīng cháo | the Qing dynasty | 中国最后一个朝代 | ＿＿结束以后，中国就没有皇帝了。
近代 | jìn dài | recent history | 离现在不太远的时代 | 这本书讲的是中国＿＿的历史。
`,
  },
  {
    theme: ["The Army", "军队"],
    data: `
将军 | jiāng jūn | general | 军队里很高的领导 | 这位＿＿带着军队打败了很多国家。
军队 | jūn duì | army | 国家的兵 | 这个国家的＿＿有一百万人。
军人 | jūn rén | serviceman | 在军队里工作的人 | 他的爸爸是＿＿，很少回家。 | 士兵
士兵 | shì bīng | soldier | 军队里最下面的兵 | 一个＿＿站在门口。 | 军人 战士
当兵 | dāng bīng | to serve in the army | 去军队里 | 他十八岁就去＿＿了。
兵 | bīng | soldiers | 军人 | 将军带着一万个＿＿出发了。
空军 | kōng jūn | air force | 在天上打仗的军队 | 他想当＿＿，开飞机。 | 海军
海军 | hǎi jūn | navy | 在海上打仗的军队 | 他在＿＿工作，经常坐船出海。 | 空军
军事 | jūn shì | military affairs | 跟军队、战争有关的事 | 他喜欢看＿＿新闻。
战士 | zhàn shì | warrior | 打仗的人 | 这些年轻的＿＿保护了国家。 | 士兵
`,
  },
  {
    theme: ["Victory and Defeat", "胜败"],
    data: `
胜利 | shèng lì | victory | 打赢了 | 经过三年的战争，他们终于＿＿了。
失败 | shī bài | to fail | 没有成功 | 这次＿＿了没关系，下次再来。 | 败
打败 | dǎ bài | to defeat | 打赢别人 | 我们队＿＿了去年的第一名。 | 战胜
战胜 | zhàn shèng | to overcome | 在战争、比赛或困难中赢了 | 他＿＿了自己的病，又回到了学校。 | 打败
胜 | shèng | to win | 赢 | 这场比赛，我们队三比一＿＿了。 | 败
败 | bài | to be defeated | 输 | 这场比赛我们＿＿了，下次再来。 | 失败 胜
胜负 | shèng fù | victory or defeat | 输赢 | 比赛的＿＿不重要，重要的是参加。
失去 | shī qù | to lose | 没有了 | 他在战争中＿＿了一条腿。
失望 | shī wàng | disappointed | 希望没有成为真的 | 他没有来，我很＿＿。
失业 | shī yè | unemployed | 没有工作了 | 公司关门了，很多人＿＿了。
`,
  },
  {
    theme: ["Heroes and Ancestors", "英雄和祖先"],
    data: `
英雄 | yīng xióng | hero | 为国家、为大家做了大事的人 | 他救了三个孩子，大家都说他是＿＿。
伟大 | wěi dà | great | 非常了不起 | 她是一位＿＿的母亲。
伟人 | wěi rén | great person | 非常了不起的人 | 他是一位写进了历史的＿＿。
祖先 | zǔ xiān | ancestors | 很早以前的家人 | 我们的＿＿很早就住在这里了。
祖国 | zǔ guó | motherland | 自己的国家 | 他在国外住了很多年，一直想回＿＿。
祖父 | zǔ fù | grandfather | 爸爸的爸爸 | 我的＿＿今年八十岁了，身体很好。
祖母 | zǔ mǔ | grandmother | 爸爸的妈妈 | 我的＿＿是一位很会做饭的老奶奶。
英国 | yīng guó | Britain | 欧洲的一个国家 | 他从＿＿来，说英语。
英语 | yīng yǔ | English (language) | 英国、美国等国家的人说的话 | 我会说汉语和＿＿。
雄伟 | xióng wěi | majestic | 又高又大，让人觉得了不起 | 长城非常＿＿。
`,
  },
  {
    theme: ["Remains of the Past", "古迹"],
    data: `
遗迹 | yí jì | ruins | 古代留下来的东西或地方 | 这里有很多古代的＿＿。 | 古迹
古迹 | gǔ jì | historic site | 古代的建筑或地方 | 这个城市有很多名胜＿＿。 | 遗迹
遗产 | yí chǎn | heritage | 前人留下的东西 | 长城是世界文化＿＿。
城墙 | chéng qiáng | city wall | 城外面的墙 | 这个老城的＿＿已经有六百年了。
墙 | qiáng | wall | 房子四边立着的部分 | ＿＿上有一张地图。
名胜 | míng shèng | famous scenic spot | 有名的风景好的地方 | 这里有很多＿＿，每年有很多人来旅游。
将来 | jiāng lái | future | 以后的日子 | 你＿＿想做什么工作？
遗失 | yí shī | to lose | 丢了 | 他在火车上＿＿了一个包。
文明 | wén míng | civilization | 社会发展到比较高的样子 | 中国有五千年的＿＿。
发明 | fā míng | invention | 做出以前没有的东西 | 纸是中国古代的四大＿＿之一。
`,
  },
  {
    theme: ["Rise and Fall", "兴亡"],
    data: `
建立 | jiàn lì | to establish | 开始有 | 这个国家是两百年前＿＿的。 | 成立
成立 | chéng lì | to found | 一个组织开始有 | 我们公司＿＿十年了。 | 建立
灭亡 | miè wáng | to perish | 国家没有了 | 这个国家在一千年前就＿＿了。
消灭 | xiāo miè | to wipe out | 让它全部没有 | 这个药能＿＿病毒。
死亡 | sǐ wáng | death | 死 | 这次地震造成了很多人＿＿。
立刻 | lì kè | at once | 马上 | 听到这个消息，他＿＿回了家。
建设 | jiàn shè | to build | 盖房子、修路，让地方变好 | 我们要把家乡＿＿得更美。
革命 | gé mìng | revolution | 推翻旧的，建立新的 | 那场＿＿以后，这个国家有了新的政府。
生命 | shēng mìng | life | 活着的能力 | 医生救了他的＿＿。
命运 | mìng yùn | fate | 一生会遇到的事 | 他相信自己的＿＿要靠自己。
`,
  },
  {
    theme: ["Formal Words", "书面语"],
    data: `
之前 | zhī qián | before | 以前 | 睡觉＿＿，别喝咖啡。
之后 | zhī hòu | after | 以后 | 毕业＿＿，他去了北京工作。
之一 | zhī yī | one of | 里面的一个 | 长城是世界上最有名的地方＿＿。
之间 | zhī jiān | between | 中间 | 我们两个人＿＿没有秘密。
此外 | cǐ wài | besides | 这个以外 | 他会说英语，＿＿还会说一点儿法语。
因此 | yīn cǐ | therefore | 所以 | 他每天练习，＿＿说得很好。
从此 | cóng cǐ | from then on | 从这个时候起 | 他十八岁离开了家，＿＿再也没回来。
如此 | rú cǐ | so, like this | 这样 | 没想到这里的风景＿＿美。
曾经 | céng jīng | once (in the past) | 以前有过 | 他＿＿在中国住过三年。
与 | yǔ | and | 和 | 这本书讲的是老人＿＿海的故事。
`,
  },
  // Unit 5: The Arts.
  {
    theme: ["Painting and Carving", "绘画和雕刻"],
    data: `
绘画 | huì huà | painting | 画画儿 | 她从小就学＿＿，画得很好。
雕刻 | diāo kè | to carve | 在木头、石头上刻出东西 | 这块石头上＿＿着一条龙。
雕像 | diāo xiàng | statue | 刻出来的人或动物 | 广场上有一个很大的＿＿。
墨水 | mò shuǐ | ink | 写字用的有颜色的水 | 我的笔没有＿＿了。
墨 | mò | ink stick | 画中国画用的黑色的东西 | 画中国画要用笔和＿＿。
彩色 | cǎi sè | in colour | 有很多颜色的 | 以前的照片是黑白的，现在都是＿＿的。
色彩 | sè cǎi | colours | 各样的颜色 | 这张画的＿＿很美。
描 | miáo | to trace | 照着样子画 | 孩子照着书上的画一笔一笔地＿＿。
描写 | miáo xiě | to describe | 用文字把样子写出来 | 这本小说＿＿了一个小村子的生活。
漫画 | màn huà | comics | 用画讲的故事 | 孩子们都喜欢看＿＿。
`,
  },
  {
    theme: ["Music and Dance", "音乐和舞蹈"],
    data: `
舞蹈 | wǔ dǎo | dance | 跳的舞 | 她从小学＿＿，跳得很好。
歌曲 | gē qǔ | song | 歌 | 这首＿＿很好听，我听了很多遍。 | 曲子
曲子 | qǔ zi | tune | 一段音乐 | 他在弹一首好听的＿＿。 | 歌曲
作曲 | zuò qǔ | to compose music | 写音乐 | 这首歌是他＿＿的。
弹 | tán | to play (a stringed instrument) | 用手指打出音乐 | 她会＿＿琴。
弹琴 | tán qín | to play the piano | 用手指在琴上打出音乐 | 她每天＿＿一个小时。
鼓 | gǔ | drum | 用手或木头打的乐器 | 他在乐队里打＿＿。
乐团 | yuè tuán | orchestra | 一起表演音乐的人 | 这个＿＿有一百多个人。
角色 | jué sè | role | 演员演的人 | 她在这部电影里演一个老师的＿＿。 | 主角
主角 | zhǔ jué | leading role | 最重要的角色 | 他是这部电影的＿＿。 | 角色
`,
  },
  {
    theme: ["Enjoying Art", "欣赏"],
    data: `
欣赏 | xīn shǎng | to appreciate | 看了觉得好，很喜欢 | 我们去美术馆＿＿了很多有名的画。
赏 | shǎng | to admire | 看，觉得美 | 中秋节的晚上，我们一起＿＿月。
精彩 | jīng cǎi | wonderful | 非常好看 | 昨天的比赛太＿＿了。
经典 | jīng diǎn | classic | 很好的，很多人一直喜欢的 | 这是一部＿＿电影，我看了很多遍。
古典 | gǔ diǎn | classical | 古代传下来的 | 他喜欢听＿＿音乐。
优雅 | yōu yǎ | elegant | 美，让人觉得很舒服 | 她走路的样子很＿＿。
有趣 | yǒu qù | interesting | 有意思 | 这个故事很＿＿，孩子们都笑了。
趣味 | qù wèi | fun | 让人觉得有意思的东西 | 这本书很有＿＿，我一下就看完了。
兴趣 | xìng qù | interest | 喜欢做某件事的心情 | 他对音乐很感＿＿。
乐趣 | lè qù | pleasure | 快乐 | 画画给他带来了很多＿＿。
`,
  },
  {
    theme: ["Creating", "创作"],
    data: `
创作 | chuàng zuò | to create (works of art) | 写或画出新的作品 | 这位作家＿＿了很多小说。 | 创造
创造 | chuàng zào | to create | 做出以前没有的东西 | 人用自己的手＿＿了美好的生活。 | 创作
创新 | chuàng xīn | to innovate | 做出新的东西或想出新的办法 | 公司要发展，就要不断＿＿。
灵感 | líng gǎn | inspiration | 突然想到的好主意 | 他在旅行中找到了写歌的＿＿。
想象 | xiǎng xiàng | to imagine | 想出没有看到的样子 | 你能＿＿一百年以后的世界吗？
形象 | xíng xiàng | image | 给人的样子 | 这个演员在大家心里的＿＿很好。 | 印象
印象 | yìn xiàng | impression | 留在心里的样子 | 你对北京的＿＿怎么样？ | 形象
著名 | zhù míng | famous | 很有名 | 他是一位＿＿的画家。
名著 | míng zhù | literary classic | 有名的书 | 这本小说是中国的四大＿＿之一。
灵活 | líng huó | nimble | 不死板，会变 | 这只猫很＿＿，一下就跳上了桌子。
`,
  },
  {
    theme: ["Spirit and Flavour", "精神和味道"],
    data: `
精神 | jīng shén | full of energy | 有活力 | 睡了一觉以后，他很有＿＿。 | 精力
精力 | jīng lì | energy | 力气和心思 | 他把全部＿＿都放在了工作上。 | 精神
精美 | jīng měi | exquisite | 做得很好，很漂亮 | 这本书里的画很＿＿。
神话 | shén huà | myth | 古代关于神的故事 | 这是一个中国古代的＿＿。
神 | shén | god | 人们相信的有很大能力的 | 很多古代的人相信天上有＿＿。
味道 | wèi dao | taste | 吃东西时的感觉 | 这个菜的＿＿很好。 | 口味
口味 | kǒu wèi | (personal) taste | 喜欢的味道 | 每个人的＿＿不一样，有的人喜欢辣，有的人喜欢甜。 | 味道
浪漫 | làng màn | romantic | 美好，让人心动 | 他给女朋友准备了很多花，真＿＿。
漫长 | màn cháng | very long | 时间很长 | 冬天很＿＿，我们等着春天来。
美味 | měi wèi | delicious | 很好吃 | 这家饭店的菜很＿＿。
`,
  },
  {
    theme: ["Performing", "表演"],
    data: `
表演 | biǎo yǎn | to perform | 演出 | 孩子们在台上＿＿节目。
表达 | biǎo dá | to express | 说出来、写出来想法 | 他不太会用中文＿＿自己的想法。
表现 | biǎo xiàn | performance | 做出来的样子 | 他在比赛中的＿＿很好。
表情 | biǎo qíng | facial expression | 脸上的样子 | 看他的＿＿，就知道他很高兴。
手表 | shǒu biǎo | wristwatch | 戴在手上看时间的东西 | 我的＿＿慢了五分钟。
表 | biǎo | form | 写个人资料用的纸 | 请在这张＿＿上写上你的名字。
代表 | dài biǎo | representative | 为大家说话、做事的人 | 他是我们班的＿＿。
收藏 | shōu cáng | to collect | 把东西收起来放好 | 他喜欢＿＿老邮票。
藏 | cáng | to hide | 放在别人找不到的地方 | 孩子把糖＿＿在了床下。
团体 | tuán tǐ | group | 很多人在一起的组织 | 这是一个跳舞的＿＿，有二十个人。
`,
  },
  {
    theme: ["Pictures and Mirrors", "图像和镜子"],
    data: `
图像 | tú xiàng | image | 画出来或拍出来的样子 | 电脑屏幕上的＿＿很清楚。
好像 | hǎo xiàng | to seem | 看起来是 | 天黑了，＿＿要下雨了。
像 | xiàng | to look like | 样子差不多 | 她长得很＿＿她妈妈。
镜子 | jìng zi | mirror | 能照出人的样子的东西 | 她每天出门以前都要照＿＿。
镜头 | jìng tóu | shot (in a film) | 电影里的一段 | 这部电影最后一个＿＿很美。
眼镜 | yǎn jìng | glasses | 戴在眼睛上帮人看清楚的东西 | 我看不清黑板，要戴＿＿。
现象 | xiàn xiàng | phenomenon | 看得到的事情的样子 | 这是一个很有意思的社会＿＿。
大象 | dà xiàng | elephant | 一种鼻子很长的大动物 | ＿＿的鼻子很长。
对象 | duì xiàng | boyfriend or girlfriend | 男朋友或女朋友 | 他三十岁了，还没有＿＿。
图形 | tú xíng | figure, shape | 画出来的样子 | 这张纸上画着很多＿＿，有三角形，也有正方形。
`,
  },
  {
    theme: ["More Art Words", "艺术用语"],
    data: `
打印 | dǎ yìn | to print (out) | 用电脑和机器把字印在纸上 | 请把这份文件＿＿出来。
印刷 | yìn shuā | printing | 把字和画印在纸上 | 中国古代的＿＿技术很有名。
团结 | tuán jié | united | 大家一条心 | 我们班的同学很＿＿。
剧团 | jù tuán | theatre troupe | 表演戏剧的团体 | 这个＿＿去过很多国家演出。
角度 | jiǎo dù | angle | 看问题的方向 | 从不同的＿＿看，这个问题有不同的答案。
角 | jiǎo | corner | 两边接在一起的地方 | 桌子的四个＿＿都很硬，小孩子要小心。
曲线 | qū xiàn | curve | 弯的线 | 他在纸上画了一条＿＿。
鼓掌 | gǔ zhǎng | to applaud | 两只手一起拍 | 表演结束了，大家都站起来＿＿。
团队 | tuán duì | team | 一起工作的一群人 | 我们的＿＿有十个人，大家一起工作。
精心 | jīng xīn | with great care | 很用心 | 妈妈＿＿准备了一桌好菜。
`,
  },
  // Unit 6: Law and Rights.
  {
    theme: ["Rights", "权利"],
    data: `
权利 | quán lì | right | 法律给人的可以做的事 | 每个孩子都有上学的＿＿。
人权 | rén quán | human rights | 人应该有的权利 | 每个国家都应该保护＿＿。
义务 | yì wù | duty | 应该做的事 | 保护环境是每个人的＿＿。
正义 | zhèng yì | justice | 公正的道理 | 他是一个有＿＿感的人，经常帮助别人。
意义 | yì yì | significance | 价值，作用 | 这次活动很有＿＿，大家学到了很多。
主义 | zhǔ yì | -ism | 一套理论或想法 | 这本书讲的是社会＿＿。
平等 | píng děng | equal | 有一样的权利 | 男女＿＿，大家都有一样的机会。 | 公平
公平 | gōng píng | fair | 对每个人都一样 | 这次比赛很＿＿，大家都很满意。 | 平等
和平 | hé píng | peace | 没有战争 | 大家都希望世界＿＿。
自主 | zì zhǔ | to decide for oneself | 自己作主 | 孩子长大了，可以＿＿选择自己的专业。
`,
  },
  {
    theme: ["Crime", "犯罪"],
    data: `
犯罪 | fàn zuì | to commit a crime | 做了法律不让做的事 | 警察的工作是打击＿＿。
罪犯 | zuì fàn | criminal | 犯了罪的人 | 警察终于抓到了那个＿＿。
犯 | fàn | to make (a mistake) | 做（错事） | 每个人都会＿＿错。
罪 | zuì | crime | 违法的行为 | 他犯了什么＿＿？
犯错 | fàn cuò | to make a mistake | 做错事 | 小孩子＿＿了，大人要好好跟他说。
犯法 | fàn fǎ | to break the law | 做法律不让做的坏事 | 偷东西是＿＿的。 | 犯罪
杀 | shā | to kill | 让动物或人死 | 他们＿＿了一只鸡，做了一桌好菜。
杀人 | shā rén | to commit murder | 让人死 | ＿＿是很重的罪。
严重 | yán zhòng | serious | 很重，很厉害 | 他的病很＿＿，要马上住院。
无罪 | wú zuì | not guilty | 没有犯罪 | 法院最后判他＿＿，他高兴地回家了。
`,
  },
  {
    theme: ["In Court", "法庭"],
    data: `
法庭 | fǎ tíng | court | 审判案件的地方 | 今天下午，他要上＿＿。
审判 | shěn pàn | to try (a case) | 法院对案件作出决定 | 这个案子下个月＿＿。
证人 | zhèng rén | witness | 看到事情发生，能说出经过的人 | 他是这件事的＿＿，看到了全部经过。
被告 | bèi gào | defendant | 被别人告的人 | ＿＿说他没有偷东西。 | 原告
原告 | yuán gào | plaintiff | 去法院告别人的人 | ＿＿说对方拿了东西没有付钱。 | 被告
辩论 | biàn lùn | to debate | 说出理由，跟别人争 | 我们班明天和二班＿＿，题目是网上购物好不好。
辩护 | biàn hù | to defend (in court) | 为自己或别人说理由 | 律师在法庭上为他＿＿。
某 | mǒu | a certain | 不说出名字的一个 | ＿＿天下午，他突然来找我。
某人 | mǒu rén | someone | 一个不说名字的人 | 这件事一定是＿＿告诉他的。
案件 | àn jiàn | (legal) case | 法律上的事情 | 警察正在调查这个＿＿。
`,
  },
  {
    theme: ["Thieves and Robbers", "小偷和抢劫"],
    data: `
小偷 | xiǎo tōu | thief | 偷东西的人 | 我的钱包被＿＿拿走了。
偷 | tōu | to steal | 不让人知道地拿走别人的东西 | 有人＿＿了我的自行车。 | 抢
偷偷 | tōu tōu | secretly | 不让别人知道地 | 他＿＿地看了她一眼。
防盗 | fáng dào | anti-theft | 不让东西被偷 | 我家装了新的＿＿门。
盗版 | dào bǎn | pirated | 没有得到同意就做出来卖的 | 不要买＿＿的书。
抢 | qiǎng | to snatch | 用力拿走 | 弟弟＿＿走了我的书。 | 偷
抢劫 | qiǎng jié | to rob | 用力量和刀枪拿走别人的钱 | 那个人在银行＿＿，被警察抓住了。
抓 | zhuā | to catch | 用手拿住；捉 | 警察＿＿到了那个小偷。 | 抓住
抓住 | zhuā zhù | to seize | 拿住，不让它走 | 你要＿＿这次机会。 | 抓
被捕 | bèi bǔ | to be arrested | 被警察抓 | 那个罪犯昨天＿＿了。
`,
  },
  {
    theme: ["Paying for Damage", "赔偿"],
    data: `
赔 | péi | to pay for (damage) | 让别人的东西坏了，给他钱或新的 | 你用坏了我的手机，要＿＿我一个新的。 | 赔偿
赔偿 | péi cháng | compensation | 因为让别人受了损失而给的钱 | 公司＿＿了他一万元。 | 赔
赔钱 | péi qián | to lose money (in business) | 做生意没赚到钱，钱少了 | 这个生意＿＿了，他很难过。
偿还 | cháng huán | to repay | 还（借的钱） | 他用了五年才＿＿了银行的钱。
承担 | chéng dān | to bear (responsibility) | 负起（责任） | 这件事你要＿＿全部责任。
承认 | chéng rèn | to admit | 说出是自己做的 | 他＿＿是自己拿了那本书。
继承 | jì chéng | to inherit | 接受前人留下的东西 | 他＿＿了爸爸的公司。
承受 | chéng shòu | to endure | 受着，忍着 | 他＿＿了很大的压力。
赔礼 | péi lǐ | to apologize formally | 向人道歉 | 你做错了，快去给人家＿＿道歉。
继父 | jì fù | stepfather | 妈妈后来的丈夫 | 他的＿＿对他很好，就像亲爸爸一样。
`,
  },
  {
    theme: ["Rules", "规定"],
    data: `
违反 | wéi fǎn | to violate | 不遵守 | 他＿＿了学校的规定，被老师批评了。
违法 | wéi fǎ | illegal | 不合法 | 开车喝酒是＿＿的。
违规 | wéi guī | to break the rules | 不按规定做 | 他在比赛中＿＿了三次，不能再比了。
禁止 | jìn zhǐ | to prohibit | 不让做 | 这里＿＿吸烟。 | 不许
停止 | tíng zhǐ | to stop | 停下来 | 雨＿＿了，我们出去吧。
为止 | wéi zhǐ | up to | 到……的时候 | 到今天＿＿，已经有一百个人报名了。
允许 | yǔn xǔ | to allow | 同意别人做 | 妈妈不＿＿我晚上出去玩。
不许 | bù xǔ | must not | 不可以 | 上课的时候＿＿玩手机。 | 禁止
许可 | xǔ kě | permission | 同意 | 没有老师的＿＿，不能进这个房间。
禁烟 | jìn yān | smoking ban | 不让吸烟 | 这家饭店是＿＿的，想抽烟要到外面去。
`,
  },
  {
    theme: ["Prison and Doubt", "监狱和疑问"],
    data: `
监狱 | jiān yù | prison | 关犯人的地方 | 他犯了罪，被关进了＿＿。
犯人 | fàn rén | prisoner | 犯了罪被关起来的人 | ＿＿在监狱里也要工作。
监视 | jiān shì | to keep watch on | 一直看着 | 警察在外面＿＿着这个人。
监考 | jiān kǎo | to invigilate | 考试的时候看着学生 | 今天的考试由王老师＿＿。
疑问 | yí wèn | doubt, question | 不明白的地方 | 你还有什么＿＿吗？
可疑 | kě yí | suspicious | 让人觉得有问题 | 那个人很＿＿，一直站在门口看。
任何 | rèn hé | any | 不管什么 | ＿＿人都不能进这个房间。
如何 | rú hé | how | 怎么样 | 你觉得这本书＿＿？
为何 | wèi hé | why | 为什么 | 他＿＿不来？
何必 | hé bì | there is no need | 不必 | 这点小事，你＿＿生气呢？
`,
  },
  {
    theme: ["Calm and Strict", "平和严"],
    data: `
平时 | píng shí | usually | 一般的时候 | 他＿＿七点起床，今天六点就起来了。 | 平常
平常 | píng cháng | ordinary | 普通 | 今天是很＿＿的一天，没有什么特别的事。 | 平时
平安 | píng ān | safe and sound | 没有危险 | 祝你一路＿＿！
平静 | píng jìng | calm | 安静，没有变化 | 听了这个消息，他的心很久都不能＿＿。
严格 | yán gé | strict | 认真，一点儿也不放松 | 我们的老师很＿＿，作业错一个字都不行。 | 严
水平 | shuǐ píng | level | 达到的高度 | 他的中文＿＿很高。
平方 | píng fāng | square (of a unit) | 面积的单位 | 这个房间有二十＿＿米。
平板 | píng bǎn | tablet (computer) | 一种比手机大的电脑 | 他用＿＿看电影。
严 | yán | strict (with someone) | 要求很高 | 他爸爸对他很＿＿。 | 严格
严禁 | yán jìn | to strictly forbid | 一定不让 | 加油站内＿＿吸烟。
`,
  },
  {
    theme: ["More Law Words", "法律用语"],
    data: `
权力 | quán lì | power | 管理别人、决定事情的力量 | 他是公司的老板，＿＿很大。
家庭 | jiā tíng | family | 一家人 | 他出生在一个很普通的＿＿。
抢救 | qiǎng jiù | to give emergency treatment | 很急地救 | 医生正在＿＿病人。
有权 | yǒu quán | to have the right to | 法律上可以这样做 | 你＿＿知道这件事的真相。
版权 | bǎn quán | copyright | 作品是谁的的权利 | 这本书的＿＿是出版社的。
特权 | tè quán | privilege | 特别的权利 | 他是老板的儿子，但在公司里没有＿＿。
审 | shěn | to examine | 看一遍，判断对不对 | 这份文件要请领导＿＿一下。
有罪 | yǒu zuì | guilty | 犯了罪 | 他说自己没有偷，可是证据说明他＿＿。
捕鱼 | bǔ yú | to fish | 抓鱼 | 爷爷年轻的时候在海上＿＿。
某些 | mǒu xiē | certain, some | 一部分 | ＿＿人不喜欢吃辣的。
`,
  },
];
