// Reading: finding what an informational text says and seeing how it is organized.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-english";
import {
  causeRecords,
  infoRecords,
  moreCompareWords,
  moreDifferenceBank,
  moreFeatureBank,
  moreFeatureJobBank,
  moreFirstBank,
  moreSignalBank,
  moreSolutionBank,
  type Structure,
} from "./reading-informational-more.ts";

const mainIdeaBank: readonly ChoiceItem[] = [
  [
    "Sea otters often float on their backs. They sleep this way, holding paws so they do not drift apart. They also eat on their backs, using their bellies as tables, and mothers carry their babies on their chests.",
    "Sea otters do many things while floating on their backs.",
    ["Sea otters hold paws when they sleep.", "Sea otters live in the ocean."],
  ],
  [
    "A city park is more than grass and trees. Families have picnics there on weekends. Runners and bikers use its paths every morning. In summer, the park holds free concerts at night.",
    "A city park gives people many ways to spend their time.",
    ["Runners use the park every morning.", "Parks are full of grass and trees."],
  ],
  [
    "Camels are well suited to the desert. Their humps store fat that they can live on when food is scarce. Long lashes keep sand out of their eyes, and wide feet keep them from sinking into the sand.",
    "Camels have features that help them live in the desert.",
    ["Camels store fat in their humps.", "Deserts are hot and sandy."],
  ],
  [
    "The first bicycles had no pedals. Riders pushed along with their feet. Later bicycles had a huge front wheel that was hard to climb onto. Over many years, bicycles became the safe, simple machines we ride today.",
    "Bicycles changed a great deal over time.",
    ["The first bicycles had no pedals.", "Riding a bicycle is good exercise."],
  ],
  [
    "Ants work together in a colony. Some ants gather food and carry it home. Others take care of the eggs and young. Soldier ants guard the nest from enemies.",
    "Each ant in a colony has a job that helps the group.",
    ["Soldier ants guard the nest.", "Ants are very small insects."],
  ],
  [
    "Recycling paper helps the planet. Fewer trees have to be cut down to make new paper. Less trash ends up in landfills. Making paper from old paper also uses less water and energy.",
    "Recycling paper is good for the environment in several ways.",
    ["Fewer trees are cut down.", "Paper is made from trees."],
  ],
  [
    "Octopuses are clever animals. They can open jars to reach food inside. Some have escaped from their tanks at night and crawled back before morning. In tests, they learn to solve puzzles quickly.",
    "Octopuses are very intelligent.",
    ["Octopuses can open jars.", "Octopuses live in tanks."],
  ],
  [
    "A good night's sleep matters for students. Rested students pay attention better in class. They remember more of what they learn. They are also less likely to get sick.",
    "Sleep helps students in many ways.",
    ["Rested students remember more.", "Students go to school during the day."],
  ],
  [
    "Lighthouses kept sailors safe for hundreds of years. Their bright lamps warned ships away from rocks at night. In fog, many lighthouses sounded loud horns. Each one flashed its own pattern, so sailors could tell where they were.",
    "Lighthouses helped protect ships and sailors.",
    ["Lighthouses sounded horns in fog.", "Sailors travel on ships."],
  ],
];

const titleBank: readonly ChoiceItem[] = [
  [
    "Honeybees fly from flower to flower to collect nectar. Back at the hive, they turn the nectar into honey and store it in wax cells for the winter.",
    "How Bees Make Honey",
    ["Flowers of the Field", "Cold Winters"],
  ],
  [
    "Before a storm, gather a flashlight, water and food that does not need cooking. Charge your phone, and keep a radio with fresh batteries nearby.",
    "Getting Ready for a Storm",
    ["The History of Radios", "Cooking Without a Stove"],
  ],
  [
    "Penguins cannot fly, but they are fast swimmers. Their wings work like flippers, and their smooth bodies slip easily through the cold water.",
    "Penguins in the Water",
    ["Birds That Fly South", "Cold Places of the World"],
  ],
  [
    "Long ago, people wrote on clay tablets, then on papyrus and later on paper made from rags. Today, many people write on screens.",
    "How Writing Materials Changed",
    ["Making Clay Pots", "The Best Computer Screens"],
  ],
  [
    "To plant a seed, make a small hole in the soil, drop the seed in and cover it. Water it gently, and set the pot in a sunny window.",
    "How to Plant a Seed",
    ["Why the Sun Is Hot", "Kinds of Pots"],
  ],
  [
    "Tigers are the largest cats in the world. Each tiger's stripes are different, like a fingerprint, and the stripes help it hide in tall grass.",
    "Facts About Tigers",
    ["Pets That Purr", "Grasslands of Asia"],
  ],
  [
    "Our school garden grows tomatoes, beans and squash. Every class takes a turn weeding and watering, and the food is served in the lunchroom.",
    "Our School Garden",
    ["Healthy Lunches", "How Tomatoes Grow"],
  ],
  [
    "The Moon has no air, so there is no wind or rain to wear away footprints. The marks left by astronauts may last for millions of years.",
    "Footprints That Last on the Moon",
    ["Weather on Earth", "How to Become an Astronaut"],
  ],
  [
    "Some trees live for thousands of years. One bristlecone pine in California is older than the pyramids of Egypt.",
    "Very Old Trees",
    ["The Pyramids of Egypt", "Trees of California"],
  ],
];

const supportBank: readonly ChoiceItem[] = [
  [
    "Main idea: Owls are skilled night hunters.",
    "Their large eyes let in a great deal of light.",
    ["Some owls live in barns.", "Owls are a kind of bird."],
  ],
  [
    "Main idea: Walking to school has real benefits.",
    "Walkers get exercise before class begins.",
    ["The school opens at eight o'clock.", "Some students ride the bus."],
  ],
  [
    "Main idea: Spiders are useful to people.",
    "They eat insects that damage crops.",
    ["Some people are afraid of spiders.", "Spiders have eight legs."],
  ],
  [
    "Main idea: The library is a busy place on Saturdays.",
    "Story hour fills the children's room every week.",
    ["The library was built long ago.", "Books are kept on shelves."],
  ],
  [
    "Main idea: Rain forests are home to many kinds of living things.",
    "Thousands of kinds of insects live in a single patch of forest.",
    ["Rain forests are found near the equator.", "It is hot in the desert."],
  ],
  [
    "Main idea: Dogs can be trained to help people.",
    "Some dogs guide people who cannot see.",
    ["Dogs come in many sizes.", "Cats like to sleep in the sun."],
  ],
  [
    "Main idea: Winter can be hard for wild animals.",
    "Food is difficult to find under the snow.",
    ["Children like to build snowmen.", "Winter comes after autumn."],
  ],
  [
    "Main idea: The old bridge needs to be repaired.",
    "Large cracks run along its sides.",
    ["The bridge crosses a river.", "Many people drive cars."],
  ],
  [
    "Main idea: Coral reefs are in danger.",
    "Warmer ocean water is turning many reefs white.",
    ["Coral reefs are very colorful.", "Fish swim in the ocean."],
  ],
];

