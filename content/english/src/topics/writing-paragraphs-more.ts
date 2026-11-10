// More paragraphs for the topics of how sentences work together: each record feeds several knowledge points.

import type { ChoiceItem, OrderItem } from "@ga/subject-english";

/** ParagraphRecord is a short paragraph with sentences that do not belong in it, each kind serving a different knowledge point. */
export interface ParagraphRecord {
  /** topic states the paragraph's point. */
  readonly topic: string;
  /** details each support the point. */
  readonly details: readonly [string, string, string];
  /** vague is true of the subject but makes no point that the details support. */
  readonly vague: string;
  /** off is about another subject altogether. */
  readonly off: string;
  /** offPoint is about the same subject but does not support the point. */
  readonly offPoint: string;
}

const r = (topic: string, details: readonly [string, string, string], vague: string, off: string, offPoint: string): ParagraphRecord => ({
  topic,
  details,
  vague,
  off,
  offPoint,
});

/** paragraphRecords are the shared paragraphs. */
export const paragraphRecords: readonly ParagraphRecord[] = [
  r(
    "Rivers shape the land they flow through.",
    [
      "They carve deep valleys over time.",
      "They carry sand and drop it at their mouths.",
      "Their floods spread rich soil across the plains.",
    ],
    "Many rivers flow into the sea.",
    "My uncle bought a new truck.",
    "Some rivers are popular for fishing trips.",
  ),
  r(
    "Our school's new schedule gives students more time to rest.",
    ["Classes now start an hour later.", "Lunch is twenty minutes longer.", "There is a short break after every two classes."],
    "Every school has a schedule.",
    "Giraffes have very long necks.",
    "The old schedule was printed on yellow paper.",
  ),
  r(
    "Elephants use their trunks in many ways.",
    ["They lift heavy logs with them.", "They suck up water and spray it into their mouths.", "They greet one another by touching trunks."],
    "Elephants live in Africa and Asia.",
    "The baseball game was canceled because of rain.",
    "An elephant's large ears help it stay cool.",
  ),
  r(
    "Keeping a journal can make you a better writer.",
    ["Writing every day builds the habit.", "You learn to put feelings into words.", "Old entries show how much your writing has grown."],
    "People have kept journals for hundreds of years.",
    "The bakery sells fresh bread at seven.",
    "Journals with leather covers can be expensive.",
  ),
  r(
    "The Great Wall of China was built to protect the empire.",
    [
      "Soldiers watched for enemies from its towers.",
      "Its height slowed down attacking armies.",
      "Fires on the towers sent warnings across long distances.",
    ],
    "The Great Wall is in northern China.",
    "Tennis balls are often bright yellow.",
    "Today, millions of tourists visit the wall each year.",
  ),
  r(
    "Gardening is good for both body and mind.",
    ["Digging and lifting give your muscles a workout.", "Time outdoors lowers stress.", "Watching plants grow brings a sense of pride."],
    "Gardens can be large or small.",
    "My brother is learning to drive.",
    "The largest pumpkin ever grown weighed more than a ton.",
  ),
  r(
    "Hurricanes cause damage in several ways.",
    ["Strong winds tear roofs off houses.", "Heavy rain floods streets and homes.", "Waves push seawater far onto the land."],
    "Hurricanes form over warm oceans.",
    "Our class read a book about dragons.",
    "Each hurricane is given a name.",
  ),
  r(
    "Our town library needs a bigger building.",
    [
      "Its shelves are so full that new books sit in boxes.",
      "The reading room has seats for only twelve people.",
      "Story hour is held in a narrow hallway.",
    ],
    "The library is on Main Street.",
    "Penguins cannot fly.",
    "The library was named after the town's first teacher.",
  ),
  r(
    "Honey can stay good to eat for a very long time.",
    [
      "Jars of honey thousands of years old have been found still fit to eat.",
      "Its sugar keeps germs from growing.",
      "Bees also add a substance that fights germs.",
    ],
    "Honey is made by bees.",
    "The bus was late this morning.",
    "Honey comes in many colors, from pale gold to dark brown.",
  ),
  r(
    "Learning a second language has many benefits.",
    [
      "You can talk with more people when you travel.",
      "It can open doors to new jobs.",
      "It helps you understand your own language better.",
    ],
    "There are thousands of languages in the world.",
    "Our kitchen sink is leaking.",
    "Some languages are written from right to left.",
  ),
  r(
    "Wolves hunt as a team.",
    [
      "Some wolves chase a deer while others wait ahead.",
      "They take turns leading the chase to stay fresh.",
      "The whole pack shares the meal.",
    ],
    "Wolves are related to dogs.",
    "I like strawberry ice cream best.",
    "A wolf's howl can be heard miles away.",
  ),
  r(
    "The first day of middle school can be confusing.",
    [
      "Students must find their way around a large building.",
      "Each class has a different teacher and room.",
      "Locker combinations are hard to remember.",
    ],
    "Middle school comes after elementary school.",
    "Volcanoes pour out melted rock.",
    "Many middle schools have a band and a choir.",
  ),
  r(
    "Coral reefs are home to an enormous variety of life.",
    ["Thousands of kinds of fish swim among the coral.", "Crabs and shrimp hide in its cracks.", "Sea turtles visit the reefs to feed."],
    "Coral reefs are found in warm seas.",
    "My grandmother knits sweaters.",
    "Divers must be careful not to touch the coral.",
  ),
  r(
    "Bicycle helmets save lives.",
    [
      "They protect the head in a fall.",
      "Most serious bike injuries are to the head.",
      "Riders who wear helmets are far less likely to be badly hurt.",
    ],
    "Helmets come in many colors.",
    "The museum opens at ten.",
    "Some helmets have stickers of cartoon characters.",
  ),
  r(
    "The ancient Egyptians were skilled builders.",
    [
      "They raised huge pyramids from stone blocks.",
      "They lined up their buildings with the stars.",
      "Some of their temples still stand after four thousand years.",
    ],
    "Egypt is a country in Africa.",
    "Soccer is played with a round ball.",
    "The ancient Egyptians enjoyed board games.",
  ),
  r(
    "Our neighborhood cleanup was a great success.",
    ["Forty volunteers came to help.", "We filled sixty bags with trash.", "The park looked brand new by noon."],
    "Our neighborhood has many trees.",
    "Sharks have rows of sharp teeth.",
    "Last year's cleanup was held in the rain.",
  ),
  r(
    "Earthworms help gardens grow.",
    [
      "Their tunnels let air and water reach plant roots.",
      "They break down dead leaves into food for plants.",
      "Their droppings make the soil richer.",
    ],
    "Earthworms live underground.",
    "The movie was two hours long.",
    "Birds often pull earthworms from the lawn.",
  ),
  r(
    "Smartphones have changed the way people take photos.",
    [
      "Almost everyone now carries a camera.",
      "Pictures can be shared with friends in seconds.",
      "People take far more photos than they once did.",
    ],
    "Smartphones come in many sizes.",
    "Cows eat grass all day.",
    "Smartphone batteries need to be charged often.",
  ),
  r(
    "The desert is colder at night than many people expect.",
    [
      "Dry air cannot hold the heat of the day.",
      "No clouds keep the warmth near the ground.",
      "Temperatures can fall below freezing before dawn.",
    ],
    "Deserts cover large parts of the world.",
    "My friend plays the drums.",
    "Cactuses store water in their thick stems.",
  ),
  r(
    "Volunteering at the animal shelter taught me responsibility.",
    [
      "I had to arrive on time every Saturday.",
      "The dogs depended on me for their walks.",
      "I learned to keep careful records of each animal's meals.",
    ],
    "The shelter is near the river.",
    "Mountains are often covered with snow.",
    "The shelter's cats sleep in a sunny room.",
  ),
  r(
    "Trains are a good way to travel between cities.",
    [
      "They go straight to the center of town.",
      "Passengers can read or work during the trip.",
      "They use less fuel for each traveler than cars do.",
    ],
    "The first trains ran on steam.",
    "Bananas grow in warm places.",
    "Old train stations often have beautiful clocks.",
  ),
  r(
    "Some plants have clever ways to spread their seeds.",
    ["Dandelion seeds float away on the wind.", "Burrs hook onto the fur of passing animals.", "Coconuts can drift across the ocean."],
    "Plants grow from seeds.",
    "Our team won the spelling bee.",
    "Many seeds are good to eat.",
  ),
];

