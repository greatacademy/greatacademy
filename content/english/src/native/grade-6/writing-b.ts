// Grade 6: writing skills checked by rule, part two: a consistent style, showing character through action, ending a
// narrative, relevant reasons and hooks for an opening.

import type { TopicDef } from "@ga/content";
import type { ChoiceItem } from "@ga/subject-english";
import { choose, field, type Label, label, rival, rows, topic } from "./kit.ts";

// Formal paragraphs: three formal sentences|the sentence that breaks the style|a formal revision|another informal revision
const styleRows = rows(`
  Cells are the building blocks of life.|Each one has a membrane, a nucleus and cytoplasm.|Basically, cells are like super tiny rooms, you know?|Cells can be compared to tiny rooms, each with its own parts.|Cells are like totally tiny rooms.
  The Sumerians built the first cities.|They dug canals to water their crops.|Honestly, those guys were geniuses.|Their skill at planning was remarkable.|Those dudes were seriously smart.
  Volcanoes form where plates meet or pull apart.|Magma rises through cracks in the crust.|Then, boom, the whole thing blows up!|Pressure builds until the volcano erupts.|Then the thing goes kaboom!
  Earthquakes are measured with seismographs.|A seismograph records how strongly the ground shakes.|It's kind of like a lie detector for the ground, lol.|It works much like a needle recording a heartbeat.|It's sort of a ground lie detector thingy.
  Rome's roads stretched for thousands of kilometers.|They let armies and traders move quickly.|You guys would not believe how straight they were.|Many of them ran almost perfectly straight.|Seriously, you would freak out at how straight they were.
  Nutrition affects how students learn.|Children who eat breakfast concentrate better in class.|Skipping breakfast is a total disaster, trust me.|Students who skip breakfast often find it harder to focus.|Skipping breakfast is super bad news.
  The famine of 1846 struck Ireland hard.|A disease destroyed the potato crop.|It was, like, the worst thing ever.|It caused enormous suffering across the country.|It was a crazy bad time for everybody.
  Referees enforce the rules of a game.|They stop play when a foul is committed.|Sometimes they totally mess up and everybody gets mad.|Sometimes they make mistakes that anger players and fans.|Sometimes they blow it big time.
  Glaciers shape the land as they move.|They carve deep valleys and carry rocks for great distances.|They're basically giant ice bulldozers, which is awesome.|In this way, they act much like slow, enormous bulldozers.|They're ice bulldozers and it's so cool.
  Bees are essential to farming.|They pollinate many of the crops people eat.|Without them, we'd be in big trouble, no joke.|Without bees, the supply of many foods would fall sharply.|Without them, we'd be totally doomed.
  Heredity explains why children resemble their parents.|Genes carry traits from one generation to the next.|So yeah, that's why you look like your mom.|This is why a child may share a parent's eye color.|So that's why you're your mom's twin, haha.
  The printing press changed Europe.|Books became cheaper and more common.|Suddenly everyone was reading like crazy.|As a result, many more people learned to read.|Suddenly reading was the hot new thing.
  The water cycle has no beginning or end.|Water evaporates, condenses into clouds and falls as rain.|Then it does the whole thing all over again, ugh.|The process then repeats without stopping.|Then it just keeps going and going, blah.
  Hammurabi's laws were carved on a stone pillar.|They set out punishments for many crimes.|Some of them were pretty harsh, if you ask me.|Many of the punishments were severe.|Some of them were super mean.
  The Silk Road linked China with the Mediterranean.|Traders exchanged silk, spices and ideas.|It was a big deal for, like, everybody.|It affected the lives of people across two continents.|It mattered a ton to loads of people.
  Plate tectonics explains the shape of the continents.|The plates move a few centimeters each year.|That's slower than your grandma walking, haha.|That is about as fast as fingernails grow.|That's slower than a snail on vacation.
  Athletes need a balanced diet.|Protein helps muscles recover after training.|So eat your eggs, folks!|Foods such as eggs and beans provide this protein.|So chow down on those eggs!
  Many English words come from Latin.|The word "aquarium," for example, comes from *aqua*, meaning water.|Pretty neat, right?|Many other words share this Latin root.|Cool, huh?
  The Nile made life in Egypt possible.|Its yearly flood left rich soil on the fields.|The farmers were stoked about that.|The farmers depended on this soil to grow their crops.|The farmers were super pumped.
  Organic farming avoids chemical pesticides.|Farmers use natural methods to control insects.|It's way better, obviously.|Supporters argue that it is healthier for the soil.|It's obviously the best, duh.
  The marathon is about 42 kilometers long.|It is named after a Greek messenger's run.|That poor guy must have been beat.|According to the legend, the messenger collapsed at the end.|That dude must've been wiped out.
  Food waste is a growing problem.|Nearly a third of all food is thrown away.|That's just nuts.|This waste costs families and farmers billions of dollars.|That's bananas, people.
  The cell membrane controls what enters a cell.|It lets food in and keeps harmful things out.|Kinda like a bouncer at a club.|In this way, it acts much like a guard at a gate.|It's basically a bouncer, lol.
  Tsunamis are caused by undersea earthquakes.|They can travel across whole oceans.|And they are scary as heck.|They can cause terrible destruction when they reach land.|And they're freaky scary.
  Early writing was used to keep records.|Scribes recorded grain, cattle and taxes.|Boring stuff, but whatever.|These records helped officials manage the city.|Snooze-fest stuff, honestly.
  Training improves an athlete's stamina.|Regular running strengthens the heart and lungs.|You'll be zooming around in no time!|Over time, the athlete can run farther without tiring.|You'll be a speed demon in no time!
  The eruption of Vesuvius buried Pompeii.|Ash covered the city in a single day.|Talk about a bad day!|Thousands of people were trapped in the city.|What a rotten day, huh?
  A dialect is a form of a language.|It has its own words and pronunciation.|Like how my cousin says "y'all" all the time.|For example, some speakers in the American South say "y'all."|Like my cousin's "y'all" thing.
  Fair play is part of every sport.|Players must respect the rules and their opponents.|Cheaters are the worst, seriously.|Players who cheat damage the game for everyone.|Cheaters totally stink.
  Crop rotation keeps soil healthy.|Farmers plant different crops in a field each year.|It's a super smart trick.|This practice prevents the soil from losing its nutrients.|It's a genius hack.
`);

const breaksStyle: ChoiceItem[] = styleRows.map((r) => [
  `Which sentence breaks the formal style? (1) ${field(r, 0)} (2) ${field(r, 1)} (3) ${field(r, 2)}`,
  field(r, 2),
  [field(r, 0), field(r, 1)],
]);
// Every other revision keeps a scrap of chat around the formal sentence, which still breaks the style.
const chat = [
  (s: string) => `Basically, ${s[0]?.toLowerCase()}${s.slice(1)}`,
  (s: string) => `${s.slice(0, -1)}, you know?`,
  (s: string) => `${s.slice(0, -1)}, which is pretty cool.`,
];
const keepsStyle: ChoiceItem[] = styleRows.map((r, i) => [
  `${field(r, 0)} ${field(r, 1)} **${field(r, 2)}**`,
  field(r, 3),
  [i % 2 === 0 ? field(r, 4) : (chat[i % 3] ?? chat[0]!)(field(r, 3)), field(r, 2)],
]);

