// The dialogues of level 4 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 4, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
男：医生，我这几天一直头疼，晚上也睡不好。
女：你先量一下血压。血压有点儿高，你平时工作压力大吗？
男：很大，经常加班到很晚。
女：药我先给你开三天的，更重要的是要多休息，少熬夜。
问：男的有什么问题？
据：男的对医生说“我这几天一直头疼，晚上也睡不好”。 | The man tells the doctor he has had headaches for days and cannot sleep at night.
答：头疼，睡不好
错：胃疼，吃不下 | 他说的是头疼，不是胃疼；也没有说吃不下。 | He says his head hurts, not his stomach, and says nothing about appetite.
错：发烧，没力气 | 对话没有说发烧，也没有说没力气。 | Fever and weakness are never mentioned.
错：腿疼，走不了路 | 他说的是头疼，没有说腿疼、走不了路。 | He says headache; no leg pain or trouble walking.
问：男的血压怎么样？
据：医生量了血压，说“血压有点儿高”。 | The doctor takes his blood pressure and says it is a little high.
答：有点儿高
错：有点儿低 | 医生说的是有点儿高，和低相反。 | She says a little high, the opposite of low.
错：很正常 | 有点儿高就不是很正常。 | A little high is not normal.
错：还没检查 | 医生已经让他量了，说出了结果。 | She has already measured it and given the result.
问：医生认为最重要的是什么？
据：医生说“更重要的是要多休息，少熬夜”，“更重要”的就是这一条。 | The doctor says what matters more is resting and not staying up; 更重要 marks it.
答：多休息，少熬夜
错：每天吃药 | 医生只开了三天的药，吃药不是她说的更重要的事。 | She prescribes only three days of medicine; that is not what she calls more important.
错：多运动 | 医生没有说多运动。 | She says nothing about exercise.
错：换一个工作 | 男的说工作压力大，可是医生没有让他换工作。 | He says work is stressful, but she does not tell him to change jobs.

女：我们的车怎么不走了？
男：前面好像出了交通事故，堵了很长。
女：那我们会不会错过飞机？
男：别急，离起飞还有三个小时，时间够。
问：车为什么不走了？
据：男的说“前面好像出了交通事故，堵了很长”。 | The man says there seems to have been an accident ahead and the jam is long.
答：前面出了事故
错：车坏了 | 车没有坏，是前面堵住了。 | The car is not broken; the road ahead is blocked.
错：车没油了 | 对话没有说到油。 | Fuel is never mentioned.
错：司机迷路了 | 对话没有说司机迷路。 | Nothing says the driver is lost.
问：男的为什么让女的别急？
据：男的说“离起飞还有三个小时，时间够”。 | The man says there are still three hours before take-off, which is enough.
答：离起飞还有三个小时
错：飞机会延误 | 男的说的是时间够，没有说飞机会延误。 | He says there is time, not that the flight is delayed.
错：他们换了航班 | 对话没有说换航班。 | Changing flights is never mentioned.
错：机场就在前面 | 他们还堵在路上，男的没有说机场就在前面。 | They are stuck in traffic; he does not say the airport is just ahead.

男：你看到网上那条新闻了吗？说明天全市停水。
女：看到了，可是我查了一下，政府网站上没有这个消息，可能是谣言。
男：那我还是先不转给家人了。
问：女的为什么认为那是谣言？
据：女的说“我查了一下，政府网站上没有这个消息，可能是谣言”。 | The woman says she checked and the government website has no such notice, so it may be a rumour.
答：政府网站上没有这个消息
错：那条新闻是很久以前的 | 女的没有说新闻是很久以前的。 | She does not say the news is old.
错：她家明天不停水 | 女的判断的根据是政府网站，不是她家停不停水。 | Her reason is the government site, not whether her own water is off.
错：她的朋友告诉她的 | 是她自己查的，不是朋友告诉她的。 | She checked it herself; no friend told her.
问：男的本来想做什么？
据：男的说“那我还是先不转给家人了”。“先不转了”说明他本来打算把这条新闻转给家人。 | The man says he will hold off forwarding it to his family, which shows he meant to forward it.
答：把新闻转给家人
错：去买很多水 | 对话没有说买水。 | Buying water is never mentioned.
错：给政府打电话 | 对话没有说给政府打电话。 | Phoning the government is never mentioned.
错：在网上评论 | 对话没有说在网上评论。 | Posting a comment is never mentioned.

女：这一段长城有多少年的历史了？
男：这一段是明代修的，有六百多年了。
问：这一段长城有多少年了？
据：男的说“这一段是明代修的，有六百多年了”。 | The man says this stretch was built in the Ming and is over six hundred years old.
答：六百多年
错：一千多年 | 他说的是六百多年，不是一千多年。 | He says over six hundred, not over a thousand.
错：两千多年 | 他说的是六百多年，不是两千多年。 | He says over six hundred, not over two thousand.
错：三百多年 | 他说的是六百多年，不是三百多年。 | He says over six hundred, not over three hundred.