const order = (...sentences: readonly string[]): OrderItem => ({ sentences });

/** moreTimeOrder are paragraphs told in time order. */
export const moreTimeOrder: readonly OrderItem[] = [
  order(
    "First, choose a flat spot for the tent.",
    "Next, spread the ground cloth on it.",
    "Then push the poles through the sleeves of the tent.",
    "Finally, stake the corners into the ground.",
  ),
  order(
    "On Monday, the caterpillar hatched from a tiny egg.",
    "For two weeks, it ate leaves day and night.",
    "Then it hung upside down and formed a chrysalis.",
    "Ten days later, a butterfly crawled out.",
  ),
  order(
    "Before the game, Leo stretched his legs.",
    "During the first half, he scored a goal.",
    "At halftime, the coach praised the whole team.",
    "After the final whistle, they celebrated their win.",
  ),
  order(
    "Start by rinsing the dirty plates.",
    "Then load them into the dishwasher.",
    "After that, add the soap and close the door.",
    "Last, press the start button.",
  ),
  order(
    "In 1903, the Wright brothers made the first powered flight.",
    "About twenty years later, planes began carrying mail.",
    "By the 1950s, jets carried passengers across oceans.",
    "Today, millions of people fly every day.",
  ),
  order(
    "At dawn, the fishing boats left the harbor.",
    "By midmorning, their nets were full.",
    "In the afternoon, they sailed back to shore.",
    "That evening, the fish were sold at the market.",
  ),
  order(
    "First, write your name at the top of the page.",
    "Second, read each question carefully.",
    "Third, mark your answers in pencil.",
    "When you finish, hand the test to your teacher.",
  ),
  order(
    "In the spring, the farmer planted the seeds.",
    "All summer, the corn grew taller.",
    "In early fall, the ears were ready to pick.",
    "Over the winter, the field rested under the snow.",
  ),
  order(
    "Kim woke up late on the morning of the trip.",
    "She rushed to pack her bag.",
    "By the time she reached the station, the train was about to leave.",
    "She jumped on just as the doors closed.",
  ),
  order(
    "To make lemonade, first squeeze the juice from six lemons.",
    "Next, stir in a cup of sugar.",
    "Then add four cups of cold water.",
    "Finally, pour it over ice and serve it.",
  ),
  order(
    "When the storm began, the power went out.",
    "We lit candles while we waited.",
    "Two hours later, the lights flickered back on.",
    "By then, the rain had stopped.",
  ),
  order(
    "First, the baby bird pecks a hole in its shell.",
    "Then it slowly pushes the shell apart.",
    "Once it is free, it rests in the nest.",
    "Within hours, it is calling for food.",
  ),
  order(
    "On the first day of the hike, we climbed to the lake.",
    "On the second day, we crossed the high pass.",
    "On the third day, we walked down through the forest.",
    "By the fourth morning, we were back at the car.",
  ),
  order(
    "Begin by cutting the paper into a square.",
    "Fold it in half to make a triangle.",
    "Then fold the two corners up to the top.",
    "Finish by drawing eyes on the fox's face.",
  ),
  order(
    "Long ago, the town was a small fishing village.",
    "Later, a railroad brought new families.",
    "As the town grew, factories opened by the river.",
    "Now it is a busy city of half a million people.",
  ),
  order(
    "Ana saved her allowance for six months.",
    "In July, she finally had enough money.",
    "She went to the shop and chose a blue bike.",
    "That afternoon, she rode it around the park.",
  ),
  order(
    "First, the sun warms the water of the ocean.",
    "Then the water rises into the air as vapor.",
    "High in the sky, the vapor cools into clouds.",
    "Finally, it falls back to Earth as rain.",
  ),
  order(
    "At seven, the alarm rang.",
    "By seven-thirty, Sam had eaten breakfast.",
    "At eight, he caught the school bus.",
    "His first class began at half past eight.",
  ),
  order(
    "First, wet your hands with clean water.",
    "Next, rub soap over them for twenty seconds.",
    "Then rinse the soap away.",
    "Finally, dry your hands on a clean towel.",
  ),
  order(
    "The builders began by digging a deep hole.",
    "Next, they poured a concrete base.",
    "Once the base was hard, they raised the steel frame.",
    "Last of all, they added the walls and windows.",
  ),
  order(
    "In the morning, the class rode a bus to the museum.",
    "When they arrived, a guide showed them the dinosaur hall.",
    "After lunch, they visited the space exhibit.",
    "In the late afternoon, they rode the bus home.",
  ),
  order(
    "First, a seed is buried in damp soil.",
    "Soon, a tiny root pushes down.",
    "Then a shoot pushes up toward the light.",
    "Finally, the first leaves open in the sun.",
  ),
];