const consistentStyle = topic("writing", {
  id: "keeping-a-consistent-style",
  title: ["Keeping a Consistent Style", "保持一致的文体"],
  summary: [
    "A piece written in a formal style keeps it throughout: no slang, no sudden you guys or totally, no shift from careful prose to chat.",
    "用正式文体写的文章要自始至终保持这种文体：不用俚语，不突然冒出 you guys 或 totally，不从严谨的文字转向聊天。",
  ],
  after: ["formal-style"],
  points: [
    choose(
      "the-sentence-that-breaks-the-style",
      ["The Sentence That Breaks the Style", "破坏文体的句子"],
      [
        "In a report or an explanation, every sentence should sound the same: complete, careful and impersonal. One sentence of chat breaks the style: slang (*those guys*, *awesome*), talking to the reader (*you guys*, *trust me*), filler words (*like*, *basically*, *kind of*), or texting (*lol*). Find the sentence that does not match the rest.",
        "在报告或说明文中，每个句子都应该听起来一样：完整、严谨、客观。一句聊天式的话就会破坏文体：俚语（*those guys*、*awesome*）、对读者说话（*you guys*、*trust me*）、填充词（*like*、*basically*、*kind of*）或网络用语（*lol*）。找出与其他句子不一致的那句。",
      ],
      ["Which sentence breaks the formal style?", "哪个句子破坏了正式文体？"],
      breaksStyle,
      (right) => [
        `*${right}* breaks the style: it uses slang, filler or chat that the other formal sentences avoid.`,
        `*${right}* 破坏了文体：它用了其他正式句子都避免的俚语、填充词或聊天用语。`,
      ],
      [
        [
          "*{wrong}* is formal: complete, careful and impersonal, like the rest of the paragraph.",
          "*{wrong}* 是正式的：完整、严谨、客观，和段落其他部分一致。",
        ],
        ["*{wrong}* keeps the formal style of the paragraph.", "*{wrong}* 保持了段落的正式文体。"],
      ],
    ),
    choose(
      "the-revision-that-keeps-it",
      ["The Revision That Keeps It", "保持文体的修改"],
      [
        "To fix a sentence that breaks the style, keep its **idea** and change its **voice**: take out slang, filler and words to the reader, and say the same thing in careful, exact words. *Honestly, those guys were geniuses* becomes *Their skill at planning was remarkable.* A revision that only swaps one slang word for another is still informal.",
        "要修改破坏文体的句子，就保留它的**意思**、改变它的**语气**：去掉俚语、填充词和对读者说的话，用严谨准确的词语表达同样的意思。*Honestly, those guys were geniuses* 改成 *Their skill at planning was remarkable.* 只是把一个俚语换成另一个俚语的修改仍然是非正式的。",
      ],
      ["Which revision of the sentence in bold keeps the formal style?", "加粗句子的哪个修改保持了正式文体？"],
      keepsStyle,
      (right) => [
        `**${right}** It keeps the idea of the sentence and says it in the same formal voice as the rest.`,
        `**${right}** 它保留了句子的意思，并用与其他部分相同的正式语气来表达。`,
      ],
      [
        [
          "*{wrong}* still has slang or chat in it, so it still breaks the style.",
          "*{wrong}* 里仍然有俚语或聊天用语，所以仍然破坏了文体。",
        ],
        ["*{wrong}* is the sentence as it was, still informal.", "*{wrong}* 就是原来的句子，仍然不正式。"],
      ],
    ),
  ],
});

const showTell: Readonly<Record<string, Label>> = {
  "shows by action": {
    zh: "用行动展示",
    why: [
      "The sentence lets the reader see the trait in what the character does, without naming it.",
      "这个句子通过人物的所作所为让读者看到性格特点，而不直接说出来。",
    ],
    not: ["The sentence does not show the trait through what the character does.", "这个句子没有通过人物的所作所为来展示性格特点。"],
  },
  "shows by speech": {
    zh: "用话语展示",
    why: [
      "The sentence lets the reader hear the trait in the character's own words, without naming it.",
      "这个句子通过人物自己说的话让读者感受到性格特点，而不直接说出来。",
    ],
    not: ["The sentence does not show the trait through the character's own words.", "这个句子没有通过人物自己说的话来展示性格特点。"],
  },
  tells: {
    zh: "告诉",
    why: [
      "The sentence names the trait directly (*was kind*, *felt nervous*) instead of showing it.",
      "这个句子直接说出了性格特点（*was kind*、*felt nervous*），而不是展示它。",
    ],
    not: ["The sentence shows the trait without naming it.", "这个句子展示了性格特点，没有直接说出来。"],
  },
};

const showLines = `
  Lena was very nervous before the recital.|tells
  Lena wiped her damp palms on her skirt for the third time and stared at the piano keys.|shows by action
  Grandpa was a generous man.|tells
  Grandpa slipped a coin into every child's hand before they left, even when his own pockets were nearly empty.|shows by action
  Marcus was lazy about his chores.|tells
  Marcus pushed the dirty dishes to the back of the sink and turned on the television.|shows by action
  My sister was jealous of my new bike.|tells
  My sister glared at my new bike and muttered that hers was faster anyway.|shows by action
  Coach Rivera was strict.|tells
  "Again," Coach Rivera said. "And this time, no walking, no excuses and no complaining."|shows by speech
  The new boy was shy.|tells
  The new boy sat at the edge of the bench and studied his shoes whenever anyone looked his way.|shows by action
  Aunt Mei was very organized.|tells
  Aunt Mei lined up her spice jars in alphabetical order and labeled each one in neat black letters.|shows by action
  Diego was brave.|tells
  Diego stepped in front of the barking dog and spread his arms to shield his little brother.|shows by action
  Ms. Park was a kind teacher.|tells
  Ms. Park knelt beside the crying girl and quietly offered her own lunch.|shows by action
  Tom was angry with his friend.|tells
  Tom slammed his locker so hard that the whole row rattled, and he walked away without a word.|shows by action
  The old woman was lonely.|tells
  Every evening, the old woman set two cups on the table and then put one back in the cupboard.|shows by action
  Priya was proud of her painting.|tells
  Priya stood beside her painting all afternoon, pointing out every brushstroke to anyone who passed.|shows by action
  My brother was curious.|tells
  My brother took the clock apart on the kitchen table, laying each tiny gear in a careful row.|shows by action
  Sam was honest.|tells
  Sam ran back to the shop and handed the cashier the extra ten dollars she had given him.|shows by action
  Ava was tired after the hike.|tells
  Ava dropped her pack at the door and fell asleep on the sofa with her boots still on.|shows by action
  "Take my umbrella," Grandpa said. "I'll be fine, and you have farther to go."|shows by speech
  "Can I see it?" my brother asked. "How does it work? What happens if you open the back?"|shows by speech
  "I broke the vase," Sam told his mother. "It wasn't the cat. It was me."|shows by speech
  "Why does she always get the front seat?" my sister muttered. "It's not fair."|shows by speech
  "Is anyone sitting here?" the new boy asked, so quietly that no one heard him.|shows by speech
  "You can do it," Ms. Park told the crying girl. "Take your time. I'll wait with you."|shows by speech
  "Look at the colors in the sky!" Priya shouted. "Did you see how I painted them?"|shows by speech
`;

