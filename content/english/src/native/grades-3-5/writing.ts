// Grades 3 to 5: writing judged by a model, one kind of paragraph for each of several units: a story, a summary,
// a comparison, causes and effects, and a description (W4).

import { type CriterionSpec, type TopicDef, t } from "@ga/content";
import { criterionById, point, type WritingItem, writingGenerator } from "@ga/subject-english";

const criterion = (id: string): CriterionSpec => {
  const found = criterionById(id);
  if (!found) throw new Error(`unknown criterion ${id}`);
  return found;
};

const onePiece = (model: string) => t(`One good paragraph:\n\n> ${model}`, `一个好的段落：\n\n> ${model}`);

/** storyBank asks for a short story in one paragraph, on the themes of fables and stories of school and home. */
const storyBank: readonly WritingItem[] = [
  {
    task: "Write a short story in one paragraph about a character who loses something important and finds it in a surprising place.",
    model:
      'On the morning of the class trip, Leo could not find his lucky cap. He searched under his bed, behind the sofa and even in the fridge. "We leave in ten minutes!" his mom called. Leo sat on the stairs and sighed. Then he heard a scratching sound from the dog\'s basket. There was Biscuit, curled up asleep with the cap under her nose. Leo laughed, brushed off the dog hair and ran for the bus.',
  },
  {
    task: "Write a short story in one paragraph about a boastful animal who learns a lesson.",
    model:
      'A peacock strutted around the farmyard telling everyone that his feathers were the finest in the land. "No one can match me," he said. One afternoon, a fox crept toward the hens. The plain brown hens hid in the tall grass, but the peacock\'s bright tail shone in the sun, and the fox chased him all the way to the barn. Safe at last, the peacock sat quietly beside the hens. From then on, he never bragged about his feathers again.',
  },
  {
    task: "Write a short story in one paragraph about two friends who disagree and find a way to solve the problem.",
    model:
      'Ana and Rosa had saved their money to buy one game to share, but they could not agree on which one. Ana wanted a puzzle game, and Rosa wanted a racing game. They argued all the way to the store. Standing in front of the shelf, Rosa had an idea. "Let\'s buy the racing game now," she said, "and next month we\'ll get your puzzle." Ana smiled and shook her hand. By the end of the summer, they had both games and were still best friends.',
  },
  {
    task: "Write a short story in one paragraph about a character who is nervous before doing something for the first time.",
    model:
      "Mei's hands shook as she waited behind the curtain for her first piano recital. She could hear the audience whispering and coughing. When her name was called, she walked to the piano and sat down slowly. For a moment, she forgot the first note. Then she remembered her teacher's words: \"Just play the first bar, and the rest will follow.\" She pressed the keys, and the music came back to her. When she finished, the room filled with clapping, and Mei could not stop smiling.",
  },
  {
    task: "Write a short story in one paragraph about a storm that changes a family's plans.",
    model:
      'The Parks had packed the car for a day at the beach when the sky turned dark gray. Thunder rumbled, and rain began to pound on the roof. "So much for the beach," groaned Jun. Instead, his dad spread a blanket on the living room floor, and his mom brought out the picnic basket. They ate sandwiches, played cards and listened to the rain. When the storm passed, Jun said it was the best beach day they had ever had at home.',
  },
  {
    task: "Write a short story in one paragraph about a greedy character who wants more than they need.",
    model:
      "A squirrel named Nutley found a tree full of acorns in the autumn. Instead of sharing, he tried to carry them all to his nest at once. He stuffed his cheeks until they bulged and grabbed three more in his paws. Halfway up the tree, he slipped, and every acorn tumbled to the ground. The other squirrels gathered them up in a moment. That winter, Nutley learned that a full nest is worth less than good neighbors.",
  },
  {
    task: "Write a short story in one paragraph about a character who helps a stranger.",
    model:
      'On her way home from school, Priya saw an old man staring at a map with a puzzled frown. "Are you lost?" she asked. He said he was looking for the library, but every street looked the same to him. Priya was in a hurry, but she walked him three blocks to the library door. The man thanked her and pressed a small paper star into her hand. When she got home, she unfolded it and found a note: "Kindness always finds its way back."',
  },
  {
    task: "Write a short story in one paragraph about a timid character who does something brave.",
    model:
      "Tomas was the quietest boy in his class, and he never raised his hand. During a field trip to the river, a little girl's hat blew into the water and floated toward a fallen branch. Everyone shouted, but no one moved. Tomas took a deep breath, grabbed a long stick and carefully hooked the hat before the current carried it away. The girl hugged her wet hat, and the whole class cheered. For the first time, Tomas did not mind everyone looking at him.",
  },
  {
    task: "Write a short story in one paragraph about a curious character who opens a door they were told to leave closed.",
    model:
      'Grandpa had told Nina never to open the little blue door at the top of the attic stairs. One rainy afternoon, her curiosity was stronger than her promise. She turned the stiff handle, and the door creaked open. Inside, dusty boxes were stacked to the ceiling, and in the middle stood a wooden rocking horse with a faded red saddle. "That was mine when I was your age," said Grandpa behind her. Nina froze, but he only smiled and helped her carry the horse downstairs.',
  },
  {
    task: "Write a short story in one paragraph about a stubborn character who refuses to ask for help.",
    model:
      'Marco was sure he could build the bookshelf by himself. He spread the boards across the floor and ignored the instructions. "Do you want a hand?" his sister asked. "No, I\'ve got it," he said. An hour later, the shelf leaned to one side, and three screws were left over. Marco stared at it for a long time. Finally, he sighed and called his sister. Together they took it apart, followed the steps, and in twenty minutes the shelf stood straight and strong.',
  },
  {
    task: "Write a short story in one paragraph about a loyal friend, animal or person, who keeps a promise.",
    model:
      "Every afternoon, Hana's old dog Mochi waited by the gate for her school bus. One day, a snowstorm closed the roads, and the bus was two hours late. Her parents called Mochi inside, but he would not leave his place by the gate. Snow piled up on his back as he sat and watched the empty road. When the bus finally crept around the corner, Mochi barked and wagged his whole body. Hana knelt in the snow and hugged him, and he licked the snowflakes off her cheeks.",
  },
  {
    task: "Write a short story in one paragraph about a character who makes a mistake and sets it right.",
    model:
      'While playing catch in the yard, Oliver threw the ball too high, and it smashed Mrs. Grant\'s kitchen window. He wanted to run and hide. Instead, he walked to her door with his heart pounding and knocked. "I broke your window," he said quietly. Mrs. Grant frowned at first, but then she thanked him for telling the truth. Oliver spent the next three Saturdays raking her leaves to help pay for the glass, and by the end, they had become good friends.',
  },
];

