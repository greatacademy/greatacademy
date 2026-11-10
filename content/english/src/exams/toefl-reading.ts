// The reading unit of TOEFL: four everyday texts and four short academic passages in the words of B2 and below, with
// questions in the formats of Read in Daily Life and Read an Academic Passage. Every text is written for this course.

import { type ReadingUnitDef, t } from "@ga/content";
import { readingWords } from "../levels/b2/reading-words.ts";
import { passageMaker } from "../levels/pre-a1/reading-kit.ts";

const passage = passageMaker(readingWords, []);

/** toeflReading is the reading unit of the TOEFL course. */
export const toeflReading: ReadingUnitDef = {
  id: "toefl-reading",
  title: t("TOEFL Reading", "托福阅读"),
  passages: [
    passage({
      id: "toefl-reading-changes-to-library-hours",
      title: ["Changes to Library Hours", "图书馆开放时间调整"],
      body: `From Monday, March 3, the Hilton Library will change its opening hours while work is done on the second floor. From Monday to Friday, the library will open at eight in the morning and close at eight in the evening, two hours earlier than it does now. On weekends, it will be open from ten in the morning until five in the afternoon.

While the work goes on, the second floor will be closed. Books from that floor can be ordered at the front desk, and most orders will be ready within a day. The quiet study rooms on the third floor will stay open, but you must now book a room online before you come, and you can use a room for two hours at most.

We expect the work to be finished by the end of April. We are sorry for any problems during this time, and we thank you for your patience.`,
      grammar: ["reading-workplace-documents", "making-inferences"],
      names: ["Hilton"],
      questions: [
        [
          ["What is the main purpose of the notice?", "这则通知的主要目的是什么？"],
          ["To tell library users about changes while work is done", "告诉图书馆使用者施工期间的变化"],
          [
            ["To ask students to help with work on the second floor", "请学生帮忙完成二楼的工程"],
            ["To announce that the library will close in April", "宣布图书馆将在四月关闭"],
            ["To explain how to order new books online", "说明如何在网上订购新书"],
          ],
          [
            'The notice lists what changes "while work is done on the second floor": the hours, the closed floor and the rules for study rooms.',
            "通知列出了“二楼施工期间”的变化：开放时间、关闭的楼层和自习室的新规定。",
          ],
        ],
        [
          ["At what time will the library close on a weekday?", "工作日图书馆几点关门？"],
          ["At eight in the evening", "晚上八点"],
          [
            ["At ten in the evening", "晚上十点"],
            ["At five in the afternoon", "下午五点"],
            ["At eight in the morning", "早上八点"],
          ],
          [
            'From Monday to Friday it will "close at eight in the evening". Ten is when it closes now, two hours later, and five is the closing time on weekends.',
            "周一至周五图书馆“晚上八点关门”。十点是现在的关门时间（晚两小时），五点是周末的关门时间。",
          ],
        ],
        [
          ["How can a student get a book that is kept on the second floor?", "学生如何拿到放在二楼的书？"],
          ["By ordering it at the front desk", "在前台预订"],
          [
            ["By booking it online before coming", "来之前在网上预约"],
            ["By going to the second floor on weekends", "周末去二楼取"],
            ["By asking for it on the third floor", "去三楼索取"],
          ],
          [
            '"Books from that floor can be ordered at the front desk." Online booking is for the study rooms.',
            "原文说“那层楼的书可以在前台预订”。网上预约是针对自习室的。",
          ],
        ],
        [
          ["What can be inferred about the study rooms on the third floor?", "关于三楼的自习室，可以推断出什么？"],
          ["Students could use them without booking before", "以前学生不用预约就能使用"],
          [
            ["They will be closed until the end of April", "它们将关闭到四月底"],
            ["They are only for groups of students", "它们只供学生小组使用"],
            ["They will be moved to the second floor", "它们将搬到二楼"],
          ],
          [
            'Students "must now book a room online": the word *now* shows that booking was not needed before. The rooms "will stay open".',
            "学生“现在必须在网上预约”：now 一词说明以前不需要预约。原文还说这些房间“将继续开放”。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-an-email-from-a-professor",
      title: ["An Email from a Professor", "教授的一封邮件"],
      body: `Dear students,

I have to attend a meeting in another city on Thursday, so our class will not meet in our classroom that day. Instead, I have recorded a short lecture, which you can watch online at any time before next Tuesday. Please watch it before you write your second paper, since it explains the ideas you will need.

The deadline for the paper has not changed. However, I know that some of you were planning to ask me questions in class. I will be in my office on Wednesday afternoon from two to five, and you are welcome to come by without an appointment. You can also send me your questions by email, and I will reply to all of them by Friday.

Best wishes,
Professor Lin`,
      grammar: ["reading-workplace-documents", "making-inferences"],
      names: ["Lin"],
      questions: [
        [
          ["Why is Professor Lin writing to the students?", "林教授为什么给学生写信？"],
          ["To explain what will happen instead of Thursday's class", "说明周四的课改为怎样安排"],
          [
            ["To change the deadline for the second paper", "更改第二篇论文的截止日期"],
            ["To invite students to a meeting in another city", "邀请学生去另一个城市开会"],
            ["To ask students to record a lecture", "请学生录一节课"],
          ],
          [
            'The class "will not meet" on Thursday, so she explains the recorded lecture and how students can still ask questions. The deadline "has not changed".',
            "周四的课“不上了”，所以她说明了录好的讲座以及学生仍可提问的方式。截止日期“没有改变”。",
          ],
        ],
        [
          ["What does the professor ask students to do before they write their second paper?", "教授要求学生在写第二篇论文之前做什么？"],
          ["Watch the recorded lecture", "观看录好的讲座"],
          [
            ["Visit her office", "去她的办公室"],
            ["Send her a plan of the paper", "给她发论文提纲"],
            ["Read the notes from Thursday", "阅读周四的笔记"],
          ],
          [
            '"Please watch it before you write your second paper, since it explains the ideas you will need."',
            "原文说：“请在写第二篇论文之前观看，因为它讲解了你们需要的观点。”",
          ],
        ],
        [
          ["What can be inferred about Wednesday afternoon?", "关于周三下午，可以推断出什么？"],
          ["Students may visit the professor even if they have not arranged it", "即使没有预约，学生也可以去找教授"],
          [
            ["The professor will give an extra class", "教授会加一节课"],
            ["The professor will be away from the university", "教授会离开学校"],
            ["Students must email the professor first", "学生必须先给教授发邮件"],
          ],
          [
            'Students "are welcome to come by without an appointment", so they need not arrange a time. She is away on Thursday, not Wednesday.',
            "原文说学生“不用预约也欢迎过来”，所以不必事先约时间。她离开的是周四而不是周三。",
          ],
        ],
        [
          ["By when will the professor answer questions sent by email?", "教授会在什么时候之前回复邮件里的问题？"],
          ["By Friday", "周五之前"],
          [
            ["By Thursday", "周四之前"],
            ["By next Tuesday", "下周二之前"],
            ["By Wednesday afternoon", "周三下午之前"],
          ],
          [
            '"I will reply to all of them by Friday." Next Tuesday is the last day to watch the lecture.',
            "原文说“我会在周五之前全部回复”。下周二是观看讲座的最后期限。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-a-message-to-residents",
      title: ["A Message to Residents", "致住户的通知"],
      body: `To all residents of Park Hall,

The water in the building will be turned off on Tuesday from nine in the morning until about one in the afternoon, while repairs are made on the ground floor. During this time, you will not be able to use the showers, the kitchens or the washing machines. Residents who need a shower can use the sports center next door, which will open its showers to anyone with a student card.

Please make sure that nothing is left running while the water is off, because water may come out very fast when it is turned back on. If you notice any problems with your water after one o'clock, report them to the housing office as soon as possible.

Thank you,
Housing Office`,
      grammar: ["reading-workplace-documents", "making-inferences"],
      names: ["Park", "Hall"],
      questions: [
        [
          ["Why will the water be turned off?", "为什么要停水？"],
          ["So that repairs can be made on the ground floor", "以便在一楼进行维修"],
          [
            ["Because the sports center needs more water", "因为体育中心需要更多的水"],
            ["Because the washing machines are being replaced", "因为要更换洗衣机"],
            ["So that the kitchens can be cleaned", "以便清洁厨房"],
          ],
          [
            'The water will be off "while repairs are made on the ground floor". The machines and kitchens simply cannot be used during that time.',
            "停水是因为“一楼正在维修”。洗衣机和厨房只是在这段时间不能使用。",
          ],
        ],
        [
          ["What are residents who need a shower told to do?", "需要洗澡的住户被告知怎么做？"],
          ["Use the sports center next door with a student card", "凭学生卡去隔壁的体育中心"],
          [
            ["Wait until the evening", "等到晚上"],
            ["Ask the housing office for a key", "向住房办公室要钥匙"],
            ["Use the showers on the ground floor", "使用一楼的淋浴"],
          ],
          ['The sports center "will open its showers to anyone with a student card."', "原文说体育中心“将向持有学生卡的人开放淋浴”。"],
        ],
        [
          ["Why should residents make sure that nothing is left running?", "住户为什么要确保没有开着的水龙头？"],
          ["Water may come out very fast when it is turned back on", "恢复供水时水可能会猛地冲出来"],
          [
            ["The repairs will take longer if water is used", "用水会让维修时间更长"],
            ["Residents will have to pay for the water", "住户得为用水付钱"],
            ["The sports center will close early", "体育中心会提前关门"],
          ],
          [
            'The message gives its reason: "because water may come out very fast when it is turned back on."',
            "通知给出了理由：“因为恢复供水时水可能会猛地冲出来。”",
          ],
        ],
        [
          ["What should a resident do if the water is not working properly at two o'clock?", "如果下午两点水还不正常，住户应该怎么做？"],
          ["Tell the housing office as soon as possible", "尽快告诉住房办公室"],
          [
            ["Wait until the next morning", "等到第二天早上"],
            ["Turn the water off again", "再把水关掉"],
            ["Go to the sports center", "去体育中心"],
          ],
          [
            "\"If you notice any problems with your water after one o'clock, report them to the housing office as soon as possible.\" Two o'clock is after one.",
            "原文说一点以后发现用水问题就要尽快报告住房办公室，两点正是在一点以后。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-join-the-garden-club",
      title: ["Join the Garden Club", "加入园艺社"],
      body: `Have you ever wanted to grow your own vegetables? The Campus Garden Club looks after a small garden behind the science building, where we grow tomatoes, beans and flowers. No experience is needed: our older members are happy to show you everything, from planting seeds to keeping insects away.

We meet every Saturday morning from nine to eleven, and in the summer we also water the garden on the evenings from Monday to Friday. Members share the vegetables we grow, and at the end of the season we hold a dinner made with food from the garden.

Our first meeting of the year is on Saturday, September 14. Wear old clothes and bring a bottle of water. We have tools and gloves for everyone.`,
      grammar: ["reading-workplace-documents", "making-inferences"],
      names: ["Campus", "Garden", "Club"],
      questions: [
        [
          ["Who is the poster mainly for?", "这张海报主要是写给谁的？"],
          ["Students who might want to join the club", "可能想加入社团的学生"],
          [
            ["Experienced members of the club", "社团的老成员"],
            ["People who sell vegetables", "卖蔬菜的人"],
            ["Teachers in the science building", "科学楼的老师"],
          ],
          [
            'It asks "Have you ever wanted to grow your own vegetables?" and tells new people when the first meeting is and what to bring.',
            "海报问“你想过自己种菜吗？”，并告诉新人第一次聚会的时间和要带什么。",
          ],
        ],
        [
          ["According to the poster, what do new members NOT need?", "根据海报，新成员不需要什么？"],
          ["Experience of growing plants", "种植经验"],
          [
            ["Old clothes", "旧衣服"],
            ["A bottle of water", "一瓶水"],
            ["Time on Saturday mornings", "周六上午的时间"],
          ],
          [
            '"No experience is needed." The poster asks members to wear old clothes, bring water and meet on Saturday mornings.',
            "海报说“不需要经验”，但要求穿旧衣服、带水，并在周六上午聚会。",
          ],
        ],
        [
          ["When does the club water the garden on weekday evenings?", "园艺社什么时候在工作日晚上浇水？"],
          ["In the summer", "夏天"],
          [
            ["All year", "全年"],
            ["Only in September", "只在九月"],
            ["At the end of the season", "季末"],
          ],
          ['"In the summer we also water the garden on the evenings from Monday to Friday."', "原文说“夏天我们还在周一到周五的晚上浇水”。"],
        ],
        [
          ["What can be inferred about the dinner at the end of the season?", "关于季末的晚餐，可以推断出什么？"],
          ["It uses vegetables that the members grew", "用的是成员们种的蔬菜"],
          [
            ["It is held in the science building", "在科学楼举行"],
            ["Members must pay to attend it", "成员参加要付钱"],
            ["It is the first meeting of the year", "这是一年中的第一次聚会"],
          ],
          [
            'The dinner is "made with food from the garden", which the members grow and share.',
            "晚餐“用园子里的食物做成”，而这些食物是成员们自己种、一起分享的。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-how-bats-find-their-way",
      title: ["How Bats Find Their Way", "蝙蝠如何辨认方向"],
      body: `Most bats, small flying animals, hunt at night, when it is too dark to see well. Instead of relying on their eyes, many of them use a skill called echolocation, which means finding things by their echoes, the sounds that come back from them. A bat produces short, high sounds, often too high for people to hear, and listens to the echoes from the things around it. From the time an echo takes to return, the bat can tell how far away something is, and from small differences between the echoes at its two ears, it can tell where it is.

Echolocation is very precise. Some bats can find a very small insect and catch it in the air. As a bat gets nearer to its prey, it makes sounds more and more often, up to two hundred times a second, so that it always knows exactly where the insect is.

Some insects have developed ways to get away. Certain moths, insects that also fly at night, can hear the sounds of bats, and when they do, they suddenly drop toward the ground. Others produce sounds of their own, which seem to make it harder for the bat to find them.`,
      grammar: ["main-idea", "supporting-details"],
      glossed: ["bats", "bat", "echolocation", "echoes", "echo", "moths"],
      questions: [
        [
          ["What is the passage mainly about?", "这篇文章主要讲什么？"],
          [
            "How bats use sound to find things in the dark, and how some insects get away",
            "蝙蝠如何用声音在黑暗中找东西，以及有些昆虫如何逃脱",
          ],
          [
            ["Why bats hunt at night instead of during the day", "蝙蝠为什么在夜里而不是白天捕猎"],
            ["How people learned to hear the sounds of bats", "人们如何学会听到蝙蝠的声音"],
            ["Why moths fly at night", "飞蛾为什么在夜里飞"],
          ],
          [
            'The first two paragraphs explain echolocation, and the last explains how insects "get away". The other answers are details or are not in the passage.',
            "前两段解释回声定位，最后一段说明昆虫如何“逃脱”。其他选项要么只是细节，要么文中没有。",
          ],
        ],
        [
          ["How does a bat tell how far away something is?", "蝙蝠如何判断东西有多远？"],
          ["From the time an echo takes to return", "根据回声返回所用的时间"],
          [
            ["From the differences between the echoes at its two ears", "根据两只耳朵听到的回声差异"],
            ["From how high its own sounds are", "根据自己发出的声音有多高"],
            ["From how often it makes sounds", "根据发声的频率"],
          ],
          [
            '"From the time an echo takes to return, the bat can tell how far away something is." The differences between its ears tell it where something is.',
            "原文说根据回声返回的时间判断距离；两只耳朵的差异告诉它东西在哪个方向。",
          ],
        ],
        [
          ['The word "precise" in the passage is closest in meaning to', "文中 precise 一词的意思最接近"],
          ["exact", "精确的"],
          [
            ["loud", "响亮的"],
            ["quick", "快速的"],
            ["simple", "简单的"],
          ],
          [
            'The next sentences show what *precise* means: bats can find a very small insect and know "exactly where the insect is."',
            "后面的句子说明了 precise 的意思：蝙蝠能找到很小的昆虫，并“确切地”知道它在哪里。",
          ],
        ],
        [
          ["Why do bats make sounds more often as they get nearer to an insect?", "蝙蝠靠近昆虫时为什么更频繁地发声？"],
          ["So that they always know exactly where it is", "以便始终确切地知道它在哪里"],
          [
            ["So that the insect drops to the ground", "让昆虫掉到地上"],
            ["Because the insect makes sounds too", "因为昆虫也会发声"],
            ["Because their ears are tired", "因为它们的耳朵累了"],
          ],
          [
            'It makes sounds more often "so that it always knows exactly where the insect is."',
            "原文说它更频繁地发声，“以便始终确切地知道昆虫在哪里”。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-the-first-maps",
      title: ["The First Maps", "最早的地图"],
      body: `People drew maps long before they could write. One of the oldest known maps, cut into a piece of stone in what is now Spain, may be fourteen thousand years old; some experts believe that it shows mountains, rivers and places where animals could be hunted. Early maps like this were not drawn to be accurate. They showed what mattered to the people who made them, such as where to find water or how to travel from one place to another.

Over time, maps began to show more of the world. About two thousand years ago, the Greek writer Ptolemy explained how to show the whole Earth, which is a ball, on a map, using lines to mark positions north and south, east and west. His ideas were forgotten in Europe for centuries but were kept alive by writers in the Arab world.

Even so, maps stayed full of mistakes for a long time. People at sea had no reliable way to measure how far east or west they had traveled until the eighteenth century, when accurate clocks that worked at sea were finally developed. Only then could the shapes of coasts be shown in the right places on a map.`,
      grammar: ["main-idea", "supporting-details"],
      names: ["Spain", "Ptolemy", "Greek", "Europe", "Arab", "Earth"],
      questions: [
        [
          ["According to the passage, what did early maps mainly show?", "根据文章，早期的地图主要表现什么？"],
          ["What mattered to the people who made them", "对绘制者重要的东西"],
          [
            ["The exact positions of places", "地点的确切位置"],
            ["The shape of the whole Earth", "整个地球的形状"],
            ["The coasts of other countries", "其他国家的海岸"],
          ],
          [
            'Early maps "were not drawn to be accurate. They showed what mattered to the people who made them."',
            "原文说早期地图“不是为了准确而画的，它们表现的是对绘制者重要的东西”。",
          ],
        ],
        [
          ["What does the passage say about Ptolemy's ideas?", "关于托勒密的观点，文章说了什么？"],
          ["They were kept alive by writers in the Arab world", "阿拉伯世界的学者让它们得以流传"],
          [
            ["They were used by people at sea from the start", "一开始就被航海者使用"],
            ["They were first written down in Spain", "最早是在西班牙写下的"],
            ["They were proved wrong in the eighteenth century", "在十八世纪被证明是错的"],
          ],
          [
            'They "were forgotten in Europe for centuries but were kept alive by writers in the Arab world."',
            "原文说它们“在欧洲被遗忘了几个世纪，却被阿拉伯世界的学者保存了下来”。",
          ],
        ],
        [
          [
            "Why were coasts often in the wrong places on maps before the eighteenth century?",
            "为什么十八世纪以前地图上的海岸常常位置不对？",
          ],
          ["People at sea could not measure how far east or west they had traveled", "航海者无法测量自己向东或向西走了多远"],
          [
            ["Mapmakers did not know that the Earth is a ball", "绘图者不知道地球是球形的"],
            ["Coasts changed their shape very often", "海岸的形状经常变化"],
            ["Maps were cut into stone", "地图是刻在石头上的"],
          ],
          [
            'People at sea "had no reliable way to measure how far east or west they had traveled" until clocks that worked at sea were developed.',
            "原文说，在能在海上使用的钟表发明之前，航海者“没有可靠的方法测量向东或向西走了多远”。",
          ],
        ],
        [
          ["Why does the writer mention a map cut into stone in Spain?", "作者为什么提到西班牙一块刻在石头上的地图？"],
          ["To show that people made maps very long ago", "说明人类很早就开始绘制地图"],
          [
            ["To show that early maps were accurate", "说明早期的地图很准确"],
            ["To explain how Ptolemy drew maps", "解释托勒密如何画地图"],
            ["To compare maps with clocks", "把地图和钟表相比较"],
          ],
          [
            'It supports the first sentence, "People drew maps long before they could write": the map may be fourteen thousand years old.',
            "它支持第一句“人类在会写字之前很久就开始画地图”：这张地图可能已有一万四千年。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-why-bread-rises",
      title: ["Why Bread Rises", "面包为什么会发起来"],
      body: `Bread is made of little more than flour, water, salt and yeast, a tiny living thing. Yeast feeds on the sugars in flour, and as it feeds, it gives off a gas. This gas is what makes bread rise, but only if something can hold it.

That something is gluten. When flour and water are mixed into dough, the soft mass that becomes bread, and kneaded, or worked with the hands for a long time, two proteins in the flour join together to form gluten, a network that can stretch like rubber. The gas from the yeast is caught in this network as tiny pockets, and as more gas is produced, the pockets grow and the dough rises.

Bakers leave dough in a warm place because yeast works faster when it is warm. In the oven, the heat makes the gas grow even larger, so the bread rises again before the yeast dies and the outside turns hard and brown. The pockets stay inside, which is why a slice of good bread is so light and soft. Bread made from rice rises much less, because rice does not have the proteins needed to form gluten.`,
      grammar: ["main-idea", "supporting-details"],
      glossed: ["yeast", "gluten", "dough", "kneaded"],
      questions: [
        [
          ["What is the passage mainly about?", "这篇文章主要讲什么？"],
          ["How yeast and gluten work together to make bread rise", "酵母和面筋如何共同使面包发起来"],
          [
            ["How to bake bread at home", "如何在家烤面包"],
            ["Why bread made from rice is better", "为什么米做的面包更好"],
            ["Where yeast comes from", "酵母从哪里来"],
          ],
          [
            "The passage explains that yeast produces gas and gluten holds it, so the bread rises. It gives no instructions and does not say that rice bread is better.",
            "文章解释酵母产生气体、面筋留住气体，所以面包会发起来。文章没有给出做法，也没有说米面包更好。",
          ],
        ],
        [
          ["According to the passage, what is gluten?", "根据文章，面筋是什么？"],
          ["A network formed by two proteins in flour", "由面粉中两种蛋白质形成的网状结构"],
          [
            ["The gas that yeast gives off", "酵母放出的气体"],
            ["A kind of sugar in flour", "面粉中的一种糖"],
            ["The hard outside of the bread", "面包坚硬的外皮"],
          ],
          [
            'Two proteins in the flour "join together to form gluten, a network that can stretch like rubber."',
            "原文说面粉中的两种蛋白质“结合形成面筋，一种能像橡胶一样拉伸的网状结构”。",
          ],
        ],
        [
          ["Why do bakers leave dough in a warm place?", "面包师为什么把面团放在温暖的地方？"],
          ["Yeast works faster when it is warm", "酵母在温暖时作用更快"],
          [
            ["The outside of the bread turns brown", "面包外皮会变成棕色"],
            ["Gluten forms only when it is warm", "面筋只在温暖时形成"],
            ["The yeast dies more quickly", "酵母死得更快"],
          ],
          [
            '"Bakers leave dough in a warm place because yeast works faster when it is warm."',
            "原文说：“面包师把面团放在温暖的地方，因为酵母在温暖时作用更快。”",
          ],
        ],
        [
          ["What can be inferred about bread made from rice?", "关于米做的面包，可以推断出什么？"],
          ["It holds less gas than bread made from flour with gluten", "它留住的气体比有面筋的面粉做的面包少"],
          [
            ["It needs more yeast", "它需要更多的酵母"],
            ["It must be kneaded for longer", "它需要揉更久"],
            ["It cannot be baked in an oven", "它不能用烤箱烤"],
          ],
          [
            'Rice "does not have the proteins needed to form gluten", and without gluten nothing holds the gas, so the bread rises less.',
            "米“没有形成面筋所需的蛋白质”，没有面筋就留不住气体，所以面包发得更少。",
          ],
        ],
      ],
    }),
    passage({
      id: "toefl-reading-the-coral-and-the-alga",
      title: ["The Coral and the Alga", "珊瑚与藻类"],
      body: `Coral reefs look like rocks, but they are built by tiny animals called polyps, each no bigger than the end of a finger. A polyp has a soft body and builds a hard wall around itself from minerals in sea water. Over thousands of years, millions of these walls build up into a reef.

Coral reefs grow mostly in warm, clear water near the coast that is poor in food. They can survive there because of a partnership. Inside the body of each polyp live tiny plants called algae. Like other plants, the algae use the light of the sun to make food, and they share up to ninety percent of it with the coral. In return, the coral gives the algae a safe home and the waste that they need to grow.

This partnership is easily damaged. When the sea becomes too warm, the coral pushes the algae out of its body. Because the algae give the coral its color, the coral turns white, which is known as bleaching. If the water gets cool again quickly, the algae can return, but if the heat goes on for weeks, the coral may die from lack of food.`,
      grammar: ["main-idea", "supporting-details"],
      glossed: ["polyps", "polyp", "algae", "bleaching"],
      questions: [
        [
          ["What is the passage mainly about?", "这篇文章主要讲什么？"],
          ["The partnership between coral and algae, and how heat damages it", "珊瑚与藻类的共生关系，以及高温如何破坏它"],
          [
            ["How people build walls from coral", "人们如何用珊瑚建墙"],
            ["Why the sea is becoming warmer", "海水为什么变暖"],
            ["Where the largest coral reefs are", "最大的珊瑚礁在哪里"],
          ],
          [
            "The passage explains how reefs are built, how polyps and algae help each other, and what happens when the sea is too warm.",
            "文章说明珊瑚礁如何形成、珊瑚虫和藻类如何互相帮助，以及海水过热时会发生什么。",
          ],
        ],
        [
          ["What does the coral give the algae?", "珊瑚给藻类提供什么？"],
          ["A safe home and the waste they need to grow", "安全的家和它们生长所需的废物"],
          [
            ["Most of the food it makes", "它制造的大部分食物"],
            ["Its color", "它的颜色"],
            ["Light from the sun", "阳光"],
          ],
          [
            '"In return, the coral gives the algae a safe home and the waste that they need to grow." It is the algae that share food and give the coral its color.',
            "原文说珊瑚“给藻类一个安全的家和它们生长所需的废物”。分享食物、赋予颜色的是藻类。",
          ],
        ],
        [
          ["Why does coral turn white when the sea is too warm?", "海水过热时珊瑚为什么会变白？"],
          ["It has pushed out the algae that give it its color", "它把赋予它颜色的藻类排了出去"],
          [
            ["Its hard walls break apart", "它坚硬的外壁碎裂了"],
            ["The water becomes less clear", "海水变得不那么清澈"],
            ["It has eaten too much food", "它吃了太多食物"],
          ],
          [
            'The coral "pushes the algae out of its body. Because the algae give the coral its color, the coral turns white."',
            "原文说珊瑚“把藻类排出体外。因为藻类给了珊瑚颜色，珊瑚就变白了”。",
          ],
        ],
        [
          ["What can be inferred about coral that has turned white?", "关于已经变白的珊瑚，可以推断出什么？"],
          ["It can recover if the water cools quickly", "如果海水很快变凉，它可以恢复"],
          [
            ["It is always dead", "它一定已经死了"],
            ["It will grow faster than before", "它会比以前长得更快"],
            ["It no longer needs food", "它不再需要食物"],
          ],
          [
            '"If the water gets cool again quickly, the algae can return", so white coral is not always dead; it dies only if the heat goes on for weeks.',
            "原文说如果海水很快变凉，藻类就能回来，所以变白的珊瑚不一定死了；只有高温持续几周它才会死。",
          ],
        ],
      ],
    }),
  ],
};
