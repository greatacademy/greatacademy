// The dialogues of level 6 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 6, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：你跟你奶奶打电话，怎么一会儿说普通话，一会儿说方言？
男：她听不太懂普通话，有些话我只能用家乡话说，她才明白。
问：男的为什么跟奶奶说方言？
据：男的说“她听不太懂普通话，有些话我只能用家乡话说，她才明白”。 | The man says she barely understands Mandarin, so some things he can only say in the home dialect.
答：奶奶听不太懂普通话
错：他不会说普通话 | 他也说普通话，是奶奶听不太懂。 | He does speak Mandarin; it is his grandmother who cannot follow it.
错：奶奶不让他说普通话 | 男的没有说奶奶不让他说。 | He does not say she forbids it.
错：他想练习方言 | 他说方言是为了让奶奶明白，不是为了练习。 | He uses dialect so she understands, not for practice.
问：男的在跟谁打电话？
据：女的问“你跟你奶奶打电话”，男的接着说的“她”就是奶奶。 | The woman says he is phoning his grandmother, and his "she" is that grandmother.
答：奶奶
错：外婆 | 女的说的是奶奶，是爸爸的妈妈，外婆是妈妈的妈妈。 | She says 奶奶, the father's mother; 外婆 is the mother's mother.
错：妈妈 | 对话说的是奶奶，不是妈妈。 | It is his grandmother, not his mother.
错：老师 | 对话没有说到老师。 | No teacher is mentioned.

男：你刚才说"这事儿再说吧"，是什么意思？是同意还是不同意？
女：其实就是不太想做，只是不好意思直接拒绝。中国人说话常常有言外之意。
男：原来是这样，看来光学词语还不够，还得了解说话的习惯。
问：女的说的那句话实际上是什么意思？
据：女的说“其实就是不太想做，只是不好意思直接拒绝”。 | The woman says it really means she does not want to, but is too polite to refuse outright.
答：不太想做这件事
错：马上就去做 | 她说其实是不太想做，不是马上做。 | She says it means reluctance, not doing it at once.
错：完全同意 | 她说是不好意思拒绝，不是同意。 | She says it is a polite refusal, not agreement.
错：以后一定会做 | “再说吧”是不想做，不是保证以后做。 | "Let's see" means reluctance, not a promise.
问：男的明白了什么？
据：男的说“看来光学词语还不够，还得了解说话的习惯”。 | The man says learning words alone is not enough; one must know how people talk.
答：学语言还要了解说话习惯
错：中国人说话都很直接 | 女的说中国人说话常有言外之意，就是不直接。 | She says Chinese speech often carries hidden meaning, so it is not always direct.
错：词语学得越多越好 | 他说光学词语不够，不是越多越好。 | He says words alone are not enough, not that more words are the answer.
错：他不应该问这个问题 | 他没有说不该问，他问了才明白。 | He does not regret asking; asking taught him.

女：你儿子都上高中了，你们之间有代沟吗？
男：怎么没有？他说的那些流行语，我一半都听不懂。
女：那你们平时怎么交流？
男：我每天开车接送他，路上就是我们聊天的时间，他也会教我几个新词。
问：男的和儿子之间有什么问题？
据：男的说“他说的那些流行语，我一半都听不懂”。 | The man says he cannot understand half of his son's slang.
答：听不懂儿子说的流行语
错：儿子不跟他说话 | 他们每天在车上聊天，儿子跟他说话。 | They chat in the car every day, so his son does talk to him.
错：儿子学习成绩不好 | 对话没有说成绩。 | Grades are never mentioned.
错：儿子不愿意上高中 | 儿子已经上了高中。 | His son is already at high school.
问：男的和儿子一般什么时候聊天？
据：男的说“我每天开车接送他，路上就是我们聊天的时间”。 | The man says he drives his son every day, and the drive is their time to talk.
答：开车接送儿子的路上
错：每天吃晚饭的时候 | 对话没有说吃晚饭。 | Dinner is never mentioned.
错：周六一起运动的时候 | 对话没有说一起运动。 | Exercise together is never mentioned.
错：睡觉以前 | 对话没有说睡觉以前。 | Bedtime is never mentioned.

男：外婆一个人住在村子里，我们想接她进城，她怎么都不愿意。
女：老人在那儿住了一辈子，邻居都是老朋友，进了城反而孤单。
男：可是她年纪大了，身边没人照看，我们实在不放心。
女：要不请村里的亲戚多去看看她，你们每个月也回去一次。
问：外婆为什么不愿意进城？
据：女的说“老人在那儿住了一辈子，邻居都是老朋友，进了城反而孤单”。 | The woman says she has lived there all her life among old friends, and would be lonelier in the city.
答：在村里有老朋友，进城会孤单
错：城里的房子太小 | 对话没有说房子大小。 | Housing size is never mentioned.
错：她不喜欢男的的家人 | 对话没有说她不喜欢家人。 | Nothing says she dislikes the family.
错：城里空气不好 | 对话没有说城里的空气。 | City air is never mentioned.
问：女的提出了什么建议？
据：女的说“请村里的亲戚多去看看她，你们每个月也回去一次”。 | The woman suggests asking relatives in the village to visit her often, and going back once a month.
答：请亲戚多照看，自己每月回去
错：把外婆送到养老院 | 对话没有说养老院。 | A care home is never mentioned.
错：男的搬回村里住 | 女的只说每个月回去一次，不是搬回村里。 | She says visit monthly, not move back.
错：一定要把外婆接进城 | 外婆不愿意进城，女的的建议正是不接她进城。 | Grandmother refuses the city, and the woman's plan avoids moving her.

