// Grade 6: reading: supported claims, memoir and fiction, how characters change, tracing an argument, the author's
// point of view, rules and instructions, and the meaning carried by word choice.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, type Label, label, rival, rows, topic } from "./kit.ts";

const claimLabels: Readonly<Record<string, Label>> = {
  "backed by facts": {
    zh: "有事实依据",
    why: [
      "The claim comes with a number, a count, a record or a study that a reader could check.",
      "这个说法附有读者可以核实的数字、统计、记录或研究。",
    ],
    not: ["The claim is not backed by a number, a record or a study.", "这个说法没有数字、记录或研究作为依据。"],
  },
  "backed by an expert": {
    zh: "有专家依据",
    why: [
      "The claim is backed by the words of someone who studies or works in the field, named with what makes them an expert.",
      "这个说法有该领域研究者或从业者的话作支持，并说明了此人为什么是专家。",
    ],
    not: ["The claim is not backed by the words of a named expert.", "这个说法没有具名专家的话作支持。"],
  },
  unsupported: {
    zh: "无依据",
    why: [
      'The claim is only stated, or backed by a feeling or by what "everyone knows"; no fact or example supports it.',
      '这个说法只是被说出来，或者只靠感觉或"大家都知道"来支持，没有事实或例子。',
    ],
    not: ["The claim does come with facts or an expert that support it.", "这个说法确实有事实或专家意见支持。"],
  },
};

const supportedClaims = topic("reading", {
  id: "supported-and-unsupported-claims",
  title: ["Supported and Unsupported Claims", "有依据与无依据的说法"],
  summary: [
    "A claim is supported when the writer backs it with facts, numbers, examples or experts; a claim backed by nothing, or only by feelings, is unsupported.",
    "作者用事实、数字、例子或专家意见来支持的说法是有依据的；没有任何支持、或只靠感觉支持的说法是无依据的。",
  ],
  after: ["fact-and-opinion", "matching-points-and-evidence"],
  points: [
    label(
      "is-the-claim-supported",
      ["Is the Claim Supported?", "这个说法有依据吗？"],
      [
        "A **claim** is something a writer wants you to believe. It is **supported** when the writer gives a reason you can check. Some claims are **backed by facts**: a number, a count, a record or a study. Others are **backed by an expert**: the words of someone who studies or works in the field. It is **unsupported** when it is only stated, repeated more loudly, or backed by feelings (*I just know*), by *everyone says so*, or by insults. A careful reader asks: how does the writer know?",
        "**说法**是作者希望你相信的东西。如果作者给出了可以核实的理由，它就是**有依据的**。有的说法**有事实依据**：数字、统计、记录或研究；有的**有专家依据**：该领域研究者或从业者的话。如果它只是被说出来、被更大声地重复，或者只靠感觉（*I just know*）、*everyone says so* 或侮辱来支持，它就是**无依据的**。细心的读者会问：作者是怎么知道的？",
      ],
      ["How is the claim supported, if at all?", "这个说法有什么依据，还是没有依据？"],
      `
        Our town needs a bike lane. Last year, 42 cyclists were hurt on Main Street, according to the police report.|backed by facts
        Our town needs a bike lane. Everyone knows it would be better.|unsupported
        Homework helps students learn. A study of 3,000 students found that those who did homework scored higher on tests.|backed by facts
        Homework is a waste of time, and anyone who disagrees is just boring.|unsupported
        The library should stay open later. Last month, 150 students signed a list asking for evening hours.|backed by facts
        The library should stay open later because it is obviously the right thing to do.|unsupported
        Recess makes students calmer. Our teachers counted half as many arguments in class on days with recess.|backed by facts
        Recess is the best part of the day, and I am sure every student feels the same.|unsupported
        Plastic bags harm sea life. Dr. Ruiz, a marine biologist at the city aquarium, says bags are among the worst dangers sea turtles face.|backed by an expert
        Plastic bags are terrible. I have always hated them.|unsupported
        Reading aloud helps young children. Dr. Lee, who studies how children learn, says it builds their vocabulary.|backed by an expert
        Reading aloud is good for kids. Trust me, it just is.|unsupported
        The new park is popular. More than 2,000 people visited it on its first weekend.|backed by facts
        The new park is popular. I can just feel it.|unsupported
        School should start later. Teenagers' bodies make the sleep hormone later at night, as doctors have shown.|backed by an expert
        School should start later, because early mornings are the worst thing ever invented.|unsupported
        Our team needs a new field. The old field flooded nine times this season, and four games were cancelled.|backed by facts
        Our team needs a new field, and only a fool would say otherwise.|unsupported
        Walking to school is healthy. Children who walk get about twenty extra minutes of exercise each day.|backed by facts
        Walking to school is healthy. My grandmother always said so, and she was never wrong.|unsupported
        Bees are in danger. In one recent winter, beekeepers in the country lost about forty percent of their hives.|backed by facts
        Bees are in danger. It is something everybody is talking about.|unsupported
        Video games can teach skills. Dr. Ortiz, a surgeon who trains new doctors, says some games sharpen the hand skills surgery needs.|backed by an expert
        Video games rot your brain. That is just a fact.|unsupported
        The bridge needs repair. The city's chief engineer, who inspects every bridge in town, says it is no longer safe for trucks.|backed by an expert
        The bridge needs repair. It looks old, and old things are always dangerous.|unsupported
        Our cafeteria wastes food. In one week, we weighed 180 kilograms of food thrown away.|backed by facts
        Our cafeteria wastes food. I am completely sure about it.|unsupported
        Trees cool a city. Ms. Wu, a city planner who studies summer heat, says trees are the cheapest way to cool a street.|backed by an expert
        Trees cool a city, as any sensible person can tell you.|unsupported
      `,
      claimLabels,
    ),
    choose(
      "the-best-support",
      ["The Best Support", "最有力的依据"],
      [
        "Some support is stronger than others. A **fact you can check**, a **number from a study** or an **expert in the field** is strong support. A feeling, a rumor, one friend's opinion or a person famous for something else is weak support. Choose the support that would make a careful reader believe the claim.",
        "有些依据比另一些更有力。**可以核实的事实**、**研究中的数字**或**该领域的专家**是有力的依据。感觉、传言、某个朋友的看法，或在别的领域出名的人，都是薄弱的依据。要选出能让细心的读者相信这个说法的依据。",
      ],
      ["Which gives the strongest support for the claim?", "哪一项最有力地支持这个说法？"],
      rival(
        `
        Claim: Our school needs more water fountains.|A count showing 600 students share only four fountains.|My friend says she is often thirsty.|A famous singer once said water is important.
        Claim: Sleep helps students learn.|A study showing students who slept more remembered more.|My brother feels great after a nap.|A poster on the wall says sleep is cool.
        Claim: The river is getting cleaner.|Tests showing the river now has half as much pollution as in 2010.|The river looks nicer than it used to.|A neighbor says he saw a fish there.
        Claim: Exercise improves mood.|Research from doctors showing exercise lowers stress hormones.|I always feel happy after soccer.|A basketball star says running is fun.
        Claim: The town needs a traffic light at Oak Street.|A report of eleven crashes at Oak Street this year.|Drivers there seem to go too fast.|Someone online said the corner is scary.
        Claim: Reading on paper helps memory.|A study in which students remembered more from paper books than screens.|I like the smell of paper books.|My aunt has always preferred paper.
        Claim: The school garden saves money.|Records showing the garden grew 200 kilograms of food last year.|The garden is a lovely place.|Many students enjoy working in the garden.
        Claim: Dogs help people feel calm.|A hospital study showing patients' heart rates dropped with therapy dogs.|My dog always makes me smile.|An actor said dogs are the best pets.
        Claim: Our bus route is too long.|A timetable showing the trip takes seventy minutes each way.|The bus ride feels like forever.|Everyone complains about the bus.
        Claim: Recycling at school is working.|Figures showing trash fell by a third after bins were added.|Recycling makes us feel good.|Our principal likes recycling.
        Claim: The lake is drying up.|Measurements showing the water level fell three meters in ten years.|The lake seems smaller every summer.|A fisherman says he catches less.
        Claim: Music lessons help with math.|A study finding music students scored higher on math tests.|I enjoy both music and math.|A guitarist said music makes you smart.
        Claim: The new road would harm wildlife.|A survey finding rare frogs live in the wetland it would cross.|Roads are ugly.|My cousin thinks the road is a bad idea.
        Claim: Breakfast helps students focus.|Teachers' records showing fewer students lost focus after a breakfast program began.|My mom says breakfast is important.|Cereal ads say breakfast gives energy.
        Claim: Our town's population is growing.|Census numbers showing 4,000 more people than ten years ago.|The streets feel more crowded.|There are new shops downtown.
        Claim: Helmets prevent injuries.|Hospital data showing helmets cut head injuries by more than half.|Helmets look safe.|My friend never got hurt with one.
        Claim: The museum should be free for students.|Figures showing visits doubled at museums that dropped student fees.|Museums are fun.|Some students cannot afford many things.
        Claim: Phones distract students in class.|A study showing students without phones scored higher on tests.|My teacher dislikes phones.|Phones make annoying sounds.
        Claim: The old factory polluted the soil.|Soil tests showing high levels of lead near the factory.|The factory looks dirty.|People have always said it was bad.
        Claim: Planting trees reduces flooding.|Measurements showing less runoff in areas with more trees.|Trees are pretty in the rain.|A gardener says trees drink a lot.
        Claim: Students need longer lunch breaks.|A survey showing a third of students do not finish their food.|Lunch is too short.|I am always hungry in the afternoon.
        Claim: Bees are vital to farms.|Farm data showing almond crops depend on bees for nearly all their flowers.|Bees are interesting insects.|Honey tastes good.
        Claim: The new school is overcrowded.|Figures showing 900 students in a building built for 600.|The halls feel packed.|My sister says her class is big.
        Claim: Wearing a seatbelt saves lives.|Safety studies showing seatbelts cut the risk of death in a crash by about half.|Seatbelts feel safe.|My dad always wears one.
        Claim: The fish in the bay are disappearing.|Counts by scientists showing fewer fish each year since 2015.|The bay seems empty now.|Fishermen look unhappy.
        Claim: Art class improves creativity.|A study finding art students came up with more ideas in tests of creativity.|Art class is my favorite.|A painter said art is important.
        Claim: The air in the city is unhealthy.|Air-quality readings above the safe limit on 90 days last year.|The city air smells bad.|People say they cough a lot.
        Claim: Playing outside is good for eyesight.|Eye doctors' research showing children who play outside are less often shortsighted.|Outside play is fun.|My friend plays outside and sees well.
        Claim: The bake sale raised enough for the trip.|A record showing the sale raised 820 dollars, more than the 750 needed.|Many people came to the sale.|The cookies sold very fast.
        Claim: Learning a second language helps the brain.|Studies showing bilingual people do better at switching between tasks.|Learning languages is fun.|My teacher speaks three languages.
      `,
        1,
      ),
      (right) => [
        `**${right}** It can be checked, and it comes from counting, measuring or study, so it gives strong support.`,
        `**${right}** 它可以核实，来自统计、测量或研究，所以是有力的依据。`,
      ],
      [
        [
          "*{wrong}* is only a feeling or one person's experience; it cannot show the claim is true in general.",
          "*{wrong}* 只是一种感觉或个人经历，无法证明这个说法普遍成立。",
        ],
        ["*{wrong}* could be checked, but it is evidence for a different claim.", "*{wrong}* 也许可以核实，但它是另一个说法的依据。"],
      ],
    ),
  ],
});

