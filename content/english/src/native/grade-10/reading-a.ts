// Grade 10: reading of literature: complex characters and their motives, shifts of tone, extended metaphors, and
// ambiguity that invites more than one reading.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const motives = topic("reading", {
  id: "complex-characters-and-motives",
  title: ["Complex Characters and Their Motives", "复杂人物及其动机"],
  summary: [
    "How a complex character acts from mixed or hidden motives, and how a reader infers a motive from what the character does, says and hides.",
    "复杂人物如何出于混杂或隐藏的动机行事，读者又如何从人物的所作所为、所言所隐中推断其动机。",
  ],
  after: ["tragic-heroes-and-flaws", "dynamic-and-static-characters"],
  points: [
    label(
      "what-drives-the-character",
      ["What Drives the Character", "是什么驱使着人物"],
      [
        "A **motive** is the reason behind an action. Complex characters rarely act from one simple motive, and they seldom announce it. Read what they do, especially when no one is watching, and what they choose not to say. Common motives in literature include **ambition**, the hunger for power or rank; **fear**, of loss, shame or danger; **love or loyalty** to a person or a group; and **revenge** for a past wrong.",
        "**动机**是行为背后的原因。复杂人物很少只出于一个简单的动机，也很少把动机说出来。要读他们做了什么，尤其是在没人看见的时候，以及他们选择不说什么。文学作品中常见的动机有：**野心**，即对权力或地位的渴望；**恐惧**，害怕失去、羞辱或危险；**爱或忠诚**，对某个人或群体；以及**复仇**，为过去的伤害。",
      ],
      ["What motive best explains the character's action?", "哪种动机最能解释人物的行为？"],
      `
        When the old king fell ill, his advisor began quietly meeting the generals one by one, always at night.|ambition
        Mara burned the letter before anyone could read it; if the village learned what her brother had done, they would drive the family out.|fear
        Though the reward for turning in the rebel was enormous, the farmer hid his childhood friend in the hayloft for a month.|love or loyalty
        For twenty years the miller kept the judge's name on a scrap of paper in his coat, and when the judge came to his town, he was waiting.|revenge
        The young clerk volunteered for every task the director noticed and none that she did not.|ambition
        He told the doctor he felt fine, though the pain kept him awake; he could not bear to hear what the tests might show.|fear
        She took the blame for the broken vase so that her little sister would not be sent away to school.|love or loyalty
        The duke smiled at the wedding of the man who had ruined his father, and the next week the man's ships began to sink.|revenge
        The general refused the crown three times in public, each time a little more slowly.|ambition
        Every night the boy checked the locks twice and left the hall light burning.|fear
        Though the team was losing every game, the captain turned down an offer from the champions.|love or loyalty
        She practiced the piano eight hours a day, and on the night of the competition she sat in the front row to watch her old teacher's favorite pupil lose.|revenge
        The new manager rewrote the report so that the success seemed to be his idea from the beginning.|ambition
        The witness changed his story after a stranger visited his house.|fear
        The soldier carried his wounded friend for six miles, though the enemy was close behind.|love or loyalty
        Years after the bully had left school, Tom bought the building where the man ran his shop and doubled the rent.|revenge
        Macbeth's wife told him to look like the innocent flower but be the serpent under it.|ambition
        The girl laughed at the joke along with the others, though it was about her best friend.|fear
        The old servant refused to leave the burning house until he had carried out the children of the family.|love or loyalty
        The poisoned cup was meant for the man who had betrayed her father at the court.|revenge
        He married the governor's daughter, whom he did not love, and moved into the governor's house.|ambition
        The guard looked away while the prisoners escaped; he had seen what the captain did to men who reported trouble.|fear
        She gave up her place at the university to stay home and nurse her mother.|love or loyalty
        The pirate spared every ship but those that flew the flag of the navy that had hanged his brother.|revenge
        The senator changed her vote the moment the polls showed which side was winning.|ambition
        The boy hid his poor report card in the garden, remembering his father's rage the year before.|fear
        Although the king had exiled him, the knight rode back to defend the castle when the invaders came.|love or loyalty
        Hamlet delays, but he never forgets the ghost's command to avenge his murdered father.|revenge
        Instead of thanking her mentor in her speech, the young scientist claimed the discovery as her own.|ambition
        The sailor would not go below deck again after the night the ship nearly sank.|fear
      `,
      {
        ambition: L(
          "野心",
          "The action aims at power, rank or success, and the character pursues it carefully or at others' expense.",
          "这个行为的目标是权力、地位或成功，人物小心谋取或不惜损害他人。",
          "Nothing in the action aims at gaining power, rank or success.",
          "这个行为中没有任何谋取权力、地位或成功的成分。",
        ),
        fear: L(
          "恐惧",
          "The character acts to avoid a danger, a loss or a shame that frightens them.",
          "人物的行为是为了躲避令其恐惧的危险、损失或羞辱。",
          "The action is not a way of escaping something the character dreads.",
          "这个行为并不是为了逃避人物所害怕的东西。",
        ),
        "love or loyalty": L(
          "爱或忠诚",
          "The character accepts a cost for the sake of a person or a group they care about.",
          "人物为了所关心的人或群体而甘愿付出代价。",
          "The character is not paying a price for someone they care about.",
          "人物并不是在为所关心的人付出代价。",
        ),
        revenge: L(
          "复仇",
          "The action pays back a past wrong done to the character or to someone close to them.",
          "这个行为是在报复过去对人物本人或其亲近之人造成的伤害。",
          "The action does not answer an old wrong.",
          "这个行为并不是在回应过去的伤害。",
        ),
      },
    ),
    choose(
      "mixed-motives",
      ["Mixed Motives", "混杂的动机"],
      [
        "The most interesting characters act from **more than one motive at once**, and the motives may pull against each other. A king may spare a rebel out of mercy and also to look merciful to his people. A daughter may care for her father out of love and also out of guilt. When you analyze a character, name the motive the text supports with evidence, and look for a second motive that complicates it.",
        "最有意思的人物往往**同时出于不止一个动机**行事，而且这些动机可能相互拉扯。国王饶恕叛乱者，可能出于仁慈，也可能是为了在百姓面前显得仁慈。女儿照顾父亲，可能出于爱，也可能出于愧疚。分析人物时，要说出文本有证据支持的动机，再寻找使之复杂化的第二个动机。",
      ],
      ["Which reading of the character's motives does the passage best support?", "这段文字最支持对人物动机的哪种解读？"],
      `
        The king pardoned the rebel in the crowded square, then glanced at the watching nobles to see how they took it.|He acts from mercy and also to be seen as merciful.|He acts only out of pure mercy, with no thought of others.|He pardons the rebel because he fears the rebel's army.
        She visited her dying father every day, though for years she had refused to speak to him; she wept, but not, she admitted, only from grief.|She acts from love and also from guilt about the lost years.|She visits only because the doctors insisted.|She visits because she hopes to inherit his house.
        The detective solved the case that had beaten his rival, and he made sure the newspapers knew whose case it had been.|He wants justice and also to humiliate his rival.|He wants only to see justice done.|He solves the case because he is paid by the hour.
        Though the coach praised the star player in public, he quietly gave the boy's position to his own nephew.|He favors his family while pretending to be fair.|He honestly believes his nephew is the better player.|He wants the star player to rest because of an injury.
        The general wept at the funeral of the soldiers he had sent into the hopeless attack, and then asked for more troops.|He feels real grief, but his ambition still drives him on.|He feels nothing and only pretends to weep.|He regrets the attack and plans to resign.
        She donated the money to the hospital, and asked that a wing be named after her.|She is generous and also wants to be remembered.|She donates only because the law requires it.|She gives the money in secret, wanting no credit.
        He forgave his brother for stealing the farm, but he never again ate at his brother's table.|He forgives in words but keeps his resentment.|He has completely forgotten the theft.|He forgives him because he wants the farm back.
        The young knight swore to protect the princess, and blushed whenever she spoke to him.|He acts from duty and also from love.|He protects her only because the king pays him.|He wants to marry her for her fortune alone.
        The mayor saved the old theater from demolition just before the election, after years of ignoring it.|She values the theater and also wants votes.|She has always fought for the theater.|She saves it because her daughter performs there.
        The scientist warned the public about the dangerous drug, though the company that made it had fired him a year before.|He wants to protect the public and also to pay back the company.|He warns them only out of anger at the company.|He warns them because the company asks him to.
        The servant saved the master's son from drowning, and expected to be freed for it.|He acts from courage and also from hope of reward.|He saves him only because he was ordered to.|He acts with no hope of anything in return.
        The champion trained the newcomer who would one day replace her, and sometimes held back her best advice.|She is generous but also afraid of being replaced.|She has no wish to share any of her skills.|She trains the newcomer because she plans to retire soon.
        The prince stayed silent while his father made a disastrous decision; he would be king sooner if his father failed.|He respects his father but also hopes to gain from his failure.|He is silent because he agrees with the decision.|He is silent because he is too young to understand.
        The old woman refused to sell her land to the company, though she needed the money; her husband was buried there, and she disliked the manager.|She is loyal to her husband's memory and also stubborn toward the manager.|She refuses only because the price is too low.|She refuses because she has no use for money.
        He helped the refugees cross the border and charged them for every mile.|He is helping them, but he also profits from their need.|He helps them only out of kindness.|He helps them because the government orders him to.
        Antigone buried her brother against the king's law, proud of the danger she faced.|She acts from loyalty to her brother and also from pride.|She acts only to defy the king, whom she hates.|She buries him because she fears the gods' anger alone.
        The teacher gave the shy student the lead role, partly because no one else had auditioned.|She believes in the student and also has no other choice.|She gives the role to the best actor in the school.|She gives the role as a punishment.
        The reporter exposed the corrupt mayor, and her own career rose on the story.|She serves the public and also advances herself.|She writes the story only for the money.|She writes the story because the mayor is her rival.
        The father paid for his son's education, and reminded him of it at every family dinner.|He loves his son but also wants credit and control.|He pays only because the law demands it.|He never mentions the money at all.
        Brutus joined the plot against Caesar, saying it was for Rome, yet he loved his own good name above all.|He acts for Rome and also for his own honor.|He kills Caesar only for Caesar's money.|He joins the plot because he is forced at sword point.
        The girl told the teacher about the cheating, and she was also first in the class after the cheater was removed.|She values honesty and also benefits from the result.|She speaks up only to get revenge on the cheater.|She speaks up without knowing she would gain anything.
        The soldier deserted his post to see his newborn daughter, knowing the punishment.|He acts from love that outweighs his fear of punishment.|He deserts because he is a coward.|He deserts because he is ordered to go home.
        The merchant built a school in his village, with his own portrait above the door.|He is generous and also proud.|He builds it only to make money from fees.|He builds it in secret and never visits.
        The queen spared her rival's life and kept her in a tower where no one could see her.|She shows mercy but also removes a threat.|She spares her purely out of sisterly love.|She frees her rival completely.
        The inventor gave his design away for free, which also ruined the company that had cheated him.|He wants to help others and also to punish the company.|He gives it away because he has no use for it.|He gives it away by accident.
        The boy apologized to his friend, but only after the friend's family invited him on holiday.|He is sorry and also hopes for the holiday.|He apologizes without any thought of the holiday.|He never apologizes at all.
        The old sailor told the young crew stories of the storm, always making his own part a little braver.|He wants to teach the crew and also to be admired.|He tells the stories only to frighten the crew.|He tells the stories exactly as they happened.
        The nurse stayed with the sick patient past her shift, and later wrote about it in her application for promotion.|She cares about the patient and also about her career.|She stays only to earn extra pay.|She stays because no one else is allowed in.
        The rebel leader freed the prisoners, then asked each of them to join his army.|He acts from justice and also to gain soldiers.|He frees them only because they are his relatives.|He frees them by mistake.
        The poet praised the emperor in a famous ode, and was given a house in the capital.|He admires the emperor and also seeks reward.|He writes the ode only to mock the emperor.|He writes the ode in secret and never shares it.
      `,
      (right) => [
        `"${right}" names one motive the passage supports and a second one that complicates it, as the details show.`,
        `“${right}” 说出了文段支持的一个动机，以及使之复杂化的第二个动机，正如细节所示。`,
      ],
      [
        [
          '"{wrong}" names only one motive and ignores the detail in the passage that shows a second, less noble one.',
          "“{wrong}”只说出一个动机，忽略了文段中显示另一个不那么高尚的动机的细节。",
        ],
        ['"{wrong}" invents a motive that nothing in the passage supports.', "“{wrong}”编造了文段中没有任何依据的动机。"],
      ],
    ),
  ],
});

