// Literature: more items for the banks of literature.ts, written as lines of fields separated by bars: what is
// shown, the right answer and two wrong answers.

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

/** deviceMore are more lines that use personification or hyperbole. */
export const deviceMore = bars(`
  The alarm clock screamed at me to get out of bed.|personification|hyperbole|alliteration
  I have a mountain of laundry to fold.|hyperbole|personification|onomatopoeia
  The leaves danced across the empty parking lot.|personification|simile|hyperbole
  She has been on the phone for a thousand hours.|hyperbole|metaphor|personification
  The hungry fire gobbled up the dry branches.|personification|onomatopoeia|hyperbole
  My little brother is so loud he can be heard on the moon.|hyperbole|alliteration|personification
  The camera loves her; it catches every smile.|personification|hyperbole|rhyme
  This bag of rice weighs more than a truck.|hyperbole|personification|simile
  The old bridge groaned under the weight of the traffic.|personification|hyperbole|onomatopoeia
  I have heard that joke a billion times.|hyperbole|personification|metaphor
  The lazy river wandered through the valley.|personification|alliteration|hyperbole
  We walked so far that our shoes wore out twice.|hyperbole|personification|simile
  The stars winked at us from the dark sky.|personification|hyperbole|metaphor
  That movie lasted an eternity.|hyperbole|personification|onomatopoeia
  The flowers bowed their heads in the rain.|personification|simile|hyperbole
  My teacher can hear a whisper from the other side of the school.|hyperbole|personification|alliteration
  The computer refused to start this morning.|personification|hyperbole|rhyme
  He is so tall he has to duck under the clouds.|hyperbole|personification|metaphor
  The angry storm punished the little town all night.|personification|onomatopoeia|hyperbole
  I could sleep for a year after that exam.|hyperbole|simile|personification
  Time crept by while we waited for the results.|personification|hyperbole|alliteration
  Her smile was brighter than ten thousand suns.|hyperbole|personification|onomatopoeia
`);

/** deviceEffectMore are more lines with figurative language, the effect first, then a literal reading and a detail the line does not give. */
export const deviceEffectMore = bars(`
  The thunder grumbled angrily over the hills.|It makes the storm seem threatening and bad-tempered.|It shows the thunder was a person in a bad mood.|It tells how far away the hills were.
  I have a million things to do before Friday.|It stresses how busy and overwhelmed the speaker feels.|It gives the exact number of tasks on the list.|It shows Friday is a holiday.
  The lonely lighthouse watched over the dark sea.|It makes the lighthouse seem faithful and alone.|It shows the lighthouse had eyes.|It tells how tall the lighthouse was.
  This suitcase weighs a ton.|It stresses how heavy and hard to carry the suitcase is.|It gives the real weight of the suitcase.|It shows the suitcase is made of metal.
  The kettle sang happily on the stove.|It creates a cozy, cheerful feeling in the kitchen.|It shows the kettle can carry a tune.|It tells what was being cooked.
  The line for the ride stretched to the next city.|It stresses how long and tiring the wait seemed.|It tells the exact length of the line.|It shows the ride was in another city.
  The old house sighed as the wind blew through it.|It makes the house seem tired and sad.|It shows the house could breathe.|It tells what year the house was built.
  He ran faster than the speed of light.|It stresses how amazingly fast he ran.|It compares his real speed with light.|It shows he was running at night.
  The waves reached up and grabbed at our feet.|It makes the sea seem playful and a little dangerous.|It shows the waves had hands.|It tells how cold the water was.
  My feet are killing me after the hike.|It stresses how much the speaker's feet hurt.|It means the feet are truly harming the speaker.|It tells how long the hike lasted.
  The city never sleeps.|It shows how busy and lively the city is at all hours.|It means the city is a person who stays awake.|It tells how many people live there.
  We laughed until we thought we would explode.|It stresses how hard and long they laughed.|It shows they were in real danger.|It tells what joke they heard.
  The tired old car wheezed up the hill.|It makes the car seem weak and worn out.|It shows the car was sick and needed a doctor.|It tells the color of the car.
  I told my sister a hundred times to knock first.|It shows how frustrated the speaker is with repeating it.|It gives the exact count of reminders.|It tells where the sister's room is.
  The moon hid its face behind the clouds.|It makes the night seem shy and mysterious.|It shows the moon has a real face.|It tells what time the moon rose.
  The homework monster swallowed my whole weekend.|It stresses how much time the homework took.|It shows a real monster ate the weekend.|It tells which subject the homework was.
  Opportunity knocked, and she opened the door.|It shows she took a chance when it came.|It means someone knocked on her real door.|It tells what her house looked like.
  The silence was so loud it hurt my ears.|It stresses how uncomfortable the silence felt.|It shows the silence made a real noise.|It tells where the speaker was sitting.
  The wind howled its anger at the windows.|It makes the night seem wild and frightening.|It shows the wind was a real angry animal.|It tells how big the windows were.
  I am so hungry I could eat a whole cow.|It stresses how very hungry the speaker is.|It means the speaker plans to eat a cow.|It tells what is for dinner.
  The flowers turned their faces to the sun.|It creates a gentle, hopeful picture of the garden.|It shows the flowers have real faces.|It tells what kind of flowers they were.
  This classroom is an oven today.|It stresses how hot and uncomfortable the room feels.|It means the classroom is used for baking.|It tells how many students are in the room.
`);