const memoirLabels: Readonly<Record<string, Label>> = {
  memoir: {
    zh: "回忆录",
    why: [
      "The writer tells true events from their own life, with real places, dates and reflection on what it meant.",
      "作者讲述自己生活中的真实事件，有真实的地点、时间，并反思其意义。",
    ],
    not: ["This is not the writer telling true events of their own life.", "这不是作者在讲述自己生活中的真实事件。"],
  },
  fiction: {
    zh: "小说",
    why: [
      "The people or events are invented; even when an *I* tells it, the story is made up.",
      "人物或事件是虚构的；即使由 *I* 来讲述，故事也是编出来的。",
    ],
    not: ["The events are real, not made up, so this is not fiction.", "这些事件是真实的，不是编造的，所以不是小说。"],
  },
  biography: {
    zh: "传记",
    why: [
      "The events are true, but they happened to someone else; the writer tells another person's life as *he* or *she*.",
      "事件是真实的，但发生在别人身上；作者用 *he* 或 *she* 讲述另一个人的一生。",
    ],
    not: ["This is not one writer telling the true life of another person.", "这不是一位作者讲述另一个人的真实生平。"],
  },
};

// Memoir passages: the sentence that looks back|the event|a detail of the scene
const lookBackRows = rows(`
  Looking back, I see that losing the race taught me more than winning ever could.|We ran the race on a cold Saturday in March.|The track was muddy from the night's rain, and the crowd along the fence was loud.
  Now I know that my father's silence was his way of showing he cared.|My father worked at the factory every day.|He came home at six every evening and ate his dinner without saying a word to anyone.
  I realize now that moving away made me braver than I thought I could be.|We moved to a new city when I was ten.|Our new apartment was on the fifth floor of a gray building with a broken elevator.
  Ever since that day, I have never been afraid to ask for help.|I got lost in the market when I was seven.|A woman selling oranges took my hand and walked me all the way to the police station.
  I learned that summer that friendship is about showing up, not about agreeing.|Sam and I argued about the tree house all summer.|The tree house had a rope ladder, a red tin roof and a window that would not close.
  Only years later did I understand how much my grandmother had sacrificed.|My grandmother sewed clothes for our whole family.|She worked late into the night on an old black machine with a squeaky foot pedal.
  Today, I see that the broken bike was the best gift I ever received.|My uncle gave me an old bike with a bent wheel.|I spent the summer fixing it in the garage.
  That night taught me that being kind is a choice we make every day.|I gave my sandwich to the new boy at lunch.|He had left his lunch on the kitchen table at home and sat alone with an empty tray.
  Looking back, I am grateful for every early morning on the farm.|We woke up at five to milk the cows.|The barn was cold in the dark, and it smelled of hay, dust and warm animals.
  I now understand that my teacher was hard on me because she believed in me.|Mrs. Patel made me rewrite my essay four times.|She marked every mistake in red ink and wrote long notes in the margins of each page.
  Since then, I have tried to listen before I speak.|My sister and I had a terrible fight that spring.|She slammed the door and did not talk to me for days.
  I realize now that the old house was never what made us a family.|We sold the old house when I was twelve.|It had a small garden full of roses and a creaky wooden staircase that groaned at night.
  That failure shaped the rest of my life in ways I could not imagine.|I failed my first piano exam.|The judge sat at a long table near the window, tapping a pencil as I played.
  Now, whenever I am nervous, I remember that I survived that first day.|On my first day at the new school, I knew nobody.|The hallways were crowded with older students, and the noise was louder than any I had heard.
  It took me years to see that my mother's rules were a kind of love.|My mother never let me go to the park alone.|The park was only three streets from our home, past the bakery and the old church.
  I learned from Grandpa that patience is a kind of strength.|Grandpa and I fished by the river every Sunday.|We usually caught two or three small fish.
  Looking back, that trip was when I first fell in love with science.|We visited the science museum in fourth grade.|A huge model of a blue whale hung from the ceiling of the main hall above our heads.
  Even now, I think of that stranger whenever I see someone in need.|A stranger helped us change a flat tire in the rain.|He wore a long gray coat and held a large black umbrella over my mother as she worked.
  I see now that I was angry because I was scared.|I shouted at my coach after the game.|We had lost the final by one goal, scored in the very last minute of the game.
  From that day on, I knew I wanted to become a doctor.|My brother broke his arm when I was nine.|At the hospital, a nurse wrapped his arm in a white cast and let me sign my name on it.
  I now know that home is the people, not the place.|We lived in four different towns before I was ten.|Each town had a different school, a different bus route and a different set of faces.
  That experience taught me to be proud of where I come from.|Some children laughed at my accent in my first year.|I spoke English with my family's Spanish rhythm.
  I realize today that my little brother looked up to me all along.|My little brother followed me everywhere.|He copied the way I tied my shoes and even the way I held my spoon at dinner.
  Since that summer, I have never taken clean water for granted.|We stayed in a village where water came from a well.|We carried it home in heavy buckets.
  Looking back, I can see that my shyness hid a lot of curiosity.|I hardly spoke in class during sixth grade.|I sat in the back row near the window.
  Only now do I understand why my father cried at my graduation.|My father came to my graduation in his best suit.|The ceremony was held in the hot school gym, with folding chairs in long rows.
  That moment showed me that courage is not the same as feeling no fear.|I sang a solo at the school concert.|My hands were shaking as I held the microphone.
  I learned that night that some mistakes cannot be undone, only learned from.|I broke my neighbor's window with a baseball.|The broken glass fell onto the yellow flowers she had planted that spring.
  Today, I keep her letters as a reminder of how much words can matter.|My aunt wrote me a letter every month.|She always used thin blue paper and drew tiny flowers in the corners of each page.
  Ever since, I have believed that small acts can change a person's life.|A librarian gave me my first library card.|She smiled and stamped it with the date.
`);

// A memoir may look back at the start of a passage as well as at its end.
const lookingBack: ChoiceItem[] = lookBackRows.map((r, i) => [
  i % 3 === 1 ? `${field(r, 0)} ${field(r, 1)} ${field(r, 2)}` : `${field(r, 1)} ${field(r, 2)} ${field(r, 0)}`,
  field(r, 0),
  [field(r, 1), field(r, 2)],
]);

