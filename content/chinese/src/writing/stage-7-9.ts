// The judged writing of grades 7 and 8 added by docs/chinese-curriculum.md §18.9: for grade 7, writing with feeling,
// expanding and condensing, association and imagination, and applications and suggestions; for grade 8, news, travel
// writing, rewriting and research reports. A Chinese character counts as a word in every length; the compositions meet
// the stage 4 standard of at least 500 characters.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { feelingBank, imaginationBank7 } from "./bank-g.ts";
import { applicationBank, condenseBank, expandBank, suggestionBank } from "./bank-h.ts";
import { newsBank, travelBank } from "./bank-i.ts";
import { reportBank, rewriteBank } from "./bank-j.ts";

/** criterion finds a criterion by its id, failing when there is none. */
const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

/** quotedLines quotes every line of a model, so that a model of several lines stays one quotation. */
const quotedLines = (model: string): string =>
  model
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

/** worked writes the solution of a task: what to plan, the model as one good answer, and how to check one's own. */
const worked =
  (plan: Text, check: Text) =>
  (model: string): Text =>
    t(
      `**Step 1: plan what to write.** ${plan.en}\n\n**Step 2: write it.** One good answer:\n\n${quotedLines(model)}\n\n**Check.** ${check.en}`,
      `**第一步：想好要写什么。**${plan["zh-CN"]}\n\n**第二步：写下来。**一篇好的答案：\n\n${quotedLines(model)}\n\n**检验。** ${check["zh-CN"]}`,
    );

const ESSAY = { minWords: 500, maxChars: 3200 } as const;
const CONDENSE = { minWords: 100, maxChars: 400 } as const;
const PRACTICAL = { minWords: 300, maxChars: 2400 } as const;