const summaryBank: readonly ChoiceItem[] = [
  [
    "Monarch butterflies travel a very long way each autumn. Millions fly from Canada and the United States to forests in Mexico. There they rest on trees through the winter. In spring, they head north again.",
    "Monarch butterflies fly south to Mexico for the winter and return north in spring.",
    ["Monarch butterflies rest on trees.", "Monarch butterflies are orange and black, and they are beautiful."],
  ],
  [
    "Glass is made from sand. The sand is heated until it melts into a hot liquid. Workers shape the liquid by blowing or pressing it. When it cools, it hardens into glass.",
    "Glass is made by melting sand, shaping it and letting it cool.",
    ["Glass breaks easily.", "Workers blow into hot liquid."],
  ],
  [
    "Earthworms help gardens. Their tunnels let air and water reach plant roots. They eat dead leaves and leave behind waste that makes the soil rich.",
    "Earthworms improve garden soil with their tunnels and waste.",
    ["Earthworms live underground.", "Gardens need water and sun."],
  ],
  [
    "The Wright brothers built bicycles before they built airplanes. They studied how birds fly and tested gliders for years. In 1903, their airplane made the first powered flight.",
    "After years of study and testing, the Wright brothers made the first powered airplane flight.",
    ["The Wright brothers built bicycles.", "Birds fly by flapping their wings."],
  ],
  [
    "Many birds build nests to protect their eggs. Robins shape cups of mud and grass. Some swallows use mud alone. Eagles pile up sticks into huge nests high in trees.",
    "Different birds build different kinds of nests to protect their eggs.",
    ["Eagles build nests in trees.", "Birds lay eggs in the spring."],
  ],
  [
    "Before refrigerators, people kept food cold with ice. Workers cut blocks of ice from frozen lakes in winter. They stored the ice in sawdust so it lasted into summer.",
    "Before refrigerators, people cut and stored lake ice to keep food cold.",
    ["Lakes freeze in winter.", "Sawdust comes from wood."],
  ],
  [
    "Volunteers cleaned up the beach on Saturday. They picked up bottles, bags and old fishing nets. By noon, they had filled forty bags of trash.",
    "Volunteers removed forty bags of trash from the beach on Saturday.",
    ["Fishing nets are made of rope.", "The beach is a fun place to visit."],
  ],
  [
    "Hummingbirds are the smallest birds. Their wings beat so fast that they hum. They can fly backward and hover in place while they drink nectar from flowers.",
    "Hummingbirds are tiny birds with wings that let them hum, hover and fly backward.",
    ["Hummingbirds drink nectar.", "Many birds visit flowers in gardens."],
  ],
];

const featureBank: readonly ChoiceItem[] = [
  ["You want to know what the word *larva* means in a science book.", "the glossary", ["the table of contents", "a caption"]],
  ["You want to find which page tells about frogs in a book about animals.", "the index", ["the glossary", "a heading"]],
  ["You want to see the names of a book's chapters in order.", "the table of contents", ["the index", "a caption"]],
  ["You want to know what a photo in an article shows.", "the caption", ["the glossary", "the table of contents"]],
  ["You want to know what a section of an article will be about before you read it.", "the heading", ["the index", "the glossary"]],
  ["You want to see where the rivers of a country are.", "a map", ["a heading", "the glossary"]],
  ["You want to compare the heights of five mountains at a glance.", "a chart", ["a caption", "the table of contents"]],
  ["You want to see the parts of a flower with their names.", "a labeled diagram", ["the index", "a heading"]],
  ["You want to know when each event in a history book happened, in order.", "a timeline", ["the glossary", "a caption"]],
];

const featureJobBank: readonly ChoiceItem[] = [
  [
    "glossary",
    "It gives the meanings of special words in the book.",
    ["It lists the chapters in order.", "It tells what a picture shows."],
  ],
  [
    "index",
    "It lists topics in alphabetical order with the pages where they appear.",
    ["It gives the meanings of words.", "It names the parts of a drawing."],
  ],
  [
    "table of contents",
    "It lists the chapters or sections and the pages where they begin.",
    ["It gives the meanings of special words.", "It shows events in time order."],
  ],
  ["caption", "It explains what a photo or picture shows.", ["It lists the pages of a topic.", "It gives the title of the whole book."]],
  ["heading", "It tells what the section below it is about.", ["It explains what a photo shows.", "It gives the meaning of a word."]],
  [
    "bold print",
    "It makes an important word stand out, often one in the glossary.",
    ["It shows where a chapter begins.", "It tells when events happened."],
  ],
  [
    "timeline",
    "It shows events in the order they happened, with their dates.",
    ["It shows where places are.", "It lists the chapters of a book."],
  ],
  [
    "labeled diagram",
    "It shows the parts of something, with their names.",
    ["It gives the dates of events.", "It lists topics in alphabetical order."],
  ],
  ["map", "It shows where places are and how they are arranged.", ["It explains what a word means.", "It shows events in time order."]],
];

const signalBank: readonly ChoiceItem[] = [
  ["First, crack the eggs into a bowl. ___, stir in the milk.", "Next", ["Because", "However"]],
  ["We packed the car in the morning. ___, we drove to the lake.", "Then", ["Unlike", "Although"]],
  ["The caterpillar ate for weeks. ___, it made a chrysalis.", "After that", ["For example", "Instead"]],
  ["Mix the paint and test the color. ___, paint the wall.", "Finally", ["But", "Since"]],
  ["___ the bell rang, the students lined up at the door.", "As soon as", ["Unless", "However"]],
  ["Read the directions carefully ___ you begin the test.", "before", ["because", "unlike"]],
  ["The seed sprouted in March. ___, it was taller than the fence.", "By August", ["For example", "On the other hand"]],
  ["She brushed her teeth. ___, she climbed into bed.", "Afterward", ["Similarly", "Because"]],
  ["___ the bread is in the oven, set a timer for twenty minutes.", "Once", ["Although", "Like"]],
];

