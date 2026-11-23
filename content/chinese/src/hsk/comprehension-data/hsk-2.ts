// The dialogues, talks and passages of HSK 2 with their questions (docs/chinese-curriculum.md §8.5), written for this package in the characters of the levels it tests; none is taken from a test.

import type { ComprehensionData } from "../comprehension.ts";

/** comprehension are the dialogues and passages of HSK 2. */
export const comprehension: ComprehensionData = {
  dialogues: {
    short: `
女：你的感冒好了吗？
男：好多了，已经不发烧了。
问：男的现在怎么样？
据：男的说“好多了，已经不发烧了”。 | The man says he is much better and no longer feverish.
答：好多了
错：还在发烧 | 他说“已经不发烧了”。 | He says the fever is gone.
错：感冒更重了 | 他说好多了，不是更重了。 | He says much better, not worse.

女：这条裤子太长了，有短一点儿的吗？
男：有，您试试这条蓝色的。
问：女的觉得裤子怎么样？
据：女的说“这条裤子太长了”。 | The woman says these trousers are too long.
答：太长了
错：太短了 | 她说的是太长，和太短相反。 | She says too long, the opposite of too short.
错：颜色不好看 | 她说的是长短，没有说颜色。 | She speaks of length, not colour.

女：你怎么又迟到了？
男：对不起，路上车太多了。
问：男的为什么迟到？
据：男的说“对不起，路上车太多了”。 | The man says there was too much traffic.
答：路上车太多
错：他起床晚了 | 他没有说起床晚。 | He does not say he overslept.
错：他忘了时间 | 他没有说忘了时间。 | He does not say he forgot the time.

女：你把我的笔放在哪儿了？
男：在桌子上，电脑左边。
问：笔在哪儿？
据：男的说“在桌子上，电脑左边”。 | The man says it is on the desk, left of the computer.
答：桌子上
错：床上 | 他说的是桌子上，不是床上。 | He says the desk, not the bed.
错：书包里 | 他说的是桌子上，不是书包里。 | He says the desk, not the bag.

女：这个汤有点儿辣，你能吃吗？
男：没问题，我很喜欢吃辣的。
问：男的是什么意思？
据：男的说“没问题，我很喜欢吃辣的”。 | The man says no problem; he loves spicy food.
答：他能吃辣的
错：他不吃辣的 | 他说很喜欢吃辣的。 | He says he loves it spicy.
错：汤不辣 | 女的说汤“有点儿辣”。 | The woman says the soup is a bit spicy.

女：你搬到哪儿去了？
男：我搬到公司附近了，走路五分钟。
问：男的现在住在哪儿？
据：男的说“我搬到公司附近了”。 | The man says he moved near his company.
答：公司附近
错：学校附近 | 他说的是公司，不是学校。 | He says the company, not a school.
错：火车站附近 | 他说的是公司，不是火车站。 | He says the company, not the station.

女：你星期天常常做什么？
男：我常常去河边骑车。
问：男的星期天常常做什么？
据：男的说“我常常去河边骑车”。 | The man says he often cycles by the river.
答：去河边骑车
错：去河边游泳 | 他说的是骑车，不是游泳。 | He says cycling, not swimming.
错：在家看电视 | 他出去骑车，不在家。 | He goes out cycling, not stays in.

女：服务员，我们还要一瓶啤酒。
男：好的，马上就来。
问：女的要什么？
据：女的说“我们还要一瓶啤酒”。 | The woman asks for another bottle of beer.
答：一瓶啤酒
错：一碗汤 | 她说的是啤酒，不是汤。 | She says beer, not soup.
错：一杯咖啡 | 她说的是啤酒，不是咖啡。 | She says beer, not coffee.

女：你的房间真干净！
男：我昨天收拾了一下午。
问：男的昨天下午做什么了？
据：女的说房间真干净，男的说“我昨天收拾了一下午”，收拾的是房间。 | She praises the clean room, and he says he spent yesterday afternoon tidying it.
答：收拾房间
错：去买东西 | 他没有说买东西。 | He does not mention shopping.
错：在外边玩 | 他在收拾，不是在外边玩。 | He was tidying, not out playing.

女：我们几点在电影院门口见？
男：七点一刻吧，电影七点半开。
问：他们几点见？
据：男的说“七点一刻吧，电影七点半开”。 | The man says a quarter past seven; the film is at half past.
答：七点一刻
错：七点半 | 七点半是电影开始的时间。 | Half past seven is when the film starts.
错：七点 | 七点后面还有“一刻”。 | There is 一刻 after seven.

女：你哪儿不舒服？
男：我肚子疼，从早上到现在。
问：男的哪儿不舒服？
据：男的说“我肚子疼”。 | The man says his stomach hurts.
答：肚子
错：头 | 他说的是肚子，不是头。 | He says stomach, not head.
错：眼睛 | 他说的是肚子，不是眼睛。 | He says stomach, not eyes.

女：你的新邻居怎么样？
男：人很好，就是晚上声音太大。
问：男的觉得邻居怎么样？
据：男的说“人很好，就是晚上声音太大”。 | The man says they are nice, only too loud at night.
答：人好，可是声音太大
错：人不好，声音也大 | 他说人很好。 | He says they are nice.
错：人好，也很安静 | 他说声音太大，不安静。 | He says they are loud.

女：明天的会议你参加吗？
男：参加，我还要介绍一下新计划。
问：男的明天要做什么？
据：男的说“参加，我还要介绍一下新计划”。 | The man says he will attend and present the new plan.
答：在会上介绍新计划
错：不参加会议 | 他说“参加”。 | He says he will attend.
错：去旅游 | 对话没有说旅游。 | Travel is never mentioned.

女：你哥哥比你高吗？
男：不，我比他高一点儿。
问：谁更高？
据：男的说“不，我比他高一点儿”。 | The man says no, he is a little taller than his brother.
答：男的
错：男的哥哥 | 女的问哥哥是不是更高，男的说“不”。 | Asked if his brother is taller, he says no.
错：两个人一样高 | 他说比哥哥高一点儿，不一样高。 | He is a little taller, so not the same.

女：你的票订好了吗？
男：还没有，我准备明天订。
问：男的什么时候订票？
据：男的说“还没有，我准备明天订”。 | The man says not yet; he will book tomorrow.
答：明天
错：今天 | 他说的是明天，不是今天。 | He says tomorrow, not today.
错：已经订好了 | 他说“还没有”订。 | He says he has not booked.

女：这张照片是在哪儿拍的？
男：在海边，那天天气非常好。
问：照片是在哪儿拍的？
据：男的说“在海边”。 | The man says by the sea.
答：海边
错：山上 | 他说的是海边，不是山上。 | He says the sea, not a hill.
错：湖边 | 他说的是海边，不是湖边。 | He says the sea, not a lake.

女：你想吃饺子还是面条？
男：饺子吧，我已经很久没吃了。
问：男的想吃什么？
据：男的说“饺子吧，我已经很久没吃了”。 | The man says dumplings; he has not had them for ages.
答：饺子
错：面条 | 面条是女的问的另一种，他选了饺子。 | Noodles are the other choice; he picks dumplings.
错：米饭 | 对话没有说米饭。 | Rice is never mentioned.

女：你的狗真可爱，几岁了？
男：三岁了，最喜欢跟我出去玩。
问：狗几岁了？
据：男的说“三岁了”。 | The man says it is three.
答：三岁
错：两岁 | 他说的是三岁，不是两岁。 | He says three, not two.
错：四岁 | 他说的是三岁，不是四岁。 | He says three, not four.

女：去机场要多长时间？
男：坐出租车四十分钟左右。
问：去机场要多长时间？
据：男的说“坐出租车四十分钟左右”。 | The man says about forty minutes by taxi.
答：四十分钟左右
错：十四分钟左右 | 他说的是四十，不是十四。 | He says forty, sìshí, not fourteen.
错：一个小时左右 | 四十分钟不到一个小时。 | Forty minutes is less than an hour.

女：你篮球打得怎么样？
男：打得不太好，我更喜欢踢足球。
问：男的更喜欢什么？
据：男的说“我更喜欢踢足球”。 | The man says he prefers football.
答：踢足球
错：打篮球 | 他说篮球打得不太好，更喜欢足球。 | He says he is poor at basketball and prefers football.
错：游泳 | 对话没有说游泳。 | Swimming is never mentioned.

女：冰箱里还有牛奶吗？
男：没有了，我下班的时候去买。
问：男的什么时候去买牛奶？
据：男的说“我下班的时候去买”。 | The man says he will buy some after work.
答：下班的时候
错：上班以前 | 他说的是下班，不是上班以前。 | He says after work, not before.
错：现在 | 他说下班的时候，不是现在。 | He says after work, not now.

女：这个问题我还是不太懂。
男：没关系，我再给你讲一遍。
问：男的要做什么？
据：男的说“我再给你讲一遍”。 | The man says he will explain it once more.
答：再讲一遍
错：让女的问老师 | 他自己再讲，没有让她问老师。 | He explains himself, not sends her to the teacher.
错：不讲了 | 他说再讲一遍。 | He says he will explain again.

女：你这次考试考得怎么样？
男：别问了，比上次还差。
问：男的这次考得怎么样？
据：男的说“别问了，比上次还差”。 | The man says don't ask; it was worse than last time.
答：不好
错：很好 | 比上次还差，不好。 | Worse than last time is not good.
错：比上次好 | 他说比上次还差，不是好。 | He says worse, not better.

女：这件衣服有点儿旧了，换一件吧。
男：好，我穿那件绿色的。
问：男的要穿什么颜色的衣服？
据：男的说“我穿那件绿色的”。 | The man says he will wear the green one.
答：绿色
错：蓝色 | 他说的是绿色，不是蓝色。 | He says green, not blue.
错：黄色 | 他说的是绿色，不是黄色。 | He says green, not yellow.

女：外面刮风了，你带帽子了吗？
男：带了，在我的包里。
问：外面天气怎么样？
据：女的说“外面刮风了”。 | The woman says it is windy outside.
答：刮风了
错：下雨了 | 她说的是风，不是雨。 | She says wind, not rain.
错：很热 | 对话没有说热。 | Heat is never mentioned.

女：你学游泳学了多久了？
男：两个月了，现在能游一百米。
问：男的学游泳多长时间了？
据：男的说“两个月了”。 | The man says two months.
答：两个月
错：两年 | 他说的是两个月，不是两年。 | He says two months, not two years.
错：一个月 | 他说的是两个月，不是一个月。 | He says two months, not one.

女：你到哪儿了？我等你半天了。
男：我已经在饭馆门口了。
问：男的现在在哪儿？
据：男的说“我已经在饭馆门口了”。 | The man says he is already at the restaurant door.
答：饭馆门口
错：家里 | 他说已经在饭馆门口。 | He says he is at the restaurant.
错：公司里 | 他说的是饭馆，不是公司。 | He says the restaurant, not the office.

女：今天的作业你写完了吗？
男：写完了，我现在去打篮球。
问：男的作业怎么样了？
据：男的说“写完了”。 | The man says he has finished.
答：写完了
错：还没写 | 他说写完了。 | He says he has finished.
错：写了一半 | 他说写完了，不是一半。 | He says finished, not half done.

女：这家宾馆的房间怎么样？
男：又大又安静，就是有点儿贵。
问：男的觉得房间怎么样？
据：男的说“又大又安静，就是有点儿贵”。 | The man says it is big and quiet, only a bit dear.
答：大，安静，可是有点儿贵
错：小，可是很便宜 | 他说又大又贵，不是小和便宜。 | He says big and dear, not small and cheap.
错：大，可是不安静 | 他说很安静。 | He says it is quiet.

女：你妹妹现在在做什么工作？
男：她在一家旅游公司工作。
问：男的妹妹在哪儿工作？
据：男的说“她在一家旅游公司工作”。 | The man says she works at a travel company.
答：旅游公司
错：医院 | 他说的是旅游公司，不是医院。 | He says a travel company, not a hospital.
错：学校 | 他说的是旅游公司，不是学校。 | He says a travel company, not a school.

女：你给奶奶打电话了吗？
男：打了，她说她身体很好。
问：奶奶身体怎么样？
据：男的说“她说她身体很好”。 | The man says she says she is well.
答：很好
错：不太好 | 她说很好，不是不太好。 | She says well, not poorly.
错：感冒了 | 她说很好，没有说感冒。 | She says well; no cold is mentioned.

女：这个西瓜真甜啊！
男：是啊，是我在附近的小店买的。
问：西瓜怎么样？
据：女的说“这个西瓜真甜啊”，男的说“是啊”。 | The woman says the melon is sweet, and the man agrees.
答：很甜
错：不甜 | 她说真甜。 | She says it is sweet.
错：很酸 | 她说的是甜，不是酸。 | She says sweet, not sour.

女：路上小心，到了给我发个信息。
男：好的，你放心吧。
问：女的让男的做什么？
据：女的说“到了给我发个信息”。 | The woman says to send her a message when he arrives.
答：到了发信息
错：路上打电话 | 她说的是发信息，不是打电话。 | She says send a message, not call.
错：明天再来 | 她没有说明天再来。 | She does not say come tomorrow.
`,
    long: `
女：你最近怎么这么忙？
男：工作太多了，每天九点才下班。
女：那你要多休息，别太累了。
男：谢谢，下个月就好了。
问：男的最近怎么样？
据：女的问“你最近怎么这么忙”，男的说“工作太多了”。 | The woman asks why he is so busy, and he says there is too much work.
答：很忙
错：很舒服 | 他工作太多，不舒服。 | He is overworked, not comfortable.
错：生病了 | 他没有说生病。 | He does not say he is ill.
问：男的每天几点下班？
据：男的说“每天九点才下班”。 | The man says he leaves only at nine every day.
答：九点
错：五点 | 他说的是九点，不是五点。 | He says nine, not five.
错：七点 | 他说的是九点，不是七点。 | He says nine, not seven.
问：男的说什么时候就好了？
据：男的说“下个月就好了”。 | The man says it will be better next month.
答：下个月
错：下个星期 | 他说的是下个月，不是下个星期。 | He says next month, not next week.
错：明天 | 他说的是下个月，不是明天。 | He says next month, not tomorrow.

男：你好，我想租一个房子。
女：您想租在哪个区？
男：要离公司近，有两个房间。
女：好的，我这里有一个，一个月三千五。
问：男的想做什么？
据：男的说“我想租一个房子”。 | The man says he wants to rent a flat.
答：租房子
错：买房子 | 他说的是租，不是买。 | He says rent, not buy.
错：找工作 | 他提到公司是要离公司近，不是找工作。 | He mentions his company for location, not job hunting.
问：男的想要几个房间？
据：男的说“有两个房间”。 | The man says it should have two rooms.
答：两个
错：一个 | 他说的是两个，不是一个。 | He says two, not one.
错：三个 | 他说的是两个，不是三个。 | He says two, not three.
问：这个房子一个月多少钱？
据：女的说“一个月三千五”。 | The woman says 3,500 a month.
答：三千五
错：三千 | 三千后面还有五百。 | There is five hundred more after three thousand.
错：五千三 | 数字说反了：是三千五，不是五千三。 | The digits are swapped: 3,500, not 5,300.

女：我们星期天去爬山吧！
男：好啊，可是听说星期天要下雨。
女：那我们星期五下午去，怎么样？
男：没问题，我请半天假。
问：女的想星期天做什么？
据：女的说“我们星期天去爬山吧”。 | The woman suggests climbing on Sunday.
答：爬山
错：游泳 | 她说的是爬山，不是游泳。 | She says climbing, not swimming.
错：看电影 | 她说的是爬山，不是看电影。 | She says climbing, not a film.
问：他们为什么不星期天去？
据：男的说“可是听说星期天要下雨”。 | The man says he heard it will rain on Sunday.
答：星期天要下雨
错：星期天要上班 | 男的说的是下雨，不是上班；他要请假的是星期五。 | He says rain, not work; his leave is for Friday.
错：星期天太累 | 他没有说累。 | He does not mention tiredness.
问：男的星期五下午要怎么做？
据：男的说“没问题，我请半天假”。 | The man says no problem; he will take half a day off.
答：请半天假
错：去上班 | 他要请假，不上班。 | He takes leave, so not working.
错：去买东西 | 他请假是去爬山，不是买东西。 | He takes leave to climb, not shop.

男：服务员，我们点菜。
女：好的，你们想吃什么？
男：一个鱼，一个羊肉，再要两碗米饭。
女：鱼要等二十分钟，可以吗？
问：他们在哪儿？
据：男的叫“服务员，我们点菜”，点了鱼、羊肉和米饭。点菜是在饭馆。 | The man calls the waiter to order fish, lamb and rice: ordering dishes happens in a restaurant.
答：饭馆
错：商店 | 商店里不点菜。 | No dishes are ordered in a shop.
错：宾馆 | 宾馆的服务员不点鱼和羊肉。 | Hotel staff do not take orders for fish and lamb here.
问：男的没点什么？
据：男的点了“一个鱼，一个羊肉，再要两碗米饭”，里面没有猪肉。 | The man orders fish, lamb and two bowls of rice; there is no pork.
答：猪肉
错：鱼 | 他点了鱼。 | He orders fish.
错：羊肉 | 他点了羊肉。 | He orders lamb.
问：鱼要等多长时间？
据：女的说“鱼要等二十分钟”。 | The woman says the fish takes twenty minutes.
答：二十分钟
错：十分钟 | 她说的是二十分钟，不是十分钟。 | She says twenty minutes, not ten.
错：半个小时 | 二十分钟不到半个小时。 | Twenty minutes is less than half an hour.

女：你的眼睛怎么红了？
男：我昨天晚上玩电脑玩到两点。
女：你不能这样，对眼睛不好。
男：我知道了，以后早点儿睡。
问：男的眼睛为什么红了？
据：男的说“我昨天晚上玩电脑玩到两点”。 | The man says he was on the computer until two last night.
答：玩电脑玩得太晚
错：他哭了 | 他没有说哭。 | He does not say he cried.
错：他生病了 | 他没有说生病。 | He does not say he is ill.
问：女的觉得怎么样？
据：女的说“你不能这样，对眼睛不好”。 | The woman says he cannot go on like this; it is bad for his eyes.
答：这样对眼睛不好
错：玩电脑没关系 | 她说“你不能这样”。 | She says he cannot do this.
错：男的应该多玩 | 她让他别这样，不是多玩。 | She tells him to stop, not play more.
问：男的以后会怎么做？
据：男的说“我知道了，以后早点儿睡”。 | The man says he understands and will go to bed earlier.
答：早点儿睡
错：多玩电脑 | 他说早点儿睡，不是多玩。 | He says sleep earlier, not play more.
错：去医院 | 他没有说去医院。 | He does not mention a hospital.

女：你去过上海吗？
男：去过一次，去年和家人去的。
女：你觉得那儿怎么样？
男：很漂亮，可是夏天太热了。
问：男的去过几次上海？
据：男的说“去过一次”。 | The man says he has been once.
答：一次
错：两次 | 他说的是一次，不是两次。 | He says once, not twice.
错：没去过 | 他说去过一次。 | He says he has been once.
问：男的和谁去的上海？
据：男的说“去年和家人去的”。 | The man says he went last year with his family.
答：家人
错：同学 | 他说的是家人，不是同学。 | He says family, not classmates.
错：同事 | 他说的是家人，不是同事。 | He says family, not colleagues.
问：男的觉得上海的夏天怎么样？
据：男的说“可是夏天太热了”。 | The man says the summer is too hot.
答：太热了
错：很凉快 | 他说太热，不是凉快。 | He says too hot, not cool.
错：常常下雪 | 他说的是夏天热，没有说雪。 | He speaks of summer heat, not snow.

男：这件红色的裙子你穿很漂亮。
女：真的吗？可是有点儿短。
男：那试试这件黄色的，长一点儿。
女：这件很合适，就买这件吧。
问：女的觉得红裙子怎么样？
据：女的说“可是有点儿短”。 | The woman says it is a bit short.
答：有点儿短
错：太长了 | 她说的是短，和长相反。 | She says short, the opposite of long.
错：颜色不好 | 男的说红色很漂亮，她嫌的是短。 | The man praises the red; her complaint is length.
问：女的最后买了什么颜色的裙子？
据：男的让她试黄色的，女的说“这件很合适，就买这件吧”。 | He suggests the yellow one, and she says it fits and she will buy it.
答：黄色
错：红色 | 红色的有点儿短，她没买。 | The red is a bit short; she does not buy it.
错：蓝色 | 对话没有说蓝色。 | Blue is never mentioned.

女：你认识新来的李经理吗？
男：认识，他以前在北京工作。
女：听说他人很好。
男：是，他对大家都很好，也很喜欢帮助人。
问：新来的人是谁？
据：女的问“你认识新来的李经理吗”。 | The woman asks if he knows the new manager Li.
答：李经理
错：张老师 | 她说的是李经理，不是张老师。 | She says Manager Li, not Teacher Zhang.
错：马医生 | 她说的是李经理，不是马医生。 | She says Manager Li, not Doctor Ma.
问：女的听说李经理怎么样？
据：女的说“听说他人很好”。 | The woman says she hears he is very nice.
答：人很好
错：很忙 | 她没有说忙。 | She does not say busy.
错：不爱说话 | 她没有说不爱说话。 | She does not say quiet.
问：李经理以前在哪儿工作？
据：男的说“他以前在北京工作”。 | The man says he used to work in Beijing.
答：北京
错：上海 | 他说的是北京，不是上海。 | He says Beijing, not Shanghai.
错：南京 | 他说的是北京，不是南京。 | He says Beijing, not Nanjing.

女：明天是小红的生日，我们送她什么？
男：送她一本书吧，她很爱看书。
女：她书已经很多了，送个蛋糕吧。
男：好，再给她写几句祝福的话。
问：明天是谁的生日？
据：女的说“明天是小红的生日”。 | The woman says tomorrow is Xiaohong's birthday.
答：小红
错：女的 | 是小红的，不是女的自己的。 | It is Xiaohong's, not the woman's.
错：男的 | 是小红的，不是男的的。 | It is Xiaohong's, not the man's.
问：女的为什么不想送书？
据：女的说“她书已经很多了”。 | The woman says she already has many books.
答：小红的书已经很多了
错：书太贵了 | 对话没有说价钱。 | Price is never mentioned.
错：小红不爱看书 | 男的说她很爱看书。 | The man says she loves reading.

男：你怎么还没出门？已经八点了！
女：我找不到我的手机了。
男：你看看床上，你昨天晚上在床上玩了。
女：找到了！在床下面。
问：女的为什么还没出门？
据：女的说“我找不到我的手机了”。 | The woman says she cannot find her phone.
答：在找手机
错：在吃早饭 | 她在找手机，不是吃早饭。 | She is hunting her phone, not eating.
错：在洗澡 | 她在找手机，不是洗澡。 | She is hunting her phone, not showering.
问：手机最后在哪儿找到的？
据：女的说“找到了！在床下面”。 | The woman says she found it under the bed.
答：床下面
错：床上 | 床上是男的让她看的地方，手机在床下面。 | The bed is where he told her to look; it was under it.
错：桌子上 | 对话没有说桌子。 | The table is never mentioned.

女：你每天怎么锻炼身体？
男：我早上跑一个小时，晚上去游泳。
女：你天天都这样吗？
男：差不多，下雨的时候就在家里练。
问：男的早上做什么锻炼？
据：男的说“我早上跑一个小时”。 | The man says he runs an hour in the morning.
答：跑一个小时
错：游泳 | 游泳是晚上。 | Swimming is in the evening.
错：打篮球 | 对话没有说篮球。 | Basketball is never mentioned.
问：下雨的时候男的怎么做？
据：男的说“下雨的时候就在家里练”。 | The man says on rainy days he trains at home.
答：在家里练
错：去游泳 | 游泳是晚上平时做的，下雨在家练。 | Swimming is his usual evening; on rainy days he trains at home.
错：不锻炼 | 他在家练，不是不锻炼。 | He trains at home, so he still exercises.

男：你好，我想换一个房间。
女：先生，您的房间有什么问题吗？
男：空调不能用了，房间太热，我睡不着。
女：对不起，我马上给您换一个。
问：男的为什么想换房间？
据：男的说“空调不能用了，房间太热，我睡不着”。 | The man says the air conditioning does not work, it is too hot to sleep.
答：空调不能用了
错：房间太小 | 他没有说房间小。 | He does not say it is small.
错：房间太冷 | 他说太热，不是太冷。 | He says too hot, not too cold.
问：女的可能是做什么的？
据：男的要换房间，女的叫他“先生”，说“我马上给您换一个”。管房间、给客人换房的是宾馆服务员。 | He asks to change rooms, and she, calling him sir, offers a new one at once: hotel staff handle rooms.
答：宾馆服务员
错：医生 | 医生不给人换房间。 | Doctors do not change rooms.
错：老师 | 老师不给人换房间。 | Teachers do not change rooms.
问：女的会怎么做？
据：女的说“对不起，我马上给您换一个”。 | The woman apologises and says she will change it at once.
答：给男的换房间
错：让男的等明天 | 她说“马上”，不是明天。 | She says at once, not tomorrow.
错：让男的出去住 | 她给他换房间，不是让他出去住。 | She gives him another room, not sends him elsewhere.
`,
  },
  passages: {
    short: `
文：我每天早上六点起床，先刷牙洗脸，然后去公园跑半个小时，七点回家吃早饭。
问：他起床以后先做什么？
答：刷牙洗脸
错：去公园跑
错：吃早饭

文：我的邻居是一个医生，她工作很忙，可是对人很热情，常常帮助我们。
问：邻居是一个什么样的人？
答：很热情
错：不爱说话
错：不太忙

文：这家咖啡馆离学校很近，咖啡不贵，也很安静，所以很多学生来这里学习。
问：为什么很多学生来这里？
答：近，不贵，也安静
错：咖啡非常好喝
错：这里有很多书

文：昨天我去看了一场足球比赛，我喜欢的队赢了，我高兴得跳了起来。
问：他为什么很高兴？
答：他喜欢的队赢了
错：他踢了足球
错：他喜欢的队输了

文：我妈妈做菜很好吃，最好吃的是她做的鱼，又香又鲜，每次我都吃很多。
问：妈妈做的什么菜最好吃？
答：鱼
错：羊肉
错：鸡蛋

文：今天我有点儿发烧，没去上班。我在家喝了很多热水，睡了一天，现在好多了。
问：他今天为什么没去上班？
答：有点儿发烧
错：要去旅游
错：家里有事

文：我们公司下个月要搬到城市东边，那里离我家很远，我得早一个小时出门了。
问：公司搬家以后，他会怎么样？
答：要早一个小时出门
错：可以晚一个小时出门
错：不用坐车了

文：这本杂志很有意思，里面有很多漂亮的照片，我每个月都买一本。
问：他多长时间买一本杂志？
答：一个月
错：一个星期
错：一年

文：我的小狗很可爱，听到我回家的声音，就跑到门口等我。
问：小狗听到他回家会做什么？
答：跑到门口等他
错：跑到床下面
错：叫个不停

文：春天来了，天气变暖了，公园里的花都开了，很多人去那里拍照片。
问：现在是什么季节？
答：春天
错：夏天
错：秋天

文：我已经学了两年汉语了，能听懂老师说的话，可是写汉字还有点儿难。
问：他觉得什么还有点儿难？
答：写汉字
错：听老师说话
错：说汉语

文：我姐姐下个月要结婚了，我们全家都很高兴，我在帮她准备婚礼。
问：下个月谁要结婚？
答：他姐姐
错：他哥哥
错：他自己

文：这个城市的冬天不太冷，很少下雪，可是常常刮大风。
问：这个城市的冬天怎么样？
答：常常刮大风
错：常常下雪
错：非常冷

文：我上星期把手机忘在出租车上了，没想到司机第二天给我送回来了。
问：手机最后怎么样了？
答：司机送回来了
错：找不到了
错：他又买了一个

文：张老师讲课讲得很清楚，大家都很喜欢上她的课。
问：大家为什么喜欢张老师的课？
答：她讲得很清楚
错：她的课很短
错：她不给作业

文：我很少喝咖啡，因为喝了咖啡晚上就睡不着，我常常喝茶。
问：他为什么很少喝咖啡？
答：喝了晚上睡不着
错：咖啡太贵了
错：咖啡太苦了

文：我们班下星期五要去河边玩，每个人要带自己的饮料和吃的东西。
问：去玩的时候每个人要带什么？
答：饮料和吃的东西
错：照相机
错：钱

文：我家附近新开了一个商店，东西又多又便宜，我和妈妈常常去那儿。
问：新商店怎么样？
答：东西多，也便宜
错：东西少，很贵
错：离家很远

文：今天的作业很多，我从下午四点写到晚上十点才写完。
问：他写作业写了多长时间？
答：六个小时
错：四个小时
错：十个小时

文：我的电脑打不开了。我只能先用我弟弟的电脑。
问：他现在用谁的电脑？
答：弟弟的
错：自己的
错：同事的

文：这个房子虽然有点儿旧，但是房间很大，离地铁站也近，我很满意。
问：他觉得房子怎么样？
答：很满意
错：太旧了，不满意
错：离地铁站太远

文：小李每天都锻炼，他早上跑一个小时，晚上打篮球，身体非常好。
问：小李晚上做什么？
答：打篮球
错：跑
错：游泳

文：我第一次坐飞机的时候很紧张，现在坐了很多次，就不怕了。
问：他现在坐飞机怎么样？
答：不怕了
错：很紧张
错：从来没坐过

文：这条街上有很多饭馆，有中国菜，也有外国菜，每天晚上人都很多。
问：这条街上有什么？
答：很多饭馆
错：很多商店
错：很多学校

文：我的同事李明很爱笑，跟他在一起工作很快乐。
问：李明是一个什么样的人？
答：很爱笑
错：很爱哭
错：不爱说话

文：明天是妈妈的生日，我准备了一个蛋糕，还给她买了一些花。
问：他给妈妈准备了什么？
答：蛋糕和花
错：衣服和花
错：蛋糕和衣服

文：我昨天去书店买了一本汉语书，两百块，有点儿贵，可是很有用。
问：他觉得汉语书怎么样？
答：有点儿贵，可是有用
错：很便宜
错：没有用

文：这个星期天我不出去了，要在家打扫房间、洗衣服，还要准备下星期的考试。
问：这个星期天他要做什么？
答：在家做事，准备考试
错：出去玩
错：去朋友家

文：我爷爷很喜欢花，他房间里有很多花，有红的，也有黄的。
问：爷爷喜欢什么？
答：花
错：狗
错：鸟

文：这次旅游我们去了很多地方，看了很多漂亮的景色，拍了三百多张照片。
问：他们拍了多少张照片？
答：三百多张
错：三十多张
错：一百多张

文：我住在八层，每天上下楼都要走，所以每次回家都很累。
问：他为什么很累？
答：住在八层，要走上去
错：他工作太多
错：他住在一层

文：我不喜欢吃甜的东西，也不爱吃辣的，我最喜欢吃酸的。
问：他最喜欢吃什么样的东西？
答：酸的
错：甜的
错：辣的

文：我的朋友下星期要回国了，我们准备星期天一起吃个饭，跟她说再见。
问：朋友下星期要做什么？
答：回国
错：结婚
错：搬家
`,
    long: `
文：我叫李小东，是一名大学生。我每天做的事都差不多：早上七点起床，八点上课，中午在学校吃饭。下午没课的时候，我常常去图书馆看书。晚上我和同学一起打篮球，十一点睡觉。我觉得这样很好。
问：李小东是做什么的？
答：大学生
错：老师
错：医生
问：下午没课的时候他常常去哪儿？
答：图书馆
错：公园
错：商店
问：他晚上和同学做什么？
答：打篮球
错：看电影
错：踢足球

文：上个星期六，我和朋友去爬山。那天天气很好，不冷也不热。山上有很多树和花，还有一条小河。我们在山上吃了自己带的东西，拍了很多照片。下山的时候已经五点了，大家都很累，可是也很快乐。
问：他们什么时候去爬山的？
答：上个星期六
错：上个星期天
错：这个星期六
问：山上没有什么？
答：湖
错：树和花
错：小河
问：下山的时候他们觉得怎么样？
答：累，可是快乐
错：不累，也不快乐
错：很生气

文：我家附近有一个小饭馆，饭馆不大，只有六张桌子，可是菜很好吃。经理是南方人，他做的鱼又鲜又香。饭馆的服务员都很热情。我每个星期都去一两次。有时候人太多了，要等半个小时才有桌子。
问：饭馆有几张桌子？
答：六张
错：八张
错：十张
问：经理做的什么菜好吃？
答：鱼
错：羊肉
错：饺子
问：人多的时候要等多长时间？
答：半个小时
错：一个小时
错：十分钟

文：我的妹妹今年八岁，她非常喜欢动物。我们家有一只猫和一只狗，她每天都跟猫和狗一起玩。每天放学回家，她先给猫和狗吃东西，然后才写作业。她说长大以后想当动物医生。
问：妹妹今年多大？
答：八岁
错：六岁
错：十八岁
问：妹妹放学回家先做什么？
答：给猫和狗吃东西
错：写作业
错：看电视
问：妹妹长大以后想做什么？
答：动物医生
错：老师
错：服务员

文：我上个月搬家了。以前的房子离公司太远，每天坐车要一个半小时。现在的房子在公司附近，走路十分钟就到了。房子不大，有一个房间、一个客厅和一个小厨房，可是很干净，窗外还有一个小公园。
问：他为什么搬家？
答：以前的房子离公司太远
错：以前的房子太小
错：以前的房子太贵
问：现在他怎么去公司？
答：走路
错：坐车
错：骑车
问：新房子的窗外有什么？
答：一个小公园
错：一条河
错：一个商店

文：我很喜欢运动。我小时候常常和爸爸一起踢足球。上中学以后，我开了一个篮球队，每个星期练习三次。去年我们队参加了城市的比赛，得了第二名。现在我工作了，没有那么多时间，可是星期天还会去打球。
问：他小时候常常和谁踢足球？
答：爸爸
错：哥哥
错：同学
问：去年他们队在比赛中怎么样？
答：得了第二名
错：得了第一名
错：输了
问：他现在什么时候打球？
答：星期天
错：每天晚上
错：每天早上

文：昨天我感冒了，头疼，还有点儿发烧。我去医院看了医生。医生让我多喝水，多休息，还给我开了一些药，一天吃三次。回家以后我吃了药，睡了一个下午。今天早上起来，已经不发烧了。
问：昨天他怎么了？
答：感冒了
错：肚子疼
错：腿疼
问：药一天吃几次？
答：三次
错：两次
错：一次
问：他今天怎么样了？
答：不发烧了
错：还在发烧
错：病更重了

文：今年夏天，我们一家人去海边旅游了。我们坐了三个小时的火车，住在海边的一个宾馆里。每天上午我们在海里游泳，下午在宾馆休息，晚上去附近的饭馆吃海鲜。妈妈说这是她最快乐的一次旅游。
问：他们怎么去海边的？
答：坐火车
错：坐飞机
错：坐出租车
问：他们每天上午做什么？
答：在海里游泳
错：在宾馆休息
错：吃海鲜
问：妈妈觉得这次旅游怎么样？
答：最快乐
错：太累了
错：不太好

文：我在一家公司工作了五年。我的工作是给客人介绍公司的东西，所以每天要和很多人说话。工作虽然很忙，但是同事们对我很好，经理也常常帮助我。下个月我要去上海出差，那是我第一次去上海。
问：他在这家公司工作了多长时间？
答：五年
错：三年
错：五个月
问：他觉得同事们怎么样？
答：对他很好
错：不爱帮助人
错：太忙了
问：下个月他要去哪儿？
答：上海
错：北京
错：南京

文：我的朋友小雨是一个很有意思的人。她非常喜欢唱歌，也会跳舞。每次朋友过生日，她都会唱歌祝贺。她还很爱笑，跟她在一起，大家都很快乐。下个月她要参加学校的唱歌比赛，我们都希望她能赢。
问：小雨喜欢做什么？
答：唱歌和跳舞
错：看书和写字
错：踢足球
问：朋友过生日的时候小雨会做什么？
答：唱歌祝贺
错：送蛋糕
错：请大家吃饭
问：下个月小雨要做什么？
答：参加唱歌比赛
错：去旅游
错：过生日

文：今天是星期天，可是我比上班的时候还忙。早上我先去商店买了菜和水果，然后回家打扫房间。中午我做了饭，下午洗了衣服。晚上朋友来我家玩，我们一起看了一个电影。现在已经十一点了，我累得不想动了。
问：他早上先去了哪儿？
答：商店
错：朋友家
错：电影院
问：他下午做了什么？
答：洗衣服
错：打扫房间
错：看电影
问：晚上谁来他家了？
答：朋友
错：爸爸妈妈
错：同事
`,
  },
};
