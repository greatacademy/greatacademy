// The informational texts of the Gaokao's reading of modern texts: arguments and expositions written for the subject,
// each with two questions on what it says, two on how it reasons, and two to answer in a few sentences.

import { t } from "@ga/content";

import type { ModernPassage } from "./modern.ts";

/** informationalPassages are the informational texts of the Gaokao's reading of modern texts, written for the subject. */
export const informationalPassages: readonly ModernPassage[] = [
  {
    title: "误差里的发现",
    body: `说起科学测量，人们往往希望得到一个“准确无误”的数字。可是，任何一次真实的测量都不可能绝对准确。尺子的刻度有粗细，仪器的反应有快慢，读数的人眼睛会疲劳，环境的温度和气流也在悄悄变化。测得的数值与真实的数值之间，总会存在或大或小的差距，这就是误差。误差不同于错误：错误是本可以避免的失误，比如看错刻度、记错数字；误差却是测量本身无法完全消除的伴随者。

既然误差无法消除，科学家为什么还能相信自己的测量？关键在于，他们不是假装误差不存在，而是想办法认识它、估计它、控制它。一种常见的做法是重复测量。同一个量测上许多次，每次的结果会有细小的差别，但这些差别往往有偏大也有偏小，取平均值后，偶然因素的影响就会相互抵消一部分。另一种做法是改进仪器和方法，使误差变得更小。比如用秒表测量单摆摆动一次的时间，人按下按钮总有快慢，误差相对较大；如果测量摆动三十次的总时间再求平均，人的反应带来的误差就被分摊到每一次上，结果会准确得多。还有一种更重要的做法，是在报告结果时如实写出误差的范围，告诉别人：真实的数值大概落在哪里，这个结论有多大的把握。

误差有两类，需要区别对待。一类是偶然误差，它时大时小、时正时负，靠多次测量取平均可以减小；另一类是系统误差，它总朝同一个方向偏，比如用一把本身就短了一点的尺子去量，无论量多少次，结果都会偏大。系统误差不能靠重复来消除，只能靠找出原因、校正仪器来解决。一个只会机械重复而不追问原因的人，可能把同一个偏差重复一百次，还以为自己的结果十分可靠。

更有意思的是，误差不仅是需要控制的对象，有时还是发现的入口。当测量结果与理论预言之间出现差距时，科学家首先要问：这个差距是否超出了误差的范围？如果没有超出，就不能轻易说理论错了；如果明显超出，就说明背后可能藏着尚未认识的东西。十七世纪初，开普勒研究火星的运动，他所依据的观测数据与按圆形轨道计算的结果之间相差约八角分。这个差距很小，但他相信这些观测足够精密，不应把它归为误差。正是对这八角分的认真对待，使他放弃了沿袭已久的圆形轨道设想，最终得出行星沿椭圆轨道运行的结论。

由此可见，对待误差的态度，正体现了科学的品格。把误差当作耻辱而加以掩盖，是不诚实的；把一切不符合预期的结果都推给误差，又是懒惰的。真正的科学态度是：既承认认识总有局限，又不放过任何一个值得追问的差距。一个标明了误差范围的结论，看上去不如“绝对准确”那样有气势，却更值得信赖，因为它清楚地说明了自己知道什么、不知道什么。

对于学习科学的人来说，学会面对误差也是一种重要的训练。做实验时，结果和课本上的数值不完全一样，并不一定意味着实验失败；重要的是分析差距从何而来，是偶然的波动，还是方法上的偏差。与其悄悄修改数据去“凑”出标准答案，不如如实记录，认真找出原因。养成这样的习惯，人在面对其他问题时，也会更加谨慎而诚实：既不轻信一个看似完美的数字，也不轻易放过一个看似微小的差距。`,
    understanding: [
      {
        ask: "下列关于原文内容的理解和分析，正确的一项是",
        right: "系统误差总朝同一方向偏离，单靠重复测量不能消除，需要找出原因、校正仪器",
        wrong: [
          "误差和错误一样，只要测量的人足够细心，都是可以完全避免的",
          "多次测量取平均值，可以使偶然误差和系统误差全部相互抵消",
          "测量结果与理论预言一旦出现差距，就说明理论中藏着未知的问题",
        ],
        ground: "系统误差不能靠重复来消除，只能靠找出原因、校正仪器来解决。",
        reasons: [
          t(
            "Confuses two terms: paragraph 1 says mistakes can be avoided but error cannot be wholly removed; the option makes them the same.",
            "混淆概念：第一段说错误“本可以避免”，误差却“是测量本身无法完全消除的伴随者”，选项把误差和错误说成了一样。",
          ),
          t(
            "Widens the scope: averaging helps only random error, and only “in part”; paragraph 3 says systematic error is not removed by repetition.",
            "扩大范围：取平均只对偶然误差有效，而且只抵消“一部分”；第三段明说系统误差“不能靠重复来消除”。",
          ),
          t(
            "Drops a condition: paragraph 4 first asks whether the gap exceeds the error; if not, the theory is not to be blamed.",
            "漏掉条件：第四段说先要问差距是否超出误差范围，没有超出就“不能轻易说理论错了”，选项把有条件的判断说成了无条件。",
          ),
        ],
        check: t(
          "Check against the end of paragraph 3: someone who only repeats may repeat one bias a hundred times and think it reliable, a warning that would make no sense if repetition removed systematic error.",
          "用第三段末句再对：只会机械重复而不追问原因的人，会把同一个偏差重复一百次还以为可靠；要是重复能消除系统误差，这句警告就无从说起。",
        ),
      },
      {
        ask: "下列对原文内容的理解，正确的一项是",
        right: "作者认为，标明误差范围的结论更可信，因为它说清了自己知道什么、不知道什么",
        wrong: [
          "开普勒认为八角分的差距属于误差范围，因而坚持了圆形轨道的设想",
          "作者认为，把不符合预期的结果都推给误差，是一种不诚实的做法",
          "实验结果与课本上的数值不一致，说明实验方法上一定存在偏差",
        ],
        ground: "一个标明了误差范围的结论，看上去不如“绝对准确”那样有气势，却更值得信赖，因为它清楚地说明了自己知道什么、不知道什么。",
        reasons: [
          t(
            "The reverse of the text: Kepler would not call it error, and so gave up circular orbits.",
            "与原文相反：第四段说开普勒认为“不应把它归为误差”，正因此放弃了圆形轨道设想。",
          ),
          t(
            "Swaps the labels: hiding error is “dishonest”, blaming everything on error is “lazy”.",
            "张冠李戴：第五段说掩盖误差是“不诚实的”，把一切推给误差是“懒惰的”，选项把两种评价对调了。",
          ),
          t(
            "Turns a possibility into a certainty: the last paragraph says a mismatch may be chance or method; the option insists on method.",
            "把可能说成必然：末段说不一致“并不一定意味着实验失败”，要分析是偶然波动还是方法偏差，选项一口咬定是后者。",
          ),
        ],
        check: t(
          "Check against the end of paragraph 2: the writer calls stating the error range the more important practice, since it tells others how far to trust the result; paragraph 5 echoes it.",
          "用第二段末句再对：作者把“如实写出误差的范围”称为“更重要的做法”，因为它告诉别人这个结论有多大的把握，和第五段的判断前后呼应。",
        ),
      },
    ],
    analysis: [
      {
        ask: "下列对原文论证的相关分析，正确的一项是",
        right: "文章以开普勒研究火星运动为例，论证了误差有时可以成为科学发现的入口",
        wrong: [
          "文章开篇列举尺子、仪器等因素，意在证明测量中的错误都难以避免",
          "第三段以“短了一点的尺子”作类比，说明了偶然误差时大时小的特点",
          "第五段运用对比论证，说明掩盖误差比把结果推给误差的危害更大",
        ],
        ground: "正是对这八角分的认真对待，使他放弃了沿袭已久的圆形轨道设想，最终得出行星沿椭圆轨道运行的结论。",
        reasons: [
          t(
            "Confuses terms: the opening list shows error is unavoidable; mistakes, the text says, can be avoided.",
            "混淆概念：开篇列举尺子、仪器、读数的人和环境，说明的是误差不可避免；原文恰恰说错误“本可以避免”。",
          ),
          t(
            "Wrong target: the short ruler illustrates systematic error, not random error, and it is an example, not an analogy.",
            "张冠李戴：第三段“短了一点的尺子”说明的是系统误差总朝同一方向偏，不是偶然误差的时大时小，而且那是举例，不是类比。",
          ),
          t(
            "Invents a comparison: paragraph 5 sets the two attitudes side by side without ranking them.",
            "无中生有：第五段把掩盖误差和推给误差并列为两种不对的态度，没有比较哪一种危害更大。",
          ),
        ],
        check: t(
          "Check against the start of paragraph 4: the claim that a gap beyond the error may hide something unknown comes first, and Kepler follows to prove it.",
          "用第四段开头再对：先说差距明显超出误差范围，“背后可能藏着尚未认识的东西”，紧接着才举开普勒，可见事例是为证明误差可以成为发现的入口。",
        ),
      },
      {
        ask: "下列对文章思路的分析，正确的一项是",
        right: "文章先辨析误差与错误，再谈控制误差的方法，进而指出误差可成为发现的入口，最后落到科学态度和学习上",
        wrong: [
          "文章先提出“误差是科学发现的入口”这一中心论点，再从正反两面论证，最后以开普勒的事例总结全文",
          "文章第二段和第三段是因果关系，第二段说明误差产生的原因，第三段说明误差造成的结果",
          "文章最后一段是对前文的简单重复，强调做实验时结果必须与课本上的数值保持一致",
        ],
        ground: "更有意思的是，误差不仅是需要控制的对象，有时还是发现的入口。",
        reasons: [
          t(
            "Wrong order: the “way to discovery” comes only in paragraph 4, and so does Kepler, not at the end.",
            "顺序错乱：开篇讲的是测量不可能绝对准确、误差不同于错误，“发现的入口”到第四段才提出；开普勒的事例也在第四段，不在结尾。",
          ),
          t(
            "Wrong relation: paragraph 2 gives methods of control, paragraph 3 two kinds of error; they are not cause and effect.",
            "关系判断错：第二段讲控制误差的几种办法，第三段区分两类误差，两段不是“原因”和“结果”。",
          ),
          t(
            "Misreads: the last paragraph extends the point to learners and warns against forcing the textbook value.",
            "曲解内容：末段把话题推到学习科学的人身上，是延伸不是重复；它说的恰恰是不必凑出课本上的标准答案。",
          ),
        ],
        check: t(
          "Check by the links that open the paragraphs: “since error cannot be removed”, “more interesting still”, “it follows”, “for those learning science” follow the same order as the right option.",
          "看各段开头的关联语：“既然误差无法消除”转入控制，“更有意思的是”转入发现，“由此可见”收束为态度，“对于学习科学的人来说”落到学习，顺序和正确选项一致。",
        ),
      },
    ],
    answers: [
      {
        ask: "根据原文，科学家是怎样对待测量中的误差的？请简要概括。",
        model:
          "①承认误差存在，不假装测量绝对准确；②重复测量取平均值，减小偶然误差；③改进仪器和方法，找出原因、校正仪器，解决系统误差；④报告结果时如实写明误差范围；⑤认真追问明显超出误差范围的差距。",
      },
      {
        ask: "文章说误差“有时还是发现的入口”，请结合开普勒的例子简要分析。",
        model:
          "测量与理论的差距明显超出误差范围时，往往说明背后藏着未被认识的东西。开普勒相信观测足够精密，没有把火星观测与圆形轨道计算之间约八角分的差距归为误差，而是认真追问，因而放弃圆形轨道设想，得出行星沿椭圆轨道运行的结论。",
      },
    ],
  },
  {
    title: "被推荐的世界",
    body: `打开手机上的新闻或视频应用，人们常常发现，屏幕上出现的内容越来越合自己的口味：喜欢看篮球的，推送里篮球越来越多；爱看美食的，美食视频一条接着一条。这背后是推荐算法在工作。它记录用户点开了什么、停留了多久、点赞了什么，据此推测用户的兴趣，再从海量信息中挑出“你可能喜欢”的内容。

应当承认，推荐算法解决了一个真实的问题。今天的信息多到任何人都无法一一浏览，如果没有筛选，人们很容易淹没在信息的洪流里。算法替人完成了一部分筛选工作，节省了寻找的时间，也让许多原本不容易被看到的作品找到了自己的读者。对一个想要了解某个专门领域的人来说，持续而集中的推荐，有时能帮助他较快地入门。从这个角度看，推荐算法就像一位熟悉读者口味的店员，能在琳琅满目的货架前替人省去不少工夫。

然而，便利的背后也隐藏着值得警惕的倾向。算法推荐的依据，主要是一个人过去的选择。它擅长回答“你曾经喜欢什么”，却不太擅长回答“你还可能需要什么”。一个人点开某类内容越多，这类内容就推送得越多；推送得越多，他点开得也越多。如此循环，他看到的世界可能越来越窄，而他自己未必察觉。人们有时用“信息茧房”来形容这种状态：每个人都住在用自己的喜好织成的茧里，舒适、熟悉，却很少接触不同的东西。

视野变窄的影响，不只在于少知道一些事情。阅读的意义之一，在于遇见意料之外的东西：一本原本不打算读的书，一种与自己不同的观点，一个陌生领域里的有趣问题。这些“意外”常常让人跳出原有的想法，重新审视自己。如果一个人接触的总是与自己想法一致的内容，他的看法就容易在不断的重复中变得固执，面对不同意见时也更难以平心静气地倾听和思考。一个社会需要成员之间彼此理解、相互讨论，而这种理解，正是建立在愿意了解不同看法的基础之上的。

那么，是不是应该拒绝推荐算法呢？恐怕也不必。问题不在于工具本身，而在于人怎样使用工具。算法是根据人的行为来推荐的，人改变了自己的选择，推荐的结果也会随之改变。一个有意识的读者，可以主动搜索自己不熟悉的话题，可以有计划地阅读整本的经典著作，也可以多去图书馆和书店，在书架之间随意翻看。这些做法，都是在算法之外为自己保留一扇窗。

对于正在成长的青少年来说，培养这种主动性尤其重要。中学阶段正是形成兴趣和看法的时期，如果过早地被困在狭窄的信息圈里，就可能错过许多本该遇见的东西。学校和家庭可以引导学生了解推荐的原理，让他们知道屏幕上的内容是怎样被挑选出来的；学生自己也应当时常问一问：我今天看到的，是我主动寻找的，还是别人替我挑选的？

说到底，信息的选择权应当握在人自己手中。让算法做助手，而不是做主人，我们才能既享受技术带来的便利，又保有开阔的视野和独立的判断。`,
    understanding: [
      {
        ask: "下列关于原文内容的理解和分析，正确的一项是",
        right: "推荐算法主要依据用户过去的选择来推测兴趣，擅长回答“你曾经喜欢什么”",
        wrong: [
          "推荐算法能够准确判断用户的全部需要，因而节省了寻找信息的时间",
          "只要使用推荐算法，人就必然会陷入“信息茧房”而且无法自拔",
          "推荐算法让所有原本不容易被看到的作品都找到了自己的读者",
        ],
        ground: "算法推荐的依据，主要是一个人过去的选择。它擅长回答“你曾经喜欢什么”",
        reasons: [
          t(
            "The reverse: paragraph 3 says it is poor at guessing what you may still need.",
            "与原文相反：第三段说算法“不太擅长回答‘你还可能需要什么’”，选项却说它能判断“全部需要”。",
          ),
          t(
            "Possibility made certain: the world “may” narrow, and changing one's choices changes the feed.",
            "把可能说成必然：原文说视野“可能越来越窄”，第五段又说人改变选择推荐也会改变，选项说成“必然”“无法自拔”。",
          ),
          t("Widens the scope: “many” works, not “all”.", "扩大范围：第二段说让“许多”原本不容易被看到的作品找到读者，选项改成了“所有”。"),
        ],
        check: t(
          "Check by the loop in paragraph 3: it arises only because the feed rests on past choices; if it could see what you may still need, it would not narrow.",
          "用第三段的循环再对：点开越多推送越多、推送越多点开越多，这个循环正因为算法依据过去的选择才会形成；它若能看出“你还可能需要什么”，就不会越推越窄。",
        ),
      },
      {
        ask: "下列对原文内容的理解，正确的一项是",
        right: "作者认为，人改变自己的选择，推荐结果也会随之改变，问题在于怎样使用工具",
        wrong: [
          "作者认为，推荐算法弊大于利，青少年应当尽量远离各类手机应用",
          "作者认为，视野变窄的主要影响，在于人们知道的事情比过去少了",
          "正因为一个人的看法变得固执，算法才更多地向他推送同类内容",
        ],
        ground: "问题不在于工具本身，而在于人怎样使用工具。算法是根据人的行为来推荐的，人改变了自己的选择，推荐的结果也会随之改变。",
        reasons: [
          t(
            "Misstates the view: the writer says there is no need to reject it, only to keep it as a helper.",
            "曲解观点：第五段说不必拒绝算法，作者主张“让算法做助手”，既没说弊大于利，也没让青少年远离应用。",
          ),
          t(
            "Wrong emphasis: paragraph 4 says the harm is “not only” knowing less.",
            "轻重颠倒：第四段说影响“不只在于少知道一些事情”，更要紧的是遇不到意外、看法变得固执。",
          ),
          t(
            "Cause and effect swapped: repetition makes views rigid, not the other way round.",
            "因果倒置：原文是同类内容推得越多，看法越容易在重复中变得固执，选项把结果说成了原因。",
          ),
        ],
        check: t(
          "Check by the remedies in paragraph 5: searching unfamiliar topics, reading whole classics and browsing libraries all change one's own choices, which is how the tool is used differently.",
          "用第五段的对策再对：主动搜索陌生的话题、读整本的经典、去图书馆书店翻看，都是靠人改变自己的选择来改变推荐，正是“问题在于怎样使用工具”的落实。",
        ),
      },
    ],
    analysis: [
      {
        ask: "下列对原文论证的相关分析，正确的一项是",
        right: "文章先肯定推荐算法的作用，再指出它的隐患，体现了辩证分析的态度",
        wrong: [
          "文章第一段列举篮球、美食的例子，意在论证推荐算法弊大于利",
          "第三段引用“信息茧房”的说法，是为了驳斥这一说法的片面性",
          "第五段运用对比论证，说明图书馆和书店比手机应用更加可靠",
        ],
        ground: "然而，便利的背后也隐藏着值得警惕的倾向。",
        reasons: [
          t(
            "Wrong function: the basketball and food examples introduce the topic; they prove no harm.",
            "作用说错：第一段的篮球、美食是引出话题，描述推送越来越合口味的现象，没有论证弊大于利。",
          ),
          t(
            "The reverse: paragraph 3 borrows the phrase to describe the narrowing, it does not refute it.",
            "与原文相反：第三段借“信息茧房”来形容视野变窄，是认同并借用这个说法，不是驳斥。",
          ),
          t(
            "Invents a comparison: libraries are one way to keep a window open, not compared for reliability.",
            "无中生有：第五段把去图书馆、书店列为在算法之外“保留一扇窗”的做法，没有和手机应用比较可靠与否。",
          ),
        ],
        check: t(
          "Check by the paragraphs' roles: “it must be granted” praises, “however” turns to the risks, and “not necessarily” refuses outright rejection; both sides are kept.",
          "看段落的分工再对：第二段以“应当承认”肯定作用，第三、四段以“然而”转入隐患，第五段又说拒绝算法“恐怕也不必”，两面都顾到，正是辩证分析。",
        ),
      },
      {
        ask: "下列对文章结构的分析，正确的一项是",
        right: "第五段以设问引出下文，否定了拒绝算法的做法，并提出主动选择的对策",
        wrong: [
          "第四段与第三段是转折关系，第四段否定了第三段视野变窄的说法",
          "第六段转换了话题，开始讨论中学阶段学生考试负担过重的问题",
          "最后一段提出了一个新的论点，与前文的论述没有直接的联系",
        ],
        ground: "那么，是不是应该拒绝推荐算法呢？恐怕也不必。",
        reasons: [
          t(
            "Wrong relation: paragraph 4 goes further than paragraph 3; it does not deny it.",
            "关系判断错：第四段承接第三段，说视野变窄的影响“不只在于少知道一些事情”，是递进，不是否定。",
          ),
          t(
            "Invented topic: paragraph 6 is about initiative; exams are never mentioned.",
            "无中生有：第六段说的是青少年要培养主动选择信息的能力，文中没有提到考试负担。",
          ),
          t(
            "Wrong relation: the last paragraph sums up the argument.",
            "关系判断错：最后一段“让算法做助手，而不是做主人”收束全文、点明观点，和前文紧密相连。",
          ),
        ],
        check: t(
          "Check by what follows: paragraph 6 on cultivating initiative and the close on keeping the algorithm a helper both build on the active choice raised in paragraph 5.",
          "看第五段之后的内容：第六段讲青少年要培养主动性，末段讲“让算法做助手，而不是做主人”，都承接第五段提出的主动选择，可见设问确实引出了下文的对策。",
        ),
      },
    ],
    answers: [
      {
        ask: "文章认为，推荐算法可能使人的视野变窄，其原因和影响分别是什么？请简要概括。",
        model:
          "原因：算法主要依据人过去的选择推荐，点开越多推送越多，循环往复，看到的世界越来越窄而不易察觉。影响：①少知道一些事情；②难以遇见意料之外的书、观点和问题，难以跳出原有想法；③看法容易变得固执，难以平心静气地倾听不同意见。",
      },
      {
        ask: "结合原文，谈谈中学生应当怎样做，才能“让算法做助手，而不是做主人”。",
        model:
          "①了解推荐的原理，知道屏幕上的内容是怎样被挑选出来的；②主动搜索不熟悉的话题，有计划地阅读整本的经典著作；③多去图书馆和书店随意翻看，在算法之外保留一扇窗；④时常反问自己，看到的内容是主动寻找的还是别人替自己挑选的。",
      },
    ],
  },
  {
    title: "节气在今天还有用吗",
    body: `二十四节气是古人认识一年中时令、气候和物候变化规律而形成的知识体系。从立春到大寒，二十四个名称排成一年的循环，有的标示季节的开始，如立春、立夏；有的反映气温的变化，如小暑、大寒；有的记录降水，如雨水、谷雨；还有的描述万物的动静，如惊蛰、小满。2016年，“二十四节气”被列入联合国教科文组织人类非物质文化遗产代表作名录。

很多人以为节气属于“阴历”，其实不然。节气是按照太阳在一年中的位置来划分的：太阳在黄道上每移动十五度，就到了一个新的节气。正因为如此，节气在公历中的日期相当稳定，每年大致落在同样的几天里。比如在北半球，冬至前后白天最短、黑夜最长，夏至前后则正好相反。古人把以月亮圆缺定月份的办法和以太阳定节气的办法结合起来，既照顾了月相，又照顾了寒暑，这正是传统历法的精巧之处。

二十四节气最初的用途在农业生产。在没有天气预报的年代，农民要知道什么时候播种、什么时候收割，主要依靠代代相传的经验。节气把这些经验固定在一个个时间点上，又通过大量农谚流传开来，比如“清明前后，种瓜点豆”。节气不仅提醒农时，也提醒人们注意天气的变化，比如到了小暑、大暑时节要注意防暑，到了霜降前后要注意防寒。可以说，节气是农耕社会的一张“时间表”，它把天文、气候和农事紧紧联系在了一起。

那么，在城市化和农业机械化的今天，这张时间表还有没有用？有人认为，现代农业有了精确的气象资料和科学的种植技术，节气已经完成了历史使命，只能作为一种文化符号保存在博物馆里。这种看法有一定道理，却失之简单。

首先，节气所包含的观察自然的方法并没有过时。古人确定节气，靠的是长期而细致的观察：看日影的长短，看草木的荣枯，看鸟兽的来去。这种从现象中寻找规律的态度，与今天的科学精神是相通的。其次，节气仍在影响人们的生活。立春时吃春饼，冬至时吃饺子或汤圆，这些习俗让人在忙碌中感受到时间的节奏和季节的变化。再次，节气还连接着丰富的文学和艺术传统，许多诗词都以节气为题，读懂节气，也就多了一把打开古典文化的钥匙。这三个方面说明，节气的价值并不只在于指导耕种。

当然，继承节气文化，不等于把它原封不动地照搬。二十四节气主要形成于黄河流域，它所描述的物候与南方、西北等地并不完全一致。历史上，各地的人们早就根据本地的气候，对农时和农谚作了调整，南方一些地方农谚所说的播种时间，就往往与北方不尽相同。这说明，节气从来不是僵死的条文，而是在使用中不断变化的活的传统。今天，一些学校带学生在节气前后观察校园里的植物，记录气温和日出时间；有的社区举办与节气有关的活动，这些都是让节气重新进入生活的尝试。

传统文化的生命力，不在于被人们供奉，而在于被人们使用。二十四节气之所以能够流传两千多年，正是因为它一直与人们的生活息息相关。只要我们愿意抬头看看天空，低头看看草木，节气就不会离我们远去。它不必被高高供起，也不会因为时代的变化而失去意义。`,
    understanding: [
      {
        ask: "下列关于二十四节气的理解，正确的一项是",
        right: "节气按太阳在黄道上的位置划分，所以每年在公历中的日期大致稳定",
        wrong: [
          "节气是按照月亮的圆缺来划分的，因而属于“阴历”的一部分",
          "二十四个节气的名称，都是用来反映一年中气温的冷暖变化的",
          "节气形成于黄河流域，因而对其他地区的农业生产毫无用处",
        ],
        ground:
          "节气是按照太阳在一年中的位置来划分的：太阳在黄道上每移动十五度，就到了一个新的节气。正因为如此，节气在公历中的日期相当稳定",
        reasons: [
          t(
            "The reverse: paragraph 2 denies the solar terms are lunar; the moon sets months, the sun sets terms.",
            "与原文相反：第二段开头说“很多人以为节气属于‘阴历’，其实不然”，月亮圆缺定的是月份，节气按太阳划分。",
          ),
          t(
            "Part for whole: only some terms, like Minor Heat and Major Cold, mark temperature.",
            "以偏概全：第一段说节气有的标示季节、有的反映气温、有的记录降水、有的描述物候，反映气温的只是小暑、大寒一类。",
          ),
          t(
            "Overreaches: paragraph 6 says other regions adapted the terms, not that they were useless.",
            "推断绝对化：第六段说各地根据本地气候对农时和农谚作了调整，说明节气是改着用，不是“毫无用处”。",
          ),
        ],
        check: t(
          "Check by the solstices in paragraph 2: the shortest and longest days are set by the sun, which is why the dates hold in the solar calendar; by the moon they would wander.",
          "用第二段的冬至、夏至再对：冬至前后白天最短、夏至前后白天最长，这是由太阳的位置决定的，所以节气在公历里日子稳定；若按月亮圆缺划分，日期就会年年游移。",
        ),
      },
      {
        ask: "下列对原文内容的理解，正确的一项是",
        right: "作者认为“节气只能保存在博物馆里”的看法有一定道理，却失之简单",
        wrong: [
          "作者赞同现代农业不再需要节气，认为节气已经完成了历史使命",
          "因为被列入非物质文化遗产名录，节气才能够流传两千多年",
          "各地调整农时和农谚，说明节气在南方等地已被完全放弃",
        ],
        ground: "这种看法有一定道理，却失之简单。",
        reasons: [
          t(
            "Wrong speaker: “its mission is done” is what “some people” say; the writer calls it too simple.",
            "张冠李戴：“已经完成了历史使命”是第四段转述的“有人认为”，作者紧接着说它“失之简单”。",
          ),
          t(
            "Wrong cause: listing came in 2016; the terms lasted because they stayed part of life.",
            "因果错位：列入名录是2016年的事；末段说节气流传两千多年，是因为“一直与人们的生活息息相关”。",
          ),
          t(
            "Misreads: adjusting means using; nothing says they were abandoned.",
            "曲解原文：第六段说各地“调整”农时和农谚，正说明一直在用；“完全放弃”在文中找不到。",
          ),
        ],
        check: t(
          "Check by what follows: paragraph 5 lists the value that remains while saying it lies “not only” in farming, granting part of the claim, exactly “some truth, but too simple”.",
          "看作者接下来的写法：第五段一面列出节气今天的价值，一面说它的价值“并不只在于指导耕种”，承认了它不再主要用于耕种的一面，正是“有一定道理，却失之简单”。",
        ),
      },
    ],
    analysis: [
      {
        ask: "下列对原文论证的相关分析，正确的一项是",
        right: "第五段用“首先”“其次”“再次”，从方法、生活、文化三方面论证节气今天仍有价值",
        wrong: [
          "第三段引用农谚，意在论证节气在现代农业生产中仍然不可替代",
          "第四段运用类比论证，把二十四节气比作博物馆里收藏的文物",
          "第六段列举学校和社区的活动，证明节气已完全融入现代生活",
        ],
        ground: "首先，节气所包含的观察自然的方法并没有过时。",
        reasons: [
          t(
            "Wrong era: the proverbs show the original farming use, before forecasts.",
            "时代错位：第三段的农谚说明节气“最初的用途在农业生产”，讲的是没有天气预报的年代，不是现代农业。",
          ),
          t(
            "No analogy: “kept in a museum” is the quoted view, not the writer's comparison.",
            "无中生有：第四段是转述一种看法，“保存在博物馆里”是那种看法自己的说法，作者没有在作类比。",
          ),
          t(
            "Overstates: these are “attempts”, not complete success.",
            "夸大：第六段说学校、社区的活动是“让节气重新进入生活的尝试”，选项把“尝试”说成“已完全融入”。",
          ),
        ],
        check: t(
          "Check by where each point lands: a method akin to science, customs that mark time's rhythm, poems that open classical culture.",
          "看三层各自的落点：观察自然的方法“与今天的科学精神是相通的”，习俗让人“感受到时间的节奏”，诗词是“打开古典文化的钥匙”，正好是方法、生活、文化三方面。",
        ),
      },
      {
        ask: "下列对文章思路的分析，正确的一项是",
        right: "文章先介绍节气的内容与划分依据，再说明其原初用途，然后针对“已过时”的看法展开辩驳，最后点明观点",
        wrong: [
          "文章开篇即提出中心论点，接着全部用事例证明节气是农耕社会的“时间表”，最后总结全文",
          "文章第二段纠正“节气属于阴历”的误解，这一段是全文中心论点所在，其余各段都围绕它展开",
          "文章各段之间是并列关系，分别介绍二十四节气在黄河流域、南方和西北等地的流传情况",
        ],
        ground: "那么，在城市化和农业机械化的今天，这张时间表还有没有用？",
        reasons: [
          t(
            "Wrong outline: the opening defines the terms, the timetable is paragraph 3, and the core is the rebuttal after it.",
            "思路说错：开篇介绍节气是什么，“时间表”只是第三段对原初用途的概括；全文的重点在第四段以后的辩驳，并非全部用事例。",
          ),
          t(
            "Wrong thesis: paragraph 2 corrects a misconception; the thesis is in paragraphs 5 to 7.",
            "中心论点找错：第二段只是纠正一个常识误解；全文观点是节气今天仍有价值、要在使用中传承，在第五至七段。",
          ),
          t(
            "Wrong structure: the regions appear only in paragraph 6; the paragraphs run introduction, use, rebuttal, conclusion.",
            "结构说错：黄河流域、南方、西北只在第六段一处提到，各段依次是介绍、用途、辩驳、结论，不是并列的地域介绍。",
          ),
        ],
        check: t(
          "Check by paragraph 4's role: it states the “mission accomplished” view and calls it too simple; paragraphs 5 and 6 rebut it, and the last states the view.",
          "看第四段的作用：它先摆出节气“已经完成了历史使命”的看法，再判为“失之简单”，第五、六段才逐层辩驳，末段说传统文化的生命力“在于被人们使用”，点明观点，与正确选项的顺序一致。",
        ),
      },
    ],
    answers: [
      {
        ask: "文章认为二十四节气在今天仍有价值，理由有哪些？请简要概括。",
        model:
          "①节气包含的长期细致观察自然、从现象中寻找规律的方法，与今天的科学精神相通；②节气习俗仍在影响生活，让人感受时间的节奏和季节的变化；③节气连接着丰富的文学艺术传统，有助于读懂古典文化。",
      },
      {
        ask: "文章说节气是“在使用中不断变化的活的传统”，请结合原文简要分析。",
        model:
          "①节气主要形成于黄河流域，物候与各地不完全一致，历史上各地早已根据本地气候调整农时和农谚；②今天学校带学生观察记录、社区举办节气活动，让节气重新进入生活。可见节气不是僵死的条文，而是在使用中不断适应和更新。",
      },
    ],
  },
  {
    title: "被低估的湿地",
    body: `在许多人的印象中，湿地不过是一片泥泞的洼地：走不进去，种不了庄稼，还容易滋生蚊虫。过去很长一段时间里，人们把排干湿地、开垦农田或修建房屋看作改造自然的成就。随着认识的加深，人们逐渐发现，这些看似“无用”的土地，其实承担着许多别的土地难以替代的功能。保护湿地，也渐渐从少数专家的呼吁，变成了越来越多人的共识。

什么是湿地？简单说来，湿地是陆地和水域之间的过渡地带，土壤长期或季节性地被水浸泡，生长着适应潮湿环境的植物。沼泽、滩涂、河流、湖泊、红树林、泥炭地都属于湿地；按照国际上通行的定义，水库、稻田等人工水域也可以算作湿地。1971年，一些国家在伊朗的拉姆萨尔签订了保护湿地的国际公约，此后，每年的2月2日被定为世界湿地日。

湿地常被称为“地球之肾”，这是因为它有净化水质的本领。水流进入湿地后速度变慢，所携带的泥沙逐渐沉积下来；湿地中的植物和微生物还能吸收、分解水中的一部分污染物。经过湿地的“过滤”，流出的水往往比流入时清澈。因此，一些地方会在污水处理厂的下游建设人工湿地，让处理过的水再经过一段“自然的过滤”。当然，这种净化能力是有限度的，如果排入的污染物太多，超过了湿地的承受能力，湿地本身也会遭到破坏。

湿地还像一块巨大的海绵，能够调节水量。雨季时，它吸收和储存大量雨水，减缓洪峰；旱季时，它又把储存的水慢慢释放出来，补充河流和地下水。沿海的红树林和滩涂则能削弱风浪，减轻风暴潮对海岸的冲击。从这个意义上说，保护湿地也是在为人类自身减少灾害。

湿地又是生物多样性丰富的地方。水、土和阳光在这里交汇，养育了大量的水生植物、鱼类、两栖动物和昆虫，也为鸟类提供了食物和栖息地。湿地中的芦苇、香蒲等植物，还为许多小动物提供了藏身和筑巢的地方。许多候鸟每年在繁殖地和越冬地之间长途迁徙，途中需要在湿地停歇、补充能量。一片停歇地消失，就可能影响整条迁徙路线上的鸟群。

此外，湿地在储存碳方面也有重要作用。在一些长期积水的湿地里，植物死后不易完全分解，残体一层层堆积，逐渐形成泥炭，其中的碳便被长期封存起来。泥炭地的面积虽然不大，储存的碳却相当可观。一旦排水开垦，泥炭暴露在空气中加速分解，原本封存的碳就会重新释放出来。这也是泥炭地的保护越来越受到重视的原因之一。

湿地的这些功能，平时并不显眼，人们往往在失去它之后才意识到它的价值：洪水来得更猛了，河水变得浑浊了，熟悉的鸟儿不再飞来。正因为湿地的价值大多不能直接换成粮食或房屋，它才长期被低估。一片湿地一旦被填平，要想恢复往往需要很长的时间和很高的代价，有些损失甚至无法挽回。今天，越来越多的地方开始退耕还湿、修复湿地，这说明人们看待土地的眼光正在改变：一块土地的价值，不仅在于它能生产什么，还在于它为整个自然系统做了什么。`,
    understanding: [
      {
        ask: "下列关于湿地的理解，正确的一项是",
        right: "按照国际上通行的定义，水库、稻田等人工水域也可以算作湿地",
        wrong: [
          "湿地的净化能力没有限度，可以容纳任意多的污染物而不受损",
          "湿地被称为“地球之肾”，是因为它能吸收和储存大量的雨水",
          "泥炭地的面积十分广大，因此其中储存的碳也相当可观",
        ],
        ground: "按照国际上通行的定义，水库、稻田等人工水域也可以算作湿地。",
        reasons: [
          t(
            "The reverse: paragraph 3 says the cleaning power has limits.",
            "与原文相反：第三段说“这种净化能力是有限度的”，污染物超过承受能力，湿地本身也会遭到破坏。",
          ),
          t(
            "Wrong label: “kidney” is about cleaning water; storing rain is the “sponge”.",
            "张冠李戴：“地球之肾”说的是净化水质；吸收、储存雨水是第四段“海绵”的比喻。",
          ),
          t(
            "The reverse: peatlands are small in area but store much carbon.",
            "与原文相反：第六段说泥炭地“面积虽然不大，储存的碳却相当可观”。",
          ),
        ],
        check: t(
          "Check by the wording: natural wetlands are listed first, then “by the international definition” adds man-made waters; the option keeps “may also count”, not “are”.",
          "看句子的说法再对：前面先列沼泽、滩涂、河流等天然湿地，再用“按照国际上通行的定义”把人工水域加进来，原文说的是“也可以算作”，选项保留了“也可以”，没有说成“都是”。",
        ),
      },
      {
        ask: "下列对原文内容的理解，正确的一项是",
        right: "泥炭地一旦被排水开垦，原本封存在泥炭中的碳就会重新释放出来",
        wrong: [
          "一片停歇地消失，必然导致整条迁徙路线上的鸟群全部消失",
          "湿地长期被低估，是因为它容易滋生蚊虫，而且种不了庄稼",
          "1971年签订湿地公约时，各国当即把2月2日定为世界湿地日",
        ],
        ground: "一旦排水开垦，泥炭暴露在空气中加速分解，原本封存的碳就会重新释放出来。",
        reasons: [
          t(
            "Possibility made certain: it “may affect” the flocks, not destroy them all.",
            "把可能说成必然：第五段说一片停歇地消失“就可能影响”整条迁徙路线上的鸟群，选项改成“必然”“全部消失”。",
          ),
          t(
            "Wrong cause: mosquitoes are the popular image; the cause given is that value is not turned into grain or houses.",
            "原因找错：蚊虫、种不了庄稼是第一段“许多人的印象”；末段说被低估是因为价值“大多不能直接换成粮食或房屋”。",
          ),
          t(
            "Wrong time: the day was set “later”, not at once.",
            "时间混淆：第二段说签约“此后”才把2月2日定为世界湿地日，选项改成了“当即”。",
          ),
        ],
        check: t(
          "Check by the last sentence of paragraph 6: this is a reason peatland protection draws attention; if draining released no carbon, there would be no such reason.",
          "用第六段末句再对：作者说这“也是泥炭地的保护越来越受到重视的原因之一”；如果排水开垦不会放出封存的碳，就谈不上为此保护泥炭地。",
        ),
      },
    ],
    analysis: [
      {
        ask: "下列对原文说明和论证的分析，正确的一项是",
        right: "文章把湿地比作“巨大的海绵”，形象地说明了它雨季储水、旱季释水的作用",
        wrong: [
          "第二段提到湿地公约，是为了证明湿地的净化能力是有限度的",
          "第五段举候鸟迁徙的例子，意在说明湿地具有调节水量的功能",
          "第三段运用对比论证，说明湿地中泥沙的作用比植物更为重要",
        ],
        ground: "湿地还像一块巨大的海绵，能够调节水量。",
        reasons: [
          t(
            "Wrong function: the convention shows international concern; the limit on cleaning is in paragraph 3.",
            "作用张冠李戴：第二段提公约是交代湿地受到国际重视；净化能力有限是第三段末尾说的，与公约无关。",
          ),
          t(
            "Wrong function: migrating birds show biodiversity, not water control.",
            "功能张冠李戴：候鸟迁徙在第五段，说明的是湿地维持生物多样性、为鸟类提供停歇地。",
          ),
          t(
            "Invents a comparison: silt and plants are listed together, not ranked.",
            "无中生有：第三段依次说泥沙沉积和植物、微生物分解，两者并列，没有比较谁更重要。",
          ),
        ],
        check: t(
          "Check by the sponge's two powers: it soaks up water and gives it back, matching storage in the rainy season and slow release in the dry season.",
          "用海绵的两种本事再对：海绵能吸水，一挤又把水放出来，正对应原文“雨季时，它吸收和储存大量雨水”和“旱季时，它又把储存的水慢慢释放出来”，比喻的两面都在下文落实了。",
        ),
      },
      {
        ask: "下列对文章结构的分析，正确的一项是",
        right: "第三至六段分别说明湿地净化水质、调节水量、维持生物多样性和储存碳的功能，是并列关系",
        wrong: [
          "第一段先肯定排干湿地的做法，以下各段再逐一论证这种做法的合理性，最后总结全文",
          "第二段介绍了湿地的定义和国际公约，这一段是全文的中心论点所在，统领以下各段",
          "最后一段与前文是转折关系，指出湿地的种种功能平时并不显眼，因而其实并不重要",
        ],
        ground: "此外，湿地在储存碳方面也有重要作用。",
        reasons: [
          t(
            "The reverse: draining is the old view, which the passage overturns.",
            "与原文相反：第一段说排干湿地是“过去”的看法，随后笔锋一转说湿地的功能难以替代，全文是否定这种做法的。",
          ),
          t(
            "Wrong thesis: paragraph 2 defines wetlands; the thesis is in the last paragraph.",
            "中心论点找错：第二段只交代湿地的定义和公约；全文观点在末段，即土地的价值还在于它为整个自然系统做了什么。",
          ),
          t(
            "Misreads: “not conspicuous” explains why wetlands are undervalued, not that they matter little.",
            "曲解：末段说功能“平时并不显眼”、失去后才知道价值，是要说明湿地重要却被低估，不是“并不重要”。",
          ),
        ],
        check: t(
          "Check by the openings “is often called”, “is also like”, “is moreover”, “besides”: each brings one function, side by side, none derived from another.",
          "看四段开头的词：“湿地常被称为”“湿地还像”“湿地又是”“此外”，一段引出一种功能，彼此不分先后、也不互相推导，正是并列关系。",
        ),
      },
    ],
    answers: [
      {
        ask: "根据原文，湿地有哪些功能？请简要概括。",
        model:
          "①净化水质：减缓水流使泥沙沉积，植物和微生物吸收、分解部分污染物；②调节水量：雨季储水减缓洪峰，旱季释水补充河流和地下水，沿海湿地还能削弱风浪；③维持生物多样性，为鸟类提供食物、栖息地和迁徙停歇地；④储存碳，泥炭长期封存碳。",
      },
      {
        ask: "文章认为湿地长期被低估的原因是什么？最后一段说人们“看待土地的眼光正在改变”，应当怎样理解？",
        model:
          "原因：湿地的功能平时不显眼，价值大多不能直接换成粮食或房屋，人们往往失去后才意识到。理解：过去只以能生产什么来衡量土地，如今退耕还湿、修复湿地，说明人们认识到土地的价值还在于它为整个自然系统做了什么。",
      },
    ],
  },
  {
    title: "词语也有一生",
    body: `词语像人一样，也有自己的一生。它们诞生，成长，有的变换了模样，有的悄悄退场，有的在新的时代里又获得了新的生命。我们今天习以为常的许多词语，如果翻开古书去查一查，常常会发现它们原来的意思与今天大不相同。

词义变化的一种常见情形是范围扩大。“江”和“河”在上古时期原本是专名，“江”指长江，“河”指黄河。后来，这两个字渐渐用来泛指较大的河流，人们才有了“珠江”“淮河”这样的说法。与此相反的情形是范围缩小。“臭”字原来泛指各种气味，香的、难闻的都可以叫“臭”；后来它的意思缩小，只指难闻的气味，原来的泛称就由“气味”一类的词来承担了。“丈人”在古代可以泛称年长的男子，后来常用来专指妻子的父亲，也是词义范围缩小的例子。

还有一种情形是词义的转移，也就是一个词由指称这种事物或动作，变为指称另一种相关的事物或动作。古汉语里的“走”是跑的意思，“守株待兔”的故事里，兔子就是“走”着撞上树桩的，那是在奔跑。而古人表示今天“走”的意思，常用的是“行”字。读古书时如果用今天的意思去理解，就会把一只狂奔的兔子想象成慢慢踱步的样子。又如“闻”字，本义是听见，后来才多用来表示用鼻子嗅。

词语的感情色彩也会改变。“爪牙”一词，在很早的诗歌里用来比喻勇武的得力助手，带有称赞的意味；后来它渐渐专指坏人的帮凶，变成了贬义词。“牺牲”最初指古代祭祀时用的牲畜，后来引申为为了正义的目的舍弃自己的生命，意思变得庄重而崇高。同一个词语，在不同的时代可以带给人截然不同的感受。

词义为什么会变化？原因是多方面的。社会生活变了，新的事物不断出现，旧的事物逐渐消失，语言就要随之调整；人们的认识深化了，原有的说法不够用了，也会推动词义的发展。此外，人们在说话时常常借用比喻、引申等方式，使一个词的用法不断延伸，久而久之，延伸出来的意思可能取代原来的意思。有些变化来自一时的误用，用的人多了，也就被大家接受下来。语言是交流的工具，它的变化归根到底是为了更好地满足人们交流的需要。

了解词义的变化，对我们有什么用处呢？最直接的用处，是帮助我们读懂古书。很多误读，正是由于用今天的意思去理解古代的词语，也就是所谓“以今释古”。了解了词语的来龙去脉，读古文时就会多一分警惕，遇到熟悉的字眼也不急于下结论，而是结合上下文推敲它在当时的含义。即使在今天的阅读中，了解一个词的本义，也常常能帮助我们更准确地体会它的引申义，用起词来也更有分寸。

更深一层说，词语的历史也是文化的历史。一个词怎样诞生，怎样变化，往往记录着当时人们的生活方式和思想观念。追溯词语的一生，就像打开一扇窗，可以看见古人怎样生活、怎样思考。比如“牺牲”的本义，就让我们看到祭祀在古人生活中占有多么重要的位置。从这个意义上说，查字典不只是一项学习任务，也可以是一次有趣的文化旅行。`,
    understanding: [
      {
        ask: "下列关于原文内容的理解，正确的一项是",
        right: "“江”“河”由专指长江、黄河变为泛指较大的河流，属于词义范围的扩大",
        wrong: [
          "“臭”由泛指各种气味变为专指难闻的气味，属于词义的转移",
          "古汉语中的“走”和“行”意思相同，都表示今天“走”的意思",
          "“牺牲”一词由褒义变为贬义，说明词语的感情色彩会改变",
        ],
        ground: "“江”和“河”在上古时期原本是专名，“江”指长江，“河”指黄河。后来，这两个字渐渐用来泛指较大的河流",
        reasons: [
          t(
            "Wrong category: 臭 is narrowing; shift is 走 and 闻.",
            "类别混淆：第二段把“臭”列为“范围缩小”的例子；词义转移是第三段“走”“闻”一类。",
          ),
          t(
            "The reverse: in old Chinese 走 meant run and 行 meant walk.",
            "与原文相反：第三段说古汉语的“走”是跑，表示今天“走”的意思用“行”，两字意思不同。",
          ),
          t(
            "Wrong word: 爪牙 turned bad; 牺牲 grew solemn and noble.",
            "张冠李戴：由褒变贬的是“爪牙”；“牺牲”是从祭祀的牲畜变得“庄重而崇高”。",
          ),
        ],
        check: t(
          "Check by “in contrast” in the same paragraph: “smell” and “father-in-law” come under narrowing, the opposite of the two rivers, so the rivers are widening.",
          "用同段的“与此相反”再对：“臭”和“丈人”被放在“与此相反的情形是范围缩小”之下，和“江”“河”一缩一扩，可见“江”“河”属于扩大。",
        ),
      },
      {
        ask: "下列对原文内容的理解，正确的一项是",
        right: "用今天的意思去理解古代的词语，是造成误读古书的一个原因",
        wrong: [
          "词义变化的根本原因，在于人们说话时喜欢借用比喻和引申",
          "只要了解了词语的来龙去脉，就一定能读懂所有的古代典籍",
          "词语延伸出来的意思，久而久之一定会取代它原来的意思",
        ],
        ground: "很多误读，正是由于用今天的意思去理解古代的词语，也就是所谓“以今释古”。",
        reasons: [
          t(
            "Part for whole: figures of speech are one cause among several; at root it is the need to communicate.",
            "以偏概全：第五段说原因是多方面的，比喻引申只是“此外”的一条；“归根到底”是为了满足交流的需要。",
          ),
          t(
            "Absolute claim: knowing changes makes one more careful, not able to read everything.",
            "绝对化：第六段说了解词义变化会让人“多一分警惕”，还要结合上下文推敲，没有说一定能读懂所有古籍。",
          ),
          t(
            "Possibility made certain: “may replace”, not “will”.",
            "把可能说成必然：第五段说延伸出来的意思“可能取代原来的意思”，选项改成“一定会”。",
          ),
        ],
        check: t(
          "Check by the hare in paragraph 3: reading the old word for “run” as “walk” turns a racing hare into a stroller, a live case of the misreading paragraph 6 describes.",
          "用第三段的兔子再对：读者若把“走”当成今天的步行，就会把狂奔的兔子想成慢慢踱步，这正是以今释古造成误读的实例，第六段的判断有了着落。",
        ),
      },
    ],
    analysis: [
      {
        ask: "下列对原文论证的相关分析，正确的一项是",
        right: "文章举“守株待兔”中兔子奔跑的例子，具体说明以今义理解“走”会造成误读",
        wrong: [
          "文章开篇把词语比作人，运用了对比论证，突出词语与人的不同之处",
          "第四段列举“爪牙”“牺牲”两例，都是为了说明词义范围的缩小",
          "第五段引用古书中的原话，论证了词义变化有多方面的复杂原因",
        ],
        ground: "“守株待兔”的故事里，兔子就是“走”着撞上树桩的，那是在奔跑。",
        reasons: [
          t(
            "Wrong method: the opening likens words to people; it does not contrast them.",
            "方法说错：开篇说词语“像人一样，也有自己的一生”，是比喻二者相似，不是对比二者的不同。",
          ),
          t(
            "Wrong category: paragraph 4 is about connotation; narrowing is in paragraph 2.",
            "类别混淆：第四段两例说明的是感情色彩的改变；范围缩小是第二段的“臭”“丈人”。",
          ),
          t("Invented: paragraph 5 quotes no old text.", "无中生有：第五段直接分析原因，没有引用古书原话。"),
        ],
        check: t(
          "Check by the second example in the paragraph: a word for hearing that came to mean smelling sits beside “zou” as transfer, so the hare shows the old and new senses of one word.",
          "用同段的“闻”再对：“闻”本义是听见，后来多指用鼻子嗅，和“走”同属词义的转移；两例并举，说明这一段讲的是转移，兔子一例是要具体显出“走”的古今之别。",
        ),
      },
      {
        ask: "下列对文章思路的分析，正确的一项是",
        right: "文章先分类说明词义变化的几种情形，再分析变化的原因，最后阐述了解词义变化的意义",
        wrong: [
          "文章先分析词义变化的原因，再举例加以说明，最后号召人们保护古代的词语不被改变",
          "第二段到第四段是层层递进的关系，后一种变化情形都以前一种变化情形为基础",
          "最后一段否定了前一段的观点，认为读懂古书并不重要，查字典只是一次文化旅行",
        ],
        ground: "词义为什么会变化？原因是多方面的。",
        reasons: [
          t(
            "Wrong order and view: types come first, causes in paragraph 5, and no one is told to stop change.",
            "顺序和观点都错：文章先分类举例，第五段才讲原因；作者说变化是为了满足交流需要，并没有号召阻止词语变化。",
          ),
          t(
            "Wrong relation: paragraphs 2 to 4 are parallel types.",
            "关系判断错：第二至四段分别说范围、转移、感情色彩几种情形，是并列，后一种不以前一种为基础。",
          ),
          t(
            "The reverse: “going deeper” builds on the previous paragraph.",
            "与原文相反：末段用“更深一层说”承接上段，在读懂古书之外再进一层讲文化意义，不是否定。",
          ),
        ],
        check: t(
          "Check by the openings: paragraphs 2 to 4 sort the kinds of change, paragraph 5 asks why, and paragraphs 6 and 7 ask what use it is, the order of the right option.",
          "看各段的开头：第二至四段以“一种常见情形”“还有一种情形”“感情色彩也会改变”分类，第五段“为什么会变化”讲原因，第六、七段“有什么用处”“更深一层说”讲意义，顺序与正确选项一致。",
        ),
      },
    ],
    answers: [
      {
        ask: "根据原文，词义的变化有哪几种情形？请结合文中的例子简要概括。",
        model:
          "①范围扩大，如“江”“河”由专指长江、黄河变为泛指较大的河流；②范围缩小，如“臭”由泛指气味变为只指难闻的气味；③词义转移，如“走”由跑变为今天的走；④感情色彩改变，如“爪牙”由褒变贬，“牺牲”变得庄重崇高。",
      },
      {
        ask: "文章认为了解词义的变化有哪些用处？请简要概括。",
        model:
          "①最直接的是帮助读懂古书，避免以今释古，读古文时结合上下文推敲词语在当时的含义；②更深一层，词语的历史记录着当时人们的生活方式和思想观念，追溯词语的变化可以了解古人怎样生活、怎样思考。",
      },
    ],
  },
  {
    title: "园林里的借景",
    body: `中国古典园林的面积往往不大，尤其是江南的私家园林，许多只占城中一角，却能让人觉得山重水复、意趣无穷。造园者是怎样在有限的空间里创造出丰富的景致的？其中一个重要的办法，就是“借”。

明代末年的造园家计成在《园冶》中说：“园林巧于因借，精在体宜。”所谓“因”，是依循地势和环境，因地制宜；所谓“借”，是把园外的景物纳入园内的视野。园墙能够围住一块土地，却围不住人的目光。造园者正是看到了这一点，才不把园子的边界当作视野的边界。远处的山峦、塔影，邻家的树木，天上的云霞，都可以被巧妙地“借”进园中，成为园景的一部分。

借景的方式多种多样。最常被人提起的是远借，即把远处的景物借入园中。在苏州拙政园的一些地方向西望去，可以看到园外远处的北寺塔，塔影仿佛就立在园中的树木和水面之上，使园子在视觉上向远方延伸。北京的颐和园也把玉泉山上的塔和更远的西山借入景中，园内园外连成一片。除了远借，还有借邻家景物的邻借，抬头看高处、低头看下方的仰借和俯借，以及借四季、晨昏变化入景的应时而借。这些借景的方式，让园子的边界在人的感受中变得模糊，园子也就显得比实际更加开阔。

与借景相辅相成的，是对视线的精心安排。园中的墙上常开着形状各异的门洞和窗洞，人从这里望出去，看到的是被框起来的一幅画：一丛竹子，一块山石，或者半面池塘。这种手法常被称为框景。还有一些窗户用砖瓦拼出镂空的图案，景物在花纹之间若隐若现，让人生出走过去看个究竟的愿望。园林中的道路也很少笔直，而是曲折迂回，人每走几步，眼前的景象就有所变化，这就是所谓的“移步换景”。框景让人停下来细看，移步换景则引人不断向前，一静一动之间，小小的园子仿佛变得深不可测。

借景并不是看见什么就借什么。“精在体宜”中的“宜”字十分要紧：借来的景物要与园内的景致相协调，位置、大小、远近都要恰到好处。《园冶》中还有“俗则屏之，嘉则收之”的说法，意思是，不美的景物要设法遮挡，美好的景物才收入眼中。比如，园外若有杂乱的房屋，造园者便会用树木、假山或高墙把它挡住，而把远山、塔影留在视线之中。可见，借景既需要开放的眼光，也需要严格的取舍。

借景背后，体现的是一种看待人与自然、局部与整体的态度。造园者不把园子看成与外界隔绝的封闭空间，而是把它放在更大的山水环境中去构思，让有限的园子与无限的天地相通。园林中的一草一木、一墙一窗，都不是孤立的存在，而是在与周围景物的关系中显出意义。这种思想，在今天仍然有启发意义。现代城市里的建筑和公园，有时只顾自身的造型，而不考虑与周围环境的关系，结果彼此遮挡、互不相干。如果设计者也能学一学古人的“借”，在规划时留出视线的通道，让建筑与山水、与城市彼此照应，我们的城市也许会更加和谐，人们在其中生活，也会更多地感受到自然的气息。`,
    understanding: [
      {
        ask: "下列关于原文内容的理解，正确的一项是",
        right: "“借”是把园外的景物纳入园内的视野，使有限的园子在视觉上得以延伸",
        wrong: [
          "“因”和“借”意思相同，都是指把园外的景物纳入园内的视野",
          "江南私家园林的面积都很大，因此能让人觉得山重水复、意趣无穷",
          "借景就是看见什么就借什么，园外的一切景物都可以借入园中",
        ],
        ground: "所谓“借”，是把园外的景物纳入园内的视野。",
        reasons: [
          t(
            "Confuses terms: 因 follows the site; 借 draws in outside scenery.",
            "混淆概念：第二段说“因”是依循地势和环境、因地制宜，“借”才是把园外景物纳入视野，两者不同。",
          ),
          t("The reverse: the gardens are usually small.", "与原文相反：第一段说园林面积“往往不大”，许多私家园林“只占城中一角”。"),
          t(
            "The reverse: paragraph 5 says not everything is borrowed.",
            "与原文相反：第五段开头说“借景并不是看见什么就借什么”，还要“俗则屏之，嘉则收之”。",
          ),
        ],
        check: t(
          "Check by the Humble Administrator's Garden in paragraph 3: the pagoda outside seems to stand among the garden's trees and water, the outside taken into the view and the garden stretched outward.",
          "用第三段的拙政园再对：从园中向西望能看到园外的北寺塔，“塔影仿佛就立在园中的树木和水面之上”，这正是把园外景物纳入园内视野，使园子向远方延伸。",
        ),
      },
      {
        ask: "下列对原文内容的理解，正确的一项是",
        right: "框景是借助门洞、窗洞把景物框起来，使人看到如画一般的景致",
        wrong: [
          "拙政园和颐和园都把北寺塔借入园中，使园内园外连成一片",
          "园林中的道路曲折迂回，主要是为了遮挡园外那些不美的景物",
          "现代城市建筑彼此遮挡，是因为设计者完全不了解古典园林",
        ],
        ground: "人从这里望出去，看到的是被框起来的一幅画",
        reasons: [
          t(
            "Wrong garden: the Humble Administrator's Garden borrows the North Temple Pagoda; the Summer Palace borrows Jade Spring Hill and the Western Hills.",
            "张冠李戴：借北寺塔的是苏州拙政园，颐和园借的是玉泉山上的塔和西山。",
          ),
          t(
            "Wrong purpose: winding paths change the view; trees, rockeries and walls hide ugliness.",
            "目的说错：道路曲折是为了“移步换景”、引人向前；遮挡不美的景物靠的是树木、假山或高墙。",
          ),
          t(
            "Invented cause: the text faults designers' focus, not their ignorance.",
            "无中生有：末段说现代建筑有时只顾自身造型、不考虑周围环境，没有说设计者完全不了解古典园林。",
          ),
        ],
        check: t(
          "Check by “stillness and motion” in the same paragraph: framing “makes one stop and look”, set against the shifting views that draw one on; a framed scene holds the eye like a picture.",
          "用同段的“一静一动”再对：作者说框景“让人停下来细看”，和移步换景“引人不断向前”相对，被框起来的景物让人驻足观看，正像在看一幅画。",
        ),
      },
    ],
    analysis: [
      {
        ask: "下列对原文论证的相关分析，正确的一项是",
        right: "文章引用《园冶》中的话，既解释了“因借”的含义，又为论述借景的取舍提供了依据",
        wrong: [
          "第三段列举拙政园和颐和园的例子，意在说明北方园林比江南园林更善于借景",
          "第四段运用比喻论证，把园林比作一幅画，论证了框景比借景更为重要",
          "最后一段运用对比论证，说明现代城市的设计已经全面超越了古典园林",
        ],
        ground: "明代末年的造园家计成在《园冶》中说：“园林巧于因借，精在体宜。”",
        reasons: [
          t(
            "Invents a comparison: both gardens illustrate distant borrowing.",
            "无中生有：两例一南一北，都用来说明远借，文中没有比较哪方更善于借景。",
          ),
          t("Wrong relation: framing and borrowing complement each other.", "关系说错：第四段说框景与借景“相辅相成”，没有说哪个更重要。"),
          t(
            "The reverse: modern cities should learn from the old gardens.",
            "与原文相反：末段说现代城市有时彼此遮挡，主张向古人学“借”，不是现代超越了古典。",
          ),
        ],
        check: t(
          "Check by the two uses of the treatise: paragraph 2 explains the two words, and paragraph 5 returns to “fitness” and adds “screen the vulgar, take in the fine” to ground the choosing.",
          "看《园冶》两处引文的用途：第二段用“巧于因借，精在体宜”解释“因”和“借”，第五段又回到“宜”字，并引“俗则屏之，嘉则收之”说明借景要有取舍，一处释义，一处立据。",
        ),
      },
      {
        ask: "下列对文章思路的分析，正确的一项是",
        right: "文章由园林面积小而景致丰富的现象引出“借”，再阐释其含义、方式和原则，最后联系现代城市建设",
        wrong: [
          "文章先批评现代城市建筑彼此遮挡的现象，再以古典园林为例，提出改进城市设计的具体办法",
          "第四段与第三段是转折关系，第四段介绍框景和移步换景，否定了第三段所说借景的作用",
          "第五段是全文的总结，指出借景只需要开放的眼光，园外的景物越多，园子就越显得丰富",
        ],
        ground: "造园者是怎样在有限的空间里创造出丰富的景致的？其中一个重要的办法，就是“借”。",
        reasons: [
          t(
            "Wrong order: modern cities come only at the end.",
            "顺序颠倒：文章从园林的现象写起，到最后一段才联系现代城市，现代城市不是开头。",
          ),
          t(
            "Wrong relation: paragraph 4 adds to borrowing, it does not deny it.",
            "关系判断错：第四段开头说框景等手法“与借景相辅相成”，是补充，不是否定。",
          ),
          t(
            "Part for whole: borrowing needs both openness and selection; the summary is the last paragraph.",
            "以偏概全：第五段说借景“既需要开放的眼光，也需要严格的取舍”，不美的要遮挡；全文的总结也在最后一段，不在第五段。",
          ),
        ],
        check: t(
          "Check by the opening and the close: the first paragraph's question leads to borrowing, the last brings it to modern cities, and meaning, methods and principle come between.",
          "看首尾是否相应：首段用问句从“有限的空间”引出“借”，末段说“如果设计者也能学一学古人的‘借’”，联系现代城市，中间依次是含义、方式、原则，与正确选项一致。",
        ),
      },
    ],
    answers: [
      {
        ask: "根据原文，古典园林是怎样在有限的空间里创造丰富景致的？请简要概括。",
        model:
          "①借景：通过远借、邻借、仰借、俯借和应时而借，把园外景物纳入园内视野；②框景：用门洞、窗洞把景物框成一幅画；③用镂空的窗户使景物若隐若现，引人前往；④道路曲折迂回，移步换景。",
      },
      {
        ask: "结合原文，谈谈古人的“借”对今天的城市建设有什么启发。",
        model:
          "古人不把园子看成封闭空间，而是放在更大的山水环境中构思，使局部与整体、人与自然相通；借景又讲究“体宜”，收佳屏俗。今天的城市规划也应考虑建筑与周围环境的关系，留出视线通道，让建筑与山水、城市彼此照应，避免彼此遮挡、互不相干。",
      },
    ],
  },
];