女：你们家的家务都是谁做？
男：我们俩一起分担，她做饭，我洗碗、拖地，星期天一起打扫。
问：男的家里的家务是怎么做的？
据：男的说“我们俩一起分担”。 | The man says the two of them share the work.
答：夫妻两个人一起做
错：都是妻子做 | 妻子只做饭，其他的男的做。 | His wife cooks; he does the rest.
错：都是男的做 | 做饭是妻子做的，不是都是男的。 | His wife cooks, so not everything is his.
错：请别人来做 | 对话没有说请人。 | Hiring help is never mentioned.
问：男的负责哪些家务？
据：男的说“她做饭，我洗碗、拖地”。 | The man says she cooks and he washes up and mops.
答：洗碗和拖地
错：做饭 | 做饭是妻子负责的。 | Cooking is his wife's.
错：洗衣服 | 对话没有说洗衣服。 | Laundry is never mentioned.
错：买菜 | 对话没有说买菜。 | Shopping is never mentioned.

男：你搬到郊区以后，每天通勤要多长时间？
女：坐地铁单程一个半小时，早高峰人特别多，常常没有座位。
男：那么累，为什么还要搬过去？
女：那边房子大很多，空气也好，孩子有地方跑来跑去。
问：女的每天上班单程要多长时间？
据：女的说“坐地铁单程一个半小时”。 | The woman says it is an hour and a half one way by underground.
答：一个半小时
错：半个小时 | 她说的是一个半小时，不是半个小时。 | She says an hour and a half, not half an hour.
错：一个小时 | 一个小时后面还有半个小时。 | There is half an hour more on top of an hour.
错：两个半小时 | 她说的是一个半，不是两个半。 | She says one and a half, not two and a half.
问：女的为什么搬到郊区？
据：女的说“那边房子大很多，空气也好，孩子有地方跑来跑去”。 | The woman says the house is much bigger, the air better, and the child has room to run.
答：房子更大，环境更好
错：离公司更近 | 她单程要一个半小时，离公司不近。 | Her commute is ninety minutes, so it is not closer.
错：郊区的房子更便宜 | 她说的是房子大，没有说便宜。 | She says bigger, not cheaper.
错：她父母住在那里 | 对话没有说她父母。 | Her parents are never mentioned.

女：我们村今年水稻丰收了，可是价格不高，大家都很着急。
男：可以试试在网上卖，把我们这里的特产也一起介绍出去。
女：那得有人会拍视频、会写介绍才行。
男：我上过这方面的课，可以先教大家。
问：村里的人为什么着急？
据：女的说“水稻丰收了，可是价格不高，大家都很着急”。 | The woman says the rice harvest was good but prices are low, so people are anxious.
答：水稻价格不高
错：水稻没有丰收 | 女的说今年丰收了。 | She says the harvest was good.
错：没有人种田 | 对话没有说没人种田。 | Nothing says no one farms.
错：天气太干了 | 对话没有说天气。 | Weather is never mentioned.
问：男的打算做什么？
据：男的说“我上过这方面的课，可以先教大家”，教的是拍视频、写介绍，在网上卖。 | The man says he has taken a course and can teach everyone to film and write for online selling.
答：教大家在网上卖东西
错：去城里打工 | 他留在村里教大家，不是去城里。 | He stays to teach, not to work in the city.
错：改种别的庄稼 | 他要帮大家卖水稻，不是改种别的。 | He wants to sell the rice, not change crops.
错：开一家超市 | 他说的是在网上卖，不是开超市。 | He speaks of selling online, not opening a shop.

男：你怎么又头晕了？是不是最近太累了？
女：医生说是因为我久坐不动，肩和腰都出了问题。
问：女的头晕的原因是什么？
据：女的说“医生说是因为我久坐不动，肩和腰都出了问题”。 | The woman says the doctor blames sitting too long without moving.
答：坐得太久，不常活动
错：工作太累 | 累是男的猜的，医生说的是久坐不动。 | Tiredness is the man's guess; the doctor says long sitting.
错：晚上睡不好 | 对话没有说睡觉。 | Sleep is never mentioned.
错：吃得太少 | 对话没有说吃饭。 | Eating is never mentioned.
问：头晕的原因是谁告诉女的的？
据：女的说“医生说是因为我久坐不动”。 | The woman says, "The doctor says it is because I sit too long."
答：医生
错：男的 | 男的只是猜她太累了，原因是医生说的。 | The man only guesses; the doctor gave the cause.
错：她的同事 | 对话没有说到她的同事。 | Her colleagues are never mentioned.
错：她的家人 | 对话没有说到她的家人。 | Her family is never mentioned.

