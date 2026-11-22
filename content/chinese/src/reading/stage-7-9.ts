// The reading topics of grades 7 to 9 (docs/chinese-curriculum.md §18.9). Grade 7 reads the thread, order and detail of
// narratives, the ways of describing and their effect, prose for its language and feeling, exposition for its object,
// features and methods, news for its elements and its facts against its views, easy classical prose with notes, and
// classical poems for their images and feeling. Each topic asks two knowledge points of its ten texts, three questions
// a text, and each comes after the recognition batch by which nearly every character of its texts has been taught.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageReadingTopics } from "./stage-1-2.ts";
import { stageThreeFourReading } from "./stage-3-4.ts";
import { stageFiveSixReading } from "./stage-5-6.ts";
import { DESCRIPTION_7, NARRATIVE_7 } from "./texts-7a.ts";
import { EXPOSITORY_7, PROSE_7 } from "./texts-7b.ts";
import { CLASSICAL_7, NEWS_7, POEMS_7 } from "./texts-7c.ts";
import { PASSAGE, POEM, type ReadingSpec, readingTopicOf as topicOf } from "./topic-kit.ts";

/** SPECS are the reading topics of grades 7 to 9, in order. */
const SPECS: readonly ReadingSpec[] = [
  {
    grade: 7,
    id: "reading-7-narrative",
    title: t("Narratives: Thread, Order and Detail", "记叙文：线索、顺序和详略"),
    summary: t(
      "Narratives written for the subject: the thread that joins them, the order they are told in, and what they tell in detail or in brief.",
      "读为本学科写的记叙文：贯穿全文的线索，记叙的顺序，哪里详写、哪里略写。",
    ),
    intro: t(
      "A narrative is held together by a thread, told in an order, and weighted by what it tells closely. In “旧书包”, the blue cloth bag runs through it all: found in the wardrobe, sewn by Grandma, pressed to the face at the end. It opens now, then goes back six years: a flashback.\n\nThe night of sewing is told action by action, the six years at school in one sentence: the writer spends words where the feeling is. The first knowledge point asks the thread and the order, the second what is told in detail or in brief, and why.",
      "记叙文有线索把全文串起来，有一定的记叙顺序，还有详写和略写。《旧书包》里，蓝布书包贯穿全文：在衣柜里找到它，回忆奶奶缝它，最后把它贴在脸上。文章先写现在，再回到六年前，这是倒叙。\n\n奶奶缝书包的那一晚，一个动作一个动作地写；上学的六年，只用一句话带过：作者把笔墨花在最能表达感情的地方。第一个知识点问线索和记叙顺序，第二个问哪里详写、哪里略写，为什么。",
    ),
    data: NARRATIVE_7,
    kind: PASSAGE,
    after: "reading-6-fiction",
    points: [
      [
        "thread",
        t("The Thread and the Order", "线索和记叙顺序"),
        t(
          "The thread is the thing, person or feeling that comes back in every part and joins them: look for what each part is about. The order is chronological when the text follows events as they came; a flashback when it opens on a later moment and goes back; an inserted recollection when it stops in the middle to tell something earlier, then takes up the story again.\n\nIn “那把伞”, the umbrella is held out, pressed into my hand and given back: it is the thread. The paragraph “去年冬天……” breaks into the rainy evening and then the evening goes on: an inserted recollection.\n\n> **Watch out.** A thing named once is not the thread: it must run through the whole text. And a flashback opens on the later moment; an earlier event told in the middle is an inserted recollection.",
          "线索是在文章各部分反复出现、把全文串起来的一样东西、一个人或一种感情：看一看每一部分都围绕着什么。按事情发生的先后来写，是顺叙；先写后来的结果或某个时刻，再回过头写经过，是倒叙；叙述中间停下来插进以前的事，再接着往下写，是插叙。\n\n《那把伞》里，递伞、塞伞、还伞，都围绕着那把伞，它就是线索。“去年冬天……”一段插在雨中递伞的中间，写完又接着写递伞，这是插叙。\n\n> **注意。** 只出现一次的东西不是线索，线索要贯穿全文。倒叙是开头先写后来的事；在中间插进以前的事，是插叙。",
        ),
      ],
      [
        "detail",
        t("Told in Detail, Told in Brief", "详写和略写"),
        t(
          "A part told in detail gives actions, words and small things one after another; a part told in brief is passed over in a sentence. Find which is which, then ask why: the writer tells closely what serves the centre, and briefly what only links it.\n\nIn “跑道上的最后一名”, the first three laps take a sentence or two each, the last lap a whole paragraph of cheers, the teacher's open arms and the dash: the last lap carries the meaning, that finishing matters more than the place.\n\n> **Watch out.** A brief part is not unimportant or forgotten: it moves the story along or holds back the feeling. Say what it does, not that it could be cut.",
          "详写的部分，动作、语言、细节一个接一个；略写的部分，一两句话就带过了。先找出哪里详、哪里略，再想为什么：和中心关系最密切的详写，只起连接作用的略写。\n\n《跑道上的最后一名》里，前三圈每圈只写一两句，最后一圈却写了一整段：加油声、班主任张开的双手、我冲向终点。最后一圈最能表现“跑完比名次更重要”，所以详写。\n\n> **注意。** 略写不等于不重要、作者忘了，它有自己的作用，比如推动情节、为后文蓄势、把感情藏起来。要说出它的作用，不能说它可以删掉。",
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "reading-7-description",
    title: t("Description and Its Effect", "描写方法及其作用"),
    summary: t(
      "Pieces written for the subject: the ways people and places are described, and what each description does.",
      "读为本学科写的文章：描写人物和环境的方法，每一处描写的作用。",
    ),
    intro: t(
      "A writer shows a person by their looks, their actions, their words and their thoughts, and a place by its setting. In “卖烤红薯的老人”, the frosted cap and red face are his looks; lifting the lid and swapping for a bigger one are his actions; the north wind and the snow are the setting.\n\nEach does something: the cold setting makes the old man's work hard and the hot sweet potato warm; his actions show a kind heart. The first knowledge point asks which way of describing a sentence uses, the second what it does.",
      "写人，可以写外貌、动作、语言和心理；写景物、场面，是环境描写。《卖烤红薯的老人》里，结着白霜的棉帽、冻红的脸是外貌描写；掀开炉盖、换一个更大的红薯是动作描写；北风卷着雪粒是环境描写。\n\n每一处描写都有作用：寒冷的环境衬托出老人的辛苦和红薯的温暖，一连串的动作写出了老人的厚道。第一个知识点问用了什么描写方法，第二个问描写的作用。",
    ),
    data: DESCRIPTION_7,
    kind: PASSAGE,
    after: "reading-7-narrative",
    points: [
      [
        "method",
        t("Ways of Describing", "描写方法"),
        t(
          "Ask what the sentence pictures. A person's face, build, clothes or expression: appearance. What they do: action. What they say aloud: speech. What they think but do not say: thought. The weather, the place, the scene around them: setting. Showing a person through how others react is indirect description.\n\nIn “学骑车”, “要是摔下来，膝盖肯定要破” follows “我心里直打鼓”: it is thought, not speech, for no one hears it.\n\n> **Watch out.** Words in quotation marks are not always speech: if the person only thinks them, it is thought. And a sentence about the people around the hero, not the hero, may be indirect description.",
          "看句子写的是什么。人物的长相、身材、穿着、神情，是外貌描写；人物做了什么，是动作描写；人物说出口的话，是语言描写；心里想的、没有说出来的，是心理描写；天气、景物、场面，是环境描写。通过旁人的反应来表现人物或场面，是侧面描写。\n\n《学骑车》里，“要是摔下来，膝盖肯定要破”前面是“我心里直打鼓”，没有人听到，是心理描写，不是语言描写。\n\n> **注意。** 带引号的话不一定是语言描写，只在心里想的是心理描写；写的是主人公身边的人，可能是侧面描写。",
        ),
      ],
      [
        "effect",
        t("What a Description Does", "描写的作用"),
        t(
          "A description of a person shows their character or their feeling at that moment; a description of the setting sets the mood, sets off the person, or moves the story on. Name what it shows, then tie it to the person or the text.\n\nIn “数学考试”, “教室里静极了，只听得见笔尖在纸上‘沙沙’地响” is setting: the silence sets off how anxious I am.\n\n> **Watch out.** Do not answer with what the words say on their face, as “the room was quiet”: say what the quiet does for the person or the text.",
          "人物描写写出人物的性格、品质或当时的心情；环境描写渲染气氛、衬托人物、推动情节。先说出写出了什么，再和人物、和全文联系起来。\n\n《数学考试》里，“教室里静极了，只听得见笔尖在纸上‘沙沙’地响”是环境描写，用安静衬托出我心里的紧张。\n\n> **注意。** 不能只照字面说“写出了教室很安静”，要说出这份安静对人物、对文章起了什么作用。",
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "reading-7-prose",
    title: t("Prose: Language and Feeling", "散文：品味语言，体会情感"),
    summary: t(
      "Prose written for the subject: the weight of its words and figures, and the feeling it carries.",
      "读为本学科写的散文：品味用得好的词句，体会作者表达的感情。",
    ),
    intro: t(
      "Prose speaks through small things and carries a feeling in them. In “炊烟”, the smoke “钻” out of the chimneys and bends “像一群赶路的人”: a verb and a likeness make it alive.\n\nAnd the smoke is more than smoke: “看见炊烟，我就知道，该回家了”, and years later a wisp still rises in the writer's heart. The piece carries longing for home and mother. The first knowledge point asks the language, the second the feeling.",
      "散文借平常的人、事、景，表达作者的感情。《炊烟》里，炊烟从烟囱里“钻”出来，风一来就弯下腰，“像一群赶路的人”：一个动词、一个比喻，把炊烟写活了。\n\n炊烟又不只是炊烟：“看见炊烟，我就知道，该回家了”；多年以后，作者心里还会升起那么一缕。文章表达的是对家乡、对母亲的思念。第一个知识点问品味语言，第二个问体会情感。",
    ),
    data: PROSE_7,
    kind: PASSAGE,
    after: "reading-6-prose",
    points: [
      [
        "language",
        t("The Weight of the Words", "品味语言"),
        t(
          "Find the word or figure the question points to and ask what it adds: a verb shows how something moves, a likeness or a thing made human makes it vivid, a word from another sense makes it felt. Say what it pictures, then what it shows.\n\nIn “槐花又开了”, the scent is “甜丝丝的”: a word of taste for a smell, so the blossom smells sweet enough to taste.\n\n> **Watch out.** A figure is not to be taken at its word: “像一群赶路的人” does not mean people are walking, but how the smoke drifts. Say what it does, not only what it says.",
          "找到题目问的词语或句子，想一想它好在哪里：动词写出了动作和样子，比喻、拟人写得生动形象，用别的感官的词让人感受更真切。先说写出了什么，再说表现了什么。\n\n《槐花又开了》里，香味是“甜丝丝”的：用尝的感觉写闻的感觉，写出槐花香得浓，香得让人喜欢。\n\n> **注意。** 比喻、拟人不能照字面理解：“像一群赶路的人”不是说真的有人在赶路，而是写炊烟飘动的样子。要说出它的表达效果，不能只翻译字面。",
        ),
      ],
      [
        "feeling",
        t("The Feeling", "体会情感"),
        t(
          "Prose seldom names its feeling outright. Gather where it shows: the details the writer dwells on, a sentence of feeling, the ending that looks back. Then name the feeling and what it is for.\n\nIn “老井”, the creaking pulley, the melon cooled in the well and the line “井不说话。可是它什么都记得” together carry longing for the village life the well has seen.\n\n> **Watch out.** Take the whole piece, not one part: a sad moment in a piece of longing does not make the piece sad, and a piece about an old thing is not about the thing alone.",
          "散文很少直接说出感情。要把能看出感情的地方合起来看：作者着意写的细节、抒情的句子、回味全文的结尾，再说出是什么感情、对谁或对什么的感情。\n\n《老井》里，“吱呀吱呀”的辘轳声、井里镇过的西瓜，还有结尾“井不说话。可是它什么都记得”，合起来表达了对老井和它连着的旧日乡村生活的怀念。\n\n> **注意。** 要从全文看，不能只看一处：怀念的文章里有一点失落，不等于全文是难过；写一样旧东西，表达的往往不只是对这样东西的感情。",
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "reading-7-expository",
    title: t("Exposition: Object, Features, Methods", "说明文：对象、特征和方法"),
    summary: t(
      "Expository texts written for the subject: the thing each explains and its features, and the methods it explains them by.",
      "读为本学科写的说明文：说明的对象和它的特征，用了哪些说明方法，有什么作用。",
    ),
    intro: t(
      "An expository text explains one thing and what marks it out. “蜻蜓的眼睛” explains the dragonfly's compound eye: made of many small eyes, seeing all round, quick to catch movement.\n\nIt explains them by methods: “大约有一万到两万八千只小眼” gives figures, “就像用许多小方块拼成的拼图” likens, “人的眼睛只能看到前面” compares. The first knowledge point asks the object and its features, the second the methods and what they do.",
      "说明文说明一个对象，抓住它的特征。《蜻蜓的眼睛》说明的是蜻蜓的复眼：由许多小眼组成，视野开阔，对运动的东西特别敏感。\n\n说明要用方法：“大约有一万到两万八千只小眼”是列数字，“就像用许多小方块拼成的拼图”是打比方，“人的眼睛只能看到前面”是作比较。第一个知识点问说明对象和特征，第二个问说明方法和作用。",
    ),
    data: EXPOSITORY_7,
    kind: PASSAGE,
    after: "reading-6-expository",
    points: [
      [
        "object",
        t("The Object and Its Features", "说明对象和特征"),
        t(
          "The object is what the whole text is about: often in the title or the first paragraph, and named again in each part. Its features are what each paragraph says of it, often in the paragraph's first sentence.\n\n“榫卯” asks “靠的是什么？是榫卯”, then says what it is, its kinds and why it holds better than nails: the object is the mortise and tenon, firm without a nail.\n\n> **Watch out.** A thing brought in as an example or for comparison, such as the nail or the wooden pagoda, is not the object; and one feature is not all of them.",
          "说明对象是全文说明的那个事物，常常在标题或第一段，各部分又反复提到它。特征是每一段说的它的特点，常常在段首的句子里。\n\n《榫卯》先问“靠的是什么？是榫卯”，再说它是什么、有哪些样子、为什么比钉子结实：说明对象是榫卯，特征是不用钉子也很结实。\n\n> **注意。** 拿来举例、作比较的东西，比如钉子、应县木塔，不是说明对象；只说一个特点，也不是全部特征。",
        ),
      ],
      [
        "method",
        t("Methods and Their Effect", "说明方法及其作用"),
        t(
          "Name the method by what the sentence does: a general “……是……” defines; figures give numbers; an instance gives an example; setting beside another compares; sorting into kinds classifies; likening to something familiar is analogy; quoting a saying or record cites. Then say its effect: which feature it makes exact, concrete or vivid.\n\n“比同样多的大米还多” compares tofu with rice and brings out how much protein it has.\n\n> **Watch out.** Name the method and its effect on this object, not a general remark; and a word like “大约” or “几乎” is kept for accuracy, not dropped for brevity.",
          "按句子怎样说明来认方法：用“……是……”概括地说明它是什么，是下定义；用数字，是列数字；举出具体的事物，是举例子；拿别的东西来比，是作比较；分成几类来说，是分类别；比作人们熟悉的东西，是打比方；引用俗语、诗文、资料，是引用。再说作用：把对象的哪个特征说得准确、具体或形象。\n\n“比同样多的大米还多”拿豆腐和大米比，突出了豆腐蛋白质多、营养丰富。\n\n> **注意。** 说作用要结合这个对象的特征，不能只说空话；“大约”“几乎”这样的词是为了说得准确，不能为了简洁去掉。",
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "reading-7-news",
    title: t("News", "读新闻：要素和观点"),
    summary: t(
      "News reports written for the subject: their title, lead and elements, and the facts they report against the views in them.",
      "读为本学科写的新闻：标题、导语和新闻的要素，分清报道的事实和其中的观点。",
    ),
    intro: t(
      "A news report answers when, where, who, what, why and how, and puts the main event first: in its title, then in its lead, the first paragraph. “青溪镇小学生在河边救起落水儿童” opens with the time, the place, the two pupils and the rescue; the course of it and the background follow.\n\nA report gives facts and, here and there, views: “经检查，男孩没有受伤” can be checked; “值得大家学习” is the reporter's judgment. The first knowledge point asks the title, lead and elements, the second facts and views.",
      "新闻要交代时间、地点、人物和事件的起因、经过、结果，并且把最重要的事放在前面：先是标题，再是第一段导语。《青溪镇小学生在河边救起落水儿童》第一段就交代了时间、地点、两名学生和救人的结果，后面才写经过和背景。\n\n新闻报道事实，有时也带着看法：“经检查，男孩没有受伤”是可以查证的事实，“值得大家学习”是记者的评价。第一个知识点问标题、导语和新闻要素，第二个问事实和观点。",
    ),
    data: NEWS_7,
    kind: PASSAGE,
    after: "reading-6-browsing",
    points: [
      [
        "elements",
        t("Title, Lead and Elements", "标题、导语和要素"),
        t(
          "The title sums up the event in a line; the lead, the first paragraph, gives the main event with its time, place and people; the body tells how it went; the background tells what lies behind it. For a detail, find the paragraph that tells it.\n\nIn “九十岁老人手绘家乡地图”, the lead gives “近日”, “石桥村”, “九十岁的陈老伯” and the map on show: the four elements of the event.\n\n> **Watch out.** The lead is the first paragraph, not the most moving one; and an element must belong to the event reported, not to the past it recalls.",
          "标题用一句话概括新闻事件；导语是第一段，交代最主要的事和它的时间、地点、人物；主体写事情的经过；背景交代事情发生的原因和条件。问细节，要找到写这件事的那一段。\n\n《九十岁老人手绘家乡地图》的导语交代了“近日”“石桥村”“九十岁的陈老伯”和地图展出：这就是这件事的要素。\n\n> **注意。** 导语是第一段，不是写得最感人的那一段；要素要是这条新闻报道的事，不能是文中回忆的过去的事。",
        ),
      ],
      [
        "fact",
        t("Facts and Views", "事实和观点"),
        t(
          "A fact is something that happened and can be checked: a date, a number, what someone did. A view is a judgment or feeling about it: words like “值得”, “可贵”, “让……多了一份……”, or a suggestion. Ask also whose view it is: the reporter's, or someone the report quotes.\n\n“开放第一周，二十个书亭共借出书八百多本” is a fact; “小小书亭，让公园里多了一份书香” is the reporter's view.\n\n> **Watch out.** A view in quotation marks belongs to the person quoted, not to the reporter; and a fact told warmly is still a fact.",
          "事实是发生了的、可以查证的事：日期、数字、谁做了什么。观点是对事情的评价、感受或建议，常常带着“值得”“可贵”“让……多了一份……”这样的词。还要看是谁的观点：记者的，还是记者引用的某个人的。\n\n“开放第一周，二十个书亭共借出书八百多本”是事实；“小小书亭，让公园里多了一份书香”是记者的观点。\n\n> **注意。** 引号里的看法是被引用的人的，不是记者的；用带感情的话说出来的事实，仍然是事实。",
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "reading-7-classical",
    title: t("Easy Classical Prose", "阅读浅易文言文"),
    summary: t(
      "Short classical passages in the public domain, with notes: words the notes leave out, inferred from their context, and what each passage says.",
      "读公有领域的浅易文言短文，附注释：注释没有讲的词语，结合上下文推断词义；读懂文章的内容和道理。",
    ),
    intro: t(
      "Classical prose is read with its notes, but not every word is glossed, and a word can be inferred from its context. In “守株待兔”, “因释其耒而守株，冀复得兔”: to keep watch by the stump the farmer must lay his plough aside, so 释 is “put down”; he watches because he hopes for another hare, so 冀 is “hope”.\n\nThen ask what it says: the hare never comes again, and “而身为宋国笑”, he becomes the laughing stock of Song. The first knowledge point asks words from their context, the second what the passage says and teaches.",
      "读文言文要借助注释，可注释不会把每个词都讲到，没讲的词可以结合上下文推断。《守株待兔》“因释其耒而守株，冀复得兔”：种田人要守着树桩，手里的农具总得放下，所以“释”是放下；他守着树桩，是盼着再捡到兔子，所以“冀”是希望。\n\n再想文章说了什么：兔子再也没有来，“而身为宋国笑”，他成了宋国人的笑柄。第一个知识点问结合上下文推断词义，第二个问文章的内容和道理。",
    ),
    data: CLASSICAL_7,
    kind: PASSAGE,
    after: "classical-function-words-6-01",
    points: [
      [
        "words",
        t("Words From Their Context", "结合上下文推断词义"),
        t(
          "When the notes leave a word out, find it in its sentence and read what comes before and after: who does what, what answers it, what it is set against. Guess the meaning that joins them, then put it back in the sentence and see that it reads. Many classical words are written as today but mean something else.\n\nIn “司马光”, a boy falls into a great jar, “众皆弃去”, and only Sima Guang breaks the jar with a stone: set against the one who stays to save him, the others leave him, so 弃去 is “abandon and go away”, and 去 is “leave”.\n\n> **Watch out.** The meaning a word has today is the usual trap: 去 in classical prose is often “to leave”, not “to go to”; 汤 is “hot water”, 妻子 “wife and children”. A meaning that does not fit both the sentence and what is around it is wrong.",
          "注释没有讲的词，先在句子里找到它，再看前后文：谁做了什么，后面怎样回应，和什么对着说。推出一个能把前后连起来的意思，再放回原句，看讲不讲得通。很多文言词写法和今天一样，意思却不同。\n\n《司马光》里，一个孩子掉进大缸，“众皆弃去”，只有司马光拿石头砸破了缸：和留下来救人的司马光对着看，别的孩子是丢下他走开了，所以“弃去”是丢下跑开，“去”是离开。\n\n> **注意。** 最容易错的是用今天的意思去理解：文言里的“去”常常是“离开”，不是“到……去”；“汤”是“热水”，“妻子”是“妻子和儿女”。一个意思放进原句讲不通，或者和前后文对不上，就不对。",
        ),
      ],
      [
        "meaning",
        t("What the Passage Says", "文章的内容和道理"),
        t(
          "Tell the story in modern Chinese: who, what happened, how it ended. Then find the sentence where the passage says its point, often a speech or the last line, and draw the lesson from the whole of it.\n\nIn “自相矛盾”, a man boasts that his spear pierces anything and his shield stops everything; asked “以子之矛，陷子之盾，何如”, he has no answer: what one says must hold together.\n\n> **Watch out.** The lesson comes from the whole story, not from one of its details: “守株待兔” is not about a hare that hit a stump, but about waiting for luck to come again instead of working.",
          "先用现代汉语说一说故事：谁、发生了什么、结果怎样。再找文中点明意思的句子，常常是人物的话或最后一句，从全文得出道理。\n\n《自相矛盾》里，卖矛和盾的人夸自己的矛什么都能刺穿，盾什么都刺不穿；有人问“以子之矛，陷子之盾，何如”，他答不上来：说话做事要前后一致。\n\n> **注意。** 道理要从整个故事得出，不能只抓一个细节：《守株待兔》讲的不是兔子撞上了树桩，而是不能不劳动，只盼着偶然的好运再来。",
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "reading-7-poems",
    title: t("Classical Poems", "古诗词鉴赏"),
    summary: t(
      "Classical poems in the public domain, with notes: the images and scene their lines paint, and the feeling they carry.",
      "读公有领域的古诗，附注释：诗中的意象和意境，诗人表达的感情。",
    ),
    intro: t(
      "A classical poem builds a scene from images, things seen and heard, and carries a feeling through it. In “枫桥夜泊”, the setting moon, the crows, the frost, the maples and the fishing lights make an autumn night on the river, cold and lonely.\n\nThe feeling is named in one word, “愁”, and deepened by the midnight bell that reaches a traveller who cannot sleep. The first knowledge point asks the images and the scene, the second the feeling.",
      "古诗用意象，也就是诗中写到的景物，组成一幅画面，借它表达感情。《枫桥夜泊》里，落月、啼乌、满天的霜、江枫和渔火，组成了一个清冷孤寂的秋夜江景。\n\n感情由一个“愁”字点出，又被半夜传到客船的钟声加深：诗人一夜没睡。第一个知识点问意象和画面，第二个问感情。",
    ),
    data: POEMS_7,
    kind: POEM,
    after: "reading-6-poems",
    points: [
      [
        "scene",
        t("Images and Scene", "意象和画面"),
        t(
          "List the things a line names, read their notes, and join them into a picture: the time, the place, the colours and sounds. Then say what mood the picture has: bright, still, cold, lively.\n\nIn “山居秋暝”, “明月松间照，清泉石上流” names the moon, the pines, the spring and the stones: a clear, quiet autumn evening in the hills.\n\n> **Watch out.** Read a word as the poem uses it: 绿 in “春风又绿江南岸” is “turned green”, and 可怜 in “暮江吟” is “lovely”, not “pitiful”.",
          "先找出诗句写了哪些景物，读一读注释，再把它们连成一幅画面：什么时候、在哪里、有什么颜色和声音。然后说说这幅画面给人什么感觉：明丽、幽静、清冷还是热闹。\n\n《山居秋暝》“明月松间照，清泉石上流”写了明月、松树、清泉和石头，组成了雨后秋山清新幽静的画面。\n\n> **注意。** 词语要按诗中的用法理解：“春风又绿江南岸”的“绿”是“吹绿”，《暮江吟》的“可怜”是“可爱”，不是“值得同情”。",
        ),
      ],
      [
        "feeling",
        t("The Feeling", "诗人的感情"),
        t(
          "Find the word or line where the feeling shows, often the last couplet, and read the scene before it as leading there. Name the feeling and what it is for.\n\n“泊船瓜洲” ends “明月何时照我还”: home is only a few hills away, yet the poet cannot go; the line carries his longing for home.\n\n> **Watch out.** A bright scene may serve a sad feeling, as the fresh willows of “送元二使安西” serve a parting; and a poem written alone is not always lonely: in “独坐敬亭山” the poet and the mountain “相看两不厌”, content in each other.",
          "找到最能表现感情的字词或诗句，常常在最后两句，再看前面的景物怎样为它铺垫。说出是什么感情、对什么的感情。\n\n《泊船瓜洲》最后一句是“明月何时照我还”：家乡只隔几重山，诗人却回不去，表达了思念家乡的感情。\n\n> **注意。** 景色明丽，也可能衬托离别之情，比如《送元二使安西》的青青柳色；一个人独坐，也不一定孤独，《独坐敬亭山》里的诗人和山“相看两不厌”，自得其乐。",
        ),
      ],
    ],
  },
];

/** stageSevenNineReading are the reading topics of grades 7 to 9, in order, each after the reading before it. */
export const stageSevenNineReading: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of SPECS)
    built.push(
      topicOf(
        spec,
        [...stageReadingTopics, ...stageThreeFourReading, ...stageFiveSixReading, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
