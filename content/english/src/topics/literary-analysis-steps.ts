// Literary analysis: the second step of four topics for grades 6 to 8, from naming what a writer does to using it:
// the theme a symbol carries, an ending that makes irony, what a hint foreshadows, and how to explain a quotation.

import { t } from "@ga/content";
import { point } from "@ga/subject-english";
import { bars, kindedChoice } from "./steps.ts";

/** symbolThemeBank gives a passage with a symbol; its wrong options are a literal statement, then a theme the story reverses. */
const symbolThemeBank = bars(
  `
  Every winter, Rosa's family hangs a paper star in the window of their new apartment, the same star they hung in the house they lost in the flood. This year, a neighbor knocks to say the star helped her find the building.|Hope and kindness can travel with us into a new place.|Paper stars are easy to make and hang.|Losing a home means losing every good part of the past.
  Jamal's grandfather gives him a pocketknife with a worn wooden handle. Jamal uses it only to carve small animals for his younger cousins, the way his grandfather once did for him.|What we inherit matters most in how we pass it on to others.|A pocketknife needs a strong wooden handle.|Family gifts are best kept locked away in a drawer and never used, so that they stay perfect.
  The old fence between the two yards grew taller every year the neighbors argued. After the storm knocked it down, they rebuilt it together, only waist-high, with a gate in the middle.|People can choose to open the walls that anger builds between them.|Storms often damage wooden fences.|Good neighbors always need high walls between them, so that no one ever has to argue again.
  Every time Mei fails her driving test, she adds a stone to the jar on her desk. On the day she passes, she pours the stones into the garden path that leads to her door.|Failures can become the path that carries us to success.|Stones from a jar can make a garden path.|Each failure is a heavy weight that we must carry with us forever, wherever we go next.
  A boy keeps a caged canary that never sings. When he finally opens the cage and the bird lands on the windowsill outside, it begins to sing.|A living thing cannot be truly happy without freedom.|Canaries are birds that sometimes sing.|Safety in a cage is better than a dangerous freedom.
  Liang's mother's coat is too big for him when she leaves for work overseas. He wears it all winter, rolling up the sleeves. By the time she returns, the sleeves no longer need rolling.|Children grow into the responsibilities that love asks of them.|Winter coats are often too long in the sleeves.|Children stay small and helpless while their parents are away, waiting to be looked after.
  During the long drought, the village well is the only place the feuding families meet. When the rain finally comes, the two oldest men are seen laughing together at the well's edge.|Shared hardship can bring enemies together.|Wells are important when there is no rain.|Hard times only make old quarrels worse.
  A girl who stutters keeps a small mirror in her desk and practices speaking to it. At the end of the story, she gives the mirror to a new student who is too shy to talk.|Courage we have found can be handed on to someone else.|Mirrors are useful for practicing speeches.|Fear is something each person must keep secret, because sharing it with others only spreads it.
  In the empty lot, a single sunflower grows through a crack in the concrete. After the children of the street start watering it, the city turns the lot into a garden.|Something small and stubborn can inspire a whole community to change.|Sunflowers can grow in poor soil.|One small effort can never change a neighborhood.
  Andre's music box plays a lullaby his father used to hum. It breaks the year his father dies. Years later, Andre's own baby falls asleep while Andre hums the same tune.|The people we love live on in what we remember and share.|Old music boxes break easily.|When someone we love is gone, everything they gave us and taught us is lost along with them.
  The family's old car, with its dented door and broken radio, has carried them to every new town they have lived in. When they finally buy a house and stay, they keep the car parked in the garage instead of selling it.|The struggles we survive together become part of who we are.|Old cars often have dents and broken radios.|A family should forget the hard years once life improves.
  Every evening, Ama's grandmother leaves the porch light on for anyone who might be lost. After she dies, Ama climbs onto a chair and replaces the bulb herself.|Kindness continues when the next generation chooses to carry it.|Porch lights need new bulbs from time to time.|Good deeds end when the person who did them is gone, because no one else remembers to do them.
  Two friends carve their initials into an oak tree when they are eight. After a bitter argument at fourteen, one of them returns alone and finds that the tree has grown around the letters, making them deeper.|True friendship can grow stronger through time and trouble.|Oak trees grow slowly over many years.|Friendships made in childhood always fade away as people grow up, move apart and change.
  A runner keeps her torn first-place ribbon from a race she won before her injury. On the day she runs again, slowly and in last place, she ties the ribbon to her shoe.|Courage means honoring the past while starting over.|Ribbons are given to winners of races.|Only winning makes running worth doing.
  The kite Theo builds with his father keeps crashing. Each time, they patch it with tape. When it finally flies, it is more tape than paper, and Theo thinks it is the most beautiful kite in the sky.|Things mended with patience and love can be worth more than perfect ones.|Kites need strong tape to stay in one piece.|Only a brand-new thing is worth being proud of.
  The town clock has been stuck at noon for years, ever since the factory closed. When a group of teenagers repairs it, the first chime brings people out of their houses.|A community can begin to move forward when its people act together.|Town clocks need repairs when they stop.|A town that has lost its jobs can never recover, however hard its people work together.
  Fatima's notebook of poems is torn up by a bully. She tapes the pieces back together and keeps writing in it, and the taped pages become her favorite.|Creativity can survive cruelty and grow stronger from it.|Tape can fix torn pages of a notebook.|A hurt that is done to us cannot be repaired.
  A lonely old man feeds the pigeons in the park every morning. When he falls ill and stays home, he hears tapping and finds the pigeons waiting on his windowsill.|Small, steady acts of care create bonds that come back to us.|Pigeons look for food in parks.|Caring for others is never returned.
  A girl's grandfather plants an apple tree the year she is born. Each year she measures herself against it. In the last scene, she picks its first apples and shares them with her grandfather, now very old.|Growing up is a gift that the generations give each other.|Apple trees take years to give fruit.|Young and old people have little to share.
  The bridge across the canyon sways in every wind, and the villagers are afraid to cross it. After two families on opposite sides fall in love, the young people repair the bridge plank by plank.|Love can give people a reason to rebuild what fear has abandoned.|Rope bridges sway in the wind.|Fear will always keep people apart.
  At the start of the story, Ben hides his drawings in a shoebox under his bed. By the end, after his teacher praises one, the drawings cover his bedroom wall.|Encouragement can help us stop hiding who we are.|Drawings can be stored in a shoebox.|Our talents are safest when no one sees them.
  A sailor's compass stops working during a storm, and he must steer by the stars his mother taught him to read. Back home, he hangs the broken compass above his mother's door.|The lessons of the people who raised us guide us when tools fail.|Compasses can break during storms.|Machines and tools are always more reliable than the lessons people pass down to us.
  The new student wears the same faded red scarf every day, and the others tease her. On the coldest day of the year, she wraps it around a crying kindergartner at the bus stop.|Kindness is worth more than how things look.|Scarves keep people warm in winter.|People who are teased should keep to themselves.
  Every year the river floods the farm, and every year the farmer rebuilds the fence posts a little higher. In the final scene, his daughter hammers in the last post beside him.|Strength and stubborn hope are passed down through families.|Rivers often flood the land near them.|It is wiser to give up than to rebuild again and again.
  A family keeps an empty chair at the dinner table for the son who went away to fight. When he returns, wounded but alive, he will not sit anywhere else.|Love keeps a place for those we miss until they come home.|Families need enough chairs at the table.|Absence slowly makes a family forget the one who left, until no one sets a place for him.
  The candle in the shrine at the edge of the village is never allowed to go out. During the war, an old woman walks through the snow every night to keep it lit. After the war, the children take turns.|Faith and memory survive dark times when people keep them alive together.|Candles in a shrine burn down quickly.|In war, people forget what they once believed.
  Kenji's broken watch, which stopped on the day of his parents' divorce, stays on his desk for a year. When he finally takes it to be fixed, he decides to wear it again.|Healing comes when we choose to let time move forward.|Watches can be repaired by a jeweler.|Some hurts stop our lives forever.
  On her first day at the school for the deaf, Sara clutches a whistle her mother gave her in case she is lost. Months later, signing easily with her friends, she finds it at the bottom of her bag and smiles.|Belonging can replace the fear we feel in new places.|Whistles can call for help.|A new place will always feel dangerous.
  The pond where the brothers skated as boys freezes over once more. The older brother, who left for the city years ago, laces up his skates and steps onto the ice beside the younger one.|Shared memories can call people back to each other.|Ponds freeze when the weather gets cold.|Once people grow apart, they cannot find each other again.
  A refugee girl carries a key to the house her family had to leave. In the new country, she gives a copy of her apartment key to her best friend.|A new home is made by the people we welcome into it.|Keys open the doors of houses.|Home can only ever be the place where we were born, however long we live somewhere else.
  `,
  2,
);

