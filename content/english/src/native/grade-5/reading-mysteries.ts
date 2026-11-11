// Grade 5: the reading unit of the eighth theme, mysteries and detectives: short cases whose clues the reader can
// follow to the answer.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const mysteryWords = { topic: "words-of-mysteries-and-detectives", weight: 0.3 } as const;
const suspenseWords = { topic: "words-for-suspense-and-puzzles", weight: 0.3 } as const;
const reasoningWords = { topic: "words-for-reasoning", weight: 0.3 } as const;
const clues = { topic: "clues-and-red-herrings", weight: 0.2 } as const;
const conclusions = { topic: "drawing-conclusions", weight: 0.2 } as const;
const suspense = { topic: "building-suspense", weight: 0.2 } as const;
const genre = { topic: "comparing-stories-of-one-genre", weight: 0.2 } as const;

/** mysteriesAndDetectives is a reading unit of grade 5 of short mysteries whose clues lead to their answers. */
export const mysteriesAndDetectives: ReadingUnitDef = {
  id: "mysteries-and-detectives",
  title: t("Mysteries and Detectives", "推理与侦探"),
  passages: [
    passage(
      "the-missing-trophy",
      t("The Missing Trophy", "失踪的奖杯"),
      `On Monday morning, the glass case in the school hall was empty. The silver soccer trophy, won by the fifth grade on Saturday, was gone.

"Someone must have broken in over the weekend," said Mr. Bell, the coach.

Priya was not so sure. She examined the case closely. The glass was not broken, and the little lock on the door was not scratched. Whoever had opened the case had used a key.

"Who has keys?" she asked.

"Only me and Mrs. Dunn, the custodian," said Mr. Bell.

Then Priya noticed something else. On the shelf where the trophy had stood was a ring of dust with a clean circle in the middle, and beside it lay a small strip of blue tape with letters on it: "ENGR."

Priya thought for a moment. Nobody had seen the trophy since the team photo on Saturday. And who would want a trophy enough to take it, then leave a label behind?

She went straight to the office and asked whether anyone had sent the trophy out. The secretary checked her book. "Oh yes," she said. "Mrs. Dunn took it to the shop on Main Street this morning. They're engraving the team's name on it."

The trophy came back on Wednesday, shining, with every player's name on the base.`,
      [mysteryWords, clues],
      [
        ask(
          t("What clue showed that no one broke into the case?", "什么线索说明没有人撬开展柜？"),
          t("The glass was whole and the lock was not scratched", "玻璃完好，锁也没有划痕"),
          [
            t("The trophy was won on Saturday", "奖杯是星期六赢得的"),
            t("The coach said someone broke in", "教练说有人闯了进来"),
            t("There was dust on the shelf", "架子上有灰尘"),
          ],
          t(
            "Priya saw that the glass was not broken and the lock was not scratched, so whoever opened the case used a key.",
            "普丽娅看到玻璃没碎、锁没划痕，所以开柜子的人用的是钥匙。",
          ),
        ),
        ask(
          t('What did the strip of tape marked "ENGR" turn out to mean?', '标着 "ENGR" 的胶带最后说明了什么？'),
          t("The trophy had been sent away to be engraved", "奖杯被送去刻字了"),
          [
            t("A thief had left a message behind", "小偷留下了一条信息"),
            t("The trophy belonged to another school", "奖杯属于另一所学校"),
            t("Someone had used tape to open the lock", "有人用胶带打开了锁"),
          ],
          t(
            "The secretary explains that the shop was engraving the team's name; \"ENGR\" was a label for that job, not a thief's message.",
            '秘书解释说，店里正在刻球队的名字；"ENGR" 是这项活儿的标签，不是小偷留下的信息。',
          ),
        ),
        ask(
          t("Which idea in the story turned out to be a red herring?", "故事中哪个想法后来证明是误导？"),
          t("That someone had broken in over the weekend", "有人在周末闯了进来"),
          [
            t("That someone had opened the case with a key", "有人用钥匙打开了展柜"),
            t("That the office might know where the trophy was", "办公室可能知道奖杯在哪里"),
            t("That Mrs. Dunn had a key to the case", "邓恩太太有展柜的钥匙"),
          ],
          t(
            "The coach's guess of a break-in pointed the wrong way: the trophy had not been stolen at all. The key and the office led to the answer.",
            "教练猜有人闯入，这把人引向了错误的方向：奖杯根本没有被偷。钥匙和办公室才引出了答案。",
          ),
        ),
      ],
    ),
    passage(
      "footprints-in-the-flour",
      t("Footprints in the Flour", "面粉上的脚印"),
      `When Grandpa Joe came down to the bakery at five in the morning, he stopped in the doorway. A sack of flour had been knocked over, and white powder covered half the floor. Three cinnamon rolls were missing from the tray he had left cooling the night before.

"A burglar!" he whispered.

Tess, who was staying with him for the summer, grabbed her flashlight and knelt down. Small prints crossed the flour from the sack to the table and back again. Each print was round, with four little marks at the front, no bigger than a coin.

"These aren't shoe prints," she said. "Look at the size."

Grandpa Joe frowned. "The back door was locked all night. How did anything get in?"

Tess followed the prints with her light. They didn't lead to the door at all. They led to the corner, where a cupboard stood a few centimeters away from the wall. Behind it, the light showed a hole in the old boards, just wide enough for a small animal.

Something rustled. Two bright eyes shone in the dark, and a striped tail disappeared into the hole.

"Your burglar," said Tess, "is a raccoon. A very well-fed one."

That afternoon, Grandpa Joe nailed a board over the hole and put the rolls in a closed tin.`,
      [mysteryWords, suspense],
      [
        ask(
          t("Why did Tess think the thief was not a person?", "特丝为什么认为小偷不是人？"),
          t("The prints were small, round and had four little marks", "脚印又小又圆，前面有四个小印子"),
          [
            t("The back door had been left wide open", "后门大开着"),
            t("Grandpa Joe had seen an animal before", "乔爷爷以前见过一只动物"),
            t("Only one cinnamon roll was missing", "只少了一个肉桂卷"),
          ],
          t(
            "Tess studies the prints: each was round with four marks and no bigger than a coin, so they were not shoe prints. The door was locked.",
            "特丝仔细看了脚印：每个都是圆的，前面有四个小印子，比硬币还小，所以不是鞋印。门是锁着的。",
          ),
        ),
        ask(
          t("How did the author build suspense before the answer?", "作者在揭晓答案前是怎样制造悬念的？"),
          t("With a rustle and two eyes shining in the dark", "用一阵沙沙声和黑暗中发亮的两只眼睛"),
          [
            t("By telling the answer in the first sentence", "在第一句就说出答案"),
            t("By describing the recipe for the rolls", "描写肉桂卷的做法"),
            t("By ending with Grandpa nailing a board", "以爷爷钉木板结尾"),
          ],
          t(
            "Just before the answer, the author slows down with a sound and two bright eyes in the dark, so the reader waits to learn what they belong to.",
            "就在揭晓之前，作者放慢节奏，写了一个声音和黑暗中两只发亮的眼睛，让读者等着知道它们是谁的。",
          ),
        ),
        ask(
          t("How did the raccoon get into the bakery?", "浣熊是怎样进入面包店的？"),
          t("Through a hole in the boards behind the cupboard", "通过柜子后面木板上的一个洞"),
          [
            t("Through the back door, which was unlocked", "通过没锁的后门"),
            t("Through a window left open at night", "通过夜里开着的窗户"),
            t("Inside the sack of flour", "藏在面粉袋里"),
          ],
          t(
            "The prints led to the corner, where the light showed a hole behind the cupboard just wide enough for a small animal.",
            "脚印通向角落，手电照出柜子后面有一个洞，大小正好能让小动物钻过。",
          ),
        ),
      ],
    ),
    passage(
      "the-case-of-the-silent-parrot",
      t("The Case of the Silent Parrot", "沉默鹦鹉案"),
      `Captain, Mrs. Ferreira's gray parrot, was famous on Elm Street for one thing: he never stopped talking. Every morning he shouted "Good morning!" to the mail carrier and whistled at the neighbor's cat.

But for three days, Captain had said nothing at all.

"He must be sick," said Mrs. Ferreira, worried. She asked Leo, who lived next door and wanted to be a detective, to help her find out why.

Leo started with questions. Was Captain eating? Yes, normally. Was he moving around? Yes, he hopped from perch to perch. So he probably was not ill.

"Has anything changed in the house?" Leo asked.

Mrs. Ferreira thought. "Only the curtains. I put up new ones last week, thick ones, to keep out the morning sun."

Leo looked at the cage. It stood by the front window, but now the heavy curtains hid the street completely. Captain could not see the mail carrier, the cat or anyone passing by.

"I think Captain is not sick," Leo said. "He's bored. He talks to people he can see."

Mrs. Ferreira pulled the curtains open. For a long moment, the parrot stared at the street. Then the mail carrier came up the path.

"Good morning!" shouted Captain.`,
      [reasoningWords, conclusions],
      [
        ask(
          t("Why did Leo decide Captain was probably not ill?", "利奥为什么认为船长可能没生病？"),
          t("The parrot was eating and moving around normally", "鹦鹉吃东西和活动都正常"),
          [
            t("The parrot had shouted at the mail carrier", "鹦鹉冲邮递员喊了一声"),
            t("Mrs. Ferreira told him the bird was fine", "费雷拉太太告诉他鸟没事"),
            t("The new curtains were very thick", "新窗帘很厚"),
          ],
          t(
            "Leo asked whether Captain was eating and moving; both answers were yes, so illness was unlikely.",
            "利奥问船长是否吃东西、是否活动；答案都是肯定的，所以不太可能是病了。",
          ),
        ),
        ask(
          t("What conclusion did Leo draw from the curtains?", "利奥从窗帘得出了什么结论？"),
          t("Captain was silent because he could not see anyone", "船长不说话是因为他看不见任何人"),
          [
            t("The curtains had made Captain sick", "窗帘让船长生病了"),
            t("The cat had frightened Captain", "猫吓坏了船长"),
            t("Captain did not like the color of the curtains", "船长不喜欢窗帘的颜色"),
          ],
          t(
            "The curtains hid the street, and Captain talks to people he can see, so Leo concluded he was bored, not sick.",
            "窗帘挡住了街道，而船长只跟看得见的人说话，所以利奥断定它是无聊，而不是病了。",
          ),
        ),
        ask(
          t("How does the ending prove Leo right?", "结尾怎样证明利奥是对的？"),
          t("Captain talks again as soon as he sees the mail carrier", "船长一看到邮递员就又说话了"),
          [
            t("A doctor says the parrot is healthy", "医生说鹦鹉很健康"),
            t("Mrs. Ferreira buys a new cage", "费雷拉太太买了个新笼子"),
            t("The neighbor's cat stays away", "邻居的猫不再来了"),
          ],
          t(
            'Once the curtains open and the mail carrier appears, Captain shouts "Good morning!", which confirms Leo\'s reasoning.',
            '窗帘一拉开，邮递员一出现，船长就喊 "Good morning!"，这证实了利奥的推理。',
          ),
        ),
      ],
    ),
    passage(
      "who-took-the-class-hamster",
      t("Who Took the Class Hamster?", "谁带走了班里的仓鼠？"),
      `On Thursday morning, the cage on the windowsill of Room 12 was empty, and its little door was open. Nibbles the hamster was gone.

Everyone looked at Sam. On Wednesday, he had begged Ms. Ortiz to let him take Nibbles home for the long weekend, and she had said no.

"I didn't take him!" Sam said, his face turning red.

Hana took out her notebook. She wrote down what she knew. The cage door was open, but the latch was the kind that slipped easily if it wasn't pushed all the way down. The last person to feed Nibbles on Wednesday afternoon was Ms. Ortiz herself, in a hurry before a meeting. There were fresh sunflower seed shells under the bookshelf by the wall, but nobody had eaten sunflower seeds in class.

Hana knelt by the bookshelf and listened. From somewhere behind the bottom shelf came a faint scratching sound.

Together, the class carefully pulled the shelf away from the wall. There sat Nibbles, cheeks stuffed full, on a nest of shredded paper he had made from an old worksheet.

Ms. Ortiz checked the latch and smiled sheepishly. "I think I owe Sam an apology," she said. "I didn't close the door properly."`,
      [reasoningWords, clues],
      [
        ask(
          t("Why did everyone suspect Sam at first?", "为什么大家一开始都怀疑萨姆？"),
          t("He had asked to take Nibbles home and been told no", "他请求把仓鼠带回家却被拒绝了"),
          [
            t("He had been the last to feed Nibbles", "他是最后一个喂仓鼠的人"),
            t("He had sunflower seeds in his pocket", "他口袋里有葵花籽"),
            t("He sat next to the windowsill", "他坐在窗台旁边"),
          ],
          t(
            "The story says Sam had begged to take Nibbles home and been told no, which made him look guilty. Ms. Ortiz was the last to feed the hamster.",
            "故事说萨姆曾恳求把仓鼠带回家却被拒绝，这让他看起来有嫌疑。最后喂仓鼠的是奥尔蒂斯老师。",
          ),
        ),
        ask(
          t("Which clue pointed to where Nibbles really was?", "哪个线索指出了仓鼠真正的位置？"),
          t("Seed shells under the bookshelf", "书架下的葵花籽壳"),
          [t("Sam's red face", "萨姆涨红的脸"), t("The long weekend", "长周末"), t("Ms. Ortiz's meeting", "奥尔蒂斯老师的会议")],
          t(
            "Nobody had eaten sunflower seeds in class, so the fresh shells under the bookshelf showed that the hamster had been there.",
            "班里没有人吃过葵花籽，所以书架下新鲜的籽壳说明仓鼠去过那里。",
          ),
        ),
        ask(
          t("What really happened to Nibbles?", "仓鼠到底怎么了？"),
          t("The latch was not closed properly, and he escaped", "门闩没有关好，它自己跑了出来"),
          [
            t("Sam took him home and brought him back", "萨姆把它带回家又带了回来"),
            t("Hana hid him behind the bookshelf", "哈娜把它藏在书架后面"),
            t("Another class borrowed him for the day", "另一个班借走了它一天"),
          ],
          t(
            "Ms. Ortiz admits she did not close the door properly; the latch slipped and Nibbles escaped to the bookshelf on his own.",
            "奥尔蒂斯老师承认她没有关好门；门闩松开了，仓鼠自己跑到了书架后面。",
          ),
        ),
      ],
    ),
    passage(
      "the-torn-map",
      t("The Torn Map", "撕破的地图"),
      `The old map had been in the museum for a hundred years. It showed the town as it was in 1850, with every street and every well drawn in brown ink. Then, on the morning the new exhibit opened, the guard found it on the floor of the display room, torn in two.

"Vandals," said the director angrily. "Someone tore it on purpose."

Ines, the director's daughter, studied the room. The display case had no glass yet; the map had been pinned to a board on the wall. Under the board, the radiator was on full, and the air felt hot and very dry. The window above it was open a crack, and the wind kept making the curtain flap.

She picked up one half of the map. The tear was not straight, as it would be if someone had pulled it apart with two hands. It followed an old fold, and the paper along the edges was brittle and curled.

"I don't think anyone tore it," Ines said. "Old paper gets brittle in hot, dry air. The wind from the window kept moving it against the pins, and it split along the fold."

The director looked at the radiator and sighed. The next day, the map was mended and placed in a sealed case, safely away from heat and wind.`,
      [reasoningWords, conclusions],
      [
        ask(
          t("What did the director first believe?", "馆长起初认为是怎么回事？"),
          t("Someone had torn the map on purpose", "有人故意撕破了地图"),
          [
            t("The map had always been torn", "地图一直是破的"),
            t("The guard had dropped the map", "保安把地图弄掉了"),
            t("The wind had blown the map away", "风把地图吹走了"),
          ],
          t(
            'The director says "Vandals" and "Someone tore it on purpose." That guess turns out to be wrong.',
            '馆长说 "Vandals" 和 "Someone tore it on purpose"。这个猜测后来证明是错的。',
          ),
        ),
        ask(
          t("Why did the shape of the tear matter?", "撕口的形状为什么重要？"),
          t("It followed an old fold instead of a straight pull", "它沿着旧折痕裂开，而不是被直接拉开"),
          [
            t("It showed the map was drawn in brown ink", "它说明地图是用棕色墨水画的"),
            t("It matched the shape of the window", "它和窗户的形状一样"),
            t("It proved the guard was not honest", "它证明保安不诚实"),
          ],
          t(
            "Ines saw that a tear made by two hands would be straight, but this one followed a fold, which pointed to the paper splitting by itself.",
            "伊内丝看出，用两只手撕会是直的，而这道裂口沿着折痕，说明纸是自己裂开的。",
          ),
        ),
        ask(
          t("Which clues together explain the torn map?", "哪些线索合起来解释了地图为何破损？"),
          t("The hot radiator, the open window and the brittle edges", "很热的暖气、开着的窗户和变脆的纸边"),
          [
            t("The angry director and the new exhibit", "生气的馆长和新展览"),
            t("The brown ink and the year 1850", "棕色墨水和 1850 年"),
            t("The guard and the missing glass", "保安和缺少的玻璃"),
          ],
          t(
            "Hot, dry air made the paper brittle, and wind from the open window moved it against the pins until it split. The other details do not explain the tear.",
            "又热又干的空气让纸变脆，开着的窗户吹进的风让它不停碰到图钉，直到裂开。其他细节不能解释破损。",
          ),
        ),
      ],
    ),
    passage(
      "a-note-in-the-library-book",
      t("A Note in the Library Book", "图书馆书里的字条"),
      `Ben opened the library book about volcanoes, and a folded note slid out onto the table. It was written in pencil, in neat capital letters: "MEET ME WHERE THE DRAGON SLEEPS. SATURDAY, 10 O'CLOCK. BRING THE KEY."

Ben's heart beat faster. A secret meeting? A key to what?

He showed the note to his friend Lucia, who loved puzzles. She turned it over and read the date stamped on the library card in the back of the book: it had last been borrowed eight months ago.

"So this is old," she said. "Whoever wrote it isn't waiting for us this Saturday."

"But where does a dragon sleep?" Ben asked.

Lucia looked around the library. In the children's corner, a long green stuffed dragon lay curled on top of a bookshelf. Under it hung a sign: "Saturday Story Time, 10 o'clock."

They went over to it. Tucked under the dragon's tail was a small brass key with a tag that said "Puzzle Club, Box 3."

The librarian laughed when they showed her. "The Puzzle Club hides clues in books for new members to find," she said. "No one found this one last year. I suppose that makes you our newest members."`,
      [suspenseWords, suspense],
      [
        ask(
          t("Why did Lucia decide no one was waiting for them on Saturday?", "露西娅为什么断定星期六没有人在等他们？"),
          t("The book had last been borrowed eight months ago", "这本书上次被借是在八个月前"),
          [
            t("The note was written in pencil", "字条是用铅笔写的"),
            t("The library was closed on Saturdays", "图书馆星期六不开门"),
            t("The note had no name on it", "字条上没有署名"),
          ],
          t(
            "The date stamp showed the book had last been borrowed eight months ago, so the note was old.",
            "日期章显示这本书八个月前才被借过，所以字条是旧的。",
          ),
        ),
        ask(
          t('What did "where the dragon sleeps" turn out to mean?', '"where the dragon sleeps" 最后指的是什么？'),
          t("A stuffed dragon on a shelf in the children's corner", "儿童区书架上的一条毛绒龙"),
          [
            t("A volcano described in the book", "书里描写的一座火山"),
            t("A cave outside the town", "镇外的一个山洞"),
            t("The librarian's office", "图书管理员的办公室"),
          ],
          t(
            "Lucia found a long green stuffed dragon curled on a bookshelf, with the key tucked under its tail.",
            "露西娅在书架上找到一条蜷着的绿色毛绒龙，钥匙就塞在它的尾巴下面。",
          ),
        ),
        ask(
          t("How does the opening build suspense?", "开头是怎样制造悬念的？"),
          t("A mysterious note raises questions the reader wants answered", "一张神秘的字条引出读者想知道答案的问题"),
          [
            t("It explains the Puzzle Club right away", "它马上解释了解谜俱乐部"),
            t("It describes how volcanoes erupt", "它描述了火山怎样喷发"),
            t("It tells who wrote the note and why", "它说明了谁写了字条以及为什么"),
          ],
          t(
            "The note's secret meeting and unknown key make Ben, and the reader, ask questions that the story answers only at the end.",
            "字条里的秘密会面和不明钥匙让本和读者都产生疑问，故事到结尾才给出答案。",
          ),
        ),
      ],
    ),
    passage(
      "the-locked-shed",
      t("The Locked Shed", "上锁的棚子"),
      `Every night that week, something strange happened in the Parks' garden shed. The door was locked with a padlock, and only Mr. Park had the key. Yet every morning, a few of the tomatoes stored inside on a tray had been nibbled, and the bag of birdseed on the floor was a little emptier.

"It must be one of the neighbors' kids," said Mr. Park. "Someone must have copied my key."

His son Min-jun was doubtful. The padlock showed no scratches, and the key had hung on its hook in the kitchen all week. Besides, why would a child sneak in at night just to nibble a few tomatoes?

Min-jun searched the shed in daylight. The walls were solid. The door fit tightly. But high up, under the roof, he noticed that one board was loose, leaving a narrow gap where it met the wall. Below the gap, a few gray hairs clung to a nail.

That evening, Min-jun set up his tablet to record the shed. In the morning, he played the video for his father. At midnight, a small furry face poked through the gap under the roof. A squirrel squeezed in, ran down the wall and helped itself to breakfast.

Mr. Park fixed the board that weekend and stopped blaming the neighbors.`,
      [mysteryWords, genre],
      [
        ask(
          t("Why was Min-jun doubtful that a child had copied the key?", "敏俊为什么怀疑有孩子复制了钥匙？"),
          t("The lock had no scratches and the key never left its hook", "锁上没有划痕，钥匙也一直挂在钩子上"),
          [
            t("The neighbors' kids were away on holiday", "邻居的孩子出去度假了"),
            t("The shed had no door at all", "棚子根本没有门"),
            t("Children do not like tomatoes", "孩子们不喜欢西红柿"),
          ],
          t(
            "Min-jun points out that the padlock showed no scratches and the key had hung on its hook all week.",
            "敏俊指出，挂锁没有划痕，钥匙整个星期都挂在钩子上。",
          ),
        ),
        ask(
          t("Which clue suggested an animal was getting in?", "哪个线索暗示有动物进来了？"),
          t("Gray hairs on a nail below a gap in the roof", "屋顶缝隙下方钉子上的灰色毛发"),
          [
            t("The tray of tomatoes", "一盘西红柿"),
            t("The padlock on the door", "门上的挂锁"),
            t("The key in the kitchen", "厨房里的钥匙"),
          ],
          t(
            "The loose board left a gap, and gray hairs clung to the nail below it, suggesting a furry animal had squeezed through.",
            "松动的木板留下一道缝，下面的钉子上挂着灰色的毛，说明有毛茸茸的动物钻过。",
          ),
        ),
        ask(
          t("How is this mystery like the one in the bakery story?", "这个故事和面包店的故事有什么相似之处？"),
          t("An animal, not a person, turns out to be the culprit", "最后发现作案的是动物而不是人"),
          [
            t("A key is found hidden under a tail", "在尾巴下面找到了一把钥匙"),
            t("A museum guard finds the evidence", "博物馆保安发现了证据"),
            t("The detective is a grown-up police officer", "侦探是一名成年警察"),
          ],
          t(
            "In both stories a grown-up suspects a person, but a child follows the clues and finds an animal: a raccoon in one, a squirrel in the other.",
            "两个故事里都是大人怀疑有人作案，孩子却顺着线索发现是动物：一个是浣熊，一个是松鼠。",
          ),
        ),
      ],
    ),
    passage(
      "the-last-train-clue",
      t("The Last Train Clue", "最后一班火车的线索"),
      `Aunt Rosa's suitcase had vanished from the station waiting room. She had set it down beside the bench, turned to buy a newspaper, and when she turned back, it was gone.

Three people had been in the room. A man in a gray coat said he had been asleep the whole time. A young woman with a guitar said she had been tuning it with her headphones on and heard nothing. A boy with a backpack said he had just come in from the platform.

Nadia, Aunt Rosa's niece, listened carefully. Then she looked at each of them more closely.

The man in the gray coat held a train ticket that had been punched for the 4:15 train, which had left ten minutes ago. "If you were asleep the whole time," Nadia said, "how did you miss your train?"

"I must have slept through it," he said.

But the woman with the guitar spoke up. "He wasn't asleep. When I took off my headphones, he was standing by the door, looking out at the platform."

Nadia ran to the platform. Behind a stack of mail sacks, she found Aunt Rosa's suitcase, waiting to be loaded onto the next train.

The man in the gray coat had already slipped away, but the station guard had seen his face.`,
      [suspenseWords, genre],
      [
        ask(
          t("Why was the man's ticket a clue?", "那个男人的车票为什么是线索？"),
          t("He missed his train while claiming to be asleep", "他声称在睡觉，却错过了自己的火车"),
          [
            t("The ticket showed the woman's name", "车票上有那位女士的名字"),
            t("The ticket was for a different city", "车票去的是另一个城市"),
            t("The ticket had not been punched", "车票没有打孔"),
          ],
          t(
            "His ticket was punched for a train that had just left, which made his story of being asleep hard to believe.",
            "他的车票是刚开走那班车的，这让他睡了一路的说法难以令人相信。",
          ),
        ),
        ask(
          t("Whose statement showed that the man had lied?", "谁的话说明那个男人说了谎？"),
          t("The young woman with the guitar", "那个拿吉他的年轻女子"),
          [t("The boy with the backpack", "那个背背包的男孩"), t("Aunt Rosa", "罗莎姑姑"), t("The station guard", "车站保安")],
          t(
            "The woman said that when she took off her headphones, the man was standing by the door, not asleep.",
            "那位女子说，她摘下耳机时，那个男人正站在门边，并没有睡觉。",
          ),
        ),
        ask(
          t("Why did Nadia run to the platform?", "娜迪亚为什么跑到站台上去？"),
          t("The man had been watching the platform from the door", "那个男人刚才一直在门边盯着站台"),
          [
            t("The boy said he had hidden the suitcase there", "男孩说他把箱子藏在了那里"),
            t("She wanted to catch the 4:15 train", "她想赶 4:15 的火车"),
            t("Aunt Rosa told her to buy a newspaper", "罗莎姑姑让她去买报纸"),
          ],
          t(
            "The woman saw the man looking out at the platform, so Nadia concluded the suitcase was probably there.",
            "那位女子看到男人在向站台张望，所以娜迪亚推断箱子很可能在那里。",
          ),
        ),
      ],
    ),
  ],
};