// Traits and actions: trait|an action that shows it|an action that shows the opposite|an action that shows another trait
const traitRows = rows(`
  patient|She waited quietly for an hour while her little brother tied his own shoes.|She snatched the laces and tied his shoes herself.|She hummed a song as she walked to school.
  greedy|He stuffed the last three cookies into his pockets before anyone else could reach the plate.|He broke the last cookie in half and gave the bigger piece away.|He asked politely whether he could have a cookie.
  careful|She checked the knot on the rope three times before she began to climb.|She grabbed the rope and climbed without looking.|She laughed as she watched the others climb.
  forgetful|For the third day in a row, he arrived at school without his homework.|He set out his homework by the door every night.|He handed his homework in with a proud smile.
  loyal|She stood by her friend even when the whole class laughed at him.|She joined in the laughter and walked away from him.|She told the teacher what had happened in great detail.
  stubborn|He folded his arms and refused to try the new route, no matter what anyone said.|He shrugged and agreed to try the new route.|He drew a map of the new route in his notebook.
  generous|She gave her umbrella to the old man at the bus stop and walked home in the rain.|She kept her umbrella and hurried past the old man.|She checked the weather on her phone before leaving.
  nervous|His voice shook, and he gripped the edges of his notes as he began his speech.|He strolled to the front and joked with the audience.|He gave his speech in a loud, clear voice.
  curious|She lifted every rock along the stream to see what lived beneath it.|She walked past the stream without a glance.|She complained that her shoes were getting wet.
  rude|He pushed past the woman in line and did not say a word.|He held the door open for the woman in line.|He waited in line, reading a book.
  hardworking|She practiced the same song every evening until her fingers ached.|She skipped practice to watch cartoons.|She told her friends she liked music.
  cheerful|He whistled as he swept the floor and greeted every customer with a grin.|He sighed and grumbled as he swept the floor.|He swept the floor in exactly ten minutes.
  jealous|She frowned when her friend won the prize and said the judges must have made a mistake.|She hugged her friend and cheered when she won the prize.|She asked to see the prize up close.
  honest|He told the teacher that he had broken the window, even though no one had seen him.|He blamed the broken window on another boy.|He helped the janitor sweep up the glass.
  fearful|She stopped at the edge of the dark cave and would not take another step.|She marched into the dark cave, swinging her flashlight.|She sat down at the cave mouth to eat lunch.
  thoughtful|He remembered that his neighbor was ill and left a bowl of soup at her door.|He forgot his neighbor was ill and played loud music all day.|He walked past his neighbor's house on the way to school.
  proud|She held up her trophy for everyone to see and told the story of her win again and again.|She put her trophy away in a drawer and said little about it.|She wiped a smudge off her trophy.
  impatient|He tapped his foot and checked his watch every few seconds while the bus was late.|He sat calmly and read a book while the bus was late.|He bought a ticket for the bus.
  clumsy|She tripped over the rug, knocked over a lamp and spilled her juice, all in one minute.|She walked across the room gracefully, carrying a full tray.|She chose a seat by the window.
  selfish|He took the best seat and the biggest slice of pizza and did not offer to share.|He offered the best seat and the biggest slice to his guest.|He ordered a pizza for the party.
  bossy|She told each of her friends exactly where to stand and what to say in the game.|She asked her friends what they wanted to play.|She played the game with her friends.
  calm|When the fire alarm rang, he quietly led his classmates to the door.|When the fire alarm rang, he screamed and ran in circles.|When the fire alarm rang, he looked at the clock.
  determined|She fell off her bike twelve times and got back on every time.|She fell off her bike once and never rode it again.|She painted her bike bright blue.
  kind|He helped the lost child find her mother in the crowded market.|He laughed at the lost child and walked on.|He bought apples in the crowded market.
  sneaky|She tiptoed into the kitchen and slipped a cookie into her sleeve when no one was looking.|She asked her mother for a cookie in front of everyone.|She baked cookies with her grandmother.
  grateful|He wrote a long thank-you letter to the nurse who had cared for him.|He left the hospital without saying goodbye to the nurse.|He told his friends about the hospital food.
  playful|The puppy rolled onto its back and pawed at the leaves blowing past.|The puppy lay still and ignored the leaves.|The puppy ate its dinner from a bowl.
  confident|She raised her hand first and answered in a clear, steady voice.|She hid behind her book so the teacher would not call on her.|She wrote her answer in pencil.
  messy|His room was buried under clothes, old plates and crumpled papers.|His room was spotless, with every book on its shelf.|His room had a window facing the garden.
  wise|The old woman listened to both sides of the quarrel before she said a word.|The old woman shouted at both sides before hearing them.|The old woman lived at the end of the lane.
`);

const actionForTrait = rival(
  traitRows.map((r): ChoiceItem => [`The trait: **${field(r, 0)}**`, field(r, 1), [field(r, 2), field(r, 3)]]),
  1,
);

const showingCharacter = topic("writing", {
  id: "showing-character-through-action",
  title: ["Showing Character Through Action", "通过行动展现人物"],
  summary: [
    "A narrative shows what a character is like through what they do, say and notice, instead of naming the trait.",
    "叙事文通过人物的所作所为、所说的话和所注意到的东西来展现人物的性格，而不是直接说出性格特点。",
  ],
  after: ["pacing-a-story"],
  points: [
    label(
      "shows-or-tells",
      ["Shows or Tells", "展示还是告诉"],
      [
        "A sentence that **tells** names a trait: *Lena was nervous.* A sentence can **show by action**, letting the reader see it: *Lena wiped her damp palms on her skirt for the third time.* Or it can **show by speech**, letting the reader hear it in the character's words: *\"I can't do this,\" Lena whispered.* Showing gives the reader evidence and lets them reach the conclusion themselves, which makes a character feel real.",
        '**告诉**的句子直接说出性格特点：*Lena was nervous.* 句子可以**用行动展示**，让读者看到：*Lena wiped her damp palms on her skirt for the third time.* 也可以**用话语展示**，让读者从人物的话里听出来：*"I can\'t do this," Lena whispered.* 展示给读者提供证据，让他们自己得出结论，这会让人物显得真实。',
      ],
      ["Does this sentence tell, show by action or show by speech?", "这个句子是告诉、用行动展示，还是用话语展示？"],
      showLines,
      showTell,
    ),
    choose(
      "the-action-that-shows-the-trait",
      ["The Action That Shows the Trait", "展现性格的行动"],
      [
        "To show a trait, choose an action a person with that trait would do, specific enough to picture. *Patient* is shown by waiting calmly for something slow; *greedy* by grabbing more than one's share. An action that shows the opposite trait, or no trait at all, does not do the job.",
        "要展示一种性格特点，就选择具有这种性格的人会做的、具体到能想象出画面的行动。*Patient* 可以通过平静地等待慢吞吞的事来展示；*greedy* 可以通过抢走超过自己那一份的东西来展示。展示相反性格或根本没有展示性格的行动都不行。",
      ],
      ["Which action best shows this trait?", "哪个行动最能展示这个性格特点？"],
      actionForTrait,
      (right, shown) => [
        `**${right}** A reader who sees this action can tell the character is ${shown.replace("The trait: ", "")} without being told.`,
        `**${right}** 读者看到这个行动，不用别人告诉就能知道人物是 ${shown.replace("The trait: ", "")} 的。`,
      ],
      [
        ["*{wrong}* shows the opposite of the trait.", "*{wrong}* 展示的是相反的性格。"],
        ["*{wrong}* shows a different trait, not this one.", "*{wrong}* 展示的是另一种性格，而不是这一种。"],
      ],
    ),
  ],
});

