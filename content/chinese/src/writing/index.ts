// The judged writing of native grades 3 to 6 (docs/chinese-curriculum.md §11): W4 paragraphs and W5 compositions, one
// topic per kind of writing and two a grade. Each topic has one bank of tasks that its two knowledge points share, each
// knowledge point judging the work by its own criteria. A Chinese character counts as a word in every length.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { diaryBank, eventBank, letterBank, paragraphBank } from "./bank-a.ts";
import { argueBank, explainBank, personBank, sceneBank } from "./bank-b.ts";

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quoted quotes every line of a model, so that a letter or a diary stays one quotation. */
const quoted = (model: string) =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

/** worked writes the solution of a task: what to plan, the model as one good answer, and how to check one's own. */
const worked =
  (plan: Text, check: Text) =>
  (model: string): Text =>
    t(
      `**Step 1: plan what to write.** ${plan.en}\n\n**Step 2: write it.** One good answer:\n\n${quoted(model)}\n\n**Check.** ${check.en}`,
      `**第一步：想好要写什么。**${plan["zh-CN"]}\n\n**第二步：写下来。**一篇好的答案：\n\n${quoted(model)}\n\n**检验。** ${check["zh-CN"]}`,
    );

/** writingTopics are the judged writing topics of grades 3 to 6, in order. */
export const writingTopics: readonly GradeTopic[] = [
  {
    grade: 3,
    topic: {
      id: "writing-3-paragraph",
      title: t("A Paragraph about One Idea", "围绕一个意思写一段话"),
      summary: t(
        "Write a paragraph in Chinese that states one idea and shows it with concrete examples, every sentence keeping to it.",
        "用中文写一段话：说清楚一个意思，用具体的事例把它写出来，每句话都围绕这个意思。",
      ),
      intro: t(
        "A paragraph about one idea says the idea and then shows it. In “早晨的菜市场真热闹” the first sentence names the bustle, and the sentences after it give what is seen and heard there: the stalls, the calls of the sellers, the bargaining. Not one sentence wanders off.\n\nThe first knowledge point states the idea and keeps every sentence to it; the second shows it with concrete examples.",
        "围绕一个意思写一段话，先把意思说出来，再把它写出来。比如“早晨的菜市场真热闹”：第一句点出热闹，后面几句写看到的、听到的：一个个摊位、卖菜人的吆喝、讨价还价的声音，没有一句跑到别处去。\n\n第一个知识点说清楚一个意思，让每句话都围绕它；第二个用具体的事例把它写出来。",
      ),
      prerequisites: ["punctuation-commas", "connectives-1"],
      xp: 18,
      strand: "writing",
      encompasses: [],
      criteria: ["zh3-paragraph-idea", "zh3-paragraph-stays", "zh3-paragraph-details"].map(criterion),
      knowledgePoints: [
        point(
          "writing-3-paragraph-idea",
          t("Stating the Idea", "说清楚一个意思"),
          t(
            "A good paragraph is about **one idea**, and the reader should know it at once. Often the first sentence says it, such as *课间十分钟真热闹。* Every sentence after it must help show that idea: if the paragraph is about how lively the break is, a sentence about what you ate for breakfast does not belong.\n\n> **Watch out.** A sentence can be true and still not belong. Read each one against the first: if it does not help show the idea, take it out.",
            "一段好的话只围绕**一个意思**，读者一看就知道写的是什么。常常第一句就把它说出来，比如“课间十分钟真热闹。”后面的每一句都要帮着把这个意思写出来：写课间有多热闹，就不要写早饭吃了什么。\n\n> **注意。** 一句话写得再对，不围绕这个意思也不该留。拿每一句和第一句对一对：帮不上忙的就删去。",
          ),
          writingGenerator(
            t(
              "Write a paragraph in Chinese about the idea below. Make the idea clear, and keep every sentence to it.",
              "围绕下面这个意思，用中文写一段话。把意思说清楚，每句话都围绕它来写。",
            ),
            paragraphBank,
            ["zh3-paragraph-idea", "zh3-paragraph-stays"],
            { minWords: 100, maxChars: 1000 },
            worked(
              t(
                "Say the idea in one sentence to open the paragraph, and list two or three things that show it.",
                "用一句话把意思说出来作开头，再列出两三件能把它写出来的事。",
              ),
              t(
                "Read it again: the first sentence gives the idea, and every sentence after it helps show it.",
                "再读一遍：第一句说出了意思，后面每一句都在帮着写它。",
              ),
            ),
          ),
        ),
        point(
          "writing-3-paragraph-details",
          t("Showing It with Examples", "用具体的事例来写"),
          t(
            "Saying *真热闹* three times does not make the break lively. **Show** it: who is skipping rope, who is chasing whom, what you hear. Two or three concrete things, each in a sentence or two, make the reader see what you mean.\n\n> **Watch out.** An example needs its own detail, and “有人在跳绳” is hardly one. Say who and how: “小红的辫子随着绳子一甩一甩的。”",
            "把“真热闹”说三遍，课间并不会因此热闹起来。要把它**写出来**：谁在跳绳，谁在追谁，你听到了什么。写两三个具体的事例，每个用一两句话写清楚，读者就能看到你说的样子。\n\n> **注意。** 事例要写出具体的样子，“有人在跳绳”还算不上事例。要写出是谁、怎么样：“小红的辫子随着绳子一甩一甩的。”",
          ),
          writingGenerator(
            t(
              "Write a paragraph in Chinese about the idea below. Show it with at least two concrete examples.",
              "围绕下面这个意思，用中文写一段话。至少用两个具体的事例把它写出来。",
            ),
            paragraphBank,
            ["zh3-paragraph-details", "zh3-paragraph-stays"],
            { minWords: 100, maxChars: 1000 },
            worked(
              t(
                "Choose two or three concrete things that show the idea, and decide what you saw, heard or did in each.",
                "选好两三个能表现这个意思的具体事例，想好每个里面看到了什么、听到了什么、做了什么。",
              ),
              t(
                "Count the examples: at least two, each told in a sentence or two of its own, and no sentence that only repeats the idea.",
                "数一数事例：至少两个，每个都用一两句话写清楚，没有只是把意思再说一遍的句子。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 3,
    topic: {
      id: "writing-3-diary",
      title: t("An Observation Diary", "写观察日记"),
      summary: t(
        "Write a diary entry in Chinese about something you observe: the date, weekday and weather, what you saw in detail, and what changed.",
        "用中文写一篇观察日记：写上日期、星期和天气，细致地写出看到的样子，以及它的变化。",
      ),
      intro: t(
        "An observation diary records something watched over several days. It opens with a line of date, weekday and weather, such as “10月12日　星期六　晴”; then it tells what was seen, closely enough to picture, and what is different from before. Garlic in water: on the third day white roots, a few days later a speck of green.\n\nThe first knowledge point writes the form and the close look; the second the change and what you felt.",
        "观察日记记下连续几天观察的东西。开头一行写日期、星期和天气，比如“10月12日　星期六　晴”；下面写看到的样子，要细致得能让人想象出来，还要写出和以前有什么不同。比如泡在水里的大蒜：第三天长出了白白的根，又过几天冒出了一点绿芽。\n\n第一个知识点写好格式、仔细观察；第二个写出变化和感受。",
      ),
      prerequisites: ["writing-3-paragraph"],
      xp: 18,
      strand: "writing",
      encompasses: [{ topic: "writing-3-paragraph", weight: 0.3 }],
      criteria: ["zh3-diary-form", "zh3-diary-observed", "zh3-diary-change"].map(criterion),
      knowledgePoints: [
        point(
          "writing-3-diary-observed",
          t("Looking Closely", "仔细观察"),
          t(
            "A diary begins with a line of its own: the **date**, the **weekday** and the **weather**, such as *10月12日　星期六　晴*. Then you write what happened that day.\n\nIn an observation diary, what happened is what you **saw**. Look closely and write the details: its colour, its shape, how big it is, how it moves. *豆芽长出来了* says little; *豆芽顶着黄黄的豆瓣，像戴了一顶小帽子* lets the reader see it.\n\n> **Watch out.** Without the line of date, weekday and weather it is not a diary; and “很好看” or “很可爱” shows nothing. Write the colour, the shape, the size.",
            "日记开头单独写一行：**日期**、**星期**和**天气**，比如“10月12日　星期六　晴”。下面再写这一天的事。\n\n观察日记写的事，就是你**看到的**。要仔细看，把细节写出来：它的颜色、形状、大小，它怎么动。“豆芽长出来了”说得太少；“豆芽顶着黄黄的豆瓣，像戴了一顶小帽子”，读者才能看到它。\n\n> **注意。** 没有日期、星期、天气那一行，就不是日记；“很好看”“很可爱”什么也没写出来。要写颜色、形状、大小。",
          ),
          writingGenerator(
            t(
              "Write an observation diary entry in Chinese. Begin with the date, the weekday and the weather, and describe what you observe in detail.",
              "用中文写一篇观察日记。开头写上日期、星期和天气，细致地写出你观察到的样子。",
            ),
            diaryBank,
            ["zh3-diary-form", "zh3-diary-observed"],
            { minWords: 150, maxChars: 1200 },
            worked(
              t(
                "Write the line of date, weekday and weather, then decide what you will look at closely: colour, shape, size, movement.",
                "先写好日期、星期、天气这一行，再想好要仔细看哪些地方：颜色、形状、大小、怎么动。",
              ),
              t(
                "Read it again: the first line has the date, the weekday and the weather, and the reader can picture what you saw.",
                "再读一遍：第一行有日期、星期和天气，读者能想象出你看到的样子。",
              ),
            ),
          ),
        ),
        point(
          "writing-3-diary-change",
          t("Noticing What Changes", "写出变化和感受"),
          t(
            "What you observe keeps changing: a bean grows a root, the moon gets rounder, a snail comes out after rain. A good diary entry tells **what is different today** or what you noticed for the first time, and then **how you felt** or what you wondered: *它为什么只在下雨后出来呢？*\n\n> **Watch out.** A feeling needs something to come from. “我很高兴” alone is empty: say first what you noticed, and then why it made you glad or curious.",
            "观察的东西一直在变：豆子长出了根，月亮一天天变圆，雨后蜗牛爬了出来。好的观察日记要写出**今天有什么不一样**，或者你第一次发现了什么，再写写**你的感受**或者你想到的问题：“它为什么只在下雨后才出来呢？”\n\n> **注意。** 感受要有来处。光写“我很高兴”是空的：先写出你发现了什么，再写它为什么让你高兴或好奇。",
          ),
          writingGenerator(
            t(
              "Write an observation diary entry in Chinese. Tell what has changed or what you noticed for the first time, and how you felt about it.",
              "用中文写一篇观察日记。写出它的变化或你第一次发现的地方，以及你的感受。",
            ),
            diaryBank,
            ["zh3-diary-change", "zh3-diary-form"],
            { minWords: 150, maxChars: 1200 },
            worked(
              t(
                "Compare today with before: what is new, bigger or different. Then decide what you felt or wondered about it.",
                "把今天和以前比一比：哪里是新的，哪里长大了，哪里不一样了。再想好你对它有什么感受或疑问。",
              ),
              t(
                "Find the sentence that says what changed and the one that says what you felt; the second follows from the first.",
                "找出写变化的句子和写感受的句子：感受是从变化里来的。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 4,
    topic: {
      id: "writing-4-event",
      title: t("Telling an Event", "把一件事写清楚"),
      summary: t(
        "Write in Chinese about one event with its beginning, course and end, the most important moment told in detail, and what you felt or learned.",
        "用中文写一件事：写清楚起因、经过和结果，把最重要的部分写具体，写出自己的感受或收获。",
      ),
      intro: t(
        "Telling an event clearly means giving its three parts in order and telling the part that matters most most slowly. Learning to ride a bicycle: why you started; the falls, and the moment Father let go without saying so; riding alone at last. The moment he let go gets the most words.\n\nThe first knowledge point puts beginning, course and end in order; the second tells the important moment in detail.",
        "把一件事写清楚，就是按顺序写出它的三个部分，把最重要的部分写得最细。比如学骑自行车：为什么要学；摔了几次，爸爸悄悄松开了手；最后自己骑了起来。爸爸松手的那一刻写得最多。\n\n第一个知识点按顺序写起因、经过和结果；第二个把重要的部分写具体。",
      ),
      prerequisites: ["writing-3-paragraph", "connectives-2"],
      xp: 22,
      strand: "writing",
      encompasses: [{ topic: "writing-3-paragraph", weight: 0.3 }],
      criteria: ["zh4-event-parts", "zh4-event-detail", "zh4-event-feeling"].map(criterion),
      knowledgePoints: [
        point(
          "writing-4-event-parts",
          t("Beginning, Course and End", "起因、经过、结果"),
          t(
            "Every event has three parts. The **beginning** (起因) is what started it, the **course** (经过) is what happened, and the **end** (结果) is how it came out. Tell them in that order, and the reader can follow.\n\nThe course is the heart of the story, so it gets the most words. The beginning and the end can be short.\n\n> **Watch out.** Do not let the beginning swallow the piece. In learning to ride a bicycle, a sentence or two says why you began; the falls and the first ride alone are where the words go.",
            "每件事都有三个部分。**起因**是事情怎么开始的，**经过**是事情是怎样发生的，**结果**是事情最后怎么样了。按这个顺序写，读者就能看明白。\n\n经过是一件事的主要部分，要写得最多；起因和结果可以写得简短些。\n\n> **注意。** 别让起因占了大半篇。写学骑自行车，为什么要学，一两句就够了；摔跤和第一次自己骑出去，才是要多写的地方。",
          ),
          writingGenerator(
            t(
              "Write about the event below in Chinese. Tell its beginning, its course and its end, in that order.",
              "用中文写下面这件事。按顺序写清楚它的起因、经过和结果。",
            ),
            eventBank,
            ["zh4-event-parts", "zh4-event-feeling"],
            { minWords: 300, maxChars: 2000 },
            worked(
              t(
                "Write the beginning, the course and the end in a sentence each, and remember that the course is the longest part.",
                "先用一句话分别写下起因、经过和结果，记住经过要写得最多。",
              ),
              t(
                "Find the three parts in your piece: they come in order, and the course is the longest.",
                "在文章里找出这三个部分：顺序没有乱，经过写得最多。",
              ),
            ),
          ),
        ),
        point(
          "writing-4-event-detail",
          t("The Important Moment in Detail", "把重要的部分写具体"),
          t(
            "In *我们赢了拔河比赛*, the moment that matters is the last few seconds of pulling. Slow it down: what did people **do** (咬紧牙、身子往后仰), what did they **say** (“一二，加油！”), what did you **think**? A moment told this way lets the reader feel it with you. Then say what you felt or learned, and let it follow from what happened.\n\n> **Watch out.** The feeling at the end must come from the event: after a hard-won tug of war, “团结力量大” follows; “我要好好学习” does not.",
            "写“我们赢了拔河比赛”，最重要的是最后那几秒钟。把它写慢一点：大家**做**了什么（咬紧牙、身子往后仰），**说**了什么（“一二，加油！”），你心里**想**了什么？这样写，读者就能和你一起感受到。最后写出你的感受或收获，它要从这件事里自然地得出来。\n\n> **注意。** 结尾的感受要从这件事里来：拔河比赛艰难取胜，得出“团结力量大”是自然的；写“我要好好学习”就接不上了。",
          ),
          writingGenerator(
            t(
              "Write about the event below in Chinese. Tell its most important moment in detail: what people did, said and thought.",
              "用中文写下面这件事。把最重要的部分写具体：人们做了什么、说了什么、想了什么。",
            ),
            eventBank,
            ["zh4-event-detail", "zh4-event-feeling"],
            { minWords: 300, maxChars: 2000 },
            worked(
              t(
                "Find the moment that matters most, and plan what people did, said and thought in it.",
                "找出最重要的那一刻，想好人们在那时做了什么、说了什么、想了什么。",
              ),
              t(
                "Read the important moment again: it has actions, words and thoughts, and the feeling at the end follows from it.",
                "再读最重要的那一段：有动作、有语言、有想法，结尾的感受是从它得出来的。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 4,
    topic: {
      id: "writing-4-letter",
      title: t("Writing a Letter", "写书信"),
      summary: t(
        "Write a letter in Chinese in the form of a Chinese letter, with a clear purpose and concrete news or questions for the reader.",
        "用中文按书信的格式写一封信，写信目的明确，写出对方想知道的具体内容。",
      ),
      intro: t(
        "A letter has a form the reader expects and a purpose that fills its body. To a cousin you have not seen for a long time: “亲爱的表姐：” against the left edge, “你好！” two characters in, the news of the skill you have learned, “祝” and “学习进步！”, then your name and the date at the bottom right.\n\nThe first knowledge point sets out the form; the second fills the body with what the reader wants to know.",
        "书信有收信人熟悉的格式，正文围绕写信的目的。比如给好久不见的表姐写信：顶格写“亲爱的表姐：”，空两格写“你好！”，正文写你新学会的本领，再写“祝”和“学习进步！”，最后在右下方署名、写日期。\n\n第一个知识点写好书信的格式；第二个写出收信人想知道的内容。",
      ),
      prerequisites: ["writing-3-paragraph", "punctuation-speech"],
      xp: 20,
      strand: "writing",
      encompasses: [{ topic: "writing-3-paragraph", weight: 0.2 }],
      criteria: ["zh4-letter-form", "zh4-letter-purpose", "zh4-letter-detail"].map(criterion),
      knowledgePoints: [
        point(
          "writing-4-letter-form",
          t("The Form of a Letter", "书信的格式"),
          t(
            "A Chinese letter has a fixed form. The **person written to** goes on the first line, against the left edge, followed by a colon: *亲爱的小林：*. The next line starts with a **greeting** such as *你好！*, two characters in. Then comes the **body**. After it, *祝* or *此致* starts a line two characters in, and the **wish** (*身体健康！*, *敬礼！*) goes against the left edge on the next line. The **writer's name** and the **date** go at the bottom right, one under the other.\n\n> **Watch out.** A colon follows the person written to, not a comma; and the wish goes on a line of its own against the left edge, not on the line of *祝*.",
            "书信有固定的格式。第一行顶格写**称呼**，后面加冒号：“亲爱的小林：”。第二行空两格写**问候语**，比如“你好！”。接着写**正文**。正文后面另起一行空两格写“祝”或“此致”，再下一行顶格写**祝福语**（“身体健康！”“敬礼！”）。**署名**和**日期**写在右下方，日期在署名下面。\n\n> **注意。** 称呼后面用冒号，不用逗号；祝福语要另起一行顶格写，不和“祝”写在同一行。",
          ),
          writingGenerator(
            t("Write the letter below in Chinese, in the form of a Chinese letter.", "用中文写下面这封信，注意书信的格式。"),
            letterBank,
            ["zh4-letter-form", "zh4-letter-purpose"],
            { minWords: 200, maxChars: 1600 },
            worked(
              t(
                "Set out the six parts in order: the person written to, the greeting, the body, *祝* or *此致*, the wish, and the name with the date.",
                "按顺序排好六个部分：称呼、问候语、正文、“祝”或“此致”、祝福语、署名和日期。",
              ),
              t(
                "Go through the form line by line: the colon after the person, each line starting where it should, the name and the date at the bottom right.",
                "一行一行对格式：称呼后有冒号，每行从该空的地方起笔，署名和日期在右下方。",
              ),
            ),
          ),
        ),
        point(
          "writing-4-letter-detail",
          t("What the Reader Wants to Know", "写出对方想知道的内容"),
          t(
            "Every letter has a **purpose**: to share news, to thank, to ask. Keep the body on it, and write in a way that suits the reader, a grandparent or a friend.\n\n*我很好，学习很好* tells the reader nothing. Give **concrete** news, reasons or questions: what you learned to do this term, why you are thanking them, what you want to know about their new school.\n\n> **Watch out.** Mind who is reading: to an elder use 您 and a respectful wish such as “身体健康！”; a joke that suits a friend may not suit a grandmother.",
            "每封信都有**目的**：告诉对方消息、表示感谢、提出请求。正文要围绕这个目的来写，说话的语气也要适合收信人，是长辈还是朋友。\n\n“我很好，学习也很好”什么也没有告诉对方。要写出**具体的**消息、理由或问题：这学期你学会了什么，你为什么感谢他，你想知道他新学校的哪些事。\n\n> **注意。** 想着是谁在读：给长辈写信用“您”，祝福语也要恭敬，比如“身体健康！”；对朋友开的玩笑，对奶奶未必合适。",
          ),
          writingGenerator(
            t(
              "Write the letter below in Chinese. Give the concrete news, reasons or questions your reader would want.",
              "用中文写下面这封信。写出收信人想知道的具体消息、理由或问题。",
            ),
            letterBank,
            ["zh4-letter-detail", "zh4-letter-purpose"],
            { minWords: 200, maxChars: 1600 },
            worked(
              t(
                "Say the purpose in a sentence, then list the concrete news, reasons or questions the reader would want.",
                "先用一句话说出写信的目的，再列出收信人想知道的具体消息、理由或问题。",
              ),
              t(
                "Read the body as the reader would: every part serves the purpose, and something concrete answers each thing they would ask.",
                "站在收信人的角度读一遍正文：每部分都围绕目的，他想问的都有具体的回答。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 5,
    topic: {
      id: "writing-5-person",
      title: t("Writing about a Person", "写人：写出人物的特点"),
      summary: t(
        "Write in Chinese about a person, making one quality clear through a concrete event and through their actions, words and looks.",
        "用中文写一个人：通过具体的事例和人物的动作、语言、神态，写出他的一个特点。",
      ),
      intro: t(
        "Writing about a person picks one quality and lets an event show it. A desk-mate who is always careless: the morning he came to school in one blue sock and one red, and how he laughed when he saw them. The reader sees the carelessness without being told.\n\nThe first knowledge point shows the quality through an event; the second through actions, words and looks.",
        "写人，要抓住一个特点，用一件事把它表现出来。比如总是马马虎虎的同桌：他穿着一只蓝袜子、一只红袜子来上学的那个早上，发现以后他是怎么笑的。不用说，读者就看到了他的马虎。\n\n第一个知识点用事例写出特点；第二个通过动作、语言和神态来写。",
      ),
      prerequisites: ["writing-4-event", "punctuation-speech"],
      xp: 24,
      strand: "writing",
      encompasses: [{ topic: "writing-4-event", weight: 0.3 }],
      criteria: ["zh5-person-trait", "zh5-person-example", "zh5-person-description"].map(criterion),
      knowledgePoints: [
        point(
          "writing-5-person-example",
          t("A Quality Shown by an Event", "用事例写出特点"),
          t(
            "Choose **one quality** of the person, the one that makes them who they are: patient, careless, brave. Then choose an **event** in which that quality can be seen. *我的同桌很马虎* is a claim; the morning he came to school with one blue sock and one red one shows it.\n\n> **Watch out.** The event must show the quality you named. A careless desk-mate winning a race may be true, but it shows speed, not carelessness.",
            "抓住人物的**一个特点**，就是最能让人记住他的那一点：耐心、马虎、勇敢。再选一件能看出这个特点的**事**。“我的同桌很马虎”只是一句话；他穿着一只蓝袜子、一只红袜子来上学的那个早上，才让人看到他的马虎。\n\n> **注意。** 事例要能表现你说的那个特点。写马虎的同桌赛跑得了第一，事情是真的，可表现的是跑得快，不是马虎。",
          ),
          writingGenerator(
            t(
              "Write about the person below in Chinese. Make one quality clear, and show it through a concrete event.",
              "用中文写下面这个人。写出他的一个特点，并用一件具体的事表现出来。",
            ),
            personBank,
            ["zh5-person-trait", "zh5-person-example"],
            { minWords: 350, maxChars: 2400 },
            worked(
              t(
                "Name the one quality, then choose the event in which it can be seen.",
                "先说出人物的一个特点，再选一件能看出这个特点的事。",
              ),
              t(
                "Ask whether a reader who read only the event would name the same quality.",
                "问一问：只读这件事的读者，能不能说出同一个特点？",
              ),
            ),
          ),
        ),
        point(
          "writing-5-person-description",
          t("Actions, Words and Looks", "描写动作、语言和神态"),
          t(
            "Inside the event, let the person **act and speak**. *奶奶很耐心* becomes *奶奶戴上老花镜，一针一针地帮我把扣子缝好，笑着说：“别急，慢慢来。”* The actions (戴上、一针一针地缝), the words and the look (笑着) show the patience without naming it.\n\n> **Watch out.** Actions, words and looks must fit the person: a patient grandmother does not snap “快点！”. What they do and say must agree with the quality.",
            "在事情里，让人物自己**动起来、说起来**。“奶奶很耐心”可以写成：“奶奶戴上老花镜，一针一针地帮我把扣子缝好，笑着说：‘别急，慢慢来。’”动作（戴上、一针一针地缝）、语言和神态（笑着）不用说出“耐心”两个字，就把耐心写出来了。\n\n> **注意。** 动作、语言、神态要合乎人物：耐心的奶奶不会冲口说“快点！”。人物做的、说的，要和他的特点一致。",
          ),
          writingGenerator(
            t(
              "Write about the person below in Chinese. Bring out their quality through their actions, words and looks.",
              "用中文写下面这个人。通过他的动作、语言和神态写出他的特点。",
            ),
            personBank,
            ["zh5-person-description", "zh5-person-trait"],
            { minWords: 350, maxChars: 2400 },
            worked(
              t(
                "At the main moment of the event, plan an action, a sentence the person says, and a look.",
                "在事情最重要的地方，想好人物的一个动作、说的一句话和一个神态。",
              ),
              t(
                "Mark the actions, words and looks: each helps show the quality, and the quality is shown, not only named.",
                "把动作、语言、神态画出来：每一处都在表现这个特点，特点是写出来的，不只是说出来的。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 5,
    topic: {
      id: "writing-5-explain",
      title: t("Explaining a Thing", "介绍一种事物"),
      summary: t(
        "Write an explanation in Chinese of a thing by its features, plainly and accurately, using methods such as numbers, comparisons and examples.",
        "用中文写一篇说明文，按特点介绍一种事物，写得准确、平实，并用上列数字、作比较、举例子等说明方法。",
      ),
      intro: t(
        "An explanation tells what a thing is like, feature by feature, accurately and plainly. The giant panda: what it looks like, what it eats, how it lives, a paragraph each; and a method makes it clearer, such as a number: “每天要吃十几千克竹子”.\n\nThe first knowledge point explains feature by feature; the second uses methods of explaining.",
        "说明文按几个方面介绍一种事物，写得准确、平实。比如大熊猫：样子、吃什么、怎样生活，每个方面写一段；再用上说明方法，比如列数字：“每天要吃十几千克竹子”。\n\n第一个知识点按特点来介绍；第二个用上说明方法。",
      ),
      prerequisites: ["writing-3-paragraph", "connectives-2"],
      xp: 22,
      strand: "writing",
      encompasses: [{ topic: "writing-3-paragraph", weight: 0.2 }],
      criteria: ["zh5-explain-features", "zh5-explain-methods", "zh5-explain-plain"].map(criterion),
      knowledgePoints: [
        point(
          "writing-5-explain-features",
          t("Feature by Feature", "按特点来介绍"),
          t(
            "An explanation tells the reader **what a thing is like**, not a story about it. Sort what you know into **features**: what it looks like, what it is made of, how it works, what it is used for. Give each feature a paragraph of its own, and say only what is true.\n\n> **Watch out.** The day you saw a panda at the zoo is a story, not an explanation. Write what the panda is like, true of every panda: its black and white fur, its bamboo, its slow pace.",
            "说明文是告诉读者一种事物**是什么样的**，不是讲关于它的故事。把你知道的内容分成几个**方面**：样子、构造、怎样工作、有什么用处。每个方面写一段，写的都要是真实准确的。\n\n> **注意。** 写你那天在动物园看熊猫的经过，是记叙，不是说明。要写大熊猫是什么样的，对每只大熊猫都成立：黑白相间的毛、吃竹子、动作慢吞吞。",
          ),
          writingGenerator(
            t(
              "Write an explanation in Chinese of the thing below. Explain it feature by feature, plainly and accurately.",
              "用中文写一篇说明文，介绍下面这种事物。分几个方面来介绍，写得准确、平实。",
            ),
            explainBank,
            ["zh5-explain-features", "zh5-explain-plain"],
            { minWords: 300, maxChars: 2000 },
            worked(
              t(
                "List the features you will explain, such as looks, food and habits, a paragraph each.",
                "列出要介绍的几个方面，比如样子、食物、习性，每个方面一段。",
              ),
              t(
                "Each paragraph keeps to one feature, and every statement is true of the thing itself, not of one day you saw it.",
                "每段只写一个方面，每句话写的都是这种事物本身，不是你某一天看到的经过。",
              ),
            ),
          ),
        ),
        point(
          "writing-5-explain-methods",
          t("Methods of Explaining", "说明方法"),
          t(
            "Methods make an explanation clear. **列数字**: *一只成年大熊猫每天要吃十几千克竹子。* **作比较**: compare it with something the reader knows. **举例子**: name a case. **分类别**: sort it into kinds. **打比方**: *叶子像一把把小扇子。* Use at least one, and keep the facts accurate.\n\n> **Watch out.** A number must be accurate: if what you know is “十几千克”, write that, not a precise figure you made up. And a comparison explains only when the reader knows the other thing.",
            "用上说明方法，介绍会更清楚。**列数字**：“一只成年大熊猫每天要吃十几千克竹子。”**作比较**：拿读者熟悉的东西来比。**举例子**：举出具体的例子。**分类别**：分成几类来说。**打比方**：“叶子像一把把小扇子。”至少用上一种，写的事实要准确。\n\n> **注意。** 数字要准确：知道的是“十几千克”，就写“十几千克”，不要编一个精确的数。作比较时，拿来比的要是读者熟悉的东西。",
          ),
          writingGenerator(
            t(
              "Write an explanation in Chinese of the thing below. Use at least one method of explaining, such as numbers, a comparison or an example.",
              "用中文写一篇说明文，介绍下面这种事物。至少用上一种说明方法，比如列数字、作比较或举例子。",
            ),
            explainBank,
            ["zh5-explain-methods", "zh5-explain-plain"],
            { minWords: 300, maxChars: 2000 },
            worked(
              t(
                "Decide which feature needs a method, and choose one: a number, a comparison, an example, kinds or a figure of speech.",
                "想好哪个方面需要用说明方法，选好一种：列数字、作比较、举例子、分类别或打比方。",
              ),
              t(
                "Find each method you used and name it; then check that its facts are accurate.",
                "找出你用的每一种说明方法，说出它的名称，再查一查里面的事实准不准确。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 6,
    topic: {
      id: "writing-6-argue",
      title: t("A View and Its Evidence", "观点和事例"),
      summary: t(
        "Write in Chinese on a question: state one clear view, support it with examples and sayings, explain how they support it, and come back to it at the end.",
        "用中文就一个问题写一篇短文：亮出一个明确的观点，用事例和名言来支持它，说明它们怎样证明观点，结尾回到观点。",
      ),
      intro: t(
        "A short argument states a view, supports it with evidence and explains how the evidence supports it. On phones at primary school: “我认为小学生不该带手机进校园”; then a class distracted by a ringing phone, and what that shows; then a fact about eyesight, and what that shows; and the view again at the end.\n\nThe first knowledge point gives the view its evidence; the second explains how the evidence supports it.",
        "短小的议论文要亮出观点，摆出事例，并说明事例怎样证明观点。比如小学生该不该带手机进校园：“我认为小学生不该带手机进校园”；接着写一个班级被手机铃声打断的例子，说明它证明了什么；再写一个关于视力的事实，也说明它证明了什么；结尾回到观点。\n\n第一个知识点用事例证明观点；第二个说明事例怎样证明观点。",
      ),
      prerequisites: ["writing-5-explain", "faulty-misused-connectives"],
      xp: 26,
      strand: "writing",
      encompasses: [{ topic: "writing-5-explain", weight: 0.2 }],
      criteria: ["zh6-argue-claim", "zh6-argue-evidence", "zh6-argue-reasoning"].map(criterion),
      knowledgePoints: [
        point(
          "writing-6-argue-evidence",
          t("A View with Evidence", "用事例证明观点"),
          t(
            "Start by stating your **view** clearly: *我认为，失败并不全是坏事。* Then give **evidence**: an example from history or your own life, a fact, a well-known saying. Two pieces that really bear on the view are worth more than five that are only near it.\n\n> **Watch out.** A view takes a side. “手机有好处也有坏处” takes none: choose, and say it in the first paragraph.",
            "开头就把**观点**说清楚：“我认为，失败并不全是坏事。”然后摆出**事例**：历史上或生活中的例子、事实、大家熟悉的名言。两个真正能证明观点的事例，比五个沾边的事例更有力。\n\n> **注意。** 观点要表明立场。“手机有好处也有坏处”没有表态：要选定一方，在第一段就说出来。",
          ),
          writingGenerator(
            t(
              "Write a short essay in Chinese on the question below. State your view clearly and support it with at least two pieces of evidence.",
              "就下面的问题，用中文写一篇短文。明确提出你的观点，并用至少两个事例来支持它。",
            ),
            argueBank,
            ["zh6-argue-claim", "zh6-argue-evidence"],
            { minWords: 400, maxChars: 2800 },
            worked(
              t(
                "Write your view in one sentence, then choose two pieces of evidence that really bear on it.",
                "用一句话写出你的观点，再选两个真正能证明它的事例。",
              ),
              t(
                "Find the view in the first paragraph and the two pieces of evidence; ask of each whether it proves this view and not a nearby one.",
                "在第一段找到观点，再找出两个事例；问问每个事例证明的是不是这个观点，而不是一个相近的观点。",
              ),
            ),
          ),
        ),
        point(
          "writing-6-argue-reasoning",
          t("Explaining the Evidence", "说明事例怎样证明观点"),
          t(
            "An example does not speak for itself. After each one, say **how it supports the view**: *爱迪生试了上千种材料才找到合适的灯丝，正是一次次失败告诉他哪条路走不通。* At the end, **come back to the view**, so the reader closes the essay knowing what you think and why.\n\n> **Watch out.** Explaining is not repeating: “这说明失败不全是坏事” only says the view again. Say what in the example shows it: the failures told him which way was closed.",
            "事例不会自己说话。每举一个例子，都要说明它**怎样证明观点**：“爱迪生试了上千种材料才找到合适的灯丝，正是一次次失败告诉他哪条路走不通。”结尾要**回到观点**，让读者读完就知道你怎么想、为什么这样想。\n\n> **注意。** 分析不是重复：“这说明失败不全是坏事”只是把观点又说了一遍。要说出事例里的哪一点证明了它：是失败告诉他哪条路走不通。",
          ),
          writingGenerator(
            t(
              "Write a short essay in Chinese on the question below. Explain how each piece of evidence supports your view, and come back to the view at the end.",
              "就下面的问题，用中文写一篇短文。说明每个事例怎样证明你的观点，结尾回到观点。",
            ),
            argueBank,
            ["zh6-argue-reasoning", "zh6-argue-claim"],
            { minWords: 400, maxChars: 2800 },
            worked(
              t(
                "After each piece of evidence, plan a sentence that says what in it supports the view, and plan an ending that returns to the view.",
                "每个事例后面想好一句话，说出它的哪一点证明了观点；再想好回到观点的结尾。",
              ),
              t(
                "Each example is followed by a sentence of explanation, and the last paragraph states the view again.",
                "每个事例后面都有一句分析，最后一段又回到了观点。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 6,
    topic: {
      id: "writing-6-scene",
      title: t("Describing a Scene", "写景"),
      summary: t(
        "Write in Chinese about a scene in a clear order, with more than one sense and figures of speech, carrying a feeling through it.",
        "用中文写一处景物：按一定的顺序写，调动多种感官，用上修辞手法，把感情融进景物里。",
      ),
      intro: t(
        "Describing a scene walks the reader through it in an order, with more than one sense, and lets a feeling run through it. The school after rain: from the gate to the playground, the shining leaves, the drip from the eaves, the smell of wet earth, and the light, fresh mood the clean air brings.\n\nThe first knowledge point keeps an order and uses many senses; the second carries a feeling through the scene.",
        "写景，要按一定的顺序带读者看，调动多种感官，让一种感情贯穿其中。比如雨后的校园：从校门写到操场，亮晶晶的树叶、屋檐的滴水声、泥土的气味，还有清新的空气带来的轻松心情。\n\n第一个知识点按顺序写、用多种感官；第二个把感情融进景物。",
      ),
      prerequisites: ["writing-5-person", "rhetoric-2"],
      xp: 24,
      strand: "writing",
      encompasses: [{ topic: "rhetoric-2", weight: 0.2 }],
      criteria: ["zh6-scene-order", "zh6-scene-senses", "zh6-scene-feeling"].map(criterion),
      knowledgePoints: [
        point(
          "writing-6-scene-order",
          t("A Clear Order and Many Senses", "有顺序，用多种感官"),
          t(
            "A scene is easier to picture when it is written in an **order**: from near to far, from top to bottom, or as time passes, from morning to evening. Use **more than one sense**: what you see, and also what you hear, smell or feel. A **comparison** helps too: *远处的山像一头头卧着的牛。*\n\n> **Watch out.** Once you choose an order, keep it: going near to far and then jumping back to the gate loses the reader. Mark each move with words such as “走进”, “抬头”, “远处”.",
            "按一定的**顺序**写景，读者更容易想象：由近到远、从上到下，或者按时间先后，从早到晚。要调动**多种感官**：写看到的，也写听到的、闻到的、摸到的。**比喻**等修辞也能帮忙：“远处的山像一头头卧着的牛。”\n\n> **注意。** 选好了顺序就要守住：由近到远写着写着又跳回校门口，读者就乱了。每换一处，用“走进”“抬头”“远处”这样的词标出来。",
          ),
          writingGenerator(
            t(
              "Describe the scene below in Chinese. Write in a clear order, and use more than one sense.",
              "用中文写下面这处景物。按一定的顺序写，调动多种感官。",
            ),
            sceneBank,
            ["zh6-scene-order", "zh6-scene-senses"],
            { minWords: 400, maxChars: 2800 },
            worked(
              t(
                "Choose the order, near to far, top to bottom or through the day, and for each part note something seen and something heard, smelled or felt.",
                "选好顺序：由近到远、从上到下或者按时间先后；每一处记下一样看到的，再记一样听到、闻到或摸到的。",
              ),
              t(
                "Follow the piece through: the order holds from start to end, and at least one sense besides sight appears.",
                "顺着文章走一遍：从头到尾顺序不乱，除了看到的，至少还写了一种别的感官。",
              ),
            ),
          ),
        ),
        point(
          "writing-6-scene-feeling",
          t("A Feeling in the Scene", "把感情融进景物"),
          t(
            "The same rain can feel fresh or lonely; what you choose to describe shows **your mood**. Let a feeling run through the scene, glad, calm, homesick, and choose details that carry it. Somewhere, often at the end, make clear what the feeling is.\n\n> **Watch out.** The details must fit the feeling: a calm evening by the lake has no room for honking horns, unless the feeling is that the calm is broken.",
            "同样一场雨，可以写得清新，也可以写得冷清；你选择写什么，就流露出**你的心情**。让一种感情贯穿全文，高兴、宁静或者想家，选择能表现这种感情的景物和细节。在某个地方，常常是结尾，把这种感情点明。\n\n> **注意。** 细节要和感情一致：写湖边宁静的傍晚，就不该写刺耳的喇叭声，除非你要写的正是宁静被打破。",
          ),
          writingGenerator(
            t(
              "Describe the scene below in Chinese. Let a feeling run through it, and make clear what that feeling is.",
              "用中文写下面这处景物。让一种感情贯穿全文，并把它点明。",
            ),
            sceneBank,
            ["zh6-scene-feeling", "zh6-scene-senses"],
            { minWords: 400, maxChars: 2800 },
            worked(
              t(
                "Name the feeling first, then choose the details that carry it and the place where you will state it.",
                "先想好是哪种感情，再挑出能表现它的景物和细节，想好在哪里把它点明。",
              ),
              t(
                "Find the sentence that states the feeling, and check that the scenes before it lead to it.",
                "找出点明感情的句子，看看前面写的景物是不是都在引向它。",
              ),
            ),
          ),
        ),
      ],
    },
  },
];
