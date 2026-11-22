// The judged writing of native grades 1 and 2 (docs/chinese-curriculum.md §18.9): writing what one wants to say in
// grade 1, writing about a picture and writing what one imagines in grade 2. Each task has one model written for this
// subject. Until the pictures are drawn, a task says in words what its picture shows. A Chinese character counts as a word
// in every length.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { earlySentenceId } from "./early-sentences.ts";

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** worked writes the solution of a task: what to plan, the model as one good answer, and how to check one's own. */
const worked =
  (plan: Text, check: Text) =>
  (model: string): Text =>
    t(
      `**Step 1: plan what to say.** ${plan.en}\n\n**Step 2: write it in sentences.** One good answer:\n\n> ${model}\n\n**Check.** ${check.en}`,
      `**第一步：想好要写什么。**${plan["zh-CN"]}\n\n**第二步：用几句话写下来。**一篇好的答案：\n\n> ${model}\n\n**检验。** ${check["zh-CN"]}`,
    );

/** selfBank are the tasks of writing-1-want-to-say on oneself. */
const selfBank: readonly WritingItem[] = [
  {
    task: "写一写你自己：你叫什么名字，今年几岁，在哪里上学。",
    model: "我叫王小明，今年七岁了。我在红星小学上一年级，我很喜欢我的学校。",
  },
  {
    task: "写一写你每天早上做什么。",
    model: "我每天早上六点半起床，先洗脸刷牙，再吃早饭。吃完饭，妈妈送我去上学。",
  },
  {
    task: "写一写你会做的一件事。",
    model: "我会自己穿衣服，还会帮妈妈扫地。妈妈说我长大了，我心里很高兴。",
  },
  {
    task: "写一写你的家里有谁。",
    model: "我家有四口人：爸爸、妈妈、哥哥和我。爸爸妈妈很爱我们，哥哥常常和我一起玩。",
  },
  {
    task: "写一写你放学回家以后做什么。",
    model: "放学回家以后，我先写作业，再看一会儿书。吃过晚饭，我和爸爸下楼走一走。",
  },
  {
    task: "写一写你的好朋友。",
    model: "我的好朋友叫小红，她和我在一个班。我们一起上学，一起做游戏，从来不吵架。",
  },
  {
    task: "写一写你星期天做了什么。",
    model: "星期天，我和妈妈去公园玩。我们看了花，还看了小鸟在树上唱歌。我玩得很开心。",
  },
  {
    task: "写一写你长大了想做什么。",
    model: "我长大了想当一名老师。我要像我的老师一样，教小朋友读书写字。",
  },
];

/** likeBank are the tasks of writing-1-want-to-say on something one likes. */
const likeBank: readonly WritingItem[] = [
  {
    task: "写一写你喜欢的一种动物。",
    model: "我喜欢小白兔。它的毛白白的，耳朵长长的，眼睛红红的。它最爱吃青菜和萝卜，跑起来一跳一跳的，真可爱。",
  },
  {
    task: "写一写你喜欢的一种水果。",
    model: "我最喜欢吃西瓜。西瓜外面是绿色的，里面是红色的，还有黑黑的子。夏天吃一口西瓜，又甜又凉，真好吃！",
  },
  {
    task: "写一写你喜欢的一个玩具。",
    model: "我有一个小熊，是奶奶送给我的。它的身子是黄色的，摸起来软软的。我每天晚上都抱着它睡觉。",
  },
  {
    task: "写一写你喜欢的一个季节。",
    model: "我喜欢春天。春天来了，小草绿了，花儿开了，小鸟在树上唱歌。我和小朋友们在草地上做游戏，玩得真开心。",
  },
  {
    task: "写一写你喜欢的一种花。",
    model: "我喜欢向日葵。它的花大大的，黄黄的，像一个小太阳。它总是对着太阳笑，我看了也想笑。",
  },
  {
    task: "写一写你喜欢的一种书。",
    model: "我喜欢看故事书。每天睡觉前，妈妈给我读一个故事。书里有会说话的小动物，还有好看的画，我一看就是半天。",
  },
  {
    task: "写一写你喜欢的一项运动。",
    model: "我喜欢跑步。每天下午放学，我都和同学在操场上跑两圈。跑完以后，我出了一身汗，可是心里很高兴。",
  },
  {
    task: "写一写你喜欢吃的一种饭菜。",
    model: "我喜欢吃妈妈做的西红柿炒鸡蛋。红红的西红柿，黄黄的鸡蛋，看着就好吃。我每次都能吃两碗米饭。",
  },
];

