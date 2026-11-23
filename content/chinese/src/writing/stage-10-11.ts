// The judged writing of the senior required course added by docs/chinese-curriculum.md §18.9: literary writing after
// the task group of literary reading and writing, a survey report after the task group of taking part in today's
// culture, and rigorous argument after the task group of critical reading and expression; in the selective required
// course, a short literary review and a short research essay. A Chinese character counts as a word in every length; the
// compositions and their models are at least 800 characters.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { literaryBank } from "./bank-m.ts";
import { surveyBank } from "./bank-n.ts";
import { rigorousBank } from "./bank-o.ts";
import { reviewBank } from "./bank-p.ts";
import { academicBank } from "./bank-q.ts";

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

const ESSAY = { minWords: 800, maxChars: 4500 } as const;

/** stageTenElevenJudged are the judged writing topics of the senior courses proposed in docs/chinese-curriculum.md §18.9. */
export const stageTenElevenJudged: readonly GradeTopic[] = [
  {
    grade: 10,
    topic: {
      id: "writing-10-literary",
      title: t("Literary Writing", "文学写作"),
      summary: t(
        "Write a short story or a literary essay in Chinese that brings a person or scene alive in concrete detail, uses the craft of its form on purpose, and means more than it says.",
        "用中文写一篇小说或文学性散文：用具体的细节写活人物或场景，有意识地运用这种文体的写法，让作品的意味超出它所写的事情本身。",
      ),
      intro: t(
        "Literary writing shows rather than sums up. A story about a boy and his grandfather's fishing boat does not say “they loved each other”; it shows the old man oiling the oars every evening though no one rows any more, and the boy, years later, doing the same. Its meaning lies in what is shown, and the reader finds it.\n\nThe form helps: a point of view kept to (what “I” cannot know becomes suspense), a thread that runs through the piece (the oars appear three times), a turn where things change, language that suits the mood. The first knowledge point brings the person or scene alive, the second shapes the piece by its craft.",
        "文学写作重在呈现，而不是概括。写一个男孩和爷爷的渔船的故事，不必说“他们感情很深”，而是写老人每天傍晚都给船桨上油，尽管已经没有人划船了；多年以后，男孩也这样做。作品的意味就在所写的东西里，让读者自己去发现。\n\n文体的写法也会帮忙：坚持一种叙述视角（“我”不知道的事，就成了悬念），用一条线索贯穿全篇（船桨出现三次），设一个情节或感情的转折，用合乎情调的语言。第一个知识点写活人物或场景，第二个用写法来安排作品。",
      ),
      prerequisites: ["writing-9-short-story"],
      xp: 30,
      strand: "writing",
      encompasses: [{ topic: "writing-9-short-story", weight: 0.2 }],
      criteria: ["zh10-literary-image", "zh10-literary-craft", "zh10-literary-meaning"].map(criterion),
      knowledgePoints: [
        point(
          "writing-10-literary-image",
          t("A Person or Scene Brought Alive", "写活人物和场景"),
          t(
            "Choose the few details that only this person or place has, and give them in action, speech, sight and sound, not in adjectives. Let the meaning grow from those details: a reader who has seen what you show will feel what you mean without a moral at the end.\n\nNot “the old shopkeeper was honest”, but “他把多找的两毛钱追出半条街，塞回那个孩子手里，喘着气说：‘拿好。’”\n\n> **Watch out.** A pile of adjectives is not a picture: “慈祥、和蔼、善良” says less than one gesture. And a meaning stated outright at the end, such as “这件事让我懂得了……”, weakens what the story has already shown.",
            "选出只有这个人、这个地方才有的几个细节，用动作、语言、看到的和听到的写出来，而不是用形容词去概括。让意味从这些细节里长出来：读者看到了你写的，自然能感受到你想表达的，不需要结尾再讲一个道理。\n\n不写“老店主很诚实”，而写“他把多找的两毛钱追出半条街，塞回那个孩子手里，喘着气说：‘拿好。’”\n\n> **注意。** 一串形容词不等于一幅画面：“慈祥、和蔼、善良”还不如一个动作有分量。结尾直接说出“这件事让我懂得了……”，反而削弱了故事已经呈现出来的东西。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the story or essay the task asks for, at least 800 characters. Bring its person or scene alive in concrete detail, and let its meaning come through what you show.",
              "按题目的要求，用中文写一篇不少于800字的小说或散文。用具体的细节写活人物或场景，让作品的意味从你写的内容里自然流露出来。",
            ),
            literaryBank,
            ["zh10-literary-image", "zh10-literary-meaning"],
            ESSAY,
            worked(
              t(
                "Picture the person or scene until you can see it; list three details only it has, an action, a sound, a thing, and decide what you want the reader to feel without your saying it.",
                "先在心里把这个人或这个场景看清楚；列出三个只有它才有的细节：一个动作、一种声音、一件东西；再想好你希望读者感受到什么，而又不必说出来。",
              ),
              t(
                "Underline every adjective that judges a person or a place, and every sentence that states the lesson: replace each with a detail, or cut it, and see that the piece still says what you meant.",
                "把评价人物或地方的形容词、直接讲道理的句子都画出来：换成一个细节，或者删掉，再读一遍，看作品是不是仍然表达了你想表达的意思。",
              ),
            ),
          ),
        ),
        point(
          "writing-10-literary-craft",
          t("The Craft of the Form", "运用文体的写法"),
          t(
            "Decide how the piece is told before you write it. In a story: whose eyes, and what they cannot know; where the turn comes; an object that appears at the start, the middle and the end, changing each time. In an essay: the thread that joins scattered memories, a shift from then to now, a sound or smell that brings the past back. Suit the language to the mood: short sentences for tension, slow long ones for memory.\n\nA story told by a child who does not understand why the neighbour waters a dead tree each morning keeps the reader guessing until the child learns whose tree it was.\n\n> **Watch out.** A device that does no work is ornament: an object mentioned once and forgotten is not a thread. And a first person who suddenly knows what others think has broken the point of view.",
            "动笔之前，先想好怎样写。写小说：从谁的眼睛看，他有哪些事不知道；转折放在哪里；一件东西在开头、中间和结尾各出现一次，每次都有变化。写散文：用什么线索把零散的回忆串起来，怎样从过去转到现在，哪一种声音或气味把往事带回来。语言要合乎情调：紧张的地方用短句，回忆的地方用舒缓的长句。\n\n一个孩子不明白邻居为什么每天早上给一棵枯树浇水，用他的眼睛来讲这个故事，读者就会一直猜下去，直到孩子知道了那是谁种的树。\n\n> **注意。** 不起作用的写法只是装饰：只提到一次就忘了的东西算不上线索。第一人称的“我”忽然知道了别人心里在想什么，就破坏了叙述视角。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the story or essay the task asks for, at least 800 characters. Choose its point of view, thread and turn on purpose, and suit its language to its mood.",
              "按题目的要求，用中文写一篇不少于800字的小说或散文。有意识地选择叙述视角、线索和转折，让语言合乎作品的情调。",
            ),
            literaryBank,
            ["zh10-literary-craft", "zh10-literary-image"],
            ESSAY,
            worked(
              t(
                "Choose whose eyes tell it, the thread that runs through it and the point where it turns; note where the thread will appear and how it will have changed each time.",
                "想好从谁的眼睛来讲，用什么线索贯穿全篇，在哪里转折；记下这条线索会在哪几处出现，每次出现时有什么变化。",
              ),
              t(
                "Mark each place the thread appears and the turn: each does work in the piece. Then check that the teller never knows what he could not know.",
                "把线索出现的地方和转折处都标出来：每一处都在作品里起了作用。再检查一遍，叙述的人没有知道他不可能知道的事。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 10,
    topic: {
      id: "writing-10-report",
      title: t("A Survey Report", "写调查报告"),
      summary: t(
        "Write a survey report in Chinese from given results: the question and the method, the findings in order and kept apart from opinion, and conclusions and suggestions that follow from them, with the survey's limits noted.",
        "用中文根据给出的调查结果写调查报告：说明调查的问题和方法，有条理地呈现调查结果，并和自己的看法分开，得出从结果中推出的结论和建议，并指出调查的不足。",
      ),
      intro: t(
        "A survey report answers a question with evidence. It says what was asked and how (whom, how many, when, by questionnaire, interview or observation); sets out what was found, in figures and plain statement; analyses what the figures mean; and concludes no more than they show, with suggestions that follow.\n\nSuppose a class counts the bicycles parked at its school gate for a week and finds that a third have no lock. The report states the count and the method, gives the figure, asks why (a broken rack? no time?), and suggests a fix; it does not claim that a third of the town's cyclists are careless, since only one gate was counted. The first knowledge point sets out the question and the findings, the second draws conclusions and notes limits.",
        "调查报告是用证据来回答一个问题。它要说明调查了什么、怎样调查的（调查了谁，多少人，什么时间，用问卷、访问还是观察）；把调查结果用数据和平实的语言有条理地写出来；分析这些数据说明了什么；得出的结论不超出数据能说明的范围，再提出由此而来的建议。\n\n比如一个班在校门口数了一个星期的自行车，发现三分之一没有上锁。报告要写清楚数的方法和结果，分析原因（是车架坏了？还是来不及？），再提出改进的办法；但不能说全城三分之一骑车的人都很粗心，因为只调查了一个校门。第一个知识点写清问题和结果，第二个得出结论并指出不足。",
      ),
      prerequisites: ["writing-8-research-report"],
      xp: 28,
      strand: "writing",
      encompasses: [{ topic: "writing-8-research-report", weight: 0.2 }],
      criteria: ["zh10-report-question", "zh10-report-data", "zh10-report-conclusion"].map(criterion),
      knowledgePoints: [
        point(
          "writing-10-report-findings",
          t("The Question, the Method and the Findings", "调查的问题、方法和结果"),
          t(
            "Begin with why the survey was made and the question it answers. Then the method, exactly: whom, how many, when, by what means, how many answers came back. Then the findings, in numbered order, each with its figure, and in the words of fact: “占41%”, not “很多”. Keep opinion out of this part; analysis comes after.\n\nA report on queues at a school shop writes “连续五天在课间记录排队人数，平均每次排队23人，最长等候6分钟”, not “排队的人特别多，等得让人受不了”.\n\n> **Watch out.** Figures must agree with one another: shares that should make a whole add up to it, and a share of a part is said to be of that part. And “大家都觉得” is not a finding unless it is counted.",
            "先写为什么要做这次调查，要回答什么问题。再准确地写调查方法：调查了谁，多少人，什么时间，用什么办法，收回了多少份。然后分条写调查结果，每一条都有数据，用陈述事实的语言：写“占41%”，不写“很多”。这一部分不掺入自己的看法，分析放在后面。\n\n调查学校小卖部排队情况的报告，写“连续五天在课间记录排队人数，平均每次排队23人，最长等候6分钟”，而不写“排队的人特别多，等得让人受不了”。\n\n> **注意。** 数据之间要一致：几个部分加起来应该等于整体，说的是某一部分人中的比例，就要说明是哪一部分人。“大家都觉得”不是调查结果，除非真的统计过。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the survey report the task asks for, at least 800 characters. State the question and the method exactly, and set out the given findings in order, apart from your opinions.",
              "按题目的要求，用中文写一篇不少于800字的调查报告。准确说明调查的问题和方法，有条理地写出题目给出的调查结果，不和自己的看法混在一起。",
            ),
            surveyBank,
            ["zh10-report-question", "zh10-report-data"],
            ESSAY,
            worked(
              t(
                "Write the question the survey answers in one sentence; list the method (whom, how many, when, how); group the given figures under two or three headings, checking that the shares agree.",
                "用一句话写出调查要回答的问题；列出调查方法（调查了谁、多少人、什么时间、怎样调查）；把题目给出的数据分成两三类，核对各部分的比例是不是一致。",
              ),
              t(
                "Read the findings part alone: every figure is the one the task gave, each says of whom it is a share, and no sentence in it gives an opinion.",
                "单独读一遍调查结果部分：每一个数据都和题目给出的一致，每一个比例都说明了是哪些人中的比例，这一部分没有一句是在发表看法。",
              ),
            ),
          ),
        ),
        point(
          "writing-10-report-conclusions",
          t("Conclusions, Suggestions and Limits", "结论、建议和不足"),
          t(
            "Analyse what the findings mean: which stand out, what they suggest about causes, where they disagree with what people assume. Conclude in a sentence or two that sum up the findings, no wider than the survey reaches. Suggest what follows, each suggestion tied to a finding. Then note a limit: a small sample, answers people gave about themselves, one place or one time only.\n\nA survey of one class that finds most pupils sleep under seven hours concludes about that class, may suggest a later start to homework, and notes that it did not ask other grades.\n\n> **Watch out.** Two things found together are not cause and effect without more: pupils who exercise less and score lower may differ in other ways too. And a suggestion that no finding supports is not a conclusion of the report.",
            "分析调查结果说明了什么：哪些结果最突出，可能有什么原因，哪些地方和人们平常的想法不一样。用一两句话得出结论，概括调查结果，不超出调查所能说明的范围。再提出由此而来的建议，每一条建议都和某一项结果对应。最后指出调查的不足：样本小，答案是被调查的人自己说的，只调查了一个地方或一段时间。\n\n调查了一个班、发现大多数同学睡眠不足七小时的报告，结论只针对这个班，可以建议调整写作业的时间，并说明没有调查其他年级。\n\n> **注意。** 两件事同时出现，不一定是因果关系：锻炼少的同学成绩差，他们也可能在别的方面不一样。没有调查结果支持的建议，不能算作这份报告的结论。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the survey report the task asks for, at least 800 characters. Analyse the findings, draw conclusions and suggestions that follow from them, and note a limit of the survey.",
              "按题目的要求，用中文写一篇不少于800字的调查报告。分析调查结果，得出由此推出的结论和建议，并指出这次调查的不足。",
            ),
            surveyBank,
            ["zh10-report-conclusion", "zh10-report-data"],
            ESSAY,
            worked(
              t(
                "Pick the two or three findings that stand out and ask why each might be; write the conclusion in one sentence that names the group surveyed; tie each suggestion to a finding; name one thing the survey could not show.",
                "挑出两三项最突出的结果，想一想各自可能的原因；用一句话写出结论，说明是对哪些人的调查；每一条建议都对应一项结果；说出一件这次调查不能说明的事。",
              ),
              t(
                "For each conclusion and suggestion, point to the finding it rests on; cross out any that rests on none. Check that no conclusion speaks of more people than were surveyed.",
                "每一条结论和建议，都能指出它依据的是哪一项结果；没有依据的就删掉。检查一遍，没有哪一条结论说到了调查范围以外的人。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 10,
    topic: {
      id: "writing-10-rigorous",
      title: t("Arguing Rigorously", "立论严谨"),
      summary: t(
        "Write an argument in Chinese that defines its key term and keeps to it, reasons in valid steps without hasty generalisation, false cause or false either-or, and states its claim no wider than its grounds, answering an objection.",
        "用中文写议论文：界定关键概念并前后一致，推理严密，不以偏概全，不强加因果，不非此即彼，观点不超出论据能支持的范围，并回应反对的意见。",
      ),
      intro: t(
        "A rigorous argument can be followed and tested. It says what its key word means (“勇敢 here is acting rightly in spite of fear, not having no fear”) and keeps to that sense. Each step follows from the one before. Its claim goes no further than its reasons: “most”, “in these conditions”, not “all” and “always”. And it meets the strongest objection instead of ignoring it.\n\nTake the claim “手机让学生成绩下降”. One pupil whose marks fell after getting a phone proves nothing for all pupils; that the phone came first does not show it is the cause; and “either ban phones or give up on study” leaves out the ways between. The first knowledge point defines the terms and states the limits, the second checks the reasoning.",
        "严谨的论证，别人能跟得上，也能检验。它先说明关键词的意思（“这里说的勇敢，是虽然害怕仍然做正确的事，而不是不知道害怕”），并且一直按这个意思用。每一步都从上一步推出来。观点不超出理由所能支持的范围：说“大多数”“在这种条件下”，而不说“所有”“永远”。它还要正面回应最有力的反对意见，而不是避而不谈。\n\n比如“手机让学生成绩下降”这个观点。一个同学有了手机以后成绩下降，不能证明所有同学都是这样；有手机在先，不能说明手机就是原因；“要么禁止手机，要么放弃学习”，又漏掉了中间的种种办法。第一个知识点界定概念、限定观点，第二个检查推理。",
      ),
      prerequisites: ["writing-10-material"],
      xp: 30,
      strand: "writing",
      encompasses: [{ topic: "writing-10-material", weight: 0.2 }],
      criteria: ["zh10-rigor-concept", "zh10-rigor-reasoning", "zh10-rigor-limits"].map(criterion),
      knowledgePoints: [
        point(
          "writing-10-rigorous-concepts",
          t("Defining the Term and Limiting the Claim", "界定概念，限定观点"),
          t(
            "Many arguments are quarrels over a word used in two senses. Early in the essay, say what you mean by the key term, often by setting it against what it is not, and use it only in that sense. Then state the claim as wide as your grounds: mark the conditions under which it holds, grant what is right in the other side, and say what you are not claiming.\n\nAn essay on “节俭” says at the start that it means not wasting, not refusing every spending, and later grants that spending on books or health is no breach of it.\n\n> **Watch out.** A term that changes sense halfway, 自信 as trust in oneself in one paragraph and as never doubting in the next, breaks the argument even if each paragraph sounds right. And “一切”“永远”“必然” are claims too: use them only where they hold.",
            "很多争论，其实是同一个词被用成了两种意思。在文章前面就说清楚关键概念的意思，常用的办法是把它和容易混淆的意思对比，然后全文只在这一个意思上使用它。再把观点说到论据能支持的程度：说明它在什么条件下成立，承认对方说得对的地方，并说明自己不主张什么。\n\n一篇谈“节俭”的文章，开头说明节俭是不浪费，而不是什么钱都不花；后面又承认，花钱买书、看病并不违背节俭。\n\n> **注意。** 一个概念在文章中途换了意思，比如前一段的“自信”是相信自己，后一段变成了从不怀疑，即使每一段听起来都有道理，论证也已经断了。“一切”“永远”“必然”也是观点，只能用在确实成立的地方。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the argument the task asks for, at least 800 characters. Define the key term and keep to it, and state your claim with the conditions under which it holds.",
              "按题目的要求，用中文写一篇不少于800字的议论文。界定关键概念并始终按这个意思使用，说明你的观点在什么条件下成立。",
            ),
            rigorousBank,
            ["zh10-rigor-concept", "zh10-rigor-limits"],
            ESSAY,
            worked(
              t(
                "Write one sentence that defines the key term, setting it against the sense you do not mean; write your claim, then the conditions under which it holds and one thing you are not claiming.",
                "用一句话界定关键概念，并和你不采用的那个意思对比；写出你的观点，再写出它成立的条件，以及一件你并不主张的事。",
              ),
              t(
                "Find every use of the key term and read it with your definition in its place: each still reads. Then underline every 一切, 永远 and 必然 and keep only those that hold.",
                "找出关键概念出现的每一处，用你的定义替换进去读：每一处都讲得通。再画出所有的“一切”“永远”“必然”，只保留确实成立的。",
              ),
            ),
          ),
        ),
        point(
          "writing-10-rigorous-reasoning",
          t("Valid Steps and an Answered Objection", "推理严密，回应反驳"),
          t(
            "Test each step of the argument against the common faults. One or two cases do not prove what holds for all. What came first is not therefore the cause. Two choices are seldom the only two. A view does not become true because many hold it, or false because of who holds it. Then find the strongest objection to your claim, state it fairly, and answer it: grant what is right in it and show why your claim still stands.\n\n“很多科学家小时候成绩并不好，所以成绩不重要” generalises from a few cases and ignores the many whose good marks helped them; a rigorous essay would say only that poor marks in childhood do not settle a person's future.\n\n> **Watch out.** An objection made weak so as to knock it down is no answer. State it as its holder would, then reply.",
            "用常见的推理错误逐一检查论证的每一步：一两个例子不能证明所有的情况都是这样；发生在前面的事，不一定就是原因；可以选择的往往不只有两种；一种看法不会因为很多人这样认为就是对的，也不会因为是谁提出的就是错的。再找出对你的观点最有力的反对意见，公平地把它说出来，然后回应：承认其中有道理的地方，说明你的观点为什么仍然成立。\n\n“很多科学家小时候成绩并不好，所以成绩不重要”，是用几个例子以偏概全，而忽略了更多靠好成绩成才的人；严谨的说法只能是：小时候成绩不好，并不能决定一个人的将来。\n\n> **注意。** 故意把反对意见说得很弱再去驳倒它，不算回应。要像持这种意见的人那样把它说出来，再作答。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the argument the task asks for, at least 800 characters. Make each step follow from the one before, and state and answer the strongest objection to your view.",
              "按题目的要求，用中文写一篇不少于800字的议论文。每一步推理都要从上一步推出来，并说出、回应对你的观点最有力的反对意见。",
            ),
            rigorousBank,
            ["zh10-rigor-reasoning", "zh10-rigor-limits"],
            ESSAY,
            worked(
              t(
                "List the steps from your grounds to your claim; next to each, name the fault it might commit (too few cases, false cause, only two choices) and how you avoid it; write the strongest objection as its holder would put it.",
                "列出从理由到观点的每一步；在每一步旁边写出它可能犯的错误（例子太少、强加因果、只有两种选择），以及你怎样避免；再像持反对意见的人那样，写出最有力的反对意见。",
              ),
              t(
                "Read each “所以” and “可见”: what comes before it is enough for what comes after. Read the objection: someone who holds it would accept it as fair.",
                "读每一个“所以”“可见”：前面的内容足以推出后面的结论。再读一遍你写的反对意见：持这种意见的人会认为你说得公平。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 11,
    topic: {
      id: "writing-11-literary-review",
      title: t("A Short Literary Review", "写文学短评"),
      summary: t(
        "Write a short review in Chinese of a literary work you have read: one clear judgment of the work or of one feature of it, grounded in its words, details and scenes, saying how it achieves its effect.",
        "用中文为读过的文学作品写一篇短评：对作品或作品的某一方面提出一个明确的判断，用作品中的词句、细节和场景作依据，说清楚它是怎样产生效果的。",
      ),
      intro: t(
        "A literary review is not a retelling and not a list of praises. It makes one judgment, “孔乙己的悲剧是在笑声中完成的”, and spends the rest proving it from the text: which laugh, at what moment, and what it does to the reader.\n\nA short review is narrow on purpose. It takes one feature, an ending, an image, a way of telling, and goes deep, rather than touching every feature lightly. The first knowledge point makes the judgment and grounds it in the text, the second goes beyond the obvious to how the work works.",
        "文学短评不是复述情节，也不是罗列赞美之词。它提出一个判断，比如“孔乙己的悲剧是在笑声中完成的”，然后用全文从作品里证明它：哪一次笑，在什么时候，对读者产生了什么作用。\n\n短评有意写得集中：只抓住一个方面，一个结尾、一个意象、一种叙述方式，往深处写，而不是面面俱到、处处浅尝。第一个知识点提出判断并以文本为依据，第二个越过显而易见的东西，写出作品是怎样起作用的。",
      ),
      prerequisites: ["writing-10-literary", "writing-10-commentary"],
      xp: 30,
      strand: "writing",
      encompasses: [{ topic: "writing-10-commentary", weight: 0.2 }],
      criteria: ["zh11-review-judgment", "zh11-review-evidence", "zh11-review-insight"].map(criterion),
      knowledgePoints: [
        point(
          "writing-11-literary-review-judgment",
          t("One Judgment, Grounded in the Text", "一个判断，以文本为据"),
          t(
            "State in one sentence what you think of the work or of one feature of it, a sentence someone could disagree with. Then prove it the way a lawyer does, from the text: quote or point to the particular words, details and scenes, and after each say what it shows. Retell only as much of the plot as the proof needs.\n\nNot “《背影》写得很感人”, which no one disputes and nothing proves, but “《背影》最动人的不是父亲的话，而是作者不肯多说的地方”, then the climbing scene and the few words that follow it.\n\n> **Watch out.** A quotation is not yet evidence: after quoting, say what in it supports your judgment. And a review that retells the story for half its length has no room left to argue.",
            "用一句话说出你对作品或作品某一方面的看法，这句话应当是别人可能不同意的。然后像律师那样从文本中证明它：引用或指出具体的词句、细节和场景，每引一处，都说明它表明了什么。情节只复述证明所需要的那一点。\n\n不写“《背影》写得很感人”，这句话没有人反对，也无须证明；而写“《背影》最动人的不是父亲说的话，而是作者不肯多说的地方”，再拿出爬月台的场景和它后面的寥寥几句来证明。\n\n> **注意。** 引文还不等于论据：引用之后，要说出其中哪一点支持你的判断。用一半的篇幅复述故事的短评，就没有地方去论证了。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the review the task asks for, at least 800 characters. State one clear judgment and ground it in particular words, details and scenes of the work.",
              "按题目的要求，用中文写一篇不少于800字的文学短评。提出一个明确的判断，并用作品中具体的词句、细节和场景作依据。",
            ),
            reviewBank,
            ["zh11-review-judgment", "zh11-review-evidence"],
            ESSAY,
            worked(
              t(
                "Write your judgment in one sentence someone could dispute; under it, list three places in the text that support it, and next to each, what it shows.",
                "用一句别人可能反驳的话写出你的判断；在下面列出文本中支持它的三处地方，每一处旁边写上它说明了什么。",
              ),
              t(
                "Underline your judgment: it is one sentence, and someone could disagree with it. After every quotation, find the sentence that says what it shows. Count the lines of retelling: they are fewer than the lines of argument.",
                "画出你的判断：它是一句话，而且有人可能不同意。每一处引文后面，都能找到说明它表明了什么的那句话。数一数复述情节的行数：比论证的行数少。",
              ),
            ),
          ),
        ),
        point(
          "writing-11-literary-review-insight",
          t("How the Work Achieves Its Effect", "写出作品怎样产生效果"),
          t(
            "Go one step past what every reader notices. That the ending of a story is sad is plain; a review asks how the writer makes it sad, by a detail repeated, by what the narrator does not say, by a turn in the sentence, and what the work means by it. Keep the claim within what the text shows: an insight is a reading the words support, not a guess about the author's life.\n\n“《项链》的结尾很意外” is plain; “结尾的意外让前面十年的辛苦变得既可笑又可敬，作者的同情就在这两者之间” goes further, and the text bears it out.\n\n> **Watch out.** Going deeper does not mean going outside the text: a claim about what the author “must have felt” that no word of the work supports is not an insight. And a review that touches every feature of the work goes deep into none.",
            "比每个读者都能注意到的再多走一步。小说的结尾令人悲伤，这谁都看得出；短评要问作者是怎样让它令人悲伤的：是一个反复出现的细节，是叙述者没有说出的话，还是句子的一个转折，作品又借此表达了什么。观点要在文本所能证明的范围之内：见解是词句能支持的解读，而不是对作者生平的猜测。\n\n“《项链》的结尾很意外”是显而易见的；“结尾的意外让前面十年的辛苦变得既可笑又可敬，作者的同情就在这两者之间”就更进了一步，而且文本可以证明。\n\n> **注意。** 往深处写不等于离开文本：作品里没有一个字能支持的“作者当时一定很痛苦”，不算见解。一篇什么方面都谈到的短评，哪一方面也谈不深。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the review the task asks for, at least 800 characters. Go beyond the obvious to how the work achieves its effect, and keep your claims within what the text shows.",
              "按题目的要求，用中文写一篇不少于800字的文学短评。越过显而易见的东西，写出作品是怎样产生效果的，观点不超出文本所能证明的范围。",
            ),
            reviewBank,
            ["zh11-review-insight", "zh11-review-evidence"],
            ESSAY,
            worked(
              t(
                "Write down what every reader notices about the feature you chose, then ask how the writer makes it so; name the device and the place in the text, and what the work means by it.",
                "先写下每个读者都能注意到的那一点，再问作者是怎样做到的；指出所用的手法和它在文本中的位置，以及作品借此表达了什么。",
              ),
              t(
                "Find your central claim: it says how, not only what. For each claim about meaning, point to the words that bear it out; strike out any that rest on nothing in the text.",
                "找出你的中心观点：它说的是“怎样”，而不只是“什么”。对每一处关于意味的论断，指出支持它的词句；删去文本中找不到依据的论断。",
              ),
            ),
          ),
        ),
      ],
    },
  },
  {
    grade: 11,
    topic: {
      id: "writing-11-academic",
      title: t("A Short Research Essay", "写学术小论文"),
      summary: t(
        "Write a short research essay in Chinese: one focused question, answered from texts, data or observations the essay names, with a conclusion no wider than its evidence, in the form of a title, an abstract, sections, a conclusion and sources.",
        "用中文写一篇学术小论文：提出一个集中的问题，用文中列出的文本、数据或观察来回答，结论不超出依据的范围；有题目、摘要、正文各部分、结语和参考资料。",
      ),
      intro: t(
        "A research essay begins with a question small enough to answer: not “古诗中的意象”, but “古诗中的‘柳’为什么常和送别连在一起”. It says where its evidence comes from, the poems, the survey, the observations, and lets the reader see how each conclusion follows from them.\n\nThe form serves that purpose. The title names the question; the abstract gives the question, the method and the finding in a few lines; the sections take the evidence in order; the conclusion says what was found and what was not; the sources say where the evidence came from. The first knowledge point asks the question and gathers the evidence, the second draws a bounded conclusion in the form of the essay.",
        "学术小论文从一个小到可以回答的问题开始：不是“古诗中的意象”，而是“古诗中的‘柳’为什么常和送别连在一起”。它说明依据来自哪里，是哪些诗、哪次调查、哪些观察，让读者看清每个结论是怎样从依据中得出的。\n\n论文的格式就是为此服务的：题目点明问题；摘要用几行写出问题、方法和发现；正文各部分依次分析依据；结语说明发现了什么、还有什么没有解决；参考资料说明依据的来源。第一个知识点提出问题、收集依据，第二个按论文的格式得出有限度的结论。",
      ),
      prerequisites: ["writing-10-report", "writing-10-rigorous"],
      xp: 30,
      strand: "writing",
      encompasses: [{ topic: "writing-10-report", weight: 0.2 }],
      criteria: ["zh11-academic-question", "zh11-academic-evidence", "zh11-academic-conclusion"].map(criterion),
      knowledgePoints: [
        point(
          "writing-11-academic-question",
          t("A Focused Question and Named Evidence", "集中的问题和明确的依据"),
          t(
            "Narrow the topic until it is a question one essay can answer, and say why it is worth asking. Then name the evidence: which texts, which lines, how many people asked and how, what was observed and when. Go through it piece by piece, and keep apart what the evidence shows and what you infer from it, with words such as “可见” for the one and “可能”“推测” for the other.\n\nA survey of one class that finds more phone readers than book readers may report that; that phones make people read less is an inference it should mark as one, since keen readers may simply prefer paper.\n\n> **Watch out.** A question as wide as “中国古代文学” cannot be answered in 800 characters, and evidence that is not named, “很多诗都写到”, cannot be checked. Name the poems.",
            "把题目缩小，直到它成为一篇文章能回答的问题，并说明为什么值得问。然后说明依据：哪些文本、哪些诗句，调查了多少人、怎样调查的，观察了什么、在什么时间。逐一分析这些依据，并把依据本身表明的和你从中推出的分开：前者用“可见”之类的词，后者用“可能”“推测”之类的词。\n\n对一个班的调查发现用手机阅读的人比读纸质书的人多，可以如实报告；至于手机让人读得更少，只是推测，应当说明这是推测，因为也可能是本来爱读书的人更喜欢纸质书。\n\n> **注意。** 像“中国古代文学”这样大的问题，800字是回答不了的；不说明出处的依据，比如“很多诗都写到”，别人无法核对。要写出是哪些诗。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the research essay the task asks for, at least 800 characters. Ask one focused question and answer it from evidence you name, keeping what it shows apart from what you infer.",
              "按题目的要求，用中文写一篇不少于800字的学术小论文。提出一个集中的问题，用你列出的依据来回答，并把依据表明的和你推测的分开。",
            ),
            academicBank,
            ["zh11-academic-question", "zh11-academic-evidence"],
            ESSAY,
            worked(
              t(
                "Write your question in one sentence and check that one essay can answer it; list the evidence you will use, each piece with where it comes from; next to each, write what it shows.",
                "用一句话写出你的问题，并确认一篇文章能够回答它；列出你要用的依据，每一条都注明来源；在每一条旁边写出它表明了什么。",
              ),
              t(
                "Find the question: it is one sentence, and narrow. For every piece of evidence, the reader can tell where it came from. Find each inference and check that it is marked as one.",
                "找到你的问题：它是一句话，而且足够集中。每一条依据，读者都能知道它来自哪里。找出每一处推测，确认它被标明是推测。",
              ),
            ),
          ),
        ),
        point(
          "writing-11-academic-conclusion",
          t("A Bounded Conclusion in the Form of an Essay", "有限度的结论和论文的格式"),
          t(
            "Conclude only what the evidence bears: three poems support a claim about those poems, one class a claim about that class. Say plainly what the essay did not examine and what remains open; that is part of the finding, not a weakness. Then give the essay its form: a title that names the question, an abstract of a few lines with the question, the method and the finding, numbered sections, a conclusion, and the sources used.\n\n“本调查只涉及一个班，结论不能推广到全校” is not an apology; it tells the reader how far the finding reaches.\n\n> **Watch out.** An abstract is not an introduction: it states the finding, not only the topic. And a conclusion that suddenly speaks of “所有中学生” or “整个中国文化” has gone beyond its evidence however well the essay has argued.",
            "只得出依据所能支持的结论：三首诗支持的是关于这三首诗的结论，一个班的调查支持的是关于这个班的结论。明白地说出文章没有考察什么、还有什么问题没有解决；这是研究结果的一部分，不是缺点。再按论文的格式来写：题目点明问题，摘要用几行写出问题、方法和发现，正文分节编号，有结语，并列出所用的参考资料。\n\n“本调查只涉及一个班，结论不能推广到全校”不是在道歉，而是告诉读者这个发现适用的范围。\n\n> **注意。** 摘要不是引言：它要写出发现，而不只是题目。结语如果忽然说到“所有中学生”或“整个中国文化”，那么不管前面论证得多好，结论都已经超出了依据。",
          ),
          writingGenerator(
            t(
              "Write in Chinese the research essay the task asks for, at least 800 characters, with a title, an abstract, sections, a conclusion and sources. Conclude no wider than your evidence and say what remains open.",
              "按题目的要求，用中文写一篇不少于800字的学术小论文，要有题目、摘要、正文各部分、结语和参考资料。结论不超出依据的范围，并说明还有什么问题没有解决。",
            ),
            academicBank,
            ["zh11-academic-conclusion", "zh11-academic-evidence"],
            ESSAY,
            worked(
              t(
                "Write the finding in one sentence, then the limit of your evidence in another; draft the abstract from the question, the method and that finding; plan the sections and list the sources.",
                "用一句话写出你的发现，再用一句话写出依据的局限；用问题、方法和这个发现写出摘要；安排好正文的各部分，列出参考资料。",
              ),
              t(
                "Read the conclusion against the evidence: every claim in it rests on something the essay showed. Check the parts: title, abstract with a finding, numbered sections, conclusion with its limits, and sources.",
                "把结语和依据对照着读：结语中的每一个论断，都有文中展示过的依据。再检查各部分：题目，写出了发现的摘要，编了号的正文各部分，说明了局限的结语，以及参考资料。",
              ),
            ),
          ),
        ),
      ],
    },
  },
];
