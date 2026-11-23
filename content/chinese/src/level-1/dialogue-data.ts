// The dialogues of level 1 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 1, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：你今年多大了？
男：我今年二十八岁，我妹妹二十五岁。
问：男的今年多大？
据：男的回答“我今年二十八岁”，说的是他自己。 | The man answers, "I am twenty-eight this year," speaking of himself.
答：二十八岁
错：二十五岁 | 二十五岁是他妹妹的年龄，不是他自己的。 | Twenty-five is his younger sister's age, not his own.
错：十八岁 | 录音里没有十八岁，男的说的是二十八，比十八多一个“二”。 | Eighteen is never said; the man says twenty-eight, with 二 before the 十.

男：你家里有几个人？
女：五个，爸爸、妈妈、两个哥哥和我。
问：女的有几个哥哥？
据：女的数家里人时说到“两个哥哥”。 | Counting her family, the woman names "two elder brothers".
答：两个
错：一个 | 她说的是两个，不是一个。 | She says two, not one.
错：五个 | 五个是她家里的总人数，不是哥哥的数目。 | Five is the size of her whole family, not the number of brothers.
问：女的家里有几个人？
据：男的问有几个人，女的第一句就答“五个”，后面数出爸爸、妈妈、两个哥哥和她自己，正好五个。 | Asked how many there are, the woman says "five" and then names Dad, Mum, two brothers and herself, which makes five.
答：五个
错：四个 | 四个人是漏算了她自己：爸爸、妈妈、两个哥哥再加上她，是五个。 | Four leaves her out: Dad, Mum and two brothers, with her, make five.
错：两个 | 两个是她哥哥的数目，不是全家的人数。 | Two is the number of her brothers, not of the whole family.

女：这件红衣服多少钱？
男：一百二十块。
女：太贵了！那件白的多少钱？
男：白的便宜，八十块。
问：白衣服多少钱？
据：女的问白的多少钱，男的回答“白的便宜，八十块”。 | The woman asks the price of the white one, and the man says, "The white one is cheaper: eighty kuai."
答：八十块
错：一百二十块 | 一百二十块是红衣服的价钱。 | A hundred and twenty is the price of the red one.
错：一百八十块 | 一百八十块录音里没有说，男的说的是八十块。 | A hundred and eighty is never said; the man says eighty.
问：红衣服怎么样？
据：听到红衣服一百二十块，女的马上说“太贵了”。 | Hearing that the red one costs a hundred and twenty, the woman says at once, "Too dear!"
答：太贵了
错：太小了 | 对话只说到价钱，没有说衣服大小。 | The dialogue speaks only of price, never of size.
错：很便宜 | 便宜的是白衣服，红衣服太贵了。 | It is the white one that is cheap; the red one is too dear.

男：明天是星期几？
女：明天是星期六。我们一起去商店买东西吧。
问：今天是星期几？
据：女的说“明天是星期六”。明天是星期六，今天就是它的前一天，星期五。 | The woman says tomorrow is Saturday, so today is the day before it, Friday.
答：星期五
错：星期六 | 星期六是明天，不是今天。 | Saturday is tomorrow, not today.
错：星期日 | 星期日在星期六后面，是后天。 | Sunday comes after Saturday, so it is the day after tomorrow.
问：女的明天想做什么？
据：女的说“我们一起去商店买东西吧”，这是她明天的打算。 | The woman says, "Let's go to the shop together to buy things," which is her plan for tomorrow.
答：去商店买东西
错：在家里做饭 | 录音里没有说到在家做饭。 | Cooking at home is never mentioned.
错：去朋友家 | 她说去的是商店，不是朋友家。 | She names the shop, not a friend's home.

女：你早上吃什么？
男：我每天吃一个鸡蛋，喝一杯牛奶。
问：男的早上喝什么？
据：男的说早上“喝一杯牛奶”。 | The man says that in the morning he drinks a glass of milk.
答：牛奶
错：茶 | 男的没有说喝茶。 | He never says he drinks tea.
错：水 | 男的没有说喝水，他喝的是牛奶。 | He never says water; he drinks milk.
问：男的每天吃几个鸡蛋？
据：男的说“我每天吃一个鸡蛋”。 | The man says, "I eat one egg every day."
答：一个
错：两个 | 他说的是“一个”鸡蛋，“两个”没有出现。 | He says one egg; two is never said.
错：三个 | 三个也没有说到，他每天只吃一个。 | Three is never said either; he eats only one a day.

