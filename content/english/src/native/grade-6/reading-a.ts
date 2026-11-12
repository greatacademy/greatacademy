// Grade 6: reading: archetypes, figurative language, a poem beside a story, causes in history, the job of a sentence,
// how an idea is developed, technical words and the features of a science text.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, rival, topic } from "./kit.ts";

const archetypes = topic("reading", {
  id: "archetypes-in-stories",
  title: ["Archetypes in Stories", "故事中的原型"],
  summary: [
    "Characters and plots that appear in stories all over the world: the hero, the mentor, the trickster; the quest, the test, the return home.",
    "出现在世界各地故事中的人物和情节：英雄、导师、骗子；探险、考验、归乡。",
  ],
  after: ["plot-and-conflict"],
  points: [
    label(
      "character-archetypes",
      ["Character Archetypes", "人物原型"],
      [
        "An **archetype** is a kind of character or plot so common that readers everywhere recognize it. The **hero** leaves home and faces danger. The **mentor** is an older, wiser guide who teaches or gives a gift. The **trickster** wins by cleverness and breaks the rules. The **villain** works against the hero. The **sidekick** is the hero's loyal companion. Knowing them helps you predict what a character will do.",
        "**原型**是一种非常常见、各地读者都能认出的人物或情节。**英雄**离开家园、面对危险。**导师**是年长而睿智的引导者，传授本领或赠送礼物。**骗子**靠机智取胜，不守规矩。**反派**与英雄作对。**伙伴**是英雄忠诚的同伴。了解这些原型，有助于预测人物的行为。",
      ],
      ["Which archetype is this character?", "这个人物属于哪种原型？"],
      `
        An old woman in the forest gives the young prince a magic thread and teaches him to read the stars.|the mentor
        A boy leaves his village to find the cure for a sickness that is spreading through his land.|the hero
        Anansi the spider fools the sky god with a clever bargain and steals all the stories in the world.|the trickster
        A cruel sorcerer wants to freeze the kingdom so that he alone can rule it.|the villain
        A talking goat follows the girl on her journey, carrying her bags and cheering her up.|the sidekick
        A retired sea captain shows the orphan how to sail and gives him his old compass.|the mentor
        A farmer's daughter climbs the mountain to face the dragon that burns the crops.|the hero
        Coyote tricks the other animals into giving him the best seat at the feast.|the trickster
        The jealous queen sends a hunter to get rid of the princess.|the villain
        The knight's loyal squire stays by his side through every battle.|the sidekick
        A wise owl tells the lost rabbit which path will lead her home and why.|the mentor
        A shy girl steps forward to carry the torch through the dark caves.|the hero
        A fox talks the crow into singing so that the cheese falls from its beak.|the trickster
        A pirate king captures ships and wants the hero's treasure map.|the villain
        The young wizard's best friend helps him solve every puzzle on the quest.|the sidekick
        An old blacksmith forges a sword for the young warrior and teaches her to use it.|the mentor
        A tailor's son sets out alone to rescue his sister from the giant's castle.|the hero
        Br'er Rabbit escapes by begging the fox not to throw him into the briar patch.|the trickster
        A greedy merchant poisons the town's well to buy the land cheaply.|the villain
        A brave little dog travels with the boy and warns him of danger.|the sidekick
        The village elder gives the traveler three pieces of advice before she leaves.|the mentor
        A young fisherman sails past the edge of the map to find the lost island.|the hero
        Loki changes into a fly and bites the dwarf to ruin his work.|the trickster
        A giant guards the bridge and eats anyone who tries to cross.|the villain
        The princess's faithful maid helps her escape through the kitchen.|the sidekick
        A retired coach trains the new player and teaches her never to quit.|the mentor
        A girl from a poor family enters the great contest to save her home.|the hero
        A monkey fools the crocodile into thinking he left his heart in a tree.|the trickster
        An evil emperor builds a wall to keep the people from leaving.|the villain
        The hero's cheerful cousin rides with him and makes him laugh on the long road.|the sidekick
      `,
      {
        "the hero": {
          zh: "英雄",
          why: [
            "The character leaves the safety of home to face a challenge for others; that is the hero.",
            "这个人物离开安全的家，为了他人去面对挑战，这就是英雄。",
          ],
          not: [
            "The hero is the one who sets out and faces the main challenge, which this character does not do.",
            "英雄是出发去面对主要挑战的人，这个人物并没有这样做。",
          ],
        },
        "the mentor": {
          zh: "导师",
          why: [
            "An older, wiser character teaches or gives a gift to help someone else; that is the mentor.",
            "一个年长睿智的人物传授本领或赠送礼物来帮助别人，这就是导师。",
          ],
          not: [
            "The mentor teaches or gives a gift to someone younger, which this character does not do.",
            "导师向年轻人传授本领或赠送礼物，这个人物并没有这样做。",
          ],
        },
        "the trickster": {
          zh: "骗子",
          why: [
            "The character wins by cleverness and tricks rather than by strength; that is the trickster.",
            "这个人物靠机智和计谋而不是力量取胜，这就是骗子。",
          ],
          not: [
            "The trickster wins by fooling others, which is not what this character does.",
            "骗子靠愚弄别人取胜，这不是这个人物的做法。",
          ],
        },
        "the villain": {
          zh: "反派",
          why: [
            "The character works to harm others for power or greed; that is the villain.",
            "这个人物为了权力或贪欲而伤害他人，这就是反派。",
          ],
          not: [
            "The villain works against others out of greed or cruelty, which this character does not do.",
            "反派出于贪婪或残忍与他人作对，这个人物并没有这样做。",
          ],
        },
        "the sidekick": {
          zh: "伙伴",
          why: [
            "The character stays loyally beside the hero and helps along the way; that is the sidekick.",
            "这个人物忠诚地陪在英雄身边，一路相助，这就是伙伴。",
          ],
          not: [
            "The sidekick is the hero's loyal companion on the journey, which this character is not.",
            "伙伴是英雄旅途中忠诚的同伴，这个人物不是。",
          ],
        },
      },
    ),
    label(
      "plot-archetypes",
      ["Plot Archetypes", "情节原型"],
      [
        "Plots have archetypes too. In **the quest**, the hero travels to find or win something. In **the test**, the hero must prove courage, honesty or wisdom. In **the return home**, the hero comes back changed and shares what was gained. In **rags to riches**, a poor or unnoticed person rises to good fortune. In **the fall**, a proud person loses everything through a weakness of their own.",
        "情节也有原型。在**探险**中，英雄出发去寻找或赢得某样东西。在**考验**中，英雄必须证明自己的勇气、诚实或智慧。在**归乡**中，英雄带着改变回到家乡，与人分享所得。在**由贫到富**中，一个贫穷或不起眼的人交上了好运。在**堕落**中，一个骄傲的人因自身的弱点失去一切。",
      ],
      ["Which plot archetype does this story follow?", "这个故事遵循哪种情节原型？"],
      `
        A girl crosses three kingdoms to find the golden apple that will heal her father.|the quest
        To enter the king's guard, a boy must stand all night in the cold without moving.|the test
        After ten years at sea, a sailor comes back to his village and teaches the young ones what he learned.|the return home
        A kitchen servant is noticed by the prince and becomes the princess of the land.|rags to riches
        A proud king ignores every warning and loses his kingdom to a flood he caused.|the fall
        Three brothers set out to find the bird whose song can make a garden bloom.|the quest
        A wise woman asks the traveler a riddle; only a true answer will open the gate.|the test
        After the war, the old soldier walks home and plants a garden where his house stood.|the return home
        A poor boy who sells newspapers grows up to own the biggest newspaper in the city.|rags to riches
        A boastful runner refuses to train, grows lazy and loses every race to the young.|the fall
        A knight rides to the end of the world to find the cup that grants long life.|the quest
        The princess must choose between a box of gold and a box of lead, and only one holds the ring.|the test
        A girl who ran away to the city comes back to the farm and saves it with what she learned.|the return home
        An orphan who sweeps chimneys inherits a fortune from a stranger he once helped.|rags to riches
        A greedy merchant cheats his partners until no one will trade with him and he loses his shop.|the fall
        A young herder climbs the highest peak to bring back fire for her freezing village.|the quest
        To win the lord's daughter, the young man must tell the truth even when it costs him.|the test
        After many years away, the explorer returns to her town with seeds of a new crop.|the return home
        The youngest, smallest son of a poor miller ends up living in a castle.|rags to riches
        A powerful general grows so proud that he insults the gods and is struck down.|the fall
        Two friends search the desert for the lost city that their grandfather drew on a map.|the quest
        The apprentice is left alone with the master's gold to see whether she will steal it.|the test
        The prince comes back from his long exile wiser and kinder, and the people welcome him.|the return home
        A girl who grew up in a tiny shack becomes a famous singer heard around the world.|rags to riches
        A rich man who scorns the poor loses his wealth in one night and has to beg.|the fall
        A boy follows the river to its source to find out why it has stopped flowing.|the quest
        The hero must carry a full bowl of water across the bridge without spilling a drop.|the test
        The traveler finally reaches his old home and sees it with new eyes.|the return home
        A street sweeper invents a machine and becomes the richest person in the town.|rags to riches
        An emperor who believes he can never be wrong ruins his empire with one bad law.|the fall
      `,
      {
        "the quest": {
          zh: "探险",
          why: ["The story is a journey to find or win something; that is the quest.", "故事是一段寻找或赢得某样东西的旅程，这就是探险。"],
          not: [
            "The quest is a journey to find or win something, which is not what this story is about.",
            "探险是寻找或赢得某样东西的旅程，这个故事讲的不是这个。",
          ],
        },
        "the test": {
          zh: "考验",
          why: [
            "The hero must prove a quality such as courage, honesty or wisdom; that is the test.",
            "英雄必须证明勇气、诚实或智慧等品质，这就是考验。",
          ],
          not: [
            "The test asks the hero to prove a quality, which is not what happens here.",
            "考验要求英雄证明某种品质，这里发生的不是这个。",
          ],
        },
        "the return home": {
          zh: "归乡",
          why: [
            "The hero comes back home changed and brings back what was gained; that is the return home.",
            "英雄带着改变回到家乡，带回了所得，这就是归乡。",
          ],
          not: [
            "The return home is about coming back changed, which is not what this story is about.",
            "归乡讲的是带着改变回来，这个故事讲的不是这个。",
          ],
        },
        "rags to riches": {
          zh: "由贫到富",
          why: [
            "A poor or unnoticed person rises to good fortune; that is rags to riches.",
            "一个贫穷或不起眼的人交上了好运，这就是由贫到富。",
          ],
          not: [
            "Rags to riches is about a poor person rising, which is not what happens here.",
            "由贫到富讲的是穷人发迹，这里发生的不是这个。",
          ],
        },
        "the fall": {
          zh: "堕落",
          why: [
            "A proud or powerful person loses everything through a weakness of their own; that is the fall.",
            "一个骄傲或有权势的人因自身的弱点失去一切，这就是堕落。",
          ],
          not: [
            "The fall is about a proud person ruined by a weakness, which is not what this story is about.",
            "堕落讲的是骄傲的人因弱点而毁灭，这个故事讲的不是这个。",
          ],
        },
      },
    ),
  ],
});

