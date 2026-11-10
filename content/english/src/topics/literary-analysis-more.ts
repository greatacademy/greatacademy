// Literary analysis: more items for the banks of literary-analysis.ts, written as lines of fields separated by bars:
// what is shown, the right answer and two wrong answers.

import type { ChoiceItem } from "@ga/subject-english";

/** bars turns lines of four fields separated by bars into choice items. */
const bars = (lines: string): readonly ChoiceItem[] =>
  lines
    .trim()
    .split("\n")
    .map((line) => {
      const [shown, right, ...wrong] = line.trim().split("|");
      return [shown!, right!, wrong];
    });

const first = "first person";
const limited = "third person limited";
const omniscient = "third person omniscient";

/** narrator builds items from passages told in one point of view, giving the other two as wrong answers. */
const narrator = (view: string, passages: readonly string[]): ChoiceItem[] =>
  passages.map((p) => [p, view, [first, limited, omniscient].filter((v) => v !== view)]);

/** narratorMore are more passages, with the point of view each is told in. */
export const narratorMore: readonly ChoiceItem[] = [
  ...narrator(first, [
    "I knew I should not open the letter, but my hands were already tearing the envelope.",
    "When the coach called my name, I could hardly breathe.",
    "My brother says he is not scared of the dark, but I hear him leave his light on every night.",
    "I had never seen the ocean before, and I stood at the edge of the water for an hour.",
    "We missed the last bus, so my friend and I walked home in the rain, laughing the whole way.",
    "I still do not know why she left without saying goodbye.",
    "The noise woke me at midnight, and I lay still, listening.",
  ]),
  ...narrator(limited, [
    "Priya stared at the blank page and wondered how she would ever finish the story by Friday.",
    "Marcus pretended not to care about the prize, but he checked the list of winners three times.",
    "Hana felt the floor tilt as the boat left the dock, and she gripped the rail.",
    "Tom could not understand why his best friend had stopped calling him.",
    "As the lights dimmed, Rosa wished she had practiced her lines one more time.",
    "Eli hated the new apartment, with its thin walls and the strange smells from the hallway.",
    "Grace knew the answer, but she was afraid her voice would shake if she said it aloud.",
  ]),
  ...narrator(omniscient, [
    "The teacher thought the class was bored, but every student was secretly worried about the test.",
    "Ming believed her brother had forgotten her birthday, while he was across town choosing her gift.",
    "The farmer prayed for rain, and far away, the clouds that would answer him were already gathering.",
    "Each player on the team blamed himself for the loss, though none of them said so.",
    "The wolf was hungry and the rabbit was afraid, and neither knew the hunter was watching them both.",
    "The mayor smiled for the cameras, and the reporter, who knew his secret, smiled back.",
    "Anna thought her grandfather was asleep; in fact, he was listening to every word she said.",
  ]),
];