/** ironyMakingBank gives a situation and asks for the choice that makes irony; its wrong options are the expected outcome, then a surprise that reverses nothing. */
const ironyMakingBank = bars(
  `
  A town builds a huge sign that reads WELCOME TO THE QUIETEST TOWN IN THE STATE. What ending would make this situation ironic?|The sign is so big that putting it up takes months of loud drilling and hammering.|The sign is put up in a single afternoon, and the town stays quiet and peaceful from then on.|A flock of birds lands on the sign one morning.
  Dev forgot his umbrella and is soaked by the rain on the way to school. Which line from Dev would be verbal irony?|"What a perfect day for a walk."|"I wish I had brought my umbrella."|"Did anyone finish the math homework?"
  A man buys an expensive alarm system to keep thieves away from his new car. What ending would make this situation ironic?|The alarm goes off so often that he cannot sleep, so he unplugs it, and the car is stolen that night.|The alarm scares away a thief in the middle of the night, and the car stays safe in the driveway.|His neighbor buys a new car the next week.
  The audience knows the birthday party is a surprise, but Lena thinks her friends have forgotten her. Which line from Lena creates dramatic irony?|"Nobody even remembered, so I'll just stay home tonight."|"I know you are planning a party for me."|"My favorite color is green."
  A fire chief gives a speech on safety at the town hall. What ending would make this situation ironic?|In the middle of his speech, his own notes catch fire from a candle on the stage.|The audience listens closely and learns how to stay safe.|After the speech, everyone thanks him, packs up their chairs and goes home for dinner.
  Maria's little brother spills juice all over her homework. Which line from Maria would be verbal irony?|"Thanks so much for the help."|"Now I have to write it all again."|"The juice was orange."
  A boy spends all summer practicing to become the best speller in his school. What ending would make this situation ironic?|At the contest, he misspells the word "practice."|He wins the contest after spelling a very hard word.|The contest is held in the school gym.
  The reader knows the old map in the attic leads to treasure, but Aunt Ruth plans to throw it away. Which line from Aunt Ruth creates dramatic irony?|"This old junk isn't worth a penny."|"This map might lead us to treasure."|"The attic needs a new light bulb."
  A company that makes "unbreakable" phone cases holds a contest to show off its product. What ending would make this situation ironic?|The case cracks in half when the company's president drops it on stage.|The case survives every drop, and the crowd cheers.|The president wears a blue suit for the contest.
  Hamid has waited two hours at the doctor's office and is still not called in. Which line from Hamid would be verbal irony?|"Wow, this place is really fast."|"I've been waiting a very long time."|"I like the fish tank in the corner."
  A girl writes a story for a contest about a dog who saves his family from a flood. What ending would make this situation ironic?|The day she mails it, her own dog wakes the family when water floods the basement.|The judges like her story about the brave dog and give her first prize at the school fair.|She writes her next story about a cat.
  The audience knows the stranger at the inn is the long-lost son, but his mother does not recognize him. Which line from the mother creates dramatic irony?|"You remind me of no one I have ever known."|"You must be my long-lost son."|"Would you like some soup?"
  A librarian is famous for shushing anyone who talks in the library. What ending would make this situation ironic?|At her retirement party, she gives the loudest speech anyone has ever heard there.|She keeps the library perfectly quiet every single day, right up until the day she retires.|The library buys new chairs that year.
  Pablo's team loses the soccer game twelve to nothing. Which line from Pablo would be verbal irony?|"Well, that was close."|"We played badly today."|"The field was wet from the rain."
  A man who has always laughed at fortune tellers visits one as a joke. She tells him he will never be famous. What ending would make this situation ironic?|He becomes famous for a book about how fortune tellers are always wrong, which proves her wrong.|He never becomes famous or writes a single book, just as the fortune teller said he would.|He goes home and makes a sandwich.
  The reader knows the bridge ahead has been washed out, but the truck driver whistles happily as he drives toward it. Which line from the driver creates dramatic irony?|"Nothing can stop me from getting home on time tonight."|"I hope the bridge is still standing after the storm."|"This truck needs new tires soon."
  A school holds an assembly to teach students how to stop wasting paper. What ending would make this situation ironic?|Every student is handed a thick packet of printed pages about saving paper.|Students learn to use both sides of their paper.|The assembly takes place on a Tuesday.
  Grace's cat knocks a whole vase of flowers onto the floor. Which line from Grace would be verbal irony?|"Oh, you are such a helpful cat."|"Bad cat, look at this mess."|"These flowers came from the garden."
  The audience knows the poisoned apple is in the basket, but the queen's servant offers the basket to the queen herself. Which line from the queen creates dramatic irony?|"Ah, my favorite fruit. You know me so well."|"I will not eat that, because it is poisoned."|"The weather is lovely today."
  A world-famous weather forecaster plans a big outdoor wedding. What ending would make this situation ironic?|He promises sunshine, and the wedding is ruined by a storm he did not predict.|The day is warm and sunny from morning to night, just as he predicted on the news.|His wedding cake has three layers.
  Lucy is stuck in a traffic jam that has not moved for an hour. Which line from Lucy would be verbal irony?|"I just love spending my whole afternoon sitting in one place."|"I'm going to be late for work again because of all this slow traffic."|"The car in front of me is red."
  The reader knows the shy new boy wrote the anonymous poem everyone loves, but the class bully claims it as his own. Which line from the new boy creates dramatic irony?|"I wish I could write something as good as that."|"I wrote that poem, not you."|"Can I borrow a pencil?"
  A man builds a high wall around his garden to keep out the neighbor's goats. What ending would make this situation ironic?|The wall traps his own goats inside, and they eat every plant in the garden.|The wall works, and the goats stay out.|He paints the wall white.
  Omar burns the toast for the third time this morning. Which line from Omar would be verbal irony?|"I'm clearly the best cook in the family."|"I keep burning the toast."|"We need more bread."
  A safety inspector arrives to check that a factory's fire exits are clear. What ending would make this situation ironic?|He trips over a box blocking the door to his own office and has to be helped out.|He finds every exit in the building clear and safe, signs his report and goes home.|He arrives at nine in the morning.
  The audience knows the pirates have already left the island, but the soldiers creep through the jungle very slowly. Which line from a soldier creates dramatic irony?|"Quiet, everyone, they could be anywhere."|"The pirates are gone, so we can relax."|"My boots are full of sand."
  A girl saves her allowance for a year to buy her mother a fancy cookbook for her birthday. What ending would make this situation ironic?|Her mother, who secretly hates cooking, has been saving for a year to buy her daughter cooking lessons.|Her mother loves the cookbook and uses it every day, cooking a new recipe from it each night.|The cookbook has a green cover.
  Jun's little sister uses all the hot water before his shower. Which line from Jun would be verbal irony?|"Nothing like a refreshing ice-cold shower in January."|"You used all the hot water again."|"The bathroom tiles are white."
  A rich man says he does not need anyone's help and fires all his servants. What ending would make this situation ironic?|He gets locked out of his own mansion and must ask a former servant for the key.|He lives happily alone in his big house and never needs help from anyone again.|He moves his piano to a new room.
  The reader knows the letter of acceptance is hidden under the doormat, but Anya believes she was rejected. Which line from Anya creates dramatic irony?|"I suppose they never even read my application."|"I'm sure my letter will come tomorrow."|"I should water the plants."
  `,
  2,
);

