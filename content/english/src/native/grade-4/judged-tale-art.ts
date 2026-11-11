// Grade 4: writing judged by a model, a tall tale and a response to a work of art described in words.

import { type TopicDef, t } from "@ga/content";
import { point, type WritingItem, writingGenerator } from "@ga/subject-english";
import { criterion, onePiece } from "./judged-kit.ts";

/** taleBank asks for a tall tale about a hero with one extraordinary power. */
const taleBank: readonly WritingItem[] = [
  {
    task: "Write a tall tale about a girl who could run faster than anything on Earth.",
    model:
      "Swift Sally was born running, and by the age of three she could outrun the family dog. At seven, she raced the morning train to town and waited at the station for it to arrive. At ten, she ran so fast that she caught up with yesterday and had to wait for today to come back. One summer, a terrible drought dried up the plains, so Sally ran around the world to fetch a rain cloud. She ran so fast dragging it home that it tore into a thousand pieces. That is why, to this day, summer storms come in quick, patchy showers.",
  },
  {
    task: "Write a tall tale about a farmer who was stronger than a hundred oxen.",
    model:
      "Big Bao was so strong that he could plow a whole field with one hand while eating lunch with the other. When his cart got stuck in the mud, he simply carried the cart, the horse and the mud home together. Soon he was lifting barns to sweep under them. One spring, a mountain blocked the river from reaching his village, so Bao grabbed the mountain and pulled it aside like a curtain. He pulled so hard that the mountain cracked down the middle. That crack is the valley the river still runs through today.",
  },
  {
    task: "Write a tall tale about a boy who was taller than any tree.",
    model:
      "Tall Tomas grew so fast that his mother had to cut a hole in the roof for his head. By the time he was six, birds built nests in his hair. By twelve, he could look over the mountains and tell the next village when it was going to rain. One winter night, the moon got caught in the top of a pine tree, and the whole land went dark. Tomas reached up, unhooked the moon and gave it a gentle push back into the sky. He pushed a little too hard, and the moon has been drifting away ever since.",
  },
  {
    task: "Write a tall tale about a cook whose soup was so hot it could melt anything.",
    model:
      "Pepper Pearl made the hottest soup in the West. One spoonful made a cowboy's hat fly off his head. Two spoonfuls made his boots smoke. When Pearl tasted it herself, steam shot out of her ears so hard that it blew the clouds across the sky. One year, winter would not end, and snow piled up to the rooftops. So Pearl cooked a pot of soup as big as a lake and poured it over the hills. The snow melted in an instant, and the hot soup soaked into the ground. That is why hot springs bubble up in those hills to this day.",
  },
  {
    task: "Write a tall tale about a fisherman who caught the biggest fish in the world.",
    model:
      "Captain Marina could catch a fish with a bent pin and a bit of string. At first she caught fish as big as dogs. Then she caught fish as big as boats. One morning, her line pulled so hard that her ship skipped across the waves like a stone. She held on for three days until a whale as big as an island rose out of the sea. Marina wrestled it all afternoon, but at last she let it go out of kindness. The whale was so grateful that it sprayed a fountain of thanks into the air, and whales have been spouting water ever since.",
  },
  {
    task: "Write a tall tale about a girl who could talk to the wind.",
    model:
      "Windy Wen could whisper to the wind, and the wind always listened. When she wanted to fly her kite, a breeze lifted it to the clouds. When she wanted to dry the laundry, a warm gust dried it in a second. Soon she was asking the wind to carry ships across oceans in a single afternoon. One day, Wen sneezed while talking to the wind, and the wind got so confused that it began to spin and spin. It spun so hard that it twisted into the very first tornado. Now Wen always covers her mouth when she sneezes outside.",
  },
  {
    task: "Write a tall tale about a lumberjack who was so big that his footprints became lakes.",
    model:
      "Long ago, a lumberjack named Big Jack was so huge that he used a pine tree as a toothpick. When he was a baby, he needed five cows just for his breakfast milk. As a grown man, he could chop down a whole forest with one swing of his axe. One day he went for a walk across the northern woods. His feet were so heavy that every step sank deep into the ground. When the rain came, his footprints filled with water. That is how the ten thousand lakes of the north were made.",
  },
  {
    task: "Write a tall tale about a cowgirl who could rope anything.",
    model:
      "Lasso Lucy could rope a calf before it knew it was being chased. Soon she was roping whole herds with one throw. By the time she was twelve, she could rope a bird right out of the sky without ruffling a feather. One night, a bright star was falling toward her town, and everyone ran screaming. Lucy swung her rope high, caught the star and tied it to the top of a hill. It glowed there so brightly that the town never needed lamps again. People still call that hill Star Hill.",
  },
  {
    task: "Write a tall tale about a baker who made bread so light it floated.",
    model:
      "Baker Bella made bread so light that she had to tie it to the table with string. Her rolls floated around the kitchen like balloons, and her loaves bumped against the ceiling. One morning, she baked a loaf so fluffy that it lifted her whole shop off the ground. The shop floated over the town, and people climbed ladders to buy their breakfast. When the wind blew her bread across the sky, pieces of it broke off and stayed there. That is why, on sunny days, you can still see soft, white clouds shaped like loaves of bread.",
  },
  {
    task: "Write a tall tale about a boy who could jump higher than mountains.",
    model:
      "Jumping Jamal could jump over the garden fence when he was two. At five, he jumped over the school, and the teachers had to send notes to him by bird. At ten, he jumped so high that he could shake hands with passing airplanes. One day, he jumped higher than ever and landed on top of the tallest mountain with a crash. He landed so hard that he flattened the peak like a pancake. Ever since, that mountain has had a flat top, and people say it is the best place for a picnic.",
  },
  {
    task: "Write a tall tale about a girl who could sing louder than thunder.",
    model:
      "Loud Lena sang so loudly that the windows of her town rattled every morning. When she sang in the bath, fish in the river jumped out to listen. When she sang at school, the bell gave up and stopped ringing. One night, a huge storm rolled in, and the thunder boomed so loudly that no one could sleep. Lena climbed the tallest hill and sang right back at it. Her voice was so loud that the thunder ran away in fright. That is why, even today, thunder always rumbles away into the distance after a storm.",
  },
  {
    task: "Write a tall tale about a gardener who could grow anything overnight.",
    model:
      "Green-Thumb Gus could plant a seed at dinner and pick a tomato by breakfast. Soon his pumpkins grew so big that children used them as houses. His sunflowers grew so tall that they tickled the bottom of the clouds. One year, he planted a single bean, and by morning its stalk reached right up to the moon. Gus climbed it to see the view and sprinkled leftover seeds as he went. The seeds landed on the moon and grew into gray dust plants. That is why the moon is covered with dust to this day.",
  },
];

