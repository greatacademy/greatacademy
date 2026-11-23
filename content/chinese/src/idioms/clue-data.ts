// The clues of the gap sentences of the idiom batches, written by hand a sentence at a time (docs/chinese-curriculum.md §6).

import { parseClues } from "../words/clues.ts";

/** idiomClues are the clues of every gap sentence of the idiom batches, by clueKey. */
export const idiomClues = parseClues(`
一心一意/1 | “连窗外的鸟叫都没听见”，说明心思全放在作业这一件事上 | "did not even hear the birds" shows a mind on the homework alone
一心一意/2 | 妈妈照顾生病的奶奶，写的是全心全意只顾这一件事 | a mother nursing grandmother with her whole heart
五颜六色/1 | 横线修饰“花”，花园里开满的花颜色很多 | the gap describes a garden of flowers, so their many colours
五颜六色/2 | 横线修饰“风筝”，天上飘着的风筝颜色很多 | the gap describes kites in the sky, so their many colours
自言自语/1 | 冒号和引号说明爷爷在说话，又没有别人听，是对自己说 | the colon and quotation show grandfather speaking, to no one but himself
自言自语/2 | “不知道在说些什么”，说明他在对自己小声说话 | "no one knew what he was saying": he is talking to himself
兴高采烈/1 | “听说要去春游”“欢呼起来”，写的是高兴的心情 | news of an outing and cheering: high spirits
兴高采烈/2 | “球队赢了比赛”，队员们回来时心情高兴 | the team won, so they come back in high spirits
络绎不绝/1 | 节日里公园门口的“游人”，来来往往接连不断 | holiday visitors at the gate: an endless stream
络绎不绝/2 | 大桥上“来往的车辆”，一辆接一辆不断 | traffic coming and going on the bridge: a steady stream
恍然大悟/1 | “听了老师的讲解，我才……原来”，写的是一下子明白了 | "only after the teacher explained … so that was it": suddenly understanding
恍然大悟/2 | “看到地上的脚印”，后面冒号说出他明白了的事 | after seeing the pawprints, the colon gives what he suddenly grasped
津津有味/1 | “吃着妈妈做的饺子”，吃得很有味道 | eating mother's dumplings with relish
津津有味/2 | “捧着故事书，看得”，看书兴趣很浓 | reading a storybook with keen interest
手忙脚乱/1 | “快迟到了”“把扣子都扣错了”，写的是慌张没有条理 | late and buttons done up wrong: a flurry
手忙脚乱/2 | “客人突然来了”，妈妈“忙得”慌张 | guests arriving suddenly: mother in a flurry
专心致志/1 | “一点也不走神”，说明精神全集中在听课上 | "not distracted at all": full concentration on the lesson
专心致志/2 | “连我进门都没发现”，说明奶奶的精神全在绣花上 | "did not notice me come in": grandmother absorbed in her embroidery
争先恐后/1 | “问题一提出”“同学们就……举起手来”，大家争着抢先 | hands shot up as soon as the question came: all scrambling to be first
争先恐后/2 | “下课铃一响”，孩子们争着跑向操场 | the bell rings and the children race to the playground
小心翼翼/1 | “生怕洒出来”，所以捧鱼缸时十分谨慎 | "afraid of spilling": carrying the tank with great care
小心翼翼/2 | 把小鸟“放回鸟窝”，动作要十分谨慎，怕伤着它 | putting a chick back in the nest needs great care | 依依不舍
无影无踪/1 | “太阳一出来，雾就散得”，雾完全消失了 | when the sun comes out the mist vanishes entirely
无影无踪/2 | “一眨眼”“跑得……了”，松鼠完全看不见了 | in a blink the squirrel had gone without a trace
迫不及待/1 | “一放学，他就”打开新书，急得一刻也不能等 | the moment school ended he opened the book: he could not wait | 小心翼翼
迫不及待/2 | “礼物一到，妹妹就”拆开包装，急得不能再等 | the moment the present came she tore it open | 小心翼翼
千姿百态/1 | 公园里的菊花“美极了”，写的是花的姿态多种多样 | chrysanthemums "so beautiful": in all shapes
千姿百态/2 | “有的像马，有的像羊”，白云的样子多种多样 | "some like horses, some like sheep": clouds in all shapes
哄堂大笑/1 | “讲了一个笑话，引得全班”，全班一起大笑 | a joke that set the whole class laughing
哄堂大笑/2 | 小猴子学人走路，“逗得大家”同时大笑 | a monkey walking like a person had everyone roaring
依依不舍/1 | “毕业那天”“告别了老师”，舍不得离开 | graduation day, saying goodbye to the teacher
依依不舍/2 | “假期结束了”“离开了外婆家”，舍不得走 | the holiday over, leaving grandmother's house reluctantly
目不转睛/1 | 小猫“盯着”金鱼，眼睛一动不动 | the cat staring at the goldfish without moving its eyes
目不转睛/2 | 观众“看着台上的魔术表演”，眼睛一动不动 | the audience watching the magic with fixed eyes
井井有条/1 | “书桌收拾得”，说的是摆放整齐不乱 | the desk tidied: in perfect order
井井有条/2 | 把家里的事“安排得”，说的是条理分明 | household matters arranged in good order
鸦雀无声/1 | “考试开始了，教室里”，非常安静 | when the exam began the room fell silent
鸦雀无声/2 | “刚才还吵吵闹闹”“立刻”，一下子变得非常安静 | a noisy room went instantly silent
一本正经/1 | 弟弟说出“我长大要当科学家”这样郑重的话，态度庄重认真 | a little boy announcing he will be a scientist, with a solemn air
一本正经/2 | “讲着笑话，自己却一点也不笑”，样子很认真 | telling jokes without a smile: with a straight face
和颜悦色/1 | 老师“总是……跟我们说话”，脸色和蔼，态度可亲 | the teacher always speaks to us kindly | 一本正经
和颜悦色/2 | 店主“招呼每一位客人”，脸色和蔼，态度亲切 | a shopkeeper greeting every customer pleasantly
东张西望/1 | “好像在找什么人”，所以这里看看，那里瞧瞧 | "as if looking for someone": looking this way and that
东张西望/2 | “上课时不要……要认真听讲”，与认真听讲相反的是到处看 | the opposite of attending in class: glancing around
无精打采/1 | “昨晚没睡好”，今天精神不振 | slept badly, so listless today
无精打采/2 | “输了比赛”，队员们走出球场时提不起劲 | after losing, the players trudge off listlessly
理直气壮/1 | “我没有做错，所以”说出真相，理由充分，有气势 | "I did nothing wrong, so": spoken boldly, knowing he is right
理直气壮/2 | “这本书是我先借的”，有充分理由，回答很有气势 | "I borrowed this book first": a reply bold with right on its side | 一本正经
七嘴八舌/1 | “同学们……讨论着”，人多话多，你一言我一语 | the class discussing all at once
七嘴八舌/2 | “谁也听不清谁在说什么”，大家一齐说话 | "no one could hear anyone": everyone talking at once
摇头晃脑/1 | 背古诗“样子十分得意”，脑袋摇来摇去 | reciting a poem very pleased with himself, head swaying
摇头晃脑/2 | 小狗“听到音乐，也跟着……起来”，脑袋跟着摇 | a puppy swaying its head to the music | 手舞足蹈
手舞足蹈/1 | “高兴得”，说的是高兴到手脚都动起来 | so happy his hands and feet danced | 摇头晃脑
手舞足蹈/2 | “乐得”，高兴到了极点，手舞脚跳 | so delighted she danced for joy | 摇头晃脑
不知不觉/1 | “边走边聊……就到了家门口”，没有觉察路走了多远 | chatting as they walked, home before they noticed
不知不觉/2 | “看书看入了迷……天已经黑了”，没有觉察到天黑 | lost in the book, not noticing night fall
栩栩如生/1 | 画上的小鸟“好像要飞出来”，逼真得像活的 | a painted bird "about to fly out": lifelike
栩栩如生/2 | 写的是“他捏的泥人”，艺术形象像活的一样 | his clay figures are lifelike
欣欣向荣/1 | “春天来了，田野里”，草木长得茂盛 | spring in the fields: plants thriving | 焕然一新
欣欣向荣/2 | “家乡的各项事业”，蓬勃发展 | the hometown's undertakings flourishing
焕然一新/1 | “打扫之后，教室”，面貌变得崭新 | after cleaning the classroom looked brand new
焕然一新/2 | “粉刷过的老房子”，有了崭新的面貌 | the old house, repainted, looks brand new
半途而废/1 | “要坚持到底，不能”，与坚持到底相反的是做到一半就停 | the opposite of "persevere to the end": giving up halfway
半途而废/2 | “一本画册也没画完”，每次都没做完就停下 | "never finished one sketchbook": always stopping halfway
一丝不苟/1 | “每个零件都要检查好几遍”，连细微的地方也不马虎 | checking each part many times: meticulous
一丝不苟/2 | “字写得工工整整”，写作业认真不马虎 | neat characters: homework done meticulously
画龙点睛/1 | “文章最后一句话起到了……的作用”，在关键处点明要旨 | the last sentence of an essay making its point vivid
画龙点睛/2 | 标题“一下子说出了全文的意思”，在关键处点明要旨 | a title that sums up the whole text at a stroke
守株待兔/1 | “想考出好成绩就得努力”，与努力相反的是空等不劳而获 | the opposite of working for results: waiting for luck
守株待兔/2 | “整天等着天上掉馅饼”，妄想不劳而获 | waiting all day for pies from the sky
亡羊补牢/1 | “没考好，赶紧找出错的原因”“为时不晚”，出了问题后补救 | after a bad test, finding the cause: never too late to mend
亡羊补牢/2 | “车被偷了以后，他才装上新锁”，出了事再补救 | fitting a lock after the bike was stolen
狐假虎威/1 | “仗着哥哥是班长”，依仗别人的势力欺压人 | throwing his weight around because his brother is monitor
狐假虎威/2 | 小管家仗着主人“对村民大声吆喝”，借别人的威风欺压人 | a steward bullying villagers on his master's authority
掩耳盗铃/1 | “把错题藏起来不让妈妈看”，错题还在，是自己骗自己 | hiding mistakes from mother: fooling oneself
掩耳盗铃/2 | “以为不看体重秤就不会胖”，自己骗自己 | thinking not weighing yourself keeps you thin
拔苗助长/1 | “让刚学走路的孩子去跑步”，违反成长的规律，急于求成 | making a toddler run: forcing growth
拔苗助长/2 | “要一步一步来，不能”，与一步一步相反的是急于求成 | the opposite of step by step: rushing nature
坐井观天/1 | “只读课本不读别的书”“见识太少”，眼界狭小 | reading only textbooks, seeing little: a frog in a well
坐井观天/2 | “要多出去走走，不要”，与多走多看相反的是眼界狭小 | the opposite of getting out and seeing the world
自相矛盾/1 | “一会儿说去，一会儿说不去”，自己的话前后抵触 | saying he will go, then not: contradicting himself
自相矛盾/2 | “前面说天晴，后面又说下大雨”，文章前后抵触 | sunny at the start, pouring later: self-contradictory
叶公好龙/1 | “说喜欢小动物，可小狗一靠近就躲开”，嘴上爱好，实际并不爱 | loving animals in word but shrinking from a puppy
叶公好龙/2 | “嘴上说爱读书，却从不翻开书”，口头爱好，实际不爱 | claiming to love books but never opening one
南辕北辙/1 | “想减肥却天天吃零食”，行动和目的相反 | wanting to slim but snacking daily
南辕北辙/2 | “越努力离目标越远”，行动和目的相反 | the harder he tries, the further from the goal
刻舟求剑/1 | “情况已经变了，还用老办法”，不懂随情况变化 | circumstances changed, but the old method kept
刻舟求剑/2 | “用十年前的旧地图找新开的商店”，不知道情况已经变了 | a ten-year-old map to find a new shop
杞人忧天/1 | “天气预报说明天晴，你却担心下冰雹”，没有根据的忧虑 | forecast sunny yet fearing hail: needless worry
杞人忧天/2 | “这座桥结实得很”，所以担心是不必要的 | "the bridge is very solid": the worry is groundless
滥竽充数/1 | “根本不会唱歌，却站在合唱队里”，没有本领混在里面充数 | cannot sing yet stands in the choir
滥竽充数/2 | “要学到真本领，不能”，与真本领相反的是没本领混充 | the opposite of real skill: making up the numbers
惊弓之鸟/1 | 小偷“听到脚步声就逃跑了”，一点动静就非常害怕 | the thief fleeing at a footstep
惊弓之鸟/2 | “被狗咬过一次后”“见到狗就躲”，受过惊吓后特别害怕 | bitten once, now shying from every dog
一鸣惊人/1 | “平时不声不响，这次比赛却……得了第一名”，一下子做出惊人的成绩 | quiet until now, then first place
一鸣惊人/2 | 新作家“的第一本书就”，一出手就成绩惊人 | a new writer's first book a sensation
胸有成竹/1 | “复习得很充分，走进考场时”，心里早有把握 | well prepared, entering the exam confident
胸有成竹/2 | “这场比赛怎么打，教练早已”，事前已有通盘考虑 | the coach had the game planned beforehand
三心二意/1 | “不能……要一心一意”，与一心一意相反的是意志不专一 | the opposite of "single-minded"
三心二意/2 | “一会儿捉蝴蝶，一会儿捉蜻蜓”，心思不专一 | chasing butterflies, then dragonflies: half-hearted
聚精会神/1 | 同学们“听老师讲故事”，注意力高度集中 | the class listening with rapt attention
聚精会神/2 | 爷爷“戴着老花镜”看报纸，注意力高度集中 | grandfather in his glasses absorbed in the paper
鸟语花香/1 | “春天的公园里”“美不胜收”，鸟叫花开的美好景象 | a spring park: birdsong and flowers
鸟语花香/2 | “清晨的山谷”“空气格外清新”，鸟叫好听，花开喷香 | a valley at dawn: birdsong and scent
人山人海/1 | “国庆节的广场上”“热闹极了”，人聚集得非常多 | the square on National Day: crowds everywhere
人山人海/2 | “我们挤都挤不进去”，人非常多 | "we could not squeeze in": a sea of people
夜以继日/1 | “为了早日修好大桥”，白天黑夜不停地工作 | to finish the bridge sooner: working day and night | 聚精会神
夜以继日/2 | 科学家们做实验“终于成功了”，日夜加紧工作 | scientists experimenting day and night until success | 聚精会神
举世闻名/1 | 横线修饰“长城”这座古代建筑，全世界都知道 | the Great Wall: world famous
举世闻名/2 | 横线修饰“科学家”，名气大到全世界都知道 | a world-famous scientist
刻不容缓/1 | “大火正在蔓延”，救火一刻也不能拖延 | the fire spreading: no time to lose
刻不容缓/2 | “病人伤得很重”，送医院一刻也不能拖 | badly hurt: hospital at once
一举两得/1 | “既能锻炼身体，又能节省车费”，一件事两方面好处 | exercise and saved fares: two birds with one stone
一举两得/2 | “既陪了奶奶，又练了朗读”，一件事两种好处 | keeping grandmother company and practising reading
百发百中/1 | 射击运动员“赢得了金牌”，每次都命中 | a marksman who won gold: never missing
百发百中/2 | 投篮被叫作“神投手”，每投必中 | called a sharpshooter: never misses a basket
不约而同/1 | “大家……鼓起掌来”，没有约定却一起做 | everyone clapping at once without arranging it | 喜出望外
不约而同/2 | “我和同桌……选了同一本书”，事先没约好却一样 | my desk-mate and I chose the same book unplanned
喜出望外/1 | “收到远方朋友寄来的礼物”，意想不到的喜事 | an unexpected present from far away
喜出望外/2 | “听说自己被选上了”，出乎意料的喜事 | learning she had been chosen: overjoyed at the surprise
记忆犹新/1 | 第一次登台的情景“我至今”，还记得很清楚 | the first time on stage still vivid
记忆犹新/2 | “虽然过去好几年了，大家依然”，记得很清楚 | years later, still fresh in memory
若无其事/1 | “打碎了花瓶，他却……走开了”，像没那回事一样 | broke a vase and walked off as if nothing happened
若无其事/2 | “突如其来的提问”“从容作答”，沉着得像没事一样 | a sudden question answered calmly
斩钉截铁/1 | “不管别人怎么劝”“不去就是不去”，说话坚决果断 | "no means no": firm and decisive
斩钉截铁/2 | “面对诱惑”“拒绝了”，坚决毫不犹豫 | refusing temptation without hesitation
自告奋勇/1 | “教室的灯坏了，班长”主动去请电工，主动承担 | the monitor volunteering to fetch the electrician
自告奋勇/2 | “没人愿意打扫厕所”，小明主动站出来承担 | no one would clean the toilets, so he volunteered
不可思议/1 | 蚂蚁“能搬动比自己重几十倍的东西”，难以想象 | ants lifting dozens of times their weight: unbelievable
不可思议/2 | “把一只鸽子变没了”，难以想象，难以理解 | a dove vanishing: inconceivable | 莫名其妙
层出不穷/1 | “新的电子产品”，接连出现，没有穷尽 | new gadgets appearing one after another
层出不穷/2 | 作家的“新作品”，一部接一部不断出现 | new works coming out one after another
精益求精/1 | 老工匠“对每一件作品都”，已经好了还要更好 | a master craftsman perfecting every piece
精益求精/2 | “不放过一点误差”，好了还求更好 | not letting the slightest error pass
莫名其妙/1 | “他突然生气了”，大家不明白为什么 | he got angry out of nowhere: baffling | 不可思议
莫名其妙/2 | 桌上“……地多了一封信”，不知道从哪来，让人不明白 | a letter appeared on the desk, no one knew how
迫在眉睫/1 | “考试”“都在抓紧复习”，事情临近眼前 | the exam close at hand, all revising hard
迫在眉睫/2 | “台风”“赶紧把船开回港口”，事情临近十分紧迫 | a typhoon imminent, boats hurrying home
全力以赴/1 | “为了赢得比赛，队员们”，把全部力量投进去 | to win, the team gave everything
全力以赴/2 | “无论做什么事，他都”，把全部力量投入 | whatever he does, he gives it all he has | 精益求精
美不胜收/1 | “红叶满山”，美景多得看不过来 | hills covered in red leaves: too much beauty to take in
美不胜收/2 | 博物馆里的“展品”，好东西多得一时看不过来 | so many fine exhibits one cannot take them all in
别出心裁/1 | 手抄报“得了一等奖”，设计与众不同 | a hand-made poster that won first prize for its originality
别出心裁/2 | 班会“用演课本剧的方式来总结”，构思与众不同 | a class meeting summed up by acting out the text: original
囫囵吞枣/1 | “要细细体会，不能”，与细细体会相反的是不加分析地读 | the opposite of savouring: swallowing whole
囫囵吞枣/2 | “只求快”“不懂意思”，不加分析地笼统接受 | reciting fast without understanding
废寝忘食/1 | “为了完成这项发明，他……地工作”，顾不上睡觉吃饭 | working on the invention, forgetting sleep and food
废寝忘食/2 | “读起小说来，常常”，入迷到忘了睡觉吃饭 | reading novels and forgetting meals and sleep
负荆请罪/1 | “知道自己错怪了同学”，第二天主动认错 | knowing he had wronged a classmate, he went to apologise
负荆请罪/2 | “廉颇”到“蔺相如家”，正是背着荆条请罪的故事 | Lian Po at Lin Xiangru's door: the story of carrying thorns
完璧归赵/1 | “借来的书，我一定”，要把原物完好地还回去 | a borrowed book returned intact
完璧归赵/2 | “这台相机用完后我会”，把原物完好归还 | the camera returned unharmed after use
卧薪尝胆/1 | “输掉比赛后”“第二年夺得了冠军”，刻苦自励，发愤图强 | after defeat, training hard to win next year
卧薪尝胆/2 | “越王勾践”“最终打败了吴国”，正是卧薪尝胆的故事 | King Goujian defeating Wu: the story itself
破釜沉舟/1 | “辞去工作专心创业”，下定决心不留后路 | quitting his job for his venture: burning his boats
破釜沉舟/2 | “项羽”“带领士兵渡河作战”，正是破釜沉舟的故事 | Xiang Yu crossing the river to fight: the story itself
纸上谈兵/1 | “光看游泳书不下水”，只空谈理论 | reading about swimming but never getting wet
纸上谈兵/2 | “讲起踢球头头是道，上了场却不会踢”，空谈不能实战 | talking football well but unable to play
毛遂自荐/1 | 学校招讲解员，“她……报了名”，自己推荐自己 | she signed herself up as a guide
毛遂自荐/2 | “班里选文艺委员，小李”，自己推荐自己 | Xiao Li put himself forward for the post
赞不绝口/1 | 客人“吃了妈妈做的菜”，不住口地称赞 | guests who tasted mother's cooking praised it endlessly
赞不绝口/2 | “看了他的画，老师”，说的是老师不住地称赞 | the teacher, seeing his painting, could not stop praising it
惟妙惟肖/1 | “模仿老师讲课，学得”，模仿得非常逼真 | imitating the teacher to the life
惟妙惟肖/2 | 泥塑把“神态刻画得”，刻画得非常逼真 | a clay figure catching the old man's look exactly
波澜壮阔/1 | 横线修饰“大海”，后面“我心潮澎湃”，大海的气势雄壮 | the sea that stirred me: vast and surging
波澜壮阔/2 | 横线修饰“革命斗争”，规模宏大 | a revolutionary struggle on a grand scale
引人入胜/1 | 童话书的“情节”，特别吸引人 | a fairy tale's plot that draws you in
引人入胜/2 | “九寨沟的风景”，特别吸引人 | Jiuzhaigou's scenery: enchanting
千钧一发/1 | “消防员冲进火海救出了孩子”，那一刻万分危急 | a firefighter rescuing a child at the critical moment
千钧一发/2 | “车子快要撞上来”，情况万分危急 | a car about to hit: a hair's breadth from disaster
大名鼎鼎/1 | 横线修饰“数学家华罗庚”，名气很大 | the famous mathematician Hua Luogeng
大名鼎鼎/2 | “已经开了一百多年”的老字号，名气很大 | a century-old shop of great renown
不屈不挠/1 | “面对困难”“终于取得了成功”，不屈服 | facing difficulty without yielding, then succeeding
不屈不挠/2 | “先辈们……的精神”，在困难压力前不屈服 | the unyielding spirit of those before us
闻鸡起舞/1 | “每天”“坚持晨读”，一早起来奋发 | up early every day to read: rising at cockcrow
闻鸡起舞/2 | “祖逖……的故事”，正是闻鸡起舞的典故 | the story of Zu Ti, who rose at cockcrow to practise
应接不暇/1 | 节日里营业员“忙得”，人太多接待不过来 | shop assistants on a holiday, too busy to keep up
应接不暇/2 | 山路两旁“美景”太多，看都看不过来 | so much scenery along the path one cannot take it all in
豁然开朗/1 | “穿过山洞，眼前”出现村庄，由幽暗突然变得开阔明亮 | through the cave, the view suddenly opens
豁然开朗/2 | “听了爸爸的话，我心里”，一下子明白了 | after father's words, everything became clear
悠然自得/1 | 爷爷“坐在树下……喝着茶”，悠闲舒适 | grandfather drinking tea under a tree, at ease
悠然自得/2 | “几只鸭子……游着”，悠闲舒适的样子 | ducks swimming leisurely on the lake
震耳欲聋/1 | 横线修饰“鞭炮声”，声音大得耳朵都快震聋了 | deafening firecrackers
震耳欲聋/2 | “雷声”“吓得小狗钻到了床底下”，声音极大 | thunder so loud the dog hid under the bed
截然不同/1 | “长得一样，性格却”，转折说明性格毫无共同之处 | looking alike "but" utterly different in character
截然不同/2 | 拿“南方和北方的冬天”相比，两者完全不同 | winters of south and north, completely unlike
古往今来/1 | “许多诗人都写过”，说的是从古到今 | poets through the ages writing of the moon
古往今来/2 | 长城“见证了……的历史变迁”，从古到今的变迁 | the Wall has witnessed change from past to present
漫不经心/1 | “错了好多题”，因为做作业随随便便 | many mistakes from careless homework
漫不经心/2 | “听到批评，他还是一副……的样子”，不放在心上 | criticised, he still looked as if he did not care | 悠然自得
名副其实/1 | “每次考试都是第一”，学习尖子的名声和实际相符 | always first: a top student in fact as in name
名副其实/2 | “四季如春”，与“春城”这个名称相符 | spring all year: truly the "Spring City"
不言而喻/1 | “锻炼身体的好处”，不用说就明白 | the benefit of exercise goes without saying
不言而喻/2 | “大家心里都清楚”，不用说出来就明白 | everyone knew why: it needed no saying
举一反三/1 | “学会一道题，就能解一类题”，从一件推知许多 | from one problem to a whole type: inferring the rest
举一反三/2 | 老师夸她“善于”，说的是能从一件事推知其他 | praised for drawing many lessons from one
恰如其分/1 | “对这件事的评价”，说得正合分寸 | an assessment exactly right
恰如其分/2 | “这个比喻用得”，用得正合分寸 | a simile used just right
相得益彰/1 | “红花和绿叶”互相衬托，各自更显出来 | red flowers and green leaves set each other off
相得益彰/2 | “音乐和动人的画面”互相配合，效果更好 | music and pictures enhancing each other
众志成城/1 | “全村人”“保住了大堤”，万众一心像城墙一样坚固 | the whole village united to save the dyke
众志成城/2 | “就没有克服不了的困难”，大家团结一心 | united, no difficulty is too great
博大精深/1 | “中华文化”，思想学识广博高深 | Chinese culture: broad and profound
博大精深/2 | 老教授的“学问”，广博高深 | the professor's learning: broad and deep
再接再厉/1 | “取得更好的成绩”，继续努力 | keep going to do even better
再接再厉/2 | “赢了第一场，还要”，再加一把劲 | won the first round, must press on
不知所措/1 | “突然被老师点名，他一时”，不知道怎么办 | suddenly called on, he was at a loss
不知所措/2 | “面对突如其来的问题”，不知该怎么办 | a sudden question left her at a loss
鞠躬尽瘁/1 | “周总理为国家和人民”，贡献出全部精力 | Premier Zhou gave his all for the country
鞠躬尽瘁/2 | 老校长“一辈子扎根山村”，为学校贡献全部精力 | the old head gave his life to the village school
历历在目/1 | 小时候的情景“至今”，清清楚楚出现在眼前 | a childhood scene still vivid
历历在目/2 | “站在山顶，远处的村庄和田野”，远方景物清楚可见 | from the summit, villages and fields clearly in view
流连忘返/1 | “西湖的美景让游人”，留恋得忘了回去 | West Lake so lovely visitors forget to leave
流连忘返/2 | 孩子们在游乐园“玩得”，舍不得回去 | children too happy in the park to go home
走马观花/1 | “时间太紧，我们只能”，粗略地看看 | short of time, we could only glance round
走马观花/2 | “读书不能……要细细品味”，与细细品味相反的是粗略地看 | the opposite of savouring a book: skimming
熙熙攘攘/1 | “到处都是买年货的人”，人来人往很热闹 | streets full of New Year shoppers: bustling
熙熙攘攘/2 | 车站里“挤满了回家过年的旅客”，人来人往 | a station packed with travellers
毛骨悚然/1 | “深夜里传来一声怪叫”，让人非常害怕 | a strange cry at midnight: hair-raising
毛骨悚然/2 | “恐怖故事听得人”，非常害怕 | a horror story that makes the flesh creep
精疲力竭/1 | “爬到山顶，大家都”，体力用尽 | at the top, everyone was exhausted
精疲力竭/2 | “跑完全程”“坐在地上”，精神体力耗尽 | after the whole race, slumped on the ground
鹤立鸡群/1 | “个子高，站在同学中间”，显得很突出 | tall among classmates: standing out
鹤立鸡群/2 | 作文“在全班”“常被当作范文”，才能突出 | her essays stand out in the class
世外桃源/1 | “风景优美，与世无争，宛如”，不受外界影响的美好地方 | a lovely village apart from the world: a Shangri-La
世外桃源/2 | “陶渊明笔下的”，正是桃花源 | Tao Yuanming's Peach Blossom Spring
天衣无缝/1 | “他们配合得”“赢得了比赛”，周密完善找不出毛病 | teamwork so seamless they won
天衣无缝/2 | “这个计划安排得”，周密得找不出毛病 | a flawless plan
一筹莫展/1 | “面对这道难题，大家都”，一点办法也想不出 | faced with the problem, no one knew what to do
一筹莫展/2 | “钥匙锁在屋里了”，一点办法也没有 | keys locked inside: at our wits' end
诲人不倦/1 | “深受同学们爱戴”的老师，教导人耐心不厌倦 | a tireless teacher, much loved
诲人不倦/2 | “孔子学而不厌”，与之并列的是教人不倦 | Confucius never tired of learning nor of teaching
炉火纯青/1 | 书法“练到了……的地步”，纯熟完美 | calligraphy brought to perfection
炉火纯青/2 | “老师傅的厨艺”，达到纯熟完美 | the master's cooking at its peak
雪中送炭/1 | “在我最困难的时候借给我钱”，急需时帮助 | lending money when I needed it most
雪中送炭/2 | “地震后”送来的物资，灾区急需的帮助 | relief goods after the earthquake: help in time of need
锦上添花/1 | “已经写得很好了，再配上插图”，好上加好 | already good, then illustrations added
锦上添花/2 | “本来成绩就好，又获得了奖学金”，好上加好 | good grades and a scholarship too
车水马龙/1 | “节日的大街上”“热闹非凡”，车马来往不断 | a festive street full of traffic
车水马龙/2 | “以前很冷清，现在已经”，来往的车很多 | once quiet, now busy with traffic
不耻下问/1 | “虽然是教授，却……常向学生请教”，不以问学识少的人为耻 | a professor who asks his students
不耻下问/2 | “不懂就问”，不以向人请教为耻 | "ask when you do not know": unashamed to ask
学而不厌/1 | “八十岁了还在学电脑”，学习不满足 | learning computers at eighty: never tired of learning
学而不厌/2 | “读书永远不嫌多”，学习总不满足 | never enough reading: insatiable for learning
前赴后继/1 | “为了民族解放，无数先烈”，前面倒下后面跟上 | martyrs following one another for liberation
前赴后继/2 | “救灾的队伍……奔赴灾区”，一批接一批向前 | rescue teams surging to the disaster wave on wave
循序渐进/1 | “不能急于求成”，与之相反的是一步步提高 | the opposite of rushing: step by step
循序渐进/2 | “一下子跑太远会受伤”，训练要一步步加 | running too far at once hurts: build up gradually
当机立断/1 | “看到孩子落水”“跳进河里救人”，立刻作决定 | seeing a child fall in, he decided at once
当机立断/2 | “情况紧急”“命令大家撤离”，抓住时机立刻决定 | an emergency, the captain decided on the spot
不卑不亢/1 | “面对外国记者的提问”，回答得既不自卑也不高傲 | answering foreign journalists with dignity
不卑不亢/2 | “大家都很尊重她”，待人得体 | her poised manner wins respect
见义勇为/1 | “抓住了小偷，受到了表扬”，勇敢地做正义的事 | catching a thief: acting bravely for what is right
见义勇为/2 | “……的好人好事”，看到正义的事勇敢去做 | deeds of courage for justice
承前启后/1 | “这一段在文章中起着……的作用”，承接上文，引出下文 | a paragraph that links what comes before and after
承前启后/2 | “这一代人担负着……的使命”，承接前人，开创后来 | a generation carrying on and opening the way
心旷神怡/1 | “登上山顶，极目远望”，心情舒畅 | gazing from the summit: carefree and happy
心旷神怡/2 | “漫步在湖边，清风拂面”，心情舒畅 | a breeze by the lake: refreshed
人声鼎沸/1 | “集市上”“热闹非凡”，人声喧闹 | a market noisy with voices
人声鼎沸/2 | “比赛开始前，体育馆里早已”，人声喧闹 | before the game the arena already roaring
混为一谈/1 | “节俭和小气是两回事，不能”，不能把不同的看成一样 | thrift and meanness are different: do not lump them together
混为一谈/2 | 把“自信和自负”当作一样，是把不同的混在一起 | confusing confidence with conceit
咄咄逼人/1 | “说话……让人很不舒服”，气势汹汹 | aggressive speech that makes people uncomfortable
咄咄逼人/2 | 横线修饰“质问”，“她始终保持冷静”，对方气势逼人 | an aggressive questioning she met calmly
花团锦簇/1 | “到处摆满了鲜花”，五彩缤纷的景象 | flowers everywhere: a riot of colour
花团锦簇/2 | “春天的公园”，花开得五彩缤纷 | a spring park bright with blossom | 人声鼎沸
咬文嚼字/1 | “要讲究用词，但也不必”，不必过分斟酌字句 | choose words well, but do not split hairs
咬文嚼字/2 | “听起来有些迂腐”，说话死抠字眼 | pedantic speech that picks at words
不求甚解/1 | “要深入思考，不能”，与深入相反的是只懂大概 | the opposite of thinking deeply: skimming the surface
不求甚解/2 | “看书走马观花”，只求懂个大概 | skimming books, content with a rough idea
油然而生/1 | “看着国旗冉冉升起，一种自豪感”，自然产生 | watching the flag rise, pride welling up
油然而生/2 | “读完这封信，敬佩之情”，自然而然产生 | after the letter, admiration arose of itself
大庭广众/1 | “大声喧哗，是不文明的”，指在人多的公开场合 | making noise in public is rude
大庭广众/2 | “第一次在……面前演讲，有些紧张”，面对很多人 | nervous speaking before a crowd for the first time
诚惶诚恐/1 | “走进了经理的办公室”，小心谨慎以至于惶恐 | entering the manager's office in trepidation
诚惶诚恐/2 | “生怕做不好”，惶恐不安 | given a big task, afraid of failing
一气呵成/1 | 文章“读来十分流畅”，从头到尾不间断 | an essay that reads smoothly in one breath
一气呵成/2 | “挥笔疾书”写完一幅字，中间不停顿 | brushing a whole scroll in one go
抑扬顿挫/1 | “朗读课文时”“十分动听”，声音高低起伏有节奏 | reading aloud with a lovely rise and fall
抑扬顿挫/2 | 演讲“富有感染力”，声音高低有致 | a speech with stirring cadences
忍俊不禁/1 | 小猫“笨拙地追着自己的尾巴”，大家忍不住笑 | a kitten chasing its tail: we could not help laughing
忍俊不禁/2 | “滑稽的表情令人”，忍不住要笑 | a comic face that makes people laugh
不可名状/1 | 横线修饰“激动”，激动到说不出来 | an indescribable excitement on the Great Wall
不可名状/2 | 横线修饰“恐惧”，无法用语言形容 | a fear beyond words
盛气凌人/1 | “仗着自己是老员工，对新人”，用骄横的气势压人 | an old hand lording it over newcomers
盛气凌人/2 | “有理不在声高，用不着”，用不着靠气势压人 | being right needs no bullying tone
潜移默化/1 | “父母的言行对孩子有……的影响”，不知不觉起变化 | parents' influence that works unnoticed
潜移默化/2 | 好书“在……中改变着我们”，不知不觉中改变 | good books changing us imperceptibly
庸人自扰/1 | “事情还没发生就整天发愁”，本来没事，自己瞎着急 | worrying all day over what has not happened: needless fretting
庸人自扰/2 | “他根本没有生你的气”，本来没有问题，是自己找麻烦 | "he was not angry with you at all": a trouble of your own making
不以为然/1 | “对他的说法，大家都”，不认为是对的 | everyone disagreed with what he said
不以为然/2 | “摇了摇头”，表示不同意 | shaking his head: not agreeing
骇人听闻/1 | 横线修饰“交通事故”，使人听了非常吃惊 | a shocking traffic accident
骇人听闻/2 | 报纸“揭露了”的“案件”，叫人听了震惊 | a shocking case exposed by the paper
目空一切/1 | “取得了一点成绩就……谁也看不起”，骄傲自大 | a little success and he looks down on everyone
目空一切/2 | “……的人终究会摔跟头”，骄傲自大的人 | the arrogant fall in the end
坚持不懈/1 | “只要……再难的问题也能解决”，坚持到底不松懈 | persevere and any problem can be solved
坚持不懈/2 | 横线修饰“努力”，“终于攻克了难关”，一点不松懈 | unflagging effort that finally won through
各抒己见/1 | “讨论会上，同学们”“气氛热烈”，各自发表意见 | everyone giving their view at the discussion
各抒己见/2 | “大家……争论不休”，各说各的意见 | all speaking their minds, arguing on
如释重负/1 | “考完最后一门”“长出了一口气”，紧张过后轻松 | the last exam done, a long breath of relief
如释重负/2 | “听到孩子平安的消息”，紧张心情过去后的轻松 | news the child was safe: a weight off her mind
无可奈何/1 | “雨一直下个不停，我们只好”，没有办法 | the rain would not stop, so with no choice we cancelled
无可奈何/2 | “面对弟弟的哭闹，妈妈也”，没有办法 | mother helpless before the crying child
叹为观止/1 | 杂技“高超的表演令观众”，赞美好到极点 | acrobatics so superb the audience marvelled
叹为观止/2 | “故宫的建筑艺术令人”，好到了极点 | the Forbidden City's architecture: the height of art
人迹罕至/1 | 原始森林“保留着许多珍稀植物”，人很少到达 | a virgin forest keeping rare plants: rarely visited
人迹罕至/2 | 横线修饰“沙漠腹地”，人很少到的地方 | the remote heart of the desert
明察秋毫/1 | “任何疑点都逃不过他的眼睛”，能看清细微的事物 | no doubt escapes the judge's eye
明察秋毫/2 | “从一根头发中找到了线索”，目光敏锐 | a clue found in a single hair
粗制滥造/1 | “很快就出现了质量问题”，做得马虎不讲质量 | products soon failing: shoddily made
粗制滥造/2 | “写文章不能……要反复修改”，与反复修改相反的是马虎草率 | the opposite of careful revision: slapdash writing
兴致勃勃/1 | “周末”去郊外爬山，兴头很足 | off to climb hills at the weekend, full of zest
兴致勃勃/2 | 爷爷“讲起了年轻时的故事”，兴头很足 | grandfather keen to tell stories of his youth
风尘仆仆/1 | “从外地赶回来过年”，旅途奔波劳累 | father travel-worn, hurrying home for New Year
风尘仆仆/2 | 横线修饰“旅客”，“走出了车站”，旅途辛苦 | travel-weary passengers leaving the station
引经据典/1 | “显得很有学问”，说话引用经典 | quoting the classics, he sounds learned
引经据典/2 | 文章“论据充分”，引用典籍作依据 | an essay that cites authorities, well argued
别具一格/1 | 建筑“造型”“吸引了许多游客”，风格独特 | a building of distinctive design
别具一格/2 | 他的散文“读来清新自然”，风格独特 | his essays have a style of their own
正襟危坐/1 | “考场上”“等待发卷”，端正严肃地坐着 | sitting up straight in the exam hall
正襟危坐/2 | “平时爱说笑……今天却”“一言不发”，严肃拘谨地坐着 | the joker sitting stiffly silent today
销声匿迹/1 | 传染病“在当地已经……多年”，不再出现 | a disease gone for years
销声匿迹/2 | 歌手“红了一阵子，后来就”，不再露面 | a singer famous a while, then never heard of
深恶痛绝/1 | 对“贪污腐败行为”，厌恶痛恨到极点 | utter loathing of corruption
深恶痛绝/2 | 对“弄虚作假的人”，痛恨到极点 | hating cheats intensely
张冠李戴/1 | “明明是李白写的，你却说是杜甫写的”，弄错了对象 | Li Bai's poem credited to Du Fu: a mix-up
张冠李戴/2 | “引用名言时要查证出处”，以免弄错是谁说的 | check a quotation's source so as not to misattribute it
大相径庭/1 | 两人“对这件事的看法”，相差很远 | two views worlds apart
大相径庭/2 | “实验结果与预想”，大不相同 | results far from what was expected
黯然失色/1 | “和专业运动员相比”，我们的表演远远不如 | beside professionals our show pales
黯然失色/2 | “在这幅名画面前，其他作品都”，相比之下远远不如 | other works pale before the masterpiece
鞭长莫及/1 | “父母远在国外”，力量够不着管孩子的学习 | parents abroad, too far to help with schoolwork
鞭长莫及/2 | “总部离分厂太远”，管理力量达不到 | head office too far to manage the branch
置之不理/1 | “对群众的意见，不能”，不能放在一边不理 | the public's views must not be ignored
置之不理/2 | “对我的劝告”“结果吃了大亏”，不理不睬 | ignoring my advice, he paid dearly
尽职尽责/1 | 老护士“几十年如一日”，尽到职责 | a nurse doing her duty for decades
尽职尽责/2 | 消防员“随时准备出发”，尽到职务和责任 | firefighters always ready: conscientious
无可厚非/1 | “想多挣点钱养家，这本身”，不能过分指责 | wanting to earn more for the family is understandable
无可厚非/2 | “年轻人追求时尚”，可以谅解 | the young following fashion: no great fault
当之无愧/1 | 横线修饰“学习标兵”，完全称得上 | a model student in every right
当之无愧/2 | “获此殊荣”，完全称得上，毫无愧色 | the scientist fully deserves the honour
首当其冲/1 | “洪水来了，河边的村庄”，最先遭灾 | when the flood comes the riverside village is hit first
首当其冲/2 | “物价上涨，低收入家庭”，最先受害 | rising prices hit the poorest first
不翼而飞/1 | “刚放在桌上的钱包竟然”，忽然丢失 | a wallet just put down suddenly gone
不翼而飞/2 | “锁在柜子里的文件”“大家都很着急”，忽然不见了 | locked-up papers vanished
莫衷一是/1 | “大家说法不一”，得不出一致的结论 | opinions differ, no agreement
莫衷一是/2 | “专家们的意见”“一时难以决定”，意见分歧 | experts divided, no decision
随声附和/1 | “他没有主见，总是”，别人说什么跟着说什么 | no mind of his own, always echoing others
随声附和/2 | “要独立思考，不能”，与独立思考相反的是跟着别人说 | the opposite of thinking for oneself: parroting
发人深省/1 | 故事“虽然简单，却”，启发人深刻思考 | a simple story that gives food for thought
发人深省/2 | “让我们重新审视了自己”，启发人醒悟 | his words made us look at ourselves anew
心悦诚服/1 | “他的解释合情合理，大家都”，真心服气 | a reasonable explanation that convinced everyone
心悦诚服/2 | “以理服人”，让学生真心诚意地服气 | persuading by reason, the pupil sincerely convinced
断章取义/1 | “引用别人的话要完整，不能”，不能只取一段一句 | quote in full, not out of context
断章取义/2 | “歪曲了作者的原意”，只孤立地取一句的意思 | quoting out of context, distorting the author
如出一辙/1 | “这两篇作文的写法”，非常相似 | two essays written exactly alike
如出一辙/2 | “两起事故的原因”，非常相似 | two accidents with the same cause
根深蒂固/1 | 落后的观念“在一些人头脑中”，牢固不易动摇 | backward ideas deeply rooted in some minds
根深蒂固/2 | “很难一下子改变”，基础牢固 | old habits deep-rooted and hard to change
自惭形秽/1 | “和那些优秀的同学相比”，因不如别人而惭愧 | beside the best pupils he felt inferior
自惭形秽/2 | “看到她精美的画作，我不禁”，因自己不如而惭愧 | her fine painting made me feel ashamed of mine
不可救药/1 | “不要以为犯了错的孩子就”，坏到无法挽救 | do not think a child who errs is beyond saving
不可救药/2 | “沉迷赌博，已经到了……的地步”，无法挽救 | lost to gambling, past saving
拾人牙慧/1 | “要有自己的见解，不要总是”，与自己见解相反的是拿别人的话当自己的 | have your own ideas, not borrowed phrases
拾人牙慧/2 | “毫无新意”，全是拾取别人的话 | his essay all borrowed words, nothing new
化险为夷/1 | “凭着丰富的经验，船长带领大家”，化危险为平安 | the captain's experience brought them safely through
化险为夷/2 | “多亏消防员及时赶到”，才转危为安 | the firefighters came in time and turned danger to safety
巧夺天工/1 | 盆景“经过匠人的精心设计”“宛如天然生成”，人工胜过天然 | man-made landscapes finer than nature
巧夺天工/2 | 玉雕“看不出一点人工雕琢的痕迹”，人工精巧胜过天然 | jade carving that hides the hand of man
琳琅满目/1 | “商店里的货物”，好东西很多 | a shop full of fine goods
琳琅满目/2 | “展品”“令人目不暇接”，美好的东西很多 | so many fine exhibits
浑然一体/1 | 亭子“与周围的山水”，完整不可分 | a pavilion at one with its landscape
浑然一体/2 | “结构严谨，前后”，完整不可分割 | a tightly built essay, all of a piece
眼花缭乱/1 | “杂技演员的表演让人看得”，看得迷乱 | acrobatics that dazzle the eye
眼花缭乱/2 | “商品种类太多，看得我”，看着纷繁而迷乱 | so many goods I was dazzled
金碧辉煌/1 | 大剧院“灯火通明”，装饰华丽光彩夺目 | a new theatre glittering with lights
金碧辉煌/2 | “琉璃瓦，在阳光下”，光彩夺目 | glazed roof tiles shining in the sun
恍如隔世/1 | “重回故乡，看到变化翻天覆地”，好像隔了一世 | home again, so changed it seemed another age
恍如隔世/2 | “再次见到失散多年的老友”，好像隔了一世 | meeting a long-lost friend: like another lifetime
肃然起敬/1 | “听了老英雄的事迹”，产生严肃敬仰的感情 | hearing of the hero's deeds, filled with respect
肃然起敬/2 | “白发苍苍的老教授仍在实验室工作”，令人敬仰 | the white-haired professor still at work: deep respect
无与伦比/1 | 长城是“世界上……的伟大建筑”，没有能比的 | the Great Wall without equal in the world
无与伦比/2 | “世界上很少有人能达到”，没有能相比的 | a pianist's skill few can match
呕心沥血/1 | 小说是作家“……十年写成的”，用尽心思 | a novel written over ten years of devoted toil
呕心沥血/2 | “为山区教育事业……奉献了一生”，用尽心血 | a lifetime poured into rural schools
一针见血/1 | 评语“指出了我作文的毛病”，直截了当切中要害 | comments that hit my essay's flaw squarely
一针见血/2 | “说到了问题的要害”，切中要害 | his speech went straight to the heart of it
居安思危/1 | “国家越是太平，越要”，安定时想到危险 | the more peaceful the country, the more to guard
居安思危/2 | “经营顺利时也要……早做准备”，安定时想到危险 | in good times, prepare for bad
标新立异/1 | “不愿走别人的老路”，提出新奇主张与众不同 | not wanting to tread the old path: striving to be different
标新立异/2 | “为了……而胡编乱造”，只为显得新奇与众不同 | inventing nonsense just to be different
无动于衷/1 | “看到别人遇到困难，我们不能”，不能毫无反应 | we must not stay indifferent to others' troubles
无动于衷/2 | “无论大家怎么劝，他都”，一点也不受触动 | no amount of persuasion moved him
完好无损/1 | “地震过后，这座古塔依然”，完整没有损坏 | after the quake the pagoda stood intact
完好无损/2 | 花瓶“包装得很好”，没有一点损坏 | a well-packed vase arriving undamaged
家喻户晓/1 | 《西游记》的故事“在中国”，家家户户都知道 | Journey to the West known in every home
家喻户晓/2 | “经过宣传”，垃圾分类知识人人都知道 | after the campaign, everyone knows how to sort waste
富丽堂皇/1 | “宫殿里装饰得”，宏伟豪华 | a palace splendidly decorated
富丽堂皇/2 | 酒店的“大厅”“令人惊叹”，宏伟豪华 | a hotel lobby of breathtaking splendour
持之以恒/1 | “每天都要练习”，长久坚持 | learning a language means practising daily
持之以恒/2 | “不能三天打鱼两天晒网”，与之相反的是长久坚持 | the opposite of fits and starts: keeping at it
开门见山/1 | “第一段就点明了中心”，直截了当 | the first paragraph states the point: straight to it
开门见山/2 | 一开口就说“我是来向你道歉的”，不拐弯抹角 | "I have come to apologise": straight to the point
墨守成规/1 | “时代在发展，我们不能”，不能守着老规矩不变 | times change: we must not cling to old rules
墨守成规/2 | “不敢有一点创新”，守着老规矩 | never daring to innovate: stuck in old ways
怒不可遏/1 | “听到侵略者的暴行”，愤怒得不能抑制 | hearing of the invaders' atrocities: uncontrollable anger
怒不可遏/2 | “看到有人欺负老人”“冲上去制止”，愤怒得忍不住 | seeing an old man bullied, he rushed in, furious
刻骨铭心/1 | “登山遇险的经历让我”，记忆深刻 | a climbing accident I will never forget
刻骨铭心/2 | “这份恩情”“一生不忘”，永远不忘 | a kindness engraved on his heart for life
轻而易举/1 | “这道题对他来说”，很容易 | this problem is easy for him
轻而易举/2 | “把箱子举过了头顶”，毫不费力 | lifting the box overhead with ease
唇亡齿寒/1 | “两国山水相连”“必须互相帮助”，利害相关 | neighbouring states whose fates are bound together
唇亡齿寒/2 | “上下游的城市”“要携手合作”，关系密切利害相关 | upstream and downstream cities sharing a fate
力挽狂澜/1 | “球队落后的关键时刻，他连进两球”，挽回危局 | two goals when behind: turning the tide
力挽狂澜/2 | “危急关头”“救了整个公司”，尽力挽回危局 | saving the company at the crisis
忍辱负重/1 | “为了完成任务”“默默坚持了多年”，忍受屈辱承担重任 | enduring humiliation for years to finish the task
忍辱负重/2 | “司马迁”“写成了《史记》”，正是忍辱完成重任 | Sima Qian bearing disgrace to write the Records
字斟句酌/1 | 声明“写得很慎重，每句话都”，一字一句仔细推敲 | a careful statement, every sentence weighed
字斟句酌/2 | “生怕说错一句话”，一字一句地推敲 | afraid of a wrong word, weighing each one
因地制宜/1 | “山区”“多种果树”，根据当地情况定办法 | fruit trees in the hills: suiting the land
因地制宜/2 | “各地”“发展有特色的产业”，根据各地情况 | each place building on what suits it
茅塞顿开/1 | “听了老师的点拨，我”，思想一下开窍 | the teacher's hint and suddenly I saw
茅塞顿开/2 | “读完这本书”“找到了解决问题的办法”，忽然明白 | after the book he suddenly saw the way
谈笑风生/1 | 老朋友在晚会上“十分开心”，谈话高兴有风趣 | old friends chatting merrily at a party
谈笑风生/2 | “面对记者”“一点也不紧张”，谈话轻松风趣 | easy and witty before the press
通宵达旦/1 | “为了赶完这份报告”，整夜工作到天亮 | working all night to finish the report
通宵达旦/2 | “除夕夜”“守岁”，整整一夜到天亮 | seeing the old year out till dawn
惊心动魄/1 | “观众的心都提到了嗓子眼”，震动很大 | a game that had hearts in mouths
惊心动魄/2 | 横线修饰“逃生经历”，惊险震撼 | a hair-raising escape
物是人非/1 | “看到熟悉的教学楼，却已”，东西还在，人已不同 | the old school building, but the people gone
物是人非/2 | “老屋还在，奶奶却已离去”，东西还是原来的，人已不在 | the house remains, grandmother gone
舍生取义/1 | “革命先烈们”，为正义牺牲生命 | martyrs giving their lives for justice
舍生取义/2 | 古人“……的精神”，为正义舍弃生命 | the ancients' readiness to die for what is right
抛砖引玉/1 | “我先谈谈自己的看法”，用自己的意见引出别人的高见 | I will start, to draw out better ideas
抛砖引玉/2 | “大家纷纷说出了好主意”，引出别人的高见 | his remarks prompted good ideas from all
防微杜渐/1 | “坏习惯”“及早纠正”，刚冒头时就制止 | correcting bad habits early
防微杜渐/2 | “预防近视”“从小注意”，在问题刚开始时防止 | preventing short sight from childhood
若有所思/1 | “他望着窗外”，好像在想什么 | gazing out of the window, lost in thought | 浮想联翩
若有所思/2 | “听完老师的话”“点了点头”，好像在思考 | nodding thoughtfully after the teacher spoke
不屑一顾/1 | “对别人的劝告”，认为不值得一看 | dismissing others' advice
不屑一顾/2 | “对小事”“结果在小事上栽了跟头”，轻视不看 | scorning small things, tripped up by them
相辅相成/1 | “学习和思考”，互相配合互相促进 | learning and thinking reinforce each other
相辅相成/2 | “经济发展和环境保护可以”，互相促进 | growth and conservation can go together
迫不得已/1 | “因为大雨，运动会……推迟了”，不得不这样 | rain forced the sports day to be postponed
迫不得已/2 | “才向别人借了钱”，迫于无奈 | borrowing money only because he had to
浮想联翩/1 | “望着满天繁星”，许多想象接连涌现 | starry sky and a flood of fancies | 若有所思
浮想联翩/2 | “仿佛回到了古代”，想象接连不断 | after the poem, his mind roamed to ancient times
不刊之论/1 | 论文“观点精辟，论证严密”，正确无可修改 | a sound paper that cannot be faulted
不刊之论/2 | 先贤的见解“后人奉为”，正确不可改的言论 | the sages' words held as unalterable truth
差强人意/1 | “发挥一般，成绩只能说”，大体上还能使人满意 | an average performance, just about passable
差强人意/2 | “新队员第一次上场”，表现大体令人满意 | a newcomer's first game: fairly satisfactory
长袖善舞/1 | “在商界”“关系都打点得妥妥当当”，善于钻营 | a skilled operator in business | 游刃有余
长袖善舞/2 | “这位商人”“没几年就……站稳了脚跟”，有手腕，善于钻营 | a merchant who made his way fast
万人空巷/1 | “冠军回到家乡”“街道两旁挤满了欢迎的人群”，欢迎的盛况 | the whole town out to greet the champion
万人空巷/2 | “全城”“都涌上街头赏灯”，人都从家里出来了 | the whole city in the streets for the lanterns
文不加点/1 | “才思敏捷，下笔千言”，一气写成不用涂改 | quick-witted, a thousand words without a correction
文不加点/2 | “不到半小时就写成了一篇佳作”，写得快不用改 | a fine essay in half an hour without a blot | 游刃有余
危如累卵/1 | “敌军压境，城中粮草将尽”，情况极其危险 | the enemy at the gates and supplies running out
危如累卵/2 | “大堤多处渗水”“必须马上抢修”，极其危险 | a dyke leaking everywhere: in grave peril
游刃有余/1 | “当了三年班长，组织这样的活动”，熟练轻松 | three years as monitor: organising it with ease
游刃有余/2 | “精通三门外语”，当翻译熟练轻松 | fluent in three languages, interpreting with ease
登堂入室/1 | “学了十年书法”“自成一家”，技能达到很高水平 | ten years of calligraphy, reaching mastery
登堂入室/2 | “要循序渐进，才能慢慢”，由浅入深达到高水平 | step by step to the highest level
曲高和寡/1 | 实验电影“上映了一周就停映了”，能理解的人少 | an experimental film that closed in a week
曲高和寡/2 | 诗“写得太深奥”，能理解的人很少 | poetry too abstruse to find readers
求全责备/1 | “对初学的孩子不能……要多鼓励”，不能要求十全十美 | do not demand perfection of a beginner
求全责备/2 | “人无完人”，不该要求别人毫无缺点 | no one is perfect, so do not demand it
不赞一词/1 | “大家争论不休，他却始终”，一言不发 | everyone arguing, he said nothing
不赞一词/2 | “看不出是赞成还是反对”，一句话也不说 | silent, neither for nor against
侧目而视/1 | “恶霸横行乡里”，百姓又怕又恨 | villagers glaring in fear at the bully
侧目而视/2 | “仗势欺人”，邻居们又怕又恨 | neighbours eyeing the bully with fear and hate
举重若轻/1 | “这么复杂的工程”“井然有序”，轻松胜任繁重工作 | directing a complex project with ease
举重若轻/2 | “一连串的难题”“一一化解”，轻松处理难题 | solving one problem after another lightly
望其项背/1 | “棋艺高超，同龄人难以”，赶不上 | so good at chess no peer comes close
望其项背/2 | “别的店很难”，比不上老店的手艺 | other shops cannot match the old one
休戚与共/1 | “两国人民”“结下了深厚的友谊”，同甘共苦 | two peoples sharing joys and sorrows
休戚与共/2 | “全村人”“一起渡过了那场洪水”，共患难 | the whole village through the flood together
安步当车/1 | “每天早上都”“慢慢走过去”，步行当作坐车 | walking slowly to the park instead of riding
安步当车/2 | “天气晴好，他索性”“一路走回了家”，以步代车 | a fine day, so he strolled home
耳提面命/1 | “在老师的……下，他的学业进步很快”，恳切地当面教导 | progressing fast under the teacher's earnest guidance
耳提面命/2 | 父亲“教他做人要正直”，恳切地当面教导 | a father earnestly teaching uprightness
蔚然成风/1 | “在学校的倡导下，课外阅读已经”，形成风气 | reading for pleasure has become the custom
蔚然成风/2 | “垃圾分类在社区里”，逐渐盛行成风气 | sorting rubbish has caught on in the neighbourhood
一挥而就/1 | “提起毛笔”写下对联，一动笔就写成 | a couplet dashed off with the brush
一挥而就/2 | 画家画山水画，一动笔就画成 | a landscape painted at a stroke
胸无城府/1 | “心里怎么想嘴上就怎么说”，为人坦率 | says whatever he thinks: guileless
胸无城府/2 | “用不着处处提防”，为人坦率没有心机 | no need to be on guard with such a frank person
东山再起/1 | “公司破产以后”“几年后又”，失败后重新恢复 | bankrupt, then back on top
东山再起/2 | “这支球队降级后”“终于”，失败后恢复地位 | relegated, then returning to the top
江郎才尽/1 | “写了几部好小说，后来却再无新作”，才思减退 | good novels, then nothing: his talent spent
江郎才尽/2 | “晚年的作品平淡无奇”，写不出好作品 | flat late works: inspiration run dry
洛阳纸贵/1 | 小说“一出版就轰动全国”，风行一时 | a novel that took the country by storm
洛阳纸贵/2 | “他的诗集问世”，流传很广，风行一时 | his poems so popular they sold out everywhere
三人成虎/1 | “谣言说的人多了”“要及时澄清”，谣言多了让人信以为真 | rumour repeated becomes believed
三人成虎/2 | “一件没影的事，传来传去”“大家都信了”，谣言多了成真 | a groundless story believed after many tellings
不足为训/1 | “靠熬夜突击考了高分，这种做法”，不能当作榜样 | cramming all night is no example to follow
不足为训/2 | “个别人侥幸成功的经历”，不能当作法则 | a lucky success is no rule
不可理喻/1 | “蛮横无理”，不能用道理使他明白 | so unreasonable no argument reaches him
不可理喻/2 | “跟……的人争吵，只是白费力气”，讲不通道理 | arguing with the unreasonable is wasted breath
方兴未艾/1 | 人工智能研究“前景十分广阔”，正在兴起 | AI research on the rise
方兴未艾/2 | 全民健身的“热潮”“越来越多的人”，正在发展 | a fitness boom still growing
不负众望/1 | “在决赛中夺得了金牌”，没有辜负大家的期望 | winning gold as everyone hoped
不负众望/2 | “新任队长”“带领球队打进了前三名”，不辜负期望 | the new captain lived up to expectations
不绝如缕/1 | “国家危难”，命运像细线一样快要断了 | the nation in peril, its fate hanging by a thread
不绝如缕/2 | 远处的“笛声”“若有若无”，声音细弱悠长 | a distant flute, faint and lingering
首屈一指/1 | 数学教学“在全省”，排第一 | the school's maths the best in the province
首屈一指/2 | “论刺绣手艺，她在村里是”，排第一 | the finest embroiderer in the village
如雷贯耳/1 | “大名早已”“终于见到了本人”，名声很大 | a famous name long heard, now met in person
如雷贯耳/2 | “久闻先生大名”，名声大得像雷声 | your name has long resounded in my ears
无所不至/1 | 骗子“为了骗钱，坑蒙拐骗”，什么坏事都做 | swindlers stopping at nothing for money
无所不至/2 | “奸臣陷害忠良”，坏事做尽 | a treacherous minister doing every evil
空穴来风/1 | “纯属……大家不要轻信”，毫无根据 | groundless news, not to be believed
空穴来风/2 | 网上的传言“不能当真”，毫无根据 | online rumours, baseless
明日黄花/1 | “已经是……没有人再关心了”，过时的消息 | news now stale that no one cares about
明日黄花/2 | “当年流行的款式，如今早成了”，过时的事物 | last year's fashions now outdated
沧海一粟/1 | “个人的力量在广阔的宇宙面前”，非常渺小 | one person in the universe: a drop in the ocean
沧海一粟/2 | “和人类的全部知识相比”，非常渺小 | my reading beside all human knowledge
不学无术/1 | “整天游手好闲”“什么事也干不成”，没学问没本领 | idle all day, ignorant and incapable
不学无术/2 | “是担不起这样的重任的”，没有学问本领的人 | an ignorant man cannot bear such a task
难以为继/1 | “没有了资金的支持，这个项目”，难以继续 | without funds the project cannot go on
难以为继/2 | “靠透支身体换来的好成绩”，难以继续下去 | results bought by overwork cannot last
目不暇接/1 | “新产品琳琅满目，令人”，眼睛看不过来 | so many new products the eye cannot take them in
目不暇接/2 | “景色不断变换”，看不过来 | scenery changing faster than the eye can follow
登峰造极/1 | 书法“已经到了……的地步”，达到最高境界 | calligraphy at its very peak
登峰造极/2 | “宋代的瓷器烧制技术可谓”，达到最高 | Song porcelain at the summit of the art
如履薄冰/1 | “刚接手这项重要工作”“不敢有丝毫大意”，极为小心谨慎 | new to a vital job, treading carefully
如履薄冰/2 | “在悬崖边的栈道上”，走得极为小心 | on a cliff path, every step cautious
口若悬河/1 | “辩论会上”“驳得对方哑口无言”，能说会道 | in the debate he talked his rivals into silence
口若悬河/2 | “说起家乡的趣事”“停不下来”，滔滔不绝 | grandmother talking on and on about home
妙手回春/1 | “病人康复出院时”送锦旗，称赞医术高明 | a banner thanking the doctor on recovery
妙手回春/2 | “多亏这位老中医”“爷爷的病才好了”，医术高明 | the old doctor's skill cured grandfather
信口开河/1 | “没有调查清楚就下结论”，随口乱说没根据 | conclusions without investigation: talking nonsense
信口开河/2 | “说话从来不负责任”，随口乱说 | irresponsible talk off the top of his head
杯水车薪/1 | “这点钱对于重建整座学校来说”，力量太小 | a little money for rebuilding a school: a drop in the bucket
杯水车薪/2 | “靠几个人挑水救这场山火”，力量太小解决不了问题 | a few buckets against a forest fire
休养生息/1 | “汉朝初年，朝廷减轻赋税”，让百姓恢复元气 | early Han tax cuts letting the people recover
休养生息/2 | “连年战乱以后”，国家需要恢复元气 | after years of war the country needs to recover
鱼目混珠/1 | “拿假货”“消费者要擦亮眼睛”，以假冒真 | passing off fakes as genuine
鱼目混珠/2 | “用人造宝石”“欺骗顾客”，以假冒真 | synthetic gems passed off as real
无可置疑/1 | “他是这次事故的责任人”，没什么可怀疑的 | his responsibility beyond doubt
无可置疑/2 | “证据确凿”，事实明显不容怀疑 | conclusive evidence: indisputable fact
画地为牢/1 | “要敢于创新，不能……死守老一套”，只在划定范围活动 | do not confine yourself to the old ways
画地为牢/2 | “不肯走出自己熟悉的小圈子”，自己限制自己 | never leaving his own little circle
一叶障目/1 | “只看到一点缺点就否定全部”，被局部迷惑看不到全局 | rejecting the whole for one flaw
一叶障目/2 | “看问题要全面……以偏概全”，与全面相反 | the opposite of seeing the whole picture
防患未然/1 | “定期检查电线”，在祸患发生前防止 | checking the wiring regularly to prevent trouble
防患未然/2 | “消防演习的目的”，事先防止祸患 | fire drills to prevent disaster
蔚为大观/1 | “收藏的历代名画”汇集在一起，盛大壮观 | a great gathering of masterpieces
蔚为大观/2 | “各地的民间艺术汇聚一堂”，壮观的景象 | folk arts from everywhere in one splendid show
别无长物/1 | “除了几架旧书”，再没有多余的东西 | nothing in his study but old books
别无长物/2 | “这位清官去世时，家中”，再无多余之物 | the honest official left nothing behind
不忍卒读/1 | 家书“字字血泪”，不忍心读完 | a letter so painful one cannot finish it
不忍卒读/2 | “写灾民的苦难”，悲惨得不忍读完 | the suffering so harrowing one cannot read on
石破天惊/1 | 发现“改变了人们对宇宙的认识”，新奇惊人 | a discovery that changed our view of the cosmos
石破天惊/2 | 观点“震动了整个学界”，新奇惊人 | a view that shook the academy
弹冠相庆/1 | “奸臣得势，他的党羽都”，坏人得意庆贺 | the villain's faction rejoicing at his rise
弹冠相庆/2 | “听说对手倒台，那伙投机分子”，坏人互相庆贺 | opportunists gloating at a rival's fall
不一而足/1 | “从扶老人过马路到捐款助学”，不止一种 | good deeds of every kind
不一而足/2 | “从错别字到病句”，毛病不止一种 | faults of many kinds
一言九鼎/1 | “他说的话大家都信服”，说话很有分量 | the old secretary's word carries weight
一言九鼎/2 | “为人守信”“从不食言”，说话有分量 | a man of his word
大巧若拙/1 | 作品“看似朴素，其实”“处处见功夫”，真巧看似笨拙 | plain-looking but full of skill
大巧若拙/2 | “从不炫耀自己的本事”，聪明不卖弄 | never showing off his ability
匠心独运/1 | 园林“布局”“一步一景”，构思精巧独到 | a garden laid out with original craft
匠心独运/2 | 作者“用一件小事写出了时代的变迁”，构思独创 | showing an era through one small event
津津乐道/1 | 比赛“至今仍被球迷们”，很有兴趣地谈论 | fans still love to talk of that game
津津乐道/2 | 爷爷“对自己年轻时的经历总是”，喜欢谈论 | grandfather loves to talk about his youth
感同身受/1 | “读了他的遭遇”“忍不住落下泪来”，感受像亲身经历 | reading of his ordeal as if it were mine
感同身受/2 | “才能真正理解别人的难处”，像亲身经历一样感受 | feeling others' hardship as one's own
犬牙交错/1 | “两县边界”“分不清哪块地属于哪个县”，交界线曲折 | an interlocking county border
犬牙交错/2 | “敌我双方的阵地”，交错复杂 | front lines interlocking
上行下效/1 | “领导带头铺张浪费，下属”，上面怎么做下面就跟着 | subordinates copying the boss's waste
上行下效/2 | “领导要先做好表率”，防止下面学上面的坏样 | leaders must set an example so bad habits do not spread down
不胜枚举/1 | “勤学成才的例子”，多得列举不完 | countless examples of success through study
不胜枚举/2 | “他做过的好事”“大家有目共睹”，多得数不过来 | his good deeds too many to count
`);
