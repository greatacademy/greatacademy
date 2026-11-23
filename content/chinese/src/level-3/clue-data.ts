// The clues of the gap sentences of the level 3 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelThreeClues are the clues of the gap sentences of the level 3 words, by clueKey, each word's sentence counted as 1. */
export const levelThreeClues = parseClues(`
而且/1 | 会说中文，再进一步说得很好 | He speaks Chinese and, going further, speaks it well, so the word must mean and also.
却/1 | 天很冷，和应该的相反只穿一件 | It is cold, yet against all sense he wears only one layer, so the word must mean but, yet.
并/1 | 加强否定，问题真的不难 | It strengthens the denial that the question is hard, so the word must mean not at all, really.
否则/1 | 快走，不然就要迟到 | We must hurry or we will be late, so the word must mean otherwise.
必须/1 | 考试很重要，一定要参加 | The exam matters, so you have to sit it, and the word must mean must.
甚至/1 | 很忙，连星期天也要上班 | He is so busy that he works even on Sundays, so the word must mean even.
终于/1 | 等了两个小时，最后车来了 | After two hours of waiting the bus came at last, so the word must mean finally.
突然/1 | 正在吃饭，一下子下起了大雨 | While we ate it suddenly began to pour, so the word must mean suddenly.
仍然/1 | 十年过去了，还和以前一样住在老房子里 | Ten years on he still lives in the old house, so the word must mean still.
由于/1 | 因为下大雨，比赛推迟了 | The match was put off because of the rain, so the word must mean owing to.
竟然/1 | 题这么难，他五分钟就做完，没想到 | He finished so hard a problem in five minutes, which nobody expected, so the word must mean unexpectedly.
尽管/1 | 虽然外面下着雨，他还是出门了 | Although it was raining he went out, so the word must mean although.
不管/1 | 多忙都每天给妈妈打电话 | However busy he is he calls his mother daily, so the word must mean no matter.
不论/1 | 你去不去，我都要去 | Whether you go or not, I will go, so the word must mean regardless of.
于是/1 | 天黑了，所以接着就回家了 | It got dark, so we went home, and the word must mean so, thereupon.
然而/1 | 很努力，但是考得不好 | He worked hard but did badly, so the word must mean however.
无论/1 | 天气怎么样都去公园 | Whatever the weather he goes to the park, so the word must mean no matter.
至少/1 | 到机场最少要一个小时 | It takes at least an hour to the airport, so the word must mean at least.
管理/1 | 在公司管着二十个人 | He is in charge of twenty people at the firm, so the word must mean to manage.
尽快/1 | 请越快越好地回复我 | Please reply as soon as you can, so the word must mean as soon as possible.
无聊/1 | 下雨天不能出去，在家没事做 | Stuck indoors on a rainy day with nothing to do, so the word must mean bored.
必要/1 | 这件事不需要告诉他 | There is no need to tell him, so the word must mean necessity.
并且/1 | 会唱歌，还唱得很好 | He sings, and sings well, so the word must mean and also.
终点/1 | 车最后到的地方，大家都在那里下车 | Everyone gets off at the bus's last stop, so the word must mean terminus.
管/1 | 我的事你别插手 | It is my business and you should keep out, so the word must mean to mind, to meddle.
由/1 | 这件事交给我来做 | I will be the one to do it, so the word must mean by.
至今/1 | 十年前去了国外，到现在还没回来 | He left ten years ago and has not returned to this day, so the word must mean to this day.
无关/1 | 这件事跟你没有关系 | The matter has nothing to do with you, so the word must mean unrelated.
尽力/1 | 我会用全部的力量帮你 | I will do my best to help you, so the word must mean to do one's best.
突出/1 | 他的中文在班里特别好 | His Chinese stands out in the class, so the word must mean outstanding.
观点/1 | 同意你的看法，你说得很对 | I agree with your view, so the word must mean point of view.
反对/1 | 爸爸不同意我一个人去旅行 | Father is against my travelling alone, so the word must mean to oppose.
支持/1 | 你做什么我都站在你这边 | I back you whatever you do, so the word must mean to support.
选择/1 | 两个都很好，不知道要哪个 | Both are good and I cannot pick, so the word must mean to choose.
决定/1 | 已经想好了明年去中国学习 | I have made up my mind to study in China next year, so the word must mean to decide.
赞成/1 | 大家都同意这个计划 | Everyone is in favour of the plan, so the word must mean to approve.
证明/1 | 你说他来过，有什么能说明是真的 | You say he came, so what shows it is true, and the word must mean to prove.
选票/1 | 得了一百张，当上了班长 | He got a hundred of them and became class monitor, so the word must mean vote, ballot.
决不/1 | 放心，我一定不会告诉别人 | Rest assured, I will never tell anyone, so the word must mean never.
观看/1 | 很多人来看足球比赛 | Many people came to watch the match, so the word must mean to watch.
反正/1 | 别急，不管怎么样时间还早 | Do not hurry, it is early anyway, so the word must mean anyway.
相反/1 | 两个人的意见完全不一样，正对着 | Our views are the exact opposite, so the word must mean opposite.
支/1 | “两……笔”，笔的量词 | Pens are being counted, so the word must be their measure word.
选/1 | 大家投票让他当班长 | Everyone voted him monitor, so the word must mean to elect.
决心/1 | “下了……”，一定要每天学 | He made up his mind to study two hours daily, so the word must mean determination.
赞/1 | 网上给照片点的 | He gave my photo a like online, so the word must mean like, praise.
据说/1 | 听别人说明天会下雪 | People say it will snow tomorrow, so the word must mean it is said.
反而/1 | 病不但没好，倒更重了 | The illness got worse instead of better, so the word must mean on the contrary.
而是/1 | 不是不想去，是没有时间 | It is not that he does not want to go but that he has no time, so the word must mean but rather.
选手/1 | 比赛里一百名参加的人 | A hundred competitors are in the contest, so the word must mean contestant.
决赛/1 | 进了以后要和最好的队比，最后一场 | Our team reached it and plays the best team tomorrow, so the word must mean final.
关于/1 | 一本讲中国文化的书 | It is a book on Chinese culture, so the word must mean about.
对于/1 | 说到这个问题，大家意见不一样 | Regarding this question, opinions differ, so the word must mean as for.
等于/1 | 二加三的得数是五 | Two plus three makes five, so the word must mean to equal.
不必/1 | 你不用担心 | There is no need to worry, so the word must mean need not.
是否/1 | 不知道他会不会来 | I do not know whether he will come, so the word must mean whether.
自由/1 | 放假了，孩子们想怎么玩就怎么玩 | On holiday the children play as they like, so the word must mean freely.
理由/1 | 问为什么迟到 | The question asks for the reason you were late, so the word must mean reason.
参观/1 | 去北京大学看一看 | We are going to visit Peking University, so the word must mean to visit, to tour.
乐观/1 | 遇到什么问题都不着急，往好处想 | He looks on the bright side whatever happens, so the word must mean optimistic.
反复/1 | 句子练习了很多遍 | I practised the sentence over and over, so the word must mean repeatedly.
反应/1 | 叫了他几次，他都没回答也没动 | I called him several times and got no response, so the word must mean reaction.
坚决/1 | 他怎么也不同意，谁说都没用 | He refuses outright and no one can move him, so the word must mean resolutely.
赞美/1 | 大家都说这里风景好 | Everyone sings the praises of the scenery, so the word must mean to praise.
证据/1 | 说他拿了钱，要能说明是真的东西 | If he took the money there must be proof, so the word must mean evidence.
身份证/1 | 住宾馆要用的、说明你是谁的证 | A hotel asks for it to show who you are, so the word must mean ID card.
证件/1 | 坐飞机要带好的各种证 | One must carry one's papers to fly, so the word must mean documents.
至多/1 | 房间最多能住三个人 | The room sleeps three at most, so the word must mean at most.
最终/1 | 讨论了很久，最后决定明年再去 | After long discussion they finally decided to go next year, so the word must mean in the end.
无比/1 | 考上大学，高兴得没有什么能比 | He was happier than anything on getting into university, so the word must mean incomparably.
而已/1 | 只是问问，没有别的 | I was only asking, that is all, so the word must mean that is all.
否定/1 | 老师说我的意见不行 | The teacher rejected my idea, so the word must mean to negate.
否认/1 | 他说自己没拿那本书 | He denies taking the book, so the word must mean to deny.
必然/1 | 不好好学习，一定会考不好 | Without study a poor result is inevitable, so the word must mean inevitable.
必定/1 | 说了会来，就一定会来 | He said he would come, so he will certainly come, and the word must mean certainly.
至于/1 | 只想去北京，说到上海以后再说 | I only want Beijing; as for Shanghai, later, so the word must mean as for.
处于/1 | 孩子正在长身体的时候 | The child is at the age of growing fast, so the word must mean to be in a state of.
过于/1 | 你担心得太多了 | You worry too much, so the word must mean excessively.
外观/1 | 车外面的样子很漂亮 | The car looks good from outside, so the word must mean appearance.
无心/1 | 心里有事，没有心思工作 | He has something on his mind and cannot work, so the word must mean not in the mood.
观光/1 | 很多人来这里旅游看风景 | Many people come here to sightsee, so the word must mean to go sightseeing.
反问/1 | 不说是不是，回过来问我 | He answered my question with a question, so the word must mean to ask in return.
年终/1 | 一年最后的时候公司发红包 | The firm gives bonuses at the end of the year, so the word must mean year-end.
终身/1 | 学习是一辈子的事 | Learning lasts a whole lifetime, so the word must mean lifelong.
合并/1 | 两个公司要合成一个 | The two companies will become one, so the word must mean to merge.
无意/1 | 我不是故意说错话的 | I did not mean to say the wrong thing, so the word must mean unintentionally.
选出/1 | 从这些词里挑出三个 | Pick three of the words, so the word must mean to pick out.
支出/1 | 家里这个月花的钱太多了 | The family spent too much this month, so the word must mean expenditure.
选课/1 | 开学时学生要先挑要上的课 | At the start of term students first pick courses, so the word must mean to choose courses.
管用/1 | 药吃了就好了，很有用 | The medicine worked at once, so the word must mean effective.
性格/1 | 跟谁都能做朋友，为人很好 | He gets on with everyone, so the word must mean personality.
脾气/1 | 常常生气 | He often loses his temper, so the word must mean temper.
聪明/1 | 什么都一学就会 | The child learns everything at once, so the word must mean clever.
笨/1 | 简单的题都做错了 | I got even simple questions wrong, so the word must mean stupid.
懒/1 | 从来不打扫房间 | He never cleans his room, so the word must mean lazy.
勤快/1 | 每天把家里打扫得干干净净 | She keeps the house spotless every day, so the word must mean hardworking.
礼貌/1 | 见到人就说“您好” | The child greets everyone with "hello", so the word must mean courtesy.
诚实/1 | 从来不说假话 | He never tells lies, so the word must mean honest.
老实/1 | 问你昨天去哪里了，要说真话 | You are told to say truthfully where you were, so the word must mean honestly.
其实/1 | 看起来年轻，真的已经五十岁了 | He looks young but is actually fifty, so the word must mean actually.
优点/1 | 好的地方是做事很认真 | Working carefully is the good side of him, so the word must mean strength, merit.
缺点/1 | 不好的地方是做事太慢 | Being slow is his weak side, so the word must mean shortcoming.
特别/1 | 今天比平时冷得多 | It is unusually cold today, so the word must mean especially.
特点/1 | 问这里的菜跟别处不一样的地方 | The question asks what marks the local food out, so the word must mean characteristic.
一般/1 | 平时晚上十一点睡觉 | I usually go to bed at eleven, so the word must mean usually.
普通/1 | 只是一个平平常常的工人 | He is just an ordinary worker, so the word must mean ordinary.
通过/1 | 考试考过了 | He passed the exam, so the word must mean to pass.
其他/1 | 我只吃了一个，别的都给你 | I ate one and the rest are yours, so the word must mean the other.
其中/1 | 三十个学生里面有十个男生 | Ten of the thirty students are boys, so the word must mean among them.
好极了/1 | 你说得太好了 | What you said was excellent, so the word must mean extremely good.
友善/1 | 这里的人常常帮助我们，对人好 | The people here often help us, so the word must mean friendly.
耐心/1 | 老师讲了一遍又一遍，不着急 | The teacher explained again and again without fuss, so the word must mean patience.
烦/1 | 别说了，心里不舒服 | Stop talking, I am fed up, so the word must mean annoyed.
骄傲/1 | 考了第一，觉得自己了不起 | He came first and got a little conceited, so the word must mean proud, arrogant.
勇敢/1 | 什么都不怕 | He fears nothing, so the word must mean brave.
敢/1 | 不……一个人晚上出门，有勇气 | I do not dare go out alone at night, so the word must mean to dare.
粗心/1 | 又把名字写错了 | He wrote his name wrongly again, so the word must mean careless.
细心/1 | 做事从来不出错 | She never makes a mistake, so the word must mean careful.
负责/1 | 工作认真，大家都放心 | He does his work so well everyone trusts him, so the word must mean responsible.
责任/1 | 做好自己的工作是每个人应该做的 | Doing one's job well is everyone's duty, so the word must mean responsibility.
通红/1 | 喝了酒，脸很红 | He drank and his face went bright red, so the word must mean very red.
优美/1 | 风景十分好看 | The scenery is very beautiful, so the word must mean graceful, beautiful.
缺少/1 | 这里没有足够的水，草都黄了 | There is not enough water and the grass is yellow, so the word must mean to lack.
特色/1 | 饭馆的菜跟别家不一样 | The restaurant's dishes are distinctive, so the word must mean special feature.
普遍/1 | 用手机上网到处都是 | Using phones to go online is now common, so the word must mean widespread.
通常/1 | 平常七点起床 | I normally get up at seven, so the word must mean usually.
极/1 | “好看……了”，非常 | The film was extremely good, so the word must mean extremely.
勇气/1 | 不敢跟她说话，没有胆子 | He lacks the nerve to speak to her, so the word must mean courage.
实话/1 | 跟我说真的话 | Tell me the truth, so the word must mean truth.
心细/1 | 什么都想到了 | She thought of everything, so the word must mean attentive to detail.
个性/1 | 穿衣服跟别人都不一样 | She dresses unlike anyone else, so the word must mean individuality.
性别/1 | 表上写名字和男女 | The form asks for your name and sex, so the word must mean gender.
实在/1 | 真的太累了，想休息 | I really am too tired, so the word must mean truly.
事实/1 | 说的不是真的发生的事，是想出来的 | What you say is made up and not what happened, so the word must mean fact.
真实/1 | 电影讲的是一个真的故事 | The film tells a true story, so the word must mean real.
现实/1 | 计划好，但是做不到 | The plan is good but not practical, so the word must mean realistic.
实用/1 | 包不好看，但是很有用 | The bag is not pretty but useful, so the word must mean practical.
不敢/1 | 一个人睡觉要开着灯，害怕 | He is too scared to sleep alone without the light, so the word must mean not to dare.
负担/1 | 孩子作业太多，压力太重 | The children's homework is too heavy a load, so the word must mean burden.
任务/1 | 老师给了一个新的工作要做 | The teacher gave us a new assignment, so the word must mean task.
心烦/1 | 工作做不完，心里不舒服 | He cannot finish his work and feels vexed, so the word must mean upset.
耐用/1 | 鞋穿了三年还很好 | The shoes are still good after three years, so the word must mean durable.
粗/1 | 笔太粗，写的字不好看 | The pen is too thick to write neatly, so the word must mean thick.
细/1 | 线太细，看不清楚 | The thread is too thin to see, so the word must mean thin.
特意/1 | 专门来看你 | I came especially to see you, so the word must mean specially.
极少/1 | 冬天很少很少下雪 | It hardly ever snows here in winter, so the word must mean very seldom.
优先/1 | 老人和孩子先上车 | The old and children board first, so the word must mean to have priority.
通知/1 | 明天不上课，告诉大家 | Classes are off tomorrow, so please tell everyone, and the word must mean to notify.
其次/1 | 发音最重要，第二是汉字 | Pronunciation comes first and characters second, so the word must mean next.
实力/1 | 每次比赛都赢，队很强 | They win every match, so the word must mean strength.
担任/1 | 在公司当经理 | He serves as a manager at the firm, so the word must mean to hold a post.
责怪/1 | 不是你的错，没人会怪你 | It is not your fault, so no one will blame you, and the word must mean to blame.
负/1 | 二比三输了 | We lost two to three, so the word must mean to be defeated.
通/1 | 电话打不了，他可能关机了 | The call will not go through, so the word must mean to get through.
特/1 | 今天很热，不想出门 | It is very hot today, so the word must mean especially.
普通话/1 | 说得很好，听不出是南方人 | He speaks standard Chinese so well no one can tell he is southern, so the word must mean Mandarin.
粗细/1 | 两支笔一粗一细，不一样 | The two pens differ in thickness, so the word must mean thickness.
细小/1 | 很小的问题也要想到 | Even tiny problems must be thought of, so the word must mean minor.
敢于/1 | 有勇气说出自己的意见 | He has the courage to speak his mind, so the word must mean to dare to.
极其/1 | 事情非常重要，一定要记住 | The matter is extremely important, so the word must mean extremely.
诚心/1 | 我是真心想帮你的 | I sincerely want to help, so the word must mean sincerely.
真诚/1 | 对朋友说的都是心里话 | He speaks from the heart to friends, so the word must mean sincere.
外貌/1 | 不要只看人长得怎么样 | Do not judge a person only by looks, so the word must mean appearance.
笨重/1 | 桌子太重太大，一个人搬不动 | The table is too heavy and bulky to move alone, so the word must mean cumbersome.
懒得/1 | 天太冷，不想出门 | It is too cold to bother going out, so the word must mean not to feel like.
不耐烦/1 | 等了很久，有点不想再等 | He waited long and grew impatient, so the word must mean impatient.
善于/1 | 她很会跟人聊天 | She is good at chatting with people, so the word must mean to be good at.
格外/1 | 下过雪，空气特别新鲜 | After the snow the air is especially fresh, so the word must mean especially.
实现/1 | 愿望终于成真了 | His wish has finally come true, so the word must mean to realise.
粗心大意/1 | 做事常常忘记带东西 | He often forgets things, so the word must mean careless.
交流/1 | 用中文和同学说话、交换想法 | I often communicate with classmates in Chinese, so the word must mean to communicate.
互相/1 | 好朋友常常你帮我、我帮你 | Good friends often help each other, so the word must mean mutually.
了解/1 | 跟他不熟，不太知道他 | I do not know him well, so the word must mean to know well.
理解/1 | 明白你的心情，换了我也会生气 | I understand how you feel, so the word must mean to understand.
尊重/1 | 要看重别人的意见 | We should respect others' views, so the word must mean to respect.
原谅/1 | 对不起，请不要怪我 | Sorry, please forgive me, so the word must mean to forgive.
误会/1 | 你想错了，我不是这个意思 | You have got me wrong, so the word must mean to misunderstand.
联系/1 | 到了北京，给我打电话 | Get in touch with me in Beijing, so the word must mean to contact.
约会/1 | 晚上有和别人约好的见面 | I have an appointment tonight, so the word must mean date, appointment.
邀请/1 | 他请我去他家吃饭 | He invited me to dinner at his home, so the word must mean to invite.
熟悉/1 | 刚来这里，还不知道这里的情况 | I am new here and not yet familiar with it, so the word must mean familiar.
夫妻/1 | 结婚十年的一对 | They are a couple married ten years, so the word must mean husband and wife.
妻子/1 | 他的、是医生、结婚五年了 | His wife is a doctor and they married five years ago, so the word must mean wife.
父母/1 | 爸爸妈妈都是老师 | Both my mother and father are teachers, so the word must mean parents.
父亲/1 | 和母亲结婚二十年了 | He married my mother twenty years ago, so the word must mean father.
母亲/1 | 小时候每天给他做饭、送他上学 | When he was small she cooked for him and took him to school, so the word must mean mother.
叔叔/1 | 爸爸的弟弟 | He is my father's younger brother, so the word must mean uncle.
阿姨/1 | 妈妈的妹妹 | She is my mother's younger sister, so the word must mean aunt.
亲戚/1 | 叔叔、阿姨这些家里的人 | Uncles, aunts and the like come to us at New Year, so the word must mean relatives.
夫人/1 | 张先生的太太 | She is Mr Zhang's wife, so the word must mean madam, wife.
伙伴/1 | 从小一起长大的朋友 | We grew up together, so the word must mean companion.
小伙子/1 | 二十岁、力气很大的年轻男人 | He is twenty and strong, so the word must mean young fellow.
吵架/1 | 两个人大声说话，谁也不理谁 | They quarrelled and are not speaking, so the word must mean to quarrel.
吵/1 | 外面声音太大，睡不着 | It is too noisy outside to sleep, so the word must mean noisy.
道歉/1 | 做错了，应该说对不起 | You were wrong and should say sorry, so the word must mean to apologise.
安慰/1 | 他很难过，去让他心里好受一点 | He is sad, so we will go and comfort him, and the word must mean to comfort.
陪/1 | 和妈妈一起去医院 | I am going with mother to hospital, so the word must mean to accompany.
照顾/1 | 妈妈病了，在家看着她、帮她 | Mother is ill and I look after her at home, so the word must mean to take care of.
顾客/1 | 来店里买东西的人很多 | The shop has many customers, so the word must mean customer.
打架/1 | 两个孩子在学校动手打 | Two children came to blows at school, so the word must mean to fight.
交给/1 | 把作业给老师 | Homework is handed to the teacher, so the word must mean to hand over to.
交换/1 | 你给我、我给你电话号码 | We swap phone numbers, so the word must mean to exchange.
互联网/1 | 很多人在上面买东西的网 | Many people shop on it, so the word must mean the internet.
解决/1 | 问题很难处理好 | The problem is hard to settle, so the word must mean to solve.
原来/1 | 是你！刚明白过来 | So it was you all along, so the word must mean so it turns out.
原因/1 | 迟到是因为车太多 | Heavy traffic is why he was late, so the word must mean cause.
错误/1 | 句子有一个不对的地方 | The sentence has a mistake in it, so the word must mean error.
联合/1 | 两个学校一起办比赛 | Two schools joined forces to hold a contest, so the word must mean to unite.
大约/1 | 到学校差不多要十分钟 | It takes roughly ten minutes to school, so the word must mean about.
约/1 | 跟朋友说好明天一起爬山 | I arranged with a friend to climb tomorrow, so the word must mean to make an appointment.
熟人/1 | 在这里谁也不认识 | I know nobody here, so the word must mean acquaintance.
熟练/1 | 开了二十年车，开得很好 | He has driven for twenty years and is very skilled, so the word must mean skilled.
成熟/1 | 才十五岁，想事情像大人一样 | He is only fifteen but thinks like an adult, so the word must mean mature.
亲人/1 | 春节时想和家里人在一起 | At New Year everyone wants to be with family, so the word must mean family member.
亲自/1 | 事很重要，要自己去办 | It is important, so I will see to it in person, and the word must mean personally.
亲手/1 | 蛋糕是我用自己的手做的 | I made the cake with my own hands, so the word must mean with one's own hands.
亲眼/1 | 用自己的眼睛看见他拿了书 | I saw him take the book with my own eyes, so the word must mean with one's own eyes.
陪伴/1 | 谢谢你一直在我身边 | Thank you for always being with me, so the word must mean to keep company.
同伴/1 | 和一起去的人爬山 | He climbed with his companions, so the word must mean companion.
舞伴/1 | 一起跳了三年舞的人 | We have danced together for three years, so the word must mean dance partner.
误解/1 | 把我的意思想错了 | You took my meaning wrongly, so the word must mean to misread.
解开/1 | 帮我把结打开 | Please undo this knot for me, so the word must mean to untie.
相互/1 | 好朋友你帮我、我帮你 | Good friends should help each other, so the word must mean mutually.
互助/1 | 邻居们常常互相帮忙 | The neighbours often help one another, so the word must mean mutual aid.
自尊/1 | 别在大家面前说他，“……心” | Do not scold him in public, he has his pride, so the word must mean self-respect.
原地/1 | 别走开，就在这里等 | Do not move, wait right where you are, so the word must mean the same spot.
约定/1 | 说好明天八点见面 | We agreed to meet at eight tomorrow, so the word must mean to agree on.
约好/1 | 已经说定了，明天三点见面 | It is already settled that we meet at three, so the word must mean to have arranged.
歉意/1 | 一次次说对不起，很真诚 | His repeated apologies were sincere, so the word must mean apology.
联系人/1 | 有问题要找的张先生 | Mr Zhang is the person to contact, so the word must mean contact person.
父子/1 | 爸爸和儿子常常一起踢球 | A father and son often play football together, so the word must mean father and son.
母子/1 | 儿子常常回家看妈妈 | The son often visits his mother, so the word must mean mother and son.
母语/1 | 在中国长大，从小说的语言是中文 | Growing up in China, Chinese is my first language, so the word must mean mother tongue.
大叔/1 | 路边卖水果的中年男人 | A middle-aged man is selling fruit by the road, so the word must mean uncle, mister.
亲爱/1 | 给妈妈写生日祝福的开头 | It opens a birthday wish to mother, so the word must mean dear.
父女/1 | 爸爸和女儿一起去旅行 | A father and daughter travelled together, so the word must mean father and daughter.
书架/1 | 把书放回去的地方 | The book goes back onto it, so the word must mean bookshelf.
顾/1 | 只想着玩，忘了作业 | He thought only of playing and forgot homework, so the word must mean to attend to.
交朋友/1 | 认识很多人，喜欢和人做朋友 | He knows many people and likes making friends, so the word must mean to make friends.
互动/1 | 上课时老师和学生你来我往 | Teacher and students interact in class, so the word must mean to interact.
交往/1 | 和他来往了很多年 | I have known and dealt with him for years, so the word must mean to associate with.
陪同/1 | 经理和客人一起参观公司 | The manager showed the guests round, so the word must mean to accompany.
不顾/1 | 大家反对，他还是一个人去了 | He went alone in spite of everyone, so the word must mean regardless of.
回顾/1 | 回头看这一年做的事 | Looking back on the year, we did a lot, so the word must mean to review.
交通/1 | 城市里坐车很方便 | Getting around the city is easy, so the word must mean transport.
联网/1 | 电脑没连上网，网站打不开 | The computer is offline and no site opens, so the word must mean to be networked.
熟/1 | 饭还没好，再等一会儿 | The rice is not cooked yet, so the word must mean cooked.
误/1 | 快走，别赶不上火车 | Hurry or we will miss the train, so the word must mean to miss.
吵醒/1 | 外面的声音让我醒了 | The noise outside woke me up, so the word must mean to wake by noise.
慰问/1 | 新年时去看望生病的同事 | At New Year the manager visits sick colleagues, so the word must mean to express sympathy.
教育/1 | 父母重视孩子的学习和成长 | Parents care about their children's upbringing, so the word must mean education.
教室/1 | 下课了学生走出去的房间 | The students leave it after class, so the word must mean classroom.
教师/1 | 在中学教书的人 | He teaches at a middle school, so the word must mean teacher.
答案/1 | 问题的对的回答是什么 | The question asks what the answer is, so the word must mean answer.
回答/1 | 老师问问题，没有人能说出来 | No one could answer the teacher's question, so the word must mean to answer.
成绩/1 | 学习很努力，考得一直好 | He studies hard and his marks are always good, so the word must mean results.
及格/1 | 只得了五十分，没过 | I got only fifty and failed, so the word must mean to pass.
试卷/1 | 考试结束了，交上来的 | The exam is over and the papers must be handed in, so the word must mean test paper.
年级/1 | 弟弟上小学三…… | My brother is in the third year of primary school, so the word must mean grade.
历史/1 | 北京有三千多年的 | Beijing has over three thousand years of it, so the word must mean history.
教学/1 | 学校重视教课，老师都很好 | The school takes teaching seriously, so the word must mean teaching.
答应/1 | 他说好了明天陪我去医院 | He promised to go to hospital with me, so the word must mean to promise.
答题/1 | 考试时认真回答问题 | In an exam one must answer questions carefully, so the word must mean to answer questions.
及时/1 | 来得正是时候，我正想找人帮忙 | You came just in time, so the word must mean timely.
以及/1 | 书、笔和很多纸 | Books, pens and lots of paper, so the word must mean as well as.
卷子/1 | 老师正在看我们考试的纸 | The teacher is marking our papers, so the word must mean test paper.
级/1 | 通过了中文三……考试 | He passed the level-three Chinese exam, so the word must mean level.
经历/1 | 难忘的旅行，是一次 | The trip was an unforgettable experience, so the word must mean experience.
数学/1 | 考试常常得满分的科目 | He often gets full marks in it, so the word must mean mathematics.
专心/1 | 上课要只想着听讲 | In class one must listen with full attention, so the word must mean attentively.
科学/1 | 喜欢看关于动物和星星的书 | He loves books on animals and stars, so the word must mean science.
学科/1 | 数学是一门 | Mathematics is an important one, so the word must mean subject.
研究/1 | 在大学学习、探索中国历史 | He does research on Chinese history at university, so the word must mean to study, to research.
研究生/1 | 大学毕业后又读了三年 | After graduating he spent three more years as one, so the word must mean graduate student.
毕业/1 | 明年大学读完 | He will finish university next year, so the word must mean to graduate.
专业/1 | 在大学学的是什么 | The question asks what you major in, so the word must mean major.
专门/1 | 书是特地给孩子们看的 | The book is written especially for children, so the word must mean specially.
奖/1 | 唱歌得了一个大的 | He won a big prize for singing, so the word must mean prize.
申请/1 | 想去中国的大学学习，要先提出 | He wants to apply to a Chinese university, so the word must mean to apply.
掌握/1 | 学了一年，已经会了三千个汉字 | After a year he has mastered three thousand characters, so the word must mean to master.
数字/1 | 不要用汉字，用1、2、3写 | Write in figures, not characters, so the word must mean numeral.
分数/1 | 考试出来了，考了九十分 | The exam marks are out and I got ninety, so the word must mean marks.
人数/1 | 班里一共三十个人 | Our class has thirty people, so the word must mean number of people.
次数/1 | 去中国的回数很多 | He has been to China many times, so the word must mean number of times.
毕业生/1 | 今年大学毕业的五千个人 | The university has five thousand graduates this year, so the word must mean graduate.
申请人/1 | 一百个人申请，只能选十个 | A hundred applied and only ten can be chosen, so the word must mean applicant.
得奖/1 | 比赛里我们班三个人拿了奖 | Three from our class won prizes, so the word must mean to win a prize.
研究所/1 | 毕业后工作的、做研究的地方 | He works at a research institute, so the word must mean research institute.
握手/1 | 见面时手拉手问好 | They shook hands on meeting, so the word must mean to shake hands.
答复/1 | 三天以内给你回答 | We will reply within three days, so the word must mean to reply.
回忆/1 | 常常想起小时候的事 | He often recalls his childhood, so the word must mean to recall.
记忆/1 | 爷爷老了，很多事想不起来 | Grandpa is old and forgets things, so the word must mean memory.
背/1 | 不看书说给老师听 | The words must be recited from memory, so the word must mean to memorise.
抄/1 | 不要照着写别人的作业 | Do not copy others' homework, so the word must mean to copy.
抄写/1 | 照着书写十个生词 | Copy the ten words from the book three times, so the word must mean to copy out.
翻译/1 | 把句子变成中文 | Turn the sentence into Chinese, so the word must mean to translate.
翻/1 | 把书打开到第十页 | Turn to page ten, so the word must mean to turn.
解释/1 | 说一下这个词是什么意思 | Please say what the word means, so the word must mean to explain.
例子/1 | 给我说一个，帮助明白 | Could you give me an example, so the word must mean example.
例如/1 | 喜欢很多水果，比如苹果和西瓜 | I like many fruits, such as apples and watermelons, so the word must mean for example.
一段/1 | 在北京住过一些日子 | I lived in Beijing for a while, so the word must mean a period.
篇/1 | “一……作文”，文章的量词 | Compositions are being counted, so the word must be their measure word.
段/1 | 读第二……，文章的一部分 | We read the second paragraph, so the word must mean paragraph.
背后/1 | 不要在别人看不见的地方说人 | Do not talk about people behind their backs, so the word must mean behind someone's back.
背包/1 | 旅行时带的、背在后面的包 | He took a big backpack on the trip, so the word must mean backpack.
翻开/1 | 把书打开，看第五页 | Open the book at page five, so the word must mean to open.
专家/1 | 研究中国历史很深的人 | He is an authority on Chinese history, so the word must mean expert.
科目/1 | 考试考五门课 | The exam covers five subjects, so the word must mean subject.
毕竟/1 | 说到底还是个孩子 | He is only a child after all, so the word must mean after all.
专题/1 | 课只讲春节这一个题目 | The lesson covered one theme, the Spring Festival, so the word must mean special topic.
高级/1 | 学的中文课很难，是最高的 | He is in the hardest, advanced class, so the word must mean advanced.
中级/1 | 学了两年，上中间水平的班 | After two years I am in the middle class, so the word must mean intermediate.
教练/1 | 每天带足球队练习的人 | He trains our football team every day, so the word must mean coach.
例外/1 | 大家都要参加，谁也不能不一样 | Everyone must take part with no exception, so the word must mean exception.
数码/1 | 新买的……相机 | I just bought a digital camera, so the word must mean digital.
教书/1 | 在中学当老师二十年 | He has taught at a middle school for twenty years, so the word must mean to teach.
记忆力/1 | 什么都记得 | He remembers everything, so the word must mean memory.
掌声/1 | 唱完歌，大家拍手 | Everyone clapped when he finished, so the word must mean applause.
专长/1 | 他特别会的是唱歌 | Singing is his strong point, so the word must mean speciality.
示意/1 | 老师用手告诉我们坐下 | The teacher signalled us to sit, so the word must mean to signal.
解答/1 | 老师回答了我们的问题 | The teacher answered our questions, so the word must mean to answer.
例句/1 | 每个生词后面用这个词的句子 | Each new word is followed by a sample sentence, so the word must mean example sentence.
翻页/1 | 看完这一页，换下一页 | Finish this page and turn over, so the word must mean to turn the page.
答对/1 | 你的回答是对的 | You got the answer right, so the word must mean to answer correctly.
讲解/1 | 老师说得很清楚，大家都懂了 | The teacher explained so clearly that all understood, so the word must mean to explain.
学历/1 | 大学毕业，读书读得高 | He has a university degree, so the word must mean education level.
论文/1 | 毕业要写的文章 | He is writing his graduation thesis, so the word must mean thesis.
级别/1 | 在公司里的位子很高 | His rank in the company is high, so the word must mean rank.
科学家/1 | 长大想当的、做研究的人 | He wants to be a scientist when he grows up, so the word must mean scientist.
专用/1 | 房间只给老师用，学生不能进去 | The room is for teachers only, so the word must mean for special use.
答卷/1 | 考完把写好的卷子交给老师 | Hand your answer sheet to the teacher, so the word must mean answer sheet.
得分/1 | 比赛里他得的分最多 | He scored the most points, so the word must mean to score.
握/1 | 用手紧紧地拿着我的手 | He held my hand tightly, so the word must mean to grip.
体育/1 | 可以踢球的课 | It is the class where we can play football, so the word must mean physical education.
数不清/1 | 星星多得数也数不完 | The stars are too many to count, so the word must mean countless.
发育/1 | 孩子长得很高很好 | The child is growing tall and well, so the word must mean to develop.
背景/1 | 照片后面是长城 | The Great Wall is behind us in the photo, so the word must mean background.
及早/1 | 有病要早一点去看医生 | One should see a doctor early when ill, so the word must mean as early as possible.
历史书/1 | 喜欢看，知道很多过去的事 | He loves books about the past, so the word must mean history book.
专车/1 | 公司派车专门送我们去机场 | The firm sends a dedicated car to the airport, so the word must mean special car.
经验/1 | 做了十年这个工作 | He has done this job for ten years, so the word must mean experience.
招聘/1 | 公司正在找新员工 | The company is hiring new staff, so the word must mean to recruit.
工资/1 | 一个月三千块的收入 | He earns three thousand a month, so the word must mean wages.
资料/1 | 在网上找了很多用来参考的东西 | I found a lot of material online, so the word must mean data, material.
老板/1 | 饭馆是他开的 | He owns the restaurant, so the word must mean boss.
领导/1 | 这件事要问上面管我们的人 | We must ask our superiors about this, so the word must mean leader.
聘请/1 | 公司请来三个外国专家工作 | The firm engaged three foreign experts, so the word must mean to hire.
赚钱/1 | 想多挣钱，给父母买大房子 | He wants to earn more to buy his parents a house, so the word must mean to make money.
退休/1 | 爷爷六十岁就不工作了 | Grandpa stopped work at sixty, so the word must mean to retire.
签字/1 | 请在这里写上自己的名字 | Please sign here, so the word must mean to sign.
检验/1 | 产品要先查看合不合格 | Products must be tested before sale, so the word must mean to inspect.
实验/1 | 科学课上做的 | We did one in science class, so the word must mean experiment.
考验/1 | 比赛对我们是很大的 | The match is a big test for us, so the word must mean test, trial.
招手/1 | 在马路对面向我挥手 | He waved to me from across the road, so the word must mean to wave.
黑板/1 | 老师写字的地方 | The teacher wrote on it, so the word must mean blackboard.
带领/1 | 老师领着学生参观工厂 | The teacher led the students round the factory, so the word must mean to lead.
导游/1 | 带我们去景点的人 | He took us to many sights, so the word must mean tour guide.
退/1 | 衣服太小，拿回店里还掉 | The clothes are too small and I want to return them, so the word must mean to return.
签名/1 | 歌手给我写了名字 | The singer gave me an autograph, so the word must mean to autograph.
签证/1 | 去中国以前要办的 | One must get it before going to China, so the word must mean visa.
客户/1 | 他每天打电话的、买东西的人 | He phones many clients every day, so the word must mean client.
用户/1 | 网站有一千万使用的人 | The site has ten million users, so the word must mean user.
销售/1 | 在公司做卖东西的工作 | He works in sales, so the word must mean sales.
生产/1 | 工厂每天做一千辆自行车 | The factory turns out a thousand bicycles a day, so the word must mean to produce.
产品/1 | 公司做的东西质量很好 | The firm's goods are of good quality, so the word must mean product.
质量/1 | 鞋便宜，做得也很好 | The shoes are cheap and well made, so the word must mean quality.
数量/1 | 来旅游的人比去年多 | More tourists came than last year, so the word must mean quantity.
价格/1 | 东西卖得很便宜 | Things here are cheap, so the word must mean price.
值得/1 | 书很好，可以看一看 | The book is good and worth reading, so the word must mean to be worth.
技术/1 | 开车的本领很好 | He drives with great skill, so the word must mean skill, technique.
科技/1 | 有了它在家也能看到全世界 | Thanks to it we see the world from home, so the word must mean technology.
国际/1 | 很多国家的选手参加的比赛 | Contestants from many countries take part, so the word must mean international.
实际/1 | 看起来年轻，真的已经五十岁 | He looks young but is actually fifty, so the word must mean in reality.
企业/1 | 在一家大公司工作 | He works for a big enterprise, so the word must mean enterprise.
工厂/1 | 爸爸在里面每天做自行车 | His father makes bicycles there every day, so the word must mean factory.
材料/1 | 做桌子要用什么东西 | The question asks what the table is made of, so the word must mean material.
制造/1 | 车是中国做出来的 | The car was made in China, so the word must mean to manufacture.
设计/1 | 衣服是她自己画出样子的 | She designed the dress herself, so the word must mean to design.
效果/1 | 药吃了就不疼了 | The medicine stopped the pain at once, so the word must mean effect.
效率/1 | 一天能做完两天的事 | He does two days' work in one, so the word must mean efficiency.
有效/1 | 票一年以内能用 | The ticket is valid for a year, so the word must mean valid.
制作/1 | 蛋糕是他亲手做的 | He made the cake himself, so the word must mean to make.
制定/1 | 公司定下了明年的计划 | The company drew up next year's plan, so the word must mean to formulate.
设备/1 | 医院里用的机器很新 | The hospital's equipment is new, so the word must mean equipment.
产生/1 | 两个人有了误会 | A misunderstanding arose between them, so the word must mean to arise.
作品/1 | 他写的、最有名的 | It is his most famous work, so the word must mean work.
物品/1 | 下车带好自己的东西 | Take your belongings when you get off, so the word must mean belongings.
礼品/1 | 店里卖很多送人的东西 | The shop sells many gifts, so the word must mean gift.
大量/1 | 工厂每天用很多的水 | The factory uses a great deal of water, so the word must mean a large amount.
技术员/1 | 工厂里有技术问题就找的人 | He is the one to ask about technical problems, so the word must mean technician.
价钱/1 | 问衣服要多少钱 | The question asks what the clothes cost, so the word must mean price.
物价/1 | 这几年东西都贵了很多 | Prices have risen a lot in recent years, so the word must mean prices.
半价/1 | 衣服都只要一半的钱 | All the clothes are half price today, so the word must mean half price.
讲价/1 | 在市场买东西可以说少一点钱 | One can haggle at the market, so the word must mean to bargain.
价值/1 | 书很有用，很重要 | The book is of great value, so the word must mean value.
值班/1 | 晚上在单位上班，不能回家 | I am on duty tonight and cannot go home, so the word must mean to be on duty.
技能/1 | 学会一门本领很重要 | Learning a skill matters, so the word must mean skill.
美术/1 | ……馆里看了很多画 | He saw many works in the art gallery, so the word must mean fine arts.
交际/1 | 很会跟人来往，朋友很多 | He is sociable and has many friends, so the word must mean social interaction.
厂长/1 | 工厂里最大的领导 | He runs the factory, so the word must mean factory director.
造成/1 | 大雨带来了很多问题 | The heavy rain caused many problems, so the word must mean to cause.
造句/1 | 用“值得”说一个句子 | Make a sentence with the word given, so the word must mean to make a sentence.
假设/1 | 如果明天下雨 | Suppose it rains tomorrow, so the word must mean to suppose.
身材/1 | 又高又瘦，样子好看 | She is tall and slim, so the word must mean figure.
教材/1 | 学中文用的书 | It is a Chinese textbook, so the word must mean teaching material.
导演/1 | 拍电影时管全部的人 | The film's director is famous, so the word must mean director.
制服/1 | 学生们都穿着学校发的一样的衣服 | The students wear the school uniform, so the word must mean uniform.
退出/1 | 身体不舒服，不再参加比赛 | He felt ill and withdrew from the contest, so the word must mean to withdraw.
领/1 | 每个月十号拿工资 | Wages are collected on the tenth of each month, so the word must mean to receive.
工作量/1 | 这个月要做的事太多，每天加班 | There is so much work this month that he stays late daily, so the word must mean workload.
力量/1 | 大家一起努力就强大了 | Working together makes us strong, so the word must mean strength.
尽量/1 | 我会想办法早点回来 | I will do what I can to come back early, so the word must mean as far as possible.
手术/1 | 医生给他做的、小的治病的事 | The doctor performed a minor operation, so the word must mean operation.
体质/1 | 身体很好，很少生病 | He has a strong constitution and is rarely ill, so the word must mean physique.
产地/1 | 苹果是山东长出来的 | The apples come from Shandong, so the word must mean place of origin.
出产/1 | 这个地方长出很好的茶 | This area produces fine tea, so the word must mean to produce.
售票/1 | 火车站卖票的……处 | The question asks where the ticket office is, so the word must mean to sell tickets.
出售/1 | 房子现在卖，问你想不想买 | The house is for sale, so the word must mean to sell.
签约/1 | 和公司签好了合同，下个月上班 | He signed with the firm and starts next month, so the word must mean to sign a contract.
设计师/1 | 设计衣服的人 | She designs clothes, so the word must mean designer.
招/1 | 饭馆要找两个服务员 | The restaurant wants to hire two waiters, so the word must mean to recruit.
签/1 | 在这里写上你的名字 | Write your name here, so the word must mean to sign.
领先/1 | 比赛快完了，我们队还在前面 | We are still ahead near the end, so the word must mean to lead.
退还/1 | 东西有问题，可以还回去 | Faulty goods can be returned, so the word must mean to return.
合同/1 | 两个公司签的 | Two companies signed one, so the word must mean contract.
资格/1 | 他可以参加比赛 | He is qualified to compete, so the word must mean qualification.
产量/1 | 工厂今年做出来的东西比去年多 | The factory's output is up on last year, so the word must mean output.
商品/1 | 商店里卖的东西很多 | The shop has goods of every kind, so the word must mean goods.
地板/1 | 他把屋里的地打扫干净 | He cleaned the floor, so the word must mean floor.
实际上/1 | 说很忙，其实在家看电视 | He says he is busy but is actually watching TV, so the word must mean in fact.
社会/1 | 大学毕业后去外面工作 | After graduating he will go out into the world to work, so the word must mean society.
社区/1 | 我们住的地方有一个小公园 | Our neighbourhood has a little park, so the word must mean community.
人民/1 | 政府要为大家做事 | The government should serve the people, so the word must mean the people.
农民/1 | 爷爷每天在地里工作 | Grandpa works in the fields every day, so the word must mean farmer.
市民/1 | 城市里的人都喜欢这个公园 | The city's residents love the park, so the word must mean citizen.
居民/1 | 楼里住的人都认识他 | Everyone living in the building knows him, so the word must mean resident.
政府/1 | 决定在这里开一个新公园 | It decided to open a new park here, so the word must mean government.
法律/1 | 国家定的、每个人都要守的 | Everyone must obey the nation's laws, so the word must mean law.
律师/1 | 常常去法院的人 | He often goes to court, so the word must mean lawyer.
警察/1 | 钱包被拿了，马上叫的人 | My wallet was taken and I called them at once, so the word must mean police.
规定/1 | 公司定下每天九点上班 | The company rules that work starts at nine, so the word must mean to stipulate.
规则/1 | 比赛有大家都要守的 | Every game has rules all must follow, so the word must mean rule.
守/1 | 在门口看着，不让人进去 | He stands guard at the door, so the word must mean to guard.
排队/1 | 买票的人很多，一个接一个站好 | Many people are buying tickets and standing in line, so the word must mean to queue.
安排/1 | 明天的事已经准备好了 | I have already arranged tomorrow, so the word must mean to arrange.
广场/1 | 晚上很多人在那里跳舞 | Many people dance there in the evening, so the word must mean square.
广告/1 | 电视上的太多了 | There are too many adverts on TV, so the word must mean advertisement.
公共/1 | 在大家都用的地方不要大声说话 | Do not talk loudly in public places, so the word must mean public.
共同/1 | 我们一样的爱好很多 | We share many hobbies, so the word must mean common.
座位/1 | 车上没有坐的地方了 | There are no seats left on the bus, so the word must mean seat.
堵车/1 | 早上八点路上车走不动 | Traffic jams up at eight in the morning, so the word must mean traffic jam.
堵/1 | 门口被车挡住，出不去 | A car blocks the doorway, so the word must mean to block.
速度/1 | 开车太快了 | He drives too fast, so the word must mean speed.
高速/1 | 走……公路两个小时到北京 | We took the expressway and got there in two hours, so the word must mean expressway.
快速/1 | 城市在很快地变化 | The city is changing rapidly, so the word must mean rapidly.
危险/1 | 在马路上踢球会出事 | Playing football in the road is dangerous, so the word must mean dangerous.
警告/1 | 老师告诉他再迟到就不能上课 | The teacher warned him not to be late again, so the word must mean to warn.
报警/1 | 有人打架，马上告诉警察 | People were fighting and I called the police, so the word must mean to call the police.
减速/1 | 前面有学校，开车要慢下来 | There is a school ahead, so slow down, and the word must mean to slow down.
罚/1 | 开车太快，被警察要了两百块钱 | He was fined two hundred for speeding, so the word must mean to fine.
农业/1 | 人们大多在地里工作 | Most people here farm, so the word must mean agriculture.
农村/1 | 从小在不是城市的地方长大 | He grew up in the countryside, so the word must mean countryside.
村/1 | 这里只有一百个人 | This village has only a hundred people, so the word must mean village.
乡下/1 | 爷爷奶奶住的、空气好的地方 | Grandparents live in the country where the air is good, so the word must mean the countryside.
家乡/1 | 我出生的地方在南方 | My hometown is in the south, so the word must mean hometown.
城镇/1 | 农村的人去城里工作 | Country people go to the towns to work, so the word must mean town.
小镇/1 | 住在山边的一个小地方 | He lives in a small town by the hills, so the word must mean small town.
经济/1 | 国家这几年发展得好 | The country's economy is doing well, so the word must mean economy.
富/1 | 家里有三个房子 | His family owns three houses, so the word must mean rich.
增加/1 | 学中文的人多了很多 | Many more people are learning Chinese, so the word must mean to increase.
减少/1 | 以前骑车的人多，现在少了 | Fewer people cycle now, so the word must mean to decrease.
下降/1 | 天冷了，气温往下走 | The temperature has dropped a lot, so the word must mean to fall.
降低/1 | 商店把价格变低了 | The shop cut its prices, so the word must mean to lower.
增长/1 | 城市变大，人口很快变多 | The population is growing fast, so the word must mean to grow.
增多/1 | 春天来公园的人多了 | More people visit the park in spring, so the word must mean to increase in number.
减轻/1 | 吃了药，病好一些了 | After the medicine his illness eased, so the word must mean to lessen.
降温/1 | 明天要变冷，多穿衣服 | It will turn cold tomorrow, so the word must mean to drop in temperature.
加速/1 | 车子更快地开过去了 | The car sped up past us, so the word must mean to accelerate.
富有/1 | 有很多钱，可是不快乐 | He is wealthy but unhappy, so the word must mean wealthy.
共有/1 | 学校一共有三千名学生 | The school has three thousand students in all, so the word must mean to have in total.
法院/1 | 这件事要去那里解决 | They must settle the matter in court, so the word must mean court.
守法/1 | 每个市民都应该守法律 | Every citizen should obey the law, so the word must mean to be law-abiding.
合法/1 | 生意是法律允许的 | His business is lawful, so the word must mean legal.
方法/1 | 学中文的好路子很多 | There are many good ways to learn Chinese, so the word must mean method.
办法/1 | 问题我没有能力解决 | I have no way to solve the problem, so the word must mean means, way.
想法/1 | 问你有什么好主意 | The question asks for your good idea, so the word must mean idea.
看法/1 | 对这件事你怎么想 | The question asks what you think of it, so the word must mean view.
警车/1 | 一辆警察开的车 | A police car drove up, so the word must mean police car.
观察/1 | 每天仔细看天上的星星 | He studies the stars every night, so the word must mean to observe.
规律/1 | 每天十点睡觉、六点起床 | He keeps the same hours every day, so the word must mean regular pattern.
共享/1 | ……单车，大家都可以骑 | Anyone may ride these shared bikes, so the word must mean shared.
分享/1 | 把蛋糕拿出来和大家一起吃 | He brought out the cake to share with everyone, so the word must mean to share.
一共/1 | 问这些东西加起来多少钱 | The question asks the total cost, so the word must mean altogether.
座/1 | “一……大山”，山的量词 | Mountains are being counted, so the word must be their measure word.
位/1 | “这……是新老师”，人的量词 | A person is being introduced politely, so the word must be the polite measure word.
地位/1 | 在公司里位置很高 | He holds a high position in the company, so the word must mean status.
排/1 | 我坐在第三…… | I sit in the third row, so the word must mean row.
排名/1 | 比赛里他是第五 | He came fifth in the ranking, so the word must mean ranking.
广播/1 | 每天早上听的 | I listen to it every morning, so the word must mean radio broadcast.
单位/1 | 问他在哪个地方工作 | The question asks which work unit he belongs to, so the word must mean work unit.
民间/1 | 中国老百姓中间流传的故事 | It is a Chinese folk tale, so the word must mean folk.
公民/1 | 有中国护照的人 | He holds a Chinese passport, so the word must mean citizen.
选民/1 | 投票选他的人 | Many voters chose him, so the word must mean voter.
罚单/1 | 车停错了地方收到的 | He parked illegally and got a ticket, so the word must mean fine ticket.
警方/1 | 警察那一边正在调查 | The police are investigating, so the word must mean the police.
危害/1 | 喝太多酒对健康不好 | Too much alcohol harms health, so the word must mean to endanger.
规划/1 | 政府为城市做的长远计划 | The government drew up the city's plan, so the word must mean planning.
广大/1 | 很大很宽的草地 | There are vast grasslands here, so the word must mean vast.
排球/1 | 她在学校的一种球队 | She plays on the school volleyball team, so the word must mean volleyball.
守门员/1 | 足球队里守门的人 | He keeps goal for our team, so the word must mean goalkeeper.
降价/1 | 衣服便宜了，去买吧 | The clothes are reduced, so let us buy some, and the word must mean to cut prices.
农场/1 | 家里有很多牛和羊的地方 | His family has a big place with cattle and sheep, so the word must mean farm.
乡村/1 | 空气新鲜、很安静的农村 | The countryside air is fresh and quiet, so the word must mean village, countryside.
富人/1 | 这里住的都是有钱人 | Only the rich live here, so the word must mean rich people.
镇上/1 | 每星期去小镇买东西 | I go into town once a week to shop, so the word must mean in town.
共计/1 | 旅行一共花了五千块 | The trip cost five thousand in total, so the word must mean in total.
危机/1 | 公司遇到大难，很多人没工作 | The firm hit trouble and many lost jobs, so the word must mean crisis.
正规/1 | 要去合规定的医院看病 | You should see a doctor at a proper hospital, so the word must mean regular, proper.
察看/1 | 警察仔细看了房间 | The police inspected the room carefully, so the word must mean to inspect.
法国/1 | 会说法语的人是哪国人 | He speaks French, so the word must mean France.
环境/1 | 有山有水，周围很好 | With hills and water around, the surroundings are fine, so the word must mean environment.
环保/1 | 为了保护环境，少开车 | We drive less to protect the environment, so the word must mean environmental protection.
保护/1 | 要让眼睛不受伤 | We must take care of our eyes, so the word must mean to protect.
污染/1 | 河里的水脏了，不能喝 | The river is polluted and undrinkable, so the word must mean to pollute.
垃圾/1 | 不要放在门口的脏东西 | Do not leave rubbish at the door, so the word must mean rubbish.
资源/1 | 水是很重要的、能用的东西 | Water is a vital resource, so the word must mean resource.
浪费/1 | 不要白白用掉水 | Do not waste water, so the word must mean to waste.
清洁/1 | 城市的路很干净 | The city streets are clean, so the word must mean clean.
保持/1 | 在图书馆一直安静 | Keep quiet in the library, so the word must mean to maintain.
来源/1 | 新闻是从哪里来的 | The question asks where the news came from, so the word must mean source.
水费/1 | 用水要交的钱 | This month's water bill is fifty yuan, so the word must mean water bill.
电费/1 | 常开空调，用电的钱很高 | With the air conditioning on, the electricity bill is high, so the word must mean electricity bill.
塑料/1 | 杯子很轻，用什么做的 | The cup is light because of what it is made of, so the word must mean plastic.
袋子/1 | 买了很多东西，要装起来的 | I bought a lot and need a big bag, so the word must mean bag.
口袋/1 | 手机放在衣服上的…… | He put the phone in his pocket, so the word must mean pocket.
费用/1 | 旅行要多少钱 | The question asks what the trip costs, so the word must mean expense.
花费/1 | 做这件事用了我很多时间 | The job took up a lot of my time, so the word must mean to spend.
清洁工/1 | 每天早上把路上垃圾拿走的人 | They clear the streets every morning, so the word must mean cleaner.
保证/1 | 我说一定明天不迟到 | I promise not to be late tomorrow, so the word must mean to guarantee.
保安/1 | 楼下看门、不让他进来的人 | The guard downstairs would not let him in, so the word must mean security guard.
植物/1 | 公园里有树也有花 | The park has many plants, trees and flowers alike, so the word must mean plant.
森林/1 | 走了一天没见到人的、很多树的地方 | They walked all day in it without seeing anyone, so the word must mean forest.
沙子/1 | 孩子们在海边玩的 | Children play with it on the beach, so the word must mean sand.
沙发/1 | 坐在上面看电视 | He sits on it watching TV, so the word must mean sofa.
雾/1 | 很大，看不清前面的路 | It is so thick that the road ahead cannot be seen, so the word must mean fog.
雾天/1 | 有雾的天气开车要慢 | One must drive slowly on foggy days, so the word must mean foggy day.
火灾/1 | 楼里着火，大家都跑出来 | A fire broke out and everyone ran out, so the word must mean fire disaster.
野生/1 | 不是人养的动物 | There are many wild animals here, so the word must mean wild.
植树/1 | 春天去山上种树 | In spring we go to plant trees on the hill, so the word must mean to plant trees.
野外/1 | 周六去城外大自然里玩 | We go out into the countryside on Saturday, so the word must mean the open country.
地震/1 | 发生时楼都在动 | The buildings shook when it struck, so the word must mean earthquake.
暴雨/1 | 下了一场很大的雨，路上都是水 | A rainstorm left the roads flooded, so the word must mean rainstorm.
风暴/1 | 海上有，船不能出去 | Ships cannot leave because of it at sea, so the word must mean storm.
汽油/1 | 车里没有了，要去加 | The car is out of it and must be filled, so the word must mean petrol.
石油/1 | 国家有很多，经济很好 | The country is rich in it, so the word must mean oil.
煤/1 | 以前冬天用来让房子变暖的 | People once burned it to heat homes, so the word must mean coal.
汽水/1 | 夏天喝的冰的、有气的饮料 | He likes iced fizzy drinks in summer, so the word must mean soda.
暴力/1 | 电视上打人的东西太多，孩子不要看 | There is too much violence on TV for children, so the word must mean violence.
灾难/1 | 地震是一场大的 | The earthquake was a great catastrophe, so the word must mean disaster.
震动/1 | 手机在桌上动了一下 | The phone buzzed on the table, so the word must mean to vibrate.
粮食/1 | 天气好，地里的米和麦子多 | Good weather brought a big harvest of grain, so the word must mean grain.
食物/1 | 冰箱里吃的东西不多了 | There is little food left in the fridge, so the word must mean food.
食品/1 | 商店卖的吃的东西都很新鲜 | The shop's foodstuffs are fresh, so the word must mean foodstuff.
饮食/1 | 常吃水果和菜，吃喝很健康 | He eats fruit and vegetables and has a healthy diet, so the word must mean diet.
死/1 | 小狗不在了，他很难过 | His puppy died and he is sad, so the word must mean to die.
粮店/1 | 去那里买米 | He bought rice there, so the word must mean grain shop.
伤心/1 | 朋友走了，心里很难过 | His friend left and he is heartbroken, so the word must mean sad.
救/1 | 在河里大叫请人帮 | He shouted for help from the river, so the word must mean to save.
救护车/1 | 伤得很重，马上叫的车 | He was badly hurt, so we called an ambulance, and the word must mean ambulance.
伤口/1 | 手上受伤的地方 | There is a small cut on his hand, so the word must mean wound.
洁白/1 | 很白很干净的衣服 | She wears a spotless white dress, so the word must mean pure white.
保温/1 | 杯子里水一直是热的 | The cup keeps water hot, so the word must mean to keep warm.
能源/1 | 少用电和油，多走路 | We should use less energy and walk more, so the word must mean energy.
水源/1 | 城市的水从这条河来 | The river supplies the city's water, so the word must mean water source.
保留/1 | 老房子没有拆，留了下来 | The old house was kept, so the word must mean to preserve.
污水/1 | 工厂的脏水不能放进河里 | Factories may not put dirty water into rivers, so the word must mean sewage.
植树节/1 | 三月去山上种树的节日 | Every March on this day we plant trees, so the word must mean Arbor Day.
沙尘/1 | 春天常有，空气不好 | It often blows in spring and spoils the air, so the word must mean dust.
救火/1 | 着火了，大家都去灭火 | The building is on fire and everyone helps put it out, so the word must mean to fight a fire.
野花/1 | 春天山上自己长的花 | In spring the hills are covered in wild flowers, so the word must mean wild flowers.
灾区/1 | 地震过的地方，给那里送东西 | Many people sent food and clothes to the stricken area, so the word must mean disaster area.
伤员/1 | 医生照顾的受伤的人 | The doctors care for the wounded, so the word must mean the injured.
美食/1 | 城市有名的好吃的东西 | The city has many famous delicacies, so the word must mean fine food.
零食/1 | 小孩子饭前不要吃的东西 | Children should not eat snacks before meals, so the word must mean snacks.
沙拉/1 | 中午吃的、水果做的 | I had only a fruit salad for lunch, so the word must mean salad.
雾气/1 | 早上山里都是白白的 | In the morning the hills are full of mist, so the word must mean mist.
暴风雪/1 | 昨天晚上来的大风大雪，路都堵了 | A blizzard blocked the roads last night, so the word must mean blizzard.
灾害/1 | 地震这样的事 | Earthquakes are among such things here, so the word must mean natural disaster.
野猫/1 | 门口常有的、没有主人的猫 | A stray cat often comes to my door, so the word must mean stray cat.
煤气/1 | 做完饭要关好的 | Turn off the gas after cooking, so the word must mean gas.
救灾/1 | 地震以后去帮忙 | After the quake many went to help with relief, so the word must mean disaster relief.
救人/1 | 医生的工作 | A doctor's job is saving lives, so the word must mean to save lives.
伤害/1 | 他说的话让朋友心里疼 | His words hurt his friend's feelings, so the word must mean to hurt.
食用/1 | 这些野菜可以吃 | These wild herbs are edible, so the word must mean to eat.
费力/1 | 一个人拿大桌子很累 | Carrying the big table alone takes great effort, so the word must mean strenuous.
浪花/1 | 海边很漂亮的白色的水花 | The spray at the seaside is lovely, so the word must mean spray.
浪/1 | 风很大，海上很高的 | The wind is strong and the waves are high, so the word must mean wave.
沙尘暴/1 | 春天北方常有的大风沙 | The north often has sandstorms in spring, so the word must mean sandstorm.
保管/1 | 请帮我看好这个包 | Please look after this bag for me, so the word must mean to keep safe.
死机/1 | 电脑又不动了 | My computer has frozen again, so the word must mean to crash.
网络/1 | 很慢，打不开网页 | It is so slow that pages will not load, so the word must mean network.
软件/1 | 在手机上下载的新程序 | I downloaded a new app to my phone, so the word must mean software.
硬件/1 | 电脑的机器部分很好，软件太老 | The machine side is good but the software old, so the word must mean hardware.
机器/1 | 工厂里有很多 | The factory is full of them, so the word must mean machine.
键盘/1 | 坏了打不了字 | It is broken and I cannot type, so the word must mean keyboard.
屏幕/1 | 手机上看的地方太小，看不清 | The phone's screen is too small to read, so the word must mean screen.
下载/1 | 从网上把电影拿到自己电脑里 | I downloaded a film from the internet, so the word must mean to download.
智能/1 | 很多人用的、能上网的手机 | Many people use smartphones, so the word must mean smart.
删/1 | 不好看的照片不要了 | I deleted the bad photo, so the word must mean to delete.
软/1 | 床睡得很舒服，不硬 | The bed is soft and comfortable, so the word must mean soft.
密码/1 | 忘了，手机打不开了 | I forgot it and cannot unlock my phone, so the word must mean password.
登录/1 | 先进去，才能用这个软件 | You must log in to use the app, so the word must mean to log in.
账号/1 | 在网站上有一个，自己的名字 | I have an account on the site, so the word must mean account.
存/1 | 每个月都留下一点钱 | He saves a little every month, so the word must mean to save.
搜索/1 | 不知道的事上网找一下 | Look up what you do not know online, so the word must mean to search.
充电/1 | 手机没电了 | My phone is flat, so the word must mean to charge.
电池/1 | 手机能用两天 | The phone lasts two days on it, so the word must mean battery.
频道/1 | 电视有一百个 | The TV has a hundred of them, so the word must mean channel.
记录/1 | 把每天花的钱写下来 | He writes down what he spends each day, so the word must mean to record.
登记/1 | 住酒店先写下名字和证件 | One must check in at a hotel first, so the word must mean to register.
程序/1 | 他会写电脑的 | He can write computer programs, so the word must mean program.
系统/1 | 电脑里管全部的东西太老了 | The computer's operating system is out of date, so the word must mean system.
版本/1 | 软件出了新的 | The software has a new version, so the word must mean version.
功能/1 | 手机能做很多事，还可以照相 | The phone has many functions, so the word must mean function.
安装/1 | 在电脑上装了一个新软件 | I installed new software, so the word must mean to install.
修/1 | 车坏了，要让它好起来 | The car is broken and must be fixed, so the word must mean to repair.
卡/1 | 里面没有钱了的银行…… | My card has no money left on it, so the word must mean card.
坏/1 | 手机不能用了 | My phone is broken, so the word must mean broken.
程度/1 | 中文到了很高的水平 | His Chinese has reached a high degree, so the word must mean level, degree.
成功/1 | 试了很多次，最后做到了 | After many tries he succeeded, so the word must mean to succeed.
维修/1 | 电脑要送去修 | The computer must go in for servicing, so the word must mean to maintain, to repair.
修理/1 | 爸爸在把自行车弄好 | Father is mending the bicycle, so the word must mean to repair.
装修/1 | 新房子正在弄地板、墙这些 | Their new home is being fitted out, so the word must mean to decorate.
装满/1 | 杯子里都是水了 | He filled the cup with water, so the word must mean to fill up.
服装/1 | 商店卖女人的衣服 | The shop sells women's clothing, so the word must mean clothing.
卡片/1 | 送给我的、写着生日祝福的 | He gave me a birthday card, so the word must mean card.
信用卡/1 | 问店里能不能刷卡付钱 | The question asks whether the shop takes credit cards, so the word must mean credit card.
功课/1 | 每天先做学校的作业再看电视 | He does his schoolwork before TV, so the word must mean homework.
坏处/1 | 喝太多酒的不好的地方 | Heavy drinking has many disadvantages, so the word must mean harm.
统一/1 | 学生们穿一样的衣服 | The students wear matching clothes, so the word must mean uniform.
录用/1 | 公司要了他 | The company took him on, so the word must mean to employ.
网民/1 | 中国上网的人很多 | China has many internet users, so the word must mean netizen.
存钱/1 | 为了买车，每个月留下钱 | He saves every month for a car, so the word must mean to save money.
登山/1 | 周六去爬山 | We go mountain climbing on Saturday, so the word must mean to climb a mountain.
幕后/1 | 在别人看不到的地方帮忙 | He helped a lot behind the scenes, so the word must mean behind the scenes.
录音/1 | 上课时用手机录下声音 | I record the lesson on my phone, so the word must mean to make a recording.
智力/1 | 孩子很聪明 | The child is very bright, so the word must mean intelligence.
硬/1 | 面包太不软了 | The bread is too hard, so the word must mean hard.
删去/1 | 把文件去掉 | Please delete this file, so the word must mean to delete.
密/1 | 树长得很多很近 | The trees here grow thick, so the word must mean dense.
充电器/1 | 给手机充电用的、忘了带的 | I forgot my phone charger, so the word must mean charger.
视频/1 | 网上看的、好笑的 | He watched a funny video online, so the word must mean video.
登机/1 | 飞机十点起飞，九点半上飞机 | We board at half past nine, so the word must mean to board a plane.
账单/1 | 电话这个月要付一百块 | This month's phone bill is a hundred yuan, so the word must mean bill.
存在/1 | 问题一直都有 | The problem has always existed, so the word must mean to exist.
池子/1 | 公园里有鱼的、小的水池 | There is a pond with fish in the park, so the word must mean pool, pond.
游泳池/1 | 夏天常去那里游泳 | We often swim there in summer, so the word must mean swimming pool.
充满/1 | 房间里都是笑声 | The room is filled with laughter, so the word must mean to be full of.
电器/1 | 冰箱和电视这样的东西 | Fridges and televisions are sold here, so the word must mean electrical appliance.
乐器/1 | 问你会弹奏什么 | The question asks what instrument you play, so the word must mean musical instrument.
程序员/1 | 在电脑公司写程序的人 | He writes software at a computer firm, so the word must mean programmer.
统计/1 | 每个月算一下卖了多少 | Each month the firm totals its sales, so the word must mean to count up.
器材/1 | 学校买的体育用品 | The school bought much sports equipment, so the word must mean equipment.
功夫/1 | 会中国的武术 | He knows Chinese martial arts, so the word must mean kung fu.
用功/1 | 每天看书到很晚 | He studies late every night, so the word must mean diligent.
出版/1 | 书去年印出来卖了 | The book was published last year, so the word must mean to publish.
装/1 | 把衣服放进箱子 | He packed the clothes into the case, so the word must mean to pack.
维护/1 | 大家都要保护公共安全 | Everyone must uphold public safety, so the word must mean to safeguard.
坏事/1 | 从来不做不好的事 | He never does anything wrong, so the word must mean wrongdoing.
卡车/1 | 路上一辆大的、拉东西的车 | There is a big lorry on the road, so the word must mean lorry.
保密/1 | 这件事不要告诉别人 | Please keep this secret, so the word must mean to keep secret.
账户/1 | 银行里有很多钱的…… | His bank account holds a lot of money, so the word must mean account.
坏人/1 | 警察找到的人 | The police caught the villain, so the word must mean bad person.
关键/1 | 学好中文最重要的是多说多练 | Speaking and practising is the key to good Chinese, so the word must mean key.
开幕/1 | 运动会明天开始 | The games open tomorrow, so the word must mean to open, of an event.
字幕/1 | 看外国电影要看下面的字 | I need the captions to watch foreign films, so the word must mean subtitles.
充分/1 | 要做好完全的准备 | We must be fully prepared, so the word must mean full, ample.
功效/1 | 药吃了病就好了 | The medicine is very effective, so the word must mean efficacy.
存放/1 | 房间用来放旧东西 | The room is used to store old things, so the word must mean to store.
硬盘/1 | 照片都存在电脑的…… | My photos are on the computer's hard drive, so the word must mean hard disk.
机器人/1 | 会说话还会走路的机器 | This machine talks and walks, so the word must mean robot.
网速/1 | 上网很快 | The connection here is fast, so the word must mean internet speed.
频率/1 | 一个星期运动三次 | He exercises three times a week, so the word must mean frequency.
卡通/1 | 孩子们都喜欢看的画出来的片子 | Children love cartoons, so the word must mean cartoon.
假装/1 | 听见了，但是装作没听见 | He pretended not to hear, so the word must mean to pretend.
修车/1 | 在一家修汽车的店工作 | He works at a car repair shop, so the word must mean to repair cars.
登上/1 | 他们上了飞机 | They boarded the plane, so the word must mean to board.
序号/1 | 写上你的排第几的号 | Write your serial number here, so the word must mean serial number.
关机/1 | 考试时把手机关掉 | Turn off your phone during the exam, so the word must mean to switch off.
信号/1 | 山里打不了电话 | There is no signal in the hills, so the word must mean signal.
传统/1 | 春节是中国很久以来的节日 | The Spring Festival is a traditional Chinese festival, so the word must mean traditional.
艺术/1 | 常常去看画 | He loves art and often goes to see paintings, so the word must mean art.
京剧/1 | 爷爷喜欢听的、中国的戏 | Grandpa loves Peking opera, so the word must mean Peking opera.
博物馆/1 | 看了很多很老的东西的地方 | We saw many ancient things in it, so the word must mean museum.
展览/1 | 很有意思，来看的人很多 | The exhibition draws crowds, so the word must mean exhibition.
民族/1 | 中国有五十六个 | China has fifty-six of them, so the word must mean ethnic group.
风俗/1 | 每个地方都有自己的习惯 | Every place has its own customs, so the word must mean custom.
古老/1 | 城市有很长的历史 | It is a very old city, so the word must mean ancient.
诗/1 | 喜欢写的、短的、有韵的文字 | He likes writing poems, so the word must mean poem.
传/1 | 把书递给后面的同学 | Pass the book to the person behind, so the word must mean to pass.
艺术家/1 | 一位有名的、搞艺术的人 | He is a famous artist, so the word must mean artist.
剧场/1 | 晚上去看话剧的地方 | We are going to a theatre to see a play, so the word must mean theatre.
电视剧/1 | 妈妈每天晚上在电视上看的戏 | Mother watches TV dramas every evening, so the word must mean TV series.
话剧/1 | 学生们在学校演的戏 | The students put on a play at school, so the word must mean stage play.
展开/1 | 把地图打开放在桌上 | He spread the map out on the table, so the word must mean to unfold.
发展/1 | 城市变化很快，越来越好 | The city is developing fast, so the word must mean to develop.
游览/1 | 我们在古老的城市里到处看 | We toured the ancient city, so the word must mean to tour.
家族/1 | 他们一大家人里有很多医生 | Their clan has many doctors, so the word must mean family, clan.
古诗/1 | 会背很多中国古代的诗 | I can recite many classical Chinese poems, so the word must mean classical poem.
传说/1 | 关于龙的、一代代讲下来的故事 | It is an old tale about the dragon, so the word must mean legend.
古人/1 | 很久以前的人说的话 | People of long ago said this, so the word must mean the ancients.
诗人/1 | 李白是写诗有名的人 | Li Bai was a famous poet, so the word must mean poet.
展出/1 | 博物馆拿出很多老画给人看 | The museum put many old paintings on show, so the word must mean to exhibit.
传真/1 | 现在很少有人用的、用电话线发文件的东西 | Few people still use the fax, so the word must mean fax.
流传/1 | 故事一代代传下来很多年 | The story has been handed down for years, so the word must mean to spread, to be handed down.
俗话/1 | 大家常说的老话 | As the saying goes, seeing once beats hearing a hundred times, so the word must mean common saying.
艺人/1 | 很有名的、唱歌演戏的人 | He is a famous performer, so the word must mean entertainer.
剧本/1 | 他写了一个电影的文本 | He wrote a film script, so the word must mean script.
博客/1 | 每天在网上写的文章 | He writes a blog online every day, so the word must mean blog.
古画/1 | 有一千年的画 | This painting is a thousand years old, so the word must mean ancient painting.
画/1 | 用笔做出一只小猫 | He drew a kitten, so the word must mean to draw.
画家/1 | 画的山水很有名的人 | This painter is famous for landscapes, so the word must mean painter.
琴声/1 | 听到好听的弹琴的声音 | I heard lovely music from a stringed instrument, so the word must mean sound of the qin, piano.
画笔/1 | 买了一支新的、画画用的笔 | He bought a new paintbrush, so the word must mean paintbrush.
演奏/1 | 在音乐会上弹了一个小时 | He performed for an hour at the concert, so the word must mean to perform music.
节奏/1 | 音乐的快慢很快 | The music has a fast beat, so the word must mean rhythm.
龙/1 | 中国传说里会飞的 | In Chinese legend it can fly, so the word must mean dragon.
画画/1 | 我的爱好是用笔画 | My hobby is drawing, so the word must mean to paint.
图画/1 | 书里有很多画 | The book has many pictures, so the word must mean picture.
动画/1 | 孩子们喜欢看的……片 | Children love animated films, so the word must mean animation.
故宫/1 | 北京时参观的、以前皇帝住的地方 | We visited the old palace in Beijing, so the word must mean the Forbidden City.
庙/1 | 山上很老的、拜神的地方 | There is an old temple on the hill, so the word must mean temple.
庙会/1 | 过年时庙里热闹的集会 | At New Year the temple holds a fair, so the word must mean temple fair.
纪念/1 | 拍照片好记住这件事 | We took a photo as a keepsake, so the word must mean commemoration.
纪念品/1 | 在北京买的、带回去留着的东西 | I bought many souvenirs in Beijing, so the word must mean souvenir.
念/1 | 把这段话读给大家听 | Read this passage aloud to everyone, so the word must mean to read aloud.
想念/1 | 很想家乡的朋友 | I miss my friends back home, so the word must mean to miss.
庆祝/1 | 一起为他的生日高兴一下 | We are celebrating his birthday together, so the word must mean to celebrate.
国庆/1 | 十月一日是中国的……节 | October 1st is China's National Day, so the word must mean National Day.
拜年/1 | 春节去爷爷家说新年好 | At New Year we visit grandpa to pay our respects, so the word must mean to pay a New Year call.
礼拜/1 | 下个星期去旅行 | We travel next week, so the word must mean week.
画展/1 | 博物馆这个月有画的展览 | The museum has an art exhibition this month, so the word must mean art exhibition.
纪律/1 | 上课要守的规定 | One must observe discipline in class, so the word must mean discipline.
世纪/1 | 现在是二十一…… | We live in the twenty-first century, so the word must mean century.
年纪/1 | 爷爷的岁数很大了 | Grandpa is very old, so the word must mean age.
念书/1 | 他在北京上学 | He studies in Beijing, so the word must mean to study.
观念/1 | 年轻人和老人想法不一样 | Young and old think differently, so the word must mean concept, outlook.
艺术品/1 | 一件很贵的艺术作品 | It is a costly work of art, so the word must mean work of art.
传播/1 | 网络让新闻很快传开 | The internet spreads news fast, so the word must mean to spread.
民俗/1 | 村子保留了很多老的民间习惯 | The village keeps many old folk customs, so the word must mean folk custom.
龙年/1 | 他是龙的那一年出生的 | He was born in the Year of the Dragon, so the word must mean Year of the Dragon.
舞龙/1 | 春节时很多人在广场上让龙动起来 | At New Year people perform the dragon dance in the square, so the word must mean dragon dance.
喜庆/1 | 红色让人高兴，过年大家喜欢 | Red is festive and loved at New Year, so the word must mean joyous.
古琴/1 | 他喜欢听的、中国很老的琴 | He loves the sound of the guqin, so the word must mean guqin.
传出/1 | 笑声从房间里出来 | Laughter came from the room, so the word must mean to come out, of sound.
展示/1 | 他给大家看自己的画 | He showed everyone his paintings, so the word must mean to display.
习俗/1 | 春节吃饺子是北方的习惯 | Eating dumplings at New Year is a northern custom, so the word must mean custom.
纪念日/1 | 他们结婚的那一天 | Today marks their wedding, so the word must mean anniversary.
古城/1 | 西安是一座老城市 | Xi'an is an ancient city, so the word must mean ancient city.
民歌/1 | 奶奶会唱很多老百姓的歌 | Grandma knows many folk songs, so the word must mean folk song.
诗歌/1 | 喜欢读诗 | He enjoys reading poetry, so the word must mean poetry.
奏乐/1 | 晚会上有人唱歌，有人弹琴 | At the party some sang and some played music, so the word must mean to play music.
剧情/1 | 电影的故事很有意思 | The film's plot is interesting, so the word must mean plot.
画面/1 | 电影看起来很美 | The film's images are beautiful, so the word must mean picture, scene.
剧院/1 | 城里新开的、看戏的地方 | A new theatre has opened in town, so the word must mean theatre.
念头/1 | 想去中国留学的想法 | He had the idea of studying in China, so the word must mean idea.
古怪/1 | 他的脾气很奇怪 | His temper is odd, so the word must mean eccentric.
少数民族/1 | 这个地方住着很多 | Many ethnic minorities live here, so the word must mean ethnic minority.
博览会/1 | 上海办过世界的 | Shanghai hosted a World Expo, so the word must mean exposition.
传来/1 | 远处来了笑声 | Laughter drifted from afar, so the word must mean to come, of sound.
银行/1 | 去存钱的地方 | I go there to deposit money, so the word must mean bank.
付钱/1 | 买东西要先给钱 | One pays before taking goods, so the word must mean to pay.
存款/1 | 他存在银行的钱不多了 | His savings are running low, so the word must mean savings.
打折/1 | 衣服在便宜卖 | The shop's clothes are on sale, so the word must mean to give a discount.
折/1 | 把信叠好放进口袋 | He folded the letter into his pocket, so the word must mean to fold.
扣/1 | 迟到一次就少给他一百块 | Each late arrival costs him a hundred in deductions, so the word must mean to deduct.
人民币/1 | 在中国买东西用的钱 | One pays in China's currency, so the word must mean renminbi.
免费/1 | 博物馆不用买票 | The museum is free, so the word must mean free of charge.
税/1 | 赚得多，交给国家的钱也多 | The more one earns, the more tax one pays, so the word must mean tax.
预习/1 | 上课以前先看课文 | Read the text before class, so the word must mean to prepare a lesson.
付款/1 | 到那边去交钱 | Please go over there to pay, so the word must mean to pay.
额外/1 | 这个服务还要另外交钱 | The service costs extra, so the word must mean additional.
预订/1 | 已经提前订好了酒店 | I have booked the hotel, so the word must mean to reserve.
预报/1 | 天气……说明天下雨 | The weather forecast says rain tomorrow, so the word must mean forecast.
预计/1 | 飞机估计三点到 | The plane is expected at three, so the word must mean to estimate.
货币/1 | 每个国家都有自己的钱 | Every country has its own currency, so the word must mean currency.
硬币/1 | 口袋里有很多一块的钱 | His pocket is full of coins, so the word must mean coin.
折扣/1 | 买两件能便宜一点吗 | The question asks for a discount on two, so the word must mean discount.
免税/1 | 机场里不用交税的……店 | The airport has a duty-free shop, so the word must mean duty-free.
银色/1 | 他买的车是这种颜色 | He bought a silver car, so the word must mean silver.
购物/1 | 周六常去商店买东西 | I often go shopping on Saturdays, so the word must mean to shop.
购买/1 | 在网上买火车票 | You can buy train tickets online, so the word must mean to purchase.
消费/1 | 城市里东西都很贵 | Living costs in the city are high, so the word must mean consumption.
优惠/1 | 学生买票便宜一点 | Students get a discount on tickets, so the word must mean preferential.
名牌/1 | 她只穿有名的牌子的衣服 | She wears only designer labels, so the word must mean famous brand.
牌子/1 | 问手机是哪家公司的 | The question asks what brand your phone is, so the word must mean brand.
货/1 | 商店卖的东西没有了 | The shop is out of stock, so the word must mean goods.
批/1 | “一……新衣服”，一次来的很多 | A batch of new clothes arrived, so the word must mean batch.
快递/1 | 网上买的东西明天送到 | My online order arrives by courier tomorrow, so the word must mean express delivery.
邮件/1 | 每天早上先看电子的信 | I check my email first thing each morning, so the word must mean email.
寄/1 | 通过邮局给妈妈送一个包 | I posted a parcel to my mother, so the word must mean to mail.
邮递员/1 | 每天给我们送信的人 | He brings our letters every day, so the word must mean postman.
地址/1 | 写下你家在哪里 | Write down where your home is, so the word must mean address.
邮票/1 | 寄信要买的、贴在信上的 | One buys it to post a letter, so the word must mean stamp.
邮箱/1 | 放着很多信的箱子 | My mailbox is full of letters, so the word must mean mailbox.
递/1 | 把书拿过来给我 | Please pass me the book, so the word must mean to hand over.
寄存/1 | 把包放在酒店让人看着 | I left my bag at the hotel for safekeeping, so the word must mean to check in, to deposit.
消息/1 | 一个好的、要告诉你的事 | I have good news for you, so the word must mean news.
网址/1 | 网站在网上的地址 | Send me the site's address, so the word must mean web address.
货物/1 | 车上拉的东西很重 | The goods on the lorry are heavy, so the word must mean goods.
实惠/1 | 菜又好又便宜 | The food is good value, so the word must mean good value.
批准/1 | 公司同意他请假 | The firm approved his leave, so the word must mean to approve.
扣子/1 | 衣服上有五个 | The shirt has five buttons, so the word must mean button.
预备/1 | 问大家准备好了没有 | The question asks if everyone is ready, so the word must mean to get ready.
银牌/1 | 比赛里得了第二名的奖牌 | He came second and won silver, so the word must mean silver medal.
付出/1 | 为了比赛用了很多努力 | He put a great deal of effort into the contest, so the word must mean to give, to devote.
消化/1 | 吃得太多，肚子不好受 | Too much food is hard to digest, so the word must mean to digest.
购票/1 | 看电影先买票 | One must buy a ticket first, so the word must mean to buy tickets.
寄信/1 | 信写好了，去邮局 | The letter is written and I am off to post it, so the word must mean to post a letter.
预祝/1 | 提前祝你考试成功 | I wish you success in the exam in advance, so the word must mean to wish in advance.
货架/1 | 上面的东西都卖完了 | The shelves are bare, so the word must mean shelf.
售货员/1 | 问衣服多少钱的店员 | I asked the shop assistant the price, so the word must mean shop assistant.
退货/1 | 衣服太小，拿回店里 | The clothes are too small and I want to return them, so the word must mean to return goods.
免票/1 | 小孩子不用买票 | Children go free, so the word must mean free admission.
预约/1 | 看医生要先约好时间 | One must make an appointment to see a doctor, so the word must mean to make an appointment.
邮寄/1 | 通过邮局把礼物给朋友 | I sent the present by post, so the word must mean to mail.
扣分/1 | 写错字要少给分 | Wrongly written characters lose marks, so the word must mean to lose points.
批发/1 | 只成批地卖，不一个一个卖 | The shop sells only wholesale, so the word must mean wholesale.
交税/1 | 每个公民都要给国家钱 | Every citizen must pay tax, so the word must mean to pay taxes.
预先/1 | 来以前请提前告诉我 | Tell me in advance before you come, so the word must mean beforehand.
银子/1 | 古时候买东西用的 | People once paid with silver, so the word must mean silver.
罚款/1 | 开车太快要交钱 | Speeders are fined, so the word must mean to fine.
递交/1 | 把申请交给学校 | He submitted his application to the school, so the word must mean to submit.
打牌/1 | 爷爷和朋友玩牌 | Grandpa plays cards with friends, so the word must mean to play cards.
车牌/1 | 车上的号码 | The question asks for the car's plate number, so the word must mean licence plate.
税收/1 | 国家收的税用来修路 | Tax revenue pays for roads, so the word must mean tax revenue.
额头/1 | 头前面很热，可能发烧 | His forehead is hot, so the word must mean forehead.
预感/1 | 心里觉得今天会下雨 | I have a hunch it will rain, so the word must mean premonition.
打消/1 | 下雨了，不想去公园了 | The rain made him drop the idea, so the word must mean to give up, of an idea.
货车/1 | 停在门口的拉东西的车 | A lorry is parked at the door, so the word must mean lorry.
网购/1 | 很多人喜欢在网上买东西 | Many people like online shopping, so the word must mean to shop online.
收货/1 | 快递来了，在家拿东西 | The courier came and I signed for the goods, so the word must mean to receive goods.
寄出/1 | 你买的书今天送出去了 | The book you bought was sent today, so the word must mean to send out.
快递员/1 | 把东西送到家门口的人 | He delivered the parcel to my door, so the word must mean courier.
付费/1 | 软件要交钱才能用 | The app must be paid for, so the word must mean to pay a fee.
邮费/1 | 寄这个包要十块 | Posting the parcel costs ten yuan, so the word must mean postage.
品牌/1 | 这个牌子的衣服很贵 | This brand's clothes are dear, so the word must mean brand.
预付/1 | 住酒店先付一半的钱 | The hotel wants half paid in advance, so the word must mean to prepay.
银行卡/1 | 用来付钱的卡 | I paid by bank card, so the word must mean bank card.
订购/1 | 在网上订了一张桌子 | I ordered a table online, so the word must mean to order.
记者/1 | 问了很多人问题的、写新闻的人 | The reporter interviewed many people, so the word must mean reporter.
采访/1 | 记者问运动员问题 | The reporter interviewed the athlete, so the word must mean to interview.
访问/1 | 领导人去美国 | China's leader made a visit to America, so the word must mean to visit.
宣布/1 | 老师告诉大家明天放假 | The teacher announced a holiday tomorrow, so the word must mean to announce.
举行/1 | 运动会在学校开 | The sports meet is held at school, so the word must mean to hold.
首都/1 | 北京是中国的 | Beijing is China's capital, so the word must mean capital.
观众/1 | 剧场里坐满的看戏的人 | The theatre is full of spectators, so the word must mean audience.
战争/1 | 打了五年的仗 | The war lasted five years, so the word must mean war.
争/1 | 大家抢着回答问题 | Everyone vied to answer, so the word must mean to compete.
举手/1 | 有问题把手抬起来 | Raise your hand if you have a question, so the word must mean to raise one's hand.
宣传/1 | 学校在让大家知道要环保 | The school is promoting green habits, so the word must mean to publicise.
布/1 | “这块……很软” | This piece of cloth is soft, so the word must mean cloth.
公布/1 | 成绩明天告诉大家 | The marks are published tomorrow, so the word must mean to make public.
举办/1 | 城市办过世界博览会 | The city hosted a World Expo, so the word must mean to host.
首先/1 | 第一，我要谢谢大家 | First of all, thanks to everyone, so the word must mean first of all.
大众/1 | 给普通人看的书 | It is a book for the general public, so the word must mean the masses.
众人/1 | 听了他的话，大家都笑了 | Everyone laughed at his words, so the word must mean everyone.
争论/1 | 为这件事说了很久，意见不同 | They argued long about it, so the word must mean to dispute.
作者/1 | 写这本书的人 | The book's author is Chinese, so the word must mean author.
举例/1 | 老师用例子说明词的意思 | The teacher gave examples to explain the word, so the word must mean to give an example.
大战/1 | 第二次世界的、打了六年的 | The Second World War lasted six years, so the word must mean great war.
争吵/1 | 常常为小事吵架 | They often quarrel over trifles, so the word must mean to quarrel.
停战/1 | 两个国家终于不打了 | The two countries finally made a truce, so the word must mean to cease fire.
读者/1 | 看这本书的人很多 | The book has many readers, so the word must mean reader.
学者/1 | 一位有名的、做学问的人 | He is a famous scholar, so the word must mean scholar.
爱好者/1 | 非常喜欢足球的人 | He is a football fan, so the word must mean enthusiast.
首相/1 | 日本政府最高的领导 | He is Japan's prime minister, so the word must mean prime minister.
首次/1 | 他第一次来中国 | This is his first visit to China, so the word must mean first time.
采用/1 | 公司用了他的方法 | The company adopted his method, so the word must mean to adopt.
举/1 | 把杯子抬得很高 | He held the cup up high, so the word must mean to raise.
众多/1 | 中国人很多 | China's population is huge, so the word must mean numerous.
访客/1 | 家里来了很多客人 | Many visitors came to the house today, so the word must mean visitor.
分布/1 | 大学在城市东边和西边都有 | The universities are spread across east and west, so the word must mean to be distributed.
战场/1 | 以前打仗的地方 | This was once a battlefield, so the word must mean battlefield.
采/1 | 孩子们在山上摘花 | The children are picking flowers on the hill, so the word must mean to pick.
来访/1 | 欢迎你们来我们这里 | We welcome your visit, so the word must mean to come to visit.
举起/1 | 大家把杯子抬起来干杯 | Everyone raised their glasses, so the word must mean to lift up.
举动/1 | 他做的这件事让大家感动 | What he did moved everyone, so the word must mean act, deed.
首页/1 | 打开网站的第一页 | The site's home page shows the news, so the word must mean home page.
战友/1 | 爷爷以前一起当兵的人 | Grandpa has not seen his old comrades for years, so the word must mean comrade-in-arms.
发布/1 | 公司让大家知道有了新手机 | The company launched a new phone, so the word must mean to release.
首/1 | “一……歌”，歌的量词 | Songs are being counted, so the word must be their measure word.
听众/1 | 广播节目有很多听的人 | The radio show has many listeners, so the word must mean listener.
民众/1 | 政府要听老百姓的意见 | The government should heed the public, so the word must mean the public.
举报/1 | 有人告诉政府工厂污染河水 | Someone reported the factory for polluting, so the word must mean to report.
宣读/1 | 校长在会上读新规定 | The head read out the new rules, so the word must mean to read out.
争光/1 | 在比赛中为国家带来光荣 | He won glory for his country, so the word must mean to win honour for.
采购/1 | 在公司负责买东西 | He handles purchasing for the firm, so the word must mean purchasing.
争气/1 | 孩子很努力，考了第一 | The child did the family proud by coming first, so the word must mean to try to excel.
拜访/1 | 明天去看望一位老师 | I will call on a teacher tomorrow, so the word must mean to pay a visit.
布鞋/1 | 奶奶用布做的鞋 | Grandma made me cloth shoes, so the word must mean cloth shoes.
长者/1 | 我们要尊重年纪大的人 | We should respect our elders, so the word must mean elder.
布告/1 | 门口的、写着明天停电的纸 | A notice at the gate says the power will be off, so the word must mean notice.
冷战/1 | 夫妻三天不说话 | The couple have not spoken for three days, so the word must mean cold war.
争先/1 | 同学们抢着跑出教室 | The students raced each other out, so the word must mean to strive to be first.
选举/1 | 国家明年要选领导人 | The country holds an election next year, so the word must mean election.
布满/1 | 天上都是星星 | The sky is covered in stars, so the word must mean to be covered with.
作战/1 | 在山里打了三天仗 | They fought in the hills for three days, so the word must mean to fight.
前者/1 | 米饭和面条中前面说的那个 | Of rice and noodles I prefer the former, so the word must mean the former.
战后/1 | 战争结束以后城市很快发展 | After the war the city grew quickly, so the word must mean postwar.
习惯/1 | 早起的好…… | He has the good habit of rising early, so the word must mean habit.
养/1 | 家里有一只猫 | His family keeps a cat, so the word must mean to keep, to raise.
营养/1 | 牛奶对身体很有好处 | Milk is very nourishing, so the word must mean nutrition.
熬夜/1 | 常常很晚不睡，白天很累 | He often stays up late and is tired by day, so the word must mean to stay up late.
夜里/1 | 晚上下了一场大雨 | It poured during the night, so the word must mean at night.
肥/1 | 肉太多白的，不想吃 | The meat is too fatty, so the word must mean fatty.
宠物/1 | 他家养的小狗 | His pet is a puppy, so the word must mean pet.
抽烟/1 | 这里不能吸烟 | Smoking is not allowed here, so the word must mean to smoke.
散心/1 | 心情不好，出去走走 | He was low and went out to clear his head, so the word must mean to relax.
减肥/1 | 想变瘦，晚饭吃得很少 | She eats little at dinner to lose weight, so the word must mean to lose weight.
养成/1 | 从小有了看书的习惯 | He formed a reading habit as a child, so the word must mean to form.
夜晚/1 | 晚上的城市很漂亮 | The city is lovely at night, so the word must mean night.
半夜/1 | 很晚很晚才回家 | He came home at midnight, so the word must mean midnight.
熬/1 | 妈妈慢慢煮汤 | Mother is simmering soup for me, so the word must mean to simmer.
肥胖/1 | 太胖对身体不好 | Obesity is bad for health, so the word must mean obesity.
宠/1 | 妈妈太爱孩子，什么都给他买 | Mother spoils the child, so the word must mean to spoil.
抽/1 | 从书包里拿出一本书 | He pulled a book from his bag, so the word must mean to pull out.
烟/1 | 房间里都是，是不是着火了 | The room is full of smoke, so the word must mean smoke.
散/1 | 电影完了，人都走开了 | The film ended and the crowd dispersed, so the word must mean to disperse.
营业/1 | 商店十点以后不开门 | The shop is not open after ten, so the word must mean to do business.
养狗/1 | 妈妈怕狗，家里不能有狗 | Mother fears dogs, so we cannot keep one, and the word must mean to keep a dog.
营地/1 | 晚上在山上睡觉的地方 | We sleep at the camp on the hill, so the word must mean campsite.
宠爱/1 | 最小的孩子，大家都很爱她 | As the youngest she is doted on, so the word must mean to dote on.
夜市/1 | 晚上去吃小吃的市场 | Let us eat snacks at the night market, so the word must mean night market.
烟花/1 | 春节晚上天上都是 | The New Year sky is full of fireworks, so the word must mean fireworks.
抽空/1 | 找时间去看你 | I will find time to visit you, so the word must mean to make time.
解散/1 | 会开完了，大家走吧 | The meeting is over, so dismiss, and the word must mean to dismiss.
分散/1 | 孩子们在公园的不同地方 | The children are scattered across the park, so the word must mean to scatter.
营业员/1 | 很热情的店员 | The shop assistant is very friendly, so the word must mean salesclerk.
保养/1 | 车照顾得很好 | The car is well maintained, so the word must mean to maintain.
夜班/1 | 这个星期晚上上班 | He is on the night shift this week, so the word must mean night shift.
午夜/1 | 工作到半夜十二点 | He works till midnight, so the word must mean midnight.
烟雾/1 | 城市里都是，看不清楼 | Smog hides the buildings, so the word must mean smog.
肥料/1 | 农民给菜地上的 | Farmers spread fertiliser on the fields, so the word must mean fertiliser.
教养/1 | 孩子很有礼貌 | The child is well brought up, so the word must mean upbringing.
养老/1 | 爷爷奶奶住在……院 | Grandparents live in an old people's home, so the word must mean to care for the aged.
散会/1 | 时间到了，会结束 | Time is up, the meeting is over, so the word must mean to adjourn.
懒散/1 | 做事不认真，慢慢的 | He works sluggishly, so the word must mean sluggish.
养育/1 | 父母把我养大 | My parents brought me up, so the word must mean to raise.
夜景/1 | 上海晚上的样子很美 | Shanghai's night view is beautiful, so the word must mean night scene.
宠坏/1 | 奶奶太爱他，他变得不好了 | Grandma spoiled the child, so the word must mean to spoil.
过夜/1 | 太晚了，在我家住一晚 | It is late, so stay the night here, and the word must mean to stay overnight.
经营/1 | 他开着一家小饭馆 | He runs a small restaurant, so the word must mean to run.
国营/1 | 国家开的工厂 | It is a state-run factory, so the word must mean state-run.
抽查/1 | 老师挑几个人的作业看 | The teacher spot-checked some homework, so the word must mean to spot-check.
散开/1 | 警察来了，人们走开了 | When the police came people scattered, so the word must mean to scatter.
肥肉/1 | 不喜欢吃白的肉 | I do not like fatty meat, so the word must mean fat meat.
夜车/1 | 晚上坐的车，早上到上海 | We took the overnight train, so the word must mean night train.
烟酒/1 | 小店卖香烟和酒 | The little shop sells tobacco and alcohol, so the word must mean tobacco and alcohol.
散场/1 | 电影完了，大家走出电影院 | The film ended and everyone left, so the word must mean to end, of a show.
营救/1 | 把山里的三个人救出来 | They rescued three people from the hills, so the word must mean to rescue.
夜色/1 | 晚上的城市很美 | The city is lovely in the night light, so the word must mean night scene.
熬过/1 | 最难的时候都过去了 | They pulled through the hardest times, so the word must mean to endure, to get through.
肥大/1 | 衣服太大了 | The garment is too baggy, so the word must mean loose, baggy.
宠物店/1 | 买小猫的店 | I bought a kitten at the pet shop, so the word must mean pet shop.
抽奖/1 | 在商店抽了一次，得了一个电视 | He won a TV in the shop's draw, so the word must mean to draw a lottery.
养花/1 | 奶奶家里有很多花 | Grandma grows flowers, so the word must mean to grow flowers.
夜间/1 | 晚上也开门 | The shop opens at night too, so the word must mean at night.
惯用/1 | 他常常用的方法 | It is his usual method, so the word must mean habitually used.
散发/1 | 花园里的花有香气出来 | The flowers give off a fragrance, so the word must mean to give off.
`);