/** taleGrowsBank asks for a tall tale whose exaggeration grows from event to event, in order. */
const taleGrowsBank: readonly WritingItem[] = [
  {
    task: "Write a tall tale about a girl who could carry anything. Make each feat bigger than the one before.",
    model:
      "Mighty Mei could carry anything. First she carried her mother's groceries in one hand. Then she carried the whole market, stalls and all, so it would not get wet in the rain. Next she carried a ship over a mountain when it could not sail around. Finally, when the sun got stuck behind a cloud for a week, Mei climbed up and carried the cloud away on her back. She dropped a few drops on the way, and that is how drizzle came to be.",
  },
  {
    task: "Write a tall tale about a boy whose sneezes were stronger than storms. Make each sneeze bigger than the one before.",
    model:
      "Achoo Arjun had the strongest sneeze in the world. His first sneeze blew out every candle on his birthday cake from across the room. His second sneeze blew his neighbor's laundry into the next town. His third sneeze knocked the apples off every tree in the orchard. Then came the biggest sneeze of all, which blew so hard that it pushed the whole desert sand into hills. Those hills are the sand dunes that still roll across the desert.",
  },
  {
    task: "Write a tall tale about a dog that could dig deeper than anyone. Make each hole deeper than the one before.",
    model:
      "Digger was a dog who loved to dig. On Monday he dug a hole big enough to bury a bone. On Tuesday he dug one big enough to bury a car. On Wednesday he dug so deep that he found a river running underground. By Friday he had dug all the way through the Earth and popped out on the other side, where it was night instead of day. Water poured in after him and filled the hole, and that is how the very first well was made.",
  },
  {
    task: "Write a tall tale about a girl who could swim faster than a fish. Make each swim more amazing than the last.",
    model:
      "Splash Sofia swam faster than the fish in her village pond. Soon she was racing dolphins along the coast and winning. Then she swam across the whole sea before her lunch got cold. One day, she swam so fast around an island that the water began to spin behind her. It spun faster and faster until it became a great whirlpool. Sailors still steer clear of that spinning water, and they call it Sofia's Swirl.",
  },
  {
    task: "Write a tall tale about a man who was so hungry he could eat anything. Make each meal bigger than the one before.",
    model:
      "Hungry Hank was always hungry. For breakfast as a boy, he ate a hundred pancakes. By the time he was grown, he could eat a whole wagon of corn for lunch. Then one supper, he ate an entire orchard of apples, trees and all. Finally, Hank was so hungry that he took a bite out of the side of a mountain. The bite is still there, a great curved cliff, and people call it Hank's Bite.",
  },
  {
    task: "Write a tall tale about a girl who could make anything grow by laughing. Make each laugh do more than the last.",
    model:
      "Giggling Grace could make plants grow just by laughing. A small giggle made the grass grow an inch. A chuckle made a whole tree burst into flowers. A belly laugh made the corn in the fields grow taller than the barn. One day, a traveling clown made her laugh so hard that the whole bare hillside turned into a forest in an afternoon. That is why forests are full of rustling leaves: they are still laughing with Grace.",
  },
  {
    task: "Write a tall tale about a boy who could throw farther than anyone. Make each throw farther than the one before.",
    model:
      "Pitching Pablo could throw a ball across the playground when he was four. At eight, he threw a ball across the river, and it landed in the next village. At twelve, he threw a stone so far that it skipped across the ocean and landed in another country. One night, he threw a ball so hard that it flew into the sky and never came down. It is still up there, glowing, and we call it the evening star.",
  },
  {
    task: "Write a tall tale about a woman who could stay awake forever. Make each night of staying awake more surprising than the last.",
    model:
      "Wide-Awake Wanda never needed to sleep. As a girl, she stayed up all night counting stars, and she counted every one. As a young woman, she stayed awake for a whole year to guard her sheep. Later, she stayed awake so long that the night itself grew tired and wanted to rest. So Wanda made a deal with the night: it could rest for a few hours each morning. That is how dawn came to be, when the night takes its nap.",
  },
  {
    task: "Write a tall tale about a boy whose breath was so cold it froze everything. Make each freeze bigger than the one before.",
    model:
      "Frosty Finn had breath so cold that he froze his soup when he blew on it. When he sighed, the puddles on the road turned to ice. When he yawned, a whole pond froze solid, and the town went skating. One hot summer, he took the deepest breath of his life and blew across a great lake. The water froze so hard that it never thawed again. That lake is the glacier that still lies between the mountains.",
  },
  {
    task: "Write a tall tale about a girl who could paint anything to life. Make each painting more amazing than the last.",
    model:
      "Painter Paz could make her paintings come alive. First she painted a butterfly, and it fluttered off the page. Then she painted a horse, and it galloped out of the room. Next she painted a river, and it flowed right out of the frame and across the floor. Finally, she painted the sky at sunset, and the colors floated up and spread across the real sky. Ever since, sunsets have been painted orange, pink and purple.",
  },
  {
    task: "Write a tall tale about a man who was so strong he could stop rivers. Make each feat bigger than the one before.",
    model:
      "Strong Sven could stop a stream with one boot. Then he blocked a river by lying down across it like a log. Next he held back a flood with his bare hands while the whole village escaped. Finally, when the sea tried to swallow the land, Sven pushed it back with a great shove of his shoulders. He pushed so hard that the land wrinkled up into tall cliffs. Those cliffs still stand along the coast, holding back the sea.",
  },
  {
    task: "Write a tall tale about a girl who could hear sounds from anywhere in the world. Make each sound she heard farther away than the last.",
    model:
      "Listening Lila could hear a mouse sneeze from the bottom of the garden. Soon she could hear the fish talking at the bottom of the lake. Next she could hear people laughing on the other side of the world. One night, she listened so hard that she heard the stars humming to each other. She hummed back, and the stars were so delighted that they began to twinkle. That is why stars have twinkled ever since.",
  },
];