const toneShifts = topic("reading", {
  id: "tone-shifts-in-a-text",
  title: ["Shifts of Tone", "语气的转变"],
  summary: [
    "Where and why the tone of a poem, story or speech turns, and the signal words and contrasts that mark the turn.",
    "诗歌、故事或演讲的语气在何处、为何转变，以及标志这一转变的信号词和对比。",
  ],
  after: ["the-cumulative-impact-of-word-choice", "poetic-forms-and-meter"],
  points: [
    label(
      "from-what-to-what",
      ["From What to What", "从什么到什么"],
      [
        "Tone is the writer's attitude, and it can change within a text. A turn is often marked by a **signal word** such as *but*, *yet*, *now* or *then*, by a change of time or by a stanza break. To describe a shift, name the tone **before** and **after**: *from playful to grave*, *from bitter to hopeful*.",
        "语气是作者的态度，它可以在文本中发生变化。转变常由 *but*、*yet*、*now* 或 *then* 这样的**信号词**、时间的变化或诗节之间的空行来标志。描述转变时，要说出转变**前**和转变**后**的语气：*由戏谑到庄重*、*由苦涩到充满希望*。",
      ],
      ["How does the tone shift in this passage?", "这段文字的语气如何转变？"],
      `
        We laughed all the way to the lake, splashing and shouting. Then we saw the empty boat drifting near the far shore.|from playful to grave
        For months I cursed the rain and the gray sky and the mud. But this morning the first green shoots broke through the field.|from bitter to hopeful
        The garden was full of roses and bees and my grandmother's singing. Now the gate is locked, and weeds hide the path.|from joyful to mournful
        What a fine plan, said the critics: tear down the library to build a parking lot. Brilliant. Then they saw the empty shelves in the children's room, and no one was laughing.|from playful to grave
        I hated the new school, its long cold halls, its strangers. Yet by spring I knew every face, and one of them was a friend.|from bitter to hopeful
        Every summer the house rang with cousins and music. This year only the clock speaks.|from joyful to mournful
        The clown tripped over his own shoes, and the children shrieked with delight. Behind the tent, he sat alone and took off his painted smile.|from playful to grave
        The war took my brother, my home, my city. And still, today, a child in the shelter taught me a song.|from bitter to hopeful
        We danced in the square on the night of the festival. A year later, the square is rubble.|from joyful to mournful
        The speech began with jokes about the mayor's terrible taste in ties. Then the speaker paused. "But today," he said, "we must talk about the river."|from playful to grave
        Our crops failed, our savings ran out, and the bank took the truck. But my daughter got into university, and she will be the first of us to go.|from bitter to hopeful
        She sang to the baby every night, bright and silly songs. The cradle in the attic is empty now.|from joyful to mournful
        My friends teased me for weeks about my haircut. Then my grandfather saw it and quietly said I looked just like my late father.|from playful to grave
        For years the factory poured smoke into our town. Now the river runs clear, and children fish in it again.|from bitter to hopeful
        The letters were full of jokes and plans and drawings of the house they would build. The last one was never sent.|from joyful to mournful
        The cat chased its tail around the kitchen while we cheered. Then the vet called with the results.|from playful to grave
        The critics called my first novel a failure, and for two years I wrote nothing. Yesterday I began again.|from bitter to hopeful
        The village sang at the harvest, and the barns were full. The next winter, the barns were empty and the singing stopped.|from joyful to mournful
        We joked that Grandpa would outlive us all. At the hospital, nobody joked.|from playful to grave
        I lost the election by twelve votes and blamed everyone. Then a young woman thanked me for running, and said she would run next time.|from bitter to hopeful
        The school hall was bright with balloons for the reunion. Half the names on the list had a small black cross beside them.|from joyful to mournful
        The poem opens with a silly rhyme about a cat in a hat. Its last stanza describes the cat's grave under the apple tree.|from joyful to mournful
        I swore I would never forgive the town that drove us out. This spring, the town asked my mother to come back and open her bakery.|from bitter to hopeful
        The comedian mocked the politicians all evening. In his last minute, he spoke quietly about his own father losing his job.|from playful to grave
        The flood took the bridge and the mill and our patience. But the neighbors came with shovels, and by Sunday the mill wheel turned.|from bitter to hopeful
        The picnic was perfect: sun, cake, the river glittering. That was the last day all five of us were together.|from joyful to mournful
        The students cheered when the fire alarm cut the exam short. Outside, they saw the smoke rising from the science wing.|from playful to grave
        The doctors said I would never walk again, and for a year I believed them. Today I took three steps.|from bitter to hopeful
        We built sandcastles until dark and promised to meet every summer. Only one of us came back.|from joyful to mournful
        The play's first act is a comedy of mistaken identities. In the second, the mistakes lead to a death.|from playful to grave
      `,
      {
        "from playful to grave": L(
          "由戏谑到庄重",
          "The passage begins lightly, with fun or jokes, and turns serious when something important or dangerous appears.",
          "这段文字以轻松、玩笑开头，在出现某件重要或危险的事情时转为严肃。",
          "The passage does not move from fun or jokes to seriousness.",
          "这段文字并不是由玩笑转为严肃。",
        ),
        "from bitter to hopeful": L(
          "由苦涩到充满希望",
          "The passage begins with anger, resentment or despair and turns toward hope or new life.",
          "这段文字以愤怒、怨恨或绝望开头，转向希望或新生。",
          "The passage does not move from bitterness toward hope.",
          "这段文字并不是由苦涩转向希望。",
        ),
        "from joyful to mournful": L(
          "由欢乐到哀伤",
          "The passage remembers a happy time and turns to grief for what has been lost.",
          "这段文字回忆一段快乐时光，然后转为对逝去之物的悲伤。",
          "The passage does not move from happiness to grief for a loss.",
          "这段文字并不是由欢乐转为对失去之物的悲伤。",
        ),
      },
    ),
    choose(
      "the-signal-of-the-turn",
      ["The Signal of the Turn", "转折的信号"],
      [
        "Writers mark a shift of tone in several ways. A **signal word** announces it: *but*, *yet*, *still*, *now*, *then*. A **change of time** moves from past to present, or from one season to another. A **break** in the form, such as a new stanza or a one-line paragraph, sets the turn apart. In a sonnet, the turn often comes at the start of the ninth line or the final couplet. Finding the signal tells you exactly where the tone turns.",
        "作者用几种方式标志语气的转变。**信号词**会宣告转变：*but*、*yet*、*still*、*now*、*then*。**时间的变化**会从过去转到现在，或从一个季节转到另一个季节。形式上的**间断**，如新的诗节或只有一行的段落，会把转折单独突出出来。在十四行诗中，转折常出现在第九行开头或最后的对句。找到信号，就能准确知道语气在哪里转变。",
      ],
      ["Which word or phrase marks the turn of tone?", "哪个词或短语标志了语气的转折？"],
      `
        The meadow shone with buttercups and larks. Yet underneath, the old mine tunnels waited.|Yet|shone|underneath
        All winter we shivered and starved. Now the swallows are back, and the barn smells of hay.|Now|shivered|smells
        I ran and laughed and fell in the snow. Then I heard my mother calling my name, and her voice was wrong.|Then|laughed|calling
        The house was loud with children for thirty years. Today it is for sale.|Today|loud|for sale
        He promised he would return by spring. But spring came, and the road stayed empty.|But|promised|empty
        The boys raced their bicycles down the hill, shouting. At the bottom, the ambulance was waiting.|At the bottom|raced|shouting
        Everything in the city was gray: the sky, the stones, the faces. Still, in one window, a red geranium bloomed.|Still|gray|faces
        We were sure we would win; we had practiced for months. In the end, we lost by a single point.|In the end|practiced|single
        The village slept in the summer heat. That night, the soldiers came.|That night|slept|heat
        I used to think my father was the strongest man alive. Last week I helped him up the stairs.|Last week|strongest|stairs
        The speech was full of promises: jobs, schools, roads. Five years later, nothing has been built.|Five years later|promises|built
        The sea was calm and blue as a plate. Suddenly the sky darkened in the west.|Suddenly|calm|darkened
        For years she was afraid of the dark. Tonight she walked home alone under the stars, singing.|Tonight|afraid|singing
        The guests praised the food, the music and the bride. Only the groom's mother did not smile.|Only|praised|smile
        We said goodbye at the station with jokes and hugs. On the train, I finally cried.|On the train|jokes|cried
        The factory was the heart of our town for a century. Now it is a ruin full of pigeons.|Now|heart|pigeons
        Grandmother told stories of the old country, bright with weddings and markets. However, she never told us why she left.|However|bright|never
        The first eight lines of the sonnet praise the beloved's beauty. In the ninth line, the poet admits that time will destroy it.|the ninth line|praise|destroy
        At first the town welcomed the newcomers with bread and salt. Within a year, the doors were closed to them.|Within a year|welcomed|closed
        The child played happily in the sand. Meanwhile, far out, the tide had turned.|Meanwhile|happily|turned
        The army marched out with flags and drums. It returned in silence, carrying its dead.|It returned in silence|flags|carrying
        I thought the exam was easy and finished early. When the results came, I found I had skipped a whole page.|When the results came|easy|skipped
        The orchard was white with blossom in April. By August, the drought had killed every tree.|By August|white|killed
        He was the funniest boy in our class. Years later, I read his name in the newspaper.|Years later|funniest|newspaper
        The music rose and rose, joyful and loud. And then it stopped.|And then|joyful|loud
        The letter began with news of the weather and the harvest. In the last line, she wrote that she was ill.|In the last line|news|ill
        The hikers sang as they climbed in the sunshine. Above them, unseen, the snow began to slide.|Above them, unseen|sang|sunshine
        I hated my brother for years because he left home. When he came back, he brought the medicine our mother needed.|When he came back|hated|medicine
        Spring returned to the valley as it always did. Except this year there were no lambs.|Except|returned|lambs
        The crowd cheered as the rocket rose into the sky. Seventy-three seconds later, the cheering stopped.|Seventy-three seconds later|cheered|stopped
      `,
      (right) => [
        `"${right}" marks the turn: it is the point where the passage moves from one attitude to another.`,
        `“${right}” 标志着转折：文段在这里从一种态度转向另一种态度。`,
      ],
      [
        [
          '"{wrong}" belongs to the tone before the turn; it describes the scene but does not mark the change.',
          "“{wrong}”属于转折前的语气；它描写场景，却没有标志变化。",
        ],
        [
          '"{wrong}" belongs to the tone after the turn; the turn itself comes earlier, at the signal.',
          "“{wrong}”属于转折后的语气；转折本身出现得更早，就在信号处。",
        ],
      ],
    ),
  ],
});