const figurativeLabels: Readonly<Record<string, Label>> = {
  literal: {
    zh: "字面意思",
    why: ["The words mean exactly what they say; nothing is compared or exaggerated.", "这些词就是字面上的意思，没有比较，也没有夸张。"],
    not: ["The words do not mean exactly what they say, so they are not literal.", "这些词并不是字面上的意思，所以不是字面用法。"],
  },
  "a comparison": {
    zh: "比喻",
    why: [
      "One thing is compared to another, with or without *like* or *as*: a simile or a metaphor.",
      "把一样东西比作另一样东西，用或不用 *like*、*as*：明喻或暗喻。",
    ],
    not: [
      "Nothing here is said to be like, or to be, something else, so it is not a comparison.",
      "这里没有说某物像另一物或就是另一物，所以不是比喻。",
    ],
  },
  "an exaggeration": {
    zh: "夸张",
    why: ["It stretches the truth far beyond what is possible to make a point: hyperbole.", "它把事实夸大到不可能的程度来强调观点：夸张。"],
    not: ["Nothing here is stretched beyond what is possible, so it is not hyperbole.", "这里没有夸大到不可能的程度，所以不是夸张。"],
  },
  "a human quality": {
    zh: "拟人",
    why: ["Something that is not human is given a human action or feeling: personification.", "把人的动作或感情赋予非人的事物：拟人。"],
    not: ["Nothing here gives a human action or feeling to a thing or an animal.", "这里没有把人的动作或感情赋予事物或动物。"],
  },
};

const figurative = topic("reading", {
  id: "figurative-or-literal",
  title: ["Figurative or Literal", "比喻义还是字面义"],
  summary: [
    "Literal words mean just what they say; figurative words compare, exaggerate or give human qualities to make a picture in the reader's mind.",
    "字面用法的词就是字面意思；比喻用法的词通过比较、夸张或拟人，在读者脑海中描绘画面。",
  ],
  after: ["personification-and-hyperbole"],
  points: [
    label(
      "literal-or-which-figure",
      ["Literal or Figurative", "字面还是比喻"],
      [
        "Read the words in italics and ask: could this be exactly true? If yes, it is **literal**. If not, it is figurative, and you can name the kind: **a comparison** (simile or metaphor: *her voice was honey*), **an exaggeration** (hyperbole: *I've told you a million times*) or **a human quality** given to a thing (personification: *the wind whispered*). The same word can be literal in one sentence and figurative in another.",
        "读斜体部分并问自己：这可能完全是真的吗？如果是，就是**字面**用法。如果不是，就是比喻用法，还可以说出类型：**比喻**（明喻或暗喻：*her voice was honey*）、**夸张**（*I've told you a million times*）或赋予事物**人的特征**（拟人：*the wind whispered*）。同一个词在一个句子中是字面义，在另一个句子中可能是比喻义。",
      ],
      ["How are the words in italics used?", "斜体部分是怎样用的？"],
      `
        The baby *was a little ray of sunshine* all afternoon.|a comparison
        After the hike, my backpack *weighed a ton*.|an exaggeration
        The old door *groaned* as we pushed it open.|a human quality
        The farmer *carried a heavy sack* of grain to the barn.|literal
        His words *cut like a knife*.|a comparison
        I waited *forever* for the bus this morning.|an exaggeration
        The leaves *danced* across the empty street.|a human quality
        The cook *cut the bread* with a sharp knife.|literal
        The classroom *was a zoo* before the teacher came in.|a comparison
        She has *a million* things to do today.|an exaggeration
        The sun *smiled down* on the picnic.|a human quality
        The zookeeper *fed the lions* at noon.|literal
        My little brother eats *like a horse*.|a comparison
        The pie was so good I could have *eaten a hundred* of them.|an exaggeration
        The thunder *grumbled* in the distance.|a human quality
        The thunder *was loud* enough to wake us.|literal
        Her eyes *were stars* in the dark room.|a comparison
        The line for the ride *stretched for miles*.|an exaggeration
        The flowers *nodded* their heads in the breeze.|a human quality
        The flowers *grew tall* by the fence.|literal
        The lake *was a mirror* in the still morning.|a comparison
        My feet are *killing me* after the race.|an exaggeration
        The car *coughed* and refused to start.|a human quality
        We *walked for two miles* along the shore.|literal
        The snow *was a white blanket* over the town.|a comparison
        I'm so hungry I could *eat a whale*.|an exaggeration
        The kettle *sang* on the stove.|a human quality
        The kettle *boiled* on the stove.|literal
        The runner *flew like the wind* to the finish.|a comparison
        That joke is *as old as the hills*.|an exaggeration
      `,
      figurativeLabels,
    ),
    choose(
      "what-the-figure-means",
      ["What the Figure Means", "比喻的意思"],
      [
        "To understand figurative language, ask what quality the writer wants you to see. *The classroom was a zoo* does not mean there were animals; it means the room was **wild and noisy**. Choose the meaning that keeps the feeling of the picture, not the meaning of the words taken one by one.",
        "理解比喻性语言时，要问作者想让你看到什么特点。*The classroom was a zoo* 并不是说教室里有动物，而是说教室里**又乱又吵**。选择保留画面感受的意思，而不是逐字理解的意思。",
      ],
      ["What do the words in italics mean?", "斜体部分是什么意思？"],
      `
        The classroom *was a zoo* before the teacher came in.|wild and noisy|full of animals|very quiet and calm
        My backpack *weighed a ton*.|very heavy|exactly one ton in weight|light and easy to carry
        Her words *cut like a knife*.|hurt someone's feelings badly|were written with a knife|were kind and gentle
        The baby *was a ray of sunshine*.|cheerful and pleasant|was very bright and hot|was crying all day
        His heart *was a stone* when he heard their excuses.|unmoved and unkind|heavy in his chest|soft and forgiving
        The news *spread like wildfire*.|became known very fast|started a fire in town|was kept a secret
        The old car *coughed* and stopped.|made rough noises before failing|had caught a cold|ran smoothly and quietly
        She *has a heart of gold*.|is very kind|owns a gold necklace|is selfish and mean
        The test *was a breeze*.|was very easy|was taken outside in the wind|was extremely hard
        The runner *flew* to the finish line.|ran very fast|traveled in a plane|walked slowly
        Time *crawled* during the long lesson.|seemed to pass very slowly|moved on hands and knees|passed very quickly
        The city *never sleeps*.|is busy at all hours|has people who never go to bed|is quiet every night
        He *was boiling* with anger.|was very angry|had a high fever|was calm and relaxed
        The idea *was a seed* that grew into a business.|was a small beginning|was planted in soil|was the end of the plan
        Grandpa *is a walking dictionary*.|knows the meaning of many words|is made of paper|forgets words often
        The wind *howled* all night.|blew loudly and wildly|was a wolf outside|was soft and still
        The room *was an oven* in July.|was very hot|was used for baking|was cool and fresh
        My sister *is a night owl*.|likes to stay up late|is a bird that hunts|goes to bed early
        The coach *has eyes in the back of her head*.|notices everything|has extra eyes|never sees anything
        The library *was a tomb*.|was completely silent|was a place for the dead|was loud and busy
        The fog *swallowed* the ship.|hid the ship completely|ate the ship|made the ship easy to see
        Ben *is a rock* for his family.|is strong and dependable|is made of stone|cannot be trusted
        The audience *was glued* to their seats.|watched with great attention|were stuck with glue|left early
        The kitten *was a ball of fire*.|was full of energy|was burning|was sleepy and slow
        Her smile *lit up the room*.|made everyone feel happy|turned on the lights|made the room darker
        The homework *mountain* waited on my desk.|a very large amount of work|a hill of rocks|a single short task
        The thunder *grumbled* in the distance.|rumbled low and long|complained about the weather|was silent
        Life *is a roller coaster*.|has many ups and downs|is a ride at a fair|is always the same
        The team *was on fire* in the second half.|played extremely well|was in danger|played very badly
        The words *danced* across the page.|seemed lively and full of energy|moved to music|were dull and still
      `,
      (right, shown) => [
        `In *${shown.replace(/\*/g, "")}*, the figurative words mean **${right}**; they paint a picture rather than state a fact.`,
        `在 *${shown.replace(/\*/g, "")}* 中，这些比喻性的词的意思是 **${right}**；它们是在描绘画面，而不是陈述事实。`,
      ],
      [
        [
          "*{wrong}* takes the words literally, one by one, and misses the picture they paint.",
          "*{wrong}* 按字面逐字理解，没有抓住它们描绘的画面。",
        ],
        ["*{wrong}* is the opposite of the quality the figure points to.", "*{wrong}* 与这个比喻所指的特点正好相反。"],
      ],
    ),
  ],
});

