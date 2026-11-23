// The clues of the gap sentences of the native word batches, written by hand a sentence at a time (docs/chinese-curriculum.md §6).

import { parseClues } from "./clues.ts";

/** wordClues are the clues of every gap sentence of the native word batches, by clueKey. */
export const wordClues = parseClues(`
起床/1 | “早上七点”“穿好衣服”说的是早上从床上起来 | It is seven in the morning and I get dressed next, so the word must mean getting out of bed.
起床/2 | 天亮了，公鸡叫，是在喊大家从床上起来 | Day breaks and the rooster crows as if calling everyone, so the word must mean getting out of bed. | 出门
出门/1 | 要带雨伞，说的是离开家到外面去 | You take an umbrella when you leave the house, so the word must mean going out.
出门/2 | 吃完早饭“去上班”，要先离开家 | Father goes to work after breakfast, so the word must mean leaving home.
打开/1 | “窗户”和“让新鲜的空气进来”，要把关着的窗开开 | I want fresh air to come in through the window, so the word must mean opening it.
打开/2 | “礼物盒”和“里面是”，要把盒子开开才看得见 | I see what is inside the gift box, so the word must mean opening it.
喜欢/1 | “最＿＿吃”说的是对饭菜有好感 | "Most" goes with how I feel about mother's cooking, so the word must mean liking.
喜欢/2 | 小猫爱在太阳底下睡，说的是它对这件事有好感 | The kitten chooses to sleep in the sun, so the word must mean liking to do it.
记住/1 | 过马路要看红绿灯，这件事要留在心里不忘 | Watching the traffic lights is something you must not forget, so the word must mean keeping it in mind. | 小心
记住/2 | “老师说的话”和“都……了”，说的是把话留在心里 | I kept all of what the teacher said, so the word must mean remembering.
帮忙/1 | 妈妈在做饭，“我去”洗菜，是替妈妈做事 | Mother is cooking and I go to wash the vegetables for her, so the word must mean helping.
帮忙/2 | “一个人搬不动”“请你来”，是请别人帮着解决困难 | The table is too heavy for one person and I ask you to come, so the word must mean helping.
舒服/1 | “躺在软软的床上”，身体感到轻松 | Lying on a soft bed makes the body feel at ease, so the word must mean comfortable.
舒服/2 | “洗完热水澡”“全身都”，说的是身体感到轻松愉快 | After a hot bath the whole body feels good, so the word must mean comfortable.
小心/1 | “过马路”“看清楚来往的车辆”，说的是要注意 | Crossing the road, you watch the cars coming and going, so the word must mean careful.
小心/2 | 水很满，“端的时候”要注意，不能马虎 | The cup is full to the brim when it is carried, so the word must mean careful.
好看/1 | “穿上新裙子”，说的是样子让人看了喜欢 | Everyone praises her in her new dress, so the word must mean nice-looking.
好看/2 | 画“画得真”怎样，又要“贴在墙上”，说的是样子让人喜欢 | I want to put the picture up on the wall, so the word must mean nice-looking.
热闹/1 | “来了很多客人”，人多声音多 | Many guests have come for the New Year, so the word must mean lively and bustling.
热闹/2 | “人来人往”，说的是人多很欢乐 | People come and go in the park, so the word must mean lively and bustling.
醒来/1 | “一……就听见”，说的是睡觉后刚醒过来 | "As soon as I ..., I heard the birds" tells of the moment after sleep, so the word must mean waking up.
醒来/2 | “从梦里”出来，就是睡醒过来 | My brother comes out of a dream, so the word must mean waking up.
进来/1 | “外面下雨了”，要从外面到里面来 | It is raining outside, so the word must mean coming in.
进来/2 | “门开着”“跑了＿＿”，说的是从外面到里面 | The door is open and the kitten runs through it, so the word must mean coming in.
抬头/1 | “一看，天上飞过”，要把头抬起来才看得见天上 | I see birds flying across the sky, so the word must mean raising my head.
抬头/2 | “望着天上的月亮”，要把头抬起来 | I gaze at the moon up in the sky, so the word must mean raising my head.
起立/1 | 老师进来，同学们“向老师问好”，是站起来 | The teacher comes in and the class greets her together, so the word must mean standing up.
起立/2 | “不能坐着”，就是要站起来 | No one may stay seated while the flag is raised, so the word must mean standing up.
大笑/1 | “哈哈”说的是大声地笑 | "Haha" after a funny story is the sound of it, so the word must mean laughing out loud.
大笑/2 | 看了“鬼脸”，我们都＿＿“起来”，是大声笑起来 | The clown pulls a face and we all burst into it, so the word must mean laughing out loud.
张开/1 | “翅膀”要打开才能“飞向蓝天” | A bird must do this to its wings to fly into the sky, so the word must mean spreading them.
张开/2 | “嘴巴”打开，医生才看得见牙齿 | The doctor needs to see my teeth, so the word must mean opening my mouth wide.
加快/1 | “快迟到了”，脚步要变快 | I am about to be late, so the word must mean speeding up my steps.
加快/2 | “雨越下越大”，大家把脚步变快往家走 | The rain grows heavier and everyone hurries home, so the word must mean speeding up.
走近/1 | “轻轻地”向小鸟靠近，它还是飞走了 | I step softly toward the bird, which flies off anyway, so the word must mean walking up to it.
走近/2 | “一看，原来草地上有”，是走到跟前去看 | We go over and find a frog in the grass, so the word must mean walking up close.
停下/1 | “红灯亮了”，汽车不再走 | The light has turned red for the cars, so the word must mean stopping.
停下/2 | “跑累了”“来坐在地上”，是不再跑 | The puppy is tired of running and sits down, so the word must mean stopping.
拿出/1 | “打开书包”，把书从里面取出来 | I open my schoolbag to get my Chinese book, so the word must mean taking it out.
拿出/2 | “从冰箱里”取出西瓜 | Mother gets a melon from inside the fridge, so the word must mean taking it out.
放学/1 | “背着书包走出校门”，是一天的课上完了 | The pupils carry their schoolbags out of the gate, so the word must mean school being over for the day. | 放假
放学/2 | “下午四点”“妈妈来学校接我”，是一天的课上完了 | At four in the afternoon mother comes to fetch me, so the word must mean school being over for the day.
容易/1 | “一下子就做出来了”，说的是不难 | I solved the problem at once, so the word must mean easy.
容易/2 | “笔画少”，写起来不费力 | The character has few strokes, so the word must mean easy to write.
明白/1 | “老师一讲，我就”，说的是懂了 | As soon as the teacher explained, I got it, so the word must mean understanding.
明白/2 | 问“这句话是什么意思”，是问懂了没有 | The question asks whether you know what the sentence means, so the word must mean understanding.
正确/1 | “答案”“真棒”，说的是答案对 | The answer earns a "well done", so the word must mean correct.
正确/2 | 拿笔的“方法”要用对的 | The way to hold a pen should be the proper one, so the word must mean correct.
进步/1 | “字越写越好”，是比以前更好 | Xiaoming's handwriting gets better and better, so the word must mean improvement.
进步/2 | “有了很大的”，前面是“学习”，说的是比以前更好 | With the teacher's help he does better in his studies than before, so the word must mean improvement.
回答/1 | “老师提出问题”“举手”，是对问题作出解答 | The teacher asks a question and I raise my hand, so the word must mean answering.
回答/2 | “这个问题，谁来”，是请人解答 | Someone is asked to take on the question, so the word must mean answering.
迟到/1 | “路上车太多”，过了时间才到学校 | Heavy traffic held me up on the way to school, so the word must mean being late.
迟到/2 | “早点起床”是为了上学不晚到 | I am to get up early tomorrow so that this does not happen, so the word must mean being late.
努力/1 | “学习”“长大做个有用的人”，要用心去做 | I study so as to be useful when I grow up, so the word must mean working hard.
努力/2 | “每天”练习，“终于得了第一名”，是用尽力气去做 | My brother practised every day until he came first, so the word must mean working hard.
大声/1 | “站起来”把课文读给大家听，声音要大 | I stand up to read the text to the whole class, so the word must mean loudly.
大声/2 | 在图书馆里不能说的，是声音很大的话 | In a library talking must be kept down, so the word must mean loudly.
放假/1 | “国庆节”到了，不上学 | At National Day the whole family visits the grandparents, so the word must mean having a holiday.
放假/2 | “夏天”学校“两个月”不上课 | The school stops classes for two months in summer, so the word must mean having a holiday.
白天/1 | 和“晚上”相对，说的是天亮到天黑的时候 | The cat sleeps at one time and hunts mice "at night", so the word must mean the daytime.
白天/2 | “太阳下山了”“天黑了下来”，过去的是天亮着的时间 | The sun has set and it grows dark, so the word must mean the daytime that has passed.
早晨/1 | “太阳刚出来”“公鸡就喔喔地叫了”，是天刚亮的时候 | The sun is just up and the rooster crows, so the word must mean early morning.
早晨/2 | “六点”去公园跑步，说的是天刚亮的时候 | Grandfather runs in the park at six every day, so the word must mean early morning.
升起/1 | 太阳“从东方慢慢”往高处去 | The sun moves slowly up from the east, so the word must mean rising.
升起/2 | 五星红旗在“操场上”“慢慢地”往高处去 | The flag goes slowly up over the playground, so the word must mean rising.
暖和/1 | “春天来了”“一天比一天”，天气越来越不冷 | Spring has come and the weather changes day by day, so the word must mean warm.
暖和/2 | “河里的冰化了”，天气不冷了 | The ice on the river has melted, so the word must mean warm.
晴天/1 | 说“今天是个大”，又要“去公园玩”，是有太阳的天气 | We are going to the park today, so the word must mean a sunny day.
晴天/2 | “下了三天雨”，今天“终于”有了太阳 | After three days of rain today is at last different, so the word must mean a sunny day.
开花/1 | “桃树”“粉红粉红的”，是花朵开放了 | The peach tree has turned pink all over, so the word must mean blooming.
开花/2 | “小花终于”“真香啊”，是花朵开放了 | My little flower at last smells sweet, so the word must mean blooming.
冬天/1 | “飘起了雪花”，是一年中最冷的季节 | Snowflakes are falling from the sky, so the word must mean winter.
冬天/2 | 小熊躲进洞睡大觉“一直睡到春天”，是一年中最冷的季节 | The bear sleeps in its den until spring, so the word must mean winter.
雪白/1 | “下了一夜大雪”，大地像雪一样白 | Snow fell all night and covered the ground, so the word must mean snow-white.
雪白/2 | 小白兔的毛“像一个雪球”，像雪一样白 | The rabbit's fur is like a snowball, so the word must mean snow-white.
碧绿/1 | “小草一片”，春雨后草是绿得发亮的颜色 | The grass on the hillside shines after the spring rain, so the word must mean emerald green.
碧绿/2 | “荷叶”“像一把把小伞”，说的是叶子的绿色 | The lotus leaves are like little umbrellas on the water, so the word must mean emerald green.
远处/1 | “站在山顶上，我看见”，是离得很远的地方 | From the hilltop I can see a stream a long way off, so the word must mean far away.
远处/2 | 叫声是“传来”的，从离得很远的地方 | The barking carries to us from a distance, so the word must mean far away.
生气/1 | “气得脸都红了”，是因为不合心意而不高兴 | His face has gone red with temper, so the word must mean angry.
生气/2 | “我不是故意踩你的脚”，是劝对方别不高兴 | "I didn't step on your foot on purpose" asks the other not to be cross, so the word must mean angry.
害怕/1 | “打雷了”“躲进妈妈怀里”，是心里发慌 | It thunders and she hides in her mother's arms, so the word must mean afraid.
害怕/2 | “一看见猫”“发抖”，是心里发慌 | The mouse trembles at the sight of a cat, so the word must mean afraid.
担心/1 | “奶奶生病住院了”，我放心不下 | Grandmother is ill in hospital, so the word must mean worrying about her.
担心/2 | “放心不下”“我会小心的”，是叫妈妈别怕出事 | Mother is uneasy about me walking alone at night and I tell her I'll be careful, so the word must mean worrying. | 害怕
奇怪/1 | “会是什么呢”，说的是声音跟平常的不一样 | I wonder what the noise outside the door could be, so the word must mean strange. | 温柔
奇怪/2 | “我从来没听过”，叫声跟平常的不一样 | I have never heard a call like this bird's, so the word must mean strange. | 温柔
讨厌/1 | “它总在耳边叫个不停”，说的是不喜欢蚊子 | The mosquito keeps buzzing by my ear, so the word must mean disliking it.
讨厌/2 | “每次都把青菜挑出来”，说的是不喜欢吃 | My sister picks out the greens every time, so the word must mean disliking them.
孤单/1 | “没有朋友陪它玩”，是一个人没有伴 | The rabbit has no friend to play with, so the word must mean lonely.
孤单/2 | “交到了好多朋友”“再也不”，说的是不再没有伴 | The bear has made many friends and is "no longer" without company, so the word must mean lonely. | 害羞 害怕
温柔/1 | 说的是妈妈“说话的声音”，温和不粗暴 | The sentence is about how mother's voice sounds, mild and never rough, so the word must mean gentle. | 奇怪
温柔/2 | “春风”轻轻“吹在脸上”，温和不粗暴 | The spring breeze brushes lightly over the face, so the word must mean gentle.
失望/1 | “希望落空了”，心里不痛快 | Everyone's hope of the outing came to nothing, so the word must mean disappointed.
失望/2 | “一直希望”得第一，“结果只得了第三名” | He hoped to come first but came third, so the word must mean disappointed.
害羞/1 | “一见生人，脸就红了”，是怕人笑话，不好意思 | My little sister blushes when she meets strangers, so the word must mean shy.
害羞/2 | 被“表扬”后“低下了头”，是不好意思 | Praised by the teacher, he lowers his head, so the word must mean shy.
自豪/1 | “我们班在比赛中得了第一名”，为集体感到光荣 | Our class came first in the contest, so the word must mean proud.
自豪/2 | “爸爸是一名消防员”“我为他感到”，为亲人感到光荣 | My father is a firefighter and I feel this for him, so the word must mean proud.
关心/1 | “爸爸妈妈”对“我的学习”，常常放在心上 | Mother and father keep my studies in their thoughts, so the word must mean caring about them.
关心/2 | “天冷了”“总是”想着我穿得暖不暖，是把我放在心上 | When it turns cold, mother always thinks of whether I am dressed warmly, so the word must mean caring about it.
分享/1 | “拿出来”“和同学们一起”，是一起享用 | I take out my biscuits to enjoy them with my classmates, so the word must mean sharing.
分享/2 | 好东西要“和大家”一起享用 | Good things are to be enjoyed together with everyone, so the word must mean sharing.
原谅/1 | “不小心碰倒”，他“笑着”不再怪我 | I knocked over his cup by accident and he smiled instead of blaming me, so the word must mean forgiving.
原谅/2 | “对不起，我错了”，请对方不再怪我 | "Sorry, I was wrong" asks the other not to hold it against me, so the word must mean forgiving.
争吵/1 | “谁也不让谁”，因为意见不合大声地吵 | Neither lamb will give way to the other on the bridge, so the word must mean quarrelling.
争吵/2 | “好朋友之间”“为一点小事”，说的是吵架 | Good friends should not fall out over a small thing, so the word must mean quarrelling.
亲切/1 | 老师“摸着我的头”夸我，让人感到亲近温暖 | The teacher strokes my head and praises me, which feels close and warm, so the word must mean kind and warm.
亲切/2 | “奶奶的笑容”让人感到亲近、温暖 | Grandmother's smile always makes one feel close to her, so the word must mean kind and warm.
欢迎/1 | “到我家来做客”，是高兴地迎接 | You are invited to come to my home as a guest, so the word must mean welcoming.
欢迎/2 | “新同学来了”“拍手”，是高兴地迎接他 | A new pupil arrives and everyone claps, so the word must mean welcoming him.
团聚/1 | “春节”“一家人”“在一起”，是亲人聚在一起 | At the Spring Festival the family gathers for the New Year's Eve dinner, so the word must mean reuniting.
团聚/2 | “爸爸从外地回来了”“全家终于”，是分开的亲人又在一起 | Father is back from far away and the family is together at last, so the word must mean reuniting.
照顾/1 | “奶奶生病了”“在医院”，妈妈照看她 | Grandmother is ill and mother is with her in hospital every day, so the word must mean looking after her.
照顾/2 | “我是哥哥”，要照看弟弟 | I am the older brother of the little one, so the word must mean looking after him.
听话/1 | “妈妈让他坐好，他就坐得好好的”，是听从长辈的话 | Told to sit nicely, my little brother does so at once, so the word must mean obedient.
听话/2 | “从来不让爸爸妈妈操心”，是听长辈的话 | I never give my parents anything to worry about, so the word must mean obedient.
一起/1 | “我和好朋友”同一路回家 | My friend and I walk home along the same way, so the word must mean together.
一起/2 | “我们”“来做游戏吧”，是一同做 | We are all to play the game at once, so the word must mean together.
强壮/1 | “能拉很重的车”，身体结实有力气 | The ox can pull a very heavy cart, so the word must mean strong.
强壮/2 | “多吃饭，多运动”，身体才结实 | Eating well and exercising build the body up, so the word must mean strong.
柔软/1 | “像躺在棉被里一样”，草地软和 | Lying on the grass is like lying in a quilt, so the word must mean soft.
柔软/2 | 棉花“像云朵一样”，摸上去软和 | Cotton feels like a cloud to the touch, so the word must mean soft.
笨重/1 | 大象“走起路来一步一步的”，又大又重，不灵活 | The elephant walks one heavy step at a time, so the word must mean heavy and clumsy. | 强壮
笨重/2 | 乌龟背着壳“慢慢地往前爬”，壳又大又重 | The tortoise crawls slowly under its big, heavy shell, so the word must mean heavy and clumsy. | 光滑
飞快/1 | 小兔子“跑进了树林”，跑得非常快 | The rabbit darts into the woods, so the word must mean very fast.
飞快/2 | 燕子从水面上“飞过”，非常快 | The swallow skims across the water, so the word must mean very fast.
枯萎/1 | “好几天没浇水”，花儿干枯了 | The flowers have had no water for days, so the word must mean withering.
枯萎/2 | “天气太干”，小苗干枯了 | The weather is too dry for the seedlings in the field, so the word must mean withering.
温顺/1 | “小朋友也可以骑”，说明马性情温和 | Even children can ride this horse, so the word must mean docile.
温顺/2 | “静静地坐着”，小狗温和、听话 | The puppy sits quietly before its owner, so the word must mean docile.
光滑/1 | “被水冲得圆圆的”，石头表面平，摸起来不粗 | The stones by the river have been worn round by the water, so the word must mean smooth.
光滑/2 | “结了冰”“像镜子一样”，湖面平而不粗 | The frozen lake is like a mirror, so the word must mean smooth.
香甜/1 | “苹果又大又”，说的是又香又甜 | The big apples of the autumn orchard smell good and taste sweet, so the word must mean sweet and fragrant.
香甜/2 | “蜂蜜”又香又甜 | The bear happily eats honey, so the word must mean sweet and fragrant.
挺拔/1 | 白杨树“又高又”“像一排排士兵”，又高又直 | The poplars stand by the road like rows of soldiers, so the word must mean tall and straight.
挺拔/2 | 小松树“站在山坡上”，又高又直 | The young pines stand upright on the hillside, so the word must mean tall and straight.
胆小/1 | “一听到响声就躲起来”，容易害怕 | The rabbit hides at any noise, so the word must mean timid.
胆小/2 | “晚上不敢一个人睡觉”，胆子小 | I used to be afraid to sleep alone at night, so the word must mean timid.
方便/1 | “家门口新开了一家超市”，买东西不费事 | A supermarket has opened right by our door, so the word must mean convenient.
方便/2 | “有了地铁”，出门不费事 | With the underground, going out takes little trouble, so the word must mean convenient.
宽敞/1 | 教室“又……又明亮”，是又宽又大 | The new classroom is roomy as well as bright, so the word must mean spacious.
宽敞/2 | “新房子”又宽又大 | Our family has moved into a new home with plenty of room, so the word must mean spacious.
危险/1 | “在马路上追跑打闹”，可能出事 | Chasing and playing in the street can lead to an accident, so the word must mean dangerous.
危险/2 | “河水很深”，去游泳不安全 | The river is deep for children to swim in, so the word must mean dangerous.
破旧/1 | “书皮都掉了”，书又破又旧 | The book's cover has fallen off, so the word must mean worn-out.
破旧/2 | “舍不得扔掉”，鞋又破又旧 | Grandfather cannot bear to throw away his old cloth shoes, so the word must mean worn-out.
清楚/1 | “坐在后面也能看见”，字容易看明白 | Even from the back the writing on the board can be read, so the word must mean clear.
清楚/2 | “站得太远，看不”，说的是看不明白 | I stand too far away to make it out, so the word must mean clear.
附近/1 | “我家”和“有一个小公园”，说的是离家不远 | The little park is not far from my home, so the word must mean nearby.
附近/2 | “走路五分钟就到了”，离得不远 | The school is five minutes' walk from my home, so the word must mean nearby.
特别/1 | 石头“像一只小乌龟”，跟一般的不一样 | The stone looks like a little tortoise, unlike other stones, so the word must mean unusual.
特别/2 | 身上“有一块心形的白毛”，跟一般的不一样 | The puppy has a heart-shaped patch of white fur, unlike other dogs, so the word must mean unusual.
繁忙/1 | “汽车来来往往”，事情多，没有空闲 | Cars come and go on the road all morning, so the word must mean busy.
繁忙/2 | “秋收的时候”“每天都很”，事情多，没有空闲 | At the autumn harvest the farmers have work every day, so the word must mean busy.
完整/1 | “一点也没有碎”，杯子没有损坏 | The cup fell from the table but did not break at all, so the word must mean whole and intact.
完整/2 | “一块一块拼好”，图画一块也不缺 | Piece by piece I finish the puzzle and the picture lacks nothing, so the word must mean whole. | 精彩
精彩/1 | “大家看得都站了起来”，比赛非常吸引人 | The match made everyone stand up to watch, so the word must mean exciting.
精彩/2 | “联欢会上”的“节目”，表演非常好 | The classmates put on performances at the party, so the word must mean wonderful. | 特别
勇敢/1 | “冲进火海，救出了被困的小孩”，不怕危险 | The firefighter rushes into the flames to save a trapped child, so the word must mean brave.
勇敢/2 | “跳进河里”“把落水的同学拉上了岸”，不怕危险 | Xiaoming jumps into the river to pull out a classmate, so the word must mean brave.
诚实/1 | “不能说谎骗人”，说的是说真话 | A person must not lie to deceive others, so the word must mean honest.
诚实/2 | “从来不说谎，大家都相信他”，说真话 | The child never lies and everyone believes him, so the word must mean honest.
勤劳/1 | “从早到晚不停地劳动，不怕辛苦” | The bee works from morning to night and does not mind the hard work, so the word must mean hardworking.
勤劳/2 | “天不亮就下地干活”，努力劳动 | Grandfather is in the fields before dawn every day, so the word must mean hardworking.
谦虚/1 | 考了第一名，却说“我还有很多不足”，不自满 | He came first yet says he still has many faults, so the word must mean modest.
谦虚/2 | 和“骄傲使人落后”相对，说的是不自满 | The saying sets this against "pride makes one fall behind", so the word must mean modest.
认真/1 | “每个字都写得工工整整”，做事仔细 | She writes every character neatly in her homework, so the word must mean conscientious.
认真/2 | “检查一遍，别把题目看错”，做事仔细 | After a test you go over it so as not to misread a question, so the word must mean careful and thorough.
友好/1 | “主动帮我搬桌子”，待人亲近 | The new pupil helps me move my desk without being asked, so the word must mean friendly.
友好/2 | “很多国家”“邻邦”，国家之间亲近和睦 | China and many countries are neighbours on good terms, so the word must mean friendly.
安静/1 | 图书馆里“大家都在看书”，没有吵闹 | Everyone in the library is reading, so the word must mean quiet.
安静/2 | “夜深了”“只听见虫子在叫”，没有别的声音 | Late at night only the insects can be heard in the village, so the word must mean quiet.
干净/1 | “打扫得”什么样，是不脏 | The sentence says how well mother swept the room, so the word must mean clean.
干净/2 | “饭前要把手洗”，洗到不脏 | Hands are washed before meals until no dirt is left, so the word must mean clean.
高兴/1 | “明天去春游”“跳了起来”，心里愉快 | Hearing of tomorrow's outing, the pupils jump up, so the word must mean glad.
高兴/2 | “我考了一百分”，妈妈心里愉快地笑了 | Mother smiles when she sees my full marks, so the word must mean glad.
美丽/1 | “到处开满了鲜花”，公园好看 | The park is full of flowers everywhere, so the word must mean beautiful.
美丽/2 | 孔雀“展开了”的尾巴，好看 | The peacock spreads its tail for all to see, so the word must mean beautiful.
茂盛/1 | “雨后”“庄稼长得十分”，长得多而茁壮 | After the rain the crops grow thick and well, so the word must mean flourishing.
茂盛/2 | 葡萄藤“爬满了架子”，长得多而茁壮 | The grapevine covers the whole trellis, so the word must mean flourishing.
明亮/1 | “灯光很”，光线很亮 | The sentence is about the lamplight in the classroom at night, so the word must mean bright.
明亮/2 | “窗户又大又亮”，光线充足 | The windows of the new classroom are large and let in light, so the word must mean bright.
干燥/1 | “嘴唇容易裂开，要多喝水”，空气水分少 | In winter lips crack and one should drink more water, so the word must mean dry.
干燥/2 | “受潮就不脆了”，要放在没有水分的地方 | Biscuits go soft when damp, so they must be kept somewhere that is dry.
宽阔/1 | “可以并排开六辆汽车”，马路横的距离大 | Six cars can drive side by side on the road, so the word must mean wide.
宽阔/2 | “越往下游”江面越宽 | The farther downstream, the more the Yangtze spreads out, so the word must mean wide.
清澈/1 | “能看见水底的鹅卵石”，水清得见底 | You can see the pebbles at the bottom of the stream, so the word must mean clear.
清澈/2 | “见底”，水清得能看见底 | The lake water lets you see right to the bottom, so the word must mean clear.
温暖/1 | “阳光照在身上”，不冷也不热 | Spring sunshine falls on the body, so the word must mean warm.
温暖/2 | 冬天穿的“毛衣”，让人暖和 | Mother knits me a sweater for winter, so the word must mean warm.
炎热/1 | “夏天”“喜欢去游泳”，天气很热 | In summer everyone likes to go swimming, so the word must mean hot.
炎热/2 | “太阳火辣辣的”，天气很热 | The noon sun is scorching, so the word must mean hot.
高大/1 | “个子”“特别显眼”，又高又大 | The basketball player stands out in the crowd, so the word must mean tall and big.
高大/2 | 大象“像一堵墙”，又高又大 | The elephant's body is like a wall, so the word must mean tall and big.
平坦/1 | “一点也不颠”，路没有高低 | Cycling on the road is not bumpy at all, so the word must mean flat.
平坦/2 | “一眼望不到边”的草原，没有高低起伏 | The grassland stretches out of sight without rising or falling, so the word must mean flat.
弯曲/1 | 小路“通向山顶”，有弯 | The path turns this way and that up to the hilltop, so the word must mean winding. | 平坦
弯曲/2 | 背“已经……了”“要拄着拐杖”，背不直了 | Grandfather walks with a stick and his back is no longer straight, so the word must mean bent.
整齐/1 | “横看竖看都是一条线”，有秩序不乱 | The desks and chairs make straight lines whichever way you look, so the word must mean neat and orderly.
整齐/2 | “一个个站得笔直”，队伍不乱 | The pupils do their exercises in lines, each standing straight, so the word must mean neat and orderly.
准时/1 | “上课铃一响”就走进教室，按规定的时间 | The pupils come in as soon as the bell rings, so the word must mean on time.
准时/2 | “一分钟也没有晚”，按规定的时间 | The train is not a single minute late, so the word must mean on time. | 安全
复习/1 | “学过的课文从头到尾”再学一遍 | Before the test I go over the lessons I have learned from start to finish, so the word must mean reviewing.
复习/2 | “学过的生字”“才不会忘记”，要再学 | Characters already learned are forgotten unless gone over again, so the word must mean reviewing.
提问/1 | “我第一个举手回答”，老师是提出问题来问 | I am the first to raise my hand to answer what the teacher puts to us, so the word must mean asking questions.
提问/2 | “有不懂的地方”，要向老师提出问题 | Where something is not understood, one should go to the teacher with it, so the word must mean asking a question.
表扬/1 | “拾到钱包交给了老师”，受到公开称赞 | Xiaohua handed in a wallet he found and the head teacher spoke well of him, so the word must mean commendation.
表扬/2 | “作业写得工整”“心里美滋滋的”，是被称赞了 | My neat homework is praised and I feel pleased, so the word must mean commending.
团结/1 | “全班同学”“一心”“拔河比赛中得了第一名”，联合在一起 | The whole class pulls with one heart and wins the tug of war, so the word must mean uniting.
团结/2 | “就是力量”，联合在一起才有力量 | The saying says this "is strength", so the word must mean unity.
专心/1 | “不能东张西望”，要集中注意力 | In class one must not look about, so the word must mean attentive.
专心/2 | “连妈妈叫他都没听见”，一心一意 | He does not even hear his mother call him, so the word must mean wholly absorbed.
开始/1 | “新学期”“同学们又回到了校园”，从头起 | The pupils are back at school for a new term, so the word must mean beginning.
开始/2 | “马上就要”“做好了准备”，比赛就要着手进行 | The athletes are ready for the race that is about to get under way, so the word must mean beginning.
简单/1 | “一下子就做出来了”，不复杂 | I solved the problem at once, so the word must mean simple.
简单/2 | “一学就会”，规则不复杂 | The rules of the game are learned at the first try, so the word must mean simple.
安全/1 | “不在马路上追跑打闹”，为了不出事故 | We do not chase about in the road on the way home, so that nothing happens, so the word must mean safety.
安全/2 | “打雷的时候，待在屋子里”，没有危险 | In a thunderstorm staying indoors keeps one out of danger, so the word must mean safe.
晴朗/1 | “天上一朵云也没有”，是没有云雾 | There is not a single cloud in the blue sky, so the word must mean clear and sunny.
晴朗/2 | “雨过天晴”“满天都是星星”，夜空没有云雾 | After the rain the night sky is full of stars, so the word must mean clear.
凉快/1 | “电风扇一吹”，屋子里变得清凉 | The electric fan blows and the room grows less hot, so the word must mean pleasantly cool.
凉快/2 | “不太热”，比去年清凉 | This summer is not too hot compared with last year, so the word must mean pleasantly cool.
冰冷/1 | “刺骨”“冻红了”，像冰一样冷 | The well water bites to the bone and turns hands red, so the word must mean ice-cold.
冰冷/2 | “玩了一下午雪”，手脚像冰一样冷 | After an afternoon playing in the snow my hands and feet are frozen, so the word must mean ice-cold.
猛烈/1 | 台风“吹倒了路边的大树”，风的力量强 | The typhoon wind blows down the trees by the road, so the word must mean fierce.
猛烈/2 | 雷雨“来得又快又”，气势大 | Summer thunderstorms come fast and with great force, so the word must mean fierce.
漫长/1 | “一分钟就像一小时”，时间显得长 | A minute feels like an hour while waiting, so the word must mean very long.
漫长/2 | 和“白天最短”相对，黑夜最长 | At the winter solstice the day is shortest and the night the opposite, so the word must mean longest.
融化/1 | “春天来了”，积雪变成水 | Spring has come and the snow on the hills turns to water, so the word must mean melting.
融化/2 | “冰棍拿在手里，不一会儿”，变成了水 | An ice lolly held in the hand soon turns to water, so the word must mean melting.
枯黄/1 | “秋风一吹”，草变得干枯发黄 | The autumn wind blows over the grass and dries it, so the word must mean withered and yellow.
枯黄/2 | “深秋”“一片片落下来”的叶子，干枯发黄 | In late autumn the leaves fall one by one, dry and faded, so the word must mean withered and yellow.
来临/1 | “小草从地下钻了出来”，春天到来了 | The young grass pushes up out of the ground as spring comes, so the word must mean arriving.
来临/2 | “就要”到来，“渔民们赶紧把船开回港口” | The fishermen hurry their boats back to harbour before the storm comes, so the word must mean arriving.
浓厚/1 | “起了大雾”“看不清前面的路”，雾很浓 | The fog is so heavy that the road ahead cannot be seen, so the word must mean thick.
浓厚/2 | “堆着”的乌云，“一场大雨就要来了”，云层很浓 | Dark clouds pile up and heavy rain is on the way, so the word must mean thick.
刺眼/1 | “我只好眯起眼睛”，光线太强 | The snow in the sun makes me narrow my eyes, so the word must mean glaring.
刺眼/2 | “看久了眼睛会疼”，光线太强 | The desk lamp makes the eyes hurt after a while, so the word must mean glaring.
保护/1 | “环境”“不乱扔垃圾”，是使它不受损害 | Not dropping litter keeps the environment from harm, so the word must mean protecting.
保护/2 | 大熊猫是“国家一级”什么动物，说的是要使它不受损害 | The giant panda is an animal the state guards at the first level, so the word must mean protected.
增加/1 | 人数“了一百多人”，在原来的基础上加多 | The number of pupils is up by more than a hundred, so the word must mean increasing.
增加/2 | “坚持锻炼”使力量加多 | Regular exercise gives the body more strength, so the word must mean increasing.
赞扬/1 | “在班会上”说到“乐于助人的小红”，是称赞 | At the class meeting the teacher speaks of Xiaohong, who likes helping others, so the word must mean praising.
赞扬/2 | “见义勇为的事迹”受到大家的称赞 | His brave act for a just cause is spoken well of by everyone, so the word must mean praise.
进攻/1 | “猛烈的”“终于踢进了一个球”，是主动攻击 | The team pushes hard and at last scores a goal, so the word must mean attacking.
进攻/2 | “向敌人的阵地发起”，是主动攻击 | The soldiers move against the enemy's position, so the word must mean an attack.
出发/1 | “七点”“去春游”，是离开原来的地方 | We leave at seven tomorrow morning for the spring outing, so the word must mean setting out.
出发/2 | “天还没亮”“去赶集”，是离开家到别处去 | Before dawn grandfather leaves home for the market, so the word must mean setting out.
聚集/1 | “广场上”“很多人”，是集合在一起 | Many people in the square come together for the fireworks, so the word must mean gathering.
聚集/2 | “一群蚂蚁”“在一块糖的周围”，是集合在一起 | A crowd of ants surrounds a lump of sugar, so the word must mean gathering.
隐藏/1 | “狐狸找不到它”，是藏起来 | The fox cannot find the rabbit in the grass, so the word must mean hiding.
隐藏/2 | “改变身体的颜色”，把自己藏起来不让别人发现 | The chameleon changes its colour so as not to be seen, so the word must mean hiding. | 保护
前进/1 | 船“顶着风浪继续”，是向前行动 | The boat keeps on into the wind and waves, so the word must mean moving forward.
前进/2 | “迈着整齐的步伐向终点”，是向前走 | The team marches in step toward the finish, so the word must mean moving forward.
赞成/1 | “提议”“纷纷举手”，是同意 | Everyone raises a hand for the idea of an outing, so the word must mean agreeing with it.
赞成/2 | 和“有人反对”相对，说的是同意 | The sentence sets this against "some are against it", so the word must mean being for it.
节约/1 | “用水”“随手关好水龙头”，是不浪费 | We turn off the tap so that no water is wasted, so the word must mean saving.
节约/2 | “零花钱”省下来捐出，是省着用 | He gave the pocket money he had put by to the disaster area, so the word must mean saving.
慷慨/1 | “从不小气”“把自己的东西分给大家”，是大方 | He is never stingy and gives his own things to everyone, so the word must mean generous.
慷慨/2 | “捐出自己的积蓄帮助贫困的学生”，舍得拿出财物 | Uncle gives his savings to help poor students, so the word must mean generous.
粗心/1 | “把‘8’看成了‘3’”，是不仔细 | I misread "8" as "3", so the word must mean careless.
粗心/2 | “常常丢三落四”，做事不细心 | He is always leaving things behind, so the word must mean careless.
镇定/1 | “一点也不慌”，遇到紧急情况不慌乱 | A big dog rushes out and he does not panic at all, so the word must mean calm.
镇定/2 | 和“不要惊慌”相连，遇到危险时不慌乱 | One should not panic in danger, so the word must mean staying calm.
勤奋/1 | “每天早上六点就起来读书”，不断地努力学习 | He gets up at six every morning to study, so the word must mean diligent. | 积极
勤奋/2 | 天才从什么来，后半句说“成功要靠努力” | The saying goes on "success comes from effort", so the word must mean diligence.
灵活/1 | “一下子就跳到了树上”，动作敏捷 | The monkey leaps into the tree in a flash, so the word must mean nimble.
灵活/2 | “不能死记硬背”，想办法要随机应变 | A hard problem is not solved by rote, so the word must mean flexible. | 积极
骄傲/1 | “以为乌龟一定跑不过自己”，自以为了不起 | The hare is sure the tortoise cannot beat it, so the word must mean arrogant.
骄傲/2 | “取得了好成绩也不能”，后面说“要继续努力” | Good results should be followed by more effort, not this, so the word must mean conceited.
宽容/1 | “不小心弄坏了我的笔”，我说“没关系”，是不计较 | A classmate broke my pen by accident and I said "never mind", so the word must mean forgiving.
宽容/2 | “别人的小错误”，要不计较 | Others' small mistakes should not be held against them, so the word must mean forgiving.
积极/1 | “总是”“举手回答问题”，是主动 | He always puts up his hand to answer, so the word must mean eager.
积极/2 | “报名参加植树活动”，是主动热心 | The pupils sign up for the tree planting of their own accord, so the word must mean eager.
稳重/1 | “大人们都放心让他办事”，说话做事沉着 | The grown-ups trust my brother with errands, so the word must mean steady.
稳重/2 | “从不毛毛躁躁”，沉着有分寸 | The class monitor is never hasty, so the word must mean steady and composed.
果断/1 | “关键时刻”“做出了决定”，拿定主意不犹豫 | At the crucial moment the captain makes a decision, so the word must mean decisive.
果断/2 | “从不犹豫不决”，拿定主意 | He never hesitates, so the word must mean decisive.
凶猛/1 | “常常成群地攻击羊群”，气势力量凶恶 | Wolves often attack flocks of sheep in packs, so the word must mean ferocious.
凶猛/2 | “猎手”“牙齿像锯子一样锋利”，凶恶强大 | The shark is a hunter with teeth as sharp as a saw, so the word must mean ferocious.
机灵/1 | “能听懂主人的口令”，聪明反应快 | The puppy understands its owner's commands, so the word must mean clever.
机灵/2 | “学会了用石头砸开坚果”，聪明 | The monkey has learned to crack nuts with a stone, so the word must mean clever.
捕捉/1 | 青蛙用舌头对“害虫”，是捉住 | The frog uses its long tongue on pests, so the word must mean catching.
捕捉/2 | 猫头鹰“在夜里”对“田鼠”，是捉住 | The owl goes after field mice at night, so the word must mean catching.
迁徙/1 | “成群地”“到南方去过冬”，从一地移到另一地 | Every autumn the geese fly south in flocks for the winter, so the word must mean migrating.
迁徙/2 | “一年要……好几次，寻找新鲜的青草”，成群换地方 | The wildebeest move several times a year in search of fresh grass, so the word must mean migrating.
活泼/1 | “好动”“一会儿追蝴蝶，一会儿玩线团”，生动不呆板 | The kitten chases butterflies one moment and plays with yarn the next, so the word must mean lively.
活泼/2 | “天真”“在草地上翻跟头”，生动自然 | The red panda turns somersaults on the grass, so the word must mean lively.
庞大/1 | “一条舌头就有一头大象那么重”，形体很大 | A whale's tongue alone weighs as much as an elephant, so the word must mean huge.
庞大/2 | “生活着几十万只蚂蚁”，数量很大 | Hundreds of thousands of ants may live in one colony, so the word must mean huge.
忠诚/1 | “从不吃陌生人给的食物”，对主人不变心 | The army dog never eats food from strangers, so the word must mean loyal.
忠诚/2 | “守着主人的家，一守就是十年”，不变心 | The old dog has guarded its owner's home for ten years, so the word must mean loyal.
缓慢/1 | 蜗牛“背着壳”往前爬，不迅速 | The snail crawls along with its shell on its back, so the word must mean slow.
缓慢/2 | “半天才爬了几步”，很慢 | The tortoise takes ages to crawl a few steps, so the word must mean slow.
珍稀/1 | “数量很少”，珍贵而稀少 | There are very few giant pandas, so the word must mean rare and precious.
珍稀/2 | “有的别处已经见不到了”，稀少 | Some of the birds in the forest can no longer be seen anywhere else, so the word must mean rare.
警惕/1 | “看到有人走近”“立刻……起来”“飞走了”，对危险保持警觉 | The bird sees someone coming and at once flies away, so the word must mean on guard.
警惕/2 | “遇到狼的时候要提高”，对危险的警觉 | Sheep must watch out when wolves are near, so the word must mean alertness.
修理/1 | “坏了的自行车”“好了”，是恢复原来的样子 | Father makes the broken bicycle work again, so the word must mean repairing.
修理/2 | “电视机坏了”“请师傅来”，是使它恢复作用 | The television is broken and a technician is called in, so the word must mean repairing.
吃力/1 | “石头太重了”，搬起来费力 | The big stone is too heavy for me to lift with ease, so the word must mean strenuous.
吃力/2 | “年纪大了”“要扶着栏杆慢慢走”，爬楼梯费力 | Grandfather is old and holds the rail on the stairs, so the word must mean hard going.
耐心/1 | “一点也不着急”，心里不急躁 | The old carpenter planes the board without any hurry, so the word must mean patiently. | 熟练
耐心/2 | “不能三天打鱼，两天晒网”，要不厌烦 | Learning a craft is not done in fits and starts, so the word must mean patience.
收获/1 | “秋天”“在田里”对“庄稼”，是收取成熟的农作物 | In autumn the farmers bring in the crops from the fields, so the word must mean harvesting.
收获/2 | “参观博物馆”“很大”，说的是得到的成果 | The visit to the museum taught us a lot, so the word must mean gains.
结实/1 | “用了二十年还好好的”，坚固耐用 | The wooden table is still sound after twenty years, so the word must mean sturdy.
结实/2 | “怎么拉也拉不断”，坚固 | The rope will not break however hard it is pulled, so the word must mean sturdy.
精细/1 | “连小鸟的羽毛都看得清清楚楚”，精密细致 | Even the feathers of the bird in the paper-cut can be seen clearly, so the word must mean fine and meticulous.
精细/2 | “一针一线都不能马虎”，细致 | Not a single stitch of embroidery may be careless, so the word must mean fine and meticulous.
成功/1 | 实验“了”“大家高兴得跳了起来”，得到预期的结果 | Our experiment gave the result we hoped for and we jumped for joy, so the word must mean succeeding.
成功/2 | “失败是……之母”，和失败相对 | The saying calls failure the mother of it, so the word must mean success.
熟练/1 | “开了三十年车床”，常做而有经验 | The old master has worked the lathe for thirty years, so the word must mean skilled.
熟练/2 | “经过反复练习”，做起来顺手 | After much practice he handles the computer with ease, so the word must mean skilfully.
笨拙/1 | “第一次包饺子”，动作不灵巧 | It is my first time making dumplings, so the word must mean clumsy.
笨拙/2 | 企鹅“走起路来摇摇摆摆”，不灵巧 | The penguin waddles as it walks, so the word must mean clumsy.
能干/1 | “家里的事样样都做得好”，会办事 | Mother does every job at home well, so the word must mean capable.
能干/2 | “什么活都会干”，有才能 | The young man can do any kind of work, so the word must mean capable.
繁华/1 | “大城市”，热闹兴旺 | Shanghai is a great city full of life and trade, so the word must mean bustling.
繁华/2 | “步行街灯火通明”，热闹兴旺 | The pedestrian street is ablaze with lights at night, so the word must mean bustling.
寂静/1 | “只有泉水叮咚作响”，没有别的声音 | Late at night only the spring can be heard in the valley, so the word must mean silent.
寂静/2 | “只听见笔尖沙沙的声音”，非常安静 | In the exam room only the scratch of pens can be heard, so the word must mean silent.
辽阔/1 | “疆域”“物产丰富”，宽广 | China's territory is rich in produce and stretches far, so the word must mean vast.
辽阔/2 | “草原”上放牧，宽广空旷 | The herders graze their animals on open grassland, so the word must mean vast.
陡峭/1 | 悬崖“像刀削过的一样”，直上直下 | The cliff looks as if cut straight down with a knife, so the word must mean steep.
陡峭/2 | 山坡“自行车根本骑不上去”，坡度太陡 | No bicycle can be ridden up the slope, so the word must mean steep. | 崎岖
鲜艳/1 | “红领巾”，颜色鲜明 | The Young Pioneers wear red scarves that catch the eye, so the word must mean bright-coloured.
鲜艳/2 | “花朵”，颜色鲜明美丽 | The garden is full of flowers in bright colours, so the word must mean bright-coloured.
茂密/1 | 树林“阳光都照不进来”，长得多而密 | Sunlight cannot get through the trees on the hill, so the word must mean dense.
茂密/2 | 小鹿躲进的草丛，长得密 | The fawn hides in grass that grows thick, so the word must mean dense.
湿润/1 | “雨后”“清新”，空气潮湿 | The air after rain is fresh and full of water, so the word must mean moist.
湿润/2 | “江南”“适合种水稻”，气候潮湿 | The climate south of the Yangtze suits rice, so the word must mean moist.
明媚/1 | “春光”“去郊外踏青”，鲜明可爱 | The spring scenery invites a walk in the countryside, so the word must mean bright and lovely.
明媚/2 | “阳光”“照得人心里暖洋洋的”，鲜明可爱 | The March sunshine warms the heart, so the word must mean bright and lovely.
坚固/1 | “一千多年了还完好无损”，结实牢固 | The stone bridge is undamaged after more than a thousand years, so the word must mean solid.
坚固/2 | “堤坝”要牢固 | The workers are building a dyke that must hold back water, so the word must mean solid.
崎岖/1 | “颠簸前进”，山路高低不平 | The car bumps along the mountain road, so the word must mean rugged. | 陡峭
崎岖/2 | “不平，很难走”，山路高低不平 | The path to the mountain village is uneven and hard to walk, so the word must mean rugged.
激动/1 | “中国队夺冠”“热泪盈眶”，感情受到刺激而冲动 | Hearing that the Chinese team has won, everyone's eyes fill with tears, so the word must mean deeply moved.
激动/2 | “第一次登上领奖台”，心情冲动 | She stands on the winners' podium for the first time, so the word must mean excited.
悲伤/1 | “小狗死了”“哭了起来”，伤心难过 | His puppy has died and he begins to cry, so the word must mean sad.
悲伤/2 | “爷爷去世的消息”，全家伤心 | The family hears that grandfather has died, so the word must mean sad.
焦急/1 | “天黑了，弟弟还没回家”“在门口张望”，非常着急 | It is dark, my brother is not home, and mother looks out from the door, so the word must mean anxious.
焦急/2 | “火车就要开了”“寻找妹妹”，非常着急 | The train is about to leave and he searches the crowd for his sister, so the word must mean anxious.
轻松/1 | “这道题很简单”，做起来不费力 | The problem is simple and he solves it without effort, so the word must mean easily.
轻松/2 | “箱子很轻，我一只手就能”，不费力 | The box is so light I can lift it with one hand, so the word must mean easily.
满意/1 | 看到“整齐的作业”“点了点头”，符合老师的心意 | The teacher nods at my neat homework, so the word must mean satisfied. | 温和
满意/2 | “顾客对……服务非常”，符合心意 | The customers are pleased with the service, so the word must mean satisfied.
温和/1 | “从来不发脾气”，说话不严厉 | Teacher Wang never loses her temper when she speaks, so the word must mean gentle.
温和/2 | 妈妈“摸着我的头说：‘别怕。’”，态度亲切 | Mother strokes my head and says "Don't be afraid", so the word must mean gently.
恐惧/1 | “第一次坐过山车”“心里充满了”，害怕 | His first ride on a roller coaster fills his heart, so the word must mean fear. | 激动
恐惧/2 | “被困在漆黑的山洞里”“浑身发抖”，害怕惊慌 | Trapped in a pitch-dark cave, he shakes all over, so the word must mean frightened.
熟悉/1 | “这条路我走了很多次”，知道得清楚 | I have walked this road many times, so the word must mean familiar.
熟悉/2 | “原来是外婆”，一听就认出的声音 | The voice on the phone turns out to be grandmother's, so the word must mean familiar. | 温和
珍惜/1 | “时间”“不能虚度一分一秒”，珍重爱惜 | Not a minute or a second should be wasted, so the word must mean treasuring time.
珍惜/2 | “奶奶送我的礼物”，珍重爱惜 | This is a present from grandmother, so the word must mean treasuring it.
信任/1 | “让他保管班级的钥匙”，相信他敢托付 | The teacher lets him keep the class key, so the word must mean trusting him.
信任/2 | “朋友之间要互相”，相信对方 | Friends should believe in one another, so the word must mean trusting.
善良/1 | “看到受伤的小鸟就带回家照顾”，心地没有恶意 | She takes injured birds home to care for them, so the word must mean kind-hearted.
善良/2 | “心肠”“常常把自己种的菜送给邻居”，心地好 | The old woman often gives her vegetables to the neighbours, so the word must mean kind-hearted.
无私/1 | “奉献”“从不计较个人得失”，不自私 | The teachers give without ever counting their own gain or loss, so the word must mean selflessly.
无私/2 | “大公”后面接的词，“从来不想着自己” | Lei Feng never thought of himself, and "大公" goes before the word, so it must mean selfless.
守信/1 | “答应别人的事一定做到”，遵守诺言 | He always does what he promises, so the word must mean keeping one's word.
守信/2 | “说好下午三点来”“三点整就到了”，说到做到 | Xiaoming said he would come at three and arrives at three sharp, so the word must mean keeping one's word.
尊敬/1 | 对“老师”“主动问好”，恭敬地对待 | We greet our teachers first when we see them, so the word must mean respecting them.
尊敬/2 | “受人”的“老科学家”，被人恭敬地对待 | He is an old scientist whom people hold in esteem, so the word must mean respected.
礼貌/1 | “见到长辈总是先打招呼”，言行恭敬 | He always greets his elders first, so the word must mean good manners.
礼貌/2 | “别人帮助了我们”，说谢谢要恭敬 | When others help us we say thank you, so the word must mean politely. | 热情
节俭/1 | “一件衣服穿了十几年”，不浪费 | Grandmother has worn one coat for over ten years, so the word must mean thrifty.
节俭/2 | “从不乱花一分钱”，用钱有节制 | She never wastes a single cent, so the word must mean thrift.
公正/1 | “不能偏向任何一方”，公平正直 | The referee must not favour either side, so the word must mean fair.
公正/2 | “双方都没有意见”，判决公平 | Neither side objects to the judge's ruling, so the word must mean fairly.
刻苦/1 | “常常读书到深夜”，肯下苦功 | He often reads late into the night, so the word must mean painstaking.
刻苦/2 | “训练”“终于……拿到了冠军”，很能吃苦 | After hard training he at last won the title, so the word must mean painstaking.
热情/1 | “像一团火”，对人热烈亲切 | She is like a ball of fire with people, so the word must mean warm.
热情/2 | “好客”“端出了自家最好的饭菜”，热烈亲切 | The mountain people bring out their best food for guests, so the word must mean warm and hospitable.
谦让/1 | “把大梨让给了哥哥”，让给别人 | Kong Rong, still a child, gave the big pear to his brother, so the word must mean yielding politely. | 礼貌
谦让/2 | “谁也不肯先吃那块蛋糕”，互相让 | Neither brother will take the cake first, so the word must mean yielding to each other.
流利/1 | “用英语”“和外国朋友交谈”，说话通畅 | She talks with foreign friends in English with ease, so the word must mean fluently.
流利/2 | “又熟又”“中间一次也没有停下来”，通畅 | He recites the text without stopping once, so the word must mean fluent.
生动/1 | “活灵活现”，有活力 | The writer makes the kitten seem alive on the page, so the word must mean vivid.
生动/2 | “读起来就像身临其境”，能感动人 | Reading the composition feels like being there, so the word must mean vivid.
简洁/1 | “三言两语就把事情讲清楚了”，简明扼要 | He makes the matter clear in a few words, so the word must mean concise.
简洁/2 | “没有一句多余的话”，简明 | The short text has not one sentence too many, so the word must mean concise.
含糊/1 | “不清”“大家都没听懂”，不明确 | No one understood what he was trying to say, so the word must mean vague.
含糊/2 | “这件事很重要”“回答时可不能”，不清楚 | The matter is important, so the answer must not be unclear, and the word must mean vague.
委婉/1 | “拒绝”“没有让朋友难堪”，说话不直接 | She says no to her friend without embarrassing her, so the word must mean tactfully.
委婉/2 | “批评别人”“免得伤了他的心”，说话温和曲折 | Criticism can be put so as not to hurt the other's feelings, so the word must mean tactful.
准确/1 | “说今天下雨，果然下雨了”，符合实际 | The forecast said rain and it did rain, so the word must mean accurate.
准确/2 | “一枪就打中了十环”，符合要求 | The shooter hits the bullseye with one shot, so the word must mean accurate.
响亮/1 | “全班同学都听得清清楚楚”，声音宏大 | The whole class hears his answer clearly, so the word must mean loud and clear.
响亮/2 | 歌声“在山谷里回荡”，声音宏大 | The singing echoes through the valley, so the word must mean loud and clear.
夸大/1 | “一点小伤”说成“重伤”，超过原有的程度 | He makes a small cut sound like a serious wound, so the word must mean exaggerating.
夸大/2 | 和“实事求是”相对，把事实说过头 | The sentence sets this against keeping to the facts, so the word must mean exaggerating.
承认/1 | “勇敢地”对“自己的错误”，表示肯定 | He bravely owns up to his mistake, so the word must mean admitting.
承认/2 | “犯了错误要敢于”“不能找借口”，认可错误 | A mistake should be faced without excuses, so the word must mean admitting it.
宣布/1 | “在大会上”说“运动会明天开幕”，正式告诉大家 | At the assembly the head teacher tells everyone the sports day opens tomorrow, so the word must mean announcing.
宣布/2 | “比赛结果”“我们班得了第一名”，正式告诉大家 | The results are made known and our class has come first, so the word must mean announced.
敏捷/1 | “思维”“总是第一个想出答案”，迅速灵敏 | He is always the first to think of the answer, so the word must mean quick.
敏捷/2 | 守门员“动作”“扑住了这个球”，迅速灵敏 | The goalkeeper dives and stops the ball, so the word must mean agile.
简陋/1 | “只有几张破桌子”，简单粗陋 | The classroom then had only a few broken desks, so the word must mean bare.
简陋/2 | “小木屋”，简单粗陋 | He lives in a small wooden hut, plain and rough, so the word must mean crude.
繁重/1 | “常常加班到深夜”，任务又多又重 | Father often works overtime late into the night, so the word must mean heavy.
繁重/2 | “体力劳动”，又多又重 | The farmers do hard work with their hands, so the word must mean heavy.
精致/1 | 玉镯“做工”“十分漂亮”，精巧细致 | The jade bracelet is finely made and very pretty, so the word must mean exquisite.
精致/2 | “针脚细密”，精巧细致 | The embroidery has close, fine stitches, so the word must mean exquisite.
渺小/1 | “站在大海边”，觉得自己非常小 | Standing by the sea, I feel so very small, so the word must mean tiny.
渺小/2 | “和浩瀚的宇宙相比”，地球非常小 | Beside the boundless universe the earth seems very small, so the word must mean tiny.
模糊/1 | “雾太大了”，房子看起来不清楚 | The fog is so thick that the houses far off cannot be seen clearly, so the word must mean blurred.
模糊/2 | “时间太久了”，记忆不分明 | The memory is from long ago and no longer sharp, so the word must mean blurred.
贫乏/1 | “需要多读书”，知识不丰富 | He needs to read more outside class, so the word must mean lacking.
贫乏/2 | “人们生活很艰苦”，资源缺少 | People's lives are hard in this area with few resources, so the word must mean lacking.
崇高/1 | “为了人民献出了生命”，精神最高尚 | They gave their lives for the people, so the word must mean noble.
崇高/2 | “向英雄们表示”的敬意，最高的 | The respect we show to the heroes is of the highest kind, so the word must mean lofty.
坚定/1 | “目光”“我一定能成功”，稳定坚强 | He says with a steady gaze that he will succeed, so the word must mean firm.
坚定/2 | “无论遇到什么困难”“走下去”，不动摇 | Whatever difficulty she meets, she keeps going, so the word must mean steadfastly.
安宁/1 | “战争结束了”“恢复了”，没有骚扰 | The war is over and the village is no longer disturbed, so the word must mean peace.
安宁/2 | “喧闹了一天”“终于”，安静下来 | The town that was noisy all day at last falls still at night, so the word must mean peaceful.
繁荣/1 | “改革开放以后”“经济日益”，蓬勃发展 | Since reform and opening up, the economy has grown day by day, so the word must mean prosperous.
繁荣/2 | “越来越……富强”，蓬勃发展 | Our country grows ever richer and stronger, so the word must mean prosperous.
谨慎/1 | “过马路时”“先看左右有没有车”，注意言行以免出事 | You look left and right for cars before crossing, so the word must mean cautious.
谨慎/2 | 说话“从不乱说”，密切注意言行 | He never says anything rash, so the word must mean cautious. | 恰当
顽强/1 | 小草“从石缝里钻了出来”，坚强不屈 | The grass pushes up through a crack in the rock, so the word must mean tenacious.
顽强/2 | 战士们“守住了阵地”，坚强不屈服 | The soldiers hold their position and will not give in, so the word must mean tenaciously.
恰当/1 | 说一个词“用在这里”，是合适 | The sentence judges a word used in this place, so the word must mean appropriate.
恰当/2 | “选用……的词语，能让文章更生动”，是合适的词 | Choosing the right words makes writing more vivid, so the word must mean appropriate.
普通/1 | “只是一名……工人”，又说“却做出了不平凡的事”，是一般的 | He is "only" a worker, yet he did something out of the ordinary, so the word must mean ordinary.
普通/2 | “没什么特别的”，是平常的 | There is nothing special about the stone, so the word must mean ordinary.
清晰/1 | “每个字都听得清清楚楚”，发音清楚 | Every word he says can be heard clearly, so the word must mean distinct.
清晰/2 | “雨停了”“又变得……起来”，看得清楚 | The rain has stopped and the far peaks can be made out again, so the word must mean clear.
永久/1 | “保存在我的相册里”，长久 | The photo will be kept in my album for good, so the word must mean permanently.
永久/2 | “留在我的心中”，永远 | The friendship will stay in my heart forever, so the word must mean permanently.
拥护/1 | “新政策得到了人民群众的”，赞成并全力支持 | The people stand behind the new policy, so the word must mean support.
拥护/2 | “全校同学都……这个决定”，赞成并支持 | The whole school is for the decision and backs it, so the word must mean supporting.
慈祥/1 | “奶奶脸上”的笑容，老人和蔼 | Grandmother always has a smile on her face, so the word must mean kindly.
慈祥/2 | “老爷爷”“摸着我的头”，老人和蔼 | The old man strokes my head, so the word must mean kindly.
优秀/1 | “学习认真，被评为”学生，非常好 | She studies hard and is named a pupil of high merit, so the word must mean excellent.
优秀/2 | “考上了理想的中学”的成绩，非常好 | His marks got him into the school he wanted, so the word must mean excellent.
革新/1 | “大胆”对“技术”，“产量提高了一倍”，是除旧创新 | The workers boldly changed their methods and doubled output, so the word must mean innovating.
革新/2 | “不断进行技术”“生产出了更好的产品”，是创新 | The factory keeps improving its technology and makes better products, so the word must mean innovation.
揭示/1 | “恐龙灭绝的秘密”，使人看清不容易看出的事 | The research shows people the secret of why the dinosaurs died out, so the word must mean revealing.
揭示/2 | “小故事”对“深刻的道理”，使人看清 | A short story brings out a deep truth, so the word must mean revealing.
精密/1 | 零件“差一点都不行”，精确细密 | The parts in a watch must not be off even a little, so the word must mean precise.
精密/2 | 零件“一点误差也没有”，精确细密 | The machine parts are made without the slightest error, so the word must mean precise.
先进/1 | 高铁技术在“世界……水平”，水平比较高 | China's high-speed rail is at the world's leading level, so the word must mean advanced.
先进/2 | “虚心学习别人的……经验”，可作榜样的 | They learned from others' experience to improve their factory, so the word must mean advanced.
深奥/1 | “读了好几遍才明白”，道理高深 | I read the book several times before I understood it, so the word must mean profound.
深奥/2 | “用简单的例子”讲明白的，是高深的道理 | Grandfather explains a deep truth with simple examples, so the word must mean profound.
便捷/1 | “有了手机，人们联系”，快捷方便 | With mobile phones keeping in touch is quick and easy, so the word must mean convenient.
便捷/2 | “高铁让人们的出行更加”，快捷方便 | High-speed trains make travel quicker and easier, so the word must mean convenient.
证明/1 | “实验”对“他的猜想是正确的”，用可靠的材料表明 | The experiment shows his guess to be right, so the word must mean proving. | 揭示
证明/2 | “事实”说明“这种方法是行得通的”，是用事实表明 | The facts show that the method works, so the word must mean proving.
广泛/1 | “应用到各个领域”，涉及的方面广 | Computers are used in every field, so the word must mean widely.
广泛/2 | 发明得到的应用，范围大 | The invention is put to use in many areas, so the word must mean wide-ranging.
精湛/1 | “烧出的瓷器像玉一样光润”，技艺精深 | The old craftsman fires porcelain as smooth as jade, so the word must mean consummate.
精湛/2 | “一曲弹完，全场响起了热烈的掌声”，琴艺高明 | When he finishes playing the whole hall applauds, so the word must mean consummate.
神奇/1 | 药水“一碰到空气就会变色”，非常奇妙 | The liquid changes colour as soon as it touches the air, so the word must mean marvellous.
神奇/2 | 魔术师的表演“大家都看呆了”，非常奇妙 | Everyone stares open-mouthed at the magician's act, so the word must mean marvellous. | 精湛
惭愧/1 | “想起自己说过的谎话”，因做错事而不安 | I remember a lie I told, so the word must mean ashamed.
惭愧/2 | “没有完成任务”“低下了头”，没有尽到责任而不安 | He did not finish the task and lowers his head, so the word must mean ashamed.
惊讶/1 | “从帽子里变出一只鸽子”“睁大了眼睛”，很意外 | The magician pulls a dove from his hat and everyone's eyes go wide, so the word must mean astonished.
惊讶/2 | “十岁的孩子考上了大学”，很意外 | A ten-year-old has got into university, so the word must mean astonished.
愤怒/1 | “看到有人欺负小动物”，极度不满 | He sees someone bullying small animals, so the word must mean angry.
愤怒/2 | “敌人的暴行激起了”，极度不满 | The enemy's atrocities stir up people's outrage, so the word must mean indignation.
思念/1 | “离开家乡多年”“家乡的亲人”，想念 | He left home years ago and still thinks of his family there, so the word must mean missing them.
思念/2 | “中秋节”“望着圆圆的月亮”“远方的爸爸”，想念 | Looking at the full moon at the Mid-Autumn Festival I think of my father far away, so the word must mean missing him.
敬佩/1 | “舍己救人的英雄”，敬重佩服 | The hero gave himself to save others, so the word must mean admiring him.
敬佩/2 | “为国争光的运动员”，敬重佩服 | The athletes have won honour for the country, so the word must mean admiring them.
冷漠/1 | “从不伸手帮忙”，对别人冷淡 | He never lends a hand when others are in trouble, so the word must mean indifferent.
冷漠/2 | “看到有人摔倒”“走开”，不关心 | We must not walk away when someone falls, so the word must mean indifferently.
理解/1 | “终于……了妈妈的一片苦心”，懂了 | At last I see why mother took such pains, so the word must mean understanding.
理解/2 | “读了三遍才”，懂了文章的意思 | I read the essay three times before I got its meaning, so the word must mean understanding.
惆怅/1 | “望着远去的列车”，伤感失意 | He watches the train pull away, so the word must mean wistful.
惆怅/2 | “就要和朝夕相处的同学分别”，伤感 | She is about to part from the classmates she saw every day, so the word must mean melancholy.
欣慰/1 | “孩子们一天天懂事”，喜欢而心安 | The children grow more sensible day by day, so the word must mean gratified.
欣慰/2 | “弟弟的病好了”，妈妈心安地笑了 | My brother has recovered, so the word must mean relieved.
忧虑/1 | “爷爷的病一直不见好”，忧愁担心 | Grandfather's illness does not get better, so the word must mean worried.
忧虑/2 | “这么晚了，孩子怎么还没回来”，忧愁担心 | Mother wonders why the child is not back so late, so the word must mean worriedly.
澄澈/1 | “见底，能看清水底的鹅卵石”，清澈透明 | You can see the pebbles at the bottom of the stream, so the word must mean crystal clear.
澄澈/2 | 湖水“倒映着岸边的垂柳”，清澈透明 | The lake mirrors the willows on its banks, so the word must mean crystal clear.
苍翠/1 | “林木”“一片生机”，深绿 | The trees on the hillside are full of life, so the word must mean dark green.
苍翠/2 | “雨后的竹林”“欲滴”，深绿 | The bamboo after rain looks green enough to drip, so the word must mean dark green.
幽静/1 | “竹林深处”“只听得见几声鸟鸣”，清静 | Deep in the bamboo only a few birdcalls can be heard, so the word must mean quiet and secluded.
幽静/2 | “远离街市”，没有喧闹 | The courtyard is far from the busy streets, so the word must mean quiet and secluded.
绵延/1 | 长城“在群山之间……起伏，像一条巨龙”，连得很长 | The Great Wall rises and falls among the mountains like a dragon, so the word must mean stretching on and on.
绵延/2 | 山脉“数百里，一眼望不到头”，延续不断 | The mountain range runs for hundreds of li beyond sight, so the word must mean stretching on and on.
苍茫/1 | “暮色”“远处的村庄渐渐看不清了”，空阔辽远 | Dusk falls and the far villages fade from sight, so the word must mean vast and hazy.
苍茫/2 | 大海“望不到尽头”，看不到边际 | The sea has no end in sight, so the word must mean vast and hazy.
清朗/1 | “月光洒满了小院”，清澈明亮 | Moonlight fills the little courtyard, so the word must mean clear and bright.
清朗/2 | “中秋之夜，月色”“一片银白”，清澈明亮 | On Mid-Autumn night the moon turns the courtyard silver, so the word must mean clear and bright.
料峭/1 | “早春二月，春寒”“柳树才冒出嫩芽”，早春的寒冷 | In early spring the willows are only just budding, so the word must mean chilly.
料峭/2 | “已是三月，风吹在脸上仍有几分”，早春的寒 | It is already March but the wind on the face still has a bite, so the word must mean chilly.
绚丽/1 | 秋天的山林“色彩”“像一幅油画”，灿烂美丽 | The autumn woods are like an oil painting, so the word must mean gorgeous.
绚丽/2 | “焰火……多彩”，色彩灿烂 | The fireworks fill the festive sky with colour, so the word must mean gorgeous.
巍峨/1 | “泰山屹立”，山高大雄伟 | Mount Tai stands high over the land of Qi and Lu, so the word must mean towering.
巍峨/2 | 雪山“挺拔，直插云霄”，高大雄伟 | The snow mountains rise straight into the clouds, so the word must mean towering.
秀丽/1 | “少女眉目”，清秀美丽 | The girl in the painting has a fine, delicate face, so the word must mean beautiful.
秀丽/2 | “小桥流水，白墙灰瓦”的风光，清秀美丽 | The water town has little bridges, streams, white walls and grey tiles, so the word must mean beautiful.
淳朴/1 | “乡亲们”“善良，待人真诚”，诚实朴素 | The villagers in the hills are kind and sincere with people, so the word must mean simple and honest.
淳朴/2 | “民风”“夜不闭户”，诚实朴素 | Here no one needs to lock the door at night, so the word must mean simple and honest.
迂腐/1 | “死守旧规矩”，不合时宜 | The old gentleman clings to outdated rules, so the word must mean pedantic.
迂腐/2 | 说“读书人都”怎样，又说“这其实是一种偏见” | The sentence calls the view that all scholars are like this a prejudice, so the word must mean pedantic.
豁达/1 | “从不为小事烦恼”，心胸开阔 | Grandfather is never troubled by small things, so the word must mean open-minded.
豁达/2 | “面对失败”“笑了笑，说下次再来”，开朗 | Faced with failure, he smiles and says he will try again, so the word must mean open-mindedly.
刚毅/1 | “面对强敌毫无惧色”，刚强坚定 | The soldiers show no fear before a strong enemy, so the word must mean resolute.
刚毅/2 | “身材魁梧”“一看就是一位军人”，面容刚强 | He is broad and strong and looks every bit a soldier, so the word must mean resolute.
浮躁/1 | “学习不能”“要沉下心来”，轻浮急躁 | Study needs a settled mind, so the word must mean impetuous.
浮躁/2 | “读书总是读不了几页就放下了”，不踏实 | He never reads more than a few pages before putting the book down, so the word must mean restless.
傲慢/1 | “对谁都爱理不理”，看不起人 | He hardly bothers to answer anyone, so the word must mean arrogant.
傲慢/2 | “扬起下巴，看也不看服务员一眼”，对人没有礼貌 | The guest lifts his chin and does not even look at the waiter, so the word must mean arrogantly.
敏锐/1 | 记者的眼睛“总能发现新闻”，眼光尖锐 | The reporter's eyes always find the news, so the word must mean keen.
敏锐/2 | 狗的“嗅觉”，感觉灵敏 | The sentence is about a dog's sense of smell, so the word must mean keen.
倔强/1 | “咬着嘴唇”“就是不肯哭出来”，不肯屈服 | The girl bites her lip and will not let herself cry, so the word must mean stubbornly.
倔强/2 | “认准的事谁也劝不动”，固执 | No one can talk him out of what he has decided, so the word must mean stubborn.
正直/1 | “敢于说真话，从不讨好有权势的人”，公正坦率 | He dares to tell the truth and never flatters the powerful, so the word must mean upright.
正直/2 | 包公“以……无私闻名天下”，公正 | Lord Bao is famous for being fair and selfless, so the word must mean upright.
庸俗/1 | 电影“只靠低级笑料吸引人”，平庸粗俗 | The film relies only on cheap jokes, so the word must mean vulgar.
庸俗/2 | “享乐”，和“把时间都花在读书上”相对，不高尚 | He spends his time reading instead of chasing low pleasures, so the word must mean vulgar.
瑟缩/1 | 小猫“在火炉边，一动也不动”，身体缩起来 | The kitten curls up by the stove without moving, so the word must mean huddling.
瑟缩/2 | “寒风中”“在墙角”，因冷缩起来 | The child curls up in a corner out of the cold wind, so the word must mean cowering.
凝视/1 | “久久地”看“旧照片”“陷入了回忆”，聚精会神地看 | She looks at the old photo for a long time, lost in memories, so the word must mean gazing.
凝视/2 | “默默地”“对方，谁也没有说话”，聚精会神地看 | The two look at each other in silence, so the word must mean gazing.
迟疑/1 | “在门口……了半天，才鼓起勇气”，犹豫 | He stands at the door a long while before he finds the courage to knock, so the word must mean hesitating.
迟疑/2 | “……不决，不知该走哪一条”，拿不定主意 | Facing a fork in the road, she cannot decide which way to go, so the word must mean hesitating.
踱步/1 | “背着手在屋里”“思考着”，慢慢来回走 | Hands behind his back, he walks up and down the room thinking, so the word must mean pacing.
踱步/2 | “吃过晚饭”“在院子里”，慢慢地来回走 | After supper grandfather likes to walk slowly to and fro in the courtyard, so the word must mean pacing.
敷衍/1 | “对待作业总是……了事”，只在表面上应付 | He always gets his homework out of the way with as little as he can, so the word must mean doing it perfunctorily.
敷衍/2 | 店员“只是随口……了几句”，应付 | The shop assistant tosses off a few careless words to the customer, so the word must mean fobbing off.
唆使/1 | “在同伴的……下”“偷偷翻进了别人的果园”，指使人做坏事 | His friends put him up to climbing into someone's orchard, so the word must mean instigation.
唆使/2 | “你不要……弟弟去做这种危险的事”，指使做坏事 | Don't get your brother to do something so dangerous, so the word must mean instigating.
炫耀/1 | “向同学”“自己的新球鞋”，夸耀自己的东西 | He likes to show his classmates his new trainers, so the word must mean showing off.
炫耀/2 | 孔雀“展开尾巴”，好像在夸耀美丽 | The peacock spreads its tail as if proud of its beauty, so the word must mean showing off.
呵斥/1 | 管理员“大声”对“乱扔垃圾的人”，斥责 | The warden shouts at the people dropping litter, so the word must mean scolding loudly.
呵斥/2 | “做错了事，被父亲……了几句”，斥责 | He did something wrong and his father told him off, so the word must mean scolded.
颤抖/1 | “寒风中，他冻得浑身”，发抖 | He is frozen all over in the cold wind, so the word must mean trembling. | 瑟缩
颤抖/2 | “激动得声音都……了”，哆嗦 | Her voice shakes with emotion, so the word must mean trembling.
俯视/1 | “站在山顶”“整座城市尽收眼底”，从高处往下看 | From the hilltop the whole city lies below, so the word must mean looking down.
俯视/2 | “从飞机上”看“大地”，从高处往下看 | From the plane the fields look like chessboards, so the word must mean looking down.
斟酌/1 | “每个字”“反复……过”，反复考虑 | He went over every word of his composition again and again, so the word must mean weighing carefully.
斟酌/2 | “再……一下，不要急着决定”，考虑后决定 | Don't rush to decide, so the word must mean weighing it carefully.
严谨/1 | “一个数据也不能马虎”，严密谨慎 | In scientific research not a single figure may be careless, so the word must mean rigorous.
严谨/2 | 论文“结构”“论证有力”，严密没有疏漏 | The paper argues forcefully in a tight structure, so the word must mean rigorous.
武断/1 | “没有调查就下结论”，只凭主观判断 | He draws a conclusion without any investigation, so the word must mean arbitrary.
武断/2 | “从不听别人的意见”，凭主观作判断 | He never listens to others, so the word must mean arbitrary.
晦涩/1 | “用词”“很多人读不懂”，不容易懂 | Many people cannot understand the poem's words, so the word must mean obscure.
晦涩/2 | “读者看了一头雾水”，意思隐晦 | Readers are left in a fog, so the word must mean obscure.
坦率/1 | “承认了自己的错误”，直率 | He owns up to his mistake openly, so the word must mean frankly.
坦率/2 | “心里怎么想就怎么说”，有话直说 | She says whatever she thinks, so the word must mean frank.
冗长/1 | “乏味”“听众都昏昏欲睡”，废话多拉得长 | His listeners are falling asleep at his dull speech, so the word must mean long-winded.
冗长/2 | “要删去一些废话”，拉得很长 | The essay needs some empty words cut out, so the word must mean verbose.
牵强/1 | 解释“难以让人信服”，勉强凑合 | The explanation is hard to believe, so the word must mean far-fetched.
牵强/2 | “把两件毫不相干的事硬扯在一起”，勉强凑在一起 | He forces two unrelated things together, so the word must mean far-fetched.
中肯/1 | “句句说到了我的不足”，正中要害 | Every sentence of the teacher's comment names one of my weaknesses, so the word must mean to the point.
中肯/2 | 建议“大家都愿意采纳”，抓住要点 | Everyone is willing to take up his suggestions, so the word must mean to the point.
辩驳/1 | “事实摆在面前，他无法”，提理由反驳 | The facts are plain before him and he has nothing to argue back with, so the word must mean refuting.
辩驳/2 | “对方提出质疑，他据理”，反驳 | The other side raises doubts and he argues back on solid grounds, so the word must mean refuting.
风趣/1 | “幽默”“逗得大家哈哈大笑”，有趣 | His humour often makes everyone laugh out loud, so the word must mean witty.
风趣/2 | “读来令人发笑”，幽默有趣 | The short essay makes readers laugh, so the word must mean witty.
显著/1 | 空气质量的改善，“植树造林几年后”，非常明显 | A few years after tree planting the air is much better, so the word must mean marked.
显著/2 | 新药的“疗效”，非常明显 | The sentence is about how clearly the new drug works, so the word must mean marked.
精准/1 | 卫星“进入了预定轨道”，非常准确 | The satellite enters exactly the planned orbit, so the word must mean precisely.
精准/2 | 导航“确定汽车所在的位置”，非常准确 | The navigation system finds exactly where the car is, so the word must mean precisely.
坚硬/1 | 金刚石“最……的物质”，非常硬 | Diamond is the most of all natural substances, so the word must mean hard.
坚硬/2 | 乌龟背上的“外壳”，非常硬 | The tortoise carries a shell on its back, so the word must mean hard.
繁殖/1 | “鸟类”对“后代”，产生新的个体 | Spring is the season when many birds produce young, so the word must mean reproducing.
繁殖/2 | “细菌在温暖潮湿的环境中”“得很快”，产生新个体 | Bacteria multiply fast where it is warm and damp, so the word must mean reproducing.
稳定/1 | “不容易与别的物质发生反应”，性质没有变动 | The substance does not easily react with others, so the word must mean stable.
稳定/2 | “经过治疗”“下来”，情况没有变动 | After treatment the patient's condition stops changing, so the word must mean stable.
膨胀/1 | “受热”“后变形”，体积增大 | Gaps are left between rails so that heat does not bend them out of shape, so the word must mean expanding.
膨胀/2 | “空气受热”“把气球撑破了”，体积增大 | The heated air bursts the balloon, so the word must mean expanding.
凝固/1 | 水“在零摄氏度以下”“成冰”，由液体变成固体 | Below zero degrees water turns to ice, so the word must mean solidifying.
凝固/2 | “铁水冷却后”“成铁块”，由液体变成固体 | Molten iron cools into lumps of iron, so the word must mean solidifying.
密集/1 | “高楼林立”，人口多而集中 | Tall buildings crowd this area, so the word must mean dense.
密集/2 | 雨点“越来越”“打得窗户啪啪作响”，多而集中 | The raindrops beat ever harder on the window, so the word must mean dense.
均匀/1 | “把种子……地撒在地里”，各处一样多 | The farmer scatters the seed so each patch gets as much, so the word must mean evenly.
均匀/2 | 颜料要搅拌，“涂出来的颜色才一致”，各部分相同 | Paint must be stirred so its colour is the same all over, so the word must mean even.
罕见/1 | “百年……的大雪”，很少见到 | The snow this winter is the heaviest in a hundred years, so the word must mean rare.
罕见/2 | “全世界只剩下几百只”，很少见 | Only a few hundred of these birds are left in the world, so the word must mean rare.
黯然/1 | “听到落选的消息”“离去”，情绪低落 | He hears he has not been chosen and leaves, so the word must mean dejected.
黯然/2 | “离别在即”“神伤”，心里不舒服 | Parting is near and she feels downcast, so the word must mean dejected.
愧疚/1 | “对妈妈发了脾气”，心里惭愧不安 | He remembers losing his temper with mother yesterday, so the word must mean guilty.
愧疚/2 | “弄丢了同学的书”，惭愧不安 | I lost a classmate's book, so the word must mean guilty.
眷恋/1 | “对生他养他的故乡”，深切地留恋 | He feels a deep tie to the home that raised him, so the word must mean attachment.
眷恋/2 | “毕业离校时”“对母校的”，留恋 | Leaving school at graduation, I am full of feeling for it, so the word must mean attachment.
恼怒/1 | “无理要求”让我生气 | His unreasonable demand makes me cross, so the word must mean angry.
恼怒/2 | “一再挑衅”“猛地一拍桌子”，发怒 | After repeated provocation he slams the table, so the word must mean angry.
焦虑/1 | “等待考试成绩公布时”，着急不安 | I am waiting for the exam results, so the word must mean anxious.
焦虑/2 | “孩子迟迟没有回家”“在门口张望”，着急担心 | The child is late home and the mother looks out from the door, so the word must mean anxiously.
敬畏/1 | “面对辽阔的星空”“心生”，又敬重又害怕 | Facing the vast starry sky, people feel both respect and fear, so the word must mean awe.
敬畏/2 | “对大自然怀有……之心”，又敬又畏 | People should hold nature in both respect and fear, so the word must mean awe.
羡慕/1 | “看到同学得了一等奖”，希望自己也有 | A classmate has won first prize, so the word must mean envying him.
羡慕/2 | “她有一副好嗓子”，希望自己也有 | Everyone wishes they had her fine voice, so the word must mean envying her.
怜悯/1 | “瑟瑟发抖的流浪猫”“心生”，表示同情 | A stray cat shivers in the street, so the word must mean pity.
怜悯/2 | 和“真正的尊重”相对，是同情 | The sentence sets this against true respect, so the word must mean pity.
恬淡/1 | “不慕名利”的生活，心境淡泊 | The old man never cared for fame or gain, so the word must mean unworldly.
恬淡/2 | “从不与人争什么”，淡泊 | She never competes with anyone for anything, so the word must mean unworldly.
羞涩/1 | “第一次上台演讲”，难为情 | It is his first speech on stage, so the word must mean bashful.
羞涩/2 | “躲在妈妈身后，不敢跟客人打招呼”，难为情 | The girl hides behind her mother, afraid to greet the guests, so the word must mean bashfully.
拥挤/1 | 游人“寸步难行”，人挤在一起 | Visitors at the scenic spot can barely take a step, so the word must mean crowded.
拥挤/2 | “早高峰的地铁车厢”，人挤在一起 | The underground carriage is in the morning rush hour, so the word must mean crowded.
喧哗/1 | “医院病房里请勿大声”，声音大而杂乱 | The notice asks for no loud noise in the hospital ward, so the word must mean making a din.
喧哗/2 | “门外一阵”“迎亲的队伍到了”，声音大而杂乱 | There is a commotion outside because the wedding procession has arrived, so the word must mean a din.
衰败/1 | 老宅“年久失修”，破败 | The old house has long been left unrepaired, so the word must mean decaying.
衰败/2 | “曾经兴盛一时的家族渐渐”，衰落 | The family that once flourished has gradually declined, so the word must mean decaying.
安详/1 | “熟睡的婴儿脸上”，神态平和 | The sleeping baby's face is at peace, so the word must mean serene.
安详/2 | “无论遇到什么事”“不慌不忙”，从容不迫 | Grandfather is never flustered whatever happens, so the word must mean serene.
悠闲/1 | “退休后”“每天种花养鱼”，没有事情要忙 | After retiring, grandfather spends his days with flowers and fish, so the word must mean leisurely. | 安详
悠闲/2 | 鸭子“在河里……游来游去”，闲适自得 | The ducks swim to and fro on the river at their ease, so the word must mean leisurely.
偏僻/1 | 小山村“至今不通公路”，交通不便 | His mountain village still has no road to it, so the word must mean remote.
偏僻/2 | “很少有游客来”，离中心远 | Few tourists ever come here, so the word must mean remote.
贫寒/1 | “母亲一件衣服穿了好多年”，家里贫穷 | Mother wore one coat for many years in those days, so the word must mean poor.
贫寒/2 | “靠自己的努力考上了大学”，出身贫穷 | He got into university by his own efforts from a hard start, so the word must mean poor.
文明/1 | “不乱扔垃圾，不乱刻乱画”的游客，合乎公德 | We do not drop litter or scratch our names on things, so the word must mean civilized.
文明/2 | “排队上车”，有教养的表现 | Queuing to board shows good manners, so the word must mean civilized.
古朴/1 | 小镇的“街巷”保留的风貌，朴素有古风 | The town's lanes keep the look of old times, so the word must mean quaint.
古朴/2 | “爷爷的爷爷传下来”的家具，朴素有古风 | The furniture was handed down from grandfather's grandfather, so the word must mean quaint.
发达/1 | “地铁通往四面八方”，交通充分发展 | The underground goes everywhere in the city, so the word must mean developed.
发达/2 | 工业“经济繁荣”，充分发展 | The region's economy thrives on its industry, so the word must mean developed.
弘扬/1 | “中华优秀传统文化”，发扬光大 | We should carry forward the fine traditional culture of China, so the word must mean promoting.
弘扬/2 | “开展志愿活动”对“助人为乐的精神”，发扬光大 | Volunteer work spreads the spirit of helping others, so the word must mean promoting. | 倡导
遵循/1 | “客观规律”，依照着去做 | Everything we do should go by objective laws, so the word must mean following.
遵循/2 | “严格……操作规程”，依照着去做 | An experiment must strictly keep to the procedures, so the word must mean following.
推崇/1 | “书架上摆满了鲁迅的书”，十分推重 | His shelves are full of Lu Xun's books, so the word must mean holding in high esteem.
推崇/2 | “简朴的生活方式”受到年轻人的推重 | Many young people think highly of a simple way of life, so the word must mean esteem.
倡导/1 | “学校……大家绿色出行”，带头提倡 | The school calls on everyone to travel green and save energy, so the word must mean advocating.
倡导/2 | “在会上”“节约粮食，从我做起”，带头提倡 | At the meeting he urges everyone to start with themselves in not wasting food, so the word must mean advocating.
采纳/1 | “我们的建议”“把春游改到了周五”，接受意见 | The teacher moves the outing to Friday as we suggested, so the word must mean adopting.
采纳/2 | “方案被公司……了”，接受 | The company has accepted his plan, so the word must mean adopted.
妥协/1 | “面对不合理的要求，他从不”，让步 | He never gives way to unreasonable demands, so the word must mean compromising.
妥协/2 | “双方各让一步”“达成了”，用让步避免冲突 | Each side gives a little in the talks, so the word must mean a compromise.
质疑/1 | 对“实验结论提出了”，疑问 | He raises doubts about the experiment's conclusion, so the word must mean questions.
质疑/2 | “科学精神”“敢于……权威”，提出疑问 | Part of the scientific spirit is daring to challenge authority, so the word must mean questioning.
印证/1 | “后来的实验结果……了他当初的猜想”，证明与事实相符 | Later results bore out his first guess, so the word must mean confirming.
印证/2 | “这件事再一次”对一句话，证明相符 | This shows once more that a saying holds true, so the word must mean confirming.
归纳/1 | “用一句话”对“中心思想”，概括 | One sentence is to give the main idea of the essay, so the word must mean summing up.
归纳/2 | “从大量事实中……出了一条规律”，概括出一般道理 | He draws a general rule from many facts, so the word must mean summing up.
凸显/1 | “这个细节”对“人物的善良”，清楚地显露 | The detail brings the character's kindness to the fore, so the word must mean making prominent.
凸显/2 | “随着城市的发展”“日益”，问题清楚显露 | As the city grows, its traffic problems stand out more and more, so the word must mean becoming prominent.
高耸/1 | 群山“直插云霄”，高高地直立 | The mountains rise straight into the clouds, so the word must mean towering.
高耸/2 | 广场中央的“纪念碑”，高高地直立 | A monument stands tall in the middle of the square, so the word must mean towering.
萧索/1 | “只剩几根枯草在风中摇晃”，缺乏生机 | In late autumn only a few dry grasses sway in the fields, so the word must mean desolate.
萧索/2 | “战乱过后，城中”，冷落 | After the war the town is empty and lifeless, so the word must mean desolate.
斑驳/1 | “古墙上布满了”青苔，颜色夹杂 | Moss covers the old wall in patches, so the word must mean mottled.
斑驳/2 | 阳光“透过树叶的缝隙”洒下的光影，明暗夹杂 | Sunlight through the leaves casts patches of light and shade, so the word must mean mottled.
雄浑/1 | “边塞诗”“气势非凡”，雄健有气势 | The frontier poem has an extraordinary force, so the word must mean vigorous and imposing.
雄浑/2 | “黄河”的涛声，雄健浑厚 | The roar of the Yellow River carries from afar, so the word must mean vigorous and deep.
明净/1 | “雨后”“一丝云也没有”，明朗洁净 | After the rain there is not a wisp of cloud in the sky, so the word must mean bright and clean.
明净/2 | 窗户“擦得……透亮”，洁净 | The windows have been wiped until they shine, so the word must mean bright and clean.
浩渺/1 | “烟波”“水天相接”，水面广阔无边 | From the shore the misty lake meets the sky, so the word must mean vast.
浩渺/2 | “夜空”“繁星点点”，天空广阔无边 | The night sky is full of countless stars, so the word must mean vast. | 明净
沉郁/1 | “杜甫的诗风格……顿挫”，低沉郁闷 | The sentence describes the style of Du Fu's poems, so the word must mean deep and sombre.
沉郁/2 | “神情”“好像压着很重的心事”，低沉 | He looks as though a heavy worry weighs on him, so the word must mean gloomy.
苍劲/1 | 山崖上的“古松”，老而挺拔 | An ancient pine stands straight on the cliff, so the word must mean old and sturdy.
苍劲/2 | “年过八十，写的字依然……有力”，老而有力 | At over eighty the old man still writes with strength, so the word must mean vigorous with age.
朦胧/1 | “月色”“远处的山影若隐若现”，模糊不清 | The far hills can barely be made out in the moonlight, so the word must mean hazy.
朦胧/2 | “晨雾中”“神秘”，模糊不清 | The village seems mysterious in the morning mist, so the word must mean hazy.
静穆/1 | “烈士陵园里”“人们低头默哀”，安静庄严 | People bow their heads in silence at the martyrs' cemetery, so the word must mean solemn and still.
静穆/2 | 古老的寺庙“而庄严”，安静 | The ancient temple looks dignified in the setting sun, so the word must mean solemn and still.
圆滑/1 | “见风使舵，谁也不得罪”，只顾讨好各方面 | He trims his sails to the wind and offends no one, so the word must mean slick.
圆滑/2 | 说话“让人摸不清他的真实想法”，只顾讨好 | No one can tell what he really thinks from his words, so the word must mean slick.
宽宏/1 | “大量”“从不计较别人的冒犯”，度量大 | He never minds others' offences, and "大量" follows the word, so it must mean magnanimous.
宽宏/2 | “原谅了”伤害过自己的人，度量大 | She forgives the person who hurt her, so the word must mean magnanimous.
骄横/1 | “恶霸”“霸道，乡亲们敢怒不敢言”，蛮不讲理 | The villagers are angry but dare not speak against the bully, so the word must mean arrogant and domineering.
骄横/2 | “仗着家里有钱”，骄傲专横 | He relies on his family's money to lord it over classmates, so the word must mean arrogant and domineering.
节制/1 | “饮食要有”“暴饮暴食对身体有害”，不过度 | Overeating harms the body, so the word must mean moderation.
节制/2 | “自己的情绪，不再动不动就发火”，控制 | He no longer flares up at every turn, so the word must mean restraining.
怠慢/1 | “客人远道而来，我们可不能”，冷淡 | The guests have come a long way, so the word must mean slighting them.
怠慢/2 | “招待不周”“还请原谅”，对客人不恭敬 | The host apologizes for poor hospitality, so the word must mean slighting the guests.
信守/1 | “诺言，从未失信于人”，忠实遵守 | He never broke faith with anyone all his life, so the word must mean keeping his word.
信守/2 | “合同，不能随意更改”，忠实遵守 | Neither side may change the contract at will, so the word must mean abiding by it.
稳健/1 | “大家都放心把任务交给他”，稳重 | Everyone is happy to leave tasks to him, so the word must mean steady.
稳健/2 | 老将“指挥若定”的作风，不轻举妄动 | The veteran commander directs with calm assurance, so the word must mean steady.
推脱/1 | “互相……谁也不肯负责”，找借口不承担 | No department will take responsibility for the problem, so the word must mean shirking.
推脱/2 | “这是你分内的事”，不要找借口不做 | This is part of your own job, so the word must mean shirking it.
献媚/1 | “对上司百般”，“对下属却十分刻薄”，讨好上司 | He fawns on his boss but is harsh to those below him, so the word must mean currying favour.
献媚/2 | “为人正直，从不向有权势的人”，讨好 | He is upright and never flatters the powerful, so the word must mean currying favour.
清廉/1 | “为官”“深受百姓爱戴”，不贪污 | The people love him as an official, so the word must mean incorruptible.
清廉/2 | 包拯“一生”“被后人称为‘包青天’”，清白廉洁 | Bao Zheng is remembered as "Bao the Clear Sky", so the word must mean incorruptible.
片面/1 | “只看到缺点而看不到优点”，不全面 | Seeing only faults and never merits gives a partial view, so the word must mean one-sided.
片面/2 | “只听信”的一方的话，单方面的 | We should not believe only what one party says, so the word must mean one-sided.
深刻/1 | 对社会现象的“剖析”，达到本质 | The essay analyses social phenomena down to their roots, so the word must mean profound.
深刻/2 | 经历留下的“印象”，深入 | The experience left an impression on me that will last, so the word must mean deep.
客观/1 | “公正，不能凭个人好恶”，不加个人偏见 | Judging a person must not depend on personal likes and dislikes, so the word must mean objective.
客观/2 | 记者“报道事实”，按本来面目 | A reporter should present the facts as they are, so the word must mean objectively.
严密/1 | 论文“结构完整，论证”，没有疏漏 | The paper's argument has no gaps, so the word must mean tight.
严密/2 | “布下了……的防线，嫌疑人插翅难飞”，周到无漏 | The police line leaves the suspect no way out, so the word must mean tight.
确凿/1 | “证据……他不得不承认了错误”，非常确实 | The evidence leaves him no choice but to admit his fault, so the word must mean conclusive.
确凿/2 | “史书上有……的记载”，确实 | The history books record it as a sure fact, so the word must mean conclusive.
抽象/1 | “举个例子就好懂了”，笼统空洞 | An example makes the idea easy to understand, so the word must mean abstract.
抽象/2 | “可以用具体事例来说明”，和具体相对 | A truth can be explained with concrete cases, so the word must mean abstract.
偶然/1 | “并非”，“而是长期努力的结果”，不一定发生而发生 | His success was not chance but the result of long effort, so the word must mean accidental.
偶然/2 | “一次……的机会”，意外的 | He took up writing through an unexpected opportunity, so the word must mean chance.
矛盾/1 | “说法前后”“让人难以相信”，前后抵触 | What he says at the start does not agree with what he says later, so the word must mean contradictory.
矛盾/2 | “去还是不去”，心里相互抵触 | She cannot decide whether to go or not, so the word must mean torn.
简明/1 | 说明书“扼要，一看就懂”，简单明白 | The instructions are brief and understood at a glance, so the word must mean concise.
简明/2 | “概括文章的主要内容”的语言，简单明白 | The main content of the essay is to be summed up, so the word must mean concise.
悬殊/1 | “两队实力”“比赛几乎没有悬念”，相差很远 | The match has hardly any suspense, so the word must mean widely disparate.
悬殊/2 | “白天和夜晚的温差”，相差很远 | The temperature differs greatly between day and night here, so the word must mean widely disparate.
永恒/1 | 母爱是“文学作品中”的“主题”，永远不变 | Mother's love is a theme of literature that never changes, so the word must mean eternal.
永恒/2 | 和“一切都在发展变化”相对，永远不变 | The sentence sets this against "everything develops and changes", so the word must mean eternal.
繁衍/1 | 人类“在这片土地上世代……生息”，世代延续 | People have lived on this land generation after generation, so the word must mean multiplying.
繁衍/2 | 鱼“没有天敌”“大量”，逐渐增多 | The fish has no natural enemies and grows in great numbers, so the word must mean multiplying.
崛起/1 | “短短几十年，一座现代化城市在海边”，兴起 | In a few decades a modern city has sprung up by the sea, so the word must mean rising.
崛起/2 | “一个民族的……离不开教育”，兴起 | A nation's growing strong depends on education, so the word must mean rise.
延续/1 | 传统“已经……了几百年”，照原样继续 | The tradition has been carried on for hundreds of years, so the word must mean continuing.
延续/2 | 友谊“一直……到晚年”，继续下去 | Their friendship lasted into old age, so the word must mean continuing.
逝去/1 | “怀念那些已经……的岁月”，过去 | He often looks back fondly on years gone by, so the word must mean passed.
逝去/2 | “童年早已”“往事仍历历在目”，过去 | Childhood is long gone, though its memories are still clear, so the word must mean passed.
新颖/1 | 作文“构思”“令人耳目一新”，新而别致 | The composition's idea strikes the reader as fresh, so the word must mean novel.
新颖/2 | 手机“设计”“很受年轻人欢迎”，新而别致 | Young people like the phone's new and unusual design, so the word must mean novel.
滞后/1 | “交通建设相对”“影响了经济发展”，落在后面 | Transport in the area has held back the economy, so the word must mean lagging.
滞后/2 | 法规“往往……于社会的变化”，落在后面 | Laws often fall behind changes in society, so the word must mean lagging.
悠久/1 | “中国有……的历史”，年代久远 | China's history goes back a very long way, so the word must mean long-standing.
悠久/2 | 学校“历史”“已经有一百多年了”，年代久远 | The school is more than a hundred years old, so the word must mean long-standing.
萌发/1 | “春雨过后，种子开始”，发芽 | After the spring rain the seeds begin to grow, so the word must mean sprouting.
萌发/2 | “心中……了当科学家的念头”，比喻发生 | After reading the book the idea of becoming a scientist begins in him, so the word must mean sprouting.
骤然/1 | “天色……暗了下来，一场暴雨就要来了”，突然 | The sky darkens at once as a storm approaches, so the word must mean suddenly.
骤然/2 | “听到这个消息，他的脸色……变了”，一下子 | His face changes the moment he hears the news, so the word must mean suddenly.
凝练/1 | “二十个字写尽了离别之情”，紧凑简洁 | Twenty characters of the quatrain say all of parting, so the word must mean terse and polished.
凝练/2 | “用最少的字说清最要紧的事”，没有多余的话 | A headline says what matters most in the fewest words, so the word must mean terse.
生涩/1 | 译文“很多句子不通顺”，不流畅 | Many sentences of the translation do not read smoothly, so the word must mean awkward.
生涩/2 | “刚学写诗的人”“读来不够自然”，不纯熟 | A beginner at poetry cannot yet write naturally, so the word must mean unpolished.
细腻/1 | “连一丝犹豫都写了出来”，细致入微 | The writer catches even a flicker of hesitation in the character, so the word must mean delicate and detailed.
细腻/2 | 表演“把角色的心事演得丝丝入扣”，细致 | Her acting brings out the character's thoughts precisely, so the word must mean delicate.
婉约/1 | 李清照的词“多写离愁别绪”，委婉含蓄 | Li Qingzhao's lyrics are mostly about the sorrow of parting, so the word must mean graceful and restrained.
婉约/2 | 宋词和“豪放”并列的另一派，委婉含蓄 | The other school of Song lyrics stands beside the "bold" one, so the word must mean graceful and restrained.
典雅/1 | 园林“古朴”“处处透出书香气”，优美不俗 | The garden's pavilions breathe a scholarly air, so the word must mean elegant.
典雅/2 | 大厅的“布置”“墙上挂着几幅山水画”，优美不俗 | The hall is hung with landscape paintings, so the word must mean elegant.
空洞/1 | “辞藻华丽，内容却”，没有内容 | The composition has fine words but nothing behind them, so the word must mean hollow.
空洞/2 | “只喊口号”“无物”，没有内容 | An essay of nothing but slogans says nothing, so the word must mean hollow.
雕琢/1 | “刻意……字句，真情最动人”，过分修饰 | Real feeling moves people more than carefully worked phrases, so the word must mean over-polishing.
雕琢/2 | “过于”“反而失去了自然之美”，修饰太多 | The poem loses its natural beauty from too much working, so the word must mean over-polished.
鲜活/1 | 人物“仿佛就站在眼前”，新鲜有生气 | The characters seem to stand before your eyes, so the word must mean vivid and fresh.
鲜活/2 | “口语”“充满了生活气息”，新鲜有生气 | Everyday speech fills the essay with the feel of life, so the word must mean vivid and fresh.
悲壮/1 | “明知此去不能生还，仍然踏上”征程，悲哀而雄壮 | The warrior sets out knowing he will not come back, so the word must mean solemn and stirring.
悲壮/2 | 战歌“激昂”“视死如归”，悲哀雄壮 | The war song sings of soldiers who face death unafraid, so the word must mean solemn and stirring.
渲染/1 | “用大段景物描写”对“悲凉的气氛”，着力烘托 | Long descriptions of scenery build up a mournful mood, so the word must mean playing up.
渲染/2 | “被报纸过分”“闹得人人皆知”，夸大地形容 | The papers made so much of a small matter that everyone knew it, so the word must mean played up.
周全/1 | “连最坏的情况都想到了”，周到全面 | He thought of even the worst case, so the word must mean thorough. | 透彻
周全/2 | “各种意外都有应对办法”，没有遗漏 | The plan has an answer for every mishap, so the word must mean well considered.
偏颇/1 | “只说缺点、不提优点”，偏于一方面 | Speaking only of faults and never of merits leans to one side, so the word must mean biased.
偏颇/2 | “只采访了一方”，不公正 | The report interviewed only one party, so the word must mean biased.
驳斥/1 | “列出大量事实”对“谣言”，反驳错误言论 | He lists many facts against the rumour, so the word must mean refuting.
驳斥/2 | “歪曲历史的论调”“必须严正”，反驳 | Claims that distort history must be firmly answered, so the word must mean refuted.
演绎/1 | 从“人都会死”推出“苏格拉底会死”，由一般推出个别 | Going from "all men die" to "Socrates will die" reasons from the general to the particular, so the word must mean deductive.
演绎/2 | “从公理一步步推出结论”，由一般推出个别 | Proofs go step by step from axioms to conclusions, so the word must mean deductive.
偏激/1 | 言辞“动不动就把对方说得一无是处”，过火 | He always makes out that the other side has no merit at all, so the word must mean extreme.
偏激/2 | 情绪“最容易说出过头的话”，过火 | It is when feelings run too high that we say too much, so the word must mean extreme.
荒谬/1 | “说地球是平的”，极端错误 | Saying the earth is flat is utterly wrong, so the word must mean absurd.
荒谬/2 | 结论“得可笑”，非常不合情理 | His conclusion is laughably wrong, so the word must mean absurd.
求证/1 | “对网上的传言，要先……再决定信不信”，找证据证明 | Online rumours should be checked before we decide whether to believe them, so the word must mean seeking proof.
求证/2 | 和“大胆假设”相对，“小心”找证据 | The saying pairs a bold hypothesis with a careful search for this, so the word must mean seeking proof.
透彻/1 | 道理分析得“大家一听就明白了”，详尽深入 | Everyone understands his analysis at once, so the word must mean thorough.
透彻/2 | “把问题研究……才能找到解决的办法”，深入 | Only a problem studied in depth can be solved, so the word must mean thoroughly.
盲从/1 | “书本”“要有自己的判断”，不问是非地附和 | A reader should have a judgment of his own, so the word must mean following blindly.
盲从/2 | “动脑思考，不能一味”，不问是非地附和 | Even experts' views should be thought over, so the word must mean following blindly.
笼统/1 | “只说‘各方面都有问题’，却没说清是哪些问题”，不具体 | He says "there are problems everywhere" without naming any, so the word must mean vague.
笼统/2 | 计划“看不出每一步该做什么”，不明确 | The plan does not show what each step is or who does it, so the word must mean vague.
蓬勃/1 | “新兴产业……发展，为城市注入了活力”，繁荣旺盛 | New industries bring life to the city, so the word must mean vigorously.
蓬勃/2 | “朝气……的年轻人”，旺盛 | The campus is full of young people brimming with energy, so the word must mean vigorous.
萧条/1 | “战乱过后，市面”“民不聊生”，冷落没有生气 | After the war the people could barely live and the market was empty, so the word must mean depressed.
萧条/2 | “经济……的那几年，许多工厂停了产”，经济衰退 | Many factories stopped work in those years, so the word must mean depressed.
变革/1 | “互联网带来了一场深刻的社会”，改变本质 | The internet has brought deep change to society, so the word must mean transformation.
变革/2 | “印刷术的发明”引起传播方式的根本改变 | Printing changed the very way knowledge spread, so the word must mean transformation.
传承/1 | “收徒授艺”“把剪纸手艺……下去”，传授和继承 | The old artist takes apprentices so the craft of paper-cutting lives on, so the word must mean passing on.
传承/2 | “非物质文化遗产需要一代代”，传授继承 | Intangible heritage must be handed from one generation to the next, so the word must mean passing on.
弊端/1 | “制度存在不少”“需要尽快完善”，漏洞的害处 | The system needs to be improved soon, so the word must mean drawbacks.
弊端/2 | “过度依赖手机的”“越来越明显”，害处 | Relying too much on phones does more and more harm, so the word must mean drawbacks.
闭塞/1 | “山区交通”“村民很少走出大山”，交通不便 | The villagers seldom left the mountains, which had poor roads, so the word must mean cut off.
闭塞/2 | “信息……的年代，一封家书要走上好几个月”，消息不灵通 | A letter home took months in those days, so the word must mean cut off.
推行/1 | “大力……垃圾分类，家家户户都学会了”，普遍实行 | Every household has learned to sort rubbish under the city's drive, so the word must mean putting into effect.
推行/2 | 新规则“将在全国”，普遍实行 | The new traffic rules will apply across the country, so the word must mean be put into effect.
奢靡/1 | “花钱大手大脚”的生活，奢侈浪费 | Some people spend money freely on a life of luxury, so the word must mean extravagant.
奢靡/2 | “……成风而走向衰亡”，奢侈浪费 | Many dynasties fell when luxury became the fashion, so the word must mean extravagance.
包容/1 | 城市“接纳来自四方的人”的胸怀，宽容大度 | A city welcomes people from everywhere, so the word must mean tolerant.
包容/2 | “不同文化之间应当相互”“取长补短”，能容纳 | Different cultures should learn from one another, so the word must mean being tolerant.
疏离/1 | 网络“却也可能让人与人之间变得”，有距离 | The internet may also put distance between people, so the word must mean estranged.
疏离/2 | “长年在外，与家乡的亲人渐渐”，疏远 | Away for many years, he has drifted from his family at home, so the word must mean estranged.
精确/1 | 导航“把位置……到几米之内”，非常准确 | Satellite navigation fixes a position to within a few metres, so the word must mean precise.
精确/2 | 实验数据“差一点都不行”，非常准确 | Experimental data must not be even slightly off, so the word must mean precise.
衰减/1 | 信号“在长距离传输中会逐渐”，减弱 | A signal weakens as it travels far, so the word must mean attenuating.
衰减/2 | “随着年龄增长，人的听力会慢慢”，减弱 | Hearing gradually weakens with age, so the word must mean declining.
兼容/1 | 充电器“能……多种型号的手机”，彼此能一起用 | The charger works with many models of phone, so the word must mean compatible.
兼容/2 | “新系统与旧文件互相”“打开毫无问题”，能一起用 | The new system opens old files without trouble, so the word must mean compatible.
稀缺/1 | 淡水“资源，要节约用水”，稀少缺乏 | Fresh water must be saved, so the word must mean scarce.
稀缺/2 | “沙漠里水源”“植物很难生长”，稀少 | Plants hardly grow in the desert, so the word must mean scarce.
恒定/1 | “恒温箱里的温度保持”，固定不变 | The temperature in a thermostatic box stays the same, so the word must mean constant.
恒定/2 | 自转速度“并非完全……而是有极其微小的变化”，不变 | The earth's spin changes very slightly, so it is not completely constant, and the word must mean constant.
演变/1 | 汉字“经过几千年的……才成为今天的样子”，长期变化 | Chinese characters took thousands of years to reach their present form, so the word must mean evolution.
演变/2 | “自行车外形的……过程”，发展变化 | The essay traces how the bicycle's shape changed over time, so the word must mean evolution.
简便/1 | 测量方法“易行，用一把尺子就能完成”，简单方便 | The measurement needs only a ruler, so the word must mean simple and handy.
简便/2 | “用手机扫码付款”“不用再带零钱”，简单方便 | Scanning a code to pay means no more small change, so the word must mean simple and handy.
耗费/1 | 老空调“的电太多了”，消耗 | The old air conditioner uses too much electricity, so the word must mean consuming.
耗费/2 | 修建大桥“了五年时间”，花费 | Building the bridge took five years, so the word must mean consumed.
稠密/1 | “城市中心人口”“交通压力很大”，多而密 | Traffic is under great pressure in the city centre, so the word must mean dense.
稠密/2 | 树林“枝叶”“阳光几乎照不进来”，多而密 | Sunlight can hardly get through the leaves, so the word must mean dense.
运转/1 | “机器日夜不停地”，转动 | The machines go day and night without stopping, so the word must mean running.
运转/2 | “停电后，工厂无法正常”，工作 | The factory cannot work normally in a power cut, so the word must mean operating.
古雅/1 | “用古琴弹奏”“仿佛把人带回了唐朝”，古朴雅致 | The tune is played on the guqin and seems to carry one back to the Tang dynasty, so the word must mean of quaint elegance.
古雅/2 | 老街的“木板房，屋檐下挂着红灯笼”，古朴雅致 | Old wooden houses with red lanterns under the eaves line the street, so the word must mean of quaint elegance.
秉持/1 | “一生……诚信，从不失约”，一直守着不放 | All his life he never broke an appointment, so the word must mean upholding honesty.
秉持/2 | 老店“百年来……‘货真价实’的祖训”，坚持 | For a century the shop has kept to its founders' rule of honest goods at fair prices, so the word must mean upholding. | 沿袭
传颂/1 | 岳飞的故事“千百年来被人们”，传布颂扬 | Yue Fei's loyalty to his country has been told and praised for centuries, so the word must mean widely praised.
传颂/2 | 诗“至今仍广为”，传布颂扬 | The poem of a wanderer's homesickness is still known and loved everywhere, so the word must mean widely praised.
渊博/1 | 老教授“学识”“讲起历史来如数家珍”，深而广 | The old professor talks of history as of his own treasures, so the word must mean erudite.
渊博/2 | “读书破万卷”才有的知识，深而广 | He read thousands of books to gain such knowledge, so the word must mean erudite.
沿袭/1 | 街名“……了宋代的叫法，一直没有改过”，依照旧例 | The street still bears the name it had in the Song dynasty, so the word must mean carrying on.
沿袭/2 | 建筑式样“……了明清时期的风格”，依照旧传统 | The buildings follow the style of the Ming and Qing, so the word must mean carrying on.
崇尚/1 | 古人“……‘和而不同’的处世之道”，尊重推崇 | The ancients valued the way of "harmony without sameness", so the word must mean upholding. | 秉持
崇尚/2 | “简朴，从不追求名牌”，推崇 | He never chases brand names, so the word must mean upholding simplicity.
繁复/1 | 注释“一句原文后面跟着好几段解说”，多而复杂 | Several paragraphs of notes follow each line of the old book, so the word must mean elaborate.
繁复/2 | 点心“工序”“要做整整一天”，多而复杂 | The traditional pastry takes a whole day to make, so the word must mean elaborate.
庄重/1 | “祭孔大典的场面”“肃穆”，不随便 | The ceremony for Confucius is hushed and dignified, so the word must mean solemn.
庄重/2 | “在典礼上的讲话”“得体”，不轻浮 | His speech at the ceremony is dignified and fitting, so the word must mean solemn.
考究/1 | 饮茶“水要山泉水，杯要青瓷杯”，讲究 | He wants spring water and a celadon cup for his tea, so the word must mean particular.
考究/2 | 做衣服“一针一线都不马虎”，精美 | Not a stitch is careless in the old shop's clothes, so the word must mean exquisite.
景仰/1 | 参观“文学大师的故居”的心情，佩服尊敬 | People visit the great writer's former home in deep respect, so the word must mean looking up to him.
景仰/2 | “学问和人品都令人”，佩服尊敬 | Both his learning and his character win people's respect, so the word must mean looking up to.
落寞/1 | “节日里，他一个人在异乡”，冷落寂寞 | He is alone in a strange place at a festival, so the word must mean lonely.
落寞/2 | “老人……的背影让人心酸”，寂寞 | The old man's back in the setting sun is sad to see, so the word must mean lonely.
坦荡/1 | “心胸”“从不在背后议论别人”，宽广纯洁 | He never talks about others behind their backs, so the word must mean open and aboveboard.
坦荡/2 | “做人要光明”“问心无愧”，心地纯洁 | A person should have a clear conscience, so the word must mean open and aboveboard.
执着/1 | 对科学的追求“几十年如一日”，坚持不懈 | He has pursued science the same way for decades, so the word must mean persistent.
执着/2 | “凭着一股……劲儿”“终于攻克了难题”，不肯放弃 | She solved the hard problem at last through sheer persistence, so the word must mean persistent.
谦逊/1 | “取得了成绩，却始终……待人”，谦虚恭谨 | He has achieved much yet treats people humbly, so the word must mean modest.
谦逊/2 | 大师“总说自己还要学习”，谦虚 | The master always says he still has things to learn, so the word must mean modest.
悲悯/1 | 杜甫诗中“对百姓的”感情，悲伤同情 | Du Fu's poems are full of feeling for the common people's suffering, so the word must mean compassion.
悲悯/2 | “注视着小人物的命运”的眼光，同情 | The novel watches the fate of ordinary people with sympathy, so the word must mean compassionate.
惶恐/1 | “做错了事”“不安地站在老师面前”，惊慌害怕 | He did something wrong and stands uneasily before the teacher, so the word must mean terrified.
惶恐/2 | “听到这个消息”“一夜没睡好”，惊慌害怕 | The news keeps her awake all night, so the word must mean terrified.
隐忍/1 | “为了完成大业”“多年，终于等来了机会”，忍耐 | He held back for years for a great cause until his chance came, so the word must mean bearing in silence.
隐忍/2 | “把委屈……在心里，从不对人诉说”，忍着藏起来 | She keeps her hurt to herself and tells no one, so the word must mean bearing in silence.
洒脱/1 | “几经挫折，依然吟诗作画、游山玩水”，不拘束 | Through many setbacks he still writes poems and travels the hills, so the word must mean free and easy.
洒脱/2 | “挥挥手”“转身离去”，自然不拘束 | He waves and turns away without a backward look, so the word must mean free and easy.
赤诚/1 | “……之心对待朋友”，极其真诚 | He treats his friends with his whole heart, so the word must mean utterly sincere.
赤诚/2 | 家书“字字句句都透着”，真诚 | Every line of the letter home shows a true heart, so the word must mean utter sincerity.
怯懦/1 | “面对恶势力，他毫不”“挺身而出”，胆小怕事 | He steps forward against the forces of evil without the least fear, so the word must mean cowardly.
怯懦/2 | 鲁迅笔下的人物“麻木，令人痛心”，胆小怕事 | Some of Lu Xun's characters are numb and painful to read about, so the word must mean cowardly.
考证/1 | “学者多年”“确定这幅画出自宋代”，根据资料证实 | Scholars spent years establishing that the painting is from the Song dynasty, so the word must mean verification by research.
考证/2 | “翻阅了上百种古籍”“出这座古桥的修建年代”，考核证实 | He searched over a hundred old books to find when the bridge was built, so the word must mean verifying by research.
翔实/1 | 报告“材料”“数据可靠”，详细确实 | The report's data are reliable, so the word must mean detailed and accurate.
翔实/2 | “还原了那场战役的经过”的史料，详细确实 | He reconstructs the course of the battle from historical sources, so the word must mean detailed and accurate.
借鉴/1 | 研究“……了国外的先进经验”，对照取长补短 | The research learned from advanced experience abroad, so the word must mean drawing on.
借鉴/2 | “名家的写法，但不能照抄”，取长补短 | Writers may learn from masters but must not copy them, so the word must mean drawing on.
原创/1 | “这首歌是他的……作品”，首创 | The song was written by him and no one else, so the word must mean original.
原创/2 | 论文“观点”“在学界引起了关注”，不是模仿的 | The paper's ideas drew notice among scholars, so the word must mean original.
精深/1 | “中医博大”，精密深奥 | Chinese medicine is broad and deep enough to study closely, so the word must mean profound.
精深/2 | 对甲骨文的研究“许多难认的字都是他考释出来的”，深奥精密 | Many hard oracle-bone characters were deciphered by this scholar, so the word must mean profound.
谬误/1 | 书中“几处史实”“再版时已经改正”，错误 | Several historical facts in the book were corrected in the new edition, so the word must mean errors.
谬误/2 | “科学就是在不断纠正……中前进的”，错误 | Science moves forward by constantly correcting its mistakes, so the word must mean errors.
阐释/1 | “用一个生活中的例子……了这个原理”，阐述解释 | The teacher uses an everyday example to make the principle clear, so the word must mean expounding.
阐释/2 | “从三个方面……了作者的观点”，阐述解释 | The essay explains the author's view from three angles, so the word must mean expounding.
求实/1 | 做学问的精神“不能弄虚作假”，讲求实际 | Scholarship must not fake anything, so the word must mean down-to-earth.
求实/2 | 工作“从不说空话、大话”，讲求实际 | He never talks big or empty, so the word must mean down-to-earth.
验证/1 | 科学家“用实验……了这个猜想”，试验证实 | Scientists test the guess by experiment, so the word must mean verifying.
验证/2 | 新药效果“还需要大量临床试验来”，试验证实 | The new drug's effect still needs many clinical trials, so the word must mean verifying.
浅显/1 | 科普书“讲解了复杂的物理知识”的语言，浅而易懂 | The popular science book explains complex physics in simple words, so the word must mean easy to understand.
浅显/2 | “大家一听就懂”，浅而易懂 | Everyone understands the teacher at once, so the word must mean easy to understand.
爆发/1 | “火山”“岩浆冲天而起”，因内部压力突然冲出（山洪、疾病才用“暴发”） | Lava shoots into the sky from the volcano, so the word must mean erupting; 暴发 is used for floods and disease.
爆发/2 | 演出结束后的“掌声”，情绪突然发出 | Thunderous applause bursts out when the show ends, so the word must mean breaking out.
暴发/1 | “山洪”突然发作，山洪、疾病用“暴发” | A mountain flood is what suddenly comes, so the word must mean breaking out, as floods and disease do.
暴发/2 | “连日暴雨后”“洪水”，突然发作 | After days of heavy rain the river suddenly floods, so the word must mean breaking out.
启用/1 | “新建的图书馆”是设施，开始使用 | The new library is a building that opens next month, so the word must mean being put into use.
启用/2 | “新印章”是物品，开始使用 | A new seal is a thing that starts being used today, so the word must mean being put into use.
起用/1 | “新人担任主角”，是人，提拔任用 | The director gives the lead role to a newcomer, a person, so the word must mean appointing.
起用/2 | “年轻的守门员”，是人，任用 | The team takes on a young goalkeeper, a person, so the word must mean appointing.
制止/1 | “正在打架的两个孩子”，使正在进行的行动停止 | Two children are fighting right now, so the word must mean stopping an act under way.
制止/2 | “及时……了这场争吵”，使正在进行的停止 | The guard steps in in time to end the quarrel, so the word must mean stopping an act under way.
禁止/1 | “图书馆内……大声喧哗”，事先规定不准 | The library rule forbids loud noise in advance, so the word must mean prohibiting.
禁止/2 | “这条路段……货车通行”，事先规定不准 | Lorries are not allowed on this stretch of road by rule, so the word must mean prohibiting.
严厉/1 | 父亲“批评了他”，说的是态度、言辞严肃厉害 | The sentence is about the father's manner in criticizing him, so the word must mean sternly.
严厉/2 | “目光”“看得人心里发慌”，态度严厉 | His look makes people uneasy, so the word must mean stern.
严格/1 | “质量”“不合格的一件也不能出厂”，按标准认真不放松 | Not a single faulty product may leave the factory, so the word must mean strict.
严格/2 | “遵守作息时间，每天六点准时起床”，执行不放松 | He keeps to his timetable and rises at six sharp, so the word must mean strictly.
沉静/1 | “性格”“遇事从不慌乱”，性格安静稳重 | She never panics whatever happens, so the word must mean calm.
沉静/2 | “坐在窗前，一言不发地看书”，神情安静 | He sits by the window reading without a word, so the word must mean calmly.
沉寂/1 | 歌手“多年后，又推出了一张新专辑”，没有动静 | The singer has brought out a new album after years without a sound, so the word must mean silent.
沉寂/2 | 火山“已经……了几百年”，没有动静 | The volcano has done nothing for centuries, so the word must mean dormant.
`);