/** sceneBank asks for a story that shows what happens through dialogue and detail. */
const sceneBank: readonly WritingItem[] = [
  {
    task: "Write a short story in one paragraph about a pet who gets into trouble. Use at least one line of dialogue.",
    model:
      'When I came home from school, our kitten Pepper was sitting in the middle of a white cloud. She had knocked over the flour bag, and her black fur was dusted from nose to tail. "Pepper!" I cried. She blinked at me and sneezed, which sent a puff of flour into the air. I scooped her up and carried her to the sink. By dinner, Pepper was clean and fluffy again, and the kitchen floor was the cleanest it had ever been.',
  },
  {
    task: "Write a short story in one paragraph about a character who tries to cook something for the first time. Show what the character does and feels.",
    model:
      "Sam wanted to surprise his mom with pancakes on her birthday. He cracked two eggs, and one shell fell into the bowl, so he fished it out with a spoon. The first pancake stuck to the pan and tore in half. Sam felt like giving up. He turned the heat down, added more butter and tried again. This time the pancake slid around the pan, golden and round. When his mom came downstairs, a tall, slightly crooked stack was waiting for her.",
  },
  {
    task: "Write a short story in one paragraph about a character who finds a strange object in the garden. Use dialogue or details to show what happens.",
    model:
      'While digging a hole for her tomato plant, Lucy\'s shovel hit something hard. She brushed away the dirt and found a small metal box with a rusty lock. "Dad, come quick!" she called. Together they pried it open with a screwdriver. Inside lay a faded photo of a girl standing in the same garden, holding the same box. On the back were the words "Hidden by Ellen, 1952." Lucy decided to write her own note and bury the box again for the next child to find.',
  },
  {
    task: "Write a short story in one paragraph about a character who is lost in a crowded place. Show what the character sees and feels.",
    model:
      "One minute Ben was holding his sister's hand at the busy market, and the next minute she was gone. Tall people pushed past him, and the smell of fried fish and oranges filled the air. His heart pounded. He remembered what his parents always said: stand still and look for a worker. He spotted a woman in a red apron behind the fruit stall and told her his sister's name. A few minutes later, his sister came running, and Ben hugged her so hard that her shopping bag fell.",
  },
  {
    task: "Write a short story in one paragraph about a character who has to keep a secret. Use at least one line of dialogue.",
    model:
      'Grace knew about the surprise party for her brother, and keeping quiet was the hardest thing she had ever done. At breakfast, he asked, "Why is everyone acting so strange?" Grace stuffed a big piece of toast into her mouth so she would not have to answer. All day she avoided him and hummed loudly whenever he came near. That evening, when the lights flicked on and everyone shouted "Surprise!", her brother turned to her and laughed. "So that\'s why you were humming all day!"',
  },
  {
    task: "Write a short story in one paragraph about a character who wins or loses a race. Show how the character feels.",
    model:
      'The whistle blew, and Kiara shot off the starting line. For the first lap, she stayed right behind the leader, her breath coming fast and her legs burning. On the last turn, her shoe came loose, and two runners passed her. She crossed the line in fourth place and stared at the ground. Then her coach jogged over and said, "You ran your best time ever." Kiara looked at the clock, saw her time and felt a slow smile spread across her face.',
  },
  {
    task: "Write a short story in one paragraph about a character who meets a new neighbor. Use dialogue or details to show what happens.",
    model:
      'A moving truck pulled up next door, and a boy about my age climbed out holding a fishbowl. "Is there a park around here?" he asked, looking around nervously. I told him about the pond at the end of our street where turtles sun themselves on logs. His face lit up, and he set the fishbowl carefully on the steps. That afternoon, we sat on the bank and counted eleven turtles. By the end of the week, he was not my new neighbor anymore; he was my friend.',
  },
  {
    task: "Write a short story in one paragraph about a character who makes a mistake and fixes it. Show what the character does and feels.",
    model:
      'Jack was throwing a ball against the wall when it bounced off and knocked his grandmother\'s blue vase off the shelf. It cracked into three pieces. His stomach twisted, and for a second he thought about hiding them under the sofa. Instead, he carried the pieces to the kitchen. "I broke your vase, Grandma. I\'m sorry," he said quietly. She looked at the pieces and then at him. "Thank you for telling me," she said. That afternoon, they glued the vase back together, and Grandma said it looked even more special with its cracks.',
  },
  {
    task: "Write a short story in one paragraph about a character who hears a strange noise at night. Use at least one line of dialogue.",
    model:
      'Late one night, Lucy woke to a scratching sound inside her bedroom wall. She pulled the blanket up to her nose and listened. Scratch, scratch, then a tiny squeak. "Dad," she whispered loudly, "there\'s something in the wall!" Her dad came in with a flashlight and pressed his ear to the wallpaper. Then he grinned. "I think a mouse has moved in," he said. The next morning they set a kind trap, and by the weekend the little mouse was living happily in the woods behind the house.',
  },
  {
    task: "Write a short story in one paragraph about a race or contest that does not go as planned. Show what the character thinks and feels.",
    model:
      "Ravi had practiced for the school race every day for a month. When the whistle blew, he shot ahead of everyone, his legs pumping and the wind in his face. Halfway around the track, his shoelace came untied, and he stumbled onto the grass. His face burned as the other runners passed him. For a second he wanted to stay down. Then he tied the lace tight, stood up and ran as hard as he could. He finished fifth, but the crowd cheered louder for him than for the winner.",
  },
  {
    task: "Write a short story in one paragraph about a child who visits a grandparent and learns something new. Use at least one line of dialogue.",
    model:
      "On Saturdays, Ellie visited her grandmother, who lived in a small house full of plants. This time Grandma handed her a lump of soft clay. \"Today I'll teach you to make a bowl,\" she said. Ellie pressed her thumbs into the clay, but the sides kept flopping over. Grandma laughed and placed her wrinkled hands over Ellie's. Slowly, round and round, the walls rose. When the bowl was finished, it was a little lopsided, but Ellie thought it was the most beautiful thing she had ever made.",
  },
  {
    task: "Write a short story in one paragraph about a character who gets lost in a busy place. Show what the character sees and feels.",
    model:
      "At the crowded market, Leo let go of his mom's hand for just a moment to look at a cage of chirping birds. When he turned around, she was gone. Strangers pushed past him with baskets of fruit, and the smell of fried fish filled the air. His throat felt tight, and his eyes stung. Then he remembered what his mom had told him: stay where you are and find someone at a stall. He asked the fruit seller for help, and a few minutes later his mom came running, her arms open wide.",
  },
];