/** narratorEffectMore are more stories, with the effect of their point of view first. */
export const narratorEffectMore = bars(`
  A story about a boy who is bullied is told in first person by the boy himself.|The reader feels his hurt and fear from the inside.|The reader learns what the bullies are secretly thinking.|The reader sees the events from a distance, without any feelings.
  A story about a lost dog is told in third person limited, through the dog's eyes.|The reader experiences the world as the dog does, without knowing where its owners are.|The reader knows exactly where the owners are searching.|The reader hears the dog speak as I.
  A story about a town in a flood is told by an omniscient narrator who moves from house to house.|The reader sees how the disaster affects many different families at once.|The reader follows only one family through the flood.|The reader never learns how anyone feels.
  A story about a surprise party is told in third person limited, through the person being surprised.|The reader is surprised along with the character when the lights come on.|The reader knows about the party from the first page.|The reader learns what every guest is thinking.
  A story about a girl's first job is told in first person, in her own chatty voice.|The reader feels close to her, as if she were a friend telling the story.|The reader knows the thoughts of her boss and her coworkers.|The reader sees her only from the outside.
  A story about two rival chefs is told by an omniscient narrator who shares both chefs' thoughts.|The reader understands why each chef wants to win, so both seem human.|The reader sees only one chef's side of the contest.|The reader is told the story by one of the chefs as I.
  A story about a crime is told in first person by a narrator who hides that he is the criminal.|The reader may be tricked, and the ending comes as a shock.|The reader knows from the start that the narrator is guilty.|The reader learns every character's honest thoughts.
  A story about a child in a war is told in third person limited, through the child.|The reader sees the war as the child does, without the adults' full understanding.|The reader learns the plans of the generals on both sides.|The reader hears the child speak as I.
  A story about a family's move is told by an omniscient narrator who shares each person's feelings.|The reader sees that every family member is sad about the move in a different way.|The reader only knows how the youngest child feels.|The reader cannot tell how anyone feels about the move.
  A story about an old man's life is told in first person, as he looks back at ninety.|The reader gets the calm, reflective view of someone remembering a whole life.|The reader knows only what he understood as a young boy.|The reader learns the secret thoughts of everyone he knew.
  A story about a test is told in third person limited, through a nervous student.|The reader shares the student's panic and does not know how the others are doing.|The reader knows every student's score before the end.|The reader hears the story from the teacher's side.
  A story about a haunted ship is told by an omniscient narrator who knows the ghost is harmless.|The reader feels calm while the characters panic, which makes their fear seem silly.|The reader is just as frightened as the characters.|The reader never learns what the ghost is.
  A story about a friendship that ends is told in first person by one of the friends.|The reader hears only one side and must wonder what the other friend felt.|The reader knows exactly what both friends felt.|The reader sees the friendship from outside, without any feelings.
  A story about a mountain climb is told in third person limited, through the climber at the back.|The reader feels the climb as a struggle to keep up with the others.|The reader knows what the leader is planning.|The reader hears the climber speak as I.
  A story about a village is told by an omniscient narrator who reveals what each villager hides.|The reader sees the village's secrets, which none of the villagers can see.|The reader knows only what one villager knows.|The reader learns nothing that the villagers do not say aloud.
  A story about a girl who thinks her parents favor her brother is told in first person by the girl.|The reader shares her feeling of unfairness, though her view may not be the whole truth.|The reader learns exactly what her parents think of each child.|The reader sees her from the outside without knowing her feelings.
  A story about a soccer final is told in third person limited, through the goalkeeper.|The reader feels the pressure of the final penalty from the goal.|The reader knows what the kicker will do before he does it.|The reader is told the story by the coach as I.
  A story about an inventor is told by an omniscient narrator who reveals that a rival is stealing her ideas.|The reader worries for the inventor because they know something she does not.|The reader is as unaware of the rival as the inventor is.|The reader only learns the rival's side of the story.
  A story about a boy and his grandfather is told in first person by the boy, who does not understand his grandfather's illness.|The reader understands more than the boy, which makes the story sad.|The reader knows less than the boy about the illness.|The reader learns the grandfather's secret thoughts.
  A story about a new student is told in third person limited, through the student who is asked to show her around.|The reader sees the new student only from the outside, as a stranger to get to know.|The reader knows the new student's secret fears from the start.|The reader hears the new student tell the story as I.
  A story about a shipwreck is told by an omniscient narrator who moves between the survivors on the lifeboat.|The reader sees how each survivor faces the same danger differently.|The reader follows only one survivor.|The reader learns nothing about how the survivors feel.
  A story about a girl's first day of high school is told in first person, in short, nervous sentences.|The reader feels her nerves in the very rhythm of the story.|The reader knows what every other student thinks of her.|The reader sees the day from the teacher's point of view.
`);