男：你星期六晚上有空吗？我有两张音乐会的票。
女：什么音乐会？
男：是一个弹古琴的，听说演奏得非常好。
女：好啊，我一直想听听古琴，可是星期六我得加班，星期天的可以吗？
男：只有星期六这一场，那我问问别人吧。
问：男的有什么票？
据：男的说有两张音乐会的票，是“一个弹古琴的”音乐会。 | The man has two tickets to a concert of guqin playing.
答：古琴音乐会的票
错：京剧的票 | 他说的是古琴音乐会，不是京剧。 | He says a guqin concert, not Peking opera.
错：电影的票 | 他说的是音乐会，不是电影。 | He says a concert, not a film.
错：画展的票 | 他说的是音乐会，不是画展。 | He says a concert, not an art show.
问：女的为什么不能去？
据：女的说“可是星期六我得加班”，音乐会只有星期六这一场。 | The woman says she must work on Saturday, and the concert is only on Saturday.
答：她星期六要加班
错：她不喜欢古琴 | 女的说“我一直想听听古琴”，她喜欢。 | She says she has long wanted to hear the guqin.
错：她星期天要加班 | 她要加班的是星期六，她问的正是星期天行不行。 | Saturday is her working day; she asks whether Sunday would do.
错：她已经听过了 | 她说一直想听，说明还没听过。 | She says she has always wanted to hear it, so she has not.
问：男的最后会怎么做？
据：男的说“只有星期六这一场，那我问问别人吧”。 | The man says there is only the Saturday show, so he will ask someone else.
答：问问别人
错：换星期天的票 | 只有星期六一场，没有星期天的票可以换。 | There is only the Saturday show, so no Sunday tickets exist.
错：自己一个人去 | 他说要问问别人，不是一个人去。 | He says he will ask others, not go alone.
错：把票退了 | 他没有说退票。 | He does not say he will return them.

女：我在网上买的手机坏了，商店说不能退。
男：法律规定，七天之内是可以退的，这是你的权利。
女：可是我已经用了十天了。
男：那可以让他们免费修，一般是一年之内。
问：女的遇到了什么问题？
据：女的说“我在网上买的手机坏了，商店说不能退”。 | The woman says the phone she bought online is broken and the shop will not take it back.
答：买的手机坏了，不能退
错：买的手机没有送到 | 手机已经送到了，她用了十天。 | The phone arrived; she has used it for ten days.
错：手机比商店里贵 | 对话没有比较价钱。 | No prices are compared.
错：手机被偷了 | 手机是坏了，不是被偷了。 | The phone is broken, not stolen.
问：男的认为女的现在可以怎么做？
据：女的用了十天，过了七天不能退，男的就说“那可以让他们免费修”。 | She has used it ten days, past the seven for returns, so he says she can have it repaired free.
答：让商店免费修
错：让商店退钱 | 七天之内才能退，她已经用了十天。 | Returns are within seven days, and she is at ten.
错：再买一个 | 男的没有让她再买一个。 | He does not tell her to buy another.
错：报警 | 男的说报警是没有的，他只说到退和修。 | He never mentions the police; he speaks only of returns and repairs.
问：女的手机用了多长时间？
据：女的说“可是我已经用了十天了”。 | The woman says she has already used it for ten days.
答：十天
错：七天 | 七天是法律规定能退的时间，不是她用的时间。 | Seven days is the legal return period, not how long she has used it.
错：一年 | 一年是免费修的时间。 | A year is the free repair period.
错：三天 | 三天录音里没有说。 | Three days is never said.

男：孩子明天要打疫苗，要注意什么？
女：打之前不要空肚子，打完以后在医院等半个小时再走。
问：打完疫苗以后要做什么？
据：女的说“打完以后在医院等半个小时再走”。 | The woman says to wait half an hour at the hospital after the shot.
答：在医院等半个小时
错：马上回家 | 要等半个小时再走，不能马上回家。 | One waits half an hour, so not straight home.
错：多喝水 | 女的没有说喝水。 | She says nothing about drinking water.
错：不能吃东西 | 女的说的是打之前不要空肚子，没有说打完不能吃东西。 | She says not to go on an empty stomach before; nothing about not eating after.
问：打疫苗以前要注意什么？
据：女的说“打之前不要空肚子”。 | The woman says not to go on an empty stomach before the shot.
答：不要空肚子
错：不要吃东西 | 不要空肚子就是要先吃东西，正好相反。 | Not on an empty stomach means eat first, the opposite.
错：不要喝水 | 女的没有说不能喝水。 | She does not say no water.
错：先量血压 | 量血压是别的对话里的，这里没有说。 | Blood pressure is not mentioned here.

