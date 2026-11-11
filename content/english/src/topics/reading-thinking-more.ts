// More texts for the topics of thinking about a text: shared records that several knowledge points ask about.

import type { ChoiceItem } from "@ga/subject-english";

/** Scene is a short scene with an inference, two that do not fit it, the clue that proves it and two details that prove nothing. */
export type Scene = readonly [
  scene: string,
  inference: string,
  misfits: readonly [string, string],
  clue: string,
  details: readonly [string, string],
];

/** scenes feed the knowledge points of making and proving inferences. */
export const scenes: readonly Scene[] = [
  [
    "Leo's dog barked at the door, and Leo grabbed the leash with a grin.",
    "Leo was about to take his dog for a walk.",
    ["Leo was going to bed.", "Leo was afraid of his dog."],
    "He grabbed the leash with a grin.",
    ["The dog had soft brown fur and one white paw.", "Leo lived in a small house."],
  ],
  [
    "The kitchen smelled of smoke, and the cookies on the tray were black.",
    "The cookies had baked too long.",
    ["The cookies came out perfectly.", "Someone had painted the cookies."],
    "The cookies on the tray were black.",
    ["The tray was made of metal.", "There were twelve cookies."],
  ],
  [
    "Ana wore a heavy coat, a scarf and mittens, and her breath made little clouds in the air.",
    "It was very cold outside.",
    ["It was a hot summer day.", "Ana was going swimming."],
    "Her breath made little clouds in the air.",
    ["Her scarf was red, with a pattern of little white stars.", "Ana walked to the corner."],
  ],
  [
    "When Dad came home, he dropped his bag, kicked off his shoes and fell asleep on the couch.",
    "Dad was very tired.",
    ["Dad was angry.", "Dad was about to go out again."],
    "He fell asleep on the couch as soon as he got home.",
    ["His bag was black.", "The couch was in the living room."],
  ],
  [
    "The playground was empty, the swings hung still, and puddles covered the slide.",
    "It had been raining.",
    ["It was the middle of recess.", "The slide had just been painted."],
    "Puddles covered the slide.",
    ["The playground had four swings, a slide and a sandbox.", "The slide was green."],
  ],
  [
    "Jen read the last page, closed the book slowly and hugged it to her chest.",
    "Jen loved the book.",
    ["Jen found the book boring.", "Jen had not started the book."],
    "She hugged the book to her chest.",
    ["The book had a blue cover.", "Jen was sitting in a chair."],
  ],
  [
    "Mr. Park looked at the flat tire, sighed and lifted the spare out of the trunk.",
    "Mr. Park was going to change the tire.",
    ["Mr. Park was going to sell the car.", "Mr. Park was pleased about the tire."],
    "He lifted the spare tire out of the trunk.",
    ["The car was parked on a quiet street lined with tall trees.", "Mr. Park wore a hat."],
  ],
  [
    "The crowd jumped to its feet and roared as the ball sailed over the fence.",
    "Someone had hit a home run.",
    ["The game had been canceled.", "The crowd was bored."],
    "The ball sailed over the fence.",
    ["The crowd sat in rows.", "The fence was painted white."],
  ],
  [
    "Sofia's alarm rang, but she pulled the blanket over her head and rolled over.",
    "Sofia did not want to get up.",
    ["Sofia was eager to start the day.", "Sofia's alarm was broken."],
    "She pulled the blanket over her head.",
    ["The alarm clock was on the small wooden table beside her bed.", "Sofia's blanket was soft."],
  ],
  [
    "Empty boxes filled the hallway, and the walls of the house were bare.",
    "The family was moving.",
    ["The family was having a party.", "The family had just decorated the house."],
    "Empty boxes filled the hallway.",
    ["The hallway was long.", "The house had two floors."],
  ],
  [
    "Ravi's shirt was spattered with paint, and a brush stuck out of his pocket.",
    "Ravi had been painting.",
    ["Ravi had been swimming.", "Ravi had just bought the shirt."],
    "His shirt was spattered with paint.",
    ["His shirt had a pocket on the front and long sleeves.", "Ravi was ten years old."],
  ],
  [
    "The waiter set down a cake with candles, and everyone at the table began to sing.",
    "Someone at the table was having a birthday.",
    ["The restaurant was closing.", "The waiter had made a mistake."],
    "The cake had candles, and everyone sang.",
    ["The table was near the window.", "The waiter wore an apron."],
  ],
  [
    "Max held his stomach, pushed his plate away and said he could not eat another bite.",
    "Max was full.",
    ["Max was still hungry.", "Max had not eaten anything."],
    "He said he could not eat another bite.",
    ["His plate was white with a thin blue line around the edge.", "Max sat at the end of the table."],
  ],
  [
    "The lights in the house were off, the curtains were closed, and newspapers piled up on the porch.",
    "The family was away.",
    ["The family was having a party.", "The family had just come home."],
    "Newspapers piled up on the porch.",
    ["The house had curtains.", "The porch was made of wood."],
  ],
  [
    "Lily's cheeks were red, her hair was wet with sweat, and she was breathing hard.",
    "Lily had been running.",
    ["Lily had been sleeping.", "Lily had been reading quietly."],
    "She was breathing hard, and her hair was wet with sweat.",
    ["Lily had long brown hair that she wore in a ponytail.", "Lily wore a green shirt."],
  ],
  [
    "The farmer looked up at the dark clouds, then hurried to bring the hay into the barn.",
    "The farmer expected rain.",
    ["The farmer was tired of farming.", "The sky was clear and sunny."],
    "He hurried the hay inside when he saw the dark clouds.",
    ["The barn was red.", "The farmer wore a hat."],
  ],
  [
    "Ella studied the map for a long time, then turned the car around.",
    "Ella had been going the wrong way.",
    ["Ella had reached the end of her trip.", "Ella was learning to draw maps."],
    "She turned the car around after studying the map.",
    ["The map was folded into a small square and kept in the glove box.", "The car was blue."],
  ],
  [
    "The baby cried and cried until her mother gave her a bottle, and then she smiled.",
    "The baby had been hungry.",
    ["The baby was afraid of her mother.", "The baby disliked milk."],
    "She stopped crying when she got a bottle.",
    ["The baby wore a pink hat.", "The bottle was plastic."],
  ],
  [
    "Carmen practiced the same song on the piano every day for a month before the concert.",
    "Carmen wanted to play well at the concert.",
    ["Carmen did not care about the concert.", "Carmen had never played the piano."],
    "She practiced the song every day for a month.",
    ["The piano was black and stood in the corner of the living room.", "The concert was in the town hall."],
  ],
  [
    "Grandpa squinted at the menu, then reached into his pocket for his glasses.",
    "Grandpa could not read the menu without his glasses.",
    ["Grandpa was not hungry.", "The menu was written in another language."],
    "He squinted at the menu before reaching for his glasses.",
    ["The menu was two pages long.", "Grandpa's jacket had pockets."],
  ],
  [
    "The teacher's desk was covered with flowers, cards and a big sign that said 'We'll miss you!'",
    "The teacher was leaving the school.",
    ["It was the first day of school.", "The teacher had just been hired."],
    "The sign said 'We'll miss you!'",
    ["The desk was made of dark wood and had three drawers on one side.", "The cards were different colors."],
  ],
  [
    "Water dripped from the ceiling into a bucket in the corner of the room.",
    "The roof was leaking.",
    ["Someone was watering the plants.", "The room was very dry."],
    "Water dripped from the ceiling.",
    ["The bucket was in the corner.", "The room had one window."],
  ],
];

