// The dialogues of level 3 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 3, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：你觉得孩子应该从小学外语吗？
男：我不赞成。孩子太小的时候，应该先把中文学好。
女：可是我觉得早一点儿学，以后学得更快。
问：男的为什么不赞成孩子从小学外语？
据：男的说“孩子太小的时候，应该先把中文学好”，这就是他不赞成的理由。 | The man says that while children are small they should first learn Chinese well; that is his reason.
答：他认为应该先学好中文
错：他认为外语没有用 | 男的只说要先学好中文，没有说外语没有用。 | He says only that Chinese should come first, not that foreign languages are useless.
错：他认为学外语太贵 | 对话没有说到学外语的钱。 | The cost of learning is never mentioned.
问：女的有什么看法？
据：女的说“我觉得早一点儿学，以后学得更快”。 | The woman says that learning earlier makes later learning faster.
答：早一点儿学更好
错：晚一点儿学更好 | 她说的是早一点儿学，和晚一点儿正好相反。 | She says earlier, the opposite of later.
错：不用学外语 | 她主张早学，不是不学。 | She wants children to start early, not to skip it.

男：你的新同事怎么样？
女：人很热情，工作也很认真，就是脾气有点儿急。
问：女的觉得新同事哪儿不好？
据：女的说完优点以后说“就是脾气有点儿急”，“就是”后面是缺点。 | After the good points the woman says, "only, a bit short-tempered"; what follows 就是 is the drawback.
答：脾气有点儿急
错：工作不认真 | 她说新同事工作“也很认真”，这是优点。 | She says the colleague works very conscientiously, which is a strength.
错：对人不热情 | 她说新同事“人很热情”，这也是优点。 | She says the colleague is very warm, another strength.

女：昨天你跟你女朋友吵架了？
男：是啊，我忘了她的生日，她很生气。
女：快去跟她道个歉吧，再送她一份礼物。
问：男的女朋友为什么生气？
据：男的说“我忘了她的生日，她很生气”。 | The man says he forgot her birthday, so she is angry.
答：男的忘了她的生日
错：男的跟别人吵架了 | 吵架的是男的和女朋友，不是和别人。 | The quarrel is between him and his girlfriend, not anyone else.
错：男的没给她打电话 | 男的说的是忘了生日，没有说电话。 | He says he forgot her birthday; no phone call is mentioned.
问：女的让男的做什么？
据：女的说“快去跟她道个歉吧，再送她一份礼物”。 | The woman tells him to apologise quickly and give her a present.
答：道歉，再送一份礼物
错：给她打个电话 | 女的让他去道歉、送礼物，没有说打电话。 | She tells him to apologise and give a present, not to phone.
错：请她吃饭 | 女的没有说请她吃饭。 | She says nothing about taking her to dinner.

男：你女儿的成绩怎么样？
女：数学很好，可是历史不太好，她不喜欢背东西。
男：那可以试试别的方法，比如看历史电影。
问：女的女儿哪门课不好？
据：女的说“数学很好，可是历史不太好”。 | The woman says maths is good but history is not.
答：历史
错：数学 | 数学是女儿学得好的课。 | Maths is the subject the daughter does well in.
错：语文 | 对话没有说到语文。 | Chinese class is never mentioned.
问：女儿为什么历史不好？
据：女的说“她不喜欢背东西”，学历史要背很多东西。 | The woman says her daughter does not like memorising, and history asks a lot of it.
答：她不喜欢背东西
错：她不喜欢看电影 | 看历史电影是男的出的主意，没有说女儿不喜欢看电影。 | Watching history films is the man's idea; nothing says she dislikes films.
错：老师教得不好 | 对话没有说到老师。 | The teacher is never mentioned.
问：男的觉得可以怎么做？
据：男的说“可以试试别的方法，比如看历史电影”。 | The man suggests another method, such as watching history films.
答：看历史电影
错：多背书 | 女儿不喜欢背东西，男的要的是别的方法，不是多背。 | She dislikes memorising, and he proposes a different method, not more of it.
错：换一个老师 | 男的没有说换老师。 | He says nothing about changing teachers.