/** pictureBank are the tasks of writing-2-picture: each says in words what its picture shows. */
const pictureBank: readonly WritingItem[] = [
  {
    task: "图上画的是：放学时下着大雨，学校门口，小明没有带伞，站在门口；小红撑着一把红伞走过来，后来两个人撑着一把伞回家。",
    model:
      "放学了，天下起了大雨。小明没有带伞，站在学校门口，急得不知道怎么办。这时，小红撑着一把红伞走过来，说：“我们一起走吧！”两个人撑着一把伞，高高兴兴地往家走去。",
  },
  {
    task: "图上画的是：晴天，公园的草地上，一个男孩在放风筝，一只小狗跟在他后面跑，天上飘着白云。",
    model:
      "星期天，天气真好，蓝蓝的天上飘着几朵白云。小军在公园的草地上放风筝，风筝飞得又高又远。他的小狗也跟在后面跑来跑去，好像也想飞上天去。小军开心地笑了。",
  },
  {
    task: "图上画的是：上课时，教室里，一个男孩的铅笔掉在地上，同桌的女孩弯下腰帮他捡起来，男孩在说谢谢。",
    model:
      "上课的时候，小明的铅笔掉在了地上。同桌小丽看见了，马上弯下腰，帮他把铅笔捡了起来。小明小声地说：“谢谢你！”小丽笑着说：“不用谢。”",
  },
  {
    task: "图上画的是：晚上，家里，爸爸在厨房洗碗，妈妈在扫地，一个女孩拿着毛巾在擦桌子。",
    model:
      "吃过晚饭，我们一家人一起打扫。爸爸在厨房里洗碗，妈妈拿着扫把扫地，我拿着毛巾，把桌子擦得干干净净。家里很快变得整整齐齐，我们都很高兴。",
  },
  {
    task: "图上画的是：早上，路口亮着红灯，一位老奶奶提着菜篮，一个男孩扶着她，等绿灯过马路。",
    model:
      "早上，我在路口看见一位老奶奶，她提着一篮菜，要过马路。红灯亮着，我走过去扶着她。等绿灯亮了，我们才一起慢慢地走过马路。老奶奶笑着说：“谢谢你，好孩子！”",
  },
  {
    task: "图上画的是：春天，山坡上，三个孩子在种小树，一个在挖坑，一个扶着树苗，一个提着水桶浇水。",
    model:
      "春天到了，小明、小红和小方来到山坡上种树。小明拿着铁锹挖坑，小红扶着小树苗，小方提来一桶水，给小树浇水。小树种好了，他们说：“小树，快快长大吧！”",
  },
  {
    task: "图上画的是：冬天，院子里的雪地上，两个孩子在堆雪人，雪人戴着红帽子，鼻子是一根胡萝卜。",
    model:
      "冬天，下了一场大雪。小江和妹妹跑到院子里堆雪人。他们先滚了一个大雪球做身子，又滚了一个小雪球做头。妹妹给雪人戴上红帽子，小江给它插上一根胡萝卜当鼻子。雪人好像在对他们笑呢。",
  },
  {
    task: "图上画的是：星期六，动物园里，一家人在看大熊猫，大熊猫抱着竹子在吃，孩子在给它拍照。",
    model:
      "星期六，爸爸妈妈带我去动物园。我们来到大熊猫馆，看见一只大熊猫坐在地上，抱着一根竹子吃得正香。它黑黑的眼圈，圆圆的身子，真可爱。我拿出相机，给它拍了好几张照片。",
  },
  {
    task: "图上画的是：下午，图书馆里，几个孩子安静地坐着看书，一个男孩站起来，把看完的书放回书架。",
    model:
      "下午，我们来到图书馆。大家坐在桌子旁边，安安静静地看书，谁也不说话。小明看完了一本书，轻轻地站起来，把书放回了书架上，又拿了一本新的。",
  },
  {
    task: "图上画的是：运动会上，操场的跑道上，一个女孩跑步时摔倒了，两个同学跑过去扶她起来，旁边的同学在加油。",
    model:
      "学校开运动会了。小丽在跑步的时候，一不小心摔倒了。同学小红和小方看见了，马上跑过去把她扶起来。小丽站起来，忍着疼，又往前跑，大家都为她加油。",
  },
  {
    task: "图上画的是：早上，树上有一个鸟窝，鸟妈妈叼着虫子喂三只小鸟，一个男孩在树下抬头看。",
    model:
      "早上，我在树下玩，听见树上“叽叽喳喳”地叫。我抬头一看，原来树上有一个鸟窝。鸟妈妈叼着一条小虫飞回来，三只小鸟张大了嘴，抢着要吃。我看着它们，心里想：鸟妈妈真辛苦啊！",
  },
  {
    task: "图上画的是：夏天，海边的沙滩上，一个女孩在用沙子堆城堡，弟弟提着小桶在捡贝壳，远处的海上有几只小船。",
    model:
      "夏天，爸爸妈妈带我和弟弟去海边。我坐在沙滩上，用沙子堆了一座大城堡。弟弟提着小桶，在沙滩上捡了好多贝壳。远远的海上，有几只小船在慢慢地走。我们玩得都不想回家了。",
  },
];

