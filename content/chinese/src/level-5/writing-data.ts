// The paragraph writing topics of level 5 (docs/chinese-curriculum.md §8.4), ending units 6 and 12.

import { t } from "@ga/content";

import type { LevelWriting } from "../level-1/writing.ts";

/** writing are the paragraph writing topics of level 5. */
export const writing: readonly LevelWriting[] = [
  {
    unit: 6,
    title: t("A Letter or an Email", "写信或者邮件"),
    summary: t(
      "Write a letter or an email in Chinese to a teacher, a school, a company or an office: with the right opening and closing, and a clear request.",
      "用中文给老师、学校、公司或者办公室写信或者邮件：开头和结尾的格式要对，要求要说清楚。",
    ),
    criteria: ["zhl5-letter-form", "zhl5-letter-request", "zhl5-letter-language"],
    minChars: 150,
    instance: t(
      "Take a letter asking the class teacher for leave from Monday's test. It opens 王老师： and 您好！; says who you are and why you write, 我是三年级二班的学生李明; gives the facts, the illness and the doctor's advice, and asks exactly, 希望能补考; and ends with 祝您工作顺利！, your name and the date.",
      "比如给班主任写信，请假不参加星期一的考试：开头写“王老师：”和“您好！”；说明你是谁、为什么写信：“我是三年级二班的学生李明”；写出事实，生了什么病、医生怎么说，再明确提出请求：“希望能补考”；结尾写“祝您工作顺利！”，再署名、写日期。",
    ),
    points: [
      {
        suffix: "form",
        title: t("Opening and Closing", "开头和结尾"),
        explanation: t(
          "A letter to a teacher or an office has a fixed form. The **first line** names the reader with a colon: *王老师：* *尊敬的张经理：* *图书馆的老师：* The next line greets: *您好！* At the end comes a wish of its own: *祝您工作顺利！* or *祝您身体健康！* Last come your name, with who you are if the reader does not know you, and the date: *三年级二班 李明* / *五月十日*. Use 您 throughout.",
          "写给老师或者办公室的信有固定的格式。**第一行**写对方的称呼，后面加冒号：“王老师：”“尊敬的张经理：”“图书馆的老师：”。下一行问好：“您好！”。最后写一句祝愿的话：“祝您工作顺利！”或者“祝您身体健康！”。再写上你的名字；如果对方不认识你，还要写上你是谁；最后写日期：“三年级二班 李明”“五月十日”。信里要一直用“您”。",
        ),
        question: t(
          "Write a letter or an email in Chinese for the situation below. Give it the right opening and closing.",
          "根据下面的情况，用中文写信或者邮件。开头和结尾的格式要对。",
        ),
        criteria: ["zhl5-letter-form", "zhl5-letter-language"],
        callout: t(
          "To a teacher or an office, 你 is too familiar: use 您 throughout, and a wish such as 祝您工作顺利！, not 再见.",
          "给老师或单位写信，用“你”太随便：从头到尾用“您”，结尾用“祝您工作顺利！”这样的祝福语，不用“再见”。",
        ),
        plan: t(
          "Set out the reader's name with a colon, the greeting, the body, the wish, your name and the date.",
          "排好称呼和冒号、问候语、正文、祝福语、署名和日期。",
        ),
        check: t(
          "Go through the form line by line, and find 您 wherever you speak to the reader.",
          "一行一行对格式；凡是称呼对方的地方，都用了“您”。",
        ),
      },
      {
        suffix: "request",
        title: t("Making the Request Clear", "把要求说清楚"),
        explanation: t(
          "Say early **who you are and why you write**: *我是三年级二班的学生李明，想向您申请……* Then give what the reader needs to decide: the facts, the reasons, the dates. Say exactly what you ask for: not *希望学校想想办法*, but *希望图书馆晚上能开到九点*. A polite word helps: *如果可以的话，……* *麻烦您……* End by thanking the reader and saying how they can answer: *盼望您的回复。*",
          "一开始就说清楚**你是谁、为什么写信**：“我是三年级二班的学生李明，想向您申请……”然后写对方做决定需要知道的事：事实、理由、日期。要求要说得具体：不要只写“希望学校想想办法”，要写“希望图书馆晚上能开到九点”。用一些客气的话：“如果可以的话，……”最后感谢对方，说说怎么回复你：“希望能收到您的回复。”",
        ),
        question: t(
          "Write a letter or an email in Chinese for the situation below. Say who you are, why you write and exactly what you ask for.",
          "根据下面的情况，用中文写信或者邮件。说清楚你是谁、为什么写信、具体要求是什么。",
        ),
        criteria: ["zhl5-letter-request", "zhl5-letter-language"],
        callout: t(
          "A vague request cannot be granted: 希望您帮帮我 leaves the reader asking with what. Say exactly what you want and by when.",
          "笼统的请求没法答应：“希望您帮帮我”，对方还是不知道帮什么。要说清楚你要什么、什么时候要。",
        ),
        plan: t(
          "Write who you are and why you write, list the facts the reader needs, and put the request in one exact sentence.",
          "写出你是谁、为什么写信，列出对方需要的事实，再用一句明确的话提出请求。",
        ),
        check: t(
          "Find the request: it says exactly what you ask for, the facts before it support it, and the letter ends with thanks.",
          "找到请求：说清楚了要什么，前面的事实支持它，结尾有感谢。",
        ),
      },
    ],
    bank: [
      {
        task: "你生病了，下星期一的考试不能参加。给班主任写信请假。",
        model:
          "王老师：\n您好！\n我是您班上的学生李明。很不好意思要告诉您，我从昨天晚上开始发高烧，今天去医院检查，医生说是流感，需要在家休息三到五天，不能去学校。所以，下星期一的数学考试我没有办法参加了。随信附上医生的证明。\n我想问一下，我病好以后，能不能补考？如果可以的话，请您告诉我补考的时间。这几天的作业，我会请同学帮我带回家，尽量跟上大家。让您费心了，非常感谢您！\n祝您工作顺利！\n学生：李明\n十一月八日",
      },
      {
        task: "学校图书馆晚上六点就关门。给校长写信，建议延长开放时间。",
        model:
          "尊敬的校长：\n您好！\n我是高二三班的学生张文。我想向您提一个关于学校图书馆的建议。\n现在，图书馆每天晚上六点就关门了。可是我们下午五点半才下课，吃完晚饭以后，就没有地方安静地看书和写作业了。很多同学家里地方小，也很吵。而且，考试以前，大家更需要一个可以安静学习的地方。\n所以，我建议图书馆晚上能开到九点。如果老师不够，我和几个同学愿意做志愿者，帮忙管理借书和还书。希望您能认真想一想我们的建议。\n祝您身体健康！\n学生：张文\n三月十五日",
      },
      {
        task: "学校食堂的菜不太健康。给学校写信，提出你的建议。",
        model:
          "尊敬的学校领导：\n您好！\n我是初三一班的学生林小雨。我每天中午都在学校食堂吃饭，有一件事想和您说一说。\n最近，食堂的饭菜油很多，味道也很重，而且肉多菜少。很多同学吃完以后觉得不舒服，有的同学就不吃了，下午上课就饿了。我们正在长身体，需要健康的饭菜。\n我有两个建议：第一，每天多做两个素菜，做菜的时候少放油；第二，在食堂放一个意见本，让同学们写下自己的想法。我相信这样做，大家会吃得更好、更健康。谢谢您！\n祝您工作顺利！\n学生：林小雨\n四月二日",
      },
      {
        task: "你家楼下的路灯坏了一个月。给社区办公室写信，请他们来修。",
        model:
          "社区办公室的工作人员：\n您好！\n我是住在幸福小区五号楼的居民李方。我给您写信，是想请您帮忙解决一个问题。\n我们楼下那条路上有两个路灯，已经坏了一个多月了。晚上那条路很黑，老人和孩子走路很不安全。上个星期，一位老奶奶在那儿摔了一下，腿受了伤。很多邻居都很担心。\n希望您能早一点儿让人来检查和修理这两个路灯。如果需要我们帮忙，可以给我打电话。非常感谢您！\n祝您工作顺利！\n居民：李方\n十月二十日",
      },
      {
        task: "你想在暑假去一家科技公司实习。给公司写邮件申请。",
        model:
          "尊敬的公司负责人：\n您好！\n我是一名大学二年级的学生，名叫林明，学的是电脑专业。我在网上看到贵公司今年暑假招实习生，非常希望能有这个机会。\n我对软件开发很感兴趣，学过三门编程课，成绩都在九十分以上。去年，我还和同学一起做了一个帮老人用手机的小程序，有一千多人下载。我做事认真，也喜欢和别人一起工作。\n我七月一日到八月三十日都可以来实习。我的个人材料在附件里，请您看一看。如果有机会面试，我会非常高兴。谢谢您！\n祝贵公司发展顺利！\n林明\n五月六日",
      },
      {
        task: "你在网上买的耳机坏了。给那家公司写邮件，要求换一个新的。",
        model:
          "您好！\n我是贵公司的客户王小东。我在五月三日在贵公司的网店买了一个蓝色的耳机，订单的号码在附件里。\n耳机是五月五日收到的。可是我只用了三天，左边的耳机就没有声音了。我没有把耳机摔在地上，也没有让耳机进水。我已经拍了照片和一个小视频，放在附件里，请您看一看。\n这个耳机还在保修期里。我希望贵公司能给我换一个新的耳机，如果不能换，就请给我退款。请您在一个星期以内给我回复。谢谢！\n祝您工作顺利！\n王小东\n五月九日",
      },
      {
        task: "你所在的城市很少有自行车道。给市政府写信，提出建议。",
        model:
          "尊敬的市政府领导：\n您好！\n我是一名中学生，住在城东区。我每天骑自行车上学，有一个问题想向您说一说。\n我们城市的很多大街上没有自行车道，自行车只能和汽车在一条路上走，非常危险。上个月，我的一个同学就在上学的路上被汽车刮了一下，腿受了伤。很多家长因为不放心，就开车送孩子上学，这让路上更堵了，空气也更差了。\n我建议，在学校附近的几条大街上先修自行车道，用颜色把自行车道和汽车道分开。这样做，又安全又环保。希望您能认真想一想我的建议。\n祝您工作顺利！\n城东中学学生：张小山\n六月十二日",
      },
      {
        task: "学校要找学生在星期六去养老院做志愿者。给负责的老师写信报名。",
        model:
          "李老师：\n您好！\n我是初二四班的学生林小美。我看到学校的通知，说要找同学在星期六去养老院做志愿者，我很想报名参加。\n我觉得关心老人是每个人应该做的事。我奶奶也住在养老院，我常常去看她，知道老人们最需要的是有人陪他们聊天儿。我会弹钢琴，也会唱很多老歌，可以给老人们表演。另外，我每个星期六上午都有时间。\n如果您同意，请告诉我什么时候去、要准备什么。我一定会认真做好。谢谢您！\n祝您身体健康！\n学生：林小美\n九月五日",
      },
      {
        task: "你家附近的小河被污染了。给环境保护部门写信。",
        model:
          "环境保护部门的工作人员：\n您好！\n我是住在河东小区的居民张明。我想告诉您一个环境问题。\n我家附近有一条小河，以前河水很清，夏天还有很多孩子在河边玩。可是最近两个月，河水变成了黑色，也很臭，河里的鱼死了很多。我发现，河的上游有一家小工厂，每天晚上都把废水放进河里。\n希望您能让人来调查一下，如果真是这家工厂污染了河水，请让他们马上停止。附件里有我拍的照片和视频。如果需要更多的情况，可以给我打电话。谢谢您！\n祝您工作顺利！\n居民：张明\n七月十八日",
      },
      {
        task: "你想去中国的一所大学学汉语。给这所大学的留学生办公室写邮件，问一问申请的事。",
        model:
          "尊敬的留学生办公室老师：\n您好！\n我叫大卫，是一名德国学生，今年二十岁。我学了两年汉语，现在能说一些简单的中文。我非常喜欢中国文化，希望明年九月能到贵校学习汉语一年。\n我想问您几个问题：第一，申请汉语进修课需要准备哪些材料？第二，申请的最后日期是什么时候？第三，学校有没有给留学生的宿舍？一个月的费用大概是多少？第四，学校有没有奖学金？\n请您在方便的时候给我回复。非常感谢您！\n祝您工作顺利！\n大卫\n十一月二日",
      },
      {
        task: "你们班想去博物馆参观。给博物馆写信，问一问能不能安排讲解。",
        model:
          "尊敬的博物馆负责人：\n您好！\n我是阳光中学初一三班的班长林明。我们班正在学习中国古代历史，老师和同学们都很想去贵馆参观。\n我们计划在下个月十五日，也就是星期五的上午九点到馆，一共有四十二名学生和两位老师。我们特别想看古代文字和古代生活用品的展览。请问那天能不能为我们安排一位讲解员？如果需要付费，请告诉我们多少钱。另外，我们想知道参观的时候能不能拍照。\n希望能收到您的回复。您也可以给我们的班主任打电话。谢谢您！\n祝您工作顺利！\n阳光中学初一三班 林明\n三月一日",
      },
      {
        task: "你要申请一个夏天的科学课，需要老师写信介绍你。给你的老师写信，请他帮忙。",
        model:
          "高老师：\n您好！\n我是您去年教过的学生李小天。好久没见了，您最近身体好吗？\n我写信是想请您帮我一个忙。今年夏天，一所大学有一个给中学生的科学课，有很多实验，我非常想参加。申请的时候需要一位老师写信介绍我，我第一个就想到了您。去年在您的物理课上，我做了一个关于太阳能的小研究，您给了我很多帮助，也最了解我。\n申请的最后日期是四月三十日。如果您有时间，能不能在四月二十日以前帮我写好？我会把需要的材料发给您。让您费心了，谢谢您！\n祝您工作顺利、身体健康！\n学生：李小天\n四月二日",
      },
    ],
  },
  {
    unit: 12,
    title: t("Introducing a Custom or a Dish", "介绍一个习俗或者一道菜"),
    summary: t(
      "Write in Chinese to introduce a tradition, a festival custom or a dish: what it is, how it is done or made, and what it means.",
      "用中文介绍一个传统、一个节日的习俗或者一道菜：它是什么，怎么做，有什么意义。",
    ),
    criteria: ["zhl5-custom-what", "zhl5-custom-meaning", "zhl5-custom-language"],
    minChars: 150,
    instance: t(
      "Take “春节包饺子”. It says what it is and when: 饺子是中国北方人最喜欢的食物之一，春节的时候家家都吃。 It says how it is made, in order: 先和面、做馅儿，然后包，最后煮。 And it says what it means: the family together, and wishes for the new year.",
      "比如《春节包饺子》：先说它是什么、在什么时候：“饺子是中国北方人最喜欢的食物之一，春节的时候家家都吃。”再按顺序写怎么做：“先和面、做馅儿，然后包，最后煮。”最后写它的意义：全家团聚，对新年的祝愿。",
    ),
    points: [
      {
        suffix: "what",
        title: t("What It Is and How It Is Done", "是什么、怎么做"),
        explanation: t(
          "Introduce the thing to a reader who has **never seen it**. Say first what it is and when or where it belongs: *饺子是中国北方人最喜欢的食物之一，春节的时候家家都吃。* Then say what people do, or how it is made, in order: *先和面、做馅儿，然后把馅儿包进皮里，最后放进开水里煮。* Concrete details make it real: what it looks like, what it tastes like, who takes part.",
          "把它介绍给一个**从来没见过**的人。先说它是什么，在什么时候或者什么地方有：“饺子是中国北方人最喜欢的食物之一，春节的时候家家都吃。”然后按顺序说人们做什么，或者它是怎么做的：“先和面、做馅儿，然后把馅儿包进皮里，最后放进开水里煮。”具体的细节让介绍更真实：它是什么样子，什么味道，有谁参加。",
        ),
        question: t(
          "Write in Chinese to introduce the custom or dish below. Say what it is, and how it is done or made.",
          "用中文介绍下面的习俗或者菜。说清楚它是什么、怎么做。",
        ),
        criteria: ["zhl5-custom-what", "zhl5-custom-language"],
        callout: t(
          "Write for a reader who has never seen it: 大家都知道饺子 skips what you should explain. Say what it looks like and tastes like.",
          "要写给从没见过的人看：“大家都知道饺子”就把该说明的跳过去了。要写出它的样子和味道。",
        ),
        plan: t(
          "Say what the thing is and when it belongs in one sentence, then list the steps of doing or making it in order.",
          "用一句话说出它是什么、在什么时候，再按顺序列出做法的几步。",
        ),
        check: t(
          "Read it as someone who has never seen it: they could picture it, and the steps come in order.",
          "站在没见过的人的角度读：能想象出它的样子，做法的步骤没有乱。",
        ),
      },
      {
        suffix: "meaning",
        title: t("What It Means", "有什么意义"),
        explanation: t(
          "A custom lasts because it **means** something. Tell what it stands for or what people wish for by it: *月饼是圆的，圆代表团圆。* *过生日吃长寿面，是希望老人健康长寿。* Say where it comes from if you know, and what it means to you or your family: *对我来说，包饺子最重要的不是吃，而是全家人在一起。* Words such as 代表, 表示, 象征 and 希望 help.",
          "一个习俗能一直传下来，是因为它有**意义**。说说它代表什么，或者人们用它表达什么愿望：“月饼是圆的，圆代表团圆。”“过生日吃长寿面，是希望老人健康长寿。”知道的话，可以说说它是从哪儿来的，还可以说说它对你或者你家有什么意义：“对我来说，包饺子最重要的不是吃，而是全家人在一起。”“代表”“表示”“象征”“希望”这些词很有用。",
        ),
        question: t(
          "Write in Chinese to introduce the custom or dish below. Explain what it means or why people keep it.",
          "用中文介绍下面的习俗或者菜。说清楚它有什么意义，或者人们为什么一直这样做。",
        ),
        criteria: ["zhl5-custom-meaning", "zhl5-custom-language"],
        callout: t(
          "A meaning must be one people hold, not one you invent. 月饼是圆的，圆代表团圆 is what people say; if you are not sure where a custom comes from, leave the origin out.",
          "意义要是大家公认的，不能自己编。“月饼是圆的，圆代表团圆”是大家的说法；不确定一个习俗的来历，就不写来历。",
        ),
        plan: t(
          "Note what the custom stands for or wishes for, with 代表, 表示 or 希望, and what it means to you or your family.",
          "用“代表”“表示”“希望”记下这个习俗象征什么、寄托了什么愿望，再想想它对你或你家意味着什么。",
        ),
        check: t(
          "Find the sentence of meaning and the sentence of what it means to you, and check that the meaning is one people really hold.",
          "找出写意义的句子和写对你意味着什么的句子，再核对：这个意义是大家真正公认的。",
        ),
      },
    ],
    bank: [
      {
        task: "春节包饺子",
        model:
          "在中国北方，春节的时候家家都要包饺子。大年三十下午，全家人坐在一起，有的切菜切肉，有的做饺子皮。然后大家一起把菜和肉包进皮里，包成一个个小元宝的样子。晚上十二点以前，把饺子放进开水里煮，煮好以后全家人一起吃。\n为什么春节要吃饺子呢？因为饺子的样子像古代的钱，吃饺子表示希望新的一年有很多钱，生活越来越好。有的人家还会在一个饺子里放一块糖，谁吃到了，谁新的一年就会特别甜。对我来说，包饺子最重要的不是吃，而是全家人在一起说说笑笑。",
      },
      {
        task: "中秋节吃月饼",
        model:
          "中秋节在农历八月十五，是中国一个很重要的传统节日。这一天的月亮又大又圆，人们常常全家一起吃晚饭，然后坐在外面一边赏月，一边吃月饼。\n月饼是圆的，里面有各种各样的东西，有甜的豆沙，也有咸的蛋黄和肉。月饼的圆和月亮的圆一样，代表着团圆。所以，中秋节也叫“团圆节”。在外地工作和学习的人，这一天都很想家，有的人会坐很远的车回家，有的人会给家人打电话。人们还常常把月饼送给亲戚朋友，表示祝福。对很多中国人来说，月饼的味道就是家的味道。",
      },
      {
        task: "端午节",
        model:
          "端午节在农历五月初五，已经有两千多年的历史了。这一天，人们有两个最重要的习俗：吃粽子和赛龙舟。\n粽子是用一种大叶子把米包起来，做成三角形，再放进锅里煮几个小时做成的。里面可以放豆沙，也可以放肉。赛龙舟的时候，几十个人坐在一条长长的、像龙一样的船上，跟着鼓声一起划，看哪条船最快。\n关于端午节的来源，最有名的故事是为了纪念古代的一位诗人。他非常爱自己的国家，后来死在了江里，人们划着船去找他，还把米饭放进江里。今天，端午节表示人们对爱国的人的尊敬，也是一家人团圆的好时候。",
      },
      {
        task: "元宵节吃汤圆",
        model:
          "元宵节在农历正月十五，是春节以后的第一个重要节日。这天晚上，人们要吃汤圆、看灯笼。\n汤圆是用米粉做的，一个个都是圆圆的，里面有甜甜的豆沙。做的时候，先把米粉和水和成面团，再包上豆沙，用手做成圆的，然后放进开水里煮。煮好的汤圆一个个地漂在水上，吃起来又软又甜。\n汤圆的“圆”和团圆的“圆”是一个字，所以吃汤圆表示一家人团团圆圆、生活甜甜美美。元宵节过完了，春节才算真正过完了，大家又要开始新一年的工作和学习了。",
      },
      {
        task: "过生日吃长寿面",
        model:
          "在中国，很多人过生日的时候要吃一碗长寿面，特别是老人过生日。长寿面和一般的面条一样，可是要做得很长，最好一碗里只有一根面。做的时候，先煮好面，再加上鸡蛋、菜叶和肉，放一点儿盐和酱油，就做好了。\n为什么叫长寿面呢？因为面条很长，人们用长长的面条代表长长的寿命，吃长寿面就是希望过生日的人健康长寿。吃的时候还有一个习惯：面条不能断，要一口气吃下去。现在，很多年轻人过生日会吃蛋糕，可是家里的老人过生日，我们还是会做一碗长寿面，表示对老人的尊敬和祝福。",
      },
      {
        task: "春节的红包",
        model:
          "过春节的时候，中国的孩子们最喜欢的就是收红包。红包是一个红色的小纸袋，里面放着钱。大年三十晚上和大年初一，爷爷奶奶、爸爸妈妈和亲戚们会把红包送给孩子，同时说一些祝福的话，比如“新年快乐，学习进步”。孩子们收到红包，要说“谢谢”，还要祝大人身体健康。\n红包里的钱叫“压岁钱”。人们相信，压岁钱能保护孩子平平安安地度过新的一年。红色在中国代表吉祥和喜庆，所以用红色的纸包钱。现在，很多人还在手机上发电子红包。我觉得，红包里钱的多少不重要，重要的是大人对孩子的爱和祝福。",
      },
      {
        task: "蛋炒饭",
        model:
          "蛋炒饭是中国家里最常见的一道饭，差不多每个中国人都会做，也都爱吃。做蛋炒饭用的东西很简单：米饭、鸡蛋、一点儿油和盐。最好用前一天做的米饭，因为这样的米饭不太软，炒出来一粒一粒的，最香。\n做法是这样的：首先，把两个鸡蛋打在碗里，打散。然后，锅里放油，油热了以后，把鸡蛋倒进去，炒熟以后拿出来。接着，再放一点儿油，把米饭放进去，用中火炒几分钟，再把鸡蛋放回去，加一点儿盐，炒几下就好了。\n蛋炒饭虽然简单，可是很多人说，这就是“家的味道”。不想浪费米饭，又想很快吃上热饭的时候，蛋炒饭是最好的选择。",
      },
      {
        task: "火锅",
        model:
          "火锅是中国很多地方都有的一种吃法，特别是在冬天，很受欢迎。吃火锅的时候，桌子中间放一个大锅，锅里是烧开的汤，有辣的，也有不辣的。大家把肉、鱼和各种菜放进锅里煮，煮熟了就拿出来，放进自己喜欢的酱里吃。\n火锅好吃，更重要的是大家能在一起。一家人和朋友们坐在一起，一边吃，一边聊天儿，常常一吃就是两三个小时。每个人都可以选自己爱吃的东西，大家在一个锅里吃饭，感觉特别亲近。所以，很多人觉得火锅代表着团圆和友谊。在我家，每到过年和有好事的时候，我们都会吃火锅。",
      },
      {
        task: "清明节",
        model:
          "清明节一般在每年的四月五日前后，是中国人纪念去世的家人的日子。这一天，很多人会回到家乡，去祖先的墓前扫墓。扫墓的时候，大家先把墓四周打扫干净，然后放上鲜花和家人以前爱吃的东西，最后站在墓前，安静地想一想他们，说一说家里的事。\n清明节的意义是不忘记家人，不忘记自己是从哪儿来的。清明节让年轻人知道，家里的老人们为我们做了很多事。另外，清明的时候正是春天，天气变暖，草也绿了，所以很多人扫完墓以后还会去郊外走一走，看看春天的花草。清明节有对家人的怀念，也有对生活的热爱。",
      },
      {
        task: "中国人喝茶的习惯",
        model:
          "中国是茶的故乡，喝茶在中国已经有几千年的历史了。中国人喝茶的种类很多，有绿茶、红茶、花茶等等。很多人每天早上第一件事就是喝一杯热茶。家里来了客人，主人也会先给客人倒一杯茶。\n喝茶有自己的方法：先用热水把茶杯洗一洗，再把茶叶放进去，倒上热水，等两三分钟就可以喝了。给客人倒茶的时候，茶不能倒得太满，一般七八分满就够了，因为人们说“茶满欺客”。客人接茶的时候，常常用手指在桌子上轻轻地点两下，表示感谢。\n对中国人来说，喝茶不只是为了解渴，更是一种交朋友、表示尊敬的方式。",
      },
      {
        task: "介绍你们国家的一个节日",
        model:
          "我是美国人，我最喜欢的节日是感恩节。感恩节在每年十一月的第四个星期四。这一天，不管多远，很多人都会回家和家人一起过节。\n感恩节最重要的是一家人一起吃的晚饭。桌子中间是一只烤得黄黄的火鸡，还有土豆泥和南瓜做的点心。吃饭以前，我们家有一个习惯：每个人都要说一说，这一年最想感谢的人和事。有人感谢家人的照顾，有人感谢朋友的帮助。\n感恩节的意义就在名字里：感谢。这个节日提醒我们，不要觉得别人对我们好是应该的，要常常想一想自己得到了什么，对别人说一声“谢谢”。我觉得这个想法和中国人说的“知恩图报”很像。",
      },
      {
        task: "过年贴春联",
        model:
          "春节以前，中国很多人家都要在大门两边贴春联。春联是写在两张长长的红纸上的两句话，一左一右，字数一样，意思也互相对应。门的上面还有一张红纸，写着四个字。贴春联一般在大年三十的上午，全家人一起把旧的春联拿下来，贴上新的。很多人家还会在门上贴一个大大的“福”字，有的人故意把“福”字倒着贴，因为“福倒了”听起来就像“福到了”。\n春联的内容多是对新年的祝福，比如希望家人身体健康、生活幸福、工作顺利。红色在中国代表吉祥，所以春联都用红纸。贴上春联，家里马上就有了过年的样子。春联表达了人们对新的一年的希望。",
      },
    ],
  },
];