/** soundMore are more lines that use alliteration, onomatopoeia or rhyme. */
export const soundMore = bars(`
  Five fat frogs fished from a floating log.|alliteration|onomatopoeia|rhyme
  The door slammed shut with a bang.|onomatopoeia|alliteration|hyperbole
  The fox in the box wore yellow socks.|rhyme|onomatopoeia|alliteration
  Wild winds whipped across the winter hills.|alliteration|rhyme|onomatopoeia
  The bees hummed and buzzed among the roses.|onomatopoeia|alliteration|personification
  The boat will float upon the moat.|rhyme|alliteration|onomatopoeia
  Tiny turtles tiptoed toward the tide.|alliteration|onomatopoeia|rhyme
  Splash! The dog jumped into the pool.|onomatopoeia|rhyme|alliteration
  The king could sing, but not a thing.|rhyme|onomatopoeia|hyperbole
  Silly snakes slid slowly south.|alliteration|rhyme|onomatopoeia
  The old clock went tick, tock, tick, tock.|onomatopoeia|alliteration|rhyme
  The light of night is cold and white.|rhyme|alliteration|onomatopoeia
  Dancing daisies dipped in the dawn.|alliteration|onomatopoeia|simile
  The twigs snapped and crackled in the fire.|onomatopoeia|rhyme|alliteration
  The mouse ran through the empty house.|rhyme|alliteration|onomatopoeia
  Grumpy goats gobbled green grass.|alliteration|rhyme|onomatopoeia
  The ducks quacked at the children on the bridge.|onomatopoeia|alliteration|metaphor
  We play all day in the month of May.|rhyme|onomatopoeia|alliteration
  Lucky lions lazed in the long grass.|alliteration|onomatopoeia|rhyme
  Whoosh! The rocket shot into the sky.|onomatopoeia|alliteration|rhyme
  The bear sat there with not a care.|rhyme|alliteration|onomatopoeia
`);

/** rhymeSchemeMore are more stanzas of four lines, with their rhyme schemes. */
export const rhymeSchemeMore = bars(`
  The snow is deep, / The hills are white, / The children sleep / All through the night.|ABAB|AABB|ABBA
  The boat set sail / Into the gale. / The sky grew black, / We turned back.|AABB|ABAB|ABCB
  The fields are green, / The air is warm, / The farmer sees / A summer storm.|ABCB|ABAB|AABB
  I closed the door, / The house was still, / Beyond the hill / The sea would roar.|ABBA|ABAB|AABB
  My cat is gray, / She likes to play, / She sleeps all night / Curled up tight.|AABB|ABAB|ABBA
  The lamp is lit, / The book is old, / I sit and sit / While stories unfold.|ABAB|ABBA|AABB
  Along the shore / The seagulls cry, / The fishing boats / Go sailing by.|ABCB|AABB|ABBA
  The bell will ring, / The class will start, / We learn by heart / The songs we sing.|ABBA|ABAB|ABCB
  The rain falls down / On roof and street, / It soaks the town / And chills our feet.|ABAB|AABB|ABCB
  We climbed the hill / And sat quite still, / The sun went down, / Gold on the town.|AABB|ABAB|ABBA
  The garden gate / Is painted blue, / The roses wait / For morning dew.|ABAB|ABBA|AABB
  The wind was strong, / The waves were high, / We sailed along / Beneath the sky.|ABAB|AABB|ABCB
  A tiny spark / Can start a flame, / And in the dark / Shine just the same.|ABAB|ABCB|AABB
  The train is late, / The station cold, / We stand and wait, / Both young and old.|ABAB|AABB|ABBA
  In early spring / The birds return, / The rivers run, / The farmers turn.|ABCB|ABAB|AABB
  My friend and I / Walked to the sea, / We counted waves / And drank our tea.|ABCB|AABB|ABAB
  The night is long, / The moon is bright, / A cricket's song / Fills up the night.|ABAB|ABBA|ABCB
  The leaves turn red, / The days grow short, / The birds take off / From every port.|ABCB|ABAB|ABBA
  I lost my key, / I searched the floor, / Behind the door / It waited for me.|ABBA|ABAB|AABB
  The river flows / Down to the sea, / And where it goes / No one can see.|ABAB|AABB|ABBA
  The baker sings / While bread is made, / He knows the things / That never fade.|ABAB|ABBA|ABCB
  The kite flew high, / The string was tight, / Up in the sky / A spot of light.|ABAB|AABB|ABBA
`);

