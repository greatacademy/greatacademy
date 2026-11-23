// The dialogues of level 2 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 2, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：你每天早上几点起床？
男：六点半。起床以后先刷牙洗脸，然后出去跑半个小时。
问：男的起床以后先做什么？
据：男的说“起床以后先刷牙洗脸，然后出去跑半个小时”，“先”后面是刷牙洗脸。 | The man says that after getting up he first brushes his teeth and washes his face, then goes out to run.
答：刷牙洗脸
错：吃早饭 | 对话没有说到吃早饭。 | Breakfast is never mentioned.
错：洗澡 | 他说的是刷牙洗脸，不是洗澡。 | He says he brushes his teeth and washes his face, not that he showers.
问：男的几点起床？
据：女的问几点起床，男的答“六点半”。 | Asked when he gets up, the man says half past six.
答：六点半
错：六点 | 六点后面还有“半”，男的说的是六点半。 | The man adds 半 after six: half past six.
错：七点半 | 男的说的是六点半，不是七点半。 | He says half past six, not half past seven.

男：你怎么又迟到了？
女：对不起，我早上没醒，起晚了。
男：明天的会议很重要，你一定要准时来。
问：女的为什么迟到了？
据：女的说“我早上没醒，起晚了”。 | The woman says she did not wake up and got up late.
答：她早上起晚了
错：路上车太多 | 女的没有说到路上的车。 | She says nothing about traffic.
错：她生病了 | 女的没有说生病，她说的是起晚了。 | She does not say she was ill; she overslept.
问：明天有什么事？
据：男的说“明天的会议很重要”。 | The man says tomorrow's meeting is very important.
答：一个重要的会议
错：一个重要的考试 | 男的说的是会议，不是考试。 | He speaks of a meeting, not an exam.
错：一个晚会 | 男的说的是会议，不是晚会。 | He speaks of a meeting, not a party.

女：你新租的房子怎么样？
男：不太大，有一个客厅、一个厨房和两个房间。
女：房租贵不贵？
男：不贵，一个月两千块。就是附近没有地铁，有点儿不方便。
问：男的新房子有几个房间？
据：男的说有一个客厅、一个厨房和“两个房间”。 | The man says there is a sitting room, a kitchen and two rooms.
答：两个
错：一个 | 一个是客厅和厨房的数目，房间是两个。 | One is the count of the sitting room and the kitchen; there are two rooms.
错：三个 | 他说的是两个房间，没有三个。 | He says two rooms; there is no third.
问：男的觉得新房子哪里不好？
据：男的说“就是附近没有地铁，有点儿不方便”，“就是”后面说的是不好的地方。 | The man says the only thing is that there is no underground nearby, which is a little inconvenient; what follows 就是 is the drawback.
答：附近没有地铁
错：房租太贵 | 男的说房租“不贵”。 | He says the rent is not dear.
错：没有厨房 | 男的说有一个厨房。 | He says there is a kitchen.
问：房租多少钱一个月？
据：男的说“一个月两千块”。 | The man says it is two thousand kuai a month.
答：两千块
错：一千块 | 他说的是两千，不是一千。 | He says two thousand, not one thousand.
错：两百块 | 他说的是两千，不是两百。 | He says two thousand, liǎngqiān, not two hundred.

男：你的房间真干净！
女：我每个星期六都打扫一次。
问：女的什么时候打扫房间？
据：女的说“我每个星期六都打扫一次”。 | The woman says she cleans every Saturday.
答：每个星期六
错：每天晚上 | 她说的是每个星期六，不是每天晚上。 | She says every Saturday, not every evening.
错：每个星期日 | 她说的是星期六，不是星期日。 | She says Saturday, not Sunday.

