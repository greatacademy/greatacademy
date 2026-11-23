// The clues of the gap sentences of the level 2 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelTwoClues are the clues of the gap sentences of the level 2 words, by clueKey, each word's sentence counted as 1. */
export const levelTwoClues = parseClues(`
已经/1 | 早饭吃过了，所以不饿 | The speaker is not hungry because breakfast is over and done, so the word must mean already.
正在/1 | 现在妈妈做饭还没做完，句末有“呢” | Mother is busy cooking at this very moment, so the word must mean in the middle of doing.
才/1 | 等了一个小时以后他来，来得很晚 | He came only after an hour's wait, later than expected, so the word must mean not until.
又/1 | 昨天没来，今天也没来，事情再一次发生了 | He missed class yesterday and has missed it again today, so the word must mean again.
只/1 | 家里除了我没有别的孩子 | There is no child in the family but me, so the word must mean only.
更/1 | 明天比今天冷得多一些 | Tomorrow will be colder still than today, so the word must mean even more.
一直/1 | 雨从昨天晚上下到今天早上，没有停 | The rain fell from last night to this morning without stopping, so the word must mean continuously.
刚才/1 | 问不久以前你去了哪里 | The question asks where you were a moment ago, so the word must mean just now.
常常/1 | 一个星期去三次，去得很多 | The speaker goes there three times a week, so the word must mean often.
自己/1 | 不要别人帮忙，我一个人做 | The speaker wants no help from others, so the word must mean oneself.
刷牙/1 | 起床以后、吃早饭以前做的事 | It is done after getting up and before breakfast, so the word must mean to brush one's teeth.
洗脸/1 | 脸上有东西，要把它洗掉 | There is something on your face, so the word must mean to wash one's face.
洗澡/1 | 天太热，每天晚上把身上洗干净 | It is very hot, so one bathes every evening, and the word must mean to take a bath or shower.
起床/1 | 星期天可以在床上多睡一会儿，不用早从床上起来 | On Sunday one can stay in bed longer, so the word must mean to get up.
醒/1 | 睡得很好，一直睡着，到九点才不睡 | He slept well and did not stop sleeping until nine, so the word must mean to wake up.
上床/1 | 晚上十点，孩子们该去睡觉了 | It is ten at night and the children should get into bed to sleep, so the word must mean to go to bed.
拿/1 | 请人把书用手交到我这里 | The listener is asked to hand the book over, so the word must mean to take, to hold.
放/1 | 书包现在在床上，是我让它在那里的 | I left the schoolbag on the bed, so the word must mean to put.
忘/1 | 没给你打电话，是因为没带手机 | I could not call you because the phone was left behind, so the word must mean to forget.
记/1 | 老师说的话，写在本子上了 | The teacher's words were written down in the notebook, so the word must mean to note down.
准备/1 | 明天要考试，现在为考试做事 | There is an exam tomorrow, so the speaker is getting ready for it, and the word must mean to prepare.
完成/1 | 工作很难，三天才做完 | The hard work took three days to get done, so the word must mean to complete.
完/1 | “吃……饭”，吃好了再去找你 | I will come for you once I have finished eating, so the word must mean to finish.
告诉/1 | 请人把字的读音说给我知道 | The speaker asks to be told how to read the character, so the word must mean to tell.
成/1 | 她长大以后是一个老师了 | She grew up to be a teacher, so the word must mean to become.
非常/1 | 电影有意思得很，所以你可以去看 | The film is very interesting, worth going to see, so the word must mean extremely.
一定/1 | 明天的考试别忘了，你必须来 | You must not forget tomorrow's exam and have to come, so the word must mean surely, must.
当然/1 | 回答“你会来吗”，没有问题，会来 | The answer is that of course I will come, so the word must mean of course.
准时/1 | 八点上课，请大家按时间来 | Class starts at eight, so everyone should come at that time, and the word must mean on time.
正常/1 | 身体没有病，跟平常一样 | His body has no illness and is as it should be, so the word must mean normal.
但是/1 | 衣服很好看，后面说太贵，意思转了 | The clothes look good, yet they cost too much, so the word must mean but.
虽然/1 | 后面有“还是”，外面冷他也出去了 | It was cold out and he still went running, as 还是 shows, so the word must mean although.
如果/1 | 后面有“就”，说的是明天下雨这个假设 | The plan depends on whether it rains tomorrow, as 就 shows, so the word must mean if.
应该/1 | 你病了，去看医生是该做的事 | You are ill, so seeing a doctor is the right thing to do, and the word must mean should.
然后/1 | 前面有“先”，吃饭以后再看电影 | The sentence opens with 先 and the film follows the meal, so the word must mean afterwards.
刚刚/1 | 他出去还没多久，一会儿就回来 | He went out a moment ago and will soon be back, so the word must mean only a moment ago.
直到/1 | 后面有“才”，到晚上十点为止 | We stayed out right up to ten at night, as 才 shows, so the word must mean until.
不但/1 | 后面有“还”，会说汉语以外还会写汉字 | He can write characters on top of speaking Chinese, as 还 shows, so the word must mean not only.
当时/1 | 十岁来中国的那个时候 | It points back to the time I came to China at ten, so the word must mean at that time.
只要/1 | 后面有“就”，认真学习这个条件就够了 | Studying hard is enough to learn Chinese well, as 就 shows, so the word must mean as long as.
被/1 | 手机是弟弟拿走的，手机是受事的一方 | The phone was taken away by my brother, so the word must mark the passive.
把/1 | “……门关上”，把门放在动词前面 | The door is put before the verb 关上, so the word must put the object before the verb.
着/1 | 他坐着的样子一直没变，同时在看书 | He reads while staying seated, so the word must mark a lasting state.
记得/1 | 问你有没有忘了我，我们是小学同学 | The speaker asks whether you still recall them from primary school, so the word must mean to remember.
忘记/1 | 对不起，因为想不起你的名字了 | The speaker apologizes for not recalling your name, so the word must mean to forget.
日记/1 | 每天晚上写的、记自己一天的事 | It is written every night before bed, so the word must mean diary.
记住/1 | 明天要考试，问汉字记牢了没有 | There is an exam tomorrow, so the question is whether the characters are firmly learned, and the word must mean to remember firmly.
放心/1 | 我会认真工作，你不用担心 | I will work hard, so you need not worry, and the word must mean to feel at ease.
放学/1 | 下午四点，学校的课上完了 | School lets out at four in the afternoon, so the word must mean to let out, of school.
拿走/1 | 书是我的，别带离这里 | The book is mine, so you should not take it away, and the word must mean to take away.
正好/1 | 你来的时候我们正要吃饭 | You arrived just as we were about to eat, so the word must mean just right.
真正/1 | 有事他都会帮我，是好朋友 | He always helps when I need it, so he is a true friend, and the word must mean real, true.
常见/1 | 很多人都问过的问题 | Many people have asked this question, so the word must mean common.
经常/1 | 一年去十几次，去得很多 | He goes a dozen times a year, so the word must mean frequently.
经过/1 | 去学校的路上，从公园旁边走过 | The way to school goes past a park, so the word must mean to pass by.
成为/1 | 他长大以后想是一个好医生 | He hopes to grow into a good doctor, so the word must mean to become.
不如/1 | 后面说走路很快就到，坐车没有走路好 | Walking gets there quickly, so taking a bus is worse, and the word must mean not as good as.
早就/1 | 不用告诉我，我很早以前就知道了 | There is no need to tell me because I knew long ago, so the word must mean long ago.
自从/1 | 从他去北京那时起，一直没见面 | We have not met from the time he went to Beijing, so the word must mean since.
完了/1 | 电影结束了，可以回家 | The film is over and we can go home, so the word must mean finished.
只好/1 | 没有车了，没有别的办法，走路回家 | There is no bus, so walking home is the only way left, and the word must mean to have no choice but.
只有/1 | 后面有“才”，多说是唯一的条件 | Speaking a lot is the one condition for speaking well, as 才 shows, so the word must mean only if.
只是/1 | 不是不想去，原因不过是太忙 | It is not that I do not want to go; the only trouble is being busy, so the word must mean it's just that.
刚好/1 | 房间住四个人，我们正是四个人 | The room sleeps four and we number exactly four, so the word must mean exactly.
看起来/1 | 从样子上看，他很累 | From the look of him he is very tired, so the word must mean to look, to seem.
当地/1 | 去南方玩，吃了那个地方的菜 | On a trip to the south we ate the dishes of that place, so the word must mean local.
叫醒/1 | 早上六点请你让我不睡了 | The listener is asked to rouse me at six, so the word must mean to wake someone up.
睡着/1 | 太热了，很晚才进入睡眠 | It was too hot, so sleep came very late, and the word must mean to fall asleep.
牙医/1 | 牙疼了要去看的医生 | My tooth hurts, so I must see a doctor for teeth, and the word must mean dentist.
自然/1 | 说汉语别想太多，不要不自在 | One should speak Chinese without thinking too much, easily, so the word must mean natural.
正是/1 | 这本书就是我想买的那一本 | This is the very book I wanted to buy, so the word must mean precisely.
才能/1 | 十岁就会写小说，很有本事 | He wrote novels at ten, so he has great gifts, and the word must mean talent.
自来水/1 | 家里没有了它，就不能洗澡 | Without it at home we cannot bathe, so the word must mean tap water.
常用/1 | 一定要认识的、平时用得多的汉字 | They are characters used all the time that one must know, so the word must mean in common use.
告别/1 | 他要回国了，来跟老师说再见 | He is going home and comes to see his teacher before leaving, so the word must mean to say goodbye.
拿手/1 | 做鱼是妈妈做得最好的菜 | Fish is the dish mother cooks best, so the word must mean good at.
放大/1 | 字太小了，让它变大一点 | The characters are too small and should be made bigger, so the word must mean to enlarge.
当中/1 | 在我们班的同学里面 | Among my classmates his Chinese is best, so the word must mean among.
如今/1 | 和“以前”相对，现在已经说得很好 | He used to speak no Chinese and speaks it well these days, so the word must mean nowadays.
不然/1 | 快点走，要是不快走就要晚了 | We must hurry, or else we will be late, so the word must mean otherwise.
过去/1 | 和“现在有了”相对，以前的时候 | There is a subway now but there was none before, so the word must mean the past.
后来/1 | 先在北京工作，那以后去了南方 | He worked in Beijing first and went south after that, so the word must mean later.
以前/1 | “三年……”，三年前的时候 | It points to a time three years back, so the word must mean ago.
从来/1 | 后面说“这是第一次去”，以前一次也没去过 | This is his first trip, so he has never gone before, and the word must mean always, up to now.
往往/1 | 冬天的早上多半很冷 | Winter mornings are cold as a rule, so the word must mean usually.
每次/1 | 他来我家的时候都带水果 | He brings fruit whenever he comes, so the word must mean every time.
这次/1 | 和“上次考试”相对 | Last time went badly, and this exam went well, so the word must mean this time.
早晚/1 | 他总有一天会知道这件事 | He is bound to find out one day, so the word must mean sooner or later.
半天/1 | 我等了你很久，你才来 | I waited a long while before you came, so the word must mean a long while.
同时/1 | 一个也不早，一个也不晚，两个人一起到 | Neither was early nor late, so they arrived together, and the word must mean at the same time.
多么/1 | 句末是感叹号，感叹春天好 | The exclamation mark shows delight at the spring, so the word must mean how.
不过/1 | 菜很好吃，后面说有一点贵，意思转了 | The dish is tasty, yet a little dear, so the word must mean but, however.
不得不/1 | 下大雨，没有别的办法，只能在家 | Heavy rain forces us to stay in, so the word must mean to have to.
十分/1 | 听说你要来，我们都很想见你 | Hearing that you will come, we all very much want to see you, so the word must mean very.
所有/1 | 一个也不少，班里的学生都来了 | Not one student is missing, so the word must mean all.
左右/1 | 放在“三十个学生”后面，说的是大概的数 | It follows the number thirty to make it rough, so the word must mean about.
一半/1 | 钱太多，我只要二分之一 | The money is too much and the speaker wants only part of it, so the word must mean half.
有些/1 | 和后面的“有的不会”相对 | It is set against those who cannot speak, so the word must mean some.
有点/1 | 今天稍微冷，所以多穿一件 | It is a bit cold today, so one more layer will do, and the word must mean a little.
本来/1 | 后面说“后来没时间了”，原先的想法 | The plan was to see a film until time ran out, so the word must mean originally.
客厅/1 | 一家人一起看电视的房间 | It is the room where the family watches television together, so the word must mean living room.
厨房/1 | 妈妈做饭的房间 | It is the room where mother cooks, so the word must mean kitchen.
室友/1 | 和我住在一个房间里的人 | We live in the same room, so the word must mean roommate.
窗子/1 | 天太热，打开它让风进来 | It is too hot, so it should be opened to let air in, and the word must mean window.
电灯/1 | 天黑了，打开它就亮了 | It has grown dark and turning it on gives light, so the word must mean electric light.
桌子/1 | 书放在它上面 | The book lies on top of it, so the word must mean table.
椅子/1 | 累了要找来坐的，用“把”数 | One sits on it when tired and counts it with 把, so the word must mean chair.
楼层/1 | 一个楼有二十个 | A building has twenty of them, so the word must mean floor, storey.
层/1 | “住在三……”，楼的第几层 | The home is on the third of them, so the word must be the measure word for floors.
很久/1 | 我等了你很长时间 | I have been waiting for you a long time, so the word must mean a long time.
开灯/1 | 房间里太黑了，让灯亮起来 | The room is too dark, so we should switch on the light, and the word must mean to turn on the light.
关灯/1 | 睡觉以前要让灯不亮 | Before sleeping one must switch the light off, so the word must mean to turn off the light.
书桌/1 | 上面有很多书的桌子 | It is a table with many books on it, so the word must mean desk.
饭桌/1 | 一家人坐在前面吃晚饭的桌子 | The family sits at it for dinner, so the word must mean dining table.
不久/1 | 很快就要开学了 | School will start before long, so the word must mean soon.
多久/1 | 问学汉语学了多长时间 | The question asks how long you have studied Chinese, so the word must mean how long.
好久/1 | “……不见”，很长时间没见面 | It is the greeting for people who have not met for ages, so the word must mean a long time.
上楼/1 | 家在五层，走路到上边 | My home is on the fifth floor and I walk up to it, so the word must mean to go upstairs.
一层/1 | 和“饭店在二层”相对 | The restaurant is on the second floor and the shop is set below it, so the word must mean the ground floor.
厨师/1 | 饭店里做菜的人 | It is the person at the restaurant who cooks the dishes, so the word must mean cook.
搬家/1 | 新家在学校附近，要从旧家去新家 | We have a new home near the school and are moving there, so the word must mean to move house.
租/1 | 付钱住学校附近的一间房子 | The speaker pays to live in a room near the school, so the word must mean to rent.
房租/1 | 一个月要五千块，是住房的钱 | It costs five thousand a month to live there, so the word must mean rent.
出租车/1 | 下雨了，坐车去，这种车要给钱坐 | It is raining, so we ride in a hired car, and the word must mean taxi.
邻居/1 | 住在我家旁边、常常帮我的人 | He lives next to me and often helps me, so the word must mean neighbour.
附近/1 | 学校周围有很多饭店 | There are many restaurants close to the school, so the word must mean nearby.
安静/1 | 大家都睡了，楼里没有声音 | Everyone is asleep and there is no noise, so the word must mean quiet.
城市/1 | 北京是一个很大的地方，有很多人住 | Beijing is a very large one of them, so the word must mean city.
市中心/1 | 家在城市中间，去哪里都方便 | My home is in the middle of the city, handy for everywhere, so the word must mean city centre.
小区/1 | 我们住的地方，里边有小公园 | It is the place we live in that has a little park inside, so the word must mean housing estate.
街/1 | 上面有很多商店 | There are many shops along it, so the word must mean street.
安心/1 | 家里没事了，你可以不担心地工作 | All is well at home, so you can work without worry, and the word must mean with one's mind at ease.
城里/1 | 他从家坐车到城市里边去上学 | He rides from home into town to school, so the word must mean in town.
市场/1 | 常去那里买菜的地方 | It is where one often goes to buy vegetables, so the word must mean market.
地区/1 | 这一片地方冬天很冷 | This area is very cold in winter, so the word must mean region.
居住/1 | 很多外国人住在这里 | Many foreigners make their homes here, so the word must mean to reside.
搬走/1 | 邻居上个月离开这里，住到别的地方去了 | The neighbour left last month to live elsewhere, so the word must mean to move away.
租车/1 | 没有车，可以给钱用别人的车 | We have no car but can pay to use one, so the word must mean to rent a car.
市长/1 | 城市里最大的官，是一个女人 | It is the head of our city, so the word must mean mayor.
城外/1 | 和“不住在城里”相对 | Grandpa does not live in town but outside it, so the word must mean outside the city.
干净/1 | 房间里没有一点脏东西 | The room has not a speck of dirt, so the word must mean clean.
打扫/1 | 星期六一起把房间弄干净 | We will clean up the room together on Saturday, so the word must mean to sweep, to clean.
收拾/1 | 出门前把书包里的东西放好 | Before going out you must put your schoolbag in order, so the word must mean to tidy up.
换/1 | 衣服太小，拿它去要一件大的 | The clothes are too small and the speaker wants a bigger one instead, so the word must mean to exchange.
冰箱/1 | 牛奶放在它里面，冷着 | Milk is kept cold inside it, so the word must mean fridge.
空调/1 | 天太热，打开它让房间凉 | It is too hot, so we turn it on to cool the room, and the word must mean air conditioner.
有空/1 | 问今天有没有时间去看电影 | The question asks whether you are free to see a film, so the word must mean to have free time.
冰/1 | 天太冷，水都变成了它 | The weather froze the water into it, so the word must mean ice.
空气/1 | 下了雨，外面呼吸起来很好 | After the rain the outdoor air is fresh, so the word must mean air.
箱子/1 | 去国外时用来放衣服的大东西 | It is something big to pack clothes in for a trip abroad, so the word must mean suitcase.
洗衣机/1 | 衣服太多，放在它里边洗 | There are too many clothes, so they go into it for washing, and the word must mean washing machine.
扫地/1 | 吃完饭，我把地上弄干净，你收拾桌子 | After the meal I clean the floor while you clear the table, so the word must mean to sweep the floor.
干杯/1 | 大家一起把杯里的酒喝完 | Everyone drinks together to empty the glasses, so the word must mean cheers.
冰水/1 | 天太热，想喝很冷的水 | It is too hot and the speaker wants something icy to drink, so the word must mean ice water.
收到/1 | 你送的书已经到了我手里 | Your book has reached me and I say thanks, so the word must mean to receive.
换车/1 | 先坐地铁，然后改坐别的车 | One takes the subway first and then changes to another line, so the word must mean to change trains.
空手/1 | 后面说“要带一点东西”，不能什么也不带 | One should bring something, so one must not arrive with nothing, and the word must mean empty-handed.
冷静/1 | 考试的时候要慢慢想，不要急 | In an exam one should think slowly and stay calm, so the word must mean calm.
一干二净/1 | 饭菜吃得一点也不剩 | Not a bit of the meal was left, so the word must mean completely clean.
天空/1 | 晚上有很多星星的地方 | It is where many stars appear at night, so the word must mean sky.
搬进/1 | 上个月住进了新家 | We moved into our new home last month, so the word must mean to move in.
新居/1 | 他们新住的地方，有三个房间 | It is the new home they live in, with three rooms, so the word must mean new home.
租房/1 | 在北京给钱住别人的房子 | Paying to live in someone else's home in Beijing is costly, so the word must mean to rent a room.
灯/1 | 房间太黑，问让房间亮的东西在哪里 | The room is too dark, so the speaker asks where the thing that gives light is, and the word must mean lamp.
静/1 | 大家都走了，学校里没有声音 | Everyone has left, so the school is silent, and the word must mean quiet.
收下/1 | 这是我送你的东西，请你拿着不要推 | It is a present for you, so the speaker asks you to accept it, and the word must mean to accept.
空中/1 | 飞机飞的地方 | It is where the plane is flying, so the word must mean in the air.
窗外/1 | 从窗子往外看，下雪了 | Looking out of the window one sees snow falling, so the word must mean outside the window.
长城/1 | 到了北京一定要去看的地方 | It is the sight one must visit in Beijing, so the word must mean the Great Wall.
街上/1 | 下雨了，路上的人很少 | It is raining and few people are out in the street, so the word must mean in the street.
房东/1 | 人很好，收的房租不贵 | The rent this person charges is low, so the word must mean landlord.
晚安/1 | 要睡觉了，晚上说的话 | It is what one says before going to sleep, so the word must mean good night.
早安/1 | 问昨天晚上睡得好吗，早上说的话 | The speaker asks how you slept last night, so it is the morning greeting, and the word must mean good morning.
请客/1 | 今天我付钱，问你们想吃什么 | I am paying today and ask what you would like to eat, so the word must mean to treat.
做客/1 | 星期天去朋友家，是去当客人 | On Sunday I go to a friend's home as a guest, so the word must mean to be a guest.
见面/1 | 约好明天三点在学校门前 | We arrange to meet at three tomorrow at the school gate, so the word must mean to meet.
钱包/1 | 里面没有钱了，是放钱的东西 | It is what holds money, and it is empty now, so the word must mean wallet.
点头/1 | 我问他去不去，他头往下动，说去 | He answered yes to my question with a movement of his head, so the word must mean to nod.
回头/1 | 我在后边叫他，他转过头来看 | I called from behind and he turned his head to look, so the word must mean to turn one's head.
比如/1 | 后面举出鱼和鸡肉两个例子 | Fish and chicken follow as examples, so the word must mean for example.
颜色/1 | 问最喜欢的是红、白、黑哪一种 | The question asks which colour you like best, so the word must mean colour.
红色/1 | 过年的时候中国人喜欢穿的颜色 | It is the colour Chinese people like to wear at New Year, so the word must mean red.
白色/1 | 下了大雪，地上的颜色 | After heavy snow the ground is this colour, so the word must mean white.
黑色/1 | 晚上很难看见，衣服的颜色很深 | He is hard to see at night in it, so the word must mean black.
蓝色/1 | 晴天时天的颜色 | It is the colour of the sky on a clear day, so the word must mean blue.
绿色/1 | 这个灯亮了，就可以走了 | When this light is on we may go, so the word must mean green.
黄色/1 | 这个灯亮了，车要慢下来 | When this light is on cars must slow down, so the word must mean yellow.
黑白/1 | 和后面的“有很多颜色”相对 | Today's televisions have many colours and the old ones had only two, so the word must mean black and white.
美/1 | 说这里的春天好看 | It describes how lovely the spring is here, so the word must mean beautiful.
天蓝/1 | 跟晴天的天空一样的颜色 | It is the colour of a clear sky, so the word must mean sky blue.
裤子/1 | 用“条”数的、穿在腿上的衣服 | It is counted with 条 and worn on the legs, so the word must mean trousers.
裙子/1 | 夏天她买的一条红色的衣服 | She bought a red one for summer, counted with 条, so the word must mean skirt.
鞋/1 | 用“双”数，太小了脚会疼 | It is counted with 双 and too small for my feet, so the word must mean shoes.
帽子/1 | 外面冷，戴在头上的东西 | It is cold out, so one puts it on one's head, and the word must mean hat.
戴/1 | 出门时把帽子放在头上 | One puts a hat on one's head before going out, so the word must mean to wear, of hats.
短裤/1 | 天太热，打球时穿的短的裤子 | It is too hot, so the speaker wears it to play ball, and the word must mean shorts.
双/1 | “一……新鞋”，鞋是两只一起数的 | Shoes come in pairs, so the word must be their measure word, pair.
条/1 | “一……新裙子”，裙子的量词 | Skirts are being counted, so the word must be their measure word.
张/1 | “这……桌子”，桌子的量词 | Tables are being counted, so the word must be their measure word.
旧/1 | 鞋穿了五年，不新了 | The shoes have been worn for five years, so the word must mean old.
漂亮/1 | 夸新衣服好看 | The speaker is praising how the new clothes look, so the word must mean pretty.
合适/1 | 鞋不大也不小，正好 | The shoes are neither big nor small, so they fit, and the word must mean suitable.
亮/1 | 说房间的灯光很强 | It describes how much light the lamp gives, so the word must mean bright.
适合/1 | 衣服跟你很配，你穿上好看 | The clothes suit you and look good on you, so the word must mean to suit.
长短/1 | 裤子不长也不短，正好 | The trousers are just the right length, so the word must mean length.
美好/1 | 大学时是我最好、最快乐的时间 | University was the happiest time of my life, so the word must mean happy, fine.
美国/1 | 他是外国人，是那个国家的人 | He is from a certain foreign country and studies Chinese in China, so the word must name a country, America.
美元/1 | 衣服一百……，是一种外国的钱 | The price is given in a foreign currency, so the word must mean US dollar.
双手/1 | 用两只手拿着大箱子 | The big suitcase needs both his hands, so the word must mean both hands.
张开/1 | 让我看看手里有什么，要把手打开 | To show what is in the hand one must open it, so the word must mean to open, to spread.
试穿/1 | 买衣服以前问能不能穿一下看看 | The speaker asks to try the clothes on before buying, so the word must mean to try on.
大号/1 | 衣服太小了，要大一点的 | The clothes are too small, so a bigger size is wanted, and the word must mean large size.
小号/1 | 衣服太大了，要小一点的 | The clothes are too big, so a smaller size is wanted, and the word must mean small size.
戴上/1 | 外面很冷，把帽子放到头上 | It is cold, so the hat should go on, and the word must mean to put on, of a hat.
鞋店/1 | 想买新鞋，去卖鞋的商店 | The speaker wants new shoes, so we go to a shop that sells them, and the word must mean shoe shop.
合身/1 | 衣服不大也不小，穿着正好 | The clothes are neither big nor small, so they fit the body, and the word must mean well-fitting.
双方/1 | 这件事要问两边的人的意见 | Both sides' views are needed, so the word must mean both sides.
旧书/1 | 只要五块钱，是别人用过的书 | It is a used book that costs only five yuan, so the word must mean second-hand book.
条件/1 | 有很多书，学习的情况很好 | There are many books, so the study conditions are good, and the word must mean conditions.
换上/1 | 下班回家，穿起旧衣服代替上班的衣服 | Home from work, he put on old clothes in place of his work clothes, so the word must mean to change into.
蓝天/1 | 天气真好，天空是蓝色的 | The weather is fine and the sky is blue, so the word must mean blue sky.
红绿灯/1 | 路口用红灯、绿灯管车的东西 | It is where we turn right at the junction, the thing with red and green lights, so the word must mean traffic lights.
明亮/1 | 房间有大窗子，光很多 | The room has big windows and plenty of light, so the word must mean bright.
天亮/1 | 他一直睡，到早上天变亮了才醒 | He slept until the sky grew light, so the word must mean daybreak.
双人床/1 | 一张能睡两个人的床 | The bed can sleep two people, so the word must mean double bed.
合作/1 | 我们两个人一起工作得很好 | The two of us work together well, so the word must mean to cooperate.
短期/1 | 只学三个月，时间不长 | The speaker studies for just three months, so the word must mean short-term.
合上/1 | 要考试了，把书关起来 | An exam is starting, so books must be shut, and the word must mean to close.
适用/1 | 大学生和中学生都能用 | Both university and middle school students can use it, so the word must mean suitable for use.
长裙/1 | 她穿的一条白色的、长的裙子 | She wears a long white one counted with 条, so the word must mean long skirt.
饭馆/1 | “这家……”，菜很好吃的地方 | It is a place counted with 家 whose food is tasty, so the word must mean restaurant.
服务员/1 | 在饭店里请他给我们一杯水 | In a restaurant one asks this person for a glass of water, so the word must mean waiter.
菜单/1 | 想点菜，先要看的东西 | One looks at it before ordering, so the word must mean menu.
点菜/1 | 问想吃什么，可以说要什么菜了 | We are asked what we want to eat, so it is time to order, and the word must mean to order dishes.
买单/1 | 吃好了，叫服务员来付钱 | We have finished eating and call the waiter to pay, so the word must mean the bill, please.
碗/1 | “两……米饭”，装米饭的东西 | Rice is counted here by the bowl, so the word must mean bowl.
筷子/1 | 中国人吃饭用的东西 | It is what Chinese people eat with, so the word must mean chopsticks.
盘子/1 | 桌上放着鱼的平的东西 | It is the flat dish on the table holding the fish, so the word must mean plate.
瓶/1 | “一……水”，买水用的量词 | Water is bought by the bottle, so the word must mean bottle.
汤/1 | “一碗热……”，喝的、热的菜 | It is something hot served in a bowl to drink, so the word must mean soup.
甜/1 | 我喜欢吃糖，因为糖的味道 | I like sweets because of how sugar tastes, so the word must mean sweet.
辣/1 | 吃了要喝很多水的菜 | After eating it one needs a lot of water, so the word must mean spicy.
酸奶/1 | 早上喝的一杯牛奶做的东西 | It is a milk drink I like in the morning, so the word must mean yogurt.
苦/1 | 药的味道不好，我不想吃 | The medicine tastes bad and I do not want it, so the word must mean bitter.
香/1 | 没进门就知道是什么菜，是闻到的 | I can tell the dish before stepping inside, so the word must mean fragrant.
渴/1 | 想喝一杯水 | The speaker wants a glass of water, so the word must mean thirsty.
饱/1 | 吃了很多，不想再吃 | The speaker does not want to eat more, so the word must mean full.
饺子/1 | 过年时北方人喜欢吃的东西 | It is what northerners like to eat at New Year, so the word must mean dumplings.
啤酒/1 | 爸爸不喝白酒，只喝另一种酒 | Father does not drink spirits, only another kind of alcohol, so the word must mean beer.
咖啡/1 | 不喝它上班就想睡觉 | Without it the speaker gets sleepy at work, so the word must mean coffee.
苹果/1 | 每天吃一个的水果 | It is a fruit eaten one a day, so the word must mean apple.
西瓜/1 | 夏天很热时吃的大水果 | It is a big fruit eaten when summer is hot, so the word must mean watermelon.
新鲜/1 | 鱼是今天早上买的 | The fish was bought this morning, so the word must mean fresh.
羊肉/1 | 冬天冷时北方人喜欢吃的肉 | It is the meat northerners like when winter is cold, so the word must mean mutton.
猪肉/1 | 做饺子常用的肉 | It is the meat most often used in dumplings, so the word must mean pork.
刀/1 | “这把……很快”，要小心 | It is counted with 把 and its sharpness calls for care, so the word must mean knife.
够/1 | 只有两个人，三个菜不少了 | There are only two of us, so three dishes are plenty, and the word must mean enough.
饮料/1 | 问想喝什么 | The question asks what you would like to drink, so the word must mean drink.
黄瓜/1 | 绿色的、新鲜的菜 | It is a fresh green vegetable, so the word must mean cucumber.
能够/1 | 已经会说很多汉语了 | He is now able to say a lot in Chinese, so the word must mean to be able to.
糖/1 | 咖啡里放的、甜的东西 | It is something sweet put into coffee, so the word must mean sugar.
甜点/1 | 吃完饭再来的、甜的东西 | It is something sweet to have after the meal, so the word must mean dessert.
洗碗/1 | 妈妈做饭，我做吃完饭后的事 | Mother cooks and I do the dishes, so the word must mean to wash the dishes.
鸡汤/1 | 一碗里面有很多鸡肉的汤 | It is a bowl of soup full of chicken, so the word must mean chicken soup.
酸甜/1 | 说这个菜的味道，又酸又甜 | It describes how the dish tastes, both sour and sweet, so the word must mean sweet and sour.
香菜/1 | 不要放在汤里、我不喜欢的菜 | It is a herb I do not want in my soup, so the word must mean coriander.
吃饱/1 | 问还要不要米饭，是看你吃够了没有 | The question about more rice checks whether you have had enough, so the word must mean to eat one's fill.
菜刀/1 | 做饭用的刀，要小心手 | It is the knife for cooking, so the word must mean kitchen knife.
小吃/1 | 北京很多好吃的、小份的东西 | Beijing has many tasty snacks, so the word must mean snack.
香水/1 | 出门前在身上用一点，闻起来香 | She puts a little on before going out, so the word must mean perfume.
咖啡馆/1 | 去那里喝一杯咖啡 | It is where we go for a cup of coffee, so the word must mean café.
茶馆/1 | 爷爷下午去那里喝茶 | Grandpa goes there each afternoon to drink tea, so the word must mean teahouse.
服务/1 | 菜很好吃，饭店给客人做的事也很好 | The food is good and the way staff look after diners is good too, so the word must mean service.
员工/1 | 商店里工作的二十个人 | The shop has twenty people working in it, so the word must mean staff.
单人/1 | 我一个人住，要一个人的房间 | The speaker lives alone and wants a room for one, so the word must mean single.
苦瓜/1 | 孩子不喜欢吃，因为太苦 | Children dislike it because it is too bitter, so the word must mean bitter melon.
糖果/1 | 孩子们都喜欢吃的甜东西 | Children all love these sweet things, so the word must mean sweets, candy.
瓶子/1 | 里面没有水了的东西 | It is something that has run out of water inside, so the word must mean bottle.
汤面/1 | 天冷了想吃一碗热的、有汤的面 | It is cold and the speaker wants a hot bowl of noodles in broth, so the word must mean noodle soup.
鲜鱼/1 | 今天早上才买的鱼 | The fish was bought only this morning, so the word must mean fresh fish.
名单/1 | 上面写着很多人的名字 | My name should be on it, a list of names, so the word must mean name list.
吃苦/1 | 工作再累也不说 | He never complains however hard the work, so the word must mean to bear hardship.
香甜/1 | 夸西瓜又香又甜 | The speaker praises the watermelon's taste, so the word must mean fragrant and sweet.
茶杯/1 | 茶放在它里面 | It is what tea is poured into, so the word must mean teacup.
早点/1 | 早上在路上买来吃的东西 | It is something bought on the way in the morning to eat, so the word must mean breakfast.
点心/1 | 下午喝茶时吃的东西 | It is something eaten with afternoon tea, so the word must mean pastry, snack.
菜市场/1 | 妈妈早上去买菜的地方 | It is where mother goes each morning for vegetables, so the word must mean food market.
南瓜/1 | 黄色的、很大的菜 | It is a big yellow vegetable, so the word must mean pumpkin.
店员/1 | 在商店里问衣服多少钱的人 | It is the person in a shop one asks about prices, so the word must mean shop assistant.
酸/1 | 苹果还没长好，吃起来的味道 | An unripe apple tastes like this, so the word must mean sour.
公司/1 | 爸爸工作的地方，用“家”数 | It is a place of work counted with 家, so the word must mean company.
经理/1 | 公司里管大家、常常请大家吃饭的人 | It is the person in charge at our company, so the word must mean manager.
办公室/1 | 在三层的、工作的房间 | It is a big room on the third floor where we work, so the word must mean office.
会议/1 | 公司明天上午大家都要来的事 | Everyone at the company must come to it tomorrow morning, so the word must mean meeting.
职业/1 | 回答是“我是老师” | The answer is "I am a teacher", so the question must ask for a job, and the word must mean occupation.
加班/1 | 工作太多，每天下班后还要工作 | There is so much work that the speaker stays on every day, so the word must mean to work overtime.
介绍/1 | 告诉大家“这是我的朋友小张” | The speaker presents a friend to others, so the word must mean to introduce.
欢迎/1 | 很高兴你来我们家 | The speaker is glad you have come to the house, so the word must mean welcome.
办/1 | 这件事很难做好 | The matter is hard to handle, so the word must mean to handle, to do.
同事/1 | 我们在一个公司工作 | We work at the same company, so the word must mean colleague.
电脑/1 | 我每天用来工作的机器 | It is the machine I use for work every day, so the word must mean computer.
上网/1 | 每天晚上在网上看电影 | Every evening the speaker goes online to watch films, so the word must mean to go online.
网上/1 | 书是在互联网上买的 | The book was bought on the internet, so the word must mean online.
接/1 | 去机场等朋友，带他回来 | I go to the airport to meet my friend, so the word must mean to pick up.
发/1 | “……短信”，给你送出短信 | A text message is to be sent to you, so the word must mean to send.
短信/1 | “发了一个……”，用手机发的东西 | It was sent and counted with 个, so the word must mean text message.
信/1 | 每个月写给爷爷的东西 | It is what I write to grandpa every month, so the word must mean letter.
纸/1 | “一张……”，写字用的东西 | It is counted with 张 and is for writing on, so the word must mean paper.
笔/1 | 没带它，想借来写字 | The speaker forgot it and wants to borrow one to write with, so the word must mean pen.
页/1 | 打开书，看第十…… | The book is opened at a numbered one of them, so the word must mean page.
生词/1 | 一课里有二十个，要记住 | A lesson has twenty of them to learn by heart, so the word must mean new word.
错/1 | 后面说他不是哥哥是弟弟，说得不对 | He is my younger brother, not my older one, so what was said was wrong, and the word must mean wrong.
不错/1 | 夸你的汉语说得好 | The speaker is praising your Chinese, so the word must mean not bad, good.
没错/1 | 回答“你是张老师吗”，说对了，我就是 | The answer confirms "I am", so the word must mean that's right.
错过/1 | 要快点走，不然火车就开走了，赶不上 | We must hurry or we will not catch the train, so the word must mean to miss.
接着/1 | 吃完饭以后马上去上班 | He went to work straight after the meal, so the word must mean next, then.
发现/1 | 回到家才知道手机不在包里 | Only at home did I notice the phone was not in the bag, so the word must mean to discover.
发生/1 | 问这里有了什么事，为什么人这么多 | The speaker asks what has happened here, so the word must mean to happen.
信心/1 | 对明天的考试觉得自己能考好 | The speaker believes the exam will go well, so the word must mean confidence.
回信/1 | 他写了信给我，我还没写信给他 | He wrote to me and I have not written back, so the word must mean to reply to a letter.
点钟/1 | “下午三……”，说的是几点 | It follows an hour of the day, so the word must mean o'clock.
分钟/1 | 走路要十……，比小时短的时间 | The walk takes ten of them, so the word must mean minute.
一刻/1 | 八点十五分，还有一个小时上课 | It is a quarter past eight, so the word must mean a quarter of an hour.
迟到/1 | 起晚了，上课没有准时到 | He got up late and reached class late, so the word must mean to be late.
差/1 | 再过五分钟就八点了 | Eight o'clock is five minutes away, so the word must mean short of, to.
讲/1 | 老师给我们说明这个字的意思 | The teacher explained to us what the character means, so the word must mean to explain.
懂/1 | 问题太难了，我不明白 | The question is too hard for me to grasp, so the word must mean to understand.
帮助/1 | 谢谢你，没有你我做不完 | The speaker thanks you because without you the job would not be done, so the word must mean help.
努力/1 | 每天学到很晚 | He studies late into the night every day, so the word must mean hardworking.
留/1 | 星期天不回家，还在学校 | The speaker does not go home on Sunday but remains at school, so the word must mean to stay.
力气/1 | 一个人就能搬大箱子 | He can move the big case alone, so the word must mean physical strength.
能力/1 | 工作做得好，经理喜欢他 | He works well and the manager likes him, so the word must mean ability.
听懂/1 | 老师说得太快，我耳朵听了没明白 | The teacher spoke too fast for me to follow, so the word must mean to understand by listening.
看懂/1 | 书太难了，看了很多次也没明白 | The book is too hard to follow even after many readings, so the word must mean to understand by reading.
留学/1 | 去中国学习汉语 | He wants to go to China to study, so the word must mean to study abroad.
讲话/1 | 开学时校长给大家说的话 | The head speaks to everyone at the start of term, so the word must mean to give a talk.
差不多/1 | 我们两个人的个子几乎一样 | The two of us are about the same height, so the word must mean about the same.
助手/1 | 帮经理做很多事的人 | He helps the manager with many things, so the word must mean assistant.
理想/1 | 他想成为一个医生 | Becoming a doctor is what he hopes for in life, so the word must mean ideal, dream.
道理/1 | 你说的话对，我同意 | What you say is right and I agree, so the word must mean reason, sense.
网友/1 | 我们还没见过面，在网上认识的 | We have never met, so we must know each other online, and the word must mean online friend.
网球/1 | 星期六去打的球 | It is a ball game we will play on Saturday, so the word must mean tennis.
头发/1 | 很长的、黑色的，长在头上 | It is long and black, so the word must mean hair.
出发/1 | 七点从学校走，九点到机场 | We leave the school at seven, so the word must mean to set off.
直接/1 | 不去别的地方，下了班就回家 | The speaker goes nowhere else but straight home, so the word must mean directly.
笔记/1 | 上课的时候写下的东西 | It is what he wrote down in class, so the word must mean notes.
词语/1 | 这一课的，要会读 | They are the ones in this lesson to be read aloud, so the word must mean words.
理发/1 | 头发太长了，该去剪短 | Your hair is too long, so it is time for a cut, and the word must mean to have a haircut.
作业/1 | 太多了，写到十点才写完 | There was so much of it to write that it took till ten, so the word must mean homework.
职员/1 | 在这家公司工作三年了 | He has worked at the company for three years, so the word must mean employee.
更加/1 | 下了雨，天气比以前还冷 | After the rain it is colder than before, so the word must mean even more.
加上/1 | 二十个学生和老师算在一起有二十一个人 | Twenty students together with the teacher make twenty-one, so the word must mean plus.
办事/1 | 他做事很认真，大家都放心 | He handles his work carefully and everyone trusts him, so the word must mean to handle affairs.
商业/1 | 有很多商店的城市中心 | It is the part of the city full of shops, so the word must mean commerce.
迎接/1 | 去机场接新来的同学 | We go to the airport to greet the new classmates, so the word must mean to welcome.
接到/1 | 刚才收到了妈妈打来的电话 | A call from mother came through a moment ago, so the word must mean to receive.
钟头/1 | 每天学汉语两个…… | The speaker studies Chinese for two of them a day, so the word must mean hour.
留下/1 | 他走的时候把一本书放在这里没拿走 | When he left he left a book behind, so the word must mean to leave behind.
讲课/1 | 老师上课讲得很好，学生喜欢听 | The teacher's lessons are excellent and the students love them, so the word must mean to teach a class.
错字/1 | 作文里有三个写得不对的字 | The composition has three wrongly written characters, so the word must mean wrong character.
笔记本/1 | 新买的、上课时用来写字的本子 | It is a new book for writing in class, so the word must mean notebook.
司机/1 | 开出租车送客人的人 | He drives a taxi for passengers, so the word must mean driver.
校长/1 | 学校里最大的领导，大家都认识他 | It is the head of our school, so the word must mean headmaster.
生意/1 | 爸爸有一家商店，是买卖东西的 | His father has a shop and buys and sells, so the word must mean business.
机会/1 | 好的、一定不要错过的时候 | It is a chance not to miss, so the word must mean opportunity.
出现/1 | 外面来了一个不认识的人 | A stranger appeared outside, so the word must mean to appear.
电子/1 | 和“纸的书”相对，在电脑上看的书 | It is set against paper books, so the word must mean electronic.
来自/1 | 学生是从十几个国家来的 | The students come from a dozen countries, so the word must mean to come from.
中间/1 | 我坐在爸爸和妈妈两人当中 | I sit between father and mother, so the word must mean middle.
知识/1 | 读书能让我们学到的东西 | Reading lets us learn a great deal of it, so the word must mean knowledge.
鼻子/1 | 脸上，眼睛和嘴以外的一个 | It is the one on the face besides eyes and mouth, so the word must mean nose.
嘴/1 | 吃饭时不要张着它说话 | One should not talk with it open while eating, so the word must mean mouth.
腿/1 | 走了一天的路，累的地方 | After a day's walking it is tired, so the word must mean leg.
肚子/1 | 吃得太多，不舒服的地方 | It hurts after eating too much, so the word must mean belly.
眼睛/1 | 又大又漂亮，脸上用来看的地方 | Hers are big and pretty, so the word must mean eyes.
门口/1 | 学校门前等你的地方 | It is where I will wait for you at the school entrance, so the word must mean doorway.
牙/1 | 吃东西的时候更疼 | It hurts more when chewing, so the word must mean tooth.
脸/1 | 不好意思的时候红了的地方 | It turned red with embarrassment, so the word must mean face.
人口/1 | 中国的人数很多 | China has very many people, so the word must mean population.
口语/1 | 和“写汉字”相对，说的语言 | It is set against writing characters, so the word must mean spoken language.
发烧/1 | 身体很热，可能病了 | His body is very hot, so he may be ill, and the word must mean to have a fever.
感冒/1 | 天冷要多穿衣服，为了别得这种病 | One should wrap up in the cold so as not to catch it, so the word must mean to catch a cold.
舒服/1 | 床很好，睡得很好 | The bed is good and I slept well, so the word must mean comfortable.
健康/1 | 爷爷八十岁了，身体还很好 | Grandpa is eighty and still well, so the word must mean healthy.
肚子疼/1 | 吃了不新鲜的鱼，肚子不舒服 | After eating stale fish the speaker's stomach aches, so the word must mean stomach ache.
感觉/1 | 问你今天身体怎么样 | The question asks how you feel today, so the word must mean to feel.
检查/1 | 医生看了我的身体，说没有病 | The doctor examined me and found nothing wrong, so the word must mean to examine.
感到/1 | 工作了一天，觉得很累 | After a day's work he feels very tired, so the word must mean to feel.
高烧/1 | 他发了很高的烧，要快去医院 | His fever is so high that he must hurry to hospital, so the word must mean high fever.
爱护/1 | 不要看太久电视，要保护眼睛 | We should guard our eyes by not watching too long, so the word must mean to take good care of.
胖/1 | 每天吃很多肉，比以前大了 | He eats a lot of meat every day and has put on weight, so the word must mean fat.
瘦/1 | 生病以后吃得很少 | She has eaten very little since falling ill, so the word must mean thin.
重/1 | 箱子一个人拿不了 | One person cannot carry the case, so the word must mean heavy.
轻/1 | 包小孩子也能拿 | Even a small child can carry the bag, so the word must mean light.
低/1 | 桌子不高，他坐着不舒服 | He is tall and the table makes him uncomfortable, so the word must mean low.
重要/1 | 健康比什么都要紧 | Health matters more than anything, so the word must mean important.
年轻/1 | 他才二十岁 | He is only twenty, so the word must mean young.
体重/1 | 他太胖了，身体有多重 | He is too fat, so it is how heavy he is that is too high, and the word must mean weight.
高低/1 | 两张桌子一个高一个低 | The two tables differ in how tall they are, so the word must mean height.
重新/1 | 字写错了，再写一次 | The character is wrong, so it must be written again, and the word must mean anew.
查/1 | 不认识这个字，要找一下它的意思 | The speaker does not know the character and must look it up, so the word must mean to look up.
体检/1 | 学校每年给学生检查身体 | The school checks every student's health once a year, so the word must mean physical examination.
健身/1 | 下班以后去锻炼身体 | He goes to work out after work every day, so the word must mean to keep fit.
感谢/1 | 因为你的帮助，非常谢谢你 | The speaker is grateful for your help, so the word must mean to thank.
重病/1 | 爷爷得了很重的病，在医院住了很久 | Grandpa stayed in hospital a long time with it, so the word must mean serious illness.
低头/1 | 不好意思，头往下，不说话 | He is embarrassed and looks down in silence, so the word must mean to lower one's head.
张嘴/1 | 医生要看牙，请你把嘴打开 | The doctor wants to see your teeth, so you must open your mouth, and the word must mean to open one's mouth.
大腿/1 | 打了一天球，腿上很疼的地方 | After a day of ball games this part of the leg hurts, so the word must mean thigh.
胖子/1 | 以前很胖的人，现在瘦了 | He has lost a lot of weight and used to be fat, so the word must mean fat person.
开口/1 | 想说什么，但是不好意思说出来 | He wants to say something but is too shy to speak, so the word must mean to open one's mouth, to speak.
一口/1 | 菜太辣，只吃了很少一点 | The dish was too hot, so the speaker took only a mouthful, and the word must mean one mouthful.
出口/1 | 问地铁站里出去的地方在哪里 | The speaker asks where to leave the subway station, so the word must mean exit.
路口/1 | 到了前面路相交的地方往左走 | One turns left at the next place where roads meet, so the word must mean crossing.
查看/1 | 出门前又看了一下门关好没有 | He checked again that the door was shut before going out, so the word must mean to check.
轻轻/1 | 孩子睡着了，走进去不要有声音 | The child is asleep, so one should walk in softly, and the word must mean gently.
发冷/1 | 可能感冒了，身上觉得冷 | The speaker feels chilly and may have a cold, so the word must mean to feel cold.
舒心/1 | 新工作同事很好，心里很舒服 | The new job has kind colleagues and feels good, so the word must mean pleasant.
口头/1 | 这次考试不用写，用嘴说 | This test needs no writing, so it is spoken, and the word must mean oral.
重点/1 | 这一课最重要的是这十个生词 | These ten words are what matters most in the lesson, so the word must mean key point.
感冒药/1 | 感冒了要吃的药 | The speaker has a cold and must take medicine for it, so the word must mean cold medicine.
旅游/1 | 放假的时候去北京玩 | In the holidays we will go to Beijing to see the sights, so the word must mean to tour.
旅行/1 | 一个人开车走了很多地方 | He drove alone and went to many places, so the word must mean to travel.
宾馆/1 | 到了北京先去放行李的地方 | It is where we drop our luggage on reaching Beijing, so the word must mean hotel.
照片/1 | 我小时候拍下来的 | It shows me as a child, so the word must mean photo.
照相/1 | 风景很美，在这里拍照 | The view is lovely, so we take pictures here, and the word must mean to take a photo.
相机/1 | 新买的，照片很清楚 | It is new and its photos are sharp, so the word must mean camera.
行李/1 | 太多了，我帮你拿 | You have too much of it and I will help carry it, so the word must mean luggage.
地图/1 | 不认识路，要看的东西 | The speaker does not know the way and must look at it, so the word must mean map.
订/1 | 飞机票已经提前买好了 | The plane ticket is already booked, so the word must mean to book.
护照/1 | 出国坐飞机，没有它就不能上飞机 | Without it one cannot board a plane abroad, so the word must mean passport.
风景/1 | 很美，很多人来这里照相 | It is lovely and many people take photos of it, so the word must mean scenery.
离/1 | 我家到学校的距离很近 | My home is close to the school, so the word must mean from, of distance.
骑/1 | 每天坐在自行车上去上学 | I ride a bicycle to school every day, so the word must mean to ride.
自行车/1 | 红色的、骑起来很快的车 | It is red and fast to ride, so the word must mean bicycle.
辆/1 | “一……出租车”，车的量词 | Cars are being counted, so the word must be their measure word.
停/1 | 雨不下了，可以出去 | The rain has stopped and we can go out, so the word must mean to stop.
停车/1 | 这里不能把车放着，请开走 | A car may not be left here and must be driven off, so the word must mean to park.
线/1 | 地铁一号…… | It is the number of a subway route, so the word must mean line.
拍照/1 | 不能用相机，请放下相机 | The camera must be put away here, so the word must mean to take pictures.
遍/1 | 这本书从头到尾看了三次 | I have read the book through three times, so the word must mean time, from start to finish.
全部/1 | 钱一点也没有剩下 | All of my money is spent, so the word must mean all.
到处/1 | 过年的时候，哪里都是人 | At New Year there are people everywhere, so the word must mean everywhere.
遇到/1 | 在路上碰见了老师 | I ran into my teacher on the way, so the word must mean to meet by chance.
放假/1 | 学校下个星期不上课，我要回家 | School breaks up next week and I am going home, so the word must mean to have a holiday.
假期/1 | 不上课的时候，问想去哪里玩 | The question asks where you want to go in the holidays, so the word must mean vacation.
世界/1 | 所有的国家都在里面 | It holds every country, so the word must mean world.
计划/1 | 问明年想做什么 | The question asks what you plan for next year, so the word must mean plan.
清楚/1 | 老师讲得好，我都听懂了 | The teacher explained so well that I understood all of it, so the word must mean clear.
完全/1 | 你说得一点也没错 | What you say is right in every way, so the word must mean completely.
安全/1 | 晚上一个人走路有危险，所以送你回家 | Walking alone at night is risky, so the word must mean safe.
离开/1 | 十八岁走出家门，去北京上大学 | At eighteen he left home for university in Beijing, so the word must mean to leave.
乘客/1 | 车上坐着的二十个人 | There are twenty people riding the bus, so the word must mean passenger.
全国/1 | 新年时整个国家的人都放假 | At New Year people across the whole country have a holiday, so the word must mean the whole country.
部分/1 | 问题的第一段很难 | The first section of the problem is hard, so the word must mean part.
好处/1 | 多走路对身体有益 | Walking a lot does the body good, so the word must mean benefit.
请假/1 | 我病了，要跟老师说不能来 | I am ill and must ask the teacher for time off, so the word must mean to ask for leave.
游客/1 | 夏天来长城玩的人 | They come to see the Great Wall in summer, so the word must mean tourist.
行/1 | 回答“好吗”，没问题 | The answer to "OK?" is yes, no problem, so the word must mean all right.
图片/1 | 书里很多孩子们喜欢看的画 | The book is full of them and children love them, so the word must mean picture.
订票/1 | 过年回家的人多，要早一点买票 | Many people travel home at New Year, so one must book early, and the word must mean to book tickets.
划船/1 | 夏天在公园的水上玩 | In summer we go out on the water in the park, so the word must mean to row a boat.
遇见/1 | 在商店里碰见了老同学 | I bumped into an old classmate at the shop, so the word must mean to come across.
全家/1 | 过年时我们一家人都在一起吃饭 | At New Year the whole family eats together, so the word must mean the whole family.
全身/1 | 下大雨，身上到处都是水 | The heavy rain soaked me from head to foot, so the word must mean the whole body.
景点/1 | 长城是北京最有名的游玩地方 | The Great Wall is Beijing's most famous sight, so the word must mean scenic spot.
旅客/1 | 机场里等飞机的人 | They are waiting for planes at the airport, so the word must mean traveller.
行人/1 | 路上走路的人多，开车要小心 | There are many people on foot, so drivers must take care, and the word must mean pedestrian.
相同/1 | 两个人都叫小明 | Both of us are called Xiaoming, so the word must mean the same.
东部/1 | 和“西部人很少”相对 | Few people live in the west and many in the opposite part, so the word must mean the east.
住处/1 | 在北京还没找到住的地方，住在宾馆 | The speaker has nowhere to live yet and stays at a hotel, so the word must mean lodging.
部门/1 | 问他在公司哪个地方工作 | The question asks which part of the company he works in, so the word must mean department.
清水/1 | 洗菜用的干净的水 | Vegetables are washed in clean water, so the word must mean clear water.
看清/1 | 他走得太快，我没看明白他的脸 | He passed too fast for me to see his face clearly, so the word must mean to see clearly.
订单/1 | 在网上买书以后有的东西 | It is the record of a book bought online, so the word must mean order.
线上/1 | 在家里用电脑就能上课 | The class can be taken at home on a computer, so the word must mean online.
拍手/1 | 他唱得好，大家用手表示喜欢 | He sang well and everyone clapped, so the word must mean to clap.
骑车/1 | 和“不坐地铁”相对，骑自行车上班 | The speaker rides to work instead of taking the subway, so the word must mean to ride a bicycle.
图书馆/1 | 学校里常去看书的地方 | It is where one often goes at school to read, so the word must mean library.
假日/1 | 公园里人很多的、不上班的日子 | The park is crowded on days off, so the word must mean holiday.
全年/1 | 一年里都很热，没有冬天 | It is hot all year with no winter, so the word must mean the whole year.
起飞/1 | 飞机十点离开地面 | The plane takes off at ten, so the word must mean to take off.
乘坐/1 | 请坐地铁二号线去机场 | One is asked to ride line 2 to the airport, so the word must mean to ride, to travel by.
门票/1 | 进公园要买的票，十块钱 | It costs ten yuan to get into the park, so the word must mean admission ticket.
地点/1 | 和“时间”一起，说在哪里开会 | It goes with the time to say where the meeting is, so the word must mean place.
起点/1 | 这辆车开始走的地方，我们从那里上车 | The bus starts from the station, so the word must mean starting point.
晚点/1 | 下大雪，飞机比该来的时间晚了 | The snow held the plane up two hours, so the word must mean to be late, of transport.
正点/1 | 天气很好，火车按时到了 | The weather was fine and the train came on time, so the word must mean on schedule.
公里/1 | 家离公司有十…… | It measures the distance from home to work, so the word must mean kilometre.
对面/1 | 学校前边隔着路的地方有公园 | The park is across the road from the school, so the word must mean opposite.
行李箱/1 | 太重了，请人帮忙拿 | It is too heavy and the speaker asks for help carrying it, so the word must mean suitcase.
高兴/1 | 见到你，心里很开心 | The speaker is delighted to see you, so the word must mean glad.
快乐/1 | 新年的时候说的祝愿 | It is the New Year wish, so the word must mean happy.
笑/1 | 他说的话很好玩，大家都乐了 | What he said was funny and everyone laughed, so the word must mean to laugh.
哭/1 | 孩子找不到妈妈 | The child cannot find mother and is in tears, so the word must mean to cry.
怕/1 | 晚上要开着灯睡觉，因为不敢在黑里 | The child sleeps with the light on, so the word must mean to be afraid of.
希望/1 | 想明年能去中国学习 | The speaker hopes to study in China next year, so the word must mean to hope.
愿意/1 | 问你想不想和我一起去 | The question asks whether you are willing to go with me, so the word must mean to be willing.
心情/1 | 天气好，我心里也很好 | The weather is fine and so is my mood, so the word must mean mood.
担心/1 | 孩子这么晚没回家，妈妈心里不放心 | The child is out so late that mother is worried, so the word must mean to worry.
生气/1 | 他又迟到了，老师不高兴 | He is late again and the teacher is cross, so the word must mean angry.
害怕/1 | 晚上一个人在家，把灯都打开了 | Alone at home at night, she switched on every light, so the word must mean scared.
着急/1 | 飞机快起飞了，他还没到 | The plane is about to leave and he has not arrived, so the word must mean anxious.
紧张/1 | 明天要考试了，心里不放松 | There is an exam tomorrow and the speaker is on edge, so the word must mean nervous.
满意/1 | 老师觉得我的作业很好 | The teacher is pleased with my homework, so the word must mean satisfied.
讨厌/1 | 下雨天不能出去玩，所以不喜欢 | Rainy days keep me indoors, so I dislike them, and the word must mean to hate.
难怪/1 | 没睡觉，所以今天这么累，不奇怪 | He did not sleep last night, so it is no surprise he is tired, and the word must mean no wonder.
哈哈/1 | 你说得太好玩了，笑的声音 | What you said was very funny, so it is the sound of laughter, and the word must be haha.
啊/1 | 句末，感叹天气多好 | It ends an exclamation about the fine weather, so the word must be the exclamation particle a.
呀/1 | 句末，问怎么现在才来，带着语气 | It ends a question about why you came so late, so the word must be the particle ya.
急/1 | 别这样，慢慢说 | The listener is told to speak slowly instead, so the word must mean impatient.
爱情/1 | 电影讲两个人非常相爱 | The film is about two people deeply in love, so the word must mean love.
热情/1 | 常常请我去他们家吃饭 | People here often invite me home for meals, so the word must mean warm, hospitable.
感情/1 | 十年的老朋友，关系很好 | Friends of ten years have a strong bond, so the word must mean feelings, affection.
事情/1 | 今天要做的很多 | There is a lot for me to do today, so the word must mean matter, thing.
同情/1 | 没有家也没有钱，大家都可怜他 | He has no home and no money, so everyone feels for him, and the word must mean to sympathize.
笑话/1 | 他讲了一个，大家都笑了 | He told one and everyone laughed, so the word must mean joke.
可笑/1 | 他说的话谁都不会相信 | No one would believe what he said, so it is laughable, and the word must mean ridiculous.
可怕/1 | 电影让我晚上睡不着 | The film kept me awake at night, so the word must mean frightening.
愿望/1 | 我以后想当医生 | Being a doctor one day is what I wish for, so the word must mean wish.
不满/1 | 都说菜不好吃 | Everyone says the food is bad, so the word must mean dissatisfied.
怪/1 | 东西的样子从来没见过 | I have never seen anything that looks like it, so the word must mean strange.
满/1 | 房间里坐的人没有空位了 | The room has no empty seats, so the word must mean full.
紧/1 | 裤子太小，穿不上 | The trousers are too tight to put on, so the word must mean tight.
要紧/1 | 这点小病没关系 | A little illness like this does not matter, so the word must mean serious, important.
急事/1 | 要先走，因为有着急的事 | The speaker must leave early for something urgent, so the word must mean urgent matter.
看望/1 | 去医院看生病的朋友 | I go to the hospital to see a sick friend, so the word must mean to visit.
自愿/1 | 没有人叫他去，是他自己想去的 | No one told him to go; he chose to, so the word must mean voluntarily.
大笑/1 | 听了他的话，大家笑得很厉害 | Everyone burst out laughing at his words, so the word must mean to laugh loudly.
心中/1 | 妈妈的话一直记在心里 | He has always kept mother's words in mind, so the word must mean in one's heart.
情人/1 | 他们每天都在一起，是一对相爱的人 | They are a couple in love who spend every day together, so the word must mean lover.
紧急/1 | 有人病了，快叫医生 | Someone is ill and a doctor is needed fast, so the word must mean urgent.
急忙/1 | 下雨了，他很快地跑回家 | It started raining and he ran home in a hurry, so the word must mean hastily.
满分/1 | 一个题也没错 | He got every question right, so the word must mean full marks.
怪不得/1 | 他是中国人，所以中文这么好，不奇怪 | He is Chinese, so his good Chinese is no surprise, and the word must mean no wonder.
好笑/1 | 他说的话让大家都笑了 | What he said made everyone laugh, so the word must mean funny.
欢乐/1 | 过年时家里很开心 | The home is full of joy at New Year, so the word must mean joyful.
乐意/1 | 我很高兴帮助你 | The speaker is glad to help you, so the word must mean willing.
天真/1 | 别人说什么他都相信 | The child believes whatever he is told, so the word must mean innocent, naive.
害处/1 | 吃太多糖对身体不好 | Too much sugar is bad for the body, so the word must mean harm.
心急/1 | 饭一会儿就好，不要着急 | The meal will be ready soon, so there is no need to be impatient, and the word must mean impatient.
难过/1 | 没考好，心里不好受 | He did badly in the exam and feels low, so the word must mean sad.
得意/1 | 考了第一名，高兴地笑 | He came first and smiles with pride, so the word must mean pleased with oneself.
自信/1 | 觉得自己一定能做好 | He believes he can certainly do it, so the word must mean confident.
开玩笑/1 | 别生气，我说的话不是真的 | Do not be angry, I was not serious, so the word must mean to joke.
可爱/1 | 小孩子大家都喜欢 | Everyone likes the little child, so the word must mean cute.
友好/1 | 这里的人对我们很好 | The people here treat us kindly, so the word must mean friendly.
明白/1 | 你说的话我懂了 | I have understood what you said, so the word must mean to understand.
同意/1 | 爸爸说可以，我一个人去旅行 | Father has said yes to my travelling alone, so the word must mean to agree.
好友/1 | 我们认识十年了 | We have known each other for ten years, so the word must mean good friend.
千万/1 | 外面冷，一定要多穿衣服 | It is cold, so you really must wrap up, and the word must mean by all means.
山/1 | 很高，走了三个小时才到上面 | It took three hours to reach the top, so the word must mean mountain.
海/1 | 住在旁边，每天都能看到大船 | Living beside it, I see big ships every day, so the word must mean sea.
河/1 | “这条……”，水很清，能看到鱼 | It is counted with 条 and its water is clear, so the word must mean river.
湖/1 | 公园里小小的、能划船的水 | It is a small water in the park to row on, so the word must mean lake.
树/1 | 天热时坐在它下面 | When it is hot we sit beneath it, so the word must mean tree.
花/1 | 妈妈过生日买来送她的 | I bought some for mother's birthday, so the word must mean flowers.
草/1 | 羊喜欢吃的 | Sheep love to eat it, so the word must mean grass.
鸟/1 | “一只小……”在树上唱歌 | A little one is singing in the tree, so the word must mean bird.
云/1 | 天上很白的东西 | It is the white thing in the sky, so the word must mean cloud.
江/1 | 长……是中国最长的河 | It completes the name of China's longest river, so the word must mean river, the Yangtze.
狗/1 | 每天晚上在门口看门 | It guards the door every night, so the word must mean dog.
猫/1 | “这只小……”很喜欢吃鱼 | It is a small animal that loves fish, so the word must mean cat.
马/1 | 他会骑，跑得很快 | He can ride it and it runs fast, so the word must mean horse.
动物/1 | 熊猫是一种很可爱的 | The panda is a lovely one of them, so the word must mean animal.
熊猫/1 | 黑白色、很可爱，中国最有名的动物 | It is black and white, lovely and China's best-known animal, so the word must mean panda.
叶子/1 | 秋天树上变黄的东西 | They turn yellow on the trees in autumn, so the word must mean leaf.
石头/1 | “这块……”很重，拿不动 | It is counted with 块 and too heavy to lift, so the word must mean stone.
太阳/1 | 它出来了，天就亮了 | When it comes out the day grows light, so the word must mean sun.
阳光/1 | 今天很好，可以出去走走 | It is fine today, so we can go out, and the word must mean sunshine.
动物园/1 | 星期天去看熊猫的地方 | It is where we go on Sunday to see pandas, so the word must mean zoo.
季节/1 | 一年有四个 | A year has four of them, so the word must mean season.
温度/1 | 今天有二十度 | Today it is twenty degrees, so the word must mean temperature.
暖和/1 | 春天到了，天气不冷了 | Spring has come and it is no longer cold, so the word must mean warm.
凉快/1 | 秋天到了，天气不热了 | Autumn has come and it is no longer hot, so the word must mean cool.
刮风/1 | 外面有风，要多穿衣服 | It is blowing outside, so wrap up, and the word must mean to be windy.
变化/1 | 十年没回来，这里和以前很不一样 | After ten years away the place has changed a lot, so the word must mean change.
树林/1 | 在很多树中间走了一个小时 | We walked for an hour among many trees, so the word must mean woods.
度/1 | 很冷，只有三…… | It is cold, only three of them, so the word must mean degree.
节日/1 | 春节是中国最重要的 | The Spring Festival is China's most important one, so the word must mean festival.
变/1 | 十年没见，他一点也没有不一样 | After ten years he is just the same, so the word must mean to change.
上山/1 | 早上六点到山上去，下午才下来 | We set off up the mountain at six and came down in the afternoon, so the word must mean to go up a mountain.
海边/1 | 夏天去玩水、看大船的地方 | In summer we go there to play in the water and watch ships, so the word must mean seaside.
河边/1 | 晚饭以后常去走走的、河旁边的地方 | We often stroll there after dinner beside the water, so the word must mean riverside.
花园/1 | 家后面、里面有很多花的地方 | It is behind my home and full of flowers, so the word must mean garden.
草地/1 | 孩子们在上面玩，长着草的地方 | The children play on it, so the word must mean lawn.
白云/1 | 天上有很多的、白色的 | Many white ones float in the sky, so the word must mean white clouds.
大海/1 | 住在山区，从来没见过，也没坐过船 | He lives in the mountains and has never seen it or been on a boat, so the word must mean the sea.
花钱/1 | 一个月的钱几天就用完了 | A month's money is gone in days, so the word must mean to spend money.
马路/1 | 过它的时候要小心车 | One must watch for cars when crossing it, so the word must mean road.
马上/1 | 你等一下，我很快就来 | Wait a moment and I will come right away, so the word must mean at once.
生物/1 | 讲动物和花草的课 | It is the class about animals and plants, so the word must mean biology.
动/1 | 我给你照相，别让身子变位置 | I am taking your picture, so do not move, and the word must mean to move.
光线/1 | 房间里不够亮，看书对眼睛不好 | The room is too dim for reading, so the word must mean light.
四季/1 | 这里一年到头都有花 | Flowers bloom here in every season of the year, so the word must mean the four seasons.
温暖/1 | 妈妈的话让我心里觉得很暖 | Mother's words make me feel warm inside, so the word must mean warm.
气温/1 | 今天很高，有三十五度 | It is thirty-five degrees today, so the word must mean air temperature.
变成/1 | 水到了零度就是冰了 | At zero degrees water turns to ice, so the word must mean to turn into.
文化/1 | 我很喜欢中国的这个 | It is something of China's that I love, so the word must mean culture.
凉/1 | 菜不热了，要热一下 | The dish has gone cold and needs heating, so the word must mean cold.
动人/1 | 她的歌让很多人听哭了 | Her song made many listeners cry, so the word must mean moving.
节/1 | “四……课”，课的量词 | Lessons are being counted, so the word must be their measure word.
高度/1 | 桌子有多高，是一米 | It says how tall the table is, one metre, so the word must mean height.
长度/1 | 路有多长，是五公里 | It says how long the road is, five kilometres, so the word must mean length.
光/1 | 房间里一点也不亮，什么也看不见 | The room is so dark that nothing can be seen, so the word must mean light.
月光/1 | 晚上从月亮来的、照在湖上的 | At night it shines on the lake from the moon, so the word must mean moonlight.
熊/1 | 山里有的、晚上让人不敢上山的动物 | It is an animal in the hills that makes it unsafe to go up alone at night, so the word must mean bear.
山水/1 | 这里的山和水很美，游客来照相 | The hills and rivers here are lovely and tourists photograph them, so the word must mean landscape.
开花/1 | 春天到了，树上长出了花 | Spring has come and the trees are in blossom, so the word must mean to bloom.
多云/1 | 天上云很多，看不见太阳 | The sun cannot be seen behind many clouds, so the word must mean cloudy.
风光/1 | 春天的景色最美 | Spring scenery is the loveliest, so the word must mean scenery.
星星/1 | 晚上天上有很多、一闪一闪的 | There are many of them in the night sky, so the word must mean stars.
月亮/1 | 今天晚上又大又亮的、只有一个 | Tonight it is big and bright, so the word must mean moon.
地球/1 | 我们都住在上面的星球 | It is the planet we all live on, so the word must mean the Earth.
气候/1 | 这里一年到头不冷也不热 | It is neither cold nor hot here all year, so the word must mean climate.
小河/1 | 门口有一条水很清的、小的河 | There is a small clear stream by my door, counted with 条, so the word must mean stream.
花草/1 | 公园里的花和草都很好看 | The flowers and grass in the park are lovely, so the word must mean flowers and plants.
高山/1 | 很高的山，开车很难上去 | It is so high that cars can hardly get up, so the word must mean high mountain.
火山/1 | 已经很多年没有喷火了 | It has not erupted for many years, so the word must mean volcano.
山区/1 | 有很多山、路很不好走的地方 | He teaches in a place full of hills where roads are rough, so the word must mean mountain area.
冰雪/1 | 冬天，河上和山上到处都是冰和雪 | In winter ice and snow lie everywhere, so the word must mean ice and snow.
黄河/1 | 中国第二长的河 | It is China's second-longest river, so the word must mean the Yellow River.
雪花/1 | 天上下起了大片白白的 | Big flakes fell from the sky, so the word must mean snowflakes.
小狗/1 | 每天在门口等我回家的小动物 | It waits at the door for me every day, so the word must mean puppy.
小猫/1 | “这只……”很喜欢吃鱼 | It is a small animal that loves fish, so the word must mean kitten.
马车/1 | 以前人们出门坐的、马拉的车 | People used to travel in it, pulled by horses, so the word must mean horse cart.
山羊/1 | 山上吃草的动物 | Many of them are grazing on the hill, so the word must mean goat.
海水/1 | 很咸，不能喝的水 | It is salty and cannot be drunk, so the word must mean sea water.
湖边/1 | 公园里、人们在那里划船的地方 | People are rowing there in the park, so the word must mean lakeside.
东北/1 | 中国北边冬天很冷的地方 | It is the part of China with very cold winters, so the word must mean the northeast.
海关/1 | 出国的时候要过的地方 | One must pass through it when going abroad, so the word must mean customs.
运动/1 | 多做对身体好，比如跑步、打球 | Doing more of it is good for the body, so the word must mean exercise.
游泳/1 | 天太热了，去河里玩水 | It is too hot, so we go into the river, and the word must mean to swim.
跳舞/1 | 她跳得很美 | Everyone says she dances beautifully, so the word must mean to dance.
爬山/1 | 走了三个小时才到山上面 | It took three hours to reach the top, so the word must mean to climb a mountain.
篮球/1 | 个子很高的人打得好的球 | Tall people play it well, so the word must mean basketball.
足球/1 | 每天下午去踢的球 | He goes to kick it every afternoon, so the word must mean football.
比赛/1 | 学校明天要看的足球…… | There is a football one at school tomorrow to watch, so the word must mean match.
踢/1 | 用脚让球进了门 | He sent the ball into the goal with his foot, so the word must mean to kick.
练习/1 | 学中文要多说，常常做 | Learning Chinese means speaking a lot, again and again, so the word must mean to practise.
跳/1 | 孩子能往上跳得很高 | The child can leap high, so the word must mean to jump.
队/1 | “我们足球……”，一起踢球的人 | He belongs to our football one, so the word must mean team.
输/1 | 我们队没赢，大家都很难过 | Our team did not win and everyone is sad, so the word must mean to lose.
赢/1 | 我们队比赛得胜了，大家都很高兴 | Our team won and everyone is happy, so the word must mean to win.
锻炼/1 | 爷爷每天早上在公园让身体变好 | Grandpa goes to the park every morning to build up his body, so the word must mean to exercise.
拉/1 | 门上写着“推”，别往自己这边用力 | The door says "push", so you should not pull it, and the word must mean to pull.
推/1 | 车开不动了，我们下来往前用力 | The car will not move, so we get out to push, and the word must mean to push.
参加/1 | 想去学校的足球比赛里踢球 | I want to take part in the school football match, so the word must mean to join.
坚持/1 | 学中文每天学一点，不停下来 | One should keep learning a little every day, so the word must mean to persist.
球队/1 | 有十一个人的、踢球的队 | It has eleven players, so the word must mean team.
运动员/1 | “一名足球……”，打比赛的人 | He plays football as a sportsman, so the word must mean athlete.
跳高/1 | 个子高，跳得高的运动 | He is tall and good at jumping over a bar, so the word must mean high jump.
跳远/1 | 跑得快，能跳五米远 | He runs fast and can jump five metres, so the word must mean long jump.
舞会/1 | 晚上大家都要去跳舞的活动 | Everyone goes to dance at it tonight, so the word must mean dance party.
爬/1 | 孩子还不会走，在地上用手和脚动 | The baby cannot walk yet, so it moves on hands and knees, and the word must mean to crawl.
不足/1 | 钱不够，买不了 | I do not have enough money to buy it, so the word must mean insufficient.
球赛/1 | 昨天晚上看的、很好看的比赛 | Last night's match was great to watch, so the word must mean ball game.
踢球/1 | 下课以后男孩子们都去玩足球 | After class the boys all go to play football, so the word must mean to play football.
运气/1 | 一出门就打到了出租车，真好 | He caught a taxi the moment he stepped out, so the word must mean luck.
队长/1 | 球队里管大家的人 | He leads our team, so the word must mean captain.
拉开/1 | 把门往自己这边打开 | The door is to be pulled open, so the word must mean to pull open.
推开/1 | 他用手把门往前打开走进来 | He pushed the door open and walked in, so the word must mean to push open.
运动场/1 | 学校里很大的、学生下课后踢球的地方 | It is the big place at school where students play football, so the word must mean sports ground.
足够/1 | 时间很多，不用急 | There is plenty of time and no need to hurry, so the word must mean enough.
跳水/1 | 从十米高的地方跳进水里的运动 | He dives from ten metres up into the water, so the word must mean diving.
赛跑/1 | 一起跑，看谁先到 | We run to see who arrives first, so the word must mean to race.
练/1 | 每天写两个小时的字，让字写得好 | He spends two hours a day on his handwriting, so the word must mean to practise.
拉肚子/1 | 吃了不干净的东西，肚子不舒服 | He ate something dirty and his stomach is upset, so the word must mean to have diarrhoea.
推迟/1 | 下雨了，比赛改到明天 | It is raining, so the match is put off till tomorrow, and the word must mean to postpone.
坚定/1 | 说“我一定要去”时的样子 | He says "I must go" with firm resolve, so the word must mean firmly.
运/1 | 用车把东西送到北京 | The goods will go to Beijing by lorry, so the word must mean to transport.
球员/1 | 球队里踢得好的人 | The team has many good players, so the word must mean player.
队员/1 | 我们队有十个人 | Our team has ten members, so the word must mean team member.
比分/1 | “二比一”，两个队得的分 | It is two to one, so the word must mean score.
输赢/1 | 比赛输了还是赢了，不重要 | Whether one wins or loses does not matter, so the word must mean winning or losing.
第一名/1 | 跑得最快的人得到的 | He ran the fastest, so the word must mean first place.
骑马/1 | 第一次坐在马上，有点害怕 | It is the first time he has sat on a horse and he is a little scared, so the word must mean to ride a horse.
用力/1 | 门太重了，要使很大的劲 | The door is heavy, so one must push hard, and the word must mean with effort.
全力/1 | 比赛的时候用了所有的力气 | Everyone gave all their strength in the match, so the word must mean full strength.
动作/1 | 跳舞时身体的动，很美 | His movements when dancing are graceful, so the word must mean movement.
进行/1 | 比赛正在做着，还没完 | The match is under way, so the word must mean to be in progress.
节目/1 | 电视上每个星期都看的、很好看的 | I watch it on TV every week, so the word must mean programme.
新闻/1 | 爸爸每天晚上在电视上看国家和世界的事 | Father watches the day's events on TV every evening, so the word must mean news.
报纸/1 | “一张……”，上面有很多新闻 | It is counted with 张 and full of news, so the word must mean newspaper.
故事/1 | 妈妈晚上讲给孩子听的 | Mother tells the child one every night, so the word must mean story.
杂志/1 | “一本……”，每个月出一次 | It is counted with 本 and comes out monthly, so the word must mean magazine.
声音/1 | 说话太小了，我听不见 | Your voice is too soft to hear, so the word must mean sound, voice.
音乐/1 | 一边做作业一边听，歌很好听 | I listen to it while doing homework, so the word must mean music.
演员/1 | 有名的、在电影里演戏的人 | She acts in films, so the word must mean actor.
演出/1 | 晚上有一场，很多有名的演员都来了 | There is one tonight with many famous actors, so the word must mean performance.
直播/1 | 比赛电视上正在同时播 | The match is on TV as it happens, so the word must mean live broadcast.
号码/1 | 问电话的…… | The question asks for your telephone number, so the word must mean number.
聊天/1 | 一边喝茶一边说话 | We chat over tea, so the word must mean to chat.
微信/1 | 手机上加朋友用的 | One adds friends on this phone app, so the word must mean WeChat.
句子/1 | 用这个词说一个完整的话 | One must make a whole sentence with the word, so the word must mean sentence.
讨论/1 | 大家一起说自己的意见 | Everyone gives their own view together, so the word must mean to discuss.
简单/1 | 问题一下就做完了 | I finished the question at once, so the word must mean simple.
复习/1 | 明天要考试，今天晚上再学一遍 | There is an exam tomorrow, so tonight I go over the lessons, and the word must mean to revise.
谈/1 | 说了一个下午，说了很多事 | We talked all afternoon about many things, so the word must mean to talk.
内容/1 | 书里讲的东西很有意思 | What the book says is interesting, so the word must mean content.
回复/1 | 发了信息，他还没给我回 | I sent a message and he has not replied, so the word must mean to reply.
谈话/1 | 老师找我说话，问我为什么迟到 | The teacher calls me in for a talk about being late, so the word must mean to have a talk.
微笑/1 | 见到人都会轻轻地笑 | She smiles at everyone she meets, so the word must mean to smile.
句/1 | “一……话”，话的量词 | Sentences are being counted, so the word must be their measure word.
复杂/1 | 问题太难了，我想不明白 | The problem is too involved for me to work out, so the word must mean complicated.
重复/1 | 没听清楚，请再说一遍 | I did not catch it, so please say it again, and the word must mean to repeat.
以内/1 | 在十分钟里面做完 | It must be done within ten minutes, so the word must mean within.
国内/1 | 没出过国，只在自己国家旅游 | He has never been abroad, only travelled at home, so the word must mean domestic.
简直/1 | 风景太美了，真是 | The view is simply too lovely, so the word must mean simply.
目的/1 | 问为什么来中国 | The question asks what you came to China for, so the word must mean purpose.
题目/1 | 考试的问题很难 | The exam questions were hard, so the word must mean question, topic.
报名/1 | 想参加比赛，已经写上了名字 | I want to compete and have already signed up, so the word must mean to sign up.
大声/1 | 我听不见，声音要大一点 | I cannot hear, so please speak up, and the word must mean loudly.
小声/1 | 孩子在睡觉，说话声音要小 | The child is sleeping, so speak quietly, and the word must mean in a low voice.
笑声/1 | 房间里都是孩子们笑的声音 | The room is full of children laughing, so the word must mean laughter.
歌声/1 | 大家都喜欢听她唱歌的声音 | Everyone loves to hear her sing, so the word must mean singing.
发音/1 | 学中文，字读得对很重要 | In learning Chinese, saying sounds correctly matters, so the word must mean pronunciation.
口音/1 | 他说话带着南方的味道 | He speaks with a southern accent, so the word must mean accent.
演唱会/1 | 买了两张票的、歌手唱歌的晚会 | I bought two tickets for a singer's show, so the word must mean concert.
故意/1 | 对不起，我不是想这样做的 | Sorry, I did not do it on purpose, so the word must mean deliberately.
播放/1 | 电视上正在放新闻 | The news is being shown on TV, so the word must mean to broadcast.
歌手/1 | 有名的、唱歌很好听的人 | She is famous and sings beautifully, so the word must mean singer.
音乐会/1 | 晚上去听音乐的晚会 | We are going to listen to music tonight, so the word must mean concert.
日报/1 | 每天都出的报纸 | It is a newspaper that comes out every day, so the word must mean daily.
网站/1 | 网上能买东西的地方 | One can shop on this site, so the word must mean website.
信息/1 | “发了一条……”，手机上看的 | I sent you one on the phone, counted with 条, so the word must mean message.
对话/1 | 两个人一起练习说的话 | Two people practise it together, so the word must mean dialogue.
说明/1 | 不知道东西怎么用，看一下……书 | The item comes with a book telling how to use it, so the word must mean instructions.
方面/1 | “在学习……”，说的是哪一部分 | He does well in his studies, so the word must mean aspect.
区别/1 | 两个字有什么不一样 | The question asks how the two characters differ, so the word must mean difference.
作用/1 | 药吃了还是很疼，没有用 | The medicine has not helped the pain, so the word must mean effect.
礼物/1 | 送给你的生日的东西 | It is my birthday present to you, so the word must mean gift.
祝/1 | 说“生日快乐”时开头的话 | It opens the wish "happy birthday", so the word must mean to wish.
祝贺/1 | 你考上了大学，说恭喜 | You got into university and I congratulate you, so the word must mean to congratulate.
蛋糕/1 | 生日的时候要吃的 | It is eaten on birthdays, so the word must mean cake.
结婚/1 | 他们明年要成为夫妻 | They will marry next year, so the word must mean to marry.
份/1 | “一……米饭”，点饭的量词 | Rice is ordered by the portion, so the word must be its measure word.
祝福/1 | 新年给家人发去的好话 | At New Year I send my family good wishes, so the word must mean blessing.
结束/1 | 比赛完了，我们队赢了 | The match is over and we won, so the word must mean to end.
月饼/1 | 中秋节要吃的 | It is eaten at the Mid-Autumn Festival, so the word must mean mooncake.
春节/1 | 中国的新年 | It is the Chinese New Year, so the word must mean the Spring Festival.
婚礼/1 | 参加朋友结婚的活动 | I am going to my friend's marriage ceremony, so the word must mean wedding.
送礼/1 | 过年的时候喜欢给别人东西 | At New Year Chinese people like to give presents, so the word must mean to give gifts.
过节/1 | 节日的时候大家都回家 | Everyone goes home for the holidays, so the word must mean to celebrate a festival.
结果/1 | 考试最后怎么样出来了 | The exam results are out, so the word must mean result.
饼干/1 | 饿了吃了几块的东西 | I was hungry and ate a few pieces, so the word must mean biscuit.
年糕/1 | 过年的时候南方人喜欢吃的 | Southerners like to eat it at New Year, so the word must mean rice cake.
福/1 | 春节时门上的大大的字 | It is the big character on doors at the Spring Festival, so the word must mean good fortune.
中秋节/1 | 八月十五 | It falls on the fifteenth of the eighth month, so the word must mean the Mid-Autumn Festival.
新婚/1 | 祝刚结婚的两个人快乐 | We wish the just-married couple happiness, so the word must mean newly married.
离婚/1 | 他们不再是夫妻，不住在一起了 | They are no longer married and live apart, so the word must mean to divorce.
过年/1 | 春节的时候，孩子们最高兴 | Children are happiest at New Year, so the word must mean to celebrate the New Year.
红包/1 | 过年时爷爷给的、里面有钱的 | Grandpa gave me one with money inside at New Year, so the word must mean red envelope.
好运/1 | 明天考试了，祝你能考好 | The exam is tomorrow, so I wish you good luck, and the word must mean good luck.
万事如意/1 | 新年时祝什么事都好 | It is the New Year wish that everything go well, so the word must mean may all go well.
新人/1 | 婚礼上大家祝福的一对 | Everyone blesses the couple at the wedding, so the word must mean newlyweds.
喜糖/1 | 结婚时给同事们送的糖 | Newlyweds hand out sweets to colleagues, so the word must mean wedding sweets.
喜酒/1 | 去喝他们结婚的酒 | I am going to drink at their wedding feast, so the word must mean wedding feast.
长假/1 | 放的、时间很长的假 | This long holiday is for travelling, so the word must mean long holiday.
礼服/1 | 参加婚礼要穿的衣服 | One wears formal clothes to a wedding, so the word must mean formal dress.
福气/1 | 有这么好的孩子，很幸运 | Having such fine children is a blessing, so the word must mean good fortune.
出生/1 | 我是在北京来到世界上的 | I was born in Beijing, so the word must mean to be born.
老家/1 | 以前住的、在南方的家 | My family home is in the south, so the word must mean hometown.
中年/1 | 四十多岁的人 | He is in his forties, so the word must mean middle age.
老年/1 | 爷爷到了的、年纪很大的时候 | Grandpa has reached old age, so the word must mean old age.
少年/1 | 十五岁的人 | He is fifteen, still a youth, so the word must mean juvenile, teenager.
名人/1 | 很多人都认识的人 | Many people know him, so the word must mean celebrity.
出名/1 | 饭馆很有名，很多人来吃饭 | The restaurant is well known and busy, so the word must mean famous.
难道/1 | 反问“你不知道吗” | It turns the question into "surely you know?", so the word must mean can it be that.
零钱/1 | 只有一百块的，没有小钱 | I have only hundred-yuan notes and no small change, so the word must mean change.
样子/1 | 他生气时看起来很可怕 | He looks frightening when angry, so the word must mean appearance.
`);
