// The clues of the gap sentences of the level 5 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelFiveClues are the clues of the gap sentences of the level 5 words, by clueKey, each word's sentence counted as 1. */
export const levelFiveClues = parseClues(`
慈善/1 | 公司每年拿钱帮助有困难的人 | Each year the company gives money to help those in need, so the word must mean charity.
捐款/1 | 地震以后很多人给灾区钱 | After the earthquake many gave money to the stricken area, so the word must mean to donate money.
捐献/1 | 把收藏的古画都送给博物馆 | He gave his old paintings to the museum, so the word must mean to donate.
援助/1 | 很多国家向灾区提供的帮助 | Many countries sent help to the disaster area, so the word must mean aid.
救援/1 | 地震以后很快赶到现场救人的 | They rushed to the scene to save people, so the word must mean rescue.
困难/1 | 家里有难处，邻居来帮忙 | His family is in difficulty and the neighbours help, so the word must mean difficulty.
贫困/1 | 地区过去很穷，现在好多了 | The area was once poor and is better off now, so the word must mean poverty-stricken.
公益/1 | 星期六去打扫公园那样的活动 | He joins activities like cleaning the park, so the word must mean public welfare.
扶/1 | 老人走路不稳，去用手帮他 | The old man is unsteady, so give him a hand, so the word must mean to support with the hand.
受益/1 | 老师的话让我得到很多好处 | The teacher's words did me much good, so the word must mean to benefit.
残疾/1 | 腿有问题，但每天坚持锻炼 | His leg is impaired yet he exercises daily, so the word must mean disability.
残疾人/1 | 公共汽车上给他们留了座位 | Seats on the bus are kept for them, so the word must mean disabled person.
疾病/1 | 多运动可以预防很多 | Exercise prevents many of them, so the word must mean disease.
扶手/1 | 车开得很快，请拉好 | The bus is fast, so hold on to it, so the word must mean handrail.
贡献/1 | 为城市的发展做出了很大的 | He did much for the city's growth, so the word must mean contribution.
献血/1 | 身体健康，每年去医院给血 | Healthy, he gives blood every year, so the word must mean to donate blood.
困/1 | 晚上没睡好，现在想睡觉 | I slept badly and now feel sleepy, so the word must mean sleepy.
有益/1 | 读书对孩子成长有好处 | Reading is good for growing children, so the word must mean beneficial.
利益/1 | 做决定时要想到大家的好处 | A decision must weigh everyone's interests, so the word must mean interest.
困境/1 | 公司遇到了很难的情况 | The company is in a tight spot, so the word must mean predicament.
年龄/1 | 报名时写上姓名和多大 | Write your name and age when signing up, so the word must mean age.
老龄化/1 | 很多国家老人越来越多 | Many countries face an ageing population, so the word must mean ageing.
高龄/1 | 爷爷已经九十岁了 | Grandpa is already ninety, so the word must mean advanced age.
移民/1 | 一家人十年前搬到加拿大住 | The family moved to Canada for good, so the word must mean to emigrate.
移动/1 | 他受伤了，先不要动他 | He is hurt, so do not move him yet, so the word must mean to move.
转移/1 | 洪水来以前把人送到安全的地方 | Before the flood people were taken to safety, so the word must mean to evacuate, to transfer.
同龄人/1 | 他比一样大的人成熟 | He is more mature than others his age, so the word must mean peer.
劳动/1 | 孩子们在学校种菜感受快乐 | The children grow vegetables and enjoy the work, so the word must mean labour.
劳动力/1 | 城市发展需要大量干活的人 | A growing city needs many workers, so the word must mean labour force.
劳累/1 | 工作了一天非常累 | After a day's work he is worn out, so the word must mean tired.
婚姻/1 | 结婚三十年了还和以前一样好 | Married thirty years and still happy, so the word must mean marriage.
孝顺/1 | 每个星期回家看父母 | He visits his parents every week, so the word must mean filial.
孝心/1 | 礼物是孩子对父母的心意 | The gift shows the child's love for the parents, so the word must mean filial devotion.
尊敬/1 | 学生们都很敬重老教授 | The students respect the old professor, so the word must mean to respect.
敬爱/1 | 我们又尊敬又爱的老师退休了 | Our beloved teacher retired today, so the word must mean beloved, esteemed.
顺利/1 | 祝考试没有问题 | Good luck with the exam, so the word must mean smooth, successful.
孝敬/1 | 用第一个月的工资买礼物给父母 | He bought his parents a gift with his first pay, so the word must mean to show respect to elders.
对待/1 | 用同样的态度对每一个人 | Treat everyone the same way, so the word must mean to treat.
待遇/1 | 公司的工资很高 | The company pays well, so the word must mean pay and conditions.
招待/1 | 客人来了，做一桌菜给他们吃 | Mum cooked a meal for the guests, so the word must mean to entertain.
歧视/1 | 不能因为年龄、性别看不起人 | No one should be looked down on for age or sex, so the word must mean to discriminate.
偏见/1 | 不应该对别国的人有不公平的看法 | We should not be biased against foreigners, so the word must mean prejudice.
阶层/1 | 社会上不同的人群生活方式不同 | Different social strata live differently, so the word must mean social stratum.
台阶/1 | 门口有几级，走路小心 | There are some steps at the door, so the word must mean steps.
阶段/1 | 比赛进入了最后一个 | The contest has reached its last stage, so the word must mean stage.
分歧/1 | 两个人看法不一样，讨论了很久 | They disagreed and argued a long time, so the word must mean difference of opinion.
偏/1 | 帽子戴得不正，往左一点 | Your hat is crooked, move it left, so the word must mean askew.
偏偏/1 | 想出去玩，天却下雨了 | Just when I wanted to go out it rained, so the word must mean contrary to expectation.
弱势/1 | 老人和残疾人这样需要关心的群体 | Groups like the old and disabled need care, so the word must mean disadvantaged.
优势/1 | 会说三种语言，找工作更有利 | Three languages give him an edge, so the word must mean advantage.
秩序/1 | 排好队，不要乱 | Queue up and keep order, so the word must mean order.
遵守/1 | 每个人都要按交通规则做 | Everyone should obey traffic rules, so the word must mean to abide by.
道德/1 | 法律管不到的地方要靠它 | Where law does not reach, it must rule, so the word must mean morality.
美德/1 | 诚实是一种好的品质 | Honesty is one, so the word must mean virtue.
品德/1 | 学校不只教知识，还重视学生的为人 | School also cares about pupils' character, so the word must mean moral character.
稳定/1 | 想找一份不常变的工作 | He wants a steady job, so the word must mean stable.
平稳/1 | 飞机飞得很稳，大家都睡着了 | The flight was smooth and everyone slept, so the word must mean smooth.
稳重/1 | 年轻但做事不急不乱 | He is young, yet he works without haste or muddle, so the word must mean steady, sedate.
顺序/1 | 书按出版时间先后放 | The books are shelved by date, so the word must mean order, sequence.
公德/1 | 在电影院大声打电话不对 | Loud calls in a cinema show a lack of it, so the word must mean public morality.
矛盾/1 | 两个人闹别扭，很久没说话 | The two have fallen out and not spoken for long, so the word must mean conflict.
和谐/1 | 邻居们相处得很好 | The neighbours get on well, so the word must mean harmonious.
趋势/1 | 网上买东西的人一年比一年多 | More people shop online each year, so the word must mean trend.
形势/1 | 经济很好，找工作不难 | The economy is good and jobs are easy to find, so the word must mean situation.
谐音/1 | “四”和“死”读音差不多 | Four and death sound alike in Chinese, so the word must mean homophone.
敬意/1 | 向救援人员表示尊敬 | We salute the rescuers, so the word must mean respect.
劳驾/1 | 请让我过去一下 | Excuse me, let me pass, so the word must mean excuse me.
扶持/1 | 政府帮助小企业发展 | The government supports small firms, so the word must mean to support.
顺便/1 | 去商店时也帮我买瓶水 | Get me some water while you are at the shop, so the word must mean on the way, incidentally.
顺手/1 | 出门时随手关灯 | Turn off the light as you leave, so the word must mean conveniently.
期待/1 | 大家都盼着这次旅行 | Everyone is looking forward to the trip, so the word must mean to look forward to.
等待/1 | 在雨里等了半小时汽车 | He waited half an hour for the bus in the rain, so the word must mean to wait.
接待/1 | 前台工作人员热情地对客人 | The receptionist welcomed us warmly, so the word must mean to receive.
看待/1 | 你怎么看这个问题 | How do you view this question, so the word must mean to regard.
敬礼/1 | 小朋友向警察叔叔举手 | The child saluted the policeman, so the word must mean to salute.
手势/1 | 用手告诉我们不要说话 | He signalled with his hand to be quiet, so the word must mean gesture.
献花/1 | 演出结束孩子上台送花 | The children gave the actors flowers, so the word must mean to present flowers.
偏爱/1 | 妈妈说她不特别喜欢哪个孩子 | Mum says she has no favourite child, so the word must mean to favour.
勤劳/1 | 父母每天很早就去地里干活 | His parents go to the fields early each day, so the word must mean hard-working.
顺路/1 | 回家时经过车站送你 | I pass the station on my way home, so the word must mean on the way.
收益/1 | 商店今年挣的钱比去年多 | The shop earned more this year, so the word must mean earnings.
益处/1 | 锻炼对身体有很多好处 | Exercise does the body much good, so the word must mean benefit.
功劳/1 | 比赛能赢大家都有份 | Everyone deserves credit for the win, so the word must mean credit, contribution.
劳动节/1 | 每年五月一日 | It falls on the first of May, so the word must mean Labour Day.
偏食/1 | 孩子只爱吃肉不爱吃菜 | The child eats only meat, so the word must mean to be a picky eater.
移植/1 | 春天是把小树换地方种的好时候 | Spring is the time to transplant saplings, so the word must mean to transplant.
遵照/1 | 按医生说的每天吃三次药 | Take the medicine as the doctor says, so the word must mean to follow.
气势/1 | 大楼又高又大，很有力量 | The tall building is imposing, so the word must mean imposing manner.
顺心/1 | 工作不如意，心情不好 | Work is not going well and he is down, so the word must mean satisfactory.
稳/1 | 车要开了，站好 | Stand firm, the bus is moving off, so the word must mean steady.
幼儿园/1 | 四岁的妹妹每天去的地方 | My four-year-old sister goes there each morning, so the word must mean kindergarten.
初中/1 | 小学毕业以后九月去上 | He starts it in September after primary school, so the word must mean junior high school.
初级/1 | 刚开始学中文上的班 | A beginner joins this class, so the word must mean elementary.
硕士/1 | 大学毕业以后又读了两年 | She studied two more years after her degree, so the word must mean master's degree.
课堂/1 | 老师希望学生上课时多说话 | The teacher wants pupils to speak up in class, so the word must mean classroom.
食堂/1 | 中午在学校吃饭的地方 | We eat lunch there at school, so the word must mean canteen.
宿舍/1 | 大学四个人住一间 | Four of us shared a room at university, so the word must mean dormitory.
幼小/1 | 那时候他还很小，什么都不懂 | He was too young to understand, so the word must mean very young.
初步/1 | 对问题有了一点了解 | We have a first understanding of the issue, so the word must mean preliminary.
暑假/1 | 今年夏天放假时去中国 | I plan to visit China in the summer holiday, so the word must mean summer holiday.
补习/1 | 数学不好，星期六去多学 | Weak at maths, he takes extra lessons on Saturdays, so the word must mean to take extra lessons.
辅导/1 | 哥哥晚上帮我做作业 | My brother helps me with my homework, so the word must mean to tutor.
背诵/1 | 老师让我们把诗记住说出来 | The teacher wants us to recite the poem, so the word must mean to recite.
默写/1 | 老师说一个词，我们写一个 | The teacher says a word and we write it from memory, so the word must mean to write from memory.
拼音/1 | 学中文先要学好 | It is the first thing to learn in Chinese, so the word must mean pinyin.
概念/1 | 老师讲了很多遍才懂的新东西 | The new idea made sense to us only after the teacher had explained it many times, so the word must mean concept.
大概/1 | 他差不多十分钟以后到 | He will be here in about ten minutes, so the word must mean probably, about.
疑惑/1 | 对答案不太明白，又去问老师 | Unsure of the answer, he asked the teacher, so the word must mean doubt.
启发/1 | 书让我想到了很多 | The book gave me much to think about, so the word must mean inspiration.
补充/1 | 我说完了，你还要加什么 | The speaker has finished and asks whether you have anything to add, so the word must mean to add.
表扬/1 | 上课认真，老师在全班面前说他好 | The teacher praised him before the class, so the word must mean to praise.
鼓励/1 | 父母一直支持我做喜欢的事 | My parents always urge me on, so the word must mean to encourage.
奖励/1 | 得了第一名学校给的一千元 | The school gave him a thousand yuan for first place, so the word must mean reward.
勉强/1 | 不想去，最后还是同意了 | He agreed in the end against his will, so the word must mean reluctantly.
天赋/1 | 五岁就会弹琴 | She played the piano at five, so the word must mean talent, gift.
擅长/1 | 画画很好，经常得奖 | He paints well and often wins prizes, so the word must mean to be good at.
智慧/1 | 老故事里古人的聪明 | Old stories hold the wisdom of the ancients, so the word must mean wisdom.
范文/1 | 老师把他的作文读给大家当样子 | The teacher read his essay as a model, so the word must mean model essay.
模范/1 | 大家都向他学习的学生 | Everyone learns from him, so the word must mean model, exemplary.
发扬/1 | 让互相帮助的传统更好 | We must carry on the tradition of helping each other, so the word must mean to carry forward.
作弊/1 | 考试时不诚实的行为 | It is dishonest in an exam, so the word must mean to cheat.
逃课/1 | 他每节课都认真听，从来不这样 | He attends every lesson and never does this, so the word must mean to skip class.
逃/1 | 小猫看见大狗马上跑开 | The kitten ran off at the sight of the dog, so the word must mean to flee.
文凭/1 | 找工作时不是最重要的，能力更重要 | Ability matters more than this paper, so the word must mean diploma.
凭/1 | 靠自己的努力考上大学 | He got into university through his own effort, so the word must mean to rely on.
默默/1 | 每天不出声地学习，不说累 | He studies quietly every day, so the word must mean silently.
稿子/1 | 记者把写好的发给报社 | The reporter sent in his piece, so the word must mean manuscript.
草稿/1 | 先写一遍，改好了再写到卷子上 | Write a rough version first, so the word must mean draft.
晓得/1 | 你知道他住在哪儿吗 | Do you know where he lives, so the word must mean to know.
勉励/1 | 校长在毕业典礼上鼓励大家 | The head urged everyone on at graduation, so the word must mean to encourage.
书籍/1 | 图书馆里有各种各样的 | The library has all kinds of them, so the word must mean books.
国籍/1 | 住在中国很多年，但还是英国人 | He lives in China but is still British, so the word must mean nationality.
学籍/1 | 转学了，学生的登记也转过去 | His school record moved with him, so the word must mean student status.
手册/1 | 新同学入学时拿到的一本 | Each new pupil gets one, so the word must mean handbook.
注册/1 | 开学第一天新生先去办公室登记 | New students register on the first day, so the word must mean to register.
画册/1 | 里面有很多有名的画 | It holds many famous paintings, so the word must mean picture album.
规模/1 | 大学有三万多个学生 | The university has over thirty thousand students, so the word must mean scale.
范例/1 | 老师给一个让我们照着写 | The teacher gave us an example to follow, so the word must mean example.
示范/1 | 老师先做一遍，学生再做 | The teacher demonstrates first, so the word must mean to demonstrate.
启示/1 | 故事告诉我们做事不能太急 | The story teaches us not to rush, so the word must mean lesson, revelation.
劣势/1 | 个子不高，打篮球不利 | Being short is a handicap in basketball, so the word must mean disadvantage.
优劣/1 | 两家饭店差不多，分不出哪家好 | One cannot tell which is better, so the word must mean merits and demerits.
利弊/1 | 做决定前想想好处和坏处 | Weigh the pros and cons first, so the word must mean pros and cons.
概率/1 | 明天下雨的可能很小 | The chance of rain tomorrow is small, so the word must mean probability.
擅自/1 | 没有老师同意不能自己离开 | Pupils may not leave without leave, so the word must mean without permission.
拼命/1 | 为了考上好大学用尽全力学习 | He studies flat out to get into a good university, so the word must mean with all one's might.
拼写/1 | 英语单词的写法很难记 | The word's spelling is hard to remember, so the word must mean spelling.
舍得/1 | 很愿意花钱买书 | He gladly spends money on books, so the word must mean to be willing to part with.
舍不得/1 | 毕业时同学们不想分开 | Classmates hated to part at graduation, so the word must mean to be reluctant to part with.
智商/1 | 很聪明，但不太会交流 | He is very clever but poor at talking to people, so the word must mean IQ.
困惑/1 | 对未来不知道该选什么专业 | He is unsure what to study, so the word must mean confusion.
诵读/1 | 早上学生们在教室里大声读课文 | Pupils read the text aloud each morning, so the word must mean to read aloud.
补考/1 | 上次没及格，下星期再考 | He failed and must resit next week, so the word must mean resit.
补课/1 | 生病一星期，老师放学后给他上课 | The teacher gave him catch-up lessons, so the word must mean to make up lessons.
初学者/1 | 书很简单，适合刚开始学的人 | The book suits beginners, so the word must mean beginner.
当初/1 | 那时候我选中文是因为喜欢中国电影 | Back then I chose Chinese for its films, so the word must mean at the time.
初次/1 | 第一次见面，请多关照 | The two are meeting for the first time, so the word must mean first time.
默认/1 | 他没有反对，大家当他同意了 | He did not object, so it was taken as consent, so the word must mean to tacitly accept.
赞扬/1 | 救人的行为受到大家的称赞 | Everyone praised his rescue, so the word must mean praise.
堂/1 | 今天下午有两节数学课 | There are two maths lessons this afternoon, so the word must mean measure word for lessons.
博士/1 | 读了五年终于拿到学位 | After five years he earned his doctorate, so the word must mean doctorate.
本科/1 | 大学四年学的是经济 | He studied economics as an undergraduate, so the word must mean undergraduate course.
学位/1 | 在英国拿到了硕士的 | He got a master's in Britain, so the word must mean degree.
讲座/1 | 下午有一个关于环保的，去听吗 | There is a talk on the environment this afternoon, so the word must mean lecture.
导师/1 | 指导他的是一位有名的教授 | His supervisor is a famous professor, so the word must mean supervisor.
学分/1 | 修满了毕业需要的 | He has earned all the credits he needs, so the word must mean credit.
选修/1 | 这学期自己选了一门历史课 | I chose a history course this term, so the word must mean to take as an elective.
必修/1 | 每个学生都要学的课 | Every student must take it, so the word must mean compulsory.
奖学金/1 | 学习很好，每年都能拿到 | She studies so well she wins it every year, so the word must mean scholarship.
留学生/1 | 大学里来自不同国家的学生 | Students from many countries study here, so the word must mean overseas student.
课程/1 | 这个学期每天都有六节课 | There are six lessons every day this term, so the word must mean curriculum, courses.
考生/1 | 考试前先找到自己的座位 | They find their seats before the exam, so the word must mean examinee.
高考/1 | 在中国一般在六月 | In China it is usually held in June, so the word must mean college entrance exam.
录取/1 | 好大学要了他 | A good university accepted him, so the word must mean to admit.
成绩单/1 | 妈妈看了他的分数很高兴 | Mum was pleased with his report card, so the word must mean report card.
班主任/1 | 很关心班上每一个学生的老师 | This teacher cares for every pupil in the class, so the word must mean head teacher of a class.
家长会/1 | 学校开会，爸爸妈妈都去 | Parents go to this meeting at school, so the word must mean parents' meeting.
同桌/1 | 坐在我旁边的同学学习好 | The classmate beside me studies well, so the word must mean deskmate.
寒假/1 | 春节在这个假里，学生回家过年 | Spring Festival falls in it, so the word must mean winter holiday.
入学/1 | 孩子六岁开始上学 | Children start school at six, so the word must mean to start school.
砍/1 | 不能随便用刀斧弄倒公园里的树 | Do not chop the park's trees, so the word must mean to chop.
砍伐/1 | 森林被大量砍倒，动物没有家 | Forests are felled and animals lose their homes, so the word must mean to fell.
灭绝/1 | 恐龙很久以前就没有了 | The dinosaurs died out long ago, so the word must mean to become extinct.
绝对/1 | 我一定不告诉别人 | I will certainly not tell anyone, so the word must mean absolutely.
野生动物/1 | 不能打猎，要保护 | Hunting is banned to protect them, so the word must mean wildlife.
打猎/1 | 过去这里的人靠抓野兽生活 | People here once lived by hunting, so the word must mean to hunt.
猎人/1 | 森林里住着一个老的 | An old one lives in the forest, so the word must mean hunter.
珍稀/1 | 大熊猫很少很宝贵 | Pandas are rare and precious, so the word must mean rare.
生物多样性/1 | 保护森林就是保护它 | Protecting forests protects it, so the word must mean biodiversity.
保护区/1 | 自然的里面生活着很多大熊猫 | Many pandas live in this reserve, so the word must mean reserve.
废物/1 | 把没用的东西变成有用的 | We can turn waste into something useful, so the word must mean waste.
废水/1 | 工厂的不能排到河里 | A factory must not pour it into the river, so the word must mean waste water.
废纸/1 | 放进回收箱再做成新纸 | Put it in the recycling to make new paper, so the word must mean waste paper.
尾气/1 | 汽车排出来污染空气的 | Cars give it off and it fouls the air, so the word must mean exhaust.
雾霾/1 | 今天有，最好别去外面运动 | It is out today, so do not exercise outside, so the word must mean smog.
臭/1 | 河水又黑又难闻 | The river water is black and stinks, so the word must mean smelly.
恶化/1 | 不保护，环境会更坏 | Without protection things will get worse, so the word must mean to deteriorate.
废弃/1 | 不用了的工厂改成了公园 | The disused factory became a park, so the word must mean abandoned.
放弃/1 | 遇到困难不要轻易不干了 | Do not give up easily, so the word must mean to give up.
堆/1 | 门口放着一大叠旧报纸 | A big pile of old papers lies at the door, so the word must mean pile.
冰川/1 | 气候变暖，很多山上的大冰正在变小 | Warming is shrinking them, so the word must mean glacier.
四川/1 | 大熊猫的家在中国的这个省 | Pandas live in this province, so the word must mean Sichuan.
小溪/1 | 山上流下来的清清的小河 | A clear stream runs down the hill, so the word must mean brook.
泥土/1 | 下过雨以后地上的土很湿 | The earth is wet after rain, so the word must mean earth, soil.
土壤/1 | 这里的适合种水果 | The soil here suits fruit, so the word must mean soil.
滴/1 | 节约用水，不浪费一点点 | Waste not a drop of water, so the word must mean drop.
荒地/1 | 以前什么都没有，现在种满了树 | The once-bare land is now full of trees, so the word must mean wasteland.
枯/1 | 很久没下雨，花都干死了 | Without rain the flowers withered, so the word must mean withered.
荒凉/1 | 以前没什么人，现在建起很多房子 | Once deserted, the place now has many houses, so the word must mean desolate.
泥/1 | 下了一天雨，路上都是湿土 | After a day of rain the road is all mud, so the word must mean mud.
循环/1 | 水在自然界中不断地转来转去 | Water keeps going round in nature, so the word must mean to circulate.
平衡/1 | 人和自然不能一边多一边少 | People and nature must stay in balance, so the word must mean balance.
生态/1 | 保护这种环境是每个人的责任 | Protecting the eco-environment is everyone's duty, so the word must mean ecology.
回收/1 | 这些瓶子可以收回来再用 | The bottles can be recycled, so the word must mean to recycle.
衡量/1 | 不能只用钱来看一个人的成功 | Success cannot be measured by money alone, so the word must mean to measure, to judge.
逐渐/1 | 天气一点一点暖和起来 | The weather is getting warmer bit by bit, so the word must mean gradually.
渐渐/1 | 太阳下山，天慢慢黑了 | After sunset it slowly grew dark, so the word must mean gradually.
遵循/1 | 我们要按自然的规律做 | We must follow nature's laws, so the word must mean to follow.
迁移/1 | 秋天很多鸟往南飞 | Many birds fly south in autumn, so the word must mean to migrate.
多余/1 | 吃不完的饭菜带回家 | Take the leftovers home, so the word must mean surplus.
玻璃/1 | 窗户上透明的东西很干净 | The window pane is clean, so the word must mean glass.
属于/1 | 塑料瓶是可回收垃圾这一类 | Plastic bottles count as recyclable waste, so the word must mean to belong to.
金属/1 | 铁和金都是 | Iron and gold are both, so the word must mean metal.
厨余垃圾/1 | 西瓜皮是这一类垃圾 | Melon rind is this kind of rubbish, so the word must mean food waste.
其余/1 | 三个人去了，别的同学都在家 | Three went and the rest stayed home, so the word must mean the rest.
业余/1 | 平时在银行工作的画家 | He works at a bank and paints in his spare time, so the word must mean amateur.
埋/1 | 小狗把骨头放进土里盖上 | The puppy buried its bone, so the word must mean to bury.
废品/1 | 把旧报纸卖给收这些东西的人 | He sold old papers to the scrap dealer, so the word must mean scrap.
恶心/1 | 味道太难闻，让人想吐 | The smell is so bad it turns the stomach, so the word must mean nauseating.
可恶/1 | 在河边放很多垃圾的人 | People who dump rubbish by the river are hateful, so the word must mean hateful.
全球变暖/1 | 让冰川变小、海平面升高 | It shrinks glaciers and raises the sea, so the word must mean global warming.
温室/1 | 冬天农民在里面种菜 | Farmers grow vegetables in it in winter, so the word must mean greenhouse.
排放/1 | 要减少二氧化碳的 | We must cut carbon dioxide emissions, so the word must mean emission.
节能/1 | 灯用电很少 | The lamp uses little power, so the word must mean energy-saving.
节约/1 | 洗手时少用水 | Use less water when washing, so the word must mean to save.
臭氧/1 | 这层保护地球上的生命 | Its layer protects life on earth, so the word must mean ozone.
稀少/1 | 沙漠里雨水很少 | Rain is scarce in the desert, so the word must mean scarce.
可再生/1 | 太阳能是这种能源 | Solar power is this kind of energy, so the word must mean renewable.
太阳能/1 | 车不用油用它 | The car runs on it instead of fuel, so the word must mean solar energy.
高温/1 | 夏天很多地方特别热 | Many places had a heatwave, so the word must mean high temperature.
珍贵/1 | 老照片对我们家很宝贵 | The old photos are precious to us, so the word must mean precious.
环保袋/1 | 去商店时最好带上，不用塑料袋 | Take one to the shop instead of plastic, so the word must mean reusable bag.
塑料袋/1 | 很多商店不免费给顾客的 | Shops no longer give them away, so the word must mean plastic bag.
绿化/1 | 城市到处都是树 | Trees everywhere show the city's planting, so the word must mean greening.
动植物/1 | 森林里有上千种 | The forest has thousands of species, so the word must mean plants and animals.
自然界/1 | 每种生物在里面都有作用 | Every living thing plays a part in it, so the word must mean the natural world.
清新/1 | 雨后的空气特别干净 | The air after rain is fresh, so the word must mean fresh.
荒山/1 | 二十年前这座山上什么都没有 | Twenty years ago this hill was bare, so the word must mean barren hill.
污染源/1 | 工厂是这条河最大的 | The factory is the river's main polluter, so the word must mean source of pollution.
搬迁/1 | 要建新机场，村子要搬走 | The village must move for the new airport, so the word must mean to relocate.
风能/1 | 风很大，适合用来发电 | It is windy enough to make power from wind, so the word must mean wind power.
核电站/1 | 法国的电大部分来自它 | Most of France's power comes from them, so the word must mean nuclear power station.
发电/1 | 用风、水和太阳来做电 | People make electricity from wind, water and sun, so the word must mean to generate electricity.
天然气/1 | 很多家庭用来做饭 | Many homes cook with it, so the word must mean natural gas.
省电/1 | 出门关灯 | Turning off the lights saves it, so the word must mean to save electricity.
断电/1 | 晚上突然没电了，家里一片黑 | The power suddenly went off, so the word must mean power cut.
电力/1 | 夏天开空调的人多，很紧张 | Air conditioning strains it in summer, so the word must mean electric power.
风车/1 | 草原上用来发电的大东西 | Big ones on the grassland make power, so the word must mean windmill.
用电/1 | 晚上七点到十点最多 | It peaks from seven to ten, so the word must mean electricity use.
水电/1 | 这个月的这两样费用三百块 | This month's water and power bill is three hundred, so the word must mean water and electricity.
水灾/1 | 连续下了十天大雨 | Ten days of rain brought it, so the word must mean flood.
山火/1 | 天气又干又热容易发生 | Dry heat makes it likely, so the word must mean wildfire.
泥石流/1 | 下大雨时山区要小心 | Mountain areas must watch for it in heavy rain, so the word must mean mudslide.
降雨/1 | 夏天多，冬天很少下雨 | Summer is wet and winter dry, so the word must mean rainfall.
防灾/1 | 教学生地震时怎么保护自己的课 | The lessons teach pupils to protect themselves, so the word must mean disaster prevention.
受灾/1 | 台风让很多村子受害 | The typhoon struck many villages, so the word must mean to be hit by disaster.
预警/1 | 天气台说有暴雨，请别出门 | The weather office issued a storm warning, so the word must mean early warning.
逃生/1 | 火灾时要知道怎么跑出来 | In a fire you must know how to escape, so the word must mean to escape.
抗灾/1 | 洪水来了，大家一起保住房子 | Everyone fought the flood together, so the word must mean to fight a disaster.
防火/1 | 秋天山上草很干，要小心 | The dry autumn grass calls for care against fire, so the word must mean fire prevention.
卫星/1 | 月亮绕着地球转 | The moon is one of the earth's, so the word must mean satellite.
火箭/1 | 把卫星送上太空 | It carried the satellite into space, so the word must mean rocket.
航天/1 | 中国这方面的事业发展很快 | China's space industry is growing fast, so the word must mean spaceflight.
发射/1 | 卫星是去年送上天的 | The satellite was launched last year, so the word must mean to launch.
轨道/1 | 卫星进入了预定的 | The satellite entered its planned orbit, so the word must mean orbit.
航天员/1 | 三名在太空生活了半年 | Three of them lived in space for half a year, so the word must mean astronaut.
遥远/1 | 火星离地球很远 | Mars is far from the earth, so the word must mean distant.
空间站/1 | 航天员在里面做实验 | The astronauts do experiments on it, so the word must mean space station.
探测器/1 | 科学家送到火星上的机器 | Scientists sent it to Mars, so the word must mean probe.
登月/1 | 一九六九年人类第一次上月球 | People first reached the moon in 1969, so the word must mean to land on the moon.
机械/1 | 在工厂修理机器 | He repairs machines at the factory, so the word must mean machinery.
控制/1 | 生气时很难管住自己 | He finds it hard to hold himself back, so the word must mean to control.
遥控器/1 | 电视的找不到了 | The TV remote is lost, so the word must mean remote control.
自动/1 | 人走近门就自己开 | The door opens by itself, so the word must mean automatically.
驱动/1 | 车用电来让它跑 | The car is powered by electricity, so the word must mean to drive, to power.
无人机/1 | 用它从天上拍照片 | He took photos from the sky with it, so the word must mean drone.
钢铁/1 | 桥是用它建成的 | The bridge is built of it, so the word must mean steel.
插头/1 | 太大了插不进去 | It is too big to fit, so the word must mean plug.
插座/1 | 墙上有三个，可以同时充电 | There are three on the wall to charge phones, so the word must mean socket.
开关/1 | 灯的在门的右边 | The light switch is right of the door, so the word must mean switch.
芯片/1 | 手机的速度很快 | The phone's chip is fast, so the word must mean chip.
储存/1 | 电脑可以存很多照片 | The computer can store many photos, so the word must mean to store.
内存/1 | 打开太多软件就不够用 | Too many programmes exhaust it, so the word must mean memory.
编程/1 | 十岁就开始学写程序 | He began coding at ten, so the word must mean programming.
代码/1 | 工程师写了几千行 | The engineer wrote thousands of lines, so the word must mean code.
算法/1 | 网站用它决定先给用户看什么 | The site uses it to pick videos, so the word must mean algorithm.
漏洞/1 | 软件的一个安全问题 | The engineer found a security weakness in the software, so the word must mean loophole, bug.
黑客/1 | 偷走了公司的数据 | This person stole the company's data, so the word must mean hacker.
漏/1 | 水杯有水流出来，不能用了 | The cup leaks, so the word must mean to leak.
洞/1 | 墙上有一个小的 | There is a small one in the wall, so the word must mean hole.
迅速/1 | 网络技术发展得非常快 | Network technology grows very fast, so the word must mean rapid.
消耗/1 | 机器每天用掉很多电 | The machine uses a lot of power, so the word must mean to consume.
耗电/1 | 玩游戏手机一会儿就没电了 | Games drain the battery fast, so the word must mean to use a lot of power.
电源/1 | 修电器以前要先关上 | Switch off the power first, so the word must mean power supply.
无线/1 | 咖啡馆有免费的网络 | The café has free Wi-Fi, so the word must mean wireless.
蓝牙/1 | 用它把手机和电脑连在一起 | I link my phone and computer with it, so the word must mean Bluetooth.
耳机/1 | 在图书馆听音乐要戴 | Wear them to listen in the library, so the word must mean headphones.
音箱/1 | 声音很大 | It is loud, so the word must mean speaker.
通信/1 | 现代技术让人们联系更方便 | Modern technology makes contact easier, so the word must mean communication.
尖端/1 | 公司有很多最先进的技术 | The company has cutting-edge technology, so the word must mean cutting-edge.
类型/1 | 你喜欢什么样的电影 | What kind of film do you like, so the word must mean type.
型号/1 | 两部手机不一样 | The two phones are different models, so the word must mean model.
模型/1 | 用纸做了一个飞机 | He made a paper plane model, so the word must mean model.
大型/1 | 要建一个很大的体育馆 | A large stadium will be built, so the word must mean large-scale.
小型/1 | 公司只有五个员工 | The company has five staff, so the word must mean small-scale.
新型/1 | 材料又轻又硬 | The new material is light and hard, so the word must mean new type.
克/1 | 糖重五百 | The sugar weighs five hundred grams, so the word must mean gram.
千克/1 | 箱子重二十 | The case weighs twenty kilograms, so the word must mean kilogram.
粒/1 | 一颗米也不浪费 | Do not waste a single grain, so the word must mean grain.
克服/1 | 战胜了很多困难完成实验 | He overcame many difficulties, so the word must mean to overcome.
电波/1 | 手机用它传送声音 | Phones carry sound by it, so the word must mean radio wave.
波浪/1 | 海上风大，浪很高 | The wind makes high waves, so the word must mean wave.
辐射/1 | 太阳的很强，要防晒 | The sun's is strong, so the word must mean radiation.
磁铁/1 | 可以吸住铁做的东西 | It attracts iron, so the word must mean magnet.
燃料/1 | 汽车需要它才能跑 | A car needs it to run, so the word must mean fuel.
燃烧/1 | 煤着火时放出热量 | Coal gives off heat as it burns, so the word must mean to burn.
晶体/1 | 雪花是一种 | A snowflake is one, so the word must mean crystal.
宝贵/1 | 时间是最珍贵的东西 | Time is most precious, so the word must mean valuable.
宝石/1 | 红色的，非常漂亮 | It is red and lovely, so the word must mean gem.
尖/1 | 笔太锋利，小心伤手 | The pen is sharp, so the word must mean pointed.
智能手机/1 | 现在连老人也会用 | Even old people use them now, so the word must mean smartphone.
二维码/1 | 用手机扫一下就能付钱 | Scan it with your phone to pay, so the word must mean QR code.
扫描/1 | 把文件变成电子的发到邮箱 | Scan the document and email it, so the word must mean to scan.
复印/1 | 把护照印两份 | Make two copies of the passport, so the word must mean to photocopy.
应用/1 | 手机上下载的学中文的软件 | I downloaded a Chinese learning app, so the word must mean app.
更新/1 | 软件要变成最新的版本 | The software needs the latest version, so the word must mean to update.
外卖/1 | 太累不想做饭，叫人送来 | Too tired to cook, we order delivery, so the word must mean takeaway.
录像/1 | 爸爸用手机拍下生日会 | Dad filmed the birthday party, so the word must mean to video.
锁/1 | 出门时别忘了关好门 | Do not forget to lock the door, so the word must mean to lock.
解锁/1 | 看一眼手机就打开了 | One glance unlocked the phone, so the word must mean to unlock.
人工智能/1 | 已经可以帮医生判断病情 | It can help doctors diagnose, so the word must mean artificial intelligence.
自动化/1 | 工厂只需要很少的工人 | The factory needs few workers, so the word must mean automation.
领域/1 | 他是电脑方面的专家 | He is an expert in the computer field, so the word must mean field, domain.
模拟/1 | 用电脑做出地震时的情况 | Scientists simulate an earthquake, so the word must mean to simulate.
虚拟/1 | 戴上眼镜进入的世界 | The glasses take you into this world, so the word must mean virtual.
纳米/1 | 头发有几万这样的长度粗 | A hair is tens of thousands of nanometres thick, so the word must mean nanometre.
研发/1 | 公司花很多钱做新产品 | The company spends heavily on new products, so the word must mean research and development.
专利/1 | 他的发明申请了 | He applied for one on his invention, so the word must mean patent.
端/1 | 服务员拿着两碗面过来 | The waiter carried over two bowls, so the word must mean to carry level.
接纳/1 | 学校每年接收很多外国学生 | The school admits many foreign students, so the word must mean to admit.
高铁/1 | 北京到上海只要四个多小时 | It takes just over four hours to Shanghai, so the word must mean high-speed rail.
充电宝/1 | 手机快没电了，你带了吗 | My phone is dying, have you got one, so the word must mean power bank.
流量/1 | 手机这个月快用完了，只能用无线网络 | My mobile data is nearly gone, so the word must mean data allowance.
机器翻译/1 | 已经很准确，有时还会出错 | It is accurate yet still errs, so the word must mean machine translation.
刷卡/1 | 店不收现金，只能用卡 | The shop takes cards only, so the word must mean to pay by card.
导航/1 | 开车时打开就不会走错 | Turn it on and you will not go wrong, so the word must mean navigation.
电子书/1 | 我喜欢纸书，不喜欢看这个 | I prefer paper books to these, so the word must mean e-book.
电动车/1 | 不用油，没有尾气 | It needs no petrol and gives no fumes, so the word must mean electric vehicle.
钢笔/1 | 爷爷喜欢用它写字 | Grandpa likes to write with it, so the word must mean fountain pen.
扫地机器人/1 | 家里有了它打扫容易多了 | With it cleaning is much easier, so the word must mean robot vacuum.
除夕/1 | 春节的前一天 | The sentence names the day before Spring Festival, so the word must mean New Year's Eve.
年夜饭/1 | 离家多远也要回家吃的 | People go home from afar to eat it, so the word must mean New Year's Eve dinner.
鞭炮/1 | 为了安全很多城市不让放 | Many cities ban them for safety, so the word must mean firecrackers.
春联/1 | 大门两边写着吉祥话的红纸 | Red paper strips by the door bear lucky words, so the word must mean Spring Festival couplets.
压岁钱/1 | 春节时爷爷奶奶给我的 | Grandparents gave it to me at New Year, so the word must mean New Year money.
团圆/1 | 中秋节是家人在一起的节日 | Mid-Autumn is for family reunion, so the word must mean reunion.
守岁/1 | 那天晚上不睡，等新年到来 | Families stay up to see the New Year in, so the word must mean to see the New Year in.
元宵节/1 | 正月十五去看灯 | People see lanterns on the fifteenth of the first month, so the word must mean Lantern Festival.
灯笼/1 | 过节街上很多红的 | Red ones line the streets at festivals, so the word must mean lantern.
窗花/1 | 奶奶用红纸剪的 | Grandma cut them from red paper, so the word must mean paper window decoration.
端午节/1 | 农历五月初五 | It falls on the fifth of the fifth month, so the word must mean Dragon Boat Festival.
粽子/1 | 妈妈包的，里面有肉 | Mum wrapped them with meat inside, so the word must mean zongzi.
龙舟/1 | 河上有比赛 | Races are held on the river, so the word must mean dragon boat.
清明节/1 | 四月初纪念去世的亲人 | Early April honours the dead, so the word must mean Qingming Festival.
扫墓/1 | 每年四月全家去爷爷的墓 | Each April we visit Grandpa's grave, so the word must mean to sweep a grave.
重阳节/1 | 农历九月初九去爬山 | On the ninth of the ninth month people climb hills, so the word must mean Double Ninth Festival.
七夕/1 | 被叫做中国的情人节 | It is called Chinese Valentine's Day, so the word must mean Qixi Festival.
腊月/1 | 到了这个月就准备过年 | People start preparing for New Year in it, so the word must mean twelfth lunar month.
腊八/1 | 农历十二月初八 | The sentence names the eighth day of the twelfth lunar month, so the word must mean Laba Festival.
中秋/1 | 那天的月亮又大又亮 | The moon is big and bright then, so the word must mean Mid-Autumn.
新郎/1 | 婚礼上穿黑西服的 | He wears a black suit at the wedding, so the word must mean bridegroom.
新娘/1 | 穿着白色长裙很漂亮 | She wears a long white dress, so the word must mean bride.
嫁/1 | 她和一个医生结婚 | She married a doctor, so the word must mean to marry, of a woman.
娶/1 | 他让一位老师做妻子 | He took a teacher as his wife, so the word must mean to marry, of a man.
婚宴/1 | 结婚请两百多位客人吃饭 | They invited over two hundred guests to the wedding feast, so the word must mean wedding banquet.
宴会/1 | 学校为毕业生办的 | The school held one for its graduates, so the word must mean banquet.
寿星/1 | 今天过生日的人是谁 | Who is the birthday person today, so the word must mean person celebrating a birthday.
长寿/1 | 村里有的老人一百多岁 | Some villagers are over a hundred, so the word must mean long-lived.
祝寿/1 | 奶奶八十岁生日全家来 | The whole family came for Grandma's eightieth, so the word must mean to celebrate an elder's birthday.
长寿面/1 | 过生日时吃一碗 | Chinese people eat a bowl on their birthday, so the word must mean longevity noodles.
吉祥/1 | 红色在中国代表好运和快乐 | Red stands for good luck in China, so the word must mean auspicious.
吉利/1 | 很多人觉得“八”带来好运 | Many find eight lucky, so the word must mean lucky.
象征/1 | 龙代表着力量和好运 | The dragon stands for power and luck, so the word must mean to symbolise.
特征/1 | 鸟最大的不同是红色的嘴 | The bird's chief mark is its red beak, so the word must mean feature.
禁忌/1 | 每个地方都有不能做的事 | Every place has its taboos, so the word must mean taboo.
迷信/1 | 认为“四”不好只是一种 | Thinking four unlucky is mere superstition, so the word must mean superstition.
仪式/1 | 学校举行的开学 | The school held an opening ceremony, so the word must mean ceremony.
礼仪/1 | 去别人家做客要注意 | Mind your manners as a guest, so the word must mean etiquette.
鞠躬/1 | 在日本见面时弯腰 | In Japan people bow on meeting, so the word must mean to bow.
祭祖/1 | 春节纪念家里的先人 | Families honour their forebears at New Year, so the word must mean to worship ancestors.
剪纸/1 | 奶奶用红纸剪出的小鸟小鱼 | Grandma cut birds and fish from red paper, so the word must mean paper-cut.
剪刀/1 | 小孩子用的时候要小心 | Children must take care using it, so the word must mean scissors.
书法/1 | 爷爷练毛笔字，写得很好 | Grandpa practises with the brush and writes beautifully, so the word must mean calligraphy.
武术/1 | 从小学习，身体特别好 | He has trained since childhood and is very fit, so the word must mean martial arts.
舞狮/1 | 过年时街上的表演 | It is performed in the streets at New Year, so the word must mean lion dance.
狮子/1 | 动物园里正在睡觉的动物 | The zoo's lion is asleep, so the word must mean lion.
旗袍/1 | 她穿着一件红色的，很漂亮 | She wears a lovely red qipao, so the word must mean qipao.
汉服/1 | 年轻人喜欢穿着拍照的传统衣服 | Young people like to be photographed in it, so the word must mean Hanfu.
戏曲/1 | 京剧是中国最有名的 | Peking opera is the most famous one, so the word must mean traditional opera.
杂技/1 | 演员们的动作很难 | The performers do very hard feats, so the word must mean acrobatics.
国旗/1 | 每个国家都有自己的 | Every country has its own, so the word must mean national flag.
旗子/1 | 运动员手里拿着小的走进体育场 | Athletes carried small ones into the stadium, so the word must mean flag.
圆/1 | 中秋的月亮又大又满 | The Mid-Autumn moon is big and full, so the word must mean round.
圆形/1 | 桌子可以坐十个人 | The table seats ten, so the word must mean circular.
圆满/1 | 活动取得了完全的成功 | The event was a complete success, so the word must mean complete, satisfactory.
除了/1 | 他以外大家都来了 | Everyone came except him, so the word must mean except.
除非/1 | 下大雨，不然一定去 | We will go unless it pours, so the word must mean unless.
武器/1 | 博物馆里古代打仗用的 | The museum has many ancient ones, so the word must mean weapon.
征求/1 | 做决定前先问父母的意见 | He sought his parents' views first, so the word must mean to solicit.
吉他/1 | 会弹，也会唱歌 | He can play it and sing, so the word must mean guitar.
农历/1 | 春节在它的正月初一 | Spring Festival is on its first day, so the word must mean lunar calendar.
阳历/1 | 世界上大部分国家都用 | Most countries use it, so the word must mean solar calendar.
节气/1 | 一年分成二十四个 | The year is divided into twenty-four of them, so the word must mean solar term.
立春/1 | 以后天气慢慢暖和了 | After it the weather warms up, so the word must mean Beginning of Spring.
冬至/1 | 那天北方的人常常吃饺子 | Northerners eat dumplings that day, so the word must mean Winter Solstice.
属相/1 | 问你属什么，我属狗 | I was born in the year of the dog, so the word must mean zodiac sign.
吉日/1 | 选了一个好日子结婚 | They chose a lucky day to marry, so the word must mean auspicious day.
正月/1 | 农历一年的第一个月 | It is the first month of the lunar year, so the word must mean first lunar month.
夕阳/1 | 坐在海边看太阳下山 | We sat by the sea watching it, so the word must mean setting sun.
通宵/1 | 昨天一夜没睡，今天很累 | He was up all night and is tired, so the word must mean all night.
宴请/1 | 公司请来访的客人吃饭 | The company gave a dinner for its visitors, so the word must mean to host a dinner.
夜宵/1 | 学习到很晚，妈妈做的吃的 | Mum made him a late-night snack, so the word must mean midnight snack.
元宵/1 | 正月十五全家一起吃、看灯 | We eat them on the fifteenth and watch lanterns, so the word must mean sweet dumplings.
敬茶/1 | 婚礼上新郎新娘给父母端茶 | The couple serve their parents tea, so the word must mean to serve tea respectfully.
忌口/1 | 医生说这几天不能吃辣 | He must avoid spicy food for a few days, so the word must mean to avoid certain foods.
礼节/1 | 吃饭等老人先吃 | Waiting for elders to eat first is one, so the word must mean etiquette.
圆桌/1 | 请客时大家坐在一起方便说话 | Guests sit together at it to talk, so the word must mean round table.
茶道/1 | 她在日本学过 | She studied it in Japan, so the word must mean tea ceremony.
寿宴/1 | 爷爷九十岁生日请亲戚吃饭 | Many relatives came to Grandpa's ninetieth feast, so the word must mean birthday banquet.
上菜/1 | 客人都到了，服务员端菜 | With all the guests in, the waiter starts bringing food, so the word must mean to serve dishes.
墓地/1 | 安静，四周种了很多树 | It is quiet and ringed with trees, so the word must mean cemetery.
祭拜/1 | 清明节很多人去纪念祖先 | At Qingming many honour their ancestors, so the word must mean to worship.
寿命/1 | 现在人们活得比过去长 | People live longer now, so the word must mean lifespan.
笼子/1 | 打开它把小鸟放走 | He opened it to free the bird, so the word must mean cage.
敬老/1 | 重阳节也是尊敬老人的节日 | The Double Ninth also honours the old, so the word must mean to respect the aged.
尊老爱幼/1 | 中国的传统美德 | It is a Chinese virtue of old and young, so the word must mean to respect the old and cherish the young.
同舟共济/1 | 遇到困难大家一起度过 | In hard times all must pull together, so the word must mean to pull together.
鞭子/1 | 马车上的人手里拿着 | The carter holds one, so the word must mean whip.
大吉大利/1 | 春节时希望新年事事顺利说的话 | It wishes every success for the new year, so the word must mean great luck.
剪彩/1 | 新医院开业那天市长来 | The mayor opened the new hospital, so the word must mean to cut the ribbon.
宪法/1 | 写明公民基本权利的法 | It sets out citizens' basic rights, so the word must mean constitution.
官员/1 | 政府里应该听市民意见的人 | Government officials should listen, so the word must mean official.
法官/1 | 听完双方意见做出判决 | This person gave the verdict, so the word must mean judge.
外交官/1 | 父亲在很多国家工作过 | His father served in many countries, so the word must mean diplomat.
政策/1 | 政府出的帮年轻人找工作的办法 | The government's new measure helps the young find work, so the word must mean policy.
对策/1 | 遇到问题要想出好的 | We need a good response to problems, so the word must mean countermeasure.
委员/1 | 被选进学生会的一员 | He was chosen as a member of the student union, so the word must mean committee member.
委员会/1 | 专门解决问题的一群人 | A special body will settle it, so the word must mean committee.
委托/1 | 请律师帮他处理事情 | He engaged a lawyer to handle it, so the word must mean to entrust.
签署/1 | 两国签了合作文件 | The two countries signed an agreement, so the word must mean to sign.
投票/1 | 明天选新班长 | Tomorrow everyone votes for a new monitor, so the word must mean to vote.
候选人/1 | 选举一共有三位 | There are three in the election, so the word must mean candidate.
当选/1 | 得到最多的票成了班长 | Winning most votes, she became monitor, so the word must mean to be elected.
任期/1 | 市长做四年 | The mayor serves four years, so the word must mean term of office.
连任/1 | 工作做得好，又做了一届 | He did well and served two terms, so the word must mean to be re-elected.
届/1 | 学校第一批毕业生 | He was in the school's first graduating class, so the word must mean measure word for graduating classes.
宣誓/1 | 新市长上任时要说誓言 | A new mayor takes an oath, so the word must mean to swear an oath.
召开/1 | 学校下星期一开全体老师大会 | The school will hold a staff meeting, so the word must mean to convene.
选举权/1 | 公民年满十八岁就有 | Citizens get it at eighteen, so the word must mean right to vote.
多数/1 | 会上大部分人同意 | Most at the meeting agreed, so the word must mean majority.
填写/1 | 用黑笔写上姓名和地址 | Fill in your name and address in black, so the word must mean to fill in.
填表/1 | 办护照要先写表格 | A passport needs a form filled in first, so the word must mean to fill in a form.
盖章/1 | 文件要印上印才有效 | The document needs a stamp to be valid, so the word must mean to stamp.
手续/1 | 办签证的过程很简单 | The visa process is simple, so the word must mean procedures.
窗口/1 | 请到三号交钱 | Pay at counter three, so the word must mean window, counter.
档案/1 | 学生的保存在学校办公室 | Pupils' files are kept in the office, so the word must mean file, record.
缴费/1 | 在网上交钱不用去银行 | You can pay fees online, so the word must mean to pay fees.
查询/1 | 在网上查考试成绩 | You can look up your results online, so the word must mean to look up.
咨询/1 | 有问题可以打电话问 | Call with any questions, so the word must mean to consult.
询问/1 | 警察向他问事情的经过 | The police asked him what happened, so the word must mean to inquire.
纳税/1 | 每个公民都有交税的义务 | Every citizen must pay taxes, so the word must mean to pay taxes.
纳税人/1 | 政府的钱来自他们 | Government money comes from them, so the word must mean taxpayer.
补贴/1 | 政府给买电动车的人发的钱 | The government pays buyers of electric cars, so the word must mean subsidy.
贴/1 | 寄信前先把邮票粘上 | Stick on a stamp before posting, so the word must mean to stick.
缴纳/1 | 每个月准时交水电费 | He pays the bills on time, so the word must mean to pay.
财政/1 | 政府的收入主要来自税收 | Government revenue comes from tax, so the word must mean public finance.
设施/1 | 社区新建了很多体育的 | The community built new sports facilities, so the word must mean facilities.
措施/1 | 政府采取了很多办法保护环境 | The government took many steps, so the word must mean measure.
实施/1 | 新规定从下个月开始执行 | The rule takes effect next month, so the word must mean to put into effect.
繁荣/1 | 城市经济很好 | The city's economy is booming, so the word must mean prosperous.
执行/1 | 认真做领导决定的事 | He carried out the decision, so the word must mean to carry out.
执法/1 | 警察对每个人都一样严格 | Police must enforce the law equally, so the word must mean to enforce the law.
依法/1 | 公民要按照法律纳税 | Citizens pay tax according to law, so the word must mean according to law.
依靠/1 | 不想靠父母，想自己赚钱 | He wants to earn his own money, so the word must mean to depend on.
惩罚/1 | 违反规定的人会受到 | Rule-breakers will be punished, so the word must mean punishment.
侵犯/1 | 不经同意用别人照片可能这样 | Using photos without consent may infringe rights, so the word must mean to infringe.
侵权/1 | 随便用别人作品的行为 | Using others' work freely is this, so the word must mean infringement.
拒绝/1 | 他不接受我的邀请 | He turned down my invitation, so the word must mean to refuse.
执照/1 | 开饭店需要营业的 | A restaurant needs a business licence, so the word must mean licence.
依然/1 | 十年了他还住在小城 | Ten years on he still lives there, so the word must mean still.
公交车/1 | 每天坐它上学 | I take it to school every day, so the word must mean bus.
地铁站/1 | 从家走五分钟就到 | It is five minutes' walk from home, so the word must mean metro station.
站台/1 | 等车时不要离黄线太近 | Wait here but keep back from the yellow line, so the word must mean platform.
票价/1 | 这条线两块钱 | The fare on this line is two yuan, so the word must mean fare.
繁忙/1 | 早上七八点交通最忙 | Traffic is busiest at seven or eight, so the word must mean busy.
首班车/1 | 早上五点半发车 | It leaves at half past five, so the word must mean first bus.
公交站/1 | 等了十分钟车才来 | I waited ten minutes at the stop, so the word must mean bus stop.
准点/1 | 地铁很少晚到 | The metro is rarely late, so the word must mean on time.
公交卡/1 | 上车刷一下就行 | Just tap it as you board, so the word must mean transit card.
让座/1 | 在地铁上把座位给老人 | He gave his seat to an old man, so the word must mean to give up one's seat.
郊区/1 | 住在城市外面，空气比市中心好 | They live outside the centre where the air is better, so the word must mean suburbs.
郊外/1 | 星期天去城外爬山 | On Sunday we hike outside the city, so the word must mean countryside around a city.
县城/1 | 他在一个小城长大 | He grew up in a small county town, so the word must mean county town.
县/1 | 有三十万人口 | It has three hundred thousand people, so the word must mean county.
小巷/1 | 老城区弯弯的窄路 | The old town has winding lanes, so the word must mean alley.
街道/1 | 这条路非常干净 | This street is very clean, so the word must mean street.
路灯/1 | 天黑了，路边的灯都亮了 | The street lights came on at dark, so the word must mean street lamp.
人行道/1 | 走路时要走的地方 | Walkers should keep to it, so the word must mean pavement.
公告栏/1 | 学校贴新通知的地方 | A new notice is up on it, so the word must mean notice board.
栏目/1 | 节目里介绍美食的一部分 | The show has a food segment, so the word must mean column, segment.
光荣/1 | 当消防员是很有面子的事 | He is proud to be a firefighter, so the word must mean honourable.
荣幸/1 | 能参加这次活动很高兴 | I am honoured to take part, so the word must mean honoured.
繁体字/1 | 很多老书是用它印的 | Many old books are printed in them, so the word must mean traditional characters.
号召/1 | 学校叫学生们节约用水 | The school called on pupils to save water, so the word must mean to call on.
志愿者/1 | 运动会上很多来帮忙的人 | Many helped at the sports day for free, so the word must mean volunteer.
誓言/1 | 他没有忘记自己说过的话 | He has not forgotten his vow, so the word must mean oath.
发誓/1 | 他说以后再也不迟到 | He swore never to be late again, so the word must mean to swear.
依次/1 | 大家一个接一个上车 | Board one by one, so the word must mean in order.
署名/1 | 文章没写名字，不知道是谁写的 | The article is unsigned, so the word must mean signature.
消防/1 | 学校每年都练习怎么救火 | The school holds a fire drill every year, so the word must mean fire fighting.
监督/1 | 市民可以看着政府的工作 | Citizens can oversee the government, so the word must mean to supervise.
官方/1 | 政府发布的消息可以相信 | Official news can be trusted, so the word must mean official.
官网/1 | 在学校网站上看考试时间 | The exam date is on the school's website, so the word must mean official website.
公章/1 | 证明上要有学校的印 | The certificate needs the school's seal, so the word must mean official seal.
规章/1 | 员工要遵守公司的制度 | Staff must obey company rules, so the word must mean regulations.
填空/1 | 考试有二十道这样的题 | The exam has twenty fill-in-the-blank items, so the word must mean to fill in the blanks.
市政府/1 | 决定在市中心建新公园 | It decided to build a park downtown, so the word must mean city government.
公共场所/1 | 在这些地方不能吸烟 | Smoking is banned in them, so the word must mean public place.
盖子/1 | 喝完水把瓶子上面盖好 | Put the cap back on the bottle, so the word must mean lid.
公共服务/1 | 图书馆、公园和医院都是 | Libraries, parks and hospitals are part of it, so the word must mean public services.
亚洲/1 | 中国、日本和印度都在 | China, Japan and India are in it, so the word must mean Asia.
欧洲/1 | 法国和意大利都在 | France and Italy are in it, so the word must mean Europe.
非洲/1 | 世界第二大洲，野生动物很多 | The place is the second largest continent and has a lot of wildlife, so the word must mean Africa.
北美洲/1 | 加拿大和美国都在 | Canada and the US are in it, so the word must mean North America.
南美洲/1 | 巴西是最大的国家 | Brazil is its largest country, so the word must mean South America.
大洋洲/1 | 澳大利亚和太平洋岛国都在 | Australia and the Pacific islands are in it, so the word must mean Oceania.
南极洲/1 | 世界上最冷的地方，到处是冰 | The place is the coldest on earth and covered in ice, so the word must mean Antarctica.
印度洋/1 | 在亚洲、非洲和大洋洲之间 | It lies between Asia, Africa and Oceania, so the word must mean Indian Ocean.
北冰洋/1 | 在地球最北边，被冰盖着 | It lies furthest north under ice, so the word must mean Arctic Ocean.
东南亚/1 | 越南和马来西亚都在 | Vietnam and Malaysia are in it, so the word must mean Southeast Asia.
德国/1 | 大部分人说德语 | Most people there speak German, so the word must mean Germany.
俄罗斯/1 | 国土最大的国家 | It is the largest country by area, so the word must mean Russia.
韩国/1 | 在朝鲜半岛的南部 | It is on the south of the Korean peninsula, so the word must mean South Korea.
澳大利亚/1 | 大洋洲最大的国家，十二月是夏天 | Oceania's largest country has summer in December, so the word must mean Australia.
巴西/1 | 南美洲最大的国家，孩子爱踢足球 | South America's largest country loves football, so the word must mean Brazil.
意大利/1 | 罗马是它的首都 | Rome is its capital, so the word must mean Italy.
西班牙/1 | 首都是马德里 | Its capital is Madrid, so the word must mean Spain.
加拿大/1 | 在美国北边，冬天很冷 | North of the US with cold winters, so the word must mean Canada.
墨西哥/1 | 在美国南边，说西班牙语 | The country lies south of the US and its people speak Spanish, so the word must mean Mexico.
印度/1 | 在中国西南边，人口最多的国家之一 | The country lies southwest of China and has one of the largest populations in the world, so the word must mean India.
法语/1 | 法国和加拿大一些地方说的 | It is spoken in France and parts of Canada, so the word must mean French.
德语/1 | 去德国读大学要学 | He studies it to attend a German university, so the word must mean German.
俄语/1 | 在俄罗斯大家都说 | Everyone in Russia speaks it, so the word must mean Russian.
韩语/1 | 喜欢韩国电视剧开始学 | She loves Korean dramas and is learning it, so the word must mean Korean.
日语/1 | 想去东京留学正在学 | She studies it to study in Tokyo, so the word must mean Japanese.
西班牙语/1 | 墨西哥人说的 | Mexicans speak it, so the word must mean Spanish.
意大利语/1 | 在罗马人们说 | People in Rome speak it, so the word must mean Italian.
方言/1 | 上海人在家说的上海话 | Shanghainese is one, so the word must mean dialect.
双语/1 | 用中文和英文上课的学校 | The school teaches in Chinese and English, so the word must mean bilingual.
官方语言/1 | 联合国有六种，中文是其中之一 | The UN has six, Chinese among them, so the word must mean official language.
移居/1 | 一家十年前搬到加拿大 | The family moved to Canada ten years ago, so the word must mean to migrate.
入境/1 | 飞机到上海先办的手续 | On landing in Shanghai he went through entry, so the word must mean entry.
出境/1 | 办好手续上了去法国的飞机 | He cleared exit and boarded for France, so the word must mean exit.
定居/1 | 毕业后在加拿大住下来 | He settled in Canada after graduating, so the word must mean to settle.
华人/1 | 街上常常能听到中文 | Chinese is heard in the streets, so the word must mean ethnic Chinese.
海外/1 | 在国外生活了二十年才回国 | He lived abroad for twenty years, so the word must mean overseas.
外籍/1 | 大学有很多外国的老师 | The university has many foreign teachers, so the word must mean foreign nationality.
异国/1 | 一个人在外国生活常常想家 | Living alone abroad, one misses home, so the word must mean foreign land.
时差/1 | 北京和东京差一个小时 | There is an hour between Beijing and Tokyo, so the word must mean time difference.
当地人/1 | 在国外向住在那里的人问路 | Ask the locals the way, so the word must mean local.
差异/1 | 两国的饮食习惯很不一样 | The two diets differ greatly, so the word must mean difference.
刻板印象/1 | 认为一个国家的人都一样 | Thinking all of a nation are alike is one, so the word must mean stereotype.
好奇心/1 | 孩子什么都想问 | Children want to ask about everything, so the word must mean curiosity.
包容/1 | 社会能接受不同的文化 | A tolerant society accepts other cultures, so the word must mean tolerant.
多元/1 | 有来自世界各地的人 | People come from all over the world, so the word must mean diverse.
入乡随俗/1 | 到别的国家尊重当地习惯 | Respect local customs abroad, so the word must mean when in Rome do as the Romans do.
冲突/1 | 两种文化之间有时会发生 | Two cultures sometimes clash, so the word must mean conflict.
融入/1 | 来中国两年，已经习惯了这里的生活 | After two years he fits into life here, so the word must mean to integrate into.
见识/1 | 出国旅行可以增长 | Travel broadens it, so the word must mean knowledge, experience.
跨文化/1 | 在外国公司需要的交流能力 | Foreign firms need this kind of communication, so the word must mean cross-cultural.
外交/1 | 两国用这种办法解决问题 | The two countries settled it by diplomacy, so the word must mean diplomacy.
大使/1 | 在法国当了五年的中国的 | He was China's envoy in France for five years, so the word must mean ambassador.
大使馆/1 | 留学要先去那个国家的办签证 | Get a visa from that country's embassy, so the word must mean embassy.
领事馆/1 | 美国在上海有一个，大使馆在北京 | America has one in Shanghai and its embassy in Beijing, so the word must mean consulate.
建交/1 | 中法一九六四年开始外交关系 | China and France established ties in 1964, so the word must mean to establish diplomatic relations.
友谊/1 | 两国人民之间很深的 | The two peoples share a deep one, so the word must mean friendship.
双边/1 | 两国领导人讨论两国之间的关系 | The leaders discussed relations between the two countries, so the word must mean bilateral.
邻国/1 | 中国有十四个陆上的 | China has fourteen of them by land, so the word must mean neighbouring country.
往来/1 | 两个城市之间来来去去越来越多 | Contact between the cities grows, so the word must mean contact, traffic.
出访/1 | 领导人下个月去欧洲三国 | The leader will visit three European countries, so the word must mean to make an official visit abroad.
联合国/1 | 一九四五年成立的国际组织 | It was founded in 1945, so the word must mean the United Nations.
组织/1 | 学校安排学生去参观 | The school arranged a museum visit, so the word must mean to organise.
成员国/1 | 联合国现在有一百九十三个 | The UN has 193 of them, so the word must mean member state.
总部/1 | 公司最主要的办公地点在北京 | The firm's head office is in Beijing, so the word must mean headquarters.
秘书长/1 | 联合国每五年选一次的领导 | The UN chooses this leader every five years, so the word must mean secretary-general.
机构/1 | 医院和学校都是为大家服务的 | Hospitals and schools serve the public, so the word must mean institution.
红十字会/1 | 在灾难的地方帮助受伤的人 | It helps the injured in disasters, so the word must mean the Red Cross.
欧盟/1 | 很多欧洲国家组成的组织 | Many European countries form it, so the word must mean the European Union.
联盟/1 | 几家航空公司组成的，乘客可以换着坐 | Several airlines formed one, so the word must mean alliance.
义工/1 | 在医院帮病人，不要钱 | He helps patients for nothing, so the word must mean volunteer.
协议/1 | 两家公司签的合作文件 | The two firms signed a cooperation agreement, so the word must mean agreement.
协商/1 | 双方正在商量解决 | The two sides are negotiating a solution, so the word must mean to consult, to negotiate.
条约/1 | 两国签订的和平文件 | The two countries signed a peace treaty, so the word must mean treaty.
一致/1 | 大家的意见都一样 | Everyone agrees with the plan, so the word must mean unanimous.
共识/1 | 讨论后大家看法接近形成的 | Discussion brought everyone to agreement, so the word must mean consensus.
共赢/1 | 合作不是一方赚一方亏 | Cooperation should benefit both sides, so the word must mean win-win.
互利/1 | 两国贸易对双方都有好处 | The trade benefits both countries, so the word must mean mutually beneficial.
联手/1 | 几国科学家一起研究这种病 | Scientists from several countries joined forces, so the word must mean to join hands.
互访/1 | 两校学生每年到对方学校学习 | The schools exchange visits each year, so the word must mean to exchange visits.
伙伴关系/1 | 两国一起发展经济的友好关系 | The countries formed a friendly partnership, so the word must mean partnership.
全球化/1 | 今天各国经济联系越来越紧 | Economies are ever more linked today, so the word must mean globalisation.
国际化/1 | 大学有很多外国学生和老师 | The university has many foreigners, so the word must mean internationalised.
地球村/1 | 有了网络，世界变得很小 | The internet made the world a village, so the word must mean global village.
跨国/1 | 公司在二十个国家有办公室 | The company has offices in twenty countries, so the word must mean multinational.
进出口/1 | 公司常常跟外国做买卖 | The firm trades with foreign countries, so the word must mean import and export.
一体化/1 | 让欧洲国家经济联系更紧 | It drew European economies together, so the word must mean integration.
本土/1 | 咖啡店是中国自己的品牌 | The café is a home-grown Chinese brand, so the word must mean local, native.
多样化/1 | 人们的生活方式越来越不同 | Ways of life are ever more varied, so the word must mean diversified.
影响力/1 | 歌手在年轻人中很有 | The singer has influence among the young, so the word must mean influence.
世界各地/1 | 来自很多国家的学生 | Students come from all over the world, so the word must mean all over the world.
企业家/1 | 开了三家大公司的有名的人 | He founded three big firms, so the word must mean entrepreneur.
集团/1 | 下面有二十多家公司 | It owns over twenty companies, so the word must mean group, conglomerate.
私营/1 | 老板一个人出钱开的饭店 | The restaurant is owned by the boss alone, so the word must mean privately owned.
国有/1 | 公司属于国家 | The company belongs to the state, so the word must mean state-owned.
民营/1 | 不是国家办的，是人们自己出钱办的 | It is run by private people, not the state, so the word must mean privately run.
创办/1 | 大学一百年前建起来 | The university was founded a century ago, so the word must mean to found.
中小企业/1 | 很多只有几十个员工 | Many have only a few dozen staff, so the word must mean small and medium-sized enterprises.
分公司/1 | 公司在上海和广州都有 | The company has branches in Shanghai and Guangzhou, so the word must mean branch company.
上市/1 | 公司的股票去年开始在股市卖 | Its shares went on the market last year, so the word must mean to go public.
外企/1 | 在这种公司工作要常说英语 | He speaks English at work, so the word must mean foreign company.
董事长/1 | 董事会开会时主持的人 | This person chairs the board, so the word must mean chairman.
董事会/1 | 计划要先由它同意 | The plan needs its approval first, so the word must mean board of directors.
总经理/1 | 全公司的日常工作由他管 | He runs the firm's daily work, so the word must mean general manager.
管理层/1 | 员工向管理公司的人提意见 | Staff put their views to management, so the word must mean management.
基层/1 | 从最下面做起，一步一步当上经理 | He started at the bottom and rose to manager, so the word must mean grass roots.
下属/1 | 他对手下的人很好 | He is good to his staff, so the word must mean subordinate.
领导力/1 | 当经理需要很强的 | Managers need strong leadership, so the word must mean leadership.
授权/1 | 经理让他代表公司签合同 | The manager authorised him to sign, so the word must mean to authorise.
分工/1 | 三个人一个写一个画一个做 | Three people each take a part, so the word must mean division of labour.
沟通/1 | 有问题大家多说，不要放在心里 | Talk problems through, so the word must mean to communicate.
战略/1 | 公司未来十年的发展计划 | The company set its ten-year plan, so the word must mean strategy.
决策/1 | 这个重要的决定是总经理做的 | The general manager made this key decision, so the word must mean decision.
制度/1 | 公司有严格的请假规定 | The firm has strict leave rules, so the word must mean system, rules.
落实/1 | 计划定好了，要认真去做 | The plan is set and must be carried out, so the word must mean to implement.
督促/1 | 经理常常催大家准时完成 | The manager urges everyone to finish on time, so the word must mean to urge.
协调/1 | 两个部门有矛盾，经理在调解 | The manager is smoothing out the clash, so the word must mean to coordinate.
手段/1 | 为了让更多人买用的办法 | The company used many methods to sell more, so the word must mean means.
方案/1 | 提出三个，最后选了第二个 | Of three plans, the second was chosen, so the word must mean plan, proposal.
调整/1 | 天气变了，改一下旅行计划 | The weather changed so we adjust the plan, so the word must mean to adjust.
配合/1 | 工作需要大家互相合作 | The job needs everyone to work together, so the word must mean to cooperate.
人力资源/1 | 在这个部负责招聘新员工 | He hires new staff in this department, so the word must mean human resources.
离职/1 | 上个月不干了，现在找新工作 | He left last month and is job-hunting, so the word must mean to leave a job.
跳槽/1 | 工资太低，去了另一家公司 | Pay was low so he moved to another firm, so the word must mean to change jobs.
薪资/1 | 公司给得多，假期也多 | The firm pays well with long holidays, so the word must mean pay.
业绩/1 | 他今年卖出了很多产品 | He sold a lot this year, so the word must mean performance, results.
考核/1 | 公司十二月检查员工的工作 | The firm appraises staff each December, so the word must mean to assess.
晋升/1 | 工作努力，很快当上了经理 | Hard work soon made him manager, so the word must mean to be promoted.
提成/1 | 每卖一辆车能拿到的钱 | He gets a cut for each car he sells, so the word must mean commission.
解雇/1 | 常常迟到，被公司辞了 | He was often late and got fired, so the word must mean to fire.
裁员/1 | 生意不好，只好减三百人 | Bad business forced three hundred job cuts, so the word must mean to lay off staff.
议程/1 | 会议有三项：总结、计划和其他 | The meeting has three items, so the word must mean agenda.
报告/1 | 关于市场写好交给经理的 | He wrote one on the market for the manager, so the word must mean report.
提议/1 | 我说明天下午再开一次会 | I propose another meeting tomorrow, so the word must mean to propose.
日程/1 | 经理这个星期安排很满 | The manager's week is fully booked, so the word must mean schedule.
主持/1 | 今天的会由王经理来管 | Manager Wang chairs today's meeting, so the word must mean to chair.
弃权/1 | 不同意也不反对 | He neither agreed nor objected, so the word must mean to abstain.
表决/1 | 大家举手决定方案 | Everyone votes by show of hands, so the word must mean to vote.
议题/1 | 会议主要讨论怎么提高质量 | The meeting's main subject is quality, so the word must mean topic for discussion.
出席/1 | 一百多位代表来参加大会 | Over a hundred delegates attended, so the word must mean to attend.
发布会/1 | 公司开的，很多记者都来了 | Many reporters came to the product launch, so the word must mean press conference.
营销/1 | 想办法让更多人买产品 | He works on getting more people to buy, so the word must mean marketing.
推广/1 | 学校在推行新的学习方法 | The school is spreading a new method, so the word must mean to promote, to spread.
促销/1 | 商店很多东西打五折 | The shop has half-price deals, so the word must mean sales promotion.
包装/1 | 礼物外面很漂亮 | The gift's wrapping is beautiful, so the word must mean packaging.
消费者/1 | 质量有问题可以要求退货 | Buyers can return faulty goods, so the word must mean consumer.
售后/1 | 东西坏了可以免费修 | Repairs are free after purchase, so the word must mean after-sales.
市场调查/1 | 推出新产品前公司做的 | The firm did it before the launch, so the word must mean market research.
问卷/1 | 请大家填写，告诉我们意见 | Please fill it in and tell us your views, so the word must mean questionnaire.
口碑/1 | 吃过的人都说菜好吃 | Everyone who ate there praises it, so the word must mean reputation by word of mouth.
信誉/1 | 答应客人的事一定做到 | Keep your promises to customers, so the word must mean credibility.
生产线/1 | 每天能生产一千台电脑 | It turns out a thousand computers a day, so the word must mean production line.
原料/1 | 做面包主要用面粉 | Flour is the main one for bread, so the word must mean raw material.
加工/1 | 水果处理以后做成饮料 | The fruit is processed into drinks, so the word must mean to process.
成品/1 | 工厂送到商店去卖的 | The factory sends finished goods to shops, so the word must mean finished product.
流程/1 | 新员工先了解工作的步骤 | New staff first learn the workflow, so the word must mean process.
合格/1 | 产品质量不够标准不能卖 | Substandard goods cannot be sold, so the word must mean up to standard.
品质/1 | 茶叶很好，价格不贵 | The tea is fine and not dear, so the word must mean quality.
研制/1 | 公司正在开发一种新药 | The company is developing a new drug, so the word must mean to develop.
正品/1 | 店里没有假货 | The shop sells no fakes, so the word must mean genuine product.
商标/1 | 鞋上没有，可能是假的 | The shoes have no brand mark and may be fake, so the word must mean trademark.
谈判/1 | 两家公司谈了三天签了合同 | After three days of talks they signed, so the word must mean to negotiate.
报价/1 | 想买一百台电脑，请给价格 | We want a hundred computers, please quote, so the word must mean to quote a price.
交货/1 | 工厂下个月十号以前送货 | The factory will deliver by the tenth, so the word must mean to deliver goods.
违约/1 | 不能准时交货要赔钱 | Late delivery means a penalty, so the word must mean to breach a contract.
期限/1 | 工作要一个星期做完 | The job has a one-week deadline, so the word must mean time limit.
让步/1 | 双方都退了一点达成协议 | Both sides gave ground to agree, so the word must mean concession.
诚信/1 | 做生意最重要的是 | Honesty matters most in business, so the word must mean good faith.
项目/1 | 要用两年时间才能完成 | It will take two years to complete, so the word must mean project.
截止/1 | 报名到星期五结束 | Sign-up closes on Friday, so the word must mean to close, deadline.
订货/1 | 商店向工厂要了五百件 | The shop ordered five hundred items, so the word must mean to order goods.
盈利/1 | 开了三年今年开始赚钱 | After three years it is making money, so the word must mean to make a profit.
倒闭/1 | 书店生意不好关门了 | The bookshop closed for lack of trade, so the word must mean to go out of business.
扩大/1 | 公司要再建一个工厂 | The company will build another factory, so the word must mean to expand.
竞争对手/1 | 两家手机公司是多年的 | The two phone makers are old rivals, so the word must mean competitor.
份额/1 | 手机在中国市场的越来越大 | Its share of the market grows, so the word must mean share.
强项/1 | 数学他每次都考得好 | He always does well in maths, so the word must mean strong point.
弱点/1 | 小公司资金少 | Small firms lack money, so the word must mean weakness.
机遇/1 | 难得的，一定要抓住 | It is a rare chance, so seize it, so the word must mean opportunity.
挑战/1 | 第一次管部门对他来说很难 | Running a department is a big test for him, so the word must mean challenge.
效益/1 | 公司经济越来越好，工资提高了 | Better returns raised pay, so the word must mean returns, benefit.
心理/1 | 比赛前运动员的压力很大 | Athletes feel great mental pressure, so the word must mean psychological.
心理学/1 | 大学学的，对人的想法感兴趣 | He studied the mind at university, so the word must mean psychology.
心理学家/1 | 研究了很多年人的记忆 | She studied memory for years, so the word must mean psychologist.
心理医生/1 | 心情一直不好，朋友建议去看 | His friends suggest he see a therapist, so the word must mean psychiatrist, therapist.
咨询师/1 | 学生有烦恼可以去找她 | Pupils with worries can see her, so the word must mean counsellor.
心理健康/1 | 和身体健康一样重要 | It matters as much as physical health, so the word must mean mental health.
心态/1 | 考试时不要太紧张 | Keep a calm mind in exams, so the word must mean state of mind.
心灵/1 | 音乐让人感到很平静 | The music calms the soul, so the word must mean soul.
情绪/1 | 他今天心情不好，说话小心 | He is in a bad mood today, so the word must mean mood.
情绪化/1 | 一会儿高兴一会儿生气 | He is happy one moment and angry the next, so the word must mean moody.
焦虑/1 | 快考试了睡不好 | The coming exam keeps him awake, so the word must mean anxious.
放松/1 | 累了听听音乐 | Music helps you unwind, so the word must mean to relax.
减压/1 | 运动是很好的方法 | Exercise relieves stress, so the word must mean to relieve stress.
疲劳/1 | 开车时间太长人会累 | Long drives tire you, so the word must mean fatigue.
精疲力尽/1 | 爬了一天山大家都累坏了 | After a day's climb everyone was exhausted, so the word must mean exhausted.
失眠/1 | 压力大常常睡不着 | Stress often keeps him awake, so the word must mean insomnia.
烦恼/1 | 每个人都有不开心的事 | Everyone has worries, so the word must mean worry.
担忧/1 | 妈妈对孩子的健康很担心 | Mum is worried about the child's health, so the word must mean to worry.
不安/1 | 做了错事心里一直不平静 | He did wrong and feels uneasy, so the word must mean uneasy.
心理压力/1 | 工作太多越来越大 | Too much work weighs on his mind, so the word must mean mental stress.
内向/1 | 在人多的地方不太说话 | He keeps quiet in a crowd, so the word must mean introverted.
外向/1 | 很快和新同学成了朋友 | She quickly made friends, so the word must mean extroverted.
开朗/1 | 总是笑着面对困难 | He meets troubles with a smile, so the word must mean cheerful.
随和/1 | 吃什么去哪里都可以 | He is happy with anything, so the word must mean easy-going.
温和/1 | 说话从来不大声 | She never raises her voice, so the word must mean gentle.
固执/1 | 爷爷谁的话也不听 | Grandpa listens to no one, so the word must mean stubborn.
好强/1 | 什么事都要做第一 | She must come first in everything, so the word must mean eager to excel.
冲动/1 | 生气时先冷静一下 | Calm down before acting in anger, so the word must mean impulsive.
胆小/1 | 晚上不敢一个人出门 | He dares not go out alone at night, so the word must mean timid.
性情/1 | 两个人长得像，但脾气不一样 | They look alike but differ in temperament, so the word must mean temperament.
自卑/1 | 总觉得自己什么都做不好 | He thinks he is good at nothing, so the word must mean low self-esteem.
自尊心/1 | 别当着大家批评他 | Do not criticise him in public, so the word must mean self-esteem.
自我/1 | 认识自己不容易 | Knowing oneself is hard, so the word must mean self.
安全感/1 | 孩子在父母身边才有 | Children feel it only near their parents, so the word must mean sense of security.
成就感/1 | 自己做完了难题 | He solved the hard problem himself, so the word must mean sense of achievement.
孤独感/1 | 一个人在国外常常有 | Living alone abroad he often feels it, so the word must mean loneliness.
自律/1 | 每天六点起床跑步 | He rises at six to run, so the word must mean self-disciplined.
虚荣/1 | 总喜欢买贵东西给别人看 | She buys dear things to show off, so the word must mean vain.
宽容/1 | 对别人的小错不要太计较 | Be forgiving of small mistakes, so the word must mean tolerant.
依赖/1 | 长大了不能总是靠父母 | Grown children should not lean on parents, so the word must mean to depend on.
思考/1 | 遇到问题先想再做 | Think before acting, so the word must mean to think.
思维/1 | 学数学锻炼孩子的这种能力 | Maths trains the way children think, so the word must mean thinking.
推理/1 | 小说里的警察找到了小偷 | The detective worked it out and found the thief, so the word must mean to reason, deduction.
想象力/1 | 孩子们画的画很有意思 | Children's pictures show it, so the word must mean imagination.
直觉/1 | 我感觉他说的不是真话 | My gut tells me he is lying, so the word must mean intuition.
理性/1 | 遇到问题不要只凭感觉 | Do not go only on feeling, so the word must mean rational.
感性/1 | 看电影常常会哭 | She often cries at films, so the word must mean emotional.
客观/1 | 写新闻不能加上自己的感情 | News must leave out personal feelings, so the word must mean objective.
创造力/1 | 用旧纸做了一个机器人 | He made a robot from old paper, so the word must mean creativity.
观察力/1 | 画家能看到别人看不到的东西 | Painters see what others miss, so the word must mean power of observation.
遗忘/1 | 这段历史不应该被忘记 | This history should not be forgotten, so the word must mean to forget.
健忘/1 | 奶奶年纪大，常常找不到眼镜 | Grandma often loses her glasses, so the word must mean forgetful.
记性/1 | 昨天学的词今天就忘了 | I forget yesterday's words today, so the word must mean memory.
记忆犹新/1 | 旅行过去很多年还记得很清楚 | Years on I still remember the trip clearly, so the word must mean fresh in one's memory.
失忆/1 | 伤了头，连名字都想不起来 | Hurt in the head, he cannot recall his name, so the word must mean to lose one's memory.
回想/1 | 想起小时候的事笑了 | He smiled thinking back on childhood, so the word must mean to recall.
脑海/1 | 情景一直留在我的心里 | The scene stays in my mind, so the word must mean mind.
想起/1 | 看到照片记起了老朋友 | The photo reminded me of an old friend, so the word must mean to remember.
难忘/1 | 那次旅行忘不了 | It was an unforgettable trip, so the word must mean unforgettable.
往事/1 | 爷爷讲年轻时候的事 | Grandpa tells of his youth, so the word must mean past events.
注意力/1 | 上课时要集中 | Concentrate in class, so the word must mean attention.
集中/1 | 外面太吵，没办法专心 | It is so noisy outside the classroom that the speaker cannot focus, so the word must mean to concentrate.
分心/1 | 做作业时看手机 | A phone distracts you from homework, so the word must mean to be distracted.
走神/1 | 上课没听到老师的问题 | His mind wandered in class, so the word must mean to be absent-minded.
入迷/1 | 小说好看得饭都忘了吃 | He was so absorbed he forgot to eat, so the word must mean to be absorbed.
犹豫/1 | 想了很久最后才决定去 | He hesitated long before deciding, so the word must mean to hesitate.
怀疑/1 | 我觉得他说的可能不是真话 | I suspect he is lying, so the word must mean to suspect.
顾虑/1 | 有什么担心的就说出来 | Say what worries you, so the word must mean misgiving.
多虑/1 | 他不是在说你，你想多了 | You are worrying too much, so the word must mean to worry unnecessarily.
联想/1 | 看到大海想到小时候的家 | The sea calls up my childhood home, so the word must mean to associate.
意志/1 | 很坚强，从来不怕困难 | His will is strong and fears nothing, so the word must mean will.
毅力/1 | 每天早上跑步要有 | Running every morning takes perseverance, so the word must mean perseverance.
动力/1 | 对音乐的爱让他每天练琴 | His love of music drives his practice, so the word must mean motivation.
动机/1 | 警察想知道他为什么这么做 | The police want to know his motive, so the word must mean motive.
潜力/1 | 孩子以后可能成为好运动员 | The child may become a fine athlete, so the word must mean potential.
才华/1 | 三岁就会弹琴 | He played at three, so the word must mean talent.
积极/1 | 上课常常回答问题 | He often answers questions in class, so the word must mean active.
消极/1 | 不要有坏的想法，要相信自己 | Do not think negatively, so the word must mean negative.
被动/1 | 学习要自己找问题 | Learning should not wait to be led, so the word must mean passive.
自信心/1 | 比赛赢了以后更强了 | Winning made him more sure of himself, so the word must mean self-confidence.
梦想/1 | 他想以后当一名医生 | He wants to become a doctor, so the word must mean dream, aspiration.
做梦/1 | 睡觉时在梦里自己会飞 | In his sleep he could fly, so the word must mean to dream.
梦见/1 | 晚上在梦里看到小时候的朋友 | I saw my childhood friend in a dream, so the word must mean to see in a dream.
美梦/1 | 晚安，祝你睡个好觉 | Good night and sweet dreams, so the word must mean sweet dream.
白日梦/1 | 不努力就想考第一名 | Hoping to top the class without work is this, so the word must mean daydream.
梦话/1 | 睡觉的时候说的话 | He often talks in his sleep, so the word must mean sleep talk.
入睡/1 | 压力太大，晚上很难睡着 | Stress keeps him from falling asleep, so the word must mean to fall asleep.
惊醒/1 | 半夜的雷声把我吓醒 | Thunder woke me with a start, so the word must mean to wake with a start.
潜意识/1 | 心理学家认为梦跟它有关 | Psychologists link dreams to it, so the word must mean subconscious.
意识/1 | 他这才发现自己说错了 | Only then did he realise his mistake, so the word must mean to realise.
文学/1 | 从小喜欢，读了很多小说和诗歌 | He has loved it since childhood, so the word must mean literature.
文学家/1 | 鲁迅是中国有名的 | Lu Xun is a famous one, so the word must mean man of letters.
文学作品/1 | 很多中国的被翻译成别的语言 | Many Chinese ones are translated, so the word must mean literary work.
散文/1 | 写作者小时候的家的文章 | This piece is about the author's childhood home, so the word must mean prose essay.
小说家/1 | 一生写了二十多部小说 | He wrote over twenty novels, so the word must mean novelist.
著作/1 | 历史学家写了很多书 | The historian has many works, so the word must mean written work.
长篇小说/1 | 红楼梦有一百二十回 | Dream of the Red Chamber has 120 chapters, so the word must mean novel.
科幻小说/1 | 书里常常写到机器人和外星人 | Robots and aliens fill these books, so the word must mean science fiction.
历史小说/1 | 书里写的都是古代的事 | The books are set in the past, so the word must mean historical novel.
诺贝尔文学奖/1 | 二〇一二年一位中国作家得到 | A Chinese writer won it in 2012, so the word must mean Nobel Prize in Literature.
情节/1 | 小说的故事很复杂，看两遍才懂 | The plot is so complex I read it twice, so the word must mean plot.
人物/1 | 小说里有老人也有孩子 | The novel has old and young people in it, so the word must mean character.
主人公/1 | 故事最主要的人是十岁的男孩 | The story's hero is a ten-year-old boy, so the word must mean protagonist.
结局/1 | 两个人最后结婚了 | The two marry at the end, so the word must mean ending.
开头/1 | 好文章最先的部分吸引读者 | A good essay grabs readers at once, so the word must mean beginning.
高潮/1 | 电影最紧张的时候大家都不说话 | At the film's climax everyone fell silent, so the word must mean climax.
题材/1 | 作家最喜欢写历史方面的 | The writer favours historical subjects, so the word must mean subject matter.
线索/1 | 警察找到了重要的 | The police found an important clue, so the word must mean clue.
人物形象/1 | 小说里写的人很生动 | The characters are so vivid readers see them, so the word must mean characterisation.
章节/1 | 书分成十个，每个讲一个故事 | The book has ten chapters, so the word must mean chapter.
写作/1 | 多读书能提高 | Reading improves it, so the word must mean writing.
文笔/1 | 她写的文章读起来很美 | Her prose is lovely, so the word must mean writing style.
用词/1 | 作文的字词要准确 | Words in an essay must be exact, so the word must mean choice of words.
修辞/1 | 比喻是常用的一种 | Metaphor is a common one, so the word must mean rhetoric.
比喻/1 | 说“时间就是金钱” | Time is money is one, so the word must mean metaphor.
叙述/1 | 把事情的经过说一遍 | Tell what happened, so the word must mean to narrate.
拟人/1 | 说“小鸟在唱歌” | Saying birds sing is this device, so the word must mean personification.
虚构/1 | 小说里的故事大多是编出来的 | Most stories in novels are made up, so the word must mean fictional.
写景/1 | 散文写了家乡的山和水 | The essay describes hills and rivers, so the word must mean to describe scenery.
叙事/1 | 诗讲了一个完整的故事 | The poem tells a full story, so the word must mean narrative.
出版社/1 | 北京的一家出的书 | A Beijing firm published it, so the word must mean publisher.
出书/1 | 写了很多年终于有了自己的书 | After years of writing his book came out, so the word must mean to publish a book.
投稿/1 | 常常把文章寄给报纸 | He often sends articles to papers, so the word must mean to submit a manuscript.
发表/1 | 第一篇小说登在杂志上 | His first story appeared in a magazine, so the word must mean to publish.
再版/1 | 书受欢迎，又印了五次 | The popular book was reprinted five times, so the word must mean to reprint.
笔名/1 | 鲁迅是周树人写作用的名字 | Lu Xun was Zhou Shuren's pen name, so the word must mean pen name.
原著/1 | 电影根据的那部小说更好看 | The novel the film was based on is better, so the word must mean original work.
改编/1 | 电视剧是由小说改成的 | The TV series was adapted from a novel, so the word must mean to adapt.
封面/1 | 书的外面画着一座山 | The book's cover shows a mountain, so the word must mean cover.
续集/1 | 电影受欢迎，明年还要拍 | The hit film will get a sequel, so the word must mean sequel.
诗句/1 | 诗的每一句五个字 | Each line has five characters, so the word must mean line of verse.
诗集/1 | 里面有一百首诗 | It holds a hundred poems, so the word must mean collection of poems.
唐诗/1 | 李白和杜甫写的 | Li Bai and Du Fu wrote them, so the word must mean Tang poetry.
宋词/1 | 宋朝最有名的文学形式 | It is the Song dynasty's famous form, so the word must mean Song ci poetry.
朗读/1 | 老师请我在班上大声读诗 | The teacher asked me to read the poem aloud, so the word must mean to read aloud.
诗意/1 | 下雪的西湖像诗一样美 | West Lake in snow is poetic, so the word must mean poetic quality.
诗词/1 | 爷爷会背很多首古代的 | Grandpa can recite many old poems, so the word must mean poetry.
李白/1 | 比杜甫大十一岁的好朋友 | He was eleven years older than Du Fu, so the word must mean Li Bai.
杜甫/1 | 写战争年代百姓苦日子的诗人 | He wrote of common people's hardship in war, so the word must mean Du Fu.
现代诗/1 | 不像古诗每句字数一样 | Unlike classical verse its lines vary, so the word must mean modern poetry.
台词/1 | 演员都背下来了 | The actor learned all his lines, so the word must mean lines.
对白/1 | 电影里人物说的话让大家笑 | The film's dialogue made everyone laugh, so the word must mean dialogue.
喜剧/1 | 看的时候大家一直在笑 | Everyone laughed throughout, so the word must mean comedy.
剧作家/1 | 莎士比亚是英国有名的 | Shakespeare is a famous English one, so the word must mean playwright.
莎士比亚/1 | 四百多年前写了很多戏剧的英国人 | He wrote many plays four centuries ago, so the word must mean Shakespeare.
独白/1 | 演员一个人在台上说一大段 | One actor speaks alone on stage, so the word must mean monologue.
编剧/1 | 电视剧的作者以前是小说家 | The series' screenwriter was a novelist, so the word must mean screenwriter.
演技/1 | 演什么像什么 | He convinces in every role, so the word must mean acting skill.
舞台剧/1 | 故事拍成电影后又在剧院里演 | The story became a stage play, so the word must mean stage play.
相声/1 | 两个人在台上说，观众笑不停 | Two performers set the audience laughing, so the word must mean crosstalk.
童话/1 | 动物会说话，还有漂亮的公主 | Animals talk and there is a princess, so the word must mean fairy tale.
寓言/1 | 用小故事讲一个道理 | A short tale that teaches a lesson, so the word must mean fable.
寓意/1 | 故事告诉我们做事要坚持 | The story's message is perseverance, so the word must mean moral.
童年/1 | 他小时候是在农村过的 | He spent his childhood in the country, so the word must mean childhood.
幽默/1 | 说话让大家喜欢听 | His talk makes people laugh, so the word must mean humorous.
民间故事/1 | 在老百姓中间传了几百年，没有作者 | It has passed among the people for centuries, so the word must mean folk tale.
儿童文学/1 | 她写的书很受孩子们欢迎 | Her books are loved by children, so the word must mean children's literature.
故事书/1 | 弟弟每天睡觉前都要看 | My brother reads them every night, so the word must mean storybook.
绘本/1 | 字很少，每页都是画 | The book has very few words and a picture on every page, so the word must mean picture book.
插图/1 | 小说里有很多漂亮的画 | The novel has many fine illustrations, so the word must mean illustration.
红楼梦/1 | 作者是曹雪芹 | Cao Xueqin wrote it, so the word must mean Dream of the Red Chamber.
西游记/1 | 唐朝的人去印度取经的故事 | It tells of a monk fetching scriptures from India, so the word must mean Journey to the West.
三国演义/1 | 一千八百年前三个国家的故事 | It tells of three kingdoms long ago, so the word must mean Romance of the Three Kingdoms.
曹雪芹/1 | 红楼梦的作者 | He wrote Dream of the Red Chamber, so the word must mean Cao Xueqin.
鲁迅/1 | 中国现代文学最重要的作家之一 | He is a giant of modern Chinese literature, so the word must mean Lu Xun.
孔子/1 | 两千五百多年前的大教育家 | He was the great teacher of 2,500 years ago, so the word must mean Confucius.
论语/1 | 记下了孔子和学生说过的话 | It records the sayings of Confucius, so the word must mean the Analects.
四大名著/1 | 西游记是其中之一 | Journey to the West is one of them, so the word must mean Four Great Classical Novels.
名句/1 | 诗里很多人会背的句子 | The poem holds lines many can recite, so the word must mean famous line.
文言文/1 | 很多古书用它写，现在读起来难 | Old books written in it are hard now, so the word must mean classical Chinese.
读后感/1 | 看完书老师让写的文章 | The teacher wants a response to the book, so the word must mean reflections on reading.
书评/1 | 报纸上说这本小说写得好的文章 | A newspaper piece praises the novel, so the word must mean book review.
引用/1 | 文章里用了孔子的一句话 | He quoted Confucius, so the word must mean to quote.
读书笔记/1 | 读书时喜欢写下来 | He likes to take notes as he reads, so the word must mean reading notes.
自传/1 | 老人写自己的一生 | The old man wrote of his own life, so the word must mean autobiography.
传记/1 | 读了一本讲孔子一生的书 | I read a life of Confucius, so the word must mean biography.
游记/1 | 把旅行写成的文章 | He wrote up his trip, so the word must mean travel notes.
杂文/1 | 鲁迅写的批评社会问题的短文 | Lu Xun's short pieces criticise society, so the word must mean essay.
体会/1 | 读了书有什么感受 | What did you get from the book, so the word must mean understanding, reflection.
作品集/1 | 里面有他一生的短篇小说 | It gathers all his short stories, so the word must mean collected works.
烹饪/1 | 学校学的，现在是厨师 | He studied it and is now a chef, so the word must mean cooking.
做菜/1 | 妈妈做的鱼最好吃 | Mum cooks fish best, so the word must mean to cook.
下厨/1 | 妈妈生日爸爸亲自做饭 | Dad cooked himself on Mum's birthday, so the word must mean to cook, go into the kitchen.
厨艺/1 | 做的菜跟饭馆的一样好 | His cooking is as good as a restaurant's, so the word must mean cooking skill.
配方/1 | 饼干的做法是奶奶传下来的 | The biscuit recipe came from Grandma, so the word must mean recipe.
火候/1 | 火太大菜就不好吃了 | Too strong a flame spoils the dish, so the word must mean heat control.
刀工/1 | 土豆丝切得又细又长 | The potato strips are fine and long, so the word must mean knife skills.
调味/1 | 做汤最后加盐 | Salt is added last to season the soup, so the word must mean to season.
食材/1 | 饭馆每天早上从市场买来的 | The restaurant buys them fresh each morning, so the word must mean ingredients.
家常菜/1 | 土豆丝很普通，很多人都会做 | Potato strips are everyday food, so the word must mean home-style dish.
炒/1 | 用大火不停地翻 | Cook on high heat, stirring all the time, so the word must mean to stir-fry.
煮/1 | 鸡蛋放在水里十分钟 | Put the eggs in water for ten minutes, so the word must mean to boil.
蒸/1 | 包子放锅里，不直接放水里 | Buns go above the water in the pot, so the word must mean to steam.
炸/1 | 鸡肉放进很多热油里 | The chicken goes into hot oil, so the word must mean to deep-fry.
烤/1 | 把肉放在火上 | Meat is held over the fire, so the word must mean to roast.
切/1 | 先把土豆弄成丝 | Cut the potatoes into strips, so the word must mean to cut.
炒菜/1 | 妈妈在做，厨房里都是香味 | Mum is cooking and the kitchen smells good, so the word must mean to cook dishes.
煮熟/1 | 肉一定要做熟了再吃 | Meat must be cooked through, so the word must mean to cook thoroughly.
加热/1 | 饭凉了再热一下 | The rice is cold, so warm it up, so the word must mean to heat.
生吃/1 | 这种菜不用做熟 | This vegetable needs no cooking, so the word must mean to eat raw.
调料/1 | 有盐、糖、醋和酱油 | Salt, sugar, vinegar and soy sauce are named as what the kitchen holds, so the word must mean seasoning.
盐/1 | 菜太咸了，你放了多少 | The dish is too salty, so the word must mean salt.
酱油/1 | 做红烧肉要放一点，颜色才好看 | Braised pork needs it for colour, so the word must mean soy sauce.
醋/1 | 菜有点酸 | The dish is a little sour, so the word must mean vinegar.
辣椒/1 | 四川人做菜喜欢放，很辣 | Sichuan cooks love it, so the word must mean chilli.
辣酱/1 | 吃面条放一点更香 | He adds some to his noodles, so the word must mean chilli sauce.
味精/1 | 很多人觉得不健康不放 | Many leave it out as unhealthy, so the word must mean MSG.
白糖/1 | 做蛋糕要面粉、鸡蛋和它 | Cake needs flour, eggs and it, so the word must mean white sugar.
果酱/1 | 用苹果做的，放在面包上吃 | It is made from apples and spread on bread, so the word must mean jam.
香料/1 | 印度菜里很多，味道特别 | Indian food has many of them, so the word must mean spice.
咸/1 | 盐放得太多了 | Too much salt has gone into the soup, so the word must mean salty.
淡/1 | 汤没放盐 | The soup has no salt, so the word must mean bland.
清淡/1 | 生病了，医生让他少油少盐 | The doctor wants him to eat light food, so the word must mean light.
可口/1 | 妈妈做的饭菜又香又好吃 | Mum's food is tasty, so the word must mean tasty.
香味/1 | 还没进门就闻到了 | I smelled it before going in, so the word must mean aroma.
口感/1 | 蛋糕吃起来很软 | The cake feels soft in the mouth, so the word must mean texture.
色香味/1 | 好的中国菜讲究三样都好 | Good Chinese food must look, smell and taste good, so the word must mean colour, aroma and taste.
鲜美/1 | 鱼汤味道非常好 | The fish soup is delicious, so the word must mean delicious, fresh.
酸辣/1 | 汤喝起来又酸又辣 | The soup is sour and hot, so the word must mean hot and sour.
甜品/1 | 吃完饭服务员送来的 | The waiter brought it after the meal, so the word must mean dessert.
蔬菜/1 | 多吃对身体好的东西，和水果一起 | Eat plenty of it with fruit, so the word must mean vegetables.
土豆/1 | 长在土里，能做成很多种菜 | It grows underground and makes many dishes, so the word must mean potato.
白菜/1 | 冬天北方人家里常常放很多 | Northern homes store it for winter, so the word must mean Chinese cabbage.
大米/1 | 米饭是用它做的 | Rice is cooked from it, so the word must mean rice.
面粉/1 | 包饺子先用它和水做面 | Dumpling dough is flour and water, so the word must mean flour.
花生/1 | 可以生吃，也可以做油 | It can be eaten raw or pressed for oil, so the word must mean peanut.
海鲜/1 | 城市在海边，又多又便宜 | By the sea it is plentiful and cheap, so the word must mean seafood.
肉类/1 | 他不吃，只吃蔬菜 | He eats only vegetables, not it, so the word must mean meat.
黄豆/1 | 酱油是用它做的 | Soy sauce is made from it, so the word must mean soybean.
绿豆/1 | 夏天喝它的汤凉快 | Its soup cools you in summer, so the word must mean mung bean.
锅/1 | 水开了，把面条放进去 | Put the noodles in once the water boils, so the word must mean pot, wok.
火锅/1 | 冬天大家一起一边煮一边吃 | Friends cook and eat at the table in winter, so the word must mean hotpot.
电饭锅/1 | 用它做米饭又快又方便 | It cooks rice quickly, so the word must mean rice cooker.
餐具/1 | 吃完饭把碗筷放到厨房 | Put the tableware in the kitchen, so the word must mean tableware.
工具/1 | 筷子是中国人吃饭的 | Chopsticks are what Chinese people eat with, so the word must mean tool.
茶具/1 | 爷爷来客人就拿出来喝茶 | Grandpa brings it out for guests, so the word must mean tea set.
厨具/1 | 新家买了锅和刀 | They bought pots and knives for the new home, so the word must mean kitchenware.
一次性/1 | 为保护环境饭馆不用用一次就扔的筷子 | The restaurant avoids throwaway chopsticks, so the word must mean disposable.
桌布/1 | 桌子上放了一块白色的 | A white one covers the table, so the word must mean tablecloth.
洗碗机/1 | 有了它不用自己洗碗 | With it no one washes up by hand, so the word must mean dishwasher.
早餐/1 | 每天七点吃，然后上学 | He eats it at seven before school, so the word must mean breakfast.
午餐/1 | 学校十二点吃的饭 | School lunch is at twelve, so the word must mean lunch.
晚餐/1 | 下班以后一家人一起吃 | The family eats it together after work, so the word must mean dinner.
加餐/1 | 孩子下午四点吃点水果饼干 | The child has a snack at four, so the word must mean extra snack.
快餐/1 | 工作太忙，中午吃很快能吃完的饭 | Too busy, he eats fast food at noon, so the word must mean fast food.
西餐/1 | 吃的时候用刀不用筷子 | It is eaten with a knife, not chopsticks, so the word must mean Western food.
中餐/1 | 很多外国人喜欢，也会用筷子 | Many foreigners like it and use chopsticks, so the word must mean Chinese food.
自助餐/1 | 一人一百块，想吃什么就拿 | A hundred yuan and help yourself, so the word must mean buffet.
工作餐/1 | 公司中午给员工的饭 | The company provides staff with it at noon, so the word must mean staff meal.
用餐/1 | 请大家八点到饭厅吃饭 | Please come to the dining hall to eat at eight, so the word must mean to dine.
餐厅/1 | 学校的在图书馆东边 | The school's is east of the library, so the word must mean dining hall.
订餐/1 | 不想做饭，在网上要饭菜 | We order food online, so the word must mean to order a meal.
打包/1 | 菜没吃完请服务员装好带走 | We ask the waiter to box up leftovers, so the word must mean to pack up leftovers.
菜系/1 | 中国有八大，川菜是一个 | China has eight, Sichuan among them, so the word must mean cuisine.
川菜/1 | 很多菜很辣，八大菜系之一 | Its dishes are spicy, so the word must mean Sichuan cuisine.
鲁菜/1 | 山东人做的菜 | It is the cooking of Shandong, so the word must mean Shandong cuisine.
特色菜/1 | 每个地方都有自己的 | Every place has its own specialities, so the word must mean speciality.
招牌菜/1 | 饭馆的鱼客人都要点 | Every guest orders the restaurant's fish, so the word must mean signature dish.
拿手菜/1 | 红烧鱼爸爸做得最好，请客就做 | Dad's best dish is braised fish, so the word must mean best dish.
品尝/1 | 请大家尝一下我做的蛋糕 | Please taste my cake, so the word must mean to taste.
蛋白质/1 | 鸡蛋和牛奶里有很多 | Eggs and milk are rich in it, so the word must mean protein.
热量/1 | 饼干很高，不能多吃 | The biscuits are high in calories, so the word must mean calories.
均衡/1 | 饮食什么都要吃一点 | Eat a bit of everything, so the word must mean balanced.
素食/1 | 不吃肉，只吃这个 | He eats only meatless food, so the word must mean vegetarian food.
挑食/1 | 孩子只吃肉不吃菜 | The child eats only meat, so the word must mean to be picky.
光盘/1 | 吃饭要把盘子吃干净 | Clear your plate to avoid waste, so the word must mean to clean one's plate.
食品安全/1 | 关系到每个人的健康 | It affects everyone's health, so the word must mean food safety.
保质期/1 | 牛奶能放七天 | The milk keeps seven days, so the word must mean shelf life.
过期/1 | 牛奶已经不能喝了 | The milk is past its date, so the word must mean to expire.
节食/1 | 医生让他少吃油和糖 | The doctor told him to eat less fat and sugar, so the word must mean to diet.
价值观/1 | 有人觉得钱最重要，有人觉得家人最重要 | People differ on what matters most, so the word must mean values.
世界观/1 | 读书旅行改变看世界的方式 | Reading and travel change one's outlook, so the word must mean world view.
人生观/1 | 生病以后对人生的看法变了 | His illness changed his view of life, so the word must mean outlook on life.
传统观念/1 | 中国人过年一家人要在一起 | Families gathering at New Year is a traditional idea, so the word must mean traditional idea.
信念/1 | 只要努力就一定能成功 | He believes effort brings success, so the word must mean conviction.
信仰/1 | 要尊重别人的宗教的 | Respect others' religious faith, so the word must mean faith.
原则/1 | 做事从来不说假话 | He never tells lies, so the word must mean principle.
宗教/1 | 世界上有很多种，要互相尊重 | There are many in the world, so the word must mean religion.
理念/1 | 公司的想法是顾客第一 | The company's philosophy is customer first, so the word must mean philosophy, idea.
常识/1 | 水在零度会结冰 | Water freezes at zero, everyone knows, so the word must mean common sense.
是非/1 | 小孩子要分清对错 | Children must learn right from wrong, so the word must mean right and wrong.
善恶/1 | 故事讲好人坏人都有报 | Good and evil are repaid, so the word must mean good and evil.
正当/1 | 他的要求公司应该同意 | His request is legitimate, so the word must mean proper.
合理/1 | 价格不贵也不便宜 | The price is fair, so the word must mean reasonable.
不公/1 | 他觉得决定对他不公平 | He thinks the decision unjust, so the word must mean unjust.
公正/1 | 裁判不能帮任何一方 | A referee must favour no side, so the word must mean impartial.
正直/1 | 看到不对的事就说出来 | He speaks out against wrong, so the word must mean upright.
良心/1 | 骗老人的钱 | Cheating old people shows none, so the word must mean conscience.
善良/1 | 常常帮助有困难的人 | She often helps people in need, so the word must mean kind-hearted.
底线/1 | 诚实是做人最起码的 | Honesty is the bottom line, so the word must mean bottom line.
欺骗/1 | 把假的说成真的骗大家 | He passed fakes off as real, so the word must mean to deceive.
说谎/1 | 小孩子不应该说假话 | Children should not lie, so the word must mean to lie.
谎言/1 | 他的假话很快被知道了 | His lie was soon found out, so the word must mean lie.
守信/1 | 答应别人的事一定做到 | He always keeps his word, so the word must mean to keep one's promise.
信用/1 | 借钱总是准时还 | He always repays on time, so the word must mean credit.
承诺/1 | 公司答应三天以内送到 | The firm promises delivery in three days, so the word must mean promise.
虚伪/1 | 当面说好话，背后说坏话 | He speaks well of people to their faces and badly behind their backs, so the word must mean hypocritical.
守时/1 | 从来没有迟到过 | He has never been late, so the word must mean punctual.
实事求是/1 | 做调查不能自己编数字 | A survey must not invent figures, so the word must mean to seek truth from facts.
以诚待人/1 | 真心对人，别人也真心对他 | Treat others sincerely and they will do the same, so the word must mean to treat people sincerely.
省吃俭用/1 | 父母把钱都花在孩子教育上 | The parents scrimp for their child's schooling, so the word must mean to scrimp and save.
节俭/1 | 奶奶一件衣服穿了十年 | Grandma wore one coat for ten years, so the word must mean frugal.
朴素/1 | 她从来不买贵的衣服 | She never buys expensive clothes, so the word must mean plain.
简朴/1 | 房子里只有一张床和一张桌子 | His home holds only a bed and a table, so the word must mean simple and frugal.
贪心/1 | 拿一个就够了 | Take only one, so the word must mean greedy.
知足/1 | 觉得现在的生活已经很好 | He thinks his life good enough, so the word must mean content.
名利/1 | 不追求，只想安静地画画 | He seeks neither fame nor gain, so the word must mean fame and gain.
珍惜/1 | 好好利用时间学习 | Treasure your time and study, so the word must mean to cherish.
大方/1 | 常常请朋友吃饭 | He often treats his friends, so the word must mean generous.
小气/1 | 一块糖也不给别人 | He will not share a single sweet, so the word must mean stingy.
感恩/1 | 记住父母为我们做的一切 | Remember all our parents do, so the word must mean to be grateful.
同情心/1 | 看到别人有困难就想帮忙 | He wants to help anyone in trouble, so the word must mean sympathy.
关爱/1 | 老人需要家人的关心和爱 | The old need their family's care, so the word must mean care.
体贴/1 | 每天给妻子做早饭 | He makes his wife breakfast every day, so the word must mean considerate.
回报/1 | 好好学习报答父母 | He studies hard to repay his parents, so the word must mean to repay.
助人为乐/1 | 总是高兴地帮助别人 | He finds joy in helping, so the word must mean to take pleasure in helping others.
舍己为人/1 | 把最后一张票让给别人 | He gave away the last ticket, so the word must mean to sacrifice oneself for others.
友爱/1 | 同学之间要团结相爱 | Classmates should be united and friendly, so the word must mean friendly affection.
谅解/1 | 我迟到是因为堵车，希望你不怪我 | I was late because of traffic, please forgive me, so the word must mean to understand and forgive.
谦虚/1 | 成绩好还说要继续努力 | Despite top marks he says he must work harder, so the word must mean modest.
哲学/1 | 大学学的，常常思考人为什么活着 | He studied why we live, so the word must mean philosophy.
哲理/1 | 小故事里很深的道理 | The tale holds deep wisdom, so the word must mean philosophical truth.
思想/1 | 孔子的对中国影响很大 | Confucius's thought shaped China, so the word must mean thought.
思想家/1 | 孔子是古代伟大的 | Confucius was a great thinker, so the word must mean thinker.
立场/1 | 站在对方的角度想一想 | See it from his side, so the word must mean standpoint.
真理/1 | 科学家一生都在追求 | Scientists seek it all their lives, so the word must mean truth.
格言/1 | “活到老，学到老” | Live and learn is one, so the word must mean maxim.
见解/1 | 他对问题有自己的看法 | He has his own view on it, so the word must mean opinion.
理智/1 | 生气时也要保持冷静 | Keep a clear head even when angry, so the word must mean reason.
进步/1 | 这学期中文好了很多 | His Chinese has improved a lot, so the word must mean progress.
人生/1 | 只有一次，要好好地过 | It comes only once, so the word must mean life.
追求/1 | 一生都在想实现梦想 | He has pursued his dream all his life, so the word must mean to pursue.
奋斗/1 | 经过十年努力有了自己的公司 | Ten years of hard work built his company, so the word must mean to strive.
高尚/1 | 帮助别人是很好的行为 | Helping others is noble, so the word must mean noble.
荣誉/1 | 比赛胜利是全校的光荣 | The win honours the whole school, so the word must mean honour.
名声/1 | 在城市里大家都相信他 | Everyone trusts him, so the word must mean reputation.
羞耻/1 | 抄别人的作业让人觉得丢人 | Copying homework is shameful, so the word must mean shame.
使命/1 | 保护病人健康是医生的 | Guarding health is a doctor's mission, so the word must mean mission.
尊严/1 | 每个人都有，不应被看不起 | Everyone has dignity, so the word must mean dignity.
担当/1 | 出了问题主动负责不怪别人 | He takes responsibility without blaming others, so the word must mean to take responsibility.
个人/1 | 这是我自己的看法，不代表公司 | It is my own view, so the word must mean personal.
集体/1 | 我们班是一个团结的 | Our class is a united group, so the word must mean collective.
个人主义/1 | 只想着自己不管别人 | Thinking only of oneself is this, so the word must mean individualism.
集体主义/1 | 认为集体利益比个人利益更重要 | It puts the group above the person, so the word must mean collectivism.
无私/1 | 母亲的爱不为自己 | A mother's love is selfless, so the word must mean selfless.
奉献/1 | 老师把一生都给了教育 | She gave her life to teaching, so the word must mean to devote.
社会责任/1 | 企业不只赚钱，也要承担 | Firms must bear it besides making money, so the word must mean social responsibility.
一视同仁/1 | 老师对所有学生都一样 | The teacher treats all pupils alike, so the word must mean to treat equally.
以人为本/1 | 城市建设多为市民着想 | City building should put people first, so the word must mean people-oriented.
自强/1 | 没有父母，自己考上大学 | Without parents he made it to university, so the word must mean self-reliant.
`);
