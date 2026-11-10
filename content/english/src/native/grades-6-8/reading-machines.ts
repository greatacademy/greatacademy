// Grades 6 to 8: the reading unit of the seventh theme, machines that changed the world, from the printing press to
// the smartphone.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const techWords = { topic: "words-of-technology", weight: 0.3 } as const;
const comparing = { topic: "comparing-texts-on-a-topic", weight: 0.2 } as const;
const structures = { topic: "text-structures", weight: 0.2 } as const;

/** machinesThatChangedTheWorld is a reading unit of grades 6 to 8 on inventions and how they changed daily life. */
export const machinesThatChangedTheWorld: ReadingUnitDef = {
  id: "machines-that-changed-the-world",
  title: t("Machines That Changed the World", "改变世界的机器"),
  passages: [
    passage(
      "the-printing-press",
      t("The Printing Press", "印刷机"),
      `For most of history, every book had to be copied by hand. A single copy of a long book could take a scribe many months, so books were rare and expensive, and few people learned to read.

Printing itself was not new. In China, printers had carved whole pages into wooden blocks for centuries, and around the year 1040 an inventor named Bi Sheng made movable type from baked clay. Each character was a separate piece that could be arranged, printed and used again. Later, Korean printers cast type in metal.

In Germany, around 1450, a goldsmith named Johannes Gutenberg put several ideas together. He designed a mold for casting metal letters quickly and in great numbers, mixed an oil-based ink that stuck to metal, and adapted a press like the ones used to squeeze grapes for wine. His mechanism could print hundreds of pages a day.

The effects spread quickly. Within fifty years, printing shops had opened in more than two hundred European cities, and millions of books had been printed. Because books were cheaper, more people learned to read. Scientists could share their discoveries exactly, without the errors that crept in when copies were made by hand. New ideas about religion and government traveled faster than any ruler could stop them.

Some historians call the printing press the most important invention of the last thousand years. Whether or not that is true, it is hard to imagine schools, newspapers or modern science without it.`,
      [clues, techWords, structures, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("Why were books rare before printing in Europe?", "在欧洲印刷术出现之前，书为什么很稀少？"),
          t("Each copy had to be written by hand, which took months", "每本书都要手抄，需要好几个月"),
          [
            t("Few people wanted to read", "很少有人想读书"),
            t("Paper had not yet been invented", "纸还没有被发明"),
            t("Rulers banned all books", "统治者禁止一切书籍"),
          ],
          t("The first paragraph says a single copy could take a scribe many months.", "第一段说，抄写员抄一本书可能要好几个月。"),
        ),
        ask(
          t("What did Gutenberg do that was new?", "古腾堡做了什么新的事情？"),
          t("He combined metal type, a new ink and a press into one system", "他把金属活字、新墨水和压印机组合成一套系统"),
          [
            t("He invented printing for the first time", "他第一个发明了印刷"),
            t("He made the first movable type from clay", "他第一个用陶土做了活字"),
            t("He wrote the first book", "他写了第一本书"),
          ],
          t(
            "The passage says printing and movable type already existed in China and Korea; Gutenberg put several ideas together.",
            "文章说，印刷和活字在中国和朝鲜早已存在；古腾堡是把几种想法结合在了一起。",
          ),
        ),
        ask(
          t("Which effect of the printing press does the passage NOT mention?", "文章没有提到印刷机的哪一个影响？"),
          t("It made travel between cities faster", "它让城市之间的旅行更快了"),
          [
            t("More people learned to read", "更多人学会了阅读"),
            t("Scientists shared discoveries without copying errors", "科学家分享发现时不再有抄写错误"),
            t("New ideas spread more quickly", "新思想传播得更快"),
          ],
          t(
            "The fourth paragraph lists reading, science and the spread of ideas, but not faster travel.",
            "第四段列出了阅读、科学和思想传播，但没有提到旅行变快。",
          ),
        ),
      ],
      ["Bi", "Sheng", "Korean", "Johannes", "Gutenberg"],
    ),
    passage(
      "the-steam-engine",
      t("The Steam Engine", "蒸汽机"),
      `For thousands of years, work was powered by muscles, wind and falling water. A mill had to be built beside a river, and a ship could only sail when the wind blew. The steam engine changed that.

The idea is simple. When water is heated until it boils, it turns into steam and expands, taking up far more space. If that steam is trapped in a cylinder, it can push a piston, and the moving piston can turn a wheel.

The first practical steam engines, built in England in the early 1700s, pumped water out of coal mines. They worked, but they were not efficient: they burned enormous amounts of coal. In the 1760s, a Scottish instrument maker named James Watt noticed that much of the heat was wasted because the cylinder was cooled with every stroke. He added a separate chamber to cool the steam, so the cylinder could stay hot. His engines used far less fuel, and later improvements let them turn wheels smoothly.

Now factories no longer had to be built beside rivers. They could be built anywhere coal could be delivered, and they grew larger than ever before. Steam locomotives pulled trains across whole countries, and steamships crossed oceans whether the wind blew or not. Cities filled with workers.

The change came at a cost. Factory work was long and dangerous, children worked in the mills, and coal smoke darkened the skies. Yet the steam engine began the Industrial Revolution, and with it the modern world.`,
      [clues, techWords, structures],
      [
        ask(
          t("How does steam make an engine move?", "蒸汽是怎样让发动机运转的？"),
          t("Expanding steam pushes a piston, which turns a wheel", "膨胀的蒸汽推动活塞，活塞带动轮子转动"),
          [
            t("Steam cools the wheel so it spins", "蒸汽让轮子冷却从而旋转"),
            t("Burning coal pulls the piston", "燃烧的煤拉动活塞"),
            t("Wind blows the steam through a sail", "风把蒸汽吹过船帆"),
          ],
          t(
            "The second paragraph explains that trapped steam pushes a piston that can turn a wheel.",
            "第二段解释说，被困住的蒸汽推动活塞，活塞可以带动轮子。",
          ),
        ),
        ask(
          t("What problem did James Watt solve?", "詹姆斯·瓦特解决了什么问题？"),
          t("Early engines wasted heat and burned too much coal", "早期的发动机浪费热量，耗煤太多"),
          [
            t("Engines could not pump water", "发动机不能抽水"),
            t("Factories had no workers", "工厂没有工人"),
            t("Trains could not cross rivers", "火车不能过河"),
          ],
          t(
            "Watt noticed that heat was wasted when the cylinder was cooled, so he added a separate chamber.",
            "瓦特注意到气缸冷却时会浪费热量，于是加了一个单独的冷凝室。",
          ),
        ),
        ask(
          t("How is the passage mainly organized?", "这篇文章主要是怎样组织的？"),
          t("Cause and effect: the engine and the changes it caused", "因果结构：蒸汽机及其带来的变化"),
          [
            t("A list of steps to build an engine", "建造发动机的步骤清单"),
            t("A story told by a factory worker", "一位工人讲述的故事"),
            t("A comparison of two inventors", "对两位发明家的比较"),
          ],
          t(
            "The passage explains the invention and then the effects it had on factories, travel and cities, including its costs.",
            "文章先解释这项发明，再讲它对工厂、交通和城市的影响，包括它的代价。",
          ),
        ),
      ],
      ["England", "Scottish", "James", "Watt"],
    ),
    passage(
      "the-telegraph",
      t("The Telegraph", "电报"),
      `In 1800, a message could travel no faster than a horse or a ship. News of a battle might take weeks to reach a capital city, and a letter across the Atlantic Ocean took about a month. By 1870, the same message could cross the ocean in minutes. The telegraph made the difference.

A telegraph sends electricity through a long wire. When an operator presses a key, the circuit is closed and a pulse of current travels down the line. At the other end, the pulse moves a device that clicks or makes a mark. Several inventors built telegraphs in the 1830s, but the system that spread most widely was developed in the United States by Samuel Morse and his partner Alfred Vail.

The key to their success was a code. Morse code turned every letter into a pattern of short and long signals, called dots and dashes. A skilled operator could transmit and read dozens of words a minute.

In 1844, Morse sent a message from Washington to Baltimore, about forty miles away. Within twenty years, wires stretched across continents, and in 1866 a cable laid on the floor of the Atlantic Ocean finally linked Europe and North America for good.

The telegraph changed daily life in ways people had never imagined. Newspapers could print yesterday's news from distant cities. Railways used it to keep trains from crashing. Businesses could check prices in other markets in an instant. For the first time in history, information could travel faster than people.`,
      [clues, techWords, comparing],
      [
        ask(
          t("What happens when a telegraph operator presses the key?", "电报员按下电键时会发生什么？"),
          t("The circuit closes and a pulse of current travels down the wire", "电路接通，一股电流沿着电线传过去"),
          [
            t("A letter is printed in ink", "一封信被用墨水印出来"),
            t("A horse is sent with the message", "派一匹马去送信"),
            t("A voice is carried through the wire", "声音通过电线传过去"),
          ],
          t(
            "The second paragraph explains that pressing the key closes the circuit and sends a pulse.",
            "第二段解释说，按下电键会接通电路并发出电脉冲。",
          ),
        ),
        ask(
          t("Why was Morse code important to the telegraph's success?", "为什么说摩尔斯电码对电报的成功很重要？"),
          t("It turned every letter into signals an operator could send quickly", "它把每个字母变成电报员能快速发送的信号"),
          [
            t("It made the wires longer", "它让电线更长了"),
            t("It let people talk by voice", "它让人们能用声音交谈"),
            t("It was a secret only Morse knew", "它是只有摩尔斯知道的秘密"),
          ],
          t(
            "The third paragraph says the code turned letters into dots and dashes that operators could send at dozens of words a minute.",
            "第三段说，电码把字母变成点和划，电报员每分钟能发送几十个单词。",
          ),
        ),
        ask(
          t("What is the central idea of the passage?", "这篇文章的中心思想是什么？"),
          t("The telegraph let information travel faster than people for the first time", "电报第一次让信息传播得比人还快"),
          [
            t("Samuel Morse was a famous painter", "塞缪尔·摩尔斯是一位著名的画家"),
            t("Ships were the fastest way to send news", "轮船是传递消息最快的方式"),
            t("Telegraph wires were often broken", "电报线经常断"),
          ],
          t(
            "The opening contrast between 1800 and 1870 and the last sentence both point to this idea.",
            "开头 1800 年与 1870 年的对比和最后一句都指向这个观点。",
          ),
        ),
      ],
      ["Atlantic", "Samuel", "Morse", "Alfred", "Vail", "Washington", "Baltimore", "Europe"],
    ),
    passage(
      "the-light-bulb",
      t("The Light Bulb", "电灯泡"),
      `Ask people who invented the light bulb, and most will say Thomas Edison. The real story is more interesting, because the light bulb was the work of many inventors over many years.

As early as 1802, the English scientist Humphry Davy showed that electricity could make a thin strip of metal glow. The problem was that the glowing material, called a filament, quickly burned up in air. For decades, inventors in several countries tried to solve it. They pumped the air out of glass bulbs and tested filaments of platinum, carbon and other materials. In England, Joseph Swan built a working carbon-filament lamp around 1879, and in the same year Edison's team in New Jersey made a bulb that glowed for many hours.

What made Edison's work stand out was not a single bulb but a whole system. His team tested thousands of materials until they found a filament of baked bamboo that lasted more than a thousand hours. They also designed the generators, wires, switches and meters needed to bring electricity into homes. In 1882, Edison opened a power station in New York City that lit buildings for several blocks. Edison and Swan later joined their companies instead of fighting over patents.

Electric light changed how people lived. Streets became safer after dark. Factories could run at night. Students could read long after sunset without the smoke and danger of oil lamps and candles. Within fifty years, electric light had spread to cities around the world.`,
      [clues, techWords, comparing],
      [
        ask(
          t("What was the main problem with early filaments?", "早期灯丝的主要问题是什么？"),
          t("They burned up quickly in air", "它们在空气中很快就烧坏了"),
          [
            t("They were too heavy to lift", "它们太重，拿不起来"),
            t("They gave off no light", "它们根本不发光"),
            t("They were too cheap to sell", "它们太便宜，卖不出去"),
          ],
          t("The second paragraph says the filament quickly burned up in air.", "第二段说，灯丝在空气中很快就会烧坏。"),
        ),
        ask(
          t("According to the passage, what made Edison's work stand out?", "根据文章，爱迪生的工作有什么突出之处？"),
          t("He built a whole system for bringing electricity into homes", "他建立了一整套把电送进家庭的系统"),
          [
            t("He made the very first glowing filament", "他做出了第一根发光的灯丝"),
            t("He worked entirely alone", "他完全独自工作"),
            t("He refused to share his patents", "他拒绝分享专利"),
          ],
          t(
            "The third paragraph says it was not a single bulb but a whole system: generators, wires, switches and meters.",
            "第三段说，突出的不是一只灯泡，而是一整套系统：发电机、电线、开关和电表。",
          ),
        ),
        ask(
          t('How does the author\'s view differ from what "most people" believe?', "作者的观点与“大多数人”的看法有什么不同？"),
          t("The light bulb was the work of many inventors, not Edison alone", "电灯泡是许多发明家的成果，不只是爱迪生一个人的"),
          [
            t("Edison never worked on light bulbs", "爱迪生从未研究过电灯泡"),
            t("The light bulb was invented in 1982", "电灯泡是 1982 年发明的"),
            t("Candles are better than electric light", "蜡烛比电灯好"),
          ],
          t(
            "The first paragraph sets up the common belief, then says the bulb was the work of many inventors over many years.",
            "第一段先提出普遍看法，然后说电灯泡是许多发明家多年努力的成果。",
          ),
        ),
      ],
      ["Thomas", "Edison", "English", "Humphry", "Davy", "England", "Joseph", "Swan", "Edison's", "Jersey", "York"],
    ),
    passage(
      "the-telephone",
      t("The Telephone", "电话"),
      `The telegraph could send words across a continent, but only as dots and dashes, and only through trained operators. In the 1870s, several inventors raced to send something harder: the human voice.

Alexander Graham Bell was a teacher of deaf students who had studied how sound travels. Sound is a vibration in the air. Bell's idea was to turn those vibrations into a changing electric current, send the current through a wire, and turn it back into vibrations at the other end. In his device, a thin sheet called a diaphragm shook when someone spoke into it, and the shaking changed the current.

On March 10, 1876, Bell spoke into his machine in one room while his assistant, Thomas Watson, listened in another. Bell's notebook records the first words: "Mr. Watson, come here, I want to see you." Watson heard them and came running.

Bell had filed his patent only days before. On the very same day, another inventor, Elisha Gray, had filed papers describing a similar idea, and the two sides argued about who came first for years. Bell kept his patent, and his company grew enormous.

At first, many people thought the telephone was a toy. Who would want to talk to someone they could not see? But by 1900 there were more than a million telephones in the United States. Doctors could be called in an emergency, and families separated by distance could hear each other's voices. For the first time, a conversation did not need two people in the same place.`,
      [clues, techWords, structures],
      [
        ask(
          t("How did Bell's telephone carry a voice?", "贝尔的电话是怎样传送声音的？"),
          t("It turned sound vibrations into a changing current and back into sound", "它把声音的振动变成变化的电流，再变回声音"),
          [
            t("It sent dots and dashes through the wire", "它通过电线发送点和划"),
            t("It carried the air itself through a tube", "它通过管道把空气本身送过去"),
            t("It used light to send messages", "它用光来传送信息"),
          ],
          t(
            "The second paragraph describes vibrations becoming a changing current and then vibrations again.",
            "第二段描述了振动变成变化的电流，再变回振动。",
          ),
        ),
        ask(
          t('What does the word "diaphragm" mean in the passage?', '文中 "diaphragm" 是什么意思？'),
          t("A thin sheet that shakes when someone speaks", "人说话时会振动的薄片"),
          [t("A long copper wire", "一根长铜线"), t("A kind of battery", "一种电池"), t("A written notebook", "一本笔记本")],
          t(
            "The passage defines it right away: a thin sheet that shook when someone spoke into it.",
            "文章紧接着给出了定义：人对着它说话时会振动的薄片。",
          ),
        ),
        ask(
          t("What does the passage say about Elisha Gray?", "文章是怎样提到伊莱沙·格雷的？"),
          t("He filed papers on a similar idea on the same day as Bell", "他和贝尔在同一天提交了类似想法的文件"),
          [
            t("He was Bell's assistant", "他是贝尔的助手"),
            t("He heard the first telephone call", "他听到了第一通电话"),
            t("He invented the telegraph", "他发明了电报"),
          ],
          t(
            "The fourth paragraph says Gray filed papers describing a similar idea on the very same day.",
            "第四段说，格雷在同一天提交了描述类似想法的文件。",
          ),
        ),
      ],
      ["Alexander", "Graham", "Bell", "Bell's", "March", "Thomas", "Watson", "Mr", "Elisha", "Gray"],
      ["diaphragm"],
    ),
    passage(
      "the-airplane",
      t("The Airplane", "飞机"),
      `People have dreamed of flying for as long as they have watched birds. For centuries, would-be fliers strapped on wings and jumped from towers, usually with painful results. By the late 1800s, inventors had learned to build gliders that could carry a person through the air, but no one could control a powered machine in flight.

Wilbur and Orville Wright ran a bicycle shop in Ohio. They were not trained engineers, but they were careful and patient. They read everything they could find about flight, then tested ideas themselves. When they found that published tables about the lift of wings were wrong, they built a small wind tunnel and tested more than two hundred wing shapes.

The brothers understood that the hardest problem was control. A flying machine had to be steered and balanced in three directions, like a bicycle rider leaning into a turn. They designed a way to twist the wings slightly, which let the pilot roll the plane left or right. Because no engine light enough could be bought, their mechanic built one.

On December 17, 1903, at Kitty Hawk, North Carolina, Orville lay on the lower wing and flew for twelve seconds, covering about one hundred twenty feet. By the end of the day, Wilbur had flown for nearly a minute.

Few people noticed at first. Within a few decades, though, airplanes were carrying mail, passengers and soldiers. Today, millions of people fly every day, crossing in hours distances that once took months.`,
      [clues, techWords, structures],
      [
        ask(
          t("Why did the Wright brothers build a wind tunnel?", "莱特兄弟为什么建造风洞？"),
          t(
            "The published tables about wings were wrong, so they tested shapes themselves",
            "公开的机翼数据表是错的，所以他们自己测试形状",
          ),
          [
            t("To cool their bicycle shop", "为了给自行车店降温"),
            t("To build a stronger engine", "为了造更强大的发动机"),
            t("To make money from visitors", "为了从参观者那里赚钱"),
          ],
          t(
            "The second paragraph says they found the tables were wrong and tested more than two hundred wing shapes.",
            "第二段说，他们发现数据表有误，于是测试了两百多种机翼形状。",
          ),
        ),
        ask(
          t("What did the brothers see as the hardest problem of flight?", "莱特兄弟认为飞行最难的问题是什么？"),
          t("Controlling and balancing the machine in the air", "在空中控制和平衡飞行器"),
          [
            t("Finding a place to fly", "找到飞行的地方"),
            t("Making the plane look like a bird", "让飞机看起来像鸟"),
            t("Selling tickets to passengers", "向乘客卖票"),
          ],
          t("The third paragraph begins by saying the hardest problem was control.", "第三段开头就说，最难的问题是控制。"),
        ),
        ask(
          t("Why does the author compare the airplane to a bicycle rider?", "作者为什么把飞机比作骑自行车的人？"),
          t(
            "To show that a plane must be balanced and steered, like leaning into a turn",
            "说明飞机必须保持平衡并转向，就像骑车转弯时身体倾斜",
          ),
          [
            t("To show that planes have wheels", "说明飞机有轮子"),
            t("To show that bicycles can fly", "说明自行车能飞"),
            t("To show that the brothers disliked bicycles", "说明兄弟俩不喜欢自行车"),
          ],
          t(
            "The comparison explains control in three directions with something familiar, and it fits the brothers' bicycle work.",
            "这个比较用熟悉的事物解释三个方向的控制，也与兄弟俩修自行车的经历相呼应。",
          ),
        ),
      ],
      ["Wilbur", "Orville", "Wright", "Ohio", "December", "Kitty", "Hawk", "Carolina"],
    ),
    passage(
      "the-computer",
      t("The Computer", "计算机"),
      `The word "computer" once meant a person. In the 1800s and early 1900s, teams of human computers, many of them women, worked out long calculations by hand for astronomers, engineers and armies.

People had long tried to build machines to help. In the 1830s, the English mathematician Charles Babbage designed a mechanical engine that could follow a list of instructions. Ada Lovelace, who studied his plans, wrote that such a machine might one day work with music and pictures, not just numbers. The machine was never finished, but her notes are often called the first computer program.

The first electronic computers were built in the 1940s, during the Second World War. One of them, ENIAC, filled a large room, weighed about thirty tons and used some eighteen thousand glass vacuum tubes, which burned out often. It could do in seconds what took a human computer days.

The great change came with the transistor, invented in 1947. A transistor is a tiny switch that controls the flow of electricity. It was smaller, cheaper and far more efficient than a vacuum tube. Later, engineers learned to place thousands, then millions, then billions of transistors on a single chip of silicon.

Each step made computers smaller and more powerful. In the 1970s, computers small enough for a desk went on sale. Today, a phone in a student's pocket is millions of times more powerful than ENIAC. Computers now help design medicines, forecast the weather, guide spacecraft and connect people across the world.`,
      [clues, techWords, structures],
      [
        ask(
          t('What did the word "computer" originally mean?', '"computer" 这个词最初是什么意思？'),
          t("A person who did calculations", "做计算的人"),
          [t("A large machine", "一台大型机器"), t("A kind of clock", "一种钟表"), t("A pocket phone", "一部手机")],
          t(
            "The first paragraph says the word once meant a person who worked out calculations by hand.",
            "第一段说，这个词曾经指用手做计算的人。",
          ),
        ),
        ask(
          t("Why was the transistor such an important invention?", "为什么说晶体管是一项非常重要的发明？"),
          t("It was smaller, cheaper and more efficient than vacuum tubes", "它比真空管更小、更便宜、更高效"),
          [
            t("It made computers fill whole rooms", "它让计算机占满整个房间"),
            t("It replaced all human workers", "它取代了所有人类工人"),
            t("It was invented by Ada Lovelace", "它是阿达·洛夫莱斯发明的"),
          ],
          t(
            "The fourth paragraph says the transistor was smaller, cheaper and far more efficient than a vacuum tube.",
            "第四段说，晶体管比真空管更小、更便宜、效率更高。",
          ),
        ),
        ask(
          t("How is the passage mainly organized?", "这篇文章主要是怎样组织的？"),
          t("In time order, from human computers to modern phones", "按时间顺序，从人工计算员到现代手机"),
          [
            t("As a problem and a single solution", "一个问题加一个解决办法"),
            t("As a list of computer brands", "一份计算机品牌清单"),
            t("As a comparison of two countries", "对两个国家的比较"),
          ],
          t(
            "The passage moves through the 1800s, the 1830s, the 1940s, 1947, the 1970s and today.",
            "文章依次讲了 19 世纪、19 世纪 30 年代、20 世纪 40 年代、1947 年、20 世纪 70 年代和今天。",
          ),
        ),
      ],
      ["English", "Charles", "Babbage", "Ada", "Lovelace", "ENIAC"],
      ["transistor", "transistors", "silicon"],
    ),
    passage(
      "the-smartphone",
      t("The Smartphone", "智能手机"),
      `Thirty years ago, a person who wanted to take a photo, find a street on a map, listen to music, check the news and call a friend needed a camera, a paper map, a music player, a newspaper and a telephone. Today, many people carry all of these in one small device.

A smartphone is really a small computer that can also make calls. Its key parts had been invented separately: the mobile phone in the 1970s, the touch screen, the digital camera, and satellite navigation that shows your position anywhere on Earth. Engineers spent years making each part small enough, and efficient enough, to fit together and run on a battery.

Several companies sold early smartphones with tiny keyboards. The great change came in 2007, when phones with large touch screens and no keyboards went on sale, and soon after, stores where people could download thousands of programs, called apps. Within ten years, more than two billion people owned a smartphone, and in many countries people went straight from having no phone to carrying a powerful computer.

The smartphone has brought real benefits. Farmers can check crop prices, students can look up almost anything, and families far apart can see each other's faces. Yet it has brought new problems too. Many people find it hard to put their phones down, and scientists are studying how screens affect sleep, attention and the way young people feel about themselves.

Like the printing press and the telegraph before it, the smartphone has changed how information moves. How we use it is still up to us.`,
      [clues, techWords, comparing],
      [
        ask(
          t("What point does the first paragraph make?", "第一段说明了什么？"),
          t("One device now does the jobs of many older ones", "如今一台设备能完成许多旧设备的工作"),
          [
            t("Cameras were invented thirty years ago", "相机是三十年前发明的"),
            t("Paper maps are better than phones", "纸质地图比手机好"),
            t("People no longer listen to music", "人们不再听音乐了"),
          ],
          t(
            "It lists five separate things people once needed and says many now carry them all in one device.",
            "它列出了人们过去需要的五样东西，并说现在许多人用一台设备就能全部带上。",
          ),
        ),
        ask(
          t("What happened in 2007, according to the passage?", "根据文章，2007 年发生了什么？"),
          t("Phones with large touch screens and no keyboards went on sale", "带大触摸屏、没有键盘的手机开始销售"),
          [
            t("The first mobile phone was invented", "第一部移动电话被发明"),
            t("Two billion people bought phones", "二十亿人买了手机"),
            t("Satellite navigation was invented", "卫星导航被发明"),
          ],
          t(
            "The third paragraph names 2007 as the year phones with large touch screens went on sale.",
            "第三段指出，2007 年带大触摸屏的手机开始销售。",
          ),
        ),
        ask(
          t("How does the author present the smartphone?", "作者是怎样介绍智能手机的？"),
          t("As an invention with both real benefits and new problems", "作为一项既有真正好处又带来新问题的发明"),
          [
            t("As a harmful toy that should be banned", "作为一件应该被禁止的有害玩具"),
            t("As a perfect invention with no downsides", "作为一项没有缺点的完美发明"),
            t("As a failure that few people use", "作为一项很少有人使用的失败发明"),
          ],
          t(
            "The fourth paragraph gives benefits and then problems, and the last line says how we use it is up to us.",
            "第四段先讲好处再讲问题，最后一句说怎样使用取决于我们自己。",
          ),
        ),
      ],
      [],
    ),
  ],
};
