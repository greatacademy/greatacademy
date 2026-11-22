// The speaking topics of grades 5 and 6 (docs/chinese-curriculum.md §18.9): discussing, catching key points, tone and
// stress, and civil language in grade 5; brief prepared remarks, presenting a topic, interviewing and responding to a
// view in grade 6. The scenes and the words said are written for this subject. Until their recordings are made, what
// is said is shown as text to be read as if heard.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageThreeFourReading } from "../reading/stage-3-4.ts";
import { stageFiveSixReading } from "../reading/stage-5-6.ts";
import { parseRules, ruleGenerator } from "../reading/topic-kit.ts";
import { rule, ruleTexts, type Spec, stageSpeakingTopics, topicOf } from "./speaking-1-2.ts";
import { stageThreeFourSpeaking } from "./speaking-3-4.ts";

/** ON_TOPIC_5 are the scenes of speaking-5-discussion: what keeps to the topic under discussion. */
const ON_TOPIC_5 = parseRules(`
班里讨论：春游去公园还是去博物馆？
= 我觉得去博物馆好，可以看到很多古代的东西，还能学到历史知识。
- 我昨天在公园里看见了一只很大的狗。 ~offtopic
- 说到博物馆，我想起我表哥，他在外地上大学，学的是历史，他们学校很大，有好几个食堂…… ~rambling

小组讨论：怎样让教室更干净？
= 我建议每天放学后，每组派一个人检查自己这一片地面。
- 我家里的地板是爸爸拖的。 ~offtopic
- 干净这件事吧，其实很多地方都要干净，家里要干净，街上要干净，公园也要干净，大家都应该…… ~rambling

班会讨论：课间可以玩哪些安全的游戏？
= 可以跳绳或者踢毽子，地方不大，也不容易撞到人。
- 我最喜欢玩的是电脑游戏。 ~offtopic
- 游戏有很多种，有的在室内，有的在室外，有的一个人玩，有的很多人玩，还有的…… ~rambling

小组讨论：读书节我们组出一份什么样的手抄报？
= 我们可以每人推荐一本书，写上推荐的理由，再配上一幅小画。
- 我的字写得不好看，上次还被老师说了。 ~offtopic
- 手抄报要用纸，纸有大有小，有白的有彩色的，我们家楼下的文具店什么纸都有，那里的老板…… ~rambling

讨论：班里的图书角要不要定借书规则？
= 我觉得要定，比如每人一次只借一本，一个星期内还，这样书就不会少。
- 我妹妹最近也开始看书了。 ~offtopic
- 规则这个东西很重要，学校有规则，交通有规则，下棋也有规则，打球也有规则…… ~rambling

小组讨论：科学课的种子发芽实验，谁负责记录？
= 我愿意负责记录，我每天早上来得早，可以先看一看、量一量。
- 我家阳台上种了很多花。 ~offtopic
- 记录嘛，就是写下来，写下来的东西有很多，日记也是写下来的，作文也是…… ~rambling

讨论：学校运动会，我们班的口号用哪一个？
= 我选“团结一心，勇争第一”，短，好记，喊起来也响亮。
- 去年运动会那天下雨了，我的鞋全湿了。 ~offtopic
- 口号就是要喊的话，我们平时也会喊，上课喊“起立”，下课…… ~rambling

讨论：要不要在班里养一缸小金鱼？
= 我同意养，可以让大家学会照顾小动物，大家轮流喂就行。
- 我喜欢吃鱼，特别是妈妈做的红烧鱼。 ~offtopic
- 鱼有很多种，海里有，河里有，湖里也有，有的大有的小，有一种鱼还会飞…… ~rambling

小组讨论：怎样帮助学习有困难的同学？
= 我们可以结成对子，每天课后花十分钟一起把错题再做一遍。
- 我数学考试一般都是第一名。 ~offtopic
- 困难的事很多，我小时候学骑车就很困难，摔了好多次，膝盖上还有疤…… ~rambling

讨论：周末的班级活动去看电影还是去植树？
= 我觉得去植树好，春天正是种树的时候，还能为社区做点事。
- 我最近在看一本很好看的小说。 ~offtopic
- 电影院里黑黑的，座位是红色的，前面有一个很大的屏幕，旁边还卖爆米花和饮料…… ~rambling
`);

/** REASONED_5 are the scenes of speaking-5-discussion: a view put with a reason that bears on the matter. */
const REASONED_5 = parseRules(`
讨论：班级合影站在操场还是站在教学楼前？
= 我觉得站在教学楼前好，楼前有台阶，大家一排比一排高，每个人的脸都能拍到。
- 我觉得站在教学楼前好。 ~noreason
- 我觉得站在教学楼前好，因为我家就在教学楼那个方向。 ~weak

讨论：班里的绿植放在窗台还是放在讲台？
= 放在窗台好，那里阳光充足，植物长得好。
- 放在窗台好，因为窗台是白色的。 ~weak
- 放在窗台就行了。 ~noreason

讨论：联欢会的节目要不要提前彩排？
= 要彩排，这样能知道每个节目用多长时间，不会到时候超时。
- 要彩排，因为彩排这个词很好听。 ~weak
- 我觉得要彩排。 ~noreason

讨论：午休的时候能不能在教室里看课外书？
= 我觉得可以，只要不出声，就不会影响想睡觉的同学。
- 可以，因为课外书很贵。 ~weak
- 当然可以了。 ~noreason

讨论：值日表按学号排还是按座位排？
= 按座位排好，同一排的同学离得近，一起打扫时好商量。
- 按座位排好，因为座位是老师排的。 ~weak
- 我就觉得按座位排好。 ~noreason

讨论：班级小报每周出一期还是每月出一期？
= 每月出一期好，内容可以准备得更充实，大家也有时间画插图。
- 每月出一期好，因为一个月有三十天。 ~weak
- 还是每月出一期吧。 ~noreason

讨论：体育课上跑步要不要分组？
= 要分组，跑得快的和跑得慢的分开，每个人都能按自己的速度练。
- 要分组，因为分组听起来很热闹。 ~weak
- 我觉得要分组。 ~noreason

讨论：去敬老院要不要带自己做的礼物？
= 要带自己做的，老人们看重的是心意，自己做的礼物更能表达心意。
- 要带自己做的，因为做礼物用的胶水在我家。 ~weak
- 要带自己做的。 ~noreason

讨论：班会由班长主持，还是大家轮流主持？
= 我赞成轮流主持，每个同学都能练一练在大家面前说话。
- 我赞成轮流主持，因为班长今天穿了新衣服。 ~weak
- 轮流主持好。 ~noreason

讨论：放学后要不要留下来一起排练课本剧？
= 我觉得要留下来，课上时间不够，演一遍就下课了。
- 我觉得要留下来，因为学校门口的路正在修。 ~weak
- 要留下来排练。 ~noreason
`);

/** KEY_POINTS_5 are the scenes of speaking-5-key-points: what a talk mainly asks of its listeners. */
const KEY_POINTS_5 = parseRules(`
大队辅导员说：“同学们，下周三全校去科技馆参观。早上七点半在校门口集合，坐大巴去。科技馆很大，有很多有趣的展品，我上次去还玩了一个会说话的机器人。中午在科技馆吃饭，饭自己带。”
= 下周三去科技馆，七点半校门口集合，自己带午饭
- 辅导员上次在科技馆玩了会说话的机器人 ~trivial
- 下周三去科技馆，中午学校统一订饭 ~changed

班主任说：“下个星期一要交暑假作业。作业一共有三样：一本练习册，一篇日记，一份小报。小报的纸可以用白纸，也可以用彩色纸，我个人比较喜欢淡蓝色的纸。”
= 星期一交三样暑假作业：练习册、日记和小报
- 老师喜欢淡蓝色的纸 ~trivial
- 星期一交两样作业：练习册和小报 ~changed

图书管理员说：“图书室从下个月起，开放时间改为每天中午十二点到一点。这学期新买了三百本书，其中有不少是同学们推荐的。借书时一定要带借书证。”
= 下个月起图书室中午十二点到一点开放，借书要带借书证
- 图书室新书中有不少是同学们推荐的 ~trivial
- 下个月起图书室下午开放，借书不用带借书证 ~changed

体育老师说：“明天体育课测五十米跑。大家穿运动鞋，不要穿皮鞋。今天天气有点冷，我早上出门差点忘了带围巾。测试前要先做十分钟热身。”
= 明天测五十米跑，穿运动鞋，测前先热身
- 体育老师早上差点忘了带围巾 ~trivial
- 明天测八百米跑，测前不用热身 ~changed

社区的阿姨说：“小朋友们，这个周六上午九点，我们在社区活动中心有一次垃圾分类的讲座，讲完还有小游戏。活动中心的门口新种了一排桂花树，现在开得正香呢。来的时候请带一个空塑料瓶。”
= 周六上午九点在活动中心听垃圾分类讲座，带一个空塑料瓶
- 活动中心门口新种了一排桂花树 ~trivial
- 周日下午在活动中心听讲座，带一个纸盒 ~changed

音乐老师说：“合唱比赛定在下个月十号。我们班唱两首歌，一首是《歌唱祖国》，另一首大家投票选。比赛那天要穿白衬衫。对了，我小时候也参加过合唱队。”
= 下月十号合唱比赛，唱两首歌，另一首投票选，穿白衬衫
- 音乐老师小时候参加过合唱队 ~trivial
- 下月十号比赛，只唱一首歌，穿什么都行 ~changed

校医说：“最近流感比较多。大家要勤洗手，教室要常开窗通风。如果发烧了，要在家休息，告诉班主任。我们医务室的窗帘刚换成了绿色的。”
= 流感多，要勤洗手、常开窗，发烧了在家休息并告诉班主任
- 医务室的窗帘换成了绿色的 ~trivial
- 流感多，发烧了也要坚持来上课 ~changed

科学老师说：“下周科学课做种子发芽实验。每人带十粒绿豆和一个小盒子。实验要做一个星期，每天都要记录。绿豆是我最喜欢吃的豆子。”
= 下周做发芽实验，每人带十粒绿豆和一个小盒子，每天记录
- 绿豆是科学老师最喜欢吃的豆子 ~trivial
- 下周做实验，每人带五粒黄豆，只记录一次 ~changed

班长说：“明天下午第三节课大扫除，每人带一块抹布。男生擦窗户，女生扫地。我们班上次大扫除得了第二名，隔壁班是第一名。”
= 明天下午第三节大扫除，每人带抹布，男生擦窗、女生扫地
- 上次大扫除隔壁班是第一名 ~trivial
- 明天上午大扫除，不用带抹布 ~changed

妈妈说：“我明天要出差，后天晚上回来。你放学后去奶奶家吃饭，作业在奶奶家写。出差的地方听说很冷，我得多带件毛衣。”
= 妈妈出差后天晚上回来，放学后去奶奶家吃饭、写作业
- 出差的地方很冷，妈妈要多带件毛衣 ~trivial
- 妈妈明天晚上就回来，放学后自己在家吃饭 ~changed
`);