const memoirOrFiction = topic("reading", {
  id: "memoir-or-fiction",
  title: ["Memoir or Fiction", "回忆录还是小说"],
  summary: [
    "A memoir tells true events from the writer's own life and reflects on what they meant; fiction invents its people and events, even when an I tells them.",
    '回忆录讲述作者自己生活中的真实事件，并反思其意义；小说虚构人物和事件，即使由"我"来讲述。',
  ],
  after: ["legend-or-history"],
  points: [
    label(
      "telling-memoir-from-fiction",
      ["Memoir, Biography or Fiction", "回忆录、传记还是小说"],
      [
        "Both a memoir and a story can be told by *I*. A **memoir** is true: the writer tells events from their own life, names real places and times, and often looks back to say what the events meant (*Now I understand that...*). **Fiction** is invented: its events may be impossible, its narrator may be a made-up person or even an animal, and it may be labeled *a novel* or *a story*. A **biography** is true too, but it tells someone else's life, as *he* or *she*: *Marie Curie was born in Warsaw in 1867.*",
        "回忆录和故事都可以用 *I* 来讲述。**回忆录**是真实的：作者讲述自己生活中的事件，提到真实的地点和时间，并常常回顾这些事件的意义（*Now I understand that...*）。**小说**是虚构的：事件可能不可能发生，叙述者可能是虚构的人甚至是动物，而且可能被标为 *a novel* 或 *a story*。**传记**也是真实的，但讲的是别人的一生，用 *he* 或 *she*：*Marie Curie was born in Warsaw in 1867.*",
      ],
      ["Is this passage from a memoir, a biography or fiction?", "这段文字出自回忆录、传记还是小说？"],
      `
        In the summer of 1998, when I was eleven, my family moved from Lagos to London. Looking back, I see that the move taught me who I was.|memoir
        I was a dragon's egg for a hundred years before I hatched in the king's garden.|fiction
        My grandmother ran a bakery on Elm Street for forty years. I still remember the smell of her bread, and I now know how hard she worked.|memoir
        When I woke up, I could understand every word the birds were saying.|fiction
        I was born in a small village in Peru in 1975. My father was a teacher, and his lessons shaped my whole life.|memoir
        I am the last robot on Earth, and today I found a seed.|fiction
        The year I turned nine, my mother lost her job. It was years before I understood how brave she had been.|memoir
        My name is Whiskers, and I am the smartest cat on Maple Lane.|fiction
        I first saw snow in December 2003, when we arrived in Toronto. I remember thinking the sky was falling apart.|memoir
        On my twelfth birthday, I opened a door in our attic and stepped into another century.|fiction
        In this book, I write about the ten years I spent working as a nurse in a hospital in Manila.|memoir
        This novel tells the story of Mia, a girl who can make herself invisible.|fiction
        I learned to swim at the age of thirty, at the public pool in our town. It changed how I saw fear.|memoir
        I flew over the mountains on the back of my giant eagle, Storm.|fiction
        When I was a boy in Seoul in the 1960s, we had no television. My brothers and I made up our own games.|memoir
        The ghost in my closet told me a secret about the old house.|fiction
        My father fixed shoes in a tiny shop near the station. Only now, as an adult, do I see how much he gave up for us.|memoir
        I could breathe underwater, so I swam down to the city beneath the sea.|fiction
        In 2010 I failed my driving test three times. Those failures taught me patience I still use today.|memoir
        When the moon turned green, I knew my powers had come.|fiction
        Our first apartment in New York had one window and a radiator that clanked all night. I loved it more than any house since.|memoir
        This short story is told by Max, a boy who travels through time in a shoebox.|fiction
        I met my best friend, Hana, on the first day of school in 1992. We are still friends today.|memoir
        The talking tree warned me not to go into the dark forest.|fiction
        My mother crossed the border in 1985 with two suitcases and me. I have written this book so my children know her story.|memoir
        I shrank to the size of an ant and explored my own backyard.|fiction
        I spent my teenage years on my uncle's farm in Kenya. The work was hard, but it taught me to love the land.|memoir
        Every night at midnight, my toys come alive and tell me their adventures.|fiction
        The day my grandfather died, I was fourteen. I did not cry until a month later, when I found his letters.|memoir
        I am a girl from the year 3000, and I have come back to warn you.|fiction
        Marie Curie was born in Warsaw in 1867. She later moved to Paris, where she studied at night after long days of work.|biography
        Nelson Mandela spent twenty-seven years in prison. When he was freed in 1990, he worked to bring his country together.|biography
        As a boy in Ohio, Neil Armstrong built model airplanes. In 1969 he became the first person to walk on the Moon.|biography
        Malala Yousafzai grew up in Pakistan, where she spoke out for girls' schooling. In 2014 she won the Nobel Peace Prize.|biography
        This book tells the life of Zheng He, the admiral who led great fleets across the Indian Ocean six hundred years ago.|biography
        Frida Kahlo was badly hurt in a bus accident at eighteen. She began to paint while she lay in bed recovering.|biography
        Jesse Owens won four gold medals at the 1936 Olympics. Back home, he still had to use the back door of hotels.|biography
        Wangari Maathai was born in a Kenyan village in 1940. She went on to plant millions of trees across Africa.|biography
        Louis Braille lost his sight as a small child. At fifteen, he invented the system of raised dots that blind people still read.|biography
        Ada Lovelace was the daughter of a famous poet, but she loved numbers. In 1843 she wrote what many call the first computer program.|biography
      `,
      memoirLabels,
    ),
    choose(
      "where-the-memoirist-looks-back",
      ["Where the Memoirist Looks Back", "回忆录作者在哪里回顾"],
      [
        "A memoir does more than tell what happened; the writer **looks back** from today to say what the event meant or how it changed them. Such sentences often use words such as *now I know*, *looking back*, *I learned*, *I realize* or *ever since*. A sentence that only tells an event, or only describes a place, does not look back.",
        "回忆录不只讲述发生了什么；作者还会**反思**，从现在回头看，说出这件事的意义或它如何改变了自己。反思常用 *now I know*、*looking back*、*I learned*、*I realize* 或 *ever since* 之类的词。只讲述事件或只描写地点的句子不是反思。",
      ],
      ["Which sentence of this passage looks back on what the event meant?", "这段文字中哪个句子回顾了事件的意义？"],
      lookingBack,
      (right) => [
        `**${right}** The writer looks back from the present and says what the event meant; that is reflection.`,
        `**${right}** 作者从现在回头看，说出这件事的意义，这就是反思。`,
      ],
      [
        [
          "*{wrong}* only tells an event; it does not say what it meant to the writer.",
          "*{wrong}* 只讲述了一个事件，没有说出它对作者的意义。",
        ],
        ["*{wrong}* only describes a detail; it does not look back on the experience.", "*{wrong}* 只描写了一个细节，没有回顾这段经历。"],
      ],
    ),
  ],
});

const changeLabels: Readonly<Record<string, Label>> = {
  dynamic: {
    zh: "动态人物",
    why: [
      "By the end, the character has changed inside: a belief, a feeling or a way of acting is different.",
      "到结尾时，人物的内心发生了变化：信念、感受或行为方式变得不同了。",
    ],
    not: [
      "The character is the same inside at the end as at the start, so they are not dynamic.",
      "人物在结尾和开头时内心一样，所以不是动态人物。",
    ],
  },
  static: {
    zh: "静态人物",
    why: [
      "The character stays the same from beginning to end, inside and out, even though things happen around them.",
      "人物从头到尾内外都没有变化，尽管周围发生了很多事情。",
    ],
    not: ["Something about the character changes by the end, so they are not simply static.", "人物到结尾时有所变化，所以不只是静态人物。"],
  },
  "changes only outside": {
    zh: "只有外在变化",
    why: [
      "The character's place, looks or age changes, but who they are inside stays the same; that is not a dynamic change.",
      "人物的地点、外表或年龄变了，但内心没有变，这不是动态的变化。",
    ],
    not: ["The change here is not only in place, looks or age.", "这里的变化不只是地点、外表或年龄的变化。"],
  },
};