男：你想吃米饭还是吃面？
女：我不饿，我喝一点儿热水就可以了。
问：女的想要什么？
据：男的问米饭还是面，女的两样都不要，说“我喝一点儿热水就可以了”。 | Offered rice or noodles, the woman takes neither and says a little hot water will do.
答：热水
错：米饭 | 米饭是男的问她的，她没有要。 | Rice is what the man offers; she does not take it.
错：面 | 面也是男的问的，她说不饿，不吃。 | Noodles are offered too, but she says she is not hungry.
问：女的怎么了？
据：女的说“我不饿”，所以只喝点儿热水。 | The woman says, "I'm not hungry," which is why she wants only hot water.
答：她不饿
错：她很饿 | 她说的是“不饿”，正好和“很饿”相反。 | She says "not hungry", the opposite of very hungry.
错：她很冷 | 她要热水，可是没有说冷。 | She asks for hot water but never says she is cold.

女：对不起，我来晚了。
男：没关系，我们也是现在来的。
问：谁来晚了？
据：女的一开口就说“对不起，我来晚了”，是她自己来晚了。 | The woman begins, "Sorry, I'm late," so it is she who is late.
答：女的
错：男的 | 男的说“我们也是现在来的”，是在安慰她，不是说自己来晚了。 | The man says they have only just come too, to put her at ease, not to say he is late.
错：男的和女的 | 道歉的只有女的一个人，男的没有来晚。 | Only the woman apologises; the man is not late.

男：你女儿几岁了？
女：她六岁了。
男：她喜欢吃什么？
女：她喜欢吃面包和水果，不喜欢吃米饭。
问：女的女儿几岁？
据：男的问她女儿几岁，女的回答“她六岁了”。 | Asked how old her daughter is, the woman says, "She is six."
答：六岁
错：九岁 | 九岁录音里没有说，“九”和“六”听起来不一样。 | Nine is never said, and jiǔ sounds nothing like liù.
错：十六岁 | 十六岁前面多了一个“十”，女的只说了“六岁”。 | Sixteen adds a 十; the woman says only six.
问：女的女儿喜欢吃什么？
据：女的说女儿“喜欢吃面包和水果”。 | The woman says her daughter likes bread and fruit.
答：面包和水果
错：米饭和鸡肉 | 米饭是女儿不喜欢吃的，鸡肉没有说到。 | Rice is what the daughter dislikes, and chicken is never mentioned.
错：鸡蛋和牛奶 | 鸡蛋和牛奶在对话里都没有出现。 | Neither eggs nor milk come up in the dialogue.

女：现在几点了？
男：现在七点半，我们八点去吃饭。
问：现在几点？
据：男的说“现在七点半”。 | The man says, "It is half past seven now."
答：七点半
错：八点 | 八点是他们去吃饭的时间，不是现在。 | Eight is when they will go to eat, not the time now.
错：八点半 | 八点半录音里没有说。 | Half past eight is never said.
问：他们几点去吃饭？
据：男的说“我们八点去吃饭”。 | The man says, "We will go to eat at eight."
答：八点
错：七点半 | 七点半是现在的时间，不是吃饭的时间。 | Half past seven is the time now, not the time to eat.
错：七点 | 七点录音里没有说，男的说的是八点。 | Seven is never said; the man says eight.

男：你爷爷奶奶住在哪儿？
女：他们和我们一家人住在一起。
男：你爷爷今年多大了？
女：八十二岁了，奶奶七十九岁。
问：女的爷爷奶奶住在哪儿？
据：女的说爷爷奶奶“和我们一家人住在一起”，也就是住在女的家里。 | The woman says her grandparents live with her family, that is, in her home.
答：女的家里
错：男的家里 | 他们和女的一家住在一起，不是和男的一家。 | They live with the woman's family, not the man's.
错：商店里 | 对话里没有说到商店。 | No shop is mentioned at all.
问：谁八十二岁了？
据：男的问“你爷爷今年多大了”，女的答“八十二岁了”，说的是爷爷。 | The man asks how old her grandfather is, and she answers eighty-two, so it is her grandfather.
答：女的爷爷
错：女的奶奶 | 奶奶是七十九岁，女的在后面另外说的。 | Her grandmother is seventy-nine, which she adds afterwards.
错：女的爸爸 | 对话没有说到她爸爸的年龄。 | Her father's age is never given.