/** RELAYED_5 are the scenes of speaking-5-key-points: a message relayed briefly to the one it is for. */
const RELAYED_5 = parseRules(`
王老师对你说：“请你告诉李明，明天的数学竞赛改在下午两点，在三楼的会议室。”你去告诉李明。
= 李明，王老师说，明天的数学竞赛改到下午两点，在三楼会议室。
- 李明，请你告诉李明，明天的数学竞赛改在下午两点。 ~person
- 李明，王老师说明天有数学竞赛。 ~missing

邻居张阿姨对你说：“你妈妈回来跟她说一声，我借她的锅明天上午还给她。”你告诉妈妈。
= 妈妈，张阿姨说，借您的锅明天上午还给您。
- 妈妈，张阿姨说，我借她的锅明天上午还给她。 ~person
- 妈妈，张阿姨今天在楼下跟我说话，她穿了一件红衣服，说了好多话，好像跟锅有关系…… ~rambling

体育老师对你说：“告诉你们班同学，明天体育课在体育馆上，不在操场，大家穿运动鞋。”你告诉同学。
= 同学们，体育老师说，明天的体育课在体育馆上，大家穿运动鞋。
- 同学们，告诉你们班同学，明天体育课在体育馆上。 ~person
- 同学们，明天体育课在操场上。 ~changed

爷爷对你说：“你爸爸回来，告诉他，我的药快吃完了，让他下班顺路买两盒。”你告诉爸爸。
= 爸爸，爷爷说他的药快吃完了，请您下班顺路买两盒。
- 爸爸，爷爷说我的药快吃完了，让他下班买。 ~person
- 爸爸，爷爷今天说了很多话，他说天气冷了，膝盖有点疼，还说起了以前的事，对了好像还说了药…… ~rambling

图书管理员对你说：“告诉你们老师，你们班借的二十本书下周五以前要还。”你告诉老师。
= 老师，图书管理员说，我们班借的二十本书下周五以前要还。
- 老师，告诉你们老师，你们班借的书要还。 ~person
- 老师，图书管理员说书什么时候还都行。 ~changed

同学小红对你说：“你见到小芳，告诉她，我把她的跳绳放在她的抽屉里了。”你告诉小芳。
= 小芳，小红说，她把你的跳绳放在你的抽屉里了。
- 小芳，小红说，我把她的跳绳放在她的抽屉里了。 ~person
- 小芳，小红说她把你的跳绳拿走了。 ~changed

校门口的保安叔叔对你说：“告诉你们班主任，下午有人来修学校的大门，放学走侧门。”你告诉班主任。
= 老师，保安叔叔说，下午有人来修大门，放学要走侧门。
- 老师，告诉你们班主任，下午走侧门。 ~person
- 老师，保安叔叔说，下午学校大门照常开。 ~changed

外婆在电话里对你说：“跟你妈妈说，我周日中午到，不用来车站接我，我自己坐车过来。”你告诉妈妈。
= 妈妈，外婆说她周日中午到，不用去车站接她，她自己坐车来。
- 妈妈，外婆说我周日中午到，不用来接我。 ~person
- 妈妈，外婆说周日中午到，让您去车站接她。 ~opposite

班长对你说：“你告诉第三组的同学，明天的手抄报要交给我，不是交给学习委员。”你告诉第三组的同学。
= 第三组的同学，班长说，明天的手抄报交给他，不交给学习委员。
- 第三组的同学，明天的手抄报要交给我，不是交给学习委员。 ~person
- 第三组的同学，班长说明天手抄报交给学习委员。 ~opposite

医生对你说：“告诉你爸爸，你奶奶的药一天吃两次，饭后吃，一次一片。”你告诉爸爸。
= 爸爸，医生说奶奶的药一天吃两次，饭后吃，一次一片。
- 爸爸，告诉你爸爸，你奶奶的药一天吃两次。 ~person
- 爸爸，医生说奶奶的药一天吃三次，饭前吃。 ~changed
`);

/** TONE_5 are the scenes of speaking-5-tone: the tone and wording that fit the moment. */
const TONE_5 = parseRules(`
同桌这次考试没考好，趴在桌子上难过。你想安慰他。
= 别难过，这次没考好，我们一起把错题弄懂，下次一定能考好。
- 哈哈，你这次怎么考得这么差呀！ ~harsh
- 没考好就没考好呗，有什么大不了的。 ~tone

你在公交车上不小心踩了一位阿姨的脚。
= 阿姨，真对不起，踩疼您了吧？
- 车晃了一下，又不是我故意的。 ~blame
- 哦，踩到你了。 ~tone

你想请老师给你讲一道不会做的题。
= 老师，这道题我想了很久还是不会，您能给我讲一讲吗？
- 老师，你快给我讲讲这道题！ ~tone
- 这题出得这么难，谁会做啊！ ~harsh

奶奶给你织了一条围巾，颜色你不太喜欢，但这是奶奶的一片心意。
= 谢谢奶奶！您织得真细，戴上一定很暖和。
- 这个颜色好难看，我不想戴。 ~harsh
- 嗯，放那儿吧。 ~tone

你在班会上向大家介绍新转来的同学。
= 同学们，这是新来的同学刘洋，他喜欢下棋，以后大家多帮助他，欢迎他！
- 喂，这个人是新来的，你们自己认识吧。 ~tone
- 他是新来的，什么都不知道，大家别理他。 ~harsh

弟弟把你的模型弄坏了，正吓得要哭。
= 别怕，模型坏了还能修，下次拿之前先问问我，好吗？
- 你怎么什么都弄坏！以后别碰我的东西！ ~harsh
- 坏了，你说怎么办吧。 ~tone

你代表班级在升旗仪式上讲话，讲到要爱护校园。
= 校园是我们共同的家，让我们一起爱护它的一草一木。
- 你们谁再乱扔垃圾，我就告诉老师！ ~harsh
- 嗯……那个，大家就……别扔垃圾吧，好像也没什么了。 ~tone

你打电话给同学，祝贺他在比赛中得了奖。
= 祝贺你！你练了那么久，这个奖真是你应得的！
- 你得奖啦？运气真好。 ~tone
- 不就是一个奖嘛，我也能得。 ~harsh

一位叔叔问你去火车站怎么走，你知道路。
= 叔叔，您往前走到第二个路口，再往右拐，走五分钟就到了。
- 这都不知道，往那边走！ ~harsh
- 那边。 ~tone

你朗读课文中写妈妈深夜照顾生病孩子的那一段。
= 读得慢一些、轻一些，把妈妈的担心和疼爱读出来。
- 读得又快又响，像喊口号一样。 ~tone
- 用开玩笑的口气，读得越好笑越好。 ~tone
`);

/** STRESS_5 are the scenes of speaking-5-tone: the word that carries the stress, marked 【】, for what is asked. */
const STRESS_5 = parseRules(`
同学问：“明天谁去参加演讲比赛？”你回答。
= 【我】明天去参加演讲比赛。
- 我【明天】去参加演讲比赛。 ~stress
- 我明天去参加【演讲比赛】。 ~stress

妈妈问：“你什么时候去图书馆？”你回答。
= 我【星期六上午】去图书馆。
- 【我】星期六上午去图书馆。 ~stress
- 我星期六上午去【图书馆】。 ~stress

老师问：“你借的是哪一本书？”你回答。
= 我借的是【《西游记》】。
- 【我】借的是《西游记》。 ~stress
- 我【借】的是《西游记》。 ~stress

爸爸问：“你们班去哪里春游？”你回答。
= 我们班去【植物园】春游。
- 【我们班】去植物园春游。 ~stress
- 我们班去植物园【春游】。 ~stress

同学问：“这道题你是怎么算出来的？”你回答。
= 我是【画了线段图】算出来的。
- 【我】是画了线段图算出来的。 ~stress
- 我是画了线段图【算】出来的。 ~stress

奶奶问：“你的书包是谁买的？”你回答。
= 我的书包是【姑姑】买的。
- 我的【书包】是姑姑买的。 ~stress
- 我的书包是姑姑【买】的。 ~stress

同学问：“你养的小狗叫什么名字？”你回答。
= 我的小狗叫【豆豆】。
- 【我】的小狗叫豆豆。 ~stress
- 我的【小狗】叫豆豆。 ~stress

老师问：“你们组一共收集了多少个塑料瓶？”你回答。
= 我们组一共收集了【五十六个】塑料瓶。
- 【我们组】一共收集了五十六个塑料瓶。 ~stress
- 我们组一共收集了五十六个【塑料瓶】。 ~stress

同学问：“你是坐车来的还是走路来的？”你回答。
= 我是【走路】来的。
- 【我】是走路来的。 ~stress
- 我是走路【来】的。 ~stress

妈妈问：“蛋糕放在哪里了？”你回答。
= 蛋糕放在【冰箱里】了。
- 【蛋糕】放在冰箱里了。 ~stress
- 蛋糕放在冰箱里【了】。 ~stress
`);

/** CIVIL_5 are the scenes of speaking-5-civil-language: civil words when one disagrees, asks or is annoyed. */
const CIVIL_5 = parseRules(`
讨论时，同学的想法你不同意。
= 我有一点不同的想法，说出来大家听听，好吗？
- 你说的根本不对，真笨！ ~attack
- 别说了，听我的就行。 ~rude

排队打饭时，有人插到了你前面。
= 同学，请到后面排队好吗？大家都在等。
- 你插什么队！没长眼睛吗？ ~attack
- 喂，滚到后面去！ ~rude

同学借了你的书，过了很久还没还。
= 那本书你看完了吗？看完了能还给我吗？我也想再看一遍。
- 你这个人怎么借东西不还！ ~attack
- 快把书还我！ ~rude

楼上的邻居晚上很晚还在敲敲打打，你和妈妈去说。
= 叔叔，打扰了，孩子明天要早起上学，晚上能不能小声一点？
- 你们家天天这么吵，烦死了！ ~harsh
- 你们有没有一点公德心？ ~attack

比赛输了，对方班的同学在欢呼。
= 祝贺你们，你们打得真好！下次我们再比一场。
- 赢了有什么了不起的，还不是运气好。 ~harsh
- 吵什么吵！ ~rude

上课时，同桌一直在跟你说话，你想听讲。
= 我们下课再说吧，现在先听老师讲。
- 你烦不烦啊！ ~harsh
- 闭嘴！ ~rude

你在网上的班级群里，看到同学发了一张拍得很模糊的照片。
= 照片有点看不清，能再发一张清楚一点的吗？
- 拍得这么烂，还好意思发！ ~attack
- 什么破照片。 ~rude

同学做值日时扫得不干净，你是值日组长。
= 这边还有一点纸屑，我们一起再扫一遍吧。
- 你扫的这叫什么！ ~harsh
- 你怎么什么都做不好！ ~attack

你在图书馆，旁边的人一直在打电话。
= 您好，这里是阅览室，打电话能到外面去吗？谢谢。
- 打什么电话，没看见大家在看书吗！ ~harsh
- 你这个人真没素质。 ~attack

同学在讨论时说错了一个数字。
= 我记得那个数是三十六，不是六十三，我们再查一下好吗？
- 这都能说错，你上课在干什么！ ~attack
- 错了错了，你别说了。 ~rude
`);

