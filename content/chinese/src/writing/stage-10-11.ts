// The judged writing of the senior required course added by docs/chinese-curriculum.md §18.9: literary writing after
// the task group of literary reading and writing, a survey report after the task group of taking part in today's
// culture, and rigorous argument after the task group of critical reading and expression. A Chinese character counts as
// a word in every length; the compositions and their models are at least 800 characters.

import { type CriterionSpec, type Text, t } from "@ga/content";
import { criterionById, point, writingGenerator } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { literaryBank } from "./bank-m.ts";
import { surveyBank } from "./bank-n.ts";
import { rigorousBank } from "./bank-o.ts";

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
];
