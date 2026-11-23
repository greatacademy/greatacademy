// The reading topics of grades 7 to 9 (docs/chinese-curriculum.md §18.9). Grade 7 reads the thread, order and detail of
// narratives, the ways of describing and their effect, prose for its language and feeling, exposition for its object,
// features and methods, news for its elements and its facts against its views, easy classical prose with notes, and
// classical poems for their images and feeling. Grade 8 reads exposition for its order and language, science writing for
// its method and spirit, arguments for their claims and material, non-continuous texts of several materials, fiction for
// its plot and people, classical prose for its words, sentences and lesson, and classical poems for the force of their
// words and their methods and feeling. Grade 9 reads arguments for their methods and line, fiction for its theme and
// craft, drama for its conflict and lines, pieces of several kinds for their modes, forms and what is real or made up,
// materials of several media on one matter, classical prose for its words and how it makes its point, and classical
// poems for their famous lines and the poet behind them. Each topic asks two knowledge points of its ten texts, three
// questions a text, and each comes after the recognition batch by which nearly every character of its texts has been
// taught.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageReadingTopics } from "./stage-1-2.ts";
import { stageThreeFourReading } from "./stage-3-4.ts";
import { stageFiveSixReading } from "./stage-5-6.ts";
import { DESCRIPTION_7, NARRATIVE_7 } from "./texts-7a.ts";
import { EXPOSITORY_7, PROSE_7 } from "./texts-7b.ts";
import { CLASSICAL_7, NEWS_7, POEMS_7 } from "./texts-7c.ts";
import { EXPOSITORY_8, SCIENCE_8 } from "./texts-8a.ts";
import { ARGUMENT_8, NONCONT_8 } from "./texts-8b.ts";
import { FICTION_8 } from "./texts-8c.ts";
import { CLASSICAL_8, POEMS_8 } from "./texts-8d.ts";
import { ARGUMENT_9, FICTION_9 } from "./texts-9a.ts";
import { DRAMA_9, FORMS_9 } from "./texts-9b.ts";
import { CROSSMEDIA_9 } from "./texts-9c.ts";
import { CLASSICAL_9, POEMS_9 } from "./texts-9d.ts";
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
  {
    grade: 8,
    id: "reading-8-expository",
    title: t("Exposition: Order and Language", "说明顺序和说明语言"),
    summary: t(
      "Expository texts written for the subject: the order each explains in, and how its words keep it accurate and lively.",
      "读为本学科写的说明文：按什么顺序说明，说明语言怎样做到准确、生动。",
    ),
    intro: t(
      "An exposition explains in an order that fits its object. A text on making dumplings goes 和面, 擀皮, 包馅, 下锅: the order of the steps, a time order. A text on a pagoda going from its base to its top is in space order; a text on why rain falls, from rising vapour to falling drops, is in logical order.\n\nIts language is exact: “长江全长约6300千米” says 约 because the length is measured, not counted to the metre. The first knowledge point asks the order, the second the language.",
      "说明文要按合适的顺序来说明。一篇介绍包饺子的文章，按和面、擀皮、包馅、下锅来写，是按工序先后的时间顺序；介绍一座塔从塔基写到塔顶，是空间顺序；讲雨是怎样形成的，从水汽上升写到雨滴落下，是逻辑顺序。\n\n说明语言要准确：“长江全长约6300千米”用了“约”，因为长度是测量出来的，不可能精确到每一米。第一个知识点问说明顺序，第二个问说明语言。",
    ),
    data: EXPOSITORY_8,
    kind: PASSAGE,
    after: "reading-7-expository",
    points: [
      [
        "order",
        t("The Order of Explaining", "说明顺序"),
        t(
          "Ask how the parts follow each other. Steps of making, stages of growing or the course of an event: time order, marked by 先, 接着, 然后, 最后 or dates. Outside to inside, bottom to top, front to back: space order, marked by words of place. Phenomenon to cause, cause to effect, general to particular, main to minor: logical order.\n\nA text on a bridge that goes “桥面……桥墩……桥基” moves downward through space; a text that asks “为什么竹子长得快” and answers step by step goes from the phenomenon to its cause.\n\n> **Watch out.** Time words in a text do not make it time order: say what the whole text is arranged by. And a text has one main order but a paragraph may use another, as a space-order text on a house may give the cause of one feature in logical order.",
          "看各部分是按什么先后排列的。按制作的步骤、生长的阶段、事情的发展来写，是时间顺序，常有“先”“接着”“然后”“最后”或年代日期；按由外到内、由下到上、由前到后来写，是空间顺序，常有表示方位的词；按由现象到本质、由原因到结果、由总到分、由主到次来写，是逻辑顺序。\n\n一篇介绍桥的文章写“桥面……桥墩……桥基”，是由上到下的空间顺序；一篇文章先问“为什么竹子长得快”，再一步步回答，是由现象到原因的逻辑顺序。\n\n> **注意。** 文中出现了时间词，不一定就是时间顺序，要看全文是按什么来安排的。一篇文章以一种顺序为主，某一段也可能用别的顺序，比如按空间顺序介绍房屋，讲某个特点的原因时就用了逻辑顺序。",
        ),
      ],
      [
        "language",
        t("Accurate and Lively Language", "说明语言的准确和生动"),
        t(
          "Accuracy lives in small words: 约, 左右, 一般, 往往, 几乎, 可能, 主要, 只. Asked whether one can be dropped, answer in three steps: no; it means this (an estimate, most cases, a guess); without it the sentence says too much or does not fit the facts. Liveliness comes from likening, personifying and quotation marks for special senses.\n\n“大熊猫一般以竹子为食”: 一般 says most of the time, for pandas also eat other things now and then; without it they would eat nothing but bamboo, which is not so.\n\n> **Watch out.** Do not answer only “it would be inaccurate”: say what the word means and how the sense changes without it. And not every small word limits: 只 and 才 may stress how little or how hard, as in “一天只能采两斤”.",
          "说明语言的准确，常常体现在一些小词上：“约”“左右”“一般”“往往”“几乎”“可能”“主要”“只”。问能不能去掉，可以分三步答：不能；这个词表示什么（估计、大多数情况、推测）；去掉以后意思变成什么，说得太绝对或不符合事实。说明语言的生动，来自打比方、拟人，以及表示特殊含义的引号。\n\n“大熊猫一般以竹子为食”：“一般”表示大多数时候如此，大熊猫偶尔也吃别的东西；去掉它，就成了只吃竹子，和事实不符。\n\n> **注意。** 不要只答“去掉后不准确”，要说出这个词的意思和去掉后意思的变化。也不是每个小词都表示限制：“只”“才”有时是强调数量少、来得难，比如“一天只能采两斤”。",
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "reading-8-science",
    title: t("Science Writing: Method and Spirit", "读科技作品：科学精神和方法"),
    summary: t(
      "Accounts of discoveries written for the subject: what each found and by what method, and the spirit of science it shows.",
      "读为本学科写的科学发现故事：发现了什么，用的是什么方法，表现了怎样的科学精神。",
    ),
    intro: t(
      "A piece of science writing tells a discovery: the question, the method and the finding. Darwin sailed round the world for five years, noting and collecting plants and animals; he compared the finches of different islands, and only after more than twenty years of further work did he publish his theory.\n\nThe method is long observation and comparison; the spirit is patience and care, holding back until the evidence is enough. The first knowledge point asks the finding and the method, the second the spirit.",
      "科技作品讲一个发现：提出了什么问题，用了什么方法，得出了什么结论。达尔文随船环球航行五年，一路观察、记录、采集动植物；他比较了不同岛屿上的雀鸟，又研究了二十多年，才发表自己的学说。\n\n他的方法是长期观察和比较，表现的精神是耐心和严谨：证据不够，就不急着下结论。第一个知识点问发现和方法，第二个问科学精神。",
    ),
    data: SCIENCE_8,
    kind: PASSAGE,
    after: "reading-8-expository",
    points: [
      [
        "method",
        t("The Finding and the Method", "发现和方法"),
        t(
          "Find the question the scientist asked, then follow what was done: watched what happens of itself (observation); changed a condition on purpose and saw what followed (experiment); set two cases side by side that differ in one thing only (comparison); kept notes over years (long recording). Then say what was found.\n\nTu Youyou's team tested herb after herb against malaria; when wormwood boiled in water failed, she tried soaking it in ether at a low temperature, and sample 191 worked: an experiment that changed one condition, the heat.\n\n> **Watch out.** “He did an experiment” is not enough: say what was changed and what was compared. And observation is not experiment: watching ants carry food is observing; putting sugar in different places to see where they go is experimenting.",
          "先找到科学家提出的问题，再看他做了什么：观察自然发生的现象，是观察；有意改变一个条件，看会发生什么，是实验；把只差一个条件的两种情况放在一起看，是对比；几年、几十年坚持记下来，是长期记录。最后说出得到了什么结论。\n\n屠呦呦的团队一种一种地试中药治疟疾；青蒿用水煎煮效果不好，她改用乙醚在低温下提取，第191号样品终于成功了：这个实验改变的是一个条件，也就是温度。\n\n> **注意。** 只答“做了实验”不够，要说出改变了什么、比较了什么。观察和实验也不一样：看蚂蚁搬家是观察，把糖放在不同的地方、看蚂蚁往哪里去是实验。",
        ),
      ],
      [
        "spirit",
        t("The Spirit of Science", "科学精神"),
        t(
          "Read the spirit from what the person does, then name it: doubting what all believe and testing it (questioning); trusting what is seen over what is written (respect for fact); excluding every other cause before concluding (care); working on for years (perseverance); handing the work on to others (cooperation); using what is found for people's good.\n\nCopernicus doubted that the sun went round the earth, worked over his figures for decades, and published only at the end of his life: questioning, and great care.\n\n> **Watch out.** Draw the spirit from this text, not from a stock phrase: if the text tells of trying again and again for years, the answer is perseverance, not courage. And luck is never the answer: a chance is taken only by one who watches and thinks.",
          "从人物的做法里读出精神，再说出它的名字：敢于怀疑大家都相信的说法，并去验证，是质疑精神；相信亲眼看到的事实，不迷信书本，是求实；先排除别的可能再下结论，是严谨；几年几十年坚持不懈，是执着；一代代接力、众人合作，是合作；把发现用来为人们造福，是造福人类。\n\n哥白尼怀疑太阳绕着地球转的旧说法，几十年反复计算，到晚年才发表自己的学说：这是质疑精神，也是严谨。\n\n> **注意。** 精神要从这篇文章里概括，不能套话：文中写的是多年一次次地试，答的就该是执着，而不是勇敢。“运气好”从来不是答案：机会只留给善于观察、勤于思考的人。",
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "reading-8-argument",
    title: t("Argument: Claim and Material", "议论文：观点和材料"),
    summary: t(
      "Arguments written for the subject: the central claim and the claims under it, and the factual and reasoned material that proves them.",
      "读为本学科写的议论文：中心论点和分论点，事实论据和道理论据怎样证明观点。",
    ),
    intro: t(
      "An argument states a claim and proves it with material. An essay “谈勤奋” claims “天才出于勤奋”; it tells how a young calligrapher practised until the pond he washed his brushes in turned black: a fact. It quotes Han Yu, “业精于勤，荒于嬉”: a reason.\n\nBoth serve the claim: the fact shows it happens, the saying shows why. The first knowledge point asks the claim, the second the material.",
      "议论文提出观点，再用材料来证明。一篇《谈勤奋》提出“天才出于勤奋”；它讲一位少年苦练书法，洗笔的池水都变黑了，这是事实论据；又引用韩愈的话“业精于勤，荒于嬉”，这是道理论据。\n\n两种材料都为观点服务：事实说明确实如此，道理说明为什么如此。第一个知识点问观点，第二个问材料。",
    ),
    data: ARGUMENT_8,
    kind: PASSAGE,
    after: "reading-6-argument",
    points: [
      [
        "claim",
        t("The Central Claim and the Claims Under It", "中心论点和分论点"),
        t(
          "The central claim is a whole sentence that says what the writer holds: look at the opening and the end, often after 我认为 or 所以. It may be put at once, drawn from a saying, or set against a view the writer rejects. Claims under it open the middle paragraphs, each proving one side of it.\n\nIn “谈读书”, “读书使人明智” is the central claim; “读书能开阔眼界” and “读书能培养思考” open the next two paragraphs: they are claims under it.\n\n> **Watch out.** A claim is a judgment, not a topic or an example: “读书” is a topic and “他每天读一小时” is an example; only “读书使人明智” takes a side. And a claim under it is narrower than the central claim: do not give one for the other.",
          "中心论点是表明作者看法的一个完整的句子，常在开头或结尾，前面常有“我认为”“所以”。它可以开门见山地提出，可以由一句名言引出，也可以先摆出一种说法再反驳。分论点常在中间各段的开头，每个分论点从一个方面证明中心论点。\n\n《谈读书》里，“读书使人明智”是中心论点；后面两段开头的“读书能开阔眼界”“读书能培养思考”是分论点。\n\n> **注意。** 论点是判断，不是话题，也不是事例：“读书”是话题，“他每天读一小时”是事例，只有“读书使人明智”表明了态度。分论点比中心论点范围小，二者不要混淆。",
        ),
      ],
      [
        "material",
        t("Factual and Reasoned Material", "事实论据和道理论据"),
        t(
          "Material is what proves a claim. A person, an event, a figure: factual material. A saying, a proverb, a principle or a step of reasoning: reasoned material. Ask what a piece of material proves, and answer with the claim it serves, often the one that opens its paragraph. Name the method too: an example, a quotation, a comparison of right and wrong, a likening, a supposition with 如果.\n\nIn “谈读书”, “她读遍了家乡的地方志，写出了一本村史” is factual material for “读书能开阔眼界”, not for the whole essay in general.\n\n> **Watch out.** Do not retell the example when asked what it proves: give the claim. A quotation is reasoned material even though it is a real person's words. And a likening is not an example: reading likened to talking with noble minds proves nothing by fact, it makes the reasoning plain.",
          "论据是用来证明论点的材料。人物、事件、数字是事实论据；名言、俗语、道理和一步步的推理是道理论据。问一个论据证明了什么，要答出它支持的那个论点，常常就是这一段开头的分论点。还要会说论证方法：举例论证、道理论证（引用论证）、对比论证、比喻论证，用“如果”从反面设想的是假设论证。\n\n《谈读书》里，“她读遍了家乡的地方志，写出了一本村史”是事实论据，证明的是“读书能开阔眼界”，而不是笼统的全文。\n\n> **注意。** 问事例证明了什么，不要复述事例，要答出观点。名言虽然是真人说的话，却是道理论据。比喻也不是事例：把读书比作和高尚的人谈话，不是用事实证明，而是把道理讲得浅显易懂。",
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "reading-8-non-continuous",
    title: t("Complex Non-continuous Texts", "较复杂的非连续性文本"),
    summary: t(
      "Two or three materials a piece, tables, notices and lists made up for the subject: what they say together, and how to use it.",
      "读为本学科编写的组合材料：表格、须知、清单两三则一组，把信息整合起来，再用来得出结论、解决问题。",
    ),
    intro: t(
      "A complex non-continuous text gives several materials at once: a cinema's timetable, its prices and its rules. To know what a family pays for the 19:30 film, one must take the price from one material and the discount for children from another.\n\nThe answer lies across materials, not in one line. The first knowledge point asks to find and put together what they say, the second to draw a conclusion or solve a problem with it.",
      "较复杂的非连续性文本同时给出几则材料：比如一家电影院的排片表、票价表和观影须知。想知道一家人看19:30那一场要花多少钱，就得从一则材料里找票价，再从另一则材料里找儿童优惠。\n\n答案分散在几则材料里，不在某一行。第一个知识点问查找和整合信息，第二个问用信息得出结论、解决问题。",
    ),
    data: NONCONT_8,
    kind: PASSAGE,
    after: "reading-6-non-continuous",
    points: [
      [
        "find",
        t("Finding and Putting Together", "查找和整合信息"),
        t(
          "Read what each material is for, then find every line the question needs: a figure in a table, a rule in a notice. Join them, and reckon when a sum or a difference is asked, checking the units.\n\nA timetable says a show “19:30开，21:10散场”; asked how long it runs, take both times: 21:10 less 19:30 is 1 hour 40 minutes.\n\n> **Watch out.** A figure next to the one asked is the usual trap: read the row and the column together. And a share is not a count: “占30%” and “90人” are the same group told two ways.",
          "先弄清每一则材料是干什么的，再把问题需要的每一处都找出来：表格里的数字，须知里的规定。把它们合起来，问到总数、差数时还要算一算，注意单位。\n\n排片表上写着“19:30开，21:10散场”，问放映多长时间，要把两个时间都找出来：21:10减去19:30，是1小时40分钟。\n\n> **注意。** 最容易看错的是旁边的数字：要把行和列对齐了再读。百分数和人数也不一样：“占30%”和“90人”说的是同一群人的两种说法。",
        ),
      ],
      [
        "apply",
        t("Drawing Conclusions and Solving Problems", "得出结论和解决问题"),
        t(
          "To draw a conclusion, look at how the figures change or compare, and say only what they support. To solve a problem, put the person's case against every rule that touches it. To pick the fitting advice, match it to the cause the materials name.\n\nA cinema rule says children under 1.2 m go free with an adult and children of 1.2 to 1.5 m pay half: a mother with a child of 1.1 m and one of 1.3 m pays one full ticket and one half.\n\n> **Watch out.** A true line may have nothing to do with the question: the parking fee of a cinema does nothing for the price of a ticket. And a conclusion must not go beyond the materials: a survey of one class says nothing of all pupils.",
          "得出结论，要看数字怎样变化、怎样比较，只说材料能支持的话。解决问题，要把人物的情况和每一条相关的规定对照起来。选最合适的建议，要看它是不是针对材料里找出的原因。\n\n电影院规定，身高不足1.2米的儿童由成人带领免票，1.2米到1.5米的儿童半价：妈妈带着1.1米和1.3米的两个孩子，要买一张全票、一张半价票。\n\n> **注意。** 有的信息是真的，却和问题无关：电影院停车场的收费，和电影票价没有关系。结论也不能超出材料：一个班的调查，说明不了所有学生的情况。",
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "reading-8-fiction",
    title: t("Fiction: Plot and People", "读小说：情节和人物"),
    summary: t(
      "Short stories written for the subject: how each plot is built and turns, and the people it shows.",
      "读为本学科写的短篇小说：情节怎样安排、怎样转折，塑造了怎样的人物形象。",
    ),
    intro: t(
      "A story's plot opens, develops, rises to a climax and ends, and may turn where no one expects. In O. Henry's “The Gift of the Magi”, a poor young wife sells her long hair to buy her husband a chain for his watch; he comes home having sold the watch to buy her combs for her hair.\n\nThe twist shows the people: each gave up the dearest thing for the other. The first knowledge point asks the plot, the second the people.",
      "小说的情节有开端、发展、高潮和结局，有时还会出人意料地转折。欧·亨利的《麦琪的礼物》里，一位贫穷的妻子卖掉了自己的长发，给丈夫的金表买了一条表链；丈夫回家时，却已经卖掉金表，给她买了一套梳头发的发梳。\n\n这个转折写出了人物：两个人都把自己最珍贵的东西献给了对方。第一个知识点问情节，第二个问人物形象。",
    ),
    data: FICTION_8,
    kind: PASSAGE,
    after: "reading-7-narrative",
    points: [
      [
        "plot",
        t("How the Plot Is Built", "情节的安排"),
        t(
          "Divide the plot into its opening, development, climax and end, each in a phrase. Then look for the devices: a hint early that the end explains (foreshadowing), a question held back to make the reader go on (suspense), an end that surprises yet fits all that came before.\n\nIn Maupassant's “The Necklace”, a woman loses a borrowed necklace and spends ten years repaying a new one, then learns the first was paste. The friend lent it without a second thought: an early hint that it was not worth much.\n\n> **Watch out.** A surprising end must still fit: find the earlier line it answers. And the climax is the turning point of the conflict, not merely the last paragraph.",
          "先把情节分成开端、发展、高潮、结局，每部分用一句话概括。再找写法：前面埋下线索、后面才说明白，是伏笔和照应；把一个疑问留着不说，吸引读者读下去，是设置悬念；结尾出人意料，又和前文处处相合，是出人意料又在情理之中。\n\n莫泊桑的《项链》里，女主人公丢了借来的项链，用十年还清买新项链的债，最后才知道原来那条是假的。朋友当初借给她时毫不犹豫，就是一处伏笔：那条项链本来不值什么钱。\n\n> **注意。** 出人意料的结尾也要合情理，要找出前文和它照应的地方。高潮是矛盾冲突最尖锐、发生转折的地方，不一定就是最后一段。",
        ),
      ],
      [
        "people",
        t("The People of the Story", "人物形象"),
        t(
          "Read a person from what the story gives: looks and expression, actions, words, thoughts, a small detail, how others see them, the setting around them. Say what each shows, then sum the person up in a few words drawn from the whole story.\n\nIn “The Gift of the Magi”, the wife counts her money three times: one dollar eighty-seven. The detail shows how poor they are, and how much she wants to give.\n\n> **Watch out.** Sum a person up from the whole story, not from the first impression: a stern teacher at the start may be the one who cares most. And read beneath the words: “我不饿” may be said to give the meal away.",
          "从小说写到的地方读人物：外貌神态、动作、语言、心理、一处细节、别人眼中的他、他身边的环境。说出每一处表现了什么，再从全文概括出人物是一个怎样的人。\n\n《麦琪的礼物》里，妻子把自己的钱数了三遍：一块八毛七。这个细节写出了他们的贫穷，也写出了她多么想给丈夫一份礼物。\n\n> **注意。** 概括人物要看全文，不能只看开头的印象：开头很严厉的老师，到最后可能最关心学生。还要读出话里的意思：“我不饿”，可能是为了把饭让给别人。",
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "reading-8-classical",
    title: t("Classical Prose", "阅读文言文"),
    summary: t(
      "Classical passages in the public domain, with notes: words and sentences, read in their context and put into modern Chinese, and what each passage says of its people and its lesson.",
      "读公有领域的文言短文，附注释：结合语境理解词语和句子，译成现代汉语；读懂文章的内容、人物和道理。",
    ),
    intro: t(
      "Grade 8 reads longer classical passages and asks words and whole sentences. In Liu Zongyuan's “黔之驴”, a tiger watches the donkey “蔽林间窥之”, then “稍出近之”: 稍 today is “a little”, here “gradually”, for the tiger comes nearer step by step.\n\nThen the people and the lesson: the tiger learns “技止此耳”, its skill is only this, and eats the donkey: a big look without real ability is found out. The first knowledge point asks words and sentences, the second the content and the lesson.",
      "八年级读篇幅更长的文言文，要理解词语，也要理解整句话的意思。柳宗元的《黔之驴》里，老虎“蔽林间窥之”，又“稍出近之”：“稍”今天是“稍微”，这里是“渐渐”，老虎一步步走近驴。\n\n再读人物和道理：老虎发现驴“技止此耳”，本领不过如此，就把它吃了：外表庞大而没有真本领，终究会被看穿。第一个知识点问词语和句子，第二个问内容和道理。",
    ),
    data: CLASSICAL_8,
    kind: PASSAGE,
    after: "reading-7-classical",
    points: [
      [
        "words",
        t("Words and Sentences", "词语和句子"),
        t(
          "For a word, find its sentence, then read who does what before and after, and pick the meaning that joins them. Watch words that look modern but mean otherwise, and words with several meanings. For a sentence, put every word into modern Chinese, add what is left out, and keep the order natural.\n\nIn “引婴投江”, “见人方引婴儿而欲投之江中”: 方 is “just then”, 引 “to drag”; the sentence is “看见一个人正拉着一个婴儿，想把他扔到江里”.\n\n> **Watch out.** Today's meaning is the trap: 稍 is “gradually”, 走 “to run”, 去 “to leave”. And a translation that drops a word or adds a thought the sentence does not hold is wrong, however smooth it reads.",
          "理解词语，先找到它所在的句子，再看前后文谁做了什么，选一个能把上下文连起来的意思。要特别留心古今意思不同的词和一词多义。理解句子，要把每个词都落实成现代汉语，补出省略的成分，语序要通顺。\n\n《引婴投江》里，“见人方引婴儿而欲投之江中”：“方”是正在，“引”是拉；整句的意思是“看见一个人正拉着一个婴儿，想把他扔到江里”。\n\n> **注意。** 最容易错的是用今天的意思去套：“稍”是渐渐，“走”是跑，“去”是离开。翻译时漏了词，或者加进原句没有的意思，读起来再通顺也不对。",
        ),
      ],
      [
        "meaning",
        t("People, Content and Lesson", "内容、人物和道理"),
        t(
          "Tell what happens in modern Chinese, then read each person from what they do and say, and find the line that gives the point, often a speech or the last sentence. Draw the lesson from the whole passage.\n\nIn “引婴投江”, the man says the child's father swims well; the writer asks “其父虽善游，其子岂遽善游哉”: what holds for one does not hold for another, and things must be judged as they are now.\n\n> **Watch out.** The lesson is the passage's, not one detail's: “引婴投江” is not about swimming. And say the lesson as the passage frames it, not as a slogan that would fit any story.",
          "先用现代汉语说说文章写了什么事，再从人物的言行看人物，找出点明意思的句子，常常是人物的话或最后一句。道理要从全文得出。\n\n《引婴投江》里，那人说孩子的父亲会游泳；作者问：“其父虽善游，其子岂遽善游哉？”父亲会的，孩子不一定会：看事情要从实际出发，不能想当然。\n\n> **注意。** 道理是全文的，不是某个细节的：《引婴投江》讲的不是游泳。说道理要扣住这篇文章，不能用一句放在哪个故事里都行的套话。",
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "reading-8-poems",
    title: t("Classical Poems: Words, Methods and Feeling", "古诗词鉴赏：炼字、写法和感情"),
    summary: t(
      "Classical poems in the public domain, with notes: the force of a chosen word or figure, and the methods by which a poem carries its feeling.",
      "读公有领域的古诗词，附注释：体会炼字和修辞的表达效果，理解借景抒情等写法和诗人的感情。",
    ),
    intro: t(
      "A poet weighs every word. Jia Dao wavered between 推 and 敲 for “僧敲月下门”: a knock makes a sound, and the sound makes the moonlit night feel stiller. That is the force of a word.\n\nA poem also has methods: Wang Ji's “蝉噪林逾静，鸟鸣山更幽” sets sound against silence, so the noise deepens the quiet. The first knowledge point asks the force of words and figures, the second the methods and the feeling.",
      "诗人写诗讲究炼字。贾岛写“僧敲月下门”，在“推”和“敲”之间反复斟酌：“敲”有声音，一点声音反而衬出月夜的寂静。这就是一个字的表达效果。\n\n诗还有写法：王籍的“蝉噪林逾静，鸟鸣山更幽”，用蝉噪鸟鸣来写山林的幽静，是以动衬静。第一个知识点问炼字和修辞，第二个问写法和感情。",
    ),
    data: POEMS_8,
    kind: POEM,
    after: "reading-7-poems",
    points: [
      [
        "words",
        t("The Force of a Word or Figure", "炼字和修辞"),
        t(
          "To say why a word is good, go in three steps: what it means here; what picture it makes in the line; what feeling or mood that picture carries. For a figure, name it, then say what it makes vivid.\n\nIn Du Fu's “感时花溅泪，恨别鸟惊心”, flowers seem to shed tears and birds to start: the poet lends his grief to them, personifying, and the grief of the war becomes something one sees.\n\n> **Watch out.** Do not stop at the meaning of the word: “敲 means knock” says nothing of why it is good. And a verb's force is often in what it shows of the poet, not only of the thing.",
          "说一个字好在哪里，可以分三步：这个字在诗中是什么意思；它写出了怎样的画面；这画面表现了怎样的感情或气氛。修辞要先说出是什么修辞，再说它把什么写得更生动。\n\n杜甫的“感时花溅泪，恨别鸟惊心”，花好像在流泪，鸟好像受了惊：诗人把自己的悲伤移到花鸟身上，用的是拟人，国破家散的伤痛就看得见了。\n\n> **注意。** 不能只解释字义：“敲是敲门”没有说出它好在哪里。动词的妙处，常常不只在写景物，更在于写出了诗人的心情。",
        ),
      ],
      [
        "feeling",
        t("Methods and Feeling", "写法和感情"),
        t(
          "Name the method and say what it does: a scene that carries the feeling (借景抒情); a bright scene against a sad heart (以乐景写哀); sound that deepens silence (以动衬静); the past against the present (对比); a thing seen standing for one far away (由此及彼). Then name the feeling and what it is for.\n\nIn “春望”, the spring grass is thick in the ruined city: a lush scene, yet it shows how empty the city is, a bright scene that deepens grief.\n\n> **Watch out.** A happy scene does not mean a happy poem: ask what the poet feels on seeing it. And name the feeling exactly, for whom or what: longing for home, sorrow at parting, frustration at talent unused.",
          "说出写法，再说它的作用：借景物表达感情，是借景抒情；用美好的景物反衬悲伤的心情，是以乐景写哀；用声响衬托寂静，是以动衬静；把从前和现在放在一起写，是对比；由眼前的事物想到远方的人，是由此及彼。最后说出是什么感情，对谁、对什么。\n\n《春望》里，“城春草木深”：长安城里春草长得很深，景色茂盛，却说明城中荒凉无人，是以乐景写哀，加深了悲痛。\n\n> **注意。** 景色欢快，不一定诗就欢快，要看诗人看到这景物时是什么心情。感情要说准确，说出是对什么的感情：思念家乡、离别的伤感、怀才不遇的苦闷。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-argument",
    title: t("Methods and Line of Argument", "论证方法和论证思路"),
    summary: t(
      "Arguments written for the subject: the methods by which each proves its claim, and the line along which it moves from start to end.",
      "读为本学科写的议论文：用了哪些论证方法、有什么作用，全文按怎样的思路一步步展开。",
    ),
    intro: t(
      "An argument proves its claim by methods and in an order. Han Yu's “师说” claims that everyone needs a teacher. It sets the sages of old, who still asked teachers, against people of his day, who are ashamed to learn: a comparison. It names Confucius, who learned from several men: an example.\n\nIt also moves in a line: first the claim, then why, then the wrong habits of the day, last what to do. The first knowledge point asks the methods and what they do, the second the line of argument.",
      "议论文用一定的方法、按一定的思路来证明观点。韩愈的《师说》认为，人人都需要老师。文章把古代的圣人和当时的一般人放在一起：圣人尚且向老师请教，一般人却以向别人学习为耻，这是对比论证；又举孔子向好几个人学习的事，这是举例论证。\n\n文章还有一条思路：先提出观点，再讲为什么，然后批评当时不好的风气，最后说应该怎样做。第一个知识点问论证方法和作用，第二个问论证思路。",
    ),
    data: ARGUMENT_9,
    kind: PASSAGE,
    after: "reading-8-argument",
    points: [
      [
        "methods",
        t("Methods of Argument", "论证方法"),
        t(
          "Name the method, then say what it proves. An example (举例论证) gives a fact that makes the claim concrete and believable. A reason (道理论证) cites a saying or explains why. A comparison (对比论证) sets right against wrong so the claim stands out. A likening (比喻论证) explains a hard idea through a familiar thing.\n\nAn essay on learning likens knowledge to bricks: only laid one by one do they rise into a tall building. A hard idea is made easy to see.\n\n> **Watch out.** The answer has three parts: the method, what it is used on, and the claim it proves. “用了举例论证，使文章生动” says nothing; say which fact proves which claim. And a story told to prove a point is an example, not a likening.",
          "先说出用了什么论证方法，再说它证明了什么。举出事实，使观点具体、可信，是举例论证；引用名言或讲清道理，是道理论证；把正反两方面放在一起比较，使观点更鲜明，是对比论证；用人们熟悉的事物来说明难懂的道理，是比喻论证。\n\n一篇谈学习的文章，把知识比作砖块：一块一块地垒，才能盖起高楼。把难懂的道理说得浅显易懂，这是比喻论证。\n\n> **注意。** 答作用要说全三点：什么方法，用在哪里，证明了什么观点。“用了举例论证，使文章生动”等于没说，要说出哪个事例证明了哪个观点。为了证明观点而讲的一件事，是举例论证，不是比喻论证。",
        ),
      ],
      [
        "line",
        t("The Line of Argument", "论证思路"),
        t(
          "Find what each part does: raise the question, give the claim, prove it, deal with the other side, and say what to do. Many arguments go “what, why, how” (是什么、为什么、怎么办); some set several reasons side by side, some go one step deeper each time, some prove the right side then the wrong.\n\nAn essay on sport might ask what exercise is for, answer that it trains the will as well as the body, prove it by two runners, then end with how to keep at it: what, why, how.\n\n> **Watch out.** A line of argument is the order of the reasoning, not a list of paragraphs: say what each part does for the claim. And the claim is often stated early but may be restated at the end; the end is not always a new idea.",
          "弄清每一部分在干什么：提出问题，摆出观点，证明观点，回应不同看法，提出做法。很多议论文按“是什么、为什么、怎么办”展开；有的把几个理由并列着讲，有的一层比一层深，有的先从正面讲、再从反面讲。\n\n一篇谈锻炼的文章，先问锻炼有什么用，再提出锻炼不只练身体，也练意志，用两个长跑的人的事来证明，最后讲怎样坚持下去：这就是“是什么、为什么、怎么办”的思路。\n\n> **注意。** 论证思路是推理的顺序，不是把段落一个个列出来，要说出每一部分对观点起什么作用。观点常常在开头提出，结尾也可能再说一遍，结尾不一定是一个新的意思。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-fiction",
    title: t("Fiction: Theme and Craft", "小说：主题和写法"),
    summary: t(
      "Short stories written for the subject: what each says beneath its events, and the craft by which it says it.",
      "读为本学科写的短篇小说：读出故事背后的主题，体会作者是用什么写法表现主题的。",
    ),
    intro: t(
      "A story says more than what happens. In Lu Xun's “孔乙己”, a poor scholar is laughed at by everyone in a wine shop, then disappears; nobody asks where he went. Beneath the events lies the theme: a cold world that crushed the weak and laughed as it did.\n\nThe craft serves it: the story is told by a boy who serves wine, who laughs along with the rest, so the coldness is shown, not stated. The first knowledge point asks the theme, the second the craft.",
      "小说说的不只是发生了什么事。鲁迅的《孔乙己》里，一个穷读书人在酒店里被大家取笑，后来再也没有出现，也没有人问起他去了哪里。故事背后是主题：那个冷漠的社会压垮了弱者，还把他当成笑料。\n\n写法为主题服务：小说借酒店里一个小伙计的眼睛来讲，小伙计也跟着大家笑，冷漠就不用说出来，读者自己就看到了。第一个知识点问主题，第二个问写法。",
    ),
    data: FICTION_9,
    kind: PASSAGE,
    after: "reading-8-fiction",
    points: [
      [
        "theme",
        t("The Theme", "主题"),
        t(
          "Find the theme from the whole story: what changes in the main person, how the conflict ends, and the lines that seem to carry more than they say, often near the end. Then say it as “the story, through …, shows …”, naming both the events and what they mean.\n\nIn Chekhov's “The Chameleon”, a police officer changes his verdict on a dog five times as he hears whose dog it is: the story mocks those who bow to power and bully the weak.\n\n> **Watch out.** A theme is not the plot retold: “讲了一只狗咬人的事” is the event, not the meaning. And it must come from the whole story, not from one person's single remark.",
          "主题要从全文读出来：主要人物有了什么变化，矛盾是怎样结束的，哪些话好像话里有话，这样的话常在结尾附近。再用“小说通过……，表现了……”的说法概括，既说出写了什么事，又说出这些事的意义。\n\n契诃夫的《变色龙》里，一个警官听说狗主人是谁，就改变一次对狗的判决，前后变了五次：小说讽刺了见到有权的人就讨好、见到弱者就欺负的人。\n\n> **注意。** 主题不是把情节再说一遍：“讲了一只狗咬人的事”只是事情，不是意义。主题要从全文得出，不能只凭某个人物说的一句话。",
        ),
      ],
      [
        "craft",
        t("The Craft", "写法"),
        t(
          "Name the device, then say what it does for the theme: who tells the story and what they can see (视角); a setting that sets the mood or foretells events; an object that runs through the story as its thread; two people or two moments set against each other (对比); an ending left open (留白).\n\nIn “The Chameleon”, the officer takes his coat off and puts it on again as his verdict changes: one object, used each time he turns, makes his changes visible.\n\n> **Watch out.** A device is answered by its effect on this story: “用了对比，突出人物” is too thin; say what is set against what, and what it shows. And the narrator “我” is a person in the story, not the author.",
          "先说出用了什么写法，再说它对表现主题起了什么作用：故事由谁来讲，他能看到什么，是叙述视角；环境渲染气氛，或者暗示情节的发展；一件物品贯穿全文，是线索；两个人、两个时刻放在一起写，是对比；结尾不把话说完，是留白。\n\n《变色龙》里，警官的判决每变一次，他就把大衣脱下或穿上：同一件大衣，用在他每一次转变的时候，把他的反复无常写得看得见。\n\n> **注意。** 答写法要落到这篇小说上：“用了对比，突出人物”太空，要说出把什么和什么对比，表现了什么。小说里的“我”是故事中的人物，不等于作者。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-drama",
    title: t("Drama: Conflict and Lines", "读戏剧：冲突和台词"),
    summary: t(
      "Short scenes written for the subject: the conflict each turns on and how it is settled, and what the lines and stage directions show beneath their words.",
      "读为本学科写的短剧片段：抓住戏剧冲突，看它怎样发展、怎样解决；品味台词和舞台说明的言外之意。",
    ),
    intro: t(
      "A play lives on conflict. In Shakespeare's “The Merchant of Venice”, Shylock demands a pound of flesh from the merchant who owes him money; in court, Portia grants it, but forbids him a drop of blood. The conflict rises to its height and turns in one line.\n\nA play has no narrator: only lines and stage directions. What the people do not say is often what matters. The first knowledge point asks the conflict, the second the lines and directions.",
      "戏剧离不开冲突。莎士比亚的《威尼斯商人》里，夏洛克要欠他钱的商人用一磅肉来还债；在法庭上，鲍西娅同意他割肉，却不许他流一滴血。冲突到了最尖锐的时候，一句话就让局面转了过来。\n\n戏剧没有叙述人，只有台词和舞台说明。人物没说出口的，往往最要紧。第一个知识点问戏剧冲突，第二个问台词和舞台说明。",
    ),
    data: DRAMA_9,
    kind: PASSAGE,
    after: "reading-9-fiction",
    points: [
      [
        "conflict",
        t("The Conflict", "戏剧冲突"),
        t(
          "Say who stands against whom, or what two wishes pull inside one person, and why. Then follow it: where it starts, where it is sharpest, the line or event that turns it, and how it ends, settled or only eased.\n\nIn Guan Hanqing's “窦娥冤”, Dou E, wrongly sentenced, swears that snow will fall in June if she is innocent: her cry against an unjust court is the height of the conflict.\n\n> **Watch out.** A conflict is a clash of wills or wishes, not a quarrel only: two people may not raise their voices at all. And an eased conflict is not a solved one: say what still remains.",
          "说出谁和谁对立，或者一个人心里哪两种想法在斗争，为什么。再看它怎样发展：从哪里开始，在哪里最尖锐，哪一句话或哪件事让它转折，最后怎样结束，是解决了，还是只是缓和了。\n\n关汉卿的《窦娥冤》里，窦娥被冤判死刑，临刑前发誓：如果她是冤枉的，六月就会下雪。她对不公的官府的控诉，是全剧冲突最尖锐的地方。\n\n> **注意。** 冲突是意愿和想法的对立，不只是吵架：两个人可能一句重话都没说。缓和了不等于解决了，要说出还剩下什么问题。",
        ),
      ],
      [
        "lines",
        t("Lines and Stage Directions", "台词和舞台说明"),
        t(
          "Read a line for what lies beneath it (潜台词): what the speaker means but does not say, found from the situation and the directions. Read how it fits the speaker: short or long, plain or proud. Read each direction, an action, a pause, a tone, for what it shows of feeling or what it does to the plot.\n\nIn “The Merchant of Venice”, Shylock says “I will have my bond”, again and again: the repeated short line shows a will that nothing can move.\n\n> **Watch out.** A line's surface may be the opposite of its meaning: “随你” may hide deep feeling. And a direction is part of the play, not a note for the actor alone: an action without a word may be the turning point.",
          "读台词要读出潜台词：人物心里想、嘴上没说的意思，要结合情境和舞台说明去找。还要看台词合不合人物的身份和性格：是简短还是啰嗦，是平和还是傲气。读舞台说明，看每一个动作、停顿、语气表现了人物怎样的心情，对情节起了什么作用。\n\n《威尼斯商人》里，夏洛克一遍又一遍地说“我要照约处罚”：这句短短的话不断重复，写出了他谁也劝不动的决心。\n\n> **注意。** 台词的字面意思可能和真正的意思相反：“随你”背后可能是很深的感情。舞台说明也是剧本的一部分，不只是写给演员看的：一个不说话的动作，可能就是情节的转折。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-forms",
    title: t("Modes and Forms; Fact and Fiction", "表达方式、文学样式、写实与虚构"),
    summary: t(
      "Prose, stories, fables and tales written for the subject: the modes of expression in each passage, the literary form it belongs to, and what in it is real or made up.",
      "读为本学科写的散文、小说、童话和传说：辨认各段的表达方式，判断文章属于什么文学样式，分清哪些是写实、哪些是虚构。",
    ),
    intro: t(
      "Writers tell, describe, explain, argue and express feeling, often in one piece. Zhu Ziqing's “背影” tells of his father seeing him off, describes him climbing the platform, and ends in tears: narration, description, feeling.\n\nIt is prose, and true: it records what happened. “西游记” is a novel, and its Monkey King is made up, yet it carries real wishes. The first knowledge point asks the modes and forms, the second fact and fiction.",
      "作者写文章，会用记叙、描写、说明、议论、抒情，一篇文章里常常不止一种。朱自清的《背影》讲父亲送他上火车，描写父亲爬上月台的样子，最后写自己流泪：有记叙，有描写，也有抒情。\n\n《背影》是散文，写的是真事。《西游记》是小说，孙悟空是虚构的，却寄托着人们真实的愿望。第一个知识点问表达方式和文学样式，第二个问写实和虚构。",
    ),
    data: FORMS_9,
    kind: PASSAGE,
    after: "reading-8-fiction",
    points: [
      [
        "modes",
        t("Modes of Expression and Literary Forms", "表达方式和文学样式"),
        t(
          "For a passage, ask what it mainly does: tell what happened (记叙), paint how something looks or feels (描写), explain what a thing is (说明), give a view (议论), or pour out feeling (抒情). For a whole piece, name its form: poem, prose, story, play, fable, fairy tale, myth.\n\nA travel note says “这座桥建于隋朝，长五十多米”: that is explanation, though the note is prose; and “我爱这座桥” is feeling.\n\n> **Watch out.** Judge the passage asked, not the whole piece: prose may explain in one paragraph and argue in the next. And a figure of speech is not a mode: a likening is a way of describing.",
          "看一段话主要在干什么：讲事情的经过，是记叙；写出人和景物的样子、感觉，是描写；介绍事物是什么，是说明；说出自己的看法，是议论；直接抒发感情，是抒情。看整篇文章，要说出它的文学样式：诗歌、散文、小说、戏剧、寓言、童话、神话。\n\n一篇游记写道“这座桥建于隋朝，长五十多米”：这一句是说明，虽然整篇是散文；“我爱这座桥”则是抒情。\n\n> **注意。** 问哪一段就看哪一段，不能用整篇的样式来答：散文里可以有一段说明、一段议论。修辞不是表达方式：比喻是描写时用的一种手法。",
        ),
      ],
      [
        "fiction",
        t("Fact and Fiction", "写实与虚构"),
        t(
          "Prose and reports usually record real people, places and feelings; fairy tales, myths and fables invent, and stories may invent people yet stay true to life. Find what in a piece is real and what is made up, then say why it was invented: to make a lesson lively, to carry a wish, to show a real feeling.\n\nA myth says a goddess patched the broken sky with stones of five colours: made up, yet it carries the wish to master nature.\n\n> **Watch out.** Made up is not worthless: ask what real wish or feeling the invention carries. And “好像”, a dream or a fancy inside a true piece is the writer's imagining, not a claim of fact.",
          "散文和新闻一般写真实的人、事、地方和感受；童话、神话、寓言是虚构的；小说的人物可以虚构，却要合乎生活的情理。读文章要分清哪些是写实，哪些是虚构，还要说出为什么虚构：是为了把道理讲得生动，是为了寄托愿望，还是为了写出真实的感情。\n\n神话说女娲炼五色石来补天：这是虚构的，却寄托着人们战胜自然的愿望。\n\n> **注意。** 虚构的不等于没有价值，要想一想它寄托了什么真实的愿望和感情。写实的文章里出现“好像”、梦境或想象，是作者的想象，不是在说事实。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-cross-media",
    title: t("Reading Across Media", "跨媒介阅读"),
    summary: t(
      "Sets of materials made up for the subject, a report, a post, a notice, a script, a table, on one matter: what each medium gives, and how far each is to be trusted.",
      "读为本学科编写的组合材料：同一件事的新闻、帖子、公告、视频解说词、数据表，比较不同媒介怎样呈现信息，判断各自的目的和可信程度。",
    ),
    intro: t(
      "One event reaches us through many media. A school's sports day may appear as a news story with times and records, a pupil's post full of excitement, and a short video of the last runner crossing the line.\n\nEach gives something the others lack, and each is made for a purpose. The first knowledge point asks to compare what each medium gives and how, the second to judge purpose and reliability.",
      "同一件事，会通过不同的媒介传到我们这里。一所学校的运动会，可能有一篇新闻，写着比赛时间和成绩；一个学生的帖子，满是激动的心情；还有一段短视频，拍下最后一名选手冲过终点的样子。\n\n每一种媒介都有别的媒介没有的东西，每一则材料都有它的目的。第一个知识点问比较不同媒介呈现的信息和方式，第二个问判断目的和可信程度。",
    ),
    data: CROSSMEDIA_9,
    kind: PASSAGE,
    after: "reading-8-non-continuous",
    points: [
      [
        "compare",
        t("Comparing the Media", "比较不同媒介"),
        t(
          "First see what kind each material is: a report, a notice, a post, a video, a table. Then find what each tells: facts and figures, a person's feeling, a picture of the scene. Say where they agree, where they differ, and what each adds to the others.\n\nOn a new bus line, a city notice gives the route and the fare, a passenger's post says it saves her half an hour, and a video shows the first bus at dawn: rules, feeling, scene.\n\n> **Watch out.** Answer from the material asked: a figure in the notice is not in the post. And a difference of manner, numbers against feelings, is not a contradiction: both may be true.",
          "先看每一则材料是什么类型：新闻、公告、帖子、视频、表格。再看它们各自说了什么：事实和数字，个人的感受，现场的画面。说出它们哪里一致，哪里不同，每一则补充了什么。\n\n一条新公交线路开通：市里的公告说明路线和票价，乘客的帖子说每天能省半个小时，短视频拍下天亮时开出的第一班车。一个给规定，一个给感受，一个给画面。\n\n> **注意。** 问哪一则就从哪一则里找：公告里的数字，帖子里不一定有。写法不同不等于说法矛盾：一个用数字、一个说感受，可能都是真的。",
        ),
      ],
      [
        "judge",
        t("Purpose and Reliability", "目的和可信程度"),
        t(
          "Ask who made each material and why: to inform, to sell, to persuade, to share a feeling. Then weigh how far to trust it: a source that is named and responsible, facts that can be checked, figures with an origin, agreement with other materials. One person's experience is true of one place, not of all.\n\nAn advert says a drink “喝了就能长高”: it is made to sell, names no proof, and no other source bears it out.\n\n> **Watch out.** Popular is not proven: many shares or buyers say nothing of truth. And an urgent tone or a call to forward is a warning sign, not a mark of importance.",
          "问一问每一则材料是谁做的、为什么做：是为了告知，为了卖东西，为了说服别人，还是为了分享感受。再判断能信几分：来源有没有名字、是不是负责任的部门，事实能不能核实，数字有没有出处，和别的材料能不能互相印证。一个人的经历，说明的只是一个地方的情况。\n\n一则广告说某种饮料“喝了就能长高”：它是为了卖东西，没有拿出证据，也没有别的材料能证明。\n\n> **注意。** 转发的人多、买的人多，不等于说的是真的。语气紧急、催人转发，不是消息重要的标志，反而要多加小心。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-classical",
    title: t("Classical Prose", "阅读文言文"),
    summary: t(
      "Classical passages in the public domain, with notes: words and whole sentences put into modern Chinese, and how each passage makes its point.",
      "读公有领域的文言短文，附注释：理解词语、翻译句子；读懂文章怎样借人物和事情说明道理。",
    ),
    intro: t(
      "Grade 9 reads classical prose for how it argues, too. Mencius's “得道者多助，失道者寡助” sums up a passage on war: he who follows the right way gets much help. The passage reaches it in steps, from weather, to ground, to the hearts of men.\n\nThe words still come first: 道 here is “the right way”, 寡 “few”. The first knowledge point asks words and sentences, the second how the passage makes its point.",
      "九年级读文言文，还要看文章怎样讲道理。孟子的“得道者多助，失道者寡助”，是一段论战争的文字的结论：施行仁政的人，得到的帮助就多。文章一层层推到这里：先说天时，再说地利，最后说人和。\n\n读懂词语仍是第一步：“道”在这里是正确的道路，“寡”是少。第一个知识点问词语和句子，第二个问文章怎样说明道理。",
    ),
    data: CLASSICAL_9,
    kind: PASSAGE,
    after: "reading-8-classical",
    points: [
      [
        "words",
        t("Words and Sentences", "词语和句子"),
        t(
          "For a word, take its sentence and the lines around it, and pick the meaning that joins them; watch words whose meaning has changed and words that act as another part of speech. For a sentence, render every word, add what is left out, and set the order as modern Chinese would.\n\nIn “学而不思则罔”, 罔 is “confused”: the line is “只学习而不思考，就会迷惑”.\n\n> **Watch out.** A smooth translation that skips a word is still wrong: 则 must become 就. And do not read a modern word into an old one: 去 is “to leave”, not “to go to”.",
          "理解词语，要把它放回句子，联系上下文，选一个能把前后连起来的意思；要留心古今意思不同的词，和临时改变用法的词。翻译句子，要把每个词都落实，补出省略的成分，按现代汉语调整语序。\n\n“学而不思则罔”里，“罔”是迷惑：整句是“只学习而不思考，就会迷惑”。\n\n> **注意。** 翻译读起来通顺，漏掉一个词也不对：“则”要译出“就”。不能用今天的意思去套古代的词：“去”是离开，不是到哪里去。",
        ),
      ],
      [
        "point",
        t("How the Passage Makes Its Point", "文章怎样说明道理"),
        t(
          "Tell what happens, then find how it leads to its point: a story whose ending shows the lesson, a person's speech that states it, a comparison of two people or two acts, an image that stands for the idea. Say the point in a sentence that fits this passage.\n\nIn “揠苗助长”, a man pulls up his rice shoots to help them grow, and they wither: the ending itself is the lesson, that forcing things against their nature spoils them.\n\n> **Watch out.** The lesson is the passage's whole point, not one person's mistake told again. And the speaker of the lesson may be a minor person, not the hero: find the line that sums it up.",
          "先说清写了什么事，再看文章怎样引出道理：故事的结局本身就是道理；人物的一段话把道理说出来；把两个人、两种做法放在一起比较；用一个形象来代表一个意思。最后用一句扣住这篇文章的话把道理说出来。\n\n《揠苗助长》里，一个人把禾苗往上拔，想帮它们长高，结果禾苗都枯死了：结局本身就是道理，违背事物的规律，急于求成，反而会把事情办坏。\n\n> **注意。** 道理是全文要说明的意思，不是把某个人的错误再说一遍。说出道理的人可能不是主角，要找到总结全文的那句话。",
        ),
      ],
    ],
  },
  {
    grade: 9,
    id: "reading-9-poems",
    title: t("Classical Poems", "古诗词鉴赏"),
    summary: t(
      "Classical poems in the public domain, with notes: what famous lines mean and hold, and the poet's life and times behind the feeling.",
      "读公有领域的古诗词，附注释：理解名句的含义和意蕴，联系诗人的经历和时代背景，体会诗中的感情。",
    ),
    intro: t(
      "A famous line says more than its words. Su Shi's “但愿人长久，千里共婵娟” wishes that loved ones live long and share the same moon though a thousand miles apart: a wish for every parted family.\n\nIt was written at mid-autumn in Mizhou, when Su Shi had not seen his brother for seven years. Knowing the poet and his times (知人论世) makes the feeling exact. The first knowledge point asks the famous lines, the second the poet and his times.",
      "名句的意思往往比字面更深。苏轼的“但愿人长久，千里共婵娟”，希望亲人长久平安，虽然相隔千里，也能一同看到这轮明月：这是给所有分离的亲人的祝愿。\n\n这首词写于中秋，苏轼在密州，已经七年没见到弟弟了。了解诗人的经历和时代，就是知人论世，能把感情读得更准确。第一个知识点问名句，第二个问诗人和背景。",
    ),
    data: POEMS_9,
    kind: POEM,
    after: "reading-8-poems",
    points: [
      [
        "lines",
        t("The Sense of Famous Lines", "名句的含义"),
        t(
          "Put the line into modern Chinese first; then say what it shows beyond the words: an image that stands for something, a scene that becomes a truth, a feeling that reaches past the poet. Last, say why it is still quoted: what it means to readers now.\n\nWang Bo's “海内存知己，天涯若比邻” says that a true friend, though at the ends of the earth, is as near as a neighbour: a parting turned to comfort, still said at farewells today.\n\n> **Watch out.** A literal reading is only the first step: “会当凌绝顶，一览众山小” is not about a mountain alone. And do not stretch a line beyond the poem: its deeper sense must still grow from its picture.",
          "先把名句译成现代汉语，再说它在字面之外表现了什么：一个形象代表什么，一处景物怎样变成了道理，一种感情怎样超出了诗人自己。最后说说它为什么一直被人引用，对今天的读者有什么意义。\n\n王勃的“海内存知己，天涯若比邻”，是说只要有真正的朋友，即使远在天边，也像邻居一样近：把离别的伤感变成了安慰，今天送别时人们还常常说起。\n\n> **注意。** 理解字面只是第一步：“会当凌绝顶，一览众山小”说的不只是登山。也不能离开诗去乱想：更深的意思要从诗里的画面中来。",
        ),
      ],
      [
        "poet",
        t("Poet, Times and Feeling", "知人论世"),
        t(
          "Read the poem with what the notes tell of the poet: where he was, what had happened to him, what his country was going through. Then say how that shapes the feeling: why a moon makes him homesick, why a war makes his grief so deep, why a setback turns into resolve.\n\nWang Wei wrote “九月九日忆山东兄弟” at seventeen, alone in the capital far from home: that is why “每逢佳节倍思亲”, on every festival he misses his family twice as much.\n\n> **Watch out.** The background explains the feeling, it does not replace it: name the feeling, then show how the life gives it. And use only what the notes or the poem give; do not invent a story about the poet.",
          "读诗要结合注释里写到的诗人情况：他在哪里，遇到了什么事，国家正在经历什么。再说这些怎样影响了诗中的感情：为什么一轮月亮就让他想家，为什么一场战乱让他的悲伤这样深，为什么一次挫折反而变成了决心。\n\n王维写《九月九日忆山东兄弟》时才十七岁，一个人在京城，离家很远：所以“每逢佳节倍思亲”，一到节日就加倍地想念亲人。\n\n> **注意。** 背景是用来解释感情的，不能代替感情：先说出是什么感情，再说经历怎样带来了这种感情。只用注释和诗里给出的信息，不要替诗人编故事。",
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
