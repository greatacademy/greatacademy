// Grade 7: writing skills checked by rule, part two: explaining with an analogy, pacing with sentence length, a call to
// action, the conclusion of a lab report and a headline with its lead.

import type { TopicDef } from "@ga/content";
import { choose, type Label, label, topic } from "../grade-6/kit.ts";

/** L builds a label from its Chinese name, why it is right and why it is not. */
const L = (zh: string, whyEn: string, whyZh: string, notEn: string, notZh: string): Label => ({
  zh,
  why: [whyEn, whyZh],
  not: [notEn, notZh],
});

const analogy = topic("writing", {
  id: "explaining-with-an-analogy",
  title: ["Explaining with an Analogy", "用类比来解释"],
  summary: [
    "An analogy explains something new by comparing it with something familiar that works the same way, and a good one matches the feature that matters.",
    "类比用一个运作方式相同的熟悉事物来解释新事物；好的类比要与关键特征相吻合。",
  ],
  after: ["comparisons-that-explain"],
  points: [
    choose(
      "the-analogy-that-fits",
      ["The Analogy That Fits", "合适的类比"],
      [
        "An **analogy** helps a reader understand something unfamiliar by comparing it to something they already know. A good analogy matches the **key feature** you want to explain: the heart *pushes* blood, so it is like a pump. A weak analogy compares things that look alike but do not work alike, and a plain fact, however true, is not an analogy at all.",
        "**类比**把陌生的事物与读者已经熟悉的事物相比较，帮助读者理解。好的类比与你要解释的**关键特征**相吻合：心脏*推动*血液，所以它像一个水泵。弱的类比比较的是外表相似而运作方式不同的东西；而一个单纯的事实，无论多么正确，都不是类比。",
      ],
      ["Which sentence explains the idea with an analogy that fits?", "哪个句子用了合适的类比来解释这个概念？"],
      `
        How the heart moves blood|The heart works like a pump that pushes water through pipes.|The heart is shaped a little like a fist.|The heart has four chambers, two on the top and two on the bottom, with walls of muscle.
        How a cell membrane controls what enters|A cell membrane is like a security guard who decides who may enter a building.|A cell membrane is thin, like a sheet of paper.|A cell membrane is made of fats and proteins arranged in a thin double layer around the whole cell.
        How the brain sends messages through the body|Nerves carry messages like wires carry electricity to every room of a house.|The brain is wrinkled like a walnut.|The brain weighs about 1.4 kilograms and uses about a fifth of the body's energy every day.
        How a vaccine prepares the body|A vaccine is like a wanted poster that teaches guards what a thief looks like.|A vaccine is given with a needle, like a pin.|Vaccines were first developed in the 1790s, when Edward Jenner tested one against smallpox in England.
        How white blood cells protect the body|White blood cells act like soldiers who attack invaders.|White blood cells are pale, like milk.|There are several kinds of white blood cells, and each kind has a different name and job.
        How the stomach breaks down food|The stomach churns food like a washing machine mixing clothes and soap.|The stomach is a pouch, like a small bag.|The stomach is on the left side of the body.
        How the lungs take in air|The lungs fill and empty like balloons.|The lungs are pink, like a rose.|Adults breathe about 15 times a minute.
        How DNA carries instructions|DNA is like a recipe book that tells the cell how to build each part.|DNA is twisted like a ladder in a spiral.|The shape of DNA was described by scientists in 1953 after years of careful work with X-rays.
        How the kidneys clean the blood|The kidneys work like filters that catch dirt from water.|The kidneys are shaped like beans.|Most people have two kidneys, one on each side of the spine, just below the ribs.
        How the skin protects the body|The skin is like a raincoat that keeps out water and germs.|The skin comes in many shades, like paint.|The skin is the body's largest organ, covering about two square meters in an adult.
        How the eye focuses light|The lens of the eye works like the lens of a camera.|The eye is round like a marble.|The eye can tell apart millions of colors, from the palest pink to the deepest blue.
        How a nucleus controls a cell|The nucleus is like the principal's office that makes the decisions for a school.|The nucleus is round, like a ball.|The nucleus is found in most cells.
        How a virus takes over a cell|A virus is like a burglar who breaks in and uses your kitchen to cook his own meals.|A virus is tiny, like a speck of dust.|Viruses cannot be seen with an ordinary microscope, so scientists use electron microscopes to study them.
        How the immune system remembers germs|The immune system keeps a memory like a photo album of every germ it has met.|The immune system is spread through the body, like a web.|The immune system includes the spleen and lymph nodes.
        How blood vessels carry blood|Blood vessels are like roads that carry traffic to every town.|Blood vessels are red, like ribbons.|Some blood vessels are very small, so small that red blood cells must pass through them one at a time.
        How the spine protects nerves|The spine is like a tunnel of stacked rings that shields the cable inside.|The spine is long, like a stick.|The spine has 33 bones at birth.
        How enzymes speed up reactions|An enzyme is like a key that unlocks a door quickly.|An enzyme is invisible, like air.|Enzymes are a kind of protein, and the body makes thousands of different ones.
        How the liver stores energy|The liver stores sugar like a pantry stores food for later.|The liver is dark red, like a cherry.|The liver weighs about 1.5 kilograms.
        How muscles move bones|Muscles pull on bones the way ropes pull a puppet's arms.|Muscles are soft, like clay.|The body has more than 600 muscles, from tiny ones in the ear to large ones in the legs.
        How a cell gets energy from food|Mitochondria are like power plants that turn fuel into electricity.|Mitochondria are shaped like beans.|Mitochondria have their own DNA.
        How the ear hears sound|The eardrum vibrates like the skin of a drum when it is struck.|The ear is curved, like a seashell.|The ear also helps with balance, using tiny tubes of fluid deep inside the head.
        How a fever fights infection|A fever is like turning up the heat in an oven to kill germs that cannot stand it.|A fever makes the face red, like a tomato.|A normal temperature is about 37°C.
        How bones heal|A broken bone heals like a road crew patching a crack with new concrete.|Bones are white, like chalk.|Adults have 206 bones, but babies are born with nearly 300 that later join together.
        How the nose detects smells|The nose works like a detector that sounds an alarm when it senses certain chemicals.|The nose sticks out, like a small hill.|People can tell apart thousands of smells.
        How red blood cells carry oxygen|Red blood cells are like delivery trucks carrying oxygen to every part of the body.|Red blood cells are round, like coins.|Red blood cells live about 120 days before the body breaks them down and makes new ones.
        How a seed stores food|A seed is like a packed lunch that feeds the young plant until it can make its own food.|A seed is small, like a bead.|Some seeds can wait years before they grow.
        How roots take in water|Roots soak up water like a sponge.|Roots are long, like strings.|Some roots grow deep underground, reaching water many meters below the surface.
        How leaves make food|A leaf is like a kitchen that uses sunlight to cook sugar from air and water.|A leaf is flat, like a sheet of paper.|Leaves are green because of chlorophyll.
        How the heart's valves work|Heart valves are like one-way doors that let blood go forward but not back.|Heart valves are thin, like flaps of cloth.|The heart has four valves, and each one opens and closes about once every second.
        How hormones carry signals|Hormones are like letters sent through the mail to tell distant organs what to do.|Hormones are tiny, like grains of sand.|Hormones are made in glands such as the thyroid in the neck and the adrenal glands above the kidneys.
      `,
      (right, shown) => [
        `**${right}** compares the part with something familiar that works the same way, which explains ${shown.toLowerCase()}.`,
        `**${right}** 把这个部分与一个运作方式相同的熟悉事物相比，解释了它的作用。`,
      ],
      [
        [
          "*{wrong}* compares how it looks, not how it works, so it does not explain the idea.",
          "*{wrong}* 比较的是外表，而不是运作方式，所以没有解释这个概念。",
        ],
        [
          "*{wrong}* is a fact, not an analogy: it compares the thing with nothing familiar.",
          "*{wrong}* 是一个事实，不是类比：它没有把这件东西与任何熟悉的事物相比。",
        ],
      ],
    ),
    label(
      "where-the-analogy-stands",
      ["Judging an Analogy", "评价一个类比"],
      [
        "Test an analogy before you use it. A **helpful analogy** matches how the thing works. A **misleading analogy** matches something that does not matter, or suggests something false: saying the heart is *like a brain* would make readers think it thinks. And a sentence that only states a fact, with no comparison, is **not an analogy**.",
        "使用类比之前要检验它。**有帮助的类比**与事物的运作方式相吻合。**误导性的类比**吻合的是无关紧要的特征，或暗示了错误的东西：说心脏*像大脑*会让读者以为它会思考。而只陈述事实、不作任何比较的句子，**不是类比**。",
      ],
      ["How well does this sentence explain the idea?", "这个句子对概念的解释怎么样？"],
      `
        Explaining the heart: The heart is like a pump.|a helpful analogy
        Explaining the heart: The heart is like a brain that decides where blood goes.|a misleading analogy
        Explaining the heart: The heart beats about 100,000 times a day.|not an analogy
        Explaining the lungs: The lungs are like bellows that blow air in and out.|a helpful analogy
        Explaining the lungs: The lungs are like a stomach that digests air.|a misleading analogy
        Explaining the lungs: The lungs sit inside the rib cage.|not an analogy
        Explaining a cell wall: A cell wall is like the brick wall around a garden.|a helpful analogy
        Explaining a cell wall: A cell wall is like a door that is always open.|a misleading analogy
        Explaining a cell wall: Plant cells have cell walls, but animal cells do not.|not an analogy
        Explaining nerves: Nerves are like telephone lines that carry messages.|a helpful analogy
        Explaining nerves: Nerves are like pipes that carry blood.|a misleading analogy
        Explaining nerves: Some nerves are more than a meter long.|not an analogy
        Explaining antibodies: Antibodies are like locks made to fit one key, a single germ.|a helpful analogy
        Explaining antibodies: Antibodies are like food that germs eat.|a misleading analogy
        Explaining antibodies: Antibodies are made by white blood cells.|not an analogy
        Explaining the skeleton: The skeleton is like the frame of a house.|a helpful analogy
        Explaining the skeleton: The skeleton is like a jelly that changes shape.|a misleading analogy
        Explaining the skeleton: The smallest bone is in the ear.|not an analogy
        Explaining the small intestine: The small intestine is like a long sponge that soaks up food.|a helpful analogy
        Explaining the small intestine: The small intestine is like a fan that cools the body.|a misleading analogy
        Explaining the small intestine: The small intestine is about six meters long.|not an analogy
        Explaining chlorophyll: Chlorophyll is like a solar panel that catches sunlight.|a helpful analogy
        Explaining chlorophyll: Chlorophyll is like paint that only makes leaves pretty.|a misleading analogy
        Explaining chlorophyll: Chlorophyll is green.|not an analogy
        Explaining the brain: The brain is like the control room of a ship.|a helpful analogy
        Explaining the brain: The brain is like a muscle that lifts weights.|a misleading analogy
        Explaining the brain: The brain uses a fifth of the body's energy.|not an analogy
        Explaining a germ spreading: A germ spreads like a rumor passing from person to person.|a helpful analogy
        Explaining a germ spreading: A germ spreads like a stone that stays where it falls.|a misleading analogy
        Explaining a germ spreading: Some germs spread through coughs and sneezes.|not an analogy
      `,
      {
        "a helpful analogy": L(
          "有帮助的类比",
          "The comparison matches how the thing really works, so it helps the reader understand.",
          "这个比较与事物真正的运作方式相吻合，所以能帮助读者理解。",
          "This comparison does not match how the thing works.",
          "这个比较与事物的运作方式不吻合。",
        ),
        "a misleading analogy": L(
          "误导性的类比",
          "The comparison suggests something false about how the thing works, so it would confuse the reader.",
          "这个比较暗示了关于事物运作方式的错误信息，会让读者困惑。",
          "This sentence does not suggest anything false.",
          "这个句子并没有暗示任何错误的信息。",
        ),
        "not an analogy": L(
          "不是类比",
          "The sentence states a fact but compares the thing with nothing familiar.",
          "这个句子陈述了一个事实，但没有把这件东西与任何熟悉的事物相比。",
          "This sentence does compare the thing with something familiar.",
          "这个句子确实把这件东西与熟悉的事物作了比较。",
        ),
      },
    ),
  ],
});