女：你每天早上这么早出去，是去跑步吗？
男：不是，我现在不跑步了，膝盖受过伤。我改成快走和拉伸了。
女：效果怎么样？
男：不错，腰不疼了，晚上也睡得更好。
问：男的为什么不跑步了？
据：男的说“我现在不跑步了，膝盖受过伤”。 | The man says he no longer runs because he injured his knee.
答：膝盖受过伤
错：腰疼 | 腰疼是以前的事，现在“腰不疼了”，也不是不跑的原因。 | His back pain is gone now, and it was not the reason.
错：没有时间 | 他每天早上都出去锻炼，不是没时间。 | He goes out every morning, so he has time.
错：觉得没有效果 | 他说新的锻炼效果“不错”，没有说跑步没效果。 | He praises the new routine and never says running did not work.
问：男的现在怎么锻炼？
据：男的说“我改成快走和拉伸了”。 | The man says he switched to brisk walking and stretching.
答：快走和拉伸
错：游泳 | 他说的是快走和拉伸，不是游泳。 | He says walking and stretching, not swimming.
错：跳绳 | 他没有说跳绳。 | He does not mention skipping.
错：骑自行车 | 他没有说骑车。 | He does not mention cycling.

男：你看新闻了吗？科学家又在海底发现了一种新的鱼。
女：看了，听说那里没有一点儿光，它们是靠什么找吃的呢？
男：好像是靠身上的一种特别的感觉，具体的还在研究。
问：他们在谈论什么？
据：男的说“科学家又在海底发现了一种新的鱼”，两个人接着谈这种鱼。 | The man says scientists have found a new fish on the sea floor, and they go on about it.
答：海底发现的新鱼
错：海边的天气 | 他们说的是海底，不是海边的天气。 | They speak of the sea floor, not seaside weather.
错：一部科学电影 | 男的说的是新闻，不是电影。 | He speaks of the news, not a film.
错：怎么养鱼 | 他们说的是科学家的发现，不是养鱼。 | They discuss a discovery, not fish-keeping.
问：关于这种鱼，可以知道什么？
据：男的说“具体的还在研究”。 | The man says the details are still being studied.
答：科学家还在研究它
错：已经研究清楚了 | 还在研究，就是还没研究清楚。 | Still being studied means not yet clear.
错：生活在有光的地方 | 女的说那里“没有一点儿光”。 | The woman says there is no light at all there.
错：可以在家里养 | 对话没有说在家里养。 | Keeping them at home is never mentioned.

女：这个实验你已经做了二十多次了，还没成功吗？
男：没有，不过每次失败我都能排除一种可能，离答案越来越近了。
问：男的对失败是什么态度？
据：男的说“每次失败我都能排除一种可能，离答案越来越近了”。 | The man says each failure rules out one possibility and brings him nearer the answer.
答：每次失败都有收获
错：想放弃这个实验 | 他说离答案越来越近，没有要放弃。 | He says he is getting closer, not giving up.
错：觉得实验没有意义 | 他说每次都有收获，不是没有意义。 | He says each try teaches him something.
错：很怀疑自己的能力 | 他对自己很有信心，没有怀疑。 | He is confident, not doubting himself.
问：这个实验男的做了多少次了？
据：女的说“这个实验你已经做了二十多次了”。 | The woman says he has done it over twenty times.
答：二十多次
错：两次 | 她说的是二十多次，不是两次。 | She says over twenty, not two.
错：十几次 | 她说的是二十多次，不是十几次。 | She says over twenty, not ten-odd.
错：一百多次 | 她说的是二十多次，不是一百多次。 | She says over twenty, not over a hundred.

男：这座古镇保护得真好，很多房子都有几百年历史了。
女：前几年差点儿被推倒建新楼，是当地人一起反对，才保留下来的。
男：现在来这儿旅游的人这么多，大家应该很高兴吧。
女：也不全是。人一多，原来的安宁就没有了，有些老人就搬走了。
问：古镇是怎么保留下来的？
据：女的说“是当地人一起反对，才保留下来的”。 | The woman says it survived because the locals opposed demolition together.
答：当地人一起反对推倒
错：政府一直很重视 | 女的说的是当地人反对，没有说政府。 | She credits the locals, not the government.
错：有人花钱买了下来 | 对话没有说有人买下来。 | Nothing says someone bought it.
错：游客要求保留 | 是当地人反对的，不是游客。 | It was the locals, not tourists.
问：女的对古镇的旅游怎么看？
据：男的说大家应该很高兴，女的说“也不全是。人一多，原来的安宁就没有了”。 | The man assumes people are happy; she says not entirely, as crowds have ended the peace.
答：有好处也有问题
错：完全是好事 | 她说“也不全是”，不是完全好事。 | She says not entirely, so not wholly good.
错：应该马上停止 | 她只说了问题，没有说要停止旅游。 | She notes problems but does not call for a halt.
错：游客还不够多 | 她说人太多了，不是不够多。 | She says there are too many people, not too few.