/** DIFFER_5 are the scenes of speaking-5-civil-language: words suited to who one is speaking to. */
const DIFFER_5 = parseRules(`
你要向校长汇报班级的读书活动。
= 校长您好，我向您汇报一下我们班这个月的读书活动。
- 喂，校长，跟你说个事。 ~address
- 老头，我们班读书活动搞完了。 ~rude

你在路上向一位老爷爷问路。
= 爷爷，您好，请问去邮局怎么走？
- 哎，邮局在哪儿？ ~address
- 老头，邮局怎么走？ ~rude

你给三岁的小表妹讲为什么要洗手。
= 小手上有看不见的小虫子，洗一洗，它们就跑掉了，就不会肚子疼啦。
- 手上有细菌，细菌会通过口腔进入消化系统，引起疾病。 ~unfit
- 不洗手你就会生病，快去洗！ ~harsh

你给班里的同学介绍一本书。
= 同学们，我给大家推荐一本好书，它讲的是一个男孩在荒岛上生活的故事。
- 尊敬的各位领导，今天我隆重地向您们推荐一本书。 ~unfit
- 这本书你们爱看不看。 ~rude

你接待来学校参观的外国小朋友，他会说一点中文。
= 欢迎你！这是我们的图书室，你喜欢看书吗？
- 我们学校的图书室藏书一万余册，分为文学、科技、艺术等类别。 ~unfit
- 你中文太差了，我说你也听不懂。 ~harsh

你在医院里，想问护士阿姨看病要去哪个窗口挂号。
= 阿姨您好，请问挂号在哪个窗口？
- 喂，在哪儿挂号？ ~address
- 你们这医院真难找，挂号在哪？ ~harsh

在班会上，你给全班同学说明这周值日怎样安排。
= 这周的值日，第一组星期一，第二组星期二，依次往下排，大家记一下。
- 那个，值日嘛，就是要打扫，打扫完了，嗯，就好了。 ~unclear
- 你们自己看着办吧，我不管了。 ~rude

你在电话里向同学的妈妈说明你想找同学一起做作业。
= 阿姨您好，我是小明的同学王华，想请小明下午来我家一起做作业，可以吗？
- 小明在吗？让他下午过来。 ~noname
- 喂，叫小明接电话！ ~rude

在家里，你想请爸爸周末陪你去买书。
= 爸爸，周末您有空吗？我想请您陪我去书店买几本书。
- 周末带我去买书，就这样定了。 ~tone
- 你周末又没事，必须陪我去！ ~harsh

你在少先队活动中向一年级的小同学讲红领巾怎么系。
= 先把两头这样交叉，再把这一头从下面绕上来，拉一拉，就系好了，你来试试。
- 按照规范，红领巾的系法共分为五个步骤，请认真记忆。 ~unfit
- 这么简单都不会，笨死了。 ~harsh
`);

/** POINT_6 are the scenes of speaking-6-short-speech: a brief prepared remark that comes to its point. */
const POINT_6 = parseRules(`
班会上，你有一分钟时间说说对“课间安全”的看法。
= 我想说一说课间安全。上星期我们班有同学在走廊奔跑摔倒了。我建议大家课间在走廊靠右慢行，下楼不推挤。
- 上星期那个同学是从三楼往下跑的，他穿的是一双白色的鞋，摔了以后膝盖流了好多血，校医来了以后…… ~noopening
- 课间安全很重要，安全就是很重要，我们一定要注意安全，安全真的很重要，所以大家要注意…… ~rambling

你在小组里发言，说说你为什么推荐《鲁滨孙漂流记》。
= 我推荐《鲁滨孙漂流记》，因为它告诉我们，遇到困难不要绝望，要动手想办法。鲁滨孙一个人在荒岛上，自己盖房、种麦，活了二十八年。
- 鲁滨孙第一天在岛上搬了很多东西，第二天又搬了一些，第三天他发现了一个山洞…… ~noopening
- 这本书挺好的，挺好看的，我觉得大家都会喜欢，反正挺好的，你们去看吧。 ~rambling

学校请你在开学典礼上代表六年级说几句话。
= 老师们、同学们，这是我们在小学的最后一年。我们六年级要给弟弟妹妹做好榜样，也要珍惜最后一年的时光，好好学习。
- 暑假里我去了海边，那里的沙子很软，我还捡了很多贝壳…… ~noopening
- 我想说的就是，嗯，最后一年了，要怎么样呢，就是要，那个，好好的，然后，还有…… ~rambling

你要在班里竞选图书管理员，有一分钟发言时间。
= 我想当图书管理员。我爱读书，也细心，我打算每周整理一次图书角，做好借还记录，让每本书都能找到。
- 我们家的书架有五层，第一层放的是我小时候的绘本，第二层是…… ~noopening
- 我觉得我可以当，因为我觉得我可以，我会做好的，我一定会努力，请大家选我，因为我觉得我可以…… ~rambling

科学课上，你用一分钟介绍你们组的实验结果。
= 我们组发现，放在阳光下的绿豆比放在柜子里的发芽快。阳光下的第二天就发芽了，柜子里的第四天才发芽。
- 我们组有五个人，组长是李华，我负责记录，王明负责浇水，我们的盒子是从家里带的…… ~noopening
- 我们组的实验做得很好，大家都很认真，结果也很好，就是发芽了，有的快有的慢，挺有意思的。 ~rambling

你在家长会上代表学生说几句感谢老师的话。
= 各位家长好，我想代表同学们感谢我们的老师。张老师每天很早就到学校，放学后还留下来给同学们讲题。谢谢老师！
- 今天早上我起得很早，吃了妈妈做的面条，然后坐公交车来到学校…… ~noopening
- 老师很好，真的很好，非常好，特别特别好，我们都觉得老师很好…… ~rambling

讨论环保时，老师请你说说怎样少用塑料袋。
= 我觉得少用塑料袋，可以从买菜做起：出门带一个布袋子，一年就能少用好几百个塑料袋。
- 我家楼下有一个菜市场，那里早上六点就开门了，卖菜的人很多…… ~noopening
- 塑料袋嘛，用得太多了，我们要少用，少用就好了，不用也行，能少就少…… ~rambling

运动会前，你作为体育委员给全班同学鼓劲。
= 同学们，后天就是运动会了！我们练了两个星期，只要大家团结一心，就一定能赛出好成绩。加油！
- 我们去年运动会是第五名，前年是第四名，大前年我不知道…… ~noopening
- 运动会就是要运动，运动很好，我们要好好运动，大家一起运动…… ~rambling

你在班会上提议设立“班级失物箱”。
= 我提议在教室后面放一个失物箱。最近常有同学丢东西，有了失物箱，捡到的东西放进去，丢了东西的同学去找就行了。
- 上星期我的橡皮丢了，是一块蓝色的橡皮，上面有一只小熊…… ~noopening
- 东西丢了很麻烦，大家都会着急，着急也没用，丢了就是丢了，所以…… ~rambling

你在毕业前的班会上，说说你最想对同学们说的话。
= 六年的时间过得真快。我最想说的是谢谢大家，谢谢你们在我摔倒时扶我，在我难过时陪我。希望我们以后还是好朋友。
- 一年级的时候，我们的教室在一楼，二年级搬到了二楼，三年级又搬到…… ~noopening
- 我想说的话很多很多，太多了，不知道说什么好，反正就是很多…… ~rambling
`);

/** FIT_6 are the scenes of speaking-6-short-speech: remarks that suit the occasion and the listeners. */
const FIT_6 = parseRules(`
在一年级新生的入学欢迎会上，你代表大哥哥大姐姐说几句话。
= 小弟弟小妹妹们，欢迎你们来到学校！这里有好多好玩的书，有什么不会的，就来找我们。
- 欢迎各位新生。希望你们端正学习态度，严格遵守校规校纪。 ~unfit
- 小学可难了，作业特别多，你们就等着哭吧。 ~harsh

在敬老院的联欢会上，你代表同学们说开场的话。
= 爷爷奶奶们好！今天我们来看望你们，给你们表演几个节目，祝爷爷奶奶们身体健康！
- 各位观众，下面开始比赛，请评委打分。 ~unfit
- 你们年纪大了，耳朵不好，我就大声说了啊。 ~harsh

同学过生日，大家请你说几句祝福的话。
= 祝你生日快乐！希望你新的一岁天天开心，也希望我们一直是好朋友。
- 下面我来总结一下本学期的学习情况。 ~unfit
- 又老了一岁啦。 ~tone

在全校的升旗仪式上，你作国旗下的讲话。
= 老师们、同学们，今天我讲话的题目是“节约粮食”。我们每人每天少剩一口饭，全校一年就能省下许多粮食。
- 嘿，大家好，我今天随便聊两句。 ~tone
- 今天我想讲我家小狗的故事，它特别好玩。 ~unfit

在班级的告别会上，一位同学要转学了，你代表大家说几句。
= 小林，你要去新的学校了，我们都舍不得你。希望你在那里交到新朋友，也别忘了我们。
- 走了就走了吧，反正以后也见不到了。 ~harsh
- 祝贺你，终于可以离开我们班了！ ~tone

学校的读书节闭幕式上，你代表获奖同学发言。
= 谢谢老师和同学们！这个奖是对我的鼓励，以后我会读更多的好书，也欢迎大家和我一起读。
- 我早就知道我会得奖，别人都不如我。 ~harsh
- 下面我给大家讲讲怎样包饺子。 ~unfit

你在社区的“小小讲解员”活动中，给来参观的居民介绍社区的历史。
= 叔叔阿姨们好！我们社区建于三十年前，那时候这里还是一片菜地，现在有了公园和图书室。
- 同学们，今天的作业是写一篇日记。 ~unfit
- 这些你们肯定都不知道吧，我来教教你们。 ~tone

在医院里探望生病的同学，你代表全班说几句话。
= 大家都很想你，你好好养病，落下的课我们帮你补，等你回来！
- 今天我们来开一个班会，讨论一下下学期的计划。 ~unfit
- 你怎么这么不小心，又生病了。 ~harsh

老师请你在家长会开始时，向家长们说几句欢迎的话。
= 各位叔叔阿姨好！欢迎你们来参加家长会，下面请大家看看我们这学期的作品。
- 小朋友们，欢迎来到动物园！ ~unfit
- 你们来晚了，快坐下。 ~rude

学校请你在植树节活动开始时，给参加的同学说几句话。
= 同学们，今天我们每个人种下一棵小树，就是给校园添一份绿色。让我们一起动手吧！
- 尊敬的各位来宾，欢迎出席本次学术会议。 ~unfit
- 种树很累的，大家随便种种就行了。 ~tone
`);