女：您好，我们的航班取消了，今晚得在这儿住一晚。
男：没问题，航空公司已经给您订了附近的宾馆，这是地址。
问：女的为什么要住宾馆？
据：女的说“我们的航班取消了，今晚得在这儿住一晚”。 | The woman says their flight was cancelled and they must stay the night.
答：航班取消了
错：航班延误了 | 她说的是取消，不是延误。 | She says cancelled, not delayed.
错：她没订到票 | 她有票，是航班取消了。 | She had a ticket; the flight was cancelled.
错：她迷路了 | 对话没有说她迷路。 | Nothing says she is lost.
问：谁给女的订的宾馆？
据：男的说“航空公司已经给您订了附近的宾馆”。 | The man says the airline has booked her a nearby hotel.
答：航空公司
错：她自己 | 是航空公司订的，不是她自己。 | The airline booked it, not she.
错：她的朋友 | 对话没有说到她的朋友。 | Her friends are never mentioned.
错：机场的警察 | 对话没有说到警察。 | No police are mentioned.

男：你发的那个视频怎么有这么多人看？
女：我也没想到，一个晚上就有十万人看了，还多了五千个粉丝。
问：女的视频有多少人看了？
据：女的说“一个晚上就有十万人看了”。 | The woman says a hundred thousand people watched it in one night.
答：十万
错：五千 | 五千是她多了的粉丝数。 | Five thousand is the number of new followers.
错：一万 | 她说的是十万，不是一万。 | She says a hundred thousand, not ten thousand.
错：五万 | 她说的是十万，不是五万。 | She says a hundred thousand, not fifty thousand.

女：这个博物馆里最有名的是什么？
男：是一个两千多年前的皇帝用过的杯子。
女：真的吗？保存得这么好！
问：博物馆里最有名的是什么？
据：男的说是“一个两千多年前的皇帝用过的杯子”。 | The man says it is a cup used by an emperor over two thousand years ago.
答：皇帝用过的杯子
错：皇帝写过的字 | 他说的是杯子，不是写过的字。 | He says a cup, not writing.
错：皇帝画的画 | 他说的是杯子，不是画。 | He says a cup, not a painting.
错：皇帝穿过的衣服 | 他说的是杯子，不是衣服。 | He says a cup, not clothing.
问：那个东西有多少年了？
据：男的说是“两千多年前”的皇帝用过的。 | The man says the emperor used it over two thousand years ago.
答：两千多年
错：两百多年 | 他说的是两千多年，不是两百多年。 | He says over two thousand, not over two hundred.
错：一千多年 | 他说的是两千多年，不是一千多年。 | He says over two thousand, not over one thousand.
错：五百多年 | 他说的是两千多年，不是五百多年。 | He says over two thousand, not over five hundred.

男：你觉得这张画怎么样？
女：颜色用得很特别，可是我看不懂画的是什么。
男：这是现代画，每个人看到的都不一样。
问：女的觉得这张画怎么样？
据：女的说“颜色用得很特别，可是我看不懂画的是什么”。 | The woman says the colours are unusual, but she cannot tell what it shows.
答：颜色特别，但是看不懂
错：颜色普通，但是看得懂 | 她说颜色很特别，不是普通；也说看不懂。 | She says the colours are unusual, not ordinary, and that she cannot understand it.
错：颜色特别，也很好懂 | 她说“看不懂”，不是好懂。 | She says she cannot understand it.
错：颜色不好看，也看不懂 | 她说颜色特别，没有说不好看。 | She calls the colours unusual, not ugly.

女：有个人在网上发了我的照片和电话号码，我很害怕。
男：这样做是违法的，他没有权利发你的信息。你可以报警。
问：女的为什么害怕？
据：女的说“有个人在网上发了我的照片和电话号码，我很害怕”。 | The woman says someone posted her photo and phone number online, and she is scared.
答：她的照片和电话被发到网上
错：她的手机被偷了 | 她的手机没有被偷，是信息被发到网上。 | Her phone was not stolen; her details were posted.
错：有人骗了她的钱 | 对话没有说钱被骗。 | No money is mentioned.
错：她的密码被人知道了 | 被发出去的是照片和电话，不是密码。 | Her photo and number were posted, not her password.
问：男的让女的怎么做？
据：男的说“这样做是违法的……你可以报警”。 | The man says it is illegal and she can call the police.
答：报警
错：删照片 | 男的没有让她删照片，照片是别人发的。 | He does not tell her to delete photos; someone else posted them.
错：换电话号码 | 男的没有让她换号码。 | He does not tell her to change her number.
错：去找那个人 | 男的让她报警，不是自己去找那个人。 | He tells her to call the police, not to confront the person.