const poemAndStory = topic("reading", {
  id: "comparing-a-poem-and-a-story",
  title: ["Comparing a Poem and a Story", "比较诗歌与故事"],
  summary: [
    "A poem and a story can share a theme while using different tools: lines, sound and images in one; plot, dialogue and paragraphs in the other.",
    "诗歌和故事可以有相同的主题，但用的手法不同：一个用诗行、声音和意象；另一个用情节、对话和段落。",
  ],
  after: ["theme", "tone-and-mood"],
  points: [
    label(
      "tools-of-each-form",
      ["The Tools of Each Form", "两种体裁的手法"],
      [
        "A **poem** is written in lines and stanzas and leans on sound and images: rhythm, rhyme, repetition, a few vivid words. A **story** is written in paragraphs and moves through a plot, with characters who speak in dialogue and a narrator who tells events in order. Both can share a theme, a mood, figurative language and a speaker or narrator.",
        "**诗歌**以诗行和诗节写成，依靠声音和意象：节奏、押韵、重复、少量生动的词。**故事**以段落写成，通过情节推进，人物用对话交谈，叙述者按顺序讲述事件。两者都可以有主题、气氛、比喻性语言以及说话者或叙述者。",
      ],
      ["Is this feature found in a poem, in a story, or in both?", "这个特点出现在诗歌中、故事中，还是两者都有？"],
      `
        It is divided into stanzas.|a poem
        Characters talk to each other in dialogue.|a story
        It has a theme, a message about life.|both
        Lines break before the end of the page, often where the writer wants a pause.|a poem
        A plot moves from a problem to a solution.|a story
        It can use similes and metaphors.|both
        A rhyme links the ends of the lines.|a poem
        Events are told in paragraphs by a narrator.|a story
        It creates a mood, such as calm or fear.|both
        A line is repeated as a refrain.|a poem
        A new paragraph starts when a new character speaks.|a story
        It uses images that appeal to the senses.|both
        It has a regular beat, like music.|a poem
        It has chapters.|a story
        It can be told by a speaker or narrator who says "I."|both
        Very few words carry a lot of meaning on a short line.|a poem
        It shows how characters change over many events.|a story
        It can show the writer's tone, such as joyful or bitter.|both
        Words start with the same sound to make music.|a poem
        It has rising action, a climax and an ending.|a story
        It can use personification.|both
        Its shape on the page is part of its meaning.|a poem
        A conflict between characters drives the events.|a story
        It can describe a setting.|both
        A couplet ends the piece.|a poem
        The narrator describes what each character thinks.|a story
        It can teach a lesson.|both
        Its lines are counted in beats or syllables.|a poem
        Scenes change from one place to another as the plot moves.|a story
        It can make the reader feel strong emotions.|both
      `,
      {
        "a poem": {
          zh: "诗歌",
          why: ["Lines, stanzas, rhythm and sound are the tools of a poem.", "诗行、诗节、节奏和声音是诗歌的手法。"],
          not: [
            "This feature belongs to poems, with their lines and sounds, not to stories.",
            "这个特点属于有诗行和声音的诗歌，而不属于故事。",
          ],
        },
        "a story": {
          zh: "故事",
          why: ["Plot, paragraphs, characters and dialogue are the tools of a story.", "情节、段落、人物和对话是故事的手法。"],
          not: [
            "This feature belongs to stories, with their plot and dialogue, not to poems.",
            "这个特点属于有情节和对话的故事，而不属于诗歌。",
          ],
        },
        both: {
          zh: "两者都有",
          why: [
            "Poems and stories can both have this, so it can be compared across the two.",
            "诗歌和故事都可以有这个特点，所以可以在两者之间进行比较。",
          ],
          not: ["This is not shared: only one of the two forms uses it.", "这不是两者共有的：只有其中一种体裁使用它。"],
        },
      },
    ),
    choose(
      "the-shared-theme",
      ["The Shared Theme", "共同的主题"],
      [
        "When a poem and a story are about the same subject, compare what each **says** about it. First state the theme of each in a full sentence, then find what they share. A shared subject (*the sea*) is not yet a theme; a theme is a message (*The sea gives and takes away*).",
        "当一首诗和一个故事写的是同一个题材时，要比较它们各自对它**说了什么**。先用完整的句子说出各自的主题，再找出它们的共同点。共同的题材（*the sea*）还不是主题；主题是一个观点（*The sea gives and takes away*）。",
      ],
      ["What theme do the poem and the story share?", "诗歌和故事有什么共同的主题？"],
      rival(
        `
        Poem: "The oak was once an acorn small, / it waited, grew, and now stands tall." Story: Lena practiced piano every day for years until she played at the concert hall.|Great things grow slowly with patience.|Trees are taller than people.|Music is more important than nature.
        Poem: "My grandmother's hands are wrinkled maps / of every bread she baked." Story: Tom finds his late grandfather's toolbox and feels close to him as he fixes a chair.|The people we love live on in what they leave us.|Old people have wrinkled hands.|Tools are better than bread.
        Poem: "Alone the wolf howls at the moon, / together the pack sings." Story: The team kept losing until the players stopped showing off and began to pass the ball.|We are stronger together than alone.|Wolves are dangerous animals.|Sports teams should have a captain.
        Poem: "The storm will pass, the clouds will part, / the sun waits behind the gray." Story: After her family lost their farm, Rosa kept hoping, and a year later they started over.|Hard times do not last forever.|Storms are common in spring.|Farms are hard to run.
        Poem: "I wore a mask to fit the crowd, / and lost the face I knew." Story: Ben pretended to like what his new friends liked, until he no longer knew what he enjoyed.|Being false to fit in costs us our true selves.|Masks are fun to wear at parties.|It is easy to make new friends.
        Poem: "The river does not fight the stone; / it goes around and on." Story: Instead of arguing with her angry brother, Mia found a quiet way to solve their problem.|Gentle patience can overcome a hard obstacle.|Rivers are full of stones.|Brothers and sisters always argue.
        Poem: "Each small seed I planted, / each one a promise kept." Story: Sam kept every promise he made to his little sister, and she learned to trust him.|Small acts of faithfulness build trust.|Seeds need water to grow.|Little sisters are hard to please.
        Poem: "The king's gold crown grew heavy, / his heart grew cold as stone." Story: The richer Mr. Bell became, the fewer friends he had, until he lived alone.|Greed can leave a person lonely.|Crowns are made of gold.|Rich people live in big houses.
        Poem: "I feared the dark until I saw / the stars it kept for me." Story: Ella was afraid of the new school, but she found a best friend on the first day.|Facing what we fear can bring good things.|The night sky is full of stars.|New schools are always scary.
        Poem: "The wave that knocked me down / still taught me how to swim." Story: After failing the test, Omar studied a new way and passed the next one easily.|Our failures can teach us.|Waves are dangerous at the beach.|Tests should be easier.
        Poem: "We built the bridge of many hands, / each stone a neighbor's gift." Story: When the flood ruined the school, the whole town came together to rebuild it.|A community can do together what no one can do alone.|Bridges are made of stone.|Floods happen every year.
        Poem: "Spring always comes, though winter stays / too long upon the hill." Story: After months of sadness when her dog died, Kim felt happy again when she adopted a puppy.|Joy returns after a time of sadness.|Winter is longer than spring.|Dogs make good pets.
        Poem: "A lie is a small crack in the glass / that spreads until it breaks." Story: Jake told one small lie to his parents, then another, until no one believed him.|Small lies grow and destroy trust.|Glass breaks easily.|Parents always find out.
        Poem: "The tallest tree bends in the wind / and so it does not break." Story: When her plans for the trip fell apart, Nina changed them and still had a great time.|Being flexible helps us survive trouble.|Wind can knock down trees.|Trips are hard to plan.
        Poem: "My mother's song, my mother's tongue, / I carry it like light." Story: In a new country, Ana kept speaking her family's language and was proud of it.|Our language and culture are part of who we are.|Mothers often sing to children.|Learning languages is difficult.
        Poem: "The little bird, though small and plain, / sang loudest at the dawn." Story: The shortest girl on the team scored the winning basket.|Size does not limit what we can do.|Birds sing in the morning.|Basketball players are tall.
        Poem: "I ran so fast I missed the flowers / blooming by the road." Story: Leo rushed through his vacation trying to see everything and remembered almost nothing.|Rushing makes us miss what matters.|Flowers grow by roads.|Vacations should be longer.
        Poem: "The candle gives its light away / and is not less for that." Story: Maya tutored her classmates every week and found she understood math better herself.|Giving to others enriches the giver.|Candles burn for hours.|Math is easy to learn.
        Poem: "The old fence has a gap in it / where two neighbors meet." Story: Two families who had argued for years finally shared a meal and became friends.|Reaching out can heal old quarrels.|Fences keep people apart.|Neighbors should not argue.
        Poem: "The caterpillar did not know / it carried wings inside." Story: Raj thought he was not good at anything until he discovered he could draw beautifully.|We may have hidden gifts we have not yet found.|Caterpillars become butterflies.|Drawing is a useful skill.
        Poem: "The mountain did not move for me; / I learned to climb instead." Story: When the school would not change the rule, Zoe found a way to succeed within it.|We sometimes must change ourselves when we cannot change our problems.|Mountains are hard to climb.|School rules are unfair.
        Poem: "My shadow follows where I go, / the past is always near." Story: Years later, Tom still thought about the friend he had been unkind to.|Our past actions stay with us.|Shadows appear on sunny days.|Friends sometimes move away.
        Poem: "One drop alone will dry away, / but drops can fill the sea." Story: Each student saved a few coins, and together the class raised enough for a new library.|Small efforts add up to something great.|The sea is made of water.|Libraries need money.
        Poem: "The proud peacock spread his tail / and did not see the fox." Story: Showing off on his bike, Max did not notice the hole and crashed.|Pride can make us careless.|Peacocks have beautiful tails.|Bikes can be dangerous.
        Poem: "Home is not the walls and roof / but who is waiting there." Story: After the fire, the family lived in a small apartment and found they were still happy together.|Home is the people we love, not the place.|Houses have walls and roofs.|Fires are dangerous.
        Poem: "The quiet pond holds all the sky / within its silent face." Story: Shy Lucy rarely spoke, but her stories showed the class how much she noticed.|Quiet people often have rich inner lives.|Ponds reflect the sky.|Stories are fun to write.
        Poem: "I picked the apple far too green / and it was sour still." Story: Ben opened his birthday gift a week early and spoiled the surprise.|Impatience spoils good things.|Green apples are sour.|Birthday gifts should be wrapped.
        Poem: "A single thread is weak alone; / woven, it holds the weight." Story: The students who studied in a group all passed the hard exam.|Working together makes us strong.|Thread is used for sewing.|Exams are hard.
        Poem: "The sun does not ask thanks for light; / it simply rises, gives." Story: Mrs. Lee helped her neighbors every day and never asked for anything in return.|True kindness expects no reward.|The sun rises every morning.|Neighbors should help each other move.
        Poem: "Even the oldest, tallest tree / was once a fragile shoot." Story: The famous scientist told the class that she had once failed science in school.|Everyone great began small and unsure.|Trees live a long time.|Science is a hard subject.
      `,
        1,
      ),
      (right) => [
        `Both say: **${right}** The poem shows it through an image; the story shows it through events.`,
        `两者都在说：**${right}** 诗歌通过意象表现它，故事通过事件表现它。`,
      ],
      [
        [
          "*{wrong}* only names a detail of the subject; it is not the message both texts share.",
          "*{wrong}* 只说出了题材的一个细节，不是两篇文本共同的观点。",
        ],
        [
          "*{wrong}* is a message, but of other texts; neither this poem nor this story says it.",
          "*{wrong}* 是一个观点，但属于别的文本；这首诗和这个故事都没有这样说。",
        ],
      ],
    ),
  ],
});

const causeLabels: Readonly<Record<string, Label>> = {
  "the cause": {
    zh: "原因",
    why: ["The words in italics made the other event happen.", "斜体部分使另一个事件发生。"],
    not: ["The words in italics did not make the other event happen.", "斜体部分并没有使另一个事件发生。"],
  },
  "the effect": {
    zh: "结果",
    why: ["The words in italics happened because of the other event.", "斜体部分是因为另一个事件才发生的。"],
    not: ["The words in italics are not what resulted from the other event.", "斜体部分不是另一个事件造成的结果。"],
  },
  "only at the same time": {
    zh: "只是同时发生",
    why: [
      "The words in italics only happened at the same time or soon after; nothing in the text says one caused the other.",
      "斜体部分只是同时或稍后发生，文中没有说一个导致了另一个。",
    ],
    not: [
      "The text links the two with a cause, using words such as *because*, *so* or *led to*.",
      "文中用 *because*、*so* 或 *led to* 等词把两者以因果相连。",
    ],
  },
};

