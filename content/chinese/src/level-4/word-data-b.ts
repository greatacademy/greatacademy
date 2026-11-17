// The words of units 7 to 12 of level 4 (docs/chinese-curriculum.md §8.4), in the format of level 3 (../level-3/word-data.ts).

import type { LevelWordBatch } from "../level-2/level.ts";

/** wordBatchesB are the 48 word batches of units 7 to 12 of level 4, in teaching order. */
export const wordBatchesB: readonly LevelWordBatch[] = [
  // The Economy
  {
    theme: ["Trade", "贸易"],
    data: `
贸易 | mào yì | trade | 国家之间买卖东西 | 这两个国家之间的＿＿一年比一年多。 | 交易 外贸
外贸 | wài mào | foreign trade | 跟外国做的买卖 | 他在一家＿＿公司工作，常常跟外国人打交道。 | 贸易
交易 | jiāo yì | deal, transaction | 一次买和卖 | 这笔＿＿让两家公司都赚了钱。 | 贸易
进口 | jìn kǒu | to import | 从外国买进来 | 这些水果是从南方的国家＿＿的。
买家 | mǎi jiā | buyer | 买东西的人 | 这个房子卖了很久，还没有找到＿＿。
卖家 | mài jiā | seller | 卖东西的人 | 我在网上买的鞋太小了，就请＿＿给我换一双。
供应商 | gōng yìng shāng | supplier | 提供货物的公司 | 这家工厂的零件都来自同一个＿＿。
零售 | líng shòu | retail | 一件一件地卖给顾客 | 这家公司不做＿＿，只把货卖给商店。
汇率 | huì lǜ | exchange rate | 两国的钱换算的比例 | 今天美元的＿＿又变了，一百美元能换多少人民币？
外汇 | wài huì | foreign currency | 外国的钱 | 去国外旅行以前，他到银行换了一些＿＿。
`,
  },
  {
    theme: ["Investing", "投资"],
    data: `
投资 | tóu zī | to invest | 把钱用在能赚钱的事上 | 他把钱＿＿在一家新公司里。 | 投入 资本
投入 | tóu rù | to put in | 把钱、时间或力气放进去 | 为了做好这件事，他＿＿了很多时间和力气。 | 投资
投资者 | tóu zī zhě | investor | 拿钱买股票或开公司想赚钱的人 | 股市下跌，很多＿＿都亏了钱。 | 股东
股票 | gǔ piào | stock, share | 可以买卖的公司资本的凭证 | 他买了一些这家公司的＿＿。 | 股份
股市 | gǔ shì | stock market | 买卖股票的市场 | 最近＿＿很热，很多人都去买股票。
股东 | gǔ dōng | shareholder | 有公司股份的人 | 公司每年都要开一次＿＿大会。 | 投资者
股份 | gǔ fèn | stake | 公司资本里的一份 | 他在这家公司有百分之十的＿＿。 | 股票
分红 | fēn hóng | to pay a dividend | 把赚的钱分给股东 | 公司今年赚了很多钱，过年前给大家＿＿。
风险 | fēng xiǎn | risk | 可能出现的危险 | 买股票有＿＿，你要想清楚。
资本 | zī běn | capital | 用来做生意、赚钱的钱 | 开公司需要很多＿＿。 | 投资
`,
  },
  {
    theme: ["Rich and Poor", "贫和富"],
    data: `
财富 | cái fù | wealth | 很多钱和值钱的东西 | 他觉得健康和知识才是最大的＿＿。 | 财产 资产
财产 | cái chǎn | property | 个人有的钱、房子和东西 | 他死后，所有的＿＿都留给了女儿。 | 财富 资产
发财 | fā cái | to get rich | 赚到很多钱 | 他做生意＿＿以后，买了一个大房子。
理财 | lǐ cái | to manage money | 管好自己的钱 | 她很会＿＿，每个月都能存下一些钱。
贫穷 | pín qióng | poor | 没有钱，生活难 | 他小时候家里很＿＿，常常吃不饱。
穷人 | qióng rén | the poor | 没有钱的人 | 这家医院给＿＿看病不要钱。
贫富 | pín fù | rich and poor | 穷和有钱 | 这个城市的＿＿差别很大。
资产 | zī chǎn | assets | 公司或个人有的钱和值钱的东西 | 这家公司的＿＿有几千万元。 | 财产 财富
本钱 | běn qián | money to start a business | 做生意最开始用的钱 | 他想开一家小店，可是没有＿＿，只好先向朋友借。
财经 | cái jīng | finance and economics | 跟钱和经济有关的事 | 他每天晚上都看电视上的＿＿新闻。
`,
  },
  {
    theme: ["Borrowing and Lending", "借钱和还钱"],
    data: `
借钱 | jiè qián | to borrow money | 向别人要钱，以后再还 | 他没带钱包，只好向朋友＿＿。
贷款 | dài kuǎn | loan | 向银行借的钱 | 买房子的时候，他向银行申请了＿＿。
还钱 | huán qián | to pay back | 把借的钱给回去 | 你借了我的钱，什么时候＿＿？
借口 | jiè kǒu | excuse | 不想做事时说的理由 | 他总找＿＿不去上课。
利息 | lì xī | interest | 借钱或存钱时多出来的钱 | 把钱存在银行里，每年都有一点＿＿。 | 利率
利率 | lì lǜ | interest rate | 利息和本金的比例 | 银行今年提高了贷款的＿＿。 | 利息
汇款 | huì kuǎn | to send money | 通过银行把钱寄给别人 | 他每个月都给家里＿＿。
现金 | xiàn jīn | cash | 纸做的钱 | 这家店不收＿＿，只能用手机付款。
金额 | jīn é | sum of money | 钱的数目 | 付款以前，请看清楚＿＿对不对。
本金 | běn jīn | principal | 借来或存进去的钱，不算利息 | 他借了一万块，三年后还了＿＿和利息。
`,
  },
  {
    theme: ["Profit and Loss", "赚和赔"],
    data: `
收入 | shōu rù | income | 得到的钱 | 他的＿＿不高，可是生活得很快乐。
损失 | sǔn shī | loss | 失去的东西 | 这场大火给工厂带来了很大的＿＿。 | 亏损
亏损 | kuī sǔn | to make a loss | 公司赔钱 | 这家公司去年＿＿了一千万元。 | 损失 亏本
吃亏 | chī kuī | to lose out | 受到损失，不划算 | 他太老实了，跟别人做生意常常＿＿。
亏本 | kuī běn | to sell at a loss | 卖的钱比成本少 | 这些衣服卖这么便宜，商店不会＿＿吗？ | 亏损
利润 | lì rùn | profit | 做生意赚到的钱 | 这些产品的＿＿很高。
破产 | pò chǎn | to go bankrupt | 钱都赔光了，开不下去 | 这家公司亏了很多钱，最后＿＿了。
涨价 | zhǎng jià | to go up in price | 价格变高 | 最近菜又＿＿了，比上个月贵了不少。
上涨 | shàng zhǎng | to rise | 往高处走 | 今年房价＿＿了很多。 | 下跌
下跌 | xià diē | to fall | 往下降 | 今天股票＿＿了，很多人亏了钱。 | 上涨
`,
  },
  {
    theme: ["The Market", "市场"],
    data: `
竞争 | jìng zhēng | to compete | 互相争着要胜过对方 | 这两家公司一直在＿＿，都想多卖一些手机。
竞争力 | jìng zhēng lì | competitiveness | 胜过对手的能力 | 价格太高，我们的产品就没有＿＿了。
需要 | xū yào | to need | 一定要有 | 我＿＿一台新电脑。
需求 | xū qiú | demand | 大家想买的数量 | 夏天对空调的＿＿很大。
供应 | gōng yìng | to supply | 不断地给出货物 | 这家工厂给全国的商店＿＿牛奶。 | 提供
提供 | tí gōng | to provide | 拿出来给别人用 | 这家旅馆为客人＿＿免费的早饭。 | 供应
要求 | yāo qiú | to require | 提出希望做到的事 | 老板＿＿我们明天早上八点到公司。
成本 | chéng běn | cost | 做出东西要用的钱 | 做这个杯子的＿＿只要两块钱。
讨价还价 | tǎo jià huán jià | to bargain | 买东西时双方争价钱 | 在这个市场买东西，可以＿＿。
供不应求 | gōng bù yìng qiú | demand exceeds supply | 想买的人多，货少 | 这个新手机卖得太好了，一直＿＿。
`,
  },
  {
    theme: ["Finance", "金融"],
    data: `
金融 | jīn róng | finance | 银行、股票等跟钱的流通有关的事 | 他大学学的是＿＿，现在在银行工作。
资金 | zī jīn | funds | 做事要用的钱 | 我们想开一家店，可是＿＿不够。 | 预算
奖金 | jiǎng jīn | bonus | 工作做得好多得的钱 | 过年前，公司给每个人发了＿＿。
金钱 | jīn qián | money | 钱 | 他认为健康比＿＿更重要。
财务 | cái wù | finances | 单位里管钱的事 | 他在公司的＿＿部门工作，每天跟数字打交道。
会计 | kuài jì | accountant | 管账的人 | 公司的＿＿每个月都要算一次账。
预算 | yù suàn | budget | 事先算好要花的钱 | 这次旅行的＿＿是五千元。 | 资金
开支 | kāi zhī | spending | 花出去的钱 | 孩子上学以后，家里的＿＿大了很多。 | 收支
收支 | shōu zhī | income and spending | 收入和花出去的钱 | 他每个月都记下家里的＿＿。 | 开支
支付 | zhī fù | to pay | 付钱 | 现在很多人用手机＿＿。
`,
  },
  {
    theme: ["Sums", "计算"],
    data: `
计算 | jì suàn | to calculate | 用数学的方法算出结果 | 请你＿＿一下这些东西一共多少钱。
打算 | dǎ suàn | to plan | 想要这样做 | 你明年有什么＿＿？
算是 | suàn shì | to count as | 可以说是 | 这件衣服一百块，＿＿便宜的了。
算了 | suàn le | forget it | 不要再说了，就这样吧 | ＿＿，你不想去就别去了。
就算 | jiù suàn | even if | 即使 | ＿＿明天下雨，我也要去。
划算 | huá suàn | worth it | 花的钱少，得到的多 | 买一送一，真＿＿！
总共 | zǒng gòng | altogether | 全部加起来 | 我们班＿＿有三十个学生。
总数 | zǒng shù | total | 加起来的数目 | 请把这些数字加起来，看看＿＿是多少。
换算 | huàn suàn | to convert | 把一种单位的数变成另外一种 | 你能把一百美元＿＿成人民币吗？
平均 | píng jūn | average | 平分以后每份一样多 | 这次考试，我们班的＿＿分是八十分。
`,
  },
  {
    theme: ["Change and Reform", "改变和改革"],
    data: `
改变 | gǎi biàn | to change | 变成别的样子 | 那次旅行＿＿了他的一生。
改善 | gǎi shàn | to improve | 让情况变得更好 | 这几年，大家的生活＿＿了很多。 | 改进
改革 | gǎi gé | to reform | 把旧的制度改成新的 | 国家正在进行经济＿＿。
改进 | gǎi jìn | to improve (a method) | 让方法、技术变得更好 | 我们要＿＿工作的方法。 | 改善
修改 | xiū gǎi | to revise | 改正文章、计划里的问题 | 老师让我再＿＿一下这篇作文。 | 改正
改正 | gǎi zhèng | to correct | 把错的变成对的 | 你写错了三个字，请＿＿。 | 修改
改造 | gǎi zào | to convert | 改成新的样子，作新的用处 | 这个旧工厂被＿＿成了一个博物馆。
提高 | tí gāo | to raise | 使变得更高 | 我们要＿＿产品的质量。 | 改进 改善
提出 | tí chū | to put forward | 说出意见、问题等 | 他在会上＿＿了一个好办法。
总结 | zǒng jié | to sum up | 把做过的事想一遍，找出经验 | 每年十二月，每个部门都要＿＿一年的工作。
`,
  },
  // Feelings
  {
    theme: ["Anger and Hate", "生气和恨"],
    data: `
恨 | hèn | to hate | 非常不喜欢，仇视 | 他骗走了我所有的钱，我很＿＿他。
恨不得 | hèn bu de | to be dying to | 非常想马上就做 | 听到这个好消息，他＿＿马上飞回家。
怒火 | nù huǒ | fury | 像火一样的生气 | 看到孩子被人打了，妈妈心里的＿＿一下子就上来了。 | 怒气 火气
发怒 | fā nù | to fly into a rage | 表现出很生气的样子 | 他平时很安静，很少＿＿。 | 发火 大怒
怒气 | nù qì | anger | 心里生气的情绪 | 他脸上带着＿＿，一句话也不说。 | 火气 怒火
发火 | fā huǒ | to lose one's temper | 生气，大声说话 | 别为这点小事＿＿。 | 发怒
火气 | huǒ qì | temper | 容易生气的脾气 | 他年轻的时候＿＿很大，现在好多了。 | 怒气 怒火
气人 | qì rén | infuriating | 让人生气 | 他又迟到了，真＿＿！
大怒 | dà nù | to be furious | 非常非常生气 | 国王听了，＿＿，马上把他关了起来。 | 发怒
气死 | qì sǐ | to make furious | 让人生气到了极点 | 他又把我的新衣服穿走了，我快被他＿＿了！
`,
  },
  {
    theme: ["Fear", "害怕"],
    data: `
恐怕 | kǒng pà | I'm afraid that | 表示担心，估计 | 天这么黑，＿＿要下雨了。
恐惧 | kǒng jù | fear | 很深的害怕 | 很多人对死亡都有＿＿。 | 惧怕
惧怕 | jù pà | to dread | 害怕 | 他从小就＿＿黑夜，不敢一个人睡觉。 | 恐惧
惊恐 | jīng kǒng | terrified | 又吃惊又害怕 | 地震发生时，人们＿＿地跑出了大楼。 | 惊慌 慌张
慌 | huāng | flustered | 心里很急，不知道怎么办 | 别＿＿，我们慢慢想办法。 | 心慌 慌张 惊慌 恐慌
慌张 | huāng zhāng | in a fluster | 着急，动作乱 | 他＿＿地跑进教室，说他的钱包不见了。 | 慌 惊慌 惊恐
惊慌 | jīng huāng | alarmed | 吃惊而手忙脚乱 | 着火了！大家不要＿＿，从这个门出去。 | 慌 慌张 惊恐 恐慌
心慌 | xīn huāng | nervous | 心里着急不安 | 第一次上台讲话，我有点儿＿＿。 | 慌
恐慌 | kǒng huāng | panic | 很多人一起害怕不安 | 疫情刚开始时，很多人都很＿＿，抢着买米和油。 | 慌 惊慌
恐高 | kǒng gāo | afraid of heights | 怕站在高处 | 我＿＿，不敢站在十楼的窗前往下看。
`,
  },
  {
    theme: ["Sadness", "悲伤"],
    data: `
悲伤 | bēi shāng | sad | 伤心 | 听到爷爷去世的消息，他非常＿＿。 | 悲痛 心酸 痛心
悲痛 | bēi tòng | grief-stricken | 非常非常伤心 | 他＿＿得说不出一句话。 | 悲伤 痛心
悲观 | bēi guān | pessimistic | 总往坏处想 | 别那么＿＿，事情会好起来的。 | 伤感
心酸 | xīn suān | heartbroken | 心里又难过又痛苦 | 想起小时候的苦日子，他就感到＿＿。 | 伤感 悲伤
痛心 | tòng xīn | deeply grieved | 非常难过、可惜 | 看到这么美的森林被大火烧了，大家都很＿＿。 | 悲伤 悲痛
伤感 | shāng gǎn | sentimental | 有点难过，有点感动 | 每次听这首老歌，他都有些＿＿。 | 悲观 心酸
心疼 | xīn téng | to feel for | 舍不得，十分爱怜 | 看到孩子病了，妈妈很＿＿。
不幸 | bú xìng | unfortunately | 运气很坏 | 他三岁时，父母＿＿去世了。
悲剧 | bēi jù | tragedy | 结果很坏的戏或事情 | 这个故事是一个＿＿，最后男女主人公都死了。
失意 | shī yì | frustrated | 工作或生活不顺心 | 他最＿＿的时候，是朋友一直陪着他。
`,
  },
  {
    theme: ["Surprise and Envy", "惊讶和羡慕"],
    data: `
惊讶 | jīng yà | surprised | 感到很奇怪 | 他的中文说得这么好，大家都很＿＿。 | 吃惊
吃惊 | chī jīng | to be startled | 受到突然的刺激，感到意外 | 看到他瘦了这么多，我＿＿得说不出话来。 | 惊讶
惊喜 | jīng xǐ | pleasant surprise | 又吃惊又高兴 | 生日那天，朋友们给了我一个＿＿。
震惊 | zhèn jīng | to shock | 让人非常吃惊 | 这条新闻＿＿了全世界。
惊人 | jīng rén | astonishing | 让人吃惊 | 他的记忆力好得＿＿。
惊动 | jīng dòng | to disturb | 打扰，让人不安静 | 爷爷在睡觉，别＿＿他。
羡慕 | xiàn mù | to envy | 看到别人好，希望自己也有 | 他有这么好的工作，大家都很＿＿他。 | 爱慕
爱慕 | ài mù | to adore | 喜欢，看重 | 她又漂亮又聪明，很多男孩都＿＿她。 | 羡慕
着迷 | zháo mí | fascinated | 非常喜欢，放不下 | 他对中国历史很＿＿，每天都看历史书。
心动 | xīn dòng | tempted | 有了想要的念头 | 这个房子又大又便宜，我有点＿＿了。
`,
  },
  {
    theme: ["Alone", "孤独"],
    data: `
寂寞 | jì mò | lonely | 冷清，没人陪 | 孩子们都去外地上学了，老人在家很＿＿。 | 孤独 孤单
孤独 | gū dú | solitary | 一个人，没有朋友 | 他性格内向，从小就很＿＿。 | 寂寞 孤单
孤单 | gū dān | alone | 只有一个人，没有人陪着 | 有你陪着我，我就不＿＿了。 | 寂寞 孤独
单独 | dān dú | in private | 不跟别人在一起 | 老师想跟你＿＿谈谈。
独自 | dú zì | by oneself | 自己一个人 | 他＿＿一人去了国外。
独立 | dú lì | independent | 不靠别人 | 孩子长大了，要学会＿＿生活。
孤儿 | gū ér | orphan | 没有父母的孩子 | 他从小就是＿＿，没有见过自己的爸爸妈妈。
独生子 | dú shēng zǐ | only son | 家里唯一的儿子 | 他是家里的＿＿，没有哥哥，也没有弟弟。
想家 | xiǎng jiā | homesick | 想念家和家人 | 他第一次离开家，晚上常常＿＿。
独特 | dú tè | unique | 特别的，跟别的都不一样 | 她唱歌的声音很＿＿，一听就知道是她。
`,
  },
  {
    theme: ["Excitement and Regret", "激动和后悔"],
    data: `
后悔 | hòu huǐ | to regret | 做了以后觉得不该做 | 我真＿＿以前没有好好学习。
反悔 | fǎn huǐ | to go back on one's word | 说好的事又不认了 | 你已经答应了，不能＿＿。
激动 | jī dòng | moved, excited | 感情一下子起来 | 见到多年不见的老朋友，他＿＿得哭了。 | 兴奋
兴奋 | xīng fèn | excited | 非常高兴，精神很足 | 明天要去旅行，孩子们＿＿得睡不着。 | 激动
感激 | gǎn jī | grateful | 心里非常感谢 | 你帮了我这么多，我非常＿＿你。
激情 | jī qíng | passion | 很强的热情 | 他对工作充满了＿＿。
害羞 | hài xiū | shy | 不好意思，脸红 | 小女孩很＿＿，见了生人就红了脸。
羞 | xiū | to blush | 不好意思 | 他被大家说得＿＿红了脸。
激发 | jī fā | to arouse | 使兴趣、力量出现 | 这本书＿＿了他学习历史的兴趣。
勤奋 | qín fèn | diligent | 很努力，不怕苦 | 他学习很＿＿，每天都学到很晚。
`,
  },
  {
    theme: ["Happiness", "幸福"],
    data: `
愉快 | yú kuài | pleasant | 快乐，舒服 | 祝你旅途＿＿！ | 痛快
幸福 | xìng fú | happy (life) | 生活美满，称心如意 | 他们一家人生活得很＿＿。
幸运 | xìng yùn | lucky | 运气好 | 他很＿＿，第一次买彩票就中了大奖。
幸好 | xìng hǎo | luckily | 多亏 | ＿＿你提醒我，不然我就忘了。
庆幸 | qìng xìng | to be glad (of a lucky escape) | 为结果比想的好而高兴 | 车坏了，人没受伤，他觉得很＿＿。
痛快 | tòng kuài | to one's heart's content | 舒畅，尽兴 | 今天玩得真＿＿！ | 愉快
满足 | mǎn zú | satisfied | 觉得已经够了 | 他对现在的生活很＿＿。 | 心满意足
心满意足 | xīn mǎn yì zú | perfectly content | 非常满意 | 看完这场好看的电影，他＿＿地回家了。 | 满足
笑容 | xiào róng | smile | 笑的样子 | 她脸上总是带着＿＿。
幸福感 | xìng fú gǎn | sense of well-being | 觉得生活美好的感觉 | 有了自己的小家，他的＿＿更高了。
`,
  },
  {
    theme: ["The Heart", "心"],
    data: `
热爱 | rè ài | to love dearly | 非常爱 | 他＿＿自己的工作，每天都第一个到。 | 喜爱
喜爱 | xǐ ài | to be fond of | 喜欢 | 这本书很受孩子们的＿＿。 | 热爱
心爱 | xīn ài | beloved | 心里非常爱的 | 这辆自行车是他最＿＿的东西。
爱心 | ài xīn | kindness | 关心别人的心 | 她很有＿＿，常常去帮助老人。
真心 | zhēn xīn | sincere | 真实的心意 | 我是＿＿想帮你的。
内心 | nèi xīn | inner heart | 心里面 | 他表面上很平静，＿＿却很着急。
心事 | xīn shì | something on one's mind | 心里放不下的事 | 你今天一句话也不说，有什么＿＿吗？
思念 | sī niàn | to miss | 想念 | 在国外的时候，他非常＿＿家乡。
信任 | xìn rèn | to trust | 相信，敢让他做事 | 他做事很认真，老板很＿＿他。
感动 | gǎn dòng | moved | 心里受到很大的影响 | 他的话让我非常＿＿。
`,
  },
  // Nature and Climate
  {
    theme: ["Weather", "天气"],
    data: `
湿润 | shī rùn | moist | 有一些水分，不干 | 南方的空气很＿＿，不像北方那么干。
干燥 | gān zào | dry | 缺少水分 | 北方的冬天很＿＿，要多喝水。
湿度 | shī dù | humidity | 空气里水分的多少 | 今天空气的＿＿很高，衣服不容易干。
雷雨 | léi yǔ | thunderstorm | 打着雷下的雨 | 夏天的下午常常有＿＿。 | 阵雨
打雷 | dǎ léi | to thunder | 天上发出很大的响声 | 外面＿＿了，快把窗户关上。
闪电 | shǎn diàn | lightning | 下雨时天空中突然出现的强光 | 天上一道＿＿，接着就是一声大雷。
阵雨 | zhèn yǔ | shower | 下一会儿就停的雨 | 天气预报说，明天下午有＿＿。 | 雷雨
一阵 | yí zhèn | a burst | 一会儿，一段时间 | 刮了＿＿大风，天就晴了。
雨季 | yǔ jì | rainy season | 下雨多的季节 | 这里每年六月到八月是＿＿。
台风 | tái fēng | typhoon | 夏天从海上来的大风 | ＿＿来了，学校都放假了。
`,
  },
  {
    theme: ["Floods and Droughts", "洪水和干旱"],
    data: `
洪水 | hóng shuǐ | flood | 河里涨得很高的大水 | 下了一个星期的大雨，发了＿＿。
防洪 | fáng hóng | flood control | 防止大水 | 大雨下个不停，村里的人都去河边＿＿了。
干旱 | gān hàn | drought | 很久不下雨，缺水 | 今年夏天很＿＿，河里的水都干了。
抗旱 | kàng hàn | to fight drought | 想办法对付干旱 | 农民们正在＿＿，从很远的地方运水来。
雨水 | yǔ shuǐ | rainwater | 下的雨 | 今年＿＿多，水果长得特别好。
水土 | shuǐ tǔ | local conditions | 土地和水；一个地方的自然环境 | 刚到南方时，他有点＿＿不服。
沙漠 | shā mò | desert | 都是沙子、很少有水的地方 | ＿＿里很少下雨，白天很热，晚上很冷。
尘土 | chén tǔ | dust | 很细的土 | 一阵大风刮过，路上的＿＿都飞了起来。
土地 | tǔ dì | land | 田地，地面 | 这里的＿＿很好，什么都能长。
风力 | fēng lì | wind force | 风的大小 | 今天的＿＿有八级，最好别出门。
`,
  },
  {
    theme: ["Cold and Heat", "冷和热"],
    data: `
寒冷 | hán lěng | cold | 很冷 | 这里的冬天很＿＿，常常零下二十度。 | 严寒
严寒 | yán hán | bitter cold | 非常冷 | 虽然是＿＿的冬天，他还是每天早上去河里游泳。 | 寒冷
寒风 | hán fēng | cold wind | 冷风 | 外面刮着＿＿，大家都穿上了大衣。
冻 | dòng | to freeze | 遇冷变硬 | 天太冷了，河里的水都＿＿上了。 | 冻结
冻结 | dòng jié | to freeze over | 水遇冷变成冰 | 冬天，湖面＿＿了，人们可以在上面走。 | 冻
冻伤 | dòng shāng | frostbite | 因为太冷让身体受伤 | 天太冷了，他的手都＿＿了。
冷冻 | lěng dòng | to freeze (food) | 放在很冷的地方让东西变硬 | 把肉放进＿＿室里，可以放很久。
热带 | rè dài | the tropics | 地球上最热的地方 | 这种水果只长在＿＿。
温带 | wēn dài | temperate zone | 不太冷也不太热的地方 | 中国大部分地方在＿＿，四季分明。
寒带 | hán dài | frigid zone | 地球上最冷的地方 | 北极在＿＿，一年里大半时间都很冷。
`,
  },
  {
    theme: ["The Sea", "海洋"],
    data: `
海洋 | hǎi yáng | ocean | 很大很大的海 | 地球上大部分是＿＿。
太平洋 | tài píng yáng | Pacific Ocean | 世界上最大的大洋 | ＿＿是世界上最大的海洋。 | 大西洋
大西洋 | dà xī yáng | Atlantic Ocean | 欧洲和美洲之间的大洋 | 从英国坐船去美国，要过＿＿。 | 太平洋
深海 | shēn hǎi | deep sea | 离水面很远的海里 | ＿＿里没有光，非常黑。
深度 | shēn dù | depth | 深的程度 | 这条河的＿＿有五米。
深 | shēn | deep | 从上到下距离大 | 这里的水很＿＿，不要下去游泳。
海浪 | hǎi làng | waves | 海上的浪 | 风很大，＿＿很高。
洋流 | yáng liú | ocean current | 海洋里按一定方向流动的水 | ＿＿能把海里的东西带到很远的地方。
海面 | hǎi miàn | sea surface | 海水的表面 | 早上，太阳照在＿＿上，非常美。
半岛 | bàn dǎo | peninsula | 三面是水的陆地 | 这个城市在一个＿＿上，三面都是海。
`,
  },
  {
    theme: ["Mountains and Plains", "山和平原"],
    data: `
山峰 | shān fēng | peak | 山的尖顶 | 远处的＿＿上还有白雪。
高峰 | gāo fēng | peak, rush hour | 高的山峰；最高点 | 上下班＿＿的时候，路上车很多。
山谷 | shān gǔ | valley | 两山之间的低地 | 一条小河从＿＿里流过。
平原 | píng yuán | plain | 又平又大的地方 | 这里是一片大＿＿，一眼望去看不到山。
草原 | cǎo yuán | grassland | 长满草的大平地 | ＿＿上有很多牛和羊。
高原 | gāo yuán | plateau | 很高很平的地方 | 西藏在＿＿上，有的人去了会不舒服。
雪山 | xuě shān | snowy mountain | 一年到头都有雪的山 | 远远看去，那座＿＿是白色的。
河流 | hé liú | river | 江和河 | 这个国家有很多大的＿＿。
北极 | běi jí | North Pole | 地球的最北边 | ＿＿很冷，那里住着白熊。 | 南极
南极 | nán jí | South Pole | 地球的最南边 | 很少有人去过＿＿，那里一年到头都是冰。 | 北极
`,
  },
  {
    theme: ["Plants and Insects", "植物和虫子"],
    data: `
根 | gēn | root | 植物长在土里的部分 | 大树的＿＿长得很深。
种子 | zhǒng zi | seed | 植物用来长出新植物的东西 | 春天，农民把＿＿放进土里。
种植 | zhòng zhí | to grow | 种 | 这里的农民主要＿＿苹果。
品种 | pǐn zhǒng | variety | 同一种植物里不同的样子 | 这家店的苹果有十几个＿＿。
物种 | wù zhǒng | species | 生物的种类 | 地球上有很多＿＿正在消失。
种 | zhǒng | kind | 类 | 我喜欢这＿＿颜色。
落叶 | luò yè | fallen leaves | 从树上掉下来的叶子 | 秋天，地上都是＿＿。
虫子 | chóng zi | insect, bug | 小虫 | 这个苹果里有一条＿＿。 | 害虫
土 | tǔ | soil | 地上的泥沙 | 他从地里拿了一些＿＿，种上了花。
害虫 | hài chóng | pest | 对植物有害的虫子 | 这种药能杀死＿＿，保护苹果树。 | 虫子
`,
  },
  {
    theme: ["Climate", "气候"],
    data: `
碳 | tàn | carbon | 一种化学元素 | 汽车和工厂排出的＿＿太多，地球就会变暖。
低碳 | dī tàn | low-carbon | 用的能源少，放出的碳少 | 少开车，多坐地铁，过＿＿生活。
大自然 | dà zì rán | nature | 自然界 | 放假的时候，我们去山里，走进＿＿。
日落 | rì luò | sunset | 太阳下山 | 我们在海边看＿＿。
落下 | luò xià | to go down | 掉下来，降下来 | 太阳从西边＿＿。
风向 | fēng xiàng | wind direction | 风吹来的方向 | ＿＿变了，现在刮的是北风。
雷 | léi | thunder | 下雨时空中发出的很大响声 | ＿＿声很大，孩子害怕得哭了。
闪 | shǎn | to flash | 光突然出现 | 远处的灯光一＿＿就不见了。
湿 | shī | wet | 沾了水 | 下雨了，我的衣服都＿＿了。
全球 | quán qiú | global | 整个地球 | 天气变暖是一个＿＿问题。
`,
  },
  {
    theme: ["Here and There", "各处"],
    data: `
各种 | gè zhǒng | all kinds of | 很多不同的 | 公园里开着＿＿花。
各地 | gè dì | all over | 每个地方 | 世界＿＿的人都来这里旅游。
深处 | shēn chù | depths | 很深的地方 | 在森林的＿＿，住着很多动物。
深夜 | shēn yè | late at night | 很晚的夜里 | 他工作到＿＿才睡觉。
角落 | jiǎo luò | corner | 两面墙相接的地方 | 房间的＿＿里放着一把椅子。
落后 | luò hòu | backward | 比别人差，在后面 | 这个地方很＿＿，没有电，也没有路。
根本 | gēn běn | at all | 完全，从来 | 我＿＿不认识他。
根据 | gēn jù | according to | 按照 | ＿＿天气预报，明天会下雪。
另外 | lìng wài | besides | 除了说过的以外 | 我买了一些水果，＿＿还买了一些菜。
进入 | jìn rù | to enter | 走进 | ＿＿冬天以后，天黑得很早。
`,
  },
  // Sport
  {
    theme: ["Winners", "冠军"],
    data: `
冠军 | guàn jūn | champion | 比赛的第一名 | 他跑得最快，是这次比赛的＿＿。 | 亚军 季军
亚军 | yà jūn | runner-up | 比赛的第二名 | 他只比第一名慢了一点儿，得了＿＿。 | 冠军
季军 | jì jūn | third place | 比赛的第三名 | 前两名是中国队和日本队，＿＿是美国队。 | 冠军
金牌 | jīn pái | gold medal | 第一名得到的奖牌 | 他在比赛中拿了两块＿＿。 | 奖牌
奖牌 | jiǎng pái | medal | 比赛前几名得到的牌子 | 这次比赛，中国队一共得了二十块＿＿。 | 金牌
领奖台 | lǐng jiǎng tái | podium | 发奖时运动员站的台子 | 三名运动员站在＿＿上，笑得很开心。
纪录 | jì lù | record | 最好的成绩 | 他打破了自己保持了十年的＿＿。
连胜 | lián shèng | winning streak | 一连几次都赢 | 这支球队已经＿＿五场了。
击败 | jī bài | to defeat | 打败 | 中国队二比一＿＿了对手。
连败 | lián bài | losing streak | 一连几次都输 | 这支球队已经＿＿五场了，球迷都很失望。
`,
  },
  {
    theme: ["The Match", "比赛"],
    data: `
局 | jú | game, set | 比赛的一次 | 这场比赛一共打三＿＿。
平局 | píng jú | draw | 比赛没分出输赢 | 两个队踢成了一比一，是＿＿。
裁判 | cái pàn | referee | 比赛中判输赢、管规则的人 | ＿＿说这个球不算。
犯规 | fàn guī | to foul | 不守比赛规则 | 他在比赛中＿＿了，被罚下场。
罚球 | fá qiú | free throw | 因为对方犯规罚给的球 | 对方犯规了，我们得到了一个＿＿。 | 点球
点球 | diǎn qiú | penalty kick | 足球比赛中离球门十二米踢的罚球 | 他踢进了一个＿＿。 | 罚球
半决赛 | bàn jué sài | semi-final | 决赛前的一轮比赛 | 赢了＿＿，就能进决赛了。
预赛 | yù sài | preliminary round | 正式比赛前选人的比赛 | 只有通过＿＿的人，才能参加决赛。
加时 | jiā shí | extra time | 打平以后再加的时间 | 九十分钟打成平局，比赛进入了＿＿。
全场 | quán chǎng | the whole match | 整场比赛 | 他＿＿进了三个球。
`,
  },
  {
    theme: ["Attack and Defence", "进攻和防守"],
    data: `
进攻 | jìn gōng | to attack | 向对方打过去 | 我们队开始＿＿了，很快就进了一个球。 | 攻击
攻击 | gōng jī | to assail | 用武力或言语打对方 | 在网上＿＿别人是不对的。 | 进攻
防守 | fáng shǒu | to defend | 守住，不让对方进攻 | 他们队的＿＿很好，对方一个球也没进。
攻守 | gōng shǒu | attack and defence | 进攻和防守 | 这支球队＿＿都很好，所以总能赢。
射门 | shè mén | to shoot (at goal) | 用脚或头把球踢向球门 | 他一脚＿＿，球进了！
传球 | chuán qiú | to pass | 把球给队友 | 他很会＿＿，队友都喜欢跟他一起踢球。
投篮 | tóu lán | to shoot (in basketball) | 打篮球时把球投向篮筐 | 他＿＿很准，十个能进八个。
球门 | qiú mén | goal | 足球比赛中要把球踢进去的门 | 球打在＿＿上，没进。
门将 | mén jiàng | goalkeeper | 守门员 | 他们队的＿＿很好，对方一个点球也没踢进。
队友 | duì yǒu | teammate | 同一个队的人 | 他把球传给了＿＿。
`,
  },
  {
    theme: ["Running", "跑步"],
    data: `
跑步 | pǎo bù | to jog | 跑，锻炼身体 | 他每天早上都去公园＿＿。
长跑 | cháng pǎo | long-distance running | 跑很长的距离 | 他是＿＿运动员，常常一跑就是十公里。
短跑 | duǎn pǎo | sprint | 跑很短的距离 | 一百米是＿＿比赛。
跑道 | pǎo dào | track | 跑步用的路 | 操场上有一条四百米的＿＿。
冲刺 | chōng cì | to sprint | 最后用全力向前跑 | 离终点还有一百米，他开始＿＿了。 | 冲
冲 | chōng | to rush | 很快地向前 | 他一下子就＿＿到了最前面。 | 冲刺
起跑 | qǐ pǎo | to start a race | 开始跑 | 比赛开始了，他＿＿最快，一下子就跑到了前面。
脚步 | jiǎo bù | footstep | 走路时脚的动作 | 门外传来了一阵＿＿声。
步 | bù | step | 走路时两脚之间的距离 | 他往前走了两＿＿。
热身 | rè shēn | to warm up | 运动前先做些轻的运动 | 比赛前，运动员们先＿＿十分钟。
`,
  },
  {
    theme: ["Ice, Snow and the Gym", "冰雪和体操"],
    data: `
滑冰 | huá bīng | to skate | 在冰上滑 | 冬天，湖上结了冰，孩子们在上面＿＿。
滑雪 | huá xuě | to ski | 在雪上滑 | 我们去山上＿＿吧。
滑 | huá | slippery | 光溜，容易摔倒 | 下雪以后路很＿＿，开车要小心。
滑板 | huá bǎn | skateboard | 下面有轮子的板 | 他每天放学后都在公园里玩＿＿。
冲浪 | chōng làng | to surf | 在海浪上滑行 | 夏天，很多年轻人去海边＿＿。
摔 | shuāi | to fall | 跌倒 | 他滑冰的时候＿＿了一下。
体操 | tǐ cāo | gymnastics | 在垫子或器械上做动作的运动 | 她从小练＿＿，得过很多奖。
做操 | zuò cāo | to do exercises | 做体操 | 每天上午十点，学生们都在操场上＿＿。
操场 | cāo chǎng | sports ground | 学校里运动的地方 | 下课了，同学们都去＿＿上玩。
举重 | jǔ zhòng | weightlifting | 把重的东西举起来的运动 | 他是＿＿运动员，能举起很重的东西。
`,
  },
  {
    theme: ["Ball and Board Games", "球和棋"],
    data: `
羽毛球 | yǔ máo qiú | badminton | 用球拍打的一种带羽毛的球 | 我们去打＿＿吧。
羽毛 | yǔ máo | feather | 鸟的毛 | 这只鸟的＿＿很漂亮。
毛 | máo | fur | 动物身上长的细丝 | 这只小猫的＿＿是白色的。
球拍 | qiú pāi | racket | 打球用的拍子 | 他的＿＿坏了，要买一个新的。
下棋 | xià qí | to play chess | 玩棋 | 爷爷每天下午都在公园里跟朋友＿＿。
象棋 | xiàng qí | Chinese chess | 中国的一种棋 | 他很会下中国＿＿。 | 棋
棋 | qí | chess | 一种在格子上下的游戏 | 我们来下一盘＿＿吧。 | 象棋
拳击 | quán jī | boxing | 戴手套用拳打的运动 | 他是＿＿运动员，每天都要练习打沙袋。
太极拳 | tài jí quán | tai chi | 中国的一种动作很慢的拳 | 公园里有很多老人在打＿＿。
拳头 | quán tou | fist | 握紧的手 | 他生气地举起了＿＿。
`,
  },
  {
    theme: ["Big Events", "大赛"],
    data: `
奥运会 | ào yùn huì | Olympic Games | 四年一次的世界运动会 | 北京在两千零八年办了＿＿。
世界杯 | shì jiè bēi | World Cup | 世界上最大的足球比赛 | 每四年有一次足球＿＿。
联赛 | lián sài | league | 很多队一起打的比赛，时间很长 | 这支球队在＿＿里排第一。
赛季 | sài jì | season | 一年里比赛的那段时间 | 新的＿＿下个月开始。
主场 | zhǔ chǎng | home ground | 在自己城市的比赛场地 | 今天是我们的＿＿，来看比赛的人很多。
客场 | kè chǎng | away ground | 在对方城市的比赛场地 | 在＿＿比赛，没有很多球迷给我们加油。
体育场 | tǐ yù chǎng | stadium | 很大的露天运动场 | 这个＿＿能坐八万人。 | 体育馆
体育馆 | tǐ yù guǎn | sports hall | 室内的运动场所 | 下雨了，我们去＿＿里打篮球吧。 | 体育场
健身房 | jiàn shēn fáng | gym | 锻炼身体的地方 | 他每天下班后都去＿＿锻炼一个小时。
球迷 | qiú mí | fan | 非常喜欢看球的人 | 他是个足球＿＿，每场比赛都看。
`,
  },
  {
    theme: ["Strength", "力量"],
    data: `
强 | qiáng | strong | 力量大 | 这个队很＿＿，我们很难赢。 | 强大
强大 | qiáng dà | powerful | 力量很大 | 一个国家要＿＿，先要发展经济。 | 强
加强 | jiā qiáng | to strengthen | 使更强 | 我们要＿＿防守，不能再让对方进球了。
坚强 | jiān qiáng | strong-willed | 不怕困难，不容易被打倒 | 失败了不要哭，要＿＿。
强队 | qiáng duì | strong team | 很强的球队 | 我们今天的对手是一支＿＿。
体能 | tǐ néng | physical fitness | 身体运动的能力 | 足球运动员要跑九十分钟，＿＿一定要好。 | 耐力
耐力 | nài lì | endurance | 能坚持很久的力气 | 长跑需要很好的＿＿。 | 体能
连续 | lián xù | in a row | 一个接一个 | 他已经＿＿三年得了冠军。
继续 | jì xù | to continue | 接着做下去 | 休息十分钟，我们＿＿练习。
对手 | duì shǒu | opponent | 比赛的另一方 | 这次比赛的＿＿很强。
`,
  },
  // Science
  {
    theme: ["Life", "生命"],
    data: `
细胞 | xì bāo | cell | 构成生物的小单位 | 人的身体是由很多＿＿构成的。
基因 | jī yīn | gene | 决定生物特点的东西 | 孩子长得像父母，是因为＿＿。
遗传 | yí chuán | to pass down (in the genes) | 父母的特点传给孩子 | 他的高个子是从爸爸那里＿＿来的。
进化 | jìn huà | to evolve | 生物慢慢地变化发展 | 生物在几百万年里慢慢地＿＿。
基本 | jī běn | basic | 根本的，主要的 | 细胞是生命的＿＿单位。
人类 | rén lèi | humankind | 所有的人 | ＿＿只有一个地球，大家都要爱护地球。
大脑 | dà nǎo | brain | 头里面想事情的器官 | 多读书、多想问题，能让＿＿更灵活。
神经 | shén jīng | nerve | 在身体里传递感觉的组织 | 手上有很多＿＿，所以手很敏感。
生物学 | shēng wù xué | biology | 研究生物的科学 | 他大学学的是＿＿，研究植物和动物。
鱼类 | yú lèi | fish | 各种鱼 | 海里有几万种＿＿。
`,
  },
  {
    theme: ["Space", "太空"],
    data: `
宇宙 | yǔ zhòu | universe | 所有的空间和时间 | ＿＿有多大？没有人知道。
宇航员 | yǔ háng yuán | astronaut | 坐飞船去太空的人 | 他从小的理想是当一名＿＿。
太空 | tài kōng | outer space | 地球外面很高很远的空间 | 飞船把三个人送上了＿＿。
星球 | xīng qiú | heavenly body | 宇宙中很大的天体 | 我们住的地球也是一个＿＿。 | 行星
行星 | xíng xīng | planet | 绕着太阳转的星球 | 火星和地球一样，都是太阳的＿＿。 | 星球
太阳系 | tài yáng xì | solar system | 太阳和绕着它转的星球 | 地球是＿＿中的一个行星。
月球 | yuè qiú | the Moon | 月亮 | 人类第一次登上＿＿是在一九六九年。
火星 | huǒ xīng | Mars | 太阳系里一个红色的行星 | ＿＿是红色的，离地球不太远。
飞船 | fēi chuán | spaceship | 去太空用的飞行器 | 他们坐＿＿去了太空。
引力 | yǐn lì | gravity | 物体之间相互吸引的力 | 因为地球的＿＿，东西都会往下落。
`,
  },
  {
    theme: ["Measuring", "测量"],
    data: `
测量 | cè liáng | to measure | 用工具量 | 医生给他＿＿了身高和体重。
测试 | cè shì | to test | 用一定的方法试一试 | 这台机器做好以后，要先＿＿一下。 | 检测
检测 | jiǎn cè | to inspect | 检查测试 | 这些食品要经过＿＿才能卖。 | 测试
预测 | yù cè | to predict | 事先推想将来的事 | 没有人能＿＿明天股票会涨还是跌。
显示 | xiǎn shì | to show | 明显地表示 | 电脑上＿＿现在是下午三点。
显微镜 | xiǎn wēi jìng | microscope | 能把很小的东西放大的工具 | 用＿＿可以看到细胞。
望远镜 | wàng yuǎn jìng | telescope | 能看到很远的东西的工具 | 用＿＿可以看到月球上的山。
数据 | shù jù | data | 数字和资料 | 这些＿＿说明这种药是有用的。
指数 | zhǐ shù | index | 表示变化的数字 | 今天空气污染＿＿很高，最好别出门。
实验室 | shí yàn shì | laboratory | 做实验的房间 | 他每天都在＿＿里做实验。
`,
  },
  {
    theme: ["Certainty", "确定"],
    data: `
确定 | què dìng | to be sure | 肯定，定下来 | 我不＿＿他明天会不会来。
确实 | què shí | indeed | 真实，可靠 | 他说的＿＿是真的。 | 的确
的确 | dí què | really | 实在，完全是这样 | 这家饭馆的菜＿＿好吃。 | 确实
准确 | zhǔn què | accurate | 完全对，没有差错 | 他的发音很＿＿。 | 正确
正确 | zhèng què | correct | 对的，合乎道理的 | 请选出＿＿的答案。 | 准确
明确 | míng què | clear-cut | 清楚，不含糊 | 他的目标很＿＿：考上北京大学。
确认 | què rèn | to confirm | 明确地承认 | 请你再＿＿一下飞机起飞的时间。
显然 | xiǎn rán | obviously | 很容易看出来 | 他一句话也不说，＿＿是生气了。
明显 | míng xiǎn | obvious | 很清楚，容易看出 | 吃了药以后，他的病有了＿＿的好转。
显得 | xiǎn de | to look | 表现出某种样子 | 穿上这件衣服，他＿＿年轻了很多。
`,
  },
  {
    theme: ["Exploring", "探索"],
    data: `
探索 | tàn suǒ | to explore | 寻找答案 | 科学家一直在＿＿宇宙的秘密。
探测 | tàn cè | to probe | 用仪器检查看不见的东西 | 这台机器可以＿＿地下的水。
探讨 | tàn tǎo | to discuss | 研究讨论 | 会上大家＿＿了这个问题。
探险 | tàn xiǎn | to explore (danger) | 到危险的地方去考察 | 他喜欢去沙漠＿＿。
引起 | yǐn qǐ | to cause | 让某种事情出现 | 这个新发现＿＿了很多人的注意。
吸引 | xī yǐn | to attract | 让人或东西过来 | 这里的风景＿＿了很多游客。
引导 | yǐn dǎo | to guide | 带着人往一个方向走 | 老师＿＿学生自己去发现问题。
理论 | lǐ lùn | theory | 系统的知识和观点 | 他的＿＿后来被实验证明了。
原理 | yuán lǐ | principle | 最基本的道理 | 你知道这台机器的工作＿＿吗？
指出 | zhǐ chū | to point out | 说出来让人知道 | 老师＿＿了我作文里的问题。
`,
  },
  {
    theme: ["Matter", "物质"],
    data: `
氧气 | yǎng qì | oxygen | 人呼吸需要的气体 | 人没有＿＿就活不了。
缺氧 | quē yǎng | lack of oxygen | 氧气不够 | 山上空气少，有的人会＿＿。
原子 | yuán zǐ | atom | 构成物质的很小的单位 | 物质是由很小很小的＿＿构成的。 | 分子
分子 | fēn zǐ | molecule | 由原子构成的小单位 | 一个水＿＿里有三个原子。 | 原子
原子核 | yuán zǐ hé | atomic nucleus | 原子中心的部分 | ＿＿在原子的中间。
核能 | hé néng | nuclear energy | 原子核放出的能量 | 这个国家用＿＿来发电。
元素 | yuán sù | element | 由同一种原子构成的物质 | 氧是一种化学＿＿。
物质 | wù zhì | matter | 所有占空间的东西 | 水、空气、石头都是＿＿。
能量 | néng liàng | energy | 能做功的力量 | 吃饭能给身体提供＿＿。
二氧化碳 | èr yǎng huà tàn | carbon dioxide | 一种无色的气体 | 植物吸进＿＿，放出氧气。
`,
  },
  {
    theme: ["Analysis", "分析"],
    data: `
分析 | fēn xī | to analyse | 把事物分开来研究 | 我们来＿＿一下失败的原因。
结构 | jié gòu | structure | 各部分的组合 | 这座楼的＿＿很好，地震时没有坏。
构成 | gòu chéng | to make up | 组成 | 这个句子由三个部分＿＿。
分类 | fēn lèi | to sort | 按种类分开 | 请把垃圾＿＿以后再放进去。
种类 | zhǒng lèi | variety | 种 | 这家商店水果的＿＿很多。
状态 | zhuàng tài | state | 样子，情况 | 他今天的＿＿很好，跑得很快。
形状 | xíng zhuàng | shape | 外表的样子 | 这块石头的＿＿像一只鸟。
之类 | zhī lèi | and the like | 这一类的 | 我喜欢足球、篮球＿＿的运动。
结论 | jié lùn | conclusion | 最后的判断 | 做了很多次实验，他得出了一个＿＿。
公式 | gōng shì | formula | 数学上表示关系的写法 | 你记住这个数学＿＿了吗？
`,
  },
  {
    theme: ["Ways and Times", "方式和时间"],
    data: `
方式 | fāng shì | way | 方法和样子 | 每个人学习的＿＿都不一样。
形式 | xíng shì | form | 外在的样子 | 这次考试的＿＿很特别，要求学生做一个实验。
正式 | zhèng shì | formal | 合乎规定的 | 他下个月＿＿开始上班。
使用 | shǐ yòng | to use | 用 | 这台机器很容易＿＿。
即使 | jí shǐ | even if | 就算 | ＿＿下雨，比赛也要进行。
使得 | shǐ de | to make (it so that) | 让 | 新技术＿＿生产更快了。
未来 | wèi lái | future | 以后的时间 | ＿＿的世界会是什么样子？
未知 | wèi zhī | unknown | 还不知道的 | 科学家喜欢研究＿＿的东西。
未必 | wèi bì | not necessarily | 不一定 | 贵的东西＿＿就好。
态度 | tài dù | attitude | 对事情的看法和表现 | 他学习的＿＿很认真。
`,
  },
  // Careers
  {
    theme: ["Looking for Work", "找工作"],
    data: `
求职 | qiú zhí | to look for a job | 找工作 | 毕业以后，他到处＿＿，可是一直没找到合适的工作。
简历 | jiǎn lì | résumé | 写着自己学习和工作经历的材料 | 请把你的＿＿发到我们公司的邮箱。
面试 | miàn shì | job interview | 面对面的考查 | 明天上午我要去一家公司＿＿。
应聘 | yìng pìn | to apply for a job | 去参加招聘 | 他去这家公司＿＿销售经理。
就业 | jiù yè | to find employment | 得到工作 | 今年大学生＿＿很难。
岗位 | gǎng wèi | post | 工作的地方，职位 | 他在这个＿＿上工作了十年。 | 职位
职位 | zhí wèi | position | 工作的位子 | 公司里有一个经理的＿＿还空着。 | 岗位
上岗 | shàng gǎng | to take up a post | 开始在岗位上工作 | 新员工要先培训，然后才能＿＿。
下岗 | xià gǎng | to be laid off | 离开工作岗位 | 工厂关了，很多工人都＿＿了。
人才 | rén cái | talent | 有能力的人 | 公司很需要这样的＿＿。
`,
  },
  {
    theme: ["Pay", "工资"],
    data: `
薪水 | xīn shuǐ | pay | 工资 | 他的＿＿很高，可是工作很累。 | 月薪
月薪 | yuè xīn | monthly pay | 一个月的工资 | 这份工作＿＿八千元。 | 薪水
年薪 | nián xīn | annual salary | 一年的工资 | 他当了经理以后，＿＿有五十万。
加薪 | jiā xīn | to get a raise | 加工资 | 他工作做得很好，老板给他＿＿了。
带薪 | dài xīn | paid (leave) | 照常发工资的 | 公司每年给员工十天＿＿假。
福利 | fú lì | benefits | 工资以外的好处 | 这家公司的＿＿很好，员工可以免费吃午饭。
雇主 | gù zhǔ | employer | 出钱请人做事的人 | 他的＿＿对他很好。
雇员 | gù yuán | employee | 被请来做事的人 | 这家公司有三百多个＿＿。
雇 | gù | to hire | 出钱请人做事 | 他们＿＿了一个人帮忙打扫房间。
工资单 | gōng zī dān | payslip | 写着工资多少的单子 | 每个月发工资时，公司都会给我一张＿＿。
`,
  },
  {
    theme: ["Training", "培训"],
    data: `
培训 | péi xùn | to train (staff) | 给员工上课，教他们本领 | 公司每年都给员工＿＿。 | 训练
培养 | péi yǎng | to cultivate | 长时间地教育 | 父母要从小＿＿孩子的好习惯。
培训班 | péi xùn bān | training course | 短时间学习一种技能的班 | 他报了一个电脑＿＿。
训练 | xùn liàn | to drill | 有计划地练习 | 运动员每天都要＿＿六个小时。 | 培训
实习 | shí xí | to do an internship | 学生到工作的地方去学习 | 他大学三年级在一家公司＿＿了三个月。
实习生 | shí xí shēng | intern | 实习的学生 | 我们公司今年来了五个＿＿。
教训 | jiào xun | lesson | 从错误中得到的经验 | 这次失败给了他一个很大的＿＿。
证书 | zhèng shū | certificate | 证明的文件 | 学完这个课，你会拿到一张＿＿。
本领 | běn lǐng | skill | 能力，技能 | 他有修车的＿＿。
传授 | chuán shòu | to pass on | 把知识、技术教给别人 | 老工人把自己的技术＿＿给了年轻人。
`,
  },
  {
    theme: ["Moving On", "升职和辞职"],
    data: `
升职 | shēng zhí | to be promoted | 提高职位 | 他工作很努力，今年＿＿当了经理。
提升 | tí shēng | to enhance | 提高 | 学外语可以＿＿你的竞争力。
上升 | shàng shēng | to go up | 向上走 | 今年公司的收入＿＿了百分之二十。
升级 | shēng jí | to upgrade | 提高等级 | 我的手机要＿＿了。
辞职 | cí zhí | to resign | 自己不再做原来的工作 | 他不喜欢这份工作，就＿＿了。 | 辞退
辞退 | cí tuì | to dismiss | 让员工离开 | 他常常迟到，被公司＿＿了。 | 辞职
兼职 | jiān zhí | part-time job | 本职以外的工作 | 他上大学时在饭馆做＿＿。
全职 | quán zhí | full-time | 只做这一份工作 | 她生了孩子以后，当了＿＿妈妈。
创业 | chuàng yè | to start a business | 开始自己的事业 | 他大学毕业后就开始＿＿，开了一家公司。
退休金 | tuì xiū jīn | pension | 退休后每月得的钱 | 爷爷每个月都有＿＿。
`,
  },
  {
    theme: ["At the Office", "办公室"],
    data: `
主管 | zhǔ guǎn | supervisor | 管理一个部门的人 | 有问题你可以问你的＿＿。 | 主任
助理 | zhù lǐ | assistant | 帮助别人工作的人 | 经理的＿＿帮他安排每天的会议。
顾问 | gù wèn | consultant | 给人出主意的专家 | 这家公司请了一位法律＿＿。
主任 | zhǔ rèn | director | 一个部门的负责人 | 他当了办公室＿＿，管十几个人。 | 主管
人事 | rén shì | personnel | 跟员工有关的事 | 请假要先找＿＿部门。
上司 | shàng si | boss | 上级 | 他跟他的＿＿关系很好，常常一起吃饭。 | 主管 主任
出差 | chū chāi | to go on a business trip | 到外地去办公事 | 他下个星期要去上海＿＿。
汇报 | huì bào | to report | 向领导报告 | 每周一，他都要向经理＿＿工作。
职工 | zhí gōng | staff | 工厂、单位的工人和员工 | 这家工厂有两千名＿＿。
同行 | tóng háng | person in the same trade | 做同一行业的人 | 他们两个是＿＿，都是老师。
`,
  },
  {
    theme: ["Jobs", "职业"],
    data: `
工程师 | gōng chéng shī | engineer | 做工程技术工作的人 | 他是一名＿＿，这座大桥就是他设计的。
教授 | jiào shòu | professor | 大学里最高一级的老师 | 他是北京大学的历史＿＿。
理发师 | lǐ fà shī | barber | 给人剪头发的人 | 我的头发长了，要去找＿＿。
公务员 | gōng wù yuán | civil servant | 在政府工作的人 | 他大学毕业后考上了＿＿，在市政府工作。
消防员 | xiāo fáng yuán | firefighter | 救火的人 | 着火了，＿＿很快就来了。
研究员 | yán jiū yuán | researcher | 做研究工作的人 | 他是这个研究所的＿＿，每天做实验。
商人 | shāng rén | merchant | 做生意的人 | 他是一个＿＿，做了很多年的外贸生意。
店主 | diàn zhǔ | shop owner | 商店的主人 | 这家小店的＿＿是一个老人，店是他开的。 | 收银员
收银员 | shōu yín yuán | cashier | 在商店收钱的人 | 付钱的时候，＿＿问我要不要袋子。 | 店主
船长 | chuán zhǎng | captain | 一条船上的负责人 | 这条船上的人都要听＿＿的。
`,
  },
  {
    theme: ["Strengths and Prospects", "长处和前途"],
    data: `
优秀 | yōu xiù | excellent | 非常好 | 他是一名＿＿的医生。
新秀 | xīn xiù | rising star | 新出现的优秀人才 | 他是足球界的＿＿，才十八岁。
能干 | néng gàn | capable | 有能力，会做事 | 她又聪明又＿＿，什么事都做得很好。
特长 | tè cháng | special skill | 特别好的技能 | 你有什么＿＿？我会唱歌和画画。
长处 | cháng chù | strength | 优点 | 每个人都有自己的＿＿和短处。
短处 | duǎn chù | weakness | 缺点 | 他知道自己的＿＿，所以一直在努力改。
志向 | zhì xiàng | aspiration | 将来要做大事的想法 | 他从小就有远大的＿＿。
前途 | qián tú | prospects | 将来的发展 | 这个年轻人很努力，很有＿＿。
事业 | shì yè | career | 一生做的主要的事 | 他把教书当成自己一生的＿＿。
成就 | chéng jiù | achievement | 做出的成绩 | 他在科学上取得了很大的＿＿。
`,
  },
];