const extended = topic("reading", {
  id: "extended-metaphor",
  title: ["Extended Metaphor", "扩展隐喻"],
  summary: [
    "A metaphor carried through several lines or a whole text, with each detail of one thing matched to a detail of the other.",
    "贯穿数行乃至全文的隐喻，一个事物的每个细节都与另一个事物的细节相对应。",
  ],
  after: ["similes-and-metaphors", "symbolism"],
  points: [
    label(
      "what-is-compared",
      ["What Is Compared", "比较的是什么"],
      [
        "An **extended metaphor** keeps one comparison going for several lines, so that every detail of one thing stands for a detail of another. In *All the world's a stage, / And all the men and women merely players*, the world is a theater, people are actors, and the stages of life are their parts. To read one, ask what the main comparison is and what each detail stands for.",
        "**扩展隐喻**把一个比较延续好几行，使一个事物的每个细节都代表另一个事物的细节。在 *All the world's a stage, / And all the men and women merely players* 中，世界是剧场，人是演员，人生的各个阶段是他们扮演的角色。读扩展隐喻时，要问主要的比较是什么，每个细节又代表什么。",
      ],
      ["What is life compared to in this extended metaphor?", "在这个扩展隐喻中，人生被比作什么？"],
      `
        We set out at dawn with full sails. Some of us found calm water; some were wrecked on hidden rocks; all of us, at last, came into the same quiet harbor.|a voyage
        Each of us is handed a script we did not write. We play our parts, forget our lines, take our bows, and the curtain falls.|a play
        The road forks at every year. We choose one way, look back at the other, and walk on until the road runs out.|a journey on foot
        Childhood is the spring planting; youth is the long summer of growing; age is the harvest, gathered in before the frost.|the seasons of a farm
        We are sailors in a small boat, and every storm tests whether our ropes will hold until we reach the far shore.|a voyage
        I was given a small role in a long drama, and I have tried to say my few lines well before I leave the stage.|a play
        Every morning I lace my boots and climb a little farther up the mountain path, though I cannot see the top.|a journey on foot
        In the spring of my life I was planted; I grew in the summer heat; now, in autumn, I must see what fruit I bore.|the seasons of a farm
        The tide carried me from port to port, and I learned to read the stars before the long night crossing.|a voyage
        My grandfather played many parts: the soldier, the lover, the father, and at last the quiet old man in the corner of the scene.|a play
        Behind me the trail winds back through every valley I have crossed; ahead, the path climbs into the clouds.|a journey on foot
        We sow in hope, we weed in patience, and we reap whatever the seasons allow.|the seasons of a farm
        Some set sail with maps and some without; some steer by the stars and some only drift with the current.|a voyage
        The audience changes, the scenery changes, but every actor must leave by the same door at the back of the stage.|a play
        I have walked through the dark wood of failure and over the bright hills of success, and I am not yet tired.|a journey on foot
        My mother tended her children like a garden: she planted, watered, pruned and waited for the bloom.|the seasons of a farm
        We drop anchor in the harbor of old age and listen to the young ships leaving.|a voyage
        At sixteen I was given a costume too big for me and told to improvise.|a play
        Every life is a long walk, and the people we meet are fellow travelers on the road for a while.|a journey on foot
        Our youth is the green field; our age, the stubble after harvest.|the seasons of a farm
        The ship of his life ran aground on debt, and he spent years mending the hull.|a voyage
        She knew that her entrance was late in the second act, and she meant to make it memorable.|a play
        We all come to the crossroads, and no signpost tells us which way leads home.|a journey on foot
        A teacher sows seeds in the spring of her students' lives and may never see the harvest.|the seasons of a farm
        Through calm and storm, through fog and starlight, I have held the wheel of my own small boat.|a voyage
        The world is a theater where the play is always in rehearsal and no one knows the ending.|a play
        Uphill, downhill, through rain and dust, the long march of my life goes on.|a journey on foot
        After the long winter of illness, the first shoots of my strength came back.|the seasons of a farm
        I have crossed the ocean of grief, and now I see land.|a voyage
        Life gives us a part and a few cues; the rest we make up as we go.|a play
      `,
      {
        "a voyage": L(
          "航行",
          "The details are those of sailing: ships, sails, storms, tides, harbors and the shore.",
          "这些细节都与航行有关：船、帆、风暴、潮汐、港口和海岸。",
          "The passage does not use the language of ships and the sea.",
          "这段文字并没有使用船和大海的语言。",
        ),
        "a play": L(
          "戏剧",
          "The details are those of the theater: scripts, roles, lines, costumes, the stage and the curtain.",
          "这些细节都与剧场有关：剧本、角色、台词、戏服、舞台和幕布。",
          "The passage does not use the language of the theater.",
          "这段文字并没有使用剧场的语言。",
        ),
        "a journey on foot": L(
          "徒步旅程",
          "The details are those of walking: roads, paths, crossroads, hills and fellow travelers.",
          "这些细节都与步行有关：道路、小径、岔路口、山丘和同路人。",
          "The passage does not use the language of roads and walking.",
          "这段文字并没有使用道路和行走的语言。",
        ),
        "the seasons of a farm": L(
          "农场的四季",
          "The details are those of farming through the year: planting, growing, harvest and frost.",
          "这些细节都与一年中的农事有关：播种、生长、收获和霜冻。",
          "The passage does not use the language of planting and harvest.",
          "这段文字并没有使用播种和收获的语言。",
        ),
      },
    ),
    choose(
      "what-the-detail-stands-for",
      ["What the Detail Stands For", "细节代表什么"],
      [
        "Once you know the main comparison, match each detail to its meaning. If life is a voyage, a **storm** is a time of trouble, the **harbor** is rest or death, and the **compass** is whatever guides a person. A good reading explains several details, not just the first one, and shows how they fit together.",
        "知道了主要的比较以后，就把每个细节与它的含义对应起来。如果人生是一次航行，**风暴**就是困难时期，**港口**是安息或死亡，**指南针**是指引一个人的东西。好的解读要解释好几个细节，而不只是第一个，并说明它们如何组合在一起。",
      ],
      ["In this extended metaphor, what does the word in bold stand for?", "在这个扩展隐喻中，加粗的词代表什么？"],
      `
        Life is a voyage, and in the worst **storm** of my life I lost both my parents in a single year.|a time of great trouble|a change of weather|a long journey abroad
        Life is a voyage. My grandfather sailed for ninety years and came at last into the quiet **harbor**.|death or final rest|a busy city port|a new job by the sea
        Life is a voyage, and my mother's advice was the **compass** I steered by.|something that guides choices|a tool for finding north|a gift from a sailor
        Life is a play. When my grandmother died, she made her **exit** with grace.|her death|leaving a room|a door in a theater
        Life is a play, and at fifteen I was still learning my **lines**.|how to behave as an adult|words to memorize for school|the wrinkles on a face
        Life is a play. My father's **costume** was the gray suit of a bank clerk, though he dreamed of the sea.|the role society gave him|clothes for a party|a uniform he hated wearing
        Life is a journey on foot, and at eighteen I stood at the **crossroads**.|a major decision|a busy road junction|a place to rest
        Life is a journey on foot. Old age is the long **downhill** stretch toward evening.|the decline toward death|an easy walk|a ski slope
        Life is a journey on foot, and my friends were **fellow travelers** for a while.|companions for part of life|tourists on a bus|strangers on a train
        Life is a farm through the seasons. In my **spring**, I was planted in a poor village.|my childhood|the month of April|a source of water
        Life is a farm through the seasons, and now I gather the **harvest** of my years.|the results of my life's work|a crop of wheat|a festival in autumn
        Life is a farm through the seasons, and **frost** comes for every field at last.|death|cold weather that comes late in the year|a white color
        The heart is a house. Since she left, its **rooms** are dark and the doors are locked.|the parts of his feelings|the bedrooms of a home|places to store things
        The heart is a house, and grief is a **guest** who will not leave.|a feeling that stays too long|a visitor at dinner|a relative who moves in
        Hope is a bird. It sings its **tune** without words even in the coldest storms.|its comfort, which needs no reason|a song on the radio|a melody played on a flute
        Hope is a bird, and it **perches** in the soul.|lives quietly inside a person|sits on a branch|lands on a roof
        Time is a river. The **current** carries all of us toward the sea.|the steady passing of time|the flow of electricity|a modern fashion
        Time is a river, and the **sea** at its end is eternity.|what lies beyond time, or death|a large salt lake|a summer holiday
        The mind is a garden. Every bad habit is a **weed** that must be pulled.|something harmful that grows if ignored|a wild plant|a kind of food
        The mind is a garden, and reading is the **rain**.|what feeds and grows the mind|wet weather|a gift from the sky
        Memory is an attic. In its **dusty corners** I found my first words.|forgotten old memories|unswept places in a house|the edges of a book
        Memory is an attic, and I **climb the ladder** whenever I am sad.|try to remember the past|go upstairs|do exercise
        Grief is an ocean. Some days its **waves** knock me down.|sudden strong feelings of sorrow|movements of water|signs of hello
        Grief is an ocean, and at first I could not find the **shore**.|a place of calm and recovery|a sandy beach|the end of a trip
        The city is a beast. At night its **eyes**, the windows, glow yellow.|lit windows|the glowing eyes of a wild animal|police cameras
        The city is a beast, and the traffic is its **roar**.|the city's noise|the loud sound a lion makes|a car race
        War is a fire. It **devours** the young first.|kills|eats a large meal very quickly|burns wood
        War is a fire, and peace is the slow work of **rebuilding** from the ashes.|recovering after war|making new houses|cleaning a fireplace
        Knowledge is a lamp, and ignorance is the **darkness** it pushes back.|not knowing|the hours of night after sunset|a power cut
        Knowledge is a lamp, and every teacher **passes the flame** to the next.|hands knowledge to students|lights a candle|starts a fire
      `,
      (right) => [
        `In this metaphor, the bold word stands for ${right}; it fits the main comparison and the other details.`,
        `在这个隐喻中，加粗的词代表“${right}”；它符合主要的比较和其他细节。`,
      ],
      [
        [
          'The answer "{wrong}" reads the word literally, but here it is part of the metaphor and stands for something else.',
          "答案“{wrong}”是按字面理解这个词，但这里它是隐喻的一部分，代表别的东西。",
        ],
        [
          'The answer "{wrong}" does not fit the main comparison or the rest of the passage.',
          "答案“{wrong}”与主要的比较或文段的其余部分不符。",
        ],
      ],
    ),
  ],
});

