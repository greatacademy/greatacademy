// Grade 9: the reading unit of the second theme, heroes and epics, from Gilgamesh and the Odyssey to the epics of
// Africa and Asia and the pattern a scholar found in all of them.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const epicWords = { topic: "words-of-epic-and-myth", weight: 0.3 } as const;
const questWords = { topic: "words-of-trials-and-quests", weight: 0.3 } as const;
const honorWords = { topic: "words-of-honor-and-hospitality", weight: 0.3 } as const;
const conventions = { topic: "epic-conventions", weight: 0.2 } as const;
const journey = { topic: "the-heros-journey", weight: 0.2 } as const;
const academic2 = { topic: "academic-words-2", weight: 0.1 } as const;

/** heroesAndEpics is a reading unit of grade 9 on the great epics of the world and the heroes they celebrate. */
export const heroesAndEpics: ReadingUnitDef = {
  id: "heroes-and-epics",
  title: t("Heroes and Epics", "英雄与史诗"),
  passages: [
    passage(
      "the-oldest-epic",
      t("The Oldest Epic", "最古老的史诗"),
      `More than four thousand years ago, in the cities of ancient Mesopotamia, people told stories about a king named Gilgamesh. Over the centuries, these stories were gathered into a long poem written on clay tablets in wedge-shaped marks. Today it is called the Epic of Gilgamesh, and it is the oldest great work of literature that survives.

At the start of the poem, Gilgamesh is a proud and restless ruler of the city of Uruk. He is two-thirds divine and one-third mortal, stronger than any man, and he treats his people harshly. The people pray to the gods for help, and the gods create a wild man named Enkidu to be his equal. The two fight, but neither can win, and they become close friends.

Together they set out on a dangerous quest to a distant cedar forest, where they kill its monstrous guardian. Their victories make them bold, perhaps too bold. When they insult a goddess and kill the great Bull of Heaven she sends against them, the gods decide that one of the friends must die. Enkidu falls ill and dies.

Grief changes Gilgamesh completely. For the first time, he is afraid of death. He leaves his city and wanders across the world, searching for the secret of immortality. He crosses the waters of death to find Utnapishtim, a man who survived a great flood and was granted eternal life by the gods. Utnapishtim tells him of a plant that restores youth. Gilgamesh finds it at the bottom of the sea, but while he bathes on the journey home, a snake steals it.

Gilgamesh returns to Uruk with nothing. Yet as he looks at the great walls of his city, he seems to understand something. A human life is short, but the works people leave behind can last. The proud king who wanted to live forever learns to accept that he is mortal, and the poem that tells his story has outlived him by thousands of years.`,
      [epicWords, questWords, conventions],
      [
        ask(
          t("What changes Gilgamesh's attitude toward death?", "是什么改变了吉尔伽美什对死亡的态度？"),
          t("The death of his friend Enkidu", "他的朋友恩奇都之死"),
          [
            t("A war with a neighboring city", "与邻近城市的战争"),
            t("A warning from his people", "臣民的警告"),
            t("The loss of his crown", "失去王冠"),
          ],
          t(
            "The fourth paragraph says grief changes him completely and that for the first time he is afraid of death, after Enkidu dies.",
            "第四段说恩奇都死后，悲痛彻底改变了他，他第一次害怕死亡。",
          ),
        ),
        ask(
          t("What happens to the plant that restores youth?", "那株能使人恢复青春的植物后来怎样了？"),
          t("A snake steals it while Gilgamesh bathes", "吉尔伽美什洗澡时被一条蛇偷走了"),
          [
            t("Gilgamesh gives it to the people of Uruk", "吉尔伽美什把它给了乌鲁克的人民"),
            t("Utnapishtim refuses to let him take it", "乌特纳庇什提姆不让他带走"),
            t("It turns to stone in his hand", "它在他手中变成了石头"),
          ],
          t(
            "The fourth paragraph says that while he bathes on the journey home, a snake steals the plant.",
            "第四段说他在回家途中洗澡时，一条蛇偷走了那株植物。",
          ),
        ),
        ask(
          t("What does Gilgamesh seem to understand at the end?", "结尾时吉尔伽美什似乎明白了什么？"),
          t("A human life is short, but the works people leave behind can last", "人的生命是短暂的，但人们留下的成就可以长存"),
          [
            t("He can still become immortal if he tries again", "只要再试一次，他仍能获得永生"),
            t("The gods will forgive him for killing the bull", "众神会原谅他杀死天牛"),
            t("Walls are useless against floods", "城墙挡不住洪水"),
          ],
          t(
            "The last paragraph says that as he looks at the walls, he seems to understand that life is short but people's works can last.",
            "最后一段说，他望着城墙，似乎明白了生命短暂，但人的成就可以长存。",
          ),
        ),
      ],
      ["Mesopotamia", "Gilgamesh", "Uruk", "Enkidu", "Utnapishtim", "Heaven"],
    ),
    passage(
      "the-long-way-home",
      t("The Long Way Home", "漫长的归途"),
      `The Odyssey, an ancient Greek epic usually credited to a poet named Homer, begins in the middle of the story. Its hero, Odysseus, has already fought for ten years in the Trojan War and has spent nearly ten more trying to sail home to the island of Ithaca. The poem opens with an invocation, a prayer to the Muse to help the poet sing of this clever, much-traveled man.

Odysseus is not the strongest of the Greek heroes. His great gift is his mind. Trapped in the cave of the Cyclops, a one-eyed giant who eats his men, he tells the monster that his name is Nobody. When Odysseus blinds the giant and escapes, the Cyclops cries to his neighbors that Nobody is hurting him, and so no one comes to help.

Many of his trials are tests of self-control. He has his sailors plug their ears with wax and tie him to the mast so that he can hear the song of the Sirens without steering his ship onto the rocks. Yet his men are less patient. Against his orders, they open a bag of winds, eat the sacred cattle of the sun god and are destroyed one by one. In the end, Odysseus reaches Ithaca alone.

At home, his trials are not over. For years, rude suitors have filled his palace, eating his food and trying to marry his wife, Penelope. They have broken the rules of hospitality that every guest in ancient Greece was expected to respect. Odysseus returns disguised as an old beggar, so that he can learn who has stayed loyal. Penelope, who has also been clever, sets a test: whoever can string her husband's great bow and shoot an arrow through twelve axes may marry her. Only the beggar can do it.

The Odyssey has given English a word: an odyssey is any long, adventurous journey. It also gave later writers a model of a hero who wins not by force alone, but by patience, cunning and the refusal to give up on home.`,
      [epicWords, questWords, honorWords, conventions],
      [
        ask(
          t("Why do the neighbors of the Cyclops not come to help him?", "为什么独眼巨人的邻居不来帮他？"),
          t("He tells them that Nobody is hurting him", "他告诉他们“没有人”在伤害他"),
          [
            t("They are afraid of Odysseus", "他们害怕奥德修斯"),
            t("They are asleep in their own caves", "他们在自己的洞里睡着了"),
            t("The Cyclops has no neighbors", "独眼巨人没有邻居"),
          ],
          t(
            "The second paragraph says Odysseus called himself Nobody, so the Cyclops cried that Nobody was hurting him, and no one came.",
            "第二段说奥德修斯自称“没有人”，所以独眼巨人喊“没有人”在伤害他，于是没人来帮忙。",
          ),
        ),
        ask(
          t("How have the suitors broken the rules of hospitality?", "求婚者们如何违反了待客之道？"),
          t("They have filled his palace, eating his food and pursuing his wife", "他们占据他的宫殿，吃他的食物，并追求他的妻子"),
          [
            t("They have refused to let travelers into Ithaca", "他们拒绝让旅人进入伊萨卡"),
            t("They have stolen his ships", "他们偷走了他的船"),
            t("They have insulted the gods at a festival", "他们在节日上侮辱了众神"),
          ],
          t(
            "The fourth paragraph says the suitors filled his palace, ate his food and tried to marry his wife, breaking the rules every guest was expected to respect.",
            "第四段说求婚者占据他的宫殿，吃他的食物，还想娶他的妻子，违反了每位客人都应遵守的规矩。",
          ),
        ),
        ask(
          t("According to the passage, what is Odysseus's great gift?", "根据文章，奥德修斯最大的天赋是什么？"),
          t("His mind", "他的智慧"),
          [t("His strength", "他的力量"), t("His singing voice", "他的歌喉"), t("His wealth", "他的财富")],
          t(
            "The second paragraph says he is not the strongest of the Greek heroes and that his great gift is his mind.",
            "第二段说他并非希腊英雄中最强壮的，他最大的天赋是他的智慧。",
          ),
        ),
      ],
      ["Odyssey", "Greek", "Homer", "Odysseus", "Trojan", "Ithaca", "Muse", "Cyclops", "Nobody", "Sirens", "Penelope"],
    ),
    passage(
      "the-monster-and-the-mead-hall",
      t("The Monster and the Mead Hall", "怪物与蜜酒大厅"),
      `Beowulf is the oldest long poem in English, though its English is so old that modern readers need a translation. It was probably composed more than a thousand years ago and survives in a single damaged manuscript, which was nearly destroyed in a library fire in 1731.

The poem is set in Scandinavia. King Hrothgar of the Danes has built a magnificent hall called Heorot, where his warriors feast, drink mead and listen to bards. But the noise of their celebrations angers a monster named Grendel, who lives in the dark marshes. Night after night, Grendel attacks the hall and carries off warriors. For twelve years, no one can stop him.

Then a young warrior named Beowulf sails from the land of the Geats to help. He is a guest, and he comes partly to repay a debt of honor, since Hrothgar once helped his father. Beowulf announces that he will fight the monster without a sword, because Grendel uses none. When Grendel comes, Beowulf grips his arm and tears it from his shoulder. The monster flees to die.

The celebrations do not last. The next night, Grendel's mother comes to avenge her son. Beowulf follows her to her lair at the bottom of a lake and kills her with a giant's sword he finds on the wall.

Beowulf returns home in glory and later becomes king of the Geats. He rules well for fifty years. In his old age, a dragon, angered when a thief steals a cup from its treasure, begins to burn the land. The old king goes out to fight it. All his warriors run in fear except one young man, Wiglaf, who stays at his side. Together they kill the dragon, but Beowulf is fatally wounded.

The poem ends with his funeral. His people build a great mound by the sea, so that sailors will see it from far away. In a world where life is short and dangers never end, the poem suggests, the only lasting thing a person can win is a good name.`,
      [epicWords, questWords, honorWords],
      [
        ask(
          t("Why does Beowulf fight Grendel without a sword?", "贝奥武甫为什么不用剑和格伦德尔搏斗？"),
          t("Because Grendel uses none", "因为格伦德尔不用剑"),
          [
            t("Because his sword has been stolen", "因为他的剑被偷了"),
            t("Because the king forbids weapons in the hall", "因为国王禁止在大厅里携带武器"),
            t("Because swords cannot harm monsters", "因为剑伤不了怪物"),
          ],
          t(
            "The third paragraph says Beowulf announces he will fight without a sword because Grendel uses none.",
            "第三段说贝奥武甫宣布他将不用剑作战，因为格伦德尔不用剑。",
          ),
        ),
        ask(
          t("What does Wiglaf do when the old king fights the dragon?", "老国王与龙搏斗时，威格拉夫做了什么？"),
          t("He stays at the king's side while the others run", "其他人逃跑时，他留在国王身边"),
          [
            t("He steals the dragon's cup", "他偷走了龙的杯子"),
            t("He runs to bring more warriors", "他跑去叫更多的战士"),
            t("He kills the dragon alone before the king arrives", "国王到来前他独自杀死了龙"),
          ],
          t(
            "The fifth paragraph says all the warriors ran in fear except Wiglaf, who stayed at the king's side.",
            "第五段说所有战士都吓跑了，只有威格拉夫留在国王身边。",
          ),
        ),
        ask(
          t(
            "According to the last paragraph, what does the poem suggest is the only lasting thing a person can win?",
            "根据最后一段，这首诗暗示人能赢得的唯一长久的东西是什么？",
          ),
          t("A good name", "好名声"),
          [t("A dragon's treasure", "龙的宝藏"), t("A great hall", "一座宏伟的大厅"), t("A long life", "长寿")],
          t(
            "The last paragraph says that in a world where life is short, the only lasting thing a person can win is a good name.",
            "最后一段说在生命短暂的世界里，人能赢得的唯一长久之物是好名声。",
          ),
        ),
      ],
      ["Beowulf", "English", "Scandinavia", "Hrothgar", "Danes", "Heorot", "Grendel", "Geats", "Grendel's", "Wiglaf"],
    ),
    passage(
      "the-lion-king-of-mali",
      t("The Lion King of Mali", "马里的雄狮之王"),
      `In West Africa, the story of Sundiata Keita has been told for nearly eight hundred years. It is not written in a book that people read alone. It is performed aloud by griots, professional storytellers and musicians who memorize the history of families and kingdoms and pass it from parent to child. A griot may sing the epic for hours, playing a stringed instrument called the kora.

Sundiata was a real person, the founder of the Mali Empire in the thirteenth century, but the epic surrounds his life with wonders. Before his birth, a hunter tells the king of Manden that if he marries an ugly woman named Sogolon, she will bear him a son who will become a great ruler. The king marries her, and Sundiata is born.

At first, the prophecy seems false. Sundiata cannot walk. Even at the age of seven he crawls on the ground, and the king's first wife mocks him and his mother. When the old king dies, her son takes the throne. One day, she insults Sogolon so cruelly that Sundiata decides he will walk. He calls for an iron bar, pulls himself up on it so hard that it bends, and stands. From that day, he grows strong and brave.

Because the new king fears him, Sundiata and his mother go into exile. For years they live in foreign courts, where Sundiata learns about war and leadership. Meanwhile, a powerful sorcerer king named Soumaoro conquers Manden. The people send messengers to find Sundiata, and he returns to lead an army against him.

Soumaoro cannot be harmed by ordinary weapons. Sundiata's half-sister, who was forced to marry the sorcerer, learns his secret: his power can be broken by the spur of a white rooster. Sundiata ties the spur to an arrow, and when it grazes Soumaoro, the sorcerer's power vanishes. Sundiata wins and founds a great empire.

The epic praises Sundiata's courage, but it also praises patience. The boy who could not walk became a king, the griots sing, because greatness can take a long time to rise.`,
      [epicWords, questWords, conventions, journey],
      [
        ask(
          t("Who traditionally performs the epic of Sundiata?", "传统上由谁来表演松迪亚塔的史诗？"),
          t("Griots, professional storytellers and musicians", "格里奥，即职业的说书人和乐师"),
          [
            t("Priests reading from a sacred book", "诵读圣书的祭司"),
            t("The kings of Mali themselves", "马里的国王们本人"),
            t("Actors in a theater", "剧院里的演员"),
          ],
          t(
            "The first paragraph says the story is performed aloud by griots, professional storytellers and musicians.",
            "第一段说这个故事由格里奥，即职业说书人和乐师，口头表演。",
          ),
        ),
        ask(
          t("What makes Sundiata decide to walk?", "是什么让松迪亚塔决定站起来行走？"),
          t("The cruel insult the first wife gives his mother", "国王的第一位妻子对他母亲的残酷侮辱"),
          [
            t("A command from the old king", "老国王的命令"),
            t("A message from the people of Manden", "曼丁人民送来的消息"),
            t("A dream about a white rooster", "关于一只白公鸡的梦"),
          ],
          t(
            "The third paragraph says the first wife insulted Sogolon so cruelly that Sundiata decided he would walk.",
            "第三段说那位妻子残酷地侮辱了索格隆，于是松迪亚塔决定要走路。",
          ),
        ),
        ask(
          t("How is Soumaoro's power broken?", "苏毛罗的法力是如何被破除的？"),
          t("By an arrow carrying the spur of a white rooster", "被一支系着白公鸡距的箭"),
          [
            t("By an iron bar bent in anger", "被一根愤怒中弯曲的铁棒"),
            t("By a song sung on the kora", "被一首用科拉琴弹唱的歌"),
            t("By a sword from a giant", "被一把巨人的剑"),
          ],
          t(
            "The fifth paragraph says Sundiata tied the spur of a white rooster to an arrow, and when it grazed Soumaoro, his power vanished.",
            "第五段说松迪亚塔把白公鸡的距系在箭上，箭擦过苏毛罗时，他的法力就消失了。",
          ),
        ),
      ],
      ["West", "Africa", "Sundiata", "Keita", "Mali", "Empire", "Manden", "Sogolon", "Soumaoro", "Sundiata's"],
      ["griots", "kora"],
    ),
    passage(
      "a-prince-in-the-forest",
      t("A Prince in the Forest", "森林中的王子"),
      `The Ramayana is one of the two great epics of ancient India. It is traditionally said to have been composed by a sage named Valmiki, and over two thousand years it has been retold in dozens of languages, from Tamil to Thai, in poems, plays, dances, puppet shows and television series.

Its hero, Rama, is the eldest son of a king and the favorite of the people. He is about to be crowned when one of his father's wives, who wants her own son to rule, reminds the king of a promise he once made to her. Bound by his word, the heartbroken king must send Rama into the forest for fourteen years. Rama accepts without anger. To him, keeping a father's promise matters more than a throne. His wife, Sita, and his loyal brother Lakshmana insist on going with him.

In the forest, a demon king named Ravana sees Sita and desires her. He sends a magical golden deer to lure Rama and Lakshmana away, and then, disguised as a holy beggar, he carries Sita off to his island kingdom of Lanka.

Rama's search for Sita is the heart of the epic. He makes an alliance with a kingdom of monkeys. The greatest of them, Hanuman, leaps across the sea to Lanka, finds Sita in a garden and gives her Rama's ring as a sign that help is coming. The monkeys then build a bridge of stones across the ocean, and Rama's army crosses to fight Ravana. After a long battle, Rama kills the demon king and rescues his wife.

When the exile ends, Rama returns home and is crowned at last. In many parts of India, the festival of Diwali celebrates this return; people light rows of lamps, as the people of his city are said to have done to welcome him.

For many readers, the Ramayana is more than an adventure. Rama is an example of dharma, a word that means duty and the right way to live. He is honored not only for his courage, but for choosing what is right even when it costs him everything.`,
      [epicWords, questWords, honorWords, journey],
      [
        ask(
          t("Why does Rama go into the forest for fourteen years?", "罗摩为什么要去森林里待十四年？"),
          t("His father is bound by a promise to one of his wives", "他的父亲被对一位妻子许下的承诺所约束"),
          [
            t("He wants to hunt the golden deer", "他想猎取金鹿"),
            t("He has lost a battle against Ravana", "他在与罗波那的战斗中失败了"),
            t("The people have turned against him", "人民反对他"),
          ],
          t(
            "The second paragraph says one of his father's wives reminded the king of a promise, and the king, bound by his word, had to send Rama away.",
            "第二段说父亲的一位妻子提醒国王曾许下的承诺，国王受诺言约束，只得把罗摩送走。",
          ),
        ),
        ask(
          t("What does Hanuman give Sita in Lanka?", "哈努曼在楞伽岛给了悉多什么？"),
          t("Rama's ring, as a sign that help is coming", "罗摩的戒指，作为救援将至的信物"),
          [
            t("A golden deer", "一只金鹿"),
            t("A lamp from Rama's city", "一盏来自罗摩城中的灯"),
            t("A map of the bridge of stones", "一张石桥的地图"),
          ],
          t(
            "The fourth paragraph says Hanuman found Sita in a garden and gave her Rama's ring as a sign that help was coming.",
            "第四段说哈努曼在花园里找到悉多，把罗摩的戒指交给她，作为救援将至的信物。",
          ),
        ),
        ask(
          t("What does the word dharma mean in the passage?", "文中 dharma 一词是什么意思？"),
          t("Duty and the right way to live", "责任与正确的生活方式"),
          [t("A festival of lamps", "灯节"), t("A demon's magic", "魔王的法术"), t("The kingdom of the monkeys", "猴国")],
          t(
            "The last paragraph says dharma is a word that means duty and the right way to live.",
            "最后一段说 dharma 一词意为责任与正确的生活方式。",
          ),
        ),
      ],
      ["Ramayana", "India", "Valmiki", "Tamil", "Thai", "Rama", "Sita", "Lakshmana", "Ravana", "Lanka", "Rama's", "Hanuman", "Diwali"],
      ["dharma"],
    ),
    passage(
      "the-pilgrim-and-the-monkey",
      t("The Pilgrim and the Monkey", "取经人与猴王"),
      `In the year 629, a Chinese monk named Xuanzang set out alone to travel to India. He wanted to find Buddhist scriptures and bring them back to China. His journey took seventeen years. He crossed deserts and mountains, studied in Indian monasteries and returned with hundreds of texts, which he spent the rest of his life translating.

Nearly a thousand years later, in the sixteenth century, this true story became the basis of one of the most loved novels in Chinese literature, Journey to the West. Its author is usually believed to be Wu Cheng'en. The novel keeps the monk's pilgrimage, but it fills the road with gods, demons and magic, and it gives the monk four companions.

The most famous of them is Sun Wukong, the Monkey King. Born from a stone, he learns magical powers, can leap thousands of miles in a single somersault and carries a staff that can shrink to the size of a needle or grow as tall as the sky. He is also proud and rebellious. Early in the novel, he causes chaos in Heaven and declares himself the equal of the gods, until the Buddha traps him under a mountain for five hundred years.

To win his freedom, Monkey must protect the monk on his journey. The road is long and full of trials. Demons try again and again to capture the monk, because they believe that eating his flesh will make them immortal. Monkey defeats them with strength and tricks, helped by a greedy, lazy pig spirit and a quiet, loyal river spirit, while a dragon prince serves as the monk's horse.

The monk himself is gentle and holy but often foolish, easily fooled by demons in disguise. Much of the novel's humor comes from the contrast between his helplessness and Monkey's impatient brilliance.

In the end, after eighty-one ordeals, the pilgrims reach their goal. Along the way, the wild Monkey has learned discipline. For many readers, the journey to the West is also a journey inward, a story about taming the restless mind.`,
      [epicWords, questWords, journey, academic2],
      [
        ask(
          t("What was the purpose of the real monk's journey?", "真实的那位僧人出行的目的是什么？"),
          t("To find Buddhist scriptures and bring them back to China", "寻找佛经并带回中国"),
          [
            t("To become king of a distant land", "成为远方国度的国王"),
            t("To escape a war in China", "逃避中国的战争"),
            t("To find the Monkey King", "寻找猴王"),
          ],
          t(
            "The first paragraph says Xuanzang wanted to find Buddhist scriptures and bring them back to China.",
            "第一段说玄奘想要寻找佛经并带回中国。",
          ),
        ),
        ask(
          t("Why do the demons want to capture the monk?", "妖怪们为什么想抓住那位僧人？"),
          t("They believe eating his flesh will make them immortal", "他们相信吃了他的肉就能长生不老"),
          [
            t("They want to steal his horse", "他们想偷他的马"),
            t("They want him to translate their books", "他们想让他翻译他们的书"),
            t("They are angry that he left China", "他们恼怒他离开了中国"),
          ],
          t(
            "The fourth paragraph says demons try to capture him because they believe eating his flesh will make them immortal.",
            "第四段说妖怪们想抓他，因为他们相信吃了他的肉能长生不老。",
          ),
        ),
        ask(
          t("According to the last paragraph, how do many readers understand the journey?", "根据最后一段，许多读者如何理解这段旅程？"),
          t("As a journey inward, about taming the restless mind", "作为一段向内的旅程，讲的是驯服躁动的心"),
          [
            t("As a true record of the deserts of Asia", "作为对亚洲沙漠的真实记录"),
            t("As a warning against travel", "作为对出行的警告"),
            t("As a story about the history of pigs and rivers", "作为一个关于猪和河流历史的故事"),
          ],
          t(
            "The last paragraph says that for many readers the journey is also a journey inward, a story about taming the restless mind.",
            "最后一段说对许多读者而言，这段旅程也是一段向内的旅程，讲的是驯服躁动的心。",
          ),
        ),
      ],
      [
        "Chinese",
        "Xuanzang",
        "India",
        "Buddhist",
        "China",
        "Indian",
        "Journey",
        "West",
        "Wu",
        "Cheng'en",
        "Sun",
        "Wukong",
        "Monkey",
        "King",
        "Heaven",
        "Buddha",
      ],
    ),
    passage(
      "the-book-of-kings",
      t("The Book of Kings", "列王纪"),
      `Around the year 1010, a Persian poet named Ferdowsi completed a poem he had worked on for more than thirty years. Called the Shahnameh, or Book of Kings, it tells the history of Iran from the creation of the world to the Arab conquest in the seventh century. With about fifty thousand couplets, it is one of the longest poems ever written by a single author.

Ferdowsi wrote at a time when Persian was in danger of being replaced by Arabic as the language of literature. He chose to use as few Arabic words as possible. Many Iranians believe that his poem helped to save their language, and it is still read and recited today.

The most famous hero of the Shahnameh is Rostam, a warrior of enormous strength who rides a mighty horse named Rakhsh. Rostam fights demons, dragons and armies, and he serves king after king for centuries. Yet his best-known story is not a victory but a tragedy.

As a young man, on a journey, Rostam spends a night with a princess named Tahmineh. He leaves her a token to give to their child, and departs. Their son, Sohrab, grows up to be a great warrior, but he has never met his father. Years later, Sohrab leads an army against Iran, hoping to find Rostam and make him king.

Fate turns against them. When the two meet on the battlefield, neither knows the other. Sohrab suspects the truth and asks the older warrior if he is Rostam, but Rostam, fearing a trick, hides his name. They fight for days. At last Rostam wounds Sohrab fatally. Only then does he see the token on his son's arm. A medicine that could save the young man is sent for, but it arrives too late.

The story of Rostam and Sohrab has moved readers for a thousand years. It shows how pride, secrecy and the confusion of war can destroy even the greatest heroes, and how a single hidden truth can turn victory into grief.`,
      [epicWords, honorWords, conventions],
      [
        ask(
          t("Why did Ferdowsi use as few Arabic words as possible?", "菲尔多西为什么尽量少用阿拉伯语词汇？"),
          t("Persian was in danger of being replaced by Arabic as the language of literature", "波斯语面临被阿拉伯语取代为文学语言的危险"),
          [
            t("He could not read Arabic", "他不懂阿拉伯语"),
            t("The king ordered him to", "国王命令他这样做"),
            t("Arabic words did not fit his couplets", "阿拉伯语词汇不适合他的对句"),
          ],
          t(
            "The second paragraph says he wrote when Persian was in danger of being replaced by Arabic, so he chose to use as few Arabic words as possible.",
            "第二段说他写作时波斯语面临被阿拉伯语取代的危险，所以他尽量少用阿拉伯语词汇。",
          ),
        ),
        ask(
          t("Why does Rostam hide his name from Sohrab?", "鲁斯塔姆为什么对苏赫拉布隐瞒自己的名字？"),
          t("He fears a trick", "他担心这是个圈套"),
          [
            t("He is ashamed of his son", "他以儿子为耻"),
            t("He has forgotten his own name", "他忘了自己的名字"),
            t("The king has ordered him to fight in disguise", "国王命令他乔装作战"),
          ],
          t(
            "The fifth paragraph says that when Sohrab asks if he is Rostam, Rostam, fearing a trick, hides his name.",
            "第五段说苏赫拉布问他是不是鲁斯塔姆时，鲁斯塔姆担心有诈，隐瞒了名字。",
          ),
        ),
        ask(
          t("How does Rostam finally learn that Sohrab is his son?", "鲁斯塔姆最终如何得知苏赫拉布是他的儿子？"),
          t("He sees the token on Sohrab's arm", "他看见了苏赫拉布手臂上的信物"),
          [
            t("Tahmineh arrives at the battlefield", "塔赫米娜来到了战场"),
            t("Rakhsh recognizes the young man", "拉赫什认出了那个年轻人"),
            t("A king tells him the truth", "一位国王告诉了他真相"),
          ],
          t(
            "The fifth paragraph says that only after wounding him does Rostam see the token on his son's arm.",
            "第五段说直到刺伤儿子之后，鲁斯塔姆才看见儿子手臂上的信物。",
          ),
        ),
      ],
      ["Persian", "Ferdowsi", "Shahnameh", "Book", "Kings", "Iran", "Arab", "Arabic", "Iranians", "Rostam", "Rakhsh", "Tahmineh", "Sohrab"],
    ),
    passage(
      "one-story-many-faces",
      t("One Story, Many Faces", "一个故事，千张面孔"),
      `In 1949, an American scholar named Joseph Campbell published a book called The Hero with a Thousand Faces. Campbell had studied myths and epics from all over the world, and he believed that many of them followed the same basic pattern. He called this pattern the monomyth. Today it is better known as the hero's journey.

In Campbell's description, the journey begins in the ordinary world. The hero receives a call to adventure: a message, a threat, a mystery. Often the hero refuses the call at first, out of fear or duty. Then a mentor appears, an older and wiser figure who offers advice or a magical gift. The hero crosses a threshold into an unknown world, where the rules are different.

In this special world, the hero faces a road of trials, meets allies and enemies, and finally reaches the greatest ordeal, a moment of crisis that may involve a kind of death and rebirth. Surviving it, the hero gains a reward, which may be a treasure, a piece of knowledge or a new understanding of the self. Finally, the hero returns home, changed, bringing something that can help others.

It is easy to see this pattern in the epics. Gilgamesh leaves his city, suffers the ordeal of his friend's death and returns with wisdom. Odysseus crosses into a world of monsters and returns to restore order at home.

The pattern has also shaped modern stories. In the 1970s, the film director George Lucas said that Campbell's book had influenced his space adventure Star Wars. After its success, Hollywood writers began to study the hero's journey as a kind of recipe.

Not everyone admires the pattern. Some critics argue that Campbell forced very different stories into one shape and ignored the details that made each culture's myths special. Others point out that most of his heroes were men. Still, the hero's journey remains a useful tool. It helps readers notice how stories are built, and it reminds us how often people in different places have dreamed the same dream.`,
      [epicWords, questWords, journey],
      [
        ask(
          t("What does the hero often do when first receiving the call to adventure?", "主人公最初接到冒险召唤时常常怎么做？"),
          t("Refuses it, out of fear or duty", "出于恐惧或责任而拒绝"),
          [
            t("Accepts it immediately and joyfully", "立即欣然接受"),
            t("Asks the people of the town for permission", "请求镇上的人允许"),
            t("Writes a book about it", "为此写一本书"),
          ],
          t(
            "The second paragraph says that often the hero refuses the call at first, out of fear or duty.",
            "第二段说主人公起初常常出于恐惧或责任而拒绝召唤。",
          ),
        ),
        ask(
          t("What role does the mentor play in the hero's journey?", "导师在英雄之旅中扮演什么角色？"),
          t("An older and wiser figure who offers advice or a magical gift", "一个年长睿智、提供建议或魔法礼物的人物"),
          [
            t("The enemy the hero must defeat in the final ordeal", "主人公在最后考验中必须战胜的敌人"),
            t("The treasure the hero brings home", "主人公带回家的宝物"),
            t("A friend from the ordinary world who stays behind", "留在平凡世界的朋友"),
          ],
          t(
            "The second paragraph says a mentor appears, an older and wiser figure who offers advice or a magical gift.",
            "第二段说会出现一位导师，一个年长睿智、提供建议或魔法礼物的人物。",
          ),
        ),
        ask(
          t("Which criticism of Campbell does the passage mention?", "文章提到了对坎贝尔的哪一种批评？"),
          t("He forced very different stories into one shape", "他把迥然不同的故事硬塞进同一个模式"),
          [
            t("He studied only Greek myths", "他只研究希腊神话"),
            t("He never read the epics he described", "他从未读过他所描述的史诗"),
            t("He wrote his book for a film director", "他是为一位电影导演写的书"),
          ],
          t(
            "The last paragraph says some critics argue that Campbell forced very different stories into one shape.",
            "最后一段说一些批评者认为坎贝尔把迥然不同的故事硬塞进同一个模式。",
          ),
        ),
      ],
      [
        "American",
        "Joseph",
        "Campbell",
        "Hero",
        "Thousand",
        "Faces",
        "Campbell's",
        "Gilgamesh",
        "Odysseus",
        "George",
        "Lucas",
        "Star",
        "Wars",
        "Hollywood",
      ],
      ["monomyth"],
    ),
  ],
};
