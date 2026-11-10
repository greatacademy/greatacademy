import type { ReadingUnitDef } from "@ga/content";
import { t } from "@ga/content";

// The topics of the literature unit of the course english-literature-argument that the tales and poems practice.
const figures = { topic: "personification-and-hyperbole", weight: 0.3 } as const;
const figuresSome = { topic: "personification-and-hyperbole", weight: 0.2 } as const;
const sounds = { topic: "sound-devices", weight: 0.3 } as const;
const plot = { topic: "plot-and-conflict", weight: 0.3 } as const;
const theme = { topic: "theme", weight: 0.3 } as const;
const themeSome = { topic: "theme", weight: 0.2 } as const;
const tone = { topic: "tone-and-mood", weight: 0.3 } as const;

/** talesAndPoems is a reading unit of grades 6 to 8 of original short stories and poems about figurative language, sound, plot, theme, tone and mood. */
export const talesAndPoems: ReadingUnitDef = {
  id: "tales-and-poems",
  title: t("Tales and Poems", "故事与诗"),
  passages: [
    {
      id: "the-restless-wind",
      title: t("The Restless Wind", "不安分的风"),
      body: `The wind came down from the hills on Tuesday morning, and it was in a terrible mood. It rattled the windows of every house on Pine Street, as if it were knocking to be let in. When nobody answered, it grabbed the laundry from Mrs. Okafor's line and tossed her sheets into the sky like a child throwing paper.

Nadia watched from the porch. Her little brother Sam pressed his face to the glass. "The wind is so strong it could blow the whole town to the moon," he said.

"Not quite," Nadia laughed, but she held the railing tightly.

All morning the wind ran up and down the street. It whistled through the fence, pushed the trash cans over and chased a red umbrella all the way to the river. The old oak tree groaned and waved its long arms, begging the wind to rest.

By evening, the wind was tired. It sighed through the grass, touched the tops of the flowers gently and lay down behind the hills to sleep. The street was quiet again.

Sam came out onto the porch. "I think it was lonely," he said. "It just wanted somebody to play with."

Nadia picked up one of Mrs. Okafor's sheets from the yard. "Next time," she said, "it can play with your toys instead."`,
      topics: [figures],
      names: ["Tuesday", "Pine", "Mrs", "Okafor's", "Nadia", "Sam"],
      xp: 5,
      questions: [
        {
          prompt: t("Which sentence from the story is an example of hyperbole?", "故事中哪一句是夸张？"),
          right: t(
            '"The wind is so strong it could blow the whole town to the moon."',
            "“The wind is so strong it could blow the whole town to the moon.”（风大得能把整个镇子吹到月亮上。）",
          ),
          wrong: [
            t(
              '"The old oak tree groaned and waved its long arms."',
              "“The old oak tree groaned and waved its long arms.”（老橡树呻吟着，挥动长长的手臂。）",
            ),
            t('"The street was quiet again."', "“The street was quiet again.”（街道又安静下来了。）"),
            t(
              '"Nadia picked up one of Mrs. Okafor\'s sheets from the yard."',
              "“Nadia picked up one of Mrs. Okafor's sheets from the yard.”（娜迪亚从院子里捡起一条奥卡福太太的床单。）",
            ),
          ],
          solution: t(
            "Sam says this in the second paragraph. No wind could really blow a town to the moon, so it is an exaggeration for effect. The oak tree sentence gives a tree human actions, which is personification, and the other two are plain description.",
            "这句话是第二段里萨姆说的。没有哪阵风真能把镇子吹到月亮上，所以这是为了效果而夸大。橡树那句是赋予树人的动作，属于拟人；另外两句只是平实的描写。",
          ),
        },
        {
          prompt: t(
            'In "The old oak tree groaned and waved its long arms, begging the wind to rest," what does the writer do?',
            "在“The old oak tree groaned and waved its long arms, begging the wind to rest”这句中，作者用了什么手法？",
          ),
          right: t("Gives the tree human actions and feelings", "赋予树人的动作和感情"),
          wrong: [
            t("Exaggerates how tall the tree is", "夸大树有多高"),
            t("Repeats the same sound at the start of several words", "在几个词的开头重复同一个音"),
            t("Says exactly what a real tree does in a storm", "如实说出真实的树在风暴中的样子"),
          ],
          solution: t(
            "In the fourth paragraph the tree groans, has arms and begs, as a worried person would. Giving a thing human qualities is personification; nothing about its size is exaggerated.",
            "第四段里，这棵树会呻吟、有手臂、会恳求，就像一个着急的人。赋予事物人的特点就是拟人；句子并没有夸大树的大小。",
          ),
        },
        {
          prompt: t("How does the writer show the wind in the evening?", "作者是怎样写傍晚的风的？"),
          right: t("As a tired person who lies down to sleep", "像一个躺下睡觉的疲倦的人"),
          wrong: [
            t("As an angry animal hunting for food", "像一只寻找食物的愤怒动物"),
            t("As a machine that has broken down", "像一台出了故障的机器"),
            t("As a giant that knocks the houses down", "像一个把房子推倒的巨人"),
          ],
          solution: t(
            'The fifth paragraph says the wind "was tired," "sighed," touched the flowers gently and "lay down behind the hills to sleep." These are the actions of a tired person going to bed.',
            "第五段说风“was tired”，会“sighed”，轻轻碰花朵，还“lay down behind the hills to sleep”。这些都是一个疲倦的人上床睡觉的动作。",
          ),
        },
      ],
    },
    {
      id: "what-the-house-says",
      title: t("What the House Says at Night", "房子在夜里说的话"),
      body: `Leo could never fall asleep in his grandmother's old house. Every night, the house seemed to come alive around him. One summer he wrote this poem about it.

When the lights go out, the house begins to talk.
The stairs complain under every step,
creaking like old knees.
The fridge hums a song it learned years ago
and never finishes.
The clock in the hall counts the seconds out loud,
one by one, as if it is afraid to lose any.
The curtains whisper to the window,
and the window shivers in its frame.
Down in the kitchen, the tap drips
a thousand times a minute,
louder than a drum in a parade.
The roof stretches and yawns
when the warm day leaves it.
I lie awake for a hundred years,
listening to all of them,
until at last the house grows tired too.
It pulls the dark over its shoulders like a blanket
and falls asleep before I do.`,
      topics: [figures],
      names: ["Leo"],
      xp: 5,
      questions: [
        {
          prompt: t("Which line of the poem is hyperbole?", "诗中哪一行是夸张？"),
          right: t('"I lie awake for a hundred years"', "“I lie awake for a hundred years”（我醒着躺了一百年）"),
          wrong: [
            t('"The curtains whisper to the window"', "“The curtains whisper to the window”（窗帘对窗户低语）"),
            t('"The roof stretches and yawns"', "“The roof stretches and yawns”（屋顶伸懒腰、打哈欠）"),
            t('"until at last the house grows tired too"', "“until at last the house grows tired too”（直到房子最后也累了）"),
          ],
          solution: t(
            "Nobody lies awake for a hundred years in one night; the speaker exaggerates to show how long the night feels. The other three lines give the curtains, the roof and the house human actions, which is personification.",
            "没有人一夜之间会醒着躺上一百年；说话人是夸大其词，表现这一夜有多漫长。另外三行赋予窗帘、屋顶和房子人的动作，属于拟人。",
          ),
        },
        {
          prompt: t('Why does the poet say the stairs "complain"?', "诗人为什么说楼梯在“complain”（抱怨）？"),
          right: t("To make the creaking of the stairs sound like a person grumbling", "让楼梯的嘎吱声听起来像一个人在发牢骚"),
          wrong: [
            t("To show that someone is arguing on the stairs", "表明有人在楼梯上吵架"),
            t("To show that the stairs are broken and unsafe", "表明楼梯坏了、不安全"),
            t("To show that the poet is angry with the stairs", "表明诗人在生楼梯的气"),
          ],
          solution: t(
            'The second and third lines of the poem say the stairs complain while they are "creaking like old knees." Only the stairs make the sound; the poet gives them a person\'s grumbling voice.',
            "诗的第二、三行说楼梯在抱怨，同时“creaking like old knees”。发出声音的只是楼梯；诗人赋予了它们人发牢骚的声音。",
          ),
        },
        {
          prompt: t("What happens in the last three lines of the poem?", "诗的最后三行发生了什么？"),
          right: t("The house grows quiet, as if it were a person falling asleep", "房子安静了下来，就像一个人睡着了"),
          wrong: [
            t("The house falls down in the dark", "房子在黑暗中倒塌了"),
            t("The grandmother puts a blanket on Leo", "奶奶给利奥盖上毯子"),
            t("Leo falls asleep before the house does", "利奥比房子先睡着"),
          ],
          solution: t(
            'The house "grows tired," pulls the dark "over its shoulders like a blanket" and "falls asleep before I do." The noises stop, and the speaker is still awake.',
            "房子“grows tired”，把黑夜“over its shoulders like a blanket”拉上，并且“falls asleep before I do”。声音停了，而说话人还醒着。",
          ),
        },
      ],
    },
    {
      id: "rain-on-the-tin-roof",
      title: t("Rain on the Tin Roof", "铁皮屋顶上的雨"),
      body: `Every spring, Ana's family stays in a small cabin by a lake. The cabin has a tin roof, and when it rains, the whole cabin turns into a drum. Ana wrote this poem on a rainy afternoon there, sitting by the window with a cup of tea and a pencil.

Tap, tap, tap, the first drops fall,
soft as a finger on the wall.
Then patter, patter, faster still,
the rain comes running down the hill.
It drums and rattles, bangs and pings,
it plays the roof like silver strings.
The gutters gurgle, splash and pour,
the puddles grow outside the door.

Then slowly, slowly, soft and slow,
the rain grows tired and starts to go.
A drip, a drop, a dot, a hush,
the garden breathes, the sparrows rush
to shake their feathers, wet and bright,
and sing about the coming light.
And in the quiet, damp and deep,
the tin roof hums itself to sleep.`,
      topics: [sounds],
      names: ["Ana", "Ana's"],
      xp: 5,
      questions: [
        {
          prompt: t("Which group of words from the poem is onomatopoeia?", "诗中哪一组词是拟声词？"),
          right: t('"patter," "pings" and "gurgle"', "“patter”“pings”和“gurgle”（啪嗒、叮、汩汩）"),
          wrong: [
            t('"fall" and "wall"', "“fall”和“wall”（落下、墙）"),
            t('"damp and deep"', "“damp and deep”（潮湿而深沉）"),
            t('"garden," "feathers" and "light"', "“garden”“feathers”和“light”（花园、羽毛、光）"),
          ],
          solution: t(
            'Onomatopoeia is a word that sounds like what it names. "Patter," "pings" and "gurgle" imitate the sounds of rain and water. "Fall" and "wall" rhyme, and "damp and deep" repeats a first sound.',
            "拟声词是听起来像它所指声音的词。“patter”“pings”和“gurgle”模仿的是雨和水的声音。“fall”和“wall”是押韵，“damp and deep”是重复开头的音。",
          ),
        },
        {
          prompt: t("What is the rhyme scheme of the first four lines of the poem?", "诗的前四行是什么韵式？"),
          right: t("AABB", "AABB 式"),
          wrong: [t("ABAB", "ABAB 式"), t("ABCB", "ABCB 式"), t("AAAA", "AAAA 式")],
          solution: t(
            'The first two lines end with "fall" and "wall," which rhyme with each other (A). The next two end with "still" and "hill," a new rhyme (B). So the pattern is AABB.',
            "前两行以“fall”和“wall”结尾，彼此押韵（A）；接下来两行以“still”和“hill”结尾，是一个新的韵（B）。所以韵式是 AABB。",
          ),
        },
        {
          prompt: t(
            'Which sound device does the line "Then slowly, slowly, soft and slow" use most?',
            "“Then slowly, slowly, soft and slow”这一行主要用了哪种声音修辞？",
          ),
          right: t("Alliteration", "头韵"),
          wrong: [t("Onomatopoeia", "拟声"), t("Rhyme at the end of the line", "行尾押韵"), t("Hyperbole", "夸张")],
          solution: t(
            'Four words in that line, "slowly," "slowly," "soft" and "slow," begin with the same s sound. Repeating a first sound like this is alliteration. None of the words imitates a sound, and none exaggerates.',
            "这一行中“slowly”“slowly”“soft”“slow”四个词都以同一个 s 音开头。像这样重复开头的音就是头韵。这些词都不模仿声音，也没有夸大。",
          ),
        },
      ],
    },
    {
      id: "the-market-wakes",
      title: t("The Market Wakes", "集市醒来了"),
      body: `Before the sun is up, the market on Bell Street is already busy. Ravi helps his aunt sell fruit there every Saturday. One morning he wrote down all the sounds he heard in the first hour, and the list turned into a poem.

Clang! The metal gates swing open.
Wheels rumble over the stones,
carts creak and crates crash down,
and somewhere a radio crackles into song.
The fish man shouts his prices
in a voice as big as a boat.
Knives chop, chop, chop
through onions and green peppers.
Pots bubble, oil hisses,
and the smell of fresh bread
wanders between the tables,
tapping people on the shoulder.
My aunt hums while she stacks the mangoes,
bright and round and ready.
A baby giggles, a dog barks twice,
a bicycle bell rings: ring, ring!
The sun climbs over the rooftops
to see what all the noise is about.
By seven, the street is one long song,
and I know every word.`,
      topics: [sounds, figuresSome],
      names: ["Bell", "Ravi"],
      xp: 5,
      questions: [
        {
          prompt: t("Which line of the poem uses alliteration?", "诗中哪一行用了头韵？"),
          right: t('"carts creak and crates crash down"', "“carts creak and crates crash down”（推车嘎吱响，箱子哗啦落下）"),
          wrong: [
            t('"and I know every word"', "“and I know every word”（而我知道每一个词）"),
            t('"The fish man shouts his prices"', "“The fish man shouts his prices”（卖鱼的人喊着价钱）"),
            t('"My aunt hums while she stacks the mangoes"', "“My aunt hums while she stacks the mangoes”（姑姑一边哼歌一边摆芒果）"),
          ],
          solution: t(
            'In the third line of the poem, "carts," "creak," "crates" and "crash" all begin with the same hard c sound. The other lines do not repeat a first sound.',
            "诗的第三行中，“carts”“creak”“crates”“crash”都以同一个硬 c 音开头。其他几行没有重复开头的音。",
          ),
        },
        {
          prompt: t("Which word from the poem is onomatopoeia?", "诗中哪个词是拟声词？"),
          right: t('"hisses"', "“hisses”（嘶嘶响）"),
          wrong: [t('"wanders"', "“wanders”（游荡）"), t('"bright"', "“bright”（明亮）"), t('"shoulder"', "“shoulder”（肩膀）")],
          solution: t(
            '"Oil hisses" uses a word that sounds like the noise hot oil makes. "Wanders," "bright" and "shoulder" do not imitate any sound.',
            "“Oil hisses”里的“hisses”听起来就像热油发出的声音。“wanders”“bright”“shoulder”都不模仿任何声音。",
          ),
        },
        {
          prompt: t(
            'What do the lines "the smell of fresh bread / wanders between the tables, / tapping people on the shoulder" suggest?',
            "“the smell of fresh bread / wanders between the tables, / tapping people on the shoulder”这几行暗示了什么？",
          ),
          right: t(
            "The smell spreads through the market and catches people's attention, as if it were a person",
            "面包香飘满集市，吸引人们注意，就好像它是一个人",
          ),
          wrong: [
            t("A baker walks around and taps people to sell bread", "一个面包师走来走去，拍人肩膀卖面包"),
            t("The bread smells so bad that people want to leave", "面包味道太难闻，人们想离开"),
            t("People are dancing between the tables", "人们在桌子之间跳舞"),
          ],
          solution: t(
            "A smell cannot walk or tap anyone. The poem gives the smell the actions of a person, which is personification, to show how it drifts everywhere and makes people notice it. No baker is mentioned.",
            "气味不会走路，也不会拍人。诗赋予气味人的动作，这是拟人，表现香味四处飘散、引起人们注意。诗里并没有提到面包师。",
          ),
        },
      ],
    },
    {
      id: "the-bridge-at-high-water",
      title: t("The Bridge at High Water", "涨水时的桥"),
      body: `Every evening, Jonah walked the family's three goats home from the field across the creek. The creek was usually so shallow that he could see the stones on its bottom, and the little wooden bridge over it hardly seemed needed.

That afternoon, however, it had rained for six hours in the hills. When Jonah reached the bridge, the creek had turned brown and wild. The water roared under the boards and splashed over the edges.

The goats stopped. Bella, the oldest, planted her feet and would not move. Jonah's heart pounded. If he waited, the water might rise higher and carry the bridge away. If he went now, a goat could slip and be swept off.

He tied the three goats together with his rope, so that none of them could wander off. Then he walked backward across the bridge, pulling gently and talking the whole time in a calm voice. Halfway across, the boards shook under them, and Bella cried out. Jonah kept talking. One step. Another step.

At last his boots touched the mud on the far side, and the goats scrambled up the bank after him.

That night the bridge was gone. In the morning, Jonah's father stood looking at the empty bank for a long time. Then he put a hand on Jonah's shoulder and said nothing at all, which from his father meant a great deal.`,
      topics: [plot],
      names: ["Jonah", "Jonah's", "Bella"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the main conflict of the story?", "这个故事的主要冲突是什么？"),
          right: t(
            "Jonah against the flooding creek, which could keep him and the goats from getting home safely",
            "乔纳与涨水的小溪之间的冲突，涨水可能让他和山羊无法安全回家",
          ),
          wrong: [
            t("Jonah against his father, who does not trust him", "乔纳与不信任他的父亲之间的冲突"),
            t("Jonah against Bella, who wants to run away", "乔纳与想逃跑的贝拉之间的冲突"),
            t("Jonah against himself, because he wants to stay in the field", "乔纳内心的冲突，因为他想留在田里"),
          ],
          solution: t(
            "The second and third paragraphs set up the problem: the creek has turned brown and wild, and the bridge might be carried away. This is a struggle against nature. Bella only refuses to move because of the water.",
            "第二、三段提出了问题：小溪变得浑浊汹涌，桥可能会被冲走。这是人与自然的冲突。贝拉不肯动，只是因为害怕水。",
          ),
        },
        {
          prompt: t("Which moment is the climax of the story?", "哪一刻是故事的高潮？"),
          right: t("Halfway across, the boards shake and Bella cries out", "走到一半时，木板晃动，贝拉叫了起来"),
          wrong: [
            t("Jonah walks the goats home every evening", "乔纳每天傍晚赶山羊回家"),
            t("It rains for six hours in the hills", "山里下了六个小时的雨"),
            t("Jonah's father puts a hand on his shoulder", "乔纳的父亲把手放在他肩上"),
          ],
          solution: t(
            "The fourth paragraph holds the moment of greatest danger, when the bridge shakes in the middle of the crossing. After that the tension falls: they reach the far side, and the last paragraph ends the story.",
            "第四段写的是最危险的时刻：过桥到一半时桥在晃动。此后紧张感下降：他们到了对岸，最后一段为故事收尾。",
          ),
        },
        {
          prompt: t("What does the first paragraph do in the plot?", "第一段在情节中起什么作用？"),
          right: t("It shows the normal situation before the problem begins", "展示问题出现之前的平常情况"),
          wrong: [
            t("It shows how the conflict is solved", "展示冲突如何解决"),
            t("It is the turning point of the story", "它是故事的转折点"),
            t("It shows the moment of greatest danger", "展示最危险的时刻"),
          ],
          solution: t(
            'The first paragraph tells what happens "every evening": the creek is shallow and the bridge hardly seems needed. This is the exposition; the problem starts only in the second paragraph, "That afternoon, however."',
            "第一段讲的是“every evening”的情形：溪水很浅，桥几乎没什么用。这是开端（交代背景）；问题直到第二段“That afternoon, however”才出现。",
          ),
        },
      ],
    },
    {
      id: "the-race-up-the-hill",
      title: t("The Race up the Hill", "上坡的赛跑"),
      body: `Marta had trained for the city race all year. She ran before school in the dark and after school in the rain. This time, she told herself, she would beat Bea Collins, who had won every race since fourth grade.

With half a mile left, Marta was finally in front. She could hear Bea breathing hard behind her. Then came a sharp cry and the sound of someone falling.

Marta looked back. Bea was sitting on the path, holding her ankle, her face white.

Keep going, said a voice in Marta's head. This is your chance. You earned it. But another voice was quieter and harder to ignore. She is hurt, it said, and nobody else is near.

Marta's legs kept moving for three more steps. Then she stopped, turned around and ran back down the hill.

"What are you doing?" Bea asked. "Go! You're winning!"

"Not like this," Marta said. She pulled Bea's arm over her shoulders, and together they began to walk.

Runner after runner passed them. By the time the two girls crossed the finish line, most of the crowd had gone home. But Coach Diaz was still there, and so was Bea's mother, and both of them were clapping as loudly as a whole crowd.

Marta did not win a medal that day. Bea, however, knocked on her door the next morning with a box of cookies and a question: would Marta like a running partner?`,
      topics: [plot, themeSome],
      names: ["Marta", "Marta's", "Bea", "Bea's", "Collins", "Diaz"],
      xp: 5,
      questions: [
        {
          prompt: t("What kind of conflict does Marta face when Bea falls?", "贝亚摔倒时，玛尔塔面对的是哪种冲突？"),
          right: t("A struggle inside herself between wanting to win and wanting to help", "她内心的挣扎：想赢和想帮忙之间的矛盾"),
          wrong: [
            t("An argument with Bea about who is faster", "和贝亚争论谁跑得更快"),
            t("A struggle against bad weather on the hill", "在山坡上与恶劣天气的斗争"),
            t("A fight with Coach Diaz about the race", "和迪亚兹教练为比赛吵架"),
          ],
          solution: t(
            'The fourth paragraph shows two voices in Marta\'s head: "Keep going" and "She is hurt." The conflict is inside her mind, not with another person or with nature.',
            "第四段写出了玛尔塔脑中的两个声音：“Keep going”和“She is hurt”。冲突发生在她的内心，而不是与别人或与自然之间。",
          ),
        },
        {
          prompt: t("Which event is the turning point of the story?", "哪个事件是故事的转折点？"),
          right: t("Marta stops, turns around and runs back down the hill", "玛尔塔停下来，转身跑回坡下"),
          wrong: [
            t("Marta trains before school in the dark", "玛尔塔在天黑时上学前训练"),
            t("Marta finally gets in front of Bea", "玛尔塔终于跑到贝亚前面"),
            t("Bea knocks on Marta's door with cookies", "贝亚带着饼干来敲玛尔塔的门"),
          ],
          solution: t(
            "The fifth paragraph is where Marta makes her choice and the story changes direction. Training and taking the lead come before it; the cookies come at the very end, after the conflict is over.",
            "第五段是玛尔塔做出选择、故事改变方向的地方。训练和领先都发生在这之前；送饼干则在冲突结束之后的结尾。",
          ),
        },
        {
          prompt: t("Which sentence best states the theme of the story?", "哪一句最能概括这个故事的主题？"),
          right: t("Doing the right thing can matter more than winning.", "做正确的事可能比赢更重要。"),
          wrong: [
            t("The story is about a city race.", "这个故事讲的是一场城市赛跑。"),
            t("Hard training always leads to a medal.", "刻苦训练总能换来奖牌。"),
            t("You should never trust the people you race against.", "永远不要相信你的比赛对手。"),
          ],
          solution: t(
            "Marta gives up her chance to win, yet the ending rewards her with cheers and a new friend. That is a message about life. A city race is only the topic, and Marta trained hard but got no medal.",
            "玛尔塔放弃了获胜的机会，但结尾她得到了掌声和一个新朋友。这才是关于人生的道理。城市赛跑只是话题；而玛尔塔刻苦训练却没有拿到奖牌。",
          ),
        },
      ],
    },
    {
      id: "the-lamp-on-the-hill",
      title: t("The Lamp on the Hill", "山上的灯"),
      body: `Old Nell lived alone in a stone cottage on the hill above the harbor. Every evening at sunset, she climbed the stairs to her top window and lit a lamp. She had done it for forty years, ever since her husband had gone out fishing on that same dark water.

The young people in the village thought it was a strange habit. "There is a real lighthouse now," they said. "Nobody needs Nell's little lamp." Some of them laughed when they saw its yellow glow.

Nell did not argue. She just kept cleaning the glass, filling the lamp with oil and lighting it, night after night.

One winter night, a storm knocked out the power along the whole coast. The great lighthouse went dark. Out on the water, a boy named Pablo and his uncle were rowing home through the rain, and they could not see the shore at all.

Then Pablo saw it: one small yellow light, high on the hill. They turned the boat toward it and rowed until they felt sand under them.

The next day, Pablo climbed the hill with a basket of fish. He did not laugh at the lamp. Instead, he asked Nell to show him how to light it.

From then on, on the nights when Nell's knees ached, a boy's footsteps could be heard on her stairs at sunset.`,
      topics: [theme],
      names: ["Nell", "Nell's", "Pablo"],
      xp: 5,
      questions: [
        {
          prompt: t("Which sentence best states the theme of the story?", "哪一句最能概括这个故事的主题？"),
          right: t(
            "Small, faithful acts can matter even when others do not see their value.",
            "微小而坚持的行动可能很重要，即使别人看不到它的价值。",
          ),
          wrong: [
            t("Storms are dangerous for people who fish.", "风暴对打鱼的人很危险。"),
            t("A lighthouse is always better than a lamp.", "灯塔总是比灯好。"),
            t("Old people should not live alone.", "老人不应该独自生活。"),
          ],
          solution: t(
            "The villagers laugh at Nell's lamp, but on the stormy night it is the only light that guides Pablo home. The story's message is that her quiet habit mattered. A storm is part of the plot, not the message about life.",
            "村民们嘲笑内尔的灯，但在暴风雨之夜，正是这盏灯把巴勃罗引回了家。故事的道理是：她默默的坚持是有意义的。风暴只是情节的一部分，不是关于人生的道理。",
          ),
        },
        {
          prompt: t("Why does the writer include the villagers laughing at the lamp?", "作者为什么写村民嘲笑那盏灯？"),
          right: t(
            "To show that others did not see the value of Nell's work, so the storm proves them wrong",
            "表明别人看不到内尔所做之事的价值，而风暴证明了他们错了",
          ),
          wrong: [
            t("To show that Nell was angry with the villagers", "表明内尔在生村民的气"),
            t("To explain how a lighthouse works", "解释灯塔是怎样工作的"),
            t("To show that the lamp was too weak to help anyone", "表明那盏灯太弱，帮不了任何人"),
          ],
          solution: t(
            'The second paragraph says "Nobody needs Nell\'s little lamp," and the third says Nell "did not argue." The storm later shows that someone did need it, which builds the theme.',
            "第二段说“Nobody needs Nell's little lamp”，第三段说内尔“did not argue”。后来的风暴表明确实有人需要它，从而突出了主题。",
          ),
        },
        {
          prompt: t("How does the ending support the theme?", "结尾是如何支持主题的？"),
          right: t("Pablo comes to value the lamp and helps keep it lit", "巴勃罗开始珍惜这盏灯，并帮忙让它一直亮着"),
          wrong: [
            t("Pablo laughs at the lamp like the others", "巴勃罗像其他人一样嘲笑那盏灯"),
            t("Nell stops lighting the lamp", "内尔不再点灯了"),
            t("Pablo decides never to go out on the water again", "巴勃罗决定再也不出海了"),
          ],
          solution: t(
            'In the last two paragraphs Pablo "did not laugh," asks to learn to light the lamp, and climbs her stairs on the nights her knees ache. The faithful act goes on through him.',
            "最后两段里，巴勃罗“did not laugh”，请求学习点灯，还在内尔膝盖疼的夜晚替她爬楼梯点灯。这份坚持通过他延续了下去。",
          ),
        },
      ],
    },
    {
      id: "seeds-in-winter",
      title: t("Seeds in Winter", "冬天的种子"),
      body: `In January, Grace's grandfather gave her a paper packet of sunflower seeds. "Not yet," he said, when she asked to plant them. She was not happy about waiting, so she wrote this poem.

The seeds sleep in their paper house
on the shelf above the sink.
Outside, the garden wears a coat of snow
and will not take it off.
I ask the seeds if they are bored.
They do not answer.
They are busy keeping a secret,
a whole summer folded small
inside each striped shell.
The wind pounds on the door all February,
the days are short and gray,
and I am sure that spring has lost our address.
But Grandpa only smiles
and turns another page of his seed book.
"Everything big," he says,
"starts out small and waits."
So I wait.
And in May, when the ground turns soft and warm,
we push the seeds into the dark earth,
and I watch them climb toward the sky,
taller than the fence,
taller than Grandpa,
turning their bright faces to the sun
as if they always knew
it would come back.`,
      topics: [theme, figuresSome],
      names: ["Grace's", "Grandpa", "January", "February", "May"],
      xp: 5,
      questions: [
        {
          prompt: t("Which sentence best states the theme of the poem?", "哪一句最能概括这首诗的主题？"),
          right: t("Good things often take time, and waiting with patience is worth it.", "美好的事物往往需要时间，耐心等待是值得的。"),
          wrong: [
            t("The poem is about planting a garden.", "这首诗讲的是种花园。"),
            t("Sunflowers grow best in the snow.", "向日葵在雪中长得最好。"),
            t("Children should never ask questions.", "孩子永远不该提问。"),
          ],
          solution: t(
            "The speaker hates waiting through the winter, but the seeds she waited for grow taller than the fence. The poem's message is about patience. Planting a garden is only its topic.",
            "说话人讨厌熬过冬天的等待，但她等来的种子长得比篱笆还高。诗的道理是关于耐心的。种花园只是它的话题。",
          ),
        },
        {
          prompt: t(
            'What does the line "I am sure that spring has lost our address" show?',
            "“I am sure that spring has lost our address”这一行表现了什么？",
          ),
          right: t(
            "The speaker feels that spring will never come, as if it were a lost visitor",
            "说话人觉得春天永远不会来了，好像它是一个迷路的客人",
          ),
          wrong: [
            t("The family has moved to a new house", "这家人搬了新家"),
            t("Spring has come early this year", "今年春天来得早"),
            t("The speaker is glad that winter is long", "说话人很高兴冬天很长"),
          ],
          solution: t(
            "Spring cannot really lose an address; the poem treats it like a person who cannot find the house. Coming after the long gray days of February, the line shows how impatient the speaker is.",
            "春天不会真的弄丢地址；诗把它当作一个找不到家门的人。这一行紧接在二月漫长灰暗的日子之后，表现出说话人有多么不耐烦。",
          ),
        },
        {
          prompt: t("Which lines state the theme most directly?", "哪几行最直接地点明了主题？"),
          right: t(
            '"Everything big," he says, / "starts out small and waits."',
            "“Everything big,” he says, / “starts out small and waits.”（他说，大的东西都是从小开始并等待的。）",
          ),
          wrong: [
            t('"The seeds sleep in their paper house"', "“The seeds sleep in their paper house”（种子睡在它们的纸房子里）"),
            t('"taller than the fence"', "“taller than the fence”（比篱笆还高）"),
            t('"on the shelf above the sink"', "“on the shelf above the sink”（在水槽上方的架子上）"),
          ],
          solution: t(
            'Grandpa\'s words in the middle of the poem put the message into a sentence, and the speaker answers, "So I wait." The other lines describe the seeds or where they are kept.',
            "诗中间爷爷的话把道理说成了一句话，说话人随即回答“So I wait.”。其他几行只是描写种子或它们存放的地方。",
          ),
        },
      ],
    },
    {
      id: "the-old-mill",
      title: t("The Old Mill", "老磨坊"),
      body: `The old mill stood at the end of the road, where the trees grew close together and the light turned green and dim. Its windows were broken, and its door hung open on one hinge. Whenever the wind moved it, the door let out a long, thin moan.

Ivy and her cousin Max stopped at the gate. Nothing moved inside. A crow sat on the roof and watched them without blinking. The air smelled of wet wood and something older, something that had been shut away for a long time.

"We could go back," Max said quietly.

Ivy pushed the gate. It screamed on its old metal hinges. They stepped into the shadows. Somewhere above them, a board creaked, then another, as if someone were walking slowly across the floor.

Then a small gray shape dropped from the stairs and landed at their feet.

It was a kitten. It looked up at them and gave the tiniest mew in the world.

Max laughed so hard he had to sit down. Ivy picked the kitten up, and it began to purr against her chin, warm as a cup of cocoa. Suddenly the mill did not seem dark at all. Sunlight was coming through the holes in the roof, and dust floated in it like gold.

They named the kitten Ghost and carried it home.`,
      topics: [tone],
      names: ["Ivy", "Max", "Ghost"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the mood of the first four paragraphs?", "前四段的氛围是怎样的？"),
          right: t("Tense and spooky", "紧张又阴森"),
          wrong: [t("Cheerful and lively", "欢快又热闹"), t("Calm and sleepy", "平静又困倦"), t("Silly and playful", "滑稽又顽皮")],
          solution: t(
            "The opening describes dim green light, broken windows, a moaning door, a crow that never blinks, a screaming gate and footsteps above. These details make the reader nervous.",
            "开头写了昏暗的绿光、破窗户、呻吟的门、一眨不眨的乌鸦、尖叫的大门和头顶的脚步声。这些细节让读者感到紧张。",
          ),
        },
        {
          prompt: t("Which detail does the most to create that mood?", "哪个细节最能营造这种氛围？"),
          right: t(
            'The door "let out a long, thin moan," and a crow watched them without blinking',
            "门“let out a long, thin moan”，一只乌鸦一眨不眨地盯着他们",
          ),
          wrong: [
            t("Dust floated in the sunlight like gold", "灰尘在阳光里像金子一样飘浮"),
            t("Max laughed so hard he had to sit down", "马克斯笑得不得不坐下"),
            t("They named the kitten Ghost", "他们给小猫取名叫“幽灵”"),
          ],
          solution: t(
            "The moaning door and the staring crow come in the first two paragraphs, where the mood is being built. The dust, the laughter and the kitten's name come after the kitten appears, when the mood has already changed.",
            "呻吟的门和盯人的乌鸦出现在前两段，那里正在营造氛围。灰尘、笑声和小猫的名字都出现在小猫露面之后，那时氛围已经变了。",
          ),
        },
        {
          prompt: t("How does the mood change once the kitten appears?", "小猫出现后，氛围发生了什么变化？"),
          right: t("From fear to warmth and relief", "从害怕变成温暖和放松"),
          wrong: [
            t("From happiness to sadness", "从快乐变成悲伤"),
            t("It stays just as frightening", "仍然一样吓人"),
            t("From boredom to anger", "从无聊变成愤怒"),
          ],
          solution: t(
            'In the seventh paragraph Max laughs, the kitten purrs "warm as a cup of cocoa," and the mill "did not seem dark at all." Sunlight and gold replace the shadows.',
            "第七段里，马克斯大笑，小猫的呼噜声“warm as a cup of cocoa”，磨坊“did not seem dark at all”。阳光和金色取代了阴影。",
          ),
        },
      ],
    },
    {
      id: "two-letters-from-camp",
      title: t("Two Letters from Camp", "两封夏令营来信"),
      body: `Dear Mom and Dad,

Camp is the best place on the whole planet! On the first day we swam in the lake, and the water was cold but wonderful. Yesterday I climbed the big rock wall all the way to the top, and everyone cheered. The food is great, especially the pancakes. I have already made four new friends, and we sing songs by the fire every night. Please, please can I stay for another week?

Love, Rosa

Dear Mom and Dad,

Greetings from the land of mosquitoes. I have counted ninety bites so far, and the mosquitoes are planning more. On the first day they made us jump into a lake that was colder than the inside of a freezer. Yesterday Rosa climbed a rock wall, and everyone acted as if she had flown to the moon. The pancakes are fine, I suppose, if you enjoy eating rubber. I have made one friend. His name is Ben, and he also wants to go home.

Please do not worry. I will probably survive.

Your son, Danny

One more thing. Ben and I found a frog by the lake. It is the best frog. Maybe one more week would be okay.`,
      topics: [tone],
      names: ["Rosa", "Ben", "Danny"],
      xp: 5,
      questions: [
        {
          prompt: t("What is the tone of Rosa's letter?", "罗莎这封信的语气是怎样的？"),
          right: t("Excited and joyful", "兴奋又快乐"),
          wrong: [t("Bored and tired", "无聊又疲惫"), t("Sad and lonely", "伤心又孤单"), t("Calm and serious", "平静又严肃")],
          solution: t(
            'Rosa calls camp "the best place on the whole planet," uses exclamation marks, calls the cold water "wonderful," and begs, "Please, please can I stay for another week?"',
            "罗莎说夏令营是“the best place on the whole planet”，用了感叹号，把冷水说成“wonderful”，还恳求“Please, please can I stay for another week?”。",
          ),
        },
        {
          prompt: t("What is the tone of most of Danny's letter?", "丹尼这封信大部分的语气是怎样的？"),
          right: t("Grumpy, but in a joking way", "爱抱怨，但带着开玩笑的口吻"),
          wrong: [
            t("Truly frightened and in danger", "真的很害怕，处境危险"),
            t("Grateful and cheerful", "感激又开心"),
            t("Polite and formal, like a business letter", "礼貌而正式，像一封公务信"),
          ],
          solution: t(
            'Danny complains, but with jokes and exaggeration: the "land of mosquitoes," pancakes like "rubber," and "I will probably survive." He is not really in danger.',
            "丹尼在抱怨，但用的是玩笑和夸张：“land of mosquitoes”，像“rubber”一样的煎饼，还有“I will probably survive.”。他并没有真的遇到危险。",
          ),
        },
        {
          prompt: t("How does the tone change in the last lines of Danny's letter?", "丹尼信的最后几行里，语气有什么变化？"),
          right: t("It turns warmer, showing he is starting to enjoy camp", "语气变温和了，说明他开始喜欢夏令营了"),
          wrong: [
            t("It turns angrier, showing he wants to leave at once", "语气更生气了，说明他想马上离开"),
            t("It turns sadder, showing he misses Rosa", "语气更伤心了，说明他想念罗莎"),
            t("It stays exactly the same as the rest of the letter", "和信的其他部分完全一样"),
          ],
          solution: t(
            'In the last lines, after "One more thing," Danny calls the frog "the best frog" and says "Maybe one more week would be okay." After a whole letter of complaints, this is the first time he sounds happy.',
            "在最后几行（“One more thing”之后），丹尼说那只青蛙是“the best frog”，还说“Maybe one more week would be okay.”。在通篇抱怨之后，这是他第一次听起来很开心。",
          ),
        },
      ],
    },
  ],
};
