// The dialogues, talks and passages of HSK 4 with their questions (docs/chinese-curriculum.md §8.5), written for this package in the characters of the levels it tests; none is taken from a test.

import type { ComprehensionData } from "../comprehension.ts";

/** comprehension are the dialogues and passages of HSK 4. */
export const comprehension: ComprehensionData = {
  dialogues: {
    short: `
女：你的胃又疼了？是不是又没准时吃饭？
男：最近工作太多，中午常常忘了吃，医生也说我要注意。
问：男的胃疼可能是因为什么？
据：女的问是不是又没准时吃饭，男的说“中午常常忘了吃”。 | The woman asks if he skipped meals again, and he says he often forgets lunch.
答：没有准时吃饭
错：吃得太多 | 他是忘了吃，不是吃得太多。 | He forgets to eat, not overeats.
错：喝了太多酒 | 对话没有说酒。 | Alcohol is never mentioned.
错：睡得太晚 | 对话没有说睡觉。 | Sleep is never mentioned.

女：这次去上海，你打算坐飞机还是坐高铁？
男：高铁吧，虽然慢一点儿，但是不用提前两个小时到。
问：男的为什么选择坐高铁？
据：男的说“虽然慢一点儿，但是不用提前两个小时到”。 | The man says it is a bit slower but needs no arriving two hours early.
答：不用提前很久到
错：高铁更快 | 他说高铁“慢一点儿”。 | He says the train is slower.
错：高铁票便宜很多 | 他没有说票价。 | He does not mention fares.
错：他怕坐飞机 | 他没有说怕坐飞机。 | He does not say he fears flying.

女：你在网上看到的那个消息是真的吗？
男：我查了一下，是假的，很多人都被骗了。
问：男的认为那个消息怎么样？
据：男的说“我查了一下，是假的”。 | The man says he checked and it is false.
答：是假的
错：是真的 | 他说是假的。 | He says it is false.
错：还不清楚 | 他查清楚了，是假的。 | He checked and found it false.
错：很有意思 | 他说很多人被骗了，不是有意思。 | He says many were fooled, not that it is interesting.

女：我们的航班延误了，要晚三个小时才能起飞。
男：那我们先去吃点儿东西，再找个地方休息一下吧。
问：他们现在最可能在哪儿？
据：女的说“我们的航班延误了，要晚三个小时才能起飞”。等航班起飞，就是在机场。 | The woman says their flight is delayed three hours; waiting for a flight means they are at the airport.
答：机场
错：火车站 | 航班是飞机，不在火车站。 | Flights leave from airports, not stations.
错：饭馆 | 男的说先去吃东西，说明他们还不在饭馆。 | He suggests going to eat, so they are not in a restaurant.
错：宾馆 | 男的说再找地方休息，说明还不在宾馆。 | He suggests finding a place to rest, so they are not at a hotel.

女：听说你辞职了？那家公司的工资不是很高的吗？
男：工资是不错，但是每天加班，我连陪孩子的时间都没有。
问：男的为什么辞职？
据：男的说“每天加班，我连陪孩子的时间都没有”。 | The man says daily overtime left him no time with his child.
答：没时间陪孩子
错：工资太低 | 他说工资“是不错”。 | He says the pay was good.
错：和经理吵架了 | 对话没有说吵架。 | No quarrel is mentioned.
错：公司离家太远 | 对话没有说路远。 | Distance is never mentioned.

女：这张画是哪个朝代的？看起来很古老。
男：是唐代的，已经有一千多年的历史了。
问：这张画是哪个朝代的？
据：男的说“是唐代的”。 | The man says it is from the Tang.
答：唐代
错：明代 | 他说的是唐代，不是明代。 | He says Tang, not Ming.
错：清代 | 他说的是唐代，不是清代。 | He says Tang, not Qing.
错：汉代 | 他说的是唐代，不是汉代。 | He says Tang, not Han.

女：你最近怎么总是失眠？是不是压力太大了？
男：可能是吧，下个月就要考试了，我很紧张。
问：男的为什么失眠？
据：男的说“下个月就要考试了，我很紧张”。 | The man says the exam is next month and he is nervous.
答：考试压力大
错：喝了咖啡 | 他没有说咖啡。 | He does not mention coffee.
错：生病了 | 他没有说生病。 | He does not say he is ill.
错：房间太吵 | 他没有说吵。 | He does not mention noise.

女：这台冰箱打完折以后多少钱？
男：原价三千，打八折，再减两百，一共两千二。
问：这台冰箱最后多少钱？
据：男的说“原价三千，打八折，再减两百，一共两千二”。三千打八折是两千四，再减两百是两千二。 | He says three thousand at twenty per cent off is 2,400, less two hundred is 2,200.
答：两千二
错：两千四 | 两千四是打完八折、还没减两百的价钱。 | 2,400 is after the discount but before the two hundred off.
错：三千 | 三千是原价。 | Three thousand is the original price.
错：两千 | 两千是多减了，男的说的是两千二。 | Two thousand takes off too much; he says 2,200.

女：你的腿怎么了？走路怎么一拐一拐的？
男：昨天踢足球的时候摔了一下，不过医生说骨头没事。
问：关于男的，可以知道什么？
据：男的说“不过医生说骨头没事”。 | The man says the doctor said the bone is fine.
答：骨头没有问题
错：腿断了 | 骨头没事，腿没断。 | The bone is fine, so it is not broken.
错：昨天在打篮球 | 他说的是踢足球，不是篮球。 | He says football, not basketball.
错：没去看医生 | 他说“医生说”，说明看过医生。 | He quotes the doctor, so he saw one.

女：这个周六的比赛你去看吗？
男：当然去，我最喜欢的队一定能进决赛。
问：男的对他喜欢的队是什么态度？
据：男的说“我最喜欢的队一定能进决赛”。 | The man says his favourite team will surely reach the final.
答：很有信心
错：很失望 | 他说一定能进决赛，不是失望。 | He says they will surely go through.
错：不感兴趣 | 他说“当然去”，很感兴趣。 | He says of course he will go.
错：很担心 | 他说一定能进，不担心。 | He says surely, so no worry.

女：你觉得这个新手机怎么样？
男：样子很好看，就是电池不太好，一天要充两次电。
问：男的觉得新手机有什么问题？
据：男的说“就是电池不太好，一天要充两次电”。 | The man says only the battery is poor; it needs charging twice a day.
答：电池不好
错：样子不好看 | 他说“样子很好看”。 | He says it looks good.
错：价格太贵 | 他没有说价钱。 | He does not mention price.
错：屏幕太小 | 他没有说屏幕。 | He does not mention the screen.

女：我想给我父亲买一份生日礼物，你有什么建议吗？
男：你父亲不是喜欢下棋吗？送他一个好棋盘吧。
问：男的建议送什么？
据：男的说“送他一个好棋盘吧”。 | The man suggests a good chessboard.
答：一个棋盘
错：一本书 | 他说的是棋盘，不是书。 | He says a chessboard, not a book.
错：一块手表 | 他说的是棋盘，不是手表。 | He says a chessboard, not a watch.
错：一瓶酒 | 他说的是棋盘，不是酒。 | He says a chessboard, not wine.

女：这条路怎么又堵了？我们会不会迟到？
男：别着急，前面路口向右拐，可以走另一条路。
问：男的打算怎么做？
据：男的说“前面路口向右拐，可以走另一条路”。 | The man says turn right at the junction ahead and take another road.
答：走另一条路
错：在这里等 | 他要换路，不是等。 | He will reroute, not wait.
错：下车走路 | 他没有说下车。 | He does not say get out.
错：换坐地铁 | 他没有说地铁。 | He does not mention the underground.

女：您好，我想把这些人民币兑换成美元。
男：好的，请给我看一下您的护照。
问：女的想做什么？
据：女的说“我想把这些人民币兑换成美元”。兑换就是换钱。 | The woman wants to exchange yuan for dollars, that is, change money.
答：换钱
错：办护照 | 护照是男的要看的，她不是办护照。 | The passport is what he asks to see, not what she applies for.
错：存钱 | 她是兑换，不是存钱。 | She exchanges, not deposits.
错：买机票 | 她没有说机票。 | She does not mention tickets.

女：今天的雾太大了，开车一定要慢一点儿。
男：放心，我会注意的，到了公司给你发消息。
问：今天的天气怎么样？
据：女的说“今天的雾太大了”。 | The woman says the fog is very thick today.
答：雾很大
错：下大雨 | 她说的是雾，不是雨。 | She says fog, not rain.
错：刮大风 | 她说的是雾，不是风。 | She says fog, not wind.
错：非常热 | 她没有说热。 | She does not mention heat.

女：你怎么对这个工作这么感兴趣？
男：因为可以去不同的城市出差，正好我喜欢旅游。
问：男的为什么对这个工作感兴趣？
据：男的说“因为可以去不同的城市出差，正好我喜欢旅游”。 | The man says he can travel to different cities, and he loves travel.
答：可以去不同的城市
错：工资很高 | 他没有说工资。 | He does not mention pay.
错：离家很近 | 要出差去别的城市，不是离家近。 | It involves travel, not being near home.
错：同事很好 | 他没有说同事。 | He does not mention colleagues.

女：听说你最近在学弹琴？难不难？
男：对，我小时候就想学，现在终于有机会了。
问：男的最近在学什么？
据：女的问“听说你最近在学弹琴”，男的说“对”。 | The woman asks if he is learning to play, and he says yes.
答：弹琴
错：唱歌 | 是弹琴，不是唱歌。 | Playing, not singing.
错：跳舞 | 是弹琴，不是跳舞。 | Playing, not dancing.
错：画画 | 是弹琴，不是画画。 | Playing, not painting.

女：这个药一天吃几次？饭前吃还是饭后吃？
男：一天三次，每次两片，要在饭后半小时吃。
问：药应该什么时候吃？
据：男的说“要在饭后半小时吃”。 | The man says half an hour after meals.
答：饭后半小时
错：饭前半小时 | 是饭后，不是饭前。 | After, not before.
错：睡觉以前 | 他没有说睡觉以前。 | He does not say at bedtime.
错：早上起床以后 | 他没有说起床以后。 | He does not say on rising.

女：你们公司明年要在南方建一个新工厂？
男：是的，那边交通方便，工人也很容易招到。
问：公司为什么要在南方建工厂？
据：男的说“那边交通方便，工人也很容易招到”。 | The man says transport is convenient and workers easy to hire.
答：交通方便，容易招工人
错：那边的东西便宜 | 他没有说东西便宜。 | He does not mention prices.
错：经理是南方人 | 他没有说经理。 | He does not mention a manager.
错：那边天气好 | 他没有说天气。 | He does not mention weather.

女：我昨天在博物馆看到了很多古代的雕刻，太美了。
男：是吗？我早就想去了，下次我们一起去吧。
问：男的是什么意思？
据：男的说“我早就想去了，下次我们一起去吧”。 | The man says he has long wanted to go and suggests going together.
答：想和女的一起去博物馆
错：他去过很多次了 | 他说早就想去，说明还没去过。 | He has long wanted to go, so he has not been.
错：他不喜欢博物馆 | 他想去，是喜欢的。 | He wants to go, so he likes them.
错：他觉得雕刻不美 | 他没有说雕刻不美。 | He does not say they are ugly.

女：你孩子的感冒现在好了吗？
男：好多了，不发烧了，就是还不想吃东西。
问：孩子现在怎么样？
据：男的说“不发烧了，就是还不想吃东西”。 | The man says the fever is gone, but the child still does not want to eat.
答：还不想吃东西
错：还在发烧 | 他说“不发烧了”。 | He says no fever now.
错：完全好了 | 还不想吃东西，没有完全好。 | Still not eating, so not fully well.
错：住院了 | 他没有说住院。 | He does not mention hospital.

女：这家公司的股票最近涨了不少，你买了吗？
男：没有，我对投资不太了解，不敢随便买。
问：男的为什么没买股票？
据：男的说“我对投资不太了解，不敢随便买”。 | The man says he knows little about investing and dare not buy rashly.
答：不了解投资
错：没有钱 | 他没有说没钱。 | He does not say he lacks money.
错：股票跌了 | 女的说股票“涨了不少”。 | The woman says the shares rose.
错：他买过但亏了 | 他说“没有”买。 | He says he did not buy.

女：你上次说的那本小说我看完了，结局太让人吃惊了。
男：是吧？我第一次看的时候也完全没想到。
问：他们觉得小说的结局怎么样？
据：女的说“结局太让人吃惊了”，男的说“我第一次看的时候也完全没想到”。 | She says the ending was very surprising; he says he did not see it coming either.
答：让人吃惊
错：很无聊 | 让人吃惊，不是无聊。 | Surprising, not dull.
错：很平常 | 让人吃惊，不是平常。 | Surprising, not ordinary.
错：太长了 | 他们没有说长短。 | They do not mention length.

女：星期六我们去城外骑车，你一起来吗？
男：我很想去，可是我得在家准备下个星期的面试。
问：男的星期六要做什么？
据：男的说“我得在家准备下个星期的面试”。 | The man says he must prepare at home for next week's interview.
答：准备面试
错：去城外骑车 | 骑车是女的的安排，他去不了。 | Cycling is her plan; he cannot go.
错：去上班 | 他没有说上班。 | He does not mention work.
错：去看父母 | 他没有说父母。 | He does not mention his parents.

女：你的头发怎么这么短了？
男：天气热了，短头发凉快一些。
问：男的头发为什么变短了？
据：男的说“天气热了，短头发凉快一些”。 | The man says it is hot and short hair is cooler.
答：天气热
错：工作需要 | 他没有说工作。 | He does not mention work.
错：女朋友让他这样 | 他没有说女朋友。 | He does not mention a girlfriend.
错：长头发不好看 | 他没有说长头发不好看。 | He does not call long hair ugly.

女：这件事是我误会你了，真对不起。
男：没关系，说清楚就好了，我们还是好朋友。
问：男的是什么态度？
据：男的说“没关系，说清楚就好了，我们还是好朋友”。 | The man says it is fine; now it is cleared up, they are still friends.
答：原谅了女的
错：很生气 | 他说没关系，不生气。 | He says it is fine, so he is not angry.
错：不想再跟女的做朋友 | 他说还是好朋友。 | He says they are still friends.
错：觉得是自己错了 | 误会是女的说她自己的，男的没有说自己错。 | The misunderstanding is hers by her own word.

女：这个城市的冬天真冷，水都冻上了。
男：是啊，今天零下十五度，出门一定要多穿点儿。
问：今天的气温是多少？
据：男的说“今天零下十五度”。 | The man says it is minus fifteen today.
答：零下十五度
错：零下五度 | 他说的是十五度，前面有“十”。 | He says fifteen, with the 十.
错：十五度 | 他说的是零下，不是零上。 | He says below zero.
错：零度 | 他说的是零下十五，不是零度。 | He says minus fifteen, not zero.

女：你参加的那个培训班怎么样？
男：老师讲得很好，我学到了很多实际工作中用得上的东西。
问：男的觉得培训班怎么样？
据：男的说“我学到了很多实际工作中用得上的东西”。 | The man says he learned much that is useful at work.
答：很有用
错：老师讲得不好 | 他说“老师讲得很好”。 | He says the teacher was good.
错：太难了 | 他没有说难。 | He does not say it was hard.
错：没意思 | 他学到了很多，不是没意思。 | He learned much, so it was not dull.

女：警察同志，我的自行车被偷了。
男：别着急，您先说说是在什么地方、什么时候不见的。
问：女的发生了什么事？
据：女的说“我的自行车被偷了”。 | The woman says her bicycle was stolen.
答：自行车被偷了
错：钱包被偷了 | 被偷的是自行车，不是钱包。 | The bike was stolen, not a purse.
错：迷路了 | 她没有迷路。 | She is not lost.
错：手机被偷了 | 被偷的是自行车，不是手机。 | The bike was stolen, not a phone.

女：你今天怎么这么高兴？有什么好事？
男：我申请的那个奖学金批下来了，明年的学费不用担心了。
问：男的为什么高兴？
据：男的说“我申请的那个奖学金批下来了”。 | The man says his scholarship was approved.
答：得到了奖学金
错：找到了工作 | 他说的是奖学金，不是工作。 | He says a scholarship, not a job.
错：考试考得好 | 他没有说考试。 | He does not mention exams.
错：明年不用上学 | 奖学金是交明年的学费，他明年还上学。 | The scholarship pays next year's fees, so he will study.

女：你这次去旅游，打算住宾馆还是住朋友家？
男：住朋友家，他家离景点很近，还能省不少钱。
问：男的为什么住朋友家？
据：男的说“他家离景点很近，还能省不少钱”。 | The man says his friend lives near the sights and it saves money.
答：离景点近，能省钱
错：宾馆没有房间了 | 他没有说宾馆没房间。 | He does not say hotels are full.
错：朋友一定要他住 | 他没有说朋友一定要他住。 | He does not say the friend insisted.
错：他不喜欢住宾馆 | 他没有说不喜欢宾馆。 | He does not say he dislikes hotels.

女：这个月的销售情况怎么样？
男：比上个月增长了百分之二十，比我们预计的还好。
问：这个月的销售情况怎么样？
据：男的说“比我们预计的还好”。 | The man says it beat their forecast.
答：比预计的好
错：比上个月差 | 比上个月增长了，不是差。 | It grew over last month.
错：跟预计的一样 | 比预计的还好，不是一样。 | Better than forecast, not equal.
错：增长了百分之十 | 他说的是百分之二十，不是十。 | He says twenty per cent, not ten.

女：你看过新闻吗？南方好几个地方发洪水了。
男：看了，已经有很多人去帮忙救灾了。
问：南方发生了什么？
据：女的说“南方好几个地方发洪水了”。 | The woman says floods have hit several places in the south.
答：洪水
错：地震 | 她说的是洪水，不是地震。 | She says floods, not an earthquake.
错：大旱 | 洪水和大旱正好相反。 | Floods are the opposite of drought.
错：大雪 | 她说的是洪水，不是雪。 | She says floods, not snow.
`,
    long: `
女：小张，你最近脸色不太好，是不是身体不舒服？
男：我这几天总是头疼，晚上也睡不好。
女：那你去医院检查过了吗？
男：还没有，我觉得休息一下就好了。
女：别大意，头疼的原因很多，最好让医生看看。
男：好吧，那我明天请半天假去医院。
问：男的最近怎么了？
据：男的说“我这几天总是头疼，晚上也睡不好”。 | The man says he keeps having headaches and sleeps badly.
答：头疼，睡不好
错：胃疼 | 他说的是头疼，不是胃疼。 | He says head, not stomach.
错：发烧 | 他没有说发烧。 | He does not mention fever.
错：腿疼 | 他说的是头疼，不是腿疼。 | He says head, not leg.
问：女的建议男的做什么？
据：女的说“最好让医生看看”。 | The woman says he had better see a doctor.
答：去医院检查
错：多休息几天 | 休息是男的自己的想法，女的让他别大意。 | Rest is his own idea; she tells him not to be careless.
错：多吃药 | 她没有说吃药。 | She does not mention medicine.
错：多锻炼 | 她没有说锻炼。 | She does not mention exercise.
问：男的打算什么时候去医院？
据：男的说“那我明天请半天假去医院”。 | The man says he will take half a day off tomorrow.
答：明天
错：今天下午 | 他说的是明天，不是今天。 | He says tomorrow, not today.
错：下个星期 | 他说的是明天，不是下个星期。 | He says tomorrow, not next week.
错：不去了 | 他最后说“好吧”，要去。 | He finally agrees to go.

男：您好，我想预订下周五去广州的机票。
女：好的，您要上午的还是下午的？
男：最好是上午，我下午两点要在广州开会。
女：上午有八点和十点的两个航班，八点的还有折扣。
男：那就八点的吧，便宜一点儿，时间也合适。
问：男的要去哪儿？
据：男的说“我想预订下周五去广州的机票”。 | The man wants a ticket to Guangzhou next Friday.
答：广州
错：上海 | 他说的是广州，不是上海。 | He says Guangzhou, not Shanghai.
错：北京 | 他说的是广州，不是北京。 | He says Guangzhou, not Beijing.
错：南京 | 他说的是广州，不是南京。 | He says Guangzhou, not Nanjing.
问：男的为什么想要上午的航班？
据：男的说“我下午两点要在广州开会”。 | The man says he has a meeting in Guangzhou at two.
答：下午要开会
错：上午的便宜 | 打折的是八点那班，不是他要上午的原因。 | The discount is on the eight o'clock, not why he wants a morning flight.
错：下午没有航班 | 女的问上午还是下午，说明下午有航班。 | She offers afternoon flights too.
错：他早上起得早 | 他没有说起得早。 | He does not mention rising early.
问：男的最后选了几点的航班？
据：男的说“那就八点的吧，便宜一点儿，时间也合适”。 | The man takes the eight o'clock: cheaper and well timed.
答：八点
错：十点 | 十点是另一个航班，没有折扣。 | Ten is the other flight, without a discount.
错：两点 | 两点是开会的时间。 | Two is the meeting.
错：九点 | 没有九点的航班。 | There is no nine o'clock flight.

女：你看到公司的通知了吗？下个月开始实行新的上班时间。
男：看到了，以后九点半上班，六点半下班。
女：晚半个小时上班很好的，早上不用那么着急了。
男：可是下班也晚了，我接孩子会来不及。
女：你可以跟经理说说你的情况，也许能改一下。
问：新的上班时间是几点？
据：男的说“以后九点半上班，六点半下班”。 | The man says work will start at half past nine and end at half past six.
答：九点半
错：九点 | 九点后面还有“半”。 | There is 半 after nine.
错：八点半 | 女的说晚半个小时上班，九点半是新的，八点半不对。 | She says half an hour later, so it is half nine.
错：六点半 | 六点半是下班的时间。 | Half past six is when work ends.
问：男的担心什么？
据：男的说“可是下班也晚了，我接孩子会来不及”。 | The man says finishing later means he will be late picking up his child.
答：来不及接孩子
错：早上起不来 | 晚上班就不用早起。 | Starting later means no early rise.
错：工资会减少 | 他没有说工资。 | He does not mention pay.
错：工作做不完 | 他没有说工作做不完。 | He does not mention unfinished work.
问：女的建议男的怎么做？
据：女的说“你可以跟经理说说你的情况，也许能改一下”。 | The woman suggests telling the manager his situation.
答：跟经理说说情况
错：换一个工作 | 她没有说换工作。 | She does not suggest a new job.
错：让别人接孩子 | 她没有说让别人接。 | She does not suggest someone else collect the child.
错：早点儿下班 | 她让他跟经理说，不是自己早走。 | She says ask the manager, not leave early.

男：你去过那家新开的博物馆吗？
女：上星期六刚去过，里面有很多古代的画和书。
男：那里的门票价格贵不贵？
女：不要钱，但是要提前在网上预约，每天只让两千人进去。
男：那我今天晚上就去预约，星期六带孩子去看看。
问：博物馆里有什么？
据：女的说“里面有很多古代的画和书”。 | The woman says it has many ancient paintings and books.
答：古代的画和书
错：现代的电影 | 她说的是古代的画和书，没有电影。 | She says ancient art and books, no films.
错：各种动物 | 她没有说动物。 | She does not mention animals.
错：外国的照片 | 她没有说照片。 | She does not mention photos.
问：关于这个博物馆，可以知道什么？
据：女的说“要提前在网上预约”。 | The woman says one must book online in advance.
答：要提前预约
错：门票很贵 | 她说“不要钱”。 | She says it is free.
错：每天让两万人进去 | 她说的是两千，不是两万。 | She says two thousand, not twenty thousand.
错：星期六不开门 | 男的星期六要带孩子去，开门。 | The man plans Saturday, so it is open.
问：男的打算什么时候去博物馆？
据：男的说“星期六带孩子去看看”。 | The man says he will take his child on Saturday.
答：星期六
错：今天晚上 | 今天晚上是去预约的时间，不是去博物馆。 | Tonight is for booking, not visiting.
错：星期天 | 他说的是星期六，不是星期天。 | He says Saturday, not Sunday.
错：上星期六 | 上星期六是女的去的时间。 | Last Saturday is when she went.

女：你昨天的面试怎么样了？
男：还不错，他们问了我很多专业的问题，我都回答出来了。
女：那他们什么时候通知你结果？
男：说是一个星期以内，如果通过了还有第二次面试。
女：祝你好运，我觉得你一定没问题。
问：男的觉得面试怎么样？
据：男的说“还不错……我都回答出来了”。 | The man says it went well; he answered everything.
答：还不错
错：很难 | 他都回答出来了，没有说难。 | He answered all, not that it was hard.
错：很失望 | 他说还不错，不失望。 | He says it went well.
错：太紧张了 | 他没有说紧张。 | He does not mention nerves.
问：什么时候通知结果？
据：男的说“说是一个星期以内”。 | The man says within a week.
答：一个星期以内
错：明天 | 是一个星期以内，不是明天。 | Within a week, not tomorrow.
错：一个月以后 | 是一个星期以内，不是一个月。 | Within a week, not a month.
错：当天 | 是一个星期以内，不是当天。 | Within a week, not the same day.
问：关于面试，可以知道什么？
据：男的说“如果通过了还有第二次面试”。 | The man says if he passes there is a second interview.
答：通过了还有第二次
错：只有一次 | 还有第二次，不只一次。 | There is a second, so not just one.
错：男的已经被录取了 | 结果还没通知，没有录取。 | No result yet, so not hired.
错：男的没回答出问题 | 他说都回答出来了。 | He says he answered all.

男：这个星期六我们去爬山吧？
女：天气预报说星期六有雷阵雨，爬山不太安全。
男：那我们去看个电影，再去吃中国菜怎么样？
女：好啊，最近有一个关于宇宙的电影，听说很精彩。
男：行，我现在就在网上买票。
问：为什么不去爬山？
据：女的说“天气预报说星期六有雷阵雨，爬山不太安全”。 | The woman says thunderstorms are forecast, making climbing unsafe.
答：星期六有雷阵雨
错：女的很累 | 她没有说累。 | She does not say she is tired.
错：山太高了 | 她没有说山高。 | She does not mention height.
错：男的不喜欢爬山 | 爬山是男的提出的，他喜欢。 | Climbing is his idea.
问：他们星期六打算做什么？
据：男的说“那我们去看个电影，再去吃中国菜怎么样”，女的说“好啊”。 | He suggests a film and Chinese food, and she agrees.
答：看电影，吃中国菜
错：爬山，吃中国菜 | 爬山因为下雨不去了。 | Climbing is off because of rain.
错：在家休息 | 他们要出去，不是在家。 | They are going out.
错：去博物馆 | 他们没有说博物馆。 | They do not mention a museum.
问：那个电影是关于什么的？
据：女的说“最近有一个关于宇宙的电影”。 | The woman says there is a new film about the universe.
答：宇宙
错：历史 | 她说的是宇宙，不是历史。 | She says the universe, not history.
错：爱情 | 她说的是宇宙，不是爱情。 | She says the universe, not romance.
错：动物 | 她说的是宇宙，不是动物。 | She says the universe, not animals.

女：我想在网上开一家店，卖自己做的手工小礼物。
男：好主意，你做的东西那么漂亮，一定有人喜欢。
女：可是我不知道怎么让更多的人看到我的店。
男：你可以在社交网站上发一些照片和视频，吸引粉丝。
女：对，我还可以请朋友们帮我转发。
问：女的想做什么？
据：女的说“我想在网上开一家店，卖自己做的手工小礼物”。 | The woman wants to open an online shop selling her handmade gifts.
答：在网上开店
错：去商店工作 | 她要自己开网店，不是去商店工作。 | She will run her own online shop.
错：学做礼物 | 礼物她已经会做，要卖的是自己做的。 | She already makes the gifts; she wants to sell them.
错：拍电影 | 她没有说拍电影。 | She does not mention films.
问：男的建议女的怎么做？
据：男的说“你可以在社交网站上发一些照片和视频，吸引粉丝”。 | The man suggests posting photos and videos on social media.
答：在社交网站上发照片和视频
错：去商场卖东西 | 她开的是网店，不是去商场。 | Her shop is online, not in a mall.
错：降低价格 | 他没有说降价。 | He does not mention pricing.
错：找人投资 | 他没有说投资。 | He does not mention investors.
问：女的觉得自己可以请朋友们做什么？
据：女的说“我还可以请朋友们帮我转发”。 | The woman says she can ask friends to share her posts.
答：帮她转发
错：帮她做礼物 | 礼物是她自己做的。 | She makes the gifts herself.
错：买她的东西 | 她说的是转发，不是买。 | She says share, not buy.
错：借她钱 | 她没有说借钱。 | She does not mention borrowing.

男：听说你搬家了，新房子怎么样？
女：比以前的大，有三个房间，还有一个阳台。
男：新房子离你上班的地方远吗？
女：有点儿远，坐地铁要五十分钟，不过小区环境很好。
男：环境好最重要，星期天可以在小区里跑步了。
问：新房子有什么？
据：女的说“有三个房间，还有一个阳台”。 | The woman says three rooms and a balcony.
答：三个房间和一个阳台
错：两个房间 | 她说的是三个房间，不是两个。 | She says three rooms, not two.
错：一个花园 | 她说的是阳台，不是花园。 | She says a balcony, not a garden.
错：两个阳台 | 她说的是一个阳台，不是两个。 | She says one balcony, not two.
问：女的上班坐地铁要多长时间？
据：女的说“坐地铁要五十分钟”。 | The woman says fifty minutes by underground.
答：五十分钟
错：十五分钟 | 她说的是五十，不是十五。 | She says fifty, wǔshí, not fifteen.
错：半个小时 | 五十分钟比半个小时长。 | Fifty minutes is longer than half an hour.
错：一个小时 | 五十分钟不到一个小时。 | Fifty minutes is under an hour.
问：女的觉得新房子有什么好处？
据：女的说“不过小区环境很好”。 | The woman says the estate is pleasant.
答：小区环境好
错：离公司近 | 她说“有点儿远”。 | She says it is a bit far.
错：价格便宜 | 她没有说价钱。 | She does not mention price.
错：房间很多 | 房间多是她说的情况，“不过”后面的好处是环境。 | More rooms is a fact she gives, but the good point after 不过 is the setting.

讲：各位观众，欢迎收看今天的天气预报。因为冷空气来了，明天北方大部分地区气温将下降八到十度，并伴有大风。北京明天白天晴转多云，最高气温五度，夜里最低气温零下六度。请大家注意保暖，开车出门要小心。南方地区明天以阴天为主，部分地区有小雨。
问：明天北方的气温会怎么样？
据：预报说“明天北方大部分地区气温将下降八到十度”。 | The forecast says temperatures in most of the north will fall eight to ten degrees.
答：下降八到十度
错：上升八到十度 | 是下降，不是上升。 | A fall, not a rise.
错：没有变化 | 气温要下降，有变化。 | It will fall, so it changes.
错：下降两三度 | 是八到十度，不是两三度。 | Eight to ten degrees, not two or three.
问：北京明天夜里最低气温是多少？
据：预报说北京“夜里最低气温零下六度”。 | The forecast says Beijing's low tonight is minus six.
答：零下六度
错：五度 | 五度是白天的最高气温。 | Five is the daytime high.
错：零下五度 | 是零下六度，不是零下五度。 | Minus six, not minus five.
错：六度 | 是零下，不是零上。 | Below zero, not above.
问：南方明天天气怎么样？
据：预报说“南方地区明天以阴天为主，部分地区有小雨”。 | The forecast says the south will be mostly overcast with light rain in places.
答：阴天，部分地区有小雨
错：晴天 | 南方是阴天，晴转多云说的是北京。 | The south is overcast; clearing to cloudy is Beijing.
错：大风 | 大风说的是北方。 | Wind is for the north.
错：下雪 | 南方是小雨，不是雪。 | The south gets light rain, not snow.

讲：各位乘客请注意，由于前方车站出了问题，本次列车将在这里停车大约二十分钟。想买饮料和食品的乘客，可以去五号车购买。我们对给大家带来的不便表示歉意，感谢大家的理解和支持。列车预计晚点三十分钟到达终点站。
问：列车为什么停车？
据：广播说“由于前方车站出了问题，本次列车将在这里停车大约二十分钟”。 | The announcement says a problem at the station ahead means a twenty-minute stop.
答：前方车站出了问题
错：天气不好 | 广播没有说天气。 | It does not mention weather.
错：有乘客生病了 | 广播没有说乘客生病。 | It does not mention a sick passenger.
错：要让别的车先走 | 广播没有说让车。 | It does not mention giving way.
问：在几号车可以买到饮料和食品？
据：广播说“可以去五号车购买”。 | The announcement says to buy them in car five.
答：五号
错：二号 | 说的是五号，不是二号。 | It says five, not two.
错：三号 | 说的是五号，不是三号。 | It says five, not three.
错：十号 | 说的是五号，不是十号。 | It says five, not ten.
问：列车预计晚点多长时间？
据：广播说“列车预计晚点三十分钟到达终点站”。 | The announcement says arrival will be about thirty minutes late.
答：三十分钟
错：二十分钟 | 二十分钟是在这里停车的时间。 | Twenty minutes is the stop here.
错：十分钟 | 说的是三十分钟，不是十分钟。 | It says thirty, not ten.
错：一个小时 | 说的是三十分钟，不是一个小时。 | It says thirty minutes, not an hour.

讲：同学们，下周三我们学校要举行一次环保活动。上午九点，大家在学校门口见面，然后一起去附近的公园收垃圾。请每个人带一个袋子和一瓶水。活动结束以后，我们会选出表现最好的五名同学，给他们发奖。希望大家都能来参加，用自己的行动保护我们的城市。
问：这次活动是关于什么的？
据：说话人说“下周三我们学校要举行一次环保活动”。 | The speaker says the school will hold an environmental event next Wednesday.
答：环保
错：运动 | 说的是环保，不是运动。 | It says environmental, not sport.
错：唱歌 | 说的是环保，不是唱歌。 | It says environmental, not singing.
错：考试 | 说的是环保，不是考试。 | It says environmental, not an exam.
问：同学们几点在哪儿见面？
据：说话人说“上午九点，大家在学校门口见面”。 | The speaker says meet at the school gate at nine.
答：九点，学校门口
错：九点，公园门口 | 公园是见面以后一起去的地方。 | The park is where they go after meeting.
错：八点，学校门口 | 说的是九点，不是八点。 | It says nine, not eight.
错：十点，教室里 | 说的是学校门口，不是教室。 | It says the school gate, not a classroom.
问：活动结束以后会怎么样？
据：说话人说“我们会选出表现最好的五名同学，给他们发奖”。 | The speaker says the five best students will get prizes.
答：给表现最好的同学发奖
错：大家一起吃饭 | 说话人没有说吃饭。 | No meal is mentioned.
错：去另一个公园 | 说话人没有说另一个公园。 | No second park is mentioned.
错：每个人都有奖 | 只有表现最好的五名有奖，不是每个人。 | Only the top five get prizes.
`,
  },
  passages: {
    short: `
文：很多人觉得只有生病了才需要去医院，其实定期检查身体也很重要。有些病在开始的时候没有什么感觉，等发现的时候往往已经很严重了。
问：这段话主要告诉我们什么？
答：要定期检查身体
错：生病了要多休息
错：不要常去医院
错：有些病治不好

文：小王是一名记者，他每天都要去不同的地方采访。虽然工作很累，但是他觉得能把真实的消息告诉大家，是一件很有意义的事。
问：小王觉得他的工作怎么样？
答：很有意义
错：太简单
错：很无聊
错：不太累

文：现在很多年轻人喜欢用手机支付，出门不带钱包也能买东西。不过，专家提醒大家，要保护好自己的密码，不要随便点不认识的链接，以免被骗。
问：专家提醒大家注意什么？
答：保护密码，不随便点链接
错：出门要带钱包
错：不要用手机买东西
错：多用信用卡

文：长城是中国古代最伟大的工程之一，有两千多年的历史。每年都有很多中外游客来参观，大家都说"不到长城非好汉"。
问：关于长城，可以知道什么？
答：有两千多年的历史
错：是现代建的
错：很少有游客
错：只有中国人去参观

文：我的邻居是一位退休的医生。每个星期天，她都在小区里免费给老人们量血压，告诉他们怎样健康地生活，大家都很尊重她。
问：邻居每个星期天做什么？
答：免费给老人量血压
错：去医院上班
错：教孩子学习
错：带老人去旅游

文：学习一门外语不能只靠背词语和语法，更重要的是多使用。如果有机会，最好多跟说这门语言的人交流，这样进步才快。
问：说话人认为学外语最重要的是什么？
答：多使用
错：背词语
错：学语法
错：找好老师

文：这家公司最近推出了一种新的手机，这种手机的电池可以用三天，价格也不贵，所以一上市就受到了大家的欢迎。
问：新手机为什么受欢迎？
答：电池用得久，价格便宜
错：样子很好看
错：屏幕很大
错：是名牌

文：最近天气变化很大，白天热，晚上冷，很多人感冒了。医生建议大家根据天气及时增减衣服，多喝水，多休息。
问：很多人为什么感冒了？
答：天气变化大
错：吃得太少
错：工作太累
错：不爱运动

文：我小时候最怕的就是打针，每次去医院都会哭。长大以后我当了一名护士，现在每天都要给病人打针。
问：说话人现在做什么工作？
答：护士
错：医生
错：老师
错：病人

文：一个人的态度往往决定他能不能成功。遇到问题的时候，有的人马上不做了，有的人却会想办法解决，后者往往更容易成功。
问：这段话主要是说：
答：态度决定成功
错：问题很多
错：成功很容易
错：不要想办法

文：现在有很多人选择在家工作。这样不但可以节约上下班路上的时间，还可以更好地照顾家人。不过，在家工作也需要很强的自我管理能力。
问：在家工作需要什么？
答：很强的自我管理能力
错：很多钱
错：很大的房子
错：很多同事

文：中国的饮食文化很有特点，各个地方的人爱吃的东西都不一样：南方人爱吃米饭，北方人爱吃面食，还有的地方的人特别爱吃辣的。
问：根据这段话，北方人爱吃什么？
答：面食
错：米饭
错：辣的
错：鱼

文：去年夏天，我们家乡发生了严重的旱灾，好几个月没下雨，很多农作物都死了。政府给农民送去了水和粮食，帮助他们度过了这次灾害。
问：去年夏天家乡发生了什么？
答：旱灾
错：洪水
错：地震
错：大雪

文：我爸爸是一个很节约的人，他的衣服穿了十几年都不愿意换。可是对我们，他从来都很大方，我们想学什么，他都愿意花钱。
问：关于爸爸，可以知道什么？
答：对自己节约，对孩子大方
错：对谁都很大方
错：很喜欢买新衣服
错：不让孩子学东西

文：很多人以为运动多一些就更好，其实运动也要适量。如果运动过度，不但不能锻炼身体，还可能受伤。每个人应该根据自己的身体情况选择运动的时间和方式。
问：说话人对运动的看法是什么？
答：要适量
错：多一些更好
错：少一些更好
错：不需要运动

文：今天的足球比赛非常精彩。上半场两个队都没进球，下半场第七十分钟，我们的队员终于射门成功，最后以一比零赢得了比赛。
问：比赛的结果是什么？
答：一比零，我们的队赢了
错：零比零
错：一比零，我们的队输了
错：二比一

文：现在很多人在网上发自己生活的照片和视频，可是专家提醒，不要把自己的地址、电话这些个人信息发到网上，要注意保护自己的隐私。
问：专家提醒大家注意什么？
答：保护个人隐私
错：多发照片
错：少用电话
错：多交网友

文：我们学校的图书馆有三十多万本书，还有很多外文杂志。图书馆每天早上八点开门，晚上十点关门，考试前还会延长到十一点。
问：考试前图书馆几点关门？
答：十一点
错：十点
错：八点
错：十二点

文：大熊猫的样子很可爱，主要生活在中国西南的山林里。因为人们保护得好，现在大熊猫的数量比以前多了，很多人都去看过大熊猫。
问：大熊猫主要生活在哪里？
答：西南的山林里
错：北方的草地上
错：海边
错：城市里

文：很多人在压力大的时候喜欢吃甜的东西，因为甜食可以让人心情变好。可是吃得太多会让人发胖，所以还是要少吃一点儿。
问：根据这段话，吃太多甜食会怎么样？
答：让人发胖
错：让人心情不好
错：让人压力更大
错：让人睡不着

文：这次面试我准备了很久，可是最后还是没有通过。我有点儿失望，但是我从中学到了很多经验，下次一定能做得更好。
问：说话人现在的心情怎么样？
答：有点儿失望，但还会努力
错：非常高兴
错：以后不想再试了
错：一点儿也不难过

文：我的同事李明以前很胖，去年他开始每天跑步，还改变了饮食习惯，少吃油多的东西。一年下来，他瘦了很多，人也变得很精神。
问：李明是怎么变瘦的？
答：跑步和改变饮食
错：吃药
错：去医院
错：少睡觉

文：这座桥建于一百多年前，是这个城市最古老的桥。虽然已经很旧了，但是现在每天还有很多人从桥上走过。
问：关于这座桥，可以知道什么？
答：有一百多年的历史
错：是新建的
错：现在不能走了
错：是城市最长的桥

文：父母是孩子的第一位老师，孩子会学父母的一言一行。如果父母喜欢读书，孩子也往往会喜欢读书。
问：这段话主要是说：
答：孩子会学父母
错：孩子不爱读书
错：老师很重要
错：父母应该多工作

文：我以前每天开车上班，可是路上经常堵车，有时候一个多小时才能到公司。后来我改坐地铁，只要四十分钟，而且还能在车上看看书。
问：说话人为什么改坐地铁？
答：开车常堵车
错：没有车了
错：地铁更便宜
错：公司搬家了

文：网上购物虽然方便，但是也有缺点。比如，你看不到真实的商品，收到以后可能会发现和图片上的不一样，退换也不太方便。
问：根据这段话，网上购物有什么缺点？
答：看不到真实的商品
错：价格太贵
错：东西太少
错：送得太慢

文：这家饭馆的老板是一位六十多岁的老人。他做菜已经四十多年了，每道菜都是自己亲手做的。很多客人都是从很远的地方专门来吃他做的菜。
问：关于老板，可以知道什么？
答：做菜做了四十多年
错：今年四十多岁
错：不会做菜
错：饭馆客人很少

文：最近我迷上了画画，每天下班以后都要画一个小时。虽然画得不太好，但是画画的时候我觉得很放心，什么不开心的事都忘了。
问：画画对说话人有什么作用？
答：让他忘了不开心的事
错：让他赚钱
错：让他找到工作
错：让他更累

文：科学家发现，每天晒十五分钟左右的太阳对身体有好处，可以帮助人们吸收营养，让骨头更健康。但是夏天中午的阳光太强，最好不要长时间晒。
问：科学家认为每天晒多久太阳最好？
答：十五分钟左右
错：一个小时
错：五分钟
错：中午一直晒

文：我第一次来中国的时候，一句汉语也不会说，连买东西都不容易。现在我在中国已经住了五年了，不但能和中国人自由地交流，还交了很多中国朋友。
问：说话人在中国住了多久？
答：五年
错：一年
错：三年
错：十年

文：这个城市的空气污染很严重，特别是冬天。为了改善空气质量，政府决定减少工厂的数量，并鼓动市民多坐公共交通。
问：政府为什么要减少工厂？
答：为了改善空气质量
错：工厂太旧了
错：工人太少
错：工厂赚不到钱

文：我奶奶虽然已经八十岁了，但是她每天都坚持读报纸、看新闻，对国家大事比我们年轻人还了解。她说，人老了，脑子不能老。
问：奶奶为什么每天读报纸？
答：让脑子不老
错：她没有电视
错：她在报社工作
错：她喜欢报纸上的照片
`,
    long: `
文：我在一家旅行社工作已经五年了，主要负责安排游客出国旅游。这份工作让我有机会去很多国家，看到了不同的风景，了解了不同的文化。但是，这份工作也很累。旅游最忙的季节，我常常一个月都不能回家，有时候还要处理游客遇到的各种问题，比如护照找不到了、生病了等等。虽然很累，但是每次看到游客满意的笑容，我就觉得这些都值得。
问：说话人在哪儿工作？
答：旅行社
错：机场
错：宾馆
错：医院
问：关于这份工作，可以知道什么？
答：最忙的季节很累
错：一直很简单
错：不能出国
错：工资很低
问：什么时候说话人觉得这些都值得？
答：看到游客满意的时候
错：拿到工资的时候
错：回家的时候
错：去新国家的时候

文：现在，很多城市都出现了共享经济，比如共享单车、共享汽车、共享充电器等。人们用手机扫一下码，就可以使用这些东西，用完以后根据时间付钱。共享经济给人们带来了很多方便，也减少了浪费。但是，共享经济也带来了一些问题，比如有些人不爱护共享单车，用完随便放在路中间，给城市的交通和环境带来了问题。所以，要让共享经济更好地发展，需要每个人都守规则。
问：怎样使用共享的东西？
答：用手机扫码
错：去商店买
错：先交很多钱
错：打电话预约
问：共享经济带来了什么问题？
答：有人随便放单车
错：价格太贵
错：东西太少
错：很难使用
问：说话人认为怎样让共享经济更好地发展？
答：每个人都守规则
错：多建工厂
错：不要共享单车了
错：提高价格

文：失眠是现代人常见的问题。失眠的原因有很多，比如工作压力大、睡前玩手机、喝咖啡和茶等。长期失眠会让人记不住东西，心情也不好，还可能引起其他的病。医生建议，想要睡个好觉，最好每天准时睡觉和起床，睡前一个小时不要看手机，下午以后不要喝咖啡。如果失眠的情况很严重，就应该去医院看看。
问：下面哪个不是这段话说到的失眠原因？
答：吃得太多
错：工作压力大
错：睡前玩手机
错：喝咖啡
问：长期失眠会怎么样？
答：记不住东西，心情不好
错：让人变胖
错：让人眼睛变好
错：没有什么关系
问：医生建议睡前多长时间不要看手机？
答：一个小时
错：半个小时
错：两个小时
错：十分钟

文：小张大学毕业以后，没有像其他同学一样去大城市找工作，而是回到了自己的家乡，一个小山村。他发现家乡的水果质量很好，但是因为交通不方便，农民们很难卖出去。于是，他在网上开了一家店，专门卖家乡的水果。刚开始买的人不多，后来他在网上发了很多介绍家乡的视频，吸引了很多人。现在，他的店每个月能卖出好几万块钱的水果，村里农民的收入也提高了。
问：小张大学毕业以后做了什么？
答：回到了家乡
错：去大城市工作
错：出国了
错：继续读书
问：农民的水果以前为什么很难卖出去？
答：交通不方便
错：质量不好
错：价格太贵
错：种得太少
问：小张的店是怎么吸引顾客的？
答：发介绍家乡的视频
错：降低价格
错：送礼物
错：请明星做广告

文：中国有很多传统节日，中秋节是其中很重要的一个。中秋节在每年农历八月十五，这一天的月亮是一年中最亮的。在这一天，人们会和家人一起吃月饼、看月亮。在外地工作和学习的人，如果不能回家，也会给家人打电话，表达自己的想念。对中国人来说，中秋节最重要的意义，就是一家人能在一起，所以这一天很多人都会想办法回家。
问：中秋节在什么时候？
答：农历八月十五
错：农历一月一日
错：农历五月五日
错：农历九月九日
问：中秋节人们会做什么？
答：吃月饼，看月亮
错：吃饺子，看电视
错：去爬山
错：去海边游泳
问：对中国人来说，中秋节最重要的意义是什么？
答：一家人能在一起
错：可以放假旅游
错：可以吃很多东西
错：可以买新衣服

文：很多父母都希望自己的孩子成功，所以从孩子很小的时候就让他们学习各种东西：弹琴、画画、外语、游泳。孩子们每个星期六和星期天都在不同的培训班之间跑来跑去，没有时间玩。专家认为，这样做不一定好。孩子也需要时间玩，在玩的过程中，他们可以学会交朋友、发现自己的兴趣。父母应该尊重孩子的兴趣，而不是让他们学所有的东西。
问：很多父母为什么让孩子学很多东西？
答：希望孩子成功
错：孩子自己想学
错：星期天没事做
错：学校要求的
问：专家认为孩子在玩的过程中可以学会什么？
答：交朋友、发现兴趣
错：弹琴
错：说外语
错：考高分
问：专家建议父母怎么做？
答：尊重孩子的兴趣
错：让孩子学更多
错：不让孩子玩
错：让孩子只学外语

文：上个月我第一次一个人去国外旅行。出发以前，我做了很多准备：订好了机票和宾馆，查了当地的天气，还学了几句当地的话。可是到了以后，还是遇到了问题。第一天我就迷路了，手机也没电了。正当我着急的时候，一位当地的老人走过来，虽然我们说的话互相听不懂，但是他用手给我指路，还把我送到了宾馆门口。这次经历让我感受到了不认识的人的善意。
问：出发以前说话人没有做什么准备？
答：买新手机
错：订机票和宾馆
错：查天气
错：学当地的话
问：第一天说话人遇到了什么问题？
答：迷路了，手机没电
错：钱包被偷了
错：生病了
错：宾馆没房间
问：这次经历让说话人感受到了什么？
答：不认识的人的善意
错：旅行很危险
错：外语很重要
错：要多带钱

文：随着科技的发展，人工智能已经进入了我们的生活。比如，手机里的语音助手可以帮我们查天气、记事情；一些医院用人工智能帮助医生看片子，诊断病人的病；还有的工厂用机器人做危险的工作。有人担心人工智能会让很多人失去工作，但是也有人认为，人工智能会创造新的工作机会，关键是人们要不断学习新的技术。
问：根据这段话，人工智能在医院可以做什么？
答：帮助医生诊断
错：给病人做饭
错：给病人打针
错：照顾病人
问：有人担心人工智能会带来什么问题？
答：很多人失去工作
错：环境污染
错：价格太贵
错：交通堵车
问：说话人认为人们应该怎么面对人工智能？
答：不断学习新技术
错：不使用人工智能
错：害怕人工智能
错：等着失去工作

文：我爷爷年轻的时候是一名军人，后来成了一名老师，教了三十多年的书。退休以后，他也没有在家休息，每天都去社区的图书馆帮忙收拾图书，还给小区的孩子们讲历史故事。孩子们都很喜欢听他讲故事，常常跟在他后面问这问那。爷爷说，能把自己知道的东西告诉下一代，是他最快乐的事。我希望老了以后也能像爷爷一样。
问：爷爷退休以前做了多少年老师？
答：三十多年
错：十多年
错：二十年
错：四十年
问：爷爷退休以后做什么？
答：在图书馆帮忙，给孩子讲故事
错：在家休息
错：去旅游
错：继续上班
问：爷爷觉得最快乐的事是什么？
答：把知道的东西告诉下一代
错：在家看电视
错：和朋友下棋
错：去国外旅游

文：最近，我们公司开始实行一种新的工作方式：每个星期有两天可以在家工作。刚开始的时候，很多同事都很高兴，因为不用早起坐地铁了。可是过了一段时间，有些人发现，在家工作的时候很难专心，常常被家里的事情打断。还有人觉得和同事交流变少了，有点儿孤独。所以，公司现在让大家自己选择，想在家工作就在家，想来公司就来公司。
问：公司的新工作方式是什么？
答：每星期两天在家工作
错：每天在家工作
错：每星期工作四天
错：晚上工作
问：在家工作的时候有些人遇到了什么问题？
答：很难专心
错：没有电脑
错：工资变少了
错：要早起
问：公司现在是怎么做的？
答：让大家自己选择
错：所有人都在家工作
错：所有人都回公司
错：不能在家工作了

文：熊猫是中国特有的动物，深受世界人民的喜爱。但是在几十年前，因为森林减少等原因，野生熊猫的数量曾经很少，有消失的危险。为了保护熊猫，中国建立了很多自然保护区，还开展了很多关于熊猫的研究。经过几十年的努力，野生熊猫的数量已经增加到了一千八百多只。这说明，只要人们共同努力，就能保护好野生动物。
问：几十年前熊猫的数量为什么很少？
答：森林减少等原因
错：被人吃了
错：气候太热
错：没有食物
问：为了保护熊猫，中国做了什么？
答：建立了自然保护区
错：把熊猫送到国外
错：禁止人们看熊猫
错：减少了熊猫的食物
问：现在野生熊猫有多少只？
答：一千八百多只
错：一百八十多只
错：一万八千多只
错：八百多只
`,
  },
};