/** summaryBank asks for a summary of a short source, on the themes of water, plants, weather and the earth. */
const summaryBank: readonly WritingItem[] = [
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Most of the water on Earth is salty ocean water. Only a small part is fresh water, and most of that is frozen in ice near the poles or hidden under the ground. The fresh water in rivers and lakes is only a tiny share of all the water on the planet. People, animals and plants on land must all share it. That is why it is important not to waste or pollute fresh water.",
    model:
      "Only a small part of Earth's water is fresh, and most of that is frozen or underground. Because living things on land must share the little fresh water that is easy to reach, it should not be wasted or polluted.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "A seed holds a tiny plant and a store of food. When the soil is warm and damp, the seed takes in water and swells until its coat splits. First a root pushes down into the soil. Then a shoot grows up toward the light. Once the first leaves open, the young plant can make its own food from sunlight, air and water, and it no longer needs the food stored in the seed.",
    model:
      "When a seed gets warmth and water, it swells and splits open. A root grows down and a shoot grows up, and once its leaves open, the plant can make its own food instead of using the food stored in the seed.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Ancient Egypt was a desert land, but the Nile River made life possible there. Every summer, the river flooded and spread a layer of rich black mud over the fields. When the water went down, farmers planted wheat and barley in the mud. They dug canals to carry water to fields farther from the river. Because of the Nile, Egypt could grow enough food to feed its cities and its builders.",
    model:
      "The Nile River made farming possible in the Egyptian desert. Its yearly flood left rich mud where farmers grew crops, and canals carried the water farther, so Egypt could grow enough food for its people.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "A thunderstorm begins when warm, damp air rises quickly. As the air goes up, it cools, and its water vapor turns into the drops of a tall cloud. Inside the cloud, drops and bits of ice are tossed up and down by strong winds, and they build up electric charges. Lightning is a giant spark that jumps when the charges grow too large. The thunder we hear is the sound of air heated so fast by the lightning that it bursts outward.",
    model:
      "Thunderstorms form when warm, damp air rises, cools and builds a tall cloud. Winds in the cloud build up electric charges that are released as lightning, and the sudden heating of the air by the lightning makes thunder.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Many animals survive the cold of winter in different ways. Some, such as geese, migrate to warmer places where they can find food. Others, such as bears and some bats, hibernate: they sleep through the coldest months while their bodies slow down to save energy. Still others stay active, growing thicker fur or storing food in the autumn so they can eat through the winter.",
    model:
      "Animals survive winter in different ways. Some migrate to warmer places, some hibernate to save energy, and others stay active by growing thicker fur or storing food.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Your heart is a muscle about the size of your fist. Every time it beats, it squeezes blood into tubes that carry it all around your body. The blood brings oxygen and food to every cell and carries away waste. Then it travels back to the heart and is pumped to the lungs, where it picks up fresh oxygen. Your heart does this about one hundred thousand times a day without ever stopping to rest.",
    model:
      "The heart is a muscle that pumps blood around the body without resting. The blood carries oxygen and food to every cell, takes away waste, and returns to the heart to be sent to the lungs for more oxygen.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Mountains, valleys and canyons do not stay the same forever. Rain, wind and ice slowly break rock into smaller pieces. Rivers carry the pieces away and drop them somewhere else, sometimes hundreds of miles downstream. Over millions of years, this wearing away can cut deep canyons and turn sharp, tall mountains into low, rounded hills.",
    model:
      "Landforms slowly change as rain, wind and ice break down rock and rivers carry the pieces away. Over millions of years, this can carve deep canyons and wear tall mountains down into hills.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "The moon does not make its own light. It shines because sunlight bounces off its surface. As the moon travels around the earth, we see different amounts of its sunlit side. When the side facing us is dark, we call it a new moon. When the whole side facing us is lit, we see a full moon. The moon goes through all of its shapes, called phases, in about a month.",
    model:
      "The moon shines by reflecting sunlight. As it travels around the earth, we see different amounts of its lit side, from a dark new moon to a bright full moon, in a cycle of phases that takes about a month.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Many animals sleep through the winter. This deep sleep is called hibernation. Before winter comes, a bear eats as much as it can and stores the extra food as fat. Then it finds a den in a cave or a hollow log. While it sleeps, its heart beats slowly and its body uses very little energy, so the fat can last for months. When spring arrives, the bear wakes up thin and hungry.",
    model:
      "Some animals, such as bears, survive the winter by hibernating. A bear eats a lot and stores fat before winter, then sleeps in a den while its body works slowly, so the fat lasts until it wakes in spring.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "Your heart is a muscle about the size of your fist. It beats all day and all night, even while you sleep. Each beat pushes blood through tubes called blood vessels to every part of your body. The blood carries oxygen from your lungs and food from your stomach to your cells. Then it comes back to the heart to be pumped out again. When you run or play, your heart beats faster to deliver more oxygen.",
    model:
      "The heart is a muscle that never stops pumping blood through the body. The blood carries oxygen and food to every cell, and the heart beats faster when the body needs more oxygen, such as during exercise.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "The moon does not make its own light. Instead, it reflects light from the sun. As the moon travels around the earth, we see different amounts of its sunlit side. When the side facing us is dark, we call it a new moon. Over about two weeks, more and more of the lit side shows, until we see a full moon. Then the lit part shrinks again. The whole cycle takes about a month.",
    model:
      "The moon shines because it reflects sunlight. As it circles the earth, we see more or less of its lit side, so it changes from a new moon to a full moon and back again in about a month.",
  },
  {
    task: "Summarize this passage in two or three sentences.",
    source:
      "A hurricane is a huge, spinning storm that forms over warm ocean water. Warm, wet air rises from the sea and forms tall clouds. As more air rushes in to take its place, the storm begins to spin. Hurricanes bring strong winds, heavy rain and high waves. When a hurricane reaches land, it can knock down trees, flood streets and damage houses. Once it moves over land, it loses the warm water that feeds it and slowly dies down.",
    model:
      "A hurricane is a spinning storm that grows over warm ocean water. It brings strong winds, heavy rain and high waves that can cause great damage on land, but it weakens once it leaves the warm water behind.",
  },
];