/** artBank asks for a response to a work of art described in words. */
const artBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of a small fishing boat on a stormy sea at night. Huge dark-green waves rise around the boat, and white foam sprays into the air. A single yellow lantern glows at the front of the boat. In the top corner, the moon peeks out between black clouds.",
    model:
      "This painting shows a tiny fishing boat caught in a wild storm at night. Towering dark-green waves curl around it, and white foam explodes into the air. I think it is a painting about courage. The waves are so much bigger than the boat that it seems almost lost, yet the single yellow lantern keeps glowing at its front. The moon peeking between the black clouds also gives me hope that the storm will end. To me, the painting says that even a small light can stand up to a great darkness.",
  },
  {
    task: "Write a paragraph that responds to this sculpture: describe what it shows, say what you think of it and explain why.",
    source:
      "A bronze sculpture of an old woman sitting on a bench, feeding pigeons. She leans forward with a gentle smile, and one bird stands on her open hand. Her coat is patched at the elbows. Real people often sit beside the sculpture in the park.",
    model:
      "This bronze sculpture shows an old woman on a park bench, leaning forward to feed the pigeons. One bird stands on her open hand, and her coat is patched at the elbows. I think the sculpture is warm and welcoming. Her gentle smile and the bird resting on her hand show that she is kind and patient. The patches on her coat suggest that she does not have much, but she still shares what she has. Because people sit beside her on the real bench, the sculpture feels like a friend in the park.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of a crowded city market in bright colors. Stalls are piled with red tomatoes, orange pumpkins and purple grapes. People in colorful clothes bargain and laugh. A boy in the front holds up a yellow balloon. The sky above is a clear, bright blue.",
    model:
      "This painting shows a busy city market full of people and bright food. The stalls overflow with red tomatoes, orange pumpkins and purple grapes, and the people bargain and laugh in colorful clothes. I think the painting is joyful. The bright colors fill every corner, so the market feels alive and noisy even though it is only paint. The boy holding up his yellow balloon looks so happy that I wanted to smile too. The clear blue sky makes the whole scene feel like a perfect day. It is a celebration of a crowded, cheerful place.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of an empty kitchen in the early morning. Pale gray light comes through a small window onto a wooden table. On the table are one cup, one plate and a single chair pushed in. The walls are a faded blue, and the clock on the wall shows six o'clock.",
    model:
      "This painting shows an empty kitchen in the pale light of early morning. On the wooden table there is just one cup, one plate and one chair, and the clock shows six o'clock. I think it is a quiet, lonely painting. Because there is only one of everything, it seems that a person lives here alone. The gray light and the faded blue walls make the room feel cool and still. Even so, I like how calm it is. The painting made me imagine who drinks from that cup each morning.",
  },
  {
    task: "Write a paragraph that responds to this sculpture: describe what it shows, say what you think of it and explain why.",
    source:
      "A tall sculpture made of shiny steel in the shape of a tree. Its branches twist upward, and instead of leaves, it has hundreds of small mirrors. When the sun shines, the mirrors throw spots of light across the square around it.",
    model:
      "This sculpture is a tall steel tree with twisting branches and hundreds of small mirrors instead of leaves. When the sun shines, the mirrors scatter spots of light across the square. I think it is a clever and playful sculpture. A real tree gives shade, but this one gives light, which turns the idea of a tree upside down. The twisting branches make it look as if it is growing toward the sky. I would love to stand under it on a sunny day and watch the light dance around me.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of a field of sunflowers under a stormy sky. The sunflowers are bright yellow, and they all face the same way. Above them, the sky is dark purple, and a bolt of lightning cuts down in the distance. A small red farmhouse stands at the edge of the field.",
    model:
      "This painting shows a field of bright yellow sunflowers under a dark purple, stormy sky. Lightning strikes in the distance, and a small red farmhouse sits at the edge of the field. I find the painting exciting because of its contrast. The cheerful yellow flowers look even brighter against the gloomy sky, as if they are glowing. All the sunflowers face the same way, which makes them look brave, like soldiers waiting for the storm. The tiny farmhouse made me worry about the people inside. It is a painting full of tension.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of a girl reading a book in a window seat. Rain streaks the glass behind her. She is wrapped in a green blanket, and a gray cat sleeps on her feet. A cup of tea steams on the windowsill. The room is lit by a warm orange lamp.",
    model:
      "This painting shows a girl curled up in a window seat with a book, while rain streaks the glass behind her. She is wrapped in a green blanket, a gray cat sleeps on her feet and a cup of tea steams beside her. I think it is the coziest painting I have seen. The cold rain outside makes the warm orange lamplight inside feel even more comforting. The sleeping cat and the steaming tea show that she is in no hurry at all. The painting makes me want to find a book and a blanket of my own.",
  },
  {
    task: "Write a paragraph that responds to this sculpture: describe what it shows, say what you think of it and explain why.",
    source:
      "A stone sculpture of a horse rearing up on its back legs. Its mane flies back as if in a strong wind, and its mouth is open. The stone is rough and gray, and the horse is twice the size of a real one. It stands on a high base in the middle of a town square.",
    model:
      "This stone sculpture shows a huge horse rearing up on its back legs in the middle of a town square. Its mane streams back and its mouth is open, as if it is neighing. I think the sculpture is powerful. Even though it is made of hard, rough stone, the flying mane makes it look full of movement, as if it might leap off its base. Because it is twice the size of a real horse and stands up high, people have to look up at it. It makes the whole square feel strong and proud.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting made only of shapes: large red circles, small blue squares and thin black lines that cross the canvas. The shapes overlap in some places. The background is plain white. The painting is called Music.",
    model:
      "This painting is made only of shapes: large red circles, small blue squares and thin black lines crossing a plain white background. At first I did not understand it, but the title, Music, changed my mind. I think it shows how music feels. The big red circles are like loud drumbeats, and the small blue squares are like quick, quiet notes. The black lines look like the lines of a melody moving across the page. Where the shapes overlap, it feels like many instruments playing together. It is a painting you can almost hear.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of a grandfather teaching a boy to fly a kite on a beach. The kite is shaped like a red fish. The grandfather points to the sky while the boy holds the string with both hands. Their footprints trail behind them in the sand. The sea is calm and silver.",
    model:
      "This painting shows a grandfather teaching a boy to fly a red fish-shaped kite on a beach. The grandfather points to the sky while the boy grips the string with both hands. I think the painting is about passing something on. The grandfather's pointing hand shows that he is teaching, and the boy's tight grip shows how hard he is trying. The footprints trailing behind them tell me they have walked a long way together. The calm silver sea makes the moment feel peaceful. It reminds me of the things my own grandmother has taught me.",
  },
  {
    task: "Write a paragraph that responds to this sculpture: describe what it shows, say what you think of it and explain why.",
    source:
      "A sculpture of a giant hand rising out of a lake. Only the fingers and the palm show above the water. The hand is made of white stone, and birds often rest on the fingertips. In the morning, mist hangs around it.",
    model:
      "This sculpture is a giant white stone hand rising out of a lake, with only its palm and fingers above the water. Birds rest on its fingertips, and mist hangs around it in the morning. I think it is mysterious and a little magical. It looks as though a giant is lying under the lake and reaching up to the sky. The morning mist makes it seem like something from a dream. I like that the birds use it as a perch, because it makes the hand seem gentle instead of scary.",
  },
  {
    task: "Write a paragraph that responds to this painting: describe what it shows, say what you think of it and explain why.",
    source:
      "A painting of a snowy village at night. Small houses with glowing yellow windows sit along a winding road. Smoke curls from every chimney. A family walks up the road carrying a lantern, and the stars above are tiny white dots.",
    model:
      "This painting shows a snowy village at night, with little houses along a winding road and yellow light glowing from every window. Smoke curls from the chimneys, and a family walks up the road with a lantern. I think the painting feels warm, even though it shows snow. The glowing windows and curling smoke tell me that every house has a fire inside. The family with the lantern seems to be walking home, which makes the scene feel safe and happy. The tiny stars above add a quiet sparkle. It is a peaceful winter evening.",
  },
];

