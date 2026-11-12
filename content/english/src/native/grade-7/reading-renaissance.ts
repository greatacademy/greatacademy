// Grade 7: the reading unit of the third theme, the Renaissance, from the workshops of Florence to the printing
// press and the new astronomy.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const renaissanceWords = { topic: "words-of-the-renaissance", weight: 0.3 } as const;
const scienceWords = { topic: "words-of-science-in-the-renaissance", weight: 0.3 } as const;
const artistWords = { topic: "words-of-artists-and-workshops", weight: 0.3 } as const;
const interact = { topic: "how-individuals-and-events-interact", weight: 0.2 } as const;
const scientificIdea = { topic: "tracing-a-scientific-idea-over-time", weight: 0.2 } as const;
const latin4 = { topic: "latin-roots-4", weight: 0.1 } as const;
const academic1 = { topic: "academic-words-1", weight: 0.1 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;
const academic3 = { topic: "academic-words-3", weight: 0.1 } as const;

/** aRebirthOfIdeas is a reading unit of grade 7 on the Renaissance, its artists, its printers and its scientists. */
export const aRebirthOfIdeas: ReadingUnitDef = {
  id: "a-rebirth-of-ideas",
  title: t("A Rebirth of Ideas", "思想的重生"),
  passages: [
    passage(
      "why-the-renaissance-began-in-italy",
      t("Why the Renaissance Began in Italy", "文艺复兴为何始于意大利"),
      `The word Renaissance means "rebirth." Historians use it for a period in Europe, roughly from 1350 to 1600, when people looked back with new interest at the art, writing and ideas of ancient Greece and Rome. But why did this rebirth begin in the cities of northern Italy rather than in Paris or London?

One reason is that Italy was surrounded by the remains of the ancient world. In Rome, the ruins of temples and arches stood in the middle of fields where cattle grazed. Italian scholars could walk past the past every day, and many of them began to search monasteries for forgotten copies of ancient books.

A second reason was trade. Cities such as Venice, Genoa and Florence sat on the busy routes that linked Europe with the markets of the eastern Mediterranean. Their merchants grew rich by trading in silk, spices and wool, and their bankers lent money to kings and popes. This wealth paid for new buildings, paintings and schools.

A third reason was competition. Italy was not one country but a patchwork of independent city-states, each with its own rulers. These rulers wanted their cities to be the most splendid in Italy, so they competed to hire the best architects and artists.

Finally, in 1453 the city of Constantinople fell to the Ottoman Turks. Many Greek scholars fled west to Italy, bringing with them precious manuscripts and the knowledge of how to read them.

No single cause explains the Renaissance. It grew from the meeting of ruins, riches, rivalry and refugees in one crowded corner of Europe.`,
      [renaissanceWords, interact, latin4, academic2],
      [
        ask(
          t("What does the word Renaissance mean?", "Renaissance 这个词是什么意思？"),
          t("Rebirth", "重生"),
          [t("Ruins", "废墟"), t("Trade", "贸易"), t("Competition", "竞争")],
          t(
            "The first sentence says the word Renaissance means rebirth, a new interest in the ideas of ancient Greece and Rome.",
            "第一句话说 Renaissance 的意思是重生，即对古希腊和古罗马思想的重新关注。",
          ),
        ),
        ask(
          t("How did trade help the Renaissance begin?", "贸易是怎样帮助文艺复兴兴起的？"),
          t(
            "It made merchants and bankers rich enough to pay for buildings, art and schools",
            "它让商人和银行家富裕起来，有钱资助建筑、艺术和学校",
          ),
          [
            t("It brought ancient ruins to Italy from Greece", "它把古代遗迹从希腊运到了意大利"),
            t("It united the city-states into one country", "它把各城邦统一成了一个国家"),
            t("It forced Greek scholars to flee to Paris", "它迫使希腊学者逃往巴黎"),
          ],
          t(
            "The third paragraph says merchants grew rich from trade and bankers lent money to kings, and this wealth paid for new buildings, paintings and schools.",
            "第三段说商人通过贸易致富，银行家向国王放贷，这些财富资助了新的建筑、绘画和学校。",
          ),
        ),
        ask(
          t("How did the fall of Constantinople affect Italy?", "君士坦丁堡的陷落对意大利有什么影响？"),
          t("Greek scholars fled there with manuscripts and the skill to read them", "希腊学者带着手稿和阅读它们的本领逃到了那里"),
          [
            t("It made the Italian city-states poorer", "它使意大利各城邦变穷了"),
            t("It ended the trade in silk and spices", "它终结了丝绸和香料贸易"),
            t("It destroyed the ruins of ancient Rome", "它摧毁了古罗马的遗迹"),
          ],
          t(
            "The fifth paragraph says many Greek scholars fled west to Italy after 1453, bringing precious manuscripts and the knowledge of how to read them.",
            "第五段说1453年后许多希腊学者向西逃到意大利，带去了珍贵的手稿和阅读它们的知识。",
          ),
        ),
      ],
      [
        "Renaissance",
        "Venice",
        "Genoa",
        "Florence",
        "Constantinople",
        "Ottoman",
        "Turks",
        "Mediterranean",
        "Paris",
        "London",
        "Italy",
        "Italian",
        "Rome",
        "Europe",
        "Greek",
        "Greece",
      ],
    ),
    passage(
      "the-family-that-ran-florence",
      t("The Family That Ran Florence", "掌管佛罗伦萨的家族"),
      `In the 1400s, the most powerful people in Florence were not kings or dukes. They were bankers. The Medici family ran one of the largest banks in Europe, with branches in Rome, Venice, London and other cities. Their money gave them the power to shape the city, and the way they used it helped make Florence the heart of the Renaissance.

Cosimo de' Medici, who led the family from 1434, never held the title of ruler. Officially, Florence was a republic governed by elected councils. But Cosimo used his wealth to make sure his friends were chosen for those councils, so in practice his word decided most matters.

Cosimo was also a great patron, someone who supports artists and scholars with money. He paid for churches, libraries and a famous school where scholars studied the works of the Greek thinker Plato. He hired the sculptor Donatello and the architect Brunelleschi, whose enormous dome still crowns the cathedral of Florence.

His grandson Lorenzo, known as Lorenzo the Magnificent, continued the tradition. He was a poet himself, and he invited a teenage sculptor named Michelangelo to live in his palace and study his collection of ancient statues.

Why did the Medici spend so much on art? Partly, they loved it. But art also served their interests. A family that paid for a beautiful chapel showed the whole city its wealth and good taste, and it won the respect of the people it ruled.

The Medici were not always popular, and they were driven from Florence more than once. Yet the paintings, buildings and statues they paid for are still visited by millions today.`,
      [renaissanceWords, artistWords, interact],
      [
        ask(
          t(
            "How did Cosimo de' Medici control Florence without being its official ruler?",
            "科西莫·德·美第奇没有成为官方统治者，是怎样控制佛罗伦萨的？",
          ),
          t("He used his wealth to get his friends chosen for the councils", "他用财富让自己的朋友被选进议会"),
          [
            t("He was elected king by the people", "他被人民选为国王"),
            t("He led an army that captured the city", "他率领军队占领了这座城市"),
            t("He was appointed by the pope", "他由教皇任命"),
          ],
          t(
            "The second paragraph says Florence was officially a republic, but Cosimo made sure his friends were chosen for the councils, so his word decided most matters.",
            "第二段说佛罗伦萨名义上是共和国，但科西莫确保他的朋友被选进议会，所以大多数事情由他说了算。",
          ),
        ),
        ask(
          t("What is a patron, as the passage uses the word?", "按照文章的用法，patron 是什么意思？"),
          t("Someone who supports artists and scholars with money", "用金钱资助艺术家和学者的人"),
          [
            t("An elected member of a council", "议会的民选成员"),
            t("A sculptor who studies ancient statues", "研究古代雕像的雕塑家"),
            t("A banker who lends money to kings", "借钱给国王的银行家"),
          ],
          t(
            "The third paragraph defines the word right after it: someone who supports artists and scholars with money.",
            "第三段在这个词后面紧接着给出了定义：用金钱资助艺术家和学者的人。",
          ),
        ),
        ask(
          t(
            "According to the passage, why did paying for art serve the Medici's interests?",
            "根据文章，为什么资助艺术符合美第奇家族的利益？",
          ),
          t("It showed their wealth and taste and won the respect of the people", "它展示了他们的财富和品味，赢得了人民的尊重"),
          [
            t("It earned the bank more money than lending did", "它为银行赚的钱比放贷还多"),
            t("It made them the official rulers of the republic", "它让他们成为共和国的官方统治者"),
            t("It kept them from ever being driven out of Florence", "它让他们永远不会被赶出佛罗伦萨"),
          ],
          t(
            "The fifth paragraph says a beautiful chapel showed the city the family's wealth and good taste and won the respect of the people it ruled; the last paragraph says they were still driven out more than once.",
            "第五段说一座美丽的礼拜堂向全城展示了这个家族的财富和品味，赢得了被统治者的尊重；最后一段说他们仍不止一次被赶走。",
          ),
        ),
      ],
      [
        "Medici",
        "Cosimo",
        "de'",
        "Lorenzo",
        "Plato",
        "Donatello",
        "Brunelleschi",
        "Michelangelo",
        "Florence",
        "Rome",
        "Venice",
        "London",
        "Europe",
        "Greek",
        "Renaissance",
        "Magnificent",
      ],
    ),
    passage(
      "life-in-an-artists-workshop",
      t("Life in an Artist's Workshop", "画家作坊里的生活"),
      `Today we often picture a great artist working alone, waiting for inspiration. In Renaissance Italy, art was made very differently. Most paintings and statues came out of busy workshops, where a master artist worked with a team of assistants and apprentices.

A boy might join a workshop as an apprentice at around the age of twelve. His family usually signed a contract with the master, who agreed to feed and house the boy and teach him the trade. In return, the apprentice worked for years without pay.

At first, the apprentice did the simplest jobs. He swept the floor, cleaned brushes and ground minerals and plants into fine powders to make pigments, the colored materials that paint is made from. He learned to prepare wooden panels by covering them with layers of white plaster called gesso, sanding each one smooth.

Slowly, he moved on to drawing. Apprentices spent hours copying the master's drawings and sketching plaster casts of ancient statues, until their hands could capture every fold of cloth and curve of muscle. Only after years of practice were they allowed to paint parts of a real commission, such as a sky, a landscape or the clothing of a minor figure. The master usually painted the faces and hands himself.

This system trained many of the greatest artists of the age. Leonardo da Vinci was an apprentice in the workshop of Andrea del Verrocchio in Florence. According to an old story, Leonardo painted an angel in one of Verrocchio's paintings so beautifully that his master decided never to paint again. The story may not be true, but it shows how a workshop could turn an apprentice into a master.`,
      [artistWords, renaissanceWords],
      [
        ask(
          t("What did a master agree to do for an apprentice?", "师傅答应为学徒做什么？"),
          t("Feed and house him and teach him the trade", "供他吃住并教他手艺"),
          [
            t("Pay him a wage every week", "每周付他工钱"),
            t("Let him paint the faces in every painting", "让他画每幅画中的面孔"),
            t("Send him to study in Rome", "送他去罗马学习"),
          ],
          t(
            "The second paragraph says the master agreed to feed and house the boy and teach him the trade, while the apprentice worked without pay.",
            "第二段说师傅答应供这个男孩吃住并教他手艺，而学徒无偿工作。",
          ),
        ),
        ask(
          t("Which job would an apprentice most likely do first?", "学徒最可能先做哪项工作？"),
          t("Grinding minerals into powder for pigments", "把矿物磨成粉末制作颜料"),
          [
            t("Painting the face of a saint", "画一位圣徒的脸"),
            t("Signing a contract with a new patron", "与新的赞助人签订合同"),
            t("Painting the sky in a commission", "为委托作品画天空"),
          ],
          t(
            "The third paragraph lists the simplest first jobs: sweeping, cleaning brushes and grinding minerals and plants into pigments. Painting parts of a commission came only after years.",
            "第三段列出了最初最简单的工作：扫地、洗画笔、把矿物和植物磨成颜料。为委托作品画局部要在多年之后。",
          ),
        ),
        ask(
          t(
            "Why does the author tell the story of Leonardo's angel even though it may not be true?",
            "作者为什么讲述列奥纳多画天使的故事，尽管它可能不是真的？",
          ),
          t("It shows how a workshop could turn an apprentice into a master", "它说明了作坊如何把学徒培养成大师"),
          [
            t("It proves that Verrocchio was a poor painter", "它证明维罗基奥是个差劲的画家"),
            t("It shows that apprentices usually painted the faces", "它说明学徒通常画面孔"),
            t("It explains why artists worked alone", "它解释了艺术家为什么独自工作"),
          ],
          t(
            "The last sentence gives the author's reason: the story may not be true, but it shows how a workshop could turn an apprentice into a master.",
            "最后一句给出了作者的理由：这个故事可能不是真的，但它说明了作坊如何把学徒培养成大师。",
          ),
        ),
      ],
      ["Leonardo", "da", "Vinci", "Andrea", "del", "Verrocchio", "Verrocchio's", "Florence", "Renaissance", "Italy", "Rome"],
      ["gesso"],
    ),
    passage(
      "the-artist-who-filled-notebooks",
      t("The Artist Who Filled Notebooks", "写满笔记本的艺术家"),
      `Leonardo da Vinci is famous for two paintings, the Mona Lisa and The Last Supper. Yet he finished surprisingly few pictures. Much of his energy went into something else: thousands of pages of notes and drawings about almost everything he saw.

Leonardo was endlessly curious. His notebooks hold careful drawings of the flow of water, the flight of birds and the shapes of plants. He studied how light falls on a face and how muscles move under skin. To understand the human body, he dissected more than thirty corpses, drawing the bones, muscles and organs with an accuracy that would not be matched for many years.

He also imagined machines that no one could yet build. His pages show designs for a flying machine with flapping wings, a kind of armored vehicle and a diving suit. Most of these machines would not have worked as drawn, but they show a mind that asked how things could be done, not just how they were done.

Leonardo wrote his notes in mirror writing, from right to left, so that they can be read easily only in a mirror. No one knows exactly why. He was left-handed, and writing this way may have kept him from smudging the ink.

After his death in 1519, his notebooks were scattered. Some pages were lost, and others sat in private collections for centuries. Because his discoveries stayed hidden, they did little to change the science of his time. Today, about seven thousand pages survive, and they show us what one curious person could learn simply by looking closely and asking why.`,
      [scienceWords, artistWords, interact],
      [
        ask(
          t("Why did Leonardo dissect corpses?", "列奥纳多为什么解剖尸体？"),
          t("To understand the human body", "为了了解人体"),
          [
            t("To design a diving suit", "为了设计潜水服"),
            t("To practice mirror writing", "为了练习镜像书写"),
            t("To finish The Last Supper", "为了完成《最后的晚餐》"),
          ],
          t(
            "The second paragraph says he dissected more than thirty corpses to understand the human body, drawing bones, muscles and organs.",
            "第二段说他为了了解人体解剖了三十多具尸体，画下了骨骼、肌肉和器官。",
          ),
        ),
        ask(
          t("What does the passage suggest about Leonardo's machines?", "文章对列奥纳多的机器有什么暗示？"),
          t(
            "They show how he imagined new ways of doing things, even if most would not work",
            "它们显示了他对新方法的设想，尽管大多数行不通",
          ),
          [
            t("They were built and used by the armies of Florence", "佛罗伦萨的军队制造并使用了它们"),
            t("They were copied from ancient Greek books", "它们是从古希腊书籍中抄来的"),
            t("They worked perfectly as he drew them", "它们完全按照他画的样子运转"),
          ],
          t(
            "The third paragraph says most of the machines would not have worked as drawn, but they show a mind that asked how things could be done.",
            "第三段说大多数机器按图纸造出来都行不通，但它们显示了一个追问事情可以怎样做的头脑。",
          ),
        ),
        ask(
          t("Why did Leonardo's discoveries do little to change the science of his time?", "为什么列奥纳多的发现对当时的科学影响不大？"),
          t("His notebooks were scattered and stayed hidden after his death", "他的笔记本在他死后散落各处，一直不为人知"),
          [
            t("Other scientists did not believe his drawings", "其他科学家不相信他的图画"),
            t("He wrote in a language no one else could read", "他用一种别人都看不懂的语言写作"),
            t("He destroyed his notebooks before he died", "他在死前毁掉了笔记本"),
          ],
          t(
            "The last paragraph says the notebooks were scattered and sat in private collections for centuries, and because his discoveries stayed hidden, they did little to change the science of his time.",
            "最后一段说笔记本散落各处，在私人收藏中沉睡了几百年，正因为他的发现一直不为人知，它们对当时的科学影响不大。",
          ),
        ),
      ],
      ["Leonardo", "da", "Vinci", "Mona", "Lisa", "Supper"],
    ),
    passage(
      "the-machine-that-spread-ideas",
      t("The Machine That Spread Ideas", "传播思想的机器"),
      `Before the middle of the 1400s, every book in Europe had to be copied by hand. A skilled scribe might spend months copying a single Bible. Books were so rare and costly that a large library might own only a few hundred, and most people never owned a book at all.

Around 1450, a goldsmith in the German city of Mainz named Johannes Gutenberg changed this. Printing itself was not new; for centuries, printers in China and Korea had used carved blocks and even movable type. Gutenberg's achievement was to combine several ideas into a system that worked quickly in Europe. He cast small metal letters, each one a piece of type, which could be arranged into lines and pages, inked and pressed onto paper. When a page was finished, the letters could be taken apart and used again. He adapted a press like those used to squeeze grapes for wine, and he mixed an oil-based ink that clung to metal.

The results were astonishing. A printing shop could produce hundreds of copies of a book in the time it took a scribe to copy one. By 1500, presses in more than two hundred European cities had printed millions of books.

As books became cheaper, more people learned to read. Scholars could compare the same text in many cities, so errors were caught and corrected. New ideas, from the discoveries of scientists to arguments about religion, now spread across Europe in weeks instead of years.

The printing press did not cause the Renaissance, which had already begun. But it carried the Renaissance far beyond Italy, and it helped make sure that its ideas could never be lost again.`,
      [renaissanceWords, interact, latin4, academic1, academic2],
      [
        ask(
          t("What was new about Gutenberg's achievement?", "古腾堡的成就新在哪里？"),
          t("He combined metal type, a press and a new ink into a fast system", "他把金属活字、印刷机和新墨水结合成一个快速的系统"),
          [
            t("He invented printing for the first time in history", "他在历史上首次发明了印刷"),
            t("He was the first to carve blocks of wood for printing", "他第一个雕刻木块用于印刷"),
            t("He copied books by hand faster than any scribe", "他手抄书比任何抄写员都快"),
          ],
          t(
            "The second paragraph says printing itself was not new, since printers in China and Korea had used blocks and movable type; Gutenberg combined several ideas, metal type, an adapted press and oil-based ink, into a system.",
            "第二段说印刷本身并不新，中国和朝鲜的印刷工早已使用雕版和活字；古腾堡把金属活字、改造的压榨机和油性墨水等几种想法结合成一个系统。",
          ),
        ),
        ask(
          t("How did printing help scholars catch errors?", "印刷是怎样帮助学者发现错误的？"),
          t("They could compare the same text in many cities", "他们可以在许多城市比对同一文本"),
          [
            t("Scribes checked every printed page", "抄写员检查每一页印刷品"),
            t("Printers refused to print books with errors", "印刷工拒绝印有错误的书"),
            t("Metal type could not make mistakes", "金属活字不会出错"),
          ],
          t(
            "The fourth paragraph says scholars could compare the same text in many cities, so errors were caught and corrected.",
            "第四段说学者可以在许多城市比对同一文本，所以错误被发现并纠正了。",
          ),
        ),
        ask(
          t("What is the author's view of how printing and the Renaissance were connected?", "作者对印刷和文艺复兴之间关系的看法是什么？"),
          t("Printing did not cause the Renaissance but spread it beyond Italy", "印刷没有引发文艺复兴，但把它传播到了意大利以外"),
          [
            t("Printing was the main cause of the Renaissance", "印刷是文艺复兴的主要原因"),
            t("The Renaissance had ended before printing began", "印刷出现之前文艺复兴就结束了"),
            t("Printing slowed the spread of Renaissance ideas", "印刷减缓了文艺复兴思想的传播"),
          ],
          t(
            "The last paragraph says the printing press did not cause the Renaissance, which had already begun, but carried it far beyond Italy.",
            "最后一段说印刷机没有引发已经开始的文艺复兴，但把它带到了意大利以外的远方。",
          ),
        ),
      ],
      ["Gutenberg", "Johannes", "Mainz", "German", "China", "Korea", "Bible", "Europe", "European", "Renaissance", "Italy"],
    ),
    passage(
      "moving-the-sun-to-the-center",
      t("Moving the Sun to the Center", "把太阳移到中心"),
      `For more than a thousand years, most European scholars believed that the Earth sat still at the center of the universe. The sun, the moon, the planets and the stars all circled around it. This geocentric model came from the ancient Greek astronomer Ptolemy, and it seemed to match what anyone could see: the sun rises in the east, crosses the sky and sets in the west.

But the model had problems. Some planets, such as Mars, seemed at times to stop and move backward across the sky before moving forward again. To explain this, Ptolemy's followers had to add circles within circles to their model, making it more and more complicated.

In 1543, a Polish astronomer named Nicolaus Copernicus published a book with a bold idea. What if the sun, not the Earth, were at the center, and the Earth were just one of several planets moving around it? In this heliocentric model, the backward motion of Mars was simple to explain. The faster Earth was passing the slower Mars, the way a fast car on a highway seems to make a slower one drift backward.

Few people accepted the idea at first. It seemed to go against common sense: if the Earth were moving, why didn't people feel it? It also went against the teachings of the Church. And Copernicus could not prove his model; he could only show that it was simpler.

Proof would come later, from new instruments and careful measurements. Copernicus died the year his book was published, but the question he raised would change how people saw their place in the universe.`,
      [scienceWords, scientificIdea],
      [
        ask(
          t("What problem did the geocentric model have trouble explaining?", "地心说难以解释什么问题？"),
          t("Why some planets seemed to move backward across the sky", "为什么有些行星看起来在天空中逆行"),
          [
            t("Why the sun rises in the east", "为什么太阳从东方升起"),
            t("Why the moon circles the Earth", "为什么月亮绕地球转"),
            t("Why people cannot feel the Earth move", "为什么人们感觉不到地球在动"),
          ],
          t(
            "The second paragraph says some planets, such as Mars, seemed to stop and move backward, and Ptolemy's followers had to add circles within circles to explain it.",
            "第二段说一些行星，比如火星，似乎会停下来并逆行，托勒密的追随者不得不在模型中添加圆中之圆来解释。",
          ),
        ),
        ask(
          t("Why does the author compare Earth and Mars to two cars on a highway?", "作者为什么把地球和火星比作高速公路上的两辆车？"),
          t("To explain why Mars seems to move backward when Earth passes it", "为了解释地球超过火星时火星为什么看起来在后退"),
          [
            t("To show that Mars is larger than Earth", "为了说明火星比地球大"),
            t("To prove that the Earth stands still", "为了证明地球是静止的"),
            t("To describe how fast the sun moves", "为了描述太阳移动得多快"),
          ],
          t(
            "The third paragraph uses the comparison: the faster Earth passing the slower Mars makes Mars seem to drift backward, just as a fast car makes a slower one seem to.",
            "第三段使用了这个比较：较快的地球超过较慢的火星，使火星看起来在后退，就像快车让慢车看起来在后退一样。",
          ),
        ),
        ask(
          t("Why did few people accept Copernicus's idea at first?", "为什么起初很少有人接受哥白尼的观点？"),
          t("It went against common sense and Church teaching, and he could not prove it", "它违背常识和教会的教义，而且他无法证明"),
          [
            t("His model was more complicated than Ptolemy's", "他的模型比托勒密的更复杂"),
            t("He did not publish it in a book", "他没有把它写成书出版"),
            t("New instruments showed that he was wrong", "新的仪器证明他错了"),
          ],
          t(
            "The fourth paragraph gives three reasons: the idea seemed to go against common sense, it went against the teachings of the Church, and Copernicus could only show it was simpler, not prove it.",
            "第四段给出了三个原因：这个观点似乎违背常识，违背教会的教义，而且哥白尼只能说明它更简单，却无法证明。",
          ),
        ),
      ],
      ["Ptolemy", "Ptolemy's", "Nicolaus", "Copernicus", "Copernicus's", "Polish", "Mars", "Church", "Earth", "European", "Greek"],
    ),
    passage(
      "galileo-and-the-telescope",
      t("Galileo and the Telescope", "伽利略和望远镜"),
      `In 1609, an Italian professor named Galileo Galilei heard about a new Dutch invention: a tube with two glass lenses that made distant objects look closer. Galileo did not have one, so he built his own, and then he improved it until it could magnify objects about twenty times. Then he did something few had thought to do. He pointed it at the night sky.

What he saw changed astronomy. The moon was not a perfect, smooth ball, as many believed, but rough, with mountains and craters. The Milky Way was not a cloud but countless faint stars. Most important, he saw four small points of light near the planet Jupiter that moved from night to night. He realized that they were moons circling Jupiter.

This was powerful evidence. If moons circled Jupiter, then not everything in the sky circled the Earth. Galileo also watched Venus and saw that it went through phases, like our moon, growing from a thin crescent to a full circle. The geocentric model could not explain the full set of phases, but the idea of Copernicus, with Venus circling the sun, explained them easily.

Galileo published his findings and argued boldly for the heliocentric model. This brought him into conflict with the Church, which taught that the Earth stood still. In 1633, he was put on trial in Rome and forced to say publicly that he had been wrong. He spent the rest of his life under house arrest.

Yet his evidence could not be taken back. Other astronomers built telescopes and saw the same moons and phases. Within a few generations, the idea that the Earth moves around the sun was accepted across Europe.`,
      [scienceWords, scientificIdea, interact, academic1],
      [
        ask(
          t("What did Galileo conclude about the four points of light near Jupiter?", "伽利略对木星附近的四个光点得出了什么结论？"),
          t("They were moons circling Jupiter", "它们是绕木星运行的卫星"),
          [
            t("They were distant stars of the Milky Way", "它们是银河中遥远的恒星"),
            t("They were mountains on the moon", "它们是月球上的山"),
            t("They were faults in his lenses", "它们是他镜片上的瑕疵"),
          ],
          t(
            "The second paragraph says the points moved from night to night and he realized they were moons circling Jupiter.",
            "第二段说这些光点每晚都在移动，他意识到它们是绕木星运行的卫星。",
          ),
        ),
        ask(
          t("Why were the phases of Venus evidence for the heliocentric model?", "为什么金星的相位是日心说的证据？"),
          t("The full set of phases made sense only if Venus circled the sun", "只有金星绕太阳运行，全部相位才说得通"),
          [
            t("They showed that Venus had moons of its own", "它们显示金星有自己的卫星"),
            t("They proved that the moon was rough", "它们证明了月球表面粗糙"),
            t("They showed that Venus stood still", "它们显示金星是静止的"),
          ],
          t(
            "The third paragraph says the geocentric model could not explain the full set of phases, but Copernicus's idea, with Venus circling the sun, explained them easily.",
            "第三段说地心说无法解释全部相位，而哥白尼的观点，即金星绕太阳运行，可以轻松解释。",
          ),
        ),
        ask(
          t("Why does the author say his evidence could not be taken back?", "作者为什么说他的证据收不回来了？"),
          t("Other astronomers could build telescopes and see the same things", "其他天文学家可以制造望远镜，看到同样的东西"),
          [
            t("Galileo refused to say he had been wrong", "伽利略拒绝承认自己错了"),
            t("The Church published his findings", "教会出版了他的发现"),
            t("His telescope was kept in a museum", "他的望远镜被保存在博物馆里"),
          ],
          t(
            "The last paragraph explains: other astronomers built telescopes and saw the same moons and phases, so the evidence stood even after Galileo was forced to recant.",
            "最后一段解释说：其他天文学家制造了望远镜，看到了同样的卫星和相位，所以即使伽利略被迫认错，证据依然成立。",
          ),
        ),
      ],
      [
        "Galileo",
        "Galilei",
        "Galileo's",
        "Dutch",
        "Jupiter",
        "Venus",
        "Milky",
        "Copernicus",
        "Church",
        "Rome",
        "Earth",
        "Europe",
        "Italian",
      ],
    ),
    passage(
      "four-years-on-a-ceiling",
      t("Four Years on a Ceiling", "天花板上的四年"),
      `In 1508, Pope Julius II gave Michelangelo a job he did not want. The pope asked him to paint the ceiling of the Sistine Chapel in Rome, a huge curved surface about forty meters long and high above the floor. Michelangelo thought of himself as a sculptor, not a painter, and he complained that painting was not his trade. But no one refused the pope.

Painting a ceiling was hard, slow work. Michelangelo designed a wooden platform that stood on supports fixed into the walls, so that the chapel below could still be used. He painted in fresco, a method in which paint is brushed onto fresh, wet plaster. As the plaster dries, the colors become part of the wall. This meant he had to work quickly, finishing each section in a single day before the plaster set.

He did not lie on his back, as people often imagine. He stood on the platform with his head bent back and his arm raised for hours. He later wrote a funny poem complaining that his beard pointed at the sky and paint dripped onto his face.

For four years he worked, often with only a few assistants. Slowly, more than three hundred figures appeared across the ceiling: prophets, heroes and scenes from the stories of the Bible. The most famous shows the creation of Adam, with two hands reaching toward each other, their fingers almost touching.

When the ceiling was revealed in 1512, people were amazed. The sculptor who had not wanted to paint had created one of the greatest paintings in the world.`,
      [artistWords, renaissanceWords, academic3],
      [
        ask(
          t("Why didn't Michelangelo want the job at first?", "米开朗琪罗起初为什么不想接这份工作？"),
          t("He thought of himself as a sculptor, not a painter", "他认为自己是雕塑家，不是画家"),
          [
            t("He was afraid of heights", "他恐高"),
            t("The pope would not pay him", "教皇不肯付钱给他"),
            t("He was busy painting another chapel", "他正忙着画另一座礼拜堂"),
          ],
          t(
            "The first paragraph says Michelangelo thought of himself as a sculptor and complained that painting was not his trade.",
            "第一段说米开朗琪罗认为自己是雕塑家，抱怨绘画不是他的本行。",
          ),
        ),
        ask(
          t("Why did painting in fresco force Michelangelo to work quickly?", "为什么湿壁画法迫使米开朗琪罗快速工作？"),
          t("He had to finish each section before the wet plaster dried", "他必须在湿灰泥干透之前完成每一部分"),
          [
            t("The pope wanted the ceiling finished in a week", "教皇要求一周内完成天花板"),
            t("The platform could only stand for one day", "脚手架只能撑一天"),
            t("Fresco paint dried in a few seconds", "湿壁画颜料几秒钟就干"),
          ],
          t(
            "The second paragraph says paint is brushed onto fresh, wet plaster and he had to finish each section in a single day before the plaster set.",
            "第二段说颜料要刷在新鲜的湿灰泥上，他必须在灰泥凝固前的一天之内完成每一部分。",
          ),
        ),
        ask(
          t("Which detail corrects a common belief about how Michelangelo worked?", "哪个细节纠正了关于米开朗琪罗工作方式的一个常见看法？"),
          t("He stood with his head bent back instead of lying down", "他是仰着头站着，而不是躺着"),
          [
            t("He worked with a few assistants", "他和几个助手一起工作"),
            t("He painted more than three hundred figures", "他画了三百多个人物"),
            t("He designed his own wooden platform", "他自己设计了木制脚手架"),
          ],
          t(
            "The third paragraph says he did not lie on his back, as people often imagine; he stood with his head bent back and his arm raised.",
            "第三段说他并不像人们常常想象的那样躺着，而是仰着头、举着手臂站着。",
          ),
        ),
      ],
      ["Julius", "II", "Michelangelo", "Sistine", "Adam", "Bible", "Pope", "Rome"],
    ),
  ],
};