// Story situations: situation|ending that follows and reflects|ending that follows but does not reflect|sudden rescue or dream ending
const endingRows = rows(`
  Maya has practiced her solo for weeks, but she freezes at the concert and forgets the middle part.|Maya takes a breath, finds her place and finishes. Walking home, she realizes that the mistake mattered less than not giving up.|Maya takes a breath, finds her place and finishes the solo.|Suddenly, a famous musician jumps on stage and plays the solo for her.
  Leo breaks his neighbor's window with a baseball and runs away.|Leo knocks on the door and offers to pay with his savings. He learns that owning up feels better than hiding.|Leo knocks on the door and offers to pay with his savings.|Leo wakes up and finds that it was all a dream.
  Ana and her best friend fight about a secret Ana told someone else.|Ana apologizes, and slowly they become friends again. She learns that trust is easy to break and hard to mend.|Ana apologizes, and slowly they become friends again.|A magic fairy appears and makes them forget the fight.
  Sam's team loses the final because he missed an easy pass.|Sam shakes hands with the winners and stays after practice to work on his passing. He sees now that one mistake does not make him a bad player.|Sam shakes hands with the winners and stays after practice to work on his passing.|The referee suddenly decides that Sam's team won after all.
  Kai is lost in the woods as night falls.|Kai follows the stream downhill, as his grandmother taught him, and reaches a road. That night he understands why she made him learn.|Kai follows the stream downhill and reaches a road.|A helicopter appears from nowhere and lifts him out of the forest.
  Priya is afraid to tell her parents she failed a test.|Priya shows them the test, and together they make a study plan. She learns that her parents care more about effort than grades.|Priya shows them the test, and together they make a study plan.|Priya finds out the teacher made a mistake and she got every answer right.
  Omar's family must move to a new city, and he does not want to go.|On his first day, Omar joins the chess club and meets a friend. He realizes that home can be more than one place.|On his first day, Omar joins the chess club and meets a friend.|At the last minute, his parents win the lottery and decide not to move.
  Mia's dog runs away during a storm.|Mia searches all night and finds the dog shivering under the porch next door. She learns how much small things like a gate latch matter.|Mia searches all night and finds the dog shivering under the porch next door.|Mia opens her eyes and the dog is asleep at the foot of her bed; it was a dream.
  Ben copies a friend's homework and is caught.|Ben admits it to the teacher and redoes the work himself. He finds that the work is not as hard as he feared.|Ben admits it to the teacher and redoes the work himself.|The teacher suddenly forgets all about it.
  Lily wants to win the science fair but her volcano will not erupt.|Lily explains to the judges why her volcano failed, and they praise her reasoning. She learns that explaining a failure can be science too.|Lily explains to the judges why her volcano failed, and they praise her reasoning.|A bolt of lightning strikes the volcano and it erupts perfectly.
  Jamal promised to help his grandfather on the farm but wants to go to a party.|Jamal stays on the farm, and his grandfather tells him stories as they work. Jamal decides that some promises are worth keeping.|Jamal stays on the farm and helps his grandfather.|The party is moved to the farm by surprise.
  Ella is scared of the high diving board.|Ella climbs the ladder, counts to three and jumps. Afterward she sees that fear is only the first part of courage.|Ella climbs the ladder, counts to three and jumps.|Ella's swimming teacher gives her a magic potion that removes all fear.
  Tom laughs at a new student's accent, and the student stops coming to lunch.|Tom finds the student in the library and apologizes. He learns how much a careless joke can hurt.|Tom finds the student in the library and apologizes.|The new student turns out to be a prince who forgives everyone.
  Rosa's garden is ruined by a hailstorm the day before the fair.|Rosa enters the one tomato that survived, with a sign about the storm. She learns that the story behind something can matter as much as the prize.|Rosa enters the one tomato that survived, with a sign about the storm.|Overnight, all the plants grow back by magic.
  Noah forgets his lines in the school play.|Noah makes up a line that fits, and the audience never knows. He learns that staying calm can rescue a mistake.|Noah makes up a line that fits, and the audience never knows.|The curtain falls and Noah wakes up in his bed.
  Hana breaks her mother's favorite bowl and hides the pieces.|Hana tells her mother the truth, and they glue the bowl together. Hana sees that the cracks make it more special.|Hana tells her mother the truth, and they glue the bowl together.|The bowl mends itself in the night.
  Zoe is not chosen for the team.|Zoe keeps practicing and joins the team the next season. She learns that being turned down once is not the end.|Zoe keeps practicing and joins the team the next season.|The coach changes his mind for no reason and puts her on the team.
  Raj spends his savings on a toy that breaks in a day.|Raj starts saving again, this time for something he has wanted for months. He understands now why his father says to wait before buying.|Raj starts saving again, this time for something he has wanted for months.|Raj finds a bag of money in the street.
  Grace and her brother argue over who must walk the dog.|They agree to take turns, and walk together on Sundays. Grace realizes that the walks are the best part of her week.|They agree to take turns, and walk together on Sundays.|Their parents buy a robot that walks the dog.
  Leo's best friend moves to another country.|Leo writes him a letter every month, and they plan a visit. He learns that distance does not end a friendship.|Leo writes him a letter every month, and they plan a visit.|His friend's family suddenly decides to move back the next day.
  Ava cheats in a race by cutting across the field.|Ava tells the judge and gives her medal to the runner behind her. She learns that a prize won unfairly is not worth keeping.|Ava tells the judge and gives her medal to the runner behind her.|A storm blows the medal away so no one gets it.
  Owen is too shy to talk to the other children at camp.|On the last night, Owen tells a funny story around the campfire, and everyone laughs. He sees that speaking up was easier than he thought.|On the last night, Owen tells a funny story around the campfire.|A wizard casts a spell that makes Owen popular.
  Chloe's grandmother is ill and cannot come to her recital.|Chloe plays the piece for her grandmother over the phone. She learns that music can travel where people cannot.|Chloe plays the piece for her grandmother over the phone.|Her grandmother is instantly cured and runs into the hall.
  Max refuses to share his new video game with his cousin.|Max finally lets his cousin play, and they discover a level together. He learns that sharing made the game more fun.|Max finally lets his cousin play, and they discover a level together.|The game breaks, so nobody can play it.
  Lucy's class project falls apart the night before it is due.|Lucy and her father rebuild it until midnight. She learns that starting earlier next time is the real lesson.|Lucy and her father rebuild it until midnight.|Elves come in the night and finish the project.
  Daniel blames his little sister for something he did.|Daniel tells his parents the truth and apologizes to his sister. He sees how unfair he had been.|Daniel tells his parents the truth and apologizes to his sister.|His sister turns into a cat, and nobody remembers.
  Emma wants to quit violin after a bad lesson.|Emma keeps going, and in the spring she plays a whole piece without mistakes. She learns that hard weeks pass.|Emma keeps going, and in the spring she plays a whole piece without mistakes.|Emma's violin suddenly starts playing by itself.
  Mila finds a wallet full of money in the park.|Mila takes it to the police station, and the owner thanks her. She learns that doing the right thing can make two people happy.|Mila takes it to the police station, and the owner thanks her.|The wallet vanishes into thin air.
  Jake wants to win the spelling bee but misses the final word.|Jake congratulates the winner and writes the word on his wall. He sees that losing taught him more than winning would have.|Jake congratulates the winner and writes the word on his wall.|The judges discover a mistake and give Jake the trophy instead.
  Sofia is angry that her family cannot afford a holiday.|Sofia and her family camp in the backyard and cook over a fire. She realizes that the best holiday was right at home.|Sofia and her family camp in the backyard and cook over a fire.|A stranger knocks on the door and gives them plane tickets to Paris.
`);