/** STRUCTURE_6 are the scenes of speaking-6-presenting: the opening, order and ending of a talk on a topic. */
const STRUCTURE_6 = parseRules(`
你要在班上做一个关于“大熊猫”的专题演讲，怎样开头？
= 同学们，你们知道大熊猫每天要吃多少竹子吗？今天我就来给大家讲一讲大熊猫。
- 大熊猫的第一个特点是……第二个特点是……第三个特点是…… ~noopening
- 我也不知道该讲什么，就讲讲大熊猫吧，其实我也不太了解。 ~tone

你的演讲题目是“我们身边的垃圾分类”，要讲四个部分，怎样排？
= 先讲为什么要分类，再讲分成哪几类，然后讲我们学校怎样做，最后提出建议。
- 先提出建议，再讲为什么，然后讲分成哪几类，最后讲为什么要分类。 ~order
- 哪部分想起来就先讲哪部分，不用排。 ~order

你讲“家乡的春节”，讲完了习俗，怎样结尾？
= 这就是我家乡的春节，热闹、温暖，充满了人情味。欢迎大家春节到我的家乡来做客！
- 讲完最后一个习俗，直接走下台。 ~noend
- 还有很多习俗，下次再说吧，我忘了。 ~noend

你演讲“长江”，要说明长江有多长，怎样说更清楚？
= 长江全长约六千三百千米，是我国第一长河，从西向东流进东海。
- 长江很长很长很长，长得不得了。 ~unclear
- 长江大概有好多好多千米吧，我记不清了。 ~unclear

你的演讲题目是“节约用水”，怎样开头才能一下子说清要讲什么？
= 今天我要讲的是节约用水：为什么要节约、我们能怎样节约。
- 昨天我洗澡洗了半个小时，水很热，很舒服…… ~noopening
- 嗯……大家好……那个……我想想…… ~noopening

你介绍“我国的四大发明”，怎样安排顺序？
= 按一种顺序一件一件讲：造纸术、印刷术、火药、指南针，每件讲它是什么、有什么用。
- 先讲一点指南针，再讲一点造纸，又回过头讲指南针。 ~order
- 只讲指南针，其他的不讲了。 ~onepart

你演讲“我心中的英雄”，讲了三个事例，怎样结尾？
= 这三位英雄，有的保卫祖国，有的救人于危难，他们都让我明白：英雄就在平凡人中间。
- 第三个事例讲完就说“谢谢大家”，前面讲的什么都不回顾。 ~noend
- 还有第四个、第五个事例，我就不讲了，反正大家都知道。 ~noend

你做“校园里的植物”专题介绍，怎样排顺序更清楚？
= 按校园里的位置走一遍：从校门口的银杏讲起，再到操场边的柳树，最后是花坛里的月季。
- 想到哪棵讲哪棵，一会儿门口，一会儿操场，一会儿又回到门口。 ~order
- 只讲自己最喜欢的一棵，其他的都不讲。 ~onepart

你演讲“网络的好处和坏处”，怎样安排？
= 先讲好处，再讲坏处，最后说怎样用网络才能趋利避害。
- 好处坏处混在一起讲，讲到哪算哪。 ~order
- 只讲坏处，好处一句也不提。 ~onepart

你演讲“我的读书故事”，时间只有三分钟，怎样结尾？
= 读书让我认识了更大的世界。希望大家也能找到一本让自己放不下的好书。谢谢大家！
- 三分钟到了，话还没讲完就停了下来。 ~noend
- 好了，就这些，没了。 ~noend
`);

/** ENGAGE_6 are the scenes of speaking-6-presenting: ways of holding the listeners. */
const ENGAGE_6 = parseRules(`
你演讲“蜜蜂”，想让同学们一开始就有兴趣。
= 同学们，一只小蜜蜂一生只能酿一小勺蜂蜜，你们相信吗？
- 蜜蜂是一种昆虫，下面我介绍蜜蜂。 ~dull
- 我今天要讲的东西你们肯定不感兴趣，不过我还是要讲。 ~tone

你讲“节约粮食”，想让同学们印象深刻。
= 我们学校每天倒掉的剩饭，能装满五个大桶。这些粮食，够一百个人吃一顿饭。
- 我们要节约粮食，节约粮食很重要，大家要记住。 ~dull
- 农民伯伯种粮食的方法很复杂，有十几个步骤，我一个一个说…… ~rambling

你讲“地球上的水”，想让同学们一起想一想。
= 大家猜一猜，地球上能直接喝的淡水，占所有水的多少？
- 地球上有很多水，有海水，有淡水，就这样。 ~dull
- 这个问题太难了，你们肯定答不出来。 ~tone

你讲“我的家乡”，想让听的人好像看见了一样。
= 走进我的家乡，第一眼看到的是满山的茶树，空气里都是茶叶的香味。
- 我的家乡很美，有山有水，很不错。 ~dull
- 我的家乡在东经多少度、北纬多少度，面积是多少平方千米…… ~unfit

你给低年级同学讲“交通安全”。
= 小朋友们，你们知道红灯亮了，为什么一定要停下来吗？我们一起来做个小游戏。
- 根据《道路交通安全法》第几条规定…… ~unfit
- 交通安全很重要，你们要注意交通安全。 ~dull

你讲“古诗里的春天”，想让大家有画面感。
= 闭上眼睛想一想：“春眠不觉晓，处处闻啼鸟。”是不是好像听到了窗外的鸟叫声？
- 古诗里有很多写春天的，比如有一首，还有一首，还有好多首。 ~dull
- 古诗都很难懂，大家听不懂也没关系。 ~tone

你讲“我们班的运动会”，想让大家笑一笑又记住。
= 接力跑最后一棒时，小张的鞋飞了出去，他光着一只脚冲过了终点，全场都为他鼓掌！
- 运动会开了两天，我们班得了一些名次。 ~dull
- 小张跑步真笨，鞋都跑掉了，大家一起笑他吧。 ~harsh

你讲“恐龙”，手里有一张图。
= 请大家看这张图：这只恐龙有三层楼那么高，它的一个脚印里能躺下一个小朋友。
- 拿着图一直低头念稿子，不看大家。 ~dull
- 图就不给大家看了，你们自己想象吧。 ~dull

你讲“保护眼睛”，想让同学们跟着做。
= 现在请大家和我一起做：看看窗外远处的绿树，数十下，让眼睛休息一下。
- 保护眼睛有几种方法，第一，第二，第三，我念完了。 ~dull
- 你们都不爱护眼睛，所以才戴眼镜。 ~harsh

你讲“中国的桥”，讲到赵州桥。
= 一千四百多年前造的赵州桥，经历了多次洪水和地震，到今天还立在河上。古人是怎么做到的呢？
- 赵州桥是一座桥，在河北。 ~dull
- 赵州桥的每一块石头长多少、宽多少、重多少，我给大家一一念一遍…… ~rambling
`);

/** QUESTIONS_6 are the scenes of speaking-6-interview: questions that draw out what one wants to know. */
const QUESTIONS_6 = parseRules(`
你采访学校的门卫叔叔，想了解他的工作。
= 叔叔，您每天的工作是从几点开始的？都要做哪些事？
- 叔叔，您的工作累吗？ ~closed
- 叔叔，您喜欢吃什么水果？ ~off

你采访一位老教师，想知道她三十年来教书的变化。
= 老师，您刚开始教书的时候，教室和现在有什么不一样？
- 老师，您教了三十年书吗？ ~closed
- 老师，您家住在哪里？ ~off

你采访获得作文比赛一等奖的同学，想知道她怎样写好作文。
= 你平时是怎样积累写作材料的？
- 你得了一等奖，高兴吗？ ~closed
- 你家养宠物了吗？ ~off

你采访社区的清洁工阿姨，想了解她的辛苦。
= 阿姨，您每天几点起床开始扫地？冬天最难的是什么？
- 阿姨，扫地辛苦吗？ ~closed
- 阿姨，您看过最近那部电影吗？ ~off

你为班级小报采访校长，想了解学校新图书馆的计划。
= 校长，新图书馆什么时候建好？里面会有哪些新的东西？
- 校长，学校要建新图书馆吗？ ~closed
- 校长，您小时候喜欢玩什么游戏？ ~off

你采访爷爷，想了解他小时候是怎样上学的。
= 爷爷，您小时候每天怎样去上学？学校里都学些什么？
- 爷爷，您小时候上过学吗？ ~closed
- 爷爷，您现在每天几点睡觉？ ~off

你采访体育老师，想知道怎样提高跳绳成绩。
= 老师，想让跳绳跳得又快又多，平时应该怎样练？
- 老师，跳绳难吗？ ~closed
- 老师，您最喜欢什么颜色？ ~off

你采访一位医生，想知道怎样预防感冒。
= 医生，冬天我们小学生应该怎样做，才能少感冒？
- 医生，感冒会传染吗？ ~closed
- 医生，您的医院有几层楼？ ~off

你采访学校食堂的厨师，想了解大家的午饭是怎样做出来的。
= 叔叔，每天的午饭从几点开始准备？要经过哪些步骤？
- 叔叔，做饭累吗？ ~closed
- 叔叔，您会开车吗？ ~off

你采访一位志愿者，想知道她为什么愿意做志愿服务。
= 阿姨，您是怎么开始做志愿者的？是什么让您一直坚持下来？
- 阿姨，您是志愿者吗？ ~closed
- 阿姨，您的衣服是在哪里买的？ ~off
`);