/** moreLogicOrder are paragraphs that open with their point and build from it. */
export const moreLogicOrder: readonly OrderItem[] = [
  order(
    "Sea turtles face many dangers.",
    "Their eggs are dug up by foxes and birds.",
    "The young turtles that hatch must race to the sea.",
    "Even there, many of them are eaten by fish.",
  ),
  order(
    "Our school started a recycling program last year.",
    "At first, few students used the new bins.",
    "So the student council made posters to explain the program.",
    "Since then, the amount of trash has dropped by half.",
  ),
  order(
    "Octopuses are masters of disguise.",
    "They can change the color of their skin in an instant.",
    "They can also change its texture to look like rock or coral.",
    "This helps them hide from both enemies and prey.",
  ),
  order(
    "Many people believe that goldfish forget everything in seconds.",
    "However, this is not true.",
    "Scientists have trained goldfish to push a lever for food.",
    "The fish remembered the trick for months.",
  ),
  order(
    "The bridge in our town was falling apart.",
    "Its wooden boards had begun to rot.",
    "The town decided to replace them with steel.",
    "The new bridge opened last summer.",
  ),
  order(
    "Lightning is a giant spark of electricity.",
    "It forms when charges build up inside a storm cloud.",
    "When the charge grows strong enough, it jumps to the ground.",
    "The heat of this jump makes the air burst with thunder.",
  ),
  order(
    "Our soccer field had a drainage problem.",
    "After every rain, it turned into a muddy pond.",
    "Parents raised money to put pipes under the grass.",
    "Now the field dries within an hour.",
  ),
  order(
    "Cats and dogs show affection in different ways.",
    "Dogs often wag their tails and jump up to greet you.",
    "Cats, on the other hand, may simply rub against your legs.",
    "Both, however, are telling you that they are glad you are home.",
  ),
  order(
    "Some birds travel thousands of miles each year.",
    "The Arctic tern is one example.",
    "It flies from the far north to the far south and back again.",
    "Over its life, this small bird may fly farther than to the Moon and back.",
  ),
  order(
    "Many students find it hard to stay focused while studying.",
    "One reason is their phones.",
    "Every message pulls their attention away from the work.",
    "A simple fix is to leave the phone in another room.",
  ),
  order(
    "The museum faced a serious problem.",
    "Its old roof was leaking onto the paintings.",
    "Workers moved the paintings to a dry room.",
    "Then they repaired the roof before the winter rains.",
  ),
  order(
    "Penguins are birds, but they cannot fly.",
    "Instead, their wings have become flippers.",
    "These flippers make them excellent swimmers.",
    "Some penguins can dive deeper than five hundred meters.",
  ),
  order(
    "People once thought that the Sun moved around the Earth.",
    "This idea seemed to match what they saw each day.",
    "Later, careful observations showed that it was wrong.",
    "Today we know that the Earth moves around the Sun.",
  ),
  order(
    "Our class wanted to raise money for new library books.",
    "We decided to hold a bake sale.",
    "It brought in more than three hundred dollars.",
    "With that money, the library bought forty new books.",
  ),
  order(
    "Bamboo is one of the fastest-growing plants on Earth.",
    "Some kinds can grow almost a meter in a single day.",
    "Because of this, it can be harvested again and again.",
    "That makes it a useful building material in many countries.",
  ),
  order(
    "Many towns have too many stray cats.",
    "These cats often go hungry and get sick.",
    "Some towns now catch them, treat them and find them homes.",
    "As a result, fewer cats live on the streets.",
  ),
  order(
    "Fog is simply a cloud near the ground.",
    "It forms when warm, damp air passes over cold land or water.",
    "The air cools, and its water turns into tiny drops.",
    "These drops hang in the air and make it hard to see.",
  ),
  order(
    "Our old classroom computers were very slow.",
    "Each one took ten minutes just to start.",
    "The school replaced them with new laptops in March.",
    "Since then, we have had much more time for our projects.",
  ),
  order(
    "Some people say that video games are a waste of time.",
    "However, certain games can teach useful skills.",
    "For example, puzzle games train players to plan ahead.",
    "Other games teach players to work as a team.",
  ),
  order(
    "The squirrel gets ready for winter in the fall.",
    "It gathers hundreds of nuts.",
    "It buries them in many hiding places.",
    "When snow covers the ground, it digs them up to eat.",
  ),
  order(
    "Our town's river was once badly polluted.",
    "Factories had dumped waste into it for years.",
    "Then a new law stopped the dumping.",
    "Today, fish swim in the river again.",
  ),
  order(
    "Ice is lighter than liquid water.",
    "That is why it floats on the top of a lake.",
    "This layer of ice keeps the water below from freezing.",
    "As a result, fish can survive the winter.",
  ),
];