女：这里的水果怎么卖？
男：十块钱三个，很便宜。
问：男的可能是做什么的？
据：女的问水果怎么卖，男的说出价钱“十块钱三个，很便宜”。告诉别人价钱的人是卖东西的，所以他是卖水果的。 | The woman asks how the fruit is sold and the man gives the price, three for ten kuai. The one who quotes a price is the seller, so he sells fruit.
答：卖水果的
错：买水果的 | 问价钱的是女的，她才是买水果的人。 | It is the woman who asks the price, so she is the buyer.
错：做饭的 | 对话说的是卖水果，没有说到做饭。 | The dialogue is about selling fruit, not cooking.
问：水果怎么卖？
据：男的说“十块钱三个”：十块钱可以买三个。 | The man says "ten kuai for three": ten kuai buys three.
答：十块钱三个
错：三块钱十个 | 数字说反了：是十块钱三个，不是三块钱十个。 | The numbers are swapped: it is three for ten kuai, not ten for three.
错：十块钱一个 | 十块钱买的是三个，不是一个。 | Ten kuai buys three, not one.

男：今天晚上我们吃什么？
女：吃鱼吧，你爸爸喜欢吃鱼。
男：好，我去买鱼，你做米饭。
女：好的。
问：男的要去做什么？
据：男的说“我去买鱼，你做米饭”，他自己要去买鱼。 | The man says, "I'll go and buy fish; you cook the rice," so he will buy fish.
答：买鱼
错：做米饭 | 做米饭是男的让女的做的事。 | Cooking the rice is what he asks the woman to do.
错：做鱼 | 男的说的是去买鱼，没有说做鱼。 | He says he will buy the fish, not cook it.
问：谁喜欢吃鱼？
据：女的对男的说“你爸爸喜欢吃鱼”，“你”是男的，所以是男的爸爸。 | The woman tells the man, "Your dad likes fish"; "your" means the man's, so it is his father.
答：男的爸爸
错：女的爸爸 | 女的说的是“你爸爸”，不是她自己的爸爸。 | She says "your dad", not her own.
错：女的 | 对话没有说女的喜欢吃鱼。 | Nothing says the woman herself likes fish.

男：再见！明天见！
女：明天我不来了，星期一见吧。
问：他们什么时候再见？
据：男的说明天见，女的说“明天我不来了，星期一见吧”，改成了星期一。 | The man says see you tomorrow, but the woman says she will not come tomorrow and suggests Monday instead.
答：星期一
错：明天 | 明天是男的先说的，女的说明天不来，把时间改了。 | Tomorrow is what the man says first, but the woman will not come then and changes the day.
错：今天晚上 | 今天晚上录音里没有说到。 | This evening is never mentioned.

女：谢谢你的牛奶和面包！
男：不客气。你还饿吗？
女：不饿了。
问：男的给了女的什么？
据：女的说“谢谢你的牛奶和面包”，她谢的就是男的给她的东西。 | The woman thanks him for the milk and bread, which is what he gave her.
答：牛奶和面包
错：牛奶和鸡蛋 | 女的谢的是牛奶和面包，没有鸡蛋。 | She thanks him for milk and bread; there are no eggs.
错：茶和面包 | 女的说的是牛奶，不是茶。 | She says milk, not tea.
问：女的现在怎么样？
据：男的问“你还饿吗”，女的答“不饿了”。 | The man asks whether she is still hungry, and she says, "Not any more."
答：不饿了
错：还很饿 | 她说的是“不饿了”，和“还很饿”正好相反。 | She says she is no longer hungry, the opposite of still very hungry.
错：有点儿冷 | 对话没有说到冷。 | Nothing is said about being cold.

男：这个大杯子和那个小杯子，两个多少钱？
女：大的三十块，小的二十块，两个五十块。
问：男的要买几个杯子？
据：男的问“这个大杯子和那个小杯子，两个多少钱”，他要买一大一小两个。 | The man asks what the big cup and the small cup cost together, so he wants two.
答：两个
错：一个 | 他问的是两个杯子一共的价钱，不是一个。 | He asks the price of two cups together, not one.
错：三个 | 对话里只有一个大的、一个小的，没有第三个。 | There is only one big and one small cup; there is no third.
问：小杯子多少钱？
据：女的说“小的二十块”。 | The woman says, "The small one is twenty."
答：二十块
错：三十块 | 三十块是大杯子的价钱。 | Thirty is the price of the big cup.
错：五十块 | 五十块是两个杯子加起来的价钱。 | Fifty is the price of both cups together.