女：你学剪纸多久了？这只鸟剪得跟真的一样。
男：跟我外公学的，从小就学，已经十几年了。
问：男的的剪纸是跟谁学的？
据：男的说“跟我外公学的”。 | The man says he learned from his maternal grandfather.
答：外公
错：学校的老师 | 他说的是外公，不是学校老师。 | He says his grandfather, not a teacher.
错：网上的视频 | 他是从小跟外公学，没有说视频。 | He learned from his grandfather as a child, not from videos.
错：女的 | 夸他剪得好的是女的，不是教他的人。 | The woman praises him; she did not teach him.
问：男的学剪纸多长时间了？
据：男的说“从小就学，已经十几年了”。 | The man says he has learned since childhood, over ten years.
答：十几年
错：几个月 | 他说的是十几年，不是几个月。 | He says ten-odd years, not months.
错：两三年 | 他说的是十几年，不是两三年。 | He says ten-odd years, not two or three.
错：二十多年 | 他说的是十几年，不是二十多年。 | He says ten-odd years, not twenty-odd.

男：现在年轻人都不爱听戏曲了，这门艺术会不会慢慢消失？
女：我倒不这么担心。最近有不少剧团把戏曲和流行音乐放在一起，很受青年人欢迎。
男：那会不会失去原来的味道？
女：基本的东西不变就行，传统也需要一点儿新的形式。
问：女的为什么不担心戏曲会消失？
据：女的说剧团把戏曲和流行音乐放在一起，“很受青年人欢迎”。新的形式吸引了年轻人。 | The woman says troupes now blend opera with pop music, and young people love it: the new forms draw them.
答：新的形式吸引了年轻人
错：年轻人本来就爱听戏曲 | 男的说年轻人都不爱听了，女的没有反驳这一点。 | The man says the young no longer care, and she does not dispute that.
错：政府会保护戏曲 | 对话没有说政府。 | The government is never mentioned.
错：戏曲永远不会变 | 女的说传统需要新的形式，不是永远不变。 | She says tradition needs new forms, not that it never changes.
问：男的担心什么？
据：男的问“那会不会失去原来的味道”。 | The man asks whether it will lose its original flavour.
答：戏曲失去原来的味道
错：剧团没有钱 | 对话没有说剧团的钱。 | The troupes' money is never mentioned.
错：流行音乐不好听 | 男的没有说流行音乐不好听。 | He does not criticise pop music.
错：自己听不懂戏曲 | 他担心的是戏曲变味，不是自己听不懂。 | He worries about the art changing, not about understanding it.

女：你在国外的时候，跟家里人怎么联系？
男：以前是写信，一封信要走一个月；后来有了网络，天天都能视频。
问：男的跟家里人联系的方式有什么变化？
据：男的说“以前是写信……后来有了网络，天天都能视频”。 | The man says he used to write letters, and later with the internet they video-called daily.
答：从写信变成视频
错：从视频变成写信 | 顺序说反了：是从写信到视频。 | The order is reversed: from letters to video.
错：一直写信 | 后来有了网络就不写信了。 | Once online, he no longer wrote.
错：一直打电话 | 他说的是写信和视频，没有说打电话。 | He speaks of letters and video, not phone calls.
问：以前一封信要多久才能寄到？
据：男的说“一封信要走一个月”。 | The man says a letter took a month.
答：一个月
错：一个星期 | 他说的是一个月，不是一个星期。 | He says a month, not a week.
错：一天 | 他说的是一个月，不是一天。 | He says a month, not a day.
错：一年 | 他说的是一个月，不是一年。 | He says a month, not a year.

女：你最近看起来精神多了，是怎么做到的？
男：我改了作息，每天早睡早起，晚上十一点以后就不看手机了。
女：我也想这样，可一躺下就忍不住拿起手机。
男：你可以把手机放在客厅里，开始几天难一点儿，习惯了就好了。
问：男的最近有什么变化？
据：女的说“你最近看起来精神多了”。 | The woman says he looks much livelier lately.
答：比以前有精神
错：变瘦了 | 对话没有说瘦。 | Weight is never mentioned.
错：换了工作 | 他改的是作息，不是工作。 | He changed his sleep schedule, not his job.
错：搬了家 | 对话没有说搬家。 | Moving is never mentioned.
问：男的晚上十一点以后不做什么？
据：男的说“晚上十一点以后就不看手机了”。 | The man says after eleven he no longer looks at his phone.
答：不看手机
错：不吃东西 | 他说的是手机，不是吃东西。 | He says the phone, not eating.
错：不工作 | 他说的是手机，不是工作。 | He says the phone, not work.
错：不喝茶 | 他说的是手机，不是喝茶。 | He says the phone, not tea.
问：男的建议女的怎么做？
据：男的说“你可以把手机放在客厅里”。 | The man suggests leaving the phone in the sitting room.
答：睡前把手机放在客厅
错：晚上十一点就睡觉 | 十一点是男的自己不看手机的时间，他给女的的建议是手机放客厅。 | Eleven is his own phone cut-off; his advice to her is the sitting room.
错：每天早上去跑步 | 对话没有说跑步。 | Running is never mentioned.
错：少喝一点儿咖啡 | 对话没有说咖啡。 | Coffee is never mentioned.
`,
  },
  {
    unit: 12,
    data: `