/** moreMeaningTransitions are gaps for a transition of meaning. */
export const moreMeaningTransitions: readonly ChoiceItem[] = [
  ["The test was long. ___, most students finished early.", "However", ["For example", "In addition"]],
  ["The storm knocked down power lines. ___, the town was dark for two days.", "As a result", ["However", "For example"]],
  ["Some birds can copy speech. ___, parrots can learn dozens of words.", "For example", ["As a result", "However"]],
  ["The new phone has a better camera. ___, its battery lasts longer.", "In addition", ["However", "As a result"]],
  ["Maria practiced every day. ___, she won first place.", "As a result", ["For example", "In addition"]],
  ["Many fruits are rich in vitamins. ___, oranges are full of vitamin C.", "For example", ["However", "As a result"]],
  ["The hotel was close to the beach. ___, it served a free breakfast.", "In addition", ["As a result", "For example"]],
  ["The puppy looked fierce. ___, it was very gentle.", "However", ["In addition", "For example"]],
  ["The bridge was closed. ___, drivers had to take a long detour.", "As a result", ["However", "In addition"]],
  ["Some sports need very little gear. ___, running needs only a pair of shoes.", "For example", ["In addition", "However"]],
  ["Exercise makes your heart stronger. ___, it helps you sleep better.", "In addition", ["However", "For example"]],
  ["The movie got poor reviews. ___, it sold millions of tickets.", "However", ["As a result", "For example"]],
  ["The well dried up. ___, the villagers carried water from the river.", "As a result", ["For example", "In addition"]],
  ["Several planets have moons. ___, Jupiter has dozens of them.", "For example", ["However", "In addition"]],
  ["Our class collected cans for the food bank. ___, we made sandwiches for the shelter.", "In addition", ["As a result", "However"]],
  ["Penguins are birds. ___, they cannot fly.", "However", ["For example", "As a result"]],
  ["The factory closed. ___, many workers moved away.", "As a result", ["In addition", "However"]],
  [
    "Some inventions began as accidents. ___, the microwave oven was invented after a candy bar melted near a radar machine.",
    "For example",
    ["However", "In addition"],
  ],
  ["The library lends books for free. ___, it holds free classes on weekends.", "In addition", ["However", "As a result"]],
  ["The trail looked easy on the map. ___, it was steep and rocky.", "However", ["In addition", "As a result"]],
  ["The river flooded the fields. ___, the farmers lost their crops.", "As a result", ["For example", "However"]],
  ["Some animals change color with the seasons. ___, the arctic fox turns white in winter.", "For example", ["In addition", "As a result"]],
];