女：听说你们公司在招人？
男：对，我们要招两个销售，你有朋友想来吗？
女：我有个朋友刚毕业，学的就是这个专业。
男：太好了，让他把材料发给我。
问：男的公司要招什么人？
据：男的说“我们要招两个销售”。 | The man says they want to hire two salespeople.
答：销售
错：经理 | 他说的是销售，不是经理。 | He says salespeople, not managers.
错：司机 | 他说的是销售，不是司机。 | He says salespeople, not drivers.
问：女的朋友现在怎么样？
据：女的说“我有个朋友刚毕业”。 | The woman says she has a friend who has just graduated.
答：刚毕业
错：刚换了工作 | 她的朋友刚毕业，还没有工作，谈不上换工作。 | Her friend has just graduated and has no job yet to change.
错：在男的公司工作 | 男的公司正在招人，她的朋友还没有进去。 | The man's firm is still hiring; her friend is not there yet.
问：男的让女的朋友做什么？
据：男的说“让他把材料发给我”。 | The man says to have him send his papers.
答：发材料给他
错：给他打电话 | 男的说的是发材料，不是打电话。 | He says send the papers, not phone.
错：来公司见面 | 男的说的是发材料，没有说来公司见面。 | He says send the papers, not come in to meet.

男：这里不能停车，你没看见那边写着吗？
女：对不起，我只停五分钟，去买杯咖啡。
男：五分钟也不行，警察会罚你的。
问：男的为什么让女的别停车？
据：男的说“这里不能停车，你没看见那边写着吗”。 | The man says parking is not allowed here, and it is written over there.
答：这里不能停车
错：这里车太多 | 男的说的是不能停车，没有说车多。 | He says parking is forbidden, not that there are many cars.
错：咖啡馆关门了 | 女的正要去买咖啡，没有说咖啡馆关门。 | She is about to buy coffee; nothing says the café is closed.
问：女的停车要做什么？
据：女的说“我只停五分钟，去买杯咖啡”。 | The woman says she will stop only five minutes to buy a coffee.
答：买咖啡
错：找警察 | 警察是男的说会罚她的人，她不是去找警察。 | The police are who the man says will fine her; she is not looking for them.
错：吃早饭 | 她说的是买咖啡，没有说吃早饭。 | She says coffee, not breakfast.

女：你为什么选择坐火车，不坐飞机？
男：坐火车虽然慢一点儿，但是可以看看外面的景色，而且比飞机便宜。
问：男的为什么选择坐火车？
据：男的说坐火车“可以看看外面的景色，而且比飞机便宜”，两个理由都在这句话里。 | The man says the train lets him see the scenery and is cheaper than flying; both reasons are in that sentence.
答：能看景色，也更便宜
错：比飞机快，也更便宜 | 男的说火车“慢一点儿”，不是比飞机快。 | He says the train is a little slower, not faster.
错：能看景色，也更舒服 | 他说的第二个理由是便宜，没有说舒服。 | His second reason is the price, not comfort.

男：你弟弟性格怎么样？
女：他很聪明，也很有耐心，就是有点儿懒，不喜欢运动。
问：女的弟弟有什么缺点？
据：女的说“就是有点儿懒，不喜欢运动”，“就是”后面是缺点。 | The woman says, "only he is a bit lazy and doesn't like exercise"; what follows 就是 is the flaw.
答：有点儿懒
错：不聪明 | 女的说弟弟“很聪明”，这是优点。 | She says he is clever, a strength.
错：没有耐心 | 女的说弟弟“很有耐心”，这也是优点。 | She says he is very patient, another strength.
问：女的弟弟不喜欢什么？
据：女的说“不喜欢运动”。 | The woman says he does not like exercise.
答：运动
错：看书 | 对话没有说到看书。 | Reading is never mentioned.
错：学习 | 对话没有说他不喜欢学习，只说他聪明。 | Nothing says he dislikes study; she only says he is clever.