const endingFollows: ChoiceItem[] = endingRows.map((r) => [
  field(r, 0),
  field(r, 2),
  [field(r, 3), "The story stops here, and nobody ever finds out what happened."],
]);
// A cheat that ends with a lesson still cheats: the last sentence of the reflective ending is added to the cheat.
const lesson = (ending: string) => ending.slice(ending.lastIndexOf(". ") + 2);
// Every other ending that only settles the conflict goes on with what happened next, which still says nothing learned.
const next = [
  "The next morning, everyone went back to their usual routines as if nothing had happened.",
  "After that, the family ate dinner together, and then everyone went to bed early.",
  "Later that week, the weather turned cold, and the first snow fell over the town.",
];
const endingReflects: ChoiceItem[] = endingRows.map((r, i) => [
  field(r, 0),
  field(r, 1),
  [i % 2 === 0 ? `${field(r, 2)} ${next[i % 3]}` : field(r, 2), `${field(r, 3)} ${lesson(field(r, 1))}`],
]);

const endingNarrative = topic("writing", {
  id: "ending-a-narrative",
  title: ["Ending a Narrative", "叙事文的结尾"],
  summary: [
    "A good ending follows from the events, settles the conflict and may reflect on what was learned, without a sudden rescue or it was all a dream.",
    '好的结尾顺着事件发展而来，解决冲突，还可以反思学到了什么，而不是突然的营救或"原来是一场梦"。',
  ],
  after: ["planning-a-story-arc"],
  points: [
    choose(
      "the-ending-that-follows",
      ["The Ending That Follows", "顺理成章的结尾"],
      [
        "A good ending **follows from the events**: the main character solves the problem by their own choice or effort, and the conflict is settled. Avoid endings that cheat: a sudden rescue by someone or something new, magic that was never part of the story, *it was all a dream*, or an ending that simply stops.",
        "好的结尾**顺着事件发展而来**：主人公凭自己的选择或努力解决问题，冲突得到解决。要避免作弊式的结尾：突然出现的人或物来营救、故事中从未出现过的魔法、*it was all a dream*，或者干脆戛然而止。",
      ],
      ["Which ending follows best from the events?", "哪个结尾最顺着事件发展而来？"],
      endingFollows,
      (right) => [
        `**${right}** The character settles the conflict by their own choice, so the ending follows from the story.`,
        `**${right}** 人物凭自己的选择解决了冲突，所以这个结尾是顺着故事发展而来的。`,
      ],
      [
        [
          "*{wrong}* cheats: something sudden, magic or a dream solves the problem instead of the character.",
          "*{wrong}* 是作弊式结尾：靠突发事件、魔法或梦境而不是人物自己来解决问题。",
        ],
        ["*{wrong}* leaves the conflict unsettled; the story just stops.", "*{wrong}* 让冲突悬而未决，故事就这样停住了。"],
      ],
    ),
    choose(
      "the-ending-that-looks-back",
      ["The Ending That Looks Back", "带有回顾的结尾"],
      [
        "The strongest endings do two things: they settle the conflict and they **look back**, showing what the character learned or how they changed (*She learns that...*, *He sees now that...*). Of two endings that both follow from the events, choose the one that also tells what the events meant.",
        "最有力的结尾做到两件事：解决冲突，并且**回顾**，表现人物学到了什么或发生了怎样的变化（*She learns that...*、*He sees now that...*）。在两个都顺着事件发展的结尾中，要选出同时说明了事件意义的那个。",
      ],
      ["Which ending settles the conflict and also looks back on it?", "哪个结尾既解决了冲突又回顾了它的意义？"],
      endingReflects,
      (right) => [
        `**${right}** It settles the conflict and then shows what the character learned from it.`,
        `**${right}** 它解决了冲突，又表现了人物从中学到了什么。`,
      ],
      [
        ["*{wrong}* settles the conflict but does not say what the character learned.", "*{wrong}* 解决了冲突，却没有说出人物学到了什么。"],
        [
          "*{wrong}* draws a lesson, but the conflict is settled by a cheat: a sudden rescue, magic or a dream.",
          "*{wrong}* 虽然得出了道理，但冲突是靠作弊解决的：突然的营救、魔法或梦境。",
        ],
      ],
    ),
  ],
});

const reasonLabels: Readonly<Record<string, Label>> = {
  relevant: {
    zh: "相关",
    why: ["The reason shows why the claim is true, so it supports the argument.", "这个理由说明了主张为什么成立，所以能支持论证。"],
    not: ["The reason does not show why this claim is true.", "这个理由没有说明这个主张为什么成立。"],
  },
  "off the point": {
    zh: "离题",
    why: [
      "The reason may be true, but it is about something else; it does not show why the claim is true.",
      "这个理由也许是真的，但说的是别的事，不能说明主张为什么成立。",
    ],
    not: ["The reason is on the point of the claim.", "这个理由切合主张的要点。"],
  },
  "only a feeling": {
    zh: "只是感觉",
    why: [
      "The reason is only the writer's feeling; it gives the reader nothing to check.",
      "这个理由只是作者的感觉，没有给读者任何可以核实的东西。",
    ],
    not: ["The reason is more than a feeling; it gives something a reader can weigh.", "这个理由不只是感觉，它给出了读者可以衡量的东西。"],
  },
};