/** moreTimeTransitions are gaps for a transition of time. */
export const moreTimeTransitions: readonly ChoiceItem[] = [
  ["___, heat the oven. Then mix the batter.", "First", ["Finally", "Meanwhile"]],
  ["Pour the paint into a tray. ___, dip the roller in it.", "Next", ["Earlier", "First"]],
  ["We waited for hours at the airport. ___, our plane took off.", "Finally", ["First", "Earlier"]],
  ["Grandpa fixed the fence. ___, Grandma painted the shed on the other side of the yard.", "Meanwhile", ["Finally", "First"]],
  ["The team reached the summit at noon. ___ that day, they had crossed a frozen river.", "Earlier", ["Next", "Finally"]],
  ["Fill the pot with water. ___, put it on the stove.", "Then", ["Earlier", "Meanwhile"]],
  ["___, open the box. Then take out the instructions.", "First", ["Finally", "Earlier"]],
  ["Rinse the seeds. ___, leave them to dry in the sun.", "Next", ["Earlier", "Meanwhile"]],
  ["Jamal tried again and again. ___, he solved the puzzle.", "Finally", ["First", "Earlier"]],
  ["The guests ate dinner in the garden. ___, the cook was baking the cake in the kitchen.", "Meanwhile", ["First", "Finally"]],
  ["Today the house is quiet. ___ this week, it was full of visitors.", "Earlier", ["Next", "Finally"]],
  ["The ice melted in the sun. ___, the puddle dried up.", "Soon after", ["Earlier", "First"]],
  ["___, sort the clothes by color. Next, put the dark ones in the washer.", "First", ["Finally", "Meanwhile"]],
  ["Chop the onions. ___, fry them in oil.", "Next", ["First", "Earlier"]],
  ["We hiked all morning in the rain. ___, the clouds cleared and we saw the lake.", "Finally", ["First", "Earlier"]],
  ["The firefighters sprayed water on the flames. ___, the police kept the crowd back.", "Meanwhile", ["First", "Finally"]],
  ["Lin finished the race in first place. ___ that season, she had broken her ankle.", "Earlier", ["Next", "Meanwhile"]],
  ["Cut out the shapes. ___, glue them onto the card.", "Then", ["Earlier", "Meanwhile"]],
  ["Add the last of the flour. ___, knead the dough until it is smooth.", "Finally", ["First", "Earlier"]],
  ["The baby slept in her crib. ___, her parents quietly cleaned the kitchen.", "Meanwhile", ["Finally", "First"]],
  ["___, read the whole story. Then answer the questions.", "First", ["Finally", "Meanwhile"]],
  ["The rain began at noon. ___, the streets were flooded.", "Soon after", ["Earlier", "First"]],
];