const ambiguity = topic("reading", {
  id: "ambiguity-and-interpretation",
  title: ["Ambiguity and Interpretation", "歧义与解读"],
  summary: [
    "When a text deliberately supports more than one reading, and how to judge which interpretations the evidence allows.",
    "当文本有意支持不止一种解读时，如何判断哪些解读有证据支持。",
  ],
  after: ["how-a-theme-develops", "unreliable-narrators"],
  points: [
    label(
      "a-reading-the-text-allows",
      ["A Reading the Text Allows", "文本允许的解读"],
      [
        "Some texts are **ambiguous** on purpose: an ending that is not explained, a word with two meanings, a character whose motive is hidden. Ambiguity does not mean anything goes. An interpretation is **supported** when details in the text point to it. It is **unsupported** when it ignores or contradicts the details. And it is **over-certain** when it treats one possible reading as the only one, though the text leaves the question open.",
        "有些文本有意**含混**：没有解释的结尾，有两个意思的词，动机被隐藏的人物。含混并不意味着怎么解读都行。如果文本中的细节指向某种解读，这种解读就**有依据**。如果它忽视或违背细节，就**没有依据**。如果文本让问题悬而未决，它却把一种可能的解读当作唯一的解读，就是**过于肯定**。",
      ],
      ["How well does the interpretation fit the passage?", "这种解读与文段的契合程度如何？"],
      `
        Passage: At the end of the story, the old man walks into the sea at sunset, and the last line says only, "The water was warm." Interpretation: The ending may suggest that he has found peace, or that he is ending his life.|supported
        Passage: At the end of the story, the old man walks into the sea at sunset, and the last line says only, "The water was warm." Interpretation: The old man is going for a swim because he enjoys exercise.|unsupported
        Passage: At the end of the story, the old man walks into the sea at sunset, and the last line says only, "The water was warm." Interpretation: The story proves that the old man kills himself.|over-certain
        Passage: The poem ends, "And miles to go before I sleep." Interpretation: "Sleep" can mean rest at the end of a journey, and it may also suggest death.|supported
        Passage: The poem ends, "And miles to go before I sleep." Interpretation: The speaker is complaining that he is tired of his job as a driver.|unsupported
        Passage: The poem ends, "And miles to go before I sleep." Interpretation: "Sleep" means death and nothing else; the poem is only about dying.|over-certain
        Passage: The governess sees figures that no one else sees, and she becomes convinced the children are in danger. Interpretation: The ghosts may be real, or they may exist only in her troubled mind.|supported
        Passage: The governess sees figures that no one else sees, and she becomes convinced the children are in danger. Interpretation: The figures are actors hired by the uncle to scare her away.|unsupported
        Passage: The governess sees figures that no one else sees, and she becomes convinced the children are in danger. Interpretation: The story proves the governess is insane.|over-certain
        Passage: The film ends with the spinning top still turning as the screen goes black. Interpretation: The ending leaves open whether the hero is awake or still dreaming.|supported
        Passage: The film ends with the spinning top still turning as the screen goes black. Interpretation: The top keeps spinning because the hero has invented a magic toy.|unsupported
        Passage: The film ends with the spinning top still turning as the screen goes black. Interpretation: The hero is certainly still dreaming.|over-certain
        Passage: The brothers shake hands at the funeral, and the narrator says, "Neither of them let go first." Interpretation: The handshake may show a new closeness, or a contest of pride between them.|supported
        Passage: The brothers shake hands at the funeral, and the narrator says, "Neither of them let go first." Interpretation: The brothers are stuck together because their hands are frozen.|unsupported
        Passage: The brothers shake hands at the funeral, and the narrator says, "Neither of them let go first." Interpretation: The brothers have clearly forgiven each other completely.|over-certain
        Passage: The story ends as the girl opens the letter, and we never learn what it says. Interpretation: Leaving the letter unread puts the focus on her choice to face the truth, whatever it is.|supported
        Passage: The story ends as the girl opens the letter, and we never learn what it says. Interpretation: The letter must be from a secret admirer, since the story is a romance.|unsupported
        Passage: The story ends as the girl opens the letter, and we never learn what it says. Interpretation: The letter certainly brings bad news, because she is nervous.|over-certain
        Passage: The poem calls the moon "a coin no one can spend." Interpretation: The image may suggest beauty that cannot be owned, or riches that are useless to the poor.|supported
        Passage: The poem calls the moon "a coin no one can spend." Interpretation: The poet is explaining that the moon is made of metal.|unsupported
        Passage: The poem calls the moon "a coin no one can spend." Interpretation: The line is only about poverty and has no other meaning.|over-certain
        Passage: When asked whether she regrets leaving home, the narrator says, "I regret nothing," and then looks away for a long time. Interpretation: Her words deny regret, but her silence may suggest she feels it.|supported
        Passage: When asked whether she regrets leaving home, the narrator says, "I regret nothing," and then looks away for a long time. Interpretation: She looks away because she sees a bird outside.|unsupported
        Passage: When asked whether she regrets leaving home, the narrator says, "I regret nothing," and then looks away for a long time. Interpretation: She is plainly lying and regrets everything.|over-certain
        Passage: The last scene shows the empty swing still moving in the wind. Interpretation: The moving swing may suggest that the child's memory lingers, or simply that life goes on.|supported
        Passage: The last scene shows the empty swing still moving in the wind. Interpretation: The swing is broken and needs to be repaired.|unsupported
        Passage: The last scene shows the empty swing still moving in the wind. Interpretation: The swing proves that the child's ghost is still playing.|over-certain
        Passage: The title of the story is "The Gift," and the gift in it is both a watch and a lesson. Interpretation: The title may point to the object and to what the boy learns.|supported
        Passage: The title of the story is "The Gift," and the gift in it is both a watch and a lesson. Interpretation: The title shows that the story is about birthdays.|unsupported
        Passage: The title of the story is "The Gift," and the gift in it is both a watch and a lesson. Interpretation: The title refers only to the watch.|over-certain
      `,
      {
        supported: L(
          "有依据",
          "The interpretation rests on details in the passage and respects that the text may allow more than one reading.",
          "这种解读以文段中的细节为依据，并尊重文本可能允许不止一种解读这一事实。",
          "The interpretation either lacks support in the details or closes a question the text leaves open.",
          "这种解读要么在细节中缺乏依据，要么把文本悬而未决的问题定死了。",
        ),
        unsupported: L(
          "没有依据",
          "Nothing in the passage points to this reading; it ignores the details or invents new ones.",
          "文段中没有任何内容指向这种解读；它忽视了细节，或编造了新的细节。",
          "The details of the passage do point toward this reading.",
          "文段的细节确实指向这种解读。",
        ),
        "over-certain": L(
          "过于肯定",
          "The reading is possible, but it claims to be the only one, though the text deliberately leaves the question open.",
          "这种解读是可能的，但它声称是唯一的解读，而文本有意让问题悬而未决。",
          "The reading does not turn one possibility into a certainty.",
          "这种解读并没有把一种可能性当成确定无疑的结论。",
        ),
      },
    ),
    choose(
      "the-detail-that-opens-the-question",
      ["The Detail That Opens the Question", "使问题悬而未决的细节"],
      [
        "Ambiguity usually lives in a particular detail: a word with **two meanings**, an **action without an explanation**, a **missing piece** of the story, or a **narrator who may not be reliable**. To discuss an ambiguous text well, point to the exact detail that makes more than one reading possible.",
        "含混通常存在于某个具体的细节中：一个有**两种意思**的词，一个**没有解释的行为**，故事中**缺失的一块**，或一个**可能不可靠的叙述者**。要好好讨论一个含混的文本，就要指出使多种解读成为可能的那个具体细节。",
      ],
      ["Which detail makes the passage open to more than one reading?", "哪个细节使这段文字可以有不止一种解读？"],
      `
        The sailor's wife waited on the cliff every evening for a year. On the last page, a ship appears on the horizon, and the story ends.|We never learn whose ship it is.|She waited every evening for a year.|The story is set by the sea.
        "I will always remember you," the queen told the traitor as he was led away.|"Remember" could be loving or threatening.|The traitor was led away.|The queen spoke to the traitor.
        The narrator tells us he is perfectly calm, then spends a page explaining why no one should think he is mad.|The narrator may not be reliable.|The narrator speaks in the first person.|The story is a page long.
        The boy gives the stranger his last coin and walks away without a word.|His reason for giving the coin is never explained.|He has only one coin left.|He leaves the stranger and walks back down the road alone.
        The poem's title is "The Fall," and it describes autumn leaves and a young man's mistake.|"Fall" can mean autumn or a moral failure.|The poem describes leaves.|The young man makes a mistake.
        The play ends as the two enemies sit down at the same table, and the lights go out.|We do not see whether they make peace or fight.|The enemies sit at a table.|The stage lights go out at the very end of the last scene.
        The letter says only, "Come home. Everything has changed."|"Changed" could be good news or bad news.|The letter is short.|The letter asks someone to come home.
        The detective closes the case, but in the last scene he stares at the old photograph for a long time.|His stare suggests he may doubt his own solution.|The detective solves the case.|There is an old photograph in the detective's office at the end.
        The painting shows a woman at a window, and no one can tell whether she is waiting for someone or watching someone leave.|Her reason for standing at the window is unclear.|The painting shows a window.|The woman in the painting stands alone in a room by a window.
        "She was a perfect wife," the husband tells the police, smiling.|His smile may hint that he is hiding something.|The husband talks to the police.|He describes her to the police as his wife, using that word.
        The story ends: "And the house was quiet again." Earlier, the children had begged their parents to send the old dog away.|"Quiet again" could mean peace or a sad loss.|The house is quiet.|The children in the story live with their parents and an old dog.
        The general wins the battle and writes in his diary, "A great victory. Twelve thousand dead."|The flat tone could be pride or horror.|He keeps a diary.|The general wins the battle and records the number of the dead.
        The narrator's brother disappears in the forest, and the narrator says, "I never went back to look."|We never learn why the narrator did not search.|The brother goes into the forest.|The story is told by a narrator who speaks about his own brother.
        The poem's speaker says, "I have been one acquainted with the night."|"The night" could be literal darkness or despair.|The speaker walks at night.|The poem is in the first person.
        The film shows the heroine smiling as she boards the train, then a close-up of her hand shaking.|Her smile and her hand send different messages.|She boards a train.|The film uses a close-up shot of the heroine's hand near the end.
        The fable ends: "And the fox was never hungry again."|It could mean the fox prospered or that it died.|The fox was hungry before.|The fable, like many fables, is a short tale about a hungry fox.
        The old woman says she buried her treasure in the garden, but the family digs and finds only roses.|"Treasure" may be gold or the garden itself.|The family digs in the garden.|When the family digs in the garden, they find only rose bushes there.
        The diary's last entry is torn out.|A missing page hides the ending.|The diary has entries.|The diary is old.
        The knight returns from the quest and will not say what he found.|His silence leaves the meaning of the quest open.|He goes on a quest.|The knight returns home from his long quest at the end of the story.
        When the mother sees her son's medal, she says, "So this is what it costs."|"Costs" could mean effort or the death of his friends.|The son wins a medal.|The mother speaks when she sees the medal that her son has brought home.
        The narrator says he saw a ghost, but admits he had not slept for three days.|His tiredness makes his account doubtful.|The narrator saw something.|He had gone without sleep for three whole days before he saw it.
        The story's last line is: "Then she opened the door."|We do not know what was on the other side.|She opens a door.|The last line of the story is very short and ends with a period.
        The town's statue of its founder is described as "watching over us, as he always did."|"Watching over" could be protective or controlling.|The town has a statue.|The founder is honored.
        The prisoner is offered freedom and asks for one more night in his cell.|His reason for staying is never given.|He is a prisoner.|He is offered freedom.
        The poem calls the city "a beautiful cage."|The image holds both attraction and imprisonment.|The poem is about a city.|The city is beautiful.
        The best friends promise to meet in ten years. On the day, one of them watches from across the street and does not cross.|Why he does not cross is left unexplained.|They make a promise.|They meet in ten years.
        The scientist burns her notes the night before the conference.|The reason she destroys her work is not given.|She is a scientist.|She goes to a conference.
        The mayor's speech praises "our city's long tradition of keeping things as they are."|The praise could be sincere or ironic.|The mayor gives a speech.|The city is old.
        The song's last verse repeats the first, but sung slowly and in a minor key.|The repeated words may now feel sad rather than happy.|The song has verses.|The last verse is slow.
        The heroine's final words are, "I have done what I had to do."|We are not told whether she feels pride or regret.|She speaks at the end.|She has done something.
      `,
      (right) => [
        `"${right}" names the exact detail that leaves room for more than one reading.`,
        `“${right}” 指出了为多种解读留下空间的具体细节。`,
      ],
      [
        [
          '"{wrong}" is true of the passage, but it is a plain fact that does not open any question.',
          "“{wrong}”符合文段内容，但它只是一个平常的事实，并不会引出任何疑问。",
        ],
        [
          '"{wrong}" is a surface detail of the setting or form, not the source of the ambiguity.',
          "“{wrong}”只是背景或形式上的表面细节，并不是含混的来源。",
        ],
      ],
    ),
  ],
});

/** readingTopics10a are the reading topics of grade 10 on literature. */
export const readingTopics10a: readonly TopicDef[] = [motives, toneShifts, extended, ambiguity];