/** foreshadowBank gives a passage with a hint; its wrong options are an event the hint does not point to, then one it points away from. */
const foreshadowBank = bars(
  `
  As the family packed for the camping trip, Dad tossed the first-aid kit back into the closet. "We won't need that," he said. "It's just one night."|Someone will get hurt on the trip, and they will wish they had the kit.|The family will win a prize for the best campsite.|The trip will be completely safe and uneventful.
  Every night that week, Priya heard the old tree outside her window creak and groan in the wind. Her father said he would cut off the big branch over the roof "when he had time."|The branch will fall on the house during a storm.|Priya will plant a new garden in the spring.|The tree will grow stronger and shade the house for years.
  The first time Sam met his new coach, he noticed a faded photograph on her wall: a young woman holding a championship trophy, standing beside his own grandfather.|Sam will learn that his coach and his grandfather share a past.|Sam will decide to quit the team and take up painting.|Sam will never find out anything about his coach's life.
  "Whatever you do," the old woman said, handing Lily the box, "don't open it until you reach the city." Lily smiled and tucked it into her bag, already curious.|Lily will open the box before she reaches the city.|Lily will forget the box and leave it on the train for good.|Lily will carry the box unopened, without a single thought about it.
  The boat's engine coughed twice as they left the harbor, but the captain only turned up the music. Far out on the horizon, gray clouds were piling up.|The boat will break down far from shore as a storm arrives.|The captain will catch the biggest fish of the season.|The crew will enjoy a calm, sunny day at sea.
  Marco's little brother always wanted to play with the expensive camera on the top shelf. "Never touch it," Marco warned, and then he left for practice.|The brother will take down the camera while Marco is away.|Marco will win his game by a single goal.|The camera will stay on the shelf, untouched.
  On the first day of school, Ella noticed that the quiet girl in the back row was drawing the same strange symbol that was carved on Ella's grandmother's old music box.|The two girls will discover a connection between their families.|Ella will be chosen as class president.|Ella will never speak to the quiet girl at all.
  The ice on the lake had started to make small cracking sounds. "It's fine," said Leo, skating farther from the shore. "It held all week."|The ice will break under Leo.|Leo will learn a new trick on his skates.|The ice will stay solid all winter.
  The new teacher smiled at the class, but Nora noticed that he flinched every time a door slammed in the hallway.|Nora will learn about something frightening in the teacher's past.|Nora will get the highest grade in the class.|The teacher will turn out to have no worries of any kind.
  Grandpa kept saying he felt fine, but Rosa saw him sit down twice on the short walk to the store, rubbing his chest.|Grandpa will soon become seriously ill.|Grandpa will buy Rosa a new bicycle.|Grandpa will run in the town race the next week.
  The note was slipped under Jin's door with no name: "Be careful whom you trust at the meeting tomorrow."|Someone at the meeting will betray Jin.|Jin will move to a different city next year.|Everyone at the meeting will be completely honest with Jin.
  The scientist laughed when her assistant mentioned the strange reading on the machine. "Just a glitch," she said, and turned off the alarm.|The strange reading will turn out to be a real and dangerous problem.|The scientist will win an award for her paper.|The machine will work perfectly for the rest of the year.
  Before the big race, Ana's lucky bracelet snapped and the beads rolled under the bleachers. She could only find half of them.|Something will go wrong for Ana in the race.|Ana will open a jewelry shop when she grows up.|Ana will win the race easily, with no problems.
  The house was cheap, the agent said, because nobody had lived in it for twenty years. When the family asked why, she quickly changed the subject.|The family will discover a dark secret about the house.|The family will paint the house a bright yellow.|The family will find nothing unusual about the house.
  The little boy kept talking about the lost puppy he had seen near the creek. His parents, busy with the move, did not listen.|The puppy will turn up later and become part of the story.|The family will buy a new car after the move.|The boy will forget about the puppy and never mention it again.
  As the hikers set out, the ranger pointed at the sky and said, "If those clouds turn dark, come straight back." The hikers waved and kept walking toward the far peak.|The hikers will be caught by a storm on the mountain.|The hikers will find a rare flower and take its picture.|The weather will stay clear for the whole hike.
  Mrs. Kato hid the spare key under the same flowerpot every day, while a man across the street watched from his car.|Someone will use the spare key to break into the house.|Mrs. Kato will plant new flowers in the pot.|The house will stay safe because no one notices the key.
  "My sister would never lie to me," Ben told his friend. His friend looked away and said nothing.|Ben will discover that his sister has lied to him.|Ben will get a part-time job at the bakery.|Ben's sister will turn out to be completely honest.
  The class laughed when the new student, Asha, said she had once lived on a sailboat. Then a teacher announced a sailing trip for the end of the year.|Asha's sailing skills will matter on the class trip.|Asha will join the school chess club.|Asha will never get a chance to show what she knows.
  Every morning, the old dog sat by the gate waiting for the mail carrier, who always brought him a biscuit. One Monday, a new carrier arrived with no biscuit and a nervous look.|There will be trouble between the dog and the new carrier.|The town will build a new post office.|The dog and the new carrier will become friends at once with no trouble.
  Kenji wrote his speech the night before the contest and did not practice it once. "I'm good under pressure," he told his mother.|Kenji will struggle when he gives the speech.|Kenji will win a trip to the science museum.|Kenji will give a perfect speech without any trouble.
  The king laughed at the small kingdom's tiny army. "They are no threat to us," he said, sending half his soldiers home for the winter.|The small kingdom will attack and catch the king unprepared.|The king will hold a grand feast for his birthday.|The king's kingdom will stay safe and peaceful all winter.
  A crow landed on the windowsill every morning that week, and each time Grandmother crossed herself and whispered that a visitor was coming.|An unexpected visitor will soon arrive.|Grandmother will start a garden full of tomatoes.|No one will come to the house for months.
  The rope ladder to the tree house was old and frayed, but the twins climbed it every afternoon. "We'll replace it next summer," they said.|The ladder will break while someone is climbing it.|The twins will paint the tree house green.|The ladder will last for many more years.
  The detective noticed that the butler's shoes were muddy, though he claimed he had not left the house all night.|The butler will turn out to be hiding something about that night.|The detective will retire to a farm.|The butler will be proven to have stayed inside all night.
  Lena's best friend kept checking her phone and hiding the screen whenever Lena came close. "It's nothing," she said too quickly.|Lena will discover that her friend has a secret.|Lena will learn to play the guitar.|Lena's friend will turn out to have nothing to hide.
  The bridge into town had a sign that read WEIGHT LIMIT 2 TONS. The circus truck carrying the elephants rumbled toward it.|The bridge will struggle or fail under the heavy truck.|The circus will sell popcorn at the show.|The truck will cross the bridge with no trouble.
  At the bottom of the old trunk, Mia found a letter addressed to her, in handwriting she did not recognize, with a date ten years before she was born.|Mia will uncover a family secret.|Mia will clean out the whole attic and paint it.|The letter will turn out to mean nothing at all.
  The boy laughed at his mother's warning not to feed the wild raccoon on the porch. Each night, he left out a little more bread.|The raccoon will cause trouble for the family.|The boy will become a famous baker.|The raccoon will stay quietly in the woods.
  When the twins were born, their grandmother gave each a half of a broken coin. "One day," she said, "the halves will find each other."|The twins will be separated and later reunited.|The twins will both become coin collectors.|The twins will never be apart for a single day.
  `,
  2,
);