/** artDetailsBank asks for a response to a work of art whose opinion rests on details of the work. */
const artDetailsBank: readonly WritingItem[] = [
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a lighthouse on a rocky island. Its beam of light stretches across a dark sea toward a small ship. The sky is full of heavy gray clouds, but a thin line of pink shows at the horizon.",
    model:
      "This painting shows a lighthouse on a rocky island, sending its beam across a dark sea toward a small ship. I think the painting is hopeful. First, the beam reaches all the way to the ship, as if the lighthouse is guiding it safely home. Second, although the sky is heavy with gray clouds, a thin line of pink shows at the horizon, which tells me that morning is coming. Together, these details turn a gloomy scene into one about safety and new beginnings.",
  },
  {
    task: "Write a paragraph about this sculpture. Say what you think of it, and point to at least two details of the sculpture that show why.",
    source:
      "A small clay sculpture of two children sharing an umbrella. The umbrella is tipped toward the smaller child, and the bigger child's shoulder is wet. Both are laughing.",
    model:
      "This clay sculpture shows two children laughing as they share an umbrella. I think it is a sculpture about kindness. The umbrella is tipped toward the smaller child, so the bigger child is giving up some of the shelter. Because of this, the bigger child's shoulder is wet, but they are still laughing, which shows they do not mind. These small details make a simple scene into a lesson about caring for others.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a city street at rush hour. Dozens of people in gray coats hurry in the same direction, looking at the ground. In the middle, one girl in a yellow raincoat stands still, looking up at a bird on a lamppost.",
    model:
      "This painting shows a crowded city street where dozens of people in gray coats rush in the same direction. I think the painting is telling us to slow down. All the hurrying people look at the ground, so they miss what is around them. In the middle, one girl in a bright yellow raincoat stands still and looks up at a bird on a lamppost. Her yellow coat makes her stand out from the gray crowd, just as her curiosity does. The painting made me want to look up more often.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a garden in autumn. A huge orange maple tree drops its leaves onto a stone path. An empty swing hangs from one branch. A rake leans against the tree, and a small pile of leaves lies beside it.",
    model:
      "This painting shows an autumn garden with a huge orange maple tree dropping its leaves onto a stone path. I think the painting feels a little sad. The empty swing hanging from the branch makes me wonder who used to play on it and where they have gone. The rake leaning against the tree and the small, unfinished pile of leaves suggest that someone stopped working and left. Even with its bright orange colors, the garden seems to be waiting for someone to come back.",
  },
  {
    task: "Write a paragraph about this sculpture. Say what you think of it, and point to at least two details of the sculpture that show why.",
    source:
      "A metal sculpture of a giant bicycle made of old spoons, forks and keys welded together. It stands outside a recycling center. Its wheels really turn when the wind blows.",
    model:
      "This sculpture is a giant bicycle built from old spoons, forks and keys welded together. I think it is a clever and fun sculpture. Because it is made of things people threw away, it shows that old objects can become something new, which is perfect for a place outside a recycling center. Its wheels really turn in the wind, so it seems to be moving even though no one is riding it. The sculpture makes recycling look exciting.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a lion resting in tall golden grass at sunset. The lion's eyes are half closed, and its tail curls lazily. Behind it, the sun is a huge orange circle sinking below the horizon. Two small birds sit on a branch nearby.",
    model:
      "This painting shows a lion resting in tall golden grass as the sun sets behind it. I think the painting is peaceful rather than frightening. The lion's half-closed eyes and lazily curled tail show that it is relaxed and sleepy. The two small birds sitting calmly on a nearby branch are not afraid of it at all. The huge orange sun sinking below the horizon gives the whole scene a warm, drowsy glow. It shows a wild animal at a quiet moment.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a classroom on the last day of school. Paper airplanes fly through the air, and children throw their hats up. The teacher stands at the front, smiling, with a paper airplane stuck in her hair. Sunlight floods through the open windows.",
    model:
      "This painting shows a classroom on the last day of school, full of flying paper airplanes and tossed hats. I think it is a wonderfully happy painting. The sunlight flooding through the open windows makes it feel like the first day of summer. The funniest detail is the teacher, who is smiling even with a paper airplane stuck in her hair, so I can tell she is enjoying the moment too. The hats in the air show how free and excited the children feel.",
  },
  {
    task: "Write a paragraph about this sculpture. Say what you think of it, and point to at least two details of the sculpture that show why.",
    source:
      "A wooden sculpture of an owl carved from a single tree stump. Its huge eyes are made of polished amber that shines in the light. Its wings are folded, and every feather is carved one by one.",
    model:
      "This sculpture is an owl carved from a single tree stump. I think it is a beautiful piece of work. Its huge amber eyes shine in the light, which makes the owl look wise and alive, as if it is watching me. Every feather on its folded wings is carved one by one, which shows how patient and careful the artist must have been. Because it was made from a stump, the owl seems to have grown right out of the forest.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a train crossing a high bridge over a deep valley. White steam pours from the engine. Far below, a river winds between green hills, and a tiny village sits by the water. People wave from the train's windows.",
    model:
      "This painting shows a train crossing a high bridge over a deep green valley. I think it captures the excitement of a journey. The white steam pouring from the engine shows that the train is moving fast. The people waving from the windows look happy to be going somewhere new. Far below, the tiny village and the winding river show just how high up the bridge is, which made me feel a little dizzy. The painting makes me want to take a trip.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a forest at night, lit only by fireflies. Hundreds of tiny green-yellow lights float between dark trees. A fox sits in a clearing, looking up at them. The moon is hidden.",
    model:
      "This painting shows a dark forest lit only by hundreds of fireflies. I think it is magical. Because the moon is hidden, the tiny green-yellow lights are the only brightness, so they look like stars that have come down to the ground. The fox sitting in the clearing and looking up at them seems as amazed as I am. These details make an ordinary forest feel like a place in a fairy tale.",
  },
  {
    task: "Write a paragraph about this sculpture. Say what you think of it, and point to at least two details of the sculpture that show why.",
    source:
      "A sculpture of a whale made of thousands of plastic bottles collected from beaches. It is as long as a bus and hangs from the ceiling of a museum hall. Light shines through the bottles, making blue shadows on the floor.",
    model:
      "This sculpture is a whale as long as a bus, made from thousands of plastic bottles collected from beaches. I think it is both beautiful and serious. The light shining through the bottles makes blue shadows on the floor, as if the hall were under the sea. But the fact that every bottle came from a beach reminds us how much plastic ends up in the ocean, where real whales live. The sculpture makes people stop, look and think about what they throw away.",
  },
  {
    task: "Write a paragraph about this painting. Say what you think of it, and point to at least two details of the painting that show why.",
    source:
      "A painting of a girl standing at the top of a high diving board. Below her, the pool is bright blue. Her toes curl over the edge, and her arms are held out to the sides. In the stands, a small crowd watches.",
    model:
      "This painting shows a girl at the top of a high diving board, with a bright blue pool far below. I think the painting is full of suspense. Her toes curling over the edge show that she is nervous and holding on. Her arms held out to the sides make it look as though she is about to jump or is trying to keep her balance. The watching crowd adds to the pressure. I wanted to know whether she jumped.",
  },
];

