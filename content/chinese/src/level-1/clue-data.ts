// The clues of the gap sentences of the level 1 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelOneClues are the clues of the gap sentences of the level 1 words, by clueKey, each word's sentence counted as 1. */
export const levelOneClues = parseClues(`
你好/1 | 见面时先打招呼，后面才问名字 | People greet each other before asking a name, so the word must be a greeting, hello.
您好/1 | 后面用“您”有礼貌地问姓，开头是对长辈或客人的问候 | The question that follows uses the polite 您, so the word must be the polite greeting, hello.
谢谢/1 | 对方回答“不客气”，前面说的是感谢的话 | The answer is "you're welcome", so the word must be what one says to thank someone.
不客气/1 | 前面是“谢谢您！”，要回答别人的道谢 | The first speaker says "thank you", so the word must be the reply to thanks, you're welcome.
对不起/1 | 对方回答“没关系”，前面说的是道歉的话 | The answer is "it doesn't matter", so the word must be an apology, sorry.
没关系/1 | 前面是“对不起！”，要回答别人的道歉 | The first speaker says "sorry", so the word must be the reply to an apology, it doesn't matter.
再见/1 | 道谢以后，句末是分别时说的话 | The speaker thanks everyone and is leaving, so the word must be what one says on parting, goodbye.
请问/1 | 后面向人提问“这是什么？”，先有礼貌地说一句 | A question follows, "what is this?", so the word must be the polite way to begin asking, excuse me, may I ask.
名字/1 | “你叫什么……”问的是人的称呼 | The question "what are you called" asks for a person's name, so the word must mean name.
叫/1 | 后面是“什么名字”，问名称是什么 | The word comes before "what name", so it must mean to be called.
我们/1 | 我是好人，你也是好人，说的是我和你两个人 | I am good and you are good too, so the gap covers you and me, and the word must mean we.
你们/1 | 问“都叫什么名字”，问的是对面的几个人 | The question asks the names of all the people being spoken to, so the word must mean you, more than one.
他们/1 | 他和她都是好人，说的是他和她两个人 | He is good and she is good too, so the gap covers the two of them, and the word must mean they.
谁/1 | 有礼貌地问“您是……”，问的是什么人 | The speaker politely asks what person the listener is, so the word must mean who.
什么/1 | 指着一样东西问，问的是什么东西 | The speaker points at a thing and asks about it, so the word must mean what.
姓/1 | “请问您……什么？”问的是家族的姓 | The polite question asks about the listener's family name, so the word must mean to be surnamed.
这/1 | 指着自己的名字说，指的是近处的东西 | The speaker points at a name of their own close by, so the word must mean this.
那/1 | 前面说了“这是我的”，后面指另一样远处的东西 | "This is mine" comes first and something else is pointed at next, so the word must mean that.
人/1 | “好……”说的是他是什么样的人 | The sentence says what kind of person he is, so the word must mean person.
哪里/1 | “你在……？”问的是在什么地方 | The question asks where the listener is, so the word must mean where.
是/1 | 问“她……谁”，要说明她是什么人 | The question asks who she is, so the word must be the verb to be.
不/1 | 后面说“是他的”，回答是否定的 | The answer goes on "it is his", so it must say no first, and the word must mean not, no.
有/1 | 问名字是不是具备的，是“具有”的意思 | The question asks whether the listener has a name, so the word must mean to have.
没有/1 | 问“这里有人吗”，回答是没人 | The question asks if anyone is here and the reply denies it, so the word must mean there is not.
在/1 | 后面是地方“这里”，问人的位置 | A place, "here", follows, so the question is where he is, and the word must mean to be at.
很/1 | 放在“好”前面，说好的程度 | The word stands before "good" and tells how good, so it must mean very.
也/1 | 对方问好，我跟对方一样很好 | The speaker is as well as the other person, so the word must mean also.
都/1 | 主语是“我们”，说的是全部的人 | The subject is "we" and the sentence covers every one of us, so the word must mean all.
吗/1 | 句末是问号，问的是“是不是” | The sentence ends in a question mark and asks yes or no, so the word must be the yes-no question particle.
的/1 | “我”和“名字”之间，表示名字属于我 | The word joins "I" and "name" to show whose name it is, so it must be the possessive particle.
多少/1 | 问这里有几个人，人数可能很多 | The question asks how many people are here, a number that may be large, so the word must mean how many.
几/1 | 问年龄，“……岁”前要问一个数 | The question asks how many years old the listener is, so the word must mean how many, for a small number.
个/1 | “一”和“好人”之间要用量词 | A measure word is needed between "one" and "good person", so the word must be the general measure word.
岁/1 | “十”后面说年龄的单位 | The word follows "ten" and gives an age, so it must mean years old.
两/1 | 量词“个”前面说的数目是二 | The number comes right before the measure word 个, so the word must be two.
零/1 | 一百和五之间没有十位，要读出空位 | One hundred and five has nothing in the tens place, so the word must be zero.
百/1 | 十个十是多少 | Ten tens make a hundred, so the word must mean hundred.
千/1 | 十个一百是多少 | Ten hundreds make a thousand, so the word must mean thousand.
万/1 | 十个一千是多少 | Ten thousands make ten thousand, so the word must mean ten thousand.
多/1 | 和后面的“少”相对，说这里人数大 | The word is set against "few" there, so it must mean many.
一起/1 | 三个人在同一个地方 | The three of us are in the same place, so the word must mean together.
不少/1 | 说这里的人数比较多 | The sentence tells that there are a fair number of people here, so the word must mean quite a lot.
很多/1 | 和后面的“很少”相对，说这里人数大 | The word is set against "very few" there, so it must mean many.
有名/1 | “很……的人”，说这个人被很多人知道 | The sentence tells what kind of person he is, known to many, so the word must mean famous.
客人/1 | “我请的……”，是被请来的人 | They are people I invited, so the word must mean guests.
人们/1 | “都很好”说的是这里的许多人 | The sentence says all the people here are good, so the word must mean people.
关系/1 | 两个人之间“很好”的是他们的联系 | What is very good between the two of them is how they get on, so the word must mean relationship.
哪个/1 | 句末是问号，问几个中的一个 | The sentence asks which one of several is your name, so the word must mean which.
这个/1 | 和后面的“那个”相对，指近处的一个 | It is set against "that one" later, so the word must mean this one.
那个/1 | 前面说了“这个是我的”，后面指另一个 | "This one is mine" comes first and another is pointed at next, so the word must mean that one.
爸爸/1 | 爷爷的儿子，是我的父亲 | Grandpa's son who is mine is my father, so the word must mean dad.
妈妈/1 | 奶奶对我爸爸来说是母亲 | Grandma is my father's mother, so the word must mean mom.
哥哥/1 | 我是他弟弟，他比我大 | I am his younger brother, so he is older, and the word must mean elder brother.
姐姐/1 | 我是她妹妹，她比我大 | I am her younger sister, so she is older, and the word must mean elder sister.
弟弟/1 | 我是他哥哥，他比我小 | I am his elder brother, so he is younger, and the word must mean younger brother.
妹妹/1 | 我是她姐姐，她比我小 | I am her elder sister, so she is younger, and the word must mean younger sister.
爷爷/1 | 爸爸的爸爸，是父亲的父亲 | Father's father is my grandpa, so the word must mean grandpa.
奶奶/1 | 爸爸的妈妈，是父亲的母亲 | Father's mother is my grandma, so the word must mean grandma.
女儿/1 | 她是我姐姐，对妈妈来说是女孩子 | She is my elder sister, so to mother she is a girl child, and the word must mean daughter.
儿子/1 | 他是我哥哥，对爸爸来说是男孩子 | He is my elder brother, so to father he is a boy child, and the word must mean son.
家/1 | “有四个人”说的是一家人生活的地方 | The sentence counts the people of my household, so the word must mean family.
家人/1 | 爸爸、妈妈、哥哥都是一家里的人 | Dad, mom and my brother are all of one family, so the word must mean family members.
孩子/1 | 一个男孩和一个女孩，是他们的儿女 | A boy and a girl are what they have, so the word must mean children.
男孩/1 | 和后面的“她是女孩”相对，他是男性的小孩 | It is set against "she is a girl", so the word must mean boy.
女孩/1 | 和后面的“他是男孩”相对，她是女性的小孩 | It is set against "he is a boy", so the word must mean girl.
朋友/1 | 他不是哥哥，不是家人，是有交情的人 | He is not my brother but someone close to me, so the word must mean friend.
爱/1 | “很……我的家人”，说对家人很深的感情 | The sentence tells a deep feeling for my family, so the word must mean to love.
和/1 | 连接“我”和“哥哥”，后面说“都是” | The word joins "I" and "brother", and "both" follows, so it must mean and.
去/1 | 从这里到朋友家，是离开这里到别处 | We leave here for a friend's home, so the word must mean to go.
来/1 | 请你到我家，是从别处到这里 | You are asked to come over to my home, so the word must mean to come.
男人/1 | 是我爸爸，说的是成年的男子 | The person is my dad, so the word must mean man.
女人/1 | 是我妈妈，说的是成年的女子 | The person is my mom, so the word must mean woman.
男朋友/1 | 他和我姐姐是恋爱的关系，他是男方 | He is the man my sister is going out with, so the word must mean boyfriend.
女朋友/1 | 她和我哥哥是恋爱的关系，她是女方 | She is the woman my brother is going out with, so the word must mean girlfriend.
爱人/1 | 我爸爸对我妈妈来说是丈夫 | My dad is my mom's husband, so the word must mean husband or wife.
子女/1 | 两个儿子和一个女儿 | Two sons and a daughter are counted, so the word must mean sons and daughters.
姐妹/1 | 我和我姐姐，两个人都是女孩 | My sister and I are two girls of one family, so the word must mean sisters.
爸妈/1 | 后面说的是我爸爸和我妈妈两个人 | The words after it name my dad and my mom, so the word must mean mom and dad.
一家人/1 | 爸爸、妈妈和我，是全家的人 | Dad, mom and I make up our whole household, so the word must mean the whole family.
家里/1 | “有五个人”说的是家中的人数 | The sentence counts the people in my home, so the word must mean in the family.
今天/1 | 和后面的“明天是星期二”相对，这一天是星期一 | Tomorrow is Tuesday, so the day that is Monday is this one, and the word must mean today.
明天/1 | 今天是星期一，星期二是下一天 | Today is Monday and Tuesday comes next, so the word must mean tomorrow.
昨天/1 | 今天是星期一，星期日是前一天 | Today is Monday and Sunday came before, so the word must mean yesterday.
星期/1 | 有七天的是一周 | Seven days make it up, so the word must mean week.
星期一/1 | 星期日的下一天 | It comes right after Sunday, so the word must mean Monday.
星期日/1 | 星期六的下一天 | It comes right after Saturday, so the word must mean Sunday.
天/1 | 一个星期有七个这样的单位 | A week has seven of them, so the word must mean day.
年/1 | “今……十岁”说的是今年的年龄 | The sentence gives my age this year, so the word must mean year.
月/1 | 一年有十二个这样的单位 | A year has twelve of them, so the word must mean month.
日/1 | “五月一……”说的是一个月里的哪一天 | The date names a day of May, so the word must mean day of the month.
点/1 | “下午三……”说的是钟点 | The time of the afternoon is given in hours, so the word must mean o'clock.
分/1 | 八点后面的“十……”，是小时下面的单位 | The ten comes after eight o'clock, so the word must mean minutes.
号/1 | “几月几……”问的是日期 | The question asks which month and which day, so the word must mean date.
现在/1 | 问“几点了”，问的是这个时候 | The question asks what time it is at this moment, so the word must mean now.
时候/1 | “什么……来”问来的时间 | The question asks when the listener will come, so the word must mean time.
半/1 | “三点……”说的是三点三十分 | The time is thirty minutes past three, so the word must mean half.
早上/1 | 问“今天几点起来的”，是天亮以后的问候 | The question asks when the listener got up, so the greeting is for the morning, and the word must mean morning.
前天/1 | 今天是星期三，星期一是两天前 | Today is Wednesday and Monday was two days ago, so the word must mean the day before yesterday.
后天/1 | 今天是星期一，星期三是两天后 | Today is Monday and Wednesday is two days away, so the word must mean the day after tomorrow.
每天/1 | 六点起来是天天的习惯 | Getting up at six is what I do day after day, so the word must mean every day.
上/1 | 后面说“这个月是四月”，三月是前一个月 | This month is April and March came before it, so the word must mean last.
下/1 | 这个月是四月，五月是后一个月 | This month is April and May comes after it, so the word must mean next.
上午/1 | 早上九点是中午以前的时间 | Nine in the morning comes before noon, so the word must mean morning.
晚上/1 | “……好”是见面问好，前面要一个说时候的词 | The greeting "…好" needs a time of day before it, so the word must mean evening.
过/1 | “见……他的妈妈”说的是以前有过这件事 | The sentence tells of having met his mother at some time before, so the word must mark past experience.
了/1 | “昨天见……他”说的是这件事已经完成 | The meeting happened yesterday and is done, so the word must mark completion.
会/1 | 三岁的孩子已经有了叫爸爸妈妈的本领 | A three-year-old has learned to say mum and dad, so the word must mean can, know how to.
要/1 | 我打算去朋友家，说的是想做、将要做的事 | The speaker plans to go to a friend's home, so the word must mean to be going to.
住/1 | “……在哪里”问的是在什么地方生活 | The question asks where the listener lives, so the word must mean to live.
周/1 | “一……有七天”说的是一个星期 | One of them has seven days, so the word must mean week.
今年/1 | 和“明年十一岁”相对，十岁是这一年 | Next year I will be eleven, so ten is my age this year, and the word must mean this year.
明年/1 | 今年十岁，十一岁是下一年 | I am ten this year and eleven comes the year after, so the word must mean next year.
去年/1 | 今年十岁，九岁是前一年 | I am ten this year and was nine the year before, so the word must mean last year.
每年/1 | “五月……都去”说的是年年这样做 | We go to grandpa's every May without fail, so the word must mean every year.
下午/1 | 在朋友家见面的三点，是中午以后的时间 | We meet at a friend's home at three, a time after noon, so the word must mean afternoon.
一月/1 | 十二月的下一个月，是一年的头一个月 | The month after December is the first of the year, so the word must mean January.
十二月/1 | 十一月的下一个月，是一年的最后一个月 | The month after November is the last of the year, so the word must mean December.
前年/1 | 今年十岁，八岁是两年以前 | I am ten this year and was eight two years ago, so the word must mean the year before last.
后年/1 | 今年十岁，十二岁是两年以后 | I am ten this year and will be twelve in two years, so the word must mean the year after next.
星期六/1 | 星期五的下一天 | It comes right after Friday, so the word must mean Saturday.
吃/1 | 我饿了，米饭是要吃进去的东西 | I am hungry and rice is food, so the word must mean to eat.
喝/1 | 一杯热茶是要喝的东西 | A cup of hot tea is something to drink, so the word must mean to drink.
米饭/1 | 不吃面，想吃另一种主食 | The speaker does not want noodles but another staple to eat, so the word must mean rice.
茶/1 | “喝一杯热……”说的是热的饮料 | It is a hot drink served by the cup, so the word must mean tea.
鸡蛋/1 | “吃了两个……”说的是早上吃的、按个数的东西 | Two of them were eaten at breakfast, so the word must mean eggs.
饿/1 | 后面说“我想吃饭”，是肚子空了 | The speaker wants to eat, so the word must mean hungry.
热/1 | 茶太烫，现在不能喝 | The tea cannot be drunk yet, so it must be too hot, and the word must mean hot.
杯子/1 | 我想喝水，要一个装水的东西 | The speaker wants water and asks for something to hold it, so the word must mean cup.
做饭/1 | 妈妈在家，晚上一起吃的饭是她做的 | We will eat together in the evening what mother is making at home, so the word must mean to cook.
喜欢/1 | “很……喝茶”说的是对喝茶有好感 | The sentence tells how I feel about drinking tea, so the word must mean to like.
早饭/1 | 每天早上七点吃的是早上的饭 | It is the meal eaten at seven every morning, so the word must mean breakfast.
牛奶/1 | 早上喝了一杯，是一种饮料 | A cup of it was drunk in the morning, so the word must mean milk.
水/1 | 天热，想喝冷的东西 | It is hot and the speaker wants a cold drink, so the word must mean water.
面包/1 | “早饭吃了一个……”说的是早饭吃的东西 | One of them was eaten for breakfast, so the word must mean bread.
鸡肉/1 | 菜是用一种肉做的，不是牛肉 | The dish is made of a meat that is not beef, so the word must mean chicken.
好吃/1 | 妈妈做的菜味道很好 | Mother's cooking tastes good, so the word must mean tasty.
好喝/1 | 说的是这杯茶的味道 | It is the taste of a cup of tea, a drink, so the word must mean tasty, of drinks.
冷/1 | 想喝热茶，是因为天气不暖和 | The speaker wants hot tea because of the weather, so the word must mean cold.
想/1 | “我……吃面包”说的是我的愿望 | The sentence tells what I would like to eat, so the word must mean to want to.
给/1 | “请……我一杯水”，是让别人把水交给我 | The speaker asks someone to hand over a cup of water, so the word must mean to give.
午饭/1 | 早饭以后、晚饭以前，十二点吃的饭 | It is the meal at twelve between breakfast and dinner, so the word must mean lunch.
晚饭/1 | 晚上七点吃的饭 | It is the meal at seven in the evening, so the word must mean dinner.
菜/1 | 妈妈做了三个，说的是一盘一盘的饭菜 | Mother made three of them, so the word must mean dishes.
鱼/1 | 菜不是用肉做的，用的是另一种东西 | The dish is not made of meat but of something else, so the word must mean fish.
水果/1 | 每天吃很多，是一种吃的东西 | It is something eaten in large amounts every day, so the word must mean fruit.
酒/1 | 爸爸晚饭时喝了一杯，是大人喝的饮料 | Father drank a cup of it at dinner, so the word must mean alcohol.
太/1 | 菜热得不能吃，程度过了头 | The dish is too hot to eat now, so the word must mean too.
真/1 | 句末是感叹号，说鱼确实好吃 | The exclamation mark shows how good the fish is, so the word must mean really.
可以/1 | 句末“吗”，有礼貌地问能不能喝水 | The speaker politely asks whether drinking water is allowed, so the word must mean may.
用/1 | 喝水时拿杯子当工具 | We drink with a cup as the tool, so the word must mean to use.
牛肉/1 | 菜是用一种肉做的，不是鸡肉 | The dish is made of a meat that is not chicken, so the word must mean beef.
包子/1 | 早上吃了两个，是按个数的面食 | Two of them were eaten in the morning, so the word must mean steamed buns.
饭菜/1 | 妈妈做的，说的是吃的饭和菜 | Mother cooked it and it tastes good, so the word must mean food.
热水/1 | 天冷，请人给一杯热的水 | It is cold and the speaker asks for a cup of something hot, so the word must mean hot water.
吃饭/1 | 我饿了，我们一起去吃东西 | I am hungry, so we go to eat, and the word must mean to eat a meal.
面/1 | 不吃米饭，想吃另一种主食 | The speaker does not want rice but another staple, so the word must mean noodles.
做/1 | 妈妈在弄饭，一会儿我们吃 | Mother is making the meal we will eat soon, so the word must mean to make.
杯/1 | “两……水”说的是喝水的量 | Water is counted here in twos, so the word must be the measure word cup.
一点/1 | “喝……热水”说的是喝不多的量 | The speaker wants only some hot water, so the word must mean a little.
以后/1 | 先吃饭，再一起喝茶 | Tea comes once the meal is over, so the word must mean after.
钱/1 | 不能买东西，是因为没有这个 | The speaker cannot buy because something is missing, so the word must mean money.
块/1 | 包子的价钱，“两……钱” | The price of the bun is given before 钱, so the word must be the spoken unit yuan.
元/1 | 衣服的价钱，“一百……” | The price of the clothes is given in a unit of money, so the word must mean yuan.
买/1 | 没有新衣服，想花钱拿到一件 | The speaker has no new clothes and wants to get one with money, so the word must mean to buy.
卖/1 | 问商店有没有水果拿出来换钱 | The question asks whether the shop offers fruit for money, so the word must mean to sell.
东西/1 | 去商店买的，是各种物品 | What one buys at a shop is things, so the word must mean stuff.
贵/1 | 不买，是因为价钱太高 | The speaker will not buy because of the price, so the word must mean expensive.
便宜/1 | 我们买吧，是因为价钱低 | The speaker wants to buy because of the price, so the word must mean cheap.
多少钱/1 | 句末是问号，问衣服的价钱 | The question asks the price of the clothes, so the word must mean how much.
商店/1 | 家前面有一个卖东西的地方 | There is a place in front of my home where things are sold, so the word must mean shop.
衣服/1 | “一件新……”是穿的东西 | It is counted with 件 and is new, something worn, so the word must mean clothes.
穿/1 | 天冷，要多加一件衣服在身上 | It is cold, so one more item of clothing should go on, and the word must mean to wear.
件/1 | “两……衣服”，衣服用的量词 | Clothes are being counted, so the word must be their measure word.
新/1 | “昨天买的”，衣服不是旧的 | The clothes were bought yesterday, so the word must mean new.
大/1 | 和后面的“我要小一点的”相对 | The speaker wants a smaller one next, so this one must be big.
小/1 | 和后面的“我要大一点的”相对 | The speaker wants a bigger one next, so this one must be small.
白/1 | 说的是米饭的颜色 | It is the colour of rice, so the word must mean white.
黑/1 | 晚上天的颜色 | It is the colour of the sky at night, so the word must mean dark, black.
大小/1 | 衣服“很好”的地方，是合不合身 | What is just right about the clothes is how they fit, so the word must mean size.
一些/1 | “买了……水果”，说的是不确定的数量 | An unstated amount of fruit was bought, so the word must mean some.
开/1 | 和后面“晚上十点关”相对，早上是开门 | The shop closes at ten at night, so in the morning it must open, and the word must mean to open.
能/1 | 句末“吗”，问自己可不可以穿 | The speaker asks whether trying on the clothes is possible, so the word must mean can.
怎么/1 | “……卖”问的是用什么方式、什么价钱卖 | The question asks in what way the thing is sold, so the word must mean how.
怎么样/1 | 句末是问号，问别人对衣服的看法 | The question asks what the listener thinks of the clothes, so the word must mean how is it.
还/1 | 买了衣服以外，另外又买了包 | Bags were bought besides the clothes, so the word must mean also.
就/1 | “现在……去”说的是马上去 | We go to the shop at once, right now, so the word must mean right away.
吧/1 | 句末是感叹号，提出一起去的建议 | The sentence suggests going to the shop together, so the word must mark a suggestion.
这些/1 | “都是我的”，指近处的好几件衣服 | Several clothes nearby are all mine, so the word must mean these.
那些/1 | 前面说了“这些是我的”，后面指另外几样 | "These are mine" comes first and other things are pointed at next, so the word must mean those.
新年/1 | 一月一日是一年开始的节日 | The first of January starts the year, so the word must mean New Year.
大家/1 | 新来的人向在场的所有人问好 | A newcomer greets everyone present, so the word must mean everybody.
小孩/1 | 他不是大人，是年纪小的人 | He is not an adult, so the word must mean child.
大人/1 | 他是小孩，他爸爸是成年人 | He is a child and his father is grown up, so the word must mean adult.
白天/1 | 和后面的“晚上很冷”相对，说的是天亮的时候 | It is hot then and cold at night, so the word must mean daytime.
一样/1 | 我的衣服和你的衣服没有不同 | My clothes and yours do not differ, so the word must mean the same.
多大/1 | “今年……”问的是年龄 | The question asks the listener's age this year, so the word must mean how old.
还是/1 | 问喝茶或者喝水，在两样里选 | The question offers a choice between tea and water, so the word must mean or.
小朋友/1 | 问“你几岁了”，是对小孩的称呼 | The speaker asks a child's age, so the word must be the way to address a child.
可能/1 | 说明天冷不冷，还不确定 | Whether tomorrow will be cold is not certain, so the word must mean maybe.
开会/1 | 爸爸下午要和别人一起商量事情 | Father has to meet with others this afternoon, so the word must mean to have a meeting.
学校/1 | 每天早上七点去、在那里上课的地方 | It is the place I go to at seven every morning, so the word must mean school.
学生/1 | 和“她是老师”相对，我是跟老师学习的人 | She is the teacher and I am set against her, so the word must mean student.
老师/1 | “我们是她的学生”，她就是教我们的人 | We are her students, so she must be the one who teaches us, and the word must mean teacher.
同学/1 | 他和我在一个班里学习 | He and I are in the same class, so the word must mean classmate.
书/1 | “一本……”说的是用“本”来数的东西 | It is counted with 本 and can be bought, so the word must mean book.
本/1 | “三……汉语书”，书用的量词 | Books are being counted, so the word must be their measure word.
上课/1 | 八点在学校开始的事 | It is what we start at eight o'clock at school, so the word must mean to have class.
下课/1 | 课上完了，可以去吃午饭 | We can go to lunch now, so the lesson must be over, and the word must mean class is over.
班/1 | 有三十个学生的一群人 | It is a group with thirty students in it, so the word must mean class.
学习/1 | 在中国做的、和汉语有关的事 | The speaker is in China to take in the Chinese language, so the word must mean to study.
中国/1 | 去那里学习汉语的国家 | It is the country to go to for learning Chinese, so the word must mean China.
汉语/1 | “说一点……”，说的是一种语言 | He can speak a little of it, so it must be a language, and the word must mean Chinese.
中文/1 | 书是用一种语言文字写的 | The book is written in a language, so the word must mean Chinese.
汉字/1 | “这个……怎么读”，问的是一个字 | The question asks how one of them is read aloud, so the word must mean Chinese character.
读/1 | “这个字怎么……”问的是字的读音 | The question asks how to say the character out loud, so the word must mean to read aloud.
写/1 | 在本子上留下了我的名字 | My name went onto the notebook, so the word must mean to write.
听/1 | 老师在说话，请你用耳朵 | The teacher is talking, so the listener is asked to use their ears, and the word must mean to listen.
说/1 | 后面是冒号和引号，引出他的话 | A colon and quotation marks follow with his words, so the word must mean to say.
说话/1 | 上课的时候不该做的事 | It is what one should not do in class, so the word must mean to talk.
中国人/1 | 他家在中国，他是那里的人 | His home is in China, so the word must mean Chinese person.
知道/1 | 不清楚他叫什么名字这件事 | The speaker cannot say what his name is, so the word must mean to know, a fact.
认识/1 | 他是我的同学，我和他见过面、熟悉 | He is my classmate, so I must be acquainted with him, and the word must mean to know, a person.
考试/1 | 明天要有的、考汉语的事 | Tomorrow we have a test in Chinese, so the word must mean exam.
题/1 | “这道……太难了”，“道”是题目的量词 | It is counted with 道 and is too hard, so the word must mean question, in an exercise.
难/1 | 汉字写起来不容易 | Chinese characters are not easy to write, so the word must mean difficult.
第一/1 | 考试考到了最前面的名次 | It is a place in the exam results, the top one, so the word must mean first.
课/1 | “学第五……”，书里一节一节的内容 | We study the fifth of them in the book, so the word must mean lesson.
课本/1 | “我的汉语……”，上课用的书 | It is the book for my Chinese class, so the word must mean textbook.
问题/1 | 学生向老师要问的东西 | A student tells the teacher there is something to ask, so the word must mean question.
老/1 | 爷爷年纪很大了 | Grandpa has many years behind him, so the word must mean old.
大学/1 | 哥哥十九岁，在那里学习 | My brother is nineteen and studies there, so the word must mean university.
中学/1 | 十四岁的人读书的学校 | The speaker is fourteen and studies there, so the word must mean middle school.
小学/1 | 七岁的人读书的学校 | My sister is seven and studies there, so the word must mean primary school.
学会/1 | 后面有“了”，会写名字了 | The speaker can now write their own name, so the word must mean to learn and master.
生日/1 | 今天我十岁了，是出生的日子 | I turn ten today, so the word must mean birthday.
本子/1 | 在上面写字的东西 | It is something to write characters on, so the word must mean notebook.
书包/1 | 书和本子都放在它里边 | My books and notebooks are inside it, so the word must mean schoolbag.
写字/1 | 用本子做的事 | It is what one does with a notebook, so the word must mean to write characters.
读书/1 | 他在大学里做的事 | It is what he does at university, so the word must mean to study.
中午/1 | 十二点吃午饭的时候 | Lunch is at twelve, so the word must mean noon.
老人/1 | 爷爷奶奶年纪都很大了 | Grandpa and grandma have grown old, so the word must mean old person.
国家/1 | 中国是一个这样的大地方 | China is a very big one of them, so the word must mean country.
认真/1 | 她学习的样子，所以考了第一 | She came first in the exam because of how she studies, so the word must mean conscientious.
开学/1 | 九月一日学校开始上课 | The first of September is when school begins, so the word must mean school starts.
上学/1 | 每天早上七点去学校 | Every morning at seven I set off to school, so the word must mean to go to school.
学期/1 | 有二十个星期的一段上学时间 | It is a stretch of school time twenty weeks long, so the word must mean semester.
小时/1 | 一天有二十四个 | A day has twenty-four of them, so the word must mean hour.
文字/1 | 汉字是中国用来写话的东西 | Chinese characters are China's way of writing, so the word must mean writing, script.
不同/1 | 这两个汉字不一样 | The two characters are not alike, so the word must mean different.
话/1 | “听老师的……”，老师说的东西 | It is what the teacher says and we should listen to, so the word must mean words.
左边/1 | 和后面的“右边”相对 | He is on my right in the second half, so I must be on his left, and the word must mean left.
右边/1 | 和后面的“左边”相对 | I am on his left in the second half, so he must be on my right, and the word must mean right.
前边/1 | 和前面的“我在他后边”相对 | I am behind him, so he must be in front of me, and the word must mean front.
后边/1 | 和前面的“他在我前边”相对 | He is in front of me, so I must be behind him, and the word must mean back.
里边/1 | 外边很冷，所以去房子以内的地方 | It is cold outside, so we go in, and the word must mean inside.
外边/1 | 里边人太多，所以去另一边 | There are too many people inside, so we go out, and the word must mean outside.
北京/1 | 中国首都一所有名大学的名字 | It names a famous university in China's capital, so the word must mean Beijing.
近/1 | 走一会儿就到了，路不长 | One gets there after a short walk, so the word must mean near.
远/1 | 要走一个小时，路很长 | It takes an hour to walk there, so the word must mean far.
呢/1 | 说了我自己，再问对方怎么样 | The speaker has said how they are and asks the same back, so the word must be the particle that asks the same question back.
门/1 | “请开……”，能开能关的东西 | It is something one is asked to open, so the word must mean door.
房间/1 | 家里有三个，住人的地方 | A home has three of them, so the word must mean room.
公园/1 | 星期天去走走、玩的地方 | It is a place to go for a walk on Sunday, so the word must mean park.
医院/1 | 医生每天上班的地方 | My mother is a doctor and works there, so the word must mean hospital.
医生/1 | 在医院里看病的人 | He goes to the hospital to see the one who treats the sick, so the word must mean doctor.
路/1 | 从我家到学校要走的地方 | It runs from my home to school, so the word must mean road.
楼/1 | “住在三……”，说的是房子的一层 | The home is on the third of them, so the word must mean floor.
大门/1 | 学校前面进出的地方 | It is where one waits at the front of the school, so the word must mean main gate.
饭店/1 | 晚上去吃饭的地方 | It is a place to go out to eat in the evening, so the word must mean restaurant.
东边/1 | 说学校在公园的哪一边 | The sentence tells on which side of the park the school is, so the word must mean east.
走/1 | 用脚走路去学校 | We go to school on foot along the road, so the word must mean to walk.
到/1 | 八点来到了学校 | We get to school at eight, so the word must mean to arrive.
从/1 | 北京是他来的地方 | Beijing is where the speaker comes from, so the word must mean from.
回/1 | 下课了，去自己的家 | Class is over and I go home, so the word must mean to go back.
出/1 | 从房间里走到外边来 | He comes from inside the room to outside, so the word must mean out.
进/1 | 请人到房间里来，再请坐 | The guest is asked inside before being asked to sit, so the word must mean to enter.
找/1 | 我在看书包在哪里 | The speaker is trying to see where the schoolbag is, so the word must mean to look for.
往/1 | “……前走”，说的是走的方向 | The sentence tells which way to walk, so the word must mean towards.
坐/1 | 请进来以后，请人坐在椅子上 | Once the guest is in, they are asked to take a seat, so the word must mean to sit.
等/1 | 在大门那里待着，到你来为止 | I stay at the gate until you come, so the word must mean to wait.
回家/1 | 下课了，去自己家 | Class is over and we go to our homes, so the word must mean to go home.
出去/1 | 外边天很好，去外边走走 | The weather outside is fine, so we go out for a walk, and the word must mean to go out.
进来/1 | 外边冷，请人到里边来 | It is cold outside, so the guest is asked in, and the word must mean to come in.
回来/1 | 爸爸去北京了，明天来家 | Father went to Beijing and will be home tomorrow, so the word must mean to come back.
这里/1 | 我家就在说话的地方 | My home is right where I am, so the word must mean here.
那里/1 | 和“我在这里”相对 | I am here and he is set against me, so the word must mean there.
方便/1 | 走一会儿就到，去学校很容易 | Getting to school takes only a short walk, so the word must mean convenient.
楼上/1 | 和“我家在楼下”相对 | My home is downstairs and his is set against it, so the word must mean upstairs.
楼下/1 | 和“他家在楼上”相对 | His home is upstairs and mine is set against it, so the word must mean downstairs.
西边/1 | 和“学校在公园的东边”相对 | The school is east of the park and my home is set against it, so the word must mean west.
走路/1 | 家很近，用脚去学校 | My home is close, so I go to school on foot, and the word must mean to walk.
进去/1 | 门开了，到里边去 | The door is open, so we can go in, and the word must mean to go in.
过来/1 | 请人到我这里坐 | The listener is asked to come and sit by me, so the word must mean to come over.
南方/1 | 和“北京在中国的北方”相对 | Beijing is in the north, so it is not in the opposite part, and the word must mean the south.
北方/1 | 说的是北京在中国的哪一边 | Beijing lies in the northern part of China, so the word must mean the north.
路上/1 | 在回家的路中间找到了书包 | The schoolbag was found while going home, so the word must mean on the way.
等等/1 | “我也去”，请别人停一下等我 | The speaker wants to go too and asks to be waited for, so the word must mean wait a moment.
找到/1 | 在房间里找，书有了 | The book turned up in the room, so the word must mean to find.
坐下/1 | 要上课了，请大家坐好 | Class is about to start, so everyone is asked to take a seat, and the word must mean to sit down.
房子/1 | 有三个房间，很大 | It is big and has three rooms, so the word must mean house.
外语/1 | 在学校里学的别国的语言 | It is something studied at school, a language of another country, so the word must mean foreign language.
外国/1 | 去那里学习的、别的国家 | It is somewhere abroad to go and study, so the word must mean foreign country.
外国人/1 | 他不是中国人，是别国的人 | He is not Chinese, so the word must mean foreigner.
国外/1 | 住了两年的、自己国家以外的地方 | He lived for two years outside his own country, so the word must mean abroad.
校园/1 | 学校里有很多楼的地方 | It is a school's grounds with many buildings, so the word must mean campus.
院子/1 | 奶奶家房子前后、有小门的地方 | It is the open space at grandma's home with a small gate, so the word must mean courtyard.
回国/1 | 在中国学习了两年，要回到自己的国家 | He has studied in China for two years and will now go home, so the word must mean to return to one's country.
出国/1 | 到国外去学习外语 | The speaker wants to go to another country to learn a language, so the word must mean to go abroad.
从前/1 | 和后面的“现在有了”相对 | There is a road now but there was none before, so the word must mean in the past.
外面/1 | 很冷，所以要在房间里 | It is cold there, so we stay in the room, and the word must mean outside.
飞机/1 | 在天上飞的东西 | It flies in the sky, so the word must mean plane.
船/1 | 在水上走的东西 | It moves on water, so the word must mean boat.
火车/1 | 在铁路上走的车 | It runs on the railway, so the word must mean train.
坐车/1 | 坐着车去公园 | We ride to the park, so the word must mean to take a bus or car.
地铁/1 | 在地下走的车 | It runs under the ground, so the word must mean subway.
机场/1 | 去那里坐飞机的地方 | It is where one goes to take a plane, so the word must mean airport.
火车站/1 | 去那里坐火车的地方 | It is where one goes to take a train, so the word must mean railway station.
票/1 | 坐火车以前要先买的东西 | It must be bought before taking a train, so the word must mean ticket.
开车/1 | “会……”，说的是爸爸有的本领 | It is a skill my father has, so the word must mean to drive.
车站/1 | 在那里等车的地方 | It is where one waits for a bus, so the word must mean stop, station.
快/1 | 和后面的“火车很慢”相对 | The train is slow and the plane is set against it, so the word must mean fast.
慢/1 | 和后面的“飞机很快”相对 | The plane is fast and the train is set against it, so the word must mean slow.
次/1 | “去过北京两……”，说的是去的回数 | It counts how many times I have been to Beijing, so the word must mean time.
送/1 | 去机场跟要走的朋友说再见 | I go to the airport for a friend who is leaving, so the word must mean to see off.
带/1 | 去公园，问有没有拿着水 | Before going to the park, the speaker asks whether water is with you, so the word must mean to take, to bring.
跟/1 | 和妈妈一起去北京 | I go to Beijing together with mother, so the word must mean with.
别/1 | 后面说“等等我”，叫人不要走 | The speaker asks to be waited for, so the word must tell the other not to go, and it must mean don't.
让/1 | 妈妈不同意我一个人去 | Mother does not allow me to go alone, so the word must mean to let.
先/1 | 和后面的“再去公园”相对 | We go to the park afterwards, so the meal comes before it, and the word must mean first.
铁路/1 | 有了它，就可以坐火车去 | Because of it we can take the train there, so the word must mean railway.
地方/1 | 北京是一个很好的什么 | Beijing is a fine one of them, so the word must mean place.
上车/1 | 车来了，快到车上去 | The bus has come, so we hurry aboard, and the word must mean to get on.
下车/1 | 到站了，从车上下来 | We have reached the stop, so we leave the bus, and the word must mean to get off.
慢走/1 | 客人要走时主人说的话 | It is what a host says to a guest who is leaving, so the word must mean take care.
飞/1 | 东西在天上 | Something is moving in the sky, so the word must mean to fly.
先生/1 | 有礼貌地叫一个男人，再问他去哪里 | The speaker politely addresses a man before asking where he is going, so the word must mean sir.
别人/1 | 书不是我的，是另外的人的 | The book is not mine but someone else's, so the word must mean other people.
机票/1 | 明天坐飞机，买的是飞机的票 | The speaker will fly tomorrow, so the ticket bought must be for a plane, and the word must mean plane ticket.
车票/1 | 坐火车要买的票 | One needs it to take a train, so the word must mean bus or train ticket.
出门/1 | 早上七点从家里出来去学校 | I leave home at seven in the morning for school, so the word must mean to go out.
第一次/1 | 以前没来过北京，这是头一回 | It is the speaker's very first visit to Beijing, so the word must mean the first time.
下次/1 | 这次没有时间，以后的那一次再去 | There is no time this time, so we go another time, and the word must mean next time.
上次/1 | 和后面的“这次”相对，是以前的那一次 | It is set against "this time" as the time before, so the word must mean last time.
慢慢/1 | 路上车多，开车不要快 | There are many cars on the road, so one should not drive fast, and the word must mean slowly.
地上/1 | 书在下边的地面上 | The book is lying on the floor, so the word must mean on the ground.
送给/1 | 书是我给你的礼物 | The book is a present from me to you, so the word must mean to give as a present.
快要/1 | 火车要开了，所以快上车 | We must hurry aboard because the train is leaving soon, so the word must mean about to.
带来/1 | 问对方拿来了什么吃的 | The speaker asks what food the other has brought along, so the word must mean to bring.
地下/1 | 地铁走的地方 | It is where the subway runs, so the word must mean underground.
有事/1 | 不能去送你，是因为今天有别的事要做 | I cannot see you off because something else needs doing, so the word must mean to have something to do.
天气/1 | 今天很好，可以去公园 | It is fine today so we can go to the park, so the word must mean weather.
下雨/1 | 别出去了，因为天上有雨下来 | We should not go out because water is falling from the sky, so the word must mean to rain.
下雪/1 | 冬天，地上都是白的 | It is winter and the ground is all white, so the word must mean to snow.
雨/1 | 很大，所以你别出去 | It is heavy, so you should not go out, and the word must mean rain.
雪/1 | 是白色的 | It is white, so the word must mean snow.
风/1 | 外边很大，所以要多穿衣服 | It is strong outside, so one should wear more, and the word must mean wind.
晴/1 | 天气很好，是没有云的天 | The weather is fine, so the day must be clear, and the word must mean sunny.
阴天/1 | 和“不是晴天”相对 | It is not a sunny day, so the word must mean cloudy day.
比/1 | 拿今天和昨天比冷不冷 | Today and yesterday are compared for cold, so the word must mean than.
春天/1 | 冬天以后来的季节 | It is the season that comes after winter, so the word must mean spring.
夏天/1 | 天气很热的季节 | It is the hot season, so the word must mean summer.
秋天/1 | 夏天以后来的季节 | It is the season that comes after summer, so the word must mean autumn.
冬天/1 | 很冷、北京会下雪的季节 | It is the cold season when Beijing has snow, so the word must mean winter.
晴天/1 | 没有雨的天 | There is no rain today, so the word must mean sunny day.
大风/1 | 你别出去，因为风很大 | You should not go out because of it, so the word must mean strong wind.
雨天/1 | 出门要带雨衣的日子 | It is a day to take a raincoat, so the word must mean rainy day.
雪人/1 | 下雪了，在外边用雪做的东西 | It snowed and we make something out of the snow outside, so the word must mean snowman.
小雨/1 | 下的雨不大 | The rain is not heavy, so the word must mean light rain.
天上/1 | 飞机飞的地方 | It is where planes fly, so the word must mean in the sky.
下来/1 | 从楼上到下边来 | The listener is asked to come down from upstairs, so the word must mean to come down.
大雪/1 | 下了一场，地上都是白的 | After it fell the ground was all white, so the word must mean heavy snow.
大雨/1 | 下了一场，路上都是水 | After it fell the road was covered in water, so the word must mean heavy rain.
雨衣/1 | 下雨了，要穿的衣服 | It is raining, so one must wear it, and the word must mean raincoat.
冷水/1 | 天太热，想喝不热的水 | It is too hot, so the speaker wants a cup of something cold, and the word must mean cold water.
天天/1 | 他早上都喝一杯牛奶 | He drinks milk every single morning, so the word must mean every day.
很少/1 | 北京的春天下雨不多 | Rain does not often fall in a Beijing spring, so the word must mean seldom.
不太/1 | 你不用多穿衣服，因为不怎么冷 | There is no need for extra clothes because it is not so cold, so the word must mean not very.
好多/1 | 公园里有很多人 | The park is full of people, so the word must mean a lot of.
雪白/1 | 衣服的颜色像雪一样 | The clothes are the colour of snow, so the word must mean snow-white.
红/1 | 中国新年时很多东西的颜色 | It is the colour of many things at Chinese New Year, so the word must mean red.
玩/1 | 明年去北京，是去玩一玩 | The speaker will go to Beijing next year for fun, so the word must mean to play, to have fun.
看/1 | 我喜欢用眼睛读书 | It is what I like doing with books, so the word must mean to look at, to read.
电视/1 | 晚上在家里看的东西 | It is what one watches at home in the evening, so the word must mean television.
电影/1 | 去看一个新的 | One goes out to see a new one of them, so the word must mean film.
唱歌/1 | 她唱得很好 | She sings very well, so the word must mean to sing.
打球/1 | 去球场做的事 | It is what one does at a ball court, so the word must mean to play ball.
跑/1 | “……得很快”，说的是他的速度 | He does it very fast, so the word must mean to run.
休息/1 | 工作了一天，想停下来 | After a day's work the speaker wants a break, so the word must mean to rest.
睡觉/1 | 晚上十点要做的事 | It is what I do at ten at night, so the word must mean to sleep.
有意思/1 | 说电影看起来怎么样 | It describes how the film is to watch, so the word must mean interesting.
工作/1 | 爸爸每天在医院做的事 | It is what my father does at the hospital, so the word must mean to work.
忙/1 | 没有时间玩，是因为事很多 | The speaker has no time to play, so the word must mean busy.
意思/1 | 问这个字说的是什么 | The question asks what the character stands for, so the word must mean meaning.
事/1 | 不能来，是因为有要做的事情 | The speaker cannot come because something needs doing, so the word must mean matter, thing.
觉得/1 | 说我对电影的看法 | The sentence gives my view of the film, so the word must mean to think, to feel.
看见/1 | 在路上用眼睛见到了老师 | I caught sight of my teacher on the road, so the word must mean to see.
听见/1 | 外边有人叫你，问你的耳朵有没有听到 | Someone outside is calling you, so the question asks whether you heard it, and the word must mean to hear.
打电话/1 | 我给妈妈说话，用的是电话 | I am calling mother, so the word must mean to make a phone call.
电话/1 | “……号”问的是电话的号码 | The question asks for its number, so the word must mean telephone.
工人/1 | 他每天工作八个小时 | He works eight hours a day, so the word must mean worker.
看书/1 | 和“不喜欢看电视”相对，在家读书 | It is set against watching television, so the word must mean to read books.
电影院/1 | 去那里看电影的地方 | It is where one goes to see a film, so the word must mean cinema.
歌/1 | 听起来很好的东西 | It is something that sounds good, so the word must mean song.
好听/1 | 说她唱歌的声音 | It describes how her singing sounds, so the word must mean pleasant to hear.
好看/1 | 说衣服看起来怎么样 | It describes how the clothes look, so the word must mean good-looking.
好玩/1 | 说在公园里玩得怎么样 | It describes how the park is to play in, so the word must mean fun.
打开/1 | “请……门”，让门开着 | The listener is asked to make the door open, so the word must mean to open.
球/1 | 带去“打一会儿”的东西 | It is something to bring along and play with, so the word must mean ball.
唱/1 | “……得很好”，说她唱歌的本领 | She does it very well, as a singer would, so the word must mean to sing.
有时候/1 | 和后面的“有的时候在家”相对 | It is set against the times spent at home, so the word must mean sometimes.
看看/1 | 问能不能看一下你的书 | The speaker asks to take a look at your book, so the word must mean to have a look.
午睡/1 | 吃了午饭以后睡一会儿 | It is a sleep of an hour after lunch, so the word must mean afternoon nap.
打/1 | “……球”，玩球的动作 | It goes with 球 for playing ball, so the word must mean to play.
晚会/1 | 学校晚上的新年活动 | It is the school's New Year event in the evening, so the word must mean evening party.
意见/1 | 想听听你怎么想 | The speaker wants to hear what you think, so the word must mean opinion.
得/1 | 跑和“很快”中间，说跑的样子 | It links running to how fast it is done, so the word must link a verb to how it is done.
球场/1 | 打球的地方 | It is where we play ball, so the word must mean court, field.
作文/1 | 今天写的，写的是我的家 | It is a piece written today about my family, so the word must mean composition.
下班/1 | 爸爸每天五点工作完了 | Father finishes work at five every day, so the word must mean to get off work.
小说/1 | “这本……”，一本有意思的书 | It is a book counted with 本 and is interesting to read, so the word must mean novel.
听说/1 | 我从别人那里知道你要去北京 | I learned from others that you are going to Beijing, so the word must mean to hear that.
别的/1 | 这个不好，问有没有另外的 | This one is no good, so the speaker asks for another, and the word must mean other.
有用/1 | 说这本书对人有好处 | It says the book is of help, so the word must mean useful.
没事/1 | 回答别人说的“对不起” | It answers "sorry", so the word must mean it's nothing.
不用/1 | 明天可以去玩，因为不要上课 | We can go out to play tomorrow because classes are not needed, so the word must mean no need.
回去/1 | 太晚了，要回到家里 | It is too late, so the speaker must go home, and the word must mean to go back.
起来/1 | 早上七点了，快下床 | It is seven in the morning, so you must get out of bed, and the word must mean to get up.
上去/1 | 他在楼上，我们到上边去 | He is upstairs, so we go up to him, and the word must mean to go up.
一下/1 | “请等……”，等很短的时间 | The listener is asked to wait a short while, so the word must mean briefly.
时间/1 | 很忙，所以没有空 | The speaker is busy and has none to spare, so the word must mean time.
那么/1 | 你不想去，就由我一个人去 | You do not want to go, and in that case I will go alone, so the word must mean then, in that case.
这么/1 | 问今天为什么冷到这个样子 | The speaker wonders why it is so cold today, so the word must mean so, such.
还有/1 | 买了水果以外，另外又有面包 | Bread was bought besides the fruit, so the word must mean also, and.
就是/1 | 说他正是我的老师 | It says he is the very person who teaches me, so the word must mean exactly.
可是/1 | 衣服很好看，后面说太贵了 | The clothes look good but are too dear, so the word must mean but.
要是/1 | 明天下雨，就不去公园，说的是假设 | We will skip the park only if it rains tomorrow, so the word must mean if.
有的/1 | 这些书里，一部分是我的 | Of these books, part are mine and part his, so the word must mean some.
打车/1 | 太晚了，坐出租车回家 | It is too late, so we take a taxi home, and the word must mean to take a taxi.
这样/1 | 说这个字要用这种方法写 | It says the character should be written in this way, so the word must mean like this.
不是/1 | 回答“你是老师吗”，后面说“我是学生” | The answer goes on to say "I am a student", so the word must mean no, it isn't.
爱好/1 | 我喜欢做的事是唱歌 | Singing is what I love to do, so the word must mean hobby.
电视机/1 | 家里新买的、看电视用的东西 | It is a newly bought thing at home for watching programmes, so the word must mean TV set.
作家/1 | 写了很多小说的人 | He has written many novels, so the word must mean writer.
打工/1 | 他是学生，晚上去饭店做工作 | He is a student who works at a restaurant in the evenings, so the word must mean to work part-time.
打字/1 | 说我很快做的一件事 | It is something the speaker does quickly, such as on a keyboard, so the word must mean to type.
大事/1 | 考大学是很重要的事 | Getting into university is a very important matter, so the word must mean important matter.
电影票/1 | 看电影以前要先买的票 | One buys it before seeing a film, so the word must mean film ticket.
好事/1 | 他考上了大学，是让人高兴的事 | Getting into university is cause for joy, so the word must mean good thing.
书店/1 | 去那里买了一本小说 | It is where a novel was bought, so the word must mean bookshop.
不好意思/1 | 我来晚了，向别人表示歉意 | The speaker apologizes for being late, so the word must mean sorry.
手/1 | 我们用它写字 | We write with it, so the word must mean hand.
脚/1 | 我们用它走路 | We walk on them, so the word must mean foot.
眼/1 | 我们用它看东西 | We see with them, so the word must mean eye.
头/1 | “点了点……”，说“好的”时的动作 | He nods it while saying "OK", so the word must mean head.
身体/1 | 爷爷很好，每天都走路 | Grandpa walks every day and is in good shape, so the word must mean health.
心里/1 | 在心中很想家人 | The speaker misses the family inside, so the word must mean in one's heart.
高/1 | 哥哥有一米八 | My brother is one metre eighty, so the word must mean tall.
长/1 | 要走一个小时的路 | The road takes an hour to walk, so the word must mean long.
个子/1 | 哥哥的身体有多高 | It is how tall my brother is, so the word must mean height.
左手/1 | 和后面的“不用右手”相对 | He does not use his right hand, so he writes with the other, and the word must mean left hand.
病/1 | 他今天没来上课，是因为身体不好 | He missed class today because he is unwell, so the word must mean ill.
生病/1 | 天冷了要多穿衣服，为的是身体不出问题 | One should wrap up in the cold so as not to get sick, so the word must mean to fall ill.
看病/1 | 去医院找医生 | The speaker goes to the hospital to be seen by a doctor, so the word must mean to see a doctor.
药/1 | 医生给病人的东西 | It is what a doctor gives a patient, so the word must mean medicine.
吃药/1 | 你病了，除了多喝水还要做的事 | You are ill and must do this besides drinking water, so the word must mean to take medicine.
病人/1 | 医院里很多身体有病的人 | There are many of them in a hospital, so the word must mean patient.
疼/1 | 头很不舒服 | Something is wrong with the head, so the word must mean to hurt.
头疼/1 | 想休息一下，是因为头不舒服 | The speaker wants to rest because their head is sore, so the word must mean headache.
累/1 | 工作了一天以后的感觉 | It is how one feels after a day's work, so the word must mean tired.
药店/1 | 去那里买药的地方 | It is where one buys medicine, so the word must mean pharmacy.
洗/1 | 吃饭前对手做的事 | It is what one does to the hands before eating, so the word must mean to wash.
洗手/1 | 吃饭前要先做的事 | It is what we must do before eating, so the word must mean to wash one's hands.
洗手间/1 | 我想洗手，问在哪里 | The speaker wants to wash their hands and asks where to go, so the word must mean toilet.
帮/1 | “……我一下”，请别人给我出力 | The speaker asks for a hand for a moment, so the word must mean to help.
帮忙/1 | 我很忙，请你来出力 | I am busy and ask you to come and lend a hand, so the word must mean to help out.
小心/1 | 路上车多，你要注意 | There are many cars on the road, so you must take care, and the word must mean careful.
关心/1 | 妈妈很在意我的身体 | Mother pays close attention to my health, so the word must mean to care about.
开心/1 | 今天是我的生日 | It is my birthday today, so the word must mean happy.
身上/1 | 我没有带着钱 | I have no money with me, so the word must mean on one's body.
手机/1 | 在书包里的、打电话用的东西 | It is something in my schoolbag for making calls, so the word must mean mobile phone.
因为/1 | 下雨是我们没去公园的原因 | The rain is why we did not go to the park, so the word must mean because.
所以/1 | 今天下雨，结果没去公园 | It rained today, and as a result we did not go to the park, so the word must mean so.
为什么/1 | 问你不来上课的原因 | The question asks the reason you did not come to class, so the word must mean why.
为了/1 | 学好汉语是他每天看中文书的目的 | Learning Chinese well is his aim in reading Chinese books daily, so the word must mean in order to.
认为/1 | 说我对他的话的看法 | The sentence gives my view that he is right, so the word must mean to believe.
以为/1 | 后面说“没想到是星期二”，想错了 | I did not expect it to be Tuesday, so my belief was wrong, and the word must mean to think wrongly.
最/1 | 我们班里比谁都高 | He is taller than anyone in the class, so the word must mean most.
最后/1 | 和“他第一个来”相对 | He came first and I came at the end, so the word must mean last.
最近/1 | 问你这些天忙不忙 | The question asks whether you have been busy these days, so the word must mean recently.
最好/1 | 你病了，在家休息是好的办法 | You are ill, so resting at home is the wise thing, and the word must mean had better.
长大/1 | 以后想做医生，说的是年纪大了以后 | The speaker wants to be a doctor later in life, so the word must mean to grow up.
身高/1 | 我有一米六 | I am one metre sixty, so the word must mean height.
右手/1 | 我用来写字的一只手 | It is the hand I write with, so the word must mean right hand.
中心/1 | 商店在北京的中间 | The shop is in the middle of Beijing, so the word must mean centre.
好心/1 | 大家都喜欢他，因为他心很好 | Everyone likes him because he is kind, so the word must mean kind-hearted.
用心/1 | 他学习很努力，考试考了第一 | He came first because of the care he takes in studying, so the word must mean attentive.
头上/1 | 雪在他的头上 | There is a little snow on his head, so the word must mean on the head.
热心/1 | 大家有事她都帮忙 | She helps whenever anyone needs it, so the word must mean warm-hearted.
高大/1 | 爸爸的个子 | It describes father's build, which is tall and broad, so the word must mean tall and big.
手上/1 | 他要先洗一下，因为手上都是水 | He has to wash because his hands are covered with water, so the word must mean in one's hands.
`);
