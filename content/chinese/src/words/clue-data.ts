// The clues of the gap sentences of the native word batches, written by hand a sentence at a time (docs/chinese-curriculum.md §6).

import { parseClues } from "./clues.ts";

/** wordClues are the clues of every gap sentence of the native word batches, by clueKey. */
export const wordClues = parseClues(`
起床/1 | “早上七点”“穿好衣服”说的是早上从床上起来 | "seven in the morning" and "get dressed" tell of getting out of bed
起床/2 | 天亮了，公鸡叫，是在喊大家从床上起来 | dawn and the rooster's crow call people out of bed | 出门
出门/1 | 要带雨伞，说的是离开家到外面去 | taking an umbrella is for going outside
出门/2 | 吃完早饭“去上班”，要先离开家 | going to work after breakfast means leaving home
打开/1 | “窗户”和“让新鲜的空气进来”，要把关着的窗开开 | a window and fresh air coming in: the closed window is opened
打开/2 | “礼物盒”和“里面是”，要把盒子开开才看得见 | a gift box and what is inside: the box is opened
喜欢/1 | “最＿＿吃”说的是对饭菜有好感 | "most ... to eat" tells of a liking for the food
喜欢/2 | 小猫爱在太阳底下睡，说的是它对这件事有好感 | the kitten sleeping in the sun tells of what it likes
记住/1 | 过马路要看红绿灯，这件事要留在心里不忘 | looking at the lights is something to keep in mind | 小心
记住/2 | “老师说的话”和“都……了”，说的是把话留在心里 | "what the teacher said" and "all of it": the words are kept in mind
帮忙/1 | 妈妈在做饭，“我去”洗菜，是替妈妈做事 | mother is cooking and I go to wash the vegetables for her
帮忙/2 | “一个人搬不动”“请你来”，是请别人帮着解决困难 | "too heavy for one" and "please come" ask for help
舒服/1 | “躺在软软的床上”，身体感到轻松 | lying on a soft bed, the body feels at ease
舒服/2 | “洗完热水澡”“全身都”，说的是身体感到轻松愉快 | after a hot bath the whole body feels good
小心/1 | “过马路”“看清楚来往的车辆”，说的是要注意 | crossing the road and watching the cars call for care
小心/2 | 水很满，“端的时候”要注意，不能马虎 | a full cup must be carried with care
好看/1 | “穿上新裙子”，说的是样子让人看了喜欢 | in a new dress, she is nice to look at
好看/2 | 画“画得真”怎样，又要“贴在墙上”，说的是样子让人喜欢 | a picture worth putting on the wall is nice to look at
热闹/1 | “来了很多客人”，人多声音多 | many guests have come: many people and much noise
热闹/2 | “人来人往”，说的是人多很欢乐 | people coming and going: a lively place
醒来/1 | “一……就听见”，说的是睡觉后刚醒过来 | "as soon as ... I heard": just after waking
醒来/2 | “从梦里”出来，就是睡醒过来 | coming out of a dream is waking up
进来/1 | “外面下雨了”，要从外面到里面来 | it is raining outside, so come in
进来/2 | “门开着”“跑了＿＿”，说的是从外面到里面 | the door is open and the kitten runs in
抬头/1 | “一看，天上飞过”，要把头抬起来才看得见天上 | to see the sky you raise your head
抬头/2 | “望着天上的月亮”，要把头抬起来 | looking at the moon in the sky, the head is raised
起立/1 | 老师进来，同学们“向老师问好”，是站起来 | when the teacher comes in, the class stands to greet her
起立/2 | “不能坐着”，就是要站起来 | "may not stay seated": everyone stands
大笑/1 | “哈哈”说的是大声地笑 | "haha" is laughing out loud
大笑/2 | 看了“鬼脸”，我们都＿＿“起来”，是大声笑起来 | at the funny face we burst out laughing
张开/1 | “翅膀”要打开才能“飞向蓝天” | the wings are spread to fly
张开/2 | “嘴巴”打开，医生才看得见牙齿 | the mouth is opened for the dentist
加快/1 | “快迟到了”，脚步要变快 | about to be late, one walks faster
加快/2 | “雨越下越大”，大家把脚步变快往家走 | in heavier rain everyone hurries home
走近/1 | “轻轻地”向小鸟靠近，它还是飞走了 | stepping softly toward the bird, which still flies off
走近/2 | “一看，原来草地上有”，是走到跟前去看 | going close to look at the grass
停下/1 | “红灯亮了”，汽车不再走 | the light turns red and the cars stop
停下/2 | “跑累了”“来坐在地上”，是不再跑 | tired of running, the dog stops and sits
拿出/1 | “打开书包”，把书从里面取出来 | opening the schoolbag to take out a book
拿出/2 | “从冰箱里”取出西瓜 | taking a melon out of the fridge
放学/1 | “背着书包走出校门”，是一天的课上完了 | leaving the school gate with schoolbags at the end of the day | 放假
放学/2 | “下午四点”“妈妈来学校接我”，是一天的课上完了 | at four o'clock mother picks me up after school
容易/1 | “一下子就做出来了”，说的是不难 | done at once: the problem is easy
容易/2 | “笔画少”，写起来不费力 | few strokes make a character easy to write
明白/1 | “老师一讲，我就”，说的是懂了 | as soon as the teacher explained, I understood
明白/2 | 问“这句话是什么意思”，是问懂了没有 | asking what a sentence means asks whether one understands
正确/1 | “答案”“真棒”，说的是答案对 | "the answer" and "well done": the answer is right
正确/2 | 拿笔的“方法”要用对的 | the way to hold a pen should be the right one
进步/1 | “字越写越好”，是比以前更好 | writing better and better is progress
进步/2 | “有了很大的”，前面是“学习”，说的是比以前更好 | "great ... in his studies": improvement
回答/1 | “老师提出问题”“举手”，是对问题作出解答 | the teacher asks and I raise my hand to answer
回答/2 | “这个问题，谁来”，是请人解答 | "who will ... this question" asks for an answer
迟到/1 | “路上车太多”，过了时间才到学校 | traffic made me late for school
迟到/2 | “早点起床”是为了上学不晚到 | getting up early so as not to be late
努力/1 | “学习”“长大做个有用的人”，要用心去做 | studying to be useful when grown up takes effort
努力/2 | “每天”练习，“终于得了第一名”，是用尽力气去做 | practising every day until winning takes effort
大声/1 | “站起来”把课文读给大家听，声音要大 | standing up to read to the class, one reads loudly
大声/2 | 在图书馆里不能说的，是声音很大的话 | in a library one may not talk loudly
放假/1 | “国庆节”到了，不上学 | at National Day there is no school
放假/2 | “夏天”学校“两个月”不上课 | in summer the school closes for two months
白天/1 | 和“晚上”相对，说的是天亮到天黑的时候 | set against "at night": the daytime
白天/2 | “太阳下山了”“天黑了下来”，过去的是天亮着的时间 | the sun has set: the day is over
早晨/1 | “太阳刚出来”“公鸡就喔喔地叫了”，是天刚亮的时候 | the sun just up and the rooster crowing: early morning
早晨/2 | “六点”去公园跑步，说的是天刚亮的时候 | at six, running in the park: the morning
升起/1 | 太阳“从东方慢慢”往高处去 | the sun rising slowly from the east
升起/2 | 五星红旗在“操场上”“慢慢地”往高处去 | the flag rising slowly over the playground
暖和/1 | “春天来了”“一天比一天”，天气越来越不冷 | spring comes and each day is warmer
暖和/2 | “河里的冰化了”，天气不冷了 | the ice on the river melts as it grows warm
晴天/1 | 说“今天是个大”，又要“去公园玩”，是有太阳的天气 | a fine sunny day for the park
晴天/2 | “下了三天雨”，今天“终于”有了太阳 | after three days of rain, at last the sun
开花/1 | “桃树”“粉红粉红的”，是花朵开放了 | the peach tree pink with blossom
开花/2 | “小花终于”“真香啊”，是花朵开放了 | the flower at last opens and smells sweet
冬天/1 | “飘起了雪花”，是一年中最冷的季节 | snowflakes fall in the coldest season
冬天/2 | 小熊躲进洞睡大觉“一直睡到春天”，是一年中最冷的季节 | the bear sleeps until spring through winter
雪白/1 | “下了一夜大雪”，大地像雪一样白 | after a night of snow the ground is white as snow
雪白/2 | 小白兔的毛“像一个雪球”，像雪一样白 | the rabbit like a snowball is snow-white
碧绿/1 | “小草一片”，春雨后草是绿得发亮的颜色 | the grass after spring rain is a bright green
碧绿/2 | “荷叶”“像一把把小伞”，说的是叶子的绿色 | the lotus leaves, like little umbrellas, are bright green
远处/1 | “站在山顶上，我看见”，是离得很远的地方 | from the hilltop one sees far away
远处/2 | 叫声是“传来”的，从离得很远的地方 | the barking carries from far away
生气/1 | “气得脸都红了”，是因为不合心意而不高兴 | so cross his face went red: he is angry
生气/2 | “我不是故意踩你的脚”，是劝对方别不高兴 | "I didn't mean to step on your foot" asks the other not to be cross
害怕/1 | “打雷了”“躲进妈妈怀里”，是心里发慌 | thunder, and she hides in her mother's arms: she is frightened
害怕/2 | “一看见猫”“发抖”，是心里发慌 | trembling at the sight of a cat: the mouse is afraid
担心/1 | “奶奶生病住院了”，我放心不下 | grandmother is in hospital and I worry about her
担心/2 | “放心不下”“我会小心的”，是叫妈妈别怕出事 | "can't stop worrying" and "I'll be careful": don't worry | 害怕
奇怪/1 | “会是什么呢”，说的是声音跟平常的不一样 | "what could it be?": the sound is strange | 温柔
奇怪/2 | “我从来没听过”，叫声跟平常的不一样 | "I have never heard it": the call is strange | 温柔
讨厌/1 | “它总在耳边叫个不停”，说的是不喜欢蚊子 | buzzing in the ear all the time: I dislike mosquitoes
讨厌/2 | “每次都把青菜挑出来”，说的是不喜欢吃 | always picking out the greens: she dislikes them
孤单/1 | “没有朋友陪它玩”，是一个人没有伴 | no friend to play with: the rabbit is lonely
孤单/2 | “交到了好多朋友”“再也不”，说的是不再没有伴 | with many friends now, he is lonely no more | 害羞 害怕
温柔/1 | 说的是妈妈“说话的声音”，温和不粗暴 | mother's voice is gentle | 奇怪
温柔/2 | “春风”轻轻“吹在脸上”，温和不粗暴 | the spring breeze on the face is gentle
失望/1 | “希望落空了”，心里不痛快 | the hope came to nothing: disappointment
失望/2 | “一直希望”得第一，“结果只得了第三名” | he hoped to come first and came third: disappointed
害羞/1 | “一见生人，脸就红了”，是怕人笑话，不好意思 | blushing at strangers: shy
害羞/2 | 被“表扬”后“低下了头”，是不好意思 | praised, he hangs his head: bashful
自豪/1 | “我们班在比赛中得了第一名”，为集体感到光荣 | our class came first: proud
自豪/2 | “爸爸是一名消防员”“我为他感到”，为亲人感到光荣 | my father is a firefighter and I am proud of him
关心/1 | “爸爸妈妈”对“我的学习”，常常放在心上 | parents keeping my studies in mind
关心/2 | “天冷了”“总是”想着我穿得暖不暖，是把我放在心上 | thinking whether I am warm enough when it is cold
分享/1 | “拿出来”“和同学们一起”，是一起享用 | bringing out biscuits to enjoy with classmates
分享/2 | 好东西要“和大家”一起享用 | good things are shared with everyone
原谅/1 | “不小心碰倒”，他“笑着”不再怪我 | I knocked it over by accident and he forgave me with a smile
原谅/2 | “对不起，我错了”，请对方不再怪我 | "sorry, I was wrong" asks to be forgiven
争吵/1 | “谁也不让谁”，因为意见不合大声地吵 | neither would give way, so they quarrelled
争吵/2 | “好朋友之间”“为一点小事”，说的是吵架 | friends should not quarrel over trifles
亲切/1 | 老师“摸着我的头”夸我，让人感到亲近温暖 | the teacher strokes my head kindly
亲切/2 | “奶奶的笑容”让人感到亲近、温暖 | grandmother's smile is warm and kind
欢迎/1 | “到我家来做客”，是高兴地迎接 | "come and visit": welcome
欢迎/2 | “新同学来了”“拍手”，是高兴地迎接他 | clapping for a new classmate welcomes him
团聚/1 | “春节”“一家人”“在一起”，是亲人聚在一起 | the family together at Spring Festival
团聚/2 | “爸爸从外地回来了”“全家终于”，是分开的亲人又在一起 | father back from away: the family is together again
照顾/1 | “奶奶生病了”“在医院”，妈妈照看她 | mother looks after grandmother in hospital
照顾/2 | “我是哥哥”，要照看弟弟 | as the elder brother I look after my brother
听话/1 | “妈妈让他坐好，他就坐得好好的”，是听从长辈的话 | told to sit nicely, he does: he is obedient
听话/2 | “从来不让爸爸妈妈操心”，是听长辈的话 | never giving my parents cause to worry: obedient
一起/1 | “我和好朋友”同一路回家 | my friend and I go home together
一起/2 | “我们”“来做游戏吧”，是一同做 | "let's play a game together"
强壮/1 | “能拉很重的车”，身体结实有力气 | able to pull a heavy cart: strong
强壮/2 | “多吃饭，多运动”，身体才结实 | eating well and exercising make the body strong
柔软/1 | “像躺在棉被里一样”，草地软和 | like lying in a quilt: the grass is soft
柔软/2 | 棉花“像云朵一样”，摸上去软和 | cotton like clouds feels soft
笨重/1 | 大象“走起路来一步一步的”，又大又重，不灵活 | the elephant walks step by step: heavy and clumsy | 强壮
笨重/2 | 乌龟背着壳“慢慢地往前爬”，壳又大又重 | the tortoise crawls slowly under its heavy shell | 光滑
飞快/1 | 小兔子“跑进了树林”，跑得非常快 | the rabbit darts into the wood
飞快/2 | 燕子从水面上“飞过”，非常快 | the swallow skims fast over the water
枯萎/1 | “好几天没浇水”，花儿干枯了 | unwatered for days, the flowers have withered
枯萎/2 | “天气太干”，小苗干枯了 | too dry, the seedlings have withered
温顺/1 | “小朋友也可以骑”，说明马性情温和 | even children can ride it: the horse is gentle
温顺/2 | “静静地坐着”，小狗温和、听话 | sitting quietly before its master: docile
光滑/1 | “被水冲得圆圆的”，石头表面平，摸起来不粗 | stones worn round by water are smooth
光滑/2 | “结了冰”“像镜子一样”，湖面平而不粗 | frozen like a mirror, the lake is smooth
香甜/1 | “苹果又大又”，说的是又香又甜 | apples big and sweet
香甜/2 | “蜂蜜”又香又甜 | honey is sweet and fragrant
挺拔/1 | 白杨树“又高又”“像一排排士兵”，又高又直 | poplars tall and straight like soldiers
挺拔/2 | 小松树“站在山坡上”，又高又直 | young pines standing straight on the hill
胆小/1 | “一听到响声就躲起来”，容易害怕 | hiding at every noise: timid
胆小/2 | “晚上不敢一个人睡觉”，胆子小 | afraid to sleep alone: timid
方便/1 | “家门口新开了一家超市”，买东西不费事 | a new shop at the door makes shopping easy
方便/2 | “有了地铁”，出门不费事 | with the metro, going out is easy
宽敞/1 | 教室“又……又明亮”，是又宽又大 | the classroom roomy and bright
宽敞/2 | “新房子”又宽又大 | a spacious new flat
危险/1 | “在马路上追跑打闹”，可能出事 | chasing about on the road could lead to an accident
危险/2 | “河水很深”，去游泳不安全 | the river is deep: swimming there is dangerous
破旧/1 | “书皮都掉了”，书又破又旧 | the cover has come off: the book is worn
破旧/2 | “舍不得扔掉”，鞋又破又旧 | he cannot bear to throw away the worn shoes
清楚/1 | “坐在后面也能看见”，字容易看明白 | visible from the back: the writing is clear
清楚/2 | “站得太远，看不”，说的是看不明白 | too far away to see clearly
附近/1 | “我家”和“有一个小公园”，说的是离家不远 | a little park near my home
附近/2 | “走路五分钟就到了”，离得不远 | five minutes' walk: nearby
特别/1 | 石头“像一只小乌龟”，跟一般的不一样 | a stone shaped like a tortoise is unusual
特别/2 | 身上“有一块心形的白毛”，跟一般的不一样 | a heart-shaped white patch: unusual
繁忙/1 | “汽车来来往往”，事情多，没有空闲 | cars coming and going: the road is busy
繁忙/2 | “秋收的时候”“每天都很”，事情多，没有空闲 | at harvest the farmers are busy
完整/1 | “一点也没有碎”，杯子没有损坏 | not cracked at all: the cup is whole
完整/2 | “一块一块拼好”，图画一块也不缺 | pieced together, the picture is complete | 精彩
精彩/1 | “大家看得都站了起来”，比赛非常吸引人 | everyone on their feet: a thrilling match
精彩/2 | “联欢会上”的“节目”，表演非常好 | the acts at the party are excellent | 特别
勇敢/1 | “冲进火海，救出了被困的小孩”，不怕危险 | rushing into the fire to save a child: brave
勇敢/2 | “跳进河里”“把落水的同学拉上了岸”，不怕危险 | jumping into the river to save a classmate: brave
诚实/1 | “不能说谎骗人”，说的是说真话 | not lying: honest
诚实/2 | “从来不说谎，大家都相信他”，说真话 | never lying, so everyone trusts him: honest
勤劳/1 | “从早到晚不停地劳动，不怕辛苦” | working from morning to night: hardworking
勤劳/2 | “天不亮就下地干活”，努力劳动 | in the fields before dawn: hardworking
谦虚/1 | 考了第一名，却说“我还有很多不足”，不自满 | top marks, yet "I still have much to learn": modest
谦虚/2 | 和“骄傲使人落后”相对，说的是不自满 | set against "pride holds you back": modesty
认真/1 | “每个字都写得工工整整”，做事仔细 | every character written neatly: careful
认真/2 | “检查一遍，别把题目看错”，做事仔细 | checking so as not to misread: carefully
友好/1 | “主动帮我搬桌子”，待人亲近 | helping me carry my desk: friendly
友好/2 | “很多国家”“邻邦”，国家之间亲近和睦 | neighbouring countries on friendly terms
安静/1 | 图书馆里“大家都在看书”，没有吵闹 | in the library everyone is reading: quiet
安静/2 | “夜深了”“只听见虫子在叫”，没有别的声音 | late at night only the insects are heard: quiet
干净/1 | “打扫得”什么样，是不脏 | swept clean
干净/2 | “饭前要把手洗”，洗到不脏 | hands washed clean before meals
高兴/1 | “明天去春游”“跳了起来”，心里愉快 | jumping for joy at the outing: glad
高兴/2 | “我考了一百分”，妈妈心里愉快地笑了 | full marks, and mother smiles happily
美丽/1 | “到处开满了鲜花”，公园好看 | flowers everywhere: the park is beautiful
美丽/2 | 孔雀“展开了”的尾巴，好看 | the peacock spreads its beautiful tail
茂盛/1 | “雨后”“庄稼长得十分”，长得多而茁壮 | after rain the crops grow thick
茂盛/2 | 葡萄藤“爬满了架子”，长得多而茁壮 | the vine covers the trellis: lush
明亮/1 | “灯光很”，光线很亮 | the light is bright
明亮/2 | “窗户又大又亮”，光线充足 | big bright windows: a bright room
干燥/1 | “嘴唇容易裂开，要多喝水”，空气水分少 | cracked lips and drinking more water: the air is dry
干燥/2 | “受潮就不脆了”，要放在没有水分的地方 | biscuits go soft when damp, so keep them dry
宽阔/1 | “可以并排开六辆汽车”，马路横的距离大 | six cars side by side: a wide road
宽阔/2 | “越往下游”江面越宽 | the river grows wider downstream
清澈/1 | “能看见水底的鹅卵石”，水清得见底 | the pebbles on the bottom can be seen: clear water
清澈/2 | “见底”，水清得能看见底 | clear to the bottom
温暖/1 | “阳光照在身上”，不冷也不热 | the spring sunshine feels warm
温暖/2 | 冬天穿的“毛衣”，让人暖和 | a warm sweater for winter
炎热/1 | “夏天”“喜欢去游泳”，天气很热 | in summer everyone likes to swim: hot
炎热/2 | “太阳火辣辣的”，天气很热 | the blazing sun: very hot
高大/1 | “个子”“特别显眼”，又高又大 | standing out in a crowd: tall and big
高大/2 | 大象“像一堵墙”，又高又大 | the elephant like a wall: huge
平坦/1 | “一点也不颠”，路没有高低 | not bumpy at all: the road is level
平坦/2 | “一眼望不到边”的草原，没有高低起伏 | the grassland stretching flat to the horizon
弯曲/1 | 小路“通向山顶”，有弯 | a winding path up the hill | 平坦
弯曲/2 | 背“已经……了”“要拄着拐杖”，背不直了 | his back bent, he walks with a stick
整齐/1 | “横看竖看都是一条线”，有秩序不乱 | in a line whichever way you look: neat
整齐/2 | “一个个站得笔直”，队伍不乱 | standing straight: an orderly line
准时/1 | “上课铃一响”就走进教室，按规定的时间 | in class as the bell rings: on time
准时/2 | “一分钟也没有晚”，按规定的时间 | not a minute late: on time | 安全
复习/1 | “学过的课文从头到尾”再学一遍 | going over learned lessons again
复习/2 | “学过的生字”“才不会忘记”，要再学 | reviewing learned characters so as not to forget them
提问/1 | “我第一个举手回答”，老师是提出问题来问 | I answer first, so the teacher asked a question
提问/2 | “有不懂的地方”，要向老师提出问题 | ask the teacher about what you do not understand
表扬/1 | “拾到钱包交给了老师”，受到公开称赞 | handing in a found purse earned praise
表扬/2 | “作业写得工整”“心里美滋滋的”，是被称赞了 | praised for neat work, I am pleased
团结/1 | “全班同学”“一心”“拔河比赛中得了第一名”，联合在一起 | the class as one wins the tug-of-war: united
团结/2 | “就是力量”，联合在一起才有力量 | unity is strength
专心/1 | “不能东张西望”，要集中注意力 | not looking about: attentive
专心/2 | “连妈妈叫他都没听见”，一心一意 | not hearing his mother call: absorbed
开始/1 | “新学期”“同学们又回到了校园”，从头起 | the new term has begun
开始/2 | “马上就要”“做好了准备”，比赛就要着手进行 | the race is about to start
简单/1 | “一下子就做出来了”，不复杂 | solved at once: simple
简单/2 | “一学就会”，规则不复杂 | learnt at once: simple rules
安全/1 | “不在马路上追跑打闹”，为了不出事故 | not playing on the road, to stay safe
安全/2 | “打雷的时候，待在屋子里”，没有危险 | indoors during thunder is safer
晴朗/1 | “天上一朵云也没有”，是没有云雾 | not a cloud in the sky: clear weather
晴朗/2 | “雨过天晴”“满天都是星星”，夜空没有云雾 | after the rain the sky is full of stars: clear
凉快/1 | “电风扇一吹”，屋子里变得清凉 | with the fan on, the room is cooler
凉快/2 | “不太热”，比去年清凉 | not too hot: cooler than last year
冰冷/1 | “刺骨”“冻红了”，像冰一样冷 | biting and turning hands red: ice-cold
冰冷/2 | “玩了一下午雪”，手脚像冰一样冷 | after an afternoon in the snow, hands and feet are ice-cold
猛烈/1 | 台风“吹倒了路边的大树”，风的力量强 | a typhoon felling trees: violent wind
猛烈/2 | 雷雨“来得又快又”，气势大 | the storm comes fast and fierce
漫长/1 | “一分钟就像一小时”，时间显得长 | a minute like an hour: the wait seems long
漫长/2 | 和“白天最短”相对，黑夜最长 | set against "the shortest day": the longest night
融化/1 | “春天来了”，积雪变成水 | in spring the snow melts
融化/2 | “冰棍拿在手里，不一会儿”，变成了水 | the ice lolly melts in the hand
枯黄/1 | “秋风一吹”，草变得干枯发黄 | at the autumn wind the grass turns yellow
枯黄/2 | “深秋”“一片片落下来”的叶子，干枯发黄 | in late autumn the yellow leaves fall
来临/1 | “小草从地下钻了出来”，春天到来了 | grass coming up: spring has come
来临/2 | “就要”到来，“渔民们赶紧把船开回港口” | the storm is coming and the fishermen hurry back
浓厚/1 | “起了大雾”“看不清前面的路”，雾很浓 | thick fog hides the road
浓厚/2 | “堆着”的乌云，“一场大雨就要来了”，云层很浓 | heavy clouds piled up before the rain
刺眼/1 | “我只好眯起眼睛”，光线太强 | I have to squint: dazzling
刺眼/2 | “看久了眼睛会疼”，光线太强 | eyes hurt after a while: the light is too harsh
保护/1 | “环境”“不乱扔垃圾”，是使它不受损害 | not dropping litter protects the environment
保护/2 | 大熊猫是“国家一级”什么动物，说的是要使它不受损害 | a first-class protected animal
增加/1 | 人数“了一百多人”，在原来的基础上加多 | a hundred more pupils than before
增加/2 | “坚持锻炼”使力量加多 | exercise adds to one's strength
赞扬/1 | “在班会上”说到“乐于助人的小红”，是称赞 | praising helpful Xiaohong at the class meeting
赞扬/2 | “见义勇为的事迹”受到大家的称赞 | the brave deed won everyone's praise
进攻/1 | “猛烈的”“终于踢进了一个球”，是主动攻击 | a fierce attack that scores a goal
进攻/2 | “向敌人的阵地发起”，是主动攻击 | launching an attack on the enemy's position
出发/1 | “七点”“去春游”，是离开原来的地方 | setting off at seven for the outing
出发/2 | “天还没亮”“去赶集”，是离开家到别处去 | leaving before dawn for the market
聚集/1 | “广场上”“很多人”，是集合在一起 | many people gathered in the square
聚集/2 | “一群蚂蚁”“在一块糖的周围”，是集合在一起 | ants gathering round a sweet
隐藏/1 | “狐狸找不到它”，是藏起来 | the fox cannot find it: hidden
隐藏/2 | “改变身体的颜色”，把自己藏起来不让别人发现 | changing colour to hide itself | 保护
前进/1 | 船“顶着风浪继续”，是向前行动 | the boat goes on against the waves
前进/2 | “迈着整齐的步伐向终点”，是向前走 | marching toward the finish
赞成/1 | “提议”“纷纷举手”，是同意 | hands go up for the proposal: agreement
赞成/2 | 和“有人反对”相对，说的是同意 | set against "some oppose": some agree
节约/1 | “用水”“随手关好水龙头”，是不浪费 | turning off the tap saves water
节约/2 | “零花钱”省下来捐出，是省着用 | pocket money saved and given
慷慨/1 | “从不小气”“把自己的东西分给大家”，是大方 | never mean, sharing his things: generous
慷慨/2 | “捐出自己的积蓄帮助贫困的学生”，舍得拿出财物 | giving his savings to poor pupils: generous
粗心/1 | “把‘8’看成了‘3’”，是不仔细 | misreading 8 as 3: careless
粗心/2 | “常常丢三落四”，做事不细心 | always forgetting things: careless
镇定/1 | “一点也不慌”，遇到紧急情况不慌乱 | not flustered at all: calm
镇定/2 | 和“不要惊慌”相连，遇到危险时不慌乱 | in danger, stay calm and do not panic
勤奋/1 | “每天早上六点就起来读书”，不断地努力学习 | up at six to read: diligent | 积极
勤奋/2 | 天才从什么来，后半句说“成功要靠努力” | genius comes from hard work, as success comes from effort
灵活/1 | “一下子就跳到了树上”，动作敏捷 | leaping into the tree at once: nimble
灵活/2 | “不能死记硬背”，想办法要随机应变 | not rote learning: think flexibly | 积极
骄傲/1 | “以为乌龟一定跑不过自己”，自以为了不起 | sure the tortoise cannot beat him: conceited
骄傲/2 | “取得了好成绩也不能”，后面说“要继续努力” | good results are no reason for pride
宽容/1 | “不小心弄坏了我的笔”，我说“没关系”，是不计较 | "never mind" about a broken pen: forgiving
宽容/2 | “别人的小错误”，要不计较 | small faults of others should be forgiven
积极/1 | “总是”“举手回答问题”，是主动 | always putting a hand up: keen
积极/2 | “报名参加植树活动”，是主动热心 | signing up to plant trees: eager
稳重/1 | “大人们都放心让他办事”，说话做事沉着 | trusted by the grown-ups: steady
稳重/2 | “从不毛毛躁躁”，沉着有分寸 | never rash: steady
果断/1 | “关键时刻”“做出了决定”，拿定主意不犹豫 | deciding at the critical moment: decisively
果断/2 | “从不犹豫不决”，拿定主意 | never hesitating: decisive
凶猛/1 | “常常成群地攻击羊群”，气势力量凶恶 | attacking flocks in packs: fierce
凶猛/2 | “猎手”“牙齿像锯子一样锋利”，凶恶强大 | a hunter with saw-like teeth: ferocious
机灵/1 | “能听懂主人的口令”，聪明反应快 | understanding commands: clever
机灵/2 | “学会了用石头砸开坚果”，聪明 | learning to crack nuts with stones: clever
捕捉/1 | 青蛙用舌头对“害虫”，是捉住 | the frog catches pests with its tongue
捕捉/2 | 猫头鹰“在夜里”对“田鼠”，是捉住 | the owl catches mice at night
迁徙/1 | “成群地”“到南方去过冬”，从一地移到另一地 | flying south in flocks for the winter: migrating
迁徙/2 | “一年要……好几次，寻找新鲜的青草”，成群换地方 | moving several times a year for fresh grass
活泼/1 | “好动”“一会儿追蝴蝶，一会儿玩线团”，生动不呆板 | chasing butterflies, then yarn: lively
活泼/2 | “天真”“在草地上翻跟头”，生动自然 | turning somersaults: playful
庞大/1 | “一条舌头就有一头大象那么重”，形体很大 | a tongue as heavy as an elephant: enormous
庞大/2 | “生活着几十万只蚂蚁”，数量很大 | hundreds of thousands of ants: a huge colony
忠诚/1 | “从不吃陌生人给的食物”，对主人不变心 | never taking food from strangers: loyal
忠诚/2 | “守着主人的家，一守就是十年”，不变心 | guarding the house for ten years: faithful
缓慢/1 | 蜗牛“背着壳”往前爬，不迅速 | the snail crawls slowly
缓慢/2 | “半天才爬了几步”，很慢 | a few steps in half a day: slow
珍稀/1 | “数量很少”，珍贵而稀少 | few in number: rare
珍稀/2 | “有的别处已经见不到了”，稀少 | some seen nowhere else: rare
警惕/1 | “看到有人走近”“立刻……起来”“飞走了”，对危险保持警觉 | alert at once when someone comes near
警惕/2 | “遇到狼的时候要提高”，对危险的警觉 | facing wolves one must be on guard
修理/1 | “坏了的自行车”“好了”，是恢复原来的样子 | the broken bike is mended
修理/2 | “电视机坏了”“请师傅来”，是使它恢复作用 | a repairman fixes the broken TV
吃力/1 | “石头太重了”，搬起来费力 | the stone is too heavy: hard work
吃力/2 | “年纪大了”“要扶着栏杆慢慢走”，爬楼梯费力 | old, he climbs the stairs with effort
耐心/1 | “一点也不着急”，心里不急躁 | in no hurry at all: patient | 熟练
耐心/2 | “不能三天打鱼，两天晒网”，要不厌烦 | not giving up after a few days: patience
收获/1 | “秋天”“在田里”对“庄稼”，是收取成熟的农作物 | bringing in the crops in autumn
收获/2 | “参观博物馆”“很大”，说的是得到的成果 | the visit taught us much: a gain
结实/1 | “用了二十年还好好的”，坚固耐用 | still good after twenty years: sturdy
结实/2 | “怎么拉也拉不断”，坚固 | it will not break: strong
精细/1 | “连小鸟的羽毛都看得清清楚楚”，精密细致 | every feather visible: fine work
精细/2 | “一针一线都不能马虎”，细致 | not one stitch careless: delicate work
成功/1 | 实验“了”“大家高兴得跳了起来”，得到预期的结果 | the experiment worked and everyone jumped for joy
成功/2 | “失败是……之母”，和失败相对 | failure is the mother of success
熟练/1 | “开了三十年车床”，常做而有经验 | thirty years at the lathe: skilled
熟练/2 | “经过反复练习”，做起来顺手 | after much practice he uses it skilfully
笨拙/1 | “第一次包饺子”，动作不灵巧 | the first time making dumplings: clumsy
笨拙/2 | 企鹅“走起路来摇摇摆摆”，不灵巧 | waddling penguins look clumsy
能干/1 | “家里的事样样都做得好”，会办事 | doing everything well at home: capable
能干/2 | “什么活都会干”，有才能 | able to do any job: capable
繁华/1 | “大城市”，热闹兴旺 | a great bustling city
繁华/2 | “步行街灯火通明”，热闹兴旺 | the street ablaze with lights: bustling
寂静/1 | “只有泉水叮咚作响”，没有别的声音 | only the spring is heard: silent
寂静/2 | “只听见笔尖沙沙的声音”，非常安静 | only pens scratching: silent
辽阔/1 | “疆域”“物产丰富”，宽广 | a vast territory
辽阔/2 | “草原”上放牧，宽广空旷 | the vast grassland
陡峭/1 | 悬崖“像刀削过的一样”，直上直下 | the cliff as if cut by a knife: sheer
陡峭/2 | 山坡“自行车根本骑不上去”，坡度太陡 | too steep to cycle up | 崎岖
鲜艳/1 | “红领巾”，颜色鲜明 | the bright red scarf
鲜艳/2 | “花朵”，颜色鲜明美丽 | brightly coloured flowers
茂密/1 | 树林“阳光都照不进来”，长得多而密 | sunlight cannot get through: dense
茂密/2 | 小鹿躲进的草丛，长得密 | the deer hides in thick grass
湿润/1 | “雨后”“清新”，空气潮湿 | after rain the air is moist
湿润/2 | “江南”“适合种水稻”，气候潮湿 | the south is moist, good for rice
明媚/1 | “春光”“去郊外踏青”，鲜明可爱 | bright spring days for an outing
明媚/2 | “阳光”“照得人心里暖洋洋的”，鲜明可爱 | bright March sunshine
坚固/1 | “一千多年了还完好无损”，结实牢固 | intact after a thousand years: solid
坚固/2 | “堤坝”要牢固 | a strong dyke
崎岖/1 | “颠簸前进”，山路高低不平 | jolting along: a rough road | 陡峭
崎岖/2 | “不平，很难走”，山路高低不平 | uneven and hard going
激动/1 | “中国队夺冠”“热泪盈眶”，感情受到刺激而冲动 | tears at the team's victory: overcome with emotion
激动/2 | “第一次登上领奖台”，心情冲动 | first time on the podium: thrilled
悲伤/1 | “小狗死了”“哭了起来”，伤心难过 | crying over the dead dog: sad
悲伤/2 | “爷爷去世的消息”，全家伤心 | grandfather's death saddens the family
焦急/1 | “天黑了，弟弟还没回家”“在门口张望”，非常着急 | dark and the boy not home: anxious
焦急/2 | “火车就要开了”“寻找妹妹”，非常着急 | the train leaving and his sister lost: anxious
轻松/1 | “这道题很简单”，做起来不费力 | an easy problem done without effort
轻松/2 | “箱子很轻，我一只手就能”，不费力 | a light box lifted with one hand
满意/1 | 看到“整齐的作业”“点了点头”，符合老师的心意 | nodding at neat work: pleased | 温和
满意/2 | “顾客对……服务非常”，符合心意 | customers satisfied with the service
温和/1 | “从来不发脾气”，说话不严厉 | never losing her temper: gentle
温和/2 | 妈妈“摸着我的头说：‘别怕。’”，态度亲切 | comforting me: gently
恐惧/1 | “第一次坐过山车”“心里充满了”，害怕 | first time on a roller coaster: fear | 激动
恐惧/2 | “被困在漆黑的山洞里”“浑身发抖”，害怕惊慌 | trapped in a dark cave, trembling: terrified
熟悉/1 | “这条路我走了很多次”，知道得清楚 | walked many times: familiar
熟悉/2 | “原来是外婆”，一听就认出的声音 | a voice I knew: grandmother's | 温和
珍惜/1 | “时间”“不能虚度一分一秒”，珍重爱惜 | not wasting a second: treasure time
珍惜/2 | “奶奶送我的礼物”，珍重爱惜 | a gift from grandmother, treasured
信任/1 | “让他保管班级的钥匙”，相信他敢托付 | trusting him with the keys
信任/2 | “朋友之间要互相”，相信对方 | friends must trust each other
善良/1 | “看到受伤的小鸟就带回家照顾”，心地没有恶意 | caring for a hurt bird: kind-hearted
善良/2 | “心肠”“常常把自己种的菜送给邻居”，心地好 | giving vegetables to neighbours: kind
无私/1 | “奉献”“从不计较个人得失”，不自私 | giving without counting personal gain: selfless
无私/2 | “大公”后面接的词，“从来不想着自己” | never thinking of himself: utterly selfless
守信/1 | “答应别人的事一定做到”，遵守诺言 | always doing what he promised: keeping his word
守信/2 | “说好下午三点来”“三点整就到了”，说到做到 | promised three o'clock and came on the dot
尊敬/1 | 对“老师”“主动问好”，恭敬地对待 | greeting teachers first: respect
尊敬/2 | “受人”的“老科学家”，被人恭敬地对待 | a respected old scientist
礼貌/1 | “见到长辈总是先打招呼”，言行恭敬 | greeting elders first: polite
礼貌/2 | “别人帮助了我们”，说谢谢要恭敬 | thanking those who help us politely | 热情
节俭/1 | “一件衣服穿了十几年”，不浪费 | one coat for over ten years: thrifty
节俭/2 | “从不乱花一分钱”，用钱有节制 | never wasting a cent: thrift
公正/1 | “不能偏向任何一方”，公平正直 | favouring no side: fair
公正/2 | “双方都没有意见”，判决公平 | both sides satisfied: a fair judgement
刻苦/1 | “常常读书到深夜”，肯下苦功 | reading late into the night: hardworking
刻苦/2 | “训练”“终于……拿到了冠军”，很能吃苦 | hard training won the title
热情/1 | “像一团火”，对人热烈亲切 | like a flame: warm
热情/2 | “好客”“端出了自家最好的饭菜”，热烈亲切 | serving their best food: hospitable
谦让/1 | “把大梨让给了哥哥”，让给别人 | giving the big pear to his brother | 礼貌
谦让/2 | “谁也不肯先吃那块蛋糕”，互相让 | neither will take the cake first
流利/1 | “用英语”“和外国朋友交谈”，说话通畅 | speaking English fluently with friends
流利/2 | “又熟又”“中间一次也没有停下来”，通畅 | recited without a single pause: fluent
生动/1 | “活灵活现”，有活力 | true to life: vivid
生动/2 | “读起来就像身临其境”，能感动人 | as if one were there: vivid
简洁/1 | “三言两语就把事情讲清楚了”，简明扼要 | clear in a few words: concise
简洁/2 | “没有一句多余的话”，简明 | not one word too many: concise
含糊/1 | “不清”“大家都没听懂”，不明确 | no one understood: vague
含糊/2 | “这件事很重要”“回答时可不能”，不清楚 | an important matter needs a clear answer
委婉/1 | “拒绝”“没有让朋友难堪”，说话不直接 | refusing without embarrassing her friend: tactfully
委婉/2 | “批评别人”“免得伤了他的心”，说话温和曲折 | criticizing gently so as not to hurt
准确/1 | “说今天下雨，果然下雨了”，符合实际 | rain as forecast: accurate
准确/2 | “一枪就打中了十环”，符合要求 | a bull's-eye with one shot: accurate
响亮/1 | “全班同学都听得清清楚楚”，声音宏大 | heard clearly by the whole class: loud
响亮/2 | 歌声“在山谷里回荡”，声音宏大 | singing echoing in the valley: resounding
夸大/1 | “一点小伤”说成“重伤”，超过原有的程度 | a scratch made into a serious wound: exaggerated
夸大/2 | 和“实事求是”相对，把事实说过头 | against sticking to facts: exaggerating
承认/1 | “勇敢地”对“自己的错误”，表示肯定 | bravely admitting his mistake
承认/2 | “犯了错误要敢于”“不能找借口”，认可错误 | daring to admit a mistake without excuses
宣布/1 | “在大会上”说“运动会明天开幕”，正式告诉大家 | announcing to the assembly
宣布/2 | “比赛结果”“我们班得了第一名”，正式告诉大家 | the result is announced
敏捷/1 | “思维”“总是第一个想出答案”，迅速灵敏 | first to find the answer: quick-witted
敏捷/2 | 守门员“动作”“扑住了这个球”，迅速灵敏 | the goalkeeper's quick save
简陋/1 | “只有几张破桌子”，简单粗陋 | only a few broken desks: crude
简陋/2 | “小木屋”，简单粗陋 | a rough little cabin
繁重/1 | “常常加班到深夜”，任务又多又重 | working late every night: heavy work
繁重/2 | “体力劳动”，又多又重 | heavy manual labour
精致/1 | 玉镯“做工”“十分漂亮”，精巧细致 | the bracelet finely made
精致/2 | “针脚细密”，精巧细致 | fine close stitches: exquisite
渺小/1 | “站在大海边”，觉得自己非常小 | by the sea one feels tiny
渺小/2 | “和浩瀚的宇宙相比”，地球非常小 | the earth tiny beside the universe
模糊/1 | “雾太大了”，房子看起来不清楚 | in thick fog the houses are blurred
模糊/2 | “时间太久了”，记忆不分明 | after so long the memory is hazy
贫乏/1 | “需要多读书”，知识不丰富 | needing more reading: little knowledge
贫乏/2 | “人们生活很艰苦”，资源缺少 | a poor region short of resources
崇高/1 | “为了人民献出了生命”，精神最高尚 | giving their lives for the people: noble
崇高/2 | “向英雄们表示”的敬意，最高的 | the highest respect to the heroes
坚定/1 | “目光”“我一定能成功”，稳定坚强 | a steady look: "I will succeed"
坚定/2 | “无论遇到什么困难”“走下去”，不动摇 | going on whatever the difficulty: firmly
安宁/1 | “战争结束了”“恢复了”，没有骚扰 | after the war, peace returns
安宁/2 | “喧闹了一天”“终于”，安静下来 | after a noisy day the town is at peace
繁荣/1 | “改革开放以后”“经济日益”，蓬勃发展 | the economy flourishing after reform
繁荣/2 | “越来越……富强”，蓬勃发展 | ever more prosperous and strong
谨慎/1 | “过马路时”“先看左右有没有车”，注意言行以免出事 | looking both ways: careful
谨慎/2 | 说话“从不乱说”，密切注意言行 | never speaking rashly: cautious | 恰当
顽强/1 | 小草“从石缝里钻了出来”，坚强不屈 | grass pushing through rock: tenacious life
顽强/2 | 战士们“守住了阵地”，坚强不屈服 | soldiers holding their position: stubbornly
恰当/1 | 说一个词“用在这里”，是合适 | a word used here: apt
恰当/2 | “选用……的词语，能让文章更生动”，是合适的词 | choosing apt words makes writing vivid
普通/1 | “只是一名……工人”，又说“却做出了不平凡的事”，是一般的 | only an ordinary worker, yet he did something extraordinary
普通/2 | “没什么特别的”，是平常的 | nothing special: an ordinary stone
清晰/1 | “每个字都听得清清楚楚”，发音清楚 | every word heard: clear pronunciation
清晰/2 | “雨停了”“又变得……起来”，看得清楚 | after the rain the peaks are clear again
永久/1 | “保存在我的相册里”，长久 | kept in my album for ever
永久/2 | “留在我的心中”，永远 | a friendship that stays for ever
拥护/1 | “新政策得到了人民群众的”，赞成并全力支持 | the policy won the people's support
拥护/2 | “全校同学都……这个决定”，赞成并支持 | the whole school backs the decision
慈祥/1 | “奶奶脸上”的笑容，老人和蔼 | grandmother's kindly smile
慈祥/2 | “老爷爷”“摸着我的头”，老人和蔼 | the old man kindly strokes my head
优秀/1 | “学习认真，被评为”学生，非常好 | a hardworking pupil named outstanding
优秀/2 | “考上了理想的中学”的成绩，非常好 | excellent marks for a good school
革新/1 | “大胆”对“技术”，“产量提高了一倍”，是除旧创新 | boldly renewing the technique doubled output
革新/2 | “不断进行技术”“生产出了更好的产品”，是创新 | constant technical innovation
揭示/1 | “恐龙灭绝的秘密”，使人看清不容易看出的事 | revealing why dinosaurs died out
揭示/2 | “小故事”对“深刻的道理”，使人看清 | a story revealing a deep truth
精密/1 | 零件“差一点都不行”，精确细密 | not the slightest error allowed: precise
精密/2 | 零件“一点误差也没有”，精确细密 | no error at all: precision-made
先进/1 | 高铁技术在“世界……水平”，水平比较高 | world-leading high-speed rail
先进/2 | “虚心学习别人的……经验”，可作榜样的 | learning from others' advanced experience
深奥/1 | “读了好几遍才明白”，道理高深 | read several times before understanding: profound
深奥/2 | “用简单的例子”讲明白的，是高深的道理 | simple examples explaining deep ideas
便捷/1 | “有了手机，人们联系”，快捷方便 | phones make contact quick and easy
便捷/2 | “高铁让人们的出行更加”，快捷方便 | high-speed rail makes travel convenient
证明/1 | “实验”对“他的猜想是正确的”，用可靠的材料表明 | the experiment proved his guess right | 揭示
证明/2 | “事实”说明“这种方法是行得通的”，是用事实表明 | the facts show the method works
广泛/1 | “应用到各个领域”，涉及的方面广 | used in every field: widely
广泛/2 | 发明得到的应用，范围大 | the invention is widely applied
精湛/1 | “烧出的瓷器像玉一样光润”，技艺精深 | porcelain like jade: consummate skill
精湛/2 | “一曲弹完，全场响起了热烈的掌声”，琴艺高明 | applause after the piece: masterly playing
神奇/1 | 药水“一碰到空气就会变色”，非常奇妙 | a liquid that changes colour in air: magical
神奇/2 | 魔术师的表演“大家都看呆了”，非常奇妙 | the magic show leaves everyone amazed | 精湛
惭愧/1 | “想起自己说过的谎话”，因做错事而不安 | remembering his lies, he is ashamed
惭愧/2 | “没有完成任务”“低下了头”，没有尽到责任而不安 | his task undone, he hangs his head
惊讶/1 | “从帽子里变出一只鸽子”“睁大了眼睛”，很意外 | eyes wide at the dove from the hat: astonished
惊讶/2 | “十岁的孩子考上了大学”，很意外 | a ten-year-old at university: amazing
愤怒/1 | “看到有人欺负小动物”，极度不满 | seeing animals bullied, he is furious
愤怒/2 | “敌人的暴行激起了”，极度不满 | the enemy's atrocities stirred anger
思念/1 | “离开家乡多年”“家乡的亲人”，想念 | far from home for years, he misses his family
思念/2 | “中秋节”“望着圆圆的月亮”“远方的爸爸”，想念 | at the moon festival I miss my father
敬佩/1 | “舍己救人的英雄”，敬重佩服 | admiring the self-sacrificing hero
敬佩/2 | “为国争光的运动员”，敬重佩服 | admiring the athletes who won glory
冷漠/1 | “从不伸手帮忙”，对别人冷淡 | never helping: indifferent
冷漠/2 | “看到有人摔倒”“走开”，不关心 | walking away from someone who fell: coldly
理解/1 | “终于……了妈妈的一片苦心”，懂了 | at last I understood my mother's care
理解/2 | “读了三遍才”，懂了文章的意思 | three readings to understand
惆怅/1 | “望着远去的列车”，伤感失意 | watching the train leave: melancholy
惆怅/2 | “就要和朝夕相处的同学分别”，伤感 | about to part from classmates: wistful
欣慰/1 | “孩子们一天天懂事”，喜欢而心安 | the children growing sensible: gratified
欣慰/2 | “弟弟的病好了”，妈妈心安地笑了 | relieved that he is well
忧虑/1 | “爷爷的病一直不见好”，忧愁担心 | his illness does not improve: worried
忧虑/2 | “这么晚了，孩子怎么还没回来”，忧愁担心 | the child is late: anxiously
澄澈/1 | “见底，能看清水底的鹅卵石”，清澈透明 | clear to the bottom: limpid
澄澈/2 | 湖水“倒映着岸边的垂柳”，清澈透明 | the lake mirrors the willows: crystal clear
苍翠/1 | “林木”“一片生机”，深绿 | the hillside trees deep green and alive
苍翠/2 | “雨后的竹林”“欲滴”，深绿 | the bamboo after rain dripping green
幽静/1 | “竹林深处”“只听得见几声鸟鸣”，清静 | deep in the bamboo, only birdsong: secluded
幽静/2 | “远离街市”，没有喧闹 | far from the market: quiet
绵延/1 | 长城“在群山之间……起伏，像一条巨龙”，连得很长 | the Wall winding over the hills like a dragon
绵延/2 | 山脉“数百里，一眼望不到头”，延续不断 | a range stretching hundreds of li
苍茫/1 | “暮色”“远处的村庄渐渐看不清了”，空阔辽远 | dusk blurs the distant village: vast and dim
苍茫/2 | 大海“望不到尽头”，看不到边际 | the sea endless: boundless
清朗/1 | “月光洒满了小院”，清澈明亮 | moonlight filling the yard: clear
清朗/2 | “中秋之夜，月色”“一片银白”，清澈明亮 | a bright moonlit night
料峭/1 | “早春二月，春寒”“柳树才冒出嫩芽”，早春的寒冷 | early spring chill
料峭/2 | “已是三月，风吹在脸上仍有几分”，早春的寒 | a nip in the March wind
绚丽/1 | 秋天的山林“色彩”“像一幅油画”，灿烂美丽 | autumn woods bright as a painting
绚丽/2 | “焰火……多彩”，色彩灿烂 | brilliant fireworks
巍峨/1 | “泰山屹立”，山高大雄伟 | Mount Tai stands lofty
巍峨/2 | 雪山“挺拔，直插云霄”，高大雄伟 | snow peaks soaring into the clouds
秀丽/1 | “少女眉目”，清秀美丽 | the girl's fine features
秀丽/2 | “小桥流水，白墙灰瓦”的风光，清秀美丽 | a pretty water town
淳朴/1 | “乡亲们”“善良，待人真诚”，诚实朴素 | honest, simple country folk
淳朴/2 | “民风”“夜不闭户”，诚实朴素 | simple ways, no doors locked at night
迂腐/1 | “死守旧规矩”，不合时宜 | clinging to old rules: pedantic
迂腐/2 | 说“读书人都”怎样，又说“这其实是一种偏见” | the prejudice that scholars are pedantic
豁达/1 | “从不为小事烦恼”，心胸开阔 | never troubled by trifles: easy-going
豁达/2 | “面对失败”“笑了笑，说下次再来”，开朗 | smiling at failure: broad-minded
刚毅/1 | “面对强敌毫无惧色”，刚强坚定 | unafraid before a strong enemy: resolute
刚毅/2 | “身材魁梧”“一看就是一位军人”，面容刚强 | a soldier's resolute face
浮躁/1 | “学习不能”“要沉下心来”，轻浮急躁 | study needs a settled mind, not impatience
浮躁/2 | “读书总是读不了几页就放下了”，不踏实 | putting books down after a few pages: restless
傲慢/1 | “对谁都爱理不理”，看不起人 | ignoring everyone: arrogant
傲慢/2 | “扬起下巴，看也不看服务员一眼”，对人没有礼貌 | chin up, not looking at the waiter: haughtily
敏锐/1 | 记者的眼睛“总能发现新闻”，眼光尖锐 | a reporter's sharp eye for news
敏锐/2 | 狗的“嗅觉”，感觉灵敏 | a dog's keen sense of smell
倔强/1 | “咬着嘴唇”“就是不肯哭出来”，不肯屈服 | biting her lip, refusing to cry: stubbornly
倔强/2 | “认准的事谁也劝不动”，固执 | no one can talk him round: stubborn
正直/1 | “敢于说真话，从不讨好有权势的人”，公正坦率 | speaking the truth to the powerful: upright
正直/2 | 包公“以……无私闻名天下”，公正 | Judge Bao famous for uprightness
庸俗/1 | 电影“只靠低级笑料吸引人”，平庸粗俗 | relying on cheap jokes: vulgar
庸俗/2 | “享乐”，和“把时间都花在读书上”相对，不高尚 | not chasing vulgar pleasures but reading
瑟缩/1 | 小猫“在火炉边，一动也不动”，身体缩起来 | the cat huddled by the stove
瑟缩/2 | “寒风中”“在墙角”，因冷缩起来 | the child shrinking in the corner from the cold
凝视/1 | “久久地”看“旧照片”“陷入了回忆”，聚精会神地看 | gazing long at the old photo
凝视/2 | “默默地”“对方，谁也没有说话”，聚精会神地看 | gazing silently at each other
迟疑/1 | “在门口……了半天，才鼓起勇气”，犹豫 | hesitating at the door before knocking
迟疑/2 | “……不决，不知该走哪一条”，拿不定主意 | unable to choose a fork: hesitant
踱步/1 | “背着手在屋里”“思考着”，慢慢来回走 | pacing with hands behind him, thinking
踱步/2 | “吃过晚饭”“在院子里”，慢慢地来回走 | strolling up and down the yard after dinner
敷衍/1 | “对待作业总是……了事”，只在表面上应付 | always skimping on homework
敷衍/2 | 店员“只是随口……了几句”，应付 | the clerk gave offhand answers
唆使/1 | “在同伴的……下”“偷偷翻进了别人的果园”，指使人做坏事 | egged on by friends to raid an orchard
唆使/2 | “你不要……弟弟去做这种危险的事”，指使做坏事 | do not put your brother up to it
炫耀/1 | “向同学”“自己的新球鞋”，夸耀自己的东西 | showing off new trainers
炫耀/2 | 孔雀“展开尾巴”，好像在夸耀美丽 | the peacock showing off its beauty
呵斥/1 | 管理员“大声”对“乱扔垃圾的人”，斥责 | the warden shouting at litterers
呵斥/2 | “做错了事，被父亲……了几句”，斥责 | scolded by his father
颤抖/1 | “寒风中，他冻得浑身”，发抖 | shivering all over in the wind | 瑟缩
颤抖/2 | “激动得声音都……了”，哆嗦 | her voice shaking with emotion
俯视/1 | “站在山顶”“整座城市尽收眼底”，从高处往下看 | from the summit the whole city below
俯视/2 | “从飞机上”看“大地”，从高处往下看 | looking down from the plane
斟酌/1 | “每个字”“反复……过”，反复考虑 | weighing every word
斟酌/2 | “再……一下，不要急着决定”，考虑后决定 | think it over before deciding
严谨/1 | “一个数据也不能马虎”，严密谨慎 | not one figure careless: rigorous
严谨/2 | 论文“结构”“论证有力”，严密没有疏漏 | a tightly built paper
武断/1 | “没有调查就下结论”，只凭主观判断 | concluding without investigation: arbitrary
武断/2 | “从不听别人的意见”，凭主观作判断 | never listening to others: dogmatic
晦涩/1 | “用词”“很多人读不懂”，不容易懂 | words few can understand: obscure
晦涩/2 | “读者看了一头雾水”，意思隐晦 | readers left baffled: obscure
坦率/1 | “承认了自己的错误”，直率 | admitting his fault frankly
坦率/2 | “心里怎么想就怎么说”，有话直说 | saying what she thinks: candid
冗长/1 | “乏味”“听众都昏昏欲睡”，废话多拉得长 | listeners dozing: long-winded
冗长/2 | “要删去一些废话”，拉得很长 | needs the padding cut: too long
牵强/1 | 解释“难以让人信服”，勉强凑合 | unconvincing: far-fetched
牵强/2 | “把两件毫不相干的事硬扯在一起”，勉强凑在一起 | forcing unrelated things together
中肯/1 | “句句说到了我的不足”，正中要害 | every word hit my weak points: to the point
中肯/2 | 建议“大家都愿意采纳”，抓住要点 | sound advice everyone takes
辩驳/1 | “事实摆在面前，他无法”，提理由反驳 | facts leave no room for rebuttal
辩驳/2 | “对方提出质疑，他据理”，反驳 | answering the challenge with reason
风趣/1 | “幽默”“逗得大家哈哈大笑”，有趣 | making everyone laugh: witty
风趣/2 | “读来令人发笑”，幽默有趣 | it makes one laugh: humorous
显著/1 | 空气质量的改善，“植树造林几年后”，非常明显 | a marked improvement after planting
显著/2 | 新药的“疗效”，非常明显 | a striking effect
精准/1 | 卫星“进入了预定轨道”，非常准确 | the satellite entering orbit precisely
精准/2 | 导航“确定汽车所在的位置”，非常准确 | navigation fixes the car's position precisely
坚硬/1 | 金刚石“最……的物质”，非常硬 | diamond, the hardest substance
坚硬/2 | 乌龟背上的“外壳”，非常硬 | the tortoise's hard shell
繁殖/1 | “鸟类”对“后代”，产生新的个体 | birds breeding young
繁殖/2 | “细菌在温暖潮湿的环境中”“得很快”，产生新个体 | bacteria multiplying fast
稳定/1 | “不容易与别的物质发生反应”，性质没有变动 | not reacting easily: stable
稳定/2 | “经过治疗”“下来”，情况没有变动 | after treatment his condition stabilized
膨胀/1 | “受热”“后变形”，体积增大 | rails expanding in heat
膨胀/2 | “空气受热”“把气球撑破了”，体积增大 | heated air bursting the balloon
凝固/1 | 水“在零摄氏度以下”“成冰”，由液体变成固体 | water freezing to ice
凝固/2 | “铁水冷却后”“成铁块”，由液体变成固体 | molten iron setting into a block
密集/1 | “高楼林立”，人口多而集中 | tower blocks everywhere: densely populated
密集/2 | 雨点“越来越”“打得窗户啪啪作响”，多而集中 | the raindrops thickening
均匀/1 | “把种子……地撒在地里”，各处一样多 | sowing seed evenly
均匀/2 | 颜料要搅拌，“涂出来的颜色才一致”，各部分相同 | mixed evenly for an even colour
罕见/1 | “百年……的大雪”，很少见到 | snow seen once in a hundred years
罕见/2 | “全世界只剩下几百只”，很少见 | only a few hundred left: rare
黯然/1 | “听到落选的消息”“离去”，情绪低落 | leaving downcast after losing
黯然/2 | “离别在即”“神伤”，心里不舒服 | sad at the parting
愧疚/1 | “对妈妈发了脾气”，心里惭愧不安 | guilty for losing his temper with his mother
愧疚/2 | “弄丢了同学的书”，惭愧不安 | guilty about the lost book
眷恋/1 | “对生他养他的故乡”，深切地留恋 | deep attachment to his homeland
眷恋/2 | “毕业离校时”“对母校的”，留恋 | attachment to the school on leaving
恼怒/1 | “无理要求”让我生气 | an unreasonable demand angers me
恼怒/2 | “一再挑衅”“猛地一拍桌子”，发怒 | provoked again and again, he slams the table
焦虑/1 | “等待考试成绩公布时”，着急不安 | waiting for results: anxious
焦虑/2 | “孩子迟迟没有回家”“在门口张望”，着急担心 | the child late home: anxiously
敬畏/1 | “面对辽阔的星空”“心生”，又敬重又害怕 | before the starry sky: awe
敬畏/2 | “对大自然怀有……之心”，又敬又畏 | reverence for nature
羡慕/1 | “看到同学得了一等奖”，希望自己也有 | wishing he had won the prize too
羡慕/2 | “她有一副好嗓子”，希望自己也有 | envying her fine voice
怜悯/1 | “瑟瑟发抖的流浪猫”“心生”，表示同情 | pity for the shivering stray
怜悯/2 | 和“真正的尊重”相对，是同情 | not pity but respect
恬淡/1 | “不慕名利”的生活，心境淡泊 | a life without seeking fame: tranquil
恬淡/2 | “从不与人争什么”，淡泊 | never competing: serene
羞涩/1 | “第一次上台演讲”，难为情 | first speech on stage: shy
羞涩/2 | “躲在妈妈身后，不敢跟客人打招呼”，难为情 | hiding behind her mother: bashful
拥挤/1 | 游人“寸步难行”，人挤在一起 | so many visitors one can hardly move: crowded
拥挤/2 | “早高峰的地铁车厢”，人挤在一起 | the rush-hour carriage: packed
喧哗/1 | “医院病房里请勿大声”，声音大而杂乱 | no loud noise in the ward
喧哗/2 | “门外一阵”“迎亲的队伍到了”，声音大而杂乱 | a commotion outside: the wedding party
衰败/1 | 老宅“年久失修”，破败 | the old house unrepaired: dilapidated
衰败/2 | “曾经兴盛一时的家族渐渐”，衰落 | the once great family declined
安详/1 | “熟睡的婴儿脸上”，神态平和 | the sleeping baby's peaceful face
安详/2 | “无论遇到什么事”“不慌不忙”，从容不迫 | whatever happens, calm and unhurried
悠闲/1 | “退休后”“每天种花养鱼”，没有事情要忙 | retired, growing flowers: a leisurely life | 安详
悠闲/2 | 鸭子“在河里……游来游去”，闲适自得 | ducks paddling about at leisure
偏僻/1 | 小山村“至今不通公路”，交通不便 | no road even now: remote
偏僻/2 | “很少有游客来”，离中心远 | few visitors come: out of the way
贫寒/1 | “母亲一件衣服穿了好多年”，家里贫穷 | one coat for years: a poor family
贫寒/2 | “靠自己的努力考上了大学”，出身贫穷 | from a poor home he made it to university
文明/1 | “不乱扔垃圾，不乱刻乱画”的游客，合乎公德 | not littering or scrawling: civilized tourists
文明/2 | “排队上车”，有教养的表现 | queueing is good manners
古朴/1 | 小镇的“街巷”保留的风貌，朴素有古风 | the old lanes keep their old charm
古朴/2 | “爷爷的爷爷传下来”的家具，朴素有古风 | furniture from great-great-grandfather: simple and old
发达/1 | “地铁通往四面八方”，交通充分发展 | the metro reaching everywhere: well developed
发达/2 | 工业“经济繁荣”，充分发展 | a developed industry, a thriving economy
弘扬/1 | “中华优秀传统文化”，发扬光大 | carrying forward fine traditional culture
弘扬/2 | “开展志愿活动”对“助人为乐的精神”，发扬光大 | volunteering to spread the spirit of helping | 倡导
遵循/1 | “客观规律”，依照着去做 | following objective laws
遵循/2 | “严格……操作规程”，依照着去做 | strictly following the procedure
推崇/1 | “书架上摆满了鲁迅的书”，十分推重 | shelves full of Lu Xun: he holds him in high esteem
推崇/2 | “简朴的生活方式”受到年轻人的推重 | the simple life is admired by the young
倡导/1 | “学校……大家绿色出行”，带头提倡 | the school promotes green travel
倡导/2 | “在会上”“节约粮食，从我做起”，带头提倡 | calling for saving food, starting with oneself
采纳/1 | “我们的建议”“把春游改到了周五”，接受意见 | our suggestion adopted, the outing moved
采纳/2 | “方案被公司……了”，接受 | the plan was accepted
妥协/1 | “面对不合理的要求，他从不”，让步 | never giving way to unreasonable demands
妥协/2 | “双方各让一步”“达成了”，用让步避免冲突 | both gave ground and reached a compromise
质疑/1 | 对“实验结论提出了”，疑问 | raising doubts about the conclusion
质疑/2 | “科学精神”“敢于……权威”，提出疑问 | science dares to question authority
印证/1 | “后来的实验结果……了他当初的猜想”，证明与事实相符 | later results bore out his guess
印证/2 | “这件事再一次”对一句话，证明相符 | the event confirms the saying again
归纳/1 | “用一句话”对“中心思想”，概括 | summing up the main idea in a sentence
归纳/2 | “从大量事实中……出了一条规律”，概括出一般道理 | drawing a rule from many facts
凸显/1 | “这个细节”对“人物的善良”，清楚地显露 | the detail brings out the kindness
凸显/2 | “随着城市的发展”“日益”，问题清楚显露 | the traffic problem stands out more and more
高耸/1 | 群山“直插云霄”，高高地直立 | mountains piercing the clouds: towering
高耸/2 | 广场中央的“纪念碑”，高高地直立 | the monument rising in the square
萧索/1 | “只剩几根枯草在风中摇晃”，缺乏生机 | only dead grass in the wind: desolate
萧索/2 | “战乱过后，城中”，冷落 | the city deserted after the war
斑驳/1 | “古墙上布满了”青苔，颜色夹杂 | moss in patches on the old wall
斑驳/2 | 阳光“透过树叶的缝隙”洒下的光影，明暗夹杂 | dappled light through the leaves
雄浑/1 | “边塞诗”“气势非凡”，雄健有气势 | a frontier poem of great power
雄浑/2 | “黄河”的涛声，雄健浑厚 | the deep roar of the Yellow River
明净/1 | “雨后”“一丝云也没有”，明朗洁净 | not a wisp of cloud after rain: clear and clean
明净/2 | 窗户“擦得……透亮”，洁净 | windows polished bright
浩渺/1 | “烟波”“水天相接”，水面广阔无边 | water meeting sky: vast
浩渺/2 | “夜空”“繁星点点”，天空广阔无边 | the vast starry sky | 明净
沉郁/1 | “杜甫的诗风格……顿挫”，低沉郁闷 | Du Fu's deep, sombre style
沉郁/2 | “神情”“好像压着很重的心事”，低沉 | a gloomy look as if weighed down
苍劲/1 | 山崖上的“古松”，老而挺拔 | an old pine on the cliff, gnarled and strong
苍劲/2 | “年过八十，写的字依然……有力”，老而有力 | at eighty his hand is still vigorous
朦胧/1 | “月色”“远处的山影若隐若现”，模糊不清 | the hills half seen in hazy moonlight
朦胧/2 | “晨雾中”“神秘”，模糊不清 | the village misty and mysterious
静穆/1 | “烈士陵园里”“人们低头默哀”，安静庄严 | heads bowed in the cemetery: solemn silence
静穆/2 | 古老的寺庙“而庄严”，安静 | the temple quiet and solemn at sunset
圆滑/1 | “见风使舵，谁也不得罪”，只顾讨好各方面 | trimming his sails to offend no one: slippery
圆滑/2 | 说话“让人摸不清他的真实想法”，只顾讨好 | no one can tell what he really thinks: evasive
宽宏/1 | “大量”“从不计较别人的冒犯”，度量大 | magnanimous, never minding offence
宽宏/2 | “原谅了”伤害过自己的人，度量大 | forgiving those who hurt her: generous heart
骄横/1 | “恶霸”“霸道，乡亲们敢怒不敢言”，蛮不讲理 | a bully the villagers fear: overbearing
骄横/2 | “仗着家里有钱”，骄傲专横 | relying on his family's money: arrogant
节制/1 | “饮食要有”“暴饮暴食对身体有害”，不过度 | eating in moderation
节制/2 | “自己的情绪，不再动不动就发火”，控制 | controlling his temper
怠慢/1 | “客人远道而来，我们可不能”，冷淡 | guests from afar must not be slighted
怠慢/2 | “招待不周”“还请原谅”，对客人不恭敬 | apologizing for poor hospitality
信守/1 | “诺言，从未失信于人”，忠实遵守 | keeping his word all his life
信守/2 | “合同，不能随意更改”，忠实遵守 | both must abide by the contract
稳健/1 | “大家都放心把任务交给他”，稳重 | trusted with tasks: steady
稳健/2 | 老将“指挥若定”的作风，不轻举妄动 | the veteran commander's steady style
推脱/1 | “互相……谁也不肯负责”，找借口不承担 | departments passing the buck
推脱/2 | “这是你分内的事”，不要找借口不做 | your own job: do not shirk it
献媚/1 | “对上司百般”，“对下属却十分刻薄”，讨好上司 | fawning on superiors, harsh to juniors
献媚/2 | “为人正直，从不向有权势的人”，讨好 | upright, never fawning on the powerful
清廉/1 | “为官”“深受百姓爱戴”，不贪污 | an honest official loved by the people
清廉/2 | 包拯“一生”“被后人称为‘包青天’”，清白廉洁 | Bao Zheng, an incorruptible official
片面/1 | “只看到缺点而看不到优点”，不全面 | seeing only faults: one-sided
片面/2 | “只听信”的一方的话，单方面的 | believing only one side's story
深刻/1 | 对社会现象的“剖析”，达到本质 | a penetrating analysis
深刻/2 | 经历留下的“印象”，深入 | a deep impression
客观/1 | “公正，不能凭个人好恶”，不加个人偏见 | judging fairly, not by likes and dislikes: objectively
客观/2 | 记者“报道事实”，按本来面目 | reporters should report facts objectively
严密/1 | 论文“结构完整，论证”，没有疏漏 | a tight argument
严密/2 | “布下了……的防线，嫌疑人插翅难飞”，周到无漏 | a tight cordon the suspect cannot escape
确凿/1 | “证据……他不得不承认了错误”，非常确实 | conclusive evidence forced his confession
确凿/2 | “史书上有……的记载”，确实 | a reliable historical record
抽象/1 | “举个例子就好懂了”，笼统空洞 | an example makes it clear: abstract
抽象/2 | “可以用具体事例来说明”，和具体相对 | explained by concrete cases: abstract
偶然/1 | “并非”，“而是长期努力的结果”，不一定发生而发生 | not luck but long effort
偶然/2 | “一次……的机会”，意外的 | by a chance opportunity
矛盾/1 | “说法前后”“让人难以相信”，前后抵触 | contradicting himself: hard to believe
矛盾/2 | “去还是不去”，心里相互抵触 | to go or not: torn
简明/1 | 说明书“扼要，一看就懂”，简单明白 | concise and clear at a glance
简明/2 | “概括文章的主要内容”的语言，简单明白 | summing up in concise language
悬殊/1 | “两队实力”“比赛几乎没有悬念”，相差很远 | teams so mismatched there is no suspense
悬殊/2 | “白天和夜晚的温差”，相差很远 | a huge difference between day and night
永恒/1 | 母爱是“文学作品中”的“主题”，永远不变 | an eternal theme
永恒/2 | 和“一切都在发展变化”相对，永远不变 | nothing is eternal, all changes
繁衍/1 | 人类“在这片土地上世代……生息”，世代延续 | living and multiplying here for generations
繁衍/2 | 鱼“没有天敌”“大量”，逐渐增多 | no predators, so the fish multiply
崛起/1 | “短短几十年，一座现代化城市在海边”，兴起 | a modern city rising by the sea
崛起/2 | “一个民族的……离不开教育”，兴起 | a nation's rise depends on education
延续/1 | 传统“已经……了几百年”，照原样继续 | a tradition kept up for centuries
延续/2 | 友谊“一直……到晚年”，继续下去 | friendship lasting into old age
逝去/1 | “怀念那些已经……的岁月”，过去 | missing years gone by
逝去/2 | “童年早已”“往事仍历历在目”，过去 | childhood long gone, yet vivid
新颖/1 | 作文“构思”“令人耳目一新”，新而别致 | a fresh idea
新颖/2 | 手机“设计”“很受年轻人欢迎”，新而别致 | a novel design popular with the young
滞后/1 | “交通建设相对”“影响了经济发展”，落在后面 | lagging transport holds back growth
滞后/2 | 法规“往往……于社会的变化”，落在后面 | laws lag behind social change
悠久/1 | “中国有……的历史”，年代久远 | China's long history
悠久/2 | 学校“历史”“已经有一百多年了”，年代久远 | a school over a hundred years old
萌发/1 | “春雨过后，种子开始”，发芽 | seeds sprouting after spring rain
萌发/2 | “心中……了当科学家的念头”，比喻发生 | the wish to be a scientist springs up
骤然/1 | “天色……暗了下来，一场暴雨就要来了”，突然 | the sky darkens suddenly before the storm
骤然/2 | “听到这个消息，他的脸色……变了”，一下子 | his face suddenly changed
凝练/1 | “二十个字写尽了离别之情”，紧凑简洁 | twenty characters saying everything: terse
凝练/2 | “用最少的字说清最要紧的事”，没有多余的话 | the fewest words for the key point: concise
生涩/1 | 译文“很多句子不通顺”，不流畅 | many sentences awkward: stilted
生涩/2 | “刚学写诗的人”“读来不够自然”，不纯熟 | a beginner's words unnatural: unpolished
细腻/1 | “连一丝犹豫都写了出来”，细致入微 | even a flicker of hesitation shown: delicate
细腻/2 | 表演“把角色的心事演得丝丝入扣”，细致 | every feeling acted out: subtle
婉约/1 | 李清照的词“多写离愁别绪”，委婉含蓄 | Li Qingzhao's delicate restrained style
婉约/2 | 宋词和“豪放”并列的另一派，委婉含蓄 | the restrained school beside the bold one
典雅/1 | 园林“古朴”“处处透出书香气”，优美不俗 | a scholarly garden: elegant
典雅/2 | 大厅的“布置”“墙上挂着几幅山水画”，优美不俗 | a tasteful hall with landscapes
空洞/1 | “辞藻华丽，内容却”，没有内容 | fine words but no content: empty
空洞/2 | “只喊口号”“无物”，没有内容 | slogans only: hollow
雕琢/1 | “刻意……字句，真情最动人”，过分修饰 | do not polish phrases; feeling moves
雕琢/2 | “过于”“反而失去了自然之美”，修饰太多 | over-wrought, it lost its natural beauty
鲜活/1 | 人物“仿佛就站在眼前”，新鲜有生气 | characters alive as if standing here
鲜活/2 | “口语”“充满了生活气息”，新鲜有生气 | lively speech full of everyday life
悲壮/1 | “明知此去不能生还，仍然踏上”征程，悲哀而雄壮 | setting out knowing he will not return: tragic and heroic
悲壮/2 | 战歌“激昂”“视死如归”，悲哀雄壮 | a stirring song of soldiers facing death
渲染/1 | “用大段景物描写”对“悲凉的气氛”，着力烘托 | scenery used to build a sad mood
渲染/2 | “被报纸过分”“闹得人人皆知”，夸大地形容 | blown up by the papers
周全/1 | “连最坏的情况都想到了”，周到全面 | even the worst case thought of: thorough | 透彻
周全/2 | “各种意外都有应对办法”，没有遗漏 | every mishap provided for: comprehensive
偏颇/1 | “只说缺点、不提优点”，偏于一方面 | only faults, no merits: biased
偏颇/2 | “只采访了一方”，不公正 | only one side interviewed: lopsided
驳斥/1 | “列出大量事实”对“谣言”，反驳错误言论 | refuting the rumour with facts
驳斥/2 | “歪曲历史的论调”“必须严正”，反驳 | false history must be rebutted
演绎/1 | 从“人都会死”推出“苏格拉底会死”，由一般推出个别 | from the general to the particular: deduction
演绎/2 | “从公理一步步推出结论”，由一般推出个别 | proving step by step from axioms
偏激/1 | 言辞“动不动就把对方说得一无是处”，过火 | always calling the other worthless: extreme
偏激/2 | 情绪“最容易说出过头的话”，过火 | in a heated mood one says too much
荒谬/1 | “说地球是平的”，极端错误 | the earth is flat: absurd
荒谬/2 | 结论“得可笑”，非常不合情理 | a ridiculous conclusion
求证/1 | “对网上的传言，要先……再决定信不信”，找证据证明 | check online rumours before believing
求证/2 | 和“大胆假设”相对，“小心”找证据 | bold guesses, careful verification
透彻/1 | 道理分析得“大家一听就明白了”，详尽深入 | explained so all understand: thoroughly
透彻/2 | “把问题研究……才能找到解决的办法”，深入 | study a problem thoroughly to solve it
盲从/1 | “书本”“要有自己的判断”，不问是非地附和 | not following books blindly
盲从/2 | “动脑思考，不能一味”，不问是非地附和 | think, do not follow experts blindly
笼统/1 | “只说‘各方面都有问题’，却没说清是哪些问题”，不具体 | "problems everywhere" without saying which: vague
笼统/2 | 计划“看不出每一步该做什么”，不明确 | no clear steps: too general
蓬勃/1 | “新兴产业……发展，为城市注入了活力”，繁荣旺盛 | new industries booming
蓬勃/2 | “朝气……的年轻人”，旺盛 | young people full of vigour
萧条/1 | “战乱过后，市面”“民不聊生”，冷落没有生气 | after the war the market lay dead
萧条/2 | “经济……的那几年，许多工厂停了产”，经济衰退 | the slump that closed the factories
变革/1 | “互联网带来了一场深刻的社会”，改变本质 | the internet brought deep social change
变革/2 | “印刷术的发明”引起传播方式的根本改变 | printing transformed how knowledge spread
传承/1 | “收徒授艺”“把剪纸手艺……下去”，传授和继承 | teaching apprentices to pass on the craft
传承/2 | “非物质文化遗产需要一代代”，传授继承 | heritage handed down generation by generation
弊端/1 | “制度存在不少”“需要尽快完善”，漏洞的害处 | flaws in the system to be fixed
弊端/2 | “过度依赖手机的”“越来越明显”，害处 | the harm of relying on phones
闭塞/1 | “山区交通”“村民很少走出大山”，交通不便 | poor roads kept villagers in the hills
闭塞/2 | “信息……的年代，一封家书要走上好几个月”，消息不灵通 | when news travelled slowly
推行/1 | “大力……垃圾分类，家家户户都学会了”，普遍实行 | the city puts sorting waste into practice
推行/2 | 新规则“将在全国”，普遍实行 | new rules applied nationwide
奢靡/1 | “花钱大手大脚”的生活，奢侈浪费 | spending freely: extravagant
奢靡/2 | “……成风而走向衰亡”，奢侈浪费 | dynasties fallen through extravagance
包容/1 | 城市“接纳来自四方的人”的胸怀，宽容大度 | a city open to people from everywhere
包容/2 | “不同文化之间应当相互”“取长补短”，能容纳 | cultures accepting each other
疏离/1 | 网络“却也可能让人与人之间变得”，有距离 | the internet may estrange people
疏离/2 | “长年在外，与家乡的亲人渐渐”，疏远 | away for years, he grew distant from his family
精确/1 | 导航“把位置……到几米之内”，非常准确 | location accurate to a few metres
精确/2 | 实验数据“差一点都不行”，非常准确 | data must be exact
衰减/1 | 信号“在长距离传输中会逐渐”，减弱 | signals weaken over distance
衰减/2 | “随着年龄增长，人的听力会慢慢”，减弱 | hearing fades with age
兼容/1 | 充电器“能……多种型号的手机”，彼此能一起用 | one charger compatible with many phones
兼容/2 | “新系统与旧文件互相”“打开毫无问题”，能一起用 | the new system opens old files
稀缺/1 | 淡水“资源，要节约用水”，稀少缺乏 | fresh water is scarce
稀缺/2 | “沙漠里水源”“植物很难生长”，稀少 | water is scarce in the desert
恒定/1 | “恒温箱里的温度保持”，固定不变 | the incubator keeps a constant temperature
恒定/2 | 自转速度“并非完全……而是有极其微小的变化”，不变 | the spin is not perfectly constant
演变/1 | 汉字“经过几千年的……才成为今天的样子”，长期变化 | characters changed over millennia
演变/2 | “自行车外形的……过程”，发展变化 | how the bicycle's shape evolved
简便/1 | 测量方法“易行，用一把尺子就能完成”，简单方便 | simple: one ruler does it
简便/2 | “用手机扫码付款”“不用再带零钱”，简单方便 | paying by phone is easy
耗费/1 | 老空调“的电太多了”，消耗 | the old unit uses too much power
耗费/2 | 修建大桥“了五年时间”，花费 | the bridge took five years
稠密/1 | “城市中心人口”“交通压力很大”，多而密 | a dense population in the centre
稠密/2 | 树林“枝叶”“阳光几乎照不进来”，多而密 | thick foliage shuts out the light
运转/1 | “机器日夜不停地”，转动 | machines running day and night
运转/2 | “停电后，工厂无法正常”，工作 | the factory cannot run without power
古雅/1 | “用古琴弹奏”“仿佛把人带回了唐朝”，古朴雅致 | the qin's old elegant tone
古雅/2 | 老街的“木板房，屋檐下挂着红灯笼”，古朴雅致 | old wooden houses: quaint
秉持/1 | “一生……诚信，从不失约”，一直守着不放 | holding to honesty all his life
秉持/2 | 老店“百年来……‘货真价实’的祖训”，坚持 | the shop has held to its motto for a century | 沿袭
传颂/1 | 岳飞的故事“千百年来被人们”，传布颂扬 | Yue Fei's story praised for centuries
传颂/2 | 诗“至今仍广为”，传布颂扬 | the poem still widely recited
渊博/1 | 老教授“学识”“讲起历史来如数家珍”，深而广 | knowing history inside out: erudite
渊博/2 | “读书破万卷”才有的知识，深而广 | ten thousand books give broad learning
沿袭/1 | 街名“……了宋代的叫法，一直没有改过”，依照旧例 | the name kept from the Song
沿袭/2 | 建筑式样“……了明清时期的风格”，依照旧传统 | following the Ming and Qing style
崇尚/1 | 古人“……‘和而不同’的处世之道”，尊重推崇 | valuing harmony in difference | 秉持
崇尚/2 | “简朴，从不追求名牌”，推崇 | prizing simplicity over brands
繁复/1 | 注释“一句原文后面跟着好几段解说”，多而复杂 | notes far longer than the text: elaborate
繁复/2 | 点心“工序”“要做整整一天”，多而复杂 | a day's work of many steps
庄重/1 | “祭孔大典的场面”“肃穆”，不随便 | the ceremony grave and solemn
庄重/2 | “在典礼上的讲话”“得体”，不轻浮 | a dignified speech
考究/1 | 饮茶“水要山泉水，杯要青瓷杯”，讲究 | particular about water and cups
考究/2 | 做衣服“一针一线都不马虎”，精美 | finely made clothes
景仰/1 | 参观“文学大师的故居”的心情，佩服尊敬 | visiting the master's home with reverence
景仰/2 | “学问和人品都令人”，佩服尊敬 | admired for learning and character
落寞/1 | “节日里，他一个人在异乡”，冷落寂寞 | alone far from home at a festival: lonely
落寞/2 | “老人……的背影让人心酸”，寂寞 | the old man's lonely figure
坦荡/1 | “心胸”“从不在背后议论别人”，宽广纯洁 | open-hearted, never gossiping
坦荡/2 | “做人要光明”“问心无愧”，心地纯洁 | open and above board
执着/1 | 对科学的追求“几十年如一日”，坚持不懈 | the same devotion for decades
执着/2 | “凭着一股……劲儿”“终于攻克了难题”，不肯放弃 | sheer persistence solved it
谦逊/1 | “取得了成绩，却始终……待人”，谦虚恭谨 | successful yet modest
谦逊/2 | 大师“总说自己还要学习”，谦虚 | the master says he still must learn
悲悯/1 | 杜甫诗中“对百姓的”感情，悲伤同情 | Du Fu's compassion for the people
悲悯/2 | “注视着小人物的命运”的眼光，同情 | a compassionate eye on ordinary lives
惶恐/1 | “做错了事”“不安地站在老师面前”，惊慌害怕 | standing before the teacher in fear
惶恐/2 | “听到这个消息”“一夜没睡好”，惊慌害怕 | too alarmed to sleep
隐忍/1 | “为了完成大业”“多年，终于等来了机会”，忍耐 | biding his time for years
隐忍/2 | “把委屈……在心里，从不对人诉说”，忍着藏起来 | keeping her grievances to herself
洒脱/1 | “几经挫折，依然吟诗作画、游山玩水”，不拘束 | after setbacks still free and easy
洒脱/2 | “挥挥手”“转身离去”，自然不拘束 | waving and turning away with ease
赤诚/1 | “……之心对待朋友”，极其真诚 | treating friends with complete sincerity
赤诚/2 | 家书“字字句句都透着”，真诚 | every word of the letter sincere
怯懦/1 | “面对恶势力，他毫不”“挺身而出”，胆小怕事 | not cowed, he stood up
怯懦/2 | 鲁迅笔下的人物“麻木，令人痛心”，胆小怕事 | Lu Xun's timid, numb characters
考证/1 | “学者多年”“确定这幅画出自宋代”，根据资料证实 | scholars established the painting's date
考证/2 | “翻阅了上百种古籍”“出这座古桥的修建年代”，考核证实 | from old books he dated the bridge
翔实/1 | 报告“材料”“数据可靠”，详细确实 | a report full of reliable detail
翔实/2 | “还原了那场战役的经过”的史料，详细确实 | detailed sources rebuilding the battle
借鉴/1 | 研究“……了国外的先进经验”，对照取长补短 | learning from foreign experience
借鉴/2 | “名家的写法，但不能照抄”，取长补短 | learn from masters, do not copy
原创/1 | “这首歌是他的……作品”，首创 | a song of his own
原创/2 | 论文“观点”“在学界引起了关注”，不是模仿的 | original views that drew notice
精深/1 | “中医博大”，精密深奥 | Chinese medicine broad and deep
精深/2 | 对甲骨文的研究“许多难认的字都是他考释出来的”，深奥精密 | deep scholarship on oracle bones
谬误/1 | 书中“几处史实”“再版时已经改正”，错误 | errors corrected in the new edition
谬误/2 | “科学就是在不断纠正……中前进的”，错误 | science advances by correcting errors
阐释/1 | “用一个生活中的例子……了这个原理”，阐述解释 | explaining the principle with an example
阐释/2 | “从三个方面……了作者的观点”，阐述解释 | expounding the view under three heads
求实/1 | 做学问的精神“不能弄虚作假”，讲求实际 | no faking: a down-to-earth spirit
求实/2 | 工作“从不说空话、大话”，讲求实际 | never empty talk: practical
验证/1 | 科学家“用实验……了这个猜想”，试验证实 | the guess tested by experiment
验证/2 | 新药效果“还需要大量临床试验来”，试验证实 | trials needed to confirm the effect
浅显/1 | 科普书“讲解了复杂的物理知识”的语言，浅而易懂 | plain words for hard physics
浅显/2 | “大家一听就懂”，浅而易懂 | so plain everyone understood
爆发/1 | “火山”“岩浆冲天而起”，因内部压力突然冲出（山洪、疾病才用“暴发”） | a volcano erupting from inner pressure
爆发/2 | 演出结束后的“掌声”，情绪突然发出 | applause bursting out
暴发/1 | “山洪”突然发作，山洪、疾病用“暴发” | a flash flood breaking out
暴发/2 | “连日暴雨后”“洪水”，突然发作 | floods after days of storms
启用/1 | “新建的图书馆”是设施，开始使用 | a new library opening for use
启用/2 | “新印章”是物品，开始使用 | a new seal coming into use
起用/1 | “新人担任主角”，是人，提拔任用 | casting a newcomer in the lead
起用/2 | “年轻的守门员”，是人，任用 | the team calling up a young keeper
制止/1 | “正在打架的两个孩子”，使正在进行的行动停止 | stopping a fight in progress
制止/2 | “及时……了这场争吵”，使正在进行的停止 | ending a quarrel in time
禁止/1 | “图书馆内……大声喧哗”，事先规定不准 | a rule forbidding noise
禁止/2 | “这条路段……货车通行”，事先规定不准 | lorries banned from the road
严厉/1 | 父亲“批评了他”，说的是态度、言辞严肃厉害 | a stern rebuke
严厉/2 | “目光”“看得人心里发慌”，态度严厉 | a stern look that unnerves
严格/1 | “质量”“不合格的一件也不能出厂”，按标准认真不放松 | strict quality checks
严格/2 | “遵守作息时间，每天六点准时起床”，执行不放松 | strictly keeping his hours
沉静/1 | “性格”“遇事从不慌乱”，性格安静稳重 | a calm nature
沉静/2 | “坐在窗前，一言不发地看书”，神情安静 | sitting quietly reading
沉寂/1 | 歌手“多年后，又推出了一张新专辑”，没有动静 | silent for years, then a new album
沉寂/2 | 火山“已经……了几百年”，没有动静 | dormant for centuries
`);