const causeInHistory = topic("reading", {
  id: "cause-and-effect-in-history",
  title: ["Cause and Effect in History", "历史中的因果"],
  summary: [
    "Historians explain why events happened: a cause leads to an effect, an effect can have several causes, and two events at the same time are not always linked.",
    "历史学家解释事件为什么发生：原因导致结果，一个结果可以有多个原因，同时发生的两件事不一定有联系。",
  ],
  after: ["connecting-events-in-history", "primary-and-secondary-sources"],
  points: [
    choose(
      "finding-the-cause",
      ["Finding the Cause", "找出原因"],
      [
        "A history text often explains **why** something happened. Look for signal words: *because*, *since*, *as a result*, *led to*, *so*, *therefore*, *caused*. The **cause** comes first in time and makes the **effect** happen. A cause must be in the text, not just something you guess.",
        "历史文本经常解释事情**为什么**发生。注意信号词：*because*、*since*、*as a result*、*led to*、*so*、*therefore*、*caused*。**原因**在时间上先发生，并使**结果**发生。原因必须在文中，而不只是你的猜测。",
      ],
      ["According to the text, what was the cause?", "根据文本，原因是什么？"],
      rival(
        `
        Rome's roads let soldiers march quickly to any border, so the empire could defend itself. Why could Rome defend its borders?|Its roads let soldiers march quickly.|Its soldiers were taller than its enemies.|Its borders were very short.
        The Nile flooded every year and left rich mud behind. As a result, Egyptian farmers grew large crops. Why did Egyptian farmers grow large crops?|The yearly flood left rich mud.|The farmers worked at night.|The Nile was full of fish.
        Because the printing press made books cheap, more people learned to read. Why did more people learn to read?|The printing press made books cheap.|Schools became free everywhere.|People had more free time.
        The plague killed so many workers that the survivors could ask for higher pay. Why could workers ask for higher pay?|So many workers had died of the plague.|The kings passed a law for higher pay.|The workers had formed unions.
        A long drought dried up the rivers, which led to the end of the city. What led to the end of the city?|A long drought dried up the rivers.|An army attacked the city.|The people moved to the coast for trade.
        Since the Silk Road linked China and Rome, ideas and goods traveled between them. Why did ideas travel between China and Rome?|The Silk Road linked them.|They spoke the same language.|Their rulers were cousins.
        The new railway let farmers send crops to the city quickly, so towns along it grew. Why did towns along the railway grow?|Farmers could send crops to the city quickly.|The towns had more rain.|Many people liked trains.
        Heavy taxes on tea angered the colonists, which led to the Boston Tea Party. What led to the Boston Tea Party?|Heavy taxes on tea angered the colonists.|The colonists did not like tea.|The ships were sinking.
        The invention of the plow let farmers grow more food, so cities could feed more people. Why could cities feed more people?|The plow let farmers grow more food.|Cities had bigger markets.|People ate less.
        Because the castle stood on a high hill, enemies could be seen from far away. Why could enemies be seen from far away?|The castle stood on a high hill.|The guards had telescopes.|The enemies wore bright colors.
        Disease brought by sailors killed many people in the islands, so the old kingdoms became weak. Why did the old kingdoms become weak?|Disease brought by sailors killed many people.|The kings were lazy.|A volcano erupted.
        The canal joined two seas, and as a result ships no longer had to sail around Africa. Why did ships no longer sail around Africa?|The canal joined two seas.|Africa had become dangerous.|The ships were too small.
        Rome had too many enemies at once and too little money, which led to its fall in the west. What led to the fall of Rome in the west?|Too many enemies and too little money.|A single bad emperor.|A great earthquake.
        Because clay tablets did not burn, many records of ancient Sumer survived. Why did many Sumerian records survive?|Clay tablets did not burn.|The Sumerians hid them in caves.|They were copied onto paper.
        The new steam engine could pump water from mines, so miners could dig deeper. Why could miners dig deeper?|The steam engine pumped water from the mines.|The miners were stronger.|The mines were dry.
        A frost killed the potato crop, which led to a terrible famine. What led to the famine?|A frost killed the potato crop.|People stopped farming.|The cities grew too fast.
        Since the harbor was deep and safe, the town became a great port. Why did the town become a great port?|Its harbor was deep and safe.|It had many fishermen.|Its king loved ships.
        The ruler made all coins the same, so trade became easier across the empire. Why did trade become easier?|All coins were made the same.|Roads were built.|Markets opened at night.
        Because the Great Wall slowed down raiders, farmers in the north felt safer. Why did farmers in the north feel safer?|The Great Wall slowed down raiders.|The raiders became farmers.|The north had more soldiers than the south.
        The war cut off trade with the east, so prices of spices rose. Why did spice prices rise?|The war cut off trade with the east.|Spices became popular.|The spices spoiled.
        Writing let the merchants keep records of trade, so their businesses grew larger. Why did the businesses grow larger?|Writing let merchants keep records.|The merchants worked longer.|More customers came from abroad.
        A huge eruption buried the town in ash, which preserved its streets for centuries. What preserved the town's streets?|The eruption buried it in ash.|The people built walls.|The streets were made of gold.
        Since the new law gave land to soldiers, many men joined the army. Why did many men join the army?|The new law gave land to soldiers.|The army paid in gold.|There was a war coming.
        The bridge collapsed in the flood, so the village was cut off for weeks. Why was the village cut off?|The bridge collapsed in the flood.|The road was blocked by snow.|The villagers did not want visitors.
        Because the telegraph sent messages in minutes, news traveled faster than ever. Why did news travel faster?|The telegraph sent messages in minutes.|More newspapers were printed.|People talked more.
        The cotton mills needed many workers, which led thousands to move to the cities. What led people to move to the cities?|The cotton mills needed many workers.|The cities were cleaner.|The farms had too much food.
        Rome's aqueducts carried clean water into the city, so it could grow very large. Why could Rome grow very large?|Aqueducts carried clean water into it.|It had many temples.|Its people had small families.
        The empire split into two halves because one ruler could not govern it all. Why did the empire split?|One ruler could not govern it all.|The two halves spoke different languages.|A flood divided it.
        A new map showed a shorter route, so sailors began to use it. Why did sailors begin to use the new route?|A map showed it was shorter.|The old route had pirates.|The king ordered them.
        Because the soil was poor, the settlers moved further west. Why did the settlers move west?|The soil was poor.|They wanted to see the mountains.|Gold was found in the east.
      `,
        1,
      ),
      (right) => [
        `The text gives the cause: **${right}** Signal words such as *because*, *so* and *led to* connect it to the effect.`,
        `文本给出了原因：**${right}** *because*、*so* 和 *led to* 等信号词把它和结果连了起来。`,
      ],
      [
        [
          "*{wrong}* is not stated in the text; it is a guess, not the cause the text gives.",
          "*{wrong}* 文中没有说，它只是猜测，不是文本给出的原因。",
        ],
        [
          "*{wrong}* is the cause of something else; the text names a different cause here.",
          "*{wrong}* 是别的事情的原因，文本在这里给出的是另一个原因。",
        ],
      ],
    ),
    label(
      "cause-effect-or-just-together",
      ["Cause, Effect or Just Together", "原因、结果还是只是同时"],
      [
        "Two events that happen close together are not always cause and effect. *The king died and the harvest failed* tells two events; it does not say one caused the other. Only words such as *because*, *so*, *as a result* or *led to* show a cause. Decide whether the part in italics is **the cause**, **the effect**, or something that happened **only at the same time**.",
        "时间上接近的两个事件不一定是因果关系。*The king died and the harvest failed* 讲的是两件事，并没有说一件导致了另一件。只有 *because*、*so*、*as a result* 或 *led to* 之类的词才表示原因。判断斜体部分是**原因**、**结果**，还是**只是同时发生**的事。",
      ],
      ["What is the part in italics?", "斜体部分是什么？"],
      `
        *The river changed its course*, so the old city had no water.|the cause
        Because the roads were blocked by snow, *the army could not march*.|the effect
        In the same year that the queen was crowned, *a comet appeared in the sky*.|only at the same time
        *Gold was found in the hills*, which led thousands to rush there.|the cause
        The harbor filled with mud; as a result, *the port was abandoned*.|the effect
        *A new temple was built* while the war was being fought in the north.|only at the same time
        Since *the bridge was finished*, traders could cross the river all year.|the cause
        The crops failed for three years, so *many families left the valley*.|the effect
        *The emperor wrote poetry* during the years when the empire grew.|only at the same time
        *Iron tools were invented*, which made farming much easier.|the cause
        Because the walls were strong, *the city held out for a year*.|the effect
        In the year the printing press came to the town, *the old mill burned down*.|only at the same time
        *The ships brought rats with fleas*, and this led to the spread of the plague.|the cause
        The taxes were too high, so *the farmers rebelled*.|the effect
        *A great library was founded* in the same century that the city's first bridge was built.|only at the same time
        *The camel was tamed*, so traders could cross the desert.|the cause
        The rains failed; therefore, *the price of grain rose*.|the effect
        *A famous singer was born* the year the railway opened.|only at the same time
        Because *the castle had a deep well*, the soldiers did not run out of water.|the cause
        The king's army was defeated, and as a result *the kingdom lost its southern lands*.|the effect
        *An eclipse darkened the sky* in the week the treaty was signed.|only at the same time
        *The compass came into use*, which let sailors travel far from land.|the cause
        Since the forest was cut down, *the soil washed away in the rains*.|the effect
        *The city's population grew* during the same years that its football team won many games.|only at the same time
        *The dam was built*, so the valley was flooded.|the cause
        The wheat rotted in the wet barns, which caused *a winter of hunger*.|the effect
        *The old queen took up painting* the same year the new law on schools passed.|only at the same time
        Because *the mines ran out of silver*, the town became a ghost town.|the cause
        The sea rose over many years, so *the coastal villages moved inland*.|the effect
        *A new style of hat became popular* in the same decade the war ended.|only at the same time
      `,
      causeLabels,
    ),
  ],
});

const sentenceRoles: Readonly<Record<string, Label>> = {
  "states the main idea": {
    zh: "陈述主要观点",
    why: ["The sentence tells what the whole paragraph is about; the others support it.", "这个句子说出整段的内容，其他句子都在支持它。"],
    not: [
      "This sentence supports a larger point; it does not state what the whole paragraph is about.",
      "这个句子在支持一个更大的观点，并没有说出整段的内容。",
    ],
  },
  "gives an example": {
    zh: "举例",
    why: [
      "The sentence shows one particular case of the idea, often after *for example* or *for instance*.",
      "这个句子展示观点的一个具体事例，常跟在 *for example* 或 *for instance* 后面。",
    ],
    not: ["This sentence does not show a particular case of the idea.", "这个句子没有展示观点的具体事例。"],
  },
  "gives a reason": {
    zh: "给出理由",
    why: ["The sentence explains why, often with *because* or *since*.", "这个句子解释原因，常用 *because* 或 *since*。"],
    not: ["This sentence does not explain why something is so.", "这个句子没有解释为什么。"],
  },
  "shows a contrast": {
    zh: "表示对比",
    why: [
      "The sentence turns to a difference or an opposite point, often with *however* or *but*.",
      "这个句子转向差异或相反的观点，常用 *however* 或 *but*。",
    ],
    not: ["This sentence does not turn to a difference or an opposite point.", "这个句子没有转向差异或相反的观点。"],
  },
  "draws a conclusion": {
    zh: "得出结论",
    why: [
      "The sentence sums up or tells what follows from the rest, often with *so*, *therefore* or *in the end*.",
      "这个句子概括其余内容或说出由此得出的结论，常用 *so*、*therefore* 或 *in the end*。",
    ],
    not: ["This sentence does not sum up the paragraph or tell what follows from it.", "这个句子没有概括段落或说出由此得出的结论。"],
  },
};