const firstBank: readonly ChoiceItem[] = [
  [
    "After the rain stopped, the children ran outside. Before that, they had played games inside all morning. Later, they found worms on the sidewalk.",
    "The children played games inside.",
    ["The children ran outside.", "The children found worms."],
  ],
  [
    "Maya mailed the letter on Friday. She had written it on Wednesday and bought a stamp on Thursday.",
    "Maya wrote the letter.",
    ["Maya bought a stamp.", "Maya mailed the letter."],
  ],
  [
    "The frog laid its eggs in the pond. The eggs hatched into tadpoles. Weeks later, the tadpoles grew legs.",
    "The frog laid eggs.",
    ["The tadpoles grew legs.", "The eggs hatched."],
  ],
  [
    "Before the game, the team stretched. During the game, Leo scored twice. After the game, everyone ate pizza.",
    "The team stretched.",
    ["Leo scored twice.", "Everyone ate pizza."],
  ],
  [
    "By the time Dad got home, the soup was ready. Sam had chopped the carrots an hour earlier and then put them in the pot.",
    "Sam chopped the carrots.",
    ["Dad got home.", "The soup was ready."],
  ],
  [
    "The museum opened in 1950. Ten years before, the city had bought the land. In 1975, a new wing was added.",
    "The city bought the land.",
    ["The museum opened.", "A new wing was added."],
  ],
  [
    "We watched the sunset from the hill. Earlier, we had hiked up the trail and set up our tent at the top.",
    "We hiked up the trail.",
    ["We set up our tent.", "We watched the sunset."],
  ],
  [
    "Grandma planted the apple tree when Mom was a girl. Now the tree is tall, and we pick apples from it every fall.",
    "Grandma planted the tree.",
    ["We pick apples.", "The tree grew tall."],
  ],
  [
    "When the power came back on, the lights flickered. The storm had knocked out the power three hours before, while we were eating dinner.",
    "The storm knocked out the power.",
    ["The power came back on.", "The lights flickered."],
  ],
];

const causeBank: readonly ChoiceItem[] = [
  ["The road was icy, so the buses ran late.", "The road was icy.", ["The buses ran late.", "The buses were new."]],
  ["Because Ben forgot his umbrella, he got soaked on the way home.", "Ben forgot his umbrella.", ["Ben got soaked.", "Ben walked home."]],
  [
    "The plants on the windowsill wilted since no one had watered them.",
    "No one had watered the plants.",
    ["The plants wilted.", "The plants were on the windowsill."],
  ],
  [
    "As a result of the heavy rain, the river flooded the fields.",
    "There was heavy rain.",
    ["The river flooded the fields.", "The fields were planted."],
  ],
  [
    "The crowd cheered loudly when the runner crossed the finish line.",
    "The runner crossed the finish line.",
    ["The crowd cheered.", "The crowd was large."],
  ],
  ["Due to a broken pipe, the school closed early.", "A pipe broke.", ["The school closed early.", "The school is old."]],
  [
    "The milk went sour because it was left out all day.",
    "The milk was left out all day.",
    ["The milk went sour.", "The milk was in a glass."],
  ],
  ["The wind blew hard, and the old fence fell over.", "The wind blew hard.", ["The fence fell over.", "The fence was painted."]],
  [
    "Since the store had a sale, the line stretched around the block.",
    "The store had a sale.",
    ["The line stretched around the block.", "The store was on a corner."],
  ],
];

const effectBank: readonly ChoiceItem[] = [
  [
    "Beavers build dams across streams. The water backs up behind the dam and forms a pond. Fish, frogs and birds then move in.",
    "A pond forms, and new animals move in.",
    ["Beavers build dams.", "The stream gets faster."],
  ],
  [
    "Last spring, the town planted trees along Main Street. Now the street is shady and cooler in summer.",
    "The street is shadier and cooler.",
    ["The town planted trees.", "The street gets hotter."],
  ],
  [
    "Lena practiced the piano every day for a month. At the recital, she played her piece without a mistake.",
    "She played without a mistake at the recital.",
    ["She practiced every day.", "She forgot her piece."],
  ],
  [
    "A volcano erupted on the island. Ash covered the fields, and farmers could not plant crops that year.",
    "Farmers could not plant crops that year.",
    ["The volcano erupted.", "The fields grew more crops."],
  ],
  [
    "The class left the hamster's cage open. By morning, the hamster was hiding behind the bookshelf.",
    "The hamster got out and hid behind the bookshelf.",
    ["The class left the cage open.", "The hamster stayed in its cage."],
  ],
  [
    "There was no rain for three months. The lake shrank, and boats could no longer reach the dock.",
    "The lake shrank, and boats could not reach the dock.",
    ["There was no rain.", "The lake overflowed."],
  ],
  [
    "The library started staying open until nine. Many more students now come in the evening to study.",
    "More students come to study in the evening.",
    ["The library stays open later.", "The library closes earlier."],
  ],
  [
    "A storm knocked down power lines. Homes in the valley had no electricity for two days.",
    "Homes had no electricity for two days.",
    ["A storm knocked down power lines.", "The valley got new power lines."],
  ],
  [
    "Jon left his bike out in the rain all week. Its chain turned orange with rust.",
    "The chain rusted.",
    ["Jon left his bike out.", "The chain got cleaner."],
  ],
];