男：请问，去火车站的公共汽车在哪儿坐？
女：在前面路口往左拐，再走两百米就到了。
问：男的要去哪儿？
据：男的问“去火车站的公共汽车在哪儿坐”，他要去火车站。 | The man asks where to catch the bus to the railway station, so that is his goal.
答：火车站
错：机场 | 对话没有说到机场。 | No airport is mentioned.
错：路口 | 路口是去车站的路上要拐弯的地方，不是他要去的地方。 | The junction is where he turns on the way, not where he is going.
错：汽车站 | 他要坐公共汽车去火车站，汽车站只是坐车的地方。 | He takes the bus to the railway station; the bus stop is only where he boards.
问：女的让男的怎么走？
据：女的说“在前面路口往左拐，再走两百米就到了”。 | The woman says turn left at the junction ahead and walk two hundred metres.
答：到路口往左拐
错：到路口往右拐 | 她说的是往左拐，不是往右拐。 | She says left, not right.
错：一直往前走 | 要在路口拐弯，不是一直往前走。 | He must turn at the junction, not go straight on.
错：过桥往左拐 | 对话没有说到桥。 | No bridge is mentioned.

女：这个药一天吃几次？
男：一天三次，饭后吃，每次两片。别跟酒一起吃。
问：这个药怎么吃？
据：男的说“一天三次，饭后吃，每次两片”。 | The man says three times a day after meals, two tablets each time.
答：一天三次，每次两片
错：一天两次，每次三片 | 次数和片数说反了：是三次、两片。 | The numbers are swapped: three times, two tablets.
错：一天三次，每次一片 | 每次是两片，不是一片。 | Each dose is two tablets, not one.
错：一天两次，每次两片 | 一天是三次，不是两次。 | It is three times a day, not two.
问：吃药的时候不能做什么？
据：男的说“别跟酒一起吃”。 | The man says not to take it with alcohol.
答：喝酒
错：吃饭 | 男的说“饭后吃”，吃饭没问题。 | He says to take it after meals, so eating is fine.
错：喝水 | 男的没有说不能喝水。 | He does not forbid water.
错：喝牛奶 | 男的没有说到牛奶。 | Milk is never mentioned.

女：你每天花多长时间上网？
男：差不多四个小时吧，大部分时间都在看新闻和聊天。
问：男的每天上网多长时间？
据：男的说“差不多四个小时吧”。 | The man says about four hours.
答：差不多四个小时
错：差不多两个小时 | 他说的是四个小时，不是两个。 | He says four hours, not two.
错：一个小时左右 | 他说的是四个小时，不是一个小时左右。 | He says four hours, not about one.
错：差不多十个小时 | 他说的是四个小时，不是十个。 | He says four hours, not ten.
问：男的上网主要做什么？
据：男的说“大部分时间都在看新闻和聊天”。 | The man says most of the time he reads the news and chats.
答：看新闻和聊天
错：看电影和玩游戏 | 他说的是新闻和聊天，没有说电影和游戏。 | He says news and chat, not films and games.
错：工作 | 他没有说上网工作。 | He does not say he works online.
错：买东西 | 他没有说买东西。 | He does not say he shops.

男：听说你最近在读关于唐代的书？
女：是啊，唐代是中国历史上很有名的一个朝代，那时候的诗特别好。
问：女的最近在读什么书？
据：男的问是不是在读关于唐代的书，女的答“是啊”。 | The man asks if she is reading about the Tang, and she says yes.
答：关于唐代的书
错：关于明代的书 | 她读的是唐代，不是明代。 | She reads about the Tang, not the Ming.
错：唐代的小说 | 她读的是关于唐代的书，没有说是小说。 | She reads books about the Tang, not Tang novels.
错：现代诗 | 她说的是唐代的诗，不是现代诗。 | She speaks of Tang poetry, not modern poetry.
问：女的说唐代的什么特别好？
据：女的说“那时候的诗特别好”。 | The woman says the poetry of that time is especially good.
答：诗
错：画 | 她说的是诗，不是画。 | She says poetry, not painting.
错：音乐 | 她说的是诗，不是音乐。 | She says poetry, not music.
错：皇帝 | 她说的是诗，没有说皇帝。 | She says poetry; no emperor is mentioned.