/** plotMore are more events from stories, with the stage of the plot each belongs to. */
export const plotMore = bars(`
  The story begins in a busy city, where twelve-year-old Kai lives above his parents' noodle shop.|exposition|climax|resolution
  A new restaurant opens across the street, and the noodle shop starts losing customers.|rising action|exposition|falling action
  Kai enters the city cooking contest, hoping a prize will save the shop.|rising action|climax|resolution
  In the final round, Kai's sauce burns, and he must invent a new dish in ten minutes.|climax|rising action|exposition
  The judges taste Kai's new dish, and slowly the tension in the room fades.|falling action|exposition|climax
  Customers line up to try Kai's dish, and the noodle shop is busier than ever.|resolution|rising action|climax
  On a farm at the edge of the desert, Rosa lives with her grandmother and a herd of goats.|exposition|falling action|climax
  A long drought begins, and the well on the farm starts to dry up.|rising action|resolution|exposition
  Rosa hears of a hidden spring in the hills and sets out alone to find it.|rising action|exposition|falling action
  Lost and out of water, Rosa finally spots green plants around a trickle of water.|climax|exposition|resolution
  Rosa leads her grandmother and the goats to the spring, and they rest at last.|falling action|climax|exposition
  The village builds a pipe from the spring, and no family goes thirsty again.|resolution|rising action|climax
  At the start of the school year, shy Ben joins the drama club because his sister makes him.|exposition|climax|resolution
  Ben is given the lead role, and he panics at every rehearsal.|rising action|resolution|exposition
  On opening night, Ben freezes on stage, then remembers his lines and delivers the speech perfectly.|climax|exposition|falling action
  The audience applauds, and Ben walks off stage shaking but proud.|falling action|exposition|climax
  By the end of the year, Ben is the one who welcomes the nervous new members.|resolution|rising action|climax
  The story is set on a space station, where engineer Ada keeps the air machines running.|exposition|climax|falling action
  A meteor strikes the station, and the air machines begin to fail one by one.|rising action|exposition|resolution
  With minutes of air left, Ada crawls into the damaged tunnel and repairs the last machine.|climax|rising action|exposition
  The rescue ship arrives, and the crew is carried safely home.|falling action|exposition|climax
  Ada is given a medal, and she trains the next crew of engineers.|resolution|climax|rising action
`);

