// Grades 9 to 12: the reading unit of the seventh theme, poems across time: the forms poets have used, each shown
// with an original poem written for the course.

import { type ReadingUnitDef, t } from "@ga/content";
import { ask, passage } from "../grades-6-8/reading-kit.ts";

const clues = { topic: "context-clues", weight: 0.2 } as const;
const poetic = { topic: "words-for-poetic-form", weight: 0.3 } as const;
const forms = { topic: "poetic-forms-and-meter", weight: 0.2 } as const;

/** poemsAcrossTime is a reading unit of grades 9 to 12 on poetic forms, each passage explaining one with a poem. */
export const poemsAcrossTime: ReadingUnitDef = {
  id: "poems-across-time",
  title: t("Poems Across Time", "穿越时代的诗歌"),
  passages: [
    passage(
      "the-sonnet-a-little-song",
      t("The Sonnet: A Little Song", "十四行诗：一首小歌"),
      `The word sonnet comes from an Italian word meaning "little song." The form was developed in Italy in the thirteenth century and became famous through the poet Petrarch, who wrote hundreds of sonnets to a woman named Laura. English poets took it up in the sixteenth century, and it has never gone out of fashion since.

A sonnet has fourteen lines, usually in iambic pentameter: each line has ten syllables in five pairs, with the stress on the second syllable of each pair, da-DUM da-DUM da-DUM da-DUM da-DUM. There are two main kinds. The Italian sonnet divides into eight lines, which present a problem or question, and six lines, which respond to it. The English sonnet, used by Shakespeare, has three groups of four lines followed by a couplet, two rhyming lines that often sum up the poem or give it a final twist.

The most important feature of a sonnet is the turn, sometimes called the volta: the moment when the poem changes direction. In an Italian sonnet, it usually comes after the eighth line. In an English sonnet, it often comes in the final couplet. Here is an original sonnet in the English form:

The clock above the kitchen door is slow;
my grandmother has never set it right.
She says the hours come and hours go
and minutes do not matter much at night.
She keeps her tea at twenty past eleven,
her letters in a drawer beside the stove,
her husband's photograph, who went to heaven,
his glasses, and the winter gloves she wove.
I used to think her careless with her time.
I set the clock myself one summer day.
She laughed and turned it back, as if a crime
had been committed. "Leave it slow," she'd say.
I understand it now. Some clocks are kind:
they let the ones we love fall less behind.

Notice how the final couplet turns the poem. The slow clock, which seemed careless, becomes an act of love.`,
      [clues, poetic, forms],
      [
        ask(
          t("What is the volta of a sonnet?", "十四行诗的 volta 是什么？"),
          t("The turn, where the poem changes direction", "转折，即诗歌改变方向的地方"),
          [
            t("The first line of the poem", "诗的第一行"),
            t("The poet's name", "诗人的名字"),
            t("A line with no rhyme", "一行不押韵的诗句"),
          ],
          t(
            "The passage says the most important feature is the turn, sometimes called the volta: the moment when the poem changes direction.",
            "文章说，最重要的特征是转折，有时称为 volta：诗歌改变方向的时刻。",
          ),
        ),
        ask(
          t("How is an English sonnet arranged?", "英式十四行诗是怎样编排的？"),
          t("Three groups of four lines followed by a couplet", "三组四行诗，后接一个对句"),
          [
            t("Eight lines followed by six lines", "八行之后接六行"),
            t("Seven pairs of rhyming lines", "七组押韵的对句"),
            t("Fourteen lines that do not rhyme", "十四行不押韵的诗句"),
          ],
          t(
            "The second paragraph says the English sonnet has three groups of four lines followed by a couplet.",
            "第二段说，英式十四行诗由三组四行诗加一个对句构成。",
          ),
        ),
        ask(
          t("What does the final couplet of the example sonnet reveal?", "示例十四行诗的最后对句揭示了什么？"),
          t("The slow clock is a way of keeping loved ones close", "走得慢的钟是一种让所爱之人不远离的方式"),
          [
            t("The grandmother cannot read a clock", "祖母不会看钟"),
            t("The speaker will buy a new clock", "说话者要买一个新钟"),
            t("The clock was broken by a crime", "钟被一起罪行弄坏了"),
          ],
          t(
            "The couplet says some clocks are kind and let the ones we love fall less behind; the slow clock becomes an act of love.",
            "对句说，有些钟是仁慈的，让我们所爱的人不至于落后太远；慢钟成了一种爱的表现。",
          ),
        ),
      ],
      ["Italian", "Italy", "Petrarch", "Laura", "English", "Shakespeare", "da-DUM", "she'd"],
    ),
    passage(
      "the-ballad-a-story-in-song",
      t("The Ballad: A Story in Song", "民谣：歌中的故事"),
      `Long before most people could read, they learned stories by listening to songs. Ballads were the news, gossip and history of ordinary people. They were sung in villages and at markets, passed from one singer to another and changed a little with each telling. Many old ballads tell of love, murder, shipwrecks and ghosts.

A ballad tells a story, usually in short stanzas of four lines called quatrains. Often the first and third lines have four stresses and the second and fourth have three, and the second and fourth lines rhyme. This pattern, sometimes called ballad meter, is easy to remember and to sing. Ballads also use repetition: a refrain, a line or group of lines that returns at the end of each stanza, gives listeners something to join in with.

Ballads usually begin in the middle of the action and move quickly. They leave out explanations and let dialogue carry much of the story. Here are four stanzas from an original ballad:

The fisher's wife stood on the shore
when all the boats came in.
She counted nine, she counted ten,
but not the boat of Lynn.
    And the gray waves rolled, the gray waves rolled.

"Oh, have you seen my husband's boat?"
she asked the oldest man.
"I saw it last by Raven Rock,
before the storm began."
    And the gray waves rolled, the gray waves rolled.

She lit a lamp in her window
and kept it burning bright,
for seven years, for seven years,
through every winter night.
    And the gray waves rolled, the gray waves rolled.

They say a boat came in one dawn
with no one at the oar,
and the lamp went out, and the wife was gone,
and was not seen any more.
    And the gray waves rolled, the gray waves rolled.

Notice how much is left unsaid. We never learn what happened to the husband, or where the wife went. The refrain, repeated unchanged, makes the sea seem patient and indifferent to human grief.`,
      [clues, poetic, forms],
      [
        ask(
          t("Why was ballad meter useful for ordinary people long ago?", "为什么民谣格律对古时的普通人很有用？"),
          t("It was easy to remember and to sing", "它便于记忆和歌唱"),
          [
            t("It could only be written by experts", "只有专家才能写"),
            t("It had no rhythm at all", "它完全没有节奏"),
            t("It was used only for prayers", "它只用于祈祷"),
          ],
          t(
            "The second paragraph says this pattern is easy to remember and to sing, which suited stories passed on by listening.",
            "第二段说，这种格律便于记忆和歌唱，适合靠聆听传播的故事。",
          ),
        ),
        ask(
          t("What is the refrain of the example ballad?", "示例民谣的叠句是什么？"),
          t('"And the gray waves rolled, the gray waves rolled."', "诗句“And the gray waves rolled, the gray waves rolled.”"),
          [
            t('"The fisher\'s wife stood on the shore"', "诗句“The fisher's wife stood on the shore”"),
            t('"for seven years, for seven years"', "诗句“for seven years, for seven years”"),
            t('"before the storm began"', "诗句“before the storm began”"),
          ],
          t(
            "A refrain returns at the end of each stanza; this line ends all four stanzas.",
            "叠句会在每一节末尾重复出现；这一行是四节的共同结尾。",
          ),
        ),
        ask(
          t("What effect does the unchanged refrain have, according to the passage?", "根据文章，一成不变的叠句产生了什么效果？"),
          t("It makes the sea seem patient and indifferent to human grief", "它让大海显得耐心而对人类的悲伤漠不关心"),
          [
            t("It explains what happened to the husband", "它解释了丈夫的遭遇"),
            t("It makes the story funny", "它让故事变得好笑"),
            t("It tells us the wife's name", "它告诉我们妻子的名字"),
          ],
          t(
            "The last paragraph says the refrain, repeated unchanged, makes the sea seem patient and indifferent to human grief.",
            "最后一段说，一成不变的叠句让大海显得耐心而对人类的悲伤漠然。",
          ),
        ),
      ],
      ["Lynn", "Raven", "Rock"],
    ),
    passage(
      "the-haiku-a-moment-held-still",
      t("The Haiku: A Moment Held Still", "俳句：定格的瞬间"),
      `The haiku is one of the shortest forms of poetry in the world, and one of the hardest to write well. It developed in Japan, where for centuries poets gathered to compose long chains of linked verses. The opening verse of such a chain, which set the season and the scene, gradually became a poem in its own right. In the seventeenth century, the poet Matsuo Basho made it an art.

In Japanese, a haiku is usually counted in sound units rather than syllables, in three parts of five, seven and five. When the form came into English, poets often copied this pattern as five, seven and five syllables. Many modern poets writing in English use fewer, because English syllables carry more sound than Japanese units, and a strict count can make a poem feel padded.

What matters more than counting is the spirit of the form. A traditional haiku presents a single moment from nature, usually with a word or image that suggests a season: cherry blossoms for spring, cicadas for summer, falling leaves for autumn, snow for winter. It often places two images side by side and lets the reader feel the connection between them, without explaining it. This is a kind of juxtaposition: the meaning lives in the gap between the two parts.

A haiku does not tell the reader what to feel. It shows something precisely, and trusts the reader. Here are three original haiku:

last bus of the night
the driver hums a love song
to the empty seats

heat on the sidewalk
a child draws a snowman
with blue chalk

after the funeral
my father's coat still holding
the shape of his arms

In each, two images meet. A lonely bus and a love song; summer heat and a snowman; a coat and an absence. The poems are short, but the feeling they leave behind lasts much longer than it takes to read them.`,
      [clues, poetic, forms],
      [
        ask(
          t("How did the haiku develop, according to the passage?", "根据文章，俳句是怎样发展起来的？"),
          t("From the opening verse of long chains of linked poems", "从长篇连句诗的开头一节发展而来"),
          [
            t("From English sonnets", "从英式十四行诗发展而来"),
            t("From songs sung at markets", "从集市上唱的歌发展而来"),
            t("From the stage directions of plays", "从剧本的舞台说明发展而来"),
          ],
          t(
            "The first paragraph says the opening verse of a chain of linked verses gradually became a poem in its own right.",
            "第一段说，连句诗的开头一节逐渐成为一首独立的诗。",
          ),
        ),
        ask(
          t("Why do many English-language poets use fewer than seventeen syllables?", "为什么许多英语诗人使用少于十七个音节？"),
          t("English syllables carry more sound, so a strict count can feel padded", "英语音节承载更多声音，严格计数会显得冗余"),
          [
            t("English has no syllables", "英语没有音节"),
            t("Basho forbade longer poems", "芭蕉禁止写更长的诗"),
            t("Short poems are easier to sell", "短诗更容易卖出去"),
          ],
          t(
            "The second paragraph says English syllables carry more sound than Japanese units, and a strict count can make a poem feel padded.",
            "第二段说，英语音节比日语音节承载更多声音，严格计数会让诗显得冗余。",
          ),
        ),
        ask(
          t("In the third haiku, what two things are placed side by side?", "在第三首俳句中，哪两样东西被并置在一起？"),
          t("A father's coat and the absence of the father", "父亲的外套与父亲的缺席"),
          [
            t("A bus and a snowman", "一辆公交车和一个雪人"),
            t("Cherry blossoms and snow", "樱花和雪"),
            t("A love song and blue chalk", "一首情歌和蓝色粉笔"),
          ],
          t(
            "The last paragraph names the pairs: in the third poem, a coat and an absence, since the coat still holds the shape of his arms.",
            "最后一段点出了各组意象：第三首中是外套与缺席，因为外套仍保留着他手臂的形状。",
          ),
        ),
      ],
      ["Japan", "Japanese", "Matsuo", "Basho", "English"],
    ),
    passage(
      "the-elegy-words-for-the-dead",
      t("The Elegy: Words for the Dead", "挽歌：献给逝者的文字"),
      `People have always used poetry to mourn. In ancient Greece, an elegy was any poem written in a particular meter, but over time the word came to mean a poem of grief, usually for someone who has died. Elegies have been written for kings and friends, for parents and children, for animals, for cities destroyed in war and even for ways of life that have disappeared.

Many elegies follow a similar movement, though not every poem uses all its stages. They often begin with grief, sometimes with anger or disbelief that the death has happened. They may praise the dead person, recalling their qualities and the details of their life. Finally, many elegies move toward consolation, some kind of comfort: the belief that the dead live on in memory, in nature or in the people they influenced.

Older elegies were often formal, using elaborate language and references to myths. Modern elegies are usually more personal and plain. Their power often comes from small, concrete details: a habit, a voice, an object left behind. A detail can carry more grief than a statement of grief, because it makes the reader feel the loss instead of being told about it.

Here is an original elegy:

For my uncle, who fixed things

You could take apart a radio
and put it back with one screw left,
and laugh, and say it never needed that one.
You fixed our gate, our clock, my bicycle chain,
the neighbor's fence, the church's furnace,
never for money, always with the same
gray toolbox and the same bad joke.
The gate still sticks the way you said it would.
I have your toolbox now. I cannot fix
a single thing in it except the lid,
which closes, every time, on what you left.

The poem contains no direct statement of grief. Instead, the toolbox, the gate and the joke make the uncle real, and the final lines find consolation and pain in the same object.`,
      [clues, poetic, forms],
      [
        ask(
          t("What does the word consolation mean in the second paragraph?", "第二段中的 consolation 是什么意思？"),
          t("Comfort after a loss", "失去之后的安慰"),
          [
            t("A list of the dead person's faults", "逝者缺点的清单"),
            t("Anger at the death", "对死亡的愤怒"),
            t("A kind of meter", "一种格律"),
          ],
          t(
            "The passage defines consolation as some kind of comfort, such as the belief that the dead live on in memory.",
            "文章把 consolation 定义为某种安慰，比如相信逝者活在记忆中。",
          ),
        ),
        ask(
          t("Why can a small detail carry more grief than a statement of grief?", "为什么一个小细节比直接表达悲伤更能传达悲伤？"),
          t("It makes the reader feel the loss instead of being told about it", "它让读者感受到失去，而不是被告知失去"),
          [
            t("Details are always sad", "细节总是悲伤的"),
            t("Readers do not like long poems", "读者不喜欢长诗"),
            t("Statements of grief are not allowed in elegies", "挽歌中不允许直接表达悲伤"),
          ],
          t(
            "The third paragraph says a detail makes the reader feel the loss instead of being told about it.",
            "第三段说，细节让读者感受到失去，而不是被告知。",
          ),
        ),
        ask(
          t(
            "In the last lines, why does the toolbox hold both consolation and pain?",
            "在最后几行中，为什么工具箱既承载着安慰又承载着痛苦？",
          ),
          t("It keeps what the uncle left, but the speaker cannot use it as he did", "它保存着叔叔留下的东西，但说话者无法像他那样使用"),
          [
            t("It is broken and must be thrown away", "它坏了，必须扔掉"),
            t("It was bought with the uncle's money", "它是用叔叔的钱买的"),
            t("It belongs to the neighbor", "它属于邻居"),
          ],
          t(
            "The speaker has the toolbox but cannot fix anything except its lid, which closes on what the uncle left: comfort and loss together.",
            "说话者拥有这个工具箱，却只会修它的盖子，而盖子合上的正是叔叔留下的东西：安慰与失去并存。",
          ),
        ),
      ],
      ["Greece"],
    ),
    passage(
      "the-ode-a-song-of-praise",
      t("The Ode: A Song of Praise", "颂歌：赞美之歌"),
      `If an elegy mourns, an ode celebrates. An ode is a poem of praise, usually addressed directly to its subject, and it treats that subject with great seriousness and feeling. The form goes back to ancient Greece, where the poet Pindar wrote odes honoring the winners of athletic contests. These were performed with music and dancing, and they were long and complex.

The great English Romantic poets of the early nineteenth century made the ode a vehicle for deep reflection. John Keats wrote odes to a nightingale, to autumn and to a Greek vase, using each object as a way of thinking about beauty, time and death. In these poems, the speaker often begins by praising the subject and ends having discovered something about life.

Modern poets have taken the ode in surprising directions. The Chilean poet Pablo Neruda wrote a whole series of odes to everyday things: to his socks, to an onion, to salt, to a tomato. By praising something ordinary with the same seriousness once reserved for heroes and gods, he made readers see the beauty in what they usually ignore.

An ode often uses apostrophe, a figure of speech in which the speaker addresses something that cannot answer: an object, an idea, a dead person or an absent one. "O wild West Wind," begins one famous English ode. Apostrophe gives the poem an intimate, urgent voice, as if the speaker were talking to a friend.

Here is part of an original ode in the modern style:

Ode to My Old Sneakers

O sneakers, gray as rain,
laces knotted where they broke,
you have carried me to every
first day of school, and home again,
across the field where I lost the race
and the field where, a year later, I won.
You do not care which.
You only ask to be taken
somewhere, anywhere, again.

The ode praises a humble object, and in the last lines the sneakers become a lesson: keep going, whatever happened last time.`,
      [clues, poetic, forms],
      [
        ask(
          t("How did Pablo Neruda's odes differ from older ones?", "巴勃罗·聂鲁达的颂歌与以往的颂歌有什么不同？"),
          t("He praised ordinary, everyday things", "他赞美平凡的日常事物"),
          [
            t("He praised only kings and gods", "他只赞美国王和神"),
            t("He never addressed his subjects", "他从不直接对歌颂对象说话"),
            t("He wrote only about death", "他只写死亡"),
          ],
          t(
            "The third paragraph says Neruda wrote odes to his socks, an onion, salt and a tomato, praising the ordinary.",
            "第三段说，聂鲁达为他的袜子、洋葱、盐和番茄写颂歌，赞美平凡之物。",
          ),
        ),
        ask(
          t("What is apostrophe, as the passage uses the word?", "文章中使用的 apostrophe 一词是什么意思？"),
          t("Speaking to something that cannot answer", "对无法回应的事物说话"),
          [
            t("A punctuation mark showing possession", "表示所属关系的标点符号"),
            t("A rhyme at the end of every line", "每行末尾的押韵"),
            t("A poem written for a contest", "为比赛而写的诗"),
          ],
          t(
            "The fourth paragraph defines apostrophe as a figure of speech in which the speaker addresses something that cannot answer.",
            "第四段把 apostrophe 定义为一种修辞手法，即说话者对无法回应的事物说话。",
          ),
        ),
        ask(
          t("What lesson do the sneakers come to represent?", "这双运动鞋最终代表了什么启示？"),
          t("Keep going, whatever happened last time", "无论上次发生了什么，都要继续前行"),
          [
            t("Always buy new shoes", "总是买新鞋"),
            t("Never run a race", "永远不要参加赛跑"),
            t("Winning is all that matters", "赢才是最重要的"),
          ],
          t(
            "The sneakers do not care whether the speaker lost or won; they only ask to be taken somewhere again.",
            "运动鞋不在乎说话者是输是赢；它们只求再次被带往某个地方。",
          ),
        ),
      ],
      ["Greece", "Pindar", "English", "Romantic", "John", "Keats", "Greek", "Chilean", "Pablo", "Neruda", "West", "Wind"],
    ),
    passage(
      "breaking-the-line",
      t("Breaking the Line", "断行的艺术"),
      `Prose runs from margin to margin; poetry stops where the poet decides. That decision, where to end a line, is one of the most powerful tools a poet has, and it is the main difference between poetry and prose on the page.

When a line ends at a natural pause, such as the end of a sentence or a phrase, it is called end-stopped. End-stopped lines feel complete and steady:

The rain came down all afternoon.
We stayed inside and read.

When the sentence continues past the end of the line, it is called enjambment. The reader's eye has to move to the next line to finish the thought. Enjambment can create surprise, suspense or a double meaning:

I did not want to leave
you there, beside the road,
alone.

Read slowly, the first line seems to mean "I did not want to leave" at all. Then the next line changes it. The single word alone, set on its own line, gains enormous weight. In prose, the same words would simply read: "I did not want to leave you there, beside the road, alone." The meaning is identical, but the feeling is not.

Free verse is poetry that does not follow a regular meter or rhyme scheme. It is sometimes thought to be easier than formal poetry, but in free verse the line break does even more work, because there is no pattern to rely on. Every line must earn its place. The American poet Walt Whitman, writing in the nineteenth century, used long, flowing lines that seemed to embrace the whole country. Many later poets have used very short lines to slow the reader down, making each word stand out.

When you read a poem, notice where its lines end. Ask what word sits at the end of each line, what word begins the next, and how the poem would feel if the breaks came somewhere else. The white space on the page is part of the poem.`,
      [clues, poetic, forms],
      [
        ask(
          t("What is enjambment?", "什么是跨行？"),
          t("A sentence continuing past the end of a line", "句子延续到下一行"),
          [
            t("A line that ends at a natural pause", "在自然停顿处结束的一行"),
            t("A poem with no lines at all", "完全没有分行的诗"),
            t("A rhyme between two lines", "两行之间的押韵"),
          ],
          t(
            "The passage says that when the sentence continues past the end of the line, it is called enjambment.",
            "文章说，当句子越过行尾继续下去时，这称为跨行。",
          ),
        ),
        ask(
          t("Why does the word alone gain weight in the example?", "为什么在例子中 alone 一词分量很重？"),
          t("It is set on its own line, after the reader has waited for it", "它单独占一行，读者是等了一会儿才读到它的"),
          [
            t("It is printed in capital letters", "它用大写字母印刷"),
            t("It rhymes with the first line", "它与第一行押韵"),
            t("It is repeated many times", "它被重复了很多次"),
          ],
          t(
            "The passage says the single word alone, set on its own line, gains enormous weight.",
            "文章说，单独一行的 alone 一词获得了极大的分量。",
          ),
        ),
        ask(
          t("Why does the line break do even more work in free verse?", "为什么在自由诗中断行的作用更大？"),
          t("There is no regular meter or rhyme to rely on", "没有固定的格律或韵式可以依赖"),
          [
            t("Free verse has no lines", "自由诗没有分行"),
            t("Free verse is always very short", "自由诗总是很短"),
            t("Free verse was invented by Whitman", "自由诗是惠特曼发明的"),
          ],
          t(
            "The passage says that in free verse the line break does even more work, because there is no pattern to rely on.",
            "文章说，在自由诗中断行作用更大，因为没有模式可以依赖。",
          ),
        ),
      ],
      ["American", "Walt", "Whitman"],
    ),
    passage(
      "hearing-the-beat",
      t("Hearing the Beat", "听出节拍"),
      `Every word in English has a pattern of stresses. Say the word banana, and you hear that the middle syllable is stronger: ba-NA-na. Say the word yesterday, and the first is strongest: YES-ter-day. Poets arrange these stresses to create rhythm, and when the rhythm follows a regular pattern, we call it meter.

The basic unit of meter is the foot, a small group of syllables. The most common foot in English is the iamb, an unstressed syllable followed by a stressed one, as in the word today or the phrase the sun. A line of five iambs is called iambic pentameter, and it is the meter of Shakespeare's plays and of many sonnets. It is close to the natural rhythm of English speech, which may explain why it has lasted so long.

Other feet create different effects. The trochee reverses the iamb, stressed then unstressed, as in garden or happy. Lines of trochees can sound like a chant or a spell: "DOUble, DOUble, TOIL and TROUble." The anapest has two unstressed syllables and then a stress, as in understand, and it creates a galloping rhythm often used in comic verse.

Poets rarely follow a meter perfectly. A skilled poet varies the pattern to create emphasis. If a poem in steady iambs suddenly begins a line with a stressed syllable, the change catches the reader's ear and draws attention to that word.

To hear the meter of a line, read it aloud naturally, not in a sing-song voice, and mark the syllables you stress. Then look for the pattern. Consider this original line:

The wind came down the valley like a train.

Read aloud, it falls into five iambs: the WIND / came DOWN / the VAL / ley LIKE / a TRAIN. The steady beat suits the image of a train, moving with force and regularity. Meter, at its best, is not decoration; it makes the sound of a line match its sense.`,
      [clues, poetic, forms, { topic: "academic-words-2", weight: 0.1 }],
      [
        ask(
          t("What is an iamb?", "什么是抑扬格音步？"),
          t("An unstressed syllable followed by a stressed one", "一个非重读音节后接一个重读音节"),
          [
            t("A stressed syllable followed by an unstressed one", "一个重读音节后接一个非重读音节"),
            t("Two unstressed syllables and a stress", "两个非重读音节后接一个重读音节"),
            t("A line of fourteen syllables", "一行十四个音节"),
          ],
          t(
            "The second paragraph defines the iamb as an unstressed syllable followed by a stressed one, as in today.",
            "第二段把抑扬格音步定义为非重读音节后接重读音节，如 today。",
          ),
        ),
        ask(
          t("Why might iambic pentameter have lasted so long in English poetry?", "为什么抑扬格五音步在英语诗歌中能流传这么久？"),
          t("It is close to the natural rhythm of English speech", "它接近英语口语的自然节奏"),
          [
            t("It is the only meter allowed in plays", "它是戏剧中唯一允许的格律"),
            t("It was invented in Japan", "它是在日本发明的"),
            t("It has no stressed syllables", "它没有重读音节"),
          ],
          t(
            "The second paragraph says it is close to the natural rhythm of English speech, which may explain why it has lasted.",
            "第二段说，它接近英语口语的自然节奏，这或许能解释它为何经久不衰。",
          ),
        ),
        ask(
          t("Why might a skilled poet break the regular pattern of a meter?", "为什么一位高明的诗人可能会打破格律的固定模式？"),
          t("To create emphasis by catching the reader's ear", "为了引起读者注意，从而形成强调"),
          [
            t("Because they cannot count syllables", "因为他们不会数音节"),
            t("To make the poem easier to sing", "为了让诗更容易唱"),
            t("To hide the poem's meaning", "为了隐藏诗的含义"),
          ],
          t(
            "The fourth paragraph says a skilled poet varies the pattern to create emphasis, as the change catches the reader's ear.",
            "第四段说，高明的诗人会改变模式来形成强调，因为这种变化会吸引读者的耳朵。",
          ),
        ),
      ],
      [
        "English",
        "Shakespeare's",
        "ba-NA-na",
        "YES-ter-day",
        "DOUble",
        "TOIL",
        "TROUble",
        "WIND",
        "DOWN",
        "VAL",
        "LIKE",
        "TRAIN",
        "sing-song",
      ],
    ),
    passage(
      "two-poems-one-river",
      t("Two Poems, One River", "两首诗，一条河"),
      `One of the best ways to understand how form shapes meaning is to compare two poems on the same subject. Here are two original poems about a river, written in very different forms.

The first is a rhyming quatrain in regular meter:

The river runs beside the mill
as it has run a hundred years;
it does not hurry, does not still,
and does not stop for human tears.

The second is free verse:

The river
does not know
my name.
I have thrown
stones in it, and wishes,
and once, a letter
I could not send.
It took them all
and went on
being a river.

Both poems describe a river that is indifferent to human feelings. But they feel very different.

The quatrain is steady and complete. Its regular rhythm imitates the steady flow of the river, and its rhymes, mill and still, years and tears, make the lines feel fixed, as permanent as the river itself. The speaker stands at a distance, describing the river in general terms. The poem sounds like a truth that has always been known.

The free-verse poem is personal and broken. Its short lines slow the reader down, and the line breaks create small surprises: "and once, a letter / I could not send." We wonder what the letter was, and why it could not be sent. The speaker is inside the poem, with a private history. The final lines, "and went on / being a river," are almost humorous, yet they carry the same message as the quatrain: the river does not stop for human grief.

Neither form is better. The quatrain offers the comfort of order and the authority of tradition. The free verse offers intimacy and the sense of a real person thinking aloud. A poet chooses a form the way a painter chooses a brush, knowing that the choice will shape everything the reader feels.`,
      [clues, poetic, forms, { topic: "academic-words-1", weight: 0.1 }],
      [
        ask(
          t("What do both poems say about the river?", "两首诗对这条河说了什么共同的话？"),
          t("It is indifferent to human feelings", "它对人类的感情漠不关心"),
          [
            t("It is dangerous and must be avoided", "它很危险，必须避开"),
            t("It is about to dry up", "它即将干涸"),
            t("It flows faster every year", "它一年比一年流得快"),
          ],
          t(
            "The passage says both poems describe a river that is indifferent to human feelings.",
            "文章说，两首诗都描写了一条对人类感情漠然的河。",
          ),
        ),
        ask(
          t("How does the quatrain's form match its subject?", "四行诗的形式如何与其主题相配？"),
          t("Its regular rhythm and rhymes imitate the river's steady, permanent flow", "规律的节奏和韵脚模仿了河流稳定而恒久的流动"),
          [
            t("Its broken lines show the river is drying up", "断开的诗行表明河流正在干涸"),
            t("It has no rhythm, like a still pond", "它没有节奏，就像一潭死水"),
            t("Its rhymes make the poem funny", "它的韵脚让诗变得好笑"),
          ],
          t(
            "The passage says the regular rhythm imitates the steady flow, and the rhymes make the lines feel as permanent as the river.",
            "文章说，规律的节奏模仿稳定的水流，韵脚让诗行显得像河流一样恒久。",
          ),
        ),
        ask(
          t("What does the comparison of a poet's form to a painter's brush suggest?", "把诗人选择形式比作画家选择画笔，暗示了什么？"),
          t("The choice of form shapes how the reader feels", "形式的选择会影响读者的感受"),
          [
            t("Poets should also paint", "诗人也应该画画"),
            t("Free verse is better than rhyme", "自由诗比押韵诗好"),
            t("Form does not matter at all", "形式一点都不重要"),
          ],
          t(
            "The last paragraph says neither form is better and that the choice will shape everything the reader feels.",
            "最后一段说，两种形式没有高下之分，形式的选择会影响读者的全部感受。",
          ),
        ),
      ],
    ),
  ],
};