女：这次去南方的岛上玩，你们是坐船去的吗？
男：没有，那个岛离陆地很远，我们是坐飞机去的。
问：男的是怎么去岛上的？
据：男的说“没有……我们是坐飞机去的”。 | The man says no, they went by plane.
答：坐飞机
错：坐船 | 女的问是不是坐船，男的说“没有”。 | Asked if they went by boat, he says no.
错：坐火车 | 岛离陆地很远，火车去不了。 | The island is far from land; no train goes there.
错：开车 | 去岛上不能开车，他们是坐飞机。 | One cannot drive to an island; they flew.
`,
  },
  {
    unit: 12,
    data: `
男：最近房价又涨了，我们是不是应该早点儿买房？
女：我觉得不用急，现在银行贷款的利息太高，我们再等等。
男：可是再等，房价可能更高。
女：那我们先算一算每个月要还多少钱，再决定吧。
问：男的为什么想早点儿买房？
据：男的说“最近房价又涨了”，又说“再等，房价可能更高”。他怕房价继续涨。 | The man says prices have risen and may go higher if they wait; he fears further rises.
答：怕房价更高
错：利息很低 | 女的说的是利息太高，不是低。 | The woman says interest is too high, not low.
错：他们没地方住 | 对话没有说他们没地方住。 | Nothing says they have nowhere to live.
错：银行给他们贷款 | 去银行贷款是要办的事，没有说银行已经给了贷款。 | A loan is still to be arranged; nothing says the bank has granted one.
问：女的为什么不急着买？
据：女的说“现在银行贷款的利息太高，我们再等等”。 | The woman says loan interest is too high now, so they should wait.
答：贷款利息太高
错：房价会跌 | 男的说房价可能更高，没有人说会跌。 | The man says prices may rise; no one says they will fall.
错：房子太小 | 对话没有说房子大小。 | Size is never mentioned.
错：他们钱不够 | 她说的是利息高，不是钱不够。 | She says interest is high, not that they lack money.
问：他们最后决定先做什么？
据：女的说“那我们先算一算每个月要还多少钱，再决定吧”。 | The woman says they should first work out the monthly repayment, then decide.
答：算一算每个月要还多少钱
错：去银行贷款 | 要先算一算，再决定贷不贷款。 | They will calculate first, then decide on the loan.
错：马上买房 | 女的说再决定，不是马上买。 | She says decide later, not buy now.
错：再看几个房子 | 对话没有说再看房子。 | Viewing more houses is never mentioned.

女：你怎么了？好像不太开心。
男：我准备了半年的比赛，结果第一场就输了，我觉得很失败。
女：别难过，你还年轻，以后还有很多机会。
问：男的为什么不开心？
据：男的说“我准备了半年的比赛，结果第一场就输了”。 | The man says he trained six months and lost in the first round.
答：比赛第一场就输了
错：没有参加比赛 | 他参加了，第一场就输了。 | He took part and lost the first round.
错：比赛准备了半年 | 准备了半年本身不是不开心的原因，输了才是。 | The six months of training is not the cause; the loss is.
错：他生病了 | 对话没有说生病。 | Illness is never mentioned.
问：女的怎么安慰男的？
据：女的说“你还年轻，以后还有很多机会”。 | The woman says he is young and will have many more chances.
答：以后还有机会
错：下次一定能赢 | 她只说以后还有机会，没有说下次一定能赢。 | She says there will be chances, not that he will surely win next time.
错：比赛不重要 | 她没有说比赛不重要。 | She does not say the match does not matter.
错：应该换一个比赛 | 她没有让他换比赛。 | She does not tell him to switch competitions.

男：今年夏天特别热，好几个地方都四十度以上。
女：是啊，科学家说这和全球变暖有关系。
男：我们每个人都应该少用空调、多走路，减少碳排放。
问：他们在谈什么？
据：男的说今年夏天特别热，女的说“这和全球变暖有关系”，两个人谈的是天气变暖。 | He says the summer is very hot, and she links it to global warming; they discuss the warming climate.
答：天气变暖
错：空调太贵 | 男的说要少用空调，没有说空调贵。 | He says to use less air conditioning, not that it costs a lot.
错：夏天的旅游 | 他们说的是天气热，没有说旅游。 | They talk about the heat, not holidays.
错：科学家的工作 | 科学家只是女的引用的，他们不是在谈科学家的工作。 | Scientists are only quoted; their work is not the topic.
问：男的认为每个人应该怎么做？
据：男的说“我们每个人都应该少用空调、多走路，减少碳排放”。 | The man says everyone should use less air conditioning and walk more.
答：少用空调，多走路
错：多用空调，少出门 | 正好说反了：是少用空调，多走路。 | It is the reverse: less air conditioning, more walking.
错：少开窗，多喝水 | 他没有说开窗和喝水。 | He says nothing about windows or drinking water.
错：去凉快的地方 | 他没有说去凉快的地方。 | He does not say go somewhere cool.