/** conflictMore are more situations, with the kind of conflict each shows. */
export const conflictMore = bars(`
  Lily and her best friend both want the last spot on the swim team.|character against character|character against nature|character against self
  A family's car breaks down in the desert, and the heat is rising.|character against nature|character against character|character against society
  Omar wants to try out for the play but is terrified of being laughed at.|character against self|character against character|character against society
  A boy protests the school rule that bans students from wearing hats.|character against society|character against self|character against nature
  A climber is caught on the mountain when an avalanche begins.|character against nature|character against society|character against self
  A new student is teased every day by a group of older girls.|character against character|character against self|character against nature
  Mei cannot decide whether to tell her teacher that her friend cheated.|character against self|character against nature|character against society
  A town's workers strike against a law that cuts their pay.|character against society|character against character|character against nature
  Two neighbors fight over a tree that drops leaves into both yards.|character against character|character against society|character against self
  A fisherman's boat is pulled toward the rocks by a powerful current.|character against nature|character against self|character against society
  After losing the final game, Theo doubts that he should ever play again.|character against self|character against character|character against nature
  A girl refuses to obey a kingdom's law that forbids girls from reading.|character against society|character against nature|character against self
  A detective tries to catch a clever thief who always escapes.|character against character|character against nature|character against self
  Explorers struggle across a frozen sea as the ice cracks around them.|character against nature|character against character|character against society
  Priya wants to quit the violin but feels she would let her parents down.|character against self|character against society|character against nature
  A young journalist exposes a city that ignores pollution in poor neighborhoods.|character against society|character against self|character against nature
  A boy and his stepfather argue about everything after the wedding.|character against character|character against nature|character against society
  A small village must survive a winter with almost no food.|character against nature|character against self|character against character
  Sam promised to keep a secret, but keeping it is hurting his friend.|character against self|character against character|character against nature
  A scientist is mocked by the whole academy for claiming the earth moves.|character against society|character against nature|character against self
  Two rival bakers compete to win the town's prize for the best bread.|character against character|character against society|character against nature
  A pilot must land a small plane in a sudden fog.|character against nature|character against society|character against character
`);

/** themeMore are more short stories, with the theme first, then a topic only and a retelling of the plot. */
export const themeMore = bars(`
  A boy hides his poor test score from his parents. The lie grows bigger each day until he confesses, and his parents help him study.|Hiding a mistake only makes it harder to fix.|lying|A boy gets a poor test score.
  A girl laughs at her classmate's homemade shoes. Later, she learns her classmate's family lost everything in a fire.|We should not judge others before we know their story.|judging others|A girl laughs at a classmate.
  An ant works all summer while a grasshopper plays. When winter comes, the ant has food and the grasshopper is hungry.|Preparing for the future is wiser than living only for today.|ants|An ant and a grasshopper spend the summer differently.
  A champion runner loses a race to a newcomer and is angry. Training with the newcomer, he runs faster than ever before.|Competition can help us grow if we learn from it.|running|A champion loses a race.
  A wealthy man buys a huge house but has no friends to invite. His poor neighbor's tiny home is always full of laughter.|Friendship is worth more than wealth.|houses|A wealthy man buys a big house.
  A team of mismatched students builds a robot. Each one's odd skill turns out to be the piece the robot needs.|Everyone has something to offer a team.|robots|Students build a robot together.
  A girl practices the same song every night for months. At the concert, she plays it perfectly.|Patience and practice lead to success.|music|A girl plays at a concert.
  A boy keeps a stray dog secret, fearing his parents will say no. When he finally asks, they welcome the dog.|Being honest is often easier than we fear.|pets|A boy finds a stray dog.
  A village cuts down its whole forest for firewood. Floods soon wash away its fields.|Harming nature brings harm back to us.|forests|A village cuts down trees.
  A girl who always wins at chess finally loses to her little brother. She laughs and asks him for a rematch.|Losing gracefully is a sign of strength.|chess|A girl loses a game of chess.
  A boy is told he is too small to play basketball. He practices passing until he becomes the team's most valuable player.|Determination can overcome what others see as weaknesses.|basketball|A small boy plays basketball.
  A greedy merchant tricks his customers for years. One day, no one in town will buy from him.|Dishonesty eventually destroys trust.|merchants|A merchant tricks his customers.
  Two sisters fight over who gets the bigger room. When one moves away to college, the other misses her terribly.|We often do not value people until they are gone.|sisters|Two sisters share a house.
  An inventor fails a hundred times. On the hundred and first try, her machine works.|Failure is a step on the way to success.|inventions|An inventor builds a machine.
  A shy girl writes letters to a lonely old man in a nursing home. Her letters become the brightest part of his week.|Small kindnesses can mean a great deal to others.|letters|A girl writes letters.
  A prince trades places with a poor boy for a day. He learns how hard life is for his people.|Understanding others requires seeing the world through their eyes.|princes|A prince trades places with a boy.
  A boy brags that he can swim across the lake. Halfway across, he must be rescued.|Pride can lead us into danger.|swimming|A boy tries to swim across a lake.
  A class plants a garden on an empty lot. Soon the neighbors join in, and the lot becomes a park.|One group's effort can inspire a whole community.|gardens|A class plants a garden.
  A girl moves to a new country and feels she belongs nowhere. Slowly, she learns to treasure both her old and new homes.|We can belong to more than one place.|moving|A girl moves to a new country.
  A boy who is always late finally misses the school trip. The next week, he is the first one at the bus.|We learn from the consequences of our choices.|being late|A boy misses a school trip.
  An old fisherman shares his catch with a starving stranger. Years later, the stranger saves the fisherman's village.|Generosity is often repaid in unexpected ways.|fishing|An old fisherman shares fish.
  A girl copies her friend's style to be popular. She is unhappy until she starts dressing as she likes again.|Being true to yourself brings happiness.|fashion|A girl changes her clothes.
`);