/** compareBank asks for a paragraph comparing two things from notes, on the themes of the units. */
const compareBank: readonly WritingItem[] = [
  {
    task: "Use these notes to write a paragraph that compares a farming village by the Nile long ago with a farm today.",
    source:
      "Nile village: crops grew in mud left by the yearly flood; farmers used oxen and wooden plows; wheat and barley. Farm today: crops still need water and good soil; farmers use tractors and pumps; many kinds of crops.",
    model:
      "A farming village by the Nile long ago and a farm today are alike in some ways and different in others. Both depend on water and good soil, and both grow grain such as wheat. However, the Egyptian farmers waited for the yearly flood to water their fields, while farmers today can pump water whenever they need it. Long ago, oxen pulled wooden plows, but today tractors do most of the heavy work.",
  },
  {
    task: "Use these notes to write a paragraph that compares a frog and a toad.",
    source:
      "Frog: smooth, wet skin; long legs for jumping; lives near water. Toad: dry, bumpy skin; short legs for walking and small hops; can live farther from water. Both: amphibians; lay eggs in water; eat insects.",
    model:
      "Frogs and toads look alike, but they are not the same. Both are amphibians that lay their eggs in water and eat insects. A frog has smooth, wet skin, while a toad's skin is dry and bumpy. Frogs have long legs for big jumps, but toads have short legs and mostly walk or make small hops. Unlike frogs, toads can live far from water.",
  },
  {
    task: "Use these notes to write a paragraph that compares a desert and a rainforest.",
    source:
      "Desert: very little rain; hot days, cold nights; plants such as cactuses store water. Rainforest: rain almost every day; warm and wet all year; tall trees and thick plants. Both: home to many animals that have adapted to the place.",
    model:
      "A desert and a rainforest are very different places, though they have one thing in common. Both are home to animals and plants that have adapted to their surroundings. A desert gets very little rain, but a rainforest gets rain almost every day. Desert days are hot and nights are cold, while a rainforest stays warm and wet all year. Desert plants such as cactuses store water, whereas rainforest plants grow tall and thick.",
  },
  {
    task: "Use these notes to write a paragraph that compares the sun and the moon.",
    source:
      "Sun: a star; makes its own light and heat; far bigger than the earth. Moon: a ball of rock; reflects light from the sun; much smaller than the earth; travels around the earth. Both: look about the same size in our sky; affect life on earth.",
    model:
      "The sun and the moon look about the same size in our sky, but they are very different. Both affect life on earth: the sun gives us heat, and the moon pulls the tides. However, the sun is a star that makes its own light, while the moon is a ball of rock that only reflects sunlight. The sun is far bigger than the earth, but the moon is much smaller and travels around our planet.",
  },
  {
    task: "Use these notes to write a paragraph that compares a hurricane and a blizzard.",
    source:
      "Hurricane: forms over warm ocean water; heavy rain and very strong winds; late summer and autumn. Blizzard: forms in cold air; heavy snow and strong winds; winter. Both: dangerous storms; strong winds; people are told to stay inside.",
    model:
      "Hurricanes and blizzards are both dangerous storms, but they happen in different conditions. Both bring strong winds, and in both, people are told to stay indoors. A hurricane forms over warm ocean water, while a blizzard forms in cold air. A hurricane brings heavy rain in late summer and autumn, but a blizzard brings heavy snow in winter.",
  },
  {
    task: "Use these notes to write a paragraph that compares bones and muscles.",
    source:
      "Bones: hard; hold the body up; protect organs such as the brain and heart. Muscles: soft and stretchy; pull on bones to make the body move; can get tired. Both: needed for moving; grow stronger with exercise; need food to stay healthy.",
    model:
      "Bones and muscles work together, but they do different jobs. Both are needed to move, and both grow stronger when we exercise. Bones are hard, while muscles are soft and can stretch. Bones hold the body up and protect organs like the heart, but muscles pull on the bones to make the body move. Unlike bones, muscles can get tired after a lot of work.",
  },
  {
    task: "Use these notes to write a paragraph that compares a volcano and an earthquake.",
    source:
      "Volcano: melted rock comes up through an opening; can build a mountain; lava, ash and gas. Earthquake: the ground suddenly shakes; rocks slip along a crack; can break roads and buildings. Both: caused by movement deep inside the earth; often happen near the edges of the earth's plates.",
    model:
      "Volcanoes and earthquakes are both caused by movement deep inside the earth, and both often happen near the edges of its plates. However, they change the land in different ways. A volcano lets melted rock come up through an opening, and over time its lava and ash can build a mountain. An earthquake, on the other hand, is a sudden shaking of the ground when rocks slip along a crack, and it can break roads and buildings in seconds.",
  },
  {
    task: "Use these notes to write a paragraph that compares a scribe in ancient Egypt with a writer today.",
    source:
      "Scribe: wrote on papyrus with a reed pen; trained for many years; wrote records, letters and laws for others. Writer today: types on a computer or writes on paper; anyone can learn to write; writes for many reasons. Both: use writing to keep records and share ideas; important jobs.",
    model:
      "A scribe in ancient Egypt and a writer today both use writing to keep records and share ideas. Still, their work is very different. A scribe wrote on papyrus with a reed pen, while today most writers type on a computer. Scribes trained for many years, and few people could read or write, but today almost anyone can learn. Scribes mostly wrote for others, whereas writers today write for many reasons of their own.",
  },
  {
    task: "Use these notes to write a paragraph that compares the sun and the moon.",
    source:
      "Sun: a star; makes its own light and heat; very far away; huge. Moon: a ball of rock; reflects the sun's light; much closer to Earth; much smaller. Both: seen in our sky; seem to rise and set; help us measure time.",
    model:
      "The sun and the moon both shine in our sky, but they are very different. Both seem to rise in the east and set in the west, and people have used both to measure days and months. However, the sun is a star that makes its own light and heat, while the moon is a ball of rock that only reflects sunlight. The sun is also much bigger and much farther away than the moon, which looks about the same size only because it is so close to us.",
  },
  {
    task: "Use these notes to write a paragraph that compares a bat and a bird.",
    source:
      "Bat: a mammal; has fur; wings made of skin; most fly at night; babies are born alive and drink milk. Bird: has feathers; wings covered in feathers; most fly by day; lays eggs. Both: can fly; many eat insects; some travel long distances.",
    model:
      "Bats and birds can both fly, but they belong to different groups of animals. Both have wings, many of both eat insects, and some of each travel long distances. However, a bat is a mammal with fur, while a bird has feathers. A bat's wings are made of thin skin stretched between its fingers, but a bird's wings are covered with feathers. Also, most bats fly at night, while most birds fly during the day. Unlike birds, which lay eggs, bats give birth to live babies that drink milk.",
  },
  {
    task: "Use these notes to write a paragraph that compares your heart and your lungs.",
    source:
      "Heart: a muscle; pumps blood; beats about 100,000 times a day. Lungs: two spongy organs; take in air; we breathe about 20,000 times a day. Both: in the chest; protected by the ribs; work faster during exercise; work together to bring oxygen to the body.",
    model:
      "The heart and the lungs are two organs that work as a team. Both sit inside the chest, where the ribs protect them, and both work faster when we run or play. However, they have different jobs. The lungs are two spongy organs that take in air, while the heart is a single muscle that pumps blood. The lungs put oxygen into the blood, and then the heart sends that blood all around the body.",
  },
  {
    task: "Use these notes to write a paragraph that compares a volcano and an earthquake.",
    source:
      "Volcano: melted rock comes out of an opening; builds mountains and new land; can sometimes be seen coming. Earthquake: the ground shakes when rocks deep underground slip; lasts seconds or minutes; comes with almost no warning. Both: caused by forces inside the earth; can damage buildings; common near the edges of the earth's plates.",
    model:
      "Volcanoes and earthquakes are both caused by powerful forces deep inside the earth. Both happen most often near the edges of the earth's plates, and both can damage buildings and hurt people. However, a volcano lets melted rock escape through an opening, while an earthquake makes the ground shake when rocks underground suddenly slip. A volcano can build new mountains and land, but an earthquake usually lasts only seconds or minutes. Unlike some eruptions, earthquakes come with almost no warning.",
  },
];

