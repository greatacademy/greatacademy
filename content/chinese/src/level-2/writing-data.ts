// The paragraph writing topics of level 2 (docs/chinese-curriculum.md §8.4), ending units 6 and 12.

import { t } from "@ga/content";

import type { LevelWriting } from "../level-1/writing.ts";

/** writing are the paragraph writing topics of level 2. */
export const writing: readonly LevelWriting[] = [
  {
    unit: 6,
    title: t("My Day", "我的一天"),
    summary: t(
      "Write a paragraph in Chinese about a day, a routine or a home: what you do and where, told in time order.",
      "用中文写一段话，写一天的生活、每天做的事或者自己的家：做什么、在哪儿做，按时间顺序写。",
    ),
    criteria: ["zhl2-day-order", "zhl2-day-details", "zhl2-day-language"],
    minChars: 80,
    instance: t(
      "Take “我的一天”. A good paragraph follows the day from morning to night, a word of time leading each part: 早上六点半起床, 七点半去学校, 中午和同学在学校吃饭, 晚上和爸爸妈妈一起吃晚饭. It says what, where and with whom, and ends with how the day feels: 我的一天很忙，可是我很喜欢。",
      "比如《我的一天》：好的一段话从早上写到晚上，每部分前面都有表示时间的词：早上六点半起床，七点半去学校，中午和同学在学校吃饭，晚上和爸爸妈妈一起吃晚饭。写清楚做什么、在哪儿、和谁一起，最后说说这一天怎么样：“我的一天很忙，可是我很喜欢。”",
    ),
    points: [
      {
        suffix: "order",
        title: t("Telling It in Time Order", "按时间顺序写"),
        explanation: t(
          "Tell the things of a day **in the order they happen**, and let the reader see the order. Put a word of time at the front of the sentence: *早上七点我起床。中午我在学校吃饭。晚上我写作业。* Join two steps with 先……然后…… or ……以后: *我先刷牙，然后洗脸。吃完饭以后，我去公园。* Do not jump from the evening back to the morning.",
          "按**事情发生的先后**来写一天的事，让读者看得出顺序。把表示时间的词放在句子前面：“早上七点我起床。中午我在学校吃饭。晚上我写作业。”两件事连在一起，可以用“先……然后……”或者“……以后”：“我先刷牙，然后洗脸。吃完饭以后，我去公园。”不要从晚上又跳回早上。",
        ),
        question: t(
          "Write a paragraph in Chinese about the topic below. Tell it in time order, with words of time such as 早上, 然后 and 晚上.",
          "围绕下面的题目，用中文写一段话。按时间顺序写，用上“早上”“然后”“晚上”这样表示时间的词。",
        ),
        criteria: ["zhl2-day-order", "zhl2-day-language"],
        callout: t(
          "A word of time stands before the verb: 我早上七点起床 or 早上七点我起床, never 我起床早上七点.",
          "表示时间的词放在动词前面：说“我早上七点起床”或“早上七点我起床”，不说“我起床早上七点”。",
        ),
        plan: t(
          "List the parts of the day in order, and give each a word of time: 早上, 中午, 下午, 晚上.",
          "按顺序列出一天的几个时候，每个配上表示时间的词：早上、中午、下午、晚上。",
        ),
        check: t(
          "Mark the words of time: they run from morning to night, and each stands before its verb.",
          "把表示时间的词画出来：从早到晚排着，每个都在动词前面。",
        ),
      },
      {
        suffix: "details",
        title: t("Saying What You Do", "写清楚做什么"),
        explanation: t(
          "*我早上起床，然后去学校，然后回家。* says very little. For each part of the day say **what you do, where, and with whom**, and add one small thing: *中午我和同学在学校吃饭，我最喜欢吃鸡蛋面。* Words such as 每天, 常常 and 有时候 show what you do often. End with one sentence about how you find the day: *我的周末很忙，可是我很喜欢。*",
          "“我早上起床，然后去学校，然后回家。”这样写，读者知道得很少。一天的每个时候都写清楚**做什么、在哪儿、和谁一起**，再多写一点小事：“中午我和同学在学校吃饭，我最喜欢吃鸡蛋面。”用“每天”“常常”“有时候”说常做的事。最后用一句话说说你觉得这一天怎么样：“我的周末很忙，可是我很喜欢。”",
        ),
        question: t(
          "Write a paragraph in Chinese about the topic below. Say what you do, where and with whom.",
          "围绕下面的题目，用中文写一段话。写清楚做什么、在哪儿做、和谁一起做。",
        ),
        criteria: ["zhl2-day-details", "zhl2-day-language"],
        callout: t(
          "Do not join every step with 然后: three in a row read like a list. Vary them with ……以后, 先……再…… or a new word of time.",
          "不要每一步都用“然后”：连着三个“然后”，读起来像清单。可以换成“……以后”“先……再……”或者新的时间词。",
        ),
        plan: t(
          "For each part of the day, note what you do, where, and with whom, and one small thing you like.",
          "每个时候都记下做什么、在哪儿、和谁一起，再加一件你喜欢的小事。",
        ),
        check: t(
          "Ask of each part whether it says what, where and with whom, then find the last sentence about how the day feels.",
          "问问每一部分：写了做什么、在哪儿、和谁一起吗？再找到最后说这一天怎么样的那句话。",
        ),
      },
    ],
    bank: [
      {
        task: "我的一天",
        model:
          "我每天早上六点半起床。起床以后，我先刷牙、洗脸，然后吃早饭。我常常喝一杯牛奶，吃一个鸡蛋。七点半我走路去学校，八点上课。中午我和同学在学校吃饭。下午四点下课，回家以后我先休息一会儿，然后写作业。晚上七点，我和爸爸妈妈一起吃晚饭，吃完饭我们一起看电视。九点半我洗澡，十点睡觉。我的一天很忙，可是我很喜欢。",
      },
      {
        task: "星期六和星期天",
        model:
          "星期六早上我八点才起床，因为不用上学。吃完早饭以后，我和妈妈一起打扫房间：我扫地，妈妈洗衣服。中午我们在家吃饭，爸爸做的鱼非常好吃。下午我和朋友去公园打球，我们玩了两个小时。晚上我先写作业，然后看了一个电影。星期天上午我去奶奶家，下午在家看书。这两天不忙，我觉得很舒服。",
      },
      {
        task: "我的家",
        model:
          "我家住在城市的北边，在一个大楼的十二层。我家有三个房间，还有一个客厅和一个厨房。客厅很大，里面有一张桌子、四把椅子和一个电视。我的房间不大，可是很安静，窗前有一张小桌子，我每天在那儿写作业。厨房里有一个大冰箱。我们的邻居都很好，附近有商店和公园，非常方便。我很喜欢我的家。",
      },
      {
        task: "我的房间",
        model:
          "我的房间在家的左边，不大，可是很干净。进门以后，右边是我的床，床是蓝色的。窗前有一张桌子和一把椅子，桌子上有一个灯和很多书。每天晚上我在这儿写作业。早上起床以后，我先收拾床，然后打开窗。星期六我自己打扫房间，把书和衣服都放好。我的房间是我最喜欢的地方。",
      },
      {
        task: "星期天上午",
        model:
          "星期天上午我起得很晚，九点才起床。起床以后，我先刷牙、洗脸，然后和爸爸一起做早饭。我们做了鸡蛋和面包，妈妈说很好吃。吃完早饭，我帮妈妈洗碗，然后收拾我的房间。十点半我和妹妹去附近的商店买水果，我们买了苹果和西瓜。回家以后，我在客厅看了一会儿书。十二点我们一起吃午饭。这个上午过得很快。",
      },
      {
        task: "上学以前",
        model:
          "我每天早上六点起床，起床以后先去洗澡，然后刷牙、洗脸。六点二十分，我穿好衣服，看看今天的天气。如果下雨，我就带上雨衣。六点半我吃早饭，妈妈常常给我做面条，有时候是饺子。吃完早饭以后，我准备好今天的书和笔，放进书包里。七点我和爸爸一起出门，他开车送我去学校。路上我们常常听歌。",
      },
      {
        task: "去饭馆吃饭",
        model:
          "上个星期六晚上，我们一家人去饭馆吃饭。六点我们到了饭馆，服务员给了我们一张窗边的桌子。我们先看菜单，然后点菜。爸爸点了一条鱼，妈妈点了一个汤，我点了我最喜欢的饺子。等了十分钟，菜就来了。鱼有一点儿辣，汤很鲜，饺子非常香。吃完饭以后，爸爸给了钱，我们走路回家。我吃得很饱，觉得这一天过得真好。",
      },
      {
        task: "买衣服",
        model:
          "上个星期天，我和妈妈去商店买衣服。我们上午十点到了商店。我们先看裙子，我喜欢一条蓝色的裙子，穿上以后很合适，也很漂亮。然后我们去看鞋，妈妈给我买了一双白色的鞋。中午我们在商店附近吃了饭，下午又给爸爸买了一条裤子。四点我们回家了。这些衣服不太贵，我很喜欢。",
      },
      {
        task: "爸爸的一天",
        model:
          "我爸爸是一个医生，他每天都很忙。早上六点他就起床，先在楼下跑半个小时，然后吃早饭。七点半他坐地铁去医院，八点上班。上午他给很多病人检查身体，有时候中午也不能休息。下午他还要开会、用电脑写东西。晚上六点他回家，和我们一起吃晚饭。吃完饭，他常常看一会儿书。十一点他睡觉。我觉得爸爸很累，可是他很爱他的工作。",
      },
      {
        task: "在办公室的一天",
        model:
          "我姐姐在一家公司工作，她的办公室在十层。她每天八点半到公司，先喝一杯咖啡，然后打开电脑看信。九点她和同事们一起开会，介绍这个星期的工作。中午她和同事去附近的饭馆吃饭。下午她给客人打电话，还要写很多东西。五点半下班以后，她坐地铁回家。晚上她常常去公园打球。她说工作很忙，可是同事都很好。",
      },
      {
        task: "我生病的那天",
        model:
          "上个星期三早上，我起床以后觉得头很疼，也不想吃饭。妈妈说我发烧了，我就没去学校。八点妈妈带我去医院，医生给我检查了身体，说我感冒了，要多喝水，多休息。回家以后，我吃了药，然后在床上睡了一个上午。中午妈妈给我做了鸡蛋汤。下午我觉得好一点儿了，看了一会儿书。晚上我很早就睡觉了。第二天我的病就好了。",
      },
      {
        task: "为了身体健康，我每天做什么",
        model:
          "为了身体健康，我每天都早睡早起。我早上六点起床，起床以后先喝一杯水，然后去公园跑二十分钟。早饭我吃鸡蛋、面包和水果，不喝甜的东西。中午我在学校吃饭，多吃菜，少吃肉。下午下课以后，我常常和同学打球。晚上我不玩电脑，九点半就睡觉。现在我很少生病，也比以前瘦了一点儿。我觉得这样做很好。",
      },
    ],
  },
  {
    unit: 12,
    title: t("A Message to a Friend", "给朋友留言"),
    summary: t(
      "Write a short note or text message in Chinese to a friend about a plan, a trip or a festival: whom it is for, what the plan is, and who wrote it.",
      "用中文给朋友写一个留言或者短信，说一个计划、一次旅游或者一个节日：写给谁，计划是什么，是谁写的。",
    ),
    criteria: ["zhl2-message-form", "zhl2-message-plan", "zhl2-message-language"],
    minChars: 80,
    instance: t(
      "Take an invitation to climb a hill on Saturday. The message opens with the friend's name and a colon, 小明：; says what, when and where, 星期六早上八点，我们在学校门口见面; says what to bring and asks 你能去吗？; and ends with who wrote it.",
      "比如请朋友星期六一起去爬山：短信开头写朋友的名字和冒号“小明：”；说清楚做什么、什么时候、在哪儿：“星期六早上八点，我们在学校门口见面”；再说带什么，问一句“你能去吗？”；最后写上自己的名字。",
    ),
    points: [
      {
        suffix: "form",
        title: t("The Form of a Message", "留言的格式"),
        explanation: t(
          "A note or a text message has a form of its own. The first line names the friend, followed by a colon: *小明：* or *李红，你好！* Then say why you write, in a few short sentences. The last lines say who wrote it, and a note left on a table also gives the time: *小东* on one line, *五月三日下午* on the next. Write to a friend as you would talk to them, with 你, and end kindly: *等你的回信！*",
          "留言和短信有自己的格式。第一行写朋友的名字，后面加冒号：“小明：”或者“李红，你好！”。然后用几句简单的话说清楚为什么写。最后写上是谁写的；留在桌子上的留言还要写时间：一行写“小东”，下一行写“五月三日下午”。给朋友写，就像和他说话一样，用“你”，最后可以说一句好听的话：“等你的回信！”",
        ),
        question: t(
          "Write a short message in Chinese for the situation below. Name the friend at the top and yourself at the end.",
          "根据下面的情况，用中文写一个留言或者短信。开头写朋友的名字，最后写上你的名字。",
        ),
        criteria: ["zhl2-message-form", "zhl2-message-language"],
        callout: t(
          "Without your name at the end the friend may not know who wrote; and a note left on a table needs the time too, or they cannot tell whether the plan has passed.",
          "最后不写名字，朋友可能不知道是谁写的；留在桌子上的便条还要写时间，不然朋友不知道约的事过去了没有。",
        ),
        plan: t(
          "Write the friend's name with a colon, decide the few sentences that say why you write, then add your name.",
          "先写朋友的名字和冒号，再想好说明来意的几句话，最后写自己的名字。",
        ),
        check: t(
          "Find the three parts: the friend's name at the top, the message, and your name at the end, with the time on a note.",
          "找出三个部分：开头朋友的名字，中间的话，最后你的名字；便条还要有时间。",
        ),
      },
      {
        suffix: "plan",
        title: t("Making the Plan Clear", "把计划说清楚"),
        explanation: t(
          "A friend who reads your message must know **what, when and where**, and what you want them to do. *我们星期六去爬山吧！* is not enough. Add the time and the place: *星期六早上八点，我们在学校门口见面。* Say what to bring: *别忘了带水和吃的。* Then ask: *你能去吗？* or *你去不去？* If the plan changes, say why: *我感冒了，所以明天不能去了。*",
          "朋友看了你的留言，要知道**做什么、什么时候、在哪儿**，还要知道你想让他做什么。只写“我们星期六去爬山吧！”还不够。要写上时间和地方：“星期六早上八点，我们在学校门口见面。”说说要带什么：“别忘了带水和吃的。”再问一问：“你能去吗？”或者“你去不去？”如果计划变了，要说为什么：“我感冒了，所以明天不能去了。”",
        ),
        question: t(
          "Write a short message in Chinese for the situation below. Say clearly what the plan is, when and where.",
          "根据下面的情况，用中文写一个留言或者短信。把计划说清楚：做什么、什么时候、在哪儿。",
        ),
        criteria: ["zhl2-message-plan", "zhl2-message-language"],
        callout: t(
          "“星期六见！” is friendly but leaves the friend asking when and where. A plan needs a time and a place the friend can act on.",
          "“星期六见！”很亲切，可朋友还是不知道几点、在哪儿。约定要有朋友能照着做的时间和地点。",
        ),
        plan: t(
          "Write down what, when and where, what to bring, and the question you will ask.",
          "写下做什么、什么时候、在哪儿、要带什么，以及你要问的话。",
        ),
        check: t(
          "Read it as the friend: you know what to do, when, where and what to bring, and there is a question to answer.",
          "站在朋友的角度读：知道做什么、什么时候、在哪儿、带什么，还有一个要回答的问题。",
        ),
      },
    ],
    bank: [
      {
        task: "你想请朋友这个星期六和你一起去爬山。给他写一个短信。",
        model:
          "小明：\n你好！这个星期六天气很好，不冷也不热，我想请你和我一起去爬山。我们早上八点在学校门口见面，然后坐地铁去山下，九点上山。山上的风景很美，有很多花和树，我们还可以拍照片。别忘了带水和吃的，还要穿舒服的鞋。下午四点以前我们就能回家。你能去吗？等你的回信！\n小东",
      },
      {
        task: "你和家人下个月去南方旅游。给朋友写一个短信，告诉他你的计划。",
        model:
          "李红：\n你好！告诉你一件高兴的事：下个月我和爸爸妈妈要去南方旅游！我们计划七月三号坐飞机去，在那儿玩五天。我们想去看海，还想去爬山，吃那儿的好菜。我们住在海边的一个宾馆，从房间的窗前就能看见大海。我一定给你拍很多照片。你想要什么东西吗？我给你带回来。\n小美",
      },
      {
        task: "朋友请你明天去他家，可是你生病了，不能去。给他写一个短信。",
        model:
          "小林：\n你好！真对不起，明天我不能去你家玩了。今天早上我起床以后，觉得头疼，还有一点儿发烧。妈妈带我去了医院，医生说我感冒了，这两天要在家休息。我也很想去你家，和你一起看电影、听歌。下个星期六我们再一起玩，好吗？你别生气啊！\n大海\n星期五晚上",
      },
      {
        task: "春节快到了，你想请朋友来你家过节。给她写一个短信。",
        model:
          "方方：\n你好！春节快到了，我爸爸妈妈想请你来我家过节。大年三十晚上，我们一家人一起吃饭，还要包饺子。你没包过饺子吧？我和妈妈帮你包，很简单！吃完饭，我们一起看电视里的节目，这是很多中国人过春节一定要做的事。你六点来就可以，我家离你家不远，走路十分钟就到。你能来吗？我们都希望你来！\n小雪",
      },
      {
        task: "你去朋友家，他不在。给他写几句话，放在他的桌子上。",
        model:
          "小文：\n我下午三点来找你，你不在家，你妈妈说你去打球了。我来还你的两本书，书已经放在你的桌子上了。谢谢你，这两本书都非常有意思！还有一件事：明天下午我们班有篮球比赛，你能来看吗？比赛四点在学校的大球场。回来以后给我打个电话吧。\n小天\n十月八日下午",
      },
      {
        task: "中秋节到了，你在外国，想给中国的朋友写一个短信。",
        model:
          "李明：\n你好！今天是中秋节，祝你和你的家人中秋节快乐！我现在在美国，这儿的人不过中秋节，可是我和几个中国同学一起买了月饼，晚上我们还要去公园看月亮。今天的月亮又大又亮，真漂亮。我很想家，也很想你们。你今天做什么了？吃了什么月饼？给我发几张照片吧！\n小明",
      },
      {
        task: "你想请朋友星期天下午来看你的足球比赛。给他写一个短信。",
        model:
          "小东：\n你好！这个星期天下午我们学校有足球比赛，我也参加。比赛在下午两点，在学校的足球场。我们练了两个月，大家都很想赢。你能来看我们比赛吗？你可以坐地铁来，在学校站下车，走五分钟就到了。比赛完了以后，我们一起去吃饭吧，我请你！你来的话，给我发个短信。\n大山",
      },
      {
        task: "朋友的生日快到了，你想和同学们一起给他过生日。给一个同学写一个短信。",
        model:
          "小美：\n你好！下个星期二是小天的生日，我想和你们几个同学一起给他过生日。我们星期二下午五点在学校附近的那个咖啡馆见面，我已经订好了桌子。我买蛋糕，你能买一个生日礼物吗？他非常喜欢踢足球，你可以买一个足球。别告诉小天啊，我们想让他高兴一下。你觉得这个计划怎么样？\n方方",
      },
      {
        task: "你明天要和朋友去公园，可是天气变了。给朋友写一个短信，说说新的计划。",
        model:
          "小雪：\n你好！我刚看了电视上的天气，明天有大雨，还要刮风，我们不能去公园了。我们换一个计划吧：明天上午十点你来我家，我们一起在家看电影、做蛋糕，好吗？我妈妈说她可以帮我们。如果后天天晴了，我们再去公园。你觉得怎么样？给我回个短信吧。\n李红",
      },
      {
        task: "你和朋友想星期六一起去看电影。给他写一个短信，说说时间和地方。",
        model:
          "小文：\n你好！听说最近有一个新电影很好看，是讲一只小狗的故事。这个星期六晚上你有时间吗？我们一起去看吧。电影是七点的，在城市中心的那个电影院。我们六点半在电影院门口见面，好吗？票我已经在网上买好了，你不用买。看完电影，我们可以去吃点儿东西。等你的回信！\n小林",
      },
      {
        task: "朋友这个星期六要去旅游，你想请他帮你买一个东西。给他写一个短信。",
        model:
          "大海：\n你好！听说你这个星期六要去北京旅游，真好！我想请你帮我一个忙：我妈妈非常喜欢北京的茶，你能帮我买一点儿吗？不用太贵的，一百块钱左右就可以，钱我回来以后给你。如果不方便，就不用买了。祝你玩得高兴！别忘了多拍几张照片，回来给我看看。\n大山\n星期四晚上",
      },
      {
        task: "新年快到了，你想请同学们来你家一起过新年。给大家写一个短信。",
        model:
          "大家好：\n新年快到了！十二月三十一日晚上，我想请大家来我家一起过新年。大家七点来，我们一起吃饭、唱歌、玩，十二点的时候一起说“新年快乐”！我家在学校南边的那个大楼里，十五层。你们每个人可以带一个小礼物，我们一起换礼物，一定很有意思。能来的同学请在星期五以前告诉我。\n小美",
      },
    ],
  },
];