女：这个星期六你做什么？
男：我要去看我叔叔阿姨，他们刚搬到乡下。
女：远吗？
男：开车要两个小时，我陪我父母一起去。
问：男的星期六要去看谁？
据：男的说“我要去看我叔叔阿姨”。 | The man says he is going to see his uncle and aunt.
答：叔叔阿姨
错：父母 | 父母是跟他一起去的人，不是他要去看的人。 | His parents go with him; they are not the ones he visits.
错：爷爷奶奶 | 对话没有说到爷爷奶奶。 | Grandparents are never mentioned.
问：男的跟谁一起去？
据：男的说“我陪我父母一起去”。 | The man says he will go with his parents.
答：父母
错：叔叔阿姨 | 叔叔阿姨是他要去看的人，不是一起去的人。 | His uncle and aunt are the ones he visits, not his companions.
错：一个人去 | 他说陪父母一起去，不是一个人去。 | He goes with his parents, not alone.
问：去那里要多长时间？
据：男的说“开车要两个小时”。 | The man says it is two hours by car.
答：开车两个小时
错：坐火车两个小时 | 他说的是开车，不是坐火车。 | He says by car, not by train.
错：开车半个小时 | 他说的是两个小时，不是半个小时。 | He says two hours, not half an hour.

男：老师，这次考试我没及格，还有机会吗？
女：下个月还有一次考试，你好好准备吧。
问：男的这次考得怎么样？
据：男的说“这次考试我没及格”。 | The man says he failed this exam.
答：没及格
错：考得很好 | 没及格就不是考得很好。 | Failing is the opposite of doing well.
错：没参加 | 他说自己没及格，说明他参加了考试。 | Saying he failed shows he did sit it.
问：男的什么时候还能考？
据：老师说“下个月还有一次考试”。 | The teacher says there is another exam next month.
答：下个月
错：下个星期 | 老师说的是下个月，不是下个星期。 | She says next month, not next week.
错：明年 | 老师说的是下个月，不是明年。 | She says next month, not next year.

女：你们的产品质量很好，就是价格有点儿高。
男：如果您买得多，我们可以便宜一点儿。
女：那我先买五百个，你给我什么价格？
男：每个便宜两块钱，怎么样？
问：女的觉得产品怎么样？
据：女的说“质量很好，就是价格有点儿高”：质量好，可是贵。 | The woman says the quality is good, only the price is a bit high: good but dear.
答：质量好，可是贵
错：质量不好，可是便宜 | 她说质量很好，不是不好；也没有说便宜。 | She says the quality is good, and never that it is cheap.
错：质量好，也便宜 | 她说价格有点儿高，不是便宜。 | She says the price is high, not low.
问：男的为什么愿意便宜一点儿？
据：男的说“如果您买得多，我们可以便宜一点儿”。便宜的条件是买得多。 | The man says if she buys a lot, they can lower the price; buying in quantity is the condition.
答：女的买得多
错：产品质量不好 | 女的自己说质量很好，男的降价不是因为质量。 | She herself says the quality is good, so the discount is not about quality.
错：女的是他朋友 | 对话没有说他们是朋友。 | Nothing says they are friends.
问：每个便宜多少钱？
据：男的说“每个便宜两块钱”。 | The man says two kuai off each.
答：两块
错：一块 | 他说的是两块，不是一块。 | He says two kuai, not one.
错：二十块 | 他说的是两块，没有“十”。 | He says two kuai, with no 十.

男：现在很多城市都有共享单车，你用过吗？
女：用过，很方便。可是有人用完以后不放好，把车停在路中间。
男：是啊，停错地方的人应该被罚。
问：女的觉得共享单车怎么样？
据：女的说“用过，很方便”。 | The woman says she has used them and they are very convenient.
答：很方便
错：很危险 | 女的没有说危险。 | She does not say they are dangerous.
错：太贵了 | 女的没有说价钱。 | She says nothing about price.
问：女的说有什么问题？
据：女的说“有人用完以后不放好，把车停在路中间”。 | The woman says some people leave the bikes in the middle of the road.
答：有人把车停在路中间
错：共享单车太少 | 她没有说车太少。 | She does not say there are too few bikes.
错：共享单车太旧了 | 她没有说车旧。 | She does not say the bikes are old.

女：我觉得在家工作比在办公室好，不用每天堵车。
男：我不同意，在家工作很难跟同事交流。
问：男的为什么不喜欢在家工作？
据：男的说“在家工作很难跟同事交流”。 | The man says working from home makes it hard to talk with colleagues.
答：不方便跟同事交流
错：每天要堵车 | 每天堵车是在办公室上班的问题，女的说在家工作就不用堵车。 | Daily traffic is the trouble with the office; the woman says working from home avoids it.
错：家里太吵了 | 男的没有说家里吵。 | He does not say home is noisy.
问：女的觉得在家工作有什么好处？
据：女的说在家工作“不用每天堵车”。 | The woman says that at home there is no daily traffic.
答：不用每天堵车
错：可以多睡觉 | 她没有说多睡觉。 | She says nothing about extra sleep.
错：跟同事交流方便 | 跟同事交流是男的说的在家工作的难处，不是好处。 | Talking to colleagues is the man's objection, not an advantage.