男：网上都在传，说我们这条街要建地铁站了，是真的吗？
女：我看是小道消息。我查了市政府的官网，根本没有这方面的通知。
问：女的认为那个消息怎么样？
据：女的说“我看是小道消息。我查了市政府的官网，根本没有这方面的通知”。 | The woman calls it hearsay; the city website has no such notice.
答：没有根据，不可信
错：肯定是真的 | 她说是小道消息，不是真的。 | She calls it hearsay, not true.
错：是政府发布的 | 她查了官网，政府没有发布。 | She checked; the government issued nothing.
错：很快就会证实 | 她说根本没有通知，没有说会被证实。 | She says there is no notice at all, not that it will be confirmed.
问：女的是怎么判断的？
据：女的说“我查了市政府的官网”。 | The woman says she checked the city government's website.
答：查了官方网站
错：问了邻居 | 她没有说问邻居。 | She does not mention neighbours.
错：看了报纸 | 她查的是官网，不是报纸。 | She checked the website, not a paper.
错：给地铁公司打了电话 | 她没有说打电话。 | She does not mention phoning.

女：这篇报道只采访了一方，另一方的说法一句都没有。
男：是啊，这样写太片面了，读者很容易被误导。
女：我打算给报社写封信，建议他们把另一方的声音也补上。
问：他们觉得这篇报道有什么问题？
据：女的说“这篇报道只采访了一方，另一方的说法一句都没有”，男的说“太片面了”。 | The woman says the report interviewed only one side, and the man calls it one-sided.
答：只听了一方的说法
错：内容太长 | 他们没有说长短。 | Length is never mentioned.
错：用词太难 | 他们没有说用词。 | Word choice is never mentioned.
错：发表得太晚 | 他们没有说发表时间。 | Timing is never mentioned.
问：女的打算做什么？
据：女的说“我打算给报社写封信，建议他们把另一方的声音也补上”。 | The woman plans to write to the paper suggesting they add the other side.
答：给报社写信提建议
错：自己写一篇报道 | 她是让报社补上，不是自己写报道。 | She asks the paper to add it, not to write one herself.
错：不再订这份报纸 | 她没有说不订报纸。 | She does not say she will cancel.
错：去采访另一方 | 她让报社去补，不是自己去采访。 | She wants the paper to do it, not to interview anyone herself.

男：我每个月工资一到手，没几天就花光了，一分钱也攒不下来。
女：你先记一个月的账，看看钱都花在哪儿了。我以前也这样，记了账才发现，光外卖一个月就花了一千多。
男：一千多？那确实不少。
女：后来我自己做饭，一年就攒下了一万多块。
问：男的有什么问题？
据：男的说“没几天就花光了，一分钱也攒不下来”。 | The man says his pay is gone within days and he saves nothing.
答：存不下钱
错：工资太低 | 他没有说工资低，是花得快。 | He does not say his pay is low; he spends it fast.
错：不会做饭 | 做饭是女的后来的办法，没有说男的不会。 | Cooking was the woman's fix; nothing says he cannot cook.
错：欠了别人的钱 | 对话没有说欠钱。 | Debt is never mentioned.
问：女的建议男的先做什么？
据：女的说“你先记一个月的账，看看钱都花在哪儿了”。 | The woman says first to keep accounts for a month.
答：记账
错：少点外卖 | 少点外卖是她自己后来的做法，她让男的先记账。 | Cutting takeaways was her own later step; she tells him to keep accounts first.
错：换一份工作 | 她没有让他换工作。 | She does not tell him to change jobs.
错：去银行存钱 | 她没有说去银行。 | She does not mention a bank.
问：女的以前把很多钱花在了哪里？
据：女的说“光外卖一个月就花了一千多”。 | The woman says takeaways alone cost her over a thousand a month.
答：外卖
错：买衣服 | 她没有说衣服。 | She does not mention clothes.
错：旅行 | 她没有说旅行。 | She does not mention travel.
错：交房租 | 她没有说房租。 | She does not mention rent.

女：这件大衣原价两千，现在打五折，你要不要买？
男：便宜是便宜，可我已经有两件了，买回去也穿不上几次。
问：男的为什么不买这件大衣？
据：男的说“我已经有两件了，买回去也穿不上几次”。 | The man says he already has two and would hardly wear it.
答：已经有了，用处不大
错：价格还是太贵 | 他说“便宜是便宜”，价钱不是问题。 | He grants it is cheap.
错：颜色不喜欢 | 对话没有说颜色。 | Colour is never mentioned.
错：大小不合适 | 对话没有说大小。 | Size is never mentioned.
问：这件大衣现在卖多少钱？
据：女的说“原价两千，现在打五折”。两千的一半是一千。 | The woman says it was two thousand and is now half price: one thousand.
答：一千
错：两千 | 两千是原价。 | Two thousand is the original price.
错：五百 | 打五折是两千的一半，一千，不是五百。 | Half of two thousand is one thousand, not five hundred.
错：一千五 | 一千五是打七五折，不是五折。 | Fifteen hundred would be 25 per cent off, not half.