/** causeBank asks for a paragraph explaining causes and effects from notes, on the themes of the earth and the weather. */
const causeBank: readonly WritingItem[] = [
  {
    task: "Use these notes to write a paragraph that explains how a river can carve a canyon.",
    source:
      "river flows over rock for millions of years; water carries sand and pebbles; they scrape the riverbed; rock slowly worn away; deep canyon",
    model:
      "A river can carve a deep canyon if it has enough time. As the water flows, it carries sand and pebbles that scrape against the riverbed. Because this scraping goes on day after day, the rock is slowly worn away. Over millions of years, the riverbed sinks deeper and deeper, and as a result, the river ends up at the bottom of a canyon.",
  },
  {
    task: "Use these notes to write a paragraph that explains what happens when a volcano erupts.",
    source:
      "pressure builds as magma rises; magma bursts out as lava; ash fills the sky; lava and ash bury nearby land; new rock forms as lava cools",
    model:
      "A volcano erupts when magma deep underground pushes its way up. As the magma rises, pressure builds until it bursts out of the top as lava. The eruption also throws ash high into the sky. Because lava and ash pour over the land, nearby fields and houses can be buried. When the lava cools, it hardens into new rock, so an eruption can change the shape of the land.",
  },
  {
    task: "Use these notes to write a paragraph that explains the effects of a long drought.",
    source: "no rain for months; rivers and reservoirs shrink; crops wilt; farmers lose their harvest; animals travel to find water",
    model:
      "A long drought causes problems for people and animals. When no rain falls for months, rivers and reservoirs shrink. As a result, there is not enough water for crops, so they wilt and die. Farmers lose their harvest, which means less food reaches the markets. Wild animals are affected too, because they must travel long distances to find water.",
  },
  {
    task: "Use these notes to write a paragraph that explains why we have seasons.",
    source:
      "earth tilted on its axis; part of the year our half leans toward the sun; sunlight more direct and days longer; summer; leans away; winter",
    model:
      "We have seasons because the earth is tilted on its axis. For part of the year, our half of the earth leans toward the sun. This causes the sunlight to hit us more directly, and the days are longer, so the weather is warm and we have summer. Half a year later, our half leans away from the sun. As a result, the sunlight is weaker and the days are shorter, which brings winter.",
  },
  {
    task: "Use these notes to write a paragraph that explains how cutting down a forest can cause floods.",
    source:
      "tree roots hold soil and soak up water; forest cut down; rain runs straight off the bare ground; soil washes into rivers; rivers overflow",
    model:
      "Cutting down a forest can lead to floods. In a forest, tree roots hold the soil in place and soak up rainwater. When the trees are cut down, the rain runs straight off the bare ground instead of sinking in. This runoff carries soil into the rivers, which fill up faster than before. As a result, the rivers can overflow their banks during a heavy storm.",
  },
  {
    task: "Use these notes to write a paragraph that explains what happens to your body when you exercise.",
    source: "muscles need more oxygen; you breathe faster; heart beats faster to pump blood; body heats up; you sweat to cool down",
    model:
      "Exercise causes several changes in your body. When you run or jump, your muscles work hard, so they need more oxygen. Because of this, you breathe faster, and your heart beats faster to pump oxygen-rich blood to them. All this work also heats your body up. As a result, you begin to sweat, and the sweat cools you as it dries.",
  },
  {
    task: "Use these notes to write a paragraph that explains how the yearly flood of the Nile helped Egypt.",
    source: "summer rains far to the south; Nile rises and floods its banks; leaves rich black mud; fertile fields; enough food for cities",
    model:
      "The yearly flood of the Nile was the reason Egypt could feed its people. Each summer, heavy rains fell far to the south, and as a result the river rose and spread over its banks. When the water went down, it left behind a layer of rich black mud. This mud made the fields fertile, so farmers could grow plenty of wheat and barley. Because of the flood, Egypt had enough food for its growing cities.",
  },
  {
    task: "Use these notes to write a paragraph that explains why some birds migrate in the autumn.",
    source:
      "days get shorter and colder; insects and seeds become hard to find; birds fly to warmer places; find food all winter; return in spring",
    model:
      "Many birds migrate in the autumn because their food runs out. As the days grow shorter and colder, insects disappear and seeds become hard to find. Since the birds cannot find enough to eat, they fly to warmer places far away. There, they can find food all winter. When spring returns and food is plentiful again, they fly back home.",
  },
  {
    task: "Use these notes to write a paragraph that explains why we have day and night.",
    source:
      "the earth spins on its axis once every 24 hours; one side faces the sun and has daylight; the other side faces away and is dark; as the earth turns, places move from light into dark",
    model:
      "We have day and night because the earth spins like a top. It turns all the way around once every twenty-four hours. The side of the earth that faces the sun gets sunlight, so it has day. At the same time, the other side faces away from the sun, so it is dark there. As the earth keeps turning, each place moves from sunlight into darkness and back again, which is why day always follows night.",
  },
  {
    task: "Use these notes to write a paragraph that explains why bees matter to flowers and to people.",
    source:
      "bees visit flowers for nectar; pollen sticks to their hairy bodies; they carry pollen to other flowers; flowers make seeds and fruit; people get fruit, vegetables and honey",
    model:
      "Bees are important because they help flowers make seeds. When a bee visits a flower to drink nectar, pollen sticks to its hairy body. As the bee flies to the next flower, it carries the pollen along, and some of it rubs off. This lets the flower make seeds and fruit. As a result, people can enjoy apples, berries and many vegetables, and the bees make honey too.",
  },
  {
    task: "Use these notes to write a paragraph that explains what happens to your body when you exercise.",
    source:
      "muscles need more oxygen; you breathe faster and deeper; heart beats faster to send blood; body gets warm; you sweat to cool down",
    model:
      "When you exercise, your body has to work harder. Your muscles need more oxygen, so you start to breathe faster and more deeply. Your heart also beats faster because it must pump the oxygen-filled blood to your muscles quickly. All this work makes your body warm. To cool down, your skin begins to sweat, and as the sweat dries, it carries heat away.",
  },
  {
    task: "Use these notes to write a paragraph that explains why some animals have camouflage.",
    source:
      "predators hunt by sight; animals with colors like their surroundings are hard to see; they are less likely to be eaten; predators with camouflage can sneak up on prey",
    model:
      "Many animals have camouflage because it helps them survive. Most predators find their food by looking for it. An animal whose colors match the leaves, sand or snow around it is hard to see, so it is less likely to be caught and eaten. Camouflage helps hunters too. Because a striped tiger blends into the tall grass, it can sneak close to its prey before the prey notices it.",
  },
];