男：你跟你的室友关系怎么样？
女：很好，她很细心，常常帮我。我们已经是好朋友了。
问：女的室友是一个怎么样的人？
据：女的说“她很细心，常常帮我”。 | The woman says her roommate is careful and often helps her.
答：细心，常常帮女的
错：粗心，常常帮女的 | 女的说的是细心，和粗心正好相反。 | She says careful, the opposite of careless.
错：细心，可是不爱说话 | 她说室友常常帮她，没有说不爱说话。 | She says the roommate helps her often; nothing says she is quiet.

女：你为什么想换工作？
男：现在的工作太忙了，经常加班，工资也不高。
问：男的为什么想换工作？
据：男的说“现在的工作太忙了，经常加班，工资也不高”。 | The man says his job is too busy, with frequent overtime, and the pay is low.
答：太忙，工资也低
错：太忙，可是工资高 | 他说工资“也不高”，不是高。 | He says the pay is not high.
错：离家太远 | 对话没有说到离家远。 | Distance from home is never mentioned.

男：请问，图书馆里可以吃东西吗？
女：不可以，只能喝水。您可以去一层的咖啡馆吃。
问：在图书馆里能做什么？
据：女的说“不可以，只能喝水”。 | The woman says no eating; only water is allowed.
答：喝水
错：吃东西 | 男的问能不能吃东西，女的说“不可以”。 | He asks about eating, and she says no.
错：喝咖啡 | 咖啡馆在一层，图书馆里只能喝水。 | The café is on the ground floor; in the library only water is allowed.
问：女的让男的去哪儿吃东西？
据：女的说“您可以去一层的咖啡馆吃”。 | The woman says he can eat at the café on the ground floor.
答：一层的咖啡馆
错：二层的咖啡馆 | 她说的是一层，不是二层。 | She says the ground floor, not the next one up.
错：图书馆外边 | 她说的是一层的咖啡馆，没有说图书馆外边。 | She names the café on the ground floor, not outside.

女：你毕业以后想做什么？
男：我想出国读研究生。
女：那你得先把外语学好。
问：男的毕业以后想做什么？
据：男的说“我想出国读研究生”，读研究生就是继续读书。 | The man says he wants to go abroad for graduate study, which is further study.
答：出国读书
错：找工作 | 他想继续读书，没有说找工作。 | He wants to keep studying, not to find a job.
错：当老师 | 他没有说当老师。 | He does not say he wants to teach.
`,
  },
  {
    unit: 12,
    data: `
男：商店现在不免费给塑料袋了？
女：对，为了保护环境，塑料袋要花钱买。你最好自己带个包。
问：商店为什么不免费给塑料袋了？
据：女的说“为了保护环境，塑料袋要花钱买”。 | The woman says bags now cost money to protect the environment.
答：为了保护环境
错：塑料袋太贵了 | 女的说的原因是保护环境，不是塑料袋贵。 | The reason she gives is the environment, not the cost of bags.
错：商店没有塑料袋了 | 塑料袋还有，只是要花钱买。 | There are still bags; they just cost money.
问：女的让男的怎么做？
据：女的说“你最好自己带个包”。 | The woman says he had better bring his own bag.
答：自己带个包
错：买一个塑料袋 | 她说最好自己带包，不是买塑料袋。 | She suggests bringing a bag, not buying one.
错：去别的商店 | 她没有说去别的商店。 | She does not suggest another shop.