const dynamicStatic = topic("reading", {
  id: "dynamic-and-static-characters",
  title: ["Dynamic and Static Characters", "动态人物与静态人物"],
  summary: [
    "A dynamic character changes inside over a story, in a belief, a feeling or a way of acting; a static character stays the same from start to end.",
    "动态人物在故事中内心发生变化，包括信念、感受或行为方式；静态人物从头到尾保持不变。",
  ],
  after: ["how-characters-face-challenges"],
  points: [
    label(
      "dynamic-or-static",
      ["Dynamic or Static", "动态还是静态"],
      [
        "A **dynamic** character changes inside over the story: a selfish boy learns to share, a fearful girl finds courage. A **static** character stays the same: a kind grandmother is kind on every page, a bully is still a bully at the end. A character who **changes only outside** moves to a new place, gets new clothes or grows older, but is the same person inside. Compare who the character is at the start with who they are at the end.",
        "**动态**人物在故事中内心发生变化：自私的男孩学会分享，胆小的女孩找到勇气。**静态**人物保持不变：善良的祖母每一页都很善良，恶霸到结尾还是恶霸。**只有外在变化**的人物搬到新的地方、换了新衣服或长大了，内心却还是同一个人。比较人物开头和结尾时是怎样的人。",
      ],
      ["Is the character dynamic, static, or changed only outside?", "这个人物是动态的、静态的，还是只有外在变化？"],
      `
        At first, Leo laughs at the new girl's accent. By the end, after she helps him in a storm, he defends her in front of the class.|dynamic
        Grandma Rose is cheerful and generous from the first page to the last, through every trouble the family faces.|static
        Mia is too afraid to speak in class. After she saves her brother at the river, she stands up and gives a speech.|dynamic
        The wicked stepmother is cruel to Ella at the start and is just as cruel at the end.|static
        Tom cares only about winning. After his team loses, he learns that helping his friends matters more.|dynamic
        Captain Hale is brave and calm in every battle, from the first chapter to the last.|static
        Ana thinks her grandfather is boring. After she hears his stories of the war, she sees him as a hero and visits him every week.|dynamic
        The clever fox tricks every animal in the forest, and he is still tricking them when the story ends.|static
        Raj is selfish with his toys. When his little sister is sick, he gives her his favorite bear, and he keeps sharing after that.|dynamic
        Mr. Gray, the grumpy neighbor, shouts at the children at the start and shouts at them at the end.|static
        Lily believes she cannot draw. After the art teacher encourages her, she enters a contest and believes in herself.|dynamic
        Officer Kim is honest and fair in every scene of the mystery.|static
        Jamal trusts no one after moving to a new city. By the end, he has made two close friends and lets them in.|dynamic
        The king is greedy at the start and remains greedy when the kingdom falls.|static
        Sofia hates the farm at first. After saving a newborn calf, she decides she wants to be a vet.|dynamic
        The loyal dog Max is faithful to the boy through the whole story.|static
        At the start, Ben lies to get out of trouble. After his lie hurts a friend, he tells the truth even when it costs him.|dynamic
        Aunt May is strict and serious in every chapter, and she does not change.|static
        Kai is proud and refuses help. Lost in the mountains, he learns to accept help from a stranger and thanks her.|dynamic
        The bully Craig picks on younger students at the start and is still picking on them at the end.|static
        Nora is jealous of her sister's talent. By the end, she cheers loudest at her sister's concert.|dynamic
        The wise old owl gives the same calm advice in every scene.|static
        Omar is careless with money. After losing his savings, he plans carefully and saves for months.|dynamic
        The giant is angry and hungry when the story begins and when it ends.|static
        Emma does not care about the environment. After a beach clean-up, she starts a recycling club.|dynamic
        The friendly baker gives free bread to children on every page of the story.|static
        Sam thinks only of himself. After a hard winter with his family, he begins to put others first.|dynamic
        The pirate captain is cruel and greedy from the first page to the last.|static
        Hana is quick to judge people. After she gets to know the quiet boy next door, she learns to listen first.|dynamic
        The patient teacher stays gentle with her students through every problem in the story.|static
        Pia moves from the city to a farm and gets a new haircut, but she is just as bossy on the last page as on the first.|changes only outside
        Over the story, Ken grows from a boy of eight into a man of thirty, and he is as selfish at the end as he was as a child.|changes only outside
        The princess trades her silk gowns for a servant's clothes, yet she stays as proud and cold as ever.|changes only outside
        After winning the lottery, Mr. Boyd buys a mansion and a red car, but he is still as mean to his workers.|changes only outside
        Lena moves to three new schools in the book, and at each one she is the same shy girl who never speaks.|changes only outside
        The knight's armor is dented and his hair turns gray, but he is as boastful in the last battle as in the first.|changes only outside
        Zara dyes her hair blue and gets new glasses, yet she still lies to her friends whenever it suits her.|changes only outside
        The family moves across the ocean to a new country, and Grandpa is as gloomy and stubborn there as he was at home.|changes only outside
        Tomas becomes famous and appears on television, but he is as kind and humble at the end as he was at the start.|changes only outside
        The old wizard turns himself into a young man, but he is still as greedy for gold as he always was.|changes only outside
      `,
      changeLabels,
    ),
    choose(
      "what-changed-the-character",
      ["What Changed the Character", "是什么改变了人物"],
      [
        "A dynamic character usually changes because of an important **event** in the plot: a loss, a mistake, a test, a meeting with someone new. To explain the change, name who the character was before, what happened, and who they are after. The cause is something that happens in the story, not just the passing of time.",
        "动态人物通常因为情节中的一个重要**事件**而改变：失去、犯错、考验、遇见新的人。要解释这种变化，就要说出人物之前是怎样的、发生了什么、之后是怎样的。原因是故事中发生的事情，而不只是时间的流逝。",
      ],
      ["What most likely caused the change in the character?", "最可能是什么导致了人物的变化？"],
      rival(
        `
        Leo mocked the new girl until she pulled him out of the flooded creek. Afterward, he defended her.|being rescued by the girl he mocked|the start of a new school year|a gift from his parents
        Mia was terrified of speaking until she saved her brother at the river. Then she gave a speech.|proving her courage at the river|a new dress for the speech|a long summer holiday
        Tom cared only about winning until a big loss showed him how his teammates felt. Then he helped them.|a loss that showed him his teammates' feelings|a new pair of running shoes|his coach leaving the team
        Ana found her grandfather boring until she heard his war stories. Then she admired him.|hearing her grandfather's stories|growing a year older|moving to a new house
        Raj would not share until his sister fell ill. Then he gave her his bear and kept sharing.|seeing his sister ill|getting new toys|a rule his parents made
        Lily believed she could not draw until her teacher praised her work. Then she entered a contest.|her teacher's encouragement|a new box of pencils|a holiday at the beach
        Jamal trusted no one until two classmates stood by him when he was blamed unfairly. Then he let them in.|classmates standing by him when he was blamed|a birthday party|joining a new club
        Sofia hated the farm until she saved a newborn calf. Then she wanted to become a vet.|saving the newborn calf|the summer ending|meeting a famous vet on television
        Ben lied to escape trouble until his lie got a friend punished. Then he told the truth.|seeing his lie hurt a friend|a lesson about honesty in a book|his parents giving him a reward
        Kai refused all help until he was lost in the mountains and a stranger guided him home. Then he thanked her.|being guided home when he was lost|winning a hiking prize|buying a new map
        Nora envied her sister until her sister was sick and Nora took her place on stage. Then she understood her sister's hard work.|taking her sister's place on stage|a new teacher at school|getting her own room
        Omar wasted money until he lost all his savings on a broken toy. Then he planned carefully.|losing his savings on a broken toy|getting a job|a birthday gift of money
        Emma ignored the environment until she saw sea birds tangled in plastic. Then she started a club.|seeing sea birds tangled in plastic|a school holiday|a new teacher
        Sam thought only of himself until his family struggled through a hard winter together. Then he put others first.|struggling through a hard winter with his family|turning thirteen|moving to a new school
        Hana judged people quickly until the boy she called strange helped her study. Then she listened first.|being helped by the boy she judged|reading a book about manners|a change of seats in class
        Maria was afraid of dogs until a dog found her lost little brother. Then she adopted one.|a dog finding her lost brother|visiting a pet shop|a dog show on television
        Jake bullied smaller kids until he was bullied himself at a new camp. Then he stopped.|being bullied himself at camp|a new school year|getting taller
        Priya never tried new foods until she was stuck in a village where only strange foods were served. Then she loved trying them.|being stuck where only new foods were served|a cooking show|her birthday dinner
        Daniel thought reading was dull until a librarian gave him a book about his favorite sport. Then he read every day.|a book about his favorite sport|the end of the school year|a new bookshelf
        Zoe never trusted adults until a teacher kept her secret and helped her. Then she began to trust.|a teacher keeping her secret and helping her|a parent-teacher meeting|moving to a new town
        Liam cheated on tests until he was caught and lost his place on the team. Then he studied honestly.|losing his place on the team for cheating|a new math book|getting glasses
        Grace was rude to her grandmother until she read her grandmother's old diary. Then she was gentle and kind.|reading her grandmother's diary|a family holiday|her grandmother's birthday
        Ethan never helped at home until his mother fell ill and he had to run the house. Then he kept helping.|running the house while his mother was ill|being given a new chore chart|a school project on families
        Ava was afraid of failing until she failed a test and saw that she could recover. Then she took more risks.|failing a test and recovering|winning a prize|a summer at camp
        Noah looked down on the janitor until the janitor saved the school from a fire. Then he respected him.|the janitor saving the school from a fire|a new janitor arriving|an assembly about jobs
        Chloe thought her small town was boring until she spent a month in a huge city. Then she loved her town.|spending a month in a huge city|a new park in town|her best friend visiting
        Lucas never forgave anyone until his best friend forgave him for a big mistake. Then he learned to forgive.|being forgiven by his best friend|a lesson in church|a new year starting
        Mila laughed at people who were different until she was the only foreign student in a new class. Then she was kind.|being the only foreign student in a class|a film about kindness|a new hairstyle
        Owen was careless with his chores until the family dog got out through the gate he left open. Then he was careful.|the dog getting out through the gate he left open|a new lock on the gate|a list from his father
        Ella thought she was too shy to lead until her class chose her to lead the play when the leader got sick. Then she led with confidence.|being chosen to lead when the leader got sick|getting a new costume|a long weekend
      `,
        0,
      ),
      (right) => [
        `The change came from an event in the story: **${right}**. Before it the character was one way; after it, another.`,
        `变化来自故事中的一个事件：**${right}**。在此之前人物是一个样子，之后变成了另一个样子。`,
      ],
      [
        [
          "*{wrong}* does not happen in the passage; the story points to a different event.",
          "*{wrong}* 在这段文字中并没有发生，故事指向的是另一个事件。",
        ],
        [
          "*{wrong}* is an outside change, not the event that changed the character inside.",
          "*{wrong}* 是外在的变化，不是改变人物内心的事件。",
        ],
      ],
    ),
  ],
});

const argumentLabels: Readonly<Record<string, Label>> = {
  "the claim": {
    zh: "主张",
    why: [
      "The sentence states the writer's position, what the whole argument wants you to believe.",
      "这个句子说出了作者的立场，即整个论证希望你相信的内容。",
    ],
    not: [
      "This sentence is not the writer's main position; it supports or answers it.",
      "这个句子不是作者的主要立场，它是在支持或回应这个立场。",
    ],
  },
  "a reason": {
    zh: "理由",
    why: ["The sentence gives one general reason why the claim is true.", "这个句子给出了说法成立的一个总的理由。"],
    not: ["This sentence does not give a general reason for the claim.", "这个句子没有给出支持主张的总理由。"],
  },
  evidence: {
    zh: "证据",
    why: [
      "The sentence gives a fact, a number, an example or an expert's words that back up a reason.",
      "这个句子给出支持理由的事实、数字、例子或专家的话。",
    ],
    not: ["This sentence gives no specific fact, number or example.", "这个句子没有给出具体的事实、数字或例子。"],
  },
  "a counterclaim": {
    zh: "反方观点",
    why: [
      "The sentence tells what people on the other side think, often after *some people say* or *critics argue*.",
      "这个句子说出对方的想法，常跟在 *some people say* 或 *critics argue* 之后。",
    ],
    not: ["This sentence does not tell what the other side thinks.", "这个句子没有说出对方的想法。"],
  },
};