/** explainBank gives a claim and a quotation; its wrong options repeat the quotation, then drift away from the text. */
const explainBank = bars(
  `
  Claim: Mrs. Ortiz is brave.\\nQuotation: "When the dog leapt at the children, Mrs. Ortiz stepped in front of them with only her umbrella."|Stepping in front of the dog with nothing but an umbrella shows she puts herself in danger to protect others, which is what bravery means.|Mrs. Ortiz stepped in front of the children when the dog leapt at them, holding her umbrella.|Many people are afraid of dogs, and I am afraid of big dogs too, ever since one chased me down the street on my way home from school.
  Claim: Kofi feels left out at his new school.\\nQuotation: "At lunch, Kofi carried his tray past every table, then ate standing by the window."|Walking past every table and eating alone by the window shows that Kofi does not feel he has a place to sit with others.|At lunch, Kofi walked past all the tables with his tray and ate by the window.|School lunches are often not very healthy, and many schools are now trying to serve more fresh fruit, vegetables and whole grains to their students.
  Claim: The forest is a frightening place.\\nQuotation: "The trees leaned together overhead, and even at noon the path lay in darkness."|Trees that lean together and keep the path dark even at noon make the forest feel closed in and threatening, which builds fear.|The trees leaned together over the path, and it was dark there even at noon.|Forests are important because they give us oxygen.
  Claim: Grandpa Sol is proud of his granddaughter.\\nQuotation: "Grandpa Sol showed the newspaper photo to every customer who came into his shop that week."|Showing the photo to every customer for a whole week shows he wants everyone to know about her success, which reveals his pride.|Grandpa Sol showed a photo from the newspaper to all his customers that week.|Newspapers are not as popular as they used to be, because most people now read the news on their phones instead of buying a paper at the shop.
  Claim: Lena has changed by the end of the story.\\nQuotation: "This time, when the other girls laughed at the new student, Lena did not laugh with them."|The words "this time" remind us that Lena once joined in, so her silence now shows she has learned to stand apart from cruelty.|When the other girls laughed at the new student, Lena did not laugh.|Laughing at people is mean, and nobody should do it.
  Claim: The narrator is nervous before the race.\\nQuotation: "I retied my shoes four times, though they had not come loose once."|Retying shoes that were already tight shows the narrator cannot stay still and needs something to do with their worry.|The narrator retied their shoes four times, even though they were not loose.|Running shoes need to fit well to prevent injuries, so runners should try them on in the afternoon, when their feet are a little bigger.
  Claim: The king is greedy.\\nQuotation: "Though his storerooms overflowed, the king raised the grain tax again in the year of famine."|Raising taxes on hungry people while his own storerooms overflow shows that the king wants more even when he already has too much.|The king's storerooms were full, but he raised the grain tax again during the famine.|Taxes are needed to pay for roads, schools and hospitals, and in most countries every working person pays some share of them each year.
  Claim: The sisters care about each other despite their fights.\\nQuotation: "Even on the days they did not speak, Ana left the porch light on until June came home."|Leaving the light on during their silent days shows that Ana's care for her sister does not stop when they are angry.|Ana left the porch light on until June got home, even on days when they were not talking.|Porch lights help keep a house safe at night.
  Claim: The old house feels lonely.\\nQuotation: "Dust lay thick on the piano, and the chairs still faced a fireplace no one had lit in years."|Chairs facing a fireplace that is never lit suggest that people once gathered there but no longer do, which makes the house feel lonely.|There was dust on the piano, and the chairs faced a fireplace that had not been lit in years.|Pianos should be tuned at least once a year, and more often in old houses where the air changes from damp to dry with the seasons.
  Claim: Theo is a loyal friend.\\nQuotation: "When the coach offered Theo a spot on the team without Max, Theo said he would wait until next year."|Turning down the team rather than leave Max behind shows that Theo values his friend more than his own chance to play.|The coach offered Theo a place on the team without Max, and Theo said he would wait.|Joining a sports team is a great way to make new friends, and my own best friend is someone I met on the soccer team in third grade.
  Claim: The village is poor.\\nQuotation: "The children played with a ball made of rags, and the school had one book for every five pupils."|A ball made of rags and one book for five pupils show that the village cannot afford even simple things, which reveals its poverty.|The children's ball was made of rags, and there was one book for every five pupils.|Every child should be able to go to school.
  Claim: Mr. Bell is impatient.\\nQuotation: "Mr. Bell tapped his watch, sighed loudly, and began to answer the question before the student had finished asking it."|Tapping his watch and answering before the question is finished show that Mr. Bell cannot bear to wait even a few seconds.|Mr. Bell tapped his watch, sighed and started answering before the student finished the question.|Teachers have a lot of work to do every day, from planning lessons to grading tests, and many of them stay at school long after the students leave.
  Claim: The storm is dangerous.\\nQuotation: "The wind tore the roof off the barn and flung it into the river like a playing card."|Comparing a heavy barn roof to a playing card shows how easily the storm can destroy strong things, which makes it seem dangerous.|The wind ripped the roof off the barn and threw it into the river.|Barns are used to store hay and animals.
  Claim: Rina is determined to succeed.\\nQuotation: "After falling for the twentieth time, Rina wiped the mud off her knees and climbed back onto the board."|Getting up after the twentieth fall shows that Rina refuses to quit no matter how often she fails.|Rina fell for the twentieth time, wiped the mud off and climbed back on.|Skateboarding can be dangerous without a helmet and pads, which is why many parks now have rules about what riders must wear.
  Claim: The narrator regrets the argument.\\nQuotation: "I picked up the phone a dozen times that night and put it down again without dialing."|Picking up the phone again and again shows that the narrator wants to apologize but cannot find the courage, which is what regret feels like.|The narrator picked up the phone many times that night but did not call.|Phones have changed the way people talk to each other.
  Claim: The city is crowded.\\nQuotation: "On the train, Mei was pressed so tightly between strangers that she could not lift her hand to scratch her nose."|Being unable to lift a hand because of the strangers around her shows how little space there is, which proves the city is crowded.|Mei was squeezed between strangers on the train and could not move her hand.|Trains are a cleaner way to travel than cars, and many cities are building new lines so that fewer people need to drive to work.
  Claim: Aunt Bea is generous.\\nQuotation: "Aunt Bea baked two loaves every morning: one for her family and one for whoever on the street needed it."|Baking a second loaf every day for anyone in need shows that her generosity is a daily habit, not a single act.|Aunt Bea baked two loaves each morning, one for her family and one for others.|Fresh bread tastes much better than bread from a store.
  Claim: Daniel is dishonest.\\nQuotation: "Daniel told his mother he had studied all evening, then slid the unopened textbook back into his bag."|The unopened textbook proves that his claim of studying all evening was a lie he told his mother.|Daniel said he had studied all evening and then put the unopened book in his bag.|Studying every evening helps students do well on tests, especially when they review a little each day instead of cramming the night before.
  Claim: The war has changed the soldier.\\nQuotation: "At the welcome-home party, Ray flinched at the sound of every balloon that popped."|Flinching at popping balloons shows that ordinary sounds now remind Ray of gunfire, so the war has left its mark on him.|Ray flinched whenever a balloon popped at his welcome-home party.|Parties are a good way to celebrate when someone comes home.
  Claim: The girl loves the sea.\\nQuotation: "Every evening, Nia ran down to the shore and stayed until the last light left the water."|Running to the shore every evening and staying until dark shows that the sea draws Nia like nothing else.|Nia went down to the shore each evening and stayed until it got dark.|The ocean covers most of the surface of the Earth, and scientists say we still know less about its deepest parts than about the moon.
  Claim: The principal is fair.\\nQuotation: "The principal listened to both boys tell their side before she said a single word."|Listening to both sides before speaking shows that she wants the whole truth before making a judgment, which is what fairness requires.|The principal let both boys explain before she said anything.|Principals have to make many decisions every day.
  Claim: The family is in a hurry.\\nQuotation: "They left the breakfast dishes on the table, the door unlocked and the radio still playing."|Leaving dishes, an unlocked door and a radio playing shows the family had no time for the usual small tasks before leaving.|The family left the dishes, an unlocked door and the radio on.|Radios were once the main way families heard the news, and many homes had one big radio in the living room that everyone gathered around.
  Claim: Leo is curious.\\nQuotation: "By the end of the week, Leo had taken apart the toaster, the alarm clock and his sister's music box to see how they worked."|Taking apart three machines just to see how they work shows that Leo's need to understand things is stronger than his fear of trouble.|Leo took apart the toaster, the clock and the music box that week.|Toasters can be dangerous if they are not unplugged.
  Claim: The garden brings the neighbors together.\\nQuotation: "Neighbors who had never spoken now argued happily over whose tomatoes were reddest."|Neighbors who never spoke now joking about tomatoes shows that the garden gave them a reason to talk and enjoy each other.|Neighbors who had not talked before argued about whose tomatoes were the reddest.|Tomatoes need a lot of sun to ripen, so gardeners usually plant them in the brightest corner of the garden and water them every morning.
  Claim: The narrator is lonely.\\nQuotation: "I set the table for one, then talked to the radio as if it might answer."|Talking to a radio as if it could reply shows how much the narrator wants someone to speak to.|The narrator set the table for one and talked to the radio.|Eating alone can be peaceful for some people.
  Claim: The mountain is beautiful.\\nQuotation: "At sunrise, the snow on the peak blushed pink, then burned gold, as if the mountain were catching fire from the inside."|Snow that blushes pink and burns gold makes the mountain seem alive with color, which shows its beauty.|At sunrise, the snow on the peak turned pink and then gold.|Climbing mountains requires a lot of training, and climbers often spend months building their strength before they try a high peak like this one.
  Claim: The coach believes in her team.\\nQuotation: "Even after the third loss, Coach Diaz wrote PLAYOFFS in big letters on the locker room board."|Writing PLAYOFFS after three losses shows that the coach still expects her team to succeed when others might give up.|After the third loss, the coach wrote PLAYOFFS on the board.|Most teams lose a few games each season.
  Claim: The boy is afraid of the dark.\\nQuotation: "Arjun counted the steps from the light switch to his bed, then leapt the last three."|Counting the steps and leaping the last three show that Arjun wants to spend as little time as possible in the dark.|Arjun counted the steps from the switch to his bed and jumped the last three.|Children should go to bed early on school nights.
  Claim: The friendship is ending.\\nQuotation: "They still walked home together, but now the silence between them lasted the whole way."|A silence that lasts the whole walk home shows that, though they are still side by side, the two friends have nothing left to say to each other.|They walked home together, but they were silent the whole time.|Walking home from school is good exercise, and it gives friends time to talk about their day before they get home to their homework.
  Claim: The town distrusts strangers.\\nQuotation: "When the stranger walked into the diner, every conversation stopped, and the waitress did not bring him a menu."|Conversations stopping and no menu being offered show that the town treats the stranger as someone unwelcome.|When the stranger came in, everyone stopped talking and he got no menu.|Diners are popular places to eat breakfast.
  `,
  2,
);