const pacing = topic("writing", {
  id: "pacing-with-sentence-length",
  title: ["Pacing with Sentence Length", "用句子长短控制节奏"],
  summary: [
    "Short sentences speed up a moment of action, long sentences slow a moment down for detail and feeling, and a summary sentence skips over time that does not matter.",
    "短句加快动作的节奏，长句放慢某个时刻以展现细节和感受，概括句则跳过无关紧要的时间。",
  ],
  after: ["pacing-a-story"],
  points: [
    label(
      "what-the-sentences-do",
      ["What the Sentences Do", "这些句子起什么作用"],
      [
        "The length of your sentences controls how fast a reader moves. **Short, sharp sentences speed up the action**: *The rope snapped. She fell. Darkness.* **Long sentences with details slow down the moment**, letting readers feel every second. And a **summary** jumps over time quickly: *Three weeks passed before anyone spoke of the storm again.*",
        "句子的长短决定读者前进的速度。**短促有力的句子加快动作的节奏**：*The rope snapped. She fell. Darkness.* **带细节的长句放慢这一刻**，让读者感受每一秒。而**概括**能快速跳过一段时间：*Three weeks passed before anyone spoke of the storm again.*",
      ],
      ["What does this passage do to the pace of the story?", "这段文字对故事的节奏有什么作用？"],
      `
        The rope snapped. She fell. Then nothing.|speeds up the action
        As the door creaked open, she noticed the dust drifting in the light, the smell of old paper and the faint ticking of a clock somewhere in the dark.|slows down the moment
        Three weeks passed before anyone spoke of the storm again.|summarizes time passing
        A shout. A crash. Glass everywhere.|speeds up the action
        He held the letter for a long time, reading each line slowly, his thumb tracing the familiar curve of his mother's handwriting as the rain tapped against the window.|slows down the moment
        The rest of the summer went by in a blur of swimming and chores.|summarizes time passing
        The dog lunged. Mia ran. The gate slammed.|speeds up the action
        She stood at the edge of the stage, hearing the rustle of a thousand programs, feeling her heart thud against her ribs and tasting the dry fear in her mouth.|slows down the moment
        Years later, the town had forgotten the fire entirely.|summarizes time passing
        The engine coughed. Died. Silence.|speeds up the action
        The ball rose into the bright sky, turning slowly, as every face in the stadium tilted up to follow it and the whole crowd seemed to hold its breath.|slows down the moment
        By winter, the family had moved twice.|summarizes time passing
        Lightning. Thunder. The lights went out.|speeds up the action
        He reached for the handle, his fingers trembling, and for a moment he could hear nothing but his own breathing and the soft hum of the machine behind the door.|slows down the moment
        After a long month of practice, the team was ready.|summarizes time passing
        The ice cracked. Leo froze. Then he jumped.|speeds up the action
        She opened the box carefully, lifting each layer of tissue paper, until at last she saw the small silver locket her grandmother had worn every day of her life.|slows down the moment
        The next few days were quiet.|summarizes time passing
        Footsteps. Closer. Closer.|speeds up the action
        The old man looked out over the valley where he had grown up, at the river glinting in the evening light and the crooked fence his father had built, and he smiled.|slows down the moment
        Two years went by, and the garden grew wild.|summarizes time passing
        The horn blared. Tires screamed. Then a thud.|speeds up the action
        As the plane lifted off, she pressed her forehead to the cold window and watched the houses, the roads and finally the whole city shrink into a tiny map below.|slows down the moment
        By the end of the term, they were best friends.|summarizes time passing
        He ducked. The arrow missed. He ran.|speeds up the action
        The baby curled her tiny fingers around his thumb, and he sat very still in the quiet room, listening to her soft breathing and afraid to move.|slows down the moment
        The journey took six long days, and nothing much happened.|summarizes time passing
        A bang. Smoke. Screams.|speeds up the action
        She walked slowly through the empty house, touching the faded wallpaper, the scratched banister and the doorframe where her height had been marked every birthday.|slows down the moment
        Over the next year, the little shop slowly found its customers.|summarizes time passing
      `,
      {
        "speeds up the action": L(
          "加快动作",
          "Short, sharp sentences push the reader quickly through a moment of action.",
          "短促有力的句子推动读者快速经历一个动作场面。",
          "These sentences are not short and sharp.",
          "这些句子并不短促有力。",
        ),
        "slows down the moment": L(
          "放慢这一刻",
          "A long sentence full of details stretches a single moment so the reader feels it.",
          "充满细节的长句延长了一个瞬间，让读者感受它。",
          "This passage does not stretch one moment with details.",
          "这段文字并没有用细节延长某个瞬间。",
        ),
        "summarizes time passing": L(
          "概括时间流逝",
          "The sentence jumps quickly over days, months or years in which little matters.",
          "这个句子快速跳过无关紧要的几天、几个月或几年。",
          "This passage does not skip over a stretch of time.",
          "这段文字并没有跳过一段时间。",
        ),
      },
    ),
    choose(
      "the-version-that-fits-the-moment",
      ["The Version That Fits the Moment", "适合这一刻的写法"],
      [
        "Match the pace to the moment. A sudden, dangerous event reads best in **short sentences**. A moment full of emotion or wonder reads best in a **long, detailed sentence**. A stretch of time where little happens should be **summarized** in one sentence so the story can move on.",
        "节奏要与这一刻相配。突然而危险的事件最适合用**短句**。充满感情或惊奇的时刻最适合用**带细节的长句**。没什么事发生的一段时间应该用一句话**概括**，好让故事继续往前。",
      ],
      ["Which version best fits this moment of the story?", "哪种写法最适合故事中的这一刻？"],
      `
        The moment a bridge suddenly collapses|The bridge groaned. Then it broke. We fell.|The bridge, which had stood for a hundred years over the slow brown river, began to groan and shift beneath us as we looked at the water.|Over the next hour, the bridge slowly fell apart.
        A girl seeing the ocean for the first time|She stood on the sand for a long time, watching the waves roll in, smelling the salt and feeling the cool foam curl around her bare toes.|Waves. Sand. Salt.|She went to the beach once that year.
        The months a family spends waiting for news|For months, the family waited, and no letter came.|They waited. And waited. And waited.|Every morning she sat by the window, watching the road, listening for the mailman's footsteps, hoping for a letter.
        A thief grabbing a purse and running|He grabbed the purse. He ran. Gone.|He reached out his hand, slowly closing his fingers around the soft leather strap of the purse, as the woman looked the other way.|Later that week, a purse was stolen.
        A boy holding his newborn sister for the first time|He held her carefully, amazed at her tiny nails, her soft hair and the way her whole hand could wrap around one of his fingers.|Baby. Small. Crying.|A few months later, his sister could already sit up.
        A car skidding on ice|The car spun. Glass shattered. Then silence.|The car, which was red and quite new, slowly began to slide across the icy road under the gray winter sky.|The drive home took an hour.
        The winter the farm was snowed in|All that winter, the snow kept them on the farm.|Snow. Cold. Snow again.|She watched each snowflake drift past the window, turning and glittering in the lamplight before it settled on the deep white drifts outside.
        A runner crossing the finish line to win|She lunged. The tape broke. She'd won.|As she came toward the line, she thought about all the mornings of practice, the cold, the sore legs and the coach who had believed in her.|The race season ended in June.
        An old woman returning to her childhood home|She walked slowly through the rooms, touching the worn banister, the cracked tiles and the window where she had once watched for her father.|Home. Old. Quiet.|She visited the house once more before it was sold.
        A wolf leaping at the sheep|The wolf sprang. The sheep scattered. Dust flew.|The wolf, gray and thin after the long winter, crept slowly through the tall grass toward the flock grazing on the hill.|That year, the wolves took three sheep.
        The years a young man spends at sea|For six years, he sailed from port to port.|Sea. Sky. Sea.|He stood on deck every night, watching the dark water slide past and the stars wheel slowly over the mast.
        An explosion in the lab|A flash. A bang. Then smoke.|The scientist carefully poured the blue liquid into the glass beaker, watching it swirl and bubble as she leaned in close to look.|The lab was closed for a week after that.
        A child watching her first snowfall|She pressed her face to the cold glass, watching the flakes drift down slowly, each one glittering for a moment in the streetlight.|Snow. White. Cold.|That winter, it snowed often.
        A soldier ducking enemy fire|A shot. He dropped. Mud in his mouth.|The soldier, who had grown up on a quiet farm far away, thought of his mother's kitchen as he crouched in the trench.|The war lasted four more years.
        The summer a girl spends learning to swim|Over the summer, she learned to swim.|Swim. Sink. Swim.|She floated on her back for the first time, feeling the water hold her up and looking at the clouds drifting slowly overhead.
        A goalkeeper diving to save a penalty|He dove. His fingers touched it. Saved!|The goalkeeper, who had played for the team for many years and was well liked by everyone, bent his knees and looked at the ball.|The team won the league that season.
        Grandfather telling a story by the fire|He leaned back in his chair, his voice low and slow, the firelight flickering across his face as he began the story he had told them a hundred times.|Fire. Story. Grandpa.|He told many stories that winter.
        A horse bolting in a storm|Thunder cracked. The horse reared. It bolted.|The horse, a gentle brown mare with a white star on her forehead, stood quietly in the paddock under the darkening sky.|The storm lasted all night.
        The weeks of building a treehouse|It took three weeks to build the treehouse.|Hammer. Nail. Hammer.|He held the first plank against the branch, feeling the rough wood under his hands and smelling the fresh sawdust drifting in the breeze.
        Opening a letter that announces a prize|She slowly unfolded the letter, her hands shaking, reading the first line again and again until the words finally made sense: she had won.|Letter. Prize. Yes!|She won several prizes that year.
        A climber slipping on a cliff|His foot slipped. The rope jerked. He hung there.|The climber, wearing a blue jacket and a red helmet, slowly placed his hand on a crack in the warm gray rock.|The climbing trip lasted two weeks.
        A mother hugging her son after a long war|She held him for a long time, feeling how thin he had become, smelling the smoke in his coat and crying without a sound.|Hug. Tears. Home.|He came home after the war.
        The many months of a long voyage across the desert|The caravan crossed the desert over many months.|Sand. Sun. Thirst.|She watched the camel in front of her sway slowly, its shadow stretching long and thin across the endless orange dunes.
        A cat pouncing on a mouse|The cat crouched. Sprang. Caught it.|The cat, a fat orange tabby named Biscuit who loved to sleep in the sun, opened one eye and looked at the corner of the kitchen.|The cat caught several mice that month.
        A girl standing on stage before her first solo|She stood in the bright light, hearing the hush of the audience, feeling the cool floor under her feet and the violin trembling in her hands.|Stage. Light. Fear.|She played many concerts after that.
        A fire alarm going off in the night|The alarm shrieked. We ran. Smoke everywhere.|The alarm, which had been installed in the hallway two years earlier by a man named Mr. Grant, began to make a sound.|The house was repaired over the summer.
        The decade a tree takes to grow tall|Over ten years, the little tree grew tall.|Grow. Grow. Grow.|He touched the bark of the young tree, rough and warm in the sun, and watched a single leaf tremble in the breeze.
        A pickpocket caught in the act|A hand grabbed his wrist. He froze. Caught.|The pickpocket, a young man in a gray coat who had come to the city from a village in the hills, moved slowly through the crowd.|He was caught a month later.
        The moment a long-lost dog returns home|The dog limped up the path, thin and muddy, and when she knelt down it pressed its head against her chest and whined softly, as if it had never left.|Dog. Home. Joy.|The dog came home in the spring.
        The years a town spends rebuilding after a flood|It took the town five years to rebuild after the flood.|Build. Build. Build.|She lifted a brick from the muddy pile, feeling its cold weight, and set it carefully on the new wall of the school.
      `,
      (right, shown) => [`**${right}** The pace fits ${shown.toLowerCase()}.`, `**${right}** 这种节奏适合故事中的这一刻。`],
      [
        ["*{wrong}* uses the wrong pace for this moment.", "*{wrong}* 用了不适合这一刻的节奏。"],
        ["*{wrong}* rushes past or drags out a moment that needs a different pace.", "*{wrong}* 匆匆跳过或拖长了需要另一种节奏的时刻。"],
      ],
    ),
  ],
});