const tracingArgument = topic("reading", {
  id: "tracing-an-argument",
  title: ["Tracing an Argument", "梳理论证"],
  summary: [
    "An argument has a claim, reasons that back it, evidence for each reason and often a counterclaim; tracing it means finding each part and seeing how they connect.",
    "论证包括主张、支持主张的理由、每个理由的证据，常常还有反方观点；梳理论证就是找出每个部分并看清它们的联系。",
  ],
  after: ["authors-purpose", "matching-points-and-evidence"],
  points: [
    label(
      "the-part-of-the-argument",
      ["The Part of the Argument", "论证的组成部分"],
      [
        "An argument is built in layers. **The claim** is the writer's position (*Our school should plant a garden*). **A reason** says why in general (*A garden teaches science*). **Evidence** backs a reason with a fact, number, example or expert (*At Oak School, test scores rose after the garden opened*). **A counterclaim** tells the other side (*Some people say a garden costs too much*). Name the job of each sentence to trace the argument.",
        "论证是分层构建的。**主张**是作者的立场（*Our school should plant a garden*）。**理由**概括地说明为什么（*A garden teaches science*）。**证据**用事实、数字、例子或专家意见支持理由（*At Oak School, test scores rose after the garden opened*）。**反方观点**说出对方的看法（*Some people say a garden costs too much*）。说出每个句子的作用，就能梳理论证。",
      ],
      ["What part of the argument is this sentence?", "这个句子是论证的哪个部分？"],
      `
        Our town should build a skate park.|the claim
        A skate park would give teenagers a safe place to spend time.|a reason
        In Riverton, police calls about teenagers fell by a third after a skate park opened.|evidence
        Some people argue that a skate park would be too noisy for neighbors.|a counterclaim
        Students should be allowed to use phones at lunch.|the claim
        Phones let students contact their families in an emergency.|a reason
        In a survey, 70 percent of parents said they wanted to reach their children during the day.|evidence
        Critics say phones would stop students from talking to each other.|a counterclaim
        The city should plant more trees on its streets.|the claim
        Trees keep streets cooler in summer.|a reason
        A study found that tree-lined streets were up to five degrees cooler than bare ones.|evidence
        Some people worry that tree roots damage sidewalks.|a counterclaim
        Every school should teach students to cook.|the claim
        Cooking teaches students to make healthy choices.|a reason
        Students in a cooking program ate twice as many vegetables, according to the school nurse.|evidence
        Others say that cooking should be taught at home, not at school.|a counterclaim
        Our library should be open on Sundays.|the claim
        Many families have time to visit only on weekends.|a reason
        Last year, Saturday was the library's busiest day, with 600 visitors.|evidence
        Some argue that opening on Sundays would cost too much in staff pay.|a counterclaim
        The school day should start an hour later.|the claim
        Teenagers need more sleep to learn well.|a reason
        Doctors recommend that teenagers sleep eight to ten hours a night.|evidence
        Opponents say a later start would make it harder for parents to get to work.|a counterclaim
        Zoos do important work and should be supported.|the claim
        Zoos help save animals that are close to dying out.|a reason
        The California condor survived because zoos bred them and released them into the wild.|evidence
        Many people believe animals should never be kept in cages.|a counterclaim
        Our town needs a weekly farmers market.|the claim
        A market would help local farmers earn more.|a reason
      `,
      argumentLabels,
    ),
    choose(
      "the-reason-this-evidence-supports",
      ["The Reason This Evidence Supports", "这条证据支持哪个理由"],
      [
        "In a strong argument, each piece of evidence backs one particular reason. To trace the argument, match the evidence to the reason it proves. Ask: if this fact is true, which reason does it make more believable? Evidence about money supports a reason about cost; evidence about health supports a reason about health.",
        "在有力的论证中，每条证据都支持一个特定的理由。要梳理论证，就把证据和它所证明的理由对应起来。问一问：如果这个事实是真的，它会让哪个理由更可信？关于钱的证据支持关于花费的理由；关于健康的证据支持关于健康的理由。",
      ],
      ["Which reason does this evidence support?", "这条证据支持哪个理由？"],
      `
        Claim: The school should have a garden. Evidence: Students who worked in the garden scored higher on science tests.|A garden helps students learn science.|A garden makes the school look nicer.|A garden gives students fresh food.
        Claim: The town should build a bike lane. Evidence: Twelve cyclists were hit by cars on Main Street last year.|A bike lane would make cycling safer.|A bike lane would bring more shoppers.|A bike lane would reduce pollution.
        Claim: Students should walk to school. Evidence: Walking to school adds about twenty minutes of exercise a day.|Walking keeps students healthy.|Walking saves families money.|Walking helps students make friends.
        Claim: The city should keep its library open. Evidence: The library lends 3,000 books a week to people who cannot buy them.|The library gives everyone access to books.|The library is a beautiful old building.|The library has free meeting rooms.
        Claim: The school should serve breakfast. Evidence: Teachers reported that hungry students had trouble focusing in morning classes.|Breakfast helps students concentrate.|Breakfast saves parents time.|Breakfast brings in money for the school.
        Claim: Our town should plant more trees. Evidence: Trees on one street lowered summer temperatures by four degrees.|Trees keep the town cooler.|Trees give birds a home.|Trees make streets look prettier.
        Claim: The town needs a recycling center. Evidence: The town's landfill will be full in five years.|Recycling would reduce the amount of trash.|Recycling teaches children good habits.|Recycling creates new jobs.
        Claim: Schools should teach a second language. Evidence: Bilingual workers earn more in many jobs, a study found.|A second language helps students find good jobs.|A second language helps students travel.|A second language is fun to learn.
        Claim: Our park needs more lights. Evidence: Most of the park's thefts last year happened after dark.|More lights would make the park safer.|More lights would let people play sports at night.|More lights would make the park prettier.
        Claim: Students should have longer recess. Evidence: Teachers counted fewer fights in class on days with longer recess.|Recess helps students behave well.|Recess gives students fresh air.|Recess lets students play games.
        Claim: The city should build a swimming pool. Evidence: Many local children have never learned to swim, and two nearly drowned last summer.|A pool would help children learn to swim safely.|A pool would bring visitors to the city.|A pool would give teenagers summer jobs.
        Claim: The town should ban plastic bags. Evidence: Volunteers pulled 400 plastic bags from the river in one day.|Plastic bags pollute the river.|Plastic bags cost shops money.|Plastic bags break easily.
        Claim: The school needs a new gym. Evidence: The old gym's roof leaked during six games this year.|The old gym is in poor condition.|A new gym would bring in more fans.|A new gym would help the team win.
        Claim: Families should eat dinner together. Evidence: Children who eat with their families often get better grades, researchers found.|Family dinners help children do well in school.|Family dinners save money.|Family dinners are easier to cook.
        Claim: The city should improve its buses. Evidence: Half the city's workers say they are late because buses do not come on time.|Better buses would help people get to work on time.|Better buses would reduce pollution.|Better buses would look more modern.
        Claim: The school should start a music program. Evidence: Students in music programs improved their memory in a study.|Music helps students' minds.|Music makes school events more fun.|Music gives students a hobby.
        Claim: Our town needs a dog park. Evidence: Residents filed 80 complaints about dogs off leash on playgrounds this year.|A dog park would keep dogs off the playgrounds.|A dog park would help owners meet each other.|A dog park would bring in visitors.
        Claim: Students should wear helmets when cycling. Evidence: Helmets cut the risk of serious head injury by more than half.|Helmets protect students from head injuries.|Helmets keep students warm.|Helmets make bikes easier to ride.
        Claim: The school should plant a vegetable garden. Evidence: The cafeteria could save 1,000 dollars a year by using its own vegetables.|A garden would save the school money.|A garden would teach science.|A garden would make the yard prettier.
        Claim: The town should protect the old forest. Evidence: The forest is home to three kinds of rare owls.|The forest protects rare wildlife.|The forest is good for hiking.|The forest provides wood.
        Claim: Schools should give less homework. Evidence: A survey found students with heavy homework slept an hour less on average.|Less homework would let students get enough sleep.|Less homework would give teachers more free time.|Less homework would save paper.
        Claim: The town should repair the old bridge. Evidence: Engineers found deep cracks in two of the bridge's main supports.|The bridge is unsafe as it is.|A new bridge would cost too much.|The bridge is a local landmark.
        Claim: Students should learn first aid. Evidence: In one city, students trained in first aid helped save six lives in a year.|First aid training can save lives.|First aid is an interesting subject.|First aid looks good on a résumé.
        Claim: The city should build more parks. Evidence: People who live near parks report less stress, a health study found.|Parks improve people's health.|Parks make the city look greener.|Parks raise house prices.
        Claim: The school should have a quiet room. Evidence: Students who used a quiet room for ten minutes returned calmer and more focused.|A quiet room helps students calm down and focus.|A quiet room would be cheap to build.|A quiet room would give teachers a break.
        Claim: The town should add a crosswalk at the school. Evidence: Three students were nearly hit crossing the street there last month.|A crosswalk would keep students safe.|A crosswalk would slow down all traffic.|A crosswalk would look nice.
        Claim: The school should buy more computers. Evidence: Forty students share one computer lab of ten machines.|There are not enough computers for students.|Computers make learning more fun.|New computers are faster.
        Claim: Our city should clean up the river. Evidence: The river's fish population has fallen by half in ten years.|Pollution is harming the river's wildlife.|A clean river would attract tourists.|A clean river would be good for boating.
        Claim: The library should add an evening study hour. Evidence: Many students have no quiet place to study at home.|Students need a quiet place to study.|The library is empty in the evening.|An evening hour would bring in new readers.
        Claim: Students should learn to cook. Evidence: Teens who can cook eat more fruit and vegetables, a study showed.|Cooking helps students eat more healthily.|Cooking is a fun hobby.|Cooking saves time.
      `,
      (right) => [
        `The evidence backs this reason: **${right}** If the fact is true, it makes this reason more believable than the others.`,
        `这条证据支持这个理由：**${right}** 如果事实属实，它会让这个理由比其他理由更可信。`,
      ],
      [
        [
          "*{wrong}* may also be a reason for the claim, but this evidence says nothing about it.",
          "*{wrong}* 也许也是支持主张的理由，但这条证据与它无关。",
        ],
        ["*{wrong}* is about a different point; the evidence would not prove it.", "*{wrong}* 说的是另一个要点，这条证据证明不了它。"],
      ],
    ),
  ],
});