女：这个男孩是你弟弟吗？
男：不是，他是我朋友的儿子。
问：这个男孩是谁？
据：女的问是不是他弟弟，男的说“不是，他是我朋友的儿子”。 | The woman asks if the boy is his brother; the man says no, he is his friend's son.
答：男的朋友的儿子
错：男的弟弟 | 男的先说了“不是”，所以不是他弟弟。 | The man says no first, so the boy is not his brother.
错：男的儿子 | 他说的是“我朋友的儿子”，不是自己的儿子。 | He says "my friend's son", not his own son.

男：你哪天去你奶奶家？
女：下个月三号，那天是星期日。
问：女的什么时候去奶奶家？
据：男的问哪天去，女的答“下个月三号”。 | Asked which day, the woman answers, "The third of next month."
答：下个月三号
错：这个月三号 | 女的说的是“下个月”，不是这个月。 | She says next month, not this month.
错：下个月十三号 | 她说的是三号，前面没有“十”。 | She says the third, with no 十 before it.

女：你喜欢喝茶吗？
男：喜欢，可是晚上我不喝茶，我喝水。
问：男的晚上喝什么？
据：男的说“晚上我不喝茶，我喝水”。 | The man says, "In the evening I don't drink tea; I drink water."
答：水
错：茶 | 他喜欢喝茶，可是说了晚上不喝茶。 | He likes tea, but he says he does not drink it in the evening.
错：牛奶 | 对话里没有说到牛奶。 | Milk is never mentioned.

男：请问，这里有黑衣服吗？
女：有，你要大的还是小的？
男：大的，我想买两件。
问：男的想买什么？
据：男的问有没有黑衣服，女的问大的还是小的，男的说“大的，我想买两件”。合起来是两件大的黑衣服。 | The man asks for black clothes; asked big or small, he says big, and that he wants two. Together: two big black ones.
答：两件大的黑衣服
错：两件小的黑衣服 | 男的要的是大的，不是小的。 | He wants big ones, not small.
错：一件大的黑衣服 | 他说的是两件，不是一件。 | He says two, not one.

女：你几点吃午饭？
男：我十二点半吃午饭，你几点吃？
女：我一点吃。
问：女的几点吃午饭？
据：男的问“你几点吃”，女的答“我一点吃”。 | The man asks when she eats, and she says, "At one."
答：一点
错：十二点 | 十二点录音里没有说到。 | Twelve o'clock is never said.
错：十二点半 | 十二点半是男的吃午饭的时间。 | Half past twelve is when the man eats.
问：男的几点吃午饭？
据：男的说“我十二点半吃午饭”。 | The man says, "I have lunch at half past twelve."
答：十二点半
错：一点 | 一点是女的吃午饭的时间。 | One o'clock is when the woman eats.
错：十二点 | 十二点后面还有“半”，男的说的是十二点半。 | The man adds 半 after twelve: half past twelve.
`,
  },
  {
    unit: 12,
    data: `
女：你今天怎么没去上课？
男：我头疼，去医院看病了。
问：男的今天为什么没去上课？
据：男的说“我头疼，去医院看病了”。头疼去看病，就是生病了。 | The man says he had a headache and went to see a doctor, which means he was ill.
答：他生病了
错：他去考试了 | 对话没有说到考试。 | No exam is mentioned.
错：他去打球了 | 对话没有说到打球。 | Playing ball is never mentioned.
问：男的今天去哪儿了？
据：男的说“去医院看病了”。 | The man says he went to the hospital to see a doctor.
答：医院
错：学校 | 学校是他没有去的地方，他今天没去上课。 | School is where he did not go; he missed his classes.
错：药店 | 他说的是医院，不是药店。 | He says the hospital, not a chemist's.