女：这条裙子我穿着合适吗？
男：颜色很漂亮，就是有点儿短，你试试长一点儿的吧。
问：男的觉得裙子怎么样？
据：男的说“颜色很漂亮，就是有点儿短”。 | The man says the colour is lovely, only it is a little short.
答：颜色好看，可是短了一点儿
错：颜色不好看，长短合适 | 男的说颜色很漂亮，也说了有点儿短。 | He says the colour is lovely, and also that it is a bit short.
错：颜色好看，可是长了一点儿 | 他说的是有点儿短，不是长。 | He says it is a bit short, not long.
问：男的让女的做什么？
据：男的说“你试试长一点儿的吧”。 | The man says, "Try a longer one."
答：试一条长一点儿的
错：换一个颜色 | 男的喜欢这个颜色，没有让她换颜色。 | He likes the colour and does not ask her to change it.
错：买下这条裙子 | 他觉得这条有点儿短，让她试别的，不是买下这条。 | He finds this one short and asks her to try another, not to buy it.

男：你好，这双黑色的鞋有大一号的吗？
女：对不起，黑色的没有大号了，蓝色的有。
男：那我试试蓝色的吧。
问：男的要试什么颜色的鞋？
据：女的说蓝色的有大号，男的说“那我试试蓝色的吧”。 | The woman says the blue ones come in a bigger size, and the man says he will try the blue.
答：蓝色
错：黑色 | 黑色的没有大号了，所以他不试黑色的。 | The black ones have no bigger size, so he does not try them.
错：白色 | 对话没有说到白色。 | White is never mentioned.
问：男的为什么不买黑色的鞋？
据：女的说“黑色的没有大号了”，男的要大一号的。 | The woman says the black ones have no bigger size left, and he needs one size up.
答：黑色的没有大号了
错：黑色的太贵了 | 对话没有说到价钱。 | Price is never mentioned.
错：他不喜欢黑色 | 男的先要的就是黑色的，不是不喜欢黑色。 | Black is what he asked for first, so he does like it.

女：服务员，买单。
男：好的，你们的菜是一百八十六块。
问：他们可能在哪儿？
据：女的叫“服务员，买单”，男的说“你们的菜是一百八十六块”。叫服务员、为“菜”结账，是在饭馆。 | The woman calls the waiter for the bill, and he names the price of their dishes. Paying for dishes with a waiter happens in a restaurant.
答：饭馆
错：商店 | 商店里买的是东西，不会说“你们的菜”。 | In a shop one buys goods, and no one speaks of "your dishes".
错：医院 | 医院里没有服务员，也不点菜。 | A hospital has no waiters and serves no dishes.
问：女的要做什么？
据：女的说“买单”，就是要付钱。男的告诉她一百八十六块，她要给钱。 | The woman says 买单, which means she wants to pay; the man tells her the total.
答：给钱
错：点菜 | 菜已经吃完了，现在是结账，不是点菜。 | The meal is over; this is the bill, not the order.
错：看菜单 | 她要的是账单，不是菜单。 | She wants the bill, not the menu.

男：你想吃点儿什么？
女：我不吃辣的。来一个鸡汤，一盘饺子吧。
男：喝点儿什么？啤酒还是饮料？
女：天气太热了，我要一杯冰水。
问：女的点了什么菜？
据：女的说“来一个鸡汤，一盘饺子吧”。 | The woman orders a chicken soup and a plate of dumplings.
答：鸡汤和饺子
错：鸡汤和米饭 | 她点的是饺子，不是米饭。 | She orders dumplings, not rice.
错：辣鸡肉和饺子 | 女的说“我不吃辣的”，不会点辣鸡肉。 | She says she does not eat spicy food, so she would not order spicy chicken.
问：女的要喝什么？
据：女的说“天气太热了，我要一杯冰水”。 | The woman says it is too hot and asks for a glass of iced water.
答：冰水
错：啤酒 | 啤酒是男的问她的，她没有要。 | Beer is what the man offers; she does not take it.
错：热茶 | 她说天气太热，要的是冰水，不是热茶。 | She says it is too hot and asks for iced water, not hot tea.