/** Claims are two facts, two opinions and a sentence that persuades, all on one subject. */
export type Claims = readonly [facts: readonly [string, string], opinions: readonly [string, string], persuade: string];

/** claims feed the knowledge points of facts, opinions and persuasion. */
export const claims: readonly Claims[] = [
  [
    ["Sea turtles lay their eggs on beaches.", "Some sea turtles live for more than fifty years."],
    ["Sea turtles are the most graceful animals in the sea.", "Watching turtles hatch is more exciting than any movie."],
    "Keep the beaches dark for baby turtles!",
  ],
  [
    ["A bicycle has two wheels.", "Riding a bike uses no fuel."],
    ["Red bikes look better than blue ones.", "Biking is the most fun way to get to school."],
    "Leave the car at home and ride your bike to school this week!",
  ],
  [
    ["The Moon travels around the Earth.", "Astronauts first walked on the Moon in 1969."],
    ["The full moon is the loveliest sight in the night sky.", "Space travel is more exciting than sea travel."],
    "Come see the Moon through our telescope!",
  ],
  [
    ["Our library lends books for three weeks.", "The library has a reading room on the second floor."],
    ["The library's reading room is too cold.", "Mystery books are better than science books."],
    "Get your library card today and start reading!",
  ],
  [
    ["Aluminum cans can be recycled many times.", "Our town collects recycling on Thursdays."],
    ["Recycling is the most important thing a family can do.", "Sorting trash is boring."],
    "Put every can in the blue bin!",
  ],
  [
    ["Dogs can hear sounds that people cannot.", "Some dogs are trained to guide people who cannot see."],
    ["Dogs are the best friends a person could have.", "Small dogs are cuter than big dogs."],
    "Adopt a shelter dog this weekend!",
  ],
  [
    ["Children need about ten hours of sleep a night.", "The body grows during sleep."],
    ["Going to bed early is no fun.", "Nights are better than mornings."],
    "Turn off your screens an hour before bed!",
  ],
  [
    ["Carrots grow under the ground.", "Spinach contains iron."],
    ["Carrots taste better than peas.", "Spinach is the worst vegetable."],
    "Try a new vegetable at dinner tonight. Your body will thank you!",
  ],
  [
    ["The city museum has a dinosaur skeleton.", "The museum is open six days a week."],
    ["The dinosaur room is the most amazing room in the museum.", "Museums are more interesting than zoos."],
    "Come face to face with a real dinosaur!",
  ],
  [
    ["A piano has eighty-eight keys.", "The school band practices on Wednesdays."],
    ["Piano music is the most beautiful kind of music.", "Band practice is too long."],
    "Join the school band and make music with your friends!",
  ],
  [
    ["Salt water covers most of the Earth's surface.", "The Pacific Ocean is deeper than the Atlantic."],
    ["The ocean is scarier than the mountains.", "Beach vacations are the best kind."],
    "Help clean our beach on Saturday!",
  ],
  [
    ["School lunch is served at noon.", "The cafeteria serves milk with every meal."],
    ["Taco day is the best day of the week.", "The cafeteria's pizza is too greasy."],
    "Vote for more fresh fruit at lunch. Sign the petition today!",
  ],
  [
    ["A soccer match has two halves.", "The World Cup is held every four years."],
    ["Soccer is the most exciting sport to watch.", "Goalkeepers have the hardest job on the team."],
    "Sign up for the town soccer league and join the fun!",
  ],
  [
    ["Trees take in carbon dioxide.", "Some redwood trees are taller than a thirty-story building."],
    ["Redwoods are the most beautiful trees on Earth.", "Fall is the prettiest season for trees."],
    "Plant a tree on Earth Day and help our planet breathe!",
  ],
  [
    ["Snow is made of tiny crystals of ice.", "The town got twenty inches of snow last winter."],
    ["Snow days are the best days of the year.", "Shoveling snow is the worst chore."],
    "Help shovel the sidewalks after the next snow!",
  ],
  [
    ["Our class read twelve books this year.", "The book fair starts on Monday."],
    ["Adventure stories are more fun than poems.", "The book fair is the highlight of the school year."],
    "Come to the book fair and find your next favorite story!",
  ],
  [
    ["Bees make honey from nectar.", "A hive can hold tens of thousands of bees."],
    ["Honey is the tastiest treat in the world.", "Bees are scarier than spiders."],
    "Plant flowers to feed hungry bees!",
  ],
  [
    ["The train to the city leaves every hour.", "The trip takes forty minutes."],
    ["Trains are more relaxing than buses.", "The city is a better place to live than the country."],
    "Skip the traffic and take the train to the city!",
  ],
  [
    ["The park has a pond and two playgrounds.", "The park closes at sunset."],
    ["The park is the prettiest place in town.", "The new playground is too small."],
    "Help us buy new park benches!",
  ],
  [
    ["The art room has twenty easels.", "Mixing blue and yellow paint makes green."],
    ["Painting is more fun than drawing.", "Green is the nicest color."],
    "Enter the school art contest and show everyone what you can create!",
  ],
  [
    ["The human body is mostly water.", "Water boils at one hundred degrees Celsius."],
    ["Cold water tastes better than warm water.", "Drinking water is boring."],
    "Drink a glass of water with every meal to stay healthy and strong!",
  ],
  [
    ["Penguins cannot fly.", "Hummingbirds can fly backward."],
    ["Hummingbirds are the most charming birds.", "Penguins look silly when they walk."],
    "Hang a bird feeder this winter and help the birds survive the cold!",
  ],
];

