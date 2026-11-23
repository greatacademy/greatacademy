// The clues of the gap sentences of the level 8 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelEightClues are the clues of the gap sentences of the level 8 words, by clueKey, each word's sentence counted as 1. */
export const levelEightClues = parseClues(`
街坊/1 | 在胡同住二十年都很熟的人 | After twenty years in the same hutong the speaker knows the people living nearby well, so the word must mean neighbours.
左邻右舍/1 | 有困难都找热心的王大妈 | Everyone living around Aunt Wang turns to her when in trouble, so the word must mean neighbours on all sides.
挨家挨户/1 | 一家一家通知明天停水 | Community workers tell every household in turn about tomorrow's water cut, so the word must mean from house to house.
业主/1 | 楼里的房主开会讨论装电梯 | The people who own flats in the building meet to discuss a lift, so the word must mean property owner.
坊间/1 | 民间流传老桥的故事 | Stories about the old bridge are passed around among ordinary people, so the word must mean in the streets.
牌坊/1 | 村口刻着大字的石门 | A stone structure with large carved characters stands at the village entrance, so the word must mean memorial archway.
远亲不如近邻/1 | 半夜邻居送孩子去医院 | A neighbour, not a relative, drove the feverish child to hospital at midnight, so the word must mean a near neighbour is better than a distant relative.
守望相助/1 | 谁家有事大家都来帮忙 | Whenever a family has trouble, everyone comes to help, so the word must mean to keep watch and help one another.
热心肠/1 | 常帮邻居修自行车 | Uncle Li often mends the neighbours' bicycles, so the word must mean warm-hearted person.
社区服务/1 | 中心为老人理发送饭 | The centre cuts old people's hair and brings them meals, so the word must mean community service.
携手/1 | 两个社区一起办活动 | The two communities ran a book swap together, so the word must mean to join hands.
给予/1 | 学校给学生帮助和鼓励 | The school offered the student much help and encouragement, so the word must mean to give.
赋予/1 | 法律给每个公民受教育的权利 | The law grants every citizen the right to education, so the word must mean to endow.
支撑/1 | 几根木头撑着旧房子 | A few wooden posts hold up the old house, so the word must mean to support.
撑腰/1 | 有大家支持他才敢说出来 | With everyone behind him he finally dared to speak up, so the word must mean to back up.
帮扶/1 | 大学生长期帮山区孩子 | The university students have long helped mountain children learn English, so the word must mean to assist.
提携/1 | 他的成绩离不开老师的 | His success owes much to his teachers' guidance, so the word must mean to guide and support.
携带/1 | 坐飞机不能带太多液体 | Air passengers may not take much liquid with them, so the word must mean to carry.
伸出援手/1 | 老人摔倒，路人纷纷 | When an old man fell, passers-by hurried to help him, so the word must mean to lend a hand.
互帮互助/1 | 同学们全班成绩提高 | The whole class's marks rose once the pupils began helping each other, so the word must mean to help one another.
倡议/1 | 学生会请大家节约用水 | The student union calls on everyone to save water, so the word must mean proposal.
倡导/1 | 学校一直鼓励光盘行动 | The school has long promoted the clean-plate campaign, so the word must mean to advocate.
提倡/1 | 医生建议每天走路半小时 | Doctors recommend walking at least half an hour a day, so the word must mean to encourage.
呼吁/1 | 环保组织请人少用塑料袋 | Environmental groups call on people to use fewer plastic bags, so the word must mean to appeal.
响应/1 | 居民积极回应号召 | Residents answered the community's call and sorted their rubbish, so the word must mean to respond.
发起/1 | 捐书活动由中学生开始 | A few secondary pupils started the book drive, so the word must mean to initiate.
动员/1 | 社区组织居民一起打扫 | The community got residents to clean the estate together, so the word must mean to mobilise.
联名/1 | 几十位家长一起签名写信 | Dozens of parents signed one letter together asking for traffic lights, so the word must mean jointly.
征集/1 | 图书馆收集老照片 | The library is gathering old photos for a city history exhibition, so the word must mean to collect.
公益广告/1 | 地铁里提醒给老人让座 | The notice in the underground reminds people to give seats to the elderly, so the word must mean public service advertisement.
蓬勃/1 | 兴趣小组发展得很好 | Interest groups in the community are growing fast in number, so the word must mean vigorous.
朝气蓬勃/1 | 打篮球的年轻人 | The young people on the playground are playing basketball, so the word must mean full of vigour.
生机勃勃/1 | 春天公园里的树木花草 | Spring has come and the park's trees and flowers are growing, so the word must mean full of life.
兴致勃勃/1 | 孩子们听老爷爷讲历史 | The children listen eagerly to the old man's history of the street, so the word must mean full of enthusiasm.
欣欣向荣/1 | 老街商店越开越多 | Since the rebuilding, more and more shops have opened on the old street, so the word must mean flourishing.
尤其/1 | 冬天很冷，特别是晚上 | Winters here are cold, and the nights most of all, so the word must mean especially.
尤为/1 | 问题在老城区特别突出 | The problem stands out most in the old town, so the word must mean particularly.
热火朝天/1 | 一个上午就把公园打扫干净 | The park was cleaned in a single morning, so the word must mean bustling with activity.
红红火火/1 | 一家把小饭馆开得 | The family's little restaurant does excellent business, so the word must mean thriving.
蒸蒸日上/1 | 公司员工已有一百多人 | His small firm now has over a hundred staff, so the word must mean flourishing.
悲惨/1 | 孤儿的童年观众看哭了 | Many viewers cried at the orphan's childhood, so the word must mean tragic.
惨重/1 | 大火造成的损失 | The great fire caused losses on a huge scale, so the word must mean heavy.
艰难/1 | 那几年家里穷日子过得 | The family was very poor in those years, so the word must mean difficult.
艰苦/1 | 山区学校冬天没暖气 | The mountain school's classrooms have no heating in winter, so the word must mean harsh.
艰辛/1 | 父母养活全家吃尽了 | The parents went through much to feed the whole family, so the word must mean hardship.
艰巨/1 | 修山区公路这项任务 | Building the mountain road is a huge task, so the word must mean arduous.
艰险/1 | 登山队员不怕 | The climbers feared nothing and reached the summit, so the word must mean danger and difficulty.
悲哀/1 | 失去梦想最大的 | Losing one's dreams is the worst thing that can happen to a person, so the word must mean sorrow.
发愁/1 | 为找不到便宜房子 | He cannot find a cheap flat, so the word must mean to worry.
愁眉苦脸/1 | 考试没考好一整天都 | He did badly in the exam and looked unhappy all day, so the word must mean worried-looking.
怜悯/1 | 他需要工作机会而不是 | What he needs is a chance to work, so the word must mean pity.
体恤/1 | 老板下雨天让大家早回家 | The boss lets everyone go home early on rainy days, so the word must mean to show sympathy for.
慷慨/1 | 常常把书借给同学 | He often lends his books to classmates, so the word must mean generous.
感慨/1 | 回到家乡万千 | He has come home after thirty years away, so the word must mean to sigh with emotion.
乞讨/1 | 在街头要钱的人 | The city's relief stations help people who ask for money in the street, so the word must mean to beg.
乞求/1 | 用眼神求妈妈再玩一会儿 | He looks at his mother hoping to play a little longer, so the word must mean to beg for.
哀求/1 | 小狗叫着让主人开门 | The puppy whines outside as if pleading to be let in, so the word must mean to implore.
孤寡老人/1 | 社区为他们安装呼叫器 | The community fitted alarms for elderly people with no family, so the word must mean old people living alone.
多寡/1 | 捐款不论多少 | A donation is a kind gesture whatever its size, so the word must mean amount.
善举/1 | 把奖金捐给学校感动很多人 | He gave all his prize money to the school and moved many people, so the word must mean good deed.
愤怒/1 | 有人往河里倒垃圾村民 | Someone has been dumping rubbish in the river, so the word must mean angry.
气愤/1 | 他说话不算数让大家 | He broke his word, so the word must mean indignant.
公愤/1 | 工厂偷排污水引起 | The factory secretly let out dirty water and the whole public was outraged, so the word must mean public outrage.
愤愤不平/1 | 觉得比赛结果不公平 | He thinks the result of the match was unfair, so the word must mean indignant.
悲愤/1 | 看到被烧光的森林 | He looks at a forest burned to the ground, so the word must mean grief and indignation.
发愤图强/1 | 家里穷于是努力考上大学 | He grew up poor and worked hard until he got into university, so the word must mean to work hard to improve.
仇恨/1 | 只会带来更多痛苦 | The novel shows that this feeling only brings more pain, so the word must mean hatred.
记仇/1 | 吵完架第二天就和好 | After a quarrel he makes up the very next day, so the word must mean to bear a grudge.
敌意/1 | 新来的猫对家里的狗 | The new cat does not welcome the family's dog at all, so the word must mean hostility.
敌视/1 | 两个村子过去互相 | The two villages are good neighbours now, unlike in the past, so the word must mean to be hostile to.
辱骂/1 | 在网上骂别人不文明 | Abusing others online is uncivil, so the word must mean to insult.
骂人/1 | 有话好好说不要 | Say what you mean calmly, so the word must mean to call names.
挨骂/1 | 打破杯子怕被说 | He broke the cup and is afraid of his mother's anger, so the word must mean to be scolded.
嚷嚷/1 | 别在楼道里大声 | The neighbours are resting and the corridor should be quiet, so the word must mean to shout.
吵嚷/1 | 门外为停车位争吵的声音 | People outside are arguing over a parking space, so the word must mean clamour.
起哄/1 | 他上台唱歌台下有人 | Some classmates made noise to tease him while he sang on stage, so the word must mean to heckle.
哄骗/1 | 打电话骗老人汇钱 | A caller tricks the old man into sending money by saying his grandson is in trouble, so the word must mean to cheat.
哄/1 | 妈妈把哭闹的孩子弄睡了 | The mother finally got the crying child off to sleep, so the word must mean to coax.
哄堂大笑/1 | 一句话让全班同学 | One remark of his set the whole class laughing, so the word must mean to burst into laughter.
口角/1 | 两位邻居因小事 | The two neighbours had words over a small thing, so the word must mean quarrel.
阻拦/1 | 她要去山区支教，家里人谁也 | She is determined to teach in the mountains and her family cannot hold her back, so the word must mean to stop.
阻止/1 | 老师及时停住两个学生的争吵 | The teacher stepped in and ended the pupils' quarrel, so the word must mean to prevent.
阻碍/1 | 交通不便影响山村发展 | Poor transport has held back the village's development, so the word must mean to hinder.
妨碍/1 | 车不要挡住别人通行 | A badly parked car gets in other people's way, so the word must mean to obstruct.
不妨/1 | 周末有空可以来看看 | The speaker suggests trying the library if you are free at the weekend, so the word must mean might as well.
阻力/1 | 改革总会遇到 | Reform always meets some opposition but must not stop, so the word must mean resistance.
阻挡/1 | 大雨也挡不住志愿者的热情 | Heavy rain cannot dampen the volunteers' eagerness, so the word must mean to block.
劝阻/1 | 保安上前劝人不要下水 | The guard stepped forward to talk someone out of swimming where it is banned, so the word must mean to dissuade.
拦截/1 | 门卫拦住了外来汽车 | The gatekeeper kept an outside car from driving into the school, so the word must mean to intercept.
拦路虎/1 | 生词是阅读中最大的 | New words are the biggest obstacle in reading, so the word must mean stumbling block.
闯红灯/1 | 不管有没有车都不能 | Whether or not there are cars, you must not cross against the signal, so the word must mean to run a red light.
闯祸/1 | 小猫把花瓶推到地上 | The kitten has pushed the vase off the table, so the word must mean to cause trouble.
闯入/1 | 野猪跑进了菜地 | A wild boar broke into the villagers' vegetable field, so the word must mean to burst in.
插队/1 | 大家排队请不要 | Everyone is queuing for tickets, so the word must mean to cut in line.
随地吐痰/1 | 公共场所会传播疾病 | Doing this in public is unhygienic and spreads disease, so the word must mean to spit anywhere.
违章停车/1 | 车停在消防通道被罚款 | He was fined for leaving his car in the fire lane, so the word must mean illegal parking.
公德心/1 | 爱护公共设施的表现 | Caring for public facilities shows it, so the word must mean civic virtue.
不文明/1 | 在景区墙上乱刻乱画 | Carving on walls at scenic spots is bad behaviour, so the word must mean uncivilised.
高空抛物/1 | 小小的苹果也可能砸伤人 | Even a small apple dropped from high up can injure someone, so the word must mean throwing objects from buildings.
破坏公物/1 | 在公园椅子上乱刻名字 | Carving names on a park bench is one example, so the word must mean damaging public property.
掩盖/1 | 谎言盖不住事实 | Lies cannot hide the facts, so the word must mean to cover up.
掩饰/1 | 笑了笑想藏住紧张 | He smiled to hide his nerves, so the word must mean to disguise.
遮掩/1 | 有问题说出来不必 | Problems should be spoken about openly, so the word must mean to conceal.
遮挡/1 | 大树挡住了阳光 | The big tree outside the window keeps the sunlight out and the room is dark, so the word must mean to block.
遮盖/1 | 白雪盖住了整个院子 | After a night of snow the whole yard is white, so the word must mean to cover.
遮阳/1 | 夏天出门戴一顶帽子 | In summer it is best to wear a hat against the sun, so the word must mean to shade from the sun.
掩耳盗铃/1 | 把问题藏起来不去解决 | Hiding a problem instead of solving it only fools oneself, so the word must mean to bury one's head in the sand.
掩人耳目/1 | 换个名字继续卖假货 | They changed their name and kept selling fakes, so the word must mean to deceive the public.
遮风挡雨/1 | 小屋为过路人 | The simple hut gives passers-by cover from the weather, so the word must mean to shelter from wind and rain.
掩面/1 | 她用手捂脸哭了起来 | She hid her face in her hands and wept at the news, so the word must mean to cover one's face.
诱惑/1 | 网络游戏的 | He learned to control his time in spite of the pull of online games, so the word must mean temptation.
引诱/1 | 用高额回报吸引人投资 | Criminals tempt people to invest with promises of high returns, so the word must mean to lure.
诱骗/1 | 以免费送礼物骗老人 | Under cover of free gifts, someone tricks old people into buying costly health products, so the word must mean to trick.
诱导/1 | 老师耐心引导学生找答案 | The teacher patiently leads pupils to find the answer themselves, so the word must mean to guide.
诱人/1 | 面包店传出的香味 | A delicious smell drifts out of the bakery, so the word must mean tempting.
盗贼/1 | 偷走名画的人被抓到 | The police quickly caught the person who stole the famous painting, so the word must mean thief.
窃贼/1 | 装了摄像头以后不敢来 | Since cameras were installed on the estate, thieves no longer dare come, so the word must mean thief.
做贼心虚/1 | 一看见警察就跑 | He runs the moment he sees a police officer, so the word must mean to have a guilty conscience.
上当受骗/1 | 陌生电话先核实以免 | Check any call from a stranger first, so the word must mean to be deceived.
防不胜防/1 | 骗子手段越来越多 | Swindlers keep finding new tricks, so the word must mean hard to guard against.
狭隘/1 | 只看到自己的利益 | Seeing only one's own interests is small-minded, so the word must mean narrow.
狭小/1 | 一家五口住的房间 | A family of five lives in one room, so the word must mean cramped.
狭义/1 | 文化指文学、艺术等 | In this sense culture means literature, art and the like, so the word must mean narrow sense.
广义/1 | 文化包括人类创造的一切 | In this sense culture includes everything humans have made, so the word must mean broad sense.
以貌取人/1 | 穿着简单的人也可能有学问 | A plainly dressed person may be very learned, so the word must mean to judge by appearance.
另眼相看/1 | 表现出色大家都 | He did very well in the match and everyone thinks better of him now, so the word must mean to view in a new light.
排外/1 | 小镇欢迎新来的居民 | The town warmly welcomes newcomers, so the word must mean exclusive, xenophobic.
排斥/1 | 新同学不应该受到 | A new classmate should not be shut out, so the word must mean to exclude.
坐井观天/1 | 不出去看看世界 | Those who never go out to see the world have a narrow view, so the word must mean to look at the sky from a well.
少见多怪/1 | 大城市很常见你却惊讶 | The phone is very common in big cities, yet you are surprised by it, so the word must mean to be surprised by the ordinary.
陷入/1 | 工厂关门一家人困境 | After the factory closed his family fell on hard times, so the word must mean to fall into.
深陷/1 | 债务之中每天发愁 | He is buried in debt and worried every day, so the word must mean to be deeply mired.
缺陷/1 | 汽车有设计问题全部召回 | The carmaker is recalling every car with the design fault, so the word must mean defect.
诬陷/1 | 被人说偷了钱，监控证明清白 | Someone accused him of stealing money, but the cameras proved him innocent, so the word must mean to frame.
陷害/1 | 坏人想害主人公 | The villain tries to harm the hero by trickery but harms himself, so the word must mean to frame.
避免/1 | 为了不迟到提前出门 | He leaves half an hour early every day to keep from being late, so the word must mean to avoid.
回避/1 | 面对记者的问题没有躲开 | He did not dodge the reporters' questions and told the truth, so the word must mean to evade.
逃避/1 | 遇到困难不能 | When there is difficulty, find a way to solve it, so the word must mean to escape.
避难/1 | 地震后到公园空地上 | After the earthquake residents gathered in the open space of the park, so the word must mean to take refuge.
避风港/1 | 家是孩子心中的 | Home is a place of safety in a child's heart, so the word must mean haven.
挽救/1 | 医生抢救救回他的生命 | The doctors did everything and finally saved his life, so the word must mean to save.
挽回/1 | 道歉希望朋友再信任 | He apologised sincerely hoping to win back his friend's trust, so the word must mean to retrieve.
挽留/1 | 老师要走，同学们一再 | The teacher is moving to another school and the pupils keep asking him to stay, so the word must mean to urge to stay.
毁坏/1 | 有人故意破坏花草 | Someone damaged the park's flowers on purpose, so the word must mean to damage.
毁灭/1 | 不保护环境人类会 | Without protecting the environment, humans may ruin their own home, so the word must mean to destroy.
烧毁/1 | 大火烧掉百年老屋 | A great fire destroyed the hundred-year-old house, so the word must mean to burn down.
损毁/1 | 台风过后房屋不同程度 | Many village houses were damaged to some degree by the typhoon, so the word must mean damage.
销毁/1 | 过期药品统一处理掉 | The out-of-date medicines have all been disposed of, so the word must mean to destroy.
毁约/1 | 对方突然不守合同 | The other side suddenly broke the agreement and the company lost a great deal, so the word must mean to break a contract.
前功尽弃/1 | 练了半年现在放弃 | The speaker has practised for six months, and giving up now would waste it, so the word must mean to waste all previous efforts.
弱势群体/1 | 老人、残疾人等需要关心 | Old and disabled people need more care from society, so the word must mean vulnerable groups.
无家可归/1 | 地震过后住在帐篷里 | After the earthquake many people live in tents, so the word must mean homeless.
流浪/1 | 好心人带回家的猫 | A kind person took home the cat that had no owner, so the word must mean to wander.
救助站/1 | 天冷上街寻找需要帮助的人 | When it turns cold, its staff go out to look for people needing help, so the word must mean relief station.
网络暴力/1 | 网上骂人、公开隐私 | Abusing people online and exposing their private lives are both examples, so the word must mean online abuse.
贫困户/1 | 村里靠养蜂过上好日子 | The village's poorest families now live well by keeping bees, so the word must mean poor household.
城中村/1 | 打工的人住在租金便宜的 | Many new workers in the city live where rents are cheap, so the word must mean urban village.
外来人口/1 | 已经超过本地人口 | People from elsewhere now outnumber the locals in this city, so the word must mean migrant population.
民生/1 | 住房、教育、医疗 | Housing, education and healthcare are major matters for ordinary people's lives, so the word must mean livelihood.
二手烟/1 | 也会伤害身边的人 | Smoking harms not only the smoker but those nearby, so the word must mean second-hand smoke.
基础/1 | 学好数学先要打好 | Learning maths well starts with solid groundwork, so the word must mean foundation.
基础知识/1 | 天文学的入门内容 | The book introduces the basics of astronomy for secondary pupils, so the word must mean basic knowledge.
基础研究/1 | 改变生活的发明来自几十年前的 | Many inventions that changed life came from research done decades earlier, so the word must mean basic research.
基础设施/1 | 农村的道路、供水 | The government has improved rural roads and water supply, so the word must mean infrastructure.
地基/1 | 盖高楼先要打牢 | Before a tall building goes up, what lies beneath must be made solid, so the word must mean foundation.
根基/1 | 老店能开一百年靠诚信 | Honesty has kept the old shop going for over a century, so the word must mean foundation.
基石/1 | 教育是国家发展的 | Education is what a country's development rests on, so the word must mean cornerstone.
步骤/1 | 做实验要严格按照 | An experiment must follow its stages strictly, so the word must mean step.
骤然/1 | 一进山洞气温下降 | The temperature drops at once on entering the cave, so the word must mean suddenly.
由浅入深/1 | 教材适合初学者 | The textbook suits beginners, so the word must mean from the simple to the deep.
详细/1 | 把事情经过说一遍 | Please tell the whole story with every particular, so the word must mean detailed.
详尽/1 | 报告提供的数据 | The report gives very complete data, so the word must mean exhaustive.
详实/1 | 传记资料很可信 | The biography is well sourced and believable, so the word must mean detailed and accurate.
详情/1 | 活动的具体内容看网站 | See the notice on the school website for more about the event, so the word must mean details.
详略得当/1 | 作文重点很突出 | The essay's main points stand out clearly, so the word must mean well balanced in detail.
仔细/1 | 交卷之前再检查一遍 | Check your paper once more before handing it in, so the word must mean careful.
细致/1 | 她做事从来不出错 | She never makes mistakes in her work, so the word must mean meticulous.
彻底/1 | 大扫除把教室打扫一遍 | The big clean-up cleaned every part of the classroom, so the word must mean thorough.
透彻/1 | 难题分析得非常 | The teacher analysed the hard problem very clearly, so the word must mean thorough.
彻夜/1 | 为了完成实验他们工作 | They worked through the night to finish the experiment, so the word must mean all night.
特殊/1 | 这种花需要的照顾 | This flower will not grow in ordinary soil, so the word must mean special.
殊途同归/1 | 不同方法得出相同结论 | They used different methods but reached the same conclusion, so the word must mean different roads to the same end.
悬殊/1 | 两队实力差得太远 | The two teams are far apart in strength and the result was never in doubt, so the word must mean wide disparity.
罕见/1 | 全世界只有几百个病例 | There are only a few hundred cases of the disease in the world, so the word must mean rare.
罕有/1 | 几十年没有过的大雪 | It is the heaviest snow in decades, so the word must mean rare.
稀罕/1 | 谁要你的东西 | The speaker has their own and does not want yours, so the word must mean to value, care for.
人迹罕至/1 | 深山里发现新植物 | Scientists found a new plant deep in the mountains where few people go, so the word must mean rarely visited.
广泛/1 | 从小学生到老人都爱看 | Everyone from schoolchildren to the elderly loves the book, so the word must mean wide.
宽泛/1 | 题目太大要缩小范围 | The topic is too large and should be narrowed, so the word must mean broad.
空泛/1 | 文章不能只讲道理没例子 | An essay needs concrete examples, so the word must mean empty.
追踪/1 | 给候鸟戴定位器 | Scientists fit migrating birds with trackers to follow their routes, so the word must mean to track.
跟踪/1 | 医生长期观察病人恢复 | Doctors keep watching the patient's recovery over time, so the word must mean to follow.
踪迹/1 | 雪地上小动物留下的 | Small animals have left marks in the snow, so the word must mean trace.
踪影/1 | 找了半天不见小狗 | After a long search the puppy is still nowhere to be seen, so the word must mean trace.
失踪/1 | 多年找不到的飞机 | The plane that vanished years ago has finally been found, so the word must mean to go missing.
无影无踪/1 | 太阳出来雾就消失 | When the sun comes out the fog disappears completely, so the word must mean without a trace.
溯源/1 | 扫码查大米的产地 | Scanning the code on the bag shows where the rice came from, so the word must mean to trace the source.
摘录/1 | 在笔记本上记下好句子 | He wrote good sentences from the book in his notebook, so the word must mean to excerpt.
摘抄/1 | 每天抄一段优美文字 | The teacher asks pupils to copy out a beautiful passage every day, so the word must mean to copy out.
摘要/1 | 论文前面两百字概括全文 | Two hundred characters before the paper sum up the whole, so the word must mean abstract.
提纲/1 | 写作文前先列 | Before writing an essay you first list its main points, so the word must mean outline.
大纲/1 | 课程的教学安排 | The course's teaching plan has been handed out to everyone, so the word must mean syllabus.
纲要/1 | 学校未来五年的发展 | The school has published its plan for the next five years, so the word must mean programme.
综述/1 | 总结近十年研究成果的文章 | His article sums up a decade of research on city traffic, so the word must mean review.
选题/1 | 论文成功的一半 | Picking a good subject is half of a successful paper, so the word must mean choice of topic.
开题报告/1 | 研究生先通过才能开始研究 | Graduate students must pass it before their research formally begins, so the word must mean proposal report.
结题/1 | 课题研究三年终于完成 | After three years of research the project has finally been wrapped up, so the word must mean to conclude a project.
立项/1 | 研究项目获得经费批准 | Last year the research project was approved and received funding, so the word must mean to approve a project.
经费/1 | 缺少钱研究停了下来 | The research had to stop for lack of money, so the word must mean funds.
资助/1 | 基金会帮助贫困大学生 | The foundation pays for a hundred poor university students, so the word must mean to fund.
函数/1 | 图像可以是直线也可以是曲线 | In school maths its graph can be a straight line or a curve, so the word must mean function.
一次函数/1 | 图像是一条直线 | Its graph is a straight line, so the word must mean linear function.
自变量/1 | 研究温度的影响，温度是 | When studying how temperature affects plant growth, temperature is the thing being changed, so the word must mean independent variable.
因变量/1 | 研究温度的影响，植物高度是 | When studying how temperature affects plant growth, plant height is the thing that responds, so the word must mean dependent variable.
坐标/1 | 用经度和纬度确定一个地方 | Longitude and latitude fix a place's position on a map, so the word must mean coordinate.
矩阵/1 | 电脑把图片看成数字组成的 | A computer treats a picture as a grid of numbers, so the word must mean matrix.
矩形/1 | 足球场是一个大大的 | A football pitch is one large example, so the word must mean rectangle.
斜率/1 | 直线往右上升得越快越大 | The faster a line rises to the right, the larger this value, so the word must mean slope.
平均数/1 | 二、三、七加起来除以三 | Two, three and seven added up and divided by three give four, so the word must mean average.
中位数/1 | 二、三、七中间那个 | Three is the middle one of two, three and seven, so the word must mean median.
贯穿/1 | 环保理念从头到尾 | The idea of protecting the environment runs from the start of the book to the end, so the word must mean to run through.
连贯/1 | 文章前后不接得上 | The essay's parts do not hang together and it is hard to read, so the word must mean coherent.
一贯/1 | 认真负责是他的作风 | Being careful and responsible has always been his way of working, so the word must mean consistent.
一以贯之/1 | 对真理的追求几十年没变 | The scientist's pursuit of truth has not changed in decades, so the word must mean consistently.
贯彻/1 | 学校认真执行安全第一 | The school carries out the principle of safety first, so the word must mean to implement.
贯通/1 | 高铁全线打通 | Once the whole high-speed line is open, the two cities are an hour apart, so the word must mean to link up.
融会贯通/1 | 学知识不能死记硬背 | Learning means more than memorising by rote, so the word must mean to master thoroughly.
全神贯注/1 | 看显微镜没发现有人进来 | He stared into the microscope without noticing anyone come in, so the word must mean wholly absorbed.
聚精会神/1 | 同学们专心听讲 | The pupils listen closely to the teacher, so the word must mean attentively.
一心一意/1 | 退休后专心研究家乡历史 | Since retiring he has given himself entirely to his hometown's history, so the word must mean wholeheartedly.
搞清楚/1 | 下结论前先弄明白事实 | We must get the facts straight before drawing conclusions, so the word must mean to figure out.
搞错/1 | 对不起我弄错了你的名字 | The speaker apologises for getting your name wrong, so the word must mean to get wrong.
搞定/1 | 这个问题我一个人就能 | The speaker can handle the problem alone, so the word must mean to sort out.
搞好/1 | 大家团结能把活动办好 | As long as everyone works together, the event will go well, so the word must mean to do well.
搞笑/1 | 动画片孩子们笑个不停 | The children cannot stop laughing at the cartoon, so the word must mean funny.
搞砸/1 | 太紧张把面试 | He was too nervous and the interview went badly, so the word must mean to mess up.
深究/1 | 原因值得深入研究 | The cause behind the phenomenon deserves close study, so the word must mean to probe.
推敲/1 | 每个句子反复斟酌 | He weighed every sentence of the paper again and again, so the word must mean to deliberate.
敲定/1 | 会议时间终于定在周一 | The meeting has finally been fixed for next Monday, so the word must mean to finalise.
敲门砖/1 | 证书只是找工作的 | For him the certificate is only a way into a job, so the word must mean stepping stone.
颇为/1 | 他对古代天文学相当了解 | He knows a fair amount about ancient Chinese astronomy, so the word must mean rather.
颇有/1 | 老教授在植物学方面很有 | The old professor has done a good deal of research in botany, so the word must mean to have considerable.
人人皆知/1 | 地球围着太阳转 | That the earth goes round the sun is now common knowledge, so the word must mean known to all.
比比皆是/1 | 城市里咖啡馆到处都有 | Cafés can be found on every street in this city, so the word must mean to be found everywhere.
皆大欢喜/1 | 双方都满意 | Both sides are satisfied with how the problem was solved, so the word must mean to the satisfaction of all.
凡是/1 | 参加比赛的同学都有证书 | Each pupil who enters the contest gets a certificate, so the word must mean every.
非凡/1 | 科学家有超常的想象力 | The scientist's imagination is far beyond the ordinary, so the word must mean extraordinary.
平凡/1 | 普通的乡村教师 | She is only a country teacher, yet she has influenced generations, so the word must mean ordinary.
凡人/1 | 我们难免会犯错误 | We are all bound to make mistakes, so the word must mean ordinary person.
不同凡响/1 | 第一部电影就获大奖 | The young director's first film won a major prize, so the word must mean remarkable.
萌芽/1 | 想法还处在刚开始的阶段 | The idea is only just beginning and needs more study, so the word must mean sprout, bud.
萌发/1 | 温度合适种子很快 | At the right temperature the seeds soon begin to grow, so the word must mean to sprout.
萌生/1 | 读了书有了当科学家的念头 | After reading the book he started to think of becoming a scientist, so the word must mean to begin to have.
弥补/1 | 暑假补上落下的功课 | He used the summer to catch up on the lessons he missed, so the word must mean to make up for.
补救/1 | 发现错误要及时 | A mistake should be put right at once before it gets worse, so the word must mean to remedy.
弥漫/1 | 山谷里满是白雾 | At dawn white mist fills the valley, so the word must mean to fill the air.
弥足珍贵/1 | 一百年前的照片 | The century-old photos record how the city once looked, so the word must mean extremely precious.
填补空白/1 | 研究成果受到同行重视 | The research result has drawn attention from colleagues as the first of its kind, so the word must mean to fill a gap.
起步/1 | 技术开始得晚但发展快 | The country's technology started late but has grown fast, so the word must mean to start.
初具规模/1 | 三年建设科学城已经 | After three years of building, the science city has taken shape, so the word must mean to begin to take shape.
瞬间/1 | 相机记录闪电出现的那一 | The camera caught the moment the lightning struck, so the word must mean instant.
转瞬即逝/1 | 机会要及时抓住 | Chances must be seized at once, so the word must mean fleeting.
瞬息万变/1 | 山里天气刚出太阳就下雨 | The sun was out a moment ago and now it is raining in the mountains, so the word must mean to change in an instant.
片刻/1 | 他沉思了一会儿 | He thought for a moment and then answered, so the word must mean moment.
暂时/1 | 住在朋友家，下月再找房 | He is staying with a friend and will look for a flat next month, so the word must mean temporarily.
暂且/1 | 问题先放一放 | The speaker suggests putting the question aside and discussing the next one, so the word must mean for the moment.
暂停/1 | 下大雨比赛停了半小时 | The match stopped for half an hour in the heavy rain, so the word must mean to pause.
暂缓/1 | 资金不够建设计划推迟 | There is not enough money and the new library plan has to wait, so the word must mean to postpone.
短暂/1 | 休息不久又开始工作 | After a short rest everyone went back to work, so the word must mean brief.
暂定/1 | 会议下周三举行，时间另通知 | The meeting is planned for next Wednesday, with the exact time to be announced, so the word must mean tentatively set.
竭力/1 | 医生们尽力抢救 | The doctors did all they could and the patient is out of danger, so the word must mean to do one's utmost.
竭尽全力/1 | 只要我们就不后悔 | As long as we give everything, there is nothing to regret, so the word must mean to do everything one can.
精疲力竭/1 | 爬了一天山大家都 | Everyone is worn out after a day of climbing, so the word must mean exhausted.
筋疲力尽/1 | 搬完家倒头就睡 | After moving house he was too tired to do anything but sleep, so the word must mean worn out.
枯竭/1 | 过度开采地下水会用光 | Too much pumping can leave no groundwater at all, so the word must mean to dry up.
一番/1 | 经过认真的准备 | After careful preparation his report was excellent, so the word must mean a spell of.
三番五次/1 | 一次又一次向导师请教 | He asked his supervisor again and again until he understood, so the word must mean repeatedly.
毛遂自荐/1 | 实验室招助手他推荐自己 | The lab needed an assistant and he put himself forward, so the word must mean to recommend oneself.
未遂/1 | 出国留学的心愿没实现 | His wish to study abroad never came true and he still feels let down, so the word must mean unfulfilled.
心血/1 | 词典凝聚了他二十年的 | Twenty years of his hard work went into the dictionary, so the word must mean painstaking effort.
纯粹/1 | 学画画完全出于兴趣 | He learns painting out of interest alone, not for exams, so the word must mean purely.
精粹/1 | 古代诗歌最好的部分 | The book gathers the finest of ancient Chinese poetry, so the word must mean essence.
国粹/1 | 京剧被称为中国的 | Peking opera is called one of China's national treasures, so the word must mean quintessence of a nation.
博大精深/1 | 书法艺术值得一生去学 | Chinese calligraphy is worth a lifetime of study, so the word must mean broad and profound.
浩如烟海/1 | 图书馆的书一辈子读不完 | The library holds more books than one could read in a lifetime, so the word must mean vast.
浩大/1 | 修建三峡大坝的工程 | Building the Three Gorges Dam was a huge project, so the word must mean vast.
玄妙/1 | 宇宙起源的道理至今没答案 | Many questions about the origin of the universe still have no answer, so the word must mean abstruse.
玄机/1 | 题目看似简单其实暗藏 | The problem looks simple but hides a trick, so the word must mean hidden meaning.
惟妙惟肖/1 | 模仿鸟叫学得一模一样 | His imitations of bird calls sound exactly like the real thing, so the word must mean true to life.
惟有/1 | 坚持下去才能看到成果 | The second half begins with 才能 and the first names the one way to see results, so the word must mean only.
胚胎/1 | 观察鸡蛋里研究动物发育 | Scientists watch what grows inside an egg to study how animals develop, so the word must mean embryo.
霉菌/1 | 面包放久了长出来的 | Bread left too long grows something that makes it inedible, so the word must mean mould.
发霉/1 | 南方春天潮湿衣服容易 | In the damp southern spring clothes easily spoil, so the word must mean to go mouldy.
青蛙/1 | 夏夜稻田里叫个不停 | On summer nights they croak without stopping in the rice fields, so the word must mean frog.
猩猩/1 | 东南亚雨林里手臂很长 | It lives in Southeast Asian rainforests, has very long arms and spends most of its time in trees, so the word must mean orangutan.
黑猩猩/1 | 用小树枝取白蚁吃 | It uses twigs to fish termites out of holes, so the word must mean chimpanzee.
蚂蚁/1 | 能搬动比自己重得多的东西 | One can carry something much heavier than itself, so the word must mean ant.
苍蝇/1 | 会传播疾病食物要盖好 | They spread disease and food must be covered, so the word must mean fly.
果蝇/1 | 遗传学用它做实验繁殖快 | Genetics research often uses them because they breed quickly, so the word must mean fruit fly.
苍白/1 | 他生病了脸色很 | He is ill and his face has lost its colour, so the word must mean pale.
数据库/1 | 收录一百多年的天气记录 | It holds over a century of weather records, so the word must mean database.
题库/1 | 考试题目随机抽出来的地方 | Exam questions are drawn at random from it, so the word must mean question bank.
文库/1 | 儿童丛书收录一百本名著 | The children's series includes a hundred world classics, so the word must mean library collection.
智库/1 | 研究人员为城市规划提建议 | Its researchers often advise on city planning, so the word must mean think tank.
检索/1 | 输入书名就能找到 | Entering a title on the library website finds the book, so the word must mean to search.
关键词/1 | 摘要下列出三到五个 | Three to five are usually listed under a paper's abstract, so the word must mean keyword.
查重/1 | 论文提交前查重复内容 | Before a paper is handed in, repeated text must be checked, so the word must mean to check for duplication.
匹配/1 | 密码和账号不对应 | The password does not fit the account and must be entered again, so the word must mean to match.
匹敌/1 | 人类棋手很难和电脑 | Human players can hardly compete with computer programs at Go, so the word must mean to rival.
引文/1 | 论文中要注明出处 | Every quoted passage in a paper must give its source, so the word must mean citation.
授予/1 | 大学给他名誉博士学位 | The university gave him an honorary doctorate, so the word must mean to confer.
学术界/1 | 论文引起很大反响 | The paper drew a strong response among scholars, so the word must mean academic circles.
学术会议/1 | 去国外报告研究成果 | Next month she goes abroad to present her research to other scholars, so the word must mean academic conference.
跨学科/1 | 需要地理、化学专家合作 | Studying climate change needs experts in geography, chemistry and more, so the word must mean interdisciplinary.
同行评议/1 | 论文发表前一般要经过 | Before a paper is published it is usually checked by other experts, so the word must mean peer review.
期刊/1 | 有周刊也有月刊 | The library takes over two hundred, some weekly and some monthly, so the word must mean periodical.
专著/1 | 研究宋代瓷器的书 | He spent ten years writing a whole book on Song porcelain, so the word must mean monograph.
参考文献/1 | 论文最后要列出 | They are listed at the end of a paper, so the word must mean references.
抄袭/1 | 文章照抄别人的研究 | His article was found to copy others' research and was withdrawn, so the word must mean to plagiarise.
学术不端/1 | 抄袭、伪造数据 | Copying and faking data are examples, so the word must mean academic misconduct.
麦穗/1 | 初夏田里变黄准备收麦子 | In early summer the wheat heads turn yellow and harvest is near, so the word must mean ear of wheat.
稻穗/1 | 金黄的把稻子压弯了腰 | The golden heads weigh the rice stalks down, so the word must mean ear of rice.
秧苗/1 | 农民一行一行插进水田 | In spring farmers set young plants in rows in the paddy, so the word must mean seedling.
插秧/1 | 四五月南方农民开始忙 | Every April and May southern farmers get busy planting rice, so the word must mean to transplant rice.
禾苗/1 | 春雨后田里长得更绿 | After a spring rain the young plants in the field are greener, so the word must mean young crop.
籽粒/1 | 玉米饱满收成好 | The corn is full and plump this year and the harvest will be good, so the word must mean grain, kernel.
茎/1 | 把根吸收的水分送到叶子 | This part carries the water taken in by the roots up to the leaves, so the word must mean stem.
茎秆/1 | 新品种小麦又短又粗不怕风 | The new wheat is short and thick and stands up to strong wind, so the word must mean stalk.
块茎/1 | 土豆吃的部分不是根 | The part of a potato we eat is not actually the root, so the word must mean tuber.
颗粒无收/1 | 大旱那年庄稼 | In the year of the great drought many places harvested nothing, so the word must mean total crop failure.
红薯/1 | 冬天街头烤的又香又甜 | A roasted one bought in the street in winter is fragrant and sweet, so the word must mean sweet potato.
马铃薯/1 | 原产南美洲传到世界 | It came from South America and spread around the world, so the word must mean potato.
薯条/1 | 一杯可乐和一份 | He ordered a cola and a portion of fried potato sticks, so the word must mean French fries.
薯片/1 | 一袋边看电影边吃 | He opens a bag and eats while watching a film, so the word must mean potato crisps.
蘑菇/1 | 雨后树林里，野生的别乱吃 | Many grow in the woods after rain, but wild ones should not be eaten carelessly, so the word must mean mushroom.
香菇/1 | 晒干后香味更浓常做汤 | Dried ones smell stronger and are often used in soup, so the word must mean shiitake.
菌菇/1 | 工厂种十几个品种 | The factory grows a dozen kinds, so the word must mean mushrooms.
木耳/1 | 黑的长在潮湿树干上 | The black kind grows on damp tree trunks and is stir-fried after soaking, so the word must mean wood ear fungus.
菇农/1 | 山里在大棚种香菇的人 | Growers in the mountains raise shiitake in greenhouses all year round, so the word must mean mushroom grower.
杂粮/1 | 少吃精米白面多吃 | The doctor advises less white rice and flour, so the word must mean coarse grains.
犁/1 | 农民用牛拉着耕地 | In the past farmers used oxen to pull it across the fields, so the word must mean plough.
犁地/1 | 开着拖拉机翻土 | In spring farmers turn the soil with tractors, so the word must mean to plough.
锄头/1 | 爷爷拿着下地去了 | Grandpa took his tool and went to the fields, so the word must mean hoe.
锄草/1 | 菜地草长得快要经常 | Weeds grow fast in the vegetable plot in summer, so the word must mean to weed.
耕耘/1 | 在乡村学校默默工作三十年 | He has worked quietly in a village school for thirty years, so the word must mean to cultivate, toil.
竹筐/1 | 背着上山采茶 | She carries one on her back up the hill to pick tea, so the word must mean bamboo basket.
水桶/1 | 提着两只去井边打水 | He carries two to the well to fetch water, so the word must mean bucket.
收割机/1 | 收麦子一台一天一百多亩 | One machine can harvest over a hundred mu of wheat a day, so the word must mean harvester.
播种机/1 | 往前开把种子种进土 | As it moves forward it puts seeds into the soil, so the word must mean seeder.
农机/1 | 购买它的农民有补贴 | Farmers who buy it get a government subsidy, so the word must mean farm machinery.
亩/1 | 承包了五十这样的地 | His family farms fifty of these units of land, all in wheat, so the word must mean mu.
亩产/1 | 新品种水稻每亩产量 | The new rice gives a fifth more per unit of land than before, so the word must mean yield per mu.
梯田/1 | 云南哈尼的列入世界遗产 | Yunnan's Hani ones are on the World Heritage list, so the word must mean terraced field.
良田/1 | 荒地变成了好地 | After years of work the wasteland has become fertile, so the word must mean good farmland.
收成/1 | 雨水充足粮食的 | There has been plenty of rain this year, so the word must mean harvest.
歉收/1 | 干旱小麦产量不好 | The drought has hurt this region's wheat, so the word must mean poor harvest.
秋收/1 | 田野里到处是收玉米的人 | At this time of year the fields are full of people bringing in corn, so the word must mean autumn harvest.
农忙/1 | 学校放假让孩子帮家里干活 | Village schools used to close for a few days for children to help at home, so the word must mean busy farming season.
五谷丰登/1 | 过年贴在门上的四个大字 | At New Year many farm families paste these four characters on their doors, so the word must mean abundant harvest.
风调雨顺/1 | 今年庄稼长得特别好 | The crops are growing especially well this year, so the word must mean favourable weather.
畜牧业/1 | 内蒙古草原上很发达 | Inner Mongolia has vast grasslands, so the word must mean animal husbandry.
家畜/1 | 牛、羊、猪 | Cattle, sheep and pigs are common examples, so the word must mean livestock.
饲养/1 | 农场养了两千头奶牛 | The farm keeps two thousand dairy cows, so the word must mean to raise.
饲料/1 | 玉米秆加工给牛羊吃 | Corn stalks can be made into feed for cattle and sheep, so the word must mean fodder.
喂养/1 | 小猫每隔几小时一次 | The newborn kitten must be given food every few hours, so the word must mean to feed.
喂食/1 | 不要随便给动物 | The zoo asks visitors not to give the animals food, so the word must mean to feed.
粪便/1 | 牛羊的可以生产沼气 | What cattle and sheep leave behind can produce biogas, so the word must mean excrement.
粪肥/1 | 菜农用处理过的给菜地施肥 | Vegetable farmers spread treated animal waste on their plots, so the word must mean manure.
奶牛/1 | 每天要挤两三次奶 | The ranch's cows are milked two or three times a day, so the word must mean dairy cow.
猪圈/1 | 每天早上打扫干净 | Every morning he cleans out where the pigs are kept, so the word must mean pigsty.
大棚/1 | 冬天黄瓜照样长得好 | Cucumbers still grow well inside it in winter, so the word must mean greenhouse.
反季节/1 | 冬天也能吃到的蔬菜 | Thanks to greenhouses, people can eat vegetables in winter, so the word must mean off-season.
无土栽培/1 | 根泡在营养液中 | The vegetables are not planted in the ground and their roots sit in nutrient solution, so the word must mean soilless cultivation.
牛棚/1 | 下雨把牛赶进去 | It started raining and he drove the cattle inside, so the word must mean cowshed.
菜园/1 | 屋后种了些青菜 | Grandma has a small plot behind the house with greens growing in it, so the word must mean vegetable garden.
菜农/1 | 天不亮把蔬菜运到城里 | Before dawn every day they bring fresh vegetables into the city, so the word must mean vegetable farmer.
果农/1 | 苹果成熟忙着摘果子 | The apples are ripe and they are busy picking, so the word must mean fruit grower.
有机农业/1 | 种菜不用化肥和农药 | The farm grows vegetables without chemical fertiliser or pesticide, so the word must mean organic farming.
生态农业/1 | 稻田里养鱼鱼粪肥田 | Fish in the rice field eat pests and their waste feeds the soil, so the word must mean ecological agriculture.
智慧农业/1 | 用手机控制大棚温度 | Farmers control the greenhouse temperature from their phones, so the word must mean smart agriculture.
葡萄/1 | 吐鲁番的又大又甜 | Those from Turpan in Xinjiang are large and sweet, so the word must mean grape.
葡萄干/1 | 吐鲁番干燥适合晒成 | Turpan's dry climate is ideal for drying grapes, so the word must mean raisin.
葡萄园/1 | 山坡上架子挂满了葡萄 | On the hillside the trellises are full of grapes, so the word must mean vineyard.
梨/1 | 秋天又甜又水灵的水果 | In dry autumn weather many people like this sweet, juicy fruit, so the word must mean pear.
鸭梨/1 | 河北出产很有名 | The pears grown in Hebei are famous, so the word must mean Ya pear.
橘子/1 | 皮很容易剥开 | Its skin peels off easily and its flesh is sweet and sour, so the word must mean tangerine.
红枣/1 | 煮汤时放了几颗 | Mother put a few in the soup, so the word must mean jujube.
枣树/1 | 秋天结满红红的果子 | Every autumn the old tree in the yard is covered in red fruit, so the word must mean jujube tree.
嫁接/1 | 把好品种的枝条接到老树上 | The grower joined good branches onto old trees and the apples became sweeter, so the word must mean to graft.
授粉/1 | 蜜蜂帮助果树 | The grower lets bees into the orchard to help the trees bear fruit, so the word must mean to pollinate.
葱/1 | 炒菜前先放一点爆香 | Before stir-frying, a little is fried first for fragrance, so the word must mean scallion.
大葱/1 | 山东出产的又高又粗 | The kind grown in Shandong is tall and thick, so the word must mean Chinese leek.
洋葱/1 | 切的时候眼睛发红 | Cutting it makes many people's eyes sting, so the word must mean onion.
葱花/1 | 面条上放一点更香 | Sprinkled on noodles it makes them smell better, so the word must mean chopped green onion.
大蒜/1 | 味道很重吃完刷牙 | Its smell is strong and you should brush your teeth after eating it, so the word must mean garlic.
蒜苗/1 | 青青的炒肉很下饭 | Stir-fried with meat it makes a homely dish that goes well with rice, so the word must mean garlic sprouts.
茄子/1 | 照相时大家一起说 | Everyone says it together when a photo is taken and their faces smile, so the word must mean eggplant.
番茄/1 | 炒鸡蛋是家常菜 | Stir-fried with eggs it makes a simple home dish, so the word must mean tomato.
葱绿/1 | 雨后山坡一片 | After rain the hillside is fresh and green, so the word must mean bright green.
时令/1 | 饭馆只用当季蔬菜 | The restaurant's menu changes with each season, so the word must mean season.
桑树/1 | 江南房前屋后都种着 | In the past many villages south of the Yangtze planted them around every house, so the word must mean mulberry tree.
桑叶/1 | 蚕宝宝最爱吃 | Silkworms love eating fresh ones best, so the word must mean mulberry leaf.
蚕/1 | 吐出的丝织成丝绸 | The thread it spins can be woven into silk, so the word must mean silkworm.
养蚕/1 | 中国几千年的历史 | China has kept these insects for silk for thousands of years, so the word must mean to raise silkworms.
蚕丝/1 | 做的被子又轻又暖 | Quilts made from it are light and warm, so the word must mean silk.
春蚕/1 | 到死丝方尽 | The famous line by the Tang poet Li Shangyin says its thread ends only with its death, so the word must mean spring silkworm.
蚕豆/1 | 地里开出紫白色小花 | In spring the plants in the field open small purple and white flowers, so the word must mean broad bean.
蚕食/1 | 超市不断吃掉小商店生意 | Big supermarkets keep eating away at small shops' business, so the word must mean to encroach.
桑田/1 | 家家户户都养蚕的地 | Every household here once kept silkworms, so the word must mean mulberry field.
织布/1 | 奶奶用木头机器 | Grandma once worked a wooden loom, so the word must mean to weave cloth.
冶炼/1 | 从矿石中提取铜 | Ancient people learned early to get copper out of ore, so the word must mean to smelt.
冶金/1 | 大学专业毕业去钢厂 | He studied it at university and then went to a steelworks, so the word must mean metallurgy.
炼铁/1 | 高炉的主要用途 | A blast furnace is used mainly for this, so the word must mean to smelt iron.
炼钢/1 | 去掉铁里多余的碳 | Extra carbon must be removed from the iron, so the word must mean to make steel.
高炉/1 | 钢厂日夜不停工作的 | It works day and night at the steelworks, so the word must mean blast furnace.
熔炉/1 | 艰苦环境是锻炼年轻人的大 | A hard environment is where young people are tested and shaped, so the word must mean furnace.
锻造/1 | 刀是一锤一锤打出来的 | The craftsman hammered the knife out blow by blow, so the word must mean to forge.
打铁/1 | 十几岁跟师傅学 | The old man learned the smith's trade from a master in his teens, so the word must mean to forge iron.
铁匠/1 | 铺里传出叮叮当当的声音 | A ringing clang often comes from the shop at the village entrance, so the word must mean blacksmith.
炉火纯青/1 | 做了四十年手艺已经 | He has been a carpenter for forty years, so the word must mean consummate skill.
锤子/1 | 把钉子钉进木板 | He drove the nail into the board with it, so the word must mean hammer.
锤打/1 | 铁匠把烧红的铁反复 | The smith beats the red-hot iron again and again, so the word must mean to hammer.
锤炼/1 | 语言经过反复修改 | The author revised the language of the essay many times, so the word must mean to temper, hone.
千锤百炼/1 | 好运动员都是这样成长的 | Every good athlete has grown through long hard training, so the word must mean thoroughly tempered.
钩子/1 | 门后挂衣服的 | Clothes can be hung on it behind the door, so the word must mean hook.
挂钩/1 | 工资和成绩联系在一起 | The company ties staff pay to work results, so the word must mean to link.
鱼钩/1 | 抛进河里等鱼上钩 | He casts it into the river and waits patiently for a bite, so the word must mean fish hook.
钩针/1 | 奶奶织了一顶帽子 | Grandma made the speaker a hat with it, so the word must mean crochet hook.
机床/1 | 数控的加工精密零件 | This computer-controlled one shapes very precise parts, so the word must mean machine tool.
切削/1 | 金属零件要经过打磨 | Metal parts must be shaped and polished before going into machines, so the word must mean to cut.
木炭/1 | 过去冬天用来取暖 | Some families once burned it for warmth in winter, so the word must mean charcoal.
煤炭/1 | 山西是重要产地 | Shanxi is one of China's main sources of it, so the word must mean coal.
炭火/1 | 大家围着烤红薯 | Everyone sits around the glowing coals roasting sweet potatoes, so the word must mean charcoal fire.
雪中送炭/1 | 最困难的时候借给他钱 | You lent him money when he was in the greatest need, so the word must mean help in time of need.
锅炉/1 | 学校每天早上烧好开水的 | The school's boiler room heats water every morning, so the word must mean boiler.
炉子/1 | 屋里生着一点也不冷 | The room is not at all cold with the fire lit, so the word must mean stove.
采煤/1 | 煤矿用机器挖 | Many mines now use machines and workers are much safer, so the word must mean to mine coal.
燃煤/1 | 城市不再用这种锅炉 | Many cities have stopped using these boilers to cut air pollution, so the word must mean coal-fired.
供暖/1 | 北方冬天集中屋里暖和 | Northern Chinese cities heat homes centrally in winter, so the word must mean to supply heating.
油桶/1 | 码头上堆着几十个空的 | Dozens of empty ones are stacked on the dock, so the word must mean oil drum.
砖窑/1 | 村里盖房的砖在那里烧 | The bricks for the village's houses were once fired there, so the word must mean brick kiln.
窑洞/1 | 黄土高原上冬暖夏凉 | Many families on the Loess Plateau live in homes dug into the hillside, so the word must mean cave dwelling.
官窑/1 | 宋代的瓷器非常珍贵 | Song porcelain made for the court is very precious, so the word must mean imperial kiln.
罐子/1 | 奶奶把咸菜装进陶的 | Grandma packed the pickles into an earthenware one, so the word must mean jar.
陶罐/1 | 遗址里几千年前的 | Archaeologists found a pot thousands of years old at the site, so the word must mean earthen jar.
罐头/1 | 登山队带着容易保存 | The climbers took many because they keep well, so the word must mean tinned food.
易拉罐/1 | 喝完饮料放进回收桶 | After the drink is finished it goes in the recycling bin, so the word must mean ring-pull can.
冷库/1 | 苹果保存到第二年春天 | Freshly picked apples sent there last until the next spring, so the word must mean cold store.
库存/1 | 手机卖得太好不多了 | The phone sells too well and the shop has few left, so the word must mean inventory.
入库/1 | 粮食晒干以后才能 | Grain must be dried before it is stored, so the word must mean to put in storage.
施肥/1 | 种庄稼要按时浇水 | Crops need watering and feeding on time, so the word must mean to fertilise.
追肥/1 | 小麦长到一定高度再一次 | Wheat at a certain height needs feeding once more, so the word must mean to top-dress.
磷肥/1 | 帮助根、花和果实发育 | It helps roots grow and flowers and fruit develop, so the word must mean phosphate fertiliser.
钾肥/1 | 让茎秆更结实不易倒 | It makes stalks stronger and less likely to fall over, so the word must mean potash fertiliser.
氮肥/1 | 让叶子又大又绿 | It makes leaves large and green, so the word must mean nitrogen fertiliser.
复合肥/1 | 同时含氮、磷、钾 | It contains nitrogen, phosphorus and potassium together, so the word must mean compound fertiliser.
有机肥/1 | 种出的蔬菜价格高 | Vegetables grown with it fetch higher prices, so the word must mean organic fertiliser.
农药/1 | 蔬菜洗干净以免残留 | Vegetables should be washed well in case of chemical residue, so the word must mean pesticide.
除草剂/1 | 用了以后杂草都枯死 | After spraying it all the weeds died, so the word must mean herbicide.
杀虫剂/1 | 家里有蚊子买一瓶 | There are mosquitoes at home and he bought a bottle, so the word must mean insecticide.
流水线/1 | 汽车一步一步装配 | Cars are put together on it step by step, so the word must mean assembly line.
车间/1 | 工厂有三个每个几百工人 | The factory has three, each with hundreds of workers, so the word must mean workshop.
厂房/1 | 新的盖好面积大了很多 | With the new building up, the factory is much larger, so the word must mean factory building.
产能/1 | 新设备使用后提高一半 | New equipment raised the factory's output by half, so the word must mean production capacity.
开工/1 | 春节过后工厂陆续 | After Spring Festival the factories reopen one by one, so the word must mean to start work.
停产/1 | 原材料运不进来 | Raw materials cannot get in and the factory has to stop, so the word must mean to stop production.
作坊/1 | 专门做手工布鞋一百多年 | The small place has made cloth shoes by hand for over a century, so the word must mean workshop.
加工厂/1 | 把卖不完的水果做成果干 | The village built a plant that turns unsold fruit into dried fruit, so the word must mean processing plant.
质检/1 | 产品出厂前都要经过 | Every product is checked before leaving the factory, so the word must mean quality inspection.
次品/1 | 检查员挑出来不让出厂 | The inspector picks out faulty goods and keeps them back, so the word must mean defective product.
轻工业/1 | 纺织、食品、造纸 | Textiles, food and paper belong to it, so the word must mean light industry.
重工业/1 | 钢铁、机械、造船 | Steel, machinery and shipbuilding belong to it, so the word must mean heavy industry.
制造业/1 | 中国规模最大 | China makes more goods than any other country, so the word must mean manufacturing.
原材料/1 | 棉花是棉纺厂最重要的 | Cotton is the most important input of a cotton mill, so the word must mean raw material.
半成品/1 | 家具还要上漆才能出厂 | The furniture still needs painting before it leaves the factory, so the word must mean semi-finished product.
削减/1 | 公司减掉一半广告费 | The company cut advertising spending by half to save costs, so the word must mean to cut.
削弱/1 | 干旱降低了农业生产能力 | Years of drought greatly reduced the area's farming capacity, so the word must mean to weaken.
合作社/1 | 村民成立统一卖蜂蜜 | Villagers set up a beekeeping group to sell honey together, so the word must mean cooperative.
家庭农场/1 | 一家承包三百亩地办起 | The family took on three hundred mu of land, so the word must mean family farm.
种粮大户/1 | 承包一千多亩地 | He farms over a thousand mu and is well known in the village, so the word must mean major grain grower.
瘟疫/1 | 古时一场夺去成千上万生命 | In ancient times one outbreak could kill tens of thousands, so the word must mean plague.
流行病/1 | 流感是冬天常见的 | Flu is common in winter and many pupils fall ill together, so the word must mean epidemic.
暴发/1 | 镇上突然发生一场痢疾 | Dysentery suddenly struck the town that summer because the well was polluted, so the word must mean to break out.
防控/1 | 传染病需要每个人配合 | Stopping infectious disease needs everyone's cooperation, so the word must mean prevention and control.
传播途径/1 | 饮用污染的水是霍乱的 | Drinking polluted water is the main way cholera spreads, so the word must mean route of transmission.
传染源/1 | 鼠疫中老鼠是主要的 | Rats spread the plague and people set about killing them, so the word must mean source of infection.
易感人群/1 | 老人小孩是流感的 | Old people and children resist flu poorly, so the word must mean susceptible population.
病原体/1 | 显微镜让人看到细菌 | After the microscope people could finally see germs like bacteria, so the word must mean pathogen.
潜伏期/1 | 两个星期病人没感觉 | For about two weeks patients often feel nothing, so the word must mean incubation period.
疫区/1 | 从那里回来先在家观察 | People returning from there stay home for a few days first, so the word must mean epidemic area.
疟疾/1 | 中国女科学家找到新药获诺贝尔奖 | A Chinese woman scientist won a Nobel Prize for a new drug against it, so the word must mean malaria.
痢疾/1 | 吃了不干净的东西拉肚子 | He ate something dirty and had diarrhoea several times a day, so the word must mean dysentery.
霍乱/1 | 通过污染的水井传播 | In the nineteenth century an English doctor found it spread through a polluted well, so the word must mean cholera.
天花/1 | 靠疫苗彻底消灭 | Vaccines wiped it out completely, so the word must mean smallpox.
艾滋病/1 | 血液传播但握手不传染 | It spreads through blood but not by eating together or shaking hands, so the word must mean AIDS.
结核病/1 | 长时间咳嗽吃几个月药 | Patients cough for a long time and take medicine for months, so the word must mean tuberculosis.
肝炎/1 | 甲型通过不干净的食物传播 | Type A spreads mainly through dirty food and water, so the word must mean hepatitis.
流感/1 | 秋天老人打这种疫苗 | Every autumn many old people get a vaccine against it, so the word must mean influenza.
手足口病/1 | 幼儿园孩子手上嘴里长疹子 | Some kindergarten children have small spots on their hands and in their mouths, so the word must mean hand, foot and mouth disease.
登革热/1 | 和疟疾一样由蚊子传播 | Like malaria it is spread by mosquitoes, so the word must mean dengue fever.
接种/1 | 孩子出生后按时打疫苗 | Babies must have their vaccines on schedule, so the word must mean to vaccinate.
预防针/1 | 小明怕疼每次打都哭 | Xiao Ming is afraid of pain and cries at every injection, so the word must mean vaccination shot.
加强针/1 | 前两针半年后再打 | Six months after the first two doses the doctor advises one more, so the word must mean booster shot.
抗体/1 | 接种疫苗身体里会产生 | After vaccination the body makes something that keeps the disease away, so the word must mean antibody.
免疫系统/1 | 艾滋病病毒会破坏它 | HIV damages the body's defences and people fall ill easily, so the word must mean immune system.
群体免疫/1 | 大多数人接种保护别人 | When most people are vaccinated, those who cannot be are protected too, so the word must mean herd immunity.
接种率/1 | 儿童超过百分之九十五 | Over ninety-five per cent of children in the area are vaccinated, so the word must mean vaccination rate.
不良反应/1 | 打疫苗后发热 | Some people get a fever after a vaccine, usually gone in a day or two, so the word must mean adverse reaction.
灭活疫苗/1 | 病毒已被杀死不会让人生病 | The virus in it has been killed and cannot cause illness, so the word must mean inactivated vaccine.
接种证/1 | 上幼儿园要交一份复印件 | A copy must be handed in when a child starts kindergarten, so the word must mean vaccination certificate.
筛查/1 | 学校每年查视力看谁近视 | The school checks pupils' eyesight every year for short-sightedness, so the word must mean screening.
普查/1 | 国家每十年一次人口 | The state counts the whole population every ten years, so the word must mean general survey.
检疫/1 | 进口水果要先经过 | Imported fruit must be checked before it is sold, so the word must mean quarantine.
排查/1 | 一个一个查和病人见过面的人 | Health officials are checking everyone who met the patient, so the word must mean to check one by one.
密切接触者/1 | 病人的家人也要检查 | The patient's family members must also be tested, so the word must mean close contact.
阳性/1 | 检测结果说明被感染 | The result shows he has been infected, so the word must mean positive.
阴性/1 | 检测结果可以放心回家 | With this result he can go home without worry, so the word must mean negative.
确诊/1 | 几次检查终于确定是肝炎 | After several tests the doctor was certain it was hepatitis, so the word must mean to confirm a diagnosis.
疑似/1 | 发热咳嗽被当作可能的病例 | He was taken to hospital with fever and cough as a possible case, so the word must mean suspected.
病例/1 | 全市发现三个流感 | Three people with flu were found in the city this month, so the word must mean case.
隔离/1 | 传染病人住单独病房 | He has an infectious disease and must stay in a separate ward, so the word must mean isolation.
防护服/1 | 医生从头到脚包严实 | The doctor is covered in white from head to foot, so the word must mean protective suit.
护目镜/1 | 防止药品进入眼睛 | They keep chemicals out of the eyes during experiments, so the word must mean goggles.
消毒水/1 | 医院走廊里的味道 | The hospital corridor smells of it, so the word must mean disinfectant.
通风/1 | 屋里人多要开窗 | With many people in the room, the windows should be opened often, so the word must mean to ventilate.
勤洗手/1 | 饭前便后预防肠道传染病 | Doing it before meals and after the toilet prevents gut infections, so the word must mean to wash hands often.
社交距离/1 | 排队保持一米以上 | People in the queue keep over a metre apart, so the word must mean social distance.
喷雾/1 | 往脸上喷一点儿保湿 | The air is dry and she puts a moisturising mist on her face, so the word must mean spray.
防护/1 | 矿井下要做好安全 | Work down a mine needs proper safety measures, so the word must mean protection.
居家/1 | 退休后大部分时间在家 | Since retiring he rarely goes out, so the word must mean to stay at home.
喷嚏/1 | 花粉过敏一到春天就打 | He is allergic to pollen and cannot stop doing it every spring, so the word must mean sneeze.
鼻涕/1 | 小弟弟感冒一直流 | The little brother has a cold and a runny nose, so the word must mean nasal mucus.
唾液/1 | 慢慢嚼让食物和它接触 | Chewing slowly mixes food with what is in the mouth and helps digestion, so the word must mean saliva.
发热/1 | 到三十九度赶紧去医院 | His temperature reached thirty-nine degrees and his mother rushed him to hospital, so the word must mean to have a fever.
乏力/1 | 总是疲倦没有精神 | He feels tired lately and has no energy for anything, so the word must mean lacking strength.
酸痛/1 | 爬了一天山腿下不了楼 | After a day of climbing his legs hurt too much for the stairs, so the word must mean aching.
僵硬/1 | 坐了一上午肩膀后背 | After a morning at the computer his shoulders and back feel hard to move, so the word must mean stiff.
脸颊/1 | 小女孩冻得通红 | The little girl's face is red with cold, so the word must mean cheek.
口疮/1 | 熬夜嘴里长了好几个 | He has been staying up late and has sores in his mouth that hurt when he eats, so the word must mean mouth ulcer.
冻疮/1 | 冬天没暖气手上长 | Homes once had no heating in winter and many children's hands got sores from cold, so the word must mean chilblain.
痊愈/1 | 病完全好了没有症状 | He has no symptoms left at all, so the word must mean to recover fully.
安然无恙/1 | 车翻了人都没事 | The car rolled off the road, but luckily everyone inside was unhurt, so the word must mean safe and sound.
后遗症/1 | 大病留下走路不稳 | A serious childhood illness left him unsteady on his feet, so the word must mean after-effect.
瘫痪/1 | 车祸下半身只能坐轮椅 | Since the car accident he can only use a wheelchair, so the word must mean paralysis.
偏瘫/1 | 中风后左手左腿不能动 | Since Grandpa's stroke his left hand and leg cannot move, so the word must mean hemiplegia.
复发/1 | 病刚好要防止再犯 | He has just recovered and the doctor warns him to rest, so the word must mean to relapse.
并发症/1 | 糖尿病控制不好会引起 | Badly controlled diabetes leads to many other problems, so the word must mean complication.
好转/1 | 吃了几天药咳嗽 | After a few days of medicine his cough is clearly better, so the word must mean to improve.
恢复期/1 | 手术后三个月不能剧烈运动 | For three months after the operation he must avoid hard exercise, so the word must mean recovery period.
疗养/1 | 病好后去海边住一个月 | After his illness he spent a month resting at a seaside home, so the word must mean to convalesce.
腺体/1 | 有的分泌汗水有的分泌消化液 | Some of them in the body produce sweat, others digestive juices, so the word must mean gland.
汗腺/1 | 狗身上很少靠舌头散热 | Dogs have few of them and cool down by putting out their tongues, so the word must mean sweat gland.
甲状腺/1 | 缺碘会引起肿大 | Lack of iodine makes it swell, so the word must mean thyroid.
胰腺/1 | 在胃的后面分泌消化液 | It lies behind the stomach and makes digestive juice, so the word must mean pancreas.
胰岛素/1 | 糖尿病人注射控制血糖 | Some diabetics inject it every day to control blood sugar, so the word must mean insulin.
肩膀/1 | 儿子坐在爸爸的上面 | The father lets his son sit up there to watch the show, so the word must mean shoulder.
骨骼/1 | 多晒太阳有利于发育 | Sunlight helps growing children's bones develop, so the word must mean skeleton.
内分泌/1 | 脸上长痘因为失调 | The doctor says his spots come from a hormone imbalance, not spicy food, so the word must mean endocrine.
脊柱/1 | 坐时腰背要直保护好 | Sitting with a straight back protects it, so the word must mean spine.
消化道/1 | 食物从嘴里经过它被吸收 | Food passes from the mouth along it and is digested step by step, so the word must mean digestive tract.
厕所/1 | 附近有吗，我想洗个手 | The speaker wants to wash their hands and asks where one is nearby, so the word must mean toilet.
公厕/1 | 公园新建了几座 | The park has built several new ones for visitors, so the word must mean public toilet.
旱厕/1 | 老式的改成水冲厕所 | The village replaced the old kind with flush toilets, so the word must mean dry toilet.
肥皂/1 | 奶奶用它洗衣服 | Grandma prefers it to washing powder for laundry, so the word must mean soap.
香皂/1 | 洗脸后有淡淡花香 | After washing her face with it she smells faintly of flowers, so the word must mean toilet soap.
漱口/1 | 吃完饭用清水 | After eating it is best to rinse with clean water, so the word must mean to rinse the mouth.
排泄物/1 | 病人的要消毒处理 | Patients' waste must be disinfected to stop germs spreading, so the word must mean excreta.
下水道/1 | 不要把油倒进去会堵 | Oil poured down it will block it in time, so the word must mean sewer.
污水处理/1 | 工厂废水排进河前要经过 | Factory wastewater must be cleaned before entering the river, so the word must mean sewage treatment.
化粪池/1 | 农村修了以后脏东西不进河 | Since the village built them, toilet waste no longer flows into the river, so the word must mean septic tank.
霉斑/1 | 墙角一片黑色的 | A black patch in the corner of the wall must be wiped off with disinfectant, so the word must mean mildew spot.
霉味/1 | 很久没开窗的屋子里 | A room with its windows shut for a long time smells of it, so the word must mean musty smell.
霉变/1 | 花生产生有毒物质 | Peanuts in this state produce poison and must never be eaten, so the word must mean mouldy.
滋生/1 | 垃圾不清理容易生出蚊虫 | Rubbish left in summer attracts mosquitoes, so the word must mean to breed.
灭蝇/1 | 饭店不让苍蝇落在食物上 | In summer restaurants must keep flies off the food, so the word must mean to exterminate flies.
蚊虫/1 | 夏夜很多穿长袖 | On summer nights it is best to wear long sleeves, so the word must mean insects.
灭鼠/1 | 预防鼠疫开展活动 | The village campaigned against rats to prevent plague, so the word must mean rodent control.
白蚁/1 | 木头柱子被吃空了 | The wooden pillars of the old house have been eaten hollow, so the word must mean termite.
驱虫/1 | 去野外带上药水 | Take a lotion when going out into the wild in summer, so the word must mean to repel insects.
蝇拍/1 | 一下就打死了苍蝇 | He killed the fly with one swat, so the word must mean fly swatter.
污垢/1 | 洗澡洗去身上的 | A bath washes it off the body, so the word must mean dirt.
水垢/1 | 烧水锅底白色的一层 | A white layer forms in the bottom of a kettle used for a long time, so the word must mean scale.
牙垢/1 | 每半年洗牙清理 | He has his teeth cleaned every six months, so the word must mean tartar.
污渍/1 | 白衬衫上咖啡留下的 | Coffee has left a mark on the white shirt that is hard to wash out, so the word must mean stain.
油渍/1 | 厨房墙上要用热水洗 | The kitchen wall needs hot water to clean, so the word must mean grease stain.
污秽/1 | 小河曾经满是脏东西 | The stream was once filthy but is clear again after the clean-up, so the word must mean filth.
洗涤/1 | 毛衣只能冷水手工 | The sweater may only be washed by hand in cold water, so the word must mean to wash.
洗涤剂/1 | 洗碗用的要冲干净 | What is used to wash dishes must be rinsed off, so the word must mean detergent.
擦拭/1 | 每天用湿布擦桌子 | Every day she goes over the table and door handles with a damp cloth, so the word must mean to wipe.
去污/1 | 肥皂衣领黑印一洗就掉 | The dark marks on a collar come off with one wash, so the word must mean to remove stains.
孕妇/1 | 公交车上留给老人和她们的座位 | Buses keep seats for old people and expectant mothers, so the word must mean pregnant woman.
孕期/1 | 医生提醒注意营养 | The doctor reminds her to eat well and rest while expecting, so the word must mean pregnancy.
哺乳/1 | 母婴室方便妈妈给孩子 | The mall has a room where mothers can feed their babies, so the word must mean to breastfeed.
母乳/1 | 新生儿最好的食物 | The doctor says it is the best food for a newborn, so the word must mean breast milk.
哺育/1 | 黄河像母亲一样养育人民 | The Yellow River has fed the people on its banks like a mother, so the word must mean to nurture.
婴幼儿/1 | 药不适合他们只能大人吃 | The medicine is for adults only, so the word must mean infants.
新生儿/1 | 护士给每个戴小手环 | The nurse puts a band with the mother's name on each baby, so the word must mean newborn.
产检/1 | 每月去医院看孩子长得好不好 | Every month she goes to hospital to see how the baby is growing, so the word must mean antenatal check-up.
早产/1 | 比预产期早一个多月 | The child was born over a month before the due date, so the word must mean premature birth.
乳牙/1 | 六七岁开始一颗颗掉 | Children start losing them one by one at six or seven, so the word must mean milk tooth.
膳食/1 | 营养师安排学生的 | A nutritionist plans what pupils eat in the canteen, so the word must mean diet.
补钙/1 | 老人多喝牛奶 | Old people's bones break easily and the doctor advises more milk, so the word must mean to supplement calcium.
钙片/1 | 奶奶晚饭后吃一片 | Grandma takes one tablet after supper every day, so the word must mean calcium tablet.
碘盐/1 | 山区吃它预防甲状腺肿大 | Eating it in inland mountain areas prevents a swollen thyroid, so the word must mean iodised salt.
缺碘/1 | 长期会使甲状腺变大 | Going without it for a long time enlarges the thyroid, so the word must mean iodine deficiency.
咀嚼/1 | 牙不好嚼硬东西很吃力 | The old man's teeth are bad and hard food is a struggle, so the word must mean to chew.
细嚼慢咽/1 | 吃饭太快对胃不好 | Eating too fast is bad for the stomach, so the word must mean to chew well and swallow slowly.
营养均衡/1 | 每顿有菜有肉 | Every meal should have both vegetables and meat, so the word must mean balanced nutrition.
滋补/1 | 冬天吃补身体的食物 | Chinese medicine says winter is the time for food that builds the body up, so the word must mean to nourish.
乳制品/1 | 牛奶、酸奶 | Milk and yoghurt are examples, so the word must mean dairy product.
上瘾/1 | 游戏玩了几天就 | The game is fun enough that after a few days he could not stop, so the word must mean to get addicted.
成瘾/1 | 吸烟容易 | Smoking is hard to stop once begun, and it is best never to start, so the word must mean addiction.
网瘾/1 | 每天上网十几个小时 | He spends over ten hours online every day, so the word must mean internet addiction.
烟瘾/1 | 爷爷以前很大后来戒了 | Grandpa once smoked heavily and finally quit for his health, so the word must mean craving for tobacco.
吸烟区/1 | 机场里专门的 | Smoking is banned everywhere in the airport except in special places, so the word must mean smoking area.
控烟/1 | 公共场所禁止吸烟的条例 | Many cities have banned smoking in public places, so the word must mean tobacco control.
戒除/1 | 下决心去掉熬夜的习惯 | He has resolved to break his habit of staying up late, so the word must mean to give up.
自控/1 | 小孩子能力比较弱 | Young children find it hard to limit their own time online, so the word must mean self-control.
烟民/1 | 数量逐年下降 | With campaigns against smoking, their number falls every year, so the word must mean smoker.
沉迷/1 | 玩手机游戏成绩下降 | His marks dropped sharply because of phone games, so the word must mean to be addicted to.
公共卫生/1 | 干净饮用水是它的基础 | Clean drinking water is the basis of it, so the word must mean public health.
疾控中心/1 | 发现传染病要马上报告 | Hospitals must report cases of infectious disease to it at once, so the word must mean disease control centre.
卫生院/1 | 村民小病去镇上的 | Villagers with minor illnesses go to the clinic in town, so the word must mean township hospital.
防疫站/1 | 以前打预防针要去 | Children once went there for vaccinations, though most now go to community clinics, so the word must mean epidemic prevention station.
家庭医生/1 | 社区给老人安排随时打电话 | The community gives every elderly household one to call at any time, so the word must mean family doctor.
卫生部门/1 | 每年检查饭店厨房 | Every year it inspects restaurant kitchens for cleanliness, so the word must mean health department.
基层医疗/1 | 村民在家门口就能看病 | Villagers can see a doctor right on their doorstep, so the word must mean primary health care.
医疗卫生/1 | 国家每年投入大量资金 | The state puts large sums into it every year, so the word must mean medical and health services.
卫生监督/1 | 人员检查厨房和餐具 | Inspectors came to check the restaurant's kitchen and tableware, so the word must mean health supervision.
赤脚医生/1 | 一边种地一边看病 | Grandpa once farmed and treated villagers at the same time, so the word must mean barefoot doctor.
发病率/1 | 冬天流感比夏天高 | Flu strikes far more people in winter than in summer, so the word must mean incidence rate.
患病率/1 | 中学生近视一半以上 | Over half of secondary pupils wear glasses for short sight, so the word must mean prevalence.
感染率/1 | 常洗手的人更低 | People who wash their hands often catch gut infections far less, so the word must mean infection rate.
死亡率/1 | 新生儿的大大降低 | Better medicine has greatly reduced the number of newborns who die, so the word must mean death rate.
治愈率/1 | 发现得早可达百分之九十以上 | Caught early, over ninety per cent of patients recover, so the word must mean cure rate.
流行病学/1 | 研究传染病在人群中怎样传播 | She studies how infectious diseases spread through populations, so the word must mean epidemiology.
抽样/1 | 只调查了一千个家庭 | The survey studied only a thousand families, so the word must mean sampling.
统计数据/1 | 根据卫生部门的流感少了 | Health department figures show fewer flu patients than last year, so the word must mean statistical data.
健康状况/1 | 坚持锻炼越来越好 | Since retiring he has kept exercising and feels better and better, so the word must mean state of health.
高发/1 | 春季是流感的季节 | Spring is when flu strikes most, so the word must mean high incidence.
化石燃料/1 | 煤、石油、天然气用完就没了 | Coal, oil and gas will be gone once they are used up, so the word must mean fossil fuel.
无烟煤/1 | 燃烧时几乎不冒烟 | It gives off almost no smoke and was once burned in stoves, so the word must mean anthracite.
原油/1 | 从油井里开采出来要加工 | What comes out of an oil well is sent to a plant for processing, so the word must mean crude oil.
柴油/1 | 大卡车和拖拉机烧的 | Trucks and tractors mostly burn it instead of petrol, so the word must mean diesel.
煤油/1 | 农村没电晚上点的灯 | Villages without electricity once lit lamps with it at night, so the word must mean kerosene.
页岩气/1 | 美国大量开采天然气增加 | American gas output soared once it was extracted on a large scale, so the word must mean shale gas.
液化气/1 | 没通天然气用罐装的 | Where there is no piped gas, people cook with it from canisters, so the word must mean liquefied gas.
火力发电/1 | 中国的电主要靠烧煤 | Most of China's electricity comes from burning coal, so the word must mean thermal power generation.
油田/1 | 大庆是有名的石油产地 | Daqing is a famous source of Chinese oil, so the word must mean oilfield.
煤层/1 | 埋得不深开采容易 | The coal here lies not far below ground and is easy to mine, so the word must mean coal seam.
勘探/1 | 地质队在山区找到铜矿 | The geology team searched the mountains for three years and found copper, so the word must mean to prospect.
勘测/1 | 修铁路前测量地形 | Engineers measure the land along the route before a railway is built, so the word must mean to survey.
开采/1 | 煤矿挖了一百多年 | The mine has been worked for over a century and the coal is nearly gone, so the word must mean to extract.
挖掘/1 | 用机器挖地基 | Workers dig the foundations with machines, so the word must mean to excavate.
矿产/1 | 地下有煤、铁、铜 | The country has rich deposits of coal, iron and copper underground, so the word must mean mineral resources.
露天矿/1 | 不用打井就能开采 | The coal lies just below the surface and can be mined without shafts, so the word must mean open-pit mine.
矿井/1 | 坐升降机下到几百米深 | Workers ride a lift hundreds of metres down every day, so the word must mean mine shaft.
矿工/1 | 爷爷在井下挖了二十年煤 | Grandpa dug coal underground for twenty years, so the word must mean miner.
储量/1 | 油田的石油可以开采几十年 | The oilfield holds enough to be worked for decades, so the word must mean reserves.
选矿/1 | 去掉没用的石头 | Useless rock must first be removed from the ore, so the word must mean ore dressing.
锡/1 | 青铜是铜和它的合金 | Ancient bronze was copper mixed with it, so the word must mean tin.
镍/1 | 美国五分钱硬币里含有 | The American five-cent coin contains it and is named after the metal, so the word must mean nickel.
钴/1 | 烧出青花瓷的蓝色颜料 | Ancient craftsmen used a pigment with it to make blue-and-white porcelain, so the word must mean cobalt.
锰/1 | 炼钢加入使钢更硬 | Adding it makes steel harder and more wear-resistant, so the word must mean manganese.
汞/1 | 老式体温计里的银色液体 | The silver liquid in old thermometers must be handled carefully if broken, so the word must mean mercury.
铀/1 | 核电站用作燃料 | Nuclear power stations burn it as fuel, so the word must mean uranium.
硫/1 | 火山口附近黄色的 | Yellow deposits are often seen near volcanoes, so the word must mean sulphur.
稀土/1 | 中国产量世界最多 | China produces more of it than any other country, so the word must mean rare earth.
有色金属/1 | 铜、铝、锡 | Copper, aluminium and tin belong to them, so the word must mean non-ferrous metal.
贵金属/1 | 金、银做首饰 | Gold and silver are often made into jewellery, so the word must mean precious metal.
铁矿/1 | 炼钢需要大量从国外进口 | Steelmaking needs huge amounts and China imports much of it, so the word must mean iron ore.
铜矿/1 | 智利有世界上最大的 | Chile has the world's largest and leads the world in copper output, so the word must mean copper mine.
金矿/1 | 加州发现后人们去淘金 | When it was found in California, people rushed there to pan for gold, so the word must mean gold mine.
铁水/1 | 高炉里流出通红的 | Glowing red liquid pours from the blast furnace, so the word must mean molten iron.
钢水/1 | 炼钢炉里一千六百多度 | The liquid in the steel furnace is over sixteen hundred degrees, so the word must mean molten steel.
锡器/1 | 茶叶罐保存茶叶好 | The tea caddy keeps tea well, so the word must mean tinware.
水银/1 | 温度计里遇热膨胀 | The liquid in a thermometer expands when heated, so the word must mean mercury.
锡纸/1 | 烤红薯时包起来 | Sweet potatoes can be wrapped in it for roasting, so the word must mean tinfoil.
锰钢/1 | 又硬又耐磨做铁轨 | It is hard and wear-resistant and often used for rails, so the word must mean manganese steel.
钢材/1 | 盖大楼用了几万吨 | The building used tens of thousands of tonnes of it, so the word must mean steel.
柴火/1 | 以前农村做饭烧的 | Village children once went up the hill after school to gather fuel for cooking, so the word must mean firewood.
木柴/1 | 放进壁炉屋里暖和 | He put logs in the fireplace and the room soon warmed up, so the word must mean firewood.
火苗/1 | 风吹炉子里又旺 | A gust of wind makes the fire in the stove blaze again, so the word must mean flame.
薪火相传/1 | 手艺在家里传了五代 | The craft has been handed down in the family for five generations, so the word must mean to pass down from generation to generation.
焰火/1 | 新年晚上广场放起 | On New Year's night beautiful displays light up the square, so the word must mean fireworks.
火焰/1 | 蓝色说明燃烧充分 | Blue fire in the stove shows that it is burning fully, so the word must mean flame.
杯水车薪/1 | 几十万医药费，这点捐款 | The family's medical bills run to hundreds of thousands and the donation is tiny by comparison, so the word must mean far too little to help.
秸秆/1 | 收完庄稼在地里烧，现在禁止 | Farmers used to burn crop stalks in the fields after harvest, which is now banned, so the word must mean straw.
生物质/1 | 秸秆、树枝属于这种能源 | Crop stalks and branches are this kind of energy source, so the word must mean biomass.
烧柴/1 | 用上天然气很少有人再 | With gas now in every home, few villagers cook over wood fires, so the word must mean to burn firewood.
炉灶/1 | 新厨房装上新的 | A new cooker has been fitted in the new kitchen, so the word must mean kitchen range.
灶台/1 | 做完饭擦得干干净净 | After cooking, Mother wiped the cooking surface clean, so the word must mean stove top.
煤炉/1 | 生在屋里要防煤气中毒 | Those who heated rooms this way in winter had to open windows against gas poisoning, so the word must mean coal stove.
火炉/1 | 一家人围坐聊天 | In winter the family sit chatting around the fire, so the word must mean stove, fireside.
烟囱/1 | 工厂冒着黑烟 | Black smoke pours from the factory's tall pipe, so the word must mean chimney.
炊烟/1 | 天快黑村里升起 | At dusk smoke rises from every kitchen in the village, so the word must mean smoke from cooking.
炊具/1 | 露营带上帐篷和 | Campers take a tent and simple pots and pans, so the word must mean cookware.
烘干/1 | 下雨天衣服用机器弄干 | On rainy days clothes will not dry outside and a machine must do it, so the word must mean to dry.
烘烤/1 | 面包放进烤箱二十分钟 | The bread goes in the oven for twenty minutes, so the word must mean to bake.
燃气灶/1 | 用完一定关好开关 | Always turn it off after use, so the word must mean gas stove.
发电站/1 | 发出的电够一百万户用 | Its electricity supplies a million homes, so the word must mean power station.
电网/1 | 风电要接入才能送到千家万户 | Power from wind farms must join it to reach every home, so the word must mean power grid.
输电/1 | 西部的电通过线路送到东部 | Power from the west travels along long lines to eastern cities, so the word must mean power transmission.
停电/1 | 晚上突然没电 | Last night the lights suddenly went out and we used our phones for light, so the word must mean power cut.
用电量/1 | 夏天开空调城市增加 | Many people use air conditioning in summer and the city needs much more power, so the word must mean power consumption.
千瓦/1 | 空调的功率是两 | The air conditioner's power is two of these units, so the word must mean kilowatt.
瓦特/1 | 改良蒸汽机的英国人 | The Englishman who improved the steam engine gave his name to the unit of power, so the word must mean watt.
变电站/1 | 高压电降低电压 | High voltage must be lowered there before entering homes, so the word must mean substation.
高压线/1 | 不要在下面放风筝 | Flying a kite beneath them is very dangerous, so the word must mean high-voltage line.
电闸/1 | 修电灯前先拉下来 | Before mending a lamp, first switch off the power at the main, so the word must mean main switch.
水力发电/1 | 三峡大坝是世界最大的 | The Three Gorges Dam is the world's largest project of its kind, so the word must mean hydroelectric power.
水能/1 | 河落差大水量多资源丰富 | The river has a big drop and much water, so the word must mean hydropower.
落差/1 | 瀑布上下一百多米 | The waterfall falls over a hundred metres, so the word must mean drop in height.
闸门/1 | 大雨后水库打开放水 | After heavy rain the reservoir opens its gates to let water out, so the word must mean sluice gate.
水闸/1 | 河上控制下游水量 | A structure built on the river controls the water downstream, so the word must mean sluice.
船闸/1 | 轮船通过它从下游到上游 | Ships pass through it from below the dam to above, so the word must mean ship lock.
涡轮机/1 | 水流冲击它带动发电机 | Flowing water spins it and it drives the generator, so the word must mean turbine.
水轮机/1 | 水电站里被水流冲着转 | Water flowing through the hydropower station spins it fast, so the word must mean water turbine.
都江堰/1 | 两千年前的水利工程灌溉成都 | Built over two thousand years ago, it still waters the Chengdu Plain, so the word must mean Dujiangyan.
抽水/1 | 天旱用水泵从河里 | In drought farmers use pumps to take water from the river, so the word must mean to pump water.
潮汐/1 | 由月亮和太阳引力引起 | It is caused by the pull of the moon and sun, so the word must mean tide.
潮汐能/1 | 海水涨落产生的可以发电 | The rise and fall of the sea can generate electricity, so the word must mean tidal energy.
涨潮/1 | 海水会盖住沙滩 | The sea will cover the beach and visitors should leave early, so the word must mean rising tide.
退潮/1 | 海边露出大片沙滩 | Afterwards a wide stretch of beach appears, so the word must mean ebb tide.
风力发电/1 | 草原风大适合发展 | The grassland is very windy, so the word must mean wind power.
风电场/1 | 几十台大风车不停转 | Dozens of big turbines turn without stopping by the sea, so the word must mean wind farm.
螺旋桨/1 | 小飞机的转得飞快 | The small plane's blades spin fast as it moves down the runway, so the word must mean propeller.
叶片/1 | 风力发电机的长几十米 | Those of a large wind turbine are tens of metres long, so the word must mean blade.
船桨/1 | 用力划着小船到对岸 | He rowed hard and the boat soon reached the other bank, so the word must mean oar.
海上风电/1 | 不占陆地风更大更稳 | It takes no land and the wind at sea is stronger and steadier, so the word must mean offshore wind power.
光伏/1 | 农民屋顶装的板 | Many farmers put panels on their roofs and sell the electricity to the grid, so the word must mean photovoltaic.
可再生能源/1 | 风能、太阳能、水能用不完 | Wind, sun and water will never run out, so the word must mean renewable energy.
清洁能源/1 | 代替煤减少污染 | Using it instead of coal reduces air pollution, so the word must mean clean energy.
新能源汽车/1 | 车牌是绿色的 | In China they have green number plates, so the word must mean new energy vehicle.
氢能/1 | 燃烧以后只产生水 | Burning it produces only water, so the word must mean hydrogen energy.
地热/1 | 冰岛用来发电取暖 | Iceland uses heat from underground for power and warmth, so the word must mean geothermal heat.
储能/1 | 把白天的电存起来 | Solar panels make no power at night and daytime electricity must be kept, so the word must mean energy storage.
太阳能热水器/1 | 屋顶上晴天洗澡不花电费 | On sunny days a bath costs nothing in electricity with one on the roof, so the word must mean solar water heater.
动力电池/1 | 电动汽车最贵的部分 | It is often the most expensive part of an electric car, so the word must mean power battery.
充电站/1 | 服务区开电动车方便 | Motorway service areas have them, which makes long trips by electric car easy, so the word must mean charging station.
核燃料/1 | 铀是最常用的 | Uranium is the one most used in nuclear power stations, so the word must mean nuclear fuel.
核反应堆/1 | 核电站的心脏 | Nuclear fission goes on in the heart of the power station at every moment, so the word must mean nuclear reactor.
浓缩铀/1 | 天然铀加工以后 | Natural uranium must be processed before it can be nuclear fuel, so the word must mean enriched uranium.
放射性/1 | 铀长时间接触损害健康 | Long contact with uranium harms health, so the word must mean radioactivity.
核废料/1 | 要密封起来埋在地下 | It must be sealed and buried deep underground, so the word must mean nuclear waste.
核泄漏/1 | 大地震后日本核电站发生 | After the great earthquake a Japanese nuclear plant released radiation, so the word must mean nuclear leak.
核安全/1 | 核电站必须放在第一位 | A nuclear power station must put it first, so the word must mean nuclear safety.
核聚变/1 | 太阳发光发热靠的是 | The sun's light and heat come from it, so the word must mean nuclear fusion.
铀矿/1 | 开采出来的铀要加工 | Uranium dug from it must be processed into fuel, so the word must mean uranium mine.
核辐射/1 | 核电站工作的人穿防护服防止 | Nuclear plant workers wear protective suits against it, so the word must mean nuclear radiation.
干涸/1 | 三年没下雨小河已经 | After three years without rain the stream has no water left, so the word must mean to dry up.
汲取/1 | 树根从土里吸收水分 | Tree roots take water and nutrients from the soil, so the word must mean to absorb.
汲水/1 | 古人用木桶从井里 | In ancient times people used wooden buckets at the well, so the word must mean to draw water.
地下水/1 | 过度抽取地面会下沉 | Pumping too much of it makes the ground slowly sink, so the word must mean groundwater.
淡水/1 | 地球上只占很小一部分 | Most water on earth is sea water and only a little is not salty, so the word must mean fresh water.
缺水/1 | 居民每天只能用很少的水 | Residents here can use only a little water each day, so the word must mean to lack water.
节水/1 | 洗菜的水浇花 | Water from washing vegetables can be used on the flowers, so the word must mean to save water.
水库/1 | 城市自来水来自郊区的 | The city's tap water comes mainly from one in the suburbs, so the word must mean reservoir.
打井/1 | 没有自来水自己取水 | The village has no tap water and the villagers dig their own, so the word must mean to sink a well.
浊/1 | 大雨后河水又黄又 | After the heavy rain the river is yellow and muddy, so the word must mean turbid.
二氧化硫/1 | 燃煤产生形成酸雨 | Gas from burning coal is the main cause of acid rain, so the word must mean sulphur dioxide.
硫黄/1 | 制造火药的原料之一 | It is one of the ingredients of gunpowder, so the word must mean sulphur.
烟尘/1 | 装了除尘设备排出的少了 | Since dust filters were fitted, the factory gives off much less, so the word must mean soot.
废渣/1 | 工厂的不能随便堆放 | The factory's solid waste must be taken to a special site, so the word must mean waste residue.
炉渣/1 | 炼铁产生的可以做水泥 | What is left from smelting iron can be made into cement, so the word must mean slag.
煤渣/1 | 下雪后铺在路上防滑 | After snow people used to spread it on roads to stop slipping, so the word must mean cinder.
废气/1 | 工厂排放的含有害气体 | What the factory gives off contains harmful gases and must be treated, so the word must mean waste gas.
汞污染/1 | 湖受污染鱼不能吃 | The fish in the lake are unsafe to eat, so the word must mean mercury pollution.
污浊/1 | 屋里人多空气 | With many people in the room the air is stale, so the word must mean foul.
排污/1 | 工厂偷偷向河里 | The factory was heavily fined for secretly releasing waste into the river, so the word must mean to discharge pollutants.
耗能/1 | 老式冰箱一个月用很多电 | The old fridge uses a lot of electricity every month, so the word must mean to consume energy.
能耗/1 | 新生产线降低三成 | The new production line cut the factory's energy use by thirty per cent, so the word must mean energy consumption.
节约用电/1 | 离开教室随手关灯 | Turning off the lights when leaving the classroom is a good habit, so the word must mean to save electricity.
节能灯/1 | 换掉普通灯泡省电费 | Replacing ordinary bulbs with them cuts the electricity bill, so the word must mean energy-saving lamp.
碳中和/1 | 很多国家提出本世纪中叶实现 | Many countries aim for it by the middle of the century, so the word must mean carbon neutrality.
隔热/1 | 窗户夏天屋里不热 | The windows keep the room from getting too hot in summer, so the word must mean heat insulation.
暖气片/1 | 湿衣服放在上面很快干 | Wet clothes laid on it in winter dry quickly, so the word must mean radiator.
热水器/1 | 洗澡前先打开 | It must be switched on before a shower to warm the water, so the word must mean water heater.
待机/1 | 电视不看也耗电 | A television not being watched still uses power if left plugged in, so the word must mean standby.
电表/1 | 每月来查用了多少度电 | Every month someone checks how much electricity the household used, so the word must mean electricity meter.
耗尽/1 | 石油总有一天会用完 | Oil will run out one day and new energy should be developed early, so the word must mean to exhaust.
储备/1 | 国家存了大量石油以防万一 | The state keeps large amounts of oil just in case, so the word must mean to stockpile.
不可再生/1 | 煤和石油用一点少一点 | Every bit of coal or oil used leaves less behind, so the word must mean non-renewable.
稀缺/1 | 沙漠里水最 | In the desert water is the hardest resource to find, so the word must mean scarce.
过度开采/1 | 矿山资源很快用完 | The mine's resources were used up quickly, so the word must mean over-exploitation.
能源危机/1 | 七十年代石油价格大涨 | Oil prices shot up suddenly in the nineteen-seventies, so the word must mean energy crisis.
能源结构/1 | 减少煤增加清洁能源 | China is reducing coal and increasing clean energy, so the word must mean energy structure.
竭泽而渔/1 | 为眼前利益过度开采 | Overusing resources for short-term gain leaves nothing for later, so the word must mean to kill the goose that lays the golden eggs.
开源节流/1 | 一方面引水一方面节水 | The city both brings in water and saves it, so the word must mean to increase income and reduce spending.
循环利用/1 | 废纸、塑料瓶都可以 | Waste paper and plastic bottles can be used again, so the word must mean to recycle.
炼油/1 | 厂每年加工一千万吨原油 | The plant processes ten million tonnes of crude oil a year, so the word must mean oil refining.
输油管/1 | 几千公里把石油送到沿海 | It carries oil thousands of kilometres from the oilfield to the coast, so the word must mean oil pipeline.
油井/1 | 每天产几十吨原油 | It produces dozens of tonnes of crude oil a day, so the word must mean oil well.
钻井/1 | 用机器寻找地下石油 | Workers use machines to bore into the ground looking for oil, so the word must mean to drill a well.
阀门/1 | 修水管前先关上总 | Before mending the pipes, first turn off the main one, so the word must mean valve.
油罐/1 | 加油站地下储存汽油 | Petrol is stored in several large ones buried under the station, so the word must mean oil tank.
瓦斯/1 | 煤矿里爆炸后果严重 | An explosion of it in a coal mine has terrible results, so the word must mean gas.
安全阀/1 | 高压锅压力太大自动放气 | It lets steam out of the pressure cooker when the pressure is too high, so the word must mean safety valve.
石油化工/1 | 塑料、化肥是它的产品 | Many plastics and fertilisers come from this industry, so the word must mean petrochemical industry.
油轮/1 | 港口卸下中东运来的原油 | A huge ship is unloading crude oil from the Middle East at the port, so the word must mean oil tanker.
桥墩/1 | 立在江底承受桥的重量 | It stands on the riverbed and carries the weight of the whole bridge, so the word must mean pier.
拱桥/1 | 和水中倒影合起来像一个圆 | Together with its reflection in the water the bridge forms a circle, so the word must mean arch bridge.
石拱桥/1 | 河北一千四百多年前建成 | The Hebei bridge built over fourteen hundred years ago is still in use, so the word must mean stone arch bridge.
吊桥/1 | 走在上面脚下木板一直动 | The planks keep moving underfoot over the valley and he dares not look down, so the word must mean suspension footbridge.
斜拉桥/1 | 桥塔上很多斜着的钢索 | Many slanting steel cables run from its towers to hold the deck, so the word must mean cable-stayed bridge.
悬索桥/1 | 金门大桥是有名的 | San Francisco's Golden Gate Bridge is a famous example, so the word must mean suspension bridge.
跨度/1 | 桥一千多米中间没有桥墩 | The bridge stretches over a thousand metres without a single pier, so the word must mean span.
桥面/1 | 下雪以后很滑 | After snow the surface of the bridge is slippery for drivers, so the word must mean bridge deck.
立交桥/1 | 车不用等红绿灯 | Cars going different ways need not stop at traffic lights, so the word must mean interchange.
高架/1 | 避开地面堵车开上 | He drove up onto the raised road to avoid the jams below, so the word must mean elevated.
隧道/1 | 火车开进去窗外变黑 | The train entered and it suddenly went dark outside the window, so the word must mean tunnel.
涵洞/1 | 公路下面水从那流过 | Water flows under the road through them in heavy rain, so the word must mean culvert.
盾构机/1 | 在地下挖土安装隧道墙 | Underground, the huge machine digs soil and fits tunnel walls at the same time, so the word must mean tunnel boring machine.
路基/1 | 大雨冲坏铁路停运 | Heavy rain washed away what the railway rests on and trains stopped, so the word must mean roadbed.
收费站/1 | 开上高速前要经过 | Drivers pass through it before getting onto the motorway, so the word must mean toll station.
车道/1 | 高速公路来回各三条 | The motorway has six, three in each direction, so the word must mean lane.
弯道/1 | 山路上很多开车要慢 | The mountain road twists a great deal and drivers must go slowly, so the word must mean bend.
坡度/1 | 路太陡骑车上不去 | The road is too steep to cycle up, so the word must mean gradient.
绕行/1 | 前面修路车辆请 | The road ahead is being repaired and vehicles must go another way, so the word must mean to detour.
路面/1 | 下过雨很滑走路小心 | After rain the ground underfoot is slippery, so the word must mean road surface.
枢纽/1 | 好几条铁路在这里交会 | Several railway lines meet in this city, so the word must mean hub.
纽带/1 | 语言是人与人沟通的 | Language connects people to each other, so the word must mean link, bond.
纽扣/1 | 大衣掉了一颗 | One came off his coat and his mother sewed it back on, so the word must mean button.
中枢/1 | 大脑是神经系统的 | The brain controls the nervous system, so the word must mean centre.
渡口/1 | 没有桥要去坐船过江 | Before the bridge, people went there to take a boat across the river, so the word must mean ferry crossing.
渡轮/1 | 每天坐它到对岸上班 | Every morning many people cross to work on it, so the word must mean ferry.
渡船/1 | 老人撑着小船送村民过河 | The old man poles a small boat to take villagers across the river, so the word must mean ferry boat.
摆渡/1 | 在河上送人过河三十年 | He has carried people across this river by boat for thirty years, so the word must mean to ferry.
过渡/1 | 从小学到中学的阶段 | Children need time to adjust between primary and secondary school, so the word must mean transition.
远渡重洋/1 | 十八岁就到国外留学 | At eighteen he went overseas to study, so the word must mean to travel across the seas.
打桩/1 | 工地机器声音很远都能听到 | The machine's pounding on the building site can be heard far away, so the word must mean to drive piles.
木桩/1 | 绳子系在河边的 | He tied the rope to a post by the river, so the word must mean wooden stake.
桩基/1 | 高楼要打很深才稳 | Tall buildings need deep supports to stand firm, so the word must mean pile foundation.
塔吊/1 | 工地上往楼顶吊钢材 | Tall machines on the site lift steel to the top of the building, so the word must mean tower crane.
吊车/1 | 把出事汽车从沟里吊上来 | A vehicle lifted the crashed car out of the ditch, so the word must mean crane.
起重机/1 | 港口吊集装箱上船 | Big machines at the port lift containers onto ships one by one, so the word must mean crane.
起吊/1 | 十几吨重的零件要吊起来 | The part weighs over ten tonnes and needs a large machine to raise it, so the word must mean to hoist.
吊装/1 | 最后一段桥面装上 | The last section of deck was lifted into place and the bridge was joined, so the word must mean to hoist into position.
撑杆跳/1 | 拿着长杆跳过五米多 | The athlete runs a few steps with a long pole and clears over five metres, so the word must mean pole vault.
充电桩/1 | 停车场电动车充电方便 | The estate car park has a dozen of them for electric cars, so the word must mean charging pile.
缝隙/1 | 阳光从门的照进来 | Sunlight came in through a crack in the door, so the word must mean gap.
间隙/1 | 利用工作的空学外语 | He learned a foreign language in his spare moments at work, so the word must mean interval.
空隙/1 | 书架摆得满满的 | The bookshelf is packed full, so the word must mean gap.
拧紧/1 | 用完水把水龙头关好 | The tap will keep dripping unless it is turned off firmly, so the word must mean to tighten.
拧开/1 | 用力打开瓶盖 | He twisted off the bottle cap and took a big drink, so the word must mean to unscrew.
拧干/1 | 洗完衣服先挤出水再挂 | The water must be twisted out of the washing before it is hung up, so the word must mean to wring out.
撬开/1 | 用刀把罐头盖打开 | The tin lid was too tight and he forced it with a knife, so the word must mean to prise open.
环绕/1 | 小村四面被青山 | Green hills lie on all four sides of the village, so the word must mean to surround.
围绕/1 | 地球绕着太阳转 | The earth travels round the sun, so the word must mean to revolve around.
绕道/1 | 前面修路只好 | The road ahead is being repaired and we have to go another way, so the word must mean to make a detour.
扳手/1 | 爸爸拿它拧紧螺母 | Dad used it to tighten the loose nut on the bicycle, so the word must mean wrench.
钳子/1 | 电工用它剪断电线 | The electrician cut the wire with it, so the word must mean pliers.
锯子/1 | 把木板锯成两半 | He cut the board in two with it, so the word must mean saw.
刨子/1 | 木匠把桌面刨平 | The carpenter made the tabletop flat and smooth with it, so the word must mean plane.
斧头/1 | 把大木头砍成柴 | He chopped the big log into firewood with it, so the word must mean axe.
铲子/1 | 在沙滩上挖沙子 | The children dig in the sand on the beach with small ones, so the word must mean shovel.
电钻/1 | 在墙上打孔挂画 | He made two holes in the wall with it to hang a picture, so the word must mean electric drill.
电锯/1 | 几分钟锯断大木头 | Workers cut through a big log in minutes with it, so the word must mean electric saw.
锅铲/1 | 妈妈炒菜时手里拿的 | Mother holds the wok in one hand and this in the other, so the word must mean spatula.
凿子/1 | 石匠敲着在石头上刻字 | The stonemason taps it with a hammer to carve characters in stone, so the word must mean chisel.
刀刃/1 | 刀用久了变钝 | The knife has been used a long time and its edge is dull, so the word must mean blade.
刀柄/1 | 切菜时握紧 | Hold it tight when chopping vegetables, so the word must mean knife handle.
手柄/1 | 拿着游戏的玩 | He holds the game controller and loses track of time, so the word must mean handle.
把柄/1 | 不让别人抓住任何 | He is careful to give others nothing to use against him, so the word must mean handle, something to use against one.
弹簧/1 | 圆珠笔里按一下笔芯出来 | A ballpoint pen has a little one inside that pushes the refill out, so the word must mean spring.
锯齿/1 | 叶子边上一个个小尖 | The plant's leaves have rows of small points along their edges, so the word must mean sawtooth.
刨花/1 | 木匠工作台下卷卷的 | Curls of wood pile up under the carpenter's bench, so the word must mean wood shavings.
迎刃而解/1 | 找到关键其他困难就 | Once the key to the problem was found, the other difficulties were easily dealt with, so the word must mean to be readily solved.
游刃有余/1 | 管理班级很轻松 | After twenty years of teaching he runs a class with ease, so the word must mean to handle with ease.
刨根问底/1 | 不懂的事一定要问明白 | The child keeps asking until he understands, so the word must mean to get to the root of.
舵手/1 | 风浪大紧握舵 | In the heavy sea he grips the wheel to keep the ship on course, so the word must mean helmsman.
掌舵/1 | 老船长驾驶这条船 | The most experienced captain steers the ship, so the word must mean to steer.
船舵/1 | 船长转动它改变方向 | The captain turns it and the ship slowly changes direction, so the word must mean rudder.
方向舵/1 | 飞机尾部控制方向 | It turns left and right at the plane's tail to control direction, so the word must mean rudder.
游艇/1 | 周末租一条出海玩 | At the weekend they hired one to go out to sea, so the word must mean yacht.
快艇/1 | 海面飞快开过留下白浪 | One races across the sea leaving a white wake, so the word must mean speedboat.
潜艇/1 | 在海底航行好几个月 | It can travel deep under the sea for months, so the word must mean submarine.
救生艇/1 | 大船遇险乘客登上 | When the ship was in danger, passengers climbed into them in turn, so the word must mean lifeboat.
皮划艇/1 | 在湖上比赛谁划得快 | They race each other paddling on the lake, so the word must mean kayak.
舰艇/1 | 海军在海上救援演习 | Navy ships held a rescue exercise at sea, so the word must mean naval vessel.
砌墙/1 | 工人用砖一天砌一米多 | Workers lay bricks and raise over a metre in a day, so the word must mean to build a wall.
堆砌/1 | 作文漂亮词语多内容空 | The essay is full of fine words but empty of content, so the word must mean to pile up.
脚手架/1 | 工人站在上面刷墙 | Workers stand on it outside the building painting the walls, so the word must mean scaffolding.
施工/1 | 前方车辆请慢行 | Work is being done ahead and vehicles should slow down, so the word must mean construction.
工地/1 | 进去一定戴安全帽 | A safety helmet must be worn on entering, so the word must mean construction site.
承重/1 | 柱子千万不能拆 | The pillar holds up the building and must never be removed, so the word must mean load-bearing.
封顶/1 | 大楼建到最高明年住人 | The building reached its full height yesterday and people can move in next year, so the word must mean to top out.
抗震/1 | 房子地震时不容易倒 | Many Japanese houses are designed not to fall in earthquakes, so the word must mean quake-resistant.
拱形/1 | 古老的城门车从下面过 | Vehicles can pass under the curved top of the old gate, so the word must mean arched.
吊顶/1 | 装修客厅还装了灯 | When decorating they lowered the sitting-room ceiling and fitted nice lights, so the word must mean suspended ceiling.
梭子/1 | 织布机前来回飞快穿着 | At the loom it flies back and forth in Grandma's hand, so the word must mean shuttle.
织布机/1 | 工业革命时用蒸汽带动 | In the Industrial Revolution people invented a steam-driven one, so the word must mean loom.
穿梭/1 | 车辆来来往往不停 | Traffic on the street keeps coming and going, so the word must mean to shuttle.
纺车/1 | 妇女把棉花纺成线 | Village women once spun cotton into thread on it, so the word must mean spinning wheel.
活字印刷/1 | 宋朝发明印书更快 | It was invented in the Song and made printing books faster, so the word must mean movable-type printing.
水车/1 | 河边转着把水送进田 | It turns slowly by the river and lifts water into the fields, so the word must mean waterwheel.
筒车/1 | 竹筒把河水提上来 | Bamboo tubes on it lift river water into a trough as it turns, so the word must mean noria.
风箱/1 | 铁匠拉它让炉火更旺 | Blacksmiths pumped it constantly to make the fire burn hotter, so the word must mean bellows.
算盘/1 | 以前会计用它算账 | Shop accountants once did their sums with it, so the word must mean abacus.
地动仪/1 | 张衡发明测地震方向 | Zhang Heng of the Eastern Han invented it to show the direction of earthquakes, so the word must mean seismoscope.
引擎/1 | 网上找资料用搜索 | People look for information online with a search tool of this kind, so the word must mean engine.
蒸汽机/1 | 十八世纪改良推动工业革命 | Its improvement in the eighteenth century drove the Industrial Revolution, so the word must mean steam engine.
内燃机/1 | 汽油机和柴油机都是 | Petrol and diesel motors in cars are both this kind, so the word must mean internal combustion engine.
发动机/1 | 飞机的出了故障 | A fault in the plane's motor forced an emergency landing, so the word must mean engine.
马力/1 | 跑车发动机有五百 | The sports car's engine has five hundred of these units, so the word must mean horsepower.
曲轴/1 | 把上下运动变成转动 | It turns the engine's up-and-down motion into rotation, so the word must mean crankshaft.
涡轮/1 | 发动机装了它增压 | The car's engine has a turbocharger for more power, so the word must mean turbine.
燃烧室/1 | 汽油在里面燃烧 | Petrol burns inside it and drives the engine, so the word must mean combustion chamber.
曲柄/1 | 早期汽车用它摇动启动 | Very early cars had to be started by cranking the engine by hand, so the word must mean crank.
油门/1 | 司机加大车开出去 | The driver pressed the pedal and the car shot off, so the word must mean accelerator.
镀金/1 | 手表不是纯金只是表面 | The watch is not solid gold but only coated with it, so the word must mean gold-plated.
镀银/1 | 餐具亮闪闪里面是铜 | The shiny tableware is really copper inside, so the word must mean silver-plated.
电镀/1 | 厂排出的废水含重金属 | Wastewater from these plants contains heavy metals and must be treated, so the word must mean electroplating.
涂层/1 | 锅有一层不粘的 | Food does not stick to the pan thanks to a special layer, so the word must mean coating.
防锈/1 | 铁栏杆刷了一层漆 | The iron railings have a coat of paint against rust, so the word must mean rustproof.
打磨/1 | 木匠把桌面磨得光光的 | The carpenter rubbed the tabletop smooth and pleasant to touch, so the word must mean to polish.
抛光/1 | 玉亮得能照出人影 | The jade now shines enough to reflect a face, so the word must mean to polish.
喷漆/1 | 旧自行车像新的一样 | After a new coat of paint the old bicycle looks new, so the word must mean to spray-paint.
砂纸/1 | 把木板上的毛刺磨平 | He rubbed the rough splinters off the board with it, so the word must mean sandpaper.
砂轮/1 | 师傅在转动的上面磨刀 | The master sharpens the knife on a spinning stone, so the word must mean grinding wheel.
粘贴/1 | 电脑上复制和 | On a computer you can copy text and put it elsewhere, so the word must mean to paste.
粘合/1 | 胶水把木头和玻璃粘牢 | The glue holds wood and glass firmly together, so the word must mean to bond.
胶带/1 | 透明的贴好破书页 | He mended the torn page with clear sticky tape, so the word must mean adhesive tape.
双面胶/1 | 贴照片看不出痕迹 | Photos stuck on the wall with it leave no visible trace, so the word must mean double-sided tape.
粘性/1 | 米煮出来的饭粘在一起 | Cooked grains of this rice cling together, so the word must mean stickiness.
笔筒/1 | 桌上插满铅笔 | The pot on his desk is full of pencils, so the word must mean pen holder.
话筒/1 | 主持人拿着走上舞台 | The presenter walked on stage holding it, so the word must mean microphone.
竹筒/1 | 米装进去烤出竹子香味 | One kind of rice is roasted inside it and smells of bamboo, so the word must mean bamboo tube.
万花筒/1 | 转动里面图案一直在变 | Turning it makes the patterns inside keep changing, so the word must mean kaleidoscope.
筒子楼/1 | 一层楼共用一个厨房 | Workers once lived in buildings where a whole floor shared one kitchen, so the word must mean tube-shaped apartment building.
齿轮/1 | 钟表里一个带动一个转 | In a clock, many of them turn one another, so the word must mean gear.
轴承/1 | 轮子转得不顺可能坏了 | The bicycle wheel does not turn smoothly and this part may be broken, so the word must mean bearing.
传送带/1 | 机场行李一件件送出来 | Luggage at the airport comes out on it piece by piece, so the word must mean conveyor belt.
滑轮/1 | 往楼上拉东西省力 | Using one to pull things upstairs saves a lot of effort, so the word must mean pulley.
链条/1 | 自行车的掉了 | It came off his bicycle and he put it back on, so the word must mean chain.
液压/1 | 挖土机铲子靠这个系统 | The digger's big shovel is driven by a fluid-powered system, so the word must mean hydraulic.
气压/1 | 高山上较低水不到一百度就开 | High in the mountains water boils below a hundred degrees, so the word must mean air pressure.
鼓风机/1 | 往高炉里送空气 | It blows air into the blast furnace when making iron, so the word must mean blower.
发条/1 | 上紧玩具汽车自己跑 | Wind it up and the toy car runs by itself, so the word must mean clockwork spring.
螺纹/1 | 螺丝的磨平拧不紧 | The screw is worn smooth and will no longer tighten, so the word must mean screw thread.
原型/1 | 机器还要多次改进才生产 | The machine needs many improvements before it is produced, so the word must mean prototype.
试制/1 | 工厂正在做新型电动车 | The factory is making a trial version of a new electric car to sell next year, so the word must mean to trial-produce.
灯泡/1 | 台灯的坏了换一个 | The desk lamp's one has gone and needs replacing, so the word must mean light bulb.
蓝图/1 | 市长描绘城市未来十年 | The mayor described his plan for the city's next ten years, so the word must mean blueprint.
图纸/1 | 工人按照施工不能出错 | Workers build exactly according to the plans, so the word must mean drawing.
测绘/1 | 修路前测量画出地图 | Before the road was built, the mountains were measured and mapped, so the word must mean surveying and mapping.
风洞/1 | 新飞机设计时做实验 | A new aircraft is tested in it while being designed, so the word must mean wind tunnel.
永动机/1 | 根据能量守恒不可能造出 | The law of conservation of energy says it can never be built, so the word must mean perpetual motion machine.
机械臂/1 | 工厂里自动焊接车身 | In car factories it welds bodies automatically, so the word must mean robotic arm.
拉链/1 | 书包的坏了拉不上 | His schoolbag will not close because it is broken, so the word must mean zip.
砂石/1 | 修路需要大量的和水泥 | Road-building needs large amounts of it along with cement, so the word must mean sand and stone.
沥青/1 | 新铺的路面又黑又平 | The newly laid road surface is black and smooth, so the word must mean asphalt.
瓦片/1 | 大风刮掉屋顶上几块 | The wind blew some off the roof and the room leaked in the rain, so the word must mean tile.
砖瓦/1 | 村里有座烧它们的窑 | The village once had a kiln for firing them, so the word must mean bricks and tiles.
石灰/1 | 以前把墙刷成白色 | People once painted walls white with it, so the word must mean lime.
水泥/1 | 加上沙子和水砌墙 | Workers mix it with sand and water to lay bricks, so the word must mean cement.
木材/1 | 森林出产优质 | The forest produces high-quality wood, so the word must mean timber.
渣土/1 | 卡车要盖好不能掉在路上 | Lorries carrying it must be covered to stop it falling on the road, so the word must mean construction waste.
瓦房/1 | 草房后来盖起三间 | His family once lived in a thatched hut and later built three rooms with tiled roofs, so the word must mean tile-roofed house.
粘土/1 | 孩子们捏出小动物 | The children shaped little animals out of it, so the word must mean clay.
古埃及/1 | 保存死者身体几千年不腐 | Its people had a special way of keeping the dead from decaying for thousands of years, so the word must mean ancient Egypt.
尼罗河/1 | 非洲最长的河流入地中海 | Africa's longest river flows north into the Mediterranean, so the word must mean Nile.
法老/1 | 胡夫金字塔是他的陵墓 | The Great Pyramid of Khufu is the tomb of one, so the word must mean pharaoh.
木乃伊/1 | 三千年前外面包着布 | The museum shows a body over three thousand years old still wrapped in cloth, so the word must mean mummy.
楔形文字/1 | 用尖笔在湿泥上写 | People in ancient Mesopotamia pressed it into wet clay with pointed pens, so the word must mean cuneiform.
象形文字/1 | 古埃及像一幅幅小画 | Ancient Egyptian writing looks like little pictures of birds, eyes and people, so the word must mean hieroglyphs.
狮身人面像/1 | 金字塔附近守了四千多年 | A huge statue has stood guard near the Great Pyramid for over four thousand years, so the word must mean Sphinx.
泥板/1 | 两河流域刻着文字的 | Archaeologists dug up many inscribed pieces of clay in Mesopotamia, so the word must mean clay tablet.
古巴比伦/1 | 空中花园在那里 | The legendary Hanging Gardens, one of the Seven Wonders, stood there, so the word must mean ancient Babylon.
莎草纸/1 | 古埃及人用河边的草做成 | The ancient Egyptians made writing sheets from a plant by the Nile, so the word must mean papyrus.
篆书/1 | 印章上弯弯曲曲不容易认 | Many seals carry curving characters that are hard to read, so the word must mean seal script.
小篆/1 | 秦始皇定为标准字体 | After uniting the six states, the First Emperor made it the standard script, so the word must mean small seal script.
篆刻/1 | 拿小刀在石头上刻名字 | He likes carving his name into stone with a small knife, so the word must mean seal engraving.
帛书/1 | 马王堆写在丝绸上的 | Texts written on silk were found in the Han tombs at Mawangdui, so the word must mean silk manuscript.
简帛/1 | 纸普及以前把字写在上面 | Before paper was common, people wrote on bamboo strips and silk, so the word must mean bamboo slips and silk.
书同文/1 | 秦朝让各地用同一种文字 | The Qin had every region use the same script, so the word must mean standardising the script.
金文/1 | 铸在青铜器上的文字 | It was cast into bronze vessels, most of all in the Shang and Zhou, so the word must mean bronze script.
刻字/1 | 在钢笔上刻名字 | The shop's craftsman can carve your name on a pen, so the word must mean to engrave.
隶变/1 | 笔画由弯曲变平直 | Through it the strokes of characters went from curved to straight, so the word must mean clerical transformation.
字形/1 | 从甲骨文到楷书变化很大 | From oracle bones to regular script, how characters look has changed greatly, so the word must mean form of a character.
殷墟/1 | 河南安阳出土大批甲骨 | Large numbers of inscribed bones were dug up at Anyang in Henan, so the word must mean Yin Ruins.
殷商/1 | 那时人们已会铸造青铜器 | People of that age could already cast fine bronzes, so the word must mean Yin-Shang.
废墟/1 | 大火后老宅子变成 | After the fire the old house was nothing but rubble, so the word must mean ruins.
甲骨/1 | 商朝人在上面刻字记占卜 | Shang people carved on them to record the results of divination, so the word must mean tortoise shells and bones.
兽骨/1 | 洞里烧过的动物骨头 | Burnt animal remains in the cave show people ate meat there, so the word must mean animal bone.
卜辞/1 | 记下商王问天气、问收成 | The words on the bones record the Shang king asking about weather and harvests, so the word must mean oracle inscription.
礼器/1 | 贵族祭祀时用的青铜鼎 | Shang nobles used the bronze cauldron in sacrifices, so the word must mean ritual vessel.
野兽/1 | 古人点火堆赶走 | Ancient people lit fires at night to keep dangerous animals away, so the word must mean wild animal.
遗存/1 | 新石器时代的文化 | Many Neolithic cultural relics have been found here, so the word must mean remains.
都城/1 | 唐朝的长安 | Chang'an was one of the largest cities in the world under the Tang, so the word must mean capital city.
墓葬/1 | 古代出土大量陶器玉器 | Much pottery and jade has come out of these ancient graves, so the word must mean tomb.
陪葬品/1 | 墓里的铜镜、玉器 | Bronze mirrors, jade and pots were buried with the dead, so the word must mean burial objects.
安葬/1 | 家人把他埋在家乡小山上 | As he wished, his family laid him to rest on a hill in his hometown, so the word must mean to bury.
葬礼/1 | 很多人来向老科学家告别 | Many people came to say goodbye to the old scientist, so the word must mean funeral.
陵墓/1 | 明朝十三位皇帝的 | The Ming Tombs in Beijing hold thirteen Ming emperors, so the word must mean mausoleum.
墓室/1 | 考古队员走进看到壁画 | Inside, the archaeologists found the walls covered in paintings, so the word must mean tomb chamber.
火葬/1 | 城市提倡节约土地 | Many cities encourage it to save land, so the word must mean cremation.
秦始皇陵/1 | 兵马俑在它附近发现 | The Terracotta Army was found near it, so the word must mean Mausoleum of Qin Shi Huang.
墓碑/1 | 只刻名字和一句话 | Only his name and one sentence are carved on the writer's, so the word must mean tombstone.
盗墓/1 | 违法破坏文物 | Robbing graves is illegal and badly damages relics, so the word must mean grave robbing.
巫师/1 | 部落遇大事请他占卜 | When something important happened, ancient tribes asked this person to divine the future, so the word must mean wizard, shaman.
巫术/1 | 古人用它治病没有根据 | Ancient people treated illness with it, without any scientific basis, so the word must mean witchcraft.
原始宗教/1 | 人们崇拜太阳、高山、大河 | In its earliest forms people worshipped the sun, mountains and rivers, so the word must mean primitive religion.
图腾崇拜/1 | 把熊当作自己的祖先 | Some tribes regard the bear as their ancestor, so the word must mean totem worship.
万物有灵/1 | 山、河、大树都有灵魂 | Ancient people felt that mountains, rivers and trees all had souls, so the word must mean animism.
神兽/1 | 青龙白虎守护四方 | In legend the Azure Dragon and White Tiger guard the four directions, so the word must mean divine beast.
求雨/1 | 大旱时举行仪式 | In a great drought ancient people held ceremonies for water from the sky, so the word must mean to pray for rain.
祭品/1 | 祭祖时桌上摆满 | At Spring Festival the table for the ancestors is laden with offerings, so the word must mean sacrificial offering.
祭司/1 | 古埃及神庙负责祭祀的人 | In ancient Egypt, temple sacrifices were led by such people, so the word must mean priest.
驱邪/1 | 端午节挂艾草 | People once hung mugwort at the Dragon Boat Festival to keep evil away, so the word must mean to ward off evil.
骆驼/1 | 被叫作沙漠之舟 | In the desert it is called the ship of the desert, so the word must mean camel.
驼队/1 | 驮着丝绸走过沙漠 | A line of camels carrying silk crosses the desert slowly, so the word must mean camel train.
驼峰/1 | 骆驼存脂肪的地方 | Camels store fat there and can go days without food, so the word must mean camel hump.
驼铃/1 | 远处叮当叮当的声音 | A tinkling from far away means the merchants are near, so the word must mean camel bell.
戈壁/1 | 一望无际路边几乎没有草 | The car drove all day across the endless stony waste with almost no grass beside the road, so the word must mean gobi desert.
驿站/1 | 送信的人到这里换马 | Ancient messengers changed horses there before going on, so the word must mean relay station.
驿道/1 | 连着京城和各地的大路 | Ancient roads linked the capital with every region, with horse-changing points at intervals, so the word must mean post road.
西域/1 | 汉朝派使者打通丝绸之路 | The Han sent envoys there and opened the Silk Road, so the word must mean Western Regions.
商队/1 | 中国商人和波斯商人 | It includes both Chinese and Persian traders, so the word must mean caravan.
互市/1 | 边境用茶叶换马 | Central China and the northern peoples traded tea for horses at the border, so the word must mean border market.
商贾/1 | 扬州来来往往很多 | Ancient Yangzhou was thriving and full of traders coming and going, so the word must mean merchants.
驮运/1 | 山高路险用马运货 | Lorries cannot climb the steep mountain roads and goods go by horse, so the word must mean to carry by pack animal.
驮马/1 | 背上放着两袋茶叶 | The horse carries two big sacks of tea on its back, so the word must mean packhorse.
马鞍/1 | 骑马前放好系紧 | Before riding, put it on the horse and fasten it tight, so the word must mean saddle.
茶马古道/1 | 穿过云南四川通到西藏 | It crosses the mountains of Yunnan and Sichuan all the way to Tibet, so the word must mean Ancient Tea Horse Road.
马帮/1 | 高山深谷运输货物 | In high mountains and deep valleys, goods were moved mainly by groups of horses, so the word must mean horse caravan.
皮毛/1 | 游牧民族用它换布和茶 | Northern nomads traded animal skins for cloth and tea from central China, so the word must mean fur.
贩运/1 | 祖辈靠南北运茶叶为生 | His forebears made a living carrying tea between south and north to sell, so the word must mean to transport for sale.
货郎/1 | 来村里卖针线和糖果 | A man often came to the village selling needles, thread and sweets, so the word must mean pedlar.
商帮/1 | 晋商是有名的 | The Shanxi merchants of the Ming and Qing were a famous trading group, so the word must mean merchant group.
桅杆/1 | 船上挂着三面大帆 | Three large sails hang on the tall pole of the ship, so the word must mean mast.
抛锚/1 | 汽车半路上坏了 | The car stopped working halfway and they waited for repairs, so the word must mean to break down.
起锚/1 | 天亮船长下令出发 | At first light the captain gave the order to set sail, so the word must mean to weigh anchor.
铁锚/1 | 水手抛进海里的 | The sailors threw the heavy iron weight into the sea, so the word must mean anchor.
宝船/1 | 明朝船队里最大的船 | It was the biggest ship of the Ming fleet that sailed overseas, so the word must mean treasure ship.
船队/1 | 十几条渔船一起出海 | A dozen fishing boats go out to sea together, so the word must mean fleet.
下西洋/1 | 明朝船队七次到非洲 | The Ming fleet made seven voyages that reached as far as East Africa, so the word must mean voyages to the Western Seas.
罗盘/1 | 航海家辨别方向 | Ancient navigators found their way across the sea with it, so the word must mean compass.
海上丝绸之路/1 | 泉州是重要港口 | Quanzhou in Fujian was a major port on it, so the word must mean Maritime Silk Road.
水手/1 | 船上一边拉帆一边唱歌 | The crew sing as they haul the sails, so the word must mean sailor.
遣唐使/1 | 日本派来学习的人 | Japan sent many people to China to learn during the Tang, so the word must mean envoy to Tang China.
派遣/1 | 学校派老师到山区支教 | The school sent two teachers to teach in the mountains, so the word must mean to dispatch.
使节/1 | 各国出席国际会议 | Representatives of many countries attended the international meeting, so the word must mean envoy.
使团/1 | 上百人出访邻国 | The emperor sent a group of over a hundred people to visit a neighbouring state, so the word must mean mission.
出使/1 | 奉命去西域十几年 | By the emperor's order he went to the Western Regions and stayed for over ten years, so the word must mean to go as an envoy.
通商/1 | 两国以后商船越来越多 | Since the two countries began trading, more and more merchant ships have come and gone, so the word must mean to have trade relations.
朝贡/1 | 小国定期向中原王朝进献 | Some small neighbouring states sent gifts regularly to the central court, so the word must mean to pay tribute.
东渡/1 | 鉴真六次终于到了日本 | The Tang monk Jianzhen tried six times before reaching Japan across the sea, so the word must mean to cross the sea eastward.
互派/1 | 两所大学每年交换学生 | Every year the two universities send students to each other, so the word must mean to send to each other.
国书/1 | 使者带着皇帝的 | The envoy arrived in the neighbouring capital with the emperor's letter, so the word must mean letter of credence.
玉玺/1 | 皇帝命令盖上才算数 | An imperial order counts only once it is stamped with the emperor's seal, so the word must mean imperial jade seal.
诏书/1 | 听人宣读皇帝的命令 | The ministers stood in the hall listening to the emperor's order read aloud, so the word must mean imperial edict.
下诏/1 | 皇帝发命令减免赋税 | After the great flood the emperor ordered taxes in the disaster area to be cut, so the word must mean to issue an edict.
即位/1 | 十六岁做了皇帝 | He became emperor at sixteen and reigned over fifty years, so the word must mean to ascend the throne.
退位/1 | 清朝最后一位皇帝宣布 | In 1912 the last Qing emperor gave up the throne, so the word must mean to abdicate.
禅让/1 | 传给有才德的人不传儿子 | Ancient rulers are said to have passed the throne to the worthy instead of to their sons, so the word must mean to abdicate in favour of another.
传位/1 | 老皇帝传给第三个儿子 | Before he died the old emperor handed the throne to his third son, so the word must mean to pass on the throne.
皇权/1 | 秦始皇统一后空前强大 | After the First Emperor united the six states, the throne's power grew greater than ever, so the word must mean imperial power.
龙椅/1 | 太和殿正中摆着 | The emperor's seat stands at the centre of the Hall of Supreme Harmony, so the word must mean dragon throne.
国号/1 | 唐朝的是唐 | The Tang used the name 唐 for nearly three hundred years, so the word must mean name of a dynasty.
郡县制/1 | 秦朝废除分封推行 | The Qin abolished fiefs and ran the country through commanderies and counties, so the word must mean prefecture-county system.
郡守/1 | 一个郡的最高长官 | Under the Qin it was the highest official of a commandery, so the word must mean prefect.
衙门/1 | 老百姓有冤屈去告状 | In old times people who were wronged went there to file a complaint, so the word must mean government office.
县令/1 | 清廉把一个县管得很好 | The upright official ran his county well, so the word must mean county magistrate.
知府/1 | 明清一个府的长官 | In the Ming and Qing it was the head of a prefecture, so the word must mean prefect.
官府/1 | 古代修大桥由它出钱 | Big bridges in ancient times were often paid for by the authorities, so the word must mean local government.
地方官/1 | 管税收、审案子、修水利 | In ancient times they handled taxes, trials and water works, so the word must mean local official.
巡抚/1 | 清朝一个省的军政大事 | Under the Qing a province's military and civil affairs were often in his hands, so the word must mean governor.
分封制/1 | 周朝把土地分给王族功臣 | The Zhou divided land among royal kin and men of merit, so the word must mean feudal system.
告示/1 | 城门口贴出通知百姓 | The authorities posted a notice at the city gate about building a bridge, so the word must mean public notice.
匈奴/1 | 秦朝修长城防备北方的 | One purpose of the Qin Great Wall was defence against them in the north, so the word must mean Xiongnu.
游牧民族/1 | 跟着水草走 | They follow water and grass and move several times a year, so the word must mean nomadic people.
酋长/1 | 部落大事由他和老人商量 | Big tribal matters are decided by him together with the elders, so the word must mean chieftain.
蛮族/1 | 罗马人称边境以外的部落 | The ancient Romans used this name for tribes beyond their borders, so the word must mean barbarian tribes.
野蛮/1 | 抢别人东西的行为 | Robbing other people is uncivilised behaviour, so the word must mean savage.
部族/1 | 草原上结成强大联盟 | Many groups on the grassland later formed a powerful alliance, so the word must mean tribe.
和亲/1 | 汉朝把公主嫁给匈奴首领 | The Han married princesses to Xiongnu leaders, so the word must mean marriage for peace.
可汗/1 | 成吉思汗被推举为大 | The Mongol tribes chose Genghis as their great ruler, so the word must mean khan.
蒙古包/1 | 草原上可以拆开搬走 | It can be taken apart and moved elsewhere on the grassland, so the word must mean yurt.
马背/1 | 蒙古族被称为上的民族 | The Mongols are called the people who live on horses, so the word must mean horseback.
城堡/1 | 欧洲贵族住在高大的 | Medieval European nobles lived in tall fortified buildings, so the word must mean castle.
古堡/1 | 山顶上八百年历史 | It has stood on the hilltop for eight hundred years, so the word must mean ancient castle.
堡垒/1 | 海边防守海岸的 | The building by the sea was once used to defend the coast, so the word must mean fortress.
护城河/1 | 故宫城墙外水面很宽 | Wide water runs outside the walls of the Forbidden City, so the word must mean moat.
关隘/1 | 山海关是长城东边的 | Shanhaiguan is a key passage at the eastern end of the Great Wall, so the word must mean strategic pass.
城楼/1 | 站在上面看到整座城 | From the top of the old city gate the whole city can be seen, so the word must mean city gate tower.
城池/1 | 古代打仗争夺它和土地 | Ancient wars were often fought over cities and land, so the word must mean city.
箭楼/1 | 前门上有射箭的小窗口 | Qianmen's tower in Beijing has many little windows for shooting, so the word must mean arrow tower.
炮台/1 | 海边旧的成了博物馆 | The old gun emplacement by the sea is now a history museum, so the word must mean fort.
城门/1 | 晚上关上不让出入 | Ancient cities shut them at night and let no one in or out, so the word must mean city gate.
宝剑/1 | 祖传的捐给博物馆 | He gave his family's heirloom sword to the museum, so the word must mean sword.
青铜剑/1 | 两千多年前出土还发光 | The two-thousand-year-old blade still gleamed with no rust when dug up, so the word must mean bronze sword.
刀剑/1 | 陈列着各个朝代的 | The museum displays blades from every dynasty, so the word must mean swords.
剑术/1 | 从小学习表演漂亮 | He has learned to fight with a sword since childhood and moves beautifully, so the word must mean swordsmanship.
干戈/1 | 一点小事没必要大动 | There is no need to fight over a small matter, so the word must mean war, arms.
化干戈为玉帛/1 | 两国谈判从此友好 | The two countries made peace through talks and have been friendly since, so the word must mean to turn war into peace.
击剑/1 | 运动员穿白衣戴面罩 | Its athletes wear white and masks, so the word must mean fencing.
剑客/1 | 小说里背着长剑独来独往 | Ancient novels often have a lone hero carrying a long sword, so the word must mean swordsman.
兵器/1 | 古代的刀、剑、戈 | Ancient ones include knives, swords and halberds, so the word must mean weapon.
盾牌/1 | 士兵一手拿刀一手拿 | Ancient soldiers held a blade in one hand and this in the other, so the word must mean shield.
雅典/1 | 古希腊出了很多哲学家 | Many philosophers came from this ancient Greek city, so the word must mean Athens.
斯巴达/1 | 以军事强大闻名 | This Greek city was famous for its army, and children trained from childhood, so the word must mean Sparta.
奥林匹亚/1 | 古代奥运会在那里举行 | The ancient Olympic Games were held there in Greece, so the word must mean Olympia.
罗马帝国/1 | 领土包括整个地中海沿岸 | At its height it held all the shores of the Mediterranean, so the word must mean Roman Empire.
斗兽场/1 | 罗马圆形建筑容纳几万人 | Rome's huge round building held tens of thousands, so the word must mean Colosseum.
元老院/1 | 古罗马讨论国家大事的机构 | In ancient Rome major affairs of state were debated there, so the word must mean senate.
神殿/1 | 雅典山顶白色大理石建的 | The ancient building on the Athens hilltop is made of white marble, so the word must mean temple.
柱廊/1 | 一根根石柱排成一排 | Greek buildings often have long rows of stone columns, so the word must mean colonnade.
共和/1 | 古罗马后来才变成帝国 | Rome was once governed without a king and only later became an empire, so the word must mean republic.
罗马法/1 | 很多欧洲法律受它影响 | The laws of many European countries were shaped by it, so the word must mean Roman law.
隋朝/1 | 只有三十多年开凿大运河 | It lasted only some thirty years but dug the famous Grand Canal, so the word must mean Sui dynasty.
大运河/1 | 把北方和南方连在一起 | It links north and south and made moving grain and trading easier, so the word must mean Grand Canal.
长安/1 | 唐朝外国商人住在那里 | Many foreign merchants and students lived in the Tang capital, so the word must mean Chang'an.
互鉴/1 | 不同文明交流取长补短 | Different civilisations should learn from one another, so the word must mean mutual learning.
兼容并蓄/1 | 唐朝文化吸收外来东西 | Tang culture took in much from abroad, so the word must mean to embrace all.
古今中外/1 | 收集各个时代各国名人故事 | The book collects stories of famous people from every age and country, so the word must mean ancient and modern, Chinese and foreign.
外来文化/1 | 佛教后来和中国文化融合 | Buddhism came from abroad and later merged with Chinese culture, so the word must mean foreign culture.
本土化/1 | 外国快餐店推出包子米饭 | The foreign fast-food chain added steamed buns and rice to suit local tastes, so the word must mean localisation.
胡服/1 | 国王让士兵穿上方便骑射 | A Warring States king made his soldiers wear northern dress for riding and archery, so the word must mean nomadic clothing.
和而不同/1 | 不同文化互相尊重共同发展 | Different cultures can respect each other and develop together, so the word must mean harmony without uniformity.
惭愧/1 | 老师表扬我心里觉得不够 | The teacher praised the speaker, who knows the work is not good enough, so the word must mean ashamed.
羞愧/1 | 说谎被发现满脸通红 | Caught lying in front of others, he turned red in the face, so the word must mean ashamed.
内疚/1 | 没去看生病的朋友 | She never visited her sick friend in hospital, so the word must mean guilty conscience.
愧疚/1 | 陪父母的时间太少 | He feels he has spent too little time with his parents these years, so the word must mean guilt.
问心无愧/1 | 尽了最大努力 | The speaker did their very best, whatever the result, so the word must mean to have a clear conscience.
当之无愧/1 | 救了三个孩子英雄称号 | She saved three children from drowning, so the word must mean fully deserving.
心安理得/1 | 拿了别人的东西不脸红 | He took someone else's things without even blushing, so the word must mean to feel no qualms.
无地自容/1 | 想起说过的可笑的话 | He remembers the silly things he said then, so the word must mean to want the ground to swallow one.
良心不安/1 | 留下别人丢的钱 | He kept money someone else lost and has felt bad for days, so the word must mean conscience-stricken.
过意不去/1 | 这么晚还来送我 | You came to see the speaker off this late, so the word must mean to feel sorry.
恭敬/1 | 把茶递给爷爷 | He handed the tea to Grandpa with respect, so the word must mean respectful.
谦恭/1 | 有名却从不摆架子 | Though famous, he never puts on airs, so the word must mean courteous.
毕恭毕敬/1 | 长辈面前站得笔直 | He always stands up straight before his elders, so the word must mean reverent.
洗耳恭听/1 | 请说吧我们 | The speaker invites you to share your good idea, so the word must mean to listen respectfully.
恭维/1 | 这些话别太当真 | His words are just flattery and should not be taken seriously, so the word must mean flattery.
敬畏/1 | 对大自然怀有 | We should hold nature in deep respect, so the word must mean awe.
畏惧/1 | 面对困难从不 | He never shrinks from difficulty but faces it head on, so the word must mean to fear.
无畏/1 | 消防员冲进着火大楼 | The firefighters rushed into the burning building, so the word must mean fearless.
后生可畏/1 | 十五岁少年赢了老棋手 | A fifteen-year-old beat an old master at chess, so the word must mean the young deserve respect.
望而生畏/1 | 书又厚又难让人 | The book is thick and difficult and puts many readers off, so the word must mean to be daunted.
厚道/1 | 从来不占别人便宜 | Old Wang never takes advantage of anyone, so the word must mean kind-hearted.
宽厚/1 | 邻居有矛盾都找他评理 | Neighbours bring their quarrels to Grandpa to settle, so the word must mean magnanimous.
忠厚/1 | 老实人答应的事一定办到 | He always does what he promises, so the word must mean honest and kind.
敦厚/1 | 老教授性格温和 | The old professor is gentle and his students respect him, so the word must mean honest and simple.
淳朴/1 | 村民热情请我们吃饭 | The mountain villagers warmly invited us home to eat, so the word must mean simple and honest.
厚此薄彼/1 | 对两个孩子不能不一样 | Parents should treat both children equally, so the word must mean to favour one over another.
厚爱/1 | 感谢大家对我的 | The speaker thanks everyone for their kindness and promises to keep working hard, so the word must mean great kindness.
待人接物/1 | 她很有礼貌 | She is polite and everyone likes her, so the word must mean the way one treats people.
民风/1 | 晚上睡觉不用锁门 | People here do not even lock their doors at night, so the word must mean folk customs.
与人为善/1 | 邻居有困难第一个帮忙 | He is always the first to help a neighbour in trouble, so the word must mean to be kind to others.
衷心/1 | 感谢大家的帮助 | The speaker thanks everyone sincerely for their help these years, so the word must mean heartfelt.
由衷/1 | 老师为学生成绩高兴 | The teacher is truly glad at the students' excellent results, so the word must mean from the heart.
初衷/1 | 当老师是为了让孩子读书 | He became a teacher to give every mountain child a chance to study, so the word must mean original intention.
苦衷/1 | 这么做一定有原因 | He must have had his reasons and we should not blame him, so the word must mean difficulty one cannot voice.
言不由衷/1 | 嘴上说没关系心里难过 | He says it does not matter but is upset inside, so the word must mean not to mean what one says.
无动于衷/1 | 大家感动哭了只有他 | Everyone cried at the story except him, so the word must mean unmoved.
真挚/1 | 信写得让人感动 | The letter is moving to read, so the word must mean sincere.
诚挚/1 | 向来宾表示欢迎 | We warmly welcome all our guests, so the word must mean cordial.
挚友/1 | 从小一起长大无话不谈 | They grew up together and tell each other everything, so the word must mean bosom friend.
推心置腹/1 | 谈了一晚误会解开 | After talking openly all evening, they cleared up the misunderstanding, so the word must mean to confide fully.
告诫/1 | 父亲说做人要诚实 | Father often tells the speaker that one must be honest, so the word must mean to warn.
训诫/1 | 上课玩手机被老师批评 | He was called to the office for using his phone in class, so the word must mean to reprimand.
劝诫/1 | 朋友劝他少熬夜 | After his friends' repeated warnings he finally began going to bed earlier, so the word must mean to admonish.
规劝/1 | 家人劝他放弃危险想法 | His family persuaded him to give up the dangerous idea, so the word must mean to advise.
前车之鉴/1 | 别人的失败要记住 | Others' failures should be firmly remembered, so the word must mean lesson from others' mistakes.
引以为戒/1 | 事故的教训以后别再犯 | Everyone must learn from the accident and never repeat it, so the word must mean to take as a warning.
警钟/1 | 事故给司机敲响了 | The traffic accident is a warning to all drivers, so the word must mean warning bell.
良药苦口/1 | 朋友的批评不好听但有好处 | A friend's criticism is unpleasant to hear but does you good, so the word must mean good advice is hard to hear.
苦口婆心/1 | 妈妈劝了他半天 | Mother spent ages persuading him before he agreed to see a doctor, so the word must mean to urge patiently.
循循善诱/1 | 老师上课学生都喜欢听 | The pupils love the teacher's patient lessons, so the word must mean to guide patiently.
顽固/1 | 爷爷怎么劝都不去医院 | However we urge Grandpa, he will not get a check-up, so the word must mean stubborn.
顽皮/1 | 孩子常常爬到树上 | The child often climbs trees, so the word must mean naughty.
顽强/1 | 小草从石缝里长出 | The grass grows up out of a crack in the rock, so the word must mean tenacious.
狡猾/1 | 骗子换几种方法骗钱 | The swindler tried several tricks to get the old people's money, so the word must mean cunning.
狡诈/1 | 商人很多顾客上过当 | Many customers have been tricked by the merchant, so the word must mean crafty.
狡辩/1 | 证据摆在面前别再 | The evidence is right in front of you, so the word must mean to quibble.
奸诈/1 | 戏里阴险的人物 | Audiences hate this sly, wicked character in the play, so the word must mean treacherous.
老奸巨猾/1 | 骗子换好几个名字 | The swindler used several names and took the police a long time to catch, so the word must mean old and crafty.
执迷不悟/1 | 大家说是骗局他还投钱 | Everyone says it is a scam, yet he keeps putting money in, so the word must mean to persist in error.
一意孤行/1 | 队长不听意见比赛输了 | The captain ignored everyone's advice and the team lost, so the word must mean to insist on one's own way.
偏袒/1 | 裁判不能偏向任何一方 | A referee must not favour either side, so the word must mean to be partial to.
袒护/1 | 孩子做错父母不应该 | Parents should not shield a child who has done wrong, so the word must mean to shield.
包庇/1 | 帮着隐瞒朋友偷东西 | He knew his friend stole and helped hide it, so the word must mean to cover up for.
护短/1 | 自己班学生犯错照样批评 | Mr Wang criticises his own pupils when they do wrong, so the word must mean to shield one's own faults.
贵贱/1 | 职业不分 | Every kind of work deserves respect, so the word must mean noble and humble.
公道/1 | 店里价钱从不骗顾客 | The shop's prices are fair and it never cheats customers, so the word must mean fair.
公允/1 | 评论讲优点也指出缺点 | The review gives both strengths and weaknesses, so the word must mean impartial.
大公无私/1 | 从不为亲戚开后门 | He never bends the rules for his relatives, so the word must mean selfless.
公私分明/1 | 不用单位的车办私事 | He never uses the work car for his own errands, so the word must mean to keep public and private apart.
假公济私/1 | 用公款请朋友吃饭 | Treating friends to dinner with public money is wrong, so the word must mean to use public office for private gain.
馈赠/1 | 老朋友送给他的画 | An old friend gave him the painting, so the word must mean to present as a gift.
报答/1 | 好好学习回报父母 | He studies hard to pay back his parents for raising him, so the word must mean to repay.
知恩图报/1 | 记着要还邻居的情 | He has never forgotten that a neighbour once helped him and means to return the favour, so the word must mean to repay kindness.
饮水思源/1 | 每年回母校看望老师 | Every year he goes back to his old school to visit his teachers, so the word must mean to remember where one came from.
恩将仇报/1 | 我救了他他却害我 | The speaker saved him, yet he harmed the speaker in return, so the word must mean to repay kindness with evil.
忘恩负义/1 | 发达后不理帮过他的人 | Once rich, he ignored those who had helped him, so the word must mean ungrateful.
以德报怨/1 | 吵过架邻居生病还帮忙 | He helped the neighbour who had quarrelled with him when the neighbour fell ill, so the word must mean to repay ill will with kindness.
礼尚往来/1 | 人家送礼物我们也回送 | Someone gave us a present and we should give one back, so the word must mean courtesy demands reciprocity.
拯救/1 | 医生一整夜救了病人 | The doctors worked all night and saved the patient's life, so the word must mean to save.
恩人/1 | 资助他上大学的老人 | The old man who paid for his university education helped him for life, so the word must mean benefactor.
豁达/1 | 不顺心也笑着面对 | Grandma meets every setback with a smile, so the word must mean broad-minded.
豁然开朗/1 | 听了讲解难题解开 | After the teacher's explanation the hard problem suddenly became clear, so the word must mean to suddenly see the light.
宽宏大量/1 | 原谅打破玻璃的孩子 | He forgave the child who broke his window, so the word must mean magnanimous.
小肚鸡肠/1 | 别这么人家不是故意的 | The other person did not do it on purpose, so the word must mean petty.
海纳百川/1 | 城市欢迎世界各地的人 | The city welcomes people from all over the world, so the word must mean to embrace all.
大度/1 | 被误会也不生气 | He does not get angry even when misunderstood, so the word must mean magnanimous.
气量/1 | 不要为小事生气 | One should not get angry over small things, so the word must mean tolerance.
不计前嫌/1 | 两人又成好朋友 | The two put the past behind them and became friends again, so the word must mean to let bygones be bygones.
心平气和/1 | 有矛盾坐下来谈 | When there is a disagreement, everyone should sit down and talk it over calmly, so the word must mean calm.
想得开/1 | 丢了钱包也不难过 | He is not upset even after losing his wallet, so the word must mean to take things philosophically.
贪婪/1 | 国王想把东西都变成金子 | The king wanted to turn everything into gold, so the word must mean greedy.
贪得无厌/1 | 三套房还想要更多 | He has three flats and still wants more, so the word must mean insatiably greedy.
吝啬/1 | 一块钱都舍不得给 | He will not give anyone even one yuan, so the word must mean stingy.
一毛不拔/1 | 让他捐钱比登天还难 | Getting him to donate anything is harder than climbing to heaven, so the word must mean miserly.
不吝/1 | 写得不好请指教 | The speaker asks everyone to point out freely what is badly written, so the word must mean not to stint.
见利忘义/1 | 为钱卖了朋友的秘密 | He sold a friend's secret for a little money, so the word must mean to forget loyalty for gain.
损人利己/1 | 往别人门口倒垃圾 | Dumping rubbish at someone else's door helps oneself at another's cost, so the word must mean to harm others to benefit oneself.
自私自利/1 | 只顾自己 | He never cares about others and thinks only of himself, so the word must mean selfish.
利他/1 | 动物把食物分给同伴 | Many animals share food they find with their companions, so the word must mean altruistic.
守财奴/1 | 有钱却从来不花 | He has plenty of money but never spends any, so the word must mean miser.
卑鄙/1 | 背后造谣害人 | Spreading rumours behind someone's back to harm them is contemptible, so the word must mean despicable.
鄙视/1 | 大家看不起欺负弱小的人 | Everyone looks down on those who bully the weak, so the word must mean to despise.
蔑视/1 | 用这种眼光看说大话的人 | He looked with contempt at the boaster, so the word must mean to scorn.
轻蔑/1 | 他看不起地笑了一下 | He gave a scornful little laugh and said nothing, so the word must mean disdainful.
污蔑/1 | 没证据说别人偷东西 | Saying someone stole without any evidence is a false charge, so the word must mean to slander.
粗鄙/1 | 满嘴都是难听的话 | Everything he says is coarse and ugly, so the word must mean vulgar.
奸商/1 | 把过期食品换包装再卖 | The dishonest trader repackages out-of-date food and sells it again, so the word must mean profiteer.
奸臣/1 | 京剧里常画白脸 | In Peking opera, the treacherous minister's face is often painted white, so the word must mean treacherous official.
厚颜无耻/1 | 抄了文章还说是自己写的 | He copied someone's essay and even claimed he wrote it, so the word must mean shameless.
缺德/1 | 在长椅上乱写乱画 | Scribbling on park benches is a wicked thing to do, so the word must mean mean, wicked.
背叛/1 | 把朋友的秘密告诉别人 | He told his best friend's secret to others, so the word must mean to betray.
叛逆/1 | 十几岁不爱听父母的话 | Many teenagers stop listening to their parents, so the word must mean rebellious.
叛徒/1 | 电影里最后被认出来 | At the end of the film everyone recognises the one who betrayed them, so the word must mean traitor.
叛变/1 | 投敌被人看不起 | He went over to the enemy and has been despised ever since, so the word must mean to defect.
众叛亲离/1 | 做太多坏事最后的下场 | He did too many bad things and in the end everyone left him, so the word must mean deserted by everyone.
出卖/1 | 为了奖金出卖同事 | He betrayed his colleague for a bonus, so the word must mean to sell out.
出尔反尔/1 | 昨天答应今天不认账 | He agreed yesterday and denies it today, so the word must mean to go back on one's word.
两面三刀/1 | 当面说好背后说坏话 | He praises you to your face and runs you down behind your back, so the word must mean double-dealing.
阳奉阴违/1 | 表面答应实际不做 | He agrees to his superior's plans but does nothing about them, so the word must mean to comply in public but defy in private.
口是心非/1 | 嘴上说不喜欢心里高兴 | She says she dislikes the present but is really pleased, so the word must mean to say one thing and mean another.
憎恨/1 | 人们恨战争盼和平 | People loathe war and long for peace, so the word must mean to hate.
憎恶/1 | 从小讨厌说谎的人 | He has disliked liars since he was a child, so the word must mean to loathe.
爱憎分明/1 | 支持好人反对坏人 | He backs good people warmly and firmly opposes bad ones, so the word must mean to know clearly what to love and hate.
面目可憎/1 | 故事里的坏人被写得 | The villain in the story is described as repulsive, so the word must mean hateful-looking.
褒贬/1 | 观众对新电影不一 | Viewers disagree about the new film, so the word must mean praise and criticism.
褒奖/1 | 勇敢救人受到政府 | He was honoured by the government for bravely saving someone, so the word must mean to commend.
褒义/1 | 勇敢是这样的词 | A word like 勇敢 praises what it describes, so the word must mean commendatory.
贬义/1 | 狡猾是这样的词 | A word like 狡猾 finds fault with what it describes, so the word must mean derogatory.
钦佩/1 | 困难面前不退缩 | He never backs down in the face of difficulty, so the word must mean to admire.
敬仰/1 | 孔子受到后人 | Confucius is a great thinker honoured by later generations, so the word must mean to revere.
操守/1 | 法官要有良好的职业 | A judge must keep high professional standards, so the word must mean integrity.
节操/1 | 竹子有节比喻人的 | Bamboo has joints, and ancient people used it to stand for a person's principles, so the word must mean moral integrity.
气节/1 | 宁死不投降的民族 | He would rather die than surrender, so the word must mean integrity.
骨气/1 | 再穷也不接受施舍 | However poor he is, he will not accept charity, so the word must mean backbone.
人格/1 | 尊重每个人不随便嘲笑 | We must respect every person and not mock others, so the word must mean personality, dignity.
品行/1 | 成绩好也很端正 | The student not only gets good marks but also behaves well, so the word must mean conduct.
德行/1 | 古人认为比才能更重要 | Ancient people thought character mattered more than talent, so the word must mean moral conduct.
修身/1 | 治理国家先管好自己 | Ancient people held that governing a country starts with governing oneself, so the word must mean to cultivate oneself.
慎独/1 | 没人看着也不做坏事 | Ancient people did no wrong even when no one was watching, so the word must mean to be watchful when alone.
克己/1 | 奉公从不占公家便宜 | He never takes the smallest advantage of public property, so the word must mean self-restraint.
堕落/1 | 交了坏朋友一天天下去 | He fell in with bad friends and got worse every day until he woke up, so the word must mean to degenerate.
腐化/1 | 官员贪图享受生活 | Officials who lived for pleasure were finally punished by law, so the word must mean to become corrupt.
同流合污/1 | 宁可辞职也不跟着干坏事 | He would rather resign than join those people in wrongdoing, so the word must mean to go along with evil.
洁身自好/1 | 复杂环境里从不收礼 | Even in a murky world he never accepts gifts, so the word must mean to keep oneself pure.
迷途知返/1 | 回头大家会原谅你 | Everyone will forgive you if you turn back, so the word must mean to realise one's errors and return.
改过自新/1 | 出狱后开了小饭馆 | After prison he started afresh and opened a small restaurant, so the word must mean to mend one's ways.
浪子回头/1 | 金不换，现在是勤劳青年 | He is now a hard-working young man, so the word must mean the prodigal son returns.
知错就改/1 | 犯错只要改就是好孩子 | Making mistakes is nothing to fear as long as you put them right, so the word must mean to correct mistakes once known.
痛改前非/1 | 后悔过去决心改 | He deeply regrets his past and is determined to change, so the word must mean to sincerely mend one's ways.
悔改/1 | 犯了错还不肯 | He did wrong and still refuses to change, so the word must mean to repent.
伦理审查/1 | 用人做实验必须先通过 | Research that experiments on people must first pass it, so the word must mean ethics review.
科技伦理/1 | 人工智能发展引起重视 | As AI develops fast, its moral questions draw more attention, so the word must mean ethics of science and technology.
基因编辑/1 | 治病也引起争论 | The technique can treat some diseases but is hotly debated, so the word must mean gene editing.
安乐死/1 | 是否允许争议很大 | Whether to allow it is fiercely debated in many countries, so the word must mean euthanasia.
器官捐献/1 | 去世后救了好几个病人 | He signed a form while alive and after death saved several patients, so the word must mean organ donation.
知情同意/1 | 手术前让病人明白并签字 | Before an operation the doctor must make sure the patient understands and signs, so the word must mean informed consent.
动物福利/1 | 养殖场动物应有活动空间 | Its supporters say farm animals should have enough room to move, so the word must mean animal welfare.
医德/1 | 大夫医术高明品德高尚 | The doctor is skilled and of fine character, and patients trust him, so the word must mean medical ethics.
两难/1 | 留在大城市还是回家 | He cannot decide between working in the city and caring for his parents at home, so the word must mean dilemma.
功利主义/1 | 看能不能给最多人带来幸福 | By this view, an act is right if it brings the most happiness to the most people, so the word must mean utilitarianism.
平仄/1 | 写律诗让声调高低交替 | Regulated verse must alternate high and low tones, so the word must mean level and oblique tones.
仄声/1 | 上声、去声、入声 | In classical Chinese, the rising, departing and entering tones all belong to it, so the word must mean oblique tone.
平声/1 | 普通话第一二声多来自它 | Most first and second tones in Mandarin come from it, so the word must mean level tone.
近体诗/1 | 律诗和绝句要求严格 | Regulated verse and quatrains have strict rules on characters and tones, so the word must mean modern-style poetry.
古体诗/1 | 句数不固定平仄自由 | The number of lines is not fixed and the tones are freer, so the word must mean ancient-style poetry.
五言/1 | 每句五个字的诗 | Each line of the poem has five characters, so the word must mean five-character.
七言/1 | 杜甫每句七个字的律诗 | Each line of Du Fu's regulated poem has seven characters, so the word must mean seven-character.
曲牌/1 | 规定元曲的曲调句式 | Every Yuan song has one that fixes its tune and line pattern, so the word must mean qu tune name.
咏物诗/1 | 借梅花赞美坚强品格 | The poem praises strength of character through plum blossom, so the word must mean poem about an object.
送别诗/1 | 诗人在江边和朋友告别 | Many Tang poems describe poets saying goodbye to friends by a road or river, so the word must mean farewell poem.
眼泪/1 | 好消息妈妈激动得流下 | Mother was moved to tears by the good news, so the word must mean tears.
泪水/1 | 她的眼睛里充满了 | Her eyes are full of tears, so the word must mean tears.
泪花/1 | 老人眼里闪着 | Tears glisten in the old man's eyes as he grips the speaker's hand, so the word must mean tears in the eyes.
泪珠/1 | 一颗大大的从脸上落下 | A big one rolled down her face, so the word must mean teardrop.
泪流满面/1 | 看完电影观众哭得 | Many viewers wept openly after the film, so the word must mean face covered in tears.
泣不成声/1 | 说到伤心处 | When she reached the sad part, she could no longer speak for crying, so the word must mean too choked with tears to speak.
喜极而泣/1 | 女儿考上大学妈妈 | Mother cried with happiness when her daughter got into university, so the word must mean to weep for joy.
哭泣/1 | 一个人在房间里 | She shut the door and cried alone in her room, so the word must mean to weep.
抽泣/1 | 哭了很久轻轻地 | The child cried a long time and now only sobs quietly, so the word must mean to sob.
声泪俱下/1 | 讲述经历大家感动 | He told his story in tears and everyone was moved, so the word must mean speaking through tears.
凄凉/1 | 秋天院子里空空的只有落叶 | The autumn yard is empty but for a few fallen leaves, so the word must mean desolate.
凄惨/1 | 孤儿的童年 | The novel describes an orphan's miserable childhood, so the word must mean wretched.
凄美/1 | 爱情故事结局让人流泪 | The ending of the love story moves people to tears, so the word must mean poignantly beautiful.
凄清/1 | 深夜月光照在小河上 | Late at night cold moonlight falls on the stream, so the word must mean cold and cheerless.
惆怅/1 | 毕业那天看着校园 | On graduation day he looks at the familiar campus with a sense of loss, so the word must mean melancholy.
怅然/1 | 朋友不在只好离去 | His friend was out and he left disappointed, so the word must mean disconsolate.
悼念/1 | 纪念碑前怀念遇难的人 | People gather at the memorial to remember those killed in the earthquake, so the word must mean to mourn.
哀悼/1 | 伟人去世全国深切 | When the great man died, the whole nation grieved deeply, so the word must mean to mourn.
追悼会/1 | 学校为老教授举行 | The school held a ceremony to mourn the old professor, so the word must mean memorial service.
悼词/1 | 告别仪式上校长念了 | At the farewell ceremony the head teacher read a speech honouring the dead, so the word must mean eulogy.
皎洁/1 | 中秋一轮月亮 | A bright round moon hangs in the sky at Mid-Autumn, so the word must mean bright and clear.
明月/1 | 李白诗里表达思乡 | Li Bai's poems often mention it to express homesickness, so the word must mean bright moon.
月色/1 | 窗外很好去散步 | The moonlight is lovely tonight and it is a good time for a walk in the yard, so the word must mean moonlight.
月明星稀/1 | 只能看到几颗星星 | Only a few stars can be seen tonight, so the word must mean bright moon and sparse stars.
眺望/1 | 站在山顶看远方大海 | He stands on the hilltop looking out at the distant sea, so the word must mean to gaze into the distance.
远眺/1 | 登上塔顶整座城在眼前 | From the top of the tower the whole city lies before your eyes, so the word must mean to look into the distance.
登高/1 | 重阳节去爬山 | At the Double Ninth Festival people climb mountains, so the word must mean to ascend a height.
登高望远/1 | 古人在高楼写诗 | Ancient people wrote many famous lines on towers and hilltops, so the word must mean to climb high and look far.
极目/1 | 四望草原连到天边 | Looking as far as one can see, the grassland stretches to the horizon, so the word must mean to look as far as one can.
凭栏/1 | 靠着栏杆看江上小船 | He stands leaning on the railing watching the boats on the river, so the word must mean to lean on a railing.
鸣叫/1 | 小鸟在树上欢快地 | In spring little birds sing happily in the trees, so the word must mean to cry, call.
共鸣/1 | 书引起读者的 | The book captures young people's worries and many readers feel the same, so the word must mean resonance.
一鸣惊人/1 | 第一部小说就获大奖 | The young writer's first novel won a major prize, so the word must mean to amaze the world at a stroke.
鸡鸣/1 | 天刚亮传来的声音 | At first light the crowing of cocks is heard in the village, so the word must mean cockcrow.
蝉鸣/1 | 夏天午后树上 | On summer afternoons the insects in the trees grow louder and louder, so the word must mean cicada song.
鸟鸣/1 | 清晨公园里好听的 | The park at dawn is full of lovely bird calls, so the word must mean birdsong.
鸣笛/1 | 医院附近禁止汽车 | Car horns are banned near the hospital, so the word must mean to sound a horn.
雷鸣/1 | 台下响起这样的掌声 | When the performance ended, the audience burst into thunderous applause, so the word must mean thunder.
自鸣得意/1 | 考一次第一就不再认真 | After coming first once, he grew pleased with himself and stopped working, so the word must mean to be pleased with oneself.
百家争鸣/1 | 春秋战国思想界的局面 | In the Spring and Autumn and Warring States period many schools of thought competed, so the word must mean contention of a hundred schools.
喜鹊/1 | 门前叫个不停要有好事 | Grandma says its calls in the tree by the door mean good news, so the word must mean magpie.
鹊桥/1 | 牛郎织女七夕相会的地方 | Legend says the Cowherd and Weaver Girl meet there every seventh of the seventh month, so the word must mean magpie bridge.
大雁/1 | 秋天排队往南飞 | In autumn flocks of them fly south in formation, so the word must mean wild goose.
鸿雁/1 | 古人用它比喻书信 | Ancient people used this bird to stand for letters, as it was said to carry them, so the word must mean swan goose.
孤雁/1 | 天上一只叫声凄凉 | A lone bird flying overhead calls mournfully, so the word must mean solitary goose.
雁阵/1 | 排成人字或一字 | The geese form the shape of 人 one moment and 一 the next, so the word must mean flight of geese.
黄莺/1 | 柳树上唱好听的歌 | A bird in the willow sings sweetly, so the word must mean oriole.
燕子/1 | 春天飞回来在房檐下安家 | In spring they fly back and nest under the old house's eaves, so the word must mean swallow.
莺歌燕舞/1 | 春天江南景色美 | Spring south of the Yangtze is beautiful everywhere, so the word must mean orioles sing and swallows dance.
仙鹤/1 | 中国画里和松树象征长寿 | In Chinese painting it is often shown with pines as a sign of long life, so the word must mean red-crowned crane.
菊花/1 | 重阳节前后公园开满 | Around the Double Ninth Festival the park is full of them, so the word must mean chrysanthemum.
梅花/1 | 寒冬开放不怕风雪 | It blooms in the cold of winter and does not fear wind or snow, so the word must mean plum blossom.
荷花/1 | 夏天湖面粉红色的 | In summer pink flowers cover the lake, so the word must mean lotus.
荷叶/1 | 青蛙坐在大的上面 | When it rains a little frog sits on a big one, so the word must mean lotus leaf.
枫叶/1 | 秋天山上都红了 | In autumn the leaves on the mountain all turn red, so the word must mean maple leaf.
杨柳/1 | 河边长出新芽 | In spring the trees by the river put out new shoots, so the word must mean willow.
杨树/1 | 路两边高高的遮阳 | Tall trees line both sides of the road and give shade in summer, so the word must mean poplar.
梅雨/1 | 六月江南天天下雨 | In June it rains almost every day south of the Yangtze, so the word must mean plum rain season.
岁寒三友/1 | 松、竹、梅不怕寒冷 | Pine, bamboo and plum do not fear the cold, so the word must mean three friends of winter.
梅兰竹菊/1 | 被称为四君子 | Often painted in Chinese art, they are called the four gentlemen, so the word must mean plum, orchid, bamboo and chrysanthemum.
蝴蝶/1 | 花间飞来飞去 | A few fly from flower to flower in the garden, so the word must mean butterfly.
化蝶/1 | 梁祝死后在花间飞舞 | In the Liang Zhu story the two young lovers fly among flowers after death, so the word must mean to turn into butterflies.
蝶泳/1 | 他最擅长的游泳项目 | It is his best swimming stroke, so the word must mean butterfly stroke.
蝉联/1 | 连续三届冠军 | She has been champion three times in a row, so the word must mean to win consecutively.
知了/1 | 夏天树上不停地叫 | They chirp without stopping in summer trees, so the word must mean cicada.
晚霞/1 | 太阳下山西边天空红色 | After the sun sets the western sky is full of red clouds, so the word must mean sunset clouds.
朝霞/1 | 早上东方天空美丽的 | In the morning beautiful clouds appear in the east, so the word must mean rosy dawn clouds.
彩霞/1 | 雨过天晴天边一片片 | When the rain clears, coloured clouds appear on the horizon, so the word must mean rosy clouds.
霞光/1 | 山顶照在云海上 | On the summit the glow of the sky lights the sea of clouds, so the word must mean rosy light.
梁祝/1 | 四大民间传说之一 | It is one of China's four great folk legends, so the word must mean Liang Zhu legend.
托物言志/1 | 写竹子表达坚强品格 | The poem describes bamboo but really expresses the poet's strength of character, so the word must mean to express ideals through objects.
借景抒情/1 | 写落叶表达思乡 | The poem describes falling leaves to express the poet's homesickness, so the word must mean to express emotion through scenery.
情景交融/1 | 写景写情都好 | The poem describes both scenery and feeling well, so the word must mean blending of feeling and scene.
诗情画意/1 | 雨后西湖充满 | West Lake after rain is like a poem or a painting, so the word must mean poetic and picturesque.
田园诗/1 | 陶渊明写农村生活 | Tao Yuanming wrote many poems about country life, so the word must mean pastoral poetry.
山水诗/1 | 王维写得像画 | Wang Wei's poems of mountains and rivers are as beautiful as paintings, so the word must mean landscape poetry.
怀古/1 | 古城旧址写下的诗 | The poet visited the site of an old city and wrote this poem, so the word must mean to reflect on the past.
咏史/1 | 借历史人物表达看法 | The poem uses historical figures to express the author's view of his society, so the word must mean to write about history.
寄托/1 | 把思乡之情放在明月上 | The poet places his homesickness in the moon, so the word must mean to entrust.
感怀/1 | 重游母校心中很多 | Revisiting his old school stirred many memories and he wrote a little poem, so the word must mean recollections.
诗仙/1 | 李白被称为 | Later generations gave Li Bai this title, so the word must mean Immortal of Poetry.
诗圣/1 | 杜甫被称为 | Later generations gave Du Fu this title, so the word must mean Sage of Poetry.
婉约派/1 | 李清照词写得柔美 | Li Qingzhao's ci are soft and graceful, so the word must mean graceful school.
豪放派/1 | 辛弃疾充满爱国热情 | Xin Qiji's ci are full of patriotic passion, so the word must mean bold school.
千古绝唱/1 | 今天还有很多人会背 | Many people can still recite the ci today, so the word must mean masterpiece for the ages.
佳句/1 | 诗里很多值得背 | Many lines in the poem are worth learning by heart, so the word must mean fine line.
吟诗/1 | 文人月下喝茶 | Ancient scholars often drank tea and recited verse under the moon, so the word must mean to recite poetry.
赋诗/1 | 登上高楼当场写一首 | On climbing the tower the poet wrote a poem on the spot, so the word must mean to compose a poem.
诗社/1 | 学校每周有人读诗 | At our school people read their own poems every week, so the word must mean poetry society.
唱和/1 | 两位诗人互相作诗应答 | The two poets often answered each other in verse, so the word must mean to respond in verse.
离愁/1 | 送别朋友心里充满 | After seeing his friend off he felt the sadness of parting, so the word must mean sorrow of parting.
愁绪/1 | 窗外小雨她心中充满 | Light rain falls outside and her heart is heavy, so the word must mean melancholy.
乡愁/1 | 一碗家乡的面 | A bowl of noodles from his hometown filled him with longing for home, so the word must mean homesickness.
感伤/1 | 看几十年前的老照片 | Grandma grows a little sad looking at decades-old photos, so the word must mean sad, sentimental.
悲秋/1 | 诗人看到落叶想到人生短暂 | Ancient poets saw falling leaves and thought of how short life is, so the word must mean to lament autumn.
伤春/1 | 落花满地的心情 | The ci describes fallen petals covering the ground, so the word must mean to grieve over spring.
秋思/1 | 秋天引起的愁思 | The poem is about the sadness autumn brings, so the word must mean autumn longing.
折柳/1 | 送别时表示留恋 | Ancient people gave a willow twig when parting, so the word must mean to break a willow twig in farewell.
长亭/1 | 城外送别朋友的地方 | Ancient people often said goodbye to friends at roadside shelters outside the city, so the word must mean roadside pavilion.
断肠/1 | 形容伤心到了极点 | Ancient poems use it to describe the deepest grief, so the word must mean heartbroken.
旦角/1 | 男演员在台上扮演女子 | The actor plays women on stage in Peking opera, so the word must mean dan role.
花旦/1 | 天真可爱的小姑娘角色 | She plays an innocent, lively young girl, so the word must mean huadan.
青衣/1 | 端庄女子常穿黑衣 | These roles are dignified young or middle-aged women, often dressed in black, so the word must mean qingyi.
老旦/1 | 戏里扮演老奶奶 | The old grandmother in the play is acted by a specialist in this role, so the word must mean laodan.
刀马旦/1 | 骑马打仗的女将军 | The woman general who rides into battle is played in this role, so the word must mean daomadan.
小生/1 | 年轻书生的角色 | The young scholar in the play is acted in this role, so the word must mean xiaosheng.
老生/1 | 长胡子的老大臣 | The old minister with the long beard is played in this role, so the word must mean laosheng.
武生/1 | 台上连翻十几个跟头 | The actor turned over a dozen somersaults on stage, so the word must mean wusheng.
丑角/1 | 鼻子上画白观众就笑 | His nose is painted with a white patch and the audience laughs as he enters, so the word must mean clown role.
生旦净丑/1 | 京剧角色的四大类 | Peking opera roles fall into four main types, so the word must mean sheng, dan, jing and chou.
粤剧/1 | 流行于广东香港 | It is popular in Guangdong, Guangxi and Hong Kong, so the word must mean Cantonese opera.
粤语/1 | 香港大多数人说 | Most people in Hong Kong speak it, so the word must mean Cantonese.
黄梅戏/1 | 代表作天仙配 | Its singing is lovely and The Fairy Couple is its best-known piece, so the word must mean Huangmei opera.
豫剧/1 | 河南最有名的地方戏 | It is Henan's most famous local opera, sung loud and strong, so the word must mean Yu opera.
川剧/1 | 变脸表演非常有名 | Its face-changing act is famous, with a new face at every turn of the head, so the word must mean Sichuan opera.
秦腔/1 | 西北地区声音很大 | It is popular in the northwest and sung very loudly, so the word must mean Qinqiang.
评剧/1 | 流行于华北和东北 | It is popular in north and northeast China, so the word must mean Ping opera.
杂剧/1 | 元代一般是四折 | Yuan plays of this kind usually had four acts, sometimes with a prologue, so the word must mean zaju.
南戏/1 | 宋代温州一带最早出现 | It first appeared around Wenzhou in the Song, so the word must mean nanxi.
梨园/1 | 他出生在唱戏世家 | He was born into a family of opera performers and learned from his father, so the word must mean Pear Garden.
念白/1 | 演员不但唱还要说得好 | Peking opera actors must speak their lines well, not only sing, so the word must mean spoken lines.
唱词/1 | 这段写得像一首诗 | The words of this sung passage are as beautiful as a poem, so the word must mean libretto.
身段/1 | 演员一举一动像舞蹈 | Every movement the actor makes is like dancing, so the word must mean posture.
水袖/1 | 挥动长长的表现心情 | The actor waves long white cuffs to show the character's feelings, so the word must mean water sleeves.
压轴/1 | 今晚最后的名段 | Everyone is waiting for the famous Peking opera piece near the end of the evening, so the word must mean the second-to-last item.
返场/1 | 掌声不断又唱一段 | The applause went on and the performer came back to sing again, so the word must mean to return for an encore.
票友/1 | 爷爷周末去公园唱京剧 | Grandpa sings Peking opera in the park every weekend for fun, so the word must mean amateur performer.
戏台/1 | 村口过年请人唱戏 | At New Year performers are invited to sing on the old platform by the village entrance, so the word must mean opera stage.
叫好/1 | 观众连声 | The audience cheered again and again after each passage, so the word must mean to shout bravo.
戏班/1 | 从一个村子到另一个村子演 | In the past, groups of players went from village to village, so the word must mean theatre troupe.
滑稽/1 | 小丑的样子逗孩子笑 | The clown makes the children laugh out loud, so the word must mean funny.
逗乐/1 | 有他在总有笑声 | Wherever he is, there is always laughter, so the word must mean to amuse.
笑料/1 | 喜剧里太多观众笑个不停 | The audience cannot stop laughing at the comedy, so the word must mean joke.
捧腹大笑/1 | 表演太有意思观众都 | The performance was hilarious, so the word must mean to split one's sides.
捧场/1 | 谢谢大家来支持 | The performers thank everyone for coming to support them, so the word must mean to show support.
包厢/1 | 剧院二楼每个坐五六人 | Several small private rooms on the theatre's second floor seat five or six each, so the word must mean box.
捧红/1 | 电视剧让几位演员出名 | The TV series made several young actors famous, so the word must mean to make popular.
名角/1 | 好几位登台票卖完 | Several star performers are appearing tonight and tickets sold out long ago, so the word must mean famous actor.
车厢/1 | 火车有十六节 | The train has sixteen of them, so the word must mean carriage.
西厢记/1 | 王实甫写张生和莺莺 | Wang Shifu's Yuan love play tells of Zhang Sheng and Yingying, so the word must mean Romance of the Western Chamber.
唢呐/1 | 农村办喜事吹 | At village weddings people are hired to play this loud horn, so the word must mean suona horn.
琵琶/1 | 怀里抱着手指飞快弹 | She holds the instrument in her arms and plucks its strings quickly, so the word must mean pipa.
箫/1 | 直着拿着吹的 | The flute is held sideways but this is held straight, so the word must mean xiao.
锣鼓/1 | 庙会上喧天舞狮队来了 | The lion dancers arrive amid deafening percussion at the temple fair, so the word must mean gongs and drums.
扬琴/1 | 用两根竹片敲打琴弦 | It is played by striking strings with two bamboo sticks, so the word must mean yangqin.
编钟/1 | 两千多年前还能敲出音乐 | The museum's set is over two thousand years old and still plays music, so the word must mean bianzhong.
琴弦/1 | 弹太用力断了一根 | He played too hard and one snapped, so the word must mean string.
吹拉弹唱/1 | 剧团工作样样都会 | Grandpa worked in a troupe and could play every kind of instrument and sing, so the word must mean to play and sing.
敲锣打鼓/1 | 全村人欢迎冠军回家 | The whole village made a joyful noise welcoming home the champions, so the word must mean to beat gongs and drums.
民族乐器/1 | 二胡、古筝、笛子 | Erhu, guzheng and dizi are Chinese ones, so the word must mean traditional instruments.
长笛/1 | 声音清亮模仿鸟叫 | Its clear sound in the orchestra often imitates birds, so the word must mean flute.
单簧管/1 | 吹口上有一片簧片 | A thin reed on its mouthpiece vibrates when blown, so the word must mean clarinet.
圆号/1 | 管子绕成圆圈手放进大口 | Its tube coils into a circle and players often put a hand in its bell, so the word must mean French horn.
定音鼓/1 | 交响乐团里可调音高 | In an orchestra these drums can be tuned to different pitches, so the word must mean timpani.
架子鼓/1 | 乐队后面掌握节奏 | In a rock band the person at the back keeping the rhythm plays it, so the word must mean drum kit.
弦乐器/1 | 小提琴、大提琴、吉他 | Violin, cello and guitar are examples, so the word must mean stringed instrument.
管乐器/1 | 长笛和单簧管用嘴吹 | Flute and clarinet are both played by blowing, so the word must mean wind instrument.
打击乐器/1 | 锣、鼓、木鱼 | Gongs, drums and wooden fish are examples, so the word must mean percussion instrument.
铜管乐器/1 | 小号和圆号金属做的 | The trumpet and French horn are loud metal instruments, so the word must mean brass instrument.
琴弓/1 | 拉小提琴右手拿着 | When playing the violin it is held in the right hand, so the word must mean bow.
吹奏/1 | 用笛子演奏民歌 | He played a folk song from home on the flute, so the word must mean to play by blowing.
弹奏/1 | 在钢琴上演奏小曲 | She played a little tune on the piano, so the word must mean to play.
拨弦/1 | 用手指弹小提琴 | Violinists sometimes use fingers instead of the bow for a short, light sound, so the word must mean pizzicato.
合奏/1 | 十几种乐器一起 | The piece is not a solo but played by a dozen instruments together, so the word must mean ensemble playing.
调音/1 | 演出前乐手给乐器 | Before the concert the players adjust their instruments, so the word must mean to tune.
演奏会/1 | 钢琴家在音乐厅举办个人 | The pianist will give a solo performance in the concert hall next month, so the word must mean concert.
指法/1 | 每个手指按哪个键有规定 | Every finger has its own key when learning piano, so the word must mean fingering.
乐感/1 | 听一遍就能哼出来 | The child can hum a tune after hearing it once, so the word must mean musical sense.
乐手/1 | 乐队五名每人一种乐器 | The band has five members, each on one instrument, so the word must mean musician.
编曲/1 | 民歌加入电吉他和架子鼓 | The folk song has been reworked with electric guitar and drums, so the word must mean arrangement.
交响乐团/1 | 一百多名乐手世界各地演出 | It has over a hundred players and has performed all over the world, so the word must mean symphony orchestra.
管弦乐/1 | 既有弦乐器又有管乐器 | The band has both string and wind instruments, so the word must mean orchestral music.
首席/1 | 坐在指挥左手第一个的小提琴手 | She sits in the first seat on the conductor's left as lead violinist, so the word must mean principal.
声部/1 | 合唱团分高音低音几个 | The choir is divided into high and low groups, so the word must mean part.
协奏曲/1 | 钢琴独奏乐队伴奏 | In this piano work the piano plays solo with the orchestra accompanying, so the word must mean concerto.
序曲/1 | 歌剧开始前演奏的一段 | The orchestra played a piece before the opera began, so the word must mean overture.
乐章/1 | 交响曲四个第二个最慢 | The symphony has four of them and the second is the slowest, so the word must mean movement.
指挥家/1 | 把手一举乐团开始演奏 | When he raises his hand the whole orchestra starts playing, so the word must mean conductor.
交响曲/1 | 管弦乐队演奏的大型乐曲 | It is a large work for orchestra usually in four movements, so the word must mean symphony.
音乐厅/1 | 声音效果好最后一排也清楚 | Sound carries well there even to the back row, so the word must mean concert hall.
和弦/1 | 左手按几根弦弹出 | Pressing several strings with the left hand produces one on the guitar, so the word must mean chord.
和声/1 | 几个声部合起来好听 | The choir's parts sing different notes that blend beautifully, so the word must mean harmony.
节拍/1 | 跳舞要跟上音乐的 | Dancers must keep time with the music, so the word must mean beat.
音阶/1 | 从低到高再从高到低弹 | Piano learners play the notes from low to high and back every day, so the word must mean scale.
五线谱/1 | 用五条平行线记音高 | It records pitch on five parallel lines, so the word must mean stave notation.
简谱/1 | 用数字一到七表示音 | It uses the numbers one to seven for the seven basic notes, so the word must mean numbered musical notation.
大调/1 | 听起来明亮欢快 | The piece sounds bright and cheerful, so the word must mean major key.
小调/1 | 听起来有点忧伤 | The piece sounds a little sad, so the word must mean minor key.
音准/1 | 唱歌常常偏高 | He sings with feeling but often goes sharp, so the word must mean intonation.
音域/1 | 能唱很高也能唱很低 | She can sing very high notes and very low ones, so the word must mean vocal range.
音色/1 | 钢琴和小提琴完全不同 | The same note sounds completely different on piano and violin, so the word must mean tone colour.
嘹亮/1 | 军号声整个营地听得见 | The bugle call can be heard across the whole camp, so the word must mean resonant.
男高音/1 | 他能唱很高的音 | He is a famous singer who can reach very high notes, so the word must mean tenor.
女高音/1 | 歌剧女主角常由她唱 | The heroine of an opera is often sung by one, so the word must mean soprano.
美声/1 | 音乐学院唱意大利歌剧 | She studied the Italian opera style of singing at the conservatory, so the word must mean bel canto.
哼唱/1 | 妈妈做饭轻轻地唱 | Mother softly sings an old song under her breath while cooking, so the word must mean to hum.
跑调/1 | 一唱歌就大家笑 | Everyone laughs whenever he sings off key, so the word must mean to sing out of tune.
假声/1 | 男歌手唱出很高像女声 | The male singer reached a very high note that sounded like a woman's voice, so the word must mean falsetto.
气息/1 | 唱歌要学会控制 | Without breath control you run out of air on long lines, so the word must mean breath.
清唱/1 | 没有伴奏站着唱 | With no accompaniment she just stood and sang, so the word must mean to sing unaccompanied.
古典音乐/1 | 欧洲流传几百年交响乐团演奏 | It has been played in Europe for centuries and orchestras still perform it, so the word must mean classical music.
流行音乐/1 | 排行榜上的新歌 | Most young people can sing the new songs on the charts, so the word must mean pop music.
摇滚乐/1 | 五十年代美国电吉他架子鼓 | It arose in 1950s America with electric guitar and drums, so the word must mean rock music.
爵士乐/1 | 新奥尔良即兴演奏 | It began in New Orleans and improvisation is one of its features, so the word must mean jazz.
嘻哈/1 | 纽约街头的说唱街舞 | It began on New York streets and includes rap and street dance, so the word must mean hip hop.
说唱/1 | 不唱歌而跟着节奏说 | He is not singing but speaking in rhythm, so the word must mean rap.
轻音乐/1 | 咖啡馆里让人放松 | Soft music in the café makes people relax, so the word must mean light music.
乡村音乐/1 | 美国南部农村吉他小提琴 | It came from the rural American South, with guitar and fiddle, so the word must mean country music.
电子音乐/1 | 用电脑做出各种声音 | It uses computers instead of traditional instruments, so the word must mean electronic music.
民族音乐/1 | 作曲家收集山区的 | The composer travelled the western mountains collecting local songs, so the word must mean ethnic music.
喧嚣/1 | 离开城市的到山里住 | He left the noise of the city for a month in the mountains, so the word must mean din.
喧闹/1 | 铃响以后操场安静了 | The playground fell quiet as soon as the bell rang, so the word must mean noisy.
嗡嗡/1 | 蜜蜂在耳边飞 | A bee flies around near the speaker's ear, so the word must mean buzz.
吼叫/1 | 老虎一声小鸟飞走 | The tiger roared and all the birds flew away, so the word must mean to roar.
喇叭/1 | 村口通知明天开会 | The loudspeaker at the village entrance is announcing tomorrow's meeting, so the word must mean loudspeaker.
口哨/1 | 心情好一边走一边吹 | He is in a good mood and whistles as he walks, so the word must mean whistle.
哨子/1 | 体育老师一吹排好队 | One blast from the PE teacher and the pupils lined up, so the word must mean whistle.
震耳欲聋/1 | 音响开得太大 | The speakers are turned up far too loud, so the word must mean deafening.
刺耳/1 | 指甲划过黑板 | Fingernails scraping a blackboard are painful to hear, so the word must mean ear-piercing.
回响/1 | 歌声在山谷里久久 | The singing echoes in the valley for a long time, so the word must mean to echo.
巡演/1 | 乐队在二十个城市演出 | The band will perform in twenty cities across the country this year, so the word must mean to tour.
签售/1 | 新专辑会歌迷排长队 | Fans queue for the singer to sign the new album at the bookshop, so the word must mean signing session.
加演/1 | 票卖完再多演两场 | Tickets sold out in minutes and the organisers added two more shows, so the word must mean to add performances.
追星/1 | 墙上贴满歌手照片 | Her walls are covered in photos of singers, so the word must mean to idolise stars.
帅气/1 | 白西装男歌手 | The male singer looks very handsome in his white suit, so the word must mean handsome.
蹦蹦跳跳/1 | 小朋友跑到台前 | The children skip and hop to the front when the music starts, so the word must mean bouncing about.
酷/1 | 戴墨镜弹电吉他 | He looks great playing electric guitar in dark glasses, so the word must mean cool.
乐迷/1 | 音乐节吸引成千上万 | Every summer the festival draws tens of thousands of music lovers, so the word must mean music fan.
音乐节/1 | 连续三天几十支乐队 | It runs for three days with dozens of bands, so the word must mean music festival.
开场/1 | 离开始还有一小时 | There is still an hour before the start and the queue is already long, so the word must mean opening.
录音棚/1 | 歌手在里面录了一整天 | The singer spent a whole day recording the song there, so the word must mean recording studio.
唱片/1 | 爷爷收藏的用唱机播放 | Grandpa's old ones need a record player, so the word must mean record.
光碟/1 | 很少有人去商店买了 | Everyone listens online now and few buy discs in shops, so the word must mean disc.
专辑/1 | 新的一共十首歌 | The singer's new one has ten songs, so the word must mean album.
单曲/1 | 一发行就被播放一百万次 | The song was played a million times online as soon as it came out, so the word must mean single.
母带/1 | 老唱片根据原来的重新制作 | The old record was remade from the original recording, so the word must mean master tape.
播放器/1 | 用手机上的听歌 | He listens to music through the app on his phone, so the word must mean player.
翻唱/1 | 老歌被很多年轻歌手唱过 | Many young singers have recorded their own versions of the old song, so the word must mean to cover.
原唱/1 | 老歌唱家最早唱的 | An old singer first sang the song and many have sung it since, so the word must mean original singer.
作曲家/1 | 由他谱曲诗人写词 | A famous musician wrote the music and a poet wrote the words, so the word must mean composer.
恐怖片/1 | 胆子小从来不敢看 | He is timid and never dares watch frightening films, so the word must mean horror film.
惊悚片/1 | 情节紧张心一直提着 | The audience is on edge until the last minute, so the word must mean thriller.
武侠片/1 | 外国人通过它认识中国功夫 | Many foreigners first learned about kung fu through such films, so the word must mean martial arts film.
喜剧片/1 | 让观众从头笑到尾 | The film keeps the audience laughing from start to finish, so the word must mean comedy.
动画片/1 | 会说话的小熊 | Children love the talking bear in it, so the word must mean cartoon.
科幻片/1 | 人类移民到火星 | The film is about humans settling on Mars, so the word must mean sci-fi film.
爱情片/1 | 一对年轻人相爱 | The film is about two young people in love, so the word must mean romance film.
悬疑片/1 | 最后才知道画是谁拿的 | Only in the last minutes does the audience learn who took the painting, so the word must mean mystery film.
剧情片/1 | 不靠特效靠故事人物 | It moves audiences through story and character instead of special effects, so the word must mean drama film.
武侠/1 | 爱看这类小说梦想行侠仗义 | He has loved novels of wandering swordsmen since childhood and dreams of righting wrongs, so the word must mean martial heroes.
制片人/1 | 四处找钱筹拍摄费用 | This person went everywhere looking for money and raised the shooting costs, so the word must mean producer.
剧组/1 | 在沙漠里待了三个月 | Everyone making the film spent three months in the desert, so the word must mean cast and crew.
片场/1 | 到处是灯和摄影机 | Lights and cameras are everywhere on his first visit, so the word must mean set.
摄影师/1 | 把草原拍得特别美 | The person behind the camera made the grassland look beautiful, so the word must mean cameraman.
场记/1 | 记下每个镜头拍几遍 | This person records how many takes each shot had and what the actors wore, so the word must mean script supervisor.
外景/1 | 在海边小村子拍的 | Scenes were shot in a seaside village, so the word must mean exterior scene.
杀青/1 | 拍了半年今天完成 | After six months of shooting the film is done and everyone poses for a photo, so the word must mean to finish shooting.
开机/1 | 下个月开始拍 | Shooting begins next month and will last four months, so the word must mean to start filming.
试镜/1 | 几百名演员最后选三个 | Hundreds of actors tried out and only three were chosen, so the word must mean audition.
群众演员/1 | 只在街上走了两步 | His only part in the film was walking two steps down a street, so the word must mean extra.
特写/1 | 镜头推近给她眼睛一个 | The camera moves in until her eyes fill the frame, so the word must mean close-up.
长镜头/1 | 五分钟没剪开 | The shot runs a full five minutes without a cut, so the word must mean long take.
慢镜头/1 | 冲过终点重放一遍 | The runner crossing the line was replayed at reduced speed, so the word must mean slow motion.
蒙太奇/1 | 不同镜头剪接讲故事 | Different shots are cut together to tell a whole story, so the word must mean montage.
剪辑/1 | 一百小时素材留两小时 | A hundred hours of footage were cut down to two, so the word must mean to edit.
配乐/1 | 电影的音乐很感人 | Many people bought the soundtrack after the film's moving music, so the word must mean soundtrack.
配音/1 | 外国动画由中国演员说话 | Chinese actors voice the foreign cartoon for children, so the word must mean to dub.
特效/1 | 恐龙是电脑做出来的 | The dinosaurs in the film were made by computer, so the word must mean special effects.
画外音/1 | 开头老人讲起故事 | At the start an unseen old man begins telling the story, so the word must mean voice-over.
空镜头/1 | 街道小河远山没有人 | The film shows the town at dawn with only streets, a river and hills, so the word must mean empty shot.
档期/1 | 春节电影票卖得最多 | Spring Festival is when the most cinema tickets are sold, so the word must mean schedule slot.
院线/1 | 全国各大同时上映 | The film opens in major cinema networks across the country at once, so the word must mean cinema chain.
影院/1 | 周末坐满观众 | At the weekend it is full of viewers, so the word must mean cinema.
预告片/1 | 还没上映网上被看几千万次 | Before release it was watched tens of millions of times online, so the word must mean trailer.
翻拍/1 | 根据三十年前的电影 | The film is a new version of one made thirty years ago, so the word must mean to remake.
影评/1 | 看完电影在网上写 | He writes about every film he sees online, so the word must mean film review.
上座率/1 | 每场几乎都坐满 | Almost every screening of the film is full, so the word must mean occupancy rate.
首映式/1 | 导演和主演都出席 | The director and stars attended the first showing, so the word must mean premiere.
观影/1 | 不影响别人手机调静音 | Phones should be silent to avoid disturbing other viewers, so the word must mean to watch a film.
影展/1 | 国际上获最佳导演奖 | The film won best director at an international festival, so the word must mean film festival.
影帝/1 | 获最佳男主角奖 | He won best actor for the film, so the word must mean best actor.
影后/1 | 三次获最佳女主角 | She has won best actress three times, so the word must mean best actress.
煽情/1 | 太刻意反而不感动 | Some scenes try too hard to make viewers cry and leave them unmoved, so the word must mean sentimental.
温馨/1 | 一家人互相关爱的电影 | The film shows a family caring for one another, so the word must mean warm.
走红/1 | 因电视剧一下子出名 | One TV series made her famous overnight, so the word must mean to become popular.
戏份/1 | 只出场了三次 | He appears only three times in the film, so the word must mean part.
入戏/1 | 拍完哭戏停不下来 | After the crying scene she could not stop for a long time, so the word must mean to get into character.
出道/1 | 十六岁开始演戏 | He started acting at sixteen and has made over twenty films, so the word must mean to debut.
童星/1 | 五岁开始演戏 | She began acting at five, so the word must mean child star.
叫座/1 | 票房和口碑都好 | The film has done well both at the box office and with critics, so the word must mean to draw crowds.
宦官/1 | 皇宫里照顾皇帝一家 | They served the emperor's family inside the palace, so the word must mean eunuch.
仕途/1 | 三十岁当上知府 | He became a prefect at thirty, so the word must mean official career.
丞相/1 | 秦朝帮皇帝处理大事 | The Qin set up this post to help the emperor run the realm, so the word must mean prime minister.
擢升/1 | 治水有功被提为知府 | He was raised to prefect for his success in flood control, so the word must mean to promote.
罢黜/1 | 犯大错被皇帝免官 | After a serious mistake the emperor removed him and he went home, so the word must mean to dismiss.
辅佐/1 | 周公帮助年幼的成王 | The Duke of Zhou helped the young King Cheng govern, so the word must mean to assist.
官宦/1 | 祖父父亲都做过官 | His grandfather and father both held office, so the word must mean officialdom.
入仕/1 | 通过科举做官 | Most ancient scholars took the imperial exams to become officials, so the word must mean to enter officialdom.
官职/1 | 分很多等级 | Ancient posts had many ranks, and higher rank meant more power, so the word must mean official post.
薪俸/1 | 古代官员常发粮食 | Ancient officials were often paid in grain instead of money, so the word must mean official salary.
内阁/1 | 总理和部长组成 | In some countries the premier and ministers decide major policies together, so the word must mean cabinet.
组阁/1 | 新总理选出各部部长 | After the election the new premier chose ministers for each department, so the word must mean to form a cabinet.
机关/1 | 大学毕业在政府工作 | After university he worked in a government office, so the word must mean government agency.
部委/1 | 政策由几个一起制定 | The policy was drawn up by several ministries together, so the word must mean ministries and commissions.
上级/1 | 我们决定不了要报告 | We cannot decide this and must report it upwards, so the word must mean higher authority.
直属/1 | 医院是市政府 | The hospital comes directly under the city government, so the word must mean directly subordinate.
编制/1 | 部门定员二十人 | The department has twenty posts but only fifteen people, so the word must mean staffing.
科室/1 | 医院各个都在二楼 | All the hospital's departments are on the second floor, so the word must mean department.
行政区/1 | 国家分成二十个 | The country is divided into twenty regions with their own governments, so the word must mean administrative region.
辖区/1 | 派出所管五万多人 | Over fifty thousand people live in the area the police station covers, so the word must mean jurisdiction.
公文/1 | 秘书每天处理几十份 | As a secretary he handles dozens of official papers a day, so the word must mean official document.
呈报/1 | 报告交给上级 | The findings were written up and sent to the higher authorities, so the word must mean to submit a report.
呈送/1 | 计划书交给市长 | The plan has been handed to the mayor for review, so the word must mean to present.
邮戳/1 | 以寄出日期为准 | The date of posting decides whether a form is on time, so the word must mean postmark.
公函/1 | 两个部门之间联系 | The two departments often correspond by official letter, so the word must mean official letter.
批文/1 | 拿到政府的才能开工 | The bridge can be built only after the government's approval arrives, so the word must mean approval document.
红头文件/1 | 写进去各部门都要执行 | The matter has been written into an official directive for all departments, so the word must mean official document.
复印件/1 | 带身份证原件和它 | Bring your identity card and a copy of it, so the word must mean photocopy.
原件/1 | 这份是复印件请拿来 | This is only a copy and the speaker wants to see the real one, so the word must mean original.
一沓/1 | 从包里拿出文件 | He took a stack of papers from his bag, so the word must mean a pile of.
繁琐/1 | 办证要跑五个部门 | Getting the licence once took visits to five departments, so the word must mean cumbersome.
简化/1 | 手续一天就能办好 | The government cut the steps and it now takes one day, so the word must mean to simplify.
冗长/1 | 一百页有用的十页 | Only ten of the report's hundred pages are useful, so the word must mean lengthy.
冗员/1 | 改革后机关里少了 | After reform there are fewer surplus staff and work is faster, so the word must mean redundant staff.
一站式/1 | 办事不用跑好几个地方 | People no longer need to visit several places to get things done, so the word must mean one-stop.
琐事/1 | 每天忙于各种 | He is busy with small matters every day and has no time for big questions, so the word must mean trivial matters.
层层/1 | 申请经过一级一级审批 | An application goes through one level after another and takes three months, so the word must mean level upon level.
重叠/1 | 两部门工作很多一样 | The two departments' work covers much of the same ground, so the word must mean to overlap.
叠加/1 | 几个问题加在一起更难 | Several problems piled on top of each other make things harder, so the word must mean to superimpose.
叠床架屋/1 | 机构设置重复 | Several departments handle the same small matter, so the word must mean needless duplication.
推诿/1 | 你的责任不要推给别人 | It is your responsibility and you should not pass it to others, so the word must mean to shirk.
搪塞/1 | 找借口应付记者 | He made an excuse and never really answered the reporters, so the word must mean to stall.
扯皮/1 | 两部门争了半年 | The two departments argued for six months without solving the problem, so the word must mean to wrangle.
拖沓/1 | 一周的工作拖一个月 | A week's work took him a month, so the word must mean sluggish.
踢皮球/1 | 部门互相推让他白跑 | The departments kept sending him to each other and he made several wasted trips, so the word must mean to pass the buck.
形式主义/1 | 开会只是走过场 | The meeting is only a show, so the word must mean formalism.
文山会海/1 | 整天陷在文件和会议里 | He is buried in papers and meetings all day and cannot go out to investigate, so the word must mean mountains of papers and seas of meetings.
敷衍塞责/1 | 工作要认真不能 | Work must be done carefully and responsibly, so the word must mean to perform one's duty perfunctorily.
东拉西扯/1 | 说半天没到重点 | He talked a long time without reaching the point, so the word must mean to ramble.
扯后腿/1 | 大家努力你别拖累 | Everyone is working hard and you should not hold them back, so the word must mean to hold back.
搁置/1 | 资金不够计划被放下 | There was not enough money and the plan was put aside, so the word must mean to shelve.
搁浅/1 | 大船要等涨潮离开 | The big ship must wait for high tide to get off, so the word must mean to run aground.
悬而未决/1 | 问题好几年没解决 | The question has been left unsettled for years, so the word must mean outstanding.
一拖再拖/1 | 工程去年完工到现在还没 | The project was due last year and is still not finished, so the word must mean to delay repeatedly.
议而不决/1 | 开了三次会没决定 | Three meetings have produced no decision, so the word must mean to discuss without deciding.
当机立断/1 | 情况紧急马上让人离开 | In the emergency he ordered everyone out of the building at once, so the word must mean to decide promptly.
拍板/1 | 最后由校长来决定 | In the end the head teacher must decide, so the word must mean to make the final decision.
定夺/1 | 两方案请领导决定 | Both plans have merits and the leader must choose, so the word must mean to decide.
否决/1 | 提案被大多数人 | Most people at the meeting voted the proposal down, so the word must mean to veto.
从长计议/1 | 事情复杂不能马上决定 | The matter is complicated and cannot be decided at once, so the word must mean to consider at length.
弹劾/1 | 议会可以对违法总统 | In some countries parliament can bring charges to remove a president who breaks the law, so the word must mean to impeach.
问责/1 | 事故后负责人被 | After the accident those in charge were made to answer for it, so the word must mean to hold accountable.
巡视/1 | 校长每天在校园里走一圈 | Every morning the head teacher walks a round of the campus to check on it, so the word must mean to inspect.
秉公办事/1 | 法官三十年不偏向任何一方 | In thirty years as a judge he never favoured either side, so the word must mean to act impartially.
恪守/1 | 医生必须遵守职业道德 | Doctors must strictly keep their professional ethics and protect patients' privacy, so the word must mean to abide by.
恪尽职守/1 | 三十年没出过错 | He has not made a single mistake at his post in thirty years, so the word must mean to perform one's duties conscientiously.
秉持/1 | 医院始终坚持病人第一 | The hospital has always held to putting patients first, so the word must mean to uphold.
遴选/1 | 从一百多名老师中选出十人 | The school chose ten of its hundred-odd teachers to compete, so the word must mean to select.
舞弊/1 | 考试中发现成绩作废 | Any cheating found in the exam cancels the results, so the word must mean malpractice.
罢免/1 | 选民可以撤掉不称职代表 | By the rules, voters can remove representatives who are not fit for the job, so the word must mean to recall.
任命/1 | 他被指派为校长 | He has been named head of the university, so the word must mean to appoint.
任免/1 | 干部的要按程序 | Putting officials in and out of posts must follow set procedures, so the word must mean to appoint and dismiss.
上任/1 | 新市长先去走访 | After taking up the post, the new mayor first visited several old neighbourhoods, so the word must mean to take office.
就职/1 | 新总统在典礼上讲话 | The new president spoke at the ceremony marking his start in office, so the word must mean to assume office.
离任/1 | 老校长走时学生来送 | Many pupils came to see the old head teacher off when he left, so the word must mean to leave a post.
代理/1 | 副校长暂代校长工作 | While the head teacher is abroad, the deputy does the job, so the word must mean to act for.
任职/1 | 曾在外交部二十年 | He once worked at the foreign ministry for twenty years, so the word must mean to hold a post.
免职/1 | 严重失职被 | He lost his post for serious neglect of duty, so the word must mean to remove from office.
调任/1 | 从北京到上海担任经理 | He moved from Beijing to Shanghai to head the branch office, so the word must mean to be transferred.
履新/1 | 新任大使下周到任 | The new ambassador starts work next week, so the word must mean to take up a new post.
法令/1 | 政府禁止公共场所吸烟 | The government has issued an order banning smoking in public places, so the word must mean decree.
施行/1 | 法律从明年一月起 | The law takes effect from next January the first, so the word must mean to put into effect.
废止/1 | 过时的规定被取消 | The outdated rule has been abolished, so the word must mean to repeal.
颁行/1 | 新交通法规正式 | The new traffic regulations have been officially issued, so the word must mean to promulgate.
赦免/1 | 国王让犯人回家 | The king let the prisoner go home to his family, so the word must mean to pardon.
特赦/1 | 国庆时放了表现好的犯人 | On National Day the government freed a group of well-behaved prisoners, so the word must mean special pardon.
大赦/1 | 新皇帝登基宣布天下 | Ancient emperors often freed prisoners across the land on taking the throne, so the word must mean general amnesty.
有法可依/1 | 保护野生动物有了法律 | Since the law took effect, protecting wildlife has a legal basis, so the word must mean to have laws to go by.
条文/1 | 法律一百多条 | The law has over a hundred articles, so the word must mean clause.
细则/1 | 新规定还要制定实施 | After the new rules are published, the departments must also draw up how they apply, so the word must mean detailed rules.
国徽/1 | 法院大门上方挂着 | It hangs above the court's main entrance, so the word must mean national emblem.
徽章/1 | 运动员胸前戴着 | Each athlete wears one on the chest for the competition, so the word must mean badge.
国歌/1 | 升国旗时全校一起唱 | When the flag is raised, all teachers and pupils sing it together, so the word must mean national anthem.
校徽/1 | 校服上印着学校标志 | It is printed on every pupil's uniform, so the word must mean school emblem.
会徽/1 | 奥运会的标志由设计师设计 | This Olympics' symbol was designed by a young designer, so the word must mean event emblem.
钢印/1 | 照片上压出凸起的印 | The photo on a diploma is valid only once the school's raised stamp is pressed on it, so the word must mean steel seal.
印泥/1 | 盖章前先按一下红色的 | Press the seal on the red paste first, so the word must mean red ink paste.
印鉴/1 | 银行留着的印章样子 | When withdrawing money, the seal must match the one the bank keeps, so the word must mean seal impression on file.
签章/1 | 双方签字盖章合同才有效 | The contract takes effect only with both sides' signatures and seals, so the word must mean signature and seal.
戳/1 | 用手指碰了一下肩膀 | He jabbed the speaker's shoulder with a finger, so the word must mean to poke.
斡旋/1 | 第三国帮两国重新谈判 | A third country helped bring the two back to the negotiating table, so the word must mean to mediate.
调停/1 | 邻居吵架主任出面 | When the neighbours quarrelled, the residents' committee head stepped in, so the word must mean to make peace between.
协定/1 | 两国签了降低关税的 | The two countries signed a trade agreement cutting tariffs on many goods, so the word must mean accord.
照会/1 | 外交部向对方发出表明立场 | The foreign ministry stated its position to the other side in writing, so the word must mean diplomatic note.
多边/1 | 二十多个国家参加会谈 | Over twenty countries took part in the talks, so the word must mean multilateral.
中间人/1 | 双方不见面请人传话 | The two sides would not meet and asked someone to carry messages, so the word must mean middleman.
冰释前嫌/1 | 长谈后老朋友又和好 | After a long talk the old friends were as close as before, so the word must mean to bury old grudges.
停火/1 | 明天起不再打仗开始谈判 | Both sides agreed to stop fighting from tomorrow and hold peace talks, so the word must mean to cease fire.
求同存异/1 | 找共同点保留不同意见 | Both sides looked for common ground and set their differences aside, so the word must mean to seek common ground while keeping differences.
各让一步/1 | 双方都退让一点 | The problem can be solved if everyone gives a little, so the word must mean each side gives a little.
表格/1 | 填好交到二号窗口 | Fill it in and hand it to window two, so the word must mean form.
勾选/1 | 在同意的选项前做记号 | Mark the options you agree with, so the word must mean to tick.
打勾/1 | 做对了画一个对号 | The teacher marks right answers this way and circles wrong ones, so the word must mean to mark with a tick.
一栏/1 | 表格最后是签名 | The last part of the form is for the signature, so the word must mean a column.
空格/1 | 表上还有几处没填 | Several places on the form are still empty, so the word must mean blank space.
必填/1 | 带星号的不能空着 | Items with a star cannot be left empty, so the word must mean required field.
选填/1 | 不想写可以不写 | You may leave out your phone number if you wish, so the word must mean optional field.
漏填/1 | 出生日期忘了写 | The date of birth was left out and must be added, so the word must mean to leave unfilled.
附件/1 | 材料随邮件一起发送 | Application materials should be sent along with the email, so the word must mean attachment.
如实/1 | 个人信息不能填假的 | Personal details must not be false, so the word must mean truthfully.
勾结/1 | 商人联合起来提高物价 | Several merchants were punished for secretly working together to raise prices, so the word must mean to collude.
蒙蔽/1 | 被假象骗了没看出问题 | He was fooled by appearances and missed the problem, so the word must mean to hoodwink.
遮蔽/1 | 大树挡住阳光林子凉快 | Tall trees keep out the sun and the woods are cool, so the word must mean to shade.
隐蔽/1 | 村子在山谷深处不好找 | The village lies deep in a valley and is hard to find, so the word must mean concealed.
戳穿/1 | 谎话很快被揭开 | His lies were soon exposed, so the word must mean to expose.
透明/1 | 财政收支公开让人民监督 | Government income and spending should be open for the people to oversee, so the word must mean transparent.
公开/1 | 招聘结果在网上让大家看 | The hiring results will be published online, so the word must mean to make public.
暗箱操作/1 | 招标公开进行防止 | Tenders are held in the open to prevent secret deals, so the word must mean under-the-table dealing.
真相大白/1 | 调查后事情清楚了 | After the investigation everything became clear, so the word must mean the truth comes out.
蒙在鼓里/1 | 大家都知道只有他不知道 | Everyone else knows and only he does not, so the word must mean to be kept in the dark.
松弛/1 | 运动后肌肉放松下来 | After exercise the muscles relax, so the word must mean slack.
废弛/1 | 制度长期没人执行 | The factory's rules went unenforced for years and broken machines were left unmended, so the word must mean lax.
一张一弛/1 | 学习和休息要交替 | Studying without rest is less efficient, so the word must mean alternate tension and relaxation.
张弛有度/1 | 导演讲故事节奏好 | The director paces the story very well, so the word must mean with proper rhythm.
阻挠/1 | 想办法让工程做不成 | They tried everything to stop the project but failed, so the word must mean to obstruct.
挠头/1 | 题难得想了一小时 | The speaker thought for an hour and still could not solve the problem, so the word must mean to scratch one's head.
收紧/1 | 物价上涨贷款政策变严 | With prices rising, the government made lending stricter, so the word must mean to tighten.
放宽/1 | 年龄限制变松十岁也能参加 | The school relaxed its age limit and ten-year-olds can now enter, so the word must mean to relax.
闭塞/1 | 山村交通不便很少有外人 | Few outsiders used to reach the remote mountain village, so the word must mean cut off.
堵塞/1 | 下水道被树叶堵住 | Leaves have blocked the drain and rainwater cannot flow out, so the word must mean to clog.
直辖市/1 | 北京天津上海重庆 | Beijing, Tianjin, Shanghai and Chongqing are China's four, so the word must mean municipality directly under the central government.
自治区/1 | 西藏和新疆 | China has five, such as Tibet and Xinjiang, so the word must mean autonomous region.
特区/1 | 南方沿海最早设立的经济 | China's first four economic ones were all on the southern coast, so the word must mean special zone.
乡镇/1 | 公路通到县里每一处 | The road reaches every township in the county, so the word must mean townships and towns.
村委会/1 | 召开村民大会讨论修路 | It called a meeting of villagers to decide about the road, so the word must mean village committee.
县长/1 | 走遍全县每个乡镇 | The new head of the county visited every township in it, so the word must mean county magistrate.
首府/1 | 呼和浩特是内蒙古的 | Hohhot is the capital of the Inner Mongolia Autonomous Region, so the word must mean regional capital.
市政/1 | 修路供水和路灯 | Roads, water supply and street lights are city works, so the word must mean municipal administration.
区划/1 | 两个县合并成一个区 | Under the new administrative boundaries, two counties have become one district, so the word must mean administrative division.
地级市/1 | 下面管三个县和两个区 | This city governs three counties and two districts, so the word must mean prefecture-level city.
赊账/1 | 熟人到月底再付钱 | The village shop used to let regulars pay at the end of the month, so the word must mean to buy on credit.
赊购/1 | 原料三个月后付款 | The factory took materials from its supplier and will pay in three months, so the word must mean to purchase on credit.
赎回/1 | 攒够钱把当掉的手表拿回 | Once he had saved enough, he got back the watch he had pawned, so the word must mean to redeem.
借据/1 | 借钱时让对方写一张 | When lending money, ask the borrower to write a note, so the word must mean IOU.
借贷/1 | 银行的主要业务之一 | It is one of a bank's main businesses, so the word must mean borrowing and lending.
还清/1 | 工作十年房贷全还完 | After ten years of work he finished repaying his home loan, so the word must mean to pay off.
本息/1 | 本金加利息一起还 | In three years the loan must be repaid together with the interest, so the word must mean principal and interest.
分期付款/1 | 每月三百元一年付完 | The computer can be paid for at three hundred yuan a month over a year, so the word must mean to pay in instalments.
典当/1 | 急需用钱把手表押出去 | He needed money badly and left his heirloom watch as security, so the word must mean to pawn.
当铺/1 | 缺钱时把东西送去换钱 | People short of money once took valuables there for cash, so the word must mean pawnshop.
拮据/1 | 家里经济困难边上学边打工 | The family had little money in those years and he worked while studying, so the word must mean short of money.
窘迫/1 | 被大家看着说不出话 | With everyone watching, he could not get a word out, so the word must mean awkward.
阔绰/1 | 一顿饭花好几千元 | He spent several thousand yuan on one meal, so the word must mean free-spending.
手头紧/1 | 等发了工资再买手机 | The speaker will wait for payday before buying a new phone, so the word must mean short of money.
入不敷出/1 | 花的比挣的多 | He spends more than he earns every month, so the word must mean expenses exceed income.
节衣缩食/1 | 父母省吃省穿供孩子上学 | The parents went without to pay for their child's education, so the word must mean to scrimp and save.
挥金如土/1 | 中大奖两年把钱花光 | He won a big prize and spent it all within two years, so the word must mean to spend money like water.
腰包/1 | 聚会的钱他自己出 | He paid for the party out of his own pocket, so the word must mean purse.
慷慨解囊/1 | 孩子病了邻居纷纷捐钱 | When the child fell ill, the neighbours all gave money, so the word must mean to give generously.
一贫如洗/1 | 大火烧掉房子什么都没了 | A fire burned down his house and left him with nothing, so the word must mean utterly destitute.
甩卖/1 | 商店要关门半价卖 | The shop is closing and everything is half price, so the word must mean to sell off.
吆喝/1 | 推车卖菜边走边喊 | The old man pushes his cart down the street calling out what he sells, so the word must mean to cry one's wares.
兜售/1 | 车站门口向游客卖假手表 | Someone at the station is trying to sell fake watches to tourists, so the word must mean to peddle.
叫卖/1 | 菜市场里到处是这种声音 | The market is full of sellers calling out in the morning, so the word must mean to hawk.
清仓/1 | 冬天快过处理冬衣 | Winter is nearly over and the shop is getting rid of winter clothes, so the word must mean to clear inventory.
薄利多销/1 | 小店少赚一点多卖 | The small shop has grown by making a little on a lot of sales, so the word must mean small profit but high turnover.
跳楼价/1 | 全场一件十元 | The sign at the door says everything is ten yuan, so the word must mean rock-bottom price.
大减价/1 | 年底商场很多东西打五折 | At year's end the mall marks many things down by half, so the word must mean big sale.
摆摊/1 | 晚上在夜市卖小吃 | Every evening he sells snacks at the night market, so the word must mean to set up a stall.
货真价实/1 | 老店东西几十年受欢迎 | The old shop's goods have been popular for decades, so the word must mean genuine goods at fair prices.
凑钱/1 | 同学们一起出钱买花 | The classmates chipped in to buy flowers for their sick teacher, so the word must mean to pool money.
集资/1 | 村民一起出钱修桥 | The villagers put money together to build a new bridge, so the word must mean to raise funds.
众筹/1 | 在网上为新电影筹到一百万 | He raised a million yuan online for his new film, so the word must mean crowdfunding.
赈灾/1 | 地震后政府马上拨款 | After the earthquake the government sent money at once, so the word must mean to provide disaster relief.
赈济/1 | 古代灾荒朝廷开仓给百姓 | In famines the ancient court opened its granaries to the people, so the word must mean to relieve.
义卖/1 | 卖书得到的钱捐给山区 | All money from the school's book sale went to a mountain school, so the word must mean charity sale.
善款/1 | 全部用来帮助受灾群众 | All the donations will help those hit by the disaster, so the word must mean charitable donations.
救济金/1 | 失业后每月领一些 | Since losing his job he receives some money each month, so the word must mean relief payment.
认捐/1 | 企业当场答应捐一百万 | Several companies promised a million yuan on the spot, so the word must mean to pledge a donation.
凑份子/1 | 同事结婚几个人合买礼物 | When a colleague married, a few of us bought one present together, so the word must mean to club together.
英镑/1 | 在英国买东西用 | Purchases in Britain are paid with it, so the word must mean pound sterling.
卢布/1 | 去莫斯科先换成 | Before visiting Moscow, change money into it, so the word must mean rouble.
泰铢/1 | 泰国街头一碗面五十 | A bowl of noodles on a Thai street costs about fifty, so the word must mean baht.
美金/1 | 人们也这样叫美元 | People often use this name for the US dollar, so the word must mean US dollar.
港币/1 | 在香港坐地铁用 | It pays for the underground in Hong Kong, so the word must mean Hong Kong dollar.
汇价/1 | 欧元最近一直在上涨 | The euro's value against other money has kept rising, so the word must mean exchange rate.
换汇/1 | 出国留学前先去银行 | Before studying abroad he went to the bank to change money, so the word must mean to exchange currency.
本币/1 | 贬值后进口商品变贵 | Imports got dearer once the country's own money lost value, so the word must mean domestic currency.
硬通货/1 | 美元在国际贸易中 | The US dollar has long been important in international trade, so the word must mean hard currency.
保值/1 | 买黄金是为了不贬值 | Many people buy gold to keep their money's worth, so the word must mean to preserve value.
贰/1 | 支票上二的大写 | On a cheque the number two is written in its formal character, so the word must mean two.
叁/1 | 收据上三十元这样写 | Thirty yuan on a receipt is written with the formal character for three, so the word must mean three.
肆/1 | 发票上就是数字四 | On an invoice this character stands for four, so the word must mean four.
大写/1 | 金额这样写防止涂改 | Bank slips write amounts in formal characters to stop alteration, so the word must mean formal numerals.
小写/1 | 支票上和大写同时写 | A cheque gives the amount in both formal and ordinary figures, so the word must mean ordinary numerals.
票据/1 | 出差回来交给财务 | After a business trip all of them go to the finance department, so the word must mean bills and receipts.
开票/1 | 需要发票请商店 | If you need an invoice, ask the shop for one, so the word must mean to issue an invoice.
报销/1 | 出差车费住宿费可以 | Travel and hotel costs on a business trip can be claimed back, so the word must mean to claim expenses.
入账/1 | 钱已经在账户里查到 | The money has arrived and shows in the account, so the word must mean to be entered into the account.
零头/1 | 一百零三元只收一百 | The total was a hundred and three yuan and the owner took only a hundred, so the word must mean odd change.
货栈/1 | 河边一排存放货物的老房子 | Merchants once kept goods in the row of old buildings by the river, so the word must mean warehouse.
商埠/1 | 一百多年前外国商船来往 | Over a century ago foreign merchant ships came and went in this city, so the word must mean commercial port.
开埠/1 | 上海对外开放成为大城市 | Once opened to trade, Shanghai quickly became China's largest city, so the word must mean to open a port to trade.
口岸/1 | 边境每天几千辆货车通过 | Thousands of lorries cross the border here every day, so the word must mean port of entry.
栈桥/1 | 青岛伸进海里四百多米 | Qingdao's one reaches over four hundred metres into the sea, so the word must mean pier.
客栈/1 | 古镇上接待游客的老店 | An old one in the town still takes in travellers, so the word must mean inn.
转口/1 | 新加坡这种贸易发达 | Singapore's trade in goods passing through is highly developed, so the word must mean re-export.
通关/1 | 货物一小时过海关 | With the new system goods pass customs in an hour, so the word must mean to clear customs.
驳船/1 | 把货物从大船运到岸上 | Flat boats carry goods from the big ship to shore, so the word must mean barge.
中转站/1 | 港口是亚洲货物的 | The port is a key point in Asia where goods change ships, so the word must mean transfer station.
斤/1 | 五百克苹果 | Five hundred grams of apples make one, so the word must mean half a kilogram.
斤斤计较/1 | 朋友之间为小钱争 | Friends should not argue over small sums, so the word must mean to be calculating.
掂量/1 | 西瓜拿在手里估重量 | He weighed the melon in his hand and said it was about ten jin, so the word must mean to weigh in the hand.
公斤/1 | 一袋米重十 | The bag of rice weighs ten, so the word must mean kilogram.
半斤八两/1 | 两人成绩差不多 | Neither of the two does much better than the other, so the word must mean much the same.
缺斤短两/1 | 卖东西分量不够 | Market inspectors check every stall to stop underweight sales, so the word must mean to give short weight.
称重/1 | 水果先放秤上 | Fruit must be put on the scale before paying, so the word must mean to weigh.
毛重/1 | 包括箱子二十公斤 | The box weighs twenty kilograms with packing and eighteen without, so the word must mean gross weight.
净重/1 | 不包括袋子五百克 | The biscuits weigh five hundred grams without the bag, so the word must mean net weight.
一分钱一分货/1 | 衣服贵但质量好 | The garment is expensive but of very good quality, so the word must mean quality matches price.
飙升/1 | 夏天空调销量猛涨 | Air-conditioner sales shoot up as soon as summer comes, so the word must mean to soar.
暴涨/1 | 干旱粮价一下涨很多 | The drought has sent grain prices shooting up, so the word must mean to rise sharply.
暴跌/1 | 股价一下跌了一半 | The company's share price fell by half after the news, so the word must mean to fall sharply.
行情/1 | 蔬菜卖不出好价钱 | Farmers cannot get good prices for vegetables at the moment, so the word must mean market situation.
涨幅/1 | 房价今年涨得比去年少 | House prices rose less this year than last, so the word must mean rate of increase.
跌幅/1 | 下跌百分之五最大一天 | The share fell five per cent today, its worst day this year, so the word must mean rate of decline.
回落/1 | 涨了一个月开始下降 | After a month of rises, oil prices have started to come down, so the word must mean to drop back.
走势/1 | 专家认为明年房价平稳 | Experts think house prices will be steady next year, so the word must mean trend.
萎靡不振/1 | 市场不好商店生意差 | Business is bad in many shops, so the word must mean listless.
增值/1 | 房子买了十年值钱多了 | The flat bought ten years ago is now worth much more, so the word must mean to rise in value.
散户/1 | 资金少消息不灵通 | Compared with big institutions they have little money and poor information, so the word must mean individual investor.
熊市/1 | 大部分股票价格下跌 | Most share prices are falling, so the word must mean bear market.
大盘/1 | 今天整个股市涨两个百分点 | The whole stock market rose two per cent today, so the word must mean overall market.
开盘/1 | 早上九点半股市 | The stock market starts trading at half past nine, so the word must mean market opening.
收盘/1 | 下午三点股市结束 | The share was still up when trading ended at three, so the word must mean market close.
涨停/1 | 好消息一开盘就涨到顶 | The share hit the highest rise allowed as soon as trading opened, so the word must mean to hit the daily upper limit.
跌停/1 | 公司出问题连续三天 | The share fell the most allowed three days running, so the word must mean to hit the daily lower limit.
抄底/1 | 想在最低价时买进 | He tried to buy at the lowest price, but the share kept falling, so the word must mean to buy at the bottom.
套牢/1 | 高价买的股票舍不得卖 | He bought high and cannot bear to sell, so the word must mean to be locked in at a loss.
市值/1 | 公司一年里翻了一番 | The company's total share value doubled in a year, so the word must mean market capitalisation.
揣测/1 | 人们猜明年经济怎么样 | People are guessing what the economy will do next year, so the word must mean to conjecture.
揣摩/1 | 演员仔细体会角色心理 | Actors must think hard about what their characters feel, so the word must mean to try to fathom.
大鳄/1 | 金融界资金多能影响市场 | These big financial players have enough money to move the whole market, so the word must mean financial shark.
投机/1 | 买房不为住为赚钱 | He buys houses not to live in but to make money on price changes, so the word must mean to speculate.
割肉/1 | 股价一跌再跌只好卖 | The share kept falling and he sold at a loss, so the word must mean to sell at a loss.
炒股/1 | 不懂买卖股票却全投进去 | He knew nothing about shares yet put all his savings into the market, so the word must mean to speculate in stocks.
观望/1 | 房价不稳还在等 | House prices are unsteady and many people are waiting, so the word must mean to wait and see.
跟风/1 | 别人买什么他就买什么 | He buys whatever others buy, so the word must mean to follow the trend.
庄家/1 | 先推高股价再高价卖出 | Some big players push the share price up first and then sell high, so the word must mean manipulator.
追涨/1 | 看到上涨就买进 | He bought when the price rose and it fell the next day, so the word must mean to buy into a rally.
敛财/1 | 骗子借慈善名义 | The swindler raised money under the cover of charity and was punished, so the word must mean to amass wealth.
聚敛/1 | 古代官员向百姓收钱财 | Some ancient officials squeezed money from the people under all sorts of names, so the word must mean to amass by exaction.
捞钱/1 | 当官不为做事为赚钱 | He became an official not to serve but to grab money, so the word must mean to rake in money.
榨取/1 | 工厂主用低工资 | The factory owner exploits his workers with low wages, so the word must mean to extort.
压榨/1 | 机器把花生做成油 | The machine squeezes peanuts into peanut oil, so the word must mean to press.
暴利/1 | 假药成本低获得 | Fake medicines cost little and their sellers made huge profits, so the word must mean exorbitant profit.
不义之财/1 | 一辈子清白不拿 | He has led a clean life and never taken dishonest money, so the word must mean ill-gotten wealth.
坐收渔利/1 | 两家争第三家得好处 | Two firms fought each other to exhaustion while a third gained, so the word must mean to reap the spoils.
中饱私囊/1 | 把公款放进自己口袋 | He used his post to pocket public money and was sentenced, so the word must mean to embezzle.
大肆/1 | 公司宣传得很厉害 | The company advertises its product loudly though the quality is poor, so the word must mean without restraint.
缉私/1 | 海关船在海上巡逻 | Customs ships patrol the sea checking passing vessels, so the word must mean to suppress smuggling.
通缉/1 | 警察在全国发布抓逃犯的令 | The police issued a nationwide order to catch the escaped prisoner, so the word must mean to put on the wanted list.
洗钱/1 | 银行报告可疑大额交易 | Banks must report suspicious large transactions, so the word must mean to launder money.
偷税/1 | 公司做假账被罚款 | The company kept false accounts and was fined by the tax office, so the word must mean to evade tax.
漏税/1 | 小商贩不了解规定 | Some small traders fail to pay because they do not know the tax rules, so the word must mean to fail to pay tax.
逃税/1 | 把钱转到国外 | He moved money abroad to avoid paying and was found out, so the word must mean to dodge tax.
查封/1 | 卖假药的商店被贴封条 | The shop selling fake medicine has been sealed up by the authorities, so the word must mean to seal up.
追缴/1 | 税务部门向公司要回税款 | The tax office made the company pay three million yuan it owed, so the word must mean to recover.
走私/1 | 海关查获一批手机 | Customs seized a batch of phones brought in illegally, so the word must mean to smuggle.
囤积居奇/1 | 灾情后商人把粮价提高 | After the disaster some merchants held back grain and pushed prices up, so the word must mean to hoard for profit.
储户/1 | 银行要保护存款安全 | Banks must keep their customers' savings safe, so the word must mean depositor.
销户/1 | 银行卡不用了去办理 | He had not used the bank card for a long time and went to close it, so the word must mean to close an account.
网银/1 | 转账不用去银行排队 | Transfers can now be made without queuing at the bank, so the word must mean online banking.
零存整取/1 | 每月存五百一年后一起取 | She puts in five hundred yuan each month and takes it all out after a year, so the word must mean regular deposits withdrawn in a lump.
自动取款机/1 | 银行关门了去取钱 | The bank was closed at night and he took money out from a machine, so the word must mean ATM.
存单/1 | 带着它和身份证取钱 | When a fixed deposit matures, take it and your identity card to the bank, so the word must mean deposit receipt.
挂失/1 | 银行卡丢了马上打电话 | When a bank card is lost, phone the bank at once, so the word must mean to report a loss.
利滚利/1 | 要还的比借的多很多 | With such a loan, the amount owed grows far beyond what was borrowed, so the word must mean compound interest.
网点/1 | 银行在全市有一百多个 | The bank has over a hundred branches in the city, so the word must mean outlet.
存取/1 | 在任何分行存钱取钱 | The card works for putting in and taking out cash at any branch, so the word must mean to deposit and withdraw.
经济危机/1 | 一九二九年工厂倒闭工人失业 | In 1929 many factories closed and huge numbers lost their jobs, so the word must mean economic crisis.
通货紧缩/1 | 物价不断下降人们不愿花钱 | Prices keep falling and people become unwilling to spend, so the word must mean deflation.
经济周期/1 | 繁荣衰退萧条复苏 | Boom, recession, depression and recovery make one complete round, so the word must mean economic cycle.
内需/1 | 让国内的人多消费 | The government wants people at home to spend more, so the word must mean domestic demand.
外需/1 | 出口工厂订单少了 | Many export factories have fewer orders, so the word must mean foreign demand.
拉动/1 | 旅游业发展带动当地经济 | Tourism has boosted the local economy, so the word must mean to drive.
供过于求/1 | 苹果大丰收价格下降 | A huge apple harvest has brought prices down, so the word must mean supply exceeds demand.
过热/1 | 防止经济增长太快 | The government raised interest rates to keep the economy from growing too fast, so the word must mean overheating.
软着陆/1 | 增长速度慢慢降下来 | The government hopes growth will slow gently, so the word must mean soft landing.
降息/1 | 央行鼓励企业借钱 | The central bank is encouraging firms to borrow, so the word must mean to cut interest rates.
`);
