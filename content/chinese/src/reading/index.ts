// The reading units of grades 3 to 6 (docs/chinese-curriculum.md §9): passages written for this subject, three units a
// grade, each passage with a short check. A passage is offered once its characters are known well enough and the grade's first word
// batch is learned; its questions ask what it says, what a word or sentence means in it, and what it is about.

import type { ReadingUnitDef } from "@ga/content";

import { earlyReading } from "./early.ts";
import { juniorReading } from "./junior.ts";
import { question, unit } from "./kit.ts";
import { seniorReading } from "./senior.ts";

/** gradeThreeReading is the reading unit of grade 3: nature close at hand. */
const gradeThreeReading = unit(
  3,
  "chinese-reading-3-nature",
  ["身边的自然", "Nature Close at Hand"],
  [
    {
      id: "chinese-the-orchard-in-autumn",
      title: ["秋天的果园", "The Orchard in Autumn"],
      body: `秋天到了，爷爷的果园热闹起来。苹果树上挂满了红红的苹果，像一张张笑脸。梨树的枝条被金黄的梨压弯了腰。葡萄架下，一串串紫色的葡萄又大又圆，像一颗颗亮晶晶的宝石。

星期天，我跟爸爸妈妈去果园帮爷爷摘果子。爷爷说，摘苹果要轻轻地转一下，不能用力拉，不然会把树枝弄断。我按爷爷说的办法试了试，苹果果然一下子就摘下来了。

中午，我们坐在树下休息。爷爷切开一个大苹果，分给大家吃。苹果又甜又脆，我一口气吃了两块。爷爷笑着说：“这些果子是我们一年的劳动换来的。春天要浇水、除草，夏天要捉虫，到了秋天才有这么好的收成。”

我看着满园的果子，心想：原来甜甜的果子里，藏着爷爷那么多的汗水啊！`,
      xp: 4,
      questions: [
        question(
          ["爷爷说，摘苹果应该怎样做？", "How does Grandpa say an apple should be picked?"],
          ["轻轻地转一下", "Turn it gently"],
          [
            ["用力往下拉", "Pull it down hard"],
            ["用剪刀剪断树枝", "Cut the branch with scissors"],
            ["摇动树干让苹果掉下来", "Shake the tree until it falls"],
          ],
          ["第二段说：“摘苹果要轻轻地转一下，不能用力拉。”", "The second paragraph says to turn the apple gently and not to pull hard."],
        ),
        question(
          ["文中把葡萄比作什么？", "What does the passage compare the grapes to?"],
          ["宝石", "Gems"],
          [
            ["笑脸", "Smiling faces"],
            ["金子", "Gold"],
            ["星星", "Stars"],
          ],
          [
            "第一段说葡萄“像一颗颗亮晶晶的宝石”。笑脸说的是苹果。",
            "The first paragraph says the grapes are like shining gems; the smiling faces are the apples.",
          ],
        ),
        question(
          ["“甜甜的果子里，藏着爷爷那么多的汗水”是什么意思？", "What does “so much of Grandpa's sweat is hidden in the sweet fruit” mean?"],
          ["好收成是爷爷一年辛苦劳动换来的", "The good harvest came from Grandpa's work all year"],
          [
            ["果子里面有很多水", "The fruit is full of water"],
            ["爷爷吃苹果时出了很多汗", "Grandpa sweated as he ate the apple"],
            ["果园里的果子不够甜", "The fruit of the orchard is not sweet enough"],
          ],
          [
            "爷爷说果子是“一年的劳动换来的”：春天浇水除草，夏天捉虫。汗水指的是辛苦的劳动。",
            "Grandpa says the fruit came from a year of hard work, watering, weeding and catching insects; the sweat is that work.",
          ],
        ),
      ],
    },
    {
      id: "chinese-before-the-rain",
      title: ["下雨之前", "Before the Rain"],
      body: `夏天的一个下午，天气闷热，一点风也没有。我和小伙伴在院子里玩，看见墙角有一大群蚂蚁，正排着长长的队伍搬东西。有的蚂蚁抬着白色的小东西，有的蚂蚁拖着小虫子，急急忙忙地往高处爬。

我跑去问奶奶：“蚂蚁为什么要搬家？”奶奶抬头看了看天，说：“快下雨了。蚂蚁的家在地下，下雨时会进水，所以它们要提前搬到高的地方去。”

我又看见几只燕子贴着地面飞来飞去。奶奶告诉我，下雨前空气很潮湿，小虫子的翅膀沾了水汽，飞不高，燕子低飞是为了捉虫子吃。

果然，没过多久，天上乌云密布，接着下起了大雨。我想：小动物们真聪明，它们比我们还早知道要下雨呢！`,
      xp: 4,
      questions: [
        question(
          ["蚂蚁为什么要搬家？", "Why are the ants moving house?"],
          ["快下雨了，地下的家会进水", "Rain is coming and their home under the ground will flood"],
          [
            ["它们的家被人踩坏了", "Someone stepped on their home"],
            ["墙角太冷了", "The corner of the wall is too cold"],
            ["它们要去找吃的", "They are going to look for food"],
          ],
          [
            "奶奶说：“蚂蚁的家在地下，下雨时会进水，所以它们要提前搬到高的地方去。”",
            "Grandma says their home is under the ground and floods when it rains, so they move to higher ground first.",
          ],
        ),
        question(
          ["下雨前，燕子为什么飞得很低？", "Why do the swallows fly low before the rain?"],
          ["小虫子飞不高，燕子低飞去捉虫子", "Insects cannot fly high, so the swallows fly low to catch them"],
          [
            ["燕子的翅膀湿了，飞不高", "The swallows' wings are wet and they cannot fly high"],
            ["燕子要回地下的家", "The swallows are going home under the ground"],
            ["燕子怕被大风吹走", "The swallows are afraid of being blown away"],
          ],
          [
            "第三段说，是小虫子的翅膀沾了水汽飞不高，燕子低飞是为了捉虫子吃。",
            "The third paragraph says it is the insects' wings that are damp; the swallows fly low to catch them.",
          ],
        ),
        question(
          ["“乌云密布”最可能是什么意思？", "What does 乌云密布 most likely mean?"],
          ["天上布满了乌云", "The sky is covered with dark clouds"],
          [
            ["天上只有一朵乌云", "There is one dark cloud in the sky"],
            ["乌云很快就散开了", "The dark clouds soon broke up"],
            ["天空又蓝又亮", "The sky is blue and bright"],
          ],
          ["后面接着说“下起了大雨”，可见天上布满了乌云。", "It is followed by heavy rain, so the sky must be covered with dark clouds."],
        ),
      ],
    },
    {
      id: "chinese-how-seeds-travel",
      title: ["种子去远方", "How Seeds Travel"],
      body: `植物不会走路，可是它们的种子能去很远的地方。

蒲公英的种子上长着白色的细毛，像一把把小伞。风一吹，小伞就飞起来，飘到很远的地方，落在哪里，就在哪里安家。

苍耳的种子外面有很多小钩子。小动物从它身边走过，种子就钩在动物的毛上，被带到别的地方。

大豆的种子藏在豆荚里。到了秋天，太阳一晒，豆荚就裂开了，豆子跳了出去。

还有一些植物的种子，是小鸟帮忙带走的。小鸟吃下果子，种子跟着小鸟飞到远处，再落到地上。

你看，植物妈妈的办法真多呀！`,
      glossed: ["苍耳", "豆荚", "蒲公英"],
      xp: 3,
      questions: [
        question(
          ["苍耳的种子靠什么去远方？", "How do the seeds of the cocklebur travel?"],
          ["钩在动物的毛上", "By hooking onto an animal's fur"],
          [
            ["风把它们吹走", "The wind blows them away"],
            ["太阳晒得豆荚裂开", "The sun bursts their pods"],
            ["小鸟把果子吃下去", "Birds eat the fruit"],
          ],
          [
            "第三段说，苍耳的种子有小钩子，会钩在动物的毛上，被带到别的地方。",
            "The third paragraph says its seeds have little hooks that catch on animals' fur.",
          ],
        ),
        question(
          ["蒲公英的种子像什么？", "What are the dandelion's seeds like?"],
          ["小伞", "Little umbrellas"],
          [
            ["小钩子", "Little hooks"],
            ["豆荚", "Pods"],
            ["小鸟", "Little birds"],
          ],
          [
            "第二段说，蒲公英的种子上长着白色的细毛，“像一把把小伞”。",
            "The second paragraph says its white down is like little umbrellas.",
          ],
        ),
        question(
          ["这篇短文主要讲了什么？", "What is the passage mainly about?"],
          ["植物的种子用不同的办法去远方", "Plants' seeds travel far in different ways"],
          [
            ["蒲公英怎样长出白色的细毛", "How the dandelion grows its white hairs"],
            ["小动物喜欢吃什么果子", "What fruit small animals like"],
            ["秋天豆荚为什么会裂开", "Why pods burst in autumn"],
          ],
          [
            "第一段说种子能去很远的地方，后面几段分别讲了几种办法，最后说“植物妈妈的办法真多”。",
            "The first paragraph says seeds travel far, each paragraph after gives one way, and the last sums them up.",
          ],
        ),
      ],
    },
  ],
);

/** gradeThreeFriends is the second reading unit of grade 3: between friends. */
const gradeThreeFriends = unit(
  3,
  "chinese-reading-3-friends",
  ["朋友之间", "Between Friends"],
  [
    {
      id: "chinese-the-squirrel-who-planted-trees",
      title: ["松鼠种树", "The Squirrel Who Planted Trees"],
      body: `山坡上住着一只小松鼠。秋天到了，它每天忙着找松子，找到了就埋在土里，准备冬天吃。

冬天来了，大雪盖住了山坡。小松鼠饿了，就去挖松子。可是它埋的地方太多了，有很多已经想不起来了。它找了半天，只挖出一小半。小松鼠难过地说：“我的记性真不好，忘了那么多松子！”

老树爷爷听见了，笑着说：“别难过，你忘了的松子，并没有白白地丢掉。”小松鼠不明白。

第二年春天，山坡上冒出了许多绿绿的小芽。老树爷爷说：“看，这些都是你去年埋下的松子长出来的。再过一些年，它们就会长成一片松树林。”

小松鼠高兴得跳了起来：“原来我还是一个种树的能手呢！”`,
      xp: 3,
      questions: [
        question(
          ["小松鼠为什么把松子埋在土里？", "Why does the little squirrel bury pine nuts?"],
          ["准备冬天吃", "To eat them in winter"],
          [
            ["想种出松树", "To grow pine trees"],
            ["怕大雪把松子盖住", "So the snow will not cover them"],
            ["松子太多，拿不动", "There are too many to carry"],
          ],
          [
            "第一段说它找到松子“就埋在土里，准备冬天吃”。种出松树，是它后来才知道的。",
            "The first paragraph says it buries them to eat in winter; that they grow into trees it learns only later.",
          ],
        ),
        question(
          ["小松鼠忘了的松子，后来怎么样了？", "What becomes of the pine nuts the squirrel forgot?"],
          ["春天长出了小芽", "They sprout in spring"],
          [
            ["被别的动物挖走了", "Other animals dig them up"],
            ["被老树爷爷吃了", "Grandpa Tree eats them"],
            ["一直埋在雪下面", "They stay under the snow"],
          ],
          [
            "第四段说：“这些都是你去年埋下的松子长出来的。”",
            "The fourth paragraph says the green shoots grew from the nuts it buried last year.",
          ],
        ),
        question(
          ["这个故事告诉我们什么？", "What does the story tell us?"],
          ["看起来做错的事，有时也会带来好的结果", "Something that looks like a mistake can turn out well"],
          [
            ["冬天要多准备一些吃的", "One should store more food for winter"],
            ["松鼠是最聪明的动物", "Squirrels are the cleverest animals"],
            ["记不住事情的人什么也做不成", "Forgetful people can do nothing"],
          ],
          [
            "小松鼠以为忘了松子是件坏事，最后这些松子却长成了松树，它成了“种树的能手”。",
            "The squirrel thinks forgetting was bad, yet the nuts grow into trees and make it a good tree planter.",
          ],
        ),
      ],
    },
    {
      id: "chinese-half-a-loaf",
      title: ["半个面包", "Half a Loaf"],
      body: `春游那天，中午大家坐在草地上吃饭。我打开书包，才知道饭盒忘在家里的桌子上了。我又急又饿，不知道该怎么办。

同桌小林看见了，把她的面包分成两半，把大的那一半放在我的手里，小声说：“你先吃吧。”

那半个面包不大，可我觉得特别香。吃完后，我对小林说：“谢谢你！明天我还你一个。”小林说：“不用还，好朋友就应该这样。”

下午，我们去爬山。爬到半山腰，小林的水喝完了，渴得说不出话来。我马上把我的水壶递给她：“我们一人一半。”她看着我，我们都笑了。

回家的路上，我想，朋友就是在你需要的时候，愿意分给你一半的人。`,
      names: ["小林"],
      xp: 3,
      questions: [
        question(
          ["小林是怎样帮助“我”的？", "How does Xiaolin help the narrator?"],
          ["把面包分成两半，把大的一半给了“我”", "She splits her bread and gives the narrator the larger half"],
          [
            ["把整个面包给了“我”", "She gives the whole loaf"],
            ["把小的一半给了“我”", "She gives the smaller half"],
            ["陪“我”回家去拿饭盒", "She goes home with the narrator for the lunch box"],
          ],
          [
            "第二段说，小林“把她的面包分成两半，把大的那一半放在我的手里”。",
            "The second paragraph says she splits her bread in two and puts the larger half in the narrator's hand.",
          ],
        ),
        question(
          ["“我”的饭盒在哪里？", "Where is the narrator's lunch box?"],
          ["家里的桌子上", "On the table at home"],
          [
            ["书包里", "In the schoolbag"],
            ["小林的手里", "In Xiaolin's hand"],
            ["草地上", "On the grass"],
          ],
          ["第一段说：“我打开书包，才知道饭盒忘在家里的桌子上了。”", "The first paragraph says the narrator left it on the table at home."],
        ),
        question(
          [
            "“朋友就是在你需要的时候，愿意分给你一半的人”是什么意思？",
            "What does “a friend is someone who will give you half when you need it” mean?",
          ],
          ["朋友愿意在你有困难的时候帮助你", "A friend helps you when you are in trouble"],
          [
            ["朋友之间什么东西都要分成两半", "Friends must split everything in two"],
            ["朋友只能给你一半的东西", "A friend gives you only half of anything"],
            ["朋友帮了你，你就要还他东西", "You must pay a friend back for helping"],
          ],
          [
            "小林在“我”没有饭吃时分给“我”半个面包，“我”也在她没有水喝时和她一人一半。“分给你一半”说的是互相帮助。",
            "Xiaolin shares her bread when the narrator has no lunch, and the narrator shares water when she has none; giving half means helping each other.",
          ],
        ),
      ],
    },
    {
      id: "chinese-a-letter-to-my-cousin",
      title: ["给表哥的信", "A Letter to My Cousin"],
      body: `亲爱的表哥：

你好！你去北京上学已经三个月了，在那里过得好吗？

上次你来信说，北京的秋天特别美，树叶有黄的，有红的，像一幅画。我们这里的秋天也很美。田里一片金黄，农民伯伯正忙着收稻子。我和爸爸去田里帮忙，虽然很累，但是吃到新米做的饭，觉得特别香。

告诉你一个好消息：我参加了学校的足球队！每天放学后，我们都要练一个小时。刚开始，我连球都踢不准，现在已经能把球传给队友了。老师说，下个月我就可以上场踢球了。

你以前教我下的象棋，我还在练。等你放寒假回来，我们再比一比，这次我一定不会输得那么快了！

祝你天天开心！

表弟 小明

十一月五日`,
      names: ["北京", "小明"],
      xp: 3,
      questions: [
        question(
          ["这封信是谁写给谁的？", "Who writes the letter, and to whom?"],
          ["表弟小明写给表哥", "Xiaoming writes to his older cousin"],
          [
            ["表哥写给表弟小明", "The cousin writes to Xiaoming"],
            ["小明写给爸爸", "Xiaoming writes to his father"],
            ["小明写给足球队的老师", "Xiaoming writes to his football teacher"],
          ],
          ["信的开头是“亲爱的表哥”，最后写着“表弟 小明”。", "It opens with “Dear cousin” and is signed by his younger cousin Xiaoming."],
        ),
        question(
          ["小明参加足球队后有什么进步？", "How has Xiaoming improved since joining the team?"],
          ["能把球传给队友了", "He can pass the ball to his teammates"],
          [
            ["已经上场比赛了", "He has played in a match"],
            ["踢球踢得最准", "He kicks most accurately of all"],
            ["每天要练三个小时", "He trains three hours a day"],
          ],
          [
            "第四段说：“刚开始，我连球都踢不准，现在已经能把球传给队友了。”上场比赛要到下个月。",
            "The fourth paragraph says he can now pass to teammates; playing in a match is still a month away.",
          ],
        ),
        question(
          ["“这次我一定不会输得那么快了”说明了什么？", "What does “this time I won't lose so fast” show?"],
          ["以前和表哥下象棋，小明很快就输了", "Xiaoming used to lose quickly to his cousin at chess"],
          [
            ["小明下象棋从来没有输过", "Xiaoming has never lost at chess"],
            ["小明不想再下象棋了", "Xiaoming no longer wants to play chess"],
            ["表哥下象棋下得不好", "The cousin plays chess badly"],
          ],
          [
            "“不会输得那么快了”说明以前输得很快；小明“还在练”，想下次和表哥比得好一些。",
            "Not losing so fast means he used to lose fast; he is still practising so as to do better next time.",
          ],
        ),
      ],
    },
  ],
);