/** morePurposeBank asks why texts were written. */
export const morePurposeBank: readonly ChoiceItem[] = [
  ["A guide explains how to care for a pet hamster.", "to inform", ["to persuade", "to entertain"]],
  ["A sign in the park asks people to pick up after their dogs to keep the grass clean.", "to persuade", ["to entertain", "to inform"]],
  ["A story tells about a mouse who wants to fly to the Moon.", "to entertain", ["to inform", "to persuade"]],
  ["An encyclopedia entry tells where tigers live and what they eat.", "to inform", ["to entertain", "to persuade"]],
  ["A speech urges classmates to vote for a longer lunch break.", "to persuade", ["to inform", "to entertain"]],
  ["A joke book is full of riddles about animals.", "to entertain", ["to persuade", "to inform"]],
  ["A news report tells what happened at the town meeting.", "to inform", ["to persuade", "to entertain"]],
  ["An ad claims that Zippy sneakers will make you the fastest kid in school.", "to persuade", ["to entertain", "to inform"]],
  ["A poem tells a silly tale about a hat that will not stay on.", "to entertain", ["to inform", "to persuade"]],
  ["A chart shows how many students ride the bus each day.", "to inform", ["to entertain", "to persuade"]],
  [
    "A letter to the principal argues that students should be allowed to keep water bottles in class.",
    "to persuade",
    ["to inform", "to entertain"],
  ],
  ["A comic shows a robot trying to learn to dance.", "to entertain", ["to persuade", "to inform"]],
  ["A recipe card lists the steps for making soup.", "to inform", ["to persuade", "to entertain"]],
  ["A poster begs readers to adopt a cat from the shelter.", "to persuade", ["to entertain", "to inform"]],
  ["A play tells about two friends who get lost in a funny maze.", "to entertain", ["to inform", "to persuade"]],
  ["A museum sign tells when the old ship was built and who sailed it.", "to inform", ["to entertain", "to persuade"]],
  ["A review tells readers that they must not miss the new movie.", "to persuade", ["to inform", "to entertain"]],
  ["A tall tale tells about a farmer who grew a pumpkin as big as a barn.", "to entertain", ["to persuade", "to inform"]],
  ["A weather report gives tomorrow's temperature and chance of rain.", "to inform", ["to persuade", "to entertain"]],
  ["A flyer tells families that they should walk to school on Fridays to cut traffic.", "to persuade", ["to entertain", "to inform"]],
  ["A story tells about a girl who finds a dragon egg in her garden.", "to entertain", ["to inform", "to persuade"]],
  ["A science page explains why leaves change color in the fall.", "to inform", ["to entertain", "to persuade"]],
];

/** Telling is one scene told in the first person and in the third, with the third-person character's name and something else in the scene. */
export type Telling = readonly [first: string, third: string, name: string, other: string];