男：请问，火车站怎么走？
女：往前走，过了公园就到了。
男：远不远？
女：不远，很近，走路就能到。
问：男的要去哪儿？
据：男的问“火车站怎么走”，他要去的是火车站。 | The man asks the way to the railway station, so that is where he is going.
答：火车站
错：公园 | 公园是路上要经过的地方，过了公园才到火车站。 | The park is on the way; the station comes after it.
错：机场 | 对话没有说到机场。 | No airport is mentioned.
问：火车站远不远？
据：男的问远不远，女的说“不远，很近，走路就能到”。 | Asked if it is far, the woman says, "No, it's very close; you can walk there."
答：很近，可以走路去
错：很远，要坐车去 | 女的说的是“不远”，不用坐车。 | She says it is not far, so no bus is needed.
错：很远，要坐地铁去 | 女的说走路就能到，不用坐地铁。 | She says he can walk there, so no underground is needed.

女：明天天气怎么样？
男：明天有大雨，你出门带上雨衣吧。
问：明天天气怎么样？
据：男的说“明天有大雨”。 | The man says, "Tomorrow there will be heavy rain."
答：下大雨
错：下大雪 | 男的说的是大雨，不是大雪。 | He says heavy rain, not heavy snow.
错：是晴天 | 有大雨就不是晴天。 | Heavy rain means it will not be sunny.
问：男的让女的带什么？
据：男的说“你出门带上雨衣吧”。 | The man says, "Take a raincoat when you go out."
答：雨衣
错：手机 | 对话没有说到手机。 | A phone is never mentioned.
错：书包 | 对话没有说到书包。 | A schoolbag is never mentioned.

男：你有什么爱好？
女：我喜欢唱歌，也喜欢看电影。你呢？
男：我最喜欢打球。
问：女的喜欢做什么？
据：女的说“我喜欢唱歌，也喜欢看电影”。 | The woman says, "I like singing, and I also like watching films."
答：唱歌和看电影
错：打球和看电影 | 打球是男的最喜欢的，不是女的。 | Ball games are what the man likes best, not the woman.
错：唱歌和打球 | 唱歌是女的喜欢的，可是打球是男的喜欢的。 | Singing is hers, but ball games are the man's.
问：男的最喜欢做什么？
据：男的说“我最喜欢打球”。 | The man says, "I like playing ball best."
答：打球
错：唱歌 | 唱歌是女的喜欢的。 | Singing is what the woman likes.
错：看电影 | 看电影也是女的喜欢的，男的没有说。 | Films are the woman's liking too; the man never mentions them.

女：这次考试难不难？
男：不太难，可是题太多了，最后两题我没有时间写。
问：男的觉得考试怎么样？
据：男的说“不太难，可是题太多了”。 | The man says, "Not very hard, but there were too many questions."
答：题不太难，可是太多
错：题很难，也很多 | 男的说的是“不太难”，不是很难。 | He says not very hard, not very hard indeed.
错：题不难，也不多 | 他说题“太多了”，不是不多。 | He says there were too many questions, not few.
问：男的哪些题没写？
据：男的说“最后两题我没有时间写”。 | The man says he had no time for the last two questions.
答：最后两题
错：第一题和第二题 | 他说的是最后的题，不是最前面的两题。 | He means the last questions, not the first two.
错：最后一题 | 他说的是最后两题，不是一题。 | He says the last two, not the last one.

男：你明天怎么去机场？坐地铁还是打车？
女：坐地铁，坐地铁比打车快。
问：女的明天怎么去机场？
据：男的问坐地铁还是打车，女的答“坐地铁”。 | Asked whether she will take the underground or a taxi, she says the underground.
答：坐地铁
错：打车 | 打车是男的问的另一种，她没有选。 | A taxi is the other choice the man offers; she does not take it.
错：坐火车 | 对话没有说到火车。 | A train is never mentioned.
问：女的为什么不打车？
据：女的说“坐地铁比打车快”，所以她不打车。 | The woman says the underground is faster than a taxi, which is why she does not take one.
答：坐地铁快一些
错：打车太贵了 | 女的说的是快慢，没有说钱。 | She speaks of speed, not of cost.
错：她家里没有车 | 对话没有说到她家有没有车。 | Nothing is said about whether her family has a car.

女：你累了吧？先坐下休息一下。
男：好，我想喝杯热水。
问：男的想做什么？
据：女的让他坐下休息，男的说“好，我想喝杯热水”：他要坐下，再喝杯热水。 | The woman tells him to sit down and rest; he says yes and that he would like a cup of hot water.
答：坐下喝杯热水
错：出去走走 | 女的让他坐下休息，他答应了，没有要出去。 | She tells him to sit and rest and he agrees; he does not want to go out.
错：回家睡觉 | 对话没有说到回家睡觉。 | Going home to sleep is never mentioned.