/** imaginationBank are the tasks of writing-2-imagination. */
const imaginationBank: readonly WritingItem[] = [
  {
    task: "想象一下：如果你有一双会飞的翅膀，你会飞到哪里去？",
    model:
      "如果我有一双会飞的翅膀，我要先飞到白云上面，在软软的云上睡一觉。醒来以后，我飞到大海上，看鱼儿在水里游来游去。天黑了，我再飞回家，把看到的都告诉妈妈。",
  },
  {
    task: "想象一支神奇的笔：它是什么样子的，能做什么？",
    model:
      "我想有一支神奇的笔。它是蓝色的，样子像一条小鱼。它会自己写字，我说什么，它就写什么。我写错了字，它还会“嘀嘀”地叫，提醒我改过来。有了它，我写作业又快又好。",
  },
  {
    task: "想象一下：如果小树会说话，它会对你说什么？",
    model:
      "如果小树会说话，它一定会对我说：“小朋友，谢谢你每天给我浇水！”它还会说：“请不要在我身上画画，我会疼的。”我会天天来看它，跟它说说学校里的事。",
  },
  {
    task: "想象你变成了一只小蚂蚁：你看到了什么，发生了什么事？",
    model:
      "有一天，我变成了一只小蚂蚁。小草在我身边，像一棵棵大树。一滴水落下来，像一个大水球，差点把我冲走。后来，我和别的蚂蚁一起，把一块饼干搬回了家，大家都很开心。",
  },
  {
    task: "想象一座建在云上的房子：它是什么样子的，住在里面会怎么样？",
    model:
      "我想在云上建一座房子。房子是白色的，软软的，像棉花糖一样。房子里有一个大窗户，从窗户往下看，能看见高山和大河。下雨的时候，我坐在门口，看雨从脚下落下去。",
  },
  {
    task: "想象一只会说话的小狗：它是什么样子的，和你说了些什么？",
    model:
      "我想有一只会说话的小狗。它的毛黄黄的，耳朵尖尖的，尾巴一摇一摇的。早上，它跑到我的床边说：“小主人，快起床，我们去公园玩吧！”到了公园，我们一起跑啊跳啊，玩得可开心了。",
  },
  {
    task: "想象一辆会变的汽车：它是什么样子的，能变成什么？",
    model:
      "我想有一辆会变的汽车。它平时是红色的，在路上跑得很快。遇到大河，它就变成一条船，在水上开。路上车太多了，它就长出翅膀，飞到天上去。坐在里面的人都很高兴。",
  },
  {
    task: "想象你到月亮上去玩：你看到了什么，做了什么？",
    model:
      "有一天晚上，我坐着一艘小飞船飞到了月亮上。月亮上没有花草，到处都是白白的石头。我轻轻一跳，就跳得好高好高。我回头一看，地球像一个蓝色的大球，挂在天上。",
  },
  {
    task: "想象你有一个会帮忙的小机器人：它是什么样子的，会帮你做什么？",
    model:
      "我有一个小机器人，它有圆圆的头，大大的眼睛。早上，它叫我起床，帮我拿好书包。妈妈做饭的时候，它帮妈妈洗菜。晚上，它给我讲故事，陪我睡觉。我真喜欢它。",
  },
  {
    task: "想象一棵神奇的树：它是什么样子的，会结出什么？",
    model:
      "我想种一棵神奇的树。它的叶子是彩色的，有红的、黄的，还有绿的。它结出来的不是果子，是书本、皮球和铅笔。哪个小朋友没有书，就可以来树下摘一本。",
  },
  {
    task: "想象一下：如果雨点是彩色的，会怎么样？",
    model:
      "如果雨点是彩色的，那一定很好看。红色的雨点落在花上，花更红了。绿色的雨点落在草地上，小草更绿了。下完雨，地上像铺了一块大花布，小朋友们都跑出来看。",
  },
  {
    task: "想象你变成一条小鱼，在海底玩：你看到了什么，发生了什么事？",
    model:
      "我变成了一条小鱼，游到了海底。海底有好多五颜六色的珊瑚，像一片花园。一只大海龟游过来，背着我在海里转了一圈。后来，我们还和小虾玩捉迷藏，玩得真开心。",
  },
];