/** FOLLOW_6 are the scenes of speaking-6-interview: the follow-up question that builds on what was just answered. */
const FOLLOW_6 = parseRules(`
你问门卫叔叔每天几点上班，他说：“我早上五点半就到了，先把校门口打扫干净。”
= 五点半天还没亮，您为什么要这么早来打扫呢？
- 叔叔，您每天几点上班？ ~said
- 叔叔，您喜欢看足球吗？ ~offtopic

你问老教师刚教书时的教室，她说：“那时候教室里没有电灯，冬天我们要自己生炉子。”
= 没有电灯，阴天的时候你们怎么看书写字呢？
- 老师，那时候教室有电灯吗？ ~said
- 老师，您喜欢养花吗？ ~offtopic

你问作文得奖的同学怎样积累材料，她说：“我每天写三句话的日记，记下当天最有意思的事。”
= 每天只写三句，有没有哪一天觉得没什么可写？那时你怎么办？
- 你平时写日记吗？ ~said
- 你最喜欢上什么课？ ~offtopic

你问清洁工阿姨冬天最难的是什么，她说：“下雪天最难，雪要赶在大家上班前扫完。”
= 下雪的那天，您几点就要出门？要扫多长时间？
- 阿姨，冬天下雪吗？ ~said
- 阿姨，您家有几口人？ ~offtopic

你问爷爷小时候怎样上学，他说：“我每天走十几里山路，路上还要过一条河。”
= 过河的时候有桥吗？下大雨河水涨了，您还能去上学吗？
- 爷爷，您小时候走路上学吗？ ~said
- 爷爷，您喜欢吃面条吗？ ~offtopic

你问体育老师怎样练跳绳，他说：“先练手腕，绳子要靠手腕甩，不是靠胳膊。”
= 手腕要怎样练呢？有没有不用绳子也能练的办法？
- 老师，跳绳要用手腕吗？ ~said
- 老师，您跑步快吗？ ~offtopic

你问医生怎样预防感冒，她说：“最重要的是勤洗手，很多病是从手上带进嘴里的。”
= 那什么时候一定要洗手？洗多长时间才算洗干净？
- 医生，预防感冒要洗手吗？ ~said
- 医生，您的工作累吗？ ~offtopic

你问厨师午饭从几点开始准备，他说：“早上六点就开始洗菜，光土豆就要削一百多斤。”
= 一百多斤土豆，要几个人削？要削多久？
- 叔叔，你们早上几点开始准备？ ~said
- 叔叔，您会做蛋糕吗？ ~offtopic

你问志愿者阿姨为什么坚持做志愿服务，她说：“有一次我帮一位迷路的老人找到了家，他的女儿哭着谢谢我。”
= 那一刻您心里是怎么想的？从那以后您的想法有什么变化？
- 阿姨，您帮过迷路的老人吗？ ~said
- 阿姨，您平时喜欢运动吗？ ~offtopic

你问校长新图书馆有什么新东西，他说：“我们会建一个可以自己借还书的机器。”
= 这台机器怎么用？同学们要先学一学吗？
- 校长，新图书馆有新东西吗？ ~said
- 校长，您每天几点到学校？ ~offtopic
`);

/** GRASP_6 are the scenes of speaking-6-responding: the other's view, said back rightly before one answers it. */
const GRASP_6 = parseRules(`
同学说：“我觉得作业不是越多越好，做完了要弄懂才有用。”你先复述他的意思。
= 你的意思是，作业重要的是弄懂，不是做得多。
- 你的意思是，不用做作业。 ~misgrasp
- 你的意思是，作业越多越好。 ~misgrasp

同学说：“手机可以用来查资料，但不能一直玩游戏。”你先复述他的意思。
= 你是说，手机可以用，但要用在有用的地方。
- 你是说，小学生不能用手机。 ~misgrasp
- 你是说，手机就是用来玩游戏的。 ~misgrasp

同学说：“我同意养宠物，不过一定要每天照顾它，不能只是觉得好玩。”你先复述她的意思。
= 你同意养宠物，但前提是能每天照顾它。
- 你不同意养宠物。 ~misgrasp
- 你觉得养宠物就是为了好玩。 ~misgrasp

同学说：“看电视不全是坏事，有些节目能让我们长知识。”你先复述他的意思。
= 你的意思是，看电视有好有坏，要看什么节目。
- 你的意思是，看电视全是好事，看多久都行。 ~misgrasp
- 你的意思是，看电视全是坏事。 ~misgrasp

同学说：“我觉得班干部应该轮流当，这样每个人都有机会锻炼。”你先复述她的意思。
= 你是说，轮流当班干部，能让每个人都得到锻炼。
- 你是说，现在的班干部当得不好。 ~misgrasp
- 你是说，不要班干部了。 ~misgrasp

同学说：“读书不一定要读很多，读一本就要读懂一本。”你先复述他的意思。
= 你的意思是，读书重要的是读懂，而不是读得多。
- 你的意思是，读书没有用。 ~misgrasp
- 你的意思是，一年只能读一本书。 ~misgrasp

同学说：“我不反对去远的地方春游，只是担心路上时间太长，玩的时间就少了。”你先复述她的意思。
= 你不是反对去远的地方，是担心路上花的时间太多。
- 你反对去远的地方春游。 ~misgrasp
- 你觉得春游没意思。 ~misgrasp

同学说：“零花钱可以有，但要自己记账，知道钱花在了哪里。”你先复述他的意思。
= 你是说，可以有零花钱，但要记账，心里有数。
- 你是说，小学生不应该有零花钱。 ~misgrasp
- 你是说，零花钱想怎么花就怎么花。 ~misgrasp

同学说：“比赛输了不要紧，重要的是看看哪里没做好。”你先复述她的意思。
= 你的意思是，输了以后要找到自己的不足。
- 你的意思是，比赛输赢都无所谓，不用努力。 ~misgrasp
- 你的意思是，我们这次输了都怪别人。 ~misgrasp

同学说：“我觉得周末应该先写作业再玩，这样玩得更放心。”你先复述他的意思。
= 你是说，周末先把作业写完，再玩就不用惦记了。
- 你是说，周末不能玩。 ~misgrasp
- 你是说，周末先玩再写作业。 ~misgrasp
`);

/** RESPOND_6 are the scenes of speaking-6-responding: an answer to the view, with a reason, not to the person. */
const RESPOND_6 = parseRules(`
同学说：“作业越多，成绩就越好。”你不同意。
= 我不太同意。作业太多，我们就没时间想清楚错在哪里；把一道题弄懂，比多做十道更有用。
- 你成绩那么差，还好意思说这个？ ~attack
- 我不同意，反正就是不对。 ~noreason

同学说：“课间就应该待在教室里，出去玩太危险。”你有不同看法。
= 安全确实重要，可是课间出去走走能让眼睛和身体休息一下，只要不追跑就不危险。
- 你就是胆小，什么都怕。 ~attack
- 你说的我不想听。 ~dismiss

同学说：“读漫画书没有用。”你不同意。
= 有些漫画书讲历史和科学，画得清楚，反而更容易看懂，所以不能说全都没用。
- 你懂什么漫画书！ ~attack
- 我就是爱看漫画，你管不着。 ~noreason

同学说：“春游去近的地方没意思。”你觉得近的也有好处。
= 近的地方路上花的时间少，我们能玩得更久，而且近处也有我们没仔细看过的好地方。
- 你每次都嫌这嫌那。 ~attack
- 随便你，反正我不同意。 ~dismiss

同学说：“养宠物太麻烦了，不应该养。”你不同意。
= 养宠物是要花时间，可它能让我们学会负责任。只要家里人商量好谁来照顾，就不麻烦。
- 你自己懒，才觉得麻烦。 ~attack
- 我觉得应该养，就这样。 ~noreason

同学说：“班干部应该一直由成绩最好的同学来当。”你有不同看法。
= 成绩好的同学当然可以当，但当班干部还要会关心同学、会组织活动，这些和成绩不完全一样。
- 你就是想自己一直当。 ~attack
- 我不同意你的看法，不讨论了。 ~dismiss

同学说：“比赛输了，都怪裁判。”你不同意。
= 裁判也许有判得不准的地方，可我们自己有好几次传球失误，也是输的原因。
- 你输不起。 ~attack
- 怪谁都一样，不说了。 ~dismiss

同学说：“看电视会让人变笨。”你不完全同意。
= 一直看确实不好，可是看一些科普节目能学到很多书上没有的东西，关键是看什么、看多久。
- 你家天天看电视，你也没变笨啊，哈哈。 ~attack
- 我不同意。 ~noreason

同学说：“小学生不需要学做饭。”你不同意。
= 学做饭能让我们照顾自己，还能体会家长的辛苦。做个简单的蛋炒饭，也不会耽误学习。
- 你连鸡蛋都不会打吧？ ~attack
- 你想法太奇怪了，不跟你说。 ~dismiss

同学说：“节约用水是大人的事。”你不同意。
= 我们每天洗手、刷牙都要用水，随手关好水龙头，一年也能省下不少水，所以小学生也能做到。
- 你就是不想节约。 ~attack
- 是不是大人的事，我不想跟你争。 ~dismiss
`);

/** STRESS_HEADS_5 are the headings of the steps that place the stress. */
const STRESS_HEADS_5 = {
  find: t("Step 1: find what the question asks about.", "第一步：找出对方问的是什么。"),
  choose: t("Step 2: stress the word that answers it.", "第二步：把回答这一点的词读重。"),
};

/** GRASP_HEADS_6 are the headings of the steps that say another's view back. */
const GRASP_HEADS_6 = {
  find: t("Step 1: find the view and any condition on it.", "第一步：找出对方的观点，和它附带的条件。"),
  choose: t("Step 2: choose the restatement that keeps both.", "第二步：选出两样都没变的复述。"),
};