/** symbolMore are more stories with an object that stands for an idea, the idea first, then two literal readings. */
export const symbolMore = bars(`
  A boy wears his father's old watch every day after his father dies. When he gives it to his own son, he smiles for the first time in years.|The bond between fathers and sons carried through time|The boy's need to know the time|The value of old watches
  A caged bird sings in the window of the girl who is never allowed to leave her house. When she finally runs away, she opens the cage.|The girl's own trapped life and her wish to be free|The girl's love of singing birds|The size of the bird's cage
  A family keeps an old wooden table where four generations have eaten together. When the house is sold, they carry the table to the new home.|The family's history and unity|The family's need for furniture|The type of wood the table is made of
  A rose bush in the garden dies the winter the couple's marriage falls apart. In spring, after they make peace, a new bud appears.|The couple's love, lost and then renewed|The couple's interest in gardening|The cold weather that winter
  A runner keeps the torn shoe from the race she lost. Years later, after winning the championship, she sets it beside her trophy.|The failure that taught her to succeed|Her habit of keeping old shoes|The brand of her running shoes
  A lighthouse shines over the stormy sea in every chapter, while the lonely keeper waits for his son to return.|Hope and guidance through dark times|The keeper's interest in lights|The weather on the coast
  A wall divides two neighbors' yards. As their friendship grows, they take it down stone by stone.|The barrier between the neighbors and its fall|The neighbors' interest in building|The stones used in the wall
  A girl sees a single green shoot in the ashes of her burned village. She waters it every day as the village rebuilds.|New life and hope after disaster|The kind of plant that grows in ashes|The girl's chores in the village
  A key to his childhood home hangs around an old man's neck, though the house was torn down long ago.|His memories of a past he cannot return to|His fear of being locked out|The metal the key is made of
  A storm cloud follows the main character through the story whenever he lies. When he finally tells the truth, the sky is clear.|His guilt and the weight of his lies|The rainy weather of his town|His fear of storms
  A kite string breaks, and the boy watches his kite disappear on the day his older brother leaves for the army.|Letting go of someone he loves|The poor quality of the kite string|The strong wind that day
  A girl's grandmother gives her a quilt made of scraps from the family's old clothes. She wraps herself in it whenever she feels lost.|Her family's love and history keeping her safe|Her need for a warm blanket|The colors of the old clothes
  A road that splits into two paths appears in the opening scene, and the hero must later choose between two very different lives.|The hero's choice about his future|The poor roads of the region|The hero's sense of direction
  The candle in the window of the cottage grows shorter each chapter as the sick mother grows weaker.|The mother's life slowly fading|The family's need for light|The cost of candles
  A broken violin lies in the attic until the grieving musician finally repairs it and plays again.|The musician's healing from grief|The value of old violins|The dust in the attic
  A boy keeps a jar of sand from the beach where he spent his last happy summer with his family.|His memories of a happier time|His collection of sand|The color of the beach
  Every time the sisters argue, the mirror between their beds seems to crack a little more. When they reconcile, they buy a new one together.|Their broken and then rebuilt relationship|The poor quality of the mirror|The size of their bedroom
  A seed packet sent by a pen pal in another country sits unopened on a girl's desk until she finally plants it and writes back.|The friendship she had neglected and lets grow|Her love of gardening|The country the seeds came from
  A soldier's helmet with a dent from a bullet sits on the mantel, and his son touches it before every hard decision.|The courage he hopes to have, like his father|The quality of army helmets|The decoration of the living room
  A river runs past the town in every season of the story, flowing on while the characters grow old.|The passing of time that no one can stop|The town's need for water|The fish in the river
  A pair of glasses is lost the day a stubborn man refuses to see his own mistake. He finds them only after he apologizes.|His blindness to his faults and finally seeing clearly|His poor eyesight|The cost of new glasses
  A tree the children climbed together is cut down the summer they all move away.|The end of their childhood together|The danger of climbing trees|The kind of tree it was
`);