const pointOfView = topic("reading", {
  id: "inferring-an-authors-point-of-view",
  title: ["The Author's Point of View", "作者的观点"],
  summary: [
    "An author's point of view, the way they think and feel about a subject, shows in the facts they choose, the words they use and how they describe other views.",
    "作者的观点，即他们对一个题材的想法和感受，体现在他们选择的事实、使用的词语以及他们如何描述其他观点上。",
  ],
  after: ["authors-purpose"],
  points: [
    choose(
      "the-authors-point-of-view",
      ["The Author's Point of View", "作者的观点"],
      [
        "An author does not always say *I think*. You can infer their **point of view** from their choices: the facts they include and leave out, words with a strong feeling (*brave*, *reckless*, *wasteful*), and how they describe people who disagree. Read the whole passage, then choose the view that all these choices point to.",
        "作者并不总是说 *I think*。你可以从他们的选择中推断出他们的**观点**：他们写进了哪些事实、省略了哪些，带有强烈感情的词（*brave*、*reckless*、*wasteful*），以及他们如何描述持不同意见的人。读完整段文字，然后选出所有这些选择共同指向的观点。",
      ],
      ["What is the author's point of view?", "作者的观点是什么？"],
      `
        The new mall swallowed the old meadow where children once played. Now, instead of birdsong, we hear the roar of delivery trucks.|The author regrets that the mall was built.|The author is glad the mall gives people jobs.|The author thinks malls and meadows are equal.
        For just ten dollars a year, the library opens a world of books, films and classes to every child in town.|The author thinks the library is a great value.|The author thinks the library should charge more.|The author thinks few people use the library.
        Some still cling to the old idea that girls cannot be good at science, but the facts have proved them wrong again and again.|The author believes girls are as able in science as boys.|The author believes science is too hard for most students.|The author has no opinion about girls in science.
        The brave volunteers worked through the night, pulling strangers from the flooded houses.|The author admires the volunteers.|The author thinks the volunteers were careless.|The author thinks the flood was not serious.
        The city wasted millions on a stadium that sits empty most of the year.|The author thinks the stadium was a bad use of money.|The author is proud of the new stadium.|The author wants more stadiums built.
        Zoos give us a rare chance to see animals up close, and their scientists help save species from vanishing.|The author supports zoos.|The author wants zoos closed.|The author is unsure what zoos do.
        A few critics complain about the noise, but the festival brings joy and money to the whole town every summer.|The author supports the festival.|The author agrees the festival is too noisy.|The author thinks the festival should move.
        Endless hours on screens are stealing our children's childhood.|The author worries that children spend too much time on screens.|The author thinks screens help children learn.|The author thinks children should have more screen time.
        The old bridge, built by hand a century ago, is a treasure we must protect.|The author wants to save the old bridge.|The author wants the bridge torn down.|The author does not care about the bridge.
        Reckless drivers race down our street every morning, and no one does anything to stop them.|The author is angry about dangerous driving on the street.|The author enjoys watching the cars.|The author thinks the street is safe.
        Uniforms take away a student's chance to show who they are.|The author opposes school uniforms.|The author supports school uniforms.|The author thinks uniforms are cheap.
        Thanks to the new bus line, thousands of workers now reach their jobs in half the time.|The author thinks the bus line is a success.|The author thinks the bus line failed.|The author wants the bus line removed.
        Hunting whales for profit is a cruel practice that belongs in the past.|The author is against whale hunting.|The author supports whale hunting.|The author thinks whales are dangerous.
        Homework teaches responsibility, and students who skip it fall behind.|The author values homework.|The author thinks homework should be banned.|The author thinks homework is a waste.
        Instead of fixing the potholes, the council spent the budget on a statue of the mayor.|The author disapproves of the council's spending.|The author admires the new statue.|The author thinks potholes are not a problem.
        Every summer, the clean-up crew turns our littered beach into a place families can enjoy again.|The author appreciates the clean-up crew.|The author thinks the beach should be closed.|The author thinks litter is not a problem.
        Some say video games are a waste of time, but many games teach problem solving and teamwork.|The author believes video games can be valuable.|The author thinks video games should be banned.|The author agrees games are a waste.
        The factory poisoned our river for twenty years, and its owners still refuse to pay for the damage.|The author blames the factory owners.|The author defends the factory.|The author thinks the river is clean.
        With patience and care, the old farmer turned a dusty field into a garden that feeds half the village.|The author admires the farmer.|The author thinks the field was wasted.|The author thinks gardens are useless.
        A four-day school week would give students time to rest, explore and come back ready to learn.|The author supports a four-day school week.|The author opposes a shorter school week.|The author has no view on the school week.
        The plan to cut down the forest for a parking lot is short-sighted and foolish.|The author opposes the parking lot plan.|The author supports the parking lot plan.|The author thinks forests are a nuisance.
        Electric cars are quiet, clean and cheaper to run every year.|The author favors electric cars.|The author dislikes electric cars.|The author thinks electric cars are noisy.
        The coach ignored the rules and put winning above his players' safety.|The author criticizes the coach.|The author praises the coach.|The author thinks the rules are unfair.
        Our grandparents' stories are a gift we must record before they are lost.|The author values recording older people's stories.|The author thinks old stories are boring.|The author thinks stories should be forgotten.
        Despite the critics' gloomy warnings, the new park has become the heart of the neighborhood.|The author thinks the park is a success.|The author agrees with the critics.|The author wants the park closed.
        Fast food is cheap and quick, but it quietly harms our health over many years.|The author is concerned about fast food's effects on health.|The author recommends fast food.|The author thinks fast food is healthy.
        Rather than punishing students, the school should help them learn from mistakes.|The author favors helping over punishing.|The author wants stricter punishments.|The author thinks mistakes do not matter.
        The museum's free days let families who could never afford a ticket stand before great art.|The author supports the museum's free days.|The author thinks the museum should charge everyone.|The author thinks art is unimportant.
        The new rule forcing students to stay inside at lunch is unfair and unnecessary.|The author opposes the new lunch rule.|The author supports the new lunch rule.|The author thinks students prefer staying inside.
        Volunteers, not the government, saved the old theater, and the town should thank them.|The author praises the volunteers.|The author praises the government.|The author thinks the theater should close.
      `,
      (right) => [
        `**${right}** The words with strong feeling and the facts the author chose all point to this view.`,
        `**${right}** 带有强烈感情的词和作者选择的事实都指向这个观点。`,
      ],
      [
        ["*{wrong}* is the opposite of what the author's word choices show.", "*{wrong}* 与作者的用词所表现的正好相反。"],
        ["*{wrong}* misses the strong feeling that the author's words carry.", "*{wrong}* 忽略了作者用词中带有的强烈感情。"],
      ],
    ),
    label(
      "the-clue-to-the-view",
      ["The Clue to the View", "体现观点的线索"],
      [
        "Three kinds of clue reveal an author's view. **Loaded words** carry a feeling (*wasteful*, *heroic*). **Chosen facts** include only what supports one side. **How others are described** shows it too: an author may call those who disagree *a few critics* or say they *cling to old ideas*. Name the clue in the words in italics.",
        "有三种线索可以揭示作者的观点。**带感情色彩的词**带有感受（*wasteful*、*heroic*）。**挑选的事实**只包括支持一方的内容。**对他人的描述**也能体现观点：作者可能称持不同意见的人为 *a few critics*，或者说他们 *cling to old ideas*。说出斜体部分属于哪种线索。",
      ],
      ["What kind of clue is the part in italics?", "斜体部分是哪种线索？"],
      `
        The city *wasted* millions on the stadium.|loaded words
        *A few critics* complain about the noise.|how others are described
        The new bus line *cut travel times in half for thousands of workers*.|chosen facts
        The *brave* volunteers worked through the night.|loaded words
        Some still *cling to the old idea* that girls cannot do science.|how others are described
        The library *lends 3,000 books a week to people who cannot buy them*.|chosen facts
        *Reckless* drivers race down our street.|loaded words
        *Only people who never visit parks* oppose the new one.|how others are described
        The factory *dumped waste into the river for twenty years*.|chosen facts
        The plan is *short-sighted and foolish*.|loaded words
        *Gloomy critics* warned the park would fail.|how others are described
        Electric cars *cost less to run every year*.|chosen facts
        The council's *greedy* decision hurt the town.|loaded words
        *Those who resist change* will complain, as always.|how others are described
        *Police calls fell by a third* after the skate park opened.|chosen facts
        The old bridge is a *treasure*.|loaded words
        *A handful of grumblers* oppose the festival.|how others are described
        Volunteers *pulled 400 plastic bags from the river in one day*.|chosen facts
        Screens are *stealing* our children's childhood.|loaded words
        *People who have never tried it* say cooking class is useless.|how others are described
        *Test scores rose by ten points* after the garden opened.|chosen facts
        The coach's *selfish* choices put players at risk.|loaded words
        *Some confused parents* still believe homework is harmful.|how others are described
        The new park *drew 2,000 visitors on its first weekend*.|chosen facts
        Whale hunting is a *cruel* practice.|loaded words
        *Opponents who have not read the report* call the plan too costly.|how others are described
        *Accidents at the corner fell to zero* after the crossing guard began.|chosen facts
        The *heroic* nurses never left their posts.|loaded words
        *Old-fashioned thinkers* say girls should not play football.|how others are described
        The *dull, gray* new building replaced a beautiful old school.|loaded words
      `,
      {
        "loaded words": {
          zh: "带感情色彩的词",
          why: [
            "The words carry a strong feeling, positive or negative, that shows how the author sees the subject.",
            "这些词带有强烈的正面或负面感情，显示了作者如何看待这个题材。",
          ],
          not: [
            "These words state a fact or describe people; they are not words chosen mainly for their feeling.",
            "这些词陈述事实或描述人，并不是主要因其感情而选用的词。",
          ],
        },
        "chosen facts": {
          zh: "挑选的事实",
          why: ["The author chose to include this fact because it supports one side.", "作者选择写进这个事实，因为它支持某一方。"],
          not: [
            "This is not a fact the author chose to report; it is a feeling or a description of people.",
            "这不是作者选择报告的事实，而是一种感情或对人的描述。",
          ],
        },
        "how others are described": {
          zh: "对他人的描述",
          why: [
            "The author describes people who disagree in a way that makes their view seem weaker.",
            "作者描述持不同意见的人的方式使他们的观点显得更弱。",
          ],
          not: ["This does not describe the people who hold the other view.", "这里没有描述持相反观点的人。"],
        },
      },
    ),
  ],
});

const ruleLabels: Readonly<Record<string, Label>> = {
  required: {
    zh: "必须做",
    why: [
      "The rule says this must be done, with words such as *must*, *shall*, *is required* or *have to*.",
      "规则说这件事必须做，用的是 *must*、*shall*、*is required* 或 *have to* 等词。",
    ],
    not: ["The rule does not say this must be done.", "规则并没有说这件事必须做。"],
  },
  allowed: {
    zh: "可以做",
    why: [
      "The rule says this may be done but does not have to be, with words such as *may*, *can* or *is allowed*.",
      "规则说这件事可以做但不是必须做，用的是 *may*、*can* 或 *is allowed* 等词。",
    ],
    not: ["The rule does not simply allow this; it either requires or forbids it.", "规则并不是简单地允许这件事，而是要求或禁止它。"],
  },
  "not allowed": {
    zh: "不允许",
    why: [
      "The rule forbids this, with words such as *must not*, *may not*, *no* or *is not permitted*.",
      "规则禁止这件事，用的是 *must not*、*may not*、*no* 或 *is not permitted* 等词。",
    ],
    not: ["The rule does not forbid this.", "规则并没有禁止这件事。"],
  },
};

