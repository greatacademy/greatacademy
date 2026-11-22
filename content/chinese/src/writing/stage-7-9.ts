// The judged writing of grade 7 added by docs/chinese-curriculum.md §18.9: writing with feeling, expanding and
// condensing, association and imagination, and applications and suggestions. A Chinese character counts as a word in
// every length; the compositions meet the stage 4 standard of at least 500 characters.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { feelingBank, imaginationBank7 } from "./bank-g.ts";
import { applicationBank, condenseBank, expandBank, suggestionBank } from "./bank-h.ts";

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
];