女：经理，下午的会议准备好了。
男：好，几点开？
女：三点，在二层的办公室。
问：会议几点开？
据：经理问几点开，女的答“三点”。 | The manager asks when it starts, and the woman says three.
答：三点
错：两点 | 她说的是三点，不是两点。 | She says three, not two.
错：十二点 | 十二点录音里没有说到。 | Twelve is never said.
问：会议在哪儿开？
据：女的说“在二层的办公室”。 | The woman says it is in the office on the second floor.
答：二层办公室
错：三层办公室 | 三是开会的时间，地方是二层。 | Three is the time; the place is the second floor.
错：一层办公室 | 她说的是二层，不是一层。 | She says the second floor, not the first.

男：你今天怎么还不回家？
女：工作还没做完，今天要加班。
问：女的为什么不回家？
据：女的说“工作还没做完，今天要加班”。 | The woman says her work is not finished and she must work late.
答：她要加班
错：她在等男的 | 女的没有说在等男的。 | She does not say she is waiting for the man.
错：她不舒服 | 她说的是工作没做完，没有说不舒服。 | She says her work is unfinished, not that she feels unwell.

女：你怎么了？脸色不太好。
男：我有点儿发烧，可能是感冒了。
女：快去医院检查一下吧。
问：男的怎么了？
据：男的说“我有点儿发烧，可能是感冒了”。 | The man says he has a slight fever and may have a cold.
答：可能感冒了
错：肚子疼 | 男的没有说肚子疼。 | He does not say his stomach hurts.
错：腿疼 | 男的没有说腿疼。 | He does not say his leg hurts.
问：女的让男的做什么？
据：女的说“快去医院检查一下吧”。 | The woman says, "Go to the hospital quickly and get checked."
答：去医院检查
错：在家休息 | 她让他去医院，不是在家休息。 | She tells him to go to the hospital, not to rest at home.
错：吃感冒药 | 她让他去检查，没有说吃药。 | She tells him to get checked, not to take cold medicine.

男：医生说我太重了，要少吃肉，多走路。
女：我也是，最近又胖了。
问：医生让男的做什么？
据：男的说医生让他“少吃肉，多走路”。 | The man says the doctor told him to eat less meat and walk more.
答：少吃肉，多走路
错：多吃肉，少走路 | 正好说反了：是少吃肉，多走路。 | It is the reverse: less meat, more walking.
错：少吃糖，多走路 | 医生说的是少吃肉，没有说糖。 | The doctor says less meat; sugar is never mentioned.
问：女的最近怎么了？
据：女的说“我也是，最近又胖了”。 | The woman says, "Me too; I've put on weight again lately."
答：又胖了
错：瘦了 | 她说的是又胖了，和瘦了相反。 | She says she has put on weight, the opposite of losing it.
错：生病了 | 她没有说生病，说的是胖了。 | She does not say she is ill; she says she has put on weight.

女：你昨天晚上几点睡的？
男：一点多。我看了一个电影，看完已经十二点半了，然后又洗了个澡。
问：男的昨天晚上几点睡的？
据：男的第一句就答“一点多”。 | The man's first words are "after one".
答：一点多
错：十二点半 | 十二点半是他看完电影的时间，后来还洗了澡才睡。 | Half past twelve is when the film ended; he then showered before bed.
错：十一点多 | 十一点多录音里没有说。 | After eleven is never said.
问：男的看完电影以后做了什么？
据：男的说“看完已经十二点半了，然后又洗了个澡”。 | The man says the film ended at half past twelve, and then he had a shower.
答：洗澡
错：刷牙 | 他说的是洗澡，没有说刷牙。 | He says he showered, not that he brushed his teeth.
错：吃东西 | 对话没有说到吃东西。 | Eating is never mentioned.

男：你的电脑能用吗？我的上不了网了。
女：能用，你用吧，我去开会。
问：男的为什么要用女的电脑？
据：男的说“我的上不了网了”。 | The man says his cannot get online.
答：他的电脑上不了网
错：他没有电脑 | 他说“我的”上不了网，他有电脑。 | He says "mine" cannot get online, so he has a computer.
错：他的电脑太旧了 | 他说的是上不了网，没有说电脑旧。 | He says it cannot get online, not that it is old.
问：女的要去做什么？
据：女的说“你用吧，我去开会”。 | The woman says, "Use it; I'm off to a meeting."
答：开会
错：上网 | 要上网的是男的，不是女的。 | It is the man who wants to go online.
错：回家 | 她说的是去开会，不是回家。 | She says she is going to a meeting, not home.