const compareWordBank: readonly ChoiceItem[] = [
  ["Frogs have smooth, wet skin. ___, toads have dry, bumpy skin.", "In contrast", ["Similarly", "Next"]],
  ["Lions live in groups. ___, wolves live and hunt in packs.", "Likewise", ["However", "First"]],
  ["___ her brother, Ana loves spicy food.", "Unlike", ["Because of", "After"]],
  ["Both cats ___ dogs can be trained to come when called.", "and", ["but", "so"]],
  ["Summer days are long, ___ winter days are short.", "while", ["because", "and then"]],
  ["Bats fly at night. Owls, ___, hunt after dark.", "too", ["instead", "first"]],
  ["The first test was easy. The second, ___, was very hard.", "however", ["also", "next"]],
  ["Just ___ a camera, the eye has a lens that focuses light.", "like", ["unlike", "because"]],
  [
    "Paper bags break down quickly. Plastic bags, ___, can last for hundreds of years.",
    "on the other hand",
    ["in the same way", "as a result"],
  ],
];

/** alikeWords are the answers of compareWordBank that show likeness. */
const alikeWords = new Set([
  "Likewise",
  "and",
  "too",
  "like",
  ...moreCompareWords.filter(([, alike]) => alike).map(([[, right]]) => right),
]);

const differenceBank: readonly ChoiceItem[] = [
  [
    "Alligators and crocodiles are both large reptiles that live near water. Alligators have wide, rounded snouts. Crocodiles have long, pointed snouts.",
    "the shape of their snouts",
    ["where they live", "whether they are reptiles"],
  ],
  [
    "Both oranges and lemons are citrus fruits with thick peels. Oranges taste sweet, while lemons taste sour.",
    "how they taste",
    ["the kind of fruit they are", "the thickness of their peels"],
  ],
  [
    "Rabbits and hares look alike, with long ears and strong back legs. Rabbits are born without fur, but hares are born with fur and open eyes.",
    "what they are like at birth",
    ["the length of their ears", "the strength of their legs"],
  ],
  [
    "Both the Arctic and the Antarctic are icy and cold. The Arctic is an ocean surrounded by land, but the Antarctic is land surrounded by ocean.",
    "whether they are land or ocean",
    ["how cold they are", "whether they are icy"],
  ],
  [
    "Butterflies and moths both have wings covered in tiny scales. Most butterflies fly during the day, while most moths fly at night.",
    "the time of day they fly",
    ["what covers their wings", "whether they have wings"],
  ],
  [
    "Both the violin and the cello have four strings and are played with a bow. A violin is held under the chin, while a cello stands on the floor.",
    "how they are held",
    ["the number of strings", "whether a bow is used"],
  ],
  [
    "Both bees and wasps can sting. Bees have fuzzy bodies and collect pollen, while wasps have smooth bodies and hunt other insects.",
    "what their bodies are like and what they eat",
    ["whether they can sting", "whether they are insects"],
  ],
  [
    "Mars and Earth both have seasons and polar ice caps. Earth has thick air and liquid oceans, but Mars has thin air and no oceans.",
    "their air and water",
    ["whether they have seasons", "whether they have ice caps"],
  ],
];

const structureBank: readonly ChoiceItem[] = [
  [
    "First, the farmer plows the field. Next, she plants the seeds in rows. After several weeks of watering, she finally harvests the corn.",
    "sequence",
    ["compare and contrast", "problem and solution"],
  ],
  [
    "Too many cars crowded the streets near the school every morning. To fix this, the town started a walking group led by parents. Now far fewer cars come.",
    "problem and solution",
    ["sequence", "description"],
  ],
  [
    "Because the winter was very dry, the forest floor was covered with dead leaves. As a result, a small spark started a large fire.",
    "cause and effect",
    ["compare and contrast", "description"],
  ],
  [
    "Both ponds and lakes are bodies of still water. However, lakes are deeper, and sunlight cannot reach their bottoms, while it reaches the bottom of a pond.",
    "compare and contrast",
    ["sequence", "cause and effect"],
  ],
  [
    "The giant panda has thick black-and-white fur. Its round face has black patches around the eyes. It has strong jaws and a special thumb for gripping bamboo.",
    "description",
    ["problem and solution", "sequence"],
  ],
  [
    "Our classroom was too noisy for reading. We decided to make a quiet corner with pillows and a rug, and now students read there in peace.",
    "problem and solution",
    ["cause and effect", "compare and contrast"],
  ],
  [
    "Heavy rains fell for a week. The soil on the hill became soaked, so a large section slid down and blocked the road.",
    "cause and effect",
    ["description", "sequence"],
  ],
  [
    "Cats sleep much of the day, while dogs are usually awake when their owners are. Cats often like to be alone, but most dogs enjoy company.",
    "compare and contrast",
    ["description", "problem and solution"],
  ],
  [
    "The Statue of Liberty stands on an island in New York Harbor. It is made of copper that has turned green. The statue holds a torch in her raised right hand.",
    "description",
    ["cause and effect", "sequence"],
  ],
];

const structureWhy = new Map<string, string>([
  ["sequence", "It tells steps or events in order, with words such as *first, next* and *finally*."],
  ["problem and solution", "It names a problem and then tells how it was solved."],
  ["cause and effect", "It tells why something happened, with words such as *because* and *as a result*."],
  ["compare and contrast", "It tells how two things are alike and different, with words such as *both, however* and *while*."],
  ["description", "It tells what something is like, detail by detail, with no order of time or reasons."],
]);
const structureWhyZh = new Map<string, string>([
  ["sequence", "它按顺序讲述步骤或事件，用了 *first, next, finally* 这样的词。"],
  ["problem and solution", "它先提出一个问题，再说明怎样解决。"],
  ["cause and effect", "它说明事情发生的原因，用了 *because, as a result* 这样的词。"],
  ["compare and contrast", "它说明两样东西的异同，用了 *both, however, while* 这样的词。"],
  ["description", "它一个细节一个细节地描述某样东西，没有时间顺序，也没有因果。"],
]);

