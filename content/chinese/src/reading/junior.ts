// The reading units of grades 7 to 9 (docs/chinese-curriculum.md §9): narratives, expositions and arguments written for this
// subject, three units a grade, each passage with a short check.

import type { ReadingUnitDef } from "@ga/content";

import { question, unit } from "./kit.ts";

/** gradeSevenHome is the narrative unit of grade 7: warmth at home. */
const gradeSevenHome = unit(
  7,
  "chinese-reading-7-home",
  ["家常的温暖", "Warmth at Home"],
  [
    {
      id: "chinese-the-night-the-lights-went-out",
      title: ["停电的夜晚", "The Night the Lights Went Out"],
      body: `那天晚上，我正在写作业，屋里的灯忽然灭了。窗外一片漆黑，整栋楼都停电了。

妈妈摸出一根蜡烛点上，小小的火苗一跳一跳的，把我们三个人的影子投在墙上，忽大忽小。爸爸的手机没电了，妈妈的电脑也打不开，我的作业只好先放一放。平时，吃过晚饭，爸爸看手机，妈妈对着电脑加班，我关上门写作业。一家人虽然在同一个屋子里，却很少说话。

“咱们来讲故事吧。”爸爸提议。他讲起自己小时候的事：村里没有路灯，晚上去同学家，要提着一盏煤油灯走很远的田埂；有一回灯被风吹灭了，他一路摸黑回家，吓得直哭。妈妈听了哈哈大笑，说她小时候也怕黑，总要外婆陪着才敢睡觉。我从来不知道，高大的爸爸也会害怕，温和的妈妈小时候竟是个胆小鬼。

后来，爸爸又用手在烛光前做出各种影子，一会儿是飞翔的鸽子，一会儿是张嘴的小狗。我也学着做，可做出来的“兔子”只有一只耳朵，逗得大家笑个不停。

不知过了多久，灯“啪”的一声亮了。屋里一下子明亮起来，我却有点舍不得。爸爸看看手机，妈妈看看电脑，两个人互相看了一眼，都把它们放到了一边。

那一夜的烛光早已熄灭，可它照亮的那些笑声，我一直记得。`,
      xp: 5,
      questions: [
        question(
          ["停电以前，一家人的晚上通常是什么样子？", "Before the power cut, what were the family's evenings usually like?"],
          ["各忙各的，很少说话", "Each was busy alone and they seldom talked"],
          [
            ["一起看电视、聊天", "They watched television and chatted together"],
            ["一起出门散步", "They went out for a walk together"],
            ["爸爸每晚给“我”讲故事", "Father told the narrator a story every night"],
          ],
          [
            "第二段说：爸爸看手机，妈妈加班，“我”关门写作业，“一家人虽然在同一个屋子里，却很少说话”。",
            "The second paragraph says Father was on his phone, Mother worked and the narrator studied: in one home, they seldom talked.",
          ],
        ),
        question(
          [
            "灯亮以后，“我却有点舍不得”。“我”舍不得的是什么？",
            "When the lights come back, the narrator is a little sorry. Sorry to lose what?",
          ],
          ["停电时一家人在一起说笑的时光", "The time the family spent laughing together in the dark"],
          [
            ["那根快要烧完的蜡烛", "The candle that had nearly burned down"],
            ["还没写完的作业", "The unfinished homework"],
            ["窗外漆黑的夜色", "The dark night outside"],
          ],
          [
            "停电时，一家人讲故事、做手影，笑个不停。灯一亮，大家可能又各忙各的，所以“我”舍不得。",
            "In the dark the family told stories and made shadows; with the light back they might go their own ways again.",
          ],
        ),
        question(
          [
            "灯亮后，爸爸妈妈把手机和电脑“放到了一边”，说明了什么？",
            "When the light returns, the parents put their phone and computer aside. What does this show?",
          ],
          ["他们也想留住一家人相处的时光", "They too want to keep the time together"],
          [
            ["手机和电脑都坏了", "The phone and computer were broken"],
            ["他们准备早点睡觉", "They were getting ready for bed"],
            ["他们在生“我”的气", "They were angry with the narrator"],
          ],
          [
            "两个人先看看手机、电脑，又“互相看了一眼”，才放到一边：他们和“我”一样，珍惜这个晚上。",
            "They glance at their devices, then at each other, and set them aside: like the narrator, they value the evening.",
          ],
        ),
        question(
          ["最后一段在全文中起什么作用？", "What does the last paragraph do in the passage?"],
          ["点明中心，表达对那一夜亲情的怀念", "It states the theme, the narrator's fond memory of that family evening"],
          [
            ["说明蜡烛的用处", "It explains what candles are for"],
            ["交代停电的原因", "It explains why the power failed"],
            ["批评爸爸妈妈总看手机", "It criticizes the parents for always being on screens"],
          ],
          [
            "“它照亮的那些笑声，我一直记得”收束全文，写出“我”对那一夜一家人亲密相处的怀念。",
            "The laughter the candle lit, which the narrator still remembers, closes the passage on the memory of a close family evening.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-old-tree-by-the-gate",
      title: ["门前的老枣树", "The Old Tree by the Gate"],
      body: `老家门前有一棵老枣树，是爷爷年轻时亲手种下的。如今，它的树干要两个孩子手拉手才抱得过来，树皮又粗又硬，裂开一道道深深的纹路，像老人脸上的皱纹。

春天，老枣树发芽比别的树晚，可一开花就热闹了。米粒大小的黄绿色小花藏在叶子中间，并不起眼，香气却飘得很远，引来成群的蜜蜂，嗡嗡地忙个不停。

夏天，老枣树撑开一把巨大的绿伞。中午太阳火辣辣的，村里的老人搬着小凳子坐到树下，摇着扇子，说着地里的庄稼和村里的新鲜事。我们这些孩子在树下跳绳、捉迷藏，累了就躺在凉凉的石板上，听知了一声接一声地叫。

秋风一起，满树的枣子由青变红。爷爷举起长长的竹竿一打，枣子纷纷落下来，我们提着篮子满地捡，一边捡一边往嘴里塞。冬天，老枣树只剩下光秃秃的枝干，静静地站在寒风里。爷爷说，别看它现在像睡着了，它正在积蓄力气，等来年春天再发芽开花呢。

后来，我到城里上学，很少回老家了。可每当遇到困难、想要放弃的时候，我就会想起那棵老枣树：它在风雪里站了几十年，从来没有倒下。

去年秋天回家，老枣树又结满了枣子。我摘下一颗放进嘴里，又甜又脆，好像又听见了爷爷在树下喊我捡枣的声音。`,
      xp: 5,
      questions: [
        question(
          ["第二至四段是按什么顺序描写老枣树的？", "In what order do paragraphs two to four describe the tree?"],
          ["按春、夏、秋、冬的季节顺序", "By the seasons: spring, summer, autumn, winter"],
          [
            ["按从远到近的空间顺序", "By place, from far to near"],
            ["按从树根到树梢的顺序", "From the roots to the top"],
            ["按事情的重要程度", "By how important each thing is"],
          ],
          [
            "三段分别以“春天”“夏天”“秋风一起……冬天”开头，按季节的先后来写。",
            "The paragraphs open with spring, summer, then autumn and winter: they follow the seasons.",
          ],
        ),
        question(
          [
            "“树皮……裂开一道道深深的纹路，像老人脸上的皱纹”运用了什么修辞手法？",
            "Which figure of speech is “cracks in the bark like the wrinkles on an old face”?",
          ],
          ["比喻", "A simile"],
          [
            ["拟人", "Personification"],
            ["夸张", "Exaggeration"],
            ["排比", "Parallelism"],
          ],
          [
            "句子用“像”把树皮的纹路比作老人的皱纹，是比喻，写出了树的苍老。",
            "It likens the cracks to wrinkles with “like”, a simile showing how old the tree is.",
          ],
        ),
        question(
          [
            "爷爷说老枣树冬天“正在积蓄力气”，这句话说明了什么？",
            "Grandpa says the tree is gathering its strength in winter. What does this show?",
          ],
          ["冬天的老枣树并没有死，正在为春天发芽开花做准备", "The tree is not dead in winter but getting ready to flower"],
          [
            ["老枣树冬天还在长新叶", "The tree grows new leaves in winter"],
            ["老枣树已经老得没有力气了", "The tree is too old to have any strength"],
            ["爷爷打算把老枣树砍掉", "Grandpa plans to cut the tree down"],
          ],
          [
            "爷爷说“别看它现在像睡着了”，它在“等来年春天再发芽开花”。这是拟人的说法，写出树在冬天积蓄力量。",
            "Grandpa says it only looks asleep and is waiting to leaf and flower next spring: the tree is gathering strength.",
          ],
        ),
        question(
          [
            "第五段写“我”遇到困难时想起老枣树，有什么作用？",
            "Why does the fifth paragraph tell of the narrator thinking of the tree in hard times?",
          ],
          ["写出老枣树给了“我”坚持下去的力量", "It shows the tree gives the narrator strength to keep going"],
          [
            ["说明老枣树快要倒了", "It shows the tree is about to fall"],
            ["交代“我”为什么去城里上学", "It explains why the narrator went to school in town"],
            ["介绍枣树的生长习性", "It explains how such trees grow"],
          ],
          [
            "老枣树“在风雪里站了几十年，从来没有倒下”，“我”想放弃时就想起它：树成了“我”坚持的榜样。",
            "The tree has stood through decades of snow without falling; it is the narrator's example of holding on.",
          ],
        ),
      ],
    },
    {
      id: "chinese-my-first-dish",
      title: ["第一次做菜", "My First Dish"],
      body: `妈妈出差的那个周末，爸爸又要加班。临走前，他拍拍我的肩膀说：“中午你自己想办法吧，冰箱里有菜。”

我打开冰箱，看见几个西红柿和一盒鸡蛋。西红柿炒鸡蛋，我吃过上百次，应该不难吧？我学着妈妈的样子系上围裙，把西红柿切成块，又把三个鸡蛋打进碗里。可第一个鸡蛋就打歪了，蛋壳掉进碗里，我用筷子挑了半天才挑出来。

锅烧热了，我倒进油，又把蛋液倒下去。“刺啦”一声，油点溅到我的手背上，疼得我直甩手。等我回过神来，鸡蛋的边已经有点焦了。我赶紧把西红柿倒进去，手忙脚乱地翻炒，又想起没放盐，抓起盐罐就撒，结果撒多了。

菜终于出锅了。颜色不太好看，尝一口，咸得我直皱眉。我坐在饭桌前，忽然想起妈妈每天下班回家，系上围裙，不到半个小时就能端出三四个菜，有荤有素，咸淡正好。我从来没问过她累不累，有时还嫌菜不合口味。

晚上，妈妈打来电话，问我中午吃了什么。我说：“西红柿炒鸡蛋，我自己做的。”停了一下，我又说：“妈妈，等你回来，你教我做饭吧。”电话那头，妈妈笑了。

那盘菜的味道，我早就忘了。可是那天我明白了：每天按时端上桌的饭菜，从来不是理所当然的。`,
      xp: 5,
      questions: [
        question(
          ["下面哪一项不是“我”做菜时出的差错？", "Which of these was not one of the narrator's mistakes?"],
          ["忘了把西红柿切开", "Forgetting to cut up the tomatoes"],
          [
            ["蛋壳掉进了碗里", "Dropping eggshell into the bowl"],
            ["鸡蛋的边炒焦了", "Burning the edges of the egg"],
            ["盐放多了", "Putting in too much salt"],
          ],
          [
            "第二、三段写了蛋壳掉进碗里、鸡蛋边有点焦、盐撒多了；西红柿是切成块的。",
            "The second and third paragraphs tell of the shell, the burnt egg and the salt; the tomatoes were cut into pieces.",
          ],
        ),
        question(
          [
            "第四段把“我”做一道菜和妈妈每天做饭放在一起写，这种写法叫什么？",
            "The fourth paragraph sets the narrator's one dish beside Mother's daily cooking. What is this technique?",
          ],
          ["对比", "Contrast"],
          [
            ["比喻", "Simile"],
            ["倒叙", "Flashback"],
            ["夸张", "Exaggeration"],
          ],
          [
            "“我”做一道菜手忙脚乱、又咸又焦，妈妈半小时就能做好三四个菜。两相对比，写出妈妈的辛苦和能干。",
            "One hard, salty dish against Mother's three or four in half an hour: the contrast shows her skill and work.",
          ],
        ),
        question(
          ["“妈妈，等你回来，你教我做饭吧”表现了“我”什么样的变化？", "What change does “Mum, teach me to cook when you're back” show?"],
          ["体会到妈妈的辛苦，想要分担家务", "The narrator sees Mother's work and wants to share it"],
          [
            ["觉得做饭很好玩，想天天做", "The narrator finds cooking fun and wants to do it daily"],
            ["嫌妈妈做的菜不好吃", "The narrator dislikes Mother's cooking"],
            ["想让妈妈以后天天做西红柿炒鸡蛋", "The narrator wants this dish every day"],
          ],
          [
            "做菜之后，“我”想起妈妈每天做饭，后悔“从来没问过她累不累”，所以想学做饭，替妈妈分担。",
            "After cooking, the narrator remembers never asking whether Mother was tired, and wants to learn so as to help.",
          ],
        ),
        question(
          ["最后一句中“理所当然”是什么意思？", "What does 理所当然 mean in the last sentence?"],
          ["本来就应该这样，不用多想的事", "Something that goes without saying"],
          [
            ["非常有道理的事", "Something very reasonable"],
            ["非常简单的事", "Something very easy"],
            ["别人强迫去做的事", "Something forced on someone"],
          ],
          [
            "“理所当然”指按道理本来就该这样。说饭菜“从来不是理所当然的”，是说每顿饭背后都有妈妈的付出，不该被看作应该的。",
            "It means a matter of course; saying meals are never that means each one is Mother's work, not something owed.",
          ],
        ),
      ],
    },
  ],
);

/** gradeSevenWonders is the exposition unit of grade 7: small wonders of nature. */
const gradeSevenWonders = unit(
  7,
  "chinese-reading-7-small-wonders",
  ["小小的奇迹", "Small Wonders"],
  [
    {
      id: "chinese-how-spiders-build-webs",
      title: ["蜘蛛怎样织网", "How Spiders Build Webs"],
      body: `蜘蛛是织网的能手。它的腹部末端有几对纺器，纺器上有许多细小的孔。蜘蛛体内的丝液从小孔里流出来，被拉长以后，就变成了细细的丝。

我们在花园里常见的圆网，一般是这样织成的：蜘蛛先在两根树枝之间拉起一根丝，作为“桥”；再从桥的中间往下拉一根丝，拉成一个“丫”字形，确定网的中心；接着，从中心向四周拉出一根根放射状的丝，像自行车轮子的辐条；然后，从中心向外绕上几圈临时的丝，把辐条固定住；最后，它从外向里一圈一圈地绕上螺旋形的丝。一张圆网，往往不到一个小时就能织好。

有趣的是，网上的丝并不都一样。放射状的丝不粘，是蜘蛛走路的“道路”；螺旋形的丝上布满了小小的黏液珠，飞虫一碰到就被粘住。蜘蛛在网上爬动时，大多踩着不粘的丝走，所以不会被自己的网粘住。

蜘蛛丝很细，却十分结实。如果按同样的重量相比，有些蜘蛛丝比钢丝还要结实，而且很有弹性。科学家正在研究蜘蛛丝，希望将来能用类似的材料，制作更轻、更结实的绳子和衣物。

当然，并不是所有的蜘蛛都织网。有些蜘蛛在地上挖洞，躲在洞口等猎物经过；还有些蜘蛛善于跳跃，靠扑击捕捉昆虫。`,
      glossed: ["纺器", "黏液"],
      xp: 5,
      questions: [
        question(
          ["第二段介绍圆网的织法，用的是什么说明顺序？", "In what order does the second paragraph explain how an orb web is made?"],
          ["时间顺序", "Time order, step by step"],
          [
            ["空间顺序", "Order in space"],
            ["从结果到原因的逻辑顺序", "Logical order, from effect to cause"],
            ["从次要到主要的顺序", "From minor to major"],
          ],
          [
            "这一段用“先”“再”“接着”“然后”“最后”，按织网的先后步骤来说明，是时间顺序。",
            "First, then, next, after that, finally: the paragraph follows the steps in time.",
          ],
        ),
        question(
          ["“像自行车轮子的辐条”运用了什么说明方法？", "Which method of explanation is “like the spokes of a bicycle wheel”?"],
          ["打比方", "Analogy"],
          [
            ["作比较", "Comparison"],
            ["举例子", "Giving an example"],
            ["列数字", "Giving figures"],
          ],
          [
            "用人们熟悉的车轮辐条来比放射状的丝，让读者一下子想象出它的样子，这是打比方。",
            "It likens the radial threads to familiar spokes so the reader can picture them: an analogy.",
          ],
        ),
        question(
          [
            "“如果按同样的重量相比，有些蜘蛛丝比钢丝还要结实”运用了什么说明方法？",
            "Which method is “weight for weight, some spider silk is stronger than steel wire”?",
          ],
          ["作比较", "Comparison"],
          [
            ["打比方", "Analogy"],
            ["下定义", "Definition"],
            ["列数字", "Giving figures"],
          ],
          [
            "把蜘蛛丝和钢丝相比，突出蜘蛛丝的结实，是作比较。“按同样的重量”使比较更准确。",
            "Setting spider silk against steel shows its strength: a comparison, made exact by “weight for weight”.",
          ],
        ),
        question(
          ["蜘蛛为什么不会被自己的网粘住？", "Why is a spider not caught in its own web?"],
          ["它大多踩着不粘的放射状的丝走", "It mostly walks on the non-sticky radial threads"],
          [
            ["蛛丝一遇到空气就不粘了", "Silk stops being sticky in air"],
            ["它从来不到网上去", "It never goes onto the web"],
            ["网上所有的丝都不粘", "None of the threads are sticky"],
          ],
          [
            "第三段说，放射状的丝不粘，是蜘蛛走路的“道路”，蜘蛛“大多踩着不粘的丝走”。",
            "The third paragraph says the radial threads are not sticky and the spider mostly walks on them.",
          ],
        ),
      ],
    },
    {
      id: "chinese-why-leaves-change-colour",
      title: ["叶子为什么会变色", "Why Leaves Change Colour"],
      body: `秋天，许多树的叶子由绿变黄，有的还变成火红色。叶子为什么会变色呢？

原来，叶子里含有几种不同的色素。最多的是叶绿素，它是绿色的，能吸收阳光，帮助植物把水和二氧化碳变成养料并放出氧气，这个过程叫作光合作用。叶子里还有黄色和橙色的色素，叫类胡萝卜素，胡萝卜的颜色就来自它。春天和夏天，叶绿素的数量远远多于类胡萝卜素，把黄色遮住了，所以叶子看起来是绿的。

到了秋天，白天变短，气温下降，许多树开始为过冬做准备。叶绿素被分解得多，生成得少，越来越少，原本被遮住的黄色就显露出来了。银杏、杨树的叶子变成金黄色，就是这个道理。

那么红叶又是怎么来的呢？枫树等植物的叶子，在秋天会生成一种新的色素，叫花青素。白天阳光充足、晚上气温较低的时候，叶子里积累的糖分多，花青素就生成得多，叶子也就红得更鲜艳。所以，“霜叶红于二月花”的景色，在晴朗而凉爽的秋天最为常见。

不过，并不是所有的树都会在秋天变色落叶。松树、柏树的叶子像细针或小鳞片，表面有一层蜡质，能减少水分散失，冬天也能保持绿色，所以人们叫它们常绿树。`,
      glossed: ["叶绿素", "类胡萝卜素", "花青素", "光合作用", "常绿树"],
      xp: 5,
      questions: [
        question(
          ["春天和夏天，叶子为什么是绿色的？", "Why are leaves green in spring and summer?"],
          ["叶绿素比黄色的色素多得多，把黄色遮住了", "There is far more chlorophyll, which hides the yellow"],
          [
            ["叶子里只有叶绿素", "Leaves contain only chlorophyll"],
            ["类胡萝卜素在夏天变成了绿色", "The yellow pigment turns green in summer"],
            ["阳光把叶子晒成了绿色", "Sunlight dyes the leaves green"],
          ],
          [
            "第二段说，春夏时叶绿素“远远多于类胡萝卜素，把黄色遮住了”。黄色的色素一直都在。",
            "The second paragraph says chlorophyll far outnumbers the yellow pigment and hides it; the yellow is there all along.",
          ],
        ),
        question(
          ["“……这个过程叫作光合作用”运用了什么说明方法？", "Which method is “…this process is called photosynthesis”?"],
          ["下定义", "Definition"],
          [
            ["举例子", "Giving an example"],
            ["作比较", "Comparison"],
            ["列数字", "Giving figures"],
          ],
          [
            "句子先说清植物用阳光把水和二氧化碳变成养料的过程，再说它“叫作光合作用”，给这个概念下了定义。",
            "It states what the process is, then names it photosynthesis: a definition.",
          ],
        ),
        question(
          [
            "第三段写“银杏、杨树的叶子变成金黄色”，运用了什么说明方法？",
            "Which method is the mention of ginkgo and poplar leaves turning gold?",
          ],
          ["举例子", "Giving an example"],
          [
            ["打比方", "Analogy"],
            ["分类别", "Classification"],
            ["下定义", "Definition"],
          ],
          [
            "举出银杏、杨树这两种常见的树，具体说明叶绿素减少后黄色显露出来的道理，是举例子。",
            "Ginkgo and poplar are named as familiar cases of the yellow showing through: examples.",
          ],
        ),
        question(
          ["什么样的天气，能让红叶红得更鲜艳？", "What weather makes red leaves brightest?"],
          ["白天晴朗，晚上凉爽", "Sunny days and cool nights"],
          [
            ["连续阴雨", "Days of steady rain"],
            ["白天晚上都很热", "Hot days and hot nights"],
            ["常常刮大风", "Frequent strong winds"],
          ],
          [
            "第四段说，“白天阳光充足、晚上气温较低的时候”，糖分积累得多，花青素生成得多，叶子就更红。",
            "The fourth paragraph says sunny days and cool nights build sugar, so more of the red pigment forms.",
          ],
        ),
      ],
    },
    {
      id: "chinese-how-fireflies-glow",
      title: ["萤火虫的光", "How Fireflies Glow"],
      body: `夏夜的田野上，一闪一闪的萤火虫像飞舞的小灯笼。这些小虫为什么会发光呢？

萤火虫的腹部末端有发光器。发光器里有一种叫荧光素的物质，还有一种叫荧光素酶的物质。在荧光素酶的帮助下，荧光素与氧气发生反应，就放出了光。萤火虫通过控制进入发光器的氧气，让光一亮一灭。

萤火虫的光和普通电灯的光很不一样。老式的白炽灯通电以后，大部分电能变成了热，只有很少一部分变成了光，所以灯泡摸上去很烫手；萤火虫发光的时候，几乎不发热，所以人们把这种光叫作“冷光”。

萤火虫为什么要发光呢？对许多种萤火虫来说，光就是它们的“语言”。不同种类的萤火虫，闪光的快慢、长短和颜色各不相同，雄虫和雌虫就靠这些信号找到同类。有的萤火虫的幼虫也会发光，这可能是在警告敌人：我的味道不好，别来吃我。

全世界已知的萤火虫有两千多种。它们的幼虫大多生活在潮湿的草丛或水边，有的专吃蜗牛。可是近些年，在一些地方，萤火虫越来越少了。农药的大量使用、水源的污染，还有夜晚过亮的灯光，都在影响它们的生活。保护好干净的水和黑暗的夜空，夏夜的小灯笼才会一直亮下去。`,
      glossed: ["荧光素", "荧光素酶", "发光器", "白炽灯"],
      xp: 5,
      questions: [
        question(
          ["萤火虫是怎样发出光的？", "How does a firefly make its light?"],
          ["荧光素在荧光素酶的帮助下与氧气发生反应", "Luciferin reacts with oxygen, helped by luciferase"],
          [
            ["白天吸收阳光，晚上再放出来", "It stores sunlight by day and lets it out at night"],
            ["身体里有电流通过", "An electric current runs through its body"],
            ["翅膀互相摩擦产生火花", "Its wings rub together and spark"],
          ],
          [
            "第二段说：“在荧光素酶的帮助下，荧光素与氧气发生反应，就放出了光。”",
            "The second paragraph says luciferin reacts with oxygen with the help of luciferase, giving off light.",
          ],
        ),
        question(
          ["第三段主要运用了什么说明方法？", "Which method does the third paragraph mainly use?"],
          ["作比较", "Comparison"],
          [
            ["打比方", "Analogy"],
            ["分类别", "Classification"],
            ["列数字", "Giving figures"],
          ],
          [
            "这一段把白炽灯“大部分电能变成了热”和萤火虫“几乎不发热”放在一起，突出“冷光”的特点，是作比较。",
            "It sets the hot bulb against the firefly that barely warms, to show what cold light is: a comparison.",
          ],
        ),
        question(
          ["“全世界已知的萤火虫有两千多种”运用了什么说明方法？", "Which method is “over two thousand kinds of firefly are known”?"],
          ["列数字", "Giving figures"],
          [
            ["举例子", "Giving an example"],
            ["作比较", "Comparison"],
            ["下定义", "Definition"],
          ],
          [
            "用“两千多种”这个数字，具体说明萤火虫种类之多，是列数字。",
            "The figure, over two thousand, shows exactly how many kinds there are.",
          ],
        ),
        question(
          ["最后一段写萤火虫越来越少，作者的用意是什么？", "Why does the writer end with fireflies becoming rarer?"],
          ["提醒人们保护萤火虫的生活环境", "To remind us to protect where fireflies live"],
          [
            ["说明萤火虫的寿命很短", "To show fireflies live short lives"],
            ["证明萤火虫的光不够亮", "To prove their light is too dim"],
            ["介绍萤火虫捕食的方法", "To describe how fireflies hunt"],
          ],
          [
            "作者指出农药、污染和过亮的灯光在影响萤火虫，最后说要“保护好干净的水和黑暗的夜空”。",
            "The writer names pesticides, pollution and bright lights, and ends by asking us to keep water clean and nights dark.",
          ],
        ),
      ],
    },
  ],
);

/** gradeSevenHabits is the argument unit of grade 7: good habits of mind. */
const gradeSevenHabits = unit(
  7,
  "chinese-reading-7-habits",
  ["做事与求学", "Habits of Work and Study"],
  [
    {
      id: "chinese-dripping-water-wears-stone",
      title: ["滴水穿石", "Dripping Water Wears Away Stone"],
      body: `屋檐下的石阶上，常常有一个个小坑。那是雨水从屋檐滴下来，年复一年打出来的。一滴水的力量微不足道，可是千万滴水落在同一个地方，再硬的石头也会被打穿。这告诉我们：只要坚持不懈，就能做成看似做不到的事。

古往今来，许多有成就的人都懂得这个道理。汉代的司马迁立志写一部史书，他四处走访，查阅大量资料，即使遭遇了极大的不幸，也没有放下手中的笔。前后花了十几年，他终于写成了《史记》。如果没有这份坚持，就不会有这部流传至今的史学名著。

书法家王羲之从小练字，相传他常在池边洗笔，天长日久，一池清水都被染黑了。他的字之所以被后人称赞，靠的不是一时的灵感，而是一天又一天的练习。

在我们身边，坚持的例子也随处可见。有的同学每天早上背几个英语单词，一个学期下来，词汇量大大增加；有的同学每天跑步十几分钟，到了期末，体育成绩明显提高。每天的一点点，看起来不起眼，积累起来却十分可观。

当然，坚持并不是一件容易的事。困难会让人想放弃，进步慢会让人灰心。这时候，不妨想想石阶上的那些小坑：水滴从来没有想过一下子打穿石头，它只是每天都落在那里。

让我们都做一滴坚持的水吧。`,
      names: ["司马迁", "王羲之", "史记"],
      xp: 5,
      questions: [
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["只要坚持不懈，就能做成看似做不到的事", "With steady persistence, what seems impossible can be done"],
          [
            ["一滴水的力量微不足道", "One drop of water has little force"],
            ["练书法要从小练起", "Calligraphy must be learned young"],
            ["坚持是一件很难的事", "Persistence is very hard"],
          ],
          [
            "第一段由石阶上的小坑说起，最后一句“这告诉我们：只要坚持不懈，就能做成看似做不到的事”就是中心论点。",
            "After the pits in the step, the first paragraph ends with its thesis: steady persistence achieves what seems impossible.",
          ],
        ),
        question(
          ["第二、三段写司马迁和王羲之的事，属于什么论据？", "What kind of evidence are the stories of Sima Qian and Wang Xizhi?"],
          ["事实论据", "Factual evidence"],
          [
            ["道理论据", "Evidence from principle"],
            ["作者的亲身经历", "The writer's own experience"],
            ["反面的例子", "Counter-examples"],
          ],
          [
            "这两段讲的是历史人物的具体事情，用事实来证明坚持的作用，是事实论据。",
            "They tell what real people of history did, using facts to show what persistence achieves.",
          ],
        ),
        question(
          ["第二至四段主要运用了什么论证方法？", "Which method of argument do paragraphs two to four mainly use?"],
          ["举例论证", "Argument by example"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["对比论证", "Argument by contrast"],
            ["道理论证", "Argument from principle"],
          ],
          [
            "这三段先后举了司马迁、王羲之和身边同学的例子来证明论点，是举例论证。",
            "They give Sima Qian, Wang Xizhi and classmates as examples of the thesis.",
          ],
        ),
        question(
          ["文章开头从屋檐下石阶上的小坑写起，有什么好处？", "Why does the passage open with the pits in a stone step?"],
          ["从常见的现象入手，自然、形象地引出论点", "It leads to the thesis naturally and vividly from a common sight"],
          [
            ["说明石阶需要修补", "To say the step needs repair"],
            ["介绍雨水是怎样形成的", "To explain how rain forms"],
            ["证明石头不够坚硬", "To prove that stone is soft"],
          ],
          [
            "滴水打出小坑是人们常见的现象，作者由此说到“只要坚持不懈”的道理，开头自然又形象。",
            "Water wearing pits is a familiar sight; from it the writer draws the point about persistence.",
          ],
        ),
      ],
    },
    {
      id: "chinese-learning-begins-with-questions",
      title: ["学贵有疑", "Learning Begins with Questions"],
      body: `读书学习，最怕的是只记不想。古人说：“学贵有疑，小疑则小进，大疑则大进。”意思是说，学习贵在能发现疑问。有了疑问，才会去思考、去探究，学问也就在这个过程中增长了。

有疑问，才能有新的发现。一百多年前，德国科学家魏格纳在看世界地图时发现，南美洲东边的海岸线和非洲西边的海岸线，凹凸的形状竟然能大致对得上。许多人都看过这样的地图，却没有多想。魏格纳却问：这是巧合吗？它们以前会不会是连在一起的？他带着这个疑问，收集了大量的证据，后来提出了“大陆漂移”的学说。

有疑问，还要敢于提出来。孔子说过“敏而好学，不耻下问”，意思是聪明又爱学习，不把向地位、学问不如自己的人请教当作羞耻的事。连孔子都主张多问，我们在学习中遇到不懂的地方，又有什么不好意思开口的呢？

可是，有的同学怕问题提得不好被人笑话，宁愿把疑问藏在心里；有的同学觉得书上写的、老师讲的都不会错，从来不去多想一想。这样学习，知识只是被装进了脑子，却没有真正变成自己的东西。

当然，提出疑问不是随随便便地怀疑一切，而是要在认真读书、仔细观察的基础上提出问题，再想办法找到答案。

读书时，多问几个“为什么”吧。每一个问号，都可能是通向新知识的一扇门。`,
      names: ["魏格纳", "孔子", "南美洲", "非洲", "德国"],
      glossed: ["大陆漂移"],
      xp: 5,
      questions: [
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["学习贵在能发现疑问", "What matters in learning is finding questions"],
          [
            ["学习就是把知识记住", "Learning is memorizing knowledge"],
            ["要多看世界地图", "We should look at world maps more"],
            ["书上写的都不会错", "What books say is never wrong"],
          ],
          [
            "第一段引用“学贵有疑”，并解释为“学习贵在能发现疑问”，这就是全文的中心论点。",
            "The first paragraph quotes the saying and explains it: what matters in learning is finding questions.",
          ],
        ),
        question(
          ["魏格纳的事例证明了什么？", "What does the story of Wegener prove?"],
          ["有疑问，才能有新的发现", "Questions lead to new discoveries"],
          [
            ["看地图能让人变聪明", "Looking at maps makes people clever"],
            ["所有的海岸线都能拼在一起", "All coastlines fit together"],
            ["科学家从来不犯错误", "Scientists never make mistakes"],
          ],
          [
            "第二段的第一句“有疑问，才能有新的发现”是这一段的观点，魏格纳的事例就是用来证明它的。",
            "The paragraph's first sentence, questions lead to discoveries, is the point Wegener's story proves.",
          ],
        ),
        question(
          ["第三段引用孔子的“敏而好学，不耻下问”，属于什么论据？", "What kind of evidence is the quotation from Confucius?"],
          ["道理论据", "Evidence from principle"],
          [
            ["事实论据", "Factual evidence"],
            ["作者的亲身经历", "The writer's own experience"],
            ["反面的例子", "A counter-example"],
          ],
          [
            "引用古代思想家的名言来证明“有疑问还要敢于提出来”，是道理论据。",
            "A wise man's saying, quoted to prove we should dare to ask, is evidence from principle.",
          ],
        ),
        question(
          ["第五段“当然……”在文中起什么作用？", "What does the fifth paragraph, beginning “Of course…”, do?"],
          ["补充说明提出疑问要有依据，使观点更全面", "It adds that doubt needs grounds, making the view more complete"],
          [
            ["否定前面的观点", "It rejects the view argued before"],
            ["举出一个新的事例", "It gives a new example"],
            ["说明提问容易被人笑话", "It says asking questions gets you laughed at"],
          ],
          [
            "这一段说明提出疑问不是“怀疑一切”，而要以认真读书、仔细观察为基础，防止读者误解，论证更严密。",
            "It warns that doubt is not doubting everything but rests on careful study, guarding against a misreading.",
          ],
        ),
      ],
    },
    {
      id: "chinese-small-things-are-not-small",
      title: ["小事不小", "Small Things Are Not Small"],
      body: `有人觉得，要做就做大事，小事不值得花心思。其实，小事并不小。大事往往是由许多小事组成的，一件小事做不好，也可能影响全局。

西方有一首古老的民谣：少了一颗钉子，掉了一只马蹄铁；掉了一只马蹄铁，倒下一匹战马；倒下一匹战马，输掉一场战斗；输掉一场战斗，亡了一个国家。一颗钉子看起来微不足道，却牵动着那么多后果。民谣说得有些夸张，道理却很实在。

在现代工程中，这个道理更加明显。一枚火箭由成千上万个零件组成，只要其中一个小零件出了问题，就可能导致发射失败。所以，航天工作者对每一个螺丝、每一根导线都要反复检查，不敢有一点马虎。正是因为他们认真对待每一件“小事”，才有了一次次成功的发射。

我国古代思想家荀子说：“不积跬步，无以至千里；不积小流，无以成江海。”跬步就是半步。千里之行，是一步一步走出来的；江河湖海，是一条条小溪汇成的。没有平时点点滴滴的积累，就不会有后来的成就。

对我们中学生来说，认真写好每一个字，仔细算对每一道题，按时完成每一次作业，都是小事。可是，养成了认真对待小事的习惯，将来面对大事，才能做得好。

不要小看身边的小事吧。把小事做好，本身就是一件了不起的事。`,
      names: ["荀子"],
      glossed: ["跬步", "马蹄铁"],
      xp: 5,
      questions: [
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["小事并不小，做好小事十分重要", "Small things are not small; doing them well matters"],
          [
            ["要做就做大事", "If you do anything, do big things"],
            ["少了一颗钉子就会亡国", "One lost nail ruins a country"],
            ["航天工作非常危险", "Space work is very dangerous"],
          ],
          [
            "第一段先摆出“小事不值得花心思”的看法，接着说“其实，小事并不小”，这是全文的论点。",
            "The first paragraph sets out the view that small things don't matter, then answers it: small things are not small.",
          ],
        ),
        question(
          ["第三段写火箭零件和航天工作者，运用了什么论证方法？", "Which method of argument does the paragraph on rockets use?"],
          ["举例论证", "Argument by example"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["对比论证", "Argument by contrast"],
            ["道理论证", "Argument from principle"],
          ],
          [
            "这一段举出航天工程中认真检查每个零件的例子，证明小事关系全局，是举例论证。",
            "It gives the example of checking every part of a rocket to prove small things decide the whole.",
          ],
        ),
        question(
          ["第四段引用荀子的话，属于什么论据？", "What kind of evidence is the quotation from Xunzi?"],
          ["道理论据", "Evidence from principle"],
          [
            ["事实论据", "Factual evidence"],
            ["作者的亲身经历", "The writer's own experience"],
            ["反面的例子", "A counter-example"],
          ],
          [
            "引用古代思想家的名言，说明成就来自点滴积累，是道理论据。",
            "A thinker's words, showing that achievement comes from small steps, are evidence from principle.",
          ],
        ),
        question(
          ["“民谣说得有些夸张，道理却很实在”是什么意思？", "What does “the rhyme exaggerates, but its point is sound” mean?"],
          ["民谣把后果说得夸大了，但它说明的道理是对的", "The rhyme overstates the result, but what it teaches is true"],
          [
            ["民谣讲的是真实的历史", "The rhyme tells true history"],
            ["民谣说的道理是错的", "The rhyme's point is wrong"],
            ["作者不相信这首民谣", "The writer does not believe the rhyme"],
          ],
          [
            "一颗钉子导致亡国是夸张的说法，但“一件小事做不好，也可能影响全局”的道理是真实的。",
            "A nail losing a kingdom is an exaggeration, yet the lesson that a small failure can spoil the whole holds.",
          ],
        ),
      ],
    },
  ],
);