/** describeBank asks for a description, on the themes of the night sky, nature and places. */
const describeBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that describes the night sky on a clear night far from city lights.",
    model:
      "On a clear night far from the city, the sky is a deep, endless black. Thousands of stars glitter like spilled sugar on a dark tablecloth. The Milky Way stretches across the sky in a pale, misty band. Crickets chirp in the grass, and the cool air smells of pine. Lying on my back on the scratchy blanket, I feel tiny under so much sky.",
  },
  {
    task: "Imagine you are an astronaut standing on the moon. Write a paragraph that describes what you see and feel.",
    model:
      "Standing on the moon, I look out over a gray, silent desert. The ground is covered in fine dust as soft as flour, and my boots leave deep prints in it. Craters of every size dot the land like holes in a sponge. Above me, the sky is pitch black, and the earth hangs in it like a blue and white marble. Inside my helmet, all I can hear is the slow sound of my own breathing.",
  },
  {
    task: "Write a paragraph that describes a garden in spring.",
    model:
      "In spring, our garden wakes up in a burst of color. Yellow tulips stand in straight rows like soldiers, and pink blossoms cover the old apple tree. Bees buzz from flower to flower, their legs dusted with pollen. The soil is dark and damp, and it smells fresh after the morning rain. When I kneel to pull a weed, the cool grass tickles my knees.",
  },
  {
    task: "Write a paragraph that describes a thunderstorm as you watch it from a window.",
    model:
      "From my bedroom window, I watched the thunderstorm roll in. The sky turned the color of a bruise, and the trees bent and twisted in the wind. Suddenly, a jagged flash of lightning lit up the whole street. A second later, thunder cracked so loudly that the glass shook under my fingers. Then the rain came down in heavy sheets, drumming on the roof like a thousand tiny fists.",
  },
  {
    task: "Write a paragraph that describes the inside of an ancient Egyptian tomb as an archaeologist might see it.",
    model:
      "The tomb was dark, cool and silent as the archaeologist stepped inside. Her flashlight slid over walls covered in bright paintings of birds, boats and kings. The air smelled of dust and old stone. In the center of the room stood a golden coffin, its painted eyes staring calmly up at the ceiling. When she brushed her fingers across a carved hieroglyph, it felt smooth and cold, like ice.",
  },
  {
    task: "Write a paragraph that describes a busy market.",
    model:
      "The market on Saturday morning is loud, crowded and full of color. Piles of red tomatoes and bright green peppers fill the wooden stalls. Sellers shout out their prices, and a radio plays music somewhere in the crowd. The smell of fresh bread mixes with the sharp smell of fish on ice. Every few steps, someone bumps my elbow with a heavy shopping bag.",
  },
  {
    task: "Write a paragraph that describes a beach on a hot summer day.",
    model:
      "On a hot summer day, the beach shimmers in the sun. The sand burns the soles of my feet, so I hop quickly toward the water. Waves crash and then hiss as they slide back over the pebbles. Gulls cry overhead, and the salty wind tugs at my towel. When I finally dive in, the cold water is a shock, like jumping into a glass of lemonade full of ice.",
  },
  {
    task: "Write a paragraph that describes a forest in autumn.",
    model:
      "In autumn, the forest glows with red, orange and gold. Dry leaves crunch under my boots like cornflakes with every step. A cold breeze shakes the branches, and leaves spin slowly down around me. The air smells of damp earth and wood smoke from a far-off chimney. Somewhere high above, a woodpecker taps on a tree like someone knocking on a door.",
  },
  {
    task: "Write a paragraph that describes a busy market or shop you know.",
    model:
      "On Saturday mornings, the market on our street is packed with people and noise. Sellers shout prices over the rumble of carts, and a radio plays music from the fish stall. Piles of shiny red peppers and green beans sit beside baskets of sweet-smelling peaches. The air is warm and smells of fresh bread and frying onions. When I hold a ripe mango, its skin feels smooth and soft, like a ripe pear in my hand.",
  },
  {
    task: "Write a paragraph that describes the beach on a hot summer day.",
    model:
      "On a hot summer day, the beach shimmers under a bright white sun. The sand is so hot that it burns the soles of my feet, so I hop like a frog toward the water. Waves crash and hiss as they slide back over the pebbles. Seagulls cry overhead, and the wind tastes of salt. When I finally dive in, the cold water wraps around me like a cool blanket.",
  },
  {
    task: "Write a paragraph that describes a thunderstorm as it arrives.",
    model:
      "The thunderstorm arrives slowly and then all at once. First, the sky turns the color of an old bruise, and the air grows thick and still. A cold gust of wind sends leaves skittering down the street. Then a flash of lightning cracks the sky in two, and thunder booms like a giant drum. Fat raindrops splatter on the hot pavement, and the air fills with the sharp, clean smell of rain.",
  },
  {
    task: "Imagine you are standing beside a waterfall. Write a paragraph that describes what you see, hear and feel.",
    model:
      "Standing beside the waterfall, I can barely hear my own voice. The water roars as it tumbles over the cliff and crashes onto the rocks below. A cool, fine mist drifts up and dampens my face and arms. Where the sunlight hits the spray, a small rainbow glows in the air. The rocks under my feet are slippery and covered with soft green moss, as slick as soap.",
  },
];