const callToAction = topic("writing", {
  id: "writing-a-call-to-action",
  title: ["Writing a Call to Action", "写号召行动的结尾"],
  summary: [
    "A call to action ends a persuasive piece by telling readers exactly what to do, when and where, in a way they can actually manage.",
    "号召行动的结尾告诉读者具体要做什么、什么时候做、在哪里做，而且是他们真正做得到的事，以此结束一篇说服性文章。",
  ],
  after: ["how-a-speaker-builds-an-argument", "choosing-relevant-reasons"],
  points: [
    choose(
      "the-strongest-call-to-action",
      ["The Strongest Call to Action", "最有力的号召"],
      [
        "A **call to action** is the last push of a persuasive piece. It tells readers **exactly what to do**, often with **when** and **where**: *Put every empty bottle in the blue bin by the cafeteria door, starting Monday.* A sentence that only says the issue is important, or that someone should do something, gives readers nothing to act on.",
        "**号召行动**是说服性文章的最后一推。它明确告诉读者**该做什么**，常常还说明**何时**、**何地**：*Put every empty bottle in the blue bin by the cafeteria door, starting Monday.* 只说问题很重要，或者说应该有人做点什么的句子，不能让读者付诸行动。",
      ],
      ["Which sentence is the strongest call to action for this goal?", "哪个句子是实现这个目标最有力的号召？"],
      `
        Goal: get students to recycle bottles|Put every empty bottle in the blue bin by the cafeteria door, starting Monday.|Recycling is very important for our planet.|Someone should probably do something about all these bottles that keep piling up around the school.
        Goal: get neighbors to clean up the park|Meet us at the park gate on Saturday at nine, and bring gloves.|Our park is a beautiful place that deserves care and attention from everyone who lives near it.|It would be nice if the park were cleaner one day.
        Goal: get readers to vote for a new library|Vote yes on the library plan this Tuesday at the town hall.|Libraries have been important for hundreds of years, and our town has always loved its books.|Maybe people could think about libraries sometime.
        Goal: get classmates to donate food|Bring one can of food to Room 12 before Friday.|Hunger is a serious problem in many places, including towns not so different from ours.|Food drives are a thing that some schools do.
        Goal: get families to save water|Turn off the tap while you brush your teeth, starting tonight.|Water is precious and should never be wasted.|People in general could use less water, since there is only so much of it to go around.
        Goal: get students to join the school choir|Come to the music room after school on Wednesday to sign up.|Singing is a joyful activity enjoyed by many.|Choirs are good, as most people would agree.
        Goal: get the city to fix a dangerous crossing|Email the mayor at the address below and ask for a traffic light by May.|Safety on our roads matters to all of us.|Someone in charge might want to look at the crossing one of these days, before something bad happens.
        Goal: get readers to adopt shelter pets|Visit the Green Street shelter this weekend and meet a dog who needs a home.|Shelter animals have feelings, just like us.|Pets are wonderful companions for many families.
        Goal: get students to read more|Choose one book from the library display this week and read ten pages a night.|Reading opens the door to a world of ideas.|Some people believe that reading is a good habit, and it is certainly something worth thinking about.
        Goal: get people to walk to school|Walk or bike to school next Monday for Car-Free Day.|Cars cause a lot of pollution in cities.|It might be better for everyone if fewer people drove their cars around town.
        Goal: get readers to give blood|Sign up at the front desk to give blood at Friday's drive.|Blood saves lives every single day.|Hospitals often need blood for their patients, especially after accidents and during surgery.
        Goal: get students to stop littering|Throw your lunch wrappers in the bins at the end of every table.|Litter makes our school look terrible.|Littering is something that happens a lot.
        Goal: get parents to come to the science fair|Mark Thursday at six on your calendar and come see our projects in the gym.|Science fairs show how hard students work and how much they have learned during the whole year.|Parents sometimes enjoy school events.
        Goal: get readers to plant trees|Pick up a free seedling at the garden center this Saturday and plant it in your yard.|Trees clean our air, give us shade on hot days and provide homes for birds, insects and squirrels.|The world could always use more trees.
        Goal: get students to turn off lights|Switch off the lights every time you leave a classroom.|Energy is expensive and often wasted.|Lights are left on in many buildings.
        Goal: get readers to support a local farm|Buy your vegetables at the farmers' market on Main Street this Sunday.|Local farms are the heart of our community, and they have fed our families for generations.|Farms have been around for a long time.
        Goal: get students to try out for the debate team|Fill out the form on the office door by Thursday to try out.|Debate helps people think clearly.|Debate is an activity at many schools.
        Goal: get neighbors to slow down on their street|Drive no faster than 25 kilometers an hour on Oak Street, where children play.|Speeding is dangerous.|Cars sometimes go much too fast on our street, even though many young children live and play here.
        Goal: get people to write to their representative|Write a short letter to Senator Ruiz tonight, using the address on this flyer.|Leaders should listen to the people.|Letters are one way to share opinions.
        Goal: get classmates to bring reusable bottles|Bring a reusable water bottle to school starting next week.|Plastic is filling our oceans, and much of it comes from bottles that are used only once.|Plastic bottles are used by many students.
        Goal: get readers to volunteer at a hospital|Call the volunteer office at the number below to choose a Saturday shift.|Helping others is a noble thing to do.|Hospitals are busy places.
        Goal: get students to support a bake sale|Buy a cookie at the table by the gym at lunch on Friday; every dollar goes to the trip.|Field trips are a valuable part of learning, and every student deserves the chance to go on one.|Bake sales raise money sometimes.
        Goal: get families to prepare for storms|Pack a kit with water, a flashlight and batteries this weekend.|Storms can be very dangerous.|Storms happen in many parts of the world.
        Goal: get students to be kind to new classmates|Invite a new student to sit with you at lunch this week.|Kindness makes the world a better place.|New students can feel lonely at times.
        Goal: get readers to recycle old phones|Drop your old phone in the box at the library entrance before the end of the month.|Old phones contain valuable metals such as gold and copper that could be used again in new devices.|Many people have old phones in drawers.
        Goal: get people to visit the museum|Visit the museum's new dinosaur hall this month; entry is free on Sundays.|Museums preserve our history.|Some museums have dinosaur bones.
        Goal: get students to sign a petition for longer lunch|Sign the petition at the student council table by Friday.|Students deserve enough time to eat.|Lunch is short at some schools.
        Goal: get readers to protect bees|Plant one pot of flowers on your balcony this spring to feed the bees.|Bees are vital to our food supply, because they carry pollen from flower to flower on farms everywhere.|There are fewer bees than before.
        Goal: get neighbors to join a book club|Come to the first meeting on Tuesday at seven in the library's back room.|Books bring people together.|Book clubs exist in many towns.
        Goal: get students to use the stairs|Take the stairs instead of the elevator every day this month.|Exercise is good for your health.|The elevator is crowded in the mornings.
      `,
      (right) => [
        `**${right}** It tells readers exactly what to do, and when or where, so they can act at once.`,
        `**${right}** 它明确告诉读者要做什么，以及何时或何地做，让他们能立即行动。`,
      ],
      [
        [
          "*{wrong}* only says the issue matters; it does not tell readers what to do.",
          "*{wrong}* 只说明这个问题很重要，并没有告诉读者该做什么。",
        ],
        ["*{wrong}* is vague and weak: it names no action for the reader.", "*{wrong}* 含糊无力：它没有为读者提出任何行动。"],
      ],
    ),
    label(
      "what-the-call-lacks",
      ["What the Call Lacks", "这个号召缺少什么"],
      [
        "Check a call to action for three problems. It may be **clear and specific**, telling readers what to do and when or where. It may be **too vague**: *Help the environment* or *Do your part* names no particular action. Or it may ask for **too much**, an action few readers could really take, such as *Never use plastic again* or *Give all your savings*.",
        "检查号召行动时要看三点。它可能**清楚具体**，告诉读者做什么以及何时或何地做。它可能**太含糊**：*Help the environment* 或 *Do your part* 没有提出具体行动。或者它可能**要求过高**，提出很少有读者真正做得到的行动，比如 *Never use plastic again* 或 *Give all your savings*。",
      ],
      ["How good is this call to action?", "这个号召怎么样？"],
      `
        Bring one can of soup to the office by Friday.|clear and specific
        Help the hungry.|too vague
        Give all your money to the food bank.|asks for too much
        Turn off your computer screen when you leave class.|clear and specific
        Do your part for the planet.|too vague
        Never use electricity again.|asks for too much
        Sign up at the library desk to read to a younger child on Tuesdays.|clear and specific
        Make reading a priority.|too vague
        Read a hundred books before the end of the month.|asks for too much
        Walk to school this Friday for Car-Free Day.|clear and specific
        Think about how you travel.|too vague
        Sell your family's car this week.|asks for too much
        Plant one tree in your yard this spring.|clear and specific
        Be greener.|too vague
        Plant a forest by next summer.|asks for too much
        Write one letter to the mayor about the crossing this week.|clear and specific
        Speak up about safety.|too vague
        Quit school to campaign for a traffic light.|asks for too much
        Put your lunch wrappers in the bins at the end of each table.|clear and specific
        Care about litter.|too vague
        Clean the entire city by yourself on Saturday.|asks for too much
        Bring a reusable bottle to school from Monday.|clear and specific
        Stop being wasteful.|too vague
        Never buy anything in plastic for the rest of your life.|asks for too much
        Visit the shelter on Saturday and walk a dog for an hour.|clear and specific
        Love animals more.|too vague
        Adopt ten dogs from the shelter this week.|asks for too much
        Give one hour on Saturday to help paint the community center.|clear and specific
        Get involved.|too vague
        Spend every weekend this year painting the community center.|asks for too much
      `,
      {
        "clear and specific": L(
          "清楚具体",
          "It names one action that readers can really take, often with when or where.",
          "它提出了读者真正做得到的一个行动，常常还说明何时或何地。",
          "This call does not name a specific action that readers can manage.",
          "这个号召没有提出读者做得到的具体行动。",
        ),
        "too vague": L(
          "太含糊",
          "It sounds good but names no particular action, so readers do not know what to do.",
          "它听起来不错，却没有提出具体行动，读者不知道该做什么。",
          "This call does name a particular action.",
          "这个号召确实提出了一个具体行动。",
        ),
        "asks for too much": L(
          "要求过高",
          "It asks for an action so large that few readers could really take it.",
          "它要求的行动太大，很少有读者真正做得到。",
          "This call does not ask for an impossibly large action.",
          "这个号召并没有提出大得做不到的要求。",
        ),
      },
    ),
  ],
});

