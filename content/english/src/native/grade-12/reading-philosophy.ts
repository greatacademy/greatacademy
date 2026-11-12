// Grade 12: the reading unit of the third theme, belief and doubt, from a philosopher who doubted everything
// and a ring that made its wearer invisible to the sunrise that may not come, two views of human nature, a
// machine of pleasure, a veil of ignorance, a scientist in a black and white room and a runaway trolley.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const philosophy = { topic: "words-of-philosophy", weight: 0.3 } as const;
const belief = { topic: "words-of-belief-and-doubt", weight: 0.3 } as const;
const thought = { topic: "following-a-thought-experiment", weight: 0.2 } as const;
const academic10 = { topic: "academic-words-10", weight: 0.1 } as const;
const academic11 = { topic: "academic-words-11", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** questionsOfPhilosophy is a reading unit of grade 12 on the questions of philosophy, belief and doubt, and the thought experiments that test them. */
export const questionsOfPhilosophy: ReadingUnitDef = {
  id: "questions-of-philosophy",
  title: t("Questions of Philosophy", "哲学之问"),
  passages: [
    passage(
      "the-philosopher-who-doubted-everything",
      t("The Philosopher Who Doubted Everything", "怀疑一切的哲学家"),
      `In the winter of 1619, a young French soldier named René Descartes spent a day alone in a heated room in Germany, thinking. He later wrote that he had realized how many of the things he had been taught were uncertain. Teachers disagreed, books contradicted one another, and even the senses sometimes deceived. He resolved that one day he would build his knowledge again from the ground up, accepting nothing that he could possibly doubt.

He carried out the plan years later in a short book, the Meditations, published in 1641. He began by doubting the senses. A stick in water looks bent; a tower that seems round from far away turns out to be square. If the senses deceive us sometimes, how can we be sure they do not deceive us always? Then he went further. When he dreamed, he believed he was awake. How could he be certain that he was not dreaming now?

Finally he imagined something stranger: an evil spirit, powerful and clever, whose only aim was to deceive him about everything, even about simple sums. If such a spirit existed, then perhaps two and three did not make five. Descartes did not believe such a spirit existed. He used it as a test, to find out whether anything at all could survive the most extreme doubt.

Something did. Even if the spirit deceived him about everything else, Descartes reasoned, it could not deceive him into thinking he existed if he did not exist, because to be deceived he must be something that thinks. "I think, therefore I am" became the most famous sentence in modern philosophy. It was a certitude that no doubt could remove.

From this one point, Descartes tried to rebuild the rest of his knowledge, including his belief in God and in the world outside his mind. Many readers have found that rebuilding far less convincing than the doubt that came before it. His method also led to dualism, the view that the mind and the body are two different kinds of thing, which raised the hard question of how they act on each other.

Yet his method changed philosophy. Epistemology, the study of what we can know and how, became central to it. Even philosophers who reject his conclusions still begin where he began: by asking what, if anything, we cannot doubt.`,
      [philosophy, belief, academic10, academic3],
      [
        ask(
          t("Why did Descartes imagine an evil spirit that deceived him?", "笛卡尔为什么设想一个欺骗他的邪恶精灵？"),
          t("As a test to see if any belief could survive the most extreme doubt", "作为一种检验，看是否有任何信念能经受住最极端的怀疑"),
          [
            t("Because he believed such a spirit really controlled the world", "因为他相信这样的精灵真的控制着世界"),
            t("To prove that two and three do not make five", "为了证明二加三不等于五"),
            t("To frighten readers into accepting his religion", "为了吓唬读者接受他的宗教"),
          ],
          t(
            "The third paragraph says Descartes did not believe the spirit existed but used it as a test to find whether anything could survive the most extreme doubt.",
            "第三段说笛卡尔并不相信这个精灵存在，而是用它来检验是否有任何东西能经受住最极端的怀疑。",
          ),
        ),
        ask(
          t("Why could the spirit not deceive Descartes about his own existence?", "为什么那个精灵无法在笛卡尔自身的存在上欺骗他？"),
          t("To be deceived at all, he had to exist as something that thinks", "要被欺骗，他首先必须作为一个思考者而存在"),
          [
            t("The spirit had promised not to deceive him about that", "那个精灵答应过不在这件事上欺骗他"),
            t("He could see his own body clearly in a mirror", "他能在镜子里清楚地看到自己的身体"),
            t("His teachers had all agreed that he existed", "他的老师们都同意他存在"),
          ],
          t(
            "The fourth paragraph says that to be deceived he must be something that thinks, so he could not be deceived into thinking he existed if he did not.",
            "第四段说要被欺骗，他必须是一个思考的东西，所以他不可能在不存在时被骗以为自己存在。",
          ),
        ),
        ask(
          t("What does the writer suggest about Descartes's attempt to rebuild his knowledge?", "作者对笛卡尔重建知识的尝试有什么看法？"),
          t("Many readers find it less convincing than his method of doubt", "许多读者认为它不如他的怀疑方法有说服力"),
          [
            t("Every philosopher since has accepted it completely", "此后的每位哲学家都完全接受了它"),
            t("It was the part of his work that changed philosophy most", "它是他著作中最改变哲学的部分"),
            t("It proved that the mind and the body are the same thing", "它证明了心灵和身体是同一种东西"),
          ],
          t(
            "The fifth paragraph says many readers have found the rebuilding far less convincing than the doubt that came before it.",
            "第五段说许多读者认为这种重建远不如之前的怀疑有说服力。",
          ),
        ),
      ],
      ["René", "Descartes", "Descartes's", "Meditations", "Latin", "French", "Europe", "Germany", "God"],
    ),
    passage(
      "the-ring-that-made-men-invisible",
      t("The Ring That Made Men Invisible", "让人隐身的戒指"),
      `In the Republic, written by the Greek philosopher Plato about twenty-four centuries ago, a young man named Glaucon tells a story. A shepherd named Gyges, working in the hills of Lydia, finds a gold ring after an earthquake opens the ground. He puts it on and discovers by chance that when he turns the ring on his finger, he becomes invisible. Gyges uses his new power at once. He goes to the palace, seduces the queen, kills the king and takes the throne.

Glaucon is not interested in the story for its own sake. He uses it to make an argument. Most people, he says, are just only because they fear being caught. Justice is a bargain that the weak make with each other: I will not harm you if you do not harm me. But suppose a just man and an unjust man were each given a ring like Gyges's. Glaucon claims that the just man would soon behave exactly like the unjust one, taking what he wanted, because no one would ever know. If that is true, then nobody values justice for itself; we value only its rewards and the safety it brings.

The story is a thought experiment. It removes one feature of real life, the chance of being seen, and asks what is left. If people would do wrong whenever they could get away with it, then their good behavior was never more than a disguise. Glaucon even goes further. He asks his listeners to imagine a perfectly unjust man who has the reputation of being just, and a perfectly just man who is thought to be wicked and is punished for it. Which of them, he asks, is happier?

The rest of the Republic is Plato's long attempt to answer the challenge. He argues that justice is a kind of health of the soul, a harmony among its parts, and that an unjust person, however rich and powerful, is inwardly at war with himself. Not every reader is persuaded.

But the ring has outlasted the argument. It is a simple way to ask a question that each person can put to himself or herself: what would I do if no one could ever see me? A person who would act the same either way is not just because of fear. Their honesty is not contingent on being watched.`,
      [philosophy, thought, academic11],
      [
        ask(
          t("What point does Glaucon use the story of the ring to make?", "格劳孔用戒指的故事来说明什么观点？"),
          t("People are just only because they fear being caught", "人们之所以正义，只是因为害怕被抓"),
          [
            t("A shepherd can become a good king if he is lucky", "牧羊人如果幸运，也能成为好国王"),
            t("Gold rings should be kept away from powerful people", "金戒指应该远离有权势的人"),
            t("Earthquakes reveal hidden treasures in the hills", "地震会让山里隐藏的宝藏露出来"),
          ],
          t(
            "The second paragraph says Glaucon argues that most people are just only because they fear being caught, and that no one values justice for itself.",
            "第二段说格劳孔认为大多数人之所以正义只是因为害怕被抓，没有人为了正义本身而重视正义。",
          ),
        ),
        ask(
          t("What feature of real life does the thought experiment remove?", "这个思想实验去掉了现实生活中的什么特征？"),
          t("The chance of being seen", "被人看见的可能"),
          [
            t("The need to work for a living", "谋生的需要"),
            t("The fear of earthquakes", "对地震的恐惧"),
            t("The power of kings over shepherds", "国王对牧羊人的权力"),
          ],
          t(
            "The third paragraph says the story removes one feature of real life, the chance of being seen, and asks what is left.",
            "第三段说这个故事去掉了现实生活的一个特征，即被人看见的可能，然后问剩下了什么。",
          ),
        ),
        ask(
          t(
            'What does the last sentence mean by "Their honesty is not contingent on being watched"?',
            "最后一句“他们的诚实并不取决于是否被人注视”是什么意思？",
          ),
          t("They would be honest whether or not anyone could see them", "不管有没有人看得见，他们都会诚实"),
          [
            t("They are honest only when someone is watching them", "他们只有在有人注视时才诚实"),
            t("They do not care whether they are honest or not", "他们不在乎自己是否诚实"),
            t("They watch other people to make sure they are honest", "他们注视别人以确保别人诚实"),
          ],
          t(
            "The last paragraph says a person who would act the same either way is not just because of fear, so their honesty does not depend on being seen.",
            "最后一段说一个无论如何都会同样行事的人并非出于恐惧而正义，所以他的诚实不取决于被看见。",
          ),
        ),
      ],
      ["Gyges", "Gyges's", "Plato", "Plato's", "Republic", "Glaucon", "Lydia", "Greek"],
    ),
    passage(
      "the-sunrise-that-may-not-come",
      t("The Sunrise That May Not Come", "也许不会到来的日出"),
      `Every morning of your life, the sun has risen. You are confident that it will rise tomorrow. But why? The Scottish philosopher David Hume, writing in the 1740s, asked this question and gave an answer that philosophers have struggled with ever since.

Hume was an empiricist: he believed that all our knowledge of the world comes from experience. Some things we know simply by thinking, such as that a triangle has three sides. But that the sun will rise, that bread will nourish us or that fire will burn cannot be known by thinking alone. We expect them because we have seen them happen many times. We reason from what has happened to what will happen. This kind of reasoning is called induction.

Hume asked what justifies it. To reason from the past to the future, we must assume that the future will resemble the past, that nature is uniform. But how do we know that nature is uniform? Only, it seems, because in the past it always has been. That is, we justify induction by using induction. The argument goes in a circle. Hume concluded that our expectation that the future will resemble the past is not, in the end, a product of reason. It is a habit of the mind, formed by repetition.

The philosopher Bertrand Russell later made the point with a story. A chicken is fed by a farmer every morning. Each day the chicken's confidence grows that the farmer's arrival means food. Then one morning the farmer comes and wrings its neck. The chicken's reasoning was the same as ours. It simply ran out of luck.

Hume did not tell people to stop expecting the sun to rise. He thought that would be impossible, and he admitted that he himself forgot his doubts as soon as he left his study to dine and play games with his friends. Nature, he said, is too strong for such doubts. His point was rather that the beliefs we hold most firmly are not as well founded as we think.

Scientists rely on induction every day, and science works remarkably well. Some philosophers argue that this success is reason enough. Others reply that pointing to past success is induction once more. The circle Hume found has never been broken. It may simply be the price of living in a world we learn about only by experience.`,
      [philosophy, belief, thought, academic10],
      [
        ask(
          t('Why does Hume say that the argument for induction "goes in a circle"?', "为什么休谟说为归纳辩护的论证“是一个循环”？"),
          t(
            "We justify the belief that nature is uniform by using past experience, which is induction again",
            "我们用过去的经验来证明自然是一致的，而这本身又是归纳",
          ),
          [
            t("Scientists repeat the same experiments again and again", "科学家一次又一次地重复同样的实验"),
            t("The sun moves in a circle around the earth every day", "太阳每天绕着地球转一圈"),
            t("Philosophers keep returning to the same old books", "哲学家不断回到同样的旧书中"),
          ],
          t(
            "The third paragraph says we know nature is uniform only because it always has been, so we justify induction by using induction.",
            "第三段说我们只因为自然一直如此才知道它是一致的，所以我们是用归纳来证明归纳。",
          ),
        ),
        ask(
          t("What does Russell's story of the chicken show?", "罗素关于鸡的故事说明了什么？"),
          t("Confidence built on past experience can still turn out to be wrong", "建立在过去经验之上的信心仍然可能被证明是错的"),
          [
            t("Farmers should not be trusted to feed their animals", "不应相信农民会喂养他们的动物"),
            t("Chickens are less intelligent than human beings", "鸡没有人类聪明"),
            t("Food is the only thing that animals learn to expect", "食物是动物唯一学会期待的东西"),
          ],
          t(
            "The fourth paragraph says the chicken's reasoning was the same as ours, growing more confident each day, until one day it was wrong.",
            "第四段说鸡的推理和我们一样，一天比一天更有信心，直到有一天错了。",
          ),
        ),
        ask(
          t("How did Hume himself respond to his own doubts in daily life?", "休谟本人在日常生活中如何对待自己的怀疑？"),
          t("He forgot them when he left his study to be with friends", "他离开书房和朋友相处时就把它们忘了"),
          [
            t("He refused to eat because he could not trust bread", "他因为不能信任面包而拒绝吃东西"),
            t("He stayed indoors every morning in case the sun did not rise", "他每天早上都待在屋里，以防太阳不升起"),
            t("He gave up philosophy and became a scientist", "他放弃了哲学，成了一名科学家"),
          ],
          t(
            "The fifth paragraph says he admitted that he forgot his doubts as soon as he left his study to dine and play games with friends.",
            "第五段说他承认，一离开书房去和朋友吃饭、玩游戏，他就忘了自己的怀疑。",
          ),
        ),
      ],
      ["David", "Hume", "Hume's", "Scotland", "Scottish", "Bertrand", "Russell", "Russell's"],
    ),
    passage(
      "two-views-of-human-nature",
      t("Two Views of Human Nature", "人性的两种看法"),
      `About twenty-three centuries ago, during the Warring States period of China, two followers of Confucius disagreed about a question that still divides people today: are human beings born good or bad?

Mencius argued that human nature is good. His most famous argument is a thought experiment. Imagine, he said, that anyone suddenly sees a small child about to fall into a well. That person will feel alarm and pity at once. The feeling does not come from wanting to win the parents' friendship, or to be praised by neighbors, or from disliking the child's cry. It is simply there. Mencius called such feelings sprouts. Everyone has the sprout of kindness, the sprout of shame at doing wrong, the sprout of respect and the sprout of knowing right from wrong. If people do evil, it is because their sprouts have been neglected or crushed, as trees on a hill are cut and grazed until the hill looks as if it had never grown anything.

Xunzi, who lived a few decades later, thought this view was dangerously optimistic. Human nature is bad, he wrote; goodness is the result of conscious effort. People are born loving profit, feeling envy and desiring pleasure. Left to themselves, they will fight over what they want. Goodness is like a straight board made from crooked wood: it must be steamed and bent. The tools for this work are education, ritual and the example of wise teachers. A person becomes good only by long practice, and a society is orderly only when it trains its people.

The two views lead to different emphases. For Mencius, the task of education is to protect and nourish something already present. For Xunzi, it is to create something that nature did not provide. Yet the two agreed on more than their opposite slogans suggest. Both believed that anyone could become good, and both thought learning was essential. The difference lay in where goodness came from, not in whether it could be reached.

Neither view has been proved. Studies of babies and young children have found both early signs of sympathy and early signs of selfishness. Perhaps each thinker saw a real part of us. The question of which part is more fundamental, and therefore what a good upbringing should do, is as germane to parents and teachers today as it was in ancient China.`,
      [philosophy, belief, academic11],
      [
        ask(
          t("What is the point of Mencius's example of the child at the well?", "孟子关于井边孩子的例子要说明什么？"),
          t("People feel pity at once, without any selfish reason", "人会立刻产生怜悯，而没有任何自私的理由"),
          [
            t("Parents should never let children play near wells", "父母决不应让孩子在井边玩耍"),
            t("Neighbors will praise anyone who saves a child", "邻居会称赞任何救孩子的人"),
            t("Children are born knowing right from wrong", "孩子生来就知道是非对错"),
          ],
          t(
            "The second paragraph says the feeling of alarm and pity does not come from wanting friendship or praise but is simply there, which shows human nature is good.",
            "第二段说惊恐和怜悯的感受并非出于想得到友谊或称赞，而是自然存在，这说明人性是善的。",
          ),
        ),
        ask(
          t("What does Xunzi's image of the crooked wood mean?", "荀子关于弯曲木头的比喻是什么意思？"),
          t("Goodness must be made through effort and training, against nature", "善必须通过努力和训练违背本性地造就出来"),
          [
            t("Wood is the best material for building schools", "木头是建造学校的最好材料"),
            t("People are naturally straight and good like a board", "人天生就像木板一样正直善良"),
            t("Teachers should punish crooked students with sticks", "老师应该用棍子惩罚品行不正的学生"),
          ],
          t(
            "The third paragraph says goodness is like a straight board made from crooked wood that must be steamed and bent, through education, ritual and example.",
            "第三段说善就像用弯曲的木头做成的直板，必须经过蒸烤和弯折，即教育、礼仪和榜样。",
          ),
        ),
        ask(
          t("On what did Mencius and Xunzi agree, according to the passage?", "根据文章，孟子和荀子在什么问题上意见一致？"),
          t("That anyone could become good and that learning was essential", "任何人都能成为好人，而且学习至关重要"),
          [
            t("That human nature is bad from birth", "人性生来就是恶的"),
            t("That ritual is useless for training people", "礼仪对训练人毫无用处"),
            t("That babies show only signs of selfishness", "婴儿只表现出自私的迹象"),
          ],
          t(
            "The fourth paragraph says both believed that anyone could become good and both thought learning was essential.",
            "第四段说两人都相信任何人都能成为好人，也都认为学习至关重要。",
          ),
        ),
      ],
      ["Mencius", "Xunzi", "Xunzi's", "Confucius", "Mencius's", "China", "Chinese", "Warring", "States"],
    ),
    passage(
      "the-machine-of-pleasure",
      t("The Machine of Pleasure", "快乐机器"),
      `In 1974, the American philosopher Robert Nozick proposed a machine. Suppose, he wrote, that scientists could plug your brain into a device that would give you any experiences you wanted. You could feel that you were writing a great novel, falling in love, or climbing a mountain. All the time you would be floating in a tank, with wires attached to your head, but you would not know it. Inside, everything would seem perfectly real. Should you plug in for life?

Nozick's question was aimed at a particular view: hedonism, the claim that pleasure is the only thing that is good in itself, and that a life goes well to the degree that it contains pleasant experiences. Utilitarianism, in its classic form, built its idea of the good on this view. If hedonism is right, the machine offers the best possible life. It would be irrational to refuse.

Yet most people, when they think about it, say they would not plug in. Nozick suggested reasons. First, we want to actually do certain things, not just have the experience of doing them. Second, we want to be a certain kind of person, brave or kind or wise, and a body floating in a tank is not any kind of person at all. Third, the machine limits us to a world that people have made; we want contact with a deeper reality. If these reasons are right, then something matters to us besides how our lives feel from the inside.

Defenders of hedonism have replied in several ways. Some say people refuse the machine only because they distrust it or fear for those they would leave behind; if those worries were removed, more would plug in. Others point out that people's answers change when the question is turned around. If you were told that your life so far had been in a machine, would you choose to unplug and return to a harder real world? Many people say no. Perhaps, then, our refusal reflects habit rather than a deep principle.

The experiment does not settle the matter. What it does is make an abstract question concrete. It asks each of us to say what, besides feeling good, we want from a life, and whether we would give up any pleasure in exchange for truth.`,
      [philosophy, thought, academic10],
      [
        ask(
          t("Which view was Nozick's machine meant to test?", "诺齐克的机器旨在检验哪种观点？"),
          t("The view that pleasure is the only thing good in itself", "快乐是唯一本身就好的东西这一观点"),
          [
            t("The view that machines will one day replace human beings", "机器有一天会取代人类这一观点"),
            t("The view that people should climb mountains for exercise", "人们应该为锻炼而爬山这一观点"),
            t("The view that scientists should not study the brain", "科学家不应研究大脑这一观点"),
          ],
          t(
            "The second paragraph says the question was aimed at hedonism, the claim that pleasure is the only thing good in itself.",
            "第二段说这个问题针对的是享乐主义，即快乐是唯一本身就好的东西这一主张。",
          ),
        ),
        ask(
          t("What does it suggest if most people refuse to plug in?", "如果大多数人拒绝接入机器，这说明了什么？"),
          t("Something besides how life feels matters to us", "除了生活的感受之外，还有别的东西对我们很重要"),
          [
            t("People do not enjoy pleasant experiences at all", "人们根本不喜欢愉快的经历"),
            t("The machine would be too expensive to build", "这种机器造价太高"),
            t("Most people do not understand the question", "大多数人不理解这个问题"),
          ],
          t(
            "The third paragraph says that if Nozick's reasons are right, something matters to us besides how our lives feel from the inside.",
            "第三段说如果诺齐克的理由是对的，那么除了生活内在的感受之外，还有别的东西对我们很重要。",
          ),
        ),
        ask(
          t("Why do defenders of hedonism mention the reversed question?", "享乐主义的辩护者为什么提到反过来的问题？"),
          t("Many would not unplug, suggesting the refusal reflects habit", "许多人不愿断开，这表明拒绝可能出于习惯"),
          [
            t("It proves that the machine already exists", "它证明了这种机器已经存在"),
            t("It shows that real life is always more pleasant", "它表明现实生活总是更愉快"),
            t("It means that Nozick changed his mind about hedonism", "它意味着诺齐克改变了对享乐主义的看法"),
          ],
          t(
            "The fourth paragraph says many people would not choose to unplug, so our refusal may reflect habit rather than a deep principle.",
            "第四段说许多人不会选择断开，所以我们的拒绝可能反映的是习惯，而不是深层的原则。",
          ),
        ),
      ],
      ["Robert", "Nozick", "Nozick's", "Anarchy", "State", "Utopia", "American"],
    ),
    passage(
      "the-veil-of-ignorance",
      t("The Veil of Ignorance", "无知之幕"),
      `Imagine that you and a group of strangers have been asked to design the rules of a new society: who will own what, how jobs will be given out, what the schools and hospitals will provide. There is one condition. None of you knows what place you will have in that society. You do not know whether you will be rich or poor, healthy or sick, talented or ordinary, or which religion or race you will belong to. What rules would you choose?

This is the thought experiment at the heart of A Theory of Justice, published in 1971 by the American philosopher John Rawls. He called the condition the "veil of ignorance." Behind it, Rawls argued, people would choose fair rules, because no one could design the rules to favor himself. A rich person could not argue for low taxes on the rich, because he would not know whether he was rich.

Rawls believed that people behind the veil would agree on two principles. First, each person would have the same basic liberties: freedom of speech, of belief and of conscience, and the right to take part in government. Second, inequalities of wealth and position would be allowed only if they were open to all on equal terms and if they made the least advantaged members of society better off. A doctor might be paid more than others, for example, but only if that arrangement worked, in the end, to the benefit of the worst off.

Why would people choose this second principle? Because, Rawls argued, when the stakes are your whole life and you do not know your chances, it is reasonable to make sure that the worst position is as good as possible. You might end up there.

Critics answered from many sides. Some argued that people might gamble instead, choosing a society with greater rewards and greater risks. Robert Nozick, Rawls's colleague, argued that justice concerns how wealth was gained, not how it is divided, and that taxing people to help others can violate their rights.

The debate continues. But the veil itself has become a common tool. Whenever people ask whether a rule is fair, they can ask whether they would accept it without knowing which side of it they would be on. The question is predicated on a simple idea: that a fair rule is one you could defend to anyone.`,
      [philosophy, thought, academic11],
      [
        ask(
          t(
            "Why would people behind the veil of ignorance choose fair rules, according to Rawls?",
            "罗尔斯认为，处于无知之幕后的人为什么会选择公平的规则？",
          ),
          t("No one could design the rules to favor their own position", "没有人能把规则设计得对自己的位置有利"),
          [
            t("They would all be rich and healthy", "他们都会富有而健康"),
            t("A judge would force them to be fair", "一位法官会强迫他们公平"),
            t("They would share the same religion", "他们会有相同的宗教信仰"),
          ],
          t(
            "The second paragraph says no one could design the rules to favor himself because no one would know his place.",
            "第二段说没有人能设计出有利于自己的规则，因为没有人知道自己的位置。",
          ),
        ),
        ask(
          t("When does Rawls's second principle allow inequality?", "罗尔斯的第二条原则在什么情况下允许不平等？"),
          t("When positions are open to all and the worst off benefit", "当职位向所有人开放并且最不利者能从中受益时"),
          [
            t("When the rich vote to keep their wealth", "当富人投票保留自己的财富时"),
            t("When some people work harder than others", "当有些人比别人工作更努力时"),
            t("When doctors ask to be paid more", "当医生要求更高的报酬时"),
          ],
          t(
            "The third paragraph says inequalities are allowed only if they are open to all on equal terms and make the least advantaged better off.",
            "第三段说只有当不平等以平等条件向所有人开放并使最不利者受益时，才被允许。",
          ),
        ),
        ask(
          t("What objection does the passage say some critics raised?", "文章说一些批评者提出了什么反对意见？"),
          t("People might gamble on a society with bigger rewards and risks", "人们可能会赌一个回报和风险都更大的社会"),
          [
            t("The veil of ignorance would make people forget their names", "无知之幕会让人忘记自己的名字"),
            t("No one would agree to meet strangers at all", "没有人会同意与陌生人见面"),
            t("Freedom of speech is not a basic liberty", "言论自由不是一项基本自由"),
          ],
          t(
            "The fifth paragraph says some critics argued that people might gamble instead, choosing greater rewards and greater risks.",
            "第五段说一些批评者认为人们可能会冒险，选择更大回报和更大风险的社会。",
          ),
        ),
      ],
      ["John", "Rawls", "Rawls's", "Theory", "Justice", "American", "Robert", "Nozick"],
    ),
    passage(
      "the-scientist-in-the-black-and-white-room",
      t("The Scientist in the Black and White Room", "黑白房间里的科学家"),
      `Mary is a brilliant scientist. For reasons no one explains, she has spent her whole life in a room where everything is black, white or gray. She has learned about the world through black and white books and a black and white television screen. Her specialty is the science of vision, and she knows everything there is to know about it: how light of different wavelengths strikes the eye, how signals travel to the brain, and what happens in the brain when a person sees a ripe tomato and says "red." Then one day the door opens, and Mary walks outside and sees a red rose for the first time. Does she learn anything new?

The story was published in 1982 by the Australian philosopher Frank Jackson. He meant it as an argument against materialism, the view that everything that exists, including the mind, is physical and can be fully described by physical science. Mary, by hypothesis, knows all the physical facts about color vision. If she learns something new when she sees red, Jackson argued, then there must be facts that are not physical: facts about what it is like to have an experience. Materialism would then be incomplete.

Most people's first answer is that of course Mary learns something. She learns what red looks like. But materialists have offered replies. Some say that Mary does not learn a new fact but gains a new ability: the ability to recognize, imagine and remember red. Others say she learns an old fact in a new way, as a person who knows that a city is called Beijing in Chinese and Peking in an old English spelling may learn that the two names refer to the same place. Still others deny that anyone could truly know all the physical facts without already knowing what red is like.

Remarkably, Jackson himself later changed his mind. He came to think that the argument was mistaken and that materialism was correct, though he admitted that it was hard to explain where the argument went wrong.

The case is an example of how a thought experiment works. It does not report a real event; no one could live as Mary does. It isolates one question, whether physical knowledge is all the knowledge there is, and asks our intuition to answer it. Whether that intuition can be trusted is itself part of the debate.`,
      [philosophy, thought, academic10],
      [
        ask(
          t("Why did Jackson tell the story of Mary?", "杰克逊为什么讲玛丽的故事？"),
          t("To argue that physical facts may not be all the facts there are", "为了论证物理事实可能并不是全部事实"),
          [
            t("To show that scientists should spend more time outdoors", "为了说明科学家应该多花时间在户外"),
            t("To explain how light of different colors strikes the eye", "为了解释不同颜色的光如何照射眼睛"),
            t("To prove that black and white books are useless", "为了证明黑白书籍毫无用处"),
          ],
          t(
            "The second paragraph says Jackson meant it as an argument against materialism: if Mary learns something new, there must be facts that are not physical.",
            "第二段说杰克逊用它来反驳唯物主义：如果玛丽学到了新东西，那么一定存在非物理的事实。",
          ),
        ),
        ask(
          t('What is the "new ability" reply to the argument?', "对这一论证的“新能力”回应是什么？"),
          t("Mary gains the ability to recognize and imagine red, not a new fact", "玛丽获得的是辨认和想象红色的能力，而不是新的事实"),
          [
            t("Mary gains the ability to see in the dark", "玛丽获得了在黑暗中看东西的能力"),
            t("Mary learns to read books in color", "玛丽学会了阅读彩色书籍"),
            t("Mary becomes able to leave the room whenever she likes", "玛丽能够随时离开房间"),
          ],
          t(
            "The third paragraph says some materialists reply that Mary does not learn a new fact but gains the ability to recognize, imagine and remember red.",
            "第三段说一些唯物主义者回应说，玛丽没有学到新事实，而是获得了辨认、想象和记住红色的能力。",
          ),
        ),
        ask(
          t("What is surprising about Jackson's own view later on?", "杰克逊后来的观点有什么令人意外之处？"),
          t("He came to believe his own argument was mistaken", "他开始相信自己的论证是错误的"),
          [
            t("He proved that Mary was a real person", "他证明了玛丽是一个真实的人"),
            t("He refused to discuss the argument ever again", "他再也不肯讨论这个论证"),
            t("He decided that no one can see the color red", "他认为没有人能看见红色"),
          ],
          t(
            "The fourth paragraph says Jackson later changed his mind and came to think the argument was mistaken and materialism correct.",
            "第四段说杰克逊后来改变了想法，认为这个论证是错的，唯物主义是对的。",
          ),
        ),
      ],
      ["Frank", "Jackson", "Jackson's", "Mary", "Mary's", "Australian", "Beijing", "Peking", "Chinese", "English"],
    ),
    passage(
      "the-runaway-trolley",
      t("The Runaway Trolley", "失控的电车"),
      `A trolley, a kind of tram, is rolling down a track with no one able to stop it. Ahead of it, five workers are on the track and will be killed. You are standing beside a switch. If you pull it, the trolley will turn onto a side track, where one worker is standing. That one will die instead. Should you pull the switch?

The British philosopher Philippa Foot described a version of this case in 1967, and the American philosopher Judith Jarvis Thomson later gave it the name the "trolley problem." When people are asked, most say that pulling the switch is permissible, and many say it is required. Five lives are more than one.

Thomson then changed the case. This time you are standing on a bridge over the track. The trolley is again rushing toward five workers. Next to you stands a very large man. If you push him off the bridge, his body will stop the trolley. He will die, but the five will be saved. Should you push?

Most people say no, and many feel that pushing would be monstrous. Yet the numbers are the same: one dies so that five may live. If a simple utilitarian rule, choose whatever saves the most lives, were the whole of morality, the two cases would be alike. Something in our judgment treats them differently.

Philosophers have proposed many explanations. One is that in the first case the death of the one is a side effect of saving the five, while in the second the man is used as a means, like a tool. Another is that there is a moral difference between redirecting a harm that already exists and creating a new one with your own hands. Each explanation runs into further cases that seem to break it, and the debate has produced hundreds of variations.

Some people dismiss trolley problems as silly, since no one faces such choices. But versions of them arise in real decisions: in how doctors divide scarce medicines, how governments plan for disasters, and how engineers program cars that drive themselves. The trolley strips these choices down to their bare structure and asks a question that is easy to state and hard to answer: is it ever right to harm one person in order to help others, and if so, how?`,
      [philosophy, belief, thought, academic11, academic3, academic2],
      [
        ask(
          t("Why does Thomson's bridge case matter to the argument?", "汤姆森的天桥案例为什么对论证很重要？"),
          t("The numbers are the same, yet most people judge it differently", "数字相同，大多数人却作出不同的判断"),
          [
            t("It shows that bridges are more dangerous than tracks", "它表明桥比轨道更危险"),
            t("It proves that no one should work on trolley tracks", "它证明了没有人应该在电车轨道上工作"),
            t("It shows that the large man was responsible for the trolley", "它表明那个大个子要为电车负责"),
          ],
          t(
            "The fourth paragraph says that in both cases one dies so five may live, yet most people say no to pushing, so our judgment treats them differently.",
            "第四段说两种情况都是一人死而五人活，但大多数人反对推人，所以我们的判断对它们区别对待。",
          ),
        ),
        ask(
          t('What is the "means" explanation of the difference between the cases?', "关于两种情况差异的“手段”解释是什么？"),
          t("In the bridge case the man is used like a tool to stop the trolley", "在天桥案例中，那个人被当作工具来阻止电车"),
          [
            t("In the switch case the worker chose to stand on the side track", "在扳道岔案例中，那个工人自己选择站在支线上"),
            t("In the bridge case the trolley is moving much faster", "在天桥案例中电车开得快得多"),
            t("In the switch case no one actually dies at all", "在扳道岔案例中其实没有人死"),
          ],
          t(
            "The fifth paragraph says in the first case the death is a side effect, while in the second the man is used as a means, like a tool.",
            "第五段说在第一种情况下，死亡是副作用，而在第二种情况下，那个人被当作手段，像工具一样。",
          ),
        ),
        ask(
          t("Why does the writer say trolley problems are not simply silly?", "作者为什么说电车难题并不只是荒唐的？"),
          t(
            "Versions of them arise in real choices about medicine, disasters and cars",
            "它们的变体出现在关于医药、灾难和汽车的真实抉择中",
          ),
          [
            t("Many people really do stand beside trolley switches every day", "很多人确实每天都站在电车道岔旁"),
            t("They were invented by engineers who build trolleys", "它们是由制造电车的工程师发明的"),
            t("They have a single correct answer that everyone accepts", "它们有一个人人都接受的正确答案"),
          ],
          t(
            "The last paragraph says versions arise in how doctors divide medicines, how governments plan for disasters and how engineers program cars.",
            "最后一段说它们的变体出现在医生分配药物、政府规划救灾和工程师为汽车编程等问题中。",
          ),
        ),
      ],
      ["Philippa", "Foot", "Foot's", "Judith", "Jarvis", "Thomson", "Thomson's", "British", "American"],
    ),
  ],
};
