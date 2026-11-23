// The words of units 1 to 6 of level 5 (docs/chinese-curriculum.md §8.4), in the format of level 3 (../level-3/word-data.ts).
//
// A line a word, as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** wordBatchesA are the 54 word batches of units 1 to 6 of level 5, in teaching order. */
export const wordBatchesA: readonly LevelWordBatch[] = [
  // Unit 1: Society.
  {
    theme: ["Charity and Help", "慈善和帮助"],
    data: `
慈善 | cí shàn | charity | 用钱或东西帮助有困难的人 | 这家公司每年都拿出一部分钱做＿＿。 | 公益
捐款 | juān kuǎn | to donate money | 把钱送给需要帮助的人 | 地震以后，很多人给灾区＿＿。 | 捐献
捐献 | juān xiàn | to donate (something valuable) | 把自己贵重的东西送给国家或组织 | 他把自己收藏的古画都＿＿给了博物馆。 | 捐款
援助 | yuán zhù | aid | 在钱或东西上帮助别人 | 很多国家向发生灾难的地区提供了＿＿。 | 救援
救援 | jiù yuán | rescue | 在危险的时候去救人 | 地震发生以后，＿＿人员很快就到了现场。 | 援助
困难 | kùn nan | difficulty | 不容易解决的问题 | 他家里有＿＿，邻居们都来帮忙。 | 贫困
贫困 | pín kùn | poverty-stricken | 很穷 | 这个地区过去很＿＿，现在大家的生活好多了。 | 困难
公益 | gōng yì | public good | 对大家都有好处的事 | 星期六他常去参加＿＿活动，比如打扫公园。
扶 | fú | to support with the hand | 用手让人或东西不倒 | 老人走路不太稳，你去＿＿他一下。
受益 | shòu yì | to benefit | 得到好处 | 这位老师的话让我＿＿很多。
`,
  },
  {
    theme: ["Disability and Contribution", "残疾和贡献"],
    data: `
残疾 | cán jí | disability | 身体的某一部分不能正常活动 | 他的腿有＿＿，但是他每天坚持锻炼。
残疾人 | cán jí rén | person with a disability | 身体的某一部分不能正常活动的人 | 公共汽车上有给＿＿留的座位。
疾病 | jí bìng | disease | 病 | 多运动可以预防很多＿＿。
扶手 | fú shou | handrail | 楼梯或车上让人用手抓住的东西 | 车开得很快，请拉好＿＿。
贡献 | gòng xiàn | contribution | 为国家或社会出的力 | 他为这个城市的发展做出了很大的＿＿。
献血 | xiàn xuè | to donate blood | 把自己的血给需要的病人 | 他身体很健康，每年都去医院＿＿。
困 | kùn | sleepy | 很想睡觉 | 昨天晚上我没睡好，现在很＿＿。
有益 | yǒu yì | beneficial | 有好处 | 多读书对孩子的成长很＿＿。
利益 | lì yì | interest, benefit | 好处 | 做决定的时候，要想到大家的＿＿。
困境 | kùn jìng | predicament | 困难的情况 | 公司遇到了＿＿，大家一起想办法。
`,
  },
  {
    theme: ["Age, Moving and Labor", "年龄、迁移和劳动"],
    data: `
年龄 | nián líng | age | 年纪 | 报名的时候要写上你的姓名和＿＿。
老龄化 | lǎo líng huà | population aging | 社会上老人越来越多 | 很多国家都面对人口＿＿的问题。
高龄 | gāo líng | advanced age | 年纪很大 | 爷爷已经九十岁＿＿了，身体还很好。
移民 | yí mín | to emigrate; immigrant | 搬到别的国家去长期生活 | 他们一家十年前＿＿到了加拿大。
移动 | yí dòng | to move | 换位置 | 他受伤了，先不要＿＿他，等医生来。 | 转移
转移 | zhuǎn yí | to transfer | 从一个地方换到另一个地方 | 洪水来以前，村里的人都被＿＿到了安全的地方。 | 移动
同龄人 | tóng líng rén | peers | 年纪一样的人 | 他比＿＿成熟很多。
劳动 | láo dòng | to labor | 做工作，出力 | 孩子们在学校里种菜，感受＿＿的快乐。
劳动力 | láo dòng lì | labor force | 能工作的人 | 城市的发展需要大量的＿＿。
劳累 | láo lèi | tired out | 工作太多，很累 | 他工作了一天，非常＿＿。
`,
  },
  {
    theme: ["Family Ties", "家庭关系"],
    data: `
婚姻 | hūn yīn | marriage | 结婚以后的关系 | 他们的＿＿很幸福，结婚三十年了还和以前一样好。
孝顺 | xiào shùn | filial | 对父母好，听父母的话 | 他很＿＿，每个星期都回家看父母。 | 孝敬
孝心 | xiào xīn | filial love | 对父母的爱 | 这件礼物是孩子的一片＿＿。
尊敬 | zūn jìng | to respect | 很看重，对人有礼貌 | 学生们都很＿＿这位老教授。 | 敬爱
敬爱 | jìng ài | to respect and love | 又尊重又爱 | 我们＿＿的老师今天退休了。 | 尊敬
顺利 | shùn lì | smoothly | 没有遇到问题 | 祝你考试＿＿！
孝敬 | xiào jìng | to show respect to elders | 对老人好，送东西给他们 | 他用第一个月的工资买了礼物，＿＿父母。 | 孝顺
对待 | duì dài | to treat | 用某种态度对人 | 我们要用同样的态度＿＿每一个人。 | 招待
待遇 | dài yù | pay and benefits | 工作给的钱和别的好处 | 这家公司的＿＿很好，工资很高。
招待 | zhāo dài | to entertain (guests) | 热情地给客人吃的喝的 | 客人来了，妈妈做了一桌菜＿＿他们。 | 对待
`,
  },
  {
    theme: ["Fairness", "公平"],
    data: `
歧视 | qí shì | to discriminate against | 因为别人跟自己不同而不公平地对他 | 不能因为一个人的年龄、性别就＿＿他。 | 偏见
偏见 | piān jiàn | prejudice | 不公正的看法 | 我们不应该对别的国家的人有＿＿。 | 歧视
阶层 | jiē céng | social stratum | 社会上收入和地位差不多的一群人 | 不同＿＿的人有不同的生活方式。 | 阶段
台阶 | tái jiē | steps | 门前一级一级往上的地方 | 门口有几级＿＿，走路要小心。
阶段 | jiē duàn | stage | 事情发展中的一段 | 这次比赛已经进入了最后一个＿＿。 | 阶层
分歧 | fēn qí | disagreement | 意见不一样 | 两个人在这个问题上有＿＿，讨论了很久。
偏 | piān | slanted | 不正 | 你的帽子戴＿＿了，往左边一点儿。
偏偏 | piān piān | contrary to expectation | 跟希望的正好相反 | 我想出去玩，天＿＿下起了雨。
弱势 | ruò shì | disadvantaged | 力量比较小，容易受伤害 | 社会应该多关心＿＿群体，比如老人和残疾人。
优势 | yōu shì | advantage | 比别人强的地方 | 他会说三种语言，这是他找工作的＿＿。
`,
  },
  {
    theme: ["Rules and Order", "规则和秩序"],
    data: `
秩序 | zhì xù | order | 有规则、不乱的样子 | 请大家排好队，保持＿＿。
遵守 | zūn shǒu | to abide by | 按照规定去做 | 每个人都应该＿＿交通规则。
道德 | dào dé | morality | 人们应该遵守的做人的标准 | 法律管不到的地方，要靠＿＿来管。 | 品德
美德 | měi dé | virtue | 好的品质 | 诚实是一种＿＿。 | 品德
品德 | pǐn dé | moral character | 一个人做人的好坏 | 学校不但教知识，也重视学生的＿＿。 | 道德 美德
稳定 | wěn dìng | stable | 不变，不乱 | 他想找一份＿＿的工作。 | 平稳
平稳 | píng wěn | smooth and steady | 不摇动 | 飞机飞得很＿＿，大家都睡着了。 | 稳定
稳重 | wěn zhòng | steady, sedate | 说话做事不急，让人放心 | 他虽然年轻，但是做事很＿＿。
顺序 | shùn xù | sequence | 先后的次序 | 书架上的书是根据出版时间的＿＿放的。
公德 | gōng dé | public morality | 在公共场所应该遵守的规矩 | 在电影院里大声打电话是没有＿＿的表现。
`,
  },
  {
    theme: ["Harmony and Courtesy", "和谐和礼貌"],
    data: `
矛盾 | máo dùn | conflict | 互相冲突 | 他们两个人之间有＿＿，很久没说话了。
和谐 | hé xié | harmonious | 配合得好，没有冲突 | 这个社区的邻居们相处得很＿＿。
趋势 | qū shì | trend | 事情发展的方向 | 在网上买东西的人一年比一年多，这是一个新的＿＿。
形势 | xíng shì | situation | 事情发展的情况 | 现在的经济＿＿很好，找工作不太难。 | 趋势
谐音 | xié yīn | homophone | 读音一样或差不多 | “四”和“死”是＿＿，所以有的人不喜欢这个数字。
敬意 | jìng yì | respect | 尊敬的心意 | 我们向救援人员表示＿＿。
劳驾 | láo jià | excuse me | 请别人帮忙时说的客气话 | ＿＿，请让我过去一下。
扶持 | fú chí | to support | 帮助，支持 | 政府＿＿小企业的发展。
顺便 | shùn biàn | while one is at it | 做一件事的时候也做另一件 | 你去商店的时候，＿＿帮我买瓶水。 | 顺手
顺手 | shùn shǒu | in passing, with ease | 做事时不费力地顺带 | 出门的时候请＿＿关灯。 | 顺便
`,
  },
  {
    theme: ["Treating Others", "待人"],
    data: `
期待 | qī dài | to look forward to | 盼望 | 大家都很＿＿这次旅行。
等待 | děng dài | to wait | 等 | 他在雨里＿＿了半个小时公共汽车。
接待 | jiē dài | to receive (visitors) | 迎接和招呼来的人 | 前台的工作人员热情地＿＿了我们。
看待 | kàn dài | to regard | 对人或事的看法 | 你怎么＿＿这个问题？
敬礼 | jìng lǐ | to salute | 举手表示尊敬 | 小朋友向警察叔叔＿＿。
手势 | shǒu shì | gesture | 用手做的动作，表示意思 | 他用＿＿告诉我们不要说话。
献花 | xiàn huā | to present flowers | 把花送给别人表示尊敬或感谢 | 演出结束以后，孩子们上台给演员＿＿。
偏爱 | piān ài | to favor | 特别喜欢其中的一个 | 妈妈说她不＿＿任何一个孩子。
勤劳 | qín láo | hardworking | 努力工作，不怕累 | 他的父母都是＿＿的农民，每天很早就去地里工作。
顺路 | shùn lù | on the way | 在去的路上 | 我回家的时候＿＿把你送到车站吧。
`,
  },
  {
    theme: ["Gains and Steadiness", "收获和稳定"],
    data: `
收益 | shōu yì | earnings | 得到的钱 | 这家商店今年的＿＿比去年高了很多。
益处 | yì chù | benefit | 好处 | 每天锻炼对身体有很多＿＿。
功劳 | gōng láo | credit for a contribution | 为一件事出的力和得到的成绩 | 这次比赛能赢，大家都有＿＿。
劳动节 | láo dòng jié | Labor Day | 五月一日的节日 | 每年五月一日是国际＿＿。
偏食 | piān shí | picky eating | 只喜欢吃某几种东西 | 这个孩子＿＿，只爱吃肉，不爱吃菜。
移植 | yí zhí | to transplant | 把植物换个地方种 | 春天是＿＿小树的好时候。
遵照 | zūn zhào | to comply with | 按照 | 请＿＿医生说的，每天吃三次药。
气势 | qì shì | imposing air | 让人感到很有力量的样子 | 这座大楼又高又大，非常有＿＿。
顺心 | shùn xīn | as one wishes | 事情合自己的心意 | 他最近工作不太＿＿，心情不好。
稳 | wěn | steady | 不动，不摇 | 你站＿＿了，车要开了。
`,
  },
  // Unit 2: Education.
  {
    theme: ["Stages of School", "上学的阶段"],
    data: `
幼儿园 | yòu ér yuán | kindergarten | 三到六岁的孩子去的地方 | 我妹妹四岁，每天早上去＿＿。
初中 | chū zhōng | junior high school | 小学以后上的三年学校 | 他小学毕业了，九月就要上＿＿。
初级 | chū jí | elementary (level) | 最低的等级 | 他刚开始学中文，现在上＿＿班。
硕士 | shuò shì | master's degree | 大学毕业以后再读两三年得到的学位 | 她大学毕业以后，又读了两年＿＿。
课堂 | kè táng | classroom (as a setting) | 上课的地方 | 老师希望学生在＿＿上多说话。
食堂 | shí táng | canteen | 学校或单位里吃饭的地方 | 中午我们一般在学校的＿＿吃饭。
宿舍 | sù shè | dormitory | 学生或员工住的房子 | 大学一年级的时候，我们四个人住一间＿＿。
幼小 | yòu xiǎo | young and small | 年纪很小 | 那时候他还很＿＿，什么都不懂。
初步 | chū bù | preliminary | 刚开始的，不是最后的 | 我们对这个问题有了一个＿＿的了解。
暑假 | shǔ jià | summer vacation | 夏天学校放的长假 | 今年＿＿我打算去中国旅行。
`,
  },
  {
    theme: ["Ways of Learning", "学习方法"],
    data: `
补习 | bǔ xí | to take extra lessons | 在课外再学习 | 他的数学成绩不好，每个星期六都去＿＿。 | 辅导
辅导 | fǔ dǎo | to tutor | 帮助和指导学习 | 哥哥每天晚上＿＿我做作业。 | 补习
背诵 | bèi sòng | to recite from memory | 不看书说出学过的文章 | 老师让我们＿＿这首诗。 | 默写
默写 | mò xiě | to write from memory | 不看书把学过的字写出来 | 听写的时候，老师说一个词，我们＿＿一个词。 | 背诵
拼音 | pīn yīn | pinyin | 用字母写出的汉字的读音 | 学中文的时候，先要学好＿＿。
概念 | gài niàn | concept | 对事物的基本认识 | 这是一个新＿＿，老师讲了很多遍我们才懂。
大概 | dà gài | probably; roughly | 可能；差不多 | 他＿＿十分钟以后就到。
疑惑 | yí huò | doubt | 不明白，有问题 | 他对这个答案有些＿＿，又去问了老师。
启发 | qǐ fā | to inspire | 让人想到新的东西 | 这本书给了我很大的＿＿。
补充 | bǔ chōng | to add | 把缺的加上 | 我说完了，你还有什么要＿＿的吗？
`,
  },
  {
    theme: ["Praise and Talent", "表扬和天赋"],
    data: `
表扬 | biǎo yáng | to praise | 公开说别人好 | 他上课很认真，老师在全班同学面前＿＿了他。 | 鼓励
鼓励 | gǔ lì | to encourage | 让人更有勇气和信心 | 父母一直＿＿我做自己喜欢的事。 | 表扬
奖励 | jiǎng lì | reward | 给做得好的人东西或钱 | 他得了第一名，学校给了他一千元＿＿。
勉强 | miǎn qiǎng | reluctantly | 不愿意也要做 | 他不想去，但是最后还是＿＿同意了。
天赋 | tiān fù | gift, talent | 生来就有的能力 | 她很有音乐＿＿，五岁就会弹琴。
擅长 | shàn cháng | to be good at | 在某方面很有本事 | 他＿＿画画，经常得奖。
智慧 | zhì huì | wisdom | 聪明，懂得多 | 这些老故事里有很多古人的＿＿。
范文 | fàn wén | model essay | 给人学习的好文章 | 老师把他的作文当做＿＿，读给大家听。
模范 | mó fàn | model (person) | 值得大家学习的人 | 他是学校的＿＿学生，大家都向他学习。
发扬 | fā yáng | to carry forward | 让好的东西继续发展 | 我们要＿＿互相帮助的好传统。
`,
  },
  {
    theme: ["Exams and Honesty", "考试和诚信"],
    data: `
作弊 | zuò bì | to cheat | 考试时用不诚实的办法 | 考试的时候＿＿是不诚实的行为。
逃课 | táo kè | to skip class | 不去上课 | 他从来不＿＿，每节课都认真听。
逃 | táo | to flee | 跑开 | 小猫看见了大狗，马上＿＿走了。
文凭 | wén píng | diploma | 证明毕业的证书 | 找工作的时候，＿＿不是最重要的，能力更重要。
凭 | píng | to rely on | 靠 | 他＿＿自己的努力考上了大学。
默默 | mò mò | silently | 不说话地 | 他每天都＿＿地学习，从来不说累。
稿子 | gǎo zi | manuscript | 写好的文章 | 记者把写好的＿＿发给了报社。 | 草稿
草稿 | cǎo gǎo | rough draft | 先写的、还要改的文章 | 先打个＿＿，改好了再写到卷子上。 | 稿子
晓得 | xiǎo de | to know (colloquial) | 知道 | 你＿＿他住在哪儿吗？
勉励 | miǎn lì | to encourage | 用话让人继续努力 | 校长在毕业典礼上＿＿大家继续努力。
`,
  },
  {
    theme: ["Books and Records", "书和记录"],
    data: `
书籍 | shū jí | books | 各种书 | 图书馆里有各种各样的＿＿。 | 画册
国籍 | guó jí | nationality | 属于哪个国家的身份 | 他在中国住了很多年，但是＿＿还是英国。
学籍 | xué jí | student status | 学生在学校的正式身份 | 他转学了，＿＿也转到了新学校。
手册 | shǒu cè | handbook | 小本的介绍或说明的书 | 新同学入学的时候，每人都会拿到一本学生＿＿。
注册 | zhù cè | to register | 把名字写进正式的记录里 | 开学第一天，新生要先去办公室＿＿。
画册 | huà cè | picture album | 印着很多画或照片的书 | 这本＿＿里有很多有名的画。 | 书籍
规模 | guī mó | scale | 大小 | 这所大学的＿＿很大，有三万多个学生。
范例 | fàn lì | model example | 可以照着做的例子 | 老师给了我们一个＿＿，让我们照着写。 | 示范
示范 | shì fàn | to demonstrate | 做给别人看，让别人学 | 老师先＿＿了一遍，学生们再自己做。 | 范例
启示 | qǐ shì | lesson, revelation | 让人明白道理的东西 | 这个故事给我们的＿＿是：做事不能太急。
`,
  },
  {
    theme: ["Strengths and Weaknesses", "长处和短处"],
    data: `
劣势 | liè shì | disadvantage | 不如别人的地方 | 他个子不高，打篮球有＿＿。
优劣 | yōu liè | quality, good or bad | 好和坏 | 这两家饭店的菜差不多，很难说哪家更好，分不出＿＿。 | 利弊
利弊 | lì bì | pros and cons | 好处和坏处 | 做决定以前，要先想想这件事的＿＿。 | 优劣
概率 | gài lǜ | probability | 一件事发生的可能有多大 | 天气预报说明天下雨的＿＿很小。
擅自 | shàn zì | without permission | 没有得到同意自己做 | 没有老师的同意，学生不能＿＿离开教室。
拼命 | pīn mìng | with all one's might | 用上全部的力量 | 为了考上好大学，他每天都在＿＿学习。
拼写 | pīn xiě | to spell | 按照字母写出词 | 这个英语单词的＿＿很难记。
舍得 | shě de | to be willing to part with | 愿意给出去，不觉得可惜 | 他很＿＿花钱买书，家里的书有一千多本。
舍不得 | shě bu de | to hate to part with | 不愿意离开或给出 | 毕业的时候，同学们都＿＿分开。
智商 | zhì shāng | IQ | 表示聪明程度的数字 | 他的＿＿很高，但是不太会和别人交流。
`,
  },
  {
    theme: ["Learning Step by Step", "一步一步地学"],
    data: `
困惑 | kùn huò | perplexed | 不明白，不知道怎么办 | 他对未来有很多＿＿，不知道该选什么专业。
诵读 | sòng dú | to read aloud | 大声地读 | 每天早上学生们都在教室里＿＿课文。
补考 | bǔ kǎo | make-up exam | 没考过的人再考一次 | 他上次数学没及格，下星期要参加＿＿。
补课 | bǔ kè | to make up a missed lesson | 把没上的课补上 | 他生病一个星期没来上学，老师放学以后给他＿＿。
初学者 | chū xué zhě | beginner | 刚开始学的人 | 这本书很简单，适合＿＿。
当初 | dāng chū | back then | 那个时候，最开始 | ＿＿我选择学中文，是因为喜欢中国电影。
初次 | chū cì | for the first time | 第一次 | ＿＿见面，请多关照。
默认 | mò rèn | to tacitly accept | 不说出来，但是同意 | 他没有说反对，大家就当他＿＿了。
赞扬 | zàn yáng | to praise highly | 很热情地说别人好 | 他救人的行为受到了大家的＿＿。
堂 | táng | (measure word for classes) | 用来计算课的单位 | 今天下午有两＿＿数学课。
`,
  },
  {
    theme: ["At University", "在大学"],
    data: `
博士 | bó shì | doctorate | 最高的学位 | 他读了五年，终于拿到了＿＿学位。
本科 | běn kē | undergraduate studies | 大学的四年学习 | 他＿＿学的是经济，后来又读了法律。
学位 | xué wèi | academic degree | 完成学习以后得到的称号 | 他在英国拿到了硕士＿＿。
讲座 | jiǎng zuò | lecture | 请专家给大家讲的一次课 | 今天下午有一个关于环境保护的＿＿，你去听吗？
导师 | dǎo shī | supervisor | 指导学生研究的老师 | 他的＿＿是一位很有名的教授。
学分 | xué fēn | credit | 计算学习量的单位 | 他已经修满了毕业需要的＿＿。
选修 | xuǎn xiū | to take as an elective | 自己选择要不要学 | 这学期我＿＿了一门中国历史课。
必修 | bì xiū | compulsory (course) | 一定要学的 | 英语是＿＿课，每个学生都要学。
奖学金 | jiǎng xué jīn | scholarship | 学校给成绩好的学生的钱 | 她学习非常好，每年都能拿到＿＿。
留学生 | liú xué shēng | international student | 在外国读书的学生 | 这所大学有很多来自不同国家的＿＿。
`,
  },
  {
    theme: ["School Life", "学校生活"],
    data: `
课程 | kè chéng | curriculum | 学校安排要学的课 | 这个学期的＿＿很多，每天都有六节课。
考生 | kǎo shēng | examinee | 参加考试的人 | 考试开始以前，＿＿要先找到自己的座位。
高考 | gāo kǎo | college entrance exam | 中国考大学的考试 | 在中国，＿＿一般在每年六月。
录取 | lù qǔ | to admit | 学校决定接受（学生） | 他被一所很好的大学＿＿了。
成绩单 | chéng jì dān | report card | 写着考试成绩的纸 | 妈妈看了他的＿＿，非常高兴。
班主任 | bān zhǔ rèn | head teacher | 负责管理一个班的老师 | 我们的＿＿很关心每一个学生。
家长会 | jiā zhǎng huì | parents' meeting | 学校请家长来开的会 | 下星期五学校要开＿＿，爸爸妈妈都会去。
同桌 | tóng zhuō | deskmate | 坐在一张桌子旁边的同学 | 我的＿＿学习很好，经常帮助我。
寒假 | hán jià | winter vacation | 冬天学校放的假 | 春节在＿＿里，学生们可以回家过年。
入学 | rù xué | to start school | 开始进学校学习 | 很多国家的孩子六岁＿＿。
`,
  },
  // Unit 3: The Environment.
  {
    theme: ["Forests and Wildlife", "森林和野生动物"],
    data: `
砍 | kǎn | to chop | 用刀用力劈 | 你不能随便＿＿公园里的树。 | 砍伐
砍伐 | kǎn fá | to fell (trees) | 把大树砍倒 | 森林被大量＿＿，很多动物失去了家。 | 砍
灭绝 | miè jué | to become extinct | 完全没有了 | 很多年以前，恐龙就已经＿＿了。
绝对 | jué duì | absolutely | 完全，一定 | 你放心，这件事我＿＿不告诉别人。
野生动物 | yě shēng dòng wù | wildlife | 在自然里生活、不是人养的动物 | 这里不能打猎，因为要保护＿＿。 | 生物多样性
打猎 | dǎ liè | to hunt | 在野外捉野兽 | 过去这里的人靠＿＿生活。
猎人 | liè rén | hunter | 打猎的人 | 森林里住着一个老＿＿。
珍稀 | zhēn xī | rare and precious | 少而宝贵 | 大熊猫是一种＿＿动物。
生物多样性 | shēng wù duō yàng xìng | biodiversity | 地球上生物种类很多的情况 | 保护森林就是保护＿＿。 | 野生动物
保护区 | bǎo hù qū | nature reserve | 保护动物和植物的地方 | 这个自然＿＿里生活着很多大熊猫。
`,
  },
  {
    theme: ["Waste and Pollution", "废物和污染"],
    data: `
废物 | fèi wù | waste | 没有用的东西 | 我们可以把一些＿＿变成有用的东西。 | 废纸
废水 | fèi shuǐ | wastewater | 用过的脏水 | 工厂的＿＿不能直接排到河里。
废纸 | fèi zhǐ | waste paper | 用过不要的纸 | 把＿＿放进回收箱里，可以再做成新纸。 | 废物
尾气 | wěi qì | exhaust | 汽车排出来的气 | 汽车的＿＿会污染空气。
雾霾 | wù mái | smog | 空气污染很严重时出现的灰色天气 | 今天有＿＿，最好别去外面运动。
臭 | chòu | smelly | 气味难闻 | 这条河的水又黑又＿＿。
恶化 | è huà | to deteriorate | 变得更坏 | 如果不保护，这里的环境会继续＿＿。
废弃 | fèi qì | abandoned | 不再用了 | 这个＿＿的工厂被改成了一个公园。
放弃 | fàng qì | to give up | 不再坚持 | 遇到困难的时候，不要轻易＿＿。
堆 | duī | pile | 放在一起的一大团东西 | 门口放着一大＿＿旧报纸。
`,
  },
  {
    theme: ["Water and Land", "水和土地"],
    data: `
冰川 | bīng chuān | glacier | 高山上很多年也不化的冰 | 因为气候变暖，很多＿＿正在变小。
四川 | sì chuān | Sichuan | 中国西南的一个省 | 大熊猫的家在中国的＿＿。
小溪 | xiǎo xī | brook | 小河 | 山上流下来一条清清的＿＿。
泥土 | ní tǔ | earth | 地上的土 | 下过雨以后，＿＿很湿。 | 土壤 泥
土壤 | tǔ rǎng | soil | 地面上能长植物的一层土 | 这里的＿＿很好，适合种水果。 | 泥土
滴 | dī | (measure word) drop | 用来计算一点点水的单位 | 我们要节约用水，不要浪费一＿＿水。
荒地 | huāng dì | wasteland | 没有人种的地 | 这片＿＿以前什么都没有，现在种满了树。
枯 | kū | withered | 草木没有水分，死了 | 很久没下雨，花都＿＿了。
荒凉 | huāng liáng | desolate | 没有人，很冷清 | 这里以前很＿＿，现在建起了很多房子。
泥 | ní | mud | 和了水的土 | 下了一天的雨，路上都是＿＿。 | 泥土
`,
  },
  {
    theme: ["Cycles and Balance", "循环和平衡"],
    data: `
循环 | xún huán | to circulate | 转了一圈又一圈 | 水在自然界中不断地＿＿。
平衡 | píng héng | balance | 两方面一样重 | 人和自然要保持＿＿。
生态 | shēng tài | ecology | 生物和环境的关系 | 保护＿＿环境是每个人的责任。
回收 | huí shōu | to recycle | 把用过的东西收回来再用 | 这些瓶子可以＿＿。
衡量 | héng liáng | to weigh up | 比较，判断 | 不能只用钱来＿＿一个人的成功。
逐渐 | zhú jiàn | gradually | 慢慢地 | 天气＿＿暖和起来了。 | 渐渐
渐渐 | jiàn jiàn | little by little | 一点一点地 | 太阳下山了，天＿＿黑了。 | 逐渐
遵循 | zūn xún | to follow | 按照 | 我们要＿＿自然的规律。
迁移 | qiān yí | to migrate | 从一个地方搬到另一个地方 | 每年秋天，很多鸟会向南＿＿。
多余 | duō yú | superfluous | 不需要的，多出来的 | 把＿＿的饭菜带回家，不要浪费。
`,
  },
  {
    theme: ["Materials and Rubbish", "材料和垃圾"],
    data: `
玻璃 | bō li | glass | 透明的硬材料 | 窗户上的＿＿很干净。
属于 | shǔ yú | to belong to | 是某一类的 | 塑料瓶＿＿可回收垃圾。
金属 | jīn shǔ | metal | 铁、金这样的材料 | 铁和金都是＿＿。
厨余垃圾 | chú yú lā jī | food waste | 吃剩的饭菜和果皮 | 西瓜皮是＿＿。
其余 | qí yú | the rest | 别的 | 我们班有三个人去了，＿＿的同学都在家。
业余 | yè yú | amateur; spare-time | 不是专业的；工作以外的 | 他是一个＿＿画家，平时在银行工作。
埋 | mái | to bury | 放进土里盖上 | 小狗把骨头＿＿在了树下。
废品 | fèi pǐn | scrap | 没有用的旧东西 | 他把家里的旧报纸卖给了收＿＿的人。
恶心 | ě xin | nauseous | 想吐的感觉 | 这个味道太难闻了，让人＿＿。 | 可恶
可恶 | kě wù | hateful | 让人讨厌 | 这些人在河边放了很多垃圾，真＿＿！ | 恶心
`,
  },
  {
    theme: ["A Changing Climate", "气候变化"],
    data: `
全球变暖 | quán qiú biàn nuǎn | global warming | 地球的温度不断升高 | ＿＿让冰川变小，海平面升高。
温室 | wēn shì | greenhouse | 种植物用的保暖的房子 | 冬天，农民在＿＿里种菜。
排放 | pái fàng | to emit | 把废气、废水排出去 | 我们要减少二氧化碳的＿＿。
节能 | jié néng | energy-saving | 节约能源 | 这种灯很＿＿，用电很少。
节约 | jié yuē | to save | 少用，不浪费 | 洗手的时候要＿＿用水。
臭氧 | chòu yǎng | ozone | 一种气体，在天上保护地球 | ＿＿层保护着地球上的生命。
稀少 | xī shǎo | scarce | 很少 | 沙漠里雨水＿＿，植物也很少。
可再生 | kě zài shēng | renewable | 用了还能再有的 | 太阳能是一种＿＿能源。
太阳能 | tài yáng néng | solar energy | 从太阳光得到的能量 | 这种车用＿＿，不用油。
高温 | gāo wēn | high temperature | 很高的温度 | 今年夏天很多地方都出现了＿＿天气。
`,
  },
  {
    theme: ["Protecting Nature", "保护自然"],
    data: `
珍贵 | zhēn guì | precious | 很宝贵，很难得到 | 这些老照片对我们家来说非常＿＿。
环保袋 | huán bǎo dài | reusable bag | 可以用很多次的购物袋 | 去商店买东西的时候，最好带上＿＿。 | 塑料袋
塑料袋 | sù liào dài | plastic bag | 用塑料做的袋子 | 很多商店已经不免费给顾客＿＿了。 | 环保袋
绿化 | lǜ huà | to make green | 种树种草，让地方变绿 | 这个城市的＿＿做得很好，到处都是树。
动植物 | dòng zhí wù | animals and plants | 动物和植物 | 这片森林里有上千种＿＿。
自然界 | zì rán jiè | the natural world | 大自然里的一切 | 在＿＿里，每种生物都有自己的作用。
清新 | qīng xīn | fresh | 干净、让人舒服 | 雨后的空气特别＿＿。
荒山 | huāng shān | barren hill | 没有树的山 | 二十年前这里是一座＿＿，现在种满了树。
污染源 | wū rǎn yuán | source of pollution | 造成污染的地方 | 这家工厂是这条河最大的＿＿。
搬迁 | bān qiān | to relocate | 搬到别的地方 | 因为要建新机场，这个村子要＿＿。
`,
  },
  {
    theme: ["Energy", "能源"],
    data: `
风能 | fēng néng | wind energy | 从风得到的能量 | 这个地方风很大，适合用＿＿发电。 | 风车
核电站 | hé diàn zhàn | nuclear power plant | 用核能发电的地方 | 法国的电大部分来自＿＿。
发电 | fā diàn | to generate electricity | 生产电 | 人们用风、水和太阳来＿＿。
天然气 | tiān rán qì | natural gas | 地下的一种能烧的气 | 很多家庭用＿＿做饭。
省电 | shěng diàn | to save electricity | 少用电 | 出门的时候关灯，可以＿＿。
断电 | duàn diàn | power cut | 电没有了 | 昨天晚上突然＿＿了，家里一片黑。
电力 | diàn lì | electric power | 电 | 夏天天气热，用空调的人多，＿＿紧张。
风车 | fēng chē | windmill | 风吹着转的机器 | 草原上有很多大＿＿，用来发电。 | 风能
用电 | yòng diàn | to use electricity | 让电器工作 | 晚上七点到十点是＿＿最多的时候。
水电 | shuǐ diàn | water and electricity bills | 用水和用电 | 这个月的＿＿费一共三百块。
`,
  },
  {
    theme: ["Natural Disasters", "自然灾害"],
    data: `
水灾 | shuǐ zāi | flood disaster | 因为水太多造成的灾害 | 连续下了十天大雨，这里发生了＿＿。 | 泥石流
山火 | shān huǒ | wildfire | 山上的大火 | 天气又干又热，很容易发生＿＿。
泥石流 | ní shí liú | mudslide | 大雨以后山上的泥和石头一起流下来 | 下大雨的时候，山区要小心＿＿。 | 水灾
降雨 | jiàng yǔ | rainfall | 下雨 | 这个地区夏天＿＿多，冬天很少下雨。
防灾 | fáng zāi | disaster prevention | 提前做准备，减少灾害 | 学校经常给学生上＿＿课，教大家地震时怎么保护自己。 | 防火
受灾 | shòu zāi | to be hit by a disaster | 遇到灾害 | 这次台风让很多村子＿＿。
预警 | yù jǐng | early warning | 在危险发生以前提醒大家 | 天气台发布了暴雨＿＿，请大家不要出门。
逃生 | táo shēng | to escape (danger) | 从危险的地方逃出来 | 发生火灾的时候，大家要知道怎么＿＿。
抗灾 | kàng zāi | to fight a disaster | 和灾害斗争，减少损失 | 洪水来了，村里的人一起＿＿，保住了大家的房子。 | 防灾
防火 | fáng huǒ | fire prevention | 不让着火 | 秋天山上的草很干，要注意＿＿。 | 防灾
`,
  },
  // Unit 4: Technology.
  {
    theme: ["Into Space", "飞向太空"],
    data: `
卫星 | wèi xīng | satellite | 在太空中绕着星球转的东西 | 月亮是地球的＿＿。
火箭 | huǒ jiàn | rocket | 能飞到太空的飞行器 | ＿＿把卫星送上了太空。
航天 | háng tiān | spaceflight | 飞到太空去 | 中国的＿＿事业发展得很快。
发射 | fā shè | to launch | 送出去，射出去 | 这个卫星是去年＿＿的。
轨道 | guǐ dào | orbit; track | 星球或卫星走的路线 | 卫星进入了预定的＿＿。
航天员 | háng tiān yuán | astronaut | 到太空去工作的人 | 三名＿＿在太空中生活了半年。
遥远 | yáo yuǎn | distant | 很远 | 火星离地球非常＿＿。
空间站 | kōng jiān zhàn | space station | 在太空中让人住和工作的地方 | 航天员在＿＿里做了很多实验。
探测器 | tàn cè qì | probe | 用来探查的机器 | 科学家把＿＿送到了火星上。 | 卫星
登月 | dēng yuè | to land on the moon | 登上月球 | 一九六九年，人类第一次＿＿。
`,
  },
  {
    theme: ["Machines and Control", "机器和控制"],
    data: `
机械 | jī xiè | machinery | 各种机器 | 他在工厂里修理＿＿。
控制 | kòng zhì | to control | 管住，让它按要求动 | 他生气的时候很难＿＿自己。
遥控器 | yáo kòng qì | remote control | 在远处控制电视等的小东西 | 电视的＿＿找不到了。
自动 | zì dòng | automatic | 不用人管，自己动 | 人走近的时候，这个门会＿＿打开。
驱动 | qū dòng | to drive (a machine) | 推动机器工作 | 这辆车是用电来＿＿的。
无人机 | wú rén jī | drone | 没有人在上面开的小飞机 | 他用＿＿从天上拍了很多照片。
钢铁 | gāng tiě | steel | 钢和铁 | 这座桥是用＿＿建成的。
插头 | chā tóu | plug | 电线头上插进去的东西 | 这个＿＿太大了，插不进去。 | 插座
插座 | chā zuò | socket | 墙上让插头插进去的地方 | 墙上有三个＿＿，可以同时给手机充电。 | 插头
开关 | kāi guān | switch | 打开或关上电器的东西 | 灯的＿＿在门的右边。
`,
  },
  {
    theme: ["Computers and Code", "电脑和代码"],
    data: `
芯片 | xīn piàn | chip | 电脑里最重要的小零件 | 这部手机的＿＿速度很快。
储存 | chǔ cún | to store | 存起来留着以后用 | 这台电脑可以＿＿很多照片和视频。
内存 | nèi cún | memory (RAM) | 电脑工作时临时放数据的地方 | 同时打开太多软件，电脑的＿＿就不够用了。
编程 | biān chéng | to program | 写电脑程序 | 他十岁就开始学习＿＿了。
代码 | dài mǎ | code | 写程序用的文字 | 工程师写了几千行＿＿。
算法 | suàn fǎ | algorithm | 解决问题的计算步骤 | 这个网站用＿＿来决定先给用户看哪些视频。
漏洞 | lòu dòng | loophole, security hole | 软件里能被人利用的错误 | 工程师发现了这个软件的一个安全＿＿。
黑客 | hēi kè | hacker | 非法进入别人电脑的人 | ＿＿偷走了这家公司的数据。
漏 | lòu | to leak | 从小洞里流出去 | 这个水杯＿＿水了，不能用了。
洞 | dòng | hole | 东西上破开的地方 | 墙上有一个小＿＿。
`,
  },
  {
    theme: ["Power and Connections", "电和连接"],
    data: `
迅速 | xùn sù | rapid | 非常快 | 网络技术发展得非常＿＿。
消耗 | xiāo hào | to consume | 用掉 | 这台机器每天要＿＿很多电。
耗电 | hào diàn | to use power | 用掉电 | 玩游戏很＿＿，手机一会儿就没电了。
电源 | diàn yuán | power supply | 提供电的地方 | 修理电器以前，要先关上＿＿。
无线 | wú xiàn | wireless | 不用线连接的 | 这家咖啡馆有免费的＿＿网络。
蓝牙 | lán yá | Bluetooth | 一种近距离连接的技术 | 我用＿＿把手机和电脑连在一起。
耳机 | ěr jī | earphones | 戴在耳朵上听声音的东西 | 在图书馆听音乐要戴＿＿。
音箱 | yīn xiāng | speaker | 放出声音的机器 | 这个＿＿的声音很大。
通信 | tōng xìn | communication | 用电话、网络等传送信息 | 现代＿＿技术让人们联系更方便。
尖端 | jiān duān | cutting-edge | 最先进的 | 这家公司有很多＿＿技术。
`,
  },
  {
    theme: ["Types and Weights", "类型和重量"],
    data: `
类型 | lèi xíng | type | 种类 | 你喜欢什么＿＿的电影？
型号 | xíng hào | model number | 产品的种类和编号 | 这两部手机的＿＿不一样。 | 类型
模型 | mó xíng | model (replica) | 照着真东西做的小东西 | 他用纸做了一个飞机＿＿。
大型 | dà xíng | large-scale | 很大的 | 这里要建一个＿＿体育馆。 | 小型 新型
小型 | xiǎo xíng | small-scale | 很小的 | 他开了一家＿＿公司，只有五个员工。 | 大型 新型
新型 | xīn xíng | new type | 新的种类 | 这是一种＿＿材料，又轻又硬。 | 大型 小型
克 | kè | gram | 重量单位 | 这包糖重五百＿＿。 | 千克
千克 | qiān kè | kilogram | 一公斤 | 这个箱子重二十＿＿。 | 克
粒 | lì | (measure word for grains) | 用来计算小而圆的东西的单位 | 米饭要吃干净，一＿＿米也不要浪费。
克服 | kè fú | to overcome | 战胜困难 | 他＿＿了很多困难，终于完成了实验。
`,
  },
  {
    theme: ["Energy and Matter", "能量和物质"],
    data: `
电波 | diàn bō | radio wave | 在空中传送信号的波 | 手机是用＿＿来传送声音的。
波浪 | bō làng | wave | 水面上一起一伏的水 | 海上的风很大，＿＿很高。
辐射 | fú shè | radiation | 向四周放出的能量 | 太阳的＿＿很强，夏天要注意防晒。
磁铁 | cí tiě | magnet | 能吸铁的东西 | ＿＿可以吸住铁做的东西。
燃料 | rán liào | fuel | 能烧的东西，比如煤和油 | 汽车需要＿＿才能跑。
燃烧 | rán shāo | to burn | 着火 | 煤＿＿的时候会放出热量。
晶体 | jīng tǐ | crystal | 原子排列有规律的固体 | 雪花是一种＿＿。
宝贵 | bǎo guì | valuable | 非常有价值 | 时间是最＿＿的东西。
宝石 | bǎo shí | gemstone | 很贵的漂亮石头 | 这块＿＿是红色的，非常漂亮。
尖 | jiān | pointed | 一头很细很利 | 这支笔太＿＿了，小心别伤到手。
`,
  },
  {
    theme: ["Apps and Devices", "应用和设备"],
    data: `
智能手机 | zhì néng shǒu jī | smartphone | 能上网、装软件的手机 | 现在连老人也会用＿＿。
二维码 | èr wéi mǎ | QR code | 用手机扫的黑白方块图 | 用手机扫一下这个＿＿就可以付钱了。
扫描 | sǎo miáo | to scan | 用机器把图或字读进电脑 | 请把这份文件＿＿一下，发到我的邮箱。 | 复印
复印 | fù yìn | to photocopy | 照着原来的印一份 | 请帮我把护照＿＿两份。 | 扫描
应用 | yìng yòng | app | 手机或电脑上的软件 | 我在手机上下载了一个学中文的＿＿。
更新 | gēng xīn | to update | 换成新的 | 这个软件需要＿＿到最新的版本。
外卖 | wài mài | takeout | 送到家里的饭菜 | 今天太累了，不想做饭，我们叫＿＿吧。
录像 | lù xiàng | to record video | 用机器把画面录下来 | 爸爸用手机给孩子的生日会＿＿。
锁 | suǒ | to lock | 关上门，让别人打不开 | 出门的时候，别忘了＿＿门。
解锁 | jiě suǒ | to unlock | 打开锁；让手机可以用 | 他看了一眼手机，手机就＿＿了。
`,
  },
  {
    theme: ["Science and Research", "科学研究"],
    data: `
人工智能 | rén gōng zhì néng | artificial intelligence | 让机器像人一样思考的技术 | 现在，＿＿已经可以帮助医生判断病情了。
自动化 | zì dòng huà | automation | 机器自己完成工作 | 这家工厂实现了＿＿，只需要很少的工人。
领域 | lǐng yù | field | 一定的范围 | 他是电脑＿＿的专家。
模拟 | mó nǐ | to simulate | 照着真的做出来 | 科学家用电脑＿＿地震发生时的情况。
虚拟 | xū nǐ | virtual | 不是真的，用电脑做出来的 | 戴上这个眼镜，你就进入了一个＿＿世界。
纳米 | nà mǐ | nanometer | 非常小的长度单位 | 一根头发大约有几万＿＿粗。
研发 | yán fā | research and development | 研究和开发 | 这家公司每年都花很多钱＿＿新产品。
专利 | zhuān lì | patent | 发明的人对发明享有的权利 | 他的发明已经申请了＿＿。
端 | duān | to carry level | 平着拿 | 服务员＿＿着两碗面走了过来。
接纳 | jiē nà | to admit, to take in | 接受 | 这所学校每年都＿＿很多外国学生。
`,
  },
  {
    theme: ["Technology in Daily Life", "生活中的科技"],
    data: `
高铁 | gāo tiě | high-speed rail | 速度很快的火车 | 坐＿＿从北京到上海只要四个多小时。
充电宝 | chōng diàn bǎo | power bank | 能给手机充电的小电池 | 手机快没电了，你带＿＿了吗？
流量 | liú liàng | mobile data | 手机上网用的数据 | 这个月的手机＿＿快用完了，我只能用无线网络。
机器翻译 | jī qì fān yì | machine translation | 用电脑自动翻译 | 现在的＿＿已经很准确了，但是有时候还会出错。
刷卡 | shuā kǎ | to pay by card | 用卡付钱 | 这家店不收现金，只能＿＿。
导航 | dǎo háng | navigation | 告诉人怎么走 | 开车的时候打开手机＿＿，就不会走错路。
电子书 | diàn zǐ shū | e-book | 在电脑或手机上读的书 | 我喜欢看纸做的书，不太喜欢看＿＿。
电动车 | diàn dòng chē | electric vehicle | 用电跑的车 | ＿＿不用油，没有尾气。
钢笔 | gāng bǐ | fountain pen | 用墨水写字的笔 | 爷爷喜欢用＿＿写字。
扫地机器人 | sǎo dì jī qì rén | robot vacuum | 自动打扫地面的机器 | 家里有了＿＿，打扫房间容易多了。
`,
  },
  // Unit 5: Traditions and Customs.
  {
    theme: ["The Spring Festival", "春节"],
    data: `
除夕 | chú xī | Lunar New Year's Eve | 农历一年的最后一天 | 春节的前一天叫＿＿。
年夜饭 | nián yè fàn | New Year's Eve dinner | 春节前一天晚上全家一起吃的饭 | 不管离家多远，很多人都要回家吃＿＿。
鞭炮 | biān pào | firecrackers | 点着以后会响的东西 | 为了安全，很多城市过年的时候不让放＿＿了。
春联 | chūn lián | Spring Festival couplets | 春节时贴在门两边的红纸，上面写着好听的话 | 过年的时候，大门两边写着吉祥话的红纸叫＿＿。
压岁钱 | yā suì qián | New Year money | 过年时老人给孩子的钱 | 春节的时候，爷爷奶奶给了我很多＿＿。
团圆 | tuán yuán | reunion | 家里人在一起 | 中秋节是家人＿＿的节日。
守岁 | shǒu suì | to see the New Year in | 春节前一天晚上不睡觉，等新年到来 | 那天晚上，很多家庭会一起＿＿，等新年的到来。
元宵节 | yuán xiāo jié | Lantern Festival | 农历正月十五的节日 | 农历正月十五是＿＿，人们会去看灯。
灯笼 | dēng long | lantern | 用纸或布做的灯 | 过节的时候，街上有很多红＿＿。
窗花 | chuāng huā | paper-cut window decoration | 贴在窗户上的剪纸 | 奶奶用红纸剪了很多漂亮的＿＿。
`,
  },
  {
    theme: ["Festivals of the Year", "一年的节日"],
    data: `
端午节 | duān wǔ jié | Dragon Boat Festival | 农历五月初五的节日 | 农历五月初五是＿＿。
粽子 | zòng zi | zongzi | 用叶子包着米煮熟的食品 | 妈妈包的＿＿里面有肉，非常好吃。
龙舟 | lóng zhōu | dragon boat | 做成龙的样子的船 | 每年这个时候，河上都有＿＿比赛。
清明节 | qīng míng jié | Qingming Festival | 四月初纪念去世的亲人的节日 | ＿＿在每年四月初，人们会去纪念去世的亲人。
扫墓 | sǎo mù | to tend the graves | 去打扫去世的亲人的墓 | 每年四月，我们全家都去给爷爷＿＿。
重阳节 | chóng yáng jié | Double Ninth Festival | 农历九月初九的节日 | 农历九月初九是＿＿，人们会去爬山。
七夕 | qī xī | Qixi Festival | 农历七月初七的节日 | ＿＿被叫做中国的情人节。
腊月 | là yuè | twelfth lunar month | 农历十二月 | 到了＿＿，大家就开始准备过年了。
腊八 | là bā | Laba Festival | 农历十二月初八 | 农历十二月初八叫＿＿。
中秋 | zhōng qiū | Mid-Autumn | 农历八月十五 | ＿＿的月亮又大又亮。
`,
  },
  {
    theme: ["Weddings and Birthdays", "婚礼和生日"],
    data: `
新郎 | xīn láng | bridegroom | 结婚那天的男子 | 婚礼上，＿＿穿着黑色的西服。
新娘 | xīn niáng | bride | 结婚那天的女子 | ＿＿穿着白色的长裙，非常漂亮。
嫁 | jià | (of a woman) to marry | 女子结婚 | 她＿＿给了一个医生。
娶 | qǔ | (of a man) to marry | 男子结婚，把女子接过来 | 他＿＿了一位老师做妻子。
婚宴 | hūn yàn | wedding banquet | 结婚时请客人吃的饭 | 他们的＿＿请了两百多位客人。 | 宴会
宴会 | yàn huì | banquet | 很多人在一起吃饭的正式活动 | 学校为毕业生举办了一场＿＿。
寿星 | shòu xing | birthday person | 过生日的人 | 今天的＿＿是谁？祝你生日快乐！
长寿 | cháng shòu | long-lived | 活得很久 | 他们村有很多＿＿的老人，有的已经一百多岁了。
祝寿 | zhù shòu | to celebrate an elder's birthday | 给老人过生日 | 奶奶八十岁生日那天，全家人都来给她＿＿。
长寿面 | cháng shòu miàn | longevity noodles | 生日时吃的面 | 过生日的时候，中国人常常吃一碗＿＿。
`,
  },
  {
    theme: ["Customs and Good Luck", "风俗和吉祥"],
    data: `
吉祥 | jí xiáng | auspicious | 好运的，好的 | 红色在中国代表＿＿和快乐。 | 吉利
吉利 | jí lì | lucky | 运气好 | 很多人觉得数字“八”很＿＿。 | 吉祥
象征 | xiàng zhēng | to symbolize | 用一个东西代表另一个意思 | 在中国，龙＿＿着力量和好运。
特征 | tè zhēng | characteristic | 特别的地方 | 这种鸟最大的＿＿是长着红色的嘴。
禁忌 | jìn jì | taboo | 不能做、不能说的事 | 每个地方都有自己的＿＿，去旅行以前最好先了解一下。
迷信 | mí xìn | superstition | 相信没有科学根据的东西 | 有人认为数字“四”不好，这只是一种＿＿。
仪式 | yí shì | ceremony | 正式的活动 | 学校举行了开学＿＿。
礼仪 | lǐ yí | etiquette | 礼节和规矩 | 去别人家做客要注意＿＿。 | 禁忌
鞠躬 | jū gōng | to bow | 弯下身子表示尊敬 | 在日本，人们见面的时候常常＿＿。
祭祖 | jì zǔ | to honor one's ancestors | 纪念祖先的活动 | 春节的时候，有些家庭会＿＿，纪念家里的先人。
`,
  },
  {
    theme: ["Traditional Arts", "传统艺术"],
    data: `
剪纸 | jiǎn zhǐ | paper cutting | 用剪刀在纸上剪出图案的艺术 | 奶奶用红纸做了很多＿＿，有小鸟，有小鱼。
剪刀 | jiǎn dāo | scissors | 剪东西的工具 | 小孩子用＿＿的时候要小心。
书法 | shū fǎ | calligraphy | 写毛笔字的艺术 | 爷爷每天都练习＿＿，他的毛笔字写得很好。
武术 | wǔ shù | martial arts | 中国传统的打拳、用刀等的功夫 | 他从小就学习＿＿，身体特别好。
舞狮 | wǔ shī | lion dance | 人在狮子的道具里跳舞 | 过年的时候，街上有＿＿表演。 | 杂技
狮子 | shī zi | lion | 一种很大的猛兽 | 动物园里的＿＿正在睡觉。
旗袍 | qí páo | qipao | 中国女子穿的一种传统长裙 | 她穿着一件红色的＿＿，非常漂亮。 | 汉服
汉服 | hàn fú | Hanfu | 汉族的传统服装 | 现在很多年轻人喜欢穿＿＿拍照。 | 旗袍
戏曲 | xì qǔ | traditional opera | 中国传统的戏 | 京剧是中国最有名的＿＿。
杂技 | zá jì | acrobatics | 各种难度很大的身体表演 | 我们去看了一场＿＿表演，演员们的动作很难。
`,
  },
  {
    theme: ["Flags and Circles", "旗子和圆"],
    data: `
国旗 | guó qí | national flag | 代表国家的旗 | 每个国家都有自己的＿＿。 | 旗子
旗子 | qí zi | flag | 挂在杆子上的布 | 运动员们手里拿着小＿＿走进了体育场。 | 国旗
圆 | yuán | round | 像球一样 | 中秋节的月亮又大又＿＿。 | 圆形
圆形 | yuán xíng | circle (shape) | 圆的形状 | 这张桌子是＿＿的，可以坐十个人。 | 圆
圆满 | yuán mǎn | satisfactory | 没有缺点，完全成功 | 这次活动取得了＿＿成功。
除了 | chú le | except, besides | 不算在内 | ＿＿他以外，大家都来了。
除非 | chú fēi | unless | 只有 | ＿＿下大雨，否则我们明天一定去。
武器 | wǔ qì | weapon | 打仗用的东西 | 博物馆里有很多古代的＿＿。
征求 | zhēng qiú | to solicit | 问别人的意见 | 做决定以前，他先＿＿了父母的意见。
吉他 | jí tā | guitar | 一种有六根弦的乐器 | 他会弹＿＿，也会唱歌。
`,
  },
  {
    theme: ["The Lunar Calendar", "农历"],
    data: `
农历 | nóng lì | lunar calendar | 中国传统的历法 | 中国的春节在＿＿正月初一。
阳历 | yáng lì | Gregorian calendar | 世界上普遍使用的历法 | 现在世界上大部分国家都用＿＿。
节气 | jié qì | solar term | 一年中的二十四个时间点 | 中国传统上把一年分成二十四个＿＿。
立春 | lì chūn | Beginning of Spring | 二十四节气的第一个 | ＿＿以后，天气就慢慢暖和了。
冬至 | dōng zhì | winter solstice | 一年中白天最短的一天 | ＿＿那天，中国北方的人常常吃饺子。
属相 | shǔ xiang | Chinese zodiac sign | 用十二种动物代表出生的年 | 你的＿＿是什么？我属狗。
吉日 | jí rì | auspicious day | 好日子 | 他们选了一个＿＿结婚。
正月 | zhēng yuè | first lunar month | 农历一月 | 农历的＿＿是一年的第一个月。
夕阳 | xī yáng | setting sun | 快落山的太阳 | 我们坐在海边看＿＿。
通宵 | tōng xiāo | all night | 一整夜 | 他昨天＿＿没睡，今天特别累。
`,
  },
  {
    theme: ["Feasts and Table Manners", "宴请和餐桌礼节"],
    data: `
宴请 | yàn qǐng | to fete | 请人吃饭 | 公司＿＿了来访的客人。
夜宵 | yè xiāo | late-night snack | 晚上很晚吃的东西 | 他学习到很晚，妈妈给他做了＿＿。
元宵 | yuán xiāo | sweet rice dumplings | 用米粉做的圆的甜食 | 正月十五那天，我们全家一起吃＿＿、看灯。
敬茶 | jìng chá | to serve tea respectfully | 双手把茶送给别人，表示尊敬 | 婚礼上，新郎新娘给父母＿＿。
忌口 | jì kǒu | to avoid certain foods | 因为生病等不吃某些东西 | 医生说他这几天要＿＿，不能吃辣的。
礼节 | lǐ jié | courtesy | 表示尊敬的方式 | 吃饭的时候等老人先吃，这是中国的一种＿＿。
圆桌 | yuán zhuō | round table | 圆形的桌子 | 中国人请客常常用＿＿，大家坐在一起，方便说话。
茶道 | chá dào | tea ceremony | 喝茶的艺术 | 她在日本学过＿＿。
寿宴 | shòu yàn | birthday banquet | 给老人过生日时的宴会 | 爷爷九十岁的＿＿来了很多亲戚。
上菜 | shàng cài | to serve the dishes | 把做好的菜拿到桌上 | 客人都到了，服务员开始＿＿了。
`,
  },
  {
    theme: ["Remembering and Respect", "纪念和尊敬"],
    data: `
墓地 | mù dì | cemetery | 埋去世的人的地方 | 这片＿＿很安静，四周种了很多树。
祭拜 | jì bài | to pay respects (to ancestors) | 向去世的人表示敬意 | 清明节的时候，很多人去＿＿祖先。
寿命 | shòu mìng | lifespan | 活的时间 | 现在人们的＿＿比过去长多了。
笼子 | lóng zi | cage | 关鸟或动物的东西 | 他打开＿＿，把小鸟放走了。
敬老 | jìng lǎo | to respect the elderly | 尊重和照顾老人 | 重阳节也是一个＿＿的节日。 | 尊老爱幼
尊老爱幼 | zūn lǎo ài yòu | to respect the old and care for the young | 尊敬老人，爱护孩子 | ＿＿是中国的传统美德。 | 敬老
同舟共济 | tóng zhōu gòng jì | to pull together in hard times | 在困难的时候一起努力 | 遇到困难的时候，大家要＿＿。
鞭子 | biān zi | whip | 赶马用的长条 | 马车上的人手里拿着一根＿＿。
大吉大利 | dà jí dà lì | great good fortune | 非常吉利 | 春节的时候，人们常说“＿＿”，希望新的一年事事顺利。
剪彩 | jiǎn cǎi | to cut the ribbon | 新的地方开始使用时剪开红色的带子 | 新医院开业那天，市长来＿＿。
`,
  },
  // Unit 6: Government and Public Life.
  {
    theme: ["Laws and Officials", "法律和官员"],
    data: `
宪法 | xiàn fǎ | constitution | 国家最根本的法律 | 很多国家的＿＿都写明了公民的基本权利。
官员 | guān yuán | official | 在政府里工作、管事的人 | 政府＿＿应该认真听市民的意见。
法官 | fǎ guān | judge | 在法院里审案子的人 | ＿＿听完了双方的意见，做出了判决。
外交官 | wài jiāo guān | diplomat | 代表国家和别的国家打交道的人 | 他的父亲是一名＿＿，在很多国家工作过。
政策 | zhèng cè | policy | 政府做事的计划和办法 | 政府出了新的＿＿，帮助年轻人找工作。 | 对策
对策 | duì cè | countermeasure | 对付问题的办法 | 遇到问题的时候，我们要想出好的＿＿。 | 政策
委员 | wěi yuán | committee member | 负责某件事的一群人中的一个 | 他被选为学生会的＿＿。 | 委员会
委员会 | wěi yuán huì | committee | 一群负责某件事的人 | 这个问题由一个专门的＿＿来解决。 | 委员
委托 | wěi tuō | to entrust | 请别人替自己办事 | 他＿＿律师帮他处理这件事。
签署 | qiān shǔ | to sign (officially) | 正式签上名字 | 两个国家＿＿了新的合作文件。
`,
  },
  {
    theme: ["Elections", "选举"],
    data: `
投票 | tóu piào | to vote | 把选票放进箱子里，表示自己的选择 | 明天大家要＿＿选出新的班长。
候选人 | hòu xuǎn rén | candidate | 等着被选的人 | 这次选举一共有三位＿＿。
当选 | dāng xuǎn | to be elected | 被选上 | 她得到了最多的票，＿＿为班长。
任期 | rèn qī | term of office | 担任职务的时间 | 这位市长的＿＿是四年。
连任 | lián rèn | to serve another term | 再做一次同样的职务 | 他工作做得很好，＿＿了两届。
届 | jiè | (measure word for sessions or graduating classes) | 用来计算会议、毕业年级等的单位 | 他是我们学校第一＿＿毕业生。
宣誓 | xuān shì | to take an oath | 正式地说出一定要做到的话 | 新市长上任的时候要＿＿。
召开 | zhào kāi | to convene | 开（会） | 学校下星期一要＿＿全体老师大会。
选举权 | xuǎn jǔ quán | right to vote | 参加选举的权利 | 在很多国家，公民年满十八岁就有＿＿。
多数 | duō shù | majority | 大部分 | 会上，大＿＿人同意这个计划。
`,
  },
  {
    theme: ["Getting Things Done", "办手续"],
    data: `
填写 | tián xiě | to fill in | 在表格空的地方写上 | 请用黑色的笔＿＿你的姓名和地址。
填表 | tián biǎo | to fill in a form | 在表格上写好需要的信息 | 办护照的时候要先＿＿。
盖章 | gài zhāng | to stamp | 在文件上印上章 | 这份文件要＿＿以后才有效。
手续 | shǒu xù | procedures | 办事的步骤 | 办签证的＿＿很简单。
窗口 | chuāng kǒu | service window | 办事的地方 | 请到三号＿＿交钱。
档案 | dàng àn | file, records | 保存起来的材料 | 学生的＿＿保存在学校的办公室里。
缴费 | jiǎo fèi | to pay a fee | 交钱 | 你可以在网上＿＿，不用去银行。
查询 | chá xún | to look up | 查找，打听 | 你可以在网上＿＿考试成绩。 | 咨询
咨询 | zī xún | to consult | 请别人出主意 | 如果有问题，可以打电话＿＿。 | 查询
询问 | xún wèn | to inquire | 问 | 警察向他＿＿了事情的经过。
`,
  },
  {
    theme: ["Taxes and Public Money", "税收和公共资金"],
    data: `
纳税 | nà shuì | to pay taxes | 按规定交税 | 每个公民都有＿＿的义务。
纳税人 | nà shuì rén | taxpayer | 交税的人 | 政府的钱来自＿＿，所以要用好每一分钱。
补贴 | bǔ tiē | subsidy | 政府给的补助的钱 | 政府给买电动车的人发＿＿。
贴 | tiē | to stick | 把薄的东西粘在别的东西上 | 寄信以前要先＿＿上邮票。
缴纳 | jiǎo nà | to pay (fees, taxes) | 交 | 他每个月都准时＿＿水电费。
财政 | cái zhèng | public finance | 政府的收入和花费 | 政府的＿＿收入主要来自税收。
设施 | shè shī | facilities | 为了某种需要建的东西 | 这个社区新建了很多体育＿＿。
措施 | cuò shī | measure | 处理问题的办法 | 政府采取了很多＿＿保护环境。
实施 | shí shī | to implement | 实行 | 这个新规定从下个月开始＿＿。
繁荣 | fán róng | prosperous | 经济发展得很好 | 这个城市的经济很＿＿。
`,
  },
  {
    theme: ["Upholding the Law", "依法办事"],
    data: `
执行 | zhí xíng | to carry out | 按照计划或决定去做 | 他认真地＿＿了领导的决定。
执法 | zhí fǎ | to enforce the law | 按照法律办事 | 警察要严格＿＿，对每个人都一样。 | 执行
依法 | yī fǎ | according to law | 按照法律 | 公民要＿＿纳税。
依靠 | yī kào | to rely on | 靠 | 他不想＿＿父母，想自己赚钱。
惩罚 | chéng fá | to punish | 处罚 | 违反规定的人会受到＿＿。
侵犯 | qīn fàn | to violate (rights) | 伤害别人的权利 | 不经别人同意用别人的照片，可能会＿＿别人的权利。 | 侵权
侵权 | qīn quán | infringement | 侵犯别人的权利 | 随便使用别人的作品是＿＿行为。 | 侵犯
拒绝 | jù jué | to refuse | 不接受 | 他＿＿了我的邀请。
执照 | zhí zhào | license | 政府发的允许做某事的证明 | 开饭店需要营业＿＿。
依然 | yī rán | still | 还是 | 十年过去了，他＿＿住在那个小城。
`,
  },
  {
    theme: ["Public Transport", "公共交通"],
    data: `
公交车 | gōng jiāo chē | bus | 城市里按固定路线开的车 | 我每天坐＿＿上学。
地铁站 | dì tiě zhàn | metro station | 坐地铁的地方 | 从我家走到＿＿只要五分钟。
站台 | zhàn tái | platform | 车站里上下车的地方 | 请在＿＿上等车，不要离黄线太近。
票价 | piào jià | fare | 车票的价钱 | 这条线的＿＿是两块钱。
繁忙 | fán máng | busy | 事情多，很忙 | 早上七八点是交通最＿＿的时候。
首班车 | shǒu bān chē | first bus or train | 每天的第一班车 | ＿＿早上五点半发车。
公交站 | gōng jiāo zhàn | bus stop | 等公交车的地方 | 我在＿＿等了十分钟，车才来。 | 地铁站
准点 | zhǔn diǎn | on time | 按规定的时间 | 这里的地铁很＿＿，很少晚到。
公交卡 | gōng jiāo kǎ | transit card | 坐公交和地铁用的卡 | 上车的时候，刷一下＿＿就行了。
让座 | ràng zuò | to give up one's seat | 把座位让给别人 | 他在地铁上给一位老人＿＿。
`,
  },
  {
    theme: ["Town and Suburbs", "城镇和郊区"],
    data: `
郊区 | jiāo qū | suburbs | 城市外边的地方 | 他们家住在＿＿，空气比市中心好。 | 郊外
郊外 | jiāo wài | outskirts | 城市外面有山有水的地方 | 星期天我们去＿＿爬山。 | 郊区
县城 | xiàn chéng | county town | 县政府所在的小城 | 他在一个小＿＿长大。 | 县
县 | xiàn | county | 省下面管理的地方 | 这个＿＿有三十万人口。 | 县城
小巷 | xiǎo xiàng | alley | 窄的小街 | 老城区有很多弯弯的＿＿。 | 街道
街道 | jiē dào | street | 城市里的路 | 这条＿＿非常干净。 | 小巷
路灯 | lù dēng | street lamp | 路边晚上亮的灯 | 天黑了，＿＿都亮了。
人行道 | rén xíng dào | sidewalk | 路两边给人走的地方 | 走路的时候要走＿＿。
公告栏 | gōng gào lán | notice board | 贴通知的地方 | 学校的＿＿上有一张新通知。
栏目 | lán mù | column, section | 报纸、节目中的一个部分 | 这个电视节目有一个介绍美食的＿＿。
`,
  },
  {
    theme: ["Honor and Service", "荣誉和服务"],
    data: `
光荣 | guāng róng | glorious | 让人尊敬的 | 他觉得当一名消防员很＿＿。 | 荣幸
荣幸 | róng xìng | honored | 感到光荣和幸运 | 能参加这次活动，我感到非常＿＿。 | 光荣
繁体字 | fán tǐ zì | traditional characters | 笔画多的汉字 | 很多老书是用＿＿印的。
号召 | hào zhào | to call on | 请大家一起做 | 学校＿＿学生们节约用水。
志愿者 | zhì yuàn zhě | volunteer | 自愿帮助别人、不要钱的人 | 运动会上有很多＿＿帮忙。
誓言 | shì yán | oath | 发誓时说的话 | 他没有忘记自己的＿＿。
发誓 | fā shì | to swear | 认真地说一定做到 | 他＿＿以后再也不迟到了。
依次 | yī cì | in turn | 一个接一个地 | 请大家＿＿上车。
署名 | shǔ míng | to sign one's name | 在作品上写上自己的名字 | 这篇文章没有＿＿，不知道是谁写的。
消防 | xiāo fáng | fire fighting | 防火和救火 | 学校每年都进行＿＿演习。
`,
  },
  {
    theme: ["Public Life", "公共生活"],
    data: `
监督 | jiān dū | to supervise | 看着别人做事，让人做好 | 市民可以＿＿政府的工作。
官方 | guān fāng | official | 政府方面的 | 这是＿＿发布的消息，可以相信。
官网 | guān wǎng | official website | 正式的网站 | 你可以在学校的＿＿上看到考试时间。
公章 | gōng zhāng | official seal | 单位用的章 | 这份证明上要有学校的＿＿。
规章 | guī zhāng | regulations | 规定 | 每个员工都要遵守公司的＿＿制度。
填空 | tián kòng | to fill in the blank | 在空的地方写上答案 | 这次考试有二十道＿＿题。
市政府 | shì zhèng fǔ | city government | 管理城市的政府 | ＿＿决定在市中心建一个新公园。
公共场所 | gōng gòng chǎng suǒ | public place | 大家都可以去的地方 | 在＿＿不能吸烟。
盖子 | gài zi | lid | 盖在上面的东西 | 喝完水以后，记得把瓶子的＿＿盖好。
公共服务 | gōng gòng fú wù | public services | 政府给大家提供的服务 | 图书馆、公园和医院都是＿＿的一部分。
`,
  },
];