const sentenceFits = topic("reading", {
  id: "how-a-sentence-fits-the-whole",
  title: ["How a Sentence Fits the Whole", "句子在全文中的作用"],
  summary: [
    "Each sentence in a paragraph has a job: it states the main idea, gives an example or a reason, shows a contrast or draws a conclusion.",
    "段落中的每个句子都有作用：陈述主要观点、举例或给出理由、表示对比，或者得出结论。",
  ],
  after: ["text-structures"],
  points: [
    label(
      "the-job-of-a-sentence",
      ["The Job of a Sentence", "句子的作用"],
      [
        "In a well-built paragraph, each sentence does a job. One **states the main idea**. Others **give an example**, **give a reason**, or **show a contrast**. The last often **draws a conclusion**. To find a sentence's job, ask how it connects to the sentences around it. Signal words help: *for example*, *because*, *however*, *therefore*.",
        "在结构良好的段落中，每个句子都有作用。一个句子**陈述主要观点**。其他句子**举例**、**给出理由**或**表示对比**。最后一句常常**得出结论**。要找出句子的作用，就问它和周围的句子有什么联系。信号词有帮助：*for example*、*because*、*however*、*therefore*。",
      ],
      ["What job does the sentence in italics do?", "斜体句子起什么作用？"],
      `
        *Volcanoes can be helpful as well as harmful.* Their ash makes rich soil. Their heat can make electricity.|states the main idea
        Many animals hide by matching their surroundings. *For example, the arctic fox turns white in winter.*|gives an example
        Bees are vital to farms. *This is because they carry pollen from flower to flower.*|gives a reason
        Cats are often independent. *Dogs, however, usually want company all day.*|shows a contrast
        Rome built roads, bridges and aqueducts that are still standing. *Clearly, Roman engineers were masters of their craft.*|draws a conclusion
        *Sleep is important for growing children.* It helps the body heal and the brain store memories.|states the main idea
        Some plants eat insects. *The Venus flytrap, for instance, snaps shut on flies.*|gives an example
        The desert is cold at night. *Since there are no clouds, the day's heat escapes quickly.*|gives a reason
        Most birds can fly. *The ostrich, on the other hand, can only run.*|shows a contrast
        The team practiced every day and studied each game. *As a result, they won the championship.*|draws a conclusion
        *The first cities grew up beside rivers.* Rivers gave water for crops and a road for trade.|states the main idea
        People in the past used many kinds of money. *In some places, shells were used to buy goods.*|gives an example
        Earthquakes happen often in Japan. *That is because the country sits where several plates meet.*|gives a reason
        Summer in Australia comes in December. *In Canada, by contrast, December is the middle of winter.*|shows a contrast
        Recycling saves trees, water and energy. *So everyone should recycle at home.*|draws a conclusion
        *Exercise does more than build muscles.* It also improves mood and helps students concentrate.|states the main idea
        Many words in English come from other languages. *Piano, for example, comes from Italian.*|gives an example
        The ship sank in minutes. *The reason was a long crack below the waterline.*|gives a reason
        Some people think the moon makes its own light. *In fact, it only reflects light from the Sun.*|shows a contrast
        The town had no doctor, no school and no shop. *In the end, the young families moved away.*|draws a conclusion
        *Water changes form in a never-ending cycle.* It evaporates, forms clouds and falls as rain.|states the main idea
        Some trees live for thousands of years. *One bristlecone pine in California is nearly five thousand years old.*|gives an example
        Many people in the city ride bicycles. *They do so because the streets are flat and the traffic is heavy.*|gives a reason
        The old library was dark and cramped. *The new one, though, is bright and full of space.*|shows a contrast
        The bridge has stood through floods, storms and earthquakes. *It is truly one of the strongest bridges ever built.*|draws a conclusion
        *Ancient people found clever ways to tell time.* They used sundials, water clocks and candles.|states the main idea
        Some animals sleep through the winter. *Bears, for instance, sleep in dens for months.*|gives an example
        Leaves change color in the fall. *This happens because trees stop making green chlorophyll.*|gives a reason
        Most metals sink in water. *Yet huge steel ships float because of their shape.*|shows a contrast
        The soil was rich, the rain was steady and the river was near. *Therefore, the valley was a perfect place to farm.*|draws a conclusion
      `,
      sentenceRoles,
    ),
    choose(
      "the-sentence-that-fits",
      ["The Sentence That Fits", "合适的句子"],
      [
        "When a sentence is missing from a paragraph, look at the sentences before and after the gap. Ask what job the missing sentence must do: give an example of the idea before it, explain why, turn to a contrast, or sum up. The right sentence connects to both sides and stays on the topic.",
        "段落中缺少一个句子时，要看空格前后的句子。问一问缺少的句子必须起什么作用：为前面的观点举例、解释原因、转向对比，还是进行概括。正确的句子要与前后都衔接，并且不偏离话题。",
      ],
      ["Which sentence best fills the gap?", "哪个句子最适合填入空格？"],
      rival(
        `
        Many animals use tools. ___ Crows bend wire into hooks to catch food.|For example, chimpanzees use sticks to dig out ants.|Crows are black birds that live in many countries.|However, animals cannot think at all.
        Rome had a huge army. ___ They also built camps every night as they marched.|Its soldiers trained hard and carried heavy packs.|Rome is now the capital of Italy.|Many people today like to travel to Rome.
        Bananas grow best in hot, wet places. ___ So most bananas come from countries near the equator.|They need plenty of rain and warm weather all year.|Bananas are yellow when they are ripe.|Apples grow well in cold places too.
        Some people like the city. ___ They enjoy quiet, open spaces and fresh air.|Others prefer to live in the country.|The city has tall buildings.|Many cities have parks and museums.
        The town's well dried up. ___ As a result, people had to carry water from the river.|There had been no rain for months.|Wells are holes dug in the ground.|The town has a famous market.
        Our school has a new garden. ___ Each class grows its own vegetables there.|Students planted it last spring behind the gym.|Gardens need sunlight to grow.|Many schools do not have libraries.
        Volcanoes can be dangerous. ___ Hot ash can bury whole towns.|Lava can burn everything in its path.|Volcanoes are found on many islands.|Some mountains are not volcanoes at all.
        Owls hunt at night. ___ They can also turn their heads very far to look around.|Their large eyes help them see in the dark.|Owls are often seen in old stories.|Robins sing in the morning.
        The invention of the clock changed daily life. ___ Factories could start and stop work at exact times.|People could plan their days by the hour.|Clocks are made of many small parts.|Some clocks are very expensive.
        Ancient Egyptians believed in life after death. ___ They filled tombs with food, furniture and treasure.|So they prepared carefully for the next world.|The Nile is a very long river.|Egypt is hot and dry.
        Exercise helps the heart. ___ It also helps people sleep better at night.|It makes the heart muscle stronger.|Hearts have four chambers.|Some people do not like to run.
        Penguins cannot fly. ___ They use their wings like flippers to move through the water.|However, they are excellent swimmers.|Penguins live in cold places.|Many birds fly south in winter.
        The library is a great place to study. ___ It also has free computers for everyone.|It is quiet and full of useful books.|The library opened in 1950.|Some people read on the bus.
        Earthquakes can cause tsunamis. ___ The waves can travel across whole oceans.|When the sea floor shakes, it pushes up huge waves.|Japan has many earthquakes.|Tsunamis have a Japanese name.
        Many inventions come from mistakes. ___ The cook had used salt instead of sugar.|Potato chips, for example, were made by accident.|Inventors must work very hard.|Some mistakes are never fixed.
        The castle was hard to attack. ___ Its walls were also very thick.|It stood on a high cliff above the sea.|Castles were built in the Middle Ages.|Many castles are now museums.
        Plants need light to make food. ___ That is why a plant in a dark closet will die.|Without sunlight, they cannot make sugar from water and air.|Plants are green.|Some plants have flowers.
        Our class raised money for the shelter. ___ In the end, we gave them five hundred dollars.|We sold cookies, washed cars and held a fair.|Shelters take care of animals.|Money is made of paper and metal.
        Most deserts are hot. ___ They are covered in ice for most of the year.|Some deserts, though, are very cold.|Camels live in deserts.|Deserts get very little rain.
        Trains changed travel in the 1800s. ___ A trip that took days now took only hours.|They were much faster than horses and carts.|Trains run on tracks.|Some people still prefer to drive.
        The rain forest is full of life. ___ Millions of insects live in its trees.|More kinds of animals live there than anywhere else.|Rain forests get a lot of rain.|Some forests are made of pine trees.
        Sharks have lived on Earth for a very long time. ___ They are older than the dinosaurs.|They first appeared over 400 million years ago.|Sharks have many teeth.|Whales are mammals, not fish.
        The museum was very crowded. ___ So we decided to come back on a weekday.|There were long lines at every room.|Museums have old objects.|Our school is near the museum.
        Writing was invented to keep records. ___ Later, people used it to write stories and laws.|At first, it was used to count grain and animals.|Writing can be done with pens.|Some people write in their diaries.
        Recycling saves resources. ___ It also cuts down on trash in landfills.|For example, recycled paper means fewer trees are cut.|Recycling bins are often blue.|Some people throw away food.
        The ancient Greeks loved sports. ___ The winners were treated as heroes.|They held the first Olympic Games in 776 BCE.|Greece has many islands.|Sports can be dangerous.
        The new bridge will help the town. ___ People will no longer have to drive an hour to cross the river.|It will cut travel time for workers and shoppers.|Bridges are made of steel.|The river is very wide.
        Honeybees work together. ___ Others guard the hive or care for the young.|Some bees collect nectar from flowers.|Honey is sweet.|Wasps can sting more than once.
        The storm caused great damage. ___ Thousands of homes lost power for days.|Trees fell on houses and roads.|Storms happen in many places.|The weather was nice the next week.
        The settlers faced many dangers. ___ Despite this, many of them built new lives in the west.|They crossed rivers, deserts and mountains.|Settlers used wagons.|The west is a big region.
      `,
        1,
      ),
      (right) => [
        `**${right}** It connects to the sentences on both sides of the gap and does the job the paragraph needs there.`,
        `**${right}** 它与空格两边的句子都衔接，并起到段落在这里需要的作用。`,
      ],
      [
        [
          "*{wrong}* is true or on the subject, but it does not connect to the sentences around the gap.",
          "*{wrong}* 也许是真的或与题材有关，但它与空格前后的句子不衔接。",
        ],
        ["*{wrong}* goes off the topic or works against the point of the paragraph.", "*{wrong}* 偏离了话题，或者与段落的观点相反。"],
      ],
    ),
  ],
});