/** symbolThemeStep asks which theme a symbol helps to express. */
export const symbolThemeStep = point(
  "the-theme-a-symbol-carries",
  t("The Theme a Symbol Carries", "象征所承载的主题"),
  t(
    "A symbol matters because of the **theme** it helps express: a message about people or life that the whole story suggests. To get from a symbol to a theme, follow what happens to the object. If a broken fence is rebuilt with a gate, the change mirrors the characters, and the theme follows the change: *people can open the walls that anger builds.*\n\nA theme is a statement about life, not about the object itself. *Fences can be damaged by storms* is true, but it is about wood, not people. A theme also has to fit the ending: a symbol that is repaired, freed or passed on points toward hope, so a gloomy message would read the story backward.",
    "象征的意义在于它所表达的**主题**：整个故事所暗示的关于人或生活的道理。要从象征推出主题，就要跟踪这个东西发生了什么。如果一道破篱笆被重建并留了一扇门，这个变化映照着人物，主题也随之而来：*人们可以打开愤怒筑起的墙。*\n\n主题是关于生活的陈述，而不是关于东西本身的陈述。*篱笆会被暴风雨损坏* 是事实，但它讲的是木头，而不是人。主题还必须与结局相符：一个被修好、被放飞或被传承下去的象征指向希望，如果得出悲观的道理，就是把故事读反了。",
  ),
  kindedChoice(
    ["Which theme does the symbol in this passage help express?", "这段文字中的象征有助于表达哪个主题？"],
    symbolThemeBank,
    (right) => [
      `*${right}* The object changes along with the characters, and this message about life follows from that change.`,
      `*${right}* 这个东西随着人物一起变化，这条关于生活的道理正是从这一变化中得出的。`,
    ],
    [
      [
        "*{wrong}* is a fact about the object itself. A theme is a message about people or life that the symbol stands for.",
        "*{wrong}* 是关于这个东西本身的事实。主题是象征所代表的、关于人或生活的道理。",
      ],
      [
        "*{wrong}* goes against the story: follow what happens to the object at the end, because the theme follows that change.",
        "*{wrong}* 与故事相反：看看这个东西在结尾发生了什么，因为主题随着这个变化而来。",
      ],
    ],
  ),
);