const labConclusion = topic("writing", {
  id: "writing-a-lab-conclusion",
  title: ["Writing a Lab Conclusion", "写实验结论"],
  summary: [
    "A lab conclusion answers the question of the experiment, states the result with data, explains why it happened and suggests a next step, claiming no more than the data show.",
    "实验结论回答实验的问题，用数据说明结果，解释其原因，并提出下一步，所作的结论不超出数据所能证明的范围。",
  ],
  after: ["distinguishing-observation-and-inference"],
  points: [
    label(
      "the-part-of-the-conclusion",
      ["The Part of the Conclusion", "结论的组成部分"],
      [
        "A strong lab conclusion has four parts. It **answers the question** the experiment asked. It **gives the data** that support the answer. It **explains why** the result happened, using science ideas. And it **suggests a next step**, such as a new test or a way to improve the experiment.",
        "一个有力的实验结论有四个部分。它**回答实验提出的问题**。它**给出支持这个答案的数据**。它用科学原理**解释结果出现的原因**。它还**提出下一步**，比如新的检验或改进实验的方法。",
      ],
      ["Which part of a lab conclusion is this sentence?", "这个句子是实验结论的哪个部分？"],
      `
        Paper planes with longer wings flew farther than planes with shorter wings.|answers the question
        The long-wing planes flew an average of 8.2 meters, while the short-wing planes flew 5.1 meters.|gives the data
        Longer wings have more surface to push against the air, which creates more lift.|explains why
        Next, we could test whether the shape of the wing tips also matters.|suggests a next step
        Salt water froze more slowly than fresh water.|answers the question
        The fresh water froze in 40 minutes, but the salt water took 65 minutes.|gives the data
        Salt gets in the way of water molecules joining into ice crystals.|explains why
        A future test could try several amounts of salt.|suggests a next step
        Plants given more light grew taller.|answers the question
        The plants in full light grew 12 cm, and those in shade grew 4 cm.|gives the data
        Plants use light to make the food they need for growth.|explains why
        Next time, we should grow more plants in each group to be sure.|suggests a next step
        Dark cloth heated up faster in the sun than light cloth.|answers the question
        After 20 minutes, the black cloth was 38°C and the white cloth was 29°C.|gives the data
        Dark colors absorb more sunlight, while light colors reflect it.|explains why
        We could repeat the test on a cloudy day to compare.|suggests a next step
        Heavier balls rolled down the ramp at the same speed as lighter balls.|answers the question
        Both balls took 2.3 seconds to reach the bottom.|gives the data
        Gravity speeds up all objects at the same rate when air resistance is small.|explains why
        Another test could use a much steeper ramp.|suggests a next step
        Seeds soaked overnight sprouted sooner than dry seeds.|answers the question
        The soaked seeds sprouted in 3 days and the dry seeds in 6 days.|gives the data
        Soaking softens the seed coat, so water reaches the seed faster.|explains why
        In a future experiment, we could test different soaking times.|suggests a next step
        Ice melted fastest on the metal tray.|answers the question
        The ice on metal melted in 9 minutes, on plastic in 21 and on wood in 25.|gives the data
        Metal carries heat from the room to the ice faster than plastic or wood.|explains why
        We could also test a glass tray next time.|suggests a next step
        Warm water dissolved sugar faster than cold water.|answers the question
        Sugar disappeared in 30 seconds in warm water and in 2 minutes in cold water.|gives the data
      `,
      {
        "answers the question": L(
          "回答问题",
          "The sentence states the main finding: the answer to the question the experiment asked.",
          "这个句子说出了主要发现，也就是实验所提问题的答案。",
          "This sentence does not state the main answer to the question.",
          "这个句子没有说出问题的主要答案。",
        ),
        "gives the data": L(
          "给出数据",
          "The sentence gives the measurements that support the answer.",
          "这个句子给出了支持答案的测量数据。",
          "This sentence gives no measurements.",
          "这个句子没有给出测量数据。",
        ),
        "explains why": L(
          "解释原因",
          "The sentence uses a science idea to explain why the result happened.",
          "这个句子用科学原理解释了结果出现的原因。",
          "This sentence does not explain why the result happened.",
          "这个句子没有解释结果出现的原因。",
        ),
        "suggests a next step": L(
          "提出下一步",
          "The sentence suggests a new test or an improvement for the future.",
          "这个句子提出了今后的新检验或改进方法。",
          "This sentence does not suggest anything for the future.",
          "这个句子没有为今后提出任何建议。",
        ),
      },
    ),
    choose(
      "a-conclusion-the-data-support",
      ["A Conclusion the Data Support", "数据支持的结论"],
      [
        "A conclusion must match the data. It should not **go beyond** them, claiming that a result true for paper planes is true for all aircraft, or that one test proves something forever. And it must not **contradict** them, claiming the opposite of what was measured. State what the data show, and only that.",
        "结论必须与数据一致。它不应**超出**数据，比如声称纸飞机的结果适用于所有飞行器，或者说一次检验就永远证明了某件事。它也不能**与数据矛盾**，声称与测量结果相反的东西。只说数据显示了什么。",
      ],
      ["Which conclusion do these data support?", "这些数据支持哪个结论？"],
      `
        Long-wing paper planes: 8 m; short-wing: 5 m.|In this test, long-wing paper planes flew farther.|Long wings make every aircraft in the world fly farther.|Short-wing paper planes flew farther in this test.
        Plants in light: 12 cm; in shade: 4 cm.|These plants grew taller in light than in shade.|All living things need light to grow.|These plants grew taller in shade than in light.
        Salt water froze in 65 min; fresh water in 40 min.|Salt water took longer to freeze in this test.|Salt water can never freeze.|Salt water froze faster in this test.
        Black cloth: 38°C; white cloth: 29°C after 20 minutes.|The black cloth got warmer than the white cloth.|Wearing black clothes is always dangerous in summer.|The white cloth got warmer than the black cloth.
        Soaked seeds sprouted in 3 days; dry seeds in 6 days.|The soaked seeds sprouted sooner in this test.|Soaking seeds makes every plant grow twice as big.|The dry seeds sprouted sooner in this test.
        Ice on metal melted in 9 min; on wood in 25 min.|Ice melted faster on the metal tray than on the wood.|Metal is the hottest material in the world.|Ice melted faster on the wood than on the metal.
        Warm water dissolved sugar in 30 s; cold water in 2 min.|Sugar dissolved faster in warm water in this test.|Warm water dissolves everything instantly.|Sugar dissolved faster in cold water in this test.
        Ball A and ball B both took 2.3 s to roll down.|The two balls took the same time to roll down the ramp.|Weight never matters in any kind of motion.|The heavier ball rolled down faster.
        Students who slept 9 hours scored 85; those who slept 6 hours scored 70.|In this study, students who slept more scored higher.|Sleep is the only thing that matters for test scores.|In this study, students who slept less scored higher.
        Bread in the fridge grew mold in 10 days; on the counter in 4 days.|Bread on the counter grew mold sooner in this test.|Fridges stop all mold forever.|Bread in the fridge grew mold sooner in this test.
        Magnet A picked up 20 clips; magnet B picked up 8.|Magnet A picked up more clips than magnet B.|Magnet A is the strongest magnet ever made.|Magnet B picked up more clips than magnet A.
        A kite with a long tail flew 30 s; with a short tail, 10 s.|The kite stayed up longer with the long tail.|Long tails make anything fly forever.|The kite stayed up longer with the short tail.
        Rubber band stretched 10 cm: car went 4 m; stretched 20 cm: car went 8 m.|The car went farther when the band was stretched more.|Stretching rubber bands is the best way to power every car.|The car went farther when the band was stretched less.
        Plants watered with salt water: 2 cm; with fresh water: 9 cm.|The plants given fresh water grew more.|Salt kills every living thing.|The plants given salt water grew more.
        Covered cup of water: 80 mL left; open cup: 50 mL left after a week.|More water evaporated from the open cup.|Covering water stops it from ever changing.|More water evaporated from the covered cup.
        Paper towel brand A held 40 mL; brand B held 25 mL.|Brand A held more water in this test.|Brand A is the best product in every way.|Brand B held more water in this test.
        Seeds in warm soil sprouted in 5 days; in cold soil in 12 days.|Seeds sprouted sooner in the warm soil.|Cold soil can never grow anything.|Seeds sprouted sooner in the cold soil.
        Insulated bottle: 60°C after 2 hours; plain bottle: 30°C.|The insulated bottle kept the water warmer.|Insulated bottles keep drinks hot forever.|The plain bottle kept the water warmer.
        Balloons in the sun grew 3 cm; in shade they grew 0 cm.|The balloons in the sun grew larger.|The sun makes every object grow.|The balloons in the shade grew larger.
        Pendulum 1 m long: 2 s per swing; 25 cm long: 1 s per swing.|The longer pendulum took more time for each swing.|Longer things always move more slowly.|The shorter pendulum took more time for each swing.
        Mint plants near the window: 15 leaves; in the closet: 3 leaves.|The mint near the window grew more leaves.|Mint can only grow next to windows.|The mint in the closet grew more leaves.
        Bridge of 5 straws held 200 g; 10 straws held 500 g.|The bridge with more straws held more weight.|Straws are stronger than steel.|The bridge with fewer straws held more weight.
        Soap A made 12 cm of bubbles; soap B made 5 cm.|Soap A made more bubbles in this test.|Soap A cleans better than any other soap.|Soap B made more bubbles in this test.
        Snail on wet paper moved 10 cm; on dry paper 3 cm.|The snail moved farther on wet paper.|Snails die on dry ground.|The snail moved farther on dry paper.
        Ice cube with salt melted in 5 min; without salt in 12 min.|The salted ice melted faster in this test.|Salt melts all ice in seconds.|The unsalted ice melted faster in this test.
        Shaded thermometer: 24°C; sunny thermometer: 33°C.|The thermometer in the sun read higher.|Sunlight is always dangerous.|The thermometer in the shade read higher.
        Toy car on carpet went 1 m; on wood went 4 m.|The car went farther on the wood floor.|Carpet stops every moving thing.|The car went farther on the carpet.
        Blue light plants: 10 cm; green light plants: 3 cm.|These plants grew more under blue light.|Green light kills plants.|These plants grew more under green light.
        Students who chewed gum: 7 words remembered; no gum: 7 words.|Chewing gum made no difference in this test.|Chewing gum harms the memory of everyone.|Students who chewed gum remembered more.
        Dark soil: 28°C; light sand: 22°C at noon.|The dark soil was warmer at noon.|Dark soil is always the best for farming.|The light sand was warmer at noon.
      `,
      (right) => [`**${right}** It states what the data show, no more and no less.`, `**${right}** 它说明了数据所显示的内容，不多也不少。`],
      [
        ["*{wrong}* goes far beyond what one test can show.", "*{wrong}* 远远超出了一次检验所能证明的范围。"],
        ["*{wrong}* contradicts the data: the measurements show the opposite.", "*{wrong}* 与数据矛盾：测量结果显示的正好相反。"],
      ],
    ),
  ],
});

