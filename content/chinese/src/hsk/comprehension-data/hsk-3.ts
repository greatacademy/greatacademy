// The dialogues, talks and passages of HSK 3 with their questions (docs/chinese-curriculum.md §8.5), written for this package in the characters of the levels it tests; none is taken from a test.

import type { ComprehensionData } from "../comprehension.ts";

/** comprehension are the dialogues and passages of HSK 3. */
export const comprehension: ComprehensionData = {
  dialogues: {
    short: `
女：你怎么还在公司？不是说今天早点儿回家吗？
男：经理突然让我再写一个计划，明天早上就要用。
问：男的为什么还没回家？
据：男的说“经理突然让我再写一个计划，明天早上就要用”。 | The man says the manager suddenly asked for another plan, needed tomorrow morning.
答：要写一个计划
错：在等女的 | 他没有说在等女的。 | He does not say he is waiting for her.
错：明天要早点儿来 | 明天早上是要用计划的时间，不是他要早来。 | Tomorrow morning is when the plan is needed, not when he must arrive early.

女：这个手机的屏幕太小了，看东西眼睛很累。
男：那你换一个大一点儿的吧，现在也不贵。
问：男的让女的做什么？
据：男的说“那你换一个大一点儿的吧”。 | The man says she should get a bigger one.
答：换一个屏幕大的手机
错：少看手机 | 他让她换手机，没有让她少看。 | He says change phones, not use it less.
错：去看眼睛 | 他没有让她去看眼睛。 | He does not send her to an eye doctor.

女：听说你要搬到乡下去住，是真的吗？
男：是的，那里空气好，房子也比城市便宜多了。
问：男的为什么要去乡下住？
据：男的说“那里空气好，房子也比城市便宜多了”。 | The man says the air is good and housing much cheaper than in the city.
答：空气好，房子便宜
错：离公司近 | 他没有说离公司近。 | He does not mention his office.
错：父母住在那里 | 他没有说父母。 | He does not mention his parents.

女：你昨天怎么没来参加小李的生日会？
男：我本来要去的，可是孩子突然发烧了。
问：男的为什么没去生日会？
据：男的说“我本来要去的，可是孩子突然发烧了”。 | The man says he meant to go, but his child suddenly ran a fever.
答：孩子发烧了
错：他忘了 | 他说“本来要去的”，没有忘。 | He says he meant to go, so he did not forget.
错：他要加班 | 他没有说加班。 | He does not mention overtime.

女：这本书我看了两遍，还是不太明白。
男：别着急，我先给你讲讲这本书的历史背景。
问：男的要做什么？
据：男的说“我先给你讲讲这本书的历史背景”。 | The man says he will first explain the book's historical background.
答：给女的讲书的背景
错：让女的再看一遍 | 她已经看了两遍，他没有让她再看。 | She has read it twice; he does not tell her to read again.
错：把书送给女的 | 他没有说送书。 | He does not offer the book.

女：这条裙子打八折，只要一百六十块。
男：那原来的价格是两百块，还是很便宜的。
问：裙子原来多少钱？
据：男的说“那原来的价格是两百块”。两百打八折是一百六十。 | The man says the original price was two hundred; twenty per cent off two hundred is 160.
答：两百块
错：一百六十块 | 一百六十块是打折以后的价钱。 | 160 is the sale price.
错：八十块 | 八十是“八折”里的八，不是价钱。 | Eighty comes from the "eight" in 八折, not a price.

女：你的汉语说得这么好，有什么好办法吗？
男：我每天都跟中国朋友聊天，还看中国电视剧。
问：男的怎么学汉语？
据：男的说“我每天都跟中国朋友聊天，还看中国电视剧”。 | The man says he chats with Chinese friends and watches Chinese dramas every day.
答：跟中国朋友聊天，看电视剧
错：每天去上课 | 他没有说上课。 | He does not mention classes.
错：每天背一百个词 | 他没有说背词。 | He does not mention memorising words.

女：明天的会议从上午换到下午三点了，你通知大家一下。
男：好的，我马上给他们发邮件。
问：男的接下来会做什么？
据：男的说“好的，我马上给他们发邮件”。 | The man says he will email them at once.
答：给大家发邮件
错：去开会 | 会议改到明天下午了。 | The meeting is moved to tomorrow afternoon.
错：去找经理 | 让他通知大家的就是女的，他不用去找经理。 | It is the woman who asks him; he need not see a manager.

女：这家饭馆的菜虽然好吃，但是服务太差了。
男：是啊，我们等了四十分钟菜才上来。
问：他们觉得这家饭馆怎么样？
据：女的说“菜虽然好吃，但是服务太差了”，男的说“是啊”。 | The woman says the food is good but the service poor, and the man agrees.
答：菜好吃，服务差
错：菜不好吃，服务好 | 正好说反了：是菜好，服务差。 | It is the reverse: good food, poor service.
错：菜和服务都很好 | 服务太差了。 | The service is poor.

女：你住的那个楼里有人养宠物吗？
男：我邻居养了两只猫，每天晚上都叫个不停。
问：男的的邻居养了什么？
据：男的说“我邻居养了两只猫”。 | The man says his neighbour has two cats.
答：两只猫
错：两只狗 | 他说的是猫，不是狗。 | He says cats, not dogs.
错：一只猫 | 他说的是两只，不是一只。 | He says two, not one.

女：我的电脑又坏了，你能帮我看看吗？
男：我对电脑不太熟悉，你还是找小张吧。
问：男的是什么意思？
据：男的说“我对电脑不太熟悉，你还是找小张吧”。 | The man says he is not familiar with computers, so she should ask Xiao Zhang.
答：他不太会修电脑
错：他没有时间 | 他说的是不熟悉，不是没时间。 | He says he does not know computers, not that he is busy.
错：小张的电脑也坏了 | 小张是他推荐的会修的人，不是电脑坏了。 | Xiao Zhang is who he recommends, not someone with a broken computer.

女：请问去博物馆坐几路公共汽车？
男：坐12路，在第五站下车就到了。
问：去博物馆要在第几站下车？
据：男的说“坐12路，在第五站下车”。 | The man says take the No. 12 and get off at the fifth stop.
答：第五站
错：第十二站 | 十二是车的路数，不是站数。 | Twelve is the bus number, not the stop.
错：第二站 | 他说的是第五站，不是第二站。 | He says the fifth, not the second.

女：你这次数学考了多少分？
男：九十二分，比上次多了十分。
问：男的上次考了多少分？
据：男的说“九十二分，比上次多了十分”。九十二减去十，上次是八十二。 | The man says ninety-two, ten more than last time; ninety-two minus ten is eighty-two.
答：八十二分
错：九十二分 | 九十二是这次的分数。 | Ninety-two is this time's score.
错：一百零二分 | 一百零二是加了十，方向反了。 | 102 adds ten, the wrong way.

女：星期六的音乐会你买到票了吗？
男：没有，票早就卖完了，只能下次再去了。
问：男的为什么不去音乐会？
据：男的说“票早就卖完了”。 | The man says the tickets sold out long ago.
答：没买到票
错：他不喜欢音乐 | 他想去，只是没票。 | He wanted to go but had no ticket.
错：星期六要加班 | 他没有说加班。 | He does not mention overtime.

女：我们去公园走走吧，今天天气这么好。
男：好啊，不过我得先把这些衣服洗完。
问：男的要先做什么？
据：男的说“不过我得先把这些衣服洗完”。 | The man says he must first finish washing the clothes.
答：洗衣服
错：去公园 | 去公园是洗完以后。 | The park comes after the washing.
错：换衣服 | 他说的是洗衣服，不是换衣服。 | He says wash, not change.

女：你妹妹的性格怎么样？好不好相处？
男：她很爱说话，跟谁都能聊得来。
问：男的的妹妹性格怎么样？
据：男的说“她很爱说话，跟谁都能聊得来”。 | The man says she loves to talk and gets on with anyone.
答：很爱跟人交流
错：不爱说话 | 她很爱说话。 | She loves to talk.
错：脾气不好 | 他没有说脾气。 | He does not mention temper.

女：这个包是在网上买的吗？质量真不错。
男：对，而且比商场里的便宜了一百多块。
问：关于这个包，可以知道什么？
据：女的问是不是网上买的，说质量真不错，男的说“对”。 | She asks if it was bought online and praises the quality, and he says yes.
答：在网上买的，质量好
错：在商场买的 | 是在网上买的，比商场便宜。 | It was bought online, cheaper than the mall.
错：价格很贵 | 比商场便宜了一百多块。 | It was over a hundred cheaper.

女：你的护照办好了吗？下个月就要出国了。
男：还没有，我明天上午去办。
问：男的明天上午要做什么？
据：男的说“我明天上午去办”，办的是护照。 | The man says he will apply for the passport tomorrow morning.
答：去办护照
错：出国 | 出国是下个月。 | Going abroad is next month.
错：买机票 | 他没有说机票。 | He does not mention tickets.

女：这个问题你得问张老师，他是这方面的专家。
男：好的，我一会儿就去他办公室找他。
问：女的让男的做什么？
据：女的说“这个问题你得问张老师”。 | The woman says he must ask Teacher Zhang.
答：去问张老师
错：自己想办法 | 她让他问老师，不是自己想。 | She says ask the teacher, not work it out alone.
错：上网查一查 | 她没有说上网。 | She does not mention the internet.

女：你怎么又在吃面包？这样对身体不好。
男：我也知道，可是工作太忙了，没时间做饭。
问：男的为什么吃面包？
据：男的说“工作太忙了，没时间做饭”。 | The man says work is too busy to cook.
答：没时间做饭
错：他很喜欢吃面包 | 他说“我也知道”对身体不好，不是因为喜欢。 | He knows it is unhealthy, not that he loves bread.
错：他想减肥 | 他没有说减肥。 | He does not mention dieting.

女：我想把这个旧沙发卖了，你觉得多少钱合适？
男：这个沙发还很新，卖五百块应该没问题。
问：男的觉得沙发怎么样？
据：男的说“这个沙发还很新”。 | The man says the sofa is still quite new.
答：还很新
错：太旧了 | 他说还很新，不是太旧。 | He says new, not too old.
错：不值钱 | 他说能卖五百块，值钱。 | He says it would fetch five hundred.

女：你去过那个新开的图书馆吗？
男：去过，环境非常安静，书也多，就是离我家有点儿远。
问：男的觉得图书馆有什么问题？
据：男的说“就是离我家有点儿远”。 | The man says the only drawback is that it is a bit far from home.
答：离他家有点儿远
错：不安静 | 他说“环境非常安静”。 | He says it is very quiet.
错：书太少 | 他说“书也多”。 | He says it has many books.

女：别忘了把垃圾带下去，明天早上收垃圾。
男：放心吧，我出门的时候就带下去。
问：女的让男的做什么？
据：女的说“别忘了把垃圾带下去”。 | The woman says not to forget to take the rubbish down.
答：把垃圾带下去
错：明天早点儿起床 | 明天早上是收垃圾的时间，不是让他早起。 | Tomorrow morning is collection, not a call to rise early.
错：收拾房间 | 她没有说收拾房间。 | She does not mention tidying.

女：老张退休以后每天都做什么？
男：他每天早上去公园跳舞，下午在家画画。
问：老张下午做什么？
据：男的说“下午在家画画”。 | The man says he paints at home in the afternoon.
答：在家画画
错：去公园 | 去公园是早上。 | The park is in the morning.
错：去上班 | 老张退休了，不上班。 | Lao Zhang is retired.

女：今天的作业太难了，我做了一个晚上还没做完。
男：哪道题？我们可以一起研究研究。
问：男的是什么意思？
据：男的说“哪道题？我们可以一起研究研究”。 | The man asks which problem and offers to work on it together.
答：想跟女的一起做题
错：让女的问老师 | 他要一起做，没有让她问老师。 | He offers to help, not sends her to a teacher.
错：他也没做完 | 他没有说自己也没做完。 | He does not say he has not finished.

女：我觉得这次比赛我们一定能赢。
男：先别太骄傲，对方的队也很不错。
问：男的是什么意思？
据：男的说“先别太骄傲，对方的队也很不错”。 | The man says not to be too proud; the other team is good too.
答：让女的别太骄傲
错：觉得一定能赢 | 一定能赢是女的说的，男的不同意。 | Sure victory is her claim, which he questions.
错：觉得一定会输 | 他只说对方也不错，没有说一定输。 | He says they are good, not that his side will lose.

女：你的行李箱怎么这么重？里面放了什么？
男：都是书，我妈妈让我带给我叔叔的。
问：行李箱里放了什么？
据：男的说“都是书”。 | The man says it is all books.
答：书
错：衣服 | 他说的是书，不是衣服。 | He says books, not clothes.
错：吃的东西 | 他说的是书，不是吃的。 | He says books, not food.

女：小李跟他女朋友又吵架了？
男：是啊，不过两个人很快就会好的。
问：男的觉得小李和他女朋友会怎么样？
据：男的说“不过两个人很快就会好的”。 | The man says the two will soon make up.
答：很快会好
错：会分手 | 他说很快会好，不是分手。 | He says they will make up, not split.
错：会结婚 | 他没有说结婚。 | He does not mention marriage.

女：你开车去机场吗？这个时间路上很堵。
男：那我还是坐地铁吧，这样一定不会迟到。
问：男的决定怎么去机场？
据：男的说“那我还是坐地铁吧，这样一定不会迟到”。 | The man says he will take the underground so he will not be late.
答：坐地铁
错：开车 | 路上很堵，他不开车了。 | The roads are jammed, so he will not drive.
错：坐出租车 | 他说的是地铁，不是出租车。 | He says the underground, not a taxi.

女：你这个月的电费怎么这么高？
男：天太热了，我每天都开着空调。
问：男的电费为什么高？
据：男的说“天太热了，我每天都开着空调”。 | The man says it is so hot he runs the air conditioner every day.
答：每天开空调
错：电费价格变高了 | 他没有说电价变了。 | He does not say prices changed.
错：家里人多 | 他没有说家里人多。 | He does not mention a big household.

女：听说那家公司选上你了，祝贺你！
男：谢谢，下个星期一我就要去上班了。
问：男的什么时候去上班？
据：男的说“下个星期一我就要去上班了”。 | The man says he starts next Monday.
答：下个星期一
错：明天 | 他说的是下个星期一，不是明天。 | He says next Monday, not tomorrow.
错：下个月 | 他说的是下个星期一，不是下个月。 | He says next Monday, not next month.

女：这道菜是你做的吗？做得真不错。
男：是我看网上的视频学的，第一次做。
问：男的是怎么学会做这道菜的？
据：男的说“是我看网上的视频学的”。 | The man says he learned from an online video.
答：看网上的视频
错：妈妈教他的 | 他没有说妈妈。 | He does not mention his mother.
错：在饭馆学的 | 他没有说饭馆。 | He does not mention a restaurant.

女：你上个星期忘在车上的钱包找到了吗？
男：找到了，一个出租车司机给我送回来了。
问：钱包最后怎么样了？
据：男的说“找到了，一个出租车司机给我送回来了”。 | The man says a taxi driver brought it back.
答：司机送回来了
错：还没找到 | 他说找到了。 | He says it was found.
错：男的在家找到了 | 是司机送回来的，不是在家找到。 | A driver returned it; he did not find it at home.
`,
    long: `
女：你下个月去旅游的计划定下来了吗？
男：还没有，我还在北京和西安两个地方里选。
女：我觉得你应该去西安，那里的历史很有意思。
男：可是我听说西安的夏天特别热。
女：那你可以十月去，秋天的天气最舒服。
男：好，那我就十月去西安吧。
问：男的在哪两个地方里选？
据：男的说“我还在北京和西安两个地方里选”。 | The man says he is choosing between Beijing and Xi'an.
答：北京和西安
错：北京和上海 | 他说的是北京和西安，没有上海。 | He says Beijing and Xi'an, not Shanghai.
错：西安和南京 | 他说的是北京和西安，没有南京。 | He says Beijing and Xi'an, not Nanjing.
问：女的为什么让男的去西安？
据：女的说“我觉得你应该去西安，那里的历史很有意思”。 | The woman says he should go to Xi'an because its history is interesting.
答：西安的历史很有意思
错：西安的东西便宜 | 她没有说东西便宜。 | She does not mention prices.
错：西安的夏天不热 | 男的说西安的夏天特别热。 | The man says Xi'an summers are very hot.
问：男的最后决定什么时候去？
据：男的说“好，那我就十月去西安吧”。 | The man says he will go to Xi'an in October.
答：十月
错：下个月 | 下个月是他原来的计划，后来改成十月。 | Next month was the old plan; he changed it to October.
错：夏天 | 夏天太热，所以不去。 | Summer is too hot, so not then.

男：小马，你最近怎么每天都这么累？
女：我每天晚上都要加班，经常熬夜到一两点。
男：这样下去身体会出问题的。
女：我也知道，可是工作一直做不完。
男：你应该跟经理谈谈，看能不能找人帮你。
问：女的最近为什么很累？
据：女的说“我每天晚上都要加班，经常熬夜到一两点”。 | The woman says she works late every night, often till one or two.
答：每天加班到很晚
错：生病了 | 她没有说生病。 | She does not say she is ill.
错：要照顾孩子 | 对话没有说孩子。 | Children are never mentioned.
问：男的让女的做什么？
据：男的说“你应该跟经理谈谈”。 | The man says she should talk to the manager.
答：跟经理谈谈
错：换一个工作 | 他没有让她换工作。 | He does not suggest a new job.
错：去医院看看 | 他说身体会出问题，可是让她找的是经理，不是医院。 | He warns about her health, but sends her to the manager, not a doctor.
问：关于女的，可以知道什么？
据：女的说“可是工作一直做不完”。 | The woman says the work never gets finished.
答：她工作做不完
错：她不想工作了 | 她在努力做，没有说不想工作。 | She is working hard, not wanting to quit.
错：她每天十点睡觉 | 她熬夜到一两点，不是十点睡。 | She stays up till one or two, not bed at ten.

女：你好，我想把这条裤子退了。
男：好的，请问裤子有什么问题吗？
女：裤子有点儿短，我穿着不合适。
男：可以换一条长一点儿的，您看行吗？
女：好吧，那我就换一条长一点儿的。
问：他们最可能在哪儿？
据：女的要退裤子，男的问裤子有什么问题，还说可以换一条长一点儿的。退换衣服是在商店。 | She wants to return trousers and he offers a longer pair: returns and exchanges happen in a shop.
答：商店
错：饭馆 | 饭馆里不退换裤子。 | Restaurants do not exchange trousers.
错：银行 | 银行里不卖裤子。 | Banks do not sell trousers.
问：女的为什么不要这条裤子？
据：女的说“裤子有点儿短，我穿着不合适”。 | The woman says the trousers are a bit short and do not fit.
答：有点儿短
错：有点儿长 | 她说短，和长相反。 | She says short, the opposite of long.
错：颜色不好看 | 她没有说颜色。 | She does not mention colour.
问：女的最后决定怎么做？
据：女的说“好吧，那我就换一条长一点儿的”。 | The woman says all right, she will exchange them for a longer pair.
答：换一条长一点儿的
错：把裤子退了 | 退是她开始想的，后来改成了换。 | Returning was her first idea; she settles on an exchange.
错：再买一条 | 她是换一条，不是再买一条。 | She exchanges, not buys another.

男：听说你们公司要招新人？
女：对，我们要一个会说外语的销售。
男：我妹妹刚毕业，外语很好，可以介绍给你吗？
女：可以，让她把简历发到我的邮箱吧。
问：女的公司要什么样的人？
据：女的说“我们要一个会说外语的销售”。 | The woman says they want a salesperson who speaks a foreign language.
答：会说外语的销售
错：会说汉语的老师 | 她说的是销售，不是老师。 | She says sales, not a teacher.
错：会用电脑的司机 | 她说的是销售，不是司机。 | She says sales, not a driver.
问：男的想介绍谁？
据：男的说“我妹妹刚毕业，外语很好，可以介绍给你吗”。 | The man offers to introduce his younger sister, just graduated.
答：他的妹妹
错：他的姐姐 | 他说的是妹妹，不是姐姐。 | He says younger sister, not elder.
错：他的同学 | 他说的是妹妹，不是同学。 | He says his sister, not a classmate.
问：女的让男的妹妹做什么？
据：女的说“让她把简历发到我的邮箱吧”。 | The woman says to have her email her CV.
答：发简历
错：打电话 | 她说的是发简历，不是打电话。 | She says send a CV, not call.
错：来公司见面 | 她说的是发简历，不是来见面。 | She says send a CV, not come in.

女：我们班下个星期要举行一个比赛，你参加吗？
男：是什么比赛？我还没听说。
女：讲故事比赛，每个人讲五分钟，第一名有奖。
男：我讲故事讲得不好，还是给你们加油吧。
问：这是一个什么比赛？
据：女的说“讲故事比赛”。 | The woman says it is a storytelling contest.
答：讲故事比赛
错：唱歌比赛 | 她说的是讲故事，不是唱歌。 | She says storytelling, not singing.
错：篮球比赛 | 她说的是讲故事，不是篮球。 | She says storytelling, not basketball.
问：每个人讲多长时间？
据：女的说“每个人讲五分钟”。 | The woman says five minutes each.
答：五分钟
错：十分钟 | 她说的是五分钟，不是十分钟。 | She says five minutes, not ten.
错：十五分钟 | 她说的是五分钟，不是十五分钟。 | She says five, not fifteen.
问：男的会参加比赛吗？
据：男的说“我讲故事讲得不好，还是给你们加油吧”。 | The man says he is bad at stories and will cheer them on instead.
答：不参加，他去加油
错：参加，他讲得很好 | 他说自己讲得不好。 | He says he is poor at it.
错：还没决定 | 他说“还是给你们加油吧”，已经决定了。 | He says he will cheer, so he has decided.

男：你好，我是楼下的邻居，你家是不是在用水？
女：没有啊，我刚回来，怎么了？
男：我家厨房上面一直有水下来。
女：真对不起，我马上看看是哪里坏了。
问：男的为什么来找女的？
据：男的说“我家厨房上面一直有水下来”。 | The man says water keeps coming through his kitchen ceiling.
答：他家厨房上面有水下来
错：女的家声音太大 | 他没有说声音。 | He does not mention noise.
错：想跟女的认识一下 | 他来是因为漏水，不是交朋友。 | He comes about the leak, not to socialise.
问：男的住在女的哪里？
据：男的说“我是楼下的邻居”。 | The man says he is the neighbour downstairs.
答：楼下
错：楼上 | 水从他家上面下来，他住楼下。 | Water comes from above him, so he lives below.
错：对面 | 他说的是楼下，不是对面。 | He says downstairs, not opposite.
问：女的接下来会做什么？
据：女的说“真对不起，我马上看看是哪里坏了”。 | The woman apologises and will check what is broken at once.
答：看看哪里坏了
错：去男的家做饭 | 对话没有说做饭。 | Cooking is never mentioned.
错：给经理打电话 | 她自己去看，没有说打电话。 | She will look herself; no call is mentioned.

女：你怎么每天骑自行车上班了？
男：一是为了锻炼身体，二是为了保护环境。
女：可是你家离公司那么远，要骑多久？
男：四十分钟左右，习惯了就不觉得累了。
问：男的为什么骑自行车上班？
据：男的说“一是为了锻炼身体，二是为了保护环境”。 | The man says first for exercise, second to protect the environment.
答：锻炼身体，保护环境
错：没钱坐车 | 他没有说钱。 | He does not mention money.
错：公司离家很近 | 女的说他家离公司“那么远”。 | The woman says he lives far from work.
问：男的骑车上班要多长时间？
据：男的说“四十分钟左右”。 | The man says about forty minutes.
答：四十分钟左右
错：十四分钟左右 | 他说的是四十，不是十四。 | He says forty, sìshí, not fourteen.
错：一个小时左右 | 四十分钟不到一个小时。 | Forty minutes is under an hour.

女：明天我们几点出发去看奶奶？
男：早上八点吧，路上要开三个小时的车。
女：要不要给奶奶带点儿东西？
男：她最爱吃水果，我们去买一些苹果和西瓜吧。
问：他们明天要去做什么？
据：女的问“明天我们几点出发去看奶奶”。 | The woman asks when they leave tomorrow to see Grandma.
答：看奶奶
错：去旅游 | 他们是去看奶奶，不是旅游。 | They are visiting Grandma, not touring.
错：去买车 | 他们开车去，不是买车。 | They drive there, not buy a car.
问：路上要开多长时间的车？
据：男的说“路上要开三个小时的车”。 | The man says it is a three-hour drive.
答：三个小时
错：八个小时 | 八是出发的时间八点。 | Eight is the departure time.
错：一个小时 | 他说的是三个小时，不是一个。 | He says three hours, not one.
问：他们要给奶奶带什么？
据：男的说“我们去买一些苹果和西瓜吧”。 | The man says they will buy apples and watermelon.
答：苹果和西瓜
错：蛋糕 | 他说奶奶最爱吃水果，没有说蛋糕。 | He says she loves fruit; no cake.
错：牛奶和面包 | 他说的是苹果和西瓜，不是牛奶面包。 | He says apples and melon, not milk and bread.

讲：欢迎大家来到我们商场。为了感谢大家的支持，从今天到这个星期天，商场里所有的衣服都打八折。在本店购物满三百元的顾客，还可以免费得到一个环保袋。还有，三楼新开了一家咖啡馆，欢迎大家去坐一坐，休息一下。谢谢大家！
问：说话人最可能是在哪儿？
据：说话人说“欢迎大家来到我们商场”。 | The speaker says, "Welcome to our mall."
答：商场
错：咖啡馆 | 咖啡馆是商场三楼新开的，说话人在介绍它。 | The café is a new place on the third floor that the speaker mentions.
错：飞机上 | 说话人说的是商场、衣服打折，不是在飞机上。 | The speaker speaks of the mall and its sale, not a flight.
问：衣服打折到什么时候？
据：说话人说“从今天到这个星期天，商场里所有的衣服都打八折”。 | The speaker says all clothes are twenty per cent off from today until this Sunday.
答：这个星期天
错：今天 | 今天是开始打折的日子。 | Today is when the sale begins.
错：下个月 | 说话人说的是这个星期天，不是下个月。 | The speaker says this Sunday, not next month.
问：购物满三百元可以得到什么？
据：说话人说“满三百元的顾客，还可以免费得到一个环保袋”。 | The speaker says shoppers spending three hundred get a free eco bag.
答：一个环保袋
错：一杯咖啡 | 咖啡要自己去咖啡馆，不是送的。 | Coffee is at the café, not a gift.
错：一件衣服 | 衣服是打折的，不是送的。 | Clothes are discounted, not given away.

讲：大家好，我是你们的新老师，我姓李。从今天起，我给大家上历史课。我教历史已经十年了。我觉得学历史不只是背时间和名字，更重要的是理解为什么会发生这些事。上课的时候，我希望大家多问问题，多说说自己的看法。下面，请每个同学先介绍一下自己。
问：说话人是做什么的？
据：说话人说“我是你们的新老师……我给大家上历史课”。 | The speaker says he is the new teacher and will teach history.
答：历史老师
错：数学老师 | 他说的是历史课，不是数学。 | He says history, not maths.
错：学生 | 他说“我是你们的新老师”。 | He says he is the new teacher.
问：说话人觉得学历史最重要的是什么？
据：说话人说“学历史不只是背时间和名字，更重要的是理解为什么会发生这些事”。 | The speaker says history is not just dates and names; what matters more is understanding why things happened.
答：理解事情为什么发生
错：背时间和名字 | 背时间和名字是“不只是”，不是最重要的。 | Dates and names come after 不只是, so they are not the main point.
错：多看书 | 说话人没有说多看书。 | The speaker does not mention reading more.
问：说话人接下来让同学们做什么？
据：说话人说“下面，请每个同学先介绍一下自己”。 | The speaker says next each student should introduce themselves.
答：介绍自己
错：背课文 | 他没有说背课文。 | He does not mention reciting.
错：回答问题 | 他希望上课多问问题，可是接下来是介绍自己。 | He wants questions in class, but next comes self-introductions.

讲：乘客们，你们好！欢迎乘坐本次飞机。我们的飞机在十分钟后起飞，飞往上海，飞行时间大约两个小时。请大家坐好，带好安全带，关上手机。飞机上为大家准备了饮料和小吃。如果有什么问题，请告诉我们的服务员。谢谢！
问：飞机要飞往哪里？
据：说话人说“飞往上海”。 | The speaker says the flight is to Shanghai.
答：上海
错：北京 | 说的是上海，不是北京。 | It says Shanghai, not Beijing.
错：西安 | 说的是上海，不是西安。 | It says Shanghai, not Xi'an.
问：飞行时间大约多长？
据：说话人说“飞行时间大约两个小时”。 | The speaker says the flight takes about two hours.
答：两个小时
错：十分钟 | 十分钟是起飞前的时间。 | Ten minutes is until take-off.
错：一个小时 | 说的是两个小时，不是一个。 | It says two hours, not one.
问：说话人让乘客做什么？
据：说话人说“请大家坐好，带好安全带，关上手机”。 | The speaker asks passengers to sit, fasten seat belts and switch off phones.
答：带好安全带，关上手机
错：去吃东西 | 吃的是准备好的，说话人没有让大家去吃。 | Snacks are provided, but the speaker does not tell them to eat.
错：站起来 | 说话人让大家坐好，不是站起来。 | The speaker says sit down, not stand.
`,
  },
  passages: {
    short: `
文：很多人觉得早上锻炼最好，其实不一定。早上的空气不一定好，有些人的身体也还没完全醒过来。锻炼的时间应该看自己的身体来选择。
问：这段话是说：
答：锻炼时间要看自己的身体来选
错：早上锻炼最好
错：晚上锻炼最好

文：我们公司下个月要搬到新的办公楼。新办公楼在城市东边，离地铁站很近，交通很方便，但是离我家比现在远了一点儿。
问：关于新办公楼，可以知道什么？
答：离地铁站很近
错：离说话人家更近
错：在城市西边

文：小张这个人很有意思，他工作的时候非常认真，一句话也不说；可是下班以后，他就变成了最爱开玩笑的人。
问：小张下班以后怎么样？
答：很爱开玩笑
错：一句话也不说
错：还在认真工作

文：现在很多年轻人喜欢在网上买东西，因为网上东西多，价格便宜，而且不用出门，就会有人送到家里。
问：年轻人为什么喜欢在网上买东西？
答：东西多、便宜，还方便
错：网上东西质量更好
错：喜欢跟卖东西的人聊天

文：我的爷爷今年八十岁了，身体还很健康。他每天早睡早起，不抽烟，也很少喝酒，还常常跟朋友们一起去公园打球。
问：爷爷为什么身体很健康？
答：习惯好，常锻炼
错：经常喝酒
错：每天去医院

文：昨天我在路上遇到了十年没见的中学同学。他变化太大了，我差点儿没认出来。我们约好这个星期六一起吃饭。
问：说话人和同学约好做什么？
答：星期六一起吃饭
错：明天一起去旅游
错：今天一起回学校

文：这家宾馆虽然离市中心有点儿远，但是房间干净，服务员也很热情，价格也不贵，所以来住的人很多。
问：这家宾馆的缺点是什么？
答：离市中心有点儿远
错：房间不干净
错：价格太贵

文：学习一门外语，最重要的是多听多说，不要怕说错。很多人怕别人笑自己，所以不敢说，这样很难学好。
问：说话人认为学外语最重要的是什么？
答：多听多说，不怕说错
错：多写汉字
错：找一个好老师

文：这个城市的冬天虽然不太冷，但是经常下雨，有时候一个星期都见不到太阳，很多人觉得心情不好。
问：这个城市的冬天怎么样？
答：经常下雨
错：非常冷
错：经常下雪

文：妈妈常说，吃饭的时候不要看手机，也不要看电视，要专心吃饭，这样对身体好，也可以和家人多聊聊天。
问：妈妈认为吃饭的时候应该怎么样？
答：专心吃饭，和家人聊天
错：一边吃饭一边看电视
错：吃得快一点儿好

文：我在这家公司工作了三年，从一个普通职员变成了部门经理。我觉得这都是因为我一直努力学习，遇到问题从来不怕。
问：说话人认为自己为什么能当经理？
答：一直努力学习，不怕问题
错：经理是他的朋友
错：他在公司工作了十年

文：为了保护环境，现在很多商店都不免费给塑料袋了。大家去买东西的时候，最好自己带一个购物袋。
问：说话人希望大家去买东西的时候做什么？
答：自己带购物袋
错：多买塑料袋
错：少买东西

文：我小时候很怕水，一直不敢学游泳。去年我下决心参加了一个游泳班，现在已经能游五百米了，我非常高兴。
问：关于说话人，可以知道什么？
答：现在会游泳了
错：现在还很怕水
错：小时候就会游泳

文：这次考试我没考好，心情很不好。老师告诉我，一次考试说明不了什么，重要的是找到问题，下次别再错了。
问：老师是什么意思？
答：找到问题，下次别再错
错：这次考得很好
错：考试一点儿也不重要

文：我家楼下新开了一家面包店，每天早上七点就开门。面包又香又软，价格也不贵，我现在每天的早饭都在那儿买。
问：说话人每天在面包店买什么？
答：早饭
错：午饭
错：晚饭

文：很多父母喜欢帮孩子做决定，其实这样不好。孩子应该有机会自己选择，自己做决定，这样才能学会负责任。
问：说话人认为父母应该怎么做？
答：让孩子自己选择
错：帮孩子做决定
错：什么都不让孩子做

文：我的同事小李特别喜欢旅游，每年都要去两三个国家。他说旅游不只是为了看风景，更是为了了解不同的文化。
问：小李认为旅游更是为了什么？
答：了解不同的文化
错：看风景
错：买东西

文：上个星期我的手机坏了，送去修要一个星期。没有手机的这几天，我反而觉得舒服了很多，还看了两本书。
问：没有手机的时候，说话人觉得怎么样？
答：舒服了很多
错：非常着急
错：很不方便

文：这个电影讲的是一个农村孩子努力学习，最后考上大学的故事。电影虽然很简单，但是很多人看完都哭了。
问：这个电影讲的是什么？
答：农村孩子努力考上大学
错：城市孩子去农村
错：一个老师的故事

文：现在很多人习惯晚睡，常常玩手机玩到十二点以后。医生说，经常熬夜对身体很不好，最好在十一点以前睡觉。
问：医生认为最好几点以前睡觉？
答：十一点
错：十二点
错：十点

文：我们的汉语老师很有耐心，不管我们问多少次同一个问题，她都会认真地回答，从来不会生气，大家都很喜欢她。
问：关于汉语老师，可以知道什么？
答：很有耐心
错：脾气不好
错：不喜欢回答问题

文：去年我在网上认识了一个中国朋友。我们每个星期都在网上聊天，我教她我们国家的话，她教我汉语，我们都学到了很多。
问：说话人和中国朋友怎么学习？
答：互相教
错：一起上课
错：一起去中国

文：今天早上我出门的时候没看天气，结果在路上下起了大雨。我跑到附近的商店里，等了半个小时雨才停。
问：说话人为什么在商店等了半个小时？
答：在等雨停
错：在买东西
错：在等朋友

文：小马的房间每天都很不干净，衣服、书和吃的东西到处都是。他妈妈说了他很多次，他还是这样，一点儿也不听。
问：小马有什么缺点？
答：不收拾房间
错：不爱学习
错：不听音乐

文：很多人认为喝咖啡对身体不好，其实每天喝一两杯是没有问题的，但是不要喝得太多，也不要晚上喝。
问：说话人认为喝咖啡应该怎么样？
答：每天一两杯，不要晚上喝
错：一点儿也不能喝
错：多喝一点儿好

文：我们家附近有一个大公园，里面有湖，有很多树和花。每天晚上，很多老人在那里跳舞、唱歌，人非常多。
问：每天晚上公园里怎么样？
答：人很多
错：很安静
错：没有人

文：我的哥哥大学学的是法律，可是毕业以后他却当了一名厨师。他说做菜才是他真正喜欢的事，他每天都很快乐。
问：关于哥哥，可以知道什么？
答：他喜欢做菜
错：他在做法律工作
错：他还在上大学

文：这家公司规定每个员工都必须会说两门外语。不过工资也很高，所以很多年轻人都想来这里工作。
问：很多年轻人为什么想来这家公司？
答：工资很高
错：不用会外语
错：工作很简单

文：有人说，读一本好书就是交了一个好朋友。书可以告诉我们很多不知道的事，也能在我们难过的时候安慰我们。
问：这段话是说：
答：读书的好处
错：怎么交朋友
错：怎么写书

文：昨天是我第一次自己做饭。我做了一个鸡蛋汤，虽然有点儿酸，但是我还是全喝完了，觉得自己特别了不起。
问：说话人做的汤怎么样？
答：有点儿酸
错：非常好喝
错：太甜了

文：我们学校的图书馆星期一到星期五早上八点开门，晚上十点关门；星期六和星期天只开半天，从上午九点到中午十二点。
问：星期六图书馆几点关门？
答：中午十二点
错：晚上十点
错：上午九点

文：很多人买东西的时候只看价格，不看质量。其实，有些东西虽然便宜，但是很快就坏了，最后反而花了更多的钱。
问：说话人是什么意思？
答：买东西也要看质量
错：东西便宜就好
错：买东西只看价格

文：我的邻居是一位退休的老教师。她每天下午都免费帮家附近的孩子们看作业、讲题，孩子们都很喜欢她。
问：关于邻居，可以知道什么？
答：免费帮孩子学习
错：她还在学校工作
错：她不喜欢孩子
`,
    long: `
文：我叫马红，在一家银行工作。我的工作很忙，每天要见很多客人，有时候中午都没时间吃饭。虽然很累，但是我很喜欢这份工作，因为能帮助别人解决问题。上个月，一位老人来银行办事，他不会用机器，我耐心地教了他很多遍。后来他专门给我们银行打电话，说我服务得好。经理在会上说了这件事，我觉得非常开心。
问：马红在哪儿工作？
答：银行
错：医院
错：学校
问：马红为什么喜欢这份工作？
答：能帮助别人解决问题
错：工作很简单
错：工资很高
问：那位老人为什么打电话感谢马红？
答：马红耐心地教他
错：马红送他回家
错：马红请他吃饭

文：现在，养宠物的人很多。宠物不但可以陪人，还能让人心情变好。特别是一个人住的老人，养一只猫，每天的日子会更有意思。但是，养宠物也有很多问题，比如每天要给宠物吃东西、带宠物出去走走，宠物生病了还要带去看医生，又费时间又费钱。所以，养宠物以前，一定要想清楚自己有没有时间和耐心。
问：这段话说，宠物对一个人住的老人有什么好处？
答：让日子更有意思
错：可以帮他们做饭
错：让他们不用去医院
问：养宠物有什么问题？
答：费时间又费钱
错：宠物不能出门
错：宠物不让人睡觉
问：说话人认为养宠物以前要怎么做？
答：想清楚有没有时间和耐心
错：先去看医生
错：问问邻居的看法

文：上个星期六，我和几个朋友去城市北边爬山。我们早上六点就出发了，坐了两个小时的车才到山下。山不太高，但是路很难走，我们爬了三个多小时才到上面。在山上，我们看到了非常美的风景，大家都觉得很值得。下山的时候突然下起了大雨，我们都没带雨衣，衣服全都是水。虽然很累，但这是一次我不会忘记的旅游。
问：他们坐了多长时间的车？
答：两个小时
错：三个多小时
错：六个小时
问：下山的时候发生了什么？
答：下大雨了
错：有人生病了
错：车坏了
问：说话人觉得这次爬山怎么样？
答：不会忘记
错：一点儿意思也没有
错：不值得去

文：很多学生都有这样的经历：考试前一天晚上不睡觉，一直复习到早上。其实，这样做效果并不好。研究发现，人睡觉的时候，脑子会把白天学过的东西放好，帮助我们记住。如果不睡觉，第二天考试的时候脑子不清楚，反而考不好。所以，考试前一天最好早点儿睡觉，复习要放在每天，不要等到最后一天。这样才能有好的成绩。
问：考试前不睡觉复习，效果怎么样？
答：效果不好
错：效果很好
错：跟睡觉一样
问：研究发现，睡觉的时候脑子会做什么？
答：把白天学过的东西放好
错：完全休息
错：想明天的事
问：说话人认为应该怎么准备考试？
答：每天复习，考前早点儿睡
错：考前一天多复习
错：考前多喝咖啡

文：我的奶奶今年七十五岁了，她最近在学用智能手机。刚学的时候，她打电话都不会，常常让我教她。现在，她已经会用手机发信息、看新闻，还会和远方的亲戚视频聊天了。她还学会了在网上买东西，上个星期她在网上给我买了一件衣服，我特别感动。奶奶常说，学习什么时候都不晚，只要你想学。我觉得她说得很对。
问：奶奶最近在学什么？
答：用智能手机
错：用电脑
错：做菜
问：奶奶上个星期做了什么？
答：在网上给说话人买了衣服
错：去看了远方的亲戚
错：买了一个新手机
问：奶奶的话是什么意思？
答：什么时候学习都可以
错：老人不应该学习
错：学习要早

文：我们公司每年都会带员工去旅游。今年我们去了海南，在那里住了五天。白天我们在海边游泳、玩水，晚上一起吃海鲜、唱歌。这次旅游不但让大家心情变好了，也让同事的关系更好了。以前很多同事只在工作的时候说话，现在大家都成了好朋友，工作的时候也更愿意互相帮助了。经理说，明年还要带大家出去玩。
问：今年公司去哪儿旅游了？
答：海南
错：北京
错：西安
问：他们在那里住了几天？
答：五天
错：三天
错：七天
问：这次旅游有什么好处？
答：同事的关系更好了
错：大家学会了游泳
错：公司赚了很多钱

文：很多城市的交通问题都很大，特别是上下班的时候，路上经常堵车。为了解决这个问题，一些城市让大家多坐公共汽车和地铁，还在路边放了很多共享自行车。用手机就能打开这些自行车，用完以后放在路边就可以了，非常方便，价格也很便宜。这样不但能减少堵车，也能保护环境，大家还能锻炼身体。
问：这段话说的是什么问题？
答：交通问题
错：环境问题
错：工作问题
问：城市为了解决这个问题，让大家做什么？
答：坐公共交通，骑共享自行车
错：买新车
错：在家工作
问：关于共享自行车，可以知道什么？
答：用手机就能打开
错：必须放回原来的地方
错：价格很贵

文：小李是我的大学同学，他的性格很特别。他做事非常认真，每件事都要做到最好。有一次，我们一起做一个作业，本来已经完成了，可是他觉得还有一个地方不够好，又写了一个晚上。有的同学觉得他太认真了，可是老师很喜欢他这一点。毕业以后，他进了一家很有名的公司，现在已经是部门经理了。我们都为他高兴。
问：小李的性格有什么特点？
答：做事非常认真
错：很爱开玩笑
错：做事不认真
问：老师觉得小李怎么样？
答：很喜欢他的认真
错：他太认真了
错：他不够努力
问：小李现在做什么？
答：部门经理
错：大学老师
错：还在上大学

文：中国人过春节的时候有很多习俗。春节前，人们要打扫房子，把旧东西都收拾出去，意思是把不好的东西都送走。春节前一天的晚上，一家人要在一起吃饭，北方人一般吃饺子。春节的时候，大人还会给孩子红包，里面放着钱，是对孩子的祝福。现在，虽然很多习俗有了变化，但是一家人在一起仍然是最重要的。
问：春节前打扫房子是什么意思？
答：把不好的东西送走
错：让房子更漂亮
错：准备请客人
问：北方人春节前一天晚上一般吃什么？
答：饺子
错：面条
错：米饭
问：说话人认为春节最重要的是什么？
答：一家人在一起
错：给孩子红包
错：打扫房子

文：去年我决定不再抽烟。我抽了十年烟，每天要抽一包。刚不抽的时候特别难，我经常想抽，心情也很不好。我的妻子一直陪着我，每次我想抽烟的时候，她就陪我出去走一走，跟我聊聊天。三个月以后，我终于不想抽了。现在我的身体比以前好多了，早上起来也觉得舒服了，还少花了不少钱。我非常感谢我的妻子。
问：说话人抽了多少年烟？
答：十年
错：三年
错：一年
问：说话人想抽烟的时候，妻子会怎么做？
答：陪他出去走走
错：跟他吵架
错：给他吃东西
问：不抽烟以后，说话人有什么变化？
答：身体好多了
错：心情更不好了
错：花的钱更多了

文：我们学校每年五月都会举行运动会。今年我参加了一千五百米跑。为了准备比赛，我每天放学以后都去学校的运动场练习一个小时。比赛那天，我前面跑得很快，可是最后的时候我已经没有力气了，后面的两个人跑到了我前面，我得了第三名。虽然没有拿到第一，但是我已经努力了，我对自己的成绩很满意。
问：学校什么时候举行运动会？
答：每年五月
错：每年十月
错：每年三月
问：说话人在比赛中得了第几名？
答：第三名
错：第一名
错：第二名
问：说话人对自己的成绩怎么看？
答：很满意
错：很难过
错：很生气
`,
  },
};