/** themeEvidenceMore are more themes, each with an event that shows it and two details that do not. */
export const themeEvidenceMore = bars(`
  Theme: Forgiveness can heal a broken friendship.|After months of silence, Mia accepts Zoe's apology, and they laugh together again.|Mia and Zoe live on the same street.|Zoe has a red bicycle.
  Theme: Bravery means acting despite fear.|Shaking with fear, Leo still climbs the tree to rescue the trapped kitten.|The tree is in Leo's backyard.|The kitten is orange and white.
  Theme: Teamwork achieves more than working alone.|The rowers only win once they stop arguing and pull together.|The race is held on a river.|The rowers wear yellow shirts.
  Theme: Greed leaves people lonely.|The rich man refuses to share his harvest, and his neighbors stop visiting him.|The rich man owns many fields.|The harvest is in autumn.
  Theme: Honesty earns respect.|When Ana returns the lost wallet, the whole town learns to trust her.|The wallet is made of brown leather.|Ana walks to the market on Sundays.
  Theme: Hard times reveal true friends.|When Tom's family loses their home, only Ben keeps visiting and helping.|Tom's house was near the school.|Ben likes to play football.
  Theme: Curiosity leads to discovery.|Asking why the stream turns red, Lucy finds a hidden source of iron in the hills.|The stream runs past the village.|Lucy has two older brothers.
  Theme: Listening is as important as speaking.|The mayor finally solves the town's problem after listening to the children's idea.|The town hall has a tall clock.|The mayor wears a blue hat.
  Theme: Pride can blind us to our mistakes.|The captain ignores the crew's warning about the rocks, and the ship runs aground.|The ship has white sails.|The captain has sailed for twenty years.
  Theme: It is never too late to learn.|At seventy, Grandma Li learns to read and writes her first letter to her grandson.|Grandma Li lives in a small village.|Her grandson is studying in the city.
  Theme: Loyalty is tested in difficult times.|When the others flee, the dog stays by the injured hiker all night.|The hiker carries a green backpack.|The mountain trail is steep.
  Theme: Fear of change can hold us back.|Refusing to try the new school, Max misses the chance to join its famous science team.|The new school is across town.|Max's old school has a garden.
  Theme: Kindness spreads.|After a stranger pays for her lunch, Rosa pays for the next person in line.|The cafe sells sandwiches.|Rosa is wearing a raincoat.
  Theme: Envy can poison a friendship.|Jealous of Kim's prize, Jo spreads a rumor and loses her best friend.|The prize is a silver medal.|Kim and Jo are in the same class.
  Theme: Perseverance brings rewards.|After failing the driving test three times, Sam passes on his fourth try.|The test center is downtown.|Sam's car is old.
  Theme: Respect for elders brings wisdom.|By listening to her grandfather's stories, Nia learns how to find water in the desert.|Her grandfather wears a white robe.|Nia's family keeps camels.
  Theme: Money cannot buy happiness.|The lottery winner buys everything he wants and still feels empty inside.|He wins the lottery on a Tuesday.|He buys a blue car.
  Theme: Standing up for others takes courage.|Though she is new, Aisha tells the older boys to stop teasing the little kid.|Aisha's school has three floors.|The older boys play basketball.
  Theme: Nature has the power to heal.|After weeks of sadness, Owen feels calm again while walking in the forest each morning.|The forest has tall pine trees.|Owen lives with his aunt.
  Theme: Sharing knowledge makes everyone stronger.|Instead of keeping her method secret, the farmer teaches it to the whole village, and every field thrives.|The farmer grows rice.|The village is near a river.
  Theme: The truth eventually comes out.|Years after the theft, a letter reveals who really took the jewels.|The jewels were kept in a safe.|The letter is written in blue ink.
  Theme: Caring for others gives life meaning.|The lonely old man finds joy again when he starts teaching neighborhood children to garden.|The old man's house has a porch.|The children ride bicycles.
`);