/** stageSevenNineJudged are the judged writing topics of grades 7 to 9 proposed in docs/chinese-curriculum.md §18.9. */
export const stageSevenNineJudged: readonly GradeTopic[] = [
  {
    grade: 7,
    topic: {
      id: "writing-7-feeling",
      title: t("Writing With Feeling", "抒发真情"),
      summary: t(
        "Write a composition in Chinese whose feeling grows out of something real in your life, is carried by scenes, objects and details, and is said outright where it fits.",
        "用中文写一篇有真情实感的作文：感情从自己生活中真实的人、事、物、景里来，借景物、细节表达出来，在合适的地方直接抒发。",
      ),
      intro: t(
        "Feeling in a composition is not a word like “moved” or “sad” repeated; it is something the reader comes to feel because of what you tell. It needs a **source**, a real person, thing or scene from your life, and a **carrier**, the details that hold it.\n\nA pupil misses her grandmother's courtyard. She does not write “I miss it very much” five times; she writes the old well, the bench polished smooth, the grandmother calling her name across the yard at dusk; and only at the end, once: “那一声呼唤，我到现在还听得见。” The first knowledge point finds the source and carries the feeling in details, the second says it outright at the right place.",
        "作文里的感情，不是把“感动”“难过”这些词说上好几遍，而是你写的内容让读者自己感受到的。它要有一个**来源**：自己生活中真实的人、事、物、景；还要有**载体**：装着感情的那些细节。\n\n比如一个同学想念奶奶家的小院。她没有写五遍“我非常想念它”，而是写那口老井、那条被坐得发亮的长凳、傍晚奶奶隔着院子喊她名字的声音；只在结尾写了一句：“那一声呼唤，我到现在还听得见。”第一个知识点找到感情的来源，借细节来表达；第二个在合适的地方直接抒发。",
      ),
      prerequisites: ["writing-7-center"],
      xp: 26,
      strand: "writing",
      encompasses: [],
      criteria: ["zh7-feeling-source", "zh7-feeling-carry", "zh7-feeling-express"].map(criterion),
      knowledgePoints: [
        point(
          "writing-7-feeling-carry",
          t("Feeling Carried by Details", "借事物和细节抒情"),
          t(
            "Choose one real person, thing or scene the feeling comes from, and tell it concretely. Then let a scene, an object or an action hold the feeling, so that the reader feels it without being told.\n\nNot “I was very sad when my friend moved away”, but “他的座位空了，桌角那块他用小刀刻的五角星还在，我用手指摸了一遍又一遍”.\n\n> **Watch out.** Adjectives of feeling are not feeling: “非常非常难过” says less than one true detail. And a feeling borrowed from a story you have read, with nothing of your own life in it, rings false.",
            "选一个感情所来自的真实的人、事、物或景，把它写具体；再让一处景物、一件东西或一个动作装着这份感情，读者不用你说，也能感受到。\n\n不写“朋友搬走了，我很难过”，而写“他的座位空了，桌角那块他用小刀刻的五角星还在，我用手指摸了一遍又一遍”。\n\n> **注意。** 表示感情的形容词不等于感情：“非常非常难过”还不如一个真实的细节有分量。从别人的故事里借来的感情，没有自己生活的影子，读起来就是假的。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the composition the task asks for, at least 500 characters. Let the feeling come from something real and be carried by concrete details.",
              "按题目的要求，用中文写一篇不少于500字的作文。感情要从真实的生活中来，借具体的细节表达出来。",
            ),
            feelingBank,
            ["zh7-feeling-source", "zh7-feeling-carry"],
            ESSAY,
            worked(
              t(
                "Name the feeling in one word for yourself, then the real person, thing or scene it comes from; list two or three details, an object, a sound, an action, that hold it.",
                "先自己用一个词说出这份感情，再找到它来自的那个真实的人、事、物或景；列出两三个装着它的细节：一件东西、一个声音、一个动作。",
              ),
              t(
                "Cross out every word that only names the feeling, such as 感动 or 难过: the passages that remain still convey it.",
                "把只是说出感情的词，比如“感动”“难过”，都划掉再读：剩下的段落仍然能让人感受到这份感情。",
              ),
            ),
          ),
        ),
        point(
          "writing-7-feeling-express",
          t("Saying the Feeling Outright", "直接抒情"),
          t(
            "After the feeling has been built up by what you tell, say it outright once or twice where it is strongest, at the turning point or at the end, in your own words and in a sentence that grows from what came before.\n\nAfter telling how her father walked her to school through the snow, a pupil ends: “原来爸爸的爱，就藏在那一串比我大得多的脚印里。”\n\n> **Watch out.** An outburst that comes from nowhere, or a slogan such as “啊，伟大的母爱！” that could end any composition, is not sincere. Say it once, in a sentence only your story could have.",
            "先用叙述和描写把感情蓄足，再在感情最强烈的地方，比如转折处或结尾，用自己的话直接说出来一两次，这句话要从前面的内容里长出来。\n\n比如写了爸爸冒雪送自己上学之后，结尾写：“原来爸爸的爱，就藏在那一串比我大得多的脚印里。”\n\n> **注意。** 没有铺垫就突然喊出来的感情，或者像“啊，伟大的母爱！”这样放在哪篇作文结尾都行的口号，都不真诚。只说一次，而且说一句只有你的故事才写得出的话。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the composition the task asks for, at least 500 characters. Build up the feeling from something real, and say it outright at a fitting point.",
              "按题目的要求，用中文写一篇不少于500字的作文。从真实的生活中写出感情，并在合适的地方直接抒发出来。",
            ),
            feelingBank,
            ["zh7-feeling-express", "zh7-feeling-source"],
            ESSAY,
            worked(
              t(
                "Decide where the feeling is strongest; draft the one sentence you will say there, using an object or a moment from your own story.",
                "想好感情在哪里最强烈；先写下要在那里说的一句话，让它用上你故事里的一件东西或一个时刻。",
              ),
              t(
                "Read your outright sentence alone: it names something that appears earlier in your piece, so it could not be moved into another composition.",
                "单独读你直接抒情的那句话：它说到了文章前面出现过的东西，搬到别的作文里就不成立。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 7,
    topic: {
      id: "writing-7-expand-condense",
      title: t("Expanding and Condensing", "扩写和缩写"),
      summary: t(
        "Rewrite a given text in Chinese: expand a short one into a composition of at least 500 characters with fitting detail, or condense a long one into about 150 characters, keeping to the original either way.",
        "用中文改写给出的文章：把短的扩写成不少于500字的作文，加上合理的细节；或者把长的缩写成150字左右；两种都要忠于原文。",
      ),
      intro: t(
        "Expanding and condensing both start from someone else's text and both must keep to it: the people, what happens, in what order and how it ends stay the same. What changes is how much is told.\n\nTake “小明把捡到的钱包交给了警察”. Expanded, it shows the wet pavement, the fat brown wallet, his hesitation at the shop window and the policeman's smile; condensed from a long story, it may shrink back to that one sentence. The first knowledge point expands, the second condenses.",
        "扩写和缩写都从别人的文章出发，都要忠于原文：人物、事情、先后顺序和结果都不能变。变的只是写多少。\n\n比如“小明把捡到的钱包交给了警察”。扩写时，可以写出湿漉漉的街道、鼓鼓的棕色钱包、他在商店橱窗前的犹豫和警察的笑容；而一篇长长的故事缩写之后，也可能就剩下这一句话。第一个知识点学扩写，第二个学缩写。",
      ),
      prerequisites: ["writing-7-detail"],
      xp: 24,
      strand: "writing",
      encompasses: [],
      criteria: ["zh7-rewrite-faithful", "zh7-expand-detail", "zh7-condense-brief"].map(criterion),
      knowledgePoints: [
        point(
          "writing-7-expand-condense-expand",
          t("Expanding a Short Text", "扩写"),
          t(
            "Read the original until you know its people, events and ending; find the key moment it only mentions. Then add what it implies: the scene, actions, words, looks and thoughts, most of all at the key moment, until it reaches the length asked.\n\n“老人把伞给了我” can become the rain on the roof, the old man's hand shaking as he opens the umbrella, and “你拿着，我家就在前面”.\n\n> **Watch out.** Expanding is not inventing a different story: if the original says the old man gave the umbrella, he cannot ask for money, and a new ending breaks the task. Added detail must fit the original's time and people.",
            "先读原文，读到清楚它的人物、事情和结果；找出原文只提了一句的关键地方。再把原文暗含的内容加进去：环境、动作、语言、神态和心理，尤其要把关键地方写开，写到要求的字数。\n\n比如“老人把伞给了我”，可以写出雨打在屋檐上，老人撑开伞时手有些发抖，他说：“你拿着，我家就在前面。”\n\n> **注意。** 扩写不是另编一个故事：原文说老人把伞给了我，就不能写他要钱；换一个结局就不符合要求了。加的细节要合原文的时代和人物。",
          ),
          writingGenerator(
            t(
              "Expand in Chinese the original the task gives into a composition of at least 500 characters. Keep its people, events and ending, and add fitting detail.",
              "按题目的要求，用中文把给出的原文扩写成不少于500字的作文。不改变原文的人物、事情和结果，加上合理的细节。",
            ),
            expandBank,
            ["zh7-expand-detail", "zh7-rewrite-faithful"],
            ESSAY,
            worked(
              t(
                "Underline in the original each person, event and the ending; mark the one or two places you will open out, and note what can be seen, heard and thought there.",
                "在原文里画出每个人物、每件事和结果；标出要展开写的一两处，记下那里能看见、听见和想到的东西。",
              ),
              t(
                "Put the original beside your expansion and tick each of its sentences: every one has a place in yours, in the same order, and nothing in yours contradicts it.",
                "把原文放在扩写旁边，一句一句打勾：原文的每一句在你的文章里都有着落，顺序不变，而且没有一处和它矛盾。",
              ),
            ),
          ),
        ),
        point(
          "writing-7-expand-condense-condense",
          t("Condensing a Long Text", "缩写"),
          t(
            "Find the main people and the main events from beginning to end, and keep them in order. Drop description, long dialogue and minor episodes; then join what is left in your own plain words into a smooth short piece of the length asked.\n\nA long story of a boy who stays up mending his sister's kite, with three paragraphs on the night sky, condenses to “弟弟熬夜修好了姐姐的风筝，第二天姐姐放飞了它”, with the reason and the result.\n\n> **Watch out.** Copying the first sentence of every paragraph gives fragments, not a whole; and leaving out the ending or the cause loses the story. Going far over the length asked means you have not condensed.",
            "先找出主要人物和从开头到结尾的主要事情，按顺序留下来。去掉描写、大段对话和次要的情节；再用自己平实的话把留下的内容连起来，写成一篇通顺的短文，字数合乎要求。\n\n比如一篇长故事，写弟弟熬夜给姐姐修风筝，其中有三段写夜空，缩写后可以是“弟弟熬夜修好了姐姐的风筝，第二天姐姐放飞了它”，再加上起因和结果。\n\n> **注意。** 把每段的第一句抄下来，得到的是碎片，不是一篇短文；漏掉结果或起因，故事就不完整了。字数大大超过要求，说明还没有真正缩写。",
          ),
          writingGenerator(
            t(
              "Condense in Chinese the text the task gives to about 150 characters. Keep the main people and events in order, and join them smoothly.",
              "按题目的要求，用中文把给出的文章缩写成150字左右。按顺序保留主要人物和事情，语句通顺连贯。",
            ),
            condenseBank,
            ["zh7-condense-brief", "zh7-rewrite-faithful"],
            CONDENSE,
            worked(
              t(
                "Write one line for each part of the original, the cause, the turns and the result; cross out the lines that are only description or minor detail.",
                "原文的每一部分写一行：起因、经过中的几次变化、结果；划掉只是描写或次要细节的那几行。",
              ),
              t(
                "Count your characters, then read your text to someone who has not read the original: they can tell who did what, why, and how it ended.",
                "数一数字数；再把缩写读给没读过原文的人听：他能说出谁做了什么、为什么、结果怎样。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 7,
    topic: {
      id: "writing-7-imagination",
      title: t("Association and Imagination", "发挥联想和想象"),
      summary: t(
        "Write a composition in Chinese that starts from a given thing, picture or situation and leads from it by association or imagination, describing what is imagined concretely and coming back to real life.",
        "用中文写一篇作文：从给出的事物、画面或情境出发，通过联想和想象展开，把想到的内容写具体，最后回到现实生活。",
      ),
      intro: t(
        "**Association** goes from one thing to another that is like it or tied to it in your life; **imagination** builds something you have not seen. Both need a starting point and a thread the reader can follow.\n\nStart from an old key found in a drawer. By association: the door it opened, the house the family left, grandfather turning it each night. By imagination: the key speaks and tells what that door has seen in forty years. Either way the piece comes back to the key in your hand and what it means now. The first knowledge point leads from the starting point and makes the imagined vivid, the second gives it a meaning.",
        "**联想**是由一个事物想到生活中和它相似或相关的另一个事物；**想象**是创造出自己没有见过的东西。两者都要有一个出发点，还要有一条读者跟得上的线索。\n\n比如从抽屉里翻出的一把旧钥匙出发。联想：它开过的那扇门，全家搬离的老房子，爷爷每晚转动它的声音。想象：钥匙开口说话，讲那扇门四十年来看见的事。不论哪一种，文章最后都回到手里的这把钥匙，和它现在的意义。第一个知识点从出发点展开，把想到的写生动；第二个让想象有意义。",
      ),
      prerequisites: ["writing-5-imagination"],
      xp: 24,
      strand: "writing",
      encompasses: [],
      criteria: ["zh7-imagine-link", "zh7-imagine-vivid", "zh7-imagine-meaning"].map(criterion),
      knowledgePoints: [
        point(
          "writing-7-imagination-link",
          t("Leading Out from a Starting Point", "由出发点展开联想和想象"),
          t(
            "Begin with the thing, picture or word the task gives, and say plainly what it makes you think of. Let each step follow from the one before by likeness or connection, and at each step describe what is seen, heard or felt.\n\nFrom a drop of rain on the window: it has fallen from a cloud over the sea, slid down a mountain stream, waited in a farmer's well; at each place, what it saw.\n\n> **Watch out.** Jumping to something with no link, such as from the raindrop straight to a football match, loses the reader. And naming places one after another without showing any of them is a list, not imagination.",
            "从题目给出的事物、画面或词语开头，说清楚它让你想到了什么。每一步都要因为相似或相关而从上一步引出来，每到一处，都写出看见的、听见的、感受到的。\n\n比如从窗上的一滴雨出发：它从海上的云里落下来，顺着山涧滑下去，在农家的井里等过；每到一处，写它看见了什么。\n\n> **注意。** 突然跳到毫无联系的东西上，比如从雨滴一下子写到足球赛，读者就跟不上了。只把地方一个个说出来，一处也没写出样子，那是列清单，不是想象。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the composition the task asks for, at least 500 characters. Lead out from the starting point by association or imagination, and describe what you imagine concretely.",
              "按题目的要求，用中文写一篇不少于500字的作文。从出发点展开联想或想象，把想到的内容写具体。",
            ),
            imaginationBank7,
            ["zh7-imagine-link", "zh7-imagine-vivid"],
            ESSAY,
            worked(
              t(
                "Write the starting point in the middle of a page and draw from it a chain of three or four steps; beside each, note one sight, sound or feeling.",
                "把出发点写在纸中间，从它画出三四步联想或想象的链条；在每一步旁边记下一个画面、声音或感受。",
              ),
              t(
                "Trace your chain in the finished piece: each step says why it follows from the one before, and each is shown, not just named.",
                "在写好的文章里找出这条链：每一步都交代了为什么由上一步想到，每一步都写出了样子，不只是名字。",
              ),
            ),
          ),
        ),
        point(
          "writing-7-imagination-meaning",
          t("Giving the Imagining a Meaning", "让想象有意义"),
          t(
            "Know before you write what feeling or thought your imagining carries, and let it guide which steps you keep. By the end, come back to real life: the thing in front of you, or what you now see or will do differently.\n\nAfter imagining the forty years an old bridge has carried people, a pupil ends standing on it, noticing for the first time the worn stones under her feet.\n\n> **Watch out.** Drifting from one fancy to the next with no thread and no return leaves the reader asking “so what?”. But the meaning must come from the imagining itself; a moral tacked on in the last line does not count.",
            "动笔之前就想好，你的想象里装着什么感情或想法，让它决定留下哪些内容。到结尾，回到现实生活：回到眼前的事物上，或者写出你现在看到了什么、打算怎样做。\n\n比如想象了一座老桥四十年来送过的人以后，小作者在结尾站到桥上，第一次注意到脚下被磨得光滑的石头。\n\n> **注意。** 一个奇想接着一个奇想，没有线索也不回来，读者会问“那又怎样？”。但意义要从想象本身里来，最后一句硬加上的道理不算。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the composition the task asks for, at least 500 characters. Let your imagining carry a feeling or thought, and come back to real life at the end.",
              "按题目的要求，用中文写一篇不少于500字的作文。让想象表达一种感情或想法，结尾回到现实生活。",
            ),
            imaginationBank7,
            ["zh7-imagine-meaning", "zh7-imagine-link"],
            ESSAY,
            worked(
              t(
                "Write in one sentence what you want the reader to feel or think at the end; then choose the imagined steps that lead there and drop the rest.",
                "用一句话写下你想让读者在结尾感受或想到什么；再选出通向它的想象内容，其余的舍去。",
              ),
              t(
                "Read the beginning and the end together: the end returns to the starting point or to real life, and it follows from what you imagined in between.",
                "把开头和结尾放在一起读：结尾回到了出发点或现实生活，而且是从中间想象的内容里自然得出的。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 7,
    topic: {
      id: "writing-7-practical",
      title: t("Applications and Suggestions", "写申请书和建议书"),
      summary: t(
        "Write in Chinese an application and a letter of suggestion in the proper form, saying plainly what is asked for or proposed, why, and what concretely will be done.",
        "用中文按格式写申请书和建议书：说清楚申请或建议什么、为什么，以及具体怎样做。",
      ),
      intro: t(
        "An application asks someone with the power to decide for something; a letter of suggestion proposes how to fix a problem. Both have the same form: a title, 申请书 or 建议书, in the middle of the first line; the addressee at the left margin with a colon; the body; 此致 and, on the next line at the margin, 敬礼; and the writer's name and the date at the bottom right.\n\nA pupil who wants the reading corner opened at lunch writes to the head teacher: what she asks, that thirty classmates eat early and wait idle, and that she and two friends will keep the books in order and lock up at 12:50. The first knowledge point writes an application, the second a suggestion.",
        "申请书是向有权决定的人请求一件事；建议书是提出解决一个问题的办法。两者格式相同：第一行正中写标题“申请书”或“建议书”；第二行顶格写称呼，后面加冒号；然后是正文；正文后写“此致”，下一行顶格写“敬礼”；最后在右下方写署名和日期。\n\n比如一个同学想让学校午休时开放图书角，就给校长写信：说明申请什么，说明班上三十个同学吃完饭没事可做，再写她和两个同学负责整理图书、12点50分锁门。第一个知识点写申请书，第二个写建议书。",
      ),
      prerequisites: ["writing-6-plan-summary"],
      xp: 22,
      strand: "writing",
      encompasses: [],
      criteria: ["zh7-practical-form", "zh7-practical-reason", "zh7-practical-concrete"].map(criterion),
      knowledgePoints: [
        point(
          "writing-7-practical-application",
          t("Writing an Application", "写申请书"),
          t(
            "Set it out in the form of an application. Begin the body by saying plainly what you apply for; then give your reasons, facts about yourself or the situation; then what you will do if it is granted. End with a polite request and the closing.\n\n“我申请担任班级图书管理员” first; then “我每周读两本书，熟悉图书分类”; then “每天中午12点到12点半借还图书”.\n\n> **Watch out.** Reasons such as “我很想” only say you want it, not why it should be granted; give facts. And a missing addressee, closing or date makes it no longer an application but a note.",
            "按申请书的格式写。正文一开头就说清楚申请什么；接着说理由，写出关于自己或情况的事实；再写如果获准，你会怎样做。最后礼貌地提出请求，写好结尾。\n\n比如先写“我申请担任班级图书管理员”；再写“我每周读两本书，熟悉图书分类”；然后写“每天中午12点到12点半借还图书”。\n\n> **注意。** “我很想”这样的理由只说明你想要，没说明为什么该同意你，要写事实。缺了称呼、结尾或日期，就不再是申请书，只是一张便条了。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the application the task asks for, in the proper form, with what you ask for and your reasons.",
              "按题目的要求，用中文写一份格式正确的申请书，写清楚申请什么和理由。",
            ),
            applicationBank,
            ["zh7-practical-form", "zh7-practical-reason"],
            PRACTICAL,
            worked(
              t(
                "Write the frame first: title, addressee, 此致, 敬礼, name, date. Then note in the body what you ask for, two or three facts as reasons, and what you will do.",
                "先写好框架：标题、称呼、此致、敬礼、署名、日期。再在正文处记下：申请什么，两三条作为理由的事实，以及你会怎样做。",
              ),
              t(
                "Check the form line by line against the six parts, and read the reasons as the person deciding: each is a fact, not only a wish.",
                "对照六个部分一行一行查格式；再站在作决定的人的角度读理由：每一条都是事实，不只是愿望。",
              ),
            ),
          ),
        ),
        point(
          "writing-7-practical-suggestion",
          t("Writing a Suggestion", "写建议书"),
          t(
            "Set it out in the form of a letter of suggestion. In the body, describe the problem with facts, say why it matters, then give your measures one by one, each something its reader can actually do. Keep the tone respectful to the reader.\n\nOn wasted food in the canteen: “每天倒掉的剩饭大约有两桶”; then measures “一、分大小份盛饭；二、每周评一次‘光盘班级’”.\n\n> **Watch out.** “希望大家不要浪费” is a wish, not a measure: say who does what. And a suggestion that blames or orders, such as “食堂必须马上改”, will not be taken up.",
            "按建议书的格式写。正文先用事实说明问题，再说为什么要解决它，然后分条提出建议，每一条都要是对方真能做到的。语气要尊重对方。\n\n比如写食堂浪费：“每天倒掉的剩饭大约有两桶”；然后提出建议“一、盛饭分大份和小份；二、每周评一次‘光盘班级’”。\n\n> **注意。** “希望大家不要浪费”是愿望，不是办法，要写出谁来做什么。指责对方、命令对方的建议，比如“食堂必须马上改”，不会被采纳。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the letter of suggestion the task asks for, in the proper form, with the problem and concrete, workable measures.",
              "按题目的要求，用中文写一份格式正确的建议书，写清楚问题，提出具体可行的建议。",
            ),
            suggestionBank,
            ["zh7-practical-concrete", "zh7-practical-reason"],
            PRACTICAL,
            worked(
              t(
                "Note one or two facts that show the problem; then list three measures, and beside each write who would carry it out.",
                "记下一两个说明问题的事实；再列出三条建议，在每条旁边写上由谁来做。",
              ),
              t(
                "Read each measure and ask whether its reader could start on it tomorrow; rewrite any that is only a hope or that orders the reader about.",
                "逐条读建议，问一问对方明天能不能着手去做；只是愿望的、或者命令对方的，改写。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 8,
    topic: {
      id: "writing-8-news",
      title: t("Writing News", "写消息"),
      summary: t(
        "Write a news report in Chinese of at least 500 characters about a school or local event: a headline and a lead that give the main fact, then the facts in order of importance, told without the writer's feelings.",
        "用中文就学校或身边的一件事写一则不少于500字的消息：标题和导语交代最主要的事实，主体按重要程度写出事实，用事实说话，不加作者的抒情。",
      ),
      intro: t(
        "A news report answers what a reader wants to know first: who, what, when, where, and what came of it. It has a **headline** that states the event, a **lead**, the first one or two sentences, that gives the most important fact, and a **body** that adds the details, most important first.\n\nSuppose a footbridge opens over the busy road in front of a town's school. The headline is “镇中学门前过街天桥建成通行”; the lead says that on 3 May the bridge opened, so pupils no longer cross the road among the traffic; the body then gives its length and the number of people who used it on the first day, what pupils and parents said, and last the hours its lifts run. The first knowledge point writes the headline and the lead, the second orders and checks the facts.",
        "消息要先回答读者最想知道的事：什么人、什么事、什么时间、什么地点、结果怎样。它有一个说明事件的**标题**；有**导语**，就是开头的一两句话，交代最重要的事实；还有**主体**，补充具体的情况，越重要的越往前放。\n\n比如镇上中学门前的大马路上建成了一座过街天桥。标题是“镇中学门前过街天桥建成通行”；导语写5月3日天桥正式通行，学生过马路再也不用在车流中穿行了；主体再写天桥有多长、第一天有多少人走过、学生和家长怎么说，最后写电梯的运行时间。第一个知识点写标题和导语，第二个安排和核实事实。",
      ),
      prerequisites: ["writing-7-center", "reading-7-news"],
      xp: 24,
      strand: "writing",
      encompasses: [],
      criteria: ["zh8-news-form", "zh8-news-facts", "zh8-news-order"].map(criterion),
      knowledgePoints: [
        point(
          "writing-8-news-lead",
          t("Headline and Lead", "标题和导语"),
          t(
            "Write the headline as a short statement of the event with its subject and what happened; it may have a main line and a subtitle. Put into the lead the elements a reader needs at once: when, where, who, what and the result, in one or two sentences.\n\nNot “一次难忘的活动”, but “我校象棋队获市中学生象棋比赛团体第一”; and the lead: “11月8日，我校象棋队在市中学生象棋比赛中以七胜一平的成绩获得团体第一名。”\n\n> **Watch out.** A headline that only sets a mood, or a lead that opens with the weather or the writer's excitement, keeps the reader from the news. The result belongs in the lead, not at the end.",
            "标题用一句简短的话说明事件，要有主体，也要有发生了什么，可以分主标题和副标题。导语用一两句话交代读者马上要知道的要素：时间、地点、人物、事件和结果。\n\n不写“一次难忘的活动”，而写“我校象棋队获市中学生象棋比赛团体第一”；导语写：“11月8日，我校象棋队在市中学生象棋比赛中以七胜一平的成绩获得团体第一名。”\n\n> **注意。** 只烘托气氛的标题，或者从天气、从作者的激动写起的导语，都会让读者迟迟看不到新闻。结果要写进导语，不能留到最后。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the news report the task asks for, at least 500 characters. Give it a headline that states the event and a lead with its main elements and result.",
              "按题目的要求，用中文写一则不少于500字的消息。标题要说明事件，导语要交代主要的要素和结果。",
            ),
            newsBank,
            ["zh8-news-form", "zh8-news-facts"],
            ESSAY,
            worked(
              t(
                "List the five elements of the event, when, where, who, what and the result, then write them into one sentence: that is the lead. Shorten it to a statement of a dozen or so characters: that is the headline.",
                "先列出事件的五个要素：时间、地点、人物、事件和结果，再把它们写成一句话，这就是导语；把它压缩成十几个字的陈述，这就是标题。",
              ),
              t(
                "Read only your headline and lead: a reader who stops there already knows what happened and how it turned out.",
                "只读你的标题和导语：读到这里就停下的读者，也已经知道发生了什么、结果怎样。",
              ),
            ),
          ),
        ),
        point(
          "writing-8-news-facts",
          t("Facts in Order", "用事实说话"),
          t(
            "After the lead, give the facts that support it, most important first: numbers, names, what was done and what people said, each one exact. Keep the writer out: no exclamations and no praise in the writer's voice; a judgment, if any, comes from someone you quote.\n\nNot “活动非常成功，大家都很开心！”, but “这次义卖共筹得善款3260元，将全部用于购买图书。参加义卖的同学说：‘没想到我的旧书也能帮上别人。’”\n\n> **Watch out.** A detail that cannot be checked, “很多很多人”, or an opinion in the writer's own voice turns news into a composition. And a fact must agree with the lead: if the lead says 3260 yuan, the body may not say 3000.",
            "导语之后，按重要程度写出支持它的事实，越重要的越靠前：数字、名称、做了什么、人们说了什么，每一项都要准确。作者不出面：不用作者的口气感叹和赞美；如果要有评价，就引用别人的话。\n\n不写“活动非常成功，大家都很开心！”，而写“这次义卖共筹得善款3260元，将全部用于购买图书。参加义卖的同学说：‘没想到我的旧书也能帮上别人。’”\n\n> **注意。** 无法核实的说法，比如“很多很多人”，或者用作者自己的口气发表的看法，会把消息写成作文。事实还要前后一致：导语里写3260元，主体里就不能写成3000元。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the news report the task asks for, at least 500 characters. Give exact facts, most important first, and leave your own feelings out.",
              "按题目的要求，用中文写一则不少于500字的消息。写出准确的事实，重要的在前，不加自己的抒情。",
            ),
            newsBank,
            ["zh8-news-facts", "zh8-news-order"],
            ESSAY,
            worked(
              t(
                "Gather the facts you have, numbers, names, steps and a quotation or two, and rank them by how much a reader needs each; write them in that order after the lead.",
                "把手里的事实集中起来：数字、名称、经过，再加一两句引语；按读者需要的程度给它们排序，按这个顺序写在导语后面。",
              ),
              t(
                "Underline every number and name in the body and compare it with the lead; then look for any sentence of praise in your own voice and turn it into a fact or a quotation.",
                "把主体里的每一个数字和名称画出来，和导语对一对；再找出用自己的口气赞美的句子，把它改成事实或引语。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 8,
    topic: {
      id: "writing-8-travel",
      title: t("Travel Writing", "写游记"),
      summary: t(
        "Write travel writing in Chinese of at least 500 characters: follow the route of a visit so the reader can follow it too, paint the scene at the main stops, and let a feeling grow out of what you saw.",
        "用中文写一篇不少于500字的游记：按游览的路线写，让读者跟得上；把主要景点的景物写具体，让感受从所见的景物中自然生出来。",
      ),
      intro: t(
        "Travel writing has three things: the **route**, where you went and in what order, marked by words such as “走进”“沿着”“登上”; the **scene**, what you saw at the main stops, told in detail; and the **feeling**, what the place made you think.\n\nA pupil visits a small island. He lands at the pier, follows the path along the cliffs, climbs to the lighthouse and ends in the fishing village; at the lighthouse he stops long enough to tell the white tower, the gulls below him and the sea turning from green to deep blue; and there he thinks of the keeper who has lit the lamp alone every night for thirty years. The first knowledge point lays out the route, the second paints the scene and draws the feeling from it.",
        "游记有三样东西：**游踪**，去了哪里、先后顺序怎样，用“走进”“沿着”“登上”这样的词标出来；**景物**，在主要景点看到了什么，要写具体；**感受**，这个地方让你想到了什么。\n\n比如一个同学游一座小岛。他从码头上岸，沿着悬崖边的小路走，登上灯塔，最后到了渔村；在灯塔上，他停下来细细地写了白色的塔身、脚下的海鸥和由绿变蓝的海水；也就在那里，他想到了三十年来每天夜里独自点亮灯塔的守塔人。第一个知识点理清游踪，第二个写好景物并从中生出感受。",
      ),
      prerequisites: ["writing-7-feeling"],
      xp: 24,
      strand: "writing",
      encompasses: [],
      criteria: ["zh8-travel-route", "zh8-travel-scene", "zh8-travel-feeling"].map(criterion),
      knowledgePoints: [
        point(
          "writing-8-travel-route",
          t("Following the Route", "写清游踪"),
          t(
            "Tell the visit in the order you made it, and mark each move from place to place with a word of moving and a place: “进了大门”“沿着湖边往北走”“爬到山顶”. Choose two or three main stops to tell at length and pass quickly through the rest.\n\n“穿过松林，眼前忽然开阔起来，一片湖水出现在山脚下。” tells the reader both where you are and how you got there.\n\n> **Watch out.** A list of every place, each given one line, is a timetable, not travel writing; and a jump from one place to another with no word of moving loses the reader. Fewer stops, told well, beat many named in passing.",
            "按游览的先后顺序来写，每从一处到另一处，都用一个表示移动的词加上地点标出来：“进了大门”“沿着湖边往北走”“爬到山顶”。选两三个主要景点详细写，其余的一笔带过。\n\n“穿过松林，眼前忽然开阔起来，一片湖水出现在山脚下。”这一句既告诉读者你到了哪里，也告诉读者你是怎么到的。\n\n> **注意。** 把去过的每一个地方都列出来、每处只写一句，那是行程表，不是游记；从一处跳到另一处却没有交代怎么过去，读者就跟丢了。少写几处、写好它们，胜过点到许多处。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the travel writing the task asks for, at least 500 characters. Follow the route in order, mark each move, and tell the main stops in detail.",
              "按题目的要求，用中文写一篇不少于500字的游记。按顺序写清游踪，交代每一次转换地点，把主要景点写具体。",
            ),
            travelBank,
            ["zh8-travel-route", "zh8-travel-scene"],
            ESSAY,
            worked(
              t(
                "Draw the route as a line of four or five places; circle the two or three you will tell at length, and choose a word of moving for each step between them.",
                "先把游踪画成一条线，写出四五个地点；圈出要详细写的两三处，再给每一段路选一个表示移动的词。",
              ),
              t(
                "Underline every word that moves you from one place to the next: a reader could redraw your route from them alone.",
                "把每一个把你从一处带到下一处的词画出来：读者只看这些词，就能把你的路线重新画出来。",
              ),
            ),
          ),
        ),
        point(
          "writing-8-travel-scene",
          t("Scene and Feeling", "写景抒怀"),
          t(
            "At each main stop, tell what makes this place unlike any other: its shapes, colours, sounds and movement, seen from where you stand, near and far. Then let a feeling or a thought come out of that scene, in a sentence that names something you have just described.\n\nAfter describing a waterfall's roar and spray, a pupil writes: “站在它面前，我才知道‘飞流直下’不是一句夸张的话。”\n\n> **Watch out.** Words such as “美丽”“壮观” that fit any place describe none; and a feeling tacked on at the end, “这次旅行让我很开心”, grows out of nothing. Tie the feeling to the scene.",
            "在每个主要景点，写出这个地方和别处不一样的地方：它的形状、颜色、声音和动态，从你站的地方看过去，有近有远。再让一种感受或想法从这些景物里生出来，那句话要说到你刚刚写过的东西。\n\n比如写完瀑布的轰鸣和水雾，一个同学写道：“站在它面前，我才知道‘飞流直下’不是一句夸张的话。”\n\n> **注意。** “美丽”“壮观”这样放到哪里都行的词，其实什么也没写出来；结尾硬加一句“这次旅行让我很开心”，感受就没有来处。要把感受系在景物上。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the travel writing the task asks for, at least 500 characters. Paint the scene at the main stops in detail, and let a feeling grow out of it.",
              "按题目的要求，用中文写一篇不少于500字的游记。把主要景点的景物写具体，让感受从景物中生出来。",
            ),
            travelBank,
            ["zh8-travel-scene", "zh8-travel-feeling"],
            ESSAY,
            worked(
              t(
                "For each main stop, note one thing only that place has, a sound, a colour, a shape, and from where you saw it; then write the thought it gave you in one sentence that names it.",
                "每个主要景点，记下一样只有那里才有的东西：一种声音、一种颜色或一个形状，以及你是从哪里看到的；再用一句话写出它让你想到的，这句话里要说到它。",
              ),
              t(
                "Find your sentence of feeling and the scene before it: the feeling names something in that scene, and the scene could not be moved to another place.",
                "找到写感受的那句话和它前面的景物：感受里说到了那处景物，那段景物也搬不到别的地方去。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 8,
    topic: {
      id: "writing-8-rewrite",
      title: t("Rewriting", "改写"),
      summary: t(
        "Rewrite a given text in Chinese as a piece of at least 500 characters: change its form, person, order or point of view as the task asks, keep its people, events and meaning, and add fitting detail.",
        "用中文把给出的文章改写成不少于500字的作品：按题目的要求改变体裁、人称、顺序或叙述角度，保留原来的人物、事情和意思，并加上合理的细节。",
      ),
      intro: t(
        "Rewriting keeps what a text says and changes how it says it. The task names the change: a poem becomes a story, a classical fable becomes a vernacular one, “he” becomes “I”, a tale told in order is told from its end, an explanation is told by a thing in it. Everything else, the people, what happens and what it means, stays.\n\nTake Li Shen's poem “锄禾日当午，汗滴禾下土”. Rewritten as a story, it shows a farmer bent in a field at noon, the sun burning his back, a drop of sweat falling into the dry earth, and a child who learns from it where the rice comes from. The first knowledge point changes person and order, the second changes form and adds detail.",
        "改写保留原文说了什么，改变的是怎么说。题目会说明要改的地方：把诗改成故事，把文言寓言改成白话故事，把“他”改成“我”，把顺叙改成从结尾写起的倒叙，或者让说明的事物自己来讲。其余的，人物、事情和意思，都不能变。\n\n比如李绅的“锄禾日当午，汗滴禾下土”。改写成故事，可以写正午时分一个农民弯着腰在田里锄草，太阳烤着他的背，一滴汗落进干裂的泥土，一个孩子由此懂得了粮食是怎么来的。第一个知识点改变人称和顺序，第二个改变体裁并加上细节。",
      ),
      prerequisites: ["writing-7-expand-condense"],
      xp: 24,
      strand: "writing",
      encompasses: [],
      criteria: ["zh8-rewrite-faithful", "zh8-rewrite-change", "zh8-rewrite-detail"].map(criterion),
      knowledgePoints: [
        point(
          "writing-8-rewrite-person",
          t("Changing Person and Order", "改变人称和顺序"),
          t(
            "When the task changes the person, tell the whole story through the new narrator: with “I”, only what I could see, do and think; with a name, the person seen from outside, with thoughts shown through actions. When it changes the order, open with the scene the task names, then turn back with a sentence of memory, and return to that scene at the end.\n\n“小林第一次骑车摔倒了” told by “I” becomes “车把一歪，我还没反应过来，膝盖就重重地磕在了地上”.\n\n> **Watch out.** Changing the person halfway, or a flashback that never comes back to its opening, breaks the rewrite. And the events and their result stay the same: rewriting is not a new story.",
            "题目要求改人称时，整篇都用新的叙述者来讲：用“我”，就只写我能看到、做到和想到的；用名字，就从外面看这个人，用动作写出他的想法。题目要求改顺序时，先写题目指定的那个场景，再用一句回忆的话转回去，结尾回到开头的场景。\n\n“小林第一次骑车摔倒了”，用“我”来讲，就成了“车把一歪，我还没反应过来，膝盖就重重地磕在了地上”。\n\n> **注意。** 写到一半换了人称，或者倒叙之后再也不回到开头的场景，改写就失败了。事情和结果还要保持不变：改写不是另编一个故事。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the rewrite the task asks for, at least 500 characters. Change the person or the order as asked, keep it throughout, and keep the original's events and result.",
              "按题目的要求，用中文写一篇不少于500字的改写。按要求改变人称或顺序，并且全篇保持一致，原文的事情和结果不变。",
            ),
            rewriteBank,
            ["zh8-rewrite-change", "zh8-rewrite-faithful"],
            ESSAY,
            worked(
              t(
                "List the original's people, events in order and result; mark the one change the task asks for, and decide the sentence where the new person speaks first or where the story turns back.",
                "先列出原文的人物、按顺序排好的事情和结果；标出题目要求的那一处改变，再想好新的叙述者开口的第一句，或者故事转回过去的那一句。",
              ),
              t(
                "Tick each event and the result from your list in your piece; then check every sentence keeps the new person, or that the flashback returns to its opening scene.",
                "把清单上的每件事和结果在文章里一一打钩；再检查每一句都用了新的人称，或者倒叙最后回到了开头的场景。",
              ),
            ),
          ),
        ),
        point(
          "writing-8-rewrite-form",
          t("Changing the Form", "改变体裁"),
          t(
            "When a poem or a fable becomes a story, first understand every line of the original, then give it what a story needs: a time and place, the people's actions, words and looks, and their thoughts, all following from the original. A short line such as “遥招手” can become a whole moment; a lesson stated at the end of a fable should come out of the story itself.\n\n“孤帆远影碧空尽” can become a friend standing on the bank long after the sail has turned into a dot and vanished into the sky.\n\n> **Watch out.** A line-by-line translation is not a rewrite, and neither is a story that adds a happy ending the poem does not have. Every added detail must fit the original's time, people and mood.",
            "把诗或寓言改成故事时，先弄懂原文的每一句，再给它补上故事需要的东西：时间和地点，人物的动作、语言、神态和心理，都要从原文里推出来。像“遥招手”这样短短的一句，可以写成一个完整的瞬间；寓言结尾讲出的道理，要从故事本身显出来。\n\n“孤帆远影碧空尽”，可以写成朋友站在岸边，一直看到那片帆变成一个小点，消失在天边，还不肯离开。\n\n> **注意。** 一句一句地翻译不是改写；给诗加上一个原诗没有的圆满结局也不是。添加的每一个细节，都要合乎原文的时代、人物和情调。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the rewrite the task asks for, at least 500 characters. Turn the original into the form asked, keep its people and meaning, and add detail that fits it.",
              "按题目的要求，用中文写一篇不少于500字的改写。把原文改成要求的体裁，保留原来的人物和意思，加上合乎原文的细节。",
            ),
            rewriteBank,
            ["zh8-rewrite-detail", "zh8-rewrite-faithful"],
            ESSAY,
            worked(
              t(
                "Put each line of the original into plain words; beside each, note the scene, action or thought you will add, and check it follows from that line.",
                "先把原文的每一句用白话说出来；在每一句旁边写下你要添加的场景、动作或心理，并确认它是从这一句推出来的。",
              ),
              t(
                "Read the original again beside your piece: every line of it can be found in a passage of yours, and nothing you added contradicts it.",
                "把原文和你的文章放在一起再读一遍：原文的每一句，都能在你的文章里找到对应的段落，而你添加的内容没有一处和它矛盾。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 8,
    topic: {
      id: "writing-8-research-report",
      title: t("A Simple Research Report", "写简单的研究报告"),
      summary: t(
        "Write a short research or survey report in Chinese of at least 500 characters: the question, the method and sources, the findings with their figures, a conclusion that follows from them, and suggestions.",
        "用中文写一篇不少于500字的小研究报告或调查报告：写出问题的提出、研究方法和资料来源、有数据的研究结果、从结果中得出的结论，以及建议。",
      ),
      intro: t(
        "A research report tells others what you set out to learn, how you learned it and what you found, so that they could check it. It is written in parts with headings: **the question**, **the method** with the sources used, **the findings**, **the conclusion** and **suggestions**.\n\nSuppose a class wants to know whether pupils eat breakfast. The question says why they asked; the method says that 120 pupils answered a questionnaire; the findings say that 34 of them often skip it, most because they get up late; the conclusion says that more than a quarter often skip breakfast and lateness is the main reason; the suggestions follow from that. The first knowledge point sets out the parts and the findings, the second draws the conclusion and suggestions.",
        "研究报告要告诉别人：你想弄清什么、怎样弄清的、发现了什么，让别人能够核对。它分部分写，每部分有小标题：**问题的提出**、**研究方法**（写明用到的资料来源）、**研究结果**、**结论**和**建议**。\n\n比如一个班想知道同学们吃不吃早饭。问题的提出说明为什么要调查；研究方法写120名同学填了问卷；结果写其中34人常常不吃，多数是因为起得晚；结论写超过四分之一的同学常常不吃早饭，起床晚是主要原因；建议就从这里来。第一个知识点安排各部分并写出结果，第二个得出结论和建议。",
      ),
      prerequisites: ["writing-8-explain", "writing-7-practical"],
      xp: 26,
      strand: "writing",
      encompasses: [],
      criteria: ["zh8-report-form", "zh8-report-findings", "zh8-report-conclusion"].map(criterion),
      knowledgePoints: [
        point(
          "writing-8-research-report-findings",
          t("Parts and Findings", "分部分写出结果"),
          t(
            "Give the report its parts with headings. In the method, say what you did, with whom or on what, how many, and which books, sites or people you drew on. In the findings, give what you found item by item, with numbers and examples, and quote a source when you use it.\n\n“我们向七年级发放问卷150份，收回有效问卷142份。” is a method a reader can check; “我们问了很多人” is not.\n\n> **Watch out.** A finding without a number or an example is an impression; a source without its name cannot be checked; and a finding that slips in your opinion belongs in the conclusion, not here.",
            "给报告分出部分，加上小标题。研究方法要写清做了什么、对谁或对什么做的、做了多少，用了哪些书、网站或请教了谁。研究结果要一条一条写出发现，有数字也有例子，用到资料要注明出处。\n\n“我们向七年级发放问卷150份，收回有效问卷142份。”这样的方法读者可以核对；“我们问了很多人”就不行。\n\n> **注意。** 没有数字或例子的结果只是印象；不写名称的资料来源无法核对；夹带了自己看法的结果，应该放进结论，不应该放在这里。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the report the task asks for, at least 500 characters. Give it parts with headings, a method that names its sources, and findings with numbers and examples.",
              "按题目的要求，用中文写一篇不少于500字的报告。分部分写，有小标题，研究方法写明资料来源，研究结果有数字和例子。",
            ),
            reportBank,
            ["zh8-report-form", "zh8-report-findings"],
            ESSAY,
            worked(
              t(
                "Write the five headings first; under the method, list what you did and every source by name; under the findings, write one numbered line per finding with its figure or example.",
                "先写出五个小标题；在研究方法下面，列出做了什么和每一项资料的名称；在研究结果下面，每一条发现写成带序号的一行，附上它的数字或例子。",
              ),
              t(
                "Read each finding: it has a figure or an example, and a reader could find where it came from in your method.",
                "逐条读你的结果：每条都有数字或例子，而且读者能在研究方法里找到它是从哪里来的。",
              ),
            ),
          ),
        ),
        point(
          "writing-8-research-report-conclusion",
          t("Conclusion and Suggestions", "得出结论和建议"),
          t(
            "Draw the conclusion from the findings alone: sum them up in a few sentences, saying only what the numbers support, and say where they fall short, such as a small sample. Then make suggestions that answer the problems the conclusion names, each one something that can be done.\n\nIf 34 of 120 pupils often skip breakfast, “超过四分之一的同学常常不吃早饭” follows; “我校同学都不重视健康” does not.\n\n> **Watch out.** A conclusion that goes beyond the figures, or one about a matter the findings never touched, is not a conclusion. And a suggestion such as “大家要重视” names no action; say who should do what.",
            "结论只从研究结果中得出：用几句话把结果归纳起来，只说数据能支持的话，也要说出不足，比如调查的人数少。再提出建议，每一条都针对结论里说的问题，都是做得到的事。\n\n如果120名同学中有34人常常不吃早饭，可以得出“超过四分之一的同学常常不吃早饭”；却不能得出“我校同学都不重视健康”。\n\n> **注意。** 超出数据的结论，或者说到研究结果根本没涉及的事，都不是结论。像“大家要重视”这样的建议没有说要做什么，要说清谁来做、做什么。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the report the task asks for, at least 500 characters. Draw a conclusion the findings support, and make suggestions that answer it.",
              "按题目的要求，用中文写一篇不少于500字的报告。得出研究结果能够支持的结论，并提出针对它的建议。",
            ),
            reportBank,
            ["zh8-report-conclusion", "zh8-report-findings"],
            ESSAY,
            worked(
              t(
                "Reread your findings and write one sentence that sums them up without any word stronger than the figures; add what the study could not show, then one doable suggestion per problem.",
                "重读你的结果，写一句话把它们归纳起来，用词不超出数字能说明的程度；补上这次研究说明不了的地方，再针对每个问题提一条做得到的建议。",
              ),
              t(
                "For each sentence of your conclusion, point to the finding it rests on; for each suggestion, point to the problem in the conclusion it answers.",
                "结论里的每一句，都能指出它依据的是哪一条结果；每一条建议，都能指出它针对的是结论里的哪个问题。",
              ),
            ),
          ),
        ),
      ],
    },
  },
];