const reasonLines = `
  Claim: The school should serve more fresh fruit. Reason: Fruit gives students vitamins they need to stay healthy.|relevant
  Claim: The school should serve more fresh fruit. Reason: The cafeteria was painted last summer.|off the point
  Claim: The school should serve more fresh fruit. Reason: I just love apples.|only a feeling
  Claim: Our town should start a farmers market. Reason: Local farmers would earn more by selling directly to people.|relevant
  Claim: Our town should start a farmers market. Reason: Our town has a famous old clock tower.|off the point
  Claim: Our town should start a farmers market. Reason: Markets make me feel happy.|only a feeling
  Claim: The city should ban plastic bags. Reason: Plastic bags kill thousands of sea animals every year.|relevant
  Claim: The city should ban plastic bags. Reason: Paper was invented in China.|off the point
  Claim: The city should ban plastic bags. Reason: I think plastic bags are ugly.|only a feeling
  Claim: Students should learn to cook. Reason: Cooking teaches students to make healthy meals for themselves.|relevant
  Claim: Students should learn to cook. Reason: Many chefs wear tall white hats.|off the point
  Claim: Students should learn to cook. Reason: Cooking class would be so much fun.|only a feeling
  Claim: Our school should have a garden. Reason: A garden would let students study plants up close.|relevant
  Claim: Our school should have a garden. Reason: The principal has a red car.|off the point
  Claim: Our school should have a garden. Reason: Gardens are nice.|only a feeling
  Claim: The town should stop food waste at restaurants. Reason: Leftover food could feed families in need.|relevant
  Claim: The town should stop food waste at restaurants. Reason: Some restaurants play music.|off the point
  Claim: The town should stop food waste at restaurants. Reason: Wasting food makes me sad.|only a feeling
  Claim: Every player should get equal playing time. Reason: Players only improve by playing in real games.|relevant
  Claim: Every player should get equal playing time. Reason: The team's shirts are blue.|off the point
  Claim: Every player should get equal playing time. Reason: It would feel fair to me.|only a feeling
  Claim: The school should buy new library books. Reason: Many of the science books are thirty years out of date.|relevant
  Claim: The school should buy new library books. Reason: The library has big windows.|off the point
  Claim: The school should buy new library books. Reason: I really like new books.|only a feeling
  Claim: Farmers should rotate their crops. Reason: Rotating crops keeps the soil from losing nutrients.|relevant
  Claim: Farmers should rotate their crops. Reason: Tractors are often green.|off the point
  Claim: Farmers should rotate their crops. Reason: It seems like a good idea to me.|only a feeling
  Claim: The city should build more bike lanes. Reason: Bike lanes reduce accidents between cars and cyclists.|relevant
  Claim: The city should build more bike lanes. Reason: The mayor was born in another city.|off the point
  Claim: The city should build more bike lanes. Reason: Riding bikes feels great.|only a feeling
`;

// Claims and reasons: claim|strongest reason|weaker reason, a feeling|weaker reason, off the point
const strongestRows = rows(`
  The school should serve breakfast.|Students who eat breakfast pay more attention in morning classes.|Breakfast is my favorite meal.|The school kitchen has a big oven.
  The town should open a food bank.|Many families in town cannot afford enough food each week.|I think helping is nice.|The town hall is near the river.
  Schools should teach about nutrition.|Students who learn about nutrition choose healthier lunches.|Nutrition sounds interesting to me.|Some teachers bring coffee to class.
  Farms should use fewer pesticides.|Pesticides can wash into rivers and harm fish.|Pesticides smell bad to me.|Farms often have barns.
  The cafeteria should offer vegetarian meals.|Some students do not eat meat for health or religious reasons.|Vegetables taste great to me.|The cafeteria opened in 1998.
  The city should plant fruit trees in parks.|Fruit trees would give free food to anyone who needs it.|Fruit trees are pretty in spring.|The park has a pond.
  Restaurants should donate leftover food.|Donated leftovers could feed hungry people instead of filling landfills.|Donating feels like the right thing.|Some restaurants have outdoor seats.
  The school should have a longer lunch break.|Many students do not have time to finish their meals.|Long lunches would be relaxing.|Lunch comes after math class.
  Our town needs a community garden.|A garden would let families without yards grow their own vegetables.|Gardens make me happy.|Our town has two schools.
  Shops should charge for plastic bags.|Charging for bags has cut bag use by more than half in other cities.|Bags are annoying.|Shops are busy on weekends.
  The school should limit sugary drinks.|Sugary drinks are a major cause of tooth decay in children.|Sugary drinks taste too sweet to me.|Drinks come in many colors.
  Every class should have a fridge for lunches.|Food kept warm all morning can make students sick.|A fridge would be cool to have.|Classrooms have whiteboards.
  The city should support small farms.|Small farms keep money and jobs in the local area.|Small farms seem charming.|The city has a big stadium.
  Families should eat dinner together.|Studies show children who eat with family do better in school.|Family dinners feel cozy.|Dinner is usually at six.
  The school should start a recycling program.|Recycling would cut the school's trash in half.|Recycling makes me feel good.|The school has a gym.
  Students should grow food at school.|Growing food teaches students where their meals come from.|Growing food sounds fun.|The school was built in 1960.
  The town should ban junk food ads near schools.|Ads near schools lead children to buy more junk food.|Junk food ads are annoying.|The town has many bus stops.
  The cafeteria should use local produce.|Local produce is fresher because it travels a shorter distance.|Local food seems better to me.|The cafeteria has round tables.
  Supermarkets should sell imperfect vegetables.|Tons of good vegetables are thrown away only because they look odd.|Funny-shaped carrots make me laugh.|Supermarkets have parking lots.
  Schools should have water fountains on every floor.|Students drink more water when a fountain is close by.|Water fountains are nice.|Schools have stairs.
  The city should help farmers during droughts.|A drought can ruin a farmer's whole year of work.|Droughts are sad.|The city has a museum.
  Our school should teach students to cook healthy meals.|Students who can cook are less likely to rely on fast food.|Cooking smells wonderful.|Our school has a choir.
  The town should build a greenhouse.|A greenhouse would let the town grow vegetables in winter.|Greenhouses look interesting.|The town has a post office.
  Grocery stores should label where food comes from.|Labels help shoppers choose food grown nearby.|Labels look neat.|Grocery stores sell flowers.
  The school should give free fruit at sports practice.|Fruit gives athletes quick energy during training.|Fruit is yummy.|Sports practice is after school.
  Our town should hold a harvest festival.|A festival would bring visitors who spend money at local farms.|Festivals are exciting.|The town has a library.
  The city should protect farmland from new buildings.|Once farmland is paved over, it can never grow food again.|Farmland is beautiful.|The city has tall buildings.
  Students should be taught about food waste.|Students who learn about waste throw away less of their lunch.|Waste is a bad thing.|Students wear backpacks.
  The school should offer cooking clubs.|Clubs give students practice that classes have no time for.|Clubs are cool.|The school bell rings at eight.
  Bakeries should sell day-old bread cheaply.|Cheap day-old bread helps families save money and cuts waste.|Bread smells great.|Bakeries open early.
`);