女：我的手机太慢了，打开一个软件要等很久。
男：可能是存的照片太多了，你删一些吧。
女：都是我孩子的照片，我不想删。
男：那你把照片存到电脑里。
问：女的手机有什么问题？
据：女的说“我的手机太慢了，打开一个软件要等很久”。 | The woman says her phone is too slow; an app takes ages to open.
答：太慢了
错：没有电了 | 她没有说没电。 | She does not say the battery is flat.
错：打不开了 | 软件能打开，只是要等很久。 | The apps do open; they just take a long time.
问：男的认为手机慢是因为什么？
据：男的说“可能是存的照片太多了”。 | The man says it may be because too many photos are stored.
答：照片太多
错：软件太旧 | 男的没有说软件旧。 | He does not say the apps are old.
错：手机太旧 | 男的没有说手机旧。 | He does not say the phone is old.
问：男的最后让女的怎么做？
据：女的不想删照片，男的最后说“那你把照片存到电脑里”。 | She will not delete the photos, so he finally says to move them to a computer.
答：把照片存到电脑里
错：删一些照片 | 删照片是男的先说的，女的不想删，他就换了办法。 | Deleting was his first idea; she refused, so he changed it.
错：买一个新手机 | 对话没有说买新手机。 | A new phone is never mentioned.

男：这个星期六博物馆有一个中国画的展览，你想去吗？
女：想去！我非常喜欢中国画。要买票吗？
男：不用，免费的。
问：男的请女的去看什么？
据：男的说博物馆有“一个中国画的展览”，问她想不想去。 | The man says the museum has an exhibition of Chinese painting and asks if she wants to go.
答：中国画展览
错：中国电影 | 他说的是中国画，不是电影。 | He says Chinese painting, not a film.
错：京剧 | 他说的是中国画展览，不是京剧。 | He says a painting exhibition, not Peking opera.
问：票多少钱？
据：女的问要不要买票，男的说“不用，免费的”。 | Asked if tickets are needed, the man says no, it is free.
答：不要钱
错：五十块 | 对话没有说五十块，展览是免费的。 | Fifty is never said; it is free.
错：二十块 | 对话没有说二十块，展览是免费的。 | Twenty is never said; it is free.

女：这件大衣原来一千二，现在打八折。
男：八折是多少？
女：九百六十块。
男：还是有点儿贵，我们再看看别的。
问：大衣现在多少钱？
据：女的说原来一千二，打八折以后是“九百六十块”。 | The woman says it was 1,200 and is now 960 at twenty per cent off.
答：九百六十块
错：一千二百块 | 一千二百块是原来的价钱。 | 1,200 is the old price.
错：八百块 | 八百块录音里没有说，八折以后是九百六十块。 | Eight hundred is never said; with the discount it is 960.
问：男的觉得大衣怎么样？
据：男的说“还是有点儿贵，我们再看看别的”。 | The man says it is still a bit dear and they should look at others.
答：还是有点儿贵
错：很便宜 | 他说“还是有点儿贵”，不是便宜。 | He says it is still dear, not cheap.
错：不好看 | 他嫌的是价钱，没有说不好看。 | His complaint is the price, not the look.

男：你看新闻了吗？昨天南方发生了地震。
女：看了，听说死伤的人不多，很多人去帮忙救人了。
问：昨天南方发生了什么？
据：男的说“昨天南方发生了地震”。 | The man says there was an earthquake in the south yesterday.
答：地震
错：暴雨 | 他说的是地震，不是暴雨。 | He says an earthquake, not a rainstorm.
错：大雪 | 他说的是地震，不是大雪。 | He says an earthquake, not heavy snow.
问：女的听说了什么？
据：女的说“听说死伤的人不多”。 | The woman says she heard that few were killed or hurt.
答：死伤的人不多
错：死伤的人很多 | 她说的是“不多”，和很多相反。 | She says few, the opposite of many.
错：没有人去帮忙 | 她说“很多人去帮忙救人了”。 | She says many people went to help.

女：你最近怎么瘦了这么多？
男：我不再熬夜了，每天十一点睡觉，早上起来跑半个小时，也少吃肉了。
问：男的最近有什么变化？
据：女的问“你最近怎么瘦了这么多”，男的接着说了瘦下来的办法。 | The woman asks why he has got so much thinner, and he explains how.
答：瘦了很多
错：胖了很多 | 女的说的是瘦了，和胖了相反。 | She says thinner, the opposite of fatter.
错：经常熬夜 | 男的说“我不再熬夜了”。 | He says he no longer stays up late.
问：男的现在每天几点睡觉？
据：男的说“每天十一点睡觉”。 | The man says he goes to bed at eleven every day.
答：十一点
错：十二点 | 他说的是十一点，不是十二点。 | He says eleven, not twelve.
错：十点 | 他说的是十一点，不是十点。 | He says eleven, not ten.
问：男的早上做什么？
据：男的说“早上起来跑半个小时”。 | The man says he runs for half an hour in the morning.
答：跑半个小时
错：跑一个小时 | 他说的是半个小时，不是一个小时。 | He says half an hour, not an hour.
错：去游泳 | 他说的是跑步，没有说游泳。 | He says running, not swimming.