/** gradeEightRemembered is the narrative unit of grade 8: people and places remembered. */
const gradeEightRemembered = unit(
  8,
  "chinese-reading-8-remembered",
  ["记忆里的人和事", "People and Places Remembered"],
  [
    {
      id: "chinese-the-watchmaker-on-old-street",
      title: ["老街的修表铺", "The Watchmaker on Old Street"],
      body: `老街拐角有一间小小的修表铺，门口挂着一块木牌，上面写着“修表”两个字，油漆已经掉得差不多了。铺子的主人姓陈，街坊们都叫他陈师傅。

陈师傅六十多岁，头发花白，左眼上常年戴着一个黑色的放大镜。他修表的时候，整个人几乎趴在工作台上，用细细的镊子夹起比米粒还小的零件，一个一个地拆下来，摆在白布上，排得整整齐齐。那时，铺子里安静得只能听见表针“滴答滴答”的声音。

我第一次走进修表铺，是为了爷爷留下的一块旧手表。那块表已经停了好几年，商场里的店员看了一眼，就说零件早就不生产了，不如买块新的。陈师傅却把表放在耳边听了听，又打开后盖看了很久，说：“能修，就是要慢一点。”

一个星期后，我去取表。陈师傅把表递给我，表针正稳稳地走着。他说，有一个小齿轮坏了，找不到配件，他就照着原来的样子，自己用铜片磨了一个。我问他要多少钱，他只收了很少的一点，说：“这是老人家留下的东西，能接着走，比什么都强。”

如今，戴手表的人越来越少，修表铺的生意也越来越冷清。有人劝陈师傅改行，他总是笑笑，说：“总有人的表会停，总得有人会修。”

每次路过老街，我都会朝铺子里望一眼。那盏昏黄的台灯下，陈师傅还在低着头，一点一点地，修着别人的时间。`,
      glossed: ["镊子"],
      xp: 6,
      questions: [
        question(
          ["第二段描写陈师傅修表的样子，主要突出了他的什么特点？", "What does the second paragraph's picture of him at work bring out?"],
          ["做事专注、细致", "He is focused and careful"],
          [
            ["视力很差", "His eyesight is poor"],
            ["修表速度特别快", "He repairs watches very fast"],
            ["铺子的生意很好", "His shop does good business"],
          ],
          [
            "“整个人几乎趴在工作台上”，零件“一个一个地拆下来……排得整整齐齐”，铺子里安静得只听见表针声，都写出了他的专注和细致。",
            "Bent over the bench, laying out tiny parts in neat rows in a silent shop: every detail shows his care and focus.",
          ],
        ),
        question(
          [
            "第三段写商场店员和陈师傅对旧表的不同态度，用了什么写法？",
            "The third paragraph sets the shop assistant beside Master Chen. What technique is this?",
          ],
          ["对比", "Contrast"],
          [
            ["倒叙", "Flashback"],
            ["比喻", "Simile"],
            ["设问", "A question answered by the writer"],
          ],
          [
            "店员“看了一眼”就劝买新的，陈师傅却听了又看，说“能修”。两相对比，突出了陈师傅的认真和对旧物的珍惜。",
            "One glance and “buy a new one”, against listening, looking and “it can be fixed”: the contrast shows his care for old things.",
          ],
        ),
        question(
          [
            "“这是老人家留下的东西，能接着走，比什么都强”表现了陈师傅怎样的品质？",
            "What does “it was left by an old man; that it runs again beats anything” show about him?",
          ],
          ["懂得旧物里的感情，看重手艺而不看重钱", "He understands what old things mean and values craft over money"],
          [
            ["认为旧表比新表走得准", "He thinks old watches keep better time"],
            ["想让“我”以后常来光顾", "He wants the narrator's custom"],
            ["嫌修表的钱太少", "He thinks the fee is too small"],
          ],
          [
            "他自己磨了齿轮，却“只收了很少的一点”，看重的是这块表对“我”的意义。",
            "He made a gear by hand yet charged little: what he cared about was what the watch meant to the narrator.",
          ],
        ),
        question(
          ["结尾说陈师傅“修着别人的时间”，这句话有什么含义？", "What does the ending, “mending other people's time”, mean?"],
          ["既指修好手表让它重新走动，也指守护人们珍贵的记忆", "Both making watches run again and keeping people's memories alive"],
          [
            ["陈师傅在帮别人安排时间", "He plans other people's schedules"],
            ["陈师傅每天工作的时间太长", "He works too many hours"],
            ["修表浪费了别人的时间", "Repairs waste people's time"],
          ],
          [
            "表上走的是时间，爷爷的旧表又连着“我”对爷爷的记忆。陈师傅修好的，不只是机器，还有人们珍惜的过去。",
            "A watch keeps time, and Grandpa's watch keeps a memory; he repairs not just machines but a valued past.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-blue-umbrella",
      title: ["那把蓝伞", "The Blue Umbrella"],
      body: `那是初二的一个傍晚，放学时天还好好的，刚走到公交车站，大雨就哗哗地下了起来。车站的棚子很窄，挤满了躲雨的人，我只能站在边上，半个身子露在雨里，书包很快湿了一大块。

我心里着急：书包里还有明天要交的作文。正发愁，头顶忽然多了一把伞。我回过头，是一位穿着工作服的阿姨，手里提着一个装满工具的布袋，衣服上沾着点点白灰。她冲我笑了笑，什么也没说，只是把伞往我这边又挪了挪。

我注意到，她自己的肩膀已经被雨淋湿了。我有点不好意思，说：“阿姨，您自己打着吧。”她摇摇头：“你背着书包呢，书可不能湿。”

车来了，是我要坐的那一路。阿姨把伞塞到我手里：“拿着吧，下车还要走路呢。”我还没来得及问她的名字，她已经转身跑进了雨里，很快就看不见了。

那把伞是蓝色的，伞柄上缠着一圈胶布，大概是坏过又修好的。我把它洗干净，晾干，放在门边，想着哪天在车站遇到她，就还给她。可是一个月过去了，我再也没见过她。

后来，每逢下雨，我都会多带一把伞。有一次，我把伞递给车站里一个没带伞的小学生。他愣了一下，接过伞，小声说了句“谢谢”。看着他跑远的背影，我好像终于明白了那位阿姨当时的心情。

那把蓝伞，我一直没能还给她。不过我想，也许她并不需要我还。`,
      xp: 6,
      questions: [
        question(
          [
            "“穿着工作服”“提着一个装满工具的布袋”“衣服上沾着点点白灰”，这些细节说明阿姨是什么人？",
            "What do the work clothes, the bag of tools and the specks of plaster suggest about the woman?",
          ],
          ["一位刚下班的普通劳动者", "An ordinary worker on her way home from work"],
          [
            ["一位来接孩子的老师", "A teacher come to fetch a child"],
            ["一位在车站值班的工作人员", "A member of the bus station staff"],
            ["一位卖伞的小商贩", "A street seller of umbrellas"],
          ],
          [
            "工作服、工具和身上的白灰，说明她是一位干体力活的工人，傍晚下班正在等车。",
            "Work clothes, tools and plaster show a manual worker waiting for her bus after work.",
          ],
        ),
        question(
          ["“伞柄上缠着一圈胶布，大概是坏过又修好的”，这个细节有什么作用？", "What does the detail of the taped, mended handle add?"],
          ["说明伞很旧，阿姨的生活并不宽裕，却仍把伞给了“我”", "The umbrella is old and she is not well off, yet she gave it away"],
          [
            ["说明阿姨做事很粗心", "It shows she is careless"],
            ["说明这把伞是新买的", "It shows the umbrella is new"],
            ["说明“我”把伞弄坏了", "It shows the narrator broke it"],
          ],
          [
            "坏了还要修好再用，可见阿姨过日子很节省。这样一把舍不得扔的伞，她却给了一个陌生的学生，更见她的善良。",
            "Mending rather than replacing shows thrift; giving such an umbrella to a stranger shows her kindness all the more.",
          ],
        ),
        question(
          [
            "第六段写“我”把伞递给一个小学生，在文中有什么作用？",
            "What does the sixth paragraph, where the narrator hands an umbrella to a child, do?",
          ],
          ["写出善意被传递下去，深化了文章的主题", "It shows kindness passed on and deepens the theme"],
          [
            ["说明“我”家里的伞太多了", "It shows the narrator has too many umbrellas"],
            ["交代那位阿姨后来的去向", "It tells where the woman went"],
            ["批评小学生出门不带伞", "It criticizes the child for forgetting an umbrella"],
          ],
          [
            "“我”像阿姨一样帮助陌生人，并“终于明白了那位阿姨当时的心情”：善意从阿姨传到“我”，又从“我”传给别人。",
            "The narrator helps a stranger as the woman did and understands her: kindness passes from her to the narrator and on.",
          ],
        ),
        question(
          ["结尾“也许她并不需要我还”是什么意思？", "What does the ending, “perhaps she never needed it back”, mean?"],
          ["阿姨要的不是那把伞，而是把善意传给更多的人", "She did not want the umbrella back, only for kindness to go on"],
          [
            ["那把伞不值什么钱", "The umbrella was worth little"],
            ["阿姨已经搬到外地去了", "She had moved away"],
            ["“我”不想把伞还给她", "The narrator did not want to return it"],
          ],
          [
            "“我”把伞借给别人以后，明白了帮助别人时并不图回报。把善意传下去，就是对阿姨最好的“还”。",
            "Having helped someone in turn, the narrator sees that help asks no return; passing it on is the best repayment.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-river-of-my-hometown",
      title: ["故乡的河", "The River of My Hometown"],
      body: `我的故乡在江南的一个小镇上，一条小河从镇子中间穿过。河不宽，水却很清，清得能看见河底圆圆的鹅卵石和水草间游来游去的小鱼。

小时候，这条河就是我们的乐园。清晨，河面上浮着一层薄薄的雾，早起的妇女蹲在石阶上洗衣服，捶打衣服的声音在河面上传得很远。夏天的午后，男孩子们一个接一个从石桥上跳下去，溅起高高的水花；女孩子们坐在岸边，把脚泡在水里，比谁捡的田螺多。傍晚，夕阳把河水染成了金红色，晚归的小船慢慢摇过来，船桨划开的波纹一圈圈荡向两岸。

后来，镇上建起了几家工厂，河水渐渐变了颜色，先是发黄，再是发黑，夏天还散发着难闻的气味。鱼不见了，水草烂了，石阶上再也没有洗衣服的人。大人们说起这条河，总是叹气；孩子们经过河边，都捂着鼻子快步走开。

前几年，镇上下决心治理这条河。污染严重的工厂关停了，生活污水被引进了处理厂，河底的淤泥被清除，岸边种上了柳树和花草。

今年夏天，我回到故乡，站在石桥上往下看，河水又清了。几条小鱼在水草间游着，一个小男孩正蹲在岸边，伸手去捉水里的田螺。那一刻，我仿佛看见了小时候的自己。

一条河的清与浊，连着一个地方人们的生活。愿故乡的河，永远这样清下去。`,
      names: ["江南"],
      xp: 6,
      questions: [
        question(
          ["第二段是按什么顺序写童年的小河的？", "In what order does the second paragraph describe the river of childhood?"],
          ["按一天中的时间顺序：清晨、午后、傍晚", "By the time of day: morning, afternoon, evening"],
          [
            ["按从上游到下游的空间顺序", "By place, from upstream to downstream"],
            ["按春、夏、秋、冬的季节顺序", "By the four seasons"],
            ["按事情的重要程度", "By how important each thing is"],
          ],
          [
            "这一段依次写“清晨”“夏天的午后”“傍晚”河边的情景，是按一天中的时间先后来写的。",
            "It moves from early morning to a summer afternoon to evening: the order of a day.",
          ],
        ),
        question(
          [
            "“清得能看见河底圆圆的鹅卵石”突出了河水的什么特点？",
            "What does “clear enough to see the round pebbles on the bottom” bring out?",
          ],
          ["清澈", "How clear the water is"],
          [
            ["很浅", "How shallow it is"],
            ["石头多", "How many stones it has"],
            ["流得快", "How fast it flows"],
          ],
          [
            "句子前面说“水却很清”，后面用能看见河底的石头和小鱼，具体写出了河水的清澈。",
            "The sentence says the water is clear, then shows it: you can see the pebbles and fish below.",
          ],
        ),
        question(
          [
            "第三段写河水变脏后人们的表现，与第二段有什么关系？",
            "How does the third paragraph, on the polluted river, relate to the second?",
          ],
          ["与第二段的欢乐形成对比，写出污染带来的伤害", "It contrasts with the joy of the second, showing the harm pollution did"],
          [
            ["介绍工厂生产的产品", "It describes what the factories made"],
            ["说明孩子们本来就不喜欢这条河", "It shows the children never liked the river"],
            ["交代“我”离开故乡的原因", "It explains why the narrator left home"],
          ],
          [
            "第二段河边处处是欢声笑语，第三段却是“叹气”“捂着鼻子快步走开”。前后对比，写出污染夺走了人们的乐园。",
            "Laughter by the river becomes sighs and held noses: the contrast shows pollution took away a playground.",
          ],
        ),
        question(
          [
            "结尾“一条河的清与浊，连着一个地方人们的生活”表达了什么？",
            "What does “a river's clearness is tied to the life of a place” express?",
          ],
          [
            "河流的好坏和人们的生活息息相关，表达保护环境的愿望",
            "Rivers and people's lives are bound together; it voices a wish to protect them",
          ],
          [
            ["河水浑浊一点也没关系", "A muddy river does not matter"],
            ["作者只想回到童年", "The writer only wants to return to childhood"],
            ["人们应该搬离河边居住", "People should move away from rivers"],
          ],
          [
            "河清时人们欢乐，河脏时人们叹气，治理后欢乐又回来了。结尾由此说出道理，并希望河“永远这样清下去”。",
            "Joy when clear, sighs when foul, joy again once cleaned: the ending draws the lesson and hopes it stays clear.",
          ],
        ),
      ],
    },
  ],
);

/** gradeEightThings is the exposition unit of grade 8: the wisdom of everyday things. */
const gradeEightThings = unit(
  8,
  "chinese-reading-8-things",
  ["器物的智慧", "The Wisdom of Things"],
  [
    {
      id: "chinese-why-arches-carry-weight",
      title: ["拱桥为什么结实", "Why Arches Carry Weight"],
      body: `在我国，从山间小溪到城里的河道，到处都能看到拱桥。拱桥为什么能承受那么大的重量呢？

我们可以先做一个小实验：拿一张纸平放在两本书之间，纸的中间放一枚硬币，纸马上就塌了下去；如果把纸弯成拱形，两端顶在书上，它就能托住好几枚硬币。同一张纸，形状不同，承重的本领就大不一样。

原因在于力的传递。平直的桥面受到压力时，中间会向下弯，下面被拉长，容易断裂。而拱形的桥身受到压力时，力会顺着拱的弧线向两边传递，最后传到两岸的桥墩和地基上。拱上的每一块石头都被两边的石头紧紧挤住，越压越紧。石头不怕挤压，却怕拉扯，拱的形状恰好发挥了石头的长处。

河北的赵州桥，是石拱桥的杰出代表。它建于隋朝，由工匠李春主持设计，距今已有约一千四百年。桥长五十多米，主拱的跨度达三十七米多。更巧妙的是，在大拱的两肩上，各开了两个小拱。这样做，一是减轻了桥身的重量；二是发大水时，水可以从小拱中流过，减少洪水对桥身的冲击；三是使桥的样子更加轻巧美观。一千多年来，赵州桥经历了多次洪水和地震，至今仍然屹立在河上。

今天，拱的原理仍被广泛使用。许多大坝、隧道的顶部和大型体育馆的屋顶，都做成了拱形或类似拱的形状。`,
      names: ["赵州桥", "李春", "河北", "隋朝"],
      xp: 6,
      questions: [
        question(
          [
            "第二段把平放的纸和弯成拱形的纸放在一起说，主要运用了什么说明方法？",
            "The second paragraph sets a flat sheet beside an arched one. Which method is this?",
          ],
          ["作比较", "Comparison"],
          [
            ["列数字", "Giving figures"],
            ["下定义", "Definition"],
            ["打比方", "Analogy"],
          ],
          [
            "平放的纸一放硬币就塌，拱形的纸能托住好几枚。两相比较，突出了拱形承重的本领。",
            "The flat sheet sags under one coin while the arched one holds several: the comparison shows the arch's strength.",
          ],
        ),
        question(
          [
            "“桥长五十多米，主拱的跨度达三十七米多”运用了什么说明方法？",
            "Which method is “over fifty metres long, with a main span of over thirty-seven”?",
          ],
          ["列数字", "Giving figures"],
          [
            ["作比较", "Comparison"],
            ["举例子", "Giving an example"],
            ["分类别", "Classification"],
          ],
          ["用具体的数字说明赵州桥的长度和跨度，准确地写出了它的雄伟。", "Exact figures for length and span show how large the bridge is."],
        ),
        question(
          ["下面哪一项不是赵州桥在大拱两肩开小拱的好处？", "Which of these is not a benefit of the small arches on the shoulders?"],
          ["让更大的船能从桥下通过", "Letting bigger boats pass beneath"],
          [
            ["减轻桥身的重量", "Making the bridge lighter"],
            ["发大水时让水从小拱中流过", "Letting floodwater through the small arches"],
            ["使桥的样子更加轻巧美观", "Making the bridge look lighter and finer"],
          ],
          [
            "第四段用“一是……二是……三是……”说了三点好处：减轻重量、减少洪水冲击、使桥美观，没有说到通船。",
            "The fourth paragraph lists three benefits, lighter weight, less flood damage and beauty; it says nothing about boats.",
          ],
        ),
        question(
          ["本文是按什么顺序来说明的？", "In what order is the passage arranged?"],
          ["逻辑顺序：先提出问题，再讲原理，然后举例，最后讲应用", "Logical: a question, the principle, an example, then its uses"],
          [
            ["时间顺序：按赵州桥建造的先后", "Time: the stages of building the bridge"],
            ["空间顺序：从桥面到桥墩", "Space: from the deck down to the piers"],
            ["时间顺序：从古代到现代的桥", "Time: bridges from ancient to modern"],
          ],
          [
            "文章先问拱桥为什么结实，用实验引出原理，再讲赵州桥，最后讲拱在今天的用途，是按事理的逻辑顺序说明的。",
            "It asks why, shows by experiment, explains the force, gives the Zhaozhou Bridge and ends with today's uses: a logical order.",
          ],
        ),
      ],
    },
    {
      id: "chinese-how-paper-is-made",
      title: ["纸是怎样造出来的", "How Paper Is Made"],
      body: `纸是我们每天都要用的东西。在纸出现以前，人们把字刻在龟甲和兽骨上，铸在青铜器上，或者写在竹片、木片和丝织品上。竹木又重又占地方，丝织品又太贵，都不便于普遍使用。

西汉时，我国已经有了用麻做成的纸，但比较粗糙，不太适合写字。东汉的蔡伦总结了前人的经验，用树皮、麻头、破布和旧渔网做原料，改进了造纸的方法，造出了又轻又薄、价钱便宜的纸。公元105年，他把这种纸献给皇帝，从此，造纸的方法得到了推广。

传统的手工造纸，大致要经过这样几道工序：第一步，把原料切碎，放在水里浸泡，再加上石灰一起蒸煮，让它变软；第二步，把煮好的原料捣烂，变成细细的纤维，放进水槽，搅成稀稀的纸浆；第三步，把一个竹帘伸进纸浆里，轻轻一抄，帘子上就留下一层薄薄的纤维；第四步，把这层湿纸揭下来，一张张叠好，压去水分，再贴在墙上晒干或烘干。揭下来，就是一张纸了。

纸的秘密就藏在纤维里。植物纤维细长而柔软，在水里散开以后，又能彼此交错缠绕在一起，干了以后，就结成了一张有一定强度的薄片。

后来，造纸术传到朝鲜、日本，又经阿拉伯传到欧洲，大大方便了知识的记录和传播。今天的造纸厂虽然用上了大型机器，但基本原理和一千九百多年前并没有根本的不同。`,
      names: ["蔡伦", "西汉", "东汉", "朝鲜", "日本", "阿拉伯", "欧洲", "105"],
      xp: 6,
      questions: [
        question(
          ["第三段介绍手工造纸，用的是什么说明顺序？", "In what order does the third paragraph explain making paper by hand?"],
          ["时间顺序（按工序的先后）", "Time order, step by step"],
          [
            ["空间顺序", "Order in space"],
            ["从结果到原因的逻辑顺序", "Logical order, from effect to cause"],
            ["从主要到次要的顺序", "From major to minor"],
          ],
          [
            "这一段用“第一步”到“第四步”，按造纸工序的先后来说明，是时间顺序。",
            "From the first step to the fourth, it follows the stages in time.",
          ],
        ),
        question(
          [
            "第一段说竹木“又重又占地方”、丝织品“又太贵”，有什么作用？",
            "Why does the first paragraph say bamboo was heavy and silk too dear?",
          ],
          ["说明纸出现前书写材料的不便，衬托出纸的好处", "To show how awkward earlier materials were, setting off paper's merits"],
          [
            ["介绍竹子和木头的各种用途", "To list the uses of bamboo and wood"],
            ["说明丝织品的质量很好", "To show silk was of high quality"],
            ["证明古人不爱写字", "To prove people of old disliked writing"],
          ],
          [
            "先写旧材料的不足，后面再写蔡伦造出“又轻又薄、价钱便宜”的纸，前后对照，纸的好处就很清楚了。",
            "The faults of the old materials come first, so the light, thin, cheap paper that follows stands out.",
          ],
        ),
        question(
          [
            "第四段“纸的秘密就藏在纤维里”，说明的是什么？",
            "What does the fourth paragraph, “the secret of paper lies in its fibres”, explain?",
          ],
          ["纸能结成薄片的原理", "Why the pulp holds together as a sheet"],
          [
            ["纸为什么是白色的", "Why paper is white"],
            ["造纸要用哪些原料", "What paper is made from"],
            ["造纸术传到了哪些地方", "Where papermaking spread to"],
          ],
          [
            "这一段说，纤维在水里散开后又能“交错缠绕在一起”，干了就“结成了一张有一定强度的薄片”，讲的是纸成形的原理。",
            "It says the fibres spread in water then tangle and dry into a sheet with some strength: the principle of paper.",
          ],
        ),
        question(
          [
            "最后一句“基本原理和一千九百多年前并没有根本的不同”中，“基本”一词能否删去？为什么？",
            "Could 基本 (“basic”) be removed from the last sentence? Why?",
          ],
          [
            "不能。“基本”表示大体上，删去就成了完全一样，不符合事实",
            "No: it means “in the main”; without it the claim would be that nothing changed, which is false",
          ],
          [
            ["能。删去以后句子更简洁", "Yes: the sentence is shorter without it"],
            ["能。删去以后意思不变", "Yes: the meaning is the same"],
            ["不能。删去以后句子读起来不通顺", "No: the sentence would not read smoothly"],
          ],
          [
            "今天造纸用的是大型机器，细节已有很多变化，只是大体的原理相同。“基本”限定了范围，体现了说明文语言的准确。",
            "Machines have changed much of the detail; only the main principle is the same. The word keeps the statement exact.",
          ],
        ),
      ],
    },
    {
      id: "chinese-how-a-vacuum-flask-keeps-heat",
      title: ["保温瓶为什么能保温", "How a Vacuum Flask Keeps Heat"],
      body: `冬天，把开水倒进保温瓶，过了一夜，倒出来的水还是热的。保温瓶为什么能保温呢？要回答这个问题，先得知道热是怎样跑掉的。

热的传递有三种方式。第一种叫传导，热顺着物体从温度高的地方传到温度低的地方，比如用铁勺搅热汤，勺柄很快就烫手了。第二种叫对流，液体或气体受热后流动起来，把热带走，比如暖气片能让整个房间变暖，主要就是靠空气的流动。第三种叫辐射，热直接向四周散发出去，不需要别的物体帮忙，太阳的热穿过太空来到地球，就是靠辐射。

保温瓶的设计，正是针对这三种方式的。它的瓶胆是用玻璃做的，有内外两层。玻璃本身就不容易传热；两层玻璃之间的空气被抽走了，接近真空。没有空气，热就很难通过传导和对流从里层跑到外层。两层玻璃上还镀了一层银，像镜子一样，能把向外辐射的热反射回去。瓶口是热量最容易跑掉的地方，所以要用软木或塑料做的瓶塞塞紧，挡住热空气向外流动。

这样，三条“出路”都被堵住了，热水的温度降得很慢。当然，热量不可能完全不散失，所以保温瓶里的水放得久了，还是会慢慢变凉。

有意思的是，保温瓶不但能保热，也能保冷。夏天把冰水倒进去，外面的热很难进来，冰水能凉很久。

这个结构很简单，却十分巧妙。今天常见的不锈钢保温杯，也用了同样的原理。`,
      glossed: ["瓶胆", "传导", "对流", "辐射", "真空"],
      xp: 6,
      questions: [
        question(
          [
            "第二段介绍热传递的三种方式，主要运用了什么说明方法？",
            "Which method does the second paragraph mainly use for the three ways heat moves?",
          ],
          ["分类别", "Classification"],
          [
            ["列数字", "Giving figures"],
            ["打比方", "Analogy"],
            ["作比较", "Comparison"],
          ],
          [
            "这一段把热的传递分为传导、对流、辐射三类，逐一说明，是分类别。",
            "It sorts heat transfer into conduction, convection and radiation and explains each: classification.",
          ],
        ),
        question(
          [
            "“两层玻璃上还镀了一层银，像镜子一样，能把向外辐射的热反射回去”中，“像镜子一样”运用了什么说明方法？",
            "Which method is “like a mirror” in the sentence on the silver coating?",
          ],
          ["打比方", "Analogy"],
          [
            ["作比较", "Comparison"],
            ["下定义", "Definition"],
            ["举例子", "Giving an example"],
          ],
          [
            "用人们熟悉的镜子来比镀银的玻璃，形象地说明它能把热“反射回去”，是打比方。",
            "Likening the silvered glass to a familiar mirror shows vividly how it sends heat back: an analogy.",
          ],
        ),
        question(
          ["把两层玻璃之间抽成真空，主要是为了什么？", "Why is the air pumped out between the two layers of glass?"],
          ["阻止热通过传导和对流散失", "To stop heat escaping by conduction and convection"],
          [
            ["把辐射的热反射回去", "To reflect radiated heat back"],
            ["让瓶子变得更轻", "To make the flask lighter"],
            ["防止玻璃破碎", "To keep the glass from breaking"],
          ],
          [
            "第三段说：“没有空气，热就很难通过传导和对流从里层跑到外层。”反射辐射靠的是镀银。",
            "The third paragraph says that without air, heat can hardly pass by conduction or convection; the silver deals with radiation.",
          ],
        ),
        question(
          ["本文是按什么顺序来说明的？", "In what order is the passage arranged?"],
          ["逻辑顺序：先讲热怎样散失，再讲保温瓶怎样一一堵住", "Logical: first how heat escapes, then how the flask blocks each way"],
          [
            ["时间顺序：按保温瓶的制造过程", "Time: the steps of making a flask"],
            ["空间顺序：从瓶外到瓶内", "Space: from outside the flask to inside"],
            ["时间顺序：按保温瓶发明的先后", "Time: the history of its invention"],
          ],
          [
            "文章先提出问题，接着讲热传递的三种方式，再说明瓶胆、镀银、瓶塞如何分别对付它们，是按事理的逻辑顺序。",
            "A question, the three ways heat moves, then how the liner, silver and stopper meet each: a logical order.",
          ],
        ),
      ],
    },
  ],
);

/** gradeEightReasoning is the argument unit of grade 8: the force of reasoning. */
const gradeEightReasoning = unit(
  8,
  "chinese-reading-8-reasoning",
  ["说理的力量", "The Force of Reasoning"],
  [
    {
      id: "chinese-haste-makes-waste",
      title: ["欲速则不达", "More Haste, Less Speed"],
      body: `《论语》中有一句话：“欲速则不达。”意思是，一味求快，反而达不到目的。这话说了两千多年，至今仍有道理。

古时候，宋国有个农夫，嫌田里的禾苗长得太慢，就一棵棵地把禾苗往上拔，回家还得意地说：“今天累坏了，我帮禾苗长高了！”他的儿子跑到田里一看，禾苗全都枯死了。这个故事出自《孟子》，后来变成了成语“拔苗助长”。禾苗的生长有它自己的规律，硬要它快，结果只能是毁了它。

学习也是如此。有的同学为了快点做完作业，题目没看清就动笔，结果错了一大片，订正花的时间比认真做一遍还多；有的同学背书只求快，囫囵吞枣地读一遍，过几天就忘得一干二净。相反，那些做题时一步一步想清楚、读书时边读边思考的同学，看起来慢，学到的东西却更扎实，最后反而走在了前面。

真正的好作品，更需要慢慢打磨。清代作家曹雪芹写《红楼梦》，在书中自述“披阅十载，增删五次”。十年的时间，五次的修改，才成就了这部伟大的小说。如果他只求写得快，恐怕就不会有这样的经典了。

当然，说“慢”，并不是说做事可以拖拖拉拉。有的事情需要抓紧时间，机会错过了就不会再来。这里说的“慢”，是不急躁、不贪快，按规律办事，把每一步都走踏实。

种子发芽要时间，大树长成要时间，人的成长也是这样。少一些急躁，多一些耐心，路才能走得更远。`,
      names: ["论语", "孟子", "宋国", "曹雪芹", "红楼梦"],
      xp: 6,
      questions: [
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["一味求快，反而达不到目的", "Rushing defeats its own purpose"],
          [
            ["做事可以拖拖拉拉", "It is fine to dawdle"],
            ["好作品都要写十年", "Every good work takes ten years"],
            ["学习就要多做题", "Learning means doing many exercises"],
          ],
          [
            "开头引用“欲速则不达”，并解释为“一味求快，反而达不到目的”，全文都围绕这一点展开。",
            "The opening quotes the saying and explains it: rushing defeats its purpose. The whole passage argues this.",
          ],
        ),
        question(
          ["第三段主要运用了什么论证方法？", "Which method of argument does the third paragraph mainly use?"],
          ["对比论证", "Argument by contrast"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["道理论证", "Argument from principle"],
            ["引用名言来论证", "Argument by quotation"],
          ],
          [
            "这一段先写只求快的同学错得多、忘得快，再用“相反”写踏实的同学学得扎实，正反对比，证明了论点。",
            "Hasty students err and forget; “on the other hand” careful ones learn soundly: the two are set against each other.",
          ],
        ),
        question(
          ["第四段写曹雪芹“披阅十载，增删五次”，属于什么论据？", "What kind of evidence is Cao Xueqin's ten years and five revisions?"],
          ["事实论据", "Factual evidence"],
          [
            ["道理论据", "Evidence from principle"],
            ["作者的假设", "A supposition of the writer"],
            ["比喻", "A metaphor"],
          ],
          [
            "这是曹雪芹写《红楼梦》的真实经历，用事实证明好作品需要慢慢打磨，是事实论据。",
            "It is what Cao Xueqin really did in writing the novel: a fact proving good work takes time.",
          ],
        ),
        question(
          ["第五段“当然……”在文中起什么作用？", "What does the fifth paragraph, beginning “Of course…”, do?"],
          ["补充说明“慢”不等于拖拉，使论证更严密", "It adds that slowness is not dawdling, making the argument tighter"],
          [
            ["提出一个新的论点", "It puts forward a new thesis"],
            ["举出一个反面的例子", "It gives a counter-example"],
            ["否定前面的观点", "It rejects what came before"],
          ],
          [
            "这一段说明“慢”是“不急躁、不贪快，按规律办事”，而不是拖拖拉拉，防止读者误解，使论证更周密。",
            "It defines the slowness meant as patience and method, not delay, so readers do not misread the thesis.",
          ],
        ),
      ],
    },
    {
      id: "chinese-many-hands",
      title: ["众人拾柴火焰高", "Many Hands Make a Big Fire"],
      body: `一根筷子，轻轻一折就断了；一把筷子捆在一起，用再大的力气也很难折断。这个简单的道理告诉我们：个人的力量是有限的，团结合作才能产生更大的力量。

在科学研究中，合作的力量尤其明显。二十世纪六七十年代，我国组织了许多科研人员，寻找治疗疟疾的新药。屠呦呦和她的同事们查阅了大量古代医书，从两千多个方药中筛选，经历了一次又一次失败，终于从植物青蒿中提取出了青蒿素。2015年，她获得诺贝尔生理学或医学奖。她说，这份荣誉属于中国科学家集体。一项改变世界的成果，背后是许多人共同的付出。

体育比赛也是一样。一支足球队里，即使有一两位技术出众的球员，如果大家各踢各的，也很难赢球；而一支队员之间配合默契、相互信任的队伍，往往能打败个人能力更强的对手。

古人说：“众人拾柴火焰高。”一个人的知识和精力总是有限的，而许多人把各自的长处结合起来，就能互相补充，完成一个人做不到的事。

不过，合作并不意味着每个人都可以依赖别人。一个团队里，如果有人想“搭便车”，自己不出力，只等着分享成果，合作就会变成一盘散沙。真正的合作，是每个人都尽心做好自己的那一份，同时愿意帮助别人，听取别人的意见。

在班级里，在家庭中，在将来的工作里，我们都会成为某个团队的一员。学会与人合作，是我们成长中的重要一课。`,
      names: ["屠呦呦", "诺贝尔", "2015"],
      glossed: ["疟疾", "青蒿", "青蒿素"],
      xp: 6,
      questions: [
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["团结合作才能产生更大的力量", "Working together creates greater strength"],
          [
            ["个人的力量是无限的", "One person's strength is limitless"],
            ["合作就是依赖别人", "Cooperating means relying on others"],
            ["科学研究最需要合作", "Science needs cooperation most of all"],
          ],
          [
            "第一段用筷子作比，引出“个人的力量是有限的，团结合作才能产生更大的力量”，这是全文的论点。",
            "The chopsticks lead to the thesis in the first paragraph: one person is limited; together we are stronger.",
          ],
        ),
        question(
          ["第二段屠呦呦的事例属于什么论据？它证明了什么？", "What kind of evidence is the story of Tu Youyou, and what does it prove?"],
          ["事实论据，证明重大的科学成果离不开团队合作", "Factual evidence that great science needs teamwork"],
          [
            ["道理论据，证明古代医书很有用", "Evidence from principle that old medical books are useful"],
            ["事实论据，证明个人能力最重要", "Factual evidence that individual ability matters most"],
            ["道理论据，证明青蒿能治病", "Evidence from principle that the herb cures illness"],
          ],
          [
            "这是真实的科学研究经历，属于事实论据。屠呦呦说荣誉属于“中国科学家集体”，证明成果是许多人共同付出的结果。",
            "It is a real story, so factual evidence; her words that the honour belongs to all the scientists show it was teamwork.",
          ],
        ),
        question(
          [
            "第三段把“各踢各的”队伍和“配合默契”的队伍放在一起说，运用了什么论证方法？",
            "The third paragraph sets a team of individuals beside a team that plays together. Which method is this?",
          ],
          ["对比论证", "Argument by contrast"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["道理论证", "Argument from principle"],
            ["引用名言来论证", "Argument by quotation"],
          ],
          [
            "一种队伍“很难赢球”，一种“往往能打败个人能力更强的对手”，正反对比，突出了合作的作用。",
            "One kind seldom wins, the other beats stronger players: the contrast shows what cooperation does.",
          ],
        ),
        question(
          ["第五段谈“搭便车”，在文中起什么作用？", "What does the fifth paragraph, on free riders, do?"],
          ["指出合作不等于依赖别人，使论证更全面", "It shows cooperation is not leaning on others, making the case fuller"],
          [
            ["说明合作没有什么好处", "It shows cooperation is of little use"],
            ["介绍乘坐公交车的规矩", "It explains rules for riding buses"],
            ["批评足球队的队员", "It criticizes the football players"],
          ],
          [
            "这一段说“合作并不意味着每个人都可以依赖别人”，并说明真正的合作是什么样的，防止对论点的误解。",
            "It says cooperation does not mean relying on others and describes true teamwork, guarding the thesis against misreading.",
          ],
        ),
      ],
    },
    {
      id: "chinese-what-failure-teaches",
      title: ["失败的价值", "What Failure Teaches"],
      body: `没有人喜欢失败。考试没考好，比赛输了，计划落空了，心里总不是滋味。可是，失败并不只是坏事。只要善于从中总结教训，失败就能成为通向成功的台阶。

每一次失败，都在告诉我们哪条路走不通。十九世纪，许多发明家都想造出耐用的电灯，难题在于找到合适的灯丝。爱迪生和他的助手们试验了上千种材料，大多数都失败了：有的一通电就烧断，有的只能亮很短的时间。可是，每排除一种不合适的材料，他们就离答案更近一步。后来，他们用烧成炭的竹丝做灯丝，让电灯亮了很长时间，电灯这才真正走进了千家万户。

失败还能让人看清自己的不足。一次考试没考好，如果只是难过，或者把原因推给题目太难，下次很可能还会出同样的错；如果认真分析错题，找出是哪部分知识没掌握，是粗心还是方法不对，就能有针对性地改进。同样是失败，有的人从中学到了东西，有的人却什么也没得到，差别就在于是否肯面对它、研究它。

俗话说：“吃一堑，长一智。”堑就是深沟，这句话是说，掉进一次沟里，就多长一分见识。失败本身不会让人变聪明，从失败中总结出的经验才会。

当然，我们说失败有价值，并不是说失败越多越好，更不是说可以随随便便地对待一件事。认真准备、尽力去做，仍然是最重要的。只是在尽力之后，如果还是失败了，不必因此灰心丧气。

人的一生不可能一帆风顺。与其害怕失败，不如学会面对失败。跌倒了，看看是什么绊倒了自己，再站起来往前走。`,
      names: ["爱迪生"],
      glossed: ["灯丝", "堑"],
      xp: 6,
      questions: [
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["只要善于总结教训，失败就能成为通向成功的台阶", "If we learn from it, failure becomes a step towards success"],
          [
            ["没有人喜欢失败", "Nobody likes failing"],
            ["失败越多越好", "The more failures the better"],
            ["考试失败是因为题目太难", "Exams are failed because they are too hard"],
          ],
          [
            "第一段最后一句提出论点：“只要善于从中总结教训，失败就能成为通向成功的台阶。”",
            "The last sentence of the first paragraph states it: learn from failure and it becomes a step to success.",
          ],
        ),
        question(
          ["爱迪生寻找灯丝的事例，证明的是哪个分论点？", "Which supporting point does Edison's search for a filament prove?"],
          ["每一次失败，都在告诉我们哪条路走不通", "Each failure shows us a road that does not lead anywhere"],
          [
            ["失败能让人看清自己的不足", "Failure shows us our weaknesses"],
            ["认真准备仍然是最重要的", "Careful preparation still matters most"],
            ["人的一生不可能一帆风顺", "No life is plain sailing"],
          ],
          [
            "第二段第一句是这一段的分论点，爱迪生“每排除一种不合适的材料，就离答案更近一步”正是对它的证明。",
            "The paragraph opens with this point; each rejected material bringing Edison nearer the answer proves it.",
          ],
        ),
        question(
          [
            "“同样是失败，有的人从中学到了东西，有的人却什么也没得到”运用了什么论证方法？",
            "Which method is “the same failure teaches some people and leaves others with nothing”?",
          ],
          ["对比论证", "Argument by contrast"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["举例论证", "Argument by example"],
            ["道理论证", "Argument from principle"],
          ],
          [
            "把两种对待失败的人放在一起比较，说明差别在于是否肯面对、研究失败，是对比论证。",
            "It sets two kinds of people side by side to show the difference lies in facing failure: a contrast.",
          ],
        ),
        question(
          [
            "第四段引用俗语“吃一堑，长一智”，属于什么论据？",
            "What kind of evidence is the saying “a fall into the pit, a gain in your wit”?",
          ],
          ["道理论据", "Evidence from principle"],
          [
            ["事实论据", "Factual evidence"],
            ["作者的亲身经历", "The writer's own experience"],
            ["反面的例子", "A counter-example"],
          ],
          [
            "俗语是人们公认的道理，用来证明从失败中能增长智慧，是道理论据。",
            "A common saying states an accepted truth, that failure can make us wiser: evidence from principle.",
          ],
        ),
      ],
    },
  ],
);

/** gradeNineChoices is the narrative unit of grade 9: choices in growing up. */
const gradeNineChoices = unit(
  9,
  "chinese-reading-9-choices",
  ["成长的选择", "Choices in Growing Up"],
  [
    {
      id: "chinese-the-final-pass",
      title: ["最后一个球", "The Final Pass"],
      body: `初三上学期，学校举行篮球联赛，我们班一路打进了决赛。那是我在初中的最后一场比赛，我盼着能在决赛里痛痛快快地投进几个球，给三年的球场时光画上一个漂亮的句号。

比赛打得难解难分。最后一分钟，我们落后一分。暂停时，队长小林把大家拉到一起，压低声音说：“最后一球，给阿杰。”大家都看向我。我是队里得分最多的人，那一刻，我心里一阵发热，觉得这正是我等了三年的时刻。

比赛重新开始。我接到球，运球往前冲，对方两个人立刻围了上来，把我逼到了边线附近。我抬起头，看见篮下的阿明身边一个人也没有，正举着手。阿明是替补，整场比赛只上了几分钟，一个球也没投进。

传，还是不传？我的脑子里飞快地闪过许多念头：如果我自己投，进了，我就是英雄；不进，大家也不会怪我。可是被两个人围着，投中的机会实在不大。而阿明那边，几乎是空篮。

时间只剩五秒了。我咬咬牙，把球传了出去。阿明接球，起跳，球在篮筐上转了一圈，掉了进去。

哨声响起，我们赢了。同学们冲上场，把阿明高高地抛起来。我站在人群外面，心里有一点点失落，可更多的是一种说不出的踏实。

赛后，小林拍拍我的肩膀：“最后那个球，传得好。”我笑了笑。我知道，自己投进那个球，会是我一个人的骄傲；把球传出去，却是我们一个班的胜利。

那天以后，我常常想，所谓长大，也许就是在最想证明自己的时候，还能看清什么才是更重要的。`,
      names: ["小林", "阿杰", "阿明"],
      xp: 6,
      questions: [
        question(
          [
            "第四段“传，还是不传？……”主要运用了什么描写方法？",
            "Which kind of description does the fourth paragraph, “pass or not?”, mainly use?",
          ],
          ["心理描写", "Description of thoughts"],
          [
            ["外貌描写", "Description of appearance"],
            ["环境描写", "Description of surroundings"],
            ["语言描写", "Description of speech"],
          ],
          [
            "这一段写“我”脑子里闪过的念头：自己投会怎样，传给阿明又会怎样，是心理描写，写出了“我”的矛盾。",
            "It gives the narrator's racing thoughts about shooting or passing: a description of inner conflict.",
          ],
        ),
        question(
          [
            "第三段交代阿明“整场比赛只上了几分钟，一个球也没投进”，有什么作用？",
            "Why does the third paragraph say Ah Ming had played only minutes and scored nothing?",
          ],
          ["说明阿明并不被看好，突出“我”传球这一选择的难得", "It shows nobody expected much of him, so the pass is a harder choice"],
          [
            ["批评阿明的球技太差", "To criticize his skill"],
            ["说明阿明不想上场比赛", "To show he did not want to play"],
            ["交代比赛落后的原因", "To explain why the team was behind"],
          ],
          [
            "把球传给一个整场没进球的替补，比自己投更需要勇气和判断。这个交代让“我”的选择显得更加难得。",
            "Passing to a scoreless substitute takes more nerve and judgement than shooting; the detail makes the choice harder.",
          ],
        ),
        question(
          [
            "赛后“我”“心里有一点点失落，可更多的是一种说不出的踏实”。下面理解正确的是哪一项？",
            "After the game the narrator feels a little let down but mostly at peace. Which reading is right?",
          ],
          [
            "失落是因为没能自己当英雄，踏实是因为做了对集体最有利的选择",
            "Let down at not being the hero; at peace for making the best choice for the team",
          ],
          [
            ["失落是因为比赛输了，踏实是因为终于不用再比赛了", "Let down at losing; at peace that it was over"],
            ["失落是因为阿明没有感谢“我”，踏实是因为小林表扬了“我”", "Let down that Ah Ming did not thank him; at peace at Lin's praise"],
            ["失落是因为球没投进，踏实是因为大家没有怪“我”", "Let down at a miss; at peace because nobody blamed him"],
          ],
          [
            "比赛赢了，被抛起来的是阿明，“我”没能成为英雄，所以失落；但“我”知道传球是正确的选择，换来了全班的胜利，所以踏实。",
            "The team won but Ah Ming was the hero, hence the letdown; the narrator knows the pass was right, hence the peace.",
          ],
        ),
        question(
          ["最后一段在文中起什么作用？", "What does the last paragraph do?"],
          ["由事入理，点明主旨：成长就是懂得看清什么更重要", "It draws the meaning from the story: growing up is seeing what matters more"],
          [
            ["交代比赛的最后结果", "It reports the final score"],
            ["描写赛后热闹的场面", "It describes the celebrations"],
            ["引出下一场比赛", "It leads into the next game"],
          ],
          [
            "最后一段从这场比赛说到“所谓长大”，把一次传球上升为对成长的思考，点明了文章的中心。",
            "It moves from one pass to what growing up means, stating the theme of the passage.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-last-ferryman",
      title: ["最后的摆渡人", "The Last Ferryman"],
      body: `我们村和镇上隔着一条大河。河上没有桥，来往全靠一条木船。撑船的是老周，他在这条河上摆渡了四十年。

老周的船不大，一次能坐十来个人。天刚亮，他就把船撑到岸边，等着赶早集的人；天黑了，只要对岸有人喊一声“过河啦”，他就披上衣服，提着马灯出门。村里人上学、看病、卖菜、娶亲，都要坐他的船。四十年来，他记不清自己送过多少人，可村里大多数人的名字，他都叫得出来。

那年秋天，河上开始修大桥。消息传来，村里人都高兴坏了，也有人替老周发愁：“桥修好了，谁还坐船？老周往后靠什么过日子？”老周听了，只是笑：“有了桥，下雨刮风的时候，孩子们上学就不用担惊受怕了，这是好事。”

修桥的那两年，老周照样每天撑船，还常常把工地上的工人送过河去。有时工人们要给他船钱，他摆摆手：“你们是给咱村修桥的，坐船不要钱。”

大桥通车那天，全村人都去了桥上，锣鼓敲得震天响。我在人群里找老周，却怎么也找不着。后来才发现，他一个人坐在河边的船上，静静地望着那座桥，手里拿着那根磨得发亮的竹竿。

我走过去，挨着他坐下。他没有回头，过了好一会儿，才轻轻地说：“四十年了，总算能歇歇了。”说完，他低下头，用手一遍遍地摸着船帮，像是在摸一位老朋友的手。

后来，老周的船被村里收进了新建的村史馆。船头上挂着一块小小的木牌，上面写着：老周的渡船，四十年。

时代往前走了，有些东西注定要留在身后。可是，那些曾经把人们从此岸送到彼岸的人，值得被记住。`,
      names: ["老周"],
      glossed: ["摆渡"],
      xp: 6,
      questions: [
        question(
          ["老周听说要修桥后说“这是好事”，表现了他怎样的品质？", "What does Old Zhou's “that's a good thing” about the bridge show?"],
          ["心胸宽厚，把乡亲的方便看得比自己的生计更重", "Generosity: he puts the village's good before his own living"],
          [
            ["他早就不想再撑船了", "He had long wanted to stop"],
            ["他不相信大桥能修好", "He did not believe the bridge would be built"],
            ["他担心以后没有钱花", "He was worried about money"],
          ],
          [
            "别人替他发愁生计，他想到的却是孩子们上学“不用担惊受怕了”，可见他处处为乡亲着想。",
            "Others worry about his living; he thinks of the children's safety on the way to school.",
          ],
        ),
        question(
          [
            "第五段写老周一个人坐在船上，与桥上的热闹形成了什么效果？",
            "What effect does Old Zhou alone in his boat have against the noise on the bridge?",
          ],
          ["形成对比，写出老周心中对渡船的不舍", "A contrast that shows how he hates to part with the ferry"],
          [
            ["说明老周不喜欢热闹", "It shows he dislikes crowds"],
            ["说明老周身体不好", "It shows he is unwell"],
            ["交代大桥通车的时间", "It tells when the bridge opened"],
          ],
          [
            "桥上锣鼓震天，河边的老周却“静静地望着那座桥”，手里拿着竹竿。一闹一静的对比，写出了他复杂的心情。",
            "Drums on the bridge, silence by the river with his pole in hand: the contrast shows his mixed feelings.",
          ],
        ),
        question(
          [
            "“像是在摸一位老朋友的手”运用了什么修辞手法？有什么作用？",
            "Which figure is “as if stroking an old friend's hand”, and what does it do?",
          ],
          ["比喻，写出老周对渡船的深厚感情", "A simile showing his deep attachment to the boat"],
          [
            ["拟人，写出船已经很旧了", "Personification showing the boat is old"],
            ["夸张，写出船很大", "Exaggeration showing the boat is big"],
            ["比喻，写出老周的手很粗糙", "A simile showing his hands are rough"],
          ],
          [
            "把渡船比作“老朋友”，摸船帮比作摸老朋友的手，写出四十年来他和船之间深厚的感情。",
            "The boat becomes an old friend: the simile shows forty years of attachment.",
          ],
        ),
        question(
          ["最后一段表达了作者什么样的思考？", "What thought does the last paragraph express?"],
          ["时代在进步，但那些默默奉献的人值得被记住", "Times move on, but those who quietly served deserve to be remembered"],
          [
            ["应该把桥拆了，恢复渡船", "The bridge should go and the ferry return"],
            ["老周不应该退休", "Old Zhou should not have retired"],
            ["修建村史馆是最重要的事", "Building the village museum matters most"],
          ],
          [
            "作者承认“时代往前走了”，渡船终会被大桥代替；但像老周这样“把人们从此岸送到彼岸的人”，值得被记住。",
            "The writer accepts that the bridge replaces the ferry, but says people like Old Zhou deserve remembering.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-light-across-the-street",
      title: ["窗外的灯", "The Light Across the Street"],
      body: `初三那年冬天，我每天都学到很晚。书桌对着窗户，窗外是一条小街，街对面是一排旧楼。

一天夜里，我做完一张试卷，抬头一看，已经十一点多了。对面的楼几乎都黑了，只有三楼的一扇窗户还亮着。暖黄的灯光透过窗帘，在黑夜里格外显眼。

从那以后，我每天晚上都会看一眼那扇窗。不管多晚，它总是亮着。我常常猜：那里住着一个和我一样准备考试的学生吗？还是一个在赶工作的大人？每当我做题做得心烦，想早点睡觉的时候，看到那盏灯还亮着，就觉得自己并不是一个人在熬夜，便又低下头去。那盏灯，成了我冬夜里一个看不见面孔的伙伴。

一天放学，我终于忍不住，走进了那栋楼。三楼的门开着，一位老奶奶正坐在门口择菜。我红着脸问她，家里是谁每天学到那么晚。老奶奶愣了一下，笑了：“没人学习呀。我儿子在外地开货车，常常半夜才到家。他小时候怕黑，我就一直给他留着灯，留了几十年，习惯了。”

我站在楼道里，半天说不出话。原来，那盏陪了我一个冬天的灯，是一位母亲为远方的儿子留的。它从来不是为我而亮，却实实在在地照亮了我。

回到家，我又坐到书桌前。窗外，那盏灯照旧亮着。我忽然想到，在这座城市里，也许还有许多这样的灯：有的为等待的人而亮，有的为奋斗的人而亮。而我们每一个人，也可能在不知不觉中，成为别人窗外的那盏灯。

那年夏天，我考上了理想的高中。搬家那天，我在窗前站了很久，在心里对那盏灯说了一声：谢谢。`,
      xp: 6,
      questions: [
        question(
          ["“我”一开始以为那盏灯是谁点的？", "Who did the narrator first think kept the light on?"],
          ["一个和“我”一样熬夜学习或工作的人", "Someone up late studying or working, like the narrator"],
          [
            ["一位为儿子留灯的母亲", "A mother waiting up for her son"],
            ["负责楼道照明的管理员", "The man in charge of the stair lights"],
            ["一家通宵营业的商店", "A shop open all night"],
          ],
          [
            "第三段说“我”常常猜：那里住着“一个和我一样准备考试的学生”，还是“一个在赶工作的大人”。为儿子留灯是后来才知道的。",
            "The third paragraph has the narrator guess at a student or a worker; the mother is discovered later.",
          ],
        ),
        question(
          ["本文在情节安排上有什么特点？", "What is notable about how the story is arranged?"],
          ["设置悬念，后面揭开谜底，出人意料又在情理之中", "It sets up a mystery and solves it later, surprising yet believable"],
          [
            ["用倒叙开头，先写结局", "It opens with the ending in flashback"],
            ["全文只有环境描写", "It is all description of surroundings"],
            ["采用书信的形式来写", "It is written as a letter"],
          ],
          [
            "前面写“我”对那盏灯的猜想，读者也想知道答案；直到第四段才揭开：灯是母亲为儿子留的。这样写引人入胜。",
            "The narrator's guesses keep the reader wondering until the fourth paragraph reveals the mother's light.",
          ],
        ),
        question(
          [
            "“它从来不是为我而亮，却实实在在地照亮了我”中，后一个“照亮”是什么意思？",
            "In “it never shone for me, yet truly lit me”, what does the second “lit” mean?",
          ],
          ["给了“我”坚持下去的力量和温暖", "It gave the narrator warmth and strength to keep going"],
          [
            ["让“我”的房间变得更亮", "It made the narrator's room brighter"],
            ["帮“我”看清了试卷上的字", "It helped the narrator read the test paper"],
            ["提醒“我”应该早点睡觉", "It reminded the narrator to go to bed"],
          ],
          [
            "第三段说，每当“我”想放弃时，看到灯还亮着，就“又低下头去”。“照亮”指的是精神上的陪伴和鼓励。",
            "Seeing the light kept the narrator working when tempted to stop: the light gave company and courage.",
          ],
        ),
        question(
          [
            "“我们每一个人，也可能在不知不觉中，成为别人窗外的那盏灯”是什么意思？",
            "What does “each of us may become, unknowing, the light outside someone's window” mean?",
          ],
          ["每个人的坚持和付出，都可能在不经意间温暖、鼓励别人", "Our own efforts may quietly warm and encourage others"],
          [
            ["每个人晚上都应该开着灯", "Everyone should leave a light on at night"],
            ["城市里的灯太多，造成了浪费", "Cities waste too much light"],
            ["我们应该多去打听邻居家的事", "We should find out more about our neighbours"],
          ],
          [
            "老奶奶留灯只是为了儿子，却鼓励了“我”。作者由此想到，每个人平凡的坚持，也可能在不知不觉中给别人力量。",
            "The mother's light, meant for her son, helped the narrator; so too our ordinary efforts may help others unawares.",
          ],
        ),
      ],
    },
  ],
);

/** gradeNineScience is the exposition unit of grade 9: through the eyes of science. */
const gradeNineScience = unit(
  9,
  "chinese-reading-9-science",
  ["科学的眼睛", "Through the Eyes of Science"],
  [
    {
      id: "chinese-lightning-and-thunder",
      title: ["闪电和雷声", "Lightning and Thunder"],
      body: `夏天的雷雨来临时，天空先是划过一道刺眼的闪电，过了一会儿，才传来轰隆隆的雷声。闪电和雷声是怎样产生的？为什么总是先看见闪电，后听到雷声？

雷电一般产生在积雨云中。积雨云又高又厚，云里的上升气流很强，把水滴、冰晶和小冰球带上带下，它们不停地相互碰撞、摩擦，就带上了电。一般来说，较轻的、带正电的冰晶被气流带到云的上部，较重的、带负电的颗粒聚集在云的下部。当云里积聚的电荷越来越多，正负电荷之间的电压大到空气承受不住时，就会突然放电，产生强烈的闪光，这就是闪电。闪电可以发生在云的内部，也可以发生在云与云之间，或者云与地面之间。

闪电通过的地方，空气在极短的时间里被加热到几万摄氏度，比太阳表面的温度还要高好几倍。受热的空气急剧膨胀，向四周猛烈冲击，就发出了巨大的响声，这就是雷声。

闪电和雷声其实是同时产生的。但是，光的传播速度约为每秒三十万千米，声音在空气中的传播速度约为每秒三百四十米，光比声音快得多，所以我们总是先看见闪电，后听到雷声。利用这一点，还可以估算雷电离我们有多远：从看见闪电到听到雷声，数一数隔了几秒，再乘以三百四十米，大约就是雷电离我们的距离。

雷电威力巨大，可能击伤人畜、引发火灾。雷雨天，不要在大树下或空旷的高处避雨，在户外时应远离高大的金属物体。十八世纪，美国的富兰克林发明了避雷针，把闪电的电流引到地下，保护了许多高大的建筑。`,
      names: ["富兰克林", "美国"],
      glossed: ["积雨云", "冰晶", "避雷针", "摄氏度"],
      xp: 6,
      questions: [
        question(
          ["“比太阳表面的温度还要高好几倍”运用了什么说明方法？", "Which method is “several times hotter than the surface of the sun”?"],
          ["作比较", "Comparison"],
          [
            ["打比方", "Analogy"],
            ["举例子", "Giving an example"],
            ["下定义", "Definition"],
          ],
          [
            "把闪电通过处空气的温度和太阳表面的温度相比，突出了闪电温度之高，是作比较。",
            "Setting the heat of a lightning channel against the sun's surface shows how hot it is: a comparison.",
          ],
        ),
        question(
          [
            "“光的传播速度约为每秒三十万千米”中的“约”能否删去？为什么？",
            "Could 约 (“about”) be removed from “light travels about 300,000 kilometres a second”?",
          ],
          [
            "不能。“约”表示估计，光速并不正好是这个数，删去就不准确了",
            "No: it marks an estimate; light's speed is not exactly that, so removing it would be inexact",
          ],
          [
            ["能。删去以后句子更简洁", "Yes: the sentence is shorter without it"],
            ["能。光速正好是每秒三十万千米", "Yes: light travels exactly that fast"],
            ["不能。删去以后句子读起来不通顺", "No: the sentence would not read smoothly"],
          ],
          [
            "光速只是接近每秒三十万千米，“约”说明这是一个近似的数，体现了说明文语言的准确。",
            "Light's speed is close to, not exactly, that figure; “about” keeps the statement exact.",
          ],
        ),
        question(
          [
            "按照文中的方法，看见闪电后三秒听到雷声，雷电离我们大约有多远？",
            "By the passage's method, if thunder comes three seconds after the flash, how far away is the lightning?",
          ],
          ["约一千米", "About one kilometre"],
          [
            ["约三百四十米", "About 340 metres"],
            ["约三千米", "About three kilometres"],
            ["约九十万千米", "About 900,000 kilometres"],
          ],
          [
            "第四段说，隔了几秒，就乘以三百四十米。三乘三百四十米是一千零二十米，大约一千米。",
            "The fourth paragraph says to multiply the seconds by 340 metres: three times 340 is 1,020 metres, about a kilometre.",
          ],
        ),
        question(
          ["本文是按什么顺序来说明的？", "In what order is the passage arranged?"],
          ["逻辑顺序：从闪电到雷声，从成因到防护", "Logical: from lightning to thunder, from causes to safety"],
          [
            ["时间顺序：按一场雷雨的经过", "Time: the course of one storm"],
            ["空间顺序：从高空到地面", "Space: from the sky down to the ground"],
            ["时间顺序：按人们认识雷电的历史", "Time: the history of how we learned about lightning"],
          ],
          [
            "文章先提出问题，再依次讲闪电的成因、雷声的成因、先见闪电后闻雷声的道理，最后讲防雷，是按事理的逻辑顺序。",
            "A question, then lightning, thunder, why light comes first, and finally safety: a logical order.",
          ],
        ),
      ],
    },
    {
      id: "chinese-why-the-earth-shakes",
      title: ["地震是怎样发生的", "Why the Earth Shakes"],
      body: `地球的表面看起来稳稳当当，其实并不是一块完整的“硬壳”。地球最外面一层坚硬的岩石，被分成了许多大大小小的板块。这些板块一直在缓慢地移动，一年只移动几厘米，和我们指甲生长的速度差不多。

板块移动的时候，相互之间会挤压、拉伸或者错动。地下的岩石在这些力的作用下慢慢变形，积累起巨大的能量。就像一根被越弯越厉害的竹竿，当岩石承受不住时，就会突然断裂或者滑动，把积累的能量一下子释放出来。这些能量以波的形式向四面八方传播，引起地面的震动，这就是地震。地下岩石最先发生断裂的地方叫震源，地面上正对着震源的地方叫震中。世界上的地震，大多发生在板块与板块交界的地带。

地震波主要有两种。一种叫纵波，传播得快，使地面上下颠动；另一种叫横波，传播得慢一些，使地面水平摇晃，破坏性往往更大。所以，发生较强的地震时，离震中有一段距离的人往往先感到上下颠动，过几秒钟才感到强烈的摇晃。地震预警正是利用了这个道理：靠近震中的仪器一测到地震波，系统就立刻通过手机、电视等发出警报。电信号比地震波快得多，警报就能赶在强烈的摇晃到来之前，给远处的人们留出几秒到几十秒的时间。

人们常用震级和烈度来描述地震。震级表示一次地震释放能量的多少，一次地震只有一个震级；震级每增加一级，释放的能量大约增加到原来的三十多倍。烈度表示地震对某个地方的影响和破坏程度。同一次地震，离震中近的地方烈度一般较高，离震中远的地方烈度一般较低。

目前，科学家还不能准确地预报地震，但我们可以做好防范：建造能抗震的房屋，学习避险的知识。地震发生时，如果在室内，应迅速躲到坚固的桌子下面或者内墙的墙角，护住头部，等震动过去再有序地撤离，千万不要乘电梯。`,
      glossed: ["板块", "震源", "震中", "纵波", "横波", "震级", "烈度", "地震波", "预警"],
      xp: 6,
      questions: [
        question(
          [
            "“一年只移动几厘米，和我们指甲生长的速度差不多”运用了哪些说明方法？",
            "Which methods are in “only a few centimetres a year, about as fast as our nails grow”?",
          ],
          ["列数字和作比较", "Giving figures and comparison"],
          [
            ["打比方和下定义", "Analogy and definition"],
            ["举例子和分类别", "Example and classification"],
            ["列数字和下定义", "Figures and definition"],
          ],
          [
            "“几厘米”是列数字；拿板块移动和指甲生长的速度相比，是作比较，让读者对这种缓慢有具体的感受。",
            "“A few centimetres” gives a figure; setting it beside the growth of nails is a comparison that makes the slowness felt.",
          ],
        ),
        question(
          [
            "“地下岩石最先发生断裂的地方叫震源”运用了什么说明方法？",
            "Which method is “the place underground where the rock first breaks is called the focus”?",
          ],
          ["下定义", "Definition"],
          [
            ["打比方", "Analogy"],
            ["举例子", "Giving an example"],
            ["作比较", "Comparison"],
          ],
          ["句子用简明的话说清了“震源”指的是什么，是下定义。", "It states plainly what the focus is: a definition."],
        ),
        question(
          [
            "发生较强的地震时，人们为什么往往先感到上下颠动，过几秒钟才感到强烈的摇晃？",
            "In a strong earthquake, why do people often feel a jolt up and down before the strong swaying?",
          ],
          ["纵波传播得快，先到；横波传播得慢，后到", "The faster P waves arrive first, the slower S waves later"],
          [
            ["横波比纵波传播得快", "S waves travel faster than P waves"],
            ["地震预警系统先发出了警报", "The warning system sounds first"],
            ["震源在不断地向地面靠近", "The focus keeps moving towards the surface"],
          ],
          [
            "第三段说，纵波“传播得快，使地面上下颠动”，横波“传播得慢一些，使地面水平摇晃”，所以先颠后晃。",
            "The third paragraph says P waves are faster and jolt the ground up and down; S waves are slower and sway it.",
          ],
        ),
        question(
          ["关于震级和烈度，下面说法正确的是哪一项？", "Which statement about magnitude and intensity is right?"],
          ["一次地震只有一个震级，不同地方的烈度却可以不同", "A quake has one magnitude, but its intensity differs from place to place"],
          [
            ["烈度表示一次地震释放能量的多少", "Intensity is how much energy a quake releases"],
            ["离震中越远的地方，烈度一般越高", "Places farther from the epicentre usually have higher intensity"],
            ["震级每增加一级，能量增加一倍", "Each step in magnitude doubles the energy"],
          ],
          [
            "第四段说，震级表示释放能量的多少，“一次地震只有一个震级”；烈度表示某地受到的影响，离震中近的一般较高。",
            "The fourth paragraph says magnitude is the energy, one per quake; intensity is the effect at a place, higher near the epicentre.",
          ],
        ),
      ],
    },
    {
      id: "chinese-how-satellite-navigation-finds-you",
      title: ["卫星怎样为你导航", "How Satellite Navigation Finds You"],
      body: `打开手机地图，屏幕上立刻出现一个小小的蓝点，告诉你此刻在哪里。手机是怎么知道你的位置的呢？这要靠天上的导航卫星。

卫星导航的原理，可以从一个简单的例子说起。假如你在一片平原上迷了路，只知道自己离甲村十千米，那么你可能在以甲村为圆心、半径十千米的圆上的任何一点；如果还知道自己离乙村八千米，两个圆一般会交于两点，范围就小多了；再知道离丙村的距离，就能确定唯一的位置。这种利用到几个已知点的距离来确定位置的方法，在平面上要用三个点；在立体的空间里，道理也是一样的。

导航卫星就是天上的“已知点”。每颗卫星都在按照计算好的轨道运行，地面随时知道它在哪里。卫星不停地向地面发送信号，信号里包含着发送的时间。手机收到信号后，用收到的时间减去发送的时间，再乘以信号的速度，也就是光速，就算出了自己到这颗卫星的距离。

不过，信号的速度极快，时间上差一点点，距离就会差很远：时间只要差百万分之一秒，距离就会差大约三百米。卫星上装有非常准的原子钟，可手机里的钟没有那么准。因此，手机通常要同时接收至少四颗卫星的信号，多出来的一颗，正好用来校正手机时钟的误差。这样，就能算出准确的位置了。

我国自主建设的北斗卫星导航系统，于2020年建成，开始向全球提供服务。今天，从手机导航、共享单车，到渔船出海、农田耕种，北斗已经走进了人们生活的方方面面。`,
      names: ["北斗", "2020"],
      glossed: ["原子钟", "导航"],
      xp: 6,
      questions: [
        question(
          [
            "第二段用在平原上迷路的情形来说明定位的原理，运用了什么说明方法？",
            "Which method does the second paragraph use, explaining position with someone lost on a plain?",
          ],
          ["举例子", "Giving an example"],
          [
            ["下定义", "Definition"],
            ["列数字", "Giving figures"],
            ["分类别", "Classification"],
          ],
          [
            "作者用一个具体的迷路的例子，把抽象的定位原理讲得通俗易懂，是举例子。",
            "A concrete case of being lost makes the abstract principle easy to follow: an example.",
          ],
        ),
        question(
          [
            "“时间只要差百万分之一秒，距离就会差大约三百米”运用了什么说明方法？说明了什么？",
            "Which method is “a millionth of a second off means about 300 metres off”, and what does it show?",
          ],
          ["列数字，说明计时稍有误差，距离就会差很多", "Figures, showing that a tiny timing error means a large distance error"],
          [
            ["作比较，说明卫星比手机跑得快", "Comparison, showing satellites move faster than phones"],
            ["打比方，说明信号像光一样亮", "Analogy, showing the signal is as bright as light"],
            ["列数字，说明光的速度很慢", "Figures, showing that light is slow"],
          ],
          [
            "用“百万分之一秒”和“三百米”两个数字，具体说明了时间准确的重要，引出后面校正时钟的内容。",
            "The two figures show how much exact timing matters and lead into correcting the clock.",
          ],
        ),
        question(
          ["手机为什么通常要同时接收至少四颗卫星的信号？", "Why does a phone usually need signals from at least four satellites?"],
          ["多出来的一颗用来校正手机时钟的误差", "The extra one corrects the error of the phone's clock"],
          [
            ["一颗卫星的信号太弱，要四颗加在一起", "One signal is too weak, so four are added together"],
            ["四颗卫星分别负责东南西北四个方向", "Each of the four covers one compass direction"],
            ["接收的卫星越多，手机越省电", "More satellites save the phone's battery"],
          ],
          [
            "第四段说，手机里的钟不如卫星上的原子钟准，“多出来的一颗，正好用来校正手机时钟的误差”。",
            "The fourth paragraph says the phone's clock is less exact, and the extra satellite corrects it.",
          ],
        ),
        question(
          ["本文是按什么顺序来说明的？", "In what order is the passage arranged?"],
          ["逻辑顺序：从现象到原理，再到应用", "Logical: from what we see, to the principle, to its uses"],
          [
            ["时间顺序：按北斗系统建设的过程", "Time: the stages of building BeiDou"],
            ["空间顺序：从地面到太空", "Space: from the ground up to space"],
            ["时间顺序：按手机开机后的步骤", "Time: the steps after a phone is switched on"],
          ],
          [
            "文章从手机地图上的蓝点说起，接着讲定位原理、测距和校时，最后讲北斗的应用，是按事理的逻辑顺序。",
            "From the blue dot to the principle, ranging and timing, then BeiDou in use: a logical order.",
          ],
        ),
      ],
    },
  ],
);

/** gradeNineDebate is the argument unit of grade 9: weighing views. */
const gradeNineDebate = unit(
  9,
  "chinese-reading-9-debate",
  ["明辨是非", "Weighing Views"],
  [
    {
      id: "chinese-the-use-of-the-useless",
      title: ["“无用”之用", "The Use of the Useless"],
      body: `常听到有人说：“读小说、读诗有什么用？考试又不考，将来找工作也用不上。”在这些人看来，只有能马上换来分数、换来收入的东西才值得学。这种看法是片面的。有些东西看似“无用”，却有着更深远的用处。

首先，“有用”和“无用”不能只看眼前。两千多年前，庄子就讲过“无用之用”的道理：一棵大树木质疏松，做不了船，也做不了家具，木匠都不看它一眼，它却因此躲过了砍伐，长成了能给许多人遮阴的大树。看起来没有用，换个角度，用处就显出来了。

其次，许多重要的发现，在最初都被认为“没有用”。十九世纪，英国科学家法拉第研究电与磁的关系，据说有人问他：“这东西有什么用？”那时谁也想不到，正是这些看似远离生活的研究，为后来的发电机、电动机打下了基础，彻底改变了人类的生活。

再次，文学艺术的“用处”，在于滋养人的精神。读一首好诗，我们学会感受一片落叶的美；读一部好小说，我们能体会别人的喜怒哀乐，学会理解和同情。这些东西无法用分数来衡量，却决定着一个人会成为怎样的人。一个只知道计算得失的人，即使分数再高，内心也可能是贫乏的。

当然，强调“无用之用”，并不是否定实用知识的价值。学好数理化，掌握一门本领，同样重要。我们反对的，只是用眼前的功利来衡量一切的做法。

一棵树要长得高，不仅需要看得见的枝叶，也需要看不见的根。那些看似“无用”的阅读和思考，正是人生的根。`,
      names: ["庄子", "法拉第", "英国"],
      xp: 6,
      questions: [
        question(
          ["文章开头摆出了一种什么观点，作者对它的态度是什么？", "What view does the opening set out, and how does the writer judge it?"],
          [
            "只有能马上换来分数和收入的东西才值得学；作者认为它是片面的",
            "Only what pays off at once in marks or money is worth learning; the writer calls it one-sided",
          ],
          [
            ["读小说和诗很有用；作者表示赞同", "Novels and poems are useful; the writer agrees"],
            ["实用知识没有价值；作者认为它是片面的", "Practical knowledge is worthless; the writer calls it one-sided"],
            ["考试考的都是有用的；作者表示赞同", "Everything examined is useful; the writer agrees"],
          ],
          [
            "第一段先引出“只有能马上换来分数、换来收入的东西才值得学”的看法，接着明确说“这种看法是片面的”。",
            "The first paragraph sets out the view that only quick returns count, then says plainly that it is one-sided.",
          ],
        ),
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["有些东西看似“无用”，却有着更深远的用处", "Some things that seem useless have deeper, longer uses"],
          [
            ["读小说、读诗没有用", "Reading novels and poems is useless"],
            ["实用知识最重要", "Practical knowledge matters most"],
            ["学好数理化并不重要", "Science and maths do not matter"],
          ],
          [
            "第一段在反驳错误看法之后，提出“有些东西看似‘无用’，却有着更深远的用处”，后面三段从三个方面证明它。",
            "After rejecting the view, the first paragraph states the thesis, which the next three paragraphs prove from three sides.",
          ],
        ),
        question(
          ["第三段写法拉第研究电与磁的事，运用了什么论证方法？", "Which method of argument is the paragraph on Faraday's research?"],
          ["举例论证", "Argument by example"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["对比论证", "Argument by contrast"],
            ["道理论证", "Argument from principle"],
          ],
          [
            "这一段举出法拉第的研究后来带来发电机、电动机的例子，证明“许多重要的发现，在最初都被认为‘没有用’”。",
            "Faraday's work, later giving us generators and motors, is an example proving that great discoveries once seemed useless.",
          ],
        ),
        question(
          [
            "最后一段把阅读和思考比作“人生的根”，运用了什么论证方法？",
            "Which method is calling reading and thinking “the roots of a life”?",
          ],
          ["比喻论证", "Argument by metaphor"],
          [
            ["举例论证", "Argument by example"],
            ["对比论证", "Argument by contrast"],
            ["道理论证", "Argument from principle"],
          ],
          [
            "作者用树要长高离不开看不见的根，来比阅读和思考对人生的作用，形象地证明了论点，是比喻论证。",
            "The tree that needs unseen roots stands for what reading and thought do for a life: argument by metaphor.",
          ],
        ),
      ],
    },
    {
      id: "chinese-is-talent-everything",
      title: ["成功全靠天赋吗", "Is Talent Everything?"],
      body: `有一种说法很流行：“成功全靠天赋，没有天赋，再努力也没用。”这话听起来似乎有些道理，因为人与人之间确实存在差别：有人天生嗓子好，有人从小对数字敏感。但是，把成功全部归于天赋，却是站不住脚的。

首先，天赋只是一种可能，要变成真正的本领，离不开长期的努力。数学家华罗庚只有初中毕业的文凭，后来因为家境贫寒，在父亲的小杂货铺里帮忙。他白天站柜台，晚上点着油灯自学数学，常常读到深夜。几年后，他发表的数学论文引起了数学界的注意，被请到清华大学工作，最终成为享誉世界的数学家。如果说他有数学天赋，那么正是日复一日的苦读，才让这份天赋开出了花。

其次，有天赋而不努力，最终也会一事无成。宋代王安石写过一篇《伤仲永》：一个叫方仲永的孩子，五岁时就能作诗，被人称为神童。可是他的父亲贪图小利，整天带着他四处拜访，不让他学习。结果到了二十岁左右，他已经和普通人没什么两样了。天赋再高，不去培养，也会被浪费。

再说，“成功全靠天赋”的说法，还会给人带来坏处。相信这种说法的人，遇到困难时容易对自己说“我天生就不行”，于是早早放弃；一些自以为聪明的人，又可能因此骄傲自满，不肯下功夫。这样看来，这种说法不但不对，而且有害。

当然，我们并不否认天赋的存在，也不是说每个人努力之后都能成为华罗庚。但是，对大多数人来说，还远远没有到需要拼天赋的地步。与其抱怨自己天赋不够，不如把时间用在实实在在的努力上。

种子再好，也要有人浇水施肥，才能长成大树。天赋是种子，勤奋才是让它生长的阳光和雨水。`,
      names: ["华罗庚", "清华大学", "王安石", "伤仲永", "方仲永"],
      xp: 6,
      questions: [
        question(
          ["本文反驳的是什么观点？", "What view does the passage refute?"],
          ["成功全靠天赋，没有天赋，再努力也没用", "Success is all talent; without it effort is useless"],
          [
            ["人与人之间存在差别", "People differ from one another"],
            ["天赋根本不存在", "There is no such thing as talent"],
            ["努力的人都能成为华罗庚", "Anyone who works hard can be Hua Luogeng"],
          ],
          [
            "第一段先摆出“成功全靠天赋”的流行说法，接着说“把成功全部归于天赋，却是站不住脚的”，这就是要反驳的观点。",
            "The first paragraph states the popular saying and then calls it untenable: that is the view refuted.",
          ],
        ),
        question(
          [
            "第二段华罗庚和第三段方仲永的例子一正一反，合起来运用了什么论证方法？",
            "Hua Luogeng and Fang Zhongyong are a positive and a negative case. Together, which method do they form?",
          ],
          ["对比论证", "Argument by contrast"],
          [
            ["比喻论证", "Argument by metaphor"],
            ["道理论证", "Argument from principle"],
            ["因果论证", "Argument from cause and effect"],
          ],
          [
            "华罗庚靠苦读让天赋开花，方仲永有天赋却因不学而平庸。一正一反对照，有力地说明成功不能只靠天赋。",
            "One made his gift flower by study; the other wasted his. Set side by side, they show success is not talent alone.",
          ],
        ),
        question(
          ["第四段是从什么角度反驳错误观点的？", "From what angle does the fourth paragraph refute the view?"],
          ["从这种说法会带来的坏处来反驳", "From the harm the view does"],
          [
            ["指出这种说法的论据是编造的", "By showing its evidence is invented"],
            ["举出名人的事例来反驳", "By citing famous people"],
            ["引用古人的话来反驳", "By quoting the ancients"],
          ],
          [
            "这一段说，相信这种说法的人会“早早放弃”或“骄傲自满”，所以它“不但不对，而且有害”，是从后果上反驳。",
            "It says believers give up early or grow proud, so the view is harmful as well as wrong: a refutation by its effects.",
          ],
        ),
        question(
          ["第五段“当然……”在文中起什么作用？", "What does the fifth paragraph, beginning “Of course…”, do?"],
          [
            "承认天赋存在，使论证更周密，不至于走向另一个极端",
            "It grants that talent exists, so the argument is careful and not one-sided the other way",
          ],
          [
            ["说明作者其实赞同“成功全靠天赋”", "It shows the writer really agrees success is all talent"],
            ["证明每个人都能成为华罗庚", "It proves anyone can be Hua Luogeng"],
            ["举出一个新的反面例子", "It gives a new counter-example"],
          ],
          [
            "作者反驳的是“全靠天赋”，并不否认天赋本身。这一段把话说得有分寸，避免从一个极端走向另一个极端。",
            "The writer rejects “talent is everything”, not talent itself; the paragraph keeps the argument measured.",
          ],
        ),
      ],
    },
    {
      id: "chinese-can-a-search-engine-think-for-you",
      title: ["搜索能代替头脑吗", "Can a Search Engine Think for You?"],
      body: `如今，手机一搜，什么知识都能查到。于是有人说：“既然网上什么都有，还用得着费劲记住知识吗？需要的时候查一查就行了。”这种说法看似聪明，其实经不起推敲。

第一，查得到，不等于看得懂。网上的资料再多，也要靠头脑里已有的知识去理解。一个不懂基本化学知识的人，即使搜到了一篇关于新材料的文章，也只能看到一串陌生的名词。知识就像一张网，头脑里已有的知识越多，网就越密，新的知识才越容易被“网住”。如果头脑里空空如也，再多的资料也只能从身边溜走。

第二，查得到，不等于能分辨真假。网上的信息真真假假，好坏都有：有的过时了，有的是片面的，有的干脆就是谣言。一个人只有具备扎实的基础知识和判断能力，才能看出哪些说法有根据，哪些说法自相矛盾。缺少这些，就很容易被错误的信息牵着鼻子走。

第三，许多场合根本来不及查。医生做手术时，不可能停下来上网搜索下一步该怎么做；与人交谈、讨论问题时，也不能每说一句话就去查一次手机。真正的本领，是已经装在头脑里、随时能用上的东西。

更重要的是，学习的过程本身就在锻炼人的思维。背诵一首诗，推导一个公式，写一篇文章，我们不仅得到了知识，也学会了怎样观察、怎样思考、怎样解决问题。如果一切都交给搜索，这些能力就无从培养。

当然，我们并不反对上网查资料。善于利用网络，能让学习事半功倍。但是，网络应当是我们的工具，而不能代替我们的头脑。

查找答案的本领，人人都可以很快学会；能提出问题、判断答案的头脑，却只能靠自己一点一点地积累。`,
      xp: 6,
      questions: [
        question(
          ["本文反驳的是什么观点？", "What view does the passage refute?"],
          ["网上什么都能查到，就不必费劲记住知识", "Since everything is online, there is no need to learn things"],
          [
            ["不应该上网查资料", "We should not look things up online"],
            ["网上的信息都是谣言", "Everything online is a rumour"],
            ["医生做手术前不用学习", "Surgeons need not study"],
          ],
          [
            "第一段引出“既然网上什么都有，还用得着费劲记住知识吗”的说法，并指出它“经不起推敲”。",
            "The first paragraph gives the claim that nothing need be learned since all is online, and says it does not hold up.",
          ],
        ),
        question(
          ["本文的中心论点是什么？", "What is the thesis of the passage?"],
          ["网络是工具，不能代替头脑，学习知识仍然必不可少", "The internet is a tool, not a mind; learning is still essential"],
          [
            ["应该少用手机", "We should use phones less"],
            ["查资料能让学习事半功倍", "Looking things up doubles what we learn"],
            ["知识越多，学起来越难", "The more we know, the harder learning is"],
          ],
          [
            "文章从四个方面驳倒“查一查就行”的说法，第六段明确说：“网络应当是我们的工具，而不能代替我们的头脑。”",
            "Four arguments refute “just look it up”, and the sixth paragraph says the internet should be our tool, not our mind.",
          ],
        ),
        question(
          [
            "“知识就像一张网……新的知识才越容易被‘网住’”运用了什么论证方法？",
            "Which method is “knowledge is like a net… the more we know, the more new knowledge it catches”?",
          ],
          ["比喻论证", "Argument by metaphor"],
          [
            ["举例论证", "Argument by example"],
            ["对比论证", "Argument by contrast"],
            ["道理论证", "Argument from principle"],
          ],
          [
            "作者把已有的知识比作一张网，网越密越能“网住”新知识，形象地说明了已有知识对理解的作用，是比喻论证。",
            "Knowledge is likened to a net that catches more as it grows denser: argument by metaphor.",
          ],
        ),
        question(
          ["第四段举医生做手术的例子，是为了证明什么？", "What is the example of a surgeon in the fourth paragraph meant to prove?"],
          ["许多场合根本来不及查，本领要装在头脑里", "Often there is no time to look things up; skill must be in the head"],
          [
            ["医生不会使用网络", "Doctors cannot use the internet"],
            ["做手术比学习更重要", "Surgery matters more than study"],
            ["网上没有医学方面的资料", "There is nothing medical online"],
          ],
          [
            "这一段的第一句“许多场合根本来不及查”是分论点，医生做手术的例子就是用来证明它的。",
            "The paragraph opens with its point, that often there is no time to look things up; the surgeon proves it.",
          ],
        ),
      ],
    },
  ],
);

/** juniorReading are the reading units of grades 7 to 9, with the grade that offers each. */
export const juniorReading: readonly { readonly grade: number; readonly unit: ReadingUnitDef }[] = [
  { grade: 7, unit: gradeSevenHome },
  { grade: 7, unit: gradeSevenWonders },
  { grade: 7, unit: gradeSevenHabits },
  { grade: 8, unit: gradeEightRemembered },
  { grade: 8, unit: gradeEightThings },
  { grade: 8, unit: gradeEightReasoning },
  { grade: 9, unit: gradeNineChoices },
  { grade: 9, unit: gradeNineScience },
  { grade: 9, unit: gradeNineDebate },
];