const rulesInstructions = topic("reading", {
  id: "reading-rules-and-instructions",
  title: ["Reading Rules and Instructions", "阅读规则和说明"],
  summary: [
    "Rules say what must, may and must not be done, often with conditions and exceptions; reading them carefully means applying each part to the case.",
    "规则说明什么必须做、可以做、不可以做，常常附有条件和例外；仔细阅读就是把每一部分应用到具体情况中。",
  ],
  after: ["sequence-in-texts"],
  points: [
    label(
      "must-may-or-must-not",
      ["Must, May or Must Not", "必须、可以还是不可以"],
      [
        "Rules use small words with big meanings. *Must*, *shall* and *is required* mean something is **required**. *May*, *can* and *is allowed* mean it is **allowed** but not required. *Must not*, *may not*, *no* and *is not permitted* mean it is **not allowed**. Read the rule, then decide what it says about the action given.",
        "规则用简短的词表达重要的意思。*Must*、*shall* 和 *is required* 表示**必须做**。*May*、*can* 和 *is allowed* 表示**可以做**但不是必须。*Must not*、*may not*、*no* 和 *is not permitted* 表示**不允许**。读规则，然后判断它对给出的行为是怎么规定的。",
      ],
      ["According to the rule, the action is:", "根据规则，这个行为是："],
      `
        Rule: Players must wear shin guards during every game. Action: wearing shin guards in a game|required
        Rule: Players may bring their own water bottles. Action: bringing a water bottle|allowed
        Rule: Players must not touch the ball with their hands. Action: touching the ball with a hand|not allowed
        Rule: Swimmers shall shower before entering the pool. Action: showering before swimming|required
        Rule: Swimmers can use the diving board when a lifeguard is present. Action: using the diving board with a lifeguard there|allowed
        Rule: No running is permitted on the pool deck. Action: running on the pool deck|not allowed
        Rule: Visitors are required to sign in at the front desk. Action: signing in at the desk|required
        Rule: Visitors may take photographs in the main hall. Action: taking a photo in the main hall|allowed
        Rule: Food and drink are not permitted in the galleries. Action: eating in a gallery|not allowed
        Rule: All campers must wear a life jacket in the canoes. Action: wearing a life jacket in a canoe|required
        Rule: Campers are allowed to bring one small toy from home. Action: bringing a small toy|allowed
        Rule: Campers may not leave the camp without a counselor. Action: leaving camp alone|not allowed
        Rule: Each team must have five players on the court. Action: having five players on the court|required
        Rule: A team can call two time-outs in each half. Action: calling a time-out in the first half|allowed
        Rule: Players may not wear jewelry during a game. Action: wearing a necklace in a game|not allowed
        Rule: Students must return library books within three weeks. Action: returning a book within three weeks|required
        Rule: Students may borrow up to five books at a time. Action: borrowing four books|allowed
        Rule: No phones may be used in the reading room. Action: using a phone in the reading room|not allowed
        Rule: Riders are required to wear a helmet on the trail. Action: wearing a helmet on the trail|required
        Rule: Riders can stop at the rest areas along the trail. Action: stopping at a rest area|allowed
        Rule: Riders must not leave the marked path. Action: riding off the marked path|not allowed
        Rule: Contestants shall submit their entries by June 1. Action: submitting an entry by June 1|required
        Rule: Contestants may enter up to two drawings. Action: entering two drawings|allowed
        Rule: Entries must not have been shown in another contest. Action: entering a drawing shown in another contest|not allowed
        Rule: Hikers must carry water on the long trail. Action: carrying water on the long trail|required
        Rule: Dogs are allowed on the trail if they are on a leash. Action: bringing a leashed dog|allowed
        Rule: Fires are not permitted anywhere in the park. Action: lighting a campfire in the park|not allowed
        Rule: Runners must stay in their own lane for the first 100 meters. Action: staying in one's lane at the start|required
        Rule: Runners can wear any color of shoes. Action: wearing red shoes|allowed
        Rule: Runners may not push another runner. Action: pushing another runner|not allowed
      `,
      ruleLabels,
    ),
    choose(
      "applying-a-rule-and-its-exception",
      ["Applying a Rule and Its Exception", "应用规则及其例外"],
      [
        "Many rules have **conditions** (*if*, *when*, *only*) and **exceptions** (*unless*, *except*, *but*). To apply a rule to a case, first read the main rule, then check whether the condition is met or the exception applies. A case that fits the exception gets a different answer from the main rule.",
        "许多规则有**条件**（*if*、*when*、*only*）和**例外**（*unless*、*except*、*but*）。要把规则应用到具体情况，先读主要规则，再检查条件是否满足、例外是否适用。符合例外的情况，答案与主要规则不同。",
      ],
      ["What does the rule say about this case?", "规则对这种情况是怎么规定的？"],
      `
        Rule: Students must wear uniforms, except on Fridays. Case: It is Friday, and Ana wears jeans.|Ana is following the rule.|Ana is breaking the rule.|Ana must change into her uniform.
        Rule: The pool is open to children under 12 only when an adult is with them. Case: Ben, age 10, comes alone.|Ben may not swim.|Ben may swim.|Ben may swim in the shallow end only.
        Rule: Library books are due in three weeks unless another reader has asked for them. Case: No one has asked for Mia's book.|Mia has three weeks.|Mia must return it at once.|Mia can keep it forever.
        Rule: Players may not use their hands, except the goalkeeper inside the penalty area. Case: The goalkeeper catches the ball inside the area.|The catch is allowed.|The catch is a foul.|The goalkeeper must kick it.
        Rule: Phones must be off in class unless the teacher asks students to use them. Case: The teacher asks the class to look something up.|Students may use their phones.|Students must keep their phones off.|Only the teacher may use a phone.
        Rule: Visitors may enter the gallery free on Sundays; on other days, tickets cost five dollars. Case: Leo visits on a Tuesday.|Leo must pay five dollars.|Leo may enter free.|Leo may not enter.
        Rule: Students may leave the school at lunch only if they are in eighth grade. Case: Omar is in sixth grade.|Omar may not leave at lunch.|Omar may leave at lunch.|Omar may leave if he hurries.
        Rule: Dogs are not allowed in the park, except guide dogs. Case: A woman brings her guide dog.|The guide dog is allowed.|The guide dog is not allowed.|The dog must wait outside.
        Rule: The bus leaves at 8:00, unless it snows, when it leaves at 8:30. Case: It is snowing.|The bus leaves at 8:30.|The bus leaves at 8:00.|The bus does not run.
        Rule: Homework handed in late loses points, unless a student was sick. Case: Raj was sick and hands it in late.|Raj does not lose points.|Raj loses points.|Raj gets extra points.
        Rule: Campers must be in their tents by 9:00, except on the last night, when they may stay up until 10:00. Case: It is the last night, and it is 9:30.|Campers may still be up.|Campers must be in their tents.|Campers must stay up all night.
        Rule: Riders under 120 cm may ride only if an adult rides with them. Case: Kim is 110 cm and rides with her father.|Kim may ride.|Kim may not ride.|Kim may ride alone.
        Rule: Snacks are allowed in the classroom only if they have no nuts. Case: Sam brings a peanut bar.|Sam's snack is not allowed.|Sam's snack is allowed.|Sam may eat it at recess in class.
        Rule: Players must sit out the next game after a red card, unless the card is cancelled on appeal. Case: Eva's red card was cancelled.|Eva may play the next game.|Eva must sit out.|Eva must sit out two games.
        Rule: The museum is closed on Mondays, except on public holidays. Case: Monday is a public holiday.|The museum is open.|The museum is closed.|The museum opens only in the afternoon.
        Rule: Students may use calculators on the test, but not on the first part. Case: Lucy uses a calculator on the first part.|Lucy is breaking the rule.|Lucy is following the rule.|Lucy may use it anywhere.
        Rule: Bikes must be locked in the rack; bikes left elsewhere will be removed. Case: Tom leaves his bike by the door.|Tom's bike may be removed.|Tom's bike is safe there.|Tom has followed the rule.
        Rule: Voters must be 18 or older, except in school elections, where all students vote. Case: A twelve-year-old votes in the school election.|The student may vote.|The student may not vote.|The student must wait until 18.
        Rule: The beach is closed to swimmers when the red flag flies. Case: The red flag is flying.|Swimming is not allowed.|Swimming is allowed.|Only strong swimmers may swim.
        Rule: Members may bring a guest, but only on weekends. Case: Ella brings a friend on a Wednesday.|Ella may not bring her friend.|Ella may bring her friend.|Ella may bring two friends.
        Rule: All entries must be the student's own work; help from a teacher is allowed only with spelling. Case: A teacher fixes Noah's spelling.|The entry is still allowed.|The entry is not allowed.|Noah must start again.
        Rule: The test must be taken on paper unless a student has a doctor's note. Case: Ava has a doctor's note.|Ava may take it another way.|Ava must take it on paper.|Ava may skip the test.
        Rule: Children may play on the field after school only when a coach is present. Case: No coach is present.|The children may not play.|The children may play.|The children may play for ten minutes.
        Rule: Water bottles are allowed at the concert if they are empty when you enter. Case: Max brings a full bottle.|Max's bottle is not allowed.|Max's bottle is allowed.|Max may bring two bottles.
        Rule: Players must be at least ten to join, unless they have an older sibling on the team. Case: Lily is nine, and her brother is on the team.|Lily may join.|Lily may not join.|Lily may join next year only.
        Rule: The school gate closes at 4:00, except on concert nights. Case: It is a concert night.|The gate stays open later.|The gate closes at 4:00.|The gate is closed all day.
        Rule: Free lunch is given to students who bring a signed form. Case: Jake forgets his form.|Jake does not get a free lunch that day.|Jake gets a free lunch.|Jake gets two lunches.
        Rule: Students may choose any book for the report, as long as it has more than 100 pages. Case: Zoe chooses a book of 80 pages.|Zoe's choice is not allowed.|Zoe's choice is allowed.|Zoe must choose a longer book next year.
        Rule: Late buses run on Tuesdays and Thursdays only. Case: Hana stays after school on Wednesday.|There is no late bus for Hana.|Hana can take the late bus.|Hana must walk on Thursday.
        Rule: The skate park is open until 8 p.m., except in winter, when it closes at 5 p.m. Case: It is winter, and it is 6 p.m.|The skate park is closed.|The skate park is open.|The skate park opens at 6 p.m.
      `,
      (right) => [
        `**${right}** Check the main rule first, then whether its condition is met or its exception applies to this case.`,
        `**${right}** 先看主要规则，再看这种情况是否满足条件，或是否适用例外。`,
      ],
      [
        [
          "*{wrong}* applies the main rule but ignores the condition or exception that fits this case.",
          "*{wrong}* 用了主要规则，却忽略了适用于这种情况的条件或例外。",
        ],
        ["*{wrong}* adds something the rule does not say.", "*{wrong}* 加上了规则中没有说的内容。"],
      ],
    ),
  ],
});

