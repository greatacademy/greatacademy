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
  intro: [
    "A lonely shepherd climbs an icy peak to save his valley while an old weaver hands him a charmed cloak at the gate: readers from Greece to Japan recognize both roles at once because stories everywhere share recurring patterns called **archetypes**.",
    "孤独的牧羊人登上冰峰拯救山谷，老织工在城门口递给他一件施了魔法的斗篷——从希腊到日本，读者一眼就能认出这两个角色，因为世界各地的故事都共用着反复出现的模式，也就是**原型**。",
  ],
  after: ["plot-and-conflict"],
  points: [
    label(
      "character-archetypes",
      ["Character Archetypes", "人物原型"],
      [
        "An **archetype** is a character role or plot pattern so familiar that readers everywhere recognize it. Look at what the character actually does: in *An old lantern-maker shows the orphan how to read sea charts*, the older guide teaches a skill, so that is the **mentor**; the **hero** leaves safety to face danger; the **trickster** wins by cleverness and rule-breaking; the **villain** schemes to harm others; the **sidekick** stays loyally beside the hero.\n\n> **Watch out.** Do not judge by age or species alone—an animal can be a trickster, a sidekick, or even a mentor depending on the role it plays in the story.",
        "**原型**是各地读者一眼就能认出的人物角色或情节模式。看人物真正在做什么：在 *An old lantern-maker shows the orphan how to read sea charts* 中，年长的引导者传授技能，这就是**导师**；**英雄**离开安稳的家面对危险；**骗子**靠机智和不守规矩取胜；**反派**处心积虑伤害他人；**伙伴**忠诚地陪在英雄身边。\n\n> **注意。** 别光看年龄或物种——一只动物既可能是骗子，也可能是伙伴，甚至可能是导师，关键看它在故事里承担什么角色。",
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
            "The character steps out from safety to face the central danger for others; that is **the hero**.\n\n**Check.** Ask who drives the main action forward and takes the biggest risk: this character does, not a guide on the sidelines or a helper tagging along.",
            "这个人物离开安稳之处，为了他人直面核心危险，这就是**英雄**。\n\n**检验。** 问问是谁推动主线行动、承担最大风险：正是这个人物，而不是在旁指点的引导者或一路跟随的帮手。",
          ],
          not: [
            "The hero is the one who sets out and faces the main challenge, which this character does not do.",
            "英雄是出发去面对主要挑战的人，这个人物并没有这样做。",
          ],
        },
        "the mentor": {
          zh: "导师",
          why: [
            "An older, wiser character teaches a skill, offers advice, or gives a useful gift to prepare someone else; that is **the mentor**.\n\n**Check.** Notice who goes into the danger afterward: the younger traveler does, while this character stays in the teaching and equipping role.",
            "一个年长睿智的人物传授本领、给出忠告或赠送礼物，帮别人做好准备，这就是**导师**。\n\n**检验。** 看看之后是谁去冒险：是年轻人，而这个人物扮演的是教导和装备的角色。",
          ],
          not: [
            "The mentor teaches or gives a gift to someone younger, which this character does not do.",
            "导师向年轻人传授本领或赠送礼物，这个人物并没有这样做。",
          ],
        },
        "the trickster": {
          zh: "骗子",
          why: [
            "The character outsmarts others through wit, mischief, or a clever bargain rather than brute force; that is **the trickster**.\n\n**Check.** Ask what tool this character uses to win: neither a sword nor an army, just a sly trick that turns the rules upside down.",
            "这个人物靠机智、捉弄或巧妙的算计而非蛮力取胜，这就是**骗子**。\n\n**检验。** 问问这个人物靠什么赢：既不是刀剑也不是军队，而是把规矩玩弄于股掌之间的计谋。",
          ],
          not: [
            "The trickster wins by fooling others, which is not what this character does.",
            "骗子靠愚弄别人取胜，这不是这个人物的做法。",
          ],
        },
        "the villain": {
          zh: "反派",
          why: [
            "The character actively tries to harm, trap, or control others out of greed or cruelty; that is **the villain**.\n\n**Check.** Ask whose goal would hurt the community if it succeeded: this character's scheme is the threat the story must stop.",
            "这个人物出于贪婪或残忍，主动伤害、陷害或控制他人，这就是**反派**。\n\n**检验。** 问问谁的目标一旦得逞就会伤害众人：正是这个人物的阴谋构成了故事要阻止的威胁。",
          ],
          not: [
            "The villain works against others out of greed or cruelty, which this character does not do.",
            "反派出于贪婪或残忍与他人作对，这个人物并没有这样做。",
          ],
        },
        "the sidekick": {
          zh: "伙伴",
          why: [
            "The character stays loyally beside the hero, offering help, company, or encouragement along the road; that is **the sidekick**.\n\n**Check.** Notice that this character shares the journey as a faithful companion rather than leading the quest or training the hero beforehand.",
            "这个人物忠诚地陪在英雄身边，一路相助、陪伴或打气，这就是**伙伴**。\n\n**检验。** 注意这个人物是以忠实同伴的身份同行，而不是主导冒险或提前传授本领。",
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
        "Plots follow archetypes too. Compare *A blacksmith's daughter crosses three seas to recover a stolen bell* (**the quest**: a journey to win something) with *A proud duke ignores every warning until his own dam floods his estate* (**the fall**: ruin caused by one's own flaw). In **the test**, the hero proves courage, honesty, or wisdom; in **the return home**, the traveler comes back changed; in **rags to riches**, an overlooked or poor person rises to good fortune.\n\n> **Watch out.** A quest and a test both involve hardship—check whether the heart of the plot is a journey to obtain something (quest) or a trial designed to prove a quality (test).",
        "情节也有原型。对比 *A blacksmith's daughter crosses three seas to recover a stolen bell*（**探险**：为赢得某物而踏上旅程）和 *A proud duke ignores every warning until his own dam floods his estate*（**堕落**：因自身弱点而毁灭）。在**考验**中，英雄要证明勇气、诚实或智慧；在**归乡**中，旅人带着改变回到故土；在**由贫到富**中，贫穷或不起眼的人迎来好运。\n\n> **注意。** 探险和考验都有艰难险阻——要看情节的核心是出发去寻找某样东西（探险），还是设下一道关卡来检验某种品质（考验）。",
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
          why: [
            "The story centers on traveling out to find or bring back a prize; that is **the quest**.\n\n**Check.** Ask what would finish the story: reaching and claiming the object or place at the far end of the journey.",
            "故事的核心是出发远行，去寻找或带回某样目标，这就是**探险**。\n\n**检验。** 问问怎样才算结束故事：到达旅程尽头，找到或带回那个目标物或目的地。",
          ],
          not: [
            "The quest is a journey to find or win something, which is not what this story is about.",
            "探险是寻找或赢得某样东西的旅程，这个故事讲的不是这个。",
          ],
        },
        "the test": {
          zh: "考验",
          why: [
            "The character faces a specific trial to prove courage, honesty, wisdom, or self-control; that is **the test**.\n\n**Check.** Notice that the story hinges on passing a single challenge of character rather than traveling across lands to fetch something.",
            "人物面对一道专门的关卡，用来证明勇气、诚实、智慧或自制力，这就是**考验**。\n\n**检验。** 注意故事的关键在于通过一次品格或智慧的检验，而不是长途跋涉去寻找某物。",
          ],
          not: [
            "The test asks the hero to prove a quality, which is not what happens here.",
            "考验要求英雄证明某种品质，这里发生的不是这个。",
          ],
        },
        "the return home": {
          zh: "归乡",
          why: [
            "The traveler comes back to the place they left, wiser or carrying what they learned; that is **the return home**.\n\n**Check.** Look at the direction of movement: instead of setting out into the unknown, the character is arriving back where they started, changed by experience.",
            "旅人带着智慧或新收获回到出发的地方，这就是**归乡**。\n\n**检验。** 看行动的方向：不是向外闯入未知，而是历尽沧桑后回到起点，并且人已改变。",
          ],
          not: [
            "The return home is about coming back changed, which is not what this story is about.",
            "归乡讲的是带着改变回来，这个故事讲的不是这个。",
          ],
        },
        "rags to riches": {
          zh: "由贫到富",
          why: [
            "Someone who begins poor or overlooked rises to wealth, honor, or fame; that is **rags to riches**.\n\n**Check.** Compare the start and the finish: the character moves from the bottom of fortune to the top, the exact opposite of a fall.",
            "起点贫寒或不起眼的人一步步赢得财富、荣誉或名声，这就是**由贫到富**。\n\n**检验。** 对比开头和结局：人物从命运的低谷升到高处，和堕落正好相反。",
          ],
          not: [
            "Rags to riches is about a poor person rising, which is not what happens here.",
            "由贫到富讲的是穷人发迹，这里发生的不是这个。",
          ],
        },
        "the fall": {
          zh: "堕落",
          why: [
            "A proud, greedy, or powerful person loses everything because of their own flaw; that is **the fall**.\n\n**Check.** Ask who caused the ruin: not an outside villain, but the character's own pride, laziness, or greed.",
            "一个骄傲、贪婪或有权势的人因为自身弱点失去一切，这就是**堕落**。\n\n**检验。** 问问是谁造成了毁灭：不是外来的反派，而是人物自己的骄傲、懒惰或贪婪。",
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
    why: [
      "The words mean exactly what they say, with no comparison, exaggeration, or human trait added; that is **literal**.\n\n**Check.** Ask whether a camera could record the italicized phrase just as written: yes, it describes an ordinary fact.",
      "这些词就是字面上的意思，没有比较、夸张或拟人，这就是**字面意思**。\n\n**检验。** 问问摄像机能不能照字面拍下斜体部分描述的画面：可以，它说的就是普通事实。",
    ],
    not: ["The words do not mean exactly what they say, so they are not literal.", "这些词并不是字面上的意思，所以不是字面用法。"],
  },
  "a comparison": {
    zh: "比喻",
    why: [
      "One thing is compared to another, either with *like*/*as* (simile) or directly (metaphor); that is **a comparison**.\n\n**Check.** Ask what two unlike things are being matched: the sentence links the subject to a second image to highlight a shared quality.",
      "把一样东西比作另一样东西，无论用不用 *like*/*as*（明喻或暗喻），都是**比喻**。\n\n**检验。** 问问哪两样不同的东西被联系在了一起：句子把主语和另一个画面连起来，突出共同的特点。",
    ],
    not: [
      "Nothing here is said to be like, or to be, something else, so it is not a comparison.",
      "这里没有说某物像另一物或就是另一物，所以不是比喻。",
    ],
  },
  "an exaggeration": {
    zh: "夸张",
    why: [
      "The phrase stretches the truth far past what could really happen in order to emphasize a feeling; that is **an exaggeration** (hyperbole).\n\n**Check.** Ask whether the number, size, or time could be measured literally: no—it is blown up on purpose for effect.",
      "这句话把事实夸大到现实中不可能的程度，用来强调感受，这就是**夸张**。\n\n**检验。** 问问句中的数量、程度或时间能不能按字面测量：不能，它是故意放大来加强效果的。",
    ],
    not: ["Nothing here is stretched beyond what is possible, so it is not hyperbole.", "这里没有夸大到不可能的程度，所以不是夸张。"],
  },
  "a human quality": {
    zh: "拟人",
    why: [
      "Something that is not human is given a human action, voice, or feeling; that is **a human quality** (personification).\n\n**Check.** Look at the verb: it names something only a person normally does, yet the subject doing it is an object or part of nature.",
      "把人的动作、声音或情绪赋予非人的事物，这就是**拟人**。\n\n**检验。** 看句中的动词：它说的是通常只有人才能做的事，但发出动作的却是一个物体或自然事物。",
    ],
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
  intro: [
    "*The river froze solid* tells a plain weather fact, while *The river slept under a silver quilt* paints a picture: knowing whether words are **literal** or **figurative** keeps you from misreading what a writer really means.",
    "*The river froze solid* 说的是平实的天气事实，而 *The river slept under a silver quilt* 描绘了一幅画面：分清词语是**字面义**还是**比喻义**，才不会误解作者的本意。",
  ],
  after: ["personification-and-hyperbole"],
  points: [
    label(
      "literal-or-which-figure",
      ["Literal or Figurative", "字面还是比喻"],
      [
        "Test the words in italics against real life: could this happen exactly as stated? In *The baker weighed a sack of flour*, yes—it is **literal**. If not, name the figure: **a comparison** (simile or metaphor: *her voice was honey*), **an exaggeration** (hyperbole: *I've told you a million times*), or **a human quality** (personification: *the wind whispered*).\n\n> **Watch out.** Do not assume a dramatic verb is automatically figurative—*The kettle boiled* is literal, whereas *The kettle sang* gives the kettle a human action.",
        "把斜体部分放到现实里检验：它能照字面完全发生吗？在 *The baker weighed a sack of flour* 中可以，所以是**字面**用法。如果不能，再辨别修辞类型：**比喻**（明喻或暗喻：*her voice was honey*）、**夸张**（*I've told you a million times*）或**拟人**（*the wind whispered*）。\n\n> **注意。** 别以为动词有画面感就一定是比喻——*The kettle boiled* 是字面意思，而 *The kettle sang* 才赋予了水壶人的动作。",
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
        "To unpack a figure of speech, ask what quality the writer wants you to picture. *The classroom was a zoo* does not mean animals sat at desks; it means the room was **wild and noisy**. Pick the plain-English meaning that matches the feeling of the image.\n\n> **Watch out.** Do not pick a literal translation of one word in the figure—*weighed a ton* means *very heavy*, not *2,000 pounds on a scale*.",
        "理解比喻性语言时，要问作者想让你感受到什么特点。*The classroom was a zoo* 并不是说教室里有动物，而是说教室里**又乱又吵**。选出与画面感受一致的平实意思。\n\n> **注意。** 别按其中某个词的字面去选——*weighed a ton* 的意思是*非常重*，而不是*秤上刚好一吨*。",
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
        `In *${shown.replace(/\*/g, "")}*, the figurative words mean **${right}**; they paint a picture rather than state a literal fact.\n\n**Check.** Substitute **${right}** back into the sentence: the scene still makes complete sense and keeps the same mood, whereas a literal reading sounds absurd.`,
        `在 *${shown.replace(/\*/g, "")}* 中，这些比喻性的词的意思是 **${right}**；它们是在描绘画面，而不是陈述字面事实。\n\n**检验。** 把 **${right}** 代回原句：整个场景依然说得通，气氛也完全一致，而照字面读则会显得荒谬。`,
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
  intro: [
    "A four-line poem about a lighthouse and a short story about a storm-tossed captain can deliver the same message about courage using completely different tools: comparing a **poem** and a **story** shows how form shapes meaning.",
    "一首写灯塔的四行小诗和一篇写船长迎战风暴的短篇故事，可以用完全不同的手法传达同一个关于勇气的主题：比较**诗歌**和**故事**，能看出体裁怎样塑造表达。",
  ],
  after: ["theme", "tone-and-mood"],
  points: [
    label(
      "tools-of-each-form",
      ["The Tools of Each Form", "两种体裁的手法"],
      [
        "A **poem** works in lines and stanzas and leans on sound: rhythm, rhyme, and refrains (as in *Two roads diverged in a yellow wood*). A **story** works in paragraphs and chapters, moving through a plot with characters and dialogue. Both forms can share a theme, a mood, sensory images, figurative language, and a speaker or narrator.\n\n> **Watch out.** Do not assume figurative language or mood belongs only to poetry—stories use metaphors, similes, and mood too.",
        "**诗歌**以诗行和诗节展开，善用声音：节奏、押韵和叠句（如 *Two roads diverged in a yellow wood*）。**故事**以段落和章节展开，通过情节、人物和对话推进。两种体裁都可以有主题、气氛、感官意象、比喻性语言以及说话者或叙述者。\n\n> **注意。** 别以为比喻或气氛只属于诗歌——故事同样大量使用比喻和气氛。",
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
          why: [
            "Lines, stanzas, rhyme, meter, and musical sound devices are the signature tools of **a poem**.\n\n**Check.** Ask whether a normal prose story breaks lines on purpose for rhythm or stanza shape: no—those structural choices belong to poetry.",
            "诗行、诗节、押韵、节拍和音乐般的声韵手法是**诗歌**的标志性工具。\n\n**检验。** 问问普通散文故事会不会为了节奏或诗节形态而刻意换行：不会，这些结构安排属于诗歌。",
          ],
          not: [
            "This feature belongs to poems, with their lines and sounds, not to stories.",
            "这个特点属于有诗行和声音的诗歌，而不属于故事。",
          ],
        },
        "a story": {
          zh: "故事",
          why: [
            "Paragraphs, chapters, plot structure, and character dialogue are the signature tools of **a story**.\n\n**Check.** Ask whether this feature depends on unfolding events and conversations in prose paragraphs: yes, that is how narrative prose works.",
            "段落、章节、情节结构和人物对话是**故事**的标志性工具。\n\n**检验。** 问问这个特点是否依赖散文段落里的事件推进和人物交谈：是的，这正是叙事故事的写法。",
          ],
          not: [
            "This feature belongs to stories, with their plot and dialogue, not to poems.",
            "这个特点属于有情节和对话的故事，而不属于诗歌。",
          ],
        },
        both: {
          zh: "两者都有",
          why: [
            "Poems and stories can **both** use this element, even though their layout on the page looks different.\n\n**Check.** Picture a favorite poem and a favorite story: can each create this effect or carry this element? Yes, neither form owns it exclusively.",
            "诗歌和故事**两者都有**这个要素，尽管它们在页面上的排版不同。\n\n**检验。** 想一首你喜欢的诗和一篇你喜欢的故事：它们各自都能用到这个要素或制造这种效果吗？可以，它并不专属于某一种体裁。",
          ],
          not: ["This is not shared: only one of the two forms uses it.", "这不是两者共有的：只有其中一种体裁使用它。"],
        },
      },
    ),
    choose(
      "the-shared-theme",
      ["The Shared Theme", "共同的主题"],
      [
        "When a poem and a story share a theme, look past the surface details to what both **say** about life. A poem about a willow bending in a gale and a story about a traveler changing plans both say *Flexibility helps us survive trouble*. First name the message of each in a full sentence, then match the two.\n\n> **Watch out.** A shared topic (*trees* or *storms*) or a plain fact (*glass breaks easily*) is not a theme—a theme is a broader truth that fits both pieces.",
        "当一首诗和一个故事有共同主题时，要透过表面细节看两者对人生**共同说了什么**。一首写柳树随风弯腰的诗和一个写旅人灵活调整计划的故事，都在表达*灵活变通能帮我们渡过难关*。先用完整句子概括各自的主旨，再找共同点。\n\n> **注意。** 共同的题材（*树木*或*风暴*）或普通事实（*玻璃容易碎*）不是主题——主题是同时适用于两篇作品的更深层道理。",
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
        `Both texts point to the same message: **${right}** The poem expresses it through an image, while the story acts it out through events.\n\n**Check.** Test the statement against each piece separately: does it explain the poem's image and the outcome of the story without getting stuck on surface details? Yes.`,
        `两篇文本指向同一个主旨：**${right}** 诗歌通过意象表达，故事通过事件展现。\n\n**检验。** 把这句话分别放回两篇作品里检验：它既能解释诗中的意象，又能说明故事的结局，而且没有停留在表面细节上，因此正确。`,
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
    why: [
      "The italicized event happened first and made the other event happen; that is **the cause**.\n\n**Check.** Remove the italicized event in your mind: without it, the result in the rest of the sentence would not have followed.",
      "斜体事件先发生，并促使另一件事发生，这就是**原因**。\n\n**检验。** 在脑中去掉斜体事件：没有它，句子其余部分的结果就不会出现。",
    ],
    not: ["The words in italics did not make the other event happen.", "斜体部分并没有使另一个事件发生。"],
  },
  "the effect": {
    zh: "结果",
    why: [
      "The italicized event happened because of the other event; that is **the effect**.\n\n**Check.** Ask *Why did the italicized part happen?* The other half of the sentence gives the direct reason.",
      "斜体事件是因为另一件事才发生的，这就是**结果**。\n\n**检验。** 问一句*斜体部分为什么会发生？*句子的另一半直接给出了原因。",
    ],
    not: ["The words in italics are not what resulted from the other event.", "斜体部分不是另一个事件造成的结果。"],
  },
  "only at the same time": {
    zh: "只是同时发生",
    why: [
      "The two events merely overlapped in time; the sentence never says one brought about the other, so they happened **only at the same time**.\n\n**Check.** Look for causal links such as *because*, *so*, or *led to*: none appear—only time words like *while*, *in the same year*, or *during*.",
      "这两件事只是在时间上重合，句子并没有说一件导致了另一件，所以是**只是同时发生**。\n\n**检验。** 找一找 *because*、*so* 或 *led to* 等因果词：一个也没有，出现的只是 *while*、*in the same year* 或 *during* 这类时间词。",
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
  intro: [
    "When a volcano buried Pompeii, the ash froze an entire Roman town in place—a clear chain of **cause** and **effect**; yet a comet passing overhead the same decade had nothing to do with it. History readers separate real causes from mere coincidence.",
    "火山掩埋庞贝时，火山灰把整座罗马城定格了下来，这是清晰的**因果**链条；而同一十年里划过天空的彗星却与它毫无关系。读历史时，要分清真正的原因和纯粹的巧合。",
  ],
  after: ["connecting-events-in-history", "primary-and-secondary-sources"],
  points: [
    choose(
      "finding-the-cause",
      ["Finding the Cause", "找出原因"],
      [
        "A history text explains **why** an event happened using signal words such as *because*, *since*, *as a result*, *led to*, *so*, and *therefore*. In *Because the bridge washed out, grain prices doubled*, the bridge washing out came first and triggered the price jump. Always take the cause stated in the text rather than guessing from outside knowledge.\n\n> **Watch out.** An option can sound historically plausible and still be wrong if the passage itself does not give it as the cause.",
        "历史文本常借助 *because*、*since*、*as a result*、*led to*、*so*、*therefore* 等信号词解释事件**为什么**发生。在 *Because the bridge washed out, grain prices doubled* 中，桥梁被冲毁在先，引发了粮价翻倍。务必从文本中找明确给出的原因，而不是凭课外印象猜测。\n\n> **注意。** 某个选项听起来可能合乎历史常理，但如果文章本身并没有把它写成原因，它仍然是错的。",
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
        `The text names this exact cause: **${right}** Signal words such as *because*, *since*, *so*, or *led to* tie it directly to the outcome.\n\n**Check.** Trace the chain in reverse—ask *What happened right before the effect, and did the passage explicitly connect the two?* Only this cause is actually written in the passage.`,
        `文本明确给出了这个原因：**${right}** *because*、*since*、*so* 或 *led to* 等信号词把它和结果直接连了起来。\n\n**检验。** 倒推因果链——问一句*结果发生前紧接着发生了什么，文中是否明确把两者连了起来？*只有这个原因真实写在文本里。`,
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
        "Two events that happen in the same year are not automatically cause and effect. *The king died while a comet crossed the sky* only puts two events side by side (**only at the same time**). Look for causal signals—*because*, *since*, *so*, *as a result*, *led to*—to tell whether the italicized part is **the cause** or **the effect**.\n\n> **Watch out.** Do not let the order in the sentence fool you: in *The port closed because the harbor silted up*, the cause comes second in the sentence even though it happened first in time.",
        "发生在同一年里的两件事并不自动构成因果关系。*The king died while a comet crossed the sky* 只是把两件事并列说出（**只是同时发生**）。寻找 *because*、*since*、*so*、*as a result*、*led to* 等因果信号词，才能判断斜体部分是**原因**还是**结果**。\n\n> **注意。** 别被句子的先后顺序迷惑：在 *The port closed because the harbor silted up* 中，原因写在句子后半段，但它在时间上先发生。",
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
    why: [
      "This sentence introduces the broad point that the rest of the paragraph explains or proves; it **states the main idea**.\n\n**Check.** Ask whether the other sentences could stand as examples or reasons underneath this one: yes—it is the umbrella claim.",
      "这个句子提出整段要解释或证明的总观点，因此它**陈述主要观点**。\n\n**检验。** 问问其余句子能不能作为它的例子或理由放在下面：可以，它正是统领全段的总论点。",
    ],
    not: [
      "This sentence supports a larger point; it does not state what the whole paragraph is about.",
      "这个句子在支持一个更大的观点，并没有说出整段的内容。",
    ],
  },
  "gives an example": {
    zh: "举例",
    why: [
      "This sentence names one concrete case of the general claim before it, often signaled by *for example* or *for instance*; it **gives an example**.\n\n**Check.** Notice how the sentence narrows from a broad group (*many animals*, *some trees*) down to one specific member.",
      "这个句子举出前面笼统说法的一个具体事例，常带有 *for example* 或 *for instance*，因此它**举例**。\n\n**检验。** 注意句子如何从大类（*many animals*、*some trees*）缩小到了某一个具体对象。",
    ],
    not: ["This sentence does not show a particular case of the idea.", "这个句子没有展示观点的具体事例。"],
  },
  "gives a reason": {
    zh: "给出理由",
    why: [
      "This sentence explains *why* the earlier statement happens or is true, often using *because*, *since*, or *the reason*; it **gives a reason**.\n\n**Check.** Ask *Why?* right after the first sentence: the italicized sentence directly answers that question.",
      "这个句子用 *because*、*since* 或 *the reason* 等词解释前面说法为什么成立，因此它**给出理由**。\n\n**检验。** 在第一句后面追问一句*为什么？*斜体句子正好直接回答了这个问题。",
    ],
    not: ["This sentence does not explain why something is so.", "这个句子没有解释为什么。"],
  },
  "shows a contrast": {
    zh: "表示对比",
    why: [
      "This sentence pivots to an opposite or differing case, using signals like *however*, *by contrast*, *yet*, or *on the other hand*; it **shows a contrast**.\n\n**Check.** Compare the two sentences side by side: they point in opposite directions rather than adding more of the same.",
      "这个句子用 *however*、*by contrast*、*yet* 或 *on the other hand* 转向相反或不同的情况，因此它**表示对比**。\n\n**检验。** 把前后两句并排对照：它们指向相反方向，而不是顺着同一方向补充。",
    ],
    not: ["This sentence does not turn to a difference or an opposite point.", "这个句子没有转向差异或相反的观点。"],
  },
  "draws a conclusion": {
    zh: "得出结论",
    why: [
      "This sentence sums up the evidence or states the result that follows from it, often with *so*, *therefore*, *as a result*, or *clearly*; it **draws a conclusion**.\n\n**Check.** Notice where the sentence sits in the logic: it wraps up what the earlier facts prove rather than adding one more raw detail.",
      "这个句子常带 *so*、*therefore*、*as a result* 或 *clearly*，概括前文证据或说出由此得出的结果，因此它**得出结论**。\n\n**检验。** 看它在逻辑上的位置：它是在收束前面事实所证明的结论，而不是再添一条零散细节。",
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
  intro: [
    "Pull one brick out of an arch and the whole span wobbles—paragraphs work the same way. Seeing how a single sentence **fits the whole** reveals whether it introduces the claim, backs it up, pivots to a contrast, or seals the conclusion.",
    "抽掉拱门里的一块砖，整座拱就会晃动——段落也是如此。看懂单个句子**在全文中的作用**，就能分辨它是在提出观点、举例支撑、转折对比，还是收束结论。",
  ],
  after: ["text-structures"],
  points: [
    label(
      "the-job-of-a-sentence",
      ["The Job of a Sentence", "句子的作用"],
      [
        "Every sentence in a tight paragraph plays a specific role. Take: *Bridges need regular inspection. For example, engineers check steel cables for rust each spring.* The first sentence **states the main idea**; the second **gives an example**. Other sentences **give a reason** (*because*), **show a contrast** (*however*), or **draw a conclusion** (*therefore*).\n\n> **Watch out.** Do not judge a sentence in isolation—always read the sentences right next to it to see whether it is leading, supporting, contrasting, or concluding.",
        "结构紧凑的段落里，每个句子都有明确分工。看这组句子：*Bridges need regular inspection. For example, engineers check steel cables for rust each spring.* 第一句**陈述主要观点**，第二句**举例**。其他句子还可能**给出理由**（*because*）、**表示对比**（*however*）或**得出结论**（*therefore*）。\n\n> **注意。** 别孤立地看一个句子——一定要结合紧邻的前后句，看它是在领起、支撑、转折还是收束。",
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
        "When a sentence is missing from the middle of a paragraph, read **both** neighbors around the blank. In *Most deserts are hot. ___ They are covered in ice all year*, the third sentence suddenly talks about ice, so the blank must pivot with a contrast (*Some deserts, though, are very cold*). Pick the sentence that bridges both sides.\n\n> **Watch out.** A true fact about the general subject still fails if it leaves the sentence after the blank dangling with no connection.",
        "段落中间缺了一句时，要同时读空格**前后**两句。在 *Most deserts are hot. ___ They are covered in ice all year* 中，第三句突然说到冰雪，所以空格必须用转折搭桥（*Some deserts, though, are very cold*）。选出能把前后两头连起来的句子。\n\n> **注意。** 即使某个选项本身是正确的常识，如果填进去后下一句仍然衔接不上，它也不是合适选项。",
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
        `The missing bridge is: **${right}** It follows naturally from the opening sentence and sets up the sentence after the gap.\n\n**Check.** Read all three sentences aloud with this line in the blank: every pronoun and transition (*also*, *so*, *they*) now has a clear link to what comes before it.`,
        `最恰当的衔接句是：**${right}** 它顺承开头句，又自然引出空格后的句子。\n\n**检验。** 把这句话放进空格，把三句话连起来默读一遍：其中的代词和衔接词（*also*、*so*、*they*）都有了清晰的着落。`,
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
    why: [
      "The writer backs up the opening idea with several concrete instances; it is developed **by examples**.\n\n**Check.** Count the specific cases after the first sentence: the paragraph lists multiple particular examples rather than telling one story or walking through a timeline.",
      "作者用几个具体事例来支撑开头的观点，这是**举例**展开。\n\n**检验。** 数一数第一句后面的具体事例：段落并列举出了多个典型个案，而不是讲一个人的故事或按时间排序。",
    ],
    not: ["The paragraph does not mainly list particular cases of the idea.", "这段话主要不是列举观点的具体事例。"],
  },
  "by comparing": {
    zh: "比较",
    why: [
      "The writer sets two things side by side to show how they differ or resemble each other; the idea is developed **by comparing**.\n\n**Check.** Notice the balanced pair of subjects: each detail about the first item is matched against the second.",
      "作者把两样事物并排放在一起说明异同，这是**比较**展开。\n\n**检验。** 注意文中成对出现的两个对象：写完前者的特点后，紧接着就用后者来对照。",
    ],
    not: ["The paragraph does not mainly set two things side by side.", "这段话主要不是把两样东西放在一起比较。"],
  },
  "by steps in time": {
    zh: "按时间步骤",
    why: [
      "The writer walks through what happens first, next, and last in sequence; the idea is developed **by steps in time**.\n\n**Check.** Try scrambling the middle sentences: the process stops making sense because the order of stages matters.",
      "作者按先后顺序说明第一步、下一步和最后一步，这是**按时间步骤**展开。\n\n**检验。** 试着把中间几句打乱顺序：整个过程就讲不通了，因为这里的先后次序不能颠倒。",
    ],
    not: ["The paragraph does not mainly follow steps or events in order.", "这段话主要不是按顺序讲述步骤或事件。"],
  },
  "by causes and effects": {
    zh: "因果",
    why: [
      "The writer traces a chain where one event triggers the next; the idea is developed **by causes and effects**.\n\n**Check.** Look for the push-and-result links (*so*, *without*, *when ... then*): each outcome is explained by what caused it.",
      "作者追踪一件事如何引发下一件事的链条，这是**因果**展开。\n\n**检验。** 看句间的推动关系（*so*、*without*、*when ... then*）：每一个结果都是由前面的原因直接导致的。",
    ],
    not: ["The paragraph does not mainly show what causes what.", "这段话主要不是说明因果关系。"],
  },
  "by a story": {
    zh: "讲故事",
    why: [
      "The writer illustrates the idea through a brief true anecdote about one named person; it is developed **by a story**.\n\n**Check.** Ask who the paragraph zooms in on: a single person facing a real moment, not a list of general facts.",
      "作者通过一个具体人物的简短真实轶事来说明观点，这是**讲故事**展开。\n\n**检验。** 问问这段话把镜头对准了谁：是一个真实人物的经历，而不是一串泛泛的事实。",
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
  intro: [
    "Stating *Bridges shaped trade* is only a headline; a writer can prove it with a list of famous bridges, a comparison of two rivers, or a short story about one ferryman. Spotting **how an idea is developed** shows you the engine driving an informational paragraph.",
    "只说一句 *Bridges shaped trade* 还只是一个标题；作者可以用几座名桥的例子、两条河的比较，或一个摆渡人的小故事来证明它。看出**观点是怎样展开的**，就能看清说明性段落的推进方式。",
  ],
  after: ["two-main-ideas"],
  points: [
    label(
      "how-the-writer-develops-it",
      ["How the Writer Develops It", "作者怎样展开观点"],
      [
        "After stating a key idea, a writer **develops** it using one main strategy. Compare *Salt preserves food. First, salt draws water out of meat. Next, bacteria can no longer grow* (**by steps in time**) with a paragraph listing three different salted foods (**by examples**). Other strategies are **by comparing** two things, **by causes and effects**, and **by a story** (an anecdote about one person).\n\n> **Watch out.** Do not confuse **by steps in time** with **by a story**—steps explain a repeatable process or stages, while a story zooms in on one named person's experience.",
        "提出核心观点后，作者会选用一种主要方式来**展开**它。对比 *Salt preserves food. First, salt draws water out of meat. Next, bacteria can no longer grow*（**按时间步骤**）和列举三种腌制食物的段落（**举例**）。另外三种方式是**比较**两样事物、**因果**链条和**讲故事**（关于某人的真实轶事）。\n\n> **注意。** 别把**按时间步骤**和**讲故事**混在一起——时间步骤讲的是可重复的过程或阶段，而讲故事聚焦于某个具体人物的一段经历。",
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
        "A sentence **develops** an idea only when it adds new evidence—a concrete fact, reason, or example—that proves the claim. For *Coral reefs shelter sea life*, *Reefs house a quarter of all ocean fish species* develops the idea, whereas *Coral reefs are homes for sea creatures* merely rewords it.\n\n> **Watch out.** Watch for circular restatements that trade synonyms (*important* → *good*, *helps* → *is useful*) without adding a single new fact.",
        "只有补充了新的证据——具体事实、理由或例子——来证明观点的句子，才算**展开**观点。对于 *Coral reefs shelter sea life*，*Reefs house a quarter of all ocean fish species* 展开了观点，而 *Coral reefs are homes for sea creatures* 只是换词重复。\n\n> **注意。** 留心那些只换同义词（*important* → *good*，*helps* → *is useful*）却没增加任何新信息的原地打转句。",
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
        `The detail that moves the idea forward is: **${right}** It supplies concrete evidence instead of repeating the claim or drifting off topic.\n\n**Check.** Ask *What new information do I know now that the original idea alone did not tell me?* This sentence gives a specific fact or example that answers *how* or *why*.`,
        `能把观点往前推进的细节是：**${right}** 它提供了具体证据，而不是换词重复或跑题。\n\n**检验。** 问一句*比起原来的那句观点，我现在多知道了什么新信息？*这个句子用具体事实或例子回答了*怎样*或*为什么*。`,
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
      "The sentence defines the term straight out with *is*, *was*, or *means*; that is **a definition**.\n\n**Check.** Notice the linking verb right after the bold word: it works like an equals sign telling you exactly what the word is.",
      "句子用 *is*、*was* 或 *means* 直接界定词义，这是**定义**线索。\n\n**检验。** 看加粗词紧后面的系动词：它就像一个等号，直接告诉你这个词是什么。",
    ],
    not: ["The sentence does not state the meaning directly with *is* or *means*.", "句子没有用 *is* 或 *means* 直接说出意思。"],
  },
  "a restatement": {
    zh: "换言之",
    why: [
      "The sentence tucked the plain-language meaning right beside the term after a comma, *or*, or *that is*; that is **a restatement**.\n\n**Check.** Try replacing the bold word with the phrase right after the comma or *or*: the sentence still reads smoothly with the same meaning.",
      "句子在逗号、*or* 或 *that is* 后面紧跟着把专业词换成了平实说法，这是**换言之**线索。\n\n**检验。** 试着用逗号或 *or* 后面的短语替换加粗词：句子依然通顺且意思不变。",
    ],
    not: [
      "The meaning is not restated after a comma, a dash, *or* or *that is*.",
      "意思没有在逗号、破折号、*or* 或 *that is* 之后被换一种说法说出来。",
    ],
  },
  "an example": {
    zh: "举例",
    why: [
      "The sentence points to familiar members of the group after *such as* or *for example*; that is **an example**.\n\n**Check.** Ask whether the words after *such as* or *for example* are specific instances rather than a full dictionary definition: yes.",
      "句子在 *such as* 或 *for example* 后举出人们熟悉的具体成员，这是**举例**线索。\n\n**检验。** 问问 *such as* 或 *for example* 后面的内容是具体事例还是完整定义：它们是具体事例。",
    ],
    not: ["No examples of the word are given here.", "这里没有给出这个词的例子。"],
  },
  "a contrast": {
    zh: "对比",
    why: [
      "The sentence sets the term against an opposite using *unlike*, *but*, or *however*; that is **a contrast**.\n\n**Check.** Find the opposite partner in the sentence: flipping its meaning reveals what the bold term means.",
      "句子用 *unlike*、*but* 或 *however* 把专业词和反义对象并列，这是**对比**线索。\n\n**检验。** 找到句中与之相对的那个词：把它意思反过来，就能推出加粗词的意思。",
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
  intro: [
    "Reading *A **glacier**, a slow-moving river of ice, carves wide valleys* teaches you *glacier* on the spot without opening a dictionary. Science and history writers build clues right into the sentence around **technical words**.",
    "读到 *A **glacier**, a slow-moving river of ice, carves wide valleys* 时，不用翻词典就能当场懂 *glacier* 的意思。科学和历史作者常常把线索直接埋在**专业词汇**周围的句子里。",
  ],
  after: ["restatement-and-inference-clues"],
  points: [
    choose(
      "meaning-from-the-text",
      ["The Meaning from the Text", "从文本得出意思"],
      [
        "Subject-specific terms like *magma*, *aqueduct*, and *photosynthesis* are **technical words**. Look right around the bold word for a built-in explanation: in *The river emptied into an **estuary**, where fresh water meets the sea*, the clause after the comma defines the term directly.\n\n> **Watch out.** Do not stop at a familiar-looking part of the word if the sentence itself gives an explicit explanation—always trust the text's own clue first.",
        "像 *magma*、*aqueduct*、*photosynthesis* 这样属于特定学科的词就是**专业词汇**。先看加粗词紧挨着的上下文：在 *The river emptied into an **estuary**, where fresh water meets the sea* 中，逗号后的从句直接解释了这个词。\n\n> **注意。** 别光凭词里某个眼熟的片段去猜，如果句子本身已经给出明确解释，务必以文中的线索为准。",
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
        `The context clue in the sentence points directly to **${right}**.\n\n**Check.** Plug **${right}** back into the sentence in place of the bold word: the sentence stays accurate and matches the surrounding clue without contradiction.`,
        `句中的语境线索直接指向 **${right}**。\n\n**检验。** 把 **${right}** 代回原句替换加粗词：句子依然准确通顺，且与周围线索完全吻合。`,
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
        "Writers signal technical terms in four main ways. **A definition** uses *is/was/means* (*Erosion is the wearing away of rock*). **A restatement** tucks a synonym beside the word after a comma, dash, *or*, or *that is*. **An example** lists cases after *such as* or *for example*. **A contrast** sets up an opposite after *unlike*, *but*, or *however*.\n\n> **Watch out.** Notice the difference between **a definition** and **a restatement**: *A delta is land formed...* defines the term with a verb (*is*), while *obsidian, a shiny black glass,* restates it as an appositive after a comma.",
        "作者解释专业词汇常用四种信号。**定义**用 *is/was/means* 直接界定（*Erosion is the wearing away of rock*）。**换言之**在逗号、破折号、*or* 或 *that is* 后紧接同义说明。**举例**在 *such as* 或 *for example* 后列出事例。**对比**在 *unlike*、*but* 或 *however* 后给出反面参照。\n\n> **注意。** 分清**定义**和**换言之**：*A delta is land formed...* 用系动词（*is*）直接下定义，而 *obsidian, a shiny black glass,* 是在逗号后用同位语换一种说法。",
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
    why: [
      "To look up how this book defines a special term, turn to **the glossary** at the back.\n\n**Check.** Ask whether you want a word's meaning or a list of page numbers: a glossary gives definitions, not page citations.",
      "要查这本书对某个专业词汇的定义，就要翻到书后的**词汇表**。\n\n**检验。** 问问自己要找的是词义还是页码列表：词汇表给的是释义，不是页码。",
    ],
    not: ["The glossary gives the meanings of words, which is not what you need here.", "词汇表给出词的意思，而这里需要的不是这个。"],
  },
  "the index": {
    zh: "索引",
    why: [
      "To find every page where a specific topic or name appears, use **the index** at the back.\n\n**Check.** Ask whether you want a broad chapter list or exact page numbers for one narrow topic: only the alphabetical index lists every page.",
      "要找出某个具体主题或人名出现的所有页码，就要用书后的**索引**。\n\n**检验。** 问问自己要看的是整章概览还是某个细小主题的全部页码：只有按字母排序的索引会列出每一页。",
    ],
    not: [
      "The index tells the pages where a topic appears, which is not what you need here.",
      "索引说明某个主题出现在哪些页，而这里需要的不是这个。",
    ],
  },
  "the table of contents": {
    zh: "目录",
    why: [
      "To see the book's chapters in order and where each begins, check **the table of contents** at the front.\n\n**Check.** Ask whether you want the big-picture order of chapters from front to back: that is the table of contents, not an alphabetical index.",
      "要查看全书各章的顺序和起始页码，就要看书前的**目录**。\n\n**检验。** 问问自己要看的是从头到尾的章节框架还是按字母检索的词条：看全书章节顺序用目录，不用索引。",
    ],
    not: [
      "The table of contents shows the order of the chapters, which is not what you need here.",
      "目录显示各章的顺序，而这里需要的不是这个。",
    ],
  },
  "a heading": {
    zh: "小标题",
    why: [
      "To jump straight to one section inside a chapter, scan for **a heading**.\n\n**Check.** Notice you are already inside the chapter looking for a specific subtopic, so a section heading points right to it.",
      "要在某一章里直接跳到特定小节，就要扫读**小标题**。\n\n**检验。** 注意你已经在一章里面找具体小主题，小标题正好标出每一节讲什么。",
    ],
    not: ["A heading names a section's topic, which is not what you need here.", "小标题说明一节的主题，而这里需要的不是这个。"],
  },
  "a sidebar": {
    zh: "侧栏",
    why: [
      "For a boxed bonus fact, short biography, or safety tip set beside the main text, look in **a sidebar**.\n\n**Check.** Ask whether this information is part of the main argument or an extra box beside it: extra boxed details live in sidebars.",
      "要看正文旁边方框里的补充趣闻、人物小传或安全提示，就要看**侧栏**。\n\n**检验。** 问问这些内容是正文主线还是旁边的补充方框：额外补充的方框内容放在侧栏里。",
    ],
    not: ["A sidebar adds extra facts in a box, which is not what you need here.", "侧栏在方框中补充信息，而这里需要的不是这个。"],
  },
  "bold print": {
    zh: "粗体字",
    why: [
      "To spot key vocabulary terms quickly while scanning a paragraph, look for **bold print**.\n\n**Check.** Notice that dark, heavy type draws the eye to important terms right inside the paragraph—unlike a heading above a section.",
      "要在段落里一眼认出重点术语，就要找**粗体字**。\n\n**检验。** 注意加粗的字体直接嵌在段落正文中标出关键词，而小标题位于整节上方。",
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
  intro: [
    "Nobody reads a 400-page science textbook from page one just to find what *osmosis* means. Knowing which **text feature** to open—table of contents, heading, bold print, sidebar, glossary, or index—gets you to the answer in seconds.",
    "没人会为了查 *osmosis* 的意思而把四百页的科学教材从第一页翻起。熟悉各种**文本特征**——目录、小标题、粗体字、侧栏、词汇表和索引——几秒钟就能直达答案。",
  ],
  after: ["text-features"],
  points: [
    label(
      "the-feature-to-use",
      ["The Feature to Use", "该用哪个特征"],
      [
        "Science books are built for fast searching. Suppose you need every page mentioning *glaciers*: skip the front **table of contents** (which only lists chapters in order) and use the back **index** (alphabetical page list). Inside a chapter, **headings** label sections, **bold print** flags key terms, a **sidebar** boxes extra facts, and the **glossary** defines special words.\n\n> **Watch out.** Do not mix up the **glossary** and the **index**—both sit at the back of the book, but the glossary gives *meanings* while the index gives *page numbers*.",
        "科学书籍专为快速查找而设计。假如你要找书中所有提到 *glaciers* 的页码，别翻书前的**目录**（它只按顺序列出各章），而要查书后的**索引**（按字母列出页码）。在章节内部，**小标题**标明各节主题，**粗体字**突出关键词，**侧栏**用方框放补充信息，**词汇表**解释专业词汇。\n\n> **注意。** 别把**词汇表**和**索引**弄混——它们都在书后，但词汇表给的是*词义*，索引给的是*页码*。",
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
        "A **heading** makes a specific promise about the section beneath it. *Why Do Tides Rise and Fall?* promises causes, whereas *Kinds of Clouds* promises categories. Match the exact question word (*Why*, *How*, *Kinds*, *Parts*) in the heading to what the section will explain.\n\n> **Watch out.** Do not get pulled toward an option just because it repeats the noun (*volcano*, *rock*, *cell*)—check whether it matches the *angle* the heading asks for.",
        "**小标题**对下面这一节的内容作出明确承诺。*Why Do Tides Rise and Fall?* 承诺解释原因，*Kinds of Clouds* 承诺介绍分类。把小标题里的关键词（*Why*、*How*、*Kinds*、*Parts*）和对应解释内容对齐。\n\n> **注意。** 别因为某个选项重复了同一个名词（*volcano*、*rock*、*cell*）就选它——要看它是否符合小标题要求的*切入角度*。",
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
        `The heading *${shown}* promises a section explaining **${right}**.\n\n**Check.** Match the heading's focus word (*Why*, *How*, *Where*, *Kinds*, *Parts*) to **${right}**: it answers that exact question rather than wandering into a different angle on the same topic.`,
        `小标题 *${shown}* 预示这一节会解释 **${right}**。\n\n**检验。** 把小标题的焦点词（*Why*、*How*、*Where*、*Kinds*、*Parts*）和 **${right}** 对应起来：它正好回答了标题提出的问题，而没有偏到同一题材的其他角度。`,
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