女：昨天的羽毛球比赛你看了吗？
男：看了，打得太精彩了！我们队二比一赢了，拿了冠军。
问：比赛结果怎么样？
据：男的说“我们队二比一赢了，拿了冠军”。 | The man says their team won two to one and took the title.
答：二比一赢了
错：一比二输了 | 是二比一赢了，不是一比二输了。 | They won two to one, not lost one to two.
错：二比二平了 | 二比一有输赢，不是平。 | Two to one is a win, not a draw.
错：三比一赢了 | 比分是二比一，不是三比一。 | The score is two to one, not three to one.
问：昨天是什么比赛？
据：女的问“昨天的羽毛球比赛你看了吗”。 | The woman asks if he watched yesterday's badminton match.
答：羽毛球
错：篮球 | 她说的是羽毛球，不是篮球。 | She says badminton, not basketball.
错：足球 | 她说的是羽毛球，不是足球。 | She says badminton, not football.
错：网球 | 她说的是羽毛球，不是网球。 | She says badminton, not tennis.

男：我在看一个介绍宇宙的节目，说宇宙里可能还有别的生命。
女：真的？科学家找到证据了吗？
男：还没有，只是一种可能，他们还在探索。
问：男的在看什么节目？
据：男的说“我在看一个介绍宇宙的节目”。 | The man says he is watching a programme about the universe.
答：介绍宇宙的
错：介绍动物的 | 他说的是宇宙，不是动物。 | He says the universe, not animals.
错：介绍历史的 | 他说的是宇宙，不是历史。 | He says the universe, not history.
错：介绍地球的 | 他说的是宇宙，不只是地球。 | He says the universe, not the Earth.
问：科学家找到别的生命了吗？
据：女的问找到证据了吗，男的说“还没有，只是一种可能”。 | Asked if there is evidence, the man says not yet; it is only a possibility.
答：还没有找到
错：已经找到了 | 男的说“还没有”，不是已经找到。 | He says not yet.
错：找到了一些证据 | 女的问的正是证据，男的说还没有。 | Evidence is what she asks about, and he says there is none yet.
错：不准备找了 | 男的说“他们还在探索”，还在找。 | He says they are still exploring.

女：听说你要换工作了？
男：对，新公司给的工资高一些，也有更多培训的机会。
女：那现在的工作怎么办？
男：我下个月就提出辞职。
问：男的为什么要换工作？
据：男的说“新公司给的工资高一些，也有更多培训的机会”。 | The man says the new firm pays more and offers more training.
答：工资更高，培训更多
错：工资更高，离家更近 | 第二个理由是培训，不是离家近。 | His second reason is training, not distance from home.
错：老板对他不好 | 男的没有说老板对他不好。 | He does not complain of his boss.
错：他想自己开公司 | 他要去新公司，不是自己开公司。 | He is joining a new firm, not starting one.
问：男的什么时候辞职？
据：男的说“我下个月就提出辞职”。 | The man says he will resign next month.
答：下个月
错：这个月 | 他说的是下个月，不是这个月。 | He says next month, not this month.
错：明天 | 他说的是下个月，不是明天。 | He says next month, not tomorrow.
错：下个星期 | 他说的是下个月，不是下个星期。 | He says next month, not next week.

男：最近股票一直在跌，我亏了不少钱。
女：投资总是有风险的，别把所有的钱都放在股票里。
问：男的遇到了什么事？
据：男的说“最近股票一直在跌，我亏了不少钱”。 | The man says shares keep falling and he has lost a lot.
答：买股票亏了钱
错：买股票赚了钱 | 他说的是亏了，和赚了相反。 | He says he lost, the opposite of gained.
错：借给别人钱 | 对话没有说借钱给别人。 | Lending money is never mentioned.
错：工资降了 | 他亏的是股票，没有说工资。 | He lost on shares; his pay is not mentioned.
问：女的是什么意思？
据：女的说“投资总是有风险的，别把所有的钱都放在股票里”，意思是投资要小心。 | The woman says investment always carries risk and he should not put everything in shares: be careful.
答：投资有风险，要小心
错：股票很快会涨 | 她没有说股票会涨。 | She does not say shares will rise.
错：应该马上卖股票 | 她只说别把钱都放在股票里，没有让他马上卖。 | She says not to put everything in shares, not to sell at once.
错：应该把钱都放在银行 | 她没有说把钱都放在银行。 | She does not say to put it all in the bank.

