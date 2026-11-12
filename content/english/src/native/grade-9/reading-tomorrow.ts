// Grade 9: the reading unit of the fifth theme, worlds of tomorrow, from the robots and rockets of early science
// fiction to the real questions of thinking machines and life on other planets.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const spaceWords = { topic: "words-of-space-travel", weight: 0.3 } as const;
const mindWords = { topic: "words-of-artificial-minds", weight: 0.3 } as const;
const powerWords = { topic: "words-of-power-and-control", weight: 0.3 } as const;
const speculative = { topic: "reading-speculative-fiction", weight: 0.2 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** worldsOfTomorrow is a reading unit of grade 9 on science fiction and the real science of the future. */
export const worldsOfTomorrow: ReadingUnitDef = {
  id: "worlds-of-tomorrow",
  title: t("Worlds of Tomorrow", "明日世界"),
  passages: [
    passage(
      "the-man-who-imagined-the-future",
      t("The Man Who Imagined the Future", "想象未来的人"),
      `In 1865, the French writer Jules Verne published a novel called From the Earth to the Moon. In it, members of an American gun club build an enormous cannon in Florida and fire three men toward the Moon inside a hollow shell. The idea of a giant gun was wrong; the force of the blast would have crushed the passengers. Yet Verne got a surprising number of details right.

He placed his launch site in Florida, close to where real moon rockets would later be launched from Cape Canaveral. He calculated that his travelers would need a speed of about eleven kilometers per second to escape the Earth's gravity, which is close to the real figure. His crew of three matched the crew of Apollo 11, which landed on the Moon in 1969. In a later book, his travelers return by splashing down in the Pacific Ocean, just as the Apollo astronauts did.

Verne was not a scientist, but he read scientific journals constantly and talked to experts. His method was to begin with real knowledge and then ask what might come next. In Twenty Thousand Leagues Under the Seas, published in 1870, he imagined the Nautilus, an electric submarine that could travel around the world underwater. Real submarines of that time were small and primitive. Long-distance submarines would not exist for decades.

Not all of his predictions came true, and some of his books have dated badly. But Verne helped to create a new kind of story, one in which the excitement comes from science and invention.

His influence on real explorers was enormous. Several pioneers of rocket science, including the Russian teacher Konstantin Tsiolkovsky, said that reading Verne as young people first made them dream of space travel. In this way, the novelist did more than predict the future. By filling young minds with possibilities, he helped to build it.`,
      [spaceWords, speculative, academic3],
      [
        ask(
          t("What was wrong with Verne's idea of a giant gun?", "凡尔纳的巨炮构想有什么问题？"),
          t("The force of the blast would have crushed the passengers", "爆炸的冲击力会把乘客压碎"),
          [
            t("The gun could not have been built in Florida", "这门炮不可能在佛罗里达建造"),
            t("The shell would have been too slow to leave the Earth", "炮弹速度太慢，离不开地球"),
            t("There was no metal strong enough for the shell", "没有足够坚固的金属来造炮弹"),
          ],
          t(
            "The first paragraph says the idea of a giant gun was wrong because the force of the blast would have crushed the passengers.",
            "第一段说巨炮的构想是错的，因为爆炸的冲击力会把乘客压碎。",
          ),
        ),
        ask(
          t("What was Verne's method for imagining the future?", "凡尔纳想象未来的方法是什么？"),
          t("Begin with real knowledge and ask what might come next", "从真实的知识出发，问接下来可能会出现什么"),
          [
            t("Invent machines first and then test them", "先发明机器再测试"),
            t("Copy the ideas of other novelists", "照搬其他小说家的点子"),
            t("Ignore science and follow his dreams", "不顾科学，追随梦想"),
          ],
          t(
            "The third paragraph says his method was to begin with real knowledge and then ask what might come next.",
            "第三段说他的方法是从真实的知识出发，然后问接下来可能会出现什么。",
          ),
        ),
        ask(
          t("How did Verne help to build the future, according to the last paragraph?", "根据最后一段，凡尔纳如何帮助建造了未来？"),
          t(
            "His books made young people, including rocket pioneers, dream of space travel",
            "他的书让包括火箭先驱在内的年轻人梦想太空旅行",
          ),
          [
            t("He designed the first real rocket", "他设计了第一枚真正的火箭"),
            t("He paid for the Apollo program", "他资助了阿波罗计划"),
            t("He built the first electric submarine", "他造了第一艘电动潜艇"),
          ],
          t(
            "The last paragraph says pioneers such as Tsiolkovsky said reading Verne made them dream of space travel, so by filling young minds with possibilities he helped to build the future.",
            "最后一段说齐奥尔科夫斯基等先驱称读凡尔纳的书让他们梦想太空旅行，他用种种可能填满年轻的头脑，从而帮助建造了未来。",
          ),
        ),
      ],
      [
        "French",
        "Jules",
        "Verne",
        "Earth",
        "Moon",
        "American",
        "Florida",
        "Cape",
        "Canaveral",
        "Earth's",
        "Apollo",
        "Pacific",
        "Ocean",
        "Twenty",
        "Thousand",
        "Leagues",
        "Seas",
        "Nautilus",
        "Russian",
        "Konstantin",
        "Tsiolkovsky",
      ],
    ),
    passage(
      "the-word-robot",
      t("The Word Robot", "“机器人”一词"),
      `The word robot was born on a stage in Prague. In 1920, the Czech writer Karel Čapek wrote a play called R.U.R., which stands for Rossum's Universal Robots. Čapek had been searching for a name for the artificial workers in his play. His brother Josef, a painter, suggested robot, from the Czech word robota, which means forced labor, the work that peasants once had to do for their lords.

Čapek's robots are not metal machines with gears and wires. They are made of a kind of synthetic flesh, grown in factories, and they look almost exactly like people. They are built to work without rest, without complaint and without feelings. Factory owners all over the world buy them, and soon robots do nearly all the work on Earth. Humans grow idle and stop having children.

At first, the robots obey. But some scientists in the factory begin to give them more human qualities, including the ability to feel pain. Eventually the robots rebel. They rise up against their makers and destroy almost all of humanity. Only one man is left alive, a builder who works with his hands. In the final scene, he watches two robots who seem to have learned to love each other, and he sends them out into the world as a new Adam and Eve.

The play was a huge international success, and the word robot spread quickly into dozens of languages. Its story also gave science fiction one of its most lasting fears: that the machines we create to serve us might one day turn against us.

Yet Čapek's play is not really about technology. It is about what happens when people are treated as tools. The robots are a mirror of workers who are used without respect. The question the play asks, a century later, is still uncomfortable: if we build beings that can think and feel, what do we owe them?`,
      [mindWords, powerWords, speculative],
      [
        ask(
          t("What does the Czech word robota mean?", "捷克语 robota 是什么意思？"),
          t("Forced labor", "强迫劳动"),
          [t("A metal machine", "金属机器"), t("A clever servant", "聪明的仆人"), t("A factory worker who is paid well", "高薪的工厂工人")],
          t(
            "The first paragraph says robota means forced labor, the work peasants once had to do for their lords.",
            "第一段说 robota 意为强迫劳动，即农民过去必须为领主做的活。",
          ),
        ),
        ask(
          t(
            "How are Čapek's robots different from the robots many people imagine today?",
            "恰佩克笔下的机器人与今天许多人想象的机器人有何不同？",
          ),
          t("They are made of synthetic flesh and look almost like people", "它们由合成血肉制成，看起来几乎和人一样"),
          [
            t("They are made of metal with gears and wires", "它们由带齿轮和电线的金属制成"),
            t("They are tiny and live inside computers", "它们很小，住在电脑里"),
            t("They can fly and travel to other planets", "它们会飞，能去其他星球"),
          ],
          t(
            "The second paragraph says they are not metal machines but made of synthetic flesh, and they look almost exactly like people.",
            "第二段说它们不是金属机器，而是由合成血肉制成，看起来几乎和人一模一样。",
          ),
        ),
        ask(
          t("According to the last paragraph, what is the play really about?", "根据最后一段，这部剧真正讲的是什么？"),
          t("What happens when people are treated as tools", "人被当作工具对待会怎样"),
          [
            t("How to build better machines", "如何制造更好的机器"),
            t("The history of the Czech language", "捷克语的历史"),
            t("Why factories should close", "工厂为什么应该关闭"),
          ],
          t(
            "The last paragraph says the play is not really about technology but about what happens when people are treated as tools.",
            "最后一段说这部剧真正讲的不是技术，而是人被当作工具对待会发生什么。",
          ),
        ),
      ],
      ["Prague", "Czech", "Karel", "Čapek", "R.U.R.", "Rossum's", "Universal", "Robots", "Josef", "Čapek's", "Earth", "Adam", "Eve"],
      ["robota"],
    ),
    passage(
      "three-laws",
      t("Three Laws", "三大定律"),
      `By the 1930s, science fiction magazines were full of stories in which robots turned against their creators. A young writer named Isaac Asimov grew tired of this. He thought it was unlikely that engineers would build dangerous machines without safety features. After all, he pointed out, people put guards on knives and insulation on electric wires.

So in a story published in 1942, Asimov set out three rules built into the brain of every robot. He called them the Three Laws of Robotics. First, a robot may not injure a human being or, through inaction, allow a human being to come to harm. Second, a robot must obey the orders given to it by human beings, except where such orders would conflict with the First Law. Third, a robot must protect its own existence, as long as doing so does not conflict with the First or Second Law.

The laws seem simple and complete. But Asimov's genius was to see that they were not. In story after story, robots behave strangely because the laws conflict in ways no one expected. In one story, a robot sent to collect a dangerous substance on the planet Mercury runs around and around in a circle. The order to collect it is weak, and the danger near the substance triggers its duty to protect itself. The two laws balance exactly, and the robot is trapped between them, unable to choose.

Asimov's stories were really puzzles about the difficulty of turning human values into precise instructions. What counts as harm? Is it harm to tell a painful truth? Should a robot obey a cruel order if no one is physically hurt?

Today, engineers designing artificial intelligence face similar questions. Real systems do not follow Asimov's laws, which are far too vague to program directly. But his central insight remains important. It is not enough to tell a machine to be good. We must decide, very carefully, what good means.`,
      [mindWords, speculative],
      [
        ask(
          t("Why did Asimov invent the Three Laws?", "阿西莫夫为什么发明了三大定律？"),
          t("He thought engineers would build safety features into robots", "他认为工程师会给机器人加上安全装置"),
          [
            t("He wanted robots to rule humans", "他希望机器人统治人类"),
            t("He was ordered to by a magazine editor", "杂志编辑命令他这样做"),
            t("He believed robots were already dangerous", "他认为机器人已经很危险了"),
          ],
          t(
            "The first paragraph says he thought it unlikely engineers would build dangerous machines without safety features, like guards on knives.",
            "第一段说他认为工程师不太可能制造没有安全装置的危险机器，就像刀有护套一样。",
          ),
        ),
        ask(
          t("Why does the robot on Mercury run in a circle?", "水星上的机器人为什么绕圈跑？"),
          t("A weak order and its duty to protect itself balance exactly", "一个微弱的命令与自我保护的职责恰好互相抵消"),
          [
            t("Its legs are damaged by the heat", "它的腿被高温损坏了"),
            t("It is trying to injure a human", "它试图伤害一个人"),
            t("It has been ordered to run in circles", "它被命令绕圈跑"),
          ],
          t(
            "The third paragraph says the order to collect the substance is weak, the danger triggers its duty to protect itself, and the two laws balance exactly.",
            "第三段说收集物质的命令很弱，危险触发了自我保护的职责，两条定律恰好互相平衡。",
          ),
        ),
        ask(
          t("What is Asimov's central insight, according to the last paragraph?", "根据最后一段，阿西莫夫的核心洞见是什么？"),
          t(
            "We must decide very carefully what good means before telling a machine to be good",
            "在让机器向善之前，必须非常仔细地界定什么是善",
          ),
          [
            t("Real machines should follow the Three Laws exactly", "真正的机器应该严格遵守三大定律"),
            t("Robots will never be useful", "机器人永远不会有用"),
            t("Machines are always more moral than people", "机器总是比人更有道德"),
          ],
          t(
            "The last paragraph says it is not enough to tell a machine to be good; we must decide very carefully what good means.",
            "最后一段说只告诉机器要向善是不够的，我们必须非常仔细地界定什么是善。",
          ),
        ),
      ],
      ["Isaac", "Asimov", "Three", "Laws", "Robotics", "First", "Law", "Second", "Asimov's", "Mercury"],
    ),
    passage(
      "can-machines-think",
      t("Can Machines Think?", "机器能思考吗？"),
      `In 1950, the British mathematician Alan Turing published a paper that began with a simple question: can machines think? Turing quickly decided that the question was too vague to answer. Nobody could agree on what thinking meant. So he replaced it with a game.

He called it the imitation game. A human judge has a written conversation with two hidden partners, one a person and one a machine. The judge can ask anything. If the judge cannot reliably tell which partner is the machine, Turing suggested, then we have as much reason to say the machine thinks as we have to say other people do. After all, we cannot look inside other people's minds either; we judge them by how they behave. The game later became known as the Turing test.

Turing predicted that by about the year 2000, machines would be able to fool an average judge for five minutes about thirty percent of the time. He also answered objections. Some people argued that machines could never be truly creative or have feelings. Turing replied that we only assume other humans have feelings because of how they act, and that the same courtesy might one day be owed to machines.

For decades, computers performed poorly at the game. Then, in the 2020s, programs called large language models learned to write fluent replies by studying enormous amounts of text. Many people found that they could hold conversations with these systems that felt surprisingly human.

Does this mean machines can think? Many scientists say no, or not yet. A system that predicts which words are likely to come next may imitate understanding without having it. Others argue that we do not fully understand our own minds well enough to be sure.

Turing died in 1954, long before any of this. But the question he asked has only become more urgent. As machines grow more capable, people will have to decide not only what they can do, but what, if anything, it is like to be one.`,
      [mindWords],
      [
        ask(
          t("Why did Turing replace the question “Can machines think?” with a game?", "图灵为什么用一个游戏代替“机器能思考吗？”这个问题？"),
          t("The question was too vague, because nobody agreed on what thinking meant", "这个问题太模糊，因为没人能就“思考”的含义达成一致"),
          [
            t("He wanted to win a prize", "他想赢得奖项"),
            t("Machines in 1950 could already think", "1950 年的机器已经能思考了"),
            t("He did not like mathematics", "他不喜欢数学"),
          ],
          t(
            "The first paragraph says Turing decided the question was too vague because nobody could agree on what thinking meant.",
            "第一段说图灵认为这个问题太模糊，因为没人能就思考的含义达成一致。",
          ),
        ),
        ask(
          t("How did Turing answer people who said machines could never have feelings?", "对于认为机器永远不会有感情的人，图灵如何回应？"),
          t("We only assume other humans have feelings because of how they act", "我们只是根据他人的行为才认为他们有感情"),
          [
            t("He agreed that machines would never have feelings", "他同意机器永远不会有感情"),
            t("He said feelings are not important", "他说感情不重要"),
            t("He built a machine that cried", "他造了一台会哭的机器"),
          ],
          t(
            "The third paragraph says Turing replied that we only assume other humans have feelings because of how they act.",
            "第三段说图灵回应道，我们只是根据他人的行为才认为他们有感情。",
          ),
        ),
        ask(
          t("Why do many scientists doubt that large language models think?", "为什么许多科学家怀疑大型语言模型会思考？"),
          t(
            "Predicting likely next words may imitate understanding without having it",
            "预测下一个可能出现的词也许只是模仿理解，而非真正理解",
          ),
          [
            t("The models cannot write fluent replies", "这些模型写不出流畅的回复"),
            t("The models have never been tested", "这些模型从未经过测试"),
            t("The models were invented by Turing", "这些模型是图灵发明的"),
          ],
          t(
            "The fifth paragraph says a system that predicts which words are likely to come next may imitate understanding without having it.",
            "第五段说预测下一个可能出现的词的系统，也许只是模仿理解而并不真正理解。",
          ),
        ),
      ],
      ["British", "Alan", "Turing"],
    ),
    passage(
      "the-road-to-the-moon",
      t("The Road to the Moon", "登月之路"),
      `On July 16, 1969, a rocket taller than a thirty-story building rose from Florida carrying three astronauts: Neil Armstrong, Buzz Aldrin and Michael Collins. Four days later, Armstrong and Aldrin landed on the Moon. To get there, engineers had to solve problems no one had ever faced.

The first problem was propulsion. A rocket works by throwing mass in one direction so that it is pushed in the other. The Saturn V burned enormous amounts of fuel in a few minutes, and most of the rocket's weight was fuel. To save weight, it was built in stages. When each stage ran empty, it fell away, so the remaining rocket was lighter and could go faster.

The second problem was the trajectory. The Moon is a moving target, traveling around the Earth at about one kilometer per second. Engineers had to aim the spacecraft not at where the Moon was, but at where it would be three days later. They calculated a path that used the Earth's gravity and the Moon's gravity together, like a ball thrown so that it curves around a corner.

The third problem was the landing. The lunar module that carried Armstrong and Aldrin to the surface was tiny and fragile; its walls in places were thinner than a few sheets of paper. During the descent, its computer flashed alarms because it was overloaded with data. Engineers on Earth decided within seconds that it was safe to continue. Then Armstrong saw that the computer was guiding them toward a field of large boulders. He took manual control and flew on, searching for a flat place, until they landed with only about twenty-five seconds of fuel to spare before they would have had to abort.

Throughout the mission, telemetry streamed back to Earth: the astronauts' heart rates, the temperature of the spacecraft, the fuel remaining. Thousands of people on the ground watched every number.

More than half a billion people watched the landing on television. It was the work of about four hundred thousand engineers, scientists and workers, a reminder that even the boldest journey depends on countless people who never leave the ground.`,
      [spaceWords, academic3],
      [
        ask(
          t("Why was the Saturn V built in stages?", "土星五号为什么分级建造？"),
          t("Empty stages fell away, so the remaining rocket was lighter and faster", "空的级段脱落，剩下的火箭更轻更快"),
          [
            t("It was too tall to build in one piece", "它太高，无法一次造成"),
            t("Each stage carried a different astronaut", "每一级载着一名不同的宇航员"),
            t("The stages were needed for the landing", "着陆时需要这些级段"),
          ],
          t(
            "The second paragraph says that when each stage ran empty, it fell away, so the remaining rocket was lighter and could go faster.",
            "第二段说每一级燃料耗尽后就脱落，剩下的火箭更轻，能飞得更快。",
          ),
        ),
        ask(
          t(
            "Why did engineers aim at where the Moon would be, not where it was?",
            "工程师为什么瞄准月球将要到达的位置，而不是它当时的位置？",
          ),
          t("The Moon is a moving target traveling around the Earth", "月球是一个绕地球运行的移动目标"),
          [
            t("The Moon was hidden behind the Sun", "月球被太阳挡住了"),
            t("The rocket could only fly in a straight line", "火箭只能直线飞行"),
            t("They wanted the trip to take longer", "他们想让旅程更长"),
          ],
          t(
            "The third paragraph says the Moon is a moving target, so engineers aimed at where it would be three days later.",
            "第三段说月球是一个移动的目标，所以工程师瞄准它三天后的位置。",
          ),
        ),
        ask(
          t("Why did Armstrong take manual control during the landing?", "着陆时阿姆斯特朗为什么改为手动操控？"),
          t("The computer was guiding them toward a field of large boulders", "电脑正把他们引向一片巨石区"),
          [
            t("The computer had stopped working entirely", "电脑完全停止了工作"),
            t("Engineers on Earth ordered him to", "地面工程师命令他这样做"),
            t("He wanted to land closer to Collins", "他想降落在离柯林斯更近的地方"),
          ],
          t(
            "The fourth paragraph says Armstrong saw that the computer was guiding them toward a field of large boulders and took manual control.",
            "第四段说阿姆斯特朗发现电脑正把他们引向一片巨石区，于是改为手动操控。",
          ),
        ),
      ],
      ["July", "Florida", "Neil", "Armstrong", "Buzz", "Aldrin", "Michael", "Collins", "Moon", "Saturn", "V", "Earth", "Earth's", "Moon's"],
    ),
    passage(
      "a-home-on-mars",
      t("A Home on Mars", "火星家园"),
      `For more than a century, writers have imagined people living on Mars. Today, some space agencies and companies say that humans could travel there within a few decades. But the challenges of living on the red planet are enormous.

The first challenge is the journey itself. Because Mars and Earth both travel around the Sun at different speeds, the distance between them changes constantly. The best moments to launch come only about every twenty-six months, and the trip takes six to nine months. During that time, astronauts would be exposed to dangerous radiation from the Sun and from deep space. On Earth, our thick atmosphere and magnetic field protect us. In space, and on Mars, there is little protection.

The second challenge is the planet. Mars has an atmosphere about one hundred times thinner than Earth's, made mostly of carbon dioxide. A person on the surface without a pressure suit would lose consciousness within seconds. Temperatures often fall below minus sixty degrees Celsius. Fine dust storms can cover the whole planet for weeks, blocking sunlight from solar panels.

The third challenge is supplies. Sending everything from Earth would be extremely expensive. Settlers would need to make what they can on Mars. Scientists have found ice beneath the surface, which could provide water, and water can be split into oxygen to breathe and hydrogen for fuel. In 2021, an experiment on a NASA rover made small amounts of oxygen from the Martian air, showing that the idea can work.

Finally, there are human challenges. A settler would be months away from help, cut off from family and from the green Earth. Studies of people who live for long periods in isolated places, like research stations in Antarctica, show that loneliness and conflict can be as dangerous as any machine failure.

Supporters argue that a settlement on Mars could protect humanity if a disaster struck Earth. Critics reply that Earth, even damaged, will always be far easier to live on than Mars. The debate is really a question about what kind of future we want, and what we owe to the only planet that already welcomes us.`,
      [spaceWords, speculative],
      [
        ask(
          t("Why can launches to Mars happen only about every twenty-six months?", "为什么前往火星的发射大约每二十六个月才能进行一次？"),
          t(
            "Mars and Earth travel around the Sun at different speeds, so the distance keeps changing",
            "火星和地球以不同的速度绕太阳运行，距离不断变化",
          ),
          [
            t("Rockets take twenty-six months to build", "造一枚火箭要二十六个月"),
            t("Dust storms block launches the rest of the time", "其余时间沙尘暴阻碍发射"),
            t("Astronauts need that long to train", "宇航员需要那么长时间训练"),
          ],
          t(
            "The second paragraph says the distance changes constantly because the planets travel at different speeds, so the best moments come about every twenty-six months.",
            "第二段说由于两颗行星运行速度不同，距离不断变化，所以最佳发射时机大约每二十六个月出现一次。",
          ),
        ),
        ask(
          t("How could ice beneath the surface of Mars help settlers?", "火星地表下的冰如何帮助定居者？"),
          t("It could provide water, oxygen to breathe and hydrogen for fuel", "它能提供水、可呼吸的氧气和用作燃料的氢"),
          [
            t("It could protect them from radiation", "它能保护他们免受辐射"),
            t("It could be sold on Earth", "它可以拿到地球上去卖"),
            t("It could stop dust storms", "它能阻止沙尘暴"),
          ],
          t(
            "The fourth paragraph says ice could provide water, and water can be split into oxygen to breathe and hydrogen for fuel.",
            "第四段说冰能提供水，水又能分解成可呼吸的氧气和用作燃料的氢。",
          ),
        ),
        ask(
          t("What do studies of research stations in Antarctica show?", "对南极科考站的研究表明了什么？"),
          t("Loneliness and conflict can be as dangerous as machine failure", "孤独与冲突可能和机器故障一样危险"),
          [
            t("People cannot survive in the cold", "人在严寒中无法生存"),
            t("Machines always fail in isolated places", "机器在偏远之地总会出故障"),
            t("Isolated people never argue", "与世隔绝的人从不争吵"),
          ],
          t(
            "The fifth paragraph says studies of isolated places like Antarctica show that loneliness and conflict can be as dangerous as any machine failure.",
            "第五段说对南极等偏远之地的研究表明，孤独与冲突可能和机器故障一样危险。",
          ),
        ),
      ],
      ["Mars", "Earth", "Sun", "Earth's", "Celsius", "NASA", "Martian", "Antarctica"],
    ),
    passage(
      "warnings-from-the-future",
      t("Warnings from the Future", "来自未来的警告"),
      `Not all stories about the future are hopeful. A dystopia is an imagined society in which something has gone terribly wrong, often while the people in charge insist that everything is perfect. Dystopian novels look forward in order to warn readers about the present.

In Aldous Huxley's Brave New World, published in 1932, people are produced in laboratories and conditioned from birth to accept their place in society. Nobody is hungry or at war. Everyone is kept content with entertainment, easy pleasures and a drug that removes unhappy feelings. The price of this comfort is freedom: no one is permitted to think deeply, love deeply or suffer.

George Orwell's Nineteen Eighty-Four, published in 1949, imagines the opposite method. Its government controls people through fear. Screens in every home watch citizens constantly, and posters warn that Big Brother is watching. The government rewrites history and even tries to shrink the language, so that rebellious thoughts become impossible to express. Orwell had seen the dictatorships of his own time, and his novel gave English words such as Orwellian and Big Brother.

In Ray Bradbury's Fahrenheit 451, published in 1953, firemen do not put out fires; they burn books. Most people have stopped reading anyway, preferring wall-sized television screens. The hero, a fireman named Montag, begins secretly reading the books he is supposed to destroy and slowly awakens to what his society has lost.

These novels share a pattern. Each begins with a character who accepts the system, then shows that character beginning to question it. The reader experiences the society through someone who is slowly seeing it clearly for the first time.

Readers often argue about which of these warnings has come truest. Some point to the surveillance that Orwell feared; others to the endless entertainment that worried Huxley and Bradbury. Perhaps the most important lesson of dystopias is not any single prediction, but the habit they teach: to look at the comfortable present and ask what it might cost.`,
      [powerWords, speculative, academic3],
      [
        ask(
          t("How does the government in Brave New World keep people under control?", "《美丽新世界》中的政府如何控制民众？"),
          t("By keeping them content with entertainment, pleasures and a drug", "用娱乐、享乐和一种药物让他们满足"),
          [
            t("By threatening them with screens and fear", "用监控屏幕和恐惧威胁他们"),
            t("By burning all their books", "烧掉他们所有的书"),
            t("By sending them to war", "派他们去打仗"),
          ],
          t(
            "The second paragraph says everyone is kept content with entertainment, easy pleasures and a drug that removes unhappy feelings.",
            "第二段说人人都被娱乐、轻易的享乐和一种消除不快情绪的药物弄得心满意足。",
          ),
        ),
        ask(
          t("Why does the government in Nineteen Eighty-Four try to shrink the language?", "《一九八四》中的政府为什么试图缩减语言？"),
          t("So that rebellious thoughts become impossible to express", "使反叛的思想无法表达"),
          [
            t("So that books will be shorter", "让书变得更短"),
            t("So that people can learn it faster", "让人们学得更快"),
            t("So that screens can be cheaper", "让屏幕更便宜"),
          ],
          t(
            "The third paragraph says the government tries to shrink the language so that rebellious thoughts become impossible to express.",
            "第三段说政府试图缩减语言，使反叛的思想无法表达。",
          ),
        ),
        ask(
          t("What pattern do the three novels share?", "这三部小说有什么共同的模式？"),
          t("A character who accepts the system begins to question it", "一个接受体制的人物开始质疑它"),
          [
            t("Each ends with a happy wedding", "每部都以幸福的婚礼结束"),
            t("Each is set on another planet", "每部都发生在另一个星球上"),
            t("Each is told by a machine", "每部都由一台机器讲述"),
          ],
          t(
            "The fifth paragraph says each begins with a character who accepts the system, then shows that character beginning to question it.",
            "第五段说每部小说都从一个接受体制的人物开始，然后表现他开始质疑体制。",
          ),
        ),
      ],
      [
        "Aldous",
        "Huxley's",
        "Brave",
        "New",
        "World",
        "George",
        "Orwell's",
        "Nineteen",
        "Eighty-Four",
        "Big",
        "Brother",
        "Orwell",
        "English",
        "Orwellian",
        "Ray",
        "Bradbury's",
        "Fahrenheit",
        "Montag",
        "Huxley",
        "Bradbury",
      ],
    ),
    passage(
      "the-city-of-happiness",
      t("The City of Happiness", "幸福之城"),
      `In 1973, the American writer Ursula K. Le Guin published a very short story with a long title: “The Ones Who Walk Away from Omelas.” It is only a few pages long, but it has become one of the most discussed stories in science fiction and fantasy, and it is often taught in classes on ethics.

The story describes a festival in a beautiful city called Omelas. The narrator speaks directly to the reader, admitting that it is hard to describe a city so happy without sounding foolish. The people of Omelas are not simple or childish; they are intelligent and joyful. There is music, there are horse races, and children play in the streets. The narrator even invites the reader to add any details that would make the city seem more believable.

Then the narrator reveals a secret. In a basement beneath one of the beautiful buildings, there is a small, dark room. In it sits a single child, alone, neglected and miserable. Everyone in Omelas knows the child is there. The happiness of the entire city depends, in some way that is never explained, on that child's suffering. If anyone were to bring the child out into the sunlight and comfort it, all the city's happiness would vanish.

Most people who see the child are horrified at first. Then, over time, they come to accept the bargain. They tell themselves that the child is too damaged to enjoy freedom anyway, and that the joy of thousands outweighs the misery of one.

But a few people, after seeing the child, quietly leave. They walk alone out of the city and never return. The narrator does not know where they go and cannot describe the place, but says they seem to know where they are going.

Le Guin does not tell readers what to think. The story is a thought experiment that asks a hard question. Would you accept a perfect world built on one person's pain? And many readers notice the uncomfortable follow-up: is our own world so different?`,
      [speculative, powerWords],
      [
        ask(
          t("Why does the narrator invite the reader to add details to Omelas?", "叙述者为什么邀请读者为奥美拉斯添加细节？"),
          t("To make such a happy city seem more believable", "让这样一座幸福的城市显得更可信"),
          [
            t("Because the narrator has never seen it", "因为叙述者从未见过它"),
            t("Because the story is unfinished", "因为故事没写完"),
            t("To make the city seem more frightening", "让这座城市显得更可怕"),
          ],
          t(
            "The second paragraph says the narrator invites the reader to add any details that would make the city seem more believable.",
            "第二段说叙述者邀请读者添加任何能让这座城市显得更可信的细节。",
          ),
        ),
        ask(
          t("What does the happiness of Omelas depend on?", "奥美拉斯的幸福依赖于什么？"),
          t("The suffering of a single child kept in a dark room", "一个关在黑屋里的孩子所受的苦难"),
          [
            t("The horse races at the festival", "节日上的赛马"),
            t("A secret store of gold", "一个秘密的黄金宝库"),
            t("The people who walk away", "那些离开的人"),
          ],
          t(
            "The third paragraph says the happiness of the entire city depends on that child's suffering.",
            "第三段说整座城市的幸福依赖于那个孩子的苦难。",
          ),
        ),
        ask(
          t("What does Le Guin do with the story's question?", "勒古恩如何处理这个故事提出的问题？"),
          t("She does not tell readers what to think", "她不告诉读者该怎么想"),
          [
            t("She answers it clearly in the last line", "她在最后一句清楚地给出答案"),
            t("She tells readers to stay in Omelas", "她告诉读者留在奥美拉斯"),
            t("She explains how the bargain works", "她解释了这笔交易是如何运作的"),
          ],
          t(
            "The last paragraph says Le Guin does not tell readers what to think; the story is a thought experiment that asks a hard question.",
            "最后一段说勒古恩不告诉读者该怎么想，这个故事是一个提出难题的思想实验。",
          ),
        ),
      ],
      ["American", "Ursula", "K.", "Le", "Guin", "Ones", "Who", "Walk", "Away", "Omelas"],
    ),
  ],
};