/** tellings feed the knowledge points of point of view and of who tells a story. */
export const tellings: readonly Telling[] = [
  [
    "I tripped over my shoelace and dropped my lunch tray.",
    "Marco tripped over his shoelace and dropped his lunch tray.",
    "Marco",
    "the lunch tray",
  ],
  [
    "We built a snow fort and defended it all afternoon.",
    "The cousins built a snow fort and defended it all afternoon.",
    "one of the cousins",
    "the snow fort",
  ],
  ["My heart pounded as I opened the envelope.", "Priya's heart pounded as she opened the envelope.", "Priya", "the envelope"],
  ["I found an old key buried in our backyard.", "Ethan found an old key buried in his backyard.", "Ethan", "the old key"],
  ["Our team cheered when I scored the winning point.", "Her team cheered when Kayla scored the winning point.", "Kayla", "the team"],
  ["I had never seen the ocean until I turned nine.", "Nils had never seen the ocean until he turned nine.", "Nils", "the ocean"],
  [
    "We whispered in the dark until Mom told us to go to sleep.",
    "The sisters whispered in the dark until their mom told them to go to sleep.",
    "one of the sisters",
    "their mom",
  ],
  [
    "My little brother followed me everywhere I went.",
    "Dev's little brother followed him everywhere he went.",
    "Dev",
    "the little brother",
  ],
  [
    "I raised my hand, but the teacher called on someone else.",
    "Lea raised her hand, but the teacher called on someone else.",
    "Lea",
    "the teacher",
  ],
  [
    "The storm knocked out our power, so we played cards by candlelight.",
    "The storm knocked out the Garcias' power, so they played cards by candlelight.",
    "one of the Garcias",
    "the storm",
  ],
  [
    "I could smell the bread baking before I reached the bakery.",
    "Sam could smell the bread baking before he reached the bakery.",
    "Sam",
    "the baker",
  ],
];

/** moreTraitBank asks for a trait that actions show. */
export const moreTraitBank: readonly ChoiceItem[] = [
  ["Kai waited quietly for twenty minutes while his little sister tied her shoes by herself.", "patient", ["impatient", "bossy"]],
  ["Every day, Lena fed the class fish and watered the plants without being asked.", "responsible", ["lazy", "rude"]],
  ["Arturo turned an old cardboard box into a castle with towers and a drawbridge.", "creative", ["careless", "timid"]],
  ["Ruth thanked the bus driver every single morning.", "polite", ["rude", "selfish"]],
  ["Even when the other kids teased him, Ian stood by his friend.", "loyal", ["selfish", "timid"]],
  ["In one week, Pia left her jacket at school, her lunch on the bus and her homework at home.", "forgetful", ["careful", "responsible"]],
  ["Noah lay on the couch all Saturday while his brothers raked the leaves.", "lazy", ["hardworking", "helpful"]],
  ["Sara smiled at every new student and invited each one to sit with her.", "friendly", ["shy", "rude"]],
  ["Leo tapped his foot and groaned every time the line moved slowly.", "impatient", ["patient", "gentle"]],
  ["Dina spent every recess practicing her cartwheel until she could do it perfectly.", "determined", ["lazy", "careless"]],
  ["When his classmate dropped her books, Malik stopped to help pick them up.", "helpful", ["selfish", "bossy"]],
  ["June told the teacher that she had copied an answer, even though no one had seen her do it.", "honest", ["sneaky", "lazy"]],
  ["Oscar would not try the high dive and stayed close to the wall of the pool.", "timid", ["brave", "bossy"]],
  ["Faith shared her new markers with everyone at her table.", "generous", ["selfish", "forgetful"]],
  ["Tariq interrupted the speaker and laughed at her mistakes.", "rude", ["polite", "patient"]],
  ["Mei held the baby bird gently in both hands and set it softly back in its nest.", "gentle", ["rough", "lazy"]],
  ["Victor rushed through his test without reading the questions.", "careless", ["careful", "patient"]],
  ["Hugo kept asking why the sky changes color at sunset.", "curious", ["bored", "rude"]],
  ["Amara swam out into the cold lake to help a swimmer who had a cramp.", "brave", ["timid", "lazy"]],
  ["Ellie hummed songs and smiled even on gray, rainy days.", "cheerful", ["grumpy", "shy"]],
  ["Ray worked in his father's shop every afternoon after school and on weekends.", "hardworking", ["lazy", "forgetful"]],
  ["Zara solved in minutes the puzzle that had stumped everyone else.", "clever", ["careless", "timid"]],
];