const developmentLabels: Readonly<Record<string, Label>> = {
  "by examples": {
    zh: "举例",
    why: ["The writer develops the idea by giving several particular cases of it.", "作者通过给出几个具体事例来展开观点。"],
    not: ["The paragraph does not mainly list particular cases of the idea.", "这段话主要不是列举观点的具体事例。"],
  },
  "by comparing": {
    zh: "比较",
    why: ["The writer develops the idea by showing how two things are alike or different.", "作者通过说明两样东西的异同来展开观点。"],
    not: ["The paragraph does not mainly set two things side by side.", "这段话主要不是把两样东西放在一起比较。"],
  },
  "by steps in time": {
    zh: "按时间步骤",
    why: [
      "The writer develops the idea by telling what happens first, next and last.",
      "作者通过讲述先发生什么、接着发生什么、最后发生什么来展开观点。",
    ],
    not: ["The paragraph does not mainly follow steps or events in order.", "这段话主要不是按顺序讲述步骤或事件。"],
  },
  "by causes and effects": {
    zh: "因果",
    why: ["The writer develops the idea by showing what causes what.", "作者通过说明什么导致了什么来展开观点。"],
    not: ["The paragraph does not mainly show what causes what.", "这段话主要不是说明因果关系。"],
  },
  "by a story": {
    zh: "讲故事",
    why: [
      "The writer develops the idea by telling a short true story, an anecdote, about one person.",
      "作者通过讲一个关于某人的真实小故事，即轶事，来展开观点。",
    ],
    not: ["The paragraph does not tell a short story about one person.", "这段话没有讲关于某个人的小故事。"],
  },
};

const ideaDeveloped = topic("reading", {
  id: "how-an-idea-is-developed",
  title: ["How an Idea Is Developed", "观点是怎样展开的"],
  summary: [
    "Writers develop a key idea with examples, comparisons, steps in time, causes and effects, or a short story about one person.",
    "作者用例子、比较、时间步骤、因果关系或关于某人的小故事来展开关键观点。",
  ],
  after: ["two-main-ideas"],
  points: [
    label(
      "how-the-writer-develops-it",
      ["How the Writer Develops It", "作者怎样展开观点"],
      [
        "A writer states an idea, then **develops** it so the reader understands and believes it. The idea can be developed **by examples** (several cases), **by comparing** two things, **by steps in time**, **by causes and effects**, or **by a story** about one person, an anecdote. To tell which, ask what most of the sentences after the main idea are doing.",
        "作者提出一个观点，然后**展开**它，让读者理解并相信。观点可以通过**举例**（几个事例）、**比较**两样东西、**按时间步骤**、**因果关系**或关于某个人的**故事**（轶事）来展开。要判断是哪一种，就问主要观点之后的大多数句子在做什么。",
      ],
      ["How is the idea developed?", "这个观点是怎样展开的？"],
      `
        Many animals migrate. Swallows fly to Africa each fall. Salmon swim back to the rivers where they hatched. Monarch butterflies travel thousands of kilometers to Mexico.|by examples
        Frogs and toads look alike, but they differ. Frogs have smooth, wet skin and long legs. Toads have dry, bumpy skin and short legs.|by comparing
        Making paper by hand takes several steps. First, soak old paper in water. Next, blend it into pulp. Then spread it on a screen and let it dry.|by steps in time
        Cutting down forests harms the land. Without tree roots, soil washes away in the rain. The rivers fill with mud, and fish die.|by causes and effects
        One person can make a difference. When Wangari Maathai saw the hills of Kenya turning bare, she planted a few trees. Soon thousands of women joined her, and millions of trees grew.|by a story
        Rome borrowed ideas from many peoples. It took its gods from the Greeks, its arches from the Etruscans and its alphabet from both.|by examples
        Life in the city differs from life on a farm. City children walk to school past shops; farm children ride a bus past fields.|by comparing
        A volcano forms over thousands of years. First, melted rock rises. Then it bursts through the crust. Each eruption adds a new layer until a mountain stands.|by steps in time
        The drought hurt the whole town. Crops died, so farmers had no money. Then the shops lost their customers and closed.|by causes and effects
        Never give up on a dream. As a girl, Bessie Coleman was told that no flying school would take her. She saved her money, learned French and earned her pilot's license in France.|by a story
        Inventions often copy nature. Velcro copies burrs that stick to fur. Airplane wings copy birds. Swimsuits copy shark skin.|by examples
        Reading a book and watching its film are different experiences. A book lets you picture the scenes yourself; a film shows you someone else's picture.|by comparing
        A seed becomes a plant step by step. It soaks up water, splits open and sends down a root. Then a shoot grows up toward the light.|by steps in time
        Too much screen time can harm sleep. Bright screens trick the brain into thinking it is day, so the body makes less of the hormone that brings sleep.|by causes and effects
        Kindness can change a life. When Mr. Ortiz gave a hungry boy a sandwich each day, the boy stayed in school. Years later, he became a teacher himself.|by a story
        Many words came from people's names. The sandwich is named for an earl. The cardigan is named for another. Braille is named for its inventor.|by examples
        The two bridges were built in very different ways. The old one is made of stone arches; the new one hangs from steel cables.|by comparing
        The first cities grew in stages. Farmers settled near rivers. Villages grew into towns. Then towns built walls and temples and became cities.|by steps in time
        The invention of the printing press changed Europe. Books became cheaper, so more people learned to read, and new ideas spread quickly.|by causes and effects
        Courage can be quiet. Ruby Bridges was six when she walked past angry crowds into a school no Black child had attended. She went every day, all year.|by a story
        Some animals use clever tricks to stay safe. Possums pretend to be dead. Octopuses squirt ink. Some lizards drop their tails.|by examples
        Alligators and crocodiles are often confused. An alligator has a wide, round snout; a crocodile's is long and pointed.|by comparing
        A letter traveled by stages in the old days. A rider took it to the next town. There a fresh rider carried it on, and so on to its end.|by steps in time
        When the factory closed, the town changed. People lost jobs, families moved away and the school had too few students.|by causes and effects
        Practice turns weakness into strength. Demosthenes stammered as a boy. He practiced speaking with pebbles in his mouth and became the greatest speaker of Athens.|by a story
        Many foods we eat began in the Americas. Potatoes, tomatoes, corn and chocolate all came from there.|by examples
        A town meeting and a city council work differently. In a meeting, every citizen votes; in a council, a few chosen members vote for everyone.|by comparing
        A caterpillar becomes a butterfly in four stages: egg, larva, pupa and adult.|by steps in time
        The new road brought changes to the village. Tourists came, so people opened cafes, and young people found work at home.|by causes and effects
        Curiosity leads to discovery. Young Alexander Fleming noticed mold killing germs on a dish he had forgotten. That accident gave the world penicillin.|by a story
      `,
      developmentLabels,
    ),
    choose(
      "the-detail-that-develops-it",
      ["The Detail That Develops It", "展开观点的细节"],
      [
        "A detail **develops** an idea when it adds something new that supports it. A detail that only repeats the idea in other words adds nothing, and a detail about a different topic leads the reader away. Choose the sentence that adds a fresh example, reason or fact about the same idea.",
        "一个细节如果补充了新的、支持观点的内容，它就**展开**了观点。只是换个说法重复观点的细节什么也没有增加，而关于别的话题的细节会把读者带偏。要选出为同一个观点补充新例子、理由或事实的句子。",
      ],
      ["Which sentence best develops the idea?", "哪个句子最能展开这个观点？"],
      rival(
        `
        Idea: Bees are important to farmers.|Bees carry the pollen that many fruit trees need to make fruit.|Bees are important to the people who farm.|Some wasps look a lot like bees.
        Idea: The Romans were great builders.|Their concrete domes and bridges still stand after two thousand years.|The Romans were very good at building things.|Rome is the capital of Italy today.
        Idea: Reading every day helps students.|Students who read daily learn thousands of new words each year.|Reading each day is good for students.|Some books are very expensive.
        Idea: Deserts can be very cold.|At night, the Sahara can drop below freezing.|Deserts are sometimes cold places.|Camels can drink a lot of water.
        Idea: Elephants have strong memories.|They can remember the way to a water hole they last visited years ago.|Elephants remember things well.|Elephants are the largest land animals.
        Idea: The printing press changed the world.|It let books be made in days instead of months.|The printing press made a big change.|Paper was invented in China.
        Idea: Exercise improves mood.|After a run, the body releases chemicals that make people feel happy.|Exercise makes people feel better.|Some people exercise in the morning.
        Idea: Volcanoes help make new land.|The islands of Hawaii were built by lava over millions of years.|Volcanoes create new land.|Volcanoes can also be dangerous.
        Idea: Ancient Egyptians were skilled doctors.|They set broken bones and wrote books of medicine on papyrus.|The Egyptians knew a lot about medicine.|The pyramids are in Egypt.
        Idea: Trees help clean the air.|One large tree can take in many kilograms of carbon dioxide each year.|Trees make the air cleaner.|Some trees lose their leaves in winter.
        Idea: Dogs can be trained to help people.|Some dogs guide people who are blind across busy streets.|Dogs are useful helpers.|Cats are also popular pets.
        Idea: Plastic harms the ocean.|Turtles often swallow plastic bags, thinking they are jellyfish.|Plastic is bad for the sea.|The ocean covers most of the planet.
        Idea: Early cities needed writing.|Officials had to record how much grain each farmer owed.|Writing was needed in early cities.|Some cities were built on hills.
        Idea: Sleep helps memory.|While we sleep, the brain stores what we learned that day.|Sleep is good for remembering.|Some animals sleep standing up.
        Idea: The Silk Road spread ideas.|Buddhism traveled from India to China along its routes.|Ideas moved along the Silk Road.|Silk is a soft cloth.
        Idea: Earthquakes are hard to predict.|Scientists can say where they may strike, but not the day or hour.|It is not easy to know when earthquakes will happen.|Japan has many earthquakes.
        Idea: Music helps people learn.|Children often learn the alphabet by singing a song.|Music can help with learning.|Pianos have black and white keys.
        Idea: Owls are skilled hunters.|Their soft feathers let them fly silently toward their prey.|Owls are very good at hunting.|Owls appear in many stories.
        Idea: The Nile made Egypt rich.|Its yearly flood left rich soil for growing wheat.|The Nile helped Egypt become wealthy.|The Nile flows into the Mediterranean Sea.
        Idea: Recycling saves energy.|Making a can from recycled metal uses far less energy than making a new one.|Recycling uses less energy.|Recycling bins come in many colors.
        Idea: Some plants protect themselves.|Cacti have sharp spines that keep animals from eating them.|Plants have ways to stay safe.|Cacti grow in the desert.
        Idea: Teamwork wins games.|The team that passed the ball most scored the most goals this season.|Working as a team helps win.|Soccer is played around the world.
        Idea: Castles were built for defense.|Many had a deep moat around them filled with water.|Castles were made to keep enemies out.|Kings lived in castles.
        Idea: Bicycles are good for cities.|A bike takes up far less space on the road than a car.|Bikes are useful in cities.|The first bicycles had no pedals.
        Idea: Spiders are useful.|They eat many insects that would harm crops.|Spiders help people.|Some people are afraid of spiders.
        Idea: The telephone changed business.|Orders could be placed in minutes instead of by letter.|Business changed because of the telephone.|The first telephone was big.
        Idea: Salt was once very valuable.|Roman soldiers were sometimes paid with it.|Salt used to be worth a lot.|Salt comes from the sea.
        Idea: Rain forests are full of life.|A single tree can be home to hundreds of kinds of insects.|There is a lot of life in rain forests.|Rain forests are hot and wet.
        Idea: Maps changed exploration.|Better maps let sailors find new routes and return safely.|Maps helped explorers.|Some maps are drawn on paper.
        Idea: Laughter is good for health.|Laughing lowers stress and helps the heart.|Laughing is healthy.|Some jokes are not funny.
      `,
        1,
      ),
      (right) => [
        `**${right}** It adds a new fact or example that supports the idea, instead of repeating it or changing the topic.`,
        `**${right}** 它补充了支持观点的新事实或新例子，而不是重复观点或改变话题。`,
      ],
      [
        ["*{wrong}* only repeats the idea in other words; it adds nothing new.", "*{wrong}* 只是换个说法重复了观点，没有增加任何新内容。"],
        ["*{wrong}* is about a different topic, so it does not develop this idea.", "*{wrong}* 说的是别的话题，所以没有展开这个观点。"],
      ],
    ),
  ],
});