男：你学汉语学了多长时间？
女：学了一年半了。我每天看一个小时的中文书。
问：女的学汉语学了多长时间？
据：女的说“学了一年半了”。 | The woman says she has studied for a year and a half.
答：一年半
错：半年 | 女的说的是一年半，不是半年。 | She says a year and a half, not half a year.
错：一个小时 | 一个小时是她每天看中文书的时间，不是学了多久。 | An hour is how long she reads Chinese each day, not how long she has studied.
问：女的每天看多长时间中文书？
据：女的说“我每天看一个小时的中文书”。 | The woman says she reads Chinese books for an hour every day.
答：一个小时
错：半个小时 | 她说的是一个小时，不是半个小时。 | She says an hour, not half an hour.
错：两个小时 | 她说的是一个小时，不是两个小时。 | She says one hour, not two.

女：请问，洗手间在哪儿？
男：在楼下，下楼往右走就是。
问：洗手间在哪儿？
据：男的说“在楼下，下楼往右走就是”：楼下，往右。 | The man says it is downstairs: go down and turn right.
答：楼下右边
错：楼上右边 | 男的说的是楼下，不是楼上。 | He says downstairs, not upstairs.
错：楼下左边 | 男的说的是往右走，不是左边。 | He says turn right, not left.

男：春天、夏天、秋天、冬天，你最喜欢哪个？
女：我最喜欢冬天，因为可以看雪。我不喜欢夏天，太热了。
问：女的为什么喜欢冬天？
据：女的说“我最喜欢冬天，因为可以看雪”。 | The woman says she likes winter best because she can see snow.
答：可以看雪
错：可以打球 | 打球是男的问题里没有的，女的喜欢冬天是为了看雪。 | Ball games are not mentioned; she likes winter for the snow.
错：可以休息 | 她说的原因是看雪，不是休息。 | The reason she gives is the snow, not rest.
问：女的不喜欢哪个？
据：女的说“我不喜欢夏天，太热了”。 | The woman says, "I don't like summer; it's too hot."
答：夏天
错：冬天 | 冬天是她最喜欢的，不是不喜欢的。 | Winter is her favourite, not the one she dislikes.
错：春天 | 春天只在男的问题里出现，女的没有说不喜欢。 | Spring appears only in the man's question; she never says she dislikes it.

女：星期六你有时间吗？我们一起去看电影吧。
男：星期六上午我要工作，下午可以。
女：那我们下午三点在电影院门前见。
男：好，我先去买电影票。
问：他们什么时候去看电影？
据：男的说星期六上午要工作、下午可以，女的就约了下午三点。 | The man says he works on Saturday morning but is free in the afternoon, so she fixes three in the afternoon.
答：星期六下午
错：星期六上午 | 星期六上午男的要工作，不能去。 | On Saturday morning the man works, so he cannot go.
错：星期日下午 | 他们说的是星期六，不是星期日。 | They speak of Saturday, not Sunday.
问：他们在哪儿见？
据：女的说“我们下午三点在电影院门前见”。 | The woman says, "Let's meet in front of the cinema at three."
答：电影院门前
错：男的家里 | 对话没有说在男的家里见。 | Nothing says they meet at the man's home.
错：公园门前 | 女的说的是电影院门前，不是公园门前。 | She says in front of the cinema, not the park.
问：男的要先做什么？
据：男的说“我先去买电影票”。 | The man says, "I'll go and buy the tickets first."
答：买电影票
错：去女的家 | 对话没有说到去女的家。 | Going to the woman's home is never mentioned.
错：去吃饭 | 对话没有说到吃饭。 | Eating is never mentioned.