女：你一个人在国外留学，会不会觉得孤独？
男：刚来的时候很寂寞，常常想家。现在认识了很多朋友，好多了。
问：男的刚来的时候怎么样？
据：男的说“刚来的时候很寂寞，常常想家”。 | The man says that when he first came he was lonely and often homesick.
答：很寂寞，常常想家
错：很兴奋，常常出去玩 | 他说的是寂寞，不是兴奋。 | He says lonely, not excited.
错：很忙，没时间想家 | 他说常常想家，不是没时间想家。 | He says he often missed home.
错：很紧张，常常失眠 | 对话没有说紧张、失眠。 | Nerves and sleeplessness are never mentioned.
问：男的现在怎么样？
据：男的说“现在认识了很多朋友，好多了”。 | The man says he has now made many friends and is much better.
答：有了很多朋友
错：还是很寂寞 | 他说现在好多了，不再寂寞。 | He says he is much better now.
错：准备回国了 | 对话没有说回国。 | Going home is never mentioned.
错：常常想家 | 想家是刚来的时候，现在好多了。 | Homesickness was at first; he is better now.

男：这次去沙漠旅游，最难忘的是什么？
女：晚上的星星！天空特别干净，星星又多又亮。可是白天太热，晚上又特别冷。
问：女的觉得沙漠里最难忘的是什么？
据：女的说“晚上的星星”最难忘。 | The woman says the stars at night were the most unforgettable.
答：晚上的星星
错：白天的太阳 | 她说白天太热，太阳不是难忘的。 | She says the days were too hot; the sun is not what she treasures.
错：沙漠里的动物 | 对话没有说到动物。 | Animals are never mentioned.
错：晚上的月亮 | 她说的是星星，不是月亮。 | She says the stars, not the moon.
问：沙漠的天气怎么样？
据：女的说“白天太热，晚上又特别冷”。 | The woman says the days are too hot and the nights very cold.
答：白天热，晚上冷
错：白天冷，晚上热 | 正好说反了：白天热，晚上冷。 | It is the reverse: hot by day, cold by night.
错：一直很热 | 晚上特别冷，不是一直热。 | The nights are very cold, so not hot all day.
错：一直很冷 | 白天太热，不是一直冷。 | The days are too hot, so not cold all day.

女：你每天早上都跑步吗？
男：对，坚持了三年了。以前我总是生病，现在身体强多了。
问：男的坚持跑步多长时间了？
据：男的说“坚持了三年了”。 | The man says he has kept it up for three years.
答：三年
错：三个月 | 他说的是三年，不是三个月。 | He says three years, not three months.
错：一年 | 他说的是三年，不是一年。 | He says three years, not one.
错：半年 | 他说的是三年，不是半年。 | He says three years, not half a year.
问：跑步给男的带来了什么变化？
据：男的说“以前我总是生病，现在身体强多了”。 | The man says he used to be ill a lot, and now he is much stronger.
答：身体变好了
错：变瘦了 | 他说的是身体强了，没有说瘦。 | He says he is stronger, not thinner.
错：交了很多朋友 | 对话没有说交朋友。 | Making friends is never mentioned.
错：睡得更好了 | 对话没有说睡觉。 | Sleep is never mentioned.

男：这个实验我们做了五次，结果都不一样。
女：会不会是测量的方法有问题？我们再检查一下。
问：他们的实验有什么问题？
据：男的说“这个实验我们做了五次，结果都不一样”。 | The man says they ran the experiment five times and the results all differed.
答：每次结果都不一样
错：没有时间做 | 他们已经做了五次，不是没时间做。 | They have done it five times.
错：实验材料不够 | 对话没有说材料不够。 | A lack of materials is never mentioned.
错：结果跟别人不一样 | 结果是每次互相不一样，不是跟别人比。 | The results differ from run to run, not from others'.
问：女的认为可能是什么原因？
据：女的说“会不会是测量的方法有问题”。 | The woman asks whether the measuring method might be the problem.
答：测量方法有问题
错：材料有问题 | 她说的是测量方法，不是材料。 | She suspects the method, not the materials.
错：做的次数太少 | 已经做了五次，她没有说次数少。 | They have run it five times; she does not say too few.
错：机器坏了 | 她没有说机器坏了。 | She does not say a machine is broken.

女：你小时候想当什么？
男：想当警察，可是后来当了老师。
女：你后悔吗？
男：一点儿也不，看着学生们长大，我觉得很幸福。
问：男的小时候想做什么工作？
据：男的说“想当警察，可是后来当了老师”。 | The man says he wanted to be a police officer but became a teacher.
答：警察
错：老师 | 老师是他后来做的工作，不是小时候想做的。 | Teaching is what he became, not what he wanted as a child.
错：医生 | 对话没有说医生。 | Doctors are never mentioned.
错：记者 | 对话没有说记者。 | Reporters are never mentioned.
问：男的对现在的工作感觉怎么样？
据：女的问后悔吗，男的说“一点儿也不……我觉得很幸福”。 | Asked if he regrets it, he says not at all; he feels very happy.
答：很幸福
错：很后悔 | 他说“一点儿也不”后悔。 | He says he does not regret it at all.
错：很累 | 他没有说累。 | He does not say he is tired.
错：很一般 | 他说很幸福，不是一般。 | He says very happy, not so-so.

