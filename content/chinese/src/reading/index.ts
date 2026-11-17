// The reading units of grades 3 to 6 (docs/chinese-curriculum.md §9): passages written for this subject, a unit a grade,
// each with a short check. A passage is offered once its characters are known well enough and the grade's first word
// batch is learned; its questions ask what it says, what a word or sentence means in it, and what it is about.

import { type PassageDef, type PassageQuestionDef, type ReadingUnitDef, type Text, t } from "@ga/content";

import { wordId } from "../words/index.ts";

/** Pair is a text in Chinese and in English, in that order. */
type Pair = readonly [zh: string, en: string];

const text = ([zh, en]: Pair): Text => t(en, zh);

/** question builds a comprehension question from its prompt, right option, wrong options and solution. */
function question(prompt: Pair, right: Pair, wrong: readonly Pair[], solution: Pair): PassageQuestionDef {
  return { prompt: text(prompt), right: text(right), wrong: wrong.map(text), solution: text(solution) };
}

/** PassageData is a passage without the topics it needs, which are its grade's. */
type PassageData = Omit<PassageDef, "topics" | "title"> & { readonly title: Pair };

/** unit builds a grade's reading unit; each passage needs the grade's first word batch. */
function unit(grade: number, id: string, title: Pair, passages: readonly PassageData[]): ReadingUnitDef {
  return {
    id,
    title: text(title),
    passages: passages.map((p) => ({ ...p, title: text(p.title), topics: [{ topic: wordId(grade, 1), weight: 0.2 }] })),
  };
}

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

中午，我们坐在树下休息。爷爷切开一个大苹果，分给大家吃。苹果又甜又脆，我一口气吃了两块。爷爷笑着说：“这些果子是我们一年的辛苦换来的。春天要浇水、除草，夏天要捉虫，到了秋天才有这么好的收成。”

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
            "爷爷说果子是“一年的辛苦换来的”：春天浇水除草，夏天捉虫。汗水指的是辛苦的劳动。",
            "Grandpa says the fruit came from a year of hard work, watering, weeding and catching insects; the sweat is that work.",
          ],
        ),
      ],
    },
    {
      id: "chinese-before-the-rain",
      title: ["下雨之前", "Before the Rain"],
      body: `夏天的一个下午，天气闷热，一点风也没有。我和小伙伴在院子里玩，发现墙角有一大群蚂蚁，正排着长长的队伍搬东西。有的蚂蚁抬着白色的小东西，有的蚂蚁拖着小虫子，急急忙忙地往高处爬。

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

科学家仔细观察后发现，蜜蜂是用“跳舞”来传递消息的。如果花离蜂房很近，它就在蜂房里转着圆圈跳，这叫圆舞。如果花离蜂房比较远，它就一边摇动身体，一边走出一个“8”字形，这叫摇摆舞。

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

候鸟飞那么远，为什么不会迷路？科学家发现，有的候鸟靠太阳和星星辨别方向，有的能感觉到地球的磁场，还有的会记住山脉、河流这些路上的标志。

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

竹子的用处很多。竹笋可以做菜，味道鲜美。竹子又轻又结实，可以用来搭架子、做竹梯。把竹子劈成细细的竹条，能编成竹篮、竹席和竹筐。很早以前，纸还没有发明的时候，人们把字写在竹片上，再用绳子把竹片串起来，就成了书，这叫作竹简。

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

/** chineseReading are the reading units of Chinese, with the grade that offers each. */
export const chineseReading: readonly { readonly grade: number; readonly unit: ReadingUnitDef }[] = [
  { grade: 3, unit: gradeThreeReading },
  { grade: 4, unit: gradeFourReading },
  { grade: 5, unit: gradeFiveReading },
  { grade: 6, unit: gradeSixReading },
];