const headline = topic("writing", {
  id: "writing-a-headline-and-lead",
  title: ["Writing a Headline and Lead", "写标题和导语"],
  summary: [
    "A news headline names the main event in a few strong words without opinion, and the lead gives the most important facts first: who, what, when and where.",
    "新闻标题用几个有力的词说出主要事件，不带观点；导语先给出最重要的事实：谁、什么事、何时、何地。",
  ],
  after: ["reading-a-news-article"],
  points: [
    choose(
      "the-best-headline",
      ["The Best Headline", "最好的标题"],
      [
        "A **headline** tells readers the main event in a few words. It uses a strong, present-tense verb (*wins*, *opens*, *floods*) and specific nouns. It does not give the writer's opinion (*Amazing!*, *Shameful*), and it is not so vague that readers cannot tell what happened (*Something Happens at School*).",
        "**标题**用几个词告诉读者主要事件。它使用有力的一般现在时动词（*wins*、*opens*、*floods*）和具体的名词。它不表达作者的观点（*Amazing!*、*Shameful*），也不能含糊到读者看不出发生了什么（*Something Happens at School*）。",
      ],
      ["Which is the best headline for this story?", "哪个是这篇报道最好的标题？"],
      `
        Facts: Lincoln Middle School's robot team won the state championship on Saturday.|Lincoln Robot Team Wins State Title|Lincoln's Amazing Robots Are the Best Ever!|Something Happens at a Competition
        Facts: Heavy rain flooded Main Street on Tuesday, closing six shops.|Flood Closes Six Main Street Shops|Terrible Rain Ruins Everything for Everyone!|Weather Is in the News Again
        Facts: The city library will open a new children's wing on June 1.|Library to Open Children's Wing June 1|Wonderful News for Lucky Kids!|Changes Coming Somewhere in Town
        Facts: A family found a 200-year-old coin while digging their garden.|Family Digs Up 200-Year-Old Coin|You Won't Believe This Incredible Find!|People Find Something in the Ground
        Facts: The school board voted 5 to 2 to start school 30 minutes later.|Board Votes to Start School Later|Board Finally Makes a Smart Choice!|A Vote Took Place This Week
        Facts: A fire destroyed an empty warehouse on River Road on Monday night; no one was hurt.|Fire Destroys Empty River Road Warehouse|Shocking Disaster Strikes Our Town!|Something Burned Recently
        Facts: Twelve-year-old Ana Ruiz won the national spelling bee.|Local Girl, 12, Wins National Spelling Bee|Ana Ruiz Is a Total Genius!|A Contest Had a Winner
        Facts: The zoo welcomed a baby giraffe born on Sunday.|Zoo Welcomes Baby Giraffe|Cutest Baby Animal in History!|Animal News from the Zoo
        Facts: The town council cut the parks budget by 20 percent.|Council Cuts Parks Budget 20 Percent|Council Shamefully Robs Our Parks!|Money Decisions Were Made
        Facts: Students raised \\$3,000 for the animal shelter at a car wash.|Students Raise \\$3,000 for Animal Shelter|Best Students in the World Save Animals!|Students Do an Activity
        Facts: A storm knocked out power to 10,000 homes on Friday.|Storm Leaves 10,000 Homes Without Power|Horrible Storm Is the Worst Ever!|Power Has Been an Issue
        Facts: The soccer team lost its first game of the season, 3 to 1.|Soccer Team Loses Opener 3–1|Embarrassing Loss for Our Hopeless Team!|A Game Was Played
        Facts: A new bike lane opened along Park Avenue on Monday.|New Bike Lane Opens on Park Avenue|Finally, Something Good for Cyclists!|Roads Are Changing
        Facts: Scientists at the university discovered a new species of frog.|University Scientists Discover New Frog Species|Brilliant Scientists Make Fantastic Discovery!|Science Happens at University
        Facts: The bakery on Elm Street closed after 50 years.|Elm Street Bakery Closes After 50 Years|So Sad! Our Favorite Bakery Is Gone Forever!|A Store Is Different Now
        Facts: A hiker was rescued from Black Mountain after two days.|Hiker Rescued from Black Mountain After Two Days|Heroic Rescuers Save Foolish Hiker!|A Person Was Found
        Facts: The school's drama club will perform Romeo and Juliet next week.|Drama Club to Stage Romeo and Juliet|Don't Miss the Best Play Ever!|Drama Club News
        Facts: The price of bus tickets will rise from \\$2 to \\$2.50 in March.|Bus Fares to Rise to \\$2.50 in March|Greedy City Raises Fares Again!|Changes to Something in March
        Facts: A water main broke on Oak Street, flooding the road.|Water Main Break Floods Oak Street|What a Mess on Oak Street!|Water Is in the Street
        Facts: The museum received a painting worth \\$1 million as a gift.|Museum Receives \\$1 Million Painting|Incredibly Generous Gift Amazes Everyone!|The Museum Has News
        Facts: Two bears were spotted in a neighborhood near the forest.|Two Bears Spotted Near Forest Homes|Terrifying Bears Threaten Our Families!|Animals Were Seen
        Facts: The mayor announced a plan to plant 5,000 trees.|Mayor Plans to Plant 5,000 Trees|Our Wonderful Mayor Saves the Planet!|The Mayor Said Something
        Facts: The chess club won its third tournament in a row.|Chess Club Wins Third Straight Tournament|Unstoppable Geniuses Crush Everyone!|Chess Club in the News
        Facts: A bridge on Route 9 will close for repairs for two months.|Route 9 Bridge to Close for Two Months|Annoying Bridge Closure Ruins Summer!|Something About a Bridge
        Facts: The school cafeteria will begin serving breakfast on Monday.|School Cafeteria to Begin Serving Breakfast|Delicious News for Hungry Students!|Food Changes at School
        Facts: A local teen invented a device that warns of floods.|Local Teen Invents Flood Warning Device|Teen Genius Will Change the World!|A Teen Made Something
        Facts: The swimming pool will close early this year because of repairs.|Pool to Close Early for Repairs|Worst Summer Ever as Pool Shuts!|Pool News This Year
        Facts: Snow closed all city schools on Thursday.|Snow Closes City Schools Thursday|Best Day Ever as Snow Saves Students!|Weather Affects Schools
        Facts: Volunteers cleaned 2 tons of trash from the beach.|Volunteers Clear 2 Tons of Trash from Beach|Amazing Heroes Make Beach Perfect!|Beach Activity Takes Place
        Facts: A new hospital wing for children opened on Tuesday.|New Children's Hospital Wing Opens|Fantastic Hospital Wing Is a Miracle!|Hospital Has an Update
      `,
      (right) => [
        `**${right}** It names the main event with a strong verb and specific facts, and it gives no opinion.`,
        `**${right}** 它用有力的动词和具体的事实说出了主要事件，没有表达观点。`,
      ],
      [
        ["*{wrong}* gives an opinion instead of reporting the event.", "*{wrong}* 表达了观点，而不是报道事件。"],
        ["*{wrong}* is so vague that readers cannot tell what happened.", "*{wrong}* 太含糊，读者看不出发生了什么。"],
      ],
    ),
    choose(
      "the-best-lead",
      ["The Best Lead", "最好的导语"],
      [
        "The **lead** is the first sentence of a news story. It gives the most important facts at once: **who**, **what**, **when** and **where**, and sometimes **why**. A lead that begins with a minor detail buries the news, and a lead that gives the reporter's opinion is not objective.",
        "**导语**是新闻报道的第一句话。它立刻给出最重要的事实：**谁**、**什么事**、**何时**、**何地**，有时还有**为什么**。从次要细节开始的导语埋没了新闻，表达记者观点的导语则不客观。",
      ],
      ["Which is the best lead for this story?", "哪个是这篇报道最好的导语？"],
      `
        Robot team wins state title|Lincoln Middle School's robot team won the state championship in Denver on Saturday, beating 40 other schools.|The bus left early on Saturday, and the students ate sandwiches on the way to Denver.|Lincoln Middle School has the most talented and hardworking robot team anyone has ever seen, and every student there should be proud.
        Flood on Main Street|Heavy rain flooded Main Street on Tuesday afternoon, forcing six shops to close.|Many people own umbrellas, and some of them were carrying them on Tuesday.|The flooding on Main Street was a disgrace that the city should be ashamed of, and someone at city hall should lose their job over it.
        New children's wing at the library|The city library will open a new children's wing on June 1, with 5,000 new books and a reading garden.|The library's carpet is blue, and its windows face the park.|The new children's wing is the most wonderful thing to happen to our city, and every family should rush to see it the moment it opens.
        Spelling bee winner|Ana Ruiz, 12, of Oak Hill won the national spelling bee in Washington on Thursday.|Ana Ruiz likes cats and has a younger brother named Tom.|Ana Ruiz is easily the smartest girl in the whole country, and probably the smartest in the whole world.
        Later school start|The school board voted 5 to 2 on Monday night to start classes 30 minutes later next fall.|The school board meeting began with a short speech about the history of the district.|The school board finally came to its senses on Monday night, after years of ignoring tired students and their parents.
        Warehouse fire|A fire destroyed an empty warehouse on River Road late Monday night; no one was injured.|River Road was built in 1920 and has many old buildings.|The terrible fire on River Road was the scariest thing our town has ever seen, and none of us will ever forget it.
        Baby giraffe at the zoo|The city zoo welcomed a baby giraffe on Sunday, the first born there in ten years.|The zoo's gift shop sells postcards, hats and stuffed animals.|The new baby giraffe is the cutest creature ever to be born.
        Parks budget cut|The town council voted Tuesday to cut the parks budget by 20 percent to pay for road repairs.|The council members sat at a long wooden table on Tuesday.|The council's cruel decision will destroy our beloved parks, and the children of this town will be the ones who suffer most.
        Students raise money for shelter|Students at Jefferson School raised \\$3,000 for the animal shelter at a car wash on Saturday.|It was sunny on Saturday, and some people wore sunglasses.|The students of Jefferson School are true heroes for all animals.
        Power outage|A storm knocked out power to 10,000 homes across the county on Friday evening.|Many people in the county own flashlights and candles.|Friday's storm was the worst disaster in the history of the county, and the power company should have been ready for it.
        New bike lane|A new bike lane opened along Park Avenue on Monday, connecting the river trail to downtown.|Park Avenue has many trees, and some of them are oaks.|The new bike lane is a brilliant idea that everyone should love.
        New frog species|Scientists at State University announced Wednesday that they had discovered a new species of tree frog in the hills.|Frogs are green or brown, and many of them can jump far.|The scientists at State University are the greatest minds of our time, and this amazing frog proves it beyond any doubt at all.
        Bakery closes|The Elm Street Bakery closed on Saturday after 50 years in business.|Bread is made from flour, water and yeast.|It is a tragedy that our wonderful bakery has shut its doors.
        Hiker rescued|Rescuers found a missing hiker alive on Black Mountain on Sunday, two days after she was reported lost.|Black Mountain is popular with tourists in the summer months.|The brave rescuers deserve a medal for their amazing courage, and the whole town should throw them a parade this week.
        Bus fare rise|Bus fares in the city will rise from \\$2 to \\$2.50 on March 1, the transit authority said Monday.|The city's buses are painted red and white.|The greedy transit authority is taking money from hardworking riders who already struggle to pay their bills every month.
        Bears in the neighborhood|Two black bears were seen in a neighborhood near Pine Forest on Wednesday morning, police said.|Pine Forest has many walking trails and a picnic area.|The frightening bears are a danger that no family should accept.
        Tree planting plan|Mayor Lisa Chen announced on Thursday a plan to plant 5,000 trees across the city by 2030.|The mayor wore a green jacket at Thursday's event.|Mayor Chen's inspiring plan proves she is the best mayor we have had, and she deserves to win every election from now on.
        Chess club wins again|The Riverside chess club won its third tournament in a row on Saturday in Springfield.|Chess was invented hundreds of years ago in India.|The Riverside chess club is simply unbeatable and always will be.
        Bridge closure|The Route 9 bridge will close for repairs from June to August, the state road department said Tuesday.|The Route 9 bridge is painted gray.|The bridge closure will ruin everyone's summer plans, and the road department clearly does not care about the people who drive.
        Cafeteria breakfast|The Washington School cafeteria will begin serving free breakfast to all students on Monday.|The cafeteria has twenty tables and a large window.|The new breakfast program is a delicious gift that every student will love, and it should have started years ago.
        Flood warning invention|A 14-year-old from Millbrook has invented a device that warns families of rising floodwater, and it won a state prize on Friday.|Millbrook has a river, a park and two schools.|This genius teenager is going to change the world forever.
        Pool closes early|The city pool will close on July 15, six weeks early, so that cracks in its floor can be repaired.|The pool has a diving board and a slide.|The early closing of the pool is a terrible blow to the children of our town, who now have nowhere to cool off on the hottest days.
        Snow day|Heavy snow closed all city schools on Thursday, and officials said they would reopen on Friday.|Snowflakes have six sides.|Thursday's snow day was the best surprise any student could ask for.
        Beach cleanup|Two hundred volunteers removed 2 tons of trash from Sunset Beach on Saturday.|Sunset Beach has fine white sand.|The volunteers are wonderful people who made our beach perfect again, and they deserve our thanks forever.
        Hospital wing|A new children's wing opened at Mercy Hospital on Tuesday, adding 40 beds for young patients.|Mercy Hospital's parking lot has 300 spaces.|The new wing is a miracle that will save every sick child.
        Museum gift|The City Museum received a painting worth \\$1 million on Monday, a gift from a local collector.|The City Museum has a café on its top floor.|The generous gift is the most exciting thing ever to happen to the museum, and everyone in the city should go to see it.
        Drama club play|The Central School drama club will perform Romeo and Juliet in the auditorium next Friday and Saturday.|Romeo and Juliet was written by Shakespeare.|The drama club's play is going to be the best show anyone has ever seen.
        Soccer team loss|The Eastside soccer team lost its first game of the season 3 to 1 to Westfield on Saturday.|The soccer field was wet on Saturday morning.|The Eastside soccer team played like a group of beginners on Saturday.
        Water main break|A water main broke on Oak Street early Wednesday, flooding the road and leaving 200 homes without water.|Oak Street has many old houses with porches.|The broken water main is proof that the city cannot do anything right, and residents are tired of waiting for someone to fix the old pipes.
        Coin found in garden|A family in Greenwood found a 200-year-old silver coin while digging in their garden on Sunday.|The family's garden has tomatoes, beans and roses.|This incredible discovery is the luckiest thing that has ever happened.
      `,
      (right) => [
        `**${right}** It puts the key facts first: who, what, when and where.`,
        `**${right}** 它把关键事实放在最前面：谁、什么事、何时、何地。`,
      ],
      [
        ["*{wrong}* begins with a minor detail and buries the news.", "*{wrong}* 从次要细节开始，埋没了新闻。"],
        ["*{wrong}* gives the reporter's opinion, so it is not objective.", "*{wrong}* 表达了记者的观点，所以不客观。"],
      ],
    ),
  ],
});

/** writingTopics7b are the later rule-checked writing topics of grade 7. */
export const writingTopics7b: readonly TopicDef[] = [analogy, pacing, callToAction, labConclusion, headline];