男：我女儿看同学都用名牌书包，也要我给她买一个。
女：孩子之间攀比很正常，你可以跟她好好谈谈，书包好不好用比牌子重要。
男：我怕她在同学面前没面子。
女：那你让她自己攒零花钱，攒够了再买，她就知道钱来得不容易了。
问：男的的女儿想要什么？
据：男的说女儿看同学用名牌书包，“也要我给她买一个”。 | The man says his daughter sees classmates' designer bags and wants one.
答：名牌书包
错：新手机 | 她要的是书包，不是手机。 | She wants a bag, not a phone.
错：更多零花钱 | 零花钱是女的建议让她攒的，不是她要的。 | Pocket money is in the woman's plan, not the daughter's request.
错：漂亮衣服 | 她要的是书包，不是衣服。 | She wants a bag, not clothes.
问：女的建议怎么做？
据：女的说“你让她自己攒零花钱，攒够了再买”。 | The woman says let her save her own pocket money and buy it when she has enough.
答：让女儿自己攒钱买
错：马上给女儿买 | 她让女儿自己攒够了再买，不是马上买。 | She says wait until the girl has saved, not buy now.
错：不给女儿零花钱 | 她让女儿攒零花钱，要有零花钱才能攒。 | Saving needs pocket money, so she keeps it.
错：让女儿换一所学校 | 对话没有说换学校。 | Changing schools is never mentioned.

女：你跟小张不是好朋友吗？最近怎么不说话了？
男：上次聚会他当着大家的面开我的玩笑，我觉得很没面子。
女：他那个人说话就是不注意，其实没有坏心。你们见面把话说开就好了。
男：好吧，我这个周日约他出来吃个饭。
问：男的为什么不理小张？
据：男的说“上次聚会他当着大家的面开我的玩笑，我觉得很没面子”。 | The man says Xiao Zhang joked about him in front of everyone at the party.
答：小张当众开他玩笑
错：小张借钱不还 | 对话没有说借钱。 | Money is never mentioned.
错：小张说他坏话 | 小张是开玩笑，不是说坏话。 | He joked; he did not slander.
错：小张没来聚会 | 小张在聚会上开了玩笑，说明他去了。 | He joked at the party, so he was there.
问：女的怎么看小张？
据：女的说“他那个人说话就是不注意，其实没有坏心”。 | The woman says he is careless in speech but means no harm.
答：说话不注意，但没有坏心
错：是一个很冷漠的人 | 她没有说他冷漠。 | She does not call him cold.
错：故意让男的没面子 | 她说他没有坏心，不是故意的。 | She says he meant no harm.
错：不值得交朋友 | 她让他们把话说开，还是朋友。 | She wants them to talk it out and stay friends.
问：男的最后决定怎么做？
据：男的说“我这个周日约他出来吃个饭”，就是照女的说的见面把话说开。 | The man says he will ask him to dinner on Sunday, to talk it out as she suggested.
答：约小张吃饭，把话说开
错：以后不再理小张 | 他要约小张吃饭，不是不理。 | He will invite him, not shun him.
错：请女的帮忙传话 | 他自己去约，不是请女的传话。 | He will invite him himself, not use the woman as a go-between.
错：在聚会上批评小张 | 他是约出来吃饭谈，不是在聚会上批评。 | He will talk over dinner, not criticise him at a party.

男：你和你的室友住了四年，从来没吵过架？
女：没有。我们刚住在一起就定了几条规定，谁也不影响谁，有事就直接说。
问：女的和室友为什么相处得好？
据：女的说“我们刚住在一起就定了几条规定，谁也不影响谁，有事就直接说”。 | The woman says they set some rules at the start and speak frankly.
答：一开始就定了规定
错：她们性格完全一样 | 她没有说性格一样。 | She does not say they are alike.
错：她们很少见面 | 对话没有说很少见面。 | Nothing says they rarely meet.
错：室友什么都听她的 | 她说的是规定，不是室友听她的。 | She speaks of rules, not of the roommate obeying her.
问：女的和室友住在一起多久了？
据：男的说“你和你的室友住了四年”，女的没有否认。 | The man says they have lived together four years, and she does not deny it.
答：四年
错：一年 | 男的说的是四年，不是一年。 | He says four years, not one.
错：两年 | 男的说的是四年，不是两年。 | He says four years, not two.
错：十年 | 男的说的是四年，不是十年。 | He says four years, not ten.