const solutionBank: readonly ChoiceItem[] = [
  [
    "Deer kept eating the vegetables in the Parks' garden. Mr. Park built a tall fence around it, and the vegetables grew safely all summer.",
    "Building a tall fence",
    ["Planting more vegetables", "Feeding the deer"],
  ],
  [
    "The class pet fish kept getting sick because the tank was dirty. The students made a chart so that a different pair cleaned the tank each week.",
    "Taking turns cleaning the tank with a chart",
    ["Buying a new fish", "Moving the tank"],
  ],
  [
    "Many people in the village had to walk hours to get water. Volunteers dug a well in the center of the village, so water was close to every home.",
    "Digging a well in the village",
    ["Walking for hours", "Buying bottled water"],
  ],
  [
    "Lucy kept forgetting her homework at home. She began packing her bag every night before bed and setting it by the door.",
    "Packing her bag each night",
    ["Asking for more time", "Doing her homework at school"],
  ],
  [
    "The playground got so muddy after rain that no one could play. The school spread wood chips over the dirt, and the mud stayed underneath.",
    "Spreading wood chips over the dirt",
    ["Closing the playground", "Waiting for it to dry"],
  ],
  [
    "Birds kept flying into the library's big glass windows. The librarians stuck bird shapes on the glass so the birds could see it and fly around.",
    "Putting bird shapes on the windows",
    ["Removing the windows", "Feeding the birds"],
  ],
  [
    "The team's old bus broke down before every away game. The families held a bake sale and raised enough money to repair it.",
    "Holding a bake sale to pay for repairs",
    ["Canceling the away games", "Walking to the games"],
  ],
  [
    "Sam's little brother could not reach the sink to wash his hands. Sam and his dad built a sturdy wooden step for him.",
    "Building a wooden step",
    ["Washing his hands for him", "Moving the sink"],
  ],
];

const structures: readonly Structure[] = ["sequence", "problem and solution", "cause and effect", "compare and contrast", "description"];

const recordMainIdea = infoRecords.map((r): ChoiceItem => [r.text, r.main, [r.detail, r.general]]);
const recordTitle = infoRecords.map((r): ChoiceItem => [r.text, r.title, [...r.badTitles]]);
const recordSupport = infoRecords.map((r): ChoiceItem => [`Main idea: ${r.main}`, r.detail, [r.general, r.aside]]);
const recordSummary = infoRecords.map((r): ChoiceItem => [r.text, r.summary, [r.detail, r.opinion]]);
const recordStructure = infoRecords.map((r, i): ChoiceItem => {
  const others = structures.filter((s) => s !== r.structure);
  return [r.text, r.structure, [others[i % 4]!, others[(i + 1) % 4]!]];
});
const recordCause = causeRecords.map(([text, cause, effect, detail]): ChoiceItem => [text, cause, [effect, detail]]);
const recordEffect = causeRecords.map(([text, cause, effect, , opposite]): ChoiceItem => [text, effect, [cause, opposite]]);

/** Say gives the feedback for a wrong option, in English and Chinese. */
type Say = (wrong: string, right: string, shown: string, position: number) => readonly [string, string];

const pick = (
  question: [string, string],
  bank: readonly ChoiceItem[],
  en: (right: string) => string,
  zh: (right: string) => string,
  not: Say,
) =>
  choiceGenerator(
    t(question[0], question[1]),
    bank,
    (right) => t(en(right), zh(right)),
    (wrong, right, shown, position) => t(...not(wrong, right, shown, position)),
  );

/** meaning looks up the feedback for a wrong label; a label with no entry is a mistake in the bank. */
const meaning =
  (says: Readonly<Record<string, readonly [string, string]>>): Say =>
  (wrong) => {
    const said = says[wrong];
    if (!said) throw new Error(`no feedback for the label ${wrong}`);
    return said;
  };

const mainIdeaNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `*${wrong}* is one detail from the paragraph. The main idea is what all the details together are about.`,
        `*${wrong}* 只是段落里的一个细节。主旨是所有细节合起来讲的内容。`,
      ]
    : [
        `*${wrong}* is a general fact that the paragraph does not explain. Its details add up to something more specific.`,
        `*${wrong}* 是段落并没有展开说明的泛泛事实。段落的细节合起来讲的是更具体的内容。`,
      ];

const titleNot: Say = (wrong) => [
  `*${wrong}* fits a word or two of the text at most, not what the whole text is about.`,
  `*${wrong}* 最多只和文中的一两个词有关，而不是整段文字讲的内容。`,
];

const supportNot: Say = (wrong) => [
  `*${wrong}* may be true, but it gives no reason to believe the main idea. A supporting detail shows that the main idea is right.`,
  `*${wrong}* 也许是真的，但它不能让人相信主旨。支持性细节要能说明主旨是对的。`,
];

const summaryNot: Say = (wrong) => [
  `*${wrong}* leaves out the main points of the text, or adds what the text does not say. A summary gives the main points briefly, without opinions.`,
  `*${wrong}* 漏掉了文本的要点，或者加了文中没有的内容。摘要要简短地讲出要点，不加个人看法。`,
];

const featureNot = meaning({
  "the table of contents": [
    "**The table of contents** lists the chapters in order with their first pages. It does not explain words, pictures or exact topics.",
    "**the table of contents（目录）**按顺序列出章节和起始页码，不解释词语、图片或具体的话题。",
  ],
  "a caption": [
    "**A caption** only explains the photo or picture it sits under.",
    "**a caption（图片说明）**只解释它下面或旁边的那张照片或图画。",
  ],
  "the glossary": [
    "**The glossary** gives the meanings of special words, and nothing else.",
    "**the glossary（词汇表）**只给出专门词语的意思。",
  ],
  "a heading": ["**A heading** only tells what the one section below it is about.", "**a heading（小标题）**只说明它下面那一节讲什么。"],
  "the index": [
    "**The index** lists topics in alphabetical order with their pages. It does not show the chapters in order or explain words.",
    "**the index（索引）**按字母顺序列出话题和页码，不按顺序列章节，也不解释词语。",
  ],
});

/** featureName names the feature an item asks about, whether it is shown alone or with the book it belongs to. */
const featureName = (shown: string) => (shown.includes(",") ? shown.slice(0, shown.indexOf(",")) : `the ${shown}`);

const featureJobNot: Say = (wrong, _right, shown) => [
  `*${wrong}* is the job of a different text feature, not of ${featureName(shown)}.`,
  `*${wrong}* 是另一种文本特征的作用，不是 ${featureName(shown)} 的作用。`,
];

const signalNot: Say = (wrong) => [
  `*${wrong}* does not tell when something happens: it links ideas in another way, such as a reason, a contrast or a likeness. The blank needs a word of time order.`,
  `*${wrong}* 不表示时间：它用别的方式连接意思，比如原因、对比或相似。空格处需要一个表示时间顺序的词。`,
];