男：医生，我的孩子从昨天晚上头就很疼。
女：我看看。没什么大事，吃点儿药，多休息就好了。
问：男的为什么来医院？
据：男的对医生说“我的孩子从昨天晚上头就很疼”，是孩子头疼，他带孩子来看病。 | The man tells the doctor his child has had a bad headache since last night, so he has brought the child.
答：孩子头疼
错：男的头疼 | 头疼的是孩子，不是男的自己。 | It is the child's head that hurts, not the man's.
错：孩子脚疼 | 男的说的是头疼，不是脚疼。 | He says the child's head hurts, not the feet.
问：医生让孩子做什么？
据：医生说“吃点儿药，多休息就好了”。 | The doctor says some medicine and plenty of rest will put it right.
答：吃药，多休息
错：多吃饭，多喝水 | 医生没有说多吃饭、多喝水。 | The doctor says nothing about eating or drinking more.
错：每天来医院 | 医生说没什么大事，不用每天来医院。 | The doctor says it is nothing serious, so there is no need to come every day.

女：你这次怎么回国？还坐飞机吗？
男：不坐飞机了，我想坐船。船很慢，可是很好玩。
问：男的这次想怎么回国？
据：女的问还坐飞机吗，男的说“不坐飞机了，我想坐船”。 | Asked whether he will fly again, the man says no; he wants to go by boat.
答：坐船
错：坐飞机 | 男的说“不坐飞机了”，这次不坐。 | He says he will not fly this time.
错：坐火车 | 对话没有说到火车。 | A train is never mentioned.
问：男的觉得坐船怎么样？
据：男的说“船很慢，可是很好玩”。 | The man says the boat is slow but great fun.
答：慢，可是好玩
错：快，也好玩 | 他说船“很慢”，不是快。 | He says the boat is slow, not fast.
错：慢，也不好玩 | 他说“很好玩”，不是不好玩。 | He says it is great fun, not dull.

男：老师，这个汉字怎么读？
女：这个字你在第三课学过，你找找课本。
问：男的在问老师什么？
据：男的问“老师，这个汉字怎么读”，问的是读音。 | The man asks, "How is this character read?", asking about its sound.
答：一个字怎么读
错：一个字怎么写 | 他问的是怎么读，不是怎么写。 | He asks how it is read, not how it is written.
错：第三课在哪儿 | 第三课是老师回答里说的，男的没有问第三课在哪儿。 | Lesson 3 comes in the teacher's answer; the man does not ask where it is.
问：这个字在哪一课学过？
据：老师说“这个字你在第三课学过”。 | The teacher says, "You learned this character in Lesson 3."
答：第三课
错：第一课 | 老师说的是第三课，不是第一课。 | She says Lesson 3, not Lesson 1.
错：第十三课 | 老师只说了“第三课”，前面没有“十”。 | She says only Lesson 3, with no 十 before it.

女：你在看什么？
男：我在看一本小说，很有意思。
问：男的在做什么？
据：男的说“我在看一本小说”。 | The man says, "I'm reading a novel."
答：看小说
错：看电视 | 他看的是小说，不是电视。 | He is reading a novel, not watching television.
错：写作文 | 他是在看书，不是在写作文。 | He is reading, not writing an essay.

男：你每天几点睡觉？
女：晚上十一点。中午我还睡一个小时。
问：女的中午做什么？
据：女的说“中午我还睡一个小时”。 | The woman says that at noon she also sleeps for an hour.
答：睡一个小时
错：看一个小时书 | 她中午是睡觉，不是看书。 | At noon she sleeps; she does not read.
错：打一个小时球 | 她中午是睡觉，对话没有说打球。 | At noon she sleeps; ball games are never mentioned.
问：女的晚上几点睡觉？
据：女的回答“晚上十一点”。 | The woman answers, "Eleven in the evening."
答：十一点
错：十二点 | 她说的是十一点，不是十二点。 | She says eleven, not twelve.
错：十点 | 她说的是十一点，不是十点。 | She says eleven, not ten.

女：外面风很大，你别出去了。
男：没事，我就去楼下药店买点儿药，很快就回来。
问：男的要去哪儿？
据：男的说“我就去楼下药店买点儿药”。 | The man says he is only going to the chemist's downstairs for some medicine.
答：楼下的药店
错：医院 | 他去的是药店，不是医院。 | He is going to the chemist's, not the hospital.
错：公园 | 对话没有说到公园。 | No park is mentioned.
问：外面天气怎么样？
据：女的说“外面风很大”。 | The woman says, "It's very windy outside."
答：风很大
错：雨很大 | 女的说的是风，不是雨。 | She speaks of wind, not rain.
错：雪很大 | 女的说的是风，不是雪。 | She speaks of wind, not snow.
`,
  },
];