const wordChoice = topic("reading", {
  id: "word-choice-and-meaning",
  title: ["Word Choice and Meaning", "用词与意义"],
  summary: [
    "An author's choice of one word over another shapes meaning and tone: crept or strode, stubborn or determined, old or ancient.",
    "作者选择这个词而不是那个词，会影响意义和语气：crept 还是 strode，stubborn 还是 determined，old 还是 ancient。",
  ],
  after: ["connotation-and-precise-words"],
  points: [
    choose(
      "what-the-word-suggests",
      ["What the Word Suggests", "这个词暗示了什么"],
      [
        "Words with nearly the same meaning can suggest very different things. *She strode into the room* suggests confidence; *she crept into the room* suggests fear or secrecy. When an author picks one word, ask what feeling or picture it adds beyond its dictionary meaning.",
        "意思相近的词可以暗示截然不同的东西。*She strode into the room* 暗示自信；*she crept into the room* 暗示害怕或偷偷摸摸。作者选用一个词时，要问它在词典意义之外增加了什么感受或画面。",
      ],
      ["What does the word in italics suggest?", "斜体的词暗示了什么？"],
      rival(
        `
        Mara *strode* onto the stage.|She felt confident.|She felt afraid.|She felt tired.
        Ben *crept* down the dark hallway.|He was trying not to be heard.|He was in a great hurry.|He was showing off.
        The old man *snapped* at the children.|He spoke angrily.|He spoke kindly.|He spoke quietly.
        The puppy *bounded* across the yard.|It was full of energy and joy.|It was sick and weak.|It was scared.
        She *whispered* the answer.|She did not want others to hear.|She was shouting with excitement.|She did not know the answer.
        The *ancient* oak stood by the road.|The tree was very old and grand.|The tree was dying and ugly.|The tree had just been planted.
        The soldiers *trudged* through the mud.|They were tired and walking slowly.|They were running happily.|They were dancing.
        He *devoured* his dinner.|He ate hungrily and fast.|He ate slowly and carefully.|He did not eat at all.
        The girl was *stubborn* about her plan.|She refused to change it, in an annoying way.|She was gently unsure about it.|She forgot about the plan.
        The girl was *determined* to finish the race.|She would not give up, in an admirable way.|She did not care about the race.|She was too tired to run.
        The house was *cozy*.|It was warm and comfortable.|It was cramped and stuffy.|It was cold and empty.
        The house was *cramped*.|It felt too small and uncomfortable.|It was warm and welcoming.|It was huge and grand.
        The crowd *roared* when the team scored.|They cheered loudly and with excitement.|They were silent.|They booed the team.
        He *gazed* at the stars.|He looked with wonder for a long time.|He glanced quickly.|He ignored the stars.
        The baby *wailed* all night.|She cried loudly and long.|She slept peacefully.|She laughed happily.
        The thief *slithered* through the window.|He moved in a sneaky, snake-like way.|He climbed slowly and openly.|He jumped proudly.
        The meal was *simple*.|It was plain but pleasant.|It was poor and miserable.|It was rich and fancy.
        The meal was *meager*.|There was too little food.|It was a large feast.|It was delicious.
        She *chuckled* at the joke.|She laughed softly.|She laughed wildly.|She did not find it funny.
        The man *glared* at the driver.|He looked at him angrily.|He looked at him kindly.|He looked at him with fear.
        The kitten *pounced* on the toy.|It jumped on it suddenly.|It walked away from it.|It slept beside it.
        The city was *bustling*.|It was busy and full of life.|It was empty and quiet.|It was dirty and dangerous.
        The speech was *dull*.|It was boring.|It was exciting.|It was very short.
        The teacher *praised* the essay.|She spoke well of it.|She criticized it.|She ignored it.
        The shop was *cluttered*.|It was messy and too full.|It was neat and tidy.|It was large and empty.
        The child *clutched* her mother's hand.|She held it tightly, perhaps from fear.|She let go of it.|She waved it.
        The water was *frigid*.|It was extremely cold.|It was pleasantly warm.|It was dirty.
        The boy *swaggered* into the room.|He walked in a proud, showy way.|He walked in shyly.|He limped in.
        The flowers *drooped* in the heat.|They hung down, weak and tired.|They stood tall and bright.|They grew quickly.
        The guests *lingered* after the party.|They stayed longer than needed, not wanting to leave.|They left quickly.|They arrived late.
      `,
        1,
      ),
      (right, shown) => [
        `In *${shown.replace(/\*/g, "")}*, the word chosen suggests this: **${right}**`,
        `在 *${shown.replace(/\*/g, "")}* 中，作者选用的这个词暗示：**${right}**`,
      ],
      [
        ["*{wrong}* is the opposite of the feeling the word carries.", "*{wrong}* 与这个词带有的感受正好相反。"],
        [
          "*{wrong}* does not fit what the word suggests; a different word would be needed for that.",
          "*{wrong}* 不符合这个词的暗示，要表达那个意思需要换一个词。",
        ],
      ],
    ),
    choose(
      "the-word-for-the-tone",
      ["The Word for the Tone", "符合语气的词"],
      [
        "A writer chooses words to give a passage its **tone**, the attitude it shows. For a warm tone, choose words like *cozy*, *gentle* and *glowed*; for a tense tone, *crept*, *shadow* and *trembled*; for an admiring tone, *brave* and *determined*; for a critical one, *reckless* and *stubborn*. Choose the word that keeps the tone the passage aims for.",
        "作者选词来给文段定下**语气**，即它表现出的态度。要营造温暖的语气，就选 *cozy*、*gentle*、*glowed* 之类的词；紧张的语气，选 *crept*、*shadow*、*trembled*；赞赏的语气，选 *brave*、*determined*；批评的语气，选 *reckless*、*stubborn*。要选出能保持文段所追求的语气的词。",
      ],
      ["Which word best fits the tone of the passage?", "哪个词最符合文段的语气？"],
      `
        (warm) The fire ___ in the little kitchen as Grandma hummed.|glowed|blazed dangerously|flickered weakly
        (tense) Something ___ behind the door, and I held my breath.|scratched|sang|giggled
        (admiring) The ___ firefighter carried the child to safety.|brave|reckless|lucky
        (critical) The ___ driver ignored the red light.|reckless|bold|daring
        (peaceful) A ___ breeze moved through the meadow.|gentle|fierce|chilly
        (gloomy) Rain ___ against the dark windows all afternoon.|beat|danced|sparkled
        (joyful) The children ___ out of school for summer.|burst|shuffled|crept
        (admiring) She was ___ to finish the race despite her injury.|determined|stubborn|forced
        (critical) He was too ___ to listen to anyone's advice.|stubborn|determined|confident
        (warm) We sat ___ under one blanket, sharing stories.|snugly|stiffly|uneasily
        (tense) A ___ figure waited at the end of the alley.|shadowy|cheerful|friendly
        (sad) The old dog ___ to its bed and lay down.|limped|raced|pranced
        (excited) The crowd ___ as the rocket lifted off.|cheered|muttered|sighed
        (critical) The council ___ the town's money on a useless statue.|squandered|invested|spent
        (admiring) The scientists' ___ work saved thousands of lives.|tireless|endless|slow
        (peaceful) The lake lay ___ in the morning light.|still|restless|choppy
        (spooky) The house ___ in the wind as we crept closer.|groaned|sang|smiled
        (proud) Maria ___ across the stage to collect her award.|strode|slunk|stumbled
        (warm) The cookies smelled ___ as they came out of the oven.|heavenly|strong|odd
        (lonely) The empty playground looked ___ in the evening.|forlorn|lively|crowded
        (critical) The company ___ the river with its waste.|poisoned|changed|filled
        (playful) The puppy ___ after the ball.|scampered|trudged|crawled
        (serious) The judge ___ the verdict.|announced|chirped|giggled
        (tense) My heart ___ as the footsteps came nearer.|pounded|relaxed|floated
        (admiring) The ___ old bridge has stood for three hundred years.|sturdy|crumbling|old-fashioned
        (gloomy) A ___ fog hung over the town.|heavy|light|sparkling
        (joyful) Her laugh ___ through the house.|rang|crept|leaked
        (critical) The ___ landlord refused to fix the broken heater.|heartless|careful|busy
        (calm) The nurse spoke in a ___ voice.|soothing|sharp|harsh
        (warm) Grandpa gave me a ___ hug at the station.|tender|stiff|quick
      `,
      (right, shown) => [
        `**${right}** keeps the tone named in the brackets: *${shown.replace("___", right)}*`,
        `**${right}** 保持了括号中所说的语气：*${shown.replace("___", right)}*`,
      ],
      [
        ["*{wrong}* gives the passage a different feeling from the tone it aims for.", "*{wrong}* 给文段带来的感受与它所追求的语气不同。"],
        ["*{wrong}* has a similar meaning, but its feeling works against the tone.", "*{wrong}* 意思相近，但它的感情色彩与语气相反。"],
      ],
    ),
  ],
});

/** readingTopics6b are the grade 6 topics of reading arguments, memoirs, characters, rules and word choice. */
export const readingTopics6b: readonly TopicDef[] = [
  supportedClaims,
  memoirOrFiction,
  dynamicStatic,
  tracingArgument,
  pointOfView,
  rulesInstructions,
  wordChoice,
];