/** moreFeelingBank asks for a feeling that actions and faces show. */
export const moreFeelingBank: readonly ChoiceItem[] = [
  ["Lucas stomped his feet and threw his cap on the ground when the game was canceled.", "angry", ["calm", "proud"]],
  ["Bella hugged her new bike and could not stop smiling.", "thrilled", ["bored", "worried"]],
  ["Sam's hands shook as he walked up to the stage.", "nervous", ["bored", "proud"]],
  ["Nora sat alone on the bench and stared at the ground after her team lost.", "disappointed", ["excited", "proud"]],
  ["Hiro yawned, rubbed his eyes and rested his head on the desk.", "tired", ["excited", "angry"]],
  ["Kara held her breath and squeezed her eyes shut as the roller coaster climbed.", "scared", ["bored", "proud"]],
  ["Pablo kept watching the door and asking when his dad would be home from his long trip.", "eager", ["bored", "embarrassed"]],
  ["Iris covered her face with her hands when she realized she had called the teacher Mom.", "embarrassed", ["proud", "angry"]],
  ["Andre puffed out his chest when the coach praised his catch.", "proud", ["ashamed", "frightened"]],
  ["Lena tapped her pencil and sighed as the clock ticked slowly toward three.", "bored", ["thrilled", "frightened"]],
  ["Tom frowned and checked the map again and again, but the street names did not match.", "confused", ["proud", "relaxed"]],
  ["Gia lay in the hammock, listening to the waves, with a smile on her face.", "relaxed", ["furious", "nervous"]],
  ["Will paced the hallway outside the hospital room, waiting for news about his grandmother.", "worried", ["cheerful", "bored"]],
  ["Ada gasped, and her mouth fell open when everyone jumped out and shouted 'Surprise!'", "surprised", ["bored", "angry"]],
  ["Ken looked at the floor and mumbled sorry after breaking his sister's toy.", "ashamed", ["proud", "excited"]],
  ["Mira glared at her brother, who had eaten the last cookie.", "annoyed", ["grateful", "calm"]],
  ["Ty laughed and spun in circles in the first snow of the year.", "joyful", ["gloomy", "nervous"]],
  ["Rina wrote a long thank-you note to the neighbor who had found her lost cat.", "grateful", ["annoyed", "bored"]],
  ["Jon kept checking under his bed and would not let anyone turn off the light.", "afraid", ["proud", "bored"]],
  ["Maya watched the other children playing together and wished someone would ask her to join.", "lonely", ["proud", "angry"]],
  ["Eli kicked a stone and muttered that it was not fair he had to stay inside.", "grumpy", ["cheerful", "proud"]],
  ["Sofia beamed and hugged her teacher when she heard that she had won the spelling bee.", "delighted", ["disappointed", "nervous"]],
];

/** Fable is a short story with its lesson, two facts from it that are not lessons, and a one-sentence story of another kind that teaches the same lesson. */
export type Fable = readonly [story: string, lesson: string, facts: readonly [string, string], gist: string];

