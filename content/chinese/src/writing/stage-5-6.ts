// The judged writing of grades 5 and 6 added by docs/chinese-curriculum.md §18.9: an imaginative composition, reading
// notes and notices in grade 5; a true event, thoughts after reading and an activity plan and summary in grade 6.
// A Chinese character counts as a word in every length.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bookNotesBank, imaginationBank, noticeBank } from "./bank-e.ts";
import { planBank, realEventBank, reflectionBank, summaryBank } from "./bank-f.ts";

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

const STORY = { minWords: 300, maxChars: 2400 } as const;
const NOTES = { minWords: 150, maxChars: 1600 } as const;
const NOTICE = { minWords: 50, maxChars: 600 } as const;
const ESSAY = { minWords: 350, maxChars: 2800 } as const;
const PLAN = { minWords: 200, maxChars: 1600 } as const;

/** stageFiveSixJudged are the judged writing topics of grades 5 and 6 proposed in docs/chinese-curriculum.md §18.9. */
export const stageFiveSixJudged: readonly GradeTopic[] = [
  {
    grade: 5,
    topic: {
      id: "writing-5-imagination",
      title: t("An Imaginative Composition", "想象作文"),
      summary: t(
        "Write in Chinese a story built on something that cannot happen: keep to the rules of the imagined world, give it a difficulty and an ending, and describe the imagined things concretely.",
        "用中文写一个现实中不可能发生的故事：守住想象世界的规则，有困难、有结局，把想象的东西写具体。",
      ),
      intro: t(
        "An imaginative composition starts from a “what if”: what if a door could open onto any place? Once the story says the door goes wherever you name, it must keep to that rule: the writer names the North Pole, and then the ice floe where a seal pup is drifting away.\n\nA bold idea is not yet a story. Something must go wrong, the characters must deal with it, and the end must settle it; and the imagined things must be seen, not only named. The first knowledge point builds the world and its course, the second describes it concretely.",
        "想象作文从一个“假如”开始：假如有一扇门能通往任何地方，会怎样？故事一旦说了门能去说出的任何地方，就要守住这条规则：小作者说出“北极”，后来又说出小海豹漂走的那块冰。\n\n有了大胆的想法，还不等于有了故事。要有一件难办的事，人物想办法去办，结尾有个结果；想象的东西还要让人看得见，不能只说个名字。第一个知识点写出想象的世界和故事的经过，第二个把它写具体。",
      ),
      prerequisites: ["writing-4-imagination"],
      xp: 22,
      strand: "writing",
      encompasses: [],
      criteria: ["zh5-imagine-world", "zh5-imagine-plot", "zh5-imagine-detail"].map(criterion),
      knowledgePoints: [
        point(
          "writing-5-imagination-world",
          t("An Imagined World and Its Course", "想象的世界和故事的经过"),
          t(
            "Decide what is impossible in your story and what rule it follows, then give it a course: a beginning that sets up the world, a difficulty, and an ending in which the difficulty is settled.\n\nA button that makes you small: the writer shrinks, follows the ants, gets lost in their tunnels, and a small ant leads the way out.\n\n> **Watch out.** Do not change the rules halfway because it is convenient: if the shadow cannot push, it cannot suddenly push to win the race. And a list of wonders with nothing to overcome is a description, not a story.",
            "先想好故事里什么事是不可能的、它守着什么规则，再给它一个经过：开头交代这个世界，中间有一件难办的事，结尾把它解决。\n\n比如一枚能让人变小的纽扣：小作者变小了，跟着蚂蚁走，在地下通道里迷了路，最后一只小蚂蚁把他带了出来。\n\n> **注意。** 不能写到一半，为了方便就改掉规则：影子推不动人，就不能突然推着人赢得比赛。只把一样样神奇的东西列出来，没有要克服的困难，那是介绍，不是故事。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the imaginative story the task asks for. Keep to its imagined rule, and give it a difficulty and an ending.",
              "按题目的要求，用中文写一篇想象作文。守住想象的规则，写出遇到的困难和结局。",
            ),
            imaginationBank,
            ["zh5-imagine-world", "zh5-imagine-plot"],
            STORY,
            worked(
              t(
                "Write down in one sentence what is impossible and its rule; then list the beginning, the difficulty and how it is settled.",
                "用一句话写下故事里不可能的事和它的规则；再列出开头、遇到的困难和怎样解决。",
              ),
              t(
                "Read it through: every turn obeys the rule set at the beginning, and the difficulty is settled at the end.",
                "从头读一遍：每一处都守着开头定下的规则，困难到结尾有了结果。",
              ),
            ),
          ),
        ),
        point(
          "writing-5-imagination-detail",
          t("Making the Imagined Concrete", "把想象的内容写具体"),
          t(
            "Describe what the imagined thing looks like and how it works, and at the main moment show what the characters do and say, step by step, so that the reader can see it.\n\nNot “the glasses could see feelings”, but “happy people have a yellow cloud over their heads, and sad people a light blue rain”.\n\n> **Watch out.** Details must still obey the rule: if the glasses show feelings as weather, a friend who smiles but is sad has rain over her head.",
            "写出想象的东西是什么样子、怎样起作用；在最重要的地方，一步一步写出人物做了什么、说了什么，让读者能看见。\n\n不写“眼镜能看见心情”，而写“开心的人头上飘着一朵黄色的云，难过的人头上下着蓝色的小雨”。\n\n> **注意。** 细节也要守住规则：如果眼镜把心情变成天气，那么笑着却难过的朋友，头上也在下雨。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the imaginative story the task asks for. Describe the imagined things and the main moment concretely.",
              "按题目的要求，用中文写一篇想象作文。把想象的东西和最重要的地方写具体。",
            ),
            imaginationBank,
            ["zh5-imagine-detail", "zh5-imagine-world"],
            STORY,
            worked(
              t(
                "Picture the imagined thing: its look, its parts and what it does; and choose the main moment to show action by action.",
                "先在脑子里看清想象的东西：样子、部件、能做什么；再选好最重要的地方，一个动作一个动作地写。",
              ),
              t(
                "Find the imagined thing and the main moment: a reader could draw them from your words, and they still obey the story's rule.",
                "找到写想象的东西和最重要的地方：读的人能照着你的话画出来，而且它们仍然守着故事的规则。",
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
      id: "writing-5-book-notes",
      title: t("Reading Notes", "读书笔记"),
      summary: t(
        "Write reading notes in Chinese: name the book, copy out or sum up a part of it, say why it is worth noting, and add a thought of your own.",
        "用中文写读书笔记：写明书名，摘录或概括其中一部分，说说为什么记下它，再写出自己的想法。",
      ),
      intro: t(
        "Reading notes keep what you want to remember from a book. They have parts: the book and the chapter; the part you copy out, or sum up in your own words; why you chose it; and your own thought.\n\nFrom 《韩非子》's 郑人买履, copy out “宁信度，无自信也。”; say it is the funniest moment, because he trusts a measure taken from his foot more than the foot; then add: I learn formulas by heart and cannot use them when the question changes. The first knowledge point picks a part and says why, the second adds your own thought.",
        "读书笔记是把书里想记住的东西记下来。它有几个部分：书名和篇目；摘录下来的句子，或者用自己的话概括的内容；为什么选它；自己的想法。\n\n比如读《韩非子》的《郑人买履》，摘录“宁信度，无自信也。”；说明它是全文最好笑的地方，因为他相信从脚上量来的尺码，却不相信自己的脚；再写：我背公式，题目一变就不会用了。第一个知识点选好内容、说清理由，第二个写出自己的想法。",
      ),
      prerequisites: ["writing-3-note"],
      xp: 18,
      strand: "writing",
      encompasses: [],
      criteria: ["zh5-notes-source", "zh5-notes-pick", "zh5-notes-own"].map(criterion),
      knowledgePoints: [
        point(
          "writing-5-book-notes-pick",
          t("Choosing What to Note", "选好要记的内容"),
          t(
            "Name the book and the part. Copy the words exactly, or sum up an episode briefly in your own words, and then say what in it made you note it: a word, a deed, a way of telling.\n\nFrom 刻舟求剑: “舟已行矣，而剑不行”, chosen because one thing moves and the other does not, and the mistake shows at once.\n\n> **Watch out.** “This sentence is very good” gives no reason; say what is good. And a copied sentence must be copied exactly: a changed word is a different sentence.",
            "写明书名和篇目。摘录要一字不差，或者用自己的话简要概括一个情节；再说清楚为什么记下它：是一个词、一件事，还是一种写法打动了你。\n\n比如《刻舟求剑》里的“舟已行矣，而剑不行”，选它是因为一个动、一个不动，错在哪里一下子就看出来了。\n\n> **注意。** 只说“这句话写得很好”，等于没说理由，要说出好在哪里。摘录的句子要抄准确：改了一个字，就是另一句话了。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the reading notes the task asks for: name the book, note a part of it, and say why you chose it.",
              "按题目的要求，用中文写一篇读书笔记：写明书名，记下其中一部分，说说为什么选它。",
            ),
            bookNotesBank,
            ["zh5-notes-source", "zh5-notes-pick"],
            NOTES,
            worked(
              t(
                "Read the text again and mark the sentence or episode that struck you most; ask yourself what exactly struck you.",
                "再读一遍，画出最打动你的句子或情节；问问自己，到底是哪里打动了你。",
              ),
              t(
                "Compare what you copied with the text word by word, and make sure your reason points to something particular in it.",
                "把摘录的句子和原文一个字一个字地对一遍；再看看你的理由是不是说到了句子里具体的地方。",
              ),
            ),
          ),
        ),
        point(
          "writing-5-book-notes-own",
          t("Adding Your Own Thought", "写出自己的想法"),
          t(
            "After the part you chose, write what it makes you think: something in your own life it reminds you of, a question it raises, or what you will do because of it.\n\nAfter 知之为知之，不知为不知: I nod in class when I do not understand; from now on I will ask.\n\n> **Watch out.** The thought must come from the part you chose. Repeating the text in other words, or a general saying that fits any book, is not your own thought.",
            "在选好的内容后面，写它让你想到了什么：想起了自己生活中的哪件事，产生了什么问题，或者你打算怎么做。\n\n比如记下“知之为知之，不知为不知”之后，写：上课不懂我也点头，以后不懂就要问。\n\n> **注意。** 想法要从你选的内容里来。换个说法把原文再说一遍，或者写一句放到哪本书后面都行的大道理，都不是自己的想法。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the reading notes the task asks for, and add your own thought that comes from the part you note.",
              "按题目的要求，用中文写一篇读书笔记，并写出从所记内容中得到的自己的想法。",
            ),
            bookNotesBank,
            ["zh5-notes-own", "zh5-notes-source"],
            NOTES,
            worked(
              t(
                "Ask what the part you chose reminds you of in your own life, or what you want to do because of it.",
                "问问自己：选的这部分让你想起了自己的哪件事，或者让你想怎么做。",
              ),
              t(
                "Cover the text and read only your thought: it could not be pasted under a different book without changing.",
                "遮住原文，只读你的想法：它不能原样搬到另一本书的笔记里。",
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
      id: "writing-5-notice",
      title: t("Notices and Announcements", "写通知和启事"),
      summary: t(
        "Write a notice, a lost-property notice or a found-property notice in Chinese: in the set form, with everything readers need, briefly.",
        "用中文写通知、寻物启事或失物招领：格式正确，内容齐全，简明扼要。",
      ),
      intro: t(
        "A notice tells many readers at once what they need to know. Its form: the title, such as 通知, 寻物启事 or 失物招领, on the first line; the body; and at the end who issues it and the date.\n\n“通知” on top, then “本周五（11月15日）下午3点，我班在本班教室举行读书分享会……”, then “五年级二班班委会” and “11月12日”. The first knowledge point keeps the form and gives what readers need, the second gives it briefly.",
        "通知和启事是一下子告诉很多人一件事。它的格式：第一行写标题，比如“通知”“寻物启事”“失物招领”；中间写正文；最后写发布的人或单位，和日期。\n\n比如第一行写“通知”，接着写“本周五（11月15日）下午3点，我班在本班教室举行读书分享会……”，最后写“五年级二班班委会”和“11月12日”。第一个知识点格式正确、内容齐全，第二个写得简明。",
      ),
      prerequisites: ["writing-3-note"],
      xp: 14,
      strand: "writing",
      encompasses: [],
      criteria: ["zh5-notice-form", "zh5-notice-complete", "zh5-notice-brief"].map(criterion),
      knowledgePoints: [
        point(
          "writing-5-notice-complete",
          t("The Form and What Readers Need", "格式和要素"),
          t(
            "Put the title on the first line and the issuer and date at the end. In the body give what readers need: for a notice, what, when, where, who and what to bring; for a lost-property notice, what was lost, when and where, what it looks like and how to return it.\n\nA lost water bottle: “11月8日下午体育课后，在操场东边的看台附近”, “蓝色水壶，壶身贴有名字贴纸”, “请送到五年级三班”.\n\n> **Watch out.** A found-property notice does not describe everything: keep back one detail, so that only the owner can claim it.",
            "第一行写标题，最后写发布者和日期。正文写出读的人需要知道的：通知要写清做什么、什么时间、什么地点、谁参加、带什么；寻物启事要写清丢了什么、什么时候在哪里丢的、什么样子、怎样送还。\n\n比如丢了水壶：“11月8日下午体育课后，在操场东边的看台附近”，“蓝色水壶，壶身贴有名字贴纸”，“请送到五年级三班”。\n\n> **注意。** 失物招领不要把东西写得一清二楚：留下一个特点不写，让失主说出来，才能确认是他的。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the notice the task asks for, in the set form and with everything its readers need.",
              "按题目的要求，用中文写一则通知或启事，格式正确，写齐读的人需要知道的内容。",
            ),
            noticeBank,
            ["zh5-notice-form", "zh5-notice-complete"],
            NOTICE,
            worked(
              t(
                "Decide which kind it is and list what its readers need: what, when, where, who, how to get in touch.",
                "先想好是哪一种，再列出读的人要知道的：什么事、什么时间、什么地点、什么人、怎样联系。",
              ),
              t(
                "Tick off each item on your list in the body, and look at the form: title first, issuer and date last.",
                "对照清单，在正文里一项一项找到；再看格式：标题在最前，发布者和日期在最后。",
              ),
            ),
          ),
        ),
        point(
          "writing-5-notice-brief",
          t("Brief and Plain", "简明扼要"),
          t(
            "Say each thing once, in plain words, in the order readers need it, and leave out what does not help them act.\n\nNot “那天我心情很好，上完体育课又渴又累，一摸书包，水壶不见了，急死我了”, but “本人于11月8日下午体育课后，在操场东边的看台附近丢失一个蓝色水壶”.\n\n> **Watch out.** Brief is not missing: cutting the date or the place to save words makes the notice useless.",
            "每件事说一次，用平实的话，按读的人需要的顺序写，对办事没有帮助的话不写。\n\n不写“那天我心情很好，上完体育课又渴又累，一摸书包，水壶不见了，急死我了”，而写“本人于11月8日下午体育课后，在操场东边的看台附近丢失一个蓝色水壶”。\n\n> **注意。** 简明不是缺项：为了少写几个字删掉日期或地点，这则启事就没有用了。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the notice the task asks for. Keep it brief and plain, with everything readers need.",
              "按题目的要求，用中文写一则通知或启事。写得简明，又不缺读的人需要的内容。",
            ),
            noticeBank,
            ["zh5-notice-brief", "zh5-notice-complete"],
            NOTICE,
            worked(
              t(
                "List the facts readers need, and nothing else; then put them in the order a reader would act on them.",
                "只列出读的人要用到的事实；再按读的人办事的顺序排好。",
              ),
              t(
                "Read each sentence and ask whether a reader needs it; strike out feelings and stories, and keep every fact on your list.",
                "一句一句地问：读的人需要这句吗？删掉心情和经过，清单上的事实一样也不少。",
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
      id: "writing-6-real-event",
      title: t("A True Event, Truly Felt", "写真实的经历"),
      summary: t(
        "Write in Chinese about one event you lived through: tell it whole, tell its key part in detail, and show the feeling it truly gave you.",
        "用中文写一件亲身经历的事：把事情写完整，把最重要的部分写具体，写出它带给你的真实感受。",
      ),
      intro: t(
        "Writing about a true event means choosing one event and telling it so that the reader lives it with you: when and where, who was there, how it began, how it went, how it ended. The night Mother had a fever: Father away, the thermometer, the medicine, the wet towel changed again and again, the temperature going down.\n\nThe feeling must grow out of that event: “I learned that looking after someone means staying with them, as Mother has always stayed with me.” The first knowledge point tells the event whole with its key part in detail, the second shows the true feeling.",
        "写真实的经历，就是选好一件事，把它讲得让读者好像和你一起经历了一遍：什么时候、在哪里、有谁、怎么开始、怎么经过、怎么结束。比如妈妈发高烧的那个晚上：爸爸出差，量体温，找药，一次次换湿毛巾，体温降了下来。\n\n感受要从这件事里长出来：“我才知道，照顾一个人，就是一直守着他，妈妈这么多年就是这样守着我的。”第一个知识点把事情写完整、把重要部分写具体，第二个写出真实的感受。",
      ),
      prerequisites: ["writing-5-person"],
      xp: 24,
      strand: "writing",
      encompasses: [],
      criteria: ["zh6-event-whole", "zh6-event-detail", "zh6-event-feeling"].map(criterion),
      knowledgePoints: [
        point(
          "writing-6-real-event-whole",
          t("The Whole Event and Its Key Part", "写完整，写具体"),
          t(
            "Make clear the time, the place, the people, and how the event began, went on and ended. Then choose its key part, the moment that matters most, and slow down there: what was done, said and thought.\n\nAt the speech contest: “我看着台下，脑子里一片空白……我看见了坐在第三排的班主任，她冲我点了点头。”\n\n> **Watch out.** Tell one event, not a year of them; and do not spend as many words on the way to school as on the moment that matters.",
            "写清时间、地点、人物，事情怎样开始、怎样经过、怎样结束。再选出最重要的那一部分，在那里放慢：做了什么、说了什么、想了什么。\n\n比如演讲比赛：“我看着台下，脑子里一片空白……我看见了坐在第三排的班主任，她冲我点了点头。”\n\n> **注意。** 写一件事，不要写一年里的好几件；也不要把去学校的路和最要紧的那一刻写得一样多。",
          ),
          writingGenerator(
            t(
              "Write in Chinese about the event the task asks for. Tell it whole, and tell its key part in detail.",
              "按题目的要求，用中文写一件亲身经历的事。把事情写完整，把最重要的部分写具体。",
            ),
            realEventBank,
            ["zh6-event-whole", "zh6-event-detail"],
            ESSAY,
            worked(
              t(
                "Choose one event; note its time, place, people, beginning, course and end; mark the key part to slow down at.",
                "选定一件事；记下时间、地点、人物和起因、经过、结果；标出要放慢写的最重要的部分。",
              ),
              t(
                "Check each of the six on your note, and see that the key part is the longest and shows actions, words and thoughts.",
                "对照记下的六项一一检查；再看最重要的部分是不是写得最多，写出了动作、语言和心里的想法。",
              ),
            ),
          ),
        ),
        point(
          "writing-6-real-event-feeling",
          t("A Feeling That Is True", "写出真情实感"),
          t(
            "Show what you felt as it happened, through what you did and thought, and end with the thought this event, and no other, gave you.\n\nAfter the quarrel over a broken pen: “一支笔坏了可以再买，可是一个朋友走了，我连一句‘没关系’都没来得及说。”\n\n> **Watch out.** A slogan such as “we must love our country and study hard” could end any story; and a feeling the events do not support, such as great joy after a dull day, rings false.",
            "在事情经过中，通过自己做的事和想的事写出当时的心情；结尾写出这件事、而不是别的事带给你的想法。\n\n比如因为一支弄坏的笔和朋友闹别扭：“一支笔坏了可以再买，可是一个朋友走了，我连一句‘没关系’都没来得及说。”\n\n> **注意。** “我们要好好学习”这样的口号，放在哪个故事后面都行；事情本身撑不起来的感情，比如平平常常的一天却写得激动万分，读起来就不真实。",
          ),
          writingGenerator(
            t(
              "Write in Chinese about the event the task asks for, and show the feeling it truly gave you.",
              "按题目的要求，用中文写一件亲身经历的事，写出它带给你的真实感受。",
            ),
            realEventBank,
            ["zh6-event-feeling", "zh6-event-whole"],
            ESSAY,
            worked(
              t(
                "Recall how you felt at each turn of the event, and what you think about it now; put the thought in your own words.",
                "回想事情每个转折时你的心情，和你现在怎么看这件事；用自己的话把想法写出来。",
              ),
              t(
                "Read your last paragraph and ask whether it could end another story; if it could, tie it to something in this one.",
                "读最后一段，问问它能不能放到别的故事后面；如果能，就把它和这件事里的具体东西连起来。",
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
      id: "writing-6-reflection",
      title: t("Thoughts After Reading", "读后感"),
      summary: t(
        "Write in Chinese your thoughts after reading a book or a story: say briefly what it is, pick one thing that struck you, and connect it with your own life.",
        "用中文写读后感：简要介绍读了什么，抓住一点感受最深的，联系自己的生活来写。",
      ),
      intro: t(
        "Thoughts after reading start from the reading and go into your own life. Say briefly what you read: Robinson Crusoe, shipwrecked alone, lives on an island for twenty-eight years and comes home. Then pick the one thing that struck you: when he despairs, he writes down what is bad and what is good about where he is.\n\nThen connect it: when my marks fell, I could have done the same. The first knowledge point sums up the reading and picks one point, the second connects it with your life.",
        "读后感从读的东西出发，再写到自己的生活里去。先简要介绍读了什么：鲁滨孙遇到海难，一个人在荒岛上生活了二十八年，最后回到了家乡。再抓住感受最深的一点：他绝望的时候，把处境的坏处和好处一条一条写了下来。\n\n然后联系自己：我成绩下降的时候，也可以这样做。第一个知识点概括读的内容、抓住一点，第二个联系自己的生活。",
      ),
      prerequisites: ["writing-5-book-notes"],
      xp: 24,
      strand: "writing",
      encompasses: [{ topic: "writing-5-book-notes", weight: 0.2 }],
      criteria: ["zh6-reflect-summary", "zh6-reflect-point", "zh6-reflect-link"].map(criterion),
      knowledgePoints: [
        point(
          "writing-6-reflection-point",
          t("What You Read and What Struck You", "概括内容，抓住一点"),
          t(
            "Begin with the title and the main content in two or three sentences. Then pick the one thing that struck you most, a person, a deed or a sentence, and state the thought it gave you.\n\nAfter 《西游记》: most readers admire Sun Wukong, but I keep thinking of the Tang monk, who has no magic and never once says “let us turn back”.\n\n> **Watch out.** A long retelling leaves no room for thought; and five points touched in passing are weaker than one thought through.",
            "开头用两三句话写清书名和主要内容。再选出感受最深的一点，一个人物、一件事或一句话，写清楚它让你想到了什么。\n\n比如读《西游记》：很多人喜欢孙悟空，我却常常想起唐僧，他不会法术，却从没说过一次“不去了”。\n\n> **注意。** 把故事复述得太长，就没有地方写感受了；蜻蜓点水地说五点，不如把一点想透。",
          ),
          writingGenerator(
            t(
              "Write in Chinese your thoughts after reading what the task names. Sum it up briefly and pick one thing that struck you.",
              "按题目的要求，用中文写一篇读后感。简要概括读的内容，抓住感受最深的一点。",
            ),
            reflectionBank,
            ["zh6-reflect-summary", "zh6-reflect-point"],
            ESSAY,
            worked(
              t(
                "Sum up the reading in no more than three sentences, then write the one point you will think about in one sentence.",
                "用不超过三句话概括读的内容；再用一句话写下你要写的那一点感受。",
              ),
              t(
                "Count the sentences of retelling, and check that the rest of the text keeps to the one point you chose.",
                "数一数复述用了几句；再检查文章其余部分是不是都围着你选的那一点写。",
              ),
            ),
          ),
        ),
        point(
          "writing-6-reflection-link",
          t("Connecting It With Your Life", "联系生活写感受"),
          t(
            "Take the thought into your own life or the world around you with one concrete example, told with its time, its people and what happened, and at the end come back to the reading.\n\nAfter 郑人买履: I looked only for the first and last sentences, as I had been taught, and missed a main sentence in the middle; I trusted the measure and not the text.\n\n> **Watch out.** The example must fit the point: a story about being brave does not connect with a point about honesty, however good the story is.",
            "把感受带到自己的生活或身边的事里，举一个具体的例子，写清时间、人物和发生了什么，结尾再回到读的东西上。\n\n比如读《郑人买履》：我按老师教的只找第一句和最后一句，错过了中间的中心句，我也是只信“尺码”、不看文章。\n\n> **注意。** 例子要和感受对得上：感受是诚实，例子却讲勇敢，故事再好也连不上。",
          ),
          writingGenerator(
            t(
              "Write in Chinese your thoughts after reading what the task names, connecting them with your own life through a concrete example.",
              "按题目的要求，用中文写一篇读后感，用一个具体的例子联系自己的生活。",
            ),
            reflectionBank,
            ["zh6-reflect-link", "zh6-reflect-point"],
            ESSAY,
            worked(
              t(
                "Ask when you, or someone you know, did or met the same thing; choose one such time and recall its details.",
                "想一想：你自己或者身边的人，什么时候也做过、遇到过同样的事；选一次，回想它的细节。",
              ),
              t(
                "Put your example next to your point: it shows the same thing; and your last paragraph names the reading again.",
                "把例子和感受放在一起看：它们说的是同一件事；最后一段又回到了读的东西上。",
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
      id: "writing-6-plan-summary",
      title: t("An Activity Plan and Summary", "活动计划和活动总结"),
      summary: t(
        "Write in Chinese a plan for a class activity, and a summary after one: in parts, concrete, and for the summary, what went well, what did not and what to change.",
        "用中文写班级活动的计划和活动后的总结：分条列项，内容具体；总结还要写出做得好的、不足的和怎样改进。",
      ),
      intro: t(
        "A plan is written before an activity so that everyone knows what to do; a summary is written after it so that the next one goes better. Both have a title naming the activity, then parts in order, often numbered.\n\nThe plan of an autumn outing gives its purpose, the date and the place, the people, the steps hour by hour and what to do if it rains; the summary afterwards says that thirty-four plants were recorded, three pupils came late, and next time group leaders will remind their groups the day before. The first knowledge point plans, the second sums up.",
        "计划写在活动以前，让每个人知道要做什么；总结写在活动以后，让下一次做得更好。两者都有一个写明活动名称的标题，下面分部分按顺序写，常常加上序号。\n\n比如秋游的计划写目的、日期和地点、人员、按钟点排好的步骤，以及下雨怎么办；活动后的总结写：记录了三十四种植物，有三位同学迟到，下次由组长前一天提醒组员。第一个知识点写计划，第二个写总结。",
      ),
      prerequisites: ["writing-5-notice"],
      xp: 22,
      strand: "writing",
      encompasses: [],
      criteria: ["zh6-plan-parts", "zh6-plan-concrete", "zh6-plan-review"].map(criterion),
      knowledgePoints: [
        point(
          "writing-6-plan-summary-plan",
          t("Writing a Plan", "写活动计划"),
          t(
            "Give the activity a title, then its parts in order: purpose; time and place; people; the steps or who does what; and what to watch out for, including what happens if the weather or something else goes wrong.\n\n“3月12日（星期三）下午2点至4点，青山社区公园东侧空地”, “第五、六组负责搬运树苗和提水”, “如遇下雨，改在3月14日下午进行”.\n\n> **Watch out.** “找个时间去公园种几棵树” cannot be acted on: a plan without a date, a place and who does what is only a wish.",
            "先写标题，写明是什么活动；再按顺序分部分写：目的，时间和地点，参加的人，步骤或分工，注意事项，包括天气或别的情况有变时怎么办。\n\n比如“3月12日（星期三）下午2点至4点，青山社区公园东侧空地”“第五、六组负责搬运树苗和提水”“如遇下雨，改在3月14日下午进行”。\n\n> **注意。** “找个时间去公园种几棵树”没法照着做：没有日期、地点和分工的计划，只是一个愿望。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the activity plan the task asks for, in parts and concrete enough to act on.",
              "按题目的要求，用中文写一份活动计划，分部分写，具体到能照着做。",
            ),
            planBank,
            ["zh6-plan-parts", "zh6-plan-concrete"],
            PLAN,
            worked(
              t(
                "Write the headings first: purpose, time and place, people, steps or tasks, things to watch out for; then fill each in.",
                "先写好小标题：目的、时间地点、参加人员、步骤或分工、注意事项；再一项一项填进去。",
              ),
              t(
                "Imagine you are a classmate reading it: you know where to be, when, and what your job is, and what happens if it rains.",
                "假设你是读计划的同学：你知道什么时候到哪里、自己做什么，下雨了又怎么办。",
              ),
            ),
          ),
        ),
        point(
          "writing-6-plan-summary-summary",
          t("Writing a Summary", "写活动总结"),
          t(
            "Give the activity a title, say briefly when it was, who took part and what was done, with numbers; then what went well, what did not, each with its reason, and what to change next time.\n\n“有两个节目超时，联欢会比计划晚结束了二十分钟”, then “彩排时为每个节目计时”.\n\n> **Watch out.** A summary is not a diary of the day: “then we ate, then we played” is not a summary. And “next time we will do better” changes nothing unless it says what will be done differently.",
            "先写标题，简要写清活动的时间、参加的人和做了什么，要有数字；再写做得好的地方和不足，各说出原因；最后写下次怎样改进。\n\n比如“有两个节目超时，联欢会比计划晚结束了二十分钟”，接着写“彩排时为每个节目计时”。\n\n> **注意。** 总结不是那一天的日记：“然后我们吃饭，然后我们玩”不是总结。“下次我们会做得更好”什么也没有改变，要写出下次具体换成什么做法。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the activity summary the task asks for: what was done, what went well and what did not, and what to change.",
              "按题目的要求，用中文写一份活动总结：做了什么，哪些做得好、哪些不足，下次怎样改进。",
            ),
            summaryBank,
            ["zh6-plan-review", "zh6-plan-concrete"],
            PLAN,
            worked(
              t(
                "List the facts with numbers, then two things that went well and two that did not, each with why.",
                "列出带数字的事实；再各想两条做得好的和不足的，每条想清原因。",
              ),
              t(
                "Pair each shortcoming with a change you can carry out; if one has no change, add it.",
                "把每一条不足和一条能做到的改进办法对起来；哪一条没有，就补上。",
              ),
            ),
          ),
        ),
      ],
    },
  },
];