/** toneMore are more passages, with the writer's tone. */
export const toneMore = bars(`
  Great, the bus is late again. I just love standing in the rain.|sarcastic|joyful|peaceful
  At last, summer vacation! No alarms, no homework, just sunshine and swimming!|joyful|gloomy|sarcastic
  The footsteps stopped outside my door. Slowly, the handle began to turn.|suspenseful|humorous|cheerful
  The playground where we used to play is gone, replaced by a parking lot.|sad|excited|humorous
  My cat sat on my homework, then looked at me as if I were the one being rude.|humorous|serious|angry
  Clean water is a right, and we must protect our rivers for the next generation.|serious|humorous|sarcastic
  The lake was still, and the only sound was a loon calling across the water.|peaceful|suspenseful|angry
  They promised us a new library and then spent the money on a fountain no one wanted!|angry|peaceful|joyful
  Oh, perfect. My phone died just as the movie got good. Wonderful timing.|sarcastic|cheerful|serious
  The whole family cheered when the puppy finally learned to sit!|joyful|sad|suspenseful
  A shadow slipped across the window. Then the lights went out.|suspenseful|joyful|humorous
  Her letters stopped coming in the spring, and I still check the mailbox every day.|sad|humorous|excited
  My little brother tried to cook breakfast and somehow set the cereal on fire.|humorous|sad|serious
  Every student deserves a safe school. We cannot accept anything less.|serious|sarcastic|humorous
  Snow fell softly on the sleeping village, covering every roof in white.|peaceful|angry|suspenseful
  How can anyone throw garbage into the ocean after seeing what it does to sea turtles?|angry|joyful|peaceful
  Yes, of course, I would love to clean the whole garage on my birthday.|sarcastic|joyful|peaceful
  We won! Our tiny school beat the champions, and the crowd went wild!|joyful|gloomy|serious
  The radio crackled: "Is anyone there?" Then nothing but static.|suspenseful|cheerful|humorous
  The old farmhouse stands empty now, its windows broken, its garden gone to weeds.|sad|excited|joyful
  Our dog thinks the vacuum cleaner is a monster and barks at it like a hero.|humorous|serious|sad
  We must act now to save the forests, before it is too late.|serious|humorous|sarcastic
`);

/** moodMore are more passages, with the mood they create. */
export const moodMore = bars(`
  Mist hung over the swamp, and somewhere a branch snapped in the silence.|eerie|cheerful|calm
  Streamers hung from the ceiling, and everyone sang as the cake arrived.|festive|gloomy|tense
  Gray clouds sat low over the town, and the streets were empty and wet.|gloomy|joyful|exciting
  The timer ticked toward zero, and the bomb squad held its breath.|tense|relaxed|festive
  The hammock swayed gently between two palm trees as the tide went out.|calm|frightening|tense
  The horses thundered down the track, and the crowd leapt to its feet.|exciting|gloomy|calm
  Rain tapped on the window while we sat under blankets with hot soup.|cozy|eerie|tense
  The wolves howled closer, and the campfire was almost out.|frightening|peaceful|festive
  The abandoned hospital was silent except for a door creaking in the wind.|eerie|festive|calm
  Lanterns glowed, drums beat, and dragons danced through the crowded street.|festive|gloomy|eerie
  The funeral was quiet, and the rain did not stop all afternoon.|gloomy|exciting|cozy
  No one spoke as the judge opened the envelope with the winner's name.|tense|calm|festive
  The garden was still, and a single butterfly drifted over the lilies.|calm|tense|frightening
  The roller coaster climbed higher and higher, then dropped into a wild spin.|exciting|calm|gloomy
  The kitten curled up on the warm rug beside the crackling fire.|cozy|frightening|tense
  Something heavy was dragging itself up the cellar stairs.|frightening|cozy|festive
  An old doll sat alone on the dusty shelf, its glass eyes following us.|eerie|cheerful|exciting
  Fireworks burst over the harbor as the new year began.|festive|gloomy|tense
  The fog never lifted, and the foghorn moaned all day.|gloomy|festive|exciting
  The surgeon's hand hovered over the patient. One wrong move would be the last.|tense|relaxed|cozy
  We floated on our backs in the warm lake and watched the clouds drift by.|calm|tense|eerie
  The ball flew toward the goal in the last second of the final.|exciting|calm|cozy
`);