女：家里的空调怎么不冷了？
男：我也不知道，明天我打电话请人来看看。
女：今天太热了，我们晚上去城里的咖啡馆吧。
问：家里的什么有问题？
据：女的问“家里的空调怎么不冷了”。 | The woman asks why the air conditioner at home is no longer cold.
答：空调
错：冰箱 | 对话没有说到冰箱。 | No fridge is mentioned.
错：洗衣机 | 对话没有说到洗衣机。 | No washing machine is mentioned.
问：男的明天要做什么？
据：男的说“明天我打电话请人来看看”，看的是不冷的空调。 | The man says that tomorrow he will phone for someone to come and look, at the air conditioner that is not cooling.
答：打电话请人来看空调
错：去买一个新空调 | 他是请人来看看，没有说买新的。 | He will have someone look at it; he does not say he will buy a new one.
错：去城里的咖啡馆 | 去咖啡馆是女的说的，而且是今天晚上。 | The café is the woman's idea, and it is for this evening.

男：外面风大，你戴上帽子吧。
女：好，我戴那个黄色的。
问：女的要戴什么颜色的帽子？
据：女的说“我戴那个黄色的”。 | The woman says, "I'll wear the yellow one."
答：黄色
错：蓝色 | 她说的是黄色，不是蓝色。 | She says yellow, not blue.
错：绿色 | 她说的是黄色，不是绿色。 | She says yellow, not green.

女：你会做饭吗？
男：会一点儿，我最拿手的是羊肉饺子。
问：男的最会做什么？
据：男的说“我最拿手的是羊肉饺子”，“拿手”就是最会做。 | The man says his best dish is lamb dumplings; 拿手 means what he does best.
答：羊肉饺子
错：猪肉饺子 | 他说的是羊肉，不是猪肉。 | He says lamb, not pork.
错：鸡汤 | 对话没有说到鸡汤。 | Chicken soup is never mentioned.
`,
  },
  {
    unit: 12,
    data: `
男：这个假期你有什么计划？
女：我想去南方旅游，看看那里的山和海。
男：一个人去吗？
女：不，跟我的两个大学同学一起去。
问：女的假期想做什么？
据：女的说“我想去南方旅游”。 | The woman says she wants to travel in the south.
答：去南方旅游
错：去北方旅游 | 她说的是南方，不是北方。 | She says the south, not the north.
错：在家休息 | 她要去旅游，不是在家休息。 | She is going travelling, not resting at home.
问：女的跟谁一起去？
据：女的说“跟我的两个大学同学一起去”。 | The woman says she will go with two university classmates.
答：两个同学
错：她一个人去 | 男的问一个人去吗，女的说了“不”。 | Asked if she will go alone, she says no.
错：她的家人 | 她说的是同学，不是家人。 | She says classmates, not family.

女：你看起来不太高兴，怎么了？
男：我们队昨天的比赛输了。
问：男的为什么不高兴？
据：男的说“我们队昨天的比赛输了”。 | The man says his team lost yesterday's match.
答：他们队比赛输了
错：他没参加比赛 | 他说“我们队”输了，没有说自己没参加。 | He says his team lost; he does not say he missed the match.
错：昨天下雨了 | 对话没有说到下雨。 | Rain is never mentioned.

