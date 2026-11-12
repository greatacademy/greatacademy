// Grade 8: the reading unit of the seventh theme, tales of dread, from the first Gothic novels and the night that
// produced Frankenstein to the narrators who cannot be trusted and the science of why fear can be a pleasure.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grade-5/reading-kit.ts";

const gloomWords = { topic: "words-of-gloom-and-horror", weight: 0.3 } as const;
const ghostWords = { topic: "words-of-ghosts-and-haunting", weight: 0.3 } as const;
const madnessWords = { topic: "words-of-madness-and-despair", weight: 0.3 } as const;
const unreliable = { topic: "unreliable-narrators", weight: 0.2 } as const;
const gothic = { topic: "recognizing-gothic-elements", weight: 0.2 } as const;

/** talesOfDread is a reading unit of grade 8 on Gothic and horror stories and the narrators who tell them. */
export const talesOfDread: ReadingUnitDef = {
  id: "tales-of-dread",
  title: t("Tales of Dread", "恐怖故事"),
  passages: [
    passage(
      "the-birth-of-the-gothic",
      t("The Birth of the Gothic", "哥特小说的诞生"),
      `In 1764, an English writer named Horace Walpole published a strange little novel called The Castle of Otranto. It began with a giant helmet falling from the sky and crushing a young prince on his wedding day. Then things grew stranger. A portrait stepped out of its frame, a statue's nose began to bleed, and a gloomy castle seemed to hold secrets in every passage. Readers had never seen anything quite like it, and they loved it.

Walpole's book is usually called the first Gothic novel. The word Gothic had once meant the style of the great medieval cathedrals, with their pointed arches and shadowy spaces, and Walpole's castle belonged to that dark, ancient world. Over the next fifty years, dozens of writers followed his example, and certain features appeared again and again.

The setting was usually old and isolated: a ruined abbey, a crumbling castle, a mansion on a lonely moor. Inside were hidden doors, secret passages and dank underground vaults. The weather was often stormy, and the light was dim. A young heroine was frequently trapped and in danger, pursued by a powerful villain who had a terrible secret. Strange events, from mysterious sounds to ghostly figures, created a sense of foreboding, and the past seemed to reach into the present.

The most popular Gothic novelist was Ann Radcliffe, whose books in the 1790s sold in huge numbers. Radcliffe was a master of suspense. She often explained her ghosts at the end as tricks or accidents, but only after her readers had spent hundreds of pages in delicious terror.

The Gothic did not disappear when its first fashion passed. Its castles became haunted houses, and its villains became the vampires and monsters of later fiction. Every modern horror film owes something to Walpole's falling helmet.`,
      [gloomWords, ghostWords, gothic],
      [
        ask(
          t(
            "Which of these is a typical element of the Gothic novel described in the passage?",
            "以下哪一项是文章所描述的哥特小说的典型元素？",
          ),
          t("An isolated old building with secret passages", "一座有秘密通道的偏僻古老建筑"),
          [
            t("A sunny modern city", "一座阳光明媚的现代城市"),
            t("A hero who solves crimes with science", "一位用科学破案的英雄"),
            t("A cheerful family celebration", "一场欢乐的家庭庆祝活动"),
          ],
          t(
            "The third paragraph says the setting was usually old and isolated, with hidden doors, secret passages and dank vaults.",
            "第三段说故事背景通常古老而偏僻，有暗门、秘密通道和阴湿的地下室。",
          ),
        ),
        ask(
          t("Why was the word Gothic used for these novels?", "为什么这些小说被称为“哥特”小说？"),
          t(
            "It had meant the style of medieval cathedrals, and the novels were set in that dark, ancient world",
            "这个词原指中世纪大教堂的风格，而这些小说的背景正是那个黑暗古老的世界",
          ),
          [
            t("Walpole's family name was Gothic", "沃波尔的姓是“哥特”"),
            t("The novels were first written in the Gothic language", "这些小说最初用哥特语写成"),
            t("The novels were about the history of cathedrals", "这些小说讲的是大教堂的历史"),
          ],
          t(
            "The second paragraph says Gothic had once meant the style of medieval cathedrals, and Walpole's castle belonged to that dark, ancient world.",
            "第二段说“哥特”一词曾指中世纪大教堂的风格，而沃波尔笔下的城堡属于那个黑暗古老的世界。",
          ),
        ),
        ask(
          t("How did Ann Radcliffe often treat her ghosts?", "安·拉德克利夫通常如何处理她笔下的鬼魂？"),
          t("She explained them at the end as tricks or accidents", "她在结尾把它们解释为诡计或意外"),
          [
            t("She left them out of her books entirely", "她在书中完全不写鬼魂"),
            t("She made them the heroes of her stories", "她让它们成为故事的主角"),
            t("She described them only in the first chapter", "她只在第一章描写它们"),
          ],
          t(
            "The fourth paragraph says she often explained her ghosts at the end as tricks or accidents, after building suspense for hundreds of pages.",
            "第四段说她常在结尾把鬼魂解释为诡计或意外，此前已经营造了数百页的悬念。",
          ),
        ),
      ],
      ["English", "Horace", "Walpole", "Castle", "Otranto", "Walpole's", "Gothic", "Ann", "Radcliffe"],
    ),
    passage(
      "a-summer-without-sun",
      t("A Summer Without Sun", "没有太阳的夏天"),
      `In April 1815, a volcano called Mount Tambora erupted on an island in what is now Indonesia. It was the largest eruption in recorded history, and it threw so much ash into the sky that the weather changed around the world. In Europe, the following year became known as the "year without a summer." Crops failed, snow fell in June, and storms swept across the continent.

That summer, a small group of English writers had rented a villa beside Lake Geneva, in Switzerland. Among them were the poet Lord Byron, his doctor John Polidori, the poet Percy Shelley and Shelley's future wife, eighteen-year-old Mary Godwin. Day after day, cold rain kept them indoors. They read ghost stories aloud by the fire, and one night Byron proposed a contest: each of them would write a ghost story of their own.

For several days, Mary could think of nothing. Then one night, she lay awake and saw in her mind a pale student kneeling beside a hideous figure he had put together, and watching it stir with an uncanny, half-living motion. She was terrified by her own vision. The next morning, she began to write.

Her story grew into a novel, Frankenstein, published in 1818. It tells of Victor Frankenstein, a young scientist who becomes obsessed with discovering the secret of life and builds a living creature. When it opens its eyes, he is horrified and abandons it. The creature, rejected by everyone it meets, becomes bitter and violent, and the two destroy each other.

Frankenstein is often called the first science fiction novel. It also asks a question that remains alive today: what responsibility do creators have for what they create? Polidori's story from that same contest, The Vampyre, became the first modern vampire tale.`,
      [gloomWords, madnessWords, gothic],
      [
        ask(
          t(
            "How did the eruption of Mount Tambora help lead to the writing of Frankenstein?",
            "坦博拉火山的喷发如何促成了《弗兰肯斯坦》的创作？",
          ),
          t(
            "Its ash brought cold, rainy weather that kept the writers indoors telling ghost stories",
            "火山灰带来寒冷多雨的天气，使作家们待在室内讲鬼故事",
          ),
          [
            t("Mary Shelley wrote about the eruption in her novel", "玛丽·雪莱在小说中描写了这次喷发"),
            t("The writers had traveled to Indonesia to see it", "作家们去印度尼西亚观看了喷发"),
            t("The eruption destroyed the villa beside the lake", "喷发摧毁了湖边的别墅"),
          ],
          t(
            "The passage links the eruption to a year without summer, when cold rain kept the group indoors and Byron proposed the ghost story contest.",
            "文章把喷发与“无夏之年”联系起来，那时冷雨使这群人待在室内，拜伦提议举办鬼故事比赛。",
          ),
        ),
        ask(
          t("What gave Mary the idea for her story?", "玛丽的故事灵感来自哪里？"),
          t("A vision she had while lying awake one night", "一天夜里她躺着睡不着时脑海中出现的景象"),
          [
            t("A story that Byron read aloud", "拜伦朗读的一个故事"),
            t("A scientist she met in Switzerland", "她在瑞士遇到的一位科学家"),
            t("A newspaper report about a strange crime", "一篇关于离奇犯罪的报纸报道"),
          ],
          t(
            "The third paragraph says she lay awake one night and saw in her mind a student watching a figure he had made begin to stir.",
            "第三段说她一天夜里躺着睡不着，脑海中看到一个学生注视着自己造出的人形开始动起来。",
          ),
        ),
        ask(
          t("What question does the last paragraph say Frankenstein raises?", "最后一段说《弗兰肯斯坦》提出了什么问题？"),
          t("What responsibility creators have for what they create", "创造者对自己的创造物负有什么责任"),
          [
            t("Whether volcanoes can change the weather", "火山能否改变天气"),
            t("Whether vampires are real", "吸血鬼是否真实存在"),
            t("How to win a writing contest", "如何赢得写作比赛"),
          ],
          t(
            "The last paragraph says the novel asks what responsibility creators have for what they create, a question that remains alive today.",
            "最后一段说这部小说提出了创造者对其创造物负有什么责任的问题，这个问题至今仍有意义。",
          ),
        ),
      ],
      [
        "April",
        "Mount",
        "Tambora",
        "Indonesia",
        "Europe",
        "June",
        "English",
        "Lake",
        "Geneva",
        "Switzerland",
        "Lord",
        "Byron",
        "John",
        "Polidori",
        "Percy",
        "Shelley",
        "Shelley's",
        "Mary",
        "Godwin",
        "Frankenstein",
        "Victor",
        "Polidori's",
        "Vampyre",
      ],
    ),
    passage(
      "the-narrator-who-is-not-mad",
      t("The Narrator Who Is Not Mad", "坚称自己没疯的叙述者"),
      `Edgar Allan Poe's story "The Tell-Tale Heart," published in 1843, begins with a narrator who insists that he is calm and sane. He admits that he is nervous, very nervous, but he asks the reader how anyone could call him mad when they hear how carefully he planned what he did. Then he tells the story of how he murdered an old man with whom he lived.

He had no quarrel with the old man, he says. The old man had never wronged him. The only problem was one of the old man's eyes, a pale blue eye with a film over it, which the narrator could not bear. For seven nights, he crept into the old man's room at midnight and watched him sleep. On the eighth night, he killed him and hid the body under the floorboards.

When police officers arrive after a neighbor reports a scream, the narrator welcomes them calmly and even sets his chair over the very place where the body lies. But soon he begins to hear a low, dull sound, which he believes is the beating of the dead man's heart. It grows louder and louder, and he is sure the officers can hear it too and are only pretending not to. At last, in a frenzy, he confesses.

Poe's narrator is one of the most famous unreliable narrators in literature. Everything he says to prove that he is sane, the obsession with an eye, the endless planning, the sound no one else hears, proves the opposite to the reader. The horror of the story comes less from the crime than from being trapped inside a mind that cannot see itself.

Poe wrote many tales of terror, and his short life was marked by poverty and grief. Yet he also helped invent the detective story, and his ideas about the short story are still taught today.`,
      [madnessWords, gloomWords, unreliable],
      [
        ask(
          t('Why is the narrator of "The Tell-Tale Heart" unreliable?', "为什么《泄密的心》的叙述者不可靠？"),
          t(
            "The evidence he gives for his sanity shows the reader that he is not sane",
            "他为证明自己神志正常而给出的证据恰恰向读者表明他并不正常",
          ),
          [
            t("He tells the story in the wrong order", "他讲故事的顺序错了"),
            t("He forgets the name of the old man", "他忘了老人的名字"),
            t("He was not present when the crime happened", "犯罪发生时他并不在场"),
          ],
          t(
            "The fourth paragraph says everything he says to prove he is sane, such as the obsession and the sound no one else hears, proves the opposite.",
            "第四段说他为证明自己神志正常所说的一切，比如那种执念和别人听不到的声音，恰恰证明了相反的情况。",
          ),
        ),
        ask(
          t("What does the narrator give as his reason for the crime?", "叙述者给出的犯罪理由是什么？"),
          t("He could not bear the old man's pale blue eye", "他无法忍受老人那只淡蓝色的眼睛"),
          [
            t("The old man had wronged him", "老人曾经冤枉过他"),
            t("He wanted the old man's money", "他想要老人的钱"),
            t("The neighbors had told him to do it", "邻居们叫他这么做"),
          ],
          t(
            "The second paragraph says he had no quarrel with the old man; the only problem was one of the old man's eyes, which he could not bear.",
            "第二段说他和老人并无矛盾；唯一的问题是老人的一只眼睛，他无法忍受。",
          ),
        ),
        ask(
          t("What finally makes the narrator confess?", "最终是什么使叙述者认罪？"),
          t("A sound he believes is the dead man's heart, growing louder", "他认为是死者心跳的声音越来越响"),
          [
            t("The officers find the body under the floor", "警察在地板下发现了尸体"),
            t("A neighbor saw the crime through the window", "一个邻居透过窗户看到了罪行"),
            t("The old man returns as a ghost", "老人化作鬼魂回来了"),
          ],
          t(
            "The third paragraph says he hears a sound he believes is the beating heart, grows sure the officers hear it, and confesses in a frenzy.",
            "第三段说他听到一个自认为是心跳的声音，确信警察也听到了，于是在狂乱中认罪。",
          ),
        ),
      ],
      ["Edgar", "Allan", "Poe's", "Poe", "Tell-Tale", "Heart"],
    ),
    passage(
      "the-keepers-log",
      t("The Keeper's Log", "守塔人的日志"),
      `The following entries were found in the logbook of the lighthouse on Gull Rock, after the supply boat arrived to find the light dark and the keeper gone.

October 3. Fog all day. Lit the lamp at five. My assistant, Pryce, left on the last boat with a fever, so I am alone until the relief keeper comes. I do not mind. I have kept lights for twenty years, and I am not a man who frightens easily.

October 5. Heard footsteps on the stairs again last night. The wind, of course. An old tower makes many sounds. I checked the store room. Nothing there but oil and rope, and the dank smell that never leaves.

October 7. The footsteps came up to the lamp room and stopped outside the door. I opened it. No one. I must sleep more. I have not slept properly since Pryce left, though I cannot say why.

October 8. Saw a man standing on the rocks below at dusk, quite still, looking up at the light. No boat could have brought him, and the tide was high. When I looked again, he was gone. I am writing this so that I will remember it exactly. I am perfectly calm.

October 9. He was on the stairs tonight. Pale, thin, with Pryce's coat. I called to him, and he did not answer. Pryce must have come back. But Pryce left on the boat. I watched it go. Did I watch it go?

October 10. The relief boat is late. I have not lit the lamp. I do not want him to see where I am.

The supply boat's captain added a note below the last entry: Pryce reached the mainland on October 3 and recovered from his fever. No trace of the keeper was ever found.`,
      [ghostWords, gloomWords, madnessWords, unreliable],
      [
        ask(
          t("What clue suggests the keeper is becoming an unreliable narrator?", "什么线索表明守塔人正在成为一个不可靠的叙述者？"),
          t("He insists he is calm while he begins to doubt what he saw", "他坚称自己很平静，同时却开始怀疑自己看到的东西"),
          [
            t("He lights the lamp at five o'clock", "他五点钟点亮了灯"),
            t("He checks the store room for oil and rope", "他在储藏室检查油和绳子"),
            t("He has kept lights for twenty years", "他已经守灯塔二十年了"),
          ],
          t(
            'He writes "I am perfectly calm" and later asks himself "Did I watch it go?", showing that his account can no longer be trusted.',
            "他写道“我非常平静”，后来又问自己“我看着它离开了吗？”，说明他的叙述已经不可信了。",
          ),
        ),
        ask(
          t("What does the captain's note reveal?", "船长的附注揭示了什么？"),
          t(
            "Pryce had really left and recovered, so the figure could not have been him",
            "普赖斯确实已经离开并康复了，所以那个人影不可能是他",
          ),
          [
            t("Pryce had stayed hidden in the lighthouse", "普赖斯一直躲在灯塔里"),
            t("The keeper had sailed to the mainland", "守塔人坐船去了大陆"),
            t("The relief boat had arrived on time", "接替的船准时到达了"),
          ],
          t(
            "The note says Pryce reached the mainland on October 3 and recovered, which confirms that he left and leaves the figure on the stairs unexplained.",
            "附注说普赖斯10月3日抵达大陆并康复了，这证实他确实离开了，而楼梯上的人影仍无法解释。",
          ),
        ),
        ask(
          t("Why does the story use short dated entries?", "这个故事为什么采用简短的带日期的日志形式？"),
          t("They let the reader watch the keeper's fear grow day by day", "它们让读者看着守塔人的恐惧一天天加深"),
          [
            t("They show that the keeper was too busy to write", "它们表明守塔人忙得没时间写字"),
            t("They prove that the story really happened", "它们证明这个故事真实发生过"),
            t("They explain how a lighthouse works", "它们解释了灯塔是如何运作的"),
          ],
          t(
            "Each entry is a little stranger than the last, from the wind to a man on the stairs to a dark lamp, so the form builds dread step by step.",
            "每一篇日志都比上一篇更离奇，从风声到楼梯上的人，再到熄灭的灯，这种形式一步步营造恐惧。",
          ),
        ),
      ],
      ["Gull", "Rock", "October", "Pryce", "Pryce's"],
    ),
    passage(
      "the-house-on-marsh-lane",
      t("The House on Marsh Lane", "沼泽巷的房子"),
      `Everyone in the village said the house at the end of Marsh Lane was haunted, which was exactly why Nadia's family could afford it. Her mother laughed at the stories. Her father said the only ghost in the house was the damp. Nadia, who was thirteen, said nothing and chose the small bedroom at the top of the stairs because it had a window seat.

For the first week, nothing happened except the ordinary noises of an old house: pipes knocking, floorboards creaking, wind whistling under the doors. Then, on the eighth night, Nadia woke to the sound of someone humming in the hall outside her room. It was a simple tune, slow and sad, and it stopped the moment she sat up.

The next night, she heard it again, and this time she opened her door. The hall was empty, but at its far end, where the stairs turned, there was a faint glow, as if someone had just carried a candle around the corner. Nadia felt her skin prickle. She closed the door and did not sleep until dawn.

In the morning, she went to the village library and asked about the house. The librarian, an elderly woman, brought out a folder of old newspapers. In 1891, a girl of thirteen had lived in the house. She had been ill for many months and had spent her days at the window of the small bedroom at the top of the stairs. Her mother had sat with her each night, humming the same old lullaby until she fell asleep. The girl had died in the winter.

That night, Nadia left her door open. When the humming began, she did not hide. She whispered, "Good night." The humming paused, and then went softly down the stairs. It never came back.`,
      [ghostWords, gloomWords, gothic],
      [
        ask(
          t("How does the author build suspense in the second and third paragraphs?", "作者在第二、三段中如何营造悬念？"),
          t(
            "Each night brings a slightly stronger sign, from humming to a glow at the stairs",
            "每天晚上的迹象都更强一些，从哼唱声到楼梯口的光亮",
          ),
          [
            t("By showing the ghost clearly at the start", "在一开始就清楚地展示鬼魂"),
            t("By explaining every noise as the wind", "把每个声音都解释为风声"),
            t("By describing the village library", "通过描写村里的图书馆"),
          ],
          t(
            "The author moves from ordinary noises to humming that stops, then to humming and a glow, so the tension rises step by step.",
            "作者从普通的噪音写到戛然而止的哼唱，再写到哼唱和光亮，使紧张感一步步加强。",
          ),
        ),
        ask(
          t("What does Nadia learn at the library?", "娜迪娅在图书馆了解到了什么？"),
          t(
            "A sick girl once lived in her room, and her mother hummed to her each night",
            "曾有一个生病的女孩住在她的房间，她母亲每晚为她哼歌",
          ),
          [
            t("The house had been built in 1891", "这座房子建于1891年"),
            t("The librarian had once lived in the house", "图书管理员曾经住在这座房子里"),
            t("The noises were caused by the pipes", "那些声音是由水管引起的"),
          ],
          t(
            "The fourth paragraph says a sick girl spent her days in the same bedroom and her mother hummed a lullaby to her each night until she died.",
            "第四段说一个生病的女孩在同一间卧室里度日，她母亲每晚都为她哼摇篮曲，直到她去世。",
          ),
        ),
        ask(
          t("How does this story differ from a typical tale of horror?", "这个故事与典型的恐怖故事有什么不同？"),
          t("The haunting turns out to be sad and gentle, not threatening", "这场闹鬼原来是悲伤而温柔的，而不是可怕的"),
          [
            t("It has no old house in it", "故事里没有老房子"),
            t("It takes place in a modern city", "故事发生在现代城市"),
            t("The ghost harms the family", "鬼魂伤害了这家人"),
          ],
          t(
            "The story uses a haunted house and strange sounds, but the ghost is a mother's lullaby, and Nadia's kindness lets it rest.",
            "故事运用了鬼屋和怪声，但鬼魂是一位母亲的摇篮曲，而娜迪娅的善意让它得以安息。",
          ),
        ),
      ],
      ["Marsh", "Lane", "Nadia's", "Nadia"],
    ),
    passage(
      "the-portrait-in-the-hall",
      t("The Portrait in the Hall", "大厅里的肖像"),
      `When my uncle died, he left me Blackwood Hall, a gray stone mansion on a hill above the sea, and a letter that said only this: "Whatever you do, do not move the portrait in the hall."

I arrived on a wet November evening. The housekeeper, Mrs. Crane, a gaunt woman with an ashen face, met me at the door with a lamp and led me through rooms of covered furniture to the great hall. There, above the cold fireplace, hung the portrait. It showed a man in a high black collar, my great-great-grandfather, according to the plate on the frame. His eyes were painted so skillfully that they seemed to follow me as I crossed the room. I told myself that all good portraits do that.

"Your uncle never sat in this room," said Mrs. Crane. "Not in thirty years."

That night, a storm beat against the windows, and I could not sleep. At two in the morning, I went down to the hall. The lamp threw shadows across the floor, and the painted face looked different, thinner, almost hungry. I noticed something I had not seen before. The frame hung slightly crooked, and behind it, on the wallpaper, was a dark rectangle where the color had not faded. The portrait had been moved before, and recently.

I reached out to straighten it. Then I remembered the letter and stopped, my hand an inch from the frame. Behind me, I heard Mrs. Crane's voice, very soft.

"He moved it once too," she said. "The night before he died."

I did not touch it. In the morning, I asked the lawyer to sell the house. I have never been back, and I have never told anyone what I heard behind the portrait as I walked away: three slow knocks, from the other side of the wall.`,
      [gloomWords, madnessWords, ghostWords, gothic],
      [
        ask(
          t("Which Gothic elements does the story use?", "这个故事运用了哪些哥特元素？"),
          t("An old mansion, a stormy night and a secret from the past", "一座古老的宅邸、一个暴风雨之夜和一个来自过去的秘密"),
          [
            t("A crowded city, bright sunshine and a happy family", "拥挤的城市、明媚的阳光和幸福的家庭"),
            t("A space station, robots and a distant planet", "空间站、机器人和遥远的星球"),
            t("A school, a sports match and a new friend", "学校、体育比赛和新朋友"),
          ],
          t(
            "Blackwood Hall is a stone mansion on a hill, the narrator goes down on a stormy night, and the portrait hides a secret linked to the family's past.",
            "布莱克伍德庄园是山上的一座石头宅邸，叙述者在暴风雨之夜下楼，而肖像隐藏着与家族过去有关的秘密。",
          ),
        ),
        ask(
          t(
            "What does the narrator notice that suggests the portrait had been moved recently?",
            "叙述者注意到什么，说明肖像最近被移动过？",
          ),
          t("A dark unfaded rectangle on the wallpaper behind the crooked frame", "歪斜的画框后面墙纸上有一块没有褪色的深色长方形"),
          [
            t("The eyes in the painting seemed to follow him", "画中的眼睛似乎在跟着他"),
            t("The fireplace was cold", "壁炉是冷的"),
            t("The furniture was covered", "家具被罩着"),
          ],
          t(
            "The fourth paragraph says the frame hung crooked and behind it was a dark rectangle where the color had not faded, showing it had been moved.",
            "第四段说画框挂歪了，后面有一块颜色没有褪去的深色长方形，表明它被移动过。",
          ),
        ),
        ask(
          t("Why does the author end the story with three knocks?", "作者为什么用三声敲击结束故事？"),
          t("To leave a final mystery that the reader cannot explain", "留下一个读者无法解释的最终谜团"),
          [
            t("To show that Mrs. Crane was playing a trick", "表明克雷恩太太在恶作剧"),
            t("To explain how the uncle died", "解释叔叔是怎么死的"),
            t("To show that the house was sold", "表明房子被卖掉了"),
          ],
          t(
            "The knocks come from behind the wall after the narrator has refused to move the portrait, so the story ends on a chilling question rather than an answer.",
            "敲击声在叙述者拒绝移动肖像后从墙后传来，所以故事以一个令人发寒的问题而不是答案结尾。",
          ),
        ),
      ],
      ["Blackwood", "Hall", "November", "Mrs", "Crane", "Crane's"],
    ),
    passage(
      "why-we-love-to-be-scared",
      t("Why We Love to Be Scared", "我们为什么喜欢被吓"),
      `Every autumn, millions of people pay money to walk through haunted houses where actors leap out of the dark, and every weekend, cinemas fill with audiences watching horror films. It seems strange. Fear is an unpleasant feeling that evolved to protect us from danger. Why would anyone seek it out?

Scientists who study fear have offered several explanations. When we are frightened, the body prepares to fight or run. The heart beats faster, breathing quickens and the body releases chemicals such as adrenaline. These changes make us feel intensely alert and alive. When we know that we are actually safe, because the monster is on a screen or the ghost is an actor, we can enjoy the rush without the real danger. Afterward, many people report feeling relieved, calm and even happy.

A researcher named Margee Kerr spent years studying people in a haunted attraction in Pittsburgh. She found that visitors who went through it reported feeling less anxious afterward and more confident, as though they had faced something difficult and survived. Being scared together also seems to bring people closer, which may be one reason why friends go to horror films in groups.

Other researchers suggest that frightening stories are a kind of practice. By imagining dangerous situations, we may learn how to recognize threats and respond to them, without having to experience them in real life. A study in Denmark found that people who were fans of horror films seemed to cope better with the anxiety of the early pandemic in 2020.

Not everyone enjoys being scared, of course. For some people, fear is simply fear. But for many, a good scare in a safe place is one of the strangest pleasures there is.`,
      [gloomWords, ghostWords, madnessWords],
      [
        ask(
          t("According to the passage, why can people enjoy fear in a haunted house?", "根据文章，为什么人们在鬼屋里能享受恐惧？"),
          t("They feel the body's rush of alertness while knowing they are safe", "他们在知道自己安全的同时感受到身体的警觉冲动"),
          [
            t("Haunted houses contain no real actors", "鬼屋里没有真正的演员"),
            t("Fear does not change the body at all", "恐惧根本不会改变身体"),
            t("They do not know that the ghosts are actors", "他们不知道鬼是演员扮的"),
          ],
          t(
            "The second paragraph says that when we know we are safe, we can enjoy the rush of a frightened body without the real danger.",
            "第二段说当我们知道自己是安全的，就能享受身体受惊时的冲动而没有真正的危险。",
          ),
        ),
        ask(
          t("What did Margee Kerr find about visitors to the haunted attraction?", "玛吉·克尔发现鬼屋游客有什么变化？"),
          t("They felt less anxious and more confident afterward", "他们事后感到焦虑减轻、信心增强"),
          [
            t("They refused to visit again", "他们拒绝再来"),
            t("They could not sleep for a week", "他们一个星期都睡不着"),
            t("They preferred to go through it alone", "他们更喜欢独自穿过鬼屋"),
          ],
          t(
            "The third paragraph says visitors reported feeling less anxious and more confident, as though they had faced something difficult and survived.",
            "第三段说游客们表示焦虑减轻、信心增强，仿佛他们面对了困难并挺了过来。",
          ),
        ),
        ask(
          t("What idea do the researchers in the fourth paragraph propose?", "第四段中的研究者提出了什么观点？"),
          t("Frightening stories may let us practice facing danger safely", "恐怖故事可能让我们安全地练习应对危险"),
          [
            t("Horror films cause pandemics", "恐怖电影会引发流行病"),
            t("Only people in Denmark enjoy horror", "只有丹麦人喜欢恐怖片"),
            t("Fear is always harmful to health", "恐惧总是有害健康"),
          ],
          t(
            "The fourth paragraph suggests that by imagining dangerous situations, we may learn to recognize and respond to threats without facing them for real.",
            "第四段提出，通过想象危险的情境，我们也许能学会识别和应对威胁，而不必真正经历它们。",
          ),
        ),
      ],
      ["Margee", "Kerr", "Pittsburgh", "Denmark"],
    ),
    passage(
      "the-last-letter-from-greythorn",
      t("The Last Letter from Greythorn", "来自格雷索恩的最后一封信"),
      `Dear Thomas,

You asked me to write and tell you how I am settling in at Greythorn. I am well, very well, whatever Dr. Ellis says. The house is quiet, the garden is full of roses, and I have the whole east wing to myself. The servants are pleasant, though they whisper when they think I cannot hear. I have caught them watching me through the keyhole more than once.

You will remember that I came here to rest after my illness. The doctor believes that I need peace and no excitement. He has taken away my books and my writing paper, so I am writing this on the backs of old letters that I found in a drawer. Do not tell him. He would say it is bad for my nerves.

I must tell you about the wallpaper in my room. It is a pale yellow pattern of twisting vines, and at night, when the moon shines on it, I can see faces in it. Not drawn faces, you understand. Real ones, pressing out from behind the vines, as if they wanted to come into the room. Last night one of them whispered my name. I am not imagining it. I have counted them carefully, and there are eleven.

Dr. Ellis says that I am confusing my dreams with what is real, and the servants nod when he says it. But why, then, do they keep the door locked at night? Why do they never let me go into the village? You see, Thomas, they know about the faces too, and they are afraid of what I might say.

Please come soon. Bring a lamp, and come at night, and I will show you. Do not let them tell you that I am ill.

Your loving sister,
Clara`,
      [madnessWords, gloomWords, unreliable, gothic],
      [
        ask(
          t("What details suggest that Clara may be an unreliable narrator?", "哪些细节表明克拉拉可能是一个不可靠的叙述者？"),
          t(
            "She sees faces in the wallpaper, believes everyone is plotting, and insists she is well",
            "她看见墙纸里有脸，认为所有人都在密谋，还坚称自己很好",
          ),
          [
            t("She describes the roses in the garden", "她描写了花园里的玫瑰"),
            t("She writes to her brother Thomas", "她写信给哥哥托马斯"),
            t("She came to Greythorn after an illness", "她生病后来到格雷索恩"),
          ],
          t(
            "Her certainty about the whispering faces and her belief that the doctor and servants conspire against her give the reader reason to doubt her account.",
            "她坚信墙纸里的脸会低语，又相信医生和仆人在密谋害她，这让读者有理由怀疑她的叙述。",
          ),
        ),
        ask(
          t("How might the reader explain the locked door differently from Clara?", "读者可能会如何以不同于克拉拉的方式解释那扇锁着的门？"),
          t("The doctor and servants may be keeping a sick patient safe", "医生和仆人可能是在保护一个生病的病人"),
          [
            t("The servants are hiding the faces from the village", "仆人们在向村民隐瞒那些脸"),
            t("Thomas asked them to lock it", "托马斯要求他们锁上门"),
            t("The door was broken and could not open", "门坏了打不开"),
          ],
          t(
            "Clara thinks the door is locked because the servants fear what she knows, but the details also fit a patient who is being watched for her own safety.",
            "克拉拉认为门被锁是因为仆人害怕她知道的事，但这些细节同样符合一个为了自身安全而受到看护的病人。",
          ),
        ),
        ask(
          t("Why does the author tell this story as a letter?", "作者为什么用书信的形式讲这个故事？"),
          t("The reader sees only Clara's view and must judge it for themselves", "读者只能看到克拉拉的视角，必须自己作出判断"),
          [
            t("Letters are always more truthful than stories", "书信总是比故事更真实"),
            t("It lets the doctor explain what is happening", "它让医生解释发生了什么"),
            t("It shows that Clara is no longer ill", "它表明克拉拉不再生病了"),
          ],
          t(
            "A letter gives only the writer's words, with no narrator to correct them, so the reader has to weigh Clara's account against the clues she lets slip.",
            "书信只有写信人的话，没有叙述者来纠正，所以读者必须把克拉拉的叙述和她无意中透露的线索进行比较。",
          ),
        ),
      ],
      ["Thomas", "Greythorn", "Dr", "Ellis", "Clara"],
    ),
  ],
};
