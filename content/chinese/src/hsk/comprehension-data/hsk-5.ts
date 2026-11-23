// The dialogues, talks and passages of HSK 5 with their questions (docs/chinese-curriculum.md §8.5), written for this package in the characters of the levels it tests; none is taken from a test.

import type { ComprehensionData } from "../comprehension.ts";

/** comprehension are the dialogues and passages of HSK 5. */
export const comprehension: ComprehensionData = {
  dialogues: {
    short: `
女：这份报告明天上午就要交了，你那部分写完了吗？
男：还差最后一点儿数据，今天晚上加个班应该能完成。
问：男的今天晚上可能会做什么？
据：报告明天上午要交，男的说“还差最后一点儿数据，今天晚上加个班应该能完成”。他加班就是为了写完报告。 | The report is due tomorrow morning, and he says he will work late tonight to finish the last data; working late means finishing the report.
答：加班写报告
错：去交报告 | 报告明天上午才交，今天晚上还没写完，不能交。 | It is due tomorrow morning and is not finished tonight.
错：找女的帮忙 | 他说自己加班能完成，没有说找女的帮忙。 | He says he can finish by working late, not that he will ask her.
错：早点儿回家休息 | 他要加班，不是早点儿回家。 | He will work late, not go home early.

女：听说你搬家了？新房子离公司远不远？
男：比以前远多了，不过附近有地铁，上班反而更方便了。
问：男的觉得新家怎么样？
据：男的说“比以前远多了，不过附近有地铁，上班反而更方便了”。 | The man says it is much farther but has an underground nearby, so commuting is easier.
答：虽然远，但是交通方便
错：离公司很近 | 他说比以前远多了。 | He says it is much farther.
错：附近没有地铁 | 他说附近有地铁。 | He says there is an underground nearby.
错：上班比以前更累 | 他说上班反而更方便了，不是更累。 | He says commuting is easier, not more tiring.

男：这家饭馆的菜真不错，就是等的时间太长了。
女：是啊，星期天人多，下次我们早点儿来，要不就先在网上排队。
问：女的建议下次怎么做？
据：女的说“下次我们早点儿来，要不就先在网上排队”。 | The woman says next time come earlier or queue online first.
答：早点儿来，要不就先在网上排队
错：换一家饭馆 | 她没有说换饭馆，男的还说菜真不错。 | She does not suggest another restaurant; he says the food is good.
错：下个月再来 | 她说的是下次早点儿来，没有说下个月。 | She says come earlier next time, not next month.
错：少点几个菜 | 问题是等得太长，她没有说少点菜。 | The problem is the wait; she does not mention ordering less.

男：我想报名参加下个月的马拉松，你觉得我行吗？
女：你平时连两公里都跑不下来，还是先从短距离开始练吧。
问：女的是什么意思？
据：女的说“你平时连两公里都跑不下来，还是先从短距离开始练吧”。连两公里都跑不下来，马拉松四十多公里，他现在还不行。 | She says he cannot even run two kilometres and should start short; a marathon is over forty, so he is not ready.
答：男的现在还不适合跑马拉松
错：男的一定能跑完 | 他连两公里都跑不下来，跑不完马拉松。 | He cannot run two kilometres, so not a marathon.
错：男的应该马上报名 | 她让他先练短距离，不是马上报名。 | She says train short first, not sign up now.
错：她想和男的一起参加 | 她没有说自己要参加。 | She does not say she will take part.

女：你这次去上海出差，要在那边待几天？
男：本来计划三天，可是客户突然改了时间，可能得多住两天。
问：男的可能会在上海待几天？
据：男的说“本来计划三天……可能得多住两天”。三天再加两天是五天。 | He planned three days and may stay two more; three plus two is five.
答：五天左右
错：两天 | 两天是多住的天数，不是一共的。 | Two is the extra, not the total.
错：三天 | 三天是原来的计划，客户改了时间。 | Three was the original plan before the change.
错：一个星期以上 | 三加两是五天，不到一个星期。 | Three plus two is five, under a week.

男：您好，我上周在你们这儿买的洗衣机，今天突然不转了。
女：真对不起，请您留个地址，我们明天安排工作人员上门检查。
问：女的接下来要做什么？
据：女的说“请您留个地址，我们明天安排工作人员上门检查”。上门就是去男的家里。 | She asks for his address to send staff to check it tomorrow; 上门 means to his home.
答：安排人去男的家里检查
错：给男的退钱 | 她说的是检查，不是退钱。 | She says inspect, not refund.
错：送一台新洗衣机 | 她说的是上门检查，没有说换新的。 | She says a home check, not a replacement.
错：教男的怎么用洗衣机 | 洗衣机是坏了，不是男的不会用。 | The machine is broken, not misused.

女：这本小说我看了一半就看不下去了，情节太慢了。
男：后面才精彩呢，你再坚持一下，保证你不后悔。
问：男的认为这本小说怎么样？
据：男的说“后面才精彩呢，你再坚持一下，保证你不后悔”。 | The man says the later part is the exciting part.
答：后半部分很精彩
错：情节太慢 | “情节太慢”是女的说的。 | 'Too slow' is what she says.
错：不值得看完 | 他让她坚持看完，保证不后悔。 | He urges her to finish it.
错：前半部分最好看 | 他说精彩的是后面，不是前面。 | He says the later part is good, not the first.

男：我们这个星期去郊区爬山怎么样？天气预报说是晴天。
女：我倒是想去，可是周六要参加同学的婚礼，周日行吗？
问：女的为什么周六不能去？
据：女的说“周六要参加同学的婚礼”。 | The woman says she has a classmate's wedding on Saturday.
答：要参加同学的婚礼
错：天气不好 | 男的说天气预报是晴天。 | He says the forecast is sunny.
错：要去郊区 | 郊区是他们要去爬山的地方，不是她不能去的原因。 | The suburbs are where they would climb, not her reason.
错：要上班 | 她没有说上班。 | She does not mention work.

女：你的汉语说得这么好，在中国住了很多年了吧？
男：其实我才来半年，不过来之前在国内学了三年。
问：关于男的，可以知道什么？
据：男的说“来之前在国内学了三年”。在国内就是来中国以前在自己的国家。 | He says he studied three years at home before coming; that was before China.
答：来中国以前学过汉语
错：在中国住了很多年 | 他说“其实我才来半年”。 | He says he has been here only half a year.
错：来中国三年了 | 三年是来之前学的时间，他来中国才半年。 | Three years is study before coming; he has been here half a year.
错：刚开始学汉语 | 他已经学了三年多，不是刚开始。 | He has studied over three years, not just begun.

男：经理，这个方案我又改了一遍，您再看看。
女：比上次好多了，不过价格部分还要再写得具体一些。
问：女的对方案有什么意见？
据：女的说“比上次好多了，不过价格部分还要再写得具体一些”。 | She says it is much better, but the pricing section needs more detail.
答：价格部分需要写得更具体
错：完全不满意 | 她说比上次好多了，不是完全不满意。 | She says it is much better.
错：不用再改了 | 她说“还要再写得具体一些”，还得改。 | She says it needs more detail, so more changes.
错：价格太高了 | 她说要写得具体，不是价格高。 | She asks for detail, not a lower price.

女：最近怎么总看你在吃药？身体哪儿不舒服吗？
男：没什么大问题，就是老睡不好，医生给开了点儿药。
问：男的为什么吃药？
据：男的说“就是老睡不好，医生给开了点儿药”。 | He says he keeps sleeping badly and the doctor prescribed something.
答：睡眠不好
错：感冒了 | 他没有说感冒。 | He does not mention a cold.
错：胃不舒服 | 他没有说胃。 | He does not mention his stomach.
错：受伤了 | 他没有说受伤。 | He does not mention an injury.

男：这个箱子太重了，我一个人搬不动，你能帮我一下吗？
女：没问题，不过你等我两分钟，我先把这个电话打完。
问：女的现在要先做什么？
据：女的说“你等我两分钟，我先把这个电话打完”。 | She says wait two minutes; she will finish this call first.
答：打完电话
错：搬箱子 | 搬箱子是打完电话以后的事。 | Moving the box comes after the call.
错：去找别人帮忙 | 她说“没问题”，自己帮，不是找别人。 | She says no problem and will help herself.
错：拒绝男的 | 她答应了，没有拒绝。 | She agrees, not refuses.

女：你们公司最近招人吗？我表妹刚毕业，正在找工作。
男：正好市场部缺一个人，让她把简历发给我看看。
问：男的让女的表妹做什么？
据：男的说“让她把简历发给我看看”。 | He says have her send him her CV.
答：把简历发给他
错：直接来公司上班 | 他要先看简历，没有说直接上班。 | He wants the CV first, not that she starts work.
错：去市场部面试 | 市场部是缺人的部门，他没有说面试。 | Marketing is where the vacancy is; no interview is mentioned.
错：先找别的工作 | 正好有空缺，他没有让她找别的。 | There is a vacancy, so he does not send her elsewhere.

男：明天的会议改到下午三点了，你通知大家了吗？
女：不好意思，我忘了！我现在马上在群里发个消息。
问：女的接下来要做什么？
据：女的说“我现在马上在群里发个消息”。发消息就是通知大家开会改时间。 | She says she will post in the group now, notifying everyone of the new time.
答：在群里通知大家
错：去开会 | 会议是下午三点，她现在要发消息。 | The meeting is at three; now she will post.
错：给男的打电话 | 她说在群里发，不是给男的打电话。 | She posts in the group, not phones him.
错：取消会议 | 会议是改时间，不是取消。 | The meeting is moved, not cancelled.

女：这件衣服打完折才两百块，你觉得值不值？
男：质量看起来一般，我觉得两百块有点儿贵了。
问：男的觉得这件衣服怎么样？
据：男的说“质量看起来一般，我觉得两百块有点儿贵了”。 | He says the quality looks ordinary and two hundred is a bit dear.
答：不太值这个价
错：非常便宜 | 他说两百块有点儿贵。 | He says two hundred is a bit dear.
错：质量很好 | 他说质量一般。 | He says the quality is ordinary.
错：颜色不好看 | 他没有说颜色。 | He does not mention colour.

男：你怎么还没走？下班都快一个小时了。
女：我在等雨小一点儿，今天出门的时候没想到会下雨。
问：女的为什么还没走？
据：女的说“我在等雨小一点儿”。 | She says she is waiting for the rain to ease.
答：在等雨小一点儿再走
错：工作还没做完 | 她没有说工作没做完。 | She does not say work is unfinished.
错：在等男的 | 她等的是雨小，不是男的。 | She waits for the rain, not for him.
错：要加班开会 | 她没有说开会。 | She does not mention a meeting.

女：孩子学钢琴都三年了，最近突然说不想学了。
男：别着急让他继续学，先问问原因，说不定只是遇到了困难。
问：男的建议女的怎么做？
据：男的说“先问问原因，说不定只是遇到了困难”。 | He says ask the reason first; maybe he just hit a difficulty.
答：先了解孩子不想学的原因
错：让孩子马上放弃 | 他让先问原因，不是马上放弃。 | He says ask first, not quit.
错：给孩子换一个老师 | 他没有说换老师。 | He does not mention a new teacher.
错：要求孩子每天多练 | 他说“别着急让他继续学”，不是要求多练。 | He says do not rush to make him continue, not drill more.

男：我刚才在网上查了一下，那家博物馆周一不开门。
女：那我们只能把参观改到周二了，正好周二人还少一些。
问：他们决定什么时候去博物馆？
据：男的说博物馆周一不开门，女的说“那我们只能把参观改到周二了”。 | Closed Monday, so she moves the visit to Tuesday.
答：周二
错：周一 | 博物馆周一不开门。 | It is closed on Monday.
错：周日 | 对话没有说周日。 | Sunday is never mentioned.
错：今天下午 | 对话没有说今天下午。 | This afternoon is never mentioned.

女：听说你辞职了？那份工作待遇不是很好吗？
男：工资是不低，可是天天加班，我连陪家人的时间都没有。
问：男的为什么辞职？
据：男的说“可是天天加班，我连陪家人的时间都没有”。 | He says daily overtime left him no time with family.
答：加班太多，没时间陪家人
错：工资太低 | 他说“工资是不低”。 | He says the pay was not low.
错：和同事关系不好 | 他没有说同事。 | He does not mention colleagues.
错：公司离家太远 | 他没有说路远。 | He does not mention distance.

男：下周就要考试了，你准备得怎么样了？
女：别提了，书还有一半没看呢，今晚一定要熬夜了。
问：女的现在是什么心情？
据：女的说“别提了，书还有一半没看呢，今晚一定要熬夜了”。考试下周就到，还有一半没看，所以着急。 | She says half the book is unread and she must stay up; with the exam next week, she is anxious.
答：着急
错：放松 | 还有一半没看，要熬夜，不放松。 | Half unread and an all-nighter ahead is not relaxed.
错：满意 | 她说“别提了”，对自己不满意。 | 'Don't ask' shows she is not satisfied.
错：骄傲 | 她没有什么可骄傲的，还没准备好。 | She is unprepared, nothing to be proud of.

女：这道菜是你自己做的？味道比饭馆的还好！
男：哪里哪里，我照着网上的视频学的，第一次做。
问：关于这道菜，可以知道什么？
据：男的说“我照着网上的视频学的，第一次做”。 | He says he learned from an online video and made it for the first time.
答：是男的第一次做的
错：是在饭馆买的 | 女的说比饭馆的还好，菜不是饭馆的。 | She compares it with restaurants, so it is not from one.
错：是女的做的 | 女的问“是你自己做的”，菜是男的做的。 | She asks if he made it; he did.
错：男的做过很多次 | 他说是第一次做。 | He says it is his first time.

男：你的手机怎么老是没人接？我打了好几次。
女：不好意思，我在图书馆，手机调成静音了。
问：女的为什么没接电话？
据：女的说“我在图书馆，手机调成静音了”。 | She says she was in the library with her phone on silent.
答：手机是静音的
错：手机没电了 | 她没有说没电。 | She does not say the battery died.
错：她不想接 | 她说“不好意思”，不是不想接。 | She apologises; she did not refuse.
错：她在上课 | 她在图书馆，不是在上课。 | She was in the library, not in class.

女：这个星期六的音乐会票还能买到吗？
男：早就卖完了，不过我有个朋友多买了一张，可以让给你。
问：女的可能怎样得到音乐会的票？
据：男的说票卖完了，“我有个朋友多买了一张，可以让给你”。 | He says it sold out but a friend has a spare to pass on.
答：从男的朋友那儿买
错：在网上买 | 票早就卖完了，网上买不到。 | It sold out, so not online.
错：在门口买 | 票早就卖完了，门口也买不到。 | It sold out, so not at the door.
错：男的送给她 | 票是他朋友的，“让给你”是卖给她，不是男的送。 | The ticket is his friend's to pass on, not his gift.

男：请问，从这儿去机场坐几号线最方便？
女：坐二号线到终点，再换机场快线，大概一个小时就到。
问：去机场要怎么走？
据：女的说“坐二号线到终点，再换机场快线”。 | She says take Line 2 to the end, then change to the airport express.
答：先坐二号线，再换机场快线
错：一直坐二号线 | 到终点还要换机场快线。 | At the end you change to the express.
错：坐出租车 | 她说的是地铁，不是出租车。 | She says the underground, not a taxi.
错：坐机场大巴 | 她说的是机场快线，不是大巴。 | She says the airport express, not a coach.

女：你最近好像瘦了不少，是不是在减肥啊？
男：没有特意减，就是每天骑自行车上下班，坚持了两个月。
问：男的为什么瘦了？
据：男的说“就是每天骑自行车上下班，坚持了两个月”。 | He says he has cycled to work daily for two months.
答：每天骑车上下班
错：特意在减肥 | 他说“没有特意减”。 | He says he did not diet on purpose.
错：生病了 | 他没有说生病。 | He does not mention illness.
错：吃得太少 | 他没有说少吃。 | He does not mention eating less.

男：小王做事情总是那么认真，交给他我很放心。
女：是啊，上次那个数据错误，也是他第一个发现的。
问：他们觉得小王怎么样？
据：男的说小王“做事情总是那么认真”，女的说数据错误“也是他第一个发现的”。 | He says Xiao Wang is always careful; she adds he spotted the data error first.
答：做事认真
错：经常出错 | 数据错误是小王发现的，不是他出的。 | He found the error, not made it.
错：性格很急 | 他们没有说他性格急。 | They do not call him hasty.
错：不太可靠 | 男的说“交给他我很放心”。 | He says he trusts him fully.

女：我们把客厅的沙发换个地方吧，放到窗户边上怎么样？
男：好主意，那样光线好，坐在那儿看书也舒服。
问：他们打算做什么？
据：女的说把沙发“放到窗户边上怎么样”，男的说“好主意”。 | She suggests moving the sofa by the window, and he agrees.
答：把沙发放到窗户边上
错：买一个新沙发 | 是换个地方，不是买新的。 | They move it, not buy one.
错：换一个窗户 | 换的是沙发的地方，不是窗户。 | The sofa moves, not the window.
错：去外面看书 | 看书是放好沙发以后坐在那儿，不是去外面。 | Reading is on the sofa there, not outside.

男：上次那家公司的面试通知你收到了吗？
女：收到了，可是时间是下周三，正好和我的考试冲突。
问：女的遇到了什么问题？
据：女的说面试“时间是下周三，正好和我的考试冲突”。冲突就是在同一时间。 | She says the interview is next Wednesday, clashing with her exam, so they fall on the same day.
答：面试和考试是同一天
错：没收到面试通知 | 她说“收到了”。 | She says she received it.
错：不想去面试 | 她没有说不想去。 | She does not say she won't go.
错：公司太远 | 她没有说公司远。 | She does not mention distance.

女：你每天早上都喝咖啡吗？对身体不好吧？
男：一天一杯没关系，不喝的话我整个上午都没精神。
问：男的为什么每天喝咖啡？
据：男的说“不喝的话我整个上午都没精神”。 | He says without it he has no energy all morning.
答：不喝就没精神
错：因为咖啡对身体好 | 女的说咖啡对身体不好，男的只说一杯没关系。 | She says it is bad; he only says one cup is fine.
错：医生让他喝 | 他没有说医生。 | He does not mention a doctor.
错：他喜欢咖啡的味道 | 他没有说味道。 | He does not mention taste.

男：这次旅游我们是跟团去，还是自己安排？
女：自己安排吧，跟团时间太紧，每个地方都只能看一会儿。
问：女的为什么不想跟团？
据：女的说“跟团时间太紧，每个地方都只能看一会儿”。 | She says tours are too rushed.
答：跟团时间太紧
错：跟团太贵 | 她没有说价钱。 | She does not mention cost.
错：她不喜欢旅游 | 他们正在安排旅游，她想去。 | They are planning the trip; she wants to go.
错：她想一个人去 | 她说“自己安排”，是他们自己去，不是她一个人。 | 'Arrange it ourselves' means the two of them.

女：电脑又出问题了，我写了一上午的文章全没了。
男：你没保存吗？以后记得每过十分钟就保存一下。
问：男的提醒女的什么？
据：男的说“以后记得每过十分钟就保存一下”。 | He says remember to save every ten minutes.
答：经常保存文件
错：换一台新电脑 | 他没有说换电脑。 | He does not mention a new computer.
错：重新写文章 | 他说的是以后怎么做，不是重写。 | He speaks of the future, not rewriting.
错：找人修电脑 | 他没有说修电脑。 | He does not mention repairs.

男：您这个月的电费比上个月高了很多，是不是哪儿漏电了？
女：不是，天太热了，空调差不多一天到晚都开着。
问：电费为什么变高了？
据：女的说“天太热了，空调差不多一天到晚都开着”。 | She says it is so hot the air conditioning runs all day.
答：空调用得多
错：电线坏了 | 男的问是不是漏电，女的说“不是”。 | He asks about a leak and she says no.
错：电价涨了 | 对话没有说电价。 | The price per unit is not mentioned.
错：家里来了客人 | 对话没有说客人。 | Guests are not mentioned.

女：你下周的生日想怎么过？要不要请大家吃个饭？
男：不用了，今年我就想和家人在家简单过一下。
问：男的想怎么过生日？
据：男的说“今年我就想和家人在家简单过一下”。 | He says he just wants a simple day at home with family.
答：在家和家人简单过
错：请朋友吃饭 | 请吃饭是女的的建议，他说“不用了”。 | A dinner is her idea, which he declines.
错：出去旅游 | 他要在家，不是旅游。 | He stays home, not travels.
错：不过生日 | 他要简单过，不是不过。 | He keeps it simple, not skips it.
`,
    long: `
女：你好，我想办一张图书馆的借书证。
男：好的，请问您是本校学生还是外面的读者？
女：我不是学生，就住在学校附近。
男：外面的读者也可以办，不过需要先交两百块保证金，一年的使用费是五十块。
女：保证金以后可以退吗？
男：可以，不用的时候拿证来就能全部退。另外，外面的读者一次最多借五本书，借一个月。
女：明白了，那我现在就办吧。
问：女的是什么人？
据：女的说“我不是学生，就住在学校附近”。 | She says she is not a student; she lives near the school.
答：住在学校附近的居民
错：本校学生 | 她说“我不是学生”。 | She says she is not a student.
错：图书馆的工作人员 | 她是来办证的，不是工作人员。 | She is applying, not staff.
错：学校的老师 | 她说自己只是住在附近，没有说是老师。 | She only lives nearby; not a teacher.
问：外面的读者办证一共要先交多少钱？
据：男的说“先交两百块保证金，一年的使用费是五十块”。两百加五十是二百五十块。 | He says a 200 deposit plus a 50 yearly fee; 200 plus 50 is 250.
答：250块
错：50块 | 五十块只是使用费。 | Fifty is only the fee.
错：200块 | 两百块只是保证金。 | Two hundred is only the deposit.
错：300块 | 二百加五十是二百五十，不是三百。 | 200 plus 50 is 250, not 300.
问：关于借书，可以知道什么？
据：男的说“外面的读者一次最多借五本书”。 | He says outside readers may borrow at most five books.
答：一次最多借五本
错：一次可以借十本 | 最多五本，不是十本。 | At most five, not ten.
错：可以借三个月 | 借一个月，不是三个月。 | One month, not three.
错：保证金不能退 | 男的说保证金“能全部退”。 | He says the deposit is fully refundable.

男：小李，听说你要去国外读研究生了？
女：对，九月份走，申请了一所大学的环境专业。
男：环境专业？你本科不是学经济的吗？
女：是啊，可是我工作这两年一直在做和环境保护有关的项目，越做越有兴趣。
男：换专业会不会很难？
女：开始一定不容易，不过我已经在网上上了几门入门课，应该能跟上。
男：那就好，祝你一切顺利！走之前我们一起吃个饭吧。
女：好啊，我请客！
问：女的本科学的是什么专业？
据：男的问“你本科不是学经济的吗”，女的说“是啊”。 | He asks if her degree was in economics, and she says yes.
答：经济
错：环境 | 环境是她要读的研究生专业。 | Environment is her master's subject.
错：法律 | 对话没有说法律。 | Law is not mentioned.
错：教育 | 对话没有说教育。 | Education is not mentioned.
问：女的为什么想读环境专业？
据：女的说“我工作这两年一直在做和环境保护有关的项目，越做越有兴趣”。 | She says two years on environmental projects made her keener and keener.
答：工作中对环境保护产生了兴趣
错：经济专业太难 | 她没有说经济难。 | She does not say economics was hard.
错：父母让她换专业 | 她没有说父母。 | She does not mention her parents.
错：国外大学只有这个专业 | 她没有说只有这个专业。 | She does not say it is the only course.
问：女的为换专业做了什么准备？
据：女的说“我已经在网上上了几门入门课”。 | She says she has taken several introductory courses online.
答：在网上上了入门课
错：辞职学习了一年 | 她一直在工作，没有辞职学习。 | She has been working, not studying full time.
错：请了一位老师 | 她上的是网上的课，没有说请老师。 | She studied online, not with a tutor.
错：去国外参观过那所大学 | 她没有说去参观过。 | She does not say she visited.

讲：各位乘客，欢迎乘坐本次列车。本次列车从北京开往上海，全程大约需要四个半小时，中途停靠南京一站。列车上提供饭菜和饮料，餐车在列车的中间。列车上还有免费的热水，需要的乘客可以自己去接。为了大家的安全，请不要在车上吸烟，也请看管好自己的行李。如果您需要帮助，可以随时联系列车员。到站前十分钟，我们会提醒大家准备下车。列车即将开动，请还没有坐好的乘客尽快回到自己的座位。祝您旅途愉快！
问：这段话最可能是在哪儿听到的？
据：广播说“欢迎乘坐本次列车”。列车就是火车。 | The announcement welcomes passengers aboard this train.
答：火车上
错：飞机上 | 说的是列车，不是飞机。 | It says train, not plane.
错：公共汽车上 | 说的是列车，不是公共汽车。 | It says train, not bus.
错：饭馆里 | 餐车是列车上的，不是饭馆。 | The dining car is on the train.
问：列车中途停哪一站？
据：广播说“中途停靠南京一站”。 | The announcement says it stops once, at Nanjing.
答：南京
错：北京 | 北京是出发的地方。 | Beijing is the start.
错：上海 | 上海是终点。 | Shanghai is the end.
错：不停靠 | 广播说停靠南京一站。 | It says one stop, Nanjing.
问：根据这段话，乘客在车上不能做什么？
据：广播说“请不要在车上吸烟”。 | The announcement says do not smoke on board.
答：吸烟
错：吃饭 | 车上提供饭菜，可以吃饭。 | Meals are served.
错：买饮料 | 车上提供饮料，可以买。 | Drinks are served.
错：去餐车 | 广播说了餐车在中间，可以去。 | It says where the dining car is.

女：王经理，下个月公司组织员工旅游，您看去哪儿好？
男：去年去的是海边，今年换个地方吧。大家有什么想法？
女：我做了个调查，一半的人想去爬山，还有不少人想去南方的古城。
男：爬山的话，年纪大一点儿的同事可能会吃不消。
女：那古城怎么样？那儿不太累，还能了解当地的文化。
男：可以，不过要注意时间，最好不要多于三天，别影响工作。
女：好的，我先做一个三天的计划，明天给您看。
问：去年公司员工去了哪儿旅游？
据：男的说“去年去的是海边”。 | He says last year they went to the seaside.
答：海边
错：山上 | 爬山是今年的想法。 | Mountains is this year's idea.
错：古城 | 古城是今年的想法。 | The old town is this year's idea.
错：国外 | 对话没有说国外。 | Abroad is not mentioned.
问：男的为什么担心去爬山？
据：男的说“爬山的话，年纪大一点儿的同事可能会吃不消”。吃不消就是太累，受不了。 | He says older colleagues may not cope; 吃不消 means too tiring.
答：年纪大的同事可能太累
错：爬山太危险 | 他没有说危险。 | He does not say danger.
错：费用太高 | 他没有说钱。 | He does not mention cost.
错：天气不好 | 他没有说天气。 | He does not mention weather.
问：女的明天要做什么？
据：女的说“我先做一个三天的计划，明天给您看”。 | She says she will draft a three-day plan and show him tomorrow.
答：把三天的旅游计划给男的看
错：带员工去古城 | 去古城是下个月的事，明天只是看计划。 | The trip is next month; tomorrow is the plan.
错：再做一次调查 | 调查她已经做了。 | She has already done the survey.
错：去海边看看 | 海边是去年去的。 | The seaside was last year.

男：你看今天的新闻了吗？说现在越来越多的年轻人选择回老家工作。
女：看了，我觉得很好理解。大城市房子太贵，压力也很大。
男：可是小地方机会少啊，收入也比不上大城市。
女：这倒是。不过现在网络这么发达，很多工作在哪儿都能做。我表哥就在老家给一家大城市的公司做设计。
男：那确实不错，不但能赚钱，还能照顾父母。
女：对，而且老家的生活节奏慢，他说现在身体比以前好多了。
问：他们在谈论什么话题？
据：男的一开始说新闻里“越来越多的年轻人选择回老家工作”，后面都在说这件事的好处和问题。 | He opens with the news about young people working in their home towns, and they discuss its pros and cons.
答：年轻人回老家工作
错：大城市的房价 | 房价只是女的说的一个原因。 | House prices are one reason she gives.
错：怎样照顾父母 | 照顾父母只是男的说的一个好处。 | Caring for parents is one benefit he mentions.
错：网络工作的收入 | 网络工作只是表哥的例子。 | Online work is just the cousin's example.
问：男的担心小地方有什么问题？
据：男的说“可是小地方机会少啊，收入也比不上大城市”。 | He says small places have fewer chances and lower pay.
答：机会少，收入低
错：生活节奏太快 | 女的说老家的生活节奏慢。 | She says home-town life is slow.
错：房子太贵 | 房子贵说的是大城市。 | Dear housing is about big cities.
错：网络不发达 | 女的说现在网络很发达。 | She says the internet is well developed.
问：关于女的表哥，可以知道什么？
据：女的说“我表哥就在老家给一家大城市的公司做设计”。 | She says her cousin designs for a big-city firm from his home town.
答：在老家为大城市的公司工作
错：在大城市当设计师 | 他在老家，不在大城市。 | He is in his home town, not the city.
错：最近身体不太好 | 他说“身体比以前好多了”。 | He says his health is much better.
错：没有工作 | 他在做设计，有工作。 | He works as a designer.

讲：现在很多人喜欢在睡觉前看手机，一看就是一两个小时。其实，这个习惯对健康影响很大。手机屏幕发出的光会让大脑以为还是白天，人就不容易感到困。就算睡着了，睡眠质量也会变差，第二天容易没精神。专家建议，睡觉前一个小时最好放下手机，可以看看纸质书、听听轻音乐，也可以用热水洗洗脚。如果实在需要用手机，也要把屏幕的光调小一些。很多人以为睡前看看手机能放松，其实正好相反。
问：睡前看手机为什么不容易睡着？
据：说话人说“手机屏幕发出的光会让大脑以为还是白天，人就不容易感到困”。 | The speaker says screen light makes the brain think it is still day, so one does not feel sleepy.
答：屏幕的光让大脑以为是白天
错：手机的声音太大 | 说话人说的是光，不是声音。 | The speaker says light, not sound.
错：看的内容太有意思 | 说话人没有说内容。 | Content is not mentioned.
错：手机太重了 | 说话人没有说手机重。 | Weight is not mentioned.
问：专家建议睡前多长时间不要看手机？
据：说话人说“专家建议，睡觉前一个小时最好放下手机”。 | The speaker says experts advise putting the phone down an hour before bed.
答：一个小时
错：半个小时 | 是一个小时，不是半个小时。 | One hour, not half.
错：两个小时 | 一两个小时是很多人睡前看手机的时间。 | One or two hours is how long people look at phones.
错：十分钟 | 是一个小时，不是十分钟。 | One hour, not ten minutes.
问：下面哪个不是专家建议的睡前活动？
据：专家建议“看看纸质书、听听轻音乐，也可以用热水洗洗脚”，没有说玩游戏。 | Experts suggest paper books, soft music and a hot footbath, never games.
答：玩游戏
错：看纸质书 | 看纸质书是专家建议的。 | Paper books are suggested.
错：听轻音乐 | 听轻音乐是专家建议的。 | Soft music is suggested.
错：用热水洗脚 | 用热水洗脚是专家建议的。 | A hot footbath is suggested.

男：您好，是张女士吗？我是快递员，您有一个快递。
女：是我。不过我现在不在家，在外面办事。
男：那我放在小区门口的快递站可以吗？
女：最好不要，里面是一些水果，放久了怕坏。你能下午五点以后再送吗？
男：五点以后我还有好几个地方要去，大概七点能到，可以吗？
女：没问题，七点我一定在家。谢谢你了。
问：女的为什么不想把快递放在快递站？
据：女的说“里面是一些水果，放久了怕坏”。 | She says it is fruit and might spoil.
答：里面是水果，怕放坏了
错：快递站关门了 | 对话没有说快递站关门。 | Closing is not mentioned.
错：东西太大放不进去 | 对话没有说东西大。 | Size is not mentioned.
错：她不知道快递站在哪儿 | 快递员说了在小区门口，她知道。 | He says it is at the estate gate.
问：快递员大概什么时候送快递？
据：快递员说“大概七点能到”，女的说“没问题”。 | The courier says about seven, and she agrees.
答：晚上七点左右
错：现在 | 她现在不在家，不能现在送。 | She is out, so not now.
错：下午五点 | 五点是女的想要的时间，快递员五点以后还要去别的地方。 | Five is her request; he has other stops after five.
错：明天上午 | 对话说的是今天晚上，不是明天。 | It is this evening, not tomorrow.
问：女的现在在哪儿？
据：女的说“我现在不在家，在外面办事”。 | She says she is out on errands.
答：在外面办事
错：在家 | 她说“不在家”。 | She says she is not at home.
错：在小区门口 | 小区门口是快递站在的地方。 | The estate gate is where the parcel station is.
错：在公司上班 | 她说的是办事，没有说公司。 | She says errands, not the office.

女：你们的学校最近好像有不少变化？
男：是啊，学校把以前的旧教学楼改成了学生活动中心，里面有舞蹈室、音乐室，还有一个小剧场。
女：那学生一定很喜欢吧？
男：特别受欢迎。以前下了课大家只能回宿舍，现在很多人都去那儿参加社团活动。
女：那原来在旧楼上的课怎么办？
男：都搬到新建的教学楼去了，新楼的教室更大，设备也更先进。
女：听起来真不错，有机会我也想去看看。
问：学校把旧教学楼改成了什么？
据：男的说“学校把以前的旧教学楼改成了学生活动中心”。 | He says the old block became a student activity centre.
答：学生活动中心
错：图书馆 | 他没有说图书馆。 | No library is mentioned.
错：新教室 | 新教室在新建的教学楼里。 | New classrooms are in the new block.
错：学生宿舍 | 宿舍是学生以前下课回去的地方。 | Dormitories are where students used to go.
问：以前下课以后学生一般做什么？
据：男的说“以前下了课大家只能回宿舍”。 | He says students used to go back to the dorms.
答：回宿舍
错：去小剧场 | 小剧场是现在才有的。 | The theatre is new.
错：去活动中心 | 活动中心是现在才有的。 | The centre is new.
错：去上课 | 下了课以后就不是上课了。 | After class is not class.
问：关于新教学楼，可以知道什么？
据：男的说“新楼的教室更大，设备也更先进”。 | He says the new block has bigger rooms and better equipment.
答：教室更大，设备更先进
错：还没有建好 | 课已经搬过去了，楼建好了。 | Classes have moved, so it is built.
错：里面有舞蹈室 | 舞蹈室在活动中心里，就是旧楼。 | The dance studio is in the centre, the old block.
错：离宿舍很远 | 对话没有说离宿舍远。 | Distance is not mentioned.

讲：很多家长都希望孩子从小多学几样东西，星期六星期天一会儿上英语课，一会儿上画画课，孩子一点儿休息的时间都没有。我认为，学习固然重要，但是孩子更需要的是自由玩的时间。在玩的过程中，孩子会自己想办法、做选择、和别的小朋友合作，这些能力在课堂上很难学到。而且，太多的课外班会让孩子觉得学习是一种负担，慢慢失去兴趣。所以，家长可以给孩子留一些空白的时间，让他们自己决定做什么。
问：说话人对休息日上很多课外班是什么态度？
据：说话人说“我认为，学习固然重要，但是孩子更需要的是自由玩的时间”，还说太多课外班会让孩子失去兴趣。 | The speaker says children need free play more and too many classes kill interest.
答：不赞成
错：非常支持 | 说话人说太多课外班是负担，不是支持。 | The speaker calls them a burden.
错：觉得都可以 | 说话人有明确的看法，不是都可以。 | The speaker has a clear view.
错：没有说明 | 说话人说了“我认为”。 | The speaker says 'I think'.
问：说话人认为玩能让孩子得到什么？
据：说话人说在玩的时候“孩子会自己想办法、做选择、和别的小朋友合作”。想办法就是解决问题。 | The speaker says in play children find ways, choose and cooperate; finding ways is solving problems.
答：解决问题和与人合作的能力
错：更好的考试成绩 | 说话人没有说考试成绩。 | Grades are not mentioned.
错：更多的朋友 | 说的是合作的能力，不是朋友多。 | It is the ability to cooperate, not more friends.
错：更多的知识 | 说话人说这些能力课堂上学不到，不是知识。 | These are skills, not knowledge from class.
问：说话人建议家长怎么做？
据：说话人说“家长可以给孩子留一些空白的时间，让他们自己决定做什么”。 | The speaker says parents can leave children some free time to choose.
答：给孩子留一些自由的时间
错：让孩子多上英语课 | 说话人说上很多课不好。 | The speaker says many classes are bad.
错：每天陪孩子玩 | 说话人让孩子自己决定，不是家长陪玩。 | Children decide, not parents playing along.
错：不让孩子上课外班 | 说话人只说不要太多，没说一个都不上。 | The speaker says not too many, not none.

男：这次的产品发布会准备得怎么样了？
女：场地已经定好了，在国际会议中心的二号厅，能坐三百人。
男：请的客人都确认了吗？
女：大部分都确认了，还有十几个媒体记者没回复，我下午再打电话问问。
男：好。另外，上次发布会音响出了问题，这次一定要提前检查。
女：放心吧，我已经安排技术人员发布会前一天去试一遍。
问：发布会在哪儿举行？
据：女的说“在国际会议中心的二号厅”。 | She says Hall 2 of the international conference centre.
答：国际会议中心
错：公司会议室 | 说的是会议中心，不是公司。 | The conference centre, not the office.
错：一家饭店 | 对话没有说饭店。 | No hotel is mentioned.
错：电视台 | 记者是客人，不是在电视台。 | Reporters are guests; no TV station.
问：女的下午要做什么？
据：女的说有十几个记者没回复，“我下午再打电话问问”。 | She says a dozen reporters have not replied and she will phone them this afternoon.
答：给没回复的记者打电话
错：去检查音响 | 检查音响是技术人员发布会前一天做。 | Technicians check the sound the day before.
错：去会议中心 | 场地已经定好了。 | The venue is booked.
错：写邀请信 | 对话没有说写信。 | No letters are mentioned.
问：为了不再出现上次的问题，他们打算怎么做？
据：女的说“我已经安排技术人员发布会前一天去试一遍”。 | She has arranged for technicians to test it the day before.
答：提前一天检查音响
错：换一个场地 | 场地已经定好了，没有换。 | The venue is booked, unchanged.
错：少请一些客人 | 上次的问题是音响，和客人多少没关系。 | Last time's problem was sound, not guest numbers.
错：请更多的技术人员 | 是安排技术人员去试，没有说请更多。 | Technicians test it; no more are hired.

女：大夫，我最近老是头疼，特别是下午。
男：您平时工作是不是要长时间看电脑？
女：对，我每天差不多要对着电脑八九个小时。
男：那很可能是眼睛太累，再加上坐的时间太长引起的。
女：需要吃药吗？
男：先不用。您工作的时候每过一个小时站起来活动一下，看看远处，晚上早点儿睡。一个星期以后要是还疼，再来检查。
问：女的哪里不舒服？
据：女的说“我最近老是头疼”。 | She says she keeps having headaches.
答：头疼
错：眼睛疼 | 眼睛累是医生说的原因，她说的是头疼。 | Tired eyes are the doctor's cause; she says headache.
错：肚子疼 | 她没有说肚子。 | She does not mention her stomach.
错：腿疼 | 她没有说腿。 | She does not mention her legs.
问：男的认为女的头疼的原因可能是什么？
据：男的说“很可能是眼睛太累，再加上坐的时间太长引起的”。眼睛累是因为每天对着电脑八九个小时。 | He says tired eyes and long sitting, the eyes tired from eight or nine hours at a screen.
答：长时间看电脑、坐得太久
错：睡得太多 | 对话没有说睡得多，医生还让她早点儿睡。 | Oversleeping is not mentioned; he says sleep earlier.
错：吃了不干净的东西 | 对话没有说吃东西。 | Food is not mentioned.
错：感冒了 | 对话没有说感冒。 | A cold is not mentioned.
问：男的给了女的什么建议？
据：男的说“每过一个小时站起来活动一下，看看远处”。 | He says stand and move every hour and look into the distance.
答：工作时定时起来活动
错：马上吃药 | 女的问要不要吃药，他说“先不用”。 | She asks about medicine; he says not yet.
错：换一份工作 | 他没有说换工作。 | He does not suggest a new job.
错：明天再来检查 | 他说一个星期以后还疼再来，不是明天。 | He says come back in a week if it persists.
`,
  },
  passages: {
    short: `
文：很多人认为，聪明的孩子学习一定好。可是研究发现，比起聪明，坚持和好的习惯对成绩的影响更大。一个每天认真复习的普通学生，成绩常常比一个聪明却不努力的学生更好。
问：这段话主要想告诉我们什么？
答：坚持和好习惯比聪明更重要
错：聪明的孩子成绩一定好
错：普通学生很难成功
错：复习对成绩没有影响

文：我们小区附近新开了一家书店。和一般书店不同，这家书店晚上十二点才关门，里面还有一个小咖啡馆。很多年轻人下班以后喜欢来这里，一边喝咖啡一边看书，一待就是几个小时。
问：关于这家书店，可以知道什么？
答：关门时间很晚
错：只卖咖啡
错：年轻人不喜欢去
错：已经开了很多年

文：很多人以为，看书越快越好。其实，读书的速度应该根据书的内容来决定。轻松的小说可以读得快一点儿，可是遇到重要的知识，就要放慢速度，一边读一边想，有时候还要读好几遍，才能真正明白。
问：作者认为读书应该怎么样？
答：根据内容决定读得快还是慢
错：越快越好
错：越慢越好
错：每本书都要读好几遍

文：小时候，我最怕的就是数学课。后来上了中学，遇到了一位很有耐心的数学老师。他从不批评我们，总是把难的问题讲得很简单。慢慢地，我不但不怕数学了，还爱上了数学。
问：说话人为什么后来喜欢上了数学？
答：遇到了一位好老师
错：数学变容易了
错：父母要求他学
错：他考了第一名

文：在中国，人们见面的时候常常问“吃了吗”。其实，这并不是真的想知道你吃没吃饭，而只是一种打招呼的方式，就像“你好”一样。回答“吃了”“还没呢”都可以。
问：“吃了吗”在这里是什么意思？
答：一种打招呼的方式
错：想请对方吃饭
错：关心对方的健康
错：问对方饿不饿

文：有些人买东西只看价格，觉得越便宜越好。其实，便宜的东西质量不一定好，用不了多久就坏了，还得再买一个。算一算，花的钱可能比一开始买个好的还多。
问：作者认为买东西应该怎么样？
答：不要只看价格
错：越便宜越好
错：越贵越好
错：多买几个

文：小张大学毕业后没有去大城市，而是回到了家乡的小村子。他利用网络，把村里的水果卖到了全国各地。现在，村里很多农民的收入比以前高了很多。
问：小张为村子做了什么？
答：在网上帮村里卖水果
错：在村里建了工厂
错：带村民去大城市打工
错：教村民种水果

文：运动以后马上喝很多冰水，看起来很舒服，其实对身体不好。这时候身体很热，突然喝冰的东西，胃会受不了。最好休息一会儿，再慢慢喝一些温水，一次也不要喝太多。
问：运动以后应该怎么喝水？
答：休息一会儿再喝温水
错：马上喝冰水
错：一次喝很多水
错：运动以后不能喝水

文：现在很多公司实行弹性工作时间，员工可以自己决定几点上班、几点下班，只要每天工作够八个小时就行。这样，员工不但不用在上下班人最多的时候出门，还能更好地安排自己的生活。
问：弹性工作时间有什么好处？
答：员工可以更自由地安排时间
错：员工可以少工作几个小时
错：公司可以少付工资
错：员工不用去公司

文：一个人在生气的时候，最好不要马上做决定。因为这时人很难冷静地思考，常常会说出让自己后悔的话，做出错误的选择。等心情平静下来再决定，结果往往会好很多。
问：这段话告诉我们什么？
答：生气时不要急着做决定
错：生气对身体不好
错：要经常和别人交流
错：做决定要越快越好

文：熊猫看起来胖胖的，好像很笨，其实很会爬树。小熊猫遇到危险的时候，常常会马上爬到高高的树上，等危险过去了再下来。另外，熊猫每天要花十几个小时吃东西。
问：根据这段话，熊猫遇到危险时会怎么做？
答：爬到树上
错：跑得很远
错：跳进水里
错：吃东西

文：这家饭馆的老板有一个规定：客人吃不完的菜可以免费打包，如果留下的菜太多，就要多付十块钱。老板说，这样做不是为了赚钱，而是希望大家不要浪费粮食。
问：老板为什么要这样规定？
答：希望客人不浪费
错：为了多赚钱
错：饭菜太少
错：客人太多

文：学一门外语，最重要的不是记住多少词语，而是敢不敢开口说。很多人怕说错，就一直不说，结果学了很多年还是不会交流。其实，说错了并不可怕，每一次错误都是进步的机会。
问：作者认为学外语最重要的是什么？
答：敢开口说
错：记很多词语
错：不能说错
错：多看书

文：每年春节前后，大量在外地工作的人都要回老家过年，非常多的人在同一段时间里坐车、坐飞机，这就是“春运”。这时候火车票特别难买，很多人要提前一个月就开始抢票。
问：“春运”是什么？
答：春节前后很多人回家的交通高峰
错：春天的运动会
错：一种新的火车
错：春节时的特别节目

文：有人以为，失败是一件很没面子的事。可是很多成功的人都说，失败教会他们的东西比成功还多。因为只有在失败以后，人才会认真想想问题出在哪儿，下次该怎么做。
问：这段话对失败是什么看法？
答：失败能让人学到东西
错：失败很没面子
错：失败了就要放弃
错：成功的人从不失败

文：我家楼下有一位老人，每天早上都在公园里教大家打太极拳，从来不收钱。他说，看到这么多人跟着他锻炼，身体越来越好，他就觉得特别开心，自己也好像年轻了。
问：老人为什么免费教大家打太极拳？
答：看到大家身体变好他就开心
错：想赚一点儿钱
错：公园要求他教
错：他的孩子让他教

文：现在很多年轻人喜欢“说走就走的旅行”，不做什么计划，买了票就出发。这样虽然很自由，但也可能遇到很多问题，比如找不到住的地方，也可能错过了重要的景点。
问：作者对“说走就走的旅行”是什么看法？
答：自由，但也可能有问题
错：非常完美
错：一定会失败
错：只适合年轻人

文：海水为什么是咸的？因为雨水会把陆地上的盐带到河里，河水又流进大海。经过了几百万年，海里的盐越来越多。而海水被太阳晒干以后，盐却留了下来，所以海水越来越咸。
问：海水里的盐主要是从哪儿来的？
答：陆地
错：太阳
错：天上的云
错：海里的鱼

文：为了让孩子多读书，一些学校在教室里放了一个小书架，学生可以把自己读过的书带来，和同学交换着看。这样，花很少的钱，每个人就能读到很多书。
问：学校为什么在教室里放书架？
答：让学生交换书来读
错：卖书给学生
错：放老师的书
错：让教室更漂亮

文：有的人一遇到困难就说“我不行”。其实，“不行”往往只是因为还没有找到正确的方法。换一个角度想问题，也可以请教一下别人，很多困难就能解决了。
问：作者认为遇到困难时应该怎么做？
答：换个角度想，也可以请教别人
错：马上放弃
错：一个人坚持下去
错：等别人来帮忙

文：现在越来越多的人用手机付钱，出门不带钱包也没关系。不过，对很多老年人来说，学用手机付钱并不容易。所以，一些商店还会保留现金付款，方便这些老人。
问：为什么一些商店还保留现金付款？
答：方便不会用手机付钱的老人
错：手机付钱不安全
错：现金更便宜
错：年轻人喜欢用现金

文：我们公司每年都会组织一次“家庭开放日”。这一天，员工可以带家人来公司参观，孩子们可以坐在爸爸妈妈的位子上，看看他们每天是怎么工作的。很多孩子回家以后说，原来爸爸妈妈工作这么不容易。
问：在“家庭开放日”，孩子们可以做什么？
答：到公司看父母怎样工作
错：和父母一起去旅游
错：在公司上课
错：帮父母完成工作

文：很多人觉得只有大事才值得感谢。其实，生活中的小事也需要说一声“谢谢”，比如同事帮你倒了一杯水，也可以是不认识的人帮你开了门。一句简单的谢谢，能让双方的心情都变好。
问：这段话主要告诉我们什么？
答：小事也要说谢谢
错：只有大事才值得感谢
错：要多帮助不认识的人
错：同事之间要互相帮助

文：这个城市从去年开始，在主要街道上都修了自行车专用道。以前，骑车的人要和汽车走在一起，很不安全。现在，骑车上班的人比去年多了三成，路上的汽车也少了一些。
问：修了自行车道以后，有什么变化？
答：骑车上班的人多了
错：汽车变多了
错：骑车更危险了
错：走路的人变多了

文：小王第一次去朋友家做客，带了一束白色的花。朋友的妈妈看了，脸色有点儿不好。后来小王才知道，在当地，白色的花一般是在不高兴的场合用的。
问：朋友的妈妈为什么不高兴？
答：白色的花在当地不适合送人
错：小王来晚了
错：花不新鲜
错：小王没有带礼物

文：有研究发现，每天走路半个小时，就能让身体变得更健康，减少很多病。走路不需要特别的设备，也不受场地限制，是一种最简单、最方便的运动，不管多大年纪的人都可以做。
问：根据这段话，走路有什么优点？
答：简单方便，对健康有好处
错：能很快减肥
错：需要特别的设备
错：只适合老年人

文：我的邻居养了一只小狗，特别聪明。每天晚上邻居下班回来，还没走到门口，小狗就已经在门后面等着了。有一次邻居生病在家，小狗一整天都坐在他的床边，哪儿也不去，连饭都不想吃。
问：关于这只小狗，可以知道什么？
答：很关心主人
错：经常生病
错：不喜欢主人
错：是邻居刚买的

文：很多人以为，休息就是在床上什么都不做。其实，换一种活动也是休息。比如，在电脑前工作了一天，出去散散步、做做饭，大脑反而能得到更好的放松。
问：作者认为什么是休息？
答：换一种活动也是休息
错：只有睡觉才是休息
错：休息就是什么都不做
错：工作的时候不能休息

文：中国有句老话叫“百闻不如一见”，意思是听别人说一百次，也不如自己亲眼看一次。很多事情只有亲自去经历，才能真正了解。比如一个地方美不美，看照片和自己去看，感觉完全不同。
问：“百闻不如一见”是什么意思？
答：亲眼看到比听人说更可靠
错：要多听别人的话
错：看一百次才能了解
错：听和看一样重要

文：这家商店推出了一项新服务：顾客在网上下单，一个小时内就能把东西送到家。服务推出以后，很受上班族欢迎，因为他们下班回家就能直接做饭，不用再去商店排队了。
问：这项新服务为什么受上班族欢迎？
答：节省了他们的时间
错：东西更便宜
错：可以在商店吃饭
错：商店晚上不关门

文：写日记是一个很好的习惯。每天花十分钟，把当天发生的事和自己的想法写下来，不但能提高写作水平，还能帮助自己整理心情。很多年以后再翻开，也是一份珍贵的回忆。
问：下面哪个不是写日记的好处？
答：能交到更多朋友
错：提高写作水平
错：整理心情
错：留下回忆

文：一位著名的厨师说，做菜最重要的不是贵的材料，而是新鲜。再好的牛肉，放了很多天也做不出好味道；而刚从地里拿回来的菜，简单炒一下就很好吃。
问：这位厨师认为做菜最重要的是什么？
答：材料新鲜
错：材料贵
错：做法复杂
错：多放调料

文：现在不少大学生在毕业以前就开始实习。通过实习，他们能了解真实的工作环境，知道自己适合做什么。有的学生因为实习表现好，毕业后直接留在了那家公司工作。
问：实习对大学生有什么帮助？
答：了解工作环境，认识自己
错：可以不用上课
错：可以赚很多钱
错：一定能留在公司
`,
    long: `
文：我的爷爷今年八十岁了，可是他一点儿也不像老人。七十岁那年，他突然说要学电脑。家里人都觉得奇怪，让他别累着自己。爷爷却说：“现在什么都离不开电脑，我不想被时代落下。”从那以后，他每天都让我教他半个小时。开始的时候，他连电脑都不会开，打一个字要找半天。我教了一遍又一遍，有时候都没有耐心了，他却从来不着急，还拿个小本子把每一步都记下来。半年以后，爷爷不但会上网看新闻，还学会了和远在国外的女儿视频聊天。现在，他每天在网上看书、下棋，还开了一个自己的博客，专门写他年轻时候的故事，有不少年轻人都喜欢看。爷爷常说：“人只要还想学，就不会老。”我想，等我老了，也要像爷爷一样，对新东西一直保持好奇。
问：家里人一开始对爷爷学电脑是什么态度？
答：不太支持
错：非常支持
错：觉得很有意思
错：要求他一定学会
问：爷爷学电脑时有什么特点？
答：认真、有耐心
错：学得很快
错：常常生气
错：不愿意记笔记
问：现在爷爷用电脑做什么？
答：写博客讲年轻时的故事
错：教别人用电脑
错：在网上工作赚钱
错：只用来看新闻
问：“人只要还想学，就不会老”是什么意思？
答：愿意学习的人心态一直很年轻
错：学习能让人活得更久
错：老人不需要学习
错：年轻人应该多学习

文：很多人都有这样的经历：明明知道一件事很重要，却一直不去做，直到最后一刻才着急。这就是我们常说的“明天再说”。为什么人们总是把事情往后推呢？心理学家认为，主要原因并不是懒，而是害怕。有的人怕做不好，就一直不开始；有的人觉得任务太大，不知道从哪儿下手。那么，怎样才能改了这个毛病呢？首先，可以把一个大任务分成几个小任务。比如要写一篇长文章，可以先定下今天只写开头。小任务容易完成，完成以后会让人有信心继续做下去。其次，要给自己定一个具体的时间，比如“上午九点到十点写作业”，而不是“今天有空就写”。另外，做事的时候最好把手机放远一点儿，因为手机是最容易让人分心的东西。只要坚持一段时间，你会发现，事情其实没有想象的那么难。
问：心理学家认为人们把事情往后推的主要原因是什么？
答：害怕
错：懒
错：太忙
错：身体不好
问：作者为什么建议把大任务分成小任务？
答：小任务容易完成，能增加信心
错：小任务更重要
错：可以让别人帮忙
错：大任务不用做完
问：下面哪个是作者提到的方法？
答：做事时把手机放远一点儿
错：找一个人监督自己
错：完成任务后奖励自己
错：每天早上做运动
问：这段话主要谈的是什么？
答：总是把事情往后推的原因和改正方法
错：怎样写好文章
错：手机的坏处
错：心理学家的研究过程

文：在一个小城市里，有一家开了三十年的修鞋店。店主老周是个话不多的人，每天早上七点就开门，晚上很晚才关门。这些年，城里买新鞋越来越方便，来修鞋的人也越来越少。有人让老周换个生意，他却说：“只要还有一个人需要我，我就开下去。”去年冬天，一个大学生拿着一双很旧的皮鞋来到店里。他说这是爸爸留给他的，爸爸已经去世了，这双鞋他一直留着。鞋底已经坏得很严重，别的店都说没法修。老周认真看了看，说：“给我三天时间。”三天后，大学生来取鞋时，简直不敢相信自己的眼睛：鞋子不但修好了，而且看起来和原来的样子一样。他要多付钱，老周只收了二十块。后来，这个大学生把这件事写到了网上，很多人专门来找老周修鞋，小店的客人又多了起来。
问：为什么来修鞋的人越来越少？
答：买新鞋越来越方便
错：老周的手艺不好
错：修鞋太贵
错：小店经常不开门
问：大学生为什么一定要修那双鞋？
答：那是去世的爸爸留下的
错：那双鞋很贵
错：他买不起新鞋
错：他很喜欢那个颜色
问：关于老周，下面哪个是正确的？
答：手艺好，收费不高
错：很喜欢说话
错：想换一个生意
错：修鞋花了一个星期
问：小店的客人后来为什么又多了起来？
答：大学生把这件事写到了网上
错：老周换了生意
错：城里的鞋店都关了
错：老周降低了价格

文：说起垃圾分类，很多人觉得不方便，但垃圾分类对环境的好处是很明显的。我们每天产生的垃圾中，有很大一部分其实是可以再利用的。比如，废纸可以重新做成纸，塑料瓶可以做成衣服的材料，吃不完的饭菜可以变成植物的肥料。如果把这些垃圾和其他垃圾放在一起，这些东西只能被埋到地下，也可能被烧了，不但浪费了资源，还会污染土地和空气。为了让居民养成分类的习惯，一些城市想了不少办法。有的小区在垃圾站边上安排了志愿者，教大家怎样分；有的地方给分类做得好的家庭发积分，积分可以换生活用品。经过几年的努力，这些城市需要埋和烧的垃圾明显减少了。当然，垃圾分类不是一天两天就能做好的，需要每个人从小事做起，坚持下去。
问：根据这段话，吃不完的饭菜可以变成什么？
答：肥料
错：纸
错：衣服的材料
错：生活用品
问：不分类的垃圾会有什么问题？
答：浪费资源，污染环境
错：垃圾站不够用
错：志愿者太累
错：居民要多交钱
问：一些城市用什么办法鼓励居民分类？
答：发积分换生活用品
错：不分类就罚钱
错：每天检查每个家庭
错：减少垃圾站的数量

文：你有没有发现，现在越来越多的人喜欢一个人吃饭、一个人看电影、一个人旅行？以前，人们常常觉得一个人做这些事不太好，好像没有朋友一样，会觉得有点儿奇怪。可是现在，很多年轻人认为，一个人的时间是一种享受。一个人吃饭，想吃什么就点什么，不用照顾别人的口味；一个人看电影，可以选自己真正喜欢的；一个人旅行，可以照自己的节奏走，看到喜欢的地方就多待一会儿。为了满足这样的需要，一些饭馆专门设计了一人座，电影院也推出了单人票的优惠。不过，也有专家提醒，享受一个人的时间没问题，但人毕竟需要和别人交流。如果长时间不和别人来往，也可能会感到孤独。所以，最好在“一个人”和“一群人”之间找到平衡。
问：以前人们怎样看一个人吃饭、看电影？
答：觉得不太好
错：觉得很流行
错：觉得很自由
错：觉得很浪费
问：根据这段话，一个人旅行有什么好处？
答：可以照自己的节奏走
错：花钱少
错：更安全
错：能认识更多朋友
问：专家提醒什么？
答：人也需要和别人交流
错：一个人吃饭对身体不好
错：不要一个人旅行
错：一人座太贵了

文：小林是一家公司的新员工。第一天上班，经理交给她一份很长的材料，让她第二天上午整理好。小林看了看，发现里面有很多专业词语她都不懂。她不好意思问别人，怕大家觉得她能力不够，就一个人在网上查到了半夜。第二天，她把整理好的材料交给经理，经理看了以后说：“整理得很认真，不过有几个地方理解错了。你为什么不问问坐在边上的老张？他做这方面的工作十几年了。”小林红着脸说出了自己的担心。经理笑了：“新员工有不懂的地方很正常，问问题不是坏事，不懂装懂才会出问题。”从那以后，小林遇到不明白的地方就主动去请教同事，不但工作完成得更快，和同事们的关系也越来越好。半年以后，她还成了新员工最喜欢请教的人。
问：小林为什么一开始不问别人？
答：怕别人觉得她能力不够
错：同事们都很忙
错：经理不让她问
错：她都能看懂
问：经理对小林整理的材料有什么评价？
答：很认真，但有些地方理解错了
错：完全正确
错：太简单了
错：交得太晚了
问：经理的话主要是什么意思？
答：不懂就应该问
错：新员工能力都不够
错：要多加班
错：老张最有经验
问：小林后来有什么变化？
答：主动请教同事，和大家关系更好了
错：换了一个部门
错：每天工作到半夜
错：成了老张的经理

文：茶在中国已经有几千年的历史了。中国人喝茶，不只是为了解渴，更是一种生活方式。在南方的很多城市，人们早上起来第一件事就是去茶馆“喝早茶”，一杯茶，几样点心，可以和朋友聊上一两个小时。在北方，过去很多老人喜欢一边喝茶一边听戏。中国的茶种类很多，最有名的有绿茶、红茶、白茶等。不同的茶，用水的方法也不一样：绿茶不能用太热的水，否则味道会变苦；而有些茶则需要用刚开的水。随着中国和世界的交流越来越多，喝茶的习惯也传到了很多国家。今天，在世界上很多地方，都能看到人们拿着一杯中国茶，享受这份来自东方的安静。对很多中国人来说，一杯茶不只是一种饮料，更代表着对客人的尊重：家里来了客人，主人一般会先请客人喝茶。
问：根据这段话，“喝早茶”时人们一般做什么？
答：喝茶吃点心，和朋友聊天
错：一个人安静地看书
错：边喝茶边听戏
错：去茶馆工作
问：喝绿茶时要注意什么？
答：水不能太热
错：要用刚开的水
错：要多放茶叶
错：要放很长时间
问：这段话主要介绍的是什么？
答：中国人喝茶的习惯和文化
错：怎样开一家茶馆
错：绿茶和红茶的区别
错：茶对身体的好处

文：很多人认为，记忆力好的人天生就好，后天很难改变。但是科学家发现，记忆力是可以训练的。大脑就像身体一样，越用越灵活。那么，有什么方法可以帮助我们记得更久呢？第一，要及时复习。人学了新东西以后，忘得最快的是开始的一两天，如果这时候复习一次，就能记得久得多。第二，要把新知识和已经知道的东西联系起来。比如记一个新词语，可以想一想这个词和哪些词语有关系，也可以用这个词说一个句子。第三，要保证充足的睡眠。研究发现，人在睡觉的时候，大脑会整理白天学到的东西。所以，考试前一天熬夜复习，效果往往并不好。只要方法对了，并且坚持下去，每个人的记忆力都能变得更好，学习也会变得更轻松。
问：科学家认为记忆力怎么样？
答：可以通过训练提高
错：完全是天生的
错：年纪大了就会变好
错：和睡眠没有关系
问：人学了新东西以后，什么时候忘得最快？
答：开始的一两天
错：一个星期以后
错：一个月以后
错：睡觉以后
问：作者对考试前一天熬夜复习是什么看法？
答：效果不好
错：很有必要
错：效果最好
错：没有提到

文：现在，很多城市的年轻人开始在阳台上种菜。他们说，种菜不但能吃到新鲜、放心的蔬菜，还能让人放松。每天下班回家，看看自己种的菜又长高了多少，一天的累好像都没有了。不过，在阳台上种菜并没有想象的那么容易。阳台的面积小，阳光也不一定够，有的菜种下去没多久就死了。为了种好菜，不少年轻人在网上学习，还建了很多交流群，大家在群里分享经验，比如什么菜适合在阳台上种，多长时间给菜喝一次水，怎样不用农药也能少生虫。一位在银行工作的女士说，她第一年种的菜差不多都失败了，第二年才慢慢种出了好菜。现在，她家的阳台上有十几种蔬菜，夏天基本不用去市场买菜。她觉得，种菜最大的好处不是省了多少钱，而是学会了耐心等待。
问：年轻人为什么喜欢在阳台上种菜？
答：能吃到放心的菜，还能放松
错：可以卖菜赚钱
错：阳台的阳光特别好
错：市场上买不到蔬菜
问：在阳台上种菜有什么困难？
答：面积小，阳光可能不够
错：没有地方买种子
错：家里人不支持
错：种子太贵
问：年轻人在交流群里做什么？
答：分享种菜的经验
错：卖自己种的菜
错：介绍银行的工作
错：组织大家去农村
问：那位女士认为种菜最大的好处是什么？
答：学会了耐心等待
错：省了很多钱
错：交到了很多朋友
错：吃得更健康
`,
  },
};