男：这里的秋天真美，树叶都变红了。
女：是啊，我们在这儿照张相吧。
问：现在是什么季节？
据：男的说“这里的秋天真美”，又说树叶都变红了，树叶变红正是秋天的景象。 | The man says autumn here is beautiful and the leaves have all turned red, which is what autumn looks like.
答：秋天
错：春天 | 树叶变红是秋天的景象，春天的树叶是绿的。 | Red leaves belong to autumn; in spring the leaves are green.
错：夏天 | 男的说的就是秋天，夏天树叶也不会变红。 | He names autumn himself, and leaves do not turn red in summer.
问：女的想做什么？
据：女的说“我们在这儿照张相吧”。 | The woman says, "Let's take a photo here."
答：照相
错：爬山 | 对话没有说到爬山。 | Climbing is never mentioned.
错：回家 | 她想在这儿照相，没有说回家。 | She wants a photo here; she does not say go home.

女：你每天都锻炼吗？
男：对，我每天游泳一个小时，星期六还踢足球。
问：男的星期六做什么运动？
据：男的说“星期六还踢足球”。 | The man says that on Saturdays he also plays football.
答：踢足球
错：游泳 | 游泳是他每天做的，星期六另外还踢足球。 | Swimming is daily; on Saturday he plays football as well.
错：打篮球 | 他说的是足球，不是篮球。 | He says football, not basketball.
问：男的每天游泳多长时间？
据：男的说“我每天游泳一个小时”。 | The man says he swims for an hour every day.
答：一个小时
错：半个小时 | 他说的是一个小时，不是半个小时。 | He says an hour, not half an hour.
错：两个小时 | 他说的是一个小时，不是两个小时。 | He says one hour, not two.

男：你看今天的新闻了吗？明天有大雪。
女：真的？那我明天不开车了，坐地铁去上班。
问：明天天气怎么样？
据：男的说“明天有大雪”。 | The man says there will be heavy snow tomorrow.
答：下大雪
错：刮大风 | 他说的是雪，不是风。 | He says snow, not wind.
错：下大雨 | 他说的是大雪，不是大雨。 | He says heavy snow, not heavy rain.
问：女的明天怎么去上班？
据：女的说“我明天不开车了，坐地铁去上班”。 | The woman says she will not drive tomorrow but take the underground.
答：坐地铁
错：开车 | 她说的是“不开车了”。 | She says she will not drive.
错：骑车 | 对话没有说到骑车。 | Cycling is never mentioned.

女：下个星期是我爸爸妈妈结婚三十年，我想送他们一份礼物。
男：送一个大蛋糕怎么样？
女：太简单了，我想给他们订一次旅行。
问：女的为什么要送礼物？
据：女的说“下个星期是我爸爸妈妈结婚三十年”，所以想送他们礼物。 | The woman says next week is her parents' thirtieth wedding anniversary, so she wants to give them a present.
答：她爸爸妈妈结婚三十年
错：她爸爸过生日 | 录音里说的是爸爸妈妈结婚三十年，没有提生日。 | The recording speaks of her parents' thirty years of marriage; no birthday is mentioned.
错：下个星期是新年 | 下个星期是结婚三十年，不是新年。 | Next week is the anniversary, not New Year.
问：女的想送什么？
据：女的说“我想给他们订一次旅行”。 | The woman says she wants to book them a trip.
答：一次旅行
错：一个蛋糕 | 蛋糕是男的出的主意，女的说太简单了。 | The cake is the man's idea, and she says it is too simple.
错：一张照片 | 对话没有说到照片。 | A photo is never mentioned.

男：明天就要考试了，我有点儿紧张。
女：别担心，你准备得很好，一定没问题。
问：男的心情怎么样？
据：男的说“我有点儿紧张”。 | The man says, "I'm a little nervous."
答：有点儿紧张
错：很高兴 | 他明天考试，说的是紧张，不是高兴。 | With an exam tomorrow he says he is nervous, not happy.
错：很生气 | 他说的是紧张，没有生气。 | He says he is nervous, not angry.