/** earlyJudgedTopics are the judged writing topics of grades 1 and 2, in order. */
export const earlyJudgedTopics: readonly GradeTopic[] = [
  {
    grade: 1,
    topic: {
      id: "writing-1-want-to-say",
      title: t("Writing What I Want to Say", "写自己想说的话"),
      summary: t(
        "Write in Chinese what you want to say: a sentence or two about yourself, and a few sentences about something you like.",
        "用中文写自己想说的话：写一两句关于自己的话，再用几句话写自己喜欢的东西。",
      ),
      intro: t(
        "Writing starts with what you want to say. Say it to yourself first, then write it down one sentence at a time, each ending with a full stop. “我叫王小明，今年七岁了。” is a sentence about yourself; “我喜欢小白兔。它的耳朵长长的，跑起来一跳一跳的。” tells about something you like, and says what it is like.\n\nWhat you write is read by a judge who checks it against two questions, shown with your result. The first knowledge point writes about yourself, the second about something you like.",
        "写话，就是把自己想说的话写下来。先在心里说一说，再一句一句地写，每句话末尾画上句号。“我叫王小明，今年七岁了。”是写自己的一句话；“我喜欢小白兔。它的耳朵长长的，跑起来一跳一跳的。”写了自己喜欢的东西，还说出了它是什么样子。\n\n写好以后，会按两个问题来看你写得怎么样，结果会告诉你。第一个知识点写自己，第二个写自己喜欢的东西。",
      ),
      prerequisites: [earlySentenceId(1, 4)],
      xp: 18,
      strand: "writing",
      encompasses: [],
      criteria: ["zh1-say-self", "zh1-say-ends", "zh1-say-like"].map(criterion),
      knowledgePoints: [
        point(
          "writing-1-want-to-say-self",
          t("A Sentence about Myself", "写一写自己"),
          t(
            "A sentence about yourself says one true thing about you: your name, your age, your family, what you do. Start with 我, say the thing, and end with a full stop.\n\nFor “写一写你每天早上做什么”: “我每天早上六点半起床，先洗脸刷牙，再吃早饭。”\n\n> **Watch out.** Each sentence ends with a full stop. “我叫小明我七岁我上一年级” runs three sentences together; write “我叫小明。我七岁了。”",
            "写自己的一句话，要说出自己的一件真实的事：名字、年纪、家里人、每天做什么。用“我”开头，把事情说出来，末尾画上句号。\n\n比如“写一写你每天早上做什么”：“我每天早上六点半起床，先洗脸刷牙，再吃早饭。”\n\n> **注意。** 一句话说完要画句号。“我叫小明我七岁我上一年级”把三句话连在了一起，要写成“我叫小明。我七岁了。”",
          ),
          writingGenerator(
            t(
              "Write a sentence or two in Chinese about yourself, as the task asks. End each sentence with a full stop.",
              "按要求，用中文写一两句关于自己的话。每句话末尾都要有句号。",
            ),
            selfBank,
            ["zh1-say-self", "zh1-say-ends"],
            { minWords: 20, maxChars: 300 },
            worked(
              t(
                "Say to yourself the true thing the task asks about you, one thing at a time.",
                "在心里说一说题目问的那件关于自己的事，一件一件地说。",
              ),
              t(
                "Read your sentences aloud: each says something true about you that the task asks, and ends with a full stop.",
                "把写的话读一遍：每句都说了题目要的关于自己的事，末尾都有句号。",
              ),
            ),
          ),
        ),
        point(
          "writing-1-want-to-say-like",
          t("Something I Like", "写自己喜欢的东西"),
          t(
            "To write about something you like, first name it, then say at least two things about it: what it looks like, what it does, why you like it.\n\n“我喜欢小白兔。它的毛白白的，耳朵长长的。它跑起来一跳一跳的，真可爱。” names the rabbit and says how it looks and moves.\n\n> **Watch out.** “我喜欢小白兔，我很喜欢它，我真的喜欢它” says only that you like it. Tell the reader what it is like.",
            "写自己喜欢的东西，先说出它是什么，再至少说两点：它是什么样子的，它会做什么，你为什么喜欢它。\n\n比如“我喜欢小白兔。它的毛白白的，耳朵长长的。它跑起来一跳一跳的，真可爱。”说出了小白兔，还写了它的样子和它怎么跑。\n\n> **注意。** “我喜欢小白兔，我很喜欢它，我真的喜欢它”只说了喜欢。要告诉读者它是什么样子的。",
          ),
          writingGenerator(
            t(
              "Write a few sentences in Chinese about the thing the task asks for: name it, and say at least two things about it.",
              "按要求，用中文写几句话：说出你喜欢的是什么，再至少写两点关于它的话。",
            ),
            likeBank,
            ["zh1-say-like", "zh1-say-ends"],
            { minWords: 30, maxChars: 400 },
            worked(
              t(
                "Name the thing you like, then think of two things to say about it: how it looks, what it does, or why you like it.",
                "先想好喜欢的是什么，再想两点要说的：它的样子，它会做什么，或者你为什么喜欢它。",
              ),
              t(
                "Read it aloud: it names the thing, says at least two things about it, and every sentence ends with a full stop.",
                "读一遍：说出了喜欢的是什么，至少写了两点，每句话末尾都有句号。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 2,
    topic: {
      id: "writing-2-picture",
      title: t("Writing About a Picture", "看图写话"),
      summary: t(
        "Write in Chinese about a picture: who is in it and what they are doing, in a few sentences in order.",
        "用中文看图写话：写清楚图上有谁、在做什么，用几句话按顺序写下来。",
      ),
      intro: t(
        "To write about a picture, look first: when and where is it, who is in it, what are they doing? Then say it in sentences, in an order that makes sense. A picture of two children sharing an umbrella at the school gate in the rain becomes: “放学了，天下起了大雨。小明没有带伞，站在学校门口。小红撑着一把红伞走过来，两个人一起走回家。”\n\nUntil the pictures are drawn, each task says in words what its picture shows. The first knowledge point writes who is in the picture and what they do, the second puts a few sentences in order.",
        "看图写话，先看清楚：什么时候，在哪里，图上有谁，他们在做什么。再用几句话按顺序写出来。比如一幅画上，下雨天两个孩子在学校门口合撑一把伞，可以写成：“放学了，天下起了大雨。小明没有带伞，站在学校门口。小红撑着一把红伞走过来，两个人一起走回家。”\n\n图画好以前，每道题先用文字说出图上画的是什么。第一个知识点写图上有谁、在做什么，第二个把几句话按顺序写好。",
      ),
      prerequisites: [earlySentenceId(2, 2), "writing-1-want-to-say"],
      xp: 18,
      strand: "writing",
      encompasses: [],
      criteria: ["zh2-picture-who", "zh2-picture-what", "zh2-picture-order"].map(criterion),
      knowledgePoints: [
        point(
          "writing-2-picture-who",
          t("Who Is in It and What They Do", "图上有谁，在做什么"),
          t(
            "Look at the picture in turn: when and where it is, who is in it, and what each one is doing. Write a sentence for each.\n\nIn the picture of the park: “星期天，小军在公园的草地上放风筝。他的小狗跟在后面跑。”\n\n> **Watch out.** Write what the picture shows. If the boy is flying a kite, do not write that he is playing football.",
            "按顺序看图：什么时候，在哪里，图上有谁，每个人在做什么。每样写一句。\n\n比如公园那幅图：“星期天，小军在公园的草地上放风筝。他的小狗跟在后面跑。”\n\n> **注意。** 要写图上画了的。图上的男孩在放风筝，就不能写成在踢球。",
          ),
          writingGenerator(
            t(
              "Look at the picture and write a few sentences in Chinese: when and where it is, who is in it and what they are doing.",
              "看图，用中文写几句话：写清楚什么时候、在哪里、图上有谁、在做什么。",
            ),
            pictureBank,
            ["zh2-picture-who", "zh2-picture-what"],
            { minWords: 40, maxChars: 500 },
            worked(
              t(
                "Look at the picture: when and where it is, who is in it, and what each one is doing.",
                "看清楚图：什么时候，在哪里，有谁，每个人在做什么。",
              ),
              t(
                "Look at the picture again with your sentences: each one you wrote about is in it, doing what you say.",
                "对着图再读一遍写的话：写到的人和动物图上都有，做的事也和图上一样。",
              ),
            ),
          ),
        ),
        point(
          "writing-2-picture-order",
          t("A Few Sentences in Order", "按顺序写几句话"),
          t(
            "Put the sentences in an order: first when and where, then what happens, last how it ends or what someone says or feels. Words such as 这时, 后来 and 最后 help join them.\n\n“吃过晚饭，我们一家人一起打扫。爸爸洗碗，妈妈扫地，我擦桌子。家里很快变得整整齐齐。”\n\n> **Watch out.** Sentences that only list what is in the picture, “有爸爸。有妈妈。有桌子。”, are not yet a piece. Join them into one thing that happens.",
            "几句话要有顺序：先写什么时候、在哪里，再写发生了什么，最后写结果，或者谁说了什么、心里怎么想。“这时”“后来”“最后”这些词能把句子连起来。\n\n比如：“吃过晚饭，我们一家人一起打扫。爸爸洗碗，妈妈扫地，我擦桌子。家里很快变得整整齐齐。”\n\n> **注意。** 只把图上的东西一样一样列出来，比如“有爸爸。有妈妈。有桌子。”，还不是一段话。要把它们连成一件事来写。",
          ),
          writingGenerator(
            t(
              "Look at the picture and write a few sentences in Chinese, in order: when and where, what happens, and how it ends.",
              "看图，用中文按顺序写几句话：什么时候、在哪里，发生了什么，结果怎么样。",
            ),
            pictureBank,
            ["zh2-picture-order", "zh2-picture-what"],
            { minWords: 50, maxChars: 500 },
            worked(
              t(
                "Plan the order: when and where first, then what happens, last how it ends.",
                "先想好顺序：先写什么时候、在哪里，再写发生了什么，最后写结果。",
              ),
              t(
                "Read the sentences one after another: each follows from the one before, and together they tell one thing that happens.",
                "把句子连起来读一遍：每一句都接着前一句，合起来讲的是一件事。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 2,
    topic: {
      id: "writing-2-imagination",
      title: t("Writing What I Imagine", "写想象中的事物"),
      summary: t(
        "Write in Chinese about something imagined: what it is like, and what happens with it.",
        "用中文写想象中的事物：它是什么样子的，发生了什么事。",
      ),
      intro: t(
        "To write what you imagine, picture it clearly first, then tell it as if it were there. A magic pen: “它是蓝色的，样子像一条小鱼。它会自己写字，我说什么，它就写什么。” says what the pen looks like and what it can do.\n\nThe first knowledge point says what the imagined thing is like, the second tells what happens with it.",
        "写想象中的事物，先在心里把它想清楚，再像它真的在眼前一样写出来。比如一支神奇的笔：“它是蓝色的，样子像一条小鱼。它会自己写字，我说什么，它就写什么。”写出了笔的样子，也写出了它会做什么。\n\n第一个知识点写想象的事物是什么样子的，第二个写和它一起发生的事。",
      ),
      prerequisites: [earlySentenceId(2, 4), "writing-2-picture"],
      xp: 18,
      strand: "writing",
      encompasses: [],
      criteria: ["zh2-imagine-like", "zh2-imagine-happens", "zh2-imagine-stays"].map(criterion),
      knowledgePoints: [
        point(
          "writing-2-imagination-like",
          t("What It Is Like", "它是什么样子的"),
          t(
            "Say what the imagined thing is like with at least two details: its colour or shape, its sound, what it can do.\n\nA house on a cloud: “房子是白色的，软软的，像棉花糖一样。从窗户往下看，能看见高山和大河。”\n\n> **Watch out.** Keep to the thing the task asks for. A piece about a house on a cloud that turns to what you ate today has wandered off.",
            "写想象的事物是什么样子的，至少写两点：它的颜色、形状，它的声音，它会做什么。\n\n比如云上的房子：“房子是白色的，软软的，像棉花糖一样。从窗户往下看，能看见高山和大河。”\n\n> **注意。** 要一直写题目说的那样东西。写云上的房子，写着写着变成了今天吃了什么，就跑题了。",
          ),
          writingGenerator(
            t(
              "Write a few sentences in Chinese about the imagined thing of the task: say what it is like, with at least two details.",
              "用中文写几句话，写题目里想象的事物：写出它是什么样子的，至少写两点。",
            ),
            imaginationBank,
            ["zh2-imagine-like", "zh2-imagine-stays"],
            { minWords: 40, maxChars: 500 },
            worked(
              t(
                "Picture the thing and choose two or three details: how it looks, how it sounds, what it can do.",
                "在心里想一想这样东西，选两三点来写：它的样子，它的声音，它会做什么。",
              ),
              t(
                "Read it again: there are at least two details, and every sentence is about the thing the task asks for.",
                "再读一遍：至少写了两点，每句话都在写题目说的那样东西。",
              ),
            ),
          ),
        ),
        point(
          "writing-2-imagination-happens",
          t("What Happens", "发生了什么事"),
          t(
            "Tell what happens with the imagined thing, one event after another: first, then, last.\n\nAs a little ant: “一滴水落下来，差点把我冲走。后来，我和别的蚂蚁一起，把一块饼干搬回了家。”\n\n> **Watch out.** Describing only what it looks like is not yet telling what happens. Let something happen, and then something after it.",
            "写和想象的事物一起发生的事，一件接一件地写：先怎样，后来怎样，最后怎样。\n\n比如变成小蚂蚁：“一滴水落下来，差点把我冲走。后来，我和别的蚂蚁一起，把一块饼干搬回了家。”\n\n> **注意。** 只写它的样子，还没有写发生了什么。要写出一件事，再写接着发生的事。",
          ),
          writingGenerator(
            t(
              "Write a few sentences in Chinese about the imagined thing of the task: tell what happens, one event after another.",
              "用中文写几句话，写题目里想象的事物：写出发生了什么事，一件接一件地写。",
            ),
            imaginationBank,
            ["zh2-imagine-happens", "zh2-imagine-stays"],
            { minWords: 50, maxChars: 500 },
            worked(
              t("Plan what happens: what comes first, what follows, and how it ends.", "想好发生了什么：先发生什么，接着怎样，最后怎样。"),
              t(
                "Read it again: something happens and something follows it, and every sentence is about the imagined thing.",
                "再读一遍：写出了一件事和接着发生的事，每句话都在写想象的那样东西。",
              ),
            ),
          ),
        ),
      ],
    },
  },
];