const firstNot: Say = (wrong) => [
  `*${wrong}* happened later. Words such as *before*, *earlier* and *had* show what came first, even when the text tells it later.`,
  `*${wrong}* 发生得更晚。*before*、*earlier*、*had* 这样的词表明哪件事先发生，即使文中后面才讲到它。`,
];

const causeNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [`*${wrong}* is the effect, what happened. The cause is why it happened.`, `*${wrong}* 是结果，即发生了什么。原因是它为什么会发生。`]
    : [
        `*${wrong}* is a detail of the sentence, but it did not make anything happen.`,
        `*${wrong}* 是句子里的一个细节，但它没有导致任何事情发生。`,
      ];

const effectNot: Say = (wrong, _right, _shown, position) =>
  position === 0
    ? [
        `*${wrong}* is the cause, what started things. The effect is what happened because of it.`,
        `*${wrong}* 是原因，是事情的起点。结果是因此发生的事。`,
      ]
    : [
        `*${wrong}* is the opposite of what the text tells. Reread what happened after the cause.`,
        `*${wrong}* 与文中所说的正好相反。重读原因之后发生了什么。`,
      ];

const compareWordNot = meaning(
  Object.fromEntries([
    ...["Similarly", "also", "in the same way"].map((w) => [
      w,
      [
        `*${w}* shows that two things are alike, but the sentences here tell how they differ.`,
        `*${w}* 表示两样东西相似，而这里的句子讲的是它们的不同。`,
      ],
    ]),
    ...["However", "but", "unlike", "instead"].map((w) => [
      w,
      [
        `*${w}* shows a difference, but the sentences here tell how two things are alike.`,
        `*${w}* 表示不同，而这里的句子讲的是两样东西的相似之处。`,
      ],
    ]),
    ...["Next", "First", "After", "and then", "first", "next"].map((w) => [
      w,
      [`*${w}* tells time order, not how two things compare.`, `*${w}* 表示时间顺序，而不是两样东西的比较。`],
    ]),
    ...["Because of", "so", "because", "as a result"].map((w) => [
      w,
      [`*${w}* tells a cause or an effect, not how two things compare.`, `*${w}* 表示原因或结果，而不是两样东西的比较。`],
    ]),
  ]),
);

const differenceNot: Say = (wrong) => [
  `*${wrong}* is something the two share, not a difference. Look for the words that show a contrast, such as *but* or *while*.`,
  `*${wrong}* 是两者的共同点，而不是不同点。找找表示对比的词，比如 *but* 或 *while*。`,
];

const solutionNot: Say = (wrong) => [
  `*${wrong}* is not what the people in the text did. Find the action someone took, and what changed after it.`,
  `*${wrong}* 不是文中的人所做的事。找出有人采取的行动，以及之后发生了什么变化。`,
];