const strongestReason = rival(
  strongestRows.map((r): ChoiceItem => [`Claim: ${field(r, 0)}`, field(r, 1), [field(r, 2), field(r, 3)]]),
  1,
);

const relevantReasons = topic("writing", {
  id: "choosing-relevant-reasons",
  title: ["Choosing Relevant Reasons", "选择相关的理由"],
  summary: [
    "A reason is relevant when it shows why the claim is true; one that is true but about something else, or only a feeling, weakens the piece.",
    "能说明主张为什么成立的理由才是相关的；虽然真实却说的是别的事，或者只是感觉的理由，会削弱文章。",
  ],
  after: ["ordering-reasons-logically"],
  points: [
    label(
      "relevant-or-not",
      ["Relevant or Not", "相关还是不相关"],
      [
        "A **relevant** reason answers the question *why should the reader agree?* A reason is **off the point** when it may be true but has nothing to do with the claim (*the cafeteria was painted last summer*). A reason is **only a feeling** when it tells what the writer likes or feels (*I just love apples*) and gives the reader nothing to weigh.",
        '**相关**的理由回答"读者为什么应该同意？"。如果理由也许是真的却和主张毫无关系（*the cafeteria was painted last summer*），它就是**离题**的。如果理由只说出作者喜欢什么或感觉如何（*I just love apples*），没有给读者任何可以衡量的东西，它就**只是感觉**。',
      ],
      ["What kind of reason is this?", "这是哪种理由？"],
      reasonLines,
      reasonLabels,
    ),
    choose(
      "the-strongest-reason",
      ["The Strongest Reason", "最有力的理由"],
      [
        "Of several reasons, the strongest shows **why the claim is true** in a way most readers would accept: it points to a benefit, a harm or a fact. Feelings are weak, and reasons about something else are no help at all. Choose the reason a careful reader would find most convincing.",
        "在几个理由中，最有力的是能以大多数读者都接受的方式说明**主张为什么成立**的那个：它指出好处、害处或事实。感觉是薄弱的，而说别的事情的理由毫无帮助。要选出细心的读者认为最有说服力的理由。",
      ],
      ["Which reason best supports the claim?", "哪个理由最能支持这个主张？"],
      strongestReason,
      (right) => [
        `**${right}** It shows why the claim is true by pointing to a real benefit, harm or fact.`,
        `**${right}** 它指出了真实的好处、害处或事实，说明了主张为什么成立。`,
      ],
      [
        [
          "*{wrong}* is only the writer's feeling; it gives the reader nothing to weigh.",
          "*{wrong}* 只是作者的感觉，没有给读者任何可以衡量的东西。",
        ],
        [
          "*{wrong}* is a reason for a different claim; it is off the point of this one.",
          "*{wrong}* 是另一个主张的理由，偏离了这个主张的要点。",
        ],
      ],
    ),
  ],
});

const hookLabels: Readonly<Record<string, Label>> = {
  "a question": {
    zh: "提问",
    why: [
      "The opening asks the reader a question that makes them want to find the answer.",
      "开头向读者提出一个问题，让他们想去寻找答案。",
    ],
    not: ["The opening does not ask the reader a question.", "开头没有向读者提问。"],
  },
  "a surprising fact": {
    zh: "惊人的事实",
    why: [
      "The opening states a fact or number that is surprising enough to make the reader read on.",
      "开头说出一个令人惊讶的事实或数字，让读者想继续读下去。",
    ],
    not: ["The opening does not begin with a surprising fact or number.", "开头没有以惊人的事实或数字开始。"],
  },
  "a short story": {
    zh: "小故事",
    why: [
      "The opening tells a brief moment, an anecdote, that puts the reader inside the topic.",
      "开头讲了一个简短的片段，即轶事，把读者带入主题。",
    ],
    not: ["The opening does not tell a brief moment about a person.", "开头没有讲述关于某个人的简短片段。"],
  },
  "a quotation": {
    zh: "引语",
    why: ["The opening quotes someone's words that fit the topic.", "开头引用了与主题相符的某人的话。"],
    not: ["The opening does not quote anyone's words.", "开头没有引用任何人的话。"],
  },
};

const hookLines = `
  Have you ever wondered where your lunch comes from?|a question
  Nearly one third of all the food in the world is thrown away.|a surprising fact
  Last spring, my grandmother handed me a tiny seed and said, "Plant this, and you will never be hungry."|a short story
  "Let food be thy medicine," wrote the Greek doctor Hippocrates.|a quotation
  What would happen if every bee on Earth disappeared tomorrow?|a question
  A single cow can drink more than 100 liters of water in one day.|a surprising fact
  When Marco opened his lunchbox, he found nothing but a cold, hard potato.|a short story
  "The best fertilizer is the farmer's footsteps," says an old Chinese proverb.|a quotation
  How much sugar do you think is in one can of soda?|a question
  Honey found in Egyptian tombs was still safe to eat after 3,000 years.|a surprising fact
  The rain had not fallen for six months when Ana's father sold the last of the cattle.|a short story
  "Hunger is the best sauce," said the writer Cervantes.|a quotation
  Why do some players get to play every game while others sit on the bench?|a question
  The first marathon runner, legend says, ran 40 kilometers and then collapsed.|a surprising fact
  With ten seconds left, Leo had the ball and a choice: shoot or pass.|a short story
  "It's not whether you win or lose, it's how you play the game," as the saying goes.|a quotation
  What makes a word change its meaning over hundreds of years?|a question
  The word "nice" once meant foolish.|a surprising fact
  When my cousin from Scotland said she would "get the messages," I thought she meant letters.|a short story
  "Language is the road map of a culture," wrote the author Rita Mae Brown.|a quotation
  Could the ground beneath your feet really move?|a question
  The continents drift about as fast as your fingernails grow.|a surprising fact
  At 5:12 in the morning, the dishes in Ken's kitchen began to rattle.|a short story
  "The Earth has music for those who listen," wrote the poet George Santayana.|a quotation
  What is the smallest living thing you can imagine?|a question
  Your body is made of about 37 trillion cells.|a surprising fact
  The first time Mia looked through a microscope, a drop of pond water came alive.|a short story
  "Nature is pleased with simplicity," said Isaac Newton.|a quotation
  Did you know that the first cities had no streets?|a question
  Some of the oldest writing in the world is a receipt for beer.|a surprising fact
`;