/** taleArtTopics4 are the judged writing topics of grade 4 for a tall tale and a response to art. */
export const taleArtTopics4: readonly TopicDef[] = [
  {
    id: "writing-a-tall-tale",
    title: t("Writing a Tall Tale", "写荒诞故事"),
    summary: t(
      "Write a tall tale about a hero with one extraordinary power, with exaggeration that grows from event to event, events in order and an ending that explains something in nature or the world.",
      "写一个荒诞故事：主人公有一种非凡的本领，夸张一件比一件大，事件按顺序发展，结尾解释自然或世界中某样东西的由来。",
    ),
    prerequisites: ["writing-a-narrative-paragraph", "showing-not-telling"],
    encompasses: [{ topic: "showing-not-telling", weight: 0.2 }],
    xp: 22,
    strand: "writing",
    criteria: ["g4-talltale-hero", "g4-talltale-exaggeration", "g35-narrative-sequence", "g4-talltale-ending"].map(criterion),
    knowledgePoints: [
      point(
        "a-hero-and-an-ending-that-explains",
        t("A Hero and an Ending That Explains", "主人公和解释由来的结尾"),
        t(
          "A **tall tale** begins with a hero who has one amazing power: *Swift Sally was born running.* It ends by explaining, playfully, how something in the world came to be: *That is why summer storms come in quick, patchy showers.* The power of the hero is what makes the ending happen.",
          "**荒诞故事**以一个拥有一种惊人本领的主人公开头：*Swift Sally was born running.* 结尾用风趣的方式解释世界上某样东西的由来：*That is why summer storms come in quick, patchy showers.* 正是主人公的本领带来了这个结尾。",
        ),
        writingGenerator(
          t(
            "Write a tall tale in English, with a hero who has one amazing power and an ending that explains something.",
            "用英语写一个荒诞故事，主人公有一种惊人的本领，结尾解释某样东西的由来。",
          ),
          taleBank,
          ["g4-talltale-hero", "g4-talltale-ending", "g35-narrative-sequence"],
          { minWords: 70, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "exaggeration-that-grows",
        t("Exaggeration That Grows", "越来越大的夸张"),
        t(
          "In a tall tale the exaggeration **grows**. Each feat is bigger than the one before: first the hero carries the groceries, then the whole market, then a ship over a mountain. Words such as *first*, *then*, *next* and *finally* keep the events in order as they climb toward the biggest feat of all.",
          "荒诞故事中的夸张是**越来越大**的。每件壮举都比前一件更大：主人公先是提起买的东西，然后扛起整个市场，接着把一艘船搬过山去。*first*、*then*、*next*、*finally* 这样的词让事件按顺序推进，一直推向最大的壮举。",
        ),
        writingGenerator(
          t(
            "Write a tall tale in English in which each feat is bigger than the one before.",
            "用英语写一个荒诞故事，每件壮举都比前一件更大。",
          ),
          taleGrowsBank,
          ["g4-talltale-exaggeration", "g35-narrative-sequence", "g4-talltale-hero"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
  {
    id: "writing-a-response-to-art",
    title: t("Writing a Response to a Work of Art", "写艺术作品赏析"),
    summary: t(
      "Write a paragraph about a painting or sculpture described in words: what it shows, in precise words, what you think of it, details of the work that support your opinion, and a closing.",
      "就一件用文字描述的绘画或雕塑写一个段落：用准确的词语写出它表现了什么，说出你的看法，用作品的细节支持你的观点，并写一个结尾。",
    ),
    prerequisites: ["writing-a-descriptive-paragraph", "writing-an-opinion-paragraph"],
    encompasses: [
      { topic: "writing-a-descriptive-paragraph", weight: 0.2 },
      { topic: "writing-an-opinion-paragraph", weight: 0.2 },
    ],
    xp: 22,
    strand: "writing",
    criteria: ["g35-describe-precise", "w4-states-opinion", "g4-art-details-support", "w4-concludes"].map(criterion),
    knowledgePoints: [
      point(
        "describing-a-work-and-your-view",
        t("Describing a Work and Your View", "描述作品和你的看法"),
        t(
          "A response to art does two things. It **describes** the work in precise words, *towering dark-green waves*, not just *big waves*. And it gives the writer's **opinion**: *I think it is a painting about courage.* It ends with a sentence that sums up what the work means to the writer.",
          "艺术作品赏析要做两件事：用准确的词语**描述**作品，写 *towering dark-green waves*，而不只是 *big waves*；并且说出写作者的**看法**：*I think it is a painting about courage.* 最后用一个句子总结这件作品对写作者的意义。",
        ),
        writingGenerator(
          t("Write a paragraph in English that responds to the work of art described below.", "用英语写一个段落，赏析下面描述的艺术作品。"),
          artBank,
          ["g35-describe-precise", "w4-states-opinion", "w4-concludes"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
      point(
        "details-that-support-your-view",
        t("Details That Support Your View", "支持看法的细节"),
        t(
          "An opinion about art is convincing when it points to the **work itself**. Do not only say *I like it*: say what in the work makes you think so. *The umbrella is tipped toward the smaller child, so the bigger child's shoulder is wet* explains why the sculpture is about kindness.",
          "对艺术作品的看法要有说服力，就要指向**作品本身**。不要只说 *I like it*，要说出作品中是什么让你这样想。*The umbrella is tipped toward the smaller child, so the bigger child's shoulder is wet* 说明了为什么这件雕塑表现的是善良。",
        ),
        writingGenerator(
          t(
            "Write a paragraph in English about the work of art described below, supporting your view with its details.",
            "用英语就下面描述的艺术作品写一个段落，用作品的细节支持你的看法。",
          ),
          artDetailsBank,
          ["g4-art-details-support", "w4-states-opinion", "w4-concludes"],
          { minWords: 60, maxChars: 2000 },
          onePiece,
        ),
      ),
    ],
  },
];
