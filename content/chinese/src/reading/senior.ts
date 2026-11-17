// The reading units of senior secondary school (docs/chinese-curriculum.md §9): essays, expositions, arguments and
// narratives written for this subject, three units a course, each passage with a short check.

import type { ReadingUnitDef } from "@ga/content";

import { question, unit } from "./kit.ts";

/** gradeTenIdeas is the argument unit of grade 10: the power of reasoning. */
const gradeTenIdeas = unit(
  10,
  "chinese-reading-10-ideas",
  ["思辨的力量", "The Power of Reasoning"],
  [
    {
      id: "chinese-science-needs-imagination",
      title: ["科学也需要想象", "Science Needs Imagination Too"],
      body: `一提到科学，许多人想到的是严密的实验、精确的数字和一丝不苟的推理；一提到想象，想到的则是诗歌、小说和童话。在不少人心中，二者好像分属两个世界：科学讲究实事求是，想象却是“想入非非”。其实，科学的每一次重大进步，都离不开想象的翅膀。

想象为科学提出问题。爱因斯坦后来回忆，他十六岁时曾经设想：如果一个人以光的速度追着一束光跑，他会看到什么？这个看似天真的问题，在他心中盘旋了多年，最终成为他思考时间和空间的一个起点。没有这样大胆的设想，人就只会在已知的范围里打转，很难看到常识之外的东西。

想象也帮助科学寻找答案。许多科学对象，人们无法直接看见：原子太小，宇宙太大，地球内部太深。科学家要研究它们，先要在头脑中为它们“画一幅像”，设想它们可能是什么样子，再设计实验去检验这幅像对不对。可以说，想象是一座桥，一头连着已知，一头伸向未知。

然而，科学中的想象与童话中的想象并不相同。童话里的想象可以自由飞翔，不必接受检验；科学中的想象却必须落到地面，经得起观察和实验的追问。一个设想无论多么动人，只要与事实不符，就必须放弃或者修改。正因为有了这道关口，科学的想象才没有变成空想，而是一步步变成了可靠的知识。

由此看来，科学既需要想象，也需要约束想象的严格方法。只有想象而没有检验，科学就会变成随意的猜测；只有检验而没有想象，科学又会失去前进的方向。二者相互配合，才构成了科学探索的完整过程。

对今天的学生来说，这个道理同样适用。学习科学，不应只是背下公式和结论，也要常常问一问“如果……会怎样”。在课堂上保护好这份好奇和想象，再用事实和推理去检验它，也许就是走向科学最好的起点。`,
      names: ["爱因斯坦"],
      xp: 7,
      questions: [
        question(
          ["下列对文章中心论点的概括，最准确的一项是", "Which best states the thesis of the passage?"],
          [
            "科学探索既需要想象，也需要用观察和实验来约束想象",
            "Science needs imagination, and needs observation and experiment to hold imagination in check",
          ],
          [
            ["科学和想象分属两个世界，不能混为一谈", "Science and imagination belong to two worlds and must not be mixed"],
            ["只要想象足够大胆，科学就能不断进步", "So long as imagination is bold enough, science will keep advancing"],
            ["童话中的想象比科学中的想象更自由，也更有价值", "The imagination of fairy tales is freer and worth more than that of science"],
          ],
          [
            "文章先说科学离不开想象，又说科学的想象必须接受检验，第五段总结：“科学既需要想象，也需要约束想象的严格方法。”",
            "The passage argues that science depends on imagination and that its imagination must be tested; the fifth paragraph sums up: science needs both.",
          ],
        ),
        question(
          ["第二段和第三段之间是什么关系？", "How are the second and third paragraphs related?"],
          [
            "并列关系，分别从提出问题和寻找答案两个方面论证想象对科学的作用",
            "Parallel: they argue for imagination's role in science from two sides, raising questions and finding answers",
          ],
          [
            ["转折关系，第三段否定了第二段的观点", "Contrast: the third paragraph rejects the second"],
            ["因果关系，第二段是原因，第三段是结果", "Cause and effect: the second is the cause, the third the result"],
            ["总分关系，第二段总说，第三段分说", "General to particular: the second states, the third details"],
          ],
          [
            "两段的开头分别是“想象为科学提出问题”“想象也帮助科学寻找答案”，一个“也”字表明两段地位相同，从两方面支撑论点。",
            "They open with imagination raising questions and imagination also helping find answers; “also” shows two equal supports for the thesis.",
          ],
        ),
        question(
          ["第四段在全文的论证中起什么作用？", "What does the fourth paragraph do in the argument?"],
          [
            "辨析科学想象与童话想象的不同，指出科学想象必须接受检验，使论证更严密",
            "It sets scientific imagination apart from that of fairy tales: the former must be tested, which tightens the argument",
          ],
          [
            ["列举更多科学家的例子，证明想象的重要", "It gives more examples of scientists to prove imagination matters"],
            ["批评童话和小说，认为它们脱离实际", "It criticizes fairy tales and novels as unrealistic"],
            ["提出一个新的论点，与前文没有联系", "It raises a new point unrelated to what came before"],
          ],
          [
            "前两段讲想象的作用，第四段用“然而”一转，说明科学的想象必须“经得起观察和实验的追问”，防止读者把想象理解为空想，为第五段的结论做好准备。",
            "After two paragraphs on imagination's value, “however” turns to the need for testing, guarding against reading it as fancy and preparing the conclusion.",
          ],
        ),
        question(
          ["下列推断，不能从原文得出的一项是", "Which inference can NOT be drawn from the passage?"],
          [
            "爱因斯坦十六岁时的设想，直接证明了他后来关于时间和空间的理论",
            "Einstein's thought at sixteen directly proved his later theory of time and space",
          ],
          [
            [
              "研究原子这样看不见的对象，科学家常常先在头脑中设想它的样子",
              "To study unseen things like atoms, scientists often first picture them in the mind",
            ],
            ["缺少检验的想象，可能变成随意的猜测", "Imagination without testing may become mere guessing"],
            ["学习科学不能只背公式和结论", "Learning science should not be only memorizing formulas and conclusions"],
          ],
          [
            "原文只说那个设想“成为他思考时间和空间的一个起点”，是起点而不是证明；按文章的观点，设想还要经过检验。其余三项分别见于第三、五、六段。",
            "The text calls the thought a starting point, not a proof; by the passage's own view a thought must still be tested. The others appear in paragraphs three, five and six.",
          ],
        ),
      ],
    },
    {
      id: "chinese-tradition-is-a-river",
      title: ["传统是一条河", "Tradition Is a River"],
      body: `一说起传统，有人想到的是博物馆里的旧物，是需要小心保管、不能随便碰的东西。在这种看法里，传统好像一块化石，形状早已固定，后人只能站在玻璃外面看。可是，真正活着的传统，更像一条河。

河有源头，也一直在流。今天我们说的话，与一千年前人们口中的话已经大不一样；我们过春节的方式，也和祖辈不同：年夜饭的菜换了，拜年的方式多了，有的人家还会在手机上给远方的亲人发红包。可是，一家人团聚、辞旧迎新的心意并没有变。端午节也是这样：从前人们在江边看龙舟，今天不少城市公园的湖上也有了龙舟赛，学校里还教孩子们缝香包。形式在变，那份心意却一代代流了下来，这正是传统的生命所在。

所以，保护传统，不是让它停下来。如果在河上筑坝把水拦住，水不再流动，时间长了，反倒会变成一潭死水。一门手艺、一种戏曲，如果只能原样重复，不再有人在其中注入新的东西，就很难打动新一代人，最后只能留在资料里。许多老手艺的传承人都明白这个道理：他们守住最根本的技法，又敢于做出新的样式，让年轻人愿意拿在手里、用在身边。

但是，一条河之所以是这条河，而不是别的河，是因为它有自己的河道。创新如果离开了传统的根本，只取一个名字、一点花样，就像水漫出河岸，四处流散，最后什么也留不下。一首流行歌加上几声古筝，一件衣服绣上几朵牡丹，未必就是传统的新生。要让传统真正向前流，先要弄懂它为什么是这个样子，它好在哪里。一种戏曲的唱腔和身段里，藏着几百年来观众的趣味和艺人的心血，只有先学懂了这些，改动才有方向。

因此，对待传统，既要有守的耐心，也要有变的勇气。守，是认清河道，不让它断流；变，是让河水流向新的土地。我们每个人都站在这条河中，既是从上游接过水的人，也是把水送向下游的人。`,
      xp: 7,
      questions: [
        question(
          ["文章把传统比作“河”，主要想说明什么？", "In likening tradition to a river, what does the writer mainly mean?"],
          ["传统既有不变的根本，又在不断地流动和变化", "Tradition has a lasting core, yet keeps flowing and changing"],
          [
            ["传统像化石一样早已固定，只能保管", "Tradition is fixed like a fossil and can only be kept"],
            ["传统和河流一样，最终会流散消失", "Like a river, tradition will in the end spread out and vanish"],
            ["传统只存在于博物馆和资料里", "Tradition lives only in museums and records"],
          ],
          [
            "第二段说河“有源头，也一直在流”，第四段说河“有自己的河道”：源头和河道是不变的根本，流动是变化，合起来就是作者对传统的理解。",
            "The river has a source and keeps flowing (paragraph two) and has its own bed (paragraph four): a lasting core and constant change.",
          ],
        ),
        question(
          ["第二段写过春节方式的变化，在论证中起什么作用？", "What does the change in how people keep Spring Festival do in the argument?"],
          ["用事例证明传统的形式在变，心意却代代相传", "It is an example showing that the forms change while the meaning is passed down"],
          [
            ["说明今天的春节已经失去了意义", "It shows Spring Festival has lost its meaning today"],
            ["批评用手机发红包的做法", "It criticizes sending red envelopes by phone"],
            ["说明祖辈过春节的方式更好", "It shows the elders kept the festival better"],
          ],
          [
            "年夜饭的菜换了、拜年方式多了是“形式在变”，团聚、辞旧迎新的心意没变，正好证明“传统的生命所在”。",
            "New dishes and new ways of greeting are changing forms; the wish to gather and see in the new year has not changed.",
          ],
        ),
        question(
          ["第三段和第四段之间是什么关系？", "How are the third and fourth paragraphs related?"],
          [
            "第三段说不能只守不变，第四段说不能离开根本乱变，从两个方面为结论做准备",
            "The third warns against keeping without change, the fourth against change that leaves the core; both prepare the conclusion",
          ],
          [
            ["第四段举例补充第三段的观点", "The fourth only adds examples to the third"],
            ["第四段否定了第三段，认为传统不能创新", "The fourth rejects the third and says tradition must not change"],
            ["两段内容相同，只是换了说法", "They say the same thing in different words"],
          ],
          [
            "第三段批评把河“筑坝拦住”，第四段批评水“漫出河岸”，一个反对守而不变，一个反对变而失根，第五段才得出“既要有守的耐心，也要有变的勇气”。",
            "One paragraph opposes damming the river, the other water spilling its banks; the fifth then concludes we need both patience to keep and courage to change.",
          ],
        ),
        question(
          ["下列说法，符合原文意思的一项是", "Which statement agrees with the passage?"],
          [
            "在衣服上绣几朵牡丹不一定就是传统的新生，关键在于是否懂得传统的根本",
            "Embroidering peonies on a garment is not necessarily tradition reborn; what matters is understanding its core",
          ],
          [
            ["作者主张像博物馆保管旧物那样保护传统", "The writer wants tradition kept as a museum keeps old things"],
            ["作者反对在传统艺术中加入任何新的东西", "The writer opposes adding anything new to traditional arts"],
            ["作者认为今天的话和一千年前的话没有任何联系", "The writer thinks today's speech has no link to that of a thousand years ago"],
          ],
          [
            "第四段说这类做法“未必就是传统的新生”，要“先弄懂它为什么是这个样子”。作者反对的是化石式的保管和失根的花样，并不反对创新；说话“大不一样”也不等于没有联系。",
            "Paragraph four says such touches are not necessarily rebirth and that one must first understand the tradition; the writer opposes fossil-keeping and rootless novelty, not change.",
          ],
        ),
      ],
    },
    {
      id: "chinese-slow-reading-in-a-fast-age",
      title: ["快时代的慢阅读", "Slow Reading in a Fast Age"],
      body: `打开手机，几秒钟就能读完一条新闻，几分钟就能“读完”一本书的内容简介。信息来得这样快、这样多，有人便说：读得越多越好，读得越快越好。我却以为，在这样一个快时代，慢阅读反而更加可贵。

所谓慢阅读，不是故意读得慢，而是读得深。它要求读者在一本书面前停下来，看清作者怎样提出问题，怎样一步步论证，在哪些地方说得有力，在哪些地方还可以商量。快速浏览得到的，多半是结论；慢慢读下去，才能得到通向结论的那条路。而对一个人的成长来说，那条路往往比结论更重要，因为它教会我们怎样思考。

慢阅读还能让人与文字建立真正的联系。读一首好诗，第一遍也许只觉得字句好听；读到第三遍、第五遍，忽然在某一句里看见了自己的经历，诗才真正成了你的。这样的时刻，是一目十行的浏览给不了的。

慢阅读也是一种对抗遗忘的办法。匆匆扫过的文字，往往过不了几天就忘得干干净净；而那些读的时候停下来想过、在书边写下过几句话的地方，却常常能记上很多年。原因并不复杂：人只有真正动了脑筋，读到的东西才会和自己已有的知识连在一起，成为自己的一部分。

当然，这并不是说快速阅读毫无用处。查找资料、了解新闻，快速浏览正合适；面对大量信息，先快读一遍，判断哪些值得细读，也是一种本领。问题不在于“快”，而在于只会“快”。如果一个人的阅读全是碎片，习惯了每几秒钟就换一个话题，那么他慢慢会发现，自己很难再静下心来读完一篇长文章，更难跟着一个复杂的道理想到底。

因此，我们需要的是两种阅读的平衡：用快读来拓宽眼界，用慢读来加深思考。不妨每天留出一段不被打扰的时间，放下手机，拿起一本值得反复读的书。慢下来，不是落在了时代后面，而是为了走得更稳、更远。`,
      xp: 7,
      questions: [
        question(
          ["下列对作者观点的概括，最准确的一项是", "Which best sums up the writer's view?"],
          [
            "在快时代，慢阅读更加可贵，应当让快读和慢读保持平衡",
            "In a fast age slow reading is all the more precious, and fast and slow reading should be balanced",
          ],
          [
            ["读得越多越好，读得越快越好", "The more and the faster one reads, the better"],
            ["快速阅读有害无益，应当完全放弃", "Fast reading does only harm and should be given up"],
            ["只有读诗才需要慢慢地读", "Only poems need to be read slowly"],
          ],
          [
            "第一段提出“慢阅读反而更加可贵”，第四段承认快读有用，第五段落到“两种阅读的平衡”。",
            "Paragraph one calls slow reading more precious, paragraph four grants fast reading its uses, and paragraph five settles on a balance.",
          ],
        ),
        question(
          [
            "第二段说“那条路往往比结论更重要”，“那条路”指的是什么？",
            "In paragraph two, what is “the road” that matters more than the conclusion?",
          ],
          [
            "作者提出问题、一步步论证、得出结论的思考过程",
            "The writer's thinking: raising a question and reasoning step by step to a conclusion",
          ],
          [
            ["读者从家里到图书馆的路", "The reader's way from home to the library"],
            ["快速浏览一本书的方法", "A way of skimming a book"],
            ["书中最后得出的结论", "The conclusion the book reaches"],
          ],
          [
            "前文说慢读要“看清作者怎样提出问题，怎样一步步论证”，“那条路”就是通向结论的思考过程，所以它能“教会我们怎样思考”。",
            "Slow reading means seeing how the writer raises a question and argues step by step; that path to the conclusion teaches us to think.",
          ],
        ),
        question(
          [
            "第四段开头“当然，这并不是说快速阅读毫无用处”在论证中起什么作用？",
            "What does “Of course, this does not mean fast reading is useless” do at the start of paragraph four?",
          ],
          [
            "先作让步，承认快读的价值，再指出问题在于只会快读，使论证更周全",
            "It concedes the value of fast reading, then says the trouble is reading only fast, making the case fairer",
          ],
          [
            ["推翻前文的观点，改为提倡快读", "It overturns the earlier view and now favours fast reading"],
            ["说明作者自己也喜欢快速阅读", "It shows the writer also likes reading fast"],
            ["引出一个与阅读无关的新话题", "It opens a new topic unrelated to reading"],
          ],
          [
            "作者先承认查资料、看新闻时快读“正合适”，接着说“问题不在于‘快’，而在于只会‘快’”。先让一步，再把论点说得更准确。",
            "The writer grants fast reading suits looking things up, then narrows the point: the problem is reading only fast. A concession sharpens the claim.",
          ],
        ),
        question(
          ["下列推断，不能从原文得出的一项是", "Which inference can NOT be drawn from the passage?"],
          ["作者主张放弃手机上的一切阅读", "The writer wants us to give up all reading on phones"],
          [
            ["慢读能帮助人学会思考", "Slow reading helps one learn to think"],
            ["长期碎片化阅读可能使人难以读完长文章", "Long habits of scattered reading may make long texts hard to finish"],
            ["先快读再判断哪些值得细读，也是一种本领", "Skimming first to judge what deserves close reading is a skill"],
          ],
          [
            "作者只建议“每天留出一段不被打扰的时间，放下手机”，并且承认快读有用，从没有主张放弃手机上的一切阅读。",
            "The writer only suggests setting the phone aside for a while each day and grants fast reading its uses; giving up all phone reading is never urged.",
          ],
        ),
      ],
    },
  ],
);