// Pieces and openings: piece|a fitting hook|a hook that does not fit the topic|a dull opening that is no hook
const fittingHookRows = rows(`
  An essay on food waste|Every day, the average family throws away enough food for a whole extra meal.|Have you ever ridden a roller coaster?|This essay is about food waste.
  A column on fair play in sport|When the runner stopped to help her fallen rival, the crowd rose to its feet.|Volcanoes can erupt without warning.|I am going to write about fair play.
  An explanation of how volcanoes form|Beneath the quiet mountain, a lake of melted rock was rising.|Cats sleep sixteen hours a day.|This report will explain volcanoes.
  A letter asking for a school garden|What if our lunch came from just outside the classroom window?|My favorite color is green.|I am writing a letter about a garden.
  A history of the word "sandwich"|In the 1700s, an English earl was too busy playing cards to leave the table for dinner.|Penguins cannot fly.|This paragraph is about a word.
  An essay comparing plant and animal cells|An oak tree and a tiger have something in common: both are built of tiny cells.|Football is popular in Brazil.|Plant and animal cells will be compared.
  A memoir of moving to a new city|The truck pulled away with everything we owned, and I watched our street disappear.|The moon has no air.|This is a memoir about moving.
  An explanation of Mesopotamian irrigation|Five thousand years ago, farmers turned a desert into fields of wheat with nothing but shovels.|Have you ever eaten sushi?|Irrigation is the topic of this explanation.
  A column on video replay in football|"The referee's job is to be right, not fast," one coach told reporters.|Elephants have excellent memories.|Today's topic is video replay.
  An essay on why bees matter|One out of every three bites of food you eat depends on bees.|Have you seen the newest phone?|This essay is about bees.
  An explanation of earthquakes|Every year, the Earth shakes about half a million times.|My uncle likes fishing.|Earthquakes are explained in this paper.
  A letter asking for less cafeteria waste|Last Friday, our cafeteria threw away 40 kilograms of untouched food.|The Sahara is very large.|I am writing about waste.
  A memoir of learning to swim|The water closed over my head, and for one second the whole world went silent.|Tigers have striped skin.|This memoir is about swimming.
  An essay on training for a race|"The miracle isn't that I finished. The miracle is that I had the courage to start," said the runner John Bingham.|Rome was founded long ago.|This essay is about training.
  An explanation of how cells divide|How does one cell become the trillions in your body?|Pizza was invented in Italy.|Cell division will now be explained.
  A history of the word "boycott"|In 1880, an Irish village refused to speak to one man, and his name became a word.|Sharks have many teeth.|This paragraph explains boycott.
  An essay on hunger around the world|Somewhere tonight, one person in ten will go to bed hungry.|Have you ever seen snow?|Hunger is what I will discuss.
  A column on equal playing time|Ana practiced every day for a year and never left the bench.|The ocean is salty.|Playing time is my topic.
  A letter asking for a bike lane|Twelve cyclists were hit by cars on Main Street last year.|My dog is called Max.|I would like to talk about bikes.
  An essay on why we need sleep|What if you never slept again?|Bananas are yellow.|Sleep is the topic of this essay.
  An explanation of tsunamis|A wave can cross the whole Pacific Ocean in less than a day.|Have you ever baked bread?|Tsunamis are what this explains.
  A memoir of a grandparent|My grandfather's hands smelled of soil and peppermint.|Mars is the fourth planet.|This memoir is about my grandfather.
  A history of the word "salary"|Roman soldiers, it is said, were once paid in salt.|Dolphins sleep with one eye open.|The word salary is the subject.
  An essay on the first cities|Imagine a city with no cars, no electricity and no paper, yet 40,000 people.|Have you ever played chess?|This essay describes the first cities.
  A column on cheating in sport|"Winning isn't everything, but wanting to win the right way is," a famous coach once said.|Apples grow on trees.|Cheating is the topic of this column.
  An explanation of heredity|Why do you have your mother's eyes and your father's laugh?|The Nile is a long river.|Heredity will be explained here.
  An essay on modern farming|A farmer today can feed about 150 people; a century ago, a farmer fed fewer than ten.|Have you ever been to the zoo?|Modern farming is what I will write about.
  A letter asking for later school starts|Doctors say teenagers' bodies are not ready to wake before eight.|Mountains are tall.|I am writing about school times.
  A memoir of a first day at school|I clutched my mother's hand at the gate and refused to let go.|Rain falls from clouds.|This is about my first day at school.
  An explanation of fossils|A fern that died 300 million years ago left its print in a rock you can hold.|Have you ever flown a kite?|Fossils are explained in this report.
`);

const fittingHook = rival(
  fittingHookRows.map((r): ChoiceItem => [field(r, 0), field(r, 1), [field(r, 2), field(r, 3)]]),
  0,
);

const hooks = topic("writing", {
  id: "hooks-for-an-opening",
  title: ["Hooks for an Opening", "开头的吸引手法"],
  summary: [
    "An opening catches the reader with a question, a surprising fact, a short story or a quotation that fits the topic.",
    "开头用一个与主题相符的问题、惊人的事实、小故事或引语来吸引读者。",
  ],
  after: ["previewing-the-topic"],
  points: [
    label(
      "the-kind-of-hook",
      ["The Kind of Hook", "吸引手法的类型"],
      [
        "A **hook** is an opening sentence that makes the reader want to go on. Four kinds are common: **a question** the reader wants answered, **a surprising fact** or number, **a short story**, a brief moment that puts the reader in a scene, and **a quotation**, someone's words that fit the topic. Name the kind of hook each opening uses.",
        "**吸引手法**是让读者想继续读下去的开头句。常见的有四种：读者想知道答案的**问题**、**惊人的事实**或数字、**小故事**（把读者带入场景的简短片段），以及**引语**（与主题相符的某人的话）。说出每个开头用的是哪种手法。",
      ],
      ["What kind of hook does this opening use?", "这个开头用了哪种吸引手法？"],
      hookLines,
      hookLabels,
    ),
    choose(
      "the-hook-that-fits",
      ["The Hook That Fits", "合适的开头"],
      [
        "A hook must do two jobs: catch the reader **and lead into the topic**. A clever question about roller coasters is no help in an essay on food waste. An opening that only announces the topic (*This essay is about...*) fits but catches no one. Choose the hook that is interesting and points straight at the piece.",
        "开头必须做到两件事：吸引读者，**并且引入主题**。在一篇关于食物浪费的文章中，一个关于过山车的巧妙问题毫无帮助。只是宣布主题的开头（*This essay is about...*）虽然切题，却吸引不了任何人。要选出既有趣又直指文章主题的开头。",
      ],
      ["Which opening is the best hook for this piece?", "哪个开头最适合这篇文章？"],
      fittingHook,
      (right) => [
        `**${right}** It catches the reader's interest and leads straight into the topic of the piece.`,
        `**${right}** 它既吸引了读者，又直接引入了文章的主题。`,
      ],
      [
        [
          "*{wrong}* may be a good hook, but for a different piece; it does not lead into this topic.",
          "*{wrong}* 也许是个好开头，但属于另一篇文章，不能引入这个主题。",
        ],
        ["*{wrong}* only announces the topic; it does nothing to catch the reader.", "*{wrong}* 只是宣布了主题，丝毫没有吸引读者。"],
      ],
    ),
  ],
});

/** writingTopics6b are the second group of grade 6 writing topics checked by rule. */
export const writingTopics6b: readonly TopicDef[] = [consistentStyle, showingCharacter, endingNarrative, relevantReasons, hooks];