const clueLabels: Readonly<Record<string, Label>> = {
  "a definition": {
    zh: "定义",
    why: [
      "The sentence tells the meaning directly, often with *is*, *means* or *is called*.",
      "句子直接说出意思，常用 *is*、*means* 或 *is called*。",
    ],
    not: ["The sentence does not state the meaning directly with *is* or *means*.", "句子没有用 *is* 或 *means* 直接说出意思。"],
  },
  "a restatement": {
    zh: "换言之",
    why: [
      "The meaning follows in other words, after a comma, a dash, *or*, or *that is*.",
      "意思用别的话紧接着说出，跟在逗号、破折号、*or* 或 *that is* 后面。",
    ],
    not: [
      "The meaning is not restated after a comma, a dash, *or* or *that is*.",
      "意思没有在逗号、破折号、*or* 或 *that is* 之后被换一种说法说出来。",
    ],
  },
  "an example": {
    zh: "举例",
    why: [
      "Examples of the word, after *such as* or *for example*, point to its meaning.",
      "跟在 *such as* 或 *for example* 后面的例子指向这个词的意思。",
    ],
    not: ["No examples of the word are given here.", "这里没有给出这个词的例子。"],
  },
  "a contrast": {
    zh: "对比",
    why: [
      "A word of opposite meaning, after *unlike*, *but* or *however*, points to what the word means.",
      "跟在 *unlike*、*but* 或 *however* 后面的反义词指向这个词的意思。",
    ],
    not: ["The sentence does not set the word against an opposite.", "句子没有把这个词与相反的意思对比。"],
  },
};

const technicalWords = topic("reading", {
  id: "technical-words-in-context",
  title: ["Technical Words in Context", "语境中的专业词汇"],
  summary: [
    "Science and history texts teach their own words; a definition, a restatement, examples or a contrast nearby tells what each means.",
    "科学和历史文本会教它们自己的专业词汇；附近的定义、换言之、例子或对比能说明每个词的意思。",
  ],
  after: ["restatement-and-inference-clues"],
  points: [
    choose(
      "meaning-from-the-text",
      ["The Meaning from the Text", "从文本得出意思"],
      [
        "Technical words are the special words of a subject: *magma*, *aqueduct*, *photosynthesis*. Writers of science and history usually explain them right where they first appear. Read the whole sentence, and often the next one, to find the explanation before you reach for a dictionary.",
        "专业词汇是某个学科的特殊用词：*magma*、*aqueduct*、*photosynthesis*。科学和历史作者通常在这些词首次出现的地方就加以解释。先读完整个句子，常常还要读下一句，找出解释，再去查词典。",
      ],
      ["What does the word in bold mean in this text?", "加粗的词在这段文字中是什么意思？"],
      rival(
        `
        Deep under the ground, rock melts into **magma**, a hot liquid that can rise toward the surface.|hot melted rock under the ground|a kind of hard, cold stone|a gas that comes out of cars
        The Romans built **aqueducts**, long channels that carried water from the hills into the city.|channels that carried water|roads for soldiers to march on|walls around a city
        Some animals are **nocturnal**; unlike the squirrel, they sleep all day and hunt at night.|active at night|active during the day|living in water
        A **seismograph** records the shaking of the ground during an earthquake.|an instrument that records ground shaking|a map of a city's streets|a tool for digging holes
        The **nucleus**, or control center of the cell, holds the cell's instructions.|the control center of a cell|the outer wall of a plant|a kind of tiny animal
        Some birds, such as robins and sparrows, are **omnivores**, eating both seeds and insects.|animals that eat both plants and animals|animals that eat only meat|birds that cannot fly
        In ancient Rome, a **patrician** was a member of a rich, powerful family, unlike the poor plebeians.|a member of a rich, powerful family|a poor farmer|a soldier in the army
        **Erosion** is the slow wearing away of rock and soil by wind and water.|the slow wearing away of rock and soil|the building of new mountains|a sudden flood
        Scribes wrote on **papyrus**, a kind of paper made from reeds that grew by the Nile.|paper made from reeds|a stone tablet|a kind of ink
        Plants make food through **photosynthesis**, that is, by using sunlight to turn water and air into sugar.|making food from sunlight, water and air|drinking water through roots|growing taller each year
        The **epicenter** is the point on the surface right above where an earthquake begins.|the point on the surface above an earthquake's start|the deepest part of the ocean|the edge of a volcano
        Traders used **barter**, or the exchange of goods without money, before coins existed.|exchanging goods without money|paying with gold coins|stealing goods from others
        Unlike harmless bacteria, **pathogens** cause disease.|germs that cause disease|germs that help digestion|vitamins in food
        Many plants are **deciduous**; they lose their leaves every fall.|losing their leaves every fall|keeping green leaves all year|growing only in the desert
        The city was ruled by a **monarch**, a single king or queen.|a single king or queen|a group of elected leaders|an army general
        Lava that cools quickly forms **obsidian**, a shiny black glass.|a shiny black glass made from lava|soft white chalk|sand on a beach
        The **ziggurat** was a tall temple shaped like a stepped pyramid.|a stepped temple tower|a royal palace with gardens|a wall around a city
        The cell is surrounded by a **membrane**, a thin skin that lets some things in and keeps others out.|a thin skin around a cell|the center of a cell|a liquid inside the cell
        Some animals, such as bears and bats, **hibernate**, sleeping through the whole winter.|sleep through the whole winter|fly south for the winter|grow thick fur
        A **tributary** is a smaller river that flows into a bigger one.|a smaller river that flows into a bigger one|the mouth of a river|a lake in the mountains
        Many Roman towns had a **forum**, an open square where people met to trade and talk.|an open square for trade and talk|a theater for plays|a bath house
        **Precipitation**, or water falling from the sky as rain, snow or hail, fills the rivers.|water falling from the sky|water flowing under the ground|steam rising from the sea
        Animals that eat only plants are **herbivores**, unlike carnivores, which eat meat.|animals that eat only plants|animals that eat only meat|animals that eat everything
        The **mantle** is the thick layer of hot rock between the crust and the core.|the thick layer between crust and core|the outer surface of Earth|the very center of Earth
        A **chromosome** is a thread-like body in the cell that carries genes.|a thread-like body that carries genes|a kind of cell wall|a liquid that carries food
        The pharaoh's body was **embalmed**, treated with salts and oils so it would not decay.|treated so it would not decay|buried in sand|burned in a fire
        Volcanoes that have not erupted for thousands of years are **dormant**, or sleeping.|inactive but not dead|erupting right now|completely gone
        A **delta**, such as the one at the mouth of the Nile, forms where a river drops its mud.|land formed where a river drops its mud|a deep canyon|a mountain spring
        Some traits are **inherited**; children receive them from their parents.|passed down from parents|learned at school|caught from friends
        An **artifact** is an object made by people long ago, such as a tool or a pot.|an object made by people long ago|a fossil of an animal|a natural rock
      `,
        0,
      ),
      (right) => [
        `The text explains it right where it appears: here it means **${right}**.`,
        `文本在这个词出现的地方就做了解释：它在这里的意思是 **${right}**。`,
      ],
      [
        [
          "*{wrong}* is the meaning of another word; it does not match the explanation this sentence gives.",
          "*{wrong}* 是另一个词的意思，与这个句子给出的解释不符。",
        ],
        [
          "*{wrong}* is a different idea from the subject; the clue in the sentence points elsewhere.",
          "*{wrong}* 是该学科的另一个概念，句中的线索指向别处。",
        ],
      ],
    ),
    label(
      "the-kind-of-clue",
      ["The Kind of Clue", "线索的类型"],
      [
        "Writers explain technical words in four common ways. **A definition** says it directly: *Erosion is the wearing away of rock.* **A restatement** gives the meaning in other words after a comma, a dash, *or* or *that is*. **An example** names cases, after *such as* or *for example*. **A contrast** sets the word against its opposite, after *unlike*, *but* or *however*.",
        "作者解释专业词汇常用四种方法。**定义**直接说出：*Erosion is the wearing away of rock.* **换言之**在逗号、破折号、*or* 或 *that is* 之后用别的话说出意思。**举例**在 *such as* 或 *for example* 之后列出事例。**对比**在 *unlike*、*but* 或 *however* 之后把这个词与反义对照。",
      ],
      ["What kind of clue explains the word in bold?", "哪种线索解释了加粗的词？"],
      `
        **Erosion** is the slow wearing away of rock and soil by wind and water.|a definition
        Plants make food through **photosynthesis**, that is, by using sunlight.|a restatement
        Some birds, such as robins, are **omnivores**.|an example
        Unlike harmless bacteria, **pathogens** cause disease.|a contrast
        A **tributary** is a smaller river that flows into a bigger one.|a definition
        Traders used **barter**, or the exchange of goods without money.|a restatement
        Some animals, such as bears and bats, **hibernate** in winter.|an example
        Unlike carnivores, **herbivores** eat only plants.|a contrast
        The **epicenter** is the point on the surface above an earthquake's start.|a definition
        The **nucleus**, or control center of the cell, holds its instructions.|a restatement
        Many **artifacts**, for example tools and pots, were found in the tomb.|an example
        The squirrel is active by day, but the owl is **nocturnal**.|a contrast
        A **monarch** is a king or queen who rules alone.|a definition
        Lava can form **obsidian**, a shiny black glass.|a restatement
        **Precious metals**, such as gold and silver, were used for coins.|an example
        Some volcanoes erupt often; others, however, are **dormant** for centuries.|a contrast
        A **forum** was an open square where Romans met to trade and talk.|a definition
        The cell has a **membrane**, a thin skin that keeps things in.|a restatement
        **Fossil fuels**, such as coal and oil, formed from ancient plants.|an example
        Unlike evergreens, **deciduous** trees lose their leaves each fall.|a contrast
        A **delta** is land formed where a river drops its mud.|a definition
        **Precipitation**, or water falling from the sky, fills the rivers.|a restatement
        **Invertebrates**, for example worms and insects, have no backbone.|an example
        Some traits are learned, but others are **inherited** from parents.|a contrast
        An **aqueduct** is a channel that carries water to a city.|a definition
        Scribes wrote on **papyrus**, paper made from reeds.|a restatement
        **Natural disasters**, such as floods and earthquakes, can destroy cities.|an example
        Unlike a calm sea, a **turbulent** sea throws boats about.|a contrast
        A **seismograph** is an instrument that records the shaking of the ground.|a definition
        The **mantle**, the thick layer of hot rock beneath the crust, moves slowly.|a restatement
      `,
      clueLabels,
    ),
  ],
});