男：这种水果怎么一下子这么贵了？
女：今年南方发了大水，水果少了，价格当然就涨了。
问：水果为什么变贵了？
据：女的说“今年南方发了大水，水果少了，价格当然就涨了”。 | The woman says floods in the south cut the fruit supply, so the price rose.
答：南方发了大水，水果少了
错：南方太干了，水果少了 | 是发了大水，不是太干。 | It was floods, not drought.
错：买水果的人多了 | 她说的是水果少了，不是买的人多了。 | She says there is less fruit, not more buyers.
错：运水果的费用高了 | 她没有说运费。 | She says nothing about transport costs.

女：你听说了吗？我们部门的经理要升职了。
男：真的？太羡慕他了，他才工作五年。
问：男的为什么羡慕经理？
据：女的说经理要升职了，男的说“太羡慕他了，他才工作五年”。 | Told the manager will be promoted, the man says he envies him, only five years in.
答：经理工作五年就升职了
错：经理的工资很高 | 对话没有说工资。 | Pay is never mentioned.
错：经理要出国了 | 经理是要升职，不是出国。 | The manager is being promoted, not going abroad.
错：经理要辞职了 | 经理是要升职，不是辞职。 | The manager is being promoted, not resigning.

男：天气预报说下午有雷阵雨，你带雨衣了吗？
女：没带，那我早点儿回来吧。
问：下午天气怎么样？
据：男的说“天气预报说下午有雷阵雨”。 | The man says the forecast is for thunderstorms in the afternoon.
答：有雷阵雨
错：有大雪 | 预报的是雷阵雨，不是雪。 | The forecast is thunderstorms, not snow.
错：有大风 | 预报的是雷阵雨，不是大风。 | The forecast is thunderstorms, not wind.
错：很晴 | 有雷阵雨就不是晴天。 | Thunderstorms mean it is not clear.
问：女的打算怎么办？
据：女的说“没带，那我早点儿回来吧”。 | The woman says she did not bring one, so she will come back early.
答：早点儿回来
错：带上雨衣 | 她说没带雨衣。 | She says she has no raincoat.
错：不出门了 | 她要早点儿回来，说明还是要出门。 | She will come back early, so she is still going out.
错：借一件雨衣 | 她没有说借雨衣。 | She does not say she will borrow one.

女：你为什么选择学科学？
男：我从小就喜欢问为什么，想知道这个世界是怎么来的。
问：男的为什么学科学？
据：男的说“我从小就喜欢问为什么，想知道这个世界是怎么来的”。 | The man says he always asked why and wants to know how the world came to be.
答：想知道世界是怎么来的
错：父母让他学的 | 对话没有说父母。 | His parents are never mentioned.
错：科学家的工资高 | 对话没有说工资。 | Pay is never mentioned.
错：他喜欢动物 | 对话没有说动物。 | Animals are never mentioned.

男：这场比赛裁判判得不公平，我们队有一个球没算进。
女：别生气了，比赛已经结束了。
问：男的为什么生气？
据：男的说“这场比赛裁判判得不公平，我们队有一个球没算进”。 | The man says the referee was unfair: one of their goals was not counted.
答：裁判判得不公平
错：他们队输了很多 | 他说的是一个球没算进，没有说输了很多。 | He says one goal was disallowed, not a heavy defeat.
错：比赛没有结束 | 女的说“比赛已经结束了”。 | The woman says the match is over.
错：他没看到比赛 | 他知道裁判怎么判，说明他看了比赛。 | He knows how the referee ruled, so he saw it.
问：女的让男的怎么样？
据：女的说“别生气了，比赛已经结束了”。 | The woman says not to be angry; the match is over.
答：别生气了
错：再看一场 | 她没有让他再看一场。 | She does not suggest another match.
错：去找裁判 | 她说比赛结束了，没有让他去找裁判。 | She says it is over, not to go after the referee.
错：自己去踢球 | 她没有让他自己去踢球。 | She does not tell him to play.

女：今年找工作的人特别多，竞争很大。
男：所以要提高自己的能力，多学一些技术。
问：男的认为找工作应该怎么做？
据：男的说“所以要提高自己的能力，多学一些技术”。 | The man says one should improve one's ability and learn more skills.
答：提高能力，多学技术
错：多找几家公司 | 他没有说多找几家公司。 | He does not say apply to more firms.
错：降低工资要求 | 他没有说降低工资要求。 | He does not say ask for less pay.
错：等明年再找 | 他没有说等明年。 | He does not say wait a year.
`,
  },
];
