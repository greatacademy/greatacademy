// Grade 11: the reading unit of the eighth theme, machines and makers, from a legend of clay and a loom that read
// cards to a strike for bread and roses, a chess match lost to a computer, a car that must choose, cameras that
// watch a city, an algorithm that accused thousands of families and a boss that is an app.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const industry = { topic: "words-of-industry-and-labor", weight: 0.3 } as const;
const ethics = { topic: "words-of-machines-and-ethics", weight: 0.3 } as const;
const assumptions = { topic: "unstated-assumptions", weight: 0.2 } as const;
const academic8 = { topic: "academic-words-8", weight: 0.1 } as const;
const academic9 = { topic: "academic-words-9", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** machinesAndMakers is a reading unit of grade 11 on industry and labor, machines and the ethics of making them, and the people who work beside them. */
export const machinesAndMakers: ReadingUnitDef = {
  id: "machines-and-makers",
  title: t("Machines and Makers", "机器与制造者"),
  passages: [
    passage(
      "the-servant-made-of-clay",
      t("The Servant Made of Clay", "泥土做的仆人"),
      `In the old Jewish quarter of Prague, there is a legend that has been told for more than four hundred years. In the late sixteenth century, the story goes, the Jewish community of the city was in danger. False accusations were spread against them, and mobs threatened their homes. A wise and learned rabbi named Judah Loew decided to protect his people.

He went at night to the banks of the river and shaped a giant figure of clay. Then, according to the legend, he brought it to life with holy words, sometimes said to be a sacred name written on a slip of paper and placed in its mouth, or the Hebrew word for truth written on its forehead. The figure stood up. It was called the Golem.

The Golem was enormously strong and did whatever it was told. It guarded the streets at night, carried heavy loads and protected the community from its enemies. But it could not speak, and it did not understand the reasons for its orders. It followed instructions exactly, without judgment.

In many versions of the story, this is where the trouble begins. One day the rabbi forgot to deactivate the Golem before the Sabbath, the day of rest. Left without instructions, or given an order it took too literally, the Golem began to rampage, smashing whatever stood in its path. The rabbi had to rush out and remove the holy word, and the Golem fell back into a heap of clay. Its remains, the legend says, were hidden in the attic of the old synagogue, where some say they still lie.

The story of the Golem has been retold in novels, plays, films and comic books. Part of its power is that it asks a question that has become more urgent with time: what happens when we create something powerful that obeys us but does not understand us? The Golem is useful as long as its maker gives perfect instructions and keeps perfect control. When either fails, its strength becomes a danger.

Many writers have seen the Golem as an ancestor of later stories about artificial life, from Mary Shelley's novel of a scientist who builds a man to modern tales of robots and computers. In each, the maker assumes that what is made will remain a servant. In each, that assumption is tested.

Today, engineers who build powerful computer systems sometimes speak of the problem of alignment: making sure that a system does what its makers actually intend, not only what they literally said. They are, in a sense, still trying to solve the rabbi's problem.`,
      [ethics, assumptions, academic8],
      [
        ask(
          t("Why did the rabbi create the Golem, according to the legend?", "根据传说，拉比为什么创造魔像？"),
          t("To protect the Jewish community of Prague from danger", "保护布拉格的犹太社区免受危险"),
          [
            t("To build a new synagogue in the old quarter", "在老城区建造一座新的犹太会堂"),
            t("To win a contest against other rabbis", "在与其他拉比的比赛中获胜"),
            t("To have someone to talk to at night", "为了晚上有人陪他说话"),
          ],
          t(
            "The first paragraph says the community was in danger from false accusations and mobs, and the rabbi decided to protect his people.",
            "第一段说社区受到诬告和暴徒的威胁，拉比决定保护他的人民。",
          ),
        ),
        ask(
          t("What weakness of the Golem leads to the trouble?", "魔像的什么弱点导致了麻烦？"),
          t("It follows orders exactly without understanding or judgment", "它严格执行命令，却不理解、不判断"),
          [
            t("It is too weak to carry heavy loads", "它太弱了，搬不动重物"),
            t("It refuses to obey anyone but its enemies", "它只听敌人的话，不听别人的"),
            t("It talks too much and gives away secrets", "它话太多，泄露了秘密"),
          ],
          t(
            "The third paragraph says it did not understand the reasons for its orders and followed instructions exactly, without judgment; the fourth shows the danger.",
            "第三段说它不理解命令的理由，不加判断地严格执行指令；第四段展现了由此带来的危险。",
          ),
        ),
        ask(
          t("What assumption does the passage say the makers in these stories share?", "文章说这些故事里的创造者都有什么共同的假设？"),
          t("That what they make will remain a servant", "他们创造出来的东西会一直是仆人"),
          [
            t("That clay is stronger than any metal", "泥土比任何金属都坚固"),
            t("That machines can never be useful", "机器永远不可能有用"),
            t("That stories about robots are only for children", "关于机器人的故事只适合儿童"),
          ],
          t(
            "The sixth paragraph says that in each story the maker assumes that what is made will remain a servant, and the assumption is tested.",
            "第六段说在每个故事中，创造者都假设被造物会一直是仆人，而这个假设受到了考验。",
          ),
        ),
      ],
      ["Prague", "Judah", "Loew", "Loew's", "Jewish", "Hebrew", "Golem", "Mary", "Shelley"],
    ),
    passage(
      "the-loom-that-read-cards",
      t("The Loom That Read Cards", "读卡片的织布机"),
      `In the early nineteenth century, the city of Lyon in France was famous for its silk. Its weavers produced fabrics with patterns of flowers, birds and leaves that were sold across Europe. But making a patterned silk was slow and difficult. On a traditional loom, each of the thousands of threads that ran along the length of the cloth had to be raised or lowered by hand to form the design. A weaver needed an assistant, often a child, who sat on top of the loom and pulled the threads in the right order. It was exhausting, and a single mistake could spoil the pattern.

A Lyon weaver's son named Joseph Marie Jacquard spent years trying to solve this problem. In 1804, he demonstrated a loom that could weave complex patterns automatically. Its secret was a chain of stiff cards punched with holes. Each card controlled one row of the pattern. Where there was a hole, a hook passed through and lifted a thread; where there was no hole, the thread stayed down. By changing the cards, the weaver could change the pattern completely without rebuilding the machine.

The invention transformed the silk industry. One weaver could now produce in a day what had taken weeks. Napoleon, the emperor of France, praised the loom and granted Jacquard a pension. Within a few decades, thousands of Jacquard looms were working in Lyon and across Europe.

Not everyone welcomed it. Many weavers feared that the machine would take away their work and their skill. According to some accounts, angry workers attacked Jacquard and burned one of his looms in a public square. Their fears were not unfounded. The machine did make some kinds of labor unnecessary, and the children who had pulled threads were no longer needed, which for them was a relief but for their families meant lost income. At the same time, the cheaper fabric created new demand and, over time, new jobs.

The loom's influence reached far beyond weaving. Its punched cards were one of the first ways of storing instructions for a machine. In the decades that followed, inventors adapted the idea for calculating machines. In the late nineteenth century, punched cards were used to process the results of a national census in the United States, and the company that grew out of that work later became one of the largest makers of computers in the world. For much of the twentieth century, programmers still fed instructions to computers on punched cards.

Few of the weavers of Lyon could have guessed that a pattern of holes in a card would one day lead to the computer. But Jacquard's central idea, separating the machine from the instructions it follows, remains at the heart of every program written today.`,
      [industry, ethics, academic9, academic2],
      [
        ask(
          t("How did Jacquard's loom know which threads to lift?", "雅卡尔的织布机怎么知道要提起哪些线？"),
          t("A chain of punched cards, where each hole lifted a thread", "一串打孔卡片，每个孔提起一根线"),
          [
            t("A child sat on top and called out the pattern", "一个孩子坐在上面喊出图案"),
            t("The weaver drew the pattern on the silk with chalk", "织工用粉笔把图案画在丝绸上"),
            t("It copied the pattern from a finished piece of cloth", "它从一块织好的布上复制图案"),
          ],
          t(
            "The second paragraph says each punched card controlled one row; where there was a hole, a hook passed through and lifted a thread.",
            "第二段说每张打孔卡控制一行图案；有孔的地方，钩子穿过并提起一根线。",
          ),
        ),
        ask(
          t("Why did some weavers attack Jacquard?", "为什么有些织工攻击雅卡尔？"),
          t("They feared the machine would take away their work and skill", "他们担心机器会夺走他们的工作和技艺"),
          [
            t("They believed the silk it made was of poor quality", "他们认为它织出的丝绸质量差"),
            t("Napoleon had ordered them to destroy the looms", "拿破仑命令他们毁掉织布机"),
            t("Jacquard had refused to sell them his machines", "雅卡尔拒绝把机器卖给他们"),
          ],
          t(
            "The fourth paragraph says many weavers feared that the machine would take away their work and their skill, and some attacked him.",
            "第四段说许多织工担心机器会夺走他们的工作和技艺，一些人攻击了他。",
          ),
        ),
        ask(
          t("What is the loom's central idea that remains in every program today?", "织布机中哪个核心理念至今仍存在于每一个程序中？"),
          t("Separating the machine from the instructions it follows", "把机器和它执行的指令分开"),
          [
            t("Using silk thread to connect the parts of a machine", "用丝线连接机器的各个部件"),
            t("Letting children control the most important steps", "让孩子控制最重要的步骤"),
            t("Building a new machine for every new task", "为每项新任务制造一台新机器"),
          ],
          t(
            "The last paragraph says Jacquard's central idea, separating the machine from the instructions it follows, is at the heart of every program.",
            "最后一段说雅卡尔的核心理念，即把机器与它执行的指令分开，是每个程序的核心。",
          ),
        ),
      ],
      ["Joseph", "Marie", "Jacquard", "Jacquard's", "Lyon", "France", "French", "Napoleon", "IBM"],
    ),
    passage(
      "bread-and-roses",
      t("Bread and Roses", "面包与玫瑰"),
      `In January 1912, in the mill town of Lawrence, Massachusetts, a group of women weavers opened their pay envelopes and found that their wages had been cut. A new state law had reduced the working week for women and children from fifty-six hours to fifty-four. The mill owners had responded by cutting pay to match, and by speeding up the machines. For workers who already earned barely enough to buy bread, losing even a few cents meant going hungry.

The women stopped their looms and walked out. Within days, more than twenty thousand workers had joined them. They came from more than forty countries and spoke more than twenty languages: Italian, Polish, Lithuanian, Syrian, Portuguese and many others. Many people assumed that workers so divided by language could never act together. They were wrong. Strike committees were organized with members from each language group, and meetings were translated into many tongues at once.

Conditions in the mills explained the anger. Many children worked in them from the age of fourteen. A doctor in the town reported that a large share of mill workers died before the age of twenty-five, many of lung disease from breathing cotton dust. Families lived crowded into small, cold apartments.

The strike lasted through a bitter winter. As it went on, families could no longer feed their children. Strikers arranged for hundreds of children to be sent to stay with supporters in other cities. When the police tried to stop one group of children from leaving, beating mothers and children at the train station, newspapers across the country reported the scene. The public was shocked, and Congress held hearings. A fourteen-year-old girl named Camella Teoli told the hearings how a machine in the mill had torn off part of her scalp.

In March, the mill owners gave in. They raised wages, paid extra for overtime and promised not to punish the strikers. Mills across New England soon raised wages too.

The strike is remembered by the phrase bread and roses, which became linked with it in later years. The words came from a poem published shortly before, and they expressed the idea that workers wanted not only enough to survive, the bread, but also a life with dignity, rest and beauty, the roses. A sign said to have been carried in the strike declared, "We want bread, and roses too."

The Lawrence strike showed that the poorest workers, from many nations, could unite. It also challenged an assumption common at the time: that people who worked in factories should be grateful for any wage and ask for nothing more.`,
      [industry, assumptions, academic8],
      [
        ask(
          t("What started the strike in Lawrence?", "是什么引发了劳伦斯的罢工？"),
          t("The owners cut pay after a law reduced working hours", "法律缩短工时后，老板削减了工资"),
          [
            t("The mills were closed and the workers lost their jobs", "工厂关门，工人失业了"),
            t("A new machine was invented that needed no workers", "发明了一种不需要工人的新机器"),
            t("The workers wanted to leave for other cities", "工人们想到别的城市去"),
          ],
          t(
            "The first paragraph says a law reduced the working week, and the owners responded by cutting pay to match and speeding up the machines.",
            "第一段说法律缩短了工作周，老板随之按比例削减工资并加快机器速度。",
          ),
        ),
        ask(
          t("What assumption about the workers proved wrong?", "关于工人的哪个假设被证明是错误的？"),
          t("That workers divided by many languages could never act together", "说多种语言的工人永远无法团结行动"),
          [
            t("That the workers would demand higher wages", "工人们会要求更高的工资"),
            t("That the mills used cotton to make cloth", "工厂用棉花织布"),
            t("That children worked in the mills", "有孩子在工厂里干活"),
          ],
          t(
            "The second paragraph says many assumed that workers so divided by language could never act together, and they were wrong.",
            "第二段说许多人认为语言如此分散的工人永远无法团结行动，但他们错了。",
          ),
        ),
        ask(
          t("What does the phrase bread and roses express?", "“面包与玫瑰”这句话表达了什么？"),
          t(
            "Workers wanted both enough to survive and a life with dignity and beauty",
            "工人们既想要足以生存的收入，也想要有尊严和美好的生活",
          ),
          [
            t("Workers wanted the mills to sell food and flowers", "工人们想让工厂卖食物和鲜花"),
            t("Workers preferred flowers to food in the winter", "工人们冬天更喜欢鲜花而不是食物"),
            t("Workers wanted to leave the mills and become farmers", "工人们想离开工厂去当农民"),
          ],
          t(
            "The sixth paragraph says the words meant workers wanted not only bread to survive but also roses: dignity, rest and beauty.",
            "第六段说这句话的意思是工人不仅想要赖以生存的面包，还想要玫瑰：尊严、休息和美。",
          ),
        ),
      ],
      [
        "Lawrence",
        "Massachusetts",
        "Italian",
        "Polish",
        "Lithuanian",
        "Syrian",
        "Portuguese",
        "Industrial",
        "Workers",
        "World",
        "American",
        "Americans",
        "Camella",
        "Teoli",
        "Washington",
      ],
    ),
    passage(
      "the-match-against-the-machine",
      t("The Match Against the Machine", "与机器的对决"),
      `In May 1997, in a small television studio in New York, the world chess champion Garry Kasparov sat down to play a six-game match against a computer. The machine, called Deep Blue, had been built by a team of engineers at the computer company IBM. It could examine about two hundred million positions on the chessboard every second.

Kasparov was widely considered the greatest chess player who had ever lived. He had played Deep Blue the year before and won. Many people assumed that a machine, however fast, could never match the intuition and creativity of a human master. Chess, they believed, required a kind of understanding that calculation alone could not produce.

The match was tense. Kasparov won the first game. In the second, Deep Blue made a quiet, patient move that seemed almost human, and Kasparov was so unsettled that he later suspected that people had secretly helped the machine. IBM denied it. Kasparov lost that game, and he never fully regained his confidence. The next three games were drawn. In the sixth and final game, Kasparov made an early mistake, and Deep Blue won in only nineteen moves. For the first time, a computer had defeated a reigning world champion in a match.

Newspapers around the world reported the result as a turning point. Some wrote as if machines were about to surpass humans in everything. Others pointed out that Deep Blue did not understand chess at all. It did not know that it was playing a game, it felt no joy in winning and it could do nothing else. It was a powerful calculator built for a single task.

Kasparov's own view changed over the years. At first he was angry and demanded a rematch, which IBM refused; Deep Blue was soon taken apart. Later, he became interested in what humans and computers could do together. He helped promote a form of chess in which human players were allowed to consult computers during a game. He found that the best teams were not always those with the strongest players or the fastest machines, but those whose players knew best how to work with their computers.

In the decades since, chess programs have become far stronger than any human. In 2017, a program called AlphaZero taught itself to play in a few hours, starting only from the rules, and then defeated the best existing programs. Yet more people play chess today than ever before. Many use computers to study, and human champions are still celebrated.

The match of 1997 did not end human chess. It changed the question from whether machines could beat us to what we would do alongside them.`,
      [ethics, assumptions, academic9, academic3],
      [
        ask(
          t("What did many people assume before the 1997 match?", "在 1997 年的比赛之前，许多人有什么假设？"),
          t("That a machine could never match a human master's intuition", "机器永远无法与人类大师的直觉相匹敌"),
          [
            t("That Kasparov had never played a computer before", "卡斯帕罗夫以前从未与计算机下过棋"),
            t("That chess would soon be banned in schools", "国际象棋很快会在学校被禁止"),
            t("That IBM did not want Deep Blue to win", "IBM 不希望深蓝获胜"),
          ],
          t(
            "The second paragraph says many assumed a machine could never match the intuition and creativity of a human master.",
            "第二段说许多人认为机器永远无法与人类大师的直觉和创造力相匹敌。",
          ),
        ),
        ask(
          t("What did critics point out about Deep Blue after its victory?", "深蓝获胜后，批评者指出了它的什么特点？"),
          t("It did not understand chess and could do nothing else", "它不懂国际象棋，也做不了别的事"),
          [
            t("It had cheated by copying Kasparov's moves", "它通过模仿卡斯帕罗夫的走法作弊"),
            t("It was slower than most human players", "它比大多数人类棋手还慢"),
            t("It had been built to play many different games", "它被设计来玩许多不同的游戏"),
          ],
          t(
            "The fourth paragraph says Deep Blue did not understand chess at all, did not know it was playing and could do nothing else.",
            "第四段说深蓝根本不懂国际象棋，不知道自己在下棋，也做不了别的事。",
          ),
        ),
        ask(
          t("What did Kasparov later find about teams of humans and computers?", "卡斯帕罗夫后来对人机组合有什么发现？"),
          t("The best teams were those whose players knew best how to work with computers", "最好的组合是那些最懂得如何与计算机合作的棋手"),
          [
            t("The best teams always had the fastest computers", "最好的组合总是拥有最快的计算机"),
            t("Humans always played worse when using a computer", "人类使用计算机时总是下得更差"),
            t("Computers refused to help human players", "计算机拒绝帮助人类棋手"),
          ],
          t(
            "The fifth paragraph says the best teams were not always those with the strongest players or fastest machines, but those who knew best how to work with their computers.",
            "第五段说最好的组合不一定是棋手最强或机器最快的，而是最懂得与计算机合作的。",
          ),
        ),
      ],
      ["Garry", "Kasparov", "Kasparov's", "Deep", "Blue", "IBM", "New", "York", "Russian", "AlphaZero"],
    ),
    passage(
      "the-car-that-must-choose",
      t("The Car That Must Choose", "必须做出选择的汽车"),
      `Imagine a self-driving car carrying one passenger down a city street. Suddenly its brakes fail. Ahead, a group of five people is crossing the road. The car can stay on course and hit them, or swerve into a wall, which would likely kill its passenger. What should it be programmed to do?

Philosophers have argued about questions like this for decades, usually with imaginary trains and switches rather than cars. But self-driving vehicles have turned an old puzzle into a practical problem. Engineers must decide in advance how their cars will behave in rare emergencies, and those decisions will be written into software that may drive millions of vehicles.

In 2016, researchers at the Massachusetts Institute of Technology launched a website called the Moral Machine. It presented visitors with scenarios like the one above and asked them to choose what the car should do. Should it save more lives or fewer? Young people or old? Passengers or pedestrians? People crossing legally or people crossing against the light? Within a few years, people in more than two hundred countries and territories had made about forty million decisions.

Some preferences were shared almost everywhere. Most people preferred to save more lives rather than fewer, to save humans rather than animals and to save the young rather than the old. But there were also striking differences between regions. In some countries, people were more willing to spare the old; in others, they placed more weight on whether a pedestrian was obeying the law.

The study raised hard questions. If people disagree, whose values should a car follow? Should a car sold in one country behave differently from the same model sold in another? And should engineers follow public opinion at all? Some critics pointed out that the website relied on hidden assumptions: that a car could know a person's age, that such choices would be common and that a game played online reflected what people would truly want in real life.

Others argued that the whole debate was a distraction. In practice, they said, almost all accidents involve no clear choice between victims. The real moral duty of engineers is to make cars that brake earlier, see better and crash far less often than human drivers do. In 2017, a German government commission issued rules stating that a self-driving car must never choose between people based on age, sex or other personal features.

The puzzle may be rare on real roads. But it forces makers to ask what values they are building into their machines, a question that cannot be left to the machines themselves.`,
      [ethics, assumptions, academic8, academic2],
      [
        ask(
          t("Why have self-driving cars made an old puzzle practical?", "为什么自动驾驶汽车让一个古老的难题变得现实？"),
          t("Engineers must decide in advance how cars will act in emergencies", "工程师必须事先决定汽车在紧急情况下如何行动"),
          [
            t("Philosophers have started designing cars themselves", "哲学家们开始自己设计汽车"),
            t("Trains and switches are no longer used anywhere", "火车和道岔在任何地方都不再使用了"),
            t("Cars can now ask their passengers what to do", "汽车现在可以询问乘客该怎么做"),
          ],
          t(
            "The second paragraph says engineers must decide in advance how their cars will behave in rare emergencies, in software for millions of vehicles.",
            "第二段说工程师必须事先决定汽车在罕见紧急情况下的行为，写进可能驾驶数百万辆车的软件里。",
          ),
        ),
        ask(
          t("What hidden assumptions did critics find in the Moral Machine?", "批评者在“道德机器”中发现了哪些隐含的假设？"),
          t(
            "That a car could know a person's age and that online choices show real wishes",
            "汽车能知道人的年龄，以及网上的选择能反映真实意愿",
          ),
          [
            t("That self-driving cars would never have accidents", "自动驾驶汽车永远不会出事故"),
            t("That everyone in the world agreed on every choice", "全世界的人对每个选择的看法都一致"),
            t("That only engineers should be allowed to vote", "只有工程师才可以投票"),
          ],
          t(
            "The fifth paragraph lists the hidden assumptions: that a car could know age, that such choices would be common and that an online game reflected what people truly want.",
            "第五段列出了隐含的假设：汽车能知道年龄、这类选择很常见、网上游戏能反映人们的真实意愿。",
          ),
        ),
        ask(
          t("What did some argue was the real moral duty of engineers?", "有些人认为工程师真正的道德责任是什么？"),
          t("To make cars that crash far less often than human drivers", "制造比人类驾驶者事故少得多的汽车"),
          [
            t("To follow exactly what the website's visitors chose", "完全按照网站访问者的选择去做"),
            t("To let each passenger decide whom to save", "让每位乘客决定救谁"),
            t("To stop building self-driving cars at all", "完全停止制造自动驾驶汽车"),
          ],
          t(
            "The sixth paragraph says the real duty is to make cars that brake earlier, see better and crash far less often than human drivers.",
            "第六段说真正的责任是让汽车刹车更早、看得更清楚、事故比人类驾驶者少得多。",
          ),
        ),
      ],
      ["Moral", "Machine", "MIT", "Massachusetts", "Germany", "German", "Japan", "Colombia", "China", "Finland"],
    ),
    passage(
      "the-algorithm-that-accused",
      t("The Algorithm That Accused", "指控他人的算法"),
      `In the Netherlands, many families with young children receive help from the government to pay for childcare. In the early 2010s, after a case of fraud by a small group of people, the tax authority decided to crack down. It began using a computer system to flag applications that might be fraudulent. Officials believed that a machine would be faster and more objective than human judgment.

The system assigned each family a risk score. Families with high scores were investigated. But the rules the system followed contained serious flaws. Small paperwork errors, such as a missing signature or a late form, were treated as signs of deliberate fraud. And one of the factors that raised a family's risk score was whether a parent held a second nationality other than Dutch. Families with roots in Turkey, Morocco, Ghana and other countries were flagged far more often than others.

Once a family was labeled a fraud, the consequences were severe. Many were ordered to repay all the childcare money they had received over several years, sometimes tens of thousands of euros, even for a minor mistake. Some lost their homes and jobs. Marriages broke down under the stress. More than a thousand children were taken into care, in part because their families had fallen into crisis. Families who asked why they had been accused often received no clear answer; officials themselves could not always explain how the system had reached its conclusions.

For years, the victims' complaints were ignored. Then journalists and a few members of parliament began to investigate. In 2020, a parliamentary report concluded that the families had suffered "unprecedented injustice" and that basic principles of law had been violated. Human rights organizations found that the use of nationality as a risk factor amounted to discrimination. In January 2021, the entire Dutch government resigned over the scandal.

Investigators pointed to several lessons. The system had been built on an unstated assumption: that the people it flagged were probably guilty. Human officials trusted the machine's scores and stopped asking questions. Nobody had clearly been responsible for checking whether the system was fair. And because the people affected were often poor or from minority groups, they had little power to be heard.

The government promised compensation to tens of thousands of families, though many waited years to receive it. The scandal is now studied around the world as a warning. A machine can make decisions faster than people can, but it can also repeat a hidden prejudice thousands of times, without anyone noticing, unless people remain responsible for what it does.`,
      [ethics, industry, assumptions, academic9],
      [
        ask(
          t("Why did officials start using the computer system?", "官员们为什么开始使用这个计算机系统？"),
          t("They believed it would be faster and more objective than human judgment", "他们认为它比人的判断更快、更客观"),
          [
            t("They wanted to give more money to every family", "他们想给每个家庭更多的钱"),
            t("The parliament had banned human investigators", "议会禁止使用人工调查员"),
            t("Families had asked for their applications to be checked by machine", "家庭要求用机器审核他们的申请"),
          ],
          t(
            "The first paragraph says officials believed a machine would be faster and more objective than human judgment.",
            "第一段说官员们认为机器比人的判断更快、更客观。",
          ),
        ),
        ask(
          t("Which factor made the system discriminatory?", "哪个因素使这个系统具有歧视性？"),
          t("Holding a second nationality raised a family's risk score", "拥有第二国籍会提高一个家庭的风险评分"),
          [
            t("Families who paid for childcare were all flagged", "所有支付托儿费的家庭都被标记"),
            t("The system checked only families in the capital", "系统只审核首都的家庭"),
            t("Families with many children were given lower scores", "孩子多的家庭得到较低的评分"),
          ],
          t(
            "The second paragraph says one of the factors that raised a family's risk score was whether a parent held a second nationality.",
            "第二段说提高家庭风险评分的因素之一是父母是否拥有第二国籍。",
          ),
        ),
        ask(
          t("What unstated assumption did investigators find in the system?", "调查人员在系统中发现了什么隐含的假设？"),
          t("That the people it flagged were probably guilty", "被它标记的人很可能有罪"),
          [
            t("That all families were honest and needed no checking", "所有家庭都是诚实的，不需要审核"),
            t("That computers could never make mistakes in arithmetic", "计算机在算术上永远不会出错"),
            t("That childcare should be free for every family", "托儿服务应该对每个家庭免费"),
          ],
          t(
            "The fifth paragraph says the system had been built on an unstated assumption: that the people it flagged were probably guilty.",
            "第五段说这个系统建立在一个隐含的假设之上：被它标记的人很可能有罪。",
          ),
        ),
      ],
      ["Netherlands", "Dutch", "Hague", "Mark", "Rutte", "Amnesty", "International"],
    ),
    passage(
      "eyes-on-every-corner",
      t("Eyes on Every Corner", "每个街角的眼睛"),
      `Walk through the center of almost any large city today and you will pass dozens of cameras. They watch from shop doors, bus stops, traffic lights and the corners of buildings. London has been described as one of the most watched cities in the world, with hundreds of thousands of cameras. A person going about an ordinary day may be filmed hundreds of times without noticing.

Supporters of public cameras offer strong arguments. Cameras can help police find a missing child, identify the driver in a hit-and-run accident or trace the movements of a person who committed a violent crime. Some studies have found that cameras reduce certain kinds of crime, such as car theft in parking lots. Many residents say that cameras make them feel safer, especially at night.

Critics raise different concerns. Studies of whether cameras prevent violent crime have produced mixed results; in many places, crime simply moved to streets without cameras. And the arguments for cameras often rest on an assumption that is rarely stated: that only people who have done something wrong have anything to fear from being watched. Critics reply that privacy matters even to people with nothing to hide. A person might not want strangers to know which doctor they visit, which meeting they attend or whom they meet for lunch.

The debate has grown sharper with the arrival of facial recognition, software that can identify a person by comparing an image of their face with a database of photographs. A camera that once simply recorded a crowd can now, in principle, name every person in it. This could help find dangerous criminals quickly. But it could also allow a government to track peaceful protesters, journalists or members of a religious group.

Facial recognition has also made mistakes. Studies in the United States found that some systems were far more likely to misidentify women and people with darker skin, because the photographs used to train them had included mostly lighter-skinned men. Several people have been wrongly arrested after a system matched their faces with images of suspects.

Different places have responded in different ways. In 2019, San Francisco became the first major American city to ban its police from using facial recognition. The European Union has passed rules that strictly limit its use in public spaces. Other governments have expanded it widely.

The question is not whether cameras are good or bad, but who controls them, what they are used for and what limits protect the people they watch. A society that accepts being watched should at least insist on knowing who is watching, and why.`,
      [ethics, assumptions, academic8, academic1],
      [
        ask(
          t("What evidence do supporters offer for public cameras?", "支持者为公共摄像头提供了什么证据？"),
          t("They help solve crimes, reduce some theft and make residents feel safer", "它们有助于破案、减少某些盗窃并让居民感到更安全"),
          [
            t("They have stopped all violent crime in every city", "它们制止了所有城市的所有暴力犯罪"),
            t("They are cheaper than hiring a single police officer", "它们比雇用一名警察还便宜"),
            t("They are loved by everyone who is filmed", "每个被拍摄的人都喜欢它们"),
          ],
          t(
            "The second paragraph says cameras help police find people, some studies show less car theft and many residents feel safer.",
            "第二段说摄像头帮助警方找人，一些研究显示汽车盗窃减少，许多居民感到更安全。",
          ),
        ),
        ask(
          t("What unstated assumption do critics find in arguments for cameras?", "批评者在支持摄像头的论证中发现了什么隐含的假设？"),
          t("That only people who have done wrong have anything to fear from being watched", "只有做了坏事的人才会害怕被监视"),
          [
            t("That cameras cost too much for cities to buy", "摄像头太贵，城市买不起"),
            t("That criminals always know where the cameras are", "罪犯总是知道摄像头在哪里"),
            t("That people prefer to walk at night", "人们更喜欢在夜间步行"),
          ],
          t(
            "The third paragraph says the arguments often rest on a rarely stated assumption that only people who have done something wrong have anything to fear.",
            "第三段说这些论证常常基于一个很少被说出的假设：只有做了坏事的人才有理由害怕。",
          ),
        ),
        ask(
          t(
            "Why did some facial recognition systems misidentify women and darker-skinned people more often?",
            "为什么有些人脸识别系统更容易认错女性和肤色较深的人？",
          ),
          t("They were trained mostly on photographs of lighter-skinned men", "它们主要是用肤色较浅的男性照片训练的"),
          [
            t("Their cameras could not work in daylight", "它们的摄像头在白天无法工作"),
            t("They were designed only for use in Europe", "它们只为在欧洲使用而设计"),
            t("Women and darker-skinned people avoided the cameras", "女性和肤色较深的人会避开摄像头"),
          ],
          t(
            "The fifth paragraph says the photographs used to train them had included mostly lighter-skinned men.",
            "第五段说用来训练它们的照片主要是肤色较浅的男性。",
          ),
        ),
      ],
      ["London", "Londoners", "British", "Britain", "San", "Francisco", "European", "Union"],
    ),
    passage(
      "the-boss-in-the-phone",
      t("The Boss in the Phone", "手机里的老板"),
      `In many cities around the world, a new kind of worker rides bicycles and motorbikes through the streets with insulated boxes on their backs. They deliver meals, groceries and parcels ordered through apps. Others drive passengers in their own cars. They are often called gig workers, because each job, like a musician's performance, is a short separate task.

For many, this work offers real advantages. They can choose when to work, take a day off without asking permission and earn money quickly when they need it. Students, parents and people between jobs often value this freedom. Companies argue that gig work gives millions of people a way to earn that would not otherwise exist.

But the workers have a boss of an unusual kind. In most cases, no human manager tells them where to go. An app does. A computer program decides which rider receives which order, how much each delivery pays and how long it should take. It tracks each rider's speed, location and ratings from customers. Riders who refuse too many orders or receive low ratings may find that they are offered less work, or are removed from the app entirely, sometimes without any explanation from a human being.

Consider a rider we might call Amir. One evening the rain is heavy, and his phone sends him across the city to a restaurant, then to an address on a hill. The app gives him twenty minutes. If he is late, his rating may fall. If he refuses, he may get fewer orders tomorrow. He does not know exactly how the program decides, and there is no one to ask.

This kind of management raises new questions. The companies have usually treated riders as independent contractors rather than employees. That means they often have no sick pay, no paid holidays and no guaranteed minimum wage, and they must pay for their own bicycles, fuel and phones. The companies' position rests on an assumption: that because riders can choose their hours, they are their own bosses. Critics argue that a worker whose pay, routes and future work are controlled by a company's software is not truly independent.

Courts and governments in several countries have begun to answer. Some courts have ruled that riders should be treated as employees with basic rights. Some laws now require companies to explain how their algorithms make decisions about workers and to let a human review a decision to remove someone.

The gig economy is new, but the question it raises is old: what does a worker owe a company, and what does a company owe its workers? The difference is that today the answer is partly written in code.`,
      [industry, ethics, assumptions, academic9, academic3],
      [
        ask(
          t("What advantages does gig work offer many workers?", "零工工作为许多工人带来了什么好处？"),
          t("They can choose when to work and earn money quickly", "他们可以自己选择工作时间，并能快速挣到钱"),
          [
            t("They receive sick pay and paid holidays", "他们有病假工资和带薪假期"),
            t("Their companies pay for their bicycles and phones", "公司为他们支付自行车和手机费用"),
            t("A human manager helps them plan each route", "有一位人类经理帮他们规划每条路线"),
          ],
          t(
            "The second paragraph says they can choose when to work, take days off without permission and earn money quickly.",
            "第二段说他们可以选择何时工作，不用请假就能休息，并能快速挣钱。",
          ),
        ),
        ask(
          t("What assumption does the companies' position rest on?", "公司的立场建立在什么假设之上？"),
          t("That riders who choose their hours are their own bosses", "能选择工作时间的骑手就是自己的老板"),
          [
            t("That riders prefer to work in heavy rain", "骑手更喜欢在大雨中工作"),
            t("That customers never give low ratings", "顾客从不给低评分"),
            t("That courts will always side with the riders", "法院总会站在骑手一边"),
          ],
          t(
            "The fifth paragraph says the companies' position rests on the assumption that because riders can choose their hours, they are their own bosses.",
            "第五段说公司的立场基于一个假设：骑手能选择工作时间，所以他们是自己的老板。",
          ),
        ),
        ask(
          t("What have some new laws required of the companies?", "一些新法律对公司提出了什么要求？"),
          t("To explain how their algorithms decide and let a human review removals", "解释算法如何做决定，并让人来复核将工人移除的决定"),
          [
            t("To stop using apps for any kind of delivery", "停止使用应用程序进行任何配送"),
            t("To pay every rider the same as a doctor", "付给每个骑手和医生一样多的钱"),
            t("To let customers choose which rider they get", "让顾客选择由哪位骑手配送"),
          ],
          t(
            "The sixth paragraph says some laws require companies to explain how their algorithms make decisions and to let a human review a decision to remove someone.",
            "第六段说一些法律要求公司解释算法如何对工人做出决定，并允许由人来复核移除某人的决定。",
          ),
        ),
      ],
      ["Amir"],
    ),
  ],
};
