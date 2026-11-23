// The clues of the gap sentences of the idiom batches, written by hand a sentence at a time (docs/chinese-curriculum.md §6).

import { parseClues } from "../words/clues.ts";

/** idiomClues are the clues of every gap sentence of the idiom batches, by clueKey. */
export const idiomClues = parseClues(`
一心一意/1 | “连窗外的鸟叫都没听见”，说明心思全放在作业这一件事上 | He does not even hear the birds outside the window, so his mind is on his homework alone, and the idiom must mean with the whole heart.
一心一意/2 | 妈妈照顾生病的奶奶，写的是全心全意只顾这一件事 | Mother cares for sick grandmother with all her heart, so the idiom must mean with the whole heart, on one thing only.
五颜六色/1 | 横线修饰“花”，花园里开满的花颜色很多 | The gap describes the flowers that fill the garden, so the idiom must mean of many colours.
五颜六色/2 | 横线修饰“风筝”，天上飘着的风筝颜色很多 | The gap describes the kites floating in the sky, so the idiom must mean of many colours.
自言自语/1 | 冒号和引号说明爷爷在说话，又没有别人听，是对自己说 | The colon and quotation marks show grandfather speaking while no one else is there to hear, so the idiom must mean talking to oneself.
自言自语/2 | “不知道在说些什么”，说明他在对自己小声说话 | No one can tell what he is saying, so he is murmuring to himself, and the idiom must mean talking to oneself.
兴高采烈/1 | “听说要去春游”“欢呼起来”，写的是高兴的心情 | The pupils have just heard about the spring outing and are cheering, so the idiom must mean in high spirits.
兴高采烈/2 | “球队赢了比赛”，队员们回来时心情高兴 | The team has won the match, so the players come back happy, and the idiom must mean in high spirits.
络绎不绝/1 | 节日里公园门口的“游人”，来来往往接连不断 | Visitors keep coming and going at the park gate during the holiday, so the idiom must mean in an endless stream.
络绎不绝/2 | 大桥上“来往的车辆”，一辆接一辆不断 | Cars cross the bridge one after another without a break, so the idiom must mean in an endless stream.
恍然大悟/1 | “听了老师的讲解，我才……原来”，写的是一下子明白了 | After the teacher's explanation I see at once that the problem is simple, so the idiom must mean suddenly seeing the point.
恍然大悟/2 | “看到地上的脚印”，后面冒号说出他明白了的事 | He sees the footprints, and the colon gives what he has suddenly understood, so the idiom must mean suddenly seeing the point.
津津有味/1 | “吃着妈妈做的饺子”，吃得很有味道 | My brother is eating the dumplings mother made and enjoying every bite, so the idiom must mean with great relish.
津津有味/2 | “捧着故事书，看得”，看书兴趣很浓 | He holds the storybook and is deeply absorbed in reading it, so the idiom must mean with great relish.
手忙脚乱/1 | “快迟到了”“把扣子都扣错了”，写的是慌张没有条理 | He is about to be late and even does his buttons up wrong, so the idiom must mean in a flurry.
手忙脚乱/2 | “客人突然来了”，妈妈“忙得”慌张 | Guests arrive without warning and mother is caught rushing about, so the idiom must mean in a flurry.
专心致志/1 | “一点也不走神”，说明精神全集中在听课上 | Xiaoming's mind does not wander at all from the lesson, so the idiom must mean with complete concentration.
专心致志/2 | “连我进门都没发现”，说明奶奶的精神全在绣花上 | Grandmother does not even notice me come in while she embroiders, so the idiom must mean with complete concentration.
争先恐后/1 | “问题一提出”“同学们就……举起手来”，大家争着抢先 | The moment the teacher asks, the whole class puts their hands up, each wanting to be first, so the idiom must mean scrambling to be first.
争先恐后/2 | “下课铃一响”，孩子们争着跑向操场 | The moment the bell rings, the children race each other to the playground, so the idiom must mean scrambling to be first.
小心翼翼/1 | “生怕洒出来”，所以捧鱼缸时十分谨慎 | He is afraid of spilling the water from the full fish tank, so the idiom must mean with great care.
小心翼翼/2 | 把小鸟“放回鸟窝”，动作要十分谨慎，怕伤着它 | She is putting a little bird back in its nest without hurting it, so the idiom must mean with great care. | 依依不舍
无影无踪/1 | “太阳一出来，雾就散得”，雾完全消失了 | Once the sun comes out the fog is wholly gone, so the idiom must mean without a trace.
无影无踪/2 | “一眨眼”“跑得……了”，松鼠完全看不见了 | In the blink of an eye the squirrel can no longer be seen, so the idiom must mean without a trace.
迫不及待/1 | “一放学，他就”打开新书，急得一刻也不能等 | He opens his new book the moment school is over, so the idiom must mean unable to wait. | 小心翼翼
迫不及待/2 | “礼物一到，妹妹就”拆开包装，急得不能再等 | My sister tears off the wrapping the moment the present arrives, so the idiom must mean unable to wait. | 小心翼翼
千姿百态/1 | 公园里的菊花“美极了”，写的是花的姿态多种多样 | The chrysanthemums in the park are beautiful in many different forms, so the idiom must mean in all shapes and poses.
千姿百态/2 | “有的像马，有的像羊”，白云的样子多种多样 | Some clouds look like horses and some like sheep, so the idiom must mean in all shapes and poses.
哄堂大笑/1 | “讲了一个笑话，引得全班”，全班一起大笑 | His joke sets the whole class laughing together, so the idiom must mean the whole room bursting into laughter.
哄堂大笑/2 | 小猴子学人走路，“逗得大家”同时大笑 | The little monkey copying people's walk makes everyone laugh at once, so the idiom must mean the whole room bursting into laughter.
依依不舍/1 | “毕业那天”“告别了老师”，舍不得离开 | On graduation day the pupils say goodbye to their teacher, so the idiom must mean reluctant to part.
依依不舍/2 | “假期结束了”“离开了外婆家”，舍不得走 | The holiday is over and I must leave grandmother's house, so the idiom must mean reluctant to part.
目不转睛/1 | 小猫“盯着”金鱼，眼睛一动不动 | The kitten stares at the goldfish without moving its eyes, so the idiom must mean with eyes fixed on something.
目不转睛/2 | 观众“看着台上的魔术表演”，眼睛一动不动 | The audience watch the magic act without looking away, so the idiom must mean with eyes fixed on something.
井井有条/1 | “书桌收拾得”，说的是摆放整齐不乱 | The sentence is about how tidily his desk is arranged, so the idiom must mean in perfect order.
井井有条/2 | 把家里的事“安排得”，说的是条理分明 | Mother arranges the household's affairs clearly, so the idiom must mean in perfect order.
鸦雀无声/1 | “考试开始了，教室里”，非常安静 | The exam has begun and the classroom is utterly silent, so the idiom must mean so quiet one could hear a pin drop.
鸦雀无声/2 | “刚才还吵吵闹闹”“立刻”，一下子变得非常安静 | The noisy classroom falls silent at once when the teacher walks in, so the idiom must mean so quiet one could hear a pin drop.
一本正经/1 | 弟弟说出“我长大要当科学家”这样郑重的话，态度庄重认真 | My little brother says he will be a scientist in a very earnest manner, so the idiom must mean with a perfectly straight face.
一本正经/2 | “讲着笑话，自己却一点也不笑”，样子很认真 | He tells jokes without smiling at all himself, so the idiom must mean with a perfectly straight face.
和颜悦色/1 | 老师“总是……跟我们说话”，脸色和蔼，态度可亲 | Our teacher always speaks to us kindly, so the idiom must mean with a kind and pleasant face. | 一本正经
和颜悦色/2 | 店主“招呼每一位客人”，脸色和蔼，态度亲切 | The shopkeeper greets every customer warmly, so the idiom must mean with a kind and pleasant face.
东张西望/1 | “好像在找什么人”，所以这里看看，那里瞧瞧 | He seems to be looking for someone at the crossing, so the idiom must mean looking this way and that.
东张西望/2 | “上课时不要……要认真听讲”，与认真听讲相反的是到处看 | The opposite of listening carefully in class is looking all around, so the idiom must mean looking this way and that.
无精打采/1 | “昨晚没睡好”，今天精神不振 | He slept badly last night and has no energy today, so the idiom must mean listless.
无精打采/2 | “输了比赛”，队员们走出球场时提不起劲 | The players have lost the match and trudge off the pitch, so the idiom must mean listless.
理直气壮/1 | “我没有做错，所以”说出真相，理由充分，有气势 | I have done nothing wrong and so tell the truth boldly, so the idiom must mean bold in the knowledge of being right.
理直气壮/2 | “这本书是我先借的”，有充分理由，回答很有气势 | He answers firmly that he borrowed the book first, so the idiom must mean bold in the knowledge of being right. | 一本正经
七嘴八舌/1 | “同学们……讨论着”，人多话多，你一言我一语 | After class many pupils are discussing the spring outing all together, so the idiom must mean everyone talking at once.
七嘴八舌/2 | “谁也听不清谁在说什么”，大家一齐说话 | No one can hear what anyone else is saying, so the idiom must mean everyone talking at once.
摇头晃脑/1 | 背古诗“样子十分得意”，脑袋摇来摇去 | He recites the old poem looking very pleased with himself, so the idiom must mean wagging one's head.
摇头晃脑/2 | 小狗“听到音乐，也跟着……起来”，脑袋跟着摇 | The puppy hears the music and moves its head along with it, so the idiom must mean wagging one's head. | 手舞足蹈
手舞足蹈/1 | “高兴得”，说的是高兴到手脚都动起来 | My brother is so happy about the zoo trip that his hands and feet move, so the idiom must mean dancing for joy. | 摇头晃脑
手舞足蹈/2 | “乐得”，高兴到了极点，手舞脚跳 | She is delighted to get the present, so the idiom must mean dancing for joy. | 摇头晃脑
不知不觉/1 | “边走边聊……就到了家门口”，没有觉察路走了多远 | We chat as we walk and reach home before we notice, so the idiom must mean without realizing it.
不知不觉/2 | “看书看入了迷……天已经黑了”，没有觉察到天黑 | He is so lost in his book that he does not notice it getting dark, so the idiom must mean without realizing it.
栩栩如生/1 | 画上的小鸟“好像要飞出来”，逼真得像活的 | The bird in the painting looks as if it could fly out, so the idiom must mean lifelike.
栩栩如生/2 | 写的是“他捏的泥人”，艺术形象像活的一样 | The sentence describes the clay figure he has made, so the idiom must mean lifelike.
欣欣向荣/1 | “春天来了，田野里”，草木长得茂盛 | Spring has come and plants grow thick in the fields, so the idiom must mean flourishing. | 焕然一新
欣欣向荣/2 | “家乡的各项事业”，蓬勃发展 | Every kind of undertaking in my home town is thriving, so the idiom must mean flourishing.
焕然一新/1 | “打扫之后，教室”，面貌变得崭新 | After the cleaning the classroom looks completely new, so the idiom must mean looking brand new.
焕然一新/2 | “粉刷过的老房子”，有了崭新的面貌 | The old house has been freshly painted, so the idiom must mean looking brand new.
半途而废/1 | “要坚持到底，不能”，与坚持到底相反的是做到一半就停 | The opposite of keeping on to the end is stopping halfway, so the idiom must mean giving up halfway.
半途而废/2 | “一本画册也没画完”，每次都没做完就停下 | He has never finished a single sketchbook, so the idiom must mean giving up halfway.
一丝不苟/1 | “每个零件都要检查好几遍”，连细微的地方也不马虎 | Master Li checks every part several times, so the idiom must mean meticulous, not careless in the least.
一丝不苟/2 | “字写得工工整整”，写作业认真不马虎 | Her handwriting in her homework is neat and tidy, so the idiom must mean meticulous, not careless in the least.
画龙点睛/1 | “文章最后一句话起到了……的作用”，在关键处点明要旨 | The last sentence brings out the essay's point at the key place, so the idiom must mean adding the touch that brings a work to life.
画龙点睛/2 | 标题“一下子说出了全文的意思”，在关键处点明要旨 | The title tells the meaning of the whole essay at once, so the idiom must mean adding the touch that brings a work to life.
守株待兔/1 | “想考出好成绩就得努力”，与努力相反的是空等不劳而获 | Good marks take hard work, and the opposite is waiting for reward without effort, so the idiom must mean waiting for luck instead of working.
守株待兔/2 | “整天等着天上掉馅饼”，妄想不劳而获 | He waits all day for pies to fall from the sky, so the idiom must mean waiting for luck instead of working.
亡羊补牢/1 | “没考好，赶紧找出错的原因”“为时不晚”，出了问题后补救 | After a poor exam he finds the reasons for his mistakes, and it is not too late, so the idiom must mean mending the fold after a sheep is lost.
亡羊补牢/2 | “车被偷了以后，他才装上新锁”，出了事再补救 | He fits a new lock only after his bike has been stolen, so the idiom must mean mending the fold after a sheep is lost.
狐假虎威/1 | “仗着哥哥是班长”，依仗别人的势力欺压人 | He bullies classmates because his brother is the class monitor, so the idiom must mean borrowing another's power to bully.
狐假虎威/2 | 小管家仗着主人“对村民大声吆喝”，借别人的威风欺压人 | The steward shouts at the villagers on the strength of his master's power, so the idiom must mean borrowing another's power to bully.
掩耳盗铃/1 | “把错题藏起来不让妈妈看”，错题还在，是自己骗自己 | Hiding the wrong answers from mother does not make them go away, so the idiom must mean fooling oneself.
掩耳盗铃/2 | “以为不看体重秤就不会胖”，自己骗自己 | Not looking at the scales will not stop anyone putting on weight, so the idiom must mean fooling oneself.
拔苗助长/1 | “让刚学走路的孩子去跑步”，违反成长的规律，急于求成 | Making a child who is just learning to walk run goes against the way children grow, so the idiom must mean pulling up shoots to help them grow.
拔苗助长/2 | “要一步一步来，不能”，与一步一步相反的是急于求成 | The opposite of learning step by step is rushing for quick results, so the idiom must mean pulling up shoots to help them grow.
坐井观天/1 | “只读课本不读别的书”“见识太少”，眼界狭小 | Reading nothing but textbooks leaves one knowing too little, so the idiom must mean seeing the sky from the bottom of a well.
坐井观天/2 | “要多出去走走，不要”，与多走多看相反的是眼界狭小 | The opposite of going out and seeing more is a narrow view, so the idiom must mean seeing the sky from the bottom of a well.
自相矛盾/1 | “一会儿说去，一会儿说不去”，自己的话前后抵触 | He says he will go and then says he will not, so the idiom must mean contradicting oneself.
自相矛盾/2 | “前面说天晴，后面又说下大雨”，文章前后抵触 | The essay says it is sunny and later says it is pouring, so the idiom must mean contradicting oneself.
叶公好龙/1 | “说喜欢小动物，可小狗一靠近就躲开”，嘴上爱好，实际并不爱 | He says he likes small animals but backs away when a puppy comes near, so the idiom must mean professing a love one does not have.
叶公好龙/2 | “嘴上说爱读书，却从不翻开书”，口头爱好，实际不爱 | Someone who says he loves reading never opens a book, so the idiom must mean professing a love one does not have.
南辕北辙/1 | “想减肥却天天吃零食”，行动和目的相反 | Eating snacks every day works against losing weight, so the idiom must mean driving north to reach the south.
南辕北辙/2 | “越努力离目标越远”，行动和目的相反 | The harder he tries the wrong way, the further he gets from his goal, so the idiom must mean driving north to reach the south.
刻舟求剑/1 | “情况已经变了，还用老办法”，不懂随情况变化 | Things have changed but he still uses the old method, so the idiom must mean marking the boat to find the lost sword.
刻舟求剑/2 | “用十年前的旧地图找新开的商店”，不知道情况已经变了 | A ten-year-old map cannot show a shop that has just opened, so the idiom must mean marking the boat to find the lost sword.
杞人忧天/1 | “天气预报说明天晴，你却担心下冰雹”，没有根据的忧虑 | The forecast says sunny, yet you worry about hail, so the idiom must mean needless worry.
杞人忧天/2 | “这座桥结实得很”，所以担心是不必要的 | The bridge is perfectly sturdy, so the worry is groundless, and the idiom must mean needless worry.
滥竽充数/1 | “根本不会唱歌，却站在合唱队里”，没有本领混在里面充数 | He cannot sing at all but stands in the choir anyway, so the idiom must mean making up the numbers without real skill.
滥竽充数/2 | “要学到真本领，不能”，与真本领相反的是没本领混充 | The opposite of real skill is merely making up the numbers, so the idiom must mean making up the numbers without real skill.
惊弓之鸟/1 | 小偷“听到脚步声就逃跑了”，一点动静就非常害怕 | The thief runs off at the sound of footsteps, so the idiom must mean a bird startled by the bow.
惊弓之鸟/2 | “被狗咬过一次后”“见到狗就躲”，受过惊吓后特别害怕 | Once bitten by a dog, he hides whenever he sees one, so the idiom must mean a bird startled by the bow.
一鸣惊人/1 | “平时不声不响，这次比赛却……得了第一名”，一下子做出惊人的成绩 | Usually quiet, he suddenly wins first prize in the contest, so the idiom must mean astonishing everyone at the first try.
一鸣惊人/2 | 新作家“的第一本书就”，一出手就成绩惊人 | The new writer's very first book makes a great stir, so the idiom must mean astonishing everyone at the first try.
胸有成竹/1 | “复习得很充分，走进考场时”，心里早有把握 | He has revised thoroughly and walks into the exam sure of himself, so the idiom must mean having a plan in mind beforehand.
胸有成竹/2 | “这场比赛怎么打，教练早已”，事前已有通盘考虑 | The coach has long known how the match should be played, so the idiom must mean having a plan in mind beforehand.
三心二意/1 | “不能……要一心一意”，与一心一意相反的是意志不专一 | The opposite of with the whole heart is a wandering mind, so the idiom must mean half-hearted.
三心二意/2 | “一会儿捉蝴蝶，一会儿捉蜻蜓”，心思不专一 | The kitten keeps chasing butterflies and dragonflies while fishing, so the idiom must mean half-hearted.
聚精会神/1 | 同学们“听老师讲故事”，注意力高度集中 | The pupils are listening to the teacher's story with full attention, so the idiom must mean with rapt attention.
聚精会神/2 | 爷爷“戴着老花镜”看报纸，注意力高度集中 | Grandfather puts on his reading glasses and reads the paper intently, so the idiom must mean with rapt attention.
鸟语花香/1 | “春天的公园里”“美不胜收”，鸟叫花开的美好景象 | The park in spring is lovely beyond words, so the idiom must mean birds singing and flowers in bloom.
鸟语花香/2 | “清晨的山谷”“空气格外清新”，鸟叫好听，花开喷香 | The valley at dawn is full of birdsong and scent, and the air is fresh, so the idiom must mean birds singing and flowers in bloom.
人山人海/1 | “国庆节的广场上”“热闹极了”，人聚集得非常多 | The square on National Day is crowded and lively, so the idiom must mean a sea of people.
人山人海/2 | “我们挤都挤不进去”，人非常多 | We cannot squeeze into the temple fair, so the idiom must mean a sea of people.
夜以继日/1 | “为了早日修好大桥”，白天黑夜不停地工作 | The workers want to finish the bridge soon and never stop, so the idiom must mean day and night. | 聚精会神
夜以继日/2 | 科学家们做实验“终于成功了”，日夜加紧工作 | The scientists keep up their experiments without rest until they succeed, so the idiom must mean day and night. | 聚精会神
举世闻名/1 | 横线修饰“长城”这座古代建筑，全世界都知道 | The gap describes the Great Wall, an ancient structure the whole world knows, so the idiom must mean world-famous.
举世闻名/2 | 横线修饰“科学家”，名气大到全世界都知道 | The gap describes a scientist known all over the world, so the idiom must mean world-famous.
刻不容缓/1 | “大火正在蔓延”，救火一刻也不能拖延 | The fire is spreading and must be fought at once, so the idiom must mean admitting no delay.
刻不容缓/2 | “病人伤得很重”，送医院一刻也不能拖 | The patient is badly hurt and must go to hospital at once, so the idiom must mean admitting no delay.
一举两得/1 | “既能锻炼身体，又能节省车费”，一件事两方面好处 | Cycling to school is both exercise and a saving on fares, so the idiom must mean killing two birds with one stone.
一举两得/2 | “既陪了奶奶，又练了朗读”，一件事两种好处 | Reading the paper to grandmother keeps her company and also trains my reading aloud, so the idiom must mean killing two birds with one stone.
百发百中/1 | 射击运动员“赢得了金牌”，每次都命中 | The shooter hits the target every time and wins the gold medal, so the idiom must mean hitting the mark every time.
百发百中/2 | 投篮被叫作“神投手”，每投必中 | He is called "the sharpshooter" because every shot goes in, so the idiom must mean hitting the mark every time.
不约而同/1 | “大家……鼓起掌来”，没有约定却一起做 | Everyone starts clapping together at the good news without arranging it, so the idiom must mean as if by agreement. | 喜出望外
不约而同/2 | “我和同桌……选了同一本书”，事先没约好却一样 | My deskmate and I choose the same book without planning to, so the idiom must mean as if by agreement.
喜出望外/1 | “收到远方朋友寄来的礼物”，意想不到的喜事 | A friend far away has sent me a present I did not expect, so the idiom must mean overjoyed at something unexpected.
喜出望外/2 | “听说自己被选上了”，出乎意料的喜事 | She did not expect to be chosen, so the idiom must mean overjoyed at something unexpected.
记忆犹新/1 | 第一次登台的情景“我至今”，还记得很清楚 | I still remember my first time on stage clearly, so the idiom must mean still fresh in one's memory.
记忆犹新/2 | “虽然过去好几年了，大家依然”，记得很清楚 | Years have passed since the spring outing, yet everyone remembers it clearly, so the idiom must mean still fresh in one's memory.
若无其事/1 | “打碎了花瓶，他却……走开了”，像没那回事一样 | He broke the vase and yet walked off as if he had done nothing, so the idiom must mean as if nothing had happened.
若无其事/2 | “突如其来的提问”“从容作答”，沉着得像没事一样 | She meets the sudden question calmly and answers with ease, so the idiom must mean as if nothing had happened.
斩钉截铁/1 | “不管别人怎么劝”“不去就是不去”，说话坚决果断 | Whatever others say, he declares he will not go, so the idiom must mean firm and decisive.
斩钉截铁/2 | “面对诱惑”“拒绝了”，坚决毫不犹豫 | Faced with temptation, she refuses without hesitating, so the idiom must mean firm and decisive.
自告奋勇/1 | “教室的灯坏了，班长”主动去请电工，主动承担 | The light is broken and the monitor offers on his own to fetch the electrician, so the idiom must mean volunteering for a hard task.
自告奋勇/2 | “没人愿意打扫厕所”，小明主动站出来承担 | No one wants to clean the toilets, but Xiaoming steps forward to do it, so the idiom must mean volunteering for a hard task.
不可思议/1 | 蚂蚁“能搬动比自己重几十倍的东西”，难以想象 | A tiny ant can carry things dozens of times its own weight, which is hard to imagine, so the idiom must mean unimaginable.
不可思议/2 | “把一只鸽子变没了”，难以想象，难以理解 | The magician makes a dove vanish, which no one can explain, so the idiom must mean unimaginable. | 莫名其妙
层出不穷/1 | “新的电子产品”，接连出现，没有穷尽 | New electronic products keep appearing without end, so the idiom must mean emerging one after another.
层出不穷/2 | 作家的“新作品”，一部接一部不断出现 | The writer's new works keep coming one after another, so the idiom must mean emerging one after another.
精益求精/1 | 老工匠“对每一件作品都”，已经好了还要更好 | The old craftsman wants every piece to be better even when it is already good, so the idiom must mean always seeking to improve.
精益求精/2 | “不放过一点误差”，好了还求更好 | The scientists let not the slightest error pass, so the idiom must mean always seeking to improve.
莫名其妙/1 | “他突然生气了”，大家不明白为什么 | He suddenly gets angry and no one understands why, so the idiom must mean baffling. | 不可思议
莫名其妙/2 | 桌上“……地多了一封信”，不知道从哪来，让人不明白 | A letter has appeared on the desk from no one knows where, so the idiom must mean baffling.
迫在眉睫/1 | “考试”“都在抓紧复习”，事情临近眼前 | The exam is so close that everyone is revising hard, so the idiom must mean imminent.
迫在眉睫/2 | “台风”“赶紧把船开回港口”，事情临近十分紧迫 | The typhoon is so close that the fishermen hurry their boats back to port, so the idiom must mean imminent.
全力以赴/1 | “为了赢得比赛，队员们”，把全部力量投进去 | The players put all their strength into winning the match, so the idiom must mean going all out.
全力以赴/2 | “无论做什么事，他都”，把全部力量投入 | Whatever he does, he gives it everything he has, so the idiom must mean going all out. | 精益求精
美不胜收/1 | “红叶满山”，美景多得看不过来 | The Fragrant Hills are covered with red leaves in autumn, more beauty than the eye can take in, so the idiom must mean too many beauties to take in.
美不胜收/2 | 博物馆里的“展品”，好东西多得一时看不过来 | The museum has more fine exhibits than one can see at once, so the idiom must mean too many beauties to take in.
别出心裁/1 | 手抄报“得了一等奖”，设计与众不同 | Her handwritten newspaper won first prize for its unusual design, so the idiom must mean original in idea.
别出心裁/2 | 班会“用演课本剧的方式来总结”，构思与众不同 | The class meeting sums up the term by acting out a lesson, an unusual idea, so the idiom must mean original in idea.
囫囵吞枣/1 | “要细细体会，不能”，与细细体会相反的是不加分析地读 | The opposite of savouring a book carefully is swallowing it without thought, so the idiom must mean reading without digesting.
囫囵吞枣/2 | “只求快”“不懂意思”，不加分析地笼统接受 | He learns texts by heart only for speed and does not understand them, so the idiom must mean reading without digesting.
废寝忘食/1 | “为了完成这项发明，他……地工作”，顾不上睡觉吃饭 | He works on his invention without stopping to sleep or eat, so the idiom must mean forgetting food and sleep.
废寝忘食/2 | “读起小说来，常常”，入迷到忘了睡觉吃饭 | Once she starts a novel she is so absorbed that she forgets to sleep and eat, so the idiom must mean forgetting food and sleep.
负荆请罪/1 | “知道自己错怪了同学”，第二天主动认错 | He knows he wronged his classmate and goes the next day to own up, so the idiom must mean offering a humble apology.
负荆请罪/2 | “廉颇”到“蔺相如家”，正是背着荆条请罪的故事 | Lian Po going to Lin Xiangru's house is the very story of carrying thorns to ask for punishment, so the idiom must mean offering a humble apology.
完璧归赵/1 | “借来的书，我一定”，要把原物完好地还回去 | I will give back the borrowed book in perfect condition, so the idiom must mean returning a thing intact to its owner.
完璧归赵/2 | “这台相机用完后我会”，把原物完好归还 | I will return the camera undamaged when I have used it, so the idiom must mean returning a thing intact to its owner.
卧薪尝胆/1 | “输掉比赛后”“第二年夺得了冠军”，刻苦自励，发愤图强 | After losing, the team trained hard and won the championship the next year, so the idiom must mean enduring hardship to prepare a comeback.
卧薪尝胆/2 | “越王勾践”“最终打败了吴国”，正是卧薪尝胆的故事 | King Goujian of Yue at last defeating Wu is the very story behind the idiom, so it must mean enduring hardship to prepare a comeback.
破釜沉舟/1 | “辞去工作专心创业”，下定决心不留后路 | He quits his job to start a business, leaving himself no way back, so the idiom must mean burning one's boats.
破釜沉舟/2 | “项羽”“带领士兵渡河作战”，正是破釜沉舟的故事 | Xiang Yu leading his men across the river is the very story behind the idiom, so it must mean burning one's boats.
纸上谈兵/1 | “光看游泳书不下水”，只空谈理论 | Reading books on swimming without getting in the water is only talk, so the idiom must mean theory with no practice.
纸上谈兵/2 | “讲起踢球头头是道，上了场却不会踢”，空谈不能实战 | He talks well about football but cannot play on the pitch, so the idiom must mean theory with no practice.
毛遂自荐/1 | 学校招讲解员，“她……报了名”，自己推荐自己 | The school wants young guides and she signs up on her own, so the idiom must mean putting oneself forward.
毛遂自荐/2 | “班里选文艺委员，小李”，自己推荐自己 | When the class chooses an arts monitor, Xiao Li names himself, so the idiom must mean putting oneself forward.
赞不绝口/1 | 客人“吃了妈妈做的菜”，不住口地称赞 | The guests keep praising mother's cooking, so the idiom must mean full of praise.
赞不绝口/2 | “看了他的画，老师”，说的是老师不住地称赞 | The teacher praises his painting again and again, so the idiom must mean full of praise.
惟妙惟肖/1 | “模仿老师讲课，学得”，模仿得非常逼真 | He imitates the teacher's way of teaching exactly, so the idiom must mean true to life.
惟妙惟肖/2 | 泥塑把“神态刻画得”，刻画得非常逼真 | The clay figure captures the old man's look exactly, so the idiom must mean true to life.
波澜壮阔/1 | 横线修饰“大海”，后面“我心潮澎湃”，大海的气势雄壮 | The gap describes the sea that stirs my heart, so the idiom must mean vast and magnificent.
波澜壮阔/2 | 横线修饰“革命斗争”，规模宏大 | The gap describes a revolutionary struggle on a grand scale, so the idiom must mean vast and magnificent.
引人入胜/1 | 童话书的“情节”，特别吸引人 | The plot of the fairy-tale book draws the reader in, so the idiom must mean fascinating.
引人入胜/2 | “九寨沟的风景”，特别吸引人 | The scenery of Jiuzhaigou draws visitors in, so the idiom must mean fascinating.
千钧一发/1 | “消防员冲进火海救出了孩子”，那一刻万分危急 | The firefighter dashes into the flames at the most dangerous moment, so the idiom must mean hanging by a thread.
千钧一发/2 | “车子快要撞上来”，情况万分危急 | The car is about to hit the girl when he pulls her away, so the idiom must mean hanging by a thread.
大名鼎鼎/1 | 横线修饰“数学家华罗庚”，名气很大 | The gap describes the mathematician Hua Luogeng, so the idiom must mean renowned.
大名鼎鼎/2 | “已经开了一百多年”的老字号，名气很大 | The old shop has been open for over a hundred years and is famous, so the idiom must mean renowned.
不屈不挠/1 | “面对困难”“终于取得了成功”，不屈服 | He did not give in to difficulty and at last succeeded, so the idiom must mean unyielding.
不屈不挠/2 | “先辈们……的精神”，在困难压力前不屈服 | The spirit of our forebears never bowed to pressure, so the idiom must mean unyielding.
闻鸡起舞/1 | “每天”“坚持晨读”，一早起来奋发 | He gets up early every day to read, so the idiom must mean rising at cockcrow to practise.
闻鸡起舞/2 | “祖逖……的故事”，正是闻鸡起舞的典故 | Zu Ti's story is the very source of the idiom, so it must mean rising at cockcrow to practise.
应接不暇/1 | 节日里营业员“忙得”，人太多接待不过来 | During the festival the shop assistants have more customers than they can serve, so the idiom must mean too much to attend to.
应接不暇/2 | 山路两旁“美景”太多，看都看不过来 | There is more scenery beside the mountain road than one can look at, so the idiom must mean too much to attend to.
豁然开朗/1 | “穿过山洞，眼前”出现村庄，由幽暗突然变得开阔明亮 | Through the cave a bright, open view with a village suddenly appears, so the idiom must mean suddenly opening out, or suddenly clear.
豁然开朗/2 | “听了爸爸的话，我心里”，一下子明白了 | After father's words I understand at once, so the idiom must mean suddenly opening out, or suddenly clear.
悠然自得/1 | 爷爷“坐在树下……喝着茶”，悠闲舒适 | Grandfather sips tea under a tree at his ease, so the idiom must mean carefree and content.
悠然自得/2 | “几只鸭子……游着”，悠闲舒适的样子 | A few ducks swim on the lake at their leisure, so the idiom must mean carefree and content.
震耳欲聋/1 | 横线修饰“鞭炮声”，声音大得耳朵都快震聋了 | The gap describes firecrackers loud enough to hurt the ears, so the idiom must mean deafening.
震耳欲聋/2 | “雷声”“吓得小狗钻到了床底下”，声音极大 | The thunder is so loud that the puppy hides under the bed, so the idiom must mean deafening.
截然不同/1 | “长得一样，性格却”，转折说明性格毫无共同之处 | The twins look alike, but their characters have nothing in common, so the idiom must mean completely different.
截然不同/2 | 拿“南方和北方的冬天”相比，两者完全不同 | The sentence compares winter in the south and in the north, which are nothing alike, so the idiom must mean completely different.
古往今来/1 | “许多诗人都写过”，说的是从古到今 | Many poets from ancient times to now have praised the moon, so the idiom must mean through the ages.
古往今来/2 | 长城“见证了……的历史变迁”，从古到今的变迁 | The Great Wall has witnessed history from ancient times to the present, so the idiom must mean through the ages.
漫不经心/1 | “错了好多题”，因为做作业随随便便 | He gets many answers wrong because he does his homework without care, so the idiom must mean careless.
漫不经心/2 | “听到批评，他还是一副……的样子”，不放在心上 | He does not take the criticism to heart at all, so the idiom must mean careless. | 悠然自得
名副其实/1 | “每次考试都是第一”，学习尖子的名声和实际相符 | He comes first in every exam, so his name as a top pupil matches the facts, and the idiom must mean living up to its name.
名副其实/2 | “四季如春”，与“春城”这个名称相符 | It is like spring all year round, which matches the name "Spring City", so the idiom must mean living up to its name.
不言而喻/1 | “锻炼身体的好处”，不用说就明白 | Everyone knows the good of exercise without being told, so the idiom must mean self-evident.
不言而喻/2 | “大家心里都清楚”，不用说出来就明白 | Everyone knows why he is so happy without a word said, so the idiom must mean self-evident.
举一反三/1 | “学会一道题，就能解一类题”，从一件推知许多 | Learning one problem lets you solve a whole kind of problem, so the idiom must mean inferring many things from one.
举一反三/2 | 老师夸她“善于”，说的是能从一件事推知其他 | The teacher praises her for working out other cases from one, so the idiom must mean inferring many things from one.
恰如其分/1 | “对这件事的评价”，说得正合分寸 | His judgment of the matter is just right, so the idiom must mean exactly appropriate.
恰如其分/2 | “这个比喻用得”，用得正合分寸 | The metaphor is used just right, so the idiom must mean exactly appropriate.
相得益彰/1 | “红花和绿叶”互相衬托，各自更显出来 | Red flowers and green leaves set each other off, so the idiom must mean each bringing out the best in the other.
相得益彰/2 | “音乐和动人的画面”互相配合，效果更好 | The lovely music and moving pictures work together to better effect, so the idiom must mean each bringing out the best in the other.
众志成城/1 | “全村人”“保住了大堤”，万众一心像城墙一样坚固 | The whole village works as one and saves the dyke from the flood, so the idiom must mean unity is strength.
众志成城/2 | “就没有克服不了的困难”，大家团结一心 | No difficulty is too great if everyone is united, so the idiom must mean unity is strength.
博大精深/1 | “中华文化”，思想学识广博高深 | Chinese culture is broad in scope and deep in thought, so the idiom must mean broad and profound.
博大精深/2 | 老教授的“学问”，广博高深 | The old professor's learning is both wide and deep, so the idiom must mean broad and profound.
再接再厉/1 | “取得更好的成绩”，继续努力 | The speaker hopes you will keep working and do even better, so the idiom must mean redoubling one's efforts.
再接再厉/2 | “赢了第一场，还要”，再加一把劲 | We have won the first match and must push harder still, so the idiom must mean redoubling one's efforts.
不知所措/1 | “突然被老师点名，他一时”，不知道怎么办 | Suddenly called on by the teacher, he does not know what to do, so the idiom must mean at a loss.
不知所措/2 | “面对突如其来的问题”，不知该怎么办 | Faced with a sudden question, she does not know how to respond, so the idiom must mean at a loss.
鞠躬尽瘁/1 | “周总理为国家和人民”，贡献出全部精力 | Premier Zhou gave all his strength to the country and the people, so the idiom must mean giving one's all to the end.
鞠躬尽瘁/2 | 老校长“一辈子扎根山村”，为学校贡献全部精力 | The old headmaster spent his whole life in the mountain village for the school, so the idiom must mean giving one's all to the end.
历历在目/1 | 小时候的情景“至今”，清清楚楚出现在眼前 | Planting flowers with grandmother as a child still appears clearly before my eyes, so the idiom must mean vivid before one's eyes.
历历在目/2 | “站在山顶，远处的村庄和田野”，远方景物清楚可见 | From the hilltop the far villages and fields can be seen clearly, so the idiom must mean vivid before one's eyes.
流连忘返/1 | “西湖的美景让游人”，留恋得忘了回去 | West Lake is so beautiful that visitors forget to go home, so the idiom must mean enjoying oneself too much to leave.
流连忘返/2 | 孩子们在游乐园“玩得”，舍不得回去 | The children have so much fun at the amusement park that they do not want to leave, so the idiom must mean enjoying oneself too much to leave.
走马观花/1 | “时间太紧，我们只能”，粗略地看看 | There is so little time at the museum that we can only glance at things, so the idiom must mean taking a cursory look.
走马观花/2 | “读书不能……要细细品味”，与细细品味相反的是粗略地看 | The opposite of savouring a book carefully is reading it quickly and roughly, so the idiom must mean taking a cursory look.
熙熙攘攘/1 | “到处都是买年货的人”，人来人往很热闹 | The street is full of people buying things for the New Year, so the idiom must mean bustling.
熙熙攘攘/2 | 车站里“挤满了回家过年的旅客”，人来人往 | The station is packed with travellers going home for the festival, so the idiom must mean bustling.
毛骨悚然/1 | “深夜里传来一声怪叫”，让人非常害怕 | A strange cry in the dead of night frightens people badly, so the idiom must mean hair-raising.
毛骨悚然/2 | “恐怖故事听得人”，非常害怕 | The horror story frightens its listeners badly, so the idiom must mean hair-raising.
精疲力竭/1 | “爬到山顶，大家都”，体力用尽 | Everyone has used up all their strength climbing to the top, so the idiom must mean utterly exhausted.
精疲力竭/2 | “跑完全程”“坐在地上”，精神体力耗尽 | He has run the whole course and sits down on the ground spent, so the idiom must mean utterly exhausted.
鹤立鸡群/1 | “个子高，站在同学中间”，显得很突出 | He is tall and stands out among his classmates, so the idiom must mean standing out from the crowd.
鹤立鸡群/2 | 作文“在全班”“常被当作范文”，才能突出 | Her compositions are often used as models for the whole class, so the idiom must mean standing out from the crowd.
世外桃源/1 | “风景优美，与世无争，宛如”，不受外界影响的美好地方 | The little mountain village is beautiful and untouched by the world, so the idiom must mean an earthly paradise.
世外桃源/2 | “陶渊明笔下的”，正是桃花源 | The place Tao Yuanming wrote about is the Peach Blossom Spring, so the idiom must mean an earthly paradise.
天衣无缝/1 | “他们配合得”“赢得了比赛”，周密完善找不出毛病 | They work together so perfectly that they win the match, so the idiom must mean flawless.
天衣无缝/2 | “这个计划安排得”，周密得找不出毛病 | The plan is so carefully arranged that no fault can be found, so the idiom must mean flawless.
一筹莫展/1 | “面对这道难题，大家都”，一点办法也想不出 | Faced with the hard problem, no one can think of any way out, so the idiom must mean at one's wit's end.
一筹莫展/2 | “钥匙锁在屋里了”，一点办法也没有 | The key is locked inside and we have no way in, so the idiom must mean at one's wit's end.
诲人不倦/1 | “深受同学们爱戴”的老师，教导人耐心不厌倦 | Teacher Wang is loved by her pupils for teaching them with endless patience, so the idiom must mean tireless in teaching.
诲人不倦/2 | “孔子学而不厌”，与之并列的是教人不倦 | Confucius never tired of learning, and the matching half is never tiring of teaching, so the idiom must mean tireless in teaching.
炉火纯青/1 | 书法“练到了……的地步”，纯熟完美 | His calligraphy has reached a level of perfect mastery, so the idiom must mean consummate skill.
炉火纯青/2 | “老师傅的厨艺”，达到纯熟完美 | The old cook's skill has reached perfection, so the idiom must mean consummate skill.
雪中送炭/1 | “在我最困难的时候借给我钱”，急需时帮助 | He lent me money when I was in the greatest difficulty, so the idiom must mean help in time of need.
雪中送炭/2 | “地震后”送来的物资，灾区急需的帮助 | After the earthquake the supplies from everywhere are exactly what the area needs, so the idiom must mean help in time of need.
锦上添花/1 | “已经写得很好了，再配上插图”，好上加好 | The composition is already good and pictures make it even better, so the idiom must mean adding flowers to embroidery.
锦上添花/2 | “本来成绩就好，又获得了奖学金”，好上加好 | His marks were already good and now he has a scholarship too, so the idiom must mean adding flowers to embroidery.
车水马龙/1 | “节日的大街上”“热闹非凡”，车马来往不断 | The street on the holiday is full of traffic and very lively, so the idiom must mean heavy traffic.
车水马龙/2 | “以前很冷清，现在已经”，来往的车很多 | The road used to be quiet and is now busy with cars, so the idiom must mean heavy traffic.
不耻下问/1 | “虽然是教授，却……常向学生请教”，不以问学识少的人为耻 | Though a professor, he often asks his students for advice, so the idiom must mean not ashamed to learn from those below.
不耻下问/2 | “不懂就问”，不以向人请教为耻 | In study one should ask whenever one does not understand, so the idiom must mean not ashamed to learn from those below.
学而不厌/1 | “八十岁了还在学电脑”，学习不满足 | Grandfather is eighty and still learning to use a computer, so the idiom must mean never tired of learning.
学而不厌/2 | “读书永远不嫌多”，学习总不满足 | One can never read too many books, so the idiom must mean never tired of learning.
前赴后继/1 | “为了民族解放，无数先烈”，前面倒下后面跟上 | For the nation's freedom countless martyrs stepped forward as others fell, so the idiom must mean pressing forward wave upon wave.
前赴后继/2 | “救灾的队伍……奔赴灾区”，一批接一批向前 | Rescue teams hurry to the disaster area one after another, so the idiom must mean pressing forward wave upon wave.
循序渐进/1 | “不能急于求成”，与之相反的是一步步提高 | The opposite of rushing for results is improving one step at a time, so the idiom must mean step by step.
循序渐进/2 | “一下子跑太远会受伤”，训练要一步步加 | Running too far at once causes injury, so training must build up gradually, and the idiom must mean step by step.
当机立断/1 | “看到孩子落水”“跳进河里救人”，立刻作决定 | Seeing a child fall into the water, he jumps in at once, so the idiom must mean deciding promptly.
当机立断/2 | “情况紧急”“命令大家撤离”，抓住时机立刻决定 | In the emergency the captain orders everyone out without delay, so the idiom must mean deciding promptly.
不卑不亢/1 | “面对外国记者的提问”，回答得既不自卑也不高傲 | He answers the foreign reporters with neither too little nor too much pride, so the idiom must mean neither humble nor haughty.
不卑不亢/2 | “大家都很尊重她”，待人得体 | Everyone respects her for the way she treats people, so the idiom must mean neither humble nor haughty.
见义勇为/1 | “抓住了小偷，受到了表扬”，勇敢地做正义的事 | He bravely caught the thief and was praised, so the idiom must mean doing what is right without hesitation.
见义勇为/2 | “……的好人好事”，看到正义的事勇敢去做 | The gap describes good deeds that people bravely do for what is right, so the idiom must mean doing what is right without hesitation.
承前启后/1 | “这一段在文章中起着……的作用”，承接上文，引出下文 | The paragraph picks up what came before and leads into what follows, so the idiom must mean linking what came before to what follows.
承前启后/2 | “这一代人担负着……的使命”，承接前人，开创后来 | This generation carries on from those before and opens the way for those after, so the idiom must mean linking what came before to what follows.
心旷神怡/1 | “登上山顶，极目远望”，心情舒畅 | Looking far from the hilltop lifts the spirits, so the idiom must mean carefree and joyful.
心旷神怡/2 | “漫步在湖边，清风拂面”，心情舒畅 | Walking by the lake in a cool breeze makes one feel at ease, so the idiom must mean carefree and joyful.
人声鼎沸/1 | “集市上”“热闹非凡”，人声喧闹 | The market is noisy with voices and very lively, so the idiom must mean a hubbub of voices.
人声鼎沸/2 | “比赛开始前，体育馆里早已”，人声喧闹 | Before the match the stadium is already noisy with voices, so the idiom must mean a hubbub of voices.
混为一谈/1 | “节俭和小气是两回事，不能”，不能把不同的看成一样 | Thrift and meanness are two different things that must not be treated as one, so the idiom must mean to lump together.
混为一谈/2 | 把“自信和自负”当作一样，是把不同的混在一起 | Treating confidence and conceit as the same is wrong, so the idiom must mean to lump together.
咄咄逼人/1 | “说话……让人很不舒服”，气势汹汹 | The way he talks makes people very uncomfortable, so the idiom must mean aggressive.
咄咄逼人/2 | 横线修饰“质问”，“她始终保持冷静”，对方气势逼人 | She stays calm under questioning that presses hard on her, so the idiom must mean aggressive.
花团锦簇/1 | “到处摆满了鲜花”，五彩缤纷的景象 | The square is filled with flowers for the festival, so the idiom must mean a riot of flowers.
花团锦簇/2 | “春天的公园”，花开得五彩缤纷 | The park in spring is bright with flowers of every colour, so the idiom must mean a riot of flowers. | 人声鼎沸
咬文嚼字/1 | “要讲究用词，但也不必”，不必过分斟酌字句 | One should choose words with care but need not fuss over every one, so the idiom must mean to be pedantic about words.
咬文嚼字/2 | “听起来有些迂腐”，说话死抠字眼 | He nitpicks over words when he talks and sounds pedantic, so the idiom must mean to be pedantic about words.
不求甚解/1 | “要深入思考，不能”，与深入相反的是只懂大概 | The opposite of thinking deeply when reading is grasping only the general idea, so the idiom must mean content with a rough understanding.
不求甚解/2 | “看书走马观花”，只求懂个大概 | He reads quickly and roughly and only gets the gist, so the idiom must mean content with a rough understanding.
油然而生/1 | “看着国旗冉冉升起，一种自豪感”，自然产生 | Watching the flag rise, I feel pride welling up naturally, so the idiom must mean to arise of itself.
油然而生/2 | “读完这封信，敬佩之情”，自然而然产生 | After reading the letter, admiration rises naturally, so the idiom must mean to arise of itself.
大庭广众/1 | “大声喧哗，是不文明的”，指在人多的公开场合 | Being loud is rude in a public place full of people, so the idiom must mean in public.
大庭广众/2 | “第一次在……面前演讲，有些紧张”，面对很多人 | She is nervous making her first speech before a large audience, so the idiom must mean in public.
诚惶诚恐/1 | “走进了经理的办公室”，小心谨慎以至于惶恐 | He walks into the manager's office full of anxious caution, so the idiom must mean in fear and trepidation.
诚惶诚恐/2 | “生怕做不好”，惶恐不安 | Given the heavy task, he is afraid he will not do it well, so the idiom must mean in fear and trepidation.
一气呵成/1 | 文章“读来十分流畅”，从头到尾不间断 | The essay reads smoothly from start to finish, so the idiom must mean done at one go.
一气呵成/2 | “挥笔疾书”写完一幅字，中间不停顿 | He writes a whole scroll quickly without pausing, so the idiom must mean done at one go.
抑扬顿挫/1 | “朗读课文时”“十分动听”，声音高低起伏有节奏 | The teacher reads the text aloud with rising and falling rhythm, beautifully, so the idiom must mean cadenced.
抑扬顿挫/2 | 演讲“富有感染力”，声音高低有致 | His speech moves listeners with its rise and fall, so the idiom must mean cadenced.
忍俊不禁/1 | 小猫“笨拙地追着自己的尾巴”，大家忍不住笑 | Everyone laughs at the kitten clumsily chasing its own tail, so the idiom must mean unable to keep from laughing.
忍俊不禁/2 | “滑稽的表情令人”，忍不住要笑 | His funny face makes people laugh in spite of themselves, so the idiom must mean unable to keep from laughing.
不可名状/1 | 横线修饰“激动”，激动到说不出来 | The gap describes a feeling on the Great Wall too strong for words, so the idiom must mean indescribable.
不可名状/2 | 横线修饰“恐惧”，无法用语言形容 | The gap describes a fear that no words can describe, so the idiom must mean indescribable.
盛气凌人/1 | “仗着自己是老员工，对新人”，用骄横的气势压人 | As an old hand he bullies newcomers with an arrogant air, so the idiom must mean overbearing.
盛气凌人/2 | “有理不在声高，用不着”，用不着靠气势压人 | Being right does not need a loud voice or an arrogant air, so the idiom must mean overbearing.
潜移默化/1 | “父母的言行对孩子有……的影响”，不知不觉起变化 | Parents' words and deeds change their children without their noticing, so the idiom must mean to influence imperceptibly.
潜移默化/2 | 好书“在……中改变着我们”，不知不觉中改变 | Good books change us without our noticing, so the idiom must mean to influence imperceptibly.
庸人自扰/1 | “事情还没发生就整天发愁”，本来没事，自己瞎着急 | Worrying all day about something that has not happened is needless trouble, so the idiom must mean to worry over nothing.
庸人自扰/2 | “他根本没有生你的气”，本来没有问题，是自己找麻烦 | He is not angry with you at all, so the worry is self-made, and the idiom must mean to worry over nothing.
不以为然/1 | “对他的说法，大家都”，不认为是对的 | Nobody thinks what he says is right, so the idiom must mean to disagree.
不以为然/2 | “摇了摇头”，表示不同意 | He shakes his head at my suggestion, so the idiom must mean to disagree.
骇人听闻/1 | 横线修饰“交通事故”，使人听了非常吃惊 | The gap describes a traffic accident that shocks people who hear of it, so the idiom must mean shocking.
骇人听闻/2 | 报纸“揭露了”的“案件”，叫人听了震惊 | The paper has exposed a case that shocks people, so the idiom must mean shocking.
目空一切/1 | “取得了一点成绩就……谁也看不起”，骄傲自大 | After a small success he looks down on everyone, so the idiom must mean to look down on everything.
目空一切/2 | “……的人终究会摔跟头”，骄傲自大的人 | Arrogant people will fall in the end, so the idiom must mean to look down on everything.
坚持不懈/1 | “只要……再难的问题也能解决”，坚持到底不松懈 | Keeping on without slackening can solve even the hardest problem, so the idiom must mean unremitting.
坚持不懈/2 | 横线修饰“努力”，“终于攻克了难关”，一点不松懈 | He overcame the difficulty at last through effort that never let up, so the idiom must mean unremitting.
各抒己见/1 | “讨论会上，同学们”“气氛热烈”，各自发表意见 | At the discussion everyone gives their own opinion and the mood is lively, so the idiom must mean each airing his own view.
各抒己见/2 | “大家……争论不休”，各说各的意见 | Everyone gives their own view on the question and the argument goes on and on, so the idiom must mean each airing his own view.
如释重负/1 | “考完最后一门”“长出了一口气”，紧张过后轻松 | He finishes his last exam and lets out a long breath, so the idiom must mean as if a heavy load were lifted.
如释重负/2 | “听到孩子平安的消息”，紧张心情过去后的轻松 | Mother hears her child is safe and the worry falls away, so the idiom must mean as if a heavy load were lifted.
无可奈何/1 | “雨一直下个不停，我们只好”，没有办法 | The rain will not stop, so we have no choice but to call off the outing, and the idiom must mean helpless.
无可奈何/2 | “面对弟弟的哭闹，妈妈也”，没有办法 | Mother can do nothing about my brother's crying, so the idiom must mean helpless.
叹为观止/1 | 杂技“高超的表演令观众”，赞美好到极点 | The acrobats' superb performance leaves the audience full of admiration, so the idiom must mean to marvel at perfection.
叹为观止/2 | “故宫的建筑艺术令人”，好到了极点 | The architecture of the Palace Museum is as fine as can be, so the idiom must mean to marvel at perfection.
人迹罕至/1 | 原始森林“保留着许多珍稀植物”，人很少到达 | The virgin forest still has many rare plants because people seldom go there, so the idiom must mean rarely visited.
人迹罕至/2 | 横线修饰“沙漠腹地”，人很少到的地方 | The gap describes the heart of the desert where people seldom go, so the idiom must mean rarely visited.
明察秋毫/1 | “任何疑点都逃不过他的眼睛”，能看清细微的事物 | No doubtful point escapes the judge's eye, so the idiom must mean seeing the minutest detail.
明察秋毫/2 | “从一根头发中找到了线索”，目光敏锐 | The detective finds a clue in a single hair, so the idiom must mean seeing the minutest detail.
粗制滥造/1 | “很快就出现了质量问题”，做得马虎不讲质量 | The products soon showed quality problems because they were carelessly made, so the idiom must mean shoddy work.
粗制滥造/2 | “写文章不能……要反复修改”，与反复修改相反的是马虎草率 | The opposite of revising again and again is writing carelessly, so the idiom must mean shoddy work.
兴致勃勃/1 | “周末”去郊外爬山，兴头很足 | At the weekend we set off eagerly to climb hills outside town, so the idiom must mean full of zest.
兴致勃勃/2 | 爷爷“讲起了年轻时的故事”，兴头很足 | Grandfather tells us stories of his youth with great enthusiasm, so the idiom must mean full of zest.
风尘仆仆/1 | “从外地赶回来过年”，旅途奔波劳累 | Father hurries home from far away for the New Year, tired from the journey, so the idiom must mean travel-worn.
风尘仆仆/2 | 横线修饰“旅客”，“走出了车站”，旅途辛苦 | The gap describes travellers just out of the station after a hard journey, so the idiom must mean travel-worn.
引经据典/1 | “显得很有学问”，说话引用经典 | He seems very learned because he quotes the classics when he speaks, so the idiom must mean to quote the classics.
引经据典/2 | 文章“论据充分”，引用典籍作依据 | The essay is well supported by quotations from classic texts, so the idiom must mean to quote the classics.
别具一格/1 | 建筑“造型”“吸引了许多游客”，风格独特 | The building's unusual shape attracts many visitors, so the idiom must mean in a style of its own.
别具一格/2 | 他的散文“读来清新自然”，风格独特 | His essays have a fresh and natural style unlike any other, so the idiom must mean in a style of its own.
正襟危坐/1 | “考场上”“等待发卷”，端正严肃地坐着 | In the exam hall the pupils sit up straight and serious waiting for the papers, so the idiom must mean to sit upright and solemn.
正襟危坐/2 | “平时爱说笑……今天却”“一言不发”，严肃拘谨地坐着 | He usually jokes, but today he sits stiffly and says nothing, so the idiom must mean to sit upright and solemn.
销声匿迹/1 | 传染病“在当地已经……多年”，不再出现 | The infectious disease has not appeared in the area for years, so the idiom must mean to vanish from sight.
销声匿迹/2 | 歌手“红了一阵子，后来就”，不再露面 | The singer was popular for a while and then was never heard of again, so the idiom must mean to vanish from sight.
深恶痛绝/1 | 对“贪污腐败行为”，厌恶痛恨到极点 | People hate corruption to the utmost, so the idiom must mean to detest.
深恶痛绝/2 | 对“弄虚作假的人”，痛恨到极点 | He hates people who cheat and fake to the utmost, so the idiom must mean to detest.
张冠李戴/1 | “明明是李白写的，你却说是杜甫写的”，弄错了对象 | The poem is clearly by Li Bai, yet you say Du Fu wrote it, so the idiom must mean to attribute to the wrong person.
张冠李戴/2 | “引用名言时要查证出处”，以免弄错是谁说的 | One should check the source of a famous saying so as not to credit the wrong person, so the idiom must mean to attribute to the wrong person.
大相径庭/1 | 两人“对这件事的看法”，相差很远 | The two people's views on the matter are far apart, so the idiom must mean widely divergent.
大相径庭/2 | “实验结果与预想”，大不相同 | The experiment's results are very different from what was expected, so the idiom must mean widely divergent.
黯然失色/1 | “和专业运动员相比”，我们的表演远远不如 | Our performance falls far short of the professional athletes', so the idiom must mean to be overshadowed.
黯然失色/2 | “在这幅名画面前，其他作品都”，相比之下远远不如 | Beside the famous painting the other works look much poorer, so the idiom must mean to be overshadowed.
鞭长莫及/1 | “父母远在国外”，力量够不着管孩子的学习 | The parents are abroad and cannot oversee their child's studies, so the idiom must mean beyond one's reach.
鞭长莫及/2 | “总部离分厂太远”，管理力量达不到 | Head office is too far from the branch factory to manage it well, so the idiom must mean beyond one's reach.
置之不理/1 | “对群众的意见，不能”，不能放在一边不理 | People's opinions must not be set aside and ignored, so the idiom must mean to ignore.
置之不理/2 | “对我的劝告”“结果吃了大亏”，不理不睬 | He paid no attention to my advice and suffered for it, so the idiom must mean to ignore.
尽职尽责/1 | 老护士“几十年如一日”，尽到职责 | The old nurse has done her job faithfully day after day for decades, so the idiom must mean doing one's duty in full.
尽职尽责/2 | 消防员“随时准备出发”，尽到职务和责任 | The firefighters are always ready to set off, so the idiom must mean doing one's duty in full.
无可厚非/1 | “想多挣点钱养家，这本身”，不能过分指责 | Wanting to earn more to support the family is not wrong in itself, so the idiom must mean not to be blamed too much.
无可厚非/2 | “年轻人追求时尚”，可以谅解 | Young people following fashion is understandable, so the idiom must mean not to be blamed too much.
当之无愧/1 | 横线修饰“学习标兵”，完全称得上 | The gap describes a model pupil who fully deserves the title, so the idiom must mean fully deserving.
当之无愧/2 | “获此殊荣”，完全称得上，毫无愧色 | The scientist has received this high honour and fully merits it, so the idiom must mean fully deserving.
首当其冲/1 | “洪水来了，河边的村庄”，最先遭灾 | When the flood comes, the village by the river is hit first, so the idiom must mean to bear the brunt.
首当其冲/2 | “物价上涨，低收入家庭”，最先受害 | When prices rise, low-income families suffer first, so the idiom must mean to bear the brunt.
不翼而飞/1 | “刚放在桌上的钱包竟然”，忽然丢失 | The wallet he just put on the table has suddenly gone, so the idiom must mean to vanish into thin air.
不翼而飞/2 | “锁在柜子里的文件”“大家都很着急”，忽然不见了 | The papers locked in the cupboard have suddenly disappeared and everyone is worried, so the idiom must mean to vanish into thin air.
莫衷一是/1 | “大家说法不一”，得不出一致的结论 | Everyone says something different and no agreement is reached, so the idiom must mean unable to agree.
莫衷一是/2 | “专家们的意见”“一时难以决定”，意见分歧 | The experts disagree and a decision is hard to make, so the idiom must mean unable to agree.
随声附和/1 | “他没有主见，总是”，别人说什么跟着说什么 | He has no opinions of his own and always repeats what others say, so the idiom must mean to echo others.
随声附和/2 | “要独立思考，不能”，与独立思考相反的是跟着别人说 | The opposite of thinking for oneself is merely repeating others, so the idiom must mean to echo others.
发人深省/1 | 故事“虽然简单，却”，启发人深刻思考 | The story is simple and yet makes people think deeply, so the idiom must mean thought-provoking.
发人深省/2 | “让我们重新审视了自己”，启发人醒悟 | His words make us take a fresh look at ourselves, so the idiom must mean thought-provoking.
心悦诚服/1 | “他的解释合情合理，大家都”，真心服气 | His explanation is reasonable and everyone accepts it sincerely, so the idiom must mean to be convinced.
心悦诚服/2 | “以理服人”，让学生真心诚意地服气 | The teacher reasons with the pupil who did wrong until he truly accepts it, so the idiom must mean to be convinced.
断章取义/1 | “引用别人的话要完整，不能”，不能只取一段一句 | Quotations must be complete and not torn from their setting, so the idiom must mean to quote out of context.
断章取义/2 | “歪曲了作者的原意”，只孤立地取一句的意思 | He distorted the author's meaning by taking one line on its own, so the idiom must mean to quote out of context.
如出一辙/1 | “这两篇作文的写法”，非常相似 | The two compositions are written in almost the same way, so the idiom must mean as alike as two peas.
如出一辙/2 | “两起事故的原因”，非常相似 | The two accidents had almost the same cause, so the idiom must mean as alike as two peas.
根深蒂固/1 | 落后的观念“在一些人头脑中”，牢固不易动摇 | The backward idea is firmly lodged in some people's minds, so the idiom must mean deep-rooted.
根深蒂固/2 | “很难一下子改变”，基础牢固 | The older generation's habits are hard to change quickly, so the idiom must mean deep-rooted.
自惭形秽/1 | “和那些优秀的同学相比”，因不如别人而惭愧 | Beside his excellent classmates he feels ashamed of falling short, so the idiom must mean to feel inferior.
自惭形秽/2 | “看到她精美的画作，我不禁”，因自己不如而惭愧 | Seeing her fine painting, I feel ashamed of my own, so the idiom must mean to feel inferior.
不可救药/1 | “不要以为犯了错的孩子就”，坏到无法挽救 | A child who does wrong should not be thought past saving, so the idiom must mean beyond cure.
不可救药/2 | “沉迷赌博，已经到了……的地步”，无法挽救 | He is so addicted to gambling that he cannot be saved, so the idiom must mean beyond cure.
拾人牙慧/1 | “要有自己的见解，不要总是”，与自己见解相反的是拿别人的话当自己的 | Writing needs one's own views, and the opposite is passing off others' words as one's own, so the idiom must mean to repeat others' words.
拾人牙慧/2 | “毫无新意”，全是拾取别人的话 | His essays have nothing new because they are all borrowed from others, so the idiom must mean to repeat others' words.
化险为夷/1 | “凭着丰富的经验，船长带领大家”，化危险为平安 | With his long experience the captain leads everyone out of danger, so the idiom must mean to turn danger into safety.
化险为夷/2 | “多亏消防员及时赶到”，才转危为安 | Thanks to the firefighters arriving in time, the danger passed safely, so the idiom must mean to turn danger into safety.
巧夺天工/1 | 盆景“经过匠人的精心设计”“宛如天然生成”，人工胜过天然 | The miniature landscapes are made by craftsmen yet look natural, so the idiom must mean surpassing nature in skill.
巧夺天工/2 | 玉雕“看不出一点人工雕琢的痕迹”，人工精巧胜过天然 | The jade carving shows no trace of the carver's work, so the idiom must mean surpassing nature in skill.
琳琅满目/1 | “商店里的货物”，好东西很多 | The shop is full of fine goods, so the idiom must mean a dazzling array.
琳琅满目/2 | “展品”“令人目不暇接”，美好的东西很多 | There are more beautiful exhibits than the eye can take in, so the idiom must mean a dazzling array.
浑然一体/1 | 亭子“与周围的山水”，完整不可分 | The pavilion blends with the hills and water around it, so the idiom must mean a seamless whole.
浑然一体/2 | “结构严谨，前后”，完整不可分割 | The essay's structure is tight and every part fits the rest, so the idiom must mean a seamless whole.
眼花缭乱/1 | “杂技演员的表演让人看得”，看得迷乱 | The acrobats' act is too much for the eye to follow, so the idiom must mean dazzled.
眼花缭乱/2 | “商品种类太多，看得我”，看着纷繁而迷乱 | There are so many kinds of goods on the shelves that my head spins, so the idiom must mean dazzled.
金碧辉煌/1 | 大剧院“灯火通明”，装饰华丽光彩夺目 | The new grand theatre is brightly lit and richly decorated, so the idiom must mean resplendent.
金碧辉煌/2 | “琉璃瓦，在阳光下”，光彩夺目 | The palace roof of glazed tiles gleams in the sunshine, so the idiom must mean resplendent.
恍如隔世/1 | “重回故乡，看到变化翻天覆地”，好像隔了一世 | Back in his home town, he finds everything changed beyond recognition, so the idiom must mean as if a lifetime had passed.
恍如隔世/2 | “再次见到失散多年的老友”，好像隔了一世 | The two old friends meet again after many years apart, so the idiom must mean as if a lifetime had passed.
肃然起敬/1 | “听了老英雄的事迹”，产生严肃敬仰的感情 | Hearing the old hero's deeds, everyone feels deep respect, so the idiom must mean to be filled with respect.
肃然起敬/2 | “白发苍苍的老教授仍在实验室工作”，令人敬仰 | The white-haired professor is still working in the laboratory, which moves me to respect, so the idiom must mean to be filled with respect.
无与伦比/1 | 长城是“世界上……的伟大建筑”，没有能比的 | The Great Wall has no equal in the world, so the idiom must mean unrivalled.
无与伦比/2 | “世界上很少有人能达到”，没有能相比的 | Few people in the world can reach the pianist's skill, so the idiom must mean unrivalled.
呕心沥血/1 | 小说是作家“……十年写成的”，用尽心思 | The writer spent ten years and all his effort on the novel, so the idiom must mean to pour one's heart into something.
呕心沥血/2 | “为山区教育事业……奉献了一生”，用尽心血 | The old headmaster gave his whole life to education in the mountains, so the idiom must mean to pour one's heart into something.
一针见血/1 | 评语“指出了我作文的毛病”，直截了当切中要害 | The teacher's comment points straight at the faults of my composition, so the idiom must mean to hit the nail on the head.
一针见血/2 | “说到了问题的要害”，切中要害 | His speech goes straight to the heart of the problem, so the idiom must mean to hit the nail on the head.
居安思危/1 | “国家越是太平，越要”，安定时想到危险 | The more peaceful the country is, the more it must think of danger, so the idiom must mean mindful of danger in times of peace.
居安思危/2 | “经营顺利时也要……早做准备”，安定时想到危险 | Even when business goes well, a firm should prepare for trouble early, so the idiom must mean mindful of danger in times of peace.
标新立异/1 | “不愿走别人的老路”，提出新奇主张与众不同 | He does not want to follow the old path others have taken, so the idiom must mean to strike out on a new path.
标新立异/2 | “为了……而胡编乱造”，只为显得新奇与众不同 | A composition should be fresh, but one must not make things up just to seem different, so the idiom must mean to strike out on a new path.
无动于衷/1 | “看到别人遇到困难，我们不能”，不能毫无反应 | We must not stay indifferent when others are in trouble, so the idiom must mean unmoved.
无动于衷/2 | “无论大家怎么劝，他都”，一点也不受触动 | However everyone tries to persuade him, he is not affected at all, so the idiom must mean unmoved.
完好无损/1 | “地震过后，这座古塔依然”，完整没有损坏 | After the earthquake the ancient pagoda is still undamaged, so the idiom must mean intact.
完好无损/2 | 花瓶“包装得很好”，没有一点损坏 | The vase was packed well and arrived without any damage, so the idiom must mean intact.
家喻户晓/1 | 《西游记》的故事“在中国”，家家户户都知道 | Every family in China knows the stories of Journey to the West, so the idiom must mean known to every household.
家喻户晓/2 | “经过宣传”，垃圾分类知识人人都知道 | After the campaign everyone knows how to sort rubbish, so the idiom must mean known to every household.
富丽堂皇/1 | “宫殿里装饰得”，宏伟豪华 | The palace is grandly and richly decorated, so the idiom must mean splendid.
富丽堂皇/2 | 酒店的“大厅”“令人惊叹”，宏伟豪华 | The hotel lobby is so grand and luxurious that people marvel at it, so the idiom must mean splendid.
持之以恒/1 | “每天都要练习”，长久坚持 | Learning a foreign language takes practice every day over a long time, so the idiom must mean to persevere.
持之以恒/2 | “不能三天打鱼两天晒网”，与之相反的是长久坚持 | The opposite of exercising in fits and starts is keeping at it, so the idiom must mean to persevere.
开门见山/1 | “第一段就点明了中心”，直截了当 | The essay states its main idea in the very first paragraph, so the idiom must mean to come straight to the point.
开门见山/2 | 一开口就说“我是来向你道歉的”，不拐弯抹角 | He says at once that he has come to apologize, so the idiom must mean to come straight to the point.
墨守成规/1 | “时代在发展，我们不能”，不能守着老规矩不变 | Times are changing and we cannot hold on to old rules, so the idiom must mean to stick to old ways.
墨守成规/2 | “不敢有一点创新”，守着老规矩 | He never dares to try anything new, so the idiom must mean to stick to old ways.
怒不可遏/1 | “听到侵略者的暴行”，愤怒得不能抑制 | Hearing of the invaders' atrocities, people cannot hold back their anger, so the idiom must mean unable to contain one's anger.
怒不可遏/2 | “看到有人欺负老人”“冲上去制止”，愤怒得忍不住 | He sees someone bullying an old man and rushes to stop it in anger, so the idiom must mean unable to contain one's anger.
刻骨铭心/1 | “登山遇险的经历让我”，记忆深刻 | I will never forget the danger on that mountain climb, so the idiom must mean engraved on one's heart.
刻骨铭心/2 | “这份恩情”“一生不忘”，永远不忘 | He will never forget this kindness all his life, so the idiom must mean engraved on one's heart.
轻而易举/1 | “这道题对他来说”，很容易 | The problem is very easy for him, so the idiom must mean easy to do.
轻而易举/2 | “把箱子举过了头顶”，毫不费力 | He lifts the box over his head without any effort, so the idiom must mean easy to do.
唇亡齿寒/1 | “两国山水相连”“必须互相帮助”，利害相关 | The two neighbouring countries must help each other because they stand or fall together, so the idiom must mean sharing the same fate.
唇亡齿寒/2 | “上下游的城市”“要携手合作”，关系密切利害相关 | Cities upstream and downstream must work together on pollution because their interests are bound up, so the idiom must mean sharing the same fate.
力挽狂澜/1 | “球队落后的关键时刻，他连进两球”，挽回危局 | With his team behind at the key moment, he scores twice to save the game, so the idiom must mean to turn the tide.
力挽狂澜/2 | “危急关头”“救了整个公司”，尽力挽回危局 | At the critical moment he saved the whole company, so the idiom must mean to turn the tide.
忍辱负重/1 | “为了完成任务”“默默坚持了多年”，忍受屈辱承担重任 | He bore it quietly for years to finish the task, so the idiom must mean to bear humiliation for a great task.
忍辱负重/2 | “司马迁”“写成了《史记》”，正是忍辱完成重任 | Sima Qian endured disgrace and wrote the Records of the Grand Historian, so the idiom must mean to bear humiliation for a great task.
字斟句酌/1 | 声明“写得很慎重，每句话都”，一字一句仔细推敲 | He wrote the statement with great care over every sentence, so the idiom must mean to weigh every word.
字斟句酌/2 | “生怕说错一句话”，一字一句地推敲 | She is afraid of saying a single wrong thing in the letter, so the idiom must mean to weigh every word.
因地制宜/1 | “山区”“多种果树”，根据当地情况定办法 | The mountain area plants fruit trees to suit its land, so the idiom must mean to suit measures to local conditions.
因地制宜/2 | “各地”“发展有特色的产业”，根据各地情况 | Each place develops industries of its own based on what it has, so the idiom must mean to suit measures to local conditions.
茅塞顿开/1 | “听了老师的点拨，我”，思想一下开窍 | A word from the teacher makes everything suddenly clear to me, so the idiom must mean suddenly enlightened.
茅塞顿开/2 | “读完这本书”“找到了解决问题的办法”，忽然明白 | After reading the book he suddenly sees how to solve the problem, so the idiom must mean suddenly enlightened.
谈笑风生/1 | 老朋友在晚会上“十分开心”，谈话高兴有风趣 | The old friends at the party chat and joke happily, so the idiom must mean to talk cheerfully and wittily.
谈笑风生/2 | “面对记者”“一点也不紧张”，谈话轻松风趣 | He talks to the reporters lightly and with humour, not at all nervous, so the idiom must mean to talk cheerfully and wittily.
通宵达旦/1 | “为了赶完这份报告”，整夜工作到天亮 | He works through the night until dawn to finish the report, so the idiom must mean all night long.
通宵达旦/2 | “除夕夜”“守岁”，整整一夜到天亮 | On New Year's Eve people stay up until daybreak, so the idiom must mean all night long.
惊心动魄/1 | “观众的心都提到了嗓子眼”，震动很大 | The match has the audience's hearts in their mouths, so the idiom must mean soul-stirring.
惊心动魄/2 | 横线修饰“逃生经历”，惊险震撼 | The gap describes a thrilling and frightening escape, so the idiom must mean soul-stirring.
物是人非/1 | “看到熟悉的教学楼，却已”，东西还在，人已不同 | Back at my old school the buildings are the same but the people are not, so the idiom must mean the place unchanged, the people gone.
物是人非/2 | “老屋还在，奶奶却已离去”，东西还是原来的，人已不在 | The old house is still there but grandmother has passed away, so the idiom must mean the place unchanged, the people gone.
舍生取义/1 | “革命先烈们”，为正义牺牲生命 | The revolutionary martyrs gave their lives for a just cause, so the idiom must mean to give one's life for what is right.
舍生取义/2 | 古人“……的精神”，为正义舍弃生命 | The ancients' spirit of dying for justice still inspires people, so the idiom must mean to give one's life for what is right.
抛砖引玉/1 | “我先谈谈自己的看法”，用自己的意见引出别人的高见 | I give my own view first to draw out others' better ideas, so the idiom must mean to offer a few remarks to draw out better ones.
抛砖引玉/2 | “大家纷纷说出了好主意”，引出别人的高见 | His talk led everyone to come up with good ideas, so the idiom must mean to offer a few remarks to draw out better ones.
防微杜渐/1 | “坏习惯”“及早纠正”，刚冒头时就制止 | A child's bad habits should be corrected as soon as they appear, so the idiom must mean to nip in the bud.
防微杜渐/2 | “预防近视”“从小注意”，在问题刚开始时防止 | Preventing short sight means caring for the eyes from childhood, before trouble starts, so the idiom must mean to nip in the bud.
若有所思/1 | “他望着窗外”，好像在想什么 | He gazes out of the window as if thinking something over, so the idiom must mean lost in thought. | 浮想联翩
若有所思/2 | “听完老师的话”“点了点头”，好像在思考 | She nods after the teacher's words as if turning them over, so the idiom must mean lost in thought.
不屑一顾/1 | “对别人的劝告”，认为不值得一看 | He thinks others' advice is not worth a glance, so the idiom must mean to disdain.
不屑一顾/2 | “对小事”“结果在小事上栽了跟头”，轻视不看 | Some people ignore small things and then come to grief over them, so the idiom must mean to disdain.
相辅相成/1 | “学习和思考”，互相配合互相促进 | Learning and thinking support and strengthen each other, so the idiom must mean to complement each other.
相辅相成/2 | “经济发展和环境保护可以”，互相促进 | Economic growth and protecting the environment can help each other along, so the idiom must mean to complement each other.
迫不得已/1 | “因为大雨，运动会……推迟了”，不得不这样 | Heavy rain forces the sports day to be put off, so the idiom must mean to have no choice.
迫不得已/2 | “才向别人借了钱”，迫于无奈 | He borrowed money only because he had no other way, so the idiom must mean to have no choice.
浮想联翩/1 | “望着满天繁星”，许多想象接连涌现 | Gazing at the starry sky, I have one thought after another, so the idiom must mean thoughts thronging the mind. | 若有所思
浮想联翩/2 | “仿佛回到了古代”，想象接连不断 | After reading the poem his imagination carries him back to ancient times, so the idiom must mean thoughts thronging the mind.
不刊之论/1 | 论文“观点精辟，论证严密”，正确无可修改 | The paper's views are sharp and its argument tight, so nothing in it needs changing, and the idiom must mean an unalterable truth.
不刊之论/2 | 先贤的见解“后人奉为”，正确不可改的言论 | Later generations treat the sage's view as beyond correction, so the idiom must mean an unalterable truth.
差强人意/1 | “发挥一般，成绩只能说”，大体上还能使人满意 | He did only moderately well, so his marks are just about acceptable, and the idiom must mean passable.
差强人意/2 | “新队员第一次上场”，表现大体令人满意 | The new player's first game is on the whole satisfactory, so the idiom must mean passable.
长袖善舞/1 | “在商界”“关系都打点得妥妥当当”，善于钻营 | He handles every connection smoothly in business, so the idiom must mean well-connected and shrewd. | 游刃有余
长袖善舞/2 | “这位商人”“没几年就……站稳了脚跟”，有手腕，善于钻营 | The merchant made his way in the city within a few years by his skill with people, so the idiom must mean well-connected and shrewd.
万人空巷/1 | “冠军回到家乡”“街道两旁挤满了欢迎的人群”，欢迎的盛况 | The streets are packed with crowds welcoming the champion home, so the idiom must mean the whole town turns out.
万人空巷/2 | “全城”“都涌上街头赏灯”，人都从家里出来了 | Everyone in the city pours into the streets for the lantern festival, so the idiom must mean the whole town turns out.
文不加点/1 | “才思敏捷，下笔千言”，一气写成不用涂改 | He writes a thousand words quickly with no need to correct them, so the idiom must mean to write without a single correction.
文不加点/2 | “不到半小时就写成了一篇佳作”，写得快不用改 | She writes a fine essay in under half an hour without changes, so the idiom must mean to write without a single correction. | 游刃有余
危如累卵/1 | “敌军压境，城中粮草将尽”，情况极其危险 | The enemy is at the gates and food is running out, so the situation is extremely dangerous, and the idiom must mean in a precarious state.
危如累卵/2 | “大堤多处渗水”“必须马上抢修”，极其危险 | The dyke is leaking in many places and must be repaired at once, so the idiom must mean in a precarious state.
游刃有余/1 | “当了三年班长，组织这样的活动”，熟练轻松 | After three years as class monitor she organizes such events with ease, so the idiom must mean to do with ease.
游刃有余/2 | “精通三门外语”，当翻译熟练轻松 | He has mastered three languages, so interpreting is easy for him, and the idiom must mean to do with ease.
登堂入室/1 | “学了十年书法”“自成一家”，技能达到很高水平 | After ten years of calligraphy with his teacher he has a style of his own, so the idiom must mean to attain mastery.
登堂入室/2 | “要循序渐进，才能慢慢”，由浅入深达到高水平 | Only by learning step by step can one slowly reach a high level, so the idiom must mean to attain mastery.
曲高和寡/1 | 实验电影“上映了一周就停映了”，能理解的人少 | The experimental film was taken off after a week because few people understood it, so the idiom must mean too highbrow to be popular.
曲高和寡/2 | 诗“写得太深奥”，能理解的人很少 | His poems are so profound that few people understand them, so the idiom must mean too highbrow to be popular.
求全责备/1 | “对初学的孩子不能……要多鼓励”，不能要求十全十美 | Children who are just beginning need encouragement, not demands for perfection, so the idiom must mean to demand perfection.
求全责备/2 | “人无完人”，不该要求别人毫无缺点 | No one is perfect, so we should not expect others to have no faults, and the idiom must mean to demand perfection.
不赞一词/1 | “大家争论不休，他却始终”，一言不发 | While everyone argues, he never says a word, so the idiom must mean to offer no comment.
不赞一词/2 | “看不出是赞成还是反对”，一句话也不说 | No one can tell whether he is for or against the plan because he says nothing, so the idiom must mean to offer no comment.
侧目而视/1 | “恶霸横行乡里”，百姓又怕又恨 | The local bully tyrannizes the village, and people both fear and hate him, so the idiom must mean to look askance in fear and anger.
侧目而视/2 | “仗势欺人”，邻居们又怕又恨 | He bullies people on the strength of his power, and the neighbours fear and resent him, so the idiom must mean to look askance in fear and anger.
举重若轻/1 | “这么复杂的工程”“井然有序”，轻松胜任繁重工作 | He directs the complex project easily and in good order, so the idiom must mean to handle a heavy task with ease.
举重若轻/2 | “一连串的难题”“一一化解”，轻松处理难题 | The old headmaster resolves a string of hard problems one by one, so the idiom must mean to handle a heavy task with ease.
望其项背/1 | “棋艺高超，同龄人难以”，赶不上 | His chess is so good that others his age cannot catch up, so the idiom must mean to come anywhere near.
望其项背/2 | “别的店很难”，比不上老店的手艺 | Other shops can hardly match the old shop's craft, so the idiom must mean to come anywhere near.
休戚与共/1 | “两国人民”“结下了深厚的友谊”，同甘共苦 | The two peoples have formed a deep friendship through good times and bad, so the idiom must mean to share weal and woe.
休戚与共/2 | “全村人”“一起渡过了那场洪水”，共患难 | The whole village got through the flood together, so the idiom must mean to share weal and woe.
安步当车/1 | “每天早上都”“慢慢走过去”，步行当作坐车 | Grandfather walks slowly to the nearby park every morning instead of riding, so the idiom must mean to walk rather than ride.
安步当车/2 | “天气晴好，他索性”“一路走回了家”，以步代车 | The weather is fine, so he simply walks all the way home, and the idiom must mean to walk rather than ride.
耳提面命/1 | “在老师的……下，他的学业进步很快”，恳切地当面教导 | His studies make quick progress under the teacher's earnest guidance, so the idiom must mean to give earnest instruction.
耳提面命/2 | 父亲“教他做人要正直”，恳切地当面教导 | Father always teaches him face to face to be upright, so the idiom must mean to give earnest instruction.
蔚然成风/1 | “在学校的倡导下，课外阅读已经”，形成风气 | With the school's encouragement, reading outside class has become the general practice, so the idiom must mean to become a common practice.
蔚然成风/2 | “垃圾分类在社区里”，逐渐盛行成风气 | Sorting rubbish is now widespread in the community, so the idiom must mean to become a common practice.
一挥而就/1 | “提起毛笔”写下对联，一动笔就写成 | He picks up the brush and writes a couplet in one go, so the idiom must mean to finish at one stroke of the pen.
一挥而就/2 | 画家画山水画，一动笔就画成 | The painter finished the landscape the moment he set brush to paper, so the idiom must mean to finish at one stroke of the pen.
胸无城府/1 | “心里怎么想嘴上就怎么说”，为人坦率 | He says exactly what he thinks, so the idiom must mean open and frank.
胸无城府/2 | “用不着处处提防”，为人坦率没有心机 | There is no need to be on guard with such a person, so the idiom must mean open and frank.
东山再起/1 | “公司破产以后”“几年后又”，失败后重新恢复 | After his company went bankrupt he started over and rose again a few years later, so the idiom must mean to make a comeback.
东山再起/2 | “这支球队降级后”“终于”，失败后恢复地位 | After relegation the team worked hard and at last regained its place, so the idiom must mean to make a comeback.
江郎才尽/1 | “写了几部好小说，后来却再无新作”，才思减退 | He wrote a few good novels and then nothing new, so the idiom must mean to have used up one's talent.
江郎才尽/2 | “晚年的作品平淡无奇”，写不出好作品 | The writer's late works are dull and ordinary, so the idiom must mean to have used up one's talent.
洛阳纸贵/1 | 小说“一出版就轰动全国”，风行一时 | The novel caused a sensation across the country as soon as it came out, so the idiom must mean a book in great demand.
洛阳纸贵/2 | “他的诗集问世”，流传很广，风行一时 | His collection of poems spread far and wide as soon as it appeared, so the idiom must mean a book in great demand.
三人成虎/1 | “谣言说的人多了”“要及时澄清”，谣言多了让人信以为真 | A rumour repeated by many people will be believed, so it must be cleared up quickly, and the idiom must mean repeated rumors become believed.
三人成虎/2 | “一件没影的事，传来传去”“大家都信了”，谣言多了成真 | Something that never happened was passed around until everyone believed it, so the idiom must mean repeated rumors become believed.
不足为训/1 | “靠熬夜突击考了高分，这种做法”，不能当作榜样 | Cramming all night for high marks is not a method to copy, so the idiom must mean not to be taken as an example.
不足为训/2 | “个别人侥幸成功的经历”，不能当作法则 | The lucky success of a few people is no rule to follow, so the idiom must mean not to be taken as an example.
不可理喻/1 | “蛮横无理”，不能用道理使他明白 | He is so rude and unreasonable that no reasoning reaches him, so the idiom must mean impervious to reason.
不可理喻/2 | “跟……的人争吵，只是白费力气”，讲不通道理 | Quarrelling with someone who will not listen to reason is wasted effort, so the idiom must mean impervious to reason.
方兴未艾/1 | 人工智能研究“前景十分广阔”，正在兴起 | Research on artificial intelligence is still growing and has a wide future, so the idiom must mean to be in the ascendant.
方兴未艾/2 | 全民健身的“热潮”“越来越多的人”，正在发展 | More and more people are taking up exercise and the trend is still rising, so the idiom must mean to be in the ascendant.
不负众望/1 | “在决赛中夺得了金牌”，没有辜负大家的期望 | He won the gold medal in the final as everyone hoped, so the idiom must mean to live up to expectations.
不负众望/2 | “新任队长”“带领球队打进了前三名”，不辜负期望 | The new captain led the team into the top three as everyone hoped, so the idiom must mean to live up to expectations.
不绝如缕/1 | “国家危难”，命运像细线一样快要断了 | The country was in peril and the nation's fate was about to snap like a thread, so the idiom must mean hanging by a thread.
不绝如缕/2 | 远处的“笛声”“若有若无”，声音细弱悠长 | Late at night the distant flute is faint and drawn out, now there, now gone, so the idiom must mean hanging by a thread.
首屈一指/1 | 数学教学“在全省”，排第一 | The school's mathematics teaching is the best in the province, so the idiom must mean second to none.
首屈一指/2 | “论刺绣手艺，她在村里是”，排第一 | When it comes to embroidery she is the best in the village, so the idiom must mean second to none.
如雷贯耳/1 | “大名早已”“终于见到了本人”，名声很大 | I have long known the scientist's famous name and today I meet him at last, so the idiom must mean to be widely renowned.
如雷贯耳/2 | “久闻先生大名”，名声大得像雷声 | The speaker has long heard of the gentleman's great name, so the idiom must mean to be widely renowned.
无所不至/1 | 骗子“为了骗钱，坑蒙拐骗”，什么坏事都做 | The swindlers will cheat in every possible way to get money, so the idiom must mean to stop at nothing.
无所不至/2 | “奸臣陷害忠良”，坏事做尽 | The treacherous minister did every evil to frame loyal men, so the idiom must mean to stop at nothing.
空穴来风/1 | “纯属……大家不要轻信”，毫无根据 | The news has no basis at all and should not be believed, so the idiom must mean groundless rumor.
空穴来风/2 | 网上的传言“不能当真”，毫无根据 | Most rumours online have no basis and should not be taken seriously, so the idiom must mean groundless rumor.
明日黄花/1 | “已经是……没有人再关心了”，过时的消息 | No one cares about that news any more because it is out of date, so the idiom must mean stale news.
明日黄花/2 | “当年流行的款式，如今早成了”，过时的事物 | The style that was fashionable then is long out of date now, so the idiom must mean stale news.
沧海一粟/1 | “个人的力量在广阔的宇宙面前”，非常渺小 | One person's strength is tiny before the vast universe, so the idiom must mean a drop in the ocean.
沧海一粟/2 | “和人类的全部知识相比”，非常渺小 | The books I have read are tiny beside all human knowledge, so the idiom must mean a drop in the ocean.
不学无术/1 | “整天游手好闲”“什么事也干不成”，没学问没本领 | He idles all day and can do nothing, so the idiom must mean ignorant and incompetent.
不学无术/2 | “是担不起这样的重任的”，没有学问本领的人 | Someone without learning or skill cannot take on such a heavy task, so the idiom must mean ignorant and incompetent.
难以为继/1 | “没有了资金的支持，这个项目”，难以继续 | Without money behind it the project cannot go on, so the idiom must mean hard to keep up.
难以为继/2 | “靠透支身体换来的好成绩”，难以继续下去 | Good marks won by wearing out one's body cannot last, so the idiom must mean hard to keep up.
目不暇接/1 | “新产品琳琅满目，令人”，眼睛看不过来 | The fair is so full of new products that the eye cannot take them all in, so the idiom must mean too much for the eyes to take in.
目不暇接/2 | “景色不断变换”，看不过来 | The view from the train window keeps changing faster than one can look, so the idiom must mean too much for the eyes to take in.
登峰造极/1 | 书法“已经到了……的地步”，达到最高境界 | His calligraphy has reached the highest level, so the idiom must mean to reach the peak of perfection.
登峰造极/2 | “宋代的瓷器烧制技术可谓”，达到最高 | The making of porcelain in the Song dynasty reached its height, so the idiom must mean to reach the peak of perfection.
如履薄冰/1 | “刚接手这项重要工作”“不敢有丝毫大意”，极为小心谨慎 | He has just taken on important work and dares not be careless for a moment, so the idiom must mean as if treading on thin ice.
如履薄冰/2 | “在悬崖边的栈道上”，走得极为小心 | On the plank path by the cliff everyone walks with the greatest care, so the idiom must mean as if treading on thin ice.
口若悬河/1 | “辩论会上”“驳得对方哑口无言”，能说会道 | In the debate he talks so well that his opponents have nothing to say, so the idiom must mean to speak with great eloquence.
口若悬河/2 | “说起家乡的趣事”“停不下来”，滔滔不绝 | Once grandmother starts on the stories of her home town she cannot stop, so the idiom must mean to speak with great eloquence.
妙手回春/1 | “病人康复出院时”送锦旗，称赞医术高明 | A recovered patient sends a banner praising the doctor's skill, so the idiom must mean to bring the dying back to health.
妙手回春/2 | “多亏这位老中医”“爷爷的病才好了”，医术高明 | Grandfather got well thanks to the old doctor's skill, so the idiom must mean to bring the dying back to health.
信口开河/1 | “没有调查清楚就下结论”，随口乱说没根据 | Drawing a conclusion without checking the facts is talking without basis, so the idiom must mean to talk at random.
信口开河/2 | “说话从来不负责任”，随口乱说 | He never takes responsibility for what he says, so the idiom must mean to talk at random.
杯水车薪/1 | “这点钱对于重建整座学校来说”，力量太小 | The little money is far too small to rebuild a whole school, so the idiom must mean a futile effort.
杯水车薪/2 | “靠几个人挑水救这场山火”，力量太小解决不了问题 | A few people carrying water cannot put out a forest fire, so the idiom must mean a futile effort.
休养生息/1 | “汉朝初年，朝廷减轻赋税”，让百姓恢复元气 | Early in the Han dynasty the court cut taxes so the people could recover, so the idiom must mean to recuperate.
休养生息/2 | “连年战乱以后”，国家需要恢复元气 | After years of war the country badly needs to recover its strength, so the idiom must mean to recuperate.
鱼目混珠/1 | “拿假货”“消费者要擦亮眼睛”，以假冒真 | Some sellers pass off fakes in the market, so shoppers must keep their eyes open, and the idiom must mean to pass off the sham as genuine.
鱼目混珠/2 | “用人造宝石”“欺骗顾客”，以假冒真 | Some shops cheat customers with man-made gems sold as real ones, so the idiom must mean to pass off the sham as genuine.
无可置疑/1 | “他是这次事故的责任人”，没什么可怀疑的 | There is no doubt at all that he is responsible for the accident, so the idiom must mean beyond doubt.
无可置疑/2 | “证据确凿”，事实明显不容怀疑 | The evidence is conclusive and the facts cannot be questioned, so the idiom must mean beyond doubt.
画地为牢/1 | “要敢于创新，不能……死守老一套”，只在划定范围活动 | Research needs new ideas, not keeping within old limits, so the idiom must mean to confine oneself to a set limit.
画地为牢/2 | “不肯走出自己熟悉的小圈子”，自己限制自己 | He never leaves the small circle he knows, so the idiom must mean to confine oneself to a set limit.
一叶障目/1 | “只看到一点缺点就否定全部”，被局部迷惑看不到全局 | Rejecting everything because of one small fault means missing the whole picture, so the idiom must mean to miss the whole for a part.
一叶障目/2 | “看问题要全面……以偏概全”，与全面相反 | The opposite of seeing a problem as a whole is judging it by one part, so the idiom must mean to miss the whole for a part.
防患未然/1 | “定期检查电线”，在祸患发生前防止 | Wiring is checked regularly to prevent trouble before it happens, so the idiom must mean to nip trouble in the bud.
防患未然/2 | “消防演习的目的”，事先防止祸患 | Fire drills are meant to head off disaster in advance, so the idiom must mean to nip trouble in the bud.
蔚为大观/1 | “收藏的历代名画”汇集在一起，盛大壮观 | The famous paintings of every dynasty gathered in the museum make a grand sight, so the idiom must mean to present a splendid sight.
蔚为大观/2 | “各地的民间艺术汇聚一堂”，壮观的景象 | Folk arts from every region gathered in one place make a grand sight, so the idiom must mean to present a splendid sight.
别无长物/1 | “除了几架旧书”，再没有多余的东西 | Apart from a few shelves of old books his study has nothing else, so the idiom must mean to own nothing but the bare necessities.
别无长物/2 | “这位清官去世时，家中”，再无多余之物 | The honest official left nothing of value at home when he died, so the idiom must mean to own nothing but the bare necessities.
不忍卒读/1 | 家书“字字血泪”，不忍心读完 | Every word of the letter home is full of tears and grief, so the idiom must mean too sad to read to the end.
不忍卒读/2 | “写灾民的苦难”，悲惨得不忍读完 | The novel's account of the refugees' suffering is painful to read, so the idiom must mean too sad to read to the end.
石破天惊/1 | 发现“改变了人们对宇宙的认识”，新奇惊人 | The discovery changed how people understand the universe, so the idiom must mean earth-shaking.
石破天惊/2 | 观点“震动了整个学界”，新奇惊人 | His view shook the whole academic world, so the idiom must mean earth-shaking.
弹冠相庆/1 | “奸臣得势，他的党羽都”，坏人得意庆贺 | The treacherous minister has come to power and his followers rejoice, so the idiom must mean to celebrate (with ill intent).
弹冠相庆/2 | “听说对手倒台，那伙投机分子”，坏人互相庆贺 | The opportunists rejoice to hear their rival has fallen, so the idiom must mean to celebrate (with ill intent).
不一而足/1 | “从扶老人过马路到捐款助学”，不止一种 | His good deeds range from helping old people across the road to giving money for schooling, so the idiom must mean numerous.
不一而足/2 | “从错别字到病句”，毛病不止一种 | The composition's faults range from wrong characters to faulty sentences, so the idiom must mean numerous.
一言九鼎/1 | “他说的话大家都信服”，说话很有分量 | Everyone in the village trusts what the old Party secretary says, so the idiom must mean one's word carries great weight.
一言九鼎/2 | “为人守信”“从不食言”，说话有分量 | He keeps faith and never goes back on his word, so the idiom must mean one's word carries great weight.
大巧若拙/1 | 作品“看似朴素，其实”“处处见功夫”，真巧看似笨拙 | The work looks plain but shows great skill everywhere, so the idiom must mean great skill seems clumsy.
大巧若拙/2 | “从不炫耀自己的本事”，聪明不卖弄 | He never shows off what he can do, so the idiom must mean great skill seems clumsy.
匠心独运/1 | 园林“布局”“一步一景”，构思精巧独到 | The garden is laid out so that every step brings a new view, so the idiom must mean of original design.
匠心独运/2 | 作者“用一件小事写出了时代的变迁”，构思独创 | The author shows how the times changed through one small event, so the idiom must mean of original design.
津津乐道/1 | 比赛“至今仍被球迷们”，很有兴趣地谈论 | Football fans still love talking about that exciting match, so the idiom must mean to talk about with great relish.
津津乐道/2 | 爷爷“对自己年轻时的经历总是”，喜欢谈论 | Grandfather always enjoys talking about his youth, so the idiom must mean to talk about with great relish.
感同身受/1 | “读了他的遭遇”“忍不住落下泪来”，感受像亲身经历 | Reading of his misfortune, I feel it as if it were mine and cannot hold back tears, so the idiom must mean to feel as if one had experienced it.
感同身受/2 | “才能真正理解别人的难处”，像亲身经历一样感受 | Only by feeling as if it happened to us can we truly understand others' troubles, so the idiom must mean to feel as if one had experienced it.
犬牙交错/1 | “两县边界”“分不清哪块地属于哪个县”，交界线曲折 | The border between the two counties is so winding that no one can tell which field is whose, so the idiom must mean jigsaw-like.
犬牙交错/2 | “敌我双方的阵地”，交错复杂 | The two armies' positions on the battlefield are tangled together, so the idiom must mean jigsaw-like.
上行下效/1 | “领导带头铺张浪费，下属”，上面怎么做下面就跟着 | The leaders set an example of waste and those below follow, so the idiom must mean subordinates follow the example of superiors.
上行下效/2 | “领导要先做好表率”，防止下面学上面的坏样 | Leaders must set a good example so that those below do not copy bad ways, so the idiom must mean subordinates follow the example of superiors.
不胜枚举/1 | “勤学成才的例子”，多得列举不完 | Examples of people who succeeded through hard study are too many to list, so the idiom must mean too numerous to mention.
不胜枚举/2 | “他做过的好事”“大家有目共睹”，多得数不过来 | His good deeds are too many to count, so the idiom must mean too numerous to mention.
`);