/** ironyMakingStep asks for the ending or line that creates irony. */
export const ironyMakingStep = point(
  "making-the-gap",
  t("Making the Gap", "制造落差"),
  t(
    "Writers create irony by opening a **gap** on purpose. For **situational irony**, set up an expectation and then reverse it: the fire chief's own notes catch fire during his safety speech. For **verbal irony**, give a character words that say the opposite of what the moment means: soaked by rain, he says, *What a perfect day for a walk.* For **dramatic irony**, let the reader know something and give a character a line that shows he does not: *Nothing can stop me now,* says the driver heading for a washed-out bridge.\n\nTwo choices never make irony. An ending that turns out as expected has no gap. A surprise that is simply unrelated, such as a bird landing nearby, is random, not a reversal of what was expected.",
    "作者有意制造**落差**来形成反讽。**情境反讽**是先建立一个预期，再把它颠倒：消防队长在讲防火安全时，自己的讲稿着了火。**言语反讽**是让人物说出与当时情形相反的话：被雨淋透的他说 *What a perfect day for a walk.* **戏剧反讽**是让读者知道某件事，再让人物说出一句显示他并不知道的话：开向被冲毁的桥的司机说 *Nothing can stop me now.*\n\n有两种选择永远构不成反讽：结果和预期一样的结局没有落差；与预期毫不相干的意外，比如一只鸟落在附近，只是随机事件，并没有颠倒预期。",
  ),
  kindedChoice(
    ["Read the situation and choose the answer to its question.", "阅读情境，回答其中的问题。"],
    ironyMakingBank,
    (right) => [
      `*${right}* It turns the situation against what was expected, meant or known, and that gap is what makes irony.`,
      `*${right}* 它让情境与预期、本意或人物所知相反，正是这种落差构成了反讽。`,
    ],
    [
      [
        "*{wrong}* is what anyone would expect, or what the character really means, so there is no gap and no irony.",
        "*{wrong}* 正是人们预料中的事，或者正是人物的本意，所以没有落差，也就没有反讽。",
      ],
      [
        "*{wrong}* is unrelated to what was expected. Irony needs a reversal of the expectation, not a random event.",
        "*{wrong}* 与预期毫不相干。反讽需要颠倒预期，而不是一件随机的事。",
      ],
    ],
  ),
);