/** ironyMore are more lines and events, with the kind of irony each shows. */
export const ironyMore = bars(`
  Looking at the burnt toast, Dad said, "Ah, cooked to perfection."|verbal irony|situational irony|dramatic irony
  The police station was robbed while the officers were at a safety meeting.|situational irony|verbal irony|dramatic irony
  The audience knows the poison is in the second cup, but the hero happily drinks from it.|dramatic irony|verbal irony|situational irony
  As the rain soaked through his coat, Ben grinned and said, "Beautiful day for a walk."|verbal irony|dramatic irony|situational irony
  The world's best spelling champion misspelled his own name on the trophy form.|situational irony|dramatic irony|verbal irony
  We know the friend she trusts most is the one who stole her diary.|dramatic irony|situational irony|verbal irony
  When her brother ate the last cookie, Ella said, "How generous of you."|verbal irony|situational irony|dramatic irony
  A traffic sign warning drivers to slow down was knocked over by a speeding car.|situational irony|verbal irony|dramatic irony
  Readers know the prince in rags is the real king, but the guards throw him out of the palace.|dramatic irony|verbal irony|situational irony
  After waiting two hours at the doctor's, Mia sighed, "Wow, that was quick."|verbal irony|dramatic irony|situational irony
  The man who wrote a book on avoiding accidents slipped on his own book.|situational irony|dramatic irony|verbal irony
  The audience knows the ship will sink, while the passengers celebrate how safe it is.|dramatic irony|situational irony|verbal irony
  Stuck in traffic for an hour, Raj said, "I love a good traffic jam."|verbal irony|situational irony|dramatic irony
  The baker who won the bread prize could not eat bread because of an allergy.|situational irony|verbal irony|dramatic irony
  We know the "stranger" at the door is the girl's long-lost father, but she sends him away.|dramatic irony|verbal irony|situational irony
  Holding up his muddy shoes, Leo said, "Nice and clean, just like I promised."|verbal irony|dramatic irony|situational irony
  The fire alarm factory burned down because no alarm went off.|situational irony|dramatic irony|verbal irony
  The reader knows the treasure is buried under the hero's own house, while he searches the world for it.|dramatic irony|situational irony|verbal irony
  When the team lost twenty to nothing, the coach said, "Well, that was close."|verbal irony|situational irony|dramatic irony
  A student who complained that the test would be too hard got the highest score in the class.|situational irony|verbal irony|dramatic irony
  The audience knows the hiding place the children chose is the wolf's den.|dramatic irony|verbal irony|situational irony
  Seeing the huge pile of dishes, Mom smiled and said, "Oh good, my favorite chore."|verbal irony|dramatic irony|situational irony
`);

/** orderMore are more passages, as foreshadowing, a flashback or neither. */
export const orderMore = bars(`
  The old sailor looked at the red sky and muttered that no ship should leave the harbor today.|foreshadowing|flashback|neither
  As she held the photograph, Lin remembered the summer her family lived by the sea.|flashback|foreshadowing|neither
  Leo brushed his teeth, put on his shoes and left for the bus.|neither|foreshadowing|flashback
  Everyone ignored the small crack in the dam, and the rain kept falling.|foreshadowing|neither|flashback
  The story jumps back twenty years, to the night the two brothers last saw each other.|flashback|neither|foreshadowing
  The class ate lunch, then went outside to play football.|neither|flashback|foreshadowing
  "This bridge will last a thousand years," the builder boasted as the river rose below.|foreshadowing|flashback|neither
  The smell of baking bread took Grandma back to her mother's kitchen in the village.|flashback|foreshadowing|neither
  The plane took off and landed in Tokyo eleven hours later.|neither|foreshadowing|flashback
  Her new friend seemed kind, but Maya noticed that he never looked anyone in the eye.|foreshadowing|neither|flashback
  In the next chapter, we return to the day Tom first stepped off the boat as a frightened boy.|flashback|neither|foreshadowing
  Sam fed the cat, did his homework and went to bed at nine.|neither|flashback|foreshadowing
  The fortune teller told him to beware of the color green. He laughed and put on his green jacket.|foreshadowing|flashback|neither
  Hearing the song on the radio, Ana was suddenly ten again, dancing at her cousin's wedding.|flashback|neither|foreshadowing
  The family moved into the house, unpacked their boxes and ordered pizza.|neither|foreshadowing|flashback
  The dog would not stop barking at the empty corner of the room.|foreshadowing|neither|flashback
  The general closed his eyes, and the battlefield of his youth rose up before him.|flashback|foreshadowing|neither
  The team practiced for two hours and then went home.|neither|flashback|foreshadowing
  "Nothing could ever come between us," Kim promised her best friend on the first day of school.|foreshadowing|flashback|neither
  The diary's first entry was dated forty years earlier, the night the fire began.|flashback|neither|foreshadowing
  The bakery opened at six, and the first customers bought warm rolls.|neither|foreshadowing|flashback
  The brakes squeaked a little as they drove up the mountain road, but Dad said it was nothing.|foreshadowing|neither|flashback
`);