const featureLabels: Readonly<Record<string, Label>> = {
  "the glossary": {
    zh: "词汇表",
    why: ["The glossary at the back lists the book's special words with their meanings.", "书后的词汇表列出书中的专业词汇及其意思。"],
    not: ["The glossary gives the meanings of words, which is not what you need here.", "词汇表给出词的意思，而这里需要的不是这个。"],
  },
  "the index": {
    zh: "索引",
    why: [
      "The index lists topics in alphabetical order with every page where they appear.",
      "索引按字母顺序列出主题，以及它们出现的每一页。",
    ],
    not: [
      "The index tells the pages where a topic appears, which is not what you need here.",
      "索引说明某个主题出现在哪些页，而这里需要的不是这个。",
    ],
  },
  "the table of contents": {
    zh: "目录",
    why: ["The table of contents at the front lists the chapters in order with their first pages.", "书前的目录按顺序列出各章及其起始页。"],
    not: [
      "The table of contents shows the order of the chapters, which is not what you need here.",
      "目录显示各章的顺序，而这里需要的不是这个。",
    ],
  },
  "a heading": {
    zh: "小标题",
    why: [
      "A heading names the topic of the section below it, so you can find the part you need.",
      "小标题说明下面这一节的主题，帮你找到需要的部分。",
    ],
    not: ["A heading names a section's topic, which is not what you need here.", "小标题说明一节的主题，而这里需要的不是这个。"],
  },
  "a sidebar": {
    zh: "侧栏",
    why: ["A sidebar is a box beside the main text with extra, related facts.", "侧栏是正文旁边的方框，里面有相关的补充信息。"],
    not: ["A sidebar adds extra facts in a box, which is not what you need here.", "侧栏在方框中补充信息，而这里需要的不是这个。"],
  },
  "bold print": {
    zh: "粗体字",
    why: [
      "Bold print marks the key words of a section, which are usually explained nearby.",
      "粗体字标出一节中的关键词，它们通常在附近有解释。",
    ],
    not: ["Bold print marks key words in the text, which is not what you need here.", "粗体字标出文中的关键词，而这里需要的不是这个。"],
  },
};

const scienceFeatures = topic("reading", {
  id: "text-features-in-science",
  title: ["Text Features in Science", "科学文本的文本特征"],
  summary: [
    "Science books guide readers with a table of contents, headings, bold key words, sidebars, a glossary and an index.",
    "科学书籍用目录、小标题、粗体关键词、侧栏、词汇表和索引来引导读者。",
  ],
  after: ["text-features"],
  points: [
    label(
      "the-feature-to-use",
      ["The Feature to Use", "该用哪个特征"],
      [
        "Science books are built to be searched. The **table of contents** at the front lists the chapters in order. **Headings** name the topic of each section. **Bold print** marks key words. A **sidebar** is a box of extra facts. The **glossary** at the back gives meanings of the special words, and the **index** lists every page where a topic appears.",
        "科学书籍是为了便于查找而编排的。书前的**目录**按顺序列出各章。**小标题**说明每一节的主题。**粗体字**标出关键词。**侧栏**是装有补充信息的方框。书后的**词汇表**给出专业词汇的意思，**索引**列出某个主题出现的每一页。",
      ],
      ["Which feature would you use?", "你会用哪个特征？"],
      `
        You want to know what the word *mantle* means in this book.|the glossary
        You want every page that mentions sharks.|the index
        You want to see what chapters the book has and in what order.|the table of contents
        You want to find the section on how volcanoes erupt in this chapter.|a heading
        You want a fun extra fact about the deepest cave in the world.|a sidebar
        You want to spot the key words of the section quickly.|bold print
        You want the meaning of *photosynthesis* as this book uses it.|the glossary
        You want to find all the pages about the Moon.|the index
        You want to know which chapter comes after "Plants."|the table of contents
        You want to skip to the part of the chapter about animal cells.|a heading
        You want to read a short story of a scientist, set apart from the main text.|a sidebar
        You want to know which words the writer thinks are most important.|bold print
        You want to check the meaning of *erosion*.|the glossary
        You want to look up the pages about earthquakes in Japan.|the index
        You want to know on which page Chapter 5 begins.|the table of contents
        You want to find where the chapter starts talking about rain.|a heading
        You want extra safety tips for an experiment, in a box beside the text.|a sidebar
        You want to notice the new science words in a paragraph.|bold print
        You want to know what *nucleus* means.|the glossary
        You want every page that mentions Marie Curie.|the index
        You want an overview of the topics the whole book covers.|the table of contents
        You want to find the section called "Kinds of Rocks."|a heading
        You want a "Did you know?" fact related to the chapter.|a sidebar
        You want to find the terms you must learn for the quiz.|bold print
        You want the meaning of *habitat* as this book defines it.|the glossary
        You want to find the pages that talk about the Amazon.|the index
        You want to see how many chapters are about space.|the table of contents
        You want to jump to the part about how the heart pumps blood.|a heading
        You want a short biography of the inventor, set beside the main text.|a sidebar
        You want to see which words in the paragraph are science terms.|bold print
      `,
      featureLabels,
    ),
    choose(
      "what-a-heading-promises",
      ["What a Heading Promises", "小标题预示的内容"],
      [
        "A **heading** is a promise: it tells what the section below will explain. A heading that asks a question (*Why Do Volcanoes Erupt?*) promises an answer. A heading that names a topic (*Kinds of Clouds*) promises facts about that topic. Read the headings first to preview a chapter and to find the section you need.",
        "**小标题**是一种承诺：它说明下面这一节将解释什么。提问式的小标题（*Why Do Volcanoes Erupt?*）承诺给出答案。说明主题的小标题（*Kinds of Clouds*）承诺提供有关这个主题的事实。先读小标题，可以预览一章，也可以找到需要的部分。",
      ],
      ["What will the section under this heading most likely explain?", "这个小标题下的一节最可能解释什么？"],
      rival(
        `
        Why Do Volcanoes Erupt?|the causes of eruptions|the names of famous volcanoes|how to climb a volcano
        Kinds of Clouds|the different types of clouds|how rain is measured|why the sky is blue
        How Plants Make Food|the process of photosynthesis|where plants grow best|how to cook vegetables
        Parts of a Cell|the structures inside a cell|how cells were discovered|why people get sick
        The Water Cycle|how water moves between sky, land and sea|how much water to drink each day|where rivers begin
        What Causes Earthquakes?|the movement of plates under the ground|how to build a safe house|which cities have had earthquakes
        Life in the Deep Sea|animals that live far below the surface|how ships float|why the sea is salty
        How Fossils Form|the steps that turn remains into stone|where to buy fossils|the names of dinosaurs
        The Layers of Earth|the crust, mantle and core|how mountains are climbed|the history of maps
        Why Leaves Change Color|what happens to leaves in the fall|how to rake leaves|which trees are tallest
        Kinds of Rocks|the main types of rock and how they form|how to polish stones|where to find gold
        How the Heart Works|how the heart pumps blood|how to eat a healthy diet|why people dream
        Animals That Hibernate|animals that sleep through the winter|how birds fly south|why snow is white
        What Is Weather?|the conditions of the air day to day|how to read a calendar|the history of clocks
        How Sound Travels|how vibrations move through air|how to play the guitar|why some people sing well
        The Food Chain|how energy passes from one living thing to another|how to plan a meal|which foods are sweetest
        Where Rivers Begin|the sources of rivers in hills and mountains|how bridges are built|why fish swim upstream
        How Magnets Work|why magnets attract and repel|where to buy magnets|how compasses were invented
        Living Things Need Water|why plants and animals need water|how to build a well|how clouds form
        The Phases of the Moon|why the Moon seems to change shape|who first walked on the Moon|how tides work at the beach
        How Bones Heal|what happens when a broken bone mends|how to play sports safely|why bones are white
        What Makes Wind?|differences in air pressure and heat|how kites are made|why trees fall in storms
        Inherited Traits|features passed from parents to children|how to plan a family tree|why people move to new cities
        Erosion and Weathering|how wind and water wear rock away|how to build a sand castle|where deserts are found
        How Seeds Travel|the ways seeds are spread by wind and animals|how to plant a garden|which fruits are healthiest
        The Planets|the worlds that orbit the Sun|how rockets are built|why stars twinkle
        Why We Need Sleep|what sleep does for the body and brain|how to make a bed|why some animals sleep in the day
        How Volcanoes Help|the ways volcanoes benefit the land|how to escape a volcano|the names of active volcanoes
        Tools Scientists Use|instruments that help scientists measure and observe|how to become a scientist|the history of the school
        Germs and Disease|how tiny living things can make us sick|how to cook rice|why people need glasses
      `,
        1,
      ),
      (right, shown) => [
        `The heading *${shown}* promises a section about **${right}**.`,
        `小标题 *${shown}* 预示这一节讲的是 **${right}**。`,
      ],
      [
        [
          "*{wrong}* is related to the subject but is not what this heading promises to explain.",
          "*{wrong}* 与题材有关，但不是这个小标题承诺要解释的内容。",
        ],
        [
          "*{wrong}* is what a different heading would promise; nothing in this one points to it.",
          "*{wrong}* 是另一个小标题才会预示的内容，这个标题中没有任何内容指向它。",
        ],
      ],
    ),
  ],
});

/** readingTopics6a are the grade 6 topics of reading stories, poems and informational texts. */
export const readingTopics6a: readonly TopicDef[] = [
  archetypes,
  figurative,
  poemAndStory,
  causeInHistory,
  sentenceFits,
  ideaDeveloped,
  technicalWords,
  scienceFeatures,
];