女：这次音乐会的票真难买，我在网上等了半个小时才抢到两张。
男：听说那位钢琴家很少来中国演出，大家当然都想去。
女：可惜位子在最后一排，看不清楚。
男：没关系，音乐会主要是听，坐在后面效果也不差。
问：音乐会的票为什么难买？
据：男的说“那位钢琴家很少来中国演出，大家当然都想去”。 | The man says the pianist rarely plays in China, so everyone wants to go.
答：那位钢琴家很少来演出
错：票价太便宜 | 对话没有说票价。 | Price is never mentioned.
错：音乐厅太小 | 对话没有说音乐厅大小。 | Hall size is never mentioned.
错：只在现场卖票 | 女的是在网上抢到的票。 | She got hers online.
问：女的买到了几张票？
据：女的说“我在网上等了半个小时才抢到两张”。 | The woman says she waited half an hour online to snatch two.
答：两张
错：一张 | 她说的是两张，不是一张。 | She says two, not one.
错：三张 | 她说的是两张，不是三张。 | She says two, not three.
错：没买到 | 她说抢到了两张。 | She says she got two.
问：男的对座位是什么看法？
据：男的说“音乐会主要是听，坐在后面效果也不差”。 | The man says a concert is mainly for listening, so the back is fine.
答：坐后面也不影响听
错：应该换前面的票 | 他说后面也不差，没有要换票。 | He says the back is fine; no need to swap.
错：后面的票太贵了 | 对话没有说后面的票价钱。 | The price of back seats is never mentioned.
错：最好不要去了 | 他说没关系，不是不去。 | He says it does not matter, not to stay home.

男：你演的那个反派太像了，我女儿看完都有点儿怕你。
女：哈哈，那说明我演成功了。其实我平时是个很温和的人。
问：男的的女儿为什么怕女的？
据：男的说“你演的那个反派太像了，我女儿看完都有点儿怕你”。 | The man says she played the villain so well that his daughter is a bit afraid of her.
答：女的把反派演得很像
错：女的平时很严厉 | 女的说自己平时很温和。 | She says she is gentle in daily life.
错：女的说话声音很大 | 对话没有说声音大。 | A loud voice is never mentioned.
错：女的批评过她 | 对话没有说批评过她。 | Nothing says she scolded the girl.
问：女的说自己平时是什么样的人？
据：女的说“其实我平时是个很温和的人”。 | The woman says she is actually very gentle in daily life.
答：很温和
错：很严厉 | 严厉是她演的反派给人的感觉，不是她平时。 | Sternness is the villain's air, not hers.
错：很害怕 | 害怕的是男的女儿，不是她。 | It is the daughter who is afraid, not she.
错：很冷漠 | 她说温和，不是冷漠。 | She says gentle, not cold.

女：明天就要正式演出了，今天的彩排怎么样？
男：别的都还好，就是灯光和音乐配合得不太好，有两次灯亮早了。
女：那今晚得再练几遍，不能出问题。
男：我已经通知灯光师留下来了。
问：彩排时出了什么问题？
据：男的说“就是灯光和音乐配合得不太好，有两次灯亮早了”。 | The man says the lights and music were out of step; twice the lights came on early.
答：灯光和音乐没配合好
错：演员忘了台词 | 对话没有说演员忘台词。 | Forgotten lines are never mentioned.
错：音乐声音太小 | 他说的是配合，不是音乐声音小。 | He speaks of timing, not volume.
错：道具坏了 | 对话没有说道具。 | Props are never mentioned.
问：男的已经做了什么？
据：男的说“我已经通知灯光师留下来了”。 | The man says he has told the lighting technician to stay.
答：通知灯光师留下来
错：换了一个灯光师 | 他通知灯光师留下，没有换人。 | He asked the technician to stay, not replaced him.
错：推迟了演出时间 | 明天就要正式演出，没有说推迟。 | The show is tomorrow; nothing says it moves.
错：取消了今晚的练习 | 他让灯光师留下就是要练习，不是取消。 | Keeping him back is for practice, not to cancel it.

男：暑假我想去西北看沙漠，你去过吗？
女：去过，景色特别美，不过白天晒，晚上冷，温差很大，衣服要多带几件。
问：女的提醒男的注意什么？
据：女的说“白天晒，晚上冷，温差很大，衣服要多带几件”。 | The woman says it is scorching by day and cold at night, so bring extra clothes.
答：白天晚上温差大，多带衣服
错：沙漠里没有水 | 她没有说没有水。 | She does not mention water.
错：暑假游客太多 | 她没有说游客多。 | She does not mention crowds.
错：路上不安全 | 她没有说安全。 | She does not mention safety.
问：男的打算什么时候去西北？
据：男的说“暑假我想去西北看沙漠”。 | The man says he wants to see the desert in the summer holidays.
答：暑假
错：寒假 | 他说的是暑假，不是寒假。 | He says summer, not winter holidays.
错：春节 | 他说的是暑假，不是春节。 | He says summer, not Spring Festival.
错：明天 | 他说的是暑假，不是明天。 | He says summer, not tomorrow.