/** foreshadowStep asks what a hint in a passage most likely foreshadows. */
export const foreshadowStep = point(
  "where-the-hint-points",
  t("Where the Hint Points", "暗示指向哪里"),
  t(
    "Once you notice a hint, ask **what it points to**. Foreshadowing works by connection: a first-aid kit left behind points to an injury; a branch no one cuts points to a fall; a warning laughed at points to the danger it named. The event it prepares is usually the one the hint is about, and it usually comes as a problem or a discovery.\n\nTwo readings go wrong. One jumps to an event that has nothing to do with the hint, such as a prize or a new hobby. The other reads the hint backward and predicts that all will be well, when the whole point of a warning ignored or a crack unrepaired is that trouble is on its way.",
    "注意到一个暗示后，要问**它指向什么**。伏笔靠联系起作用：被留下的急救包指向受伤；没人锯掉的树枝指向它的掉落；被嘲笑的警告指向它所说的危险。它所铺垫的事件通常就是暗示所涉及的那件事，而且往往以问题或发现的形式出现。\n\n有两种解读是错的。一种跳到与暗示毫无关系的事件上，比如得奖或新爱好。另一种把暗示读反了，预言一切都会顺利，而被忽视的警告、没修好的裂缝，其用意恰恰是麻烦就要来了。",
  ),
  kindedChoice(
    ["What does the detail in this passage most likely foreshadow?", "这段文字中的细节最可能预示什么？"],
    foreshadowBank,
    (right) => [
      `*${right}* The hint is about exactly this, so the event it prepares is the one it is connected to.`,
      `*${right}* 暗示讲的正是这件事，所以它所铺垫的就是与它相关的事件。`,
    ],
    [
      [
        "Nothing in the passage connects to *{wrong}* A hint foreshadows the event it is about.",
        "文段中没有任何内容与 *{wrong}* 相关。暗示预示的是它所涉及的事件。",
      ],
      [
        "*{wrong}* reads the hint backward: a warning ignored or a danger left alone points toward trouble, not away from it.",
        "*{wrong}* 把暗示读反了：被忽视的警告或无人理会的危险指向麻烦，而不是远离麻烦。",
      ],
    ],
  ),
);

