import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

const characterization = { topic: "characterization", weight: 0.3 } as const;
const allusion = { topic: "allusion", weight: 0.3 } as const;
const paradox = { topic: "paradox-and-oxymoron", weight: 0.3 } as const;
const symbolism = { topic: "symbolism", weight: 0.2 } as const;
const irony = { topic: "irony", weight: 0.2 } as const;
const narrator = { topic: "narrative-point-of-view", weight: 0.2 } as const;
const timeOrder = { topic: "foreshadowing-and-flashback", weight: 0.2 } as const;

/** theWritersCraft is a reading unit of grades 9 to 12 of original short fiction, whose questions practice reading how a story is made. */
export const theWritersCraft: ReadingUnitDef = {
  id: "the-writers-craft",
  title: t("The Writer's Craft", "作家的技艺"),
  passages: [
    {
      id: "the-man-who-fixed-clocks",
      title: t("The Man Who Fixed Clocks", "修钟的人"),
      body: `Mr. Ortiz had fixed clocks in the same small shop for thirty years. He never hurried. When a customer asked how long a repair would take, he would look at the clock over his glasses, as if asking it, and then name a day. He was never wrong.

He spoke very little. Children who came in with their parents thought he was strict, until they noticed the jar of lemon candies on the counter, which was always full and which he never mentioned.

On the day his shop closed, people from all over town came to say goodbye. A woman brought the clock her grandfather had carried across an ocean. A boy brought a broken watch he had found in the street and asked if it could be saved.

Mr. Ortiz opened the back of the watch, looked at it for a long time, and closed it again. Then he took the smallest tool from his drawer, wrapped it in a cloth, and placed it in the boy's hand.

"You fix it," he said. "Take as long as it needs."`,
      topics: [characterization],
      glossed: ["repair", "candies", "drawer", "ocean"],
      xp: 5,
      questions: [
        {
          prompt: t("How does the writer show that Mr. Ortiz is kind?", "作者怎样表现奥尔蒂斯先生的善良？"),
          right: t(
            "Through his actions, such as the candies he keeps full and the tool he gives the boy",
            "通过他的行动，比如总是装满的糖罐和他送给男孩的工具",
          ),
          wrong: [
            t("By stating directly that he is the kindest man in town", "直接说他是镇上最善良的人"),
            t("Through long speeches in which he explains his feelings", "通过他解释自己感受的长篇讲话"),
            t("By describing what other characters say about him", "通过描写其他人物对他的评价"),
          ],
          solution: t(
            'The story never says he is kind. The jar he keeps full but "never mentioned" and the gift of his smallest tool show it. That is indirect characterization.',
            '故事从没说他善良。他总装满却 "never mentioned" 的糖罐，以及送出的最小的工具，把这一点表现了出来。这是间接人物塑造。',
          ),
        },
        {
          prompt: t("Why do the children first think Mr. Ortiz is strict?", "孩子们为什么起初觉得奥尔蒂斯先生很严厉？"),
          right: t("Because he speaks very little", "因为他话很少"),
          wrong: [
            t("Because he shouts at customers", "因为他对顾客大喊"),
            t("Because he will not let them touch the candies", "因为他不让他们碰糖果"),
            t("Because he is always wrong about the time", "因为他总是把时间弄错"),
          ],
          solution: t(
            '"He spoke very little" comes just before the children think he is strict. His quiet manner hides the kindness they notice later.',
            '"He spoke very little" 紧接在孩子们觉得他严厉之前。他沉默的样子掩盖了他们后来才注意到的善意。',
          ),
        },
        {
          prompt: t("What does the ending suggest about Mr. Ortiz?", "结尾暗示了奥尔蒂斯先生的什么？"),
          right: t("He wants to pass his patient craft on to someone young", "他想把自己耐心的手艺传给年轻人"),
          wrong: [
            t("He no longer knows how to fix watches", "他已经不会修手表了"),
            t("He is angry that the boy broke the watch", "他生气男孩弄坏了手表"),
            t("He wants the boy to work in his shop", "他想让男孩在他的店里工作"),
          ],
          solution: t(
            'On the day the shop closes, he hands over his tool and tells the boy to "take as long as it needs," the same patience he showed for thirty years.',
            '在店铺关门的那天，他交出工具，告诉男孩 "take as long as it needs"，这正是他三十年来所表现的耐心。',
          ),
        },
      ],
    },
    {
      id: "a-gift-of-wings",
      title: t("A Gift of Wings", "翅膀的礼物"),
      body: `My brother Leo built his first glider when he was twelve, from sticks, paper and glue. It flew for three seconds and broke on the garden wall. He built another.

By sixteen, his gliders flew across the whole field behind our house. By eighteen, he talked about nothing but the sky. He wanted to fly higher than anyone in our family had ever dreamed.

Our father, who had worked in the same mill all his life, watched him with a worried face. "Remember Icarus," he would say, only half joking. "Too close to the sun, and the wax melts."

Leo would laugh. "Then I'll use better glue."

The year he left for flight school, he gave me his oldest glider, the one with the patched wing. I hung it above my bed.

He did not fall. He became a pilot, and later he taught others to fly. But every time he came home, our father still said, "Remember Icarus," and Leo still laughed, and I began to understand that the warning had never really been about flying. It was a father's way of saying he was afraid of losing his son.`,
      topics: [allusion, characterization],
      glossed: ["glider", "gliders", "glue", "mill", "wax", "melts", "patched", "pilot"],
      xp: 5,
      questions: [
        {
          prompt: t('What does the father mean by "Remember Icarus"?', '父亲说 "Remember Icarus" 是什么意思？'),
          right: t("Be careful not to reach too high, or you may fall", "小心别追求得太高，否则可能会摔下来"),
          wrong: [
            t("Remember to visit a friend named Icarus", "记得去看一个叫伊卡洛斯的朋友"),
            t("Use better glue on your gliders", "给滑翔机用更好的胶水"),
            t("Work in the mill as your father did", "像父亲一样在磨坊工作"),
          ],
          solution: t(
            'It is an allusion to the Greek myth of Icarus, who flew too close to the sun on wings of wax and fell. The father adds "Too close to the sun, and the wax melts" to make the warning clear.',
            '这是在引用希腊神话中的伊卡洛斯：他用蜡做的翅膀飞得离太阳太近，结果坠落。父亲补充 "Too close to the sun, and the wax melts"，让警告更明白。',
          ),
        },
        {
          prompt: t(
            "What does Leo's answer \"Then I'll use better glue\" show about him?",
            '利奥的回答 "Then I\'ll use better glue" 表现了他什么样的性格？',
          ),
          right: t("He is confident and turns the warning into a joke", "他很自信，把警告变成了玩笑"),
          wrong: [
            t("He is afraid of flying", "他害怕飞行"),
            t("He does not understand the story of Icarus", "他不明白伊卡洛斯的故事"),
            t("He is angry at his father", "他生父亲的气"),
          ],
          solution: t(
            "Leo laughs and answers the myth with a practical fix. He knows the story, but he trusts his own skill, which fits a boy who built glider after glider.",
            "利奥笑着用一个实际的办法回应这个神话。他知道这个故事，但相信自己的本事，这符合一个造了一架又一架滑翔机的男孩。",
          ),
        },
        {
          prompt: t("What does the narrator come to understand at the end?", "叙述者最后明白了什么？"),
          right: t("The warning was the father's way of saying he feared losing his son", "这个警告是父亲表达害怕失去儿子的方式"),
          wrong: [
            t("Leo should never have become a pilot", "利奥本不该当飞行员"),
            t("The story of Icarus is about glue", "伊卡洛斯的故事讲的是胶水"),
            t("The father wanted to fly himself", "父亲自己想飞"),
          ],
          solution: t(
            'The last sentence says the warning "had never really been about flying." The allusion carried a feeling the father could not say directly.',
            '最后一句说这个警告 "had never really been about flying"。这个典故承载了父亲无法直接说出的感情。',
          ),
        },
      ],
    },
    {
      id: "the-loudest-silence",
      title: t("The Loudest Silence", "最响的沉默"),
      body: `When Grandma Rose died, the house filled with people. They brought soup and flowers and stories. They talked in the kitchen, in the hall and on the stairs, and the house that had always been so quiet became as busy as a train station.

But Mira, who was fourteen, heard only one thing: the silence where her grandmother's voice should have been.

Grandma Rose had hummed. She hummed while she cooked, while she read, while she watered her plants. Mira had never noticed it until it stopped. Now, in the middle of all the talking, the missing sound was the loudest thing in the house.

That night, after everyone had gone, Mira sat in the kitchen in the dark. She felt a sweet sorrow, a sadness mixed with something warm, as she remembered the songs she had heard every day of her life without listening.

Then, very softly, she began to hum one of them. She did not know all the notes. It did not matter. The kitchen was a little less empty.

Sometimes, she thought, you have to lose something to hear it.`,
      topics: [paradox],
      glossed: ["hummed", "hum", "sorrow"],
      xp: 5,
      questions: [
        {
          prompt: t("Which phrase is an oxymoron?", "哪个短语是矛盾修饰？"),
          right: t("A sweet sorrow", "甜蜜的悲伤（a sweet sorrow）"),
          wrong: [
            t("As busy as a train station", "像火车站一样忙碌（as busy as a train station）"),
            t("Soup and flowers and stories", "汤、鲜花和故事（soup and flowers and stories）"),
            t("Very softly", "非常轻柔地（very softly）"),
          ],
          solution: t(
            '"Sweet" and "sorrow" seem to clash, yet together they name Mira\'s feeling exactly: sadness mixed with warmth. Two opposite words placed side by side make an oxymoron.',
            '"Sweet" 和 "sorrow" 看似矛盾，合在一起却准确地说出了米拉的感受：悲伤中带着温暖。把两个相反的词并置，就构成矛盾修饰。',
          ),
        },
        {
          prompt: t('Why is the silence called "the loudest thing in the house"?', '为什么沉默被称为 "the loudest thing in the house"？'),
          right: t(
            "The missing humming is what Mira notices most, more than all the talking",
            "消失的哼唱声是米拉最强烈感受到的，胜过所有的谈话声",
          ),
          wrong: [
            t("The house was actually silent that day", "那天房子里实际上很安静"),
            t("The visitors were shouting", "来客们在大喊"),
            t("Mira could not hear anything because she was sick", "米拉生病了，什么也听不见"),
          ],
          solution: t(
            "It is a paradox: silence cannot be loud, but the absence of Grandma Rose's voice fills Mira's attention more than any sound. The contradiction points to a deeper truth about grief.",
            "这是一个悖论：沉默不可能响亮，但罗斯奶奶声音的缺席比任何声音都更占据米拉的心。这种矛盾指向关于悲伤的更深的真理。",
          ),
        },
        {
          prompt: t(
            'What does the last line, "you have to lose something to hear it," mean?',
            '最后一句 "you have to lose something to hear it" 是什么意思？',
          ),
          right: t("We often notice the value of something only after it is gone", "我们往往在失去之后才意识到某样东西的价值"),
          wrong: [
            t("Mira lost her hearing", "米拉失去了听力"),
            t("Mira should stop humming", "米拉应该别再哼唱了"),
            t("Grandma Rose lost her voice", "罗斯奶奶失声了"),
          ],
          solution: t(
            'Mira "had never noticed" the humming "until it stopped." The line turns that experience into a paradox that states the story\'s theme.',
            '米拉 "had never noticed" 那哼唱声，"until it stopped"。这一句把这段经历变成一个悖论，点明了故事的主题。',
          ),
        },
      ],
    },
    {
      id: "the-key-on-the-string",
      title: t("The Key on the String", "绳上的钥匙"),
      body: `From the age of eight, Ana wore the key to the apartment on a string around her neck. Her mother worked late, and Ana let herself in after school, made her own snack and did her homework at the kitchen table, alone.

The key was heavy and cold against her skin. Sometimes, on the walk home, she held it in her fist so tightly that it left a mark on her palm. Other children's parents waited for them at the school gate. Ana had the key.

At first, she hated it. It meant an empty apartment, a quiet kitchen, a long wait until she heard her mother's steps on the stairs.

But as the years passed, the key began to mean something else. It meant that her mother trusted her. It meant that she could take care of herself. By twelve, she was cooking dinner for both of them.

On the day Ana left for college, her mother asked for the key back. Ana took the string from her neck, looked at the key for a moment, and shook her head.

"I'll keep it," she said. "So I can always let myself in."`,
      topics: [symbolism, characterization],
      glossed: ["apartment", "snack", "fist", "palm"],
      xp: 5,
      questions: [
        {
          prompt: t("What does the key stand for at the start of the story?", "故事开头钥匙象征着什么？"),
          right: t("Loneliness and an empty home", "孤独和空荡荡的家"),
          wrong: [
            t("Ana's love of cooking", "安娜对烹饪的热爱"),
            t("Ana's success at college", "安娜在大学的成功"),
            t("Her mother's anger", "她母亲的愤怒"),
          ],
          solution: t(
            'At first the key "meant an empty apartment, a quiet kitchen, a long wait." Other children had parents at the gate; "Ana had the key."',
            '起初钥匙 "meant an empty apartment, a quiet kitchen, a long wait"。别的孩子有父母在校门口等，"Ana had the key"。',
          ),
        },
        {
          prompt: t("How does the meaning of the key change?", "钥匙的含义怎样变化？"),
          right: t("It comes to stand for trust and independence", "它变成了信任和独立的象征"),
          wrong: [
            t("It comes to stand for fear of the dark", "它变成了怕黑的象征"),
            t("It stops meaning anything at all", "它不再有任何意义"),
            t("It comes to stand for Ana's school", "它变成了安娜学校的象征"),
          ],
          solution: t(
            "\"As the years passed, the key began to mean something else\": her mother's trust and Ana's ability to take care of herself. A symbol can change as a character grows.",
            '"As the years passed, the key began to mean something else"：母亲的信任，以及安娜照顾自己的能力。象征可以随着人物的成长而改变。',
          ),
        },
        {
          prompt: t("Why does Ana keep the key when she leaves?", "安娜离开时为什么留下钥匙？"),
          right: t("It has become a sign that she will always belong in her mother's home", "它已成为她永远属于母亲之家的标志"),
          wrong: [
            t("She forgot to give it back", "她忘了还"),
            t("She plans to move back the next week", "她打算下周搬回来"),
            t("She is angry at her mother", "她生母亲的气"),
          ],
          solution: t(
            '"So I can always let myself in" changes the words of her lonely childhood into a promise of belonging. The key now carries home with her.',
            '"So I can always let myself in" 把她孤独童年里的话变成了归属的承诺。如今钥匙让她把家带在身边。',
          ),
        },
      ],
    },
    {
      id: "the-perfect-day",
      title: t("The Perfect Day", "完美的一天"),
      body: `Daniel had planned the picnic for weeks. He wanted everything to be perfect for his parents' twentieth anniversary.

He checked the weather every morning. Sunny, it said, sunny and warm. He booked a spot by the lake. He made sandwiches the night before, packed a cake in a box and ironed a white cloth for the grass.

"Nothing can go wrong," he told his sister on the morning of the picnic. "I've thought of everything."

They had been at the lake for ten minutes when the first drops fell. In five more, the rain was pouring down. The cloth was soaked, the sandwiches were soggy, and the cake slid sideways in its box.

Daniel stood in the rain, holding a ruined sandwich, and felt like crying.

Then he heard laughter. His parents were dancing on the wet grass, the way they had danced at their wedding, which, his mother called out, had also been ruined by rain.

"It's perfect!" she shouted. "Just like the first time!"

Daniel looked at the sky, at his laughing parents and at the cake, and began to laugh too.`,
      topics: [irony],
      glossed: ["picnic", "anniversary", "ironed", "soaked", "soggy", "sideways"],
      xp: 5,
      questions: [
        {
          prompt: t(
            'What kind of irony is it when Daniel says "Nothing can go wrong" just before the rain?',
            '丹尼尔在下雨之前说 "Nothing can go wrong"，这是哪种反讽？',
          ),
          right: t("Situational irony: the opposite of what he expects happens", "情境反讽：发生了与他预期相反的事"),
          wrong: [
            t("Verbal irony: he says the opposite of what he means", "言语反讽：他说的与他心里想的相反"),
            t("Dramatic irony: the reader knows a secret Daniel does not", "戏剧反讽：读者知道丹尼尔不知道的秘密"),
            t("It is not irony at all", "这根本不是反讽"),
          ],
          solution: t(
            "Daniel means what he says, so it is not verbal irony. His careful plan meets the very rain he checked for, and things go wrong right after he says they cannot: situational irony.",
            "丹尼尔说的是真心话，所以不是言语反讽。他精心的计划恰恰遇上了他反复查过的雨，就在他说不会出错之后一切出了错：这是情境反讽。",
          ),
        },
        {
          prompt: t('Why does his mother call the ruined picnic "perfect"?', '母亲为什么说这场被毁的野餐 "perfect"？'),
          right: t("The rain reminds her of their wedding, which was also rained on", "这场雨让她想起同样遇雨的婚礼"),
          wrong: [
            t("She is being sarcastic and is actually angry", "她在讽刺，其实很生气"),
            t("She did not notice the rain", "她没注意到下雨"),
            t("She wanted Daniel to cancel the picnic", "她希望丹尼尔取消野餐"),
          ],
          solution: t(
            'She calls out that the wedding "had also been ruined by rain" and adds "Just like the first time!" The rain makes the day perfect in a way Daniel\'s plan could not.',
            '她喊道婚礼 "had also been ruined by rain"，又补充说 "Just like the first time!"。这场雨以丹尼尔的计划做不到的方式让这一天变得完美。',
          ),
        },
        {
          prompt: t("What does Daniel learn by the end?", "丹尼尔最后明白了什么？"),
          right: t("A day can be perfect even when the plan fails", "即使计划失败，一天也可以是完美的"),
          wrong: [
            t("He should always check the weather twice", "他应该每次都查两遍天气"),
            t("Picnics are a bad idea", "野餐是个坏主意"),
            t("His parents do not like cake", "他父母不喜欢蛋糕"),
          ],
          solution: t(
            "He moves from almost crying to laughing with his parents. The irony of the story is that the ruined plan gives them the day they most wanted.",
            "他从几乎哭出来变成和父母一起大笑。这个故事的反讽在于：被毁的计划反而给了他们最想要的一天。",
          ),
        },
      ],
    },
    {
      id: "what-the-neighbor-saw",
      title: t("What the Neighbor Saw", "邻居看到的"),
      body: `I have lived across the street from the Parks for eleven years, so I know a thing or two about that family.

Every Saturday morning, the boy, Sam, comes out to wash his father's car. He washes it slowly, very slowly, as if he would rather be anywhere else. Then his father comes out and points at a spot he has missed, and Sam washes it again. Anyone can see the boy is miserable. If you ask me, that father is far too hard on him.

Last Saturday, I happened to be watering my roses when I heard them talking. I could not catch every word, but I heard the father say, "Same time next week?" and the boy say, "Same time."

Then, and I am not making this up, they both laughed, and the father put his arm around Sam's shoulders, and they went inside together.

Well. I suppose they were laughing at some joke. Families can be strange. But I still say that boy is miserable, and I will keep an eye on them.`,
      topics: [narrator, irony],
      glossed: ["roses", "shoulders"],
      xp: 5,
      questions: [
        {
          prompt: t("What point of view is the story told from?", "这个故事是从什么视角讲述的？"),
          right: t("First person, by a neighbor who watches the family", "第一人称，由一位观察这家人的邻居讲述"),
          wrong: [
            t("First person, by Sam", "第一人称，由萨姆讲述"),
            t("Third-person omniscient, knowing every character's thoughts", "第三人称全知，知道每个人物的想法"),
            t('Second person, speaking to the reader as "you"', '第二人称，把读者称作 "you"'),
          ],
          solution: t(
            'The narrator says "I have lived across the street" and sees the family only from outside. Sam\'s thoughts are never told; the neighbor guesses at them.',
            '叙述者说 "I have lived across the street"，只能从外面看到这家人。萨姆的想法从未被讲出来；邻居只是在猜测。',
          ),
        },
        {
          prompt: t("Why is the narrator unreliable?", "为什么这位叙述者不可靠？"),
          right: t(
            "She ignores what she sees, the laughing and the hug, to keep her own opinion",
            "她无视自己看到的笑声和拥抱，坚持自己的看法",
          ),
          wrong: [
            t("She does not live near the family", "她不住在这家人附近"),
            t("She admits she is wrong at the end", "她最后承认自己错了"),
            t("She knows exactly what Sam is thinking", "她确切知道萨姆在想什么"),
          ],
          solution: t(
            'The evidence she reports, "Same time next week?", the laughter and the arm around Sam, suggests a warm ritual. Yet she says "I still say that boy is miserable." Her judgment does not fit her own facts.',
            '她讲述的证据，"Same time next week?"、笑声和搂着萨姆的手臂，都暗示这是一个温馨的惯例。但她说 "I still say that boy is miserable"。她的判断与她自己说的事实不符。',
          ),
        },
        {
          prompt: t("What does the reader understand that the narrator does not?", "读者明白了哪些叙述者不明白的事？"),
          right: t("Sam and his father enjoy their Saturday car wash together", "萨姆和父亲很享受他们周六一起洗车的时光"),
          wrong: [
            t("The father is cruel to Sam", "父亲对萨姆很残忍"),
            t("Sam wants to move away", "萨姆想搬走"),
            t("The narrator's roses are dying", "叙述者的玫瑰快死了"),
          ],
          solution: t(
            "The gap between what the narrator sees and what she concludes lets the reader see the truth she misses. That gap creates dramatic irony.",
            "叙述者所见与她的结论之间的落差，让读者看到了她错过的真相。这种落差造成了戏剧反讽。",
          ),
        },
      ],
    },
    {
      id: "the-letter-in-the-drawer",
      title: t("The Letter in the Drawer", "抽屉里的信"),
      body: `The letter was at the bottom of the drawer, under old bills and a broken watch. Nora almost threw it away with the rest. Then she saw her own name on the envelope, in her father's careful writing.

She sat down on the floor of his empty study and opened it.

Twenty years earlier, on the night before her first day of school, Nora had refused to sleep. She was six, and she was sure the other children would not like her. Her father had sat on the edge of her bed until very late, telling her stories about his own first day, when he had cried so loudly that the teacher sent for his mother.

"Everyone is afraid of something new," he had said. "Being afraid just means it matters."

She had gone to school the next morning holding his hand, and she had not cried.

Now, in the letter, he had written the same words. "Everyone is afraid of something new. Being afraid just means it matters." Below them he had added: "For the day you need this."

Nora folded the letter and held it for a long time. Tomorrow she would start her new job, in a new city, alone.`,
      topics: [timeOrder],
      glossed: ["envelope", "study"],
      xp: 5,
      questions: [
        {
          prompt: t("What technique does the writer use in the third to fifth paragraphs?", "作者在第三到第五段运用了什么手法？"),
          right: t("Flashback to Nora's first day of school", "倒叙到诺拉第一天上学的情景"),
          wrong: [
            t("Foreshadowing of an accident", "预示一场事故"),
            t("A shift to second-person point of view", "转换为第二人称视角"),
            t("A description of Nora's new job", "描写诺拉的新工作"),
          ],
          solution: t(
            '"Twenty years earlier" takes the story back in time to a scene from Nora\'s childhood, then the story returns to the present with "Now, in the letter." That is flashback.',
            '"Twenty years earlier" 把故事带回诺拉童年的一个场景，然后故事以 "Now, in the letter" 回到现在。这就是倒叙。',
          ),
        },
        {
          prompt: t("Why does the flashback matter to the ending?", "这段倒叙为什么对结尾很重要？"),
          right: t("It lets the reader understand why the father's words comfort Nora now", "它让读者明白父亲的话为何此刻能安慰诺拉"),
          wrong: [
            t("It explains why Nora's father is angry", "它解释了诺拉的父亲为什么生气"),
            t("It shows that Nora never went to school", "它表明诺拉从没上过学"),
            t("It tells the reader where the new job is", "它告诉读者新工作在哪里"),
          ],
          solution: t(
            'Because the reader has seen the first time he said "Being afraid just means it matters," the same words in the letter carry the weight of that memory as Nora faces another first day.',
            '因为读者已经看到他第一次说 "Being afraid just means it matters" 的情景，信中同样的话在诺拉面对又一个第一天时，承载着那段回忆的分量。',
          ),
        },
        {
          prompt: t('What does "For the day you need this" suggest about the father?', '"For the day you need this" 暗示了父亲的什么？'),
          right: t(
            "He knew Nora would face new fears and wanted to help even when he was gone",
            "他知道诺拉会面对新的恐惧，想在自己不在时仍能帮助她",
          ),
          wrong: [
            t("He forgot that he had already told her", "他忘了自己已经对她说过"),
            t("He wanted her to throw the letter away", "他希望她把信扔掉"),
            t("He did not believe his own words", "他自己都不相信自己的话"),
          ],
          solution: t(
            'His study is "empty," and he left the letter for a future moment. He prepared comfort for a day he could not be there for.',
            '他的书房 "empty"，他把信留给未来的某个时刻。他为自己无法陪伴的那一天准备了安慰。',
          ),
        },
      ],
    },
    {
      id: "the-crack-in-the-ceiling",
      title: t("The Crack in the Ceiling", "天花板上的裂缝"),
      body: `The crack in the ceiling of the old school gym first appeared in September. It was thin, no longer than a pencil, and no one paid it any attention except Jonah, who noticed it every morning while the coach shouted at them to run faster.

By October, the crack had grown to the length of his arm. A small piece of paint fell during a basketball game, and the players laughed and brushed it off the floor.

In November, Jonah mentioned the crack to the coach. "Old buildings make noise," the coach said. "It's been standing for seventy years."

In December, after a week of heavy snow, the crack had spread across half the ceiling like the branches of a tree, and on some mornings Jonah thought he could hear the roof creaking above them.

He went to the principal's office and asked to speak with her. He brought a notebook in which he had drawn the crack every week since September.

The principal looked at the drawings for a long time. Then she picked up the phone.

The gym was closed that afternoon. Two days later, under the weight of the snow, part of its roof fell in. The building was empty.`,
      topics: [timeOrder, characterization],
      glossed: ["crack", "ceiling", "gym", "creaking", "principal's", "principal"],
      xp: 5,
      questions: [
        {
          prompt: t("How does the writer build suspense?", "作者怎样营造悬念？"),
          right: t("By foreshadowing: the crack grows a little more each month", "通过预示：裂缝每个月都长大一点"),
          wrong: [
            t("By flashback to the year the gym was built", "倒叙到体育馆建成的那一年"),
            t("By telling the reader the ending first", "先把结局告诉读者"),
            t("By switching between many narrators", "在多个叙述者之间切换"),
          ],
          solution: t(
            "September, October, November, December: each month the crack is longer and the signs worse, from falling paint to a creaking roof. These hints point toward the collapse before it comes.",
            "九月、十月、十一月、十二月：每个月裂缝更长，迹象更糟，从掉落的油漆到嘎吱作响的屋顶。这些暗示在坍塌发生之前就指向了它。",
          ),
        },
        {
          prompt: t("What does Jonah's notebook show about him?", "约拿的笔记本表现了他什么样的性格？"),
          right: t("He is observant and patient, and he gathers evidence", "他善于观察、有耐心，会收集证据"),
          wrong: [
            t("He is careless and forgets things", "他粗心健忘"),
            t("He wants to be an artist rather than an athlete", "他想当画家而不是运动员"),
            t("He enjoys getting the coach in trouble", "他喜欢给教练找麻烦"),
          ],
          solution: t(
            'He drew the crack "every week since September." When words alone did not move the coach, his careful record convinced the principal.',
            '他 "every week since September" 都画下了这道裂缝。光靠说话没能打动教练时，他细致的记录说服了校长。',
          ),
        },
        {
          prompt: t(
            "Why is the coach's answer, \"It's been standing for seventy years,\" weak reasoning?",
            '教练的回答 "It\'s been standing for seventy years" 为什么是站不住脚的推理？',
          ),
          right: t("A building that has stood a long time can still be failing now", "一座建筑矗立了很久，现在仍可能在损坏"),
          wrong: [
            t("The gym was actually built last year", "体育馆其实是去年才建的"),
            t("The coach was lying about the noise", "教练在噪音的事上撒了谎"),
            t("Seventy years is too short for a building", "七十年对建筑来说太短了"),
          ],
          solution: t(
            "The past does not prove the present: the growing crack is new evidence. The coach's answer ignores it, and the ending shows the cost.",
            "过去不能证明现在：不断扩大的裂缝是新的证据。教练的回答忽视了它，结局显示了代价。",
          ),
        },
      ],
    },
    {
      id: "a-modern-odyssey",
      title: t("A Modern Odyssey", "现代奥德赛"),
      body: `My grandfather calls his journey to this country his odyssey. It took him four years.

He left his village at nineteen with a bag of clothes and the name of a cousin in a city he had never seen. He worked on a fishing boat, in a kitchen and on a farm. He slept in a train station for a week. Twice he lost all his money. Once, he says, he was offered a comfortable life if he would stay where he was and forget about going on, and he was tempted, the way a tired traveler is tempted by a warm fire.

But he kept going, because my grandmother was waiting for him. She had promised to wait, and she did, although many people told her he would never come.

When he finally arrived, thin and sunburned, she did not recognize him at first. Then he said her name, and she knew his voice.

He tells the story every year on the day he arrived. My little cousins think it is an adventure. My grandmother, who has heard it fifty times, always says the same thing at the end: "Four years. And he thinks he was the one who had a hard time."`,
      topics: [allusion, characterization],
      glossed: ["odyssey", "journey", "tempted", "sunburned", "recognize"],
      xp: 5,
      questions: [
        {
          prompt: t("Why does the grandfather call his journey an odyssey?", "祖父为什么把他的旅程称为奥德赛？"),
          right: t(
            "Like Odysseus, he traveled for years through hardship to reach the one waiting for him",
            "像奥德修斯一样，他历经多年艰难，回到等待他的人身边",
          ),
          wrong: [
            t("He sailed in a ship named the Odyssey", "他乘坐一艘名叫奥德赛号的船"),
            t("He studied ancient Greek at school", "他在学校学过古希腊语"),
            t("His journey was short and easy", "他的旅程短暂而轻松"),
          ],
          solution: t(
            "The allusion is to Homer's Odyssey, in which Odysseus takes years to get home while his wife waits. The long travel, the temptation to stay and the faithful wife all echo the epic.",
            "这里引用的是荷马的《奥德赛》：奥德修斯花了许多年才回到家，妻子一直在等他。漫长的旅途、留下的诱惑和忠贞的妻子都与这部史诗呼应。",
          ),
        },
        {
          prompt: t("Which detail most closely matches the story of Odysseus?", "哪个细节与奥德修斯的故事最相似？"),
          right: t("At first, his wife does not recognize him when he returns", "他回来时妻子起初没认出他"),
          wrong: [
            t("He works in a kitchen", "他在厨房工作"),
            t("His cousins think the story is an adventure", "他的表亲们觉得这个故事是冒险"),
            t("He tells the story every year", "他每年都讲这个故事"),
          ],
          solution: t(
            "In the epic, Odysseus returns home so changed that he is not known at first. The grandmother not recognizing her thin, sunburned husband echoes that scene.",
            "在史诗中，奥德修斯回家时变化太大，起初没人认出他。祖母没认出又瘦又晒黑的丈夫，正呼应了这一场景。",
          ),
        },
        {
          prompt: t("What does the grandmother's last line suggest?", "祖母的最后一句话暗示了什么？"),
          right: t("Waiting for four years was hard too, though her part is less often told", "等待四年同样艰难，只是她的部分很少被讲述"),
          wrong: [
            t("She does not believe his story happened", "她不相信他的故事是真的"),
            t("She is angry that he came back", "她生气他回来了"),
            t("She thinks four years is a short time", "她觉得四年时间很短"),
          ],
          solution: t(
            '"And he thinks he was the one who had a hard time" is said with humor, but it reminds listeners that she waited while "many people told her he would never come." Her line adds a second hero to the story.',
            '"And he thinks he was the one who had a hard time" 带着幽默，却提醒听众，她在 "many people told her he would never come" 的情况下一直等待。她这句话为故事加上了第二位英雄。',
          ),
        },
      ],
    },
    {
      id: "the-winner",
      title: t("The Winner", "获胜者"),
      body: `Everyone at Riverside High agreed that Kayla was the best runner the school had ever had. She had won every race since she was a freshman. Her name was on the trophy case three times.

On the day of the state final, the whole school came to watch. Kayla took the lead in the first lap and held it.

In the last turn, a runner from another school, a small, quiet girl named Bea, slipped and fell hard on the track. The other runners went around her. Kayla, who was ten steps ahead, heard her cry out and looked back.

She stopped.

The crowd went silent. Kayla walked back, helped Bea to her feet and, with Bea's arm over her shoulder, the two of them crossed the finish line together, long after everyone else.

Kayla did not win the race. She did not even place. That evening, the local newspaper ran a photograph of her on its front page, above a headline that said only: "The Winner."

Years later, Kayla had forgotten her times and most of her medals. She had never forgotten the sound of the crowd when it began, slowly, to cheer.`,
      topics: [irony, characterization],
      glossed: ["freshman", "trophy", "lap", "track", "headline", "medals", "cheer"],
      xp: 5,
      questions: [
        {
          prompt: t('Why is the headline "The Winner" ironic?', '标题 "The Winner" 为什么具有反讽意味？'),
          right: t("Kayla lost the race, yet the paper calls her the winner", "凯拉输了比赛，报纸却称她为获胜者"),
          wrong: [
            t("Kayla actually won the race by ten steps", "凯拉实际上领先十步赢得了比赛"),
            t("The newspaper made a printing mistake", "报纸印错了"),
            t("Bea was the one who won", "赢的是比娅"),
          ],
          solution: t(
            '"Kayla did not win the race. She did not even place." Calling her "The Winner" anyway is situational irony that points to a different kind of victory.',
            '"Kayla did not win the race. She did not even place." 却依然称她为 "The Winner"，这种情境反讽指向另一种意义上的胜利。',
          ),
        },
        {
          prompt: t("What does Kayla's choice to stop reveal about her?", "凯拉停下来的选择揭示了她什么样的性格？"),
          right: t("She values kindness more than winning", "她看重善良胜过胜利"),
          wrong: [
            t("She was too tired to finish", "她累得跑不完"),
            t("She wanted to slow Bea down", "她想拖慢比娅"),
            t("She did not care about the race", "她根本不在乎比赛"),
          ],
          solution: t(
            "A runner who had won every race gives up a sure victory to help a rival. The action reveals her character more than any description could.",
            "一个赢过每场比赛的跑者放弃了稳操胜券的胜利去帮助对手。这一行动比任何描述都更能揭示她的性格。",
          ),
        },
        {
          prompt: t("What does the last paragraph suggest?", "最后一段暗示了什么？"),
          right: t("The moment of kindness meant more to her than all her victories", "那一刻的善举对她来说比所有胜利都更有意义"),
          wrong: [
            t("Kayla wishes she had kept running", "凯拉后悔没有继续跑"),
            t("Kayla never ran again", "凯拉再也没跑过步"),
            t("The crowd was angry with Kayla", "观众对凯拉很生气"),
          ],
          solution: t(
            'She forgot "her times and most of her medals" but "never forgotten the sound of the crowd." What lasts is the choice, not the result.',
            '她忘了 "her times and most of her medals"，却 "never forgotten the sound of the crowd"。留下来的是选择，而不是结果。',
          ),
        },
      ],
    },
  ],
};