女：我们自己开车去海边吧，比跟团自由多了。
男：自由是自由，可是路那么远，我们俩轮流开也得十个小时。
女：那我们中间在古镇住一晚，顺便玩一天。
男：这个主意好，就这么定了。
问：男的开始时担心什么？
据：男的说“路那么远，我们俩轮流开也得十个小时”。 | The man says the road is long, ten hours even taking turns.
答：路太远，开车太累
错：跟团太贵 | 男的没有说跟团贵，女的说的是自己开车更自由。 | Tour prices are never discussed; she only says driving is freer.
错：海边天气不好 | 对话没有说天气。 | Weather is never mentioned.
错：古镇没有地方住 | 古镇是女的后来的主意，男的没有担心住的地方。 | The old town is her later idea, and lodging is not his worry.
问：他们最后决定怎么去？
据：女的说“我们中间在古镇住一晚，顺便玩一天”，男的说“就这么定了”。 | She suggests a night in an old town on the way, and he says it is settled.
答：自己开车，中间在古镇住一晚
错：跟旅游团一起去 | 女的一开始就说自己开车比跟团好。 | She opens by preferring the car to a tour.
错：坐飞机去 | 对话没有说飞机。 | Flying is never mentioned.
错：一天开到海边 | 他们要在古镇住一晚，不是一天开到。 | They will stop a night, not drive it in one day.

男：你说读书多的人一定更有能力吗？
女：不一定。读书多只能说明知道得多，能不能用到生活中，那是另一回事。
男：可是不读书，能力从哪儿来呢？
女：我不是说读书没用，而是说光读书不够，还要实践。
问：女的的观点是什么？
据：女的说“我不是说读书没用，而是说光读书不够，还要实践”。 | The woman says she does not mean reading is useless, only that reading alone is not enough; one must practise.
答：读书重要，但还要实践
错：读书没有用 | 她说“我不是说读书没用”。 | She says she does not mean reading is useless.
错：读书多就有能力 | 她说“不一定”，读书多不一定有能力。 | She says not necessarily, so reading does not guarantee ability.
错：能力是天生的 | 她没有说能力是天生的。 | She does not call ability innate.
问：女的说"那是另一回事"，是什么意思？
据：女的说读书多只说明知道得多，“能不能用到生活中，那是另一回事”。另一回事就是知道和会用不一样。 | She says reading shows how much one knows, but using it in life is another matter: knowing is not using.
答：知道得多不等于会用
错：读书和生活没有关系 | 她没有说读书和生活没有关系，只说知道不等于会用。 | She does not cut reading off from life; she says knowing is not using.
错：她不想讨论这个问题 | 她接着讨论下去了，不是不想讨论。 | She keeps discussing, so she is not avoiding it.
错：男的说得完全对 | 她说“不一定”，是不同意男的。 | She says not necessarily, so she disagrees with him.

女：你凭什么说这个产品不好？你又没用过。
男：网上很多人都这么说。
女：网上的评价有真有假，你得自己试一试，或者看看专业的测评，才能下结论。
问：女的认为男的的问题在哪里？
据：女的说“你凭什么说这个产品不好？你又没用过”，又说要自己试或看测评“才能下结论”。 | The woman asks what grounds he has, not having used it, and says he must test it or read reviews before concluding.
答：没有根据就下结论
错：用过产品却不说实话 | 男的没用过产品。 | He has never used it.
错：不相信网上的评价 | 男的正是相信了网上的评价。 | He does rely on online reviews.
错：太相信专业测评 | 专业测评是女的建议看的，男的没有看。 | Expert reviews are her suggestion; he has not read any.
问：女的建议怎么判断一个产品？
据：女的说“你得自己试一试，或者看看专业的测评，才能下结论”。 | The woman says test it yourself or read expert reviews before deciding.
答：自己试用或看专业测评
错：只看网上的评价 | 她说网上的评价有真有假，不能只看。 | She says online reviews are mixed, so not to rely on them.
错：问身边的朋友 | 她没有说问朋友。 | She does not mention friends.
错：看产品的价格 | 她没有说看价格。 | She does not mention price.

男：这次辩论你们队为什么输了？
女：对方的例子特别多，我们只会讲大道理，听起来很空。
问：女的认为输的原因是什么？
据：女的说“对方的例子特别多，我们只会讲大道理，听起来很空”。 | The woman says the other side had many examples, while they only spoke in generalities.
答：缺少具体的例子
错：对方讲的道理更多 | 讲大道理的是她们自己，对方的长处是例子多。 | The generalities were theirs; the other side's strength was examples.
错：她们准备时间太短 | 她没有说准备时间。 | She does not mention preparation time.
错：裁判不公正 | 她没有说裁判。 | She does not mention the judges.
问：女的觉得自己队的发言听起来怎么样？
据：女的说“我们只会讲大道理，听起来很空”。 | The woman says they only spoke in generalities, which sounded empty.
答：很空
错：很具体 | 她说很空，和具体正好相反。 | She says empty, the opposite of concrete.
错：例子很多 | 例子多的是对方。 | It was the other side that had examples.
错：太长了 | 她没有说长短。 | She does not mention length.
`,
  },
];