男：今天雾这么大，空气很不好吧？
女：是啊，你今天最好别出去跑了。
问：今天天气怎么样？
据：男的说“今天雾这么大”，女的说“是啊”。 | The man says the fog is so thick today, and the woman agrees.
答：雾很大
错：雨很大 | 他说的是雾，不是雨。 | He speaks of fog, not rain.
错：风很大 | 他说的是雾，不是风。 | He speaks of fog, not wind.
问：女的让男的怎么做？
据：女的说“你今天最好别出去跑了”。 | The woman says he had better not go out running today.
答：今天别出去跑
错：戴上帽子出门 | 她让他别出去，没有说戴帽子出门。 | She tells him not to go out, not to go out in a hat.
错：去公园跑 | 她让他今天别出去跑，去公园跑也是出去跑。 | She says not to go out running, and running in the park is going out.

女：你在网上买的东西到了吗？
男：还没有，快递说明天才能送到。
女：网上购物虽然方便，可是有时候太慢了。
问：男的东西什么时候到？
据：男的说“快递说明天才能送到”。 | The man says the courier says it will come only tomorrow.
答：明天
错：今天 | 男的说“还没有”到，今天到不了。 | He says it has not come, and it will not today.
错：后天 | 他说的是明天，不是后天。 | He says tomorrow, not the day after.
问：女的觉得网上购物怎么样？
据：女的说“网上购物虽然方便，可是有时候太慢了”。 | The woman says online shopping is convenient but sometimes too slow.
答：方便，可是有时候慢
错：方便，也很快 | 她说有时候太慢，不是很快。 | She says it is sometimes too slow, not fast.
错：不方便，也很慢 | 她说网上购物方便，不是不方便。 | She says it is convenient.

男：你知道这个网站的密码吗？我忘了。
女：你可以用手机号码重新登录。
问：男的有什么问题？
据：男的说“你知道这个网站的密码吗？我忘了”。 | The man says he has forgotten the website's password.
答：忘了密码
错：忘了手机号码 | 女的让他用手机号码登录，说明他记得手机号码。 | She tells him to log in with his phone number, so he knows it.
错：网站打不开 | 他问的是密码，没有说网站打不开。 | He asks about the password; nothing says the site will not open.
问：女的让男的怎么办？
据：女的说“你可以用手机号码重新登录”。 | The woman says he can log in again with his phone number.
答：用手机号码重新登录
错：重新买一个手机 | 她说的是用手机号码，不是买手机。 | She says use his phone number, not buy a phone.
错：给网站打电话 | 她没有说给网站打电话。 | She does not say to call the website.

女：中秋节的时候，你们家一般做什么？
男：一家人一起吃饭、吃月饼，晚上还看月亮。
问：男的家中秋节晚上做什么？
据：男的说“晚上还看月亮”。 | The man says that in the evening they also look at the moon.
答：看月亮
错：看电视 | 对话没有说到电视。 | Television is never mentioned.
错：出去旅游 | 男的说一家人一起吃饭，没有说出去旅游。 | He says the family eats together, not that they travel.

男：你好，我想用银行卡付款。
女：对不起，我们这里不能用银行卡，可以用手机付。
男：好，那我用手机吧。
问：男的最后怎么付款？
据：女的说不能用银行卡，男的说“那我用手机吧”。 | The woman says cards are not accepted, so the man says he will pay by phone.
答：用手机
错：用银行卡 | 这里不能用银行卡，他才改用手机。 | Cards are not accepted, which is why he switches to his phone.
错：不付了 | 他说“好，那我用手机吧”，还是付了。 | He says he will use his phone, so he does pay.

女：你家的猫真可爱！你每天都要照顾猫吧？
男：对，养宠物很花时间，但是猫让我很开心。
问：男的觉得养宠物怎么样？
据：男的说“养宠物很花时间，但是猫让我很开心”。 | The man says pets take a lot of time, but the cat makes him happy.
答：花时间，但是让人开心
错：不花时间，也很开心 | 他说“很花时间”，不是不花时间。 | He says it takes a lot of time.
错：花时间，也不开心 | 他说猫让他很开心，不是不开心。 | He says the cat makes him happy.