/** gradeThreeCurious is the third reading unit of grade 3: curious eyes. */
const gradeThreeCurious = unit(
  3,
  "chinese-reading-3-curious",
  ["好奇的眼睛", "Curious Eyes"],
  [
    {
      id: "chinese-watching-a-little-turtle",
      title: ["观察小乌龟", "Watching a Little Turtle"],
      body: `四月十日 星期六 晴

下过雨的早上，我在小河边看见了一只小乌龟，它只有我的手心那么大。我把它放进一个小盆里，带回了家。

小乌龟背着一个硬硬的壳，壳上有一块一块的花纹。它有四只小脚，脚上长着尖尖的爪子，后面还有一条短短的尾巴。我用手指轻轻碰了一下它的头，它马上把头藏进了壳里，过了好一会儿，才又慢慢地伸出来。

四月十一日 星期日 多云

今天我给小乌龟放了一点小鱼干。它在地上爬得很慢很慢，可是一看见吃的，就伸长脖子，一口吃了下去。爸爸说，乌龟在水里游得比在地上爬得快多了。我在盆里放了水，它果然游得很快。

四月十二日 星期一 小雨

我想，小乌龟也会想念它的家吧。放学后，我和爸爸把它送回了小河边。它慢慢地爬进了水里，我看着它，心里有点舍不得。`,
      xp: 4,
      questions: [
        question(
          ["“我”碰了一下小乌龟的头，它怎么样了？", "What does the turtle do when its head is touched?"],
          ["马上把头藏进了壳里", "It pulls its head into its shell at once"],
          [
            ["爬得更快了", "It crawls faster"],
            ["咬了“我”一口", "It bites the narrator"],
            ["从盆里爬了出去", "It climbs out of the basin"],
          ],
          [
            "第一天的日记说：“它马上把头藏进了壳里，过了好一会儿，才又慢慢地伸出来。”",
            "The first entry says it hides its head in its shell at once and only slowly puts it out again.",
          ],
        ),
        question(
          ["爸爸说，乌龟在哪里走得更快？", "Where does Father say a turtle moves faster?"],
          ["在水里游", "Swimming in water"],
          [
            ["在地上爬", "Crawling on land"],
            ["在草地上跑", "Running on grass"],
            ["在小盆里睡觉", "Sleeping in the basin"],
          ],
          [
            "第二天的日记说：“乌龟在水里游得比在地上爬得快多了。”“我”在盆里放了水，它果然游得很快。",
            "The second entry says turtles swim much faster than they crawl, and in water it does swim fast.",
          ],
        ),
        question(
          ["最后“我”为什么把小乌龟送回小河边？", "Why does the narrator take the turtle back to the stream?"],
          ["“我”想小乌龟也会想念它的家", "The narrator thinks the turtle must miss its home"],
          [
            ["小乌龟不吃小鱼干", "The turtle will not eat the dried fish"],
            ["妈妈不让“我”养小乌龟", "Mother will not let the narrator keep it"],
            ["小乌龟爬得太慢了", "The turtle crawls too slowly"],
          ],
          [
            "最后一天的日记说：“我想，小乌龟也会想念它的家吧。”所以“我”和爸爸把它送了回去。",
            "The last entry says the narrator thinks it must miss its home, and so takes it back with Father.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-shapes-of-the-moon",
      title: ["月亮的样子", "The Shapes of the Moon"],
      body: `晚上抬头看天，你会看到，月亮的样子总在变。有时候它像一个圆圆的大盘子，有时候像弯弯的小船，有时候又一点也看不见。

月亮自己不会发光。我们看到的月光，其实是太阳照在月亮上，再反射到地球上的光。

月亮一直围着地球转。它转到不同的地方，被太阳照亮的那一面，对着我们的部分就不一样。全部对着我们时，就是圆圆的满月；只有一小部分对着我们时，就是弯弯的月牙；一点也不对着我们时，我们就看不见月亮了。

月亮围着地球转一圈，大约要一个月。所以，每个月里，月亮都会从弯到圆，再从圆到弯。中秋节的晚上，月亮常常又大又圆，一家人坐在一起看月亮、吃月饼。`,
      xp: 3,
      questions: [
        question(
          ["我们看到的月光是从哪里来的？", "Where does the moonlight we see come from?"],
          ["太阳照在月亮上，再反射过来的光", "Sunlight reflected off the moon"],
          [
            ["月亮自己发出的光", "Light the moon makes itself"],
            ["地球上的灯光", "Lamps on the Earth"],
            ["星星照在月亮上的光", "Starlight on the moon"],
          ],
          [
            "第二段说：“月亮自己不会发光。我们看到的月光，其实是太阳照在月亮上，再反射到地球上的光。”",
            "The second paragraph says the moon gives no light of its own; moonlight is sunlight reflected to the Earth.",
          ],
        ),
        question(
          ["什么时候我们会看到弯弯的月牙？", "When do we see a thin crescent?"],
          ["被照亮的一面只有一小部分对着我们时", "When only a small part of the lit side faces us"],
          [
            ["被照亮的一面全部对着我们时", "When all of the lit side faces us"],
            ["被照亮的一面一点也不对着我们时", "When none of the lit side faces us"],
            ["天上有很多云的时候", "When there are many clouds"],
          ],
          [
            "第三段说：“只有一小部分对着我们时，就是弯弯的月牙。”全部对着我们是满月，一点也不对着我们就看不见。",
            "The third paragraph says a small part facing us makes a crescent; all of it is a full moon, none of it no moon.",
          ],
        ),
        question(
          ["这篇短文主要讲了什么？", "What is the passage mainly about?"],
          ["月亮的样子为什么会变", "Why the moon changes shape"],
          [
            ["中秋节怎样过", "How the Mid-Autumn Festival is kept"],
            ["月亮离地球有多远", "How far the moon is from the Earth"],
            ["太阳为什么会发光", "Why the sun shines"],
          ],
          [
            "第一段问月亮的样子为什么总在变，后面几段讲了月光从哪里来，和月亮围着地球转时样子的变化。",
            "The first paragraph asks why the moon's shape changes, and the rest explain moonlight and the moon's path around the Earth.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-travels-of-a-water-drop",
      title: ["小水滴去旅行", "The Travels of a Water Drop"],
      body: `小水滴住在大海里。一天，太阳公公照着海面，小水滴觉得身子越来越轻，变成了水汽，飞到了天上。

在天上，小水滴和许多伙伴挤在一起，变成了一朵白云。风伯伯推着白云，飘过了高山，飘过了田野。天越来越冷，伙伴们挤得越来越紧，白云变成了乌云。

下雨了！小水滴从天上落了下来，掉进了一片麦田。麦苗喝饱了水，高兴地向它点头。

后来，小水滴流进小河，又从小河流进大江。它跟着江水一路向东，走了很多很多天，最后又回到了大海。

小水滴说：“我去了那么多地方，转了一大圈，又回到了家。下一次，我还要去旅行！”`,
      xp: 3,
      questions: [
        question(
          ["小水滴是怎样飞到天上的？", "How does the water drop get up into the sky?"],
          ["太阳一照，它变成水汽飞了上去", "The sun shines and it turns to vapour and rises"],
          [
            ["风伯伯把它吹了上去", "Uncle Wind blows it up"],
            ["小鸟把它带了上去", "A bird carries it up"],
            ["它顺着高山爬了上去", "It climbs up a mountain"],
          ],
          [
            "第一段说：太阳公公照着海面，小水滴“变成了水汽，飞到了天上”。风伯伯是后来推着白云走的。",
            "The first paragraph says the sun shines on the sea and the drop turns to vapour; the wind only pushes the cloud later.",
          ],
        ),
        question(
          ["小水滴从天上落下来，先到了哪里？", "Where does the drop land when it falls?"],
          ["麦田里", "In a wheat field"],
          [
            ["小河里", "In a stream"],
            ["大江里", "In a great river"],
            ["大海里", "In the sea"],
          ],
          [
            "第三段说，小水滴“掉进了一片麦田”。后来它才流进小河、大江，回到大海。",
            "The third paragraph says it falls into a wheat field; the stream, the river and the sea come after.",
          ],
        ),
        question(
          ["这个故事主要讲了什么？", "What is the story mainly about?"],
          ["水在大海、天空和地上不停地转圈旅行", "Water travels round and round between the sea, the sky and the land"],
          [
            ["麦苗需要喝很多水", "Wheat needs a lot of water"],
            ["白云怎样变成乌云", "How white clouds turn dark"],
            ["大江为什么向东流", "Why great rivers flow east"],
          ],
          [
            "小水滴从大海到天上，再落到麦田，流进河里，最后回到大海，它说自己“转了一大圈，又回到了家”。",
            "The drop goes from the sea to the sky, to a field and a river and back to the sea: a full circle, as it says.",
          ],
        ),
      ],
    },
  ],
);

/** gradeFourReading is the reading unit of grade 4: what animals can do. */
const gradeFourReading = unit(
  4,
  "chinese-reading-4-animals",
  ["动物的本领", "What Animals Can Do"],
  [
    {
      id: "chinese-why-camels-go-without-water",
      title: ["骆驼为什么不怕渴", "Why Camels Go Without Water"],
      body: `沙漠里很少下雨，到处是黄沙，白天又非常炎热。在这样的地方，骆驼却能走上好几天不喝水，人们叫它“沙漠之舟”。

很多人以为，骆驼背上的驼峰里装的是水。其实，驼峰里储存的是脂肪。找不到食物的时候，骆驼就靠驼峰里的脂肪维持生命。

那么骆驼为什么不怕渴呢？原来，骆驼很少出汗，排出的水分也很少，身体里的水不容易流失。一旦找到水，它一次能喝下很多水，把身体里缺的水分一下子补回来。

骆驼还有别的本领。它的脚掌又宽又厚，走在松软的沙子上不会陷下去。它的眼睛周围长着长长的毛，鼻孔也能关上，风沙再大也不怕。正因为有这些本领，骆驼才成了沙漠里人们最好的帮手。`,
      glossed: ["驼峰"],
      xp: 4,
      questions: [
        question(
          ["驼峰里储存的是什么？", "What does a camel's hump store?"],
          ["脂肪", "Fat"],
          [
            ["水", "Water"],
            ["沙子", "Sand"],
            ["空气", "Air"],
          ],
          [
            "第二段说：“很多人以为……装的是水。其实，驼峰里储存的是脂肪。”",
            "The second paragraph says many think it holds water, but in fact it stores fat.",
          ],
        ),
        question(
          ["骆驼不怕渴，主要是因为什么？", "Why can a camel go without water?"],
          ["它很少出汗，水分不容易流失", "It sweats little, so it loses little water"],
          [
            ["驼峰里装满了水", "Its hump is full of water"],
            ["沙漠里经常下雨", "It often rains in the desert"],
            ["它从来不需要喝水", "It never needs to drink"],
          ],
          [
            "第三段说：“骆驼很少出汗，排出的水分也很少，身体里的水不容易流失。”",
            "The third paragraph says it sweats little and loses little water.",
          ],
        ),
        question(
          ["骆驼走在沙子上不会陷下去，是因为什么？", "Why does a camel not sink into the sand?"],
          ["它的脚掌又宽又厚", "Its feet are wide and thick"],
          [
            ["它眼睛周围的毛很长", "The hair around its eyes is long"],
            ["它的鼻孔能关上", "It can close its nostrils"],
            ["它的身体很轻", "Its body is light"],
          ],
          [
            "最后一段说：“它的脚掌又宽又厚，走在松软的沙子上不会陷下去。”眼睛周围的毛和能关上的鼻孔是用来挡风沙的。",
            "The last paragraph says its wide, thick feet keep it from sinking; the eyelashes and nostrils keep out the sand.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-dance-of-the-bees",
      title: ["蜜蜂会跳舞", "The Dance of the Bees"],
      body: `一只蜜蜂找到了一大片开满鲜花的油菜田。它飞回蜂房，不一会儿，许多蜜蜂就飞向了那片油菜田。蜜蜂不会说话，它是怎样把消息告诉同伴的呢？

科学家仔细观察后才知道，蜜蜂是用“跳舞”来传递消息的。如果花离蜂房很近，它就在蜂房里转着圆圈跳，这叫圆舞。如果花离蜂房比较远，它就一边摇动身体，一边走出一个“8”字形，这叫摇摆舞。

摇摆舞里藏着很多秘密。蜜蜂摇摆得越久，表示花离得越远；它摇摆着前进的方向，能告诉同伴往哪个方向飞。同伴们围在它身边，用触角碰一碰它，还能闻到它身上花的香味，知道要找的是什么花。

小小的蜜蜂，竟然有这样了不起的本领！`,
      names: ["8"],
      xp: 4,
      questions: [
        question(
          ["花离蜂房很近时，蜜蜂跳什么舞？", "Which dance does a bee dance when the flowers are near the hive?"],
          ["圆舞", "The round dance"],
          [
            ["摇摆舞", "The waggle dance"],
            ["不停地上下飞", "It flies up and down without stopping"],
            ["停在花上一动不动", "It sits still on a flower"],
          ],
          [
            "第二段说：“如果花离蜂房很近，它就在蜂房里转着圆圈跳，这叫圆舞。”",
            "The second paragraph says that when the flowers are near, it dances in circles: the round dance.",
          ],
        ),
        question(
          ["蜜蜂摇摆得越久，表示什么？", "What does a longer waggle tell the other bees?"],
          ["花离得越远", "The flowers are farther away"],
          [
            ["花离得越近", "The flowers are nearer"],
            ["花越香", "The flowers smell sweeter"],
            ["花越多", "There are more flowers"],
          ],
          [
            "第三段说：“蜜蜂摇摆得越久，表示花离得越远。”",
            "The third paragraph says the longer it waggles, the farther away the flowers are.",
          ],
        ),
        question(
          ["同伴怎样知道要找的是什么花？", "How do the other bees know which flowers to look for?"],
          ["闻到跳舞的蜜蜂身上花的香味", "They smell the flowers on the dancing bee"],
          [
            ["看它跳舞的方向", "They watch which way it dances"],
            ["数它摇摆的次数", "They count its waggles"],
            ["听它发出的叫声", "They listen to its calls"],
          ],
          [
            "第三段说，同伴用触角碰一碰它，“还能闻到它身上花的香味，知道要找的是什么花”。",
            "The third paragraph says they touch it with their feelers and smell the flowers on it.",
          ],
        ),
      ],
    },
    {
      id: "chinese-birds-that-migrate",
      title: ["候鸟的远行", "Birds That Migrate"],
      body: `每年秋天，天气渐渐变冷，北方的大雁就排成“人”字形或“一”字形的队伍，向南方飞去。第二年春天，它们又飞回北方。像大雁这样随着季节变化来回飞行的鸟，叫作候鸟。

候鸟为什么要飞那么远呢？主要是为了食物。北方的冬天天寒地冻，湖面结了冰，草也枯了，鸟儿很难找到吃的。南方的冬天比较温暖，有充足的食物。到了春天，北方又变得温暖，食物多了起来，候鸟就飞回北方生儿育女。

候鸟飞那么远，为什么不会迷路？科学家经过研究知道，有的候鸟靠太阳和星星辨别方向，有的能感觉到地球的磁场，还有的会记住山脉、河流这些路上的标志。

大雁排成队伍飞，也有道理。领头的大雁扇动翅膀，后面的大雁飞起来就省力多了。领头的大雁累了，就会换另一只大雁来带队。`,
      glossed: ["候鸟"],
      xp: 4,
      questions: [
        question(
          ["候鸟来回飞行，主要是为了什么？", "Why do migrating birds fly back and forth?"],
          ["找到充足的食物", "To find enough food"],
          [
            ["躲避猎人", "To escape hunters"],
            ["看不同的风景", "To see new places"],
            ["寻找走散的同伴", "To find lost companions"],
          ],
          ["第二段说：“候鸟为什么要飞那么远呢？主要是为了食物。”", "The second paragraph says they fly so far mainly for food."],
        ),
        question(
          ["下面哪一项不是文中说的候鸟辨别方向的办法？", "Which is not a way the passage says birds find their way?"],
          ["跟着轮船飞", "Following ships"],
          [
            ["靠太阳和星星", "By the sun and stars"],
            ["感觉地球的磁场", "By sensing the Earth's magnetic field"],
            ["记住山脉和河流", "By remembering mountains and rivers"],
          ],
          [
            "第三段说了太阳和星星、地球的磁场、山脉和河流三种办法，没有说跟着轮船飞。",
            "The third paragraph names the sun and stars, the magnetic field, and mountains and rivers, not ships.",
          ],
        ),
        question(
          ["大雁排成队伍飞有什么好处？", "What do geese gain by flying in formation?"],
          ["后面的大雁飞起来更省力", "The geese behind fly with less effort"],
          [
            ["领头的大雁不会累", "The leading goose never tires"],
            ["队伍可以飞得更高", "The flock can fly higher"],
            ["别的鸟不敢靠近", "Other birds dare not come near"],
          ],
          [
            "最后一段说：“领头的大雁扇动翅膀，后面的大雁飞起来就省力多了。”领头的大雁也会累，要换别的大雁带队。",
            "The last paragraph says the geese behind fly with less effort; the leader does tire and is replaced.",
          ],
        ),
      ],
    },
  ],
);

/** gradeFourWisdom is the second reading unit of grade 4: lessons in stories. */
const gradeFourWisdom = unit(
  4,
  "chinese-reading-4-wisdom",
  ["故事里的道理", "Lessons in Stories"],
  [
    {
      id: "chinese-the-monkey-who-sold-umbrellas",
      title: ["卖伞的小猴", "The Monkey Who Sold Umbrellas"],
      body: `小猴在森林里开了一家伞店。开店第一天，天气晴朗，太阳火辣辣的。小猴心想：天这么晴，谁会来买伞呢？于是它关上店门，睡大觉去了。

第二天下起了大雨，动物们都跑来买伞。小猴高兴极了，把伞的价钱涨了一倍。小兔和小鹿只好买了，可是心里很不舒服。

雨停了，小猴的店又冷清下来。一连几天都是晴天，伞一把也卖不出去。

这时，老乌龟慢慢地爬过来，对小猴说：“晴天也有人需要伞呀，太阳那么晒，打一把伞多凉快。再说，下雨天你就涨价，大家以后还愿意来你这儿买吗？”

小猴红着脸，想了很久。第二天，它在门口挂出一块牌子：“晴天遮太阳，雨天挡风雨，价钱永远不变。”从那以后，伞店的生意越来越好了。`,
      xp: 4,
      questions: [
        question(
          ["下大雨那天，小猴做了什么？", "What does the monkey do on the rainy day?"],
          ["把伞的价钱涨了一倍", "It doubles the price of its umbrellas"],
          [
            ["关上店门睡大觉", "It shuts the shop and sleeps"],
            ["把伞送给了动物们", "It gives the umbrellas away"],
            ["在门口挂出一块牌子", "It hangs a sign at the door"],
          ],
          [
            "第二段说：“小猴高兴极了，把伞的价钱涨了一倍。”关门睡觉是第一天，挂牌子是后来的事。",
            "The second paragraph says it doubles the price; it slept on the first day and hung the sign later.",
          ],
        ),
        question(
          ["“小猴的店又冷清下来”中，“冷清”是什么意思？", "What does 冷清 mean in “the monkey's shop grew 冷清 again”?"],
          ["没有什么人来，不热闹", "Few people come; it is quiet"],
          [
            ["店里的天气很冷", "The shop is cold"],
            ["店里打扫得很干净", "The shop is clean"],
            ["伞全都卖完了", "Every umbrella is sold"],
          ],
          [
            "后面接着说：“伞一把也卖不出去。”可见没有什么人来买，店里很不热闹。",
            "It goes on to say not one umbrella sold, so hardly anyone came: the shop was quiet.",
          ],
        ),
        question(
          ["这个故事告诉我们什么道理？", "What does the story teach?"],
          ["做生意要讲诚信，多替别人着想", "Trade honestly and think of others"],
          [
            ["下雨天卖伞最能赚钱", "Rainy days are the best for selling umbrellas"],
            ["晴天不需要打伞", "No one needs an umbrella when it is sunny"],
            ["做事情要像乌龟一样慢", "One should work slowly, like a tortoise"],
          ],
          [
            "老乌龟提醒小猴，晴天也有人需要伞，下雨天涨价会让大家不愿再来。小猴改正以后，生意“越来越好了”。",
            "The tortoise points out that sunny days need umbrellas too and that raising prices drives buyers away; once the monkey changes, trade grows.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-beans-sprout",
      title: ["豆子发芽了", "The Beans Sprout"],
      body: `科学课上，老师让我们回家做一个实验：看看豆子发芽需要什么条件。

我准备了三个杯子，每个杯子里放五颗黄豆。第一个杯子里放湿纸巾，摆在窗台上；第二个杯子里不放水，也摆在窗台上；第三个杯子里放湿纸巾，再放进冰箱里。

我每天都去看。第三天，第一个杯子里的豆子胀大了，裂开一条缝，钻出了白白的小芽。第二个杯子里的豆子还是又干又硬，一点变化也没有。第三个杯子里的豆子虽然湿了，却也没有发芽。

我把结果记在本子上，带到学校。老师说：“你的实验做得很仔细。第二个杯子说明，豆子发芽需要水；第三个杯子说明，豆子发芽还需要合适的温度。”

同学们都很佩服我。我心里想：原来科学的道理，就藏在一个个小小的实验里。`,
      xp: 4,
      questions: [
        question(
          ["哪个杯子里的豆子发芽了？", "In which cup do the beans sprout?"],
          ["放湿纸巾、摆在窗台上的杯子", "The cup with wet paper on the windowsill"],
          [
            ["不放水、摆在窗台上的杯子", "The dry cup on the windowsill"],
            ["放湿纸巾、放进冰箱的杯子", "The cup with wet paper in the fridge"],
            ["三个杯子里的豆子都发芽了", "The beans sprout in all three cups"],
          ],
          [
            "第三段说，第三天，第一个杯子里的豆子“钻出了白白的小芽”，另外两个杯子里的都没有发芽。",
            "The third paragraph says the beans in the first cup put out white shoots; those in the other two did not.",
          ],
        ),
        question(
          ["第三个杯子说明了什么？", "What does the third cup show?"],
          ["豆子发芽需要合适的温度", "Beans need the right temperature to sprout"],
          [
            ["豆子发芽需要水", "Beans need water to sprout"],
            ["豆子发芽需要放在冰箱里", "Beans must be kept in a fridge to sprout"],
            ["豆子越冷长得越快", "The colder, the faster beans grow"],
          ],
          [
            "老师说：“第三个杯子说明，豆子发芽还需要合适的温度。”需要水，是第二个杯子说明的。",
            "The teacher says the third cup shows they need the right temperature; the second cup shows they need water.",
          ],
        ),
        question(
          [
            "“原来科学的道理，就藏在一个个小小的实验里”是什么意思？",
            "What does “the reasons of science are hidden in small experiments” mean?",
          ],
          ["自己动手做实验，就能发现科学的道理", "By doing experiments yourself you can discover how things work"],
          [
            ["科学的道理都写在杯子上", "The reasons are written on the cups"],
            ["只有老师才能做实验", "Only teachers can do experiments"],
            ["实验做得越多，豆子长得越快", "The more experiments, the faster beans grow"],
          ],
          [
            "“我”用三个杯子做了实验，自己发现了豆子发芽需要水和合适的温度，所以说道理“藏在”实验里。",
            "With three cups the narrator finds out for himself what beans need; the reasons were there to find in the experiment.",
          ],
        ),
      ],
    },
    {
      id: "chinese-zhang-heng-and-his-seismoscope",
      title: ["张衡和地动仪", "Zhang Heng and His Seismoscope"],
      body: `张衡是东汉时候的科学家。他从小就喜欢读书，对天上的星星特别好奇，常常一看就是大半夜。

那时候，地震经常发生，给百姓带来很大的灾难。可是，地震常常发生在离京城很远的地方，消息要过很多天才能传到京城。张衡想：能不能做一个仪器，让人们早一点知道哪里发生了地震呢？

经过多年的研究，公元132年，张衡造出了地动仪。据说，地动仪的样子像一个大酒坛，四周有八条龙，每条龙的嘴里含着一颗铜球，下面各蹲着一只张大嘴的铜蟾蜍，样子像青蛙。哪个方向发生地震，那个方向的龙嘴就会张开，铜球落进蟾蜍嘴里，“当”的一声，人们就听见了。

有一次，一颗铜球突然落了下来，可是京城的人一点也没有感觉到。有人说地动仪不准。几天以后，西边送来消息，那里果然发生了地震。大家这才佩服起张衡来。`,
      names: ["张衡", "东汉", "132"],
      glossed: ["地动仪", "蟾蜍"],
      xp: 4,
      questions: [
        question(
          ["张衡为什么要造地动仪？", "Why did Zhang Heng build the seismoscope?"],
          ["让人们早一点知道哪里发生了地震", "So people would learn sooner where an earthquake had struck"],
          [
            ["用来观察天上的星星", "To watch the stars"],
            ["让地震不再发生", "To stop earthquakes"],
            ["告诉京城的人现在几点", "To tell the capital the time"],
          ],
          [
            "第二段说，张衡想：“能不能做一个仪器，让人们早一点知道哪里发生了地震呢？”",
            "The second paragraph says he wanted an instrument that would let people know sooner where an earthquake had happened.",
          ],
        ),
        question(
          ["地动仪怎样告诉人们地震的方向？", "How did the seismoscope show the direction of an earthquake?"],
          ["那个方向的龙嘴张开，铜球落进蟾蜍嘴里", "The dragon facing it opened its mouth and dropped a ball into a toad's mouth"],
          [
            ["八条龙一起张开嘴", "All eight dragons opened their mouths"],
            ["地动仪倒向那个方向", "The instrument fell over that way"],
            ["铜蟾蜍跳向那个方向", "A bronze toad jumped that way"],
          ],
          [
            "第三段说：“哪个方向发生地震，那个方向的龙嘴就会张开，铜球落进蟾蜍嘴里。”",
            "The third paragraph says the dragon on the side of the earthquake opened its mouth and its ball fell into the toad's mouth.",
          ],
        ),
        question(
          ["最后一段主要说明了什么？", "What does the last paragraph mainly show?"],
          ["地动仪真的能知道远方发生的地震", "The seismoscope really could detect a distant earthquake"],
          [
            ["京城发生了地震", "There was an earthquake in the capital"],
            ["地动仪测得不准", "The seismoscope was inaccurate"],
            ["西边的人也造了地动仪", "People in the west built one too"],
          ],
          [
            "京城的人没有感觉到地震，几天后西边送来消息，“那里果然发生了地震”，大家这才佩服张衡。",
            "No one in the capital felt anything, yet news came days later of an earthquake in the west, and people came to admire Zhang Heng.",
          ],
        ),
      ],
    },
  ],
);

/** gradeFourJourneys is the third reading unit of grade 4: notes from a journey. */
const gradeFourJourneys = unit(
  4,
  "chinese-reading-4-journeys",
  ["旅途见闻", "Notes from a Journey"],
  [
    {
      id: "chinese-a-letter-from-the-seaside",
      title: ["海边来信", "A Letter from the Seaside"],
      body: `亲爱的奶奶：

您好！暑假我跟爸爸妈妈来到了海边，已经住了三天了。我在这里看到了很多新奇的东西，想写信告诉您。

第一天下午，我们到海滩上玩。海水一直涨到我们脚边，我和妈妈只好往后退。可是第二天早上，海水退得很远很远，露出了一大片湿湿的沙滩。爸爸告诉我，这叫潮汐。很多地方的海水每天都会涨落两次，这主要是因为月亮的引力。

海水退了以后，沙滩上可热闹了。小虾在水坑里游来游去，一看见人影就躲进了沙子里。石头缝里还留着一些小鱼和海星。我拾了很多漂亮的贝壳，有的像扇子，有的像小喇叭。我挑了一个最好看的，准备带回去送给您。

奶奶，您一直住在山里，还没有见过大海吧？等我长大了，一定带您来看海。

祝您身体健康！

孙女 小雨

七月二十日`,
      names: ["小雨"],
      glossed: ["潮汐"],
      xp: 4,
      questions: [
        question(
          ["第二天早上，海边有什么变化？", "What has changed at the shore the next morning?"],
          ["海水退得很远，露出一大片沙滩", "The sea has gone far out, leaving a wide stretch of sand"],
          [
            ["海水涨到了脚边", "The sea has come up to their feet"],
            ["下了一场大雨", "There has been heavy rain"],
            ["沙滩上的贝壳都不见了", "The shells have all gone"],
          ],
          [
            "第三段说：“第二天早上，海水退得很远很远，露出了一大片湿湿的沙滩。”涨到脚边是第一天下午。",
            "The third paragraph says the sea has gone far out; it came up to their feet the afternoon before.",
          ],
        ),
        question(
          ["信里说，潮汐主要是因为什么？", "What does the letter say mainly causes the tides?"],
          ["月亮的引力", "The pull of the moon"],
          [
            ["风吹动海水", "The wind pushing the sea"],
            ["太阳把海水晒热", "The sun warming the sea"],
            ["小螃蟹在沙滩上挖洞", "Crabs digging in the sand"],
          ],
          ["第三段说：“这主要是因为月亮的引力。”", "The third paragraph says it is mainly the pull of the moon."],
        ),
        question(
          ["从信的最后几段可以看出什么？", "What do the last paragraphs of the letter show?"],
          ["小雨很爱奶奶，想让奶奶也看到大海", "Xiaoyu loves her grandmother and wants her to see the sea too"],
          [
            ["奶奶不喜欢大海", "Grandmother dislikes the sea"],
            ["小雨想搬到山里去住", "Xiaoyu wants to move to the mountains"],
            ["奶奶常常到海边去", "Grandmother often goes to the seaside"],
          ],
          [
            "小雨给奶奶挑了一个最好看的贝壳，还说：“等我长大了，一定带您来看海。”",
            "She picks out the prettiest shell for her grandmother and promises to bring her to see the sea when she grows up.",
          ],
        ),
      ],
    },
    {
      id: "chinese-my-first-snow",
      title: ["第一次看雪", "My First Snow"],
      body: `我家在南方，冬天很少下雪。我长到十岁，还从来没有见过真正的雪。

今年寒假，爸爸带我去北方的姑姑家过年。火车开了一天一夜，窗外的田野从绿色慢慢变成了灰色。第二天早上，我一睁眼，窗外全白了，下雪了！

我顾不上穿好衣服，就跑到院子里。雪花一片一片地飘下来，落在我的手心里，一会儿就化成了一个小水点。地上的雪厚厚的，踩上去软软的，还会轻轻地响，像在跟我说话。

表姐教我堆雪人。我们先滚了一个大雪球做身子，又滚了一个小雪球做头，再用两颗黑扣子做眼睛，用一根胡萝卜做鼻子。姑父说：“这场雪下得好，明年麦子会有好收成。厚厚的雪像一床大被子，能给麦苗保暖，还能冻死土里的害虫。”

那天晚上，我在日记里写道：雪不只是好看，原来它还是农民的好朋友。`,
      xp: 4,
      questions: [
        question(
          ["雪花落在“我”的手心里，怎么样了？", "What happens to the snowflakes that land on the narrator's palm?"],
          ["一会儿就化成了小水点", "They soon melt into drops"],
          [
            ["变得越来越大", "They grow bigger"],
            ["粘在手上一直不化", "They stick and never melt"],
            ["又被风吹走了", "The wind blows them away"],
          ],
          ["第三段说，雪花落在手心里，“一会儿就化成了一个小水点”。", "The third paragraph says they soon melt into little drops."],
        ),
        question(
          ["堆雪人时，用什么做雪人的鼻子？", "What is the snowman's nose made of?"],
          ["胡萝卜", "A carrot"],
          [
            ["黑扣子", "Black buttons"],
            ["小雪球", "A small snowball"],
            ["树枝", "A twig"],
          ],
          [
            "第四段说：“用一根胡萝卜做鼻子。”黑扣子做的是眼睛。",
            "The fourth paragraph says a carrot made the nose; the buttons were the eyes.",
          ],
        ),
        question(
          ["姑父为什么说“这场雪下得好”？", "Why does the uncle say the snow is good?"],
          ["雪能给麦苗保暖，还能冻死害虫", "It keeps the wheat warm and kills pests"],
          [
            ["下了雪可以堆雪人", "One can build snowmen"],
            ["下了雪就不用干活了", "No one has to work when it snows"],
            ["雪化了可以用来做饭", "Melted snow can be used for cooking"],
          ],
          [
            "姑父说，厚厚的雪“能给麦苗保暖，还能冻死土里的害虫”，所以明年会有好收成。",
            "He says the thick snow keeps the wheat warm and kills pests in the soil, so next year's harvest will be good.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-colours-of-a-map",
      title: ["地图上的颜色", "The Colours of a Map"],
      body: `打开一张中国地形图，你会看到上面涂着各种颜色。这些颜色可不是随便涂的，每一种都有它的意思。

蓝色表示水。大海、湖泊和河流都用蓝色画。海水越深，蓝色就越深；海边浅一些的地方，颜色就淡一些。

绿色表示平原，也就是又低又平的地方。平原上土地肥沃，适合种庄稼，很多城市也建在平原上。

黄色和棕色表示高原和山地。地势越高，颜色就越深。在我国的西南部，有一大片深棕色的地方，那就是青藏高原，被人们称为“世界屋脊”。

认识了这些颜色，就算没有去过一个地方，看看地图，也能知道那里是高山还是平原，是靠近大海还是离海很远。地图真像一位不会说话的向导啊！`,
      names: ["青藏高原"],
      glossed: ["地形图"],
      xp: 4,
      questions: [
        question(
          ["地形图上的绿色表示什么？", "What does green show on a relief map?"],
          ["平原", "Plains"],
          [
            ["大海", "The sea"],
            ["高原", "Plateaus"],
            ["森林", "Forests"],
          ],
          ["第三段说：“绿色表示平原，也就是又低又平的地方。”", "The third paragraph says green shows plains, low flat land."],
        ),
        question(
          ["海水越深，地图上的蓝色怎么样？", "How does the blue change where the sea is deeper?"],
          ["越深", "It is darker"],
          [
            ["越淡", "It is lighter"],
            ["变成绿色", "It turns green"],
            ["一点也不变", "It does not change"],
          ],
          ["第二段说：“海水越深，蓝色就越深。”", "The second paragraph says the deeper the sea, the darker the blue."],
        ),
        question(
          ["为什么说地图像“一位不会说话的向导”？", "Why is a map called a guide who cannot speak?"],
          ["看看地图，就能知道一个地方的样子", "A look at a map tells you what a place is like"],
          [
            ["地图上画着向导", "Guides are drawn on maps"],
            ["向导出门都带着地图", "Guides always carry maps"],
            ["地图上的颜色是向导涂的", "Guides colour the maps"],
          ],
          [
            "最后一段说，就算没有去过一个地方，“看看地图，也能知道那里是高山还是平原”，地图就像向导一样告诉我们。",
            "The last paragraph says that even without going there, a map tells you whether a place is mountains or plains, as a guide would.",
          ],
        ),
      ],
    },
  ],
);

/** gradeFiveReading is the reading unit of grade 5: discoveries in everyday life. */
const gradeFiveReading = unit(
  5,
  "chinese-reading-5-everyday",
  ["生活中的发现", "Discoveries in Everyday Life"],
  [
    {
      id: "chinese-fathers-vegetable-garden",
      title: ["父亲的菜园", "Father's Vegetable Garden"],
      body: `我家屋后有一块荒地，长满了野草，地里到处是石头。那年春天，父亲决定把它开成菜园。

母亲说：“这块地太硬了，种不出东西的。”父亲没有说话，每天下班回来，就扛着锄头去地里。他先把石头一块一块地搬出来，堆在地边，又把野草连根拔掉，再把硬邦邦的土一锄一锄地翻松。我放学回家，常常看见父亲弯着腰在地里干活，汗水湿透了衣服。

一个多月过去了，荒地终于变成了一块平整的菜地。父亲种上了青菜、豆角和黄瓜，每天早晚都去浇水。夏天到了，豆角爬满了架子，黄瓜一根根挂在藤上，青菜绿油油的，邻居们路过，都忍不住停下来看一看。

吃着自家种的菜，母亲笑着说：“还是你有办法。”父亲说：“哪有什么办法？地是硬的，人的手比它更硬。只要肯下力气，荒地也能长出好东西。”

那句话我一直记在心里。后来，每当我遇到难题想放弃的时候，就会想起父亲在菜园里弯着腰的背影。`,
      xp: 5,
      questions: [
        question(
          ["父亲开菜园，最先做的是什么？", "What does Father do first to make the garden?"],
          ["把地里的石头搬出来", "He carries the stones out of the ground"],
          [
            ["把土翻松", "He loosens the soil"],
            ["种上青菜和豆角", "He plants greens and beans"],
            ["每天早晚去浇水", "He waters it morning and evening"],
          ],
          [
            "第二段说：“他先把石头一块一块地搬出来……又把野草连根拔掉，再把硬邦邦的土一锄一锄地翻松。”",
            "The second paragraph says he first carries out the stones, then pulls the weeds, then loosens the soil.",
          ],
        ),
        question(
          ["“地是硬的，人的手比它更硬”是什么意思？", "What does “the ground is hard, but hands are harder” mean?"],
          ["只要肯吃苦、下力气，困难就能克服", "Hard work overcomes difficulty"],
          [
            ["父亲的手受了伤，变得很硬", "Father's hands were hurt and grew hard"],
            ["这块地太硬，种不出东西", "The ground is too hard to grow anything"],
            ["种菜不需要什么办法", "Growing vegetables takes no skill"],
          ],
          [
            "父亲接着说：“只要肯下力气，荒地也能长出好东西。”硬的土地是困难，更硬的手是人吃苦的决心。",
            "He goes on to say that with effort even wasteland grows good things; the harder hands are the will to work.",
          ],
        ),
        question(
          ["文章最后一段写出了什么？", "What does the last paragraph show?"],
          ["父亲的话一直激励着“我”", "Father's words keep encouraging the narrator"],
          [
            ["“我”后来也开了一块菜园", "The narrator later made a garden too"],
            ["母亲不相信父亲的话", "Mother does not believe Father"],
            ["“我”遇到难题就放弃了", "The narrator gives up when things are hard"],
          ],
          [
            "最后一段说：“那句话我一直记在心里。”每当遇到难题想放弃时，“我”就会想起父亲。",
            "The last paragraph says the narrator keeps the words in mind and remembers Father whenever tempted to give up.",
          ],
        ),
      ],
    },
    {
      id: "chinese-uses-of-bamboo",
      title: ["竹子的用处", "The Uses of Bamboo"],
      body: `竹子是一种生长很快的植物。春天，竹笋从土里钻出来，有的竹子一天能长高将近一米，几个月就能长成高高的竹子。

竹子的用处很多。竹笋可以做菜，味道鲜美。竹子又轻又结实，可以用来搭架子、做竹梯。把竹子劈成细细的竹条，能编成竹篮、竹席和竹筐。很早以前，还没有纸的时候，人们把字写在竹片上，再用绳子把竹片串起来，就成了书，这叫作竹简。

竹子还能做乐器。笛子就是用竹子做的，吹起来声音清脆悦耳。

我国古人十分喜爱竹子。竹子的茎是空心的，一节一节地向上长，人们常用它比喻谦虚、有气节的人。很多诗人写诗赞美竹子，画家也喜欢画竹子。`,
      glossed: ["竹简"],
      xp: 4,
      questions: [
        question(
          ["纸发明以前，人们把字写在哪里？", "Before paper, what did people write on?"],
          ["竹片上", "Strips of bamboo"],
          [
            ["竹席上", "Bamboo mats"],
            ["竹篮里", "Bamboo baskets"],
            ["竹笋上", "Bamboo shoots"],
          ],
          [
            "第二段说：“人们把字写在竹片上，再用绳子把竹片串起来，就成了书。”",
            "The second paragraph says people wrote on strips of bamboo tied together with string.",
          ],
        ),
        question(
          ["人们常用竹子比喻什么样的人？", "What kind of person is bamboo used to stand for?"],
          ["谦虚、有气节的人", "A modest person of integrity"],
          [
            ["长得很快的人", "A person who grows fast"],
            ["很会吹笛子的人", "A person who plays the flute well"],
            ["又轻又结实的人", "A person who is light and strong"],
          ],
          [
            "最后一段说，竹子的茎是空心的，一节一节地长，人们用它比喻“谦虚、有气节的人”。",
            "The last paragraph says its hollow, jointed stem stands for a modest person of integrity.",
          ],
        ),
        question(
          ["第二段主要写了什么？", "What is the second paragraph mainly about?"],
          ["竹子在生活中的各种用处", "The many uses of bamboo in daily life"],
          [
            ["竹子长得很快", "Bamboo grows fast"],
            ["古人喜爱竹子", "People of old loved bamboo"],
            ["竹子能做乐器", "Bamboo makes instruments"],
          ],
          [
            "第二段第一句“竹子的用处很多”是这一段的中心，后面写了做菜、搭架子、编竹器和做竹简。",
            "Its first sentence, bamboo has many uses, is its centre; the rest lists food, frames, baskets and books.",
          ],
        ),
      ],
    },
    {
      id: "chinese-dew-and-fog",
      title: ["露和雾", "Dew and Fog"],
      body: `清晨，我们常常看见草叶上挂着晶莹的露珠；有时候，城市和田野被白茫茫的大雾笼罩着。露和雾是从哪里来的呢？

空气里有我们看不见的水汽。白天气温高，空气能容纳很多水汽。到了夜里，特别是晴朗无风的夜里，地面和草叶的温度降得很快，靠近它们的空气也跟着变冷。空气变冷以后，容纳不了那么多水汽，多出来的水汽就在草叶上凝结成小水珠，这就是露。

如果靠近地面的一层空气都变冷了，水汽就会在空中凝结成无数细小的水滴，飘浮在空气里，这就是雾。雾很浓的时候，几米以外的东西都看不清楚，汽车要慢慢地开。

太阳出来以后，气温升高，露珠和雾里的小水滴又变成水汽，回到空气中。所以，露和雾到了中午就看不见了。`,
      xp: 4,
      questions: [
        question(
          ["露是怎样形成的？", "How does dew form?"],
          ["空气变冷，多出来的水汽在草叶上凝结成小水珠", "Cooling air leaves its extra water vapour as drops on the leaves"],
          [
            ["夜里下了一场小雨", "A light rain fell in the night"],
            ["草叶自己冒出了水", "The leaves give off water themselves"],
            ["太阳把水晒到了草叶上", "The sun dries water onto the leaves"],
          ],
          [
            "第二段说：“空气变冷以后，容纳不了那么多水汽，多出来的水汽就在草叶上凝结成小水珠，这就是露。”",
            "The second paragraph says cooled air cannot hold all its vapour, and the rest condenses on the leaves as dew.",
          ],
        ),
        question(
          ["什么样的夜里最容易形成露？", "On what kind of night does dew form most easily?"],
          ["晴朗无风的夜里", "A clear, still night"],
          [
            ["刮大风的夜里", "A windy night"],
            ["下大雨的夜里", "A rainy night"],
            ["很热的夜里", "A hot night"],
          ],
          [
            "第二段说，“特别是晴朗无风的夜里”，地面和草叶的温度降得很快。",
            "The second paragraph says the ground and leaves cool fastest on clear, still nights.",
          ],
        ),
        question(
          ["露和雾为什么到中午就看不见了？", "Why are dew and fog gone by noon?"],
          ["气温升高，小水珠又变成了水汽", "The air warms and the drops turn back into vapour"],
          [
            ["被人擦掉了", "People wipe them away"],
            ["被风吹到天上变成了云", "The wind blows them up into clouds"],
            ["都渗进了泥土里", "They soak into the soil"],
          ],
          [
            "最后一段说：“太阳出来以后，气温升高，露珠和雾里的小水滴又变成水汽，回到空气中。”",
            "The last paragraph says that as the sun warms the air, the drops turn back into vapour.",
          ],
        ),
      ],
    },
  ],
);

/** gradeFiveCharacter is the second reading unit of grade 5: the strength of character. */
const gradeFiveCharacter = unit(
  5,
  "chinese-reading-5-character",
  ["品格的力量", "The Strength of Character"],
  [
    {
      id: "chinese-li-shizhen",
      title: ["李时珍写药书", "Li Shizhen's Book of Medicines"],
      body: `李时珍是明朝的医学家，出生在一个医生家庭。他从小跟着父亲上山采药，认识了很多草药。

长大后，李时珍也做了医生。他在给病人看病时注意到，以前的药书里有不少错误：有的把两种不同的药当成了一种，有的把有毒的药说成没有毒。他想：药书错了，就会害了病人。于是，他下决心重新写一部药书。

为了弄清楚每一种药，李时珍走遍了许多名山大川，向农民、渔夫、猎人请教。听说有一种叫曼陀罗的花，能让人失去知觉，他就亲自尝了一点，记下了自己的感觉。

他用了二十七年，前后改了三次稿，终于写成了《本草纲目》。这部书记载了一千八百多种药物，还画了一千多幅图。后来，它被翻译成多种文字，传到了世界各地。`,
      names: ["李时珍", "明朝", "曼陀罗", "本草纲目"],
      xp: 4,
      questions: [
        question(
          ["李时珍为什么要重新写一部药书？", "Why did Li Shizhen set out to write a new book of medicines?"],
          ["以前的药书有错误，会害了病人", "The old books had mistakes that could harm patients"],
          [
            ["以前的药书太少了", "There were too few books"],
            ["父亲让他写", "His father told him to"],
            ["他想让自己出名", "He wanted to be famous"],
          ],
          [
            "第二段说，他注意到以前的药书有不少错误，想：“药书错了，就会害了病人。”于是下决心重新写。",
            "The second paragraph says he found many mistakes and thought wrong books would harm patients, so he resolved to write a new one.",
          ],
        ),
        question(
          ["李时珍为什么要亲自尝曼陀罗花？", "Why did he taste the datura flower himself?"],
          ["为了弄清楚这种药的作用", "To find out for himself what it did"],
          [
            ["因为他生病了", "Because he was ill"],
            ["因为这种花很好吃", "Because it tasted good"],
            ["因为农民请他尝一尝", "Because a farmer asked him to"],
          ],
          [
            "第三段一开头说“为了弄清楚每一种药”，他尝了曼陀罗花以后，“记下了自己的感觉”。",
            "The third paragraph opens with his aim of understanding every medicine; after tasting it he wrote down how he felt.",
          ],
        ),
        question(
          ["最后一段主要写了什么？", "What is the last paragraph mainly about?"],
          ["《本草纲目》的写成和它的影响", "How the Compendium was finished and how far it spread"],
          [
            ["李时珍小时候怎样采药", "How Li Shizhen gathered herbs as a child"],
            ["曼陀罗花有什么作用", "What the datura flower does"],
            ["以前的药书有哪些错误", "What the old books got wrong"],
          ],
          [
            "最后一段写他用了二十七年写成《本草纲目》，书里有多少药物和图，后来又“传到了世界各地”。",
            "The last paragraph tells of the twenty-seven years of work, what the book holds, and how it spread round the world.",
          ],
        ),
      ],
    },
    {
      id: "chinese-grandmothers-sewing-machine",
      title: ["外婆的缝纫机", "Grandmother's Sewing Machine"],
      body: `外婆家的窗边，放着一台旧缝纫机。它的漆已经掉了好几块，踏板一踩，就会发出一阵阵响声。

小时候，我最喜欢坐在旁边看外婆做衣服。她戴上老花镜，先用尺子量好布，再用粉笔画线，然后拿剪刀一剪，一块布就变成了衣袖和衣领。外婆的脚在踏板上轻轻一踩，针就上上下下地跳起来，布在她手里慢慢往前走，一道整整齐齐的线就出来了。

有一年冬天，我的棉衣破了一个洞。我以为外婆会给我买件新的，没想到她找来一块红布，剪成一朵梅花，缝在洞上。第二天穿到学校，同学们都问我是在哪里买的。

外婆常说：“东西用旧了，修一修还能用。”她一辈子都是这样过的。

现在，外婆已经老了，眼睛看不清针眼了。可是那台缝纫机还放在窗边，外婆每天都要用布把它擦得干干净净。我知道，她舍不得的不只是一台机器，还有那些一针一线的日子。`,
      xp: 5,
      questions: [
        question(
          ["“我”的棉衣破了，外婆是怎样做的？", "What does Grandmother do when the narrator's coat tears?"],
          ["用红布剪成梅花，缝在洞上", "She cuts a plum blossom from red cloth and sews it over the hole"],
          [
            ["给“我”买了一件新棉衣", "She buys a new coat"],
            ["把棉衣扔掉了", "She throws the coat away"],
            ["让妈妈拿去补", "She has Mother mend it"],
          ],
          [
            "第三段说：“没想到她找来一块红布，剪成一朵梅花，缝在洞上。”",
            "The third paragraph says she cut a plum blossom out of red cloth and sewed it over the hole.",
          ],
        ),
        question(
          [
            "“东西用旧了，修一修还能用”表现了外婆的什么品格？",
            "What does “old things can still be used once mended” show about Grandmother?",
          ],
          ["勤俭节约", "She is thrifty"],
          [
            ["喜欢买新东西", "She likes buying new things"],
            ["做事马马虎虎", "She is careless"],
            ["不愿意帮助别人", "She will not help others"],
          ],
          [
            "外婆不买新棉衣，而是把破洞补好，还说“她一辈子都是这样过的”，可见她勤俭节约。",
            "Instead of buying a new coat she mends the old one, and she has lived that way all her life: she is thrifty.",
          ],
        ),
        question(
          ["“她舍不得的不只是一台机器”是什么意思？", "What does “it is not only a machine she cannot part with” mean?"],
          ["缝纫机里有外婆多年辛苦生活的回忆", "The machine holds her memories of years of work"],
          [
            ["这台缝纫机很贵", "The machine was expensive"],
            ["外婆还想用它做衣服", "She still means to sew with it"],
            ["外婆怕别人把它拿走", "She is afraid someone will take it"],
          ],
          [
            "外婆已经看不清针眼，不能再用它了，却每天擦它；她舍不得的还有“那些一针一线的日子”。",
            "She can no longer see to sew, yet she cleans it every day; what she holds on to are the days of stitching.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-lantern-and-the-stars",
      title: ["灯笼和星星", "The Lantern and the Stars"],
      body: `春节的晚上，街上挂满了红灯笼。一只大红灯笼挂在最高的地方，照得四周亮堂堂的，来来往往的人都抬头看它。

大红灯笼得意极了。它看看天上的星星，说：“你们这么小，光这么弱，谁会看你们呢？你看，大家都在看我！”

星星没有和它争，只是静静地眨着眼睛。

夜深了，人们都回家了。店主走出来，“呼”的一声，把灯笼里的蜡烛吹灭了。大红灯笼一下子暗了下来，在冷风里摇来摇去，谁也看不见它了。

可是天上的星星还在亮着，一颗，两颗，三颗……越来越多，越来越亮。

屋檐下的猫头鹰对灯笼说：“你的光是蜡烛给的，蜡烛一灭，光就没了。星星的光是自己的，所以它们能一直亮到天明。”

大红灯笼低下了头，再也不说话了。`,
      xp: 4,
      questions: [
        question(
          ["大红灯笼为什么得意极了？", "Why is the red lantern so pleased with itself?"],
          ["来来往往的人都抬头看它", "Everyone passing looks up at it"],
          [
            ["它比星星挂得还高", "It hangs higher than the stars"],
            ["店主最喜欢它", "The shopkeeper likes it best"],
            ["猫头鹰夸它亮", "The owl praises its light"],
          ],
          [
            "第一段说“来来往往的人都抬头看它”，第二段它说：“你看，大家都在看我！”",
            "The first paragraph says passers-by all look up at it, and it boasts that everyone is looking at it.",
          ],
        ),
        question(
          ["大红灯笼为什么一下子暗了下来？", "Why does the lantern suddenly go dark?"],
          ["店主把里面的蜡烛吹灭了", "The shopkeeper blows out its candle"],
          [
            ["冷风把它吹坏了", "The cold wind breaks it"],
            ["星星把它挡住了", "The stars block it"],
            ["天已经亮了", "Day has come"],
          ],
          [
            "第四段说，店主“把灯笼里的蜡烛吹灭了”，大红灯笼“一下子暗了下来”。",
            "The fourth paragraph says the shopkeeper blows out the candle and the lantern goes dark at once.",
          ],
        ),
        question(
          ["猫头鹰的话告诉我们什么道理？", "What does the owl's speech teach?"],
          ["靠别人得来的光彩不长久，自己的本领才靠得住", "Glory borrowed from others does not last; only one's own ability does"],
          [
            ["星星比灯笼大得多", "Stars are much bigger than lanterns"],
            ["夜里不应该点灯笼", "Lanterns should not be lit at night"],
            ["蜡烛的光是最亮的", "Candlelight is the brightest"],
          ],
          [
            "猫头鹰说：“你的光是蜡烛给的，蜡烛一灭，光就没了。星星的光是自己的。”灯笼的光彩靠的是蜡烛，不是它自己。",
            "The owl says the lantern's light was the candle's and died with it, while the stars' light is their own.",
          ],
        ),
      ],
    },
  ],
);

/** gradeFiveScience is the third reading unit of grade 5: science around us. */
const gradeFiveScience = unit(
  5,
  "chinese-reading-5-science",
  ["身边的科学", "Science Around Us"],
  [
    {
      id: "chinese-why-the-sky-is-blue",
      title: ["天空为什么是蓝色的", "Why the Sky Is Blue"],
      body: `晴朗的白天，天空蓝得像一块透明的宝石。可是到了傍晚，西边的天空又常常被染成红色和橙色。天空的颜色为什么会变呢？

原来，太阳光看起来是白色的，其实是由红、橙、黄、绿、蓝、紫等各种颜色的光混合而成的。雨后出现的彩虹，就是太阳光被小水滴分开的样子。

太阳光穿过空气时，会碰到空气中许多极小的微粒。蓝色的光最容易被这些微粒向四面八方散开，于是整个天空都充满了蓝光，我们看到的天空就是蓝色的。

傍晚，太阳快落山了，阳光要斜着穿过很厚的一层空气，才能到达我们的眼睛。一路上，蓝光差不多都被散开了，剩下的主要是红光和橙光，所以晚霞是红色的。

如果没有空气，天空会是什么颜色呢？宇航员在月球上看到，即使是白天，天空也是黑色的。`,
      xp: 5,
      questions: [
        question(
          ["太阳光其实是由什么组成的？", "What is sunlight really made of?"],
          ["各种颜色的光混合而成", "Light of many colours mixed together"],
          [
            ["只有白色的光", "White light alone"],
            ["只有蓝色的光", "Blue light alone"],
            ["许多小水滴", "Many tiny drops of water"],
          ],
          [
            "第二段说，太阳光“其实是由红、橙、黄、绿、蓝、紫等各种颜色的光混合而成的”。",
            "The second paragraph says sunlight is a mixture of red, orange, yellow, green, blue, violet and other colours.",
          ],
        ),
        question(
          ["傍晚的天空为什么常常是红色的？", "Why is the evening sky often red?"],
          ["阳光穿过很厚的空气，蓝光差不多都被散开了", "Sunlight crosses so much air that almost all the blue is scattered away"],
          [
            ["太阳到了傍晚变成了红色", "The sun itself turns red in the evening"],
            ["傍晚空气里没有微粒", "There are no particles in the evening air"],
            ["彩虹挂在了西边", "A rainbow hangs in the west"],
          ],
          [
            "第四段说，阳光要斜着穿过很厚的空气，“蓝光差不多都被散开了，剩下的主要是红光和橙光”。",
            "The fourth paragraph says the light crosses a thick layer of air, losing nearly all its blue and leaving red and orange.",
          ],
        ),
        question(
          ["最后一段告诉我们什么？", "What does the last paragraph tell us?"],
          ["天空是蓝色的，和空气有关", "The sky is blue because of the air"],
          [
            ["月球上的白天特别亮", "Daytime on the moon is very bright"],
            ["宇航员不喜欢蓝色", "Astronauts dislike blue"],
            ["月球上的天空也是蓝色的", "The sky on the moon is blue too"],
          ],
          [
            "月球上没有空气，白天的天空也是黑色的。可见天空的蓝色，是空气里的微粒把蓝光散开造成的。",
            "The moon has no air and its daytime sky is black, which shows the blue comes from the air scattering light.",
          ],
        ),
      ],
    },
    {
      id: "chinese-a-silkworm-diary",
      title: ["养蚕日记", "A Silkworm Diary"],
      body: `四月三日

同桌送给我十几粒蚕卵，比芝麻还小。我把它们放在铺了纸的小盒子里，每天都要看好几遍。

四月十日

蚕宝宝出来了！它们黑黑的，细细的，像一条条会动的小线头。我赶紧去摘了几片嫩桑叶，切成细丝放进盒子里。它们一点一点地啃着，几乎听不见声音。

四月二十日

蚕宝宝长大了很多，身体变成了白色。这些天，它们有时会突然不吃也不动，像睡着了一样。查了资料我才知道，这叫“眠”。每眠一次，它们就脱一层皮，长大一圈。一条蚕一生要眠四次。

五月八日

有一条蚕的身体变得有点透明，不再吃桑叶，昂着头摇来摇去。到了晚上，它开始吐丝了！它一圈一圈地吐，把自己包了起来。三天以后，盒子里多了一个白白的蚕茧。

五月二十五日

蚕茧上破了一个小洞，钻出来一只白色的蛾子。看着它，我想：一粒小小的蚕卵，竟然要经过这么多变化，生命真奇妙啊！`,
      glossed: ["蚕茧", "蛾子"],
      xp: 4,
      questions: [
        question(
          ["刚出来的蚕宝宝是什么样子的？", "What do the newly hatched silkworms look like?"],
          ["黑黑的、细细的，像小线头", "Black and thin, like bits of thread"],
          [
            ["白白的、胖胖的", "White and plump"],
            ["比芝麻还小的圆粒", "Round specks smaller than sesame seeds"],
            ["身体有点透明", "Their bodies are a little see-through"],
          ],
          [
            "四月十日的日记说：“它们黑黑的，细细的，像一条条会动的小线头。”比芝麻还小的是蚕卵，变白和透明是后来的事。",
            "The entry of 10 April says they are black and thin like moving threads; the tiny specks were the eggs, and white and clear come later.",
          ],
        ),
        question(
          ["日记里的“眠”指的是什么？", "What is 眠 in the diary?"],
          ["蚕不吃也不动、要脱皮的时候", "The time a silkworm stops eating and moving before it sheds its skin"],
          [
            ["蚕每天晚上睡觉", "The silkworm's sleep every night"],
            ["蚕吐丝把自己包起来", "The silkworm wrapping itself in silk"],
            ["蚕变成了蛾子", "The silkworm turning into a moth"],
          ],
          [
            "四月二十日的日记说，蚕“突然不吃也不动”，这叫“眠”，“每眠一次，它们就脱一层皮”。",
            "The entry of 20 April says they suddenly stop eating and moving; this is 眠, and after each one they shed a skin.",
          ],
        ),
        question(
          ["这几篇日记主要记录了什么？", "What do the diary entries mainly record?"],
          ["蚕从卵到蛾子的变化", "How a silkworm changes from egg to moth"],
          [
            ["怎样去摘桑叶", "How to pick mulberry leaves"],
            ["同桌是怎样养蚕的", "How the deskmate raises silkworms"],
            ["蚕丝怎样做成衣服", "How silk is made into clothes"],
          ],
          [
            "日记按时间写了蚕卵、蚕宝宝、眠、吐丝结茧和蛾子钻出来，最后说“竟然要经过这么多变化”。",
            "The entries follow the eggs, the young worms, the moults, the cocoon and the moth, and end on how many changes there are.",
          ],
        ),
      ],
    },
    {
      id: "chinese-why-ice-floats",
      title: ["冰为什么浮在水上", "Why Ice Floats"],
      body: `往一杯水里放几块冰，冰块不会沉下去，而是浮在水面上。冬天，河面结了一层厚厚的冰，冰下的河水还在流。这是为什么呢？

大多数东西变冷的时候会缩小，变热的时候会胀大。水在四摄氏度以上也是这样。可是，当水的温度降到四摄氏度以下，再到结成冰的时候，它不但不缩小，反而会胀大。同样多的水，结成冰以后，体积要大十分之一左右。体积大了，同样大小的冰就比水轻，所以冰能浮在水面上。

水的这个特点，对河里和湖里的生命十分重要。冬天，水面先结冰，冰像一个盖子盖在水面上，挡住了外面的冷空气，下面的水就不容易再结冰。鱼儿和水草在冰下过冬，才不会被冻死。

不过，水结冰时会胀大，也会带来麻烦。冬天，装满水的玻璃瓶放在室外，可能会被冻裂；露在外面的水管，也要包上一层东西保暖。`,
      glossed: ["摄氏度"],
      xp: 5,
      questions: [
        question(
          ["同样多的水结成冰以后，体积会怎样？", "What happens to the volume of water when it freezes?"],
          ["大十分之一左右", "It grows by about a tenth"],
          [
            ["变小一些", "It shrinks a little"],
            ["一点也不变", "It stays the same"],
            ["变成原来的两倍", "It doubles"],
          ],
          [
            "第二段说：“同样多的水，结成冰以后，体积要大十分之一左右。”",
            "The second paragraph says the same water takes up about a tenth more room as ice.",
          ],
        ),
        question(
          ["冬天水面结冰，对鱼儿有什么好处？", "How does a frozen surface help the fish in winter?"],
          ["冰像盖子挡住冷空气，下面的水不容易结冰", "The ice is a lid that keeps out cold air, so the water below stays unfrozen"],
          [
            ["鱼儿可以吃冰", "The fish can eat the ice"],
            ["冰可以给鱼儿照亮", "The ice gives the fish light"],
            ["鱼儿可以躲在冰里", "The fish can hide inside the ice"],
          ],
          [
            "第三段说：“冰像一个盖子盖在水面上，挡住了外面的冷空气，下面的水就不容易再结冰。”",
            "The third paragraph says the ice covers the water like a lid and keeps out the cold, so the water below does not freeze.",
          ],
        ),
        question(
          ["最后一段主要说了什么？", "What is the last paragraph mainly about?"],
          ["水结冰时胀大，也会带来麻烦", "Water expanding as it freezes also causes trouble"],
          [
            ["冰为什么能浮在水上", "Why ice floats"],
            ["怎样做玻璃瓶", "How glass bottles are made"],
            ["冬天要多喝热水", "One should drink hot water in winter"],
          ],
          [
            "最后一段第一句说“水结冰时会胀大，也会带来麻烦”，后面举了玻璃瓶冻裂和水管要保暖的例子。",
            "Its first sentence says expansion also brings trouble, and it gives the cracked bottle and the wrapped pipes as examples.",
          ],
        ),
      ],
    },
  ],
);

/** gradeSixReading is the reading unit of grade 6: tradition and invention. */
const gradeSixReading = unit(
  6,
  "chinese-reading-6-tradition",
  ["传统与创造", "Tradition and Invention"],
  [
    {
      id: "chinese-movable-type",
      title: ["活字印刷", "Movable Type"],
      body: `在印刷术发明以前，书都是人一个字一个字抄出来的。抄一本书要花很长时间，还容易抄错，所以书很少，也很贵。

后来，人们发明了雕版印刷。先把整页的字刻在一块木板上，涂上墨，铺上纸，一印就是一页。这比抄书快多了。可是，印一本书要刻很多块木板，刻错一个字，整块木板就可能作废；书印完了，这些木板也就没有用了。

北宋时，一个叫毕昇的平民发明了活字印刷。他用胶泥做成一个个小方块，每个方块上刻一个字，再用火烧硬，这就是活字。印书的时候，把需要的活字挑出来，按顺序排在一块铁板上，就可以印刷了。印完以后，把活字拆下来，下次还能再用。常用的字，他还会多做几个，以备一页里多次用到。

印刷术是我国古代的四大发明之一，活字印刷让印书变得又快又省。它后来传到世界各地，对人类文化的发展作出了重大贡献。`,
      names: ["毕昇", "北宋"],
      glossed: ["雕版印刷", "活字"],
      xp: 5,
      questions: [
        question(
          ["雕版印刷有什么不足？", "What was the trouble with block printing?"],
          ["刻错一个字，整块木板就可能作废", "One wrong character could spoil a whole block"],
          [
            ["印一页书要抄很久", "A page took long to copy"],
            ["印完的活字不能再用", "Used type could not be used again"],
            ["印出来的字看不清楚", "The printed characters were unclear"],
          ],
          [
            "第二段说：“刻错一个字，整块木板就可能作废；书印完了，这些木板也就没有用了。”",
            "The second paragraph says one mistake could spoil a block, and the blocks were useless once the book was printed.",
          ],
        ),
        question(
          ["毕昇用什么做活字？", "What did Bi Sheng make his type from?"],
          ["胶泥", "Clay"],
          [
            ["木板", "Wooden boards"],
            ["铁板", "Iron plates"],
            ["竹片", "Strips of bamboo"],
          ],
          [
            "第三段说：“他用胶泥做成一个个小方块……再用火烧硬，这就是活字。”铁板是用来排字的。",
            "The third paragraph says he shaped clay into blocks and fired them; the iron plate held the type.",
          ],
        ),
        question(
          ["常用的字为什么要多做几个？", "Why did he make several of the common characters?"],
          ["一页里可能多次用到同一个字", "A page may use the same character several times"],
          [
            ["常用的字容易烧坏", "Common characters break easily in the fire"],
            ["常用的字更好看", "Common characters look better"],
            ["多做的可以卖给别人", "The extra type could be sold"],
          ],
          [
            "第三段最后一句说：“常用的字，他还会多做几个，以备一页里多次用到。”",
            "The last sentence of the third paragraph says so: a page may use a character several times.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-solar-terms",
      title: ["二十四节气", "The Twenty-Four Solar Terms"],
      body: `我国古代的农民在长期的劳动中发现，一年里天气的冷暖、雨水的多少，都是有规律的。人们根据太阳在一年中位置的变化，把一年分成二十四段，每一段叫一个节气，这就是二十四节气。

每个节气都有自己的名字，名字里藏着天气和农事的信息。“立春”是春天的开始；“雨水”时，降雨渐渐多了；“惊蛰”时，春雷响起，在地下过冬的小虫子被惊醒了；“谷雨”时，雨水滋润着刚播下的种子。到了“小满”，麦子的颗粒渐渐饱满；“芒种”则提醒农民，该收麦子、种水稻了。

为了好记，人们还编了节气歌：“春雨惊春清谷天，夏满芒夏暑相连，秋处露秋寒霜降，冬雪雪冬小大寒。”每一句代表一个季节的六个节气。

2016年，二十四节气被列入联合国教科文组织人类非物质文化遗产代表作名录。今天，它仍然提醒着人们按时耕种，也成为中国人生活的一部分。`,
      names: ["联合国教科文组织", "2016"],
      glossed: ["节气", "惊蛰", "芒种"],
      xp: 5,
      questions: [
        question(
          ["二十四节气是根据什么划分的？", "What are the solar terms divided by?"],
          ["太阳在一年中位置的变化", "The sun's changing position through the year"],
          [
            ["月亮的圆缺", "The phases of the moon"],
            ["每年下雨的天数", "The number of rainy days a year"],
            ["农民的生日", "Farmers' birthdays"],
          ],
          [
            "第一段说：“人们根据太阳在一年中位置的变化，把一年分成二十四段。”",
            "The first paragraph says the year is divided into 24 by the sun's changing position.",
          ],
        ),
        question(
          ["“惊蛰”这个名字告诉我们什么？", "What does the name 惊蛰 tell us?"],
          ["春雷响起，过冬的小虫子被惊醒了", "Spring thunder wakes the insects that wintered underground"],
          [
            ["麦子的颗粒渐渐饱满", "The grains of wheat fill out"],
            ["该收麦子、种水稻了", "It is time to reap wheat and plant rice"],
            ["降雨渐渐多了", "Rain grows more frequent"],
          ],
          [
            "第二段说：“‘惊蛰’时，春雷响起，在地下过冬的小虫子被惊醒了。”其他几项说的是小满、芒种和雨水。",
            "The second paragraph says so; the other options describe 小满, 芒种 and 雨水.",
          ],
        ),
        question(
          ["节气歌的每一句代表什么？", "What does each line of the solar-term song stand for?"],
          ["一个季节的六个节气", "The six solar terms of one season"],
          [
            ["一个节气", "One solar term"],
            ["一个月", "One month"],
            ["一种农活", "One kind of farm work"],
          ],
          ["第三段说：“每一句代表一个季节的六个节气。”", "The third paragraph says each line stands for the six terms of a season."],
        ),
      ],
    },
    {
      id: "chinese-the-story-of-kites",
      title: ["风筝的故事", "The Story of Kites"],
      body: `风筝是我国的传统玩具，已经有两千多年的历史了。传说最早的风筝是用木头做的，叫“木鸢”。后来，人们用竹子扎成骨架，糊上纸，做出了又轻又好放的纸风筝。

古时候，风筝不只是玩具。据说，有的军队曾经用风筝测量距离、传递消息。唐宋以后，放风筝渐渐成为人们喜爱的游戏。每年春天，人们都要到郊外去放风筝，天空中飞着蝴蝶、燕子、老鹰等各种各样的风筝。

做风筝是一门手艺。骨架要扎得左右对称，风筝飞起来才稳；纸要糊得平整，重量要轻。放风筝也有学问：要迎着风跑，等风把风筝托起来，再慢慢放线。

后来，风筝传到了世界各地。有人说，人们研究风筝怎样在空中飞得稳，对后来发明飞机也有帮助。今天，山东潍坊每年都举办国际风筝会，吸引了很多国内外的风筝爱好者。`,
      names: ["潍坊", "山东"],
      glossed: ["木鸢"],
      xp: 4,
      questions: [
        question(
          ["传说最早的风筝是用什么做的？", "What were the first kites made of, the story says?"],
          ["木头", "Wood"],
          [
            ["纸", "Paper"],
            ["竹子和纸", "Bamboo and paper"],
            ["布", "Cloth"],
          ],
          [
            "第一段说：“传说最早的风筝是用木头做的，叫‘木鸢’。”竹子和纸是后来才用的。",
            "The first paragraph says the first kites were of wood; bamboo and paper came later.",
          ],
        ),
        question(
          ["怎样才能让风筝飞得稳？", "What makes a kite fly steadily?"],
          ["骨架扎得左右对称", "A frame that is the same on both sides"],
          [
            ["纸糊得厚厚的", "Thick paper"],
            ["顺着风跑", "Running with the wind"],
            ["线放得越快越好", "Letting out the line as fast as possible"],
          ],
          [
            "第三段说：“骨架要扎得左右对称，风筝飞起来才稳。”放风筝要迎着风跑，线要慢慢放。",
            "The third paragraph says a symmetrical frame keeps it steady; one runs into the wind and lets the line out slowly.",
          ],
        ),
        question(
          ["这篇短文没有写到的是哪一项？", "Which does the passage not tell about?"],
          ["风筝的价格", "What kites cost"],
          [
            ["风筝的历史", "The history of kites"],
            ["怎样做风筝", "How kites are made"],
            ["怎样放风筝", "How kites are flown"],
          ],
          [
            "文章写了风筝的历史、做法和放法，没有写风筝卖多少钱。",
            "The passage tells of their history and how they are made and flown, not what they cost.",
          ],
        ),
      ],
    },
  ],
);

/** gradeSixHistory is the second reading unit of grade 6: figures from history. */
const gradeSixHistory = unit(
  6,
  "chinese-reading-6-history",
  ["历史上的人物", "Figures from History"],
  [
    {
      id: "chinese-zu-chongzhi-and-pi",
      title: ["祖冲之与圆周率", "Zu Chongzhi and Pi"],
      body: `圆的周长和直径之间，有一个固定的比值，叫作圆周率。不管圆有多大，周长总是直径的三倍多一点。可是，“多一点”到底是多少呢？古时候，许多数学家都在寻找这个答案。

南北朝时，有一位数学家叫祖冲之。一般认为，他用的是前人刘徽的“割圆术”：在圆里画一个正六边形，再把边数加倍，变成正十二边形、正二十四边形……边数越多，多边形就越接近圆，它的周长也就越接近圆的周长。

那时候没有计算器，所有的计算都要用一根根小竹棍摆来摆去，这叫作算筹。边数每加倍一次，计算就更复杂一些。祖冲之不怕麻烦，一遍一遍地算，终于算出圆周率在3.1415926和3.1415927之间。这个结果在世界上领先了近一千年。

为了纪念他，后来人们把月球上的一座环形山命名为“祖冲之环形山”。`,
      names: ["祖冲之", "刘徽", "南北朝", "3", "1415926", "1415927"],
      glossed: ["割圆术", "算筹", "环形山"],
      xp: 5,
      questions: [
        question(
          ["什么叫圆周率？", "What is pi?"],
          ["圆的周长和直径的比值", "The ratio of a circle's circumference to its diameter"],
          [
            ["圆的直径", "A circle's diameter"],
            ["圆的周长", "A circle's circumference"],
            ["正六边形的周长", "The perimeter of a hexagon"],
          ],
          [
            "第一段说：“圆的周长和直径之间，有一个固定的比值，叫作圆周率。”",
            "The first paragraph says the fixed ratio between circumference and diameter is called pi.",
          ],
        ),
        question(
          ["用割圆术时，多边形的边数越多，会怎么样？", "In the method of cutting the circle, what happens as the sides increase?"],
          ["多边形越接近圆，周长也越接近圆的周长", "The polygon comes closer to the circle, and its perimeter to the circumference"],
          [
            ["多边形越来越不像圆", "The polygon looks less and less like a circle"],
            ["计算变得越来越简单", "The sums grow simpler"],
            ["多边形的周长越来越小", "The polygon's perimeter shrinks"],
          ],
          [
            "第二段说：“边数越多，多边形就越接近圆，它的周长也就越接近圆的周长。”第三段说边数加倍，计算会更复杂。",
            "The second paragraph says so; the third says each doubling makes the sums harder, not easier.",
          ],
        ),
        question(
          [
            "“祖冲之不怕麻烦，一遍一遍地算”表现了他什么样的品质？",
            "What does “not minding the trouble, he worked it out again and again” show about him?",
          ],
          ["刻苦认真，坚持不懈", "He was diligent and persevering"],
          [
            ["粗心大意", "He was careless"],
            ["喜欢摆弄竹棍", "He liked playing with sticks"],
            ["只想快一点算完", "He only wanted to finish quickly"],
          ],
          [
            "没有计算器，算筹计算又越来越复杂，他却“一遍一遍地算”，直到算出结果，可见他刻苦认真、坚持不懈。",
            "With no calculator and ever harder sums, he worked them again and again until he had the answer: diligent and persevering.",
          ],
        ),
      ],
    },
    {
      id: "chinese-zheng-hes-voyages",
      title: ["郑和下西洋", "Zheng He's Voyages"],
      body: `六百多年前的明朝，有一支庞大的船队从江苏出发，驶向茫茫大海。带领这支船队的，就是航海家郑和。

郑和的船队有两百多艘船，两万多人。最大的船叫“宝船”，据说长一百多米，可以坐上千人，是当时世界上最大的木船。船上装着丝绸、瓷器和茶叶，还带着罗盘，用来在海上辨别方向。

从1405年到1433年，郑和先后七次带领船队远航，到过东南亚和印度洋沿岸的三十多个国家和地区，最远到达了非洲东部。每到一个地方，他们就用中国的丝绸、瓷器换回当地的香料、宝石，还把中国的文化介绍给当地的人们。

在海上航行，并不是一帆风顺的。船队遇到过狂风巨浪，也遇到过海盗。可是郑和沉着指挥，一次又一次带着船队渡过了难关。

郑和第一次远航，比哥伦布到达美洲早了八十多年。他的船队带去的不是战争，而是友谊和交流。`,
      names: ["郑和", "明朝", "江苏", "东南亚", "印度洋", "非洲", "哥伦布", "美洲", "1405", "1433"],
      glossed: ["宝船", "罗盘"],
      xp: 5,
      questions: [
        question(
          ["船上带着罗盘有什么用？", "What was the compass on board for?"],
          ["在海上辨别方向", "Finding the way at sea"],
          [
            ["换回当地的香料", "Trading for spices"],
            ["测量船有多长", "Measuring the ships"],
            ["打败海盗", "Fighting pirates"],
          ],
          ["第二段说，船上“还带着罗盘，用来在海上辨别方向”。", "The second paragraph says the compass was for finding direction at sea."],
        ),
        question(
          ["郑和的船队最远到达了哪里？", "How far did Zheng He's fleet go?"],
          ["非洲东部", "East Africa"],
          [
            ["美洲", "The Americas"],
            ["东南亚", "Southeast Asia"],
            ["江苏", "Jiangsu"],
          ],
          [
            "第三段说，船队“最远到达了非洲东部”。江苏是出发的地方，到达美洲的是哥伦布。",
            "The third paragraph says it reached East Africa; Jiangsu was where it set out, and it was Columbus who reached the Americas.",
          ],
        ),
        question(
          ["最后一句话说明了什么？", "What does the last sentence show?"],
          ["郑和远航是为了友好交流，不是为了打仗", "Zheng He sailed for friendship and exchange, not for war"],
          [
            ["郑和比哥伦布更有名", "Zheng He is more famous than Columbus"],
            ["郑和的船队很会打仗", "Zheng He's fleet was good at fighting"],
            ["哥伦布学习了郑和的办法", "Columbus copied Zheng He"],
          ],
          [
            "最后一句说：“他的船队带去的不是战争，而是友谊和交流。”第三段也写了他们用丝绸、瓷器和当地人交换东西。",
            "The last sentence says the fleet brought friendship and exchange, not war; the third paragraph tells of trading silk and porcelain.",
          ],
        ),
      ],
    },
    {
      id: "chinese-huang-daopo",
      title: ["黄道婆", "Huang Daopo"],
      body: `七百多年前的元朝，松江一带有一个穷苦的女孩，就是后来人们说的黄道婆。她从小在别人家里干活，从早忙到晚，还经常挨打。有一天，她实在受不了了，就偷偷跑出家门，躲上一条船，漂到了遥远的海南岛。

在海南岛，黄道婆和当地的黎族人生活在一起。黎族妇女很会种棉花、织棉布，织出的布又结实又好看。黄道婆虚心向她们学习，几十年后，她成了织布的能手。

年老的时候，黄道婆回到了家乡。那时，家乡的人去掉棉花里的籽，还要用手一颗一颗地剥，纺线也很慢。黄道婆把学到的技术教给乡亲们，还和大家一起改进了工具：她们做出了去籽的搅车，又把只能纺一根线的纺车，改成了能同时纺三根线的脚踏纺车。

从此，松江的棉布越织越多，越织越好，远近闻名，有了“衣被天下”的说法。黄道婆去世以后，乡亲们为她修了祠堂，一代一代地纪念她。`,
      names: ["黄道婆", "元朝", "松江", "海南岛", "黎族"],
      glossed: ["搅车", "纺车"],
      xp: 5,
      questions: [
        question(
          ["黄道婆在海南岛向谁学习织布？", "From whom did Huang Daopo learn weaving on Hainan?"],
          ["黎族妇女", "The Li women"],
          [
            ["松江的乡亲", "Her neighbours from Songjiang"],
            ["船上的人", "The people on the boat"],
            ["她的家人", "Her family"],
          ],
          [
            "第二段说：“黎族妇女很会种棉花、织棉布……黄道婆虚心向她们学习。”",
            "The second paragraph says the Li women were skilled at growing cotton and weaving, and she learned from them.",
          ],
        ),
        question(
          ["黄道婆回到家乡后做了什么？", "What did she do after returning home?"],
          ["把技术教给乡亲们，还改进了工具", "She taught her neighbours and improved their tools"],
          [
            ["开了一家卖布的店", "She opened a cloth shop"],
            ["又回到了海南岛", "She went back to Hainan"],
            ["种了很多棉花去卖", "She grew cotton to sell"],
          ],
          [
            "第三段说：“黄道婆把学到的技术教给乡亲们，还和大家一起改进了工具。”",
            "The third paragraph says she taught them what she had learned and improved the tools with them.",
          ],
        ),
        question(
          ["“衣被天下”在文中是什么意思？", "What does 衣被天下 mean in the passage?"],
          ["松江的棉布供天下人穿用，非常有名", "Songjiang's cloth clothed people far and wide and was famous"],
          [
            ["天下的衣服都是黄道婆一个人做的", "Huang Daopo made all the clothes in the land"],
            ["松江人都把被子当衣服穿", "Songjiang people wore quilts as clothes"],
            ["天下的人都到松江去买被子", "Everyone went to Songjiang to buy quilts"],
          ],
          [
            "前面说松江的棉布“越织越多，越织越好，远近闻名”，“衣被天下”是说这里的布让天下的人都有衣穿。",
            "Before it the passage says the cloth grew in quantity and quality and was known everywhere; the phrase means it clothed the land.",
          ],
        ),
      ],
    },
  ],
);

/** gradeSixThinking is the third reading unit of grade 6: think, then choose. */
const gradeSixThinking = unit(
  6,
  "chinese-reading-6-thinking",
  ["想一想，再选择", "Think, Then Choose"],
  [
    {
      id: "chinese-the-quarrel-in-the-clock",
      title: ["钟表里的争吵", "The Quarrel in the Clock"],
      body: `墙上有一只老钟，钟面上住着三根指针：又细又长的秒针，长一些的分针，短短粗粗的时针。

一天夜里，秒针忍不住抱怨起来：“我一刻不停地跑，一分钟就要跑一整圈，可人们看钟的时候，眼睛总是先看时针。这太不公平了！”

分针也说：“我虽然比你慢，可也是一步一步地走。时针整整一个小时才挪动那么一点，凭什么最受重视？”

时针没有生气，慢慢地说：“你们说得对，我走得最慢。可是，如果没有秒针跑满六十圈，就没有分针走完一圈；如果没有分针走完一圈，我也就不能从一个数字走到下一个数字。我能告诉人们现在是几点，靠的是你们每一步的努力。”

秒针和分针听了，都不说话了。从那以后，它们再也不争吵了，一起滴答滴答地往前走。

第二天早上，主人看了看钟，准时出门上班去了。他不知道，这只钟里的三根指针，昨天夜里刚刚想明白了一个道理。`,
      glossed: ["秒针", "分针", "时针"],
      xp: 4,
      questions: [
        question(
          ["秒针为什么觉得不公平？", "Why does the second hand feel it is unfair?"],
          ["它跑得最快，人们却总是先看时针", "It runs fastest, yet people look at the hour hand first"],
          [
            ["它走得最慢", "It is the slowest"],
            ["主人不喜欢它", "The owner dislikes it"],
            ["它被分针挡住了", "The minute hand hides it"],
          ],
          [
            "第二段秒针说：“我一刻不停地跑……可人们看钟的时候，眼睛总是先看时针。”",
            "In the second paragraph it complains that it never stops running, yet people look first at the hour hand.",
          ],
        ),
        question(
          ["时针说“靠的是你们每一步的努力”，意思是什么？", "What does the hour hand mean by “it rests on every step you take”?"],
          ["时针能往前走，离不开秒针和分针一步步地走", "The hour hand can move only because the other two keep stepping"],
          [
            ["时针自己走得最快", "The hour hand is the fastest"],
            ["秒针和分针应该停下来", "The other two should stop"],
            ["时针不需要别人帮助", "The hour hand needs no help"],
          ],
          [
            "时针说，秒针跑满六十圈，分针才走完一圈；分针走完一圈，时针才能走到下一个数字。",
            "It explains that sixty turns of the second hand make one of the minute hand, and that one turn moves the hour hand to the next number.",
          ],
        ),
        question(
          ["这个寓言告诉我们什么道理？", "What does the fable teach?"],
          [
            "集体里每个成员都重要，要互相配合，不必争谁更受重视",
            "Every member of a group matters; work together instead of competing for notice",
          ],
          [
            ["跑得最快的最重要", "The fastest matters most"],
            ["看钟要先看秒针", "One should read the second hand first"],
            ["钟表需要经常修理", "Clocks need frequent repair"],
          ],
          [
            "三根指针谁也离不开谁，它们“再也不争吵了，一起滴答滴答地往前走”，钟才能让主人准时出门。",
            "None of the hands can do without the others; once they stop quarrelling and move together, the clock gets its owner out on time.",
          ],
        ),
      ],
    },
    {
      id: "chinese-grandpas-reply",
      title: ["爷爷的回信", "Grandpa's Reply"],
      body: `亲爱的明明：

你的信我收到了。你在信里说，学钢琴已经两年了，最近越来越不想练，觉得每天弹同样的曲子太没意思，想放弃，问我该怎么办。

我先给你讲一件我年轻时的事。我十几岁时跟一位老师傅学做木工。头三个月，师傅什么也不让我做，只让我每天刨木板。我刨得手上起了泡，心里也很不服气，觉得这样下去什么也学不到。有一天，师傅让我做一张小板凳。我这才发现，因为木板刨得又平又直，凳子做出来特别稳。原来，那些枯燥的日子，都在为后面的本领打基础。

不过，爷爷也不想强迫你。你可以想一想：你不想练，是因为不喜欢钢琴，还是因为遇到了困难？如果是遇到了困难，那么熬过这一段，你就会看到另一片风景；如果你真的不喜欢，也可以和爸爸妈妈好好商量，去找你真正喜欢的事。

不管你怎样选择，爷爷都希望你想清楚了再决定，做了决定就认真做下去。

祝你天天开心！

爷爷

十月八日`,
      names: ["明明"],
      xp: 5,
      questions: [
        question(
          ["明明在信里向爷爷说了什么烦恼？", "What trouble did Mingming write to Grandpa about?"],
          ["学钢琴越来越不想练，想放弃", "He no longer wants to practise the piano and thinks of giving up"],
          [
            ["想跟爷爷学做木工", "He wants to learn carpentry"],
            ["家里的钢琴坏了", "The piano is broken"],
            ["和爸爸妈妈吵架了", "He has quarrelled with his parents"],
          ],
          [
            "第二段说，明明学钢琴两年了，“最近越来越不想练……想放弃，问我该怎么办”。",
            "The second paragraph says that after two years he no longer wants to practise and is thinking of giving up.",
          ],
        ),
        question(
          ["爷爷讲自己学木工的事，是想说明什么？", "What does Grandpa's story of learning carpentry show?"],
          ["枯燥的练习也在为以后的本领打基础", "Dull practice lays the ground for later skill"],
          [
            ["学木工比学钢琴容易", "Carpentry is easier than piano"],
            ["师傅对他很不好", "His master treated him badly"],
            ["做板凳是最难的事", "Making a stool is the hardest thing"],
          ],
          [
            "第三段最后说：“原来，那些枯燥的日子，都在为后面的本领打基础。”",
            "The third paragraph ends by saying the dull days were laying the ground for the skill that came after.",
          ],
        ),
        question(
          ["爷爷给明明的建议是什么？", "What does Grandpa advise?"],
          ["先想清楚原因再决定，决定了就认真做下去", "Think through the reason before deciding, then carry the decision through"],
          [
            ["不管怎样都要学下去", "Keep on with the piano whatever happens"],
            ["马上放弃钢琴", "Give up the piano at once"],
            ["改跟爷爷学木工", "Learn carpentry with Grandpa instead"],
          ],
          [
            "爷爷说“不想强迫你”，又说：“希望你想清楚了再决定，做了决定就认真做下去。”",
            "Grandpa says he will not force him, and hopes he will think it through before deciding and then stick to it.",
          ],
        ),
      ],
    },
    {
      id: "chinese-where-city-rain-goes",
      title: ["城市里的雨水去哪儿了", "Where the City's Rain Goes"],
      body: `下大雨的时候，有些城市的马路上很快就积满了水。汽车开过去，溅起高高的水花，人们只好卷起裤腿走路。这是为什么呢？

在乡村，雨水落到地上，大部分会慢慢渗进泥土里。可是在城市里，地面大多铺上了水泥和柏油，雨水渗不下去，只能顺着地面流进下水道。雨下得太大太急，下水道来不及排走，路上就积水了。

为了解决这个问题，人们提出了建设“海绵城市”的想法。就像海绵能吸水一样，城市也要能把雨水“吸”进去。人们把一些人行道换成透水砖，让雨水能从砖缝里渗下去；在路边修建低洼的绿地，下雨时把雨水存起来；在屋顶种上花草，让植物先“喝”掉一部分雨水。

这些存下来的雨水，还能重新利用，比如浇灌花草、冲洗马路。下雨时吸水，缺水时放水，这样的城市，就像一块会呼吸的海绵。`,
      glossed: ["海绵城市", "透水砖"],
      xp: 4,
      questions: [
        question(
          ["城市里下大雨，为什么容易积水？", "Why do city streets flood in heavy rain?"],
          [
            "地面铺了水泥和柏油，雨水渗不下去，下水道来不及排走",
            "Concrete and asphalt keep the rain from soaking in, and the drains cannot keep up",
          ],
          [
            ["城市里的雨比乡村大", "It rains harder in cities"],
            ["城市里没有下水道", "Cities have no drains"],
            ["汽车把水溅到了路上", "Cars splash water onto the road"],
          ],
          [
            "第二段说，城市地面“铺上了水泥和柏油，雨水渗不下去”，雨太大太急，“下水道来不及排走，路上就积水了”。",
            "The second paragraph says the paved ground lets no rain through and the drains cannot carry off a heavy downpour.",
          ],
        ),
        question(
          ["下面哪一项不是文中说的建设海绵城市的办法？", "Which is not one of the passage's ways of building a sponge city?"],
          ["把马路修得更高", "Raising the roads"],
          [
            ["把人行道换成透水砖", "Paving footpaths with permeable bricks"],
            ["在路边修建低洼的绿地", "Making low green spaces beside roads"],
            ["在屋顶种上花草", "Planting rooftops"],
          ],
          [
            "第三段说了透水砖、低洼的绿地和屋顶种花草三种办法，没有说把马路修高。",
            "The third paragraph names permeable bricks, low green spaces and planted roofs, not raising roads.",
          ],
        ),
        question(
          ["为什么说这样的城市“像一块会呼吸的海绵”？", "Why is such a city called a sponge that breathes?"],
          ["下雨时能吸水，缺水时能放水", "It takes in water when it rains and gives it back when water is short"],
          [
            ["城市里到处放着海绵", "There are sponges all over the city"],
            ["城市里的空气特别好", "The city's air is very good"],
            ["这样的城市从来不下雨", "It never rains in such a city"],
          ],
          [
            "最后一段说：“下雨时吸水，缺水时放水，这样的城市，就像一块会呼吸的海绵。”",
            "The last paragraph says it soaks up rain and lets it out when water is short, like a breathing sponge.",
          ],
        ),
      ],
    },
  ],
);

/** chineseReading are the reading units of Chinese, with the grade that offers each. */
export const chineseReading: readonly { readonly grade: number; readonly unit: ReadingUnitDef }[] = [
  ...earlyReading,
  { grade: 3, unit: gradeThreeReading },
  { grade: 3, unit: gradeThreeFriends },
  { grade: 3, unit: gradeThreeCurious },
  { grade: 4, unit: gradeFourReading },
  { grade: 4, unit: gradeFourWisdom },
  { grade: 4, unit: gradeFourJourneys },
  { grade: 5, unit: gradeFiveReading },
  { grade: 5, unit: gradeFiveCharacter },
  { grade: 5, unit: gradeFiveScience },
  { grade: 6, unit: gradeSixReading },
  { grade: 6, unit: gradeSixHistory },
  { grade: 6, unit: gradeSixThinking },
  ...juniorReading,
  ...seniorReading,
];