/** explainStep asks which sentence explains how a quotation proves a claim. */
export const explainStep = point(
  "explaining-the-quotation",
  t("Explaining the Quotation", "解释引文"),
  t(
    "A quotation does not speak for itself. After it, write a sentence of **explanation** that shows *how* its words prove the claim. Point to the exact detail that matters and say what it reveals: *Stepping in front of the dog with only an umbrella shows she puts herself in danger for others, which is what bravery means.*\n\nTwo kinds of sentence look like explanations but are not. A **restatement** repeats the quotation in other words and adds nothing: the reader already knows what it says. A **drift** leaves the text for a personal opinion or a new topic, such as *I am afraid of dogs too*, and never connects the quotation to the claim.",
    "引文不会自己说话。引文之后，要写一句**解释**，说明它的词句*怎样*证明论点。指出关键的细节，并说明它揭示了什么：*Stepping in front of the dog with only an umbrella shows she puts herself in danger for others, which is what bravery means.*\n\n有两种句子看似解释，其实不是。**复述**只是换个说法重复引文，没有增加任何东西：读者已经知道它说了什么。**跑题**离开文本，转向个人看法或新话题，例如 *I am afraid of dogs too*，始终没有把引文和论点联系起来。",
  ),
  kindedChoice(
    ["Which sentence best explains how the quotation supports the claim?", "哪个句子最好地解释了引文怎样支持论点？"],
    explainBank,
    (right) => [
      `*${right}* It points to the detail that matters and says what that detail reveals, which links the quotation to the claim.`,
      `*${right}* 它指出了关键的细节，并说明这个细节揭示了什么，从而把引文和论点联系了起来。`,
    ],
    [
      [
        "*{wrong}* only repeats what the quotation says. An explanation must show how its words prove the claim.",
        "*{wrong}* 只是重复了引文的内容。解释必须说明引文的词句怎样证明论点。",
      ],
      [
        "*{wrong}* leaves the text for an opinion or a new topic, so it never connects the quotation to the claim.",
        "*{wrong}* 离开了文本，转向个人看法或新话题，所以始终没有把引文和论点联系起来。",
      ],
    ],
  ),
);