/** fables feed the knowledge points of finding a lesson and choosing a story for one. */
export const fables: readonly Fable[] = [
  [
    "Two squirrels found a big pile of acorns. One ate all he could and napped. The other buried acorns all fall. When snow covered the ground, only the second squirrel had food.",
    "Plan ahead for hard times.",
    ["The squirrels found a big pile of acorns before the winter came.", "Snow covered the ground."],
    "A girl saves part of her allowance each week and has money when her bike needs a new tire.",
  ],
  [
    "A proud peacock laughed at a plain brown sparrow. When a hawk swooped down, the sparrow hid easily in the bushes, but the peacock's bright tail gave it away, and it barely escaped.",
    "Do not judge others by their looks.",
    ["The sparrow was brown.", "A hawk swooped down."],
    "A boy laughs at a classmate's old shoes, then learns that she is the fastest runner in the school.",
  ],
  [
    "A little goat and a big goat met in the middle of a narrow log over a stream. Both pushed, and both fell into the cold water. The next day, one waited while the other crossed, and both stayed dry.",
    "Taking turns works better than fighting.",
    ["The log over the stream was narrow, and the water below it was cold.", "The water was cold."],
    "Two children who both want the swing agree to take turns, and both get to play.",
  ],
  [
    "A mouse helped a lost ant find its way home. Weeks later, the mouse was trapped under a heavy branch in the rain, and a hundred ants came to dig her free.",
    "A kindness may come back to you.",
    ["The ant was lost.", "It was raining."],
    "A girl helps a new student find his classes, and later he helps her with a hard project.",
  ],
  [
    "A rooster told the other animals that his crowing made the sun rise. One morning he overslept, and the sun rose anyway. The other animals laughed at him for weeks.",
    "Boasting can make you look foolish.",
    ["The rooster overslept one morning, and the sun rose anyway.", "The sun rose."],
    "A boy brags that he never misses a basket, then misses every shot in front of his friends.",
  ],
  [
    "A beaver began a dam alone and gave up when the stream washed his sticks away. The next spring, his whole family worked on it together, and the dam held through every storm.",
    "Working together can do what one cannot do alone.",
    ["The stream washed the sticks away.", "It was spring."],
    "A class cleans up a whole park in an hour by working side by side.",
  ],
  [
    "A spider started her web nine times, and each time the wind tore it apart. On the tenth try, she built it behind a rock, and it held.",
    "Keep trying, and learn from each failure.",
    ["The wind tore the spider's web apart nine times.", "There was a rock."],
    "A boy fails his swimming test twice, practices harder and passes on his third try.",
  ],
  [
    "A rabbit lied to get the last carrot in the field. When the other rabbits found out, they stopped sharing their food with her.",
    "Lying can cost you the trust of others.",
    ["There was one carrot left.", "The rabbits shared food."],
    "A girl lies about breaking a borrowed toy, and her friends stop lending her things.",
  ],
  [
    "A dog had a good bone but wanted the bone of every other dog too. While he chased them around the yard, a crow flew off with his own bone.",
    "Wanting too much can make you lose what you have.",
    ["The dog had a good bone, and a crow flew off with it.", "A crow flew away."],
    "A boy who tries to win every prize at the fair spends all his money and goes home with nothing.",
  ],
  [
    "An owl listened carefully before she spoke, while the jay chattered all day long. Whenever the forest animals had a problem, they went to the owl.",
    "People respect those who listen before they speak.",
    ["The jay chattered.", "The owl lived in the forest."],
    "A quiet student listens to everyone's ideas and is chosen to lead the group.",
  ],
  [
    "A young deer ignored his mother's warning and drank from the river at night. A loud splash in the dark sent him running home, and from then on he listened to her.",
    "Listen to the advice of those who know more.",
    ["The young deer drank from the river at night and heard a loud splash.", "It was night."],
    "A girl ignores her coach's advice to stretch first and hurts her leg in the race.",
  ],
  [
    "A turtle and a bird argued all summer about whose home was better. When a storm blew the bird's nest away, the turtle let the bird shelter beside him under a log.",
    "Help others even when you disagree with them.",
    ["A storm came.", "There was a log."],
    "Two neighbors who have argued for years about a fence help each other clean up after a flood.",
  ],
  [
    "Two friends found a wallet full of money. One wanted to keep it, but the other carried it to its owner, who thanked them both and gave them a reward.",
    "Honesty pays off.",
    ["The wallet was full of money.", "There were two friends."],
    "A boy hands back the extra change a shopkeeper gave him, and the shopkeeper trusts him from then on.",
  ],
  [
    "A small fish wanted to see the whole ocean and swam away from the reef alone. A shark chased him all the way back, and he learned why his school of fish stayed together.",
    "There is safety in staying with your group.",
    ["The fish lived on a reef.", "A shark chased him."],
    "A hiker leaves her group to explore alone, gets lost and is glad to find the others again.",
  ],
  [
    "A young bear wanted to catch fish but hated waiting. Each time a fish swam near, he splashed and scared it away. His grandmother sat still for an hour and caught three.",
    "Patience brings results.",
    ["The bear wanted fish.", "His grandmother sat still for an hour and caught three fish."],
    "A girl waits quietly by the feeder for an hour and finally sees the rare bird she was hoping for.",
  ],
  [
    "A clever monkey and a strong elephant each thought they were better than the other. To reach the fruit across the river, the elephant carried the monkey, and the monkey climbed to the high branches for both.",
    "Everyone has different strengths.",
    ["There was a river.", "The fruit was high up."],
    "On a class project, one student draws and another writes, and together they make the best poster.",
  ],
  [
    "Every day, a cricket said he would fix the hole in his roof tomorrow. When the rain came, his house flooded.",
    "Do not put off what needs doing.",
    ["The cricket's roof had a hole, and his house flooded when the rain came.", "The rain came."],
    "A boy keeps putting off his science project and has to stay up all night before it is due.",
  ],
  [
    "A cat broke a vase and blamed the dog, and the dog was punished. That night the cat felt so sorry that she could not sleep, and she brought the dog her favorite toy.",
    "Blaming others for your mistakes hurts them and you.",
    ["The vase broke.", "The dog was punished."],
    "A girl lets her brother take the blame for a broken plate and feels terrible all week.",
  ],
  [
    "A young eagle was afraid to leave the nest. His mother told him that the sky was his to fly. At last he jumped, flapped hard and soared.",
    "You will not know what you can do until you try.",
    ["The young eagle lived in a nest, and his mother told him the sky was his.", "His mother spoke to him."],
    "A shy boy finally tries out for the school play and wins a leading part.",
  ],
  [
    "Two mice found one piece of cheese and fought over it until it rolled into a crack where neither could reach it.",
    "When people fight over something, everyone may lose.",
    ["There was one piece of cheese.", "There was a crack."],
    "Two brothers fight over a kite until it tears, and neither can fly it.",
  ],
  [
    "A young ant tried to carry a crumb twice her size. When the other ants offered to help, she refused, slipped and dropped the crumb into a puddle.",
    "It is wise to accept help when you need it.",
    ["The crumb was twice the size of the young ant.", "There was a puddle."],
    "A boy refuses help with a heavy box, drops it and breaks what is inside.",
  ],
  [
    "A frog at the bottom of a well thought that his well was the whole world. A bird told him about seas and mountains, but he only laughed. He never left the well, and he never learned more.",
    "Keep an open mind about what you do not know.",
    ["The frog lived in a well.", "A bird visited him."],
    "A man who is sure the old ways are best refuses to hear about a new kind of seed and watches his neighbors' crops grow larger.",
  ],
];