/** informationalReadingTopics are the topics of reading informational texts: main ideas, features and structures. */
export const informationalReadingTopics: readonly TopicDef[] = [
  {
    id: "main-idea",
    title: t("Main Idea", "主旨"),
    summary: t("What a paragraph is mostly about, and the title that fits it.", "段落主要讲什么，以及适合它的标题。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "main-idea-of-a-paragraph",
        t("The Main Idea of a Paragraph", "段落的主旨"),
        t(
          "The **main idea** is what a paragraph is mostly about. Every sentence should connect to it. To find it, ask what all the sentences have in common. A single detail is too narrow to be the main idea, and a general fact about the subject is too broad, because it could fit many other paragraphs.",
          "**主旨**是段落主要讲的内容，每个句子都应与它相关。要找主旨，就问所有句子有什么共同点。单个细节太窄，不能作为主旨；关于这个话题的一般事实又太宽，因为它也适用于许多别的段落。",
        ),
        pick(
          ["What is the main idea of this paragraph?", "这段话的主旨是什么？"],
          [...mainIdeaBank, ...recordMainIdea],
          (right) =>
            `**${right}** Every sentence connects to this idea. The other choices are a single detail, which is too narrow, or a general fact, which is too broad.`,
          (right) => `**${right}** 每个句子都与这个意思相关。其他选项要么只是一个细节，太窄；要么是一般事实，太宽。`,
          mainIdeaNot,
        ),
      ),
      point(
        "choosing-a-title",
        t("Choosing a Title", "选择标题"),
        t(
          "A good title names the main idea in a few words. Choose the one that covers the whole text. A title about only one detail leaves the rest out, and a title about a related subject points the reader somewhere else.",
          "好标题用几个词点出主旨。选择能概括全文的那一个。只关于一个细节的标题漏掉了其余内容；关于相关话题的标题会把读者引向别处。",
        ),
        pick(
          ["Which title fits this text best?", "哪个标题最适合这段文字？"],
          [...titleBank, ...recordTitle],
          (right) =>
            `**${right}** names what the whole text is about. The other titles are about something the text only touches on, or not at all.`,
          (right) => `**${right}** 点出了全文讲的内容。其他标题说的是文中只稍稍提到或根本没提的东西。`,
          titleNot,
        ),
      ),
    ],
  },
  {
    id: "supporting-details",
    title: t("Supporting Details and Summaries", "支持细节与概括"),
    summary: t(
      "Details that back up a main idea, and a summary that keeps only the important points.",
      "支持主旨的细节，以及只保留要点的概括。",
    ),
    prerequisites: ["main-idea"],
    encompasses: [{ topic: "main-idea", weight: 0.3 }],
    xp: 12,
    knowledgePoints: [
      point(
        "finding-support",
        t("Finding Support", "找出支持的细节"),
        t(
          "A **supporting detail** gives a fact, reason or example that shows the main idea is true. A sentence can be true and about the same subject and still not support the idea: *Owls are a kind of bird* is true, but it does not show that owls are skilled hunters.",
          "**支持细节**提供能证明主旨的事实、理由或例子。一个句子可能是真的、也和同一话题有关，却不支持主旨：*Owls are a kind of bird* 是真的，但它并不能说明猫头鹰是熟练的猎手。",
        ),
        pick(
          ["Which detail supports the main idea?", "哪个细节支持这个主旨？"],
          [...supportBank, ...recordSupport],
          (right) =>
            `*${right}* shows that the main idea is true. The other sentences are about the same subject but do not back up the idea.`,
          (right) => `*${right}* 证明了主旨。其他句子虽然和同一话题有关，却不支持这个观点。`,
          supportNot,
        ),
      ),
      point(
        "best-summary",
        t("The Best Summary", "最好的概括"),
        t(
          "A **summary** tells the most important points of a text in a few words of your own. It covers the whole text, not just one part, and it leaves out small details and your opinions.",
          "**概括**用自己的话简短说出文本最重要的内容。它涵盖全文而不只是一部分，并省去小细节和个人看法。",
        ),
        pick(
          ["Which is the best summary of this text?", "哪一项是对这段文字最好的概括？"],
          [...summaryBank, ...recordSummary],
          (right) =>
            `*${right}* covers the whole text in a few words. One other choice tells only one detail, and the other adds something the text does not say or leaves out its point.`,
          (right) => `*${right}* 用简短的话涵盖了全文。另一个选项只说了一个细节，还有一个添加了原文没有的内容或漏掉了要点。`,
          summaryNot,
        ),
      ),
    ],
  },
  {
    id: "text-features",
    title: t("Text Features", "文本特征"),
    summary: t(
      "Glossaries, indexes, captions, headings, maps and charts, and what each is for.",
      "词汇表、索引、图注、标题、地图和图表，以及它们各自的用途。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "where-to-look",
        t("Where to Look", "到哪里找"),
        t(
          "Books and articles have parts that help you find information. The **table of contents** lists chapters in order at the front; the **index** lists topics alphabetically at the back; the **glossary** gives the meanings of special words. A **caption** explains a picture, and a **heading** names a section. Maps, charts, diagrams and timelines show information as pictures.",
          "书和文章有帮助你查找信息的部分。**目录**在书前按顺序列出章节；**索引**在书后按字母顺序列出话题；**词汇表**解释专门词语的意思。**图注**说明图片，**小标题**点明一节的内容。地图、图表、示意图和时间线用图来展示信息。",
        ),
        pick(
          ["Which text feature should you use?", "你应该使用哪种文本特征？"],
          [...featureBank, ...moreFeatureBank],
          (right) => `Use **${right}**. It is the part made for exactly this kind of question.`,
          (right) => `用 **${right}**。它正是为这类问题而设的部分。`,
          featureNot,
        ),
      ),
      point(
        "what-a-feature-does",
        t("What Each Feature Does", "每种特征的作用"),
        t(
          "Each feature has one job. Telling them apart saves time: to learn a word, go to the glossary; to find a page, go to the index; to see what a section covers, read its heading.",
          "每种特征都有自己的作用。分清它们能节省时间：查词义去词汇表，找页码去索引，想知道一节讲什么就看它的小标题。",
        ),
        pick(
          ["What does this text feature do?", "这种文本特征有什么作用？"],
          [...featureJobBank, ...moreFeatureJobBank],
          (right) => `${right} The other choices describe the jobs of other features.`,
          (right) => `${right} 其他选项描述的是别的特征的作用。`,
          featureJobNot,
        ),
      ),
    ],
  },
  {
    id: "sequence-in-texts",
    title: t("Sequence", "顺序"),
    summary: t("Words that show time order, and working out what happened first.", "表示时间顺序的词，以及判断先发生了什么。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "time-order-words",
        t("Time-Order Words", "表示时间顺序的词"),
        t(
          "Writers show the order of steps and events with words such as *first, next, then, after that, before, once, as soon as* and *finally*. Words such as *because* show a reason and *however* shows a contrast, so they do not fit where an order of time is meant.",
          "作者用 *first, next, then, after that, before, once, as soon as, finally* 这样的词表示步骤和事件的顺序。*because* 表示原因，*however* 表示转折，所以在需要表示时间顺序的地方不合适。",
        ),
        pick(
          ["Which word or words complete the sequence?", "哪个词能补全这个顺序？"],
          [...signalBank, ...moreSignalBank],
          (right) => `**${right}** shows the order of time. The other choices show a reason, a contrast or an example instead.`,
          (right) => `**${right}** 表示时间顺序。其他选项表示的是原因、转折或举例。`,
          signalNot,
        ),
      ),
      point(
        "what-happened-first",
        t("What Happened First", "先发生了什么"),
        t(
          "Events are not always told in the order they happened. Words such as *before, earlier, had* and *ago* can point back to something that came first: in *We ate lunch. Earlier, we had gone swimming*, the swimming came first even though it is told second.",
          "事件并不总按发生的顺序讲述。*before, earlier, had, ago* 这样的词可以指回先发生的事：在 *We ate lunch. Earlier, we had gone swimming* 中，游泳先发生，尽管它在后面才讲。",
        ),
        pick(
          ["Which of these happened first?", "下面哪件事最先发生？"],
          [...firstBank, ...moreFirstBank],
          (right) =>
            `*${right}* came first. Words such as *before, earlier* and *had* show that it happened before the events told around it.`,
          (right) => `*${right}* 最先发生。*before, earlier, had* 这样的词表明它发生在周围所讲的事件之前。`,
          firstNot,
        ),
      ),
    ],
  },
  {
    id: "cause-and-effect-in-texts",
    title: t("Cause and Effect", "因果"),
    summary: t("Finding why something happened and what happened because of it.", "找出事情发生的原因和由此产生的结果。"),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "finding-the-cause",
        t("Finding the Cause", "找出原因"),
        t(
          "A **cause** is why something happens; an **effect** is what happens. Words such as *because, since, due to* and *as a result of* come right before a cause, while *so* comes right before an effect. The cause is not always told first: in *The milk went sour because it was left out*, the cause comes second.",
          "**原因**是事情为什么发生，**结果**是发生了什么。*because, since, due to, as a result of* 这样的词后面紧跟原因，而 *so* 后面紧跟结果。原因不一定先讲：在 *The milk went sour because it was left out* 中，原因在后。",
        ),
        pick(
          ["What is the cause?", "原因是什么？"],
          [...causeBank, ...recordCause],
          (right) =>
            `*${right}* That is why the other event happened. One other choice is the effect, and the other is a detail that caused nothing.`,
          (right) => `*${right}* 这就是另一件事发生的原因。另一个选项是结果，还有一个是并未导致任何事的细节。`,
          causeNot,
        ),
      ),
      point(
        "finding-the-effect",
        t("Finding the Effect", "找出结果"),
        t(
          "To find an effect, ask *what happened because of this?* One cause can lead to an effect, and that effect can be the cause of another, like a row of falling dominoes. The effect must follow from the cause in the text, not just come after it.",
          "要找结果，就问 *因为这件事，发生了什么？* 一个原因导致一个结果，这个结果又可能是另一件事的原因，就像一排倒下的多米诺骨牌。结果必须是文中由原因引起的，而不只是在它之后发生。",
        ),
        pick(
          ["What is the effect?", "结果是什么？"],
          [...effectBank, ...recordEffect],
          (right) =>
            `*${right}* That happened because of what the text describes first. One other choice is the cause, and the other is the opposite of what happened.`,
          (right) => `*${right}* 这是由文中先讲的事情导致的。另一个选项是原因，还有一个与实际发生的相反。`,
          effectNot,
        ),
      ),
    ],
  },
  {
    id: "compare-and-contrast-in-texts",
    title: t("Compare and Contrast", "比较与对比"),
    summary: t(
      "Words that show likeness and difference, and finding how two things differ.",
      "表示相同和不同的词，以及找出两样东西的差异。",
    ),
    prerequisites: [],
    encompasses: [],
    xp: 10,
    knowledgePoints: [
      point(
        "alike-and-different-words",
        t("Words for Alike and Different", "表示相同和不同的词"),
        t(
          "Words such as *both, like, likewise, similarly* and *too* show that things are alike. Words such as *unlike, but, however, while, in contrast* and *on the other hand* show that they differ. Read both sides of the blank to see which is meant.",
          "*both, like, likewise, similarly, too* 这样的词表示相同。*unlike, but, however, while, in contrast, on the other hand* 这样的词表示不同。读空格两边的内容，看看要表达的是哪一种。",
        ),
        pick(
          ["Which word or words complete the sentence?", "哪个词能补全句子？"],
          [...compareWordBank, ...moreCompareWords.map(([item]) => item)],
          (right) =>
            alikeWords.has(right)
              ? `**${right}** fits, because the two parts of the sentence tell how things are alike. The other choices show a difference or an order of time.`
              : `**${right}** fits, because the two parts of the sentence tell how things differ. The other choices show likeness, a reason or an order of time.`,
          (right) =>
            alikeWords.has(right)
              ? `**${right}** 合适，因为句子两部分说的是相同之处。其他选项表示不同或时间顺序。`
              : `**${right}** 合适，因为句子两部分说的是不同之处。其他选项表示相同、原因或时间顺序。`,
          compareWordNot,
        ),
      ),
      point(
        "finding-a-difference",
        t("Finding a Difference", "找出不同之处"),
        t(
          "A comparison often tells how two things are alike first and then how they differ. Keep the two lists apart: a way in which both things are the same cannot be a difference.",
          "比较时往往先讲两样东西的相同之处，再讲不同之处。把两类内容分开：两者相同的方面不可能是差异。",
        ),
        pick(
          ["According to the text, how are the two things different?", "根据文中所说，这两样东西有什么不同？"],
          [...differenceBank, ...moreDifferenceBank],
          (right) => `They differ in **${right}**. The other choices name ways in which the text says the two are alike.`,
          (right) => `它们的不同在于 **${right}**。其他选项是文中说两者相同的方面。`,
          differenceNot,
        ),
      ),
    ],
  },
  {
    id: "text-structures",
    title: t("Text Structures", "文本结构"),
    summary: t(
      "Sequence, cause and effect, compare and contrast, problem and solution, and description.",
      "顺序、因果、比较与对比、问题与解决、描述。",
    ),
    prerequisites: ["sequence-in-texts", "cause-and-effect-in-texts", "compare-and-contrast-in-texts"],
    encompasses: [
      { topic: "sequence-in-texts", weight: 0.2 },
      { topic: "cause-and-effect-in-texts", weight: 0.2 },
      { topic: "compare-and-contrast-in-texts", weight: 0.2 },
    ],
    xp: 12,
    knowledgePoints: [
      point(
        "naming-the-structure",
        t("Naming the Structure", "判断结构"),
        t(
          "Informational texts are built in a few common ways. **Sequence** tells events or steps in order. **Cause and effect** tells why things happen. **Compare and contrast** tells how things are alike and different. **Problem and solution** names a problem and how it was solved. **Description** tells what something is like, one detail after another. The signal words you already know point to the structure.",
          "说明性文本有几种常见的结构。**顺序**按次序讲事件或步骤。**因果**讲事情为什么发生。**比较与对比**讲事物的异同。**问题与解决**提出问题并说明如何解决。**描述**一个细节接一个细节地说明事物的样子。你已经学过的信号词能指明结构。",
        ),
        choiceGenerator(
          t("Which structure does this text use?", "这段文字用的是哪种结构？"),
          [...structureBank, ...recordStructure],
          (right) => t(`**${right}**. ${structureWhy.get(right) ?? ""}`, `**${right}**。${structureWhyZh.get(right) ?? ""}`),
          (wrong) =>
            t(
              `A **${wrong}** text would do this: ${structureWhy.get(wrong) ?? ""} Check whether this text really does.`,
              `**${wrong}** 结构的文本会这样写：${structureWhyZh.get(wrong) ?? ""}看看这段文字是否真是如此。`,
            ),
        ),
      ),
      point(
        "problem-and-solution",
        t("Problem and Solution", "问题与解决"),
        t(
          "In a problem-and-solution text, first find the problem: what was wrong or hard? Then find what someone **did** about it. The solution is an action that makes the problem go away, not a part of the problem itself.",
          "在问题与解决结构的文本中，先找出问题：什么不对劲或有困难？再找出有人**做了**什么。解决办法是让问题消失的行动，而不是问题本身的一部分。",
        ),
        pick(
          ["What was the solution to the problem?", "问题是怎样解决的？"],
          [...solutionBank, ...moreSolutionBank],
          (right) =>
            `**${right}** is what was done, and it made the problem go away. The other choices are not in the text or would not solve it.`,
          (right) => `**${right}** 是采取的行动，它解决了问题。其他选项文中没有提到，或者解决不了问题。`,
          solutionNot,
        ),
      ),
    ],
  },
];
