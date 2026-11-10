// Grades 6 to 8: the reading unit of the eighth theme, explorers and voyages, from the fleets of Zheng He to the
// first steps on the moon.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const exploreWords = { topic: "words-of-exploration", weight: 0.3 } as const;
const evidence = { topic: "citing-textual-evidence", weight: 0.2 } as const;
const structures = { topic: "text-structures", weight: 0.2 } as const;

/** explorersAndVoyages is a reading unit of grades 6 to 8 on great journeys of exploration and what they cost. */
export const explorersAndVoyages: ReadingUnitDef = {
  id: "explorers-and-voyages",
  title: t("Explorers and Voyages", "探险家与远航"),
  passages: [
    passage(
      "the-fleets-of-zheng-he",
      t("The Fleets of Zheng He", "郑和的船队"),
      `Nearly a century before European ships reached India by sea, a Chinese admiral named Zheng He commanded some of the largest fleets the world had ever seen.

Between 1405 and 1433, the emperors of the Ming dynasty sent Zheng He on seven great voyages. The first fleet is said to have carried about twenty-seven thousand people on more than two hundred ships. The largest, called treasure ships, were described as far longer than any wooden ship in Europe, though historians still debate their exact size. The fleets carried sailors, soldiers, doctors, translators and huge loads of silk and porcelain.

Zheng He did not sail to conquer land or build colonies. His voyages showed the power of the Ming emperors and invited distant rulers to send gifts and envoys to China. Using compasses and star charts, his navigators sailed to Southeast Asia, India, Arabia and the east coast of Africa. From one voyage they brought back a giraffe, which amazed the people of the capital.

Then the voyages stopped. After the emperor who supported them died, officials argued that the expeditions cost too much and that the empire's real dangers lay on its northern borders. The great ships were left to rot, and many records of the voyages were lost.

Historians still wonder what might have happened if the voyages had continued. China had the ships and the skills to explore the world's oceans. Instead, it turned inward, and within a hundred years European sailors were arriving in Asian ports.`,
      [clues, exploreWords, evidence],
      [
        ask(
          t("What was the main purpose of Zheng He's voyages?", "郑和航行的主要目的是什么？"),
          t("To show the emperor's power and invite rulers to send gifts", "展示皇帝的威力，邀请各国统治者朝贡"),
          [
            t("To conquer land and build colonies", "征服土地、建立殖民地"),
            t("To find a route to the South Pole", "寻找通往南极的航线"),
            t("To escape from the emperor", "逃离皇帝"),
          ],
          t(
            "The third paragraph says he did not sail to conquer or build colonies, but to show the emperors' power and invite rulers to send gifts and envoys.",
            "第三段说，他航行不是为了征服或殖民，而是为了展示皇帝的威力，邀请各国派使节朝贡。",
          ),
        ),
        ask(
          t("Why did the voyages stop?", "航行为什么停止了？"),
          t("Officials said they cost too much and the real danger was in the north", "官员们认为花费太大，真正的威胁在北方"),
          [
            t("The ships were all sunk in a storm", "所有船只都在风暴中沉没"),
            t("Zheng He refused to sail again", "郑和拒绝再次出海"),
            t("The fleet could not find any new lands", "船队找不到任何新的土地"),
          ],
          t(
            "The fourth paragraph gives the officials' reasons: the cost and the dangers on the northern borders.",
            "第四段给出了官员们的理由：花费太大，以及北方边境的威胁。",
          ),
        ),
        ask(
          t("Which sentence shows that some facts about the fleets are uncertain?", "哪一句表明关于船队的某些事实并不确定？"),
          t("Historians still debate their exact size", "历史学家至今仍在争论它们的确切大小"),
          [
            t("From one voyage they brought back a giraffe", "有一次航行他们带回了一头长颈鹿"),
            t("The fleets carried sailors, soldiers and doctors", "船队载着水手、士兵和医生"),
            t("The voyages stopped", "航行停止了"),
          ],
          t(
            'The phrase "still debate" signals that the size of the treasure ships is not known for sure.',
            "“仍在争论”这个说法表明宝船的大小还不能确定。",
          ),
        ),
      ],
      ["Zheng", "Ming", "Arabia", "Asian", "Southeast"],
      ["envoys"],
    ),
    passage(
      "polynesian-navigators",
      t("Polynesian Navigators", "波利尼西亚航海者"),
      `The Pacific Ocean covers nearly a third of the Earth's surface, and its islands are scattered across it like specks of dust. Yet more than a thousand years ago, the Polynesian people had found and settled almost all of them, from Hawaii in the north to New Zealand in the south and Easter Island in the east.

They made these voyages in large canoes with two hulls joined by a deck, and they carried no compass, map or clock. Instead, navigators read the ocean itself. They memorized the points on the horizon where hundreds of stars rose and set. They felt the long, steady swells under the canoe and noticed when an island bent them. They watched for birds that fly out to sea to fish and return to land at night, and for clouds that gather over islands. Navigators trained for many years and passed their knowledge down by memory.

For a long time, some scholars argued that the islands must have been settled by accident, by canoes blown off course. In 1976, a group of Hawaiians decided to test this. They built a double canoe called Hokulea and asked Mau Piailug, a master navigator from Micronesia, to guide it. Without instruments, he steered it more than two thousand miles from Hawaii to Tahiti in about a month.

The voyage proved that the old methods worked. It also helped bring the art of wayfinding back to life. Today, young Pacific Islanders are learning again to navigate by the stars, the swells and the birds, as their ancestors did.`,
      [clues, exploreWords, evidence, { topic: "academic-words-3", weight: 0.1 }],
      [
        ask(
          t("Which was NOT one of the ways Polynesian navigators found their way?", "下面哪一项不是波利尼西亚航海者辨认方向的方法？"),
          t("Reading a magnetic compass", "看磁罗盘"),
          [
            t("Watching where stars rose and set", "观察星星升起和落下的位置"),
            t("Feeling the ocean swells", "感受海浪的涌动"),
            t("Following birds that return to land", "跟着返回陆地的鸟"),
          ],
          t(
            "The second paragraph says they carried no compass and lists stars, swells, birds and clouds.",
            "第二段说他们不带罗盘，并列举了星星、海浪、鸟和云。",
          ),
        ),
        ask(
          t('What does "wayfinding" most likely mean in the last paragraph?', '最后一段中 "wayfinding" 最可能是什么意思？'),
          t("Finding one's way without instruments, by reading nature", "不用仪器、通过观察自然辨认方向"),
          [t("Building canoes", "造独木舟"), t("Fishing in deep water", "在深海捕鱼"), t("Drawing paper maps", "画纸质地图")],
          t(
            "The passage describes navigating by stars, swells and birds, and calls this art wayfinding.",
            "文章描述了靠星星、海浪和鸟来导航，并把这门技艺称为 wayfinding。",
          ),
        ),
        ask(
          t("What did the 1976 voyage of Hokulea prove?", "1976 年 Hokulea 号的航行证明了什么？"),
          t(
            "The islands could have been settled on purpose using traditional navigation",
            "人们可以用传统航海方法有目的地到达并定居这些岛屿",
          ),
          [
            t("The islands were settled by accident", "这些岛屿是偶然被发现的"),
            t("Canoes cannot cross the Pacific", "独木舟无法横渡太平洋"),
            t("Modern instruments are always needed", "现代仪器总是必需的"),
          ],
          t(
            "Some scholars said settlement was accidental; Mau Piailug's voyage without instruments showed the old methods worked.",
            "一些学者认为定居是偶然的；毛·皮亚卢格不用仪器的航行表明传统方法是可行的。",
          ),
        ),
      ],
      ["Polynesian", "Hawaii", "Zealand", "Easter", "Hawaiians", "Hokulea", "Mau", "Piailug", "Micronesia", "Tahiti", "Islanders"],
      ["wayfinding", "hulls"],
    ),
    passage(
      "ibn-battuta",
      t("Ibn Battuta", "伊本·白图泰"),
      `In 1325, a twenty-one-year-old man named Ibn Battuta left his home in Tangier, in what is now Morocco, to make the pilgrimage to Mecca. The journey should have taken about a year and a half. He did not return home for twenty-four years.

After reaching Mecca, Ibn Battuta kept going. He crossed Persia and Iraq, sailed down the coast of East Africa, and traveled through Turkey and the lands north of the Black Sea. He spent years in India, where the sultan of Delhi made him a judge. He visited the islands of the Maldives, journeyed to Sri Lanka and, by his own account, reached the ports of China. Later he crossed the Sahara Desert to the empire of Mali in West Africa.

He traveled by camel, by horse, by ship and on foot, often with merchants and pilgrims. He survived storms, robbers, illness and shipwreck. Because he was a trained scholar of Islamic law, rulers across the Muslim world welcomed him, gave him gifts and sometimes gave him jobs.

When he finally settled down, the sultan of Morocco asked him to tell the story of his travels. A writer named Ibn Juzayy wrote it down. The book, known as the Rihla, which means "journey," describes cities, food, customs and rulers across much of the known world.

Historians use the Rihla carefully, since some parts may be borrowed from other writers or misremembered. Even so, it is one of the richest pictures we have of the fourteenth century, and Ibn Battuta covered more distance than almost any traveler before modern times.`,
      [clues, exploreWords, evidence],
      [
        ask(
          t("Why did Ibn Battuta first leave home?", "伊本·白图泰最初为什么离开家乡？"),
          t("To make the pilgrimage to Mecca", "去麦加朝圣"),
          [t("To become a judge in India", "去印度当法官"), t("To escape from robbers", "躲避强盗"), t("To write a book", "写一本书")],
          t("The first sentence says he left Tangier to make the pilgrimage to Mecca.", "第一句说，他离开丹吉尔是为了去麦加朝圣。"),
        ),
        ask(
          t("Why did rulers often welcome him?", "统治者为什么常常欢迎他？"),
          t("He was a trained scholar of Islamic law", "他是受过训练的伊斯兰法学者"),
          [
            t("He was a rich merchant", "他是一位富商"),
            t("He brought a great army", "他带着一支大军"),
            t("He was the sultan's son", "他是苏丹的儿子"),
          ],
          t(
            "The third paragraph explains that because he was a scholar of Islamic law, rulers welcomed him and gave him jobs.",
            "第三段解释说，因为他是伊斯兰法学者，统治者欢迎他并给他工作。",
          ),
        ),
        ask(
          t('Why do historians use the Rihla "carefully"?', "为什么历史学家“谨慎地”使用《游记》？"),
          t("Some parts may be borrowed or misremembered", "有些部分可能是借用的或记错了"),
          [
            t("It was written in a secret code", "它是用密码写的"),
            t("It describes only one city", "它只描写了一座城市"),
            t("It was lost for centuries", "它失传了好几个世纪"),
          ],
          t(
            "The last paragraph gives the reason directly: some parts may be borrowed from other writers or misremembered.",
            "最后一段直接给出原因：有些部分可能借自其他作者，或者记错了。",
          ),
        ),
      ],
      [
        "Ibn",
        "Battuta",
        "Tangier",
        "Morocco",
        "Mecca",
        "Persia",
        "Iraq",
        "Turkey",
        "Delhi",
        "Maldives",
        "Sri",
        "Lanka",
        "Sahara",
        "Mali",
        "Islamic",
        "Muslim",
        "Juzayy",
        "Rihla",
      ],
      ["sultan", "pilgrimage", "pilgrims"],
    ),
    passage(
      "columbus-and-its-costs",
      t("The Voyage of Columbus and Its Costs", "哥伦布的航行及其代价"),
      `In August 1492, Christopher Columbus sailed west from Spain with three small ships and about ninety men. He was trying to reach Asia, whose spices and silk were worth a fortune in Europe. Columbus believed the Earth was much smaller than it really is, and he did not know that two whole continents lay in his way.

After five weeks at sea, his crew was close to turning back. Then, on October 12, a sailor spotted land: an island in what is now the Bahamas. Columbus was sure he had reached the edge of Asia, and he called the people he met Indians. He held that belief for the rest of his life, through four voyages.

His voyages began lasting contact between Europe and the Americas, and they changed both sides of the ocean. Crops such as corn, potatoes and tomatoes traveled to Europe, Africa and Asia, while horses, cattle and wheat came to the Americas. Historians call this the Columbian Exchange.

For the people already living in the Americas, the costs were terrible. The Taino people, who had welcomed Columbus, were forced to search for gold and treated cruelly. Diseases from Europe, such as smallpox, to which the people of the Americas had no resistance, spread through whole populations. Within a few decades, the Taino had nearly disappeared, and much the same happened across the two continents.

For a long time, Columbus was celebrated simply as a brave explorer. Today, many people believe his story must be told whole: his courage at sea, and the suffering that followed.`,
      [clues, exploreWords, structures],
      [
        ask(
          t("What was Columbus trying to do?", "哥伦布当时想做什么？"),
          t("Reach Asia by sailing west", "向西航行到达亚洲"),
          [
            t("Find the South Pole", "找到南极"),
            t("Start a colony in Africa", "在非洲建立殖民地"),
            t("Prove that the Earth was flat", "证明地球是平的"),
          ],
          t(
            "The first paragraph says he was trying to reach Asia, whose spices and silk were valuable.",
            "第一段说，他想到达香料和丝绸都很值钱的亚洲。",
          ),
        ),
        ask(
          t("What was the Columbian Exchange?", "什么是哥伦布大交换？"),
          t("The movement of crops and animals between the Americas and the rest of the world", "美洲与世界其他地区之间作物和动物的交流"),
          [
            t("A trade of ships between Spain and Asia", "西班牙与亚洲之间的船只交易"),
            t("A meeting between Columbus and a king", "哥伦布与国王的一次会面"),
            t("A war between two European countries", "两个欧洲国家之间的战争"),
          ],
          t(
            "The third paragraph explains it with examples: corn and potatoes went one way, horses and wheat the other.",
            "第三段用例子解释：玉米和土豆运往一边，马和小麦运往另一边。",
          ),
        ),
        ask(
          t("What is the author's view of how Columbus should be remembered?", "作者认为应该怎样纪念哥伦布？"),
          t("Both his courage and the suffering that followed should be told", "既要讲他的勇气，也要讲随之而来的苦难"),
          [
            t("Only as a brave hero", "只作为一位勇敢的英雄"),
            t("He should be forgotten", "应该忘记他"),
            t("Only as a cruel ruler", "只作为一位残暴的统治者"),
          ],
          t("The last paragraph says his story must be told whole, with both sides.", "最后一段说，他的故事要完整地讲，两面都要讲。"),
        ),
      ],
      ["August", "Christopher", "Columbus", "Spain", "October", "Bahamas", "Indians", "Americas", "Columbian", "Exchange", "Taino"],
      ["smallpox"],
    ),
    passage(
      "magellans-crew",
      t("Around the World with Magellan's Crew", "麦哲伦船队环游世界"),
      `In September 1519, five ships and about two hundred seventy men left Spain under the command of Ferdinand Magellan. Their goal was to reach the Spice Islands, in what is now Indonesia, by sailing west around the Americas. No one knew whether a passage through those continents existed.

The voyage was perilous from the start. Some of the captains plotted against Magellan, and he crushed their revolt. One ship was wrecked, and another turned back to Spain. After months of searching along the coast of South America, the fleet finally found a narrow, twisting passage, now called the Strait of Magellan, and sailed out into an ocean so calm that Magellan named it the Pacific, which means "peaceful."

The Pacific was far wider than anyone had guessed. For more than three months the crew saw almost no land. Their food rotted, and they ate sawdust and leather to stay alive. Many died of scurvy, a disease caused by a lack of fresh fruit and vegetables.

In 1521, the fleet reached the Philippines. There Magellan took sides in a local conflict and was killed in battle on the island of Mactan. The survivors pressed on, reached the Spice Islands and loaded their ships with cloves.

Only one ship, the Victoria, made it home. Under the command of Juan Sebastian Elcano, it reached Spain in September 1522 with just eighteen of the original crew. They were the first people known to have sailed all the way around the world. Their journey proved how big the Earth really was.`,
      [clues, exploreWords, structures, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("What was the goal of Magellan's voyage?", "麦哲伦航行的目标是什么？"),
          t("To reach the Spice Islands by sailing west", "向西航行到达香料群岛"),
          [
            t("To conquer the Philippines", "征服菲律宾"),
            t("To find the South Pole", "找到南极"),
            t("To map the coast of Africa", "绘制非洲海岸地图"),
          ],
          t(
            "The first paragraph says the goal was to reach the Spice Islands by sailing west around the Americas.",
            "第一段说，目标是向西绕过美洲到达香料群岛。",
          ),
        ),
        ask(
          t("Which detail best shows how hard the Pacific crossing was?", "哪个细节最能说明横渡太平洋有多艰难？"),
          t("The crew ate sawdust and leather to stay alive", "船员们靠吃木屑和皮革活命"),
          [
            t("Magellan named the ocean the Pacific", "麦哲伦把这片海洋命名为太平洋"),
            t("The fleet left Spain in September", "船队九月离开西班牙"),
            t("The ships were loaded with cloves", "船上装满了丁香"),
          ],
          t(
            "The third paragraph describes rotting food, eating sawdust and leather, and deaths from scurvy.",
            "第三段描述了食物腐烂、吃木屑和皮革，以及死于坏血病。",
          ),
        ),
        ask(
          t("Who completed the voyage around the world?", "是谁完成了环球航行？"),
          t("Eighteen of the crew, led by Elcano", "埃尔卡诺率领的十八名船员"),
          [
            t("Magellan and all his men", "麦哲伦和他所有的人"),
            t("All five ships", "全部五艘船"),
            t("The ship that turned back", "中途返航的那艘船"),
          ],
          t(
            "The last paragraph says the Victoria reached Spain under Elcano with just eighteen of the original crew.",
            "最后一段说，维多利亚号在埃尔卡诺指挥下回到西班牙，原船员只剩十八人。",
          ),
        ),
      ],
      [
        "September",
        "Spain",
        "Ferdinand",
        "Magellan",
        "Indonesia",
        "Americas",
        "Strait",
        "Philippines",
        "Mactan",
        "Victoria",
        "Juan",
        "Sebastian",
        "Elcano",
      ],
      ["scurvy", "cloves", "sawdust"],
    ),
    passage(
      "the-race-to-the-south-pole",
      t("The Race to the South Pole", "南极点竞赛"),
      `In 1911, two expeditions set out across the frozen continent of Antarctica, each hoping to be the first to reach the South Pole. One was led by Roald Amundsen of Norway, the other by Robert Falcon Scott of Britain. Their stories ended very differently.

Amundsen had learned from the Inuit of the Arctic how to survive in extreme cold. His team wore loose fur clothing, traveled on skis and relied on sled dogs, which are fast and can cross ice that would trap a heavy machine. He planned every detail, leaving large stores of food along his route and marking them with flags so they could be found in a storm.

Scott brought motor sledges, ponies and some dogs. The motor sledges soon broke down in the cold, and the ponies, which sweat and sink into soft snow, could not survive. In the end, Scott and his men pulled their heavy sledges themselves.

Amundsen reached the Pole on December 14, 1911. Scott's team of five arrived more than a month later, on January 17, 1912, only to find a Norwegian tent and flag already there. "Great God! This is an awful place," Scott wrote in his diary.

On the long march back, Scott's party ran short of food and fuel, and terrible storms trapped them. All five died, the last three only about eleven miles from a store of supplies. Their diaries, found months later, made them heroes in Britain. Today many historians point out that Amundsen's careful planning, not luck, won the race.`,
      [clues, exploreWords, structures],
      [
        ask(
          t("How did the two expeditions travel differently?", "两支探险队的出行方式有什么不同？"),
          t(
            "Amundsen relied on dogs and skis; Scott on motor sledges, ponies and pulling",
            "阿蒙森依靠狗和滑雪板；斯科特依靠摩托雪橇、矮种马和人力拉橇",
          ),
          [
            t("Both teams used only motor sledges", "两队都只用摩托雪橇"),
            t("Scott used dogs; Amundsen used ponies", "斯科特用狗；阿蒙森用矮种马"),
            t("Both teams walked without sledges", "两队都没用雪橇，徒步行走"),
          ],
          t("The second and third paragraphs compare the two teams' methods.", "第二段和第三段比较了两队的方法。"),
        ),
        ask(
          t("How is the passage mainly organized?", "这篇文章主要是怎样组织的？"),
          t("Compare and contrast", "比较与对照"),
          [
            t("A list of instructions", "操作步骤清单"),
            t("Problem and solution", "问题与解决"),
            t("A description of one place", "对一个地方的描写"),
          ],
          t(
            "The passage sets two expeditions side by side and shows how their plans and results differed.",
            "文章把两支探险队并列，说明它们的计划和结果有何不同。",
          ),
        ),
        ask(
          t("What do many historians say decided the race?", "许多历史学家认为是什么决定了这场竞赛的胜负？"),
          t("Amundsen's careful planning", "阿蒙森周密的计划"),
          [t("Good luck with the weather", "天气上的好运气"), t("Scott's diary", "斯科特的日记"), t("The Norwegian flag", "挪威国旗")],
          t(
            "The last sentence says Amundsen's careful planning, not luck, won the race.",
            "最后一句说，赢得竞赛的是阿蒙森周密的计划，而不是运气。",
          ),
        ),
      ],
      [
        "Antarctica",
        "Roald",
        "Amundsen",
        "Norway",
        "Robert",
        "Falcon",
        "Scott",
        "Britain",
        "Inuit",
        "Arctic",
        "December",
        "Scott's",
        "January",
        "Norwegian",
        "God",
        "Amundsen's",
      ],
      ["sledges", "sledge"],
    ),
    passage(
      "the-dive-to-the-deepest-sea",
      t("The Dive to the Deepest Sea", "潜入最深的海底"),
      `The deepest place in the ocean is the Challenger Deep, at the bottom of the Mariana Trench in the western Pacific. It lies almost seven miles below the surface. If the world's highest mountain were set on the seabed there, its peak would still be more than a mile under water.

For a long time, no one believed a person could go there and survive. At that depth, the water presses down with a force of more than eight tons on every square inch, enough to crush an ordinary submarine like a paper cup.

On January 23, 1960, two men tried anyway. Jacques Piccard, a Swiss engineer, and Don Walsh, an officer in the United States Navy, climbed into a steel sphere barely wide enough for two people. The sphere hung beneath a huge float filled with gasoline, which is lighter than water. Their vessel, called the Trieste, carried heavy iron pellets to make it sink.

The descent took nearly five hours. Partway down, a loud crack shook the sphere: a window in the entrance tunnel had split. They decided to go on. At the bottom, they shone a light through their tiny window and stayed for only about twenty minutes. Then they dropped the iron pellets and rose to the surface.

No one returned for more than fifty years. In 2012, the filmmaker James Cameron dove there alone in a new craft, and since then several more people have made the trip. Even so, more people have stood on the moon than have visited the deepest point of the sea.`,
      [clues, exploreWords, evidence],
      [
        ask(
          t("Why was the dive so dangerous?", "这次下潜为什么这么危险？"),
          t("The water pressure at that depth is enormous", "那个深度的水压极大"),
          [
            t("The water is full of sharks", "水里到处是鲨鱼"),
            t("The trench is too narrow to enter", "海沟太窄，进不去"),
            t("The sun is too bright there", "那里的阳光太强"),
          ],
          t(
            "The second paragraph says the water presses with more than eight tons on every square inch.",
            "第二段说，水压在每平方英寸上超过八吨。",
          ),
        ),
        ask(
          t("Why was the Trieste's float filled with gasoline?", "为什么“的里雅斯特”号的浮筒里装满汽油？"),
          t("Gasoline is lighter than water, so it helped the craft float", "汽油比水轻，能帮助潜水器上浮"),
          [
            t("To power the engine", "为发动机提供动力"),
            t("To light the bottom of the sea", "照亮海底"),
            t("To keep the men warm", "给人保暖"),
          ],
          t(
            "The third paragraph says the float was filled with gasoline, which is lighter than water.",
            "第三段说，浮筒里装着比水轻的汽油。",
          ),
        ),
        ask(
          t("What does the last sentence suggest?", "最后一句暗示了什么？"),
          t("The deepest sea is one of the least visited places on Earth", "最深的海底是地球上最少有人到过的地方之一"),
          [
            t("The moon is easier to reach than any beach", "月球比任何海滩都容易到达"),
            t("No one will ever dive there again", "再也不会有人潜到那里"),
            t("Cameron also went to the moon", "卡梅隆也去过月球"),
          ],
          t(
            "Comparing it with the moon shows how few people have reached the deepest point of the sea.",
            "与月球相比，说明到过海洋最深处的人有多少。",
          ),
        ),
      ],
      ["Challenger", "Mariana", "January", "Jacques", "Piccard", "Swiss", "Don", "Walsh", "Navy", "Trieste", "James", "Cameron"],
    ),
    passage(
      "first-steps-on-the-moon",
      t("The First Steps on the Moon", "踏上月球的第一步"),
      `On July 16, 1969, a rocket taller than a thirty-story building rose from the coast of Florida. On top of it sat three astronauts: Neil Armstrong, Buzz Aldrin and Michael Collins. Their mission, Apollo 11, was to land on the moon and return safely.

The journey of about two hundred forty thousand miles took three days. Once they were circling the moon, Armstrong and Aldrin climbed into a small landing craft called the Eagle, while Collins stayed behind to fly the command ship.

The landing nearly went wrong. As the Eagle descended, alarms flashed on its computer, and Armstrong saw that it was heading for a field of large boulders. He took control and steered over them, searching for a flat place. When the Eagle finally touched down, only about twenty-five seconds of fuel remained for landing. "The Eagle has landed," Armstrong reported.

Hours later, on July 20, Armstrong climbed down the ladder and stepped onto the dusty surface. "That's one small step for man, one giant leap for mankind," he said. About six hundred million people on Earth watched on television. Aldrin soon joined him. They planted a flag, collected rocks and set up experiments, then returned to the Eagle and rejoined Collins.

The astronauts became famous, but they were only the most visible part of a huge effort. About four hundred thousand people had worked on the program, building rockets, writing computer programs and solving thousands of problems. Since then, only twelve people have walked on the moon, and no one has returned since 1972.`,
      [clues, exploreWords, structures],
      [
        ask(
          t("What was Michael Collins's job during the landing?", "着陆期间迈克尔·柯林斯的任务是什么？"),
          t("He stayed behind to fly the command ship", "他留在后面驾驶指令舱"),
          [
            t("He walked on the moon first", "他第一个在月球上行走"),
            t("He steered the Eagle over the boulders", "他驾驶鹰号飞越巨石"),
            t("He planted the flag", "他插上了旗帜"),
          ],
          t("The second paragraph says Collins stayed behind to fly the command ship.", "第二段说，柯林斯留下来驾驶指令舱。"),
        ),
        ask(
          t("Which detail shows how close the landing came to failing?", "哪个细节表明着陆差点失败？"),
          t("Only about twenty-five seconds of fuel remained", "只剩下大约二十五秒的燃料"),
          [
            t("The rocket was taller than a building", "火箭比大楼还高"),
            t("The journey took three days", "旅程花了三天"),
            t("Six hundred million people watched", "六亿人观看了直播"),
          ],
          t("The third paragraph describes alarms, boulders and how little fuel was left.", "第三段描写了警报、巨石和所剩无几的燃料。"),
        ),
        ask(
          t("What is the main point of the last paragraph?", "最后一段的主要观点是什么？"),
          t("The landing was the work of hundreds of thousands of people", "这次登月是几十万人共同努力的成果"),
          [
            t("The astronauts did everything alone", "宇航员独自完成了一切"),
            t("The moon is not worth visiting", "月球不值得去"),
            t("Twelve people built the rocket", "十二个人造了火箭"),
          ],
          t(
            "It says the astronauts were only the most visible part of an effort by about four hundred thousand people.",
            "它说宇航员只是约四十万人共同努力中最显眼的那部分。",
          ),
        ),
      ],
      ["July", "Florida", "Neil", "Armstrong", "Buzz", "Aldrin", "Michael", "Collins", "Apollo", "Eagle", "That's", "Collins's"],
    ),
  ],
};