/** citeMore are more claims, each with a quotation that supports it and two that only mention the same character or place. */
export const citeMore = bars(`
  Claim: Maria is determined. Which quotation best supports it?|"Maria fell off the bike twenty times that afternoon, and twenty times she climbed back on."|"Maria's bike was blue with white stripes."|"Maria lived next to the park."
  Claim: The narrator feels guilty. Which quotation best supports it?|"I could not look at my sister after what I had said, and I could not sleep that night."|"My sister and I share a room."|"My sister is two years younger than I am."
  Claim: The village is poor. Which quotation best supports it?|"Most families ate only one meal a day, and the children went to school barefoot."|"The village sat at the foot of a mountain."|"A river ran past the village."
  Claim: The coach cares about his players. Which quotation best supports it?|"When Jamal's father lost his job, the coach quietly paid for his new uniform."|"The coach had played for the team when he was young."|"The coach wore a red cap at every game."
  Claim: Lena is jealous of her friend. Which quotation best supports it?|"When Sara won the prize, Lena smiled, but under the table her fists were tight."|"Lena and Sara met in first grade."|"Lena likes to draw horses."
  Claim: The house is frightening. Which quotation best supports it?|"Children crossed the street rather than walk past its broken windows."|"The house was built a hundred years ago."|"The house had three floors and a big garden."
  Claim: Grandpa is patient. Which quotation best supports it?|"Grandpa explained the knot for the tenth time, as calmly as the first."|"Grandpa was a fisherman for forty years."|"Grandpa's boat was painted green."
  Claim: The new student feels lonely. Which quotation best supports it?|"At lunch, Ali sat at the end of the table, eating in silence while the others laughed."|"Ali's family had moved from another city."|"Ali carried a black backpack."
  Claim: The king is wise. Which quotation best supports it?|"Instead of punishing the thief, the king asked why he had stolen, and then gave his family work."|"The king's castle stood on a hill."|"The king had three daughters."
  Claim: The storm is dangerous. Which quotation best supports it?|"The wind tore roofs from houses and tossed boats onto the shore like toys."|"The storm began on a Tuesday."|"The clouds came from the west."
  Claim: Kenji is honest. Which quotation best supports it?|"When the cashier gave him too much change, Kenji walked back into the store to return it."|"Kenji works at the bakery on weekends."|"Kenji likes to eat rice for breakfast."
  Claim: The mother is protective. Which quotation best supports it?|"She stood between her son and the barking dog, her arms spread wide."|"She was a nurse at the city hospital."|"She liked to sing while she cooked."
  Claim: The narrator has changed by the end. Which quotation best supports it?|"A year ago I would have run from the stage. Tonight, I walked to the microphone and began."|"The stage was in the school gym."|"My parents sat in the third row."
  Claim: The brothers are close. Which quotation best supports it?|"Whenever one of them was in trouble, the other was there before anyone called."|"The brothers were born three years apart."|"The brothers went to the same school."
  Claim: The forest is peaceful. Which quotation best supports it?|"The only sounds were birdsong and the soft rush of the stream over the stones."|"The forest covered the hills north of town."|"The forest had both pine and oak trees."
  Claim: Mr. Ford is unfair. Which quotation best supports it?|"Mr. Ford gave the prize to his nephew, though everyone knew Ana's project was the best."|"Mr. Ford taught science for twenty years."|"Mr. Ford wore glasses."
  Claim: The girl is curious. Which quotation best supports it?|"She took apart every clock in the house just to see how it worked."|"She lived in a house with many clocks."|"She was the youngest child in the family."
  Claim: The soldier is homesick. Which quotation best supports it?|"Each night he read his mother's letters until the paper grew soft from folding."|"He was stationed far from the city."|"He had served in the army for two years."
  Claim: The town welcomes strangers. Which quotation best supports it?|"When the travelers arrived, every family set an extra place at the table."|"The town was on the main road to the coast."|"The town had a square with a fountain."
  Claim: Lucy is brave. Which quotation best supports it?|"While the others froze, Lucy jumped into the river and pulled the child to shore."|"Lucy lived near the river."|"Lucy had a younger brother."
  Claim: The friendship is one-sided. Which quotation best supports it?|"Emma always called, always waited, always forgave, and Jade never once did the same."|"Emma and Jade sat together in math class."|"Emma and Jade both liked music."
  Claim: The old man is generous. Which quotation best supports it?|"Though he had little, he left a basket of apples on his neighbors' steps every autumn."|"The old man lived alone near the orchard."|"The old man had a gray beard."
`);