/** moreSimileBank asks what a simile means. */
export const moreSimileBank: readonly ChoiceItem[] = [
  ["The gym floor was as slippery as ice after it was waxed.", "very slippery", ["frozen", "cold"]],
  ["Her backpack was as heavy as a rock.", "very heavy", ["gray", "made of stone"]],
  ["The kitten's fur was like silk.", "soft and smooth", ["made of cloth", "shiny and expensive"]],
  ["After the long hike, he slept like a log.", "deeply, without moving", ["in a pile of wood", "lightly and restlessly"]],
  ["The twins are as alike as two peas in a pod.", "almost exactly the same", ["small and green", "living in a garden"]],
  ["The new teacher was as busy as a bee.", "very busy", ["buzzing loudly", "yellow and black"]],
  ["The thunder boomed like a drum.", "loud and deep", ["made of skin", "played by a band"]],
  ["Her eyes sparkled like stars.", "bright and shining", ["far away", "only out at night"]],
  ["The old man was as wise as an owl.", "very wise", ["awake at night", "covered in feathers"]],
  ["The cookie was as hard as a brick.", "very hard", ["red", "square"]],
  ["The dancer moved as lightly as a feather.", "lightly and gracefully", ["covered in feathers", "slowly and heavily"]],
  ["The sand on the beach was like a hot stove.", "very hot", ["used for cooking", "square and metal"]],
  ["My little brother is as stubborn as a mule.", "very stubborn", ["hairy", "strong enough to carry bags"]],
  ["The night was as black as coal.", "very dark", ["burning", "dirty"]],
  ["The puppy was as playful as a kitten.", "very playful", ["covered in whiskers", "very small"]],
  ["The ice cream melted like a snowman in spring.", "quickly and completely", ["into the shape of a snowman", "very cold"]],
  ["Her laugh rang out like a bell.", "clear and bright", ["made of metal", "every hour"]],
  ["The crowded hall was as hot as a desert.", "very hot", ["sandy", "empty"]],
  ["The crowd poured through the gates like water.", "smoothly and in great numbers", ["wet", "slowly, a few at a time"]],
  ["The child's cheeks were as red as apples.", "very red", ["round and sweet", "ripe"]],
  ["Grandpa's hands were as rough as sandpaper.", "very rough", ["used for sanding wood", "brown"]],
  ["The car's engine purred like a cat.", "quietly and smoothly", ["furry", "loudly and roughly"]],
];

/** moreMetaphorBank asks what a metaphor means. */
export const moreMetaphorBank: readonly ChoiceItem[] = [
  ["The garden was a rainbow of tulips.", "full of many bright colors", ["made of light and shaped like an arch", "wet with rain"]],
  ["Her bedroom is a pigsty.", "very messy", ["full of pigs", "small and pink"]],
  ["The test was a mountain I had to climb.", "very hard", ["very tall", "made of rock"]],
  ["My dad is a walking encyclopedia.", "he knows a great deal", ["he is made of paper", "he walks a lot"]],
  ["The kids were monkeys on the playground.", "wild and full of energy", ["furry", "eating bananas and climbing trees"]],
  ["The city at night was a sea of lights.", "full of countless lights", ["under water", "blue and wavy"]],
  ["His angry words were knives.", "they hurt", ["they were sharp metal tools", "they were used for cooking"]],
  ["The baby's laugh was music to my ears.", "very pleasant to hear", ["played on a piano", "very loud"]],
  ["The hallway was an oven in July.", "very hot", ["used for baking", "dark"]],
  ["Our neighbor has a heart of gold.", "she is very kind", ["her heart is made of metal", "she is very rich"]],
  ["The moon was a silver coin in the sky.", "round and shining", ["worth a lot of money to whoever finds it", "falling"]],
  ["Life is a roller coaster.", "full of ups and downs", ["a ride at a fair", "always fast"]],
  ["The coach was a drill sergeant at practice.", "strict and demanding", ["in the army", "loud and funny"]],
  ["The library was a treasure chest of stories.", "full of valuable things to discover", ["made of wood", "locked with a key"]],
  ["My memory is a sieve.", "I forget many things", ["it is made of metal", "it is full of water"]],
  ["The fog was a gray blanket over the town.", "a thick, covering layer", ["warm and soft, so the town felt cozy", "made of wool"]],
  ["Her brother is a night owl.", "he stays up late", ["he has feathers", "he hunts mice"]],
  ["After the ice storm, the playground was a skating rink.", "very icy and slippery", ["full of skaters", "a building for sports"]],
  ["Words are bridges between people.", "they connect people", ["they are made of stone", "they cross rivers"]],
  [
    "The highway was a parking lot this morning.",
    "the traffic was barely moving",
    ["it was a place to leave cars", "the traffic was very fast"],
  ],
  ["The low test scores were a wake-up call for the team.", "a warning to change", ["an alarm clock", "a phone call"]],
  [
    "Grandma's kitchen is the heart of our home.",
    "the most important, lively place",
    ["it pumps blood", "it is in the middle of the house"],
  ],
];

/** Idiom is an idiom with its meaning, a sentence using it with two readings that do not fit, and a sentence with a gap for it. */
export type Idiom = readonly [
  idiom: string,
  meaning: readonly [en: string, zh: string],
  sentence: string,
  misreadings: readonly [string, string],
  gap: string,
];