男：今天有记者来采访我们公司。
女：采访什么？
男：我们新做的电子产品，听说明天电视上就会播。
问：记者来做什么？
据：男的说“今天有记者来采访我们公司”。 | The man says reporters are coming to interview his company today.
答：采访男的公司
错：买电子产品 | 记者是来采访的，不是来买产品的。 | The reporters come to interview, not to buy.
错：找工作 | 对话没有说找工作。 | Job hunting is never mentioned.
问：采访什么时候在电视上播？
据：男的说“听说明天电视上就会播”。 | The man says he hears it will be on television tomorrow.
答：明天
错：今天晚上 | 记者今天才来采访，男的说的是明天播。 | The interview is today; he says it airs tomorrow.
错：下个星期 | 他说的是明天，不是下个星期。 | He says tomorrow, not next week.

女：你们小区的垃圾要分开放吗？
男：要，吃的东西、纸和塑料都要分开，放错了还会被罚。
问：在男的小区，垃圾放错了会怎么样？
据：男的说“放错了还会被罚”。 | The man says putting it in the wrong place will get you fined.
答：会被罚
错：没关系 | 会被罚就不是没关系。 | A fine means it is not all right.
错：会被送回家 | 他说的是被罚，没有说被送回家。 | He says fined, not sent home.

男：现在的孩子都离不开手机，我儿子每天玩三四个小时。
女：时间太长了，对眼睛不好。你应该跟他约定一个时间。
问：女的认为孩子每天玩手机怎么样？
据：女的说“时间太长了，对眼睛不好”。 | The woman says it is too long and bad for the eyes.
答：时间太长，对眼睛不好
错：时间不长，没关系 | 她说“时间太长了”，不是不长。 | She says it is too long.
错：对学习有帮助 | 她说对眼睛不好，没有说对学习有帮助。 | She says it harms the eyes, not that it helps study.
问：男的儿子每天玩多长时间手机？
据：男的说“我儿子每天玩三四个小时”。 | The man says his son plays three or four hours a day.
答：三四个小时
错：一两个小时 | 他说的是三四个小时，不是一两个。 | He says three or four hours, not one or two.
错：七八个小时 | 他说的是三四个小时，不是七八个。 | He says three or four hours, not seven or eight.

女：医生让你别抽烟，你怎么还抽？
男：我已经抽得很少了，一天只抽两支。
女：两支也对身体不好。
问：男的现在一天抽几支烟？
据：男的说“一天只抽两支”。 | The man says he smokes only two a day.
答：两支
错：一支也不抽 | 他说还抽两支，不是一支也不抽。 | He says he still smokes two, not none.
错：二十支 | 他说的是两支，没有“十”。 | He says two, with no 十.
问：谁让男的别抽烟？
据：女的说“医生让你别抽烟”。 | The woman says, "The doctor told you not to smoke."
答：医生
错：他的孩子 | 对话没有说到他的孩子。 | His children are never mentioned.
错：他的同事 | 对话没有说到他的同事。 | His colleagues are never mentioned.

男：你学中文多久了？我听你说得很好。
女：三年了。我还喜欢读古诗，虽然有点儿难，但是很美。
问：女的喜欢读什么？
据：女的说“我还喜欢读古诗”。 | The woman says she also likes reading classical poems.
答：古诗
错：小说 | 她说的是古诗，不是小说。 | She says classical poems, not novels.
错：新闻 | 她说的是古诗，不是新闻。 | She says classical poems, not the news.
问：女的学中文多长时间了？
据：男的问学了多久，女的答“三年了”。 | Asked how long she has studied, the woman says three years.
答：三年
错：两年 | 她说的是三年，不是两年。 | She says three years, not two.
错：半年 | 她说的是三年，不是半年。 | She says three years, not half a year.

女：这个月我又花了很多钱，都是在网上买衣服。
男：你应该少买点儿，存一些钱。
问：女的钱花在哪儿了？
据：女的说“都是在网上买衣服”。 | The woman says it all went on clothes online.
答：在网上买衣服
错：在网上买吃的 | 她说的是衣服，不是吃的。 | She says clothes, not food.
错：出去旅游 | 她说的是在网上买衣服，没有说旅游。 | She says online clothes, not travel.
`,
  },
];