/** gradeTenKnowledge is the informational unit of grade 10: doorways to knowledge. */
const gradeTenKnowledge = unit(
  10,
  "chinese-reading-10-knowledge",
  ["知识的门径", "Doorways to Knowledge"],
  [
    {
      id: "chinese-the-wisdom-of-the-dougong",
      title: ["斗拱的智慧", "The Wisdom of the Dougong"],
      body: `走进一座古老的木结构大殿，抬头看屋檐下面，常常能看到一组组层层叠叠、形状复杂的构件，像一朵朵盛开的花，又像一只只托起屋顶的手。它们就是中国古代建筑中特有的斗拱。

斗拱由许多小木块组成。其中方形的、像量米的斗一样的木块，叫“斗”；弯成弓形、向两边伸出的木块，叫“拱”。一层斗，一层拱，交错叠放，层层向外挑出，就组成了一组斗拱。这些构件之间不用一颗铁钉，全靠榫卯相互咬合：一个构件上凸出的部分叫榫，另一个构件上凹进的部分叫卯，两者紧紧扣在一起，既牢固，又留有一点活动的余地。

斗拱首先是承重的构件。中国古代建筑的屋顶又大又重，屋檐还要远远地伸出去，好替墙壁和柱子挡住雨水。斗拱放在柱子顶上，一层层向外挑出，把屋檐托得更远，同时把屋顶的重量收拢起来，传到柱子上，再由柱子传到地面。

斗拱的另一个本领，是帮助建筑抵御地震。地震来时，房屋会摇晃。斗拱的许多构件之间不是死死固定的，受力时可以发生微小的移动和摩擦，就像一个“弹簧垫”，能消耗掉一部分地震的力量，减轻对整座建筑的破坏。山西应县有一座建于辽代的木塔，高六十多米，是世界上现存最古老、最高的木塔。近千年来，它经历过多次地震，至今仍然立着。塔上用了几十种不同形式的斗拱，有人称它为“斗拱博物馆”。

在漫长的历史中，斗拱的样子也在变化。早期的斗拱大而结实，在结构中承担着重要的作用；到了明清时期，建筑技术有了新的发展，斗拱渐渐变小，排列得越来越密，装饰的意味越来越浓。从斗拱的大小和样式，研究者常常可以大致判断一座建筑的年代。

今天，斗拱已经很少用在新建的房屋上了，可它的样子仍然出现在许多现代建筑的设计中。人们看重的，不仅是它的美，更是它所代表的那种智慧：用一块块小木头，经过巧妙的组合，承担起巨大的重量。`,
      names: ["山西", "应县", "辽代", "明清"],
      glossed: ["斗拱", "榫卯", "榫", "卯"],
      xp: 7,
      questions: [
        question(
          ["下列对斗拱的理解，不正确的一项是", "Which statement about the dougong is NOT correct?"],
          ["斗拱的各个构件之间用铁钉加固，所以十分牢固", "Its parts are fastened with iron nails, which is why it is so strong"],
          [
            ["斗拱由斗和拱交错叠放、层层挑出而成", "It is made of blocks and arms stacked in turn, each layer reaching further out"],
            [
              "斗拱能把屋檐托得更远，并把屋顶的重量传到柱子上",
              "It holds the eaves further out and carries the roof's weight to the columns",
            ],
            ["斗拱的构件靠榫卯相互咬合", "Its parts lock together by mortise and tenon"],
          ],
          [
            "第二段明确说构件之间“不用一颗铁钉，全靠榫卯相互咬合”。其余三项分别见于第二、三段。",
            "Paragraph two says not a single nail is used: the parts lock by mortise and tenon. The other statements appear in paragraphs two and three.",
          ],
        ),
        question(
          [
            "根据原文，斗拱能帮助建筑抵御地震，主要是因为什么？",
            "According to the text, why does the dougong help a building withstand earthquakes?",
          ],
          [
            "构件之间受力时能微小地移动和摩擦，消耗掉一部分地震的力量",
            "Its parts can shift and rub slightly under force, using up part of the quake's energy",
          ],
          [
            ["斗拱把整座建筑牢牢固定在地面上", "It fixes the whole building firmly to the ground"],
            ["斗拱的木头特别坚硬，不会变形", "Its wood is so hard it never bends"],
            ["斗拱使屋顶变得很轻", "It makes the roof very light"],
          ],
          [
            "第四段说构件“不是死死固定的”，可以“发生微小的移动和摩擦”，像“弹簧垫”一样消耗地震的力量。",
            "Paragraph four says the parts are not rigidly fixed and can shift and rub, absorbing energy like a spring pad.",
          ],
        ),
        question(
          ["第四段写应县木塔，主要起什么作用？", "What mainly is the Yingxian pagoda doing in paragraph four?"],
          ["举出实例，证明斗拱有助于建筑抵御地震", "It is an example proving the dougong helps buildings withstand earthquakes"],
          [
            ["说明辽代的建筑都是木塔", "It shows all Liao buildings were pagodas"],
            ["介绍应县的旅游景点", "It introduces a sight to visit in Yingxian"],
            ["说明斗拱只在塔上使用", "It shows the dougong was used only on pagodas"],
          ],
          [
            "前文说斗拱能消耗地震力量，接着写这座木塔“经历过多次地震，至今仍然立着”，用具体的建筑来证明这一点。",
            "Having said the dougong absorbs earthquake energy, the text cites a pagoda that has stood through many quakes.",
          ],
        ),
        question(
          [
            "某座古建筑的斗拱小而密，装饰的意味很浓。根据原文，下列推断最合理的一项是",
            "An old building's dougong are small, closely set and highly decorative. Which inference is most reasonable?",
          ],
          ["这座建筑可能建于较晚的时期，比如明清", "It was probably built fairly late, such as in the Ming or Qing"],
          [
            ["这座建筑一定建于辽代", "It must have been built in the Liao"],
            ["这座建筑的斗拱承担的结构作用一定比早期更大", "Its dougong must bear more of the structure than early ones"],
            ["这座建筑一定经历过地震", "It must have been through an earthquake"],
          ],
          [
            "第五段说到了明清时期，斗拱“渐渐变小，排列得越来越密，装饰的意味越来越浓”，又说据此只能“大致判断”年代，所以说“可能”最合理。",
            "Paragraph five says Ming and Qing dougong grew smaller, denser and more decorative, and that this gives only a rough date; hence “probably”.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-far-side-of-the-moon",
      title: ["月球的背面", "The Far Side of the Moon"],
      body: `无论是满月还是弯弯的月牙，我们看到的，始终是月球的同一面。月球的另一面，从地球上永远看不到。这是为什么呢？

原来，月球一边绕着地球转，一边自己转动，而它自转一周的时间，恰好和绕地球公转一周的时间相同，都是二十七天多。打个比方：你绕着一张桌子走一圈，始终让脸朝着桌子，那么走完一圈，你的身体也正好转了一圈，而桌子从头到尾只看见了你的脸。

这两个时间为什么会恰好相等呢？这并不是巧合。科学家认为，月球形成之初，自转比现在快。地球的引力会把月球拉得微微变形，在朝向地球和背向地球的方向上各鼓起一点。由于月球在转动，这两处鼓起总是被带得偏开一些，地球的引力拉着它们，就像踩着刹车，使月球的自转慢慢变慢，直到自转和公转的时间相同为止。这种现象叫做潮汐锁定。在太阳系中，许多卫星都被它们的行星这样“锁”住了。

不过，严格说来，我们能看到的并不只是月球的一半。由于月球的运行轨道是椭圆的，速度有快有慢，它的自转轴也有一点倾斜，从地球上看，月球会轻轻地左右、上下摆动。把这些摆动加在一起，我们一共能看到月球表面的百分之五十九左右。

有人把月球背面叫做“月球的暗面”，这其实是一个误会。月球背面同样有白天和黑夜，同样被太阳照亮。当我们看到新月、月面几乎全暗的时候，月球背面正好大部分处在阳光下。所谓“暗”，只是因为我们看不到它，过去对它了解得很少。

正因为看不到，到月球背面去也格外困难。月球挡在中间，背面的探测器无法直接和地球通信。2019年，中国的嫦娥四号探测器在月球背面成功着陆，这是人类的探测器第一次在那里实现软着陆。为了让它和地球保持联系，科学家事先在月球背后的太空中放置了一颗中继卫星“鹊桥”，由它把信号转送回地球。`,
      names: ["嫦娥四号", "鹊桥", "2019"],
      glossed: ["潮汐锁定", "中继卫星", "软着陆", "椭圆"],
      xp: 7,
      questions: [
        question(
          [
            "根据原文，我们在地球上始终看到月球同一面的原因是什么？",
            "Why, according to the text, do we always see the same face of the moon?",
          ],
          ["月球自转一周的时间与绕地球公转一周的时间相同", "The moon turns once on its axis in the same time it takes to circle the earth"],
          [
            ["月球根本不自转", "The moon does not turn at all"],
            ["月球的背面没有阳光照射", "The far side gets no sunlight"],
            ["地球自转的速度和月球公转的速度相同", "The earth spins at the same speed as the moon circles"],
          ],
          [
            "第二段说月球自转一周的时间“恰好和绕地球公转一周的时间相同”，桌子的比方也说明它在自转，只是始终同一面朝着地球。",
            "Paragraph two says the two periods are equal; the table comparison shows the moon does turn, keeping one face to the earth.",
          ],
        ),
        question(
          ["下列对“潮汐锁定”的理解，符合原文的一项是", "Which understanding of tidal locking agrees with the text?"],
          [
            "地球引力作用于月球上的鼓起部分，使月球自转逐渐变慢，直到自转和公转的时间相同",
            "The earth's pull on the moon's bulges slowed its spin until spin and orbit took the same time",
          ],
          [
            ["月球一形成，自转和公转的时间就恰好相同", "Spin and orbit were equal from the moon's very beginning"],
            ["潮汐锁定是地球和月球之间独有的现象", "Tidal locking happens only between the earth and the moon"],
            ["月球的引力使地球的自转和公转时间相同", "The moon's pull made the earth's spin equal its orbit"],
          ],
          [
            "第三段说月球“形成之初，自转比现在快”，是地球引力拉着鼓起部分，“使月球的自转慢慢变慢”；又说太阳系中“许多卫星”都是这样，并非月球独有。",
            "Paragraph three says the moon once spun faster and the earth's pull on its bulges slowed it; many moons in the solar system are locked the same way.",
          ],
        ),
        question(
          [
            "根据原文推断，当我们在地球上看到满月时，月球背面的情况最可能是怎样的？",
            "From the text, what is most likely true of the far side when we see a full moon?",
          ],
          ["大部分处在黑夜之中", "Most of it is in night"],
          [
            ["大部分处在阳光下", "Most of it is in sunlight"],
            ["正好有一半在阳光下", "Exactly half is in sunlight"],
            ["永远处在黑夜之中", "It is always in night"],
          ],
          [
            "第五段说看到新月、正面几乎全暗时，背面“大部分处在阳光下”。满月时正面几乎全被照亮，情况正好相反，背面大部分是黑夜。",
            "At new moon the near side is dark and most of the far side is lit; at full moon the near side is lit, so most of the far side is in night.",
          ],
        ),
        question(
          ["下列说法，不符合原文意思的一项是", "Which statement does NOT agree with the text?"],
          ["月球背面终年照不到阳光，所以被称为“暗面”", "The far side never gets sunlight, which is why it is called the dark side"],
          [
            ["由于月球的摆动，我们能看到月球表面的百分之五十九左右", "Because the moon rocks, we see about 59 percent of its surface"],
            ["嫦娥四号是人类第一个在月球背面软着陆的探测器", "Chang'e 4 was the first probe to land softly on the far side"],
            ["放置中继卫星是因为月球挡住了背面与地球的直接通信", "A relay satellite was needed because the moon blocks direct contact"],
          ],
          [
            "第五段说背面“同样有白天和黑夜，同样被太阳照亮”，称它“暗面”只是因为看不到、了解少，是一个误会。",
            "Paragraph five says the far side has day and night like the near side; “dark” only means unseen and little known.",
          ],
        ),
      ],
    },
    {
      id: "chinese-what-tree-rings-remember",
      title: ["年轮里的记忆", "What Tree Rings Remember"],
      body: `把一棵树横着锯开，截面上会出现一圈圈深浅相间的圆环，这就是年轮。在四季分明的地方，树木每年长出一圈，数一数年轮，就能知道这棵树大约活了多少年。但年轮记下的，远不止树的年龄。

年轮为什么有深有浅？春天和初夏，雨水充足，气温适宜，树木生长得快，长出的细胞大而壁薄，颜色较浅；到了夏末和秋天，生长慢下来，细胞小而壁厚，颜色较深。一浅一深合起来，就是一年。冬天树木几乎停止生长，于是第二年浅色的部分和上一年深色的部分之间，便形成了一条清楚的界线。

年轮的宽窄更有意思。雨水多、气候适宜的年份，树长得快，年轮就宽；遇上干旱或寒冷，年轮就窄。生长在同一地区的树，经历的是同样的天气，所以它们年轮宽窄变化的“图案”大体相同。科学家正是利用这一点，把不同树木的年轮对比起来：一棵活树的年轮可以往前推几百年，一根老木头的年轮如果和它有一段重合，就能接着再往前推。这样一段段接起来，在有的地区，人们已经排出了长达上万年的年轮序列。

有了这样的序列，许多问题就有了答案。一座古建筑的木梁是哪一年砍下的？把它的年轮和序列对一对，往往可以确定到某一年。某个地区几百年前是否经历过长期干旱？连续多年的窄年轮就是证据。有的年轮里还留着火烧的疤痕，记录下当年发生过的山火。

研究年轮并不一定要把树砍倒。科学家常用一种细长的空心钻，从树干上取出一根铅笔粗细的木条，就能看到从树皮到树心的年轮，对树的伤害很小。

当然，这种方法也有局限。在一些常年温暖湿润的热带地区，树木全年都在生长，往往形成不了清楚的年轮。可是在许多地方，一棵棵沉默的树，就像一本本写满了数字的日记，静静地记着大地的过去。`,
      glossed: ["年轮", "序列"],
      xp: 7,
      questions: [
        question(
          ["下列对年轮颜色深浅的解释，符合原文的一项是", "Which explanation of the light and dark bands agrees with the text?"],
          ["浅色部分是树木生长快时长出的大而壁薄的细胞", "The light part is large, thin-walled cells grown when the tree grows fast"],
          [
            ["浅色部分是冬天长出来的", "The light part grows in winter"],
            ["深色部分是春天雨水多时长出来的", "The dark part grows in the rainy spring"],
            ["颜色深浅由树皮的厚薄决定", "The shade depends on how thick the bark is"],
          ],
          [
            "第二段说春天和初夏生长快，细胞“大而壁薄，颜色较浅”；夏末和秋天的细胞“小而壁厚，颜色较深”；冬天几乎停止生长。",
            "Paragraph two: fast spring growth makes large thin-walled light cells; late summer and autumn make small thick-walled dark ones; winter growth nearly stops.",
          ],
        ),
        question(
          [
            "科学家能把不同树木的年轮一段段接起来，依据的是什么？",
            "On what basis can scientists join the rings of different trees end to end?",
          ],
          [
            "同一地区的树经历同样的天气，年轮宽窄变化的图案大体相同",
            "Trees of one region live through the same weather, so their patterns of wide and narrow rings largely match",
          ],
          [
            ["所有的树年轮数目都一样", "All trees have the same number of rings"],
            ["老木头的年轮总比活树的宽", "Old timber always has wider rings than living trees"],
            ["每棵树都能活上万年", "Every tree can live ten thousand years"],
          ],
          [
            "第三段说同一地区的树“经历的是同样的天气”，所以宽窄“图案”大体相同，有重合的部分就能对上、接起来。",
            "Paragraph three: shared weather gives shared patterns, so overlapping stretches can be matched and joined.",
          ],
        ),
        question(
          [
            "一根古代木梁上，有连续十几圈年轮都特别窄。根据原文，最合理的推断是什么？",
            "An old beam shows a dozen narrow rings in a row. What is the most reasonable inference?",
          ],
          ["那些年当地的生长条件很差，可能遇上了干旱或寒冷", "Growing conditions were poor those years, perhaps drought or cold"],
          [
            ["那些年当地雨水特别充足", "Those years were very rainy"],
            ["这根木梁是在热带地区砍下的", "The beam came from the tropics"],
            ["那些年当地一定发生过山火", "There must have been forest fires those years"],
          ],
          [
            "第三段说“遇上干旱或寒冷，年轮就窄”，第四段也说“连续多年的窄年轮”是长期干旱的证据。山火留下的是疤痕，不是窄年轮。",
            "Narrow rings mark drought or cold (paragraph three), and runs of them are evidence of long drought (paragraph four); fire leaves scars, not narrow rings.",
          ],
        ),
        question(
          ["下列说法，不能从原文得出的一项是", "Which statement can NOT be drawn from the text?"],
          ["树干朝南一侧的年轮总是比较宽，可以用来辨别方向", "Rings are always wider on the south side of a trunk, so they show direction"],
          [
            ["一些热带地区的树木往往形成不了清楚的年轮", "Trees in some tropical regions often lack clear rings"],
            ["研究年轮不一定要把树砍倒", "Studying rings does not require felling the tree"],
            ["年轮可以帮助确定古建筑木梁砍伐的年份", "Rings can help date when the timber of an old building was cut"],
          ],
          [
            "原文没有说年轮的宽窄与方向有关；其余三项分别见于第六段、第五段和第四段。",
            "The text never links ring width to direction; the other three appear in paragraphs six, five and four.",
          ],
        ),
      ],
    },
  ],
);

/** gradeTenLives is the literary unit of grade 10: the warmth of ordinary lives. */
const gradeTenLives = unit(
  10,
  "chinese-reading-10-lives",
  ["人间的温度", "The Warmth of Ordinary Lives"],
  [
    {
      id: "chinese-the-substitute-teacher",
      title: ["代课老师", "The Substitute Teacher"],
      body: `班主任生病住院，学校请来一位退休的老教师，给我们代两个星期的语文课。

他第一次走进教室，我们都愣了一下：头发全白了，穿一件洗得发白的蓝色外套，手里没有课本，只拿着一盒粉笔。后排有人小声说：“这是从哪个年代来的？”几个人笑出了声。他好像没听见，在黑板上写下自己的名字：许正平。字写得很大，一笔一画，端端正正。写完，他转过身，看了我们一会儿，说：“我教了四十年书，今天是第一次来你们学校。”

第一节课，他没有讲课文，只给我们布置了一个作业：写一件“没有人知道的小事”。

“什么叫没有人知道？”有人问。

“就是你做过、想过、看见过，可是从来没有告诉过别人的事。”他说，“写多少都行，写好了，可以不写名字。”

大家都觉得这个作业有点奇怪。可是交上去的作文，比平时任何一次都多。有的写了满满三页，有的只有短短几行。

第二个星期的一节课上，许老师读了其中几篇。有一篇写，作者每天放学都绕远路经过一家小店，因为店门口有一只瘸腿的猫，他偷偷给它带了一个学期的吃的；有一篇写，作者的父母分开两年了，可他一直对同学说，爸爸只是出差了；还有一篇写，作者其实很羡慕坐在前排的那个“书呆子”，因为她总能把自己想的事情说清楚。

许老师读的时候，教室里安静极了。他没有评哪一篇写得好，也没有猜作者是谁。读完，他只说了一句：“你们看，每个人心里，都有一些很重要的东西，平时没有机会说出来。写作，就是给它们找一个地方。”

两个星期很快过去了。最后一节课下课时，许老师把粉笔放回盒子里，向我们点了点头，就走了。没有人鼓掌，也没有人说再见。

后来班主任回来了，课又像从前一样上。只是有一次，我在作文本的最后一页，写下了一件没有人知道的小事。写完，我想了很久，没有撕掉。

那是关于第一节课上笑出声的那几个人——里面有我。`,
      names: ["许正平", "许老师"],
      xp: 7,
      questions: [
        question(
          [
            "第二段写许老师“好像没听见，在黑板上写下自己的名字”，表现了他怎样的特点？",
            "In paragraph two Mr Xu seems not to hear and writes his name on the board. What does this show?",
          ],
          ["沉稳宽厚，不与学生计较，从容地面对嘲笑", "Calm and generous: he lets the mockery pass and keeps his composure"],
          [
            ["耳朵不好，真的没有听见", "He is hard of hearing and truly did not hear"],
            ["心里生气，故意不理学生", "He is angry and ignores the class on purpose"],
            ["只关心写字，不关心学生", "He cares about handwriting, not students"],
          ],
          [
            "“好像没听见”说明他其实可能听见了，却不计较；字写得“端端正正”，也写出了他的从容和认真。后文他对学生内心的理解，也证明他并非不关心学生。",
            "“Seemed not to hear” suggests he did hear and let it go; the upright characters show his composure. His later care for the students rules out indifference.",
          ],
        ),
        question(
          ["许老师读的三篇作文，在小说中起什么作用？", "What do the three essays Mr Xu reads do in the story?"],
          [
            "展现学生们不为人知的内心，印证“每个人心里都有一些很重要的东西”，深化主题",
            "They reveal the students' hidden inner lives and bear out that everyone holds something important, deepening the theme",
          ],
          [
            ["说明这个班的学生作文水平很高", "They show the class writes very well"],
            ["批评学生们平时不说真话", "They criticize the students for not telling the truth"],
            ["交代许老师离开学校的原因", "They explain why Mr Xu left the school"],
          ],
          [
            "瘸腿的猫、父母分开的秘密、对同学的羡慕，都是“平时没有机会说出来”的心事，正好引出许老师那句话，点明写作的意义。",
            "The lame cat, the family secret and the quiet envy are things never said aloud; they lead into Mr Xu's words about what writing is for.",
          ],
        ),
        question(
          [
            "“没有人鼓掌，也没有人说再见”一句，下列理解最恰当的一项是",
            "Which is the best reading of “Nobody clapped, and nobody said goodbye”?",
          ],
          [
            "平淡地写出离别的安静，也暗含学生们当时没能说出口的感情，为结尾“我”的反省蓄势",
            "It flatly records a quiet parting that hides feelings the students could not yet voice, preparing the narrator's self-reproach",
          ],
          [
            ["说明学生们都很讨厌许老师", "It shows the students all disliked him"],
            ["说明许老师走得太快，大家来不及反应", "It shows he left too fast for anyone to react"],
            ["批评学校对退休教师不够重视", "It criticizes the school for neglecting retired teachers"],
          ],
          [
            "学生们交上了比平时更多的作文，读作文时“教室里安静极了”，可见他们被打动了；离别时却什么也没做，这份沉默正为结尾“我”写下那件小事埋下伏笔。",
            "The class wrote more than ever and listened in silence, so they were moved; yet they did nothing at parting, a silence the ending answers.",
          ],
        ),
        question(
          ["小说结尾一句有什么作用？", "What does the last sentence do?"],
          [
            "揭示“我”曾嘲笑过许老师，照应前文，表现“我”的愧疚和成长，出人意料又在情理之中",
            "It reveals the narrator laughed at Mr Xu, echoing the opening and showing remorse and growth: surprising yet fitting",
          ],
          [
            ["说明“我”的作文写得最好", "It shows the narrator wrote the best essay"],
            ["交代许老师后来又回来上课", "It tells us Mr Xu came back to teach"],
            ["说明“我”至今仍然看不起许老师", "It shows the narrator still looks down on him"],
          ],
          [
            "第二段只说“几个人笑出了声”，结尾才说其中有“我”。这件“没有人知道的小事”正是“我”的愧疚，也说明许老师的作业真正走进了“我”的心里。",
            "Paragraph two says only that a few laughed; the end admits the narrator was one. This unknown small thing is his remorse, proof the assignment reached him.",
          ],
        ),
      ],
    },
    {
      id: "chinese-listening-to-the-rain",
      title: ["听雨", "Listening to the Rain"],
      body: `小时候住在乡下，房子是瓦房。一下雨，雨点先落在屋顶的瓦片上，叮叮当当，密一阵，疏一阵，然后顺着瓦沟汇成细流，从屋檐上挂下来，落在门前的石板上，滴答，滴答。那时我躺在床上，听着雨声，总觉得雨是从很远的地方赶来，专门给我讲故事的。

祖母说，听雨要听得出雨的脾气。春雨细，落在新叶上几乎没有声音，要屏住呼吸才听得见；夏天的雨急，来的时候像一群人跑过屋顶，走的时候也不打招呼；秋雨最长，一下就是好几天，一声一声，敲得人心里发凉。我那时不懂，只记得祖母说这些话时，手里的针线并不停下。

后来进了城，住进了高楼。窗户关得严严的，雨落在玻璃上，只留下一道道斜斜的水痕，没有声音。城里的雨声倒也有，汽车开过积水的路面，哗的一声，很快又被别的声音盖过去了。有时下了一夜雨，早上出门看见地上湿了，才知道昨晚原来下过雨。我说不清自己丢了什么，只是觉得，城里的雨好像只是一种天气，而不再是一位来访的客人。

去年秋天，我回乡下看祖母。夜里下起雨来，我睡不着，索性坐在窗边听。雨还是从瓦片上开始，还是顺着屋檐挂下来，还是落在那块石板上，密一阵，疏一阵，好像二十年来一直没有停过。我拿着手电筒出去看，石板中间，竟被滴出了一个浅浅的小坑。我忽然明白，这块石板听了几十年的雨，雨也在它身上留下了自己的名字。

隔壁屋里，祖母咳嗽了两声，问：“下雨了？”我说：“下了，是秋雨。”她应了一声，再没说话。雨声里，我听见她翻了个身，又听见她轻轻地叹了口气。

雨年年都是一样的雨，听雨的人却在一年年地变。小时候，我在雨声里听见的是故事；如今，我听见的是祖母越来越轻的呼吸，是自己再也回不去的那些夜晚。而那块石板上的小坑，是雨一滴一滴写给时间的信。`,
      xp: 7,
      questions: [
        question(
          [
            "第二段祖母说“听雨要听得出雨的脾气”，下列理解不正确的一项是",
            "Grandmother says one must hear the rain's temper. Which reading is NOT correct?",
          ],
          ["祖母是在批评“我”听雨不够认真", "Grandmother is scolding the narrator for not listening closely"],
          [
            ["“脾气”一词把雨当作人来写，是拟人", "“Temper” treats the rain as a person: personification"],
            ["这一段写出了春雨、夏雨、秋雨各自的特点", "The paragraph gives the traits of spring, summer and autumn rain"],
            ["这些话表现了祖母对生活细腻的感受", "Her words show her fine feeling for everyday life"],
          ],
          [
            "祖母是一边做针线一边说给“我”听的，是在分享自己对雨的体会，文中看不出批评的意思。",
            "She speaks while sewing, sharing what she has noticed about rain; nothing in the text suggests a rebuke.",
          ],
        ),
        question(
          [
            "第三段说城里的雨“不再是一位来访的客人”，表达了作者怎样的感受？",
            "What feeling lies behind “no longer a visiting guest” in paragraph three?",
          ],
          [
            "城市生活隔开了人与自然的亲近，作者为失去从前听雨的心境而失落",
            "City life has cut him off from nature; he feels the loss of how he once listened",
          ],
          [
            ["作者庆幸城里的雨不会打扰睡眠", "He is glad city rain does not disturb his sleep"],
            ["作者认为城里很少下雨", "He thinks it seldom rains in the city"],
            ["作者讨厌下雨，希望雨不要来", "He dislikes rain and wishes it would stay away"],
          ],
          [
            "乡下的雨像“专门给我讲故事的”客人，城里的雨隔着玻璃“没有声音”，只是“一种天气”。“我说不清自己丢了什么”写出了失落。",
            "In the village rain came like a storyteller; in the city it is silent behind glass, mere weather. “I could not say what I had lost” shows the loss.",
          ],
        ),
        question(
          ["石板上“浅浅的小坑”这一细节在文中有什么作用？", "What does the shallow hollow in the flagstone do in the essay?"],
          [
            "以具体的物象表现时间的积累和流逝，照应开头，引出作者对岁月的感悟",
            "It makes the passing and building up of time concrete, echoes the opening and leads to the writer's reflection on the years",
          ],
          [
            ["说明石板质量不好，需要更换", "It shows the stone is poor and should be replaced"],
            ["说明那一夜的雨下得特别大", "It shows that night's rain was especially heavy"],
            ["说明祖母家的房子已经很破旧", "It shows Grandmother's house is run down"],
          ],
          [
            "开头写雨“落在门前的石板上”，这里石板被“滴出了一个浅浅的小坑”，是几十年雨滴的积累；结尾又说小坑是“写给时间的信”，由物及情。",
            "The opening's flagstone returns, worn hollow by decades of drops; the ending calls it a letter to time, moving from thing to feeling.",
          ],
        ),
        question(
          [
            "第五段写祖母“再没说话”，又“轻轻地叹了口气”，有什么作用？",
            "Grandmother falls silent and sighs softly in paragraph five. What does this do?",
          ],
          [
            "含蓄地写出祖母的年老和心事，暗示岁月流逝，加深“我”的感慨",
            "It quietly suggests her age and her thoughts, hints at time passing and deepens the narrator's feeling",
          ],
          [
            ["说明祖母不愿意和“我”说话", "It shows she does not want to talk to the narrator"],
            ["说明祖母很讨厌下雨", "It shows she hates rain"],
            ["说明祖母病得很重，需要马上去医院", "It shows she is gravely ill and must go to hospital"],
          ],
          [
            "从前说起雨来滔滔不绝的祖母，如今只“嗯”了一声。这一对比写出了她的衰老，下文“越来越轻的呼吸”也由此而来。",
            "The grandmother who once talked about rain at length now only murmurs; the contrast shows her ageing and leads to her ever fainter breathing.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-letter-never-sent",
      title: ["没有寄出的信", "The Letter Never Sent"],
      body: `外公去世后的第一个春天，阿宁帮妈妈整理外公的旧书。一本发黄的诗集里，掉出来一个信封。信封上写着地址和收信人的名字：沈文远。没有贴邮票，封口却粘得好好的。

妈妈拿起来看了很久，说：“沈伯伯，是你外公年轻时最好的朋友。后来不知道为什么，两个人再也不来往了。”

“为什么呢？”阿宁问。妈妈摇摇头：“你外公不说，我也就没问。只记得我小时候，沈伯伯常来家里，两个人坐在院子里喝茶聊天，一聊就是一个下午。有一年过年，他没有来，后来就再也没来过。”

信封已经很旧，边角磨得起了毛。阿宁想，外公一定把它拿出来过很多次，又放了回去。

那天晚上，她查到信封上的那条街早已改了名字，原来的房子也拆了。她本可以就此作罢，可是想到外公每次说起“年轻的时候”，总会在某个地方停下来，望着窗外不说话，她便决定再试一试。她去了老街附近的居委会，问了几位上了年纪的老人，又在网上发了好几条寻人的消息。

找了一个多月，她终于打听到沈家后来搬去了城东。开门的是一位五十多岁的阿姨，听说她的来意，愣了好一会儿，才把她让进屋里。

“我父亲前年走了。”阿姨轻声说。她走进里屋，拿出一个铁皮盒子，从里面取出一叠信，“这些都是他写给你外公的，一封也没寄出去。他也总说，等哪天有空了，就去找你外公。”

阿宁接过来。最上面那封的日期，是三十年前；最下面的一封，字已经写得歪歪斜斜，日期是沈伯伯去世前一个月。她数了数，一共二十三封。

两个人对着那一叠信，谁也没有说话。窗外有人在放风筝，线拉得很长，风筝飞得很高，看上去像是一动不动地停在天上。

“要不要打开看看？”阿姨问。

阿宁想了想，摇了摇头。她把外公的那封信，轻轻放进了铁皮盒子里，和沈伯伯的那些信放在一起。

“就让它们在一起吧。”她说。`,
      names: ["阿宁", "沈文远", "沈伯伯", "沈家"],
      xp: 7,
      questions: [
        question(
          [
            "第三段写信封“边角磨得起了毛”，这一细节有什么作用？",
            "What does the detail of the envelope's frayed corners in paragraph three do?",
          ],
          [
            "暗示外公多次拿出又放回，内心反复犹豫，始终放不下这份友情",
            "It hints that Grandpa took it out and put it back many times, torn, never letting the friendship go",
          ],
          [
            ["说明这封信在路上走了很久", "It shows the letter spent a long time in the post"],
            ["说明外公不爱惜东西", "It shows Grandpa did not care for his things"],
            ["说明信封的纸质量不好", "It shows the envelope was cheap paper"],
          ],
          [
            "信没有贴邮票，从没寄出，却磨得起了毛，只能是外公常常拿出来看。阿宁的推想“拿出来过很多次，又放了回去”点出了他的犹豫和牵挂。",
            "The unstamped letter was never posted, yet it is worn: Grandpa must have handled it often. Aning's guess points to his hesitation and longing.",
          ],
        ),
        question(
          ["第八段关于风筝的描写有什么作用？", "What does the kite in paragraph eight do?"],
          [
            "借景写情：线拉得很长、风筝像停在天上，暗示两位老人相隔很远却始终牵连，也营造出静默的气氛",
            "Scene carries feeling: the long string and still kite hint that the two old men were far apart yet always tied, and set a hushed mood",
          ],
          [
            ["交代故事发生在春天，与情节无关", "It only says it is spring and has nothing to do with the plot"],
            ["说明阿姨家附近很热闹", "It shows the neighbourhood is lively"],
            ["表现阿宁想出去放风筝", "It shows Aning wants to go and fly a kite"],
          ],
          [
            "两个人对着信“谁也没有说话”，窗外的风筝线长而不断，飞得高而“一动不动”，正像两位老人断了往来，心却一直连着。",
            "As the two sit silent, the kite's long unbroken string and stillness mirror two men out of touch yet still bound.",
          ],
        ),
        question(
          [
            "阿宁最后没有打开信，而是把外公的信和沈伯伯的信放在一起。下列理解最恰当的一项是",
            "Aning leaves the letters unopened and puts Grandpa's with Shen's. Which reading is best?",
          ],
          [
            "她尊重两位老人没有说出口的心事，让迟到的情谊以这种方式团聚",
            "She respects what the two old men never said and lets their belated friendship meet in this way",
          ],
          [
            ["她害怕信里写着两人争吵的原因", "She fears the letters reveal their quarrel"],
            ["她对外公的往事并不感兴趣", "She is not interested in her grandfather's past"],
            ["她想早点离开，不愿再多停留", "She wants to leave and not stay any longer"],
          ],
          [
            "阿宁花了一个多月去找，并非不感兴趣；两人各写了信又都没寄，是心里有话说不出。“就让它们在一起吧”，是让两份心意终于相聚。",
            "She searched for a month, so she cares; both men wrote and never sent. “Let them be together” lets the two unsent hearts finally meet.",
          ],
        ),
        question(
          ["下列对这篇小说写法的分析，最恰当的一项是", "Which best describes how the story is written?"],
          [
            "始终没有交代两人为什么不再来往，以留白增加小说的含蓄和余味",
            "It never says why the two men stopped meeting, and the gap adds to its restraint and lingering effect",
          ],
          [
            ["用倒叙的方法，开头就交代了两人断交的原因", "It opens with a flashback explaining the quarrel"],
            ["用第一人称“我”直接抒发感情", "A first-person narrator pours out feelings directly"],
            ["结尾把两封信的内容全部写了出来", "The ending gives the full text of the letters"],
          ],
          [
            "妈妈说“不知道为什么”，信也始终没有打开。读者和阿宁一样，只能从信的数量和日期去体会两位老人的心事，这正是留白的效果。",
            "Mother does not know why, and the letters stay sealed; readers, like Aning, infer the men's feelings from the dates and number of letters.",
          ],
        ),
      ],
    },
  ],
);

/** gradeElevenDebates is the argument unit of grade 11: weighing many views. */
const gradeElevenDebates = unit(
  11,
  "chinese-reading-11-debates",
  ["多元的视野", "Weighing Many Views"],
  [
    {
      id: "chinese-who-should-choose-for-us",
      title: ["谁来替我们选择", "Who Should Choose for Us"],
      body: `打开手机，首页上推来的新闻、视频和商品，似乎总是“恰好”合你的心意。这背后是推荐算法：它记录你点过什么、看了多久、买过什么，再推测你还会喜欢什么。对于这种技术，人们的看法很不一致。

支持者认为，算法帮人节省了时间。信息多到任何人都看不完，如果没有筛选，人们反而会被淹没。一个喜欢天文的学生，可能正是因为算法的推荐，才发现了一位讲得极好的天文学者。何况，推荐并不是强迫，用户随时可以不看、不点。在他们看来，算法不过是一位更勤快的图书管理员。

批评者则担心，算法会把人关进一间看不见的屋子。人们越是只看自己喜欢的，算法就越是只推这些，久而久之，一个人看到的世界越来越窄，却以为世界本来就是这个样子。更令人不安的是，许多平台设计算法的首要目标，并不是让用户更明智，而是让用户停留得更久。于是，最能抓住眼球的内容，未必是最有价值的内容，却常常被推到最前面。还有人担心，越是让人激动、让人愤怒的内容，越容易被转来转去，也就越容易被推荐。

这两种看法各有道理，但都容易走向极端：前者把算法当成中立的工具，后者把算法当成操纵人的力量。其实，算法既不是中立的，也不是全能的。说它不中立，是因为每一个算法背后，都有人决定它要优先考虑什么；说它不全能，是因为它只能根据人们过去的行为推测未来，而人恰恰是会改变的，会对从未接触过的东西产生兴趣。

因此，问题的关键不在于要不要算法，而在于谁来为算法设定目标，用户又能在多大程度上看清、调整它。对平台来说，应当公开推荐的基本规则，并为用户提供关闭个性化推荐或者调整偏好的选项；对社会来说，需要通过规则和监督，防止算法为了利益而损害公众。对每个人来说，也不能把选择完全交给机器：主动去读一本与自己观点不同的书，去看一个从不关心的领域，就是给那间屋子开一扇窗。

技术越是聪明，人越需要清醒。让算法替我们找东西并不可怕，可怕的是我们渐渐忘了，自己本来还可以去找别的东西。`,
      glossed: ["算法", "个性化"],
      xp: 8,
      questions: [
        question(
          ["下列对作者观点的概括，最准确的一项是", "Which best sums up the writer's position?"],
          [
            "关键不在要不要算法，而在谁为它设定目标、用户能否看清和调整，个人也不能把选择全交给机器",
            "The point is not whether to have algorithms but who sets their goals and whether users can see and adjust them; nor should anyone hand all choice to machines",
          ],
          [
            ["算法帮人节省时间，应当完全信任它", "Algorithms save time and should be fully trusted"],
            ["算法会操纵人，应当彻底停止使用", "Algorithms manipulate people and should be abandoned"],
            ["支持者和批评者的看法都没有道理", "Neither supporters nor critics have a point"],
          ],
          [
            "第五段明确说“问题的关键不在于要不要算法，而在于谁来为算法设定目标……”，并分别对平台、社会和个人提出要求。第四段也说两种看法“各有道理”。",
            "Paragraph five states the key question and asks things of platforms, society and individuals; paragraph four grants both views some truth.",
          ],
        ),
        question(
          ["第四段在全文结构上起什么作用？", "What does paragraph four do in the structure of the essay?"],
          [
            "评析前面两种看法各自的偏颇，提出算法既不中立也不全能，为下文的主张做铺垫",
            "It weighs the two views, shows where each goes too far, argues algorithms are neither neutral nor all-powerful, and prepares the proposals",
          ],
          [
            ["补充支持者的理由，证明算法是中立的工具", "It adds reasons for the supporters, proving algorithms neutral"],
            ["举出新的例子，证明批评者是对的", "It gives new examples proving the critics right"],
            ["总结全文，提出最终的结论", "It sums up the whole essay with the final conclusion"],
          ],
          [
            "第二、三段分述两方，第四段先说二者“都容易走向极端”，再提出作者自己的判断，第五段才据此提出具体主张。",
            "Paragraphs two and three give each side; four finds both prone to extremes and offers the writer's own judgement, on which five builds.",
          ],
        ),
        question(
          [
            "第二段“算法不过是一位更勤快的图书管理员”，下列分析最恰当的一项是",
            "Which is the best analysis of “an algorithm is only a more diligent librarian” in paragraph two?",
          ],
          [
            "用比喻表明支持者把算法看作中立的帮手，这正是作者在第四段所反驳的看法",
            "The metaphor shows supporters see algorithms as neutral helpers, the very view the writer rebuts in paragraph four",
          ],
          [
            ["这是作者本人对算法的最终评价", "It is the writer's own final verdict on algorithms"],
            ["说明算法将来会代替图书管理员", "It means algorithms will replace librarians"],
            ["说明图书管理员的工作不如算法重要", "It means librarians matter less than algorithms"],
          ],
          [
            "这句话出现在“在他们看来”之后，是支持者的看法。图书管理员只帮人找书，不替人决定读什么；第四段指出“前者把算法当成中立的工具”，并说算法“不是中立的”。",
            "It follows “in their view”, so it is the supporters'. A librarian only helps find books; paragraph four says this side treats algorithms as neutral, which they are not.",
          ],
        ),
        question(
          ["下列推断，不能从原文得出的一项是", "Which inference can NOT be drawn from the passage?"],
          ["作者认为个性化推荐应当被全面禁止", "The writer thinks personalized recommendation should be banned outright"],
          [
            [
              "平台把用户停留时间作为首要目标，可能使有价值的内容被埋没",
              "Making time on the platform the main goal may bury valuable content",
            ],
            ["人的兴趣会改变，所以算法推测未来有局限", "Interests change, so an algorithm's forecasts are limited"],
            [
              "主动接触不同的观点，可以减轻只看自己喜欢的内容带来的局限",
              "Seeking out other views eases the narrowing of seeing only what one likes",
            ],
          ],
          [
            "作者只主张为用户提供“关闭个性化推荐或者调整偏好的选项”，并明确说关键“不在于要不要算法”，并没有主张全面禁止。",
            "The writer asks only for an option to switch it off or adjust it, and says the issue is not whether to have algorithms; no ban is proposed.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-right-to-be-forgotten",
      title: ["数字时代的遗忘", "Forgetting in a Digital Age"],
      body: `从前，一个人年少时说过的傻话、做过的错事，随着时间流逝，大多会被人淡忘。今天却不一样了。一条多年前发在网上的消息，一张不经意间被拍下的照片，都可能被人重新找出来，跟着一个人很多年。于是，人们开始讨论一个新问题：在数字时代，人是否有“被遗忘”的权利？

主张这种权利的人认为，遗忘是社会的一种宽容。人会成长，会改正，一个十五岁时犯下的错误，不应该成为他三十岁时找工作的障碍。如果网络把每个人的过去都永远保存，并且随时可以搜出来，人就失去了重新开始的机会，也会因此变得小心翼翼，不敢表达，不敢尝试。在一些国家和地区，法律已经规定，在一定条件下，个人可以要求删除与自己有关的过时信息。

反对者则提出了不同的担心。一方面，删除信息可能妨碍公众的知情权。一个曾经欺骗消费者的商人，一个有过失职记录的官员，如果都可以要求“被遗忘”，公众又怎样作出判断？另一方面，信息一旦删除，历史记录就会出现空白。今天看来不重要的东西，也许正是将来研究这个时代的珍贵材料。由谁来决定什么该删、什么该留，本身就是一个难题。

细看这两种意见，它们的分歧并不在于记忆和遗忘哪一个更好，而在于怎样在个人和公众之间划出界线。被遗忘的要求，针对的应当主要是普通人与公共利益关系不大、而且已经过时的信息；与公共利益密切相关的信息，尤其是掌握权力的人和机构的记录，则需要保存得更久、更完整。同时，“被遗忘”也不必意味着彻底销毁：信息可以不再出现在搜索结果的前面，却仍然保存在档案中，供有正当理由的人查阅。这样，既给个人留下了重新开始的余地，又不至于抹去历史。

更深一层看，问题还不只在法律和技术上。即使网络记住了一切，我们仍然可以选择怎样去看一个人的过去。如果一个社会习惯于用一个人最坏的时刻来定义他，那么再好的法律也难以给人真正的宽容；反过来，如果人们愿意相信成长和改变，那么即使旧事被人翻出，它也只是一个人的过去，而不是他的全部。

记住，是为了不重复错误；遗忘，是为了让人能够继续向前。在数字时代，我们要学的，也许不是二者选其一，而是在二者之间保持平衡。`,
      glossed: ["知情权", "失职"],
      xp: 8,
      questions: [
        question(
          ["下列对作者观点的概括，最准确的一项是", "Which best sums up the writer's position?"],
          [
            "应当在个人和公众之间划出界线，在记住与遗忘之间保持平衡，而不是简单地二者选其一",
            "We should draw a line between person and public and balance remembering and forgetting, not simply pick one",
          ],
          [
            ["每个人都有权删除网上与自己有关的一切信息", "Everyone may delete all information about themselves online"],
            ["为了保存历史，网上的任何信息都不应删除", "To keep history, nothing online should ever be deleted"],
            ["这个问题只能靠法律解决，与人们的态度无关", "Only law can settle this; attitudes do not matter"],
          ],
          [
            "第四段指出分歧在于“怎样在个人和公众之间划出界线”，结尾说要学的“不是二者选其一，而是在二者之间保持平衡”；第五段还强调问题“不只在法律和技术上”。",
            "Paragraph four locates the dispute in the line between person and public; the end calls for balance; paragraph five says law alone is not enough.",
          ],
        ),
        question(
          ["第四段在全文中起什么作用？", "What does paragraph four do in the essay?"],
          [
            "在分析正反两方意见的基础上，指出分歧的实质，并提出兼顾双方的具体主张",
            "Building on both sides, it names the real point of dispute and proposes concrete terms that serve both",
          ],
          [
            ["补充反对者的理由，证明被遗忘的权利不应存在", "It adds to the opponents' case, proving there should be no such right"],
            ["引出一个与前文无关的新话题", "It opens a topic unrelated to what came before"],
            ["用事例证明主张者的看法完全正确", "It uses examples to prove the supporters entirely right"],
          ],
          [
            "第二、三段分别写主张者和反对者，第四段先说“分歧并不在于……而在于……”，再提出区分信息种类、“不必意味着彻底销毁”等办法，兼顾了双方的关切。",
            "After the two sides, paragraph four restates the real dispute and proposes sorting kinds of information and not destroying them, meeting both concerns.",
          ],
        ),
        question(
          [
            "第三段举“欺骗消费者的商人”“有过失职记录的官员”，主要是为了说明什么？",
            "Paragraph three mentions a merchant who cheated customers and an official with a record of negligence. Mainly to show what?",
          ],
          [
            "有些信息关系公共利益，删除它们会妨碍公众的知情权",
            "Some information bears on the public good, and deleting it harms the public's right to know",
          ],
          [
            ["商人和官员最容易犯错", "Merchants and officials make the most mistakes"],
            ["所有犯过错的人都不应该得到原谅", "No one who has done wrong should be forgiven"],
            ["普通人的信息比商人和官员的更重要", "Ordinary people's information matters more than theirs"],
          ],
          [
            "两个例子紧跟在“删除信息可能妨碍公众的知情权”之后，用来支持反对者的第一点担心；第四段也据此提出掌握权力者的记录要“保存得更久、更完整”。",
            "They follow the claim that deletion may harm the right to know, supporting the opponents' first worry; paragraph four then keeps such records longer.",
          ],
        ),
        question(
          ["下列推断，不符合作者观点的一项是", "Which inference does NOT agree with the writer's view?"],
          ["凡是与个人有关的信息，个人都有权要求彻底删除", "People may demand the complete deletion of any information about themselves"],
          [
            ["“被遗忘”不一定意味着把信息彻底销毁", "Being forgotten need not mean destroying the information"],
            ["掌握权力的人和机构的记录应当更完整地保存", "The records of the powerful should be kept more fully"],
            ["社会是否愿意相信人会改变，与法律同样重要", "Whether society believes people change matters as much as law"],
          ],
          [
            "作者认为被遗忘的要求“主要”针对与公共利益关系不大的过时信息，而且可以“不再出现在搜索结果的前面”而仍然保存，并不赞成个人可以要求彻底删除一切。",
            "The writer limits the claim mainly to outdated information of little public interest and prefers demoting it in search to destroying it.",
          ],
        ),
      ],
    },
    {
      id: "chinese-imitation-and-creation",
      title: ["模仿与创造", "Imitation and Creation"],
      body: `关于创造，流行着一种浪漫的想象：真正的天才是从无到有，凭空想出前人从未想过的东西；模仿则是创造的反面，是缺少才华的人才会走的路。这种看法激励过许多年轻人去追求与众不同，却也让不少人误解了创造究竟从何而来。

先看看学习一门技艺的过程。学书法的人，往往要先临帖，一笔一画地照着前人的字写，写上几年，手上才有了分寸；学写作的人，也常常从仿写好文章开始，学它怎样开头，怎样转折，怎样收尾。学说话的孩子更是如此，他们说出的第一句话，几乎全是从大人那里学来的。可以说，没有一种技艺是不经过模仿就能掌握的。模仿不是创造的反面，而是创造的地基。

不过，也有人提出了相反的担心：模仿久了，人就会被别人的样子框住，再也走不出来。这种担心同样有事实依据。历史上许多一时流行的风格，跟随的人成群结队，作品却千篇一律，留下来的寥寥无几。相传画家齐白石曾告诫学生：“学我者生，似我者死。”学的是方法和精神，就能活出自己；只求画得像，就失去了生命。

那么，问题就不在于要不要模仿，而在于怎样模仿、模仿到什么时候为止。好的模仿，是一边学一边问：前人为什么这样写？换一种写法会怎样？这个问题在今天还成立吗？带着问题去学，模仿就成了一种理解；理解得深了，人自然会发现前人没有走到的地方，那里就是创造的起点。坏的模仿，则只停留在表面，学到的是样子而不是道理，学得越像，离自己越远。

还应该看到，创造从来不是一个人的事。所谓“前人从未想过的东西”，往往是把已有的东西用新的方式组合起来，或者把一个领域的方法用到另一个领域。许多诗人的名句，细看都能在前人的诗里找到影子，可是经过他们的手，旧的字句有了新的意思。从这个意义上说，一个人见过、学过的东西越多，可供组合的材料就越丰富，创造的可能也就越大。那些看似凭空而来的灵感，背后多半是长年的积累。

所以，不必害怕模仿，也不必迷信“凭空”。先老老实实地学，再认认真真地问，最后勇敢地走出一步，这或许才是创造真实的样子。`,
      names: ["齐白石"],
      glossed: ["临帖"],
      xp: 8,
      questions: [
        question(
          ["第一段写关于创造的“浪漫的想象”，在文中起什么作用？", "What does the “romantic picture” of creation in paragraph one do?"],
          [
            "先摆出一种流行的看法作为讨论的对象，引出作者对模仿与创造关系的重新思考",
            "It sets up a popular view as the target of discussion, leading to the writer's rethinking of imitation and creation",
          ],
          [
            ["表明作者完全赞同这种看法", "It shows the writer fully agrees with it"],
            ["说明年轻人都缺少才华", "It shows young people lack talent"],
            ["交代文章的写作时间和背景", "It gives the time and setting of writing"],
          ],
          [
            "第一段说这种看法“让不少人误解了创造究竟从何而来”，第二段随即提出“模仿不是创造的反面，而是创造的地基”，可见它是被讨论、被修正的对象。",
            "Paragraph one says the view has misled many, and paragraph two counters that imitation is creation's foundation: it is the view to be corrected.",
          ],
        ),
        question(
          ["第二段与第三段之间是什么关系？", "How are paragraphs two and three related?"],
          [
            "第二段论证模仿是创造的地基，第三段引出相反的担心并承认它有道理，两段从正反两面为第四段的观点做准备",
            "Two argues imitation underlies creation; three raises the opposite worry and grants it; together they prepare paragraph four",
          ],
          [
            ["第三段完全推翻了第二段的观点", "Three wholly overturns two"],
            ["第三段只是为第二段补充例子", "Three merely adds examples to two"],
            ["两段讲的是两个毫无联系的问题", "They treat two unrelated questions"],
          ],
          [
            "第三段用“不过”转入相反的担心，并说它“同样有事实依据”，但没有否定模仿的必要；第四段于是说“问题就不在于要不要模仿，而在于怎样模仿”。",
            "“However” turns to the worry and grants it evidence without denying imitation's need; four then says the question is how, not whether, to imitate.",
          ],
        ),
        question(
          ["第三段引用齐白石的话，主要是为了说明什么？", "Why mainly does paragraph three quote Qi Baishi?"],
          [
            "只求形似的模仿会扼杀创造，学到方法和精神才能自成一家",
            "Imitating only the look kills creation; learning the method and spirit lets one become oneself",
          ],
          [
            ["学画画不应当向老师学习", "One should not learn painting from a teacher"],
            ["齐白石反对学生学画", "Qi Baishi was against students learning painting"],
            ["画得越像，作品越有生命", "The closer the copy, the more alive the work"],
          ],
          [
            "引文后的两句解释了它：“学的是方法和精神，就能活出自己；只求画得像，就失去了生命。”这支持了第三段关于模仿有风险的一面。",
            "The next sentences explain it: learn method and spirit and you live; seek only likeness and you lose life. It supports the risks of imitation.",
          ],
        ),
        question(
          ["下列说法，不符合原文意思的一项是", "Which statement does NOT agree with the passage?"],
          ["作者认为凭空产生的灵感才是真正的创造", "The writer holds that only inspiration from nowhere is true creation"],
          [
            ["创造往往是把已有的东西用新的方式组合起来", "Creation is often old things combined in new ways"],
            ["带着问题去模仿，模仿就成了一种理解", "Imitating with questions in mind turns imitation into understanding"],
            ["见过、学过的东西越多，创造的可能也就越大", "The more one has seen and learned, the more one may create"],
          ],
          [
            "第五段说看似凭空而来的灵感“背后多半是长年的积累”，结尾也说“不必迷信‘凭空’”，与这一项相反。",
            "Paragraph five says seemingly sudden inspiration usually rests on years of work, and the end warns against worshipping “from nowhere”.",
          ],
        ),
      ],
    },
  ],
);

/** gradeElevenDisciplines is the informational unit of grade 11: through the eyes of a discipline. */
const gradeElevenDisciplines = unit(
  11,
  "chinese-reading-11-disciplines",
  ["学科的眼光", "Through the Eyes of a Discipline"],
  [
    {
      id: "chinese-how-historians-weigh-sources",
      title: ["史料的辨析", "How Historians Weigh Their Sources"],
      body: `历史学家研究过去，可过去已经不在了。他们能依靠的，只有过去留下来的痕迹：文献、档案、碑刻、器物、建筑，乃至一张旧照片、一本账本。这些痕迹统称为史料。历史研究的第一步，就是弄清手中的史料能说明什么、不能说明什么。

史料通常分为两类。由事件的亲历者或者同时代的人留下的，称为一手史料，比如当时的书信、日记、官府文书；后人根据一手史料整理、研究写成的，称为二手史料，比如后世编写的史书和今天的研究著作。一般说来，一手史料离事件更近，更受重视。但这并不意味着一手史料就一定可靠。写日记的人可能只看到了事情的一面，官府的文书可能出于某种需要夸大成绩、掩盖问题，亲历者回忆多年前的往事，也难免记错细节。

因此，历史学家对任何一条史料，都要追问几个问题：它是谁留下的？在什么时候、什么情况下留下的？留下它的人是否有条件了解真相？他有没有理由说假话，或者只说一部分？这一过程，可以叫做史料的辨析。

辨析史料的一个重要方法，是把不同来源的材料互相对照。如果几种彼此独立的材料都指向同一个结论，这个结论就比较可信；如果只有一条材料这样说，其他材料都没有提到，历史学家便会格外谨慎，常说的“孤证不立”就是这个意思。这里的关键是“彼此独立”：十本书如果都抄自同一本更早的书，那它们实际上只相当于一个证据。

文字之外，实物也是重要的史料。考古发掘出土的器物，常常能补充甚至纠正文献的记载。文献说某地曾是繁华的都城，如果在那里发现了大规模的城墙、道路和作坊遗址，记载就得到了印证；反过来，如果文献中的某些说法与出土实物不符，研究者就需要重新思考文献的可靠程度。

还要看到，史料能留下来，本身就带有偶然性。在古代，能写字、有条件留下文字的人只是少数，普通人的生活往往很少进入记载；纸张、木头容易腐坏，石头、金属更容易保存。所以，史料没有记载的事情，并不等于没有发生过。好的历史学家，不仅读史料说了什么，还会想一想它为什么这样说，以及它没有说什么。

正因为如此，历史结论总是可以随着新史料的发现和新方法的出现而修正。这不是历史学的弱点，恰恰是它求真的方式。`,
      glossed: ["史料", "孤证不立", "碑刻"],
      xp: 8,
      questions: [
        question(
          ["下列对一手史料的理解，符合原文的一项是", "Which understanding of primary sources agrees with the text?"],
          [
            "一手史料离事件更近，更受重视，但不一定可靠，同样需要辨析",
            "They are closer to events and valued more, but not always reliable, and must be weighed too",
          ],
          [
            ["一手史料都是官府留下的文书", "They are all official documents"],
            ["一手史料一定比二手史料可靠", "They are always more reliable than secondary sources"],
            ["今天的研究著作属于一手史料", "Today's scholarly works are primary sources"],
          ],
          [
            "第二段说一手史料“更受重视”，又说“这并不意味着一手史料就一定可靠”，并举出日记、文书、回忆可能出错的情况；研究著作属于二手史料。",
            "Paragraph two values them more but says this does not make them reliable, citing diaries, documents and memory; modern studies are secondary.",
          ],
        ),
        question(
          [
            "第四段说“十本书如果都抄自同一本更早的书，那它们实际上只相当于一个证据”，这句话强调的是什么？",
            "Paragraph four says ten books copied from one earlier book count as one piece of evidence. What does this stress?",
          ],
          [
            "互相对照的材料必须彼此独立，才能增加结论的可信度",
            "Sources compared must be independent of each other to make a conclusion more credible",
          ],
          [
            ["书越多，结论越可信", "The more books, the more credible the conclusion"],
            ["较早的书一定比较晚的书可靠", "Earlier books are always more reliable than later ones"],
            ["历史学家不应该读抄来的书", "Historians should not read copied books"],
          ],
          [
            "这句话紧跟在“这里的关键是‘彼此独立’”之后，说明来源相同的材料不能算作互相印证。",
            "It follows “the key is independence”: sources with one origin do not confirm each other.",
          ],
        ),
        question(
          [
            "某部古代地方志记载当地某年有一场大旱，同时期的其他文献都没有提到，也还没有发现其他证据。根据原文，历史学家应当怎样对待这条记载？",
            "A local gazetteer records a great drought one year; no other source of the time mentions it and no other evidence is known. How should a historian treat it?",
          ],
          ["保持谨慎，寻找其他彼此独立的证据，不急于下结论", "Be cautious and look for other independent evidence before concluding"],
          [
            ["既然是当时的记载，就应当完全相信", "Trust it fully since it is from the time"],
            ["其他文献没有提到，所以可以断定大旱没有发生", "Since others are silent, conclude there was no drought"],
            ["应当以后世编写的史书为准", "Defer to histories written later"],
          ],
          [
            "第四段说只有一条材料时要“格外谨慎”，即“孤证不立”；第六段又说没有记载“并不等于没有发生过”，所以既不能轻信，也不能轻易否定。",
            "Paragraph four urges caution with a lone source; paragraph six says silence does not prove absence. Neither trust nor dismiss it too quickly.",
          ],
        ),
        question(
          ["下列说法，不能从原文得出的一项是", "Which statement can NOT be drawn from the text?"],
          [
            "石头和金属更容易保存，所以刻在石头上的记载比写在纸上的更可信",
            "Stone and metal last longer, so records carved in stone are more credible than those on paper",
          ],
          [
            ["古代普通人的生活较少进入文字记载", "The lives of ordinary people in the past seldom entered written records"],
            ["出土的器物可能纠正文献的记载", "Excavated objects can correct written records"],
            ["历史结论可以随着新史料的发现而修正", "Historical conclusions can be revised as new sources are found"],
          ],
          [
            "第六段说石头、金属更容易保存，讲的是史料能否留下来的偶然性，不是内容是否可信。把“容易保存”当成“更可信”，是偷换了概念。",
            "Paragraph six speaks of what survives, not what is true; treating durability as credibility confuses the two.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-logic-of-the-control-group",
      title: ["对照实验的道理", "The Logic of the Control Group"],
      body: `一种新药吃下去，病好了，能不能说明药有效？很多人会脱口而出：当然能。可是仔细想想，事情没有这么简单。许多病本来就会自己好转；病人相信自己吃了药，心情放松，感觉也可能好一些；同一时期，病人也许还改变了饮食和作息。病好了，究竟是哪一个原因在起作用？要回答这个问题，科学家需要一种特别的方法：对照实验。

对照实验的基本思路并不复杂：把条件相近的对象分成两组，一组接受要研究的处理，叫做实验组；另一组不接受，叫做对照组。除了这一点不同，两组的其他条件尽量保持一致。这样，如果两组的结果出现明显差别，就有理由认为差别来自那个唯一不同的因素。

1747年，英国船医林德在海上做过一次常被人提起的实验。当时，长途航行的水手常常患上坏血病。林德挑选了十二位症状相近的病人，分成六组，每组两人，在同样的饮食之外，分别给予不同的东西，其中一组每天吃橘子和柠檬。结果，吃橘子和柠檬的两位水手好得最快。今天我们知道，坏血病是缺少维生素C引起的。这次实验规模很小，按今天的标准还不够严格，但它体现了对照的思想：把不同的处理放在相同的条件下比较。

后来的研究者发现，仅仅分组还不够。如果由医生挑选谁进实验组，医生可能会不自觉地把病情较轻的人放进去，结果自然偏向新药。为此，现代的实验采用随机分组，让每个人进入哪一组全凭机会决定。另一个问题来自人的心理：即使吃下的是不含药物成分的“假药”，有些病人也会感到好转，这被称为安慰剂效应。所以，对照组往往也会服用外表一模一样的安慰剂。更进一步，病人和负责观察的医生都不知道谁在哪一组，这叫做双盲，可以避免双方的期待影响结果。

对照实验并不只用在医学上。农业上比较两种肥料，教育上比较两种教学方法，都可以用到同样的思路。当然，并不是所有问题都能做实验：有的出于道德原因不能做，有的条件根本无法控制。这时，研究者就需要用其他方法，并且对结论保持更多的谨慎。

懂得对照实验的道理，对普通人也有用处。下一次再看到“某某产品效果明显”的说法，不妨问一问：和谁比？怎么比的？`,
      names: ["林德", "英国", "1747", "C"],
      glossed: ["坏血病", "维生素", "柠檬", "安慰剂", "双盲", "随机"],
      xp: 8,
      questions: [
        question(
          ["第一段在文中起什么作用？", "What does the first paragraph do?"],
          [
            "以吃药后病好的例子提出问题，说明单凭结果难以判断原因，引出对照实验",
            "With the case of recovery after a drug, it shows outcomes alone cannot reveal causes, and introduces the controlled experiment",
          ],
          [
            ["证明新药一定有效", "It proves new drugs always work"],
            ["说明生病时不必吃药", "It shows there is no need for medicine when ill"],
            ["介绍几种常见疾病的治疗方法", "It describes treatments for common illnesses"],
          ],
          [
            "第一段列出病自己好转、心理作用、改变饮食作息等多种可能，问“究竟是哪一个原因在起作用”，然后引出“对照实验”。",
            "It lists natural recovery, belief and changed habits, asks which cause is at work, then introduces the controlled experiment.",
          ],
        ),
        question(
          ["根据原文，现代实验采用随机分组，主要是为了什么？", "Why, according to the text, do modern trials assign groups at random?"],
          [
            "避免研究者有意无意地把条件不同的人分进某一组，使两组条件尽量一致",
            "To stop researchers, knowingly or not, sorting different kinds of people into one group, so the groups stay alike",
          ],
          [
            ["让病人自己挑选喜欢的药", "To let patients choose the drug they like"],
            ["减少参加实验的人数", "To cut the number of people in the trial"],
            ["让实验组的病人好得更快", "To make the treated group recover faster"],
          ],
          [
            "第四段说，如果由医生挑选，医生“可能会不自觉地把病情较轻的人放进去”，所以要“全凭机会决定”，这正是为了满足第二段“其他条件尽量保持一致”的要求。",
            "Paragraph four says a doctor might unwittingly pick milder cases, so chance decides, meeting paragraph two's demand that other conditions match.",
          ],
        ),
        question(
          ["下列对林德实验的理解，符合原文的一项是", "Which understanding of Lind's experiment agrees with the text?"],
          [
            "它体现了对照的思想，但规模小，按今天的标准还不够严格",
            "It shows the idea of comparison, but it was small and not rigorous by today's standards",
          ],
          [
            ["林德在实验中使用了安慰剂和双盲", "Lind used a placebo and double blinding"],
            ["林德当时已经知道坏血病是缺少维生素C引起的", "Lind already knew scurvy came from lack of vitamin C"],
            ["林德的实验共有十二组病人", "Lind's trial had twelve groups"],
          ],
          [
            "第三段说这次实验“规模很小，按今天的标准还不够严格，但它体现了对照的思想”；病因是“今天我们知道”的；十二位病人分成了六组。安慰剂和双盲是后来才有的。",
            "Paragraph three calls it small and not rigorous yet comparative; the cause is what we know today; twelve men made six pairs; placebos and blinding came later.",
          ],
        ),
        question(
          [
            "某学校想知道一种新的阅读方法能不能提高学生的阅读能力。按照原文介绍的道理，下列做法最合理的一项是",
            "A school wants to know whether a new reading method improves reading. By the text's reasoning, which design is best?",
          ],
          [
            "把条件相近的学生随机分成两组，一组用新方法，一组用原来的方法，其他条件相同，再比较结果",
            "Randomly split similar students into two groups, one using the new method and one the old, all else equal, then compare",
          ],
          [
            ["让自愿报名的学生用新方法，再和其他学生比较", "Let volunteers use the new method and compare them with the rest"],
            ["让全校学生都用新方法，比较一学期前后的成绩", "Have everyone use it and compare scores before and after a term"],
            ["让成绩最好的班用新方法，再和其他班比较", "Give it to the top class and compare it with the others"],
          ],
          [
            "自愿报名和挑选最好的班，都会让两组的条件不同；全体使用则没有对照组，前后的变化可能另有原因。只有随机分组、其他条件相同，才符合对照实验的要求。",
            "Volunteers and the top class make the groups unequal; using it for all leaves no control. Only random groups under equal conditions fit the method.",
          ],
        ),
      ],
    },
    {
      id: "chinese-mending-old-paintings",
      title: ["古画的修复", "Mending Old Paintings"],
      body: `一幅几百年前的古画，送到修复师面前时，往往已是满身伤痕：画面发黄发暗，布满污迹；纸或绢上有破洞、裂口，有的地方颜色已经脱落；背后托的纸也老化了，失去了支撑的力量。修复，就是要让这样一幅画重新稳定下来，再保存很多年。

中国书画多画在纸或绢上，背后要用几层纸托起来，这道工序叫装裱。俗话说“三分画，七分裱”，可见装裱对书画的重要。古画修复，很大程度上就是把旧的装裱拆下来，再重新装裱一遍。

修复的第一步通常是清洗。修复师用温水轻轻淋在画面上，让积了多年的污垢慢慢溶出，再用吸水的纸把脏水吸走，如此反复多次。清洗之前，必须先检验颜料是否会遇水褪色，否则一洗，画就毁了。

接下来是揭去旧的托纸。紧贴着画背面的那层纸，修复师称为“命纸”，意思是它和画的命连在一起。揭的时候，要用手指一点一点地把旧纸搓下来，力气稍大就会伤到画本身。一幅画揭下来，有时要花上好几个星期。

揭完以后，画上的破洞就露了出来。修复师要找到质地、颜色、厚薄都与原画相近的纸或绢，补在破洞的背面，然后用新的纸把整幅画托起来。补好的地方颜色往往和周围不一样，还要用颜料一点点地补色，使它看上去和谐，这一步叫“全色”。

在这个过程中，修复师要遵守一些重要的原则。一是尽量少干预：能不动的地方就不动，能少补的地方就少补。二是可逆：所用的材料和方法，应当让后人在需要时能够去除，而不损伤原作。传统修复用的是小麦淀粉做的浆糊，干了以后仍能用水化开，正好符合这个要求。三是可以辨认：补色要远看浑然一体，近看又能分辨，以免后人把修复师的笔墨当成古人的原作。对于画面上缺失的部分，今天的修复更多主张不凭猜测去添加，宁可留下空白，也不替古人作画。

人们常用“修旧如旧”来概括这门手艺的追求。它的意思不是把古画修得像新的一样，而是让它保持原有的样子，带着岁月的痕迹，继续活下去。修复师的名字很少出现在画上，可正是他们一双双耐心的手，让我们今天还能站在一幅古画前，看见几百年前的笔墨。`,
      glossed: ["装裱", "裱", "命纸", "全色", "淀粉", "浆糊", "修旧如旧", "绢"],
      xp: 8,
      questions: [
        question(
          ["下列对“命纸”的理解，符合原文的一项是", "Which understanding of the “life paper” agrees with the text?"],
          [
            "它是紧贴画背面的那层纸，与画的关系最紧密，揭的时候稍不小心就会伤到画",
            "It is the layer pressed against the back of the painting, the closest to it, and careless removal harms the painting",
          ],
          [
            ["它是修复时新补上去的纸", "It is the new paper patched on in repair"],
            ["它是画家作画时用的纸", "It is the paper the artist painted on"],
            ["它是清洗时用来吸走脏水的纸", "It is the paper that soaks up dirty water in washing"],
          ],
          [
            "第四段说“紧贴着画背面的那层纸”称为“命纸”，“意思是它和画的命连在一起”，揭时“力气稍大就会伤到画本身”。",
            "Paragraph four names the layer against the back the life paper, bound to the painting's life; too much force harms the painting.",
          ],
        ),
        question(
          ["传统修复使用小麦淀粉做的浆糊，主要体现了哪一条原则？", "Which principle does the traditional wheat-starch paste mainly serve?"],
          ["可逆：后人需要时能把它去除而不损伤原作", "Reversibility: later restorers can remove it without harming the original"],
          [
            ["尽量少干预", "Doing as little as possible"],
            ["可以辨认", "Being recognizable"],
            ["把古画修得像新的一样", "Making the painting look new"],
          ],
          [
            "第六段在讲“可逆”这一条时说，这种浆糊“干了以后仍能用水化开，正好符合这个要求”。",
            "Under reversibility, paragraph six says the paste can still be dissolved in water when dry, which meets that requirement.",
          ],
        ),
        question(
          [
            "如果一幅古画上的颜料遇水会褪色，根据原文，修复师在清洗这一步应当怎样做？",
            "If a painting's pigments run in water, what should the restorer do at the washing stage, according to the text?",
          ],
          ["不能直接按通常的方法用温水淋洗", "Not simply wash it with warm water in the usual way"],
          [
            ["多用温水反复淋洗，把颜料洗干净", "Wash it more with warm water to clean the pigments"],
            ["先揭去命纸，再用温水清洗", "Remove the life paper first, then wash"],
            ["先全色，再用温水清洗", "Fill in the colour first, then wash"],
          ],
          [
            "第三段说清洗之前“必须先检验颜料是否会遇水褪色，否则一洗，画就毁了”，可见遇水褪色的画不能直接用温水淋洗。",
            "Paragraph three says pigments must be tested first or washing will ruin the painting; so such a painting cannot be washed the usual way.",
          ],
        ),
        question(
          ["下列说法，不符合原文意思的一项是", "Which statement does NOT agree with the text?"],
          ["“修旧如旧”就是要把古画修得像刚画好时一样鲜亮", "“Mend the old as old” means making the painting as bright as when new"],
          [
            [
              "补洞用的纸或绢，质地、颜色、厚薄都要与原画相近",
              "Patching paper or silk must match the original in texture, colour and thickness",
            ],
            ["能不动的地方就不动，是少干预的要求", "Leaving alone what can be left alone is minimal intervention"],
            ["今天的修复更多主张不凭猜测为缺失的部分添加画面", "Restorers today mostly avoid adding guessed images to lost areas"],
          ],
          [
            "最后一段说，修旧如旧“不是把古画修得像新的一样，而是让它保持原有的样子，带着岁月的痕迹”。",
            "The last paragraph says it means not making it look new but keeping it as it was, with the marks of time.",
          ],
        ),
      ],
    },
  ],
);

/** gradeElevenFiction is the literary unit of grade 11: the aftertaste of fiction. */
const gradeElevenFiction = unit(
  11,
  "chinese-reading-11-fiction",
  ["小说的余味", "The Aftertaste of Fiction"],
  [
    {
      id: "chinese-the-small-station",
      title: ["小站", "The Small Station"],
      body: `山里的这个小站，一天只停两趟车。站长老韩在这里干了二十六年，站台上的每一块砖，他闭着眼睛也知道在哪儿。

小站没有售票厅，只有一间平房，一半是值班室，一半是候车的地方。候车的地方放着两条长椅，墙上挂着一块黑板，老韩每天用粉笔写上两趟车的时刻，写得端端正正，黑板的边上早已被粉笔灰染白了。其实来坐车的就那么几个人，谁都记得。

老韩记得最清楚的，是二十年前的一个冬夜。大雪封了山，火车晚了七个多小时。候车的十几个人挤在那间小屋里，他把自己家的煤搬来烧炉子，又让老伴煮了一大锅面条。天亮时火车终于来了，一个抱着孩子的妇女上车前，回过头来朝他鞠了一躬。从那以后，他觉得这个小站，比自己原先想的要重要一些。

秋天，上面来了通知：新的线路开通了，明年起，小站不再停车。

通知是一个年轻人送来的。说完正事，他看看四周，问：“韩站长，您往后打算去哪儿？”老韩说：“还没想好。”年轻人走的时候，在站台上回头拍了一张照片，老韩看见了，没说什么。

那以后，老韩照样每天早上扫站台，擦长椅，在黑板上写时刻。只是写得比以前更慢了，一笔一画，像是在描。

坐车的人也知道了消息。卖山货的王婶说，她以后要走二十里路去镇上坐车了。上中学的小丫头不说话，每次等车，都坐在长椅最靠边的地方，好像怕把它坐坏了。

最后一个星期，王婶给他送来一袋自家晒的蘑菇，说：“韩站长，往后不坐车了，您也来家里坐坐。”老韩收下了，回去把蘑菇挂在值班室的墙上，一直没吃。

最后一趟车停靠的那天，下着小雪。车只停两分钟。王婶上了车，小丫头上了车，几个外出打工的年轻人也上了车。车门关上之前，司机探出头来，朝老韩挥了挥手。老韩站得笔直，举起了手里的小旗。

火车开走了，越走越远，最后变成一个小黑点，消失在山的拐弯处。雪落在铁轨上，很快就把车轮压过的痕迹盖住了。

老韩回到屋里，拿起黑板擦，在黑板前站了很久，最后又把黑板擦放下了。

第二天一早，山路上的人远远看见，小站的站台，已经扫得干干净净。`,
      names: ["老韩", "韩站长", "王婶"],
      xp: 8,
      questions: [
        question(
          ["下列对老韩形象的分析，最恰当的一项是", "Which is the best analysis of Old Han?"],
          [
            "尽职敬业、默默坚守，对小站和乘客怀有深厚的感情",
            "Dutiful and quietly steadfast, with deep feeling for the station and its passengers",
          ],
          [
            ["墨守成规，不愿接受新事物", "Set in his ways and unwilling to accept anything new"],
            ["对小站停运漠不关心", "Indifferent to the station's closing"],
            ["喜欢向别人诉说自己的委屈", "Fond of telling others his grievances"],
          ],
          [
            "二十六年如一日地写时刻、扫站台，雪夜里为乘客烧炉子、煮面条，停运后仍然照样工作，都表现了他的敬业和对小站的感情；他对通知没有抱怨，只是“没说什么”。",
            "Decades of chalked timetables and swept platforms, the snowy night of coal and noodles, and work as usual after the notice show his devotion; he never complains.",
          ],
        ),
        question(
          [
            "第六段说老韩写时刻“写得比以前更慢了，一笔一画，像是在描”，下列理解最恰当的一项是",
            "Which is the best reading of Old Han writing the timetable more slowly, as if tracing it?",
          ],
          [
            "通过动作细节，含蓄地写出老韩对小站即将停车的不舍，想把这最后的日子留住",
            "Through a detail of action it quietly shows his reluctance to let the station go and his wish to hold on to the last days",
          ],
          [
            ["说明老韩年纪大了，手已经拿不稳粉笔", "It shows he is too old to hold the chalk steady"],
            ["说明老韩忘记了火车的时刻", "It shows he has forgotten the timetable"],
            ["说明老韩想把字练得更好看", "It shows he wants to improve his handwriting"],
          ],
          [
            "这些时刻他写了二十六年，不会忘，也不是为了练字。停车的日子越来越少，每写一次都可能是最后几次，“像是在描”写出了他的珍惜和不舍。",
            "After twenty-six years he cannot forget the times; with few days left, each writing may be among the last, and tracing shows how he treasures them.",
          ],
        ),
        question(
          [
            "第九段写雪“很快就把车轮压过的痕迹盖住了”，有什么作用？",
            "What does the snow quickly covering the wheel tracks in paragraph nine do?",
          ],
          [
            "渲染冷清的气氛，暗示小站一段历史的结束，衬托老韩内心的失落",
            "It sets a desolate mood, hints that a chapter of the station's history has closed and sets off Old Han's sense of loss",
          ],
          [
            ["说明这场雪下得很大，将来会影响通车", "It shows heavy snow that will stop trains later"],
            ["说明火车开得太快，没有留下痕迹", "It shows the train went too fast to leave tracks"],
            ["交代故事发生的季节是冬天", "It only tells us the season is winter"],
          ],
          [
            "车轮的痕迹是火车在小站停过的最后证明，雪把它盖住，就像这二十六年的往来也将被时间盖住。景物里藏着老韩说不出的心情。",
            "The tracks are the last sign a train stopped there; snow covering them is like time covering twenty-six years. The scene holds his unspoken feeling.",
          ],
        ),
        question(
          ["下列对小说结尾的分析，最恰当的一项是", "Which is the best analysis of the ending?"],
          [
            "不直接写老韩的心情，只写站台照样扫得干干净净，含蓄地表现他的坚守已成为生命的一部分，余味深长",
            "Without naming his feelings, it shows the platform swept as always: his devotion has become part of his life, and the effect lingers",
          ],
          [
            ["说明小站又恢复了停车", "It shows the station has reopened"],
            ["说明老韩还没有收到停车的通知", "It shows he has not yet received the notice"],
            ["说明老韩第二天就要离开小站", "It shows he is leaving the next day"],
          ],
          [
            "通知早已收到，最后一趟车也已开走，站台却照样被扫干净了。前一段他没有擦去黑板上的时刻，这一段他照旧扫站台，两处都不着一字心情，却让人体会到他放不下的感情。",
            "The notice came and the last train left, yet the platform is swept; like the unerased timetable, it shows without saying what he cannot let go.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-unfinished-game",
      title: ["残局", "The Unfinished Game"],
      body: `父亲教我下象棋，是在我七岁那年。

那时他总是赢。我急得掉眼泪，他也不让，只是把棋子一个个摆回原处，说：“再来。”我恨得牙痒，发誓总有一天要赢他。

十二岁那年夏天，我第一次赢了。那盘棋下了整整一个下午，最后我用一匹马和一个车将死了他。我跳起来大叫，他看着棋盘，点了点头，说：“这一步走得好。”那天晚饭，他多喝了一杯酒。母亲笑他：“输了棋还这么高兴。”他也不分辩。

从那以后，我赢的时候越来越多。上了高中，我已经很少输给他了。他下棋越来越慢，有时一步棋要想上好几分钟，我等得不耐烦，就催他。他说：“急什么，棋要慢慢下。”

有一回，我连赢了三盘，得意地说：“爸，您老了。”他把棋子收进盒子里，笑了笑，没有接话。那天晚上，我看见他一个人坐在灯下，翻着一本旧棋谱，看了很久。

后来我去外地上大学，再后来工作，成家，一年回不了几次家。每次回去，父亲都要摆上棋盘，我总推说累了，改天再下。改天，往往就到了下一次回家。电话里，他也很少说别的，问完吃得好不好，就问一句：“最近还下棋吗？”

去年冬天，母亲打电话来，说父亲住院了。我赶回去的时候，他已经能坐起来了，人瘦了一圈，头发也白了大半，看见我，第一句话是：“带棋了吗？”母亲在一旁说，他住院这几天，天天念叨着要下棋，谁劝也不听。

我从家里把那副旧棋拿到病房。棋子是木头的，红字已经褪成了浅浅的粉色，“帅”字的一角还缺了一块，是我小时候用牙咬的。

我们下了一盘。那盘棋下得很慢，他每走一步，我都耐心地等着，没有再催他。父亲的手有些抖，拿起一枚棋子，要停一会儿才放下去。下到一半，我看出他走错了一步，他的车已经走到了我的炮口下面。我的手悬在棋盘上，过了很久，挪开了，走了一步无关紧要的兵。

父亲看了我一眼，没说话，接着下。那盘棋，他赢了。

他把棋子一个个摆回原处，忽然说：“你十二岁那年那盘棋，那一步，我也看见了。”

我愣住了。他没有再往下说，只是低着头，慢慢地摆着棋子，像二十多年前一样。

窗外的天快黑了，护士进来开了灯，屋里一下子亮了。棋盘上，红的黑的，都回到了开始的位置。`,
      glossed: ["象棋", "将死"],
      xp: 8,
      questions: [
        question(
          ["下列对父亲形象的分析，最恰当的一项是", "Which is the best analysis of the father?"],
          [
            "不善言辞，表面严格，内心深爱儿子，习惯用含蓄的方式表达感情",
            "A man of few words, strict on the surface, who loves his son deeply and shows it indirectly",
          ],
          [
            ["好胜心强，从来不肯输给别人", "Fiercely competitive and never willing to lose"],
            ["对儿子冷淡，很少关心他的成长", "Cold to his son and little concerned with his growing up"],
            ["性格急躁，下棋时总催儿子快走", "Impatient, always hurrying his son at chess"],
          ],
          [
            "儿子哭了他也不让，只说“再来”；儿子赢了，他只说“这一步走得好”，却“多喝了一杯酒”；病中第一句话是“带棋了吗”。这些都是不说出口的爱。催人快走的是“我”，不是父亲。",
            "He would not give way to tears, praised one move, then drank an extra cup; ill, he asks for the chess set. It is the son who hurries, not the father.",
          ],
        ),
        question(
          ["第七段对旧棋子的描写有什么作用？", "What does the description of the old chess pieces in paragraph seven do?"],
          [
            "棋子承载着父子共同的岁月，褪色和缺角暗示时间流逝，为后文的情感高潮作铺垫",
            "The pieces carry the years father and son shared; faded and chipped, they mark time passing and prepare the emotional climax",
          ],
          [
            ["说明家里买不起新棋", "It shows the family cannot afford a new set"],
            ["批评“我”小时候不爱惜东西", "It criticizes the narrator for being careless as a child"],
            ["介绍象棋棋子的制作材料", "It explains what chess pieces are made of"],
          ],
          [
            "红字褪成“浅浅的粉色”，写出了用了多少年；“帅”字缺角“是我小时候用牙咬的”，把读者带回七岁学棋的日子，为病房里那盘棋积蓄感情。",
            "Faded red shows long use; the chipped piece the narrator bit as a boy returns us to his first games and gathers feeling for the hospital game.",
          ],
        ),
        question(
          [
            "父亲说“你十二岁那年那盘棋，那一步，我也看见了”，这句话的含意是什么？",
            "What does the father mean by “that game when you were twelve, that move: I saw it too”?",
          ],
          [
            "暗示当年那盘棋是他有意让“我”赢的，也表明他看出了“我”这一次在让他",
            "He hints that he let the boy win that day, and shows he has seen that his son is now letting him win",
          ],
          [
            ["说明父亲当年没有看出“我”的那步好棋", "He means he failed to see the boy's good move then"],
            ["说明父亲记性很好，记得每一盘棋", "He means only that he remembers every game"],
            ["说明父亲至今还在为那盘棋输了而生气", "He means he is still angry about losing"],
          ],
          [
            "这句话紧跟在“我”故意不吃他的车之后。父亲看出了“我”在让棋，便说出了自己当年同样“看见了”却没有走的那一步。父子两代，都用让棋表达了说不出口的爱。",
            "It follows the son's refusal to take the chariot. Seeing that, the father admits he too once saw a move and let it go: each in turn gives way out of love.",
          ],
        ),
        question(
          ["小说结尾“棋盘上，红的黑的，都回到了开始的位置”，下列理解最恰当的一项是", "Which is the best reading of the closing line?"],
          [
            "以景结情，暗示父子角色的交替与亲情的延续，含蓄而有余味",
            "It ends on an image that hints at father and son changing places and love carried on, restrained and lingering",
          ],
          [
            ["说明父亲的病已经好了，可以继续下棋", "It shows the father has recovered and can play on"],
            ["表示“我”决定以后再也不下棋了", "It shows the narrator will never play again"],
            ["只是交代护士进来查房", "It only says a nurse came in"],
          ],
          [
            "当年父亲让“我”赢，如今“我”让父亲赢，一切像棋子一样“回到了开始的位置”，却已换了位置。题目“残局”也暗示着父亲的晚年和这份没有说完的感情。",
            "Once the father let the son win, now the son lets the father; all returns to the start with roles reversed. The title hints at his last years and what was left unsaid.",
          ],
        ),
      ],
    },
    {
      id: "chinese-the-kiln-master",
      title: ["窑火", "The Kiln Master"],
      body: `小舟到窑上当学徒的第三年，才第一次被允许自己拉坯。

窑在镇子西头，烧的是青瓷。师傅姓鲁，六十多岁，话很少，一天里说得最多的是“再来”。镇上的人说，鲁师傅年轻时跟着他的师傅学了十年，才第一次被允许烧一窑。小舟拉出来的碗，在旁人看来已经圆圆正正，鲁师傅拿起来，对着光转一转，用手指在碗沿上轻轻一敲，听一听，就放回泥堆里，揉成一团。

小舟憋着一口气，一个月拉了几百个碗，被揉掉的也是几百个。每天天不亮，他就起来和泥。泥要反复地揉，把里面的空气全揉出去。师傅说，泥里留一点气，烧出来的东西就藏着一个看不见的坏处。

有一天，他终于忍不住了：“师傅，这个碗到底哪里不好？”

鲁师傅把碗递给他：“你自己听。”

小舟敲了敲，碗发出“当”的一声，清清脆脆。他又拿起师傅拉的碗敲了敲，声音好像也差不多。他听不出来，脸一下子红了。那以后，他每拉一个碗，都要敲上好几遍，敲得手指都疼了，还是听不出什么。

鲁师傅没有再说什么，只是从那以后，每次开窑，都叫他在旁边站着。

开窑那天，窑门一打开，热气扑面而来。碗一叠叠地被搬出来，在冷风里发出细细的声音，叮叮，叮叮，像是很远的地方有人在敲一串小铃。鲁师傅一个一个地拿起来看，看到一只碗时，停住了。那只碗青得像雨后的天，小舟觉得那是他见过最好看的一只。鲁师傅看了很久，举起来，往地上一摔。

“师傅！”小舟叫出了声。旁边的工人也说，这一窑最好的就是它了。鲁师傅没有理会，接着去看下一只。

“里面有一个小气泡。”鲁师傅说，“现在看不出来，用上几年，就会从这里裂开。”

小舟蹲下去，捡起一块碎片，对着光看了半天，什么也没看见。

那天晚上，他躺在床上睡不着。他想起师傅摔碗时的样子，脸上没有一点可惜，就像揉掉他的泥坯一样平常。他忽然觉得，师傅揉掉的，也许从来不是他的碗。

又过了五年，小舟已经能独自烧一窑了。有一次开窑，他拿起一只碗，对着光转了转，又轻轻一敲，停了很久，然后把它放进了要打碎的那一筐。

旁边新来的学徒问他：“这个碗哪里不好？”

小舟想了想，说：“你自己听。”`,
      names: ["小舟", "鲁师傅"],
      glossed: ["拉坯", "泥坯", "青瓷", "学徒"],
      xp: 8,
      questions: [
        question(
          ["下列对鲁师傅形象的分析，最恰当的一项是", "Which is the best analysis of Master Lu?"],
          [
            "对手艺要求极严，容不得半点隐患，话少而重在让徒弟自己体会",
            "Exacting in his craft, tolerating no hidden flaw, saying little and letting the apprentice learn for himself",
          ],
          [
            ["脾气暴躁，常常拿徒弟出气", "Hot-tempered and takes it out on his apprentice"],
            ["舍不得传授手艺，故意为难徒弟", "Unwilling to pass on his craft, so he makes things hard on purpose"],
            ["只看重碗的外表是否好看", "Cares only whether the bowls look pretty"],
          ],
          [
            "他摔掉的是小舟眼中“最好看的一只”，因为里面有看不出的气泡，可见他看重的不是外表；他不讲道理，只说“你自己听”，又让小舟在开窑时站在旁边，是让徒弟自己去悟。",
            "He smashes the loveliest bowl for an unseen bubble, so looks are not his measure; he explains nothing but has the boy watch the kiln opened, to learn by himself.",
          ],
        ),
        question(
          [
            "开窑时瓷碗“叮叮，叮叮，像是很远的地方有人在敲一串小铃”，这一描写有什么作用？",
            "What does the bowls' faint ringing, like distant bells, do at the opening of the kiln?",
          ],
          [
            "以比喻写出瓷碗清细的声音，营造安静而美好的气氛，也照应“听碗”这条线索",
            "The simile renders the bowls' fine clear sound, sets a still, lovely mood and keeps up the thread of listening to the bowls",
          ],
          [
            ["说明窑上挂着一串铃铛", "It shows bells hang at the kiln"],
            ["说明有人在远处敲门", "It shows someone knocking far away"],
            ["说明瓷碗都已经裂开了", "It shows the bowls have all cracked"],
          ],
          [
            "“像是”表明这是比喻。小说多次写敲碗、听碗，师傅也说“你自己听”，这里写出窑时的声音，正是围绕“听”展开的。",
            "“As if” marks a simile. The story keeps returning to tapping and listening, and here the sound of the new bowls continues that thread.",
          ],
        ),
        question(
          [
            "“师傅揉掉的，也许从来不是他的碗”，这句话的含意是什么？",
            "What does “perhaps what the master crushed was never his bowls” mean?",
          ],
          [
            "小舟领悟到，师傅要去掉的是他“差不多就行”的心态，是在磨炼他的标准，而不是否定他这个人",
            "The boy sees that the master was crushing his “good enough” attitude and training his standard, not rejecting him",
          ],
          [
            ["小舟认为师傅揉掉的碗都是别人拉的", "He thinks the bowls crushed were made by others"],
            ["小舟怀疑师傅根本没有看过他的碗", "He suspects the master never looked at his bowls"],
            ["小舟觉得师傅在拿碗出气，心里很委屈", "He feels the master was venting anger and feels wronged"],
          ],
          [
            "师傅摔掉自己最好看的碗，和揉掉小舟的泥坯“一样平常”，可见他对谁都是同一个标准。小舟由此明白，师傅不是针对他，而是要他也有这样的标准。",
            "The master breaks his own finest bowl as calmly as he crushed the boy's clay: one standard for all. The boy sees it was never personal.",
          ],
        ),
        question(
          [
            "小说结尾小舟对新学徒说“你自己听”，下列分析不恰当的一项是",
            "Which analysis of the boy's final “listen for yourself” is NOT apt?",
          ],
          ["说明小舟也听不出碗哪里不好，只好随口应付", "It shows he cannot hear the flaw either and is brushing the question off"],
          [
            ["与前文鲁师傅的话相同，形成照应", "It repeats Master Lu's words, echoing the earlier scene"],
            ["表明小舟已经接过了师傅的标准和教法", "It shows he has taken up his master's standard and way of teaching"],
            ["以重复的话语收束全文，含蓄而有余味", "Closing on the repeated words is restrained and lingering"],
          ],
          [
            "小舟“对着光转了转，又轻轻一敲，停了很久”，才把碗放进要打碎的筐里，这和当年师傅的动作一样，说明他听出来了。他说“你自己听”，是像师傅一样让徒弟自己去悟。",
            "He turns the bowl, taps it and pauses long before discarding it, just as his master did: he heard the flaw, and like his master leaves the learner to find it.",
          ],
        ),
      ],
    },
  ],
);

/** seniorReading are the reading units of the senior courses, grade 10 the required and 11 the selective required. */
export const seniorReading: readonly { readonly grade: number; readonly unit: ReadingUnitDef }[] = [
  { grade: 10, unit: gradeTenIdeas },
  { grade: 10, unit: gradeTenKnowledge },
  { grade: 10, unit: gradeTenLives },
  { grade: 11, unit: gradeElevenDebates },
  { grade: 11, unit: gradeElevenDisciplines },
  { grade: 11, unit: gradeElevenFiction },
];