女：去机场的车几点出发？
男：八点。我们的飞机十点半起飞，时间够了。
女：行李都放好了吗？
男：放好了，就两个箱子。
问：飞机几点起飞？
据：男的说“我们的飞机十点半起飞”。 | The man says, "Our flight takes off at half past ten."
答：十点半
错：八点 | 八点是去机场的车出发的时间。 | Eight is when the car to the airport leaves.
错：八点半 | 八点半录音里没有说到。 | Half past eight is never said.
问：他们有几个箱子？
据：男的说“就两个箱子”。 | The man says there are just two cases.
答：两个
错：一个 | 他说的是两个，不是一个。 | He says two, not one.
错：三个 | 他说的是两个，没有第三个。 | He says two; there is no third.
问：去机场的车什么时候出发？
据：女的问车几点出发，男的答“八点”。 | Asked when the car leaves, the man says eight.
答：八点
错：十点半 | 十点半是飞机起飞的时间。 | Half past ten is when the plane takes off.
错：十点 | 十点录音里没有说到，飞机是十点半。 | Ten is never said; the plane is at half past ten.

男：你家有狗吗？
女：没有，我家有两只猫。
男：我也喜欢猫，可是我妈妈怕猫。
问：女的家里有什么动物？
据：女的说“没有，我家有两只猫”。 | The woman says no dog, but two cats.
答：两只猫
错：一只狗 | 男的问有没有狗，女的说“没有”。 | Asked about a dog, she says no.
错：两只狗 | 她家没有狗，只有两只猫。 | She has no dogs at all, only two cats.
问：谁怕猫？
据：男的说“可是我妈妈怕猫”，“我”是男的，所以是男的妈妈。 | The man says, "But my mum is afraid of cats"; "my" is the man's, so it is his mother.
答：男的妈妈
错：男的 | 男的说“我也喜欢猫”，他不怕。 | He says he likes cats too, so he is not afraid.
错：女的妈妈 | 说“我妈妈”的是男的，不是女的。 | It is the man who says "my mum", not the woman.

女：我给你发了好几个微信，你怎么不回？
男：对不起，我的手机没电了，刚看到。
问：男的为什么没回微信？
据：男的说“我的手机没电了，刚看到”。 | The man says his phone ran out of power and he has only just seen them.
答：手机没电了
错：他在开会 | 男的没有说在开会。 | He does not say he was in a meeting.
错：他没看懂 | 他是没看到，不是没看懂。 | He did not see them; it is not that he did not understand.

男：昨天的篮球比赛你看了吗？
女：看了，太好看了！最后一分钟我们才赢。
男：我昨天加班，没看到。
问：男的为什么没看比赛？
据：男的说“我昨天加班，没看到”。 | The man says he worked late yesterday and missed it.
答：他在加班
错：他在踢球 | 他说的是加班，没有说踢球。 | He says he worked late, not that he played football.
错：他去旅游了 | 他说的是加班，没有说旅游。 | He says he worked late, not that he was travelling.
问：比赛怎么样？
据：女的说“最后一分钟我们才赢”。 | The woman says they won only in the last minute.
答：最后才赢
错：最后输了 | 女的说的是赢了，不是输了。 | She says they won, not lost.
错：很早就赢了 | “最后一分钟才赢”，不是很早就赢了。 | They won in the last minute, not early on.

女：春节你回老家吗？
男：回，我已经买好火车票了。
女：你家那边过春节吃什么？
男：我们北方人一定要吃饺子。
问：男的春节去哪儿？
据：女的问春节回不回老家，男的答“回”。 | Asked if he will go home for Spring Festival, the man says yes.
答：回老家
错：去旅游 | 他说的是回老家，不是旅游。 | He says he is going home, not travelling.
错：留在城市里 | 他要回老家，不是留在城市里。 | He is going home, not staying in the city.
问：男的家里过春节吃什么？
据：男的说“我们北方人一定要吃饺子”。 | The man says northerners like him must eat dumplings.
答：饺子
错：蛋糕 | 对话没有说到蛋糕。 | Cake is never mentioned.
错：月饼 | 月饼是中秋节吃的，男的说的是饺子。 | Mooncakes are for Mid-Autumn; he says dumplings.
问：男的怎么回去？
据：男的说“我已经买好火车票了”。买了火车票，就是坐火车回去。 | The man says he has bought his train ticket, so he is going by train.
答：坐火车
错：坐飞机 | 他买的是火车票，不是机票。 | He bought a train ticket, not a plane ticket.
错：开车 | 他买了火车票，不是开车回去。 | He bought a train ticket, so he is not driving.

