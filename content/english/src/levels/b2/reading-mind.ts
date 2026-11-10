// The reading unit of the B2 theme Mind and Behavior: why we put things off, first impressions, how habits form,
// what dreams might be for, introverts, gratitude, body language across cultures and making better decisions.

import { type ReadingUnitDef, t } from "@ga/content";
import { passageMaker } from "../pre-a1/reading-kit.ts";
import { readingWords } from "./reading-words.ts";

const passage = passageMaker(readingWords, [
  "b2-words-psychology",
  "b2-words-strong-feelings",
  "b2-words-decisions",
  "b2-words-behavior",
  "b2-words-memory-and-sleep",
  "b2-words-bonds",
  "b2-words-motivation",
  "b2-words-body-language",
  "b2-words-wellbeing",
  "b2-words-personality-types",
  "b2-words-academic-adjectives",
  "inversion-after-negative-adverbs",
  "parallel-structure",
]);

/** readingMind is the reading unit of the theme Mind and Behavior. */
export const readingMind: ReadingUnitDef = {
  id: "b2-reading-mind",
  title: t("Mind and Behavior", "心理与行为"),
  passages: [
    passage({
      id: "b2-mind-why-we-put-things-off",
      title: ["Why We Put Things Off", "我们为什么拖延"],
      body: `Almost everyone procrastinates sometimes. A student has a week to write an essay and starts it the night before. A worker needs to make a difficult phone call and cleans the kitchen instead. Later, both feel tired, guilty and a little ashamed. Why do we keep doing something that so clearly makes our lives worse?

For a long time, procrastination was seen as a problem of poor planning or of being lazy. If people only planned better or worked harder, it was thought, they would stop. Psychologists now believe that this view misses something fundamental. Procrastination, they argue, is less about time than about feelings.

When a task makes us anxious, bored or doubtful about ourselves, we feel an impulse to get away from that feeling. Putting the task off makes us feel better at once, and that good feeling reinforces the behavior: the next time, the temptation to delay is even stronger. In this way, procrastination works like a bad habit. The person is not avoiding the work itself so much as the bad feelings that come with it.

This explains why perfectionists often procrastinate. If a piece of work must be free of mistakes, every start looks like a way to fail. It also explains why willpower alone does not often solve the problem. Telling yourself to try harder does nothing about the fear under it.

What does help? First, making the start very small: not "write the essay" but "write two sentences." Starting is the hardest part, and once we have started, we tend to keep going. Second, being kind to ourselves. Studies have found that students who forgave themselves for putting off one exam procrastinated less before the next one. Being hard on ourselves, it seems, only adds to the bad feelings that cause the delay. Third, taking away temptations, for example by leaving the phone in another room.

Not until we see procrastination as a way of dealing with feelings can we deal with it well. The goal is not to become a person who never delays, but to notice the feeling, name it, and begin anyway.`,
      grammar: ["inversion-after-negative-adverbs"],
      questions: [
        [
          ["What do psychologists now say procrastination is mainly about?", "心理学家认为，拖延主要与什么有关？"],
          ["Escaping unpleasant feelings", "逃避不愉快的感受"],
          [
            ["Not having enough time", "时间不够"],
            ["Being lazy", "懒惰"],
          ],
          ['"Procrastination, they argue, is less about time than about feelings."', "他们认为，拖延与其说关乎时间，不如说关乎感受。"],
        ],
        [
          ["Why do perfectionists often procrastinate?", "完美主义者为什么常常拖延？"],
          ["Every start looks like a way to fail", "每一个开头都可能是一次失败"],
          [
            ["They have too much work to do", "他们要做的工作太多"],
            ["They do not care about their work", "他们不在乎自己的工作"],
          ],
          [
            '"If a piece of work must be free of mistakes, every start looks like a way to fail."',
            "如果一件作品必须完美，那么每迈出第一步都可能是一次失败。",
          ],
        ],
        [
          ["What did students who forgave themselves do before the next exam?", "原谅了自己的学生在下一次考试前怎样？"],
          ["They procrastinated less", "他们拖延得更少了"],
          [
            ["They procrastinated more", "他们拖延得更多了"],
            ["They stopped studying", "他们不再学习了"],
          ],
          [
            "Students who forgave themselves for one exam procrastinated less before the next one.",
            "为一次考试原谅了自己的学生，在下一次考试前拖延得更少。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-mind-the-science-of-first-impressions",
      title: ["The Science of First Impressions", "第一印象的科学"],
      body: `We like to think that we judge other people carefully, after getting to know them. In fact, we form an impression of a stranger in less than a second. In one famous experiment, people were shown photos of faces for just a tenth of a second and asked whether each person looked trustworthy, skilled or friendly. Their judgments were almost the same as those of people who looked at the photos for as long as they liked.

These quick judgments are largely instinctive. Long before our ancestors had words, they needed to decide at once whether someone was a friend or a threat. The brain still does this, using signals such as facial expression, posture, tone of voice and the way a person moves. Much of this happens below the level of conscious thought: we often feel that we like or do not trust someone without being able to say why.

First impressions are also very hard to change. Once we have decided that someone is cold or warm, clever or slow, we tend to notice the evidence that agrees with our first view and to forget the evidence that does not. A teacher who believes on the first day that a pupil is lazy may see every late homework as evidence, and every good piece of work as luck.

Are these impressions accurate? Sometimes they are. People are often good at judging how outgoing or nervous a stranger is. But they are much worse at judging how honest or intelligent someone is, and their judgments are influenced by stereotypes about age, accent and looks. A person with a "baby face," for example, is often seen as more honest, and less skilled, than they really are.

What can we do with this knowledge? At a job interview, it is worth paying attention to the first minute: a firm greeting, a relaxed posture and a warm tone can matter more than we would like. When we are the ones judging, the lesson is the opposite. Hardly ever is our first impression the whole truth, and it is fair to give people a second look.`,
      grammar: ["inversion-after-negative-adverbs"],
      questions: [
        [
          ["How long did people see each face in the experiment?", "在实验中，人们看每张脸看了多久？"],
          ["A tenth of a second", "十分之一秒"],
          [
            ["As long as they liked", "想看多久就看多久"],
            ["Ten seconds", "十秒"],
          ],
          ['"People were shown photos of faces for just a tenth of a second."', "人们看到的每张人脸照片只有十分之一秒。"],
        ],
        [
          ["Why are first impressions hard to change?", "第一印象为什么难以改变？"],
          ["We notice the evidence that agrees with our first view", "我们会留意与最初看法一致的证据"],
          [
            ["We never meet the same person twice", "我们从不会两次见到同一个人"],
            ["Our memory of faces is very poor", "我们对面孔的记忆很差"],
          ],
          [
            '"We tend to notice the evidence that agrees with our first view and to forget the evidence that does not."',
            "我们往往留意与最初看法一致的证据，而忘掉不一致的证据。",
          ],
        ],
        [
          ["What are people much worse at judging from a first impression?", "仅凭第一印象，人们在判断什么方面要差得多？"],
          ["How honest or intelligent someone is", "一个人有多诚实或多聪明"],
          [
            ["How outgoing a stranger is", "陌生人有多外向"],
            ["How nervous a stranger is", "陌生人有多紧张"],
          ],
          ['"They are much worse at judging how honest or intelligent someone is."', "他们在判断诚实或智力方面要差得多。"],
        ],
      ],
    }),
    passage({
      id: "b2-mind-how-habits-are-formed",
      title: ["How Habits Are Formed", "习惯是如何养成的"],
      body: `Much of what we do each day, we do without thinking. We brush our teeth, check our phones and take the same way to work while we are thinking of other things. Psychologists estimate that a large part of our behavior each day is habit, not decision. This is not a bad thing. If we had to deliberate about every small action, we would be exhausted before breakfast.

A habit forms through a simple cycle of three parts. First comes a cue: a time, a place, a feeling or another action. Then comes the routine, the behavior itself. Finally comes a reward, something that feels good. Each time the cycle is repeated, the link between the cue and the routine is reinforced, until the cue starts the behavior almost by itself. A worker who feels tired at three o'clock, walks to the coffee shop and enjoys a sweet cake will soon find herself standing up at three o'clock without having decided anything.

How long does it take? A popular belief says twenty-one days, but a study that followed people trying to build a new habit, such as drinking water with lunch or going for a walk after dinner, found that it took sixty-six days on average, and much longer for some people. Missing a single day did not matter much; what mattered was repeating the action in the same situation.

Understanding the cycle also helps us change bad habits. Willpower alone is not very reliable, because temptation tends to be strongest when we are tired or worried. A better approach is to keep the cue and the reward but change the routine. The worker at three o'clock could take a short walk outside instead, which also gives her a break and a change of scene. Another approach is to change the situation itself: people who want to eat less sugar are wise not to keep it at home.

Habits are not good or bad in themselves. They are a tool, and like any tool, they can build a life or damage it.`,
      grammar: ["parallel-structure"],
      glossed: ["cue"],
      questions: [
        [
          ["What are the three parts of the habit cycle?", "习惯循环的三个部分是什么？"],
          ["A cue, a routine and a reward", "提示、惯常行为和奖励"],
          [
            ["A plan, an effort and a result", "计划、努力和结果"],
            ["A feeling, a decision and a punishment", "感受、决定和惩罚"],
          ],
          ["First comes a cue, then the routine, and finally a reward.", "先是提示，然后是惯常行为，最后是奖励。"],
        ],
        [
          ["How long did it take on average to form a new habit in the study?", "在那项研究中，养成一个新习惯平均需要多久？"],
          ["Sixty-six days", "六十六天"],
          [
            ["Twenty-one days", "二十一天"],
            ["One week", "一周"],
          ],
          ['"It took sixty-six days on average, and much longer for some people."', "平均需要六十六天，有些人还要久得多。"],
        ],
        [
          ["What is a better approach to a bad habit than willpower alone?", "对付坏习惯，比单靠意志力更好的方法是什么？"],
          ["Keeping the cue and the reward but changing the routine", "保留提示和奖励，但改变惯常行为"],
          [
            ["Punishing yourself every time", "每次都惩罚自己"],
            ["Waiting until you are less tired", "等到自己不那么累的时候"],
          ],
          ['"A better approach is to keep the cue and the reward but change the routine."', "更好的方法是保留提示和奖励，但改变惯常行为。"],
        ],
      ],
    }),
    passage({
      id: "b2-mind-what-dreams-might-be-for",
      title: ["What Dreams Might Be For", "梦可能有什么用"],
      body: `Every night, most of us spend about two hours dreaming, whether we remember it or not. In our dreams we fly, fall, run from threats, meet people who died long ago and return to schools we left years before. Some dreams are happy; others are nightmares that wake us with our hearts beating fast. But why do we dream at all? Scientists still do not agree, although there are several serious theories.

The oldest modern theory came from Sigmund Freud, who believed that dreams express wishes from the subconscious that we cannot admit during the day. Few psychologists today accept his ideas as he stated them, but many agree that dreams are often connected with our strongest feelings and worries.

A second theory says that dreams help memory. While we sleep, the brain seems to play again and organize the experiences of the day, keeping some and letting others go. In experiments, people who learned a task and then slept, and especially those who dreamed about the task, often did it better the next day than people who did not sleep.

A third theory sees dreams as a kind of therapy at night. During dreaming sleep, the brain chemicals connected with stress are at their lowest. This may allow us to experience sad memories again in a safe state, so that they feel less sharp in the morning. People who have lived through something terrible often dream about it, and some scientists believe this is part of how they recover.

A fourth theory suggests that dreams are practice. By imagining threats, such as being chased or failing an exam, the brain may be preparing us to deal with real ones. This might explain why so many dreams are about threats and so few are about calm, ordinary days.

These theories do not have to be alternatives; dreams may do several jobs at once. What is clear is that sleep matters. People who sleep badly for a long time often become forgetful, irritated and less able to control their feelings.`,
      grammar: ["parallel-structure"],
      names: ["Sigmund", "Freud"],
      questions: [
        [
          ["What did Freud believe dreams express?", "弗洛伊德认为梦表达了什么？"],
          ["Wishes from the subconscious", "来自潜意识的愿望"],
          [
            ["Memories of the past day only", "只有前一天的记忆"],
            ["Messages about the future", "关于未来的信息"],
          ],
          [
            "Freud believed that dreams express wishes from the subconscious that we cannot admit during the day.",
            "弗洛伊德认为，梦表达的是我们醒着时无法承认的来自潜意识的愿望。",
          ],
        ],
        [
          ["Who often did a task better the next day?", "谁第二天往往把任务做得更好？"],
          ["People who slept and dreamed about the task", "睡了觉并梦到这项任务的人"],
          [
            ["People who stayed awake all night", "整夜没睡的人"],
            ["People who did not learn the task", "没有学过这项任务的人"],
          ],
          [
            "People who learned a task and then slept, especially those who dreamed about it, often did it better.",
            "学了任务后去睡觉的人，尤其是梦到这项任务的人，往往做得更好。",
          ],
        ],
        [
          ["Why might so many dreams be about danger?", "为什么那么多梦都与危险有关？"],
          ["The brain may be practicing how to deal with real threats", "大脑可能在练习如何应对真正的威胁"],
          [
            ["Most people live dangerous lives", "大多数人过着危险的生活"],
            ["Calm days are impossible to remember", "平静的日子根本记不住"],
          ],
          [
            '"By imagining threats... the brain may be preparing us to deal with real ones."',
            "通过想象威胁，大脑可能在为我们应对真正的威胁做准备。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-mind-introverts-in-a-loud-world",
      title: ["Introverts in a Loud World", "喧闹世界中的内向者"],
      body: `In many schools and offices, the person everyone admires seems to be the extrovert: someone who speaks up in class, enjoys parties, makes friends easily and thinks out loud. Children who prefer to read alone are told to join in more. Workers who stay quiet when the team talks are seen as less committed. Yet perhaps a third to a half of all people are introverts.

Introversion is often confused with shyness, but the two are different. A shy person fears being judged by others. An introvert may not be afraid at all; they just get their energy from time alone, while extroverts get theirs from company. After a long party, an extrovert may feel refreshed and an introvert exhausted, even if both enjoyed it.

Introverts tend to think before they speak, to prefer serious conversations with a few close friends to small talk with many people, and to work well on their own for a long time. These qualities have real value. Many scientists, writers and artists have described themselves as introverts, and studies suggest that introverted leaders can be especially good at managing teams of active, self-motivated people, because they listen to ideas instead of pushing their own.

The problem is that many places are designed for extroverts. Open offices, group projects and a culture of constant group talks can leave introverts drained before they have done their best work. In class, a teacher who rewards only the students who answer first may never hear the most thoughtful answer in the room.

Small changes can help. Teachers can give students a minute to think, or to write down an answer, before anyone speaks. Offices can offer quiet rooms as well as shared places. Introverts themselves can plan time to recharge after busy events, and can remember that being quiet is not the same as having nothing to say.

This does not mean that one temperament is better than the other. Most people are a mix of both, and a good team needs those who speak, those who listen, and those who do a bit of each.`,
      grammar: ["parallel-structure"],
      glossed: ["introversion", "shyness", "drained", "recharge"],
      questions: [
        [
          ["How is an introvert different from a shy person?", "内向的人与害羞的人有什么不同？"],
          ["An introvert gets energy from time alone but may not be afraid", "内向的人从独处中获得能量，但未必害怕"],
          [
            ["An introvert is always afraid of other people", "内向的人总是害怕别人"],
            ["An introvert never enjoys parties", "内向的人从不喜欢聚会"],
          ],
          [
            '"An introvert may not be afraid at all; they just get their energy from time alone."',
            "内向的人可能一点也不害怕；他们只是从独处中获得能量。",
          ],
        ],
        [
          ["Why can introverted leaders be good with self-motivated teams?", "内向的领导者为什么善于带领自我驱动的团队？"],
          ["They listen to ideas instead of pushing their own", "他们倾听别人的想法，而不是推销自己的想法"],
          [
            ["They make all the decisions alone", "他们独自作出所有决定"],
            ["They hold more meetings", "他们召开更多会议"],
          ],
          ['"They listen to ideas instead of pushing their own."', "他们倾听别人的想法，而不是强推自己的想法。"],
        ],
        [
          ["What can teachers do to help introverts in class?", "老师可以怎样在课堂上帮助内向的学生？"],
          ["Give students a minute to think before anyone speaks", "在任何人发言前给学生一分钟思考"],
          [
            ["Reward only the first answer", "只奖励第一个回答"],
            ["Make them speak first every time", "每次都让他们先发言"],
          ],
          [
            '"Teachers can give students a minute to think, or to write down an answer, before anyone speaks."',
            "老师可以在任何人发言前给学生一分钟思考或写下答案。",
          ],
        ],
      ],
    }),
    passage({
      id: "b2-mind-the-power-of-saying-thank-you",
      title: ["The Power of Saying Thank You", "说声谢谢的力量"],
      body: `As children, we are taught to say thank you. As adults, we often forget why it matters. In recent years, psychologists have studied gratitude carefully, and their results suggest that this small habit has a very large effect on wellbeing.

In one famous study, people were divided into three groups. Every week for ten weeks, the first group wrote down five things they were grateful for, the second wrote down five things that had annoyed them, and the third just wrote down five events of the week. At the end, the grateful group felt more optimistic about the future, felt better about their lives and even reported doing more exercise than the other two groups.

Other studies have found similar results. People who regularly notice what they are grateful for tend to sleep better, to feel less envious of others and to recover more quickly from difficult times. Gratitude seems to shift attention from what we lack to what we have, which reduces the constant comparing of ourselves with others that so often leaves us dissatisfied.

Gratitude also makes bonds between people stronger. When we thank someone, we show that we have noticed their effort. In one experiment, students who were thanked for helping with a task were much more likely to help again. In couples, partners who feel appreciated report greater satisfaction and loyalty. Thanking someone, in other words, is not only polite; it builds the mutual trust on which friendships depend.

Many of us underestimate this. When people were asked to write a letter of thanks to someone who had helped them, they expected the person to feel only slightly pleased and perhaps a little embarrassed. In fact, those who received the letters were far more delighted than the writers had imagined.

This does not need money or much time. A short note, a message or a few honest words in person can be enough. Hardly ever does an action so small do so much good, both for the person who receives the thanks and for the person who gives it.`,
      grammar: ["inversion-after-negative-adverbs"],
      glossed: ["appreciated", "underestimate"],
      questions: [
        [
          ["What did the first group in the study write down each week?", "研究中第一组人每周写下了什么？"],
          ["Five things they were grateful for", "五件他们感激的事"],
          [
            ["Five things that had annoyed them", "五件让他们烦恼的事"],
            ["Five events of the week", "这一周的五件事"],
          ],
          ['"The first group wrote down five things they were grateful for."', "第一组写下了五件他们感激的事。"],
        ],
        [
          ["How does gratitude seem to work, according to the passage?", "根据文章，感恩似乎是如何起作用的？"],
          ["It shifts attention from what we lack to what we have", "它把注意力从我们缺少的转向我们拥有的"],
          [
            ["It makes us compare ourselves with others more", "它让我们更多地与别人比较"],
            ["It makes us need less sleep", "它让我们需要更少的睡眠"],
          ],
          [
            '"Gratitude seems to shift attention from what we lack to what we have."',
            "感恩似乎能把注意力从我们缺少的东西转向我们拥有的东西。",
          ],
        ],
        [
          ["How did people who received letters of thanks feel?", "收到感谢信的人感觉如何？"],
          ["Far more delighted than the writers had imagined", "比写信人想象的要高兴得多"],
          [
            ["Only slightly pleased", "只是有点高兴"],
            ["Awkward and annoyed", "尴尬而恼火"],
          ],
          ['"Those who received the letters were far more delighted than the writers had imagined."', "收到信的人比写信人想象的高兴得多。"],
        ],
      ],
    }),
    passage({
      id: "b2-mind-body-language-across-cultures",
      title: ["Body Language Across Cultures", "不同文化中的肢体语言"],
      body: `We communicate not only with words but with our faces, hands and bodies. A smile, a raised eyebrow or a move back can convey more than a whole sentence. It is tempting to believe that this nonverbal language is the same everywhere. Some of it is: people in very different cultures recognize the facial expressions of joy, fear and anger. But much of it is learned, and what is polite in one place can be rude in another.

Take eye contact. In many countries of Europe and North America, looking someone in the eye shows that you are honest and confident, and a person who looks away may be seen as hiding something. In parts of East Asia and Africa, however, looking straight at an older person or a boss can seem disrespectful, and looking down is a sign of good manners. A teacher from one culture may misinterpret a pupil from another as rude or as not honest when the child is only being polite.

Gestures cause even more problems. The sign made by joining the thumb and first finger in a ring means "OK" in the United States, money in Japan and something very rude in parts of South America. Moving the head from side to side means "no" in most countries but something close to "yes" in parts of India. Even counting on the fingers is different: some people start with the thumb, others with the first finger.

Personal space is different too. In some cultures, friends stand close, touch each other on the arm and kiss when they meet. In others, people prefer to keep more distance, and touching a stranger is not welcome. A person who stands too close can seem rude, while one who stands too far away can seem cold.

This does not mean we should stop using our bodies to communicate. It means we should be careful about what we first think a gesture means. When a gesture or a look seems strange, it is worth asking for clarification before deciding what it means. A good visitor, like a person who listens well, pays attention to the whole person, not only to their words.`,
      grammar: ["parallel-structure"],
      names: ["Japan", "India", "OK", "Asia", "Africa", "America", "Europe", "United"],
      glossed: ["eyebrow", "disrespectful", "thumb"],
      questions: [
        [
          ["What does lowering the eyes show in parts of East Asia and Africa?", "在东亚和非洲部分地区，垂下目光表示什么？"],
          ["Good manners", "有礼貌"],
          [
            ["Dishonesty", "不诚实"],
            ["Anger", "愤怒"],
          ],
          ['"Looking down is a sign of good manners."', "垂下目光是有礼貌的表现。"],
        ],
        [
          ["What does moving the head from side to side mean in parts of India?", "在印度部分地区，左右摇头是什么意思？"],
          ["Something close to yes", "接近于“是”的意思"],
          [
            ["A clear no", "明确的“不”"],
            ["Money", "钱"],
          ],
          [
            "In parts of India, moving the head from side to side means something close to yes.",
            "在印度部分地区，左右摇头的意思接近于“是”。",
          ],
        ],
        [
          ["What does the writer advise when a gesture seems strange?", "当一个手势看起来奇怪时，作者有什么建议？"],
          ["Ask for clarification before deciding what it means", "在判断它的意思前先请对方说明"],
          [
            ["Stop using gestures at all", "完全不再使用手势"],
            ["Trust your first interpretation", "相信你的第一印象"],
          ],
          ['"It is worth asking for clarification before deciding what it means."', "在判断它的意思之前，值得先请对方说明。"],
        ],
      ],
    }),
    passage({
      id: "b2-mind-making-better-decisions",
      title: ["Making Better Decisions", "作出更好的决定"],
      body: `Every day we make hundreds of decisions, from what to eat for breakfast to which job to accept. Most are small, and we make them quickly and without much thought. But even important decisions are less rational than we like to believe. Psychologists have shown that our judgments are influenced by tendencies that most of us never notice.

One of these is the way a question is described. In a famous experiment, people were told about a disease that would cause six hundred people to die and asked to pick between two plans. When the plans were described in terms of lives saved, most people picked the safe one. When exactly the same plans were described in terms of lives lost, most picked the dangerous one. The facts were exactly the same; only the words had changed.

Another tendency is to give too much weight to the first number we hear. When people were asked to guess a price after seeing a number that had nothing to do with the price, their guesses were higher if the number was high, even though they knew it meant nothing. Shops and negotiators use this effect all the time.

We are also bad at stopping. Having spent money or time on a plan, we keep going even when it is clearly failing, because we do not want to waste what we have already put in. A person may sit through a terrible movie to the end just because they paid for the ticket.

So what can we do? First, slow down for important decisions, and do not decide when you are tired, hungry or furious. Second, write down the alternatives and the trade-offs of each, which makes it harder to be swayed by words alone. Third, imagine that the decision has failed a year from now and ask why; this reveals risks that hope tends to hide. Finally, do not throw away intuition. For people with long experience in an area, such as nurses or firefighters, a quick feeling often comes from real knowledge.

Not only does making good decisions need clear thinking; it also needs us to be honest about how far our own thinking can go.`,
      grammar: ["inversion-after-negative-adverbs"],
      glossed: ["negotiators", "swayed"],
      questions: [
        [
          ["What changed between the two descriptions of the plans in the experiment?", "在实验中，两种对方案的描述之间有什么变化？"],
          ["Only the words", "只有措辞"],
          [
            ["The number of people", "人数"],
            ["The facts of the plans", "方案的事实"],
          ],
          ['"The facts were exactly the same; only the words had changed."', "事实完全一样，只是措辞变了。"],
        ],
        [
          ["Why do people keep going with a plan that is failing?", "人们为什么会坚持一个正在失败的计划？"],
          ["They hate to waste what they have already put in", "他们不愿浪费已经投入的东西"],
          [
            ["They do not notice that it is failing", "他们没注意到它在失败"],
            ["They want to save money", "他们想省钱"],
          ],
          [
            '"We keep going even when it is clearly failing, because we do not want to waste what we have already put in."',
            "即使计划明显在失败，我们也会坚持，因为我们不愿浪费已经投入的东西。",
          ],
        ],
        [
          ["Whose intuition often comes from real knowledge?", "谁的直觉往往建立在真实的知识之上？"],
          ["People with long experience in an area", "在某个领域有长期经验的人"],
          [
            ["People who are tired or hungry", "疲惫或饥饿的人"],
            ["People who decide very slowly", "决定得很慢的人"],
          ],
          [
            '"For people with long experience in an area, such as nurses or firefighters, a quick feeling often comes from real knowledge."',
            "对于在某个领域经验丰富的人，比如护士或消防员，快速的感觉往往建立在真实的知识之上。",
          ],
        ],
      ],
    }),
  ],
};