/** writingTopics35 are the topics of writing judged by a model added for grades 3 to 5. */
export const writingTopics35: readonly TopicDef[] = [
  {
    id: "writing-a-narrative-paragraph",
    title: t("Writing a Story in a Paragraph", "用一个段落写故事"),
    summary: t(
      "Tell a short story: introduce a character and a situation, tell the events in order, show what happens, and bring it to an end.",
      "讲一个小故事：介绍人物和情境，按顺序讲述事件，展现发生了什么，并给故事一个结尾。",
    ),
    prerequisites: ["writing-a-paragraph", "punctuating-dialogue", "verb-tense-consistency"],
    encompasses: [
      { topic: "punctuating-dialogue", weight: 0.2 },
      { topic: "verb-tense-consistency", weight: 0.2 },
      { topic: "choosing-transitions", weight: 0.2 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g35-narrative-situation", "g35-narrative-sequence", "g35-narrative-ending", "g35-narrative-shows"].map(criterion),
    knowledgePoints: [
      point(
        "beginning-middle-end",
        t("Beginning, Middle and End", "开头、经过和结尾"),
        t(
          "A story, even a short one, has three parts. The **beginning** introduces a character and a situation: *On the morning of the class trip, Leo could not find his lucky cap.* The **middle** tells what happens, in order, often as the character tries to solve a problem. The **end** shows how things turn out or what the character learned.\n\nWords such as *then, at last, a few minutes later* and *that evening* help the reader follow the events, and a story told in the past tense stays in the past tense.",
          "故事哪怕很短，也有三个部分。**开头**介绍人物和情境：*On the morning of the class trip, Leo could not find his lucky cap.* **经过**按顺序讲述发生的事，常常是人物想办法解决一个问题。**结尾**说明事情的结果或人物学到了什么。\n\n*then, at last, a few minutes later, that evening* 这样的词帮助读者跟上事件；用过去时讲的故事要一直用过去时。",
        ),
        writingGenerator(
          t(
            "Write a short story in English in one paragraph, with a beginning, a middle and an end.",
            "用英语写一个段落的小故事，要有开头、经过和结尾。",
          ),
          storyBank,
          ["g35-narrative-situation", "g35-narrative-sequence", "g35-narrative-ending"],
          { minWords: 50, maxChars: 1800 },
          onePiece,
        ),
      ),
      point(
        "showing-what-happens",
        t("Showing What Happens", "展现发生了什么"),
        t(
          'A story comes alive when it **shows** instead of only telling. *Mei was nervous* tells. *Mei\'s hands shook as she waited behind the curtain* shows, and the reader feels it too.\n\nTwo tools do most of the showing: **details** of what a character does, sees, thinks or feels, and **dialogue**, the words a character says, in quotation marks: *"We leave in ten minutes!" his mom called.*',
          '故事要生动，就要**展现**，而不只是叙述。*Mei was nervous* 是叙述；*Mei\'s hands shook as she waited behind the curtain* 是展现，读者也能感受到。\n\n展现主要靠两样工具：人物所做、所见、所想、所感的**细节**，以及放在引号里的人物说的话，即**对话**：*"We leave in ten minutes!" his mom called.*',
        ),
        writingGenerator(
          t(
            "Write a short story in English in one paragraph. Show what happens with dialogue or details, not only a list of events.",
            "用英语写一个段落的小故事。用对话或细节展现发生了什么，而不只是罗列事件。",
          ),
          sceneBank,
          ["g35-narrative-shows", "g35-narrative-sequence"],
          { minWords: 50, maxChars: 1800 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-summary",
    title: t("Writing a Summary", "写摘要"),
    summary: t(
      "Retell the main idea and the most important points of a text, briefly and in your own words, without adding your opinion.",
      "用自己的话简要复述文本的主旨和最重要的要点，不加入自己的观点。",
    ),
    prerequisites: ["supporting-details", "writing-a-paragraph"],
    encompasses: [
      { topic: "supporting-details", weight: 0.3 },
      { topic: "main-idea", weight: 0.2 },
    ],
    xp: 18,
    strand: "writing",
    criteria: ["g35-summary-main-idea", "g35-summary-key-points", "g35-summary-own-words", "g35-summary-no-opinion"].map(criterion),
    knowledgePoints: [
      point(
        "main-idea-and-key-points",
        t("The Main Idea and the Key Points", "主旨和要点"),
        t(
          "A **summary** is a short retelling of a text. It begins with the **main idea**, what the whole text is about, and adds only the **most important points** that support it. Small details, examples and numbers are usually left out.\n\nA summary reports what the text says, not what you think of it: *I think this is interesting* does not belong in a summary.",
          "**摘要**是对文本的简短复述。它以**主旨**开头，即整篇文本讲的是什么，再只补充支持主旨的**最重要的要点**。细小的细节、例子和数字通常省略。\n\n摘要转述的是文本说了什么，而不是你怎么看它：*I think this is interesting* 不应出现在摘要里。",
        ),
        writingGenerator(
          t("Read the passage and write a summary of it in English.", "阅读这段文字，用英语为它写一个摘要。"),
          summaryBank,
          ["g35-summary-main-idea", "g35-summary-key-points", "g35-summary-no-opinion"],
          { minWords: 25, maxChars: 900 },
          (model) => t(`One good summary:\n\n> ${model}`, `一个好的摘要：\n\n> ${model}`),
        ),
      ),
      point(
        "in-your-own-words",
        t("In Your Own Words", "用自己的话"),
        t(
          "Copying sentences from a text is not summarizing. To put a text in your own words, read it, look away, and say what it is about as you would to a friend. Then write that down and check it against the text.\n\nYou may keep the special words of the subject, such as *evaporation* or *pharaoh*, but the sentences should be yours, and shorter than the original.",
          "从文本中抄句子不是写摘要。要用自己的话表达，先读文本，然后不看它，像对朋友讲那样说出它讲了什么，再写下来，并和原文核对。\n\n可以保留学科的专门用词，如 *evaporation* 或 *pharaoh*，但句子要是你自己的，而且比原文短。",
        ),
        writingGenerator(
          t("Read the passage and write a summary of it in English, in your own words.", "阅读这段文字，用你自己的英语为它写一个摘要。"),
          summaryBank,
          ["g35-summary-own-words", "g35-summary-main-idea"],
          { minWords: 25, maxChars: 900 },
          (model) => t(`One good summary:\n\n> ${model}`, `一个好的摘要：\n\n> ${model}`),
        ),
      ),
    ],
  },
  {
    id: "writing-a-compare-and-contrast-paragraph",
    title: t("Writing a Compare-and-Contrast Paragraph", "写比较对照段落"),
    summary: t(
      "Name two things, show how they are alike and how they differ, and connect the points with words of comparison.",
      "点明两个事物，说明它们的相同点和不同点，并用表示比较的词把各点连接起来。",
    ),
    prerequisites: ["compare-and-contrast-in-texts", "writing-a-paragraph"],
    encompasses: [
      { topic: "compare-and-contrast-in-texts", weight: 0.3 },
      { topic: "writing-a-paragraph", weight: 0.3 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g35-compare-names-both", "g35-compare-likeness", "g35-compare-difference", "g35-compare-signals"].map(criterion),
    knowledgePoints: [
      point(
        "alike-and-different",
        t("Alike and Different", "相同与不同"),
        t(
          "A compare-and-contrast paragraph opens by naming the two things: *Frogs and toads look alike, but they are not the same.* Then it gives at least one way they are **alike** and at least one way they are **different**.\n\nSignal words show the reader which is which. For likenesses: *both, also, like, too, similarly*. For differences: *but, however, while, unlike, on the other hand, whereas*. Each difference compares the same feature of both: *A frog has smooth skin, while a toad's skin is bumpy.*",
          "比较对照段落开头先点明两个事物：*Frogs and toads look alike, but they are not the same.* 然后至少写出一个**相同点**和一个**不同点**。\n\n信号词告诉读者哪是相同、哪是不同。表示相同：*both, also, like, too, similarly*。表示不同：*but, however, while, unlike, on the other hand, whereas*。每个不同点都比较两者的同一个方面：*A frog has smooth skin, while a toad's skin is bumpy.*",
        ),
        writingGenerator(
          t(
            "Use the notes to write a paragraph in English that compares the two things: how they are alike and how they differ.",
            "根据笔记用英语写一个段落，比较这两个事物：它们的相同点和不同点。",
          ),
          compareBank,
          ["g35-compare-names-both", "g35-compare-likeness", "g35-compare-difference", "g35-compare-signals"],
          { minWords: 45, maxChars: 1600 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-cause-and-effect-paragraph",
    title: t("Writing a Cause-and-Effect Paragraph", "写因果段落"),
    summary: t(
      "Explain what makes something happen and what happens as a result, linking each cause to its effect.",
      "说明是什么使某事发生、结果又发生了什么，把每个原因和它的结果联系起来。",
    ),
    prerequisites: ["cause-and-effect-in-texts", "writing-a-paragraph"],
    encompasses: [
      { topic: "cause-and-effect-in-texts", weight: 0.3 },
      { topic: "writing-a-paragraph", weight: 0.3 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g35-cause-names-cause", "g35-cause-names-effect", "g35-cause-explains-link", "g35-cause-signals"].map(criterion),
    knowledgePoints: [
      point(
        "cause-to-effect",
        t("From Cause to Effect", "从原因到结果"),
        t(
          "A **cause** is what makes something happen; an **effect** is what happens as a result. A cause-and-effect paragraph names the cause, names the effects, and explains **how** one leads to the other. *The drought dried up the rivers* only names them; *Because no rain fell for months, the rivers shrank, so there was not enough water for the crops* explains the chain.\n\nSignal words link the steps: *because, since, so, as a result, therefore, this causes, which means*.",
          "**原因**是使某事发生的事；**结果**是因此发生的事。因果段落要点明原因、点明结果，并解释一个**怎样**导致另一个。*The drought dried up the rivers* 只是点明了二者；*Because no rain fell for months, the rivers shrank, so there was not enough water for the crops* 才解释了这条链条。\n\n信号词把各步连接起来：*because, since, so, as a result, therefore, this causes, which means*。",
        ),
        writingGenerator(
          t(
            "Use the notes to write a paragraph in English that explains the causes and effects.",
            "根据笔记用英语写一个段落，解释其中的原因和结果。",
          ),
          causeBank,
          ["g35-cause-names-cause", "g35-cause-names-effect", "g35-cause-explains-link", "g35-cause-signals"],
          { minWords: 45, maxChars: 1600 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-descriptive-paragraph",
    title: t("Writing a Descriptive Paragraph", "写描写段落"),
    summary: t(
      "Paint a picture in words: name the subject, use details of several senses, and choose precise words and comparisons.",
      "用文字描绘画面：点明描写对象，运用多种感官的细节，选择准确的词语和比喻。",
    ),
    prerequisites: ["similes-and-metaphors", "order-of-adjectives", "writing-a-paragraph"],
    encompasses: [
      { topic: "similes-and-metaphors", weight: 0.2 },
      { topic: "adjectives-and-adverbs", weight: 0.2 },
      { topic: "writing-a-paragraph", weight: 0.2 },
    ],
    xp: 20,
    strand: "writing",
    criteria: ["g35-describe-subject", "g35-describe-senses", "g35-describe-precise", "g35-describe-stays"].map(criterion),
    knowledgePoints: [
      point(
        "senses-and-precise-words",
        t("The Senses and Precise Words", "感官和准确的词语"),
        t(
          "A description helps the reader see, hear, touch, smell and taste a place or a thing. Open by naming it: *In autumn, the forest glows with red, orange and gold.* Then add details of at least two **senses**: *dry leaves crunch under my boots; the air smells of wood smoke.*\n\nChoose **precise** words over vague ones: *crunch* instead of *make a noise*, *glitter* instead of *shine*. A **simile** compares with *like* or *as*: *stars glitter like spilled sugar.* Keep every sentence on the subject you are describing.",
          "描写帮助读者看到、听到、摸到、闻到、尝到一个地方或一件事物。开头先点明描写对象：*In autumn, the forest glows with red, orange and gold.* 然后加入至少两种**感官**的细节：*dry leaves crunch under my boots; the air smells of wood smoke.*\n\n选择**准确**的词，而不是笼统的词：用 *crunch* 而不是 *make a noise*，用 *glitter* 而不是 *shine*。**明喻**用 *like* 或 *as* 作比较：*stars glitter like spilled sugar.* 每个句子都要围绕所描写的对象。",
        ),
        writingGenerator(
          t(
            "Write a descriptive paragraph in English. Use details of at least two senses and precise words.",
            "用英语写一个描写段落。运用至少两种感官的细节和准确的词语。",
          ),
          describeBank,
          ["g35-describe-subject", "g35-describe-senses", "g35-describe-precise", "g35-describe-stays"],
          { minWords: 45, maxChars: 1600 },
          onePiece,
        ),
      ),
    ],
  },
];