/** idioms feed the knowledge points of what idioms mean and choosing one. */
export const idioms: readonly Idiom[] = [
  [
    "once in a blue moon",
    ["very rarely", "极少，难得一次"],
    "Our town gets snow only once in a blue moon.",
    ["when the moon looks blue", "every winter"],
    "My uncle lives far away, so we see him only ___.",
  ],
  [
    "out of the blue",
    ["suddenly and unexpectedly", "突然、出乎意料地"],
    "Out of the blue, the old dog began to bark at the door.",
    ["from the blue sky", "slowly and quietly"],
    "We had not heard from Ana in years, and then she called ___.",
  ],
  [
    "on the fence",
    ["unable to decide", "犹豫不决"],
    "Dad is on the fence about buying a new car.",
    ["sitting on a fence", "sure of his choice"],
    "I can't decide which club to join; I'm still ___.",
  ],
  [
    "in the same boat",
    ["in the same difficult situation", "处境相同（都有困难）"],
    "When the power went out, the whole street was in the same boat.",
    ["sailing together", "much better off"],
    "Everyone in class found the test hard, so we were all ___.",
  ],
  [
    "a drop in the bucket",
    ["a tiny amount compared with what is needed", "杯水车薪，与所需相比微不足道"],
    "Our bake sale money was a drop in the bucket compared with the cost of a new gym.",
    ["water in a pail", "more than enough"],
    "Ten dollars is ___ when the roof repair costs thousands.",
  ],
  [
    "back to square one",
    ["back to the start", "回到起点"],
    "The computer crashed and deleted my story, so I was back to square one.",
    ["standing on a square", "almost finished"],
    "The rain washed away our sand castle, so we were ___.",
  ],
  [
    "the last straw",
    ["the last of many problems, after which someone loses patience", "压垮骆驼的最后一根稻草"],
    "When the dog chewed his new shoes, it was the last straw for Mr. Ruiz.",
    ["a piece of hay", "a small, happy surprise"],
    "Spilling the paint was ___, and Dad finally sent us outside.",
  ],
  [
    "in a nutshell",
    ["in a few words", "简而言之"],
    "In a nutshell, the plan is to save money and buy a boat.",
    ["inside a nut", "with every detail"],
    "The story, ___, is about a girl who finds her way home.",
  ],
  [
    "on thin ice",
    ["in a risky position", "处境危险"],
    "Kim was on thin ice after breaking two of her mother's rules.",
    ["skating on a frozen lake", "completely safe"],
    "After three late assignments, Sam is ___ with his teacher.",
  ],
  [
    "a blessing in disguise",
    ["something that seemed bad but turned out well", "因祸得福"],
    "Losing the game was a blessing in disguise, because the team began to practice harder.",
    ["a gift wearing a costume", "a total disaster"],
    "Missing the bus was ___, because I met my best friend while walking.",
  ],
  [
    "up in the air",
    ["not yet decided", "悬而未决"],
    "The date of the trip is still up in the air.",
    ["floating in the sky", "already fixed"],
    "Our plans for the weekend are ___ until we know the weather.",
  ],
  [
    "all ears",
    ["listening eagerly", "洗耳恭听"],
    "When Grandpa began his story, the children were all ears.",
    ["had very big ears", "bored and restless"],
    "Tell me about your trip. I am ___.",
  ],
  [
    "hit the books",
    ["to study hard", "用功读书"],
    "With exams next week, Maya has to hit the books.",
    ["to strike books with her hand", "to take a long break"],
    "The test is on Monday, so I need to ___ this weekend.",
  ],
  [
    "hold your horses",
    ["wait and slow down", "别急，慢一点"],
    "Hold your horses! We need to read the instructions first.",
    ["grab some horses", "hurry up"],
    "Wait, ___! Let me finish explaining first.",
  ],
  [
    "call it a day",
    ["to stop working for now", "今天就到此为止"],
    "After eight hours of digging, the workers decided to call it a day.",
    ["to phone someone", "to start early"],
    "We have painted for six hours, so let's ___.",
  ],
  [
    "hit the road",
    ["to leave on a trip", "出发、上路"],
    "We will hit the road at dawn to beat the traffic.",
    ["to strike the pavement", "to stay home"],
    "It's getting dark, so we should ___.",
  ],
  [
    "see eye to eye",
    ["to agree", "看法一致"],
    "Ben and his brother never see eye to eye about music.",
    ["to look at each other", "to sing together"],
    "My sister and I rarely ___ about which movie to watch.",
  ],
  [
    "cold feet",
    ["a sudden fear that makes someone want to back out", "临阵退缩的紧张"],
    "Tom got cold feet just before his first speech.",
    ["his feet were cold", "he felt eager and ready"],
    "Jen wanted to sing in the show, but she got ___ at the last minute.",
  ],
  [
    "keep an eye on",
    ["to watch over", "照看"],
    "Please keep an eye on your little sister at the park.",
    ["to stare with one eye", "to ignore"],
    "Could you ___ the soup while I answer the door?",
  ],
  [
    "feeling blue",
    ["feeling sad", "心情低落"],
    "Rosa was feeling blue after her best friend moved away.",
    ["turning blue", "feeling cheerful"],
    "Since his team lost the final, Leo has been ___.",
  ],
  [
    "a couch potato",
    ["someone who sits and watches a lot of TV", "整天窝在沙发上看电视的人"],
    "Don't be a couch potato on such a sunny day!",
    ["a vegetable on a sofa", "someone who exercises all day"],
    "My cousin is ___ who watches cartoons all weekend.",
  ],
  [
    "cut corners",
    ["to do something cheaply or carelessly to save time or money", "偷工减料"],
    "The builders cut corners, and the roof soon leaked.",
    ["trimmed the edges of the roof", "worked with great care"],
    "If you ___ when you build a birdhouse, it may fall apart.",
  ],
];
