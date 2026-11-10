// Grades 6 to 8: the reading unit of the first theme, myths and legends, in original retellings of myths from
// several cultures.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "./reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const plot = { topic: "plot-and-conflict", weight: 0.3 } as const;
const theme = { topic: "theme", weight: 0.3 } as const;
const mythWords = { topic: "words-from-myths", weight: 0.2 } as const;

/** mythsAndLegends is a reading unit of grades 6 to 8 on myths that explain the world and teach how to live. */
export const mythsAndLegends: ReadingUnitDef = {
  id: "myths-and-legends",
  title: t("Myths and Legends", "神话与传说"),
  passages: [
    passage(
      "pangu-separates-the-sky-and-the-earth",
      t("Pangu Separates the Sky and the Earth", "盘古开天辟地"),
      `Long before there were mountains or rivers, the Chinese myth says, the whole universe was a dark, shapeless mass, like the inside of an enormous egg. There was no up or down, no light or shadow, only chaos. Inside this egg, a giant named Pangu slept for eighteen thousand years.

When Pangu finally woke, he found himself trapped in the darkness. He swung a great axe, and the egg cracked open. The light, clear parts of it floated upward and became the sky. The heavy, cloudy parts sank and became the earth.

Pangu was afraid that the sky and the earth would join together again, so he stood between them. He pushed the sky up with his hands and pressed the earth down with his feet. Every day the sky rose a little higher, the earth grew a little thicker, and Pangu grew taller to keep them apart. For another eighteen thousand years he held them in place, until they were firm and could not fall back together.

At last, exhausted, Pangu lay down and died. But even in death he gave the world its shape. His breath became the wind and the clouds, and his voice became the thunder. His left eye became the sun and his right eye the moon. His arms and legs became the mountains, his blood became the rivers, and the hair on his body became the trees and flowers.

The myth explains how the world was formed, but it also says something about sacrifice: the world we live in was made from one giant's long labor and his final gift.`,
      [clues, mythWords, theme],
      [
        ask(
          t("What was the universe like before Pangu woke?", "盘古醒来之前，宇宙是什么样子的？"),
          t("A dark, shapeless mass with no up or down", "一团没有上下之分的黑暗混沌"),
          [
            t("A bright sky above a flat earth", "平坦大地上方明亮的天空"),
            t("A world of mountains and rivers", "一个有山有河的世界"),
            t("An ocean with a single island", "一片只有一个岛屿的海洋"),
          ],
          t(
            "The first paragraph says the universe was a dark, shapeless mass with no up or down, only chaos.",
            "第一段说，宇宙是一团黑暗、没有形状的东西，没有上下之分，只有混沌。",
          ),
        ),
        ask(
          t("Why did Pangu stand between the sky and the earth?", "盘古为什么站在天和地之间？"),
          t("He was afraid they would join together again", "他担心天和地会重新合在一起"),
          [
            t("He wanted to reach the sun", "他想够到太阳"),
            t("He was trying to escape the egg", "他想逃出那个蛋"),
            t("He was guarding the rivers", "他在守护河流"),
          ],
          t(
            "The third paragraph says Pangu was afraid the sky and the earth would join together again, so he stood between them.",
            "第三段说，盘古担心天和地会重新合在一起，所以站在它们中间。",
          ),
        ),
        ask(
          t(
            "Besides explaining how the world was formed, what idea does the last paragraph draw from the myth?",
            "除了解释世界的形成，最后一段还从这则神话中引出了什么思想？",
          ),
          t("The world was made from one giant's sacrifice", "世界是由一位巨人的牺牲造就的"),
          [
            t("Giants are dangerous to people", "巨人对人类很危险"),
            t("The sky is heavier than the earth", "天比地更重"),
            t("Sleep is more important than work", "睡觉比劳动更重要"),
          ],
          t(
            "The last paragraph says the myth is also about sacrifice: the world was made from Pangu's long labor and his final gift.",
            "最后一段说，这则神话也关乎牺牲：世界是由盘古漫长的劳作和他最后的奉献造就的。",
          ),
        ),
      ],
      ["Pangu", "Chinese"],
    ),
    passage(
      "prometheus-brings-fire",
      t("Prometheus Brings Fire", "普罗米修斯盗火"),
      `In Greek mythology, the Titan Prometheus was known for his cleverness and for his love of human beings. According to one version of the myth, it was Prometheus who shaped the first people out of clay, and he watched over them like a mentor.

But life for those first people was hard. They shivered in the cold, ate their food raw and hid in caves when night fell. Zeus, the king of the gods, had refused to give them fire. He feared that with fire, humans would grow too powerful and would no longer need the gods.

Prometheus could not bear to see his people suffer. One night, he climbed to the top of Mount Olympus, where the gods lived. He held a hollow stalk of fennel close to the burning chariot of the sun until a small coal began to glow inside it. Then he hurried back down to earth and gave the fire to humans.

Everything changed. People cooked their food, warmed their homes and made tools of metal. They learned to build, to sail and to create.

When Zeus looked down and saw fires glowing across the earth, he was furious. As punishment, he had Prometheus chained to a rock on a high mountain. Every day an eagle came and tore at him, and every night his wounds healed, so that the punishment could begin again. Prometheus suffered for many years before the hero Heracles finally set him free.

The myth asks a difficult question: is it right to break a rule to help others, even when you know you will pay for it?`,
      [clues, mythWords, plot],
      [
        ask(
          t("Why did Zeus refuse to give fire to humans?", "宙斯为什么不肯把火给人类？"),
          t("He feared they would grow too powerful", "他担心人类会变得过于强大"),
          [
            t("He thought fire was too dangerous for children", "他认为火对孩子太危险"),
            t("He wanted to keep the earth cold", "他想让大地保持寒冷"),
            t("He had no fire himself", "他自己也没有火"),
          ],
          t(
            "The second paragraph says Zeus feared that with fire, humans would grow too powerful and no longer need the gods.",
            "第二段说，宙斯担心人类有了火会变得过于强大，不再需要众神。",
          ),
        ),
        ask(
          t("What is the main conflict in this myth?", "这则神话的主要冲突是什么？"),
          t("Prometheus defies Zeus to help humans", "普罗米修斯违抗宙斯去帮助人类"),
          [
            t("Prometheus fights an eagle for food", "普罗米修斯和鹰争夺食物"),
            t("Humans fight each other over fire", "人类为争夺火而互相争斗"),
            t("Heracles competes with Prometheus", "赫拉克勒斯和普罗米修斯较量"),
          ],
          t(
            "The story turns on Prometheus breaking Zeus's rule to give fire to humans, and the punishment that follows.",
            "故事围绕着普罗米修斯违反宙斯的规定、把火给人类，以及随之而来的惩罚展开。",
          ),
        ),
        ask(
          t('What does the word "mentor" most likely mean in the first paragraph?', '第一段中的 "mentor" 最可能是什么意思？'),
          t("A wise guide and teacher", "睿智的引导者和老师"),
          [t("A cruel ruler", "残暴的统治者"), t("A distant stranger", "遥远的陌生人"), t("A rival in a contest", "比赛中的对手")],
          t(
            "Prometheus made the first people and watched over them, the way a wise guide watches over someone who is learning.",
            "普罗米修斯创造了最早的人类并照看他们，就像一位睿智的引导者照看正在学习的人。",
          ),
        ),
      ],
      ["Prometheus", "Titan", "Zeus", "Olympus", "Heracles", "Greek"],
    ),
    passage(
      "pandoras-jar",
      t("Pandora's Jar", "潘多拉的罐子"),
      `After Prometheus gave fire to humans, Zeus wanted revenge on the human race as well. So, the Greek myth says, he ordered the gods to create the first woman, Pandora. Each god gave her a gift: beauty, a clever mind, a musical voice. Her name means "all-gifted."

Zeus gave her one more gift: a large, sealed jar. "Never open it," he warned her. Then he sent Pandora down to earth to marry Epimetheus, the brother of Prometheus.

Pandora was happy in her new life, but she could not stop thinking about the jar. What could be inside? Why had Zeus given it to her if she was never allowed to look? Day after day, her curiosity grew. She walked past the jar, touched its lid, and walked away again.

At last she could not resist. She lifted the lid just a little. At once, a dark cloud rushed out: sickness, sorrow, hunger, envy, war and every other trouble that had never existed on earth before. They flew out across the world, and Pandora slammed the lid shut in horror.

Then she heard a small voice from inside the jar. "Let me out," it said. Trembling, Pandora opened the lid again, and out fluttered a single bright creature. It was Hope. It flew after the troubles, so that wherever pain and sorrow went, hope would follow.

The Greeks used this myth to explain why the world is full of suffering. But they also gave it a hopeful ending: no matter how bad things become, people never lose hope.`,
      [clues, theme, plot],
      [
        ask(
          t("What does the name Pandora mean?", "潘多拉这个名字是什么意思？"),
          t("All-gifted", "拥有一切天赋的"),
          [t("All-curious", "对一切好奇的"), t("First woman", "第一个女人"), t("Keeper of the jar", "罐子的守护者")],
          t('The first paragraph says her name means "all-gifted."', "第一段说，她的名字意思是“拥有一切天赋的”。"),
        ),
        ask(
          t("What caused Pandora to open the jar?", "是什么导致潘多拉打开了罐子？"),
          t("Her growing curiosity", "她日益增长的好奇心"),
          [
            t("An order from Zeus", "宙斯的命令"),
            t("Her husband's request", "她丈夫的要求"),
            t("A voice calling from inside at first", "一开始从里面传来的呼唤声"),
          ],
          t(
            "The third paragraph shows her curiosity growing day after day until, in the fourth, she could not resist. The voice spoke only after she had already opened it once.",
            "第三段写她的好奇心一天天增长，直到第四段她再也忍不住了。那个声音是在她第一次打开之后才出现的。",
          ),
        ),
        ask(
          t("What two things does the myth explain, according to the last paragraph?", "根据最后一段，这则神话解释了哪两件事？"),
          t("Why the world has suffering, and why people keep hoping", "为什么世界上有苦难，以及为什么人们始终怀有希望"),
          [
            t("Why jars have lids, and why gods give gifts", "为什么罐子有盖子，以及为什么神会赠送礼物"),
            t("Why Zeus was angry, and how fire was made", "为什么宙斯生气，以及火是怎么来的"),
            t("Why women are curious, and why men marry", "为什么女人好奇，以及为什么男人结婚"),
          ],
          t(
            "The last paragraph says the myth explains why the world is full of suffering, but also that people never lose hope.",
            "最后一段说，这则神话解释了世界为什么充满苦难，同时也说明人们永远不会失去希望。",
          ),
        ),
      ],
      ["Pandora", "Pandora's", "Zeus", "Epimetheus", "Prometheus", "Greek", "Greeks", "Hope"],
    ),
    passage(
      "icarus-and-his-wings",
      t("Icarus and His Wings", "伊卡洛斯和他的翅膀"),
      `Daedalus was the greatest inventor in ancient Greece. He had built the famous labyrinth on the island of Crete for King Minos, a maze so twisting that no one who entered could find the way out. But when Daedalus displeased the king, Minos locked him and his young son, Icarus, in a tall tower beside the sea.

The king's ships guarded every harbor, so there was no escape by water. Daedalus looked up at the gulls circling overhead and had an idea. "Minos rules the land and the sea," he said, "but he does not rule the air."

For weeks, Daedalus collected feathers that fell into the tower. He tied the large ones together with thread and fixed the small ones with wax, shaping them into two pairs of wings. When they were finished, he strapped a pair onto his son's arms.

"Listen carefully," he said. "Do not fly too low, or the sea spray will make your feathers heavy. Do not fly too high, or the sun will melt the wax. Follow me and stay in the middle."

They leapt from the tower and soared over the waves. At first Icarus obeyed, but soon the thrill of flying filled him with pride. He laughed and climbed higher and higher, toward the blazing sun. The wax softened and ran, and the feathers drifted away. Icarus fell into the sea and was lost.

Daedalus flew on alone, weeping. Today, people still tell this myth to warn against pride and the danger of ignoring wise advice.`,
      [clues, mythWords, theme],
      [
        ask(
          t("How did Daedalus plan to escape from the tower?", "代达罗斯打算怎样逃出高塔？"),
          t("By flying away with wings he made", "用他做的翅膀飞走"),
          [
            t("By sailing on one of the king's ships", "乘坐国王的一艘船"),
            t("By hiding in the labyrinth", "躲进迷宫里"),
            t("By swimming across the sea", "游过大海"),
          ],
          t(
            "The second and third paragraphs say that since the ships guarded the sea, Daedalus made wings to escape through the air.",
            "第二段和第三段说，由于船只把守着海面，代达罗斯做了翅膀，从空中逃走。",
          ),
        ),
        ask(
          t("What caused Icarus to fall?", "伊卡洛斯为什么会坠落？"),
          t("He flew too close to the sun and the wax melted", "他飞得离太阳太近，蜡融化了"),
          [
            t("The sea spray made his wings heavy", "海水的飞沫让他的翅膀变重"),
            t("The king's soldiers shot him down", "国王的士兵把他射了下来"),
            t("His father let go of him", "他父亲松开了他"),
          ],
          t(
            "The fifth paragraph says Icarus climbed toward the sun until the wax softened and the feathers drifted away.",
            "第五段说，伊卡洛斯朝太阳越飞越高，直到蜡变软、羽毛飘落。",
          ),
        ),
        ask(
          t("Which sentence best states the theme of the myth?", "哪一句最能表达这则神话的主题？"),
          t("Pride and ignoring wise advice can lead to disaster", "骄傲和不听明智的劝告会导致灾难"),
          [
            t("Inventors should not build labyrinths", "发明家不应该建造迷宫"),
            t("A boy flies with his father over the sea", "一个男孩和父亲一起飞越大海"),
            t("Kings always keep their promises", "国王总是信守诺言"),
          ],
          t(
            "The last paragraph says the myth warns against pride and the danger of ignoring wise advice. The other choices are a retelling or ideas the story does not teach.",
            "最后一段说，这则神话警示人们不要骄傲、不要无视明智的劝告。其他选项要么是复述情节，要么是故事没有表达的意思。",
          ),
        ),
      ],
      ["Daedalus", "Icarus", "Greece", "Crete", "Minos"],
    ),
    passage(
      "arachne-the-weaver",
      t("Arachne the Weaver", "织女阿拉克涅"),
      `In a small village in ancient Greece lived a young woman named Arachne, whose weaving was so beautiful that people traveled from far away to watch her work. Her threads seemed to move like water, and the pictures she wove looked almost alive.

People often said that the goddess Athena herself must have taught her. Arachne hated to hear it. "No one taught me," she said proudly. "I am a better weaver than Athena, and I would prove it in a contest."

Athena heard these words. Disguised as an old woman, she came to Arachne's door and warned her gently. "Be careful," she said. "Ask the goddess to forgive you, and she will." But Arachne only laughed. "Let her come and compete, if she dares."

At once the old woman threw off her disguise, and there stood Athena. The contest began. Athena wove a picture of the gods in all their power and glory, a warning of what happened to humans who challenged them. Arachne wove a picture that made fun of the gods, showing their mistakes and their cruelty. Her work was perfect; not even Athena could find a flaw in it.

But the goddess was furious at Arachne's lack of respect. She tore the cloth to pieces and touched Arachne's forehead. Arachne's body began to shrink, her arms and legs grew thin, and she became the first spider. From then on, she and all her children would spin and weave forever.

The Greek word for spider is still related to her name, and the myth still warns against arrogance toward those more powerful than we are.`,
      [clues, theme, plot],
      [
        ask(
          t("Why did Arachne hate hearing that Athena had taught her?", "为什么阿拉克涅讨厌别人说是雅典娜教她织布的？"),
          t("She believed her skill was her own and greater than Athena's", "她认为自己的技艺全靠自己，而且胜过雅典娜"),
          [
            t("She had never heard of Athena", "她从没听说过雅典娜"),
            t("She was afraid of the goddess", "她害怕这位女神"),
            t("She wanted to become Athena's student", "她想成为雅典娜的学生"),
          ],
          t(
            "In the second paragraph Arachne says no one taught her and that she is a better weaver than Athena.",
            "在第二段中，阿拉克涅说没有人教过她，她织得比雅典娜还好。",
          ),
        ),
        ask(
          t("What chance did Athena give Arachne before the contest?", "比赛前，雅典娜给了阿拉克涅什么机会？"),
          t("A chance to ask for forgiveness", "请求宽恕的机会"),
          [
            t("A chance to leave the village", "离开村子的机会"),
            t("A chance to learn from her", "向她学习的机会"),
            t("A chance to choose the prize", "选择奖品的机会"),
          ],
          t(
            "Disguised as an old woman, Athena told Arachne to ask the goddess to forgive her, and promised that she would.",
            "雅典娜扮成老妇人，劝阿拉克涅请求女神宽恕，并说女神会原谅她。",
          ),
        ),
        ask(
          t("Why was Athena so angry, even though Arachne's weaving was perfect?", "阿拉克涅织得完美无缺，雅典娜为什么还如此愤怒？"),
          t("Arachne had shown no respect for the gods", "阿拉克涅对众神毫无敬意"),
          [
            t("Arachne had used Athena's threads", "阿拉克涅用了雅典娜的线"),
            t("Arachne's picture was ugly", "阿拉克涅织的图画很难看"),
            t("Arachne refused to weave at all", "阿拉克涅根本拒绝织布"),
          ],
          t(
            "The fifth paragraph says the goddess was furious at Arachne's lack of respect; her picture made fun of the gods.",
            "第五段说，女神对阿拉克涅的不敬感到愤怒；她织的图画嘲弄了众神。",
          ),
        ),
      ],
      ["Arachne", "Arachne's", "Athena", "Greece", "Greek"],
    ),
    passage(
      "persephone-and-the-seasons",
      t("Persephone and the Seasons", "珀耳塞福涅与四季"),
      `The ancient Greeks told a story to explain why the earth changes with the seasons. It begins with Demeter, the goddess of the harvest, who made the crops grow and the fields green. Demeter loved nothing in the world as much as her daughter, Persephone.

One spring morning, Persephone was picking flowers in a meadow when the ground split open. Out of the crack rode Hades, the god of the underworld, in a chariot pulled by black horses. He seized Persephone and carried her down to his dark kingdom to be his queen.

Demeter searched the whole earth for her daughter. In her grief, she forgot her work. The crops withered, the trees lost their leaves and the fields turned brown and bleak. Nothing grew, and people began to starve.

At last Zeus, the king of the gods, ordered Hades to return Persephone. But there was a rule: anyone who ate food in the underworld must stay there forever. Persephone had eaten six seeds of a pomegranate. So a compromise was reached. For six months of each year, she would live with her mother on earth; for the other six, she would return to Hades.

When Persephone comes home, Demeter is filled with joy, and the earth blooms in spring and summer. When she goes back to the underworld, Demeter mourns, and the world turns cold in autumn and winter.

In this way, the myth explained the cycle of the seasons long before anyone knew that the earth tilts as it travels around the sun.`,
      [clues, mythWords, plot],
      [
        ask(
          t("What happened to the earth while Demeter searched for her daughter?", "得墨忒耳寻找女儿的时候，大地发生了什么？"),
          t("The crops died and nothing grew", "庄稼枯死，寸草不生"),
          [
            t("The earth was covered in flowers", "大地开满了鲜花"),
            t("The rivers flooded the fields", "河水淹没了田野"),
            t("The sun stopped rising", "太阳不再升起"),
          ],
          t(
            "The third paragraph says the crops withered, the fields turned brown and people began to starve.",
            "第三段说，庄稼枯萎，田野变成棕色，人们开始挨饿。",
          ),
        ),
        ask(
          t("Why could Persephone not return to earth for good?", "为什么珀耳塞福涅不能永远回到人间？"),
          t("She had eaten pomegranate seeds in the underworld", "她在冥界吃了石榴籽"),
          [
            t("Her mother did not want her back", "她母亲不想让她回来"),
            t("Zeus refused to help", "宙斯拒绝帮忙"),
            t("She had fallen in love with the underworld", "她爱上了冥界"),
          ],
          t(
            "The fourth paragraph gives the rule that anyone who ate food in the underworld must stay, and Persephone had eaten six seeds.",
            "第四段给出了规则：在冥界吃过东西的人必须留在那里，而珀耳塞福涅吃了六颗石榴籽。",
          ),
        ),
        ask(
          t("What does the myth explain?", "这则神话解释了什么？"),
          t("Why the seasons change during the year", "为什么一年中季节会变化"),
          [
            t("Why pomegranates have seeds", "为什么石榴有籽"),
            t("How the earth travels around the sun", "地球怎样绕着太阳运行"),
            t("Why horses are black", "为什么马是黑色的"),
          ],
          t(
            "The first and last paragraphs say the story explained the cycle of the seasons.",
            "第一段和最后一段都说，这个故事解释了季节的循环。",
          ),
        ),
      ],
      ["Demeter", "Persephone", "Hades", "Zeus", "Greeks"],
    ),
    passage(
      "hou-yi-and-the-ten-suns",
      t("Hou Yi and the Ten Suns", "后羿射日"),
      `In ancient China, the myth tells, there were once ten suns. They were the sons of the god of the eastern sky, and they lived in a giant mulberry tree at the edge of the world. Each morning, one of them would climb into the sky and cross it, bringing light and warmth, while the other nine rested in the branches.

For a long time they took turns, and the world was well. But one day the ten brothers grew bored. "Why should we go one at a time?" they asked. "Let us all go together." So the next morning, all ten suns rose into the sky at once.

The heat was terrible. Rivers dried up, crops burned in the fields, and the rocks themselves began to melt. People hid in caves and prayed for help, but the suns only laughed and played across the sky.

The emperor called on Hou Yi, the greatest archer in the land. Hou Yi climbed a mountain, raised his red bow and drew a white arrow. He shot, and one of the suns burst into flames and fell to earth as a three-legged golden crow. Again and again he shot, until nine suns had fallen.

As he reached for his last arrow, the emperor stopped him. "Leave one," he said, "or the world will be dark and cold forever." So Hou Yi lowered his bow, and the last sun, frightened and obedient, has crossed the sky alone every day since.

The people honored Hou Yi as a hero, and the myth is still told as a story of courage, and of the danger of too much of anything.`,
      [clues, plot, theme],
      [
        ask(
          t("How did the ten suns behave before the trouble began?", "麻烦开始之前，十个太阳是怎样做的？"),
          t("They took turns crossing the sky one at a time", "它们轮流每天一个穿过天空"),
          [
            t("They all rose together every day", "它们每天一起升起"),
            t("They stayed hidden in caves", "它们躲在山洞里"),
            t("They fought each other in the sky", "它们在天上互相打斗"),
          ],
          t(
            "The first two paragraphs say one sun crossed the sky each morning while the others rested, and that for a long time they took turns.",
            "前两段说，每天早晨有一个太阳穿过天空，其他的在树上休息，很长时间里它们一直轮流。",
          ),
        ),
        ask(
          t("Why did the emperor tell Hou Yi to stop before the last sun?", "为什么皇帝让后羿留下最后一个太阳？"),
          t("Without any sun, the world would be dark and cold", "没有太阳，世界将永远黑暗寒冷"),
          [
            t("Hou Yi had run out of arrows", "后羿的箭用完了"),
            t("The last sun had promised to be good", "最后一个太阳答应会听话"),
            t("The god of the eastern sky asked him to", "东方天帝要求他这样做"),
          ],
          t('The emperor says, "Leave one, or the world will be dark and cold forever."', "皇帝说：“留下一个，否则世界将永远黑暗寒冷。”"),
        ),
        ask(
          t("What is the climax of the myth?", "这则神话的高潮是什么？"),
          t("Hou Yi shoots down the suns one by one", "后羿把太阳一个个射下来"),
          [
            t("The ten suns live in a mulberry tree", "十个太阳住在一棵桑树上"),
            t("The people honor Hou Yi as a hero", "人们把后羿尊为英雄"),
            t("The suns grow bored of taking turns", "太阳们厌倦了轮流值班"),
          ],
          t(
            "The moment of greatest tension is Hou Yi's shooting, which turns the story. The mulberry tree is exposition, boredom starts the rising action, and the honor comes in the resolution.",
            "后羿射日是紧张感最强的时刻，也是故事的转折点。桑树是开端，太阳们厌倦是发展的开始，人们的尊崇属于结局。",
          ),
        ),
      ],
      ["China", "Hou", "Yi"],
    ),
    passage(
      "maui-slows-the-sun",
      t("Maui Slows the Sun", "毛伊让太阳放慢脚步"),
      `Across the islands of the Pacific, people tell stories about Maui, a clever and daring hero who was always ready to take on an impossible task. In one of the most famous stories from Hawaii, Maui decided to do something about the sun.

In those days, the sun raced across the sky so quickly that the days were very short. Maui's mother, Hina, made cloth from the bark of trees, which she had to spread out to dry in the sunlight. But no matter how early she started, the sun set before her cloth was dry. Farmers could not finish their work, and fishermen came home in the dark.

Maui decided that the sun must be taught to slow down. He collected the strongest fibers he could find and wove them into sixteen long ropes. Then he climbed to the top of the great mountain Haleakala, where the sun rose each morning, and hid in a cave near the summit.

When the first rays of the sun crept over the edge of the mountain, Maui leapt out and threw his ropes around them, one after another, until the sun was caught. The sun struggled and burned, but Maui held on. "Let me go!" the sun cried.

"Only if you promise to move more slowly across the sky," Maui answered.

At last the sun agreed. From then on, it traveled slowly enough for Hina's cloth to dry and for people to finish their work in daylight. The name Haleakala means "house of the sun," and the story is still told on its slopes.`,
      [clues, plot, theme],
      [
        ask(
          t("What problem did the fast sun cause?", "太阳走得太快造成了什么问题？"),
          t("The days were too short for people to finish their work", "白天太短，人们干不完活"),
          [
            t("The sun burned the crops", "太阳烤焦了庄稼"),
            t("The nights were too warm to sleep", "夜里太热睡不着"),
            t("The sea dried up", "海水干涸了"),
          ],
          t(
            "The second paragraph says the days were short, so Hina's cloth never dried and farmers and fishermen could not finish their work.",
            "第二段说，白天很短，所以希娜的布总也晒不干，农民和渔民也干不完活。",
          ),
        ),
        ask(
          t("Why did Maui hide near the top of Haleakala?", "毛伊为什么躲在哈雷阿卡拉山顶附近？"),
          t("The sun rose there each morning", "太阳每天早晨从那里升起"),
          [
            t("It was the coolest place on the island", "那里是岛上最凉快的地方"),
            t("His mother lived in the cave", "他母亲住在那个山洞里"),
            t("He was hiding from the farmers", "他在躲避农民"),
          ],
          t(
            "The third paragraph says Haleakala was where the sun rose each morning, so Maui could catch its first rays.",
            "第三段说，哈雷阿卡拉山是太阳每天早晨升起的地方，所以毛伊能抓住它最早的光线。",
          ),
        ),
        ask(
          t("Which word best describes Maui in this story?", "哪个词最能形容故事中的毛伊？"),
          t("Clever and determined", "聪明而坚定"),
          [t("Lazy and careless", "懒惰而粗心"), t("Shy and fearful", "害羞而胆小"), t("Cruel and greedy", "残忍而贪婪")],
          t(
            "Maui plans carefully, weaves sixteen ropes and holds on while the sun burns, which shows both cleverness and determination.",
            "毛伊精心策划，编了十六根绳子，在太阳灼烧时也不松手，这既表现了聪明，也表现了坚定。",
          ),
        ),
      ],
      ["Pacific", "Maui", "Maui's", "Hawaii", "Hina", "Hina's", "Haleakala"],
    ),
  ],
};