男：你笑什么？
女：我在看一个笑话，太好笑了。
问：女的在做什么？
据：女的说“我在看一个笑话”。 | The woman says she is reading a joke.
答：看一个笑话
错：讲一个故事 | 她是在看笑话，不是讲故事。 | She is reading a joke, not telling a story.
错：看一个电影 | 她看的是笑话，不是电影。 | She is reading a joke, not watching a film.

女：今天外面有多少度？
男：零下五度，比昨天还冷。
问：今天多少度？
据：男的说“零下五度”。 | The man says minus five.
答：零下五度
错：零上五度 | 他说的是零下，不是零上。 | He says below zero, not above.
错：零下十五度 | 他说的是五度，前面没有“十”。 | He says five degrees, with no 十 before it.
问：昨天的天气怎么样？
据：男的说今天“比昨天还冷”。今天更冷，那昨天就没有今天冷。 | The man says today is even colder than yesterday, so yesterday was less cold than today.
答：没有今天冷
错：比今天冷 | 正好说反了：是今天比昨天冷。 | It is the reverse: today is colder than yesterday.
错：跟今天一样冷 | “比昨天还冷”说明两天不一样冷。 | "Colder than yesterday" means the two days differ.

男：你喜欢听什么节目？
女：我喜欢听音乐节目，开车的时候常常听。
问：女的什么时候听音乐？
据：女的说“开车的时候常常听”。 | The woman says she often listens while driving.
答：开车的时候
错：睡觉以前 | 她没有说睡觉以前。 | She says nothing about before bed.
错：做饭的时候 | 她没有说做饭的时候。 | She says nothing about while cooking.

女：你好，我订了一个双人房间。
男：好的，请给我看一下您的护照。
问：他们可能在哪儿？
据：女的说“我订了一个双人房间”，男的要看她的护照。订房间、看护照是在宾馆登记。 | The woman says she has booked a double room, and the man asks for her passport. Booking a room and showing a passport is checking in at a hotel.
答：宾馆
错：机场 | 机场也看护照，可是机场没有双人房间。 | Airports check passports too, but they have no double rooms.
错：饭馆 | 饭馆里不订房间，也不看护照。 | A restaurant books no rooms and checks no passports.
问：女的订了什么？
据：女的说“我订了一个双人房间”。 | The woman says she has booked a double room.
答：双人房间
错：单人房间 | 她说的是双人，不是单人。 | She says a double, not a single.
错：两张机票 | 她订的是房间，不是机票。 | She booked a room, not plane tickets.

男：我们去爬山吧，山上的花都开了。
女：好啊，可是我怕累，我们爬到一半就下来吧。
问：女的为什么只想爬一半？
据：女的说“可是我怕累，我们爬到一半就下来吧”。 | The woman says she is afraid of getting tired, so they should come down halfway.
答：她怕累
错：她怕下雨 | 对话没有说到下雨。 | Rain is never mentioned.
错：山上没有花 | 男的说山上的花都开了，不是没有花。 | The man says the flowers on the hill are out, so there are flowers.
问：山上有什么？
据：男的说“山上的花都开了”。 | The man says the flowers on the hill are all out.
答：很多花
错：很多雪 | 他说的是花，不是雪。 | He says flowers, not snow.
错：很多动物 | 对话没有说到动物。 | Animals are never mentioned.

女：这张照片拍得真好！是在哪儿拍的？
男：在湖边，那天阳光很好。
问：照片是在哪儿拍的？
据：男的说“在湖边”。 | The man says it was taken by the lake.
答：湖边
错：河边 | 他说的是湖边，不是河边。 | He says by the lake, not the river.
错：海边 | 他说的是湖边，不是海边。 | He says by the lake, not the sea.
`,
  },
];
