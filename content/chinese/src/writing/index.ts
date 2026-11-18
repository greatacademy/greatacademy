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

const onePiece = (model: string): Text => t(`One good answer:\n\n${quoted(model)}`, `一篇好的答案：\n\n${quoted(model)}`);

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
            "A good paragraph is about **one idea**, and the reader should know it at once. Often the first sentence says it, such as *课间十分钟真热闹。* Every sentence after it must help show that idea: if the paragraph is about how lively the break is, a sentence about what you ate for breakfast does not belong.",
            "一段好的话只围绕**一个意思**，读者一看就知道写的是什么。常常第一句就把它说出来，比如“课间十分钟真热闹。”后面的每一句都要帮着把这个意思写出来：写课间有多热闹，就不要写早饭吃了什么。",
          ),
          writingGenerator(
            t(
              "Write a paragraph in Chinese about the idea below. Make the idea clear, and keep every sentence to it.",
              "围绕下面这个意思，用中文写一段话。把意思说清楚，每句话都围绕它来写。",
            ),
            paragraphBank,
            ["zh3-paragraph-idea", "zh3-paragraph-stays"],
            { minWords: 100, maxChars: 1000 },
            onePiece,
          ),
        ),
        point(
          "writing-3-paragraph-details",
          t("Showing It with Examples", "用具体的事例来写"),
          t(
            "Saying *真热闹* three times does not make the break lively. **Show** it: who is skipping rope, who is chasing whom, what you hear. Two or three concrete things, each in a sentence or two, make the reader see what you mean.",
            "把“真热闹”说三遍，课间并不会因此热闹起来。要把它**写出来**：谁在跳绳，谁在追谁，你听到了什么。写两三个具体的事例，每个用一两句话写清楚，读者就能看到你说的样子。",
          ),
          writingGenerator(
            t(
              "Write a paragraph in Chinese about the idea below. Show it with at least two concrete examples.",
              "围绕下面这个意思，用中文写一段话。至少用两个具体的事例把它写出来。",
            ),
            paragraphBank,
            ["zh3-paragraph-details", "zh3-paragraph-stays"],
            { minWords: 100, maxChars: 1000 },
            onePiece,
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
            "A diary begins with a line of its own: the **date**, the **weekday** and the **weather**, such as *10月12日　星期六　晴*. Then you write what happened that day.\n\nIn an observation diary, what happened is what you **saw**. Look closely and write the details: its colour, its shape, how big it is, how it moves. *豆芽长出来了* says little; *豆芽顶着黄黄的豆瓣，像戴了一顶小帽子* lets the reader see it.",
            "日记开头单独写一行：**日期**、**星期**和**天气**，比如“10月12日　星期六　晴”。下面再写这一天的事。\n\n观察日记写的事，就是你**看到的**。要仔细看，把细节写出来：它的颜色、形状、大小，它怎么动。“豆芽长出来了”说得太少；“豆芽顶着黄黄的豆瓣，像戴了一顶小帽子”，读者才能看到它。",
          ),
          writingGenerator(
            t(
              "Write an observation diary entry in Chinese. Begin with the date, the weekday and the weather, and describe what you observe in detail.",
              "用中文写一篇观察日记。开头写上日期、星期和天气，细致地写出你观察到的样子。",
            ),
            diaryBank,
            ["zh3-diary-form", "zh3-diary-observed"],
            { minWords: 150, maxChars: 1200 },
            onePiece,
          ),
        ),
        point(
          "writing-3-diary-change",
          t("Noticing What Changes", "写出变化和感受"),
          t(
            "What you observe keeps changing: a bean grows a root, the moon gets rounder, a snail comes out after rain. A good diary entry tells **what is different today** or what you noticed for the first time, and then **how you felt** or what you wondered: *它为什么只在下雨后出来呢？*",
            "观察的东西一直在变：豆子长出了根，月亮一天天变圆，雨后蜗牛爬了出来。好的观察日记要写出**今天有什么不一样**，或者你第一次发现了什么，再写写**你的感受**或者你想到的问题：“它为什么只在下雨后才出来呢？”",
          ),
          writingGenerator(
            t(
              "Write an observation diary entry in Chinese. Tell what has changed or what you noticed for the first time, and how you felt about it.",
              "用中文写一篇观察日记。写出它的变化或你第一次发现的地方，以及你的感受。",
            ),
            diaryBank,
            ["zh3-diary-change", "zh3-diary-form"],
            { minWords: 150, maxChars: 1200 },
            onePiece,
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
            "Every event has three parts. The **beginning** (起因) is what started it, the **course** (经过) is what happened, and the **end** (结果) is how it came out. Tell them in that order, and the reader can follow.\n\nThe course is the heart of the story, so it gets the most words. The beginning and the end can be short.",
            "每件事都有三个部分。**起因**是事情怎么开始的，**经过**是事情是怎样发生的，**结果**是事情最后怎么样了。按这个顺序写，读者就能看明白。\n\n经过是一件事的主要部分，要写得最多；起因和结果可以写得简短些。",
          ),
          writingGenerator(
            t(
              "Write about the event below in Chinese. Tell its beginning, its course and its end, in that order.",
              "用中文写下面这件事。按顺序写清楚它的起因、经过和结果。",
            ),
            eventBank,
            ["zh4-event-parts", "zh4-event-feeling"],
            { minWords: 300, maxChars: 2000 },
            onePiece,
          ),
        ),
        point(
          "writing-4-event-detail",
          t("The Important Moment in Detail", "把重要的部分写具体"),
          t(
            "In *我们赢了拔河比赛*, the moment that matters is the last few seconds of pulling. Slow it down: what did people **do** (咬紧牙、身子往后仰), what did they **say** (“一二，加油！”), what did you **think**? A moment told this way lets the reader feel it with you. Then say what you felt or learned, and let it follow from what happened.",
            "写“我们赢了拔河比赛”，最重要的是最后那几秒钟。把它写慢一点：大家**做**了什么（咬紧牙、身子往后仰），**说**了什么（“一二，加油！”），你心里**想**了什么？这样写，读者就能和你一起感受到。最后写出你的感受或收获，它要从这件事里自然地得出来。",
          ),
          writingGenerator(
            t(
              "Write about the event below in Chinese. Tell its most important moment in detail: what people did, said and thought.",
              "用中文写下面这件事。把最重要的部分写具体：人们做了什么、说了什么、想了什么。",
            ),
            eventBank,
            ["zh4-event-detail", "zh4-event-feeling"],
            { minWords: 300, maxChars: 2000 },
            onePiece,
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
            "A Chinese letter has a fixed form. The **person written to** goes on the first line, against the left edge, followed by a colon: *亲爱的小林：*. The next line starts with a **greeting** such as *你好！*, two characters in. Then comes the **body**. After it, *祝* or *此致* starts a line two characters in, and the **wish** (*身体健康！*, *敬礼！*) goes against the left edge on the next line. The **writer's name** and the **date** go at the bottom right, one under the other.",
            "书信有固定的格式。第一行顶格写**称呼**，后面加冒号：“亲爱的小林：”。第二行空两格写**问候语**，比如“你好！”。接着写**正文**。正文后面另起一行空两格写“祝”或“此致”，再下一行顶格写**祝福语**（“身体健康！”“敬礼！”）。**署名**和**日期**写在右下方，日期在署名下面。",
          ),
          writingGenerator(
            t("Write the letter below in Chinese, in the form of a Chinese letter.", "用中文写下面这封信，注意书信的格式。"),
            letterBank,
            ["zh4-letter-form", "zh4-letter-purpose"],
            { minWords: 200, maxChars: 1600 },
            onePiece,
          ),
        ),
        point(
          "writing-4-letter-detail",
          t("What the Reader Wants to Know", "写出对方想知道的内容"),
          t(
            "Every letter has a **purpose**: to share news, to thank, to ask. Keep the body on it, and write in a way that suits the reader, a grandparent or a friend.\n\n*我很好，学习很好* tells the reader nothing. Give **concrete** news, reasons or questions: what you learned to do this term, why you are thanking them, what you want to know about their new school.",
            "每封信都有**目的**：告诉对方消息、表示感谢、提出请求。正文要围绕这个目的来写，说话的语气也要适合收信人，是长辈还是朋友。\n\n“我很好，学习也很好”什么也没有告诉对方。要写出**具体的**消息、理由或问题：这学期你学会了什么，你为什么感谢他，你想知道他新学校的哪些事。",
          ),
          writingGenerator(
            t(
              "Write the letter below in Chinese. Give the concrete news, reasons or questions your reader would want.",
              "用中文写下面这封信。写出收信人想知道的具体消息、理由或问题。",
            ),
            letterBank,
            ["zh4-letter-detail", "zh4-letter-purpose"],
            { minWords: 200, maxChars: 1600 },
            onePiece,
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
            "Choose **one quality** of the person, the one that makes them who they are: patient, careless, brave. Then choose an **event** in which that quality can be seen. *我的同桌很马虎* is a claim; the morning he came to school with one blue sock and one red one shows it.",
            "抓住人物的**一个特点**，就是最能让人记住他的那一点：耐心、马虎、勇敢。再选一件能看出这个特点的**事**。“我的同桌很马虎”只是一句话；他穿着一只蓝袜子、一只红袜子来上学的那个早上，才让人看到他的马虎。",
          ),
          writingGenerator(
            t(
              "Write about the person below in Chinese. Make one quality clear, and show it through a concrete event.",
              "用中文写下面这个人。写出他的一个特点，并用一件具体的事表现出来。",
            ),
            personBank,
            ["zh5-person-trait", "zh5-person-example"],
            { minWords: 350, maxChars: 2400 },
            onePiece,
          ),
        ),
        point(
          "writing-5-person-description",
          t("Actions, Words and Looks", "描写动作、语言和神态"),
          t(
            "Inside the event, let the person **act and speak**. *奶奶很耐心* becomes *奶奶戴上老花镜，一针一针地帮我把扣子缝好，笑着说：“别急，慢慢来。”* The actions (戴上、一针一针地缝), the words and the look (笑着) show the patience without naming it.",
            "在事情里，让人物自己**动起来、说起来**。“奶奶很耐心”可以写成：“奶奶戴上老花镜，一针一针地帮我把扣子缝好，笑着说：‘别急，慢慢来。’”动作（戴上、一针一针地缝）、语言和神态（笑着）不用说出“耐心”两个字，就把耐心写出来了。",
          ),
          writingGenerator(
            t(
              "Write about the person below in Chinese. Bring out their quality through their actions, words and looks.",
              "用中文写下面这个人。通过他的动作、语言和神态写出他的特点。",
            ),
            personBank,
            ["zh5-person-description", "zh5-person-trait"],
            { minWords: 350, maxChars: 2400 },
            onePiece,
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
            "An explanation tells the reader **what a thing is like**, not a story about it. Sort what you know into **features**: what it looks like, what it is made of, how it works, what it is used for. Give each feature a paragraph of its own, and say only what is true.",
            "说明文是告诉读者一种事物**是什么样的**，不是讲关于它的故事。把你知道的内容分成几个**方面**：样子、构造、怎样工作、有什么用处。每个方面写一段，写的都要是真实准确的。",
          ),
          writingGenerator(
            t(
              "Write an explanation in Chinese of the thing below. Explain it feature by feature, plainly and accurately.",
              "用中文写一篇说明文，介绍下面这种事物。分几个方面来介绍，写得准确、平实。",
            ),
            explainBank,
            ["zh5-explain-features", "zh5-explain-plain"],
            { minWords: 300, maxChars: 2000 },
            onePiece,
          ),
        ),
        point(
          "writing-5-explain-methods",
          t("Methods of Explaining", "说明方法"),
          t(
            "Methods make an explanation clear. **列数字**: *一只成年大熊猫每天要吃十几千克竹子。* **作比较**: compare it with something the reader knows. **举例子**: name a case. **分类别**: sort it into kinds. **打比方**: *叶子像一把把小扇子。* Use at least one, and keep the facts accurate.",
            "用上说明方法，介绍会更清楚。**列数字**：“一只成年大熊猫每天要吃十几千克竹子。”**作比较**：拿读者熟悉的东西来比。**举例子**：举出具体的例子。**分类别**：分成几类来说。**打比方**：“叶子像一把把小扇子。”至少用上一种，写的事实要准确。",
          ),
          writingGenerator(
            t(
              "Write an explanation in Chinese of the thing below. Use at least one method of explaining, such as numbers, a comparison or an example.",
              "用中文写一篇说明文，介绍下面这种事物。至少用上一种说明方法，比如列数字、作比较或举例子。",
            ),
            explainBank,
            ["zh5-explain-methods", "zh5-explain-plain"],
            { minWords: 300, maxChars: 2000 },
            onePiece,
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
            "Start by stating your **view** clearly: *我认为，失败并不全是坏事。* Then give **evidence**: an example from history or your own life, a fact, a well-known saying. Two pieces that really bear on the view are worth more than five that are only near it.",
            "开头就把**观点**说清楚：“我认为，失败并不全是坏事。”然后摆出**事例**：历史上或生活中的例子、事实、大家熟悉的名言。两个真正能证明观点的事例，比五个沾边的事例更有力。",
          ),
          writingGenerator(
            t(
              "Write a short essay in Chinese on the question below. State your view clearly and support it with at least two pieces of evidence.",
              "就下面的问题，用中文写一篇短文。明确提出你的观点，并用至少两个事例来支持它。",
            ),
            argueBank,
            ["zh6-argue-claim", "zh6-argue-evidence"],
            { minWords: 400, maxChars: 2800 },
            onePiece,
          ),
        ),
        point(
          "writing-6-argue-reasoning",
          t("Explaining the Evidence", "说明事例怎样证明观点"),
          t(
            "An example does not speak for itself. After each one, say **how it supports the view**: *爱迪生试了上千种材料才找到合适的灯丝，正是一次次失败告诉他哪条路走不通。* At the end, **come back to the view**, so the reader closes the essay knowing what you think and why.",
            "事例不会自己说话。每举一个例子，都要说明它**怎样证明观点**：“爱迪生试了上千种材料才找到合适的灯丝，正是一次次失败告诉他哪条路走不通。”结尾要**回到观点**，让读者读完就知道你怎么想、为什么这样想。",
          ),
          writingGenerator(
            t(
              "Write a short essay in Chinese on the question below. Explain how each piece of evidence supports your view, and come back to the view at the end.",
              "就下面的问题，用中文写一篇短文。说明每个事例怎样证明你的观点，结尾回到观点。",
            ),
            argueBank,
            ["zh6-argue-reasoning", "zh6-argue-claim"],
            { minWords: 400, maxChars: 2800 },
            onePiece,
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
            "A scene is easier to picture when it is written in an **order**: from near to far, from top to bottom, or as time passes, from morning to evening. Use **more than one sense**: what you see, and also what you hear, smell or feel. A **comparison** helps too: *远处的山像一头头卧着的牛。*",
            "按一定的**顺序**写景，读者更容易想象：由近到远、从上到下，或者按时间先后，从早到晚。要调动**多种感官**：写看到的，也写听到的、闻到的、摸到的。**比喻**等修辞也能帮忙：“远处的山像一头头卧着的牛。”",
          ),
          writingGenerator(
            t(
              "Describe the scene below in Chinese. Write in a clear order, and use more than one sense.",
              "用中文写下面这处景物。按一定的顺序写，调动多种感官。",
            ),
            sceneBank,
            ["zh6-scene-order", "zh6-scene-senses"],
            { minWords: 400, maxChars: 2800 },
            onePiece,
          ),
        ),
        point(
          "writing-6-scene-feeling",
          t("A Feeling in the Scene", "把感情融进景物"),
          t(
            "The same rain can feel fresh or lonely; what you choose to describe shows **your mood**. Let a feeling run through the scene, glad, calm, homesick, and choose details that carry it. Somewhere, often at the end, make clear what the feeling is.",
            "同样一场雨，可以写得清新，也可以写得冷清；你选择写什么，就流露出**你的心情**。让一种感情贯穿全文，高兴、宁静或者想家，选择能表现这种感情的景物和细节。在某个地方，常常是结尾，把这种感情点明。",
          ),
          writingGenerator(
            t(
              "Describe the scene below in Chinese. Let a feeling run through it, and make clear what that feeling is.",
              "用中文写下面这处景物。让一种感情贯穿全文，并把它点明。",
            ),
            sceneBank,
            ["zh6-scene-feeling", "zh6-scene-senses"],
            { minWords: 400, maxChars: 2800 },
            onePiece,
          ),
        ),
      ],
    },
  },
];