/** SPECS_5 are the speaking topics of grade 5, in order. */
const SPECS_5: readonly Spec[] = [
  {
    grade: 5,
    id: "speaking-5-discussion",
    title: t("Speaking in a Discussion", "参与讨论"),
    summary: t(
      "Taking part in a discussion: keeping to its topic, and giving one's view with a reason that bears on it.",
      "参与讨论：围绕话题说话，说出自己的看法和与之相关的理由。",
    ),
    intro: t(
      "A discussion has a topic, and each thing said should help decide it. On whether the class puts on a sketch or a game at the New Year party, “我觉得演小品好，全班同学都能上台” keeps to the topic and gives a reason; “我上次在电视上看过一个小品，笑死我了” mentions a sketch but helps decide nothing.\n\nThe first knowledge point keeps to the topic, the second gives a view with its reason.",
      "讨论有一个话题，说的每句话都要帮助大家拿主意。讨论新年联欢会上班里演小品还是做游戏，“我觉得演小品好，全班同学都能上台”围绕话题，还说了理由；“我上次在电视上看过一个小品，笑死我了”虽然提到了小品，却对拿主意没有帮助。\n\n第一个知识点围绕话题说，第二个说出看法和理由。",
    ),
    texts: [...ruleTexts(ON_TOPIC_5), ...ruleTexts(REASONED_5)],
    after: ["speaking-4-persuading"],
    points: [
      [
        "topic",
        t("Keeping to the Topic", "围绕话题"),
        t(
          "Before speaking, ask what is being decided, and say something that helps decide it: a choice, a plan, a way to do it. Say it in a sentence or two.\n\nOn how to stop books going missing from the book corner: “我建议做一本借书登记本，谁借书就写上名字和日期。”\n\n> **Watch out.** A word from the topic is not enough: “我家里的书都放在书柜里” is about books but not about the book corner. And going on from one thing to the next loses the listeners.",
          "说话前先想一想，大家要商量决定的是什么，再说对决定有帮助的话：一个选择、一个计划、一个办法。一两句话说清楚。\n\n比如讨论怎样让图书角的书不再丢失：“我建议做一本借书登记本，谁借书就写上名字和日期。”\n\n> **注意。** 只沾上话题里的一个词还不够：“我家里的书都放在书柜里”说到了书，却和图书角没关系。从一件事扯到另一件事，听的人就跟不上了。",
        ),
        ruleGenerator(
          t("Which says something that keeps to the topic?", "哪一句是围绕话题说的？"),
          ON_TOPIC_5,
          rule(
            t(
              "Find what the discussion must decide, and say something that helps decide it, briefly.",
              "找出讨论要决定的事，简要地说出对决定有帮助的话。",
            ),
            t("Ask whether the others could use what was said to decide: they could.", "想一想大家听了，能不能用这句话来拿主意：能。"),
          ),
        ),
      ],
      [
        "reason",
        t("A View With Its Reason", "看法和理由"),
        t(
          "Say what you think and then why, and let the reason be about the matter: why this choice works better for what is being decided.\n\nOn the colour of the class flag for sports day: “用红色好，红色在操场上远远就能看见。” Being seen from afar is a reason about a flag.\n\n> **Watch out.** A reason must bear on the choice: “因为我的书包是红色的” has 因为 but says nothing about why the flag would serve better.",
          "先说自己的看法，再说为什么；理由要和商讨的事有关：为什么这样选，对要决定的事更好。\n\n比如讨论运动会的班旗用什么颜色：“用红色好，红色在操场上远远就能看见。”远远能看见，是和班旗有关的理由。\n\n> **注意。** 理由要能说明这个选择：“因为我的书包是红色的”虽然有“因为”，却说明不了班旗为什么用红色更好。",
        ),
        ruleGenerator(
          t("Which gives a view with a reason that bears on the matter?", "哪一句说出了看法和有关的理由？"),
          REASONED_5,
          rule(
            t("Say your view, then why it is better for the matter being decided.", "说出看法，再说为什么这样对要决定的事更好。"),
            t(
              "Ask of the reason: if it were true, would the choice be better? It would.",
              "问一问这个理由：如果它是真的，这样选是不是更好？是的。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "speaking-5-key-points",
    title: t("Key Points and Relaying", "抓住要点转述"),
    summary: t(
      "Listening patiently for the key points of a talk, and relaying them briefly to the one they are for.",
      "耐心听，抓住一段话的要点，再简要地转述给要听的人。",
    ),
    intro: t(
      "A talk gives key points, what you must know or do, and details around them. The class teacher says the class goes to the botanical garden next Friday, meets at the east gate at eight, brings water and a hat, and that as a child she once got lost there: getting lost is a detail.\n\nTo relay, keep the key points and say who said them, with “I” and “you” turned round. The first knowledge point catches the key points, the second relays them.",
      "一段话里有要点，也就是一定要知道、要照着做的事，还有一些围绕要点的细节。班主任说下周五去植物园，八点在学校东门集合，带上水和帽子，还说她小时候在植物园里迷过路：迷路是细节。\n\n转述时，留下要点，说清是谁说的，把“我”“你”换过来。第一个知识点抓住要点，第二个转述要点。",
    ),
    texts: [...ruleTexts(KEY_POINTS_5), ...ruleTexts(RELAYED_5)],
    after: ["speaking-3-relaying"],
    points: [
      [
        "points",
        t("Catching the Key Points", "抓住要点"),
        t(
          "Listen to the end, then ask: what must I know or do, when, where, and with what? Those are the key points; what the speaker adds about themselves or in passing is detail.\n\nThe music teacher: the choir contest next Monday, white shirts, be in the hall twenty minutes early; that her voice was hoarse yesterday is detail.\n\n> **Watch out.** Key points must be heard exactly: twenty minutes is not ten, and “white shirts” is not “white skirts”.",
          "耐心听完，再问自己：我要知道什么、做什么，什么时间，在哪里，带什么？这些就是要点；说话人顺便讲的自己的事，是细节。\n\n比如音乐老师说：下星期一合唱比赛，穿白衬衫，提前二十分钟到礼堂；她说自己昨天嗓子哑了，是细节。\n\n> **注意。** 要点要听准：二十分钟不是十分钟，“白衬衫”也不是“白裙子”。",
        ),
        ruleGenerator(
          t("Which sums up the key points of what was said?", "哪一项抓住了这段话的要点？"),
          KEY_POINTS_5,
          rule(
            t(
              "Find what the listeners must know or do, with its time, place and what to bring.",
              "找出听的人要知道、要做的事，和它的时间、地点、要带的东西。",
            ),
            t(
              "Check each point against the talk: each was said, and nothing said to be done is missing.",
              "把每一点和原话对一对：都说到了，要做的事一样也没少。",
            ),
          ),
        ),
      ],
      [
        "relay",
        t("Relaying Briefly", "简要转述"),
        t(
          "Begin with who said it, keep every key point unchanged, turn “I” and “you” round for the new listener, and leave out the rest.\n\nTo Father: “爸爸，舅舅说他星期六下午到，不用去机场接他，他自己打车来。”\n\n> **Watch out.** Repeating the words as said, “我星期六下午到”, makes it sound as if you are coming; and a relay that wanders through everything said hides the point.",
          "先说是谁说的，要点一个也不改，按新的听话人把“我”“你”换过来，其他的话可以省去。\n\n比如转告爸爸：“爸爸，舅舅说他星期六下午到，不用去机场接他，他自己打车来。”\n\n> **注意。** 照原话说“我星期六下午到”，听起来像是你要来；把听到的话东拉西扯全说一遍，要点就被埋住了。",
        ),
        ruleGenerator(
          t("Which relays the message best?", "哪一句转述得最好？"),
          RELAYED_5,
          rule(
            t("Say who said it, keep the key points, and turn “I” and “you” round.", "说清是谁说的，留下要点，把“我”“你”换过来。"),
            t(
              "Imagine the listener hearing it: they know who sent it and exactly what to do.",
              "想一想听的人：知道是谁带的话，也确切知道该做什么。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "speaking-5-tone",
    title: t("Fitting Tone and Stress", "语气语调适当"),
    summary: t(
      "Speaking with a tone that fits the moment and the listener, and stressing the word that answers what is asked.",
      "说话的语气要合乎场合和听的人；回答问题时，重读回答问题的那个词。",
    ),
    intro: t(
      "The same words can comfort or hurt, depending on how they are said. To a friend who has just lost a race: “没关系，你已经很努力了，下次一定更好” comforts; “你跑得真慢，拖了全班的后腿” hurts.\n\nStress tells the listener which word matters. Asked “今天谁值日？”, you stress 我: “【我】今天值日。” The first knowledge point chooses the tone, the second places the stress.",
      "同样的意思，说法不同，可以让人觉得温暖，也可以让人难过。安慰赛跑输了的好朋友：“没关系，你已经很努力了，下次一定更好”让人温暖；“你跑得真慢，拖了全班的后腿”让人难过。\n\n重音告诉听的人哪个词最要紧。别人问“今天谁值日？”，就重读“我”：“【我】今天值日。”第一个知识点选对语气，第二个读准重音。",
    ),
    texts: [...ruleTexts(TONE_5), ...ruleTexts(STRESS_5)],
    after: ["speaking-4-occasions"],
    points: [
      [
        "tone",
        t("A Tone That Fits", "合适的语气"),
        t(
          "Think who you speak to and what they feel now; then choose words and a tone for it: gentle to comfort, warm to thank, respectful to ask, clear and steady to speak to many.\n\nThanking your aunt for a book you have already read: “谢谢姑姑！这本书我特别喜欢，再读一遍也有意思。”\n\n> **Watch out.** A flat “哦，这本我看过了” is not rude in words, but its tone tells her the gift was wasted.",
          "想一想对谁说话、他现在心里怎样，再选用合适的话和口气：安慰要温和，道谢要真诚，请教要尊敬，对很多人讲话要清楚、稳当。\n\n比如姑姑送你一本你已经读过的书，还是要说：“谢谢姑姑！这本书我特别喜欢，再读一遍也有意思。”\n\n> **注意。** 冷冷地说一声“哦，这本我看过了”，字面上不算骂人，可是口气让姑姑觉得礼物白送了。",
        ),
        ruleGenerator(
          t("Which way of saying it fits the moment?", "这时哪种说法的语气最合适？"),
          TONE_5,
          rule(
            t(
              "Think who hears it and how they feel now, and choose the tone that suits them.",
              "想一想谁在听、他现在心里怎样，选合适的口气。",
            ),
            t(
              "Imagine being the listener: you feel what the speaker meant you to feel.",
              "把自己当成听的人：听了心里的感受，正是说话人想让你有的。",
            ),
          ),
        ),
      ],
      [
        "stress",
        t("Stressing the Right Word", "读准重音"),
        t(
          "A question asks about one thing: who, when, where, which, how many or how. In the answer, stress the word that gives it, here marked 【】.\n\nAsked “你在哪里等我？”: “我在【学校门口】等你。”\n\n> **Watch out.** Stressing another word answers another question: “【我】在学校门口等你” answers “谁等我？”, not “在哪里等？”.",
          "一个问题问的是一样东西：谁、什么时候、哪里、哪一个、多少、怎样。回答时，重读回答这一点的词，这里用【】标出。\n\n比如别人问“你在哪里等我？”：“我在【学校门口】等你。”\n\n> **注意。** 重读别的词，就成了回答别的问题：“【我】在学校门口等你”回答的是“谁等我？”，不是“在哪里等？”。",
        ),
        ruleGenerator(
          t("Which answer stresses the right word?", "哪一种回答，重音放对了？"),
          STRESS_5,
          rule(
            t(
              "Find what the question asks about, and stress the word in the answer that gives it.",
              "找出问题问的是什么，重读回答里说出这一点的词。",
            ),
            t(
              "Turn the stressed word into a question word: you get back the question that was asked.",
              "把重读的词换成疑问词：正好变回对方问的那个问题。",
            ),
            STRESS_HEADS_5,
          ),
        ),
      ],
    ],
  },
  {
    grade: 5,
    id: "speaking-5-civil-language",
    title: t("Civil Language", "语言文明"),
    summary: t(
      "Keeping one's words civil when one disagrees, asks or is annoyed, and choosing words that suit the person spoken to.",
      "不同意、提要求或心里不高兴时，也要说文明的话；对不同的人，说合适的话。",
    ),
    intro: t(
      "Civil words are needed most when one is annoyed. When someone talks loudly on the phone in the cinema: “叔叔，能小声一点吗？大家都在看电影。” says what is wrong without insulting anyone.\n\nAnd words must suit whom you speak to: to the headteacher “校长您好”, to a three-year-old cousin “慢慢走，地上滑，会摔跤的”. The first knowledge point keeps words civil, the second suits them to the person.",
      "心里不高兴的时候，最需要说文明的话。有人在电影院里大声打电话时，“叔叔，能小声一点吗？大家都在看电影。”说清了哪里不对，又不伤人。\n\n说话还要看对谁说：对校长说“校长您好”，对三岁的小表妹说“慢慢走，地上滑，会摔跤的”。第一个知识点说文明的话，第二个对不同的人说合适的话。",
    ),
    texts: [...ruleTexts(CIVIL_5), ...ruleTexts(DIFFER_5)],
    after: ["speaking-4-occasions"],
    points: [
      [
        "polite",
        t("Civil Even When Annoyed", "不高兴时也说文明话"),
        t(
          "Say what you want changed, kindly and plainly, with 请, 好吗 or 能……吗, and speak about what was done, never about what kind of person the other is.\n\n“彩笔用完能把笔帽盖上吗？不然会干掉。” asks for the caps to go back on.\n\n> **Watch out.** “你这个人怎么这么不爱惜东西” attacks the person; even when you are in the right, insults turn the talk into a quarrel.",
          "把希望对方改的地方说清楚，用“请”“好吗”“能……吗”，说得和气；只说对方做的事，不说对方是什么样的人。\n\n比如“彩笔用完能把笔帽盖上吗？不然会干掉。”就是在请同学盖好笔帽。\n\n> **注意。** “你这个人怎么这么不爱惜东西”是在说人；就算你有理，骂人的话也会让商量变成吵架。",
        ),
        ruleGenerator(
          t("Which says it in civil words?", "哪一句说得文明？"),
          CIVIL_5,
          rule(
            t("Say what you want changed, kindly, about the deed and not the person.", "和气地说出希望对方改的地方，只说事，不说人。"),
            t(
              "Imagine the other hearing it: they know what to change and have no reason to be angry.",
              "想一想对方听了：知道该改什么，也没有理由生气。",
            ),
          ),
        ),
      ],
      [
        "differ",
        t("Words for Each Listener", "看对象说话"),
        t(
          "Before speaking, think who listens: an elder or someone you do not know gets 您 and a proper address; a small child gets short, simple words; a class gets clear steps.\n\nAsking an old woman for help: “奶奶，您好，请问这附近有药店吗？”\n\n> **Watch out.** Words that are right for one listener can be wrong for another: “地面湿滑容易导致摔倒受伤” is true, but a three-year-old cannot follow it.",
          "说话前想一想谁在听：对长辈和不认识的人，要用“您”和合适的称呼；对小朋友，要说简短、好懂的话；对全班同学，要把事情一步步说清楚。\n\n比如向老奶奶打听：“奶奶，您好，请问这附近有药店吗？”\n\n> **注意。** 对这个人合适的话，对另一个人不一定合适：“地面湿滑容易导致摔倒受伤”说得没错，可三岁的孩子听不懂。",
        ),
        ruleGenerator(
          t("Which suits the person spoken to?", "哪一句对这个人说最合适？"),
          DIFFER_5,
          rule(
            t("Think who listens, and choose the address and words that suit them.", "想一想谁在听，选合适的称呼和说法。"),
            t("Imagine that listener: they feel respected and understand every word.", "想一想这个听的人：觉得受到尊重，每句话都听得懂。"),
          ),
        ),
      ],
    ],
  },
];

/** SPECS_6 are the speaking topics of grade 6, in order. */
const SPECS_6: readonly Spec[] = [
  {
    grade: 6,
    id: "speaking-6-short-speech",
    title: t("Brief Prepared Remarks", "稍作准备的发言"),
    summary: t(
      "Speaking for a minute after a little preparation: saying first what one is speaking about and coming to the point, in words that suit the occasion.",
      "稍作准备后发言一分钟：开头说清讲什么，紧扣要点，话要合乎场合和听的人。",
    ),
    intro: t(
      "With a minute to speak, say at once what you are speaking about, give the point with one fact or reason, and stop. On saving water: “我想说一说节约用水。上星期我看见洗手池的水龙头开着，没有人关。我建议大家洗完手随手关紧水龙头。”\n\nThe remark must also suit the occasion: farewell words for a retiring teacher are not a report on the term's work. The first knowledge point comes to the point, the second suits the occasion.",
      "只有一分钟发言，就要开口说清讲什么，用一个事实或理由说出要点，然后结束。比如讲节约用水：“我想说一说节约用水。上星期我看见洗手池的水龙头开着，没有人关。我建议大家洗完手随手关紧水龙头。”\n\n发言还要合乎场合：欢送退休老师的话，不能说成学期工作总结。第一个知识点紧扣要点，第二个合乎场合。",
    ),
    texts: [...ruleTexts(POINT_6), ...ruleTexts(FIT_6)],
    after: ["speaking-5-discussion"],
    points: [
      [
        "point",
        t("Coming to the Point", "开门见山，紧扣要点"),
        t(
          "Prepare three things: one sentence saying what you will talk about, the point with one fact or reason, and a closing sentence. Say them in that order.\n\nRunning for leader of the green team: “我想当护绿小队长。我每天到校早，也喜欢花草，我打算每周给花坛浇两次水……”\n\n> **Watch out.** Starting with a long detail, or saying “very important” again and again, uses up the minute before the point is made.",
          "准备三样：一句话说清要讲什么，用一个事实或理由说出要点，再用一句话结束。按这个顺序说。\n\n比如竞选护绿小队长：“我想当护绿小队长。我每天到校早，也喜欢花草，我打算每周给花坛浇两次水……”\n\n> **注意。** 一开口就讲长长的细节，或者把“很重要”说了一遍又一遍，一分钟用完了，要点还没说出来。",
        ),
        ruleGenerator(
          t("Which remark comes to its point best?", "哪一段发言开门见山，紧扣要点？"),
          POINT_6,
          rule(
            t("Say first what you speak about, then the point with one fact or reason.", "先说清讲什么，再用一个事实或理由说出要点。"),
            t(
              "Ask a listener what the remark was about after the first sentence: they can already say.",
              "听完第一句，问问听的人讲的是什么：他已经能说出来了。",
            ),
          ),
        ),
      ],
      [
        "fit",
        t("Suiting the Occasion", "合乎场合"),
        t(
          "Ask what the occasion is, who listens and why they have come; then choose the opening address, the words and the tone: warm for a welcome, solemn for a flag-raising, glad for a birthday.\n\nSeeing off Teacher Li as she retires: “李老师，您辛苦了！谢谢您这些年教我们，祝您身体健康，常回学校看看！”\n\n> **Watch out.** Formal words in the wrong place are as unfit as careless ones: “下面我宣布三条新的班级纪律” is no farewell to her.",
          "想一想这是什么场合、谁在听、大家为什么来，再选开头的称呼、说的话和口气：欢迎要热情，升旗仪式要庄重，生日祝福要高兴。\n\n比如欢送退休的李老师：“李老师，您辛苦了！谢谢您这些年教我们，祝您身体健康，常回学校看看！”\n\n> **注意。** 场合不对，太正式的话和太随便的话一样不合适：对李老师说“下面我宣布三条新的班级纪律”，就不像欢送。",
        ),
        ruleGenerator(
          t("Which remark suits the occasion and the listeners?", "哪一段发言合乎这个场合和听的人？"),
          FIT_6,
          rule(
            t(
              "Think what the occasion is and who listens, and choose the address, words and tone for them.",
              "想一想是什么场合、谁在听，选合适的称呼、话语和口气。",
            ),
            t("Imagine the listeners: the remark is the kind of thing they came to hear.", "想一想听的人：这正是他们来这里想听到的话。"),
          ),
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "speaking-6-presenting",
    title: t("Presenting a Topic", "专题演讲"),
    summary: t(
      "Giving a talk on a topic: an opening that says what it is about, parts in a clear order and an ending; and ways to hold the listeners.",
      "就一个专题演讲：开头点明内容，中间按清楚的顺序讲，有结尾；还要想办法吸引听众。",
    ),
    intro: t(
      "A talk on a topic has a frame: an opening that says what it is about, often with a question; parts in an order the listener can follow; and an ending that sums up. On caring for our eyes: why they need care, which habits harm them, how to do the eye exercises, and a suggestion.\n\nListeners stay with a talk that asks them something, gives a striking number, or lets them see a picture. The first knowledge point builds the frame, the second holds the listeners.",
      "专题演讲有一个框架：开头点明讲什么，常常用一个问题引出；中间按听的人跟得上的顺序讲；结尾作个总结。比如讲保护眼睛：为什么要保护眼睛，哪些习惯伤眼睛，怎样做眼保健操，最后提出建议。\n\n提个问题、说一个让人吃惊的数字、让人看一幅图，听众就愿意听下去。第一个知识点搭好框架，第二个吸引听众。",
    ),
    texts: [...ruleTexts(STRUCTURE_6), ...ruleTexts(ENGAGE_6)],
    after: ["speaking-6-short-speech"],
    points: [
      [
        "structure",
        t("Opening, Order and Ending", "开头、顺序和结尾"),
        t(
          "Open by naming the topic, and what you will cover; go through the parts in one order, by reason, by kind, by place or by time; end by summing up or with a wish.\n\nOn the four seasons at home: spring, summer, autumn, winter, one by one, each with what it looks like and what people do then.\n\n> **Watch out.** Jumping back to a part already done loses the listeners; and stopping when the time runs out, with no ending, leaves the talk hanging.",
          "开头点明专题和要讲哪几部分；中间按一种顺序讲，可以按道理、按种类、按地点或者按时间；结尾作个总结，或者说出希望。\n\n比如讲家乡的四季：春、夏、秋、冬，一季一季讲，每季讲它的景色和人们做些什么。\n\n> **注意。** 讲过的部分又跳回去讲，听众就乱了；时间到了就停下，没有结尾，演讲就像没讲完。",
        ),
        ruleGenerator(
          t("Which is the best way to do this part of the talk?", "演讲的这一部分，怎样做最好？"),
          STRUCTURE_6,
          rule(
            t(
              "Open by naming the topic, go through the parts in one order, and end by summing up.",
              "开头点明专题，中间按一种顺序讲，结尾作总结。",
            ),
            t(
              "Retell the talk as a list of its parts: each follows from the one before, and there is an ending.",
              "把演讲列成几个部分：一部分接着一部分，最后有结尾。",
            ),
          ),
        ),
      ],
      [
        "engage",
        t("Holding the Listeners", "吸引听众"),
        t(
          "Give the listeners something to hold: a question to think about, a number that surprises, a picture to look at, something to do together, or a short scene they can see.\n\nOn ants: “一只小蚂蚁能搬动比自己重几十倍的东西，你们相信吗？”\n\n> **Watch out.** Holding attention is not showing off: reading out every measurement, or laughing at a classmate, loses the listeners in another way.",
          "给听众一样能抓住的东西：一个要想一想的问题，一个让人吃惊的数字，一幅图，一件可以一起做的事，或者一个能看见的小场面。\n\n比如讲蚂蚁：“一只小蚂蚁能搬动比自己重几十倍的东西，你们相信吗？”\n\n> **注意。** 吸引听众不是卖弄：把每个数字都念一遍，或者拿同学开玩笑，都会让听众不想听下去。",
        ),
        ruleGenerator(
          t("Which holds the listeners best?", "哪一种最能吸引听众？"),
          ENGAGE_6,
          rule(
            t(
              "Give the listeners a question, a striking fact, a picture or something to do.",
              "给听众一个问题、一个让人吃惊的事实、一幅图，或者一件可以做的事。",
            ),
            t("Imagine sitting among the listeners: you want to hear what comes next.", "想象自己坐在听众里：想知道下面会讲什么。"),
          ),
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "speaking-6-interview",
    title: t("Asking in an Interview", "采访"),
    summary: t(
      "Interviewing someone: asking questions that draw out what one wants to know, and following up on what they answer.",
      "采访别人：问能问出想了解的内容的问题，并顺着对方的回答追问。",
    ),
    intro: t(
      "An interview has a purpose, and each question serves it. To learn about the school librarian's work, “阿姨，您每天上班都要做哪些事？哪一件最花时间？” lets her tell; “您喜欢这份工作吗？” can be answered with one word.\n\nThen listen to the answer and ask from it: she says she puts back hundreds of returned books a day; ask how she knows where each one goes. The first knowledge point asks the questions, the second follows up.",
      "采访有一个目的，每个问题都要为它服务。想了解图书室阿姨的工作，“阿姨，您每天上班都要做哪些事？哪一件最花时间？”能让她讲出来；“您喜欢这份工作吗？”一个字就能答完。\n\n还要听对方的回答，顺着回答追问：她说每天要把还回来的几百本书放回书架，就问她怎样知道每本书该放在哪里。第一个知识点设计问题，第二个追问。",
    ),
    texts: [...ruleTexts(QUESTIONS_6), ...ruleTexts(FOLLOW_6)],
    after: ["speaking-5-key-points"],
    points: [
      [
        "questions",
        t("Questions That Draw Out", "问出想了解的内容"),
        t(
          "Keep the purpose in mind and ask with 怎样, 什么, 为什么, 哪些, so that the other can tell, not just nod.\n\nTo learn how Grandmother spent the New Year as a child: “奶奶，您小时候是怎样过年的？过年都吃些什么？”\n\n> **Watch out.** A question off the purpose wastes the interview, however friendly; and “您小时候过年热闹吗？” ends with “热闹”.",
          "记住采访的目的，用“怎样”“什么”“为什么”“哪些”来问，让对方能讲出来，不是只点点头。\n\n比如想了解奶奶小时候怎样过年：“奶奶，您小时候是怎样过年的？过年都吃些什么？”\n\n> **注意。** 和目的无关的问题，问得再亲切也是浪费时间；“您小时候过年热闹吗？”答一句“热闹”就没了。",
        ),
        ruleGenerator(
          t("Which question serves the interview best?", "哪个问题最能问出想了解的内容？"),
          QUESTIONS_6,
          rule(
            t(
              "Keep to the purpose, and ask how, what or why, so that the other can tell.",
              "围绕采访目的，用“怎样”“什么”“为什么”来问，让对方能讲出来。",
            ),
            t(
              "Imagine the answer: it tells you something you wanted to know, in more than a word.",
              "想一想对方的回答：讲出了你想了解的内容，不是一两个字就完了。",
            ),
          ),
        ),
      ],
      [
        "follow",
        t("Following Up", "顺着回答追问"),
        t(
          "Listen for what is new or surprising in the answer, and ask about that: why, how, what it was like.\n\nThe courier says he delivers over two hundred parcels a day: “两百多个包裹，一天怎么送得完？要跑多少地方？”\n\n> **Watch out.** Asking what was just answered shows you did not listen; and jumping to another subject leaves the best part of the answer unasked.",
          "听出回答里新的、让人意外的地方，接着问这一点：为什么，怎样做，是什么样子。\n\n比如快递员说每天要送两百多个包裹：“两百多个包裹，一天怎么送得完？要跑多少地方？”\n\n> **注意。** 把对方刚回答的又问一遍，说明你没在听；突然换到别的话题，回答里最有意思的地方就错过了。",
        ),
        ruleGenerator(
          t("Which follow-up question is best?", "哪一个追问最好？"),
          FOLLOW_6,
          rule(
            t("Find what is new in the answer, and ask more about it.", "找出回答里新的内容，接着问下去。"),
            t("Check that the question could only be asked after hearing this answer.", "检查这个问题：只有听了这个回答才问得出来。"),
          ),
        ),
      ],
    ],
  },
  {
    grade: 6,
    id: "speaking-6-responding",
    title: t("Responding to a View", "回应别人的观点"),
    summary: t(
      "Responding to another's view: first saying it back rightly, then answering the view, not the person, with a reason.",
      "回应别人的观点：先准确地复述对方的意思，再针对观点而不是针对人，说出理由。",
    ),
    intro: t(
      "Before answering a view, make sure you have it right: “我不反对养小狗，只是担心没人每天遛它” is not against a dog, it is a worry about walking it. Say it back: “你不是反对养小狗，是担心没人每天遛它。”\n\nThen answer the view with a reason, granting what is right in it: “你说得对，遛狗要天天坚持；我们排一张表，全家轮流遛，就不会落下。” The first knowledge point grasps the view, the second responds to it.",
      "回应以前，先要把对方的意思听准：“我不反对养小狗，只是担心没人每天遛它”不是反对养狗，而是担心没人遛。复述一下：“你不是反对养小狗，是担心没人每天遛它。”\n\n再针对观点说出理由，对的地方也要承认：“你说得对，遛狗要天天坚持；我们排一张表，全家轮流遛，就不会落下。”第一个知识点听准对方的观点，第二个回应它。",
    ),
    texts: [...ruleTexts(GRASP_6), ...ruleTexts(RESPOND_6)],
    after: ["speaking-5-discussion"],
    points: [
      [
        "grasp",
        t("Saying the View Back", "准确复述对方的观点"),
        t(
          "Find the view and any “but”, “only” or “as long as” attached to it; say it back in your own words with both kept.\n\n“周末可以玩游戏，只要先写完作业”: “你是说，周末可以玩游戏，但得先把作业写完。”\n\n> **Watch out.** Dropping the condition turns the view into one nobody holds: “周末可以玩游戏” alone, or “周末不能玩游戏”, is not what was said.",
          "找出对方的观点，和附在上面的“但是”“只是”“只要”；用自己的话复述，两样都保留。\n\n比如“周末可以玩游戏，只要先写完作业”：“你是说，周末可以玩游戏，但得先把作业写完。”\n\n> **注意。** 丢掉条件，观点就变成了别人没说过的话：只说“周末可以玩游戏”，或者说成“周末不能玩游戏”，都不是原来的意思。",
        ),
        ruleGenerator(
          t("Which says the other's view back rightly?", "哪一句准确地复述了对方的意思？"),
          GRASP_6,
          rule(
            t("Find the view and its condition, and keep both in your own words.", "找出观点和它的条件，用自己的话说，两样都保留。"),
            t("Imagine the other hearing it: they would say “yes, that is what I mean.”", "想一想对方听了，会说：“对，我就是这个意思。”"),
            GRASP_HEADS_6,
          ),
        ),
      ],
      [
        "respond",
        t("Answering the View, With a Reason", "针对观点说理由"),
        t(
          "Grant what is right in the view, then say where you differ and why, with a fact or an example; speak of the view, not of the speaker.\n\nTo “小学生不用学游泳”: “学会游泳，在水边遇到危险能保护自己，还能锻炼身体。”\n\n> **Watch out.** “你连水都不敢下吧” answers the person, not the view; and “我不同意” with nothing after it gives the other nothing to think about.",
          "先承认对方观点里对的地方，再说哪里不同意、为什么，用事实或例子来说；说的是观点，不是说话的人。\n\n比如回应“小学生不用学游泳”：“学会游泳，在水边遇到危险能保护自己，还能锻炼身体。”\n\n> **注意。** “你连水都不敢下吧”针对的是人，不是观点；只说“我不同意”，对方就没有什么可想的。",
        ),
        ruleGenerator(
          t("Which response answers the view best?", "哪一句回应得最好？"),
          RESPOND_6,
          rule(
            t("Answer the view, not the person, with a reason or an example.", "针对观点，不针对人，说出理由或事例。"),
            t(
              "Imagine the other hearing it: they have a reason to think again, and nothing to be hurt by.",
              "想一想对方听了：有理由再想一想，也不会觉得受了伤害。",
            ),
          ),
        ),
      ],
    ],
  },
];

/** stageFiveSixSpeaking are the speaking topics of grades 5 and 6, in order, each after the reading and speaking before it. */
export const stageFiveSixSpeaking: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of [...SPECS_5, ...SPECS_6])
    built.push(
      topicOf(
        spec,
        [...stageSpeakingTopics, ...stageThreeFourReading, ...stageThreeFourSpeaking, ...stageFiveSixReading, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
